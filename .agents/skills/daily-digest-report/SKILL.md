---
name: daily-digest-report
description: "Routine K (Stage 3): daily AI Agent report assembly for quidproquo.cc/daily. Reads Stage 1-2 outputs and assembles the comprehensive daily report."
---

# daily-digest-report

Stage 3 彙整 routine。讀取 Stage 1（arxiv/github/event-driven posts）和 Stage 2（signals JSON）的產出，組裝成每日 AI Agent 日報。**主要靠讀檔，只有 signals JSON 缺失時才用 MCP 搜尋。**

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 冪等檢查——已有非 draft 版就不重做
if [ -f "src/content/posts/daily/${TODAY}-ai-agent-daily.md" ]; then
  grep -q "draft: true" "src/content/posts/daily/${TODAY}-ai-agent-daily.md" || { echo "已產出"; exit 0; }
fi

# Step 3: 讀 watchlist（用於觀察與洞察段落）
cat src/data/agent-watchlist.json | jq '.companies | length'

# Step 4: 讀取所有 Stage 1-2 輸入（見下方「輸入來源」）
# Step 5: 彙整內容，依「輸出格式」撰寫日報
# Step 6: 提交
git add src/content/posts/daily/${TODAY}-ai-agent-daily.md
git commit -m "post(daily): AI Agent 日報 ${TODAY}"
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



## 輸入來源

### Step 4a：讀取 Stage 2 中繼檔（必要）

```bash
cat src/data/daily-signals/${TODAY}.json
```

若不存在 → 進入 fallback 模式：用 Exa/Tavily 自行掃描今日重大新聞（見 Step 4d）。

### Step 4b：讀取 Stage 1 每日固定產出（若存在）

```bash
# 論文和 GitHub digest（每天都有）
cat src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md 2>/dev/null
cat src/content/posts/daily/${TODAY}-ai-agent-github-digest.md 2>/dev/null
```

從這兩篇中提取：
- Arxiv digest → 取「今日總覽」的主題，放入日報的「技術進展」
- GitHub digest → 取亮點 repo，放入日報的「工具與生態」

### Step 4c：讀取 Stage 1 事件驅動產出（不一定有）

```bash
ls src/content/posts/daily/${TODAY}-model-*.md 2>/dev/null
ls src/content/posts/daily/${TODAY}-security-*.md 2>/dev/null
ls src/content/posts/daily/${TODAY}-benchmark-*.md 2>/dev/null
ls src/content/posts/daily/${TODAY}-framework-*.md 2>/dev/null
ls src/content/posts/daily/${TODAY}-funding-*.md 2>/dev/null
ls src/content/posts/daily/${TODAY}-pricing-*.md 2>/dev/null
```

對每個存在的檔案，讀取並摘要放入日報對應段落：
| 檔案 | 放入日報段落 |
|---|---|
| `model-*.md` | 模型與基礎設施 |
| `security-*.md` | 資安事件與防禦技術 |
| `benchmark-*.md` | 模型與基礎設施 |
| `framework-*.md` | 技術進展 |
| `funding-*.md` | 商業案例 / 融資 / 併購 |
| `pricing-*.md` | 定價與 API 生命週期 |

### Step 4d：Fallback 搜尋（僅在 signals JSON 缺失時）

```
工具：mcp Exa → web_search_exa
query: "AI agent news today 2026"
numResults: 20
startPublishedDate: "{昨天 ISO 日期}"

工具：mcp Tavily → tavily_search
query: "AI agent 重大新聞"
days: 1
maxResults: 10
```

---

## 彙整規則

### 段落取捨——有內容才寫，沒事不硬塞

| 段落 | 寫的條件 | 不寫的條件 |
|---|---|---|
| 今日重點摘要 | **必寫** | — |
| 廠商動態 | signals 中有 `vendor-update` 類信號 | 無廠商動態 |
| 模型與基礎設施 | 有 `model-release` / `benchmark-shift` 信號或 model-card post | 無模型新聞 |
| 定價與 API 生命週期 | 有 `pricing-change` 信號或 pricing post | 無定價變動 |
| Coding Agent 賽道 | 信號涉及 B1 section 公司（Cursor/Devin/Windsurf/Claude Code 等） | 無 coding agent 新聞 |
| 工具與生態 | 有 `tool-launch` / `open-source` 信號或 tool post | 無工具新聞 |
| 技術進展 | 有 arxiv digest 或 `framework-release` 信號 | 無技術新聞 |
| 商業案例/融資/併購 | 有 `funding` / `acquisition` / `enterprise-deployment` 信號 | 無商業新聞 |
| 資安事件與防禦技術 | 有 `security-incident` 信號或 security post | 無資安事件 |
| 法規與治理 | 有 `regulation` 信號 | 無法規新聞 |
| 中國/台灣/日韓動態 | 有 `region-news` 信號或 F1-F4 section 公司動態 | 無區域新聞 |
| 觀察與洞察 | **必寫** | — |
| 我今天學到什麼 | **必寫** | — |
| 參考連結 | **必寫** | — |

### 「觀察與洞察」段落的 MIS 框架要求

此段落是日報的核心價值。必須有意識地使用以下至少一個框架：

| 框架 | 何時用 | 範例句式 |
|---|---|---|
| 交易成本 | 新產品降低了某個合作的成本 | 「MCP 降低了 Agent 與外部工具的整合交易成本，從原本需要寫 adapter 降為設定檔」 |
| 互補資產 | 生態系中誰依賴誰 | 「Cursor 的 $500M ARR 證明 coding agent 的互補資產是 IDE 整合，不是模型能力」 |
| 網路效應 | 用戶越多價值越高 | 「MCP server 數量破 5000 個，形成正回饋迴圈：開發者寫 server → Agent 更有用 → 更多開發者用」 |
| 五力分析 | 競爭格局變化 | 「OpenAI Agents SDK 開源降低了框架層的進入門檻，CrewAI/LangGraph 的護城河靠社群而非技術」 |
| 轉換成本 | 鎖定效應 | 「從 LangChain 遷移到 Mastra 的轉換成本主要在 Python → TypeScript，不是框架概念差異」 |

---

## 輸出格式

### Frontmatter

```yaml
---
title: "AI Agent 日報 — YYYY-MM-DD"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "一句話概述今天最重要的事"
tldr: "3-5 行的今日重點，用分號隔開"
draft: false
series:
  name: "AI Agent 日報"
  order: N
---
```

`order` 計算：距離 2026-08-16 的天數 + 1。
`draft: false` 必須明確寫出（取代測試版 `draft: true`）。

### 內容結構（嚴格按以下順序）

```markdown
## 今日重點摘要

- {事件 1 的一句話結論，附來源連結}
- {事件 2}
- {事件 3}
- {事件 4}（選填）
- {事件 5}（選填）

## 廠商動態

### {公司名}

{1-2 段落描述該公司的動態。必須附來源連結。}

### {公司名}

{另一家公司...}

## 模型與基礎設施

{新模型發佈、定價變動、推理成本、Benchmark 異動。附模型卡數據（若有）。}

## 定價與 API 生命週期

{限時促銷窗口、API sunset 時程、用量政策變更。此段落有事才出現。}

## Coding Agent 賽道

{Claude Code / Cursor / Devin / Windsurf / Cline / Aider 的最新狀態變化。無變化可省略。}

## 工具與生態

{值得關注的 MCP server、SDK、開發工具。從 GitHub digest 和 tool post 提取。}

## 技術進展

{框架版本更新、MCP spec 變更、協定動態、學術論文摘選。從 arxiv digest 和 framework post 提取。}

## 商業案例 / 融資 / 併購

{融資：公司名、金額、投資人、一句話意義。
 併購：收購方、被收購方、金額、對生態的影響。
 企業導入：成功案例與失敗信號並重。}

## 資安事件與防禦技術

{攻擊面追蹤 + 防禦技術追蹤，成對出現。此段落有事才出現。}

## 法規與治理

{AI 法案、政府會議、合規要求變更。此段落有事才出現。}

## 中國 / 台灣 / 日韓動態

{區域生態獨立成段，不混在「廠商動態」。追蹤：開源模型、Agent 平台、在地法規、投資動向。}

## 觀察與洞察

{2-4 段分析。必須使用至少一個 MIS 框架。
 用「我認為」開頭標記觀點，與事實段落區分。}

## 我今天學到什麼

{1-3 句認知差。「之前以為 X，現在知道 Y」。不是摘要。}

## 參考連結

{所有來源的完整 URL，按出現順序排列，一行一個。}
```

---

## 完整範例

```markdown
---
title: "AI Agent 日報 — 2026-08-17"
date: 2026-08-17
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Anthropic 發佈 Agent SDK 2.0 原生支援 MCP 編排；Cursor 年化營收 $500M；Baseten C 輪 $150M"
tldr: "Anthropic Agent SDK 2.0 讓跨 MCP server 的 tool routing 變原生；Cursor 的 $500M ARR 是 coding agent 賽道最強的 PMF 信號；Baseten $13B 估值說明推理基礎設施比模型本身更值錢"
draft: false
series:
  name: "AI Agent 日報"
  order: 2
---

## 今日重點摘要

- Anthropic 發佈 [Agent SDK 2.0](https://www.anthropic.com/news/agent-sdk-2)，原生支援跨 MCP server 的 tool routing 和 session 記憶管理
- Cursor [年化營收達 $500M](https://techcrunch.com/2026/08/16/cursor-500m-arr/)，同時發佈企業版 Background Agents
- Baseten 完成 [$150M C 輪](https://www.businesswire.com/news/baseten-series-c)，估值 $13B，客戶含 Cursor/Notion/Mercor
- 台智雲推出[企業 Agent 開發平台](https://www.ithome.com.tw/news/12345)，整合 NVIDIA NIM，強調資料主權

## 廠商動態

### Anthropic

Agent SDK 2.0 是 Claude 生態的重大更新。最核心的變化是 MCP 編排從「開發者自己接」變成「SDK 原生支援」——一個 Agent 可以同時連多個 MCP server，SDK 自動做 tool discovery 和 routing。另外內建的 session 記憶管理讓長程任務不需要自己寫 checkpointer。（[來源](https://www.anthropic.com/news/agent-sdk-2)）

### Cursor (Anysphere)

$500M ARR 讓 Cursor 坐穩 coding agent 龍頭。更值得注意的是同步發佈的 Background Agents：可在雲端持續跑 coding task，開發者不需要盯著 IDE。這把 coding agent 從「互動式助手」推向「自主式工人」。（[來源](https://techcrunch.com/2026/08/16/cursor-500m-arr/)）

## 模型與基礎設施

無新模型發佈。

## 工具與生態

今日 GitHub trending 出現 3 個值得關注的 MCP server：mcp-postgres（直接讓 Agent 查 PostgreSQL）、mcp-figma（讀 Figma 設計稿產生程式碼）、mcp-jira（Agent 操作 Jira ticket）。MCP server 生態正在從「玩具」進入「企業工具鏈」。

## 商業案例 / 融資 / 併購

**Baseten C 輪 $150M**：推理基礎設施公司，估值 $13B。Lightspeed 領投。客戶包含 Cursor、Notion、Mercor。值得注意的是 Baseten 的估值已超過多數模型公司——市場在定價「推理基礎設施」比「訓練新模型」更值錢。（[來源](https://www.businesswire.com/news/baseten-series-c)）

## 中國 / 台灣 / 日韓動態

**台灣**：台智雲推出企業級 Agent 開發平台，整合 NVIDIA NIM 微服務。可在台灣本地 GPU 叢集上跑 Agent workflow，主打資料主權（資料不出境）。這是台灣 AI 基礎設施從「賣算力」轉向「賣平台」的信號。（[來源](https://www.ithome.com.tw/news/12345)）

## 觀察與洞察

我認為今天三件事串起來看，指向 Agent 生態的一個結構性轉變：**基礎設施層正在比模型層更值錢**。

從互補資產的角度：Cursor 的 $500M ARR 證明 coding agent 的價值不在「用哪個模型」，而在 IDE 整合和開發者體驗。Cursor 可以換底層模型（事實上它已經支援 Claude/GPT/自建模型），但開發者換不了 Cursor 的 IDE 體驗——這是經典的互補資產鎖定。

Baseten 的 $13B 估值也在說同一件事：推理基礎設施是 Agent 的必要互補資產。模型可以被替換，但低延遲、高吞吐量的推理服務不行。

Anthropic 的 Agent SDK 2.0 則是在加深自己的轉換成本：一旦開發者用了原生 MCP 編排，遷移到其他框架的成本就不只是改幾行 API call，而是要重寫整個 tool routing 邏輯。

## 我今天學到什麼

之前以為 AI 產業的價值主要在模型層（誰做出最強的模型誰最值錢），今天看到 Baseten 的估值和 Cursor 的 ARR 後意識到，Agent 時代的價值正在從「訓練最強模型」移向「提供最好的執行基礎設施」。推理基礎設施和開發者工具是新的價值高地。

## 參考連結

- https://www.anthropic.com/news/agent-sdk-2
- https://techcrunch.com/2026/08/16/cursor-500m-arr/
- https://www.businesswire.com/news/baseten-series-c
- https://www.ithome.com.tw/news/12345
```

---

## 品質檢查清單

- [ ] 「今日重點摘要」有 3-5 bullet，每個附來源連結
- [ ] 每個事實主張都有來源（不能「據報導」沒出處）
- [ ] 數字精確（$500M 不寫「約五億美元」）
- [ ] 觀點段落用「我認為」開頭
- [ ] 「觀察與洞察」使用了至少 1 個 MIS 框架（標明用了哪個）
- [ ] 「我今天學到什麼」是認知差（之前以為 X → 現在知道 Y）
- [ ] 有內容的段落才寫，沒事件的段落完全不出現
- [ ] 全文 < 3000 字
- [ ] `draft: false` 已明確寫出
- [ ] `description` 和 `tldr` 已填寫
- [ ] 「參考連結」包含所有文中引用的 URL
