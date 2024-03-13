/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, _) => ({
    ...config,
    watchOptions: {
      ...config.watchOptions,
      poll: 800,
      aggregateTimeout: 300,
    },
  }),
  transpilePackages: ['@mui/x-charts'],
  async rewrites() {
    return [
      {
        source: "/be/swagger/:path*",
        destination: (process.env.NUTRINOVA_API_URL || "/") + "/swagger/:path*", // Proxy to Backend
      },
      {
        source: "/be/:path*",
        destination: (process.env.NUTRINOVA_API_URL || "/") + "/be/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
