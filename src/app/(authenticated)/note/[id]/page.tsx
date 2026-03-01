import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository'
import { NoteEditorWorkspace } from '@/components/editor/NoteEditorWorkspace'

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    let userId = user?.id
    if (!userId) {
        // Mock user for development since auth is not fully implemented
        userId = 'mock-user-123'
    }

    const noteRepository = new SupabaseNoteRepository(supabase)
    const noteEntity = await noteRepository.findById(id)

    if (!noteEntity) {
        // Ideally we redirect, but for dev purposes keeping it robust
    }

    return (
        <NoteEditorWorkspace
            noteId={id}
            initialTitle={noteEntity?.title || 'Untitled Note'}
            initialContent={noteEntity?.content || null}
            createdAt={noteEntity?.createdAt || new Date()}
            updatedAt={noteEntity?.updatedAt || new Date()}
            folderName="Unfiled"
            wordCount={noteEntity?.wordCount || 0}
            ownerName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User'}
            userId={userId}
        />
    )
}
