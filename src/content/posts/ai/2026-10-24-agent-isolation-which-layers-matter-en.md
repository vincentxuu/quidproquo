---
title: "Which Layers Your Agent Should Worry About: Priorities for Personal, Team, and Multi-Tenant Setups"
date: 2026-10-24
type: guide
category: ai
tags: [ai-agent, sandbox, ai-security, threat-model, isolation]
lang: en
description: "Map the series' five isolation layers onto three situations, personal, team-internal, and multi-tenant platform, say how much each layer matters, and list three things to do first and three that can wait for each."
tldr: "OpenAI wrote about a research environment for training frontier models; for a personal agent, limiting credentials and exits comes first, and covert channels become a main risk only once there is a second tenant that must be isolated."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 6
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-which-layers-matter)

This series covered five layers of isolation and two kinds of problem, with cases from OpenAI's research environment. At this point the practical question is: for my own agent, where do these risks rank?

First, the scope. OpenAI's October 23 post says at the start that it describes the environments used to train and evaluate frontier models, which differ from those in which customers use released models: models in development may not yet have completed safety and alignment training, and OpenAI deliberately tests them under adversarial conditions. So the red-team agents in the post were set up to find holes; that does not mean the coding agent you use is doing these things every day.

Afterwards you should be able to write down three things to do first and three that can wait for your own situation. The ranking here is my judgment, assembled from the previous five posts and the Linux kernel documentation, not any vendor's standard.

## Three situations

| Situation | Who runs what |
|---|---|
| Personal | Only you use it; the agent runs your own tasks on your own machine or a virtual machine you rent |
| Team-internal | A group shares an agent platform; users trust each other to some extent but are not the same person |
| Multi-tenant platform | You serve outside users and run code from untrusted users or sources |

The Linux kernel's [attack vector controls document](https://docs.kernel.org/admin-guide/hw-vuln/attack_vector_controls.html) uses the same idea: it suggests administrators work out which attack vectors are relevant to their use and turn the rest off to recover performance. For example, with no untrusted virtual machines or only one VM, guest-to-guest mitigations can be considered for disabling; with no untrusted user programs, user-to-user mitigations likewise.

## How much each layer matters

| Layer | Personal | Team-internal | Multi-tenant platform |
|---|---|---|---|
| L1 Container | High: your files and credentials are right there | High | High, but not enough alone |
| L2 Kernel boundary | Low to medium: no second party to defend against; a kernel bug takes someone deliberately exploiting it | Medium | High: use microVMs or gVisor |
| L3 Shared host and hardware | Low: a channel needs two sandboxes that must be isolated sharing a machine | Medium: depends on trust between users | High: one process per tenant, SMT off |
| L4 Network and exits | High: the cheapest and most direct layer | High | High |
| L5 Monitoring and stopping | Medium: at least keep records | Medium to high: someone has to watch | High: stop automatically and test regularly |

This table is judgment, not measurement. Some reasons:

- **L4 is high in every situation.** An exit needs no second tenant; as long as the program in the sandbox can reach credentials, it is worth limiting where it can connect. This is also the cheapest layer to act on: allowlists and DNS restrictions, covered in [More Than One Way Out](/posts/ai/2026-10-24-agent-isolation-indirect-exits-en).
- **L3 is low for a personal setup.** A covert channel needs two programs that must not communicate sharing hardware, and a single user usually has no second party. That is the premise of the whole of [Talking Without a Network](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en).
- **L1 is high for a personal setup.** If a tool program can read your whole home directory and inherit deployment keys, one bug can get past the tool's own authorization checks. That layer is already tested hands-on in [Agent Sandboxes, Credentials, and Network Boundaries](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en).

## Three to do and three that can wait, per situation

**Personal.**

- Do:
  1. Do not let the sandbox inherit the whole environment and credentials; give it only the items the task needs.
  2. Limit the network to an allowlist, and count DNS in.
  3. Record the commands run and the destinations connected to, so you can investigate when something goes wrong.
- Can wait:
  1. Disabling SMT and single-tenant hosts.
  2. MicroVMs, unless you are running code you did not write.
  3. Automatic stopping. You can see what the agent does every day, and stopping it by hand is enough.

**Team-internal.**

- Do:
  1. Agents of people with different levels of trust do not share a sandbox or storage.
  2. List the indirectly reachable services and restrict DNS and package proxies.
  3. Set automatic stopping rules: pause when it connects to a destination outside the allowlist, rather than relying on someone watching.
- Can wait:
  1. Whole-host single tenancy, provided you have thought through how much team members trust each other.
  2. Direct I/O and dedicated block devices.
  3. Detection aimed at covert channels.

**Multi-tenant platform.**

- Do:
  1. MicroVMs, one process per tenant, different trust levels on different hosts, and SMT off.
  2. Storage through direct I/O or dedicated block devices, avoiding the shared host page cache.
  3. Exit restrictions, monitoring, and automatic stopping, with the whole pipeline checked using test events.
- Can wait: nothing. In this situation every item in the previous five posts is relevant, and the priority depends on threat and cost, not on whether to do it.

## When to move up a level

Situations change. When any of these happens, move your situation up one level:

- You start running code other people supply, or feeding external content directly to an agent that executes programs by itself.
- You start letting several users share one sandbox pool.
- The sandbox starts to reach more credentials or internal services than the task needs.

Something you can do tonight: write two lines in your project README, which of the situations yours is and the three to-do items above for it. Then look back at how many are not done yet.

## Limits

- How much each layer matters is my judgment; it does not quantify risk and is not any standard.
- The cases in this series all come from red-team tests of a research environment; the results do not convert directly into likelihoods in a personal or team environment.
- This post does not discuss prompt injection, authorization, or data leakage; the AI Security in Practice series handles those.

## References

- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Attack Vector Controls — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/hw-vuln/attack_vector_controls.html)
- [Where an Agent's Code Runs — this site](/posts/ai/2026-10-24-agent-isolation-overview-en)
- [Talking Without a Network — this site](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en)
- [More Than One Way Out — this site](/posts/ai/2026-10-24-agent-isolation-indirect-exits-en)
- [Reading a Defense Checklist — this site](/posts/ai/2026-10-24-agent-isolation-defense-matrix-en)
- [Agent Sandboxes, Credentials, and Network Boundaries — this site](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en)
