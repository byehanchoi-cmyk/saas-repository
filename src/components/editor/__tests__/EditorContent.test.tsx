import { render, screen, fireEvent } from '@testing-library/react'
import { EditorContent } from '../EditorContent'

describe('EditorContent Component', () => {
    const mockNote = {
        title: 'Meeting Notes - Q3 Planning',
        content: 'Reviewing the quarterly goals for Q3.',
        createdAt: new Date('2023-10-24T10:30:00Z'),
        ownerName: 'Created by you'
    }

    it('renders the title input', () => {
        render(<EditorContent note={mockNote} />)
        const titleInput = screen.getByDisplayValue('Meeting Notes - Q3 Planning')
        expect(titleInput).toBeInTheDocument()
    })

    it('renders the meta info line', () => {
        render(<EditorContent note={mockNote} />)
        // Date formatting test might depend on local timezone, using regex to check basics
        expect(screen.getByText(/Oct 24, 2023/)).toBeInTheDocument()
        expect(screen.getByText('Created by you')).toBeInTheDocument()
    })

    it('calls onTitleChange when title is edited', () => {
        const handleTitleChange = jest.fn()
        render(<EditorContent note={mockNote} onTitleChange={handleTitleChange} />)

        const titleInput = screen.getByDisplayValue('Meeting Notes - Q3 Planning')
        fireEvent.change(titleInput, { target: { value: 'New Title' } })

        expect(handleTitleChange).toHaveBeenCalledWith('New Title')
    })
})
