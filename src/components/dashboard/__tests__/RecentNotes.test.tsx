import { render, screen } from '@testing-library/react'
import { RecentNotes } from '../RecentNotes'
import { NoteResponseDTO } from '@/core/application/dtos/NoteDTO'

describe('RecentNotes Component', () => {
    const mockNotes: NoteResponseDTO[] = [
        {
            id: '1',
            userId: 'user1',
            title: 'Test Note 1',
            content: 'This is the first test note content.',
            folderId: null,
            isPinned: false,
            isTrashed: false,
            isFavorite: false,
            wordCount: 7,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-02T00:00:00Z')
        },
        {
            id: '2',
            userId: 'user1',
            title: 'Pinned Note',
            content: 'This is a pinned note.',
            folderId: null,
            isPinned: true,
            isTrashed: false,
            isFavorite: false,
            wordCount: 5,
            createdAt: new Date('2024-01-03T00:00:00Z'),
            updatedAt: new Date('2024-01-03T00:00:00Z')
        }
    ]

    it('renders Jump Back In section', () => {
        // We will pass empty notes just to render
        render(<RecentNotes notes={[]} />)
        expect(screen.getByText('Jump Back In')).toBeInTheDocument()
    })

    it('renders recent notes correctly', () => {
        render(<RecentNotes notes={mockNotes} />)
        // Check if note titles are rendered
        expect(screen.getByText('Test Note 1')).toBeInTheDocument()
        expect(screen.getByText(/This is the first test note content/)).toBeInTheDocument()

        expect(screen.getByText('Pinned Note')).toBeInTheDocument()
        // Check for PINNED badge
        expect(screen.getByText('PINNED')).toBeInTheDocument()
    })

    it('renders empty state placeholder when no notes are provided and shows Create New Note', () => {
        render(<RecentNotes notes={[]} />)
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
        expect(screen.queryByText('Test Note 1')).not.toBeInTheDocument()
    })
})
