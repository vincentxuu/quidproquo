---
title: "Security Alert｜Check Point Audits Six AI Agent Frameworks, Finds 21 Issues — LangGraph's Checkpointer Chains Straight to Unauthenticated RCE"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection, supply-chain]
lang: en
description: "Check Point Research's year-long audit at Black Hat USA 2026 covers LangChain, LangGraph, CrewAI, AutoGen, Microsoft Agent Framework, and Google ADK — 21 findings, 12 CVEs, and a core insight: attackers don't need to call a single tool, they just need to get data written into a framework's own state-persistence layer"
tldr: "Check Point researchers Shahar Tal and Yarden Porat presented 'No Tools Required' at Black Hat USA 2026, auditing six mainstream agent frameworks and finding 21 issues, 12 with CVEs. The clearest public example is LangGraph's checkpointer: a SQL injection (CVE-2025-67644) chained with unsafe msgpack deserialization (CVE-2026-28277) lets an attacker who controls the filter parameter passed to get_state_history() achieve unauthenticated remote code execution without calling a single tool; the Redis checkpointer has a parallel injection (CVE-2026-27022). All three are patched. Mitigations: upgrade immediately, audit every call site that feeds user input into checkpoint queries, and treat the state-persistence layer as a second trust boundary rather than relying solely on input/output guardrails."
series:
  name: "AI Security Alert"
  order: 13
---

> 🌏 [中文版](/posts/daily/2026-08-27-security-langgraph-checkpointer-post-injection-rce)

## Incident Overview

Check Point Research's Shahar Tal (Head of Agentic Security Innovation) and Yarden Porat (security researcher) presented "No Tools Required: Post-Injection Exploitation Across AI Agent Frameworks" at Black Hat USA 2026 on August 5. It's a year-long horizontal audit of the six frameworks the industry actually builds agents on today: LangChain, LangGraph, CrewAI, AutoGen, Microsoft Agent Framework, and Google ADK — 21 security findings in total, 12 of which received CVEs. The core argument is blunt: prompt injection by itself isn't the endgame, it's the foothold into a framework's internal state-persistence layer (checkpoint, memory, session store). Once malicious data gets written into storage the framework itself trusts, the SQL query construction and deserialization bugs that fire on the next read don't require the attacker to call any tool or bypass any guardrail at all.

The most fully public technical example is LangGraph's checkpointer: a SQL injection (CVE-2025-67644) chained with an unsafe msgpack deserialization (CVE-2026-28277) is enough, together, for unauthenticated remote code execution; the Redis checkpointer carries a parallel injection flaw (CVE-2026-27022). LangGraph gets over 50 million monthly downloads and is one of the most widely used open-source agent frameworks today. Affected deployments are self-hosted setups using the SQLite or Redis checkpointer — LangChain's own managed LangSmith Deployment runs on PostgreSQL underneath and isn't exposed to this chain.

**Key Facts**

| Item | Value |
|---|---|
| Type | SQL Injection + Insecure Deserialization → Remote Code Execution |
| Scope | 6 frameworks — LangChain, LangGraph, CrewAI, AutoGen, Microsoft Agent Framework, Google ADK — 21 findings, 12 CVEs |
| Severity | Critical (LangGraph chain reaches unauthenticated RCE; other framework bugs handled via bug bounty, highest CVSS 9.3) |
| CVE | CVE-2025-67644, CVE-2026-28277, CVE-2026-27022 (LangGraph); also CVE-2025-68664 (LangChain-core, "LangGrinch") among 12 total |
| Sources | [Check Point Research](https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/), [Check Point Blog](https://blog.checkpoint.com/research/when-your-ai-agents-memory-becomes-a-security-liability/), [GitHub Security Advisory](https://github.com/langchain-ai/langgraph/security/advisories/GHSA-9rwj-6rc7-p77c), [The Hacker News](https://thehackernews.com/2026/06/langgraph-flaw-chain-exposes-self.html) |

## Attack Surface Analysis

Taking LangGraph as the example, the entry point is `get_state_history()` — the API applications use to query an agent's historical checkpoints, which internally calls the checkpointer's `list()` method. The bug lives in `_metadata_predicate()`: it parameterizes the **values** of the caller-supplied `filter` dictionary, but interpolates the dictionary's **keys** directly as strings into a `json_extract()` SQL expression. Any application that lets user input, tool output, or retrieved-document content influence the keys passed into `filter` hands an attacker a way to inject arbitrary SQL.

Once the SQL injection is in hand, the attacker uses a `UNION SELECT` to forge an extra checkpoint row, returning a `checkpoint` BLOB column the attacker fully controls. This is the pivotal step: when LangGraph reads checkpoint data back, it calls `self.serde.loads_typed()`, and for the `msgpack` type this runs `ormsgpack.unpackb(data, ext_hook=self._unpack_ext_hook)`. The `_unpack_ext_hook` implementation is effectively "import any module → get any attribute → call it with any argument" — a universal gadget on par with a Python `pickle` deserialization vulnerability, just wearing a different serialization format, and just as capable of assembling `("os", "system", "curl ... | sh")` into arbitrary command execution. Three individually unremarkable bugs (SQL injection, unvalidated dictionary keys, deserialization with no object-type restriction) chain into a complete unauthenticated RCE path, with no tool ever called and no model ever jailbroken.

Check Point calls this class of attack "post-injection exploitation." Unlike classic prompt injection, which takes effect in the same turn it's delivered, this kind of bug writes malicious data into a framework's **durable state** (checkpoint/memory/session), and the payload only actually detonates later, when a different user in a different session reads and "restores" that state — what the researchers call delayed-execution injection. The same research names two related techniques: cross-agent propagation (in multi-agent setups, a compromised agent's output becomes trusted input for sibling agents, spreading laterally) and persistent memory poisoning (attacker content written into long-term memory survives restarts and keeps infecting future sessions). Other findings across the six frameworks include a checkpoint deserialization bug in Microsoft Agent Framework ($10,000 bounty), a hidden, unauthenticated development-assistant endpoint in Google ADK that allows file writes and import-time code execution ($3,133.70 bounty), and SSRF, arbitrary file read, and sandbox-escape flaws in CrewAI's RAG pipeline.

These bug classes (CWE-89 SQL injection, CWE-502 insecure deserialization) weren't really what OWASP's LLM Top 10 was designed to cover at the "model layer" — they're classic web-application security problems resurfacing through a new scenario: agents that need to remember things. If a mapping is forced, the closest fit is a variant of **LLM08 Excessive Agency** — the framework itself has been granted unconditional trust to restore its own serialized state, without treating that read/write path as a boundary that needs validation.

## Mitigations

**Immediate actions**
- Upgrade `langgraph-checkpoint-sqlite` to 3.0.1+, `langgraph` to 1.0.10+, and `langgraph-checkpoint-redis` to 1.0.2+
- Audit every call site that feeds user input, tool output, or retrieved-document content into the `filter` argument of `get_state_history()` or a checkpointer's `list()`, and allowlist-validate both keys and values
- If you use Microsoft Agent Framework, Google ADK, CrewAI, or AutoGen, check vendor advisories to confirm the relevant patches are applied (some were handled via bug bounty without a CVE assignment)
- Check whether your checkpoint storage backend (SQLite file, Redis instance) is unnecessarily exposed to network access

**Long-term architecture**
- Formally treat the state-persistence layer as a second trust boundary — every write and read is cross-trust-boundary data flow, not framework internals
- Prefer managed services where possible — LangSmith Deployment runs on PostgreSQL and isn't exposed to this chain; self-hosting SQLite/Redis checkpointers requires a team that can continuously track and apply upstream patches
- Evaluate agent-runtime monitoring tools such as Invariant Labs from the watchlist, to detect anomalous state read/write patterns rather than relying solely on input/output guardrails
- Add the three techniques this research surfaced — delayed-execution injection, cross-agent propagation, persistent memory poisoning — to standard red-team scenarios, not just same-turn prompt injection tests

## Impact

The LangGraph CVE disclosure timeline: reported to the LangChain team on 2025-11-19, SQLi fix shipped 2025-12-10, with the Redis injection patched shortly after. The full Black Hat disclosure of 21 findings and 12 CVEs spans six frameworks, and affected vendors have all shipped patches or handled the issue via bug bounty. Because these are open-source framework-level bugs rather than flaws in a hosted SaaS product, the risk concentrates in self-hosted deployments — an enterprise running its own agent service that doesn't keep dependency versions current won't automatically benefit from an upstream fix.

If your agent system is built on any of these frameworks and persists cross-session state (checkpoints or long-term memory), this research points to two things: content filtering alone isn't enough to stop prompt injection once attacker data can be written into a framework's own persistence mechanism, that layer needs to be audited as a potential code-execution entry point too; and evaluating whether an agent framework is secure can't stop at whether it resists prompt injection — its state-persistence machinery needs to have been designed with the attack surface in mind as well.

## Today's Takeaway

Most security alerts I've covered focus on a single bug in a single product. Check Point spending a year horizontally auditing six mainstream frameworks and turning up 21 issues reframed something for me: the risk in today's agent ecosystem isn't that one particular framework is unusually bad — it's that the whole industry is re-tripping over lessons web application security learned twenty years ago (SQL injection, insecure deserialization, SSRF), just in a new setting. The researchers' closing line put it plainly: "You don't need a new threat model. You need an old one, pointed somewhere new." That recalibrated how I think about agent framework security — defensive effort can't all go into intercepting prompt injection at the front door; the state-persistence and serialization plumbing inside the framework needs to be treated as attack surface too.

## References

- [From SQLi to RCE - Exploiting LangGraph's Checkpointer — Check Point Research](https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/)
- [When Your AI Agent's Memory Becomes a Security Liability — Check Point Blog](https://blog.checkpoint.com/research/when-your-ai-agents-memory-becomes-a-security-liability/)
- [SQL injection via metadata filter key in SQLite checkpointer list method — GitHub Security Advisory GHSA-9rwj-6rc7-p77c](https://github.com/langchain-ai/langgraph/security/advisories/GHSA-9rwj-6rc7-p77c)
- [LangGraph Flaw Chain Exposes Self-Hosted AI Agents to Code Execution — The Hacker News](https://thehackernews.com/2026/06/langgraph-flaw-chain-exposes-self.html)
- [Black Hat 2026: Check Point Research Takes the Stage — Check Point Blog](https://blog.checkpoint.com/research/black-hat-2026-check-point-research-takes-the-stage/)
- [Black Hat 2026: Old-School Bugs Crack Open AI Agent Frameworks — Security Point Break](https://securitypointbreak.com/2026/08/07/black-hat-2026-old-school-bugs-crack-open-ai-agent-frameworks/)
- [No Tools Required: RCE Through Agent State Persistence — Replyant Lab](https://replyant.com/lab/agent-state-persistence-rce/)
