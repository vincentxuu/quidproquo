---
name: daily-digest-signals
description: "Routine J (Stage 2): daily news scan producing intermediate signals JSON at src/data/daily-signals/. Runs after Stage 1 routines, feeds Stage 3 daily report assembly."
---

# daily-digest-signals

Stage 2 routine。掃描所有新聞來源，篩出 30-50 則與 AI 生態相關的信號，存入中繼檔 JSON 供 Stage 3 日報組裝使用。**輸出是 JSON，不是文章。**

**⚠️ 重要：不要使用 Agent tool / subagent 來平行搜尋。** CCR 雲端環境的 session 不會等 background agent 完成，會導致主 session 提前結束、無產出。所有搜尋查詢都在主 session 中執行——可以在同一個 message 裡同時發出多個 Groundlane tool call（平行 tool call），但不可以派 subagent。

---

## 執行流程

```bash
# Step 1: 準備
git checkout main
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

# Step 2: 冪等檢查
[ -f "src/data/daily-signals/${TODAY}.json" ] && echo "已產出" && exit 0

# Step 3: 讀 watchlist（比對公司名時用）
#   重點欄位：companies[].name, companies[].slug, companies[].section
cat src/data/agent-watchlist.json | jq '.companies | length'

# Step 4: 讀 schema（確認 JSON 結構和 category 枚舉）
cat src/data/daily-signals/schema.ts

# Step 5: 執行「搜尋方法」逐個來源掃描（第二層開始前先讀 references/official-blog-urls.md）
# Step 6: 執行「信號處理」過濾、分類、交叉驗證
# Step 7: 寫入 JSON（動筆前先讀 references/output-example.md）
# Step 8: 更新跨天去重檔案
#   把本次收錄的所有 sourceUrl 追加到 seen-signal-urls.txt
echo "${TODAY}: $(jq -r '[.signals[].sourceUrl] | join(", ")' src/data/daily-signals/${TODAY}.json)" >> src/data/daily-signals/seen-signal-urls.txt
# Step 9: 有例外（toolDegradation、來源掛掉）才寫 .work/daily-log/${TODAY}/daily-digest-signals.md；不碰 progress.txt（見 daily-digest-common E3）
# Step 10: 提交（含 push 失敗 retry）
git add src/data/daily-signals/${TODAY}.json src/data/daily-signals/seen-signal-urls.txt
[ -f ".work/daily-log/${TODAY}/daily-digest-signals.md" ] && git add ".work/daily-log/${TODAY}/daily-digest-signals.md"
git commit -m "chore(daily): signals ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Groundlane `web_search` | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | Groundlane `web_fetch` | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（arxiv API、GitHub `gh` CLI） | 有 API 的來源不用搜尋工具 |

搜尋工具 fallback：Groundlane 優先；Groundlane 失效不是 blocker，要依序走完整條 fallback 鏈（降級時記錄 `toolDegradation`），整條都失敗才登錄 escalation-queue；`stealth_fetch`、`web-fetch/fetch_page` 已退役，不得使用。完整順序、判斷方式與限速見 `.agents/skills/daily-digest-common/SKILL.md` 的「搜尋工具 fallback 鏈」一節——第一次要降級前先讀該節。

---



## 搜尋方法

三層策略，總共約 94 次呼叫（搜尋 API 19 次，其餘為已知 URL 直讀）：

1. **廣域主題查詢**（9 個 Groundlane `web_search`）— 不限特定公司，按主題掃全網
2. **官方 blog 直讀**（約 75 個 Groundlane `web_fetch`）— 直接抓 blog 列表頁讀日期，0 搜尋配額
3. **社群 + 全球區域來源**（Groundlane `web_search`）— HN、Reddit，加上東亞、東南亞、南亞、歐洲、中東、非洲、拉丁美洲與大洋洲

所有結果在 Step 6b 用 watchlist 293 家公司名比對，未在第二層的公司靠廣域查詢兜底。

### 第一層：廣域主題查詢（Groundlane `web_search` × 8）

覆蓋整個 AI 生態，不綁特定公司。

```
工具：Groundlane MCP → web_search
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
| 9 | `AI agent governance identity permissions audit` | 企業 agent 治理（身分、權限、稽核）；category 依內容判斷，不一律標 `regulation` |

### 第二層：官方 blog 直讀（Groundlane `web_fetch`，0 搜尋配額）

直接抓每家的 blog 列表頁，讀日期判斷有沒有新文章。不用搜尋 API。

```
工具：Groundlane `web_fetch`。若直讀被擋，可調整同一工具的 `render`／timeout／output 上限；仍失敗就改用 fallback 鏈下一層工具重試；若全部失敗則記錄該來源無法確認。
prompt: "List the 5 most recent articles with their title and published date. Format: DATE | TITLE"
```

**開始第二層前，先完整讀 `references/official-blog-urls.md`**——約 75 個列表頁 URL 全在那份檔案（A1 大廠、HuggingFace 社群 + 模型 trending、HuggingFace + GitHub 模型/repo 動態追蹤、A2 模型公司、B1/B2 開發工具與框架、中國大廠、AI 生態 / VC / 獨立媒體，共七組），每一列都要抓，不可憑記憶挑幾家。

處理方式：
1. 抓回最近 5 篇的日期和標題
2. 只保留 48 小時內的文章
3. 今天沒發文的公司 = 0 筆，正確行為
4. 有新文章的，把標題和 URL 加入信號候選

### 第三層：社群 + 全球區域來源

**社群（Groundlane `web_search` × 3）**

```
工具：Groundlane MCP → web_search
max_results: 5 each
```

| # | query |
|---|-------|
| 1 | `site:news.ycombinator.com AI agent LLM tool` |
| 2 | `site:reddit.com/r/MachineLearning AI agent` |
| 3 | `site:reddit.com/r/LocalLLaMA model release` |

**全球區域矩陣（Groundlane `web_search` × 8）**

```
工具：Groundlane MCP → web_search
每個查詢：max_results: 8, time_range: "day"
不同區域的查詢可在同一個 message 內平行發出，但不可派 subagent。
```

| # | 區域 | query |
|---|---|---|
| 1 | 東亞 | `(Taiwan OR China OR Hong Kong OR Japan OR Korea) AI agent launch regulation funding`；另保留 `site:ithome.com.tw`／`site:bnext.com.tw`／`site:36kr.com` 等中文來源候選 |
| 2 | 東南亞 | `(Singapore OR Indonesia OR Vietnam OR Thailand OR Philippines OR Malaysia) AI agent launch regulation funding` |
| 3 | 南亞 | `(India OR Pakistan OR Bangladesh OR Sri Lanka) AI agent launch regulation funding` |
| 4 | 歐洲 | `Europe AI agent launch regulation funding EU AI Act` |
| 5 | 中東 | `(Israel OR Saudi Arabia OR UAE OR Qatar) AI agent launch regulation funding` |
| 6 | 非洲 | `(Africa OR South Africa OR Nigeria OR Kenya OR Egypt) AI agent launch regulation funding` |
| 7 | 拉丁美洲 | `(Latin America OR Brazil OR Mexico OR Chile OR Colombia OR Argentina) AI agent launch regulation funding` |
| 8 | 大洋洲 | `(Australia OR New Zealand) AI agent launch regulation funding` |

北美不另開第九個區域查詢：第一層 9 個英文廣域查詢與第二層美國／加拿大公司官方來源已高度覆蓋北美。信號處理時仍要把北美列入覆蓋稽核，不能把它當成不需檢查的預設基準。

這是**檢索覆蓋要求，不是收錄配額**。每組都必須真的查過；找不到 48 小時內、來源可靠且跟 AI 直接相關的事件時，0 筆是正確結果，不得拿舊聞、泛市場報告或薄弱轉載補數量。以色列歸入中東；澳洲與紐西蘭歸入大洋洲。

### API 用量摘要

| 工具 | 查詢數 | 說明 |
|------|--------|------|
| Groundlane `web_search`（廣域） | 9 | AI 生態主題 |
| Groundlane `web_search`（區域） | 8 | 全球區域矩陣 |
| Groundlane `web_search`（社群） | 3 | HN + Reddit |
| Groundlane `web_fetch` | 約 75 | 官方 blog/research/HF/GitHub 直讀（0 搜尋配額） |
| **總計** | **約 95** | 搜尋 API 共 20 次，其餘為已知 URL 直讀 |

### 去重與時間過濾

所有來源合併後，依序執行：

1. **URL 去重**：同一 URL 只保留一筆
2. **跨天去重**：讀取 `src/data/daily-signals/seen-signal-urls.txt`，排除已收錄過的 URL
3. **時間過濾**：
   - 有 published date 的結果：只保留 48 小時內的（`>= ${YESTERDAY}`）
   - published date 為 N/A 的結果：**保留但標記** `"dateConfidence": "unverified"`
   - **CCR 環境的 Groundlane `web_search` 不支援 `startPublishedDate` 參數**，所以必須在這一步手動過濾，不能依賴搜尋工具的日期篩選

此時應有 50-100 則原始結果。

---

## 信號處理

### Step 6a：初篩（排除不相關）

排除條件：
- 跟 AI 應用/產品/產業完全無關（純硬體、純晶片、非 AI 的軟體新聞）
- 跟 AI 從業者無關的純學術研究（純數學證明、純理論物理、不涉及模型或應用的基礎科學）
- 純廣告或付費內容推廣
- 內容空洞（只有標題沒有實質內容的帖子）
- published date 確認超過 7 天的結果（即使搜尋工具回傳了）

保留條件（即使不直接涉及 Agent）：
- 模型發佈、定價變動、benchmark 異動（影響 AI 從業者的成本和選型）
- 多模態、語音、影片生成能力（決定 agent 能做什麼）
- AI 法規、政策（影響 agent 能部署在哪裡）
- AI 融資、併購（產業格局變化）
- 推理基礎設施、算力動態（影響所有 AI 應用）

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

---

## 完整範例

**Step 7 寫入 JSON 前，先讀 `references/output-example.md`**（一份寫好的 5 則 signals JSON，對照欄位寫法、摘要長度與 `crossValidationSources` 的填法）。沒讀過不要動筆。

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
- [ ] 全球區域矩陣 8 組皆已實際查詢；以色列歸中東、澳洲／紐西蘭歸大洋洲，0 筆區域是查無合格事件而非漏搜
- [ ] `region-news` 沒有只集中在東亞；若最終仍只有 1-2 個宏觀區域，已重新檢查其他區域候選的日期、來源與排除理由
- [ ] commit 包含 JSON + seen-signal-urls.txt 兩個檔案
- [ ] commit message 是 `chore(daily): signals ${TODAY}`（不是 `post(daily)`）
