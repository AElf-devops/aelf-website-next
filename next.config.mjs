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
    // if (process.env.NODE_ENV === "development") {
    return [
      {
        source: "/items/:path*",
        destination: "https://test-cms-v2.aelf.com/items/:path*",
        // destination: "http://192.168.11.5:8066/items/:path*",
      },
    ];
    // } else {
    //   return [];
    // }
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