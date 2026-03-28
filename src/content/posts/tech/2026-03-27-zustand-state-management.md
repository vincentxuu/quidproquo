---
title: "Zustand：React 最輕量的全域狀態管理"
date: 2026-03-27
category: tech
tags: [zustand, state-management, react]
lang: zh-TW
tldr: "不需要 Provider、不需要 reducer，幾行就能設定好全域狀態。NobodyClimb 用它管 auth 和 UI 狀態，搭配 TanStack Query 處理 server state。"
description: "Zustand 是一個極簡的 React 狀態管理函式庫，沒有 boilerplate、沒有 Provider 包裹、API 直覺。本文介紹它的核心概念、與 Redux/Jotai 的差異，以及為什麼 NobodyClimb 選它管 client state。"
draft: false
---

React 的狀態管理選擇太多了：Redux、MobX、Recoil、Jotai、Zustand……每個都能用，但選哪個是有觀點的。這篇說 Zustand，以及為什麼它是多數專案 client state 管理的最佳選擇。

## 什麼是 Zustand

Zustand 是一個極簡的 React 全域狀態管理函式庫，由 Poimandres（也就是 react-three-fiber 的維護者）開發。核心 API 只有一個：`create`。

它的設計哲學是：**狀態就是一個 JavaScript 物件，action 就是修改它的函式**。沒有 reducer、沒有 dispatch、沒有 Provider。

## 為什麼用 Zustand

Redux 的問題不是它不好，是它太重了。一個簡單的全域狀態需要 action types、action creators、reducer、store setup、Provider 包裹，寫完才能開始用。對多數中小型專案來說，這個 overhead 不值得。

Context + useReducer 是另一個常見選擇，但 Context 的更新會讓所有訂閱者重新 render，需要額外的 memo 和 split context 策略才能控制效能。

Jotai 走 atomic 模式，每個狀態是獨立的 atom，適合細粒度的狀態分割。但如果你的狀態有相互依賴（例如 auth state 包含 user、token、permissions 多個欄位），Jotai 需要額外的 selector 或 derived atom，反而複雜。

Zustand 的定位：**比 Context 更有效率、比 Redux 更輕量、比 Jotai 更適合有結構的狀態**。

## 核心功能

**基本 store**

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

**在 component 裡用**

```typescript
// 只訂閱需要的部分，避免不必要的 re-render
const user = useAuthStore((state) => state.user)
const logout = useAuthStore((state) => state.logout)
```

**devtools 整合**

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

**persist（localStorage 持久化）**

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

## NobodyClimb 怎麼用

NobodyClimb 把狀態分兩層：

- **Zustand**：auth state（user、token）、UI 狀態（modal 開關、sidebar 狀態）、使用者偏好
- **TanStack Query**：所有 server state（API 資料、快取、背景更新）

這個分法很重要。Zustand 只管「不需要從 server 取得的狀態」，server 資料完全交給 TanStack Query。兩者各司其職，不會互相干擾。

Web 和 Mobile 共用同一套 Zustand store（放在 `packages/` 裡），React Native 的 Expo 和 Next.js 都用同一個 hook——這是 monorepo 的好處之一。

## 取捨

**好的地方**
- 沒有 boilerplate，store 定義到可以用只需要幾行
- 沒有 Provider，不需要改 component tree 結構
- Selector 訂閱讓 re-render 只發生在真正用到的地方
- TypeScript 支援好，型別推斷完整

**需要注意的地方**
- 全域狀態本來就難測試，Zustand 沒有特別解決這個問題（需要在測試裡 reset store）
- 不適合超細粒度的狀態（那是 Jotai 的強項）
- middleware 堆疊多的時候型別推斷有時需要手動標注

對多數 React 應用來說，Zustand + TanStack Query 的組合可以處理 95% 的狀態需求，而且幾乎沒有學習成本。

## 參考資料

- [Zustand 官方文件](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Zustand + TanStack Query 實際使用案例
- [TanStack Query：Server State 的標準解法](/posts/tech/2026-03-27-tanstack-query-server-state) — 搭配 Zustand 使用的 server state 管理
