import { Metadata } from 'next'
import Image from 'next/image'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign In | Vynce',
  description: 'Sign in to your Vynce account to connect your Spotify and Instagram data',
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome back to Vynce
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue where you left off
          </p>
        </div>

        <SignInForm />
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Trusted by early adopters at Google, Berklee, and Stanford</p>
        </div>
      </div>
    </div>
  )
} 