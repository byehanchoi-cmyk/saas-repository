'use client'

import React from 'react'
import Link from 'next/link'

export interface EditorHeaderProps {
    folderName?: string
    noteTitle?: string
    isSaving?: boolean
    isFavorite?: boolean
    onFavoriteClick?: () => void
    userAvatarUrl?: string
}

export function EditorHeader({
    folderName,
    noteTitle,
    isSaving = false,
    isFavorite = false,
    onFavoriteClick,
    userAvatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9eKKzjjp7B0qU-MR7xC4BKrv3dSVZyzyulcJwE0uejIevFriWl6LnpO8t7i3LaiBMfYKcA2j4cmtLkt4G7Tb4R4P8iVu1CMhvbQ00QQChPHMDDjxiZOIaukVF936K-5MrRu5KyU7Uu8tvW2GgQ2whdRfqtheo2bC2R5eY7p3vzXtgch6Mxitdo_7S3sjoKL1kpalxSjnwmvgtiKUPRhskU4YzDbrfXEpYnRxyHhREUpyyLDW8BrCAHQXkRWRhVoqTKFA0e70ZKaVl'
}: EditorHeaderProps) {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-border-dark px-6 py-3 bg-white dark:bg-background-dark z-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center justify-center size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Back to Dashboard">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                <div className="h-6 w-px bg-slate-200 dark:bg-border-dark mx-1"></div>
                <div className="size-8 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">cloud_circle</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">CloudNotes</h2>
                <div className="h-6 w-px bg-slate-200 dark:bg-border-dark mx-2"></div>

                {/* Breadcrumbs / Context */}
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link href="/dashboard" className="hover:text-primary cursor-pointer transition-colors">{folderName || 'Unfiled'}</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-semibold max-w-[200px] truncate">{noteTitle || 'Untitled'}</span>
                </div>
            </div>

            {/* Center Actions (Status) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined text-[16px]">
                    {isSaving ? 'sync' : 'cloud_done'}
                </span>
                <span>{isSaving ? 'Saving...' : 'All changes saved'}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1">
                    <button className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-400 transition-colors" title="Version History">
                        <span className="material-symbols-outlined">history</span>
                    </button>
                    <button
                        onClick={onFavoriteClick}
                        className={`flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors ${isFavorite ? 'text-yellow-500' : 'text-slate-500 dark:text-slate-400'}`}
                        title="Favorite"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? '"FILL" 1' : '"FILL" 0' }}>star</span>
                    </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Share</span>
                </button>
                <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-slate-100 dark:ring-border-dark cursor-pointer"
                    title="User Profile"
                    style={{ backgroundImage: `url("${userAvatarUrl}")` }}
                ></div>
            </div>
        </header>
    )
}
