---
title: "Zod: Runtime Type Validation for TypeScript"
date: 2026-03-27
type: guide
category: tech
tags: [zod, typescript, validation, schema]
lang: en
tldr: "TypeScript types only exist at compile time — they vanish at runtime. Zod lets you validate external data at runtime while inferring TypeScript types from the same schema. One definition, two jobs done."
description: "Zod is a TypeScript-first schema validation library that lets you do runtime validation and type inference from a single definition. Both DaoDao and NobodyClimb use it for API validation and share schemas across packages in their monorepos."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-zod-schema-validation)

TypeScript is powerful, but it has one fundamental limitation: **types only exist at compile time and disappear entirely at runtime**. That means when data arrives from your API, a user form, or environment variables, TypeScript has no way to guarantee it actually matches your defined types.

Zod solves exactly that problem.

## What is Zod

Zod is a TypeScript-first schema validation library. You define a schema once, and it handles two things simultaneously:

1. **Runtime validation**: checks that data conforms to your schema while the program is running
2. **Type inference**: derives TypeScript types from the schema, so you don't need to write a separate interface

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.date(),
})

// Infer the type from the schema
type User = z.infer<typeof UserSchema>
// Equivalent to:
// type User = {
//   id: string
//   name: string
//   email: string
//   createdAt: Date
// }
```

## Core Features

**Primitive Types**

```typescript
z.string()
z.number()
z.boolean()
z.date()
z.undefined()
z.null()
z.any()
```

**String Validation**

```typescript
z.string()
  .min(3, 'At least 3 characters')
  .max(100, 'At most 100 characters')
  .email('Invalid email format')
  .url('Invalid URL format')
  .regex(/^[a-z]+$/, 'Lowercase letters only')
  .trim()
  .toLowerCase()
```

**Objects and Arrays**

```typescript
const PostSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).min(1).max(10),
  status: z.enum(['draft', 'published', 'archived']),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
```

**Parsing and Validation**

```typescript
// parse: throws ZodError on validation failure
const user = UserSchema.parse(rawData)

// safeParse: returns { success: false, error } on failure
const result = UserSchema.safeParse(rawData)
if (!result.success) {
  console.error(result.error.flatten())
  return
}
const user = result.data // typed as User
```

**Transforms**

```typescript
const DateStringSchema = z
  .string()
  .datetime()
  .transform((str) => new Date(str))
// Input: string, Output: Date
```

**Union and Discriminated Union**

```typescript
const NotificationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('mention'), mentionedBy: z.string() }),
  z.object({ type: z.literal('follow'), followedBy: z.string() }),
  z.object({ type: z.literal('reaction'), emoji: z.string() }),
])
```

## Sharing Schemas in a Monorepo

Both DaoDao and NobodyClimb use monorepos, and both centralize their Zod schemas in a `packages/schemas` package (or something similar).

**DaoDao** defines its schemas in the backend service layer, using them for API request validation and as the source of truth for TypeScript types. The frontend generates types from an OpenAPI client, keeping both sides in sync.

**NobodyClimb** goes a step further: `packages/schemas` is shared data between the frontend and backend. The Hono backend uses it to validate request bodies, the Next.js frontend uses it with React Hook Form for form validation, and the mobile app (React Native + Expo) uses the same schemas too. Change one schema and all three platforms update at once.

```typescript
// packages/schemas/src/climb.ts
export const CreateClimbRecordSchema = z.object({
  routeId: z.string().uuid(),
  grade: z.string().regex(/^[5-9]\.[0-9]{1,2}[a-d]?$/),
  style: z.enum(['lead', 'toprope', 'boulder']),
  attempts: z.number().int().min(1),
  notes: z.string().max(500).optional(),
})

export type CreateClimbRecord = z.infer<typeof CreateClimbRecordSchema>

// Backend Hono route
app.post('/records', async (c) => {
  const result = CreateClimbRecordSchema.safeParse(await c.req.json())
  if (!result.success) return c.json({ error: result.error.flatten() }, 400)
  // result.data is fully type-safe
})

// Frontend React Hook Form
useForm<CreateClimbRecord>({ resolver: zodResolver(CreateClimbRecordSchema) })
```

## Error Handling

```typescript
const result = UserSchema.safeParse(rawData)
if (!result.success) {
  // flatten() organizes errors into { fieldErrors, formErrors }
  const errors = result.error.flatten()
  // { fieldErrors: { email: ['Invalid email format'] }, formErrors: [] }
}
```

## Comparison with Alternatives

| | Zod | Yup | io-ts | TypeBox |
|---|---|---|---|---|
| TypeScript-first | ✓ | Partial | ✓ | ✓ |
| Bundle size | Medium | Medium | Small | Small |
| API ergonomics | High | High | Low | Medium |
| Transform support | ✓ | Partial | Manual | Partial |
| Ecosystem integration | Widest | Second | Limited | Medium |

Yup is Zod's most common comparison point — similar API, but TypeScript inference is less complete and maintenance activity is lower. Zod is currently the mainstream choice in the TypeScript ecosystem.

## Trade-offs

**What works well**
- One schema, two purposes (types + validation) — no need to maintain two separate definitions
- `safeParse` makes error handling explicit without try/catch
- Transforms let you handle data conversion and validation in a single step
- First-class integrations with React Hook Form, tRPC, Drizzle, and more

**Things to watch out for**
- Bundle size is slightly larger than Yup (acceptable for most applications)
- Complex recursive types require `z.lazy()`, which can be awkward to define
- Default error messages are in English — you'll need to configure custom messages if you need another language

## References

- [Zod Official Docs](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Zod usage in the backend service layer
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — A real-world monorepo shared schema example
- [React Hook Form + Zod: The Best Combo for Form Handling](/posts/tech/2026-03-27-react-hook-form-zod-validation) — Zod applied to frontend forms
