import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/serverClient'
import type { PostgrestError } from '@supabase/supabase-js'

// Ensures route is not cached
export const dynamic = 'force-dynamic'

// Define types for our diagnostic data
type TableEntry = string
type ErrorDetails = unknown

interface DiagnosticsData {
  timestamp: string
  environment: string | undefined
  checks: {
    env: {
      supabaseUrl: boolean
      supabaseAnonKey: boolean
      supabaseServiceKey: boolean
    }
    connection: {
      status: 'checking' | 'success' | 'error' | 'warning'
      error: ErrorDetails | null
    }
    tables: {
      status: 'checking' | 'success' | 'error' | 'warning'
      foundTables: TableEntry[]
      error: ErrorDetails | null
    }
    authService: {
      status: 'checking' | 'success' | 'error' | 'warning'
      error: ErrorDetails | null
    }
  }
}

export async function GET(request: Request) {
  try {
    const diagnostics: DiagnosticsData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        env: {
          supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          supabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        },
        connection: {
          status: 'checking',
          error: null
        },
        tables: {
          status: 'checking',
          foundTables: [],
          error: null
        },
        authService: {
          status: 'checking',
          error: null
        }
      }
    }

    // Create server client
    const supabase = createServerClient()
    
    // Check if we can connect at all
    try {
      const { data, error } = await supabase.from('health_check').select('id').limit(1)
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          diagnostics.checks.connection.status = 'success'
          diagnostics.checks.tables.status = 'warning'
          diagnostics.checks.tables.error = 'health_check table not found'
        } else {
          diagnostics.checks.connection.status = 'error'
          diagnostics.checks.connection.error = error
        }
      } else {
        diagnostics.checks.connection.status = 'success'
        diagnostics.checks.tables.status = 'success'
        diagnostics.checks.tables.foundTables.push('health_check')
      }
    } catch (error) {
      diagnostics.checks.connection.status = 'error'
      diagnostics.checks.connection.error = error
    }
    
    // Try to list tables if connection worked
    if (diagnostics.checks.connection.status === 'success') {
      try {
        // This requires service role, so it might fail with anon key
        const { data, error } = await supabase
          .from('pg_catalog.pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
        
        if (!error && data) {
          // Cast to any to handle potential schema mismatch
          const tableData = data as any[]
          diagnostics.checks.tables.foundTables = tableData.map(t => t.tablename)
        }
      } catch (e) {
        // Don't modify status if this fails, as it's a supplementary check
        console.error('Failed to list tables:', e)
      }
    }
    
    // Check auth service
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        diagnostics.checks.authService.status = 'error'
        diagnostics.checks.authService.error = error
      } else {
        diagnostics.checks.authService.status = 'success'
      }
    } catch (error) {
      diagnostics.checks.authService.status = 'error'
      diagnostics.checks.authService.error = error
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed', details: error },
      { status: 500 }
    )
  }
} 