---
title: "TanStack Query：Server State 的標準解法"
date: 2026-03-27
category: tech
tags: [tanstack-query, react-query, data-fetching, caching]
lang: zh-TW
tldr: "自己用 useState + useEffect 管 API 資料，等於重造輪子還造得比較差。TanStack Query 處理快取、背景更新、loading/error 狀態，讓你專注在 UI 邏輯。"
description: "TanStack Query（前身 React Query）是 React 生態最成熟的 server state 管理方案。本文介紹它的核心概念、快取機制、與 Zustand 的分工，以及 NobodyClimb 如何運用它。"
draft: false
---

很多 React 開發者習慣用 `useState` + `useEffect` 管 API 資料：fetch 資料、處理 loading 狀態、catch error、存到 state。這樣寫沒有問題，但你很快就會發現需要：重複 fetch 的去重、資料快取、背景更新、分頁……每個需求都要自己實作。

TanStack Query 解決的就是這些問題。

## 什麼是 TanStack Query

TanStack Query（前身是 React Query，v5 改名）是 React 的 server state 管理函式庫。它管的不是 UI 狀態，而是「從 server 來的資料」：什麼時候 fetch、快取多久、什麼時候重新驗證、怎麼處理錯誤。

核心概念只有兩個：`useQuery`（讀資料）和 `useMutation`（寫資料）。

## 為什麼用它

自己管 server state 的問題：

1. **沒有快取**：每次 component mount 都重新 fetch，或者你寫了快取邏輯但邏輯散在各處
2. **loading/error 狀態冗余**：每個 fetch 都要重複寫 `isLoading`、`error`、`data` 的 useState
3. **背景更新**：使用者切回 tab 時資料可能已經過期，你需要手動處理
4. **請求去重**：同一個 query 在多個 component 裡同時發出，應該合併成一個請求

TanStack Query 把這些都內建處理好了。

## 核心功能

**基本查詢**

```typescript
import { useQuery } from '@tanstack/react-query'

function ClimbRoutes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['routes', { area: 'Yangmingshan' }],
    queryFn: () => fetchRoutes({ area: 'Yangmingshan' }),
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新 fetch
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <RouteList routes={data} />
}
```

**Mutation（寫操作）**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function LogClimb() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (record: ClimbRecord) => postClimbRecord(record),
    onSuccess: () => {
      // 讓相關 query 重新 fetch
      queryClient.invalidateQueries({ queryKey: ['my-climbs'] })
    },
  })

  return (
    <button onClick={() => mutate(record)} disabled={isPending}>
      {isPending ? '記錄中...' : '記錄攀登'}
    </button>
  )
}
```

**分頁查詢**

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['routes'],
  queryFn: ({ pageParam = 0 }) => fetchRoutes({ offset: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

**Prefetch**

```typescript
// 在 hover 時預載資料，讓點擊時感覺即時
await queryClient.prefetchQuery({
  queryKey: ['route', routeId],
  queryFn: () => fetchRoute(routeId),
})
```

## 快取機制

TanStack Query 的快取行為：

- `staleTime`：資料多久後變「過期」（過期才會在下次 mount 時重新 fetch）
- `gcTime`（前稱 `cacheTime`）：資料在快取裡保留多久（沒有訂閱者後）
- 視窗重新獲得焦點時自動重新驗證
- 網路重新連線時自動 refetch

預設 `staleTime` 是 0（每次 mount 都重新 fetch），通常需要根據資料特性調整。靜態資料可以設高，頻繁更新的資料保持低。

## 與 Zustand 的分工

NobodyClimb 的狀態分層：

| 狀態類型 | 工具 | 範例 |
|---------|------|------|
| Client state | Zustand | auth、UI 狀態、使用者偏好 |
| Server state | TanStack Query | 攀登紀錄、路線資料、使用者資料 |

這個分法的原則：**如果資料來自 server，就交給 TanStack Query；如果是純 client 的狀態，放 Zustand**。不要把 API 資料塞進 Zustand store——那只是重造了一個沒有快取、沒有失效策略的 store。

## 取捨

**好的地方**
- 快取、去重、背景更新都是開箱即用
- DevTools 完整，可以看每個 query 的狀態和快取內容
- TypeScript 型別推斷完整
- v5 API 更一致，不再有 `isLoading` vs `isFetching` 的混淆

**需要注意的地方**
- `queryKey` 設計需要思考，key 不對會導致快取失效策略失效
- bundle size 比自己用 fetch 大，但換來的功能值得
- SSR 需要額外設定（`HydrationBoundary`），但 Next.js 有完整的整合文件

## 參考資料

- [TanStack Query 官方文件](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — TanStack Query 與 Zustand 搭配使用的實際案例
- [Zustand：React 最輕量的全域狀態管理](/posts/tech/2026-03-27-zustand-state-management) — Client state 的另一半
