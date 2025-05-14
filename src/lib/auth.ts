import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { Database } from '@/lib/supabase/types'

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: { expires?: Date }) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: { expires?: Date }) => {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )
})

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
} 