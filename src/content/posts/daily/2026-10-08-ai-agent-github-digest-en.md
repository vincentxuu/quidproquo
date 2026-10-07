---
title: "AI Agent GitHub Digest — 2026-10-08"
date: 2026-10-08
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, coding-agent]
lang: en
description: "Three small tools built around coding agents — fixing the translated-sounding prose AI generates in Japanese, letting an agent direct its own explainer video, and compressing a million records of history into a few hundred tokens — plus Claude Code putting Haiku 5.5 on by default"
tldr: "**yomiyasu** (1,697★) is an Agent Skill that fixes the translated-sounding prose AI tends to generate in Japanese, built around 7 structural rewriting principles. **showtime** (172★) lets Claude Code, Codex, or Cursor direct an explainer video from one sentence, rendered entirely on your own machine with no cloud AI. **leviathan** (659★) is a single-binary full-text index whose own benchmark shows a median of 436 tokens to answer a question over a million records — two orders of magnitude less than grep. Claude Code v2.1.293 put Haiku 5.5 on by default in the API (1M context, $0.10/$0.50 per Mtok) and fixed a bug where Claude could treat its own pre-compaction work as already done and redo it; CrewAI 1.15.24 changed `crewai eval` to fail with a nonzero exit code when the gate doesn't pass."
series:
  name: "AI Agent GitHub Digest"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-08-ai-agent-github-digest)

## Today's Highlight

Today's interesting news isn't about the models themselves — it's three skills/tools built around coding agents, each solving one specific annoyance: yomiyasu fixes the way AI-generated Japanese reads like a translation, showtime lets an agent direct its own explainer video, and leviathan lets an agent answer questions over a huge pile of history using a few hundred tokens instead of stuffing it all into context. The same day, Claude Code 2.1.293 put Haiku 5.5 on by default and, in passing, fixed a bug where it could mistake its own pre-compaction work for already done and redo it.

## Trending Repos

### yomiyasu ⭐ 1,697 (shipped 7 days ago)

[GitHub](https://github.com/nanaism/yomiyasu) · Python · MIT

- **What it is**: An Agent Skill that rewrites AI-generated Japanese back into natural prose. It targets the structural roots of "AI smell": unnatural metaphors, dropped subjects that force the reader to guess, inanimate subjects paired with emotional verbs, and bullet points/bold text piling up until they dilute the actual content.
- **Why it's worth watching**: Most "de-AI-ify" approaches work by banning a list of words, so the model just swaps in a different vague word and keeps the same structural problem. yomiyasu instead defines 7 structural rewriting principles (checking subject-predicate relationships, cleaning up anthropomorphism, swapping metaphors for plain language, never adding information that wasn't there), with worked before/after examples, meant to be fed directly into Claude Code, Codex, or Cursor rather than run once as a prompt. It's scoped to formal-but-readable prose — technical docs, specs, PR descriptions — not creative writing.
- **Tech stack**: Agent Skill (SKILL.md) + a Japanese-corpus validation method the author documented separately
- **Getting started**: Low — drop it into any coding agent that supports Agent Skills; no extra service or API key needed.

---

### showtime ⭐ 172 (shipped 9 days ago)

[GitHub](https://github.com/FavioVazquez/showtime) · Python · MIT

- **What it is**: A local video studio for coding agents. Describe a video in one sentence, and the agent acts as director — planning shots, music, captions, and transitions — while the actual rendering, compositing, and encoding run entirely on your own machine, with no cloud AI service and no API key. It works with Claude Code, Codex, Cursor, Devin, and any agent that supports the Agent Skills standard.
- **Why it's worth watching**: Most "AI-made video" tools ship your material off to a cloud generation model. This one flips that — motion graphics, voice-over, sound design, captions, and editing are all assembled from local tooling (ffmpeg, Manim, local TTS), with the agent only making directorial decisions rather than generating pixels itself. That sidesteps copyright and data-leak concerns, but also means it can't produce the kind of out-of-nowhere imagery a generative video model can — it's better suited to explainer- and product-style motion graphics.
- **Tech stack**: ffmpeg + Manim (animation) + local TTS + the Agent Skills standard
- **Getting started**: Medium — install uv and Node.js 22/24 first, then add it through Claude Code's plugin marketplace; the project is still at version 0.4 and marked early.

---

### leviathan ⭐ 659 (shipped 2 days ago)

[GitHub](https://github.com/elstongun/leviathan) · Rust · Apache-2.0

- **What it is**: A single static binary that turns records — JSONL, JSON, CSV/TSV, SQLite, or anything a database CLI can export — into a ranked full-text index, so an agent can ask a plain-language question and get back a short, cited answer card instead of having the model paw through a dumped history in its own context.
- **Why it's worth watching**: The author's own published benchmark shows that on a 1-million-record dataset (678 MB), leviathan answers a question using a median of 436 tokens; the best grep strategy — matching an entity plus the question's keywords — needs 107,000 tokens, and grepping a full entity history needs 209,000 — two orders of magnitude more, with leviathan's median latency at 33ms. For agents that need to search through ticket histories, logs, or support records, that turns context cost from something that scales with data size into something close to flat. MCP integration is optional — it works fine as a plain CLI without it.
- **Tech stack**: a single static Rust binary + a full-text index + an optional MCP server
- **Getting started**: Low — `cargo install leviathan-index`, then `leviathan index` and `leviathan search` against any tabular data; no extra service required.

## Notable Releases

### Claude Code v2.1.293

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.293)

- **Key changes**: Added Claude Haiku 5.5 (`claude-haiku-5-5`), now the default Haiku model on the Anthropic API, with 1M context at $0.10/$0.50 per Mtok ($0.50/$2.50 for prompts over 100K tokens); added an `isDeferred` flag to `$.tool.register` for mod authors, letting a tool's schema be listed in the prompt from the start instead of waiting behind tool search; fixed a bug where Claude could treat its own last actions before a context compaction as already done and retract or redo finished work; fixed a memory leak in HTTP MCP connections.
- **Breaking Changes**: None.
- **What it means for you**: If you're building Claude Code mods or plugins, `isDeferred` and the new `agentType` field on `subagentStatusLine` are worth wiring up. If you run a lot of low-cost work through Haiku, it's worth checking whether 5.5's pricing and context window are a better fit.

---

### CrewAI 1.15.24

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.24)

- **Key changes**: `crewai eval` now prints a markdown brief when invoked by an agent; added `crewai eval --models` and `llm_overlay` to swap out the models behind roles for an eval run; added experimental turn/reply identities and a job lifecycle/runner; added Oracle integrations; message summarization was folded into `SummarizeMessages`, and context-window handling was centralized.
- **Breaking Changes**: None explicitly flagged, but `crewai eval`'s failure behavior changed — if the gate doesn't pass and nothing was traced unattended, it now exits with code 1 instead of quietly passing through.
- **What it means for you**: If `crewai eval` is wired into CI as a gate, make sure your pipeline actually handles a nonzero exit code after upgrading — otherwise a run that used to silently do nothing could suddenly turn your pipeline red.

## Today's Takeaway

I used to assume "de-AI-ifying" text was something only manual editing or a banned-word list could slowly grind down. Seeing yomiyasu break it into 7 checkable structural rules made it clear that "reads like a translation" is actually a structurally diagnosable problem — subject-predicate relationships, anthropomorphism — not some vague intuition.

## References

- [nanaism/yomiyasu](https://github.com/nanaism/yomiyasu)
- [FavioVazquez/showtime](https://github.com/FavioVazquez/showtime)
- [elstongun/leviathan](https://github.com/elstongun/leviathan)
- [elstongun/leviathan — Benchmarks](https://github.com/elstongun/leviathan/blob/main/docs/BENCHMARKS.md)
- [Claude Code v2.1.293 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.293)
- [CrewAI 1.15.24 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.24)
