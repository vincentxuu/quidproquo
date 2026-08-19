---
title: "Gemini CLI: Once the Most Generous Free Terminal Agent, Now Enterprise-Only"
date: 2026-03-31
type: project
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, open-source, antigravity]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 6
tldr: "Gemini CLI is Google's open source terminal AI agent (Apache 2.0, ~106.6k stars). It once offered 60 requests per minute and 1,000 per day for free, with a 1M context window. The individual tier stopped serving on 2026/6/18 and Antigravity CLI took over. The project isn't shut down — the repo is still maintained — but it now serves only Gemini Code Assist Standard/Enterprise licenses and paid API keys."
description: "What Gemini CLI is, why its free tier was the most aggressive move in this category, how the 2026/6/18 individual shutdown played out, and which paths still work."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)

Gemini CLI is Google's open source terminal AI agent, built on a ReAct (Reason and Act) loop with built-in tools and MCP servers. For a while it had the most extravagant free tier in this category — **and then it stopped serving individual accounts on June 18, 2026**.

This post covers what it is, why that free-tier strategy is worth remembering, and who can still use it today.

## Where it stands: for individuals, it is gone

The sentence most likely to mislead you: **Gemini CLI was not shut down, but if you are an individual user it is gone as far as you're concerned.**

These are two separate questions with opposite answers:

- **The software** is alive. The repo isn't archived, it's Apache 2.0, it was still cutting nightly builds on 2026-08-19, and commits landed the day before.
- **The service individuals could use** is gone. The "Login with Google" option **has been removed** — not a quota reduced to zero, but the path itself deleted.

So read the table below as "which row are you in," not "is this product dead":

| Path | Still works |
|---|---|
| Free Google account (Gemini Code Assist for Individuals) | ❌ Ended 2026/06/18 |
| Google AI Pro / Ultra subscription | ❌ Ended the same day |
| Gemini Code Assist Standard / Enterprise license | ✅ Unaffected |
| Access through Google Cloud | ✅ Unaffected |
| Paid Gemini / Gemini Enterprise Agent Platform API key | ✅ Unaffected |
| Gemini Code Assist for GitHub (individual) | ❌ No new installs from 6/18, full shutdown 7/17 |

Google published a separate deprecation notice after the shutdown, and its FAQ answers this directly: **"I have a Gemini Code Assist Standard or Enterprise subscription. Am I affected? No, access to Gemini Code Assist IDE extensions and Gemini CLI using Gemini Code Assist Standard or Enterprise subscriptions remain unchanged."** The enterprise side is also still receiving features — the Gemini Code Assist release notes shipped Release Channels for Standard and Enterprise on 2026-08-10.

So "is Gemini CLI dead?" has no single answer; it depends who's asking:

| The question | The answer |
|---|---|
| Can individual developers still use it? | **No.** Login with Google is removed, with no individual entry point to replace it |
| Is the open source project alive? | **Yes.** Daily nightlies, not archived |
| Can paying enterprise customers still use it? | **Yes, and Google explicitly says access is unchanged** — still getting new features |

If you're an individual who wants a Google agent in the terminal, the answer now is **Antigravity CLI**.

**-> [Antigravity CLI: How Google Absorbed Gemini CLI's Terminal into One Agent Harness](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent-en)**

## Installation

```bash
# Run without installing
npx @google/gemini-cli

# Global install
npm install -g @google/gemini-cli
```

Written in Node — a detail its successor changed, as Antigravity CLI is a Go rewrite. Licensed Apache 2.0.

## That free tier

This is the part worth remembering. All it took was a Google account:

| Item | Allowance |
|---|---|
| Requests per minute | 60 |
| Requests per day | 1,000 |
| Context window | 1M tokens |

No credit card, no API key. And it wasn't a stripped-down version — it included the strongest Pro model of the time, the largest context window, and all core features.

How Google arrived at those numbers: they analyzed internal developer usage, found the **heaviest consumers**, and set the free ceiling at **twice** that. The message was plain — if even Google's most intensive engineers couldn't exhaust it, virtually no outside developer would ever hit a paywall.

It lasted about a year.

## Core features

| Feature | Notes |
|---|---|
| Google Search grounding | Built-in search backs answers with live data, no extra setup or cost |
| 1M token context | Large monorepos can load a lot of code at once |
| File operations and shell | The standard agent toolset |
| MCP support | Connect custom tools over the Model Context Protocol |
| GEMINI.md | Project-level instruction file |
| Skills / Hooks / Subagents | Added later; all of these carried over to Antigravity CLI |

Search grounding was its most distinctive feature relative to other terminal agents: the agent could pull live information from the web, and it counted against the free tier.

## Its relationship to Gemini Code Assist

| | Gemini CLI | Gemini Code Assist |
|---|---|---|
| Interface | Terminal | VS Code extension |
| Underneath | Standalone CLI | Powered by Gemini CLI |

Agent mode in the VS Code extension was effectively a subset of Gemini CLI, sharing the same core. That's why the 6/18 shutdown swept up the IDE extension and the GitHub version at the same time — they were different shells over one thing.

## Two things this episode leaves behind

**A free tier is not a moat; it's a marketing budget.** Choosing a tool primarily for its free tier stakes your toolchain on somebody else's marketing decision. The most aggressive free offering this category has seen lasted about a year.

**Open source doesn't mean it can't be taken away.** Gemini CLI is Apache 2.0 and the repo is still there, and none of that helped individual users — because the valuable part was never the source, it was the free inference behind it. A license governs the code, not who is allowed to call the endpoint.

## Who it fits

- **Teams holding a Gemini Code Assist enterprise license**: still a supported path, no need to rush
- **Anyone with a paid Gemini API key**: keeps working, with model availability following your key
- **People studying agent implementations**: Apache 2.0 and still maintained, so it's readable reference code
- **Individuals looking for a free terminal agent**: this door is closed, and there is no paid individual plan that buys it back — using Google's terminal agent means Antigravity CLI

## References

- [Gemini CLI GitHub: google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI (official announcement)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017: official shutdown notice (2026/06/18)](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Google announcement: introducing Gemini CLI, an open source AI agent](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)
- [Google for Developers: Gemini Code Assist consumer account deprecation notice and FAQ](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)
- [Gemini Code Assist FAQ (official answer that enterprise subscriptions are unaffected)](https://developers.google.com/gemini-code-assist/resources/faqs)
- [Gemini Code Assist release notes (enterprise side still shipping features)](https://docs.cloud.google.com/gemini/docs/codeassist/release-notes)
- [Gemini CLI hands-on codelab](https://codelabs.developers.google.com/gemini-cli-hands-on)

## Changelog

- 2026-08-19 (second revision): Re-verified and reframed after being asked "wasn't it shut down?" Saying it "is still a usable product" misleads individual readers — the **individual entry point (Login with Google) has been removed**, and only enterprise subscriptions are unaffected. Added the software-alive vs individual-service-gone split, two harder sources (the official deprecation FAQ and the release notes), and evidence that the repo still cuts daily nightlies
- 2026-08-19: **Restored Gemini CLI as this post's subject.** The previous revision rewrote it as an Antigravity CLI introduction, duplicating the site's existing [Antigravity CLI post](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent-en). Coverage of the successor goes back to that post; this one focuses on Gemini CLI itself — its free tier design, the enterprise paths that survive the shutdown, and the two lessons the episode leaves behind
- 2026-08-18: The shutdown became fact; rewrote the content and corrected the install URL
- 2026-05-21: Added the discontinuation notice (2026/06/18) and migration guidance
