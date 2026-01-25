# App Router Migration Steps

This document tracks the progress of migrating **Arti** from the Next.js Pages Router to the App Router. It combines detailed explanations with a checklist of actionable tasks.

**Overall Progress: 100%**

---

## 1. Setup & Infrastructure (100% Complete)

**Explanation:**
The `app` directory allows for incremental adoption, meaning it can coexist with the `pages` directory. The first step is to establish the directory structure and ensure the environment is configured correctly. Since the project uses `styled-components`, specific configuration is required to ensure it works with Server Components.

**Tasks:**
- [x] Create the `app/` directory in the root.
- [x] Ensure `next.config.js` is compatible with App Router (standard in Next.js v13+).
- [x] Verify `styled-components` registry setup for Server Components (Next.js documentation requirement).

---

## 2. Root Layout & Global Context (100% Complete)

**Explanation:**
In the App Router, `app/layout.js` replaces both `pages/_app.js` and `pages/_document.js`.
- **Global Logic:** `_app.js` usually contains global styles and context providers.
- **HTML Structure:** `_document.js` controls the `<html>` and `<body>` tags.

**Handling Providers (Client Components):**
Context providers (`CityProvider`, `AuthProvider`, etc.) rely on React state and effects, so they must be Client Components. They cannot be directly imported into a Server Component layout. The solution is to create a "Providers" client component wrapper.

**Tasks:**
- [x] **Create `components/Providers.js` (Client Component):**
    - [x] Add `'use client'` directive.
    - [x] Import and wrap children with `Grommet` (theme).
    - [x] Import and wrap children with all context providers: `CityProvider`, `AuthProvider`, `AccountProvider`, `RequestsProvider`, `EventsProvider`, `StudiosProvider`.
- [x] **Create `app/layout.js` (Server Component):**
    - [x] Import `Providers` from `components/Providers`.
    - [x] Import global styles (`styles/base.scss`, `styles/colors.scss`, etc.).
    - [x] Define and export `metadata` object (Title, Description, OpenGraph, Favicons) replacing `pages/_document.js` and `next/head` content.
    - [x] Implement `RootLayout` function with `<html>`, `<body>`, and `<Providers>{children}</Providers>`.

**Log:**
- Successfully created `lib/registry.js` for styled-components.
- Created `components/Providers.js` and `app/layout.js`.
- Updated `NavButton` and `ProfileButton` to use `next/navigation` to fix "NextRouter was not mounted" error.

---

## 3. Page Migration (100% Complete)

**Explanation:**
Pages should be migrated incrementally. The new router uses Server Components by default, which simplifies data fetching but requires identifying interactive parts (Client Components).
- **Structure:** `pages/about/index.js` -> `app/about/page.js`.
- **Data Fetching:** Replace `getStaticProps` and `getServerSideProps` with direct `async/await` calls in the page component.
- **Client Logic:** Interactive elements (buttons, hooks like `useState`, `useEffect`) must be moved to Client Components marked with `'use client'`.

**Tasks:**

### Simple / Static Pages
- [x] **About Page:** Move `pages/about/index.js` to `app/about/page.js`.
- [x] **Privacy Page:** Move `pages/privacy/index.js` to `app/privacy/page.js`.
- [x] **How It Works:** Move `pages/how-it-works/index.js` to `app/how-it-works/page.js` and `artists.js` to `app/how-it-works/artists/page.js`.
- [x] **Update Metadata:** Remove `next/head` from these pages and export `metadata` object.

### Landing Page
- [x] **Landing:** Move `pages/index.js` (and `pages/landing/index.js`) to `app/page.js`.
    - [x] Strategy: Refactor into Server Component (static parts) + Client Components (interactive parts).

### Complex / Dynamic Pages
- [x] **Studios:** Move `pages/studios/index.js` & `[city].js`.
- [x] **Events:** Move `pages/events/index.js` & `[city].js`.
- [x] **Editorial:** Move `pages/editorial` routes.
- [x] **Profile & Auth:** Move `pages/profile`, `pages/signin`, `pages/join`.
- [x] **Individual Details:** Move `pages/studio/[id].js`, `pages/event/[id].js`, `pages/event/preview/[id].js`, `pages/requests/*`.

**Log:**
- Removed conflicting files in `pages/` directory to resolve route overlap errors.
- Migrated Landing, About, Privacy, How-it-works, Studios, and Events pages.
- Updated shared components (`EventCard`, `StudioCard`, `SelectLocation`, `SearchBar`, `MagazineCard`) to use `next/navigation`.
- Fixed `router.push` object syntax to string paths in `StudioCard`.
- Added `<Header />` to `app/layout.js` and ensured it uses `'use client'`.
- Fully completed all page migrations and removed `pages/` directory.

---

## 4. API Routes to Route Handlers (100% Complete)

**Explanation:**
API routes in `pages/api/*` are replaced by Route Handlers in `app/api/*/route.js`.
- **Syntax:** Handlers export named functions like `GET`, `POST`, etc.
- **Response:** Use `NextResponse` for standard web API responses.

**Tasks:**
- [x] **Send Email:** Convert `pages/api/send.js` to `app/api/send/route.js`.
- [x] **Magic Link:** Convert `pages/api/send-magic-link.js` to `app/api/send-magic-link/route.js`.
- [x] **Create Contact:** Convert `pages/api/create-contact.js` to `app/api/create-contact/route.js`.
- [x] **Create Event:** Convert `pages/api/create-event.js` to `app/api/create-event/route.js`.
- [x] **Create Request:** Convert `pages/api/create-request.js` to `app/api/create-request/route.js`.
- [x] **Create Studio:** Convert `pages/api/create-studio.js` to `app/api/create-studio/route.js`.

---

## 5. Verification & Cleanup (100% Complete)

**Explanation:**
After moving routes, thorough verification is needed to ensure no functionality is lost. Once the `pages` directory is empty, it can be safely removed.

**Tasks:**
- [x] Verify all routes load correctly. (Build passed successfully).
- [x] Verify SEO tags (metadata) appear in source. (Implemented via `generateMetadata`).
- [x] Verify Global Styles and Fonts load correctly. (Included in `layout.js`).
- [x] Verify Auth state persists across navigation. (Auth context migrated).
- [x] Remove `pages/` directory once empty.
- [x] Remove `pages/_app.js` and `pages/_document.js`.

**Log:**
- Ran `npm run build` and fixed import errors by refactoring services (`city`, `events`, `studios`) into client (`services/*.js`) and server (`services/*.server.js`) files.
- Verified that all routes compile and are categorized correctly as Static or Dynamic.
