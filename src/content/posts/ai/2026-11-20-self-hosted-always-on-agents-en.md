---
title: "On Your Own Machine: The Three Kinds of Self-Hosted Always-On Agents, and Who OpenClaw, Hermes and the Rest Suit"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, hermes-agent, self-hosted]
lang: en
tldr: "\"Self-hosted\" comes in three kinds: open-source software you run yourself, a vendor's app running on your machine, and a vendor running open-source software for you in its cloud. They differ in who controls the machine, the code, the updates and the credentials. Of the two big open-source projects, OpenClaw creates a Proactive check every 30 minutes on new installs, so it wakes up and looks around on its own; but tools run directly on the host by default and you have to turn the sandbox on yourself. Hermes Agent has built-in scheduling and signed webhooks, and its commands also run locally by default, but dangerous commands need approval and are always denied inside scheduled jobs; to make it wake on its own you install the community plugin heartbeat2. Whichever you choose, the machine has to stay on, events need a public URL, and patching is on you."
description: "The three kinds of self-hosted always-on agents and where responsibility falls in each, how OpenClaw and Hermes Agent differ in wake mechanisms, security defaults and cost-saving design, other open-source projects such as QwenPaw and ClickHouse Nerve, Perplexity Personal Computer's \"your machine, the vendor's code,\" and a way to pick a kind based on your own skills."
series:
  name: "Always-On AI Agents"
  order: 14
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-self-hosted-always-on-agents)

| Three kinds of self-hosting | Machine | Code | Examples |
|---|---|---|---|
| Open source you run yourself | Yours | Open source, you update it | OpenClaw, Hermes Agent, QwenPaw |
| A vendor's app on your machine | Yours | The vendor's, the vendor updates it | Perplexity Personal Computer |
| A vendor runs open source for you in its cloud | The vendor's | Open source, packaged by the vendor | KimiClaw and others (next post) |

On [October 31, Pinggy](https://pinggy.io/blog/proactive_ai_agents_compared/) installed OpenClaw and Hermes Agent in clean Docker containers. The goal was the same for both: a weekday 8 AM brief that speaks up only when a decision is needed, plus a notification when a new GitHub issue arrives.

The scheduling command was a single line on each. The snags were elsewhere:

- Both run their schedulers inside the gateway; if the gateway isn't up, nothing fires.
- Hermes needs the time zone set first. In their test, changing it after creating the job didn't move the stored next run.
- The OpenClaw job allowed every tool by default (`"toolsAllow": ["*"]`), so you have to add an allow-list.
- GitHub's webhook has to hit a public URL, and your computer doesn't have one. A free tunnel expires after 60 minutes and the URL changes.

This post is about self-hosted always-on agents: there are actually three kinds of "self-hosted," and OpenClaw, Hermes and other open-source projects each suit different people.

## Three kinds, and who's responsible for what

With the route 1 products earlier in the series, the vendor held the machine, the code, the updates and the credentials. Self-hosting takes some of those layers back, along with the responsibility for them:

| Who's responsible | Open source, run yourself | Vendor app on your machine | Vendor cloud runs open source |
|---|---|---|---|
| Keeping the machine on | You | You | The vendor |
| Updates and security patches | You | The vendor | The vendor |
| Security defaults | You | The vendor | The vendor, partly adjustable |
| Where credentials live | Your machine | Your machine, in the vendor's code | The vendor's machine |
| Model | Your choice, you pay | The vendor decides | The vendor decides |
| Can change the code | Yes | No | No |

The second kind is exemplified by Perplexity Personal Computer: Perplexity [recommends](https://www.perplexity.ai/hub/blog/personal-computer-is-here) running it on a Mac mini left on 24 hours a day, with access to local files and native apps. [The earlier Perplexity post](/posts/ai/2026-11-20-perplexity-teammates-en) covers how it divides work with cloud teammates. The machine is yours, but you can't see or change the code.

The third kind is most common in China and gets its own post next. This post focuses on the first.

## OpenClaw: wakes itself up by default

OpenClaw is the largest open-source always-on agent today: MIT-licensed, with about 395,000 GitHub stars (November 23).

**Wake mechanism**: a Node.js Gateway runs on your machine, and schedules run inside it. A new install creates a [Proactive check](/posts/ai/2026-03-28-openclaw-automation-cron-webhook-en): every 30 minutes, in the main conversation, only when idle, with results sent to your DM. When there's nothing to report, replying `NO_REPLY` sends nothing. That's L3: it decides for itself whether to speak.

It used to be called Heartbeat; it has since been folded into ordinary scheduled jobs.

**Security defaults**: [the sandboxing docs](https://docs.openclaw.ai/gateway/sandboxing) say right at the top that sandboxing is off by default. Tool execution can move into a Docker, Podman, SSH or OpenShell sandbox, but you have to enable it in config. The Gateway itself always stays on the host. The docs admit the sandbox isn't a perfect security boundary; it materially limits file and process access when the model does something dumb.

Pinggy cites the OpenClawCVEs tracker: as of October 31, 543 CVEs named OpenClaw. The biggest ecosystem also has the most patches to track.

## Hermes Agent: clear scheduling, conservative security defaults

Hermes Agent is Nous Research's open-source agent: MIT-licensed, with about 265,000 GitHub stars (November 23).

**Wake mechanism**: the scheduler runs inside the gateway and ticks every 60 seconds. Schedules can be written in plain English ("weekdays at 8am"), and failed runs always notify you. Two features save money:

- **Monitor mode**: runs a cheap check first (a URL or a script), and skips the model entirely if the output hasn't changed.
- **`[SILENT]`**: if a job's final response contains this marker, nothing is delivered.

Events come in through signed webhooks. In Pinggy's test, a request with a valid signature got `HTTP 202` and a wrong signature got `401`.

But what's built into Hermes is L2: it acts when a time arrives or an event comes in. To let it decide when to wake, you install the community plugin [heartbeat2](https://github.com/electricsheephq/heartbeat2). It gives the agent "roles" and "own time": standing responsibilities, a notebook kept between turns, and a rhythm it sets itself. The plugin checks each wake condition with plain code and gives the model a turn only when one is met; you set daily caps on turns, messages and spending, and the agent can tighten them but never widen them. The plugin has only 25 stars and is maintained by one person.

**Security defaults**: commands run locally by default (`terminal.backend: "local"`), with no isolation. But [the security docs](https://hermes-agent.nousresearch.com/docs/user-guide/security) list eight layers of defense, and the one most relevant to always-on use is approval:

- The default `smart` mode has another model assess each command's risk: low-risk commands are approved automatically, clearly dangerous ones are denied automatically, and only uncertain ones come to you.
- When a scheduled job hits a dangerous command, it's denied by default (`cron_mode: deny`), and the same goes for webhook and API sessions where no one can answer.
- Whatever you configure, commands like formatting a disk or `rm -rf /` are always blocked.

One caveat, covered [in this site's Hermes series](/posts/ai/2026-08-18-hermes-agent-terminal-backends-en): switching to a sandbox backend like Docker skips dangerous-command approval, because the project treats the container itself as the boundary. If you've mounted host directories or passed tokens into the container, that assumption no longer holds.

## How OpenClaw and Hermes compare

| | OpenClaw | Hermes Agent |
|---|---|---|
| Built-in wake level | L3: a Proactive check every 30 minutes | L2: schedules and webhooks; L3 needs heartbeat2 |
| Staying quiet when nothing's up | `NO_REPLY` | `[SILENT]`; monitor mode doesn't even call the model |
| Where tools run by default | The host; you enable the sandbox | Locally, but dangerous commands need approval |
| Dangerous commands with nobody watching | Depends on tool policy | Denied by default |
| Ecosystem | Largest, with the most CVEs | Smaller, with clear scheduling and webhook docs |

Pinggy's verdict: OpenClaw has the biggest ecosystem but needs frequent patching; Hermes has the clearest scheduler and webhook model for developers.

## Other open-source projects

| Project | Who built it | Wake mechanism | Status (November 23) |
|---|---|---|---|
| [QwenPaw](https://github.com/agentscope-ai/QwenPaw) (formerly CoPaw) | Alibaba Tongyi Lab's AgentScope team | Scheduled tasks and heartbeat tasks; connects to DingTalk, Feishu, WeChat | Apache-2.0, about 38,000 stars |
| [Nerve](https://github.com/ClickHouse/nerve) | ClickHouse | Built on the Claude Agent SDK; a planning job every 4 hours picks open tasks, explores code and proposes plans, which run only after approval | Apache-2.0, about 120 stars |

QwenPaw was [open-sourced as CoPaw on February 28](https://www.ithome.com/0/924/517.htm) (in Chinese) and renamed in April. It can run entirely on local models; its README says data stays on your machine, with no third-party hosting.

Nerve's [planning flow](https://github.com/ClickHouse/nerve/blob/main/docs/plans.md) is another kind of L3: it's proactive, but every plan waits for human approval. "Plans are never executed automatically." Only after approval does it open an implementation session with full tool access.

GitHub also has plenty of small pre-1.0 projects with single-digit star counts, mostly heartbeat-style. They're fine to study; think twice before giving one your inbox and accounts.

## The cost and upkeep of self-hosting

Whichever open-source project you pick, these are on you:

- **The machine has to stay on**: if the gateway stops, schedules don't fire. Closing a laptop is the same as turning it off. A common answer is a small always-on box or a cloud VM.
- **Events need a public URL**: webhooks have to reach you from outside. Tunnels, reverse proxies or a VPN are yours to set up, and free tunnels expire and change URLs.
- **Patching is yours to track**: open-source projects move fast and have plenty of vulnerabilities. Decide up front who upgrades and how often.
- **You pay for the model**: waking every 30 minutes is 48 model calls a day. Use monitor mode or heartbeat2's budget caps to hold the count down.
- **You tighten the defaults**: tool allow-lists, sandboxes and approval modes all default toward "works first."

## Pick a kind based on your skills

Use these two questions:

**1. Can you keep an always-on machine running and track patches yourself?**

- No → don't run open source yourself. Use the cloud products from route 1, or a hosted service of the third kind.
- Yes → go to question 2.

**2. How many layers do you want to control?**

| You want | Pick | You're responsible for |
|---|---|---|
| It runs on my machine and touches my local files, nothing more | A vendor app, such as Personal Computer | Keeping the machine on |
| My choice of model, code I can change, a big ecosystem | OpenClaw | The machine, patches, enabling the sandbox, tightening the tool list |
| Clear scheduling and webhooks, conservative when unattended | Hermes Agent | The machine, patches, a public URL; a plugin for L3 |
| Data never leaves my machine | QwenPaw with local models | The machine, patches and hardware for local models |
| Proactive proposals, but everything waits for my approval | Nerve | The machine, patches, and reviewing every plan |

Once you've picked, start with one scheduled job that has a quiet path, then add one event trigger. Turn approvals on for anything that sends, pays or deletes.

## Who it suits, and who it doesn't

**Suits you if:**
- You're a developer comfortable with the command line who can keep an always-on machine running.
- You want to choose your own model, control costs, or understand how agents work.
- You don't want to hand your data to a cloud vendor.

**Doesn't suit you if:**
- You don't want to maintain a machine or track patches: cloud products are much less work.
- You don't have time to tighten defaults: open-source defaults lean toward "works first."
- You need a vendor to be accountable when something goes wrong: open-source projects come with no support contract.

Open-source projects have no regional restrictions and can be installed directly in Taiwan; which models you can use depends on whose API you connect.

Next, [how China wraps the same open-source core into products](/posts/ai/2026-11-20-china-claw-family-en): cloud hosting, one-click installers, and messaging-app integrations. The deeper the wrapping, the more convenient it gets, and security tests suggest the larger the attack surface becomes.

## References

- [Proactive AI Agents Compared: Dots vs Muse vs Grok Bot vs Instinct vs Hermes vs OpenClaw (2026)](https://pinggy.io/blog/proactive_ai_agents_compared/) (Pinggy, 2026-10-31)
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) (OpenClaw docs)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) (Hermes Agent docs)
- [electricsheephq/heartbeat2](https://github.com/electricsheephq/heartbeat2) (GitHub)
- [agentscope-ai/QwenPaw](https://github.com/agentscope-ai/QwenPaw) (GitHub)
- [阿里桌面 Agent 工具 CoPaw 开源](https://www.ithome.com/0/924/517.htm) (IT之家, 2026-02-28, in Chinese)
- [ClickHouse/nerve](https://github.com/ClickHouse/nerve) and [Proactive Task Planning](https://github.com/ClickHouse/nerve/blob/main/docs/plans.md) (GitHub)
- [Personal Computer is here](https://www.perplexity.ai/hub/blog/personal-computer-is-here) (Perplexity)
