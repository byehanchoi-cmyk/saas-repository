import React from 'react'

export function EditorSidebar() {
    return (
        <nav className="hidden md:flex flex-col items-center py-6 w-16 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark flex-shrink-0">
            <div className="flex flex-col gap-4 w-full px-2">
                <button className="group flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary" title="Edit">
                    <span className="material-symbols-outlined">edit_square</span>
                </button>
                <button className="group flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Folders">
                    <span className="material-symbols-outlined">folder_open</span>
                </button>
                <button className="group flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Search">
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button className="group flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>

            <div className="mt-auto flex flex-col gap-4 w-full px-2">
                <button className="group flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Settings">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </nav>
    )
}
