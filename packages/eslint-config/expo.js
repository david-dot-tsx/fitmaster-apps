import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

import { config as baseConfig } from "./base.js";

const baseWithoutImportPlugin = baseConfig.map((entry) => {
  if (!entry || typeof entry !== "object" || !("plugins" in entry) || !entry.plugins) {
    return entry;
  }

  // `eslint-config-expo/flat.js` already provides the `import` plugin.
  // Avoid redefining it (ESLint flat config forbids plugin redefinition).
  if (!("import" in entry.plugins)) return entry;

  const { import: _import, ...restPlugins } = entry.plugins;
  return { ...entry, plugins: restPlugins };
});

/**
 * A custom ESLint configuration for Expo (React Native) apps.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const expoAppConfig = defineConfig([
  // Expo's recommended flat config (react-native/expo specifics)
  expoConfig,
  {
    // One-time template script (keep it, but don't lint it).
    ignores: ["**/scripts/*.js"],
  },
  ...baseWithoutImportPlugin,
  // Repo-wide defaults and overrides (TypeScript, prettier, etc.)
]);
