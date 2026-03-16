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
Icons: `lucide-react`.

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
│   └── partnerService.ts    # All DB operations for "partners" table
├── classes/
│   └── Partner.ts           # PartnerType (type export) + Partner class (unused wrapper)
├── layouts/
│   ├── MainLayout.tsx       # User-facing layout: header + bottom nav + logout
│   └── AdminLayout.tsx      # Admin layout: sidebar navigation
├── pages/
│   ├── LoginPage.tsx        # Login form (RGM + senha)
│   ├── ChangePasswordPage.tsx  # Forced first-login password change
│   ├── DashboardPage.tsx    # Home page after login (shows card + featured partners)
│   ├── CarteirinhaPage.tsx  # Full digital membership card view
│   ├── ParceriasPage.tsx    # Full list of all active partnerships
│   └── AdminPage.tsx        # Admin CRUD panel (associates + partners, ~700 lines)
└── components/
    ├── ui/
    │   ├── Button.tsx        # primary / secondary / ghost variants; sm/md/lg sizes
    │   ├── Input.tsx         # label, icon, rightAction, error, description props
    │   └── Badge.tsx         # success / danger / neutral tones
    └── cards/
        ├── MembershipCard.tsx  # Digital ID card with QR placeholder
        └── PartnerCard.tsx     # Partnership/discount card
```

---

## Routing (`src/App.tsx`)

| Route             | Component            | Guard         |
|-------------------|----------------------|---------------|
| `/`               | → `/login` redirect  | —             |
| `/login`          | `LoginPage`          | public        |
| `/dashboard`      | `DashboardPage`      | ProtectedRoute|
| `/carteirinha`    | `CarteirinhaPage`    | ProtectedRoute|
| `/parcerias`      | `ParceriasPage`      | ProtectedRoute|
| `/change-password`| `ChangePasswordPage` | ProtectedRoute|
| `/admin/*`        | `AdminPage`          | AdminRoute    |
| `*`               | → `/login` redirect  | —             |

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
};
```

---

## Supabase

**Client:** `src/lib/supabase.ts` — singleton, env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_API_KEY`.

### Tables

| Table               | Notes                                                  |
|---------------------|--------------------------------------------------------|
| `associated`        | Members. Soft-deleted via `deleted_at`. Password stored as `crypt()` hash. |
| `partners`          | Partnerships/discounts. Hard-deleted.                  |
| `app_configuration` | Key-value config. Keys: `DEFINE_NEW_PASSWORD_NUMBER`, `DEFINE_NEW_PASSWORD_MESSAGE`. |

### RPCs

| RPC                  | Called by              | Description                                     |
|----------------------|------------------------|-------------------------------------------------|
| `login_associated`   | `loginAssociated()`    | Validates RGM + password via `crypt()`, returns associated row. Filters `deleted_at IS NULL`. |

---

## Services

### `userService.ts`

| Function                        | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `generateTempPassword()`        | Returns random 6-char alphanumeric string (excludes confusing chars I, O, l)|
| `loginAssociated(rgm, password)`| Calls RPC `login_associated`, throws if no match                            |
| `fetchAssociated()`             | SELECT all where `deleted_at IS NULL`, ordered by `complete_name`           |
| `createAssociated(fields)`      | INSERT with auto-generated temp password; returns `{ associated, tempPassword }` |
| `updateAssociated(id, fields)`  | UPDATE editable fields (rgm, complete_name, role)                           |
| `updatePassword(id, newPassword)`| UPDATE `password_hash`, set `ask_for_new_password = false`                 |
| `resetAssociatedPassword(id, name)`| Generate new temp password, set `ask_for_new_password = true`; returns `{ name, password }` |
| `softDeleteAssociated(id)`      | SET `deleted_at = now()` (not hard-deleted)                                 |

### `partnerService.ts`

| Function                    | Description                                          |
|-----------------------------|------------------------------------------------------|
| `fetchPartners()`           | SELECT all, ordered by `created_at DESC`             |
| `createPartner(partner)`    | INSERT, returns created record                       |
| `updatePartner({ id, ...})` | UPDATE where id matches, returns updated record      |
| `deletePartner(id)`         | Hard DELETE                                          |

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

**MembershipCard** — props: `name`, `rgm`, `atlheticName`, `status: "ativo" | "inativo"`. Shows organization logo, active/inactive Badge, and a QR code placeholder (icon only — no actual QR generation).

**PartnerCard** — props: `name`, `benefit`, `description`, `category?`. Shows logo placeholder, benefit with icon, description clamped to 3 lines.

---

## Pages

### `AdminPage` (`src/pages/AdminPage.tsx`)

~700 lines. Full CRUD for both associates and partners in a single component.

**Partner management state:** `partners`, `partnerForm { name, description, benefit_description }`, `editingPartnerId`, `savingPartner`, `deletingPartnerId`.

**User management state:** `users`, `userForm { complete_name, rgm, role }`, `editingUserId`, `savingUser`, `deletingUserId`, `resettingUserId`, `createdPassword { name, password }`.

Notable behaviors:
- Inline editing: clicking Edit fills the form and highlights the row in emerald.
- Password reset generates a new 6-char temp password, sets `ask_for_new_password = true`, shows copy-to-clipboard card.
- `createdPassword` card is dismissible and shows the plaintext password once after creation/reset.
- Soft-delete for users; hard-delete for partners.

### `CarteirinhaPage` (`src/pages/CarteirinhaPage.tsx`)

Renders `MembershipCard` with **hardcoded** user data (`{ name: "Usuário teste", rgm: "2026XXXXX", status: "ativo" }`). Download and Share buttons are non-functional placeholders.

### `DashboardPage` (`src/pages/DashboardPage.tsx`)

Shows user profile card, link to `/carteirinha`, benefits list, and the first 3 partners from `fetchPartners()`. User info comes from `AuthContext`.

---

## Design System

Custom Tailwind config (`tailwind.config.cjs`) extends the default palette:

| Token          | Value       | Usage                     |
|----------------|-------------|---------------------------|
| `primary-900`  | `#022b23`   | Darkest green             |
| `primary-700`  | `#065f46`   | Mid-dark green            |
| `primary-500`  | `#10b981`   | Emerald base              |
| `primary-400`  | `#34d399`   | Emerald highlight         |
| `surface`      | `#020617`   | Page background           |
| `card`         | `#020817`   | Card background           |
| `muted`        | `#1e293b`   | Subtle surfaces / dividers|

**Utility component classes** (defined in `index.css`):
- `.glass-panel` — frosted glass card effect
- `.page-padding` — consistent horizontal padding
- `.page-grid` — standard page grid layout

**Assets:**
- Logo: `public/imagens/logo-biomed.jpeg` → referenced as `/imagens/logo-biomed.jpeg`
- Favicon: `index.html` points to `/imagens/logo-biomed.jpeg`
- Mobile-first design with `sm:` / `md:` breakpoints.

---

## Known Gaps / TODOs

- **QR code** in `MembershipCard` is a placeholder icon — no real QR generation implemented.
- **CarteirinhaPage** uses hardcoded user data instead of `AuthContext`.
- **Download / Share** buttons on CarteirinhaPage are non-functional.
- Password minimum is 4 characters (weak).
- No data caching — every page load triggers a fresh fetch.
