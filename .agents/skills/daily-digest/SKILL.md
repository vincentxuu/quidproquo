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
| C | `daily-digest-model-card` | 事件驅動 | 新模型偵測 + 模型卡（HF API + 搜尋引擎雙訊號源，兩層過濾去重） |
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
10. **台灣讀者位置**：zh-TW 版不能只是英文 AI 新聞摘要；每篇至少有一處明確回答「這對台灣／繁中 builder、台灣企業導入、台灣市場或台灣工作現場的判斷是什麼」

### 台灣語氣參考

日報的台灣感不是把每則新聞都改成台灣案例，也不是多寫幾次「台灣」。判準是讀者位置：

- 國際模型、框架、API、融資新聞：寫出它對台灣開發者、產品團隊、企業導入或繁中市場的採用判斷。
- 台灣新聞：優先用台灣來源與硬證據，例如 iThome、INSIDE、數位時代、TechOrange、政府資料、公司公告、採購資料、法規或學研機構。
- 沒有台灣直接事件時：至少在「觀察與洞察」「今日收穫」「明日關注」其中一處落回台灣讀者可採取的判斷，不硬塞假台灣案例。
- 不要讓 zh-TW 版長得像內部 memo：少用「事件 A / 影響 / 證據」標籤，改成「發生了什麼 → 為什麼重要 → 對台灣／繁中 builder 的判斷」。

參考資料：`.research/2026-08-29-taiwan-article-sources-for-tone.md`、`.research/2026-08-29-quidproquo-voice-reference-set.md`、`.agents/skills/post/references/taiwan-voice-structure.md`。

## 共通 Frontmatter

所有類型共用：
- `category: daily`
- `series.name` 依上方對應表
- 結尾必寫「我今天學到什麼」

## 雙語要求

每篇 daily 文章必須同時產出 zh-TW 和 en 兩個版本：

1. 先寫 zh-TW 版（`lang: zh-TW`），檔名 `YYYY-MM-DD-<slug>.md`
2. 接著寫 en 版（`lang: en`），檔名 `YYYY-MM-DD-<slug>-en.md`
3. 兩篇加雙向語言連結（同 `post-translate` skill 的格式）
4. en 版是改寫不是機翻——技術名詞保留原文，行文語氣自然
5. 兩篇同時 commit

這是站規，不是選配。英文版 daily 頁面 (`/en/daily`) 靠 `lang: en` 過濾文章，沒有英文版就是空頁面。

## 參考資料

- Watchlist：`src/data/agent-watchlist.json`（293 家公司 + 28 個 Benchmark + 93 個來源）
- 中繼檔 schema：`src/data/daily-signals/schema.ts`
- 完整規格：`docs/daily-digest-spec.md`
- Routine 設定：`docs/daily-digest-routines.json`
