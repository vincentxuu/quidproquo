---
title: "Security Alert | One Prompt Hijacks an Entire AI Agent Fleet — AWS Bedrock AgentCore's 'AgentCorruption' IMDS Credential Chain"
date: 2026-10-12
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "AI security firm Zenity Labs found that a single prompt to any public-facing agent on AWS Bedrock AgentCore could steal that agent's cloud identity via SSRF, then pivot through an over-privileged default role into every other agent in the same AWS account and region."
tldr: "Zenity Labs calls it AgentCorruption: prompt injection tricks an agent with network or shell tools into querying the 169.254.169.254 metadata endpoint, handing over its execution role's temporary AWS credentials. AgentCore's default role then carries broad wildcard permissions, letting the attacker enumerate and compromise every other agent in the same account and region — reading private conversations, poisoning memory, pulling container images, and reaching secrets in AWS Secrets Manager. AWS moved all newly deployed agents to IMDSv2 in February 2026 and tightened the default role by September, but maintains this is documented, expected behavior rather than a vulnerability. Confirmed across Dark Reading, cybersecuritynews.com, and BusinessWire. Defense: lock execution roles down to least privilege now, and long-term, treat every agent as a cloud workload rather than a chatbot when reviewing access."
series:
  name: "AI Security Alert"
  order: 51
---

> 🌏 [中文版](/posts/daily/2026-10-12-security-aws-bedrock-agentcore-imds-credential-theft)

## What happened

AI security firm Zenity Labs (a research vendor on our watchlist's B7 security list) disclosed an attack chain called "AgentCorruption" at SecTor 2026. A single prompt to any public-facing AI agent on AWS Bedrock AgentCore — as long as it has a network or shell tool — is enough to steal that agent's cloud identity credentials. From there, AgentCore's overly permissive default execution role lets an attacker pivot laterally into **every other agent** in the same AWS account and region: reading private conversation history, tampering with long-term memory, pulling container images and source code, and even reaching secrets stored in Secrets Manager. Zenity responsibly disclosed the findings to AWS starting in December 2025, and AWS has since shipped fixes — though the two sides still disagree on whether this counts as a vulnerability.

**Key facts**

| Field | Value |
|---|---|
| Attack type | Prompt injection–driven SSRF + privilege escalation (cross-agent lateral movement) |
| Scope | AI agents deployed on AWS Bedrock AgentCore with default settings prior to September 2026 |
| Severity | High |
| CVE | None (AWS closed the disclosure as "informative," treating it as documented, expected behavior) |
| Sources | [Zenity Labs original research](https://labs.zenity.io/post/agentcorruption-initial-imds-access), [Dark Reading](https://www.darkreading.com/cloud-security/agentcorruption-aws-environments-at-risk-single-prompt), [cybersecuritynews.com](https://cybersecuritynews.com/agentcorruption-attack/), [BusinessWire](https://www.businesswire.com/news/home/20261008316155/en/Zenity-Labs-Discloses-AgentCorruption-a-Chain-of-AWS-AgentCore-Flaws-That-Allowed-One-Prompt-to-Take-Over-All-AgentCore-Agents-Within-an-AWS-Account-and-Region) |

## Attack surface

The first step is a textbook cloud SSRF, just triggered in plain language instead of a crafted HTTP request. Every AgentCore agent runs inside its own Firecracker microVM. Zenity deployed a demo agent using the open-source Strands SDK with only an `http_request` (or `shell`) tool attached, and simply asked it in natural language to fetch the metadata endpoint. The microVM placed no restriction on that outbound traffic, and the agent dutifully relayed the response back. Walking the IAM path, the metadata service handed over the execution role's temporary AWS credentials (access key, secret key, session token) with no further interaction needed — Zenity exported them to their own machine and confirmed they could call the official AWS API directly, as that agent's identity.

What turned a single compromise into a region-wide breach was the design of AgentCore's default execution role. Its `logs:DescribeLogGroups` permission lists every agent name and ID in the same account and region, while a wildcarded `ECRImageAccess` permission can pull **any** agent's container image — because AgentCore names each image repository `bedrock-agentcore-<agent_name>`, giving an attacker who holds the role a way to bulk-pull every agent's source code in the region within seconds. The role also carries `bedrock-agentcore:InvokeAgentRuntime`, `GetResourceApiKey`, and `secretsmanager:GetSecretValue`, letting an attacker actively invoke other agents, read private session conversations, plant poisoned long-term memories that quietly redirect a victim agent's goals in later conversations, and exfiltrate API keys and secrets that reach well beyond AWS itself. Mapped to the OWASP LLM Top 10, the entry point is **LLM01 Prompt Injection** — natural language is enough to make the agent issue the network request an attacker wants — while the blast radius comes from **LLM06 Excessive Agency**: an agent meant to serve one narrow purpose ships with a default role holding read/write/delete access across the entire region.

## Defense

**Immediate**
- Audit your AgentCore agents' execution roles and strip any wildcard (`*`) resource scopes, especially `ECRImageAccess`, `bedrock-agentcore:InvokeAgentRuntime`, and `secretsmanager:GetSecretValue` — the permissions that enable cross-agent access
- Confirm your agent runtimes are forced onto IMDSv2 (AWS defaulted newly deployed agents to IMDSv2-only starting February 14, 2026, but existing deployments need manual verification)
- For any agent with an `http_request`/`shell`/outbound network tool, block egress to `169.254.169.254` at the network layer — don't rely on the prompt alone

**Longer term**
- Give each agent its own least-privilege execution role instead of reusing AgentCore's shared default role — that reuse is the single reason this attack scaled from one agent to an entire region
- Keep public-facing agents and internally trusted agents on separate deployments with separate roles, rather than sharing one AWS account/region's credential boundary
- Adopt runtime agent-protection tooling from watchlist B7 vendors like **Zenity** and **Invariant Labs** to continuously monitor tool calls and session behavior, not just review access once before deployment
- Build CloudTrail/CloudWatch alerts for anomalous `bedrock-agentcore:*` call patterns, such as one source enumerating a large number of agent IDs in a short window

## Impact

Zenity disclosed the IMDS access issue to AWS on December 25, 2025, and followed up with a report on the over-permissive default role on January 12, 2026. AWS moved newly deployed agents to IMDSv2 in February and tightened the default role's permissions by September 29, 2026; Zenity confirmed the fixes landed. AWS's official position, however, is that an agent accessing its own execution role's credentials via the metadata service is "documented and expected behavior," and that cross-account access requires explicit permission grants on both sides — in other words, AWS doesn't consider this a CVE-worthy vulnerability so much as a configuration problem customers should tighten themselves. Zenity's researchers say they have no evidence this chain was exploited in the wild before the fix, though they note AgentCore has benefited from a degree of "security through obscurity" simply because it's hard to tell from outside which organizations run agents on it — and the lead researcher says he's "100% sure there are ways to do it." Zenity is now examining whether the same IMDS weakness shows up on other cloud platforms. If your team runs public-facing agents on AgentCore — or any cloud agent platform that gives agents their own network or shell tools — this incident is a reminder that pre-deployment role design and continuous post-deployment auditing matter equally: default settings will always lag behind an attacker's curiosity.

## Takeaway

The most interesting part of this incident isn't the SSRF itself — that lesson should have been learned from the 2019 Capital One breach. It's that moving the trigger into natural language scrambles the usual defensive instinct: teams tend to ask whether an agent can be tricked into doing something bad, and forget to first ask how much power that agent's cloud identity actually holds. Prompt injection is just the key here; the broken lock is the IAM design. Defending an agent like a chatbot while running it with a cloud workload's permissions — that gap between the two mental models is the entire attack surface.

## References

- [Zenity Labs - AgentCorruption: Initial IMDS Access](https://labs.zenity.io/post/agentcorruption-initial-imds-access)
- [Dark Reading - 'AgentCorruption' Puts AWS Environments at Risk With Single Prompt](https://www.darkreading.com/cloud-security/agentcorruption-aws-environments-at-risk-single-prompt)
- [cybersecuritynews.com - One Prompt Could Hijack AWS AI Agents and Steal Cloud Credentials](https://cybersecuritynews.com/agentcorruption-attack/)
- [BusinessWire - Zenity Labs Discloses AgentCorruption](https://www.businesswire.com/news/home/20261008316155/en/Zenity-Labs-Discloses-AgentCorruption-a-Chain-of-AWS-AgentCore-Flaws-That-Allowed-One-Prompt-to-Take-Over-All-AgentCore-Agents-Within-an-AWS-Account-and-Region)
- [AWS - Credentials management in AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-credentials-management.html)
