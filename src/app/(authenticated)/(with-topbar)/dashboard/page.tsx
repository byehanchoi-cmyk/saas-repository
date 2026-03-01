import { RecentNotes } from '@/components/dashboard/RecentNotes'
import { FoldersList } from '@/components/dashboard/FoldersList'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository'
import { SupabaseFolderRepository } from '@/infrastructure/repositories/SupabaseFolderRepository'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    let userId = user?.id
    if (!userId) {
        // Mock user for development since auth is not fully implemented
        userId = 'mock-user-123'
    }


    const noteRepository = new SupabaseNoteRepository(supabase)
    const folderRepository = new SupabaseFolderRepository(supabase)

    const notes = await noteRepository.findAllByUserId(userId)
    const folders = await folderRepository.findAllByUserId(userId)

    // Map the Domain Note Entity back to NoteResponseDTO for the UI component
    const mappedNotes = notes.map(n => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        content: n.content,
        folderId: n.folderId,
        isPinned: n.isPinned,
        isTrashed: n.isTrashed,
        isFavorite: n.isFavorite,
        wordCount: n.wordCount,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt
    }))

    return (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <RecentNotes notes={mappedNotes} />
            <FoldersList folders={folders} />
        </div>
    )
}

