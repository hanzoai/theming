/**
 * Generate 12-step color palettes from a single seed hex color.
 *
 * Steps 1–3:  backgrounds (lightest)
 * Steps 4–6:  borders, separators
 * Steps 7–9:  interactive states, quiet text
 * Steps 10–12: foreground text (darkest)
 *
 * Light palettes go lightest → darkest.
 * Dark palettes go darkest → lightest.
 */

import type { Palette12, ThemeDesc, ThemeSeed } from './types'

// ── hex/hsl helpers (zero deps) ──────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = ((n >> 16) & 0xff) / 255
  const g = ((n >> 8) & 0xff) / 255
  const b = (n & 0xff) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return [0, 0, l]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return [h * 360, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  if (s === 0) {
    const v = Math.round(l * 255)
    return `#${v.toString(16).padStart(2, '0').repeat(3)}`
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const r = Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255)
  const g = Math.round(hue2rgb(p, q, h / 360) * 255)
  const b = Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255)

  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max)
}

// ── palette generation ───────────────────────────────────────

const PALETTE_SIZE = 12

/** Target lightness for light palette: step 1 (near-white) → step 12 (near-black). */
const LIGHT_LIGHTNESS = [
  0.98, 0.96, 0.93, 0.88, 0.80, 0.70,
  0.58, 0.46, 0.36, 0.26, 0.18, 0.10,
]

/** Target lightness for dark palette: step 1 (near-black) → step 12 (near-white). */
const DARK_LIGHTNESS = [
  0.05, 0.10, 0.14, 0.19, 0.26, 0.34,
  0.44, 0.55, 0.66, 0.76, 0.86, 0.94,
]

/**
 * Generate a 12-step palette from a seed hex color.
 *
 * The seed's hue and saturation are preserved across all steps.
 * Lightness is mapped to the target curve for the given scheme.
 * Saturation tapers at the lightest/darkest extremes for a natural feel.
 */
export function generatePalette(
  seed: string,
  scheme: 'light' | 'dark',
): Palette12 {
  const [h, s] = hexToHsl(seed)
  const targets = scheme === 'light' ? LIGHT_LIGHTNESS : DARK_LIGHTNESS

  return targets.map((targetL, i) => {
    const edgeness = scheme === 'light'
      ? 1 - i / (PALETTE_SIZE - 1)
      : i / (PALETTE_SIZE - 1)

    const satScale = 1 - edgeness * 0.7
    const adjustedS = clamp(s * satScale, 0, 1)

    return hslToHex(h, adjustedS, targetL)
  }) as unknown as Palette12
}

/** Generate both light and dark 12-step palettes from a seed. */
export function generatePalettes(seed: string): {
  light: Palette12
  dark: Palette12
} {
  return {
    light: generatePalette(seed, 'light'),
    dark: generatePalette(seed, 'dark'),
  }
}

function isSeed(v: ThemeSeed | Palette12): v is ThemeSeed {
  return !Array.isArray(v) && 'seed' in v
}

/**
 * Resolve a ThemeDesc into light + dark 12-step palettes.
 *
 * Accepts:
 *   { seed: "#hex" }                              — generate both from seed
 *   ["#hex", "#hex", ... x12]                     — use as-is for both schemes
 *   { light: { seed: "#hex" }, dark: [...12] }    — mix and match
 */
export function resolveThemeDesc(desc: ThemeDesc): {
  light: Palette12
  dark: Palette12
} {
  if ('seed' in desc) {
    return generatePalettes(desc.seed)
  }

  if (Array.isArray(desc)) {
    return { light: desc, dark: [...desc].reverse() as unknown as Palette12 }
  }

  const resolve = (
    value: ThemeSeed | Palette12,
    scheme: 'light' | 'dark',
  ): Palette12 => {
    if (isSeed(value)) return generatePalette(value.seed, scheme)
    return value
  }

  return {
    light: resolve(desc.light, 'light'),
    dark: resolve(desc.dark, 'dark'),
  }
}
