# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production static export → out/
npm run lint      # ESLint
```

No test runner is configured.

`npm start` (`next start`) does NOT work — `output: 'export'` produces static files only. Preview a production build with `npx serve out` (note: CI builds use `basePath: /lakemerritt`, so deep links 404 unless served under that path; local builds have no basePath).

## Architecture

**Lake Merritt: The Living Necklace** is a Next.js 14 single-page marketing site with a Day/Night mode toggle, deployed as a static export to GitHub Pages.

### Stack

- **Next.js 14** with App Router, `output: 'export'` (static HTML/CSS/JS in `out/`)
- **Tailwind CSS** with `darkMode: 'class'` — toggled by adding/removing the `dark` class on the root wrapper
- **Lucide React** for icons
- **Google Fonts** (Cormorant Garamond, DM Sans, IBM Plex Mono) loaded via `<link>` tags in `app/layout.jsx`
- **Custom CSS** (font helpers, water shimmer, marquee, blur-in, necklace glow, etc.) in `app/globals.css` — do NOT reintroduce an inline `<style>` block in the component; React 18 escapes `'`/`&` in SSR'd style text, which causes hydration mismatch errors

### Source layout

- `app/layout.jsx` — Root layout with metadata and font `<link>` tags; imports `app/globals.css`
- `app/page.jsx` — Re-exports the default component from `src/LakeMerrittPage.jsx`
- `src/LakeMerrittPage.jsx` — Single-file client component (`'use client'`) containing the full page and all sub-components

### Legacy files — do not edit

The working tree contains **untracked leftovers from the "Simplefolio" template** this repo was scaffolded from. They are not part of the app and are not tracked by git:

- `README.md`, `LICENSE.md`, `examples/`, `.nvmrc`, `.prettierrc` — the README describes a Parcel/Bootstrap portfolio; **ignore it**, it does not apply to this project
- `src/index.html`, `src/index.js`, `src/styles.scss`, `src/sass/`, `src/scripts/`, `src/data/`, `src/assets/` — dead code; nothing imports them

Only files listed by `git ls-files` (essentially `app/`, `src/LakeMerrittPage.jsx`, and root configs) constitute the real codebase. Do not "fix" imports or styles by referencing the legacy files.

### Key state in `LakeMerrittPage.jsx`

| State | Type | Purpose |
|---|---|---|
| `isDark` | `boolean` | Drives Day/Night theme; adds `dark` class to root wrapper |
| `activePin` | `number \| null` | Which map landmark pin is selected (1–3) |
| `progress`, `loaded`, `loaderGone` | `number`, `boolean`, `boolean` | Preloader: eased 0→100 counter, curtain lift, unmount; scroll is locked until `loaded` |
| `wordIdx` | `number` | Index into `HERO_WORDS` for the rotating hero sub (3.2s interval, blur-swap via keyed remount) |
| `scrollPct` | `number` | Scroll position % driving the fixed top progress bar |

Dolsten.com-inspired features: preloader counter, rotating hero words, CSS marquee strip, scroll progress bar, `PixelReveal` tile-grid image reveals (IntersectionObserver), numbered mono section labels, hero stat column + vertical coordinates. The hero is pure CSS motion — animated water-shimmer gradient + slowly counter-rotating shoreline rings (`spin-slow` in `globals.css`); no imagery. Card image day/night swaps stack both images and crossfade `opacity` (a `src` swap can't be CSS-transitioned). Page content is intentionally identical in day and night modes — only styling differs.

### Day/Night theming pattern

The root wrapper receives `className={isDark ? 'dark' : ''}`. All child elements use Tailwind's `dark:` variants alongside light-mode classes. Custom animations (water shimmer, amber pulse, necklace glow `box-shadow`) live in `app/globals.css`.

### Content & assets

All page content (copy, map pins, ecology cards) lives in constants at the top of `LakeMerrittPage.jsx` (`IMG`, `PINS`, `CARDS`, `HERO_WORDS`, `MARQUEE`). Images are hot-linked Unsplash URLs — there are no local image assets, so no `public/` folder or `next/image` configuration is needed.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Runs `npm ci` + `npm run build`
2. `next build` emits static files to `out/`
3. Deploys `out/` to GitHub Pages via `actions/deploy-pages`

`basePath` is set to `/lakemerritt` only when `GITHUB_ACTIONS=true`, so local dev works at `localhost:3000`.

**To activate GitHub Pages:** repo Settings → Pages → Source: **GitHub Actions**

`CLAUDE.md` duplicates this file for Claude Code — if you update commands or architecture here, mirror the change there.
