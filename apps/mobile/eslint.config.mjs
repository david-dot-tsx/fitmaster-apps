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
  {
    // Expo Router uses Next.js-style file conventions inside `src/app/`
    // (e.g. `[nickname].tsx`, `[...slug].tsx`), which the default
    // KEBAB_CASE filename rule does not allow. Accept KEBAB_CASE *or*
    // bracketed dynamic segments here.
    files: ["src/app/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "check-file/filename-naming-convention": [
        2,
        {
          "**/!(__tests__|_layout)*.{js,jsx,ts,tsx}":
            "@(+([a-z])*([a-z0-9])*(-+([a-z0-9]))|\\[+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))\\]|\\[...+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))\\]|\\[\\[...+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))\\]\\]|index)",
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
];
