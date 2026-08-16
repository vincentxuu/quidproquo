---
name: daily-digest
description: Produce daily digest content for quidproquo.cc/daily. Invoked by Claude Code routines to generate AI Agent daily reports, Arxiv digests, GitHub digests, model cards, security alerts, benchmark updates, framework changelogs, tool recommendations, funding briefs, pricing updates, weekly reviews, and regional focus articles. Use when routine says 日報 / daily digest / arxiv digest / github digest / weekly review / model card / security alert / benchmark / framework update / tool recommendation / funding / pricing.
---

# daily-digest skill

產出 quidproquo.cc/daily 的每日學習內容。每種內容類型由獨立的 routine 呼叫，避免 context window 爆炸。

## 內容類型與觸發

routine 呼叫時會指定 `type` 參數：

| type | 說明 | 頻率 | 主要來源 |
|---|---|---|---|
| `daily` | AI Agent 日報 | 每日 | 中繼檔 + 新聞源 |
| `arxiv` | Arxiv Digest | 每日 | arxiv API |
| `github` | GitHub Digest | 每日 | GitHub API |
| `model-card` | 模型卡 | 事件驅動 | HuggingFace + 官方 Blog |
| `security` | 資安警報 | 事件驅動 | Unit 42 / The Hacker News / AI Incident DB |
| `benchmark` | Benchmark 異動 | 事件驅動 | LMSYS / SWE-bench / MorphLLM |
| `framework` | 框架更新 | 事件驅動 | GitHub releases |
| `tool` | 工具推薦 | 事件驅動 | Product Hunt / GitHub |
| `funding` | 融資速報 | 事件驅動 | Crunchbase / BusinessWire |
| `pricing` | 定價追蹤 | 事件驅動 | explainx.ai / 官方公告 |
| `weekly` | 週回顧 | 每週五 | 本週所有產出 |
| `region` | 區域焦點 | 每週 | 區域來源 |

## 執行步驟

### 所有類型共通

1. **確認日期**：`date` 用今天的日期
2. **確認語言**：預設 `zh-TW`
3. **輸出路徑**：`src/content/posts/daily/YYYY-MM-DD-{type}-{slug}.md`
4. **category**：固定為 `daily`
5. **series**：依類型對應（見下表）
6. **結尾必寫「我今天學到什麼」**：1-3 句認知差，不是摘要

### Frontmatter 模板

```yaml
---
title: "{根據類型和日期產生}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, {type-specific tags}]
lang: zh-TW
description: "一句話概述"
tldr: "3-5 行重點"
series:
  name: "{對應 series name}"
  order: {遞增}
---
```

### Series 對應

| type | Series name |
|---|---|
| daily | AI Agent 日報 |
| arxiv | AI Agent Arxiv Digest |
| github | AI Agent GitHub Digest |
| model-card | AI Model Tracker |
| security | AI Security Alert |
| benchmark | AI Benchmark Watch |
| framework | AI Framework Changelog |
| tool | AI Tool of the Day |
| funding | AI Agent Funding |
| pricing | AI Pricing Watch |
| weekly | AI Agent 週回顧 |
| region | AI Region Focus |

## 各類型內容結構

詳細結構見 `docs/daily-digest-spec.md` 的「內容結構」章節。以下是各類型的簡要格式：

### type: daily（AI Agent 日報）

```markdown
## 今日重點摘要
3-5 bullet

## 廠商動態
按公司分小節

## 模型與基礎設施
新模型、定價、Benchmark

## 定價與 API 生命週期（有事才出現）

## Coding Agent 賽道（有變化才出現）

## 工具與生態

## 技術進展

## 商業案例 / 融資 / 併購

## 資安事件與防禦技術（有事才出現）

## 法規與治理（有事才出現）

## 中國 / 台灣 / 日韓動態

## 觀察與洞察
用 MIS 框架分析（交易成本、互補資產、網路效應、五力、轉換成本）

## 我今天學到什麼

## 參考連結
```

### type: arxiv（Arxiv Digest）

```markdown
## 今日總覽

## 讀這篇前該知道的詞
| 詞 | 白話解釋 |

## 論文一｜{標題}
作者 / arxiv ID / 連結
### TL;DR
### Read Priority（必讀/略讀/跳過）
### 領域背景
### 中階導讀（問題/方法/為什麼重要）
### 深入要點
### Reviewer 一句話評
### Take-away

## 我今天學到什麼
```

### type: github（GitHub Digest）

```markdown
## 今日亮點

## Trending Repos
### {repo-name} ⭐ {stars} (+{today})
- 是什麼
- 為什麼值得看
- 技術棧

## Notable Releases

## 我今天學到什麼
```

### type: model-card（模型卡）

```markdown
## 模型資訊
| 項目 | 值 |
|---|---|
| Model ID | |
| 廠商 | |
| 參數量 | |
| Context Window | |
| Input 定價 (USD/1M tokens) | |
| Output 定價 (USD/1M tokens) | |
| 開源 | 是/否（授權） |
| 發布日 | |

## 能力亮點

## Benchmark 表現

## 與前代/競品比較

## 對 Agent 開發的意義

## 我今天學到什麼
```

### type: security（資安警報）

```markdown
## 事件概述

## 攻擊面分析

## 防禦做法
（每次寫事件同時寫防禦）

## 影響範圍

## 我今天學到什麼
```

### type: benchmark（Benchmark 異動）

```markdown
## 異動摘要

## 排名變化
| 排名 | 模型/Agent | 分數 | 變化 |

## 分析：這次洗牌代表什麼

## 我今天學到什麼
```

### type: framework（框架更新）

```markdown
## 版本資訊
| 項目 | 值 |
|---|---|
| 框架 | |
| 版本 | |
| 發布日 | |

## 重要變更

## Breaking Changes

## 遷移指南（如有）

## 我今天學到什麼
```

### type: tool（工具推薦）

```markdown
## 工具資訊
| 項目 | 值 |
|---|---|
| 名稱 | |
| 類型 | MCP server / CLI / SDK / ... |
| GitHub | |
| 授權 | |

## 解決什麼問題

## 怎麼用（快速上手）

## 我今天學到什麼
```

### type: funding（融資速報）

```markdown
## 融資資訊
| 項目 | 值 |
|---|---|
| 公司 | |
| 輪次 | |
| 金額 | |
| 領投 | |
| 跟投 | |
| 估值 | |

## 公司做什麼

## 這筆錢代表什麼趨勢

## 我今天學到什麼
```

### type: pricing（定價追蹤）

```markdown
## 變更摘要

## 前後對照
| 項目 | 舊 | 新 | 生效日 |

## 對開發者/企業的影響

## 我今天學到什麼
```

### type: weekly（週回顧）

```markdown
## 本週最重要的 5 件事

## 本週認知更新
「之前以為 X，現在知道 Y」

## 企業落地觀察（用 MIS 框架）

## 下週值得追蹤的

## Watchlist 更新建議
- 🆕 建議加入：
- ⚠️ 考慮移除：
- ✅ 無變動：

## 本週新創雷達
```

### type: region（區域焦點）

```markdown
## 區域：{中國/台灣/日韓/歐洲/...}

## 本週重要動態

## 深度分析（用 MIS 框架）

## 對台灣創業者的啟示

## 我今天學到什麼
```

## 品質規則

1. **來源必附**：每個事實主張都要有連結
2. **數字要精確**：不四捨五入成「約」
3. **觀點標記**：分析段落用「我認為」開頭
4. **不寫沒查的**：查不到來源就不寫
5. **論文標注限制**：未複現結果加 ⚠️
6. **MIS 框架意識**：觀察段落有意識使用 IT 管理理論
7. **認知差必寫**：每篇結尾「我今天學到什麼」不得省略
8. **交叉驗證**：同一事件至少兩個獨立來源
9. **一手優先**：官方 Blog > 新聞 > 社群

## Watchlist 參考

掃描時比對 `src/data/agent-watchlist.json`（如存在）或 `docs/daily-digest-spec.md` 的公司 Watchlist 章節。

## 完整規格

所有細節（來源清單、Benchmark 清單、Watchlist 230+ 家、新創雷達機制、自動維護機制）見 `docs/daily-digest-spec.md`。
