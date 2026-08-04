# @hanzo/theming — working notes

Seeds in, design system out. A hex seed becomes a 12-step palette; the palettes
become a `@hanzo/gui` config, a set of CSS custom properties, and a handful of
themed components.

## Layout — three layers, each usable without the ones above it

| Layer | Entry | Depends on |
|---|---|---|
| Core | `src/types.ts`, `src/palette-utils.ts`, `src/index.ts` | nothing |
| CSS | `src/css/` | core |
| GUI | `src/gui/` | core, `@hanzo/gui` |

Import the core to do color math, `./css` to emit stylesheets, `./gui` only when
you actually need `@hanzo/gui`. Nothing in core or css pulls React.

## Rules that keep biting

- **One home per fact.** The semantic token map lives in `src/css/semantic.ts`
  and nowhere else; `dist/css/semantic.css` is emitted from it by
  `scripts/prepare-dist.mjs`. It used to also exist as a hand-edited `.css`
  file, and the two drifted (`--primary` was step 9 in one and step 10 in the
  other). Do not reintroduce a checked-in copy.
- **No Tailwind, no shadcn, no Radix.** The stylesheets are plain `:root` /
  `.dark` custom properties. If you find yourself typing `@theme`, stop.
- **`.dark` is the dark selector**, matching `@hanzo/ui/theme.css`. It is
  exported as `DARK_SELECTOR` — read it, don't retype it.
- **Default token scales live in `src/gui/defaults/`.** Size, space, radius,
  zIndex, media, fonts and seeds are all there. `createGuiConfig` passes raw
  numbers; `createGui` runs them through `createVariables` itself, which is why
  no config package is needed to build them.

## Build

`pnpm build` = `tsgo` (TypeScript 7 native, ~0.5s) + `scripts/prepare-dist.mjs`.
One compiler, one output format (ESM — the package is `"type": "module"`, and
relative imports carry explicit `.js` extensions so Node resolves them).

`tsgo` needs `types: ["node", "react"]` in `tsconfig.json`; without it, it fails
to pick up `@types/node` and reports `Cannot find name 'node:fs'`.

## Verifying a change

`@hanzo/gui` imports `react-native-web` without declaring it, so importing
`./gui` in bare Node fails unless `react-native-web` is installed. For a runtime
check, `pnpm add -D react-native-web`, exercise it, then remove it. The core and
css layers need no such thing.
