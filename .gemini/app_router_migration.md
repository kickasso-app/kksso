# Migration Guide: Pages Router to App Router

This guide outlines the steps to migrate **Arti** from the Pages Router (`pages/`) to the App Router (`app/`), based on official Next.js recommendations.

## 1. Directory Structure Changes

The `app` directory will coexist with `pages` during migration. Start by creating the `app/` directory.

- **Root Layout:** Replace `_app.js` and `_document.js` with `app/layout.js`.
- **Pages:** Replace `pages/xxx.js` with `app/xxx/page.js`.
- **API Routes:** Replace `pages/api/xxx.js` with `app/api/xxx/route.js`.

## 2. Root Layout (`app/layout.js`)

In the App Router, `layout.js` handles what `_app.js` and `_document.js` used to do.

### Handling Providers (Client Components)
Since Arti uses many React Context providers (`CityProvider`, `AuthProvider`, etc.), these must be moved to a Client Component.

1.  **Create a Providers wrapper:** `components/Providers.js`
    ```javascript
    'use client';
    import { CityProvider } from "services/city";
    import { AuthProvider } from "services/auth";
    // ... import other providers
    import { Grommet } from 'grommet';
    import { grommetTheme } from 'styles/grommetTheme';

    export function Providers({ children }) {
      return (
        <Grommet theme={grommetTheme}>
          <CityProvider>
            <AuthProvider>
              {/* ... other providers */}
              {children}
            </AuthProvider>
          </CityProvider>
        </Grommet>
      );
    }
    ```

2.  **Root Layout:** `app/layout.js`
    ```javascript
    import { Providers } from 'components/Providers';
    import "../styles/base.scss";
    import "../styles/colors.scss";
    // ... other global CSS

    export const metadata = {
      title: 'Arti',
      description: 'A platform to connect artists, art lovers, and collectors...',
      openGraph: {
        title: 'Arti',
        url: 'https://arti.my/',
        images: ['/img/opengraph-image.png'],
      },
      // ... translate other meta from _document.js
    };

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```

## 3. Migrating Pages

### Default to Server Components
Pages in `app/` are Server Components by default. 

**Example: `pages/landing/index.js` to `app/page.js`**
The current `Landing` component uses `useCities()` and `useContext(ResponsiveContext)`. It must be marked with `'use client'` OR refactored:

- **Refactored Approach:** Keep the static section (intro text, banners) in a Server Component (`app/page.js`) and move the interactive parts (buttons that use `selectedCity`) into Client Components.

### Data Fetching
Replace `getStaticProps` or `getServerSideProps` with direct `async/await` in Server Components.

**Pages Router:**
```javascript
export async function getServerSideProps() {
  const data = await fetchEvents();
  return { props: { data } };
}
```

**App Router (`app/events/page.js`):**
```javascript
import { fetchEvents } from 'services/events';

export default async function EventsPage() {
  const data = await fetchEvents(); // Direct fetch
  return <EventsList data={data} />;
}
```

## 4. API Routes to Route Handlers

API routes move from `pages/api/send.js` to `app/api/send/route.js`.

**Pages Router (`pages/api/send.js`):**
```javascript
export default async function handler(req, res) {
  // ...
  res.status(200).json({ success: true });
}
```

**App Router (`app/api/send/route.js`):**
```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  // ... logic
  return NextResponse.json({ success: true });
}
```

## 5. Key Migration Tasks for Arti

1.  **Metadata:** Use the `metadata` object in layouts and pages instead of `next/head`.
2.  **Navigation:** Switch from `next/router` (`useRouter`) to `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`). Note: these only work in Client Components.
3.  **Styled Components:** Ensure the registry is set up for Server Components (Next.js provides a guide for this).
4.  **Sass:** `next.config.js` `sassOptions` still apply, but ensure imports in `layout.js` are correct.
5.  **Image Component:** `next/image` is mostly the same, but check for any legacy property changes.

## 6. Incremental Strategy

1.  Create `app/layout.js` and move global providers/styles.
2.  Migrate simple static pages first (e.g., `about`, `privacy`).
3.  Migrate API routes one by one.
4.  Migrate complex pages (`studios`, `events`) last, focusing on Server Components for data fetching.
