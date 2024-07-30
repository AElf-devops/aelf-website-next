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
  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? "https://aelf.com"
        : "https://test.aelf.com";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: "/gtag/:path*",
        destination: "https://www.googletagmanager.com/:path*",
      },
      {
        source: "/analytics.js/:path*",
        destination: "https://www.google-analytics.com/:path*",
      },
    ];
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
            value:
              "DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,x-requested-with,If-Modified-Since,Cache-Control,Content-Type,Authorization,token",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
        port: "",
      },
    ],
  },
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
};

export default nextConfig;
