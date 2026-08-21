/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Stripe webhook needs raw body — disable body parsing for that route
  experimental: {
    serverComponentsExternalPackages: ["stripe"],
  },
};

module.exports = nextConfig;
