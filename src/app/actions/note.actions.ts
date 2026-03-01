'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository'
import { CreateNoteUseCase } from '@/core/application/use-cases/note/CreateNoteUseCase'
import { UpdateNoteUseCase } from '@/core/application/use-cases/note/UpdateNoteUseCase'
import { GetNoteUseCase } from '@/core/application/use-cases/note/GetNoteUseCase'
import { NoteResponseDTO, UpdateNoteDTO } from '@/core/application/dtos/NoteDTO'
import { revalidatePath } from 'next/cache'
import { SupabaseClient, User } from '@supabase/supabase-js'

// Helper to construct Use Cases with active user sessions
async function getUseCases() {
    const supabase = await createClient()
    const repository = new SupabaseNoteRepository(supabase)

    return {
        createNote: new CreateNoteUseCase(repository),
        updateNote: new UpdateNoteUseCase(repository),
        getNote: new GetNoteUseCase(repository),
        supabase
    }
}

// Ensure the user exists in public.users before creating notes
// The trigger on auth.users may not always fire (e.g. timing issues, OAuth)
async function ensureUserExists(supabase: SupabaseClient, user: User) {
    const { data } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

    if (!data) {
        const { error: insertError } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email ?? '',
                full_name: user.user_metadata?.full_name ?? null,
                avatar_url: user.user_metadata?.avatar_url ?? null,
            }, { onConflict: 'id' })

        if (insertError) {
            console.error('Failed to ensure user exists:', insertError)
            throw new Error(`Failed to initialize user profile: ${insertError.message}`)
        }
    }
}

export async function createNoteAction(folderId?: string): Promise<{ data?: NoteResponseDTO, error?: string }> {
    try {
        const { createNote, supabase } = await getUseCases()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Ensure the user row exists in public.users before inserting a note
        await ensureUserExists(supabase, user)

        const result = await createNote.execute({
            userId: user.id,
            folderId: folderId || null
        })

        revalidatePath('/dashboard')
        return { data: result }
    } catch (e: unknown) {
        if (e instanceof Error) {
            return { error: e.message }
        }
        return { error: 'Unknown error occurred' }
    }
}

export async function updateNoteAction(dto: UpdateNoteDTO): Promise<{ data?: NoteResponseDTO, error?: string }> {
    try {
        const { updateNote, supabase } = await getUseCases()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user || user.id !== dto.userId) throw new Error('Unauthorized')

        const result = await updateNote.execute(dto)

        revalidatePath('/dashboard')
        revalidatePath(`/notes/${dto.id}`)
        return { data: result }
    } catch (e: unknown) {
        if (e instanceof Error) {
            return { error: e.message }
        }
        return { error: 'Unknown error occurred' }
    }
}

export async function getNoteAction(id: string): Promise<{ data?: NoteResponseDTO | null, error?: string }> {
    try {
        const { getNote, supabase } = await getUseCases()

        // Ensure user is authed (RLS will also protect, but we want early exit)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const result = await getNote.execute(id)
        return { data: result }
    } catch (e: unknown) {
        if (e instanceof Error) {
            return { error: e.message }
        }
        return { error: 'Unknown error occurred' }
    }
}
