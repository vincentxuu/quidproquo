---
title: "部落格 SEO 優化完整指南 — 從 meta tags 到結構化資料"
date: 2026-03-27
category: tech
tags: [seo, astro, structured-data, json-ld, open-graph, blog]
lang: zh-TW
tldr: "SEO 不只是關鍵字，結構化資料（JSON-LD）、Open Graph、hreflang、robots.txt 這些技術面優化才是讓搜尋引擎真正理解你內容的關鍵。本文以 Astro 部落格為例，完整走一遍實作。"
description: "以 Astro 部落格為實例，完整介紹 SEO 技術面優化：JSON-LD 結構化資料、Open Graph meta tags、hreflang 多語系標籤、robots.txt、Sitemap 等，附完整程式碼範例。"
draft: false
type: guide
---

SEO（Search Engine Optimization）的技術面優化，核心目標只有一個：**讓搜尋引擎用最低成本理解你的內容**。這篇以 Astro 靜態部落格為例，走一遍從 meta tags 到結構化資料的完整實作，讀完你會知道每個優化項目「做什麼」和「為什麼做」。

## 搜尋引擎怎麼看你的頁面

搜尋引擎爬蟲（Googlebot、Bingbot 等）看到的不是你精心設計的 UI，而是原始 HTML。它們依賴：

1. **HTML 語意標籤**（`<h1>`、`<article>`、`<nav>`）判斷頁面結構
2. **Meta tags**（`<meta name="description">`）取得頁面摘要
3. **結構化資料**（JSON-LD）精確理解內容類型和屬性
4. **robots.txt / Sitemap** 知道該爬什麼、不該爬什麼

如果你的頁面只有漂亮的 CSS 但 HTML 結構混亂、缺少 meta 資訊，搜尋引擎就只能「猜」你的內容——猜錯的機率不低。

## Meta Tags：最基本但最常被忽略

### Title 和 Description

```html
<title>部落格 SEO 優化完整指南 — quidproquo</title>
<meta name="description" content="以 Astro 部落格為實例，完整介紹 SEO 技術面優化..." />
<link rel="canonical" href="https://quidproquo.cc/posts/tech/2026-03-27-blog-seo-optimization-guide" />
```

- **Title**：Google 搜尋結果的藍色標題，控制在 60 字元以內
- **Description**：搜尋結果的灰色摘要，控制在 155 字元以內
- **Canonical**：告訴搜尋引擎「這是本頁的正式 URL」，避免重複內容問題

在 Astro 中，這些通常在 Layout 元件統一處理：

```astro
---
// src/layouts/PostLayout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<head>
  <title>{title} — quidproquo</title>
  {description && <meta name="description" content={description} />}
  <link rel="canonical" href={canonicalURL} />
</head>
```

### Open Graph（社群分享）

Open Graph 是 Facebook 發明的 meta 標準，現在幾乎所有社群平台（Twitter、LINE、Slack、Discord）都支援：

```html
<meta property="og:title" content="部落格 SEO 優化完整指南" />
<meta property="og:description" content="以 Astro 部落格為實例..." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://quidproquo.cc/posts/..." />
<meta property="og:image" content="https://quidproquo.cc/og/post.png" />
<meta property="og:locale" content="zh_TW" />
```

**重點**：文章頁的 `og:type` 應該是 `article` 而不是 `website`。這不只是語意正確，還能解鎖 article 專屬的 meta tags：

```html
<meta property="article:published_time" content="2026-03-27T00:00:00.000Z" />
<meta property="article:author" content="xiaoxu" />
<meta property="article:tag" content="seo" />
<meta property="article:tag" content="astro" />
```

### OG Image 自動生成

手動為每篇文章做一張 OG 圖不現實。用 [Satori](https://github.com/vercel/satori) + [Resvg](https://github.com/nicolo-ribaudo/resvg-js) 可以在 build 時自動產生：

```javascript
// scripts/generate-og-images.mjs
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const svg = await satori(
  { type: 'div', props: { children: post.title, style: { fontSize: 48 } } },
  { width: 1200, height: 630, fonts: [notoSansTC] }
);

const png = new Resvg(svg).render().asPng();
```

1200x630 是社群平台最佳尺寸。

## JSON-LD 結構化資料

JSON-LD 是 SEO 技術面的最高優先級。它讓搜尋引擎不用「猜」你的內容——你直接告訴它：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "部落格 SEO 優化完整指南",
  "datePublished": "2026-03-27T00:00:00.000Z",
  "author": {
    "@type": "Person",
    "name": "xiaoxu",
    "url": "https://quidproquo.cc"
  },
  "publisher": {
    "@type": "Organization",
    "name": "quidproquo",
    "url": "https://quidproquo.cc"
  },
  "keywords": "seo, astro, structured-data"
}
</script>
```

### 常用 Schema 類型

| Schema | 用在 | 效果 |
|--------|------|------|
| `BlogPosting` | 文章頁 | Google 搜尋可顯示發布日期、作者 |
| `BreadcrumbList` | 麵包屑導航 | 搜尋結果顯示路徑導航 |
| `WebSite` | 首頁 | 啟用 Sitelinks Search Box |
| `FAQPage` | FAQ 頁面 | 搜尋結果直接展開問答 |
| `HowTo` | 教學文 | 搜尋結果顯示步驟列表 |

### BreadcrumbList 範例

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "首頁", "item": "https://quidproquo.cc" },
    { "@type": "ListItem", "position": 2, "name": "tech", "item": "https://quidproquo.cc/categories/tech" },
    { "@type": "ListItem", "position": 3, "name": "部落格 SEO 優化完整指南", "item": "https://quidproquo.cc/posts/..." }
  ]
}
```

### WebSite + SearchAction

在首頁加上 `WebSite` schema，有機會讓 Google 在搜尋結果顯示站內搜尋框：

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "quidproquo",
  "url": "https://quidproquo.cc",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://quidproquo.cc/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 安全注意事項

在 Astro 中用 `set:html` 注入 JSON-LD 時，要防止 XSS：

```astro
<script type="application/ld+json"
  set:html={JSON.stringify(data).replace(/</g, '\\u003c')}
/>
```

`JSON.stringify` 不會轉義 `</script>`，如果標題包含這個字串就會破壞 HTML 結構。`.replace(/</g, '\\u003c')` 是標準防護方式。

## 多語系 SEO：hreflang

如果你的網站有多語系版本，hreflang 是告訴搜尋引擎「這些頁面是同一內容的不同語言版本」的方式：

```html
<link rel="alternate" hreflang="zh-TW" href="https://quidproquo.cc/" />
<link rel="alternate" hreflang="en" href="https://quidproquo.cc/en/" />
<link rel="alternate" hreflang="x-default" href="https://quidproquo.cc/" />
```

- 每個語言版本的頁面都要包含**所有版本**的 hreflang 標籤（包括自己）
- `x-default` 指向預設語言，給搜尋引擎找不到匹配語言時使用
- hreflang 必須是**雙向**的：A 指向 B，B 也要指向 A

### 多語系 RSS Feed

別忘了為每個語言版本建立獨立的 RSS feed：

```typescript
// src/pages/en/rss.xml.ts
export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) =>
    !data.draft && data.lang === 'en'
  );
  return rss({
    title: 'quidproquo',
    description: 'Tech, climbing, surfing, coffee, and everything else.',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({ ... })),
    customData: '<language>en</language>',
  });
}
```

## robots.txt 和 Sitemap

### robots.txt

放在網站根目錄，告訴爬蟲基本規則：

```
User-agent: *
Allow: /

Sitemap: https://quidproquo.cc/sitemap-index.xml
```

簡單就好。如果有不想被索引的頁面（例如後台、API endpoint），用 `Disallow` 排除。

### Sitemap

Astro 的 `@astrojs/sitemap` 整合會自動產生 sitemap。確保在 `astro.config.mjs` 中設定 `site`：

```javascript
export default defineConfig({
  site: 'https://quidproquo.cc',
  integrations: [sitemap()],
});
```

## SEO 檢查清單

每篇文章發布前，確認：

- [ ] 有 `<title>` 且在 60 字元以內
- [ ] 有 `<meta name="description">` 且在 155 字元以內
- [ ] 有 `<link rel="canonical">`
- [ ] `og:type` 是 `article`（文章頁）或 `website`（首頁）
- [ ] 有 OG image（1200x630）
- [ ] 有 JSON-LD `BlogPosting` 結構化資料
- [ ] 有 JSON-LD `BreadcrumbList`
- [ ] 多語系頁面有 hreflang 標籤
- [ ] `robots.txt` 存在且指向 sitemap
- [ ] 用 [Google Rich Results Test](https://search.google.com/test/rich-results) 驗證結構化資料

## 整體來說

SEO 技術面優化是一次性投資：在 Layout 和 build 流程中設定好，之後每篇文章自動受益。優先順序是：**JSON-LD 結構化資料 > Open Graph > hreflang > robots.txt**。結構化資料的影響最大，因為它直接決定搜尋引擎能多精確地理解你的內容。

不需要追求完美——先把最基本的 BlogPosting、BreadcrumbList、WebSite 三個 schema 做好，就已經超過 90% 的個人部落格了。

---

## 參考資料

- [Google Search Central - 結構化資料](https://developers.google.com/search/docs/appearance/structured-data)
- [Schema.org - BlogPosting](https://schema.org/BlogPosting)
- [Open Graph Protocol](https://ogp.me/)
- [Google - hreflang 標籤指南](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [A Developer's Guide to Implementing JSON-LD Structured Data for Better Technical SEO](https://dev.to/dheeraj_jain/a-developers-guide-to-implementing-json-ld-structured-data-for-better-technical-seo-nmg)
- [Satori - OG Image Generator](https://github.com/vercel/satori)
