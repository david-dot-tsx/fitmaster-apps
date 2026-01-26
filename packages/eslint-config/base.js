import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import checkFilePlugin from "eslint-plugin-check-file";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "clsx", "cva"],
      },
    },
    rules: {
      ...tailwindcssPlugin.configs["flat/recommended"][1].rules,
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        // Expo Router uses this exact export name.
        {
          selector: "variable",
          format: ["snake_case"],
          filter: { regex: "^unstable_settings$", match: true },
        },
        // React components (PascalCase) as function declarations
        {
          selector: "function",
          format: ["PascalCase"],
          filter: { regex: "^[A-Z]", match: true },
        },
        // All other function declarations must be camelCase
        {
          selector: "function",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          filter: { regex: "^[A-Z]", match: false },
        },
        // Methods should be camelCase too (allow leading _ for private-ish)
        {
          selector: "method",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Exported consts (incl. exported function expressions) should not be snake_case
        {
          selector: "variable",
          modifiers: ["exported"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}"],
    plugins: {
      import: importPlugin,
      "check-file": checkFilePlugin,
      "@tanstack/query": tanstackQueryPlugin,
    },
    settings: {
      "import/internal-regex": "^(@repo/|@/)",
    },
    rules: {
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/order": [
        2,
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            { pattern: "@repo/**", group: "external", position: "after" },
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          "newlines-between": "always",
        },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-nested-ternary": 2,
      "newline-before-return": 2,
      "no-lonely-if": 2,
      "no-useless-concat": 2,
      "no-restricted-imports": ["error", { paths: [], patterns: [] }],
      "check-file/filename-blocklist": [
        2,
        { "**/*.model.ts": "*.models.ts", "**/*.util.ts": "*.utils.ts" },
      ],
      "check-file/folder-match-with-fex": [
        2,
        {
          "*.test.{js,jsx,ts,tsx}": "**/__tests__/",
        },
      ],
      "check-file/filename-naming-convention": [
        2,
        {
          "**/!(__tests__|_layout)*.{js,jsx,ts,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      // TanStack Query (React Query)
      ...tanstackQueryPlugin.configs["flat/recommended"].rules,
    },
  },
  {
    // Node scripts (CommonJS, console output) are fine here.
    files: ["**/scripts/**/*.{js,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
    },
  },
  {
    ignores: ["dist/**", "*.config.*"],
  },
];
