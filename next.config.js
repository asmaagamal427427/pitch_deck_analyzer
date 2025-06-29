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
  // Enable dynamic routes
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;