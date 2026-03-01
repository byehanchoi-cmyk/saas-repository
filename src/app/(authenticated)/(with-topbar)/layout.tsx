import { TopBar } from '@/components/layout/TopBar'

export default function WithTopBarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <TopBar />
            {children}
        </>
    )
}
