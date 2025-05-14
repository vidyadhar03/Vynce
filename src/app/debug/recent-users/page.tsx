'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  display_name: string
  email: string
  top_genre: string | null
  share_card_count: number
  plus_plan: boolean
}

export default function RecentUsersDebugPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch('/api/users/recent')
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setUsers(data.users || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError(`Failed to load users: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Recent Users Debug</h1>
      
      {loading && <p className="text-gray-600">Loading users...</p>}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6">
          <h3 className="font-medium">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-600">No users found.</p>
      )}
      
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Top Genre</th>
                <th className="py-2 px-4 border-b text-left">Share Cards</th>
                <th className="py-2 px-4 border-b text-left">Plus Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-mono text-sm">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.display_name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.top_genre || '-'}</td>
                  <td className="py-2 px-4 border-b">{user.share_card_count}</td>
                  <td className="py-2 px-4 border-b">
                    {user.plus_plan ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">API Response Debug</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap overflow-x-auto">{JSON.stringify({ users }, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
} 