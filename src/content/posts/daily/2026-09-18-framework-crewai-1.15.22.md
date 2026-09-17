---
title: "框架更新｜CrewAI 1.15.22"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: zh-TW
description: "CrewAI 1.15.22 新增 llm_overlay context 變數讓不同 agent 角色能動態路由到不同模型，並補齊 CrewAI Platform 整合的驗證與應用目錄"
tldr: "CrewAI 1.15.22 重點：(1) 新增 `llm_overlay` context 變數，可以在執行期把特定 agent 角色動態路由到不同模型，不用在建立 agent 時就寫死；(2) CrewAI Platform 整合補了應用目錄（application catalog）、connection alias、setup 階段的整合驗證，以及部署失敗原因的紀錄；(3) 追蹤（tracing）新增收集人工回饋與 pause 事件；本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 23
---

> 🌏 [English version](/en/posts/daily/2026-09-18-framework-crewai-1.15.22-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | CrewAI |
| 版本 | v1.15.22 |
| 前一版 | v1.15.21 |
| 發布日 | 2026-09-16 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 58.7k |

## 這個版本為什麼重要

[前一篇（1.15.18）](/posts/daily/2026-08-28-framework-crewai-1.15.18)把 conversational Flow 升為穩定 API；中間的 1.15.19–1.15.21 都是純 bug fix 沒有另外寫文章，1.15.22 則帶回了值得記一筆的新功能。核心是 `llm_overlay`：過去一個 agent 角色綁定哪個模型，通常是在建立 agent 時就寫死；`llm_overlay` 讓你可以在 context 層動態決定某個角色這一輪要路由到哪個模型，對想要依任務難度、成本或延遲動態切模型的 multi-agent 部署來說，這比重新建立 agent 實例輕量很多。另一條線是 CrewAI Platform 整合的補強——應用目錄、setup 階段驗證、部署失敗原因紀錄——這些偏維運面的變更，反映 CrewAI 作為 SaaS 平台的那一側正在跟開源框架同步往前推。

## 重要變更

- **新增 `llm_overlay` context 變數**：在執行期把特定 agent 角色動態路由到不同模型 → 不用在建立 agent 時把模型寫死，可以依任務類型或成本考量在 runtime 決定某個角色這輪該用哪個模型
- **支援 alias 作為連線識別碼**：整合連線可以用 alias 而非原始 ID 來指定
- **追蹤（tracing）收集人工回饋與 pause 事件**：human-in-the-loop 流程中的回饋與暫停動作現在會被記錄進 tracing
- **紀錄部署建立失敗的原因**：CrewAI Platform 上部署失敗時，會保留失敗原因方便除錯
- **crew setup 階段驗證平台整合**：建立 crew 時就檢查平台整合是否設定正確，而不是等到執行期才發現
- **JSON crew wizard 新增平台工具**：用 JSON 定義 crew 時可以直接掛平台工具
- **公開 CrewAI Platform 應用目錄**：可以透過 API 取得平台上可用的應用清單
- **新增 OpenRouter 作為 embedding provider**：已經在用 OpenRouter 做模型路由的團隊，embedding 也可以走同一個 provider
- **修正一系列邊界情況**：inline skill 定義接受 CRLF、透過安全 fetcher 讀取文字檔 URL、修正 streamed tool call 在 Azure 上用錯 wire index 建索引、Gemini 保留 file data content part、`read_only` 尊重 `access` 時間戳、每個 OpenAI reasoning model 都送 `reasoning_effort`

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼。

```bash
pip install --upgrade crewai==1.15.22
```

若要用新的 `llm_overlay` 依角色動態路由模型：

```python
from crewai import Agent, Crew, Task

researcher = Agent(
    role="Researcher",
    goal="...",
    backstory="...",
    llm="gpt-4o-mini",  # 預設模型
)

# 執行期透過 llm_overlay 把 Researcher 這個角色路由到另一個模型
crew = Crew(agents=[researcher], tasks=[...])
crew.kickoff(inputs={}, llm_overlay={"Researcher": "gpt-4o"})
```

## 與其他框架的對比觀察

`llm_overlay` 這類「執行期動態換模型」的能力，Pydantic AI、LangGraph 目前都要靠使用者自己在 graph／agent 邏輯裡手動切換 model 物件；CrewAI 把它包成一個 context 層的 overlay 參數，對 role-based multi-agent 這種「角色固定、模型可換」的場景更直覺。CrewAI Platform 那一側的補強（應用目錄、setup 驗證）則是開源框架廠商越來越常見的路線——先把核心框架做開源，再用託管平台補上企業要的可觀測性與整合管理，這點跟 Mastra Platform、Agno 的 AgentOS 走的是同一個方向。

## 今日收穫

之前以為「換模型」在 multi-agent 框架裡本來就該是 agent 建立時的靜態設定，看到 `llm_overlay` 把它變成執行期可以覆寫的 context 變數才意識到：角色（role）和模型（model）其實是兩個可以獨立變動的維度——同一個「Researcher」角色，簡單任務用便宜模型、複雜任務動態切到更強的模型，不需要為此多維護一套 agent 定義，這對成本敏感的生產部署是實際可用的彈性。

## 參考資料

- [CrewAI 1.15.22 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [CrewAI 1.15.18 — 上一篇框架更新](/posts/daily/2026-08-28-framework-crewai-1.15.18)
- [Full Changelog: 1.15.21...1.15.22](https://github.com/crewAIInc/crewAI/compare/1.15.21...1.15.22)
