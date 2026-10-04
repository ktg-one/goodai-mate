import { defineConfig, globalIgnores } from "eslint/config";
import { plugin as shadcn } from "@shadcn/lint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { shadcn },
    settings: {
      shadcn: {
        note: "Palette: app/globals.css @theme (mirrors DESIGN.md) - brand-ink, brand-paper, brand-coral, brand-eucalyptus, brand-eucalyptus-ink, brand-teal, brand-line, brand-surface; brand-navy = legacy alias of brand-ink. Not app/tokens/*.css.",
      },
    },
    rules: {
      // Bug-finding: classes that generate no CSS and colors outside the
      // theme fail lint. Plain-CSS classes from app/studio-controls.css and
      // @designcodeio/threeui are allow-listed.
      "shadcn/no-unknown-classes": ["error", {
        allow: [
          "contact-phone",
          "header-phone",
          "footer-phone",
          "phone-caption",
          "voice-phone",
          "pen-underline",
          "threeui-background",
        ],
      }],
      "shadcn/no-raw-colors": "error",
      "shadcn/require-static-classes": "error",
      // Design-system contracts, ratcheting from warn to error:
      // - Consumers restyle layout (margins, width, position) freely; color,
      //   typography, spacing, shape, effects, and motion belong to the
      //   component's variants/sizes.
      // - Arbitrary values are discouraged on content surfaces.
      "shadcn/no-restyle": ["warn", { allow: ["layout"] }],
      "shadcn/no-arbitrary-values": "warn",
    },
  },
  // Components own their styling; component authoring is exempt from the
  // contract rules (matches the @shadcn/lint adoption guide).
  {
    files: ["components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
  // Inline styles: content surfaces (pages, sections, layout) must style
  // through classes. Motion primitives (components/ui, components/studio,
  // components/carousel, shaders) position themselves with GSAP / Framer
  // Motion and are exempt.
  {
    files: ["app/**", "components/sections/**", "components/layout/**"],
    rules: { "shadcn/no-inline-styles": "warn" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-dev/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Kilo worktree copies duplicate every file; lint the main tree only.
    ".kilo/**",
    // Agent office runtime (hive harness scripts), not site code.
    "hive/**",
    // Parked copies of removed components (incl. old GSAP VisualStory); not
    // imported or built.
    "docs/components/**",
  ]),
]);

export default eslintConfig;
