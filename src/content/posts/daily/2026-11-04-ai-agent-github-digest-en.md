---
title: "AI Agent GitHub Digest — 2026-11-04"
date: 2026-11-04
category: daily
tags: [ai-agent, github, open-source, daily, security, mcp, computer-use, coding-agent]
lang: en
description: "DeepSeek open-sources a coding agent that picks up its own GitHub issues, NVIDIA's skill scanner lands right as an MCPhantom security report breaks, and Mika operates your phone from a hidden background screen — two repos expand what agents can do on their own, two clean up after them"
tldr: "deepseek-ai/dsh-superagent-prototype (⭐16k) is DeepSeek's open-sourced research prototype: it listens to GitHub (and optionally Feishu), opens a work item when asked, finishes it in its own session, and reports back in the original conversation — usually with a PR. NVIDIA/SkillSpector (⭐24k) scans agent skills for 71 vulnerability patterns — prompt injection, data exfiltration, and more — before you install them, landing the same day a Glow Labs report on 'MCPhantom' broke. mksglu/context-mode (⭐33k) sandboxes tool calls and indexes the output in SQLite FTS5, cutting what hits the context window by 98%. wangzan101/Mika (⭐6k) operates any app or webpage on a hidden background screen while you keep using your phone, handing logins, codes, and payments back to you. On the framework side: Haystack v2.31.1 patches two CVEs that arrived through transitive httpx/openai dependencies, and Pydantic AI v2.65.0 adds a ConversationStore plus a batch of model-fallback and error-classification compatibility fixes."
series:
  name: "AI Agent GitHub Digest"
  order: 81
---

> 🌏 [中文版](/posts/daily/2026-11-04-ai-agent-github-digest)

## Today's Highlight

Today's four repos split into two pairs that push against each other: deepseek-ai/dsh-superagent-prototype and wangzan101/Mika both extend how much an agent can do unsupervised — one takes over a repo's work items and opens its own PRs, the other takes over a phone's background screen and operates apps on its own. NVIDIA/SkillSpector and mksglu/context-mode exist to clean up after that autonomy — one scans a skill for malicious code before it's installed, the other keeps a long-running session's own tool output from filling up the context window until the agent forgets what it was doing.

## Trending Repos

### deepseek-ai/dsh-superagent-prototype ⭐ 16k

[GitHub](https://github.com/deepseek-ai/dsh-superagent-prototype)　·　TypeScript　·　MIT

- **What it is**: DeepSeek's own open-sourced research prototype — a proactive coding agent scoped to a single GitHub repo, packaged as a bundle for DeepSeek Harness. It listens to GitHub (optionally Feishu too), and when someone it's allowed to answer asks for work, it opens a work item, does it in its own agent session and working directory, then reports back in the original conversation — typically a pull request.
- **Why it matters**: This isn't another "write code for you" framework — the interesting part is the operating philosophy it states up front: take as little human attention as possible, give as much value as possible. So it only acts when asked, or when a rule the team itself wrote allows it, and only speaks when someone needs to act or can use the result; `docs/000-philosophy.md` spells out both the principle and what it demands of the operator. DeepSeek is upfront that this is a research prototype, not a product — much of the code was written by coding agents, the style isn't guaranteed consistent, and some designs discussed in their own write-up aren't implemented in this version yet. Hitting 16k stars in four days despite that disclaimer says something about demand for an agent that can just pick up a work item on its own.
- **Tech stack**: TypeScript; GitHub/Feishu event listeners; a separate agent session and working directory per work item; a web panel for anything that needs a human
- **Difficulty**: Medium — setup has enough steps that the official path is to have your own coding agent read `SETUP.md` and walk you through it, asking one question at a time and showing the full plan before acting. Given the "research prototype" label, try it on a throwaway repo first.

---

### NVIDIA/SkillSpector ⭐ 24k

[GitHub](https://github.com/NVIDIA/SkillSpector)　·　Python　·　Apache-2.0

- **What it is**: A security scanner you run before installing an agent skill (the kind Claude Code, Codex CLI, or Gemini CLI use) — covering 71 vulnerability patterns across 17 categories, from prompt injection to data exfiltration to privilege escalation, with a 0–100 risk score and recommendations.
- **Why it matters**: The number NVIDIA publishes in its own README is striking — across a 31,132-skill analyzed sample, 26.1% contain vulnerabilities and 5.2% show likely malicious intent. The timing lines up almost too well: the same day, security firm Glow Labs published a report on "MCPhantom" — AI coding agents repeatedly installing archived, never-to-be-patched MCP servers purely from the model's training-data memory, including one Puppeteer server with a remote-code-execution flaw that's been downloaded over 17.3 million times. SkillSpector addresses the "scan before you install" half of that problem, and sits inside NVIDIA's own Verified Skills pipeline — skills that pass get published, scanned, evaluated, and signed, to the NVIDIA skills catalog. It runs a two-stage analysis: fast static analysis first, with an optional LLM semantic pass for more precision, plus live CVE lookups against OSV.dev.
- **Tech stack**: Python 3.12+; AST static analysis + YARA rules + taint tracking; live OSV.dev CVE lookups with offline fallback; Terminal/JSON/Markdown/SARIF output
- **Difficulty**: Low — `uv tool install` and you're scanning, no API key needed for the static pass; the optional LLM semantic layer needs a provider key of your own.

---

### mksglu/context-mode ⭐ 33k

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　ELv2

- **What it is**: An MCP server that sits between a coding agent and the tools it calls, intercepting the raw data those tools return (screenshots, logs, CSVs) so only the useful part ever reaches the context window.
- **Why it matters**: The author's own write-up gives concrete numbers — a single Playwright snapshot drops from 56 KB to 299 bytes, 20 GitHub issues go from 59 KB to 1.1 KB, and a full session's output shrinks from 315 KB to 5.4 KB, a 98% reduction. The mechanism: tool calls run in an isolated subprocess and only stdout reaches context; the rest lands in SQLite, indexed with FTS5 full-text search and BM25 ranking, retrieved by semantic query only when actually needed instead of being dumped back wholesale. When a session gets compacted, it doesn't shove that data back into context either — it just remembers where things left off. Worth flagging: it ships under the Elastic License 2.0 (ELv2) — source-available, but not an OSI-recognized open-source license, so check the terms before commercial use.
- **Tech stack**: TypeScript; tool calls run in isolated subprocesses; SQLite FTS5 with BM25 ranking for retrieval; hooks into 17 agent platforms (Claude Code, Codex, Pi, OpenCode, Gemini CLI, and more) via MCP
- **Difficulty**: Low — `npm install -g context-mode`, then register it as the MCP server for your harness and add the matching hooks config.

---

### wangzan101/Mika ⭐ 6k

[GitHub](https://github.com/wangzan101/Mika)　·　Kotlin　·　Apache-2.0

- **What it is**: A phone-based AI assistant — say what you need, and it opens apps, taps, types, and scrolls on a hidden background screen until it's done, while you keep using your phone up front.
- **Why it matters**: Unlike most "computer use" agents that start on the desktop, Mika goes straight for the phone — and instead of relying on each app's own API, it looks at the screen and finds buttons the way a person would, so it isn't tied to any particular app. Its built-in browser can also take a command right on the page you're reading. By design, it keeps a human in the loop where it counts: logins, verification codes, and payments always get handed back to you, never automated away. There's no vendor server — bring your own model API key, or sign in with a ChatGPT, xAI, or OpenRouter account, and data stays on the phone. Reaching 6k stars in four days says the "mobile computer-use agent" space is still fairly open.
- **Tech stack**: A Kotlin Android app; reads the screen and simulates input on a hidden background screen, similar to an accessibility service; model layer takes a BYOK API key or third-party sign-in; local-first with no vendor server
- **Difficulty**: Medium — chatting or browsing works right after installing the APK, but operating phone apps requires walking through a wireless-debugging pairing step in the setup wizard.

## Notable Releases

### Haystack v2.31.1

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1)

- **Key changes**: Raises the floor on two transitive dependencies pulled in through `httpx`/`openai`/`posthog` — `anyio` to 4.14.2+ (fixes CVE-2026-63374) and `certifi` to 2026.10.19+ (drops trust in the eMudhra/emSign certificate authorities whose private keys were compromised).
- **Breaking changes**: None — it's purely a dependency floor bump, no API impact.
- **What it means for you**: Both packages arrive transitively, so they're easy to miss in your own `requirements.txt`. Upgrade to v2.31.1, or confirm your `anyio`/`certifi` versions meet the floor yourself; if you pin `certifi` elsewhere, raise that pin too.

---

### Pydantic AI v2.65.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)

- **Key changes**: Adds `ConversationStore` (a write-once message log for conversations, with `Conversation.revision` catching conflicting saves); `ModelFallback` now falls back to the next model when one refuses to answer, and `fallback_on`'s `ContentFilterError` can match that kind of refusal; importing a name removed in V2 (like `OpenAIModel` or `MCPServerStdio`) now tells you exactly what to use instead.
- **Breaking changes**: No major API breaks — mostly compatibility adjustments: Z.ai balance/plan-limit 429s now raise `ModelQuotaExceededError` instead of `ModelRateLimitError`, and Temporal no longer retries model errors that can't succeed on retry by default (tunable via `non_retryable_model_errors`).
- **What it means for you**: If you pattern-match on exception types to decide whether to retry, check both of those reclassifications. Anyone using `ModelFallback` gets an extra layer of protection — a model refusal can now trigger a fallback too.

## Today's Takeaway

I used to think "agent autonomy" and "agent security" were two separate lines of progress moving at their own pace. Seeing SkillSpector land the same day as the MCPhantom report made it clear they're really the same people hitting the same wall at the same time — agents now genuinely go install whatever package "sounds right" from memory, whether or not it's long since archived and unmaintained. The push and the guardrail have to grow together, or the faster autonomy moves, the bigger the hole it leaves behind.

## References

- [deepseek-ai/dsh-superagent-prototype — GitHub repo](https://github.com/deepseek-ai/dsh-superagent-prototype)
- [NVIDIA/SkillSpector — GitHub repo](https://github.com/NVIDIA/SkillSpector)
- [AI coding agents are installing MCP servers that will never be patched (MCPhantom report) — Help Net Security](https://www.helpnetsecurity.com/2026/11/03/mcphantom-deprecated-mcp-servers/)
- [mksglu/context-mode — GitHub repo](https://github.com/mksglu/context-mode)
- [Stop Burning Your Context Window — We Built Context Mode (author's benchmark numbers)](https://mksg.lu/blog/context-mode)
- [wangzan101/Mika — GitHub repo](https://github.com/wangzan101/Mika)
- [Haystack v2.31.1 release notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1)
- [Pydantic AI v2.65.0 release notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)
