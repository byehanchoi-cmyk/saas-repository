'use client'

import { Editor } from '@tiptap/react'

export interface EditorToolbarProps {
    editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) {
        return <div className="sticky top-0 z-10 flex items-center justify-center border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-2 h-[57px]"></div>
    }

    return (
        <div className="sticky top-0 z-10 flex items-center justify-center border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-border-dark shadow-sm">
                <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-border-dark pr-2 mr-1">
                    <select
                        className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 border-none focus:ring-0 cursor-pointer h-8 rounded hover:bg-slate-200 dark:hover:bg-border-dark px-2"
                        onChange={(e) => {
                            const val = e.target.value
                            if (val === 'p') editor.chain().focus().setParagraph().run()
                            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
                            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
                            else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }}
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                                editor.isActive('heading', { level: 2 }) ? 'h2' :
                                    editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
                        }
                    >
                        <option value="p">Normal Text</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Bold"
                >
                    <span className="material-symbols-outlined text-[20px]">format_bold</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Italic"
                >
                    <span className="material-symbols-outlined text-[20px]">format_italic</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('underline') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Underline"
                >
                    <span className="material-symbols-outlined text-[20px]">format_underlined</span>
                </button>

                <div className="w-px h-4 bg-slate-300 dark:bg-border-dark mx-1"></div>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Bullet List"
                >
                    <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Numbered List"
                >
                    <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark transition-colors ${editor.isActive('taskList') ? 'bg-slate-200 dark:bg-border-dark text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                    title="Checklist"
                >
                    <span className="material-symbols-outlined text-[20px]">check_box</span>
                </button>

                <div className="w-px h-4 bg-slate-300 dark:bg-border-dark mx-1"></div>

                <button onClick={() => {
                    const url = window.prompt('URL')
                    if (url) editor.chain().focus().setImage({ src: url }).run()
                }} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 transition-colors" title="Insert Image">
                    <span className="material-symbols-outlined text-[20px]">image</span>
                </button>
                <button onClick={() => {
                    const url = window.prompt('URL')
                    if (url) editor.chain().focus().setLink({ href: url }).run()
                }} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 transition-colors" title="Insert Link">
                    <span className="material-symbols-outlined text-[20px]">link</span>
                </button>
            </div>
        </div>
    )
}
