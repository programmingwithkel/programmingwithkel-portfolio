import { NextRequest, NextResponse } from 'next/server';
import { setTelegramWebhook } from '@/lib/telegram';

export async function GET(request: NextRequest) {
    // Determine the base URL from the request
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;

    const success = await setTelegramWebhook(webhookUrl);

    if (success) {
        return NextResponse.json({
            ok: true,
            message: `Webhook registered at: ${webhookUrl}`,
            nextStep: 'Message /start to your bot on Telegram to get your chat ID.',
        });
    } else {
        return NextResponse.json(
            { ok: false, message: 'Failed to set webhook. Check your TELEGRAM_BOT_TOKEN.' },
            { status: 500 }
        );
    }
}
