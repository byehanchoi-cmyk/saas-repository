import { NoteResponseDTO } from '../../dtos/NoteDTO'
import { NoteRepository } from '../../interfaces/NoteRepository'

export class GetNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(id: string): Promise<NoteResponseDTO | null> {
        const note = await this.noteRepository.findById(id)

        if (!note) {
            return null
        }

        // Return a mapped DTO response to decouple Domain from outside layers
        return {
            id: note.id,
            userId: note.userId,
            title: note.title,
            content: note.content,
            folderId: note.folderId,
            isPinned: note.isPinned,
            isTrashed: note.isTrashed,
            isFavorite: note.isFavorite,
            wordCount: note.wordCount,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }
    }
}
