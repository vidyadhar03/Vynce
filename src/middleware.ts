import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for handling auth state and redirecting as needed
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client configured for use with middleware
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh the session if it exists and is expired
  await supabase.auth.getSession()
  
  return res
}

// Specify paths that should use this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)',
  ],
} 