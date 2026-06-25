---
title: "React Hook Form + Zod: The Best Combo for Form Handling"
date: 2026-03-27
type: guide
category: tech
tags: [react-hook-form, zod, validation, forms, typescript]
lang: en
tldr: "React Hook Form handles form performance, Zod defines the validation schema — together they eliminate nearly all form boilerplate. Share a single Zod schema across a monorepo and you get one source of truth for both frontend and backend validation."
description: "React Hook Form paired with Zod is the modern best practice for React form development. This post covers why this combination works, how to integrate them, and the benefits of sharing schemas in a monorepo — a pattern used in both DaoDao and NobodyClimb."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-react-hook-form-zod-validation)

Forms are one of the most common frontend requirements — and one of the easiest parts of a codebase to let get messy. Controlled components, a `useState` call per field, hand-rolled validation logic — it works, but at scale it becomes a maintenance nightmare.

React Hook Form + Zod is the best solution available today.

## Why This Combination

**React Hook Form** solves the performance problem: it uses uncontrolled components with refs, so every keystroke doesn't trigger a re-render of the entire form. With a traditional controlled form, every keystroke re-renders the entire form tree — noticeably slow in complex forms.

**Zod** solves the validation logic problem: in TypeScript you can describe both the type and the validation rules in one place. No duplication — the schema is the type definition, and the type inferred from the schema is exactly the shape of validated data.

The two are integrated via `@hookform/resolvers`, which lets you pass a Zod schema directly as the resolver for React Hook Form, handing off all validation logic to Zod.

## Basic Usage

**Installation**

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

**Define a schema and wire it up**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // data has already passed Zod validation — fully type-safe
    await login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

**Complex validation**

```typescript
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
```

## Sharing Schemas in a Monorepo

Both DaoDao and NobodyClimb use a monorepo architecture, and both keep their Zod schemas in a shared `packages/` directory:

```
packages/
└── schemas/
    ├── auth.ts       # Login and registration schemas
    ├── user.ts       # User profile schemas
    └── climb.ts      # Climbing log schemas (NobodyClimb)
```

The key benefit: **frontend form validation and backend API validation share a single schema**. If the API requires a valid `email` format, both the frontend form and the backend validation middleware derive from the same `emailSchema` — it's structurally impossible for the frontend to accept something the backend will reject.

```typescript
// packages/schemas/src/auth.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>
```

```typescript
// apps/web — frontend form
import { loginSchema, LoginInput } from '@myapp/schemas'
const { register } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

// backend — server-side validation
import { loginSchema } from '@myapp/schemas'
const result = loginSchema.safeParse(req.body)
```

## Trade-offs

**What works well**
- Uncontrolled components give large forms a clear performance edge over the controlled approach
- `useWatch`, `setValue`, and `trigger` provide fine-grained form control when you need it
- With Zod integration, type safety flows end-to-end from schema definition through the submit handler
- DevTools let you inspect form state in real time

**Things to watch out for**
- The uncontrolled component mental model differs from standard React state — takes some adjustment at first
- Dynamic fields (`useFieldArray`) have a non-trivial learning curve
- shadcn/ui's `Form` component wraps React Hook Form for a cleaner API, but adds an extra layer of abstraction to understand

## References

- [React Hook Form docs](https://react-hook-form.com/)
- [Zod docs](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Zod: Runtime Type Validation for TypeScript](/posts/tech/2026-03-27-zod-schema-validation) — full Zod deep-dive
- [DaoDao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — how DaoDao uses Zod
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — shared schema design in NobodyClimb
