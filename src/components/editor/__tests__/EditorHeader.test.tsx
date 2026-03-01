import { render, screen, fireEvent } from '@testing-library/react'
import { EditorHeader } from '../EditorHeader'

describe('EditorHeader Component', () => {
    it('renders the brand logo and name', () => {
        render(<EditorHeader />)
        expect(screen.getByText('CloudNotes')).toBeInTheDocument()
    })

    it('renders breadcrumbs correctly', () => {
        render(<EditorHeader folderName="Personal" noteTitle="Q3 Goals" />)
        expect(screen.getByText('Personal')).toBeInTheDocument()
        expect(screen.getByText('Q3 Goals')).toBeInTheDocument()
    })

    it('displays the saving status', () => {
        const { rerender } = render(<EditorHeader isSaving={true} />)
        expect(screen.getByText('Saving...')).toBeInTheDocument()

        rerender(<EditorHeader isSaving={false} />)
        expect(screen.getByText('All changes saved')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
        render(<EditorHeader />)
        expect(screen.getByTitle('Version History')).toBeInTheDocument()
        expect(screen.getByTitle('Favorite')).toBeInTheDocument()
        expect(screen.getByText('Share')).toBeInTheDocument()
    })

    it('calls onFavoriteClick when favorite button is clicked', () => {
        const handleFavoriteClick = jest.fn()
        render(<EditorHeader onFavoriteClick={handleFavoriteClick} isFavorite={false} />)

        const favButton = screen.getByTitle('Favorite')
        fireEvent.click(favButton)

        expect(handleFavoriteClick).toHaveBeenCalledTimes(1)
    })
})
