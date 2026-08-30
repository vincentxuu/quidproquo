---
title: "Learning Design from Mature Coding Agents (18): Toolset Design Philosophy — Drawing the Tool Surface Boundary"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 18
tags: [coding-agent, tool-design, rivumi, function-calling, claude-code]
lang: en
tldr: "Rivumi's core surface has grown from seven tools to nine with a read-only `tool_program` and rollback-capable `tool_transaction`; search prefers ripgrep and arbitrary shell remains absent. Native MCP tools join only from allowlisted servers and default to execute approval without trusted read-only metadata."
description: "A source-level comparison of five mature coding agents with Rivumi's nine core tools, bounded tool programs, transaction rollback, ripgrep search, and dynamic native MCP exposure."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy)

The [previous post](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en) covered session persistence. This one steps back upstream: how many tools should you actually give the model?

Evidence base for this post: **pi** (badlogic/pi-mono), **omp** (can1357/oh-my-pi), **opencode** (sst/opencode), **codex** (openai/codex Rust workspace), and **claude-code** (community-decompiled v2.1.88; symbol names may differ from the original). Every citation below was grepped in local clones.

## The design problem: where does the tool surface end?

Tools are the model's hands. Too many hands cost twice: every name, description, and schema eats context window; more importantly, the more choices a small model has, the more likely it picks wrong — cat-ing whole files instead of grepping, rewriting files wholesale instead of making precise edits. Too few hands and nothing gets done: an agent without search can only guess paths in an unfamiliar codebase.

So the real question is not "how many" but "where is the boundary": which capabilities merge into one tool and which split apart? Which tools are always present and which load on demand? Does the harness know each tool's effect level (read / write / execute)? The [SWE-agent paper](https://arxiv.org/abs/2405.15793) calls this ACI (agent-computer interface) design, and its conclusion is blunt: interface quality affects agent performance as much as the model itself.

## What the five do

### pi: eight tools, two presets

pi's entire built-in tool set is one enum: `pi-mono/packages/coding-agent/src/core/tools/index.ts#allToolNames` — `read`, `bash`, `powershell`, `edit`, `write`, `grep`, `find`, `ls`. Eight. More interesting, it ships two prepackaged surfaces: `index.ts#createCodingTools` gives just `read/bash/edit/write`; `index.ts#createReadOnlyTools` gives four read-only tools `read/grep/find/ls`. "Can write" and "read-only" are ready-made presets, not prompt reminders.

Every tool self-bounds at the tool layer: read output goes through `truncateHead` and gets truncated with a marker past line or byte limits (`core/tools/read.ts`, importing `truncate.ts#truncateHead`). Edit requires `oldText` to be unique in the file (`core/tools/edit.ts#editSchema`) — fuzzy replacement is excluded by schema, not by policy prose.

### omp: triage after fork explosion

omp is a pi fork whose tool count far exceeds eight — `packages/coding-agent/src/tools/` alone contains browser, computer, eval, gh-pr series and more. It survives via load tiers: `oh-my-pi/packages/coding-agent/src/tools/essential-tools.ts#ESSENTIAL_BUILTIN_TOOL_NAMES` pins eleven tools (`read/write/bash/edit/glob/computer/eval/task/hub/learn/manage_skill`) as `"essential"` — always visible in the model's schema; everything else defaults to `"discoverable"` and must be found through search. A comment records a real bug (issue #5764): re-registering a built-in from the UI layer accidentally demoted it to discoverable, making mounted devices unreachable. Once tools multiply, "who is on the surface" becomes an invariant that needs defending.

### opencode: swap editing tools per model

opencode's builtin list lives in `opencode/packages/opencode/src/tool/registry.ts#tools`: shell, read, glob, grep, edit, write, task, fetch, todo, search, skill, patch — roughly fifteen. The key code is a filter in that same function: if the modelID contains `gpt-` (and isn't oss), expose `ApplyPatchTool` and hide `EditTool`/`WriteTool`; otherwise the reverse. Same capability, different interface shape per model. Also, the task tool's description is generated at runtime (`registry.ts#describeTask`) by injecting the list of available subagents into the description text — description isn't just documentation, it's a routing table.

### codex: item-by-item assembly; minimal surface is a safety property

codex has no fixed tool set, only assembly functions. `codex-rs/core/src/tools/spec_plan.rs#add_core_tool_sources` decides, per feature flag, environment count, and `model_info`, whether to register shell, MCP resources, plan, view_image, apply_patch. The most telling rule is written in a comment: guardian reviewers — a restricted role — get **only** `exec_command`, `write_stdin`, and `view_image`; everything else is excluded. The smaller the tool face, the less there is to audit.

The shell itself, `codex-rs/core/src/tools/handlers/shell_spec.rs#create_exec_command_tool_with_environment_id`, is also worth reading: its schema bakes in two bounded parameters, `yield_time_ms` and `max_output_tokens`, giving the model control over "wait how long, return how much" while the harness clamps the range; sandbox escalation is an explicit enum parameter rather than free text.

### claude-code: effect annotations as first-class citizens

claude-code has forty-three tool directories under `src/tools`, but the real surface semantics live in `src/Tool.ts#Tool`: every tool must implement `isReadOnly(input)`, optional `isDestructive(input)`, `isConcurrencySafe(input)`, and `isOpenWorld(input)`. Note the argument is **input** — the same tool can be read-only for some inputs and destructive for others. Approval, parallel scheduling, and UI collapsing all build on these predicates instead of scattered if-lists.

Facing tool explosion, its answer parallels omp: `shouldDefer` marks tools as deferred, callable only after `ToolSearch` retrieves them (`Tool.ts#shouldDefer`); `searchHint` provides short phrases for keyword matching. Skills collapse into a single SkillTool routing table — the prompt at `src/tools/SkillTool/prompt.ts#getPrompt` is fixed boilerplate, available skills are injected as a `- name: description` list into system reminders, with descriptions subject to a truncation budget. A hundred skills occupy one tool slot.

One counterintuitive detail: BashTool's input schema contains an internal field `_simulatedSedEdit` deliberately omitted from the model-facing schema (`src/tools/BashTool/BashTool.tsx#inputSchema`) — the comment states outright that exposing it would let the model pair an innocuous command with arbitrary file writes to bypass permission checks and the sandbox. Schema is not just the model-facing API; it is also attack surface.

## rivumi's choice: bounded core tools, no arbitrary shell

Rivumi's core surface lives at `src/rivumi/tools.py#_tool_definitions`. The original seven remain — `list_files`, `read_file`, `search_text`, `replace_text`, `apply_patch`, `run_check`, and `git_diff` — plus `tool_program` and `tool_transaction`. The former executes at most eight read-only steps in one model tool call, with bounded `repeat` and `if_contains`, moving multi-read/search round trips into the harness. The latter combines reads, edits, and allowlisted checks into a rollback-capable modify+execute transaction. Their control flow, step count, and callable operations are schema-bounded; neither introduces arbitrary bash.

`search_text` is no longer just a Python walk: when ripgrep is present it uses literal `rg`, respects `.gitignore`, then still applies allowed-path and output bounds. `run_check` accepts only an enum name declared in the task contract and executes exact argv with `shell=False` and a sanitized environment. These changes reduce search cost and model round trips on larger repositories without quietly turning the narrow surface into a shell.

Second difference: **limits are cumulative, not per-call**. After every successful `apply_patch` or `replace_text`, `tools.py#reviewable_patch` re-checks the workspace's entire uncommitted diff against byte/line/file limits; exceeding them rolls back the current operation. Many individually small edits can sum past the reviewable budget of the final artifact — per-call checks cannot catch that leak.

Third: **read-before-edit, mechanized**. `tools.py#replace_text` maintains a `_read_versions` ledger: only a complete `read_file` records the SHA-256; a mismatched hash at edit time is rejected. SWE-agent-style "look before you leap" is not a prompt convention here, it's Python code. Add old_text occurring exactly once, new files restricted to `apply_patch` (diffs stay reviewable), atomic writes with rollback on failure — this tool is narrow enough that surprises are nearly impossible.

Fourth: some effect metadata now lives on `ToolDefinition`. `read_only` and `concurrency_safe` feed prompt policy, scheduling, and MCP trust classification, while `approvals.py` retains the final fail-closed READ/MODIFY/MODIFY_EXECUTE/EXECUTE mapping. Native MCP tools can join dynamically, but only from allowlisted servers; resource/prompt bridges are fixed read operations, and a remote tool without trusted read-only metadata is approved as execute.

The costs remain clear: the core grew from seven to nine, with opt-in MCP and subagents around it, but it still cannot express arbitrary shell workflows. `tool_program` cannot edit, run checks, or call MCP; `tool_transaction` rolls back on any failed step. This is a tested baseline, not evidence of success rates on large repositories or production safety for third-party MCP servers.

## The academic grounding

The [SWE-agent paper](https://arxiv.org/abs/2405.15793) (Yang et al., 2024) lays out ACI design principles; its most relevant experimental evidence shows that with the same model, changing file-view interfaces (line numbers, search support) shifts success rates significantly — their narrow search/read/edit interface outperformed open-ended shell interaction. The five projects' convergence confirms it: pi's and opencode's separate grep/find/read tools, and rivumi's search_text, all follow the paper's narrow-and-explicit interface shape.

Official function calling docs supply the other half from the API side: both [Anthropic's tool use guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) and [OpenAI's function calling guide](https://platform.openai.com/docs/guides/function-calling) stress that description quality directly drives selection accuracy and recommend keeping tool counts lean and semantics non-overlapping — "few and clear" is not a style preference, it's a known constraint on model behavior.

## Improvement roadmap

1. **MCP discovery still needs real surface tiers.** Allowlisting and dynamic refresh have landed, but many servers can still flatten many schemas into the model context. OMP essential/discoverable or ToolSearch-style deferred loading is the next boundary.
2. **Complete input-sensitive effect classification.** `ToolDefinition` now carries read-only/concurrency metadata and MCP annotations are translated, but one tool changing risk by arguments still lacks a unified predicate and a validation layer that does not blindly trust server annotations.
3. **Dynamic descriptions.** opencode's `describeTask` shows descriptions can be runtime routing tables. rivumi's run_check enum is already generated dynamically; next step: summarize each check's latest result into its description so the model picks blind less often.
4. **Use measurements to set batching boundaries.** `tool_program` and `tool_transaction` establish that bounded code mode is viable. Real runs should compare round trips, tokens, rollback frequency, and misuse before raising the eight-step cap or adding more control flow.

The next post turns to the other side of sessions: the run artifacts contract — after a run ends, which mutually corroborating files should be on disk.

## References

- [badlogic/pi-mono — packages/coding-agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) — eight-tool list and coding/read-only presets
- [can1357/oh-my-pi — packages/coding-agent](https://github.com/can1357/oh-my-pi/tree/main/packages/coding-agent) — essential/discoverable load tiers
- [sst/opencode — packages/opencode](https://github.com/sst/opencode/tree/main/packages/opencode) — per-model editing tools and dynamic task descriptions
- [openai/codex — codex-rs/core](https://github.com/openai/codex/tree/main/codex-rs/core) — item-by-item tool spec plan and exec_command schema
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — official repo (ships minified bundle; cited here from community decompilation v2.1.88)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — ACI design impact on agent performance
- [Anthropic Tool Use Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) and [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling) — official guidance on tool description quality and counts
- [Rivumi tools at fixed commit `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/tools.py)
