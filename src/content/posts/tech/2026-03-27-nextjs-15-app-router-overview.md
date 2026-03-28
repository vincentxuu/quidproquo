---
title: "Next.js 15 + App Router：Server Components 和 use cache 實際上在做什麼"
date: 2026-03-27
category: tech
tags: [nextjs, react, server-components, app-router]
lang: zh-TW
tldr: "Next.js 15 + React 19 的 App Router 把渲染責任從客戶端移到伺服器，use cache 讓快取邏輯直接跟資料綁在一起而不是散在 fetch 選項裡。島島和 NobodyClimb 都選它，原因很務實。"
description: "介紹 Next.js 15 App Router 的核心概念：Server Components、use cache directive、以及為什麼島島和 NobodyClimb 這兩個真實專案都選擇了這個技術棧。"
draft: false
---

Next.js 15 + App Router 不是 Next.js 的微調版本，它是一次架構方向的轉移：從「客戶端先渲染」到「伺服器先渲染，客戶端只負責互動」。這個轉移帶來的不只是效能差異，而是整個思考資料流的方式。

島島（DaoDAO）和 NobodyClimb 都選了 Next.js 15 App Router，一個跑在傳統 VPS，一個透過 `@opennextjs/cloudflare` 跑在 Cloudflare Workers，兩者的需求差異不小，但前端技術棧的選擇一樣。

## Server Components 在解決什麼問題

Pages Router 的世界裡，資料流長這樣：

```
Server getServerSideProps → 序列化資料 → Client hydrate → Client 呼叫 API → 顯示
```

這帶來兩個問題：一是序列化有成本（大型物件、circular reference 都是坑），二是「需要資料的元件」和「取得資料的邏輯」是分離的——`getServerSideProps` 在頁面層，元件在元件樹裡，兩邊的資料傳遞需要 props drilling 或 context。

App Router 的 Server Components 把取資料的責任下放到元件本身：

```tsx
// app/posts/[slug]/page.tsx
// 這個元件直接在伺服器執行，可以直接 query DB
async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });

  return <PostContent post={post} />;
}
```

`PostContent` 可以是純展示的 Server Component，也可以是 `'use client'` 的互動元件。關鍵是：取資料的邏輯和展示的邏輯在同一個地方，不需要額外的 props 鏈。

## use cache：快取邏輯跟資料綁在一起

Next.js 13/14 的快取靠 `fetch` 的選項控制：

```typescript
// Next.js 13/14 的方式
fetch(url, { next: { revalidate: 3600 } }); // 1 小時快取
fetch(url, { cache: "no-store" }); // 不快取
```

這個方式的問題是快取策略散在各個 `fetch` call 裡，而且只適用於 `fetch`，不適用於直接的 DB 查詢。

Next.js 15 的 `use cache` directive 讓快取邏輯可以直接標注在函式上：

```tsx
async function getPost(slug: string) {
  "use cache";
  // cacheLife, cacheTag 可以細粒度控制
  cacheLife("hours"); // 快取 1 小時
  cacheTag(`post-${slug}`); // 用 tag 做 invalidation

  return await db.post.findUnique({ where: { slug } });
}

// 需要重新驗證時
revalidateTag(`post-${slug}`);
```

好處是快取策略和資料邏輯放在一起——看到函式就知道它的快取行為，不需要去查哪個 `fetch` 上面有 `revalidate` 選項。

## 基本架構

```
app/
├── layout.tsx           # Server Component，所有頁面共用
├── page.tsx             # Server Component，取資料後渲染
└── posts/
    └── [slug]/
        ├── page.tsx     # Server Component
        └── Comments.tsx # 'use client'，需要互動的部分
```

判斷一個元件該是 Server 還是 Client Component 的原則很簡單：

- 需要 `useState`、`useEffect`、事件處理 → `'use client'`
- 只需要取資料和渲染 → Server Component（預設）
- 需要瀏覽器 API（`window`、`localStorage`）→ `'use client'`

Client Component 的 children 仍然可以是 Server Component：

```tsx
// ClientWrapper.tsx
"use client";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}

// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData();
  return (
    <ClientWrapper>
      <ServerOnlyContent data={data} /> {/* 這個仍是 Server Component */}
    </ClientWrapper>
  );
}
```

## 為什麼島島和 NobodyClimb 都選它

**島島的情況**：有 `website`（行銷頁）和 `product`（應用）兩個 Next.js app，SEO 對 `website` 很重要，Server Components 讓內容直接在伺服器渲染成 HTML，不需要等 client-side hydration，首次載入速度和 SEO 都受益。

**NobodyClimb 的情況**：跑在 Cloudflare Workers，透過 `@opennextjs/cloudflare` adapter，Next.js 的動態路由走 Worker，靜態資源走 Cloudflare Assets。Cloudflare 的邊緣節點在全球，SSR 在邊緣完成，台灣用戶的延遲比回源到單一伺服器低。

兩個情境的共同點：兩者都有 SEO 需求（學習平台、攀岩社群），都需要資料在伺服器端完成，App Router 剛好是目前 Next.js 的主推方向，生態和文件都已經穩定。

## 需要注意的地方

**序列化限制**：Server Component 傳給 Client Component 的 props 必須是可序列化的——Date、Map、Set 直接傳會出問題，需要先轉換。

**第三方套件相容性**：部分較舊的 npm 套件預設用了瀏覽器 API，在 Server Component 裡 import 會噴錯。解法是用動態 import 加 `ssr: false`，或在 `'use client'` 的邊界之後才 import。

**快取行為需要顯式理解**：App Router 的快取分成四層（Request Memoization、Data Cache、Full Route Cache、Router Cache），不了解的話很容易遇到「改了資料但頁面沒更新」的問題。`use cache` 讓其中一層變得更直覺，但其他層仍然需要理解。

**開發環境和 production 行為差異**：快取在開發環境預設關閉，production 才會啟動，這讓本地測試快取行為比較麻煩。

## 整體來說

App Router 的核心概念是合理的：讓元件直接取自己需要的資料，讓快取策略跟資料邏輯放在一起。這讓程式碼更內聚，也讓伺服器渲染變成預設而不是選項。

如果你正在開始一個新的 Next.js 專案，App Router 是現在唯一值得認真學的方向——Pages Router 不是「舊但穩定」，而是「舊且不再發展」。

## 參考資料

- [Next.js 15 官方文件](https://nextjs.org/docs)
- [React Server Components 說明](https://react.dev/reference/rsc/server-components)
- [Next.js use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [@opennextjs/cloudflare adapter](https://opennext.js.org/cloudflare)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
