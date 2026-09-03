---
title: "Framework Update | CrewAI 1.15.18"
date: 2026-08-28
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: en
description: "CrewAI 1.15.18 promotes conversational Flow from experimental to a stable API, moving the canonical import path to crewai.flow while keeping crewai.experimental working via compatibility shims"
tldr: "CrewAI 1.15.18 highlights: (1) conversational Flow is officially promoted from crewai.experimental to a stable API — the canonical implementation moves to crewai.flow, while crewai.experimental.conversational stays importable as a compatibility alias, so existing code doesn't break; (2) the shim currently emits no deprecation warning, so migrating is entirely opt-in for now; (3) also fixes a wrong Claude Sonnet 4.6 context-window mapping and a too-low Anthropic max_tokens default for large tool calls. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 8
---

> 🌏 [中文版](/posts/daily/2026-08-28-framework-crewai-1.15.18)

## Version Info

| Item | Value |
|---|---|
| Framework | CrewAI |
| Version | v1.15.18 |
| Previous | v1.15.17 |
| Release Date | 2026-08-27 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.18) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 57.7k |

## Why This Release Matters

[The previous post (1.15.17)](/en/posts/daily/2026-08-22-framework-crewai-1.15.17-en) covered how declarative Flows learned to drive conversational mode, while the whole conversational Flow feature still lived under `crewai.experimental` — officially flagged as "behavior may change in future versions." 1.15.18 is the follow-through on that flag: `crewai.flow` now owns the canonical implementation of conversational Flow (`ConversationConfig`, `ConversationState`, `handle_turn`, `stream_turn`, and friends), meaning this API is no longer a "might change any time" experiment but a stable interface the framework commits to maintaining. For projects already using `crewai.experimental.conversational`, this upgrade won't break anything immediately — the old path becomes a compatibility alias pointing at the new module — but it also signals that going forward, official docs and examples will consistently point to `crewai.flow`, and the old path will gradually read as the outdated way to do it.

## Key Changes

- **Conversational Flow promoted to a stable API (Promote conversational flows to stable)**: the canonical implementation moves from `crewai.experimental.conversational` to `crewai.flow` → new code should use `from crewai.flow import ConversationConfig, ConversationState, handle_turn, stream_turn`
- **Old path kept alive via shims (compatibility aliases)**: `crewai.experimental.conversational` and `crewai.experimental.conversational_mixin` become `sys.modules` aliases pointing at the new modules → existing `from crewai.experimental import ...` code keeps running unchanged
- **Declarative conversational Flow gains more coverage**: declarations can now name a router's response format, a chat flow can declare its own state shape, and conversational declarations accept crew-style LLM config → further narrows the gap between the declarative path and Python subclasses
- **Documentation updated across four languages**: conversational Flow docs now point to the new `crewai.flow` examples

## Breaking Changes

No breaking changes in this release. `crewai.experimental.conversational` still imports fine today, and during PR review someone flagged that the current compatibility shim emits no deprecation warning — so continuing to use the old path won't nudge you to migrate. Whether to move to `crewai.flow` is, for now, entirely on you to track from the release notes.

## Migration Guide

Upgrading won't break anything, but it's worth switching the import while you're at it:

```bash
pip install --upgrade crewai==1.15.18
```

```python
# Old (1.15.17 and earlier — still works, but no longer the canonical path)
from crewai.experimental.conversational import ConversationConfig, ConversationState

# New (stable path as of 1.15.18)
from crewai.flow import ConversationConfig, ConversationState, handle_turn, stream_turn
```

How you enable conversational mode on a `Flow` subclass is unchanged — only the import source is worth swapping:

```python
from crewai import Flow
from crewai.flow import ConversationConfig, ConversationState, listen

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
```

## Cross-Framework Observations

"Let a feature live under an `experimental` namespace, promote it into the main package once the API settles, and keep a compatibility shim during the transition" is a relatively conservative, user-friendly approach — a contrast to Agno 3.0.0's aggressive route of overhauling APIs outright and requiring a database migration. CrewAI does skip one step here, though: the shim carries no deprecation warning, which leaves the "should I migrate" call entirely to developers watching the changelog — a notch weaker than how the Python standard library or most mature frameworks handle it (shim plus an actual `DeprecationWarning`).

## Takeaway

The previous post's "Takeaway" guessed the right direction — subclass-only features getting progressively backfilled into the declarative system — but this release surfaces a different layer: a feature being "stable" isn't just a claim in the docs. It also means checking whether the code actually moved out of the `experimental` namespace, whether a compatibility layer exists, and whether that layer actually warns you to migrate. CrewAI nailed the first two here; the third (a deprecation warning) is still missing — this kind of half-finished stabilization is common enough in open source projects that it's worth watching whether it gets completed later.

## References

- [CrewAI 1.15.18 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.18)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [PR #7107 — feat(flow): promote conversational flows to stable](https://github.com/crewAIInc/crewAI/pull/7107)
- [CrewAI 1.15.17 — previous framework update](/en/posts/daily/2026-08-22-framework-crewai-1.15.17-en)
