import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
})(nextConfig) 