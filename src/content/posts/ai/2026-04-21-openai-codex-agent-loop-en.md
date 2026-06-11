---
title: "Inside the Codex Agent Loop: How OpenAI Keeps AI Agents Iterating"
date: 2026-04-21
type: guide
category: ai
tags: [codex, agent-loop, openai, responses-api, prompt-caching, context-window]
lang: en
tldr: "A detailed look at OpenAI's Codex agent loop design: how prompts are constructed, how multi-turn conversations are managed, how prompt caching prevents cost explosions, and how context window auto-compaction works."
description: "A first-hand breakdown of how the Codex agent loop works based on OpenAI's own engineering article. Covers prompt construction order, tool call execution flow, prompt caching strategies, and the auto-compact mechanism — essential reading for engineers building AI agents."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-21-openai-codex-agent-loop)

OpenAI engineer Michael Bolin published a detailed technical article in January 2026 explaining how the agent loop behind Codex CLI works. This post distills the most interesting engineering design decisions: prompt construction order, multi-turn conversation management, cost control through prompt caching, and what happens when the context window is about to overflow. If you're building your own AI agent, these design patterns are worth studying carefully.

## The Basic Structure of the Agent Loop

The Codex agent loop isn't complicated. It can be described as a simple loop:

1. Receive user input
2. Construct the prompt (assemble all necessary information)
3. Call the Responses API for inference
4. If the model returns a tool call, execute it, append the result to the conversation, and go back to step 3
5. If the model returns an assistant message, this turn is complete

There's nothing novel about this design itself — standard ReAct architectures all work this way. The interesting part lies in the details of each step.

## Prompt Construction Order

Each time the agent loop is entered, Codex assembles the entire prompt from scratch in a fixed order:

**System message (instructions)**: Placed first, containing model-specific instructions. Different versions of the Codex model have different expectations for format and instruction style, so this section is customized based on the model being used.

**Tools definition**: All available tool schemas are included here — `shell` (execute commands), `update_plan` (update the task plan), `web_search`, and any plugged-in MCP tools.

**Input items**: These are the actual conversation contents, in order:
- `permissions message` (role: `developer`): Declares what operations the model is allowed to perform in this sandbox environment
- `developer_instructions`: Developer settings read from `config.toml`
- `user instructions`: Aggregated `AGENTS.md` content from the project directory, letting the model understand the project's conventions
- `environment_context`: Current working directory and shell state
- `user message`: The user's actual input

This ordering is itself a design choice. Placing permissions and developer instructions before the user message ensures the model has sufficient context before processing the user's request. The `AGENTS.md` aggregation mechanism is also practical: it traverses up to parent directories looking for `AGENTS.md` files, allowing monorepos to place common rules in the repo root while each sub-project adds its own rules.

## The Cost Problem of Multi-Turn Conversations

The agent loop carries the entire conversation history with each inference call. This is the correct approach (the model needs context), but the tradeoff is that prompts keep growing. For a task that executes a dozen tool calls, the input token count in later inferences can be several times larger than at the start.

Codex deliberately **does not use** `previous_response_id` (a stateful conversation management feature provided by the Responses API). The reason is that staying stateless supports Zero Data Retention (ZDR) policies, which is important for enterprise customers. Each inference carries the complete history, so the API side doesn't need to remember anything.

The cost of this approach is that the full prompt must be sent every time, making costs appear O(n squared) — round 1 has 1 token, round 2 has 2, round 3 has 3... the sum grows quadratically.

## How Prompt Caching Saves on Cost

This is where prompt caching becomes the key solution. The Responses API caches prompt prefixes. If the prefix of consecutive inference calls is identical, only the newly appended portion requires actual computation — the previously cached prefix is essentially free.

This brings costs down from O(n squared) back to O(n): each inference only pays full token costs for the newly added segment, while the previously cached prefix is nearly free.

**But the prefix must be exactly identical for a cache hit**, and this constraint reveals several common pitfalls:

- **Mid-conversation tool modifications**: If you insert or remove tools mid-conversation, the tools definition changes, and the cache is invalidated. From that point on, every inference pays full cost.
- **Switching models**: Different models have different instructions, meaning different prefixes, resulting in cache misses.
- **Modifying sandbox settings**: Changes to the permissions message or environment_context similarly break the cache.

Codex's solution is elegant: any mid-conversation configuration change **appends a new message** to declare the change rather than modifying existing messages. This keeps the prompt prefix unchanged, the cache remains valid, and only the latest appended portion requires new computation.

This principle is worth remembering: **append-only, never modify**.

## What Happens When the Context Window Is Full

Even the longest context window has a limit. When conversation history accumulates close to the token limit, Codex calls a special `/responses/compact` endpoint.

This endpoint's job is to compress the existing conversation history into a **compaction item**. This compressed item contains an encrypted latent understanding — the model's "comprehension" of the current conversation state, stored in a compact form. Subsequent inferences use this compaction item instead of the original lengthy history, freeing up context window space.

The key design principle here is **transparency to the user**: compaction happens in the background, the agent continues working, and the user doesn't perceive any interruption. At the same time, because the compaction item is encrypted, it also supports ZDR policies — even if the compressed state is stored somewhere, it cannot be read or reconstructed.

## Putting It All Together

The core of the Codex agent loop design is finding balance among several competing objectives:

- **Stateless vs. cost**: Not using `previous_response_id` enables ZDR support, while prompt caching compresses O(n squared) costs back to O(n)
- **Flexibility vs. cache efficiency**: Allowing mid-conversation configuration changes while requiring append-only (rather than modify) operations to keep the cache prefix stable
- **Unbounded tasks vs. context limits**: Using auto-compact to let the agent handle very long tasks while maintaining ZDR compatibility

For engineers building their own AI agents, this architecture offers several practices worth adopting directly: fixed prompt construction order, append-only mid-conversation update strategies, and making compaction a transparent background operation rather than a user-perceived interruption.

---

## References

- [Unrolling the Codex agent loop — OpenAI](https://openai.com/index/unrolling-the-codex-agent-loop/) (Michael Bolin, January 23, 2026)
- [OpenAI Codex CLI — Agent Loop Source Code and Prompt Caching Implementation](https://github.com/openai/codex)
- [OpenAI Responses API — Context Window Management and Agent Loop Multi-Turn Design](https://platform.openai.com/docs/api-reference/responses)
