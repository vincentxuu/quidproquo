---
name: daily-digest-region
description: "Routine M: weekly regional AI ecosystem focus for quidproquo.cc/daily. Runs every Friday, deep-dives into 1-2 regions (China/Taiwan/Japan-Korea/Europe/Israel/SEA/Middle East/India)."
---

# daily-digest-region

每週五執行。從本週的信號和補充搜尋中，選出最有料的 1-2 個區域深入寫。必含對台灣創業者的啟示。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 計算本週範圍
WEEK_START=$(date -d "${TODAY} -$(date -d ${TODAY} +%u) days + 1 day" +%Y-%m-%d)

# Step 3: 冪等檢查（region 可能產出多篇，但同一 region 同一天只一篇）
ls src/content/posts/daily/${TODAY}-region-*.md 2>/dev/null && echo "已有 region post" && exit 0

# Step 4: 讀 watchlist 的 F1-F8 區域公司
cat src/data/agent-watchlist.json | jq '[.companies[] | select(.section | startswith("F"))]'

# Step 5: 讀取本週 signals，篩選區域相關
# Step 6: 補充搜尋各區域新聞
# Step 7: 決定寫哪個區域
# Step 8: 依「輸出格式」撰寫
# Step 9: 提交
git add src/content/posts/daily/${TODAY}-region-*.md
git commit -m "post(daily): region focus ${TODAY}"
git push origin main
```

---

## 輸入來源

### Step 5：從本週 signals 篩選區域信號

```bash
for d in $(seq 0 6); do
  DAY=$(date -d "${WEEK_START} + ${d} days" +%Y-%m-%d)
  [ -f "src/data/daily-signals/${DAY}.json" ] && cat "src/data/daily-signals/${DAY}.json"
done
```

篩選邏輯：
- `companies` 欄位包含 F1-F8 section 的 slug → 該信號屬於對應區域
- `category` 為 `region-news` → 直接歸入區域
- 統計每個區域（F1-F8）本週的信號數量

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Exa + Tavily **兩個都跑** | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | stealth_fetch 優先 → firecrawl backup | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（arxiv API、GitHub `gh` CLI） | 有 API 的來源不用搜尋工具 |

---



## 搜尋方法

### Step 6：對每個區域做 1 組補充搜尋

用 Exa + Tavily 合併搜尋，每組取 5 則。**只搜尋前 3 名信號最多的區域**（節省 API 額度）。中文/台灣區域加重 Tavily（中文效果較好）。

#### F1 中國

```
工具：mcp Exa → web_search_exa
```

| query | 目標 |
|---|---|
| `site:36kr.com AI agent 大模型 2026` | 36kr AI 新聞 |
| `site:jiqizhixin.com AI agent 模型 2026` | 機器之心 |
| `DeepSeek OR Zhipu OR Qwen AI agent 2026` | 中國三大 Agent 相關模型廠 |

```
每組：numResults: 5, startPublishedDate: "{WEEK_START}T00:00:00Z"
```

#### F2 台灣

| query | 目標 |
|---|---|
| `site:ithome.com.tw AI 人工智慧 agent 2026` | iThome |
| `site:bnext.com.tw AI 人工智慧 2026` | 數位時代 |
| `台智雲 OR MaiAgent OR Appier OR 聯發科 AI 2026` | 台灣 AI 公司動態 |

#### F3 日韓

| query | 目標 |
|---|---|
| `site:asia.nikkei.com AI agent 2026` | Nikkei Asia |
| `site:koreaherald.com AI agent 2026` | Korea Herald |
| `SoftBank AI agent OR NAVER AI 2026` | 日韓大廠 |

#### F4 歐洲

| query | 目標 |
|---|---|
| `Mistral AI 2026 release OR update` | Mistral 動態 |
| `"EU AI Act" 2026 enforcement OR compliance` | EU AI Act 進展 |
| `Aleph Alpha OR Dust OR Poolside AI 2026` | 歐洲 AI 公司 |

#### F5 以色列

| query | 目標 |
|---|---|
| `Zenity OR AI21 OR Lightricks AI agent 2026` | 以色列 AI 公司 |

#### F6 東南亞

| query | 目標 |
|---|---|
| `"Sea Group" OR Grab OR "Pints AI" AI agent 2026` | 東南亞大廠 |
| `MAS AI governance OR "AI Singapore" 2026` | 新加坡政策 |

#### F7 中東

| query | 目標 |
|---|---|
| `G42 OR MBZUAI OR SDAIA AI 2026` | 中東 AI 機構 |

#### F8 印度

| query | 目標 |
|---|---|
| `Emergent OR Krutrim OR "Sarvam AI" 2026` | 印度 AI 新創 |

---

## 區域選擇規則

### Step 7：決定寫哪 1-2 個區域

1. 統計每個區域的「本週信號量 + 補充搜尋命中量」
2. 選信號量最高的 1 個區域深入寫
3. 若第 2 名的信號量 ≥ 第 1 名的 50% → 也寫第 2 個區域（產出 2 篇）
4. 若所有區域信號量都 < 3 → 合併寫一篇「本週區域總覽」

**區域 slug 對應**：

| Section | slug | 中文名 | 英文名 |
|---|---|---|---|
| F1 | `china` | 中國 | China |
| F2 | `taiwan` | 台灣 | Taiwan |
| F3 | `japan-korea` | 日韓 | Japan & Korea |
| F4 | `europe` | 歐洲 | Europe |
| F5 | `israel` | 以色列 | Israel |
| F6 | `southeast-asia` | 東南亞 | Southeast Asia |
| F7 | `middle-east` | 中東 | Middle East |
| F8 | `india` | 印度 | India |

---

## 中文來源交叉驗證規則

**中文來源涉及具體數字時，必須嘗試交叉驗證**：

| 宣稱類型 | 驗證方式 |
|---|---|
| 融資金額 | 搜尋英文來源（TechCrunch/VentureBeat）確認 |
| 用戶數/營收 | 搜尋公司官方英文公告 |
| 技術宣稱（benchmark 分數） | 查 arxiv 原文或官方 blog |
| 政策引述 | 查政府官方網站原文 |

若無法交叉驗證 → 在文中標注「⚠️ 僅見於 {來源}，待交叉驗證」。

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-region-{region-slug}.md`

例：`2026-08-22-region-china.md`

### Frontmatter

```yaml
---
title: "區域焦點｜{中文區域名}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, region, daily, {region-slug}]
lang: zh-TW
description: "一句話概述本週該區域最重要的動態"
tldr: "3-5 行重點"
series:
  name: "AI Region Focus"
  order: N
---
```

`order` 計算：按 region focus 的累計篇數遞增（第 1 篇 = 1，不分區域）。

### 內容結構

```markdown
## 區域：{中文區域名}

{1-2 句介紹：本週這個區域為什麼值得關注。}

## 本週重要動態

### {動態 1 標題}

{2-3 段落。附來源連結。涉及中文來源的數字須標注驗證狀態。}

### {動態 2 標題}

{...}

### {動態 3 標題}

{...}

## 深度分析

{用 MIS 框架分析本週該區域的動態。
 用「我認為」開頭標記觀點。
 明確標記使用了哪個框架。

 重點關注：
 - 該區域的 AI 生態與全球主流生態的差異
 - 區域政策對 Agent 開發的影響
 - 跨區域合作或競爭的信號}

## 對台灣創業者的啟示

{針對台灣創業者的具體行動建議。
 不是「值得關注」，而是「如果你在做 X，應該考慮 Y」。
 連結到台灣的具體市場或政策環境。}

## 今日收穫

{1-3 句認知差。「之前以為 X，現在知道 Y」。}
```

---

## 完整範例

```markdown
---
title: "區域焦點｜中國"
date: 2026-08-22
category: daily
tags: [ai-agent, region, daily, china]
lang: zh-TW
description: "DeepSeek 開源 Agent 框架挑戰 LangGraph，阿里通義整合釘釘做企業 Agent 平台"
tldr: "DeepSeek 開源 Agent 編排框架 DeepAgent，定位為 LangGraph 的中國替代方案，整合自家推理模型；阿里通義 Qwen Office 整合釘釘，9000 萬企業用戶可直接呼叫 Agent；中國國家網信辦（CAC）發佈 Agent 管理辦法徵求意見稿"
series:
  name: "AI Region Focus"
  order: 5
---

## 區域：中國

本週中國 AI Agent 生態有三個值得注意的動態：框架層出現開源挑戰者、企業平台做生態整合、政策端開始正式觸及 Agent 治理。

## 本週重要動態

### DeepSeek 開源 Agent 編排框架 DeepAgent

DeepSeek 在 GitHub 上開源 DeepAgent，定位為 LangGraph 的中國替代方案。框架原生支援 DeepSeek-R1 和 V3 模型的推理能力，內建工具呼叫、記憶管理和多 Agent 協作。一週內 GitHub stars 破 8k。（[來源](https://github.com/deepseek-ai/deepagent)）

技術亮點：推理延遲比 LangGraph + Claude 組合低 40%（⚠️ DeepSeek 自測，使用自家推理基礎設施，需獨立複現），原因是框架和模型的推理路徑做了端到端最佳化。

### 阿里通義 Qwen Office 整合釘釘

阿里雲發佈 Qwen Office Agent 平台，直接整合釘釘（中國最大企業通訊平台，9000 萬企業用戶）。員工可在釘釘對話框中呼叫 Agent 完成文件處理、日程安排、審批流程等任務。（[36kr 來源](https://36kr.com/p/12345) · [阿里雲官方公告](https://www.alibabacloud.com/blog/qwen-office)）

### 國家網信辦發佈 Agent 管理辦法徵求意見稿

中國國家網信辦（CAC）發佈《人工智能代理服務管理辦法（徵求意見稿）》，首次將 AI Agent 單獨列為監管對象。要點包括：Agent 必須明確告知用戶其為 AI、Agent 的自主操作需要用戶授權、Agent 服務提供者需備案。徵求意見截止 9/15。（[CAC 官網](http://www.cac.gov.cn/2026-08/agent-rules)）

## 深度分析

我認為本週中國 AI Agent 生態最值得注意的信號是「自建全棧」的策略趨勢。

從五力分析的角度：DeepSeek 同時做模型和框架（DeepAgent），阿里同時做模型和企業平台（Qwen + 釘釘）。這和美國生態的「分層解耦」（Anthropic 做模型、LangGraph 做框架、Cursor 做 IDE）形成鮮明對比。中國廠商傾向於垂直整合——因為中國市場的轉換成本特別高：一旦企業用了釘釘 + Qwen Agent，要遷移到其他方案意味著同時換通訊平台、換模型、換框架，三層鎖定。

CAC 的管理辦法則增加了新的競爭門檻（五力的「進入壁壘」）：備案要求和合規成本讓小型 Agent 服務商更難生存，有利於已有合規團隊的大廠。

## 對台灣創業者的啟示

- 如果你的產品想進中國市場：Agent 管理辦法意味著你需要在中國有實體並完成備案才能提供 Agent 服務，光靠 SaaS 出海行不通
- 如果你在做 Agent 框架：DeepAgent 的「模型+框架端到端最佳化」思路值得借鑑——台灣的聯發科如果出端側 AI Agent 晶片，也需要框架層和硬體層做端到端最佳化
- 如果你在做企業 AI：中國的「超級 App 整合」路線（釘釘 + Agent）不適用台灣（台灣沒有類似的企業超級 App），台灣的 Agent 落地更可能走 MCP 式的開放整合

## 今日收穫

之前以為中國 AI 生態和美國的差異主要在「模型能力差距」，這週看了 DeepAgent + Qwen Office 的佈局後發現，真正的差異不在模型層而在生態結構——中國走垂直整合（一家通吃三層），美國走水平分工（每層有獨立贏家）。這兩種結構各有優劣，但對台灣創業者的啟示是：不要照搬任何一邊的架構，而是看台灣的市場結構最適合哪種。
```

---

## 品質檢查清單

- [ ] 區域選擇有據（基於本週信號量統計，不是隨便選的）
- [ ] 本週動態至少 3 個，每個都有來源連結
- [ ] 中文來源的具體數字已嘗試交叉驗證（或標注 ⚠️）
- [ ] 「深度分析」使用了至少 1 個 MIS 框架（明確標記）
- [ ] 「對台灣創業者的啟示」給的是具體建議（「如果你在做 X：Y」），不是泛泛的「值得關注」
- [ ] 「今日收穫」是認知差
- [ ] region slug 正確（china/taiwan/japan-korea/europe/israel/southeast-asia/middle-east/india）
- [ ] `description` 和 `tldr` 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
