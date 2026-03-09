import { NextRequest, NextResponse } from 'next/server';
import { createChatSession, getChatSession, addMessageToSession } from '@/lib/firebase';
import { sendToTelegram } from '@/lib/telegram';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;



//rate limiter to protect api key usage limit
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;
const rateLimitMap = new Map<string, number[]>();

setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimitMap.entries()) {
        const valid = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
        if (valid.length === 0) rateLimitMap.delete(key);
        else rateLimitMap.set(key, valid);
    }
}, 5 * 60 * 1000);

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const valid = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
    if (valid.length >= RATE_LIMIT) {
        const retryAfter = Math.ceil((valid[0] + RATE_WINDOW_MS - now) / 1000);
        return { limited: true, retryAfter };
    }
    valid.push(now);
    rateLimitMap.set(ip, valid);
    return { limited: false, retryAfter: 0 };
}

const SYSTEM_INSTRUCTION = process.env.GEMINI_SYSTEM_INSTRUCTION || '';

export { SYSTEM_INSTRUCTION, GEMINI_URL };

interface ChatMessage {
    text: string;
    isUser: boolean;
}

function generateSessionId(): string {
    return `s_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

async function getGeminiReply(messages: ChatMessage[]): Promise<string> {
    const contents = messages.map((msg) => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

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

    if (!response.ok) throw new Error('Gemini API error');
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Try again! 😊";
}

export async function POST(request: NextRequest) {
    try {
        // Rate limit
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip') || 'unknown';
        const { limited, retryAfter } = isRateLimited(ip);
        if (limited) {
            return NextResponse.json(
                { reply: 'Whoa, slow down! 😅 Please wait ' + retryAfter + ' seconds.', mode: 'gemini' },
                { status: 429, headers: { 'Retry-After': String(retryAfter) } }
            );
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { messages, sessionId: existingSessionId } = body as { messages: ChatMessage[]; sessionId?: string };

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const latestMessage = messages[messages.length - 1];
        if (!latestMessage?.isUser) {
            return NextResponse.json({ error: 'No user message found' }, { status: 400 });
        }

        const sessionId = existingSessionId || generateSessionId();
        const hasTelegram = process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID;

        let session = existingSessionId ? await getChatSession(existingSessionId) : null;
        const isMichaelActive = session?.mode === 'michael-active';


        if (hasTelegram) {
            try {
                if (session) {
                    await addMessageToSession(sessionId, latestMessage.text, true, 'visitor');
                } else {
                    await createChatSession(sessionId, latestMessage.text);
                }


                sendToTelegram(latestMessage.text, sessionId).catch(err =>
                    console.error('Telegram send failed:', err)
                );
            } catch (err) {
                console.error('Firebase error:', err);
            }
        }

        if (isMichaelActive) {

            return NextResponse.json({
                sessionId,
                mode: 'michael',
                reply: null,
                status: 'waiting',
            });
        }


        try {
            const reply = await getGeminiReply(messages);


            if (hasTelegram) {
                addMessageToSession(sessionId, reply, false, 'gemini').catch(err =>
                    console.error('Firebase store error:', err)
                );
            }

            return NextResponse.json({
                sessionId,
                mode: 'gemini',
                reply,
                status: 'replied',
            });
        } catch {
            return NextResponse.json(
                { error: 'Failed to get response from AI' },
                { status: 502 }
            );
        }
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
