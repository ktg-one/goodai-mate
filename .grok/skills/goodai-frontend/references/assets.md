# Asset folders — do not merge

| Folder | Keep? | Use for |
|--------|-------|---------|
| `public/company-assets/` | Yes | Logos, wordmarks (JPG) — canonical brand |
| `public/assets/` | **Yes** | Character animation sprites (`gem-*.png`, `claude-*.png`), `wave-ribbon.png` |
| `public/fonts/` | Yes | Fraunces + DM Sans TTF |

## Code registry

All paths flow through `src/lib/brand-assets.ts`:

- `BRAND_ASSETS` → company-assets (wordmark, logo, shapes)
- `CHARACTER_ASSETS` → assets (lip-sync frames, ribbon)

Components:

- `BrandWordmark`, `BrandMark`, `BrandLogo`, `BrandShapesStamp` → company-assets
- `TalkingCharacter` → CHARACTER_ASSETS frame swap (must stay `<img>`, not next/image)