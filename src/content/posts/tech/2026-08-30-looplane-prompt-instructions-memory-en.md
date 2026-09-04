---
title: "Looplane prompts, instruction precedence, and explicit memory: what the model actually sees"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, prompt-engineering, memory, agents-md]
lang: en
tldr: "Looplane resolves user and root-to-leaf project instructions before rendering named prompt sections for runtime, skills, workspace state, and the latest 20 explicit memories. The pipeline is traceable and reloadable, but it is not semantic memory and repository text does not become system authority."
description: "Trace how Looplane resolves AGENTS.md and LOOPLANE.md, builds named system-prompt sections, loads typed JSONL memory, and reinjects changed project context."
series:
  name: "Looplane Architecture Notes"
  order: 3
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-looplane-prompt-instructions-memory)

The [previous article](/posts/tech/2026-08-23-looplane-disposable-clone-run-bundle-en) separated the source repository, disposable workspace, and run artifacts. Before a model can work inside that workspace, Looplane must decide which rules, runtime facts, and prior explicit memories belong in the request. It does this through a bounded context pipeline rather than an unstructured prompt concatenation.

## From files to the first model request

`AgentRunner._initial_messages()` collects explicit memory, resolved instruction documents, skills, tool metadata, runtime facts, and workspace state. `build_coding_agent_system_prompt()` renders the result as named, versioned sections. Stable core, tool, and interaction sections come first; dynamic runtime, instruction, skill, workspace, and memory sections follow. The user task remains a separate user message.

```text
stable core / tool / interaction
            ↓
runtime → instructions → skills → workspace → memory
            ↓
        user task
```

The layout exposes provenance and gives cache-aware adapters a stable prefix. Provider cache hints are covered in [order 6](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost-en).

## Precedence is resolved by the application

Looplane loads configured user instructions, then walks from the project root toward the active directory looking for `AGENTS.md` or `LOOPLANE.md`. A deeper override suppresses earlier project layers while preserving the user layer. Diagnostics retain both active and suppressed documents.

Instruction files must be bounded regular UTF-8 files and cannot be symlinks. These checks make discovery deterministic, but they do not elevate repository text to provider-level system or developer authority. The application chooses what project context to render; mechanical tool, permission, and sandbox enforcement remains outside the prose prompt.

## Memory is explicit and deliberately small

`/remember` accepts typed user preferences, project facts, and project preferences, then appends them to JSONL. Retrieval selects user preferences plus entries for the exact project and injects only the latest 20 as known context.

There is no embedding retrieval, semantic ranking, decay, deduplication, update, delete, or automatic extraction from every turn. Invalid JSONL rows are skipped. This baseline is useful for facts such as a package manager or a language preference, but it should not be presented as a complete long-term memory system.

## Context can change during a run

Looplane fingerprints instruction and project-context inputs. If either changes, it resolves the sources again and appends bounded injected context describing the new state. An invalid reload emits an event without replacing previously valid context. The event journal therefore records when the model was told about a changed rule instead of pretending the initial prompt never drifted.

The guarantee here is source-aware, bounded context assembly—not perfect model compliance. The [next article](/posts/tech/2026-08-23-looplane-provider-neutral-agent-loop-en) follows these messages through the native model/tool loop.

---

## References

- [Looplane repository](https://github.com/vincentxuu/looplane)
- [Instruction resolution source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/instructions.py)
- [Prompt builder source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/prompts.py)
- [Explicit memory source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/memory.py)
- [Looplane tests at the reviewed revision](https://github.com/vincentxuu/looplane/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
