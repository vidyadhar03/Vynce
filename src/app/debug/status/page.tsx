'use client'

import { useState, useEffect } from 'react'

type ConnectionStatus = {
  status: 'success' | 'error'
  connected: boolean
  tables?: {
    count: number
    names: string[]
    vynceUserExists: boolean
  }
  users?: {
    error: any
    data: any
  }
  env: {
    url: string
    key: string
  }
  message?: string
  error?: any
}

export default function StatusPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true)
        const response = await fetch('/api/supabase-status')
        const data = await response.json()
        setStatus(data)
      } catch (err) {
        setError('Failed to check Supabase status')
        console.error('Error checking status:', err)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-gray-600">Checking Supabase connection...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Connection Status</h1>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 p-6">
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-2 ${status?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h2 className="text-xl font-semibold">
              {status?.connected ? 'Connected' : 'Not Connected'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-2">
                  <div>NEXT_PUBLIC_SUPABASE_URL:</div>
                  <div>{status?.env.url}</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
                  <div>{status?.env.key}</div>
                </div>
              </div>
            </div>
            
            {status?.tables && (
              <div>
                <h3 className="font-medium mb-2">Tables</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="mb-2">Total Tables: {status.tables.count}</div>
                  <div className="mb-2">
                    Vynce_User Table: 
                    <span className={status.tables.vynceUserExists ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                      {status.tables.vynceUserExists ? 'Exists ✓' : 'Missing ✗'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Available Tables:</div>
                    <ul className="list-disc list-inside pl-2">
                      {status.tables.names.map((name) => (
                        <li key={name} className="text-sm">
                          {name}
                          {name === 'Vynce_User' && <span className="text-green-600 ml-2">✓</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {status?.users && (
              <div>
                <h3 className="font-medium mb-2">Vynce_User Data</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {status.users.error ? (
                    <div className="text-red-600">
                      Error: {JSON.stringify(status.users.error, null, 2)}
                    </div>
                  ) : (
                    <div>
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(status.users.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {status?.error && (
              <div>
                <h3 className="font-medium text-red-600 mb-2">Error</h3>
                <div className="bg-red-50 p-4 rounded">
                  <pre className="text-sm whitespace-pre-wrap text-red-600">
                    {JSON.stringify(status.error, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <a 
            href="/debug/recent-users" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Recent Users
          </a>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  )
} 