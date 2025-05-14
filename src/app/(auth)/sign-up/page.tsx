import { Metadata } from 'next'
import Link from 'next/link'
import SignUpForm from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Create Account | Vynce',
  description: 'Sign up for Vynce and generate unique insights from your Spotify and Instagram data',
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create your first insight in 30 seconds
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Spotify and Instagram data to see what story they tell
          </p>
        </div>

        <SignUpForm />
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-[#4C7EFF] hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 