/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [
      path.join(dirname(fileURLToPath(import.meta.url)), "styles"),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
