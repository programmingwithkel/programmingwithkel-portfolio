import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
        if (!accessKey) {
            return NextResponse.json(
                { success: false, message: 'Server configuration error: missing API key.' },
                { status: 500 }
            );
        }

        // Use FormData approach which is more reliable with Web3Forms
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);

        const web3Response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const responseText = await web3Response.text();
        console.log('[Contact API] Raw response:', responseText.substring(0, 500));

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error('[Contact API] Non-JSON response:', responseText.substring(0, 200));
            return NextResponse.json(
                { success: false, message: 'Web3Forms returned an invalid response. The service may be temporarily unavailable.' },
                { status: 502 }
            );
        }

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Message sent successfully!' });
        } else {
            return NextResponse.json(
                { success: false, message: result.message || 'Failed to send message.' },
                { status: 400 }
            );
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[Contact API] Error:', errorMessage);
        return NextResponse.json(
            { success: false, message: `Server error: ${errorMessage}` },
            { status: 500 }
        );
    }
}
