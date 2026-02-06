import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ["scripts/**/*.js"],
    env: {
      node: true,
      es6: true,
    },
    rules: {
      "no-console": "off",
    },
  },
];
