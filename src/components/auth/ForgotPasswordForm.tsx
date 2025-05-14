'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (resetError) throw resetError
      
      setSuccessMessage(`Password reset link sent to ${email}. Please check your inbox.`)
    } catch (err: any) {
      console.error('Error sending password reset:', err)
      setError(err.message || 'Failed to send password reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display error message if present */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display success message if present */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4C7EFF] focus:ring-[#4C7EFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={loading || !email}
            className="flex w-full justify-center rounded-md bg-[#4C7EFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/sign-in" className="font-medium text-[#4C7EFF] hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
} 