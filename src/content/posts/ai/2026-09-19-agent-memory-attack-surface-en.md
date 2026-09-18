---
title: "The Attack Surface of Agent Memory: When Memories Become Persistent Backdoors"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, security, prompt-injection, memory-poisoning, minja, privacy]
lang: en
series:
  name: "AI Agent 記憶工程"
  order: 8
tldr: "Memory turns prompt injection from a one-shot nuisance into a persistent backdoor: MINJA shows conversation-only injection succeeds >95% of the time, and SpAIware demonstrated continuous data exfiltration via planted memories. The industry's two defensive lines — citation-based verification (Copilot) and human approval inboxes (Gemini CLI / Devin) — each have blind spots."
description: "Dissecting the security risks of agent memory systems through three documented attacks (SpAIware, MINJA, Bedrock poisoning), comparing two industry defense strategies, and surveying retention policies and privacy design."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-agent-memory-attack-surface)

You spent two weeks building an agent memory system — automatic fact extraction from conversations, cross-session persistence, injection into future contexts. On day one in production, a user hides an instruction inside a conversation. From that point on, your agent appends an external URL to every response, and your dashboard shows nothing unusual.

This is not hypothetical. In September 2024, security researcher Johann Rehberger demonstrated this full attack chain on the ChatGPT macOS app. He called it [SpAIware](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/).

This post covers the attack surface specific to agent memory systems — not general prompt injection, but attacks that exploit memory's persistence to turn a one-shot exploit into a permanent backdoor. Scope is limited to attacks and defenses with published technical write-ups.

## Why Memory Makes Prompt Injection Dangerous

Ordinary prompt injection is ephemeral: the attacker injects instructions into the current context and influences the current response. When the session ends, the attack vanishes.

Memory changes that equation. Agent memory systems automatically extract "facts worth keeping" from conversations, write them to persistent storage, and inject them into the context at the start of every future session. This means:

1. **The attack only needs to succeed once** — once the injected instruction is "learned" by the memory system, it replays in every future interaction
2. **The attacker doesn't need to be present** — the payload is stored in memory; the attacker can leave
3. **Blast radius expands** — if memory is shared across users (e.g., Copilot repo-level memory), a single injection affects everyone
4. **Detection is harder** — a planted memory looks like any other fact entry, triggering no immediate alerts

Under the MITRE ATLAS taxonomy, this falls under [AML.T0080](https://atlas.mitre.org/techniques/AML.T0080) — a memory-poisoning variant of AI Supply Chain Compromise. Microsoft's AI Red Team lists memory poisoning as a critical failure mode.

## Three Documented Attacks

### SpAIware: Persistent Data Exfiltration (2024-09)

Johann Rehberger's [SpAIware](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/) demonstrated the full attack chain:

1. The attacker plants text disguised as a user preference in a conversation
2. ChatGPT's memory system stores it as a normal fact
3. The planted instruction tells the model to encode conversation content as URL parameters and send them to the attacker's server via a Markdown image tag
4. Every subsequent new conversation triggers this exfiltration

The key finding: ChatGPT's memory system **cannot distinguish genuine user preferences from injected instructions**. The extraction LLM treats both identically. OpenAI patched the Markdown image rendering exfiltration path after disclosure, but the memory injection problem itself remains.

### MINJA: Conversation-Only Injection (NeurIPS 2025)

If SpAIware proved "planted memories are dangerous," [MINJA](https://arxiv.org/abs/2503.03704) (NeurIPS 2025 poster) proved "planting them is trivially easy."

MINJA's attack is pure conversation: the attacker needs no special privileges, just a normal chat with the agent. The research team used both black-box and white-box methods to generate injection text that the memory system stores as legitimate facts.

Per the paper, injection success rate exceeds **95%**.

Notably, they didn't test on toy systems — experiments ran on Mem0 and MemGPT (Letta's predecessor), two of the most widely used memory frameworks. Any system using automatic memory extraction is potentially vulnerable.

### Bedrock Agents Memory Poisoning (Unit 42, 2025-10)

Palo Alto Networks' Unit 42 team completed a memory poisoning proof-of-concept on AWS Bedrock Agents in their [October 2025 research](https://unit42.paloaltonetworks.com/indirect-prompt-injection-poisons-ai-longterm-memory/).

The attack vector is indirect prompt injection: planting instructions in external data the agent reads (web pages, documents), causing the agent to write malicious content into long-term memory. Per AWS documentation, poisoning defense falls under the [shared responsibility model](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) — AWS provides infrastructure security, but validating memory content is the application's job.

## The Common Pattern

The three attacks look different on the surface, but share the same core mechanism:

```
User / external input
  → LLM memory extraction (cannot distinguish facts vs. instructions)
    → Persistent storage (attack only needs to succeed once)
      → Injected every session (attack auto-replays)
        → Affects all subsequent interactions
```

The vulnerability is in step two: **the extraction LLM has no way to distinguish "this is the user's genuine preference" from "this is an attack instruction disguised as a preference."** This is not a bug in any specific implementation — it's a structural problem with the entire "use LLMs to automatically extract memories" design pattern.

## Two Lines of Defense

The industry developed two main defensive strategies in 2026:

### Citation + JIT Verification (Copilot Approach)

GitHub Copilot Memory has the most sophisticated defense to date, per its [engineering blog](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot):

- **Every memory carries a citation**: recording which code or conversation produced it
- **JIT verification**: when injecting memories at session start, the system checks whether the cited code still exists on the current branch. If the source code has been deleted or modified, the memory is dropped
- **28-day decay**: memories not verified through use are automatically deleted, giving attack payloads a natural expiration date
- **Write threshold**: only contributors with repo write access can produce repo-level memories

The core idea: **don't trust the content of memories, but trust their provenance**. Every memory has a verifiable source; lose the source, lose the memory.

Blind spot: citation verification can confirm the source exists, but not that the source content is benign. If an attacker has repo write access (e.g., an external contributor's PR), they can produce malicious memories with valid citations.

### Human Approval Inbox (Gemini CLI / Devin / LangSmith Approach)

The other camp hands write authority back to humans:

- **Gemini CLI Auto Memory** ([docs](https://geminicli.com/docs/cli/auto-memory)): background scans sessions idle 3+ hours, drafts memory patches and SKILL.md candidates into a review inbox, **effective only after user approval**. Auto Memory cannot directly modify active memory, settings, or credentials
- **Devin Knowledge Suggestions** ([docs](https://docs.devin.ai/product-guides/knowledge)): automatically suggests knowledge entries from conversation feedback, added to the organization's Knowledge base only after user approval
- **LangSmith Fleet**: memory updates require per-item user approval
- **Cursor 1.2**: added approval workflow for background-generated memories at GA (the entire Memories feature was later removed in 2.1.17)

The inbox logic: **humans are the final gate**. Regardless of what the LLM extracts, writes require a human sign-off.

Blind spot: approval fatigue. When the inbox stacks up with dozens of memory suggestions, users start batch-approving without reviewing each one — the same human-factors problem as ignored HTTPS certificate warnings.

## What Vendors Say

Several vendors include explicit security warnings in their memory documentation:

**Cursor Automations** ([docs](https://cursor.com/docs/cloud-agents/automations)) attaches a prompt injection warning directly to the Memories feature description, alerting developers that `MEMORIES.md` files may be injected.

**Anthropic's memory tool** ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)) explicitly states that memory operations are client-side; storage, tenant isolation, and TTL are entirely the application's responsibility, and path traversal must be prevented.

**AWS AgentCore** ([developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)) states that poisoning defense falls under shared responsibility.

These are not PR disclaimers — they are admissions: **we provide memory infrastructure, but content security is your problem**.

## Retention Policies and Privacy

Memory security extends beyond attack surfaces to "what gets stored, how long it lasts, and who can delete it."

### Consumer Products

All three major providers offer basic user controls (checked 2026-09):

| Capability | ChatGPT | Claude.ai | Gemini |
|---|---|---|---|
| View/delete individual memories | Settings > Personalization | Settings > Memory > Topics | /memory show |
| Disable entirely | ✓ | ✓ (Enterprise: disabling permanently deletes) | ✓ |
| No-memory mode | Temporary Chat | Incognito chat | Temporary Chat |

### Platform APIs

| Platform | Isolation | Deletion | ZDR Compatible |
|---|---|---|---|
| Anthropic memory tool | Application's responsibility | Application implements | Client-side, yes (but Covered Models require [30-day retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)) |
| Anthropic Managed Agents | Workspace | Redact (no restore), versions retained 30 days | Not applicable |
| OpenAI Responses API | `store` flag | Default 30-day retention; `store=false` for ZDR | `store=false` |
| Mem0 | `user_id` / `agent_id` (app convention) | `delete` / `batch_delete(≤1000)` / `delete_all`, hard delete | N/A |
| AWS AgentCore | Namespace + IAM condition key | Event expiry (3–365 days), long-term via strategy | Encrypted, optional CMK |
| Google Memory Bank | Scope + IAM Conditions | TTL field unconfirmed | VPC-SC, CMEK, HIPAA |
| Microsoft Foundry | Scope bound to Entra tenant | `default_ttl_seconds` | Not disclosed |

Worth noting: **open-source frameworks (Mem0, LangGraph, Graphiti) use application-side key conventions for isolation, with no built-in ACL**. If you build a multi-tenant system on Mem0, preventing Company A from seeing Company B's memories is entirely your code's job.

## If You're Building a Memory System

Based on the attacks and defenses above, some concrete recommendations:

**Minimum requirements**:
- Users can see what the agent has memorized (not a black box)
- Users can delete memories individually
- A no-memory mode exists (the equivalent of Temporary/Incognito chat)

**Recommended additions**:
- Write gates for memory (inbox approval or at minimum admin review) — per MINJA's findings, ungated automatic extraction is almost certainly injectable
- Citation provenance on memories — per Copilot's design, sourced memories can be verified and can auto-expire
- Decay or TTL — a memory system without forgetting is a permanent storage vault for attack payloads
- Multi-tenant isolation needs real ACL, not just key conventions

**B2B considerations**:
- Admins must be able to purge all memories for a specific user (a prerequisite for GDPR right-to-erasure)
- Shared memories (repo-level, org-level) need write access controls
- Consider whether memory content complies with data retention policies — the extraction LLM may store sensitive information (API keys, PII) as "facts"

## Where Memory Security Stands

MINJA's conclusion points to an uncomfortable reality: as long as a memory system uses LLM-based automatic extraction, structural injection risk exists. No system has fully solved this problem.

Per the [2026-04 memory security survey](https://arxiv.org/abs/2604.16548), existing mitigations fall into three layers:

1. **Write gates** (reduce attack entry): human approval, write access controls, content filtering
2. **Read verification** (reduce impact of injected attacks): citation verification, JIT checks, decay/TTL
3. **Observability** (enable attack discovery and cleanup): user-visible and editable memories, admin dashboards, audit logs

No single measure suffices. Copilot's citation verification solves "memory provenance is traceable" but not "anyone with write access can poison"; Gemini CLI's inbox solves "humans have final say" but not "humans get tired."

In practice, **all three layers** is the 2026 minimum.

## References

- [SpAIware: persistent data exfiltration via ChatGPT memory — Johann Rehberger (2024-09)](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [MINJA: Memory Injection Attacks on LLM Agents via Query-Only Interaction — NeurIPS 2025 (arXiv 2503.03704)](https://arxiv.org/abs/2503.03704)
- [Indirect prompt injection poisons AI long-term memory — Unit 42 (2025-10)](https://unit42.paloaltonetworks.com/indirect-prompt-injection-poisons-ai-longterm-memory/)
- [Building an agentic memory system for GitHub Copilot — GitHub Engineering](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Copilot Memory concepts — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Gemini CLI Auto Memory docs](https://geminicli.com/docs/cli/auto-memory)
- [Devin Knowledge docs](https://docs.devin.ai/product-guides/knowledge)
- [Cursor Automations docs](https://cursor.com/docs/cloud-agents/automations)
- [Anthropic memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Anthropic Managed Agents Memory docs](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [AWS AgentCore Memory developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [MITRE ATLAS AML.T0080](https://atlas.mitre.org/techniques/AML.T0080)
- [A Survey on Security of Long-Term Memory (arXiv 2604.16548)](https://arxiv.org/abs/2604.16548)
