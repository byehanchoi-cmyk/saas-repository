'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: '이메일과 비밀번호를 입력해주세요.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Handling standard Supabase error messages into Korean for UX
        if (error.message.includes('Invalid login credentials')) {
            return { error: '이메일 또는 비밀번호가 일치하지 않습니다.' }
        }
        return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signUpAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: '이메일과 비밀번호를 입력해주세요.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        if (error.message.includes('User already registered')) {
            return { error: '이미 가입된 이메일입니다.' }
        }
        if (error.message.includes('Email address') && error.message.includes('invalid')) {
            return { error: '유효하지 않은 이메일 형식 또는 도메인입니다. 다른 이메일을 사용해주세요.' }
        }
        if (error.message.includes('Email rate limit exceeded')) {
            return { error: '이메일 발송 제한을 초과했습니다. 잠시 후 다시 시도하시거나, Supabase 대시보드에서 Rate Limit 설정을 확인해 주세요.' }
        }
        return { error: error.message }
    }

    return { success: '가입 확인 이메일이 전송되었습니다. 이메일을 확인해 주세요.' }
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
