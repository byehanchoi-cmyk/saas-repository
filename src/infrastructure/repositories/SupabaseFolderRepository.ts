import { SupabaseClient } from '@supabase/supabase-js'
import { FolderResponseDTO } from '../../core/application/dtos/FolderDTO'

export class SupabaseFolderRepository {
    constructor(private readonly supabase: SupabaseClient) { }

    async findAllByUserId(userId: string): Promise<FolderResponseDTO[]> {
        const { data, error } = await this.supabase
            .from('folders')
            .select(`
                id,
                user_id,
                name,
                icon,
                created_at,
                updated_at,
                notes!left (id)
            `)
            .eq('user_id', userId)
            .order('name', { ascending: true })

        if (error) {
            console.error('Failed to fetch folders:', error)
            return []
        }

        return data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            name: row.name,
            color: row.color,
            icon: row.icon,
            noteCount: row.notes?.length || 0,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        }))
    }
}
