---
title: "Astro + Cloudflare Workers：Native Module 在 Prerender Route 也會讓 Build 炸掉"
date: 2026-03-13
category: tech
tags: [astro, cloudflare, workers]
lang: zh-TW
tldr: "即使 route 有 prerender = true，Cloudflare Workers 的 Rollup 還是會嘗試打包 native module，導致 build 失敗。把需要 native module 的工作移到 postbuild script 才是正解。"
description: "記錄在 Astro + Cloudflare Workers 環境下使用 @resvg/resvg-js 生成 OG image 失敗的過程，以及改用 postbuild script 的解法。"
draft: false
---

## TL;DR

Cloudflare Workers 不支援 native Node.js module（`.node` binary）。即使 route 有 `prerender = true`，只要 import 了 native module，整個 build 就會失敗。解法是把需要 native module 的工作完全移出 Astro，改成 postbuild script。

## 情境

要在部落格加 OG image 功能，計畫用 Satori 生成 SVG、`@resvg/resvg-js` 轉成 PNG，做成 prerender route：

```typescript
// src/pages/og/[slug].png.ts
export const prerender = true;

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function getStaticPaths() { /* ... */ }

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(/* ... */);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
```

## 問題

```
[commonjs--resolver] resvgjs.darwin-arm64.node (1:0):
Unexpected character '■'
Note that you need plugins to import files that are not JavaScript
```

Build 直接失敗，發生在 `[build] Building server entrypoints...` 階段。

## 嘗試過程

試了 `vite.ssr.external: ['@resvg/resvg-js']`，沒用。

試了加 Vite plugin stub 掉 `.node` 檔案：

```js
{
  name: 'handle-native-modules',
  load(id) {
    if (id.endsWith('.node')) return 'module.exports = {};';
  },
}
```

Build 通過了，但接著在 prerender 階段 500 錯誤，因為 Resvg 被 stub 成空物件，`new Resvg()` 直接爆。

## 為什麼會這樣

Astro + Cloudflare adapter 的 build 有兩個階段：

1. **Worker bundle**：Rollup 打包所有 server-side 程式碼，準備部署到 Cloudflare Workers
2. **靜態生成**：prerender route 在 Node.js 環境執行，生成靜態檔案

即使 route 是 `prerender = true`，Rollup 在第一階段還是會把它 import 的所有模組納入模組圖。`@resvg/resvg-js` 用 `require()` 載入 `.node` binary，Rollup 跟著 `require` 嘗試解析 binary 檔案，然後炸掉。

而且 Cloudflare adapter 的 prerender 執行環境也是走 bundled server，所以 stub 掉 native module 後，prerender 階段一樣無法用它。

## 解法

把 OG image 生成完全移出 Astro，改成獨立的 postbuild script：

```js
// scripts/generate-og-images.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// 讀 src/content/posts/**/*.md
// 生成 PNG → dist/client/og/[category]/[slug].png
```

```json
// package.json
"build": "astro build && node scripts/generate-og-images.mjs"
```

`satori` 和 `@resvg/resvg-js` 移到 `devDependencies`，不進 production bundle。

## 學到的事

需要 native module 的工作，就在 build script 裡做，別放進 Astro 的模組圖。只要 import 了 native module，不管 route 是不是 prerender，Cloudflare Workers bundler 都會嘗試打包它，然後失敗。
