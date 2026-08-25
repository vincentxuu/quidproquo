---
title: "Learning Design from Mature Coding Agents (17): Startup Performance and Engineering Discipline — It Was Never the Language"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 17
tags: [coding-agent, startup-performance, rivumi, hyperfine, lazy-import, benchmark]
lang: en
tldr: "A CLI tool pays its startup cost on every invocation, and performance optimization without a baseline means no regression protection. codex uses daemon reuse and skill snapshot caches; claude-code splits its entrypoint into dynamic imports plus a built-in startup profiler; opencode and omp each maintain lazy-loading discipline; pi does none of it and leans on Bun being fast. rivumi is Python — slow by birth — so it applies the full discipline: lazy imports, single-flight disk cache, background controller prewarming, and hyperfine paired benchmarks wired to a CI gate that fails on >10% regression."
description: "Comparing how codex, claude-code, opencode, pi, and omp handle startup performance in source, and how a Python CLI buys back the language penalty with pure engineering discipline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-startup-performance-discipline)

The [previous post](/posts/ai/2026-08-25-coding-agent-runtime-capability-handshake-en) covered runtime abstraction and capability handshakes. This one is about an unglamorous cost you pay every single day: startup.

## The design problem: you wait on every invocation, and nobody measures

CLI agents are not resident services. A user invokes them twenty times a day, and every invocation re-pays the cost of imports, config loading, credential checks, and runtime discovery. Slow startup isn't "slow execution" — it's a tax collected before every interaction. A TUI hasn't started until you can type into the composer; everything before that is pure friction.

The deeper problem is the second layer: **without a baseline, performance has no regression protection**. A broken functional test fails CI, but if some PR eagerly imports one more SDK and adds 300ms of startup, nothing catches it. Performance regressions are silent; by the time anyone notices, ten PRs of debt have piled up.

## What the five projects do

**codex** is Rust — compiled native binaries with no import tree to speak of, so fast startup comes for free. Yet it still does two things worth stealing. First, daemon reuse: `codex/codex-rs/tui/src/lib.rs#can_reuse_implicit_local_daemon` decides whether this invocation can reuse an already-running local daemon instead of cold-starting — even Rust doesn't want to initialize from scratch every time. Second, caching scan results: `codex/codex-rs/skills/src/loading.rs#SkillRootSnapshotCache` defines a cache interface for parsed skill roots, implemented in `codex/codex-rs/core-plugins/src/skill_snapshots.rs#PluginSkillSnapshotCache` as an in-memory map, so skill directories are never scanned and re-parsed repeatedly.

**claude-code** is Node.js and understands import pain best. Its entrypoint `claude-code-source/src/entrypoints/cli.tsx` is a thirty-line dispatcher sitting on top of nearly thirty `await import()` calls — config, bridge, daemon, computer use all load only after the matching subcommand is actually selected. More importantly, measurement is built into the product: `claude-code-source/src/utils/startupProfiler.ts#profileCheckpoint` instruments the startup path with Node's perf hooks, with phases hardcoded as import_time, init_time, settings_time, and total_time. External users are sampled at 0.5% and reported to Statsig (internal employees at 100%), and `CLAUDE_CODE_PROFILE_STARTUP=1` yields a full report with memory snapshots.

**opencode** ships the minimal utility: `opencode/packages/opencode/src/util/lazy.ts#lazy` — a dozen lines of memoization with reset, used across the codebase to wrap anything that should be built on first use. Subcommands also slice paths with dynamic imports heavily; in `opencode/packages/opencode/src/cli/cmd/run.ts`, the Server and interactive runtime load only inside their branches.

**omp** (oh-my-pi) goes further. Near `oh-my-pi/packages/coding-agent/src/cli.ts#runSmokeTest` a comment says it outright: "Other smoke dependencies stay lazy so normal CLI startup does not load their worker clients" — worker clients are unconditionally lazy; normal startup never touches them. Hot paths sink into Rust N-API natives (grep, find, PDF), replacing the parts TypeScript can't make fast.

**pi** is the counter-example, or rather the alternative bet. Its entrypoint `pi-mono/packages/coding-agent/src/cli.ts` eagerly imports main, `main.ts` opens with seventy lines of static imports, and there is no lazy discipline anywhere. It bets that Bun is fast enough and the module count small enough that startup stays acceptable. That holds — until it doesn't. This is "not yet painful," not "designed."

## rivumi's choices, and where they differ

rivumi is Python, and CPython's import cost is an order of magnitude worse than Bun's. The "rely on a fast runtime" path is simply closed, so all five principles get applied manually. The plan lives in `docs/plans/m12-startup-performance-plan.md`, distilled from Codex 0.148.0's lifecycle rework — the official optimizations were all process-level, and a single PR cut median TUI startup from 833ms to 504ms (figure from that PR's paired benchmark, relayed via our startup playbook).

Step one was freezing the baseline before touching code. A 2026-08-22 measurement recorded in the playbook: `python -c "import rivumi.cli"` took 0.701s, and `-X importtime` pinned the culprit on `codex_oauth` dragging in 247ms of the openai SDK. The fix was converting `src/rivumi/cli.py` wholesale to function-level lazy imports with `TYPE_CHECKING` guards — light routes like `--help` and `config` never load provider SDKs, uvicorn, or Textual again.

Measurement itself became infrastructure: `src/rivumi/startup_trace.py#_StartupTracer` instruments the startup path and emits JSON spans only when `RIVUMI_STARTUP_LOG` is set; when disabled, each span costs one flag check. It's isomorphic to claude-code's startupProfiler, except the output serves local developers instead of Statsig.

"Scans must not rerun" landed in `src/rivumi/startup_cache.py#cached_scan`: versioned schema, config-hash keys, disk cache with TTL, and single-flight — concurrent requests for the same resource admit only the first caller, and failures are never backfilled. Ollama model discovery was the first beneficiary (`src/rivumi/cli.py#_discover_local_ollama_models`).

The most interesting move is background prewarming. TUI mount doesn't mean the controller is ready — a Codex backend cold start takes roughly 2.1 seconds (measured in commit `ece3552`: controller.start ≈352ms for Claude, ≈2140ms for Codex). So App `on_mount` schedules prewarming of the native controller via `asyncio.create_task`; while the user types their first characters, the controller spawns behind the scenes, and the first turn's `_ensure_started` hits the cache at 0.01ms. Warmup exceptions are always swallowed — it's an optimization, not part of correctness.

Finally, the regression gate: `scripts/bench_startup.sh` codifies the hyperfine flow, a committed baseline (`benchmarks/startup-baseline.json` — median 0.492s for `--help`, 0.380s for `config` under the fallback timer) pairs with `.github/workflows/startup-perf.yml`, and `scripts/check_startup_regression.sh` compares paired medians, failing the merge beyond 10% regression. New external-runtime adapters added since M13 must plug into this lazy discovery contract and are forbidden from enlarging shared startup cost.

## Engineering rationale

Choosing the measurement tool is itself methodology. [hyperfine](https://github.com/sharkdp/hyperfine) earns its place through three things: warmup runs to remove cold-cache noise, statistically meaningful multi-run medians, and paired before/after execution so the candidate isn't accidentally measured during a quieter window on the machine. rivumi's `bench_startup.sh` follows exactly that playbook: `--warmup 3 --min-runs 10`, paired mode feeding both JSON files through one comparator that reports percentage change — relative comparisons only, with cross-machine absolute claims explicitly banned by the m12 plan. importtime diagnoses the cause; hyperfine verifies the cure. They're diagnosis and acceptance respectively, and must not be conflated.

## Improvement roadmap

The current gate still has visible rough edges. First, CI uses the fallback timer rather than hyperfine, the noise floor hasn't been formally established, and the 10% threshold is currently convention rather than a measured statistical boundary — the plan's "run reporting-only until the noise floor is confirmed" item remains outstanding. Second, the north-star metric, time-to-first-editable-composer, needs a TTY; benchmarks only cover proxy scenarios (help/config/import), so real TUI-ready time is only visible post hoc via `RIVUMI_STARTUP_LOG`, not automated in CI. Third, parallelizing independent startup steps (config reads, auth refresh, workspace prep) has only been done for prewarming — the dependency graph hasn't been systematically mapped. Fourth, stale-while-revalidate already has an escape hatch in `startup_cache.read_entry`, but no UI scenario actually uses it yet — "show stale data instantly, refresh in the background" is the next step that upgrades caching from time-saving to perceived-performance design.

It was never the language that was slow; it was the lifecycle design. And the best way to demonstrate engineering taste is public before/after numbers.

## References

- [hyperfine — command-line benchmarking tool](https://github.com/sharkdp/hyperfine): source of the paired-benchmark, warmup, and statistical methodology
- [openai/codex](https://github.com/openai/codex): daemon reuse in `codex-rs/tui/src/lib.rs`, skill snapshot cache in `codex-rs/skills/src/loading.rs`
- [anthropics/claude-code](https://github.com/anthropics/claude-code): analysis based on decompiled v2.1.88 source; see also the official [Agent SDK docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk/overview)
- [sst/opencode](https://github.com/sst/opencode): `util/lazy.ts` and per-subcommand dynamic imports
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) and [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi): the eager vs. lazy extremes compared
- [Python `-X importtime` documentation](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime): the standard tool for locating import culprits
