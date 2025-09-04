/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: undefined,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Disable ESLint during production builds to avoid failing the build on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during production builds to avoid failing the build on TS errors
    ignoreBuildErrors: true,
  },
  // Ensure SWC minification is enabled for optimized production bundles (enabled by default)
  swcMinify: true,
};

export default nextConfig;
