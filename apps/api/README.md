# API Server

Fastify + tRPC API server for the FitMaster application.

## Tech Stack

- **[Fastify](https://fastify.dev/)** - Fast and low overhead web framework
- **[tRPC](https://trpc.io/)** - End-to-end typesafe APIs
- **[Prisma](https://www.prisma.io/)** - Database ORM (via `@repo/db`)
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **TypeScript** - Type safety

## Features

- ✅ Type-safe API endpoints with tRPC
- ✅ Automatic TypeScript type sharing
- ✅ Database access via Prisma
- ✅ Input validation with Zod
- ✅ CORS support
- ✅ Request logging
- ✅ Hot reload in development

## Getting Started

### Prerequisites

Make sure you have:
- Database running (`docker-compose up -d`)
- Prisma Client generated (`pnpm --filter @repo/db db:generate`)

### Development

```bash
# Start the API server
pnpm --filter api dev

# The server will run on http://localhost:3001
# tRPC endpoint: http://localhost:3001/trpc
# Health check: http://localhost:3001/health
```

### Build

```bash
# Build for production
pnpm --filter api build

# Start production server
pnpm --filter api start
```

## Project Structure

```
apps/api/
├── src/
│   ├── routers/           # tRPC routers
│   │   ├── user.ts        # User endpoints
│   │   └── index.ts       # Main router
│   ├── middleware/        # Custom middleware (future)
│   ├── utils/             # Utility functions (future)
│   ├── trpc.ts            # tRPC configuration
│   └── index.ts           # Server entry point
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Available Endpoints

### Health Check

```bash
GET http://localhost:3001/health

Response:
{
  "status": "ok",
  "timestamp": "2026-01-20T..."
}
```

### tRPC Endpoints

All tRPC endpoints are available at `/trpc` prefix.

#### User Router

**List Users**
```typescript
// Query
trpc.user.list.query()

// Returns: User[]
```

**Get User by ID**
```typescript
// Query
trpc.user.getById.query({ id: 1 })

// Returns: User
```

**Create User**
```typescript
// Mutation
trpc.user.create.mutate({
  email: "user@example.com",
  name: "John Doe"
})

// Returns: User
```

## Environment Variables

Create a `.env` file in the workspace root:

```env
# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# Database (from @repo/db)
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/fitmaster_db?schema=public"
```

## Using with Client

### In Next.js Web App

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'api/src/routers';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});

// Use it
const users = await trpc.user.list.query();
```

### In Mobile App

tRPC works the same way - install `@trpc/client` and create a client pointing to your API server.

## Adding New Endpoints

1. Create a new router in `src/routers/`:

```typescript
// src/routers/post.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";

export const postRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany();
  }),
  
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: input,
      });
    }),
});
```

2. Add it to the main router:

```typescript
// src/routers/index.ts
import { postRouter } from "./post.js";

export const appRouter = router({
  user: userRouter,
  post: postRouter, // Add here
});
```

3. TypeScript types are automatically updated!

## Scripts

```bash
# Development (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm check-types
```

## Production Deployment

1. Build the application:
   ```bash
   pnpm --filter api build
   ```

2. Set environment variables

3. Start the server:
   ```bash
   pnpm --filter api start
   ```

## Notes

- The server uses Fastify's built-in logger
- CORS is enabled (configure via `CORS_ORIGIN` env var)
- Database connection is managed by Prisma
- All tRPC procedures have access to `ctx.prisma` for database queries

## Resources

- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
