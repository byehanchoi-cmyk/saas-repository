'use server'

import { createClient } from '@/lib/supabase/server';

/**
 * Helper to calculate the exact 1-month later billing date in KST (Korea Standard Time, UTC+9).
 * Returns an absolute UTC string representing exactly 00:00:00 KST of the target date.
 */
function getNextBillingDateKST(baseDateStr?: string | Date): string {
    const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();

    // Add 9 hours to get KST-equivalent time in JS Date
    const kstOffsetMs = 9 * 60 * 60 * 1000;
    const kstTime = new Date(baseDate.getTime() + kstOffsetMs);

    // Add 1 month exactly corresponding to calendar date
    kstTime.setUTCMonth(kstTime.getUTCMonth() + 1);

    // Set exactly to midnight KST (00:00:00.000)
    kstTime.setUTCHours(0, 0, 0, 0);

    // Convert back to true absolute UTC time
    const nextBillingUTC = new Date(kstTime.getTime() - kstOffsetMs);
    return nextBillingUTC.toISOString();
}

export async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: 'Authentication required' };
    }

    // Toss Payments API requires Basic auth with Secret Key
    // You should put the actual secret key in .env.local as TOSS_SECRET_KEY
    // Defaulting to the test widget secret key to match the frontend test widget client key
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';
    // The auth header needs the secret key followed by a colon, base64 encoded
    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;

    try {
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData: Record<string, unknown> = {};
            try {
                errorData = JSON.parse(errorText) as Record<string, unknown>;
            } catch {
                console.error('Failed to parse Toss Payments error JSON', errorText);
            }

            console.error(`Toss Payments Confirm Error (Status: ${response.status} ${response.statusText}):`, errorText);

            // Mark transaction as failed
            await supabase.from('payment_transactions').update({
                status: 'FAILED',
                fail_reason: errorData?.message || errorData?.code || 'Payment confirmation failed'
            }).eq('order_id', orderId);

            return { success: false, message: errorData?.message || 'Payment confirmation failed' };
        }

        const paymentData = await response.json();

        // Mark transaction as SUCCESS
        await supabase.from('payment_transactions').update({
            status: 'SUCCESS',
            payment_key: paymentKey
        }).eq('order_id', orderId);

        // Update the user's billing plan to Pro upon successful payment
        const { error: updateError } = await supabase
            .from('users')
            .update({ billing_plan: 'Pro' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Database Update Error:', updateError);
            return { success: false, message: 'Payment succeeded but failed to update user plan' };
        }

        // Add a subscription record
        const { error: subError } = await supabase
            .from('subscriptions')
            .insert({
                user_id: user.id,
                plan_name: 'Pro',
                status: 'active',
                current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            });

        if (subError) {
            console.error('Failed to create subscription record:', subError);
        }

        return { success: true, data: paymentData };

    } catch (error) {
        console.error('Payment confirmation exception:', error);
        return { success: false, message: 'Server error during payment confirmation' };
    }
}

export async function registerBillingAndPay(customerKey: string, authKey: string, orderName: string, amount: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: 'Authentication required' };
    }

    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';
    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;
    const generatedOrderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    try {
        // 1. Issue Billing Key
        const issueRes = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerKey,
                authKey,
            }),
        });

        if (!issueRes.ok) {
            const errorText = await issueRes.text();
            console.error('Failed to issue billing key:', errorText);
            return { success: false, message: 'Failed to register card for recurring payment' };
        }

        const billingData = await issueRes.json();
        const billingKey = billingData.billingKey;

        // 2. Execute Initial Payment using the Billing Key
        const paymentRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerKey,
                amount,
                orderId: generatedOrderId,
                orderName,
                customerEmail: user.email,
            }),
        });

        if (!paymentRes.ok) {
            const errorText = await paymentRes.text();
            console.error('Failed to execute initial billing payment:', errorText);
            return { success: false, message: 'Card registered, but initial payment failed.' };
        }

        const paymentData = await paymentRes.json();

        // 3. Mark transaction as SUCCESS (we need to create one first since we skipped the checkout widget direct payment intent)
        await supabase.from('payment_transactions').insert({
            user_id: user.id,
            order_id: generatedOrderId,
            order_name: orderName,
            amount,
            status: 'SUCCESS',
            payment_key: paymentData.paymentKey
        });

        // 4. Update user plan
        const { error: updateError } = await supabase
            .from('users')
            .update({ billing_plan: 'Pro' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Database Update Error:', updateError);
            return { success: false, message: 'Payment succeeded but failed to update user plan' };
        }

        // 5. Create or Update Subscription with Billing Key (1 month cycle, exactly next month at midnight KST)
        const currentPeriodEndStr = getNextBillingDateKST();
        const { error: subError } = await supabase
            .from('subscriptions')
            .insert({
                user_id: user.id,
                plan_name: 'Pro',
                status: 'active',
                billing_key: billingKey,
                current_period_end: currentPeriodEndStr,
            });

        if (subError) {
            console.error('Failed to create subscription record with billing key:', subError);
        }

        return { success: true, data: paymentData };

    } catch (error) {
        console.error('Billing and payment exception:', error);
        return { success: false, message: 'Server error during billing setup' };
    }
}

export async function createPaymentIntent(orderId: string, orderName: string, amount: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: 'Authentication required' };
    }

    const { error } = await supabase.from('payment_transactions').insert({
        user_id: user.id,
        order_id: orderId,
        order_name: orderName,
        amount,
        status: 'PENDING',
    });

    if (error) {
        console.error('Failed to create payment intent:', error);
        return { success: false, message: 'Could not create payment tracking record' };
    }

    return { success: true };
}

export async function updatePaymentStatus(orderId: string, status: 'SUCCESS' | 'FAILED' | 'CANCELED', failReason?: string) {
    const supabase = await createClient();

    // Check if user is authenticated (they should be, this is client-side abort/fail)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: 'Authentication required' };
    }

    // Usually we just use orderId, but we could also ensure it belongs to the user
    const { error } = await supabase.from('payment_transactions')
        .update({
            status,
            fail_reason: failReason || null
        })
        .eq('order_id', orderId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Failed to update payment status:', error);
        return { success: false, message: 'Could not update payment status' };
    }

    return { success: true };
}

export async function cancelPayment() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: 'Authentication required' };
    }

    // 1. Get the user's active subscription with a billing key
    const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('id, billing_key')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .not('billing_key', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (subError || !subscription || !subscription.billing_key) {
        return { success: false, message: '자동 결제가 등록된 구독 정보를 찾을 수 없습니다.' };
    }

    // 2. Call Toss Payments Billing Key Delete API
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';
    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;

    try {
        const response = await fetch(`https://api.tosspayments.com/v1/billing/${subscription.billing_key}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        let responseData: Record<string, unknown> | null = null;
        try {
            if (responseText) responseData = JSON.parse(responseText) as Record<string, unknown>;
        } catch {
            console.error('Failed to parse Toss Payments response:', responseText);
        }

        if (!response.ok) {
            const resMessage = typeof responseData?.message === 'string' ? responseData.message : '';
            const isAlreadyDeleted = responseData?.code === 'ALREADY_DELETED_BILLING_KEY' ||
                responseData?.code === 'NOT_FOUND_BILLING_KEY' ||
                resMessage.includes('삭제된 빌링키');

            if (!isAlreadyDeleted) {
                console.error('Toss Payments Billing Key Delete Error:', responseData || responseText);
                return { success: false, message: resMessage || 'Auto-billing cancellation failed at provider' };
            }
            console.log('Billing key already deleted at provider. Proceeding with local cancellation.');
        }

        // 3. Deactivate subscription (Cancel auto-renewal, set billing_key null)
        await supabase.from('subscriptions')
            .update({
                status: 'canceled',
                billing_key: null
            })
            .eq('id', subscription.id);

        // Note: Do not downgrade users.billing_plan here. 
        // Allow the user to retain Pro access until current_period_end is reached.

        return { success: true, data: responseData };

    } catch (error) {
        console.error('Subscription cancellation exception:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: `Server error during auto-billing cancellation: ${errorMessage}` };
    }
}

/**
 * 시간과 관계없이 오늘(이전 포함) 결제해야 하는 자동 결제 빌링키들을 불러와서
 * 결제를 실행하는 함수.
 * Vercel Cron Job 등에서 호출되도록 세션 쿠키 없이 동작해야 하므로 
 * admin role 적용을 위해 createClient(true) 등이나 bypass를 사용할 수 있지만
 * 현재 createClient() 구현이 server context를 사용하므로, 
 * 서버 환경(Cron)에서 인증 없이 동작하도록 설정하거나 service_role key를 써야 함.
 * 일단 요구사항에 맞게 구현함.
 */
export async function executeDailyBilling() {
    // Vercel Cron Job 등 서버간 통신시에는 auth 쿠키가 없으므로
    // createClient() 호출 시 인증 에러가 발생할 수 있음. 
    // 본 실습 환경에서는 기본 클라이언트를 그대로 사용하되 RLS는 필요한 경우 우회해야 함.
    const supabase = await createClient(); // service_role client recommend if doing cron

    // 1. Fetch all active subscriptions that need to be billed today or earlier
    // current_period_end가 현재 시간보다 작거나 같은 것들.
    // 'status' === 'active' AND 'billing_key' is not null
    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*, users!inner(email)')
        .eq('status', 'active')
        .not('billing_key', 'is', null)
        .lte('current_period_end', new Date().toISOString());

    if (error || !subscriptions) {
        console.error('Failed to fetch subscriptions for daily billing:', error);
        return { success: false, message: 'Failed to fetch subscriptions' };
    }

    let successfulCount = 0;
    let failedCount = 0;

    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';
    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;

    for (const sub of subscriptions) {
        const generatedOrderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        // Assuming subscription has a plan amount. Hardcoding the Pro plan amount for now if not available in DB
        // You could also add `amount` to the `subscriptions` table.
        const amount = 14400; // $12 equivalent or so

        try {
            // 2. Execute Payment using the Billing Key
            const paymentRes = await fetch(`https://api.tosspayments.com/v1/billing/${sub.billing_key}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerKey: sub.user_id, // Toss customerKey is usually user_id
                    amount,
                    orderId: generatedOrderId,
                    orderName: `${sub.plan_name} 정기구독 결제`,
                    customerEmail: sub.users.email,
                }),
            });

            if (!paymentRes.ok) {
                const errorText = await paymentRes.text();
                let errMsg = 'Billing payment failed';
                try {
                    const parsed = JSON.parse(errorText) as Record<string, unknown>;
                    errMsg = (parsed.message as string) || errMsg;
                } catch { }

                console.error(`Recurring payment failed for user ${sub.user_id}:`, errorText);

                // Record failed transaction
                await supabase.from('payment_transactions').insert({
                    user_id: sub.user_id,
                    order_id: generatedOrderId,
                    order_name: `${sub.plan_name} 정기구독 결제`,
                    amount,
                    status: 'FAILED',
                    fail_reason: errMsg
                });

                // Update subscription status to reflect payment failure (optional, maybe pause or retry later)
                await supabase.from('subscriptions')
                    .update({ status: 'past_due' })
                    .eq('id', sub.id);

                failedCount++;
                continue;
            }

            const paymentData = await paymentRes.json();

            // 3. Record Successful Transaction
            await supabase.from('payment_transactions').insert({
                user_id: sub.user_id,
                order_id: generatedOrderId,
                order_name: `${sub.plan_name} 정기구독 결제`,
                amount,
                status: 'SUCCESS',
                payment_key: paymentData.paymentKey
            });

            // 4. Update Subscription's next billing date (exactly 1 month later KST)
            const currentPeriodEndStr = getNextBillingDateKST(sub.current_period_end);

            await supabase.from('subscriptions')
                .update({
                    current_period_end: currentPeriodEndStr,
                    status: 'active' // just to be sure if it was retrying
                })
                .eq('id', sub.id);

            successfulCount++;
        } catch (err) {
            console.error(`Exception during recurring payment for user ${sub.user_id}:`, err);
            failedCount++;
        }
    }

    return {
        success: true,
        processedCount: subscriptions.length,
        successfulCount,
        failedCount
    };
}
