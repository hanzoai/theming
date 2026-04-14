/**
 * Generate Radix-style 12-step color palettes.
 *
 * Two kinds of palette, both following the Radix semantic scale:
 *
 *   Step  Role
 *   ────  ────────────────────────────
 *    1    App background
 *    2    Subtle background
 *    3    UI element background
 *    4    Hovered UI element bg
 *    5    Active / pressed UI bg
 *    6    Subtle borders
 *    7    UI borders / focus rings
 *    8    Hovered borders
 *    9    Solid background (= seed)
 *   10    Hovered solid
 *   11    Low-contrast text
 *   12    High-contrast text
 *
 * NEUTRAL palette — a grey ramp from the neutral seed. Injected into
 * every theme as $grey1…$grey12 so components always have access to
 * neutral surface/border/text colors regardless of the active accent.
 *
 * ACCENT palette — a full 12-step scale from an accent seed. Steps 1–8
 * use the accent hue at progressively increasing saturation; step 9 is
 * the literal seed; steps 10–12 blend toward the scheme foreground.
 * Mapped to $color1…$color12 by Tamagui's default template.
 *
 * Components use $grey for surfaces/borders/text and $color for accent
 * fills/hover/press — both available in every theme via one <Theme> wrapper.
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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// ── neutral palette generation ───────────────────────────────

/**
 * Target lightness for the 12-step neutral ramp.
 * Tuned to match Radix's grey scale: subtle surface differences at the
 * bg end, clear border band in the middle, readable text at the fg end.
 */
const NEUTRAL_L_DARK: readonly number[] = [
  0.067, 0.09, 0.12, 0.15, 0.19, 0.24,
  0.31,  0.40, 0.49, 0.56, 0.71, 0.93,
]

const NEUTRAL_L_LIGHT: readonly number[] = [
  0.99, 0.97, 0.94, 0.91, 0.87, 0.82,
  0.76, 0.65, 0.50, 0.43, 0.27, 0.09,
]

/**
 * Saturation taper for neutral: edges (bg/fg) are nearly desaturated,
 * middle steps preserve a hint of the seed's character.
 */
const NEUTRAL_SAT_SCALE: readonly number[] = [
  0.05, 0.06, 0.08, 0.10, 0.14, 0.18,
  0.24, 0.32, 0.38, 0.40, 0.30, 0.10,
]

/**
 * Generate a 12-step neutral (grey) palette from a seed.
 *
 * The seed's hue is preserved across all steps; saturation is heavily
 * tapered so the result reads as a grey ramp. For a true grey seed
 * (s ≈ 0) the output is pure grey.
 */
export function generateNeutralPalette(
  seed: string,
  scheme: 'light' | 'dark',
): Palette12 {
  const [h, s] = hexToHsl(seed)
  const targets = scheme === 'dark' ? NEUTRAL_L_DARK : NEUTRAL_L_LIGHT

  return targets.map((targetL, i) => {
    const adjustedS = clamp(s * NEUTRAL_SAT_SCALE[i], 0, 1)
    return hslToHex(h, adjustedS, targetL)
  }) as unknown as Palette12
}

// ── accent palette generation ────────────────────────────────

/** Scheme endpoints — where tints / text blend toward */
const SCHEME_BG: Record<'light' | 'dark', string> = {
  light: '#ffffff',
  dark: '#0a0a0a',
}
const SCHEME_FG: Record<'light' | 'dark', string> = {
  light: '#111111',
  dark: '#fafafa',
}

/**
 * Blend ratios for accent steps 1–8: how much of the seed to mix into
 * the scheme background. Preserves seed hue; only S and L interpolate.
 */
const ACCENT_TINT_RATIOS = [0.03, 0.06, 0.11, 0.17, 0.24, 0.33, 0.46, 0.62]

/** How far step 10 shifts from the seed toward scheme fg */
const HOVER_SOLID_RATIO = 0.12

/** Blend ratios for steps 11–12 (text): seed → scheme fg */
const ACCENT_TEXT_RATIOS = [0.65, 0.93]

/**
 * Generate a full 12-step accent palette from a seed.
 *
 * Steps 1–8 use the seed hue at progressively increasing saturation
 * (dark-tinted blues for a blue seed, dark-tinted reds for red, etc.).
 * Step 9 is the literal seed. Step 10 is the hovered solid.
 * Steps 11–12 are lighter accent-hued text colors.
 */
export function generateAccentPalette(
  seed: string,
  scheme: 'light' | 'dark',
): Palette12 {
  const seedHsl = hexToHsl(seed)
  const seedH = seedHsl[0]
  const bgHsl = hexToHsl(SCHEME_BG[scheme])
  const fgHsl = hexToHsl(SCHEME_FG[scheme])

  const palette: string[] = []

  // Steps 1–8: tints (bg → seed), always using seed hue
  for (const ratio of ACCENT_TINT_RATIOS) {
    const s = clamp(lerp(bgHsl[1], seedHsl[1], ratio), 0, 1)
    const l = clamp(lerp(bgHsl[2], seedHsl[2], ratio), 0, 1)
    palette.push(hslToHex(seedH, s, l))
  }

  // Step 9: the seed itself
  palette.push(seed)

  // Step 10: hovered solid (seed → fg), preserving seed hue
  const hoverS = clamp(lerp(seedHsl[1], fgHsl[1], HOVER_SOLID_RATIO), 0, 1)
  const hoverL = clamp(lerp(seedHsl[2], fgHsl[2], HOVER_SOLID_RATIO), 0, 1)
  palette.push(hslToHex(seedH, hoverS, hoverL))

  // Steps 11–12: accent-hued text (seed → fg), preserving seed hue
  for (const ratio of ACCENT_TEXT_RATIOS) {
    const s = clamp(lerp(seedHsl[1], fgHsl[1], ratio), 0, 1)
    const l = clamp(lerp(seedHsl[2], fgHsl[2], ratio), 0, 1)
    palette.push(hslToHex(seedH, s, l))
  }

  return palette as unknown as Palette12
}

// ── convenience wrappers ─────────────────────────────────────

/** Generate both light and dark neutral palettes from a seed. */
export function generateNeutralPalettes(seed: string): {
  light: Palette12
  dark: Palette12
} {
  return {
    light: generateNeutralPalette(seed, 'light'),
    dark: generateNeutralPalette(seed, 'dark'),
  }
}

function isSeed(v: ThemeSeed | Palette12): v is ThemeSeed {
  return !Array.isArray(v) && 'seed' in v
}

function seedFrom(desc: ThemeDesc, scheme: 'light' | 'dark'): string {
  if ('seed' in desc) return desc.seed
  if (Array.isArray(desc)) return desc[8]
  const side = scheme === 'light' ? desc.light : desc.dark
  if (Array.isArray(side)) return side[8]
  return side.seed
}

/**
 * Resolve a ThemeDesc into light + dark 12-step palettes.
 *
 * When `kind` is 'neutral' (default), produces a grey ramp.
 * When `kind` is 'accent', produces a full accent scale.
 */
export function resolveThemeDesc(
  desc: ThemeDesc,
  kind: 'neutral' | 'accent' = 'neutral',
): { light: Palette12; dark: Palette12 } {
  if (kind === 'neutral') {
    if ('seed' in desc) {
      return generateNeutralPalettes(desc.seed)
    }
    if (Array.isArray(desc)) {
      return { light: desc, dark: [...desc].reverse() as unknown as Palette12 }
    }
    const resolve = (v: ThemeSeed | Palette12, s: 'light' | 'dark'): Palette12 =>
      isSeed(v) ? generateNeutralPalette(v.seed, s) : v
    return { light: resolve(desc.light, 'light'), dark: resolve(desc.dark, 'dark') }
  }

  // accent
  const lightSeed = seedFrom(desc, 'light')
  const darkSeed = seedFrom(desc, 'dark')
  return {
    light: generateAccentPalette(lightSeed, 'light'),
    dark: generateAccentPalette(darkSeed, 'dark'),
  }
}
