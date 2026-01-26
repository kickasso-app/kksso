# Application Architecture Summary (Detailed)

## 1. Overview

**Arti** is a modern web application built on **Next.js 16** and **React 19**, leveraging the **App Router** paradigm. It serves as a discovery platform connecting artists, collectors, and enthusiasts by featuring artist studios and art events.

The architecture is server-centric, prioritizing **React Server Components (RSCs)** for rendering and data fetching to optimize performance and reduce client-side load. This is complemented by a Backend-as-a-Service (BaaS) infrastructure using **Supabase**, which handles the database, authentication, and other backend functionalities. The result is a highly-performant, SEO-friendly application with a streamlined developer experience.

## 2. Tech Stack

### Frontend
- **Framework:** Next.js (v16.x) with React (v19.x). The use of the **App Router** is central, moving away from the traditional `pages/` directory structure.
- **Styling:** A hybrid styling strategy is employed:
  - **Global Styles:** Core styles and variables are defined in `styles/base.scss` and `styles/colors.scss`. These are injected into all components and pages via the `additionalData` option in `next.config.js`.
  - **SCSS Modules:** The primary method for component-level styling, ensuring class names are locally scoped to prevent conflicts.
  - **Styled Components:** Used for dynamic or complex component styling. It is correctly configured for Server-Side Rendering (SSR) in the App Router via `lib/registry.js`, which prevents style flashing on initial load.
  - **Grommet:** A UI component library providing a base set of accessible and themeable components. The application's theme is configured in `styles/grommetTheme.js`.
- **State Management:** Primarily relies on React Hooks (`useState`, `useContext`, `useEffect`). Global state and context are managed through `components/Providers.js`, which likely wraps the application in necessary context providers (e.g., for authentication state).

### Backend & Data
- **Database & Authentication:** **Supabase** serves as the all-in-one backend. It provides a PostgreSQL database for data persistence and a complete authentication solution. The Supabase client is initialized in `services/supabase.js`.
- **API Layer:** Server-side logic is handled by **Next.js Route Handlers** within the `app/api/` directory.
  - These endpoints are crucial for secure operations that require server-only secrets, such as creating new database entries (`create-event/route.js`, `create-studio/route.js`).
  - They securely interact with Supabase using the `SUPABASE_SERVICE_ROLE_KEY`, which grants elevated privileges necessary for bypassing Row Level Security (RLS) when appropriate.
- **Email Service:** Transactional emails (e.g., magic link logins, notifications) are sent using the **Resend** API, as indicated by the `resend` package in `package.json`.

### Infrastructure
- **Hosting:** The project is optimized for and likely hosted on **Vercel**, the platform built by the creators of Next.js.
- **PWA (Progressive Web App):** The application includes PWA features, enabled by the `@ducanh2912/next-pwa` package, allowing it to be installed on user devices for an app-like experience.

## 3. Project Structure

### Key Directories
- **`app/`**: The core of the application, following App Router conventions.
  - **`layout.js`:** The root layout that defines the global HTML structure, including the `<Header>` and shared providers (`Providers.js`). It also imports global stylesheets.
  - **`page.js`:** The entry point for the homepage route (`/`).
  - **Feature Routes:** Subdirectories map directly to URL segments. For example, `app/events/[city]/` corresponds to the `/events/:city` URL.
    - **`page.js`** files define the UI for a specific route.
    - **`layout.js`** files define layouts specific to a route segment.
  - **`api/`:** Contains all backend Route Handlers. Each subdirectory (e.g., `send-magic-link/`) has a `route.js` file that exports functions for HTTP methods (`GET`, `POST`, etc.).

- **`components/`**: A library of reusable React components.
  - It is well-organized by feature (`Auth/`, `forms/`, `EventCard/`) or by atomic purpose (`Button/`). This modular structure promotes code reuse and maintainability.

- **`services/`**: The data access layer, responsible for all communication with Supabase and other external APIs.
  - This pattern decouples data-fetching logic from the UI, making components cleaner and logic easier to test and manage.
  - **`*.server.js` Convention:** Files like `events.server.js` likely contain functions intended only for server-side execution (in Server Components or Route Handlers), while files without the `.server` suffix may be used in both client and server environments.

- **`styles/`**: Contains all global styling resources, including Sass partials, variable definitions, and the Grommet theme configuration.

- **`hooks/`**: Home to custom React hooks that encapsulate reusable client-side logic, such as `useMediaQuery` for responsive design.

- **`lib/`**: Contains utility and library-specific configuration files, most notably the `registry.js` for Styled Components SSR.

## 4. Key Features & Implementation

1.  **Authentication:** Implemented using Supabase Auth. The flow includes email/password sign-in (`components/Auth/SignIn`) and a passwordless Magic Link system (`app/api/send-magic-link/route.js`).
2.  **Studios & Events Directory:** A core feature allowing users to browse and filter studios and events.
    - Listings are rendered on pages like `app/studios/[city]/page.js`.
    - Filtering logic is encapsulated in `components/StudiosFilter/filterStudios.js`.
    - Individual items are displayed using reusable components like `StudioCard` and `EventCard`.
3.  **Editorial Content:** A section for articles, likely managed via Supabase and rendered through `app/editorial/`.
4.  **User Profiles:** A dedicated `app/profile/` section where users can manage their information and view their activity (e.g., created events).
5.  **Notifications:** A global notification system provided by `components/NotificationLayer`, likely using a React Context to manage notification state across the app.

## 5. Architectural Conventions

- **App Router Paradigm:** The application fully embraces the App Router's conventions:
  - **Server-First:** Components are React Server Components by default, fetching data asynchronously and rendering on the server.
  - **Client Components:** Interactivity is explicitly opted into by using the `"use client";` directive at the top of a file (e.g., forms, components with `useState` or `useEffect`).
- **Service Pattern:** All database and API interactions are centralized in the `services/` directory. This promotes a clean separation of concerns, making the codebase easier to reason about and maintain.
- **Standardized API Responses:** Route Handlers in `app/api/` use the `NextResponse` object to return standardized, typed JSON responses, which improves API consistency.
- **Hybrid Styling:** The project effectively combines the strengths of different styling methodologies: global SCSS for foundational styles, SCSS Modules for component encapsulation, and Styled Components/Grommet for dynamic UI elements.# Architecture Decision: Suspense Pattern for Data Fetching

## Context
In the refactoring of "fetch-heavy" content routes (Studios, Events, Editorial), we introduced a "Results" component pattern (e.g., `StudiosResults.js`) separating the data fetching from the main `page.js` and the presentation `Client` component.

## Decision: Separate Server Component for Fetching (`*Results.js`)

The separation of the Fetching Logic (`StudiosResults`), the Page Shell (`page.js`), and the Interactive UI (`StudiosClient`) was necessary due to two conflicting constraints in the Next.js App Router model:

### 1. The "Page Blocking" Constraint
*   **Problem:** If the `await getStudios()` call remains inside `page.js`, the **entire page rendering is blocked**. Next.js will not send any HTML to the user's browser until the data fetch is complete, resulting in a blank screen or browser spinner.
*   **Requirement:** To implement Streaming/Suspense, the blocking `await` call must be moved out of the root `page.js` so that the page shell (Navbar, Footer, Layout) can render immediately.

### 2. The "Client Component" Constraint
*   **Problem:** The presentation logic resides in `StudiosClient.js`, which requires `'use client'` for interactivity (hooks, event listeners).
*   **Restriction:** Client Components **cannot** be `async` functions and cannot directly execute server-side database queries (like Supabase calls).

### The Solution: The "Middleman" Pattern
We introduced a specific **Async Server Component** (e.g., `StudiosResults.js`) to act as a bridge:
*   **Role:** It acts as a dedicated fetcher.
*   **Type:** Async Server Component (allows direct DB access).
*   **Placement:** It is rendered as a child of `page.js` and wrapped in a `<Suspense>` boundary.
*   **Output:** It passes the fetched data down to the purely presentational Client Component (`StudiosClient.js`).

This architecture allows the `page.js` to render immediately with a loading state (via `<Suspense fallback={<Loading />}>`), while the `*Results.js` component fetches data in parallel on the server, streaming the result to the client when ready.
