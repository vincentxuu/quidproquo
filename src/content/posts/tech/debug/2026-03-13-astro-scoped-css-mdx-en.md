---
title: "Astro Scoped CSS Not Applied to MDX-Rendered Content"
date: 2026-03-13
category: tech
tags: [astro, css, mdx]
lang: en
tldr: "Astro scoped CSS appends a scope hash to each selector, but elements rendered by <Content /> don't receive that hash — causing all prose styles to silently break."
description: "A debugging note on Astro's scope hash mechanism and why scoped styles don't apply to MDX content rendered via <Content />."
draft: false
type: debug
---

🌏 [中文版](/posts/tech/debug/2026-03-13-astro-scoped-css-mdx)

## TL;DR

Astro scoped CSS has no effect on MDX HTML rendered by `<Content />`. The fix is to move prose styles into `<style is:global>`.

## Context

I wrote a set of prose styles in the blog post page `[...slug].astro` to uniformly style the `h2`, `pre`, `table`, and `blockquote` elements that MDX renders:

```css
.content pre { background: #1e1e1e; padding: 1.5rem; position: relative; }
.content h2 { font-size: 1.3rem; border-bottom: 1px solid var(--border); }
```

I also added a Copy button that JavaScript appends to each `pre` block, with CSS positioning it via `position: absolute; top: 0.5rem; right: 0.5rem`.

## The Problem

- Changes to the code block padding had no effect
- `h2` styles weren't applied
- The Copy button jumped to the top-right corner of the page, pinned next to the nav

## Why This Happens

Astro's `<style>` blocks are scoped. During compilation, each selector gets a component-specific scope hash appended to it:

```css
/* What you write */
.content pre { position: relative; }

/* What Astro compiles to */
.content pre[data-astro-cid-abc123] { position: relative; }
```

At the same time, HTML elements directly produced by that component receive the matching attribute:

```html
<div class="content" data-astro-cid-abc123>...</div>
```

The issue is that MDX HTML rendered by `<Content />` is inserted dynamically — Astro **does not** add `data-astro-cid-abc123` to those elements, so the scoped selectors never match them.

The Copy button drifting to the nav has the same root cause: without a `position: relative` ancestor on `pre`, the absolutely-positioned button walks up the DOM until it finds one — which happens to be the nav — and anchors itself there.

## The Fix

Move all prose styles inside `.content` into `<style is:global>`. I placed them in the layout so they're managed in one place:

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

I put them in the layout rather than the page because prose styles aren't page-specific — they're site-wide styles for rendering Markdown content.

## What I Learned

Any HTML that's inserted dynamically — via `<Content />`, `set:html`, or slot content passed in from outside — will not carry a scope hash. Scoped CSS simply has no effect on it.

## References

- [Astro Scoped Styles docs](https://docs.astro.build/en/guides/styling/#scoped-styles)
- [Astro `is:global` directive](https://docs.astro.build/en/reference/directives-reference/#isglobal)
- [Astro MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
