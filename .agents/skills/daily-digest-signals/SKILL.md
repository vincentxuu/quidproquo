---
name: daily-digest-signals
description: "Routine J (Stage 2): daily news scan producing intermediate signals JSON at src/data/daily-signals/. Runs after Stage 1 routines, feeds Stage 3 daily report assembly."
---

# daily-digest-signals

Stage 2 routine。掃描所有新聞來源，篩出 30-50 則與 AI Agent 四圈相關的信號，存入中繼檔 JSON 供 Stage 3 日報組裝使用。**輸出是 JSON，不是文章。**

**⚠️ 重要：不要使用 Agent tool / subagent 來平行搜尋。** CCR 雲端環境的 session 不會等 background agent 完成，會導致主 session 提前結束、無產出。所有搜尋查詢都在主 session 中執行——可以在同一個 message 裡同時發出多個 Exa/Tavily tool call（平行 tool call），但不可以派 subagent。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 冪等檢查
[ -f "src/data/daily-signals/${TODAY}.json" ] && echo "已產出" && exit 0

# Step 3: 讀 watchlist（比對公司名時用）
#   重點欄位：companies[].name, companies[].slug, companies[].section
cat src/data/agent-watchlist.json | jq '.companies | length'

# Step 4: 讀 schema（確認 JSON 結構和 category 枚舉）
cat src/data/daily-signals/schema.ts

# Step 5: 執行「搜尋方法」逐個來源掃描
# Step 6: 執行「信號處理」過濾、分類、交叉驗證
# Step 7: 寫入 JSON
# Step 8: 更新跨天去重檔案
#   把本次收錄的所有 sourceUrl 追加到 seen-signal-urls.txt
echo "${TODAY}: $(jq -r '[.signals[].sourceUrl] | join(", ")' src/data/daily-signals/${TODAY}.json)" >> src/data/daily-signals/seen-signal-urls.txt
# Step 9: 提交（含 push 失敗 retry）
git add src/data/daily-signals/${TODAY}.json src/data/daily-signals/seen-signal-urls.txt
git commit -m "chore(daily): signals ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
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

三層策略，總共約 56 個查詢（但搜尋 API 只用 15 次）：

1. **廣域主題查詢**（8 個 Tavily）— 不限特定公司，按主題掃全網
2. **官方 blog 直讀**（41 個 WebFetch/firecrawl）— 直接抓 blog 列表頁讀日期，0 搜尋配額
3. **社群 + 區域來源**（Exa + Tavily 各幾個）— HN、Reddit、中文、台灣

所有結果在 Step 6b 用 watchlist 293 家公司名比對，未在第二層的公司靠廣域查詢兜底。

### 第一層：廣域主題查詢（Tavily × 8）

覆蓋整個 AI Agent 生態，不綁特定公司。

```
工具：mcp Tavily → tavily_search
每個查詢：max_results: 10, time_range: "day"
```

| # | query | 覆蓋 |
|---|-------|------|
| 1 | `AI agent news announcement launch` | 通用新聞 |
| 2 | `AI model release new benchmark` | 模型發佈 |
| 3 | `AI startup funding Series raise` | 融資 |
| 4 | `AI agent security vulnerability CVE` | 資安 |
| 5 | `AI agent framework SDK update release` | 框架更新 |
| 6 | `AI agent tool MCP server open source` | 工具/開源 |
| 7 | `AI agent enterprise deployment case study` | 企業落地 |
| 8 | `AI regulation policy government` | 法規治理 |

### 第二層：官方 blog 直讀（WebFetch / firecrawl，0 搜尋配額）

直接抓每家的 blog 列表頁，讀日期判斷有沒有新文章。不用搜尋 API。

```
工具：WebFetch（優先）→ firecrawl（WebFetch 被擋時 fallback）
prompt: "List the 5 most recent articles with their title and published date. Format: DATE | TITLE"
```

**A1 大廠**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 1 | `https://www.anthropic.com/news` | Anthropic | WebFetch |
| 2 | `https://www.anthropic.com/research` | Anthropic | WebFetch |
| 3 | `https://openai.com/news` | OpenAI | firecrawl |
| 4 | `https://openai.com/research/index` | OpenAI | firecrawl |
| 5 | `https://deepmind.google/blog` | Google | WebFetch |
| 6 | `https://devblogs.microsoft.com/ai` | Microsoft | WebFetch |
| 7 | `https://www.microsoft.com/en-us/ai/blog` | Microsoft | WebFetch |
| 8 | `https://devblogs.microsoft.com/agent-framework` | Microsoft | WebFetch |
| 9 | `https://azure.microsoft.com/en-us/blog/category/ai-machine-learning` | Microsoft | WebFetch |
| 10 | `https://about.fb.com/news` | Meta | WebFetch |
| 11 | `https://ai.meta.com/blog` | Meta | WebFetch |
| 12 | `https://aws.amazon.com/blogs/aws/category/artificial-intelligence/amazon-machine-learning/amazon-bedrock` | AWS | WebFetch |
| 13 | `https://aws.amazon.com/blogs/aws` | AWS | WebFetch |
| 14 | `https://aws.amazon.com/blogs/machine-learning` | AWS | WebFetch |
| 15 | `https://blogs.nvidia.com/blog/category/generative-ai` | NVIDIA | WebFetch |
| 16 | `https://developer.nvidia.com/blog` | NVIDIA | WebFetch |
| 17 | `https://x.ai/news` | xAI/SpaceXAI | firecrawl |
| 18 | `https://blog.cloudflare.com/tag/ai` | Cloudflare | WebFetch |
| 19 | `https://blog.cloudflare.com/tag/developers` | Cloudflare | WebFetch |
| 20 | `https://www.snowflake.com/blog` | Snowflake | WebFetch |
| 21 | `https://www.databricks.com/blog` | Databricks | WebFetch |
| 22 | `https://research.ibm.com/blog` | IBM | WebFetch |
| 23 | `https://www.apple.com/newsroom/topics/apple-intelligence` | Apple | WebFetch |

**A2 模型公司**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 22 | `https://mistral.ai/news` | Mistral | WebFetch |
| 23 | `https://cohere.com/blog` | Cohere | WebFetch |
| 24 | `https://www.ai21.com/blog` | AI21 Labs | WebFetch |
| 25 | `https://www.reka.ai/news` | Reka AI | WebFetch |
| 26 | `https://www.upstage.ai/blog` | Upstage | WebFetch |
| 27 | `https://sakana.ai/blog` | Sakana AI | WebFetch |
| 28 | `https://allenai.org/blog` | AI2 | WebFetch |

**B1/B2 開發工具與框架**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 29 | `https://cursor.com/changelog` | Cursor | WebFetch |
| 30 | `https://cursor.com/blog` | Cursor | WebFetch |
| 31 | `https://www.langchain.com/blog` | LangChain | WebFetch |
| 32 | `https://cognition.com/blog` | Cognition/Devin | WebFetch |
| 33 | `https://replit.com/blog` | Replit | WebFetch |
| 34 | `https://vercel.com/blog` | Vercel | WebFetch |
| 35 | `https://mastra.ai/blog` | Mastra | WebFetch |
| 36 | `https://sourcegraph.com/blog` | Sourcegraph | WebFetch |
| 37 | `https://www.pydantic.dev/articles` | Pydantic AI | WebFetch |
| 38 | `https://agno.com/blog` | Agno | WebFetch |

**中國大廠**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 39 | `https://www.alibabacloud.com/blog` | Alibaba Cloud | WebFetch |
| 40 | `https://seed.bytedance.com/blog` | ByteDance/Seed | WebFetch |
| 41 | `https://www.deepseek.com/en/news` | DeepSeek | firecrawl |

處理方式：
1. 抓回最近 5 篇的日期和標題
2. 只保留 48 小時內的文章
3. 今天沒發文的公司 = 0 筆，正確行為
4. 有新文章的，把標題和 URL 加入信號候選

### 第三層：社群 + 區域來源

**社群（Exa × 3）**

```
工具：mcp Exa → web_search_exa
numResults: 5 each
```

| # | query |
|---|-------|
| 1 | `site:news.ycombinator.com AI agent LLM tool` |
| 2 | `site:reddit.com/r/MachineLearning AI agent` |
| 3 | `site:reddit.com/r/LocalLLaMA model release` |

**中文/台灣（Tavily × 4）**

```
工具：mcp Tavily → tavily_search
max_results: 5, time_range: "day"
```

| # | query |
|---|-------|
| 1 | `site:36kr.com AI agent 人工智能` |
| 2 | `site:jiqizhixin.com AI agent 大模型` |
| 3 | `site:ithome.com.tw AI 人工智慧 agent` |
| 4 | `site:bnext.com.tw AI 人工智慧` |

### API 用量摘要

| 工具 | 查詢數 | 說明 |
|------|--------|------|
| Tavily | 12 | 8 廣域 + 4 中文台灣 |
| Exa | 3 | 社群（HN + Reddit） |
| WebFetch | 39 | 官方 blog 直讀（0 搜尋配額） |
| firecrawl | 4 | OpenAI ×2, xAI, DeepSeek（WebFetch 403 fallback） |
| **總計** | **58** | 搜尋 API 只用 15 次 |

### 去重與時間過濾

所有來源合併後，依序執行：

1. **URL 去重**：同一 URL 只保留一筆
2. **跨天去重**：讀取 `src/data/daily-signals/seen-signal-urls.txt`，排除已收錄過的 URL
3. **時間過濾**：
   - 有 published date 的結果：只保留 48 小時內的（`>= ${YESTERDAY}`）
   - published date 為 N/A 的結果：**保留但標記** `"dateConfidence": "unverified"`
   - **CCR 環境的 Exa tool 不支援 `startPublishedDate` 參數**，所以必須在這一步手動過濾，不能依賴搜尋工具的日期篩選

此時應有 50-100 則原始結果。

---

## 信號處理

### Step 6a：初篩（排除不相關）

排除條件：
- 與 AI Agent 四圈完全無關（純硬體、純晶片、非 AI 的軟體新聞）
- 純廣告或付費內容推廣
- 內容空洞（只有標題沒有實質內容的帖子）
- published date 確認超過 7 天的結果（即使搜尋工具回傳了）

### Step 6b：比對 watchlist 公司

對每則信號：
1. 讀取信號標題和摘要
2. 從 `agent-watchlist.json` 的 `companies` 陣列中匹配公司名
3. 若匹配到：記錄 `companies: [slug]`、`section`、`ring`
4. 若未匹配：`companies: []`、`section: ""`、根據內容判斷 `ring`

### Step 6c：分類（category 欄位）

依信號內容判斷 category（嚴格使用 schema.ts 的枚舉）：

| 信號內容 | category |
|---|---|
| 公司發佈新功能、產品更新 | `vendor-update` |
| 新模型發佈或模型能力比較 | `model-release` |
| API 定價變動、促銷、sunset | `pricing-change` |
| Benchmark 排名變化 | `benchmark-shift` |
| 框架版本發佈 | `framework-release` |
| 融資公告 | `funding` |
| 併購消息 | `acquisition` |
| 資安事件或漏洞 | `security-incident` |
| AI 法規、政策 | `regulation` |
| 新工具或 MCP server | `tool-launch` |
| 開源專案發佈 | `open-source` |
| 企業導入案例 | `enterprise-deployment` |
| 區域性新聞 | `region-news` |
| 社群討論趨勢 | `community-signal` |

### Step 6d：評估 relevance（0-1 分）

| 分數範圍 | 標準 |
|---|---|
| 0.9-1.0 | 直接影響 Agent 開發者的重大事件（新模型、重要框架更新、大規模安全事件） |
| 0.7-0.89 | Agent 生態相關的重要動態（融資、產品更新、benchmark 變動） |
| 0.5-0.69 | 間接相關（產業趨勢、法規、區域動態） |
| < 0.5 | 不收錄 |

### Step 6e：交叉驗證

掃描所有信號，找出描述**同一事件**的信號（不同來源報導同一件事）：
- 若 2+ 個獨立來源報導同一事件 → `crossValidated: true`，`crossValidationSources: ["source2", "source3"]`
- 若只有 1 個來源 → `crossValidated: false`
- **社群來源（Reddit/HN）不算獨立來源**——即使 HN 和 Reddit 都在討論，也只算 1 個社群來源

### Step 6f：篩選最終 30-50 則

按 relevance 排序，取 top 30-50。若不足 30 則，放寬到 relevance ≥ 0.4。

---

## 輸出格式

`src/data/daily-signals/${TODAY}.json`，嚴格遵循 `schema.ts` 的型別定義：

```json
{
  "date": "2026-08-17",
  "generatedAt": "2026-08-17T03:15:00Z",
  "routineId": "J",
  "signalCount": 35,
  "signals": [...]
}
```

每個 signal 物件：

```json
{
  "id": "sig-001",
  "title": "信號標題（原文語言）",
  "source": "來源簡稱（如 anthropic-blog / techcrunch / hn / reddit-ml）",
  "sourceUrl": "https://...",
  "publishedDate": "2026-08-16",
  "dateConfidence": "verified",
  "category": "vendor-update",
  "companies": ["anthropic"],
  "section": "A1",
  "ring": 1,
  "summary": "一兩句中文摘要",
  "relevance": 0.95,
  "crossValidated": true,
  "crossValidationSources": ["techcrunch", "venturebeat"]
}
```

`dateConfidence` 值：
- `"verified"` — 搜尋結果有明確的 published date，且在 48h 內
- `"unverified"` — 搜尋結果的 published date 為 N/A，無法確認時效性
```

---

## 完整範例

以下是一個寫好的 signals JSON（5 則，實際應有 30-50 則）：

```json
{
  "date": "2026-08-17",
  "generatedAt": "2026-08-17T03:12:00Z",
  "routineId": "J",
  "signalCount": 5,
  "signals": [
    {
      "id": "sig-001",
      "title": "Anthropic launches Claude Agent SDK 2.0 with native MCP orchestration",
      "source": "anthropic-blog",
      "sourceUrl": "https://www.anthropic.com/news/agent-sdk-2",
      "category": "vendor-update",
      "companies": ["anthropic"],
      "section": "A1",
      "ring": 1,
      "summary": "Anthropic 發佈 Agent SDK 2.0，原生支援 MCP 編排，可跨多個 MCP server 做 tool routing，並內建 session 記憶管理。",
      "relevance": 0.98,
      "crossValidated": true,
      "crossValidationSources": ["techcrunch", "hn"]
    },
    {
      "id": "sig-002",
      "title": "Cursor hits $500M ARR, launches Background Agents for enterprise",
      "source": "techcrunch",
      "sourceUrl": "https://techcrunch.com/2026/08/16/cursor-500m-arr/",
      "category": "vendor-update",
      "companies": ["cursor"],
      "section": "B1",
      "ring": 1,
      "summary": "Cursor 年化營收達 $500M，同時發佈企業版 Background Agents：可在雲端持續跑 coding task，無需開發者盯著 IDE。",
      "relevance": 0.92,
      "crossValidated": true,
      "crossValidationSources": ["venturebeat"]
    },
    {
      "id": "sig-003",
      "title": "Baseten raises $150M Series C at $13B valuation",
      "source": "businesswire",
      "sourceUrl": "https://www.businesswire.com/news/baseten-series-c",
      "category": "funding",
      "companies": ["baseten"],
      "section": "A3",
      "ring": 2,
      "summary": "推理基礎設施公司 Baseten 完成 $150M C 輪，估值 $13B。客戶包括 Cursor、Notion、Mercor。Lightspeed 領投。",
      "relevance": 0.78,
      "crossValidated": false,
      "crossValidationSources": []
    },
    {
      "id": "sig-004",
      "title": "台智雲推出企業 Agent 開發平台，整合 NVIDIA NIM",
      "source": "ithome",
      "sourceUrl": "https://www.ithome.com.tw/news/12345",
      "category": "vendor-update",
      "companies": ["twcc"],
      "section": "F2",
      "ring": 3,
      "summary": "台智雲發佈企業級 Agent 開發平台，整合 NVIDIA NIM 微服務。可在台灣本地 GPU 叢集上跑 Agent workflow，強調資料主權。",
      "relevance": 0.72,
      "crossValidated": false,
      "crossValidationSources": []
    },
    {
      "id": "sig-005",
      "title": "Discussion: Is MCP replacing function calling? Community debate",
      "source": "hn",
      "sourceUrl": "https://news.ycombinator.com/item?id=12345678",
      "category": "community-signal",
      "companies": ["anthropic"],
      "section": "A1",
      "ring": 1,
      "summary": "HN 熱帖：MCP 是否正在取代 function calling？主流意見認為 MCP 是 transport 層，function calling 是語意層，兩者互補而非替代。",
      "relevance": 0.55,
      "crossValidated": false,
      "crossValidationSources": []
    }
  ]
}
```

---

## 品質檢查清單

寫完 JSON 後，**逐項跑以下 bash 驗證**（不要自己寫驗證腳本，用這些指令）：

```bash
FILE="src/data/daily-signals/${TODAY}.json"

# 1. JSON 可解析 + signalCount 正確
node -e "const d=require('./${FILE}'); console.assert(d.signalCount===d.signals.length, 'count mismatch'); console.log('✅ count:', d.signalCount)"

# 2. 數量在 30-50
node -e "const d=require('./${FILE}'); const n=d.signals.length; console.assert(n>=30&&n<=50, 'count out of range: '+n); console.log('✅ range:', n)"

# 3. relevance >= 0.5（硬門檻，不可放寬）
node -e "const d=require('./${FILE}'); const bad=d.signals.filter(s=>s.relevance<0.5); console.assert(bad.length===0, 'low relevance: '+bad.map(s=>s.id+':'+s.relevance).join(',')); console.log('✅ relevance all >= 0.5')"

# 4. publishedDate + dateConfidence 都存在
node -e "const d=require('./${FILE}'); const missing=d.signals.filter(s=>!s.publishedDate||!s.dateConfidence); console.assert(missing.length===0, 'missing date fields: '+missing.length); console.log('✅ date fields complete')"

# 5. unverified 比例 < 50%
node -e "const d=require('./${FILE}'); const uv=d.signals.filter(s=>s.dateConfidence==='unverified').length; const pct=Math.round(uv/d.signals.length*100); console.assert(pct<50, 'unverified too high: '+pct+'%'); console.log('✅ unverified:', pct+'%')"

# 6. category 合法
node -e "const cats=new Set(['vendor-update','model-release','pricing-change','benchmark-shift','framework-release','funding','acquisition','security-incident','regulation','tool-launch','open-source','enterprise-deployment','region-news','community-signal']); const d=require('./${FILE}'); const bad=d.signals.filter(s=>!cats.has(s.category)); console.assert(bad.length===0, 'bad category: '+bad.map(s=>s.category)); console.log('✅ categories valid')"
```

任何一項失敗就修改 JSON 後重跑，不可跳過。

額外人工檢查：
- [ ] 社群來源（HN/Reddit）不算獨立來源做交叉驗證
- [ ] 中文來源涉及具體數字的信號，已嘗試用英文來源交叉驗證
- [ ] `companies` slug 與 watchlist 一致（不是自己編的 slug）
- [ ] 跨天去重：`seen-signal-urls.txt` 中的 URL 沒有出現在本次 signals 中
- [ ] `seen-signal-urls.txt` 已追加本次所有 URL
- [ ] commit 包含 JSON + seen-signal-urls.txt 兩個檔案
- [ ] commit message 是 `chore(daily): signals ${TODAY}`（不是 `post(daily)`）
