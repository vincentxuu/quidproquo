---
title: "Tool Pick | reverify — Let Deterministic Byte-Level Tools Be the Judge of AI's Reverse-Engineering Claims"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "reverify checks every claim an AI makes about a binary against deterministic disassembly, emulation, and pattern scans; a benchmark on 19 Windows system files found the model's guessed entry-point prologue wrong 100% of the time, and reverify caught every single one with zero false accepts"
tldr: "reverify is an open-source MCP server plus CLI that puts a pure-Python deterministic reverse-engineering toolkit (disassembly, CPU emulation, pattern scanning) in the judge's seat for whatever an AI claims about a binary. Install: `pip install reverify`. It addresses the problem of an agent stating guesses about a binary as if they were fact, with no way for you to tell which is which."
series:
  name: "AI Tool of the Day"
  order: 20
---

> 🌏 [中文版](/posts/daily/2026-09-04-tool-reverify)

## Tool Info

| Field | Value |
|---|---|
| Name | reverify |
| Type | MCP server + CLI (binary reverse-engineering verifier) |
| GitHub | [2akouwu/reverify](https://github.com/2akouwu/reverify) |
| Stars | 728 |
| Language | Python |
| License | MIT |
| Install | `pip install reverify` |

## What Problem It Solves

Have you ever pointed an AI at an unfamiliar `.exe` or `.dll` and asked it to reconstruct a struct, or explain what a chunk of code does? It answers with total confidence — this is the offset, this is what the entry prologue looks like — but you have no way to tell how much of that came from actually reading the bytes versus being recalled from a "textbook answer" buried in training data. Reverse engineering is a worse hallucination surface than reading source code, because there's no compiler standing between a wrong guess and an error message: broken code usually fails to run, but a wrong reverse-engineering claim still sounds completely plausible.

reverify pairs the AI with a pure-Python deterministic reverse-engineering toolkit and makes that toolkit the judge. The model proposes a "claim" — what instructions sit at a given offset, what register values a snippet produces after execution — and that claim only counts once it has actually been checked by a disassembler, a pattern scanner, or a CPU emulator, coming back as `VERIFIED`, `REFUTED`, or `INCONCLUSIVE` along with the evidence bytes. The core is pure Python and installs without Ghidra; running `pip install "reverify[full]"` upgrades it in place to mature engines — capstone for disassembly, unicorn for real CPU emulation, lief for PE/ELF/Mach-O parsing — and it falls back to the pure-Python core when those aren't installed.

Good fit for: malware analysis, CTF reverse/pwn challenges, interoperability research against a binary you don't have source for — anywhere you want an agent's help reading a binary but can't just take its word for what it says it found.

## Quick Start

### Install

```bash
# Pure-Python core
pip install reverify

# Full version with capstone + unicorn + lief
pip install "reverify[full]"

# Or run straight from a checkout — pure standard library, nothing to install
git clone https://github.com/2akouwu/reverify
python reverify/cli.py auto sample.bin --json
```

### Basic Usage

```bash
# Auto-triage: detect format, architecture, sections, extract strings
reverify auto sample.bin --json

# Verify a claim about a specific offset
reverify verify sample.bin --claim '{
  "kind": "instructions",
  "offset": 4096,
  "mnemonics": ["push", "mov", "sub"],
  "note": "function prologue"
}'
```

The response isn't a bare yes/no — it's `VERIFIED`, `REFUTED`, or `INCONCLUSIVE` along with the bytes the tools actually observed; a `REFUTED` result also reports where the expected bytes actually turn up. Claims can be batched with `--claims-file claims.json`, and the CLI exits non-zero if anything is refuted, so an agent or a CI job can gate on it.

### Advanced Usage

```bash
# Run as an MCP server so Claude Code / Cursor can call it directly
python reverify/mcp_server.py
```

Over MCP you get two extra tools: `re_verify_claim` exposes the verification loop directly to the agent, and every grounded result gets written to a per-binary ledger (`.reverify/ledger/<hash>.json`); `re_ledger` hands that state back after the host compacts context or runs `/clear` — because only what the tools actually verified, observed, or refuted was ever trusted in the first place, so nothing is lost by dropping everything else the model said.

## Comparison with Existing Tools

| | reverify | Asking AI directly (no verification layer) | Manual Ghidra/IDA analysis | A generic "AI disassembly" wrapper |
|---|---|---|---|---|
| Claims checked against deterministic byte evidence | ✅ | ❌ | ✅ (by a human) | ❌ |
| Works without installing Ghidra | ✅ (pure-Python core) | — | ❌ | Depends |
| Ships as an MCP server agents can call natively | ✅ | — | ❌ | Partial |
| State survives a context compaction/clear | ✅ (ledger on disk) | ❌ | ✅ (human memory) | ❌ |
| Requires manual step-by-step operation | ❌ (can loop automatically via `reconstruct`) | — | ✅ | ❌ |

## Things to Watch Out For

- **Authorized use only**: the README is explicit that this is for authorized reverse engineering — malware analysis, CTF, interoperability research, or software you own or are permitted to analyze — not a tool for cracking someone else's software.
- **Don't over-generalize the benchmark**: the published number ("19 real Windows system DLLs, the model's textbook prologue guess wrong 100% of the time, reverify caught every one with zero false accepts") measures one specific and common model prior about entry-point prologues, not a general error rate for all reverse-engineering inference — the project's own BENCHMARK.md says so explicitly.
- **Full functionality needs extra dependencies**: the pure-Python core's disassembly and emulation coverage is more limited without capstone/unicorn/lief installed.
- **Very new project**: v0.8.0, created on 2026-08-31 — despite crossing 700+ stars and 148 forks within three days, it's still iterating fast and the interface and claim schema may still change.

## Today's Takeaway

Most "AI agent tool verification" stops at whether a tool is allowed to be called. reverify goes one step further and checks whether what the model says about the result of that call is actually true — moving the judgment call from the model's own confidence to the bytes themselves. This pattern isn't limited to reverse engineering: any domain where an agent's output can be checked by a deterministic verifier (type checkers, schema validation, unit tests) can use the same "model proposes, tools decide" loop instead of trusting a model's own claim of certainty.

## References

- [reverify GitHub repo](https://github.com/2akouwu/reverify): project description, README, install instructions, MCP server design, license (MIT), stars/forks — all from the official repo.
- [reverify BENCHMARK.md](https://github.com/2akouwu/reverify/blob/main/BENCHMARK.md): raw data and methodology for the 19-Windows-DLL prologue-guessing benchmark.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
