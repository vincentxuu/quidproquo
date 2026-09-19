---
title: "【專案篇】我們怎麼做 deep-research skill"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, skill, Groundlane, project, architecture]
lang: zh-TW
tldr: "這是專案自己的 deep-research skill 設計全公開。核心選擇：只用 Groundlane MCP 做為網頁工具、嚴格的來源品質分級（A/B/C/D）、研究完交 post skill 發文。不是最強的，但是最適合我們的。"
description: "全面拆解專案內的 deep-research skill：Groundlane MCP 工具邊界、7 步驟 workflow、來源品質 A/B/C/D 分級、與 post skill 的發文串接、以及為什麼這樣設計取捨。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 13
---

前面 12 篇看的是別人的研究。這篇看**自己**。

專案的 `deep-research` skill 已經在 `2026-03` 後持續迭代到現在。這篇把它從裡到外拆開：設計哲學、架構選擇、工具邊界、以及為什麼這樣做。

## 核心設計哲學

### 工具邊界：嚴格只用 Groundlane

這是專案 skill 最獨特的設計：

> **公開網頁研究一律只用 Groundlane MCP**（`web_search` / `web_fetch` / `web_extract`）。不使用 Tavily、Exa、Firecrawl、Jina、Linkup。

為什麼？

1. **可控性**：Groundlane 是自己維護的 MCP server，可以控制 providers、限流、授權
2. **一致性**：所有研究走同一個管道，行為可預測
3. **成本**：自主持有 providers key，不用為每個工具付費
4. **可審計**：所有請求經過單一入口，方便除錯

Groundlane 本身：
- 作者：vincentxuu
- 類型：vendor-neutral remote MCP server
- Providers：Tavily、Exa、Parallel、Browserbase、Brave、Firecrawl、SerpApi、Linkup、Serper、You.com
- 部署：Cloudflare Workers + Containers

### 輸出目標：研究備用 → post 發文

不是所有研究都要發文。專案 skill 區分：

| 輸出 | 存放 | 用途 |
|---|---|---|
| Research note | `.research/<YYYY-MM-DD>-<slug>.md` | 備用，不入版控 |
| 發文 | `src/content/posts/<category>/` | 正式文章 |

流程：deep-research → research note → post skill → 雙語文章

這意味著研究階段不會污染版控，只有確認要發文的才入版控。

## 7 步驟 Workflow

```
0. 多案例研究（如果題目是系列文/橫向比較）
1. 拆研究子問題
2. 蒐集（每子問題 ≥ 2 來源）
3. 盤點讀取程度
4. 交叉驗證
5. 萃取結構
6. 產出 research note
7. 交接（給 post skill 發文）
```

### 關鍵紀律

1. **先拆子問題再搜尋**——錯題比錯答更貴
2. **主要來源帶全文**——不帶 query（query 只回片段）
3. **交叉表只放「來源說了什麼」**——推論另標
4. **數字要對照條件**——沒有對照條件的效果量不能用
5. **衝突的事實列出來**——不要選邊

## 來源品質分級

### 通用來源分級

| 等級 | 定義 | 範例 |
|---|---|---|
| **A — 官方一手** | 製造者/維護者直接發佈 | 官方 docs、release notes、GitHub README |
| **B — 一手作者** | 作者本人非正式發佈 | 作者 X/Mastodon、個人 blog、演講 |
| **C — 高品質二手** | 有獨立查證的第三方 | HN 高分串、知名 blog 附實測 |
| **D — 低品質二手** | 無獨立查證 | Medium 抄稿、SEO blog、AI 摘要站 |

### 學術論文品質判斷

**硬指標**：會議層級（NeurIPS/ICLR/ACL）、引用數、機構聲望
**軟指標**：有無跑真實 benchmark、方法可重現性、被後來工作引用、survey 的分類洞察力

### 論文品質分級

- **A 級**：tier-1 會議接收、引用 >200 且有開源 code、知名 AI lab 且有實驗數據
- **B 級**：tier-2 會議、引用 100+、知名機構
- **C 級**：arXiv preprint、引用 <50

## 搭配的 Skill 生態

| Skill | 角色 |
|---|---|
| `deep-research` | 核心研究 workflow |
| `research-selection` | 多案例選取（母群→覆蓋矩陣→偏誤標註） |
| `post` | 研究完發文（雙語） |
| `post-review` | 發文前自審 |
| `post-verify` | 事實層驗證 |
| `series-curriculum-design` | 系列文規劃 |

這個生態形成一個 pipeline：**研究 → 選取 → 發文 → 審查 → 驗證**。

## 設計取捨的反思

### 為什麼不做對抗驗證？

外部 skill（如 jamoeight v2、tolmachevmaxim）幾乎都有對抗驗證（Optimist/Pessimist/Fact-Checker）。我們沒有。

原因：
- 對抗驗證需要多個模型，增加成本
- 交叉驗證（≥2 獨立來源）在大多數情況下已經夠用
- 對抗驗證適合「爭議性強」的命題，但 deep research 更多是「綜合型」任務

### 為什麼不做持久化知識庫？

外部 skill（如 hyperresearch）有 SQLite 索引的持久化研究知識庫。我們每次獨立。

原因：
- 持久化需要儲存和管理，複雜度上升
- 專案的研究多為一次性任務，不需要跨任務檢索
- 如果未來需要，可以透過 `.research/` 目錄做基本檢索

### 為什麼綁定 Groundlane？

這是最有爭議的設計。外部 skill 廣泛使用 Tavily、Exa、Serper 等多個工具。

原因已在前面說明（可控性、一致性、成本、可審計）。但代價是：如果 Groundlane 出問題，整個研究 pipeline 會卡住。

## 改進方向

1. **對抗驗證模組**：加入 Pessimist/Fact-Checker agent
2. **持久化知識庫**：`.research/source-registry.jsonl` 跨任務索引
3. **MCP 擴展**：除了 Groundlane，增加 GitHub、arXiv、Hugging Face 專用工具
4. **自動化**：從 research note 到 post 的半自動化

## 參考資料

- [deep-research skill 定義](/.agents/skills/deep-research/SKILL.md) — 專案內的 skill 定義。
- [Groundlane GitHub](https://github.com/vincentxuu/groundlane) — Groundlane MCP server。
- [series-curriculum-design skill](/.agents/skills/series-curriculum-design/SKILL.md) — 系列文規劃框架。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
