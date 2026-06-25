---
title: "The Single Crack in Agent Security: From Prompt Injection to Trust Boundaries to Multi-Agent Worms"
date: 2026-06-04
category: ai
type: deep-dive
tags: [security, ai-agent, prompt-injection, multi-agent, llm]
lang: en
tldr: "Three seemingly distinct agent security problems — tool output injection, trust boundaries, malicious agents — share the same root cause: LLMs flatten instructions and data into a single token stream, making them architecturally unable to distinguish between the two. Understand this through-line and you can trace every attack from EchoLeak (CVE-2025-32711, zero-click) to the Morris II AI worm, and see why 'making the model behave' doesn't work — only architectural constraints (six design patterns, CaMeL) do."
description: "A structured walkthrough of three layers of LLM agent security threats: prompt injection via tool outputs (the full EchoLeak attack chain), trust boundary design (Lethal Trifecta, six design patterns, CaMeL), and multi-agent malicious agents (Morris II, Prompt Infection), mapped to OWASP Agentic Top 10 and NIST Zero Trust defenses."
draft: false
glossary:
  - term: "EchoLeak"
    definition: "A Microsoft 365 Copilot vulnerability disclosed in June 2025 (CVE-2025-32711) — the first prompt injection weaponized in a production LLM system; zero-click — an attacker sends a single email to exfiltrate data, requiring no user interaction whatsoever."
    context: "This article uses EchoLeak as its flagship case study to dissect the full attack chain."
  - term: "Lethal Trifecta"
    aliases: ["lethal trifecta"]
    definition: "A quick-scan heuristic proposed by Simon Willison: if a single session has access to private data, exposure to untrusted content, and the ability to communicate externally — all three at once — there is a data exfiltration channel."
    context: "This article uses it as the fastest method to determine whether an agent architecture is dangerous."
---

> 🌏 [中文版](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)

Discussions of agent security are often split into three separate topics: prompt injection in tool outputs, where to draw trust boundaries, and malicious agents in multi-agent systems. But these three are really **the same fundamental flaw manifesting at different scales**:

> LLMs compress "instructions" and "data" into a single token stream, and the model is **architecturally incapable** of distinguishing which tokens are commands to execute and which are content to read.

At the single-prompt scale, this is called prompt injection. At the single-agent system scale, it makes trust boundaries impossible to draw cleanly. At the multi-agent scale, an injected command can self-replicate into a worm. Keep this through-line in mind — everything that follows is a corollary.

## The Core Flaw: Data Plane and Control Plane Collapse Inside the Transformer

Traditional computing security rests on a single boundary: the data plane carries data, the control plane carries commands, and the CPU physically enforces this boundary via privilege rings and memory protection. SQL injection and buffer overflows are both symptoms of "the boundary being crossed," and every fix (such as parameterized queries) is essentially about "keeping data as data."

Transformers have no such boundary. Attention does not differentiate between system prompts, user inputs, retrieved documents, and tool outputs — everything is flattened into a single token stream, everything participates in next-token prediction, and therefore everything is literally "executable." Simon Willison, who coined the term "prompt injection" in 2022, put it most precisely: **any output that has ever touched potentially malicious tokens is entirely tainted** — an attacker who can inject into the token stream should be assumed to have full control over what happens next, not just text output but any tool the LLM can invoke.

OWASP formally cataloged both direct (user directly inputs malicious instructions) and indirect (instructions hidden in web pages, emails, documents, or tool outputs that the agent retrieves) variants in LLM01:2025, emphasizing that payloads need not be human-readable — hidden text, white-on-white text, image steganography — anything the model parses counts. **"Via tool outputs" is the most dangerous branch of indirect injection**: the very design of agents means "tool output feeds back into context → model decides next step based on it." Tool output is simultaneously treated as trusted system data and directly shapes the next action — this is the golden injection channel. With MCP proliferation, every connected data service becomes a new injection point.

## Flagship Case Study: EchoLeak (CVE-2025-32711)

EchoLeak, disclosed by Aim Security in June 2025, is **the first prompt injection weaponized in a production LLM system that caused concrete data exfiltration** — prior to this, such attacks were largely considered theoretical. The target was Microsoft 365 Copilot, and it was **zero-click**: the attacker only needed to send a single email; the user never had to click anything.

The attack chain combined three bypasses, each worth examining individually:

1. **Bypassing the XPIA injection classifier**: The malicious email contained near-invisible instructions. The key asymmetry highlighted by the security community: injection detection operates at the "whole document" level, but RAG actually retrieves only **chunks** of documents — "spraying" the payload across semantically diverse paragraphs increases the probability of retrieval hits while making the full document look benign.
2. **Bypassing link redaction**: Using reference-style Markdown syntax.
3. **Bypassing egress restrictions**: Abusing a Microsoft Teams proxy domain allowed by CSP to automatically exfiltrate data to the attacker's server.

The consequence was exfiltration of anything within Copilot's access scope: private emails, OneDrive files, SharePoint documents, Teams messages, and conversation history. Aim Labs named this an **LLM Scope Violation** — the AI was tricked into crossing its trust boundaries. It demonstrated how AI-specific vulnerabilities combined with traditional vulnerabilities (CSP bypass) can chain into a complete kill chain, and exposed systemic design weaknesses in most RAG/agent systems. Subsequently, PromptArmor demonstrated that Microsoft Copilot Cowork could exfiltrate M365 files via poisoned skills — with high success rates against SOTA models (including Claude Opus 4.7).

## Trust Boundaries: Why Agents Are Especially Hard to Secure

NIST's Zero Trust for AI Agent document articulates this most clearly: traditional systems have explicit trust boundaries — user input is untrusted, internal function calls are trusted. But agent systems blur this boundary because **the model's output is simultaneously "internal logic" (deciding the next step) and "a result shaped by external input"** — there is no clean architectural point where you can say "past this point, everything is trusted."

The practical heuristic is blunt: **any field a user can edit, or that originates from outside the system, is attacker-controlled input**. Praetorian's research identified a common blind spot: supervisor agents only scrutinize the user's conversational input while treating profile fields, retrieved documents, and tool outputs as "trusted context assembled by the system" — but users can inject into even their own "name" field; and context assembly happens after supervision, meaning the supervisor never sees the fully assembled prompt.

The fastest way to determine whether an agent architecture is dangerous is Willison's **Lethal Trifecta** — if all three exist within a single session, there is an exfiltration channel:

1. **Access to private data**
2. **Processing untrusted content** (the indirect injection entry point)
3. **Outbound communication capability** (email, webhooks, APIs, even Markdown image external links)

EchoLeak is the textbook case where all three were present. The practical implication: **outbound channels are also part of the trust boundary** — if you cannot constrain data flow, you have not secured the agent.

The core design philosophy follows from this: **do not rely on the model obediently ignoring malicious instructions** (probabilistic); instead, assume the model may be influenced, and then **constrain what tool calls the influenced model can make** (deterministic). For example, rather than letting the agent freely query the database, have the database engine itself authorize every request with the user's permissions — shifting the trust boundary from "the model" to "the DB engine." A more aggressive approach is network-layer enclaves: resources outside the enclave are not blocked by policy but are **simply network-unreachable from inside the enclave**.

## Six Design Patterns and CaMeL

The paper by Beurer-Kellner et al. (11 authors from IBM, Invariant Labs, ETH Zurich, Google, Microsoft; arXiv:2506.08837) is currently the backbone of trust boundary design. The guiding principle in one sentence: **once an agent ingests untrusted input, it must be constrained so that input cannot possibly trigger any consequential action**. The paper also honestly acknowledges: as long as both agents and defenses rely on current-generation LLMs, general-purpose agents are unlikely to have reliable security guarantees — so the question becomes "what kind of agents can we build today that are both useful and injection-resistant," and the answer is **trading capability for security**:

| # | Pattern | One-liner | Boundary Design |
|---|---|---|---|
| 1 | Action-Selector | LLM-modulated switch statement | Agent can trigger tools but **receives no responses** — no feedback means no injection path |
| 2 | Plan-Then-Execute | Lock down the plan before execution | Tool output can flow back, but **cannot influence action selection** — calendar content may taint email body but cannot change the recipient |
| 3 | LLM Map-Reduce | Sub-agents handle dirty content; aggregator receives only structured results | Sub-agents return only booleans; coordinator never touches raw dirty content |
| 4 | Dual LLM | Privileged + quarantined dual-model | Q-LLM processes dirty content but **has no tools**, returning only symbolic variables; dirty content never enters P-LLM |
| 5 | Code-Then-Execute | P-LLM generates sandboxed DSL code | DSL supports data flow analysis; tainted data is tracked end-to-end |
| 6 | Context-Minimization | Use-and-discard | Prompt is converted to a query then immediately removed from context, preventing injection residue |

Dual LLM still has vulnerabilities. The classic counterexample: "Send Bob the document he wanted — Bob's email is in the meeting notes." The Q-LLM is still exposed to malicious instructions in the meeting notes, and an attacker can overwrite Bob's email address. DeepMind's **CaMeL** (Defeating Prompt Injections by Design, arXiv:2503.18813) brings classical security engineering back to solve this: the P-LLM first extracts the control flow into pseudo-Python, which a custom interpreter executes. The interpreter maintains a **data flow graph** and uses **capabilities** to enforce where data can flow to which sinks — "Bob's email" carries a "sourced from untrusted meeting notes" label, and the policy forbids it from being used as the recipient of `email.send`. Willison called it the first paper he'd seen that proposes a **credible solution** to injection resistance for tool-using LLMs.

## Scaling to Multi-Agent: Injection Self-Replicates

Most multi-agent frameworks treat inter-agent messages as "trusted internal communication." NIST's key insight: **when agents communicate via natural language, every inter-agent message is a potential prompt injection vector** — an outer agent delegating a task to an inner agent is, architecturally, passing untrusted input across a trust boundary.

When injection occurs in a topology where "messages are forwarded to the next agent," it escalates from a one-time hijack to a worm. **Morris II** (arXiv:2403.02817) is the first zero-click worm targeting the GenAI ecosystem, with a three-stage structure: **replication** — an adversarial self-replicating prompt forces the model to echo its input verbatim; when an agent summarizes an infected document, the summary itself carries the malicious prompt; **propagation** — the infected agent is commanded to send the prompt to new targets via email / Slack / DB; in the RAG variant, the malicious email is stored in the RAG system, and when replying to other emails, new recipients are infected without human intervention; **payload** — stealing PII, phishing, spreading spam.

**Prompt Infection** (arXiv:2410.07283) formalizes LLM-to-LLM injection and reveals an even more alarming finding: **even when agents do not directly share communication channels, multi-agent systems remain highly susceptible to infection**. Its payloads can assign tasks by role (one agent exfiltrates data, the last agent self-destructs to cover tracks). The proposed defense is **LLM Tagging** — labeling AI-generated content to block the propagation of self-replicating prompts.

Real-world incidents are beginning to surface as well: Palo Alto Unit 42 disclosed **Agent Session Smuggling** in November 2025 — on the Google A2A protocol, a malicious agent exploits built-in trust relationships to gradually build false trust across multiple conversation turns. According to a simulation study by Galileo AI (single-vendor data, treat as a trend indicator), a single compromised agent can taint 87% of downstream decisions within 4 hours — the shared lesson being that **cascading failure propagates faster than traditional incident response can contain**.

## Defense Architecture: Three Stacked Layers

Multi-agent defense builds on single-agent principles with an additional layer:

**A. Carry forward single-agent architectural constraints**: Treat all LLM output (including output from other agents) as untrusted; run untrusted content in isolated sandboxes / enclaves; apply least privilege — give each agent only the narrowest set of tools and permissions to minimize blast radius.

**B. New controls at the inter-agent layer**: Authenticate inter-agent messages (the gap NIST flagged), constrain delegation permissions (who can an agent act on behalf of, what can it request), and apply LLM Tagging.

**C. Governance frameworks**: OWASP released the **Top 10 for Agentic Applications** in December 2025 (co-authored by 100+ researchers), carving out agentic-specific risks as a distinct category. Vendor observations (Lasso) suggest the top three risks are no longer traditional injection but rather Memory Poisoning, Tool Misuse, and Privilege Compromise — because agents have persistent memory, autonomous invocation, and cross-session identity. Existing frameworks (LLM Top 10, NIST AI RMF, MITRE ATLAS) largely treat LLMs as isolated components and are insufficient to cover the emergent security properties arising from the combination of autonomy + long-term memory + dynamic tooling.

## The Big Picture

The research community's consensus is sobering: **there is currently no reliable method to make an LLM follow instructions in one class of text while safely applying those instructions to another class of text**. Therefore, "making the model behave" (prompt-based defenses typically drop 10–30% in utility under attack) is not the answer — **architectural constraints** are — and the essence of architectural constraints is trading "the agent's ability to solve arbitrary tasks" for security.

A practical three-step checklist: First, scan your agent with the Lethal Trifecta (private data x untrusted content x outbound communication — if all three coexist, it's dangerous). Second, pick one of the six design patterns that fits your task shape (most business workflows actually fit into Plan-Then-Execute or Map-Reduce). Third, for multi-agent systems, treat every inter-agent message as external input. After EchoLeak, this is no longer a theoretical exercise.

## References

- [OWASP — LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection)
- [OWASP — Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations)
- [NIST — Zero Trust Architecture for AI Agent Security](https://downloads.regulations.gov/NIST-2025-0035-0154/attachment_1.pdf)
- [Design Patterns for Securing LLM Agents against Prompt Injections (arXiv:2506.08837)](https://arxiv.org/abs/2506.08837)
- [Defeating Prompt Injections by Design / CaMeL (arXiv:2503.18813)](https://arxiv.org/abs/2503.18813)
- [AgentDojo (arXiv:2406.13352)](https://arxiv.org/abs/2406.13352)
- [Here Comes The AI Worm / Morris II (arXiv:2403.02817)](https://arxiv.org/abs/2403.02817)
- [Prompt Infection: LLM-to-LLM Prompt Injection within Multi-Agent Systems (arXiv:2410.07283)](https://arxiv.org/abs/2410.07283)
- [EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit (arXiv:2509.10540)](https://arxiv.org/abs/2509.10540)
- [Agentic AI Security: Threats, Defenses, Evaluation, and Open Challenges (arXiv:2510.23883)](https://arxiv.org/abs/2510.23883)
- [Simon Willison — Design Patterns for Securing LLM Agents](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [Simon Willison — CaMeL offers a promising new direction](https://simonwillison.net/2025/Apr/11/camel/)
- [Simon Willison — The Dual LLM pattern](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/)
- [Varonis — EchoLeak](https://www.varonis.com/blog/echoleak)
- [HackTheBox — Inside CVE-2025-32711](https://www.hackthebox.com/blog/cve-2025-32711-echoleak-copilot-vulnerability)
- [Praetorian — Bypassing LLM Supervisor Agents Through Indirect Prompt Injection](https://www.praetorian.com/blog/indirect-prompt-injection-llm)
- [NeuralTrust — Indirect Prompt Injection: The Complete Guide](https://neuraltrust.ai/blog/indirect-prompt-injection-complete-guide)
- [PromptArmor — Microsoft Copilot Cowork Exfiltrates Files](https://www.promptarmor.com/resources/microsoft-copilot-cowork-exfiltrates-files)
- [Palo Alto Networks — What Is an AI Worm?](https://www.paloaltonetworks.com/cyberpedia/ai-worm)
- [secops.group — Securing Agentic AI: The OWASP Top 10 and Beyond](https://secops.group/blog/securing-agentic-ai-the-owasp-top-10-and-beyond)
- [Lasso Security — Top 10 Agentic AI Security Threats](https://www.lasso.security/blog/agentic-ai-security-threats-2025)
