'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { EditorHeader } from './EditorHeader'
import { EditorSidebar } from './EditorSidebar'

import { EditorContent } from './EditorContent'
import { EditorProperties } from './EditorProperties'
import { NoteResponseDTO } from '@/core/application/dtos/NoteDTO'
import { updateNoteAction } from '@/app/actions/note.actions'
import debounce from 'lodash/debounce'

export interface NoteEditorWorkspaceProps {
    noteId: string
    initialTitle: string
    initialContent: string | null
    createdAt: Date
    updatedAt: Date
    folderName: string
    wordCount: number
    ownerName: string
    userId: string
}

export function NoteEditorWorkspace({
    noteId, initialTitle, initialContent, createdAt, updatedAt, folderName, wordCount, ownerName, userId
}: NoteEditorWorkspaceProps) {
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState<string | null>(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSavedAs, setLastSavedAs] = useState({ title: initialTitle, content: initialContent })

    // Auto-save logic
    const saveToSupabase = useCallback(
        debounce(async (newTitle: string, newContent: string | null) => {
            if (newTitle === lastSavedAs.title && newContent === lastSavedAs.content) return
            setIsSaving(true)

            try {
                // If it's a mock user, we might get an Unauthorized error, but the code structure is correct.
                await updateNoteAction({
                    id: noteId,
                    userId: userId,
                    title: newTitle,
                    content: newContent || undefined
                })
                setLastSavedAs({ title: newTitle, content: newContent })
            } catch (error) {
                console.error("Failed to save note:", error)
            } finally {
                setIsSaving(false)
            }
        }, 1000),
        [noteId, userId, lastSavedAs]
    )

    // Trigger save when title or content change
    useEffect(() => {
        saveToSupabase(title, content)
    }, [title, content, saveToSupabase])

    const noteDisplay = {
        title,
        content,
        createdAt,
        updatedAt,
        folderName,
        wordCount,
        ownerName,
        tags: []
    }

    return (
        <div className="flex flex-col h-full flex-1 w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden">
            <EditorHeader
                noteTitle={title}
                folderName={folderName}
                isSaving={isSaving}
            />
            <div className="flex flex-1 overflow-hidden relative">
                <EditorSidebar />
                <main className="flex-1 flex flex-col relative overflow-y-auto bg-white dark:bg-background-dark">
                    <EditorContent
                        note={noteDisplay}
                        onTitleChange={setTitle}
                        onContentChange={setContent}
                    />
                </main>
                <EditorProperties note={noteDisplay} />
            </div>
        </div>
    )
}
