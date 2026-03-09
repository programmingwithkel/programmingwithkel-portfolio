import { NextRequest, NextResponse } from 'next/server';
import { addMessageToSession, getChatSession } from '@/lib/firebase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const message = body?.message;

        if (!message) {
            return NextResponse.json({ ok: true });
        }

        // Handle /start command
        if (message.text === '/start') {
            const chatId = message.chat.id;
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `✅ Your Chat ID is: \`${chatId}\`\n\nAdd this to your .env.local as:\nTELEGRAM_CHAT_ID=${chatId}`,
                    parse_mode: 'Markdown',
                }),
            });
            return NextResponse.json({ ok: true });
        }

        // Handle replies to forwarded portfolio messages
        const replyTo = message.reply_to_message;
        if (!replyTo?.text) {
            return NextResponse.json({ ok: true });
        }

        // Extract session ID from the original message
        const sessionIdMatch = replyTo.text.match(/Session: `([^`]+)`/)
            || replyTo.text.match(/Session: ([^\s\n]+)/);

        if (!sessionIdMatch) {
            await sendTelegram(message.chat.id, '⚠️ Could not find session. Reply directly to a portfolio message.');
            return NextResponse.json({ ok: true });
        }

        const sessionId = sessionIdMatch[1].trim();

        // Verify session exists
        const session = await getChatSession(sessionId);
        if (!session) {
            await sendTelegram(message.chat.id, '⚠️ Session expired or not found.');
            return NextResponse.json({ ok: true });
        }

        // Store Michael's reply — this sets mode to 'michael-active'
        await addMessageToSession(sessionId, message.text, false, 'michael');
        await sendTelegram(message.chat.id, '✅ Reply sent to visitor!');

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return NextResponse.json({ ok: true });
    }
}

async function sendTelegram(chatId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
}
