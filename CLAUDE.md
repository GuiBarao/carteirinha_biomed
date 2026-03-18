# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint (strict — zero warnings allowed)
```

## Stack

React 18 + TypeScript SPA using Vite, Tailwind CSS, React Router v6, and Supabase for backend.
No external state management library — React Context API only.
Icons: `lucide-react`. PDF generation: `html2canvas` + `jspdf`.

---

## Directory Structure

```
src/
├── App.tsx                  # Route definitions + ProtectedRoute + AdminRoute
├── main.tsx                 # Entry point — wraps app in AuthProvider
├── index.css                # Global styles + Tailwind directives
├── context/
│   └── AuthContext.tsx      # Auth state, login/logout/updateUser, localStorage persistence
├── lib/
│   └── supabase.ts          # Supabase client singleton
├── services/
│   ├── userService.ts       # All DB operations for "associated" table + RPC login
│   └── partnerService.ts    # All DB operations for "partners" table + Storage upload
├── classes/
│   └── Partner.ts           # PartnerType (type export) + Partner class (unused wrapper)
├── layouts/
│   ├── MainLayout.tsx       # User-facing layout: header + bottom nav + logout
│   └── AdminLayout.tsx      # Admin layout: sidebar navigation
├── pages/
│   ├── LoginPage.tsx        # Login form (RGM + senha)
│   ├── ChangePasswordPage.tsx  # Forced first-login password change
│   ├── DashboardPage.tsx    # Home page after login (profile + featured partners + search)
│   ├── CarteirinhaPage.tsx  # Digital membership card + PDF download
│   ├── ParceriasPage.tsx    # Full list of active partnerships + search
│   └── AdminPage.tsx        # Admin CRUD panel (associates + partners)
└── components/
    ├── ui/
    │   ├── Button.tsx        # primary / secondary / ghost variants; sm/md/lg sizes
    │   ├── Input.tsx         # label, icon, rightAction, error, description props
    │   └── Badge.tsx         # success / danger / neutral tones
    └── cards/
        ├── MembershipCard.tsx  # Digital vertical ID card
        └── PartnerCard.tsx     # Partnership/discount card (optional logo)
```

---

## Routing (`src/App.tsx`)

| Route              | Component             | Guard          |
|--------------------|-----------------------|----------------|
| `/`                | → `/login` redirect   | —              |
| `/login`           | `LoginPage`           | public         |
| `/dashboard`       | `DashboardPage`       | ProtectedRoute |
| `/carteirinha`     | `CarteirinhaPage`     | ProtectedRoute |
| `/parcerias`       | `ParceriasPage`       | ProtectedRoute |
| `/change-password` | `ChangePasswordPage`  | ProtectedRoute |
| `/admin/*`         | `AdminPage`           | AdminRoute     |
| `*`                | → `/login` redirect   | —              |

**ProtectedRoute** — redirects to `/login` if no authenticated user.
**AdminRoute** — redirects to `/login` (no user) or `/dashboard` (role ≠ ADMIN).

---

## Authentication Flow

### Login (`LoginPage`)
1. User submits RGM + senha.
2. Calls `loginAssociated(rgm, password)` → Supabase RPC `login_associated`.
3. Server validates password via `crypt()`, returns `Associated` row.
4. `login(user)` saves user to `AuthContext` + `localStorage("patologicos_user")`.
5. If `ask_for_new_password === true` → navigate `/change-password`.
6. Otherwise → navigate `/dashboard`.

**Forgot password** button fetches `DEFINE_NEW_PASSWORD_NUMBER` and `DEFINE_NEW_PASSWORD_MESSAGE` from `app_configuration` table and opens a WhatsApp deep link.

### Forced Password Change (`ChangePasswordPage`)
1. User enters new password (min 4 chars) + confirmation.
2. Calls `updatePassword(user.id, password)` → updates `password_hash`, sets `ask_for_new_password = false`.
3. Calls `updateUser({ ask_for_new_password: false })` to sync AuthContext.
4. Navigates to `/admin` (ADMIN) or `/dashboard` (COMMON).

### Session Persistence
- `AuthProvider` initializes from `localStorage("patologicos_user")` on mount.
- `logout()` clears state + removes the key.
- `password_hash` is never returned to the frontend.

---

## Data Models

### Associated (`src/services/userService.ts`)

```typescript
type AssociatedRole = "ADMIN" | "COMMON";

type Associated = {
  id: string;                        // UUID
  rgm: string;
  complete_name: string;
  role: AssociatedRole;
  ask_for_new_password: boolean;
  deleted_at: string | null;         // ISO timestamp — soft delete
  updated_at: string | null;
};
```

`password_hash` exists in the DB but is never selected or returned to the frontend.

### Partner (`src/classes/Partner.ts`)

```typescript
export type PartnerType = {
  id: number;
  name: string;
  created_at: Date;
  description: string | null;
  benefit_description: string | null;  // short label, e.g. "10% OFF"
  deleted_at: string | null;           // ISO timestamp — soft delete
  has_image_stored: boolean;           // whether a logo exists in Storage
};
```

---

## Supabase

**Client:** `src/lib/supabase.ts` — singleton, env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_API_KEY`.

### Tables

| Table               | Notes                                                                              |
|---------------------|------------------------------------------------------------------------------------|
| `associated`        | Members. Soft-deleted via `deleted_at`. Password stored as `crypt()` hash.        |
| `partners`          | Partnerships. Soft-deleted via `deleted_at`. Has `has_image_stored` boolean.       |
| `app_configuration` | Key-value config. Keys: `DEFINE_NEW_PASSWORD_NUMBER`, `DEFINE_NEW_PASSWORD_MESSAGE`. |

### Storage

| Bucket              | Key format | Notes                                              |
|---------------------|------------|----------------------------------------------------|
| `partner_images`    | `{id}`     | Partner logos. Upserted on upload. Public read.    |

### RPCs

| RPC                | Called by             | Description                                                             |
|--------------------|-----------------------|-------------------------------------------------------------------------|
| `login_associated` | `loginAssociated()`   | Validates RGM + password via `crypt()`, returns associated row. Filters `deleted_at IS NULL`. |

---

## Services

### `userService.ts`

| Function                           | Description                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| `generateTempPassword()`           | Returns random 6-char alphanumeric string (excludes confusing chars I, O, l)     |
| `loginAssociated(rgm, password)`   | Calls RPC `login_associated`, throws if no match                                  |
| `fetchAssociated(includeInactive)` | SELECT all (default: `deleted_at IS NULL`), ordered by `complete_name`            |
| `createAssociated(fields)`         | INSERT with auto-generated temp password; returns `{ associated, tempPassword }`  |
| `updateAssociated(id, fields)`     | UPDATE editable fields (rgm, complete_name, role)                                 |
| `updatePassword(id, newPassword)`  | UPDATE `password_hash`, set `ask_for_new_password = false`                        |
| `resetAssociatedPassword(id, name)`| Generate new temp password, set `ask_for_new_password = true`; returns `{ name, password }` |
| `softDeleteAssociated(id)`         | SET `deleted_at = now()`                                                          |
| `reactivateAssociated(id)`         | SET `deleted_at = null`                                                           |

### `partnerService.ts`

| Function                          | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| `fetchPartners(includeInactive)`  | SELECT all (default: `deleted_at IS NULL`), ordered by `created_at DESC`    |
| `createPartner(partner)`          | INSERT, returns created record                                              |
| `updatePartner({ id, ...})`       | UPDATE where id matches, returns updated record                             |
| `softDeletePartner(id)`           | SET `deleted_at = now()`                                                    |
| `reactivatePartner(id)`           | SET `deleted_at = null`                                                     |
| `uploadPartnerImage(id, file)`    | Upsert file to `partner_images` bucket at key `{id}`, then SET `has_image_stored = true` |
| `getPartnerImageUrl(id)`          | Returns public URL for `partner_images/{id}` (synchronous)                 |

---

## State Management

Single pattern throughout: **React `useState` + `useEffect` per page**, with a single **`AuthContext`** for cross-cutting auth state.

### `AuthContext` (`src/context/AuthContext.tsx`)

```typescript
type AuthContextType = {
  user: Associated | null;
  login: (user: Associated) => void;
  updateUser: (partial: Partial<Associated>) => void;
  logout: () => void;
};
```

- Initialized from `localStorage("patologicos_user")` on mount.
- `login()` stores to state + localStorage.
- `updateUser()` merges partial into existing user, persists.
- `logout()` clears state + localStorage key.
- `useAuth()` hook — throws if called outside `AuthProvider`.

Each page fetches its own data on mount in a `useEffect`; no shared data cache.

---

## Components

### UI Primitives (`src/components/ui/`)

**Button** — `variant: "primary" | "secondary" | "ghost"`, `size: "sm" | "md" | "lg"`, `fullWidth`, `leftIcon`, `rightIcon`. Extends `ButtonHTMLAttributes`.

**Input** — `label`, `description`, `icon` (left), `rightAction` (right, e.g. show/hide password), `error`. Extends `InputHTMLAttributes`.

**Badge** — `tone: "success" | "danger" | "neutral"`. Uppercase, compact, tracking-wide.

### Cards (`src/components/cards/`)

**MembershipCard** — props: `name`, `rgm`, `status: "ativo" | "inativo"`. Vertical layout: brasão (`/imagens/pato-biomed.png`) → nome da atlética → dados do associado → status badge. No QR code.

**PartnerCard** — props: `name`, `benefit`, `description`, `category?`, `imageUrl?`. Renders logo `<img>` when `imageUrl` is provided; renders nothing in the logo slot otherwise (no placeholder).

---

## Pages

### `CarteirinhaPage` (`src/pages/CarteirinhaPage.tsx`)

- Reads `user.complete_name` and `user.rgm` from `AuthContext` (real data).
- Renders `MembershipCard` on screen.
- **PDF download**: `html2canvas` captures a hidden `div` (white background, print-friendly layout, scale 3×) → `jsPDF` generates `carteirinha-{rgm}.pdf`. Button shows spinner during generation.
- The hidden PDF layout is positioned at `left: -9999px` and mirrors the card content with inline styles for print fidelity.

### `DashboardPage` (`src/pages/DashboardPage.tsx`)

- Shows user profile card (from `AuthContext`), link to `/carteirinha`, benefits list.
- Loads all partners on mount. Default view: first 3 partners. With search: shows all matching results.
- Partner search filters by name, client-side.

### `ParceriasPage` (`src/pages/ParceriasPage.tsx`)

- Full list of active partners. Search input filters by name, client-side.
- Empty state message differentiates "not found" from "none registered".

### `AdminPage` (`src/pages/AdminPage.tsx`)

Full CRUD for associates and partners in a single component.

**Associate management state:**
`users`, `userForm { complete_name, rgm, role }`, `editingUserId`, `savingUser`, `deletingUserId`, `resettingUserId`, `reactivatingUserId`, `createdPassword { name, password }`, `userSearch`, `showInactive`.

**Partner management state:**
`partners`, `partnerForm { name, description, benefit_description }`, `editingPartnerId`, `savingPartner`, `deletingPartnerId`, `reactivatingPartnerId`, `showInactivePartners`, `partnerSearch`, `partnerImageFile`, `partnerImagePreview`.

**Associate behaviors:**
- Fetches all associates including inactive (`fetchAssociated(true)`) on mount.
- `visibleUsers`: filtered by `showInactive` toggle + `userSearch` (name or RGM, case-insensitive).
- Soft delete updates `deleted_at` in local state (user stays in list).
- Reactivate sets `deleted_at = null` in local state.
- Inactive row: `opacity-60`, strikethrough name, "Inativo" badge, `RotateCcw` reactivate button only.
- Password reset: generates 6-char temp password, shows copy-to-clipboard dismissible card.

**Partner behaviors:**
- Fetches all partners including inactive (`fetchPartners(true)`) on mount.
- `visiblePartnerList`: filtered by `showInactivePartners` toggle + `partnerSearch` (name, case-insensitive).
- Soft delete / reactivate mirrors associate pattern.
- Inactive row: `opacity-60`, strikethrough name, "Inativo" badge, `RotateCcw` reactivate button only.
- Active row: edit + soft-delete buttons.
- **Image upload**: optional file input (JPG, PNG, SVG) in the form. On save, uploads to `partner_images` bucket via `uploadPartnerImage`. On edit, loads existing image as preview if `has_image_stored`. "Remover seleção" reverts to existing image preview.
- List shows 32×32 thumbnail for partners with `has_image_stored: true`; placeholder icon otherwise.

---

## Design System

Custom Tailwind config (`tailwind.config.cjs`) extends the default palette:

| Token         | Value     | Usage                      |
|---------------|-----------|----------------------------|
| `primary-900` | `#022b23` | Darkest green              |
| `primary-700` | `#065f46` | Mid-dark green             |
| `primary-500` | `#10b981` | Emerald base               |
| `primary-400` | `#34d399` | Emerald highlight          |
| `surface`     | `#020617` | Page background            |
| `card`        | `#020817` | Card background            |
| `muted`       | `#1e293b` | Subtle surfaces / dividers |

**Utility component classes** (defined in `index.css`):
- `.glass-panel` — frosted glass card effect
- `.page-padding` — consistent horizontal padding
- `.page-grid` — standard page grid layout

**Assets:**
- Brasão: `public/imagens/pato-biomed.png` → referenced as `/imagens/pato-biomed.png`
- Favicon: `index.html` points to `/imagens/logo-biomed.jpeg`
- Mobile-first design with `sm:` / `md:` breakpoints.

---

## Known Gaps / TODOs

- Password minimum is 4 characters (weak).
- No data caching — every page load triggers a fresh fetch.
- `CarteirinhaPage` always shows status "ativo" (hardcoded) — no real status field on `Associated`.
