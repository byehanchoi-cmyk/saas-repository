import { CreateNoteUseCase } from './CreateNoteUseCase'
import { NoteRepository } from '../../interfaces/NoteRepository'
import { Note } from '../../../domain/entities/Note'

describe('CreateNoteUseCase', () => {
    // Mock the external repository dependency
    const mockNoteRepository: NoteRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findAllByUserId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    const createNoteUseCase = new CreateNoteUseCase(mockNoteRepository)

    it('should create and save a new note successfully via dto', async () => {
        const dto = {
            userId: 'user-123',
            folderId: 'folder-abc'
        }

        const result = await createNoteUseCase.execute(dto)

        // Validate the response object format (NoteResponseDTO)
        expect(result).toBeDefined()
        expect(typeof result.id).toBe('string')
        expect(result.userId).toBe('user-123')
        expect(result.folderId).toBe('folder-abc')
        expect(result.title).toBe('Untitled')
        expect(result.content).toBeNull()

        // Verify the mock repository was called exactly once to save the new Note entity
        expect(mockNoteRepository.save).toHaveBeenCalledTimes(1)

        // Assert the argument to save was effectively a Note instance
        const mockSave = mockNoteRepository.save as jest.Mock
        const savedArg = mockSave.mock.calls[0][0]
        expect(savedArg).toBeInstanceOf(Note)
        expect(savedArg.userId).toBe('user-123')
    })
})
