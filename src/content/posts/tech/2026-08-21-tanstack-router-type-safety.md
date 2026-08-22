---
title: "TanStack Router：把路由變成編譯期可驗證的東西"
date: 2026-08-21
category: tech
type: deep-dive
tags: [tanstack-router, react, typescript, routing, ai-agent]
lang: zh-TW
tldr: "TanStack Router（2023-12 發 1.0，週下載約 20M）把路徑、params、search params 全部做成編譯期推導：導航到不存在的路由是型別錯誤，不是執行期 404。這篇拆解它的三個核心設計——型別安全、search params 一等公民、與 Query 整合的 loader——以及為什麼這在 AI agent 寫碼的時代價值被放大。"
description: "深入介紹 TanStack Router：file-based routing、100% 型別推導、search params validate、route loader 與 TanStack Query 的整合，與 React Router 的取捨比較，以及型別安全作為 AI agent 護欄的意義。"
series:
  name: "AI 時代的技術選擇"
  order: 3
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-tanstack-router-type-safety-en)

[系列第一篇](/posts/tech/2026-08-19-react-stack-ai-era)提出過一個判準：AI 時代選套件，要選「agent 寫錯時機器抓得到」的。TanStack Router 是這個判準最極端的實例——它把傳統上屬於執行期的路由錯誤（404、漏參數、拼錯 query string）整批搬到編譯期。這篇拆解它是怎麼做到的，以及代價是什麼。

## 路由錯誤的傳統宿命

在字串路徑的世界裡（React Router 的傳統用法），`navigate("/usres/123")` 這個拼字錯誤會安靜地通過編譯、通過 lint、通過 code review，直到某個使用者點到那顆按鈕看見 404。`searchParams.get("page")` 回傳 `string | null`，每個取用點都要自己轉型、自己給預設值、自己防 `NaN`。這些不是 React Router 的 bug，是「路由即字串」這個模型的天生限制。

TanStack Router（2023 年 12 月發 1.0，`@tanstack/react-router` 週下載約 20M，2026-08 實查）的出發點就是推翻這個模型：**路由是型別化的資料結構，字串只是它的序列化格式**。

## 三個核心設計

### 一、從路由樹推導出一切

file-based routing 模式下，你在 `src/routes/` 底下建檔案，CLI/Vite plugin 掃描目錄生成 route tree（一個 `routeTree.gen.ts`），此後整個應用的路由圖是一個 TypeScript 可見的具體型別：

```tsx
// src/routes/posts.$postId.tsx → 路徑 /posts/$postId
export const Route = createFileRoute('/posts/$postId')({
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()   // postId: string，不是 any
}

// 別處導航——路徑與 params 都是編譯期檢查
<Link to="/posts/$postId" params={{ postId: '42' }} />
<Link to="/psots/$postId" />   // ❌ 型別錯誤：路徑不存在
```

`to` 不是字串字面量的巧合——它是從 route tree 推導出的 union type。改了路由檔名，所有引用它的 `Link` 立刻全部飄紅。這就是「重構安全」：路由改動的影響面由編譯器窮舉，不靠全域搜尋字串。

### 二、search params 是一等公民

這是 TanStack Router 跟所有前輩差異最大的一塊。它讓每個路由宣告自己的 search params schema（常配 Zod，呼應[系列第五篇](/posts/tech/2026-08-21-zod-universal-contract)的「schema 即合約」）：

```tsx
export const Route = createFileRoute('/products')({
  validateSearch: z.object({
    page: z.number().catch(1),
    sort: z.enum(['price', 'rating']).catch('rating'),
    filters: z.array(z.string()).optional(),
  }),
})

// 元件裡拿到的是驗證過、型別化的物件
const { page, sort, filters } = Route.useSearch()
```

進入路由時 URL 自動 parse + validate，壞值走 `catch` 回退；導航時物件自動序列化回 URL（包括陣列與巢狀物件的 JSON 序列化）。後台應用最常見的「篩選條件 + 分頁 + 排序全部存 URL、重新整理與分享連結都不掉狀態」，在這裡是預設路徑而不是自律成果。

### 三、loader 與 Query 咬合，消掉瀑布

傳統 SPA 的載入瀑布：路由切換 → 元件 mount → `useQuery` 發請求 → 等待。TanStack Router 的 route loader 在**進入路由前**就能觸發 prefetch，官方模式是在 loader 裡呼叫 `queryClient.ensureQueryData`，讓 Router 管「何時載」、Query 管「怎麼快取」：

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(postQueryOptions(params.postId)),
})
```

配上 `Link` 的 hover/viewport preload，使用者點下去時資料多半已經在快取裡。這不是 Router 取代 Query，是兩者按職責分工——也是整個 TanStack 生態「模組化但互相咬合」設計哲學的縮影。

## 代價與適用邊界

**學習曲線在型別，不在概念。** 泛型推導很深，報錯訊息第一眼常常是一整面牆；路由定義的儀式感也比 React Router 重（`createFileRoute` + codegen）。換來的是上面那些保證，值不值取決於專案的 TypeScript 嚴格程度。

**生態仍是弱項。** React Router 週下載約 44M、存量教材海量；TanStack Router 約 20M、年輕得多（1.0 比 React Router 初版晚了近十年、比 v6 晚兩年）。第三方範例少、AI 訓練語料少——agent 徒手寫容易混進 React Router 的慣用法，實務上要靠餵文件補（TanStack 全站有 llms.txt，見[系列第七篇](/posts/tech/2026-08-21-llms-txt)）。

**需要 SSR 不是死巷。** TanStack Start 是官方建在 Router 之上的全端框架（full-document SSR、streaming、server functions），從 SPA 升級有官方路徑。

## 整體來說

TanStack Router 賭的是一件事：**路由錯誤應該跟型別錯誤一樣，在寫下的那一刻被抓到**。對 TypeScript 嚴格、search params 複雜、大量程式碼由 agent 產出的專案，這個賭注的回報最高——agent 的自我修正迴圈吃的就是快速明確的錯誤訊號，`tsc` 一紅它自己就修了。反過來，小專案、型別鬆散的 codebase、或團隊對 React Router 熟到閉眼寫，遷移的收益蓋不過成本。它不是「更好的 React Router」，是一個對「路由是什麼」給出不同答案的東西。

## 參考資料

- [TanStack Router 官方文件](https://tanstack.com/router/latest)
- [File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [npm 下載量 API（數據來源）](https://api.npmjs.org/downloads/point/last-week/@tanstack/react-router)
- 站內相關：[AI 時代的 React 套件選型](/posts/tech/2026-08-19-react-stack-ai-era)、[TanStack Query：Server State 的標準解法](/posts/tech/2026-03-27-tanstack-query-server-state)
