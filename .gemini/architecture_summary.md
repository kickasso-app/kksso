# Application Architecture Summary

## Overview
**Arti** is a web application built using the **Next.js** framework, serving as a platform for artists, studios, and events. It combines a server-side rendered (SSR) and static site generated (SSG) frontend with a backend-as-a-service (BaaS) architecture using **Supabase**.

## Tech Stack

### Frontend
- **Framework:** Next.js (v16.x) with React (v19.x).
- **Styling:**
  - **SCSS Modules:** Used for component-level styling (`.module.scss`).
  - **Styled Components:** integrated via Next.js compiler options.
  - **Grommet:** UI component library (`grommetTheme.js`).
  - **Global Styles:** SCSS variables and base styles defined in `styles/`.
- **State Management:** React Hooks (`hooks/`) and Context (implied by usage patterns).

### Backend & Data
- **Database & Auth:** **Supabase** (PostgreSQL-based) is used for data persistence and user authentication.
- **API:** Next.js API Routes (`pages/api/`) handle server-side logic, including:
  - transactional emails.
  - specialized database operations.
- **Email Service:** **Resend** (via `resend` package) is used for transactional emails (`services/sendEmail.js`).

### Infrastructure
- **Hosting:** Vercel (implied by `.vercel` folder and `next.config.js` structure).
- **PWA:** Progressive Web App support via `@ducanh2912/next-pwa`.

## Project Structure

### Key Directories
- **`pages/`**:
  - **Routing:** Follows Next.js Pages Router conventions.
  - **`api/`**: Backend endpoints (e.g., `create-event`, `send-magic-link`).
  - **Feature Pages:** `editorial`, `events`, `studios`, `profile`, `requests`.
- **`components/`**: Reusable UI components organized by feature (e.g., `Auth`, `EventCard`, `forms`).
- **`services/`**: API abstraction layer. Functions here directly interact with Supabase or external APIs, separating data fetching logic from UI components.
  - Examples: `supabase.js`, `auth.js`, `events.js`, `studios.js`.
- **`styles/`**: Global style definitions, theme configurations (Grommet), and SCSS variables.
- **`hooks/`**: Custom React hooks for shared logic (e.g., `useMediaQuery`, `useEventImage`).
- **`config/`**: Static configuration and constants (e.g., `menuLinks.js`, `feature-flags.js`).

## Key Features
1.  **Authentication:** Custom flows for Sign In/Up, including Magic Links (`pages/join/magiclink.js`).
2.  **Studios & Events:** Directory and listing capabilities with filtering (`StudiosFilter`).
3.  **Editorial:** Content section for articles (`pages/editorial`).
4.  **User Profiles:** Management of user-specific data and settings.
5.  **Notifications:** Notification layer component (`components/NotificationLayer`).

## conventions
- **Styling:** Prefers SCSS modules for local scope, with global variables injected via `next.config.js`.
- **Service Pattern:** Database queries are encapsulated in `services/` rather than written directly inside components or API routes.
