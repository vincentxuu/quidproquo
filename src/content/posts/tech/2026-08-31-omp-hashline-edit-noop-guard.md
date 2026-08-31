---
title: "OMP hashline edit 與 noop-loop-guard：為什麼檔案編輯要 hash-anchored？模型 byte-identical 無操作重試 182/205 次怎麼被降伏的"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, hashline, edit-tool, noop-loop-guard, coding-agent, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 6
tldr: "OMP 用 hashline 格式取代傳統 line-number patch：以 4-hex content hash + N* syntactic block locator 定位，消除 whitespace drift；noop-loop-guard 在同一 session、同一 canonical path、同一 input hash 連續 3 次 no-op 時直接拋 ToolError，打破模型「以為 anchor 錯、把 payload 變大再試」的 182/205 次重試死循環（issue #2081）。"
description: "深入 hashline 格式設計、Patcher.prepare/commit 雙階段、block-resolver 的 tree-sitter syntactic block 定位、noop-loop-guard 的 per-session 計數器與硬限制（NOOP_HARD_LIMIT=3），以及為什麼這組合比傳統 unified-diff + line-number 更能應付模型的重試行為。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 6 篇。前五篇分別拆了 [agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while)、[append-only context](/posts/tech/2026-08-31-omp-append-only-context)、[四種 compaction 策略](/posts/tech/2026-08-31-omp-four-compaction-strategies)、[三層 approval](/posts/tech/2026-08-31-omp-approval-three-layers)、[bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval)，這篇看檔案編輯子系統。

---

## TL;DR

- **hashline 格式**：`[path#HASH]` header + `PUT N*:` / `CUT N*` / `PUT >N*:` 等 block-level ops。**定位錨點是 content hash + syntactic block（`N*`），不是 line number**。消除 whitespace drift、line-number 漂移、merge conflict 重編後的行號失效。
- **`executeHashlineSingle`** (`execute.ts#executeHashlineSingle`)：`Patcher.prepare`（唯讀解析、預先失敗）→ `Patcher.commit`（真正寫入）。Multi-section 先全 prepare 再逐個 commit，單 section fast path 合併兩步。
- **block-resolver** (`block-resolver.ts#nativeBlockResolver`)：tree-sitter 解析語言、回傳 `N` 行開頭的 syntactic block 實際 `start–end` line span。同內容同行號 = 同 span，**deterministic、可 memo**。
- **noop-loop-guard** (`noop-loop-guard.ts`)：per-session、per-canonical-path、per-input-hash 計數器。連續 **3 次**（`NOOP_HARD_LIMIT`）byte-identical no-op → 拋 `ToolError`，讓 agent loop 看到 **tool failure** 而非 soft text hint。
- **issue #2081 實測**：同一 payload 在同一檔案連續 205 次呼叫，其中 182 次是 byte-identical no-op。soft hint（"re-read the file"）完全無效，hard limit 才斷循環。

---

## 情境

你在寫 coding agent 的 edit tool。模型要改 `src/foo.ts` 第 42 行，傳給你一個 patch。

**傳統 unified diff / line-number 方案的痛點**：

1. **Line number drift**：模型讀到的檔案是舊版本（或是同事剛改過）、行號對不上 → patch apply 失敗或誤改錯處
2. **Whitespace 戰爭**：`tabs vs spaces`、trailing newline、CRLF/LF、auto-formatter 跑過 → 同樣語意內容 byte-level 不同 → patch reject
3. **Anchor 模糊**：模型常寫「在第 40 行附近插入」→ 實際 apply 時要猜是 39、40、還是 41
4. **Multi-file atomicity**：一個 patch 改三個檔，第二個失敗時第一個已落盤 → 狀態不一致

hashline 的解法：**不信 line number，信 content hash + syntactic structure**。

---

## 問題

### 1. 怎麼定位「要改哪裡」而不靠行號？

Unified diff 用 `@@ -42,7 +42,7 @@` 定位。但：

- 檔案被 formatter 跑過 → 行號全亂
- 模型讀到的 snapshot 是 5 分鐘前的版本 → 行號已過期
- 同一邏輯 block（如一個 function）在不同版本可能跨 20 行或 30 行

### 2. 模型遇到 no-op 時的行為模式

當 patch parse 成功、apply 也成功，**但 body rows 與檔案目標行 byte-identical**（完全沒變）：

- 模型收到 "parsed and applied cleanly, but produced no change"
- 模型**誤以為** anchor 錯誤 → **把 payload 變大、加更多 context 行、或換個 anchor 再試**
- 實際上檔案**已經是目標狀態**，或是 anchor 根本錯在別處（如 off-by-one）
- 這導致 **無限重試同樣的 bytes**，直到使用者手動中止

issue #2081 記錄：同一檔案、同一 payload，**205 次呼叫中 182 次是 byte-identical no-op**。Soft hint 完全沒用。

---

## 嘗試過程（從註解與 git history 可見）

### hashline 格式演進

早期 OMP（Pi 時代）用 `apply_patch` 格式（類 unified diff）。遷移到 hashline 的關鍵 commits：

1. **引入 content hash tag**：`[path#HASH]` header，`HASH` = 整檔 normalized text 的 4-hex fingerprint（`format.ts#computeFileHash`）。讀檔時回傳 tag，edit 時帶上 tag → **樂觀鎖**，檔案被外部改過直接 reject
2. **Block locator `N*`**：`PUT 42*:` 表示「以第 42 行開頭的 syntactic block 整個替換」。`block-resolver.ts#nativeBlockResolver` 用 tree-sitter 解析、回傳實際 `start–end`。同一檔案同一版本同一行 = 同一 span，**deterministic**
3. **Gap locator `<N` / `>N`**：`PUT >42:` 在第 42 行**之後**插入。不需知道 block 結構，只靠行號定位 gap
4. **Register / clipboard**：`CUT 10.15 @foo` → `PUT >20 @foo` 跨檔移動程式碼片段

### noop-loop-guard 演進

`noop-loop-guard.ts` 註解（line 6–14）直白記錄：

> A hashline patch can apply cleanly yet produce no change when the body rows are already byte-identical to the targeted lines. [...] in the wild some models ignore the hint and keep re-issuing the same bytes (issue #2081 captured 182 such repeats in 205 calls before the user aborted).

演進步驟：

1. **Soft hint only**（早期）：no-op 回傳文字訊息 "re-read the file before issuing another edit"。模型無視。
2. **Per-session guard + input hash**：`recordNoopEdit(session, canonicalPath, inputHash)`。`inputHash = Bun.hash(rawPatchInput).toString(16)`（`noop-loop-guard.ts#hashPatchInput`）。**同一 payload = 同一 hash**，不同 payload（哪怕只加一個空格）= 新 hash → 重置計數、給新機會。
3. **Hard limit = 3**（`NOOP_HARD_LIMIT`）：連續 3 次同一 hash no-op → `escalate: true` → `executeHashlineSingle` 拋 `ToolError`（`execute.ts:239` / `execute.ts:282`）。Agent loop 看到 **tool failure**，被迫換策略（通常是重新 `read`）。

---

## 解法：hashline + noop-loop-guard 組合拳

### 1. Hashline 格式一覽

```
[src/foo.ts#1A2B]
PUT 42*:
+export function foo() {
+  return 42;
+}
PUT >50:
+// new helper
+export function bar() { return 1; }
CUT 60.65 @moved
```

- `[path#HASH]`：樂觀鎖。`HASH` = `xxHash32(normalizedText) & 0xffff` 取 4 hex（`format.ts#computeFileHash`）
- `PUT 42*:`：block replacement。`42*` = syntactic block 起始行。`block-resolver` 解析出實際 span（如 42–55）
- `PUT >50:`：gap insert after line 50
- `CUT 60.65 @moved`：切走 60–65 行存入 named register `@moved`
- Body rows：`+new line` 字面插入。`-old line` 只有在 unified-diff contamination 時才會出現、會被 parser 拒絕或轉換

### 2. `executeHashlineSingle` 流程圖

```typescript
// execute.ts#executeHashlineSingle
async function executeHashlineSingle(options) {
  // 1. Parse patch sections
  const patch = Patch.parse(input, { cwd: session.cwd });
  
  // 2. Build filesystem + patcher
  const fs = new HashlineFilesystem({...});
  const patcher = new Patcher({ fs, snapshots, blockResolver: nativeBlockResolver, ... });
  
  // 3. Single-section fast path
  if (patch.sections.length === 1) {
    const prepared = await patcher.prepare(patch.sections[0], clipboard); // 唯讀、預先失敗
    const result = await patcher.commit(prepared); // 真正寫入
    
    if (result.op === "noop") {
      const { count, escalate } = recordNoopEdit(session, result.canonicalPath, inputHash);
      if (escalate) throw new ToolError(noChangeLoopDiagnostic(...)); // HARD LIMIT
      return renderSection(result, ...); // soft hint
    }
    resetNoopEdit(session, result.canonicalPath); // 成功 commit → 重置計數
    return renderSection(result, ...);
  }
  
  // 4. Multi-section: prepare ALL first (fail fast), then commit sequentially
  const prepared = await Promise.all(patch.sections.map(s => patcher.prepare(s, clipboard)));
  assertUniqueCanonicalPaths(prepared); // 同檔不准拆兩 section
  
  for (const [i, entry] of prepared.entries()) {
    if (entry.isNoop) { /* record + throw ToolError */ }
    const result = await patcher.commit(entry);
    if (result.op === "noop") { /* record + throw ToolError */ }
    resetNoopEdit(session, result.canonicalPath);
    // ...
  }
}
```

**關鍵設計**：

- **Prepare / Commit 分離**：`prepare` 階段只讀檔、解析 block、驗證 anchor、算好所有 edits、**不動盤**。任何一個 section anchor 失敗、block 無法解析、hash mismatch → 整個 patch reject，**零落盤**。
- **Multi-section atomic-ish**：先全 prepare，再按序 commit。中間失敗前面已落盤（non-atomic），但 clipboard 狀態會按落盤 prefix 同步（`sectionStates[i]` fork → `commitClipboard`），所以 `CUT` 後的 `PUT @reg` 不會丟資料。
- **LSP batch flush 只在最後一個 section**：減少 diagnostic round-trip。

### 3. Block Resolver：Tree-sitter 給 deterministic span

```typescript
// block-resolver.ts#nativeBlockResolver
export const nativeBlockResolver: BlockResolver = ({ path, text, line }) => {
  const key = `${Bun.hash(text).toString(36)}:${text.length}:${line}:${path}`;
  const cached = resolutionCache.get(key);
  if (cached !== undefined) return cached;
  
  const range = blockRangeAt({ code: text, path, line }); // pi-natives: tree-sitter
  const result = range ? { start: range.startLine, end: range.endLine } : null;
  
  // FIFO-bounded memo (512 entries)
  if (resolutionCache.size >= 512) resolutionCache.delete(resolutionCache.keys().next().value);
  resolutionCache.set(key, result);
  return result;
};
```

- **Input**：`path`（推語言）、`text`（檔案全文）、`line`（anchor 行號，1-indexed）
- **Output**：`{ start, end }` 或 `null`（不支援語言、語法錯誤、行號越界、該行不是 block opener）
- **Memo key**：`hash(text) + length + line + path`。**同內容同行 = 同 span**，streaming preview 重複解析同樣內容時極快
- **語言支援**：TypeScript、Python、Rust、Go、JS/JSX、TSX、JSON、Markdown 等 tree-sitter 有 grammar 的語言

**為什麼不用 LSP `documentSymbol`？** Tree-sitter 同步、本地、零 RPC latency、不需 language server 啟動。LSP 用於 diagnostics，block resolution 用 tree-sitter。

### 4. Noop Loop Guard：從 soft hint 到 hard error

```typescript
// noop-loop-guard.ts#recordNoopEdit
export function recordNoopEdit(session, canonicalPath, inputHash): NoopRecordResult {
  const guard = getNoopLoopGuard(session); // lazy init on session
  const prev = guard.entries.get(canonicalPath);
  const count = prev && prev.hash === inputHash ? prev.count + 1 : 1;
  guard.entries.set(canonicalPath, { hash: inputHash, count });
  return { count, escalate: count >= NOOP_HARD_LIMIT }; // NOOP_HARD_LIMIT = 3
}

export function resetNoopEdit(session, canonicalPath): void {
  const guard = session.noopLoopGuard;
  if (!guard) return;
  guard.entries.delete(canonicalPath);
}
```

**狀態機**：

| 狀態 | 觸發 | 動作 |
|------|------|------|
| 首次 no-op | `count=1`, `escalate=false` | 回傳 soft hint 文字 |
| 第 2 次同 hash no-op | `count=2`, `escalate=false` | 回傳 soft hint 文字 |
| **第 3 次同 hash no-op** | `count=3`, `escalate=true` | **拋 `ToolError`**，agent loop 看到 failure |
| 非 no-op commit | `resetNoopEdit` | 刪除 entry，下次 no-op 從 1 開始 |
| 不同 hash no-op | `prev.hash !== inputHash` | `count=1` 重新開始（視為模型有進步） |

**為什麼 key 是 `inputHash` 而非 file content hash？**

> `inputHash` is intentionally derived from the raw model-authored bytes rather than from file content: when the model emits a different payload (even whitespace-only) that's progress and earns a fresh soft hint, but re-issuing the same bytes after being warned is what we want to break. (`noop-loop-guard.ts:66-69`)

模型若**修改了 payload**（哪怕只是加一個空格、換個 indent），視為「有嘗試修正」→ 給新機會。只有**完全重發同樣 bytes** 才累積計數。

### 5. 實測數據：issue #2081

```
同一檔案、同一 payload、同一 session：
- 總呼叫：205 次
- byte-identical no-op：182 次
- 有實際變更：0 次
- 使用者最終手動中止

加上 noop-loop-guard (NOOP_HARD_LIMIT=3) 後：
- 第 1 次 no-op → soft hint
- 第 2 次 no-op → soft hint  
- 第 3 次 no-op → ToolError ("STOP. Edits to foo.ts have been a byte-identical no-op 3 times in a row...")
- Agent loop 收到 tool failure → 強迫模型 re-read 或換策略
```

---

## 為什麼會這樣：設計決策的權衡

### 為什麼 `NOOP_HARD_LIMIT = 3` 這麼小？

註解（`noop-loop-guard.ts:34-40`）：

> Picked deliberately small so the soft hint still fires once or twice before we escalate — the model deserves a chance to recover, but a tight bound is what actually breaks loops in practice.

- 1 次太嚴格：誤判正常「第一次沒改到、第二次調整 anchor」的情況
- 太大（如 10）：issue #2081 證明模型可以重試 182 次不改
- **3 是經驗值**：給 2 次緩衝，第 3 次硬停。實測足以打斷絕大多數循環。

### 為什麼用 `ToolError` 而非繼續回傳文字？

`execute.ts:74-79` 註解：

> Thrown as a ToolError so the agent loop sees a tool *failure* — empirically far more effective at breaking a no-op edit loop than the soft hint alone.

Agent loop 對 `ToolError` 的處理：記錄 failure、往上拋、可能觸發 retry policy、或讓模型看到 "tool failed" 而非 "tool succeeded but no change"。後者會誤導模型以為「工具沒bug、是我 payload 不夠大」。

### 為什麼 per-session、per-canonical-path、per-input-hash 三級隔離？

- **Per-session**：不同 agent run（不同使用者對話）互不干擾
- **Per-canonical-path**：改 `a.ts` 卡住不該影響 `b.ts` 的計數（測試 `does not accumulate across distinct canonical paths` 驗證）
- **Per-input-hash**：模型改了 payload = 進步 = 重置計數。只有「死磕同樣 bytes」才算數

### Hashline 如何避免 whitespace 戰爭？

1. **Header hash tag**：`[path#HASH]` 強制模型基於**確切內容**編輯。外部 formatter 跑過 → hash 變 → 下次 edit 直接 mismatch → 強迫 re-read
2. **Block locator `N*`**：定位 syntactic block（function、class、if statement），**不計算行內縮排、空行、comment**。同一邏輯 block 在 formatted/unformatted 版本 span 不同，但 `N*` 都能正確解析
3. **Body rows 只比對 `+TEXT`**：parser 只看 `+` 開頭的行，忽略縮排差異、trailing space。`apply` 時用 exact byte comparison 判定 no-op
4. **Normalized file hash**：`computeFileHash` 先 `normalizeFileHashText` 移除每行 trailing `[ \t\r]`（`format.ts:108-110`），所以 CRLF/LF、trailing space 不會讓 tag 失效

---

## 學到的事

1. **定位錨點要綁內容結構，別綁行號**。`N*` + content hash 同時解決「檔案被改過」、「formatter 跑過」、「模型讀舊版本」三大痛點。
2. **Prepare/Commit 分離是編輯工具的基本衛生**。任何 patch 格式都應該先「全讀、全驗、全算好 edits」、確定零衝突才落盤。OMP 的 `Patcher.prepare` / `commit` 是這原則的教科書級實作。
3. **模型不看 soft hint**。issue #2081 是鐵證：182/205 次重試完全無視「re-read the file」。**必須把 no-op 升級為 tool failure**，agent loop 才會換策略。
4. **Hard limit 要小、要精準**。`NOOP_HARD_LIMIT=3` 看起來激進，但「給機會」在這裡是害人的——模型越試越偏、payload 越來越大、context 越來越貴。
5. **Input hash 是「模型意圖」的指紋**。用 raw patch bytes 算 hash，而非 file content hash，精準捕捉「模型在重複同樣錯誤」vs「模型在嘗試新 payload」。
6. **Tree-sitter block resolution 比 LSP 更適合編輯定位**。同步、本地、deterministic、可 memo。LSP 留給 diagnostics。
7. **測試要覆蓋跨 session、跨 path、跨 hash 的隔離性**。`hashline-loop-guard.test.ts` 的 5 個測試案例（soft hint 遞增、hard escalate、跨 path 隔離、成功 commit 重置、跨 session 隔離）把 guard 的狀態機完整驗證。

---

## 參考資料

- `packages/coding-agent/src/edit/hashline/execute.ts` — `executeHashlineSingle`（203–292）、`noChangeDiagnostic`（58–71）、`noChangeLoopDiagnostic`（81–89）、`renderSection`（148–201）
- `packages/coding-agent/src/edit/hashline/noop-loop-guard.ts` — `recordNoopEdit`（71–81）、`resetNoopEdit`（87–91）、`hashPatchInput`（97–98）、`NOOP_HARD_LIMIT`（40）
- `packages/coding-agent/src/edit/hashline/block-resolver.ts` — `nativeBlockResolver`（21–32）
- `packages/coding-agent/src/edit/hashline/format.ts` — `computeFileHash`（117–121）、`formatHashlineHeader`（133–135）、`HL_BLOCK_SUFFIX`（30–31）
- `packages/hashline/src/parser.ts` — `Executor` 狀態機、block op lowering（683–699）
- `packages/hashline/src/types.ts` — `BlockResolution`（175–184）、`BlockResolver`（201）
- `packages/coding-agent/test/core/hashline-loop-guard.test.ts` — 5 條守衛行為測試
- Issue #2081 — 182/205 byte-identical no-op 實測記錄

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 6 篇。上一篇：[bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval)。下一篇：待定。*