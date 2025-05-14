import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase/types'

/**
 * Get the authenticated user from server components
 * @returns The user object or null if not authenticated
 */
export async function getUser() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  const { data: { session } } = await supabase.auth.getSession()
  
  return session?.user || null
} 