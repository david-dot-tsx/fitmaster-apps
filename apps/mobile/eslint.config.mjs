import { expoAppConfig } from "@repo/eslint-config/expo";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...expoAppConfig,
  {
    files: ["**/*.{jsx,tsx}"],
    settings: {
      tailwindcss: {
        callees: ["cn", "clsx", "cva"],
        config: path.join(__dirname, "tailwind.config.js"),
      },
    },
  },
];
