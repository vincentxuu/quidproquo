---
title: "Security Alert | Storm-0940 Weaponizes Agentic AI Tool ARTEX to Hit the ConnectWise Supply Chain at Machine Speed — 2,250+ Tenants Targeted"
date: 2026-10-24
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "China state-aligned actor Storm-0940 used the open-source agentic AI pentesting framework ARTEX to automate attacks against hundreds of organizations worldwide since September 2026, using it to accelerate a breach of the ConnectWise Cloud Backup application and sign in to 2,250+ tenants at machine speed — some reaching privileged cloud access in under three hours."
tldr: "Microsoft disclosed on 2026-10-21 that China state-aligned actor Storm-0940 used ARTEX — an open-source agentic AI pentesting framework (made closed-source after the South Korean bank incident, but already leaked and reused by other attackers) — to automate attacks against hundreds of organizations across defense, energy, finance and other sectors since September. Between Oct 10-14 it password-sprayed 327 accounts at 8 organizations, generating 151,000+ failed logons; from Oct 15 it used stolen credentials for ConnectWise's multi-tenant Cloud Backup app to sign in to 2,250+ tenants at up to 2,900 attempts/minute, with some organizations reaching privileged cloud access in under 3 hours and modifying identities and roles for persistence. Wiz's Oct 23 update found the campaign expanding to other software vendors. Defense: audit and rotate any credentials ever authorized for ConnectWise apps, review Entra service-principal sign-ins and directory-change logs, and apply least privilege to multi-tenant apps."
series:
  name: "AI Security Alert"
  order: 62
---

> 🌏 [中文版](/posts/daily/2026-10-24-security-storm-0940-artex-connectwise-supply-chain)

## What happened

On October 21, 2026, Microsoft published an analysis attributing the recent supply-chain compromise of the ConnectWise Cloud Backup application to **Storm-0940**, a China state-aligned threat actor active since 2021 (previously known for password-spray campaigns run through the Quad7/CovertNetwork-1658 botnet). The notable part of this incident isn't a new software vulnerability — it's that the attacker used an open-source agentic AI pentesting framework called **ARTEX** to compress an attack workflow that would normally require step-by-step human operation into "machine speed." Starting in September, Storm-0940 automated attacks against hundreds of organizations globally; by mid-October it was abusing the existing trust relationship of a multi-tenant ConnectWise application to attempt sign-ins against more than 2,250 tenants at nearly 3,000 attempts per minute, with some organizations going from initial targeting to privileged cloud access in under three hours.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | Weaponized agentic AI tool + supply-chain trust abuse (supply chain / privilege escalation) |
| Scope | Hundreds of organizations globally (aerospace/defense, energy, finance, government, semiconductors, and more); ConnectWise Cloud Backup's multi-tenant app affected 2,250+ tenants |
| Severity | Critical |
| CVE | None (abuse of existing OAuth trust and stolen application credentials, not a single software flaw) |
| Sources | [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/), [The Hacker News](https://thehackernews.com/2026/10/china-linked-hackers-use-artex-ai.html), [CyberScoop](https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/), [Wiz follow-up analysis](https://www.wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors) |

## Attack surface analysis

```diagram
title: Storm-0940 uses ARTEX to hit the ConnectWise supply chain at machine speed
desc: Storm-0940 used the agentic AI tool ARTEX to automate password spraying and obtain credentials for ConnectWise's multi-tenant app, then abused that app's existing trust to auto-sign in to 2,250+ tenants, reaching privileged cloud access in under 3 hours in some cases.
caption: Sequence reconstructed from Microsoft's Security Blog disclosure (2026-10-21).
step: Storm-0940 uses ARTEX to password-spray 327 accounts at 8 organizations, generating 151,000+ failed logons
step: ARTEX accelerates scanning, password spraying and OAuth app abuse, obtaining credentials for ConnectWise's multi-tenant app
step: Using that app's existing trust, it auto-signs in to 2,250+ tenants at machine speed, with some orgs reaching privileged access within 3 hours
---
<svg viewBox="0 0 760 320">
  <line class="dg-rule" x1="106" y1="76" x2="106" y2="260"/>
  <line class="dg-rule" x1="305" y1="76" x2="305" y2="260"/>
  <line class="dg-rule" x1="499" y1="76" x2="499" y2="260"/>
  <line class="dg-rule" x1="678" y1="76" x2="678" y2="260"/>

  <g data-step="1">
    <path class="dg-line" d="M106 132H301" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="206" y="120" text-anchor="middle" dominant-baseline="central">password spray</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M305 180H495" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="400" y="168" text-anchor="middle" dominant-baseline="central">stole app cred</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--accent" d="M499 228H674" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="588" y="216" text-anchor="middle" dominant-baseline="central">auto sign-ins</text>
  </g>

  <rect class="dg-box" x="16" y="20" width="180" height="56" rx="6"/>
  <text class="dg-label" x="106" y="40" text-anchor="middle" dominant-baseline="central">Storm-0940</text>
  <text class="dg-sub" x="106" y="60" text-anchor="middle" dominant-baseline="central">China state actor</text>

  <rect class="dg-box" x="210" y="20" width="190" height="56" rx="6"/>
  <text class="dg-label" x="305" y="40" text-anchor="middle" dominant-baseline="central">ARTEX agent</text>
  <text class="dg-sub" x="305" y="60" text-anchor="middle" dominant-baseline="central">automated spraying</text>

  <rect class="dg-box" x="414" y="20" width="170" height="56" rx="6"/>
  <text class="dg-label" x="499" y="40" text-anchor="middle" dominant-baseline="central">ConnectWise</text>
  <text class="dg-sub" x="499" y="60" text-anchor="middle" dominant-baseline="central">trust abused</text>

  <rect class="dg-box dg-box--accent" x="598" y="20" width="160" height="56" rx="6"/>
  <text class="dg-label" x="678" y="40" text-anchor="middle" dominant-baseline="central">2,250+ tenants</text>
  <text class="dg-sub" x="678" y="60" text-anchor="middle" dominant-baseline="central">access &lt;3hr</text>
</svg>
```

**Who is ARTEX, and where did it come from**: ARTEX is a multi-agent LLM pentesting framework written in Go with a Next.js frontend. It can plug in any AI model (this campaign and the earlier South Korean bank incident both observed it paired with DeepSeek, GLM, and Grok), can run an entire pentest from reconnaissance through data exfiltration autonomously, and its interface can be switched between English, Korean, Mandarin, Spanish, and Japanese. After the framework was exposed for its role in attacking South Korean financial institutions this October (see our Oct 8 article in this series), its author took it closed-source and stopped maintaining it — but the code had clearly already leaked. Microsoft Threat Intelligence states plainly that it has "identified threat actors across multiple geographic regions leveraging the ARTEX framework," and Storm-0940 is just one of them.

**How the attack chain unfolded**: Between October 10 and 14, 2026, Storm-0940's infrastructure (IP `144.172.64.99`) ran a cross-tenant password-spray campaign against 327 accounts at 8 organizations. Microsoft observed more than 151,000 failed logon events, peaking at 2,900 failures per minute on October 11 — but this wave alone produced no successful authentication, no token issuance, and no directory changes. The real breakthrough came on October 15: after obtaining identity credentials for several ConnectWise cloud applications (Cloud Backup, the MS Teams integration, the MS Graph integration), the attacker used the same IP range to authenticate directly into downstream customer environments by riding on the trust those applications had already been granted by tenants — no interactive user sign-in required, effectively inheriting the app's existing access scope. Microsoft said Storm-0940 used ARTEX to attempt sign-ins against more than 2,250 tenants at up to 2,900 attempts per minute; in some environments, the AI agents went further, conducting reconnaissance and modifying application credentials, identities, groups, and privileged roles to establish persistence — with the fastest time from initial targeting to privileged access measured in under three hours.

Microsoft mapped this incident to MITRE ATT&CK techniques including **T1195 Supply Chain Compromise** (compromising a multi-tenant OAuth application to reach downstream customers), **T1199 Trusted Relationship** (using an already-trusted third-party application to gain downstream access), **T1098.001/T1098.003 Account Manipulation** (adding or modifying application credentials, self-assigning privileged roles), and **T1528 Steal Application Access Token**. It's worth noting that, as with the earlier ARTEX incident, this doesn't map cleanly to any single OWASP LLM Top 10 entry — the target systems' own LLMs weren't injected or hijacked. Instead, the attacker treated agentic AI as attack infrastructure, using it to fully automate and run around the clock what would otherwise be human-speed-limited scanning, password spraying, and OAuth abuse.

## Defense

**Immediate actions**
- If you have ever installed or authorized ConnectWise Cloud Backup or any other ConnectWise cloud application, keep the connection disabled until you receive formal restoration guidance from ConnectWise and Microsoft — **do not delete the application first**; preserving configuration and evidence is a prerequisite for investigation
- Inventory whether these three ConnectWise app IDs are present in your tenant, including ones no longer in active use: `506e08f9-6e9a-4da4-942b-a099a03644ae` (Cloud Backup), `24205314-2b89-4e07-a2a4-579e898a5640` (MS Teams integration), `0de14c77-b9b0-4137-9360-34878a929827` (MS Graph integration) — search by application ID, not display name
- Review Entra service-principal sign-in logs and Microsoft Graph audit records starting at least from October 15, extending back to October 1 where records allow; look for application credential additions, new owners, privileged role assignments, and Conditional Access changes
- Only after confirming suspicious activity, rotate credentials for affected applications and revoke unnecessary permissions; preserve Entra sign-in/audit records, Purview audit logs, and SIEM data first — don't wipe evidence in the rush to contain

**Longer-term architecture**
- Apply least privilege to multi-tenant application permissions and consent grants, and monitor credential additions and self-assigned role grants on any highly privileged app — the core weakness in this incident was a trusted third-party application holding permissions beyond what it actually needed
- This incident is a reminder that a tool being discontinued or taken closed-source by its author doesn't mean the threat disappears — the same ARTEX codebase has already leaked and is being reused by multiple attackers with different motives across different regions; supply-chain risk assessment can't rely on whether a tool is "officially maintained"
- The real problem isn't patching one vulnerability — it's whether detection and response can happen on the same timescale as the attacker's automation (in this case, as fast as 3 hours to privileged access). Manually reviewing sign-in logs after the fact simply can't keep up
- Watchlist B7 tools like Noma Security and WitnessAI, which focus on SaaS/OAuth application risk and AI governance visibility, are suited to catching "authorized but anomalously used" third-party applications like this one, and can complement existing SIEM/XDR coverage

## Impact

Microsoft has not disclosed exactly how many tenants were actually compromised, and explicitly cautions that the presence of an affected application — or even successful service-principal authentication — doesn't by itself mean data was accessed or exfiltrated. At the same time, it reports observing post-authentication directory operations and credential modifications in multiple customer environments, suggesting the risk for at least some organizations goes beyond simply being scanned. ConnectWise temporarily shut down the affected service and has been restoring it in phases since October 21, with recovery expected to take several days; affected customers need to work through Microsoft's and ConnectWise's published investigation and remediation guidance tenant by tenant, rather than waiting for the vendor to unilaterally declare the incident resolved. More notably, Wiz's October 23 follow-up analysis found that Storm-0940 has already extended the same playbook — probing SSO/M365 endpoints, password-spraying Okta and Entra ID, abusing password-reset and account-activation flows, and rotating IPs within minutes of being blocked — to other software and IT vendors, with some attack sessions lasting 24 to 30 hours. This isn't a single, concluded breach; it's an ongoing campaign still testing the multi-tenant trust chains of more vendors.

## Today's takeaway

Supply-chain attack defense windows used to be measured in days or weeks. The number Microsoft disclosed here is "as fast as 3 hours from initial targeting to privileged cloud access." That's a reminder that what agentic AI changes isn't just "attacks get automated, attackers save labor" — it compresses defenders' race-clock from human reaction speed down to machine speed. A SOC process built around manually reviewing sign-in logs after the fact, with anomalies triaged the next day, is structurally unable to keep up with that pace. The real question isn't "should we install this patch" — it's "can our alert-to-response pipeline close in under 3 hours."

## References

- [AI-driven, large-scale nation-state campaign using ARTEX enables supply chain compromise — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/)
- [China-Linked Hackers Use ARTEX AI Agents in ConnectWise Supply Chain Attack — The Hacker News](https://thehackernews.com/2026/10/china-linked-hackers-use-artex-ai.html)
- [Microsoft pins ConnectWise supply-chain attack to China-state aligned threat group — CyberScoop](https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/)
- [Microsoft says China-aligned hackers used AI agents in ConnectWise supply chain attack — Tom's Hardware](https://www.tomshardware.com/tech-industry/cyber-security/microsoft-says-china-aligned-hackers-used-ai-agents-in-connectwise-supply-chain-attack-agents-attempted-sign-ins-at-more-than-2-250-microsoft-365-tenants-with-some-of-the-groups-attacks-reaching-privileged-access-in-under-three-hours)
- [ARTEX in the wild: Storm-0940 expands targeting of IT and software vendors — Wiz](https://www.wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors)
- [ConnectWise Trust Center — Cloud Backup advisories](https://www.connectwise.com/company/trust/advisories)
- [This series, Oct 8: Chinese open-source agentic pentesting tool ARTEX abused in South Korean bank data breaches](/posts/daily/2026-10-08-security-artex-ai-pentest-korea-banks-en)
