import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export const runtime = 'edge'

export async function GET() {
  try {
    console.log('Checking Supabase connection status...')
    
    // Create Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Try a direct query to Vynce_User as a connection test
    const { data: users, error: usersError } = await supabase
      .from('Vynce_User')
      .select('id, display_name, email')
      .limit(3)
    
    // Calculate connection status
    const connected = !usersError;
    const vynceUserExists = !usersError;
    
    // Get more info about the table if connected
    let tableData = {
      count: vynceUserExists ? 1 : 0,
      names: vynceUserExists ? ['Vynce_User'] : [],
      vynceUserExists
    };
    
    return NextResponse.json({
      status: connected ? 'success' : 'error',
      connected,
      tables: tableData,
      users: {
        error: usersError,
        data: users,
        count: users?.length || 0
      },
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Missing ✗',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗',
      }
    })
  } catch (error) {
    console.error('Unexpected error checking connection:', error)
    
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Unexpected error checking Supabase connection',
      error: String(error),
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Missing ✗',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗',
      }
    }, { status: 500 })
  }
} 