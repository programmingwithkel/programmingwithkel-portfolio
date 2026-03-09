import { NextRequest, NextResponse } from 'next/server';
import { getChatSession, addMessageToSession, setGeminiActive } from '@/lib/firebase';
import { checkTelegramReplies } from '@/lib/telegram';
import { SYSTEM_INSTRUCTION, GEMINI_URL } from '@/app/api/chat/route';

// 30 second timeout for Michael to reply
const MICHAEL_TIMEOUT_MS = 30 * 1000;

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('sessionId');
        const lastSeenStr = request.nextUrl.searchParams.get('lastSeen');
        const lastSeen = lastSeenStr ? parseInt(lastSeenStr) : 0;

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // Pull any new replies from Telegram
        try {
            const telegramReplies = await checkTelegramReplies();
            for (const reply of telegramReplies) {
                await addMessageToSession(reply.sessionId, reply.text, false, 'michael');
            }
        } catch (err) {
            console.error('Telegram poll error:', err);
        }

        // Get fresh session data (after processing telegram replies)
        const session = await getChatSession(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Find ALL new Michael messages since lastSeen timestamp
        const newMichaelMessages = session.messages.filter(m =>
            m.source === 'michael' && m.timestamp > lastSeen
        );

        if (newMichaelMessages.length > 0) {
            // Michael replied — return his messages, NO Gemini needed
            return NextResponse.json({
                status: 'new-messages',
                messages: newMichaelMessages.map(m => ({
                    text: m.text,
                    timestamp: m.timestamp,
                    source: 'michael',
                })),
                mode: 'michael',
            });
        }

        // Check if we're waiting for Michael's reply (michael-active mode)
        if (session.mode === 'michael-active') {
            // Find the last VISITOR message (Gemini should only reply to visitors)
            const lastVisitorMsg = [...session.messages].reverse().find(m => m.source === 'visitor');
            if (!lastVisitorMsg) {
                // No visitor message to reply to
                return NextResponse.json({ status: 'no-update', mode: session.mode });
            }

            // Check if Michael already replied AFTER the last visitor message
            const michaelRepliedAfterVisitor = session.messages.some(m =>
                m.source === 'michael' && m.timestamp > lastVisitorMsg.timestamp
            );

            if (michaelRepliedAfterVisitor) {
                // Michael already handled this — don't trigger Gemini
                return NextResponse.json({ status: 'no-update', mode: 'michael' });
            }

            // Calculate timeout from the last visitor message
            const elapsed = Date.now() - lastVisitorMsg.timestamp;

            if (elapsed >= MICHAEL_TIMEOUT_MS) {
                // Michael didn't reply in 30s → Gemini takes over
                // Build prompt from ONLY visitor messages as "user" role
                // and gemini messages as "model" role (skip michael messages)
                const contents = session.messages
                    .filter(msg => msg.source === 'visitor' || msg.source === 'gemini')
                    .map(msg => ({
                        role: msg.source === 'visitor' ? 'user' : 'model',
                        parts: [{ text: msg.text }],
                    }));

                try {
                    const response = await fetch(GEMINI_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                            contents,
                            generationConfig: { temperature: 0.8, topP: 0.95, topK: 40, maxOutputTokens: 512 },
                            safetySettings: [
                                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                            ],
                        }),
                    });

                    if (response.status === 429) {
                        // Rate limited — wait and retry next poll
                        console.warn('Gemini rate limited during fallback, will retry next poll');
                        return NextResponse.json({
                            status: 'waiting',
                            remainingSeconds: 0,
                            mode: 'michael',
                        });
                    }

                    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
                    const data = await response.json();
                    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
                        || "Sorry, I'm not available right now. Email me at asismichael143@gmail.com! 😊";

                    await addMessageToSession(sessionId, reply, false, 'gemini');
                    await setGeminiActive(sessionId);

                    return NextResponse.json({
                        status: 'new-messages',
                        messages: [{ text: reply, timestamp: Date.now(), source: 'gemini' }],
                        mode: 'gemini',
                    });
                } catch (error) {
                    console.error('Gemini fallback error:', error);
                    const fallback = "Sorry, I'm busy right now. Email me at asismichael143@gmail.com! 😊";
                    await addMessageToSession(sessionId, fallback, false, 'gemini');
                    await setGeminiActive(sessionId);
                    return NextResponse.json({
                        status: 'new-messages',
                        messages: [{ text: fallback, timestamp: Date.now(), source: 'gemini' }],
                        mode: 'gemini',
                    });
                }
            }

            // Still waiting for Michael
            const remaining = Math.ceil((MICHAEL_TIMEOUT_MS - elapsed) / 1000);
            return NextResponse.json({
                status: 'waiting',
                remainingSeconds: remaining,
                mode: 'michael',
            });
        }

        // Not in michael-active mode, no new messages
        return NextResponse.json({ status: 'no-update', mode: session.mode });
    } catch (error) {
        console.error('Poll error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
