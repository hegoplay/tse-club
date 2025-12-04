import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://kltn-uploads.s3.ap-southeast-1.amazonaws.com/**"),
      new URL("http://localhost:9000/kltn-bucket/**"),
    ],
  },
};

export default nextConfig;
