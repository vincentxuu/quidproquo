---
name: daily-digest-model-card
description: "Routine C: event-driven new AI model detection and model card generation for quidproquo.cc/daily. No new model = no output."
---

# daily-digest-model-card

偵測新 AI 模型發佈並產出模型卡。事件驅動——沒有新模型就不產出任何檔案。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 讀 watchlist 找出 A1/A2 的模型廠商清單
cat src/data/agent-watchlist.json | jq '.companies[] | select(.section == "A1" or .section == "A2") | .name'

# Step 3: 執行「搜尋方法」偵測新模型
# Step 4: 判斷：若無新模型 → 輸出「今日無新模型」&& exit 0
# Step 5: 對每個新模型執行「詳情抓取」
# Step 6: 依「輸出格式」撰寫模型卡
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-model-*.md
git commit -m "post(daily): model card ${TODAY}"
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

### Step 3a：用 Exa + Tavily 合併搜尋新模型公告（，跑 3 組查詢）

```
工具：mcp Exa → web_search_exa
每組查詢設定：
  numResults: 10
  startPublishedDate: "{昨天的 ISO 日期}"
  type: "auto"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `"new AI model" OR "model release" OR "model announcement" Claude OR GPT OR Gemini OR Llama` | 大廠模型發佈 |
| Q2 | `site:huggingface.co "new model" OR "trending" agent OR reasoning OR coding 2026` | HuggingFace 新模型/trending |
| Q3 | `"AI model launch" OR "foundation model" Mistral OR Cohere OR DeepSeek OR Qwen` | 非美國大廠（歐洲/中國） |

### 注意：Tavily 與 Exa 平行執行

```
工具：mcp Tavily → tavily_search
query: "new AI model released today 2026"
days: 1
maxResults: 5
```

### Step 3c：檢查大廠官方 blog（用 firecrawl）

只有在 Step 3a/3b 有初步信號時才做（避免每天空跑 20 個 blog）。
針對信號中提到的廠商，抓其官方 blog 確認是否有正式公告：

```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
url: "{vendor blog URL}"
formats: ["markdown"]
onlyMainContent: true
```

| 廠商 | Blog URL |
|---|---|
| Anthropic | https://www.anthropic.com/news |
| OpenAI | https://openai.com/blog |
| Google | https://blog.google/technology/ai/ |
| Meta | https://ai.meta.com/blog/ |
| Mistral | https://mistral.ai/news/ |
| DeepSeek | https://api-docs.deepseek.com/news |

### Step 3d：判斷是否有新模型

**觸發條件**（符合任一）：
- 搜尋結果中出現 watchlist A1/A2 廠商的新模型名稱
- HuggingFace 出現新的 foundation model（> 1B 參數）
- 官方 blog 有模型公告文章

**不觸發**（跳過）：
- 模型微調版本（fine-tune、adapter）——除非有重大性能提升
- API 功能更新但不是新模型（如新增 function calling 支援）
- 開源權重但架構未變（如 Llama 3 的 GGUF 轉換版）

---

## 詳情抓取

### Step 5：取得模型完整資訊

**官方公告頁**（firecrawl）——提取：
- 模型名稱 / Model ID（API 呼叫用的 ID，如 `claude-4-opus-20260815`）
- 參數量
- Context Window
- 支援的模態（text / vision / audio / code）

**定價頁**（firecrawl 或 curl）——提取精確定價：

```
# Anthropic
firecrawl_scrape url: "https://www.anthropic.com/pricing"

# OpenAI
firecrawl_scrape url: "https://openai.com/api/pricing/"

# Google
firecrawl_scrape url: "https://ai.google.dev/pricing"
```

定價必須精確到小數（如 `$3.00 / 1M input tokens`），**不可寫「約」**。

**Benchmark 數據**——從公告中提取，或搜尋：
```
工具：mcp Exa → web_search_exa
query: "{model_name} benchmark results MMLU SWE-bench"
numResults: 5
```

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-model-{model-slug}.md`

model-slug 規則：廠商-模型名稱，kebab-case（如 `anthropic-claude-4-5`、`openai-gpt-5`）

### Frontmatter

```yaml
---
title: "模型卡｜{Model Name}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, model-release, daily, {vendor-slug}]
lang: zh-TW
description: "一句話概述新模型的定位和最大亮點"
tldr: "模型名稱、核心數字（context window、定價、關鍵 benchmark）、對 Agent 開發的意義"
series:
  name: "AI Model Tracker"
  order: N
---
```

### 內容結構（嚴格按以下順序和格式）

```markdown
## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | {API 呼叫用的完整 ID} |
| 廠商 | {公司名稱} |
| 參數量 | {如 200B，未公開寫「未公開」} |
| Context Window | {如 1M tokens} |
| Input 定價 (USD/1M tokens) | {精確到小數，如 $3.00} |
| Output 定價 (USD/1M tokens) | {精確到小數，如 $15.00} |
| 開源 | {是（授權名稱）/ 否} |
| 發布日 | {YYYY-MM-DD} |
| 官方公告 | [{廠商} Blog]({url}) |

## 能力亮點

{2-4 個 bullet，每個用一句話說明一個能力突破。
 必須包含具體數字（如「在 SWE-bench Verified 達 72.3%」）。}

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| {benchmark 名} | {分數} | {前代分數} | {競品名 + 分數} |

{列出 3-5 個最重要的 benchmark。⚠️ 標注自測結果。}

## 與前代/競品比較

{2-3 段分析。不只列數字，要回答：
 1. 比前代進步最大的是什麼？
 2. 跟競品比，贏在哪、輸在哪？
 3. 定價策略有什麼變化？}

## 對 Agent 開發的意義

{2-3 段分析，回答：
 1. 這個模型對 Agent 架構設計有什麼影響？（如 context window 變大 → 可以省掉 RAG？）
 2. 適合什麼樣的 Agent 場景？
 3. 不適合什麼？
 用「如果你在做 X：」的句式給具體建議。}

## 我今天學到什麼

{1-3 句認知差。}
```

---

## 完整範例

```markdown
---
title: "模型卡｜Claude 4.5 Sonnet"
date: 2026-08-15
category: daily
tags: [ai-agent, model-release, daily, anthropic]
lang: zh-TW
description: "Anthropic 發佈 Claude 4.5 Sonnet——1M context、$3/$15 定價、SWE-bench 72.3%，首次原生支援 MCP server 端執行"
tldr: "Claude 4.5 Sonnet：1M context window、input $3/output $15 per 1M tokens、SWE-bench Verified 72.3%（前代 4 Sonnet 為 64.1%）、首次支援 MCP server 端執行讓 Agent 可以作為 MCP tool provider"
series:
  name: "AI Model Tracker"
  order: 12
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-4-5-sonnet-20260815` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $3.00 |
| Output 定價 (USD/1M tokens) | $15.00 |
| 開源 | 否 |
| 發布日 | 2026-08-15 |
| 官方公告 | [Anthropic Blog](https://www.anthropic.com/news/claude-4-5-sonnet) |

## 能力亮點

- SWE-bench Verified 達 72.3%，比前代 Claude 4 Sonnet（64.1%）提升 8.2 個百分點
- 原生 MCP server-side execution：模型可以直接作為 MCP tool provider，不只是 client
- Extended thinking 模式下推理步數上限從 16 步提升到 64 步
- 多語言程式碼生成：HumanEval 從 92.1% 提升到 96.8%

## Benchmark 表現

| Benchmark | 分數 | 前代 (4 Sonnet) | 競品最強 |
|---|---|---|---|
| SWE-bench Verified | 72.3% | 64.1% | GPT-5 71.8% |
| MMLU-Pro | 89.2% | 84.5% | Gemini Ultra 2 88.7% |
| HumanEval | 96.8% | 92.1% | GPT-5 95.3% |
| tau-bench (airline) | 68.5% | 55.2% | GPT-5 62.1% |

⚠️ 以上均為 Anthropic 自測，需等外部複現。SWE-bench Verified 分數已由 OpenAI 獨立團隊確認。

## 與前代/競品比較

跟 Claude 4 Sonnet 比，最大進步在 Agent 任務：tau-bench 從 55.2% 跳到 68.5%（+13.3pp），這代表在需要多輪工具呼叫的場景，成功率顯著提升。SWE-bench 的 72.3% 也是目前最高，但只比 GPT-5 的 71.8% 高 0.5pp——差距在誤差範圍內。

定價維持 $3/$15 不變（跟 Claude 4 Sonnet 一樣），在性能提升的前提下等於隱性降價。相比之下 GPT-5 的定價是 $5/$20，每 1M tokens 貴 67%（input）。

## 對 Agent 開發的意義

MCP server-side execution 是這次最大的架構變化。之前 Claude 只能作為 MCP client（呼叫別人提供的工具），現在可以作為 tool provider——這意味著你可以把 Claude 包成一個 MCP server，讓其他 Agent 呼叫它的特定能力。

- 如果你在做多 Agent 系統：Claude 4.5 可以作為「專家 Agent」被其他 Agent 透過 MCP 呼叫，不需要自己寫 adapter
- 如果你在做 coding Agent：SWE-bench 72.3% + 64 步 extended thinking 代表複雜多步驟 debug 的成功率會明顯提升
- 不適合：需要即時回應的場景（extended thinking 的延遲增加 2-3 倍），以及需要最低成本的高吞吐量批次處理（Haiku 更適合）

## 我今天學到什麼

之前以為 MCP 的角色分工是固定的——模型永遠是 client、工具永遠是 server。Claude 4.5 的 server-side execution 打破了這個假設：模型本身也可以是 tool provider，這讓多 Agent 架構的彈性大增。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] Model ID 用 API 呼叫的完整 ID（如 `claude-4-5-sonnet-20260815`）
- [ ] 定價精確到小數，不寫「約」
- [ ] Context Window 寫具體數字
- [ ] Benchmark 表列出至少 3 個，含前代和競品比較
- [ ] 自測結果標注 ⚠️
- [ ] 「對 Agent 開發的意義」有具體的「如果你在做 X：」建議
- [ ] 官方公告有完整 URL
- [ ] 「我今天學到什麼」是認知差，不是摘要
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
