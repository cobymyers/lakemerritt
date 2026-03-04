# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm start         # Dev server at http://localhost:1234/ (hot reload)
npm run build     # Production build → dist/
```

Requires Node.js v16.14.2 (see `.nvmrc`). No test runner is configured.

## Architecture

**Simplefolio** is a single-page static portfolio website. The bundler is **Parcel v2**, with `src/index.html` as the entry point (configured via `"source"` in `package.json`).

### Source layout

- `src/index.html` — All five page sections (Hero, About, Projects, Contact, Footer). Placeholder content marked with TODO comments.
- `src/index.js` — Entry point; calls `initScrollReveal()` and `initTiltAnimation()`.
- `src/scripts/` — `scrollReveal.js` and `tiltAnimation.js` (wraps ScrollReveal.js and Vanilla Tilt libraries).
- `src/data/scrollRevealConfig.js` — Animation configs per element, with different origins for desktop vs. mobile.
- `src/sass/` — SCSS following SMACSS: `abstracts/` (variables, mixins), `base/`, `components/`, `layout/`, `sections/`, `vendors/`.
- `src/styles.scss` — Root SCSS file that imports all partials.
- `src/assets/` — Static assets (profile.jpg, project.jpg, resume.pdf, favicon.png).

### Key styling conventions

- Theme colors defined in `src/sass/abstracts/_variables.scss` as `$main-color` (#02aab0) and `$secondary-color` (#00cdac).
- Responsive breakpoints are in `src/sass/abstracts/_mixins.scss`.
- Bootstrap v5 is imported and customized via `src/sass/vendors/_bootstrap.scss`.

### Deployment

GitHub Actions (`/.github/workflows/gh-pages.yml`) runs `npm install` + `npm run build` on push/PR to `main`, then deploys `dist/` to GitHub Pages.
