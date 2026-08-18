---
title: "AI Agents Generating Slides: Letting the Model See Its Own Layout"
date: 2026-08-18
type: deep-dive
category: ai
tags: [ai-agent, slide-generation, agent-skills, marp, slidev, pptx, visual-qa]
lang: en
tldr: "The 2026 consensus for agent-built slide decks: outline-first, separate content from construction, then render to images and let a fresh-eyes subagent do visual QA. Anthropic's and OpenAI's official slides skills both converged on PptxGenJS plus a visual verification loop, and the research line (PPTAgent → PreGenie → DeepPresenter) points the same way. But two later corrections matter: PresentBench shows the widely cited PPTEval scores too generously, and SeaSlides argues the model should not write free-form HTML/SVG at all."
description: "Best practices for AI agents generating presentations: a close reading of Anthropic's pptx skill, the Marp/Slidev code-first path, the Gamma API and Manus SaaS approach, the visual QA loop, and a list of anti-patterns."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-agent-slide-generation-best-practices)

LLMs are good at producing text but cannot see how they laid it out. A deck is a visual document, and defects like overflowing text, overlapping elements, and insufficient contrast only exist after rendering — which is why early AI slides were all ugly in the same way. Every mature 2026 approach, whether Anthropic's and OpenAI's official skills, the Marp/Slidev code-first workflow, or products like Gamma and Manus, is solving one problem: **how to give the agent visual feedback.** This article covers the consensus architecture, the trade-offs between three output paths, and the anti-patterns to avoid.

## The consensus: a four-layer workflow

Stack the various approaches on top of each other and a four-layer architecture emerges:

1. **Interview / brief first**: ask about audience, purpose, length, and key message before doing anything. S Anand's voice-to-slides workflow and the freeCodeCamp Claude Code + Marp tutorial both make "the AI interviews you" step one — it forces the story to be clear before slide one exists.
2. **Outline first**: produce an outline (optionally with per-slide layout hints) for human review before rendering. Fixing mistakes at the outline stage is cheapest; tools like slides-grab-studio make "review outline" a hard step in the flow.
3. **Separate content from construction**: the LLM makes content decisions and emits a structured intermediate representation (Marp/Slidev markdown, a PptxGenJS script, a JSON slide map) that a deterministic renderer turns into a file. The community pptx-generator skill states the principle most bluntly: "Slides are visual documents, not text dumps. Generate mechanically, validate visually." Having an LLM hand-write OOXML is an anti-pattern; direct OOXML manipulation is reserved for "edit an existing file, preserve the template" cases.
4. **Render → visual QA loop**: render each page to an image and hand it to a **fresh-eyes subagent or VLM with zero generation context** to find problems against a checklist, then fix and re-verify only the affected pages until a full pass is clean. This layer is the most critical and the most commonly skipped.

Why must layer 4 be someone else? Because the generating agent has context bias — it knows what the slide is *supposed* to look like and will rationalize the visual defects it caused. Anthropic's pptx skill and the community skills all explicitly require generator and validator to be separate.

## Reading Anthropic's pptx skill closely

In Anthropic's open-source [skills repo](https://github.com/anthropics/skills), the pptx skill's SKILL.md is the most complete primary teaching material available. Three operating paths: `markitdown` for reading and analysis, OOXML unpack→edit→pack for editing existing files, and **PptxGenJS** for building from scratch (early versions led with html2pptx; the current main branch builds directly with PptxGenJS, while the API-platform container runs a heavyweight Node + Playwright + LibreOffice + Sharp stack).

The best part is that QA is a Required section, and it opens with:

> "Assume there are problems. Your job is to find them. Your first render is almost never correct. … If you found zero issues on first inspection, you weren't looking hard enough."

The workflow is `soffice` to PDF → `pdftoppm` to per-page JPG → dispatch a subagent with a 12-item checklist (overlap, overflow, margins under 0.5", low contrast, leftover placeholders, …) to inspect page by page → fix → re-verify, and **you may not declare completion without at least one fix-and-verify cycle.**

The design guidance is equally concrete: colors should be content-informed ("if your palette would work on a deck about a completely different topic, it isn't specific enough"), one color should carry 60-70% of the visual weight, and titles at 36-44pt against 14-16pt body text. There is also one specially flagged anti-AI rule:

> "NEVER use accent lines under titles — these are a hallmark of AI-generated slides."

OpenAI's official slides skill takes a structurally identical path: PptxGenJS plus `slides_test.py` overflow detection, `warnIfSlideHasOverlaps` / `warnIfSlideElementsOutOfBounds`, skia-canvas/fontkit text measurement, and LibreOffice rasterization for verification. Two major vendors converging independently on the same architecture makes this direction close to settled.

## The code-first path: Marp and Slidev

For day-to-day engineering work, markdown→slides is the lowest-friction route, because plain text is the LLM's home turf:

- **[Marp](https://marp.app/)**: minimal syntax, so LLM syntax errors approach zero; outputs HTML / PDF / **PPTX**; the CLI has `--watch` for hot reload, and with GitHub Actions you can treat the deck as a build artifact — push and it re-renders. The cost is limited styling freedom, and the PPTX it emits is one image per page, not editable element by element.
- **[Slidev](https://sli.dev/)**: richer syntax, with embedded Vue components, Mermaid diagrams, and syntax-highlighted code blocks; LLMs also produce valid output almost every time. The price of that freedom is easier overflow, which is why the community built [slidev-overflow-checker](https://github.com/mizuirorivi/slidev-overflow-checker) — it renders in a real Playwright browser, computes overflow in px, reports the corresponding markdown line numbers, and emits machine-readable output the agent can act on. Its README says it in one line: "LLMs are good at generating text, but bad at validating visual layout."

The practical starting move: write the Marp/Slidev syntax rules, CSS palette, and slide-structure conventions into a Claude Code skill, then run interview → outline → generate → export. A 15-page deck converts markdown→PDF in about 2 seconds, so iteration is nearly free — and the whole deck is git-diffable.

## The SaaS agent path: Gamma, Manus, Kimi

If you would rather not build a pipeline, the product side visibly went agentic through 2025-2026:

- **Gamma**: Gamma 3.0 (2025-09-16) shipped Gamma Agent and the [Gamma API](https://developers.gamma.app/docs/getting-started) — `POST /v1.0/generations` with `inputText` / `numCards` / `exportAs`, poll to `completed`, then collect the gammaUrl and exports. Good for CSV→hundreds of personalized decks. The API needs a Pro plan or above.
- **Manus Slides**: research → narrative → design → speaker notes, fully automated, with company .pptx template upload, exporting pptx / PDF / web. There is also a Nano Banana Pro full-page-image mode — high visual quality and accurate text rendering, but the official FAQ concedes the content is baked into the image and therefore **not editable**; editable deliverables still need the HTML/pptx path.
- **Kimi Slides**: a two-model split — K2 Thinking handles research, narrative, and copy while Nano Banana Pro handles per-page custom illustration. (This architectural description comes from third-party write-ups; single-sourced and unconfirmed.)

- **NotebookLM**: Google's entry, rarely listed alongside the others in Chinese-language coverage — but in the PresentBench evaluation discussed below, it scores highest among the tested products.

The shared weakness of SaaS is opacity and template feel: you never get the intermediate representation, iteration happens only through natural language, and the design ceiling is set by the product.

## The research line: PPTAgent → PreGenie → DeepPresenter

Research took the same path. [PPTAgent](https://arxiv.org/abs/2501.03936) ([EMNLP 2025](https://aclanthology.org/2025.emnlp-main.728/)) abandoned from-scratch generation for a two-stage, edit-based approach — analyze reference templates, then fill in content through editing actions — and introduced PPTEval, which scores Content / Design / Coherence. [PreGenie](https://arxiv.org/abs/2505.21660) uses Slidev as the intermediate representation, on the reasoning that its structure is simpler than HTML or python-pptx and therefore less likely to induce broken LLM code, and splits review into two layers: LLM code review plus VLM page review. The paper states explicitly that **problems like an image overflowing the page boundary are invisible in the code and only appear after rendering**.

[DeepPresenter](https://arxiv.org/abs/2602.22839) (2026-02, [ACL 2026 Findings](https://aclanthology.org/2026.findings-acl.1578/)) goes further, making **environment-grounded reflection** the core mechanism: the agent uses an `inspect` tool to render an HTML slide into pixels and revises against the picture rather than its own reasoning trace. The paper names the underlying problem precisely — **the agent operates on an intermediate representation (HTML/markdown) while the user perceives only the rendered artifact, and that "state mismatch" leaves introspective reflection operating in the wrong observation space.** Its fine-tuned DeepPresenter-9B scores 4.19, beating every open-source baseline and approaching GPT-5's 4.22. Worth noting: DeepPresenter and PPTAgent come from the same group (Institute of Software, Chinese Academy of Sciences — same project repo), so this is not merely a thematic progression but the same people overturning their own prior work.

Research and engineering meet at the same point: **visual feedback is not nice-to-have, it is intrinsic to the task.**

## Two later developments: evaluation got stricter, and a counter-position appeared

The consensus architecture above still held through the first half of 2026, but two things from the second half belong here.

### PresentBench: PPTEval scores too generously

[PresentBench](https://arxiv.org/html/2603.07244v1) is a fine-grained, rubric-based benchmark: 238 evaluation instances, each paired with an average of **54.1 binary checklist items** across five dimensions — presentation fundamentals, visual design and layout, content completeness, content correctness, and content fidelity.

Its central finding bears directly on the material above: **coarse-grained, instance-agnostic frameworks like PPTEval tend to produce overly optimistic scores.** The paper's account is that PPTEval makes "a single, global judgment based on generic criteria," so it misses subtle errors and offers limited diagnostic value. So "PPTEval is the most-cited option" remains true — but **most-cited is not the same as strict enough.**

Its product ranking is worth recording too: NotebookLM 62.5 > Manus 1.6 at 57.8 > Tiangong 54.7 > Zhipu 53.6 > **the open-source PPTAgent v2 at only 50.2** > Gamma 49.2 > Doubao 48.0 > Qwen 35.9 (most tested in 2026-01; a separate 2026-07 entry, Huawei Cloud's hwc-mmi-aippt, leads at 70.8). The authors read the open-source gap as coming not only from backbone models but from proprietary end-to-end pipelines — slide-specific long-context planning, grounding mechanisms, and more mature layout and rendering engines.

[DECKBench](https://arxiv.org/html/2602.13318) (KDD '26) adds another missing piece: **multi-turn editing** of academic paper-to-slide decks, which no prior benchmark measured systematically.

### SeaSlides: maybe the model should not write free-form HTML

The narrative above runs from templates toward executable artifacts (HTML/SVG). [SeaSlides](https://arxiv.org/html/2608.03298v1), from August 2026, argues the other way.

Its position: templates preserve visual regularity but restrict adaptation, while **free-form HTML or SVG gives the model flexibility at the cost of handing it a pile of low-level rendering decisions** — which makes long technical decks brittle, especially when slides carry formulas, code, or data graphics.

Its answer is a **semantic abstraction layer**: rather than authoring coordinates, inline styles, or raw SVG geometry, the model writes structured slide content through reusable components and capability modules, while **templates own layout, style, and rendering**. Equations, code, and charts route to dedicated renderers, and three feedback stages separately catch build errors, project-constraint violations, and visual defects. It implements the same boundary in both HTML and Typst backends to show the principle is language-independent.

This does not overturn "you need visual feedback" — SeaSlides has a visual-defect feedback stage of its own — but it challenges the direction of having the model emit executable visual code directly. **The disagreement is crisply stated: how much visual implementation should the model be responsible for?**

## The overall architecture

```
 brief/interview      outline review        structured IR              deterministic build
┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐   ┌──────────────────┐
│ audience/goal │ → │ outline.md   │ → │ Marp/Slidev md       │ → │ renderer          │
│ key message   │   │ (human gate) │   │ PptxGenJS script     │   │ (md→slides /      │
└──────────────┘   └──────────────┘   │ JSON slide map       │   │  script→.pptx)    │
                                      └─────────────────────┘   └────────┬─────────┘
                                                                          ↓ render to images
                                      ┌─────────────────────────────────────────────┐
                                      │ visual QA loop (fresh-eyes subagent / VLM)   │
                                      │ + programmatic checks: overflow px, min font,│
                                      │   bullet caps, WCAG contrast, placeholders   │
                                      │ find → fix → re-verify affected pages only   │
                                      └─────────────────────────────────────────────┘
```

The anti-pattern list (every one of these has been stepped on): one prompt for a whole deck, the generating agent validating its own work, code review without post-render inspection, accent lines under titles, one layout for the entire deck, defaulting to blue, and declaring completion without a fix-and-verify cycle.

## The big picture

The three paths trade off cleanly: **need editable deliverables or corporate templates** → build with PptxGenJS (or Manus template import); **an engineer's talk, a disposable deck, something you want to git diff** → Marp/Slidev plus an agent skill; **batch personalization without running a pipeline** → the Gamma API. Whichever you pick, the quality watershed sits in the same place: whether "render to images → independent visual review → fix loop" is actually in your process.

The unsolved parts, stated honestly: VLM visual QA still misses details (most implementations cap at three fix rounds rather than guaranteeing convergence), PPTX font substitution across environments remains a trap, and evaluation is not standardized — PPTEval is the most-cited option, but PresentBench has shown it scores too generously, and stricter rubric-based evaluation is only now rolling out.

## References

- [Anthropic skills repo — pptx SKILL.md](https://github.com/anthropics/skills)
- [Anthropic Engineering — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Docs — Agent Skills quickstart (pptx via API)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [PPTAgent: Generating and Evaluating Presentations Beyond Text-to-Slides (arXiv 2501.03936)](https://arxiv.org/abs/2501.03936) | [EMNLP 2025](https://aclanthology.org/2025.emnlp-main.728/)
- [DeepPresenter: Environment-Grounded Reflection for Agentic Presentation Generation (arXiv 2602.22839)](https://arxiv.org/abs/2602.22839) | [ACL 2026 Findings](https://aclanthology.org/2026.findings-acl.1578/)
- [PreGenie: An Agentic Framework for High-quality Visual Presentation Generation (arXiv 2505.21660)](https://arxiv.org/abs/2505.21660)
- [PresentBench: A Fine-Grained Rubric-Based Benchmark for Slide Generation (arXiv 2603.07244)](https://arxiv.org/html/2603.07244v1)
- [SeaSlides: Semantic Abstraction Layer for Agentic Slide Generation (arXiv 2608.03298)](https://arxiv.org/html/2608.03298v1)
- [DECKBench: Benchmarking Multi-Agent Frameworks for Academic Slide Generation and Editing (arXiv 2602.13318)](https://arxiv.org/html/2602.13318)
- [Marp — Markdown Presentation Ecosystem](https://marp.app/)
- [Slidev](https://sli.dev/)
- [slidev-overflow-checker (GitHub)](https://github.com/mizuirorivi/slidev-overflow-checker)
- [Gamma Developer Docs](https://developers.gamma.app/docs/getting-started)
- [Manus Slides Documentation](https://manus.im/docs/features/slides)
- [MARP + LLMs: The Engineering Case for Presentations as Text (Matias Sulik)](https://medium.com/@matias.sulik/marp-llms-the-engineering-case-for-presentations-as-text-f806da6e6eea)
- [How I Use Claude Code + Marp to Think Through Presentations (freeCodeCamp)](https://www.freecodecamp.org/news/how-to-use-claude-code-and-marp-to-think-through-presentations/)
- [Voice Chat to Slides: My New AI-Powered Workflow (S Anand)](https://www.s-anand.net/blog/voice-chat-to-slides-my-new-ai-powered-workflow/)
