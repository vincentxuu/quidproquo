---
title: "AI Agent Weekly Review — 2026-09-25"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: en
description: "This week's biggest shift in thinking: what actually blocks an agent from overstepping was never human review, a model's own judgment, or a cancel button — it's a deterministic check at the moment a tool is called. Two real breaches and three papers proved it from opposite directions."
tldr: "OpenAI shipped GPT-6 Sol/Luna about an hour after Anthropic's Opus 5.5 launch; Grok 4.7 scored 38% on its own Terminal-Bench 4.0 run versus 26% on independent re-testing — frontier labs are now shipping same-day counter-launches. Anthropic, OpenAI, SpaceXAI, and Google were named together in an antitrust suit for the first time. AWS AgentCore, MaxKB (CVSS 10.0), and a MemTensor MemOS supply-chain attack, plus three papers on Loopjacking, APort Vault, and authorization revocation, all converge on one point: review, model judgment, and cancellation are not real verification. Ema, Chamelio, Firecrawl, and Enhans raised over $200M combined in a single week, betting that agents will take over work enterprises used to outsource."
series:
  name: "AI Agent Weekly Review"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-09-25-weekly-review)

## The 5 things that mattered most this week

### 1. Anthropic and OpenAI shipped models an hour apart; Grok 4.7's self-reported score diverges sharply from independent re-testing

Anthropic launched Claude Opus 5.5 on September 22, matching Claude Fable 5.1's performance at 40% lower cost. About an hour later, OpenAI put GPT-6 Sol and GPT-6 Luna live on AWS Bedrock. Frontier model releases are now compressed into same-day counter-launches. Earlier in the week, xAI shipped Grok 4.7, claiming its Terminal-Bench 4.0 score jumped from 20.3% to 38.0% — but Artificial Analysis's independent re-test put it at just 26%, a 12-point gap. Together these three events say two things: the pricing war among frontier labs has entered a phase where releases directly counter each other, and the gap between vendor self-reported benchmarks and independent re-testing is becoming the norm rather than the exception. Model selection can no longer rely on a vendor's own release-day numbers. ([Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5) · [Full writeup](/en/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5-en) · [GPT-6 Sol/Luna on AWS Bedrock](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/) · [Grok 4.7 benchmark gap](https://the-decoder.com/xai-launches-grok-4-7-at-bargain-prices-but-benchmarks-reveal-a-wide-gap-to-claude-and-gpt-6/) · [Full writeup](/en/posts/daily/2026-09-23-model-xai-grok-4-7-en))

### 2. Anthropic, OpenAI, SpaceXAI, and Google named together in an antitrust suit for the first time

A new antitrust lawsuit accuses the four labs of illegally coordinating to slow down their own AI development — the first time all four have appeared as co-defendants in the same case. Past antitrust scrutiny of major AI labs tended to focus on individual companies' data licensing or market-dominance behavior. This suit instead treats "coordinated slowdown across four labs" as a single allegation, suggesting regulators (or at least plaintiffs' attorneys) are starting to view frontier AI as a market that needs to be examined as a whole for coordinated conduct, not four independent companies. For any agent developer relying on these four APIs, this is a regulatory risk worth tracking even if it has no near-term effect on service availability. ([Reporting on the lawsuit](https://apnews.com/article/antitrust-lawsuit-ai-slowdown-anthropic-openai-spacexai-google-960af4308161eaf4ed13c383b0ce1c1b))

### 3. AWS AgentCore, MaxKB, and MemTensor MemOS — three real incidents plus three papers all prove "review" is not "verification"

This week's most complete thread spans both real-world breaches and academic research. On the incident side: Unit 42 disclosed that AWS AgentCore Harness's default configuration runs its built-in shell tool as root, sharing memory space with the harness's main process — letting prompt injection read plaintext credentials decrypted from the Identity vault. MaxKB automatically grants any assistant that attaches a tool an unapproved, root-level shell tool, earning a maximum CVSS score of 10.0. MemTensor's memory framework MemOS suffered a supply-chain attack: compromised npm and PyPI packages quietly exfiltrated user prompts through a credential stealer every time an agent started up or recalled memory. On the research side: Loopjacking reproduced a failure mode — a human approves operation A, but the system executes operation B — across three real products (Agno AgentOS, LangGraph Agent Server, OpenClaw). APort Vault ran 226,000 evaluations to show that what actually stops an agent from making rogue transfers is a deterministic policy layer before the tool call, not a smarter model. Authorization Revocation used formal proofs to show that "cancellation" may not actually end an agent's authorization once delegation and asynchronous execution are involved. All six converge on the same engineering conclusion: what actually stops risk has to be a deterministic check at the moment a tool is called — not pre-execution review, a model's own judgment, or a cancel action after the fact. ([AWS AgentCore writeup](/en/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration-en) · [Unit 42 report](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/) · [MaxKB writeup](/en/posts/daily/2026-09-23-security-maxkb-agent-shell-rce-en) · [GHSA-f36j-f34j-h3rx](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx) · [MemOS supply-chain writeup](/en/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain-en) · [The Hacker News report](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html) · [Loopjacking](https://arxiv.org/abs/2609.21081) · [APort Vault](https://arxiv.org/abs/2609.22076) · [Authorization Revocation](https://arxiv.org/abs/2609.21284))

### 4. Meta Connect 2026: Muse gets an email address and Mac control — personal agents start acquiring real action capability

At Meta Connect 2026, the personal AI agent Muse gained a real-time video avatar, its own email address, and Mac control, with plans to reach smart glasses in the coming months. The event also unveiled $1,299 VR Glasses and the first Ray-Ban Meta Audio glasses. Unlike most "personal assistant agents" from other vendors, which have mostly stayed at the conversation-and-scheduling level, Muse just picked up two concrete action capabilities: an email account of its own and the ability to operate a desktop OS. Consumer-facing personal agents are moving toward the kind of executable-action capability that's typically been an enterprise-agent concern — which means the same authorization and audit problems described above are likely to spread from enterprise settings into consumer products soon. ([Meta Connect 2026 coverage](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/))

### 5. Ema, Chamelio, Firecrawl, and Enhans raised over $200M combined in one week — capital is betting agents will take over enterprise budgets

Four enterprise-agent funding rounds landed in the same week: Ema closed a $77M Series B (AI employees taking over work enterprises used to outsource to SaaS and IT service providers); Chamelio closed a $26M Series A just 5 months after its seed round, with ARR up 4x, as AI agents take over legal contract review; Firecrawl closed a $75M Series B and simultaneously launched Alexandria, a paid knowledge platform — upgrading from "a web-scraping tool" to "an agent's knowledge supply chain"; and Enhans closed a $38M Series C, with investment arms of three major Korean conglomerates — POSCO, LG, and Lotte — backing the same agent startup as strategic customer-investors for the first time. The shared signal across all four: capital is no longer treating enterprise agent adoption as a proof-of-concept bet. It's betting directly that agents will take over work that used to require paying people, law firms, or SaaS subscriptions — in other words, agents are now competing for enterprises' existing operating budgets, not experimental ones. ([Ema](https://techcrunch.com/2026/09/23/ema-raises-77m-as-ai-starts-eating-into-enterprise-software-and-services/) · [Full writeup](/en/posts/daily/2026-09-25-funding-ema-en) · [Chamelio](https://www.prnewswire.com/news-releases/chamelio-raises-26m-series-a-to-replace-legacy-clm-with-ai-native-in-house-legal-operations-302886011.html) · [Full writeup](/en/posts/daily/2026-09-25-funding-chamelio-en) · [Firecrawl](https://www.firecrawl.dev/blog/introducing-alexandria-series-b) · [Full writeup](/en/posts/daily/2026-09-25-funding-firecrawl-en) · [Enhans](https://www.einnews.com/pr_news/942627211/enhans-raises-38-million-in-series-c-funding-to-advance-its-ai-native-enterprise-operating-system) · [Full writeup](/en/posts/daily/2026-09-21-funding-enhans-en))

## Updated thinking this week

- I used to think human review, a model's own judgment, and a cancel button each independently stopped an agent from overstepping. Now I know all three are just pre-execution statements of intent, not verification at execution time. AWS AgentCore and MaxKB prove this at the code level with real breaches; Loopjacking, APort Vault, and Authorization Revocation prove the same conclusion from three angles — real-product reproduction, 226,000-run evaluation, and formal proof: what actually stops risk is a deterministic policy layer at the moment a tool is called.
- I used to think frontier labs' self-reported benchmark scores were roughly trustworthy. Seeing Grok 4.7's official Terminal-Bench 4.0 score jump from 20.3% to 38.0% while Artificial Analysis's independent re-test came in at just 26% — a 12-point gap — I now know the divergence between self-reported and independently verified scores has grown too large to ignore. Model selection should prioritize independent evaluations over vendor release notes.
- I used to think the technical bottleneck in agent memory systems was what to store and how much. This week, JitMem showed that deferring memory curation until read time (rather than write time) beats the strongest baseline by up to 16.3 percentage points in success rate, and CliffCompaction showed that a "delete only, never re-summarize" strategy cuts cost by up to 50%. Now I know the real bottleneck is when the decision gets made — moving the same decisions from write time to read time squeezes out double-digit performance gains without a better model or more data.
- I used to think enterprise agent adoption was still in a proof-of-concept phase, with companies each testing the waters at their own pace. Putting Ema, Chamelio, Firecrawl, and Enhans's combined $200M+ raise in one place, I now know capital has already priced in "agents directly taking over work enterprises used to outsource" as an established trend, not something still waiting on validation.

## Enterprise adoption watch

I think the most instructive case this week is the shared logic behind the Ema and Chamelio rounds — AI agents aren't "helping out" here, they're directly replacing an entire outsourced service relationship.

Through a transaction-cost lens: enterprises have historically outsourced legal contract review or IT operations to law firms or SaaS/service vendors because the coordination and oversight cost of building that capability in-house was too high — buying externally beat building internally. Chamelio's bet is that once an AI agent can autonomously handle review and execution within a well-defined domain like "legal action," the transaction costs a company used to spend on vetting vendors, integrating contract workflows, and supervising execution quality can be compressed into a one-time agent-adoption cost. Ema's bet follows the same logic, just extended from legal work to IT services broadly. In other words, neither company is betting that "AI is cheaper than people" — they're betting that agents let enterprises re-internalize coordination costs that used to require outsourcing.

For smaller service providers everywhere: if your revenue comes from this kind of "well-defined process, decomposable into rules plus judgment" service work — contract review, accounting workflows, IT operations — this funding wave isn't a distant threat. Your clients are being actively persuaded that this work no longer needs to be outsourced. Rather than copying Silicon Valley's playbook of switching directly to a fully autonomous agent, a more realistic path in markets with thinner legal precedent or more complex cross-border compliance requirements is to repackage your service as an "agent plus human review" hybrid — before a general-purpose agent platform takes the whole account.

## Worth watching next week

- StepFun's Step 5 open weights are due around 2026-10-15, which will let the community independently verify its claimed Artificial Analysis Intelligence Index score of 44 — a test especially relevant given this week's Grok 4.7 gap between self-reported and independently verified numbers
- MaxKB's CVE-2026-77521 (CVSS 10.0) was patched in v2.10.5-lts with no confirmed exploitation so far — worth watching for evidence of real-world attacks
- Whether Ema and Chamelio's new funding translates into named customers or a concrete product roadmap, which would validate whether "agents taking over outsourced enterprise work" is actually shipping, not just a narrative

## Watchlist update suggestions

### 🆕 Suggested additions

✅ Every company that appeared in this week's signals is already on the watchlist — no additions meet the bar (the threshold is "not on the watchlist and appearing ≥ 3 times in this week's signals"; most of this week's startup funding signals came from standalone funding briefs rather than repeated signal exposure, so they didn't clear that bar and are listed below under "Startups to watch" instead)

### ⚠️ Considered for removal

✅ No company met the removal criteria this week

## Startups to watch this week

| Company | What it does | Funding | Why it matters |
|---|---|---|---|
| Ema | "AI employee" enterprise agent orchestration platform | Series B $77M (total $140M) | Valuation more than 4x'd since its 2024 round; directly competing with SaaS and IT service providers for enterprise budget |
| Chamelio | AI agent-driven contract management, replacing legal teams | Series A $26M (total $36M) | Just 5 months after seed, ARR up 4x; betting in-house legal teams will outsource contract review to agents |
| Firecrawl | Web data extraction API, plus new paid knowledge platform Alexandria | Series B $75M (total over $95M) | Upgrading from "a web-scraping tool" to "an agent's knowledge supply chain," paying humans for knowledge to resell to agents |
| Enhans | Korean enterprise agent operating system (AgentOS) | Series C $38M (total $60M) | Investment arms of POSCO, LG, and Lotte backed the same agent startup as strategic customer-investors for the first time |

## What I learned this week

This week's biggest update: what actually stops an agent from overstepping was never "one more layer of review" or "letting the model judge for itself" — it's a deterministic check, independent of the model, at the exact moment a tool is called. AWS AgentCore and MaxKB (real breaches) plus Loopjacking, APort Vault, and Authorization Revocation (research) reached the same conclusion from three completely different angles — real products, large-scale evaluation, and formal proof — and that kind of convergence across independent evidence sources matters more than any single incident. The practical takeaway for teams building or adopting agents: the right audit question isn't "is there human review," it's "at the exact moment a tool actually gets called, is there a rule in place that can't be talked out of its job by a prompt." That same line is also the precondition behind this week's funding wave (Ema, Chamelio) being willing to hand over an entire service workflow to an agent — without that deterministic layer, what gets handed over isn't efficiency, it's risk.

## References

- [Anthropic — Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)
- [Full writeup: Claude Opus 5.5](/en/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5-en)
- [AWS — Bring more intelligence to everyday work with GPT-6 Sol and GPT-6 Luna on Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/)
- [The Decoder — xAI launches Grok 4.7 at bargain prices, but benchmarks reveal a wide gap to Claude and GPT-6](https://the-decoder.com/xai-launches-grok-4-7-at-bargain-prices-but-benchmarks-reveal-a-wide-gap-to-claude-and-gpt-6/)
- [Full writeup: Grok 4.7](/en/posts/daily/2026-09-23-model-xai-grok-4-7-en)
- [AP News — Antitrust lawsuit filed against Anthropic, OpenAI, SpaceXAI and Google over alleged coordinated AI slowdown](https://apnews.com/article/antitrust-lawsuit-ai-slowdown-anthropic-openai-spacexai-google-960af4308161eaf4ed13c383b0ce1c1b)
- [Unit 42 — A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/)
- [Full writeup: AWS AgentCore](/en/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration-en)
- [GitHub Security Advisory GHSA-f36j-f34j-h3rx — MaxKB](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx)
- [Full writeup: MaxKB](/en/posts/daily/2026-09-23-security-maxkb-agent-shell-rce-en)
- [The Hacker News — Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html)
- [Full writeup: MemTensor MemOS supply-chain attack](/en/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain-en)
- [Loopjacking: Hijacking Human-in-the-Loop Approval](https://arxiv.org/abs/2609.21081)
- [APort Vault](https://arxiv.org/abs/2609.22076)
- [Authorization Revocation](https://arxiv.org/abs/2609.21284)
- [JitMem](https://arxiv.org/abs/2609.27334)
- [CliffCompaction](https://arxiv.org/abs/2609.26779)
- [Meta Newsroom — Introducing Ray-Ban Meta Audio Glasses, new styles, plus Muse](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/)
- [TechCrunch — Ema raises $77M as AI starts eating into enterprise software and services](https://techcrunch.com/2026/09/23/ema-raises-77m-as-ai-starts-eating-into-enterprise-software-and-services/)
- [Full writeup: Ema](/en/posts/daily/2026-09-25-funding-ema-en)
- [PR Newswire — Chamelio Raises $26M Series A to Replace Legacy CLM with AI-Native In-House Legal Operations](https://www.prnewswire.com/news-releases/chamelio-raises-26m-series-a-to-replace-legacy-clm-with-ai-native-in-house-legal-operations-302886011.html)
- [Full writeup: Chamelio](/en/posts/daily/2026-09-25-funding-chamelio-en)
- [Firecrawl — Introducing Alexandria and our $75M Series B](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)
- [Full writeup: Firecrawl](/en/posts/daily/2026-09-25-funding-firecrawl-en)
- [Enhans Raises $38 Million in Series C Funding to Advance Its AI-Native Enterprise Operating System](https://www.einnews.com/pr_news/942627211/enhans-raises-38-million-in-series-c-funding-to-advance-its-ai-native-enterprise-operating-system)
- [Full writeup: Enhans](/en/posts/daily/2026-09-21-funding-enhans-en)
