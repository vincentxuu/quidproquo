---
title: "Google's Terminal Agent Plans: The Free Individual Path Is Gone"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, gemini-cli, google, pricing, terminal-agent, antigravity]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 8
tldr: "The paying paths on Google's side: the individual free tier and Gemini CLI access on Google AI Pro / Ultra ended 2026/6/18, leaving individuals with Antigravity CLI or their own paid API key; enterprise licenses and Google Cloud are unaffected. The zero-cost starting option now belongs to someone else."
description: "What the Gemini CLI shutdown actually covered, which paying paths remain for Google terminal agents, and how the plans compare with the rest of this series."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-gemini-cli)

If you're choosing a terminal agent on Google's side, almost everything published in the first half of 2026 is now void. This post does one thing: **lay out the paying paths that still work.**

The product write-ups live elsewhere — [what Gemini CLI was and how its free tier ended](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en), and [its successor Antigravity CLI's installation, authentication, and features](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent-en).

## First, which path are you on

| Who you are | What to use now |
|---|---|
| Individual, want free | **This path is gone.** The Gemini CLI individual free tier and Google AI Pro / Ultra access both ended 2026/6/18 |
| Individual, willing to pay | Antigravity CLI (on a Google AI plan), or keep running Gemini CLI with your own paid API key |
| Org with Gemini Code Assist Standard / Enterprise | Gemini CLI remains fully supported; no migration needed |
| On Google Cloud / Gemini Enterprise Agent Platform | Either works, billed per token |

**Individual developers have no free path left** — that's the significant change in this slot.

## What the shutdown actually covered

Announced May 19, 2026; executed June 18:

| Affected | Detail |
|---|---|
| Gemini CLI individual free tier | Stopped serving |
| Gemini CLI access on Google AI Pro / Ultra | Stopped; Antigravity CLI takes over |
| Gemini Code Assist IDE extensions | Stopped at the same time (they were another shell over Gemini CLI) |
| Gemini Code Assist for GitHub, individual | No new installs from 6/18, full shutdown 7/17 |
| **Unaffected** | Gemini Code Assist Standard / Enterprise licenses, Google Cloud access, paid API keys |

The repo stays maintained under Apache 2.0 and Google committed to keeping pace with new models and security fixes — but the audience is enterprise only.

## Against the rest of this series

Google's position here is now awkward, and worth seeing side by side:

| | Free entry | Individual paid | Rides an existing subscription |
|---|---|---|---|
| **Google (Antigravity CLI)** | ❌ Ended | Per Google AI plan | Google account ecosystem |
| Claude Code | ❌ | $20 / $100 / $200 | — |
| Codex | Limited | $8 / $20 / $100 / $200 | ChatGPT subscription |
| Copilot CLI | ✅ Included in Free | $10 / $39 / $100 | GitHub Copilot license |
| OpenCode | ✅ Open source, bring your key | Per model usage | Copilot / ChatGPT account |
| Amp | ❌ Closed to new signups | $20 / $200 | ChatGPT, X Premium+ |

Google used to be the one strong entry in the free column. That cell is now empty. For a zero-cost start the answer has shifted to open source, bring-your-own-key routes like OpenCode, or Copilot CLI's Free plan.

## The selection rule this episode leaves behind

Neither a free tier nor an open source license is a guarantee you can plan around — [the Gemini CLI post](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en) covers both lessons in full. In selection terms it reduces to one line:

**When evaluating a tool, be clear whether you depend on the code or on somebody's service.** A license protects the first and not the second — Gemini CLI's repo is still there today, and that did nothing for individual users after 6/18.

## References

- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI (official announcement)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017: official shutdown notice (2026/06/18)](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI Discussion #27274: transition announcement and community discussion](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Google Antigravity Blog: Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [The Register: Bye-bye, Gemini CLI; Google nudges devs toward Antigravity](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605)

## Changelog

- 2026-08-19: **Consolidated the three posts in Google's slot to remove overlap.** This post previously also covered Antigravity CLI's features and migration steps, duplicating the site's existing [Antigravity CLI post](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent-en) and the [Gemini CLI post](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en) restored to its own subject. This one narrows to plans and paying paths; product coverage and migration steps go back to those two
- 2026-08-18: The shutdown became fact; full rewrite
- 2026-05-21: Added the discontinuation notice and migration section
