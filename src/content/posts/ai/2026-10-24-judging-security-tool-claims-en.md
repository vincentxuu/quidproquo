---
title: "How to Judge a Security Tool's Claims: OWASP Lists, Benchmarks and a Checklist for 'Merged into a Big Vendor'"
date: 2026-10-24
category: ai
type: guide
tags: [security, ai-agent, owasp, benchmark, source-evaluation]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 8
tldr: "When you see 'covers OWASP 10 of 10', 'merged into Microsoft and Cisco' or '9X% detection', ask five things: who said it, what the term means, who set the questions, what is being measured, and where the primary source is. The seven earlier posts each happen to show one: Microsoft's toolkit itself says 7 full and 3 partial; ATR's merged PRs were all opened by its author; Cisco's own detection rate and an independent study's differ several-fold; common benchmarks score models or agents, not tools."
description: "Using the OWASP Agentic Top 10 and LLM Top 10 2026 as shared vocabulary, this post separates standards, tools and benchmarks and walks through a five-question checklist, with examples from the earlier posts, for taking apart claims of coverage, merging and detection rate."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-judging-security-tool-claims)

This is the last post in the series and introduces no new tool. Every kind of tool in the first seven posts came with numbers and claims; this one turns the questions I used to take them apart into a checklist, after setting out the vocabulary they share.

## Two list names first

Security tool READMEs often carry labels like `ASI03` or `LLM01:2026`. They come from two OWASP lists. A list is vocabulary, not a tool and not a test: it tells you what a risk is called, not how much any tool catches.

**OWASP Top 10 for Agentic Applications (published December 2025), for agents that act on their own:**

| ID | Name |
|---|---|
| ASI01 | Agent Goal Hijack |
| ASI02 | Tool Misuse & Exploitation |
| ASI03 | Identity & Privilege Abuse |
| ASI04 | Agentic Supply Chain Vulnerabilities |
| ASI05 | Unexpected Code Execution (RCE) |
| ASI06 | Memory & Context Poisoning |
| ASI07 | Insecure Inter-Agent Communication |
| ASI08 | Cascading Failures |
| ASI09 | Human-Agent Trust Exploitation |
| ASI10 | Rogue Agents |

The official list has only ASI01 to ASI10. If a tool shows ASI16, I could find no official source for it.

**OWASP Top 10 for LLM Applications 2026 (v1.0, published August 2026), for applications that use a model as a component.** Per the PDF's table of contents: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Excessive Agency, LLM04 Supply Chain, LLM05 Data and Model Poisoning, LLM06 Unbounded Consumption, LLM07 Misinformation, LLM08 Hidden Context Exposure, LLM09 Vector and Embedding Weaknesses, LLM10 Improper Output Handling. I read only that PDF's table of contents and the mapping appendix, not the text of each entry.

Read the ID together with its year: LLM03 in the 2025 edition is Supply Chain, and in 2026 it is Excessive Agency. An older article or tool that keeps the 2025 numbering makes the same ID point at a different risk.

The boundary between the lists is one the LLM list states itself: while a model is a component inside your application, the risk belongs to the LLM list; once the model becomes an actor, the risk moves to the Agentic list.

## Standard, tool and benchmark are three different things

| | What it is | Example | What it is not |
|---|---|---|---|
| List / standard | Vocabulary that names risks | The two OWASP Top 10s | Not a test; you cannot "pass" it |
| Tool | Code that detects or defends | Every tool in posts 1 to 7 | Not the same as the list items it says it covers |
| Benchmark | A set of questions plus a scoring method | AgentDojo, Agent Security Bench | Not the same as performance once deployed |

Many flawed claims blur the three: they use a list's name as a tool's feature, or a benchmark score as a tool's security.

## A five-question checklist

### 1. Who said it, and do they have a stake in what is said

- ATR's README says its rules were merged into Microsoft, Cisco and others. I checked each: the PRs were indeed merged, but all were opened by ATR's own author and merged by the maintainers of the other project. That shows the author submits actively, not that these companies treat it as a standard; Microsoft's toolkit itself says it takes no dependency on it and keeps it only in an examples directory.
- The AVE vulnerability database's governance file says it is currently maintained by a single vendor's founder, and its reference implementation is that vendor's own scanner.
- NVIDIA's SkillEvaluator gates NVIDIA's own skill catalogue with NVIDIA's own scanner; that is an internal process, not a benchmark of scanners.

A stake does not mean lying, but disclose it first, then see whether others can check it.

### 2. What does the term actually mean

- The repo description of Microsoft's Agent Governance Toolkit says it covers all 10 items of the OWASP Agentic Top 10; its own mapping document says 7 full and 3 partial, and notes that it is an internal self-assessment, not a certification ([post 3](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways-en)).
- "Merged" needs: who opened the PR, who merged it, and how the host project's README describes it.
- "Cisco's skill-scanner catches X%" needs: rules alone or with an LLM, and at what alert level it counts as caught ([post 1](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)).

### 3. Who set the questions, and what is the denominator

- Cisco's own measure of its rules (HIGH and above) is 7.7%; an independent study re-running the same split got 2.5%, with a confidence interval that excludes 7.7%. Both say static rules catch little, but the exact numbers cannot be quoted against each other.
- Cisco also says its rule pack was tuned on the development part of that dataset: about 31% on the development part against about 8% on sources never seen. So ask whether a detection rate was measured on the samples used in development or on strangers.
- ATR reports 92.3% on the garak dataset, but 130 of its rules were written from that dataset, and without them the rate falls to 65.4%. That is a limitation ATR itself publishes.
- Post 6's attack success rate has the same problem: the attacker model, the judge and the denominator must match first.

### 4. What is being measured

Frequently cited benchmarks mostly score models or agents, not scanners or guardrails:

- AgentDojo scores how well an agent (model plus pipeline) resists prompt injection. Defenses are put in as pipeline parts, with no independent detection recall. When the US NIST's CAISI used it, attacks tuned to a specific model lifted the attack success rate from 11% to 81%, so static attacks understate the risk.
- Agent Security Bench has false-positive and false-negative rates among its seven metrics, but uses them for only two detection-type defenses and only for memory poisoning.
- The independent studies I found that measure detection tools directly come in two kinds. One is MalSkillBench, about skills: it finds dedicated detectors with very high recall on code injection that collapse on prompt-injection and agent-control attacks, and scoring on wild samples alone shifts the ranking by up to 66 recall points. The other is a study of prompt-injection classifiers, which finds that rankings on one benchmark barely carry over to another; for example, the best detector on one dataset catches only 2% of AgentDojo's injections. I read the abstracts and parts of the text of these two.

So for "9X% detection", ask: on which samples, with how many false positives, and whether the samples and the tool were developed by the same people.

### 5. Where is the primary source

Go back to the text of the list, the paper, the host project's README and its PR history, not an explainer. Many of the third-party reports around this series' topics are in fact relaying one source (ARTEX and HexStrike in post 7 are the examples).

## Practice: run the earlier claims through it

| Claim | What to check | What turned up |
|---|---|---|
| "Covers OWASP 10 of 10" | The tool's own mapping document | 7 full, 3 partial, internal self-assessment |
| "Merged into Microsoft and Cisco" | Who opened the PR; the host README | The author opened the PRs; Microsoft says it does not depend on it |
| "Rules detect X%" | Who set the questions; which alert level | Own measure 7.7%, independent re-run 2.5% |
| "First on a benchmark" | What the benchmark measures | Mostly models, not tools |
| "Deployed in production" | Whether the open-source and internal versions are the same | ADR's open-source release lacks the blocking component |

## Self-check

Question: two reports both say "attack success rate 5%". Can they be compared directly? Answer: no; first confirm the attacker model, judge and denominator are the same (post 6).

Question: "this project has been merged into Microsoft and Cisco": how do you confirm it? Answer: see who opened the PR, who merged it, and how the host project's README describes it. ATR's PRs were opened by its author, and on Microsoft's side it says it does not depend on it.

## Where this leaves you

One conclusion from the whole series: no single tool is enough as the only defense, and no neutral benchmark measures a tool's detection power for you. What you can do is put every claim through the same checklist, trust what has a traceable source, and treat the rest as unverified. The checklist has a limit of its own: it tells you whether a claim stands up, not whether a tool works well in your environment, and that needs a trial of your own.

## References

- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [AgentDojo (arXiv:2406.13352)](https://arxiv.org/abs/2406.13352)
- [NIST CAISI: Strengthening AI Agent Hijacking Evaluations](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
- [Agent Security Bench (arXiv:2410.02644)](https://arxiv.org/abs/2410.02644)
- [MalSkillBench (arXiv:2606.07131)](https://arxiv.org/abs/2606.07131)
- [Passing the Test You Trained On (arXiv:2610.03448)](https://arxiv.org/abs/2610.03448)
- [MaliciousSkillBench (arXiv:2608.19901)](https://arxiv.org/abs/2608.19901)
- [Agent-Threat-Rule/agent-threat-rules](https://github.com/Agent-Threat-Rule/agent-threat-rules)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [Series start: AI Agent Security Tooling Map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en)
- [Previous: AI tools that attack others and their dual-use risk](/posts/ai/2026-10-24-ai-pentest-agents-dual-use-en)
