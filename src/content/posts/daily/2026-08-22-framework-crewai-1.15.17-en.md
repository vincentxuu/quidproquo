---
title: "Framework Update | CrewAI 1.15.17"
date: 2026-08-22
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: en
description: "CrewAI 1.15.17 lets declarative (YAML/JSON) Flow definitions drive the experimental conversational Flow mode directly, eliminating the need to hand-write Python subclasses"
tldr: "CrewAI 1.15.17 highlights: (1) declarative Flow definitions can now enable conversational mode — the framework auto-synthesizes built-in conversation methods, no Python `Flow` subclass required; (2) conversational mode is explicitly marked as opt-in to reduce misuse risk; (3) fixes for AMP slug loss during slug-reference tool resolution and chunking of oversized single messages. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 4
---

> 🌏 [中文版](/posts/daily/2026-08-22-framework-crewai-1.15.17)

## Version Info

| Item | Value |
|---|---|
| Framework | CrewAI |
| Version | v1.15.17 |
| Previous | v1.15.16 |
| Release Date | 2026-08-20 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.17) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 57.4k |

## Why This Release Matters

Since 1.15.0, CrewAI has been expanding "declarative Flows" — defining entire Flows in YAML/JSON (`methods`, `start`, `listen`, `do`, etc.) and loading them via `Flow.from_declaration()` without writing Python `Flow` subclasses. In parallel, CrewAI has had an experimental conversational Flow feature that gives Flows multi-turn conversation capabilities (`handle_turn()`, conversation routing, message history), but until now it could only be activated by manually setting `conversational = True` on a Python subclass. Version 1.15.17 connects these two tracks: declarative definitions can now drive conversational mode, with the framework auto-synthesizing the corresponding built-in conversation methods. Teams using YAML/JSON Flow definitions no longer need to fall back to Python classes just to get multi-turn conversation support. This release also makes it clearer that conversational mode is an experimental, opt-in feature, preventing users from mistaking it for default behavior.

## Key Changes

- **Declarative Flows can drive conversational mode (Enable declarations to drive conversational mode)**: Declarative (YAML/JSON) Flow definitions can now activate conversational mode → Flows loaded via `Flow.from_declaration()` get multi-turn conversation capabilities without being rewritten as Python subclasses
- **Auto-synthesize built-in conversational methods (Synthesize built-in conversational methods for declarations)**: The framework automatically assembles conversation handler methods from declarative definitions → less boilerplate wiring code
- **Documentation update (Add declarative conversational flows documentation)**: Official docs added for declarative conversational Flows
- **Opt-in semantics made unmistakable (Make conversational opt-in unmistakable)**: Makes it harder to overlook or misuse the fact that conversational mode must be explicitly enabled
- **AMP slug preserved on tool resolution (Carry the AMP slug on tools resolved from a slug reference)**: Tools resolved via slug references now carry the corresponding AMP slug → affects integration scenarios using slug-referenced shared tool libraries
- **Oversized single message chunking (Handle oversized single messages during chunking)**: Chunking logic now handles oversized single messages, preventing errors in memory/RAG chunking pipelines for extra-long inputs

## Breaking Changes

No breaking changes in this release. Conversational Flow itself is still marked as experimental (under `crewai.experimental`) and its behavior may change in future versions.

## Migration Guide

Upgrade directly — no code changes required:

```bash
pip install --upgrade crewai==1.15.17
```

Conversational Flows are still primarily driven via Python subclasses (starting from 1.15.17, declarative Flows can also enable the same toggle — see the official docs on declarative conversational Flows for details):

```python
from crewai import Flow
from crewai.flow import listen
from crewai.experimental.conversational import ConversationConfig, ConversationState

@ConversationConfig(defer_trace_finalization=True)
class SupportFlow(Flow[ConversationState]):
    conversational = True

    def route_turn(self, context: dict) -> str | None:
        message = (self.state.current_user_message or "").lower()
        if "order" in message:
            return "order"
        return "converse"

    @listen("order")
    def handle_order(self) -> str:
        reply = "Your order is on the way."
        self.append_assistant_message(reply)
        return reply

flow = SupportFlow()
try:
    flow.handle_turn("Where is my order?")
finally:
    flow.finalize_session_traces()
```

## Cross-Framework Observations

CrewAI's approach in this release is telling: they first split "declarative definitions" and "Python subclasses" into two parallel Flow construction paths, then progressively port subclass-only capabilities (this time, conversational mode) into the declarative system. Compared to LangGraph, which still primarily relies on Python/graph API for construction, CrewAI is betting earlier that "configuration over code" will be the path more teams take when adopting agent frameworks.

## Takeaway

I previously assumed "declarative Flows" and "conversational Flows" were two independent experimental features in CrewAI, each advancing on its own track. This release made it clear that the framework team treats them as two interfaces to the same construction model — the functionality is developed once (conversation routing, message history, `handle_turn` lifecycle), and the only difference is whether you drive it with a Python subclass or a YAML/JSON declaration. This means subclass-only features will likely be progressively backfilled into the declarative system, rather than diverging into two permanently out-of-sync APIs.

## References

- [CrewAI 1.15.17 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.17)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [Conversational Flows — CrewAI Docs](https://docs.crewai.com/en/guides/flows/conversational-flows)
- [CrewAI 1.15.0 — GitHub Release (declarative Flow loading first introduced)](https://github.com/crewAIInc/crewAI/releases/tag/1.15.0)
