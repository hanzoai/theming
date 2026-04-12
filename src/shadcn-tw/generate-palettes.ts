#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { generateTwThemePalettesCss } from './utils'

const args = process.argv.slice(2)

function getArg(name: string, fallback: string): string {
  const idx = args.indexOf(`--${name}`)
  if (idx !== -1 && args[idx + 1]) return args[idx + 1]
  return fallback
}

const brandFile = resolve(getArg('brandFile', 'src/brand.json'))
const outFile = resolve(getArg('outFile', 'src/brand-palettes.css'))

let json: any
try {
  json = JSON.parse(readFileSync(brandFile, 'utf-8'))
}
catch (e) {
  console.error(`Error: could not read ${brandFile}`)
  process.exit(1)
}

if (!json.themes) {
  console.error(`Error: no "themes" field found in ${brandFile}`)
  process.exit(1)
}

const css = generateTwThemePalettesCss(json.themes)

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, css)

console.log(`Wrote ${outFile}`)
