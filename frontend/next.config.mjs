/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:5050/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
