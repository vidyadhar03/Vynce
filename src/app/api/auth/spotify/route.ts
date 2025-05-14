import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: { expires?: Date }) => {
            cookieStore.set({ name, value, ...options })
          },
          remove: (name: string, options: { expires?: Date }) => {
            cookieStore.set({ name, value: '', ...options })
          }
        }
      }
    )
    
    try {
      // Exchange code for access token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error_description || 'Failed to get Spotify access token')
      }

      // Store the tokens in Supabase
      const { error: updateError } = await supabase
        .from('user_connections')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          provider: 'spotify',
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        })

      if (updateError) throw updateError

      return NextResponse.redirect(`${requestUrl.origin}/dashboard?connection=spotify&status=success`)
    } catch (error) {
      console.error('Spotify auth error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/dashboard?connection=spotify&status=error&message=${encodeURIComponent(
          (error as Error).message
        )}`
      )
    }
  }

  // If no code, redirect to Spotify authorization
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: 'user-read-private user-read-email user-top-read user-read-recently-played',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state: Math.random().toString(36).substring(7),
  })}`

  return NextResponse.redirect(spotifyAuthUrl)
} 