import { createClient } from '@/lib/supabase/server'
import { RecentNotes } from '@/components/dashboard/RecentNotes'

export default async function NotesPage() {
    const supabase = await createClient()

    // Fetch all notes for the user
    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching notes:', error)
    }

    const mappedNotes = (notes || []).map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title || 'Untitled',
        content: n.content || '',
        folderId: n.folder_id || null,
        isPinned: n.is_pinned || false,
        isTrashed: n.is_trashed || false,
        isFavorite: n.is_favorite || false,
        wordCount: n.content ? n.content.split(/\s+/).length : 0,
        createdAt: new Date(n.created_at),
        updatedAt: new Date(n.updated_at)
    }))

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">All Notes</h1>
                    <p className="text-slate-500 dark:text-[#9da6b9]">Manage all your thoughts and ideas in one place.</p>
                </div>
            </div>

            <RecentNotes
                notes={mappedNotes}
                title="Your Notes"
                showHighlight={false}
            />
        </div>
    )
}
