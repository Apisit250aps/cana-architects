import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb' // เพิ่มขนาดจาก 1mb เป็น 8mb
    }
  },
  images:{
    unoptimized: true
  }
};

export default nextConfig;
