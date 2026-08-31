---
title: "OMP vs looplane 總集篇：哪些設計值得借鏡、哪些是過度工程、哪些短期不該碰"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, looplane, coding-agent, architecture, retrospective, typescript, rust]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 15
tldr: "14 篇拆完，回到總覽：append-only context、compaction 分工、審批三層、KDL rule tree、session tree 是最值得借鏡的五件；snapcompact、metaharness 自製基建屬於過度工程；looplane 短期不該自建完整 provider catalog、完整 TUI、完整 collab。兩者哲學差異：omp = batteries-included in-process，looplane = minimal + 外部 runtime。"
description: "OMP 內部設計導讀總集篇。對照 omp 與 looplane（原 rivumi）的架構哲學，盤點 14 篇中哪些設計值得借鏡、哪些是過度工程、哪些是 looplane 短期不該碰的，並給出一條務實的借鏡路線。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 15 篇，也是本系列總集。前面 14 篇拆完子系統，這篇把鏡頭拉遠，對照 [looplane](https://github.com/looplane/looplane)（原 rivumi）回答：哪些值得借鏡、哪些是過度工程、哪些短期不該碰。

> 本文對照的 looplane 為 `src/looplane` 路徑下的 Python 實作，與 omp 的 TypeScript + Rust monorepo 形成鮮明對比。引用採 `omp/package/file.ts#Symbol` vs `looplane/src/module.py#symbol` 雙軌。

---

## TL;DR

| 類別 | 設計 | 為什麼 |
|---|---|---|
| **最值得借鏡（5）** | append-only context、compaction 四策略分工、審批三層 fail-closed、KDL rule tree、session tree / fork | 成本、正確性、安全性、可維護性都有實證收益，且可增量移植 |
| **過度工程（3）** | snapcompact 純 vision 路線、metaharness 自製 benchmark 基建、bash token 化的極致正則 | 投入/收益比低，或可用現成工具替代 |
| **短期不該碰（3）** | 完整 provider catalog 自建（60+）、完整 TUI 自製（differential rendering）、完整 collab wire 協定 | 需要長期團隊投入，looplane 用外部 runtime + 現成 TUI 即可 |

**哲學差異**：omp 賭「in-process batteries-included」——把 grep/AST/PTY/隔離/語音全部搬進 process，靠 `crates/pi-*` 加速；looplane 賭「minimal harness + 外部 runtime」——把 Codex / Claude Code 當 `ExternalCodingRunner` 驅動，自己專注 prompt/權限/隔離的薄層。

兩條路都能通，差別在團隊規模與維護成本。

---

## 值得借鏡的五件

### 1. append-only context（order 2）

`packages/agent/src/append-only-context.ts#AppendOnlyContextManager.syncMessages` 的 longestStablePrefix 算法，讓 Anthropic/DeepSeek 的 prompt cache 命中率最大化。舊版任何 digest 變化就 `log.clear()`，在 llama.cpp 上每輪強制 ~40k token re-prefill（issue #3406）。新版只重送 divergence tail，provider KV cache 保持溫暖。

**looplane 可移植性**：極高。只需在 `loop.py` 的 context 組裝處加入 fingerprint + digest memo，與 `messageEstimateVersion` 類似的 version 標籤。收益是每次 model call 省 30–60% prompt token。

### 2. compaction 四策略分工（order 3）

context-full（LLM 摘要）/ snapcompact（PNG 給 vision）/ branch summary（`/tree` 導航）/ shake（機械 placeholder）。四種策略對應四種失敗模式，由 `session-maintenance.ts` 自動編排。

**looplane 可移植性**：高。looplane 已有 checkpoint，但缺「策略分工」——目前只有一種 compaction。最優先補 `shake`（純本地、確定性、零失敗），其次 `branch summary`（tree 導航不失憶）。

### 3. 審批三層 fail-closed（order 4）

`packages/coding-agent/src/tools/approval.ts#resolveApproval` 的「工具宣告 → 使用者覆寫 → 模式門檻」三層，預設 `exec`（fail-closed）。Deny 永遠贏，yolo 仍不跨過 tool/user deny。

**looplane 可移植性**：極高。looplane 的 `permissions.py` 已有 deny/allow，但缺 `policyKey` 動態 tier 與 `CRITICAL_BASH_PATTERNS` 硬編碼底線。補上後，安全性基線立刻提升。

### 4. KDL rule tree（order 7）

`packages/catalog/src/compat/rules/**` 把 60+ providers 的 routing/compat/thinking/quota 分層（taxonomy/classes/providers/runtime），編譯成 `rules.json`，`cascade.ts#resolveCascade` 用 (exactness, dimensions, priority) 解決衝突。TS 不寫任何 `if (provider === "openai")`。

**looplane 可移植性**：中。looplane 的 `provider_catalog.py` 目前是 TS 硬編碼對照表。若要支援 10+ providers，KDL 模式更可維護；若只支援 3–5 個，硬編碼亦可。

### 5. session tree / fork（order 9）

`packages/coding-agent/src/session/session-manager.ts#getTree` + `agent-session.ts#navigateTree`，entry 帶 `id/parentId` 組成 tree，leaf 切換可選 `branch_summary`，fork 複製 JSONL + artifacts。

**looplane 可移植性**：高。looplane 的 event journaling 已有類似基礎，補 `getTree` + `navigateTree` 即可支援 `/tree` 導航。

---

## 過度工程的三件

### 1. snapcompact 純 vision 路線

把歷史渲染成 PNG、讓 vision model 讀，雖然零 LLM 延遲，但依賴「vision model 便宜且可讀 code」的前提。實測 `11on16-bw` vs `8on22-bw` f1 差 0.05，投入產出比不如直接用 `shake` + `branch summary`。

**looplane 建議**：不做。

### 2. metaharness 自製 benchmark 基建

`packages/metaharness` 的 experiment→run→trace + Vibemon microVM + SQLite 存證 + REST dashboard，對比直接用 `promptfoo` / `evals` / `harbor` 等現成工具，自製成本高。

**looplane 建議**：用 `promptfoo` + `evals` 即可，metaharness 僅在需要「硬體隔離 + auth gateway 重寫」時才值得。

### 3. bash token 化的極致正則（order 5）

`CRITICAL_BASH_PATTERNS` 45 條正則 + `hasBashApprovalShellControl` + glob-to-regex，三層疊加。對安全是好事，但正則維護成本高，且 `rm -rf -- /` 這類變體永遠追不完。

**looplane 建議**：保留 `CRITICAL_BASH_PATTERNS` 核心 10–15 條 + `deny` 分段匹配即可，`allow` 整行匹配的極致嚴格可簡化。

---

## 短期不該碰的三件

### 1. 完整 provider catalog 自建（60+）

omp 的 `packages/catalog` 需要持續追蹤 60+ providers 的 model 清單、pricing、context window、thinking ladder，並用 KDL + `bun run gen:compat` 編譯。這需要專人維護。

**looplane 建議**：維持 3–5 個核心 provider（OpenAI/Anthropic/Google/OpenRouter），用硬編碼 `provider_catalog.py`，等使用者真的需要第 6 個才加。

### 2. 完整 TUI 自製（order 11）

omp 的 `packages/tui` differential rendering + `composer` 多模輸入 + vim 模式 + IME + 虛擬清單，約 10k 行。looplane 用 `tui.py` + 現成 `textual` / `ink` 已足夠。

**looplane 建議**：不自建，專注把 `prompt` 組裝與 `approval` 體驗做好。

### 3. 完整 collab wire 協定（order 13）

`packages/wire` 的 AES-256-GCM + 4-byte envelope + snapshot-chunk 分片 + timing-safe token 驗證，對應的是「host 跑 agent、guest 觀測」的非對稱模型，需長期維護 relay 與 guest 權限邊界。

**looplane 建議**：若需多人協作，先用 `tmux` + `code-server` / `VS Code Live Share` 等現成方案，不自建 wire。

---

## 務實的借鏡路線（給 looplane）

**第一階段（1–2 週可完成）**：

1. 補 `AppendOnlyContextManager` 的 longestStablePrefix + digest memo（order 2）
2. 補 `shake` 的機械 placeholder 替換（order 3 的 `DEFAULT_SHAKE_CONFIG`）
3. 補 `CRITICAL_BASH_PATTERNS` 核心 15 條 + `deny` 分段匹配（order 5）
4. 補 `resolveApproval` 的 deny 永遠贏 + `policyKey`（order 4）

**第二階段（1 個月）**：

5. 補 `branch summary` 的 `/tree` 導航（order 9）
6. 補 `KDL` 或簡化版 rule tree（order 7 的最小可用版：taxonomy + providers 兩層）

**不做**：snapcompact、metaharness、完整 TUI、完整 collab。

---

## 學到的事

1. **Borrow, don't rebuild**——omp 的 80k 行 Rust + 60+ providers 是 8 個月 18k commits 的結果，looplane 不應複製規模，而應複製「設計決策背後的為什麼」
2. **Fail-closed 是唯一安全的預設**——未宣告 approval 就是 `exec`、未知的 provider 就是最嚴格 tier，這點兩者皆應遵守
3. **Cache-coherence 是跨模組契約**——`append-only-context.ts` + `message-cache.ts` + `tokenizer.ts` 共享 version 標籤，單一檔案改動必須通知其他模組
4. **策略分工比單一演算法重要**——compaction 不是「一個演算法調參」，而是「四種策略對四種失敗模式」，這比任何單一優化都關鍵

---

## 參考資料

- `packages/agent/src/append-only-context.ts` — longestStablePrefix
- `packages/agent/src/compaction/compaction.ts` / `shake.ts` / `branch-summarization.ts` — 四策略
- `packages/coding-agent/src/tools/approval.ts` — 三層決策
- `packages/coding-agent/src/tools/bash.ts` — token 化審批
- `packages/catalog/src/compat/rules/**` / `cascade.ts` — KDL rule tree
- `packages/coding-agent/src/session/session-manager.ts` — tree/fork
- `packages/coding-agent/src/edit/hashline/execute.ts` — hashline
- `docs/compaction.md` / `docs/approval-mode.md` / `docs/tree.md` — 官方文檔

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 15 篇（總集）。全系列 15 篇完結。*
