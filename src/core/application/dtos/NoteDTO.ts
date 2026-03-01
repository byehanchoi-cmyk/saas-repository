export interface CreateNoteDTO {
    userId: string
    folderId?: string | null
    title?: string
}

export interface UpdateNoteDTO {
    id: string
    userId: string
    title?: string
    content?: string | null
    folderId?: string | null
    isPinned?: boolean
    isTrashed?: boolean
    isFavorite?: boolean
}

export interface NoteResponseDTO {
    id: string
    userId: string
    title: string
    content: string | null
    folderId: string | null
    isPinned: boolean
    isTrashed: boolean
    isFavorite: boolean
    wordCount: number
    createdAt: Date
    updatedAt: Date
}
