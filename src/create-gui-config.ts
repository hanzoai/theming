/**
 * Factory: ThemesConfig → full @hanzo/gui config.
 *
 * Takes theme seed/palette descriptions, generates all palettes,
 * and produces the createGui() config object.
 */

import { createGui } from '@hanzo/gui'
// @ts-ignore — createFont exists at runtime via @hanzogui/web but pnpm strict hoisting hides types
import { createFont } from '@hanzogui/web'
import { createThemes } from '@hanzogui/theme-builder'
import { shorthands as baseShorthands } from '@hanzogui/shorthands/v4'
import { getDefaultGuiConfig } from '@hanzogui/config-default'

import type { ThemesConfig } from './types'
import { generatePalette, resolveThemeDesc } from './palette-utils'

// ── defaults ─────────────────────────────────────────────────

const DEFAULT_SEEDS: Required<ThemesConfig> = {
  neutral:   { seed: '#808080' },
  primary:   { seed: '#3B82F6' },
  secondary: { seed: '#721be4' },
  info:      { seed: '#2563eb' },
  success:   { seed: '#16a34a' },
  warning:   { seed: '#d97706' },
  danger:    { seed: '#dc2626' },
}

// ── shorthands ───────────────────────────────────────────────

const shorthands = {
  ...baseShorthands,
  w: 'width',
  h: 'height',
  f: 'flex',
  fb: 'flexBasis',
  fd: 'flexDirection',
  fw: 'flexWrap',
  bw: 'borderWidth',
  btw: 'borderTopWidth',
  bbw: 'borderBottomWidth',
  blw: 'borderLeftWidth',
  brw: 'borderRightWidth',
  bc: 'borderColor',
  btc: 'borderTopColor',
  bbc: 'borderBottomColor',
  blc: 'borderLeftColor',
  brc: 'borderRightColor',
  ov: 'overflow',
  op: 'opacity',
  pos: 'position',
} as const

// ── tokens ───────────────────────────────────────────────────

const _defaultConfig = getDefaultGuiConfig('web')
const { media } = _defaultConfig
const defaultTokens = _defaultConfig.tokens

const size = {
  $0: 0,
  '$0.25': 2,
  '$0.5': 4,
  '$0.75': 8,
  $1: 20,
  '$1.5': 24,
  $2: 28,
  '$2.5': 32,
  $3: 36,
  '$3.5': 40,
  $4: 44,
  $true: 44,
  '$4.5': 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $xs: 28,
  $sm: 36,
  $md: 44,
  $lg: 52,
  $xl: 64,
}

const space = {
  $0: 0,
  '$0.5': 2,
  $1: 4,
  '$1.5': 6,
  $2: 8,
  '$2.5': 10,
  $3: 12,
  '$3.5': 14,
  $4: 16,
  $true: 16,
  '$4.5': 18,
  $5: 20,
  $6: 24,
  $7: 28,
  $8: 32,
  $9: 36,
  $10: 40,
  $11: 44,
  $12: 48,
  $14: 56,
  $16: 64,
  $20: 80,
  $24: 96,
  $xs: 8,
  $sm: 12,
  $md: 16,
  $lg: 20,
  $xl: 24,
  '-$0.5': -2,
  '-$1': -4,
  '-$1.5': -6,
  '-$2': -8,
  '-$2.5': -10,
  '-$3': -12,
  '-$3.5': -14,
  '-$4': -16,
  '-$4.5': -18,
  '-$5': -20,
  '-$6': -24,
  '-$7': -28,
  '-$8': -32,
  '-$9': -36,
  '-$10': -40,
  '-$11': -44,
  '-$12': -48,
}

const tokens = {
  size,
  space,
  radius: defaultTokens.radius,
  zIndex: defaultTokens.zIndex,
}

// ── fonts ────────────────────────────────────────────────────

const bodyFont = createFont({
  family: '"pplxSans", ui-sans-serif, system-ui, -apple-system, sans-serif',
  size: {
    1: 11, 2: 12, 3: 13, 4: 14, true: 14, 5: 15, 6: 16,
    7: 18, 8: 20, 9: 24, 10: 30, 11: 36, 12: 44,
    13: 52, 14: 62, 15: 74, 16: 88,
  },
  lineHeight: {
    1: 16, 2: 18, 3: 19, 4: 21, true: 21, 5: 22, 6: 24,
    7: 27, 8: 30, 9: 34, 10: 42, 11: 50, 12: 60,
    13: 70, 14: 82, 15: 98, 16: 116,
  },
  weight: { 1: '400', 6: '500' },
  letterSpacing: { 1: 0.15, 4: 0.1, true: 0.1, 6: 0, 8: -0.35, 12: -0.75 },
})

const headingFont = createFont({
  family: '"pplxSans", ui-sans-serif, system-ui, -apple-system, sans-serif',
  size: {
    1: 12, 2: 14, 3: 16, 4: 18, true: 18, 5: 20,
    6: 24, 7: 30, 8: 36, 9: 44, 10: 52, 11: 62, 12: 74,
  },
  lineHeight: {
    1: 16, 2: 18, 3: 22, 4: 24, true: 24, 5: 26,
    6: 30, 7: 36, 8: 44, 9: 52, 10: 62, 11: 74, 12: 86,
  },
  weight: { 1: '500', 6: '550' },
  letterSpacing: { 1: 0.2, 4: 0, 6: -0.2, 8: -0.5, 12: -1 },
})

const monoFont = createFont({
  family: '"pplxSansMono", ui-monospace, monospace',
  size: {
    1: 11, 2: 12, 3: 13, 4: 14, true: 14, 5: 15,
    6: 16, 7: 18, 8: 20, 9: 24, 10: 30,
  },
  lineHeight: {
    1: 18, 2: 20, 3: 22, 4: 24, true: 24, 5: 26,
    6: 28, 7: 30, 8: 34, 9: 40, 10: 48,
  },
  weight: { 1: '400' },
  letterSpacing: { 4: 0 },
})

// ── settings ─────────────────────────────────────────────────

const settings = {
  defaultFont: 'body' as const,
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web' as const,
  onlyAllowShorthands: true,
  styleCompat: 'react-native' as const,
}

// ── factory ──────────────────────────────────────────────────

export function createGuiConfig(themesConfig: ThemesConfig = {}) {
  const merged = { ...DEFAULT_SEEDS, ...themesConfig }

  // Base (neutral) palette
  const { light: lightPalette, dark: darkPalette } = resolveThemeDesc(merged.neutral)

  // Children theme palettes (all non-neutral themes)
  const { neutral: _neutral, ...childrenDescs } = merged
  const childrenThemes = Object.fromEntries(
    Object.entries(childrenDescs).map(([name, desc]) => {
      const { light, dark } = resolveThemeDesc(desc)
      return [name, { palette: { light, dark } }]
    }),
  )

  // Primary palette for backwards-compat bridge tokens
  const primaryPalettes = resolveThemeDesc(merged.primary)

  const themes = createThemes({
    base: {
      palette: { light: lightPalette, dark: darkPalette },
    },
    childrenThemes,
    getTheme: ({ palette }) => {
      if (!palette || palette.length < 12) return {} as Record<string, string>
      const bgIdx = 7
      const borderIdx = bgIdx + 2
      const isDark = palette[0] === darkPalette[0]
      const primary = isDark ? primaryPalettes.dark : primaryPalettes.light
      return {
        backgroundHover: palette[bgIdx + 1] as string,
        backgroundPress: palette[bgIdx + 2] as string,
        borderColorHover: palette[borderIdx + 1] as string,
        borderColorPress: palette[borderIdx + 2] as string,
        // Bridge tokens — temporary until all consumers use <Theme> wrapping
        brandPrimary: primary[9] as string,
        brandPrimaryHover: primary[8] as string,
        brandPrimaryPress: primary[7] as string,
        brandPrimaryTrack: primary[5] as string,
        brandDisabled: palette[7] as string,
        brandPrimaryText: palette[0] as string,
        toggleTrackOff: palette[7] as string,
        toggleBorderOff: primary[8] as string,
      }
    },
  })

  return createGui({
    themes,
    tokens,
    fonts: {
      body: bodyFont,
      heading: headingFont,
      mono: monoFont,
    },
    media,
    shorthands,
    selectionStyles: (theme: Record<string, string>) =>
      theme.color5
        ? { backgroundColor: theme.color5, color: theme.color11 }
        : null,
    settings,
  })
}
