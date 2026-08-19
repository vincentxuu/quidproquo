---
title: "omp (Oh My Pi): The Fork That Inverts Pi's Minimalism"
date: 2026-08-19
category: tech
type: deep-dive
tags: [omp, pi, coding-agent, cli, rust, open-source, ai-tools]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 16
tldr: "omp is a fork of Pi, but it is not just a plugin layer stacked on top: it adds roughly 80,000 lines of Rust, pulling grep, shell, AST, and PTY in-process. Built-in tools go from Pi's 7 to 31, plus 14 LSP ops, 28 DAP ops, and 60+ providers. One codebase, two opposite bets."
description: "How omp (Oh My Pi) actually diverges from upstream Pi: tool count, the native Rust layer, benchmark numbers behind the hashline edit format, mechanisms like advisor/TTSR/URI schemes, and the trade-offs on both sides."
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)

[Pi is a coding harness kept deliberately small](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) — four tools handed to the model, with MCP, sub-agents, plan mode, and permission popups all explicitly declined. omp (Oh My Pi) is its fork, and it runs in the opposite direction: 31 built-in tools, 14 LSP operations, 28 DAP operations, 60+ model providers, and roughly 80,000 lines of Rust.

This piece is not about which one is better. It is about what each side paid after the codebase split.

## The numbers first

Measured 2026-08-19:

| | Pi | omp |
|---|---|---|
| repo | `earendil-works/pi` (formerly `badlogic/pi-mono`, now 301s) | `can1357/oh-my-pi` |
| author | Mario Zechner | Can Bölük |
| stars / forks | 93,258 / 11,549 | 25,706 / 2,477 |
| created | 2025-08-09 | 2025-12-31 |
| commits | — | 18,392 (about 8 months) |
| language mix | TypeScript 8.5 MB, C 10 KB | TypeScript 50.1 MB, **Rust 5.2 MB**, Python 3.0 MB |
| built-in tools | 7 | 31 |
| license | MIT | MIT (copyright held jointly: Mario Zechner 2025 / Can Bölük 2025-2026) |

omp's README states the lineage plainly:

> omp is a fork of [pi-mono](https://github.com/badlogic/pi-mono) by Mario Zechner, extended with a batteries-included coding workflow.

Worth noting: the GitHub API reports `fork: false` for `oh-my-pi`. It is a standalone repository, not a GitHub-level fork.

## Pi's missing features are a position, not a gap

It is easy to read the blank cells in a comparison table as "not built yet." Pi's README has an entire Philosophy section listing each refusal along with the alternative:

> **No MCP.** Build CLI tools with READMEs, or build an extension that adds MCP support.
> **No sub-agents.** There's many ways to do this. Spawn pi instances via tmux.
> **No permission popups.** Run in a container, or build your own confirmation flow.
> **No plan mode.** Write plans to files.
> **No built-in to-dos.** They confuse models. Use a TODO.md file.
> **No background bash.** Use tmux. Full observability, direct interaction.

The tool list makes the stance concrete. Pi ships seven: `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls` — and **only the first four are given to the model by default**. Permissions follow the same logic; Pi's docs say outright that it "does not include a built-in permission system for restricting filesystem, process, network, or credential access." If you want boundaries, containerize or use a micro-VM.

Pi's bet: the smaller the core, the more you can shape it — and a very short system prompt keeps a 1.7B local model viable.

## The divergence is not in the plugin layer

The easiest way to misread omp is to treat it as "Pi with a big pile of features bolted on." The language mix says otherwise. Pi is essentially pure TypeScript; omp adds six Rust crates plus a vendored fork of the brush bash shell.

| Crate | What it does | ~LoC |
|---|---|---|
| `pi-shell` | Embedded bash engine, persistent sessions, in-process coreutils dispatch | 38,000 |
| `pi-natives` | The N-API surface (desktop, grep, text, diff, pty, …) | 25,000 |
| `pi-walker` | Parallel ignore-aware filesystem walker plus shared scan cache | 5,200 |
| `pi-iso` | Workspace isolation: apfs, btrfs/zfs reflink, overlayfs, projfs | 3,300 |
| `pi-ast` | tree-sitter + ast-grep matching and structural summaries | 2,900 |
| `pi-voice` | Audio capture/playback, Opus, WebRTC | 1,000 |

The README's framing:

> Other agents shell out to rg, grep, find, and bash. On many machines those binaries don't exist, and on the ones where they do, every call costs a fork-exec round-trip. omp links the real implementations into the process.

This is a **rewrite of the tool layer**, not a stack of plugins. Two consequences follow: no fork/exec on the hot path, and a single binary that runs on macOS, Linux, and Windows without a WSL bridge.

(One citation hazard: omp's own docs give three conflicting counts for bundled CLI utilities — the README body says 58, the `bash` tool description says "46 in-process coreutils," and the crate table for `pi-builtins` says "67 in-process command-line utilities." Cite the crate table, or flag the uncertainty.)

## hashline: when the harness is the only variable

omp's best-evidenced claim concerns edit formats. The author's essay "The Harness Problem" runs a controlled benchmark — 180 tasks, three runs per model, a fresh session each time, with only the edit tool swapped:

> We improved 15 LLMs at coding in one afternoon. Only the harness changed. In fact only the edit tool changed. That's it. **+15pts avg over patch, 16 models.**

Hashline works by tagging every line with a 2-3 character content hash when the model reads a file. Edits reference those anchors instead of retyping content. If the file changed since the read, the hashes diverge and the patch is rejected before anything is written.

Citable results:

- Hashline beat the `apply_patch` format on **14 of 16** models
- Largest delta was Grok Code Fast 1 at **+64.6 pts**
- Grok 4 Fast spent **61% fewer** output tokens — the savings come from eliminating the retry loop on bad diffs
- Failure rates in the control: Grok 4 failed **50.7%** of patch-format edits, GLM-4.7 **46.2%**

The essay's diagnosis of the status quo is blunt. Codex's `apply_patch` is a format OpenAI biases token selection toward at the gateway, so it collapses on other models. The `str_replace` approach used by Claude Code and most others requires the model to reproduce prior content character-for-character including indentation — "String to replace not found in file" is common enough to have its own GitHub megathread. Cursor went as far as fine-tuning a 70B model whose entire job is merging draft edits correctly.

## Mechanisms upstream genuinely lacks

**Advisor.** A second model on its own context reads every turn the main agent takes and injects inline notes — an aside, a concern, or a hard blocker. The main agent course-corrects or explains why it won't.

**TTSR (Time-Traveling Stream Rules).** Rules stay dormant and cost no context. On a regex match the stream aborts **mid-token**, the rule is injected as a system reminder, and generation retries from the same point. Injections survive compaction.

**URI schemes as a filesystem.** Sixteen internal schemes (`pr://`, `issue://`, `agent://`, `skill://`, `ssh://`, …) resolve transparently inside every FS-shaped tool. `read pr://1428` returns the same shape as `read src/foo.ts`, and `grep` walks a diff like a directory. Merge conflicts use the same surface: write `@theirs`, `@ours`, or `@base` to `conflict://N`, or `conflict://*` in bulk.

**Typed subagent output.** `task` fans out into isolated worktrees, and the final yield is a schema-validated object the parent reads directly. The README is pointed about the motivation — Claude Code "to this day leaks raw JSONL from sub-agent outputs, wasting hundreds of thousands of tokens."

**Also.** `/collab` puts a live session on a relay and returns a link plus a QR code, with frames sealed client-side so the relay never sees your keys; `web_search` chains 23 providers with site-aware extraction for GitHub, npm/PyPI/crates.io, arXiv, and Stack Overflow; ACP makes omp a first-class agent inside Zed.

## What it costs

omp is not a free upgrade.

**Complexity.** 31 tools, ten model roles (`default`, `smol`, `slow`, `plan`, `commit`, `vision`, `designer`, `task`, `advisor`, `tiny`), fallback chains, path-scoped models, round-robin credential rotation — all of it configurable, all of it a surface that can go wrong. Not having to face any of this is Pi's entire pitch.

**The sandbox problem is inherited intact.** omp has approval modes (`always-ask`, `write`, `yolo`), but it still runs with the permissions of the process that launched it — across a much larger tool surface. The `computer` tool sends native input to your real desktop, reads the accessibility tree, and touches the clipboard. Isolation still means containers.

**It moves fast.** 18,392 commits in eight months. The build on my machine is v16.1.20 while npm is already at v17.3.7 — a full major behind. That is a different maintenance profile from something deliberately small.

**The native layer means platform coupling.** Prebuilt binaries cover `linux-x64`, `linux-arm64`, `darwin-x64`, `darwin-arm64`, and `win32-x64` only. Alpine/musl users must `apk add libstdc++ libgcc` first, because the prebuilt musl binary links `libstdc++`/`libgcc` dynamically.

## How to choose

```
              Do you want to decide what gets stacked?
                          │
              ┌───────────┴───────────┐
             yes                      no
              │                       │
             Pi                      omp
         7 tools                 31 tools
      pure TS, readable       80k lines of Rust
     small models viable      LSP / DAP / advisor
      build what's missing      works out of the box
      small maintenance        large config surface
```

Pick Pi if you want to read the whole harness, run local small models, embed the agent into your own workflow rather than the reverse, or simply want a codebase you can finish reading.

Pick omp if you want LSP-grade renames, a real debugger, and parallel subagents with typed output as existing capabilities rather than projects — or if you work on Windows and are done routing through WSL.

In one line: **Pi is a harness kept small on purpose, and what it lacks is what it declined to build; omp is a batteries-included fork whose tool layer was rewritten in Rust.** The difference is not whether you can stack things — it is whether you want to decide what gets stacked.

## References

- [can1357/oh-my-pi (omp GitHub repo)](https://github.com/can1357/oh-my-pi)
- [omp.sh](https://omp.sh)
- [omp CHANGELOG](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/CHANGELOG.md)
- [@oh-my-pi/pi-coding-agent on npm](https://www.npmjs.com/package/@oh-my-pi/pi-coding-agent)
- [The Harness Problem (Can Bölük, 2026-02-12)](https://blog.can.ac/2026/02/12/the-harness-problem/)
- [earendil-works/pi (upstream Pi repo)](https://github.com/earendil-works/pi)
- [pi.dev](https://pi.dev)
- [Agent Client Protocol (ACP)](https://github.com/zed-industries/agent-client-protocol)
- [brush-shell (the bash implementation omp vendors)](https://github.com/reubeno/brush)
- Related: [Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en)
- Related: [The Complete Agent CLI Guide](/posts/ai/2026-04-01-agent-cli-guidelines-en)
