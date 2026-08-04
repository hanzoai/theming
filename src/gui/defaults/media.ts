/**
 * Default media queries — the breakpoints `$sm`, `$gtMd`, `$short`, … resolve to.
 *
 * `max`-prefixed names match at or below a width, `gt`-prefixed above it, so a
 * style can be written from either direction without a second scale.
 */

export const DEFAULT_MEDIA = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 661 },
  gtSm: { minWidth: 801 },
  gtMd: { minWidth: 1021 },
  gtLg: { minWidth: 1281 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
} as const
