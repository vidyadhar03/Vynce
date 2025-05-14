'use client'

import { useEffect, useState } from 'react'

interface EnvInfo {
  NEXT_PUBLIC_SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  [key: string]: string
}

interface DebugData {
  status: string
  envInfo: EnvInfo
  vynceUser: {
    data: any[]
    error: any
    found: boolean
  }
  tables: {
    data: any
    error: any
  }
}

export default function EnvDebugPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setLoading(true)
        const response = await fetch('/api/debug')
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Error fetching debug info:', err)
        setError(`Failed to load debug info: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Environment Debug</h1>
      
      {loading && <p className="text-gray-600">Loading debug info...</p>}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6">
          <h3 className="font-medium">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Variable</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.envInfo && Object.entries(data.envInfo).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 font-mono text-sm">{key}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          value === 'set' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Vynce_User Table Access</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {data.vynceUser?.error ? (
                <div className="text-red-600">
                  <p className="font-bold">Error accessing Vynce_User table:</p>
                  <pre className="mt-2 p-3 bg-red-50 rounded overflow-auto text-sm">
                    {JSON.stringify(data.vynceUser.error, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-green-600">
                  <p>Successfully connected to Vynce_User table</p>
                  <p className="mt-2">
                    {data.vynceUser?.found 
                      ? 'Found records in the table' 
                      : 'Table exists but no records found'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Raw Debug Data</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 