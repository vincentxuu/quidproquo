---
title: "Learning Design from Mature Coding Agents (22): The Gateway Pattern — Turning Any Provider into an OpenAI-Compatible Endpoint"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 22
tags: [coding-agent, harness-engineering, llm-api, api-gateway, openai-compatible, llm-agents]
lang: en
description: "How pi, OMP, OpenCode, Codex, and Claude Code handle the OpenAI-compatible endpoint problem — three shapes: native multi-dialect clients, protocol translators, and controlled egress proxies — compared with rivumi's pure-ASGI gateway, its strict translation boundary, and an event-loop lifecycle lesson."
tldr: "The ecosystem treats /v1/chat/completions as the lingua franca, but your providers don't all speak it. The five reference projects split into three camps: pi and OpenCode make the client speak every dialect natively so no gateway is needed; OMP builds a real protocol translator (foreign wire → neutral context → provider adapter, no raw passthrough); Codex and Claude Code run proxies that translate nothing and exist purely to force traffic through a controllable path. Rivumi copies OMP's boundary but narrows it to one wire in, one out: strictly parse OpenAI Chat into a canonical contract, then dispatch to any ModelProvider — and along the way hit a cross-event-loop client-close bug whose lesson is that provider lifecycles belong to the ASGI lifespan, not the signal handler."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-gateway-pattern)

## The design problem

The LLM ecosystem has an unwritten consensus: everyone speaks the OpenAI dialect. Ollama, vLLM, and LM Studio expose `/v1/chat/completions`-compatible endpoints; eval tools, IDE extensions, and agent frameworks all default to this interface. Projects like [LiteLLM](https://docs.litellm.ai/) exist almost entirely to unify a hundred-plus providers into OpenAI format.

Your agent's internals may not work that way. The previous article argued that wire protocol should be separated from provider identity — your harness may ship adapters for Anthropic Messages, Gemini, and Workers AI, while the tools around it only know how to hit `/v1/chat/completions`. The reverse also happens: your agent speaks one dialect, but the engine you want to connect speaks another.

So there are really two design questions. First, **should you build a gateway at all** — if the client can already speak multiple dialects, a gateway is redundant. Second, if you do build one, **is it a translator or a checkpoint** — parse and re-encode incoming requests, or pass them through untouched but force them onto a controlled path? That choice determines what your security boundary looks like.

## What the five do

### pi: no gateway; the client speaks many dialects natively

pi's position is the most direct: the provider layer already supports `openai-completions`, `openai-responses`, `anthropic-messages`, and more, so connecting Ollama, LM Studio, or vLLM means adding a custom provider entry in models.json (`pi-mono/packages/coding-agent/docs/providers.md`, "Custom Providers"). How deep does this go? Even Ollama-specific context-overflow error strings ("prompt too long; exceeded max context length by X tokens") are matched by overflow-detection regexes (`pi-mono/packages/ai/src/utils/overflow.ts`). When the client already speaks every dialect, a gateway adds nothing.

### OpenCode: custom baseURL is client routing, not a gateway

OpenCode also skips the gateway. Its flexibility comes from configuration: providers can carry a `baseURL` (`opencode/packages/core/src/v1/config/provider.ts`), and generic OpenAI-compatible endpoints map straight onto `@ai-sdk/openai-compatible` (`opencode/packages/core/src/v1/config/provider-options.ts`). Genuinely special providers (Codex subscriptions and the like) get a custom fetch plugin that rewrites URLs and headers. It's "swap the base URL," not "run a new service."

### OMP: the only real protocol translator

OMP's `omp auth-gateway serve` (`oh-my-pi/packages/coding-agent/src/commands/auth-gateway.ts#AuthGateway`) is the only true gateway among the five. The core lives in `oh-my-pi/packages/ai/src/auth-gateway/server.ts#startAuthGateway`, whose header comment pins the pipeline: "foreign wire → omp Context → pi-ai stream() → omp events → foreign wire" — **pure protocol translation, no raw passthrough**. The route table accepts three foreign formats (`server.ts#handleFormatEndpoint`): `/v1/chat/completions`, `/v1/messages`, `/v1/responses`, each backed by a FormatModule — for instance `oh-my-pi/packages/ai/src/providers/openai-chat-server.ts#parseRequest` parses incoming requests with a strict schema and `#encodeResponse` re-encodes neutral results back into OpenAI shape. Credentials are injected by the auth broker; clients never see provider tokens. The default bind is `127.0.0.1:4000` (`oh-my-pi/packages/ai/src/auth-gateway/types.ts#DEFAULT_AUTH_GATEWAY_BIND`) with timing-safe bearer comparison (`oh-my-pi/packages/ai/src/auth-gateway/http.ts#isAuthorized`).

### Codex: a proxy that translates nothing, only enforces traffic control

`codex/codex-rs/responses-api-proxy/src/lib.rs#forward_request` is the opposite extreme: this local proxy **only** allows `POST /v1/responses`; any other method or path gets a 403. It never parses bodies. It does four things — bind loopback only (`lib.rs#bind_listener`), read the auth header from stdin so it never touches argv or environment variables (`codex/codex-rs/responses-api-proxy/src/read_api_key.rs#read_auth_header_from_stdin`), mark the injected header sensitive, and optionally dump the entire exchange to disk (`--dump-dir`). It launches as a `codex responses-api-proxy` subcommand (`codex/codex-rs/cli/src/main.rs#ResponsesApiProxy`). Its value isn't compatibility — it's that **model traffic from child processes has exactly one controlled path**: policy, observation, and shutdown each get a single lever.

### Claude Code: egress proxy, a third concept

Claude Code's `src/upstreamproxy` is different again: container-side egress control. `claude-code-source/src/upstreamproxy/upstreamproxy.ts#initUpstreamProxy` starts a CONNECT-over-WebSocket relay inside a CCR session container (`claude-code-source/src/upstreamproxy/relay.ts#startUpstreamProxyRelay`), then `upstreamproxy.ts#getUpstreamProxyEnv` injects `HTTPS_PROXY`, `NO_PROXY`, and a custom CA bundle into every agent subprocess. The `NO_PROXY_LIST` allowlist excludes loopback, RFC1918, IMDS, and package registries. The token is even protected with `prctl(PR_SET_DUMPABLE, 0)` against ptrace-based heap scraping. This is not protocol translation — it's the maximal version of "a local proxy as a mandatory traffic-control point."

Three shapes, summarized: **native multi-dialect** (pi, OpenCode — don't build), **protocol translator** (OMP), **controlled egress** (Codex, Claude Code). The first's cost is maintaining every dialect client-side; the other two's cost is running a local service.

## rivumi's choice, and where it differs

Rivumi needs the first scenario: letting OpenAI-only tools reach any provider behind the canonical `ModelProvider`. So it copies OMP's boundary but narrows it harder.

`rivumi/src/rivumi/gateway.py#ModelGateway` is a pure-ASGI translator whose module docstring says it outright: it translates foreign wire messages into `ConversationItem` values before invoking a provider, and "is not an arbitrary HTTP passthrough and therefore cannot be used to select an upstream URL." Where OMP translates three formats in and out, rivumi is one in, one out: it accepts only OpenAI Chat Completions and returns OpenAI Chat shape, with `/healthz` and `/v1/models` as the sole auxiliary endpoints, and `stream=true` rejected outright (`gateway.py#_parse_chat_request`).

It is stricter than OMP's schema parsing: tool messages must reference a previously seen `tool_call_id`, and IDs must be globally unique (`gateway.py#_parse_messages`); tool-call `arguments` must be a valid JSON object, not a string (`gateway.py#_parse_tool_calls`). The model is pinned at construction time — any other model id gets a 404. That's not a flexibility gap; it nails the gateway to exactly one configured provider. Security details include a 1 MiB request cap (`gateway.py#_read_json`), bearer checks via `hmac.compare_digest` (`gateway.py#_authorize`), and one deliberate rule: unexpected exceptions always return a generic 502, because SDK exception strings can contain request headers or credentials. Loopback-only binding is enforced at the CLI layer (`rivumi/src/rivumi/cli.py#serve_gateway`).

M2 testing left a lesson worth recording: on the first Ctrl-C shutdown, the httpx client was closed on the wrong event loop and blew up. The fix was handing the provider's entire lifecycle to ASGI lifespan — `gateway.py#_lifespan` calls `provider.aclose()` only when it receives `lifespan.shutdown`, enabled via `uvicorn.run(gateway, ..., lifespan="on")` (`cli.py#serve_gateway`). The second shutdown exited cleanly, and the same test round produced health, model catalog, and `GATEWAY_OK`. The lesson is simple: async clients live and die with the event loop that owns them, not with signal handlers.

## Evidence base

OpenAI Chat Completions became the de facto standard with vendor backing: [Ollama's OpenAI compatibility doc](https://github.com/ollama/ollama/blob/main/docs/openai.md) describes how it serves `/v1/chat/completions`, and [vLLM ships a built-in OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html). The [official OpenAI API reference](https://platform.openai.com/docs/api-reference/chat) remains the dialect's normative source. But "compatible" never means "synonymous" — whether tool-call `arguments` is a JSON string or an object, which `finish_reason` values exist, what usage fields mean — every implementation differs somewhere, which is precisely what LiteLLM buys with its whole [translation layer](https://docs.litellm.ai/). OMP's "no raw passthrough" decision and rivumi's strict parsing share one judgment: **the translation boundary is the validation boundary** — every field you let through unchecked is debt you repay later. Codex and Claude Code, meanwhile, demonstrate the other half of a proxy's value: you can only enforce policy on traffic you can see.

## What could improve

1. **Streaming.** `stream=true` is currently rejected, so first-token latency on long responses is entirely the client's problem. OMP's `oh-my-pi/packages/ai/src/providers/openai-chat-server.ts#encodeStream` already demonstrates SSE chunk encoding — a direct reference.
2. **More wires in.** Adding `/v1/messages` would let Anthropic-format clients connect directly; OMP's three-format route table is a ready blueprint.
3. **Full catalog in `/v1/models`.** Today it returns only the single constructed model; combined with the existing model-catalog cache it could advertise more, giving explorer-style tools something to pick.
4. **Exchange dumps.** Codex's `--dump-dir` is useful for both debugging and eval replay; adding it at the gateway layer costs almost nothing.
5. **From translation toward policy.** Once there's a single vantage point over traffic, rate limits and per-request budgets become possible — Claude Code's NO_PROXY approach shows that fewer control points are easier to enforce.

One-line summary: **the value of a gateway isn't compatibility — it's deciding what doesn't get through.**

## References

- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (`packages/ai/src/auth-gateway/server.ts`, `packages/ai/src/providers/openai-chat-server.ts`)
- [openai/codex](https://github.com/openai/codex) (`codex-rs/responses-api-proxy/src/lib.rs`)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) (decompiled source: `src/upstreamproxy/upstreamproxy.ts`)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (`packages/coding-agent/docs/providers.md`, `packages/ai/src/utils/overflow.ts`)
- [sst/opencode](https://github.com/sst/opencode) (`packages/core/src/v1/config/provider.ts`)
- [OpenAI Chat Completions API reference](https://platform.openai.com/docs/api-reference/chat)
- [LiteLLM documentation](https://docs.litellm.ai/)
- [Ollama OpenAI compatibility](https://github.com/ollama/ollama/blob/main/docs/openai.md)
- [vLLM OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html)
