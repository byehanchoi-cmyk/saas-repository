export function FeaturesSection() {
    return (
        <div className="w-full bg-white dark:bg-surface-dark border-y border-slate-200 dark:border-border-dark py-16 md:py-24" id="features">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-4 mb-16">
                    <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                        Why choose CloudNotes?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                        Everything you need to stay organized, focused, and productive without the clutter.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="group flex flex-col gap-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[28px]">devices</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">Sync Everywhere</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Start a note on your phone, finish it on your laptop. Real-time synchronization across iOS, Android, Mac, and Windows.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="group flex flex-col gap-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">AI-Powered Search</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Forget file names. Find exactly what you&apos;re looking for with natural language queries like &quot;meeting notes from last Tuesday.&quot;
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="group flex flex-col gap-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[28px]">encrypted</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">End-to-End Encryption</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Your thoughts are private. We use military-grade AES-256 encryption so even we can&apos;t read your notes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
