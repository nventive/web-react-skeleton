import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    css: {
      postcss: {
        plugins: [autoprefixer],
      },
    },
    ssr: {
      noExternal: [
        "@mui/*", // fix material-ui ES modules imported error.
      ],
    },
    plugins: [reactRouter(), tsconfigPaths()],
    build: {
      sourcemap:
        env.VITE_GENERATE_SOURCEMAP === "true" && mode !== "production",
    },
    server: {
      port: Number(env.VITE_PORT),
    },
    optimizeDeps: {
      // this fixes a bug where the app crashes on the first load while optimizing dependencies
      // https://github.com/remix-run/remix/issues/10156
      entries: ["src/**/*.tsx", "src/**/*.ts"],
    },
  };
});
