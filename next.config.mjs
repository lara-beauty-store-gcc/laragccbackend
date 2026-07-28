/** @type {import('next').NextConfig} */
const apiBase =
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  'https://api.larabeauty.store';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = apiBase.replace(/\/$/, '');
    return [
      {
        source: '/api/v1/orders',
        destination: `${backend}/api/v1/orders`,
      },
    ];
  },
};

export default nextConfig;
