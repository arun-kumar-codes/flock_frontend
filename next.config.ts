import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "videodelivery.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "customer-2134ee9mui3goprl.cloudflarestream.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "116.202.210.102",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
