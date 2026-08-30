---
title: "A map of Rivumi: how one coding-agent task crosses workspaces, runtimes, tools, and events"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, software-architecture]
lang: en
tldr: "Rivumi turns a coding-agent task into inspectable boundaries: native side effects cross Rivumi tools, permissions, and sandboxing, while external runtimes retain their own loops and tools before returning a patch for Rivumi audit. This article maps the planned 20-part series."
description: "A map of Rivumi from task ingress to Cloudflare remote execution, covering workspace, prompt, runtime, tool, event, and integration boundaries and the reading order for this 20-part series."
series:
  name: "Rivumi Architecture Notes"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-architecture-map)

[Rivumi](https://github.com/vincentxuu/rivumi) is a Python-first coding-agent harness. Connecting a model to a shell is only the starting point. Rivumi turns what the model may see, what it may do, and what survives a failure into inspectable program boundaries. This series follows the code path of one task: from TUI input through workspaces, prompts, runtimes, and tools, then out to local integrations and Cloudflare remote execution.

The separate [Learning Coding-Agent Design from Mature Systems series](/en/series/coding-agent) compares design choices across pi, OMP, OpenCode, Codex CLI, and Claude Code. This series does not repeat those comparisons. It asks how Rivumi implements one choice: where data enters, which contracts it crosses, which failure boundary stops it, and which tests support the claim.

## One task, end to end

With the details collapsed, a Rivumi task follows this path:

```text
TUI / CLI / SDK
      |
      v
disposable workspace ---- instructions / project context / explicit memory
      |                                      |
      +------------------ prompt ------------+
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
          native AgentRunner      external CLI runtime
                 |                       |
       Rivumi tools / permission    CLI-owned tools / auth
           / OS sandbox                   |
                 |                       |
                 +--- patch audit / verification ---+
                                   |
                         state + event journal
                             |
              artifacts / resume / replay / fork
                             |
                 SDK / IDE / remote control plane
```

The diagram deliberately keeps the two lanes separate. Native tool calls cross Rivumi's path, argv, permission, and OS-sandbox boundaries. External CLIs retain their own loops, tools, and authentication; Rivumi does not pretend to own those side effects. The lanes meet again at returned-patch audit, verification, and artifacts. A prompt that merely says “be careful” is not one of these boundaries.

## Twenty articles, not a feature inventory

The complete plan has four stages ordered around the reader's mental model. Orders 0–19 now form a complete reading path. Each article follows one primary data flow and hands neighboring subjects to later articles.

| Orders | The reader's question | Main subjects |
|---:|---|---|
| 0–7 | How does a task enter Rivumi and select an execution path? | TUI/CLI, workspace, prompt, native loop, provider adapters, routing economics, external runtime |
| 8–13 | How does the model execute tools safely, and how does a long run survive? | tool executor, permissions, OS sandbox, transactions, journal, compaction |
| 14–16 | How do capabilities expand, and how is work delegated? | MCP, skills/hooks/plugins, subagents |
| 17–19 | How do other clients and remote environments connect? | SDK/WebSocket, IDE/LSP, Cloudflare remote execution |

The order matters. Readers first see the TUI and the visible output of a run, so later abstractions such as `AgentRunner`, the event reducer, and MCP projection have a concrete purpose. Cloudflare comes last because it depends on the workspace, capability, state, and attach boundaries established earlier. Moving it forward would reduce the article to an isolated infrastructure inventory.

## Two runtime lanes

Rivumi has two distinct execution paths. In the native lane, `AgentRunner` owns the model/tool loop. The model returns structured output and tool calls; Rivumi owns execution, verification, repetition detection, and termination. In the external lane, official CLIs such as Codex or Claude Code remain complete runtimes. Rivumi owns the surrounding workspace, capability handoff, returned-patch audit, and shared artifacts.

Keeping these lanes separate prevents a common category error: an external CLI is not another `ModelProvider`. It already owns a loop, tools, authentication, and context management. Forcing it through the native provider contract would blur who owns permissions and side effects. The series therefore finishes the native path before tracing the external handoff on its own terms.

## Four boundaries that are not interchangeable

Later articles repeatedly encounter four layers with related names but different responsibilities:

1. **Workspace isolation** asks whether the source repository stays unchanged and where a run occurs.
2. **Tool mechanics** govern paths, argv, environment variables, timeouts, and atomic writes.
3. **Authority policy** decides whether user, organization, or project rules allow an operation and whether approval is required.
4. **OS containment** limits the files and system calls available after a command actually starts.

All four matter, but none can substitute for another. A disposable clone protects the source repository without sandboxing every subprocess. `shell=False` blocks shell expansion without granting authority to execute the command. A permission rule answers “may this run?” without proving that the kernel enforces containment. Each article separates the guarantees that exist from those that do not.

## State, events, and artifacts answer different questions

Rivumi does not treat its JSONL event log as the only truth. The manifest is the state of record for resume. The event journal supports replay, audit, and UI projection. The run bundle preserves patches, verification output, transcripts, and other artifacts for different readers. “State first” follows from this split: if the process crashes between a manifest commit and an event append, recovery trusts committed state and reconciles the observation stream by sequence.

The same discipline applies to newer capabilities. Explicit memory is currently typed JSONL with bounded injection, not semantic retrieval. Provider caching is a request hint and trace, not a Rivumi response cache. The local WebSocket bridge attaches to a prebuilt session; it does not yet restore a durable conversation by conversation ID. The series describes these baselines without turning “an entry point exists” into “the full service is complete.”

## How to read the series

New readers can follow the numerical order. Contributors working on one subsystem can enter at the beginning of a stage:

- For interaction and execution paths, start with TUI/CLI, workspaces, and the native loop.
- For safety boundaries, start with the tool executor, then continue through permissions, OS sandboxing, and transactions.
- For capability extension, read [MCP](/posts/tech/2026-08-30-rivumi-native-mcp-authorization-en), [skills/hooks/plugins](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins-en), and [subagents](/posts/tech/2026-08-30-rivumi-subagent-scheduling-en) in that order.
- For product integration, finish with [SDK/WebSocket](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket-en), [IDE/LSP](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge-en), and [Cloudflare](/posts/tech/2026-08-23-rivumi-cloudflare-deployment-en).

Every article identifies source symbols, focused tests, a failure case, and current limits. Readers do not have to trust the architecture diagram; they can search those symbols in the repository and check whether the boundary still exists.

## References

- [Rivumi GitHub repository](https://github.com/vincentxuu/rivumi)
- [Learning Coding-Agent Design from Mature Systems: series overview](/posts/ai/2026-08-25-coding-agent-design-series-overview-en)
