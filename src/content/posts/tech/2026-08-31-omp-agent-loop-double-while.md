---
title: "OMP agent loop：為什麼需要兩層 while？外層的「停了就再被 steering 打醒」在做什麼"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, coding-agent, architecture, steering, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 1
tldr: "omp 的 runLoopBody 用雙層 while：內層跑 model call → tool call 的核心節奏；外層在 agent 本想停下時，排空 queued steering / follow-up / asides，決定要不要再跑一輪。這設計解決了「使用者在 model 跑時打字」與「背景任務悄悄塞訊息」的交付時機問題。"
description: "深入 omp agent-loop.ts 的 runLoopBody，拆解外層/內層 while 的分工、steering queue 的三次輪詢點、pause gate 的兩個停車點、soft tool requirement 的跨輪生命週期，以及為何這樣切比單層迴圈更乾淨。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第一篇。之前兩篇（[v1 vs Pi](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)、[OMP 2 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)）是宏觀比較，這裡開始拆子系統。

---

## TL;DR

- **內層 while**（`while (hasMoreToolCalls || pendingMessages.length > 0)`）：model call → tool execution → result 注入 → 再 model call 的核心節奏
- **外層 while**（`while (true)`）：agent 本想停下（`hasMoreToolCalls === false && pendingMessages.length === 0`）時，執行 `onBeforeYield`、輪詢 steering/follow-up/asides，若有新訊息塞回 `pendingMessages` 並 `continue` 回內層
- **三個 steering 輪詢點**：開頭（1067）、mid-batch（1509）、外層 drain（1538）——解決「使用者在 model 跑時打字」與「背景任務悄悄塞訊息」的交付時機
- **Pause gate 兩個停車點**：model call 前（1142）、tool call 前——讓 `/pause` 能凍結所有 in-process agent 而不 abort 任何東西
- **Soft tool requirement 跨輪狀態**：`softRequirementState` 活著直到下一個 logical turn 邊界，Harmony retry 時不重複 escalate

---

## 情境

你在寫一個 coding agent。模型回了一段工具呼叫，agent 執行完工具、把結果塞回對話、再請模型。模型說「我做完了」（`stop_reason: "end_turn"`），agent 準備結束這輪。

但這時候：

1. 使用者在 model streaming 時已經打了新指令（steering message）
2. 某個背景 hook 想塞一個 diagnostic（aside message）
3. 上一輪有個 subagent yield 留下 follow-up message

**這些訊息該什麼時候交付？** 如果現在就塞進下一輪 model call，可能打斷「agent 本想停下」的語意；如果不塞，下次使用者手動 prompt 才會看到——太晚。

這就是 omp `runLoopBody` 雙層 while 要解決的問題。

---

## 問題

單層迴圈的直覺寫法：

```typescript
while (hasMoreToolCalls || pendingMessages.length > 0) {
  // model call → tool call → ...
  // 處理完 tool calls，若 hasMoreToolCalls 變 false 且 pendingMessages 空 → break
}
```

問題：

- **steering 交付時機模糊**：若在 model call *前*輪詢，使用者打字時 model 可能還在 streaming；若在 model call *後*輪詢，agent 已經決定停了，steering 只能等下次手動 prompt
- **asides / follow-ups 的優先級不清**：背景產出的 asides 不應強迫多跑一輪 model call（會多花錢），但 steering（使用者活躍輸入）應該強迫
- **pause/resume 語意難表達**：單層迴圈要在「model call 前」和「tool call 前」各停一次，邏輯會散在各處
- **Harmony leak retry / soft requirement escalate** 等跨輪狀態，很難在單層迴圈乾淨地表達「這輪重試不算新 turn」「soft requirement 只 escalate 一次」

omp 的解法：把「核心節奏」與「停止邊界的排水邏輯」拆成兩層。

---

## 嘗試過程（在 omp 代碼演進中可見的痕跡）

看 `agent-loop.ts` 歷史（`git log --oneline packages/agent/src/agent-loop.ts`），關鍵演進：

1. **早期**：只有單層 while，steering 只在開頭輪詢一次
2. **加入 mid-batch steering poll**（1509 行）：發現 tool execution 久時，使用者打字會卡在 queue 到下一輪才被處理
3. **外層 while 包起來**（1126 行）：為了在「agent 本想停」時，統一做 `onBeforeYield` + drain steering/asides/follow-ups
4. **Pause gate 抽出獨立模組**（`pause.ts`）：原本 inline 在 loop 裡，後來因為 main session、subagent、advisor 三種 agent 都要共享同一個 process-wide gate，才抽出來
5. **Harmony leak handling**（1269-1296）：GPT-5 的 harmony 格式會 leak 思考內容，需要 abort-retry 和 truncate-resume 兩種恢復策略，分別有跨輪計數器（`harmonyRetryAttempt`、`harmonyTruncateResumeCount`）——這些狀態若在單層迴圈會極其雜亂

每一步都是為了把某種「橫切關注點」從核心節奏剝離出去。

---

## 解法：雙層 while 的精確分工

### 內層：核心節奏（model ↔ tool）

```typescript
// line 1130
while (hasMoreToolCalls || pendingMessages.length > 0) {
  // 1. pause gate 停車
  if (agentPauseGate.paused) await agentPauseGate.waitUntilResumed(signal);

  // 2. 吃掉 pendingMessages（steering/asides 從 queue 升級成 context）
  // 3. syncContextBeforeModelCall / beforeModelCall hooks
  // 4. streamAssistantResponse（model call）
  // 5. 解析 tool calls，執行 executeToolCalls
  // 6. emitTurnEnd
  // 7. 決定 hasMoreToolCalls（根據 stopReason、tool calls 數量、deadline、soft requirement）
  // 8. mid-batch steering poll（1509）→ 決定 pendingMessages
}
```

**關鍵點**：

- `hasMoreToolCalls` 由 `message.stopReason === "toolUse" || message.stopReason === "stop"` + 有 tool calls 決定
- `pendingMessages` 在迴圈開頭被吃進 `turnMessages`，變成這輪 context 的一部分
- **mid-batch steering poll**（1509-1518）：工具跑完、下一輪 model call *前*再輪詢一次。若 `hasMoreToolCalls` 為 true（還有工具要跑），把 steering + asides 合併進 `pendingMessages`；若 false（agent 想停），只保留 steering，asides 留給外層 drain

### 外層：停止邊界的排水口

```typescript
// line 1126
while (true) {
  // 內層跑完 → agent 本想停在這裡
  
  // 1. onBeforeYield（host 可以在這裡塞 follow-up、做 cleanup）
  await config.onBeforeYield?.();
  
  // 2. 三源輪詢：lateSteering / asideMessages / followUpMessages
  const lateSteering = await config.getSteeringMessages?.(signal) || [];
  const asideMessages = resolveAsides(await config.getAsideMessages?.());
  const followUpMessages = await config.getFollowUpMessages?.(signal) || [];
  
  // 3. 若有任一源有訊息 → 塞回 pendingMessages，continue 回內層
  if (lateSteering.length > 0 || asideMessages.length > 0 || followUpMessages.length > 0) {
    pendingMessages = [...lateSteering, ...asideMessages, ...followUpMessages];
    continue; // ← 關鍵：回內層再跑一輪
  }
  
  // 4. 真沒東西了 → break
  break;
}
```

**關鍵設計**：

- **Steering 優先**：外層 drain 會把 `lateSteering`、`asideMessages`、`followUpMessages` 一起塞進 `pendingMessages`，但內層開頭吃 `pendingMessages` 時不分優先級——優先級邏輯在 **mid-batch poll（1509-1518）**：只有 steering 能在「agent 想停」時強迫多跑一輪；asides/follow-ups 若在 stop boundary 才出現，會被外層 drain 收集，但 **不** 在 mid-batch 強迫多跑一輪
- **`onBeforeYield` 位置在外層**：確保每個 logical turn 結束時恰好執行一次，不會在 Harmony retry、soft requirement escalate 等「非正常 turn 結束」時重複執行
- **Abort 安全**：每次輪詢都檢查 `signal?.aborted`，外部 abort 時直接回空陣列，避免把 queue 訊息「困」在一個即將 abort 的 run 裡（1535 註解詳細解釋）

---

## 為什麼會這樣：三個輪詢點的時機圖

```
Timeline:
──────────────────────────────────────────────────────────────────►

[Run Start]
   │
   ├─► 1. 開頭 steering poll (line 1067)
   │     用途：捕獲「使用者在等待 model 時打的字」
   │
   ├─► 內層迴圈第 1 輪
   │     model call → tool calls → emitTurnEnd
   │
   ├─► 2. Mid-batch steering poll (line 1509)
   │     用途：捕獲「tool execution 期間使用者打的字」+ asides
   │     決策：hasMoreToolCalls=true → steering+asides 合併
   │           hasMoreToolCalls=false → 只保留 steering，asides 留外層
   │
   ├─► 內層迴圈第 N 輪（若 hasMoreToolCalls）
   │     ...
   │
   ├─► 內層結束（hasMoreToolCalls=false, pendingMessages=[]）
   │
   ├─► onBeforeYield (line 1528)
   │
   ├─► 3. 外層 drain (line 1538)
   │     lateSteering + asideMessages + followUpMessages
   │     用途：捕獲「agent 本想停的瞬間」背景塞進來的一切
   │
   ├─► 若有訊息 → pendingMessages = [...], continue 回內層第 1 輪
   │
   └─► 真正結束
```

**為什麼不用單一輪詢點？**

- 開頭 poll 太早：model 還沒跑，使用者剛打字 → 正確
- Mid-batch poll 太晚：tool 跑完了才看到 steering → 但比下一輪手動 prompt 快
- 外層 drain 最晚：agent 已經「決定停了」才看 → 但這是 asides/follow-ups 的正確時機（它們不該強迫多跑一輪）

三個點各有語意，合起來覆蓋「等待中」、「工作中」、「停止邊界」三個階段。

---

## Pause Gate：Process-wide 的凍結開關

`pause.ts`（107 行）定義了 `AgentPauseGate`，內層迴圈第 1 行就檢查：

```typescript
if (agentPauseGate.paused) await agentPauseGate.waitUntilResumed(signal);
```

**設計細節**：

- **Process-wide singleton**：`export const agentPauseGate = new AgentPauseGate()`（line 107），main session、in-process subagent、advisor 共用
- **兩個停車點**：model call 前（1142）、tool call 前（`executeToolCalls` 內部也會檢查）——確保「已經開始的 provider stream / tool execution 跑完」才停
- **Abort 穿透**：`waitUntilResumed(signal)` 中，若 `signal.aborted` 直接 return，**不釋放 gate**（line 78）。意思是：取消這個 run 不需要 resume 整個 process，其他 agent 繼續凍結
- **Epoch 記錄**：`pausedAt` 紀錄 pause 開始時間，resume 回傳 pause duration（ms）

這比在 loop 到處寫 `if (paused) await ...` 乾淨得多——gate 邏輯集中在 107 行裡，loop 只需兩行調用。

---

## Soft Tool Requirement：跨輪的「強迫模型呼叫特定工具」

這是給 host（如 TUI）用的機制：host 可以在 `getToolChoice` 回傳 `SoftToolRequirement`，要求模型下一輪**必須**呼叫某工具（如 `read` 確認檔案存在）。

```typescript
// line 1166-1190
if (!directiveResolvedForTurn) {
  const directive = config.getToolChoice?.();
  const softReq = isSoftToolRequirement(directive) ? directive : undefined;
  // ...
  directiveResolvedForTurn = true;
}
```

**跨輪狀態管理**：

- `softRequirementState`（line 1052）是 **host-owned**，活著直到下一個 logical turn 邊界（外層 while 真正 break 時）
- Harmony retry `continue` 時（1295）**不重置** `directiveResolvedForTurn`，所以同一輪的 retry 不會重複 escalate
- 正常 turn 結束（`emitTurnEnd` 後 `directiveResolvedForTurn = false`，line 1312），下一輪重新 resolve
- Escalation 計數 `softRequirementState.escalations` 最多 3 次（`MAX_SOFT_TOOL_ESCALATIONS`），超過直接拋錯

這解決了「模型不聽話、一直呼叫別的工具」的問題，又不像 hard tool choice 那樣完全剝奪模型自主權。

---

## Harmony Leak 與 GPT-5 的特殊處理

GPT-5 的 Harmony 格式會在 streaming 時 leak 思考內容（`analysis` channel）。omp 在 `streamAssistantResponse` 內偵測，拋 `HarmonyLeakInterruption`：

```typescript
// line 1269-1296
catch (err) {
  if (!(err instanceof HarmonyLeakInterruption)) throw err;
  if (err.recovered) {
    // truncate-resume：砍掉 leak 部分、把 message 重組、繼續
    if (harmonyTruncateResumeCount >= 2) throw ...;
    harmonyTruncateResumeCount++;
    recovered = err.recovered;
    // ...
  } else {
    // abort-retry：整輪重來
    if (harmonyRetryAttempt >= 2) throw ...;
    harmonyRetryAttempt++;
    continue; // ← 回內層 while 開頭，directiveResolvedForTurn 保持 true
  }
}
```

- **Abort-retry**（最多 2 次）：整輪重跑，`harmonyRetryAttempt` 計數，**不**重置 `directiveResolvedForTurn`（所以 soft requirement 不會被重複 escalate）
- **Truncate-resume**（最多 2 次）：砍掉 leak 片段、把 message 拼湊完整、當作正常 turn 結束，`harmonyTruncateResumeCount` 計數，**重置** `harmonyRetryAttempt = 0`

這兩條路徑各自有獨立計數器，互不干擾，且都在內層 while 內部用 `continue` 處理——外層完全不知情。

---

## 學到的事

1. **雙層迴圈不是為了炫技**——它把「核心節奏」與「停止邊界的副作用收集」分開，每層只管一件事
2. **Steering 的三次輪詢不是重複**——開頭、mid-batch、外層 drain 分別對應「等待中」、「工作中」、「停止邊界」三種語意，優先級不同
3. **Process-wide pause gate 抽離得好**——107 行解決所有 agent 的凍結問題，loop 只需兩行調用
4. **跨輪狀態要有明確 owner 與生命週期**——`softRequirementState` 是 host-owned、`harmonyRetryAttempt` 是 loop-owned、`directiveResolvedForTurn` 是 per-turn，混在一起會亂
5. **Abort 安全要在每個輪詢點都檢查**——`signal?.aborted ? [] : await getX()` 模式重複 6 次，每次都為了不把 queue 訊息困在即將死的 run 裡

---

## 參考資料

- `packages/agent/src/agent-loop.ts` — `runLoopBody` (1025–1563)、`runLoop` (934–971)、`streamAssistantResponse` (1642–1898)
- `packages/agent/src/pause.ts` — `AgentPauseGate`、`agentPauseGate` singleton
- `packages/agent/src/types.ts` — `AgentLoopConfig`（`getSteeringMessages`、`getAsideMessages`、`getFollowUpMessages`、`onBeforeYield`、`syncContextBeforeModelCall`、`beforeModelCall`、`getToolChoice`、`onTurnEnd`）
- `packages/agent/src/agent.ts` — `Agent` 類別如何包裝 `runLoop`、`prompt`、`abort`

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 1 篇。下一篇：Append-only context：為什麼 sync 對話要算 byte-stable prefix？（待發布）*