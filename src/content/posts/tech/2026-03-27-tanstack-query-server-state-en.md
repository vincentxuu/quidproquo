---
title: "TanStack Query: The Standard Solution for Server State"
date: 2026-03-27
type: guide
category: tech
tags: [tanstack-query, react-query, data-fetching, caching]
lang: en
tldr: "Managing API data with useState + useEffect means reinventing the wheel — and doing it worse. TanStack Query handles caching, background updates, and loading/error states so you can focus on UI logic."
description: "TanStack Query (formerly React Query) is the most mature server state management solution in the React ecosystem. This post covers its core concepts, caching mechanics, how it divides responsibilities with Zustand, and how NobodyClimb uses it in practice."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-tanstack-query-server-state)

Many React developers default to `useState` + `useEffect` for managing API data: fetch the data, handle loading state, catch errors, store in state. There's nothing inherently wrong with this approach — but you'll quickly find yourself needing deduplication of repeated fetches, data caching, background refresh, pagination, and more. Each of these becomes something you have to build yourself.

TanStack Query exists to solve exactly these problems.

## What Is TanStack Query

TanStack Query (formerly React Query, renamed in v5) is a server state management library for React. It doesn't manage UI state — it manages data that comes from a server: when to fetch, how long to cache, when to revalidate, and how to handle errors.

The core API comes down to two hooks: `useQuery` (for reading data) and `useMutation` (for writing data).

## Why Use It

The problems with managing server state yourself:

1. **No caching**: Every component mount triggers a new fetch, or you write caching logic that ends up scattered across the codebase
2. **Redundant loading/error state**: Every fetch requires the same boilerplate — `isLoading`, `error`, and `data` useState declarations
3. **Background updates**: Data may be stale when the user returns to the tab, and you need to handle that manually
4. **Request deduplication**: The same query fired from multiple components simultaneously should be merged into a single request

TanStack Query handles all of this out of the box.

## Core Features

**Basic Query**

```typescript
import { useQuery } from '@tanstack/react-query'

function ClimbRoutes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['routes', { area: 'Yangmingshan' }],
    queryFn: () => fetchRoutes({ area: 'Yangmingshan' }),
    staleTime: 5 * 60 * 1000, // don't refetch within 5 minutes
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <RouteList routes={data} />
}
```

**Mutation (Write Operations)**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function LogClimb() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (record: ClimbRecord) => postClimbRecord(record),
    onSuccess: () => {
      // invalidate related queries to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['my-climbs'] })
    },
  })

  return (
    <button onClick={() => mutate(record)} disabled={isPending}>
      {isPending ? 'Saving...' : 'Log Climb'}
    </button>
  )
}
```

**Paginated / Infinite Query**

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['routes'],
  queryFn: ({ pageParam = 0 }) => fetchRoutes({ offset: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

**Prefetch**

```typescript
// preload data on hover so clicks feel instant
await queryClient.prefetchQuery({
  queryKey: ['route', routeId],
  queryFn: () => fetchRoute(routeId),
})
```

## Caching Mechanics

TanStack Query's caching behavior is controlled by a few key settings:

- `staleTime`: How long data is considered fresh (stale data will be refetched on the next mount)
- `gcTime` (formerly `cacheTime`): How long data stays in the cache after all subscribers are gone
- Automatic revalidation when the window regains focus
- Automatic refetch on network reconnect

The default `staleTime` is 0, meaning every mount triggers a refetch. You'll generally want to tune this based on your data's nature — set it high for static data, keep it low for frequently changing data.

## Division of Responsibilities with Zustand

NobodyClimb's state is layered like this:

| State Type    | Tool           | Examples                                      |
|---------------|----------------|-----------------------------------------------|
| Client state  | Zustand        | auth, UI state, user preferences              |
| Server state  | TanStack Query | climb records, route data, user profile       |

The guiding principle: **if data comes from the server, let TanStack Query own it; if it's purely client-side state, put it in Zustand**. Don't push API data into a Zustand store — that just recreates a store without caching or invalidation strategy.

## Trade-offs

**What's great**
- Caching, deduplication, and background updates work out of the box
- Full DevTools support — inspect every query's state and cached data
- Complete TypeScript type inference
- v5 API is more consistent, eliminating the `isLoading` vs `isFetching` confusion

**What to watch out for**
- `queryKey` design requires thought — a poorly designed key breaks your cache invalidation strategy
- Larger bundle size than rolling your own fetch logic, but the functionality justifies it
- SSR requires additional setup (`HydrationBoundary`), though Next.js has thorough integration docs

## References

- [TanStack Query Official Docs](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — a real-world example of TanStack Query and Zustand working together
- [Zustand: The Lightest Global State Manager for React](/posts/tech/2026-03-27-zustand-state-management) — the other half of the client state story
