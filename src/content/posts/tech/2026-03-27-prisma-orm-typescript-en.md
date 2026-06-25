---
title: "Prisma ORM: Type-Safe Database Access for TypeScript Projects"
date: 2026-03-27
type: guide
category: tech
tags: [prisma, orm, typescript, postgresql, database]
lang: en
tldr: "Prisma's schema-first design gives you versioned migrations, full TypeScript types on every query, and intuitive relation handling. The tradeoff is a learning curve and the inherent limits of any ORM abstraction — but for most TypeScript projects, it's a worthwhile deal."
description: "An introduction to Prisma ORM: schema definitions, the migration workflow, type-safe queries, relation includes, why DaoDao chose it to manage PostgreSQL, and the scenarios where Prisma will genuinely hurt you."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-prisma-orm-typescript)

"Skip the ORM, just write SQL" is a valid argument — but it comes with a caveat: you have to maintain migrations by hand, write types by hand, and handle relation queries by hand. Prisma takes care of all of that, at the cost of buying into its abstraction layer. For a TypeScript project like DaoDao, that's a trade worth making.

## What It Is

Prisma is a TypeScript-first ORM built around three core pieces:

- **Prisma Schema**: declares your data models in `.prisma` format — the single source of truth for the entire system
- **Prisma Migrate**: auto-generates versioned SQL migration files from schema changes
- **Prisma Client**: an auto-generated, type-safe query client whose types are inferred directly from your schema

The key phrase is "auto-generated." You don't write type definitions by hand, and you don't maintain migration SQL by hand — Prisma generates both from your schema.

## Schema Definition

Prisma schemas are declarative and more readable than raw SQL:

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int      @id @default(autoincrement())
  externalId  String   @unique @default(uuid()) @map("external_id")
  email       String   @unique
  name        String
  createdAt   DateTime @default(now()) @map("created_at")

  posts       Post[]
  goals       Goal[]

  @@map("users")
}

model Post {
  id          Int      @id @default(autoincrement())
  externalId  String   @unique @default(uuid()) @map("external_id")
  title       String
  content     String
  authorId    Int      @map("author_id")
  createdAt   DateTime @default(now()) @map("created_at")

  author      User     @relation(fields: [authorId], references: [id])
  reactions   Reaction[]

  @@map("posts")
}

model Reaction {
  userId    Int    @map("user_id")
  postId    Int    @map("post_id")
  emoji     String

  user      User   @relation(fields: [userId], references: [id])
  post      Post   @relation(fields: [postId], references: [id])

  @@unique([userId, postId])  // one reaction per user per post, enforced at the DB level
  @@map("reactions")
}
```

The `@@unique([userId, postId])` constraint maps directly to DaoDao's reaction upsert pattern — duplicate data is impossible by design at the database layer.

## Migration Workflow

After changing the schema:

```bash
# Generate migration SQL and apply it (development)
npx prisma migrate dev --name add-reactions-table

# Apply migrations (production — does not generate new migrations)
npx prisma migrate deploy
```

Generated migration files live in `prisma/migrations/` and get committed to version control. Everyone on the team always knows the exact state of the database — no more "which migration did your local DB run?" confusion.

## Type-Safe Queries

Prisma Client types are inferred automatically from the schema, giving you complete IDE autocomplete:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Query: types fully inferred — posts is Post[]
const user = await prisma.user.findUnique({
  where: { externalId: userId },
  include: {
    posts: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    goals: true,
  }
})

// user.posts is Post[], user.goals is Goal[]
// No manual type annotations needed

// Create: Prisma infers the type of data
const post = await prisma.post.create({
  data: {
    title: 'Learning TypeScript',
    content: '...',
    author: { connect: { id: userId } }  // connect establishes the relation
  }
})
```

## Upsert: The Reaction Pattern

DaoDao reactions use upsert — if the same user reacts to the same post again, it updates the existing reaction rather than creating a duplicate:

```typescript
// services/ReactionService.ts
async upsertReaction(userId: number, postId: number, emoji: string) {
  return prisma.reaction.upsert({
    where: {
      userId_postId: { userId, postId }  // composite unique key
    },
    update: { emoji },                   // exists: update the emoji
    create: { userId, postId, emoji }    // doesn't exist: create it
  })
}
```

`@@unique([userId, postId])` at the schema level guarantees correctness, and Prisma's `upsert` maps to a single atomic SQL operation.

## Usage in an Express Service Layer

DaoDao follows a routes → controllers → services → Prisma architecture, with services calling Prisma Client directly:

```typescript
// services/PostService.ts
import { prisma } from '../lib/prisma'

export class PostService {
  // List posts (with author info and reaction counts)
  async list(page: number, limit: number) {
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { externalId: true, name: true } },
          _count: { select: { reactions: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count()
    ])

    return { posts, total, page, limit }
  }

  // Create a post (only expose externalId externally)
  async create(data: CreatePostInput, authorId: number) {
    const post = await prisma.post.create({
      data: { ...data, authorId }
    })
    return { ...post, id: undefined, externalId: post.externalId }
  }
}
```

`prisma.$transaction([...])` runs multiple queries in a single transaction, ensuring the `count` and `findMany` results are consistent with each other.

## When Prisma Will Hurt You

**Complex SQL queries**: Prisma's query builder gets awkward fast when you need complex JOINs, subqueries, or window functions. The `prisma.$queryRaw` escape hatch becomes essential:

```typescript
const result = await prisma.$queryRaw<RawResult[]>`
  SELECT u.id, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  GROUP BY u.id
  HAVING COUNT(p.id) > 5
`
```

**Performance-sensitive queries**: The SQL Prisma generates isn't always optimal. Deep `include` chains can produce multiple N+1 queries — you'll need to switch to `select` for precise control, or drop down to raw SQL.

**Large-scale data migrations**: When altering tables with large datasets, Prisma's generated migration SQL may need manual adjustments (adding concurrent indexes, batching backfills, etc.). Blindly running it in production is risky.

## Tradeoffs Summary

| Aspect | Prisma | Raw SQL (e.g. pg / kysely) |
|--------|--------|----------------------------|
| TypeScript types | Auto-generated, complete | Must write by hand or use codegen |
| Migration management | Built-in version control | Roll your own or use a migration tool |
| Complex queries | Awkward, needs raw SQL | Full control |
| Performance tuning | Limited | Full control |
| Learning curve | Medium (schema syntax + API) | Low (know SQL, you're done) |

If your project is TypeScript + PostgreSQL + standard CRUD operations, Prisma is the right call. If your business logic demands heavy complex queries or fine-grained performance tuning, consider Drizzle ORM (type-safe and closer to SQL syntax) or going directly with pg and handwritten types.

## References

- [Prisma ORM Official Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Drizzle ORM](https://orm.drizzle.team/) — a type-safe ORM alternative that stays closer to SQL syntax
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — full architectural context for Prisma in a production project
