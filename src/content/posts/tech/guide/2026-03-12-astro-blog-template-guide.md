---
title: "Astro 部落格換模板前要知道的事"
date: 2026-03-12
category: tech
tags: [astro, blog, template]
lang: zh-TW
tldr: "換模板 = 換整個專案底層；先搞清楚自己要什麼，再選 AstroPaper / Cactus / AstroWind"
description: "Astro 沒有安裝主題的機制，換模板比你想的複雜。整理三個主流選項的取捨，以及什麼情況下根本不用換"
draft: false
type: guide
---

## TL;DR

換模板 = 換整個專案底層；先搞清楚自己要什麼，再選 AstroPaper / Cactus / AstroWind。

## Astro 換模板為什麼比你想的麻煩

大多數靜態網站框架都有「安裝主題」的機制——Hugo 有 `theme/`，WordPress 更不用說。
Astro 沒有。每個模板就是一份完整的專案原始碼，換模板等於換整個底層。

這代表：
- 文章的 frontmatter schema 各家定義不同（`date` vs `pubDate`，`cover` vs `heroImage`）
- Components、layouts 結構不同，舊的客製化得重寫
- 換完之後不能「退回舊版本」

所以換模板前要先問一件事：**我到底想解決什麼問題？**

## 三種情境，三個選擇

### 只寫文章，要好維護

選 [AstroPaper](https://github.com/satnaing/astro-paper)（⭐ 4200+）。

這個模板的取捨是：功能精準，但不多。深色模式、模糊搜尋（Fuse.js）、RSS、sitemap，夠用了。
最大優點是**結構清晰**——每個 component 做一件事，沒有奇怪的抽象層，想改什麼直接找到改。
缺點是版面比較固定，想做差異化視覺需要改比較多地方。

### 文章量多，要搜尋快

選 [Cactus](https://astro.build/themes/details/astro-cactus/)。

內建 [Pagefind](https://pagefind.app/) 全文檢索，比 Fuse.js 快得多，適合文章累積到一定量之後。
Astro 5 + Tailwind v4，依賴都是最新的，維護不會有過時包的問題。
風格比 AstroPaper 更低調極簡，喜歡乾淨排版的人會喜歡。

### 網站 + 部落格混合

選 [AstroWind](https://github.com/onwidget/astrowind)（⭐ 5400+）。

有 landing page、feature section、pricing、FAQ、blog 全套，PageSpeed 100 分。
取捨是：這個模板的設計目標是「公司官網 + 部落格」，純部落格用起來有點殺雞用牛刀。
但每個 page 都是獨立 component，拆掉不需要的部分不難，如果以後有產品頁需求可以直接擴充。

## 換模板的正確流程

1. **clone 新模板，先讓它跑起來**

   ```bash
   git clone https://github.com/<template-repo> my-new-blog
   cd my-new-blog
   npm install
   npm run dev
   ```

2. **對齊 frontmatter schema（這步最痛）**

   打開新模板的 `src/content.config.ts`，對照舊的欄位名稱。
   常見差異：`pubDate` vs `date`、`heroImage` vs `cover`、`description` vs `excerpt`。

   欄位名稱不同時，批次取代比手改快：

   ```bash
   # 把所有文章的 pubDate 改成 date
   sed -i '' 's/^pubDate:/date:/g' src/content/posts/**/*.md
   ```

3. **搬 content，確認文章都能顯示**

   ```bash
   cp -r ../old-blog/src/content/posts ./src/content/
   ```

   先確認每篇文章都能正常渲染，再開始改 UI。不然 UI 和 schema 問題混在一起很難 debug。

4. **移植舊的客製化**

   Header、footer、自己加的功能，這時候才開始搬。

## 先確認你是不是真的需要換模板

如果問題只是「顏色不好看」或「字型不對」，根本不用換模板。

大多數 Astro 模板用 CSS custom properties 管主題，找到 `src/styles/global.css`：

```css
:root {
  --color-accent: #dc2626;
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}
[data-theme="dark"] {
  --color-bg: #0f0f0f;
  --color-text: #e5e5e5;
}
```

改這裡就能全站換色。換字型也是一樣，在 layout 的 `<head>` 加 Google Fonts，然後改 `font-family` 就好。

如果用 Tailwind，連 CSS 都不用另外寫，直接改 component 的 class。

**換模板要解決的是 layout 或功能問題，不是外觀問題。**
