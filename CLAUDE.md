# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production static export → out/
npm run lint      # ESLint
```

No test runner is configured.

## Architecture

**Lake Merritt: The Living Necklace** is a Next.js 14 single-page marketing site with a Day/Night mode toggle, deployed as a static export to GitHub Pages.

### Stack

- **Next.js 14** with App Router, `output: 'export'` (static HTML/CSS/JS in `out/`)
- **Tailwind CSS** with `darkMode: 'class'` — toggled by adding/removing the `dark` class on the root wrapper
- **Lucide React** for icons
- **Google Fonts** loaded via `@import` inside a `<style>` tag in the component (Cormorant Garamond + DM Sans)

### Source layout

- `app/layout.jsx` — Root layout with metadata; imports `app/globals.css` (Tailwind directives)
- `app/page.jsx` — Re-exports the default component from `src/LakeMerrittPage.jsx`
- `src/LakeMerrittPage.jsx` — Single-file client component (`'use client'`) containing the full page and all sub-components

### Key state in `LakeMerrittPage.jsx`

| State | Type | Purpose |
|---|---|---|
| `isDark` | `boolean` | Drives Day/Night theme; adds `dark` class to root wrapper |
| `activePin` | `number \| null` | Which map landmark pin is selected (1–3) |

### Day/Night theming pattern

The root wrapper receives `className={isDark ? 'dark' : ''}`. All child elements use Tailwind's `dark:` variants alongside light-mode classes. Custom animations (water shimmer, amber pulse, necklace glow `box-shadow`) are defined in an injected `<style>` block inside the component.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Runs `npm ci` + `npm run build`
2. `next build` emits static files to `out/`
3. Deploys `out/` to GitHub Pages via `actions/deploy-pages`

`basePath` is set to `/lakemerritt` only when `GITHUB_ACTIONS=true`, so local dev works at `localhost:3000`.

**To activate GitHub Pages:** repo Settings → Pages → Source: **GitHub Actions**
