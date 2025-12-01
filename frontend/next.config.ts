import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    config.externals.push({
      pino: "commonjs pino",
    });

    // Exclude test files from bundling
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules\/thread-stream\/(test|bench)/,
      use: "null-loader",
    });

    return config;
  },
};

export default nextConfig;
