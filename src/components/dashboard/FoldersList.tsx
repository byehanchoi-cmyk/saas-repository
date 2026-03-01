import { FolderResponseDTO } from '@/core/application/dtos/FolderDTO'

interface FoldersListProps {
    folders: FolderResponseDTO[]
}

const colorMap: Record<string, { bg: string, text: string }> = {
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    default: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
}

export function FoldersList({ folders }: FoldersListProps) {
    return (
        <div className="mt-10 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">Folders</h2>
                <button className="text-sm text-primary font-bold hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map(folder => {
                    const colors = colorMap[folder.color] || colorMap.default

                    return (
                        <div key={folder.id} className="bg-white dark:bg-[#1e232e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#252b36] transition-colors">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                                <span className="material-symbols-outlined">{folder.icon || 'folder'}</span>
                            </div>
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-bold">{folder.name}</h4>
                                <p className="text-slate-500 text-xs">{folder.noteCount || 0} notes</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

