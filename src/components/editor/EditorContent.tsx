'use client'

import React from 'react'
import { useEditor, EditorContent as TiptapEditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { EditorToolbar } from './EditorToolbar'

export interface EditorContentProps {
    note: {
        title: string
        content: string | null
        createdAt: Date
        ownerName?: string
    }
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
}

export function EditorContent({ note, onTitleChange, onContentChange }: EditorContentProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type something...',
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: note.content || '<p></p>',
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                // Return the HTML content from Tiptap whenever it changes
                onContentChange(editor.getHTML())
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none prose-lg outline-none min-h-[300px]',
            },
        },
    })

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(note.createdAt)

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(note.createdAt)

    return (
        <>
            <EditorToolbar editor={editor} />
            <div className="max-w-[850px] mx-auto w-full px-8 py-12 pb-32">
                <input
                    className="w-full bg-transparent border-none text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:ring-0 px-0 mb-4 leading-tight outline-none"
                    placeholder="Untitled Note"
                    type="text"
                    value={note.title}
                    onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
                />

                <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 mb-8 border-b border-slate-100 dark:border-border-dark pb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        <span>{note.ownerName || 'Created by you'}</span>
                    </div>
                </div>

                {/* Using Tiptap Editor Content */}
                <article>
                    <TiptapEditorContent editor={editor} />
                </article>
            </div>
        </>
    )
}
