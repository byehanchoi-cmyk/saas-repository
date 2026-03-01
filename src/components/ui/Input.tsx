import React, { InputHTMLAttributes, useId } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export function Input({
    label,
    error,
    className = '',
    id,
    ...props
}: InputProps) {
    const reactId = useId()
    const inputId = id || props.name || reactId

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`form-input w-full rounded-xl border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 h-11 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none disabled:bg-slate-100 disabled:dark:bg-slate-800/50 disabled:text-slate-500 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-primary'} ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}
