import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Navigation />
            <main className="flex-1 flex flex-col w-full">
                {children}
            </main>
            <Footer />
        </div>
    )
}
