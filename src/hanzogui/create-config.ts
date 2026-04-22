/**
 * Factory: HanzoguiConfigOptions → full Hanzogui config.
 *
 * All options are optional — omitted values get sensible defaults.
 */

import { createHanzogui } from 'hanzogui'
// @ts-ignore — createFont exists at runtime via @hanzogui/web but pnpm strict hoisting hides types
import { createFont } from '@hanzogui/web'
import { createThemes } from '@hanzogui/theme-builder'
import { shorthands as baseShorthands } from '@hanzogui/shorthands/v4'
import { getDefaultHanzoguiConfig } from '@hanzogui/config-default'
import { createAnimations } from '@hanzogui/animations-react-native'

import { resolveThemeDesc } from '../palette-utils'
import { DEFAULT_SEEDS } from './defaults/themes'
import { DEFAULT_SIZE, DEFAULT_SPACE } from './defaults/spacing'
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADING_FONT,
  DEFAULT_MONO_FONT,
} from './defaults/fonts'
import type { FontDef, HanzoguiConfigOptions } from './types'
import type { Palette12, ThemeSeed, ThemeDesc, ThemesConfig } from '../types'

export type { FontDef, HanzoguiConfigOptions, Palette12, ThemeSeed, ThemeDesc, ThemesConfig }

// ────────────────────────────────────────────────────────────
// Type augmentation — activates when this module is imported.
// Tells TypeScript about the shorthand props (w, h, bg, etc.)
// we register in createHanzoguiConfig below, so <XStack>, <Text>, etc.
// accept them without a cast.
// ────────────────────────────────────────────────────────────

declare module '@hanzogui/web' {
  interface HanzoguiCustomConfig {
    shorthands: {
      // Dimensions
      w: 'width'
      h: 'height'
      // Flex
      f: 'flex'
      fb: 'flexBasis'
      fd: 'flexDirection'
      fw: 'flexWrap'
      grow: 'flexGrow'
      shrink: 'flexShrink'
      items: 'alignItems'
      justify: 'justifyContent'
      self: 'alignSelf'
      content: 'alignContent'
      // Margin
      m: 'margin'
      mt: 'marginTop'
      mb: 'marginBottom'
      ml: 'marginLeft'
      mr: 'marginRight'
      mx: 'marginHorizontal'
      my: 'marginVertical'
      // Padding
      p: 'padding'
      pt: 'paddingTop'
      pb: 'paddingBottom'
      pl: 'paddingLeft'
      pr: 'paddingRight'
      px: 'paddingHorizontal'
      py: 'paddingVertical'
      // Background
      bg: 'backgroundColor'
      // Border width
      bw: 'borderWidth'
      btw: 'borderTopWidth'
      bbw: 'borderBottomWidth'
      blw: 'borderLeftWidth'
      brw: 'borderRightWidth'
      // Border color
      bc: 'borderColor'
      btc: 'borderTopColor'
      bbc: 'borderBottomColor'
      blc: 'borderLeftColor'
      brc: 'borderRightColor'
      // Border radius
      rounded: 'borderRadius'
      // Overflow / opacity
      ov: 'overflow'
      op: 'opacity'
      // Position
      pos: 'position'
      t: 'top'
      b: 'bottom'
      l: 'left'
      r: 'right'
      z: 'zIndex'
      // Min/Max
      maxW: 'maxWidth'
      maxH: 'maxHeight'
      minW: 'minWidth'
      minH: 'minHeight'
      // Text
      text: 'textAlign'
      select: 'userSelect'
      // Cursor
      cur: 'cursor'
    }
    animations: typeof animations
  }
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

// ── settings ─────────────────────────────────────────────────

const settings = {
  defaultFont: 'body' as const,
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web' as const,
  onlyAllowShorthands: true,
  styleCompat: 'react-native' as const,
}

// ── animations ───────────────────────────────────────────────

const animations = createAnimations({
  quick: { type: 'timing', duration: 150 },
})

// ── factory ──────────────────────────────────────────────────

export function createHanzoguiConfig(options: HanzoguiConfigOptions = {}) {
  const {
    themes: themesConfig,
    fonts: fontsConfig,
    size: sizeOverride,
    space: spaceOverride,
  } = options

  // Merge theme seeds with defaults
  const mergedThemes = { ...DEFAULT_SEEDS, ...(themesConfig ?? {}) }

  // ── Neutral (grey) palette — shared across all themes as $grey1…$grey12
  const neutralPalettes = resolveThemeDesc(mergedThemes.neutral, 'neutral')

  // ── Accent palettes — each child theme gets a full Radix accent scale
  const { neutral: _neutral, ...childrenDescs } = mergedThemes
  const childrenThemes = Object.fromEntries(
    Object.entries(childrenDescs).map(([name, desc]) => {
      const { light, dark } = resolveThemeDesc(desc, 'accent')
      return [name, { palette: { light, dark } }]
    }),
  )

  // ── Hanzogui theme generation ─────────────────────────────────
  //
  // Each accent theme's $color1…$color12 maps to its accent palette
  // via Hanzogui's default template. In addition, getTheme injects
  // $grey1…$grey12 from the neutral palette into EVERY theme, so
  // components always have access to neutral surface/border/text tokens.
  //
  // Component convention:
  //   $grey  → surfaces, borders, body text (neutral)
  //   $color → accent fills, hover, press, accent text

  const themes = createThemes({
    base: {
      palette: { light: neutralPalettes.light, dark: neutralPalettes.dark },
    },
    childrenThemes,
    getTheme: ({ name, theme }) => {
      const isDark = name === 'dark' || name.startsWith('dark_')
      const neutral = isDark ? neutralPalettes.dark : neutralPalettes.light

      // Contrast text for solid action surfaces ($color9 = step 9 = seed).
      // White text on dark fills, dark text on light fills.
      // Stored as `solidText` — a custom theme key consumed via useTheme()
      // since Hanzogui's CSS variable injection only covers template-standard keys.
      const whiteish = isDark ? neutral[11] : neutral[0]
      const blackish = isDark ? neutral[0] : neutral[11]
      let solidText = isDark ? whiteish : blackish
      const seedHex = theme?.color9
      if (seedHex && seedHex.startsWith('#')) {
        const n = parseInt(seedHex.replace('#', ''), 16)
        const r = ((n >> 16) & 0xff) / 255
        const g = ((n >> 8) & 0xff) / 255
        const b = (n & 0xff) / 255
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        solidText = lum < 0.5 ? whiteish : blackish
      }

      return {
        grey1:  neutral[0],
        grey2:  neutral[1],
        grey3:  neutral[2],
        grey4:  neutral[3],
        grey5:  neutral[4],
        grey6:  neutral[5],
        grey7:  neutral[6],
        grey8:  neutral[7],
        grey9:  neutral[8],
        grey10: neutral[9],
        grey11: neutral[10],
        grey12: neutral[11],
        solidText,
      } as Record<string, string>
    },
  })

  // Tokens
  const _defaultConfig = getDefaultHanzoguiConfig('web')
  const tokens = {
    color: _defaultConfig.tokens.color,
    size: sizeOverride ?? DEFAULT_SIZE,
    space: spaceOverride ?? DEFAULT_SPACE,
    radius: _defaultConfig.tokens.radius,
    zIndex: _defaultConfig.tokens.zIndex,
  }

  // Fonts — null or omitted = default
  const fonts = fontsConfig ?? {}
  const body = fonts.body ?? DEFAULT_BODY_FONT
  const heading = fonts.heading ?? DEFAULT_HEADING_FONT
  const mono = fonts.mono ?? DEFAULT_MONO_FONT

  return createHanzogui({
    animations,
    themes,
    tokens,
    fonts: {
      body: createFont(body),
      heading: createFont(heading),
      mono: createFont(mono),
    },
    media: _defaultConfig.media,
    shorthands,
    selectionStyles: (theme: Record<string, string>) =>
      theme.color5
        ? { backgroundColor: theme.color5, color: theme.color11 }
        : null,
    settings,
  })
}
