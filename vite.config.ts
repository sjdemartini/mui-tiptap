/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsConfigFilePath: "tsconfig.build.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "mui-tiptap",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // @ts-expect-error seems there's an issue with the DefinitelyTyped
      // definition for peerDepsExternal
      plugins: [peerDepsExternal()],
    },
  },
});
