import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function PricingSection() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user

    return (
        <div className="w-full py-20 px-4 max-w-7xl mx-auto" id="pricing">
            <div className="text-center mb-16">
                <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                <p className="text-slate-600 dark:text-slate-400">Start for free, upgrade as you grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Free Tier */}
                <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">$0</span>
                            <span className="text-slate-500 font-medium">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Perfect for getting started.</p>
                    </div>
                    <Link
                        href={isAuthenticated ? "/dashboard" : "/auth"}
                        className="flex items-center justify-center w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary dark:hover:text-primary text-slate-700 dark:text-white font-bold text-sm transition-colors mb-6"
                    >
                        {isAuthenticated ? "My Dashboard" : "Sign Up Free"}
                    </Link>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Unlimited Notes
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Sync 2 Devices
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Basic Search
                        </li>
                    </ul>
                </div>
                {/* Pro Tier */}
                <div className="relative flex flex-col p-6 rounded-2xl bg-white dark:bg-surface-dark border-2 border-primary shadow-xl shadow-primary/10 z-10 scale-105 md:scale-110 origin-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Most Popular
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-primary">Pro</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">$8</span>
                            <span className="text-slate-500 font-medium">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">For power users and creators.</p>
                    </div>
                    <Link
                        href={isAuthenticated ? "/settings" : "/auth"}
                        className="flex items-center justify-center w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-colors mb-6 shadow-md shadow-primary/20"
                    >
                        {isAuthenticated ? "Upgrade Now" : "Start 14-Day Trial"}
                    </Link>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Unlimited Devices
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            AI Search &amp; Summaries
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            50GB Uploads
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Version History
                        </li>
                    </ul>
                </div>
                {/* Team Tier */}
                <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">$15</span>
                            <span className="text-slate-500 font-medium">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Collaboration for small teams.</p>
                    </div>
                    <button className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary dark:hover:text-primary text-slate-700 dark:text-white font-bold text-sm transition-colors mb-6">
                        Contact Sales
                    </button>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Shared Workspaces
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Admin Controls
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            SSO Integration
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Priority Support
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
