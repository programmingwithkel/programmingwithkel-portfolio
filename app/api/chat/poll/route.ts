import { NextRequest, NextResponse } from 'next/server';
import { getChatSession, addMessageToSession, setGeminiActive } from '@/lib/firebase';
import { checkTelegramReplies } from '@/lib/telegram';
import { SYSTEM_INSTRUCTION, GEMINI_URL } from '@/app/api/chat/route';


const MICHAEL_TIMEOUT_MS = 30 * 1000;

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('sessionId');
        const lastSeenStr = request.nextUrl.searchParams.get('lastSeen');
        const lastSeen = lastSeenStr ? parseInt(lastSeenStr) : 0;

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // pull a reply from telegram
        try {
            const telegramReplies = await checkTelegramReplies();
            for (const reply of telegramReplies) {
                await addMessageToSession(reply.sessionId, reply.text, false, 'michael');
            }
        } catch (err) {
            console.error('Telegram poll error:', err);
        }


        const session = await getChatSession(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }


        const newMichaelMessages = session.messages.filter(m =>
            m.source === 'michael' && m.timestamp > lastSeen
        );

        if (newMichaelMessages.length > 0) {

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

        if (session.mode === 'michael-active') {

            const lastVisitorMsg = [...session.messages].reverse().find(m => m.source === 'visitor');
            if (!lastVisitorMsg) {

                return NextResponse.json({ status: 'no-update', mode: session.mode });
            }

            const michaelRepliedAfterVisitor = session.messages.some(m =>
                m.source === 'michael' && m.timestamp > lastVisitorMsg.timestamp
            );

            if (michaelRepliedAfterVisitor) {

                return NextResponse.json({ status: 'no-update', mode: 'michael' });
            }


            const elapsed = Date.now() - lastVisitorMsg.timestamp;

            if (elapsed >= MICHAEL_TIMEOUT_MS) {

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


            const remaining = Math.ceil((MICHAEL_TIMEOUT_MS - elapsed) / 1000);
            return NextResponse.json({
                status: 'waiting',
                remainingSeconds: remaining,
                mode: 'michael',
            });
        }


        return NextResponse.json({ status: 'no-update', mode: session.mode });
    } catch (error) {
        console.error('Poll error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
