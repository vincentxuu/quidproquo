---
title: "OMP vs looplane retrospective: what to borrow, what's over-engineered, what not to touch yet"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, looplane, coding-agent, architecture, retrospective, typescript, rust]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 15
tldr: "14 posts in, back to the big picture: append-only context, compaction strategy split, three-layer approval, KDL rule tree, session tree/fork are the five most borrowable; snapcompact, metaharness self-built infra are over-engineered; looplane shouldn't self-build full provider catalog, full TUI, or full collab yet. Philosophy diff: omp = batteries-included in-process, looplane = minimal + external runtime."
description: "OMP Internals Deep Dive finale. Contrasts omp vs looplane (ex-rivumi) architecture philosophy, catalogs which of the 14 designs are most borrowable, which are over-engineered, which looplane shouldn't touch short-term, and a pragmatic borrowing roadmap."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 15 — finale. The previous 14 dissected subsystems; this one zooms out, contrasting [looplane](https://github.com/looplane/looplane) (ex-rivumi) to answer: what to borrow, what's over-engineered, what not to touch yet.

> Looplane referenced is the Python implementation under `src/looplane`; omp is the TypeScript + Rust monorepo. Citations use dual track: `omp/package/file.ts#Symbol` vs `looplane/src/module.py#symbol`.

---

## TL;DR

| Category | Design | Why |
|---|---|---|
| **Most borrowable (5)** | append-only context, compaction split, three-layer approval, KDL rule tree, session tree/fork | Proven cost/correctness/security/maintainability wins; incrementally portable |
| **Over-engineered (3)** | snapcompact pure-vision path, metaharness self-built bench infra, bash tokenization extreme regex | Low ROI or replaceable by off-the-shelf tools |
| **Don't touch yet (3)** | Full provider catalog (60+), full TUI (differential rendering), full collab wire protocol | Requires long-term team investment; looplane can use external runtime + existing TUI |

**Philosophy diff**: omp bets "in-process batteries-included" — shoves grep/AST/PTY/isolation/voice into process via `crates/pi-*`; looplane bets "minimal harness + external runtime" — drives Codex / Claude Code as `ExternalCodingRunner`, focuses on thin prompt/permission/isolation layer.

Both work; difference is team size and maintenance cost.

---

## Five Most Borrowable

### 1. Append-only context (post 2)

`packages/agent/src/append-only-context.ts#AppendOnlyContextManager.syncMessages` longestStablePrefix maximizes Anthropic/DeepSeek prompt cache hits. Old code `log.clear()` on any digest change forced ~40k token re-prefill on llama.cpp every turn (issue #3406). New code resends only divergence tail; provider KV cache stays warm.

**Portability to looplane**: Very high. Add fingerprint + digest memo + version tag to `loop.py` context assembly. Saves 30–60% prompt tokens per model call.

### 2. Four compaction strategies (post 3)

context-full (LLM summary) / snapcompact (PNG for vision) / branch summary (`/tree` nav) / shake (mechanical placeholder). Four strategies for four failure modes, auto-orchestrated by `session-maintenance.ts`.

**Portability**: High. Looplane has checkpoint but lacks strategy split — single compaction only. Prioritize `shake` (pure-local, deterministic, zero-failure) then `branch summary` (tree nav without amnesia).

### 3. Three-layer fail-closed approval (post 4)

`packages/coding-agent/src/tools/approval.ts#resolveApproval`: tool declaration → user override → mode threshold, defaults `exec` (fail-closed). Deny always wins; yolo still doesn't cross tool/user deny.

**Portability**: Very high. Looplane's `permissions.py` has deny/allow but lacks `policyKey` dynamic tier and `CRITICAL_BASH_PATTERNS` hardcoded floor. Adding those lifts security baseline immediately.

### 4. KDL rule tree (post 7)

`packages/catalog/src/compat/rules/**` layers 60+ providers' routing/compat/thinking/quota as taxonomy/classes/providers/runtime, compiled to `rules.json`, resolved by `cascade.ts#resolveCascade` with (exactness, dimensions, priority). Zero `if (provider === "openai")` in TS.

**Portability**: Medium. Looplane's `provider_catalog.py` is hardcoded table. For 10+ providers, KDL pays off; for 3–5, hardcoding is fine.

### 5. Session tree / fork (post 9)

`packages/coding-agent/src/session/session-manager.ts#getTree` + `agent-session.ts#navigateTree`, entries with `id/parentId` form tree, leaf switch optionally `branch_summary`, fork copies JSONL + artifacts.

**Portability**: High. Looplane's event journaling has similar base; add `getTree` + `navigateTree` to support `/tree` navigation.

---

## Three Over-Engineered

### 1. Snapcompact pure-vision path

Rendering history as PNG for vision model saves LLM latency but assumes "vision model cheap and code-readable." Measured `11on16-bw` vs `8on22-bw` f1 delta 0.05 — ROI worse than `shake` + `branch summary`.

**Looplane**: Skip.

### 2. Metaharness self-built bench infra

`packages/metaharness` experiment→run→trace + Vibemon microVM + SQLite + REST dashboard vs `promptfoo` / `evals` / `harbor`. Self-build cost high.

**Looplane**: Use `promptfoo` + `evals`. Only build metaharness if "hardware isolation + auth gateway rewrite" required.

### 3. Bash tokenization extreme regex (post 5)

`CRITICAL_BASH_PATTERNS` 45 regexes + `hasBashApprovalShellControl` + glob-to-regex, triple layered. Good for security, but regex maintenance high; `rm -rf -- /` variants endless.

**Looplane**: Keep core 10–15 critical patterns + `deny` per-segment match; extreme strictness of `allow` whole-line can be simplified.

---

## Three Don't-Touch-Yet

### 1. Full provider catalog (60+)

`packages/catalog` tracks 60+ providers' model lists, pricing, context windows, thinking ladders via KDL + `bun run gen:compat`. Needs dedicated maintainer.

**Looplane**: Keep 3–5 core providers (OpenAI/Anthropic/Google/OpenRouter), hardcode `provider_catalog.py`, add 6th only when users truly need it.

### 2. Full TUI self-build (post 11)

`packages/tui` differential rendering + `composer` multimode + vim + IME + virtual list ≈10k lines. Looplane's `tui.py` with `textual` / `ink` suffices.

**Looplane**: Don't self-build; focus on prompt assembly and approval UX.

### 3. Full collab wire protocol (post 13)

`packages/wire` AES-256-GCM + 4-byte envelope + snapshot-chunk + timing-safe token for asymmetric "host runs agent, guest observes" model — long-term relay + permission maintenance.

**Looplane**: For multi-user, use `tmux` + `code-server` / `VS Code Live Share` first; don't build wire.

---

## Pragmatic Borrowing Roadmap (for looplane)

**Phase 1 (1–2 weeks)**:

1. Add `AppendOnlyContextManager` longestStablePrefix + digest memo (post 2)
2. Add `shake` mechanical placeholder (post 3's `DEFAULT_SHAKE_CONFIG`)
3. Add core 15 `CRITICAL_BASH_PATTERNS` + deny per-segment (post 5)
4. Add deny-always-wins + `policyKey` to `resolveApproval` (post 4)

**Phase 2 (1 month)**:

5. Add `branch summary` `/tree` nav (post 9)
6. Add minimal KDL or simplified rule tree (post 7's taxonomy + providers two layers)

**Skip**: snapcompact, metaharness, full TUI, full collab.

---

## Lessons Learned

1. **Borrow, don't rebuild** — omp's 80k Rust lines + 60+ providers = 8 months, 18k commits. Looplane shouldn't copy scale, but copy "why behind the design"
2. **Fail-closed is the only safe default** — undeclared approval = `exec`, unknown provider = strictest tier — both should follow this
3. **Cache-coherence is a cross-module contract** — `append-only-context.ts` + `message-cache.ts` + `tokenizer.ts` share version tags; single-file change must notify others
4. **Strategy split > single algorithm tuning** — compaction isn't "one algorithm tuned", but "four strategies for four failure modes" — more impactful than any single optimization

---

## References

- `packages/agent/src/append-only-context.ts` — longestStablePrefix
- `packages/agent/src/compaction/compaction.ts` / `shake.ts` / `branch-summarization.ts` — four strategies
- `packages/coding-agent/src/tools/approval.ts` — three-layer decision
- `packages/coding-agent/src/tools/bash.ts` — tokenized approval
- `packages/catalog/src/compat/rules/**` / `cascade.ts` — KDL rule tree
- `packages/coding-agent/src/session/session-manager.ts` — tree/fork
- `packages/coding-agent/src/edit/hashline/execute.ts` — hashline
- `docs/compaction.md` / `docs/approval-mode.md` / `docs/tree.md` — official docs

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 15 (finale). Full 15-post series complete.*
