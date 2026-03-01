'use client'

import { createNoteAction } from '@/app/actions/note.actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function TopBar() {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateNote = async () => {
        try {
            setIsCreating(true)
            const result = await createNoteAction()
            if (result.data) {
                router.push(`/note/${result.data.id}`)
            } else if (result.error) {
                console.error('Failed to create note:', result.error)
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111318]/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex flex-1 max-w-xl">
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-slate-100 dark:bg-[#1e232e] text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm transition-all"
                        placeholder="Search title, content, or tags..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 pl-4">
                <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-[#9da6b9] dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-[#1e232e]">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                    onClick={handleCreateNote}
                    disabled={isCreating}
                    className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-bold leading-normal hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating ? (
                        <span className="animate-spin material-symbols-outlined text-[20px]">sync</span>
                    ) : (
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    )}
                    <span className="hidden sm:inline truncate">
                        {isCreating ? 'Creating...' : 'New Note'}
                    </span>
                </button>
            </div>
        </header>
    )
}
