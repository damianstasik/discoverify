// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  typescript: {
    // TODO: Remove this when there's no more errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
