import { Sidebar } from '@/components/layout/Sidebar'

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-full flex-1 w-full flex-row font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden relative">
                {children}
            </main>
        </div>
    )
}
