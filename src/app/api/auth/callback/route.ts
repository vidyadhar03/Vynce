import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

/**
 * Handle auth callback from Supabase auth providers (like email sign-up confirmation)
 * Required for the PKCE flow used by OAuth providers
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = cookies()
    // Create a Supabase client using cookies for session management
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: { expires?: Date }) => {
            cookieStore.set({ name, value, ...options })
          },
          remove: (name: string, options: { expires?: Date }) => {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          },
        },
      }
    )
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url))
} 