import { render, screen } from '@testing-library/react'
import { EditorProperties } from '../EditorProperties'

describe('EditorProperties Component', () => {
    const mockNote = {
        folderName: 'Quarterly Planning',
        tags: ['meeting', 'q3-goals'],
        createdAt: new Date('2023-10-24T10:30:00Z'),
        updatedAt: new Date(),
        wordCount: 1204,
        collaborators: [
            { id: '1', name: 'Sarah Jenkins', role: 'Owner', avatarUrl: 'sarah.jpg' },
            { id: '2', name: 'Mike Ross', role: 'Viewer', avatarUrl: 'mike.jpg' }
        ]
    }

    it('renders location and tags correctly', () => {
        render(<EditorProperties note={mockNote} />)
        expect(screen.getByText('Quarterly Planning')).toBeInTheDocument()
        expect(screen.getByText('#meeting')).toBeInTheDocument()
        expect(screen.getByText('#q3-goals')).toBeInTheDocument()
    })

    it('renders info section with word count', () => {
        render(<EditorProperties note={mockNote} />)
        expect(screen.getByText('1,204')).toBeInTheDocument()
    })

    it('renders collaborators correctly', () => {
        render(<EditorProperties note={mockNote} />)
        expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument()
        expect(screen.getByText('Owner')).toBeInTheDocument()
        expect(screen.getByText('Mike Ross')).toBeInTheDocument()
        expect(screen.getByText('Viewer')).toBeInTheDocument()
    })
})
