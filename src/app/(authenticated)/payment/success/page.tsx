import React from 'react';
import Link from 'next/link';
import { registerBillingAndPay } from '@/app/actions/payment.actions';

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ customerKey: string; authKey: string; amount: string; orderName: string; }>;
}) {
    const { customerKey, authKey, amount, orderName } = await searchParams;
    let confirmResult: any = { success: false, message: 'Invalid payment parameters' };

    if (customerKey && authKey && amount && orderName) {
        confirmResult = await registerBillingAndPay(customerKey, authKey, orderName, Number(amount));
    }

    const displayOrderId = confirmResult.data?.orderId || 'N/A';
    const displayPaymentKey = confirmResult.data?.paymentKey || 'N/A';

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                {confirmResult.success ? (
                    <div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                            <svg
                                className="h-8 w-8 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 dark:text-white">결제 성공!</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            프로 플랜 구독이 시작되었습니다. (매월 자동 갱신됩니다.)
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <svg
                                className="h-8 w-8 text-orange-600 dark:text-orange-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 dark:text-white">결제 실패</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            {confirmResult.message}
                        </p>
                    </div>
                )}

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 text-left space-y-3">
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">주문번호</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{displayOrderId}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">결제금액</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{Number(amount).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">paymentKey</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-xs break-all max-w-[200px] text-right">{displayPaymentKey}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        대시보드로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
