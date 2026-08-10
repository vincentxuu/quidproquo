---
title: "Security: Prompt Injection Can Only Be Contained in the Harness"
date: 2026-08-10
category: ai
type: deep-dive
tags: [security, ai-agent, prompt-engineering, mcp, llm]
lang: en
series:
  name: "Agent 生產線"
  order: 5
tldr: "In November 2025 three frontier labs jointly broke all 12 previously proposed prompt-injection defenses. EchoLeak's payload passed Microsoft's own dedicated classifier. So the goal is not blocking every attack — it is surviving the ones that land, and that is harness work."
description: "Why prompt injection is unsolvable at the model layer — instructions and data share one token stream — and what damage control looks like in the harness: the lethal trifecta, Agents Rule of Two, guardrails at the tool boundary, GitHub's zero-secret architecture and safe outputs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-agent-security-harness-layer)

If the first four parts still leave room for "a stronger model would fix this," this one closes it.

## The root cause: instructions and data are the same token stream

One sentence: **an LLM receives instructions and data as the same token stream, with nothing in the sequence marking which is which.**

Parameterized queries solved the structurally identical problem at the database boundary — you explicitly tell the engine "this segment is data, no matter how much it looks like SQL." **Natural language has no equivalent**, because instructions and information are both expressed as text, with no type to attach.

This is not "nobody has tried yet." It has been **seriously attempted and it failed**. In November 2025, joint research from OpenAI, Anthropic and Google DeepMind **broke all 12 previously proposed prompt-injection and jailbreak defenses** when attacks were allowed to adapt iteratively.

EchoLeak ([CVE-2025-32711](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)) showed what that looks like in a shipping product: a single email caused M365 Copilot to exfiltrate internal company files, **with no user interaction at all**. The part worth remembering is the second half — **that payload passed a classifier Microsoft had trained specifically for cross-prompt injection**. Input filtering used alone leaks.

Other documented cases: GitHub's MCP server induced by a malicious issue in a public repo to leak private repo contents; GitLab Duo induced by hidden instructions to leak private content; a car dealership chatbot talked into selling a vehicle for one dollar; a crypto trading agent socially engineered out of 55 ETH. Even Anthropic's own Git MCP server received three injection-related CVEs in 2025.

So the realistic goal is not to block every attack but to **survive the ones that land** — defense in depth. That can only be built in the harness.

## The lethal trifecta: damage needs three conditions at once

[LLM Security Basics](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat) is the best-sourced article in this corpus (13 traceable references, mostly arXiv papers, CVE numbers, OWASP and official blogs), and its structure is the most useful part: real damage requires three things simultaneously in one agent's hands.

1. **Access to private data** (mailboxes, customer databases, source repositories)
2. **Exposure to untrusted content** (web pages, email, shared documents)
3. **An outbound channel** for data or actions

**Removing any one reduces exposure, and cutting the outbound channel or narrowing access is usually far cheaper than strengthening filters.**

The structure also explains a common misallocation. Model theft and training-data extraction — "attacks on the model itself" — get the most attention, but they are expensive, narrow, and largely mitigated by vendors. The real risk concentrates in the trifecta. The original puts it sharply: a team busy defending against model theft while deploying an over-permissioned agent has handled the rare attack and left the common one alone.

Two frameworks that institutionalize this:

- **Meta's Agents Rule of Two** — without a human in the loop, an agent should satisfy at most two of the three dangerous properties (handles untrusted input / holds sensitive access / acts externally). Meta describes it as a complement to least privilege, not a complete answer
- **Google DeepMind's CaMeL** — treat the model itself as untrusted, use a separate privileged component for planning, and isolate externally retrieved data so the data itself cannot trigger sensitive operations

## Move guardrails to the tool boundary

[Part 1](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) classified guardrails by position: input, tool, output. Microsoft explains why the middle family becomes the main front for agents.

A chatbot only needs to screen user input and model output, because those are the only things it reads. **An agent also reads tool output and retrieved documents** — and indirect prompt injection lives exactly there. Guarding only input and output means guarding two doors nobody uses.

## GitHub: assume this agent is already compromised

[GitHub's agentic workflow security architecture](https://blog.bytebytego.com/p/the-security-architecture-of-github) is the most complete blueprint in the corpus, and its stance is hard from the first line: **the entire design assumes the agent has already been compromised.**

First, why agents broke CI/CD's premise: in a traditional pipeline every component shares one trust domain, because every component is a deterministic script. An agent reasons at run time, digests inputs nobody designed for, and makes judgment calls in the moment — the shared trust domain no longer holds.

**Three mutually independent layers of defense** (if one fails the others still apply):

- **Substrate**: an Actions runner VM plus multiple Docker containers providing isolation, syscall control, and kernel-level communication boundaries. It holds even under arbitrary code execution inside the agent container
- **Configuration**: a compiler turns the workflow definition **into** an Action with explicit permissions, outputs, auditing and network constraints. It also decides which secret goes into which container — **the agent's container never gets one**
- **Planning**: work is split into staged flows with explicit data exchange between stages

**Zero-secret architecture**: the agent runs in its own container on a private network; outbound traffic goes through a dedicated firewall container; MCP tools go through an MCP gateway container that exclusively holds the PAT; LLM calls go through an API proxy holding the model token. Along the whole chain the agent never touches a secret — the proxy and gateway authenticate on its behalf.

To keep the host's compilers and tools available anyway, the approach is elegant: **mount the entire VM host filesystem read-only at `/host`, overlay empty tmpfs layers over the paths containing secrets, then chroot the agent into `/host`.** That "read-only mount plus tmpfs masking" pattern is useful well outside agent contexts.

**Safe outputs** is the most distinctive piece: the GitHub MCP server gives the agent **read-only** access; all writes go to a separate safe-output MCP server that **buffers but never executes**. After the agent finishes, the buffered changes run through a deterministic analysis pipeline — (1) type checking against an allowlist the workflow author defined (if the author didn't permit opening PRs, the buffered PR is discarded), (2) count limits, (3) content scrubbing (scan for leaked secrets, strip URLs, moderate content). Only output that clears the whole pipeline is actually written to GitHub.

**Logging at every trust boundary** — the firewall records network destinations, the API proxy records model requests, the MCP gateway records tool calls, and they even added auditing of environment-variable access inside the agent container. The long-term intent stated in the original reaches well beyond security:

> Every point where you can observe communication is also a point where you can later intervene. Today's observability is tomorrow's control plane.

The authors are candid about the trade-offs: security versus usability (far more constrained than local development), strict-by-default being an opinionated choice (Claude Code and Gemini CLI both make sandboxing opt-in; GitHub turns it on by default), and the fact that **prompt injection remains fundamentally unsolved** — this is damage control, not prevention, and deterministic output review only catches patterns someone anticipated.

One convergence worth noting: GitHub uses proxy plus gateway, OpenAI Codex uses two phases (secrets available only during setup, removed before the agent phase, network off by default). Two teams arrived independently at the same principle — **the agent should never touch a secret**.

## Three underrated numbers

- **PoisonedRAG**: inserting just **5 pieces** of malicious content into a knowledge base of millions achieves a 90% attack success rate on targeted questions
- Anthropic with the UK AI Security Institute and the Alan Turing Institute found that **roughly 250 malicious documents suffice to implant a backdoor in models from 600M to 13B parameters, and the count barely scales with model size** (the authors note the backdoor only produced gibberish, a low-risk behaviour)
- **Slopsquatting**: LLMs hallucinate non-existent package names and attackers register them. The [USENIX Security 2025 study](https://arxiv.org/abs/2406.10279) found that across 576,000 generated samples, **19.7% of recommended packages do not exist**, with 205,000 distinct hallucinated names. **The critical finding is that the hallucinations repeat** — 43% recurred across 10 queries. Repeatability is what makes the attack path viable; random one-off errors give an attacker nothing to pre-position against

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. **Security: Prompt Injection Can Only Be Contained in the Harness** (this post)
6. [Before You Cite: Checking 19 Primary Sources](/posts/ai/2026-08-10-verifying-agent-numbers-en)
7. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
8. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [ByteByteGo — LLM Security Basics: The Full Threat Model](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat)
- [ByteByteGo — The Security Architecture of GitHub Agentic Workflow](https://blog.bytebytego.com/p/the-security-architecture-of-github)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [NVD — CVE-2025-32711 (EchoLeak)](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)
- [Spracklen et al. — We Have a Package for You! (arXiv:2406.10279)](https://arxiv.org/abs/2406.10279)
- [USENIX Security 2025 — We Have a Package for You! (official PDF)](https://www.usenix.org/system/files/usenixsecurity25-spracklen.pdf)
- [OWASP — Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
