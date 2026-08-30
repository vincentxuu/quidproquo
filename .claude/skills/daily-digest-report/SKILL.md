---
name: daily-digest-report
description: "Routine K (Stage 3): daily AI report assembly for quidproquo.cc/daily. Reads Stage 1-2 outputs and assembles the comprehensive daily report."
---

# daily-digest-report

Stage 3 彙整 routine。讀取 Stage 1（arxiv/github/event-driven posts）和 Stage 2（signals JSON）的產出，組裝成每日 AI 日報。**主要靠讀檔，只有 signals JSON 缺失時才用 MCP 搜尋。**

**⚠️ 重要：不要使用 Agent tool / subagent。** CCR 雲端環境的 session 不會等 background agent 完成。所有工作都在主 session 中完成。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

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
git commit -m "post(daily): AI 日報 ${TODAY}"
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



## 輸入來源

### Step 4a：讀取 Stage 2 中繼檔（必要）

```bash
cat src/data/daily-signals/${TODAY}.json
```

若不存在 → 進入 fallback 模式：用 Groundlane 自行掃描今日重大新聞（見 Step 4d）。即使檔案存在，仍須執行 Step 4e 的區域覆蓋稽核。

### Step 4b：讀取 Stage 1 每日固定產出（若存在）

```bash
# 論文和 GitHub digest（每天都有）
cat src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md 2>/dev/null
cat src/content/posts/daily/${TODAY}-ai-agent-github-digest.md 2>/dev/null
```

從這兩篇中提取：
- Arxiv digest → 取「今日總覽」的共同方向，依下方「Arxiv 摘要契約」放入日報的「技術進展」
- GitHub digest → 取亮點 repo，放入日報的「工具與生態」

#### Arxiv 摘要契約（同日有 Digest 就不可省略）

只要同日存在非 draft 的 Arxiv Digest，主 AI 日報就必須在「技術進展」正文中放入一段 **1-2 句的編輯摘要 + 站內連結**；只把連結列在「今日 Digest 一覽」或「參考資料」不算完成。

- 摘要回答「今天這批論文共同指出哪個新方向或能力缺口」，不要逐篇重述 abstract。
- 用「論文指出／實驗顯示／作者主張」保留證據邊界，不把預印本結論寫成已被產業證實的事實。
- 若 Digest 已標註可信度、限制或 watch 狀態，主日報只提對讀者決策必要的限制，其餘導向 Digest 閱讀。
- 可與同日 framework / GitHub 信號做跨文章連線，但不能讓其他事件取代 Arxiv 摘要本身。
- 中英文主日報都要連到各自語言的 Digest。英文文章實際路由沿用內容 id 的 `-en` 後綴，例如 `/posts/daily/YYYY-MM-DD-ai-agent-arxiv-digest-en`；不要寫成中文版路由，也不要自行改成不存在的 `/en/posts/...`。
- 主日報不做三篇論文的深度分析或重新評分；完整方法、數字、可信度與限制留在 Arxiv Digest。

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
工具：Groundlane MCP → web_search
query: "AI agent news today 2026"
max_results: 20
published_after: "{昨天 ISO 日期}"

工具：Groundlane MCP → web_search
query: "AI agent 重大新聞"
time_range: "day"
max_results: 10
```

### Step 4e：全球區域缺口補掃（signals JSON 存在也要做）

先把 Stage 1、signals 與預定放入廠商／法規／資安段的事件映射到全球區域矩陣：北美、台灣、中國／香港、日本／韓國、東南亞、印度／南亞、歐洲、中東（含以色列）、非洲、拉丁美洲、大洋洲（澳洲／紐西蘭）。

- 北美事件即使散在廠商、法規或資安段，也算已覆蓋，不必在「區域動態」重複。
- 若非北美矩陣只有 1-2 個宏觀區域有事件，或明顯缺少東南亞、非洲、拉丁美洲、大洋洲等長期盲區，用 Groundlane `web_search` 對缺口最大的最多 4 組做 `time_range: "day"` 補掃。
- 每個候選再用 Groundlane `web_fetch` 讀全文；優先政府、公司公告與原始文件，搜尋 snippet 只能用於發現，不能直接寫進文章。
- 補掃是找漏訊號，不是強制湊齊版面。沒有合格事件就省略，必要時可在區域段末用一句話交代已檢索但未收錄的區域。

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
| 全球區域動態 | 有 `region-news` 信號、區域公司／政策動態，或 Step 4e 補掃命中 | 無合格區域新聞 |
| 觀察與洞察 | **必寫** | — |
| 今日收穫 | **必寫** | — |
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

### 定位

日報是「分析為核心、新聞為素材」的綜合觀點文。Stage 1 各文章負責細節，日報負責**跨文章連線**——讀者看日報知道「今天合起來代表什麼」，想看細節再點進個別文章。

zh-TW 版日報的讀者位置是台灣／繁中 builder。國際新聞可以是素材，但「一句話判斷」「深度分析」「今日收穫」至少一處要明確落回台灣這邊的判斷：台灣團隊該採用、觀望、避開、補哪個能力，或這件事會如何影響繁中產品、企業導入、資料主權、採購、人才與市場結構。沒有直接台灣新聞時，不硬塞台灣案例；改寫台灣讀者的決策問題。

### Frontmatter

```yaml
---
title: "AI 日報 — YYYY-MM-DD"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "一句話判斷，不是事件列表"
tldr: "3-5 行的今日重點，用分號隔開"
draft: false
series:
  name: "AI 日報"
  order: N
---
```

`order` 計算：距離 2026-08-16 的天數 + 1。
`draft: false` 必須明確寫出（取代測試版 `draft: true`）。

### 內容結構（嚴格按以下順序）

```markdown
## 一句話判斷

{今天所有事件串起來最重要的一個觀點，粗體。
 不是列表，是一句有立場的判斷。
 zh-TW 版優先寫成台灣／繁中 builder 讀完能用的判斷，不只是全球新聞總結。}

## 深度分析：{今日主題}

{文章核心。400-600 字（不是 800）。精煉為王——每一段必須推進論點，
 不可重複同一個觀察。用一個 MIS 框架貫穿全文，不要混用兩個框架說同一件事。
 結構：論點（1 句）→ 證據 A → 證據 B → 對從業者的意義（1-2 句）。
 用「我認為」開頭標記觀點。
 至少一句說清楚對台灣／繁中 builder、企業導入或台灣市場的意義。
 這一段是日報存在的理由——個別文章看不到的連線只有這裡能看到。}

## 今日動態

{Stage 1 沒覆蓋到的新聞，分小節寫。有事才出現的小節直接省略。}

### 廠商動態

每家公司用粗體名稱分開，不要混在同一段：

**{公司名}**：{1-2 句動態，附來源連結。}

**{公司名}**：{另一家...}

### 模型與基礎設施

每個事件獨立一段，用粗體開頭：

**{模型/事件名}**：{1-2 句摘要，附來源連結。}
若 Stage 1 已有 model-card / pricing / benchmark 文章，只寫一句 + 連結，不重述。

### 資安事件

每個事件獨立一段：

**{事件名}**：{攻擊面描述 + 防禦做法，附來源連結。}
若 Stage 1 已有 security 文章，只寫一句 + 連結。

### 法規與治理

每條法規獨立一段：

**{法規/政策名}**：{1-2 句摘要，附來源連結。}

### 區域動態

每個區域用粗體標題分開，不要混在同一段；同一區域內若有兩則以上彼此獨立的新聞，每則新聞之間也要留一個 Markdown 空白行，不能因為共用區域標題就接成同一段：

**中國**
{中國相關新聞}

**台灣**
{台灣相關新聞}

**日韓** / **東南亞** / **印度** / **歐洲** / **中東** / **非洲** / **拉丁美洲** / **大洋洲**
{各區域分段寫；同區域的不同事件也各自成段，沒新聞的區域直接省略}

動筆前要逐一掃過全球區域矩陣：台灣、中國／香港、日本／韓國、東南亞、印度／南亞、歐洲、中東（含以色列）、非洲、北美、拉丁美洲、以及大洋洲（澳洲／紐西蘭）。這是**檢索覆蓋要求，不是成稿配額**：同一時間窗找不到可靠且跟 AI 直接相關的事件就省略，不拿舊聞或泛市場報告湊版面。北美事件若已完整出現在廠商、法規或資安段，不必在區域段重複。

只寫跟 AI 直接相關的區域新聞（模型發佈、法規、平台、融資）。
「某國蓋 AI 中心」「某大學開課」這類跟 AI 從業者無關的新聞不收。

### 商業案例 / 融資
{融資：公司名、金額、投資人、一句話意義。若 Stage 1 已有 funding 文章，
 這裡只寫一句摘要 + 連結。}

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| {今天最重要的 3-5 個數字，如定價、融資額、benchmark 分數、star 數} |

## 今日 Digest 一覽

{列出今天所有 Stage 1 產出的文章，一行一篇，附站內連結。不重述內容。}

- 📄 [AI Agent Arxiv Digest — YYYY-MM-DD](/posts/daily/YYYY-MM-DD-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — YYYY-MM-DD](/posts/daily/YYYY-MM-DD-ai-agent-github-digest)
- {其他當天產出的 Stage 1 文章...}

## 明日關注

{2-3 bullet。根據今天的信號，明天值得追蹤什麼。
 例如「DeepSeek 漲價後競品會不會跟進」「Gemini 3.7 Flash 社群實測會出來」。}

## 今日收穫

{1-3 句認知差。「之前以為 X，現在知道 Y」。
 **必須跟深度分析的結論不同**——深度分析講的是「今天合起來代表什麼」，
 今日收穫講的是「寫完這篇後我個人的認知哪裡被修正了」。
 zh-TW 版要能回到台灣讀者的判斷；不要只寫「今天國際 AI 很熱鬧」。
 如果寫出來跟深度分析的最後一段一樣，退回重寫。}

## 參考資料

{所有來源的 Markdown 連結，格式 `- [標題](URL)`。一份即可，不要重複。}
```

---

## 完整範例（節錄，展示新結構）

```markdown
---
title: "AI 日報 — 2026-08-17"
date: 2026-08-17
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 生態的價值正在從模型層移向基礎設施層——Baseten 估值超過多數模型公司，Cursor 的護城河不是模型而是 IDE 整合"
tldr: "Anthropic Agent SDK 2.0 加深 MCP 編排的轉換成本；Cursor $500M ARR 證明 coding agent 價值在 IDE 整合不在模型；Baseten $13B 估值說明推理基礎設施比訓練模型更值錢；台智雲企業 Agent 平台主打資料主權"
draft: false
series:
  name: "AI 日報"
  order: 2
---

## 一句話判斷

**Agent 生態的價值高地正在從「誰的模型最強」轉向「誰的基礎設施最不可替代」——今天三個獨立事件從不同角度確認了這個結構性轉變。**

## 深度分析：基礎設施層正在比模型層更值錢

我認為今天三件事串起來看，指向一個不可逆的結構性轉變。

從互補資產的角度：Cursor 的 $500M ARR 證明 coding agent 的價值不在「用哪個模型」，而在 IDE 整合和開發者體驗。Cursor 可以換底層模型（事實上它已經支援 Claude/GPT/自建模型），但開發者換不了 Cursor 的 IDE 體驗——這是經典的互補資產鎖定。（框架：互補資產）

Baseten 的 $13B 估值也在說同一件事：推理基礎設施是 Agent 的必要互補資產。模型可以被替換，但低延遲、高吞吐量的推理服務不行。當 Baseten 的估值超過多數模型公司，市場已經在用真金白銀定價「基礎設施 > 模型」。

Anthropic 的 Agent SDK 2.0 則是在加深自己的轉換成本：一旦開發者用了原生 MCP 編排，遷移到其他框架的成本就不只是改幾行 API call，而是要重寫整個 tool routing 邏輯。Anthropic 正在把自己從「模型供應商」重新定位成「Agent 基礎設施平台」。（框架：轉換成本）

這對從業者的意義：如果你在做 Agent 產品，護城河不在「接了哪個最強模型」——因為模型會被追平且可替換。護城河在你的使用者離開後要重建多少東西：資料、工作流、整合、習慣。

## 今日動態

### 廠商動態

**Anthropic**：Agent SDK 2.0 原生支援跨 MCP server 的 tool routing 和 session 記憶管理，一個 Agent 可同時連多個 MCP server 做自動 discovery。（[來源](https://www.anthropic.com/news/agent-sdk-2)）

**Cursor (Anysphere)**：$500M ARR，同步發佈企業版 Background Agents——可在雲端持續跑 coding task，把 coding agent 從「互動式助手」推向「自主式工人」。（[來源](https://techcrunch.com/2026/08/16/cursor-500m-arr/)）

### 區域動態

**台灣**：台智雲推出企業級 Agent 開發平台，整合 NVIDIA NIM，在台灣 GPU 叢集上跑 Agent workflow，主打資料主權。這是台灣 AI 基礎設施從「賣算力」轉向「賣平台」的信號。（[來源](https://www.ithome.com.tw/news/12345)）

### 商業案例 / 融資

**Baseten C 輪 $150M**：估值 $13B，Lightspeed 領投。客戶含 Cursor、Notion、Mercor。（[來源](https://www.businesswire.com/news/baseten-series-c)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Cursor ARR | $500M | [TechCrunch](https://techcrunch.com/2026/08/16/cursor-500m-arr/) |
| Baseten 估值 | $13B | [BusinessWire](https://www.businesswire.com/news/baseten-series-c) |
| Baseten C 輪 | $150M | 同上 |
| MCP server 數量 | 5,000+ | Anthropic MCP Registry |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-08-17](/posts/daily/2026-08-17-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-08-17](/posts/daily/2026-08-17-ai-agent-github-digest)

## 明日關注

- Anthropic Agent SDK 2.0 發佈後社群反應：LangGraph/CrewAI 會如何回應 MCP 原生編排？
- Baseten $13B 估值會不會帶動推理基礎設施賽道（Together AI、Fireworks、Modal）新一輪融資？

## 今日收穫

之前以為 AI 產業的價值主要在模型層，今天意識到 Agent 時代的價值正在移向基礎設施——推理服務和開發者工具是新的價值高地，模型反而是可替換的商品。

## 參考資料

- [Anthropic Agent SDK 2.0](https://www.anthropic.com/news/agent-sdk-2)
- [Cursor 年化營收達 $500M — TechCrunch](https://techcrunch.com/2026/08/16/cursor-500m-arr/)
- [Baseten C 輪 $150M — BusinessWire](https://www.businesswire.com/news/baseten-series-c)
- [台智雲企業 Agent 開發平台 — iThome](https://www.ithome.com.tw/news/12345)
```

---

## 覆蓋率檢查流程（寫完後必做）

寫完日報後、commit 之前，必須執行以下覆蓋率檢查：

### Check 1：Stage 1 文章全部引用

```bash
# 列出今天所有 Stage 1 產出
ls src/content/posts/daily/${TODAY}-*.md | grep -v "ai-agent-daily"
```

每一篇都必須出現在「今日 Digest 一覽」中。漏了就補。

若同日有 Arxiv Digest，再檢查一次：它除了出現在「今日 Digest 一覽」與「參考資料」，還必須出現在「技術進展」正文，而且附近有共同方向的摘要。**單純有三次連結不等於完成；要看連結所在段落。**

```bash
# 先看連結出現位置，再人工確認其中一處位於「技術進展」正文
rg -n -C 3 "${TODAY}-ai-agent-arxiv-digest" \
  "src/content/posts/daily/${TODAY}-ai-agent-daily.md" \
  "src/content/posts/daily/${TODAY}-ai-agent-daily-en.md"
```

### Check 2：Signals JSON 全部掃過

```bash
# 若 signals JSON 存在，檢查有哪些 category
cat src/data/daily-signals/${TODAY}.json | jq '[.signals[].category] | unique'
```

每個 category 至少要在「今日動態」或「深度分析」中被提及或有意識地排除（在 commit message 中說明排除理由）。

### Check 3：不重述 Stage 1

日報中提及 Stage 1 已有詳細文章的事件時，只寫一句摘要 + 站內連結，不複製段落。逐段檢查：如果某段超過 3 句且跟某篇 Stage 1 文章高度重疊，壓縮成一句 + 連結。

### Check 4：深度分析有連線

「深度分析」段落必須引用至少 2 個不同來源的事件，並用 MIS 框架串起來。如果只分析了一件事，那不是「連線」而是「評論」——退回重寫。

### Check 5：數字表完整

「關鍵數字」表格至少 3 行，每行都有來源連結。

### Check 6：高 relevance 信號不可漏

```bash
# 列出 relevance >= 0.8 的信號
cat src/data/daily-signals/${TODAY}.json | jq '[.signals[] | select(.relevance >= 0.8) | {id, title, relevance, category}]'
```

每個 relevance ≥ 0.8 的信號都必須在日報中被提及。漏了就補——這些是今天最重要的事件。

### Check 7：今日收穫不重複深度分析

「今日收穫」的內容不可以跟「深度分析」的最後一段或結論相同。如果講的是同一個觀點，退回重寫「今日收穫」。

### Check 8：台灣讀者位置

zh-TW 版至少在「一句話判斷」「深度分析」「今日收穫」「明日關注」其中一處，回答今天的訊號對台灣／繁中 builder、企業導入、資料主權、採購、人才或市場結構的影響。只出現「台灣」兩字不算；要有可判斷的行動或限制。

### Check 9：全球區域不是只看 signals 數量

確認 Step 4e 已執行。區域動態若仍只涵蓋 1-2 個宏觀區域，必須能指出其他缺口區域是「查過後無合格事件」，不能只以 signals JSON 本來就少作為理由。以色列歸中東；澳洲／紐西蘭歸大洋洲；巴西、墨西哥等歸拉丁美洲。

---

## 品質檢查清單

- [ ] 「一句話判斷」是有立場的觀點，不是事件列表
- [ ] 「深度分析」400-600 字，引用 2+ 個事件，用一個 MIS 框架貫穿，不重複同一觀察
- [ ] 「今日動態」只寫 Stage 1 沒覆蓋的新聞；Stage 1 已有的只放一句摘要 + 連結
- [ ] 覆蓋率 Check 1 通過：所有 Stage 1 文章都在「今日 Digest 一覽」
- [ ] 覆蓋率 Check 2 通過：signals JSON 的每個 category 都被處理
- [ ] 覆蓋率 Check 3 通過：沒有段落跟 Stage 1 文章重疊超過 3 句
- [ ] 「關鍵數字」表格 ≥ 3 行，每行有來源
- [ ] 「明日關注」有 2-3 bullet，基於今天的信號做前瞻
- [ ] 每個事實主張都有來源（不能「據報導」沒出處）
- [ ] 數字精確（$500M 不寫「約五億美元」）
- [ ] 觀點段落用「我認為」開頭
- [ ] 「今日收穫」是認知差（之前以為 X → 現在知道 Y），且跟深度分析結論不同
- [ ] 覆蓋率 Check 6 通過：relevance ≥ 0.8 的信號全部被提及
- [ ] 覆蓋率 Check 8 通過：zh-TW 版有台灣讀者位置，不只是英文來源摘要
- [ ] 覆蓋率 Check 9 通過：signals 存在時仍做全球區域缺口補掃，未把母集偏差帶進成稿
- [ ] 區域動態只收跟 AI 直接相關的（模型/法規/平台/融資），不收純基建新聞
- [ ] 全球區域矩陣已逐區檢索；以色列歸中東、澳洲／紐西蘭歸大洋洲，缺席區域是查無合格事件而非漏搜
- [ ] 有內容的小節才寫，沒事件的小節直接省略
- [ ] 全文 < 3000 字
- [ ] `draft: false` 已明確寫出
- [ ] `description` 是一句判斷（不是事件列表）
- [ ] 文末有「## 參考資料」區段，格式 `- [標題](URL)`（`pnpm check:references` 會擋）
