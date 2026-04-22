/**
 * Default font definitions using system fonts available on all platforms.
 *
 * Org brand packages can override these with custom fonts (e.g., Geist, Inter)
 * by passing a fonts object to createHanzoguiConfig().
 */

import type { FontDef } from '../types'

export const DEFAULT_BODY_FONT: FontDef = {
  family: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
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
}

export const DEFAULT_HEADING_FONT: FontDef = {
  family: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
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
}

export const DEFAULT_MONO_FONT: FontDef = {
  family: 'ui-monospace, monospace',
  size: {
    1: 11, 2: 12, 3: 13, 4: 14, true: 14, 5: 15,
    6: 16, 7: 18, 8: 20, 9: 24, 10: 30,
  },
  lineHeight: {
    1: 18, 2: 20, 3: 22, 4: 24, true: 24, 5: 26,
    6: 28, 7: 30, 8: 34, 9: 40, 10: 48,
  },
  weight: { 1: '400' },
  letterSpacing: { 4: 0, true: 0 },
}
