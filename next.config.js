/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000", // optional, works if you specify
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // optional
        pathname: "/media/**",
      },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL_API,
  },
};

module.exports = nextConfig;
