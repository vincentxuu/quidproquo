---
title: "The Research Toolkit Trifecta: Google Scholar to Find, Moonlight to Read, CorTeX to Write"
date: 2026-09-15
category: learning
type: guide
tags: [academic-research, paper-reading, paper-writing, ai-tools, google-scholar, moonlight, cortex, latex]
lang: en
tldr: "Break the research workflow into three actions — find, read, write — and pick one tool for each: Google Scholar for discovery, Moonlight AI for reading comprehension, and CorTeX for collaborative writing. All three offer free tiers and together cover the full pipeline from literature search to manuscript submission."
description: "A guide to streamlining academic research with Google Scholar, Moonlight, and CorTeX — three tools that cover finding, reading, and writing papers."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-15-academic-tools-find-read-write)

The daily life of a researcher boils down to three actions: find papers, read papers, write papers. There are countless tools for each step, which is exactly why it's hard to know where to start.

This post covers three tools — one per action — that chain together into a pipeline from search to submission.

---

## Find Papers: Google Scholar

[Google Scholar](https://scholar.google.com/) is Google's academic search engine, indexing journal articles, conference papers, preprints, theses, book chapters, and patents.

### Why It's Still the First Stop

- **Broadest coverage**: crosses publishers and disciplines — Springer, IEEE, ACM, arXiv, PubMed, and more in a single search
- **Citation tracking**: every paper shows its citation count; click through to see who cited it and trace the lineage of ideas
- **"Cited by" plus "Related articles"**: these two links are the core of snowball literature searching — start from one seed paper and reach a topic's boundary in a few rounds
- **Author profiles**: follow a specific researcher's publications and h-index
- **Alerts**: set up email notifications for keywords or authors so new papers come to you

### Quick Tips

| Syntax | Purpose | Example |
|---|---|---|
| `"..."` | Exact match | `"chain of thought"` |
| `author:` | Specific author | `author:"Yann LeCun"` |
| `intitle:` | Title contains | `intitle:transformer` |
| Year slider (left panel) | Filter by publication year | Only show 2024 onward |

**Link**: [Google Scholar](https://scholar.google.com/)

---

## Read Papers: Moonlight

[Moonlight](https://www.themoonlight.io/en) is an AI-powered paper reader built by Corca, a Korean AI company. It positions itself as your "AI Colleague" — not just a PDF viewer, but a reading companion you can talk to. Highlight a confusing passage, equation, or figure, and get an explanation in context.

### Core Features

- **Instant explanations**: select any sentence, paragraph, or math formula and the AI generates a contextual explanation — not a generic chatbot answer, but one grounded in the paper
- **Figure interpretation**: click an image and the AI summarizes the key takeaways, trends, and conclusions
- **Auto-highlight**: Moonlight automatically detects and marks methods, results, and novel contributions so you can scan the structure fast
- **In-paper chat**: ask questions about the entire paper, e.g., "How does this baseline differ from the one in the previous paper?"
- **Translation**: translate selected text or full pages — especially useful for non-native English readers
- **Citation cards**: click a reference number to preview the cited paper's abstract without leaving your current read
- **Library management**: save a paper and its metadata is auto-parsed for quick retrieval later

### Platforms

| Platform | Link |
|---|---|
| Web | [themoonlight.io](https://www.themoonlight.io/en) |
| iOS | [App Store](https://apps.apple.com/tw/app/moonlight-ai-pdf-reader/id6738034562) |
| Android | [Google Play](https://play.google.com/store/apps/details?id=com.corca.moonlight) |
| Chrome Extension | [Chrome Web Store](https://chromewebstore.google.com/detail/moonlight-ai-colleague-fo/lhipdkibljepmfojllcfflfflhflcbgi) |

Core features are free. Advanced AI models and unlimited usage require a Pro or Premium plan.

---

## Write Papers: CorTeX

[CorTeX](https://cortex.corca.ai/) is also built by Corca. It's a collaborative academic writing workspace that supports both Markdown and LaTeX.

### Core Features

- **Markdown + LaTeX hybrid**: write body text in Markdown and equations in LaTeX with live preview — no local TeX Live installation needed
- **Real-time collaboration**: multiple authors edit the same manuscript simultaneously, great for cross-lab projects
- **Template library**: built-in templates for journal and conference submissions, saving you the formatting setup
- **Live preview**: see the final typeset output as you write, cutting the compile-check-revise cycle

### How It Differs from Overleaf

Overleaf is a pure LaTeX ecosystem. CorTeX additionally supports Markdown, which lowers the entry barrier. If your team includes members who aren't fluent in LaTeX, CorTeX's Markdown mode lets them contribute directly without learning a typesetting language first.

**Link**: [CorTeX](https://cortex.corca.ai/)

---

## How They Chain Together

```
Google Scholar          Moonlight              CorTeX
  Search → Find PDF → Read + AI assist → Write + collaborate
            ↑                │                    │
            └── Citation ←── Citation cards ──→ Insert ref ─┘
                tracking
```

1. **Search on Google Scholar** — use citation tracking and related articles to map out the core literature
2. **Drop the PDF into Moonlight** — let the AI explain, auto-highlight, and translate; save papers to your library when done
3. **Start writing in CorTeX** — pick a template, draft in Markdown, add equations in LaTeX, collaborate with co-authors until submission

All three tools offer free tiers, so you can run the entire pipeline at zero cost.

---

## Summary

| Action | Tool | One-liner |
|---|---|---|
| Find | Google Scholar | Broadest academic search; citation tracking is the killer feature |
| Read | Moonlight | AI explains equations, figures, and passages in context — no more brute-force reading |
| Write | CorTeX | Markdown + LaTeX collaborative writing with one-click templates |

Tools are just tools. What matters is what you read, what you think, and what you write. But good tools minimize friction so you can spend your time where it counts.
