# BlueSoil

A visual builder for Basalt 2.5 XML interfaces. Design UI layouts for CC:Tweaked
computers (including Pocket) and monitors, preview them on a terminal-renderer
canvas, and export XML (`ui.xml`), a Lua loader (`startup.lua`), and a JSON
project file (`bluesoil-project.json`). Existing Basalt XML or saved JSON
projects can be imported back. Work autosaves to localStorage.

## Getting Started

Install dependencies:

    pnpm install

Run the dev server:

    pnpm dev

Build for production (typechecks, then builds):

    pnpm build

Other scripts (`package.json`): `pnpm lint` (lint), `pnpm preview`
(preview the Cloudflare Workers build with `wrangler dev`), and
`pnpm deploy` (deploy with `wrangler deploy`). CI runs `vp check`
(format, lint, and type checks).

## Tech Stack

- React 19 + TypeScript
- Vite+ (`vite-plus`) + `@cloudflare/vite-plugin`
- Tailwind CSS v4
- shadcn/ui (Base Nova style, Base UI)
- Zustand
- lucide-react
- Prism (`prism-react-renderer` / `prismjs`) for code views

## Basalt

This tool generates markup for [Basalt 2.5](https://basalt.madefor.cc/2.5/), a UI
framework for CC:Tweaked. See the [Basalt documentation](https://basalt.madefor.cc/2.5/api/)
for details on elements, properties, and events.
