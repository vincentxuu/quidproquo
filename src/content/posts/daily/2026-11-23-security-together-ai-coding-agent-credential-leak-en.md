---
title: "Security Alert | Together AI's Coding Agent Committed a Leaked Credential, Letting an Intruder Download Real User Prompts and Test Other Keys"
date: 2026-11-23
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "Together AI disclosed that an AI coding agent committed a credential while developing a public repo, letting an unauthorized party download a private Hugging Face repo full of real user prompt samples and search them for other services' credentials."
tldr: "On 2026-11-21, Together AI CEO Vipul Ved Prakash disclosed that an AI coding agent working on the public GitHub repo 'xorl' committed a credential that granted access to a private Hugging Face repo holding real user prompt samples from MiniMax M3, GLM-5.2, and Kimi K2.6. Automated scanning reverted the commit, but an unauthorized party had already used the credential during the exposure window to download the samples and test other credentials found inside them, including 5 Dragos canary credentials. Together AI has added PR-level credential checks and made zero data retention the default; the root cause was that the agent's commit was never treated as an action needing extra review."
series:
  name: "AI Security Alert"
  order: 85
---

> :globe: [中文版](/posts/daily/2026-11-23-security-together-ai-coding-agent-credential-leak)

## Incident Overview

On 2026-11-21, Together AI CEO Vipul Ved Prakash disclosed that an AI coding agent working on the public GitHub repo `xorl` committed a credential for a private Hugging Face repo alongside its code changes. That private repo held prompt samples kept for routine software testing, drawn from real user requests to MiniMax M3, GLM-5.2, and Kimi K2.6 on June 24, July 4, July 8, and July 14, 2026. Together AI's automated scanning caught the exposed credential and reverted the commit, but during the window it was publicly exposed, an unauthorized party had already used it to download the stored samples and search their contents for other services' credentials — testing each one, with 5 identified as canary credentials planted by the security firm Dragos (decoy credentials used to detect unauthorized access). Together AI has engaged an external forensics firm and law enforcement; the review is ongoing, and it has not yet confirmed whether sensitive customer data was exposed.

**Key Facts**

| Field | Value |
|---|---|
| Incident Type | AI coding agent credential leak → data download → credential harvesting (Data Exfiltration) |
| Scope | Prompt samples from MiniMax M3, GLM-5.2, and Kimi K2.6 on four specific days in June–July 2026 on the Together AI platform; the exact number of affected customers is undisclosed |
| Severity | High |
| CVE | None (a process/permissions design gap, not a single software flaw) |
| Sources | [Together AI's official disclosure](https://together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026?latest=20261122), [Futurum Group](https://futurumgroup.com/insights/together-ais-agent-credential-leak-exposes-agentic-pipeline-risk), [VectorWire](https://vectorwire.ai/article/together-ai-s-own-coding-agent-becomes-the-supply-chain-threat-3aaef5) |

## Attack Surface Analysis

The attack path itself was unremarkable: while working on the public repo `xorl`, an AI coding agent wrote a credential that should have stayed secret directly into a commit. That credential granted access to a separate private Hugging Face repo holding real user prompt samples retained for routine testing. Once the commit went public, automated scanning caught the exposed credential and reverted it — but there was a gap between "detected" and "revoked." An unauthorized party had already used the credential to download the private repo's contents, then searched the sample text for strings that looked like credentials and tested each one for validity. Five turned out to be canary credentials planted by Dragos.

```diagram
title: How one coding-agent commit turned into a customer data leak
desc: Together AI's AI coding agent accidentally committed a credential while developing a public repo. Automated scanning reverted it in time, but an unauthorized party had already downloaded real user prompt samples from a private repo during the exposure window and searched them for other services' credentials.
caption: Based on Together AI's official disclosure and Futurum Group's analysis.
step: AI agent commits a leaked credential while developing the public repo "xorl"
step: Automated scanning detects the exposure; the commit is reverted
step: But within the exposure window, an unauthorized party already used the credential to download a private HF repo
step: That repo held real user prompt samples from June–July 2026
step: The intruder searched the samples for other credentials and tested them, including 5 Dragos canary credentials
step: 11/21 — official disclosure and remediation rollout
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="200" y="32" width="400" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">Agent commits a leaked credential</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">while developing public repo "xorl"</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="200" y="132" width="400" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">Scanning detects it, commit reverted</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">but the exposure window was already used</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="232" width="480" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">Intruder downloads the private HF repo</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">repo held prompt samples kept for testing</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="140" y="332" width="520" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">Samples held real requests from June–July 2026</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">MiniMax M3, GLM-5.2, Kimi K2.6</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="120" y="432" width="560" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">Intruder searches the samples and tests other credentials</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">5 of them were Dragos canary credentials</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="220" y="532" width="360" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">11/21 — disclosure and remediation</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">PR-level credential checks, default ZDR</text>
  </g>
</svg>
```

The root cause is what deserves attention. Together AI's own analysis frames the commit as an authorization decision that should have been flagged — a human developer submitting the same content would likely have been stopped by code review, but the agent's output wasn't treated as a high-risk action warranting extra review. Retaining real user prompt samples long-term in a test repo also widened the blast radius: a single credential leak turned into a potential second-order leak, since the samples themselves could contain other credentials or sensitive content.

Mapped to the OWASP LLM Top 10: the root cause is **LLM06 Excessive Agency** — the agent held commit privileges equivalent to a human developer's without a matching review gate. A variant of **LLM02 Insecure Output Handling** also applies: the agent's code changes were trusted and published directly, with no distinction drawn between agent output and human output.

## Defense Recommendations

**Immediate actions**
- Inventory every repo where an AI coding agent has commit/push access, and confirm automated credential scanning runs at the pull-request level — one of Together AI's own fixes was moving credential checks into every PR instead of relying only on post-merge background scans
- Review any repo or storage that retains real user prompts or request content for testing or debugging, and assess whether long-term retention is actually necessary; if it's kept, treat it as sensitive data under the same access controls as production data
- If your team also uses the affected models (MiniMax M3, GLM-5.2, Kimi K2.6) on Together AI, enable zero data retention (ZDR) and check whether you've received an individual notice from Together AI

**Long-term architecture**
- Treat AI agents as distinct identities with least-privilege, short-lived credentials — an agent shouldn't hold the same broad, long-lived credentials as a human developer; prefer keyless access that rotates automatically and avoids storing long-lived secrets at all
- Before an agent's code changes reach CI/CD, add a "high-risk action" check — adding a credential, changing access control settings, publishing externally — that forces human approval instead of following the same auto-merge path as routine changes
- For systematic governance over what actions AI agents can take and where approval gates sit, consider watchlist vendor Zenity, which focuses on agent action governance and high-risk approval workflows; for scanning and auditing credentials and sensitive data embedded in ML development pipelines, consider Protect AI's ML supply-chain scanning

## Impact

Together AI hasn't disclosed exactly how many customers' prompt samples fall within the exposure scope — its official line is that review is ongoing, and affected customers will be contacted directly if sensitive data is confirmed. What is confirmed: the intruder actually downloaded the samples and tested credentials found inside them, including the 5 Dragos canary credentials — this wasn't a theoretical risk but an incident where someone actively attempted to use leaked data to pivot toward other systems. The official investigation also hasn't ruled out whether other undiscovered credentials remain in the samples. Together AI's disclosed timeline itself has gaps: the exact commit date and the length of the exposure window were never stated, and all that's known is that the sample data (from 6/24, 7/4, 7/8, 7/14) predates the 11/21 disclosure by more than four months. If your team also gives AI coding agents write access to your repos, the lesson here isn't that agents are unsafe — it's that treating an agent's output with the same default trust as a human's is itself the risk.

## Today's Takeaway

This incident has no flashy exploit chain or CVE, yet it's more worth worrying about than many technical vulnerabilities — it happened at a mature team that is itself an AI infrastructure provider, and the root cause was just an ordinary commit that nobody looked at twice. It's a reminder that giving an agent the same operating permissions as a human developer implicitly assumes the agent also carries the same judgment and risk awareness — but code review exists precisely because humans make this kind of mistake too, and we tend to remember why a gate existed only after we've already removed it.

## References

- [Security event: Prompt leakage for requests in June and July of 2026 — Together AI official blog](https://together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026?latest=20261122)
- [Together AI's Agent Credential Leak Exposes Agentic Pipeline Risk — Futurum Group](https://futurumgroup.com/insights/together-ais-agent-credential-leak-exposes-agentic-pipeline-risk)
- [Together AI Coding Agent Exposes Prompt Data in Supply-Chain Leak — VectorWire](https://vectorwire.ai/article/together-ai-s-own-coding-agent-becomes-the-supply-chain-threat-3aaef5)
