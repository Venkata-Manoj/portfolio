# Portfolio - Ballani Venkata Manoj

Personal portfolio SPA for Ballani Venkata Manoj, an AI & Data Science Engineer. Dark-themed single-page application showcasing projects, services, and contact information with interactive UI animations.

## Tech Stack

- **React 19** + **Vite 6** (build tool)
- **Tailwind CSS v4** (styling via `@theme inline`; no config file)
- **Framer Motion v12** (animations, viewport reveals, 3D parallax)
- **Lucide React** (icons)
- **Kanit** (Google Font)
- **ESLint v10** (flat config, no TypeScript)

## Getting Started

```bash
npm install       # install dependencies
npm run dev       # start dev server (localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve built dist/ locally to verify
npm run lint      # ESLint check (flat config)
```

## Project Structure

```
portfolio-app/
  public/
    video/intro.mp4   # hero background video
    audio/             # PAM tour audio files
  src/
    components/        # React components (Navbar, HeroSection, ...)
    styles/
      animations.css   # global keyframes
    App.jsx            # root component
    main.jsx           # entrypoint
    index.css          # Tailwind directives + theme variables
  index.html
  vite.config.js
  eslint.config.js
```

## Deployment

Build output goes to `dist/` -- a fully static bundle. Deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages, etc.). No server-side runtime or environment variables required.
