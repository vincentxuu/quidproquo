---
title: "框架更新｜Pydantic AI v2.42.0"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.42 新增 GitHubCopilotProvider 擴大模型接入面，並收緊 DeferredToolResults.approvals 的驗證行為"
tldr: "Pydantic AI v2.42.0 三個重點：(1) 新的 `GitHubCopilotProvider` 讓 Agent 可以直接用 GitHub Copilot 的 OpenAI 相容 API 當模型後端；(2) `DeferredToolResults.approvals` 收到不合法值時改為直接拒絕，是一項相容性變更；(3) 修正 Bedrock Converse 的 sampling 參數、code-mode 函式 schema 的 `$ref` 解析、Anthropic 對話紀錄的錯誤恢復狀態遺失問題。"
series:
  name: "AI Framework Changelog"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.42.0 |
| 前一版 | v2.41.0 |
| 發布日 | 2026-09-08 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## 這個版本為什麼重要

[上一篇（2.40.0）](/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0)在即時語音互動上跨了一大步；這次 2.42 是一次典型的「補洞＋擴大模型接入面」版本，規模小很多，但方向仍然一致。`GitHubCopilotProvider` 讓已經有 Copilot 訂閱的團隊不用再自己拼一個 OpenAI-compatible base_url 的變通寫法，就能直接把 Copilot 當 Agent 的模型後端。另一個值得注意的變更藏在 Compatibility Notes 裡：`DeferredToolResults.approvals` 收到不合法值時，現在會直接拋出驗證錯誤，而不是放行後在後續流程才出問題——對做 human-in-the-loop 工具審批的團隊來說，這讓錯誤能更早被抓到，但也代表原本「剛好沒被檢查出來」的用法，升級後可能第一次遇到明確的錯誤。

## 重要變更

- **`GitHubCopilotProvider`**：新增專用 provider，讓 Agent 可以直接用 GitHub Copilot 的 OpenAI 相容 API 作為模型後端 → 已經有 Copilot 訂閱的團隊不用再自己拼一個相容層或走 OpenAI-compatible base_url 的 hack 寫法
- **`DeferredToolResults.approvals` 驗證收緊**：收到不合法的 approvals 值時直接 reject，而不是放行後在後續流程才出問題 → human-in-the-loop 工具審批流程中，格式錯誤能更早被抓到；但如果既有程式碼依賴了「不合法值也能跑」的舊行為，升級後可能第一次遇到明確的驗證錯誤
- **Bedrock Converse 尊重 `anthropic_disallows_sampling_settings`**：修正 `BedrockConverseModel` 在某些 Anthropic 模型上仍送出不支援的 sampling 參數的問題
- **Code-mode 函式 schema 的 `$ref` 就地解析**：非物件型別的 `$ref`／`$defs` 現在會就地解析成完整型別定義 → code-mode 工具的函式簽章不會再因為間接參照而退化成沒有型別驗證（`z.any`）或變成懸空參照
- **`ToolReturnContent` 逐 JSON 節點驗證**：即使沒有對應的 Python call，也會逐節點驗證回傳內容 → 格式錯誤能在更早的階段被攔截，不用等到執行期才發現
- **Anthropic 對話紀錄的 recovery 保留**：修正正規化對話歷史後，Anthropic 的錯誤恢復狀態遺失的問題

## Breaking Changes

本版本沒有正式列為 breaking changes 的項目，但 Compatibility Notes 標記了一項相容性變更：

- `DeferredToolResults.approvals` 收到不合法值時，行為從「可能被放行」改為「直接拋出驗證錯誤」
  - 影響範圍：使用 deferred tool approval（human-in-the-loop 工具審批）流程、且曾經傳入格式不完全符合預期的 approvals 資料的專案

## 遷移指南

### 從 2.41.x 升級到 2.42.0

```bash
pip install --upgrade pydantic-ai==2.42.0
```

新功能使用範例：

```python
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.github_copilot import GitHubCopilotProvider

model = OpenAIModel("gpt-4o", provider=GitHubCopilotProvider())
agent = Agent(model)
```

若原本傳給 `DeferredToolResults.approvals` 的資料格式不完全正確（例如 key 對不上 tool call id、值型別錯誤），這版升級後會直接看到驗證錯誤，而不是像過去可能被靜默放行——建議先跑一次既有的 human-in-the-loop 測試案例，確認沒有踩到這項變更。

## 與其他框架的對比觀察

相較於上一版在語音互動體驗上的大動作，2.42 是一次規模小很多的補洞版本。`GitHubCopilotProvider` 讓 Pydantic AI 支援的 model provider 清單又多了一個，這條路線上它一直領先 LangGraph、CrewAI——後兩者通常要等社群或第三方套件補上新 provider。approvals 驗證收緊則呼應 Pydantic AI「型別即契約」的一貫立場：與其讓不合法資料流到執行期才出錯，不如在邊界就擋下來。

## 今日收穫

之前以為新增一個模型 provider 只是「多接一個 base_url」的事，但看到 Pydantic AI 特地為 GitHub Copilot 做一個獨立的 `GitHubCopilotProvider`（而不是叫使用者自己填一個 OpenAI-compatible 端點）才意識到：不同 OpenAI 相容 API 之間在認證方式、model 命名、參數支援度上其實有足夠差異，值得框架用一個專門的 provider class 去吸收這些差異，而不是丟給使用者自己踩雷。

## 參考資料

- [Pydantic AI v2.42.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.40.0 — 上一篇框架更新](/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0)
- [PR #8081：Reject invalid `DeferredToolResults.approvals` values](https://github.com/pydantic/pydantic-ai/pull/8081)
- [PR #8059：Add a `GitHubCopilotProvider`](https://github.com/pydantic/pydantic-ai/pull/8059)
- [PR #7961：Honor `anthropic_disallows_sampling_settings` in `BedrockConverseModel`](https://github.com/pydantic/pydantic-ai/pull/7961)
- [PR #8056：Resolve non-object `$ref` definitions inline](https://github.com/pydantic/pydantic-ai/pull/8056)
- [PR #7823：Validate `ToolReturnContent` per JSON node](https://github.com/pydantic/pydantic-ai/pull/7823)
- [PR #8040：Preserve Anthropic recovery across normalized history](https://github.com/pydantic/pydantic-ai/pull/8040)
- [Full Changelog: v2.41.0...v2.42.0](https://github.com/pydantic/pydantic-ai/compare/v2.41.0...v2.42.0)
