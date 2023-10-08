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
        source: '/api/:path*',
        destination: 'http://api:5000/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig