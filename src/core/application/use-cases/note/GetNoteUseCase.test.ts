import { GetNoteUseCase } from './GetNoteUseCase'
import { NoteRepository } from '../../interfaces/NoteRepository'
import { Note } from '../../../domain/entities/Note'

describe('GetNoteUseCase', () => {
    // Mock the external repository dependency
    const mockNoteRepository: NoteRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findAllByUserId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    const getNoteUseCase = new GetNoteUseCase(mockNoteRepository)

    it('should retrieve a note successfully and map to DTO', async () => {
        const fakeDomainNote = new Note({
            id: 'note-123',
            userId: 'user-001',
            title: 'Found Note',
            content: 'Hello World',
            folderId: null,
            isPinned: true,
            isTrashed: false,
            isFavorite: false,
            wordCount: 2,
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-01T00:00:00Z'),
        });

        // Setup the mock to return our domain entity
        const mockFindById = mockNoteRepository.findById as jest.Mock
        mockFindById.mockResolvedValue(fakeDomainNote)

        const result = await getNoteUseCase.execute('note-123')

        // Validations
        expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-123')

        expect(result).not.toBeNull()
        expect(result?.title).toBe('Found Note')
        expect(result?.wordCount).toBe(2)
        expect(result?.isPinned).toBe(true)
    })

    it('should return null if the note does not exist', async () => {
        const mockFindById = mockNoteRepository.findById as jest.Mock
        mockFindById.mockResolvedValue(null)
        const result = await getNoteUseCase.execute('non-existent-id')

        expect(result).toBeNull()
    })
})
