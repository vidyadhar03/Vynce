'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Create the user account with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      })
      
      if (signUpError) throw signUpError
      
      if (data?.user) {
        // After successful sign-up, redirect to dashboard or confirmation page
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Error signing up:', err)
      setError(err.message || 'An unexpected error occurred during sign up')
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
                <h3 className="text-sm font-medium text-red-800">Sign up failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="name"
              name="name"
              type="text"
              required
              aria-describedby="name-description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4C7EFF] focus:ring-[#4C7EFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] sm:text-sm"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500" id="name-description">
            This is how you'll appear to other users
          </p>
        </div>
        
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
              aria-describedby="email-description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4C7EFF] focus:ring-[#4C7EFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] sm:text-sm"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500" id="email-description">
            We'll send a confirmation email to verify your account
          </p>
        </div>
        
        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              aria-describedby="password-description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4C7EFF] focus:ring-[#4C7EFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] sm:text-sm"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500" id="password-description">
            Use at least 6 characters with a mix of letters and numbers
          </p>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-[#4C7EFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          No spam, cancel anytime
        </p>
      </form>
    </div>
  )
} 