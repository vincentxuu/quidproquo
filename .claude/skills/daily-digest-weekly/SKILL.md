---
name: daily-digest-weekly
description: "Routine L: weekly AI Agent review for quidproquo.cc/daily. Runs every Friday, synthesizes the week's outputs into a cognitive-diff review with watchlist update suggestions."
---

# daily-digest-weekly

每週五執行。讀取本週所有日報產出和中繼檔，彙整成認知差式週回顧（不是摘要）。附 Watchlist 更新建議和新創雷達。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

# Step 2: 冪等檢查
[ -f "src/content/posts/daily/${TODAY}-weekly-review.md" ] && echo "已產出" && exit 0

# Step 3: 計算本週日期範圍（週一到今天）
WEEK_START=$(date -d "${TODAY} -$(date -d ${TODAY} +%u) days + 1 day" +%Y-%m-%d)
echo "本週範圍: ${WEEK_START} ~ ${TODAY}"

# Step 4: 讀取所有輸入（見下方）
# Step 5: 彙整撰寫（見輸出格式）
# Step 6: 提交
git add src/content/posts/daily/${TODAY}-weekly-review.md
git commit -m "post(daily): 週回顧 ${TODAY}"
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



## 輸入來源

### Step 4a：讀取本週所有 blog posts

```bash
# 列出本週的所有 daily posts
ls src/content/posts/daily/ | grep -E "^(${WEEK_START//./\\.}|...)" | sort

# 實務上用日期範圍過濾：
for d in $(seq 0 6); do
  DAY=$(date -d "${WEEK_START} + ${d} days" +%Y-%m-%d)
  ls src/content/posts/daily/${DAY}-*.md 2>/dev/null
done
```

對每篇 post 讀取：
- frontmatter 的 `title`、`tldr`、`tags`
- 內容的「今日重點摘要」或「TL;DR」段落
- 內容的「今日收穫」段落

**不需要讀全文**——只讀 frontmatter + 關鍵段落即可控制 context window。

### Step 4b：讀取本週所有 signals JSON

```bash
for d in $(seq 0 6); do
  DAY=$(date -d "${WEEK_START} + ${d} days" +%Y-%m-%d)
  [ -f "src/data/daily-signals/${DAY}.json" ] && echo "Found: ${DAY}.json"
done
```

從每個 signals JSON 中提取：
- 本週出現頻率最高的公司（用於 Watchlist 更新建議）
- 本週 relevance ≥ 0.9 的高影響力信號
- 不在 watchlist 中但本週出現 3+ 次的新公司（用於新創雷達）

### Step 4c：讀取 watchlist（比對新公司）

```bash
cat src/data/agent-watchlist.json | jq '[.companies[].slug]' > /tmp/watchlist-slugs.txt
```

---

## 彙整規則

### 「本週最重要的 5 件事」的選擇標準

從本週所有信號和文章中，選出最重要的 5 件事。排序標準：

| 優先級 | 標準 | 範例 |
|---|---|---|
| P1 | 改變 Agent 生態格局的事件 | 大廠發佈新平台、重大併購、開源重磅項目 |
| P2 | 刷新認知的研究成果 | 論文推翻常見假設、benchmark 大洗牌 |
| P3 | 對開發者有直接影響的變化 | 框架 breaking change、API sunset、定價大幅調整 |
| P4 | 融資/商業信號指向的趨勢 | 某子領域連續多筆融資 |
| P5 | 政策/法規的實質影響 | 法案生效、執法案例 |

**每件事寫一段（不是一句話）**，重點是「這件事改變了什麼」而非「發生了什麼」。

### 「本週認知更新」的寫法

**嚴格使用句式**：「之前以為 X，現在知道 Y」

不是：「本週學到了 RAG 很重要」（這是摘要）
而是：「之前以為 RAG 的瓶頸在向量資料庫選型，這週讀了三篇記憶管理論文後知道真正的瓶頸是 retrieval 的召回策略——資料庫只是基礎設施，策略才是差異化」

### 「觀察與洞察」的 MIS 框架

同 `daily-digest-report` 的 MIS 框架要求。但週回顧可以做更大的推論——因為有一整週的數據支撐。

### Watchlist 更新建議

**新增候選**（🆕）：
1. 統計本週所有 signals 中不在 watchlist 的公司出現次數
2. 出現 ≥ 3 次 → 列為新增候選
3. 附上：公司名、做什麼、本週出現的來源、建議放入哪個 section

**移除候選**（⚠️）：
- **門檻極高**：只有公司**確認關閉**或**明確宣佈轉離 Agent 領域**才列
- **必須附確認來源**（關閉公告 URL、收購且產品下線的新聞 URL）
- 「最近沒動態」**不構成移除理由**
- 若本週無符合條件的 → 寫 `✅ 無變動`

### 新創雷達

列出本週在任何來源中首次出現的新公司（不在 watchlist 中、不在上週的 signals 中）：
- 名稱
- 做什麼（一句話）
- 融資階段（若已知）
- 為什麼值得注意（一句話）

---

## 輸出格式

### Frontmatter

```yaml
---
title: "AI Agent 週回顧 — YYYY-MM-DD"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "一句話概述本週最大的認知變化"
tldr: "3-5 行本週最重要的認知差"
series:
  name: "AI Agent 週回顧"
  order: N
---
```

`order` 計算：距離 2026-08-16 的週數 + 1（2026-08-16 所在週 = 1）。

### 內容結構

```markdown
## 本週最重要的 5 件事

### 1. {事件標題}

{一段文字。重點是「這件事改變了什麼」。附來源連結。}

### 2. {事件標題}

{...}

（共 5 件）

## 本週認知更新

- 之前以為 {X}，現在知道 {Y}——{一句話解釋轉變原因}
- 之前以為 {X}，現在知道 {Y}——{...}

（列 2-4 個認知變化）

## 企業落地觀察

{用 MIS 框架分析本週的企業落地案例。
 用「我認為」開頭標記觀點。
 明確標記使用了哪個框架（交易成本/互補資產/網路效應/五力/轉換成本）。}

## 下週值得追蹤的

- {預告事件 1}（預計日期，為什麼重要）
- {預告事件 2}
- {預告事件 3}

## Watchlist 更新建議

### 🆕 建議加入

| 公司 | 做什麼 | 本週出現次數 | 來源 | 建議 Section |
|---|---|---|---|---|
| {company} | {一句話} | {N} | {sources} | {section} |

### ⚠️ 考慮移除

{公司名 — 理由 — [確認來源](URL)}

或 `✅ 本週無符合移除條件的公司`

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| {company} | {一句話} | {Pre-seed / Seed / A / 未知} | {一句話} |

## 我這週學到什麼

{1-3 句認知差。總結本週最大的認知變化。}
```

---

## 完整範例

```markdown
---
title: "AI Agent 週回顧 — 2026-08-22"
date: 2026-08-22
category: daily
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "本週最大的認知變化：Agent 生態的價值正從模型層移向基礎設施層"
tldr: "Anthropic Agent SDK 2.0 讓 MCP 從協定變成平台；Cursor $500M ARR 證明開發者體驗比模型能力重要；三篇記憶管理論文指向同一個方向——記憶是可以獨立訓練的技能"
series:
  name: "AI Agent 週回顧"
  order: 2
---

## 本週最重要的 5 件事

### 1. Anthropic Agent SDK 2.0 讓 MCP 從「協定」變成「平台」

Agent SDK 2.0 原生支援跨 MCP server 的 tool routing 和 session 記憶管理。這不只是版本更新——它把 MCP 從「你需要自己接的通訊協定」變成「SDK 幫你管的平台服務」。直接影響：所有現有的 MCP server 生態（5000+ 個 server）立刻可以被更容易地組合使用。（[來源](https://www.anthropic.com/news/agent-sdk-2)）

### 2. Cursor 年化 $500M，coding agent 的 PMF 已無爭議

Cursor 的 $500M ARR 是整個 AI Agent 賽道最強的 product-market fit 信號。更值得注意的是 Background Agents 的發佈——把 coding agent 從「互動式助手」推向「自主式工人」。（[來源](https://techcrunch.com/2026/08/16/cursor-500m-arr/)）

### 3. 三篇記憶管理論文指向同一個方向

AutoMem（Stanford）、MemoryBank（CMU）、Context Compression（Stanford）不約而同指出：Agent 記憶管理是一個可以獨立訓練的技能。光優化記憶就能讓效能翻倍。這改變了「記憶只是 prompt engineering」的認知。

### 4. Baseten C 輪 $13B 估值：推理基礎設施比模型更值錢

$150M C 輪，估值超過多數模型公司。市場在說：會推理的基礎設施（低延遲、高吞吐量）比會訓練的團隊更稀缺。（[來源](https://www.businesswire.com/news/baseten-series-c)）

### 5. 台智雲推企業 Agent 平台：台灣從「賣算力」轉向「賣平台」

整合 NVIDIA NIM、強調資料主權（資料不出境）。對台灣 AI 產業的意義是：開始有人不只賣 GPU 時數，而是賣完整的 Agent 開發體驗。（[來源](https://www.ithome.com.tw/news/12345)）

## 本週認知更新

- 之前以為 Agent 記憶的瓶頸是「向量資料庫選型」，現在知道真正的瓶頸是「記憶管理策略本身可以被訓練」——AutoMem 讓 32B 模型靠記憶優化達到 Claude Opus 4.5 水準
- 之前以為 MCP 的價值在於「標準化」，現在知道 Agent SDK 2.0 把 MCP 從標準化推向平台化——差別在於平台會幫你做 routing 和 discovery
- 之前以為 AI 產業的價值主要在模型層，現在看到 Baseten $13B + Cursor $500M ARR 後意識到，基礎設施和開發者工具是新的價值高地

## 企業落地觀察

我認為本週最值得企業注意的信號是 Cursor 的 Background Agents。

從互補資產的角度分析：Cursor 的護城河不是「它用了最好的模型」（它支援多家模型），而是「它擁有最好的 IDE 整合體驗」。背景 Agent 進一步加深了這個互補資產——開發者一旦把持續跑的 coding task 交給 Cursor 的雲端 Agent，遷移成本從「改 IDE」變成「重建整個異步工作流」。

對企業導入的啟示：選 coding agent 時，不要只比模型效能（那會被追平），要看誰的工作流整合最深。

## 下週值得追蹤的

- Google I/O 延伸活動（8/25）：預計公佈 Gemini Agent 新功能
- LangGraph 1.x 正式版可能本週發佈（GitHub milestone 已 100%）
- EU AI Act 第一批條款 8/26 起生效，影響高風險 AI 系統

## Watchlist 更新建議

### 🆕 建議加入

| 公司 | 做什麼 | 本週出現次數 | 來源 | 建議 Section |
|---|---|---|---|---|
| Hyperplane | Agent 記憶基礎設施 | 4 | TechCrunch, HN, Product Hunt, Anthropic blog | B4 |

### ⚠️ 考慮移除

✅ 本週無符合移除條件的公司

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| Hyperplane | Agent 長期記憶基礎設施 | Seed $8M | Anthropic 前員工創辦，SDK 2.0 官方推薦整合 |
| AgentKit | 開源 Agent 測試框架 | 未知 | GitHub 一週破 2k stars |

## 我這週學到什麼

這週最大的認知更新是「基礎設施比模型值錢」。以前覺得 AI 公司的估值排序應該是 模型 > 工具 > 基礎設施，現在看到 Baseten $13B 和 Cursor $500M ARR 後發現實際排序已經翻過來了。原因是模型層的差異化在縮小（各家模型越來越同質），但好的推理基礎設施和開發者體驗有強烈的網路效應和轉換成本。
```

---

## 品質檢查清單

- [ ] 「本週最重要的 5 件事」每件都有一段分析（不是一句話清單）
- [ ] 「本週認知更新」嚴格使用「之前以為 X，現在知道 Y」句式
- [ ] 「企業落地觀察」明確使用了至少 1 個 MIS 框架
- [ ] Watchlist 移除候選附有確認來源 URL（或標記 ✅ 無變動）
- [ ] 新創雷達列出的公司確實不在 watchlist 中
- [ ] 所有事實附來源連結
- [ ] 「我這週學到什麼」是認知差，不是「這週很精彩」
- [ ] `description` 和 `tldr` 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
