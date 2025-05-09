/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      http2: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:events": "events",
      "node:stream": "stream",
      "node:util": "util",
    };
    return config;
  },
}

export default nextConfig
