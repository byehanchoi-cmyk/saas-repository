import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export async function HeroSection() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user

    return (
        <div className="w-full px-4 pt-16 pb-12 md:pt-24 md:pb-20 max-w-7xl mx-auto">
            <div className="@container">
                <div className="flex flex-col gap-10 md:gap-16 lg:flex-row items-center">
                    <div className="flex flex-col gap-6 lg:w-1/2 lg:pr-10">
                        <div className="flex flex-col gap-4 text-left">
                            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                                New: AI Assistant 2.0
                            </span>
                            <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                Capture thoughts,<br />
                                <span className="text-primary">anywhere, anytime.</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                                The AI-powered note-taking app that syncs instantly across all your devices. Secure, simple, and smarter than ever.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={isAuthenticated ? "/dashboard" : "/auth"}
                                className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/25"
                            >
                                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                            </Link>
                            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-[#252a35] text-slate-900 dark:text-white text-base font-bold transition-all">
                                <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                                Watch Demo
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 mt-2">
                            <div className="flex -space-x-2">
                                {/* Using next/image for optimized avatars */}
                                <Image alt="User" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-background-light dark:border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC31mEJ4VjEz2NrmDHvY4YiZi2ZlJ2mFfrW1J15kfXEvylpMKr4JrgdpX7Xj8Dns-DnRFVUHQFgxDSKTYQCDS4kRXL-GGOWNVl8vB558zCxOkCGLICDzsHDPT4Dal8bjBpaPUjSD3G0j1PD2txKZy6W9Ba7CXtIkmY6t3QW4i_iODf5fk-pJhtgBj_HKfRw7WJM-Fm9Cw7ZjaDggLc6P9ksWHrHu8S4ePYrcN0Bt6LS3A5-pEGGTWgvEqqKUf7_1NFDSb2GAErYu3IQ" />
                                <Image alt="User" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-background-light dark:border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUZqTkpstDBHz-ZD6Reaip2_03um2pUg6-9gAy5JWuuotT19WC9WPXywqnfVW21s-DXGftvCJp2WDSCay3zZx4MnCGBcyVQlInbzqRUOdecTpf_K-SFi6kt6B5kINbvFK12j2h3tR25Rd09ANUx_gJYYbYdy1SpDtOgM2AVnAHvlraFZpHQNjU4DYqg-wCeoGBljoYtjv9R2y7dH1Vh67xgmrD1ZlSNvXSWeOeOyX3ppq4iuFK5wL_Q57H34zOOYmQtQhSF6YdZck1" />
                                <Image alt="User" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-background-light dark:border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoQz8QES_LjUdSDH0r6yZ-mjCxuiE8OUTQIIl8hk3MNblGY0ToEgzm0_PyoJgM8Xwy8VX0enQcJB_lbRmXyPFYAsBzJlOYAubr29Aq3Afy11vuAECW6rF4qzJRrDPetra-4Nv-cQ692vjOwOQQSXXXg1xG3FJzGpcERaDtriqrQDOvJC-KhFQa8r8MigmNdPyE-BBSN3qGKifp7Uqo2fMzV2WV9Gcfs9Su0V55Lbrj7VZ9adrZK13QbV_9KB4Yw4wT4Zfyu7HQNCAU" />
                            </div>
                            <p>Trusted by 10,000+ thinkers</p>
                        </div>
                    </div>
                    {/* Hero Image / Visual */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-full aspect-[4/3] bg-surface-dark rounded-xl overflow-hidden border border-border-dark shadow-2xl">
                            {/* Abstract UI Representation */}
                            <div className="flex h-full w-full flex-col bg-slate-900">
                                <div className="flex h-10 w-full items-center gap-2 border-b border-border-dark bg-surface-dark px-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <div className="ml-4 h-4 w-64 rounded-full bg-border-dark/50"></div>
                                </div>
                                <div className="flex flex-1 overflow-hidden">
                                    <div className="w-16 border-r border-border-dark bg-surface-dark/50 p-3 hidden sm:flex flex-col gap-4 items-center">
                                        <div className="h-8 w-8 rounded bg-primary/20"></div>
                                        <div className="h-8 w-8 rounded bg-border-dark/50"></div>
                                        <div className="h-8 w-8 rounded bg-border-dark/50"></div>
                                    </div>
                                    <div className="w-64 border-r border-border-dark bg-surface-dark p-4 hidden md:flex flex-col gap-3">
                                        <div className="h-4 w-24 rounded bg-slate-600"></div>
                                        <div className="h-10 w-full rounded bg-primary/10 border border-primary/20"></div>
                                        <div className="h-8 w-full rounded bg-transparent"></div>
                                        <div className="h-8 w-full rounded bg-transparent"></div>
                                    </div>
                                    <div className="flex-1 p-6 bg-background-dark" style={{ backgroundImage: 'radial-gradient(#282e39 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                        <div className="h-8 w-1/2 rounded bg-slate-700 mb-6"></div>
                                        <div className="h-4 w-full rounded bg-slate-800 mb-3"></div>
                                        <div className="h-4 w-5/6 rounded bg-slate-800 mb-3"></div>
                                        <div className="h-4 w-4/6 rounded bg-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
