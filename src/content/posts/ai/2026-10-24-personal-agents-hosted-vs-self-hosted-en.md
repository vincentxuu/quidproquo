---
title: "Choosing a Personal AI Agent: Hosted Duet, Muse, Dots and Grok Bot vs Self-Hosted OpenClaw and Hermes"
date: 2026-10-24
category: ai
type: deep-dive
tags: [ai-agent, personal-agent, openclaw, hermes-agent, security, self-hosted]
lang: en
tldr: "Duet, Muse, Dots, Grok Bot, OpenClaw and Hermes can all work through your email and accounts in the background. They differ in who holds the computer, the credentials, the approvals and the data. Hosted agents save setup but leave model and data policy to the vendor; self-hosted ones let you swap models and read the source, but you have to turn the sandbox on yourself."
description: "Compares four vendor-hosted personal AI agents with two open-source self-hosted ones: where they run, who holds credentials, who approves actions, where data goes, whether the model can be swapped, and how much safety evidence each side publishes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)

Between August and October 2026, xAI, Meta, OpenAI and Anthropic each launched the same kind of product: a personal AI agent that works in the background without waiting for you to ask. Each has its own cloud computer, can reach your inbox and calendar, and keeps going after you close the app. On the open-source side, OpenClaw and Hermes Agent were already doing the same thing. This post answers one decision: should you use a vendor-hosted agent or run one yourself?

## What the six agents are

| Agent | Made by | How you use it | Cost and access (checked 2026-10) |
|---|---|---|---|
| [Claude Duet](https://claude.com/resources/articles/claude-duet) | Anthropic | iOS, Android, claude.ai | Research preview, US Pro/Max waitlist, included in the plan |
| [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) | Meta | App, WhatsApp | Free tier plus paid plans, mainly US for now |
| [Dots](https://openai.com/index/introducing-dots/) | OpenAI | ChatGPT, Slack | Pro (from $100/month) and Business Premium ($20); the first dot is included |
| [Grok Bot](https://x.ai/bot) | xAI | Desktop, mobile | Premium $30, Super $100, Ultra $200 per month |
| [OpenClaw](https://github.com/openclaw/openclaw) | Independent foundation, MIT | Your own computer, 20+ chat channels | Free software; you pay for model APIs and hosting |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Nous Research, MIT | Terminal, Telegram, Discord and more | Free software; optional Nous Portal subscription |

The first four are hosted: you get an app, and the computer, model and approvals all sit with the vendor. The last two are self-hosted: the code is in your hands and you decide where it runs. This site has a guide to each, in Chinese: [OpenClaw docs guide](/posts/ai/2026-03-28-openclaw-overview) and [Hermes Agent guide](/posts/ai/2026-08-18-hermes-agent-intro).

## Five questions to ask

### 1. Which computer does it run on?

All four hosted agents give you a vendor cloud computer that keeps running when yours is off. Duet uses a virtual machine with a browser. Muse gives each user an isolated Linux VM. Dots has its own cloud computer and needs separate permission to use your laptop. Grok Bot's computers are operated by Cursor, and its docs say on-premises deployment is not supported.

OpenClaw and Hermes run on a machine you choose. OpenClaw's Gateway sits on a laptop or an always-on host, and state, memory and credentials stay there. Hermes has six terminal backends, including local, Docker, SSH and Modal; its README says a $5 VPS is enough, and it has a built-in scheduler, so it can also stay resident.

So "always running in the background" is not something only hosted agents offer. The difference is whose computer it is.

### 2. Who holds the credentials?

The shared hosted-agent pattern is that the model never sees your passwords. Duet handles credentials following the [Managed Agents](https://www.anthropic.com/engineering/managed-agents) design. Muse gives the agent only surrogate tokens and swaps in the real credential at the network boundary. Dots pauses at a login and has you type into a secure form. Grok Bot keeps connector tokens on its backend and hands the computer back to you for logins, two-factor and payment.

These protections have limits. The Dots FAQ says they do not cover passwords you paste into a chat or document yourself.

OpenClaw keeps credentials on your own machine and handles protected secrets with handles and egress substitution. But tools in the main session run directly on the host by default, so you have to configure a sandbox to get isolation.

### 3. Who decides whether an action is allowed?

Every hosted agent defaults to asking before it sends, pays or deletes. The difference is who enforces it. Muse sends approvals to Sentinel, a component separate from the agent, and the approval dialog does not pass through your conversation with Muse. Dots and Grok Bot use a separate review model (Auto-review). Duet reuses the [auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) classifier from Claude Code. Custom rules in Dots cannot switch off core requirements: changing a password and moving money always come back to you.

On the self-hosted side you carry this layer. OpenClaw enforces tool policy in code and makes unknown senders pair first, but sandboxing and exec approvals are off by default; its docs describe the default as a trusted single-operator assistant. Hermes documents command approval, DM pairing and container isolation.

### 4. Where does your data go?

For hosted agents, the data policy is the vendor's.

- **Muse**: Meta says conversations are not shared with its ad systems, but de-identified interaction trajectories are used for training by default and you have to opt out in settings. The current architecture also does not stop Meta from accessing your VM when needed; a fully encrypted Confidential VM is planned for later this year.
- **Dots**: On personal plans, "Improve the model for everyone" controls whether your dots' work is used to improve models; even with it off, human review may occur in safety-related cases. You cannot view or edit individual memories, only delete the whole dot.
- **Duet**: It reuses your Claude account's memory, skills and connectors and can search past chats, governed by the "Search and reference chats" setting.
- **Grok Bot**: With Privacy Mode on, data is not used for training. Cursor picks the models, which may include third-party ones.

OpenClaw, by default, contacts nothing except a daily version check; your prompts go only to the model provider you configure.

### 5. Can you swap the model?

The four hosted agents are tied to their own models: Duet is built on Claude Opus 5.5, Muse uses Muse Spark, Dots uses GPT-6 Astra, and Grok Bot has no user-facing model picker.

OpenClaw and Hermes both let you change model provider. OpenClaw can even plug in vendor harnesses such as Codex or Claude Code as plugins. The flip side of that freedom is that the model's safety behavior changes with it, and the vendor-built protections on top become yours to supply.

## How much you can check

A safety promise can't be verified; what you can check is what the vendor publishes.

The [Dots system card appendix](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2) gives test designs and results: 16,600 attack emails in the bulk test produced no scored success, and in the test where permissions were revoked mid-task, dots passed 45 of 49 episodes. The same document admits moderate scope violations and says known vulnerabilities are still being worked on.

Meta publishes the most detailed architecture: isolated container, Sentinel, surrogate tokens. It gives no attack success rate, but its bug bounty is open to everyone, up to $300,000.

Anthropic says it will publish more on Duet's safety design. What can be referenced today is the Claude Code auto mode write-up, which reports that in Claude Code's own tests the classifier let through 17% of real overeager actions. That is a Claude Code number; Duet's own performance will need its own data.

Grok Bot's docs list controls layer by layer and say Cursor's parent company Anysphere holds ISO/IEC 27001 and 42001, with Grok Bot in scope. Most of those controls are Enterprise-only.

The biggest difference on the self-hosted side is that you can read the source. OpenClaw and Hermes are both MIT-licensed, and OpenClaw also publishes a trust model and security advisories. Open code is not audited code: you have to review it yourself or trust someone who did.

## Limits: what has already happened

The documents from OpenAI, Meta and Anthropic all say prompt injection can only be reduced, and none claims to prevent it. What has happened so far:

- **Muse**: Shared-conversation links could be enumerated; researchers found 6,800 through passive DNS, and the sample included a loan application and an unreleased revenue review. Meta paused sharing. Amazon blocked Muse under its terms of use, saying the agent does not identify itself and appears to store customer credentials; that is Amazon's account. Internal documents obtained by 404 Media show Meta testing human agents placing calls, with testers told only afterwards; Meta says public launch will come with disclosures.
- **Dots**: In the chained-task test, doubling the number of tasks roughly doubled the share of flagged scope violations. OpenAI classes them as moderate, such as carrying information into an unrelated task.
- **Grok Bot**: Bots on one account share a single computer, including browser logins and files, so there is no isolation between Bots.
- **OpenClaw**: CVE-2026-25253, a high-severity one-click remote code execution bug, fixed in version 2026.1.29.
- **Duet**: The announcement itself says it may misread a thread or misjudge urgency, and it checks accounts only every few hours.

## Choosing: what to do tonight

**You want to try one and already pay for ChatGPT or Claude**: pick the one your subscription belongs to; Duet and Dots are both included in the plan. Do four things the first night:

1. Connect read-only permissions first. Muse authorizes read and write separately, and Dots plugin permissions can be set separately too. Let it run a few days before you allow writes.
2. Find the training switch in settings (the training switch in Muse's settings, "Improve the model for everyone" in Dots) and decide whether to turn it off.
3. Type passwords only into the login form it shows you; never paste them into a chat or document.
4. Keep send, pay and delete on per-action approval. Don't pre-approve just to save a few clicks.

**You want to control your data and model**: pick OpenClaw or Hermes and put it on a dedicated machine or VPS, not your everyday work computer. For OpenClaw, follow the [hardened setup](https://docs.openclaw.ai/start/why-openclaw): set `agents.defaults.sandbox.mode: "all"` to turn the sandbox on, put Tailscale or an identity-aware proxy in front of the Gateway, keep the DM policy on pairing, and run `openclaw security audit --deep` after installing. For Hermes, choose Docker or a remote sandbox as the terminal backend. Connect only dedicated low-privilege accounts; for how, see [How to hand a logged-in website to an agent](/posts/ai/2026-08-22-authenticated-web-agent-safety) (in Chinese).

**A team or company**: most hosted-agent controls are Enterprise features. In Dots, local computer access and custom rules are off by default for Enterprise until an admin enables them. In Grok Bot, network allowlists, audit logs and enforced Auto-review are Enterprise-only, and self-serve Teams defaults to allowing all network access. Check which controls your plan has before deciding who gets access.

## The trade-off

Hosted agents give you vendor-built isolation and approvals with little setup, and in exchange the vendor decides the model, the data policy and the update pace. Self-hosted agents let you decide all three, and you carry the sandbox, the updates and the auditing. Neither side has solved prompt injection: when an always-on agent reads a malicious email, what stops it is approvals and isolation, not a promise from the model. Picking a side is picking which layers you want to manage yourself.

## References

**Hosted**
- [Introducing Claude Duet](https://claude.com/resources/articles/claude-duet) (Anthropic)
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) (Claude Help Center)
- [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents) (Anthropic)
- [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) (Anthropic)
- [Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) (Meta)
- [How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) (Meta AI Research)
- [Introducing dots](https://openai.com/index/introducing-dots/) (OpenAI)
- [Dots privacy, security, and safety FAQs](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs) (OpenAI Help Center)
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls), [Connect computers and apps to your dot](https://learn.chatgpt.com/docs/dots/computers-and-apps), [Manage dots permissions and capabilities](https://learn.chatgpt.com/docs/enterprise/dots-admin-guide) (ChatGPT Learn)
- [GPT-6 Astra System Card: dots appendix](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2) (OpenAI Deployment Safety Hub)
- [Sam Altman unveils "dots"](https://www.cbsnews.com/news/sam-altman-openai-dots-chatgpt-agents-safety/) (CBS News, plan pricing)
- [Grok Bot](https://x.ai/bot), [Create and manage Bots](https://docs.x.ai/grok-bot/bots), [Grok Bot security](https://docs.x.ai/grok-bot/security) (xAI)

**Self-hosted**
- [openclaw/openclaw](https://github.com/openclaw/openclaw), [Why OpenClaw](https://docs.openclaw.ai/start/why-openclaw)
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- [OpenClaw RCE vulnerability: CVE-2026-25253](https://www.runzero.com/blog/openclaw/) (runZero)

**Incident reports**
- [Meta Muse exposes users' personal and business secrets when they share conversations](https://arstechnica.com/security/2026/10/meta-muse-exposes-users-personal-and-business-secrets-when-they-share-conversations/) (Ars Technica)
- [Amazon blocks Meta's Muse AI assistant](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/) (GeekWire)
- [Meta Tests Muse AI Agent Calls That Are Actually Made By Humans in a Call Center](https://www.404media.co/meta-tests-muse-ai-agent-calls-that-are-actually-made-by-humans-in-a-call-center/) (404 Media)
- [Anthropic takes on Grok Bot, Meta's Muse, and OpenAI's Dots](https://the-decoder.com/anthropic-takes-on-grok-bot-metas-muse-and-openais-dots-with-its-always-on-agent-claude-duet/) (The Decoder, Grok Bot launched in August)
