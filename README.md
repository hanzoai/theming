# @hanzo/theming

A theming toolkit for white-label apps on `@hanzo/gui`. Provide seed colors, get
a complete design system: 12-step palettes, a `@hanzo/gui` config, themed
components, and plain CSS custom properties.

No Tailwind, no shadcn, no Radix. The stylesheets this package emits are ordinary
`:root` / `.dark` custom properties — any renderer can read them.

## How it works

Every color in the system — backgrounds, text, borders, button states — derives
from a 12-step palette, which you configure with a one-color "seed". Each seed
produces both a light and a dark 12-step scale. The system calls these palettes
"themes" and uses seven: `neutral`, `primary`, `secondary`, `info`, `success`,
`warning`, `danger`. Any or all can fall back to the defaults.

Org-specific brand packages (`@my-org/brand`) supply only seeds (or explicit
12-step palettes) and assets; all the generation logic lives here.

## Install

```bash
pnpm add @hanzo/theming
```

## Quick start

### The `@hanzo/gui` config

**In the org's brand module** — assemble and export a config from your seeds:

```typescript
// @my-org/brand/src/gui-config.ts
import { createGuiConfig } from '@hanzo/theming/gui'
import brandJson from './brand.json'

export const guiConfig = createGuiConfig({
  themes: brandJson.themes,
  // omitted fields (fonts, size, space) fall back to defaults
})
```

**In the org's apps** — wrap the app with `GuiProvider`:

```tsx
// @my-org/<app>/src/main.tsx
import { guiConfig } from '@my-org/brand'
import { GuiProvider } from '@hanzo/gui'

<GuiProvider config={guiConfig}>
  <App />
</GuiProvider>
```

### The stylesheets

Two layers, loaded in this order:

```css
@import './brand-palettes.css';        /* --palette-{theme}-{1..12}, generated per org */
@import '@hanzo/theming/semantic.css'; /* --background, --primary, … → the palette steps */
```

Order matters: `brand-palettes.css` defines the palette variables,
`semantic.css` references them. Both declare their light values in `:root` and
their dark values under `.dark`, so toggling that one class on `<html>` flips the
whole system — the same convention `@hanzo/ui/theme.css` uses.

## Palette system

A single hex seed produces a 12-step palette for both light and dark schemes:

| Steps | Role | Examples |
|-------|------|---------|
| 1–3 | Backgrounds | base, raised, subtle |
| 4–6 | Borders, separators | subtle, medium, strong |
| 7–9 | Interactive states, quiet text | muted, secondary, quiet |
| 10–12 | Foreground text | primary, strong, darkest |

Light palettes run lightest (1) to darkest (12). Dark palettes run darkest (1) to
lightest (12). Saturation tapers at the extremes for a natural feel.

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

## `createGuiConfig`

Produces a complete `@hanzo/gui` config from your supplied values:

```typescript
import { createGuiConfig } from '@hanzo/theming/gui'

const config = createGuiConfig({
  themes: {
    primary: { seed: '#1a2744' },
    // neutral, secondary, info, success, warning, danger — pick up defaults
  },
  fonts: {
    body:    { family: '"Geist", sans-serif', size: { ... }, ... },
    heading: { family: '"Geist", sans-serif', size: { ... }, ... },
    mono:    { family: '"Geist Mono", monospace', size: { ... }, ... },
  },
  // pick up defaults for 'size' and 'space'
})
```

| Option | Type | Default |
|--------|------|---------|
| `themes` | `ThemesConfig` | The seven default seeds above |
| `fonts.body` | `FontDef` | System sans-serif stack |
| `fonts.heading` | `FontDef` | System sans-serif stack |
| `fonts.mono` | `FontDef` | System monospace stack |
| `size` | `Record<string, number>` | Non-linear component size scale (20–144px) |
| `space` | `Record<string, number>` | Linear 4px grid (0–96px) |

Radius, z-index and media scales are not options — they come from
`@hanzo/theming/gui/defaults`, which also exposes every default above.

Each theme seed becomes a `@hanzo/gui` children theme. Components use standard
theme wrapping:

```tsx
<Theme name="primary">
  <Button>Submit</Button>     {/* picks up primary palette automatically */}
</Theme>

<Theme name="danger">
  <Card>Error occurred</Card> {/* danger palette for bg, border, text */}
</Theme>
```

Light/dark is handled structurally — the active scheme is inherited from the
root, and each children theme has both variants.

## The `generate-palettes` CLI

Reads an org's `brand.json` and writes its palette stylesheet:

```bash
# Defaults: reads src/brand.json, writes src/brand-palettes.css
npx generate-palettes

# Custom paths
npx generate-palettes --brandFile src/our-brand.json --outFile src/our-brand-palettes.css
```

Normally run as a prebuild step in the org brand package:

```json
"prebuild": "generate-palettes"
```

Output:

```css
:root {
  --palette-neutral-1: #fcfcfc;
  --palette-neutral-2: #f7f7f7;
  /* … through 12, for all 7 themes */
}
.dark {
  --palette-neutral-1: #111111;
  /* … */
}
```

Only the palettes are org-specific. The semantic layer maps roles onto palette
steps and never varies, so it ships prebuilt as `@hanzo/theming/semantic.css`.
`@hanzo/theming/css` exports the same two generators (`generatePaletteCss`,
`generateSemanticCss`) for programmatic use.

## Components

Themed `@hanzo/gui` components: `ThemedButton`, `GhostButton`, `OutlineButton`,
`StatusBox`, `ToggleSwitch`, `StyledCard`.

See [COMPONENTS.md](COMPONENTS.md) for usage and examples.

## Package structure

```
src/
├── types.ts              # Palette12, ThemeSeed, ThemeDesc, ThemesConfig
├── palette-utils.ts      # generateNeutralPalette, generateAccentPalette, resolveThemeDesc
├── index.ts              # dependency-free core: the two files above
├── css/                  # stylesheets — plain custom properties
│   ├── palettes.ts       # generatePaletteCss  → --palette-{theme}-{1..12}
│   ├── semantic.ts       # generateSemanticCss → --background, --primary, …
│   ├── generate-palettes.ts  # CLI: brand.json → brand-palettes.css
│   └── index.ts          # barrel
└── gui/                  # @hanzo/gui bindings
    ├── types.ts          # FontDef, GuiConfigOptions
    ├── create-config.ts  # createGuiConfig(options?)
    ├── index.ts          # barrel
    ├── defaults/         # seeds, size, space, radius, zIndex, media, fonts
    └── components/       # see COMPONENTS.md
```

## Export paths

| Path | What |
|------|------|
| `@hanzo/theming` | Palette types and generators — no dependencies |
| `@hanzo/theming/css` | `generatePaletteCss`, `generateSemanticCss`, `DARK_SELECTOR` |
| `@hanzo/theming/semantic.css` | Prebuilt semantic stylesheet |
| `@hanzo/theming/gui` | `createGuiConfig` and its types |
| `@hanzo/theming/gui/components` | Themed `@hanzo/gui` components |
| `@hanzo/theming/gui/defaults` | Defaults (seeds, size, space, radius, zIndex, media, fonts) |

## Example use in @my-org/brand

An org brand package depends on `@hanzo/theming` and provides just data:

```
@my-org/brand/
├── src/
│   ├── brand.json           # org identity, URLs, and palettes in the 'themes' field
│   ├── brand-palettes.css   # generated by prebuild (gitignored)
│   ├── my-org.css           # bundle: palettes + semantic + org additions
│   ├── fonts.ts             # (optional) org-specific font defs
│   ├── gui-config.ts        # calls createGuiConfig
│   ├── types.ts             # BrandIdentity, OrgConfig (define the rest of brand.json)
│   └── index.ts             # re-exports
└── assets/                  # logos, etc
```

```typescript
// gui-config.ts
import { createGuiConfig } from '@hanzo/theming/gui'
import brandJson from './brand.json'
import { bodyFont, headingFont, monoFont } from './fonts'

export const guiConfig = createGuiConfig({
  themes: brandJson.themes,
  fonts: { body: bodyFont, heading: headingFont, mono: monoFont },
})
```
