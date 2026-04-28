/**
 * Factory: GuiConfigOptions → full @hanzo/gui config.
 *
 * All options are optional — omitted values get sensible defaults.
 */

import { createGui } from '@hanzo/gui'
// @ts-ignore — createFont exists at runtime via @hanzogui/web but pnpm strict hoisting hides types
import { createFont } from '@hanzogui/web'
import { createThemes } from '@hanzogui/theme-builder'
import { shorthands as baseShorthands } from '@hanzogui/shorthands/v4'
import { getDefaultGuiConfig } from '@hanzogui/config-default'

import { resolveThemeDesc } from '../palette-utils'
import { DEFAULT_SEEDS } from './defaults/themes'
import { DEFAULT_SIZE, DEFAULT_SPACE } from './defaults/spacing'
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADING_FONT,
  DEFAULT_MONO_FONT,
} from './defaults/fonts'
import type { FontDef, GuiConfigOptions } from './types'
import type { Palette12, ThemeSeed, ThemeDesc, ThemesConfig } from '../types'

export type { FontDef, GuiConfigOptions, Palette12, ThemeSeed, ThemeDesc, ThemesConfig }

// ────────────────────────────────────────────────────────────
// Type augmentation — activates when this module is imported.
// Tells TypeScript about the shorthand props (w, h, bg, etc.)
// we register in createGuiConfig below, so <XStack>, <Text>, etc.
// accept them without a cast.
// ────────────────────────────────────────────────────────────

declare module '@hanzogui/web' {
  interface GuiCustomConfig {
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

// ── factory ──────────────────────────────────────────────────

export function createGuiConfig(options: GuiConfigOptions = {}) {
  const {
    themes: themesConfig,
    fonts: fontsConfig,
    size: sizeOverride,
    space: spaceOverride,
  } = options

  // Merge theme seeds with defaults
  const mergedThemes = { ...DEFAULT_SEEDS, ...(themesConfig ?? {}) }

  // Base (neutral) palette
  const { light: lightPalette, dark: darkPalette } = resolveThemeDesc(mergedThemes.neutral)

  // Children theme palettes (all non-neutral themes)
  const { neutral: _neutral, ...childrenDescs } = mergedThemes
  const childrenThemes = Object.fromEntries(
    Object.entries(childrenDescs).map(([name, desc]) => {
      const { light, dark } = resolveThemeDesc(desc)
      return [name, { palette: { light, dark } }]
    }),
  )

  // Primary palette for backwards-compat bridge tokens
  const primaryPalettes = resolveThemeDesc(mergedThemes.primary)

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

  // Tokens
  const _defaultConfig = getDefaultGuiConfig('web')
  const tokens = {
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

  return createGui({
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
