/** A 12-step color palette (lightest → darkest for light, darkest → lightest for dark). */
export type Palette12 = [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
]

/** A single seed color for auto-generating a 12-step palette. */
export type ThemeSeed = { seed: string }

/**
 * How a theme's palette is described:
 *   - A seed color → generates both light and dark 12-step palettes
 *   - An explicit 12-step palette → used as-is for both schemes
 *   - Per-scheme overrides → mix seeds and explicit palettes
 */
export type ThemeDesc =
  | ThemeSeed
  | Palette12
  | { light: ThemeSeed | Palette12; dark: ThemeSeed | Palette12 }

/**
 * Theme configuration. All optional — unspecified themes get sensible defaults.
 *
 * Default seeds:
 *   neutral:   #808080
 *   primary:   #3B82F6
 *   secondary: #721be4
 *   info:      #2563eb
 *   success:   #16a34a
 *   warning:   #d97706
 *   danger:    #dc2626
 */
export interface ThemesConfig {
  neutral?: ThemeDesc
  primary?: ThemeDesc
  secondary?: ThemeDesc
  info?: ThemeDesc
  success?: ThemeDesc
  warning?: ThemeDesc
  danger?: ThemeDesc
}
