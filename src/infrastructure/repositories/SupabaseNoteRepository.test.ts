import { SupabaseNoteRepository } from './SupabaseNoteRepository'
import { Note } from '../../core/domain/entities/Note'
import { SupabaseClient } from '@supabase/supabase-js'

// Create a mock builder for the fluent Supabase API
const createSupabaseMock = () => {
    // We use a generic record to avoid eslint any rules while mocking
    const builder: Record<string, jest.Mock> = {
        insert: jest.fn(),
        select: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        eq: jest.fn(),
        order: jest.fn(),
        single: jest.fn(),
        from: jest.fn()
    }

    // Fluent chaining setup
    builder.from = jest.fn().mockReturnValue(builder)
    builder.insert.mockReturnValue(builder)
    builder.select.mockReturnValue(builder)
    builder.update.mockReturnValue(builder)
    builder.delete.mockReturnValue(builder)
    builder.eq.mockReturnValue(builder)
    builder.order.mockReturnValue(builder)

    return builder
}

describe('SupabaseNoteRepository (Mocked)', () => {
    // Define type according to returned mock builder
    let mockSupabase: ReturnType<typeof createSupabaseMock>
    let repository: SupabaseNoteRepository
    const testUserId = 'test-user-uuid'

    beforeEach(() => {
        mockSupabase = createSupabaseMock()
        repository = new SupabaseNoteRepository(mockSupabase as unknown as SupabaseClient)
    })

    it('should save a note formatting dates to ISO and calling insert', async () => {
        const note = Note.createNew({ userId: testUserId })
        mockSupabase.insert.mockResolvedValueOnce({ error: null })

        await repository.save(note)

        expect(mockSupabase.from).toHaveBeenCalledWith('notes')
        expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
            id: note.id,
            user_id: testUserId,
            title: 'Untitled'
        }))
    })

    it('should find a note by id mapping db row to Domain entity', async () => {
        const fakeRow = {
            id: 'note-1',
            user_id: testUserId,
            title: 'Found Note',
            content: 'Hello Db',
            folder_id: null,
            is_pinned: false,
            is_trashed: false,
            is_favorite: true,
            word_count: 2,
            created_at: new Date('2023-01-01').toISOString(),
            updated_at: new Date('2023-01-01').toISOString()
        }

        // Mock the resolved chain ending in `.single()`
        mockSupabase.single.mockResolvedValueOnce({ data: fakeRow, error: null })

        const result = await repository.findById('note-1')

        expect(mockSupabase.from).toHaveBeenCalledWith('notes')
        expect(mockSupabase.select).toHaveBeenCalledWith('*')
        expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'note-1')

        expect(result).not.toBeNull()
        expect(result).toBeInstanceOf(Note)
        expect(result?.title).toBe('Found Note')
        expect(result?.isFavorite).toBe(true)
    })

    it('should return null if findById does not find a row', async () => {
        mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
        const result = await repository.findById('missing')
        expect(result).toBeNull()
    })

    it('should update a note mapping properties and querying by id', async () => {
        const note = Note.createNew({ userId: testUserId })
        note.updateTitle('New Title')

        mockSupabase.eq.mockResolvedValueOnce({ error: null }) // final chain

        await repository.update(note)

        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Title'
        }))
        expect(mockSupabase.eq).toHaveBeenCalledWith('id', note.id)
    })

    it('should delete a note by id', async () => {
        mockSupabase.eq.mockResolvedValueOnce({ error: null })

        await repository.delete('note-delete-1')

        expect(mockSupabase.delete).toHaveBeenCalled()
        expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'note-delete-1')
    })
})
