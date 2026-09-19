---
title: "修了三次才對：一個設定值在四層架構裡的不一致"
date: 2026-09-19
category: ai
type: debug
tags: [agent-tools, streaming, rag, debugging, observability, context-engineering]
lang: zh-TW
tldr: "使用者在後台把檢索 top_k 設成 15，但監控面板顯示 5、串流 UI 先閃 5 再跳 15。根因是同一個 top_k 值存在於四層——LLM 工具參數、執行時 runtime、trace DB、串流 payload——每層都要個別 override。三次修正，每次修完才發現下一層也錯。"
description: "一個 RAG 工具的 top_k 設定在 AI 助理平台的四層架構中不一致的完整排查記錄：從後端覆蓋到 DB 持久化到串流閃爍。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-topk-override-four-layer-inconsistency-en)

## TL;DR

AI 助理平台新增了「全量檢索」開關——讓 reranker 排完的結果全數回傳，不被 LLM 自選的低 `top_k` 截斷。開關生效了，但監控面板的工具輸入仍顯示 `top_k: 5`（LLM 的原始值），串流 UI 更離譜：先閃 `5` 再跳 `15`。三次修正，分別打在 runtime、DB、streaming 三層，才把四層全對齊。

## 情境

AI 助理平台的 RAG 工具（`retrieve_text_nodes`）在被 LLM 呼叫時，LLM 會自己決定 `top_k` 參數——通常選 3 到 5。問題是，平台有一個 reranker 會對 12 個候選 chunk 重新排序，但工具在回傳前會用 LLM 的 `top_k` 截斷結果。80% 的呼叫，LLM 選的 `top_k ≤ 5`，等於 reranker 辛苦排好的 7–10 個好 chunk 被直接丟掉。

為了解決這個問題，平台新增了 `use_full_retrieval_range` 開關——開啟後跳過截斷，回傳 reranker 的完整結果。管理員可以在後台設定預期的 `top_k`（例如 15），當開關啟用時，用這個值覆蓋 LLM 的選擇。

## 問題

開關上線後，內部測試發現三個症狀：

1. **監控面板**：工具呼叫記錄的輸入參數顯示 `top_k: 5`，跟使用者設定的 15 不符
2. **串流 UI**：使用者在對話過程中看到工具呼叫先顯示 `top_k: 5`，一閃而過後才變成 `15`
3. **實際檢索結果**：回傳了 15 個 chunk——後端邏輯是對的

後端邏輯正確，但使用者看到的**每個介面都在說謊**。

## 嘗試過程

### 第一層排查：後端 runtime

追蹤 `retrieve_text_nodes` 工具的 `call()` 方法。LLM 傳進來的 `tool_kwargs['top_k']` 確實是 5——這是 LLM 自己決定的，符合預期。問題在於覆蓋邏輯的位置：override 發生在工具執行內部，但 trace span 的 `tool_kwargs` 是在工具執行**之前**就記錄的。

修法：在工具的 `call()` / `acall()` 開頭加 `_resolve_top_k()` 方法，先把 `tool_kwargs['top_k']` 覆蓋成設定值，再開始執行。工具完成後，更新 trace span 的 `tool_kwargs`。

```python
def _resolve_top_k(self, kwargs: dict) -> dict:
    if self.chatbot.use_full_retrieval_range:
        kwargs['top_k'] = self.chatbot.configured_top_k
    return kwargs
```

部署後，trace span 的值對了。但監控面板還是顯示 `5`。

### 第二層排查：DB 持久化

trace span 是對了，但監控面板讀的不是 trace span——它讀的是 `ToolCallResult` 物件，這個物件在工具完成後寫入資料庫。查 `ToolCallResult` 的建構邏輯：它從原始的 `ToolUseContent.input` 取工具輸入參數，而 `ToolUseContent` 是在工具執行**之前**從 LLM 的回應建構的。

也就是說，`ToolCallResult` 記錄的是 LLM 原始傳入的參數，不是被 override 後的參數。

修法：在 `ToolCallResult` 建構時加 `_patch_tool_use_input()` 方法，用實際執行的參數覆蓋紀錄。

```python
def _patch_tool_use_input(self, result: ToolCallResult) -> None:
    if hasattr(self, '_effective_kwargs'):
        result.tool_use.input.update(self._effective_kwargs)
```

部署後，監控面板的數字對了。但串流 UI 還在閃。

### 第三層排查：串流 payload

串流 UI 的工具呼叫顯示來自 SSE (Server-Sent Events) 推送。追蹤事件流：當 LLM 回傳 `tool_use` content block 時，系統立即建構 `ToolUseContent` 並推送到前端——這發生在工具**開始執行之前**。所以前端先收到 LLM 原始的 `top_k: 5`，等工具跑完、DB 更新後，才收到正確的 `15`。

使用者看到的「閃爍」就是這個時間差：

```
t=0s  SSE: tool_use { input: { top_k: 5 } }     ← LLM 原始值
t=0.3s  工具開始執行，override top_k=15
t=1.2s  工具完成，DB 寫入 top_k=15
t=1.3s  SSE: tool_result { ... }                  ← 結果是 15 個 chunk
```

修法：在 `_ahandle_tool_call` 中，建構 `ToolUseContent` **之前**就覆蓋 `event.tool_kwargs['top_k']`，讓串流一開始就推送正確的值。

```python
async def _ahandle_tool_call(self, event):
    if self.chatbot.use_full_retrieval_range:
        event.tool_kwargs['top_k'] = self.chatbot.configured_top_k
    content = ToolUseContent(input=event.tool_kwargs, ...)
    # 推送到 SSE
```

## 為什麼會這樣

同一個 `top_k` 值存在於四個不同的層級：

```
┌─────────────────────────────────────────────┐
│ Layer 1: LLM Tool Call Arguments            │
│   LLM 決定 top_k=5                          │
├─────────────────────────────────────────────┤
│ Layer 2: Tool Runtime                       │
│   _resolve_top_k() override → 15  ✅ 一開始就對 │
├─────────────────────────────────────────────┤
│ Layer 3: Streaming Payload (SSE)            │
│   ToolUseContent.input → 前端即時顯示        │
│   Fix 3: 建構前 override                    │
├─────────────────────────────────────────────┤
│ Layer 4: Trace DB (ToolCallResult)          │
│   監控面板的資料來源                          │
│   Fix 2: _patch_tool_use_input()            │
└─────────────────────────────────────────────┘
```

每一層有自己的建構時機：
- **Runtime**（Layer 2）：工具執行時——最早被修正
- **Streaming**（Layer 3）：LLM 回傳 tool_use 時立即建構——比 runtime 更早
- **DB**（Layer 4）：工具完成後寫入——用的是建構時的快照

根因不是邏輯錯誤，而是**架構上的時序問題**。在串流架構中，資料流過多個快照點，每個快照點都可能記錄到覆蓋前的舊值。

## 學到的事

**在串流架構中，修好後端只是第一步。** 同一個值在 runtime、streaming payload、DB record 各有一份快照，修正必須在每個快照建構前介入。這不是 bug——是串流系統的結構性特徵。

三條排查原則：

1. **追快照，不追值**：如果一個設定在不同介面顯示不同值，問題不在設定本身，而在每個介面各自在什麼時機拍了快照
2. **串流先於執行**：SSE 事件在工具執行前就推出去了，任何 runtime override 都來不及。覆蓋點必須在建構串流 payload 之前
3. **監控面板不等於 trace**：trace span 和 DB record 可能從不同來源取值。修了一個不代表修了另一個

一個相關的平行案例：同一天上線的另一個修正發現，retriever 的初始化失敗被 `except Exception` 靜默吞掉，導致大約 10% 的對話完全沒有知識庫工具，agent 直接用記憶編答案——使用者完全不知道。兩個 bug 共享同一個主題：**後台設定看起來正確，但 runtime 的行為不一致**。

## 參考資料

- [Amazon Bedrock ConverseStream API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)
- [Server-Sent Events 規格 (WHATWG)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OpenTelemetry Tracing Specification — Span](https://opentelemetry.io/docs/specs/otel/trace/api/#span)
