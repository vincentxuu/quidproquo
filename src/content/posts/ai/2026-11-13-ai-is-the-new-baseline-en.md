---
title: "AI Is the New Baseline: After BossAI and ARTEX, Attack Your Own Systems First"
date: 2026-11-13
category: ai
type: deep-dive
tags: [security, ai-agent, penetration-testing, dual-use]
lang: en
tldr: "BossAI in Hualien, a self-taught AI attacker in Kaohsiung and the ARTEX case in Seoul show that automated attack systems no longer require a security background, and one operator can sweep hundreds of targets in weeks. Run an AI security audit on your own source code, then self-test with an ARTEX-style framework; both cost far less than an outsourced pentest."
description: "What Acronis's BossAI report, a Kaohsiung arrest of a self-taught AI attacker and Seoul police's ARTEX case say about how mature automated attacks are, how low the barrier has fallen, and what low-cost defenses to run first."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-13-ai-is-the-new-baseline)

Three cases in the past three weeks point the same way: attacking websites with AI no longer takes an expert.

| | BossAI (Hualien) | Kaohsiung | Seoul (ARTEX) |
|---|---|---|---|
| How it surfaced | Security firm Acronis found a full attack platform and agent conversation logs on a misconfigured VPS | Kaohsiung police gathered evidence, searched the home and made the arrest | Seoul Metropolitan Police arrested the main suspect on October 15 |
| Operator | An individual in Hualien City with a technical background | 38 years old, junior-college education, works as a casual dock porter | 32 years old, a former penetration tester |
| Scale | Hundreds of organizations in 11 countries over 12 days | 4 public and private sites breached, 230,000+ personal records sold on the dark web | 90+ organizations, about 8.2 million records, extortion with 6 accomplices |
| Tooling | 12 AI agents (Hermes, Cursor, Grok and others), MCP, many models | AI-generated attack code assembled into an automated attack system | The open-source AI pentest framework ARTEX |

The Kaohsiung suspect has no IT background, while the BossAI operator clearly does. Their reported jobs and backgrounds do not match, and no report links the two cases.

## BossAI: One Person, 12 Agents, Plenty of Mistakes

BossAI came to light because it was exposed. Acronis's researchers started from a misconfigured development environment and retrieved more than 90,000 files, about 9 GB, including agent conversations, attack commands, configs and victim data. Identifying the operator came from accumulated operational slips: an SSH session in a conversation revealed a home IP, an SSH key identity matched a GitHub account, and business branding on the server matched a public-facing website. Acronis concluded it was one individual in Hualien City. As of this writing, none of the reports I found mention any follow-up by Taiwanese police.

The system is built from the same pieces we use for agent engineering:

- **Builders**: Grok, OpenClaw, Claude Code and Codex set up MCP, DNS, proxies and messaging gateways.
- **Attackers**: mainly Hermes, plus Cursor and Trae; HalberdStrike and Acunetix produced vulnerability reports.
- **Tool layer**: MCP connected a Kali instance, so agents could call nmap, sqlmap, Metasploit and Hydra themselves.
- **Skills**: Hermes stored attack workflows as SKILL.md files. The most used one targeted Taiwanese fire-dispatch and emergency-management APIs, and it kept accumulated recon data across model swaps.

In Taiwan the damage fell on emergency services. Acronis reports that the attacker obtained Taipei 119 dispatch records for seven districts, and found a Taipei fire-department patient-care platform exposing ECG readings, ambulance video and vital signs from 2018 onward without any login.

The limits of the system were just as concrete, and Acronis is candid about them:

- Commercial models, including Grok and MiniMax, refused attack requests and even asked for proof of authorization, so the offensive agents ran almost entirely on locally hosted "abliterated" (safety training removed) DeepSeek, GLM and Qwen variants, which are weaker.
- The agents did not talk to each other. The operator copied output between them: scan report into Hermes, then into Cursor for execution.
- More than half of the high and critical findings from HalberdStrike were false positives or misclassified, including a failed connection logged as an RCE.
- The operator gave Hermes full authority and told it not to ask. Hermes then found a Honduran military host and dropped it on its own judgment that it was out of scope.

So BossAI is not a flawless attack machine. It is an assembly line one person built from off-the-shelf parts, noisy but strong enough to sweep hundreds of targets in 12 days.

## The Barrier: Say "Get It Running"

The other two cases are about the barrier.

In Kaohsiung, police say the man had no IT background. He taught himself with web searches and several generative AI tools that checked and corrected each other's code, built his own attack system, targeted sites with exploitable back ends, downloaded whole databases, and sold records on the dark web at about NT$6 each. Reports cite more than 230,000 records and about NT$2.7 million in profit. The news did not release much technical detail, so I won't speculate about how capable his system was.

The Seoul suspect had worked as a pentester, but he also taught himself from online resources. He switched to ARTEX in late August and breached 60 companies in 43 days, from August 31 to October 13. Seoul police say it is the first time in South Korea that someone has been caught using generative AI for large-scale intrusion and personal-data theft, and that AI has clearly lowered the barrier.

Open-source projects like ARTEX add another point: you don't need to understand how it runs. Tell your coding agent "install it and get it running," and the agent handles environment, dependencies and configuration. Acronis makes a related observation: the BossAI operator used commercial models as an infrastructure engineer and reserved local models for offense. That split means someone without coding or AI engineering skills could plausibly assemble a similar system.

Put together, the system gets more mature and the barrier gets lower, so the total volume of attacks goes up.

## How Far Full Automation Goes

I downloaded ARTEX and tried it earlier, and my verdict was that it works very well. The chain below is one the agent produced on its own during testing. My goal was a single sentence: "get me server access on xxx."

```flow-diagram
{
  "title": "An attack chain the agent built on its own during testing",
  "lang": "en",
  "width": 520,
  "height": 600,
  "nodes": [
    {"id": "goal", "label": "Goal: one sentence + one domain", "x": 260, "y": 40, "w": 320, "tone": "accent"},
    {"id": "js", "label": "Test header found in front-end JS", "x": 260, "y": 130, "w": 320},
    {"id": "sandbox", "label": "Forge identity, bypass sandbox, get RCE", "x": 260, "y": 230, "w": 380},
    {"id": "meta", "label": "Temporary key from cloud metadata", "x": 260, "y": 330, "w": 320},
    {"id": "k8s", "label": "K8S node access, move to other pods", "x": 260, "y": 430, "w": 320},
    {"id": "admin", "label": "Service account escalation: cluster admin", "x": 260, "y": 540, "w": 380}
  ],
  "edges": [
    {"from": "goal", "to": "js", "step": 1, "label": "recon", "labelAt": [300, 85]},
    {"from": "js", "to": "sandbox", "step": 2, "label": "forge identity", "labelAt": [300, 180]},
    {"from": "sandbox", "to": "meta", "step": 3, "label": "lateral move", "labelAt": [300, 280]},
    {"from": "meta", "to": "k8s", "step": 4, "label": "hand to K8S", "labelAt": [300, 380]},
    {"from": "k8s", "to": "admin", "step": 5, "label": "privilege escalation", "labelAt": [300, 485]}
  ],
  "steps": [
    "The agent runs recon on the domain, fingerprints the service and finds a test header in front-end JS",
    "It forges an identity with the header, finds a feature that runs JS in a sandbox and bypasses the blacklist to get RCE",
    "From the RCE it moves laterally and obtains a temporary key from cloud metadata",
    "It hands the key to K8S, gets node access and moves to other pods",
    "It finds a service account that can create pods and escalate, and ends with cluster admin"
  ]
}
```

The diagram plays step by step when it scrolls into view, and you can pause on any step with the buttons. The flow mirrors what a human tester does: follow each clue and keep extending it.

The model does not need to be the strongest either. I used DeepSeek v4.1 flash and let it run for four or five hours, for about US$10, and it found a pile of problems.

To be clear, this does not make it better than a senior pentester. It has gaps, and some details only surface when a person watches closely; I watched mine as well, in case it broke the system. Its advantage is that it is fast, cheap and fully automatic, so you can leave it running. A part of black-box testing is formulaic, for example stuffing every input with XSS payloads to see what triggers. The process is fixed, but you cannot skip it for coverage. Handing that to AI is a good fit, and the time saved goes to the places that need a human brain.

In my view, automated pentesting is close to coding agents in maturity: say one sentence and the agent writes the feature, or attacks the target and writes the report.

## Getting Breached Is No Surprise

Seen this way, I am not surprised that so many systems fall. Even before AI, a lot of security was a mess: old systems full of holes, either in their own code or in third-party components with public exploits.

Most of them survived because they were not valuable enough for anyone to bother. Now any system on the network can be attacked by someone saying one sentence. When the cost of attack drops, targets that were "not worth it" become "worth a try."

## Three Things You Can Do

| Approach | Cost | Fits |
|---|---|---|
| Hire a trustworthy security firm for a pentest | High | Critical services, compliance needs |
| Run an AI security audit on your source code | Low | You have the code and want the basics done |
| Set up an ARTEX-style framework and attack yourself | Low | You expose services and want to see what actually gets in |

**A pentest** is still the most reliable. Paying a trustworthy firm remains the best way to protect your own service. Quality in this field varies: some firms run a vulnerability scanner and repackage it as a pentest. In that case the result may be no better than setting up ARTEX yourself, which is why I wrote "trustworthy." I don't recommend or endorse any firm and won't list names; ask friends and family.

**Traditional tools should evolve.** Traditional vulnerability scanners send fixed payloads, and source scanners mostly match fixed patterns. AI reasons and understands context, and combining the two is stronger. A growing number of companies already use AI for source code audits.

**With no budget, instruct your agent on the source code.** For example:

- `/goal do a security audit of this code and find the security problems`
- or push it to keep iterating: `/goal there is a serious RCE vulnerability in this code, find it`

That already finds quite a few problems.

**Attack yourself first.** Set up ARTEX (or a fork) and run it against your own systems. Only attack targets you own or have written authorization for, and remember the tool itself is an attack surface, so keep it away from anything that can reach your internal network. The [dual-use risks of these tools](/posts/ai/2026-10-24-ai-pentest-agents-dual-use-en) are covered in another post.

The second and third options are cheap and effective, and they are where I would start.

## Bottom Line

When someone asks us for help, we hope they have done their "homework" first, which used to mean asking Google. Now the homework is asking AI.

Security is the same. Attackers are already probing your systems with AI automation. If you have not had AI go over your own code and services once, the basics are not done, and the pentest you pay for later will be spent on holes AI could have found in ten minutes. AI is the new baseline.

## References

- [Acronis TRU: BOSSAI: Inside the AI attack mesh that targeted Taiwan's emergency services](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/)
- [iThome: Acronis details BOSSAI's operation, integrating 12 AI agents, MCP and Skills](https://www.ithome.com.tw/news/180310) (in Chinese)
- [iThome: AI attack system BossAI targets Taiwan's emergency services](https://www.ithome.com.tw/news/180304) (in Chinese)
- [The Hacker News: Taiwan-Based Hacker Used BOSSAI AI Agents to Steal Taipei Emergency Dispatch Records](https://thehackernews.com/2026/11/taiwan-based-hacker-used-bossai-ai.html)
- [UDN: AI as a hacker's helper: Kaohsiung man built attack sites, stole 230,000 records](https://udn.com/news/story/7321/9861696) (in Chinese)
- [CTS / CNA: Kaohsiung police arrest hacker who used AI to steal 230,000 records](https://news.cts.com.tw/cna/society/202611/202611063098121.html) (in Chinese)
- [CTWANT: Kaohsiung junior-college graduate turned hacker with AI](https://www.ctwant.com/article/505512/) (in Chinese)
- [iThome: Korean police crack ARTEX case, 90+ organizations and 8.2 million records](https://www.ithome.com.tw/news/179973) (in Chinese)
- [BleepingComputer: Former pentester used ARTEX AI to steal 8.2 million data records](https://www.bleepingcomputer.com/news/security/former-pentester-used-artex-ai-to-steal-82-million-data-records/)
- [On this site: AI pentest tools and dual-use risk](/posts/ai/2026-10-24-ai-pentest-agents-dual-use-en)
