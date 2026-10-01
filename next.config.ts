import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Browsers still ask for /favicon.ico; the real icon is generated at /icon.
    return [{ source: "/favicon.ico", destination: "/icon", permanent: false }];
  },
};

export default nextConfig;
