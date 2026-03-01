import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CancelSubscriptionButton } from '@/components/payment/CancelSubscriptionButton'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch actual billing plan
    let isPro = false;
    let isCanceledPro = false;
    let currentPeriodEnd = '';

    if (user?.id) {
        const { data: dbUser } = await supabase.from('users').select('billing_plan').eq('id', user.id).single()
        isPro = dbUser?.billing_plan === 'Pro'

        if (isPro) {
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('status, current_period_end')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (subscription?.status === 'canceled') {
                isCanceledPro = true;
                if (subscription.current_period_end) {
                    currentPeriodEnd = new Date(subscription.current_period_end).toLocaleDateString('ko-KR');
                }
            }
        }
    }

    // Default mock data if unavailable 
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'password123test'
    const email = user?.email || 'test@example.com'
    const avatarUrl = user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuC9eKKzjjp7B0qU-MR7xC4BKrv3dSVZyzyulcJwE0uejIevFriWl6LnpO8t7i3LaiBMfYKcA2j4cmtLkt4G7Tb4R4P8iVu1CMhvbQ00QQChPHMDDjxiZOIaukVF936K-5MrRu5KyU7Uu8tvW2GgQ2whdRfqtheo2bC2R5eY7p3vzXtgch6Mxitdo_7S3sjoKL1kpalxSjnwmvgtiKUPRhskU4YzDbrfXEpYnRxyHhREUpyyLDW8BrCAHQXkRWRhVoqTKFA0e70ZKaVl"

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Settings Navigation Menu */}
                <div className="col-span-1 border-r border-slate-200 dark:border-border-dark pr-6 hidden md:block">
                    <nav className="flex flex-col gap-2">
                        <Link href="/settings" className="px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors cursor-pointer w-full flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">person</span> Profile
                        </Link>
                        <button className="text-left px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark font-medium transition-colors cursor-pointer w-full flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">lock</span> Security
                        </button>
                        <Link href="/developer" className="px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark font-medium transition-colors cursor-pointer w-full flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">developer_mode</span> API & Billing
                        </Link>
                        <button className="text-left px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark font-medium transition-colors cursor-pointer w-full flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">notifications</span> Notifications
                        </button>
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-8">

                    {/* User Profile Info Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">id_card</span> Public Profile
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative size-24 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-border-dark">
                                    <Image
                                        src={avatarUrl}
                                        alt="Avatar"
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>
                                <Button variant="secondary" size="sm" className="rounded-full">
                                    Change Avatar
                                </Button>
                            </div>

                            <div className="flex-1 flex flex-col gap-4 w-full">
                                <Input
                                    label="Display Name"
                                    type="text"
                                    defaultValue={displayName}
                                    className="bg-slate-50 dark:bg-background-dark"
                                />
                                <Input
                                    label="Email Address (Read only)"
                                    type="email"
                                    disabled
                                    defaultValue={email}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-border-dark">
                            <Button>
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Billing Tier / Stats Card */}
                    <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-primary to-purple-600">
                        <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark h-full flex flex-col justify-between items-start w-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-9xl text-primary">workspace_premium</span>
                            </div>
                            <div className="relative z-10 w-full">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block ${isPro ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                    Current Plan
                                </span>
                                <h3 className="text-2xl font-bold mb-2">
                                    {isPro ? 'Pro Subscription' : 'Personal (Free)'}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                                    {isCanceledPro
                                        ? `자동 결제가 해지되었습니다. ${currentPeriodEnd}까지 Pro 권한이 유지됩니다.`
                                        : isPro
                                            ? 'You are enjoying all Pro features including AI usage, infinite storage, and team sharing. Thank you for your support!'
                                            : 'You are currently using the limited free plan. Upgrade to unlock AI features, more storage, and team collaborations.'}
                                </p>

                                <div className="flex flex-col gap-2 mb-6 w-full max-w-md">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        <span>Storage Used</span>
                                        <span>{isPro ? 'Unlimited (0.2 GB used)' : '3.2 GB / 5 GB'}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${isPro ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: isPro ? '4%' : '64%' }}></div>
                                    </div>
                                </div>
                            </div>

                            {isCanceledPro ? (
                                <div className="relative z-10 px-5 py-2.5 bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-sm border border-slate-200 dark:border-white/20">
                                    Canceled (Ends {currentPeriodEnd})
                                </div>
                            ) : isPro ? (
                                <CancelSubscriptionButton />
                            ) : (
                                <Link href="/payment/checkout" className="relative z-10 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-0.5 font-bold rounded-lg transition-all text-sm inline-block">
                                    Upgrade to Pro
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
