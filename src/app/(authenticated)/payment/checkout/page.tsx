import React from 'react';
import { Checkout } from '@/components/payment/Checkout';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/auth/login'); // fallback just in case middleware is bypassed
    }

    const { data: dbUser } = await supabase.from('users').select('billing_plan').eq('id', user.id).single();
    if (dbUser?.billing_plan === 'Pro') {
        redirect('/settings');
    }

    // Default to test keys for API individual integration
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
    const customerKey = user.id; // Use real user ID as customerKey

    // In a real app, you might fetch selected plan amount from URL or DB
    const amount = 14400; // $12/month equivalent in KRW maybe? Let's just use 14400 for test
    const orderName = "Pro Plan 1개월 정기구독";

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
                    결제하기
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    안전하고 간편하게 결제를 진행해주세요.
                </p>
            </div>

            <Checkout
                clientKey={clientKey}
                customerKey={customerKey}
                amount={amount}
                orderName={orderName}
                customerEmail={user.email}
                customerName={user.user_metadata?.full_name || 'CloudNotes 고객'}
            />
        </div>
    );
}
