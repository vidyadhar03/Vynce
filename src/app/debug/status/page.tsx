'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function StatusPage() {
  const [status, setStatus] = useState({
    supabase: 'Checking...',
    database: 'Checking...',
    auth: 'Checking...',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'dev'
  })
  const [errors, setErrors] = useState<Record<string, any>>({})
  const [envVars, setEnvVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'
  })
  
  const [apiDiagnostics, setApiDiagnostics] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)
  
  // Function to check API health
  const checkApiHealth = async () => {
    setApiLoading(true)
    try {
      const response = await fetch('/api/debug/health')
      if (response.ok) {
        const data = await response.json()
        setApiDiagnostics(data)
      } else {
        setApiDiagnostics({ error: 'Failed to fetch health data', status: response.status })
      }
    } catch (error) {
      setApiDiagnostics({ error: 'Error fetching health data', details: error })
    } finally {
      setApiLoading(false)
    }
  }
  
  useEffect(() => {
    async function checkStatus() {
      try {
        // First, check if we can connect to Supabase
        try {
          // Check Supabase connection with health check table
          const { data, error } = await supabase.from('health_check').select('*').limit(1)
          
          if (error) {
            console.error('Health check table error:', error)
            
            // If health_check table doesn't exist, try a fallback query
            if (error.code === '42P01') { // Table doesn't exist error
              try {
                // Try to query any existing table like profiles
                const fallback = await supabase.from('profiles').select('count').limit(1)
                
                if (!fallback.error) {
                  setStatus(prev => ({ ...prev, supabase: 'Connected', database: 'Available (no health table)' }))
                  setErrors(prev => ({ ...prev, database: { 
                    message: "Connected, but health_check table doesn't exist. Fallback query succeeded.",
                    originalError: error 
                  }}))
                } else {
                  setStatus(prev => ({ ...prev, supabase: 'Error', database: 'Error' }))
                  setErrors(prev => ({ 
                    ...prev, 
                    database: { 
                      message: "Failed fallback query after health_check table error", 
                      healthCheckError: error,
                      fallbackError: fallback.error
                    } 
                  }))
                }
              } catch (fallbackError) {
                setStatus(prev => ({ ...prev, supabase: 'Error', database: 'Error' }))
                setErrors(prev => ({ 
                  ...prev, 
                  database: { 
                    message: "Failed fallback after health_check table error", 
                    healthCheckError: error,
                    fallbackError 
                  } 
                }))
              }
            } else {
              // Not a "table doesn't exist" error, so it's a different problem
              setStatus(prev => ({ ...prev, supabase: 'Error', database: 'Error' }))
              setErrors(prev => ({ 
                ...prev, 
                database: error 
              }))
            }
          } else {
            setStatus(prev => ({ ...prev, supabase: 'Connected', database: 'Available' }))
            setErrors(prev => ({ ...prev, database: null }))
          }
        } catch (dbError) {
          console.error('Database connection error:', dbError)
          setStatus(prev => ({ ...prev, supabase: 'Error', database: 'Error' }))
          setErrors(prev => ({ ...prev, database: dbError }))
        }
        
        // Check Auth service separately
        try {
          const { data: authData, error: authError } = await supabase.auth.getSession()
          
          if (authError) {
            setStatus(prev => ({ ...prev, auth: 'Error' }))
            setErrors(prev => ({ ...prev, auth: authError }))
            console.error('Auth error:', authError)
          } else {
            setStatus(prev => ({ ...prev, auth: 'Available' }))
            setErrors(prev => ({ ...prev, auth: null }))
          }
        } catch (authError) {
          console.error('Auth connection error:', authError)
          setStatus(prev => ({ ...prev, auth: 'Error' }))
          setErrors(prev => ({ ...prev, auth: authError }))
        }
      } catch (error) {
        console.error('Status check error:', error)
        setStatus(prev => ({
          ...prev,
          supabase: 'Error',
          database: 'Error',
          auth: 'Error'
        }))
        setErrors(prev => ({ ...prev, general: error }))
      }
    }
    
    checkStatus()
    // Also check the API health for a server-side perspective
    checkApiHealth()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">System Status</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium">Environment Variables</h2>
          </div>
          
          <div className="px-6 py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={`font-medium ${envVars.url.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {envVars.url}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className={`font-medium ${envVars.key.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {envVars.key}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium">Service Status (Client-side)</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <StatusItem 
              name="Supabase Connection" 
              status={status.supabase}
              isOk={status.supabase === 'Connected'}
            />
            <StatusItem 
              name="Database" 
              status={status.database}
              isOk={status.database.includes('Available')}
            />
            <StatusItem 
              name="Authentication" 
              status={status.auth}
              isOk={status.auth === 'Available'}
            />
          </div>
          
          {/* Error Details */}
          {(errors.database || errors.auth || errors.general) && (
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-md font-medium text-red-600 mb-2">Error Details</h3>
              <div className="space-y-4">
                {errors.database && (
                  <div>
                    <h4 className="text-sm font-medium">Database Error:</h4>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(errors.database, null, 2)}
                    </pre>
                  </div>
                )}
                {errors.auth && (
                  <div>
                    <h4 className="text-sm font-medium">Auth Error:</h4>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(errors.auth, null, 2)}
                    </pre>
                  </div>
                )}
                {errors.general && (
                  <div>
                    <h4 className="text-sm font-medium">General Error:</h4>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(errors.general, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Server-side API Health Check */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Server-side Health Check</h2>
            <button 
              onClick={checkApiHealth} 
              disabled={apiLoading}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
            >
              {apiLoading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
          
          <div className="px-6 py-4">
            {!apiDiagnostics ? (
              <p className="text-gray-500 italic">Loading diagnostics...</p>
            ) : apiDiagnostics.error ? (
              <div className="text-red-600">
                <p className="font-medium">Failed to load server diagnostics</p>
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(apiDiagnostics, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Environment Checks */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Environment Checks:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span className={apiDiagnostics.checks.env.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
                      {apiDiagnostics.checks.env.supabaseUrl ? 'Set ✓' : 'Missing ✗'}
                    </span>
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <span className={apiDiagnostics.checks.env.supabaseAnonKey ? 'text-green-600' : 'text-red-600'}>
                      {apiDiagnostics.checks.env.supabaseAnonKey ? 'Set ✓' : 'Missing ✗'}
                    </span>
                    <span>SUPABASE_SERVICE_ROLE_KEY:</span>
                    <span className={apiDiagnostics.checks.env.supabaseServiceKey ? 'text-green-600' : 'text-red-600'}>
                      {apiDiagnostics.checks.env.supabaseServiceKey ? 'Set ✓' : 'Missing ✗'}
                    </span>
                  </div>
                </div>
                
                {/* Connection Status */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Connection Status:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Supabase Connection:</span>
                      <StatusBadge status={apiDiagnostics.checks.connection.status} />
                    </div>
                    <div className="flex justify-between">
                      <span>Database Tables:</span>
                      <StatusBadge status={apiDiagnostics.checks.tables.status} />
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Service:</span>
                      <StatusBadge status={apiDiagnostics.checks.authService.status} />
                    </div>
                  </div>
                </div>
                
                {/* Available Tables */}
                {apiDiagnostics.checks.tables.foundTables && 
                 apiDiagnostics.checks.tables.foundTables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Available Tables:</h3>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {apiDiagnostics.checks.tables.foundTables.map((table: string) => (
                        <span key={table} className="py-1">• {table}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Server Errors */}
                {(apiDiagnostics.checks.connection.error || 
                  apiDiagnostics.checks.tables.error || 
                  apiDiagnostics.checks.authService.error) && (
                  <div>
                    <h3 className="text-sm font-medium text-red-600 mb-2">Server-side Errors:</h3>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify({
                        connection: apiDiagnostics.checks.connection.error,
                        tables: apiDiagnostics.checks.tables.error,
                        auth: apiDiagnostics.checks.authService.error
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium">Application Info</h2>
          </div>
          
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">{status.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment</span>
              <span className="font-medium">{process.env.NODE_ENV}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next.js</span>
              <span className="font-medium">14.1.0</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ name, status, isOk }: { name: string, status: string, isOk: boolean }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <span className="text-gray-700">{name}</span>
      <span 
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Checking...' 
            ? 'bg-gray-100 text-gray-800' 
            : isOk 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
        }`}
      >
        {status}
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor;
  let textColor;
  
  switch (status) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {status === 'checking' ? 'Checking...' : status}
    </span>
  );
} 