---
title: "Hooks, Skills, Plugins: The Three-Layer Extension System of Mature Coding Agents"
date: 2026-08-25
category: ai
type: deep-dive
tags: [coding-agent, hooks, skills, plugins, extensibility, claude-code, codex, opencode, rivumi]
lang: en
series:
  name: "跟成熟 coding agent 學設計"
  order: 31
tldr: "All five mature coding agents split user-extensibility into three layers: hooks intercept events, skills inject knowledge, plugins package and distribute. The shared rule — control flow goes through hooks, knowledge through skills, ecosystems through plugins. rivumi currently has zero extension points; the minimal starting point is a PreToolUse/PostToolUse event pair between AgentRunner and ToolExecutor."
description: "Source-code evidence from five coding agents on how hooks, skills, and plugins differ in design yet converge on the same three-layer pattern, plus a draft extension-point design for rivumi."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins)

## The capability gap: an agent you can't customize is a toy

Every piece of rivumi's behavior so far is hardcoded. Want to inject project conventions before each prompt? Edit the source. Auto-run a formatter after every Bash call? Edit the source. Share a team-wide pre-deploy checklist the agent can look up? There is no mechanism.

I grepped `~/Projects/rivumi/src/rivumi/` honestly: the only matches are `core.hooksPath=/dev/null` set for isolation in `external_runner.py` (that's git's hooking, not ours) and a stub labeled "No-op lifecycle hook" in `models.py`. In other words, rivumi has no extension points at all.

That's fine for a single-player toy, but every mature project has crossed this bridge, and the five reference projects give a remarkably consistent answer: **three layers** — hooks decide when to intercept, skills decide what the agent knows, plugins decide how it's packaged. Evidence layer by layer below.

## Layer one: hooks — interception points on lifecycle events

claude-code's hook event table lives in `claude-code-source/src/entrypoints/sdk/coreTypes.ts#HOOK_EVENTS`: PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, SessionEnd, Stop, PreCompact, PermissionRequest, and 27 events total, covering every critical node of the loop. The interesting part is the output contract: `claude-code-source/src/types/hooks.ts#syncHookResponseSchema` lets a hook return `decision: approve/block`, `permissionDecision`, `updatedInput` (rewriting tool arguments directly), `additionalContext` (injecting conversation context), even `{async: true}` so long-running checks don't block the main flow. Hooks aren't just notifications — they are participants that can change control flow.

codex's design is nearly isomorphic but more restrained: the event enum sits in `codex/codex-rs/hooks/src/events/common.rs` (PreToolUse, PermissionRequest, PostToolUse, SessionStart, SessionEnd, SubagentStart, SubagentStop, PreCompact, PostCompact, UserPromptSubmit, Stop) with regex matchers to filter by tool name. Execution has two paths: shell commands run through `codex/codex-rs/hooks/src/engine/command_runner.rs#CommandHookRuntime`, MCP calls through `mcp_runner.rs` in the same directory — one event contract, two carriers.

pi takes the in-process route: `pi-mono/packages/coding-agent/src/core/extensions/types.ts#ExtensionAPI` lets TypeScript modules subscribe with `on("session_start")`, `on("session_compact")`, and register new tools via `registerTool`. opencode's plugin is essentially the same route (see layer three). omp goes further: under `oh-my-pi/packages/coding-agent/src/extensibility/`, hooks, custom-tools, custom-commands, and plugins live as separate modules — extensibility maintained as a first-class concern.

## Layer two: skills — lazily loaded knowledge triggered by description

Skills solve a different problem: not "intercept behavior" but "occupy no context until needed."

claude-code's loader `claude-code-source/src/skills/loadSkillsDir.ts` parses SKILL.md frontmatter — name, description, whenToUse, even per-skill hooks and path restrictions. Triggering is description-based: the model sees name＋description for every installed skill and reads the full body only when relevant. codex mirrors this: `codex/codex-rs/skills/src/model.rs#SkillMetadata` has `description`, `short_description`, and a crucial field `allows_implicit_invocation` — explicitly separating "the model decides on its own" from "only activated when explicitly mentioned," two trust levels. Explicit mention parsing is in `codex/codex-rs/skills/src/selection.rs#collect_explicit_skill_mentions`. omp shares the frontmatter-description mechanism (`oh-my-pi/packages/coding-agent/src/extensibility/skills.ts`) and adds `oh-my-pi/packages/coding-agent/src/tools/learn.ts#LearnTool`: mid-task, the agent can mint new managed skills from lessons learned — skills aren't static assets; they grow.

## Layer three: plugins — the packaging and distribution container

The first two layers solve single capabilities; plugins solve the ecosystem problem: bundling multiple hooks, skills, commands, and MCP servers into one installable, versionable unit.

claude-code has the heaviest infrastructure: `claude-code-source/src/utils/plugins/pluginLoader.ts` includes `installFromNpm`, `gitClone`, versioned caches, with hooks mounted via `loadPluginHooks.ts`. codex declares composition via manifest: `codex/codex-rs/plugin/src/manifest.rs#PluginManifest` can carry `PluginManifestHooks` and `PluginManifestMcpServers`, and `codex/codex-rs/plugin/src/load_outcome.rs#PluginLoadOutcome` aggregates effective skill roots and MCP servers after load — the plugin is a purely declarative content container, not code. opencode is the opposite: the plugin *is* the program. `opencode/packages/plugin/src/index.ts#Plugin` defines `type Plugin = (input: PluginInput) => Promise<Hooks>` — an async function receiving the client SDK and shell, returning implementations of `"tool.execute.before"`, `"permission.ask"`, `"chat.headers"` — in-process, type-safe, able to operate the runtime directly.

## Engineering rationale: why three layers instead of one

The division isn't accidental. [Voyager](https://arxiv.org/abs/2305.16291) validated the core idea on a Minecraft agent: solidifying successful experiences into a retrievable skill library continuously improves task success rates — skills are that insight productized, and description-triggered lazy loading is the necessary correction under real context costs. Anthropic's engineering posts on [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices) and [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) draw the line just as clearly: hooks are deterministic control-flow attachment points; skills are progressively disclosed domain knowledge. Deterministic needs go to hooks; semantic judgment goes to the model.

Failure cases confirm it from the other side: with only one layer, either everything can be modified (a security nightmare) or nothing can (rivumi today). The three layers answer different questions; merging them breaks both.

## Draft design for rivumi

In dependency order, three phases:

**Phase 1: a hook event bus (no shell execution yet).** rivumi already has two natural seams: `rivumi/loop.py#AgentRunner` and `rivumi/tools.py#ToolExecutor`. Define a Python-level event protocol first: `before_tool_use(tool_name, input) -> HookResult`, where HookResult can allow, veto, rewrite input, or append context. V1 supports only in-process Python callbacks — follow pi, not claude-code, because rivumi's user is the developer themselves; the cost of subprocess isolation can be deferred. Start with five events: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop — aligned with codex's restrained set rather than claude-code's 27.

**Phase 2: skill directories with description routing.** Read `.rivumi/skills/<name>/SKILL.md`, take name/description from frontmatter, put only the name＋description list in the system prompt, and inject full text on demand. Copy codex's `allows_implicit_invocation` semantics directly: default to explicit mention required, shrinking the prompt-injection surface. This step needs zero new dependencies — a pure file protocol.

**Phase 3 (deferred): plugin packaging.** Only after hooks and skills stabilize, consider bundling both into a directory format. rivumi has no marketplace ambitions; this phase may never come — deliberately skipping claude-code's npm install chain.

## How this connects to the existing architecture

Good news: rivumi's earlier designs left seams ready. `rivumi/permissions.py#PermissionGuard` is already the de facto PreToolUse interceptor — once the hook system lands, it becomes simply the built-in hook with highest priority. The event stream in `rivumi/events.py` can double as the bus underneath the hook system. And the capability handshake from the external CLI runtime generalization (OpenCode/Pi/OMP adapters) means: if a host CLI has its own hook system, rivumi's adapter layer can translate rather than reimplement. The risk concentrates on hooks rewriting tool input: once `updatedInput` exists, the audit trail must record before/after diffs, which touches the run artifacts contract. Phase 1 keeps rewriting disabled — allow/deny/additionalContext only — until the audit surface catches up.

## References

- [badlogic/pi-mono — packages/coding-agent/src/core/extensions](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/src/core/extensions): ExtensionAPI event subscription and tool registration
- [can1357/oh-my-pi — src/extensibility](https://github.com/can1357/oh-my-pi): skills/hooks/plugins as separately maintained modules
- [sst/opencode — packages/plugin](https://github.com/sst/opencode/tree/dev/packages/plugin): in-process plugin hook interface
- [openai/codex — codex-rs/hooks and codex-rs/skills](https://github.com/openai/codex/tree/main/codex-rs): Rust hook engine and skill metadata
- [anthropics/claude-code](https://github.com/anthropics/claude-code): official docs entry for hooks/skills/plugins (local evidence from decompiled v2.1.88 source)
- [Claude Code Best Practices — Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-best-practices): positioning and workflows for hooks
- [Equipping agents for the real world with Agent Skills — Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills): progressive disclosure design
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291): sustained task-success gains from skill libraries
