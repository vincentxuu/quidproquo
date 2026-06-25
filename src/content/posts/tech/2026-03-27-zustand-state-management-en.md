---
title: "Zustand: The Lightest Global State Management for React"
date: 2026-03-27
type: guide
category: tech
tags: [zustand, state-management, react]
lang: en
tldr: "No Provider, no reducer — global state in just a few lines. NobodyClimb uses it for auth and UI state, paired with TanStack Query for server state."
description: "Zustand is a minimalist React state management library with no boilerplate, no Provider wrapping, and an intuitive API. This post covers its core concepts, how it compares to Redux and Jotai, and why NobodyClimb chose it for client state."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-zustand-state-management)

React has no shortage of state management options: Redux, MobX, Recoil, Jotai, Zustand… they all work, but picking one is an opinionated decision. This post makes the case for Zustand and why it's the best choice for client state management in most projects.

## What is Zustand

Zustand is a minimalist global state management library for React, built by Poimandres — the same team behind react-three-fiber. Its entire core API is a single function: `create`.

The design philosophy is simple: **state is a JavaScript object, and actions are functions that modify it**. No reducers, no dispatch, no Provider.

## Why Zustand

The problem with Redux isn't that it's bad — it's that it's heavy. A simple piece of global state requires action types, action creators, a reducer, store setup, and a Provider wrapper before you can even start using it. For most small-to-medium projects, that overhead isn't worth it.

Context + useReducer is another common alternative, but Context updates trigger re-renders for all subscribers. You need extra memoization and context-splitting strategies to keep performance under control.

Jotai takes an atomic approach where each piece of state is an independent atom, which works well for fine-grained state splitting. But if your state has interdependencies — like an auth state that combines user, token, and permissions — Jotai requires extra selectors or derived atoms, which actually adds complexity.

Zustand sits in a sweet spot: **more efficient than Context, lighter than Redux, and better suited for structured state than Jotai**.

## Core Features

**Basic store**

```typescript
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}))
```

**Using it in a component**

```typescript
// Subscribe only to what you need, avoiding unnecessary re-renders
const user = useAuthStore((state) => state.user)
const logout = useAuthStore((state) => state.logout)
```

**DevTools integration**

```typescript
import { devtools } from 'zustand/middleware'

const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      // ...
    }),
    { name: 'auth-store' }
  )
)
```

**Persist (localStorage persistence)**

```typescript
import { persist } from 'zustand/middleware'

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ...
    }),
    { name: 'auth-storage' }
  )
)
```

## How NobodyClimb Uses It

NobodyClimb splits state into two layers:

- **Zustand**: auth state (user, token), UI state (modal toggles, sidebar state), user preferences
- **TanStack Query**: all server state (API data, caching, background updates)

This separation matters. Zustand only manages state that doesn't come from the server — server data is entirely delegated to TanStack Query. Each handles its own domain without interfering with the other.

The Zustand stores live in `packages/` and are shared across both web and mobile. Both the Next.js app and the React Native Expo app use the same hooks — one of the key benefits of a monorepo setup.

## Trade-offs

**What's great**
- Zero boilerplate — a store goes from definition to usable in just a few lines
- No Provider — no need to restructure your component tree
- Selector-based subscriptions mean re-renders only happen where state is actually used
- Excellent TypeScript support with complete type inference

**Things to watch out for**
- Global state is inherently harder to test, and Zustand doesn't solve that (you'll need to reset the store in tests)
- Not the best fit for ultra-fine-grained state (that's Jotai's strength)
- When stacking multiple middlewares, type inference occasionally needs manual annotations

For most React applications, the Zustand + TanStack Query combination covers 95% of state management needs — with almost no learning curve.

## References

- [Zustand Official Docs](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Zustand + TanStack Query in a real project
- [TanStack Query: The Standard for Server State](/posts/tech/2026-03-27-tanstack-query-server-state) — server state management used alongside Zustand
