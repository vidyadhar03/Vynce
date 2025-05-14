import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase/types'

/**
 * Get the authenticated user from server components
 * @returns The user object or null if not authenticated
 */
export async function getUser() {
  const cookieStore = cookies()
  
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
  
  const { data: { session } } = await supabase.auth.getSession()
  
  return session?.user || null
} 