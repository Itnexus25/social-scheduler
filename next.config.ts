import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Expose NEXT_PUBLIC_API_URL to both client and server
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  },

  // Webpack alias for resolving "@"
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "client/src"),
    };
    return config;
  },
};

export default nextConfig;