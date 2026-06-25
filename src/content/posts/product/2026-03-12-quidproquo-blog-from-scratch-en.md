---
title: "Building a Low-Friction Blog from Scratch with Astro + Cloudflare Workers"
date: 2026-03-12
type: project
tldr: "To consolidate scattered notes and showcase diverse interests, I built a personal blog using Astro + Cloudflare Workers D1, paired with a Claude post skill for zero-friction writing."
category: product
tags: [astro, cloudflare, d1, claude-code, blog]
lang: en
description: "Why I built quidproquo.cc, how I chose the tech stack, and how the post skill eliminates writing friction"
draft: false
pinned: true
---

> 🌏 [中文版](/posts/product/2026-03-12-quidproquo-blog-from-scratch)

## Why Build This

I have a habit of documenting problems I've solved, but these notes end up scattered across my local machine, Notion, and GitHub issues. A few months later, they're practically impossible to find.

I also wanted a place to showcase breadth -- not just tech, but climbing, surfing, film, and coffee. A resume can't hold all of that, and LinkedIn is too formal.

So the requirement was: **a place where anything goes, with zero friction to write.**

## The Name

Quid pro quo is Latin for "something for something" -- an equal exchange.

Two anime series touched on this concept, each from a different angle.

In Attack on Titan, Armin says:

> Those who can't sacrifice anything can never change anything.

To defeat monsters, sometimes you must abandon your own humanity. This speaks to the price that agents of change must bear in extreme circumstances.

In Fullmetal Alchemist, Alphonse says:

> To obtain something, you must give up something of equal value. That is alchemy's principle of Equivalent Exchange. Back then, we believed that was the truth of the world.

But by the end, he elevates the idea: **If you receive ten, add your own goodwill and return eleven to the world.**

This breaks the cold calculus of equivalence, bringing forth the power of mutual aid, selflessness, and love.

I identify with this direction -- documentation isn't just about archiving; it's about transforming experience into something useful for others, and then giving a little extra. That's how the name was decided.

## Why Not Use an Existing Platform

I've tried Notion, Medium, and Substack. The problem is that they all have friction: switching windows, logging in, adapting to their editors. After solving a problem, the impulse to "write it down" doesn't survive these steps.

More importantly, this blog is itself a portfolio piece -- a full-stack application running on Cloudflare. That's what makes it interesting.

## Tech Choices

**Astro 6**: Content-oriented, excellent Cloudflare integration, and clean article management via Content Collections. I didn't choose Next.js because it's heavier than what I need.

**Cloudflare Workers**: Static assets and server-side logic on the same platform -- no hosting management needed.

**Cloudflare D1**: A derived database for articles. Markdown is the source of truth; D1 is a copy that syncs automatically at build time, paving the way for Phase 4's RAG search.

**Hybrid Rendering**: Article pages use `prerender = true` (static, fast, SEO-friendly), while API endpoints use SSR.

## Core Design: The Post Skill

The most important part of the entire architecture isn't the database design -- it's the **post skill**.

By placing a skill in `.claude/skills/post/` for the Claude Code CLI, after solving a problem I just say "write a post" and it will:

1. Determine the category (tech / climbing / film / ...)
2. Apply the corresponding template
3. Fill in the frontmatter
4. Save to `src/content/posts/<category>/`
5. Commit

The entire process takes less than a minute with no window switching. That's what "zero friction" means.

## Dual-Path Architecture

Markdown is the sole source of truth; D1 is the derived copy.

```
post skill generates .md
        |
+-------+-------+
|               |
v               v
Static blog     D1 database
(readers view   (for future
 articles)       RAG search)
```

If D1 breaks, it can be fully rebuilt from `.md` files. Nothing is irreversible.

## Current Status

Phase 1+2 complete:

- Astro 6 + Cloudflare Workers deployment
- Content Collections + i18n (zh-TW / en)
- Homepage, article pages, category pages, tag pages
- D1 schema + build-time sync
- Post skill

This article itself was generated using the post skill.

## What's Next

- Phase 3: Use Cloudflare Browser Rendering to periodically crawl technical documentation
- Phase 4: Vectorize + Workers AI for RAG search

The priority is establishing the writing habit first; everything else can be added later.

## References

- [Astro Documentation](https://docs.astro.build/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Astro Blog Template Setup Guide](/posts/tech/guide/2026-03-12-astro-blog-template-guide)
- [Tools Behind This Blog](/posts/tech/guide/2026-03-12-tools-behind-this-blog)
- [Cloudflare Workers Custom Domain Debugging](/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain)
- [Astro + Cloudflare Native Module Issue](/posts/tech/debug/2026-03-13-astro-cloudflare-native-module)
