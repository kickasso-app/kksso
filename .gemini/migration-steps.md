# App Router Migration Steps

This document tracks the progress of migrating **Arti** from the Next.js Pages Router to the App Router. It combines detailed explanations with a checklist of actionable tasks.

**Overall Progress: 0%**

---

## 1. Setup & Infrastructure (0% Complete)

**Explanation:**
The `app` directory allows for incremental adoption, meaning it can coexist with the `pages` directory. The first step is to establish the directory structure and ensure the environment is configured correctly. Since the project uses `styled-components`, specific configuration is required to ensure it works with Server Components.

**Tasks:**
- [ ] Create the `app/` directory in the root.
- [ ] Ensure `next.config.js` is compatible with App Router (standard in Next.js v13+).
- [ ] Verify `styled-components` registry setup for Server Components (Next.js documentation requirement).

---

## 2. Root Layout & Global Context (0% Complete)

**Explanation:**
In the App Router, `app/layout.js` replaces both `pages/_app.js` and `pages/_document.js`.
- **Global Logic:** `_app.js` usually contains global styles and context providers.
- **HTML Structure:** `_document.js` controls the `<html>` and `<body>` tags.

**Handling Providers (Client Components):**
Context providers (`CityProvider`, `AuthProvider`, etc.) rely on React state and effects, so they must be Client Components. They cannot be directly imported into a Server Component layout. The solution is to create a "Providers" client component wrapper.

**Tasks:**
- [ ] **Create `components/Providers.js` (Client Component):**
    - [ ] Add `'use client'` directive.
    - [ ] Import and wrap children with `Grommet` (theme).
    - [ ] Import and wrap children with all context providers: `CityProvider`, `AuthProvider`, `AccountProvider`, `RequestsProvider`, `EventsProvider`, `StudiosProvider`.
- [ ] **Create `app/layout.js` (Server Component):**
    - [ ] Import `Providers` from `components/Providers`.
    - [ ] Import global styles (`styles/base.scss`, `styles/colors.scss`, etc.).
    - [ ] Define and export `metadata` object (Title, Description, OpenGraph, Favicons) replacing `pages/_document.js` and `next/head` content.
    - [ ] Implement `RootLayout` function with `<html>`, `<body>`, and `<Providers>{children}</Providers>`.

---

## 3. Page Migration (0% Complete)

**Explanation:**
Pages should be migrated incrementally. The new router uses Server Components by default, which simplifies data fetching but requires identifying interactive parts (Client Components).
- **Structure:** `pages/about/index.js` -> `app/about/page.js`.
- **Data Fetching:** Replace `getStaticProps` and `getServerSideProps` with direct `async/await` calls in the page component.
- **Client Logic:** Interactive elements (buttons, hooks like `useState`, `useEffect`) must be moved to Client Components marked with `'use client'`.

**Tasks:**

### Simple / Static Pages
- [ ] **About Page:** Move `pages/about/index.js` to `app/about/page.js`.
- [ ] **Privacy Page:** Move `pages/privacy/index.js` to `app/privacy/page.js`.
- [ ] **How It Works:** Move `pages/how-it-works/index.js` to `app/how-it-works/page.js` and `artists.js` to `app/how-it-works/artists/page.js`.
- [ ] **Update Metadata:** Remove `next/head` from these pages and export `metadata` object.

### Landing Page
- [ ] **Landing:** Move `pages/index.js` (and `pages/landing/index.js`) to `app/page.js`.
    - [ ] Strategy: Refactor into Server Component (static parts) + Client Components (interactive parts).

### Complex / Dynamic Pages
- [ ] **Studios:** Move `pages/studios/index.js` & `[city].js`.
    - [ ] Replace `getStaticProps`/`getServerSideProps` with async component data fetching.
    - [ ] Update `useRouter` usage to `next/navigation`.
- [ ] **Events:** Move `pages/events/index.js` & `[city].js`.
- [ ] **Editorial:** Move `pages/editorial` routes.
- [ ] **Profile & Auth:** Move `pages/profile`, `pages/signin`, `pages/join`.
    - [ ] Ensure `useSearchParams` and `useRouter` hooks are updated from `next/router` to `next/navigation`.

---

## 4. API Routes to Route Handlers (0% Complete)

**Explanation:**
API routes in `pages/api/*` are replaced by Route Handlers in `app/api/*/route.js`.
- **Syntax:** Handlers export named functions like `GET`, `POST`, etc.
- **Response:** Use `NextResponse` for standard web API responses.

**Tasks:**
- [ ] **Send Email:** Convert `pages/api/send.js` to `app/api/send/route.js`.
- [ ] **Magic Link:** Convert `pages/api/send-magic-link.js` to `app/api/send-magic-link/route.js`.
- [ ] **Create Contact:** Convert `pages/api/create-contact.js` to `app/api/create-contact/route.js`.
- [ ] **Create Event:** Convert `pages/api/create-event.js` to `app/api/create-event/route.js`.
- [ ] **Create Request:** Convert `pages/api/create-request.js` to `app/api/create-request/route.js`.
- [ ] **Create Studio:** Convert `pages/api/create-studio.js` to `app/api/create-studio/route.js`.

---

## 5. Verification & Cleanup (0% Complete)

**Explanation:**
After moving routes, thorough verification is needed to ensure no functionality is lost. Once the `pages` directory is empty, it can be safely removed.

**Tasks:**
- [ ] Verify all routes load correctly.
- [ ] Verify SEO tags (metadata) appear in source.
- [ ] Verify Global Styles and Fonts load correctly.
- [ ] Verify Auth state persists across navigation.
- [ ] Remove `pages/` directory once empty.
- [ ] Remove `pages/_app.js` and `pages/_document.js`.
