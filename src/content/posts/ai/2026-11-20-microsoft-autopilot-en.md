---
title: "Microsoft Autopilot Acts Under Its Own Identity: Entra Agent ID, a Named Sponsor, and How Auditing and Revocation Work"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, microsoft, copilot, entra]
lang: en
tldr: "Microsoft Autopilot (formerly Scout) is an always-on agent that lives in a company's tenant, watching Teams channels, following up on email and running recurring work on its own, which puts it at L3 on the always-on ladder. Its defining difference is identity: each Autopilot has its own Microsoft Entra Agent ID and a named human accountable for it, its sign-ins and actions are logged under its own name, and IT can scope its access and block it at any time. Purview data protection applies before anything is sent. It's built on OpenClaw open-source technology and for now is limited to eligible customers in the Frontier program."
description: "Microsoft's always-on agent Autopilot: from Scout to Autopilot, why giving an agent its own identity matters, how Entra Agent ID logs and blocks agents, what happens when the named sponsor leaves, how it compares with Devin Bots and specialist dots, and what to ask IT before adopting it."
series:
  name: "Always-On AI Agents"
  order: 11
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-microsoft-autopilot)

| Four tests | Microsoft Autopilot |
|---|---|
| Keeps running while you're away | ✓ Runs in the cloud with its own remote computer; doesn't need your laptop open |
| Decides what to do when it wakes | ✓ L3: watches Teams channels, follows up on threads and email, runs recurring work without a prompt |
| Remembers your goals across conversations | ✓ Persistent memory, grounded in organizational context from Microsoft IQ / Work IQ |
| Acts for you | ✓ Sends email, schedules meetings, takes work in group chats; key actions can be set to check with you first |

Omar Shahine, who wrote Microsoft's Scout and Autopilot introductions, [calls his Autopilot Sebastian](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611).

While he was out of the office, he asked Sebastian to help with unanswered Teams conversations. Sebastian prepared 40 reply drafts, grouped by priority, in a private, editable queue for him to review. None of them was sent. As Shahine puts it:

> The replies stayed as drafts. I remained responsible for what would be sent.

Sebastian emails him a "Sunday Reset" from its own address, and he can reply to continue the conversation; colleagues who want to meet with him can schedule time by talking to Sebastian directly in Teams. All of that works because Sebastian has its own identity.

This post is about Microsoft Autopilot: what changes for auditing and revocation when an agent works under its own identity, with a named human accountable for it.

## From Scout to Autopilot

- **June 2, 2026, Microsoft Scout**: [Microsoft introduced a new category called "Autopilots"](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/): always-on agents that work autonomously, with their own identity, on your behalf. Scout was the first. It shipped as an experimental release through the Frontier program, and Microsoft says it's "powered by OpenClaw open-source technology."
- **September 25, 2026, renamed Autopilot**: [one of three capabilities in the new Copilot](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/), alongside Home and Code, expanding to private preview at month's end.
- **November 17, 2026, Ignite**: [rollout to Frontier customers began](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/).

Microsoft also says it is contributing policy conformance upstream to OpenClaw. Organizations running OpenClaw will be able to validate whether their environment meets security and compliance requirements and get an audit-ready answer.

## What it does

Autopilot lives in the company's tenant with its own identity, memory, computer and workspace. It shows up where people already work, in Teams, Outlook, chats, channels and documents, and you can @mention it like a colleague.

Microsoft's example is a full supplier review: building the schedule and workback plan, then handling prep, meetings and follow-ups on its own, down to chasing stakeholders for updates. Shahine's example is "get me to Ignite and back." Before the trip, block time, compare flights and hotels, and book once he approves; during it, prepare for meetings and keep him reachable; afterwards, follow up on missed conversations and do the expense report.

He mentions one detail: when he asked Sebastian to clear meetings before time off, he selected the meetings and Sebastian removed only those occurrences, keeping the recurring series. "'Clear next week' shouldn't accidentally become 'cancel this meeting forever.'"

## Why identity is the point

Most agents earlier in this series act through your account: connect your Gmail and it sends from your Gmail. Autopilot does it differently. The [Scout announcement says](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/):

> Every agent operates under its own governed Entra identity, not a shared, anonymous service account, so the work it does is attributable to a known actor your directory already understands.

That makes several concrete differences:

| | Agent uses your identity | Agent uses its own identity (Autopilot) |
|---|---|---|
| Audit trail | Looks like you did it; you and the agent are indistinguishable | Sign-ins and actions logged under the agent's own name |
| What recipients see | You | Your Autopilot (with its own mailbox) |
| Stopping it | Revoke the access you granted, or change your password | Block its identity; your account is unaffected |
| Scope of access | As broad as yours | Can be scoped on its own |
| Accountable person | You | A named human sponsor |

The [Ignite announcement](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/) puts it briefly. Each Autopilot has its own Microsoft Entra Agent ID and a named manager, and IT can scope its access and block it anytime. Its sign-ins and actions are logged under its own name, so security teams have a clear audit trail.

## How Entra Agent ID actually works

[Microsoft Entra's documentation](https://learn.microsoft.com/en-us/entra/agent-id/manage-agent-identities-admin) explains how these identities are managed.

**Sponsors**: every agent identity should have an accountable human sponsor responsible for its purpose and lifecycle decisions. If the sponsor leaves the organization, Entra automatically reassigns sponsorship to the sponsor's manager, so the agent isn't orphaned. As access assignments near expiry, sponsors are notified and can request an extension (which triggers a new approval) or let them lapse.

**Logs**:

- In [audit logs](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents), agent activity is recorded under its underlying identity type, with an `agentType` field showing whether, and what kind of, agent was involved.
- Sign-in logs include an `agentSignIn` type, and the Entra admin center can filter by "Is Agent."

**Blocking works at three levels**:

| Scope | Effect |
|---|---|
| A single agent | Disable one agent identity so it can't get tokens or sign in; admins use the admin center, owners and sponsors use My Account |
| A blueprint | Disable an agent template, blocking every agent created from it and preventing new ones |
| The whole tenant | Block all agent identity sign-ins with Conditional Access policies |

**Risk detection**: Entra ID Protection watches agents for anomalies such as unfamiliar resource access, sign-in spikes and failed access attempts. Admins can confirm a compromise, which sets risk to high and triggers Conditional Access policies that block it automatically.

The docs add a caution: disabling every agent tenant-wide can break existing agents and push teams toward less transparent app or service-principal identities. They suggest using Conditional Access to block specific agents instead.

## Data protection before anything is sent

Identity says who is acting; access control says what they can do. The Scout announcement says agents can reach only resources and destinations you've approved, and sensitive actions can require a human sign-off before proceeding. Microsoft Purview policies, including sensitivity labels and data loss prevention, are "enforced in the moment, before anything is sent or written." It doesn't bypass these controls; it works inside the protections the organization has already configured.

Credentials are scoped to the task at hand and redacted from logs and diagnostics.

## Compared with Devin Bots and specialist dots

On this route, all three vendors are solving "whose access does an agent use when it works for a team," in different ways:

| | Devin Bots | OpenAI specialist dots | Microsoft Autopilot |
|---|---|---|---|
| Identity | The bot holds grants others gave it | Its own identity, credentials and access (enterprise pilots) | Its own Entra Agent ID |
| Who manages access | Whoever shares the bot, and its creator | The company | IT, through the directory |
| Accountable person | The bot's creator | Set by the company | A named sponsor, auto-transferred to their manager on departure |
| Audit | The grant list in Devin | Not detailed publicly | Entra audit and sign-in logs |
| How to stop it | Revoke grants, archive or delete the bot | Not detailed publicly | Disable the identity, disable the blueprint, or Conditional Access |

With Devin Bots, the team sets permissions itself; Autopilot treats the agent as a member of the company directory, managed with the same tools IT already uses for people.

## Who can use it now

[Shahine's November 17 post](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611) says eligible customers need:

- Enrollment in the Frontier program
- A Copilot license
- Usage-based billing enabled
- The required management and security capabilities in place

Like Cowork and Code, Autopilot runs on usage-based billing rather than the fixed per-user subscription. A commenter under the post quotes message center item MC1557730 as saying Frontier availability of Autopilot "is initially limited to eligible US customers." That's a reader's quote; Microsoft's post itself doesn't mention regions.

There are no hands-on reviews from outside Microsoft yet. All the examples come from Microsoft's own use and Shahine's.

## Questions to ask IT before adopting it

If your company is evaluating Autopilot or any agent that works under its own identity, these are the questions to take to IT:

1. **Who created its identity, and who is the sponsor?** If the sponsor leaves, Entra hands it to their manager; does that manager know they'll inherit it?
2. **What resources can it reach?** Only the mailboxes, channels and sites this job needs, or someone's entire set of permissions?
3. **Which actions need human sign-off?** Email outside the company, deleting files, accepting meetings: are they set to ask first?
4. **Do Purview labels and DLP apply to it?** Can it send a document labeled confidential?
5. **When something goes wrong, how do we find what it did?** Does the security team know how to filter agent actions in audit logs by `agentType`?
6. **When we need to stop it, at which level?** Just this agent, the whole template, or Conditional Access? Who has the rights to do it?
7. **How is it billed, and who pays?** Is usage-based billing capped? Is Agent 365 cost management turned on?

## Who it suits, and who it doesn't

**Suits you if:**
- Your company already runs on Microsoft 365 and Teams, with an IT team managing Entra.
- Your organization needs a clear audit trail and revocation before letting an agent act, as in regulated industries.
- You do a lot of cross-person coordination: scheduling, following up on threads, preparing for meetings.

**Doesn't suit you if:**
- You're an individual or small team: it requires Frontier enrollment, a Copilot license and full management and security setup.
- Your work mostly lives outside the Microsoft ecosystem: a commenter under the post asks how it would work for someone whose identities span several mailboxes and services.
- You want independent reviews before deciding: there aren't any yet.

In Taiwan, individuals can't use it; companies need to join Frontier and confirm their tenant is eligible.

Identity pins down "who is doing it." Next, Salesforce's long-horizon agents tackle something else: for a plan that runs over weeks, how to keep track of "how far along is it, and when has it drifted enough to come back and ask a human."

## References

- [Introducing Microsoft Scout: Your always-on personal agent](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/) (Microsoft, 2026-06-02)
- [Introducing the new Copilot with Home, Code and Autopilot](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/) (Microsoft, 2026-09-25)
- [Copilot at Microsoft Ignite: Expanding what's possible with intelligence built for work](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/) (Microsoft, 2026-11-17)
- [Autopilot: meet your trusted personal teammate](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611) (Microsoft Community Hub, 2026-11-17)
- [Manage agent identities in your organization](https://learn.microsoft.com/en-us/entra/agent-id/manage-agent-identities-admin) (Microsoft Learn)
- [Microsoft Entra Agent ID logs](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents) (Microsoft Learn)
