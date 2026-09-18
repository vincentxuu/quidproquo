---
title: "AI Engineer Interview Daily — 2026-09-19: Paper Reading"
date: 2026-09-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper is Paper2Agent, freshly published in Nature — a system that uses specialist agents to turn a research paper's codebase into a tested MCP tool, paired with a reviewer's-eye question about whether an auto-generated agent is actually faithful to the source paper."
tldr: "Today's Paper Reading rotation covers arXiv:2509.06917, Paper2Agent, just published in Nature in 2026. It's an automated framework that uses multiple specialist agents to analyze a research paper and its open-source code, then builds a testable, iteratively refined Model Context Protocol (MCP) server that plugs into a chat agent like Claude Code — letting you reproduce the paper's results, or answer questions the paper never asked, in natural language. The authors validate it on three case studies (AlphaGenome, ScanPy, TISSUE) and report that it surfaced a novel splicing variant linked to ADHD risk. Core concepts covered: the specialist-plus-coordinator multi-agent pattern, MCP as the standardized interface between a paper's capabilities and callable tools, how an iterative generate-test-refine loop replaces a one-shot human review, and why reproducing the paper's own results and correctly answering new queries are two separate reliability bars that both need checking. The practice question takes a reviewer's-eye view: how would you design experiments to catch an auto-generated agent that's hallucinating rather than faithfully reproducing the source method, and what guardrails would you add before shipping something like this as an internal tool."
series:
  name: "AI Engineer Interview Daily"
  order: 31
---

> 🌏 [中文版](/posts/daily/2026-09-19-ai-interview-daily)

## Today's Topic

Saturday's rotation is Paper Reading. This round doesn't test whether you've already read the paper — it tests whether, given 10-20 minutes with the abstract and figures, you can state the problem, explain the key design trade-offs in the method, and judge whether the experiments actually support the paper's claims. Today's pick, Paper2Agent, is a good fit for practice because it's a multi-agent system about building multi-agent systems — the paper's own methodology is a multi-agent pipeline for turning a paper into an agent. It's solid practice for the paper-reading round in a Research or LLM/Agent team interview loop, and it pulls in some system-design thinking along the way.

## Core Concepts Cheat Sheet

### Specialist plus coordinator: multi-agent isn't just "one big agent doing everything"

Paper2Agent doesn't use a single agent to read the paper, write the code, and run the tests end to end. Instead, a coordinator dispatches multiple specialist agents in parallel — one analyzing the paper's content, another understanding the associated codebase, others extracting usable functions and workflows. The payoff is that each specialist's context window only has to hold the slice of information it's responsible for, instead of being diluted by the token volume of the whole paper plus the whole repo. When an interviewer asks "when do you split into multiple agents versus keeping one," the line you can say out loud is: a single agent's context gets diluted by irrelevant information, and splitting lets each agent stay focused.

### MCP: turning "what the paper can do" into a tested, callable tool

The Model Context Protocol isn't the endpoint here — it's the middle layer. Paper2Agent packages the logic its specialists extract into an MCP server, so any MCP-compatible chat agent (like Claude Code) can connect and invoke the paper's specific workflows in natural language — for example, interpreting a genomic variant with AlphaGenome. The value of this design choice is portability: once something is packaged as a standardized MCP tool, you don't have to rebuild the integration for every downstream client. That's the same idea as wrapping internal logic in a stable API in ordinary backend engineering — the caller here just happens to be an LLM agent.

### Iterative generate-test-refine: reliability comes from a loop, not a single human check

The paper's core reliability mechanism is a loop that systematically generates tests, runs them, and refines the MCP tool's implementation based on failures — repeating until the tool behaves reliably. That's one layer more than "the agent writes code and ships it." If you're asked in an interview "how do you make sure LLM-generated code is correct," answering with a loop that generates test cases automatically, runs them, and feeds failures back into the next revision is a more systematic answer than "I'd have someone review it."

### Two different reliability bars: reproducing old results versus answering new questions

The paper specifically distinguishes between two kinds of validation: can the paper agent reproduce results the original paper already reported (reproducibility), and can it correctly handle brand-new user queries the original paper never asked (generalization). These aren't the same thing — a system could reproduce the paper's own figures by rote and still fall apart the moment a user swaps in a different input dataset. When an interviewer digs in, "did the paper validate these two capabilities separately" is a good way to judge how rigorous the experimental design actually is.

### From passive document to active collaborator: a shift in how knowledge spreads

The authors frame Paper2Agent as a first step toward turning static papers into AI co-scientists that can converse and collaborate — with different paper agents even talking to each other. That vision is ambitious, but the follow-up worth asking is about the downside: when a paper's underlying method has errors or limitations, does wrapping it in an agent make it easier for users to overlook that this is still just the paper's existing method, packaged to be more usable — mistaking the boundary of the method for something that generalizes without limit.

## Today's Practice Question

### The Question

"A paper recently published in *Nature*, Paper2Agent, claims that any research paper with public code can be automatically converted into an MCP-based AI agent, letting users reproduce the paper's results — or ask it questions the paper never addressed — in natural language. The authors validate this on three case studies (AlphaGenome for genomic variant interpretation, and ScanPy and TISSUE for single-cell and spatial transcriptomics analysis), and report that the system automatically surfaced a novel splicing variant linked to ADHD risk. Explain: (1) if you were reviewing this paper, how would you design experiments to check whether the auto-generated agent is actually faithful to the original method, rather than producing plausible-looking but hallucinated results; (2) the paper uses an architecture where specialist agents analyze the code to build the MCP server, then a test loop iteratively refines it — what problem does this design choice solve, and what risk does it leave open; and (3) if you were shipping this as an internal 'auto-package research output into internal tools' pipeline at your company, what guardrails would you add."

**Source**: Adapted from arXiv:2509.06917's motivation and case studies, self-authored interview scenario   **Difficulty**: Advanced   **Round**: Research / System Design hybrid (onsite)

### How to Break It Down

1. **Clarify the problem first**: Pin down what "faithful to the original method" actually means here — does it mean the output numbers match what the paper reported (reproducibility), or that the underlying function logic actually matches how the original code is supposed to be used (faithfulness)? These can diverge — matching numbers by coincidence while the underlying logic is wrong is entirely possible in complex scientific code. Also clarify the resource constraints: a review cycle is usually a few weeks, so you can't re-run every possible input.
2. **Build the framework**: Split validation into the two layers the paper implies but doesn't fully separate — reproducibility testing (take specific cases the original paper already reported as ground truth, run the agent-generated pipeline once, and compare outputs against the paper's numbers or figures) and generalization testing (construct new inputs the original paper never tried, and cross-check that the functions and parameters the agent calls actually correspond to correct usage of the original code, rather than just looking superficially plausible while being logically wrong).
3. **Go deep on the core**: The multi-agent-plus-test-loop architecture solves the problem of a single large agent missing key details in a large codebase and lacking any self-correction mechanism. But it leaves open the risk of information gaps between specialists (one agent missing an edge case another specialist already found), and — more importantly — who writes the tests. If the test cases are generated by the same LLM pipeline as the code itself, the tests can share the same blind spots as the code, producing a false sense of reliability: the system grading its own homework and, unsurprisingly, passing. If the paper only describes the test-iteration loop without detailing where the test cases' independence comes from, that's exactly what a reviewer should push on.
4. **Close it out**: For production deployment, the key guardrail is not letting an auto-generated tool serve decisions directly — run it in shadow mode first, comparing its output against expert human judgment over time. For high-risk domains (like the genomics and medical case studies in the paper), require a human sign-off gate at key decision points instead of letting the agent's output become the downstream decision by default. Tie this back to last week's practice on evaluation infrastructure trusting server-side evidence over the agent's own self-reports — the same principle here, just applied to whether the test cases themselves are independent of the thing being tested.

### Sample Answer (something you could actually say in an interview)

> **Framing the problem**: Before designing a validation plan, I'd split "faithful to the original method" into two layers — whether the output numbers match what the paper reported (reproducibility), and whether the underlying logic the agent invokes actually corresponds to a correct use of the original code (faithfulness). These can decouple: getting the right numbers by coincidence while the logic is actually wrong isn't rare in complex scientific code, and when I'm reviewing this I'd specifically check whether the paper validated both layers separately or only reported one.
>
> **Core logic**: I'd design two sets of tests. The first takes specific cases the paper itself already reported — say, the interpretation of a particular genomic variant — as ground truth, re-runs the full agent-generated pipeline, and compares outputs item by item. The second deliberately constructs inputs the original paper never tried — a genomic locus or dataset that never appears in the paper — and cross-checks whether the function calls and parameter choices the agent makes actually correspond to correct usage of the source code, rather than just being formatted correctly while being logically wrong. As for the paper's multi-agent-plus-iterative-test architecture, I think what it solves is a single large agent missing key details in a sprawling codebase with no self-correction step. What it leaves open is: who writes the tests. If the tests come from the same LLM pipeline as the code, they can share the exact same blind spots — a high pass rate that doesn't actually mean it's reliable.
>
> **Deployment guardrails**: If we were turning this into an internal tool, I wouldn't let the auto-generated agent serve downstream decisions the moment it ships. I'd run it in shadow mode first, continuously comparing its output against domain-expert judgment until it earns enough confidence to open up to non-expert users. For high-risk domains like the genomics case studies in the paper, I'd add a mandatory human sign-off gate on key outputs. That's the same "don't take the system's word for it" principle we practiced last week with evaluation infrastructure trusting server-side evidence over an agent's self-reports — just applied here to the independence of the test suite itself.

### Self-Check List

Use this table to check whether your answer missed a key point:

| Check item | Covered? |
|---|---|
| Split "faithful to the original paper" into reproducibility and faithfulness/generalization, validated separately | |
| Gave a concrete way to construct new inputs beyond the paper for cross-validation | |
| Discussed what problem multi-agent decomposition solves (context overload, single-agent blind spots) | |
| Flagged the risk that self-generated, self-validated tests can produce a false sense of reliability | |
| Deployment guardrails included shadow mode / human sign-off, not shipping straight to production | |
| Bonus: connected this to a cross-topic principle like "don't trust an agent's own self-reports, look at infrastructure-side evidence" | |

## Further Reading

- [Paper2Agent GitHub — jmiao24/Paper2Agent](https://github.com/jmiao24/Paper2Agent) — The project source and architecture notes, showing how the coordinator dispatches specialist agents and generates and validates the MCP server, plus concrete usage examples for the AlphaGenome, ScanPy, and TISSUE case studies.
- [5 best MCP testing tools for agent evals in 2026 — Braintrust](https://www.braintrust.dev/articles/best-mcp-testing-tools-agent-evals-2026) — Fills out the "how do you actually test an MCP server" angle, covering isolated decisions, full trajectories, regression suites, and production-behavior testing — echoing today's practice question about test-case independence.
- [Reimagining research papers as interactive and reliable AI agents — Nature](https://www.nature.com/articles/s41586-026-11044-y) — The formally published version, with experimental details strengthened through peer review — worth comparing against the arXiv preprint.

## References

- [Paper2Agent: Reimagining Research Papers As Interactive and Reliable AI Agents — arXiv:2509.06917](https://arxiv.org/abs/2509.06917) — Source paper for today's Paper Reading core concepts and practice question, including the full method design and the AlphaGenome / ScanPy / TISSUE case studies.
- [Reimagining research papers as interactive and reliable AI agents — Nature](https://www.nature.com/articles/s41586-026-11044-y) — The paper's formal Nature publication and DOI.
- [Paper2Agent GitHub — jmiao24/Paper2Agent](https://github.com/jmiao24/Paper2Agent) — Source for the specialist-plus-coordinator multi-agent section and the details of how the MCP server gets produced.
- [Manuscripts-turned AI agents can now 'talk' to each other, and make new discoveries — Stanford Medicine](https://med.stanford.edu/news/all-news/2026/09/ai-agents-talk.html) — Background reporting for the "from passive document to active collaborator" section and the ADHD-linked splicing variant case.
