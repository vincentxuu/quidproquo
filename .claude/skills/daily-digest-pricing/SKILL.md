---
name: daily-digest-pricing
description: "Routine I: event-driven AI API pricing/sunset tracking for quidproquo.cc/daily. No pricing change = no output."
---

# daily-digest-pricing

追蹤 AI API 定價變動、促銷窗口和 API sunset。事件驅動——沒有定價變動就不產出。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

# Step 2: 冪等檢查
ls src/content/posts/daily/${TODAY}-pricing-*.md 2>/dev/null && echo "已產出" && exit 0

# Step 3: 讀 watchlist（section A1/A2 的模型廠商名單）
cat src/data/agent-watchlist.json | jq '[.companies[] | select(.section == "A1" or .section == "A2") | .name]'

# Step 4: 執行「搜尋方法」檢查是否有定價變動
# Step 5: 執行「篩選規則」
# Step 6: 若無定價變動 → 輸出「今日無定價變動」結束
# Step 7: 依「輸出格式」撰寫文章
# Step 8: 提交
git add src/content/posts/daily/${TODAY}-pricing-*.md
git commit -m "post(daily): pricing tracking ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Groundlane `web_search` | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | Groundlane `web_fetch` | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（arxiv API、GitHub `gh` CLI） | 有 API 的來源不用搜尋工具 |

### Groundlane 工具契約

公開網頁研究與抓取一律使用 Groundlane MCP：`web_search` 找候選來源、`web_fetch` 讀已知 URL 或全文、`web_extract` 做 selector/table 欄位抽取。若最外層 tool list 沒看到 Groundlane，先檢查完整 callable tool inventory（含 deferred MCP tools）；仍沒有就回報 blocker。若 Groundlane 已掛載但 authorization 失敗，回報 blocker，並請使用者依 Groundlane free API / free tier 使用方式完成授權或修正 connector credential。不要自行改用 `web.run`、WebFetch、Playwright scraping、Exa、Tavily、Firecrawl、Jina、Linkup、`stealth_fetch`、`web-fetch` 或 `fetch_page`。

---



## 搜尋方法

### Step 4a：用 Groundlane `web_search` 搜尋定價變動新聞（跑 3 組查詢）

```
工具：Groundlane MCP → web_search
每組設定：
  max_results: 10
  published_after: "{昨天 ISO 日期}"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `AI API pricing change model cost update 2026` | 定價變動 |
| Q2 | `AI API sunset deprecation end-of-life 2026` | API 下架/停用 |
| Q3 | `AI model pricing promotion discount free tier 2026` | 促銷和免費方案 |

### Step 4b：檢查 explainx.ai（模型定價追蹤站）

```
工具：Groundlane MCP → web_fetch
url: "https://explainx.ai/llm-pricing"
format: "markdown"
```

比對抓取結果和前一天的定價記錄（如果有的話），找出變動。

### Step 4c：抽查重點廠商官方定價頁（每天輪流抽查 2-3 家）

以下廠商的定價頁面用 Groundlane `web_fetch` 抓取，和已知定價比對：

| 廠商 | 定價頁 URL | 輪流日 |
|---|---|---|
| Anthropic | `https://docs.anthropic.com/en/docs/about-claude/models` | 一、四 |
| OpenAI | `https://openai.com/api/pricing/` | 一、四 |
| Google | `https://ai.google.dev/pricing` | 二、五 |
| Mistral | `https://mistral.ai/products/la-plateforme#pricing` | 二、五 |
| Cohere | `https://cohere.com/pricing` | 三、六 |
| AWS Bedrock | `https://aws.amazon.com/bedrock/pricing/` | 三、六 |
| Together AI | `https://www.together.ai/pricing` | 日 |

```
工具：Groundlane MCP → web_fetch
url: "{定價頁 URL}"
format: "markdown"
```

### Step 4d：交叉驗證

定價變動必須從至少 2 個來源確認：
- 來源 1：官方定價頁面或官方公告
- 來源 2：新聞報導或 explainx.ai 記錄

**只有社群討論（Reddit/X/HN）的傳聞不算確認**。

---

## 篩選規則

### Step 5：判斷是否值得寫

| 條件 | 動作 |
|---|---|
| 主要模型的定價變動（Claude/GPT/Gemini/Mistral） | ✅ 寫 |
| API sunset / deprecation 公告 | ✅ 寫 |
| 限時促銷窗口（如「$2 input 促銷至 8/31」） | ✅ 寫 |
| 新增免費方案或用量政策變更 | ✅ 寫 |
| watchlist 公司的定價變動 | ✅ 寫 |
| 小型/利基模型的微調定價 | ❌ 跳過 |
| 非模型 API 的價格變動（如 SaaS 訂閱價） | ❌ 跳過（除非是 Cursor/Codex 等 Agent 工具） |
| 企業方案的客製定價 | ❌ 跳過 |

**同一天多個定價變動**：合併成一篇，除非涉及不同廠商的重大變動才分開。

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-pricing-{slug}.md`

`slug` 規則：
- 單一廠商：`anthropic-claude-sonnet-price-cut`
- 多個廠商：`multi-vendor-pricing-changes`
- API sunset：`openai-assistants-api-sunset`

### Frontmatter

```yaml
---
title: "定價追蹤｜{一句話概述}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, pricing, daily, {vendor-slug}]
lang: zh-TW
description: "一句話概述最重要的定價變動"
tldr: "{廠商}的{模型/API}從{舊價}降到{新價}，降幅{X%}，生效日{日期}。{一句話影響}。"
series:
  name: "AI Pricing Watch"
  order: N
---
```

### 內容結構（嚴格按以下順序和格式）

```markdown
## 變更摘要

{2-3 句概述。不是列表，是一段有觀點的文字。回答「這次變動代表什麼趨勢」。}

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| {模型名} Input | ${X}/1M tokens | ${Y}/1M tokens | {↓Z%} | {YYYY-MM-DD} |
| {模型名} Output | ${X}/1M tokens | ${Y}/1M tokens | {↓Z%} | {YYYY-MM-DD} |
| {Cached Input}（如有） | ${X}/1M tokens | ${Y}/1M tokens | {↓Z%} | {YYYY-MM-DD} |
| {Batch API}（如有） | ${X}/1M tokens | ${Y}/1M tokens | {↓Z%} | {YYYY-MM-DD} |

## 成本試算

{用一個具體的使用場景計算前後成本差異。}

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens）

| | 舊定價 | 新定價 | 月省 |
|---|---|---|---|
| Input 成本/月 | ${X} | ${Y} | ${Z} |
| Output 成本/月 | ${X} | ${Y} | ${Z} |
| **合計** | **${X}** | **${Y}** | **${Z}（↓{N%}）** |

## 對開發者/企業的影響

{2-3 段分析：}

### 誰最受益

{哪類應用或團隊受益最大？為什麼？}

### 競爭格局影響

{這個定價變動怎麼改變各廠商的價格競爭力排名？附簡要的價格排名表。}

### 行動建議

{對正在選型的開發者，具體建議。如「如果你的 batch 用量大，現在切換到 X 可以省 Y%」。}

## 時效提醒（如有促銷/sunset）

{如果有限時促銷：}
⏰ **促銷到期日**：{日期}。到期後恢復原價 ${X}。

{如果有 API sunset：}
⚠️ **停用日期**：{日期}。請在此之前遷移至 {替代方案}。遷移指南：{連結}。

## 今日收穫

{1-2 句認知差。}

## 來源

- [{來源 1}]({URL})
- [{來源 2}]({URL})
```

---

## 完整範例

```markdown
---
title: "定價追蹤｜OpenAI GPT-5 定價大砍，Input 降 60%"
date: 2026-08-17
category: daily
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 將 GPT-5 input 定價從 $10 降至 $4/1M tokens，output 從 $30 降至 $16，是 GPT-4o 發布以來最大幅降價"
tldr: "GPT-5 input 從 $10 降到 $4/1M tokens（↓60%），output 從 $30 降到 $16（↓47%），8/20 生效。降價後 GPT-5 和 Claude Sonnet 5 的 input 定價相同（都是 $4），output 仍貴 60%（$16 vs $10）。"
series:
  name: "AI Pricing Watch"
  order: 2
---

## 變更摘要

OpenAI 宣布 GPT-5 全面降價，input 降 60%、output 降 47%，是 GPT-4o 發布以來幅度最大的一次。這不是促銷——是永久定價調整，8/20 生效。降價後 GPT-5 的 input 價格和 Claude Sonnet 5 持平（$4/1M），但 output 仍貴 60%。對 Agent 開發者來說，GPT-5 終於從「貴到只能 demo」進入「可以跑生產」的區間。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-5 Input | $10.00/1M tokens | $4.00/1M tokens | ↓60% | 2026-08-20 |
| GPT-5 Output | $30.00/1M tokens | $16.00/1M tokens | ↓47% | 2026-08-20 |
| GPT-5 Cached Input | $5.00/1M tokens | $2.00/1M tokens | ↓60% | 2026-08-20 |
| Batch API Input | $5.00/1M tokens | $2.00/1M tokens | ↓60% | 2026-08-20 |
| Batch API Output | $15.00/1M tokens | $8.00/1M tokens | ↓47% | 2026-08-20 |

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input + 500 output tokens）

| | 舊定價 | 新定價 | 月省 |
|---|---|---|---|
| Input 成本/月 | $4,500 | $1,800 | $2,700 |
| Output 成本/月 | $4,500 | $2,400 | $2,100 |
| **合計** | **$9,000/月** | **$4,200/月** | **$4,800（↓53%）** |

## 對開發者/企業的影響

### 誰最受益

高 output 比例的應用受益最大——Agent 的特性是「想很多、說很多」（長 chain-of-thought + 工具呼叫結果），output 占比通常是 input 的 2-3 倍。47% 的 output 降價直接影響 Agent 的營運成本。

### 競爭格局影響

降價後的主要模型價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Claude Haiku 4.5 | $0.80 | $4.00 | 最便宜的高能力模型 |
| GPT-4.1 mini | $0.40 | $1.60 | 最便宜的 |
| Gemini 2.5 Flash | $0.15 | $0.60 | Google 價格戰 |
| **Claude Sonnet 5** | **$4.00** | **$10.00** | — |
| **GPT-5（新價）** | **$4.00** | **$16.00** | Input 持平 Sonnet，Output 貴 60% |
| Claude Opus 5 | $15.00 | $75.00 | 最貴 |

### 行動建議

- 如果你目前用 Claude Sonnet 5 跑生產：GPT-5 降價後 input 持平但 output 仍貴 60%，暫時不需要切換
- 如果你在用 Batch API：GPT-5 batch 降到 $2/$8，比 Sonnet 的 batch（$2/$5）output 貴但 input 持平，看你的 output 比例決定
- 如果你需要最強推理能力且預算夠：GPT-5 降到可接受區間，值得重新跑 eval 對比

## 今日收穫

之前以為模型定價的競爭主要看 input（因為 RAG 場景 input 遠大於 output），但 Agent 場景完全相反——Agent 的 output 比 input 多 2-3 倍（長 chain-of-thought + 工具呼叫回應），所以 output 定價才是 Agent 經濟學的關鍵變數。OpenAI output 只降 47% 而 input 降 60%，正好說明他們知道 output 的利潤空間更大。

## 來源

- [OpenAI Slashes GPT-5 Pricing by Up to 60%](https://openai.com/blog/gpt-5-pricing-update)
- [OpenAI cuts GPT-5 prices in latest AI price war salvo](https://techcrunch.com/2026/08/17/openai-gpt-5-price-cut/)
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 前後對照表完整（input/output/cached/batch 各項都有）
- [ ] 定價精確到小數——`$4.00/1M tokens` 不是 `約 4 美元`
- [ ] 成本試算用具體場景，有 input/output 分項
- [ ] 競爭格局有主要模型的價格排名對照表
- [ ] 行動建議具體到「如果你在用 X：做 Y」
- [ ] 促銷有到期日提醒 ⏰，sunset 有停用日和遷移連結 ⚠️
- [ ] 至少 2 個來源確認（官方 + 新聞）
- [ ] 「今日收穫」是認知差
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
