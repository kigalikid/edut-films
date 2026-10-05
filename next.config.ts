import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // While edutfilms.com was parked at GoDaddy, its holding page sent every visitor
      // to /lander, and browsers remember that. Anyone who still arrives there is sent home.
      { source: "/lander", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
