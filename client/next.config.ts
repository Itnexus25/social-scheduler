import { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from the server root .env file
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'client/src'), // Adding alias for "@" to resolve to the /src folder
    };
    return config;
  },
  // Expose NEXT_PUBLIC_API_URL to both client and server code.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;