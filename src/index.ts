/**
 * The dependency-free core: palette types and the generators that turn a seed
 * color into a 12-step scale.
 *
 * `./css` renders these as stylesheets; `./gui` feeds them to `@hanzo/gui`.
 * Neither is needed to use this entry point.
 */

export type { Palette12, ThemeSeed, ThemeDesc, ThemesConfig } from './types.js'
export {
  generateNeutralPalette,
  generateNeutralPalettes,
  generateAccentPalette,
  resolveThemeDesc,
} from './palette-utils.js'
