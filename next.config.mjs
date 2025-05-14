import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Vercel specific config
  output: 'standalone',
  experimental: {
    // This is experimental but can help with Vercel deployments
    serverComponentsExternalPackages: []
  }
}

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  // Skip PWA in development mode
  skipWaiting: true
})(nextConfig) 