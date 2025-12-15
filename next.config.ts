import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "192.168.35.181:3000",
        "localhost:3000",
        "petudy.app",
        "www.petudy.app",
        "petudy-official.vercel.app"
      ],
    },
  },
};

export default nextConfig;
