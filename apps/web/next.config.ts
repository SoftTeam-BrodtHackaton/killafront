import type { NextConfig } from "next";

const config: NextConfig = {
  // Los packages del monorepo se consumen como TypeScript, sin paso de build propio.
  // `apps/web` solo debe importar composicion y dominio; adaptadores entra aquí
  // porque composicion lo arrastra, nunca porque una pantalla lo pida.
  transpilePackages: [
    "@killalab/tokens",
    "@killalab/dominio",
    "@killalab/adaptadores",
    "@killalab/composicion",
    "@killalab/content",
  ],
  typedRoutes: true,
};

export default config;
