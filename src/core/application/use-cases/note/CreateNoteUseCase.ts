import { Note } from '../../../domain/entities/Note'
import { CreateNoteDTO, NoteResponseDTO } from '../../dtos/NoteDTO'
import { NoteRepository } from '../../interfaces/NoteRepository'

export class CreateNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(dto: CreateNoteDTO): Promise<NoteResponseDTO> {
        // Use the domain entity factory
        const note = Note.createNew({
            userId: dto.userId,
            folderId: dto.folderId || undefined
        })

        // If an explicit title is provided during creation, update it
        if (dto.title) {
            note.updateTitle(dto.title)
        }

        // Persist using the repository interface
        await this.noteRepository.save(note)

        // Return a mapped DTO response
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
