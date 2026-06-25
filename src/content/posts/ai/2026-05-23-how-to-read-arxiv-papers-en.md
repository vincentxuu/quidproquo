---
title: "How Do People Read arXiv Papers? A Complete Guide to Methods and Tools"
date: 2026-05-23
category: ai
type: deep-dive
tags: [arxiv, paper-reading, research-tools, llm, literature-review, notebooklm, zotero]
lang: en
tldr: "Reading papers is two problems stacked together: methodology (Keshav's three-pass method, 5-10 min / 1 hour / 4-5 hours) determines how to read, and tools (arXiv HTML, alphaXiv, NotebookLM, Connected Papers, Zotero) shorten the time for each pass. AI lowers the barrier to understanding; judging correctness always stays with the human."
description: "From Keshav's three-pass reading method to post-2025 AI tools: readable per-paper experience (arXiv HTML/alphaXiv), comprehension aids (SciSpace/NotebookLM), related work discovery (Connected Papers), staying current (HF Daily Papers), and storage with annotation (Zotero) — a complete tool map with trade-offs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-23-how-to-read-arxiv-papers)

"Reading arXiv papers" is actually two problems stacked together: **how to read** (methodology) and **what to read with** (tools). The methodology hasn't changed much in decades — Keshav's 2007 paper "How to Read a Paper" remains the foundational framework today. What has been completely upended are the tools — since 2023, LLMs have rewritten each of the four stages: finding papers, understanding them, tracking new ones, and archiving them. This post combines both threads into a single map, with one core thesis: **tools are meant to shorten the time each pass takes in the methodology, not to replace your judgment**.

## Methodology: Keshav's Three-Pass Reading Method

Almost every discussion about "how to read papers" eventually circles back to S. Keshav's 2007 piece "How to Read a Paper," published in ACM SIGCOMM CCR. Its counterintuitive core insight: **don't read from start to finish**. Instead, make up to three passes, each with a different goal. In Keshav's own words:

> "The first pass gives you a general idea about the paper. The second pass lets you grasp the paper's content, but not its details. The third pass helps you understand the paper in depth."

The time allocation looks like this:

- **First pass (5-10 minutes)**: Read only the title, abstract, introduction, section headings, conclusion, and glance at the references. Afterward, you should be able to answer the "five Cs": Category (what type of paper), Context (related work), Correctness (do the assumptions hold), Contributions (main contributions), and Clarity (is it well-written). **Most papers should be put down after the first pass.**
- **Second pass (up to 1 hour)**: Examine figures and tables carefully (papers with sloppy figures or missing error bars can be skipped outright), and mark references to revisit later. The goal is to be able to explain to a friend what this paper is about.
- **Third pass (4-5 hours for beginners, ~1 hour for experts)**: Attempt "virtual re-implementation" — pretend you are the author and reconstruct the work under the same assumptions. You only need a third pass when you truly must understand the paper (e.g., you're reviewing it, or doing research on the same topic).

This method also extends directly to literature surveys: start by finding 3-5 recent papers via search, give each a first pass, read their related work sections to map out the landscape, then lock onto key papers by identifying commonly cited references and recurring authors. **First use the methodology to decide whether a paper is worth reading and to what depth, then pick the tools** — that's the intended order for this entire map.

## Reading a Single Paper: Making arXiv Readable First

PDFs are painful on phones and for screen readers. The first tool to swap is actually arXiv itself: **starting December 1, 2023, arXiv automatically generates HTML versions for all TeX/LaTeX submissions** (found below the PDF link on the abstract page). The official statement is quite candid — it's essentially the community project ar5iv brought in-house:

> "If you're familiar with ar5iv, an arXivLabs collaboration project, our HTML service is essentially about bringing that impactful project fully 'in-house.'"

The underlying engine is NIST's LaTeXML. Note that it's still marked **experimental**: 90% of submissions are LaTeX, and arXiv processes roughly 20,000 papers per month with most announced within 24 hours — there's no budget for manual typesetting review. So the backfill of older papers isn't complete, and some formula conversions have imperfections. The predecessor ar5iv still exists but lags about a month behind arXiv's official renders, deliberately signaling that it's not the official rendering.

If what you want is "read while asking, discuss while viewing," switch to **alphaXiv**: just replace `arxiv` with `alphaxiv` in any arXiv URL. Founded in June 2024 by Stanford researchers Raj Palleti and Rehaan Ahmad, it's backed by arXiv Labs and the Brown Institute, with about 500K monthly active users. Its design bet is that "papers need community" — it supports line-by-line comments, Ask AI Q&A, one-click blog-style summary generation, and even converting papers to podcasts. The difference from arXiv HTML: HTML solves "can I read this comfortably," while alphaXiv solves "can I read with others and ask questions in real time when I'm stuck."

## Understanding the Content: Trade-offs of AI-Assisted Comprehension

When you're stuck on a passage, there's a whole class of "explainer" tools:

- **SciSpace Copilot** (formerly Typeset): its strength is highlighting a passage, formula, table, or figure and getting an in-place explanation. It covers 280M+ papers, supports 75+ languages, has a free tier, and the paid plan is about $12/month. Choose this when you need source tracing or math explanations.
- **Explainpaper**: much simpler — upload a PDF, highlight complex passages, get plain-language explanations. No extra features.
- **ChatPDF**: quick Q&A style, with short answers suited for rapid information extraction, but lacking depth.
- **NotebookLM** (Google): the key trade-off is that it **uses only your uploaded sources**, sacrificing general knowledge in exchange for traceability and low hallucination. It can also generate audio overviews (podcasts) from multiple sources. For those most anxious about "LLMs making things up," this is currently the most reliable option.

What about just dropping the PDF into ChatGPT or Claude? Convenient, but you need to understand its ceiling. Multiple studies have pointed out LLMs' critical weakness in the paper-reading context — **hallucination and citation errors**: a JMIR 2024 study conducting a systematic review of ChatGPT and Bard specifically measured "reference accuracy" and hallucination rates; Stanford HAI found that LLM hallucination in legal retrieval is "pervasive"; there's even a paper arguing outright that "Hallucination is Inevitable" (arXiv:2401.11817), claiming this is an inherent LLM limitation that won't reach zero as models improve. The practical mitigation is consistent across the board: **demand "direct quotes from the source" rather than "summaries," verify sentence by sentence against the original, and treat any AI output as a draft, never a conclusion**.

## Finding Related Work: Expanding from One Paper to Many

After reading a good paper, the next step is usually "what else is related." This is the domain of visualization and semantic search:

- **Connected Papers**: input a seed paper, get a "neighborhood graph" where node size represents citation count and position represents citation relationships. Free tier allows 5 graphs per month; paid is about $3/month. Best for quickly mapping out the landscape of a sub-field.
- **ResearchRabbit**: dubbed "the Spotify of papers" — build collections, get algorithm-driven recommendations, and explore interactive citation/author graphs.
- **Semantic Scholar**: Allen AI's free academic search covering 200M+ papers, with author and citation tracking.
- **arxiv-sanity / arxiv-sanity-lite**: Andrej Karpathy's long-running tool for browsing ML papers on arXiv by semantic similarity.

The selection logic is straightforward: use Connected Papers for "one graph to see the neighborhood," Semantic Scholar for "precise full-database search," and ResearchRabbit for "continuous recommendation feed."

## Staying Current: Your Daily Paper Feed

To keep up with a field, you need a stable paper feed. Here's an **important update many people still don't know**: **Papers with Code was abruptly shut down by Meta in July 2025, with the domain redirecting to Hugging Face**. Historical data was rescued by the community via JSON dumps on GitHub and HF, but the integrated leaderboard experience is gone.

Current mainstream approaches fall into two categories:

- **Passive broad monitoring**: every arXiv category has an RSS feed (pipe into Feedly / Inoreader / NetNewsWire), plus email alerts; Google Scholar Alerts can send keyword-based email notifications. Best for "not wanting to miss anything on a given topic."
- **Community trending / personalized**: **Hugging Face Daily Papers** is the de facto successor to Papers with Code, curated daily by AK and the community, with trending scores combining upvotes, GitHub stars, and other signals; **Scholar Inbox** and arxiv-sanity provide personalized recommendations; for a low-effort option, subscribe to newsletters like AlphaSignal that compress the day's highlights into 5 minutes.

In practice, most people run two parallel streams: "RSS / Scholar alerts for precise keywords + HF Daily Papers for field-wide trending."

## Storage and Annotation: Making Sure What You Read Doesn't Evaporate

Reading without saving is the same as not reading. The backbone of reference management is overwhelmingly **Zotero**: free, open-source, with a built-in PDF reader (highlights, sticky notes, annotations). Annotations are written directly into a standard SQLite database — maximum future-proofing. Its ecosystem is also the richest: `zotero-better-notes` for note-taking, `zotero-arxiv-workflow` for automatically fetching the latest arXiv version and merging the published journal version, plus plugins for syncing to Obsidian / Logseq / Notion.

If your reading workflow is closer to "read-later + highlights" (mixing web pages, newsletters, and PDFs), **Readwise Reader** is another path, excelling at cross-source highlight aggregation and spaced review. The two aren't mutually exclusive: Zotero as the academic backbone, Reader supplementing for general consumption.

## Overall Architecture

Stacking methodology and tools together, the pipeline looks roughly like this:

```
                    ┌─────────────────────────────────────────┐
                    │  Methodology runs throughout:            │
                    │  Keshav's Three-Pass Reading Method      │
                    │  (Decide whether to read & how deep,     │
                    │   then pick your tools)                  │
                    └─────────────────────────────────────────┘
                                      │
   Staying Current    Finding Related   Reading / Understanding   Storage &
                      Work                                        Annotation
 ┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌──────────┐
 │HF Daily   │ ───▶ │Connected │ ───▶ │arXiv HTML     │ ───▶ │Zotero     │
 │Papers     │      │Papers    │      │alphaXiv       │      │(+plugins) │
 │arXiv RSS  │      │Semantic  │      │SciSpace       │      │Readwise   │
 │Scholar    │      │Scholar   │      │NotebookLM     │      │Reader     │
 │Inbox      │      │Research  │      │(verify LLM    │      │           │
 └──────────┘      │Rabbit    │      │ output!)      │      └──────────┘
                    └──────────┘      └──────────────┘
   Pass 1 uses       Pass 1-2          Pass 2-3 for true      Post-reading
   this layer        expansion         understanding          consolidation
```

## Putting It All Together

Methodology is the skeleton; tools are the flesh. **Keshav's three-pass method determines how much effort you spend on each paper; tools determine how fast each pass can go**: first pass scanning the field with HF Daily Papers + alphaXiv summaries, second pass with arXiv HTML + SciSpace for math explanations, third pass deep-diving where tools are only supplementary and judgment is entirely yours; after reading, consolidate with Zotero.

AI's role in this map is very clear — it excels at **lowering the barrier to understanding** (translation, explanation, summarization, discussion generation), but **judging correctness** remains something that must stay with humans, because hallucination and citation errors are structural problems. For heavy paper readers, the most cost-effective combination is actually quite simple: arXiv HTML + Zotero + a stable paper feed, with AI tools plugged in as needed rather than letting any single tool read for you.

## References

- [How to Read a Paper — S. Keshav (ACM SIGCOMM CCR, 2007)](http://ccr.sigcomm.org/online/files/p83-keshavA.pdf)
- [The Three-Pass Method guide](https://richardmathewsii.substack.com/p/three-pass-research-literature-review)
- [Accessibility update: arXiv now offers papers in HTML format (arXiv blog, 2023-12-21)](https://blog.arxiv.org/2023/12/21/accessibility-update-arxiv-now-offers-papers-in-html-format)
- [HTML as an accessible format for papers (arXiv info)](https://info.arxiv.org/about/accessible_HTML.html)
- [HTML papers on arXiv: why it's important, and how we made it happen (arXiv:2402.08954)](https://arxiv.org/html/2402.08954v1)
- [alphaXiv](https://www.alphaxiv.org/)
- [Founded by Stanford researchers — alphaXiv introduction (Analytics India Magazine)](https://www.linkedin.com/posts/analytics-india-magazine_founded-by-stanford-researchers-raj-palleti-activity-7334805912135573504-nGsz)
- [SciSpace](https://scispace.com/)
- [Explainpaper](https://www.explainpaper.com/)
- [ChatPDF](https://www.chatpdf.com/)
- [Google NotebookLM](https://notebooklm.google.com/)
- [Best AI Research Tools 2026 (tool and pricing comparison)](https://smarttrendsai.com/best-ai-research-tools/)
- [Hallucination Rates and Reference Accuracy of ChatGPT and Bard for Systematic Reviews (JMIR, 2024)](https://www.jmir.org/2024/1/e53164)
- [Hallucinating Law: Legal Mistakes with LLMs are Pervasive (Stanford HAI)](https://hai.stanford.edu/news/hallucinating-law-legal-mistakes-large-language-models-are-pervasive)
- [Hallucination is Inevitable: An Innate Limitation of LLMs (arXiv:2401.11817)](https://arxiv.org/abs/2401.11817)
- [Connected Papers](https://www.connectedpapers.com/)
- [ResearchRabbit](https://www.researchrabbit.ai/)
- [Semantic Scholar](https://www.semanticscholar.org/)
- [arxiv-sanity-lite — Andrej Karpathy](https://github.com/karpathy/arxiv-sanity-lite)
- [Papers with Code Shutdown 2025 (community report and timeline)](https://www.codesota.com/papers-with-code)
- [Hugging Face Daily Papers](https://huggingface.co/papers)
- [Scholar Inbox](https://www.scholar-inbox.com/)
- [Zotero](https://www.zotero.org/)
- [awesome-arxiv — tool collection list](https://github.com/artnitolog/awesome-arxiv)
- [Readwise Reader](https://readwise.io/read)
