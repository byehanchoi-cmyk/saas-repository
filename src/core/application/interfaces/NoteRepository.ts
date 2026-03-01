import { Note } from '../../domain/entities/Note'

export interface NoteRepository {
    save(note: Note): Promise<void>
    findById(id: string): Promise<Note | null>
    findAllByUserId(userId: string): Promise<Note[]>
    update(note: Note): Promise<void>
    delete(id: string): Promise<void>
}
