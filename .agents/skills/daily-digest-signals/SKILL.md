---
name: daily-digest-signals
description: "Routine J (Stage 2): daily news scan producing intermediate signals JSON at src/data/daily-signals/. Runs after Stage 1 routines, feeds Stage 3 daily report assembly."
---

# daily-digest-signals

Stage 2 routine。掃描所有新聞來源，篩出 30-50 則與 AI Agent 四圈相關的信號，存入中繼檔 JSON 供 Stage 3 日報組裝使用。**輸出是 JSON，不是文章。**

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
# Step 8: 提交
git add src/data/daily-signals/${TODAY}.json
git commit -m "chore(daily): signals ${TODAY}"
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

對以下來源逐一掃描，每個來源取 **top 5-10 則**。Exa + Tavily 兩個都跑，合併結果去重。中文/台灣來源加重 Tavily（中文效果較好）。

### 來源 1：Hacker News（社群風向）

```
工具：mcp Exa → web_search_exa
query: "site:news.ycombinator.com AI agent LLM tool"
numResults: 10
startPublishedDate: "{昨天 ISO 日期}"
type: "auto"
```

備選查詢：`site:news.ycombinator.com AI model release benchmark`

### 來源 2：HuggingFace（模型動態）

```
工具：mcp Exa → web_search_exa
query: "site:huggingface.co trending model AI agent 2026"
numResults: 5
startPublishedDate: "{昨天 ISO 日期}"
```

### 來源 3-9：大廠官方 Blog（廠商動態，逐家查）

每家用一個 Exa 查詢。若當天無新文章該家跳過。

| 查詢 | query |
|---|---|
| Anthropic | `site:anthropic.com/news OR site:anthropic.com/research 2026` |
| OpenAI | `site:openai.com/index 2026` |
| Google AI | `site:blog.google/technology/ai 2026` |
| Microsoft | `site:blogs.microsoft.com AI agent 2026` |
| Meta AI | `site:ai.meta.com/blog 2026` |
| NVIDIA | `site:blogs.nvidia.com AI 2026` |
| Cloudflare | `site:blog.cloudflare.com AI workers 2026` |

```
每個查詢設定：
  numResults: 3
  startPublishedDate: "{昨天 ISO 日期}"
```

### 來源 10：Product Hunt AI

```
工具：mcp Exa → web_search_exa
query: "site:producthunt.com AI agent tool 2026"
numResults: 5
startPublishedDate: "{昨天 ISO 日期}"
```

### 來源 11-12：Reddit（社群風向，降權處理）

```
工具：mcp Exa → web_search_exa

Q1: "site:reddit.com/r/MachineLearning AI agent 2026"
Q2: "site:reddit.com/r/LocalLLaMA model release 2026"
numResults: 5 each
startPublishedDate: "{昨天 ISO 日期}"
```

### 來源 13-15：產業新聞

```
工具：mcp Exa → web_search_exa

Q1: "site:venturebeat.com AI agent 2026"
Q2: "site:techcrunch.com AI agent 2026"
Q3: "site:the-decoder.com AI 2026"
numResults: 5 each
startPublishedDate: "{昨天 ISO 日期}"
```

### 來源 16-17：中文來源

```
工具：mcp Tavily → tavily_search（Tavily 對中文站效果較好）

Q1: "site:36kr.com AI agent 人工智能"
    days: 1, maxResults: 5
Q2: "site:jiqizhixin.com AI agent 大模型"
    days: 1, maxResults: 5
```

### 來源 18-19：台灣來源

```
工具：mcp Tavily → tavily_search

Q1: "site:ithome.com.tw AI 人工智慧 agent"
    days: 1, maxResults: 5
Q2: "site:bnext.com.tw AI 人工智慧"
    days: 1, maxResults: 5
```

### 去重

所有來源合併後，用 URL 去重。此時應有 50-100 則原始結果。

---

## 信號處理

### Step 6a：初篩（排除不相關）

排除條件：
- 與 AI Agent 四圈完全無關（純硬體、純晶片、非 AI 的軟體新聞）
- 純廣告或付費內容推廣
- 內容空洞（只有標題沒有實質內容的帖子）

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

- [ ] 信號數量在 30-50 之間
- [ ] 每個 signal 都有 `sourceUrl`（可存取的 URL）
- [ ] `category` 只用 schema.ts 定義的 14 種枚舉值
- [ ] `relevance` < 0.5 的信號已排除
- [ ] 社群來源（HN/Reddit）不算獨立來源做交叉驗證
- [ ] 中文來源涉及具體數字的信號，已嘗試用英文來源交叉驗證
- [ ] `companies` slug 與 watchlist 一致（不是自己編的 slug）
- [ ] JSON 格式正確（可被 `JSON.parse` 解析）
- [ ] `signalCount` 與 `signals.length` 一致
- [ ] commit message 是 `chore(daily): signals ${TODAY}`（不是 `post(daily)`）
