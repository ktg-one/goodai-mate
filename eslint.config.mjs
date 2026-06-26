import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
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