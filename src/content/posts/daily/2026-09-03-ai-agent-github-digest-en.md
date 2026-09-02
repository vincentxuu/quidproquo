---
title: "AI Agent GitHub Digest — 2026-09-03"
date: 2026-09-03
category: daily
tags: [ai-agent, github, open-source, daily, personal-agent, agent-skills, agent-security, document-parsing]
lang: en
description: "Personal agents are starting to leave an auditable trail — Hermes Agent teaches itself skills, Atlas ties every commit back to the agent session that made it, and AG2 adds a rule-based middleware to block prompt injection without an LLM in the loop"
tldr: "NousResearch/hermes-agent keeps climbing (239,994 stars) on a self-improving learning loop that remembers how to use your tools and who you are across sessions. pacifio/atlas gained 895 stars in a day by giving multiple coding agents shared, traceable version control — every commit links back to the session that made it. blader/humanizer strips the AI tell from writing using 35 patterns, without inventing facts. On the document side, firecrawl/pdf-inspector decides in under 50ms whether a PDF needs OCR, and superlinked/sie folds every model an agent needs into one self-hosted inference cluster. On the framework side, AG2 v1.0.3 ports fully to MCP 2.0 (a breaking change) and adds TealTigerMiddleware, a deterministic, non-LLM prompt-injection guard."
series:
  name: "AI Agent GitHub Digest"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-03-ai-agent-github-digest)

## Today's Highlights

Today's trending repos are all about agents leaving a trail — or erasing one. Hermes Agent uses a self-improving learning loop to remember what it has done; Atlas ties every commit back to the exact agent session, prompt, and tool calls that produced it; Humanizer goes the other way and scrubs the AI tell out of agent-written text. Meanwhile AG2 ships a rule-based, non-LLM prompt-injection guard — a fitting follow-up to yesterday's NVIDIA SkillSpector security story.

## Trending Repos

### NousResearch/hermes-agent ⭐ 239,994 (+529)

[GitHub](https://github.com/NousResearch/hermes-agent) · Python · MIT

- **What it is**: a personal agent from Nous Research with a built-in self-improvement loop — it extracts skills from what it just did, updates its own memory, and remembers who you are across sessions.
- **Why it's worth a look**: unlike a typical stateless coding agent, it actively maintains long-term memory and a skill library (compatible with the agentskills.io standard), and reaches you through one gateway across Telegram, Discord, Slack, WhatsApp, Signal, and the CLI. It runs happily on a $5 VPS or serverless infrastructure that costs almost nothing while idle.
- **Tech Stack**: Python, FTS5 session search, the agentskills.io standard, and multiple sandboxed backends (Docker, SSH, Modal, Daytona, Vercel Sandbox).
- **Getting Started**: Low — a one-line install script gets it running; wiring up several chat platforms means collecting an API key/token for each one, so call it low-to-medium overall.

---

### pacifio/atlas ⭐ 2,767 (+895)

[GitHub](https://github.com/pacifio/atlas) · Rust · MIT

- **What it is**: shared, traceable version control for multiple coding agents (Claude Code, Codex, Atlas's own agent, and anything else on the ACP registry) — every commit links back to the session, prompt, and tool calls that produced it.
- **Why it's worth a look**: plain git tells you who committed, not which agent reasoned its way to the change. That traceability matters most when several agents work the same codebase in parallel, and shared memory means switching agents mid-task doesn't mean starting the context over. It gained the most ground of anything on today's list — 895 stars in a single day.
- **Tech Stack**: Rust, the Agent Client Protocol (ACP), and an MCP client.
- **Getting Started**: Medium — you run your own client/server and wire up multiple agent CLIs.

---

### blader/humanizer ⭐ 40,149 (+366)

[GitHub](https://github.com/blader/humanizer) · Python · MIT

- **What it is**: an Agent Skill that works in Claude Code, Codex, or Cursor, rewriting AI-sounding text using 35 patterns drawn from Wikipedia's "Signs of AI writing."
- **Why it's worth a look**: unlike a generic "de-AI" tool, it explicitly commits to not inventing facts — names, numbers, dates, and quotes have to come from the source text or the user, and it shows its first draft plus a short critique of what still reads as artificial before finalizing. The same day, a similar project — Nanako0129/sepia (1,525 stars) — also shipped a "de-AI writing" skill, suggesting this is becoming its own small sub-category.
- **Tech Stack**: pure Markdown, following the agent-skills standard.
- **Getting Started**: Low — drop it in your skills directory and call it with `/humanizer`.

---

### firecrawl/pdf-inspector ⭐ 18,388 (+589)

[GitHub](https://github.com/firecrawl/pdf-inspector) · Rust · MIT

- **What it is**: a Rust PDF library from Firecrawl that first classifies a PDF as text-based or scanned, converts text-based PDFs straight to clean Markdown, and routes only scanned pages to OCR.
- **Why it's worth a look**: Firecrawl's own testing found that roughly 54% of PDFs don't need OCR at all, and this library classifies a PDF in 10-50ms — skipping the wait and cost of an OCR service entirely. Text extraction stays position-aware, so multi-column layouts and financial tables come out intact, making it a solid fit for the document-preprocessing step ahead of RAG.
- **Tech Stack**: a Rust core with Python, Node.js, and WebAssembly bindings, plus PP-OCRv6 Small for optional OCR.
- **Getting Started**: Low — installable directly from pip, npm, or cargo.

---

### superlinked/sie ⭐ 3,008 (+61)

[GitHub](https://github.com/superlinked/sie) · Python / Rust · Apache-2.0

- **What it is**: a self-hosted inference server from Superlinked that folds every model an agent needs — embedding, reranking, structured output, content safety, and the agent loop itself — into one cluster behind an OpenAI-compatible API.
- **Why it's worth a look**: instead of standing up a separate model server for each task, SIE loads over 100 models on demand with LRU eviction from a single system, and ships Kubernetes/Helm deployment configs plus ready integrations with LangChain, LlamaIndex, and CrewAI, among others.
- **Tech Stack**: Python, Rust, Kubernetes/Helm, and KEDA autoscaling.
- **Getting Started**: Medium — running your own inference cluster takes Kubernetes experience, though local development is easy to bootstrap with the mise toolchain.

## Notable Releases

### AG2 v1.0.3

[Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)

- **Key changes**: every MCP surface, client and server, is now ported to MCP 2.0; a new `TealTigerMiddleware` blocks prompt injection before every tool call using deterministic regex/glob rules with no LLM in the loop; an ACP host can now answer a hosted agent's human-input requests; human-input failures now surface as errors instead of hanging the run.
- **Breaking Changes**: the `mcp` dependency is now pinned to `>=2.0.0,<3` — if you or a package you depend on pins `mcp` below 2.0, you need to resolve that before upgrading.
- **What it means for you**: if you're on AG2, check your `mcp` version pin before upgrading. If you want deterministic, rule-based prompt-injection protection with no LLM call involved, `TealTigerMiddleware` is ready to drop in.

## Today's Takeaway

I used to think an agent's "memory" mostly meant storing conversation history and a skill library. Atlas pushes that idea down to the commit level — the fact that "this line of code came from this agent session, with this prompt" turns out to be its own kind of memory worth indexing, not just the surface-level "who pressed commit" that `git blame` gives you.

## References

- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- [pacifio/atlas](https://github.com/pacifio/atlas)
- [blader/humanizer](https://github.com/blader/humanizer)
- [Nanako0129/sepia](https://github.com/Nanako0129/sepia)
- [firecrawl/pdf-inspector](https://github.com/firecrawl/pdf-inspector)
- [superlinked/sie](https://github.com/superlinked/sie)
- [AG2 v1.0.3 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
