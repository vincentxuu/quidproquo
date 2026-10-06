---
title: "框架更新｜Inngest v1.46.0"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, framework, daily, inngest]
lang: zh-TW
description: "Inngest 1.46 讓本機開發環境直接連上 Cloud sandbox 跑 agent 程式碼，並把 API Key 換成可依用途細分權限的版本"
tldr: "Inngest v1.46.0 三個重點：(1) 本機 `inngest login` 後就能直接接上 Cloud sandbox，不用部署完整 app 或設定 SDK token（實驗性功能）；(2) API Key 從一把鑰匙全權限，改成可 scope 到 v2 API／CLI／MCP、可設到期日的版本；(3) 修補 Dashboard 依賴 TanStack Start 的 CVE-2026-102989 反射型 XSS。無 breaking changes，直接升級即可。"
series:
  name: "AI Framework Changelog"
  order: 34
---

> 🌏 [English version](/en/posts/daily/2026-10-07-framework-inngest-1.46.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Inngest |
| 版本 | v1.46.0 |
| 前一版 | v1.45.1 |
| 發布日 | 2026-10-06 |
| Release Notes | [GitHub Release](https://github.com/inngest/inngest/releases/tag/v1.46.0) |
| GitHub | [inngest/inngest](https://github.com/inngest/inngest) |
| Stars | 5,917 |

## 這個版本為什麼重要

Inngest 的定位是「serverless workflow 引擎，順便跑 AI workflow」，過去版本多在補 queue 效能跟 dashboard 體驗。1.46 第一次把「agent 要跑的程式碼放哪裡執行」這個問題搬進自己的平台：本機開發環境可以直接 `inngest login` 接上 Cloud 的 sandbox，不用先把整個 app 部署上去、也不用手動配 SDK sandbox token。對會寫 agent 要呼叫 code interpreter 的團隊來說，這代表「本機寫、本機測」跟「正式環境的沙箱」第一次用同一套東西，不用再維護一份本機模擬邏輯。同一版也把 API Key 從「一把鑰匙開全部門」換成可依用途細分權限、可設到期日的版本——這對把 agent 跑在 CI 或透過 MCP 呼叫 Inngest 的團隊是直接可用的資安改善。

## 重要變更

- **本機工作流程接上 Cloud sandbox**：`inngest login` 後本機 workflow 可以直接連雲端沙箱執行 agent 程式碼 → 不用部署 app、不用設定 SDK sandbox token，但屬實驗性功能，需要相容的 JavaScript SDK build，且登入要 scope 到單一已有 sandbox 權限與預設 VPC 的 Cloud 環境
- **可細分權限的 API Key**：管理者可以建立 scope 到 v2 API／CLI／MCP 的 API Key，能設到期日或永久有效 → 既有的 API key／signing key 不受影響，除非管理者手動關閉舊版存取
- **Sandbox Secrets 管理**：Dashboard 側邊欄可以匯入 `.env` 檔管理密鑰，API 端可用 `secrets: ["OPENAI_API_KEY"]` 指定要注入 sandbox 的既存密鑰 → release notes 明確標註這是「尚未正式上線的功能」，要 API／control-plane／SDK 三邊同步部署才能用
- **Tracing 納入自訂 concurrency key**：自訂的併發運算式跟實際算出的值，現在會出現在 run／execution trace 以及 GraphQL API 裡（超過 512 字元會截斷） → debug 併發瓶頸不用再憑經驗猜
- **Realtime 串流加上保護機制**：執行被取消或串流超過 5 分鐘就停止發布，發布失敗也不會丟掉 function 的回應結果，並修正發布端點的授權表頭 → 避免長時間串流卡住整個 function
- **CVE 安全修補**：Dashboard 用的 TanStack Start 升級到 1.168.60，修補 [CVE-2026-102989](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989)（server-function 回應的反射型 XSS）

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
# Go 版 inngest CLI／server
go install github.com/inngest/inngest/cmd/inngest@v1.46.0
```

若要試用「本機接 Cloud sandbox」的實驗性功能，需先確認手上的 JavaScript SDK 版本相容，並用 `inngest login` 登入 scope 到單一 Cloud 環境（該環境要已開通 sandbox 權限與預設 VPC）；要切換環境用 `inngest login --force`。Sandbox 用完不會自動清理，需要手動關閉。

## 與其他框架的對比觀察

Inngest 跟 Temporal 一樣走「workflow 引擎兼 agent 執行底座」路線，但過去都把「agent 程式碼要在哪個沙箱跑」這塊留給 E2B、Daytona 這類專門的 sandbox 服務去補。1.46 把本機開發直接接上自家 Cloud sandbox，是把這塊拉回平台內部的訊號；只是多項功能（sandbox secrets 管理、本機接 sandbox）還卡在實驗性或尚未正式上線，離 Mastra、LangGraph 那種可以直接拿來用的 agent 原語還有一段距離。

## 今日收穫

之前以為「workflow 編排」跟「agent 程式碼執行沙箱」是兩層分開的基礎設施——前者管流程跟重試，後者才管隔離跟安全。看到 Inngest 把本機登入直接接上雲端沙箱才意識到，workflow 引擎廠商正在把「agent 執行環境」收進自己的平台範圍，而不是留一個介面讓 E2B、Daytona 這類專門服務插進來。

## 參考資料

- [Inngest v1.46.0 Release Notes](https://github.com/inngest/inngest/releases/tag/v1.46.0)
- [inngest/inngest GitHub Repository](https://github.com/inngest/inngest)
- [TanStack Start security update: CVE-2026-102989](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989)
