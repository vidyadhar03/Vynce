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
      // Exchange the code for an access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
          code,
        }),
      });

      const shortLivedData = await tokenResponse.json();
      
      if (!shortLivedData.access_token) {
        throw new Error('Failed to get Instagram access token');
      }
      
      // Exchange short-lived token for a long-lived token
      const longLivedResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${
          process.env.INSTAGRAM_CLIENT_SECRET
        }&access_token=${shortLivedData.access_token}`
      );
      
      const longLivedData = await longLivedResponse.json();
      
      if (!longLivedData.access_token) {
        throw new Error('Failed to get long-lived Instagram access token');
      }

      // Store the tokens in Supabase
      const { error: updateError } = await supabase
        .from('user_connections')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          provider: 'instagram',
          access_token: longLivedData.access_token,
          expires_at: new Date(Date.now() + longLivedData.expires_in * 1000).toISOString(),
        })

      if (updateError) throw updateError

      return NextResponse.redirect(`${requestUrl.origin}/dashboard?connection=instagram&status=success`)
    } catch (error) {
      console.error('Instagram auth error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/dashboard?connection=instagram&status=error&message=${encodeURIComponent(
          (error as Error).message
        )}`
      )
    }
  }

  // If no code, redirect to Instagram authorization
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?${new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    scope: 'user_profile,user_media',
    response_type: 'code',
  })}`

  return NextResponse.redirect(instagramAuthUrl)
} 