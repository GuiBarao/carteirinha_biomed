# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint (strict — zero warnings allowed)
```

## Architecture

React 18 + TypeScript SPA using Vite, Tailwind CSS, React Router v6, and Supabase for backend.

**Routing** (`src/App.tsx`): All routes are defined here. Unknown routes fall back to `/login`. Admin routes live under `/admin/*`.

**Layouts** (`src/layouts/`):
- `MainLayout` — standard user-facing layout with bottom navigation bar (mobile-first)
- `AdminLayout` — sidebar layout for admin pages

**Pages** (`src/pages/`): One component per route. Pages are thin — they compose layout + components.

**Components** (`src/components/`):
- `ui/` — reusable primitives: `Button` (primary/secondary/ghost variants), `Input`, `Badge` (success/danger/neutral)
- `cards/` — `MembershipCard` (digital ID with QR placeholder), `PartnerCard` (partnership display)

**Data model** (`src/classes/Partner.ts`): `Partner` class wrapping the `PartnerType` shape `{ id, name, created_at, description, benefit_description }`.

**Supabase** config lives in `.env` (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).

## Design System

Custom Tailwind config (`tailwind.config.cjs`) extends the default palette:
- **Primary greens:** `primary-900` (`#022b23`) → `primary-400` (`#34d399`)
- **Surfaces:** `surface` (`#020617`), `card` (`#020817`), `muted` (`#1e293b`)
- **Utility classes:** `.glass-panel`, `.page-padding`, `.page-grid` are defined as Tailwind components

Logo image expected at `public/imagens/logo-biomed.png`.

## Current Status

Authentication and form submissions are mocked — no real backend calls yet. QR code generation is a placeholder.
