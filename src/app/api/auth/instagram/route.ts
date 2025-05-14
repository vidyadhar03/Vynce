import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange code for access token
      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
          code,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error_description || 'Failed to get Instagram access token')
      }

      // Get long-lived access token
      const longLivedTokenResponse = await fetch(
        `https://graph.instagram.com/access_token?${new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          access_token: data.access_token,
        })}`
      )

      const longLivedData = await longLivedTokenResponse.json()

      if (longLivedData.error) {
        throw new Error(longLivedData.error.message || 'Failed to get long-lived access token')
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