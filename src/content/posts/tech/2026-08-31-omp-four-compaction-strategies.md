---
title: "OMP 四種 compaction 策略：context-full / snapcompact / branch summary / shake —— 各解決什麼失敗模式、怎麼切換"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, compaction, context-management, agent-loop, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 3
tldr: "omp 不只有一種 compaction：context-full 走 LLM 摘要、可疊代、失敗對半重切預算；snapcompact 不呼叫 LLM，把歷史壓成 PNG 讓 vision model 讀，解決無 API key / 低延遲 / 視覺模型便宜場景；branch summary 在 `/tree` 切分支時摘要被離開的段落；shake 純機械式把 tool-result 大段文字換成 placeholder，給 summary 太重、prune 不夠的緊急手動場景。四種策略分工明確，由 session maintenance 自動編排或使用者手動觸發。"
description: "深入 omp 四種 compaction 機制的設計分工：context-full（compaction.ts）、snapcompact（snapcompact.ts）、branch summary（branch-summarization.ts）、shake（shake.ts），拆解各自的觸發條件、失敗模式、切換邏輯，以及為什麼需要四種而不是一種。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 3 篇。前兩篇拆了 [agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while) 與 [append-only context](/posts/tech/2026-08-31-omp-append-only-context)，這篇看「對話太長怎麼辦」——四種不同機制的分工。

---

## TL;DR

| 策略 | 核心機制 | 觸發時機 | 解決什麼失敗模式 |
|---|---|---|---|
| **context-full** | LLM 文字摘要、可疊代、planSummaryWindows 分窗、失敗對半重切預算 | 自動：context 佔用超過閾值；手動：`/compact` | 長對話 token 爆炸、需要語意保真摘要 |
| **snapcompact** | 不呼叫 LLM，歷史文字渲染成 PNG 點陣圖，vision model 直接讀 | 自動：context 爆、偏好低延遲/無 API key；手動：`/compact --snap` | 無 API key、視覺模型便宜、要極低延遲 |
| **branch summary** | `/tree` 導航切換 leaf 時，對「被離開的分支」做 LLM 摘要 | 互動：`/tree` 選新 leaf 時 | tree 導航失去離開分支的檔案讀寫脈絡 |
| **shake** | 純機械式：tool-result 文字、fenced/XML 區塊換成 placeholder，保留非文字內容 | 手動：`/shake`；自動：rescue（dead-end 復原） | summary 太重、prune 不夠、緊急需要騰空間 |

---

## 情境

coding agent 跑久了，context 會塞滿。第 50 輪時，使用者問一個簡單問題，但 model 要先吞下 100k token 歷史才能回應。成本爆炸、延遲飆高、甚至超過 context window 直接報錯。

**單一 compaction 策略不夠**，因為失敗模式不一樣：

- 有時要**語意保真**（保留決策脈絡）→ 需要 LLM 摘要
- 有時**完全沒 API key**、或要**極低延遲** → 不能呼叫 LLM
- 有時使用者在 `/tree` 切換分支，**不想丟掉剛離開那段的檔案操作紀錄** → 需要針對性摘要
- 有時 summary 還是太大、prune 也修剪不夠 → 需要**機械式硬切**當急救

omp 的解法：四種策略，各司其職，由 `SessionMaintenance` 自動編排或使用者手動指定。

---

## 策略一：context-full —— LLM 文字摘要（預設 fallback）

**檔案**：`packages/agent/src/compaction/compaction.ts`、`compaction-v2-streaming.ts`

### 核心流程

```typescript
// compaction.ts generateSummary()
async function generateSummary(
  messages: AgentMessage[],
  model: Model,
  apiKey: ApiKey,
  options: SummaryOptions
): Promise<CompactionResult> {
  // 1. 計算可用 token 預算
  // 2. 若訊息太多 → planSummaryWindows 分窗疊代摘要
  // 3. 每窗呼叫 LLM（compactionSummaryPrompt / compactionUpdateSummaryPrompt）
  // 4. 失敗時：對半切預算重試（最多 3 次）
  // 5. 回傳 summary + shortSummary + details(檔案讀寫清單) + preserveData
}
```

### 關鍵設計

| 機制 | 說明 |
|---|---|
| **疊代分窗** (`planSummaryWindows`) | 歷史太長單次塞不進 LLM → 切成多窗，前窗摘要餵給後窗，形成「摘要的摘要」 |
| **預算自適應重試** | LLM 回傳超過 token limit 時，自動對半切 `maxTokens` 重試（最多 3 次） |
| **shortSummary** | 給 UI 顯示的單行摘要，與完整 summary 分離 |
| **details / preserveData** | `details.readFiles`、`details.modifiedFiles` 追蹤檔案操作；`preserveData` 給 provider-native compaction 用（見下） |
| **handoff 文件** (`handoffDocumentPrompt`) | 給 subagent / 新 session 的交接文件，比 summary 更結構化 |

### 兩種實現路徑

1. **標準 compaction**（`compaction.ts`）：自己組 prompt、呼叫 LLM、解析回傳
2. **Compaction v2 streaming**（`compaction-v2-streaming.ts`）：使用 provider 原生 `compaction` API（OpenAI Codex、Anthropic 等支援），更省 token、更快

**觸發**：`SessionMaintenance` 偵測 `tokensBefore > threshold` → 排程 compaction；或使用者手動 `/compact`。

---

## 策略二：snapcompact —— 把對話壓成 PNG，vision model 讀

**檔案**：`packages/snapcompact/src/snapcompact.ts`、`crates/pi-natives/src/snapcompact.rs`

### 核心概念

> 不呼叫 LLM 摘要，而是把歷史文字**渲染成密集點陣圖（PNG）**，塞給 vision model 讀。

```typescript
// snapcompact.ts compact()
export async function compact(
  messages: AgentMessage[],
  model: Model,
  options: SnapcompactOptions
): Promise<SnapcompactResult> {
  // 1. 選 shape（根據 provider：Anthropic 11on16-bw / Google 8on22-bw / OpenAI 8on22-bw）
  // 2. serializeConversationForSummary() → 純文字
  // 3. renderMany() → 多張 PNG frames（native code：crates/pi-natives）
  // 4. 組成 ImageContent 陣列，回傳 preserveData
  // 5. 下一輪 context rebuild 時，把 frames 附在 compaction summary message 上
}
```

### Shape 為什麼要 per-provider 不同？

| Provider | Shape | 原因 |
|---|---|---|
| **Anthropic** | `11on16-bw` | Opus 4.7+ 原生高解析度（2576px edge、4784 visual-token cap），tracking 讓 code 行號可讀 |
| **Google** | `8on22-bw` @2048 | Gemini 3.x 固定 `media_resolution` budget（1120 tokens/圖），22px leading 讓字更清楚 |
| **OpenAI** | `8on22-bw` | Patch billing (32px × 1.2)，解析度不改善 chars/$，1568px 足夠 |
| **Unknown** | `8on22-bw` | 保守預設 |

這些 shape 來自 **實測 benchmark**（`research/toolbench.py`、真實 search/read/find output + 結構 QA），不是理論推導。

### 為什麼存在？

- **完全本地、零 API key、零 LLM 延遲**——渲染 PNG 只花幾十 ms
- **Vision model 讀圖比 LLM 讀文字便宜**（某些 provider 視覺 token 更便宜）
- **適合「無網路 / 離線 / edge」場景**

**觸發**：使用者偏好 `snapcompact` 模式、或自動 fallback（context-full 失敗時）。

---

## 策略三：branch summary —— `/tree` 導航時的針對性摘要

**檔案**：`packages/agent/src/compaction/branch-summarization.ts`

### 核心流程

```typescript
// branch-summarization.ts collectEntriesForBranchSummary()
export function collectEntriesForBranchSummary(
  session: ReadonlySessionManager,
  oldLeafId: string | null,
  targetId: string
): CollectEntriesResult {
  // 1. 找 common ancestor（兩條 path 的最深共同祖先）
  // 2. 從 oldLeaf 走回 common ancestor，收集中間所有 entries
  // 3. 不停在 compaction boundary——那些 summary 變成新 context 的一部分
}
```

```typescript
// generateBranchSummary()
export async function generateBranchSummary(
  preparation: BranchPreparation,
  options: GenerateBranchSummaryOptions
): Promise<BranchSummaryResult> {
  // 用 branchSummaryPrompt + branchSummaryPreamble 呼叫 LLM
  // 回傳 summary + readFiles + modifiedFiles
}
```

### 為什麼需要？

使用者在 `/tree` 裡從分支 A 切到分支 B。**分支 A 上的檔案讀寫、工具呼叫、決策脈絡**，如果不摘要就直接丟掉，切回去時 agent 會「失憶」——不知道剛剛在分支 A 做了什麼、改了哪些檔。

**BranchSummaryEntry**（`entries.ts`）存：
- `summary`：LLM 生成的摘要
- `details.readFiles` / `details.modifiedFiles`：檔案操作清單
- `fromId`：摘要來源的起始 entry

下次切回這個 leaf 時，這個 summary 會被注入 context，agent 知道「喔，我在這分支改過 `foo.ts`、讀過 `bar.ts`」。

### 與 context-full 的差別

| | context-full | branch summary |
|---|---|---|
| **範圍** | 整條主線歷史 | **單一分支段落**（old leaf → common ancestor） |
| **觸發** | 自動/手動，基於 token 佔用 | 互動式，`/tree` 導航時 |
| **目的** | 壓縮主線、騰空間 | **保留分支脈絡**、不丟檔案清單 |

---

## 策略四：shake —— 純機械式硬切（急救用）

**檔案**：`packages/agent/src/compaction/shake.ts`

### 核心機制

```typescript
// shake.ts collectShakeRegions()
export function collectShakeRegions(
  entries: SessionEntry[],
  config: ShakeConfig,
  tokenizer: Tokenizer
): ShakeRegion[] {
  // 1. 保護最近 protectTokens（預設 16k，手動 aggressive 4k，rescue 0）
  // 2. 掃描 tool-result：文字內容 > fenceMinTokens 且不在 protectedTools → 標記可 shake
  // 3. 掃描 fenced code block / top-level XML → 標記可 shake
  // 4. 計算 tokens savings，未達 minSavings → 不執行
}
```

```typescript
// 實際 shake：把原文換成 placeholder
// "```rust\n...500 lines...\n```" → "[shaken: 500 lines of rust code]"
// toolResult 長文字 → "[shaken: bash output, 12000 tokens]"
```

### 三種配置

| Config | protectTokens | minSavings | protectedTools | 用途 |
|---|---|---|---|---|
| `DEFAULT_SHAKE_CONFIG` | 16,000 | 4,000 | skill, artifact recovery | **自動 shake**（session maintenance） |
| `AGGRESSIVE_SHAKE_CONFIG` | 4,000 | 0 | skill | **手動 `/shake`**——使用者要最大騰空間 |
| `RESCUE_SHAKE_CONFIG` | 0 | 0 | skill + artifact recovery | **Dead-end 復原**——連最新的 oversized result 也能切 |

### 為什麼不直接用 compaction？

- **Compaction 要呼叫 LLM**，有延遲、有成本、可能失敗
- **Shake 完全本地、確定性、零失敗**——只是把大段文字換成短 placeholder
- **保留非文字內容**（images、structured data），不像 compaction 可能摘要掉關鍵資訊
- **不改變 session 結構**——entry 還在、parent chain 還在，只是 content 變短

**觸發**：
- 自動：`SessionMaintenance` 偵測 context 過大、且 compaction 不適合/失敗時
- 手動：使用者 `/shake`（aggressive）
- 緊急：`RESCUE` 模式（agent 卡在 oversized tool result 無法繼續）

---

## 四種策略的分工與切換邏輯

### SessionMaintenance 自動編排（`session-maintenance.ts`）

```typescript
// 簡化版邏輯
async function maybeCompact(session: AgentSession): Promise<void> {
  const usage = estimateContextUsage(session);
  
  if (usage > COMPACTION_THRESHOLD) {
    // 1. 優先嘗試 provider-native compaction v2（最快、最省）
    if (shouldUseCompactionV2Streaming(model)) {
      await requestCompactionV2Streaming(...);
      return;
    }
    // 2. 嘗試 OpenAI remote compaction
    if (shouldUseOpenAiRemoteCompaction(model)) {
      await requestOpenAiRemoteCompaction(...);
      return;
    }
    // 3. Fallback：context-full（標準 LLM 摘要）
    await compactContext(session, model, apiKey);
    return;
  }
  
  // Shake：context 仍大但未達 compaction 門檻，或 compaction 失敗
  if (usage > SHAKE_THRESHOLD) {
    await shakeSession(session, DEFAULT_SHAKE_CONFIG);
  }
}
```

### 手動指令對應

| 指令 | 策略 | 配置 |
|---|---|---|
| `/compact` | context-full | 標準 |
| `/compact --snap` | snapcompact | vision model |
| `/compact --v2` | compaction v2 streaming | provider-native |
| `/shake` | shake | `AGGRESSIVE_SHAKE_CONFIG` |
| `/tree` 切換 | branch summary | 自動 |

### 失敗模式對照表

| 失敗模式 | 先試 | 失敗再試 | 最後手段 |
|---|---|---|---|
| Token 爆炸、要語意保真 | context-full (v2) | snapcompact | shake (aggressive) |
| 無 API key / 離線 | snapcompact | — | shake |
| `/tree` 切分支丟脈絡 | branch summary | — | — |
| Compaction 失敗/太慢 | shake (auto) | snapcompact | — |
| Dead-end（oversized result 卡住） | shake (rescue) | — | — |

---

## 學到的事

1. **Compaction 不是單一演算法**——不同失敗模式需要不同工具：語意保真要 LLM、極速/離線要 vision、分支導航要針對性摘要、急救要機械硬切
2. **Provider-native compaction（v2）優先**——OpenAI Codex、Anthropic 等原生 API 更省 token、更快、更穩，omp 設計成優先用、fallback 到自己實作
3. **Snapcompact 的 shape 是 benchmark 出來的**——不是拍腳趴決定，`11on16-bw` vs `8on22-bw` 差在 f1 score .806 vs .755，真金白銀測出來的
4. **Branch summary 解決「tree 導航失憶」**——這是 coding agent 特有的 UX 問題，一般 chatbot 沒有 session tree 就不需要
5. **Shake 是「急救包」，不是日常飯**——自動 shake 保守（protect 16k）、手動 aggressive、rescue 連最新都能切，三種配置精確對應三種情境

---

## 參考資料

- `packages/agent/src/compaction/compaction.ts` — `generateSummary`、`planSummaryWindows`、handoff document
- `packages/agent/src/compaction/compaction-v2-streaming.ts` — `requestCompactionV2Streaming`、`shouldUseCompactionV2Streaming`
- `packages/snapcompact/src/snapcompact.ts` — `compact`、`renderMany`、`SHAPE_VARIANTS`、provider-aware frame shapes
- `packages/agent/src/compaction/branch-summarization.ts` — `collectEntriesForBranchSummary`、`generateBranchSummary`
- `packages/agent/src/compaction/shake.ts` — `collectShakeRegions`、三種 `ShakeConfig`、placeholder 替換邏輯
- `packages/agent/src/compaction/utils.ts` — `serializeConversationForSummary`、`extractFileOpsFromMessage`
- `packages/coding-agent/src/session/session-maintenance.ts` — 自動 compaction/shake 編排
- `docs/compaction.md` — 官方文檔總覽

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 3 篇。上一篇：[append-only context](/posts/tech/2026-08-31-omp-append-only-context)。下一篇：審批三層與 fail-closed（待發布）*