import { defineConfig, globalIgnores } from "eslint/config";
<<<<<<< HEAD
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
=======
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

// import.meta.dirname requires Node >=20.11 — package.json's engines range
// allows down to 20.9.0, so derive it the version-independent way instead.
const compat = new FlatCompat({ baseDirectory: fileURLToPath(new URL(".", import.meta.url)) });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
<<<<<<< HEAD
  ]),
]);

export default eslintConfig;
=======
    ".agent_context/**",
    ".agents/**",
    ".understand-anything/**",
    ".grok/**",
    "node_modules/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-useless-fragment": "warn",
    },
  },
  {
    // Lip-sync frame swap + JPG wordmarks — next/image breaks hot path
    files: [
      "src/components/brand/**/*.tsx",
      "src/components/voice-agent/TalkingCharacter.tsx",
      "src/components/voice-agent/VoiceAgentHero.tsx",
      "src/components/voice-agent/gem-voice.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Ban raw asset paths outside the registry
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/brand-assets.ts"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/^\\/assets\\//]",
          message:
            "Import paths from CHARACTER_ASSETS in src/lib/brand-assets.ts (public/assets/ is for animation sprites).",
        },
        {
          selector: "Literal[value=/^\\/company-assets\\//]",
          message:
            "Import paths from BRAND_ASSETS in src/lib/brand-assets.ts.",
        },
      ],
    },
  },
]);

export default eslintConfig;
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
