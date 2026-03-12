# Blog Redesign & Feature Expansion — Design Spec

**Date:** 2026-03-12
**Status:** Approved
**Scope:** Full redesign of quidproquo.cc — visual overhaul + all features in one pass

---

## 1. Design Direction

**Style:** Editorial 雜誌風（升級版）

The current design is functional but visually flat. The new direction adds editorial weight through typographic hierarchy, category color coding, and structured metadata — while keeping the single-column layout that works well for a personal blog with diverse content.

**What stays the same:**
- Single-column layout, max-width 800px
- Astro + Cloudflare stack — no framework changes
- Content structure (category / tags / tldr / description)

**What changes:**
- Nav gets a bold bottom border (2px black), search icon, EN language badge
- Category labels become solid color badges (uppercase, monospaced weight)
- Post titles get heavier font weight (800–900) with tighter letter-spacing
- Post cards lose the border box, replaced by bottom-border separator
- Reading time appears next to date with a clock SVG icon
- Icons throughout: SVG only, no emoji

---

## 2. Brand Color System

**選定方向：Forest — 深森綠**

呼應部落格「技術、攀岩、衝浪、咖啡」的生活主軸，有機感與技術內容形成記憶點對比。

### 2.1 Design Tokens

所有顏色透過 CSS custom properties 定義在 `:root`，深色模式用 `[data-theme="dark"]` 覆蓋。

#### Light Mode

| Token | Value | 用途 |
|-------|-------|------|
| `--brand-900` | `#1a2e1a` | logo、nav border、標題 |
| `--brand-700` | `#2d4a2d` | 次要文字、tag 文字 |
| `--brand-500` | `#4a7c59` | nav 連結、輔色 accent |
| `--brand-300` | `#a7c4a0` | 分隔線、muted 元素 |
| `--brand-100` | `#e8f5e8` | tag 背景 |
| `--brand-50`  | `#f0f7f0` | TOC / TL;DR 區塊背景 |
| `--border`    | `#d1e8d1` | card 分隔線 |
| `--text-primary`   | `#1a1a1a` | 正文 |
| `--text-secondary` | `#4a7c59` | 日期、閱讀時間 |
| `--text-muted`     | `#a7c4a0` | footer、icon |

#### Dark Mode (`[data-theme="dark"]`)

| Token | Value | 用途 |
|-------|-------|------|
| `--bg-page`   | `#141414` | 頁面背景（非純黑） |
| `--bg-card`   | `#1a1a1a` | card / panel |
| `--bg-subtle` | `#1a231a` | TOC / TL;DR 區塊背景 |
| `--brand-900` | `#e8e8e8` | 標題、logo（反轉為淺色） |
| `--brand-500` | `#6aaa7f` | nav 連結、accent（亮調綠） |
| `--brand-300` | `#2d4a2d` | 分隔線、icon stroke |
| `--brand-100` | `#1e2e1e` | tag 背景 |
| `--border`    | `#2d3d2d` | card 分隔線 |
| `--text-primary`   | `#e8e8e8` | 正文 |
| `--text-secondary` | `#6aaa7f` | 日期、閱讀時間 |
| `--text-muted`     | `#555555` | footer |

### 2.2 Dark Mode Implementation

- CSS variables in `PostLayout.astro` global style block
- Toggle button in nav (sun/moon SVG icon, Lucide)
- On click: toggle `data-theme="dark"` on `<html>`, persist to `localStorage`
- On first visit: read `prefers-color-scheme` to set initial theme
- Code blocks already dark (`#0d0d0d` bg) — no change needed between modes

---

## 3. Category Color System

Each category gets a fixed background color for its badge. Colors are set once in a shared token and used consistently across homepage, article page, and category pages.

| Category  | Badge Color | Hex       |
|-----------|-------------|-----------|
| tech      | Black       | `#1a1a1a` |
| ai        | Purple      | `#6d28d9` |
| product   | Blue        | `#0369a1` |
| education | Amber       | `#b45309` |
| life      | Green       | `#15803d` |

Badge style: white text, uppercase, `font-size: 0.65rem`, `letter-spacing: 0.04em`, `border-radius: 2px`, `padding: 0.15rem 0.5rem`.

---

## 3. Homepage Layout

Single column, time-ordered list. No featured post, no category grouping.

**Each post card contains:**
1. Row: `[category badge] [date] · [clock icon] [X min]`
2. `<h2>` title — `font-weight: 800`, `font-size: 1.15rem`, `letter-spacing: -0.2px`
3. Excerpt (tldr or description) — `color: #4b5563`, `font-size: 0.85rem`
4. Tag row — `#tag` pills in `#f3f4f6` background

Cards are separated by `border-bottom: 1px solid #e5e7eb` with `padding: 1.25rem 0`. No border box, no box-shadow.

---

## 4. Navigation

```
[quidproquo]  [分類]  [標籤]        [search icon]  [EN]
─────────────────────────────────────────────── 2px black
```

- Logo: `font-weight: 900`, `letter-spacing: -0.5px`
- Nav links: `font-size: 0.8rem`, `color: #555`
- Search: Lucide `Search` SVG icon (16×16, stroke `#555`)
- Language switch: `EN` text badge — `border: 1px solid #d1d5db`, `border-radius: 3px`, `padding: 0.15rem 0.45rem`, `font-size: 0.7rem`, `font-weight: 700`
- On article pages: the 2px bottom border doubles as a reading progress bar (width animates via JS scroll listener)

---

## 5. Article Page Layout

```
[← 首頁]  [category badge]
[H1 title — large, heavy weight]
[date] · [clock] [X min]
[TL;DR box]
[tags]
[TOC box]
─────────
[article content]
─────────
[← prev post]    [next post →]
[related articles by tag]
[footer]
```

### 5.1 TL;DR Box
- `background: #f0fdf4`, `border-left: 3px solid #16a34a`
- Label: `TL;DR` in small uppercase green, then the text
- Only rendered if `tldr` frontmatter is present

### 5.2 Table of Contents (TOC)
- Inline box below tags, before article body
- Rendered from H2/H3 headings at build time via `rehype-toc` plugin
- Container: `border: 1px solid #e5e7eb`, `border-radius: 6px`, `background: #fafafa`
- Header: list-icon SVG + "目錄" label in small uppercase
- H2 → `<ol>` top-level items; H3 → nested `<ol>` sub-items
- No JS scroll-spy (keeping it static and simple)

### 5.3 Code Blocks
- Dark theme background: `#1e1e1e`, text `#d4d4d4` (VS Code Dark+)
- Copy button: top-right corner, `background: #333`, `color: #aaa`, clipboard SVG icon + "Copy" label
- Copy action via `navigator.clipboard.writeText()` — button text changes to "Copied!" for 2s

### 5.4 Reading Progress Bar
- Positioned as the animated fill of the nav's 2px bottom border
- JS: `window.addEventListener('scroll', ...)` → `scrollY / (document.body.scrollHeight - window.innerHeight) * 100`
- CSS: `width: var(--progress, 0%)` transition on the pseudo-element or overlay element

### 5.5 Prev / Next Navigation
- Two-column grid at article bottom, above related articles
- Left: `← prev` with arrow icon + title
- Right: `next →` with arrow icon + title
- Determined at build time from sorted post list

### 5.6 Related Articles
- Heading: link-icon SVG + "相關文章 · #[primary-tag]"
- Algorithm: posts sharing ≥1 tag with current post, sorted by tag overlap count then date, max 3
- Each item: title + reading time, `border: 1px solid #e5e7eb`, `border-radius: 6px`
- Primary tag = first tag in the post's frontmatter tags array
- If the post has no tags, or no other posts share any tags, the related articles section is not rendered

---

## 6. Features Inventory

All features are implemented in a single pass.

| Feature | Implementation approach |
|---------|------------------------|
| **Reading time** | Astro remark plugin — count words in markdown, divide by 200 wpm |
| **TOC** | rehype plugin at build time — parse H2/H3, render inline box |
| **Search** | Pagefind (static search, zero server cost on Cloudflare Pages) — index at build time, UI via `@pagefind/default-ui` |
| **Related articles** | Build-time computation in `[...slug].astro` — tag overlap scoring |
| **Reading progress bar** | Inline `<script>` in PostLayout, scroll listener → CSS variable |
| **Series** | New optional frontmatter field `series: { name, order }` — series nav box rendered when present (see §5.7) |
| **Dark mode** | CSS custom properties (`--bg`, `--text`, etc.) toggled via `data-theme` attribute; toggle button in nav; persisted to `localStorage`; respects `prefers-color-scheme` on first visit |
| **OG image** | Satori + `@resvg/resvg-js` via Astro endpoint (`/og/[slug].png`) — generates PNG from title + category at build time |
| **Code copy button** | Inline script injected by rehype plugin — attaches to each `<pre>` block |
| **Prev / Next** | Computed in `getStaticPaths` from sorted post array |
| **RSS feed** | Astro `@astrojs/rss` package → `/rss.xml` |
| **Sitemap** | `@astrojs/sitemap` integration → auto-generated `sitemap-index.xml` |
| **SEO** | Add `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">` to PostLayout; use post description or tldr as description fallback |

### 5.7 Series Navigation

Rendered only when the post has `series: { name: string, order: number }` in frontmatter.

Box appears between TOC and article body:

```
┌─────────────────────────────────────┐
│ [book-icon] 系列：RAG 技術深度解析（3 / 8） │
│ ← 上一篇：RRF 多路融合           │
│    下一篇：向量資料庫比較 →        │
└─────────────────────────────────────┘
```

- `border: 1px solid #e5e7eb`, `border-radius: 6px`, `background: #fafafa`
- Series name + current position (e.g. "3 / 8") in header row
- Previous/next links within the series only (different from global prev/next in §5.5)
- If first in series, no prev link; if last, no next link

---

## 7. i18n

- Language toggle shows `EN` badge (zh-TW pages) or `中文` badge (en pages)
- No emoji in UI — all icons are SVG (Lucide icon set)
- All new UI strings (TOC label, "Related articles", "min read", etc.) added to `src/i18n/ui.ts` for both `zh-TW` and `en`

---

## 8. Component Changes

| File | Change |
|------|--------|
| `src/layouts/PostLayout.astro` | Add CSS tokens (light + dark), nav progress bar script, dark mode toggle (sun/moon icon + localStorage), OG meta tags, RSS/sitemap links |
| `src/components/PostCard.astro` | Editorial style — remove border box, add category color badge, reading time |
| `src/pages/posts/[...slug].astro` | Add TOC, TL;DR, code copy, prev/next, related articles |
| `src/pages/index.astro` | Pass reading time to PostCard |
| `src/i18n/ui.ts` | Add new UI strings |
| `src/utils/readingTime.ts` | New utility: `getReadingTime(body: string): number` |
| `src/utils/relatedPosts.ts` | New utility: `getRelatedPosts(post, allPosts, max)` |
| `astro.config.mjs` | Add `@astrojs/sitemap`, `@astrojs/rss`, Pagefind integration |
| `src/pages/og/[slug].png.ts` | OG image endpoint — Satori renders title + category badge to PNG at build time |

---

## 9. Out of Scope

- Comments / reactions
- Newsletter subscription
- Database or server-side features
- Authentication

---

## 10. Success Criteria

- [ ] All pages pass Lighthouse accessibility ≥ 90
- [ ] Build succeeds on Cloudflare Pages with no new errors
- [ ] Search indexes all zh-TW and en posts
- [ ] Dark mode persists across page navigation
- [ ] OG images render correctly when sharing to LINE/Twitter
- [ ] RSS feed validates at w3c feed validator
