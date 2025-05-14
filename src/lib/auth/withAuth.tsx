import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import type { ReactNode } from 'react'

interface WithAuthProps {
  children: ReactNode
}

/**
 * Higher-order server component to protect routes from unauthenticated users
 * Usage: export default function Page() { return <WithAuth><YourContent /></WithAuth> }
 */
export async function WithAuth({ children }: WithAuthProps) {
  const user = await getUser()
  
  if (!user) {
    // Redirect unauthenticated users to sign-in page
    redirect('/sign-in')
  }
  
  // If authenticated, render children
  return <>{children}</>
} 