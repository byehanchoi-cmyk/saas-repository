import { Note, NoteProps } from './Note'

describe('Note Entity', () => {
    const validProps: NoteProps = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '987fcdeb-51a2-43d7-9012-345678901234',
        title: 'Meeting Notes',
        content: 'Discussed Q3 goals and marketing budget.',
        folderId: null,
        isPinned: false,
        isTrashed: false,
        isFavorite: false,
        wordCount: 7,
        createdAt: new Date('2023-10-24T10:30:00Z'),
        updatedAt: new Date('2023-10-24T10:30:00Z'),
    }

    it('should create a valid Note entity', () => {
        const note = new Note(validProps)

        expect(note.id).toBe(validProps.id)
        expect(note.userId).toBe(validProps.userId)
        expect(note.title).toBe(validProps.title)
        expect(note.content).toBe(validProps.content)
        expect(note.wordCount).toBe(7)
    })

    it('should calculate word count accurately when content is updated', () => {
        const note = new Note(validProps)

        note.updateContent('This is a completely new content string with more words.')

        expect(note.content).toBe('This is a completely new content string with more words.')
        expect(note.wordCount).toBe(10)
        expect(note.updatedAt.getTime()).toBeGreaterThan(validProps.updatedAt.getTime())
    })

    it('should toggle favorite status', () => {
        const note = new Note(validProps)

        expect(note.isFavorite).toBe(false)
        note.toggleFavorite()
        expect(note.isFavorite).toBe(true)
        note.toggleFavorite()
        expect(note.isFavorite).toBe(false)
    })

    it('should toggle pinned status', () => {
        const note = new Note(validProps)

        expect(note.isPinned).toBe(false)
        note.togglePinned()
        expect(note.isPinned).toBe(true)
    })

    it('should throw an error if title is empty', () => {
        expect(() => {
            new Note({ ...validProps, title: '' })
        }).toThrow('Note title cannot be empty')
    })

    it('should default title to "Untitled" if created with CreateNew factory', () => {
        const newNote = Note.createNew({ userId: validProps.userId })

        expect(newNote.title).toBe('Untitled')
        expect(newNote.wordCount).toBe(0)
        expect(newNote.userId).toBe(validProps.userId)
    })
})
