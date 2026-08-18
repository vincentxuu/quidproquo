---
title: "AI Agents Broke Into a Government With Nothing but Old Problems: Fact-Checking a Report, and Finding Two Holes on My Own Site"
date: 2026-08-18
category: ai
type: deep-dive
tags: [security, ai-agent, agent-skills, openclaw, hermes-agent, llm]
lang: en
tldr: "Between 1 and 4 July 2026, a multi-agent framework running on Hermes and OpenClaw launched 12 attack waves against Taiwan's government and cracked 85 credentials. Not one 0-day in the entire chain — just unauthenticated APIs, debug backdoors left in production, and `alg: none`. Running the same checklist against my own site turned up two."
description: "Unpacking Dream's report on an AI agent attack: how the two-layer Bayesian decision engine works, which two citations in the report don't survive checking, why godmode ships in Hermes's official repo, and what auditing my own API endpoints against the same checklist found."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-ai-agent-attack-old-vulnerabilities)

In mid-August, the *Financial Times* cited a report from Israeli security firm [Dream](https://dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia) describing a multi-agent AI attack framework that ran 12 intrusion waves against an Asian government between 1 and 4 July 2026, producing 1,395 files and cracking 85 credentials in four days. Taiwan's Administration for Cyber Security [subsequently confirmed](https://moda.gov.tw/ACS/press/news/press/20394) that Taiwan was attacked in July. This post doesn't retell the news. It reads five primary reports side by side to see what they actually teach — and then runs the same checklist against my own site.

## Four days, 12 waves, and not one 0-day

Dream's attack chain starts at an Angular-based government portal, decompiles its JavaScript bundle to extract API endpoints, OAuth client IDs and Keycloak configuration objects, and from there maps 21 connected systems and 6 SSO sub-realms:

```
Government portal (Angular)
  └─ Decompile JS bundle → API endpoints / OAuth client IDs / Keycloak config
       ├─ Map 21 connected systems, 6 SSO sub-realms, 36+ API endpoints
       ├─ Three debug backdoor endpoints (any request body → valid session)
       ├─ Password spraying (employee-ID variants + Tesseract OCR on CAPTCHA) → 85
       └─ JWT alg: none → forge identity without the signing key
            └─ SSO bridge endpoints trust unconditionally → 84/85 reach internal systems
```

It's worth pausing on what fills each box: unauthenticated API endpoints (one of which exports the entire user database without a login), developer debug backdoors left in production, JWTs accepting `alg: none`, passwords derived from employee IDs, and SSO endpoints that trust unconditionally. **None of it is new technology.**

Anthropic reached the same verdict in its [full GTG-1002 report](https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf):

> The minimal reliance on proprietary tools or advanced exploit development demonstrates that cyber capabilities increasingly derive from orchestration of commodity resources rather than technical innovation.

One detail nearly every write-up skipped: the framework did upload a web shell, but a second layer of Forms Authentication blocked execution — **no remote code execution**. In Palo Alto [Unit 42's 30 July report](https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign) on a different operator, the autonomous phase failed outright: the Langflow chain died because the target had no `auto_login`, the n8n chain because the form endpoints required authentication. Unit 42's conclusion is blunt: "Targets with weaker default configurations would have been susceptible."

What stopped these attacks wasn't an AI defence product. It was one correctly configured layer of ordinary authentication.

## Bayesian prioritisation: the genuinely new part

If anything here is new, it's that **prioritisation got written down as a formula**. The hardest part of red teaming to automate has always been deciding what to hit first, and what Dream recovered from the workspace is a two-layer Bayesian model.

The first layer scores individual findings. Every vulnerability starts at an uninformative prior of P = 0.50 and updates on explicit likelihood ratios: a positive tool scan gives LR+ = 6.0, a manual `curl` confirmation LR+ = 10.0, the presence of a WAF LR− = 0.30. A posterior above 0.95 gets promoted to an attack chain; below 0.30 it is discarded.

The second layer scores whole paths:

```
P_success = P_chain × (1 - P_blocker)
P_chain   = confirmed steps / total steps
```

The SSO lateral-movement chain rated at 99% was assembled from three separately confirmed findings (an unauthenticated user list, a successful password spray, and SSO token acquisition), giving P_chain = 3/3 = 1.0, with the only theoretical blocker — the target going offline — at roughly 0.01. **The measured outcome was 84 of 85, or 98.8%, almost exactly as predicted.**

The more transferable part is how it handles hallucination. Anthropic's assessment of GTG-1002 was that Claude "frequently overstated findings and occasionally fabricated data", claiming credentials that didn't work, and that this "remains an obstacle to fully autonomous cyberattacks". The framework in the Taiwan case annotated its final report with `8个真实漏洞(物理确权+3+3交叉验证)`: every conclusion had to survive the discovering agent's verification plus two further rounds of three independent agent re-checks — six retests before it counted. The 12-wave summary lists 7 false positives it caught itself. The best of them: a 21-second delay read as a successful `SLEEP(5)` injection, which on retest turned out to be an SMTP timeout while the server sent a verification email.

This is an eval harness written by an attacker, and it works. Anyone building an agent pipeline is fighting the same problem.

## Two citations in the report don't survive checking

This report was carried by the *Financial Times*, The Register, CyberScoop and Taiwan's CNA. It contains exactly two externally verifiable citations. Both have problems.

**One: the cost comparison cites the wrong metric.** Dream writes, "On AISI's cyber range, a solved task runs $12.50 on a leading commercial model against $0.28 on an open Chinese one." Going back to [the UK AISI original](https://www.aisi.gov.uk/blog/how-far-behind-the-frontier-are-leading-open-weight-models-on-cyber):

> Opus 4.6 cost $15.17 per task versus GLM-5.2's $6.12, and Opus 4.5 cost $12.50 per task versus DeepSeek V4-Pro's $0.28.

Those figures come from narrow cyber tasks, not the cyber range; the cyber range numbers are $85 against $1.19. And that "leading commercial model" is Opus 4.5, released in November 2025 — the actual frontier comparison in the same table differs by only 2.5×.

**Two: citing the Kimi K3 assessment while dropping its headline finding.** Dream says government evaluators found Kimi K3's protections did nothing to prevent exploit development. That half is accurate. But the main conclusion of [that joint UK/US assessment](https://www.aisi.gov.uk/blog/preliminary-assessment-of-kimi-k3s-cyber-capabilities) is that Kimi K3 performs "significantly below" frontier models: arbitrary code execution on 0 of 41 tasks against an average of 20 of 41 for the most capable models, and an average of step 17 out of 32 on the simulated network attack against 28.5 for the leading US models. The report also notes that US closed models were tested **with system-level safeguards disabled**, which undercuts "open weights have weaker guardrails" as a distinguishing point.

Separately, Dream's blog claims it "achieved confirmed, real-world compromises", while a Dream spokesperson [told CSO Online](https://www.csoonline.com/article/4209210/ai-agents-wage-near-autonomous-cyberattack-on-asian-government-networks.html) that "its research did not find evidence of a confirmed breach of the entity's systems". Taiwan's Administration for Cyber Security confirmed the incident but endorsed none of the numbers.

None of this means Dream fabricated anything — the first-hand observations are its own data. But it does mean this: **from the FT down to CNA, not one outlet opened the things it cited.**

## godmode ships in Hermes's official repo

Dream describes these agent frameworks as "innocuous ones never built for offensive work".

This site [introduced Hermes Agent back in April](/posts/ai/2026-04-05-hermes-agent-intro) without looking at what is in its skills catalogue. It turns out [`godmode`](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-godmode) lives at `optional-skills/security/godmode` in the official repo, installs with `hermes skills install official/security/godmode`, is credited to "Hermes Agent + Teknium" (Teknium co-founded Nous Research), and describes itself without euphemism: "Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN." Its content is a table of jailbreak strategies ordered by model family, covering Claude, GPT, Gemini, Grok, DeepSeek and Qwen. Per the [official trust-level table](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), anything under `optional-skills/` counts as `official` and carries "built-in trust, no third-party warning". The same `security` category also holds `obliteratus` (strips refusal behaviour by modifying weights) and `web-pentest`.

The fair description isn't "Hermes is an attack tool", nor "an innocent tool was misused". It's that **it is both, and it doesn't pretend otherwise.** The contrast is the Unit 42 case: OpenAI's provider-side safeguards refused the requests and disabled the account, while the DeepSeek-plus-open-framework path had no account for anyone to disable.

For anyone running agents, that raises a concrete question: what default trust ships with the things you `install`?

## Auditing my own site: two unguarded endpoints

Running that checklist against this site's API surface (Astro SSR on Cloudflare Workers, 105 routes) turned up two of the same class of problem. Both are fixed.

**One: an unauthenticated database write.** `/api/posts` had a `POST` with no authentication that ran `INSERT ... ON CONFLICT DO UPDATE` straight against D1 — anyone could overwrite any post. More precisely: it had **no callers at all** (`pnpm sync` goes through a separate script), yet the `posts` table is read by the public `/api/search` and `/api/related-posts` endpoints and by the RAG `get-post-detail` tool. So it was simultaneously a path for injecting arbitrary content into reader-facing surfaces and into LLM context. Removed.

The first item on the list in ["The AI security epidemic is spreading"](https://www.nics.nat.gov.tw/latest_news/announcements/Latest_Announcement/f1633355-6ee2-40ba-90f1-5e1de65acbf1/) by Kung Hua-chung, president of Taiwan's National Institute of Cyber Security, is "network services opened temporarily and then forgotten". That was on my site, literally.

**Two: login never wired up the rate limiter that already existed.** `src/lib/auth/rate-limit.ts` was already there, already tested, and already used by `/api/search` and `/api/chat` — but not by `/api/auth/login`. Login is a single shared password with no accounts to enumerate and no lockout, guarding 90 admin routes. Password spraying wouldn't even need the enumeration step. Now rate-limited per source IP per day, with a constant-time password comparison.

One process lesson too: my first pass used `grep` to find routes with no guard and flagged three. Reading them showed all three were false positives — they use a different `scheduled-auth` mechanism. **grep gives you candidates, not conclusions.**

## The takeaway

Three layers:

1. **AI doesn't create new holes.** It invalidates the assumption that nobody will notice. The most quotable line in the government's confirmation is that attackers used "backup and test systems as stepping stones".
2. **What currently stops autonomous attacks is still the basics.** Authenticate your endpoints, don't ship permissive defaults, don't derive passwords from employee IDs. Unit 42's autonomous phase failed on exactly this.
3. **But the buffer has an expiry date.** AISI measured open-weight models trailing the closed frontier by 4 to 7 months — **narrowed** from 6 to 10 months through 2025. The right investment isn't "AI versus AI"; it's clearing out the "nobody will find this" items before that window closes.

As a footnote, here is how the Unit 42 operation was exposed: the attacker's Hermes agent, given an instruction, started `python3 -m http.server 8888` in the home directory rather than an isolated staging directory, publishing API keys, exploit scripts and target lists to the open internet. Unit 42's comment:

> The same autonomous capability the actor developed for offensive use directly caused the exposure of the operation.

Autonomy scales more than the attack.

## References

- [Dream — Inside a Multi-Agent AI Framework Used to Compromise Government Entities in Asia](https://dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia)
- [Dream — Governments Are Not Ready for Autonomous AI Attacks](https://dreamgroup.com/blog/governments-are-not-ready-for-autonomous-ai-attacks)
- [Unit 42 — Chinese-Speaking Threat Actor Harnesses AI Models for Autonomous Cyberattacks](https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign)
- [Anthropic — Disrupting the first reported AI-orchestrated cyber espionage campaign (full report PDF)](https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf)
- [UK AISI — How Far Behind the Frontier are Leading Open Weight Models on Cyber?](https://www.aisi.gov.uk/blog/how-far-behind-the-frontier-are-leading-open-weight-models-on-cyber)
- [UK AISI / CAISI — Preliminary Assessment of Kimi K3's Cyber Capabilities](https://www.aisi.gov.uk/blog/preliminary-assessment-of-kimi-k3s-cyber-capabilities)
- [Administration for Cyber Security, Ministry of Digital Affairs — press release on the AI agent attack](https://moda.gov.tw/ACS/press/news/press/20394) (in Chinese)
- [National Institute of Cyber Security — The AI security epidemic is spreading: how should agencies and businesses respond?](https://www.nics.nat.gov.tw/latest_news/announcements/Latest_Announcement/f1633355-6ee2-40ba-90f1-5e1de65acbf1/) (in Chinese)
- [iThome — interview with TeamT5 CEO Tsai Sung-ting](https://www.ithome.com.tw/news/178135) (in Chinese)
- [CSO Online — AI agents wage near-autonomous cyberattack on Asian government networks](https://www.csoonline.com/article/4209210/ai-agents-wage-near-autonomous-cyberattack-on-asian-government-networks.html)
- [Hermes Agent — godmode skill documentation](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-godmode)
- [Hermes Agent — Skills System trust levels](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Agent: Nous Research's Self-Improving AI Agent](/posts/ai/2026-04-05-hermes-agent-intro-en)
- [Security: prompt injection can only be damage-controlled at the harness layer](/posts/ai/2026-08-10-agent-security-harness-layer-en)
