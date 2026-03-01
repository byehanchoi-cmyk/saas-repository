import { NoteRepository } from '../../core/application/interfaces/NoteRepository'
import { Note, NoteProps } from '../../core/domain/entities/Note'
import { SupabaseClient } from '@supabase/supabase-js'

export class SupabaseNoteRepository implements NoteRepository {
    constructor(private readonly supabase: SupabaseClient) { }

    async save(note: Note): Promise<void> {
        const { error } = await this.supabase
            .from('notes')
            .insert({
                id: note.id,
                user_id: note.userId,
                title: note.title,
                content: note.content,
                folder_id: note.folderId,
                is_pinned: note.isPinned,
                is_trashed: note.isTrashed,
                is_favorite: note.isFavorite,
                word_count: note.wordCount,
                created_at: note.createdAt.toISOString(),
                updated_at: note.updatedAt.toISOString(),
            })

        if (error) throw new Error(`Failed to save note: ${error.message}`)
    }

    async findById(id: string): Promise<Note | null> {
        const { data, error } = await this.supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) {
            return null
        }

        return this.mapToDomain(data)
    }

    async findAllByUserId(userId: string): Promise<Note[]> {
        const { data, error } = await this.supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })

        if (error) {
            // Alternatively return empty array depending on design
            throw new Error(`Failed to fetch notes: ${error.message}`)
        }

        return data.map(this.mapToDomain)
    }

    async update(note: Note): Promise<void> {
        const { error } = await this.supabase
            .from('notes')
            .update({
                title: note.title,
                content: note.content,
                folder_id: note.folderId,
                is_pinned: note.isPinned,
                is_trashed: note.isTrashed,
                is_favorite: note.isFavorite,
                word_count: note.wordCount,
                updated_at: note.updatedAt.toISOString(),
            })
            .eq('id', note.id)

        if (error) throw new Error(`Failed to update note: ${error.message}`)
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('notes')
            .delete()
            .eq('id', id)

        if (error) throw new Error(`Failed to delete note: ${error.message}`)
    }

    // Mapper helper
    private mapToDomain(row: any): Note {
        // Build properties from the snake_case database row
        const props: NoteProps = {
            id: row.id as string,
            userId: row.user_id as string,
            title: row.title as string,
            content: row.content as string | null,
            folderId: row.folder_id as string | null,
            isPinned: row.is_pinned as boolean,
            isTrashed: row.is_trashed as boolean,
            isFavorite: row.is_favorite as boolean,
            wordCount: row.word_count as number,
            createdAt: new Date(row.created_at as string),
            updatedAt: new Date(row.updated_at as string),
        }

        // Re-instantiate the Domain Entity
        return new Note(props)
    }
}
