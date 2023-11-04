// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: "standalone",
  typescript: {
    // TODO: Remove this when there's no more errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "i.scdn.co",
      },
      {
        hostname: "mosaic.scdn.co",
      },
      {
        hostname: "wrapped-images.spotifycdn.com",
      },
      {
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        hostname: "newjams-images.scdn.co",
      },
    ],
  },
};

module.exports = nextConfig;
