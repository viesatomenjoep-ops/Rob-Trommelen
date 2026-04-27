import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const path = request.nextUrl.pathname
  
  // OPTIMIZATION: Only run Supabase auth checks on admin routes or login page.
  if (!path.startsWith('/admin') && !path.startsWith('/login') && !path.startsWith('/cms-login')) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect the admin routes
  if (path.startsWith('/admin') && !path.startsWith('/cms-login')) {
    // If the user is not authenticated and trying to access /admin, redirect them to /cms-login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/cms-login'
      return NextResponse.redirect(url)
    }
  }

  // If user is authenticated and hits /cms-login, redirect to /admin
  if (path === '/cms-login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
