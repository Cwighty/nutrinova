/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, _) => ({
    ...config,
    watchOptions: {
      ...config.watchOptions,
      poll: 800,
      aggregateTimeout: 300,
    },
  }),
  async rewrites() {
    return [
      {
        source: '/api/swagger/:path*',
        destination: 'http://api:5000/swagger/:path*' // Proxy to Backend
      },
      {
        source: '/api/:path*',
        destination: 'http://api:5000/api/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig