'use client';

import React, { useState } from 'react';

interface Transaction {
    id: string;
    order_id: string;
    order_name: string;
    amount: number;
    status: string;
    fail_reason?: string;
    created_at: string;
}

export function DeveloperDashboard({ transactions }: { transactions: Transaction[] }) {
    const [activeTab, setActiveTab] = useState('payments');

    const tabs = [
        { id: 'payments', label: '결제 내역 (Payments)', icon: 'receipt_long' },
        { id: 'keys', label: 'API 키 (API Keys)', icon: 'key' },
        { id: 'webhooks', label: '웹훅 (Webhooks)', icon: 'webhook' },
        { id: 'logs', label: 'API 로그 (API Logs)', icon: 'data_usage' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'payments':
                return (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary">receipt_long</span> 최근 결제 내역
                            </h2>
                            <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium">총 {transactions.length}건</span>
                        </div>
                        {transactions.length === 0 ? (
                            <div className="p-16 text-center text-slate-500">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">cancel_presentation</span>
                                <p className="text-lg font-medium">현재 기록된 결제 내역이 없습니다.</p>
                                <p className="text-sm mt-1">결제가 발생하면 이곳에 안전하게 기록됩니다.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-border-dark">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Order ID</th>
                                            <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">주문명</th>
                                            <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">금액</th>
                                            <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">상태</th>
                                            <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">결제일</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{tx.order_id}</td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{tx.order_name}</td>
                                                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">₩{tx.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${tx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        tx.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                    {tx.status === 'FAILED' && tx.fail_reason && (
                                                        <span className="block text-[10px] text-red-500 mt-1 truncate max-w-[150px]" title={tx.fail_reason}>
                                                            {tx.fail_reason}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-xs">
                                                    {new Date(tx.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'keys':
                return (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm rounded-2xl overflow-hidden p-6 md:p-10">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary">key</span> 내 API 키
                            </h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">이 키들을 사용하여 CloudNotes API에 액세스할 수 있습니다. 키가 유출되지 않도록 주의하세요.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">테스트 클라이언트 키 (Client Key)</label>
                                    <div className="flex relative">
                                        <input type="text" readOnly value="test_ck_mocked_value_for_sandbox" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-3 px-4 font-mono text-sm text-slate-600 dark:text-slate-400 focus:outline-none" />
                                        <button className="absolute right-2 top-2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800">
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">테스트 시크릿 키 (Secret Key)</label>
                                    <div className="flex relative">
                                        <input type="password" readOnly value="test_sk_mocked_value_for_sandbox" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-3 px-4 font-mono text-sm text-slate-600 dark:text-slate-400 focus:outline-none" />
                                        <button className="absolute right-10 top-2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button className="absolute right-2 top-2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800">
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">refresh</span> API 키 재발급
                            </button>
                        </div>
                    </div>
                );
            case 'webhooks':
                return (
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm rounded-2xl overflow-hidden flex flex-col items-center justify-center p-16 text-center">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary">webhook</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">웹훅(Webhooks) 연동</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            결제 성공, 실패, 취소 등의 이벤트가 발생할 때마다 알림을 받을 수 있는 이벤트 수신 웹훅 URL을 등록하세요.
                        </p>
                        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                            새 웹훅 추가하기
                        </button>
                    </div>
                );
            case 'logs':
                return (
                    <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span className="ml-4 text-xs font-mono text-slate-400">API 연동 실시간 로그</span>
                            </div>
                            <span className="text-xs font-mono text-primary animate-pulse">● Live</span>
                        </div>
                        <div className="p-6 font-mono text-sm h-96 overflow-y-auto text-slate-300 space-y-3">
                            <div className="flex gap-4">
                                <span className="text-slate-500">10:45:12</span>
                                <span className="text-emerald-400 font-bold">POST</span>
                                <span>/v1/billing/authorizations/issue</span>
                                <span className="text-emerald-400">200 OK</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-500">10:45:13</span>
                                <span className="text-emerald-400 font-bold">POST</span>
                                <span>/v1/billing/...</span>
                                <span className="text-emerald-400">200 OK</span>
                            </div>
                            <div className="flex gap-4 opacity-50">
                                <span className="text-slate-500">대기 중... (Waiting for incoming requests)</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm
                            ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                        `}
                    >
                        <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
