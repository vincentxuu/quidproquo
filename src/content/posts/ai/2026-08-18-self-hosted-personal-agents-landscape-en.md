---
title: "Nine Self-Hosted Personal Agents, One Security Question: Where Does the Execution Boundary Go?"
date: 2026-08-18
category: ai
type: deep-dive
tags: [openclaw, hermes-agent, ai-agent, security, sandbox, open-source]
lang: en
tldr: "OpenClaw has 386k stars to Hermes Agent's 232k, yet Hermes passed it on OpenRouter daily tokens back on 2026-05-10 (224B vs 186B). The nine self-hosted agents that appeared this year aren't nine competitors — they're nine incompatible answers to one question. CVE-2026-44112 broke OpenClaw's own sandbox, and in the Meta alignment director's inbox incident there was no attacker at all: context compaction ate the safety instruction."
description: "A side-by-side reading of OpenClaw, Hermes Agent, NanoClaw, PicoClaw, ZeroClaw, IronClaw, Moltis, Moltworker and LibreFang — why this category fragmented, along which three axes, and which one fits which situation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-self-hosted-personal-agents-landscape)

One line in OpenClaw's README is the key to understanding the last six months of agent tooling:

> Tools run on the host for the main session unless you configure sandboxing.

Your main session's tools run on your machine unless you go and configure a sandbox yourself. That isn't an oversight — it's a deliberate trade. For an agent to actually get work done it has to reach your files, your credentials, your shell. And that same agent also has to read the link a stranger dropped in a Telegram group.

This piece reads nine projects side by side: **OpenClaw, Hermes Agent, ZeroClaw, NanoClaw, PicoClaw, IronClaw, Moltworker, Moltis, LibreFang**. They are not nine competitors. They are nine answers to one question — **where does an agent's execution boundary belong?** — and the answers are mutually incompatible. That is why this category will not converge on a single winner.

## What the category looks like

The shape is consistent: a persistent daemon (not a session-scoped CLI), a gateway that pulls chat channels in, a tool belt (shell / browser / HTTP / MCP), memory that survives across sessions, and cron scheduling. You send one message from Telegram and it finishes the job overnight.

So is the problem. That shape simultaneously satisfies three conditions: it **ingests untrusted input** (group messages, web pages, email), it **has access to sensitive data** (your files and credentials), and it **can communicate outward** (it has to answer you). Simon Willison named this combination the lethal trifecta in June 2025, and his point was that no single ingredient is the danger:

> The only way to stay safe there is to avoid that lethal trifecta combination entirely.

A self-hosted always-on personal agent is the fullest possible embodiment of that trifecta — its product definition *requires* all three at once.

Hard numbers for the nine (GitHub API, snapshot of 2026-08-18):

| Project | ★ | Language | License | Last push |
|---|---|---|---|---|
| openclaw/openclaw | 386,596 | TypeScript | see repo | 2026-08-18 |
| NousResearch/hermes-agent | 232,194 | Python | MIT | 2026-08-18 |
| zeroclaw-labs/zeroclaw | 32,610 | Rust | Apache-2.0 | 2026-08-18 |
| nanocoai/nanoclaw | 30,537 | TypeScript | MIT | 2026-08-17 |
| sipeed/picoclaw | 29,869 | Go | MIT | 2026-08-14 |
| nearai/ironclaw | 12,606 | Rust | Apache-2.0 | 2026-08-18 |
| cloudflare/moltworker | 9,946 | TypeScript | Apache-2.0 | **2026-05-09** |
| moltis-org/moltis | 2,824 | Rust | MIT | 2026-08-18 |
| librefang/librefang | 359 | Rust | MIT | 2026-08-18 |

Moltworker is the only one that has not moved in three months. Check its status before you pick it.

## Two poles: ecosystem versus learning loop

**OpenClaw** is the origin. Austrian developer Peter Steinberger started it in November 2025 as Clawdbot, renamed it Moltbot, then OpenClaw, and it went viral in January 2026. On 2026-02-15 he joined OpenAI. Sam Altman's post:

> OpenClaw will live in a foundation as an open source project that OpenAI will continue to support.

Steinberger put it more bluntly himself: he wanted to change the world, not build a big company. The project now sits in an independent foundation with OpenAI sponsoring it. Its asset is the ecosystem — ClawHub, the largest skill marketplace in the space, and the widest channel coverage (I took apart its almost-everything-is-a-plugin install model in [the channels overview](/en/posts/ai/2026-03-28-openclaw-channels-overview)).

**Hermes Agent** is the other pole. Nous Research shipped it on 2026-02-25 — the official releases page describes it as "An autonomous agent that lives on your server, remembers what it learns, and gets more capable the longer it runs" — under MIT. Its core bet is not breadth but a **closed learning loop**: the agent curates its own memory, spins completed complex tasks into skills, improves those skills during use, and uses SQLite FTS5 over past sessions plus LLM summarisation for cross-session recall.

(I covered the memory and skill machinery in [a separate post](/en/posts/ai/2026-08-18-hermes-agent-memory-skills); its sandbox backends carry a counterintuitive side effect, namely that [switching to a sandbox turns off dangerous-command approval](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends).)

The detail worth noticing is that Hermes ships `hermes claw migrate` — it detects `~/.openclaw` and imports SOUL.md, memories, skills and the command allowlist. The challenger made "move off the incumbent" a first-class feature. Stranger still, both use the same SKILL.md standard, so Hermes treats ClawHub as one of its own install sources: OpenClaw's marketplace feeds its largest competitor.

**And then the star count misleads everyone.** OpenClaw has 1.66× the stars, but actual OpenRouter token volume runs the other way:

- 2026-05-06: Hermes hits #1 across all apps on OpenRouter with 271B tokens
- 2026-05-10: daily tokens, Hermes 224B vs OpenClaw 186B
- late May 2026: cumulative flips too, Hermes 8.14T vs OpenClaw 7.18T
- 2026-06-06: Hermes 669B/day, OpenClaw 160B, with Kilo Code's 175B in between

Stars measure curiosity. Tokens measure work. A much smaller pool of Hermes deployments is each doing considerably more of it.

(That figure has serious caveats. Last section.)

## Why it actually fragmented: Q1 2026

The birthdays of these projects cluster between late January and mid-March 2026. Not a coincidence — they are products of one wave of security failures.

**2026-01-30**: OpenClaw ships 2026.1.29 to patch CVE-2026-25253, CVSS 8.8. The Control UI never validated the WebSocket origin header, so any site you visited could silently connect to your running agent and chain a single click into arbitrary code execution on your machine. Found by Mav Levin of DepthFirst. Disclosed 2026-02-03, alongside two command-injection advisories the same day.

**2026-02-01**: Koi Security's Oren Yomtov audits 2,857 skills on ClawHub. 341 are malicious (11.9%), and 335 of those trace to a single coordinated campaign later named ClawHavoc.

**2026-02-05**: Snyk publishes ToxicSkills, covering 3,984 skills across ClawHub and skills.sh:

> 13.4% of all skills, or 534 in total, all contain at least one critical-level security issue... Expand to any severity level, and over a third of the ecosystem is affected: 36.82% (1,467 skills) have at least one security flaw.

76 carried confirmed malicious payloads, and **91% of the malicious skills combined prompt injection with conventional malware** — bypassing AI safety mechanisms and traditional security tooling in the same package.

**2026-02-23**: Summer Yue, director of alignment at Meta Superintelligence Labs, posts screenshots of her OpenClaw agent speedrunning deletions in her real inbox while ignoring stop commands from her phone. Separate section below — it deserves one.

**2026-03-13**: China's CNCERT issues a risk advisory citing "inherently weak default security configurations" plus privileged system access. Hong Kong warns civil servants off it the same day. Also that day, arXiv 2603.12644 (Zonghao Ying et al.) proposes a three-layer risk taxonomy — AI cognitive, software execution, information system — and the FASA full-lifecycle defence architecture.

Seven weeks. From viral to government advisories, academic papers and a supply-chain poisoning campaign in seven weeks. Every project that followed is a response to those seven weeks.

And it did not stop. **CVE-2026-32922** (2026-03-29, CVSS 3.1 of 9.9) is a scope bug in `device.token.rotate`: a device holding only `operator.pairing` can mint an `operator.admin` token, and remote code execution across every connected node is one API call further. In May 2026 Cyera disclosed four chainable flaws — Claw Chain — including **CVE-2026-44112 at 9.6**, a TOCTOU race in the write path of the OpenShell sandbox backend that lets an attacker redirect writes outside the mount root before the boundary check lands.

That last one deserves a pause, because **what got broken was the sandbox itself**. It cuts both ways for this article's thesis: adding a sandbox is not a get-out-of-jail card. But it also explains exactly why the later projects pushed isolation down to the OS or hypervisor. A TOCTOU bug of that shape only exists where someone hand-rolled a boundary check in application code.

There is no authoritative running total for CVEs. A April 2026 round-up recorded "60+ CVEs and GHSAs disclosed across multiple waves" and drew the blunt conclusion:

> Default configurations still unsafe without manual hardening

For the current state, check OpenCVE's openclaw vendor page — entries run into July 2026.

## The incident with no attacker

Everything above is attacks. But the most famous failure in this category had no attacker in it at all.

On 2026-02-23 Summer Yue, director of alignment at Meta Superintelligence Labs, connected OpenClaw to her primary Gmail and asked it to review the inbox and *suggest* what to delete or archive, explicitly instructing it not to act without approval. It started deleting. She fired off "Do not do that", "Stop don't do anything", "STOP OPENCLAW" from her phone. All ignored.

> Nothing humbles you like telling your OpenClaw "confirm before acting" and watching it speedrun deleting your inbox. I couldn't stop it from my phone. I had to RUN to my Mac mini like I was defusing a bomb.

The post drew 9.6 million views. Her own root-cause read matters more than the incident: she had tested the workflow for weeks against a small "toy inbox" with no trouble, and the real inbox carried far more data — enough to **trigger context compaction, during which her "do not act without approval" instruction was summarised away**.

> Rookie mistake tbh. Turns out alignment researchers aren't immune to misalignment.

(TechCrunch noted it could not independently verify what happened to her inbox; what is quoted here is her own public account and screenshots.)

This matters because it moves the failure mode from "someone attacked you" to "your agent forgot". **A prompt is not a guardrail** — it is a piece of text that gets compressed, summarised, and eventually dropped. Which is the mirror image of the point above about memory: a memory system can hold an attacker's injected instruction too long, and drop your safety instruction too early.

Two opposite failures, one cause: **an agent's context is not a reliable execution boundary.**

## Seven answers on isolation

**NanoClaw: a container per agent, and small enough to read.** Its site puts the comparison up front — 132 source files against OpenClaw's 3,680; roughly 17,500 lines against 434,453; under 10 dependencies against 70; zero config files against 53; security model "OS container isolation" against "application-level checks". The architecture: a host process routes an inbound message into `inbound.db`, wakes the agent-runner inside a container, which writes replies to `outbound.db` for the host to deliver — two SQLite files per session, exactly one writer each, no IPC. Credentials go through OneCLI's Agent Vault and are injected at request time, so **the agent never holds a raw API key**.

Creator Gavriel Cohen (seven years at Wix) argues that application-level allowlists are inherently fragile because the checking logic is itself attack surface: the design principle is agent-level isolation, not tool-level isolation. In May 2026 NanoCo raised a $12M seed (led by Valley Capital Partners, with Docker, Vercel, monday.com and Hugging Face CEO Clem Delangue participating) and turned down a roughly $20M acquisition.

(Watch the units: the 17,500-line figure is the whole repo, while VentureBeat's "roughly 500 lines of core logic, auditable by a security team in about eight minutes" refers to the core. Both are true about different things.)

**IronClaw: WASM sandbox plus PostgreSQL.** From nearai, whose README calls it "a Rust reimplementation inspired by OpenClaw" and maintains a FEATURE_PARITY.md tracking matrix. Four stated differences: Rust over TypeScript, **WASM sandbox over Docker** (lightweight, capability-based), **PostgreSQL over SQLite** (production-grade persistence), and layered defence. It is the only one aiming squarely at regulated industries.

**Moltis: shrink the trusted base to 7.5K lines.** Fabien Penso's project (131 points on Show HN). A 59-crate Rust workspace of roughly 270K lines, but the **agent runner plus model interface is only about 7.5K lines**, with providers adding 19K. Unsafe code is confined to FFI and precompiled runtime boundaries, never the agent loop. Encrypted vault on XChaCha20-Poly1305 and Argon2id, SSRF blocking for loopback/private/CGNAT ranges, cross-origin WebSocket rejection (precisely the CVE-2026-25253 hole), and 15 lifecycle hooks that can inspect, modify or block. Its comparison page even pins the snapshot commits and dates for all three projects it compares, with a note that projects move fast and you should check the repos before deciding. **It ships an OpenClaw importer too.**

**ZeroClaw: security policy inside the runtime core.** A single Rust binary, 30+ channels, around 20 providers. In its architecture diagram the runtime has exactly three boxes: agent loop, **security policy**, SOP engine. Putting policy on the same level as the loop is a deliberate statement.

**PicoClaw: small enough for $10 hardware.** From Sipeed, written from scratch in Go — the README explicitly states it is not a fork of anything — with 95% of core code generated by an agent and human-reviewed. Its own table: RAM, OpenClaw >1GB, NanoBot >100MB, PicoClaw <10MB; boot time on a 0.8GHz core, >500s / >30s / **<1s**; hardware cost, a $599 Mac Mini / a ~$50 Linux board / **from $10**. One binary across RISC-V, ARM, MIPS and x86.

Its README also contains two unusually honest self-corrections: "Recent builds may use 10-20MB RAM" — the headline number has already been broken by its own merged PRs — and "in early rapid development... do not deploy to production before v1.0". Not many projects write that down.

**Moltworker: throw the whole thing into serverless.** Cloudflare's own packaging of OpenClaw into a Cloudflare Sandbox container on Workers, with optional R2 persistence. Its selling point is exactly its limitation: the agent cannot touch your machine, so it also cannot use your machine. Costs are documented plainly (set `SANDBOX_SLEEP_AFTER` so it sleeps when idle; four hours a day runs roughly $5-6/month in compute on top of the $5 plan). But no push in over three months.

**LibreFang: an Agent OS thought experiment.** 24 Rust crates, 2,100+ tests, 45 channel adapters, 28 providers, 60 bundled skills, WASM sandbox, taint tracking, Ed25519 signing. 359 stars, earliest stage. Its honesty about its own weakness is worth noting: "OFP wire is plaintext-by-design" — the P2P protocol has HMAC mutual auth but no confidentiality, so the project tells you to run it behind WireGuard, Tailscale or mTLS.

## Two axes that contradict each other

Laid out together, the nine differ along four axes: isolation boundary, size of the trusted base, depth of memory and learning, and deployment shape. **The second and third are in direct conflict.**

The trusted-base axis runs from 1.1M lines (OpenClaw, measured with tokei) down through 270K (Moltis, 7.5K core), 152K (Hermes), 17,500 (NanoClaw), to PicoClaw's sub-10MB binary. The learning axis runs from stateless all the way to "writes its own skills and edits its own memory".

You cannot have both "small enough to read in an afternoon" and "rewrites its own behaviour". Worse, persistent memory turns prompt injection from an immediate attack into a **delayed-execution** one: a hidden instruction in a PDF you opened last Tuesday can sit in the agent's memory until some future task triggers it. The better the memory, the longer that window.

The Summer Yue incident is the empirical case for this axis: what compaction ate was her safety instruction. The more you rely on context to carry rules, the less reliable that mechanism gets.

NanoClaw and Hermes sit at opposite ends of this spectrum, and they are also the two fastest-growing projects in the category. That is why there will be no winner: the market is rewarding two mutually exclusive directions at once.

## How to choose

| Situation | Pick | Why |
|---|---|---|
| Most channels, biggest skill marketplace, willing to harden it yourself | OpenClaw | The ecosystem is irreplaceable; the main session defaults to running on your host, so read the sandboxing docs first |
| Want the agent to get better at your recurring work | Hermes Agent | The only one with a learning loop at its core, plus an OpenClaw migration path |
| Enterprise or multi-client data, need hard boundaries | NanoClaw | Per-agent containers, credentials never reach the agent, and small enough to audit yourself |
| Regulated industry, production-grade persistence | IronClaw | PostgreSQL, WASM sandbox, per-job tokens |
| No Node or Python, want one binary and an encrypted vault | Moltis | The smallest trusted base here; limited ecosystem |
| $10 SBC, edge devices, old phones | PicoClaw | The only one that genuinely runs at that tier; not for production before v1.0 |
| Don't want to self-host, fine with an agent that can't touch your machine | Moltworker | Verify project status first (no update since 2026-05-09) |
| Rust single binary, 30 channels, policy in the core | ZeroClaw | Sits between Moltis and OpenClaw |
| Curious how the Agent OS idea develops | LibreFang | Earliest stage, plaintext OFP, private networks only |

## What these numbers can't tell you

A few things need saying, or you will carry the wrong confidence into a decision.

**OpenRouter rankings only cover traffic that goes through OpenRouter**, and only apps that opted into usage attribution. Deployments hitting Anthropic or OpenAI directly are invisible. What the data proves is that Hermes users favour OpenRouter and run heavy workloads — not exactly the same claim as "more people use Hermes".

**Exposed-instance counts differ by more than fourfold across sources**: SecurityScorecard said 135,000 in February 2026; Censys said 63,070 in late March; Cyera in May gave two numbers at once — roughly 65,000 from Shodan and roughly 180,000 from ZoomEye. Same month, same question, 2.8× apart between two scanners. That gap reflects scanning methodology, fingerprint rules and timing, not disagreement about reality. Quote the range, not whichever endpoint suits your argument.

**The most important and least intuitive finding**: one study compared seven skill scanners across 238,180 skills. Flag rates ran from Socket's 3.8% to OpenClaw Scanner's 41.9%. Of the 8,402 skills flagged by at least one scanner, **72% were flagged by exactly one**. On Skills.sh, the one marketplace where all five deployed scanners overlapped, they agreed on 33 skills out of 27,111 — **0.12%**.

Which means: "we scanned it" is not a safety guarantee. Inter-scanner agreement is close to noise, and every vendor is grading its own homework. **Isolation is an architecture problem, not a scanning problem** — which is precisely what those seven latecomers answered with containers, WASM, serverless, or by cutting the codebase down to something a human can actually read.

Finally, every star count here is a 2026-08-18 snapshot. This category has reshuffled several times in six months; by the time you read this the numbers have moved again.

## References

Project sources:

- [OpenClaw](https://github.com/openclaw/openclaw) · [Security docs](https://docs.openclaw.ai/security) · [Sandbox CLI](https://docs.openclaw.ai/sandbox)
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) · [Nous Research Releases](https://nousresearch.com/releases)
- [NanoClaw](https://github.com/nanocoai/nanoclaw) · [nanoclaw.dev](https://nanoclaw.dev)
- [PicoClaw](https://github.com/sipeed/picoclaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)
- [IronClaw](https://github.com/nearai/ironclaw)
- [Moltworker](https://github.com/cloudflare/moltworker)
- [Moltis](https://github.com/moltis-org/moltis) · [Moltis comparison page](https://docs.moltis.org/comparison.html)
- [LibreFang](https://github.com/librefang/librefang)

Security research and reporting:

- [Snyk — ToxicSkills: a full audit of 3,984 agent skills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub)
- [arXiv 2603.12644 — Uncovering Security Threats and Architecting Defenses in Autonomous Agents: A Case Study of OpenClaw](https://arxiv.org/abs/2603.12644)
- [The Hacker News — CNCERT warns on OpenClaw](https://thehackernews.com/2026/03/openclaw-ai-agent-flaws-could-enable.html)
- [Seven skill scanners agree on only 0.12%](https://theweatherreport.ai/posts/skill-scanner-disagreement)
- [The ClawHub incident: 341 malicious skills (Koi Security audit)](https://www.termdock.com/en/blog/clawhub-malicious-skills-incident)
- [ARMO — CVE-2026-32922: OpenClaw privilege escalation (CVSS 9.9)](https://www.armosec.io/blog/cve-2026-32922-openclaw-privilege-escalation-cloud-security)
- [Cyera — Claw Chain: four chainable flaws including a CVSS 9.6 sandbox escape](https://www.cyera.com/blog/claw-chain-cyera-research-unveil-four-chainable-vulnerabilities-in-openclaw)
- [OpenCVE — OpenClaw vendor page (current CVE state)](https://app.opencve.io/cve?vendor=openclaw)
- [Infosecurity Magazine — Endor Labs discloses six new vulnerabilities](https://www.infosecurity-magazine.com/news/researchers-six-new-openclaw)
- [OpenClaw security risks: skills, exposure and exploits (April 2026 state)](https://blog.cyberdesserts.com/openclaw-malicious-skills-security)
- [joylarkin/openclaw-security-news — incident timeline index](https://github.com/joylarkin/openclaw-security-news)
- [ClawSec — a security skill suite spanning OpenClaw, Hermes, PicoClaw and NanoClaw](https://github.com/prompt-security/clawsec)
- [Simon Willison — The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta)

People and market:

- [Peter Steinberger — OpenClaw, OpenAI and the future](https://steipete.me/posts/2026/openclaw)
- [CNBC — OpenClaw creator Peter Steinberger joining OpenAI](https://www.cnbc.com/2026/02/15/openclaw-creator-peter-steinberger-joining-openai-altman-says.html)
- [TechCrunch — NanoClaw creator turns down $20M buyout, raises $12M seed](https://techcrunch.com/2026/05/20/nanoclaw-creator-turns-down-20m-buyout-offer-raises-12m-seed-instead)
- [TechCrunch — A Meta AI security researcher said an OpenClaw agent ran amok on her inbox](https://techcrunch.com/2026/02/23/a-meta-ai-security-researcher-said-an-openclaw-agent-ran-amok-on-her-inbox)
- [Business Insider — Meta AI alignment director's email deletion incident](https://www.businessinsider.com/meta-ai-alignment-director-openclaw-email-deletion-2026-2)
- [The San Francisco Standard — She runs AI safety at Meta. Her AI agent still went rogue](https://sfstandard.com/2026/02/25/openclaw-goes-rogue)
- [MarkTechPost — Hermes Agent leads OpenRouter's global rankings](https://www.marktechpost.com/2026/05/10/openclaw-vs-hermes-agent-why-nous-researchs-self-improving-agent-now-leads-openrouters-global-rankings)
- [ClawClones — a tracking index of 43 OpenClaw alternatives](https://clawclones.com/analysis)

Related on this site:

- [Reading the OpenClaw Docs — series overview](/en/posts/ai/2026-03-28-openclaw-overview)
- [OpenClaw Channels Overview: who can trigger vs what the model sees](/en/posts/ai/2026-03-28-openclaw-channels-overview)
- [OpenClaw access control: SecretRef is not process isolation](/en/posts/ai/2026-03-28-openclaw-auth-secrets)
- [Hermes Agent: an introduction](/en/posts/ai/2026-08-18-hermes-agent-intro)
- [Hermes Agent's memory and skills: a system that rewrites itself](/en/posts/ai/2026-08-18-hermes-agent-memory-skills)
- [Hermes Agent's seven terminal backends: switching to a sandbox turns off dangerous-command approval](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends)
