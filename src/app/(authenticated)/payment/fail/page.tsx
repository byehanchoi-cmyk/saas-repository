import React from 'react';
import Link from 'next/link';
import { updatePaymentStatus } from '@/app/actions/payment.actions';

export default async function PaymentFailPage({
    searchParams,
}: {
    searchParams: Promise<{ code: string; message: string; orderId: string }>;
}) {
    const { code, message, orderId } = await searchParams;

    // Record the fail reason based on Toss Payments callback
    // If user cancelled, Toss Payments sometimes routes to throw error instead, but sometimes hitting failure URL depending on integration
    const status = (code === 'PAY_PROCESS_CANCELED' || code === 'USER_CANCEL') ? 'CANCELED' : 'FAILED';
    await updatePaymentStatus(orderId, status, `[${code}] ${message}`);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
                <div>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg
                            className="h-8 w-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 dark:text-white">결제 실패 (테스트)</h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        결제를 처리하는 도중 문제가 발생했습니다.
                    </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 text-left space-y-3">
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">오류 메시지</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400 text-right ms-4">{message}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">오류 코드</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">주문번호</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-xs break-all max-w-[200px] text-right">{orderId}</span>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <Link
                        href="/payment/checkout"
                        className="w-full flex justify-center py-3 px-4 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
                    >
                        다시 시도
                    </Link>
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
