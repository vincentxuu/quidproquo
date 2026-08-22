---
title: "AG2: Organizing Multi-Agent Collaboration with Conversations and GroupChat"
date: 2026-08-22
category: ai
type: deep-dive
tags: [ag2, ai-agent, multi-agent, autogen, orchestration, python]
lang: en
tldr: "AG2 continues AutoGen's ConversableAgent model: agents collaborate through messages, while GroupChatManager selects the next speaker by round robin, manual choice, randomness, or an LLM."
description: "An introduction to AG2's ConversableAgent, tools, GroupChat, multi-agent orchestration, and its practical boundaries."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-ag2-multi-agent-framework)

[AG2](https://docs.ag2.ai/latest/) is an open-source Python framework for agents and multi-agent workflows. Its central abstraction is not a graph node or fixed task but a conversable agent: each role can receive messages, call a model, run tools, answer another agent, or wait for human input.

Developers familiar with early AutoGen will recognize the `autogen` import and `ConversableAgent`. The installation guide states that `autogen` and `ag2` are aliases for the same PyPI package. This is also the main naming trap: AG2 and Microsoft's later Microsoft Agent Framework are separate projects.

## ConversableAgent is the common base

The [official guide](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/conversable-agent/) identifies `ConversableAgent` as AG2's fundamental class. A name, system message, and model configuration establish the role; tools, human input, termination rules, and reply functions extend it.

```python
from autogen import ConversableAgent, LLMConfig

llm_config = LLMConfig({"api_type": "openai", "model": "gpt-5-nano"})
reviewer = ConversableAgent(
    name="reviewer",
    system_message="Review the draft and return concrete corrections.",
    llm_config=llm_config,
)
result = reviewer.run(message="Review this release note.", max_turns=2)
result.process()
```

`run()` returns an event iterator rather than finished text. Applications can consume events for a UI, logging, or approvals; `process()` is a console helper. Production code should therefore inspect events and outcomes instead of treating printed output as success.

## GroupChat turns speaker choice into orchestration

With more than two roles, [GroupChat](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/) keeps a shared conversation thread and lets `GroupChatManager` choose the next speaker. Built-in strategies include round robin, random, manual, and LLM-selected routing. Transition constraints can prevent arbitrary handoffs.

This fits researcher-writer-reviewer collaboration because “who should act next?” is the central uncertainty. The tradeoff is less predictable behavior and cost. Automatic speaker selection is itself a model decision, while shared history keeps expanding. Put hard limits on rounds, tools, and termination conditions, then trace why each turn occurred.

## Conversation history is not a business checkpoint

AG2 records who said what, but a message list does not automatically become replayable order, approval, or pipeline state. External side effects still need idempotency keys, and approvals lasting days require a database or durable runtime.

AG2 is therefore a strong fit for role-based prototypes, human-in-the-loop conversations, and existing AutoGen codebases. For fixed ETL, payment, or precisely resumable workflows, keep authoritative state elsewhere and use AG2 only where language-model judgment is needed.

## Overall

AG2 makes multi-agent coordination read like a conversation instead of a state machine. Start with two roles and round robin, then compare success rate, token cost, and latency against a single-agent baseline. Add automatic speaker selection only when role separation produces measurable value. For the wider landscape, see the [agent framework selection guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en).

## References

- [AG2 documentation](https://docs.ag2.ai/latest/)
- [Installing AG2](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/installing-ag2/)
- [ConversableAgent](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/conversable-agent/)
- [AG2 GroupChat](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- [On this site: choosing an agent framework in 2026](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
