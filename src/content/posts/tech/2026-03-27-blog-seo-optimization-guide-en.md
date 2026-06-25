---
title: "A Complete Guide to Blog SEO — From Meta Tags to Structured Data"
date: 2026-03-27
category: tech
tags: [seo, astro, structured-data, json-ld, open-graph, blog]
lang: en
tldr: "SEO is more than keywords. Structured data (JSON-LD), Open Graph, hreflang, and robots.txt are the technical optimizations that actually help search engines understand your content. This guide walks through a complete implementation using an Astro blog as the example."
description: "Using an Astro blog as a practical example, this guide covers the full spectrum of technical SEO: JSON-LD structured data, Open Graph meta tags, hreflang for multilingual sites, robots.txt, Sitemap, and more — with complete code samples throughout."
draft: false
type: guide
---

🌏 [中文版](/posts/tech/2026-03-27-blog-seo-optimization-guide)

The core goal of technical SEO is simple: **help search engines understand your content at the lowest possible cost**. This guide uses an Astro static blog as a concrete example and walks through everything from meta tags to structured data. By the end, you'll know what each optimization does and why it matters.

## How Search Engines See Your Page

Search engine crawlers (Googlebot, Bingbot, etc.) don't see your carefully designed UI — they see raw HTML. They rely on:

1. **Semantic HTML elements** (`<h1>`, `<article>`, `<nav>`) to infer page structure
2. **Meta tags** (`<meta name="description">`) for page summaries
3. **Structured data** (JSON-LD) to precisely understand content type and attributes
4. **robots.txt / Sitemap** to know what to crawl and what to skip

If your page has beautiful CSS but a messy HTML structure and missing meta information, search engines are left guessing — and they guess wrong more often than you'd expect.

## Meta Tags: The Basics That Are Easiest to Overlook

### Title and Description

```html
<title>A Complete Guide to Blog SEO — quidproquo</title>
<meta name="description" content="Using an Astro blog as a practical example..." />
<link rel="canonical" href="https://quidproquo.cc/posts/tech/2026-03-27-blog-seo-optimization-guide" />
```

- **Title**: The blue headline in Google search results — keep it under 60 characters
- **Description**: The gray summary snippet in search results — keep it under 155 characters
- **Canonical**: Tells search engines "this is the authoritative URL for this page," preventing duplicate content issues

In Astro, these are typically handled centrally in a Layout component:

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

### Open Graph (Social Sharing)

Open Graph is a meta standard originally created by Facebook. Today virtually every social platform — Twitter, LINE, Slack, Discord — supports it:

```html
<meta property="og:title" content="A Complete Guide to Blog SEO" />
<meta property="og:description" content="Using an Astro blog as a practical example..." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://quidproquo.cc/posts/..." />
<meta property="og:image" content="https://quidproquo.cc/og/post.png" />
<meta property="og:locale" content="en_US" />
```

**Key point**: The `og:type` for post pages should be `article`, not `website`. This isn't just a semantic nicety — it unlocks article-specific meta tags:

```html
<meta property="article:published_time" content="2026-03-27T00:00:00.000Z" />
<meta property="article:author" content="xiaoxu" />
<meta property="article:tag" content="seo" />
<meta property="article:tag" content="astro" />
```

### Automated OG Image Generation

Manually creating an OG image for every post isn't realistic. You can use [Satori](https://github.com/vercel/satori) + [Resvg](https://github.com/nicolo-ribaudo/resvg-js) to generate images automatically at build time:

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

1200x630 is the optimal size for social platforms.

## JSON-LD Structured Data

JSON-LD is the highest priority item in technical SEO. It removes the guesswork for search engines — you're telling them directly what your content is:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "A Complete Guide to Blog SEO",
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

### Common Schema Types

| Schema | Used On | Effect |
|--------|---------|--------|
| `BlogPosting` | Post pages | Google can display publish date and author in search results |
| `BreadcrumbList` | Breadcrumb navigation | Search results show the page path |
| `WebSite` | Homepage | Enables Sitelinks Search Box |
| `FAQPage` | FAQ pages | Search results expand Q&A inline |
| `HowTo` | Tutorial posts | Search results display step lists |

### BreadcrumbList Example

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://quidproquo.cc" },
    { "@type": "ListItem", "position": 2, "name": "tech", "item": "https://quidproquo.cc/categories/tech" },
    { "@type": "ListItem", "position": 3, "name": "A Complete Guide to Blog SEO", "item": "https://quidproquo.cc/posts/..." }
  ]
}
```

### WebSite + SearchAction

Adding a `WebSite` schema to your homepage gives Google a chance to display a sitelinks search box directly in search results:

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

### Security Considerations

When injecting JSON-LD in Astro using `set:html`, guard against XSS:

```astro
<script type="application/ld+json"
  set:html={JSON.stringify(data).replace(/</g, '\\u003c')}
/>
```

`JSON.stringify` does not escape `</script>`. If a post title contains that string, it will break your HTML structure. The `.replace(/</g, '\\u003c')` pattern is the standard mitigation.

## Multilingual SEO: hreflang

If your site has multiple language versions, hreflang is how you tell search engines that these pages are different language variants of the same content:

```html
<link rel="alternate" hreflang="zh-TW" href="https://quidproquo.cc/" />
<link rel="alternate" hreflang="en" href="https://quidproquo.cc/en/" />
<link rel="alternate" hreflang="x-default" href="https://quidproquo.cc/" />
```

- Every language version must include hreflang tags for **all versions** (including itself)
- `x-default` points to the fallback language used when no language match is found
- hreflang must be **bidirectional**: if A points to B, then B must also point to A

### Multilingual RSS Feeds

Don't forget to create a separate RSS feed for each language:

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

## robots.txt and Sitemap

### robots.txt

Place this in the site root to give crawlers their basic instructions:

```
User-agent: *
Allow: /

Sitemap: https://quidproquo.cc/sitemap-index.xml
```

Keep it simple. If there are pages you don't want indexed (admin panels, API endpoints), exclude them with `Disallow`.

### Sitemap

Astro's `@astrojs/sitemap` integration generates a sitemap automatically. Make sure `site` is configured in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://quidproquo.cc',
  integrations: [sitemap()],
});
```

## SEO Checklist

Before publishing each post, verify:

- [ ] Has a `<title>` within 60 characters
- [ ] Has `<meta name="description">` within 155 characters
- [ ] Has `<link rel="canonical">`
- [ ] `og:type` is `article` (post pages) or `website` (homepage)
- [ ] Has an OG image (1200x630)
- [ ] Has JSON-LD `BlogPosting` structured data
- [ ] Has JSON-LD `BreadcrumbList`
- [ ] Multilingual pages have hreflang tags
- [ ] `robots.txt` exists and points to the sitemap
- [ ] Validated with [Google Rich Results Test](https://search.google.com/test/rich-results)

## The Big Picture

Technical SEO is a one-time investment: set it up in your Layout and build pipeline, and every future post benefits automatically. Priority order: **JSON-LD structured data > Open Graph > hreflang > robots.txt**. Structured data has the biggest impact because it directly determines how precisely search engines can understand your content.

You don't need to chase perfection — getting the three core schemas right (BlogPosting, BreadcrumbList, WebSite) already puts you ahead of 90% of personal blogs out there.

---

## References

- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data)
- [Schema.org - BlogPosting](https://schema.org/BlogPosting)
- [Open Graph Protocol](https://ogp.me/)
- [Google - hreflang Tag Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [A Developer's Guide to Implementing JSON-LD Structured Data for Better Technical SEO](https://dev.to/dheeraj_jain/a-developers-guide-to-implementing-json-ld-structured-data-for-better-technical-seo-nmg)
- [Satori - OG Image Generator](https://github.com/vercel/satori)
