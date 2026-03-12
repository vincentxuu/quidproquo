# quidproquo.cc — Phase 1+2: Blog + D1 + Post Skill 實作計畫

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 建立可運作的多主題 Astro 部落格 quidproquo.cc，部署到 Cloudflare Workers，整合 D1 資料庫，並提供 post skill 讓 Claude Code 自動產生各類文章。

**Architecture:** Astro Hybrid Mode — 文章頁 `prerender = true`（SSG），API endpoints SSR。Markdown 是唯一 source of truth，D1 為衍生資料，於 build 時同步。

**Tech Stack:** Astro 5, @astrojs/cloudflare adapter, @astrojs/mdx, Cloudflare Workers, D1, TypeScript, Zod, gray-matter, tsx

**分類系統：** 單一 `posts` collection，`category: z.string()` 自由填寫（不鎖 enum）。
目前分類：`tech` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `ai` / `product` / `marketing` / `travel` / `design` / `education` / `policy` / `anime` / `career`

---

## 檔案結構總覽

```
quidproquo/
├── astro.config.mjs                      # Hybrid mode + Cloudflare adapter
├── wrangler.jsonc                        # D1, Vectorize, AI, R2 bindings
├── tsconfig.json
├── package.json
├── migrations/
│   └── 0001_initial.sql                  # D1 schema
├── scripts/
│   └── sync-to-d1.ts                     # Build 時 markdown → D1 同步
├── src/
│   ├── content/
│   │   ├── config.ts                     # Content Collection schema (Zod)
│   │   └── posts/                        # 所有文章放這裡，按 category 建子目錄
│   │       ├── tech/
│   │       │   └── 2026-03-12-sample.md  # 範例文章（用於測試）
│   │       └── life/
│   ├── layouts/
│   │   └── PostLayout.astro
│   ├── components/
│   │   ├── PostCard.astro
│   │   └── TagList.astro
│   └── pages/
│       ├── index.astro                   # 首頁（文章列表）
│       ├── posts/
│       │   └── [...slug].astro           # 單篇文章（prerender）
│       ├── categories/
│       │   ├── index.astro               # 分類總覽
│       │   └── [category].astro          # 分類篩選（prerender）
│       ├── tags/
│       │   ├── index.astro               # 標籤總覽
│       │   └── [tag].astro               # 標籤篩選（prerender）
│       └── api/
│           └── posts.ts                  # GET/POST posts
└── .claude/
    └── skills/
        └── post/
            ├── SKILL.md                  # 主要 skill 指令
            ├── templates/
            │   ├── tech-post.md          # 技術文章模板
            │   └── general-post.md       # 通用文章模板
            └── references/
                ├── writing-guide.md      # 寫作風格指南
                └── frontmatter-schema.md # frontmatter 欄位說明
```

---

## Chunk 1: 專案初始化

### Task 1: 初始化 Astro + Cloudflare 專案

**Files:**
- Create: `astro.config.mjs`
- Create: `wrangler.jsonc`
- Create: `tsconfig.json`
- Create: `package.json`

- [x] **Step 1: 使用 create-cloudflare 初始化**

```bash
cd /Users/xiaoxu/Projects/blog
pnpm create cloudflare@latest quidproquo -- --framework=astro
cd quidproquo
```

選擇時：
- Framework: Astro
- TypeScript: Yes
- Deploy now: No

- [x] **Step 2: 安裝額外相依**

```bash
pnpm add @astrojs/mdx
pnpm add -D @astrojs/check tsx gray-matter @types/node oxlint
```

- [x] **Step 3: 更新 astro.config.mjs 為 Hybrid Mode + i18n**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: {
      prefixDefaultLocale: false,  // zh-TW 為根路徑，en 用 /en/ 前綴
    }
  }
});
```

- [x] **Step 4: 建立 wrangler.jsonc**

```jsonc
// wrangler.jsonc
{
  "name": "quidproquo",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-03-10",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "d1_databases": [{
    "binding": "DB",
    "database_name": "quidproquo-db",
    "database_id": "PLACEHOLDER"
  }],
  "vectorize": [{
    "binding": "VECTORIZE_INDEX",
    "index_name": "quidproquo-embeddings"
  }],
  "ai": {
    "binding": "AI"
  },
  "r2_buckets": [{
    "binding": "IMAGES",
    "bucket_name": "quidproquo-images"
  }]
}
```

- [x] **Step 5: 建立 D1 database，取得 database_id**

```bash
npx wrangler d1 create quidproquo-db
```

Expected output:
```
✅ Successfully created DB 'quidproquo-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

將 `database_id` 填入 `wrangler.jsonc`，替換 `PLACEHOLDER`。

- [x] **Step 6: 加入 lint script 到 package.json**

在 `scripts` 加入：

```json
"lint": "oxlint src/"
```

- [x] **Step 7: 型別檢查 + lint**

```bash
npx astro check
pnpm lint
```

Expected: No errors

- [x] **Step 8: 刪除預設範例頁面**

把 `src/pages/` 下的預設範例頁面刪掉（保留目錄結構），`src/content/` 下的範例也刪掉。我們之後會重建。

- [x] **Step 9: Commit**

```bash
git add astro.config.mjs wrangler.jsonc package.json tsconfig.json pnpm-lock.yaml .gitignore
git commit -m "feat: initialize Astro + Cloudflare Workers project (quidproquo)"
```

---

### Task 2: Content Collection Schema + 範例文章

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/tech/2026-03-12-cloudflare-d1-batch-timeout.md`

- [x] **Step 1: 寫 Content Collection schema**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    description: z.string().optional(),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [x] **Step 2: 建立範例文章（tech 分類）**

```markdown
---
title: "Cloudflare D1 batch insert 超過 100 筆會 timeout 的解法"
date: 2026-03-12
category: tech
tags: [cloudflare, d1, typescript]
tldr: "D1 batch 單次上限 100 筆，用 chunkArray + Promise.all 分批送"
description: "解決 Cloudflare D1 batch insert 超過 100 筆靜默 timeout 的問題"
draft: false
---

## TL;DR

D1 batch 單次上限 100 筆，用 chunkArray + Promise.all 分批送。

## 情境

在建立 quidproquo 的 build-time sync script 時，需要把多篇文章一次同步到 D1。

## 問題

批次 insert 沒有錯誤訊息，但資料只有前 100 筆寫入，其餘靜默消失。

## 解法

把陣列切成每份 100 筆，分批用 `db.batch()` 送：

```typescript
function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const chunks = chunkArray(statements, 100);
for (const chunk of chunks) {
  await db.batch(chunk);
}
```

## 為什麼會這樣

D1 的 `batch()` 方法有每次請求 100 個 statement 的上限，超過的部分會被丟棄而非報錯。

## 學到的事

D1 batch 有隱性上限，資料量大時一定要分批。
```

- [x] **Step 3: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add Content Collection schema (posts) and sample tech post"
```

---

### Task 2.5: i18n 工具設定

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`

- [x] **Step 1: 寫 src/i18n/ui.ts（UI 翻譯字串）**

```typescript
// src/i18n/ui.ts
export const languages = {
  'zh-TW': '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh-TW';

export const ui = {
  'zh-TW': {
    'nav.home': '首頁',
    'nav.categories': '分類',
    'nav.tags': '標籤',
    'site.tagline': '技術、攀岩、衝浪、咖啡，以及其他一切。',
    'post.backtocategories': '← 所有分類',
    'post.backtotags': '← 所有標籤',
    'post.articles': '篇文章',
    'lang.switch': 'English',
    'lang.switch.href': '/en',
  },
  en: {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'site.tagline': 'Tech, climbing, surfing, coffee, and everything else.',
    'post.backtocategories': '← All categories',
    'post.backtotags': '← All tags',
    'post.articles': 'posts',
    'lang.switch': '中文',
    'lang.switch.href': '/',
  },
} as const;

export type UiKey = keyof typeof ui['zh-TW'];
```

- [x] **Step 2: 寫 src/i18n/utils.ts（helper functions）**

```typescript
// src/i18n/utils.ts
import { ui, defaultLang, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return (ui[lang][key] ?? ui[defaultLang][key]) as string;
  };
}
```

- [x] **Step 3: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n utilities for zh-TW and en"
```

---

## Chunk 2: 頁面與元件

### Task 3: Layout + Components

**Files:**
- Create: `src/layouts/PostLayout.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`

- [x] **Step 1: 寫 PostLayout.astro（i18n-aware）**

```astro
---
// src/layouts/PostLayout.astro
import { getLangFromUrl, useTranslations, type Lang } from '../i18n/utils';

interface Props {
  title: string;
  description?: string;
  lang?: Lang;
}
const { title, description, lang: langProp } = Astro.props;
const lang = langProp ?? getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const homeHref = lang === 'en' ? '/en' : '/';
const categoriesHref = lang === 'en' ? '/en/categories' : '/categories';
const tagsHref = lang === 'en' ? '/en/tags' : '/tags';
const switchHref = t('lang.switch.href');
const switchLabel = t('lang.switch');
---
<!DOCTYPE html>
<html lang={lang}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — quidproquo</title>
  {description && <meta name="description" content={description} />}
</head>
<body>
  <header>
    <nav>
      <a href={homeHref} class="site-name">quidproquo</a>
      <a href={categoriesHref}>{t('nav.categories')}</a>
      <a href={tagsHref}>{t('nav.tags')}</a>
      <a href={switchHref} class="lang-switch">{switchLabel}</a>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <p>quidproquo.cc</p>
  </footer>
</body>
</html>

<style>
  body {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    color: #1a1a1a;
  }
  nav { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
  .site-name { font-weight: 600; text-decoration: none; color: #000; }
  nav a { text-decoration: none; color: #555; }
  nav a:hover { color: #000; }
  .lang-switch { margin-left: auto; }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #eee; color: #888; font-size: 0.85rem; }
</style>
```

- [x] **Step 2: 寫 PostCard.astro（i18n-aware）**

```astro
---
// src/components/PostCard.astro
import type { Lang } from '../i18n/utils';

interface Props {
  slug: string;
  title: string;
  date: Date;
  category: string;
  tags: string[];
  description?: string;
  tldr?: string;
  lang?: Lang;
}
const { slug, title, date, category, tags, description, tldr, lang = 'zh-TW' } = Astro.props;
const excerpt = tldr || description || '';
const categoriesBase = lang === 'en' ? '/en/categories' : '/categories';
const tagsBase = lang === 'en' ? '/en/tags' : '/tags';
---
<article>
  <div class="meta">
    <time datetime={date.toISOString()}>{date.toLocaleDateString(lang)}</time>
    <a href={`${categoriesBase}/${category}`} class="category">{category}</a>
  </div>
  <h2><a href={`/posts/${slug}`}>{title}</a></h2>
  {excerpt && <p class="excerpt">{excerpt}</p>}
  <div class="tags">
    {tags.map(tag => <a href={`${tagsBase}/${tag}`} class="tag">#{tag}</a>)}
  </div>
</article>

<style>
  article { border: 1px solid #e5e7eb; padding: 1.25rem; margin: 1rem 0; border-radius: 8px; }
  article:hover { border-color: #9ca3af; }
  .meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem; }
  .category { background: #f0f9ff; color: #0369a1; padding: 0.1rem 0.5rem; border-radius: 4px; text-decoration: none; font-weight: 500; }
  .category:hover { background: #e0f2fe; }
  h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
  h2 a { text-decoration: none; color: inherit; }
  h2 a:hover { color: #2563eb; }
  .excerpt { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
  .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.75rem; }
  .tag { background: #f3f4f6; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.8rem; text-decoration: none; color: #374151; }
  .tag:hover { background: #e5e7eb; }
</style>
```

- [x] **Step 3: 寫 TagList.astro**

```astro
---
// src/components/TagList.astro
interface Props {
  tags: string[];
}
const { tags } = Astro.props;
---
<div class="tags">
  {tags.map(tag => <a href={`/tags/${tag}`} class="tag">#{tag}</a>)}
</div>

<style>
  .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .tag { background: #f3f4f6; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.85rem; text-decoration: none; color: #374151; }
  .tag:hover { background: #e5e7eb; }
</style>
```

- [x] **Step 4: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [x] **Step 5: Commit**

```bash
git add src/layouts/ src/components/
git commit -m "feat: add PostLayout, PostCard, TagList components"
```

---

### Task 4: 頁面

**Files:**
- Create: `src/pages/index.astro`（zh-TW 首頁）
- Create: `src/pages/en/index.astro`（en 首頁）
- Create: `src/pages/posts/[...slug].astro`（單篇，lang-aware）
- Create: `src/pages/categories/index.astro`
- Create: `src/pages/categories/[category].astro`
- Create: `src/pages/en/categories/index.astro`
- Create: `src/pages/en/categories/[category].astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/en/tags/index.astro`
- Create: `src/pages/en/tags/[tag].astro`

- [x] **Step 1: 寫 index.astro（zh-TW 首頁）**

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import PostLayout from '../layouts/PostLayout.astro';
import PostCard from '../components/PostCard.astro';
import { useTranslations } from '../i18n/utils';

const t = useTranslations('zh-TW');
const posts = await getCollection('posts', ({ data }) =>
  !data.draft && data.lang === 'zh-TW'
);
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<PostLayout title="quidproquo" lang="zh-TW">
  <h1>quidproquo</h1>
  <p class="subtitle">{t('site.tagline')}</p>
  {posts.map(post => (
    <PostCard
      slug={post.id}
      title={post.data.title}
      date={post.data.date}
      category={post.data.category}
      tags={post.data.tags}
      description={post.data.description}
      tldr={post.data.tldr}
      lang="zh-TW"
    />
  ))}
</PostLayout>

<style>
  h1 { margin-bottom: 0.25rem; }
  .subtitle { color: #6b7280; margin-bottom: 2rem; }
</style>
```

- [x] **Step 2: 寫 en/index.astro（en 首頁）**

```astro
---
// src/pages/en/index.astro
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('en');
const posts = await getCollection('posts', ({ data }) =>
  !data.draft && data.lang === 'en'
);
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<PostLayout title="quidproquo" lang="en">
  <h1>quidproquo</h1>
  <p class="subtitle">{t('site.tagline')}</p>
  {posts.map(post => (
    <PostCard
      slug={post.id}
      title={post.data.title}
      date={post.data.date}
      category={post.data.category}
      tags={post.data.tags}
      description={post.data.description}
      tldr={post.data.tldr}
      lang="en"
    />
  ))}
</PostLayout>

<style>
  h1 { margin-bottom: 0.25rem; }
  .subtitle { color: #6b7280; margin-bottom: 2rem; }
</style>
```

- [x] **Step 2: 寫 posts/[...slug].astro（單篇文章）**

注意：因為 `posts` 的 ID 包含子目錄（如 `tech/2026-03-12-xxx`），用 `[...slug]` 而非 `[slug]`。

```astro
---
// src/pages/posts/[...slug].astro
export const prerender = true;

import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  category={post.data.category}
  tags={post.data.tags}
>
  <article>
    <header>
      <div class="meta">
        <time datetime={post.data.date.toISOString()}>
          {post.data.date.toLocaleDateString('zh-TW')}
        </time>
        <a href={`/categories/${post.data.category}`} class="category">
          {post.data.category}
        </a>
      </div>
      <h1>{post.data.title}</h1>
      {post.data.tldr && (
        <div class="tldr">
          <strong>TL;DR：</strong>{post.data.tldr}
        </div>
      )}
      <div class="tags">
        {post.data.tags.map(tag => (
          <a href={`/tags/${tag}`} class="tag">#{tag}</a>
        ))}
      </div>
    </header>
    <div class="content">
      <Content />
    </div>
  </article>
</PostLayout>

<style>
  .meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #6b7280; margin-bottom: 1rem; align-items: center; }
  .category { background: #f0f9ff; color: #0369a1; padding: 0.1rem 0.5rem; border-radius: 4px; text-decoration: none; font-weight: 500; }
  h1 { margin: 0.5rem 0 1rem; }
  .tldr { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 0.75rem 1rem; border-radius: 0 6px 6px 0; margin-bottom: 1rem; }
  .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .tag { background: #f3f4f6; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.8rem; text-decoration: none; color: #374151; }
  .content { line-height: 1.8; }
  .content pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
  .content :not(pre) > code { background: #f3f4f6; padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.9em; }
</style>
```

- [x] **Step 3: 寫 categories/index.astro（分類總覽）**

```astro
---
// src/pages/categories/index.astro
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

const posts = await getCollection('posts', ({ data }) => !data.draft);
const categoryCounts = posts.reduce((acc, post) => {
  acc[post.data.category] = (acc[post.data.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
---
<PostLayout title="分類 — quidproquo">
  <h1>分類</h1>
  <div class="categories">
    {categories.map(([cat, count]) => (
      <a href={`/categories/${cat}`} class="category-item">
        <span class="name">{cat}</span>
        <span class="count">{count}</span>
      </a>
    ))}
  </div>
</PostLayout>

<style>
  .categories { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
  .category-item { display: flex; align-items: center; gap: 0.5rem; background: #f0f9ff; border: 1px solid #bae6fd; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; color: #0369a1; }
  .category-item:hover { background: #e0f2fe; }
  .count { background: #0369a1; color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.8rem; }
</style>
```

- [x] **Step 4: 寫 categories/[category].astro（分類篩選）**

```astro
---
// src/pages/categories/[category].astro
export const prerender = true;

import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import PostCard from '../../components/PostCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const categories = [...new Set(posts.map(p => p.data.category))];
  return categories.map(category => ({
    params: { category },
    props: { posts: posts.filter(p => p.data.category === category) },
  }));
}

const { category } = Astro.params;
const { posts } = Astro.props;
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<PostLayout title={`${category} — quidproquo`}>
  <p><a href="/categories">← 所有分類</a></p>
  <h1>{category}</h1>
  <p class="count">{posts.length} 篇文章</p>
  {posts.map(post => (
    <PostCard
      slug={post.id}
      title={post.data.title}
      date={post.data.date}
      category={post.data.category}
      tags={post.data.tags}
      description={post.data.description}
      tldr={post.data.tldr}
    />
  ))}
</PostLayout>

<style>
  .count { color: #6b7280; margin-bottom: 1.5rem; }
</style>
```

- [x] **Step 5: 寫 tags/index.astro（標籤總覽）**

```astro
---
// src/pages/tags/index.astro
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

const posts = await getCollection('posts', ({ data }) => !data.draft);
const tagCounts = posts.reduce((acc, post) => {
  post.data.tags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {} as Record<string, number>);

const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
---
<PostLayout title="標籤 — quidproquo">
  <h1>標籤</h1>
  <div class="tags">
    {tags.map(([tag, count]) => (
      <a href={`/tags/${tag}`} class="tag">
        #{tag}
        <span class="count">{count}</span>
      </a>
    ))}
  </div>
</PostLayout>

<style>
  .tags { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.5rem; }
  .tag { display: flex; align-items: center; gap: 0.4rem; background: #f3f4f6; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; color: #374151; }
  .tag:hover { background: #e5e7eb; }
  .count { background: #d1d5db; padding: 0.1rem 0.4rem; border-radius: 10px; font-size: 0.8rem; color: #4b5563; }
</style>
```

- [x] **Step 6: 寫 tags/[tag].astro（標籤篩選）**

```astro
---
// src/pages/tags/[tag].astro
export const prerender = true;

import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import PostCard from '../../components/PostCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap(p => p.data.tags))];
  return tags.map(tag => ({
    params: { tag },
    props: { posts: posts.filter(p => p.data.tags.includes(tag)) },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<PostLayout title={`#${tag} — quidproquo`}>
  <p><a href="/tags">← 所有標籤</a></p>
  <h1>#{tag}</h1>
  <p class="count">{posts.length} 篇文章</p>
  {posts.map(post => (
    <PostCard
      slug={post.id}
      title={post.data.title}
      date={post.data.date}
      category={post.data.category}
      tags={post.data.tags}
      description={post.data.description}
      tldr={post.data.tldr}
    />
  ))}
</PostLayout>

<style>
  .count { color: #6b7280; margin-bottom: 1.5rem; }
</style>
```

- [x] **Step 7: Build 驗證**

```bash
npx astro build
```

Expected: Build success，無錯誤，輸出 `dist/` 目錄

- [x] **Step 8: 本地預覽驗證**

```bash
npx wrangler dev
```

驗證：
- [x] 首頁 `/` 顯示 zh-TW 文章，nav 右上有「English」切換連結
- [x] `/en` 顯示 en 文章（目前空的沒關係），nav 右上有「中文」切換連結
- [x] 點進文章頁，內容完整，TL;DR 有綠色左邊框
- [x] `/categories` 顯示 `tech: 1`
- [x] `/tags` 顯示 `cloudflare`、`d1`、`typescript`

- [x] **Step 9: Commit**

```bash
git add src/pages/
git commit -m "feat: add blog pages - home, post, categories, tags"
```

---

## Chunk 3: Post Skill

### Task 5: 建立 Post Skill

**Files:**
- Create: `.claude/skills/post/SKILL.md`
- Create: `.claude/skills/post/templates/tech-post.md`
- Create: `.claude/skills/post/templates/general-post.md`
- Create: `.claude/skills/post/references/writing-guide.md`
- Create: `.claude/skills/post/references/frontmatter-schema.md`

- [x] **Step 1: 寫 SKILL.md**

```markdown
---
name: post
description: Convert a conversation, notes, or experience into a structured post for quidproquo.cc
---

# post skill

把任何內容（解決問題的過程、攀岩心得、電影感想、咖啡筆記...）轉換成結構化的文章，存到 `src/content/posts/<category>/`。

## 觸發方式

User 說：「寫成文章」、「記錄一下」、「write post」、「存成 post」

## 支援的分類

`tech` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `ai` / `product` / `marketing` / `travel` / `design` / `education` / `policy` / `anime` / `career`

## 執行步驟

1. **判斷分類**：根據內容選擇最適合的 category
2. **選擇模板**：
   - `tech` → 使用 `templates/tech-post.md`
   - 其他所有分類 → 使用 `templates/general-post.md`
3. **收集資訊**：從對話或筆記提取關鍵內容
4. **產生檔案**：
   - 遵守 `references/writing-guide.md`
   - 欄位說明見 `references/frontmatter-schema.md`
   - 檔名：`YYYY-MM-DD-<slug>.md`（slug 用英文 kebab-case）
   - 存到 `src/content/posts/<category>/`
5. **請使用者 review**：展示草稿，詢問是否修改
6. **確認後執行**：
   ```bash
   git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md
   git commit -m "post(<category>): <title summary>"
   ```
```

- [x] **Step 2: 寫 templates/tech-post.md**

```markdown
---
title: ""
date: YYYY-MM-DD
category: tech
tags: []
tldr: ""
description: ""
draft: false
---

## TL;DR

{{tldr}}

## 情境

{{在做什麼時遇到這個問題}}

## 問題

{{錯誤訊息或異常行為}}

## 嘗試過程

{{試了什麼，為什麼沒用}}

## 解法

{{最終怎麼解的}}

```language
{{code}}
```

## 為什麼會這樣

{{根本原因}}

## 學到的事

{{一句話總結}}
```

- [x] **Step 3: 寫 templates/general-post.md**

```markdown
---
title: ""
date: YYYY-MM-DD
category: ""
tags: []
description: ""
draft: false
---

{{內容}}
```

- [x] **Step 4: 寫 references/writing-guide.md**

```markdown
# quidproquo 寫作風格指南

## 核心原則

寫給「一週後的自己」看，也寫給遇到同樣事情的人看。

## 各分類風格

**tech**：直接、具體，程式碼要完整。標題包含關鍵錯誤或技術名稱。
**climbing**：臨場感。路線名稱、岩場地點、身體感受要寫出來。
**surf**：狀態、浪況、感受。不需要技術術語，但要有畫面。
**film**：不劇透開頭，說清楚為什麼值得看（或不值得）。
**coffee**：豆子來源、風味描述、沖煮參數（有的話）。
**career**：誠實，包含猶豫和失敗的部分，對讀者最有用。
**life**：隨意，不需要結構。

## Title 原則

- 具體 > 抽象
- tech：包含錯誤關鍵字，結尾加「的解法」「踩坑記錄」
- 其他：直接說這篇在講什麼

## 語氣

- 直接，不客套
- 可以有情緒
- 不需要介紹自己
```

- [x] **Step 5: 寫 references/frontmatter-schema.md**

```markdown
# Frontmatter 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| title | string | ✅ | 文章標題 |
| date | date | ✅ | 撰寫日期，格式 YYYY-MM-DD |
| category | string | ✅ | 分類（見 SKILL.md 清單） |
| tags | string[] | ✅ | 標籤，全小寫 kebab-case，可空陣列 |
| description | string | ❌ | SEO meta description |
| tldr | string | ❌ | 一句話摘要（tech 類強烈建議填） |
| draft | boolean | ❌ | true 時不顯示（預設 false） |

## 檔名規則

`YYYY-MM-DD-<slug>.md`

slug 用英文 kebab-case，取關鍵詞：
- `2026-03-12-d1-batch-timeout.md`
- `2026-03-15-first-outdoor-lead.md`
- `2026-03-20-parasite-review.md`
```

- [x] **Step 6: 驗證 skill 檔案**

```bash
ls .claude/skills/post/
ls .claude/skills/post/templates/
ls .claude/skills/post/references/
```

Expected: 所有 5 個檔案存在

- [x] **Step 7: Commit**

```bash
git add .claude/
git commit -m "feat: add post skill with tech and general templates"
```

---

## Chunk 4: D1 整合

### Task 6: D1 Schema Migration

**Files:**
- Create: `migrations/0001_initial.sql`

- [x] **Step 1: 寫 migration SQL**

```sql
-- migrations/0001_initial.sql

-- 文章主表
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'zh-TW',
  description TEXT,
  tldr TEXT,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at);

-- Post chunk 表（Phase 4 RAG 使用）
CREATE TABLE post_chunks (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE INDEX idx_chunks_post ON post_chunks(post_id);

-- 外部文件 chunk 表（Phase 3 爬蟲使用）
CREATE TABLE doc_chunks (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_name TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_doc_source ON doc_chunks(source_url);
```

- [x] **Step 2: 套用到本地 D1**

```bash
npx wrangler d1 execute quidproquo-db --local --file=migrations/0001_initial.sql
```

Expected: `✅ Applied 1 migration`

- [x] **Step 3: 驗證 schema**

```bash
npx wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table'"
```

Expected: 看到 `posts`、`post_chunks`、`doc_chunks`

- [x] **Step 4: Commit**

```bash
git add migrations/
git commit -m "feat: add D1 schema migration for posts, post_chunks, doc_chunks"
```

---

### Task 7: Build-time Sync Script

**Files:**
- Create: `scripts/sync-to-d1.ts`
- Modify: `package.json`

- [x] **Step 1: 寫 sync-to-d1.ts**

```typescript
// scripts/sync-to-d1.ts
// 把 src/content/posts/ 的 .md 同步到 D1
// Usage: pnpm sync (本地) | pnpm sync:prod (production)

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const POSTS_DIR = 'src/content/posts';
const IS_PROD = process.argv.includes('--prod');

function generateId(slug: string): string {
  return createHash('sha256').update(slug).digest('hex').slice(0, 16);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

function escape(str: string): string {
  return str.replace(/'/g, "''");
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function syncPosts() {
  const files = await collectMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} post(s) to sync`);

  const statements: string[] = [];

  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);

    if (data.draft) {
      console.log(`  Skip draft: ${filepath}`);
      continue;
    }

    // slug = category/YYYY-MM-DD-filename (relative to POSTS_DIR, without .md)
    const slug = filepath.replace(POSTS_DIR + '/', '').replace(/\.md$/, '');
    const id = generateId(slug);
    const now = new Date().toISOString();
    const createdAt = new Date(data.date).toISOString();

    const sql = `
INSERT INTO posts (id, slug, title, category, description, tldr, content, tags, created_at, updated_at)
VALUES (
  '${id}', '${escape(slug)}', '${escape(data.title as string)}',
  '${escape(data.category as string)}',
  ${data.description ? `'${escape(data.description as string)}'` : 'NULL'},
  ${data.tldr ? `'${escape(data.tldr as string)}'` : 'NULL'},
  '${escape(content)}',
  '${JSON.stringify(data.tags || [])}',
  '${createdAt}', '${now}'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  tldr = excluded.tldr,
  content = excluded.content,
  tags = excluded.tags,
  updated_at = excluded.updated_at;`.trim();

    statements.push(sql);
    console.log(`  Prepared: ${slug}`);
  }

  const chunks = chunkArray(statements, 100);
  const flag = IS_PROD ? '' : '--local';

  for (const chunk of chunks) {
    const combined = chunk.join('\n');
    execSync(
      `npx wrangler d1 execute quidproquo-db ${flag} --command="${combined.replace(/"/g, '\\"')}"`,
      { stdio: 'inherit' }
    );
  }

  console.log(`\n✅ Synced ${statements.length} post(s) to D1`);
}

syncPosts().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
```

- [x] **Step 2: 加入 package.json scripts**

在 `scripts` 區塊加入：

```json
"sync": "tsx scripts/sync-to-d1.ts",
"sync:prod": "tsx scripts/sync-to-d1.ts --prod"
```

- [x] **Step 3: 測試**

```bash
pnpm sync
```

Expected:
```
Found 1 post(s) to sync
  Prepared: tech/2026-03-12-cloudflare-d1-batch-timeout
✅ Synced 1 post(s) to D1
```

- [x] **Step 4: 驗證資料寫入**

```bash
npx wrangler d1 execute quidproquo-db --local --command="SELECT id, slug, category, title FROM posts"
```

Expected: 看到範例文章資料

- [x] **Step 5: Commit**

```bash
git add scripts/ package.json
git commit -m "feat: add build-time markdown to D1 sync script"
```

---

### Task 8: /api/posts API Endpoint

**Files:**
- Create: `src/pages/api/posts.ts`

- [x] **Step 1: 寫 GET/POST posts API**

```typescript
// src/pages/api/posts.ts
import type { APIRoute } from 'astro';

interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  tldr: string | null;
  tags: string;
  created_at: string;
}

interface PostBody {
  id: string;
  slug: string;
  title: string;
  category: string;
  description?: string;
  tldr?: string;
  content: string;
  tags: string[];
  created_at: string;
}

function getDB(locals: App.Locals): D1Database {
  return (locals.runtime as { env: { DB: D1Database } }).env.DB;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals);
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  const query = category
    ? db.prepare(
        'SELECT id, slug, title, category, description, tldr, tags, created_at FROM posts WHERE category = ? ORDER BY created_at DESC'
      ).bind(category)
    : db.prepare(
        'SELECT id, slug, title, category, description, tldr, tags, created_at FROM posts ORDER BY created_at DESC'
      );

  const { results } = await query.all<PostRow>();
  const posts = results.map(row => ({
    ...row,
    tags: JSON.parse(row.tags) as string[],
  }));

  return new Response(JSON.stringify({ posts }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals);
  const body = (await request.json()) as PostBody;
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO posts (id, slug, title, category, description, tldr, content, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         title = excluded.title,
         category = excluded.category,
         description = excluded.description,
         tldr = excluded.tldr,
         content = excluded.content,
         tags = excluded.tags,
         updated_at = excluded.updated_at`
    )
    .bind(
      body.id,
      body.slug,
      body.title,
      body.category,
      body.description ?? null,
      body.tldr ?? null,
      body.content,
      JSON.stringify(body.tags),
      body.created_at,
      now
    )
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

- [x] **Step 2: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [x] **Step 3: 測試 API**

```bash
npx wrangler dev
```

另開 terminal：

```bash
curl http://localhost:8787/api/posts
curl "http://localhost:8787/api/posts?category=tech"
```

Expected: 回傳 JSON，包含範例文章

- [x] **Step 4: Commit**

```bash
git add src/pages/api/
git commit -m "feat: add /api/posts GET/POST endpoint with category filter"
```

---

## Chunk 5: 部署

### Task 9: 部署到 Cloudflare

**Files:** 無新增

- [x] **Step 1: 套用 migration 到 production D1**

```bash
npx wrangler d1 execute quidproquo-db --file=migrations/0001_initial.sql
```

- [x] **Step 2: Build + Deploy**

```bash
npx astro build
npx wrangler deploy
```

Expected: 部署 URL 印出

- [x] **Step 3: 同步文章到 production**

```bash
pnpm sync:prod
```

- [x] **Step 4: 驗證線上版本**

- [x] 首頁顯示文章，分類 badge 顯示 `tech`
- [x] 文章頁內容完整
- [x] `/categories` 顯示分類
- [x] `/api/posts` 回傳 JSON

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: production deployment to Cloudflare Workers"
```

---

## 交付物確認

- [x] quidproquo.cc 部落格上線
- [x] 支援 16 個分類（`category: z.string()` 可隨時擴充）
- [x] post skill 可產生 tech 和通用兩種格式文章
- [x] `/api/posts` 支援 category 篩選
- [x] Build-time sync script 可把 markdown 同步到 D1

---

## 後續計畫

- **Plan B** (`2026-03-12-crawler-integration.md`)：Phase 3 爬蟲整合
- **Plan C** (`2026-03-12-rag-system.md`)：Phase 4 RAG 系統
