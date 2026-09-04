---
title: "Learning Design from Mature Coding Agents (37): Code Mode — Compiling Tool Calls into Batches of Executable Code"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 37
tags: [coding-agent, code-mode, tool-use, sandbox, codex, opencode, looplane]
lang: en
tldr: "looplane now ships a bounded tool-program DSL: read-only programs support list/read/search/diff, repeat, and if_contains; modify/check transactions receive whole-transaction approval and roll back touched paths on failure. This is not arbitrary JavaScript/Python code mode, and transaction execution is not parallel."
description: "Comparing code mode in codex and opencode, including looplane's implemented read-only tool programs and rollback-capable modify/check transaction baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-code-mode)

This is part 37 of the series, and the topic is newer than previous entries: only two of the five reference projects have shipped it, both still iterating fast. Scope note as always — pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), claude-code (community decompiled v2.1.88). I actually grepped `code mode`, `codemode`, and `code_mode` in local clones: pi, omp, and claude-code have no corresponding implementation. So this post is honestly shorter, covering only the two that built it.

## The capability problem: every tool call is a round trip

In a traditional agent loop, the model emits one tool_use per call, waits for the result, then reads the result back in. Three consequences:

1. **Latency**: ten sequential calls mean ten full model round trips.
2. **Context waste**: every intermediate result passes through the model twice. Fetching a 10,000-row sheet to filter out five rows burns tokens on the other 9,995.
3. **Control flow faked by the model**: loops, conditionals, and "retry differently on failure" all have to be performed turn by turn through reasoning.

Code mode compiles a sequence of tool calls into a program: the model writes a small piece of restricted JavaScript (or Python), loops and branches execute natively in a sandbox, tools are injected as functions, and only the final result flows back into context. Anthropic's engineering blog describes this pattern clearly and adopts Cloudflare's name for it, Code Mode: present MCP tools as code APIs instead of direct tool calls. Their Google Drive → Salesforce example drops from 150,000 tokens to 2,000.

## How the two do it

### codex: a standalone V8 host process; the model sees only `exec` and `wait`

codex splits the entire runtime into an optionally installed standalone binary. The protocol layer lives in `codex-rs/code-mode-protocol`; the gRPC definition `codex.code_mode.v1.proto` states the division of labor in its opening comment — the host runs JavaScript, nested tool calls are delegated back to the session owner. V8 initialization is isolated in `codex-rs/code-mode-runtime/src/v8_init.rs#initialize_v8`, with even the JIT switch as its own type, `V8JitMode`.

The model-facing surface is deliberately tiny: `codex-rs/code-mode-protocol/src/lib.rs#PUBLIC_TOOL_NAME` is simply `"exec"` — one tool that takes raw JS source — alongside `WAIT_TOOL_NAME = "wait"`. The interesting part is the yield semantics: when a script exceeds `yield_time_ms`, it returns its output so far and keeps running in the background as a cell; the model can later collect it with `wait`. Long tasks never block the turn. Source can carry its own `yield_time_ms` and `max_output_tokens` via a first-line `// @exec:` pragma (`codex-rs/code-mode-protocol/src/description.rs#parse_exec_source`).

How do tools become callable functions inside the program? Through signature generation: `ToolDefinition` carries `input_schema` and `output_schema`, and `codex-rs/code-mode-protocol/src/description.rs#render_json_schema_to_typescript` renders JSON Schema into TypeScript signatures for the model. What the model sees is not "a pile of tools" but a typed API surface.

The security routing is the most worth borrowing. Tool calls made from inside a script go back to the host and re-run the normal pipeline: `codex-rs/core/src/tools/code_mode/mod.rs#call_nested_tool` wraps each nested call as a `ToolCall` tagged with `ToolCallSource::CodeMode` and sends it through the same `handle_tool_call_with_source` — meaning approvals, policy, and telemetry all still apply. It also blocks `exec` from invoking itself to prevent recursion. Availability handling is pragmatic too: `mod.rs#CodeModeService.is_available` checks whether the host exists and falls back to direct tools when it doesn't; a config flag `disable_in_process_fallback` can flip that to fail closed (`codex-rs/core/src/config/mod.rs#CodeModeConfig`).

### opencode: writing its own confined JS interpreter

opencode's approach is more radical: instead of V8, `packages/codemode` implements an Effect-native confined JavaScript interpreter from scratch. The README says it outright: "orchestration language, not a general JavaScript runtime" — data manipulation, loops, functions, and promise-based parallelism (capped at 8 concurrent tool calls) are supported, but there is no `eval`, dynamic imports, modules, timers, or host globals. A program can only touch the `tools` object tree explicitly provided by the host, and values crossing the boundary must be plain data.

Three details deserve their own mention:

- **Limits are policy**: the three knobs — `timeoutMs`, `maxToolCalls`, `maxOutputBytes` — all default off, and the README explains why: execution budgets are host policy, not library policy. Errors become a fixed diagnostic taxonomy (`packages/codemode/src/codemode.ts#DiagnosticKind`): `UnknownTool`, `InvalidToolInput`, `ToolCallLimitExceeded`... failures are data, not exceptions.
- **Tool discovery**: the catalog gets a 2,000-token budget, with namespaces taking turns placing signatures for fairness; anything that doesn't fit is found via the built-in `$codemode.search` tool on demand. This is progressive disclosure made concrete.
- **Approval stays outside**: `packages/opencode/src/tool/code-mode.ts#CodeModeTool` wraps MCP tools into the `tools` tree, and every child call still fires the `tool.execute.before`/`after` hooks — authorization explicitly lives at the host layer. The README's Authority Boundary section puts it bluntly: "A program cannot gain authority through prose or generated code."

## Evidence from research and industry

The most direct academic grounding for consolidating multi-step tool calls into code is [CodeAct](https://arxiv.org/abs/2402.01030) (Executable Code Actions Elicit Better LLM Agents, ICML 2024): switching the action space from individual JSON tool calls to executable programs lets the model use programming-language control flow to compose actions and iterate over intermediate state. Code mode is essentially CodeAct plus production-grade sandboxing and auditing. On the engineering side, Anthropic's [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) (source of the token numbers above) and Cloudflare's [Code Mode](https://blog.cloudflare.com/code-mode/) make the same point: LLMs are good at writing code, so let them write code to call tools. The [parallel tool use section of Anthropic's tool use docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) also acknowledges that orthogonal direct parallel calls are only a starting point — complex dependency structures need stronger orchestration primitives.

## The baseline now implemented in looplane

Rather than embedding arbitrary JavaScript or Python, looplane first ships a bounded DSL. `tool_program` exposes only read-only operations such as `list_files`, `read_file`, `search_text`, and `git_diff`, plus bounded `repeat` and `if_contains`. The model gets simple control flow in one tool call while the host can fully inspect the executable language.

Mutations use a separate `tool_transaction`. It collects touched paths, sends the whole transaction through existing approval/policy, then executes replace/patch/check steps. Any failure triggers an attempt to restore affected files to their pre-transaction state. Backend turn limits, step caps, and bounded output still apply.

This baseline solves batched tool programs; it is not the arbitrary confined-language runtime shipped by codex or opencode. Parallel transaction execution, a richer DSL, and whether a full interpreter is worth its security cost remain open.

## References

- [looplane tool program/transaction implementation at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/tools.py)
- [looplane native-loop policy integration at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/loop.py)

- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [Anthropic Engineering: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Cloudflare Blog: Code Mode](https://blog.cloudflare.com/code-mode/)
- [Anthropic Docs: Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [openai/codex — codex-rs/code-mode-protocol](https://github.com/openai/codex/tree/main/codex-rs/code-mode-protocol)
- [sst/opencode — packages/codemode](https://github.com/sst/opencode/tree/dev/packages/codemode)
