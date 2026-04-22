#!/usr/bin/env node
// Prepares dist/ for publish: writes a cleaned package.json plus README + LICENSE,
// so that `pnpm publish` (with publishConfig.directory: "dist") finds a complete
// package root inside dist/.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

if (!fs.existsSync(dist)) {
  console.error('dist/ does not exist — run the rest of the build first')
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

// Fields that don't belong in the published package
delete pkg.scripts
delete pkg.devDependencies

// directory only matters at publish time; strip from the dist/ copy
if (pkg.publishConfig?.directory) delete pkg.publishConfig.directory

// `files` is interpreted relative to the package root — and here, dist/ IS the root,
// so `files: ["dist"]` would point at a non-existent dist/dist/. Drop entirely;
// pnpm publishes everything under the root by default.
delete pkg.files

fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

for (const f of ['README.md', 'LICENSE']) {
  const src = path.join(root, f)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, f))
}

console.log('prepared dist/ for publish')
