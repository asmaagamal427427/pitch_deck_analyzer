/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Ensure we're not using static export
  trailingSlash: false,
  // Enable dynamic routes and server actions
  experimental: {
    appDir: true,
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

module.exports = nextConfig;