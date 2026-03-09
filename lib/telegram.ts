const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;


let lastUpdateId = 0;

export async function sendToTelegram(text: string, sessionId: string): Promise<number | null> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram not configured — missing BOT_TOKEN or CHAT_ID');
        return null;
    }

    try {
        const message = `💬 *New message from your portfolio:*\n\n${escapeMarkdown(text)}\n\n_Session: \`${sessionId}\`_\n_Reply to this message to respond directly\\!_`;

        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'MarkdownV2',
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Telegram sendMessage error:', err);
            return null;
        }

        const data = await response.json();
        return data.result?.message_id || null;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return null;
    }
}

export interface TelegramReply {
    sessionId: string;
    text: string;
}

export async function checkTelegramReplies(): Promise<TelegramReply[]> {
    if (!TELEGRAM_BOT_TOKEN) return [];

    try {
        const url = `${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=0`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error('getUpdates failed:', response.status);
            return [];
        }

        const data = await response.json();
        if (!data.ok || !data.result?.length) return [];

        console.log(`[Telegram] Got ${data.result.length} updates`);

        const replies: TelegramReply[] = [];

        for (const update of data.result) {

            lastUpdateId = update.update_id;

            const message = update.message;
            if (!message?.text || !message.reply_to_message?.text) {
                console.log(`[Telegram] Update ${update.update_id}: skipping (no reply_to or text)`);
                continue;
            }


            if (String(message.chat.id) !== TELEGRAM_CHAT_ID) {
                console.log(`[Telegram] Update ${update.update_id}: wrong chat ${message.chat.id}`);
                continue;
            }


            const replyToText = message.reply_to_message.text;
            console.log(`[Telegram] ReplyTo text: "${replyToText.substring(0, 100)}..."`);


            const sessionIdMatch = replyToText.match(/Session:\s*`?([s_][^\s`\n]+)`?/)
                || replyToText.match(/Session:\s+(\S+)/);

            if (sessionIdMatch) {
                const sid = sessionIdMatch[1].trim();
                console.log(`[Telegram] Found reply for session ${sid}: "${message.text}"`);
                replies.push({
                    sessionId: sid,
                    text: message.text,
                });
            } else {
                console.log(`[Telegram] Could not extract session ID from message`);
            }
        }

        return replies;
    } catch (error) {
        console.error('Error checking Telegram updates:', error);
        return [];
    }
}

export async function setTelegramWebhook(webhookUrl: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Missing TELEGRAM_BOT_TOKEN');
        return false;
    }

    try {
        const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['message'],
            }),
        });

        const data = await response.json();
        console.log('Telegram webhook set:', data);
        return data.ok === true;
    } catch (error) {
        console.error('Failed to set webhook:', error);
        return false;
    }
}

function escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}
