# FitMaster — portfolio monorepo

I built **FitMaster** as a **hands-on portfolio** for roles focused on **React**, **Next.js**, and
**React Native (Expo)**. It is a small but real product slice: a **web console for coaches** plus a
**mobile app for athletes**, backed by a **type-safe API** and **PostgreSQL**. If you are hiring for
that stack, this repo is meant to answer: _Can this person ship coherent UI, share code sensibly,
and own a feature end to end?_ **Yes — and I would like to show you how in a conversation.**

---

## Try it (live)

| Surface                       | Link                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web (staff training area)** | [https://fitmaster-apps-web.vercel.app/](https://fitmaster-apps-web.vercel.app/)                                                                                                            |
| **Mobile (Expo , Android)**   | `exp://u.expo.dev/56928831-fef8-4274-a8f7-d91d2c1c607a/group/c2c2f053-0836-4923-9c51-8f85184fc0c8`                                                                                          |
| **Mobile QR (Expo hosted)**   | [qr.expo.dev — open in browser / scan](https://qr.expo.dev/eas-update?slug=exp&projectId=56928831-fef8-4274-a8f7-d91d2c1c607a&groupId=c2c2f053-0836-4923-9c51-8f85184fc0c8&host=u.expo.dev) |
| **Demo video (YouTube)**      | [YouTube demo](https://www.youtube.com/watch?v=VIDEO_ID)                                                                                                                                    |

Open the web app in a browser (you may need to sign in depending on how the deployment is
configured). For mobile, use the **Expo hosted QR** link, paste the `exp://` URL into **Expo Go**,
or scan the image below.

### Expo QR (scan in Expo Go)
<picture>
  <img alt="Demo app - Expo EAS QR Code" src="https://qr.expo.dev/eas-update?slug=exp&projectId=56928831-fef8-4274-a8f7-d91d2c1c607a&groupId=c2c2f053-0836-4923-9c51-8f85184fc0c8&host=u.expo.dev" height="240">
</picture>

## Tech stack (keywords for recruiters)

| Area                   | Technologies                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo & quality** | Turborepo · pnpm · TypeScript · ESLint · Prettier · Vitest · Husky                                                                                                                    |
| **Web**                | React · Next.js (App Router) · Tailwind CSS · Radix UI · TanStack Query · tRPC · Superjson · Zod · React Hook Form · Zustand · i18next · Framer Motion · Testing Library · Playwright |
| **Mobile**             | React Native · Expo · Expo Router · NativeWind · TanStack Query · tRPC · Zod · React Hook Form · Zustand · i18next · Testing Library · Maestro (flows in `apps/mobile/.maestro/`)     |
| **API & runtime**      | Fastify · tRPC · Zod · JWT · HTTP cookies · Swagger / OpenAPI                                                                                                                         |
| **Data**               | PostgreSQL · Prisma · Argon2 (password hashing in `packages/api`)                                                                                                                     |

## What this demonstrates (for recruiters)

- **Next.js (App Router)** — landing, auth flows, protected dashboard, staff tooling (e.g.
  trainings, exercises).
- **Expo + React Native** — customer flows: onboarding, training list, sessions, leaderboard;
  **tRPC + TanStack Query** for data.
- **End-to-end typing** — **tRPC** routers and **Zod** validators shared from packages; less “API
  drift” between clients and server.
- **Monorepo discipline** — **Turborepo** + **pnpm** workspaces: `apps/web`, `apps/mobile`,
  `apps/backend`, shared `packages/*`.
- **Persistence** — **Prisma** + **PostgreSQL**; migrations and schema live in the repo.
- **Practical polish** — i18n, env validation, **GitHub Actions** for CI, DB deploy, and Expo
  previews (see [CI (GitHub Actions)](#ci-github-actions) below).

If you want a deeper dive in an interview, I can walk through **routing**, **auth/session
handling**, **feature folder layout**, or **how I would scale** this next (tests, observability,
rate limits, etc.).

---

## Repository layout (short)

| Path                  | Role                                        |
| --------------------- | ------------------------------------------- |
| `apps/web`            | Next.js — marketing + dashboard             |
| `apps/mobile`         | Expo — athlete app                          |
| `apps/backend`        | Fastify — HTTP + tRPC entry                 |
| `packages/api`        | tRPC app router, shared server/client types |
| `packages/db`         | Prisma schema & migrations                  |
| `packages/validators` | Zod schemas                                 |
| `packages/i18n`       | Shared translations                         |

---

## CI (GitHub Actions)

Workflows live under [`.github/workflows`](.github/workflows):

| Workflow | What it does |
| -------- | ------------ |
| [**CI**](.github/workflows/ci.yml) | On PRs and pushes to `main` (skips Markdown-only paths on push): **lint**, **TypeScript check**, **Vitest** (`pnpm test` — workspace projects under `apps/*` and `packages/*`), then a **full monorepo build** (build uses repo secrets for `DATABASE_URL`, Next/Expo public API vars, cookies, proxy). |
| [**Database Deploy**](.github/workflows/deploy-db.yml) | On `main` when Prisma **schema or migrations** change (or manual run): **`pnpm turbo run db:deploy`**. |
| [**Mobile Preview (Expo)**](.github/workflows/mobile-preview.yml) | On `main` when **`apps/mobile`** or **`packages/*`** change (or manual run): build shared packages and publish an **EAS Update** to the preview branch. |

---

## Local development

**Requirements:** Node **≥ 22**, **pnpm**, PostgreSQL (see `apps/backend/.env.example` and
`packages/db/.env.example`).

```bash
pnpm install
# Configure env files from the *.env.example files in apps/backend, apps/web, apps/mobile, packages/db

pnpm db:generate   # Prisma client
pnpm dev           # or: pnpm dev:web / pnpm dev:backend / pnpm dev:mobile
```

Quality checks from the root:

```bash
pnpm validate   # lint + typecheck across the monorepo
pnpm test       # Vitest — same as CI quality job
```

---

## Contact

I am actively looking for **React / Next.js / React Native** opportunities. If this project fits
what your team builds, **I would be glad to hear from you**.

- **Email:** [daviddottsx@gmail.com](mailto:daviddottsx@gmail.com)
- **LinkedIn:** [linkedin.com/in/david-dot-tsx](https://www.linkedin.com/in/david-dot-tsx)
- **GitHub:** profile links and other channels as listed on this repository’s owner page

---

_FitMaster is a portfolio piece; names and copy are for demonstration._
