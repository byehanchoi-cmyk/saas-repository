import React from 'react'

export interface Collaborator {
    id: string
    name: string
    role: string
    avatarUrl: string
}

export interface EditorPropertiesProps {
    note: {
        folderName?: string
        tags?: string[]
        createdAt?: Date
        updatedAt?: Date
        wordCount?: number
        collaborators?: Collaborator[]
    }
}

export function EditorProperties({ note }: EditorPropertiesProps) {
    const formattedCreated = note.createdAt
        ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(note.createdAt)
        : 'Unknown'

    const wordCountFormatted = note.wordCount?.toLocaleString() || '0'

    return (
        <aside className="w-80 bg-slate-50 dark:bg-surface-dark border-l border-slate-200 dark:border-border-dark overflow-y-auto hidden xl:block">
            <div className="p-5">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Note Properties</h3>

                {/* Folders */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg hover:border-primary dark:hover:border-primary transition-colors text-left group">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="material-symbols-outlined text-yellow-500 text-[20px]">folder</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{note.folderName || 'Unfiled'}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[18px]">expand_more</span>
                    </button>
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {note.tags?.map((tag, idx) => (
                            <span key={idx} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${idx % 2 === 0 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'}`}>
                                #{tag}
                                <button className="hover:opacity-75"><span className="material-symbols-outlined text-[12px]">close</span></button>
                            </span>
                        ))}
                    </div>
                    <input className="w-full bg-transparent border-b border-slate-200 dark:border-border-dark focus:border-primary px-0 py-1 text-sm text-slate-600 dark:text-slate-300 focus:ring-0 placeholder-slate-400" placeholder="Add a tag..." type="text" />
                </div>

                <div className="border-t border-slate-200 dark:border-border-dark my-6"></div>

                {/* Info */}
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Info</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Created</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">{formattedCreated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Last Edited</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">Just now</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Word count</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">{wordCountFormatted}</span>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-border-dark my-6"></div>

                {/* Collaborators */}
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Collaborators</h3>
                <div className="flex flex-col gap-3">
                    {note.collaborators?.map((collab) => (
                        <div key={collab.id} className="flex items-center gap-3">
                            <div className={`bg-center bg-no-repeat bg-cover rounded-full size-8 ${collab.role === 'Viewer' ? 'opacity-60 grayscale' : ''}`} style={{ backgroundImage: `url("${collab.avatarUrl}")` }}></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{collab.name}</span>
                                <span className="text-xs text-slate-400">{collab.role}</span>
                            </div>
                        </div>
                    ))}
                    <button className="mt-2 text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">add</span> Invite others
                    </button>
                </div>
            </div>
        </aside>
    )
}
