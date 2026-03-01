export interface NoteProps {
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

export class Note {
    private props: NoteProps

    constructor(props: NoteProps) {
        if (props.title === '') {
            throw new Error('Note title cannot be empty')
        }
        this.props = { ...props }
    }

    // Getters
    get id(): string { return this.props.id }
    get userId(): string { return this.props.userId }
    get title(): string { return this.props.title }
    get content(): string | null { return this.props.content }
    get folderId(): string | null { return this.props.folderId }
    get isPinned(): boolean { return this.props.isPinned }
    get isTrashed(): boolean { return this.props.isTrashed }
    get isFavorite(): boolean { return this.props.isFavorite }
    get wordCount(): number { return this.props.wordCount }
    get createdAt(): Date { return this.props.createdAt }
    get updatedAt(): Date { return this.props.updatedAt }

    // Domain Logic / Behaviors

    public updateContent(newContent: string): void {
        this.props.content = newContent
        this.props.wordCount = this.calculateWordCount(newContent)
        this.markAsUpdated()
    }

    public updateTitle(newTitle: string): void {
        if (newTitle === '') {
            throw new Error('Note title cannot be empty')
        }
        this.props.title = newTitle
        this.markAsUpdated()
    }

    public toggleFavorite(): void {
        this.props.isFavorite = !this.props.isFavorite
        this.markAsUpdated()
    }

    public togglePinned(): void {
        this.props.isPinned = !this.props.isPinned
        this.markAsUpdated()
    }

    public updateFolder(folderId: string | null): void {
        this.props.folderId = folderId
        this.markAsUpdated()
    }

    public moveToTrash(): void {
        this.props.isTrashed = true
        this.markAsUpdated()
    }

    public restoreFromTrash(): void {
        this.props.isTrashed = false
        this.markAsUpdated()
    }

    // Internal Helpers
    private markAsUpdated(): void {
        this.props.updatedAt = new Date()
    }

    private calculateWordCount(text: string | null): number {
        if (!text) return 0
        const trimmed = text.trim()
        if (trimmed === '') return 0
        return trimmed.split(/\s+/).length
    }

    // Factory method for new notes
    public static createNew(params: { userId: string, folderId?: string }): Note {
        return new Note({
            id: crypto.randomUUID(),
            userId: params.userId,
            title: 'Untitled',
            content: null,
            folderId: params.folderId || null,
            isPinned: false,
            isTrashed: false,
            isFavorite: false,
            wordCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}
