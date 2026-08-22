---
name: daily-digest-product-interview
description: "Routine O: daily Product Builder interview prep for quidproquo.cc/daily. Rotates through 7 dimensions weekly, pulls latest case studies and interview questions from the web."
---

# daily-digest-product-interview

每日產出一篇 Product Builder 面試準備文章。每週依星期輪替七個維度，從網路抓取最新素材填充。

---

## 週間主題輪替

| 星期 | 主題 | 涵蓋 | tag |
|------|------|------|-----|
| 一 | Product Sense | 用戶洞察、問題拆解、feature prioritization | product-sense |
| 二 | Metrics & Analytics | 北極星指標、漏斗分析、實驗設計、SQL | metrics |
| 三 | Strategy & Execution | 市場定位、競爭護城河、roadmap、stakeholder management | strategy |
| 四 | AI Product Design | AI-native 產品模式、human-in-the-loop、信任建立 | ai-product |
| 五 | Growth & Experimentation | growth loop、A/B testing、retention、virality | growth |
| 六 | Technical PM | API 設計思維、架構理解、工程協作 | technical-pm |
| 日 | Behavioral & Weekly Review | 領導力故事、衝突處理 + 本週回顧 | behavioral |

---

## 加權輪替

除了固定的星期 → 主題對應外，routine 也會讀 `src/data/interview-focus.json` 的權重設定。使用者可以把弱項的權重調到 2-3，routine 會在該主題的固定日之外，額外加練該主題。

**加權邏輯**：
1. 先按星期決定預設主題
2. 讀 `interview-focus.json` 的 `product-builder.weights`
3. 如果預設主題的權重 > 1，照常產出
4. 如果有其他主題的權重 > 預設主題的權重，有 50% 機率改為產出權重最高的主題
5. 在文章開頭標注「今日加練：{主題}（因為你把這個主題的權重設為 {N}）」

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
DOW=$(TZ=Asia/Taipei date +%u)  # 1=Mon ... 7=Sun

# Step 2: 冪等檢查——已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-product-builder-interview-daily.md" ] && echo "已產出" && exit 0

# Step 2.5: 讀加權設定
cat src/data/interview-focus.json | 讀取 product-builder.weights

# Step 3: 依星期決定主題（可能被加權覆寫）
# DOW=1 → Product Sense
# DOW=2 → Metrics & Analytics
# DOW=3 → Strategy & Execution
# DOW=4 → AI Product Design
# DOW=5 → Growth & Experimentation
# DOW=6 → Technical PM
# DOW=7 → Behavioral & Weekly Review

# Step 4: 執行搜尋，取得今日主題的最新素材
# Step 5: 篩選並整理素材
# Step 6: 撰寫文章
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-product-builder-interview-daily.md
git commit -m "post(daily): product builder interview daily ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Exa + Tavily **兩個都跑** | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | Groundlane web_fetch 優先 → firecrawl backup | 已知 URL 的頁面內容擷取 |

---

## 搜尋方法

### Step 4a：依今日主題組合查詢（Exa + Tavily 各跑 2 組）

每個主題有 2 組預設查詢。對每組同時跑 Exa 和 Tavily，合併結果：

| 主題 | Q1 | Q2 |
|------|----|----|
| Product Sense | `product sense interview question user insight problem decomposition 2026` | `PM interview product design case study feature prioritization` |
| Metrics & Analytics | `product metrics interview north star funnel analysis experiment design 2026` | `PM case study data-driven decision A/B test SQL interview` |
| Strategy & Execution | `product strategy interview market positioning competitive moat roadmap 2026` | `PM execution interview stakeholder management cross-functional leadership` |
| AI Product Design | `AI product design interview human-in-the-loop trust UX 2026` | `AI-native product manager LLM product design case study interview` |
| Growth & Experimentation | `growth PM interview growth loop retention virality A/B testing 2026` | `product-led growth interview experiment design activation funnel` |
| Technical PM | `technical product manager interview API design system architecture 2026` | `technical PM interview engineering collaboration trade-off analysis` |
| Behavioral | `PM behavioral interview leadership influence conflict resolution STAR 2026` | `product manager behavioral question tell me about a time failed` |

**Exa（每組）：**
```
工具：mcp Exa → web_search_exa
numResults: 10
startPublishedDate: "{30 天前的 ISO 日期}"
type: "auto"
```

**Tavily（每組）：**
```
工具：mcp Tavily → tavily_search
query: "{同上 query}"
days: 30
maxResults: 10
```

### Step 4b：去重與篩選

合併所有結果，用 URL 去重。從中選出：
- 1 道練習題（真實面試風格的 case study 或問題）
- 1 個案例（來自真實產品的短案例）
- 2-3 篇延伸閱讀

**篩選優先序：**
1. 具體的面試真題或 case study（Blind、Glassdoor、Reddit PMInterview）
2. 知名產品人寫的深度文章（Lenny's Newsletter、Shreyas Doshi、Gibson Biddle）
3. 產品案例分析（Product Hunt、TechCrunch、公司 blog）
4. 框架整理（Reforge、First Round Review、a16z）

**排除：**
- 純推銷課程或書的 landing page
- 內容淺薄的「PM 面試 Top 10 問題」listicle
- 非英文/中文內容

---

## 輸出格式

### Frontmatter

```yaml
---
title: "Product Builder 面試日練 — {YYYY-MM-DD}：{今日主題}"
date: YYYY-MM-DD
category: daily
tags: [product-builder-interview, daily, {topic-specific-tag}]
lang: zh-TW
description: "{一句話描述今天練什麼}"
tldr: "{今天的核心框架 + 練習重點}"
series:
  name: "Product Builder 面試日練"
  order: N
---
```

`order` 計算：距離 2026-08-20 的天數 + 1（2026-08-20 = 1, 2026-08-21 = 2, ...）。

`{topic-specific-tag}` 從週間輪替表的 tag 欄取值。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 今日主題

{2-3 句說明今天聚焦什麼，為什麼這個主題在面試中重要。}

## 核心框架速記

{1-2 個面試常用框架，每個用結構化方式呈現（步驟或表格）。}

{每個主題有對應的經典框架：}
{- Product Sense: CIRCLES、用戶問題框架}
{- Metrics: AARRR、指標樹}
{- Strategy: Porter's Five Forces、TAM-SAM-SOM}
{- AI Product: Human-AI Task Allocation、Trust Calibration}
{- Growth: Hook Model、Growth Flywheel}
{- Technical PM: RFC 流程、Architecture Decision Record}
{- Behavioral: STAR、Situation-Behavior-Impact}

## 今日練習題

### 題目

{一道真實面試風格的 case study 或問題。}
{註明來源：(來源: Google PM 面試 / Blind 論壇 / 自擬 based on {公司} product)}

### 拆解思路

{分 3-5 步驟的答題框架。不直接給答案，教怎麼結構化思考。}

1. **釐清問題**：{要問面試官什麼來縮小範圍}
2. **定義用戶**：{如何快速分群}
3. **結構化分析**：{用哪個框架}
4. **提出方案**：{怎麼做取捨}
5. **定義成功**：{用什麼指標衡量}

### 範例回答（面試時可以這樣講）

> {用 blockquote 寫一段完整的面試回答，分成 2-3 個段落，每段用粗體標出思考層次。
>  寫成面試時真的會說出口的語氣，包含具體的用戶洞察、指標和取捨判斷。
>  長度約 200-300 字，夠具體到讀者能直接模仿。}

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| {關鍵點 1：問題定義與用戶分群} | |
| {關鍵點 2：框架運用} | |
| {關鍵點 3：具體方案與取捨} | |
| {關鍵點 4：成功指標} | |
| {關鍵點 5：風險或 edge case} | |
| {加分項：跨維度整合觀點} | |

## 今日案例

**{產品名稱}：{一句話描述案例}**

{3-5 句描述一個真實產品的決策或結果，與今天主題直接相關。}

**面試連結**：{這個案例在面試中可以怎麼用——作為回答某類問題的素材}

## 延伸閱讀

- [{文章標題}]({URL}) — {一句話說明}
- [{文章標題}]({URL}) — {一句話說明}

## 參考資料

- [{來源標題}]({URL}) — {與文中哪個段落對應}
```

---

## 星期日特別格式（Behavioral & Weekly Review）

星期日除了 behavioral 練習，還附加一個週回顧區段：

```markdown
## 本週回顧

| 日 | 主題 | 練習題 | 自評 |
|----|------|--------|------|
| 一 | Product Sense | {題目摘要} | ☐ 完成 ☐ 需複習 |
| 二 | Metrics | {題目摘要} | ☐ 完成 ☐ 需複習 |
| ... | ... | ... | ... |

### 下週預告

{根據下週的主題輪替，列出重點預習方向}
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 主題與星期幾對應正確
- [ ] 練習題是面試風格（不是教科書習題）
- [ ] 拆解思路有 3-5 個具體步驟
- [ ] 今日案例來自真實產品，不是虛構的
- [ ] 延伸閱讀有 2-3 個資源，附有效連結
- [ ] 全文 800-1500 字（設計為每日消化量）
- [ ] description 和 tldr 已填寫
- [ ] series order 正確（距離 2026-08-20 的天數 + 1）
- [ ] 文末有「## 參考資料」區段（`pnpm check:references` 會擋）
- [ ] tags 包含 `product-builder-interview` + `daily` + 主題 tag
