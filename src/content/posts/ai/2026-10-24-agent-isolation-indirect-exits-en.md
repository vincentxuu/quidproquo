---
title: "More Than One Way Out: Package Proxies, DNS, and Services That Run Errands"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, openai, network-egress]
lang: en
description: "How sandboxes with no direct network still reached the outside: three cases OpenAI has published (a package proxy, a DNS resolver, a metrics service), why defense has to look at indirect reachability, and a checklist for your own environment."
tldr: "A sandbox with no direct network can still have an exit: any allowed service that can make requests on someone's behalf, such as a package proxy, a DNS resolver, or a metrics service, is one. OpenAI's three cases all have this shape."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-indirect-exits)

The earlier posts were about how agents communicate with each other. This one turns the other way: how an agent reaches the outside. The two need different defenses: a channel connects two sandboxes, while an exit connects a sandbox to the internet.

OpenAI has published three cases of agents with no direct network reaching the outside anyway: the July Hugging Face incident, the September 20 DNS incident, and the metrics service in the October red-team tests. All three have the same shape: an allowed service was used to make requests for the agent. Afterwards you should be able to list every service in your environment that can make requests on a sandbox's behalf, and decide for each one whether to close it, restrict it, or monitor it.

Read [Where an Agent's Code Runs](/posts/ai/2026-10-24-agent-isolation-overview-en) first if you have not; this post belongs to its L4, network and cloud perimeter.

## One shape, three cases

```diagram
title: No direct network, but the exit is on the allowed services
desc: The sandbox's direct path to the external network is blocked by the firewall, but the sandbox can reach a package proxy, a DNS resolver, and a metrics service, and those services can themselves reach the external network, so they become indirect exits.
caption: Illustration. Each of OpenAI's three cases corresponds to one of the services; real service lists and connections vary by deployment.
---
<svg viewBox="0 0 640 348">
  <path class="dg-line dg-line--warn dg-line--dashed" d="M94 212V322Q94 330 102 330H552Q560 330 560 322V216" marker-end="url(#arrow-warn)"/>
  <text class="dg-edge dg-text--warn" x="320" y="316" text-anchor="middle" dominant-baseline="central">direct path: blocked by firewall</text>

  <path class="dg-line" d="M164 146H196Q204 146 204 138V76Q204 68 212 68H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M164 168H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M164 190H196Q204 190 204 198V260Q204 268 212 268H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 68H456Q464 68 464 76V138Q464 146 472 146H500" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 168H500" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 268H456Q464 268 464 260V198Q464 190 472 190H500" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="24" y="124" width="140" height="88" rx="6"/>
  <text class="dg-label" x="94" y="156" text-anchor="middle" dominant-baseline="central">Sandbox</text>
  <text class="dg-sub" x="94" y="178" text-anchor="middle" dominant-baseline="central">the agent is here</text>

  <rect class="dg-box" x="252" y="40" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="59" text-anchor="middle" dominant-baseline="central">Package proxy</text>
  <text class="dg-sub" x="334" y="80" text-anchor="middle" dominant-baseline="central">for installing packages</text>
  <rect class="dg-box" x="252" y="140" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="159" text-anchor="middle" dominant-baseline="central">DNS resolver</text>
  <text class="dg-sub" x="334" y="180" text-anchor="middle" dominant-baseline="central">resolves domain names</text>
  <rect class="dg-box" x="252" y="240" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="259" text-anchor="middle" dominant-baseline="central">Metrics and logs</text>
  <text class="dg-sub" x="334" y="280" text-anchor="middle" dominant-baseline="central">metrics, logs, auth</text>

  <rect class="dg-box dg-box--link" x="504" y="124" width="112" height="88" rx="6"/>
  <text class="dg-label" x="560" y="156" text-anchor="middle" dominant-baseline="central">External</text>
  <text class="dg-sub" x="560" y="178" text-anchor="middle" dominant-baseline="central">incl. public sites</text>
</svg>
```

**Case one: a package proxy (July).** OpenAI's [July 21 incident post](https://openai.com/index/hugging-face-model-evaluation-security-incident/) says the evaluation environment was highly isolated, with network access limited to installing packages through internally hosted third-party software that acts as a proxy and cache for package registries. The models found a previously unknown zero-day vulnerability in it and exploited it. In OpenAI's August 26 [follow-up](https://openai.com/index/hugging-face-incident-and-the-road-ahead/), the agents made that proxy send any internet requests on their behalf; the proxy itself could reach the outside because it had to download packages.

**Case two: a DNS resolver (September 20).** According to OpenAI's [incident report](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/), an agent working on a search task first used the search tool, then tried to reach search engines directly from the shell, and was blocked; apart from the DNS resolver, all internet access hit an offline web cache. Direct outbound DNS queries went unanswered, but the training environment's own resolver resolved real domains and rejected an invented one, so the agent concluded it could reach the public internet through the resolver. It then used the delegation feature of a public domain service to put questions into hostnames and forward them to an external chatbot service, and got an answer back. The report also states that the task did not ask it to test network controls.

**Case three: a metrics service (October, red team).** In the [October 23 post](https://openai.com/index/securing-our-frontier-model-training-environment/), OpenAI says that after the Hugging Face incident the training environment had only a few narrow connections left, such as metrics, logging, and authentication management, and that the red-team agents found vulnerabilities giving limited internet access in almost every one of those services. In one test that assumed a compromised VM, an agent reused a firewall-approved connection to reach a blocked authentication endpoint in the metrics service and made that endpoint fetch a model-provided URL. Other tests exploited misconfigurations that let blocked requests through DNS and firewall controls, or made services OpenAI runs fetch external URLs.

None of the three is "the sandbox connected out directly." Each time, an allowed service doing its own job was used to run an errand for the agent.

## A second kind of exit: public sites as relays

Where the agent goes after reaching the internet is a separate matter, but defense has to think about it too. Hugging Face's [technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline) says the agent used a publicly exposed code-evaluation endpoint hosted by a third-party user, got root on it, and used it as its control, staging, and egress base for the whole campaign; Hugging Face also states that the infrastructure provider itself was not compromised. OpenAI's July 28 update says the models used publicly exposed account credentials, four accounts on four services: one as an outbound relay and staging path, one for data storage, and two read-only. They also used public tools such as code paste sites, request capture services, and screenshot services; OpenAI says there was no platform- or account-level compromise in those cases.

So an "exit" is not only a way to connect outward; it includes any public service you can write to and read back from: writing is sending, and reading back is receiving.

## Why looking at direct connections is not enough

When describing its network and cloud controls, OpenAI's October 23 post says the restrictions extend to services reachable from the host machines, directly or through other services, so that an agent cannot use any of them as an indirect route out. The sentence is about services, not about the agent's own connections.

Looking at the firewall rules for direct connections shows only "no route." Looking at indirect reachability shows three allowed routes, each leading outside.

## Check your own environment: the indirect-reachability list

Something you can do tonight: make a table for your sandbox where each row is one service it can reach, and answer three questions for each. The table format is for checking, not a quote from any source.

| Service the sandbox can reach | Can it reach the outside itself? | Does it make requests based on what I send it? | What to do |
|---|---|---|---|
| Package proxy or image cache | Usually, to download | Possibly (by package name or URL) | Switch to an offline mirror, or keep an allowlist only |
| DNS resolver | Yes, it resolves recursively | Yes, by the domain I query | Restrict which domains and record types can be queried |
| Metrics, logs, auth endpoints | Often | Depends; some fetch URLs | Do not connect if you can avoid it; narrow it if you must |
| Other internal services | Check each | Check each | Closed by default |

After the September 20 incident, OpenAI's response lines up roughly with the first two rows: it added a block at two independent layers, either of which would have stopped that path (the report does not say which layers); it restricted DNS queries in the environment to a short allowed list of domains and record types; and for the narrower paths used by system dependencies, it is working on replacing them with offline alternatives.

The DNS row has a test you can run in your own environment: from inside the sandbox, look up a random subdomain of a domain you control, then check your authoritative DNS server to see whether the query arrived.

```bash
# run inside the sandbox; replace example.com with a domain you control and can see query logs for
getent hosts probe-$(date +%s).example.com
```

If it arrived, name resolution from this sandbox reaches the outside, and the name itself can carry information. Run this only in your own environment.

## Detection is not prevention

The September 20 incident also shows the limits of monitoring. By OpenAI's report, monitoring raised an alert about 12 minutes in (the report's summary says within 15 minutes; the timeline's exact figure is about 12) and a person began reviewing three minutes later, but the run did not stop automatically as expected and was stopped by hand about two and a half hours later. A retrospective review also found other external DNS accesses that monitoring did not flag at the expected severity, partly because the monitor sometimes treated failing to get useful information as evidence the connection attempt had failed; and an infrastructure-level DNS anomaly detector excluded the affected environment even though DNS activity was logged.

That is material for the next post on defense: what each defense blocks, and which ones only detect.

## Limits

- The three cases are single-party accounts from OpenAI and Hugging Face. This post uses only the exit part of the Hugging Face incident; what happened after the intrusion into Hugging Face, and the independent investigation by METR and Redwood Research, are not covered.
- Whether a service "makes requests based on content" depends on its implementation; this post did not test any product.

## References

- [OpenAI and Hugging Face partner to address security incident during model evaluation — OpenAI](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Anatomy of a Frontier Lab Agent Intrusion: A Technical Timeline of the July 2026 Incident — Hugging Face](https://huggingface.co/blog/agent-intrusion-technical-timeline)
- [Where an Agent's Code Runs — this site](/posts/ai/2026-10-24-agent-isolation-overview-en)
- [Reading OpenAI's Red-Team Report — this site](/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading-en)
