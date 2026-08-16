---
name: daily-digest
description: Produce daily digest content for quidproquo.cc/daily. Invoked by Claude Code routines to generate AI daily reports, Arxiv digests, GitHub digests, model cards, security alerts, benchmark updates, framework changelogs, tool recommendations, funding briefs, pricing updates, weekly reviews, and regional focus articles. Use when routine says 日報 / daily digest / arxiv digest / github digest / weekly review / model card / security alert / benchmark / framework update / tool recommendation / funding / pricing.
---

# daily-digest skill

產出 quidproquo.cc/daily 的每日學習內容。每種內容類型有獨立的 skill 和 routine，避免 context window 爆炸。

## 個別 Routine Skills

每個 routine 有獨立的 skill 檔案，routine 只需讀取對應的 skill 即可：

| Routine | Skill | 頻率 | 說明 |
|---|---|---|---|
| A | `daily-digest-arxiv` | 每日 | Arxiv cs.AI/cs.CL/cs.MA digest |
| B | `daily-digest-github` | 每日 | GitHub Trending AI/Agent digest |
| C | `daily-digest-model-card` | 事件驅動 | 新模型偵測 + 模型卡 |
| D | `daily-digest-security` | 事件驅動 | AI 資安警報 |
| E | `daily-digest-benchmark` | 事件驅動 | Benchmark 排行榜異動 |
| F | `daily-digest-framework` | 事件驅動 | 框架版本更新 |
| G | `daily-digest-tool` | 事件驅動 | 工具/MCP server 推薦 |
| H | `daily-digest-funding` | 事件驅動 | Series A+ 融資速報 |
| I | `daily-digest-pricing` | 事件驅動 | API 定價/sunset 追蹤 |
| J | `daily-digest-signals` | 每日 Stage 2 | 新聞掃描 → 中繼檔 JSON |
| K | `daily-digest-report` | 每日 Stage 3 | 日報彙整組裝 |
| L | `daily-digest-weekly` | 每週五 | 週回顧 + Watchlist 建議 |
| M | `daily-digest-region` | 每週五 | 區域焦點 |

## Routine 排程（台灣時間）

```
Stage 1（平行）TW 2:00-2:35
  A arxiv       2:03
  B github      2:07
  C model-card  2:11
  D security    2:15
  E benchmark   2:19
  F framework   2:23
  G tool        2:27
  H funding     2:31
  I pricing     2:35

Stage 2         TW 3:03
  J signals

Stage 3         TW 4:03
  K daily report

Stage 4（每週五）
  L weekly      TW 4:03
  M region      TW 4:33
```

## Series 對應

| type | Series name |
|---|---|
| daily | AI 日報 |
| arxiv | AI Arxiv Digest |
| github | AI GitHub Digest |
| model-card | AI Model Tracker |
| security | AI Security Alert |
| benchmark | AI Benchmark Watch |
| framework | AI Framework Changelog |
| tool | AI Tool of the Day |
| funding | AI Funding |
| pricing | AI Pricing Watch |
| weekly | AI 週回顧 |
| region | AI Region Focus |

## 共通品質規則

1. **來源必附**：每個事實主張都要有連結
2. **數字要精確**：不四捨五入成「約」
3. **觀點標記**：分析段落用「我認為」開頭
4. **不寫沒查的**：查不到來源就不寫
5. **論文標注限制**：未複現結果加 ⚠️
6. **MIS 框架意識**：觀察段落有意識使用 IT 管理理論
7. **認知差必寫**：每篇結尾「我今天學到什麼」不得省略
8. **交叉驗證**：同一事件至少兩個獨立來源
9. **一手優先**：官方 Blog > 新聞 > 社群

## 共通 Frontmatter

所有類型共用：
- `category: daily`
- `lang: zh-TW`
- `series.name` 依上方對應表
- 結尾必寫「我今天學到什麼」

## 參考資料

- Watchlist：`src/data/agent-watchlist.json`（293 家公司 + 28 個 Benchmark + 93 個來源）
- 中繼檔 schema：`src/data/daily-signals/schema.ts`
- 完整規格：`docs/daily-digest-spec.md`
- Routine 設定：`docs/daily-digest-routines.json`
