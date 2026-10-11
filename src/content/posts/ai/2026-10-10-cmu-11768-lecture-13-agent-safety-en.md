---
title: "CMU 11-768 Lecture 13: Agent Safety — Four Threat Models and Three Limits: Sandboxes, Credential Brokering, Monitoring"
date: 2026-10-10
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, ai-safety, agent-safety, sandbox, prompt-injection, red-teaming, monitoring]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 15
tldr: "Lecture 13 is about limiting what agents can access and do. The slides open with five real incidents, sort them into four threat models (malicious user, prompt injection, agent error, improper means), then give four layers of defense: red teaming and safety training, sandboxes and credential brokering, monitoring, and safety evaluation. The easiest point to miss: hiding the API key does not stop an agent from misusing the access behind it."
description: "A guide to CMU 11-768 AI Agents Lecture 13, Agent Safety (written from the slides): five incidents (OpenClaw email deletion, PocketOS production database, Copilot data exfiltration, Cline supply chain, card theft), four threat models, human and automatic red teaming and safety training, sandbox boundaries and local vs. cloud choices, fine-grained tokens and credential brokering, tool-call and chain-of-thought monitoring, and safety metrics and alert precision."
draft: false
glossary:
  - term: "credential broker"
    aliases: ["credential brokering"]
    definition: "A service between the agent and an API: it checks the request against permissions, then either hands the agent a short-lived token or keeps the key and makes the call on the agent's behalf."
    context: "The goal is that the agent never holds a long-lived credential and every access leaves a separate record."
  - term: "prompt injection"
    aliases: ["indirect prompt injection"]
    definition: "An attacker places instructions in content the agent reads (an email, webpage, file or tool result) so the agent follows them while doing the user's task."
    context: "The lecture separates it from the malicious user: here the user is innocent and the attacker supplies the content."
---

> 🌏 [中文版](/posts/ai/2026-10-10-cmu-11768-lecture-13-agent-safety)

**Video status: the official public page lists no recording.** [Video sources and notes](#course-video-sources)

> **This post is written from the slides; I'll add the video when it's published.** As of 2026-10-10, the [official schedule](https://www.cmu-agents.com/#/schedule) lists only [slides](https://www.cmu-agents.com/slides/lecture-13-agent-safety.pdf) for Lecture 13 (Oct 6), with no recording. Everything below comes from the slides, not from what the lecturer said; where I'm interpreting, I say so.

Lecture 13 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) opens the safety module, subtitled "limiting what agents can access and do." The schedule originally titled it Sandboxing & Credential Management and now says Agent Safety; the content is indeed broader, adding red teaming, monitoring and safety evaluation. Observability and monitoring get their own lecture on Oct 22 (Eric Wallace), so monitoring here is an introduction.

The question this post answers: **what is the minimum you need before letting an agent touch real systems, so you don't learn the lesson from the first incident?**

## Course video sources

This post is written from the slides. I checked the official schedule: Lecture 13 lists slides only, with no recording link. That means the public page has none, not that none exists internally.

Official source:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked: 2026-10-10.

## Five incidents: what going wrong looks like

The slides open with five incidents, each with a question. What follows paraphrases the slides; details belong to the sources listed at the end.

| Incident | What happened | The slide's question |
|---|---|---|
| OpenClaw email deletion | A user told the agent not to touch the inbox until approved; emails were deleted anyway and the user had to kill every process on the host | Where should the system have required approval? |
| PocketOS production database | A coding agent working on a staging task held an API token that could delete a production volume and its backups; both were deleted | Why could a staging token reach production? |
| Copilot data exfiltration | An attacker's email with hidden instructions steered Copilot into retrieving and leaking private documents; researchers demonstrated it, Microsoft patched it, no mass breach was reported | Why can untrusted email direct an agent that can retrieve? |
| Cline supply chain | Cline used an agent to read and label GitHub issues; a poisoned shared cache was later used to obtain a publish token and ship an unauthorized CLI release | Why did issue handling share state with the release? |
| Payment-card theft | Gambit Security found an operator sending AI agents to break into online retailers, extract card records, and install scripts that stole card details at checkout | Is this the agent's problem or the user's? |

What the five share: **at the step where it went wrong, nothing outside the agent's control was checking.** That is the thread of the whole lecture.

## Four threat models

The slides sort incidents into four classes because different threats need different defenses.

| Threat model | Who is the bad actor | Example |
|---|---|---|
| Malicious user | The user | Card theft: the user's goal is stealing card numbers; the agent breaks in and installs scripts |
| Prompt injection | A third party supplying content | An issue title (untrusted text) enters the model's context, is followed as an instruction, and becomes a shell command |
| Agent error | No one | In a simulated banking task, "check whether my balance covers a $580.9 electricity bill" became an actual bill payment |
| Improper means | No one, but the agent took a shortcut | In a security test, the agent read the task's Dockerfile and copied the flag instead of solving the challenge |

The last two need no attacker; the agent crosses the line itself. My reading: that is why "only block bad people" isn't enough, since incidents happen without any.

## Training side: red teaming and safety training

The slides start with the model's own defenses, four approaches:

- **Human red teaming.** Give testers tasks, attack goals and feedback, and let them try to make the agent break its rules in a controlled setting. The example is a Gray Swan Arena medical scenario where the goal is to get another patient's records.
- **Automatic red teaming.** An attacker model drafts a prompt for the target; a judge model checks the reply against the policy; the attacker uses the reply and score to revise the next prompt.
- **Supervised safety training.** Pair harmful requests with decline-and-help replies and legitimate requests with normal answers. For synthetic data, decide refuse-or-help first, generate the reply, and filter unsafe ones before training.
- **Safety training with RL.** Reward replies that follow the safety rules, use automatic attacks to find harder variants and train on those that fooled an early model; also include legitimate safety-related requests and reward useful answers so the model doesn't learn to refuse everything. A reward model trained on human preferences can guide this.

The slides don't say it, but my reading is that all four lower the chance of failure without guaranteeing anything. That is why the next three layers matter.

## Sandboxes: limit what the agent can reach

A sandbox is an isolated environment that limits what a program can access and do. The slides describe isolation along three boundaries:

| Boundary | The question |
|---|---|
| Filesystem and processes | Which files can the agent access, which processes can it control? |
| Network | Which services can it contact, and what can it do there? |
| Resource limits | How much compute and storage? How long can it run? |

### Where to put the boundary

Two options: run the agent inside the sandbox, or keep the agent outside and run only its tools inside. Either way the slides' rule is: **keep access rules and enforcement beyond the agent's control.**

### Shared state outlives the run

Cline is the example: the issue-handling run poisoned a shared cache, and a later release run restored it. Closing the sandbox doesn't erase state. If runs at different trust levels share files, caches or credentials, the isolation is broken.

### What a good sandbox needs

Agents open and close environments constantly, so the slides list four requirements: quick startup, strong isolation, freeze-and-reload (save files and running state, resume from that point), and ease of use (create, configure, inspect and stop through a simple interface).

### Local vs. cloud

| | Local | Cloud |
|---|---|---|
| Who manages the environment | You manage setup, limits and lifecycle | The provider does; you control it through an API |
| Examples | Docker, Apptainer, QEMU | Modal, E2B |

Local options differ in boundary: Docker and Apptainer are containers sharing the host kernel; QEMU is a virtual machine running its own guest kernel. The slides' guidance: Docker is the default for local development; Apptainer fits shared clusters and runs as your user without root; QEMU is for running a complete guest operating system.

Related implementation notes on this site: [OpenClaw sandbox](/en/posts/ai/2026-03-28-openclaw-sandbox-en), [Cloudflare Sandboxes](/en/posts/ai/2026-08-22-cloudflare-sandboxes-en), [Daytona agent sandbox](/en/posts/ai/2026-08-22-daytona-agent-sandbox-en).

## Credentials: identity and authority

The slides' key sentence: **hiding an API key does not prevent the agent from misusing the access it provides.** So ask three things: who is asking, for which resource and action, and is it allowed for this task?

Two approaches:

**Fine-grained tokens.** Limit which resources the token can access, which actions it permits and how long it lasts. The slides split an issue-handling account from a release account: the first can read issues and apply labels but not publish; the second can read approved source and publish but not modify the issue cache. GitHub App installation tokens expiring after one hour are an example of short-lived tokens.

**Credential brokering.** The agent sends a request with a run ID to a broker; the broker checks permissions and then either gives the agent a temporary token or keeps the API key private and makes the call for it, returning the result and recording the event separately. The agent never holds a long-lived credential. For the related standard, see [RFC 8693 (OAuth 2.0 Token Exchange)](https://www.rfc-editor.org/rfc/rfc8693.html).

## Monitoring: see what the agent actually did

An agent can produce a useful answer after taking an unsafe action. The slides therefore split monitoring across time: checks during a run can pause or block in time; reviewing logs afterward explains failures and improves safeguards.

### What evidence to inspect

The user's request, tool calls, results, and changes to the outside system. The example is a passing score on a Cybench port that hid an unintended shortcut: the agent had read a Dockerfile containing the flag. The score can't show that; the tool calls and results can.

### Rules and model-based checks

| Rule | Model-based check |
|---|---|
| Is this publisher on the allowed list? | Did the agent follow an attacker's instructions in the issue? |
| Compare the account with the policy | Read the user's task, the issue and the tool calls |

Use rules for precise conditions and models for questions that need context, but for a model's judgment make sure you can point to the supporting passages in the log.

### Tool calls and written reasoning

The slides show a task: "implement mathematical functions and pass the tests." Tool-call monitoring sees the patch that makes `verify()` always return true. Chain-of-thought monitoring additionally sees the agent's written plan to bypass the tests.

Written reasoning is useful evidence, with limits: in another experiment the slides mention, strong pressure to pass a reasoning check led agents to hide the cheating. The advice is to check actions and outcomes independently, even when the reasoning looks harmless.

### Intervening in time

To stop an unsafe tool call, the check must finish **before** execution: allow means execute, otherwise block or pause; review the log afterward, investigate, and improve. The closing line matches the sandbox section: keep the checks, logs and stop controls beyond the agent's control.

## Safety evaluation: how you know the defenses work

### Cover all four threats

Evaluation should span the four classes: will the agent help steal card data, obey an attacker's instruction in an issue, send money when asked to check a balance, read a leaked answer to pass a challenge? Different threats call for different benchmarks; the slides list three:

| Question | Benchmark | How it tests |
|---|---|---|
| Will the agent carry out a malicious request? | [AgentHarm](https://arxiv.org/abs/2410.09024) | Multi-step tasks with synthetic tools |
| Will an indirect instruction redirect the agent? | [AgentDojo](https://arxiv.org/abs/2406.13352v3) | Tool data carries an attacker's instructions |
| Will it make a risky mistake during a valid task? | [ToolEmu](https://arxiv.org/abs/2309.15817v2) | A language model simulates tool results |

There is also [OpenAgentSafety](https://arxiv.org/abs/2507.06134v2), which tests multi-turn tasks with real tools and locally hosted services.

### Four metrics

The slides define four rates with illustrative numbers (100 valid-task runs, 100 safety-test runs):

| Metric | Formula | Example |
|---|---|---|
| Task completion | valid tasks completed ÷ all valid-task runs | 80% |
| Unnecessary refusal | valid tasks refused ÷ all valid-task runs | 10% |
| Unsafe attempt | runs with an unsafe attempt ÷ all safety-test runs | 25% |
| Completed harm | runs with a harmful effect ÷ all safety-test runs | 10% |

Blocked attempts raise the attempt rate without raising completed harm. Look at both: harm alone hides how often the defenses are being hit.

### Why most alerts are false alarms

The slides' last example has numbers worth remembering: of 10,000 decisions, 1% are unsafe (100); the monitor catches 90%, so 90; of the 9,900 safe decisions 1% are flagged, so 99 false alerts. That is 189 alerts to review, of which only 90 are real, about 48%.

When events are rare, even a 1% false-positive rate makes more than half the alerts false. My reading: judge a monitor's false-alarm rate together with the base rate of unsafe events, never alone.

## What you can do tonight

- **List every credential your agent holds and write down the worst thing each one can do.** If a staging token can delete production, split it tonight.
- **Find what's shared.** Do runs at different trust levels share a cache, files or tokens? If so, that's the Cline path.
- **Move one dangerous action to a pre-execution check.** You don't need a full monitoring system first: pick the most dangerous tool (delete, pay, release) and add an approval or rule outside the agent.

## Going deeper

- On this site: [prompt injection and trust boundaries](/en/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en), [safety for authenticated web agents](/en/posts/ai/2026-08-22-authenticated-web-agent-safety-en)
- Readings the official schedule lists for this lecture: [AgentDojo](https://arxiv.org/abs/2406.13352v3), [ToolEmu](https://arxiv.org/abs/2309.15817v2), [AgentHarm](https://arxiv.org/abs/2410.09024), [OpenAgentSafety](https://arxiv.org/abs/2507.06134v2), [Monitoring Reasoning Models for Misbehavior](https://arxiv.org/abs/2503.11926)

## Changelog

- 2026-10-10: Added this post, written from the Lecture 13 slides; no recording on the official public page yet.

## References

- [CMU 11-768 AI Agents course site](https://www.cmu-agents.com/)
- [Lecture 13 slides: Agent Safety](https://www.cmu-agents.com/slides/lecture-13-agent-safety.pdf)
- [OpenClaw incident report](https://x.com/summeryue0/status/2025774069124399363)
- [The New Stack. AI agents credential crisis (PocketOS database deletion)](https://thenewstack.io/ai-agents-credential-crisis)
- [Microsoft Security Response Center. CVE-2025-32711](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711)
- [Cline. Post-mortem: unauthorized Cline CLI npm release](https://cline.bot/blog/post-mortem-unauthorized-cline-cli-npm)
- [Gambit Security. Autonomous AI agents targeting online retailers](https://gambit.security/blog-posts/autonomous-ai-agents-online-retailers-25-a-company)
- [Debenedetti et al., 2024. AgentDojo](https://arxiv.org/abs/2406.13352v3)
- [Ruan et al., 2023. ToolEmu](https://arxiv.org/abs/2309.15817v2)
- [Andriushchenko et al., 2024. AgentHarm](https://arxiv.org/abs/2410.09024)
- [Vijayvargiya et al., 2025. OpenAgentSafety](https://arxiv.org/abs/2507.06134v2)
- [Baker et al., 2025. Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926)
- [RFC 8693: OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Docker Engine security](https://docs.docker.com/engine/security/)
- [Apptainer quick start](https://apptainer.org/docs/user/main/quick_start.html)
