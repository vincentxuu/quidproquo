---
title: "Why Python: The Cost and Compensation of Language Choice for Coding Agents"
date: 2026-08-25
category: ai
type: deep-dive
tags: [coding-agent, python, rust, typescript, language-choice, uv, startup-performance]
lang: en
series:
  name: "跟成熟 coding agent 學設計"
  order: 23
tldr: "None of the five mature coding agents use Python — pi/opencode/claude-code run on TypeScript, codex rewrote TS into Rust, omp bolted ~80k lines of Rust native crates onto its hot path. rivumi still chose Python; the costs are startup performance and packaging, compensated by lazy imports, uv, and Cloudflare Sandbox."
description: "Using source-code evidence from five mature coding agents, an engineering analysis of language choice for coding agents: why the mainstream chose TS/Rust, why rivumi still chose Python, and the three-layer compensation of lazy imports, uv, and remote sandboxing."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-why-python)

## The Design Question

A coding agent has an awkward shape: it's a CLI a user launches dozens of times a day (startup latency is directly felt), a long-running agent loop (CPU-light, I/O-heavy), a constantly churning mass of prompts and tool logic (extremely high change frequency), and a heavy consumer of model SDKs. These four traits pull in opposite directions: the CLI must be fast, the loop must be stable, the logic must be easy to rewrite, the SDKs must be complete. No language wins all four, so every project's choice is really answering one question: **which cost are you willing to pay?**

## Five Projects, Their Choices, and Migration History

Open the manifests of the five repos in `~/Projects/coding-agent-reference/` and the conclusion is remarkably consistent — none of them use Python.

**pi** (badlogic/pi-mono) is a TypeScript/Bun monorepo. Its core package `pi-mono/packages/coding-agent/package.json` carries only 20 runtime dependencies, deliberately keeping the dependency surface small.

**opencode** (sst/opencode) is also Bun/TS but at a different scale entirely: `opencode/packages/opencode/package.json` lists roughly 117 dependencies across thirty-plus packages, leaning on libraries like Effect to enforce type discipline.

**claude-code** goes further: in the decompiled source, `claude-code-source/package.json` has an empty `dependencies` field — everything is bundled into a single JS file; you don't even get to see the dependency list.

**codex** (openai/codex) is the only one that publicly switched languages: the early CLI was Node/TS, later rewritten wholesale into `codex/codex-rs/` — now home to nearly a hundred Rust crates (96 directories carry a `Cargo.toml`). The original npm package didn't die, but it was demoted to an installer: `codex/codex-cli/bin/codex.js` with its `PLATFORM_PACKAGE_BY_TARGET` map just locates the platform-appropriate Rust binary (`@openai/codex-darwin-arm64` etc.) and spawns it. Node went from runtime to bootloader.

**omp** (can1357/oh-my-pi, a fork of pi) took a third path: keep the TS core, but sink performance-sensitive grunt work into Rust. `oh-my-pi/Cargo.toml` defines six `pi-*` workspace crates plus a vendored bash engine; the README gives its own number — "~80,000 lines of Rust" — with shell, grep, AST, and PTY all compiled into one N-API addon, eliminating fork/exec from the hot path. Notably it never abandoned its TS upstream: `docs/porting-from-pi-mono.md` is a continuously maintained guide for syncing from pi-mono, with the latest sync point marked at 2026-03.

Three strategies: pi bets on small-and-clean TypeScript; codex rewrites outright; omp patches holes with Rust native crates without moving house. The common thread — **nobody thought Python was worth a shot**. The reason isn't hard to guess: model APIs are just HTTP + JSON that any language can handle, while fast CLI startup and single-file distribution are precisely Python's two weakest points.

## rivumi's Choice and Where It Differs

rivumi chose Python — knowingly.

Three reasons. First, the AI ecosystem genuinely lives on Python's side: eval tooling, model SDKs, and data-processing scripts default to it, and one line in `pyproject.toml` (`openai>=1.68.0`) wires up the entire OpenAI-compatible world. Second, development speed — the prompt and tool logic changes weekly, and Python has the shortest rewrite loop. Third, maintainability for a solo project: 6 runtime dependencies (versus opencode's 117), a supply chain one person can actually read end to end.

The costs are equally honest. **Startup performance**: measured on 2026-08-22, `.venv/bin/python -c "import rivumi.cli"` took 701ms — burned before the TUI even appears; `python -X importtime` shows the biggest culprit is the eagerly imported openai SDK at the top level (247ms). **Packaging**: TypeScript can bundle to a single file (claude-code is exactly that), Rust ships static binaries, but Python drags along an interpreter and virtualenv everywhere — whether the user's machine has a suitable Python is a real question.

Compensation comes in three layers. Layer one, lazy imports: `src/rivumi/cli.py` now documents explicitly that heavy modules (provider SDKs, vendor backends, Textual, uvicorn) load lazily, types guarded by `TYPE_CHECKING`; this alone is expected to cut 300–400ms. Layer two, uv: dev and tests all run through `uv run`, bringing environment setup from minutes down to seconds. Layer three, Cloudflare Sandbox: the M6 design runs the whole Python `AgentRunner` inside a disposable Sandbox (`docs/research/m6-cloudflare-sandbox-design.md`) while the Worker handles validation and teardown — local interpreter-version problems get bypassed by "don't run it on the user's machine at all."

## Engineering Evidence

"Python is slow" needs unpacking. The [uv documentation](https://docs.astral.sh/uv/) turned Python's most painful problem — environment management — into Rust-grade speed, which shows the ecosystem itself is already patching this hole: what's slow is often not execution but the toolchain. On startup latency, CPython's [`-X importtime`](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime) is the official diagnostic entry point, and rivumi's 701ms is almost entirely import cost rather than interpreter cold start (a bare interpreter starts in tens of milliseconds).

The more persuasive counterexample comes from codex itself. Per rivumi's startup-performance playbook, Codex CLI 0.148.0's startup gains were all at the process level — faster credential reads, plugin discovery caching, parallel exploration — and a single PR (openai/codex#26469) took median TUI startup from 833ms to 504ms. Codex was already Rust; what was slow wasn't the language but the life-cycle design. That's good news for Python projects: if process-level optimization can rescue Rust, it can rescue Python too.

## Improvement Roadmap

1. **Solidify benchmarks**: add `scripts/bench_startup.sh` per the playbook checklist — hyperfine paired medians, plus a CI gate rejecting >10% regressions.
2. **Complete the lazy-import sweep**: when M13 adds external OpenCode/Pi/OMP adapters, they must not grow shared startup cost; new adapters import only when their subcommand fires.
3. **Distribution experiments**: evaluate `uv tool install` versus PyInstaller single-file, targeting users who never manage their own Python version.
4. **A boundary for sinking hot paths**: learn from omp, not codex — if CPU-intensive needs arise (say, large-scale AST matching), consider a point-solution Rust extension or vendored binary before any wholesale rewrite. 80k lines of Rust is a team's output, not a solo project's option.

The final criterion for language choice isn't a benchmark leaderboard; it's "where is your bottleneck, exactly." The five chose TS/Rust because their bottleneck is startup feel distributed to millions of users; rivumi chose Python because its bottleneck is whether one person can sustainably iterate on a complex system. Honestly listing the costs and compensating for each matters more than picking the "right" language.

## References

- [uv Documentation (Astral)](https://docs.astral.sh/uv/)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [napi-rs: Rust ↔ Node N-API framework](https://napi.rs/)
- [CPython command-line docs: -X importtime](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime)
