import type { NextConfig } from "next";

const config: NextConfig = {
  // Los packages del monorepo se consumen como TypeScript, sin paso de build propio.
  transpilePackages: ["@killalab/tokens", "@killalab/api", "@killalab/db", "@killalab/content"],
  experimental: { typedRoutes: true },
};

export default config;
