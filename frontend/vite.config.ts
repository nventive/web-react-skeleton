import { defineConfig, loadEnv, ServerOptions } from "vite";
import react from "@vitejs/plugin-react";
import { pigment } from "@pigment-css/vite-plugin";
import theme from "./src/themes/theme";
import path from "path";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const serverOptions: ServerOptions = {
    port: Number(process.env.VITE_PORT),
  };
  if (process.env.VITE_DOCKER === "true") {
    serverOptions.host = true;
    serverOptions.watch = { usePolling: true };
  }

  return defineConfig({
    plugins: [
      react(),
      pigment({
        theme,
        transformLibraries: ["@mui/material"],
      }),
    ],
    build: {
      sourcemap: process.env.VITE_GENERATE_SOURCEMAP === "true",
    },
    server: serverOptions,
    define: {
      __ENV__: JSON.stringify(process.env.VITE_ENV),
      __API_URL__: JSON.stringify(process.env.VITE_API_URL),
      __VERSION_NUMBER__: JSON.stringify(process.env.VITE_VERSION_NUMBER),
      __GA_TRACKING_ID__: JSON.stringify(process.env.VITE_GA_TRACKING_ID),
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/app/components"),
        "@containers": path.resolve(__dirname, "src/app/containers"),
        "@enums": path.resolve(__dirname, "src/app/enums"),
        "@forms": path.resolve(__dirname, "src/app/forms"),
        "@hocs": path.resolve(__dirname, "src/app/hocs"),
        "@icons": path.resolve(__dirname, "src/app/icons"),
        "@pages": path.resolve(__dirname, "src/app/pages"),
        "@routes": path.resolve(__dirname, "src/app/routes"),
        "@services": path.resolve(__dirname, "src/app/services"),
        "@shared": path.resolve(__dirname, "src/app/shared"),
        "@stores": path.resolve(__dirname, "src/app/stores"),
        "@styles": path.resolve(__dirname, "src/styles"),
      },
    },
  });
};
