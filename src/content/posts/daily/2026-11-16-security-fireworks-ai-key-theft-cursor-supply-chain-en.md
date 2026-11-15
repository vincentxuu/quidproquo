---
title: "Security Alert: Cursor Reveals a Stolen Fireworks AI Key Caused the Extension Backdoor"
date: 2026-11-16
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "After a two-week investigation, Cursor says attackers used a leaked Fireworks AI access key to pivot into its internal SaaS tools and steal credentials, which let them plant the trojanized Claude Code extension. The same Fireworks breach also hit Uber and Notion."
tldr: "Cursor has named the root cause of the October 29 Claude Code extension backdoor: attackers used an access key leaked from Fireworks AI to read a shared data bucket, found unredacted credentials inside, and pivoted into Cursor's internal SaaS tools to tamper with the extension. The same Fireworks key leak also led to Uber driver's license exposure and Notion AI chat log exposure."
series:
  name: "AI Security Alert"
  order: 79
---

> 🌏 [中文版](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain)

## What happened

We previously covered the [trojanized Claude Code extension on Cursor Marketplace](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor), which left one question unanswered: how did attackers get publishing access to tamper with a package under a legitimate extension ID? On November 13, Cursor published a two-week investigation that answers it. The attacker first obtained an access key Cursor had issued to its inference vendor, Fireworks AI. That key leaked in a separate Fireworks security incident. The attacker used it to read a storage bucket shared between the two companies, found unredacted credentials inside, and pivoted from there into Cursor's internal SaaS tools — the access that eventually let them plant the tampered extension in the Marketplace cache. The same Fireworks AI breach also produced two unrelated fallout incidents: driver's license data exposed at Uber, and AI chat transcripts exposed at Notion.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | Supply chain attack (leaked third-party inference vendor key, used to pivot into SaaS tools and a package distribution channel) |
| Scope | Cursor's internal systems and a small number of customer records; users who installed or updated to `anthropic.claude-code` 2.1.312/2.1.313 via Cursor Marketplace on October 29, 2026; separately, Fireworks AI customers including Uber and Notion |
| Severity | High (source code repositories, customer support data, and credentials were exposed, and it cascaded into a supply chain attack) |
| CVE | None |
| Sources | [The Hacker News](https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html), [Cursor's official update](https://cursor.com/blog/security-incident-update), [Fireworks AI security bulletins](https://fireworks.ai/security/bulletins), [Beam attack tracker](https://agentbeam.com/blog/cursor-fireworks-security-incident-agent-traces-november-2026) |

## Attack surface analysis

The chain didn't start at Cursor — it started at Cursor's inference vendor, Fireworks AI. On October 23, 2026, a third-party cloud provider that hosted Fireworks' R&D machines was breached. The next day, the attacker used that foothold to reach Fireworks' own development machines and run unauthorized workloads. Fireworks widened its disclosure on November 9, admitting that beyond the secrets used in evaluation jobs, some customers' billing data, datasets, and incomplete model weights were also accessed. Cursor was one of the affected customers: an access key Cursor had issued to Fireworks was exposed in that breach, and the attacker used it to read a read-only bucket the two companies shared. That bucket held 2025 coding agent traces from sessions outside Privacy Mode — traces users had already agreed could be used for training. The problem was that a small number of those traces still contained unredacted credentials, exposing API keys for less than 0.01% of customers.

From those leaked credentials, the attacker pivoted laterally: first into several SaaS tools Cursor uses internally, then from those tools into archived non-production source code repositories (some containing business contact information), customer support emails, product usage data, and credentials users had previously sent to Cursor's support team. On October 29, using yet another credential exposed from Cursor's internal systems, the attacker placed a tampered copy of Anthropic's Claude Code extension directly into the cache serving the Cursor VS Code Marketplace. Up to 5,000 users potentially received it over roughly 11 hours — the incident we reported earlier. The same Fireworks breach spun off two separate threads at the same time: TechCrunch confirmed that the unnamed "service provider" behind Uber's breach disclosure was Fireworks, exposing driver's license data for thousands of drivers. And Notion discovered that despite a contractual zero-data-retention commitment, Fireworks had still been retaining copies of Notion AI chat transcripts.

```diagram
title: How a Fireworks AI key leak led to the extension backdoor, Uber, and Notion
desc: A breach at a third-party cloud provider spread to Fireworks' development machines, leaking unredacted credentials from a bucket Cursor and Fireworks shared. The attacker used that to pivot into Cursor's internal SaaS tools and plant a tampered extension; the same Fireworks breach separately hit Uber and Notion.
caption: Based on official disclosures from Cursor and Fireworks AI, and reporting from The Hacker News and i10x.ai.
step: Attacker breaches the third-party cloud provider Cursor's vendor relies on for R&D
step: Uses that foothold to reach Fireworks' development machines
step: Steals the access key to a bucket Cursor and Fireworks share, leaking unredacted credentials inside it
step: Uses the leaked credentials to pivot into Cursor's internal SaaS tools, reaching source code, support data, and user credentials
step: Uses the stolen credentials to plant a tampered Claude Code extension in the Cursor Marketplace cache
step: The same Fireworks breach separately exposes Uber driver's license data and Notion AI chat transcripts
---
<svg viewBox="0 0 760 536">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V220H168Q160 220 160 228V248" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 188V248" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line" d="M400 188V220H632Q640 220 640 228V248" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line" d="M160 308V348" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M160 408V448" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="300" y="32" width="200" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">3rd-party cloud vendor</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">attacker's entry point</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="288" y="132" width="224" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">Fireworks dev machines</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">R&D environment accessed</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="44" y="252" width="232" height="56" rx="6"/>
    <text class="dg-label" x="160" y="271" text-anchor="middle" dominant-baseline="central">Cursor shared bucket</text>
    <text class="dg-sub" x="160" y="291" text-anchor="middle" dominant-baseline="central">unredacted credentials leaked</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="316" y="252" width="168" height="56" rx="6"/>
    <text class="dg-label" x="400" y="271" text-anchor="middle" dominant-baseline="central">Uber</text>
    <text class="dg-sub" x="400" y="291" text-anchor="middle" dominant-baseline="central">driver's license data exposed</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="548" y="252" width="184" height="56" rx="6"/>
    <text class="dg-label" x="640" y="271" text-anchor="middle" dominant-baseline="central">Notion</text>
    <text class="dg-sub" x="640" y="291" text-anchor="middle" dominant-baseline="central">AI chat logs exposed</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="28" y="352" width="264" height="56" rx="6"/>
    <text class="dg-label" x="160" y="371" text-anchor="middle" dominant-baseline="central">Cursor SaaS tool chain</text>
    <text class="dg-sub" x="160" y="391" text-anchor="middle" dominant-baseline="central">source / support data / credentials</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="28" y="452" width="264" height="56" rx="6"/>
    <text class="dg-label" x="160" y="471" text-anchor="middle" dominant-baseline="central">Tampered extension</text>
    <text class="dg-sub" x="160" y="491" text-anchor="middle" dominant-baseline="central">published as 2.1.312/313 in cache</text>
  </g>
</svg>
```

This chain maps to two categories in the OWASP LLM Top 10: **LLM06 Sensitive Information Disclosure** (unredacted credentials survived inside data that users had consented to use for training), and **LLM05 Supply Chain Vulnerabilities** (the leaked credentials became the pivot that turned into an attack on the package distribution channel). The root cause wasn't a weakness in the model or the prompt, and it wasn't a flaw in Cursor's or Anthropic's code — Cursor's post specifically clarifies that this wasn't a vulnerability in Anthropic's product. The real gap sat behind the "okay to use for training" consent checkbox: nothing automatically checked whether that data still contained secrets. Once a downstream vendor (Fireworks) got breached, data meant only for offline training became the attacker's foothold into production systems.

## Defensive measures

**Immediate actions**
- If your team installed or updated to `anthropic.claude-code` 2.1.312 or 2.1.313 via Cursor Marketplace on October 29, 2026, run Cursor's official cleanup script (covered in our previous post) to check for leftover SSH keys or persistence mechanisms — removing the extension alone isn't enough
- If your team is a direct Fireworks AI customer, inventory every bucket and API key you've shared with Fireworks, rotate all of them, and check whether historical data accidentally carried credentials
- If your team uses Notion AI or any SaaS backed by Fireworks inference, check "Security incident review" in the vendor's notice and rotate any password or key you ever pasted in

**Long-term architecture**
- Automatically redact credentials and secrets from any log or trace shared with a third-party training or inference vendor before export — don't rely on a "user consented to training" checkbox to vet the content itself
- Replace long-lived third-party vendor access keys with least-privilege, short-lived credentials, so a leaked key expires faster than an attacker needs to pivot
- Adopt ML supply chain scanning that covers datasets and model weights, not just packages and models — tools like Protect AI extend the audit surface to training and evaluation data leakage, which mattered here since Fireworks exposed datasets and incomplete model weights too
- Segment internal SaaS tool chains so a single leaked vendor key can't chain across source repositories, customer support inboxes, and the package publishing cache

## Impact

Cursor says up to 5,000 users potentially installed or updated to the malicious build during the roughly 11-hour exposure window, and it has contacted each one directly. Separately, fewer than 0.05% of users had coding agent traces exposed (an earlier estimate put API-credential exposure below 0.01% of users). Cursor says the last attacker activity it observed was on November 1, and that attempt was blocked. The upstream Fireworks AI incident reaches further: the third-party cloud provider breach on October 23 spread to Fireworks' R&D machines the next day, exposing billing information for all customers and, for a limited set, secrets, datasets, and incomplete model weights. Notion says fewer than 1% of its workspaces may be affected and disconnected from Fireworks on November 3. Uber disclosed that credentials stolen from an unnamed "service provider" — confirmed by TechCrunch to be Fireworks — exposed driver's license data for thousands of drivers, and has filed a notice with the California Attorney General's office.

If your organization is a Cursor user, a direct Fireworks AI customer, or an indirect Fireworks customer through something like Notion AI, you fall inside the scope of this incident. Check all three disclosures separately — reading just one isn't enough to know you're clear.

## Takeaway

Our previous post on this incident ended with an unanswered question: how did the attacker get publishing access to tamper with a package under a legitimate ID? Cursor's disclosure answers it, and the answer isn't "the Marketplace itself was breached" — it's "unredacted credentials survived inside historical data shared with a training vendor." That's a reminder that the weakest link in a supply chain is often not the most visible one — package signing, release pipelines, CI/CD permissions — but what sits behind a quieter checkbox: "this data is okay to use for training." Someone has to actually verify what's inside that data, not just who agreed to share it.

## References

- [Cursor Says Stolen Fireworks AI Key Led to Trojanized Claude Code Extension Incident — The Hacker News](https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html)
- [An update on our recent security incident — Cursor](https://cursor.com/blog/security-incident-update)
- [Security bulletins — Fireworks AI](https://fireworks.ai/security/bulletins)
- [Fireworks AI breach exposed customer datasets and Notion AI chats — i10x.ai](https://i10x.ai/news/fireworks-ai-breach-exposed-customer-datasets-notion-ai-chats)
- [Cursor: Fireworks-exposed key led to trace theft and a tampered Claude Code extension — Beam attack tracker](https://agentbeam.com/blog/cursor-fireworks-security-incident-agent-traces-november-2026)
- [Official Claude Code Extension on Cursor Marketplace Trojanized with Persistent SSH Backdoor (our previous coverage)](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor-en)
