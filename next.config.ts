/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Routerのみを使用する設定
  experimental: {
    appDir: true,
    pagesDir: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
