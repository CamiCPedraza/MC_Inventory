import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    threads: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      all: true,
      include: ["src/**/*.jsx", "src/**/*.js"],
      exclude: ["src/setupTests.js"],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  }
});
