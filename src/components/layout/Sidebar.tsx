import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export async function Sidebar() {
    const supabase = await createClient()

    // Fetch the user's session safely from the server context
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch user's billing plan
    let billingPlan = 'Personal'
    if (user?.id) {
        const { data: dbUser } = await supabase.from('users').select('billing_plan').eq('id', user.id).single()
        if (dbUser?.billing_plan) {
            billingPlan = dbUser.billing_plan
        }
    }

    // Parse the display name, defaulting to email prefix if not set in metadata
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User'
    // Parse the avatar, defaulting to a UI placeholder if not set
    const avatarUrl = user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBa_kPv6dRxgFc8usyBOl4PPy-qZwdVIGHu8wDKnL-iHyyeSTNYtQaUEuqTGPKLlTA5IdbvOwXaAupkrSzjTWlI2uG-VeeUSyEZREcsafiZ3LxXyzYhxc1vfxzZVo74sQwm30iZWc6OTwaVT7vzT8_dCIDsvoY6G2cOzO80iVQ6k-ka4thUyCt_jfU9hre47L8438o_tPXoDeJgvGUvFFgbQN6U33PO2HYqWz_n_6mJzBkRmvQNyWPeF-Hfzm1jizlmgIYVaXbVk4GQ"


    return (
        <aside className="flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111318] flex-shrink-0 transition-all duration-300">
            <div className="flex h-full flex-col justify-between p-4">
                <div className="flex flex-col gap-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 px-2 mb-2">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">cloud</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">CloudNotes</h2>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="flex gap-3 items-center px-2">
                        <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-primary/20 bg-slate-100 flex-shrink-0">
                            <Image
                                src={avatarUrl}
                                alt="User profile picture"
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">{displayName}</h1>
                            <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-normal leading-normal truncate">
                                {billingPlan === 'Pro' ? 'Pro Plan' : 'Personal Plan'}
                            </p>
                        </div>
                    </div>
                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">dashboard</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">Dashboard</p>
                        </Link>
                        <Link href="/notes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">description</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">All Notes</p>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">star</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">Favorites</p>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">delete</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">Trash</p>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">folder</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">Folders</p>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-[#1e232e] group transition-colors">
                            <span className="material-symbols-outlined text-[24px]">settings</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-white">Settings</p>
                        </Link>
                    </nav>
                    {/* Tags Section */}
                    <div className="flex flex-col gap-2 px-2 mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Tags</h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-[#9da6b9] hover:text-slate-900 dark:hover:text-white cursor-pointer group">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-sm">Personal</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-[#9da6b9] hover:text-slate-900 dark:hover:text-white cursor-pointer group">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-sm">Work</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-[#9da6b9] hover:text-slate-900 dark:hover:text-white cursor-pointer group">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-sm">Ideas</span>
                        </div>
                    </div>
                </div>
                {/* Bottom Actions */}
                <div className="flex flex-col gap-4">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-slate-600 dark:text-slate-400 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="truncate">Sign Out</span>
                        </button>
                    </form>
                    {billingPlan !== 'Pro' && (
                        <Link href="/payment/checkout" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                            <span className="truncate">Upgrade Plan</span>
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    )
}
