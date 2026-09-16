---
title: "Security Alert | BragJack: One Browser Extension Hijacks the Built-In AI Agents in Chrome, Comet, Edge, Opera Neon, and Claude in Chrome"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation, data-exfiltration]
lang: en
description: "Security firm Forever Security used a single technique — and a browser extension needing only two common permissions — to hijack the built-in AI agents in Chrome, Comet, Edge, Opera Neon, and Claude in Chrome. Two of the five findings now carry CVEs."
tldr: "Forever Security researcher Gal Weizman found that a browser's built-in AI agent has a 'brain' (the cloud AI) and a 'body' (the browser itself, which can see the screen, read files, and use the camera) that trust instructions from exactly one origin. Browser extensions can't run code on that origin directly, but two permissions nearly every extension already has — content scripts and declarativeNetRequest — are enough to hijack that trusted channel and impersonate the brain. This isn't prompt injection; it's what the researcher calls 'Prompt-Forcing': crafting and sending the entire instruction stream directly. Chrome (CVE-2026-0628, CVSS 8.8) and Edge (CVE-2026-55945, CVSS 4.2) are patched; Comet, Opera Neon, and Claude in Chrome received bounties but no public patch timeline. Defense means treating extensions as high-risk assets and adding runtime monitoring of what agents actually do, since no code here is malicious."
series:
  name: "AI Security Alert"
  order: 30
---

> 🌏 [中文版](/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack)

## Incident Overview

On September 16, 2026, security researcher Gal Weizman of Forever Security published research codenamed **BragJack**, demonstrating that a single technique — carried out through a browser extension requiring only two extremely common permissions — could hijack the built-in AI agents of five products: Gemini Live in Google Chrome, Perplexity's AI browser Comet, Microsoft Edge, Opera's Opera Neon, and the Claude in Chrome extension. Every attack required zero clicks from the victim; the only precondition was that the malicious extension was already installed. The research has earned roughly $20,000 in combined bug bounties from Google, Microsoft, Perplexity, Opera, and Anthropic. The Chrome and Edge findings each received a CVE and have been patched; the Comet, Opera Neon, and Claude in Chrome findings have no CVE and rest on Forever Security's own technical account, though each vendor confirmed the finding and paid a reward. No evidence currently suggests any of the five methods has been used in a real-world attack.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Browser extension hijacking a built-in AI agent (Privilege Escalation / Confused Deputy) |
| Scope | Google Chrome (Gemini Live), Perplexity Comet, Microsoft Edge, Opera Neon, Claude in Chrome extension |
| Severity | High (Chrome, CVSS 8.8) / Medium (Edge, CVSS 4.2; Comet, Opera Neon, and Claude in Chrome have no official score — Anthropic internally rated its finding Medium) |
| CVE | CVE-2026-0628 (Chrome, patched in 143.0.7499.192), CVE-2026-55945 (Edge, patched in 150.0.4078.48); no CVE for Comet, Opera Neon, or Claude in Chrome |
| Sources | [Forever Security's original research](https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants), [The Hacker News](https://thehackernews.com/2026/09/one-extension-could-hijack-ai.html), [Dark Reading](https://www.darkreading.com/endpoint-security/bragjack-browser-agentic-ai) |

## Attack Surface Analysis

All five products share nearly the same architecture: a "body" inside the browser that can take screenshots, read files, and control the camera and microphone, and a "brain" — the actual AI model — running on the vendor's servers. The body only accepts instructions from a single trusted origin, such as gemini.google.com, opera.com, or copilot.microsoft.com. Weizman found that while browser extensions are explicitly barred from controlling the browser directly, nearly every extension still holds two permissions that go almost entirely unguarded: content scripts (which any ad blocker needs) and declarativeNetRequest (which lets an extension rewrite the browser's outbound network requests). Combining the two lets an extension impersonate the trusted origin and send instructions straight to the brain, which then translates them into actions the body carries out on the victim's machine — breaking the foundational assumption that an extension can modify a page but never control the browser itself.

Each product failed in a different way. Chrome blocked extensions from injecting scripts into the Gemini page but forgot to block network-request rewriting, letting the attacker swap in their own JavaScript. Opera Neon didn't restrict extensions on opera.com at all. Microsoft Edge created a special permission that let only its marketing page send prompts to the brain, and split the agent into mutually exclusive "Think" and "Do" modes as a safeguard — but a race condition, triggered by feeding it a prompt and switching it to "Do" mode at the exact right moment, defeated that safeguard. Claude in Chrome fell to the same underprotected marketing-page permission pattern as Edge. Comet had the tightest defenses of the five — it blocked extensions from running on perplexity.ai entirely — but a leftover, unlocked test domain, testing.perplexity.com, let the attacker strip a redirect header and load that domain to send commands directly to the browser-wide agent. Forever Security calls Comet the worst case: it let the attacker read arbitrary local files, see the user's full browsing history, and act as the user.

The researchers stress this is **not prompt injection** — nothing was appended to an existing instruction. Instead, the attacker wrote and sent the entire instruction, then kept issuing follow-ups, a technique the researchers call "Prompt-Forcing." The distinction matters: traditional EDR tools detect malicious code, but nothing here is malicious code. A trusted, legitimate component (the extension) does exactly what it's permitted to do (rewrite pages and requests), which drives another trusted, legitimate component (the AI agent) to perform an ordinary but abused task, like "summarize my email and send it to me." Mapped to the OWASP LLM Top 10, this is closest to **LLM06 Excessive Agency** — once an agent's instruction channel is hijacked, it acts on the user's behalf without limit — combined with the classic security concept of a **confused deputy**, where the browser's sole criterion for trusting an instruction (which origin it came from) turns out to be spoofable.

## Defense

Forever Security's own conclusion is blunt: **once software starts embedding AI, its attack surface becomes hard to predict**, because traditional security tooling is built to catch malicious code — and this class of attack has none.

**Immediate actions**
- Inventory every endpoint running a browser's built-in AI agent (Chrome's Gemini, Edge Copilot, Comet, Opera Neon, Claude in Chrome), and confirm Chrome is updated to 143.0.7499.192+ and Edge to 150.0.4078.48+ to pick up the two patched CVEs.
- Audit installed browser extensions for any that request both content-script access and declarativeNetRequest — the minimum permission set BragJack-style attacks require.
- For Comet, Opera Neon, and Claude in Chrome, where no patch timeline has been published, assume the risk is live and restrict these tools' access to sensitive data environments (finance, HR systems) in the meantime.

**Long-term architecture**
- Govern browser extensions as high-privilege third-party software rather than default-trusted utilities; consider an extension allowlist restricted to security-reviewed extensions.
- Traditional EDR cannot detect "a legitimate component executing a legitimate but abused instruction." Watchlist B7 vendors such as Lakera and Invariant Labs build runtime guardrails in a similar direction — worth evaluating for coverage of browser-agent scenarios specifically.
- Treat any AI agent capable of acting on a user's behalf (especially fully agentic browsers like Comet) as a privileged identity requiring least-privilege scoping and behavioral auditing, rather than trusting a single origin — a criterion this research shows can be bypassed.

## Impact

As of September 16, 2026, neither CVE (Chrome, Edge) appears on the U.S. CISA Known Exploited Vulnerabilities (KEV) catalog, and neither Forever Security nor the affected vendors report evidence that any of the five methods has been used in a real attack — this is a responsible disclosure, not an ongoing incident. But because the trigger condition is simply "the victim already has the malicious extension installed," the bar is far lower than most browser-level vulnerabilities; anyone relying on the extension ecosystem (ad blockers, coupon extensions, etc.) while also using one of these five AI agent products falls within the potential exposure. The Comet, Opera Neon, and Claude in Chrome findings currently rest solely on Forever Security's technical account — vendors confirmed and paid for them but haven't published exact patched versions or timelines, so it's worth watching for further announcements from all three.

For teams evaluating or already deploying browser-native AI agents, the takeaway isn't just "install the right extensions." It's that once any software component is granted the ability to operate an entire machine, deciding whether to trust an instruction based solely on "which origin it came from" will always be bypassable.

## Today's Takeaway

Past coverage of browser extension risk mostly focused on extensions that ship malicious code and steal data directly. BragJack points to a different path: the extension does nothing malicious at all. It simply uses two ordinary permissions — rewriting pages, rewriting network requests — to hijack the single-origin trust channel that was supposed to connect the browser to its built-in AI agent, turning a completely legitimate agent into the attacker's proxy. That's also why the researchers went out of their way to distinguish this from prompt injection: the defense isn't "filter out malicious prompts," it's "verify this instruction actually came from where it claims to, and ask whether what the agent is doing right now makes sense in context."

## References

- [Forever Security — BragJack: How We Hijacked 5 Of The World's Most Popular Browsers Using Their Built-In AI Assistants (2026-09-16)](https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants)
- [The Hacker News — One Extension Could Hijack AI Assistants Across Chrome, Comet, Edge, Opera Neon and Claude (2026-09-16)](https://thehackernews.com/2026/09/one-extension-could-hijack-ai.html)
- [Dark Reading — BragJack Attack Can Turn a Browser's Agentic AI Against It](https://www.darkreading.com/endpoint-security/bragjack-browser-agentic-ai)
- [NVD — CVE-2026-0628 (Chrome / GlicJack, CVSS 8.8)](https://nvd.nist.gov/vuln/detail/CVE-2026-0628)
- [NVD — CVE-2026-55945 (Microsoft Edge, CVSS 4.2)](https://nvd.nist.gov/vuln/detail/CVE-2026-55945)
- [OffSeq Threat Radar — BragJack: $20K in bounty rewards from Anthropic, Perplexity, Google, Microsoft and Opera](https://radar.offseq.com/threat/bragjack-20k-in-bounty-rewards-from-anthropic-perplexity-google-microsoft-and-opera-81ed18b31bb595b4)
