import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineProject } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));

export default defineProject({
  resolve: {
    alias: {
      "@": resolve(root, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/vitest.setup.ts"],
    server: {
      deps: {
        inline: ["react-native", "expo", "@react-native", "@react-navigation"],
      },
    },
  },
});
