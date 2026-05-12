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
| **Mobile (Expo)**             | `exp://u.expo.dev/56928831-fef8-4274-a8f7-d91d2c1c607a/group/c2c2f053-0836-4923-9c51-8f85184fc0c8`                                                                                          |
| **Mobile QR (Expo hosted)**   | [qr.expo.dev — open in browser / scan](https://qr.expo.dev/eas-update?slug=exp&projectId=56928831-fef8-4274-a8f7-d91d2c1c607a&groupId=c2c2f053-0836-4923-9c51-8f85184fc0c8&host=u.expo.dev) |
| **Demo video (YouTube)**      | [YouTube demo](https://www.youtube.com/watch?v=VIDEO_ID)                                                                                                                                    |

Open the web app in a browser (you may need to sign in depending on how the deployment is
configured). For mobile, use the **Expo hosted QR** link, paste the `exp://` URL into **Expo Go**,
or scan the image below.

### Expo QR (scan in Expo Go)

QR CODE

## What this demonstrates (for recruiters)

- **Next.js (App Router)** — landing, auth flows, protected dashboard, staff tooling (e.g.
  trainings, exercises).
- **Expo + React Native** — customer flows: onboarding, training list, sessions, leaderboard;
  **tRPC + TanStack Query** for data.
- **End-to-end typing** — **tRPC** routers and **Zod** validators shared from packages; less “API
  drift” between clients and server.
- **Monorepo discipline** — **Turborepo** + **pnpm** workspaces: `apps/web`, `apps/mobile`,
  `apps/backend`, shared `packages/`\*.
- **Persistence** — **Prisma** + **PostgreSQL**; migrations and schema live in the repo.
- **Practical polish** — i18n, env validation, CI-oriented workflows (see `.github/workflows`).

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
```

---

## Contact

I am actively looking for **React / Next.js / React Native** opportunities. If this project fits
what your team builds, **I would be glad to hear from you**.

- **LinkedIn:** [linkedin.com/in/david-dot-tsx](https://www.linkedin.com/in/david-dot-tsx)
- **GitHub:** profile links and other channels as listed on this repository’s owner page

---

_FitMaster is a portfolio piece; names and copy are for demonstration._
