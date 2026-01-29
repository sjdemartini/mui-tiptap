/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  test: {
    exclude: [...configDefaults.exclude, "example/**"],
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [...(configDefaults.coverage.exclude ?? []), "example/**"],
    },
  },
});
