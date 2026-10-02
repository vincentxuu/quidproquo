---
title: "工具推薦｜Titration — 讓 Coding Agent 用跨供應商評審迭代 Prompt，直到真的修好為止"
date: 2026-09-29
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "自架 MCP server，用來自不同供應商的評審面板對照凍結基準線給 Prompt 改動打分，避免 Agent 修 Prompt 時把自己的評分系統玩壞"
tldr: "Titration 是一個自架的 MCP server，讓 Coding Agent 改 Prompt 後用跨供應商評審面板對照凍結基準線打分，直到問題真的消失或被判定不是 Prompt 的錯。安裝：docker compose up -d 起 Postgres，npm install && npm run setup。解決了 Agent 自己改 Prompt、自己評分、容易把評分系統玩壞的問題。"
series:
  name: "AI Tool of the Day"
  order: 39
---

> 🌏 [English version](/en/posts/daily/2026-09-29-tool-titration-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Titration |
| 類型 | MCP server |
| GitHub | [kaithoughtarchitect/titration](https://github.com/kaithoughtarchitect/titration) |
| Stars | 3 |
| 語言 | TypeScript |
| 授權 | Apache-2.0 |
| 安裝 | `docker compose up -d` 起 Postgres，`npm install && npm run setup` |

## 解決什麼問題

你是否讓 Agent 去修一個表現不好的 Prompt，結果它改一改、跑一跑、說「這次分數變高了」，但你根本不知道那個分數是不是真的可信？Agent 自己改 Prompt、自己出考題、自己打分，這套自我評分系統天生就會被 Goodhart's law 打臉——當一個指標變成目標，它就不再是好指標。更麻煩的是，Agent 通常是拿自己同一家供應商的模型當評審，等於球員兼裁判。

Titration 的做法是把「改 Prompt」和「評分」拆成兩件事，而且刻意讓評分權不在 Agent 自己手上。核心機制有三層：第一，評審面板必須來自三個不同供應商家族，Agent 自己那家永遠不能上場評分；分數不夠兩個供應商家族同意，這次評分直接判定無效，不計分。第二，凍結基準線（baseline）——rubric、輸出、評審在建立基準線那一刻就鎖死，之後每次比較都對照同一把尺，不會因為換了評審或換了題目就「感覺變好了」。第三，失敗被拆成九種來源，只有一種叫「system-under-test」才代表真的該去改 Prompt，其餘八種指向的是你的測試集、rubric、評審或程式碼本身出了問題——不是每次分數低都該動 Prompt。每一輪學到的東西會存成可搜尋的記憶卡片，讓下一次迭代不用從零開始。

適合場景：Prompt 反覆調整但不確定是不是真的變好、需要證明給團隊看「這次修改有效」；建 Agent 系統時想避免自我評分的迴音室效應；累積一組可重複使用的評測 rubric 和失敗案例庫，讓多個專案共用。

## 快速上手

### 安裝

```bash
git clone https://github.com/kaithoughtarchitect/titration.git
cd titration
docker compose up -d          # Postgres + pgvector on localhost:5432
npm install
cp .env.example .env          # 填入 OPENROUTER_API_KEY（最簡單的起手式）
npm run setup                 # 套 schema、載入 starter pack
```

需要 Node.js 22.11+、Docker，以及至少三個不同供應商家族的評審門路（OpenRouter 一把 key 就能涵蓋 9 個家族 12 個模型）。

接上 Claude Code：

```bash
claude mcp add titration -- npx tsx /absolute/path/to/titration/server/server.ts
```

### 基本用法

```
Agent 呼叫順序：
1. referee_panel_mint   — 首次建基準線時挑三個不同供應商家族的評審
2. establish_baseline   — 用目前 Prompt 跑一輪，凍結成基準線
3. goal_titrate         — 針對一個目標（例如「誤判為 urgent 的比例」）開始改 Prompt 迭代
4. verify               — 每次改動後對照基準線打分
5. classify_failure     — 分數沒進步時，判斷是不是該改的九種來源之一
```

一個實測案例：帳單客服單被錯判成 urgent 的比例，從 90% 降到 0%，只改了一次 Prompt（[worked example](https://github.com/kaithoughtarchitect/titration/tree/main/examples/ticket-triage)）。

### 進階用法

```bash
# 用訂閱制 CLI 當評審門路，不用另外付 API 費用
npm i -g @anthropic-ai/claude-code
npm i -g @openai/codex
# .env 設定 TITRATION_JUDGES=auto，讓 Titration 自動挑三個你有權限的供應商家族
# （訂閱制 CLI 優先，且永遠不含被測模型自己的家族）
```

## 與現有工具的比較

| | Titration | Agent 自評分（單一供應商） | 傳統 eval 框架（人工跑分） |
|---|---|---|---|
| 評審跨供應商強制隔離 | ✅ 至少兩家族同意才算分 | ❌ 球員兼裁判 | 視設定而定 |
| 基準線凍結，不會偷偷變寬鬆 | ✅ | ❌ | 部分（需自己維護） |
| 失敗自動分類是否該改 Prompt | ✅ 九種來源 | ❌ | ❌ 需人工判斷 |
| 迭代記憶跨專案累積 | ✅ 卡片可搜尋 | ❌ | ❌ |
| 免費起手 | ✅ 訂閱 CLI 可零額外成本 | — | 視工具而定 |

## 注意事項

- **今天才建立的全新專案**：只有 3 顆星，尚未經過社群長期驗證，導入前先跑一輪 quickstart 確認能起得來。
- **評分不是免費的**：一個 20 筆輸出的基準線配三個評審是 60 次評審呼叫，訂閱制 CLI 在用量額度內免費，OpenRouter 模型則按 token 計費，跑大型 rubric 前先估算成本。
- **需要自己養 Postgres**：資料存在自己的 Postgres + pgvector，適合願意自架、在意資料不出本機的團隊；不想維護資料庫的話這不是輕量選項。

## 今日收穫

多數「Agent 幫你改 Prompt」的工具卡在同一個結構性問題：讓 Agent 自己出題、自己改、自己打分，等於沒有制衡。Titration 沒有假裝能讓 Agent 更聰明，而是老實承認「評分的人不能是選手」，用跨供應商評審＋凍結基準線把這件事寫死在架構裡——比起追求更聰明的 Agent，先把裁判的公正性鎖死可能更值錢。

## 參考資料

- [kaithoughtarchitect/titration — GitHub](https://github.com/kaithoughtarchitect/titration)
- [Titration GitHub API metadata（license／stars／建立時間）](https://api.github.com/repos/kaithoughtarchitect/titration)
- [Titration README（原始檔）](https://raw.githubusercontent.com/kaithoughtarchitect/titration/main/README.md)
- [Ticket triage worked example](https://github.com/kaithoughtarchitect/titration/tree/main/examples/ticket-triage)
