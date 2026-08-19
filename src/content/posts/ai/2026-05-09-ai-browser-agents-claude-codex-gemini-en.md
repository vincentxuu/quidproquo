---
title: "Claude, Codex, and Gemini Are All in the Browser Now: Comparing Three AI Agent Approaches in Chrome"
date: 2026-05-09
updated: 2026-08-19
category: ai
tags: [ai-agent, chrome-extension, claude, codex, chatgpt-atlas, gemini, browser-agent]
lang: en
type: deep-dive
tldr: "Three vendors originally took three routes: Anthropic built an extension, OpenAI built its own browser, Google welded AI into Chrome. By August 2026 there are only two — OpenAI's Atlas stopped working on 9 August, with its capabilities folded back into the ChatGPT desktop app and Codex. The remaining split is 'live alongside Chrome' versus 'be Chrome'."
description: "A comparison of Claude in Chrome, OpenAI's post-Atlas strategy, and Gemini in Chrome — three AI browser agent approaches, their permission models and known security issues, and how to choose between them."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 7
---

> 🌏 [中文版](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini)

In early 2026, all three major AI vendors brought agents into the browser, each by a completely different route: Anthropic built a Chrome extension, OpenAI built its own browser (Atlas), and Google welded Gemini into Chrome itself.

**Six months later, one of those routes is gone.** OpenAI announced Atlas's end in July and **shut it down on 9 August 2026**, folding browser-agent capability back into ChatGPT and Codex. So the answer "build your own browser" was withdrawn by the company that proposed it — which is worth more than any comparison table.

Here's where each stands, how the strategies differ, and how to choose today.

## Claude in Chrome

Anthropic went the extension route and is still there: it is a Chrome extension, explicitly unsupported on other Chromium-based browsers and on mobile. Access requires a paid plan (Pro / Max / Team / Enterprise); there's no free tier. For Enterprise it's off by default — an admin has to enable it, and can restrict it to approved domains.

The design philosophy is **"meet users where they already are"**: don't ask anyone to switch browsers or fight over the default search engine, just sit in a side panel next to Chrome. It sees what you see, and can click, fill forms, work across tabs, and run multi-step workflows.

**The August 2026 change is that the side panel itself got upgraded**: the Chrome side panel now opens as a Claude Cowork session, so conversations are saved to history and portable across desktop, web, and mobile, and skills and connectors work inside the browser. The older experience remains available as the "classic side panel" via the menu (recorded workflows are still classic-only).

### Permission Model: The Names Changed

This is the easiest part to misconfigure from older write-ups. There are now three modes:

| Mode | Behaviour |
|---|---|
| Manual | Asks you before every action — formerly "Ask before acting" |
| Auto | Runs a safety check per action, then proceeds; the default in the Cowork side panel |
| Skip | Stops asking — **formerly "Act without asking"** |

A fixed set of actions is prohibited regardless of mode: purchases and financial transactions, account creation, handling credit card or ID data, permanent deletions, executing trades, and following instructions found in emails or web content. That last one is the hard line against prompt injection.

### Security: The ClaudeBleed Story Isn't Over

In May 2026, LayerX disclosed **ClaudeBleed**: the extension trusts the `claude.ai` **origin** via `externally_connectable` without verifying the actual execution context, so any Chrome extension — even one with zero permissions — could inject instructions, hijack Claude, and act across Gmail, Drive, and GitHub on the user's behalf.

Anthropic shipped v1.0.70 on **6 May 2026**. LayerX's follow-up position is that this was a partial fix: what was added was an approval UI layer rather than validation of message senders, and switching to the no-asking mode or going through the side-panel initialisation path still bypassed it.

**On 14 July 2026, Manifold Security published two related issues** (synthetic clicks not checked against `Event.isTrusted`; a `skipPermissions=true` side-panel parameter), reporting that they had disclosed them on 21 May 2026 and could still reproduce them in v1.0.80 — and that Anthropic closed both reports.

This section is a judgement you have to make yourself: **putting an agent that can act as you across every signed-in service into your browser makes the whole extension ecosystem part of your attack surface.** The minimum is to leave the permission mode on Manual, control what else is installed in that profile, and use a separate profile for sensitive work.

### Developer Path: Claude Code's Browser Integration

Claude Code is a separate line: launch with `claude --chrome` or type `/chrome` in a session, and it attaches to the same extension. It supports Chrome and Microsoft Edge, and the docs note that Chromium-based browsers such as Brave, Arc, Vivaldi and Opera will also detect the extension and connect (not a contradiction of "the extension itself supports only Chrome" above — that is about the extension's supported surface, this is about Claude Code's connection path). It requires a plan billed directly by Anthropic with `/login` authentication (API keys disable the feature), and is unsupported on WSL.

Good fit: people who want to stay in Chrome, don't want to switch ecosystems, and already pay for Claude.
Poor fit: heavy users who want an agent to take over the whole browsing workflow — Anthropic deliberately keeps it in the side panel.

## OpenAI: After Atlas

**ChatGPT Atlas is dead.** OpenAI announced its end on 9 July 2026 and **Atlas stopped working on 9 August 2026**, on the stated grounds of consolidating browser-agent capability back into ChatGPT and Codex — with the added reason that they didn't want users stuck on a discontinued browser that would stop receiving security updates. Bookmarks, open tabs, and history did not transfer automatically; users had to export them before the cutoff.

OpenAI's line now has three entry points:

- **The ChatGPT desktop app**: the officially designated home for deeper agentic browser work, which picked up multiple tabs, downloads, improved navigation, and account login support — things that previously required an actual browser.
- **The ChatGPT Chrome extension / sidebar**: for help in place while browsing in Chrome.
- **The Codex Chrome extension**: unchanged in positioning — built for developers, letting Codex use the browser sessions you're *already signed into* to work with LinkedIn, Salesforce, Gmail, and internal tools, pulling context across tabs and using DevTools, while deliberately not taking over the browser.

The philosophical reversal is the interesting part. Atlas bet on **owning the entire browsing surface**: an agent that owns the browser can do far more than one living inside someone else's. That bet didn't pay off — the cost of maintaining a browser (ongoing security updates above all) plus the difficulty of getting people to abandon Chrome outweighed the integration depth. Having withdrawn it, OpenAI has effectively landed on the same route as Anthropic: **a desktop app plus a Chrome extension.**

Good fit: developers who need signed-in sessions to drive SaaS tools (Codex extension); ChatGPT users who want fuller agentic browsing (desktop app).
Poor fit: anyone who came for Atlas — that product no longer exists.

## Gemini in Chrome

Google is the only one requiring no installation at all — **Gemini is already built into Chrome.**

The base Gemini in Chrome side panel has broad reach, with a long supported-locale list covering North America, the UK, India, Japan, Taiwan, Australia, South Korea, Brazil, the Middle East and more. The conspicuous gap: EU member states are not on the list. The Gemini 3-based side panel launched in the US on 28 January 2026 and expanded to APAC, Latin America, Africa, and the Middle East over the following months.

The headline capability, **Auto Browse** (agentic multi-step work: price comparison, bookings, form filling), has a far narrower gate that has not widened: **US only, Google AI Pro / Ultra subscription only, personal accounts only, English UI only**, and the official page's wording is a gradual rollout (*gradually releasing*, "might not be available to you just yet") rather than an experimental label. Auto browse reached Android after May 2026. The exact gating and daily task limits shift, so treat the [official support page](https://support.google.com/chrome/answer/16821166) as the source of truth.

The philosophy is **first-party integration**: Gemini isn't a guest in Chrome, it's part of Chrome. That enables things nobody else can do: deep integration across Google apps, no separate extension permission step, and features like letting Gemini sign in for you through Google Password Manager (passwords aren't shared with Gemini, and it's revocable) — only the browser vendor can build that. On safety, it shows you a plan and waits for "Start Task" before acting, and you can "take over" or "give back" a task mid-run.

The cost is being tied into Google's ecosystem, with the gate set by region and subscription.

Good fit: US-based Google power users, AI Pro / Ultra subscribers, anyone who wants zero-friction setup.
Poor fit: anyone outside the US wanting auto browse, EU users, people working across platforms and ecosystems.

## Comparing the Three

| Vendor | Form | Who can use it | Main limits |
|---|---|---|---|
| Anthropic | Chrome extension (side panel, now a Cowork session) | Paid plans (Pro / Max / Team / Enterprise) | Chrome only, no mobile; off by default for Enterprise |
| OpenAI | ChatGPT desktop app + ChatGPT / Codex Chrome extensions | Varies by plan and region | **Atlas ended 9 August 2026**; Codex extension has regional limits |
| Google | Built into Chrome's side panel | Side panel widely available; Auto Browse US-only, AI Pro / Ultra | Auto Browse still rolling out; EU not on the supported list |

Exact plan gating, regions, and quotas change often, so this is an outline only — check each vendor's official pages (in the references) before committing.

## In Summary

The original three routes represented three answers to "where should the agent live". Six months on, the market retired one of them:

- **Anthropic**: live inside the browser the user already has — cautious, incremental, safety-model first. Though outside researchers still dispute whether it's cautious enough.
- **OpenAI**: tried building its own browser, withdrew it, retreated to a desktop app plus extensions. It took a year to prove that "replace your whole browser for an agent" is too big an ask.
- **Google**: use the existing Chrome distribution channel to put AI on everyone's desktop — the widest reach, but the genuinely agentic capability is still locked behind the US and a paid subscription.

Decision points:

1. **Where are you?** Auto Browse is US-only today; that filter alone removes half the audience.
2. **Who do you already pay?** All three keep agent capability behind a paid tier — start from your existing subscription.
3. **What's the task?** Developer work needing signed-in sessions → Codex extension or Claude Code's `--chrome`; personal assistant, research, trip booking → Gemini Auto Browse or the ChatGPT desktop app; working alongside the agent while keeping control → Claude in Chrome.
4. **How much risk can you carry?** The attack surface of browser agents (malicious extensions, in-page prompt injection) is real and still being disclosed. For sensitive data, use a dedicated profile and the most conservative permission mode.

The fate of Atlas makes one thing clear: the deciding factor in this round wasn't how capable the agent was, but how much habit change users would accept. The answer was: very little.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Browser Automation and MCP" series.

## References

- [Piloting Claude in Chrome – Anthropic](https://www.anthropic.com/news/claude-for-chrome)
- [Claude for Chrome](https://claude.com/claude-for-chrome)
- [Get started with Claude in Chrome – Claude Support](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)
- [Claude in Chrome permissions guide – Claude Support](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide)
- [Claude Cowork comes to the Chrome side panel – Anthropic](https://claude.com/blog/cowork-chrome-side-panel)
- [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)
- [ClaudeBleed – LayerX (original page removed; Wayback snapshot)](https://web.archive.org/web/20260508132614/https://layerxsecurity.com/blog/a-flaw-in-claudes-browser-extension-allows-any-extension-to-hijack-it/)
- [Flaw in Claude's Chrome extension – CyberScoop](https://cyberscoop.com/claude-chrome-extension-allows-plugins-to-hijack-ai/)
- [Claude for Chrome extension bypass – Manifold Security (Jul 2026)](https://www.manifold.security/blog/claude-for-chrome-extension-bypass)
- [Evolving Atlas into ChatGPT for browser-based agentic work – OpenAI Help Center](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work)
- [OpenAI is discontinuing ChatGPT Atlas – 9to5Mac](https://9to5mac.com/2026/07/09/openai-is-discontinuing-chatgpt-atlas-its-standalone-desktop-browser/)
- [Codex Chrome extension – OpenAI Developers](https://developers.openai.com/codex/app/chrome-extension)
- [Putting Gemini to work in Chrome – Google Blog](https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/)
- [Bringing Chrome AI to Android – Google Blog](https://blog.google/products-and-platforms/products/chrome/bringing-chrome-ai-to-android/)
- [Auto browse in Chrome – Google Support](https://support.google.com/chrome/answer/16821166)
- [Gemini in Chrome – Google](https://gemini.google/overview/gemini-in-chrome/)
