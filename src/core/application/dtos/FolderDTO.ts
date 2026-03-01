export interface FolderResponseDTO {
    id: string
    userId: string
    name: string
    color: string
    icon: string
    noteCount?: number
    createdAt: Date
    updatedAt: Date
}
