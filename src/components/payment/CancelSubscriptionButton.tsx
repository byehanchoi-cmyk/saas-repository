'use client';

import { useState } from 'react';
import { cancelPayment } from '@/app/actions/payment.actions';

export function CancelSubscriptionButton() {
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleCancel = async () => {
        setShowDialog(false);
        setLoading(true);
        try {
            const res = await cancelPayment();
            if (res.success) {
                alert('구독이 자동결제 해지되었습니다.\\n다음 결제일 전까진 Pro 권한이 유지됩니다.');
                window.location.reload();
            } else {
                alert('취소에 실패했습니다: ' + res.message);
            }
        } catch {
            alert('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowDialog(true)}
                disabled={loading}
                className="relative z-10 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/10 hover:shadow-2xl hover:-translate-y-0.5 font-bold rounded-lg transition-all text-sm disabled:opacity-50"
            >
                {loading ? '처리 중...' : 'Cancel Subscription'}
            </button>

            {showDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-3 text-red-500">구독 취소</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                            정말로 구독을 취소하시겠습니까?<br />
                            <br />
                            취소하셔도 <strong className="text-gray-900 dark:text-white">다음 결제일 전까지는 Pro 권한을 그대로 유지</strong>하실 수 있으며, 더 이상 자동 결제가 진행되지 않습니다.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDialog(false)}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                돌아가기
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg disabled:opacity-50"
                            >
                                취소 확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
