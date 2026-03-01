import { signInAction, signUpAction, signInWithOAuth } from './auth.actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Mock next/cache and next/navigation
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}))

// Mock Supabase Server Client
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(),
}))

describe('Auth Actions', () => {
    let mockSupabase: any

    beforeEach(() => {
        jest.clearAllMocks()

        // Setup default mock Supabase client
        mockSupabase = {
            auth: {
                signInWithPassword: jest.fn(),
                signUp: jest.fn(),
                signInWithOAuth: jest.fn(),
            }
        }

            ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)
    })

    describe('signUpAction', () => {
        it('should return error if email or password is missing', async () => {
            const formDataEmailMissing = new FormData()
            formDataEmailMissing.append('password', 'password123')

            const result1 = await signUpAction(formDataEmailMissing)
            expect(result1).toEqual({ error: '이메일과 비밀번호를 입력해주세요.' })

            const formDataPasswordMissing = new FormData()
            formDataPasswordMissing.append('email', 'test@example.com')

            const result2 = await signUpAction(formDataPasswordMissing)
            expect(result2).toEqual({ error: '이메일과 비밀번호를 입력해주세요.' })
        })

        it('should call supabase.auth.signUp and return success', async () => {
            mockSupabase.auth.signUp.mockResolvedValue({ data: {}, error: null })

            const formData = new FormData()
            formData.append('email', 'test@example.com')
            formData.append('password', 'password123')

            const result = await signUpAction(formData)

            expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                options: expect.any(Object)
            })
            expect(result).toEqual({ success: '가입 확인 이메일이 전송되었습니다. 이메일을 확인해 주세요.' })
        })

        it('should handle rate limit error correctly', async () => {
            mockSupabase.auth.signUp.mockResolvedValue({
                data: {},
                error: { message: 'Email rate limit exceeded' }
            })

            const formData = new FormData()
            formData.append('email', 'test@example.com')
            formData.append('password', 'password123')

            const result = await signUpAction(formData)

            expect(result).toEqual({
                error: '이메일 발송 제한을 초과했습니다. 잠시 후 다시 시도하시거나, Supabase 대시보드에서 Rate Limit 설정을 확인해 주세요.'
            })
        })
    })

    describe('signInAction', () => {
        it('should call supabase.auth.signInWithPassword and redirect on success', async () => {
            mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null })

            const formData = new FormData()
            formData.append('email', 'test@example.com')
            formData.append('password', 'password123')

            await signInAction(formData)

            expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(redirect).toHaveBeenCalledWith('/dashboard')
        })

        it('should handle invalid credentials error correctly', async () => {
            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: {},
                error: { message: 'Invalid login credentials' }
            })

            const formData = new FormData()
            formData.append('email', 'test@example.com')
            formData.append('password', 'wrongpassword')

            const result = await signInAction(formData)

            expect(result).toEqual({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' })
            expect(redirect).not.toHaveBeenCalled()
        })
    })
})
