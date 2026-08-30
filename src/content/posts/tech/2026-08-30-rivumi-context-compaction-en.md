---
title: "Rivumi context pressure, compaction, and workspace reinjection"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, context-window, compaction, checkpoint]
lang: en
tldr: "Near 85% context pressure, Rivumi has two distinct paths: the native loop can apply one bounded deterministic history fallback, while a conversation runtime with native compaction can compact after a completed turn. Both paths re-anchor the next request with workspace context."
description: "Distinguish Rivumi native-loop history fallback from conversation-runtime compaction and trace thresholds, hooks, checkpoints, and post-compaction workspace reminders."
series:
  name: "Rivumi Architecture Notes"
  order: 13
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-context-compaction)

The [state-first journal article](/posts/tech/2026-08-23-rivumi-state-first-event-journaling-en) explained durable run state. A long session also accumulates messages and tool observations. Rivumi has two different pressure paths, and treating both as the same automatic summary would blur their contracts.

## Two thresholds with different denominators

A conversation runtime can auto-compact only when it advertises `native_compaction`, reports a known context window, and reaches 85% occupancy. The TUI requests compaction after a completed turn.

Native `AgentRunner` instead compares usage with the task's `max_total_tokens`. At 85% it injects a one-shot pressure reminder and, when enough old history exists, applies its own summary fallback. Provider context capacity and task budget are not interchangeable.

## Native-loop fallback is bounded and lossy

The fallback runs at most once. It protects the first two messages, retains the latest four, and requires at least two eligible older items. The boundary extends across adjacent tool observations so a call is not separated from its result.

A pre-compact hook may deny the operation. Otherwise `build_history_summary_fallback_message()` deterministically renders bounded previews of old messages and tool results into injected context. It does not call another model for a semantic summary and explicitly tells the model to trust current repository state and retained recent output. A post hook and journal event record completion.

## Conversation compaction has a lifecycle

`ConversationController.compact_context()` serializes compaction with turns. For native support it runs a pre hook, delegates to the session, and drains events until the matching `CompactionCompletedEvent`, then runs the post hook. Without native support, the controller can create a local semantic checkpoint.

`ContextCheckpoint` requires summarized and retained turn IDs to be disjoint and prevents reported occupancy from increasing. A provider-native completion may carry lifecycle only and no Rivumi checkpoint; Rivumi does not fabricate one.

## The next request is re-anchored

After native-loop fallback, Rivumi injects a one-shot bounded snapshot of changed files, check status, recent paths, allowed paths, verification, remaining steps, and token limits. After conversation-runtime compaction, the TUI similarly marks a reminder pending and prepends changed paths plus runtime, mode, permission, and workspace constraints to the next request.

Compaction therefore accepts information loss but restores the facts most likely to prevent a wrong edit. The [next article](/posts/tech/2026-08-30-rivumi-native-mcp-authorization-en) continues with native MCP transport and authorization.

---

## References

- [Context runtime semantics](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/runtime_semantics.py)
- [Native-loop compaction flow](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [Conversation controller](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_controller.py)
- [Prompt reminders](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/prompts.py)
- [Context semantics tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_runtime_semantics.py)
