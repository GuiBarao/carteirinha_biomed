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

**Supabase** config lives in `.env` (`VITE_SUPABASE_URL` / `VITE_SUPABASE_API_KEY`).

## Authentication Flow

- Login via RGM + senha, usando RPC `login_associated` no Supabase (senha verificada com `crypt()` server-side).
- Após login, verifica `ask_for_new_password` no registro do associado:
  - `true` → redireciona para `/change-password` (página para definir nova senha)
  - `false` → redireciona para `/dashboard` (COMMON) ou `/admin` (ADMIN)
- `ChangePasswordPage` chama `updatePassword()` no `userService`, que atualiza `password_hash` e seta `ask_for_new_password = false`.
- Sessão armazenada em `localStorage` sob a chave `patologicos_user`.

**Rotas protegidas:**
- `ProtectedRoute` — exige usuário logado, senão redireciona para `/login`
- `AdminRoute` — exige role `ADMIN`, senão redireciona para `/dashboard`

## Data Model — Associated

```typescript
type Associated = {
  id: string;
  rgm: string;
  complete_name: string;
  role: "ADMIN" | "COMMON";
  ask_for_new_password: boolean;
  deleted_at: string | null;
  updated_at: string | null;
};
```

`password_hash` existe no banco mas nunca é retornado ao frontend.

## Design System

Custom Tailwind config (`tailwind.config.cjs`) extends the default palette:
- **Primary greens:** `primary-900` (`#022b23`) → `primary-400` (`#34d399`)
- **Surfaces:** `surface` (`#020617`), `card` (`#020817`), `muted` (`#1e293b`)
- **Utility classes:** `.glass-panel`, `.page-padding`, `.page-grid` são definidas como Tailwind components

Logo: `public/imagens/logo-biomed.jpeg` — referenciada como `/imagens/logo-biomed.jpeg` em todos os componentes.
Favicon: definido no `index.html` apontando para `/imagens/logo-biomed.jpeg`.

## Current Status

- Autenticação real via Supabase (RPC `login_associated`) — funcionando.
- Fluxo de troca de senha obrigatória (`ask_for_new_password`) — implementado.
- QR code na carteirinha — placeholder (ainda não gerado).
- CRUD de associados e parceiros — implementado no painel admin.
