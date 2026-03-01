import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'
import { FeaturesSection } from '../FeaturesSection'
import { FocusModeSection } from '../FocusModeSection'
import { PricingSection } from '../PricingSection'

describe('Landing Page Components', () => {
    describe('HeroSection', () => {
        it('renders the main heading', () => {
            render(<HeroSection />)
            expect(screen.getByText(/Capture thoughts,/i)).toBeInTheDocument()
            expect(screen.getByText(/anywhere, anytime./i)).toBeInTheDocument()
        })

        it('renders the CTA buttons', () => {
            render(<HeroSection />)
            expect(screen.getByRole('link', { name: /Get Started for Free/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument()
        })
    })

    describe('FeaturesSection', () => {
        it('renders the section heading', () => {
            render(<FeaturesSection />)
            expect(screen.getByText('Why choose CloudNotes?')).toBeInTheDocument()
        })

        it('renders all three features', () => {
            render(<FeaturesSection />)
            expect(screen.getByText('Sync Everywhere')).toBeInTheDocument()
            expect(screen.getByText('AI-Powered Search')).toBeInTheDocument()
            expect(screen.getByText('End-to-End Encryption')).toBeInTheDocument()
        })
    })

    describe('FocusModeSection', () => {
        it('renders the focus mode heading', () => {
            render(<FocusModeSection />)
            expect(screen.getByText('Focus on what matters.')).toBeInTheDocument()
        })

        it('renders the try focus mode button', () => {
            render(<FocusModeSection />)
            expect(screen.getByRole('button', { name: /Try Focus Mode/i })).toBeInTheDocument()
        })
    })

    describe('PricingSection', () => {
        it('renders the pricing heading', () => {
            render(<PricingSection />)
            expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument()
        })

        it('renders the three pricing tiers', () => {
            render(<PricingSection />)
            expect(screen.getByText('Personal')).toBeInTheDocument()
            expect(screen.getByText('Pro')).toBeInTheDocument()
            expect(screen.getByText('Team')).toBeInTheDocument()
        })
    })
})
