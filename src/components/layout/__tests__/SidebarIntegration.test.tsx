import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/layout/Sidebar'
import '@testing-library/jest-dom'

// Mock createClient
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn(() => Promise.resolve({
                data: { user: { email: 'test@example.com', user_metadata: { full_name: 'Test User' } } }
            }))
        }
    }))
}))

describe('Sidebar Integration', () => {
    it('should have a link to the note management page (/notes)', async () => {
        // Since Sidebar is an async component, we need to handle it accordingly in tests
        // React 18+ and Jest handles this better with await
        const SidebarComponent = await Sidebar()
        render(SidebarComponent)

        const notesLink = screen.getByRole('link', { name: /all notes/i })
        expect(notesLink).toHaveAttribute('href', '/notes')
    })
})
