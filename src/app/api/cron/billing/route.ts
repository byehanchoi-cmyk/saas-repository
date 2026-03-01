import { NextRequest, NextResponse } from 'next/server';
import { executeDailyBilling } from '@/app/actions/payment.actions';

export async function GET(request: NextRequest) {
    // In local development or for testing, we bypass the CRON_SECRET check entirely
    // so you can simply visit this URL in the browser.
    // Uncomment the following lines in production to secure the endpoint:
    /*
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: 'Unauthorized. You must provide a valid Authorization: Bearer <CRON_SECRET> header.' },
            { status: 401 }
        );
    }
    */

    try {
        const result = await executeDailyBilling();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to execute daily billing via cron:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
