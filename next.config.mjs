/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: false
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url))
  }
};

export default nextConfig;
