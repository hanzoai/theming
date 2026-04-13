# @hanzo/branding

A theming and component toolkit for building white-label apps on @hanzo/gui (Tamagui). Provides generation of Tailwind tokens expected by shadcn for compatibility with previous systems. Provide seed colors, get a complete design system.

## How it works

Every color in the system — backgrounds, text, borders, button states — is derived from a 12-step palette, which can be configured with a simple one-color "seed." This generates both light and dark versions of the palette. Tamagui calls these palettes "themes," and our system uses 7 of them: neutral, primary, secondary, info, success, warning, and danger — any or all of which can just be the default. These themes are used by all @hanzo/gui (Tamagui) components. They are also translated into a Tailwind CSS theme that can be used with systems based on shadcn.

Org-specific brand packages (`@liquidityio/brand`, `@zooai/brand`, etc.) just provide seeds (or 12-step palettes) and assets; all the generation logic lives here.

## Install

```bash
pnpm add @hanzo/branding
```

## Quick start

### @hanzo/gui (Tamagui)

```typescript
import { createTamaguiConfig } from '@hanzo/branding/tg'
import { GuiProvider } from '@hanzo/gui'

const config = createTamaguiConfig({
  themes: {
    primary: { seed: '#1a2744' },
    // omitted themes fall back to defaults
  },
})

<GuiProvider config={config}>
  <App />
</GuiProvider>
```

### Tailwind / shadcn

Semantic token mappings ship as a static CSS file from `@hanzo/branding`. Only the theme palettes are org-specific — generated from your seeds at build time (see [For org brand packages](#for-org-brand-packages)).

In your app's main CSS:

```css
@import 'tailwindcss';
@import '@liquidityio/brand/brand-palettes.css';
@import '@hanzo/branding/shadcn-semantic-colors.css';
```

- `brand-palettes.css` — org-specific, generated in `<org>/brand` from its `ThemesConfig`
- `shadcn-semantic-colors.css` — maps 12-step palettes to semantic color values expected by shadcn (static css)

If you need to override other Tailwind v4 defaults (spacing, breakpoints, etc.), add your own CSS file with an `@theme` block.

## Palette system

A single hex seed produces a 12-step palette for both light and dark schemes:

| Steps | Role | Examples |
|-------|------|---------|
| 1–3 | Backgrounds | base, raised, subtle |
| 4–6 | Borders, separators | subtle, medium, strong |
| 7–9 | Interactive states, quiet text | muted, secondary, quiet |
| 10–12 | Foreground text | primary, strong, darkest |

Light palettes run lightest (1) to darkest (12). Dark palettes run darkest (1) to lightest (12). Saturation tapers at the extremes for a natural feel.

## Theme seeds

Seven named themes, all optional. Omitted themes get these defaults:

| Theme | Default | Purpose |
|-------|---------|---------|
| `neutral` | `#808080` | Greyscale canvas — backgrounds, text, borders |
| `primary` | `#3B82F6` | Primary actions — buttons, links, focus rings |
| `secondary` | `#721be4` | Secondary accent |
| `info` | `#eab308` | Informational callouts, tips |
| `success` | `#16a34a` | Success states, confirmations |
| `warning` | `#fb923c` | Warning states, caution |
| `danger` | `#dc2626` | Errors, destructive actions |

Each theme can be specified as:

```typescript
// A seed — generates both light and dark palettes
{ seed: '#1a2744' }

// An explicit 12-step palette — used for both schemes (dark is reversed)
['#f0f3f8', '#dfe5f0', ..., '#0c1322']

// Per-scheme — mix seeds and explicit palettes
{ light: { seed: '#1a2744' }, dark: ['#0c1322', '#131d34', ..., '#f0f3f8'] }
```

## Tamagui config

`createTamaguiConfig()` produces a complete Tamagui config from your supplied values:

```typescript
import { createTamaguiConfig } from '@hanzo/branding/tg'

const config = createTamaguiConfig({
  themes: {
    primary: { seed: '#1a2744' },
    // neutral, secondary, info, success, warning, danger — pick up defaults
  },
  fonts: {
    body:    { family: '"Inter", sans-serif', size: { ... }, ... },
    heading: { family: '"Inter", sans-serif', size: { ... }, ... },
    mono:    { family: '"JetBrains Mono", monospace', size: { ... }, ... },
  },
  // pick up defaults for 'size' and 'space'
})
```

| Option | Type | Default |
|--------|------|---------|
| `themes` | `ThemesConfig` | Default color seeds for the 7 themes specified above |
| `fonts.body` | `FontDef` | System sans-serif stack |
| `fonts.heading` | `FontDef` | System sans-serif stack |
| `fonts.mono` | `FontDef` | System monospace stack |
| `size` | `Record<string, number>` | Non-linear component size scale (20–144px) |
| `space` | `Record<string, number>` | Linear 4px grid (0–96px) |

Each theme seed becomes a Tamagui children theme. Components use standard theme wrapping:

```tsx
<Theme name="primary">
  <Button>Submit</Button>     {/* picks up primary palette automatically */}
</Theme>

<Theme name="danger">
  <Card>Error occurred</Card> {/* danger palette for bg, border, text */}
</Theme>
```

Light/dark is handled structurally — the active scheme is inherited from the root, and each children theme has both variants.

## Tailwind / shadcn details

### Brand palettes as `brand-palettes.css` 
* auto-generated within an org's `<org>/brand` from its `ThemesConfig` (which generally lives in `brand.json`)

* `generateTwThemePalettesCss(config?)`: Produces `--color-{theme}-{1..12}` for all 7 themes/palettes in `:root` and `[data-color-scheme='dark']`. 

### Shadcn semantic colors are derived in `shadcn-semantic-colors.css`

* `@hanzo/branding/shadcn-semantic-colors.css` — Derives shadcn's expected color tokens (`--background`, `--primary`, `--destructive`...) from the palettes as css vars (`var(--color-neutral-1)`, `var(--color-primary-10)`...) that were generated from the org's ThemesConfig. Simply maps, so does not vary. Just needs to be included in the app's css file after `brand-palettes.css`.



`@hanzo/branding` ships a `generate-palettes` CLI that reads an org's `brand.json` and writes the CSS file:

```bash
# Defaults: reads src/brand.json, writes src/brand-palettes.css
npx generate-palettes

# Custom paths
npx generate-palettes --brandFile src/our-brand.json --outFile src/our-brand-palettes.css
```

In an org brand package's `package.json`:

```json
"prebuild": "generate-palettes"
```

Output:

```css
:root {
  --color-neutral-1: #fafafa;
  --color-neutral-2: #f5f5f5;
  /* ... through 12, for all 7 themes */
}
[data-color-scheme='dark'] {
  --color-neutral-1: #0d0d0d;
  /* ... */
}
```

## Components

Themed Tamagui components: ThemedButton, GhostButton, OutlineButton, StatusBox, ToggleSwitch, StyledCard.

See [COMPONENTS.md](COMPONENTS.md) for usage and examples.

## Package structure

```
src/
├── types.ts                 # Palette12, ThemeSeed, ThemeDesc, ThemesConfig
├── palette-utils.ts         # generatePalette, generatePalettes, resolveThemeDesc
├── tg/                      # Tamagui-specific
│   ├── create-config.ts     # createTamaguiConfig(options?)
│   ├── defaults/
│   │   ├── themes.ts        # default seed colors
│   │   ├── spacing.ts       # default size + space scales
│   │   └── fonts.ts         # default system font definitions
│   └── components/
│       ├── themed-button.tsx
│       ├── ghost-button.tsx
│       ├── outline-button.tsx
│       ├── toggle-switch.tsx
│       ├── status-box.tsx
│       └── styled-card.tsx
├── shadcn-tw/               # Tailwind / shadcn
│   ├── utils.ts             # generateTwThemePalettesCss
│   ├── generate-palettes.ts # CLI: reads brand.json, writes brand-palettes.css
│   └── shadcn-semantic-colors.css  # static — shadcn semantic color mappings
```

## Export paths

| Path | What |
|------|------|
| `@hanzo/branding/tg` | `createTamaguiConfig`, types, defaults, and components |
| `@hanzo/branding/components` | Tamagui components only |
| `@hanzo/branding/tg-defaults` | Defaults only (seeds, size, space, fonts) |
| `@hanzo/branding/shadcn-semantic-colors.css` | Static CSS — maps 12-step palettes to semantic color values expected by shadcn |

## For org brand packages

An org brand package depends on `@hanzo/branding` and provides just data:

```
@liquidityio/brand/
├── brand.json        # org identity, URLs, theme seeds
├── assets/logo/      # SVGs
└── src/index.ts      # ~20 lines
```

The index calls `createTamaguiConfig` with the org's seeds and fonts:

```typescript
import { createTamaguiConfig } from '@hanzo/branding/tg'
import brandJson from './brand/brand.json'

export const tamaguiConfig = createTamaguiConfig({
  themes: brandJson.themes,
  fonts: { body: MY_CUSTOM_FONT, heading: MY_CUSTOM_FONT },
})
```

Everything else — palette generation, component library, Tailwind integration — comes from this module.
