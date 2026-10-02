---
title: "Security Alert: Storm-3168 (JADEPUFFER) Took Over an Azure Tenant With a Deleted GitHub Comment — But the 'AI Agent Did It' Framing Deserves Scrutiny Too"
date: 2026-10-01
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "Microsoft disclosed that JADEPUFFER (tracked as Storm-3168) used Azure service principal credentials leaked in a GitHub issue's edit history to reconnoiter and delete hundreds of storage accounts, a Key Vault, and Function Apps within 18 hours — but outside experts note the Azure-side evidence proves automation, not that an AI agent made the calls."
tldr: "On September 25, Microsoft published new details on JADEPUFFER (tracked internally as Storm-3168): two compromised Azure service principals completed reconnaissance, credential harvesting, and destruction in about 18 hours, deleting hundreds of storage accounts and other cloud resources while attempting to remove backup protection locks. The likely entry point was a service principal's client ID, secret, and tenant ID that an employee had posted in plaintext in a public GitHub issue — the comment was later edited or deleted, but the plaintext secret survived in GitHub's edit history. JADEPUFFER made headlines in July when Sysdig called it the first-ever end-to-end LLM-driven ransomware operation (entering through Langflow CVE-2025-3248), but this Azure-side evidence only shows heavy automation and division of labor — it doesn't directly prove an AI agent was making real-time decisions, and that gap is worth noting on its own. Defense: treat any secret that ever touched a public issue or commit as compromised, lock down deletion on critical resources, and scope service principal permissions tightly."
series:
  name: "AI Security Alert"
  order: 43
---

> 🌏 [中文版](/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction)

## Incident Overview

On September 25, 2026, Microsoft Security Research published a report on an Azure tenant destruction incident tied to Storm-3168, the actor security researchers call JADEPUFFER. The attack took place in early June and unfolded over roughly 18 hours: two compromised Azure service principals spent 16 hours reconnoitering the tenant's subscriptions, resource groups, and resources, then packed more than 150 destructive or credential-harvesting operations into 35 minutes, with the final deletion sweep taking just 7 minutes. It wiped out hundreds of storage accounts, a Key Vault, a Function App, and multiple App Services, and attempted to remove backup and recovery protection locks. JADEPUFFER drew attention in July when security firm Sysdig called it "the first documented end-to-end LLM-driven ransomware operation." This report marks Microsoft's first detailed look at the actor's specific behavior inside Azure.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Credential leak → destructive cloud attack (agentic-driven cloud attack) |
| Scope | Azure Storage Accounts, SQL databases, Key Vault, Function App, App Service, VMs, and backup/recovery locks within the compromised tenant; ongoing probing of Azure App Service across multiple other customers |
| Severity | High (real deletion of cloud resources, plus an attempt to disable recovery) |
| CVE | None new; the entry vector likely traces back to the Langflow CVE-2025-3248 that Sysdig disclosed in July |
| Sources | [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/), [The Hacker News](https://thehackernews.com/2026/09/jadepuffer-linked-attackers-used.html), [The Register](https://www.theregister.com/security/2026/09/28/jadepuffer-crims-hijacked-azure-identities-and-used-them-to-blow-up-cloud-resources/5299591), [DarkReading](https://www.darkreading.com/cloud-security/jadepuffer-ai-actor-azure-tenant-destructive-cloud-attack) |

## Attack Surface Analysis

The entry point is a familiar one: Microsoft says the abused service principal's client ID, client secret, and tenant ID had been posted in plaintext by an employee of the victim organization in a **public GitHub issue**. The comment was later edited or removed, but GitHub's **edit history** preserved the original text — a detail that's easy to overlook. Deleting a comment doesn't delete the leak; as long as a platform keeps version history, a plaintext secret sits there waiting to be dug up.

What happened after the credentials were stolen is the real substance of this report. The two service principals split the work cleanly. The first spent nearly 16 hours issuing more than 300 read operations, sweeping through subscriptions, resource groups, and resource lists. The second joined about 90 minutes after the first began, yet needed only five seconds to enumerate VMs and resource groups across two subscriptions — a speed gap that looks less like a natural extension of the same process and more like a deliberately partitioned task. Both identities shared the same Storm-3168-linked infrastructure, the same network fingerprint, and the same User-Agent (`python-requests/2.34.2`) — the key indicator researchers later used to link two seemingly separate bursts of activity. Sixteen hours in, the second identity went on to enumerate App Service configuration stores, hunting specifically for credentials hardcoded into configs, including storage account access keys (some tied to Azure Site Recovery) — keys that could enable future exfiltration even though none was observed this time. The destructive phase moved faster still: more than 150 destructive or credential-harvesting operations compressed into 35 minutes, with the final deletion sweep taking just 7 minutes, mapping to MITRE ATT&CK T1490 (Inhibit System Recovery). The attacker didn't just delete resources — it specifically targeted Azure Site Recovery disk locks and Azure Backup protection locks, with an unmistakable goal: make sure the victim couldn't recover even if they tried. Notably, every attempt to delete the SQL databases failed, but only because the attacker used an unsupported API version — a lucky break, not a defense that worked as designed.

Mapped against the OWASP LLM Top 10, the closest fit is **LLM06/LLM08: Excessive Agency** — not because this incident definitely involved an LLM making the decisions (see below), but because it demonstrates that the "excessive agency" risk is architectural, independent of whether the executor is AI. A single identity with reach across compute, storage, secrets, and backups, once hijacked by a leaked credential, can blow through an entire tenant in minutes whether the driver behind it is a carefully scripted bash pipeline or an agentic loop. The blast radius is set by how much a single credential can touch, not by what's issuing the commands.

## Defense

**Immediate actions**
- Audit any secret that has ever appeared in a public or semi-public GitHub issue, PR, or commit message — even if the comment was later "deleted." GitHub's edit history preserves the original text, so treat it as compromised and rotate it immediately.
- Watch for service principals exhibiting "machine-speed" behavior: dense enumeration in a short window, multi-subscription scans completed in seconds, or a fixed automation User-Agent like this case's `python-requests/2.34.2`.
- If you self-host Langflow, confirm CVE-2025-3248 is patched and check whether the `/api/v1/validate/code` endpoint is exposed to the internet — Storm-3168 has been probing this exact endpoint across multiple Azure customers since the start of the year.
- Apply Azure resource locks (`CanNotDelete`) and storage-account-level delete protection to storage accounts, Key Vaults, and backup/recovery resources — this actually stopped some deletion attempts in this incident, one of the few defenses that held.

**Long-term architecture**
- Apply least privilege to service principals: scope them to a resource group or subscription rather than granting tenant-wide Contributor/Owner access, so a leaked credential's blast radius stays local rather than tenant-wide.
- Enable the relevant Defender for Cloud plans (Resource Manager, Storage, Key Vault, App Service, Databases) and build detections for operation patterns that don't match human pacing — dense bursts of activity in seconds to minutes.
- Maintain asset and exposure inventories across cloud environments (this is exactly the visibility gap that watchlist tools like Protect AI and Netzilo aim to close) — without it, a year-long probing campaign like this one can go unnoticed.

## Impact

This report details a complete attack chain within a single tenant, but Microsoft also notes that Storm-3168-linked infrastructure has continued probing multiple other Azure customers' App Service instances since the start of the year, using paths tied to WordPress admin panels, PHP-CGI, web-shell-like URLs, and — matching the actor's known entry vector — Langflow's code validation endpoint. This isn't an isolated event; it's the same playbook running against multiple targets. No ransom note was observed this time, and no confirmed data exfiltration occurred, but the harvested storage access keys and the deliberate targeting of backup protection locks both point toward the possibility that a ransom wasn't demanded this time, but might be next time. If your organization manages Azure service principal credentials through code or configuration files, this incident is a concrete reminder: the problem isn't whether the secret was ever "seen" — it's whether it was permanently removed from every place it can still be dug up.

## Takeaway

The most interesting part of this report isn't the attack technique — it's a pushback from an outside expert. Nick Tausek of Swimlane noted that the Azure-side evidence "shows coordinated automation rather than proving AI directed each step." Microsoft labeled this incident "agentic-driven" largely because it shares infrastructure with the July JADEPUFFER case that Sysdig confirmed did have LLM-driven artifacts — but shared infrastructure proves "the same operator," not "AI pressed the buttons this time too." It's a useful reminder that when security vendors attach an "AI-orchestrated" label to an attack, they have a double incentive: raise alarm, and lend credibility to their own agentic defense products. Readers have to separate what the evidence actually supports — automation — from what makes for a better headline — AI.

## References

- [Microsoft Security Blog — Storm-3168: Agentic-driven cloud attacks using compromised service principals](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/)
- [The Hacker News — JADEPUFFER-Linked Attackers Used Compromised Service Principals to Delete Azure Resources](https://thehackernews.com/2026/09/jadepuffer-linked-attackers-used.html)
- [The Register — JadePuffer crims hijacked Azure identities and used them to blow up cloud resources](https://www.theregister.com/security/2026/09/28/jadepuffer-crims-hijacked-azure-identities-and-used-them-to-blow-up-cloud-resources/5299591)
- [DarkReading — JadePuffer AI Actor Compromises Azure Tenant in Destructive Cloud Attack](https://www.darkreading.com/cloud-security/jadepuffer-ai-actor-azure-tenant-destructive-cloud-attack)
- [SecurityAffairs — Storm-3168, Linked to JADEPUFFER, Abused Stolen Azure Identities](https://securityaffairs.com/199905/cyber-crime/storm-3168-linked-to-jadepuffer-abused-stolen-azure-identities.html)
- [Sysdig — JADEPUFFER: Agentic ransomware for automated database extortion](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion)
