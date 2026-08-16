---
name: daily-digest-funding
description: "Routine H: event-driven AI/Agent Series A+ funding alert for quidproquo.cc/daily. No qualifying funding = no output."
---

# daily-digest-funding

偵測 AI/Agent 領域的 Series A 以上融資事件。事件驅動——沒有符合條件的融資就不產出。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 冪等檢查
ls src/content/posts/daily/${TODAY}-funding-*.md 2>/dev/null && echo "已產出" && exit 0

# Step 3: 讀 watchlist（用於判斷融資公司是否在追蹤名單）
cat src/data/agent-watchlist.json | jq '[.companies[].name]' | head -50

# Step 4: 執行「搜尋方法」取得融資新聞
# Step 5: 執行「篩選規則」
# Step 6: 若無符合條件的融資 → 輸出「今日無融資消息」結束
# Step 7: 依「輸出格式」撰寫文章（每筆融資獨立一篇）
# Step 8: 提交
git add src/content/posts/daily/${TODAY}-funding-*.md
git commit -m "post(daily): funding alert ${TODAY}"
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

### Step 4a：用 Exa + Tavily 合併搜尋融資新聞（，跑 3 組查詢）

```
工具：mcp Exa → web_search_exa
每組設定：
  numResults: 10
  startPublishedDate: "{昨天 ISO 日期}"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `AI startup funding Series raises million 2026` | 英文融資新聞 |
| Q2 | `AI agent startup Series round valuation 2026` | Agent 特定融資 |
| Q3 | `site:businesswire.com OR site:prnewswire.com AI funding 2026` | 官方新聞稿 |

### 注意：Tavily 與 Exa 平行執行

```
工具：mcp Tavily → tavily_search
query: "AI agent startup funding Series 2026"
days: 1
maxResults: 10
```

### Step 4c：檢查 aifunding.me（Agent 融資專門追蹤站）

```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
url: "https://aifunding.me"
formats: ["markdown"]
onlyMainContent: true
```

從頁面內容中提取過去 24 小時的新增融資記錄。

### Step 4d：交叉驗證

**每筆融資必須有至少 2 個獨立來源確認**：
- 來源 1：新聞報導（TechCrunch / VentureBeat / Bloomberg 等）
- 來源 2：官方新聞稿（businesswire / prnewswire）或公司官方公告

只有 1 個來源的融資消息 → 降級為「未確認」，在文章中標註 ⚠️。

### Step 4e：取得融資詳情

對確認的融資事件，用 firecrawl 抓取原始報導全文：

```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
url: "{報導 URL}"
formats: ["markdown"]
onlyMainContent: true
```

從報導中提取：公司名稱、輪次、金額、領投、跟投、估值、公司簡介、資金用途。

---

## 篩選規則

### Step 5：判斷是否符合報導門檻

| 條件 | 動作 |
|---|---|
| Series A 以上（A/B/C/D/E/IPO） | ✅ 寫 |
| watchlist 公司的任何輪次（含 Seed） | ✅ 寫 |
| AI Agent 領域的 Seed 輪 ≥ $10M | ✅ 寫 |
| 非 AI 公司的 AI 部門投資 | ❌ 跳過 |
| Seed 輪 < $10M 且不在 watchlist | ❌ 跳過 |
| 純硬體/晶片公司（除非直接影響 Agent） | ❌ 跳過 |
| 無法確認金額的傳聞 | ❌ 跳過 |

**一天有多筆融資**：每筆獨立成篇。最多 3 篇，超過的留到隔天。

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-funding-{company-slug}.md`

範例：`2026-08-17-funding-zenguard.md`

### Frontmatter

```yaml
---
title: "融資速報｜{公司名稱} {輪次} ${金額}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, funding, daily, {company-slug}, {sector-tag}]
lang: zh-TW
description: "一句話概述公司和這輪融資的意義"
tldr: "{公司}完成{輪次}，由{領投}領投，估值{估值}。{一句話這筆錢代表的趨勢}。"
series:
  name: "AI Agent Funding"
  order: N
---
```

`sector-tag` 從 watchlist section 對應：`agent-security`、`agent-framework`、`agent-platform`、`coding-agent` 等。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | {名稱}（{國家}） |
| 輪次 | {Series A / B / C / ...} |
| 金額 | ${精確金額}M |
| 領投 | {領投方} |
| 跟投 | {跟投方，逗號分隔} |
| 估值 | ${精確金額}B（{前一輪估值對比}） |
| 累計融資 | ${累計金額}M |
| 成立年份 | {年} |
| 員工數 | ~{N} 人（{來源}） |

## 這家公司做什麼

{2-3 段。第一段用一句話定義公司（「X 是做 Y 的 Z」）。第二段解釋核心產品和技術差異化。第三段說目前的客戶/營收/市場地位。}

## 這筆融資的信號

{2-3 段分析。不是重複融資金額，而是回答「所以呢」：}

### 對 Agent 生態的意義

{這筆錢會用來做什麼？會改變哪個子領域的格局？}

### 投資人在賭什麼

{領投方的投資邏輯。這個 VC 之前投了什麼同類公司？為什麼選這家？}

### 值得觀察的數字

{營收增速、客戶數、ARR、對比同輪次的其他公司。用具體數字說話。}

## Watchlist 狀態

{如果公司已在 watchlist：「已在 watchlist section {X}，追蹤重點更新為 {Y}」}
{如果公司不在 watchlist：「建議加入 watchlist section {X}，理由：{Y}」}

## 我今天學到什麼

{1-2 句認知差。}

## 來源

- [{來源 1 標題}]({URL})
- [{來源 2 標題}]({URL})
```

---

## 完整範例

```markdown
---
title: "融資速報｜ZenGuard Series B $50M"
date: 2026-08-17
category: daily
tags: [ai-agent, funding, daily, zenguard, agent-security]
lang: zh-TW
description: "Agent 安全新創 ZenGuard 完成 $50M B 輪，Lightspeed 領投，專注 Agent runtime 行為監控"
tldr: "ZenGuard 完成 $50M Series B，由 Lightspeed Venture Partners 領投，估值 $400M。這筆錢代表 VC 開始把 Agent 安全從「nice-to-have」升級為「必須投資」的基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 2
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | ZenGuard（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $50M |
| 領投 | Lightspeed Venture Partners |
| 跟投 | Accel, a16z, Y Combinator |
| 估值 | $400M（Series A 時為 $120M，3.3x 增長） |
| 累計融資 | $72M |
| 成立年份 | 2024 |
| 員工數 | ~85 人（LinkedIn） |

## 這家公司做什麼

ZenGuard 是做 Agent runtime 安全的公司——當你的 Agent 在生產環境執行時，ZenGuard 即時監控它的每一步行為，在它做出有害操作前攔截。

核心產品是一個 Agent 行為監控平台，部署在 Agent 和工具之間（類似 API gateway 的位置）。它用規則引擎 + LLM 判斷器雙層架構：規則引擎處理已知攻擊模式（prompt injection 特徵碼），LLM 判斷器處理未知的可疑行為。延遲開銷 < 50ms。

目前客戶包括 3 家 Fortune 500 企業和 15 家中型 SaaS 公司，ARR 約 $8M（估算，公司未正式公布）。在 Agent 安全這個子領域，ZenGuard 和 Zenity（以色列，$38M Series B）是目前融資最多的兩家。

## 這筆融資的信號

### 對 Agent 生態的意義

$50M B 輪在 Agent 安全領域是目前第二大（僅次於 Zenity 的 $38M + $27M C 輪合計）。這筆錢計劃用於：(1) 擴展到歐洲市場（GDPR + EU AI Act 合規需求）；(2) 建立 Agent 行為的 benchmark 資料集；(3) 從監控擴展到自動修復（remediation）。

### 投資人在賭什麼

Lightspeed 之前投了 Wiz（雲安全，$10B 收購價）和 Snyk（開發者安全）。投 ZenGuard 的邏輯是「Agent 安全 = 下一代的 DevSecOps」——每個部署 Agent 的企業都需要一個行為監控層，就像每個部署容器的企業都需要雲安全。

### 值得觀察的數字

- 估值從 $120M → $400M（9 個月內 3.3x），高於 B 輪中位數的 2x 漲幅
- ARR ~$8M，意味著估值倍數約 50x——比同階段 SaaS 的 20-30x 高出一倍，反映市場對 Agent 安全的溢價期待
- 85 人團隊中約 60% 是工程師（LinkedIn 統計），研發密度高

## Watchlist 狀態

ZenGuard 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理），追蹤重點：Agent runtime 行為監控，$50M Series B，Lightspeed 領投。

## 我今天學到什麼

之前以為 Agent 安全是「等市場成熟再說」的後期需求，但 Lightspeed 用 $50M 賭它是「現在就要投」的基礎設施——他們在 Wiz 身上學到的教訓是：安全工具的最佳投資時機不是威脅大爆發後，而是部署量開始起飛時。

## 來源

- [ZenGuard Raises $50M Series B to Secure AI Agents in Production](https://www.businesswire.com/news/home/20260817005432)
- [Agent Security Startup ZenGuard Lands $50M at $400M Valuation](https://techcrunch.com/2026/08/17/zenguard-series-b/)
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 融資資訊表完整（公司/輪次/金額/領投/跟投/估值/累計融資）
- [ ] 金額精確，不寫「約」——寫 `$50M` 不寫 `約五千萬美元`
- [ ] 估值有前一輪對比（X → Y，Nx 增長）
- [ ] 「投資人在賭什麼」有 VC 的投資邏輯和歷史投資對比
- [ ] 「值得觀察的數字」有至少 2 個具體數字和 benchmark 對比
- [ ] 至少 2 個獨立來源確認，來源列表完整
- [ ] Watchlist 狀態：已在清單則更新追蹤重點，不在則建議加入的 section
- [ ] 「我今天學到什麼」是認知差
- [ ] description 和 tldr 已填寫
