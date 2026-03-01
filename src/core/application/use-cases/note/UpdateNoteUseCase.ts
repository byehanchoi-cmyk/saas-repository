import { UpdateNoteDTO, NoteResponseDTO } from '../../dtos/NoteDTO'
import { NoteRepository } from '../../interfaces/NoteRepository'

export class UpdateNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(dto: UpdateNoteDTO): Promise<NoteResponseDTO> {
        const note = await this.noteRepository.findById(dto.id)

        if (!note) {
            throw new Error('Note not found')
        }

        if (note.userId !== dto.userId) {
            throw new Error('Unauthorized access to note')
        }

        // Apply domain updates
        if (dto.title !== undefined) {
            note.updateTitle(dto.title)
        }

        if (dto.content !== undefined) {
            note.updateContent(dto.content ?? '')
        }

        if (dto.isFavorite !== undefined && note.isFavorite !== dto.isFavorite) {
            note.toggleFavorite()
        }

        if (dto.isPinned !== undefined && note.isPinned !== dto.isPinned) {
            note.togglePinned()
        }

        if (dto.isTrashed !== undefined && note.isTrashed !== dto.isTrashed) {
            if (dto.isTrashed) {
                note.moveToTrash()
            } else {
                note.restoreFromTrash()
            }
        }

        // Proper domain method for assigning foldering.
        if (dto.folderId !== undefined) {
            note.updateFolder(dto.folderId)
        }

        // Persist changes
        await this.noteRepository.update(note)

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
