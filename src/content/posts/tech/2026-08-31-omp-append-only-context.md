---
title: "OMP append-only context：為什麼 sync 對話要算 byte-stable prefix？Anthropic/DeepSeek 的 KV cache 怎麼被它保護的"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, context-management, prompt-cache, kv-cache, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 2
tldr: "omp 用 StablePrefix 凍結 system prompt + tool specs，用 AppendOnlyLog 讓 messages 只增不改，配合 digest-based 的 longestStablePrefix 算法，在 prune/shake/steering 重寫歷史時，只重送 divergence point 之後的尾巴。這讓 Anthropic/DeepSeek 的 prompt cache 命中率最大化，解決了舊版每輪強制 ~40k token re-prefill 的問題（issue #3406）。"
description: "深入 append-only-context.ts 的 StablePrefix、AppendOnlyLog、syncMessages 三機制，拆解 fingerprint、digest、WeakMap memo 與 estimate version 的 cache-coherence 契約，以及為什麼這樣切比單純 append 更難但更省錢。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 2 篇。上一篇拆了 [agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while)，這篇看 context 怎麼在每輪 model call 之間保持「最長不變的字節前綴」。

---

## TL;DR

- **StablePrefix**（line 49–91）：system prompt + tool specs 計算一次、fingerprint 匹配才重算；MCP reconnect 等才 `invalidate()`
- **AppendOnlyLog**（line 103–146）：messages 只能 `append`/`extend`/`replaceTail(compaction)`/`truncate`；不重新序列化舊輪
- **syncMessages**（line 226–256）：三種情況——正常 append、compaction 清空重放、in-place rewrite 找 **最長 byte-stable prefix** 截斷再 append
- **#messageDigest + #digestMemo**（line 306–334）：決定性 digest 涵蓋 role/content/toolCalls 等所有 provider 會序列化的欄位；WeakMap key 為 message 物件身份，value 含 `estimate version`，in-place 修改必須配合 `invalidateMessageCache` bump version
- **為什麼要這麼麻煩**：舊版任何 prune/shake/strip-images 都 `log.clear()`，導致 llama.cpp/local backend 每輪強制 ~40k token re-prefill（issue #3406）；現在只重送 divergence point 之後，provider KV cache 保持溫暖

---

## 情境

你在跑一個長對話的 coding agent。第 10 輪時，使用者問了一個問題，model 回了 2000 token。第 11 輪，使用者追問一句話。

**如果你每輪都把完整對話重新序列化送給 provider**：第 11 輪送 12000 token，其中 10000 token 是第 1–10 輪完全一樣的歷史。Anthropic 的 prompt cache（或 DeepSeek 的 KV cache）本來可以命中那 10000 token，但如果你的序列化哪怕有一個空格不同、一個欄位順序不同、一個 tool call id 重新生成——**cache 就 miss 了**，重新 prefill 10000 token，多花錢、多延遲。

omp 遇到的真實問題（issue #3406）：任何 prune pass、shake pass、strip-images、steering re-wrap 只要改一條歷史訊息，舊代碼就 `log.clear()`，下一輪整個對話重送。在 llama.cpp 這種 local backend 上，**每輪強制 ~40k token re-prefill**。

---

## 問題

單純 `append-only` 不夠，因為現實世界有三種「非純增」操作：

1. **Compaction**：舊歷史被摘要取代，message 陣列變短
2. **Per-turn pruning / transformContext re-render / strip-images**：同一條 message 物件被 **in-place 修改**（content 縮減、image 移除、XML 標籤注入）
3. **Steering / aside 注入**：新訊息插在中間，導致後續訊息位移

如果這些操作都觸發「整個 log 重送」，prompt cache 就失效。但如果完全不處理，log 會和實際送給 provider 的 messages 脫節。

**核心挑戰**：在「log 必須反映最新狀態」與「盡量保留 byte-stable prefix 讓 cache 命中」之間找平衡。

---

## 嘗試過程（從註解與 git history 可見）

`append-only-context.ts` 註解（line 219–224）直白記錄了演進：

> Earlier revisions cleared the whole log on any digest change, which on llama.cpp / local backends forced a full ~40k-token re-prefill every turn that an extension, prune pass, or steering re-wrap rewrote a single message (#3406).

舊版：任何 digest 變化 → `log.clear()` → 全部重送。

新版：找 **最長 byte-stable prefix**（`#longestStablePrefix`），只截斷到 divergence point，重送尾巴。

這演進中關鍵的子問題：

- **怎麼定義「byte-stable」？** 不能只比對高層欄位，provider 序列化時可能包含內部欄位（`providerPayload`、`tool_calls` snake_case 等），全部要進 digest
- **in-place 修改怎麼被偵測？** message 物件身份不變，但內容變了 → WeakMap memo 必須有 version 機制
- **compaction 怎麼處理？** 陣列變短 → 無法保留任何 prefix，只能 `clear()` 重放
- **MCP reconnect / model switch 怎麼處理？** prefix fingerprint 變了 → `invalidateForModelChange()` 清 prefix + log

---

## 解法：三層機制疊加

### 1. StablePrefix：凍結「不變的前綴」

```typescript
// line 67-75
build(context, options): boolean {
  const snapshot = takeSnapshot(context, options);
  if (this.#snapshot && this.#snapshot.fingerprint === snapshot.fingerprint) {
    return false; // cache hit
  }
  this.#snapshot = snapshot;
  this.#version++;
  return true; // cache miss，prefix 真正變了
}
```

- `takeSnapshot`：把 `systemPrompt` 陣列 + `normalizeTools` 後的 tool specs + `intentTracing`/`pruneToolDescriptions` 選項，全部 `JSON.stringify` 算 fingerprint（line 355–373）
- fingerprint 相同 → 直接回傳快照，**完全不重新序列化 system prompt 和 tool specs**
- 只有 `invalidate()`（MCP reconnect）或 fingerprint 真變（tool 新增/移除、system prompt 修改）才重算

**效果**：system prompt + tool specs 佔的 token 數（通常幾千 token）在整個 session 內**完全不變**，provider 的 prefix cache 直接命中。

### 2. AppendOnlyLog：只增不改的訊息日誌

```typescript
// line 110-141
append(message) { this.#entries.push(message); }
extend(messages) { ... }
replaceTail(replacement) { this.#entries[this.#entries.length - 1] = replacement; } // compaction 專用
truncate(count) { this.#entries.length = count; } // 截斷到 stable prefix
```

- 只有四種操作：`append`、`extend`、`replaceTail`（compaction 取代最後一條）、`truncate`（捨棄 divergence 後的尾巴）
- **不提供** `splice`、`delete`、`modify`——任何修改都透過 `syncMessages` 協調

### 3. syncMessages：三種情況的精確分流

```typescript
// line 226-256
syncMessages(normalizedMessages) {
  // 1. Compaction：陣列變短 → 全部重來
  if (normalizedMessages.length < this.#lastSyncCount) {
    this.log.clear(); this.#lastSyncCount = 0; this.#messageDigests = [];
    return;
  }

  // 2. In-place rewrite：找最長 byte-stable prefix
  if (this.#lastSyncCount > 0) {
    const stableCount = Math.min(this.#longestStablePrefix(normalizedMessages), this.log.length);
    if (stableCount < this.#lastSyncCount) {
      this.log.truncate(stableCount);
      this.#lastSyncCount = stableCount;
      this.#messageDigests.length = stableCount;
    }
  }

  // 3. 正常 append：把 divergence 後的尾巴接上去
  for (let i = this.#lastSyncCount; i < normalizedMessages.length; i++) {
    this.log.append(normalizedMessages[i]);
    this.#messageDigests.push(this.#messageDigest(normalizedMessages[i]));
  }
  this.#lastSyncCount = normalizedMessages.length;
}
```

**關鍵細節**：

- `normalizedMessages` 是 **provider-level**（已經過 `convertToLlm`），不是 session-level 的 `AgentMessage`
- `#lastSyncCount` 記錄「上次同步了幾條 normalized message」
- `#messageDigests` 陣列與 log 一一對應，存每條 message 的 digest
- **Compaction 情況**（line 229–233）：陣列變短意味著舊訊息被摘要取代，**完全無法對齊**，只能清空重放
- **In-place rewrite 情況**（line 235–247）：用 `#longestStablePrefix` 找「之前同步的 log」與「新 normalizedMessages」共享的最長前綴長度，`truncate` 到那裡，然後把 divergence 後的新 bytes append 進去
- **正常 append 情況**（line 249–255）：`#lastSyncCount` 之後的都是新訊息，直接 append

---

## 為什麼會這樣：Digest 與 Memo 的 Cache-Coherence 契約

### #messageDigest：決定性、全欄位、provider-aware

```typescript
// line 311-334
#messageDigest(msg) {
  const payload = JSON.stringify({
    r: m.role ?? null,
    c: m.content ?? null,
    pp: m.providerPayload ?? null,
    tc: m.toolCalls ?? m.tool_calls ?? null,  // 同時支援 camelCase 和 snake_case
    tcid: m.toolCallId ?? m.tool_call_id ?? null,
    tn: m.toolName ?? m.name ?? null,
    err: m.isError ?? null,
    id: m.id ?? null,
  });
  // ... DJB2-like hash
}
```

**為什麼這些欄位全要？** Provider 序列化時可能用 `tool_calls`（OpenAI wire format）或 `toolCalls`（內部格式）、可能有 `providerPayload` 夾帶原生欄位、**任何一個欄位變了，wire 上的 bytes 就變了**，cache 就會 miss。所以 digest 必須覆蓋「provider 可能序列化的所有欄位」。

### #digestMemo + estimateVersion：解決 in-place mutation 的 coherence

```typescript
// line 200, 314-316, 332-333
#digestMemo = new WeakMap<object, { version: number; digest: number }>();

const version = messageEstimateVersion(msg as AgentMessage);
const cached = this.#digestMemo.get(m);
if (cached !== undefined && cached.version === version) return cached.digest;
// ... compute digest ...
this.#digestMemo.set(m, { version, digest: hash32 });
```

**問題**：prune/shake/strip-images 會 **in-place 修改** 已經同步過的 message 物件（同一個 object reference）。WeakMap key 是物件身份，若不檢查 version，memo 永遠回傳**修改前**的 digest → `#longestStablePrefix` 以為沒變 → log 不截斷 → 送給 provider 的 bytes 與 log 不一致。

**解法**：
1. `messageEstimateVersion`（`compaction/message-cache.ts`）在 message 被 in-place 修改時 bump version（透過 symbol-keyed 版本標籤）
2. `#messageDigest` 先查 memo，`version === cached.version` 才信任 memo；否則重算並更新 memo
3. **Owner 必須呼叫 `invalidateMessageCache`**（line 189–198 註解強調），否則違反 cache-coherence 契約，屬 unsupported behavior

這是一個 **跨模組契約**：
- `AppendOnlyContextManager` 信任 `#digestMemo` 的版本檢查
- `compaction/message-cache.ts` 的 `invalidateMessageCache` 負責 bump version
- `tokenizer.ts` 的 `checkTokenBudget` 也共享同一套 version 機制
- 三者共同維護「message 物件身份穩定、內容變更必須 bump version」的不變量

---

## 學到的事

1. **Prompt cache 敏感度極高**——哪怕一個欄位順序、一個工具 id 重新生成、一個空格，都會導致整個 prefix cache miss。omp 把「provider 會序列化的所有欄位」都納入 digest，是為了追求 **byte-level 穩定**
2. **Append-only 不是「只 append」**——現實有 compaction、prune、steering injection。關鍵是 **找到 divergence point，只重送尾巴**，而不是乾脆全清
3. **In-place mutation 需要顯式版本協議**——WeakMap memo 只要物件身份，不看內容。任何 in-place 改動必須配合 `invalidateMessageCache` bump version，這是跨模組契約，不是單一檔案能搞定的
4. **Fingerprint 分層**——system prompt + tool specs（大、穩定、昂貴）用 `StablePrefix.fingerprint`；messages（動態、小、頻繁變）用 `#messageDigest`。兩層 fingerprint 分工不同，失效條件不同
5. **Issue #3406 是最好的設計文件**——註解直接寫「舊版怎麼做、為什麼痛、新版怎麼解決」，比任何設計文檔都精準

---

## 參考資料

- `packages/agent/src/append-only-context.ts` — `StablePrefix`（49–91）、`AppendOnlyLog`（103–146）、`AppendOnlyContextManager.syncMessages`（226–256）、`#longestStablePrefix`（296–304）、`#messageDigest`（306–334）、`#digestMemo`（200、314–333）
- `packages/agent/src/compaction/message-cache.ts` — `messageEstimateVersion`、`invalidateMessageCache`（cache-coherence 契約的另一半）
- `packages/agent/src/tokenizer.ts` — `checkTokenBudget`、`estimateVersion`（同樣共享 version 機制）
- `packages/agent/src/agent-loop.ts` — `syncContextBeforeModelCall` 如何調用 `build`/`syncMessages`（line 1162–1163、1157–1156）

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 2 篇。上一篇：[agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while)。下一篇：四種 compaction 策略（待發布）*