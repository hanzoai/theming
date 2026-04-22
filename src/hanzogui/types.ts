import type { ThemesConfig } from '../types'

export interface FontDef {
  family: string
  size: Record<number | 'true', number>
  lineHeight: Record<number | 'true', number>
  weight: Record<number, string>
  letterSpacing: Record<string | number, number>
}

export interface HanzoguiConfigOptions {
  themes?: ThemesConfig | null
  fonts?: {
    body?: FontDef | null
    heading?: FontDef | null
    mono?: FontDef | null
  } | null
  size?: Record<string, number> | null
  space?: Record<string, number> | null
}
