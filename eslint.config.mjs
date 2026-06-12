import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /** Mirrored CDN / HubSpot vendor files — ESLint parses them as TS and emits thousands of false positives. */
    "public/__mirror/**",
    "public/hubfs/**",
  ]),
]);

export default eslintConfig;
