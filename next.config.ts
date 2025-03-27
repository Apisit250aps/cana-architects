import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb' // เพิ่มขนาดจาก 1mb เป็น 8mb
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "canaarchitects.com",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
