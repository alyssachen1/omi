// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables extra React checks in dev
  swcMinify: true, // Uses SWC for faster builds (default in Next.js 12+)

  images: {
    domains: ["pbs.twimg.com"], // Add more domains as needed
  },

  webpack(config) {
    // Enable @ alias for cleaner imports
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
