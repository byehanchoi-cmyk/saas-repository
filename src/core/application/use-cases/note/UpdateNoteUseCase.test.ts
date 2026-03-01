import { UpdateNoteUseCase } from './UpdateNoteUseCase'
import { NoteRepository } from '../../interfaces/NoteRepository'
import { Note } from '../../../domain/entities/Note'
import { UpdateNoteDTO } from '../../dtos/NoteDTO'

describe('UpdateNoteUseCase', () => {
    // Mock the external repository dependency
    const mockNoteRepository: NoteRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findAllByUserId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    const updateNoteUseCase = new UpdateNoteUseCase(mockNoteRepository)

    it('should throw an error if the note to update does not exist', async () => {
        const mockFindById = mockNoteRepository.findById as jest.Mock
        mockFindById.mockResolvedValue(null)

        await expect(updateNoteUseCase.execute({ id: 'bad-id', userId: 'user-1' }))
            .rejects.toThrow('Note not found')
    })

    it('should throw an error if a user tries to update another user\'s note', async () => {
        const fakeNote = new Note({
            id: 'note-1',
            userId: 'owner-1',
            title: 'Test',
            content: null,
            folderId: null,
            isPinned: false,
            isTrashed: false,
            isFavorite: false,
            wordCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const mockFindById = mockNoteRepository.findById as jest.Mock
        mockFindById.mockResolvedValue(fakeNote)

        await expect(updateNoteUseCase.execute({ id: 'note-1', userId: 'hacker-99' }))
            .rejects.toThrow('Unauthorized access to note')
    })

    it('should incrementally update provided fields and call repository update', async () => {
        const fakeNote = new Note({
            id: 'note-1',
            userId: 'owner-1',
            title: 'Old Title',
            content: 'Old Content',
            folderId: null,
            isPinned: false,
            isTrashed: false,
            isFavorite: false,
            wordCount: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const mockFindById = mockNoteRepository.findById as jest.Mock
        mockFindById.mockResolvedValue(fakeNote)

        const updateDTO: UpdateNoteDTO = {
            id: 'note-1',
            userId: 'owner-1',
            title: 'New Title',
            content: 'New Content that is longer.',
            isFavorite: true
        }

        const result = await updateNoteUseCase.execute(updateDTO)

        // Validate domain logic was triggered properly 
        expect(fakeNote.title).toBe('New Title')
        expect(fakeNote.content).toBe('New Content that is longer.')
        expect(fakeNote.wordCount).toBe(5)
        expect(fakeNote.isFavorite).toBe(true)

        // Validate persistence was triggered
        expect(mockNoteRepository.update).toHaveBeenCalledWith(fakeNote)

        // Validate returning mapping
        expect(result.title).toBe('New Title')
        expect(result.wordCount).toBe(5)
        expect(result.isFavorite).toBe(true)
    })
})
