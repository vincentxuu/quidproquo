---
title: "框架更新｜Pydantic AI v2.56.0"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.56.0 新增在本機 microVM 裡跑 harness 能力的 SmolSandbox、以 Postgres 為底的 PGTaskDurability，以及可分層的 Skills；BrowserUse 預設改用 host model、遙測改為 opt-in"
tldr: "Pydantic AI v2.56.0：`SmolSandbox` 讓 harness 能力跑在本機 smolvm microVM 裡；`PGTaskDurability` 用 pgtask 做 durable execution，另有 Render Workflows 整合；`Skills` 可分層載入專案與個人技能庫；支援 Python 3.15 與 Gemini 4 Argon，Google provider 預設逾時拉到 20 分鐘。相容性注意：`BrowserUse` 預設改在 host model 上跑，browser-use 的遙測改成要自己打開；`MCPToolset(http_client=...)` 修正為會套用 auth 且不再關掉使用者傳入的 client。"
series:
  name: "AI Framework Changelog"
  order: 42
---

> 🌏 [English version](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.56.0 |
| 前一版 | v2.55.0 |
| 發布日 | 2026-10-14（UTC 10-13 23:35） |
| Release Notes | [v2.56.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.6k |

## 這個版本為什麼重要

上一版加了 `Conversation` 物件與 Postgres 的 step／media store，這一版把執行環境補齊：harness 的能力可以關進本機 microVM 跑，durable execution 多了 Postgres 和 Render 兩條路。對想把 Pydantic AI agent 放進正式環境、又不想綁特定 workflow 引擎的團隊，選項變多了。

## 重要變更

- **SmolSandbox**：新的 workspace，把 harness 能力放進本機的 smolvm microVM 執行 → 想讓 agent 跑指令又不想直接碰主機時，有了不靠雲端服務的隔離選項
- **PGTaskDurability**：以 pgtask 為基礎的 durable execution → 已經有 Postgres 的團隊可以不另外架 Temporal 之類的引擎
- **Render Workflows 整合**：durable execution 引擎新增 Render Workflows → 部署在 Render 上的 agent 可以直接用平台的 workflow
- **Skills 分層**：`Skills` 可以疊加專案與個人技能庫、替每個技能目錄命名，並能把技能渲染成 host 指令 → 團隊共用技能與個人技能可以分開管理
- **模型與執行環境**：支援 Gemini 4 Argon（`gemini-4-argon`），長輸出可超過單次請求的上限；Google provider 預設逾時改為 20 分鐘；支援 Python 3.15；`ZaiProvider` 可指定 `base_url`
- **harness `Coder` 能力**：移除 `WarnNearLimits`
- **值得注意的修正**：`MCPToolset(http_client=...)` 現在會對請求套用 `auth`，也不再關掉使用者傳入的 client；OpenAI Responses、Anthropic、Groq 回 200 卻是 `text/plain` 時改丟 `ModelAPIError`；Exa 回 402 時直接拋出而不重試

## Breaking Changes

Release notes 沒有標 breaking changes，但有一項相容性注意：

- `BrowserUse` 預設改在 host model 上執行，browser-use 的遙測改為 opt-in
  - 影響範圍：原本依賴 BrowserUse 用另一個模型、或依賴 browser-use 預設送出遙測的專案
- `Coder` 能力移除 `WarnNearLimits`
  - 影響範圍：依賴接近上限警告的 harness 設定

## 遷移指南

### 從 v2.55.0 升級到 v2.56.0

```bash
pip install --upgrade "pydantic-ai==2.56.0"
```

升級後檢查兩件事：用 `BrowserUse` 的地方，確認現在跑在 host model 上的成本與行為符合預期，需要遙測就自己打開；用 `MCPToolset(http_client=...)` 且自己帶 auth 的地方，確認不會重複套用 auth，並自行管理 client 的關閉。

## 與其他框架的對比觀察

Pydantic AI 這版的 microVM 沙箱跟同一天 [Mastra 1.77.0](/posts/daily/2026-10-15-framework-mastra-1.77.0) 的 sandbox provider 契約，處理的是同一件事：agent 執行程式碼的環境要能換、要隔離。差別在 Pydantic AI 先給本機 microVM，Mastra 先做 Docker／E2B 這類 provider 抽象。

## 今日收穫

之前以為 durable execution 一定要搭 Temporal 這類獨立引擎，Pydantic AI 接連加上 Postgres step store 和 PGTaskDurability，讓我意識到對多數團隊來說，「用已經有的 Postgres 撐 durable」可能比導入新引擎更實際。

## 參考資料

- [Pydantic AI v2.56.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [SmolSandbox PR #10148 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10148)
- [PGTaskDurability PR #10174 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10174)
