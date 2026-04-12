import type { ThemesConfig } from '../../types'

export const DEFAULT_SEEDS: Required<ThemesConfig> = {
  neutral:   { seed: '#808080' },
  primary:   { seed: '#3B82F6' },
  secondary: { seed: '#721be4' },
  info:      { seed: '#eab308' },
  success:   { seed: '#16a34a' },
  warning:   { seed: '#fb923c' },
  danger:    { seed: '#dc2626' },
}
