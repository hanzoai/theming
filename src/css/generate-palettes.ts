#!/usr/bin/env node

/**
 * `generate-palettes` — write an org's palette stylesheet from its brand seeds.
 *
 *   generate-palettes --brandFile src/brand.json --outFile src/brand-palettes.css
 *
 * The semantic layer (`@hanzo/theming/semantic.css`) is org-independent and
 * ships with this package; only the palettes are per-org, so only they are
 * generated here.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { generatePaletteCss } from './palettes.js'
import type { ThemesConfig } from '../types.js'

const args = process.argv.slice(2)

const getArg = (name: string, fallback: string): string => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const die = (msg: string): never => {
  console.error(msg)
  process.exit(1)
}

const brandFile = resolve(getArg('brandFile', 'src/brand.json'))
const outFile = resolve(getArg('outFile', 'src/brand-palettes.css'))

let brand: { themes?: ThemesConfig }
try {
  brand = JSON.parse(readFileSync(brandFile, 'utf-8'))
}
catch (e) {
  die(`Error reading ${brandFile}: ${(e as Error).message}`)
}

const themes = brand!.themes ?? die(`Error: no "themes" field found in ${brandFile}`)

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, generatePaletteCss(themes))

console.log(`Wrote ${outFile}`)
