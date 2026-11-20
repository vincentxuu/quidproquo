---
title: "框架更新｜Agno v3.2.1"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno v3.2.1 讓 Session Compactions 歷程跟 Company 的檔案／筆記可以直接用 API 讀出來，同時修掉一批工具跟資料庫層的邊界錯誤"
tldr: "Agno v3.2.1 無 breaking changes。兩個新 API 值得注意：GET /sessions/{id}/compactions 第一次能查詢記憶被摘要掉了什麼，GET /company/tasks/{id}/files 跟 /company/notes 讓 Company 的產出能被外部系統直接讀取，不用再透過聊天介面。"
series:
  name: "AI Framework Changelog"
  order: 68
---

> :globe: [English version](/posts/daily/2026-11-18-framework-agno-v3.2.1-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.2.1 |
| 前一版 | v3.2.0 |
| 發布日 | 2026-11-17 |
| Release Notes | [v3.2.1](https://github.com/agno-agi/agno/releases/tag/v3.2.1) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43.2k |

## 這個版本為什麼重要

上一版（v3.2.0）把 Agno 的 agent 互通協定（A2A）送進官方 1.0，這一版則是把「記憶跟產出到底發生了什麼事」這個長期的黑盒打開一個洞。Session 被壓縮（compaction）後，舊訊息到底被換成了什麼、token 數掉了多少，以前只能從 log 猜；這版新增的 `GET /sessions/{session_id}/compactions` 直接把每次 compaction 取代了幾則訊息、前後 token 數列出來，依新到舊排序。另一個同樣方向的改動是 Company 的 Task 檔案跟共享筆記，現在可以透過 `GET /company/tasks/{task_id}/files` 跟 `GET /company/notes` 直接讀取，不用再透過聊天介面才能看到 agent 到底寫了什麼檔案。兩個功能合在一起看，這版的主線是「讓外部系統能稽核 agent 內部狀態」，而不是加新的 agent 能力本身。

## 重要變更

- **Session Compactions API**：`GET /sessions/{session_id}/compactions` 列出該 session 在 `SqliteDb` 與 `PostgresDb` 上的 compaction 紀錄，依新到舊排序，標明每次取代了多少則訊息、壓縮前後的 token 數 → 第一次能從外部查詢「記憶被摘要掉了什麼」，不用再靠猜測回答使用者「agent 為什麼忘記了某件事」
- **Company Files API**：Task 的檔案和共享筆記開放 `GET /company/tasks/{task_id}/files` 與 `GET /company/notes`，兩者都支援加 `/{path}` 讀取單一檔案 → Company 的產出不再只能透過聊天介面查看，外部儀表板或稽核系統可以直接拉取檔案內容
- **Slack `default_role`**：不在 `users=` 名單裡的 Slack 成員可以拿到一個 managed role 的權限，同時仍以自己的身份被記錄 → 補上 v3.2.0 把核准權限收斂到「預設只有本人」之後，留下的「團隊成員怎麼拿到有限權限」缺口
- **工具韌性批量修補**：`LinearTools`／`DiscordTools`／`ModelsLabTools` 補上 `timeout`（預設 30 秒，ModelsLab 120 秒）；`ExaTools` 補齊 `include_text`／`exclude_text`／`highlights`／`subpages` 等參數；`WebSearchTools` 的 `max_results=0` 現在真的回傳空結果；`PostgresDb` 建表失敗後，同一個 db 物件在問題排除後的下一次呼叫會自動重建 → 一批「用起來卡卡」的小毛病一次清掉，不用等下個大版本

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade agno==3.2.1
```

```python
# 新增：查詢某個 session 的 compaction 歷程
# GET /sessions/{session_id}/compactions

# 新增：讀取 Company Task 的檔案或共享筆記
# GET /company/tasks/{task_id}/files
# GET /company/notes
```

## 與其他框架的對比觀察

記憶被摘要後「消失到哪裡」，一直是多數 agent 框架的黑盒——LangGraph、Mastra 這類框架把記憶做成外接或附加模組，追蹤 compaction 細節通常要自己在應用層加 log。Agno 這版選擇把 compaction 歷程直接做成 `AgentOS` 內建的可查詢 API，跟它一貫把平台能力（metrics、A2A 任務狀態）收進框架本身而不是留給開發者外接的路線一致。

## 今日收穫

之前以為 session compaction 只是一個省 token 的內部優化，讀了這版才注意到：沒有可查詢的 compaction 歷程，開發者其實沒辦法確切回答「使用者抱怨 agent 忘記了某件事」到底是不是因為被摘要掉了——只能猜。把 compaction 做成可查詢的 API，等於把一個長期的黑盒變成了可以稽核的資料。

## 參考資料

- [Agno v3.2.1 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.1)
- [agno-agi/agno GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.2.0...v3.2.1](https://github.com/agno-agi/agno/compare/v3.2.0...v3.2.1)
- [Company File Tree cookbook 範例](https://github.com/agno-agi/agno/blob/main/cookbook/05_agent_os/30_company/16_company_file_tree.py)
- [Agno v3.2.0 深入介紹（A2A 升官方 1.0、Slack 核准權限收斂）](/posts/daily/2026-11-13-framework-agno-v3.2.0)
