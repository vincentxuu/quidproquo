---
title: "Security Alert | SGLang RCE Breaches NEAR AI's Confidential Inference Environment, Hits 18 Agents and About 100 Users"
date: 2026-11-20
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "An attacker exploited a remote code execution flaw in the open-source SGLang inference engine to break into a NEAR AI inference server running inside a confidential computing environment, reading account data for about 100 users and chat history from 18 legacy agents, with that day's confidential-mode requests potentially exposed too."
tldr: "On 2026-11-08, an attacker exploited an RCE flaw in SGLang to get code execution on one of NEAR AI's inference servers, then read account details for about 100 users and chat history from 18 legacy agents, while two customers' API keys leaked through logs. Confidential-mode requests processed on that server that day could theoretically have been observed too. NEAR AI hasn't named a CVE, and SGLang already has several unpatched flaws this year. Defense: teams self-hosting SGLang should lock down admin endpoints and disable pickle IPC immediately; anyone using a confidential-inference service should be asking their vendor for patch cadence and attestation proof, not just checking a TEE box."
series:
  name: "AI Security Alert"
  order: 83
---

> :globe: [中文版](/posts/daily/2026-11-20-security-sglang-rce-near-ai-confidential-inference-breach)

## Incident Overview

NEAR AI published an incident report on 2026-11-09 confirming that, the day before, an attacker exploited a remote code execution (RCE) flaw in the open-source SGLang inference engine to gain code execution on one of its inference servers and move into internal systems from there. The attacker reached an internal system behind the deprecated Private Chat product and downloaded account details — email addresses and names, with plan and balance information for some accounts — for about 100 users. They also accessed 18 legacy NEAR AI Agents running outside the company's confidential computing (TEE) environment, pulling their chat history, settings, and logs. Two customers' NEAR AI Cloud API keys leaked because they'd been written to logs; both have since been revoked. The more striking part: SGLang itself runs inside the TEE, so the code-execution foothold theoretically gave the attacker the same view as the legitimate workload — including requests sent in confidential mode on that server that day, the exact traffic confidential computing is supposed to hide even from NEAR AI itself. The Hacker News, The Block, Decrypt, and the Cloud Security Alliance are among at least five independent outlets and research groups that reported and cross-confirmed the incident.

**Key Facts**

| Field | Value |
|---|---|
| Incident type | Remote code execution (open-source SGLang inference engine flaw breaches a confidential-computing inference server, followed by lateral movement) |
| Scope | A single NEAR AI Cloud confidential-inference server; account data for about 100 users, 18 legacy NEAR AI Agents running outside the TEE, and 2 Cloud API keys |
| Severity | High (the confirmed data exposure is bounded and affected users have been notified, but the incident breaks the assumption that confidential computing shields data from everyone) |
| CVE | None named — NEAR AI hasn't identified the exact flaw exploited; CERT/CC disclosed six unpatched SGLang vulnerabilities in July, three of which enable RCE, and it's unclear whether either overlaps with this incident |
| Sources | [NEAR AI's official incident report](https://near.ai/blog/security-incident-report-sglang-vulnerability), [The Hacker News](https://thehackernews.com/2026/11/sglang-rce-exploit-breaches-near-ai.html), [Cloud Security Alliance research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-confidential-ai-inference-tee-limits-20261/) |

## Attack Surface Analysis

The entry point was SGLang, the open-source engine NEAR AI uses to serve inference workloads. SGLang runs inside a confidential virtual machine (CVM) protected by AMD SEV-SNP or Intel TDX — in theory, even the cloud operator shouldn't be able to see what's being processed inside. But NEAR AI's own incident report puts it plainly: confidential computing protects data from the operator and the host, but it "does not protect against a vulnerability in the software running inside the environment." Once the attacker used the SGLang RCE to get code execution inside the inference server, they had the same vantage point as the legitimate service running there — including whatever requests that server processed on November 8, even ones sent in confidential mode that were never supposed to be visible to anyone, NEAR AI included. The company hasn't confirmed what, if anything, the attacker actually read from those requests — only that it "could have been observed."

Having landed inside one server, the attacker didn't stop there. They moved laterally into other internal systems, reaching the backend behind the already-deprecated but not-yet-decommissioned Private Chat product and pulling account data for roughly 100 users. Separately, they reached 18 agents running on a legacy deployment outside TEE protection, taking their chat history, settings, and logs. Two customers' API keys leaked along the way because they'd been written to logs. The Cloud Security Alliance's analysis flags what that lateral reach implies: "the pattern suggests the confidential workload held credentials or network paths that reached beyond its own confidential VM" — meaning the problem wasn't just that SGLang had a bug, but that a server handling sensitive inference workloads shouldn't have had a path to an unrelated internal system like the old Private Chat backend in the first place.

NEAR AI hasn't disclosed a CVE, and no reporting has tied the breach to a specific known flaw. The context is worth noting, though: CERT/CC's VU#281278, published 2026-07-30, disclosed six SGLang vulnerabilities at once, including an unauthenticated RCE via pickle deserialization on the `/load_lora_adapter_from_tensors` endpoint (CVE-2026-15969) and an API-key leak through `/server_info` (CVE-2026-15977). CERT/CC said coordination with the maintainers was unsuccessful, and as of November 16, public vulnerability trackers still showed no fix shipped for CVE-2026-15969. This maps to **LLM05: Supply Chain Vulnerabilities** on the OWASP LLM Top 10 — the root cause is an open-source inference dependency carrying known, unpatched vulnerability classes — and it also touches **LLM06: Sensitive Information Disclosure**, since the layer that was breached is exactly the one meant to isolate confidential request content.

```diagram
title: How the SGLang RCE let an attacker into NEAR AI's confidential inference environment
desc: On 2026-11-08, an attacker exploited an RCE flaw in SGLang to get code execution on an inference server running inside a confidential-computing environment. Because confidentiality hardware can't protect against a vulnerability in the software running inside it, the attacker could potentially see that day's requests, and moved laterally to pull user account data and legacy agent data.
caption: Compiled from NEAR AI's official incident report and the Cloud Security Alliance's research note.
step: 2026-11-08 — attacker exploits an RCE flaw in SGLang
step: Gets code execution on one inference server
step: TEE can't stop a flaw in the software running inside it — that day's confidential-mode requests were potentially exposed
step: Moves laterally into the deprecated Private Chat backend
step: Reads account data for ~100 users, plus data from 18 legacy agents outside the TEE
step: 2 customers' API keys leak via logs
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="240" y="32" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">Exploits an RCE in SGLang</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">Open-source inference engine</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="240" y="132" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">Executes code on one server</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">Server runs inside the TEE</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="200" y="232" width="400" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">TEE can't block a flaw inside it</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">Confidential requests exposed that day</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="220" y="332" width="360" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">Moves laterally into other systems</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">Reaches old Private Chat backend</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="210" y="432" width="380" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">Reads ~100 users' + 18 agents' data</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">Chat history, settings, logs</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="210" y="532" width="380" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">2 customers' API keys leak via logs</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">Both revoked</text>
  </g>
</svg>
```

## Defense Strategies

**Immediate Actions**
- Teams self-hosting SGLang should inventory every deployment and confirm its HTTP/IPC interfaces aren't reachable from untrusted networks. Following CERT/CC's guidance, set `SGLANG_USE_PICKLE_IPC` to `false`, configure both a user API key and an admin API key, and block or disable `/server_info` at the proxy layer to stop key leakage through it
- NEAR AI Cloud customers should check whether they received an official notification; those who did should assume their account or agent data was accessed and follow the provided steps. Those who didn't need do nothing further
- Regardless of notification status, check your own logs for any API key you've ever sent to NEAR AI — or any inference provider — and rotate it if found
- Re-examine which workloads actually run inside TEE protection when using any service marketed as "confidential inference." The 18 exposed agents here were specifically the ones running on a legacy deployment outside the TEE, and users don't always know which category their own workload falls into

**Long-Term Architecture**
- Treat the inference engine itself (SGLang, vLLM, and similar) as part of the trusted computing base to be audited, not just "is the model safe." Several of the CERT/CC-flagged flaws sit in features that deserialize external input, like dynamic LoRA adapter loading and weight updates
- Confidential-computing nodes should run with least privilege: the credentials they hold and the internal systems they can reach should be scoped to their own job. A compromised inference server shouldn't be able to reach an unrelated system like a deprecated Private Chat backend
- Audit logging pipelines to make sure API keys, prompts, and completions never get written to logs — that's exactly how the two customer keys leaked here
- When procuring or renewing a confidential-computing or confidential-inference service, evaluate the vendor's patch cadence, TCB-version transparency, and incident-disclosure practices, not just whether "TEE" appears on the feature list. For auditing ML supply chains — including self-hosted or outsourced inference stacks — tools like Protect AI that cover ML package and inference-stack scanning are worth considering

## Impact

NEAR AI's response after detection was fast: it revoked all active sessions and administrative credentials, replaced every agent token, took Private Chat fully offline, deployed an SGLang fix across all inference servers, finished rotating remaining credentials, completed a full forensic review, and reported the flaw to the SGLang project. NEAR AI Cloud service has been restored, and the roughly 100 affected users and the owners of the 18 agents have each been notified individually. But two questions remain unanswered: which SGLang vulnerability the attacker actually used — NEAR AI hasn't said, and SGLang itself has accumulated more than one unpatched flaw this year — and whether that server's confidential-mode requests were actually read on the day in question. NEAR AI's own wording is that they "could have been observed," not that they were confirmed unread. If your system relies on any inference service marketed as confidential, this incident is a reason to actively ask the vendor how current their inference engine's patches are and how fast they ship fixes, rather than assuming a "confidential computing" label guarantees your data is absolutely safe.

## Today's Takeaway

I had a gap in how I understood "confidential computing": I assumed that running inside a TEE meant data was invisible even to the provider itself, as a hardware-level guarantee. This incident makes the boundary explicit — a TEE only protects against the "outside" (the host, the operator, the cloud operator), not the "inside" (whether the software running in that isolated environment has its own bugs). For agent systems, that means the inference engines and SDKs you build agents on top of don't get a pass on security just because they're wrapped in a confidential-computing label or a TEE — if anything, the excess trust people place in that label means a bug inside it can go unnoticed longer than it would in a system with no TEE at all.

## References

- [Security Incident Report: SGLang Vulnerability — NEAR AI official blog](https://near.ai/blog/security-incident-report-sglang-vulnerability)
- [SGLang RCE Exploit Breaches NEAR AI, Steals Data From 18 Agents and About 100 Users — The Hacker News](https://thehackernews.com/2026/11/sglang-rce-exploit-breaches-near-ai.html)
- [Confidential AI Under Pressure: SGLang RCE and SEV-SNP Attacks — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-confidential-ai-inference-tee-limits-20261/)
- [VU#281278: SGLang Contains Six Different Vulnerabilities Including RCE, Data Exfiltration, and Credential Disclosure — CERT/CC](https://kb.cert.org/vuls/id/281278)
- [NEAR AI says SGLang vulnerability exposed user account details in security breach — The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002)
- [AI Infrastructure Keeps Getting Attacked — NEAR AI's SGLang Breach Is Just the Latest Warning — Security Boulevard](https://securityboulevard.com/2026/11/ai-infrastructure-keeps-getting-attacked-near-ais-sglang-breach-is-just-the-latest-warning/)
