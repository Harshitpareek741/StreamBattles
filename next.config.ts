import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Specify the protocol (e.g., 'https' or 'http')
        hostname: 'twitter-devv.s3.ap-south-1.amazonaws.com', // The hostname
        pathname: '**', // Match all paths (optional, can be adjusted if needed)
      },
    ],
  },
};

export default nextConfig;
