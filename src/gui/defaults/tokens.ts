/**
 * The default token scales `createGuiConfig` hands to `@hanzo/gui`.
 *
 * Raw numbers, not pre-built token objects: `createGui` runs them through
 * `createVariables` itself, which is why nothing here needs a config package
 * to construct them.
 *
 *   size    component heights (non-linear — buttons, inputs, rows)
 *   space   layout spacing (linear 4px grid — padding, margin, gap)
 *   radius  corner rounding
 *   zIndex  stacking bands
 */

export const DEFAULT_SIZE = {
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

export const DEFAULT_SPACE = {
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

export const DEFAULT_RADIUS = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
}

export const DEFAULT_Z_INDEX = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}
