'use client'

import { useState, useTransition } from 'react'
import { signInAction, signUpAction, signInWithOAuth } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function AuthForm() {
    const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setError(null)
        setSuccess(null)

        startTransition(async () => {
            const action = activeTab === 'signIn' ? signInAction : signUpAction
            const result = (await action(formData)) as { error?: string; success?: string }

            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(result.success)
                // Switch to sign in tab on successful sign up, but keep success message
                if (activeTab === 'signUp') {
                    setActiveTab('signIn')
                }
            }
        })
    }

    const handleOAuth = (provider: 'google' | 'apple') => {
        setError(null)
        startTransition(async () => {
            await signInWithOAuth(provider)
        })
    }

    return (
        <div className="w-full max-w-[420px] flex flex-col gap-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-4 self-center">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
                    <span className="material-symbols-outlined text-xl">edit_note</span>
                </div>
                <span className="text-xl font-black tracking-tight dark:text-white">NoteCloud</span>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-200 dark:bg-surface-dark rounded-xl w-full">
                <button
                    onClick={() => setActiveTab('signIn')}
                    type="button"
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'signIn'
                        ? 'text-slate-700 dark:text-white bg-white dark:bg-background-dark shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setActiveTab('signUp')}
                    type="button"
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'signUp'
                        ? 'text-slate-700 dark:text-white bg-white dark:bg-background-dark shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Create Account
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-2 text-center lg:text-left">
                <h1 className="text-3xl font-black tracking-tight dark:text-white">
                    {activeTab === 'signIn' ? 'Welcome back' : 'Create an Account'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {activeTab === 'signIn'
                        ? 'Enter your details to access your workspace.'
                        : 'Enter your details to register.'}
                </p>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded-lg dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                    {success}
                </div>
            )}

            <form action={handleSubmit} className="flex flex-col gap-5">
                <Input
                    name="email"
                    type="email"
                    required
                    label="Email address"
                    placeholder="name@company.com"
                />
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Password</span>
                        {activeTab === 'signIn' && (
                            <a className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline" href="#">
                                Forgot password?
                            </a>
                        )}
                    </div>
                    <Input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                    />
                </div>
                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isPending}
                    className="mt-2"
                >
                    {activeTab === 'signIn' ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-300 dark:border-border-dark" />
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Or continue with
                </span>
                <div className="flex-grow border-t border-slate-300 dark:border-border-dark" />
            </div>

            {/* Social Auth */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="secondary"
                    onClick={() => handleOAuth('google')}
                    disabled={isPending}
                    type="button"
                    className="flex-1 gap-2"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span>Google</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handleOAuth('apple')}
                    disabled={isPending}
                    type="button"
                    className="flex-1 gap-2"
                >
                    <svg className="h-5 w-5 dark:fill-white fill-slate-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 12.625c0-2.625 2.135-3.875 2.23-3.925-1.215-1.77-3.11-2.01-3.785-2.04-1.61-.165-3.145.95-3.965.95-.82 0-2.095-.925-3.445-.9-1.77.025-3.415 1.05-4.325 2.665-1.845 3.255-.47 8.08 1.325 10.705.88 1.285 1.93 2.725 3.31 2.67 1.32-.055 1.82-.865 3.415-.865 1.595 0 2.045.865 3.435.84 1.435-.025 2.355-1.31 3.235-2.615 1.02-1.505 1.44-2.965 1.455-3.045-.035-.015-2.79-1.085-2.79-4.335zM15.42 2.925c.72-.88 1.205-2.105 1.07-3.325-1.035.04-2.29.695-3.03 1.56-.66.755-1.235 1.965-1.08 3.125 1.15.09 2.325-.48 3.04-1.36z"></path>
                    </svg>
                    <span>Apple</span>
                </Button>
            </div>

            <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                By continuing you agree to our <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
            </p>
        </div>
    )
}
