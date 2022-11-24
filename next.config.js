/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["aptosfoundation.org", "s2.coinmarketcap.com"],
  },
};

module.exports = nextConfig;
