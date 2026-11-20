---
title: "What Counts as an Always-On AI Agent: Four Tests, Four Routes, and What You Can Use in Taiwan"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, personal-agent, always-on-agent, proactive-agent]
lang: en
tldr: "An always-on agent does four things at once: it keeps running while you're away, decides for itself what to do when it wakes, remembers your goals across conversations, and can act for you (send, pay, change). In Taiwan today you can use Tasks in Gemini (with AI Pro), OpenAI Dots (Pro and some Plus accounts), Grok Bot (X Subscription), and self-hosted OpenClaw or Hermes; Muse and Claude Duet are still US-only."
description: "The wave of always-on AI agents that shipped between May and November 2026: how to tell whether a product counts, the four routes defined by whose computer it runs on, representative products on each route, and which ones readers in Taiwan can use now."
series:
  name: "Always-On AI Agents"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-always-on-agents-overview)

It's 7 a.m. on a Monday and you're still asleep. Your chatbot hasn't done anything, because nobody asked it. A different kind of agent has already read your inbox and calendar, noticed that your 10 a.m. meeting clashes with an email that says "can we move to 10:30?", and drafted a reply for you to send when you wake up.

The second kind is what this series is about. Between May and November 2026, Google, xAI, Meta, OpenAI, Anthropic, Cognition and Microsoft each shipped one. Open-source [OpenClaw](https://github.com/openclaw/openclaw) and [Hermes Agent](https://github.com/NousResearch/hermes-agent) got there earlier. What they share: a computer of their own, they keep running after you close the app, and they go looking for work when nobody asked.

This post is the entry point. It covers how to tell whether a product counts, a map that sorts twenty-odd products into four routes, and which ones readers in Taiwan can use now.

## How to tell whether a product counts

Every vendor uses a different name. OpenAI says always-on agent, Anthropic says proactive agent, xAI says AI teammate, Meta and Google say personal AI agent, Cognition says persistent agent, and Microsoft calls its version Autopilot. Names don't help; what the product does does. This series uses four tests:

1. **It keeps running while you're away.** It runs on the vendor's cloud computer, or on a machine you keep switched on. Closing your laptop or locking your phone doesn't stop it.
2. **When it wakes, it decides what to do.** It starts a round of work without a message from you, and when it does, it looks at your goals and data and judges what needs handling now, rather than only running a prompt you wrote in advance.
3. **It remembers your goals across conversations.** A preference you mentioned last week, or a long-term goal you handed it, is still there the next time it wakes.
4. **It can act for you.** Send email, pay, change records, open a pull request. It usually stops to ask before doing these.

Test 2 is the one people blur, and the one this series cares about most. It separates three neighbouring things:

- **A chatbot** answers when you ask and stops when you close the window. It passes none of the four tests.
- **A one-off agent mode** takes one task, runs in the cloud for minutes or hours, and ends when the task is done. It passes tests 1 and 4, not 2 or 3.
- **Scheduled automation** runs the prompt you wrote whenever the clock says so. [Mistral Vibe's scheduled tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks) are time-triggered only, and every run posts its result to your sidebar. [Doubao Work's auto tasks](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks) (in Chinese) likewise run at preset times and push a notification when done. These pass tests 1, 3 and 4, but what they do on waking is fixed by you, and they don't stay quiet when there's nothing to say.

Where exactly the difference lies, and why "staying quiet when nothing needs attention" matters so much, is the subject of the next post, *Anatomy and the three-level ladder*.

## What shipped in six months

```diagram
title: Major always-on agent launches in 2026
desc: Google shipped Gemini Spark first in May; xAI, Meta, OpenAI and Anthropic followed from August to October; on November 17, Cognition, Microsoft and Google all moved on the same day.
caption: Months of 2026. Only major personal and enterprise products with their own post in this series. Open-source OpenClaw and Hermes predate all of these.
---
<svg viewBox="0 0 640 296">
  <path class="dg-axis" d="M40 128H616"/>
  <path class="dg-axis" d="M64 128V134M142 128V134M217 128V134M295 128V134M373 128V134M449 128V134M527 128V134"/>
  <text class="dg-small" x="68" y="148" dominant-baseline="central">5</text>
  <text class="dg-small" x="146" y="148" dominant-baseline="central">6</text>
  <text class="dg-small" x="221" y="148" dominant-baseline="central">7</text>
  <text class="dg-small" x="299" y="148" dominant-baseline="central">8</text>
  <text class="dg-small" x="377" y="148" dominant-baseline="central">9</text>
  <text class="dg-small" x="453" y="148" dominant-baseline="central">10</text>
  <text class="dg-small" x="531" y="148" dominant-baseline="central">11</text>
  <text class="dg-small" x="604" y="148" text-anchor="middle" dominant-baseline="central">mo</text>

  <line class="dg-rule" x1="109" y1="80" x2="109" y2="122"/>
  <circle class="dg-dot dg-dot--accent" cx="109" cy="128" r="6"/>
  <text class="dg-label" x="109" y="44" text-anchor="middle" dominant-baseline="central">Gemini Spark</text>
  <text class="dg-sub" x="109" y="66" text-anchor="middle" dominant-baseline="central">Google · 5/19</text>

  <line class="dg-rule" x1="321" y1="134" x2="321" y2="180"/>
  <circle class="dg-dot" cx="321" cy="128" r="4"/>
  <text class="dg-label" x="321" y="196" text-anchor="middle" dominant-baseline="central">Grok Bot</text>
  <text class="dg-sub" x="321" y="218" text-anchor="middle" dominant-baseline="central">xAI · 8/11</text>

  <line class="dg-rule" x1="391" y1="80" x2="391" y2="122"/>
  <circle class="dg-dot" cx="391" cy="128" r="4"/>
  <text class="dg-label" x="391" y="44" text-anchor="middle" dominant-baseline="central">Muse</text>
  <text class="dg-sub" x="391" y="66" text-anchor="middle" dominant-baseline="central">Meta · 9/8</text>

  <line class="dg-rule" x1="444" y1="134" x2="444" y2="180"/>
  <circle class="dg-dot" cx="444" cy="128" r="4"/>
  <text class="dg-label" x="444" y="196" text-anchor="middle" dominant-baseline="central">Dots</text>
  <text class="dg-sub" x="444" y="218" text-anchor="middle" dominant-baseline="central">OpenAI · 9/29</text>

  <line class="dg-rule" x1="499" y1="80" x2="499" y2="122"/>
  <circle class="dg-dot" cx="499" cy="128" r="4"/>
  <text class="dg-label" x="499" y="44" text-anchor="middle" dominant-baseline="central">Claude Duet</text>
  <text class="dg-sub" x="499" y="66" text-anchor="middle" dominant-baseline="central">Anthropic · 10/21</text>

  <line class="dg-rule" x1="567" y1="134" x2="567" y2="180"/>
  <circle class="dg-dot dg-dot--accent" cx="567" cy="128" r="6"/>
  <text class="dg-label" x="567" y="196" text-anchor="middle" dominant-baseline="central">11/17</text>
  <text class="dg-sub" x="567" y="218" text-anchor="middle" dominant-baseline="central">Devin Bots</text>
  <text class="dg-sub" x="567" y="238" text-anchor="middle" dominant-baseline="central">Autopilot</text>
  <text class="dg-sub" x="567" y="258" text-anchor="middle" dominant-baseline="central">Gemini Tasks</text>
</svg>
```

Google was first. At [I/O on May 19, 2026](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/) it announced Gemini Spark, pitched as an agent that keeps working in the background after you close your laptop or lock your phone. From August to October, xAI's [Grok Bot](https://docs.x.ai/grok-bot/bots), Meta's [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), OpenAI's [Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) and Anthropic's [Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) followed one after another.

November 17 brought three more on a single day. Cognition launched [Devin Bots](https://devin.ai/blog/introducing-devin-bots), which take on long-running responsibilities for engineering teams. Microsoft began rolling out [Autopilot](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/) to Frontier enterprise customers. And Google renamed Spark to [Tasks in Gemini](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/) and made it free in six countries: the US, Japan, Korea, Canada, Australia and India.

## Four routes: whose computer does it run on?

There are many products, but the decision a reader actually faces is this: **whose computer is the agent running on, and who answers for it?** That splits the field into four routes:

| Route | Where it runs | Who manages it | Representative products |
|---|---|---|---|
| 1. The vendor gives you a cloud computer (personal use) | Vendor's cloud VM | Vendor runs the machine; you control access | Tasks in Gemini, Muse, Hark Pro, Instinct, Claude Duet, OpenAI Dots, Grok Bot |
| 2. Working for teams and companies | Vendor cloud or the company's tenant | Team or IT sets permissions, identity and audit | Devin Bots, Perplexity teammates, Microsoft Autopilot, Salesforce long-horizon agents, OpenClaw Enterprise |
| 3. Runs on your own machine | Your laptop, an always-on box or a VPS | You | Open-source OpenClaw, Hermes Agent and others; China's "Claw family" (Kimi Claw, QClaw, AutoClaw and more) |
| 4. Lives inside an app you already use | The super app's back end | The platform | LINE, KakaoTalk, Naver (mostly announced or in closed beta) |

The trade-offs differ a lot. Route 1 is the least work, but the computer, the model and the approval rules all belong to the vendor. Route 2 adds an organisational question — who is accountable when the agent gets something wrong — which is why Microsoft gives every Autopilot its own identity and a named manager. Route 3 lets you change anything, at the cost of owning security and operations yourself. Route 4 needs no extra computer at all: the platform already has your chats and payment methods, which is both the convenience and the source of the privacy questions.

The rest of the series follows these four routes, one post per product within each route. Products that share the same core design and differ only in packaging, such as China's Claw family, share one post and a comparison table.

## Neighbours this series leaves out

Some products are often compared with these but don't pass the four tests:

- **Scheduled tasks in Mistral Vibe and Doubao Work**: as above, what they do on waking is fixed by you, and they report even when there's nothing to say. The next post uses them as the contrast case.
- **One-off cloud agents**: products that take one task and stop when it's done. They miss tests 2 and 3.

They aren't worse; they solve a different problem. If what you want is "every Monday morning, produce a weekly report in this exact format", scheduled automation is more predictable.

## What you can use in Taiwan right now

This table only says yes, no or conditional. Plans, prices and how to sign up live in the final post, *Start read-only*, because that's the part that changes often and should be maintained in one place.

| Product | In Taiwan | Condition |
|---|---|---|
| Tasks in Gemini | Conditional | Requires Google AI Pro or Ultra; the [help page](https://support.google.com/gemini/answer/17094710?hl=en) excludes only the EEA, Nigeria, Switzerland and the UK, and Taiwan isn't one of the six free countries |
| OpenAI Dots | Conditional | ChatGPT Pro, or some Plus accounts as the rollout continues; excludes the EEA, Switzerland and the UK |
| Grok Bot | Conditional | Premium or higher on The X Subscription; the official docs list no regional restriction |
| Meta Muse | No | Launched in the US first; [CNA reported in late September](https://www.cna.com.tw/news/ait/202609270039.aspx) (in Chinese) that it hadn't launched in Taiwan |
| Claude Duet | No | The research preview is US-only, via a waitlist |
| OpenClaw, Hermes Agent | Yes | Open source, install it yourself; you pay for the model |
| LINE | Not yet | [LINE Taiwan](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html) plans an AI agent platform for Official Accounts in Q1 2027, with shopping and gift agents also in 2027 |

Team and enterprise products (Devin Bots, Autopilot and so on) depend on your company's contract and plan, so they aren't in this table.

## Limits to keep in mind

- **Mostly US products.** Routes 1 and 2 are almost all American companies. Chinese and Japanese/Korean products get one post each on routes 3 and 4, with fewer primary sources available.
- **Everything is new.** Most of these products are less than six months old. There are no long-term usage studies; every judgement here is "as of November 2026".
- **Most evidence comes from the vendors.** Independent evidence is a handful of journalist tests, one benchmark company and a few academic evaluations, and the academic ones test models running in the researchers' own agents, not these products. Each post marks vendor numbers as self-reported.
- **The series stops at November 2026.** New products will first be added to the comparison table of the matching route post; they get their own post only if they bring a new design trade-off.

## How to read this series

- **Front to back**: start with the next post, *Anatomy and the three-level ladder*. It makes every product post easier to read, because each one comes down to "what does it do when it wakes?"
- **One route only**: if you only want to self-host, read the two route-3 posts plus *Start read-only*.
- **One product only**: every product post opens with a small table showing which of the four tests it passes.

The security post already published, *[Choosing a personal AI assistant: hosted Duet, Muse, Dots and Grok Bot versus self-hosted OpenClaw and Hermes](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en)*, joins the series in the shared-problems section. It follows one phishing email through five layers — computer, credentials, approval, data, model — and shows who stops it at each.

## References

- [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/) (Google, 2026-05-19)
- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/) (Google, 2026-11-17)
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) (Gemini Apps Help)
- [Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) (Meta, 2026-09-08)
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) (OpenAI Help Center)
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) (Claude Help Center)
- [Create and manage Bots](https://docs.x.ai/grok-bot/bots), [Grok Bot FAQ](https://docs.x.ai/grok-bot/faq) (SpaceXSI Docs)
- [Introducing Devin Bots: from tasks to outcomes](https://devin.ai/blog/introducing-devin-bots) (Cognition, 2026-11-17)
- [Copilot at Microsoft Ignite](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/) (Microsoft, 2026-11-17)
- [Schedule tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks) (Mistral Docs)
- [Using auto task mode](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks) (Doubao Work Help Center, in Chinese)
- [Tech giants race for always-on personal AI agents](https://www.cna.com.tw/news/ait/202609270039.aspx) (CNA, 2026-09-27, in Chinese)
- [LINE Taiwan "LINE CONVERGE 2026" Report](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html) (LY Corporation, 2026-11-13)
- [openclaw/openclaw](https://github.com/openclaw/openclaw), [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) (GitHub)
