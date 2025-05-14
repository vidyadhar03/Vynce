import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vynce - Your Personal Insight Companion',
  description: 'Turn your Spotify and Instagram data into playful, shareable insight cards.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAFAFA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <NavBar 
              cta={{
                label: 'Register',
                href: '/sign-up',
              }}
            />
            
            <main>{children}</main>
            
            <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
              <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Vynce. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
