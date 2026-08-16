---
name: daily-digest-benchmark
description: "Routine E: event-driven benchmark leaderboard shift detection for quidproquo.cc/daily. No ranking changes = no output."
---

# daily-digest-benchmark

偵測 AI Agent 相關 Benchmark 排行榜的顯著變動。事件驅動——沒有排名變動就不產出任何檔案。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 讀 watchlist 的 benchmarks 清單
cat src/data/agent-watchlist.json | jq '.benchmarks[]'

# Step 3: 執行「搜尋方法」偵測排名變動
# Step 4: 判斷：若無顯著變動 → 輸出「今日無 Benchmark 異動」&& exit 0
# Step 5: 對有變動的 benchmark 執行「詳情抓取」
# Step 6: 依「輸出格式」撰寫異動報告
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-benchmark-*.md
git commit -m "post(daily): benchmark ${TODAY}"
git push origin main
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Exa + Tavily **兩個都跑** | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | stealth_fetch 優先 → firecrawl backup | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（arxiv API、GitHub `gh` CLI） | 有 API 的來源不用搜尋工具 |

---



## 搜尋方法

### Step 3a：直接抓取排行榜頁面（主要方法）

用 firecrawl 抓取以下排行榜的最新狀態：

```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
formats: ["markdown"]
onlyMainContent: true
```

| 優先級 | Benchmark | URL | 掃描頻率 |
|---|---|---|---|
| **P1** | LMSYS Chatbot Arena | `https://lmarena.ai/?leaderboard` | 每日 |
| **P1** | SWE-bench Verified | `https://www.swebench.com/` | 每日 |
| **P2** | MorphLLM Leaderboard | `https://morphllm.com/leaderboard` | 每日 |
| **P2** | Open LLM Leaderboard | `https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard` | 每日 |
| **P3** | Terminal-Bench | `https://qaskills.sh/` | 每週 |

每個排行榜抓取後，提取前 10 名的模型名稱和分數。

### Step 3b：用 Exa 搜尋新聞信號（補充）

```
工具：mcp Exa → web_search_exa
numResults: 10
startPublishedDate: "{昨天的 ISO 日期}"
type: "auto"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `"benchmark" "leaderboard" "new SOTA" OR "state of the art" AI agent coding 2026` | SOTA 公告 |
| Q2 | `"SWE-bench" OR "Chatbot Arena" OR "LMSYS" new result score 2026` | 具體 benchmark 結果 |

### Step 3c：比對歷史快照

讀取上次的 benchmark 快照（若存在）：

```bash
# 快照存在 src/data/daily-signals/benchmark-snapshot.json
cat src/data/daily-signals/benchmark-snapshot.json 2>/dev/null || echo "{}"
```

比對當前抓取結果與快照，找出：
- 新進入前 10 名的模型
- 前 3 名的排名變動
- 分數顯著提升（> 2 個百分點）

每次抓取後更新快照：

```bash
# 寫入新快照（覆蓋舊的）
echo '{
  "date": "'"${TODAY}"'",
  "lmsys_top3": [...],
  "swebench_top3": [...],
  "morphllm_top3": [...]
}' > src/data/daily-signals/benchmark-snapshot.json
```

---

## 篩選規則

### Step 4：判斷是否有「顯著變動」

**觸發條件**（符合任一就寫報告）：
- 前 3 名有新模型進入
- 第 1 名易主
- 分數提升 > 2 個百分點（對同一模型系列）
- 新 benchmark 發佈（如 SWE-bench 出新版本）
- watchlist A1/A2 廠商的模型首次上榜

**不觸發**（跳過）：
- 分數微小波動（< 0.5 個百分點）
- 排名 10 名以外的變動
- 非 Agent 相關的 benchmark 變動（如純 NLP benchmark）
- 已報導過的同一模型同一分數

---

## 詳情抓取

### Step 5：取得變動的完整背景

對有變動的模型，搜尋更多背景：

```
工具：mcp Exa → web_search_exa
query: "{model_name} {benchmark_name} results analysis"
numResults: 5
startPublishedDate: "{一週前的 ISO 日期}"
```

需要收集：
- 模型的 official announcement（如有）
- 社群對結果的分析和質疑
- 是否有人指出方法論問題（data contamination、eval gaming）

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-benchmark-{benchmark-slug}.md`

如果多個 benchmark 同時異動，可合併成一篇：`${TODAY}-benchmark-multi.md`

### Frontmatter

```yaml
---
title: "Benchmark 異動｜{Benchmark 名稱}：{一句話變動}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, benchmark, daily, {benchmark-slug}]
lang: zh-TW
description: "一句話概述排名變動和意義"
tldr: "誰變第一 + 分數多少 + 這代表什麼"
series:
  name: "AI Benchmark Watch"
  order: N
---
```

### 內容結構（嚴格按以下順序）

```markdown
## 異動摘要

{2-3 句。回答：哪個 benchmark 變了？誰上來了？這代表什麼？}

## 排名變化

### {Benchmark 名稱} — {日期}

| 排名 | 模型/Agent | 分數 | 前次分數 | 變化 |
|---|---|---|---|---|
| 🥇 | {模型名} | {分數} | {前次} | {+/-} |
| 🥈 | {模型名} | {分數} | {前次} | {+/-} |
| 🥉 | {模型名} | {分數} | {前次} | {+/-} |
| 4 | ... | ... | ... | ... |
| 5 | ... | ... | ... | ... |

來源：[{Benchmark 官網}]({url}) · 快照日期：{TODAY}

{如有多個 benchmark 異動，重複此表}

## 分析：這次洗牌代表什麼

{3-4 段深入分析：

### 技術面
 1. 新冠軍靠什麼贏的？（模型大小？訓練方法？scaffold 設計？）
 2. 分數提升的模式是什麼？（漸進改善 vs 跳躍式突破）

### 方法論面
 3. 這個 benchmark 的結果可靠嗎？（有無 data contamination 風險？eval gaming？）
 4. ⚠️ 標注：自測結果 vs 獨立複現

### 產業面
 5. 對 Agent 開發者意味著什麼？（該換模型嗎？成本效益如何？）
 6. 對 watchlist 公司的競爭格局有什麼影響？}

## 今日收穫

{1-3 句認知差。}
```

---

## 完整範例

```markdown
---
title: "Benchmark 異動｜SWE-bench Verified：DeepSeek Coder V3 首次登頂，GPT-5 跌出前三"
date: 2026-08-11
category: daily
tags: [ai-agent, benchmark, daily, swe-bench, agent-coding]
lang: zh-TW
description: "DeepSeek Coder V3 以 74.1% 登頂 SWE-bench Verified，成為首個奪冠的中國模型；GPT-5 從第 2 跌到第 4"
tldr: "DeepSeek Coder V3 SWE-bench Verified 74.1%（前冠軍 Claude 4.5 Sonnet 72.3%）；這是首個非美國模型登頂 coding agent benchmark；GPT-5 從第 2 跌到第 4，被 Gemini Ultra 2 Coding 和 DeepSeek 超越"
series:
  name: "AI Benchmark Watch"
  order: 8
---

## 異動摘要

SWE-bench Verified 排行榜今天出現重大洗牌：DeepSeek Coder V3 以 74.1% 首次登頂，超越 Claude 4.5 Sonnet（72.3%）1.8 個百分點。這是 SWE-bench 創立以來首次由非美國廠商的模型拿到第一名。GPT-5 從第 2 名跌到第 4 名，被 Gemini Ultra 2 Coding 和 DeepSeek 同時超越。

## 排名變化

### SWE-bench Verified — 2026-08-11

| 排名 | 模型/Agent | 分數 | 前次分數 | 變化 |
|---|---|---|---|---|
| 🥇 | DeepSeek Coder V3 | 74.1% | 新上榜 | 🆕 |
| 🥈 | Claude 4.5 Sonnet | 72.3% | 72.3% (🥇) | ↓1 |
| 🥉 | Gemini Ultra 2 Coding | 72.0% | 70.5% (🥉) | — |
| 4 | GPT-5 | 71.8% | 71.8% (🥈) | ↓2 |
| 5 | Claude 4 Opus | 68.9% | 68.9% (4) | ↓1 |

來源：[swebench.com](https://www.swebench.com/) · 快照日期：2026-08-11

## 分析：這次洗牌代表什麼

### 技術面

DeepSeek Coder V3 的 74.1% 不是靠更大的模型。根據 DeepSeek 的[技術報告](https://api-docs.deepseek.com/news/coder-v3)，V3 使用了「多階段推理」架構：先用小模型做初步定位（找到相關檔案），再用大模型做精確修改。這跟 Claude Code 的 Agent 架構思路一致——模型能力只是一半，scaffold 設計是另一半。⚠️ DeepSeek 自測結果，SWE-bench 官方已啟動獨立複現。

### 方法論面

SWE-bench Verified 是目前最被信任的 coding agent benchmark——每個 task 都有人工驗證的 ground truth。但 74.1% 這個數字仍需謹慎解讀：DeepSeek 可能在 scaffold 設計上做了針對 SWE-bench 的最佳化（如特定的檔案搜尋策略），不代表在真實 codebase 有同樣的表現。

### 產業面

我認為這次最重要的訊號不是 DeepSeek 登頂，而是前 5 名的分差已經收斂到 5.2 個百分點以內（74.1% vs 68.9%）。一年前這個差距是 15+ 百分點。這意味著 coding agent 的差異化正在從「模型能力」轉向「scaffold 設計」和「開發者體驗」——你選哪個模型可能不再是最重要的決定。

## 今日收穫

之前以為 coding agent benchmark 主要反映模型的程式碼能力，但 DeepSeek 的多階段架構讓我意識到分數裡有很大一部分其實是 scaffold 的功勞。同一個模型搭不同 scaffold 可能差 10 個百分點——benchmark 排名排的不只是模型。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 排名變化表完整（前 5 名、含前次分數和變化方向）
- [ ] 分數精確到小數（如 74.1%，不寫 74%）
- [ ] 來源有排行榜官網 URL
- [ ] 自測結果標注 ⚠️
- [ ] 分析有技術面、方法論面、產業面三個層次
- [ ] benchmark-snapshot.json 已更新
- [ ] 「今日收穫」是認知差，不是摘要
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
