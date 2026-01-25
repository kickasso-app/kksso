# App Router Migration Tasks

## 1. Setup & Infrastructure
- [ ] Create the `app/` directory in the root.
- [ ] Ensure `next.config.js` is compatible with App Router (usually default in v13+ but check for `appDir` flags if on older versions, though v16 is used here so it's standard).
- [ ] Verify `styled-components` registry setup for Server Components (Next.js documentation requirement).

## 2. Root Layout & Global Context
- [ ] **Create `components/Providers.js` (Client Component):**
    - [ ] Add `'use client'` directive.
    - [ ] Import and wrap children with `Grommet` (theme).
    - [ ] Import and wrap children with all context providers: `CityProvider`, `AuthProvider`, `AccountProvider`, `RequestsProvider`, `EventsProvider`, `StudiosProvider`.
- [ ] **Create `app/layout.js` (Server Component):**
    - [ ] Import `Providers` from `components/Providers`.
    - [ ] Import global styles (`styles/base.scss`, `styles/colors.scss`, etc.).
    - [ ] Define and export `metadata` object (Title, Description, OpenGraph, Favicons) replacing `pages/_document.js` and `next/head` content.
    - [ ] Implement `RootLayout` function with `<html>`, `<body>`, and `<Providers>{children}</Providers>`.

## 3. Page Migration
*Migrate pages incrementally. Keep `pages/` active while moving routes one by one.*

### Simple / Static Pages
- [ ] **About Page:** Move `pages/about/index.js` to `app/about/page.js`.
- [ ] **Privacy Page:** Move `pages/privacy/index.js` to `app/privacy/page.js`.
- [ ] **How It Works:** Move `pages/how-it-works/index.js` to `app/how-it-works/page.js` and `artists.js` to `app/how-it-works/artists/page.js`.
- [ ] **Update Metadata:** Remove `next/head` from these pages and export `metadata` object if specific SEO is needed.

### Landing Page
- [ ] **Landing:** Move `pages/index.js` (and `pages/landing/index.js`) to `app/page.js`.
    - [ ] Decide on strategy: Mark as `'use client'` initially OR refactor into Server Component (static parts) + Client Components (interactive parts).

### Complex / Dynamic Pages
- [ ] **Studios:** Move `pages/studios/index.js` & `[city].js`.
    - [ ] Replace `getStaticProps`/`getServerSideProps` with async component data fetching.
    - [ ] Update `useRouter` usage to `next/navigation`.
- [ ] **Events:** Move `pages/events/index.js` & `[city].js`.
- [ ] **Editorial:** Move `pages/editorial` routes.
- [ ] **Profile & Auth:** Move `pages/profile`, `pages/signin`, `pages/join`.
    - [ ] Ensure `useSearchParams` and `useRouter` hooks are updated from `next/router` to `next/navigation`.

## 4. API Routes to Route Handlers
- [ ] **Send Email:** Convert `pages/api/send.js` to `app/api/send/route.js` (Use `NextResponse`).
- [ ] **Magic Link:** Convert `pages/api/send-magic-link.js` to `app/api/send-magic-link/route.js`.
- [ ] **Create Contact:** Convert `pages/api/create-contact.js` to `app/api/create-contact/route.js`.
- [ ] **Create Event:** Convert `pages/api/create-event.js` to `app/api/create-event/route.js`.
- [ ] **Create Request:** Convert `pages/api/create-request.js` to `app/api/create-request/route.js`.
- [ ] **Create Studio:** Convert `pages/api/create-studio.js` to `app/api/create-studio/route.js`.

## 5. Verification & Cleanup
- [ ] Verify all routes load correctly.
- [ ] Verify SEO tags (metadata) appear in source.
- [ ] Verify Global Styles and Fonts load correctly.
- [ ] Verify Auth state persists across navigation.
- [ ] Remove `pages/` directory once empty.
- [ ] Remove `pages/_app.js` and `pages/_document.js`.
