# Blog Redesign & Feature Expansion — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign quidproquo.cc with Editorial 雜誌風 + Forest brand colors and add all planned features in one pass.

**Architecture:** CSS design tokens defined in PostLayout's global style provide light/dark theming. Build-time utilities (reading time, related posts) are pure functions in `src/utils/`. All new article-page features are composed in `[...slug].astro` using data from Astro's `render()` API. Infrastructure features (RSS, sitemap, OG, search) are standalone Astro endpoints/integrations.

**Tech Stack:** Astro 6.x, @astrojs/cloudflare (SSR hybrid), MDX, Pagefind, @astrojs/rss, @astrojs/sitemap, Satori + @resvg/resvg-js

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/layouts/PostLayout.astro` | Modify | Global CSS tokens, nav redesign, dark mode toggle, progress bar script, SEO meta |
| `src/components/PostCard.astro` | Modify | Editorial card style — category badge, reading time, bottom-border separator |
| `src/components/Icons.astro` | Create | Inline SVG icon library (Search, Clock, ChevronLeft/Right, List, Link, Moon, Sun, BookOpen, Rss) |
| `src/utils/readingTime.ts` | Create | `getReadingTime(body: string): number` — words / 200 |
| `src/utils/relatedPosts.ts` | Create | `getRelatedPosts(post, allPosts, max)` — tag overlap scoring |
| `src/utils/seriesNav.ts` | Create | `getSeriesNav(post, allPosts)` — prev/next within same series |
| `src/pages/posts/[...slug].astro` | Modify | Article header, TOC, TL;DR, code copy script, progress bar, prev/next, related, series nav |
| `src/pages/index.astro` | Modify | Pass reading time to PostCard |
| `src/pages/en/index.astro` | Modify | Same as index.astro for EN locale |
| `src/pages/categories/[category].astro` | Modify | Pass reading time to PostCard |
| `src/pages/en/categories/[category].astro` | Modify | Same for EN |
| `src/i18n/ui.ts` | Modify | Add TOC, reading time, related articles, series, dark mode strings |
| `src/pages/rss.xml.ts` | Create | Static RSS feed endpoint |
| `src/pages/og/[slug].png.ts` | Create | Static OG image endpoint using Satori |
| `astro.config.mjs` | Modify | Add @astrojs/sitemap, Pagefind postbuild integration |
| `src/content.config.ts` | Modify | Add optional `series` field to post schema |

---

## Chunk 1: Foundation — CSS Tokens, Nav, PostCard, Homepage

### Task 1: Create Icons component

**Files:**
- Create: `src/components/Icons.astro`

- [ ] **Step 1: Create the Icons component**

```astro
---
// src/components/Icons.astro
// Usage: <Icons name="search" size={16} stroke="#555" />
interface Props {
  name: 'search' | 'clock' | 'chevron-left' | 'chevron-right' | 'list' | 'link' | 'moon' | 'sun' | 'book-open' | 'rss' | 'copy' | 'check';
  size?: number;
  stroke?: string;
  class?: string;
}
const { name, size = 16, stroke = 'currentColor', class: cls } = Astro.props;
const attrs = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''}`;
const paths: Record<string, string> = {
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  'list': '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  'sun': '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'rss': '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
  'copy': '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  'check': '<polyline points="20 6 9 12 4 10"/>',
};
---
<Fragment set:html={`<svg ${attrs}>${paths[name]}</svg>`} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Icons.astro
git commit -m "feat: add Icons component (SVG icon library)"
```

---

### Task 2: Add CSS design tokens to PostLayout

**Files:**
- Modify: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Replace PostLayout style block with Forest tokens + new nav**

Replace the entire `<style>` block and nav HTML in `PostLayout.astro`:

```astro
---
// src/layouts/PostLayout.astro  (frontmatter unchanged)
import { getLangFromUrl, useTranslations, type Lang } from '../i18n/utils';
import Icons from '../components/Icons.astro';

interface Props {
  title: string;
  description?: string;
  lang?: Lang;
  ogImage?: string;
}
const { title, description, lang: langProp, ogImage } = Astro.props;
const lang = langProp ?? getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const homeHref = lang === 'en' ? '/en' : '/';
const categoriesHref = lang === 'en' ? '/en/categories' : '/categories';
const tagsHref = lang === 'en' ? '/en/tags' : '/tags';
const switchHref = t('lang.switch.href');
const switchLabel = t('lang.switch');
const canonicalURL = new URL(Astro.url.pathname, Astro.site ?? 'https://quidproquo.cc');
---
<!DOCTYPE html>
<html lang={lang}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — quidproquo</title>
  <link rel="canonical" href={canonicalURL} />
  {description && <meta name="description" content={description} />}
  <meta property="og:title" content={`${title} — quidproquo`} />
  {description && <meta property="og:description" content={description} />}
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  {ogImage && <meta property="og:image" content={ogImage} />}
  <link rel="alternate" type="application/rss+xml" title="quidproquo RSS" href="/rss.xml" />
  <script is:inline>
    // Apply theme before page renders to avoid flash
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href={homeHref} class="logo">quidproquo</a>
      <a href={categoriesHref} class="nav-link">{t('nav.categories')}</a>
      <a href={tagsHref} class="nav-link">{t('nav.tags')}</a>
      <div class="nav-right">
        <a href="/search" class="nav-icon" aria-label={t('nav.search')}>
          <Icons name="search" size={16} />
        </a>
        <button class="theme-toggle" id="theme-toggle" aria-label={t('nav.toggle-theme')}>
          <span class="icon-light"><Icons name="sun" size={15} /></span>
          <span class="icon-dark"><Icons name="moon" size={15} /></span>
        </button>
        <a href={switchHref} class="lang-badge">{switchLabel}</a>
      </div>
      <div class="progress-bar" id="progress-bar"></div>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <span>quidproquo.cc</span>
    <a href="/rss.xml" class="rss-link" aria-label="RSS">
      <Icons name="rss" size={14} />
      <span>RSS</span>
    </a>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Add the full style block**

```astro
<style is:global>
  /* ── Forest Design Tokens ── */
  :root {
    --brand-900: #1a2e1a;
    --brand-700: #2d4a2d;
    --brand-500: #4a7c59;
    --brand-300: #a7c4a0;
    --brand-100: #e8f5e8;
    --brand-50:  #f0f7f0;
    --border:    #d1e8d1;
    --text-primary:    #1a1a1a;
    --text-secondary:  #4a7c59;
    --text-muted:      #a7c4a0;
    --bg-page:   #ffffff;
    --bg-subtle: #f0f7f0;

    /* Category badge colors */
    --cat-tech:      #1a1a1a;
    --cat-ai:        #6d28d9;
    --cat-product:   #0369a1;
    --cat-education: #b45309;
    --cat-life:      #15803d;
  }

  [data-theme="dark"] {
    --brand-900: #e8e8e8;
    --brand-700: #c0c0c0;
    --brand-500: #6aaa7f;
    --brand-300: #2d4a2d;
    --brand-100: #1e2e1e;
    --brand-50:  #1a231a;
    --border:    #2d3d2d;
    --text-primary:    #e8e8e8;
    --text-secondary:  #6aaa7f;
    --text-muted:      #555555;
    --bg-page:   #141414;
    --bg-subtle: #1a231a;
  }

  /* ── Reset & Base ── */
  *, *::before, *::after { box-sizing: border-box; }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    background: var(--bg-page);
    transition: background 0.2s, color 0.2s;
  }

  /* ── Nav ── */
  nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--brand-900);
    position: relative;
  }
  .logo {
    font-weight: 900;
    font-size: 1.05rem;
    letter-spacing: -0.5px;
    text-decoration: none;
    color: var(--brand-900);
  }
  .nav-link {
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--text-secondary);
  }
  .nav-link:hover { color: var(--brand-900); }
  .nav-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .nav-icon {
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }
  .nav-icon:hover { color: var(--brand-900); }

  /* Dark mode toggle */
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }
  .theme-toggle:hover { color: var(--brand-900); }
  .icon-dark { display: none; }
  [data-theme="dark"] .icon-light { display: none; }
  [data-theme="dark"] .icon-dark  { display: flex; }

  /* Language badge */
  .lang-badge {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    padding: 0.12rem 0.45rem;
    border-radius: 3px;
    text-decoration: none;
  }
  .lang-badge:hover { border-color: var(--brand-500); }

  /* Reading progress bar */
  .progress-bar {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0%;
    height: 2px;
    background: var(--brand-500);
    transition: width 0.1s linear;
  }

  /* ── Footer ── */
  footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  .rss-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.78rem;
  }
  .rss-link:hover { color: var(--brand-500); }

  /* ── Category badges (global, used in PostCard + slug page) ── */
  .cat-badge {
    font-size: 0.62rem;
    font-weight: 700;
    padding: 0.12rem 0.45rem;
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #fff;
    text-decoration: none;
  }
  .cat-tech      { background: var(--cat-tech); }
  .cat-ai        { background: var(--cat-ai); }
  .cat-product   { background: var(--cat-product); }
  .cat-education { background: var(--cat-education); }
  .cat-life      { background: var(--cat-life); }

  /* ── Tags ── */
  .tag-pill {
    background: var(--brand-100);
    font-size: 0.72rem;
    padding: 0.08rem 0.45rem;
    border-radius: 3px;
    color: var(--brand-700);
    text-decoration: none;
  }
  .tag-pill:hover { background: var(--brand-300); }
</style>

<script>
  // Dark mode toggle
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Reading progress bar (only on article pages)
  const bar = document.getElementById('progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) bar.style.width = `${(window.scrollY / max) * 100}%`;
    }, { passive: true });
  }
</script>
```

- [ ] **Step 3: Build and verify nav renders without errors**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/PostLayout.astro src/components/Icons.astro
git commit -m "feat: add Forest CSS tokens, Editorial nav, dark mode toggle, progress bar"
```

---

### Task 3: Redesign PostCard

**Files:**
- Modify: `src/components/PostCard.astro`

- [ ] **Step 1: Rewrite PostCard with Editorial style**

```astro
---
// src/components/PostCard.astro
import type { Lang } from '../i18n/utils';
import Icons from './Icons.astro';

interface Props {
  slug: string;
  title: string;
  date: Date;
  category: string;
  tags: string[];
  description?: string;
  tldr?: string;
  readingTime?: number;
  lang?: Lang;
}
const { slug, title, date, category, tags, description, tldr, readingTime, lang = 'zh-TW' } = Astro.props;
const excerpt = tldr || description || '';
const categoriesBase = lang === 'en' ? '/en/categories' : '/categories';
const tagsBase = lang === 'en' ? '/en/tags' : '/tags';
const dateStr = date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
---
<article>
  <div class="meta">
    <a href={`${categoriesBase}/${category}`} class={`cat-badge cat-${category}`}>{category}</a>
    <time datetime={date.toISOString()}>{dateStr}</time>
    {readingTime && (
      <span class="reading-time">
        <Icons name="clock" size={12} />
        {readingTime} min
      </span>
    )}
  </div>
  <h2><a href={`/posts/${slug}`}>{title}</a></h2>
  {excerpt && <p class="excerpt">{excerpt}</p>}
  {tags.length > 0 && (
    <div class="tags">
      {tags.map(tag => <a href={`${tagsBase}/${tag}`} class="tag-pill">#{tag}</a>)}
    </div>
  )}
</article>

<style>
  article {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
  }
  article:last-child { border-bottom: none; }
  .meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }
  time {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  .reading-time {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  h2 {
    margin: 0 0 0.4rem;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.2px;
    line-height: 1.3;
  }
  h2 a {
    text-decoration: none;
    color: var(--text-primary);
  }
  h2 a:hover { color: var(--brand-500); }
  .excerpt {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }
</style>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -10
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: PostCard Editorial redesign — category badge, reading time, bottom-border"
```

---

### Task 4: Reading time via remark plugin + schema field

**Context:** This project uses Astro 5's Content Layer API (`loader: glob()`). `post.body` is not available at runtime. The correct approach is a remark plugin that computes word count at parse time and injects `readingTime` into frontmatter data, making it available as `post.data.readingTime`.

**Files:**
- Create: `src/plugins/remarkReadingTime.ts`
- Modify: `src/content.config.ts`
- Modify: `astro.config.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/categories/[category].astro`
- Modify: `src/pages/en/categories/[category].astro`

- [ ] **Step 1: Create remark reading time plugin**

```typescript
// src/plugins/remarkReadingTime.ts
import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

const WPM = 200;

/**
 * Remark plugin: counts words in markdown and injects
 * `readingTime` (number of minutes) into frontmatter data.
 * Accessible as `post.data.readingTime` via Content Layer.
 */
export function remarkReadingTime() {
  return function (tree: Root, file: VFile) {
    const text = toString(tree);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / WPM));
    // Astro Content Layer reads from file.data.astro.frontmatter
    const fm = (file.data as Record<string, unknown>);
    if (!fm.astro) fm.astro = {};
    (fm.astro as Record<string, unknown>).frontmatter = {
      ...((fm.astro as Record<string, unknown>).frontmatter as object ?? {}),
      readingTime: minutes,
    };
  };
}
```

- [ ] **Step 2: Add readingTime to content schema**

In `src/content.config.ts`, add `readingTime` to the posts schema:

```typescript
// src/content.config.ts
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
    readingTime: z.number().optional(),
    series: z.object({
      name: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 3: Register plugin in astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';

export default defineConfig({
  site: 'https://quidproquo.cc',
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});
```

- [ ] **Step 4: Wire reading time into index.astro**

Replace `src/pages/index.astro` with:

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
      readingTime={post.data.readingTime}
      lang="zh-TW"
    />
  ))}
</PostLayout>

<style>
  h1 { margin-bottom: 0.25rem; font-size: 2rem; font-weight: 900; letter-spacing: -1px; color: var(--brand-900); }
  .subtitle { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem; }
</style>
```

- [ ] **Step 5: Apply same change to `src/pages/en/index.astro`**

Same as above but with `data.lang === 'en'` and `lang="en"` on PostLayout and PostCard.

- [ ] **Step 6: Apply same change to category pages**

In `src/pages/categories/[category].astro` and `src/pages/en/categories/[category].astro`, replace `readingTime={getReadingTime(post.body ?? '')}` with `readingTime={post.data.readingTime}` (no import needed).

- [ ] **Step 7: Build and verify reading times**

```bash
npm run build 2>&1 | tail -10
```
Expected: Build succeeds. No TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add src/plugins/remarkReadingTime.ts src/content.config.ts astro.config.mjs src/pages/index.astro src/pages/en/index.astro src/pages/categories/[category].astro src/pages/en/categories/[category].astro
git commit -m "feat: reading time via remark plugin, injected into post.data.readingTime"
```

---

### Task 5: Update i18n strings (Part 1 — nav & labels)

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Replace `src/i18n/ui.ts` with the full updated file**

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
    'nav.search': '搜尋',
    'nav.toggle-theme': '切換深色模式',
    'site.tagline': '技術、攀岩、衝浪、咖啡，以及其他一切。',
    'post.backtocategories': '← 所有分類',
    'post.backtotags': '← 所有標籤',
    'post.articles': '篇文章',
    'post.reading-time': '分鐘',
    'post.toc': '目錄',
    'post.series': '系列',
    'post.prev': '上一篇',
    'post.next': '下一篇',
    'post.related': '相關文章',
    'lang.switch': 'EN',
    'lang.switch.href': '/en',
  },
  en: {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'nav.search': 'Search',
    'nav.toggle-theme': 'Toggle dark mode',
    'site.tagline': 'Tech, climbing, surfing, coffee, and everything else.',
    'post.backtocategories': '← All categories',
    'post.backtotags': '← All tags',
    'post.articles': 'posts',
    'post.reading-time': 'min',
    'post.toc': 'Table of Contents',
    'post.series': 'Series',
    'post.prev': 'Previous',
    'post.next': 'Next',
    'post.related': 'Related',
    'lang.switch': '中文',
    'lang.switch.href': '/',
  },
} as const;

export type UiKey = keyof typeof ui['zh-TW'];
```

- [ ] **Step 2: Run type check**

```bash
npx astro check 2>&1 | tail -10
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat: i18n strings for nav, reading time, TOC, series, prev/next, related"
```

---

## Chunk 2: Article Page Features


### Task 7: Related posts and series nav utilities

**Files:**
- Create: `src/utils/relatedPosts.ts`
- Create: `src/utils/seriesNav.ts`

- [ ] **Step 1: Create related posts utility**

```typescript
// src/utils/relatedPosts.ts
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

/**
 * Returns up to `max` posts related to the given post by tag overlap.
 * Sorted by tag overlap count (desc), then date (desc).
 * Returns empty array if post has no tags.
 */
export function getRelatedPosts(post: Post, allPosts: Post[], max = 3): Post[] {
  if (!post.data.tags || post.data.tags.length === 0) return [];
  const tagSet = new Set(post.data.tags);
  return allPosts
    .filter(p => p.id !== post.id && p.data.lang === post.data.lang)
    .map(p => ({
      post: p,
      overlap: p.data.tags.filter(t => tagSet.has(t)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, max)
    .map(({ post: p }) => p);
}
```

- [ ] **Step 2: Create series nav utility**

```typescript
// src/utils/seriesNav.ts
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export interface SeriesNav {
  name: string;
  current: number;
  total: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

/**
 * Returns series navigation data if the post belongs to a series.
 * Returns undefined if post has no series frontmatter.
 */
export function getSeriesNav(post: Post, allPosts: Post[]): SeriesNav | undefined {
  if (!post.data.series) return undefined;
  const { name, order } = post.data.series;
  const seriesPosts = allPosts
    .filter(p => p.data.series?.name === name)
    .sort((a, b) => a.data.series!.order - b.data.series!.order);
  const total = seriesPosts.length;
  const prevPost = seriesPosts.find(p => p.data.series!.order === order - 1);
  const nextPost = seriesPosts.find(p => p.data.series!.order === order + 1);
  return {
    name,
    current: order,
    total,
    prev: prevPost ? { slug: prevPost.id, title: prevPost.data.title } : undefined,
    next: nextPost ? { slug: nextPost.id, title: nextPost.data.title } : undefined,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/relatedPosts.ts src/utils/seriesNav.ts
git commit -m "feat: related posts and series nav utilities"
```

---

### Task 8: Redesign article page

**Files:**
- Modify: `src/pages/posts/[...slug].astro`

- [ ] **Step 1: Rewrite the article page**

```astro
---
// src/pages/posts/[...slug].astro
export const prerender = true;

import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import Icons from '../../components/Icons.astro';
import { getRelatedPosts } from '../../utils/relatedPosts';
import { getSeriesNav } from '../../utils/seriesNav';
import { useTranslations, type Lang } from '../../i18n/utils';

export async function getStaticPaths() {
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);
  return allPosts.map(post => ({
    params: { slug: post.id },
    props: { post, allPosts },
  }));
}

const { post, allPosts } = Astro.props;
const { Content, headings } = await render(post);
const lang = post.data.lang as Lang;
const t = useTranslations(lang);

const sortedPosts = allPosts
  .filter(p => !p.data.draft && p.data.lang === lang)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const currentIndex = sortedPosts.findIndex(p => p.id === post.id);
const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : undefined;
const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined;

const relatedPosts = getRelatedPosts(post, allPosts);
const seriesNav = getSeriesNav(post, allPosts);
const readingTime = post.data.readingTime ?? 1;
const categoriesBase = lang === 'en' ? '/en/categories' : '/categories';
const tagsBase = lang === 'en' ? '/en/tags' : '/tags';
const dateStr = post.data.date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });

const ogImage = `${Astro.site ?? 'https://quidproquo.cc'}/og/${post.id}.png`;
---
<PostLayout
  title={post.data.title}
  description={post.data.description ?? post.data.tldr}
  lang={lang}
  ogImage={ogImage}
>
  <article>
    <header>
      <!-- Back + category -->
      <div class="back-row">
        <a href={lang === 'en' ? '/en' : '/'} class="back-link">
          <Icons name="chevron-left" size={14} />
          {t('nav.home')}
        </a>
        <span class="sep">·</span>
        <a href={`${categoriesBase}/${post.data.category}`} class={`cat-badge cat-${post.data.category}`}>
          {post.data.category}
        </a>
      </div>

      <!-- Title -->
      <h1>{post.data.title}</h1>

      <!-- Meta -->
      <div class="article-meta">
        <time datetime={post.data.date.toISOString()}>{dateStr}</time>
        <span class="sep">·</span>
        <span class="reading-time">
          <Icons name="clock" size={13} />
          {readingTime} {t('post.reading-time')}
        </span>
      </div>

      <!-- TL;DR -->
      {post.data.tldr && (
        <div class="tldr">
          <span class="tldr-label">TL;DR</span>
          {post.data.tldr}
        </div>
      )}

      <!-- Tags -->
      {post.data.tags.length > 0 && (
        <div class="tags">
          {post.data.tags.map(tag => (
            <a href={`${tagsBase}/${tag}`} class="tag-pill">#{tag}</a>
          ))}
        </div>
      )}

      <!-- TOC -->
      {headings.length > 0 && (
        <div class="toc">
          <div class="toc-header">
            <Icons name="list" size={14} />
            <span>{t('post.toc')}</span>
          </div>
          <ol>
            {headings.filter(h => h.depth === 2).map(h => (
              <li>
                <a href={`#${h.slug}`}>{h.text}</a>
                {headings.filter(sub => sub.depth === 3 && headings.findIndex(x => x.slug === h.slug) < headings.findIndex(x => x.slug === sub.slug) && (headings.findIndex(x => x.depth === 2 && headings.indexOf(x) > headings.findIndex(y => y.slug === h.slug)) === -1 || headings.findIndex(x => x.depth === 2 && headings.indexOf(x) > headings.findIndex(y => y.slug === h.slug)) > headings.findIndex(x => x.slug === sub.slug))).length > 0 && (
                  <ol>
                    {headings.filter(sub => {
                      if (sub.depth !== 3) return false;
                      const h2idx = headings.findIndex(x => x.slug === h.slug);
                      const subidx = headings.findIndex(x => x.slug === sub.slug);
                      if (subidx < h2idx) return false;
                      const nextH2 = headings.findIndex((x, i) => x.depth === 2 && i > h2idx);
                      return nextH2 === -1 || subidx < nextH2;
                    }).map(sub => (
                      <li><a href={`#${sub.slug}`}>{sub.text}</a></li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <!-- Series nav -->
      {seriesNav && (
        <div class="series-box">
          <div class="series-header">
            <Icons name="book-open" size={14} />
            <span>{t('post.series')}: {seriesNav.name} ({seriesNav.current} / {seriesNav.total})</span>
          </div>
          <div class="series-nav">
            {seriesNav.prev ? (
              <a href={`/posts/${seriesNav.prev.slug}`} class="series-prev">
                <Icons name="chevron-left" size={12} />
                {seriesNav.prev.title}
              </a>
            ) : <span />}
            {seriesNav.next && (
              <a href={`/posts/${seriesNav.next.slug}`} class="series-next">
                {seriesNav.next.title}
                <Icons name="chevron-right" size={12} />
              </a>
            )}
          </div>
        </div>
      )}
    </header>

    <!-- Content -->
    <div class="content">
      <Content />
    </div>

    <!-- Prev / Next -->
    {(prevPost || nextPost) && (
      <nav class="post-nav">
        {prevPost ? (
          <a href={`/posts/${prevPost.id}`} class="post-nav-prev">
            <span class="post-nav-label">
              <Icons name="chevron-left" size={13} />
              {t('post.prev')}
            </span>
            <span class="post-nav-title">{prevPost.data.title}</span>
          </a>
        ) : <span />}
        {nextPost && (
          <a href={`/posts/${nextPost.id}`} class="post-nav-next">
            <span class="post-nav-label">
              {t('post.next')}
              <Icons name="chevron-right" size={13} />
            </span>
            <span class="post-nav-title">{nextPost.data.title}</span>
          </a>
        )}
      </nav>
    )}

    <!-- Related articles -->
    {relatedPosts.length > 0 && (
      <section class="related">
        <h3>
          <Icons name="link" size={14} />
          {t('post.related')} · #{post.data.tags[0]}
        </h3>
        <div class="related-list">
          {relatedPosts.map(p => (
            <a href={`/posts/${p.id}`} class="related-item">
              <span class="related-title">{p.data.title}</span>
              <span class="related-time">
                <Icons name="clock" size={11} />
                {p.data.readingTime ?? 1} min
              </span>
            </a>
          ))}
        </div>
      </section>
    )}
  </article>
</PostLayout>
```

- [ ] **Step 2: Add article-specific styles**

```astro
<style>
  /* Back row */
  .back-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.78rem; }
  .back-link { display: flex; align-items: center; gap: 0.2rem; color: var(--text-secondary); text-decoration: none; }
  .back-link:hover { color: var(--brand-500); }
  .sep { color: var(--brand-300); }

  /* Title */
  h1 { font-size: 1.7rem; font-weight: 900; letter-spacing: -0.5px; line-height: 1.2; margin: 0 0 0.75rem; color: var(--brand-900); }

  /* Meta */
  .article-meta { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem; }
  .reading-time { display: flex; align-items: center; gap: 0.25rem; }

  /* TL;DR */
  .tldr { background: var(--bg-subtle); border-left: 3px solid var(--brand-500); padding: 0.75rem 1rem; border-radius: 0 6px 6px 0; margin-bottom: 1rem; font-size: 0.88rem; line-height: 1.6; color: var(--text-primary); }
  .tldr-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--brand-500); font-weight: 700; display: block; margin-bottom: 0.3rem; }

  /* Tags */
  .tags { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1.25rem; }

  /* TOC */
  .toc { border: 1px solid var(--border); border-radius: 6px; padding: 1rem; background: var(--bg-subtle); margin-bottom: 1.5rem; }
  .toc-header { display: flex; align-items: center; gap: 0.4rem; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); margin-bottom: 0.6rem; }
  .toc ol { padding-left: 1.2rem; margin: 0; font-size: 0.83rem; line-height: 1.9; color: var(--brand-700); }
  .toc ol ol { font-size: 0.78rem; color: var(--text-secondary); }
  .toc a { color: inherit; text-decoration: none; }
  .toc a:hover { color: var(--brand-500); }

  /* Series box */
  .series-box { border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem 1rem; background: var(--bg-subtle); margin-bottom: 1.5rem; }
  .series-header { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem; }
  .series-nav { display: flex; justify-content: space-between; font-size: 0.8rem; }
  .series-prev, .series-next { display: flex; align-items: center; gap: 0.25rem; color: var(--brand-500); text-decoration: none; }
  .series-prev:hover, .series-next:hover { color: var(--brand-900); }

  /* Content */
  .content { line-height: 1.8; margin-bottom: 3rem; }
  .content h2 { font-size: 1.3rem; font-weight: 800; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); color: var(--brand-900); }
  .content h3 { font-size: 1.05rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: var(--brand-900); }
  .content p { margin-bottom: 1rem; }
  .content a { color: var(--brand-500); }
  .content a:hover { color: var(--brand-900); }
  .content pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 6px; overflow-x: auto; position: relative; }
  .content :not(pre) > code { background: var(--brand-100); color: var(--brand-700); padding: 0.1em 0.35em; border-radius: 3px; font-size: 0.9em; }
  .content blockquote { border-left: 3px solid var(--brand-300); padding-left: 1rem; color: var(--text-secondary); margin: 1rem 0; font-style: italic; }

  /* Post nav */
  .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
  .post-nav-prev, .post-nav-next { border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; text-decoration: none; color: var(--text-primary); transition: border-color 0.15s; }
  .post-nav-prev:hover, .post-nav-next:hover { border-color: var(--brand-500); }
  .post-nav-next { text-align: right; }
  .post-nav-label { display: flex; align-items: center; gap: 0.25rem; font-size: 0.68rem; color: var(--text-muted); margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .post-nav-next .post-nav-label { justify-content: flex-end; }
  .post-nav-title { font-size: 0.85rem; font-weight: 600; line-height: 1.3; display: block; }

  /* Related */
  .related h3 { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 0.85rem; }
  .related-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .related-item { display: flex; justify-content: space-between; align-items: baseline; padding: 0.65rem 0.8rem; border: 1px solid var(--border); border-radius: 6px; text-decoration: none; color: var(--text-primary); transition: border-color 0.15s; }
  .related-item:hover { border-color: var(--brand-500); }
  .related-title { font-size: 0.88rem; font-weight: 600; line-height: 1.3; }
  .related-time { display: flex; align-items: center; gap: 0.2rem; font-size: 0.72rem; color: var(--text-muted); flex-shrink: 0; margin-left: 0.75rem; }
</style>
```

- [ ] **Step 3: Add code copy button script**

```astro
<script>
  // Attach copy buttons to all pre blocks in article content
  document.querySelectorAll('.content pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText ?? pre.innerText;
      await navigator.clipboard.writeText(code);
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
      }, 2000);
    });
    pre.appendChild(btn);
  });
</script>

<style is:global>
  .copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #333;
    color: #aaa;
    border: none;
    border-radius: 3px;
    padding: 0.2rem 0.5rem;
    font-size: 0.68rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.15s;
  }
  .copy-btn:hover { color: #fff; }
</style>
```

- [ ] **Step 4: Build and verify article page**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/posts/[...slug].astro src/utils/relatedPosts.ts src/utils/seriesNav.ts
git commit -m "feat: article page redesign — TOC, TL;DR, code copy, prev/next, related articles, series nav"
```

---


## Chunk 3: Infrastructure — RSS, Sitemap, SEO, OG Images, Search

### Task 10: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Install @astrojs/rss**

```bash
npm install @astrojs/rss
```

- [ ] **Step 2: Create RSS endpoint**

```typescript
// src/pages/rss.xml.ts
export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) =>
    !data.draft && data.lang === 'zh-TW'
  );
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: 'quidproquo',
    description: '技術、攀岩、衝浪、咖啡，以及其他一切。',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.tldr ?? post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>zh-TW</language>',
  });
}
```

- [ ] **Step 3: Build and verify RSS file generated**

```bash
npm run build && ls dist/rss.xml
```
Expected: `dist/rss.xml` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/rss.xml.ts package.json package-lock.json
git commit -m "feat: RSS feed at /rss.xml"
```

---

### Task 11: Sitemap

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install @astrojs/sitemap**

```bash
npm install @astrojs/sitemap
```

- [ ] **Step 2: Add sitemap integration to existing astro.config.mjs**

Open `astro.config.mjs` and make two additive changes (do NOT replace the whole file):

1. Add import at top: `import sitemap from '@astrojs/sitemap';`
2. Add `sitemap()` to the `integrations` array alongside the existing `mdx()` entry

The resulting integrations array should look like:
```javascript
integrations: [
  mdx(),
  sitemap(),
  // (Pagefind hook added in Task 13)
],
```

- [ ] **Step 3: Build and verify sitemap**

```bash
npm run build && ls dist/sitemap*.xml
```
Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: sitemap via @astrojs/sitemap, add site URL to config"
```

---

### Task 12: OG Image generation

**Files:**
- Create: `src/pages/og/[slug].png.ts`

- [ ] **Step 1: Install Satori and resvg**

```bash
npm install satori @resvg/resvg-js
```

- [ ] **Step 2: Download Noto Sans TC TTF font for CJK support**

Satori requires a raw OTF/TTF font buffer — woff2 is **not** supported. Posts have zh-TW titles, so a CJK font is required.

```bash
mkdir -p public/fonts
# Download Noto Sans TC Medium TTF from Noto CJK releases
curl -L "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/TraditionalChinese/NotoSansTC-Medium.otf" \
  -o public/fonts/NotoSansTC-Medium.otf
```

If the above URL is unavailable, download `NotoSansTC-Medium.otf` from the official Noto CJK GitHub releases page and place it at `public/fonts/NotoSansTC-Medium.otf`.

- [ ] **Step 3: Create OG image endpoint**

```typescript
// src/pages/og/[slug].png.ts
export const prerender = true;

import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
    },
  }));
}

// Load font once at module level (build time only)
const fontPath = resolve('public/fonts/NotoSansTC-Medium.otf');
const fontData = readFileSync(fontPath);

// Category badge colors (matches spec §3)
const catColors: Record<string, string> = {
  tech: '#1a1a1a',
  ai: '#6d28d9',
  product: '#0369a1',
  education: '#b45309',
  life: '#15803d',
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category } = props as { title: string; category: string };
  const badgeColor = catColors[category] ?? '#1a2e1a';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          background: '#ffffff',
          padding: '60px 80px',
          fontFamily: 'Noto Sans TC',
          borderTop: '6px solid #1a2e1a',
        },
        children: [
          {
            type: 'span',
            props: {
              style: {
                background: badgeColor,
                color: '#fff',
                fontSize: '18px',
                fontWeight: 500,
                padding: '4px 14px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              children: category,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 40 ? '48px' : '58px',
                fontWeight: 500,
                color: '#1a1a1a',
                lineHeight: 1.25,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '26px', color: '#4a7c59', fontWeight: 500 },
              children: 'quidproquo.cc',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans TC',
          data: fontData,
          weight: 500,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
  });
};
```

- [ ] **Step 4: Build and verify OG images**

```bash
npm run build && ls dist/og/
```
Expected: Subdirectories named by category (e.g. `dist/og/tech/`, `dist/og/ai/`) containing PNG files per post.

- [ ] **Step 5: Commit**

```bash
git add src/pages/og/[slug].png.ts public/fonts/NotoSansTC-Medium.otf package.json package-lock.json
git commit -m "feat: OG image generation via Satori, CJK font support"
```

---

### Task 13: Pagefind search

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/pages/search.astro`

- [ ] **Step 1: Install Pagefind**

```bash
npm install -D pagefind
```

- [ ] **Step 2: Add Pagefind postbuild hook to astro.config.mjs**

```javascript
// Add to defineConfig integrations array:
{
  name: 'pagefind',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { execSync } = await import('child_process');
      execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
    },
  },
},
```

- [ ] **Step 3: Add head slot to PostLayout**

PostLayout needs a `<slot name="head">` inside `<head>` so pages can inject CSS links. Add this line inside the `<head>` block of `src/layouts/PostLayout.astro`, just before `</head>`:

```astro
  <slot name="head" />
</head>
```

- [ ] **Step 4: Create search page**

```astro
---
// src/pages/search.astro
export const prerender = true;
import PostLayout from '../layouts/PostLayout.astro';
import { useTranslations } from '../i18n/utils';
const t = useTranslations('zh-TW');
---
<PostLayout title={t('nav.search')} lang="zh-TW">
  <Fragment slot="head">
    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
  </Fragment>
  <h1>{t('nav.search')}</h1>
  <div id="search"></div>
</PostLayout>

<script src="/pagefind/pagefind-ui.js" is:inline></script>
<script is:inline>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: '#search', showImages: false });
  });
</script>
```

- [ ] **Step 5: Build and verify Pagefind index**

```bash
npm run build && ls dist/pagefind/
```
Expected: `pagefind.js`, `pagefind-ui.js`, `pagefind-ui.css`, and index files.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs src/layouts/PostLayout.astro src/pages/search.astro package.json package-lock.json
git commit -m "feat: Pagefind static search at /search"
```

---

### Task 14: Final build verification

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist && npm run build 2>&1
```
Expected: Build completes with no errors. Summary shows pages for `/`, `/search`, `/rss.xml`, `/sitemap-index.xml`, `/og/*.png`.

- [ ] **Step 2: Preview locally**

```bash
npm run preview
```
Open http://localhost:4321 and verify:
- [ ] Homepage shows Editorial style, Forest colors
- [ ] Dark mode toggle works and persists
- [ ] Article page shows TOC, TL;DR, reading time, code copy button, prev/next, related articles
- [ ] Search page loads and returns results
- [ ] /rss.xml is valid XML
- [ ] /og/[any-post-id].png returns an image

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete blog redesign — Editorial style, Forest brand, all features"
```
