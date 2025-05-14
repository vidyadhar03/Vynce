import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'
import { createServerClient } from '@/lib/supabase/serverClient'

// Change to dynamic rendering to make debugging easier
export const dynamic = 'force-dynamic'

type RecentUser = Pick<
  Database['public']['Tables']['Vynce_User']['Row'],
  'id' | 'display_name' | 'email' | 'top_genre' | 'share_card_count' | 'plus_plan'
>

/**
 * Fetches 10 most recent Vynce users with selected fields
 * @route GET /api/users/recent
 * @returns {Promise<NextResponse>} JSON response with users array or error
 */
export async function GET() {
  try {
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    }
    
    // Create edge-compatible Supabase client with service role key
    const supabase = createServerClient()
    
    // Query the Vynce_User table
    const result = await supabase
      .from('Vynce_User')
      .select('id, display_name, email, top_genre, share_card_count, plus_plan')
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Check for Supabase query errors
    if (result.error) {
      console.error('Supabase query error:', result.error)
      return NextResponse.json({ 
        users: [],
        error: `Database error: ${result.error.message}`,
        code: result.error.code
      }, { status: 500 })
    }
    
    console.log('API response:', { data: result.data?.length || 0 })
    
    // Return the data or an empty array if there's no data
    return NextResponse.json({ 
      users: result.data || []
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    
    // Return an error with more details
    return NextResponse.json({ 
      users: [],
      error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 })
  }
} 