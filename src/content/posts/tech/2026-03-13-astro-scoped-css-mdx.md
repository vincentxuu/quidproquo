---
title: "Astro Scoped CSS 不套用到 MDX 渲染的內容"
date: 2026-03-13
category: tech
tags: [astro, css, mdx]
lang: zh-TW
tldr: "Astro scoped CSS 會加 scope hash，但 <Content /> 渲染的 MDX 元素沒有這個 hash，導致所有 prose 樣式失效。"
description: "紀錄 Astro scoped CSS 的 scope hash 機制，以及為什麼 <Content /> 渲染的 MDX 內容不受 scoped 樣式影響。"
draft: false
---

## TL;DR

Astro scoped CSS 對 `<Content />` 渲染的 MDX HTML 沒有作用。解法是把 prose 樣式放進 `<style is:global>`。

## 情境

在部落格文章頁 `[...slug].astro` 寫了一套 prose 樣式，想把 MDX 渲染出來的 `h2`、`pre`、`table`、`blockquote` 統一設計：

```css
.content pre { background: #1e1e1e; padding: 1.5rem; position: relative; }
.content h2 { font-size: 1.3rem; border-bottom: 1px solid var(--border); }
```

同時加了一個 Copy 按鈕，用 JavaScript append 到每個 `pre` 裡，CSS 給它 `position: absolute; top: 0.5rem; right: 0.5rem`。

## 問題

- 程式碼區塊的 padding 改了沒反應
- `h2` 樣式沒生效
- Copy 按鈕跑到頁面右上角，貼在 nav 旁邊

## 為什麼會這樣

Astro 的 `<style>` 是 scoped 的。編譯時，每個 selector 會被加上一個 component-specific 的 scope hash：

```css
/* 你寫的 */
.content pre { position: relative; }

/* Astro 編譯後 */
.content pre[data-astro-cid-abc123] { position: relative; }
```

同時，該 component 直接產生的 HTML 元素會被加上對應的 attribute：

```html
<div class="content" data-astro-cid-abc123>...</div>
```

問題在於 `<Content />` 渲染的 MDX HTML 是動態插入的，Astro **不會**替那些元素加 `data-astro-cid-abc123`，所以 selector 永遠 match 不到。

Copy 按鈕跑到 nav 的原因也是這個：`position: absolute` 的按鈕找不到 `position: relative` 的 `pre`，往上找到了 nav（nav 有 `position: relative`），就定位在那裡了。

## 解法

把所有 `.content` 內部的 prose 樣式移到 `<style is:global>`。我把它放在 layout 裡統一管理：

```astro
<!-- PostLayout.astro -->
<style is:global>
  .content { line-height: 1.8; }
  .content h2 { font-size: 1.3rem; border-bottom: 1px solid var(--border); }
  .content pre { position: relative; background: #1e1e1e; padding: 1.25rem 1.75rem; }
  .content table { width: 100%; border-collapse: collapse; }
  /* ... */
</style>
```

放在 layout 而不是 page，因為 prose 樣式不屬於某一頁，而是整個網站渲染 markdown 的通用樣式。

## 學到的事

只要是動態渲染進來的 HTML（`<Content />`、`set:html`、從外部傳入的 slot 內容），都不會有 scope hash，scoped CSS 對它們沒有作用。
