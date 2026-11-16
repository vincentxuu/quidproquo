---
title: "Security Alert | AI Agents Hunt Keys Automatically — ARTEX Scans LiteLLM, Dify and Other AI Apps for Provider Keys"
date: 2026-11-17
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "Amazon's decoy network uncovered ARTEX agents scanning exposed LiteLLM, One API, Dify, and RAGFlow instances to steal AI provider API keys and feed a self-funding attack loop; Cloudflare, Microsoft, and the FBI each confirmed related activity the same week."
tldr: "Amazon's MadPot decoy network captured ARTEX agent operation logs from Oct 3 to Nov 5: agents scanned exposed LiteLLM, One API, Dify, RAGFlow, and Langflow instances, stealing AI provider keys via default credentials, CVE-2025-3248, CVE-2026-28797, and an isCliRequest auth bypass, then verified and pooled them to run more attacks. Cloudflare, Microsoft, and the FBI each confirmed related activity affecting hundreds of targets the same week. Defense: inventory exposed AI apps, rotate default credentials, patch the CVEs, and set expiry/IP restrictions on API tokens."
series:
  name: "AI Security Alert"
  order: 80
---

> 🌏 [中文版](/posts/daily/2026-11-17-security-artex-ai-agent-key-theft-litellm-dify)

## What Happened

Amazon's threat intelligence team runs a decoy sensor network called MadPot. Between October 3 and November 5, 2026, it captured a batch of AI agent "operating memory" — operator instructions and the results agents reported back. The records show an attacker-operated agent, built on ARTEX (an open-source agentic penetration-testing framework), automatically scanning internet-exposed AI gateways and app-builder platforms (LiteLLM, One API, Dify, RAGFlow, Langflow, and more), stealing AI provider API keys through default credentials, unpatched CVEs, and authentication bypasses, verifying each key, pooling the working ones, and then using AI models run on those stolen keys to go hunt for the next batch. The same week, Cloudflare, Microsoft, and the FBI each published reports confirming related or overlapping activity — this isn't an isolated incident, it's an attack chain that has already scaled.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | AI infrastructure vulnerability scanning + API key theft (data exfiltration) |
| Scope | Internet-exposed instances of LiteLLM, One API, New API, Veloera, Sub2API, Dify, FastGPT, Langflow, RAGFlow, Open WebUI, LobeChat, Ollama, and similar AI gateways/app-builder platforms |
| Severity | High |
| CVE | CVE-2025-3248 (Langflow, missing authentication enabling remote code execution), CVE-2026-28797 (RAGFlow, server-side template injection) |
| Sources | [The Hacker News](https://thehackernews.com/2026/11/amazon-uncovers-ai-agent-campaign.html), [AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/), [Cloudflare Blog](https://blog.cloudflare.com/adapting-to-ai-penetration-testing-orchestrators/) |

## Attack Surface Analysis

An operator gives ARTEX a target and a high-level goal. A planner agent splits the goal into tasks for worker agents that run security tools, and each next step gets decided by querying an LLM. For this key-hunting campaign, the agents followed a built-in playbook: find each target product's known "password-free" entry points — LiteLLM's default master key, installs left unfinished and open to takeover, known Langflow and RAGFlow flaws, an auth bypass via the `isCliRequest` header across the One API family, and keys scattered through client-side JavaScript, source maps, debug routes, and environment files. Once a key was found, agents verified it worked, pooled the valid ones, and then used AI models run on those pooled keys to keep searching GitHub, npm, PyPI, container image layers, paste sites, and Telegram channels for the next batch of leaked keys — a chain that funds itself without an attacker having to keep intervening.

```diagram
title: ARTEX's Self-Funding Key-Theft Loop
desc: ARTEX agents scan exposed AI apps for keys, verify and pool them, then use models run on the pooled keys to plan the next round of scanning and searching — the pool grows larger with every cycle.
caption: Simplified, reconstructed from operation logs captured by Amazon's MadPot decoy network; the real campaign involved multiple independent operators and tools, and some details may not match exactly.
step: Scan internet-exposed AI gateways and app-builder platforms for known flaws and default credentials
step: Steal keys, verify they work, and write them into the shared key pool
step: Call an AI model using pooled keys to plan the next round of scanning and searching
step: Search GitHub, npm, paste sites, and Telegram channels for more leaked keys
step: Return to scanning more exposed AI apps, with a larger key pool than the last cycle
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="152" y="16" width="136" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">Scan exposed AI apps</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">LiteLLM・Dify・RAGFlow</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="304" y="168" width="136" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Steal &amp; verify keys</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">defaults・CVEs・bypass</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="152" y="320" width="136" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">Call AI model to plan</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">using pooled keys</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="0" y="168" width="136" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">Search for more keys</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">GitHub・npm・Telegram</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">Shared key pool</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">grows every cycle</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">write</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">call</text>
</svg>
```

The root cause isn't a weakness in the AI model — it's a long list of ordinary AppSec gaps that an AI agent swept through all at once, at scale, without stopping: default or hardcoded admin passwords, known CVEs left unpatched, management interfaces and inference endpoints with no authentication, and secrets left in front-end code and environment files. Cloudflare's incident response cases add another layer: a static CI/CD API token with no expiry and no IP restriction, once leaked, let an attacker jump directly from a cloud provider's environment into a customer's Cloudflare account and fire off 400 database dump requests within an hour. Amazon's team put it bluntly: "None of the techniques in these campaigns were new. What AI agents change is the speed and persistence of the attacker."

Mapped to the OWASP LLM Top 10: **LLM02 Sensitive Information Disclosure** (keys scattered across front-end JS, source maps, debug routes, `.env` files) + **LLM05 Supply Chain Vulnerabilities** (unpatched known CVEs in upstream components like Langflow and RAGFlow).

## Defense

**Immediate actions**
- Inventory every externally exposed AI gateway and app-builder platform (LiteLLM, One API, Dify, FastGPT, Langflow, RAGFlow, Open WebUI, LobeChat, Ollama, and similar), and rotate every default admin credential — especially LiteLLM's default master key. Confirm no instance was left half-installed and exposed.
- Upgrade Langflow to 1.3.0+ to fix CVE-2025-3248; upgrade RAGFlow to 0.25.0+, which renders templates in a sandbox to mitigate CVE-2026-28797.
- Search config files, environment variables, deployment scripts, CI/CD pipelines, and databases for hardcoded keys; keep scanning repos and container image layers, and rotate anything found immediately.
- Set expiry dates and client-IP restrictions on API tokens for services like Cloudflare; check accounts for Worker scripts named `artex-*`, `artex-pgrecon-*`, `artex-pgw-*`, or `artex-do-*`.

**Long-term architecture**
- Treat AI apps, model gateways, and inference endpoints as production systems: assume their secrets will be found quickly, and watch for anomalous usage or spend as a detection signal.
- Adopt an AI/ML asset and vulnerability scanner such as Protect AI to continuously inventory shadow AI apps and their exposure.
- Use a tool such as Noma Security for AI app discovery and secret/key governance, so a team's self-hosted LiteLLM or Dify instance doesn't turn into an unmanaged exposed surface.
- Subscribe to Cisco Talos's ARTEX IOC lists and Snort rules (7:76, 7:77, 7:78) to feed known attacker IPs and behavioral signatures straight into the defense pipeline.

## Impact

Amazon's team notified AWS customers who may have been affected, but stressed that decoy records only show what attackers were trying to do — the outcomes agents reported back can't be independently verified. The records cover hundreds of targets across AI app platforms and other systems. The FBI's FLASH alert rolled up at least 11 earlier reports, noting ARTEX has been used against organizations across many industries since at least August, including an earlier incident that exposed personal data for roughly 67,000 people at South Korean financial institutions, and the ConnectWise supply-chain breach. ARTEX's original developer took the GitHub repo offline on October 8 after abuse reports, but community forks, archived copies, and a commercial version called ARTEX PRO keep it circulating — meaning this attack chain isn't going away any time soon.

If your team runs LiteLLM, Dify, or any AI gateway or app-builder platform internally — even for testing — assume it's already being scanned automatically. These platforms centralize API keys for multiple providers, so a single weak point exposes access to every upstream service at once.

## Today's Takeaway

What stands out here isn't another exploited CVE — it's that the attack chain funds itself: stolen keys are immediately used to run the AI models that find more keys. Discussion of AI supply-chain security has mostly focused on malicious package impersonation, but this shows another path — legitimate, common AI infrastructure (gateways, app-builder platforms) is itself a high-value target, because it's inherently "the key to the keys": one weak admin page exposes access to every provider behind it at once.

## References

- [Amazon Uncovers AI Agent Campaign Targeting LiteLLM, Dify, and Other Apps for API Keys — The Hacker News](https://thehackernews.com/2026/11/amazon-uncovers-ai-agent-campaign.html)
- [Amazon Threat Intelligence observes threat actors running cybercrime campaigns with ARTEX AI agents — AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/)
- [Adapting to AI penetration-testing orchestrators — Cloudflare Blog](https://blog.cloudflare.com/adapting-to-ai-penetration-testing-orchestrators/)
- [Threat actors use agentic AI tooling to find and abuse exposed secrets — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/)
- [ARTEX AI Agents Used in Credential Theft & KYC Deepfake Campaigns — Aviatrix Threat Research](https://aviatrix.ai/threat-research-center/artex-ai-agents-credential-theft-kyc-deepfake-2026/)
- [Langflow 1.3.0 Release Notes (fixes CVE-2025-3248) — GitHub](https://github.com/langflow-ai/langflow/releases/tag/1.3.0)
- [RAGFlow Security Advisory GHSA-vvwj-fvwh-4whx (CVE-2026-28797) — GitHub](https://github.com/infiniflow/ragflow/security/advisories/GHSA-vvwj-fvwh-4whx)
