# @hanzo/branding

Theme engine, palette generation, and themed components for Hanzo-powered apps.

Org-specific brand packages (`@liquidityio/brand`, `@zooai/brand`, etc.) depend on this and provide just seed colors + assets.

## Install

```bash
npm install @hanzo/branding
```

## Usage

```typescript
import { createGuiConfig } from '@hanzo/branding'
import { GuiProvider } from '@hanzo/gui'

// Generate a full GUI config from theme seeds
const guiConfig = createGuiConfig({
  primary: { seed: '#1a2744' },
  // All others default to sensible colors
})

<GuiProvider config={guiConfig}>
  <App />
</GuiProvider>
```

### Components

```typescript
import { ThemedButton, StatusBox, ToggleSwitch } from '@hanzo/branding/components'

<ThemedButton>Submit</ThemedButton>
<ThemedButton theme="danger">Delete</ThemedButton>
<StatusBox title="Tip" points={['First', 'Second']} />
<StatusBox title="Error" points={['Failed']} theme="danger" symbol="⚠️" />
```

### Palette generation

```typescript
import { generatePalette, resolveThemeDesc } from '@hanzo/branding/palette-utils'

// From a seed
const light = generatePalette('#1a2744', 'light')  // Palette12

// From a ThemeDesc (seed, explicit palette, or per-scheme)
const { light, dark } = resolveThemeDesc({ seed: '#dc2626' })
```

## Exports

| Path | What |
|------|------|
| `@hanzo/branding` | Everything (types, palette utils, config factory, components) |
| `@hanzo/branding/components` | ThemedButton, GhostButton, OutlineButton, ToggleSwitch, StatusBox, StyledCard |
| `@hanzo/branding/palette-utils` | generatePalette, generatePalettes, resolveThemeDesc |
| `@hanzo/branding/create-gui-config` | createGuiConfig factory |

## Default theme seeds

| Theme | Default seed | Purpose |
|-------|-------------|---------|
| neutral | `#808080` | Greyscale canvas (bg, text, borders) |
| primary | `#3B82F6` | Brand primary action (buttons, links) |
| secondary | `#721be4` | Secondary accent |
| info | `#2563eb` | Informational callouts |
| success | `#16a34a` | Success states |
| warning | `#d97706` | Warning states |
| danger | `#dc2626` | Errors, destructive actions |
