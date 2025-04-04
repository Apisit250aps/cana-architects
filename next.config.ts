import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb' // เพิ่มขนาดจาก 1mb เป็น 8mb
    }
  },
  images: {
    unoptimized: true, // ปิด Image Optimization ของ Next.js
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'canaarchitects.com',
        pathname: '/media/**'
      }
    ]
  }
}

export default nextConfig
