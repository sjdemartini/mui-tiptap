/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, "example/**"],
    coverage: {
      all: true,
      exclude: [...(configDefaults.coverage.exclude ?? []), "example/**"],
    },
  },
});
