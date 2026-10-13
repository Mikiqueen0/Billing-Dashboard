import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// Next.js blocks dev assets (HMR, client JS) for any origin other than `localhost`,
// which leaves the page un-hydrated when opened via 127.0.0.1 or the LAN IP
// (e.g. testing from a tablet at the counter). Allow this machine's own IPv4s.
const localIPv4s = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4")
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localIPv4s,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
