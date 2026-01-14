import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";

export default defineConfig([
  globalIgnores(["dist"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  security.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "sonarjs/cognitive-complexity": ["error", 15],
    },
  },
  {
    files: ["**/*.test.tsx", "**/*.test.ts", "**/mocks/**"],
    rules: {
      "sonarjs/no-hardcoded-ip": "off",
    },
  },
]);
