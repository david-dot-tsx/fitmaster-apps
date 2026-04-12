import { defineConfig } from "i18next-cli";
import { LOCALES } from "./src/types/locales";
import { NAMESPACES } from "./src/types/namespaces";

export default defineConfig({
  locales: [LOCALES.EN, LOCALES.ES, LOCALES.PL],
  extract: {
    input: "../../apps/web/src/**/*.{js,jsx,ts,tsx}",
    output: "src/locales/tmp/{{language}}/{{namespace}}.json",
    defaultNS: NAMESPACES.COMMON,
  },
});
