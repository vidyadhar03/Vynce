import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Default redirect URL for the hosted environment
const defaultRedirectUrl = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}/auth/callback`
  : process.env.NEXT_PUBLIC_SUPABASE_GOOGLE_REDIRECT_URL

/**
 * Singleton Supabase client for use in the browser.
 * Typed with our database schema for better DX.
 */
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce', // Required for OAuth providers like Google
    },
  }
)

/**
 * Helper function to get the redirect URL for OAuth flows
 */
export const getRedirectUrl = () => defaultRedirectUrl 