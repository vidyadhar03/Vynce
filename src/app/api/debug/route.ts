import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/serverClient'

export const runtime = 'edge'

export async function GET() {
  try {
    // Get environment variable information (redacting actual values)
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set',
    }
    
    // Create client but catch any errors with its creation
    let supabaseClient
    try {
      supabaseClient = createServerClient()
    } catch (clientError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create Supabase client',
        error: String(clientError),
        envInfo
      })
    }
    
    // Try to query for Vynce_User table information
    const { data: vynceUserData, error: vynceUserError } = await supabaseClient
      .from('Vynce_User')
      .select('id, display_name, email')
      .limit(1)
    
    // Get list of all tables from Supabase info schema
    let tablesData = null
    let tablesError = null
    try {
      const result = await supabaseClient
        .rpc('get_tables')
      tablesData = result.data
      tablesError = result.error
    } catch (rpcError) {
      tablesError = { message: 'RPC get_tables not available: ' + String(rpcError) }
    }
    
    // Return detailed debug info
    return NextResponse.json({
      status: 'success',
      envInfo,
      vynceUser: {
        data: vynceUserData,
        error: vynceUserError,
        found: Array.isArray(vynceUserData) && vynceUserData.length > 0
      },
      tables: {
        data: tablesData,
        error: tablesError
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error in debug route',
      error: String(error)
    }, { status: 500 })
  }
} 