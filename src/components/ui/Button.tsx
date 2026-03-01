import React, { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-all disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark'

    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] focus:ring-primary',
        secondary: 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-[#252a35] text-slate-900 dark:text-white',
        outline: 'bg-transparent border border-slate-300 dark:border-slate-600 hover:border-primary hover:text-primary dark:hover:text-primary text-slate-700 dark:text-white',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-600 dark:text-slate-400',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 active:scale-[0.98] focus:ring-red-500',
    }

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
    }

    const classes = [
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <button className={classes} disabled={disabled || isLoading} {...props}>
            {isLoading ? (
                <span className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    )
}
