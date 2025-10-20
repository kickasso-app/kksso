# Copilot Instructions for a Next.js Project

## 1️⃣ Project Overview
- **Framework**: Next.js (12+), TypeScript  
- **Purpose**: Server‑side rendered web application with API routes, static pages, and client‑side interactivity.  
- **Architecture**: Pages driven by the `pages` directory, reusable UI in `components`, shared logic in `lib``utils`, and global styles in `styles`.  
- **Deployment**: Vercel (standard Next.js build).  

## 2️⃣ Coding Style & Conventions

| Item | Desired Convention | Rationale |
|------|--------------------|-----------|
| **File names** | `kebab-case` for pages, `PascalCase` for components | Aligns with Next.js conventions and file‑length readability |
| **Export style** | Default export for components, named export for hooks | Keeps tree simple, enables `import xxx from '...'` |
| **Imports** | Absolute import `import Component from '@/components/Component'` | Reduces relative paths, enables easy refactor |
| **Renaming** | All imports must match file name exactly (case‑sensitive). | Avoids confusion on case‑insensitive file systems |
| **TS** | `strict` mode enabled, avoid `any` | Ensures safety and predictability |
| **React** | Prefer functional components + hooks. | Modern idiomatic style |
| **ESLint** | Follow `eslint-config-next`. Disallow console.log in production (`no-console: error`). | Keeps prod logs out |
| **Prettier** | `--write` on `git commit`. | Uniform style |
| **Tests** | Jest + React Testing Library. | Opinionated testing stack |

## 3️⃣ Folder Structure
/components – reusable UI pieces
/pages – Next.js pages & API routes
/lib – core logic, data fetching utilities
/utils – helpers, types, constants
/styles – global CSS, Tailwind, or styled-jsx
/hooks – custom hooks
/context – React context
/middleware – next/middleware



## 4️⃣ Suggested Patterns

| Context | What to generate | How to prompt Copilot |
|---------|------------------|-----------------------|
| **API route** | `GET`, `POST`, `DELETE` handlers with type-safe request/response | "Create a Next.js API route for `/api/users` that returns a typed user array." |
| **React component** | Functional component with props, children, default props | "Create a `Card` component in `components/Card.tsx` that accepts `title` and `children`." |
| **Hook** | Custom hook that returns state + actions | "Write a `useToggle` hook that returns a boolean and a toggle function." |
| **Page** | Static generation using `getStaticProps` or `getServerSideProps` | "Create a page `/about` that fetches static data at build time." |
| **Error boundaries** | Error boundary component using `react-error-boundary` | "Generate an error boundary example for Next.js." |

## 5️⃣ Security & Secrets

- Never write actual API keys or secrets in code. Use Vercel environment variables (`process.env.NEXT_PUBLIC_…` for public keys, `process.env.SECRET_…` for private).
- Copilot should avoid generating code that references inline secrets unless a placeholder is used.

## 6️⃣ Documentation & Comments

- Use JSDoc/TS comments for public APIs.  
- Prefer concise inline comments over large block comments; locate logic rather than explain “what the framework does”.

## 7️⃣ Testing

- Copilot should suggest tests that cover typical React component usage and API response handling.  
- Use `@testing-library/react` + Jest. For API routes, use `node-mocks-http` or `supertest`.

## 8️⃣ Common Edge Cases

| Issue | Copilot tip |
|-------|-------------|
| **TypeScript “type” dumping** | Encourage “`as const`” or specific type annotations; avoid generic `any`. |
| **Infinite JSX loops** | When generating loops in JSX, ask for “guard against empty array rendering.” |
| **Large file imports** | Suggest splitting large utilities into smaller modules. |

## 9️⃣ Guiding Questions (to use with Copilot)

- “Show me an example of Next.js API route with error handling.”  
- “Create a `Layout` component that uses Tailwind classes.”  
- “Generate a custom hook that debounces input.”  

## 🔒 Final Remarks

- **Safety first**: If any snippet contains potentially dangerous patterns (e.g. `dangerouslySetInnerHTML`), prompt for an alternative.  
- **Audit the output**: Treat suggestions as *drafts*; always review and test before merging.  
- **Keep the file updated**: Add or delete conventions as the project evolves.

Happy coding with Copilot! 🚀