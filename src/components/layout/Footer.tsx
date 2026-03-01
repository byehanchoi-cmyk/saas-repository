import Link from 'next/link'

export function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                                <span className="material-symbols-outlined text-[16px]">cloud</span>
                            </div>
                            <span className="text-lg font-bold">CloudNotes</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            The smartest way to capture, organize, and retrieve your knowledge. Built for modern thinkers.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">adb</span></Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">post_add</span></Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">mail</span></Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-10 md:gap-20">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Product</h4>
                            <Link href="#features" className="text-sm text-slate-500 hover:text-primary transition-colors">Features</Link>
                            <Link href="#pricing" className="text-sm text-slate-500 hover:text-primary transition-colors">Pricing</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Download</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Integrations</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company</h4>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">About</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Blog</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Careers</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Legal</h4>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacy</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Terms</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Security</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">© 2024 CloudNotes Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-slate-400">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
