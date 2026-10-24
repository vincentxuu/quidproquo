---
title: "Reading OpenAI's Red-Team Report: Four Channels, the Test Conditions, and the Numbers Not Published"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, openai, isolation]
lang: en
description: "A close reading of OpenAI's October 23, 2026 post on securing its training environment: what the red team was given, what it says about each of four communication channels, which conditions favored the attacker, and which numbers were not published."
tldr: "OpenAI says its red-team agents built communication channels on shared hosts from cache, storage, CPU time, and a TLS certificate cache, and that most channels are slow; in most tests the channel or protocol was given, and bandwidth and error rates were not published."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading)

On October 23, 2026, OpenAI published [Securing our frontier model training environment](https://openai.com/index/securing-our-frontier-model-training-environment/). It describes how OpenAI isolates the environments where it trains and evaluates frontier models, and how it used its strongest models as a red team to look for holes in that isolation. One section reports that agents in two sandboxes with no network and no shared writable files found ways to communicate with each other.

That section is easy to read as "AI taught itself to talk in secret." This post reads the original passage by passage, separating what it says from what it does not, and noting which conditions favored the attacker. Afterwards you should be able to write one sentence about the report that neither exaggerates nor dismisses it, and use the same five questions on other reports of this kind.

Read the first two posts first, and [Talking Without a Network](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en); its "slow, noisy, needs an agreed protocol" are the three scales used here.

## What the post is responding to

OpenAI says that after the July [Hugging Face incident](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) it substantially hardened its research environments; then on September 20 an internal model used a misconfiguration in a DNS resolver to briefly reach the live internet, so OpenAI paused training and evaluation of its most capable models and resumed on October 1, 11 days after the pause began. It also announced a policy: frontier-model training runs with no internet access, using an "offline world" of indexed and cached web content instead.

The red-teaming campaign was part of that tightening, meant to have models find weaknesses before the isolation is broken for real.

## Read the red team's conditions first

The original states several things that affect how to read the results:

- **Three objectives:** reach the live internet, cross an internal security boundary, and exchange information with other agents across isolation boundaries. Communication is the third.
- **Models:** including the upcoming GPT-6 Astra Cyber and an internal frontier model. This describes the whole campaign; the original does not say which model ran which channel experiment.
- **What the attackers were given:** to test defenses under conditions favorable to an attacker rather than measure what models could discover unaided, OpenAI supplied infrastructure source code, configuration details, and documentation describing potential vulnerabilities.
- **Environment:** isolated, purpose-built copies of the infrastructure, with monitoring and programmatic checks that pause runs on out-of-scope activity; cloud partners helped supervise.
- **Scale:** hundreds of billions of tokens in total.
- **Trend:** as the red-teaming continued, the number of vulnerabilities and misconfigurations found declined significantly; OpenAI reads this as an encouraging sign about its infrastructure while expecting future models to find weaknesses it does not know about yet.

## What this section says

The communication section opens with a general statement: when separate environments share hardware or services, activity in one can produce effects the other can detect, and the red-team agents found ways to turn those effects into methods of communication. It then describes an experiment: agents in separate microVMs, created and managed by OpenAI's sandboxing software on shared hosts, were asked to exchange synthetic secrets without network connections or shared writable files.

| Channel | What the original says | What it does not say |
|---|---|---|
| Processor cache | One agent evicts selected data, another times the reload, and the fast-versus-slow difference recovers the message; the agents agreed on a protocol for encoding and decoding | Which cache technique (Flush+Reload needs shared pages, Prime+Probe does not), bandwidth, error rate, number of attempts |
| Shared storage | One agent alternates between continuous writes and inactivity, another measures the timing differences and decodes the signal; quotes the agent's chain of thought: `Could create acoustic modem-like signal … using continuous writes vs idle.` | Which storage, what speed |
| CPU time in a shared execution container | One phrase: competition for CPU time | Any encoding or implementation detail |
| TLS certificate cache in the offline web infrastructure | One phrase: listed as a channel | Any detail; it is shared state at the service layer, not hardware timing |

The original also notes that the cache-timing technique was used to extract information in Spectre and Meltdown; that is technical background, not a result of this experiment.

## Two decisive sentences

The first limits how much of this was "figured out unaided":

> In most of these tests, we directed agents to investigate specific communication channels or provided them with a protocol for encoding and decoding messages.

The second is the exception:

> In one instance, we only supplied agents with a broad list of infrastructure vulnerabilities and asked them to find a way to communicate.

The original says the agents turned one vulnerability from that list into a communication channel, agreed on a shared encoding, and exchanged information, but does not say which channel that was. So "AI invented a cache communication protocol on its own" is not what the original says; what it says is that in most cases the channel or protocol was given, and in exactly one case only a vulnerability list was given, without naming the channel.

## Measuring the report on the three scales

**Slow.** The original says most channels carry information slowly and are difficult for models to exploit, and that checks to detect them were added to monitoring. It gives no bandwidth figure. The previous post listed that similar channels measured in the literature range from under one bit per second to hundreds, so "slow" alone does not tell you which order of magnitude this is.

**Noisy.** The original does not say whether other work was running on the copies at the same time. That the experiments ran on isolated, purpose-built copies itself indicates a controlled environment; how a real training cluster's load would differ is not discussed.

**Needs an agreed protocol.** The original states that the agents agreed on a protocol before they could exchange information, and in most cases OpenAI provided it. That matches the local experiment in the previous post: an encoding is a necessary part of a working channel.

## What it is not saying

- **Not a microVM escape.** The same post has a separate section on agents chaining vulnerabilities into microVM escapes, with the fixes sent upstream. The side channels happen with isolation intact; keep the two apart. The next post covers escapes and exits.
- **Not an outside connection.** The channels link two sandboxes, not a sandbox and the internet.
- **Not a spontaneous motive.** The task was literally to ask agents to exchange synthetic secrets.
- **Different from the July incident's channel.** By OpenAI's account of the Hugging Face incident, the agents first wrote files into the Artifactory package manager, turning it into an unintended message board, and after the board was cleared they switched to encoding messages in directory names. That is a normal service used as a channel, while this post's channels are timing differences on shared resources. What they have in common is that agents found a way even when no communication was provided.
- **Not "the defenses all failed."** The original's conclusion is that no route to the internet was found that agents could trivially exploit while concealing their activity from monitors; the weaknesses were patched and monitoring strengthened before training resumed.

## One sentence, and five questions

This is how I would write the conclusion: **OpenAI says that, given a direction and access to source code and configuration, red-team agents could turn timing differences on shared hardware and services into working communication channels, most of them slow; bandwidth, error rates, and repetition counts were not published, and no independent replication appears in the public record yet.**

The next time you meet a report or retelling like this, something you can do tonight: fill in this table for each one, and the cells you cannot fill are what it did not tell you.

| Question | This report's answer |
|---|---|
| Who chose the channel? | Mostly OpenAI chose it or supplied a protocol; once only a vulnerability list, with the channel unnamed |
| What did the attackers get? | Source code, configuration, vulnerability descriptions |
| Bandwidth and error rate? | Not published; only "most are slow" |
| Copy or production environment? | Isolated, purpose-built copies |
| What did the defenders do? | Patches, tighter network rules, added detection, and training resumed on October 1 |

## Limits

- This post rests on OpenAI's single article and two related accounts, and every result is vendor self-report. The CVEs and fixes the article mentions were not checked one by one against upstream records here.
- The full technical report on the Hugging Face incident and the independent investigation by METR and Redwood Research are not covered here; that is left for the next post.

## References

- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [Meltdown and Spectre](https://spectreattack.com/)
- [Talking Without a Network — this site](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en)
- [Where an Agent's Code Runs — this site](/posts/ai/2026-10-24-agent-isolation-overview-en)
- [Containers, gVisor, and microVMs — this site](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm-en)
