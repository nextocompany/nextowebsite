import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style output so /en is served as out/en/index.html on Cloudflare.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Two root layouts (Thai and English) need a 404 page outside both.
    globalNotFound: true,
  },
};

export default nextConfig;
