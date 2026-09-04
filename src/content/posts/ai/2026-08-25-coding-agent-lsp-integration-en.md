---
title: "Learning Design from Mature Coding Agents (36): LSP Integration — Pushing Compiler Diagnostics into Agent Context"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 36
tags: [coding-agent, lsp, diagnostics, looplane, oh-my-pi, claude-code, opencode]
lang: en
tldr: "looplane can now inject repository diagnostics and open-file state into the next model turn, push typed IDE context over WebSocket, package a VS Code bridge, and supervise long-lived LSP subprocesses through ManagedLspServer. Language-specific initialize/didOpen/didChange adapters and live-editor validation remain open."
description: "Comparing LSP diagnostic injection across mature coding agents, including looplane's IDE context, WebSocket, VS Code, and ManagedLspServer baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-lsp-integration)

The previous post covered [model catalogs and routing](/posts/ai/2026-08-25-coding-agent-model-catalog-routing-en). This one is about a sensory-layer question: how does an agent "see" that code is broken?

## The capability gap: verification signal latency

`run_check` remains looplane's quality gate for deciding whether code is correct, but it is no longer the model's only feedback source. IDE/LSP diagnostics and open-file state can be injected into the next turn, revealing precise locations before a full test run. The roles are explicit: LSP is advisory; checks are verification evidence.

Human engineers don't work this way. The moment you hit save, the language server in your editor has already drawn red squiggles — type errors, undefined variables, a misspelled import — all marked at precise locations. [LSP, the Language Server Protocol](https://microsoft.github.io/language-server-protocol/), standardizes exactly this: the editor sends didOpen/didChange, and the server pushes back structured errors via `textDocument/publishDiagnostics`.

The problem: coding agents have no editor. Who receives those diagnostics? And once received, how do they get into model context? Of the five reference projects, three built it and two didn't, and the implementations differ wildly.

Evidence scope: **pi** (badlogic/pi-mono), **omp** (can1357/oh-my-pi), **opencode** (sst/opencode), **codex** (openai/codex), and **claude-code** (community-decompiled v2.1.88; symbol names may drift from upstream). Every citation was grepped in local clones — negative findings included.

One correction to my own routing table up front: I had omp's LSP listed under `crates/` as lsp/dap crates. In reality `oh-my-pi/crates/` contains only pi-ast, pi-shell, and friends — there are no standalone lsp/dap crates. All of omp's LSP integration lives TypeScript-side under `packages/coding-agent/src/lsp/`. Recorded here so I don't fool myself twice.

## How the five projects do it

### omp: mandatory edit writethrough + deferred diagnostic injection

omp went heaviest. The core concept is called writethrough: file-writing tools don't touch disk directly — every write passes through `oh-my-pi/packages/coding-agent/src/lsp/writethrough.ts#createLspWritethrough`, which first notifies the LSP server (didOpen/didChange/didSave), waits for diagnostics, then lands the file. Waiting is budgeted: constants in `diagnostics.ts` spell it out — 500ms inline (`INLINE_DIAGNOSTICS_WAIT_TIMEOUT_MS`), 3 seconds max for a single file (`SINGLE_DIAGNOSTICS_WAIT_TIMEOUT_MS`), 400ms batched.

The clever part is late diagnostics. rust-analyzer won't always finish within 500ms, but the tool result already needs to go back to the model. `oh-my-pi/packages/coding-agent/src/lsp/deferred-diagnostics.ts#DeferredDiagnostics` handles this: each file mutation bumps a mutationVersion, and late diagnostics carry the version they were generated against. If the file changed since (version mismatch), they're dropped outright — `isStale()` prevents the model from fixing phantom errors. Live diagnostics go through the yieldQueue in `sdk.ts` under `LSP_LATE_DIAGNOSTIC_MESSAGE_TYPE`, batched and injected into the next turn's context.

Noise suppression uses a ledger: `oh-my-pi/packages/coding-agent/src/lsp/diagnostics-ledger.ts#DiagnosticsLedger.reduce` strips location prefixes to compute each diagnostic's identity, so anything already seen for a file isn't re-reported.

omp also exposes an active query tool, `oh-my-pi/packages/coding-agent/src/lsp/tool.ts#LspTool`, with actions including status, diagnostics, definition, symbols, rename_file, and reload; read-only sessions gate write-like actions through `LSP_READONLY_ACTIONS`. The builtin server preset table `src/lsp/defaults.json` ships sixty-plus language servers, down to tlaplus and gleam.

### claude-code: passive subscription + attachment delivery

claude-code took a completely different path: no writethrough, purely passive. `claude-code-source/src/services/lsp/passiveFeedback.ts#registerLSPNotificationHandlers` subscribes to `textDocument/publishDiagnostics` on every server; incoming notifications land in a registry, and before each new query, `claude-code-source/src/utils/attachments.ts#getLSPDiagnosticAttachments` drains pending items and delivers them into the conversation as attachments.

Volume control is meticulous (`claude-code-source/src/services/lsp/LSPDiagnosticRegistry.ts#checkForLSPDiagnostics`): max 10 per file, 30 total, sorted by severity so Errors win; dedup keys hash message+severity+range+source+code, with an LRUCache tracking delivered diagnostics across turns (500-file cap); when a file gets edited, `clearDeliveredDiagnosticsForFile` clears its record — so a recurring error only re-reports if it genuinely reappears.

Two decisions worth noting: servers can only come from plugins (`services/lsp/config.ts#getAllLspServers` explicitly rules out user/project settings), collapsing supply to vetted sources; and this comment in attachments.ts — "LSP diagnostics are only useful if the agent has the Bash tool" — passive diagnostics are only valuable when the agent can act on them, otherwise they're just context pollution.

### opencode: append an error block to tool results

opencode kept it simplest: no injection timing gymnastics — just append diagnostics to edit/write tool output. `opencode/packages/opencode/src/lsp/diagnostic.ts#report` picks only severity===1 errors, caps at 20 per file, and renders a `<diagnostics file="...">` XML block; `tool/edit.ts` and `tool/write.ts` call it. Write even scans project-level diagnostics but clamps with `MAX_PROJECT_DIAGNOSTICS_FILES`.

One client-side detail worth stealing: `src/lsp/client.ts` deliberately does not clear the diagnostics store on didChange, because servers like clangd only re-emit when content actually changes — clearing first would blind-flash.

### pi and codex: nothing

Negative findings get recorded too. No LSP integration anywhere in pi-mono's core; codex-rs likewise has none. Codex's philosophy is that the shell is the single source of truth — verify by running builds and tests — making it the closest blood relative to looplane's run_check. And omp's entire LSP stack was added after forking pi; the two generations together are a design document in themselves: upstream decided "execution results suffice," the fork decided "real-time diagnostics justify a few extra subprocesses."

## Academic and engineering grounding

The theoretical basis here is old news: the [SWE-agent paper](https://arxiv.org/abs/2405.15793) put ACI (agent-computer interface) design on the map, and its first principle is low-cost feedback — linting works because it demotes "where is the error" from an inference problem to a reading problem. The official [LSP specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/) defines the Diagnostic structure (range, severity, source, code) — a ready-made structured error format, no custom schema required. The [rust-analyzer manual](https://rust-analyzer.github.io/manual.html) shows how flycheck (save-triggered cargo check) pushes async compilation results back into the editor — and omp setting `checkOnSave: false` for rust-analyzer is precisely about not fighting its own writethrough.

The costs deserve honesty: one or more long-lived subprocesses per project (rust-analyzer eats memory without apology), indexing takes time to warm up (omp has a warmup mechanism and a `DIAGNOSTICS_PIPELINE_GRACE_MS = 10_000` pipeline grace window), and diagnostics are advisory, not verdicts — a crashed server, a cold index, or misconfiguration means silence, and silence is not proof of correctness.

## The baseline now implemented in looplane

`ide.py` defines bounded diagnostics and open-file snapshots. The native loop injects them into the next model turn as marked context and emits `ide.diagnostics_injected` / `ide.open_files_injected` events. The stateful WebSocket also accepts typed IDE context, and `editors/vscode` can be packaged and smoked locally.

`ManagedLspServer` owns the long-lived process: exact argv, bounded message sizes, stdio `Content-Length` framing, `publishDiagnostics` parsing, atomic snapshot writes, and bounded shutdown are implemented. `run_check` remains the verification gate; LSP stays advisory.

Language-specific initialize, didOpen, and didChange adapter details still need work, along with live validation in real VS Code and multilingual projects. Current tests establish process ownership and context injection, not plug-and-play support for every language server.

## References

- [looplane `lsp.py` at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/lsp.py)
- [looplane IDE bridge at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/ide.py)

- [Language Server Protocol official site](https://microsoft.github.io/language-server-protocol/) / [LSP 3.17 Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- [oh-my-pi (GitHub)](https://github.com/can1357/oh-my-pi) — `packages/coding-agent/src/lsp/`
- [sst/opencode (GitHub)](https://github.com/sst/opencode) — `packages/opencode/src/lsp/`
- [anthropics/claude-code (GitHub)](https://github.com/anthropics/claude-code)
- [openai/codex (GitHub)](https://github.com/openai/codex), [badlogic/pi-mono (GitHub)](https://github.com/badlogic/pi-mono)
- [Pyright documentation](https://microsoft.github.io/pyright/), [rust-analyzer Manual](https://rust-analyzer.github.io/manual.html)
