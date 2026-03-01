import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const protectedRoutes = ['/dashboard', '/notes', '/note', '/settings', '/payment']
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/auth/signout') &&
        !request.nextUrl.pathname.startsWith('/api/auth')
    const isRootRoute = request.nextUrl.pathname === '/'

    if (!user && isProtectedRoute) {
        // Redirect unauthenticated users trying to access protected routes to /auth
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        return NextResponse.redirect(url)
    }

    if (user && (isAuthRoute || isRootRoute)) {
        // Redirect authenticated users trying to access auth/root routes to /dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
