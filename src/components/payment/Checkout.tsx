'use client';

import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

export interface CheckoutProps {
    clientKey: string;
    customerKey: string;
    amount: number;
    orderName: string;
    customerEmail?: string;
    customerName?: string;
    successUrl?: string;
    failUrl?: string;
}

export const Checkout = ({
    clientKey,
    customerKey,
    amount,
    orderName,
    customerEmail,
    customerName,
    successUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`,
    failUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/fail`,
}: CheckoutProps) => {
    const [payment, setPayment] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function initialize() {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const paymentInstance = tossPayments.payment({ customerKey });
                setPayment(paymentInstance);
                setIsReady(true);
            } catch (error) {
                console.error('Failed to load Toss Payments SDK', error);
            }
        }
        initialize();
    }, [clientKey, customerKey]);

    const handlePayment = async () => {
        if (!payment) return;

        try {
            // Append context information to successUrl so the backend receives it
            const separator = successUrl.includes('?') ? '&' : '?';
            const contextSuccessUrl = `${successUrl}${separator}amount=${amount}&orderName=${encodeURIComponent(orderName)}`;

            await payment.requestBillingAuth({
                method: "CARD",
                successUrl: contextSuccessUrl,
                failUrl,
                customerEmail,
                customerName,
            });
        } catch (error: any) {
            console.error('Billing auth request failed', error);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-col items-center justify-center p-4">
                <span className="material-symbols-outlined text-[64px] text-zinc-300 dark:text-zinc-700 mb-4 block">credit_card</span>
                <p>매월 자동 결제를 위해 결제 카드를 등록합니다.</p>
                <p className="text-sm mt-1">등록 시 <strong>{orderName} ({amount.toLocaleString()}원)</strong> 결제가 즉시 진행됩니다.</p>
            </div>

            <button
                onClick={handlePayment}
                disabled={!isReady}
                className="w-full mt-4 bg-primary hover:bg-primary/90 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200"
            >
                카드 등록 및 정기결제 시작
            </button>
        </div>
    );
};
