---
title: "Security Alert｜TeamPCP Supply-Chain Ringleaders Arrested — Unpacking the Trivy→LiteLLM→Mercor Trust Cascade"
date: 2026-09-01
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Australian Federal Police and the FBI arrested two Western Australian men accused of leading the TeamPCP supply-chain crew. Charging details reveal how stolen publishing credentials for the Trivy scanner cascaded into compromises of Checkmarx KICS and the AI gateway LiteLLM, hitting over 1,000 organizations."
tldr: "AFP arrested two Western Australian men on Aug 26 accused of leading TeamPCP (the crew behind the Shai-Hulud worm), facing 14 combined charges and up to 20 years. Charging details and independent security research show the attack chain: steal Trivy's publishing credentials, cascade into Checkmarx KICS, then exploit LiteLLM's build pipeline for not pinning Trivy to a verified version — the poisoned Trivy stole LiteLLM's own publishing token, which was used to ship a backdoored release. LiteLLM is an AI gateway that centralizes credentials for multiple LLM providers, so this supply-chain attack reached directly into AI infrastructure. An estimated 1,000+ organizations, 500,000+ credentials, and 300GB of data were exposed, with victims including Mercor, OpenAI, and the European Commission. Mitigations: audit for use of the poisoned Trivy/LiteLLM builds, rotate every exposed credential, and pin all GitHub Actions workflows to verified commit SHAs."
series:
  name: "AI Security Alert"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-01-security-teampcp-supply-chain-arrest)

## Incident Overview

On August 26, the Australian Federal Police (AFP), together with Western Australia Police and the FBI, arrested two men — 21 and 23 years old — near Perth on charges of being core members of the supply-chain attack crew TeamPCP. TeamPCP emerged in late 2025 and became known for the self-propagating Shai-Hulud worm: the group's method was to steal publishing credentials for popular open-source projects and push backdoored releases straight through the project's own official release channel, so downstream users installed poisoned packages with no warning at all. AFP estimates the group's malicious code potentially compromised more than 1,000 organizations worldwide, stole over 500,000 credentials, exfiltrated at least 300GB of data, and caused an estimated global remediation cost in the hundreds of millions of dollars. This case is directly relevant to AI security because a critical link in the attack chain was the open-source AI gateway LiteLLM — a routing layer that centralizes API keys for multiple LLM providers including OpenAI, Anthropic, and Azure. The Hacker News, Bitdefender, BleepingComputer, and Security Affairs, along with security firms CloudSEK, Hudson Rock, StepSecurity, and Oligo Security, have independently corroborated the technical details and scale of impact from different angles.

**Key Facts**

| Item | Value |
|---|---|
| Type | Software supply-chain attack (cascading publishing-credential theft + package poisoning via a self-propagating worm) |
| Scope | Official release channels of the Trivy and Checkmarx KICS scanners and the AI gateway LiteLLM; downstream impact across npm, PyPI, GitHub Actions, Docker Hub, and OpenVSX, hitting 1,000+ organizations including Mercor, OpenAI, and European Commission cloud infrastructure |
| Severity | Critical (AFP estimates 1,000+ organizations affected, 500,000+ credentials stolen, 300GB of data exfiltrated, remediation costs estimated in the hundreds of millions of dollars globally) |
| CVE | No single CVE — the technique is build-pipeline credential theft and package poisoning rather than a specific software flaw; the FBI has published IC3 Advisory 260702 with technical indicators |
| Sources | [The Hacker News](https://thehackernews.com/2026/08/alleged-teampcp-hackers-charged-in.html), [Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/shai-hulud-hackers-charged-teampcps), [BleepingComputer](https://www.bleepingcomputer.com/news/security/australia-arrests-alleged-teampcp-hackers-behind-supply-chain-attacks/), [GovInfoSecurity](https://www.govinfosecurity.com/two-australian-men-charged-in-teampcp-supply-chain-attacks-a-32675) |

## Attack Surface Analysis

The full attack chain is a textbook demonstration of cascading trust. Step one: attackers stole publishing credentials for the container/IaC scanner Trivy and pushed a poisoned release. Step two: within days, those same stolen credentials were turned against another open-source security scanner's GitHub Actions pipeline — Checkmarx KICS — compromising one security tool to compromise the next. Step three, and the one most relevant to AI infrastructure: LiteLLM's own build pipeline installed Trivy without pinning it to a verified hash or commit, instead pulling in whatever the floating version tag resolved to at build time — so the poisoned Trivy got pulled straight into LiteLLM's CI and stole LiteLLM's own package-publishing token. Attackers used that token to ship a backdoored official LiteLLM release in late March. LiteLLM itself is a routing layer that centralizes API keys for multiple LLM providers, so any organization whose CI/CD pipeline installed that release during the exposure window effectively handed over both model-provider credentials and CI environment secrets in one move. On May 12, the group went further and open-sourced its worm framework on GitHub (as "Mini Shai-Hulud"), letting the attack self-replicate and scale; a fresh npm wave on August 4 used the same toolkit to poison the `keyv` and `cacheable` packages, showing that even with the alleged ringleaders now arrested, the same tooling may still be in other hands.

The reason this cascaded so successfully isn't that any single component had an unusually hard-to-patch flaw — it's the implicit assumption baked into software supply chains that **a trusted upstream, once trusted, stays trusted at whatever version ships next**. LiteLLM's build pipeline trusted Trivy's release channel, but never scoped that trust to a specific verified version — it trusted "whatever the latest Trivy is," full stop. This is a textbook case of **LLM05 Supply Chain Vulnerabilities** on the OWASP LLM Top 10: the weakness isn't in a model itself, but in the software supply chain underneath the service that runs it. LiteLLM being compromised as an AI gateway doesn't just mean one poisoned package — it means the credentials for every LLM provider it centralizes are exposed too, stretching the attack surface directly from "open-source tooling" into "the credential core of AI infrastructure."

## Mitigations

**Immediate actions**
- Check whether you've directly or indirectly used Trivy, Checkmarx KICS, or a LiteLLM release from late March 2026 — compare hashes against the officially disclosed affected version ranges to confirm whether you installed a backdoored build
- Per the FBI's August IC3 advisory, proactively search your environment for the worm-created repository names `tpcp-docs` and `docs-tpcp` as compromise indicators
- Assume every CI/CD, publishing, and cloud credential exposed during the window — including any model-provider API key that passed through a compromised LiteLLM instance — has been stolen, and rotate all of them per FBI guidance rather than just one link in the chain
- Watch for older malicious packages that have been pulled from a registry's index but remain reachable via direct CDN URLs — The Hacker News confirmed the backdoored LiteLLM release was still downloadable straight from PyPI's CDN five months after removal from the index

**Longer-term architecture**
- Pin every GitHub Actions workflow to a verified commit SHA instead of a floating version tag — the FBI's top recommendation, and the single control that would have blocked the "poisoned upstream auto-pulled by a trusting downstream" path this attack rode in on
- Evaluate watchlist B7 tools like Protect AI for ML/AI supply-chain security scanning, verifying provenance and hashes for every dependency in your build pipeline rather than trusting version numbers alone
- Manage AI gateways like LiteLLM — anything centralizing credentials for multiple providers — as production infrastructure with a real credential footprint, using short-lived credentials and least privilege (worth pairing with the mitigations from this site's Aug 31 LiteLLM honeypot report)
- Build a supply-chain incident response playbook: the moment an upstream component is reported compromised, proactively check every downstream dependency for cascading exposure instead of waiting to be named as a victim

## Impact

AFP estimates more than 1,000 organizations were affected, over 500,000 credentials were stolen, and at least 300GB of data was exfiltrated. CloudSEK's independent reconstruction puts the real exposure even higher — 2,500 organizations and more than 434,000 CI/CD pipelines. Hudson Rock, working from 153GB of the attackers' own leaked data, attributed 118,829 CI runner dumps to 2,488 corporate domains. The two Western Australian men — 21-year-old Ruben Thomson (alias "Ellis," believed to have led TeamPCP until March 2026) and 23-year-old Louis Gaebler — appeared in Perth Magistrates Court on August 27 facing 14 combined charges, with the unauthorized-data-modification and proceeds-of-crime counts carrying maximum penalties of up to 20 years. The AFP said the investigation is ongoing and has not ruled out further arrests or charges.

If your team uses Trivy for container or IaC scanning, or routes multiple LLM provider keys through an AI gateway like LiteLLM, the takeaway isn't "yet another supply-chain attack" — it's that any team sitting anywhere in that trust chain is exposed regardless of size, since the attack propagates automatically through the build pipeline. Many organizations only discover they were on the victim list after a security firm reconstructs the exposure after the fact, rather than through any signal of their own.

## Today's Takeaway

What surprised me most about this incident wasn't the attack technique itself — cascading credential theft through package poisoning isn't new — it's that **the law-enforcement angle is more noteworthy here than the technical one**. Most security alerts document vulnerability details and patch instructions; this is a rarer case where the attackers were actually arrested, charged, and are facing real prison time. TeamPCP reportedly ran a Telegram contest offering a prize for whoever built the biggest attack using leaked Shai-Hulud code — evidence this had become an organized, professionally-run criminal enterprise rather than the work of lone hobbyists. That's a reminder that defending against supply-chain attacks can't rely on technical controls alone (pinning versions, rotating credentials); cross-border law enforcement cooperation (AFP + FBI + WAPF) is also part of the defense against crews operating at this scale.

## References

- [Alleged TeamPCP Hackers Charged in Australia Over Major Supply Chain Attacks — The Hacker News](https://thehackernews.com/2026/08/alleged-teampcp-hackers-charged-in.html)
- [Shai-Hulud hackers: two men charged over TeamPCP's global supply chain crime spree — Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/shai-hulud-hackers-charged-teampcps)
- [Australia arrests alleged TeamPCP hackers behind supply-chain attacks — BleepingComputer](https://www.bleepingcomputer.com/news/security/australia-arrests-alleged-teampcp-hackers-behind-supply-chain-attacks/)
- [Two Australian Men Charged in TeamPCP Supply Chain Attacks — GovInfoSecurity](https://www.govinfosecurity.com/two-australian-men-charged-in-teampcp-supply-chain-attacks-a-32675)
- [Two Arrests, One Supply-Chain Attack, and a Lot of Stolen Credentials — Security Affairs](https://securityaffairs.com/197929/security/two-arrests-one-supply-chain-attack-and-a-lot-of-stolen-credentials.html)
- [Australian cops cuff alleged TeamPCP masterminds — The Register](https://www.theregister.com/security/2026/08/28/australian_cops_cuff_alleged_teampcp_masterminds/)
- [AI supply chain breach: 2,500 companies, 434,000 CI/CD pipelines — CloudSEK](https://www.cloudsek.com/blog/ai-supply-chain-breach-2500-companies-434000-cicd-pipelines)
- [Two WA men charged following AFP-FBI-WAPF disruption of alleged global cybercrime syndicate — AFP](https://www.afp.gov.au/news-centre/media-release/two-wa-men-charged-following-afp-fbi-wapf-disruption-alleged-global)
