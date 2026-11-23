---
title: "OpenClaw Enterprise: Five Kinds of Controls a Company Needs Before Running Hundreds of Always-On Agents"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, openai, kimi]
lang: en
tldr: "OpenClaw Enterprise (OCE) is an open-source control plane for managing always-on agents, not an agent itself: multi-tenancy, hard security boundaries and auditability, with swappable models, harnesses and sandboxes. It started at OpenAI, was donated to the OpenClaw Foundation and is co-developed with Red Hat and NVIDIA; it's pre-1.0 and recommended only for internal pilots. OpenAI uses it for more than 500 internal OpenClaw agents and has published five kinds of controls: separating trusted from untrusted execution, hard sandbox boundaries, model review of every action, a separate agent identity, and logging everything. The Chinese counterpart is Kimi Hosted Agents, which offers the same layer as a hosted service."
description: "What OpenClaw Enterprise is, why IT's default is to ban agent platforms, the five kinds of controls (with config examples) OpenAI uses for its 500-plus internal OpenClaw agents, what Red Hat and NVIDIA add, how Kimi Hosted Agents takes the hosted route, and a checklist of controls to have before adopting always-on agents."
series:
  name: "Always-On AI Agents"
  order: 13
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-openclaw-enterprise)

| This post's subject isn't an agent | OpenClaw Enterprise |
|---|---|
| What it is | A control plane for always-on agents: deployment, isolation, permissions, auditing |
| Agents it manages | OpenClaw by default; harnesses, models and sandboxes can be swapped |
| Where it runs | Your own infrastructure: docker-compose locally, Kubernetes in production |
| Status | Pre-1.0, recommended for internal pilots; MIT-licensed and free forever |

In the [OpenClaw Enterprise announcement](https://openclaw.ai/blog/openclaw-enterprise), OpenAI engineer RJ Marsan describes an internal agent called Androidclaw:

> Alert about a broken build? Androidclaw finds the PR and can quickly fix it. Someone gives feedback that the work tab disappeared? Androidclaw responds in like 30 seconds with the link to the SEV.

It has all the team's context: git, GitHub, logging. Even for a vague report like "the streaming seems glitchy," it can trace it, find a fix, publish a PR with video evidence and merge it.

[VentureBeat](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia) notes the double edge: the more useful an agent becomes, the more privileged access it usually needs. OpenAI now has more than 500 agents like this running in the background.

This post is about OpenClaw Enterprise: what controls a company needs before it runs hundreds of always-on agents at once.

## Why IT's default is to ban

The OpenClaw Enterprise announcement opens with the problem: nearly a year after OpenClaw launched, actual deployment of persistent agents remains limited. The main feedback from organizations is that they need a stronger common standard for security, safety and governance before adopting agents fully. The result:

> the default stance of IT in most organizations is to ban agentic platforms like OpenClaw altogether.

A ban doesn't mean nobody uses them. At [NVIDIA GTC Berlin](https://www.nvidia.com/en-us/on-demand/session/gtcberlin26-sb61149/), OpenClaw chief architect Vincent Koch said they found many enterprises had already forked OpenClaw and deployed it internally. One had 20,000 or 30,000 people using it, each company maintaining its own version. Microsoft's [Autopilot](/posts/ai/2026-11-20-microsoft-autopilot-en) came out of the same pattern; Koch calls it "their opinionated version of OpenClaw."

That's what OCE is trying to solve: how to deploy powerful agents safely in enterprise environments without nerfing their capabilities.

## What OpenClaw Enterprise is

[The announcement](https://openclaw.ai/blog/openclaw-enterprise) calls it "an open source, vendor neutral platform for managing persistent agents in sensitive environments." The GitHub repo puts it more bluntly: "Kubernetes for agents."

- **Control plane (OCC)**: per [The New Stack](https://thenewstack.io/openclaw-enterprise-kubernetes-agents/), admins deploy agents here, separate them into isolated namespaces, manage configuration and credentials and set permissions. Changes made through the platform are recorded. The agent's own activity happens separately: gateways receive messages, and harnesses handle agent turns, model calls and tool execution.
- **Swappable parts**: the harness, model and sandbox can be replaced with third-party or in-house implementations instead of committing to one stack.
- **Origins**: started at OpenAI, donated to the OpenClaw Foundation as an independent project, then co-developed with Red Hat and NVIDIA. OpenAI and Red Hat are piloting it internally.
- **Status**: The New Stack cites the architecture docs: the API, console, persistent worker, PostgreSQL backend and Kubernetes packaging are implemented. Still unfinished are external gateway admission, workload authentication back to OCC and some approaches to model authentication. A 1.0 release is planned for the end of the year.

## The five kinds of controls behind OpenAI's 500-plus agents

[On its developer blog](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai), OpenAI published how it deploys OpenClaw agents. It opens with the fundamental difference from traditional software. Traditional software has deterministic configuration and code, and threats come mostly from external attackers; persistent agents can change their own configuration and write arbitrary code to reach a goal. In OpenAI's words: "Attacks come from the inside when agents take misaligned actions."

Here are OpenAI's five kinds of controls, and how it configured each:

### 1. Separate trusted and untrusted execution

Networking, identity and sandboxing are critical components and are treated as trusted, deterministic code; agents, the environment they run in and the code they write are treated as untrusted. To support this, OpenAI implemented remote harness execution in the open-source project. That lets the OpenClaw Gateway, which configures the agent, run in a separate container (in OpenAI's case a separate cluster) from the agent harness.

### 2. Hard security boundaries

Sandboxing limits what agents can do, across four areas:

| Area | OpenAI's approach |
|---|---|
| Network | An organization-managed allowlist, with explicit denials for restricted endpoints |
| Workspace | Writes allowed only to agent working directories |
| Process | Process isolation via the Codex Linux sandbox |
| Secrets | Managed through a credential broker, so agents never see them |

The post includes the actual config files. A few things stand out:

- `danger-full-access` mode is removed; only read-only and workspace-write sandbox modes are allowed.
- The network allowlist covers only GitHub domains, and explicitly blocks sites often used to exfiltrate data, like pastebin and webhook.site, plus cloud metadata endpoints (`169.254.169.254`).
- Web search is cached only, routed through OpenAI's own index.
- `~/.ssh` is denied, and GitHub credentials such as `GH_TOKEN` are stripped from the agent's command environment. The post notes this doesn't hide credentials stored in files the agent can read.
- Apps are disabled by default, and so are destructive app operations.

### 3. Model review of every action

The first two kinds of controls are static. OpenAI argues that as models get smarter, defenses also need to scale with compute, meaning other models. Auto-review lets a second agent monitor and approve the primary agent's actions.

The reasoning: constant human review causes review fatigue, training people to approve every prompt blindly. Using a model as a first filter saves human attention for high-value approvals. OpenAI's OpenClaw deployment enforces Auto-review on all agent actions.

### 4. Separate agent identity from user identity

You need to audit an action, give the agent access to resources, and tell whether an action came from the agent or the user. In OpenAI's setup, each agent has a unique identity tied to a ChatGPT Service Account. That gives each agent its own inference credential, separate from the user's, lets teams connect custom plugins to it, and makes it possible to audit its actions and turn off its inference if needed.

It's the same idea as Autopilot's Entra Agent ID in the previous post, landing in a different system.

### 5. Log everything

Every configuration change on the control plane and every agent turn is logged. Because agent turns can contain sensitive information, those logs are locked down and visible only to a select few people on the security team.

## What these controls bought

OpenAI says its internal OpenClaw pilot brought a big jump in productivity and adoption across technical and non-technical teams. It now has more than 500 agents running proactively in the background, from opening PRs automatically in response to product feedback to continuously running data experiments on new features.

That's OpenAI's own account; no outside audit has checked these settings or results.

## What Red Hat and NVIDIA add

[VentureBeat reports](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia) that both have been working on agent security from adjacent layers:

- **Red Hat**: uses OpenShift to isolate agents from sensitive credentials with separate namespaces, restricted access controls and credential proxies, treating the agent process itself as untrusted. Red Hat is a founding member of the OpenClaw Foundation and [plans to use OCE internally](https://www.redhat.com/en/blog/why-red-hat-building-open-foundation-enterprise-agents-openclaw-enterprise) to orchestrate agent deployments.
- **NVIDIA**: built OpenShell, an open-source runtime that puts autonomous agents in isolated environments with deny-by-default permissions, policy enforcement and audit trails.

OCE sits above those runtime protections as the organizational control plane.

## The Chinese counterpart: Kimi Hosted Agents

OCE's route is "open-source control plane, running on your own infrastructure." Moonshot AI's [Kimi Hosted Agents, launched November 5](https://www.kimi.com/news/kimi-hosted-agents) (in Chinese), takes the other route: it turns the agent harness itself into a cloud service, which Moonshot calls "Harness as a Service."

The [product docs](https://platform.kimi.com/docs/hosted-agents/overview) (in Chinese) list what it takes over:

| Capability | Build your own harness | Kimi hosted |
|---|---|---|
| Session history | Assemble, store and resend it yourself | Platform keeps full history as events |
| Tool execution | Parse, execute and return results yourself | Built-in tools run in cloud sandboxes; custom tools still run on your client |
| Sandbox | Provide it yourself | Isolated sandboxes provided; enterprise-verified users can run them on their own hosts |
| Failure recovery | Handle crashes and disconnects yourself | Platform takes over and resumes automatically |

Its security controls include isolated sandboxes, network access controls, the ability to stop a session at any time, traceable execution, audit exports and usage reports per agent project. There's also Kimi Inference Hook, which checks inputs and tool results against the company's own rules before each model inference. Private and sensitive data is blocked before inference; this is available only to enterprise-verified users.

Pricing is usage-based: model inference tokens, sandbox runtime and plugin calls.

The trade-off between the two routes is clear: OCE gives you the whole control plane but you run it yourself. Kimi runs the harness for you, and even if you move the sandbox onto your own hosts, model calls, agent orchestration and session management still happen on Kimi's platform.

## Controls to have before adopting always-on agents

Whether you use OCE, Kimi or another platform, use OpenAI's five kinds of controls as a pre-adoption checklist:

| Control | Question to ask | What happens without it |
|---|---|---|
| Trusted vs. untrusted | Is the component that configures the agent separate from the agent's own runtime? | The agent can rewrite the settings that govern it |
| Hard sandbox boundaries | Are network, files, processes and secrets each restricted? | A single prompt injection can exfiltrate data |
| Model review | Does a second model check each action, leaving humans only the important approvals? | People drown in confirmations and start approving blindly |
| Agent identity | Can audit logs tell agent actions from human ones? Can you switch the agent off on its own? | When something goes wrong, you can't tell who did it or stop it |
| Log everything | Are configuration changes and every agent turn recorded? Who can see them? | You can't trace what the agent did wrong |

Plus two points from OpenAI's post that are easy to miss:

- **Credentials aren't only in environment variables**: removing tokens from the environment doesn't stop an agent reading credentials stored in files.
- **Logs are sensitive data too**: agent turns contain whatever secrets the agent read, so access to logs should be as strict as access to the data itself.

## Who it suits, and who it doesn't

**Suits you if:**
- You have Kubernetes and a platform team, and want to own the agent control plane yourself.
- People inside your organization are already quietly using OpenClaw, and IT wants to bring it under management.
- You don't want to be locked into one model or harness vendor.

**Doesn't suit you if:**
- You need production deployment now: OCE is pre-1.0 and recommended only for internal pilots.
- You're a small company without a platform team: a hosted service like Kimi, or an integrated product like Autopilot, is less work.
- You want a vendor support contract: OCE is a community project; for support you'd go to a partner like Red Hat.

OCE can be self-hosted anywhere, with no regional restriction.

This is the last post on route 2: companies managing agents on their own infrastructure. Next, route 3 begins with the same open-source core, now run by individuals on their own machines: [how to choose a self-hosted always-on agent](/posts/ai/2026-11-20-self-hosted-always-on-agents-en).

## References

- [OpenClaw Enterprise - The Open Agent Platform](https://openclaw.ai/blog/openclaw-enterprise) (OpenClaw, 2026-09-29)
- [Securing persistent agents like OpenClaw at OpenAI](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai) (OpenAI Developers)
- [OpenClaw launches free enterprise control plane for persistent AI agents](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia) (VentureBeat, 2026-09-29)
- ["Think of it as Kubernetes for agents"](https://thenewstack.io/openclaw-enterprise-kubernetes-agents/) (The New Stack, 2026-09-30)
- [Why Red Hat is building an open foundation for enterprise agents with OpenClaw Enterprise](https://www.redhat.com/en/blog/why-red-hat-building-open-foundation-enterprise-agents-openclaw-enterprise) (Red Hat, 2026-09-29)
- [The Rise of OpenClaw: AI's Fastest-Growing Open Source Project](https://www.nvidia.com/en-us/on-demand/session/gtcberlin26-sb61149/) (NVIDIA GTC Berlin 2026)
- [Kimi Hosted Agents 正式发布：Harness as a Service](https://www.kimi.com/news/kimi-hosted-agents) (Moonshot AI, 2026-11-05, in Chinese)
- [产品概览](https://platform.kimi.com/docs/hosted-agents/overview) (Kimi Open Platform docs, in Chinese)
