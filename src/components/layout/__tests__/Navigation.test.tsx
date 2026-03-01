import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/layout/Navigation'
import '@testing-library/jest-dom'

// Mock createClient
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn()
}))

describe('Navigation Component', () => {
    it('should show "Log In" and "Get Started" when not authenticated', async () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createClient } = require('@/lib/supabase/server')
        createClient.mockReturnValue({
            auth: {
                getUser: jest.fn(() => Promise.resolve({ data: { user: null } }))
            }
        })

        const NavElement = await Navigation()
        render(NavElement)

        expect(screen.getByText(/log in/i)).toBeInTheDocument()
        expect(screen.getByText(/get started/i)).toBeInTheDocument()
    })

    it('should show "Dashboard" and user name when authenticated', async () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createClient } = require('@/lib/supabase/server')
        createClient.mockReturnValue({
            auth: {
                getUser: jest.fn(() => Promise.resolve({
                    data: {
                        user: {
                            email: 'test@example.com',
                            user_metadata: { full_name: 'Test User' }
                        }
                    }
                }))
            }
        })

        const NavElement = await Navigation()
        render(NavElement)

        expect(screen.queryByText(/log in/i)).not.toBeInTheDocument()
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/API & Billing/i)).toBeInTheDocument()
        expect(screen.getByText(/API & Billing/i).closest('a')).toHaveAttribute('href', '/developer')
        expect(screen.getByText(/test user/i)).toBeInTheDocument()
    })
})
