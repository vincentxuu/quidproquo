---
title: "Giving an AI a Cloud Computer: How Simular box Compares With Orgo, E2B and Browser Services"
date: 2026-11-10
category: ai
type: deep-dive
tags: [ai-agent, sandbox, mcp, computer-use, simular]
lang: en
tldr: "To try letting an AI use a cloud computer, start with Simular box: the computer is free and one command connects it to Claude Code or Codex. Its specs are unpublished, each account gets one machine, and it is still in beta. For several machines or always-on use pick Orgo (from $29/month) or Runloop; for commands only, a sandbox such as E2B; for web pages only, a browser service such as Browserbase."
description: "Compares Simular box with Orgo, Runloop, E2B, Windows 365 for Agents, Browserbase and other cloud-computer services on desktop access, persistence, price and limits, with a three-question decision flow and a trial you can run tonight."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-10-simular-box-cloud-computers)

[Simular box](https://box.simular.ai/) is a cloud Ubuntu desktop with Chrome and a shell. Add it as a remote MCP server to Claude, ChatGPT, Claude Code, Codex or Cursor and your AI can open a browser, click, type, read the screen and run commands, without your own computer staying on. The official pricing line is "the box itself is free; its model calls use your account's daily credits."

This post covers what box actually gives you and what it leaves out, then sets it beside similar services: full desktops, shell-only sandboxes and browser-only services. By the end you can decide whether to try box, switch to something else, or skip a full computer altogether. Prices are from each vendor's site in November 2026 and will change.

## What box gives you

Setup is one command, `npx @simular-ai/box connect`. It finds Claude Code, Codex, Cursor, OpenCode, Hermes, OpenClaw and VS Code on your machine and signs each one in with OAuth, so there is no key to paste. Claude on the web and ChatGPT take a custom connector added in settings, using `https://mcp.box.simular.ai/mcp`.

Each account gets one box. It sleeps when idle, wakes in about a second when your AI connects, and keeps its files and state. You can watch the screen live at box.simular.ai/box and take over when you need to.

For when you step away there is `/box:offload`. It copies a git repo into the box and lets a fresh Claude Code, Codex or Cursor session inside keep working; `/box:back` later merges its commits and hand-over notes into your local repo. It only works with git repos, allows up to three sessions per box, and the agent inside the box runs with permission prompts turned off.

Remove box and most of this still exists elsewhere: Orgo and E2B can also give an agent a Linux desktop it can see and click. What box adds is the combination of a free computer and a ready-made MCP entry point, so the coding agent you already use connects directly and you write no screen-driving code.

## Pick the layer first

These services come in three layers: browser only, shell only, or a whole desktop. The higher the layer, the more the AI can do, and the higher the cost and risk. The chart below reduces the choice to three questions.

```diagram
title: Three questions for choosing a cloud computer
desc: Check in order whether the task stays in web pages, needs only commands, or needs Windows, which routes to a browser service, a shell sandbox, managed Windows, or box as the default.
caption: Simplified: prices, quotas and limits are covered below.
---
<svg viewBox="0 0 640 556">
  <path class="dg-line" d="M200 30V58" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 108H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 244H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 380H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 156V194" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 292V330" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 428V466" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="200" cy="24" r="6"/>

  <g>
    <path class="dg-box" d="M200 60L320 108L200 156L80 108Z"/>
    <text class="dg-label" x="200" y="98" text-anchor="middle" dominant-baseline="central">Web pages only?</text>
    <text class="dg-sub" x="200" y="120" text-anchor="middle" dominant-baseline="central">no desktop, no shell</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="80" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="98" text-anchor="middle" dominant-baseline="central">Browser service</text>
    <text class="dg-sub" x="480" y="120" text-anchor="middle" dominant-baseline="central">Browserbase・Steel・Anchor</text>
  </g>

  <g>
    <path class="dg-box" d="M200 196L320 244L200 292L80 244Z"/>
    <text class="dg-label" x="200" y="234" text-anchor="middle" dominant-baseline="central">Commands enough?</text>
    <text class="dg-sub" x="200" y="256" text-anchor="middle" dominant-baseline="central">no screen needed</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="216" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="234" text-anchor="middle" dominant-baseline="central">Shell-only sandbox</text>
    <text class="dg-sub" x="480" y="256" text-anchor="middle" dominant-baseline="central">E2B・Vercel・Fly Sprites</text>
  </g>

  <g>
    <path class="dg-box" d="M200 332L320 380L200 428L80 380Z"/>
    <text class="dg-label" x="200" y="370" text-anchor="middle" dominant-baseline="central">Need Windows?</text>
    <text class="dg-sub" x="200" y="392" text-anchor="middle" dominant-baseline="central">or enterprise IT control</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="352" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="370" text-anchor="middle" dominant-baseline="central">Managed Windows</text>
    <text class="dg-sub" x="480" y="392" text-anchor="middle" dominant-baseline="central">Windows 365 for Agents・Sai</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="24" y="468" width="352" height="64" rx="6"/>
    <text class="dg-label" x="200" y="490" text-anchor="middle" dominant-baseline="central">Try box first</text>
    <text class="dg-sub" x="200" y="514" text-anchor="middle" dominant-baseline="central">Free Linux desktop; scale-up: Orgo, Runloop</text>
  </g>

  <text class="dg-edge" x="338" y="96" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge" x="338" y="232" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge" x="338" y="368" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge" x="210" y="175" text-anchor="start" dominant-baseline="central">No</text>
  <text class="dg-edge" x="210" y="311" text-anchor="start" dominant-baseline="central">No</text>
  <text class="dg-edge" x="210" y="447" text-anchor="start" dominant-baseline="central">No</text>
</svg>
```

## Full desktops

| Service | Desktop | Starting price | When stopped | Know first |
|---|---|---|---|---|
| [box](https://box.simular.ai/) | Ubuntu with Chrome | Free computer; model calls use daily credits | Sleeps, files kept | One machine per account, specs unpublished, beta |
| [Orgo](https://www.orgo.ai/) | Linux; Windows needs the Scale plan or +$15 per machine | $29, $99, $399 monthly; hourly Medium $0.055; $5 starter credit | Files and software kept, memory not | Sells the computer only, no agent |
| [Runloop](https://runloop.ai/pricing) | Ubuntu Desktop plus Browser API | From $250/month on Pro, plus usage | Disk only; suspend needs Pro | Per-machine spec limits not published |
| [E2B Desktop](https://e2b.dev/pricing) | Linux Xfce add-on SDK | Hobby $0 plus $100 one-time credit; Pro $150/month | Pause keeps memory | 1 hour (Hobby) or 24 hours (Pro) per continuous run; one desktop stream at a time |
| [Daytona](https://www.daytona.com/docs/windows-sandboxes) | Linux desktop; Windows marked "coming soon" in v2 docs | $200 free compute | VMs can pause, containers cannot | Public repo is frozen |
| [Windows 365 for Agents](https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents) | Windows Cloud PC | US $0.40/hour, plus $5/month for always-available | Reset after use; reclaimed after 30 idle minutes | Needs Entra, Intune and Azure; individual developers cannot sign up directly |
| [Sai](https://platform.simular.ai/pricing) | Windows or Linux | Explore is free; $50/month, up to 5 machines | Sleeps when idle | Computer and agent sold together; you cannot bring your own agent |

Orgo is the paid counterpart closest to box: persistent, resizable, with MCP and SDKs. You pay for the computer and model usage is separate: plans include an AI allowance, and beyond it you pay the provider's list price plus 10%. Hourly billing costs more than monthly, and Windows cannot be billed hourly.

Runloop has a ready-made [Computer](https://docs.runloop.ai/docs/devboxes/capabilities/computer.md) (keyboard, mouse and screenshot APIs) and a Browser, which makes it the closest in features to box, but suspending a machine with its state kept requires the Pro plan.

E2B and Daytona started as sandboxes and added desktops later. Isolation is stronger (each E2B sandbox is its own Firecracker microVM). The trade-off is that both only expose screen, mouse and keyboard controls, so you write the control loop yourself. Daytona's Windows desktop is marked "coming soon" in the v2 docs, and macOS has to be reserved.

For Windows or enterprise governance there are two options. Windows 365 for Agents lends Cloud PCs to agents from a pool, used through Copilot Studio or Agent 365, and suits companies already under Microsoft 365 management. Sai is Simular's other route: computer and agent sold together, with the trade-off that you cannot bring your own agent. Its OSWorld score is published by Simular itself.

Two options that used to get recommended are no longer available. [Cua](https://cua.ai/docs/cua-sdk/guides/cua-cloud-ended) ended its hosted cloud on 2026-10-18; the docs now say "Cua does not rent you a computer", and you can only run machines in your own AWS, Google Cloud, Azure, Hetzner or Modal account. Simular's own comparison article still lists Cua Fleet as a current product.

[Scrapybara](https://x.com/scrapybara/status/1971655785869726110) shut down its virtual desktop service on 2025-10-15, and the team moved on to Capy.

## Browser only, or shell only

Browser services give you a remote Chromium and nothing else: no desktop, no shell.

| Service | Entry price | Billed by |
|---|---|---|
| [Browserbase](https://www.browserbase.com/pricing) | Free includes 1 hour; $20 includes 100 hours | Browser hours |
| [Steel](https://steel.dev/pricing) | $30 one-time credit; $250/month | Credits and monthly fee |
| [Anchor](https://anchorbrowser.io/pricing) | From $5 in credits | Credits |
| [Browser Use Cloud](https://browser-use.com/pricing) | Usage only, $0.02 per browser hour | Browser hours |

Proxy traffic is usually the largest line on the bill, at $5 to $12 per GB across vendors. Stealth features that get past bot detection are mostly locked to higher tiers, and the official docs of Browserbase, Steel and Browser Use each say they cannot guarantee a pass. If the task stays inside web pages, this layer is cheaper than a full computer and easier to contain. For sites that need a login, see [Giving an Agent Access to Logged-In Websites](/posts/ai/2026-08-22-authenticated-web-agent-safety-en).

If you only run code and never need to see a screen, pick a shell sandbox:

- [Fly.io Sprites](https://fly.io/sprites/): no compute charge while asleep, with an official MCP. In an [October 22, 2026 post](https://fly.io/blog/sprites-block-device/) Fly acknowledged that the old filesystem left some Sprites permanently unable to checkpoint.
- [Modal](https://modal.com/docs/guide/sandboxes): Starter includes $30 of credit per month, with runs up to 24 hours. To see a screen you assemble Xvfb and noVNC yourself; there is an official [example](https://modal.com/docs/examples/computer_use_vnc).
- [Vercel Sandbox](https://vercel.com/docs/sandbox/pricing): Hobby is free with 45-minute runs; stopping snapshots automatically and the next call resumes.
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/): needs a Workers Paid plan ($5/month); the architecture is in [Cloudflare Sandboxes Deep Dive](/posts/ai/2026-08-22-cloudflare-sandboxes-en).
- [Northflank](https://northflank.com/product/sandboxes): the free plan covers up to $20/month of resources, with no time limit; pausing clears RAM.
- [machine0](https://docs.machine0.io/introduction/pricing.md): persistent KVM virtual machines; a stopped machine is still billed in full, only suspend stops compute charges, and there is no free tier.

For how the isolation layers compare, see [Choosing an Agent Sandbox](/posts/ai/2026-10-24-agent-sandboxes-en).

## Limits and risks

- **Specs are unpublished.** Community measurements show about 4 cores, 8 GB of memory and 40 GB of disk, but someone received only about half of that the same day, so treat it as no guarantee.
- **How far the quota goes is unpublished.** The official docs do not say how many credits each action costs, so you find out what the daily allowance covers by trying. They also do not say whether driving box from your own Codex or Claude Code spends credits; one blogger tested it with Codex and saw no deduction.
- **It is still in testing.** The [terms of use](https://www.simular.ai/terms-of-use) say beta features may change or stop at any time and free credits may be reduced at any time.
- **Your screen is collected.** The [privacy policy](https://www.simular.ai/privacy-policy) says it collects screen content, the DOM and URLs you browse, and sends task content to model providers, but does not train on it by default.

The biggest risk is approving everything. To let unattended agents such as `codex exec` use box, the official docs show how to approve all tools, and the same page states the cost:

> anything your AI reads on a web page can steer the box's browser and shell.

The source is box's [Headless agents documentation](https://box.simular.ai/llms-full.txt). In other words, any web page content your AI reads can influence box's browser and shell.

There are no independent reviews yet, so the specs and quotas above rest on official pages and user reports. Users have also reported a long-running Hermes that would not wake after sleep. Separately, box's MCP address moved on 2026-11-04, and the official [setup docs](https://box.simular.ai/docs/mcp.md) say sign-in through the old address can fail until you rerun connect. The millisecond start-up figures vendors quote and Sai's OSWorld score are the vendors' own.

## Overall

Here is how I would choose. To try "an AI that clicks around in the cloud", start with box, which costs nothing. For always-on or multiple machines, pick Orgo for individuals and small teams and Runloop for teams. If a company under Microsoft 365 management needs Windows, choose Windows 365 for Agents. If the task stays in web pages, use a browser service; if it only runs commands, use a sandbox.

Three things you can do tonight:

1. Run `npx @simular-ai/box connect`, choose the coding agent you use, sign in, and paste the official example: "Use box to open Chrome, search Google for "Simular", and summarize the top 3 results."
2. Ask the AI to run `nproc`, `free -h` and `df -h /` inside box, and write down the specs you actually got.
3. Treat the box as a throwaway environment: do not sign in to your main accounts there, and do not set every tool to auto-approve.

## References

- [box site and docs index](https://box.simular.ai/)
- [box full documentation (llms-full.txt)](https://box.simular.ai/llms-full.txt)
- [box docs: MCP server](https://box.simular.ai/docs/mcp.md)
- [simular-ai/box-plugin (includes the offload CLI)](https://github.com/simular-ai/box-plugin)
- [Simular: Terms of Use](https://www.simular.ai/terms-of-use)
- [Simular: Privacy Policy](https://www.simular.ai/privacy-policy)
- [Orgo](https://www.orgo.ai/)
- [Orgo docs: Pricing](https://docs.orgo.ai/guides/pricing.md)
- [Orgo docs: Billing](https://docs.orgo.ai/guides/billing.md)
- [Runloop: Pricing](https://runloop.ai/pricing)
- [Runloop docs: Computer](https://docs.runloop.ai/docs/devboxes/capabilities/computer.md)
- [E2B: Pricing](https://e2b.dev/pricing)
- [E2B docs: Computer use](https://docs.e2b.dev/use-cases/computer-use.md)
- [Daytona docs: Windows Sandboxes](https://www.daytona.com/docs/windows-sandboxes)
- [Microsoft Learn: Windows 365 for Agents](https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents)
- [Microsoft Learn: Windows 365 for Agents pricing](https://learn.microsoft.com/en-us/windows-365/agents/pricing-paygo-always-available)
- [Sai (Simular platform) pricing](https://platform.simular.ai/pricing)
- [Cua docs: Cua Cloud has ended](https://cua.ai/docs/cua-sdk/guides/cua-cloud-ended)
- [Scrapybara sunset notice (X)](https://x.com/scrapybara/status/1971655785869726110)
- [Browserbase: Pricing](https://www.browserbase.com/pricing)
- [Steel: Pricing](https://steel.dev/pricing)
- [Anchor Browser: Pricing](https://anchorbrowser.io/pricing)
- [Browser Use: Pricing](https://browser-use.com/pricing)
- [Fly.io Sprites](https://fly.io/sprites/)
- [Fly.io: Sprites block device](https://fly.io/blog/sprites-block-device/)
- [Modal docs: Sandboxes](https://modal.com/docs/guide/sandboxes)
- [Modal example: Computer use with VNC](https://modal.com/docs/examples/computer_use_vnc)
- [Vercel docs: Sandbox pricing](https://vercel.com/docs/sandbox/pricing)
- [Cloudflare docs: Sandbox](https://developers.cloudflare.com/sandbox/)
- [Northflank: Sandboxes](https://northflank.com/product/sandboxes)
- [machine0 docs: Pricing](https://docs.machine0.io/introduction/pricing.md)
- [Giving an Agent Access to Logged-In Websites](/posts/ai/2026-08-22-authenticated-web-agent-safety-en)
- [Cloudflare Sandboxes Deep Dive](/posts/ai/2026-08-22-cloudflare-sandboxes-en)
- [Choosing an Agent Sandbox](/posts/ai/2026-10-24-agent-sandboxes-en)
