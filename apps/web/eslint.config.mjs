import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      "tailwindcss/classnames-order": "off",
      "no-console": "warn",
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "cva"],
        config: "tailwind.config.ts",
      },
    },
  },
];
