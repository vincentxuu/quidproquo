---
title: "框架更新｜Pydantic AI v2.64.0"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.64.0 新增 ModelFallback capability 讓模型容錯可以黏在答對的 fallback 模型上、BoxdSandbox 把整組 harness capability 裝進沙箱機器，並為 Memory／Skills 加上 ArtifactScanner 安全掃描"
tldr: "Pydantic AI v2.64.0 四個重點：(1) Breaking：重試傳輸放棄後的錯誤狀態改丟 `ModelHTTPError` 讓 fallback 接手、`Coder` 工具預設關閉嚴格 schema、`json-repair` 改成選用依賴；(2) 新增 `ModelFallback` capability，支援 `sticky` 黏在答對的 fallback 模型，並帶 `prepare_model_request` hook 與 `RetryModelRequest`；(3) 新增 `BoxdSandbox`，把 `Coder`／`Shell`／`FileSystem` 等整組 harness capability 裝進同一個 boxd 沙箱機器；(4) 新增 `ArtifactScanner`，為 `Memory` 與 `Skills` 這類 agent artifact 做安全掃描。"
series:
  name: "AI Framework Changelog"
  order: 59
---

> 🌏 [English version](/posts/daily/2026-11-01-framework-pydantic-ai-v2.64.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.64.0 |
| 前一版 | v2.63.0 |
| 發布日 | 2026-10-30 |
| Release Notes | [v2.64.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## 這個版本為什麼重要

這版把「模型掉線怎麼辦」從一個 try/except 問題,升級成一個正式的 capability。以前模型呼叫失敗,通常是自己在外面包一層重試或換模型的邏輯,沒有統一的狀態管理。`ModelFallback` 把這件事收進框架:失敗時換模型,還可以用 `sticky` 讓對話黏在「剛剛答對的那個 fallback 模型」上,不必每次請求都從主模型重新失敗一輪才換過去。同一版也補了另一個長跑 agent 常見的安全缺口——`Memory` 和 `Skills` 這類 agent 自己寫入、自己讀出的 artifact,以前沒有統一的掃描機制,新的 `ArtifactScanner` 把這段補上。`BoxdSandbox` 則是把 `Coder`、`Shell`、`FileSystem` 這些原本各自管理的 harness capability,收進同一個沙箱機器裡跑,執行環境的邊界更清楚。

## 重要變更

- **ModelFallback capability**:新增正式的模型容錯機制,帶 `prepare_model_request` hook 與 `RetryModelRequest`,並支援從 agent spec 直接建構 → 容錯邏輯不用自己在外面重寫,換模型的時機與條件可以宣告式設定
- **sticky 黏住答對的 fallback 模型**:`ModelFallback` 新增 `sticky` 選項,讓對話黏在剛剛成功回應的 fallback 模型上 → 避免每次請求都從主模型重新失敗一次才換過去,省掉重複的失敗延遲
- **BoxdSandbox 整合沙箱**:新增 `BoxdSandbox`,把 `Coder`、`Shell`、`FileSystem` 等 harness capability 裝進同一個 boxd 機器執行 → 原本分散管理的執行環境收斂成一個邊界清楚的沙箱,降低跨 capability 互相汙染的風險
- **ArtifactScanner 安全掃描**:為 `Memory` 與 `Skills` 新增 `ArtifactScanner`,掃描 agent 自己寫入、自己讀出的 artifact → agent 長跑過程中累積的記憶與技能檔案,多一層安全檢查,不是寫進去就直接信任讀出來的內容
- **RunContext.load_capability 動態載入**:新增 `RunContext.load_capability`,讓程式碼可以在執行期按需載入 capability → 不必把所有可能用到的 capability 都預先掛上 agent,降低初始化成本
- **first_event_timeout 串流逾時保護**:新增 model setting `first_event_timeout`,讓一個從未真正開始的串流可以觸發 fallback → 卡住不動的串流不會無限期掛著,而是提早判定失敗並換模型
- **DetectLoops 結果配對回應**:`DetectLoops` 的工具結果改成跟「觸發這次呼叫的那個回應」配對 → 偵錯重複動作迴圈時,能準確對回是哪一輪請求導致的

## Breaking Changes

- 重試傳輸放棄後,錯誤狀態改丟 `ModelHTTPError`,讓 fallback 機制接手:
  - 影響範圍:原本依賴「重試耗盡後拿到的是某種傳輸層例外」的錯誤處理程式碼,需要改抓 `ModelHTTPError`
- `Coder` 的工具預設關閉嚴格 tool schema,改用 `Coder(strict=True)` 選擇性開啟:
  - 影響範圍:依賴嚴格 schema 驗證行為(例如假設工具參數一定符合某個固定結構)的 `Coder` 使用場景,升級後行為會變寬鬆,需要明確加 `strict=True` 才能保留舊行為
- `json-repair` 從必裝依賴改成選用依賴,只有 `Coder` 和 `RepairToolArguments` 需要:
  - 影響範圍:沒有另外安裝 `json-repair` 但程式碼依賴它存在的環境,升級後會在用到相關功能時才報缺少依賴,而不是安裝階段就裝好

## 遷移指南

### 從 2.63.0 升級到 2.64.0

```bash
pip install --upgrade pydantic-ai==2.64.0
```

```python
# 若要維持 Coder 舊版「嚴格 tool schema」的行為
coder = Coder(strict=True)

# 若程式碼用到 Coder 的 json-repair 相關功能,需另外安裝選用依賴
# pip install "pydantic-ai[json-repair]"

# 用 ModelFallback 宣告容錯模型,並讓對話黏在答對的 fallback 模型上
fallback = ModelFallback(models=[primary_model, backup_model], sticky=True)
```

其餘功能為新增能力,不升級既有程式碼也能照常運作。

## 與其他框架的對比觀察

前一天(2026-10-29)Agno 在 v3.1.12 把 `ClaudeAgent`／`CodexAgent` 自己的權限請求接進 AgentOS 既有的 Approval UI,讓 run 可以暫停成可持久化的 `PAUSED` 狀態等人核准;Pydantic AI 這版同樣在補「長跑 agent 的風險控制」缺口,但走的是另一條路——`ArtifactScanner` 掃描 `Memory`／`Skills` 這類 agent 自己寫入的內容,`ModelFallback` 則處理模型本身失靈時怎麼接手。一個是「人工核准動作」,一個是「自動掃描資料與容錯模型」,同期看下來,框架們都在往「agent 可以更久、更安全地自己跑」的方向補強,只是切入的風險面不同。

## 今日收穫

之前以為模型 fallback 就是「失敗了換一個,成功了就繼續用主模型」,看到 `sticky` 選項才意識到這個假設有問題:如果每次請求都從主模型重新失敗一輪才換到 fallback,相當於每一輪對話都要重複付一次「確認主模型掛了」的延遲與重試成本。`sticky` 把這件事倒過來——既然上一輪已經確認 fallback 模型能用,就先黏在那,不必每輪都重新驗證主模型的健康狀態。

## 參考資料

- [Pydantic AI v2.64.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.63.0...v2.64.0](https://github.com/pydantic/pydantic-ai/compare/v2.63.0...v2.64.0)
- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
