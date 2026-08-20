---
name: daily-digest-ai-interview
description: "Routine N: daily AI Engineer interview prep article for quidproquo.cc/daily. Rotates through 7 topics weekly (ML fundamentals, deep learning, system design, LLM engineering, coding, paper reading, behavioral), pulls latest interview questions and resources from the web."
---

# daily-digest-ai-interview

每日產出一篇 AI Engineer 面試準備文章，依星期輪替主題，從網路抓最新面試題與資源。

---

## 每週主題輪替

| 星期 | 主題 | 涵蓋範圍 | topic tag |
|---|---|---|---|
| Mon | ML Fundamentals | loss functions, regularization, optimization, evaluation metrics, bias-variance | `machine-learning` |
| Tue | Deep Learning & NLP | CNN, RNN, Transformer, attention, tokenization, fine-tuning, embeddings | `deep-learning` |
| Wed | ML System Design | feature store, training pipeline, serving, monitoring, A/B testing, data flywheel | `system-design` |
| Thu | LLM & Agent Engineering | RAG, agent architecture, context engineering, guardrails, RLHF, evaluation | `llm-engineering` |
| Fri | Coding | ML-flavored coding problems (batch inference, tokenizer impl, data processing, numpy) | `coding` |
| Sat | Paper Reading | one recent paper + interview-style discussion walkthrough | `paper-reading` |
| Sun | Behavioral & Weekly Review | one STAR story framework + review of the week's prep | `behavioral` |

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
DOW=$(TZ=Asia/Taipei date +%u)  # 1=Mon, 7=Sun

# Step 2: 冪等檢查——已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-ai-interview-daily.md" ] && echo "已產出" && exit 0

# Step 3: 依星期決定主題（見「每週主題輪替」表）
# Step 4: 執行「搜尋方法」取得今日主題的最新面試題與資源
# Step 5: 篩選最相關的內容，組成練習題 + 核心概念
# Step 6: 依「輸出格式」撰寫文章
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-ai-interview-daily.md
git commit -m "post(daily): AI engineer interview daily ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Exa + Tavily **兩個都跑** | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | stealth_fetch 優先 → firecrawl backup | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（GitHub `gh` CLI 等） | 有 API 的來源不用搜尋工具 |

---

## 搜尋方法

### Step 4a：依主題搜尋（Exa + Tavily 同時跑 2 組查詢）

每日主題對應不同的搜尋查詢。以下為各主題的查詢模板：

| 星期 | Q1（面試題） | Q2（教學/討論） |
|---|---|---|
| Mon | `"machine learning interview" loss function regularization optimization 2026` | `"ML interview questions" fundamentals bias variance evaluation metrics` |
| Tue | `"deep learning interview" transformer attention CNN RNN 2026` | `"NLP interview" tokenization fine-tuning embeddings questions` |
| Wed | `"ML system design interview" feature store serving pipeline 2026` | `"machine learning system design" monitoring A/B testing architecture` |
| Thu | `"LLM interview" RAG agent architecture context engineering 2026` | `"AI engineer interview" RLHF guardrails evaluation LLM` |
| Fri | `"ML coding interview" python numpy batch inference implementation 2026` | `"machine learning coding" data processing algorithm interview` |
| Sat | `site:arxiv.org "cs.AI" OR "cs.CL" agent interview-relevant 2026` | `"AI paper discussion" interview reading comprehension` |
| Sun | `"AI engineer behavioral interview" STAR leadership impact 2026` | `"machine learning interview" behavioral questions career` |

**Exa（每組）：**
```
工具：mcp Exa → web_search_exa
numResults: 10
startPublishedDate: "{7 天前的 ISO 日期}"
type: "auto"
```

**Tavily（每組）：**
```
工具：mcp Tavily → tavily_search
query: "{同上 query}"
days: 7
maxResults: 10
```

### Step 4b：去重與篩選

合併所有結果，用 URL 去重。從中挑選：
- 1 道最適合今日主題的面試練習題（優先選有公司來源的真實題目）
- 3-5 個核心概念的最新解說或討論
- 2-3 個延伸閱讀資源

---

## 輸出格式

### Frontmatter

```yaml
---
title: "AI Engineer 面試日練 — YYYY-MM-DD：{今日主題}"
date: YYYY-MM-DD
category: daily
tags: [ai-engineer-interview, daily, {topic-specific-tag}]
lang: zh-TW
description: "{一句話描述今天練什麼}"
tldr: "{今天的核心概念 + 練習重點}"
series:
  name: "AI Engineer 面試日練"
  order: N
---
```

`order` 計算：距離 2026-08-20 的天數 + 1（2026-08-20 = 1, 2026-08-21 = 2, ...）。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 今日主題

{2-3 句說明今天聚焦什麼，為什麼這個主題在面試中重要。
 點出今天練這個能應對哪種面試環節。}

## 核心概念速記

### {概念 1}

{2-3 句解釋。用面試時能直接說出口的表述方式。}

### {概念 2}

{同上}

### {概念 3}

{同上}

{共 3-5 個概念}

## 今日練習題

### 題目

{一道真實面試風格的問題}

**來源**：{公司名/論壇/自擬}　**難度**：{基礎/中等/進階}　**環節**：{phone screen/onsite/system design}

### 拆解思路

1. **先釐清問題**：{面試時該問什麼 clarifying questions}
2. **建立框架**：{用什麼思考架構來拆解}
3. **深入核心**：{技術上最關鍵的 trade-off 是什麼}
4. **收尾**：{怎麼總結讓面試官留下印象}

### 範例回答（面試時可以這樣講）

> {用 blockquote 寫一段完整的面試回答，分成 2-3 個段落，每段用粗體標出架構層次。
>  寫成面試時真的會說出口的語氣，包含具體技術選型和數字。
>  長度約 200-300 字，夠具體到讀者能直接模仿。}

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| {關鍵點 1：具體的技術決策} | |
| {關鍵點 2：核心 trade-off} | |
| {關鍵點 3：生產環境考量} | |
| {關鍵點 4：監控/可觀測性} | |
| {關鍵點 5：edge case / fallback} | |
| {加分項：進階觀點} | |

## 延伸閱讀

- [{資源標題}]({URL}) — {一句話說明為什麼值得看}
- [{資源標題}]({URL}) — {一句話說明}

## 參考資料

- [{來源標題}]({URL}) — {與文中哪段對應}
```

---

## 星期日特殊格式（Behavioral & Weekly Review）

星期日的文章結構不同：

```markdown
## 本週行為面試練習

### 故事框架：{主題，如「推動跨團隊合作」}

**情境**：{用 STAR 的 Situation 開頭，描述一個 AI Engineer 常見的情境}

**任務**：{你被期待做什麼}

**行動**：{你具體做了什麼——面試時要講的核心段落}

**結果**：{量化成果，如「模型 latency 降低 40%」}

### 怎麼講這個故事

- {面試時的 dos}
- {面試時的 don'ts}

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | {回顧} | {待自填} |
| ... | ... | ... | ... |

## 下週預告

{下週主題輪替不變，但搜尋到的內容會不同。提示下週可以加強的弱點。}

## 參考資料

- [{來源}]({URL}) — {說明}
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 主題與今日星期對應正確
- [ ] 核心概念 3-5 個，每個 2-3 句，用面試口語表述
- [ ] 練習題有明確來源標注（公司/論壇/自擬）
- [ ] 拆解思路是教「怎麼想」，不是直接給答案
- [ ] 延伸閱讀 2-3 個，全部有可點擊的連結
- [ ] 全文 800-1500 字（設計為每日快速消化）
- [ ] description 和 tldr 已填寫
- [ ] series order 正確（距離 2026-08-20 的天數 + 1）
- [ ] tags 包含 `ai-engineer-interview` + `daily` + 當日 topic tag
- [ ] 文末有「## 參考資料」區段（`pnpm check:references` 會擋）
- [ ] 星期日用特殊格式（STAR + 週回顧）
