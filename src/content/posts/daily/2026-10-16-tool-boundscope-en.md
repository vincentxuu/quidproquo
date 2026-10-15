---
title: "Tool Pick｜Boundscope — Let the Agent Prove Its Own C/C++ Has No Memory Errors"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that lets an agent test its own C/C++ code with AddressSanitizer and UndefinedBehaviorSanitizer, separating 'it compiled' from 'it has no memory errors' and keeping reproducible evidence of each run"
tldr: "Boundscope is a local C/C++ memory-error testing tool with both a CLI and an MCP server. Install: `cargo build --locked` (no crates.io or npm release yet). It solves the problem of an agent writing C/C++ that compiles and runs fine, with no signal about buffer overruns or use-after-free until something breaks later."
series:
  name: "AI Tool of the Day"
  order: 56
---

> 🌏 [中文版](/posts/daily/2026-10-16-tool-boundscope)

## Tool Info

| Item | Value |
|---|---|
| Name | Boundscope |
| Type | MCP server + CLI (C/C++ memory-error testing) |
| GitHub | [ArcX-Research/boundscope](https://github.com/ArcX-Research/boundscope) |
| Stars | 1 (created 2026-10-15) |
| Language | Rust |
| License | MIT |
| Install | `cargo build --locked` (needs Clang with AddressSanitizer/UndefinedBehaviorSanitizer; no crates.io or npm package yet) |

## What Problem It Solves

When an agent writes C or C++, you usually get only two signals: whether it compiled, and whether it ran without crashing. A buffer write one slot too far, or a read through a pointer to memory that was already freed, will often still compile cleanly and still run to completion — the output is just occasionally wrong, or only breaks on inputs you haven't tried. The agent itself has even less visibility: it has no tool to report that a given run actually triggered undefined behavior.

Boundscope wraps AddressSanitizer (catches out-of-bounds reads/writes and use-after-free) and UndefinedBehaviorSanitizer (catches undefined behavior more broadly) into a repeatable check. You register a program and a set of test inputs, Boundscope compiles it with Clang plus the sanitizers and runs it, and saves the diagnostics, source location, and inputs from each run as a report. After fixing the code, you retest against the same report ID and get a direct before/after comparison — whether that specific input now triggers the error or not — instead of just an exit code. The MCP server exposes these operations (check, retest, read reports, read execution traces) to the agent, so it can run tests against its own code and hand you the failing input, the source line, and the before/after comparison directly.

Good fit: using an agent to write lower-level C/C++ (parsers, buffer manipulation, data structures) where "it compiled" isn't a strong enough bar; or having an agent self-test a handful of boundary inputs against a suspicious function before code review.

## Quick Start

### Install

```bash
# Requires Rust/Cargo 1.85+, and a Clang build with AddressSanitizer/UndefinedBehaviorSanitizer
git clone https://github.com/ArcX-Research/boundscope.git
cd boundscope
cargo build --locked
```

### Basic Usage

```bash
# The registered example at examples/c/buffer.c allocates 4 ints but allows index 4
target/debug/boundscope \
  --config examples/targets.json \
  --store local/reports \
  check buffer-demo

# Excerpt of the JSON report:
# {
#   "kind": "heap-buffer-overflow",
#   "sanitizer": "AddressSanitizer",
#   "summary": "heap-buffer-overflow buffer.c:13 in main"
# }

# After fixing the bounds check (index <= count → index < count), retest the same report ID
target/debug/boundscope --config examples/targets.json --store local/reports \
  retest <BASELINE_ID>
# Expected: no_errors_observed, exit code 0
```

### Advanced Usage

```json
// Add to your MCP client config so the agent can call it directly (swap in your own checkout path)
{
  "mcpServers": {
    "boundscope": {
      "command": "/absolute/path/to/boundscope/target/debug/boundscope-mcp",
      "args": [
        "--config", "/absolute/path/to/boundscope/examples/targets.json",
        "--store", "/absolute/path/to/boundscope/local/agent-reports"
      ]
    }
  }
}
```

Once connected, you can just ask the agent: "Use Boundscope to check buffer-demo, show the failing input, source line, and diagnostic alongside the valid control, and read its execution trace." The client starts the server itself and discovers the available tools (check, retest, read report, read trace) — no need to run the CLI by hand.

## Comparison with Existing Tools

| | Boundscope | Manual `clang -fsanitize=address` | Valgrind |
|---|---|---|---|
| Agent-callable (MCP) | ✅ | ❌ | ❌ |
| Automatic before/after comparison (retest links to the original report) | ✅ | Manual bookkeeping | Manual bookkeeping |
| Saves reproducible inputs and source snapshots | ✅ | ❌ | ❌ |
| Requires recompiling the target | Yes (sanitizers are compile-time instrumentation) | Yes | No (runs the existing binary) |
| Detects undefined behavior beyond memory | ✅ (UBSan) | Need to add the flag yourself | ❌ |

## Caveats

- **Very new, narrow verification so far**: created 2026-10-15, 1 star. The README states it has only been verified locally on macOS arm64 so far; Linux and hosted CI verification haven't happened yet.
- **Single-file compilation only**: it currently compiles small programs and test harnesses directly with Clang. Make/CMake integration, fuzzing, and leak/thread checking are all still on the roadmap, not implemented yet.
- **Not a sandbox**: the README says plainly that "programs use your account's permissions and are not sandboxed," and reports store source, inputs, and logs — review before sharing. The docs also explicitly tell agents to treat that content as data, not instructions.
- **A clean result only covers the inputs you tested**: it's not proof the program has no memory errors, only that none were observed on those specific inputs.

## Today's Takeaway

I used to think "should an agent's code be tested" was mainly a test-coverage question. Boundscope points at something more fundamental for C/C++: memory errors often aren't caught by tests at all — the program still runs to completion, the output can even happen to be correct, while sitting right at the edge of undefined behavior. Turning sanitizer checks into something an agent can call itself and use to compare before/after splits "did it compile" from "does it have memory errors" instead of assuming the former implies the latter.

## References

- [Boundscope (ArcX-Research/boundscope) — GitHub](https://github.com/ArcX-Research/boundscope)
- [Boundscope roadmap](https://github.com/ArcX-Research/boundscope/blob/main/ROADMAP.md)
- [AddressSanitizer — Clang documentation](https://clang.llvm.org/docs/AddressSanitizer.html)
- [Model Context Protocol](https://modelcontextprotocol.io/)
