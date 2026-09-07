---
title: "Tool Pick | jmeter-mcp-server — Let Your Agent Build JMeter Load Tests by Typed Tool Calls, Not Hand-Written XML"
date: 2026-09-08
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "Represents a JMeter test plan as a JSON tree with stable node IDs, editable by ID; the MCP server serializes it to real .jmx and runs actual JMeter, avoiding the silent errors that come from an LLM hand-writing XML"
tldr: "jmeter-mcp-server is a stdio MCP server that lets an agent build, edit, and run JMeter load tests through typed tool calls and read back aggregated reports. Install: `claude mcp add jmeter -e JMETER_HOME=... -- npx -y jmeter-mcp-server`. It addresses the problem that an LLM hand-writing `.jmx` XML can produce output that is structurally valid but semantically wrong, with no error raised."
series:
  name: "AI Tool of the Day"
  order: 24
---

> 🌏 [中文版](/posts/daily/2026-09-08-tool-jmeter-mcp-server)

## Tool Info

| Field | Value |
|---|---|
| Name | jmeter-mcp-server |
| Type | Stdio MCP server |
| GitHub | [juliodelimas/jmeter-mcp-server](https://github.com/juliodelimas/jmeter-mcp-server) |
| Stars | 83 |
| Language | TypeScript |
| License | MIT |
| Install | `claude mcp add jmeter -e JMETER_HOME=/path/to/jmeter -- npx -y jmeter-mcp-server` |

## What Problem It Solves

Have you ever just asked an LLM to write you a JMeter `.jmx` test plan directly? It can — a `.jmx` is XML at the end of the day, and any capable model has seen plenty of examples. The problem is *how it fails*: JMeter's format is a `hashTree` full of easy-to-misremember details — exact `guiclass`/`testclass` pairing, property names that don't match their GUI label (`ThreadGroup.num_threads` is actually a `stringProp`, not an `intProp`), integer bitmasks for assertion match types, and strict parent/child pairing through sibling `<hashTree>` tags. None of this gets caught by the XML schema — a wrong value still produces valid, loadable XML that just quietly does the wrong thing.

The README documents a real case: an early version of the If Controller generated a property called `useExpression` set to `true`, which reads like "yes, evaluate my condition." The real JMeter source does the opposite — `useExpression=true` means *don't* evaluate it as an expression, just check whether the string is literally `"true"`. Every non-trivial condition silently, permanently failed — no error, no warning, the child sampler just never ran. It only surfaced by actually running the generated plan and noticing a sample count of zero.

jmeter-mcp-server's approach is to encode that fragile XML knowledge once, in a tested serializer/parser, and expose only typed tool calls on top of it: a test plan isn't a blob of XML text but a JSON tree with stable node IDs — adding, removing, renaming, moving, or disabling an element is one tool call against a specific ID, not a full `.jmx` rewrite. An existing `.jmx` (hand-written or exported from the GUI) can be imported into the same tree shape and edited the same way. Execution is asynchronous — `execute_test_plan` returns an `executionId` immediately, so a long-running load test never blocks the conversation — and results come back through `get_execution_report` as already-computed aggregate stats (error %, avg/median/p90/p95/p99, throughput), not thousands of raw samples you'd have to average yourself.

Good fit for: QA or backend engineers who want to describe a load test in plain language ("20 users hitting POST /orders for 2 minutes, 5% think time, fail anything over 800ms") and have the agent assemble a runnable plan and read back a report; making small edits to an existing `.jmx` (adding one assertion, changing thread count) without regenerating the whole file; or generally wanting "LLM generates configuration" to collapse into one tested code path instead of re-betting on correctly-remembered XML every single time.

## Quick Start

### Install

```bash
# Prerequisite: Apache JMeter installed locally,
# JMETER_HOME pointing at the install dir (must contain bin/jmeter)
# macOS via Homebrew: brew install jmeter

claude mcp add jmeter \
  -e JMETER_HOME=/opt/homebrew/opt/jmeter/libexec \
  -- npx -y jmeter-mcp-server

# Confirm it registered
claude mcp list
```

### Basic Usage

The agent gets a set of typed tools covering 34 element types (samplers, controllers, timers, extractors, assertions, listeners) plus editing and `.jmx` import/export:

```
Building a plan and running a load test (the agent calls these tools in sequence):

create_test_plan                      → { planId, rootNodeId }
add_thread_group   (parentId: root)   → { nodeId: threadGroupId }
add_http_sampler   (parentId: threadGroupId, method: "POST", path: "/orders")
add_duration_assertion (parentId: samplerId, duration: 800)
add_aggregate_report_listener (parentId: threadGroupId)
execute_test_plan  (planId)           → { executionId }
get_execution_status (executionId)    ← poll until "completed"
get_execution_report  (executionId)   → aggregated latency/error stats
```

### Advanced Usage

```bash
# Edit an existing plan incrementally instead of regenerating the whole tree
# (operate on a specific node id, not a full rewrite)
update_element   (nodeId: threadGroupId, props: { num_threads: "50" })
move_element     (nodeId: assertionId, newParentId: otherSamplerId)
reorder_children (nodeId: threadGroupId, order: [samplerId1, samplerId2])

# Import an existing GUI-exported .jmx into the same editable tree
import_test_plan (path: "./legacy-test.jmx")
# Returns unknownElementCount / unknownElementTypes to flag anything
# not fully parsed (the original XML is preserved and re-emitted as-is)
```

## Comparison with Existing Tools

The README itself maintains a comparison table against eight other public "JMeter + MCP" projects on GitHub (as of 2026-09-03):

| | jmeter-mcp-server | Common pattern among similar projects |
|---|---|---|
| `.jmx` round-trip (import *and* export) | ✅ | Usually one-directional generation only, or execute-only |
| Incremental editing by node ID | ✅ | ❌ — most regenerate the whole plan from parameters |
| Async execution, doesn't block on long runs | ✅ | ❌ — most wait synchronously for completion |
| Automated test suite (166 tests, incl. real JMeter runs) | ✅ | ❌ — most projects have no test suite |
| Actually invokes Apache JMeter | ✅ | Some reimplement HTTP load-testing logic themselves, with no real JMeter underneath |

## Things to Watch Out For

- **`add_csv_data_set`'s `filename` must be an absolute path**: `execute_test_plan` runs JMeter from a fresh per-execution directory, so a relative path (which the GUI would resolve against the `.jmx` file's own location) won't resolve there — and an absolute path is machine-specific, so a shared `plan.json` won't travel to another machine as-is.
- **Not yet in v1**: no automatic capacity search (the roadmap calls this `find_breaking_point`), and no parent-type validation — nothing currently stops you from attaching an element under a semantically wrong parent; `add_*`, `move_element`, and `import_test_plan` don't check for this.
- **JDBC / FTP / Backend Listener tools are only structurally verified**: they generate correct, JMeter-loadable XML, but the project ships no database, FTP server, or InfluxDB instance to exercise them against a real backend — verify these yourself before relying on them.

## Today's Takeaway

Most "LLM generates a config file" tools I've seen stop at "the model can write it" and rarely treat "what happens when it writes it wrong" as a first-class concern. jmeter-mcp-server's README makes the case with a real war story — a property like `useExpression=true` whose meaning is the literal opposite of what it reads as still produces valid, loadable XML; it just quietly never runs. Collapsing that kind of knowledge into one serialization path gated by 166 tests (including real JMeter runs), then wrapping it as typed tool calls, effectively turns "re-bet on remembering it correctly every time" into "fix the bug once."

## References

- [jmeter-mcp-server GitHub repo](https://github.com/juliodelimas/jmeter-mcp-server): README, stars, language, and license (MIT) are from the official repo and the GitHub API.
- [README "Why not just ask an LLM" section](https://github.com/juliodelimas/jmeter-mcp-server#why-not-just-ask-an-llm-to-write-the-jmx-itself): the `useExpression` war story and design rationale.
- [README "Tools" section](https://github.com/juliodelimas/jmeter-mcp-server#tools): the full list of 34 element-authoring tools plus editing/inspection tools.
- [README "How this compares" section](https://github.com/juliodelimas/jmeter-mcp-server#how-this-compares): comparison table against eight other public JMeter MCP projects (as of 2026-09-03).
- [Apache JMeter official docs](https://jmeter.apache.org/): JMeter installation and test-plan format.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
