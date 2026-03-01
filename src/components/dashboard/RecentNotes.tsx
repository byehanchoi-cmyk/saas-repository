'use client'

import { NoteResponseDTO } from '@/core/application/dtos/NoteDTO'
import { createNoteAction } from '@/app/actions/note.actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RecentNotesProps {
    notes: NoteResponseDTO[]
    title?: string
    showHighlight?: boolean
}

export function RecentNotes({ notes, title = "Recent Notes", showHighlight = true }: RecentNotesProps) {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateNote = async () => {
        if (isCreating) return
        try {
            setIsCreating(true)
            const result = await createNoteAction()
            if (result.data) {
                router.push(`/note/${result.data.id}`)
            } else if (result.error) {
                if (result.error.includes('row-level security')) {
                    alert('노트를 생성하려면 Pro 요금제가 필요합니다. 결제 페이지로 이동합니다.');
                    router.push('/payment/checkout')
                } else {
                    console.error('Failed to create note:', result.error)
                    alert('노트 생성에 실패했습니다: ' + result.error);
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleNoteClick = (id: string) => {
        router.push(`/note/${id}`)
    }

    return (
        <div>
            {/* Hero Section / Recent Highlight - Keep Static for Now */}
            {showHighlight && (
                <div className="mb-8">
                    <h2 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mb-4">Jump Back In</h2>
                    <div
                        onClick={() => notes[0] && handleNoteClick(notes[0].id)}
                        className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Abstract workspace background" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZMm_vzVGKeGEQAUpILIw8hw2ag7tSQy3PX18XeF6X5i1SZAVRyv0L6j45EIdxglDSIq_EBfd0ojo2895Jti3J1Fa_xvY-cAW82JdRno2zlNgKcZ-_HV1xQx1P0xJu3EY80QMs3E31SU-lPaxbj3V_27CeCasagf9j82A13vxWU8uni7P91wTM5fTuPb15HeFqjyJk7enp-56ORu3lhMlsFnC6kt2_vdTJnqkPwpppOG9qNE7jdVoiuzbt9pNJKOXEX2UcR4e4iFwv")' }}>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded">
                                    {notes[0] ? 'Recently Edited' : 'Getting Started'}
                                </span>
                                <span className="text-slate-300 text-xs">
                                    {notes[0] ? `Edited ${new Date(notes[0].updatedAt).toLocaleDateString()}` : 'Create your first note'}
                                </span>
                            </div>
                            <h3 className="text-white text-3xl font-bold mb-2">
                                {notes[0]?.title || 'CloudNotes Tutorial'}
                            </h3>
                            <p className="text-slate-200 text-base max-w-2xl line-clamp-1">
                                {notes[0]?.content || 'Start capturing your thoughts, projects, and ideas instantly with AI-powered search and cross-device sync.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Notes Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">{title}</h2>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-[#1e232e] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        </button>
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">list</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => handleNoteClick(note.id)}
                            className="bg-white dark:bg-[#1e232e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-[200px] shadow-sm hover:shadow-md relative overflow-hidden"
                        >
                            {note.isPinned && (
                                <div className="absolute top-0 right-0 w-12 h-12">
                                    <div className="absolute transform rotate-45 bg-primary text-white text-[10px] font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-sm">PINNED</div>
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors pr-6">{note.title}</h3>
                                <span className="material-symbols-outlined text-slate-400 text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">more_horiz</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-4 flex-1">
                                {note.content || 'No content.'}
                            </p>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                    Edited {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Placeholder */}
                    <button
                        onClick={handleCreateNote}
                        disabled={isCreating}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-[200px] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors text-slate-400 dark:text-slate-500">
                            {isCreating ? (
                                <span className="animate-spin material-symbols-outlined">sync</span>
                            ) : (
                                <span className="material-symbols-outlined">add</span>
                            )}
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm group-hover:text-primary">
                            {isCreating ? 'Creating Note...' : 'Create New Note'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

