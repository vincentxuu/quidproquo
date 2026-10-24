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
tldr: "When you see 'covers OWASP 10 of 10', 'merged into Microsoft and Cisco' or '9X% detection', ask five things: who said it, what the term means, who set the questions, what is being measured, and where the primary source is. The earlier posts and a few cases added here each happen to show one: Microsoft's toolkit itself says 7 full and 3 partial; of ATR's (an open-source set of agent threat-detection rules) merged PRs into Microsoft and Cisco, the three checked were all opened by its author; Cisco's own detection rate and an independent study's differ several-fold; common benchmarks score models or agents, not tools."
description: "Using the OWASP Agentic Top 10 and LLM Top 10 2026 as shared vocabulary, this post separates standards, tools and benchmarks and walks through a five-question checklist, with examples from the earlier posts and a few added cases, for taking apart claims of coverage, merging and detection rate."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-judging-security-tool-claims)

This is the last post in the series and introduces no new defensive tool. Every kind of tool in the first seven posts came with numbers and claims; this one turns the questions for taking them apart into a checklist, after setting out the vocabulary they share. Where the first seven posts' examples run out, it adds a few new cases, each described in one sentence on first appearance.

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

The official list has only ASI01 to ASI10. If a tool shows ASI16, it is not on the official list.

**[OWASP Top 10 for LLM Applications 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) (v1.0, published August 2026), for applications that use a model as a component.** Per the PDF's table of contents:

| ID | Name |
|---|---|
| LLM01 | Prompt Injection |
| LLM02 | Sensitive Information Disclosure |
| LLM03 | Excessive Agency |
| LLM04 | Supply Chain |
| LLM05 | Data and Model Poisoning |
| LLM06 | Unbounded Consumption |
| LLM07 | Misinformation |
| LLM08 | Hidden Context Exposure |
| LLM09 | Vector and Embedding Weaknesses |
| LLM10 | Improper Output Handling |

This section cites only the PDF's table of contents, mapping appendix and the passage on the boundary between the two lists, not the text of each entry.

Read the ID together with its year: LLM03 in the 2025 edition is Supply Chain, and in 2026 it is Excessive Agency. An older article or tool that keeps the 2025 numbering makes the same ID point at a different risk.

The boundary between the lists is one the LLM list states itself: while a model is a component inside your application, the risk belongs to the LLM list; once the model becomes an actor, the risk moves to the Agentic list.

## Standard, tool and benchmark are three different things

| | What it is | Example | What it is not |
|---|---|---|---|
| List / standard | Vocabulary that names risks | The two OWASP Top 10s | Not a test; you cannot "pass" it |
| Tool | Code that detects or defends | Every tool in posts 1 to 7 | Not the same as the list items it says it covers |
| Benchmark | A set of questions plus a scoring method | AgentDojo, Agent Security Bench | Not the same as performance once deployed |

Many flawed claims blur the three: they take a list's name for a tool's feature, or a benchmark score for how secure a tool is.

Two terms are used below: recall is how many of a hundred bad samples get caught, and a false positive is a good sample wrongly flagged.

## A five-question checklist

### 1. Who said it, and do they have a stake in what is said

- ATR (Agent Threat Rules, an open-source set of agent threat-detection rules) says in its README that its rules were merged into Microsoft, Cisco and others. The PRs to Microsoft (AGT and PyRIT) and Cisco were all merged, all were opened by ATR's own author, and the other project's maintainers merged them; the other projects it lists were not individually checked. That shows the proposals were accepted, not that these companies treat it as a standard; Microsoft's toolkit itself says it takes no dependency on it and keeps it only in an examples directory. Action: open the project making the claim, filter its Pull requests tab with `author:` to see who proposed it, then search the host project's README for a mention.
- The [governance file](https://raw.githubusercontent.com/aveproject/ave/main/GOVERNANCE.md) of AVE (an agent vulnerability database) says it is currently maintained by a single vendor's founder, and its reference implementation is that vendor's own scanner.
- SkillEvaluator is NVIDIA's open-source framework for evaluating skills ([repo](https://github.com/NVIDIA/SkillEvaluator)), part of the NVIDIA Verified Skills publishing pipeline; per its [documentation](https://docs.nvidia.com/skills/skillevaluator), its first tier runs security scanning with NVIDIA's own SkillSpector. So it is a quality gate inside NVIDIA's own process, not a benchmark of scanners.

A stake does not mean lying, but disclose it first, then see whether others can check it.

### 2. What does the term actually mean

- The repo description of Microsoft's Agent Governance Toolkit says it covers all 10 items of the OWASP Agentic Top 10; its own mapping document says 7 full and 3 partial, and notes that it is an internal self-assessment, not a certification; the three partial items are ASI04, ASI06 and ASI09 ([post 3](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways-en)).
- "Merged" needs: who opened the PR, who merged it, and how the host project's README describes it.
- "Cisco's skill-scanner catches X%" needs: rules alone or with an LLM, and at what alert level it counts as caught ([post 1](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)).
- Action: search the tool's documentation for `self-assessment`, `partial` and `roadmap` to see whether it discounts itself.

### 3. Who set the questions, and what is the denominator

- Cisco's own measure of its rules (alerts at HIGH and above) is 7.7%, at a 4.0% false-positive rate. An independent study on a split of the same size (839 malicious, 545 benign, sources kept disjoint) re-ran it and got 2.5%, which is about 21 of 839 malicious samples against about 65 for 7.7%, a gap that does not look like sampling noise (the paper gives no confidence interval; this is a rough estimate from the sample size). But that study used static analysis (reading code and configuration without running it) in a local compatibility environment, whose settings may not match Cisco's exactly, so the two numbers should not be quoted against each other.
- Cisco also says its rule pack was tuned on the development part of that dataset: at the looser MEDIUM-and-above setting, about 31% on the development part against about 8% on sources never seen. That is a different threshold from the 7.7% above; do not treat them as one quantity. So ask whether a detection rate was measured on the samples used in development or on samples the tool has never seen.
- ATR reports 92.3% on 650 prompts of in-the-wild jailbreaks from the garak corpus in hunt (permissive) mode, but only 0.9% in enforce mode; 130 of its rules reference that corpus, and without them the hunt-mode rate falls to 65.4%. ATR publishes these limits itself, but remember that 92.3% is the permissive-mode figure.
- Post 6's attack success rate has the same problem: [the attacker model, the judge (the model or rule that decides whether an attack worked) and the denominator must match first](/posts/ai/2026-10-24-ai-red-teaming-llm-tools-en).
- Action: when you find a number, find its dataset page and see whether development and test sets are split and where the false-positive rate is stated.

### 4. What is being measured

Frequently cited benchmarks mostly score models or agents, not scanners or guardrails. Action: read the benchmark paper's metrics section and see whether it measures attack success rate or detection recall.

- AgentDojo scores how well an agent (model plus pipeline) resists prompt injection. Defenses are put in as pipeline parts, with no independent detection recall. When CAISI (the US NIST's Center for AI Standards and Innovation) used it on an upgraded Claude 3.5 Sonnet in the Workspace environment, the strongest new attack lifted the success rate from 11% for the strongest baseline attack to 81%, so static attacks (fixed in advance, not adapting to the defense) alone understate the risk.
- Agent Security Bench's seven metrics (Table 4 of the paper) include a false-positive rate (FPR) and a false-negative rate (FNR) for detection, but the paper has only two detection-type defenses (perplexity detection and LLM-based detection, Table 2), and both target only memory poisoning.
- The independent studies on record that measure detection tools directly come in two kinds. The first is about skill detection and has two parts: MalSkillBench's abstract says the strongest detector collapses on prompt injection, yet its body tables show the detectors that drop are other ones and the strongest still reaches 97.6%; scoring on wild samples alone shifts a single tool's recall by up to 66 percentage points. MaliciousSkillBench is the independent re-run of Cisco in the previous question.
- The second is about prompt-injection classifiers: rankings barely carry over to another benchmark. The best detector on one dataset, at a 1% false-positive rate, catches only 2% of AgentDojo's injections.
- Only the abstracts and parts of the text of these were checked, so treat the conclusions as direction.

So for "9X% detection", ask: on which samples, with how many false positives, and whether the samples and the tool were developed by the same people.

### 5. Where is the primary source

Go back to the text of the list, the paper, the host project's README and its PR history, not an explainer. Many of the third-party reports around this series' topics are in fact relaying one source (ARTEX and HexStrike in [post 7](/posts/ai/2026-10-24-ai-pentest-agents-dual-use-en) are the examples). Action: follow the source link in a claim three layers, from news to vendor report to raw data, and stop at the layer where the link breaks.

## Practice: apply the checklist to the earlier claims

| Claim | What to check | What turned up |
|---|---|---|
| "Covers OWASP 10 of 10" | The tool's own mapping document | 7 full, 3 partial, internal self-assessment |
| "Merged into Microsoft and Cisco" | Who opened the PR; the host README | In the three PRs checked, the author opened them; Microsoft says it does not depend on it |
| "Rules detect X%" | Who set the questions; which alert level | Own measure 7.7%, independent re-run 2.5% |
| "Lots of GitHub stars" | How the stars arose; whether traffic was redirected | Stars reflect exposure, not accuracy; Strix's and Shannon's self-reported results differ enormously from a competitor's experiment (post 7) |
| "First on a benchmark" | What the benchmark measures | Mostly models, not tools |
| "Deployed in production" | Whether the open-source and internal versions are the same | ADR (Uber's agent behavior-detection system, see [post 4](/posts/ai/2026-10-24-agent-detection-audit-en)) has an open-source release that lacks the blocking component; what Uber runs is a different build |

## Self-check

Question: two reports both say "attack success rate 5%". Can they be compared directly? Answer: no; first confirm the attacker model, judge and denominator are the same (post 6).

Question: "this project has been merged into Microsoft and Cisco": how do you confirm it? Answer: see who opened the PR, who merged it, and how the host project's README describes it. In the three PRs checked, ATR's author opened them, and on Microsoft's side it says it does not depend on it.

## Where this leaves you

One conclusion from the whole series: no single tool is enough as the only defense. The independent studies on record that measure detection tools come in the two kinds above, and their datasets and rankings do not line up, so none of them vouches for your environment. What you can do is put every claim through the same checklist, trust what has a traceable source, and treat the rest as unverified. The checklist has a limit of its own: it tells you whether a claim stands up, not whether a tool works well in your environment, and that needs a trial of your own.

## References

- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/); [2026 edition (v1.0)](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- [AgentDojo (arXiv:2406.13352)](https://arxiv.org/abs/2406.13352)
- [NIST CAISI: Strengthening AI Agent Hijacking Evaluations](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
- [Agent Security Bench (arXiv:2410.02644)](https://arxiv.org/abs/2410.02644)
- [MalSkillBench (arXiv:2606.07131)](https://arxiv.org/abs/2606.07131)
- [Passing the Test You Trained On (arXiv:2610.03448)](https://arxiv.org/abs/2610.03448)
- [MaliciousSkillBench (arXiv:2608.19901)](https://arxiv.org/abs/2608.19901)
- [Agent-Threat-Rule/agent-threat-rules](https://github.com/Agent-Threat-Rule/agent-threat-rules)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit); [mapping document](https://microsoft.github.io/agent-governance-toolkit/compliance/owasp-agentic-top10-architecture/)
- [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [aveproject/ave](https://github.com/aveproject/ave)
- [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator); [documentation](https://docs.nvidia.com/skills/skillevaluator)
- [uber/ADR](https://github.com/uber/ADR)
- [Series start: AI Agent Security Tooling Map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en)
- [Previous: AI tools that attack others and their dual-use risk](/posts/ai/2026-10-24-ai-pentest-agents-dual-use-en)
