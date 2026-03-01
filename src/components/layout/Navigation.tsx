import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function Navigation() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3 lg:px-10">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">cloud</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">CloudNotes</h2>
                </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center gap-8">
                {isAuthenticated ? (
                    <>
                        <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
                        <Link href="/notes" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">My Notes</Link>
                        <Link href="/settings" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Settings</Link>
                        <Link href="/developer" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">API & Billing</Link>
                    </>
                ) : (
                    <>
                        <Link href="/#features" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Features</Link>
                        <Link href="/#pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Pricing</Link>
                        <Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Security</Link>
                        <Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">About</Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end mr-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                                Pro Plan
                            </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.user_metadata.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                            ) : (
                                (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?')
                            )}
                        </div>
                        <Link href="/dashboard" className="flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                            Open App
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link href="/auth" className="hidden sm:flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-surface-dark text-sm font-bold transition-colors">
                            Log In
                        </Link>
                        <Link href="/auth" className="flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}
