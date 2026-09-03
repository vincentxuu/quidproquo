---
title: "Security Alert｜AI Safety Research Org METR Had an API Key Stolen and Burned $600K in Inference Credits — Attackers Found the Exposed Agent Dashboard via Certificate Transparency Logs"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "METR disclosed two 2026 security incidents: in March, a fail-open bug in a researcher's vibe-coded agent dashboard silently disabled auth, letting attackers prompt the agent directly to hand over its API key and burn roughly $600K in inference credits over three weeks; in May, a systematic attack campaign coincided with an accidentally exposed read-only SQL endpoint that nearly leaked unpublished evaluation data."
tldr: "METR (a nonprofit that evaluates frontier AI models' ability to carry out long-horizon agentic tasks) published a security update on August 31 covering two 2026 incidents. In March, a researcher ran a 'vibe-coded' agent orchestration dashboard on a personal EC2 instance meant to sit behind Google auth; a fail-open bug silently disabled that authentication, exposing the system publicly for several days. Attackers likely found it by scanning certificate transparency logs for newly registered sites with high-signal LLM/agent keywords, then prompted the exposed agent directly to reveal its model-provider API key, added an SSH key for persistence, and used the stolen credential to consume roughly $600,000 worth of inference credits over three weeks (credits the model provider had granted METR for free, so not a direct financial loss to METR). In May, METR was targeted by a likely financially motivated attacker running systematic infrastructure scans and staff phishing; during the same window, a bug in a read-only SQL query mechanism behind METR's public transcript viewer let a database meant to hold only public-model data accidentally include some sensitive model output — caught and patched after an independent researcher responsibly disclosed it, with no evidence attackers ever exploited it. Defense takeaways: treat public-facing agent deployments as production infrastructure, put spend caps and anomaly alerts on every API key, and architecturally isolate public endpoints from internal systems."
series:
  name: "AI Security Alert"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-02-security-metr-api-key-theft)

## Incident Overview

METR (Model Evaluation and Threat Research, a nonprofit that evaluates frontier AI models' ability to carry out long-horizon agentic tasks) published a security update on August 31, proactively disclosing two 2026 incidents it characterizes as "near-misses" that caused no major damage. The first, in March, involved an internal researcher running a "vibe-coded" (quickly built with AI assistance, without formal security review) agent orchestration dashboard on their own personal AWS EC2 instance, intended to sit behind Google authentication. A fail-open bug in the app silently disabled that authentication under certain conditions, leaving the system exposed to the open internet for several days. The attacker likely found it by browsing certificate transparency logs — publicly queryable records of TLS certificate issuance — for recently registered sites carrying high-signal LLM/agent keywords, a technique for hunting down exactly this kind of accidentally exposed API key. Once found, the attacker prompted the exposed agent directly, asking it to hand over the model-provider API key it held, added an SSH key for persistent access, and over three weeks used the stolen credential to burn inference credits on public models worth roughly $600,000 at market rate (the credit had been granted to METR for free by the model provider, so this represents the value of resources stolen and abused rather than a direct financial loss to METR). The second incident, in May, saw METR targeted by a likely financially motivated attacker running systematic scans of public infrastructure alongside staff phishing attempts; during the same window, a bug in a read-only SQL query mechanism built into METR's public transcript viewer let a database meant to hold only public-model data accidentally include some sensitive model output. An independent security researcher discovered and responsibly disclosed the issue, prompting METR to take the endpoint offline and pay a bounty; the investigation found no evidence the data was ever actually accessed. The Hacker News, Infosecurity Magazine, and other outlets have since covered the findings.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Credential theft via fail-open auth bypass (agent dashboard exposure) + accidental sensitive-data exposure (SQL endpoint) |
| Scope | One METR public-model API key (Incident 1); METR's public transcript-viewer evaluation database, which briefly included a small amount of sensitive model output that should have been isolated (Incident 2) |
| Severity | Medium (METR assesses no sensitive data was actually accessed, but the key theft and ~$600K in abused credits definitely occurred) |
| CVE | None (internal logic/configuration flaws in self-built systems, not a public package vulnerability) |
| Source | [METR official security update](https://metr.org/blog/2026-08-31-security-update/), [The Hacker News](https://thehackernews.com/2026/09/attackers-steal-metr-api-key-and.html), [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/attackers-steal-metr-api-key/) |

## Attack Surface Analysis

Incident 1's attack path breaks into three stages: reconnaissance, breach, and monetization. In reconnaissance, the attacker wasn't targeting METR specifically — they scanned certificate transparency logs (publicly queryable TLS issuance records) for recently registered sites with high-signal LLM/agent-related content, an opportunistic hunt that exploits the common habit in the AI-practitioner community of shipping first and securing later, rather than a directed attack on METR. The root cause of the breach itself is a textbook fail-open design flaw: the system was supposed to require Google authentication, but under certain conditions the auth logic would "silently fail and allow through" instead of "fail and deny" — a defect especially common in prototypes quickly assembled with AI assistance and never subjected to formal security review, since developers typically only test the happy path where auth succeeds and rarely test what happens when the auth component itself breaks or is misconfigured. The monetization stage is the most notable part: rather than using a traditional technique like packet sniffing or brute force to obtain the key, the attacker simply prompted the exposed agent directly, asking it to "say" the API key it held — effectively redirecting social engineering from a human target to an agent, which has no built-in reason to be suspicious of what looks like a legitimate operational request. Incident 2's root cause is a permission-scoping failure: the read-only SQL mechanism was designed to default to public-model data only, but a code bug meant the underlying database itself contained sensitive model output that shouldn't have been there — meaning the "scope restriction" was enforced only at the application logic layer, not through actual isolation at the data layer.

Mapped against the OWASP LLM/Agentic Top 10, Incident 1 hits both **Excessive Agency** (the agent was granted the ability to read out and return its own credentials, beyond what its task required) and **Improper Credential/Secret Management** (a high-value credential co-located with a publicly reachable agent deployment in an unmanaged environment). Incident 2 maps to **Sensitive Information Disclosure**, rooted in a gap between data classification policy and actual database-level isolation. What both incidents share: the attack surface wasn't the model itself, but the infrastructure hygiene surrounding model deployment — which is exactly why METR's report goes out of its way to note "this is not an AI agent autonomously hacking during an evaluation."

## Defense

**Immediate actions**
- Audit whether any staff have deployed agent/LLM applications carrying production API keys on personal cloud accounts or unmanaged infrastructure, especially "get it working first, secure it later" prototypes or demos
- Enable spend caps and anomaly alerts on every model-provider API key — don't assume "it's free so it's safe" or "rate limits will catch it," since METR's own team was slower to notice the abuse precisely because the credit was free and they were already accustomed to a high volume of rate-limit noise
- Review any public-facing read-only query or viewer feature (transcript viewers, log viewers, debug endpoints) to confirm it actually cannot reach data outside its intended scope — specifically verify that the underlying database itself enforces data isolation, not just the query-layer filtering logic
- Test authentication for failure modes: deliberately make the auth service time out, error, or misconfigure, and confirm the system's default behavior is to deny access (fail-closed) rather than allow it through (fail-open)

**Long-term architecture**
- Establish a pre-launch security review process for anything public-facing that touches production credentials, even a researcher's own quick prototype — this is one of the concrete changes METR made after Incident 1
- Architecturally isolate public-facing services from internal sensitive infrastructure, so a misconfiguration in one public service can't cascade into internal data exposure — exactly the change METR made after Incident 2
- Evaluate AI security posture management (AI-SPM) tools like watchlist B7's Noma Security or WitnessAI for centralized inventory and anomaly monitoring of scattered model API keys, agent deployments, and data access paths across an organization, so critical credentials don't end up living as "an environment variable in someone's personal project" outside managed scope
- Build cross-platform credential lifecycle management: shorten the lifespan of long-lived credentials, apply least-privilege scoping to sensitivity-tiered data and model access, and run ongoing threat-modeling reviews — the direction METR says it will continue investing in

## Impact

METR states clearly that in neither incident is there evidence that its most sensitive data (internal IP, training details, release timelines, etc.) was accessed. The direct impact of Incident 1 was roughly $600,000 worth of inference credits abused over three weeks; since the credit was granted free by the model provider, METR incurred no actual payment loss, but the attacker did genuinely obtain and misuse computing resources with real market value. Incident 2 was contained thanks to responsible disclosure by an outside researcher and METR's quick response taking the endpoint offline; METR assesses that attackers probed the endpoint in passing as part of their broader campaign, but found no sign they actually discovered and exploited the underlying bug. METR shared the report with partner AI companies for preview before publishing it.

If your team has this kind of gray-zone deployment — an experimental agent tool carrying production credentials, running on a researcher's personal account — the takeaway isn't that METR did something wrong (its security maturity is relatively high for an organization of its kind, including SOC 2 Type I certification), but that even with solid organizational security investment, an individually driven, quickly shipped vibe-coded prototype can still become the breach point for the whole org's credentials. That risk doesn't disappear just because the organization's overall security posture is good — it needs its own dedicated process to close.

## Today's Takeaway

When I've thought about agent credential leaks before, the instinct is to picture indirect techniques — a malicious tool returning a payload that tricks the agent into leaking secrets. But in this incident, the attacker just directly and openly instructed an exposed agent to hand over its own API key — no injection, no obfuscation needed, simply because the agent already had the ability to read out and return that key, and the external auth layer happened to be broken. It's a reminder that Excessive Agency doesn't need a sophisticated attack technique to be exploitable: once an interface with credential access is accidentally exposed, the cheapest attack is always just to ask.

## References

- [Update on Security at METR — METR official blog](https://metr.org/blog/2026-08-31-security-update/)
- [Attackers Steal METR API Key and Consume AI Credits Worth About $600,000 — The Hacker News](https://thehackernews.com/2026/09/attackers-steal-metr-api-key-and.html)
- [Attackers Steal METR API Key and Burn $600,000 in AI Credits — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/attackers-steal-metr-api-key/)
