---
name: daily-digest-arxiv
description: "Routine A: daily Arxiv cs.AI/cs.CL/cs.MA digest for quidproquo.cc/daily. Scans arxiv for AI Agent related papers, produces a structured digest post."
---

# daily-digest-arxiv

每日掃描 arxiv 新論文，篩選 3 篇與 AI Agent 最相關的論文，產出深讀導讀文章。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 冪等檢查——已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md" ] && echo "已產出" && exit 0

# Step 3: 讀 watchlist（判斷論文相關性時用）
cat src/data/agent-watchlist.json | head -100

# Step 4: 執行「搜尋方法」取得候選論文
# Step 5: 執行「篩選規則」從候選中選 3 篇
# Step 6: 對每篇論文執行「論文詳情抓取」
# Step 7: 依「輸出格式」撰寫文章
# Step 8: 提交
git add src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md
git commit -m "post(daily): arxiv digest ${TODAY}"
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

### Step 4a：用 Exa + Tavily 合併搜尋（跑 3 組查詢，兩個引擎都跑）

對每組查詢同時跑 Exa 和 Tavily，合併結果並以 URL 去重：

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `site:arxiv.org "cs.AI" OR "cs.MA" agent tool-use planning reasoning 2026` | 核心 Agent 能力：工具呼叫、規劃、推理 |
| Q2 | `site:arxiv.org "cs.CL" RAG retrieval-augmented context memory agent` | RAG / Context / 記憶管理 |
| Q3 | `site:arxiv.org "cs.AI" OR "cs.MA" multi-agent protocol safety guardrails` | 多 Agent 協作 / 安全 / 護欄 |

**Exa（每組）：**
```
工具：mcp Exa → web_search_exa
numResults: 10
startPublishedDate: "{昨天的 ISO 日期，如 2026-08-15T00:00:00Z}"
type: "auto"
```

**Tavily（每組）：**
```
工具：mcp Tavily → tavily_search
query: "{同上 query}"
days: 1
maxResults: 10
```

### Step 4b：去重

合併所有結果，用 arxiv ID 去重。此時應有 15-30 篇候選論文。

---

## 篩選與主題決定

### Step 5a：初篩（從 15-30 篇候選中排除不相關的）

**排除條件**（符合任一就排除）：
- 純 CV / NLP 基礎研究（圖像分割、語法分析、語言模型預訓練方法）
- 訓練方法論（RLHF 改良、新的預訓練技巧——除非直接改善 Agent 推理）
- 硬體 / 晶片 / 機器人（除非直接影響 Agent 執行環境）
- 已在 `src/data/daily-signals/seen-arxiv-ids.txt` 中的 ID（去重）

**保留條件**（符合任一就保留）：
- 直接涉及 Agent 架構 / 編排 / 記憶 / 安全
- 新的 prompting / context / reasoning 技術
- 涉及 watchlist 框架或公司的研究
- RAG / 向量檢索 / 長期推理
- Agent 評測方法論

初篩後應剩 5-15 篇候選。

### Step 5b：找聚類，決定今日主題

對剩餘候選論文做主題聚類：

1. **讀每篇的標題和摘要**，用一個詞概括它在談什麼（如「記憶」「安全」「評測」「工具呼叫」「多Agent」）
2. **找最大的自然聚類**——哪個主題詞出現最多？有沒有 3+ 篇論文可以被同一條線串起來？
3. **決定今日主題**——用一句話寫出這個聚類的共同問題（如「Agent 怎麼記住重要的事」「現有評測是否反映真實能力」）

**聚類判斷範例**：

| 候選 | 一詞概括 | 聚類 |
|---|---|---|
| AutoMem: Automated Learning of Memory | 記憶 | ← |
| Context Compression for Long Agents | 記憶 | ← 這三篇是一類 |
| Episodic Memory for Tool-Using Agents | 記憶 | ← |
| Adaptive Adversaries Benchmark | 安全 | |
| Multi-Agent Protocol Design | 多Agent | |

→ 今日主題：「Agent 的記憶管理」，選這三篇。

### Step 5c：選 3 篇（同一聚類，不同角度）

從最大聚類中選 3 篇，確保覆蓋不同角度：

| 角度 | 說明 | 範例 |
|---|---|---|
| 能力/方法 | 提出新方法或新框架 | AutoMem 提出記憶自動調優 |
| 評測/極限 | 測試或揭示能力邊界 | Shadow Eval 證明 Agent 不能做研究 |
| 應用/安全 | 實際部署或安全面 | Adaptive Adversaries 揭示評測漏洞 |

**如果找不到 3 篇同聚類**：放寬到 2 篇同聚類 + 1 篇最佳獨立論文，主題寫成「X 與 Y」的並列形式。

**如果完全沒有聚類**（每篇都不同主題）：選 3 篇最高影響力的，主題寫成「今天三個獨立的重要進展」，但這應該很少發生。

### Step 5d：去重記錄

選定 3 篇後，把它們的 arxiv ID 追加到去重檔案：

```bash
echo "${TODAY}: {id1}, {id2}, {id3}" >> src/data/daily-signals/seen-arxiv-ids.txt
```

---

## 論文詳情抓取

### Step 6：取得論文詳情

**雲端環境（CCR routine）的 egress proxy 封鎖 arxiv.org 直連**，curl 和 WebFetch 都不通。依站內 Web Fetch 優先順序取得論文資料：

1. **stealth_fetch**（CLI 環境才有，雲端自動跳過）
2. **Exa** — `web_search_exa` 搜尋 `arxiv.org/abs/{arxiv_id}` 並取得內容
3. **Tavily** — `tavily_search` 搜尋同上
4. **firecrawl** — `firecrawl_scrape` 抓 `https://arxiv.org/abs/{arxiv_id}`（`onlyMainContent: true`）

從抓取結果中提取（**缺任何一項就換下一篇候選**）：
- **標題**
- **作者**：列出前 3 位 + et al.
- **機構**（若有）
- **arxiv ID**
- **摘要**（用於寫導讀，但不直接翻譯貼上）
- **提交日期**：確認是過去 48 小時內
- **分類**：確認屬於目標分類（cs.AI / cs.CL / cs.MA）

**注意**：不要抓 `/html/` 全文版（會超過 token 上限），只抓 `/abs/` 摘要頁即可。

---

## 輸出格式

### Frontmatter

```yaml
---
title: "AI Agent Arxiv Digest — YYYY-MM-DD"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "一句話，串起今天三篇論文的共同主題"
tldr: "三篇論文的一句話結論，用分號隔開"
series:
  name: "AI Agent Arxiv Digest"
  order: N
---
```

`order` 計算：距離 2026-08-16 的天數 + 1（2026-08-16 = 1, 2026-08-17 = 2, ...）。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 今日總覽

{3-5 行，串起今天三篇論文的共同主題。不是列表，是一段有觀點的文字。
 要回答：今天這三篇合起來告訴我們什麼？}

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| {術語} | {一句話解釋，假設讀者是工程師但不是 ML 研究者} |

{列 4-6 個術語，涵蓋三篇論文中非顯而易見的概念}

---

## 論文一｜{中文翻譯標題}

**{英文原標題}**
{作者 1, 作者 2, 作者 3 et al.}（{機構}）　·　arxiv: {arxiv_id}

連結: [arxiv](https://arxiv.org/abs/{arxiv_id}) · [alphaxiv](https://www.alphaxiv.org/abs/{arxiv_id})

### TL;DR

{一句話結論。必須包含具體數字或核心發現。}

### Read Priority

{必讀 / 略讀 / 跳過} — {一句話理由，說清楚對誰有用}

### 領域背景

{這個問題在整個領域裡的位置，2-3 句。解釋之前的做法和為什麼不夠好。}

### 中階導讀

- **問題**：{用類比說明。想像一個具體場景讓非研究者也能懂。}
- **方法**：{核心 idea，不超過一段。用「Loop 1 做 X，Loop 2 做 Y」這種結構化敘述。}
- **為什麼重要**：{對 Agent 開發者 / 從業者 / PM 的具體意義。}

### 深入要點

- {基準測試名稱和具體數字，如「在 Crafter 達 51.4%」}
- {對比數據，如「Claude Opus 4.5 在同測試為 49.5%」} ⚠️（{誰的自測}，需等外部複現）
- {增益幅度，如「僅優化記憶，效能提升約 2x–4x」}
- {落地門檻：需要什麼才能用？小型團隊的挑戰是什麼？}
- {與主流框架的關聯：LangGraph / CrewAI / MCP 現有架構怎麼接？}
- {Limitation：論文自己承認的限制}

### Reviewer 一句話評

{以審稿人角度給一句客觀評價。必須包含一個正面點和一個待觀察點。}

### 給你的 take-away

- 如果你在做 {具體場景 A}：{具體建議，不是「值得關注」而是「直接做 X」}
- 如果你在做 {具體場景 B}：{具體建議}

---

{論文二、論文三重複以上結構}

## 我今天學到什麼

{1-3 句話。寫的是認知差——「之前以為 X，現在知道 Y」。
 不是摘要，不是「今天讀了三篇論文」。}
```

---

## 完整範例

以下節錄自 2026-08-04 的 digest，展示預期的格式深度（僅含論文一，完整版含三篇）：

```markdown
---
title: "AI Agent Arxiv Digest — 2026-08-04"
date: 2026-08-04
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是 Agent 的能力與極限——記憶管理可自動學習，但開放式研究還做不了，安全測試可能根本不夠"
tldr: "AutoMem 讓 32B 模型靠記憶優化達到 Claude Opus 4.5 水準；Shadow Evaluation 證明頂級 Agent 能工程但不能做研究；Adaptive Adversaries 揭示自適應攻擊讓 ASR 從 0-1% 跳到 14%"
series:
  name: "AI Agent Arxiv Digest"
  order: 81
---

## 今日總覽

今天三篇各從不同角度審視 AI Agent 的能力與極限：AutoMem 告訴你「記憶管理」是可以自動學習的獨立技能，光優化記憶就讓 32B 開源模型達到頂級商用模型水準；Shadow Evaluation 用真實 NeurIPS 投稿測試頂尖 Agent 能否做開放式 AI 研究——答案是否定的，Agent 能工程但不會研究；Adaptive Adversaries 揭示現有安全評測嚴重低估威脅：加上自適應多輪攻擊者，攻擊成功率從 0–1% 跳到 14%。三篇合起來是一堂清醒課：知道 Agent 能自動變強在哪、不能在哪、以及你的安全測試可能根本不夠。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent（智能代理） | 可以自己規劃步驟、呼叫工具、迭代執行的 AI 系統，不是一問一答的聊天機器人 |
| 記憶管理（Memory Management） | Agent 決定「要記什麼、什麼時候調出來、怎麼整理記憶檔案」的能力，是長程任務最大瓶頸 |
| 鷹架（Scaffold） | 驅動 Agent 的程式框架——包含 system prompt、工具定義、執行迴圈，不含模型本身 |
| 攻擊成功率（ASR） | 對抗攻擊讓 Agent 做出有害行為的比例；ASR 10% 代表每十次測試有一次被攻破 |
| 影子評估（Shadow Evaluation） | 讓 Agent 獨立研究一篇未公開論文的核心問題，再由原作者打分的評測方法 |

---

## 論文一｜AutoMem：讓 Agent 自動學會管理記憶

**AutoMem: Automated Learning of Memory as a Cognitive Skill**
Shengguang Wu, Hao Zhu, Yuhui Zhang et al.（Stanford University）　·　arxiv: 2607.01224

連結: [arxiv](https://arxiv.org/abs/2607.01224) · [alphaxiv](https://www.alphaxiv.org/abs/2607.01224)

### TL;DR

把「記憶管理」當成獨立技能來訓練，完全不改模型的任務行為，光是優化記憶就讓 32B 開源模型在長程遊戲上達到 Claude Opus 4.5 的水準（Crafter 51.4% vs 49.5%）。

### Read Priority

必讀 — Agent 平台最痛的問題之一就是長程任務的記憶管理。AutoMem 提出一套「讓 LLM 自己學如何管記憶」的自動化框架，效果顯著且架構清楚——是目前最有參考價值的記憶自動調優設計藍圖。

### 領域背景

LLM Agent 做長程任務（long-horizon task，跑幾千步才完成）時，記憶管理是最大瓶頸。以前的做法是人工設計 system prompt 規則，或接入 RAG（向量檢索）。問題是規則難以涵蓋所有情況，而要 debug 的軌跡長達幾千步，人工幾乎看不完。

### 中階導讀

- **問題**：想像 Agent 在玩一款 roguelike 遊戲（地城探索），需要跑幾千步。途中遇到怪物 A、記下弱點；三百步後再次遇到，卻已忘記。記憶沒記對的代價要等很久才浮現——人工 debug 根本不切實際。
- **方法**：AutoMem 把記憶管理從「工程師手動設計規則」改成「讓 LLM 自動學」，透過兩個迭代迴圈：Loop 1（結構優化）讓「批改老師」LLM 讀完整集軌跡，找出記憶失敗的模式並修改記憶鷹架；Loop 2（熟練度訓練）從軌跡中挑出「記憶用得好的決策」做監督學習。整個系統以「檔案系統操作」作為記憶的一等公民。
- **為什麼重要**：記憶管理是可以獨立學習的技能。不需要訓練整個模型的任務推理，光是優化記憶這一塊就能讓效能倍增。對 Agent 平台而言，「記憶模組」是一個值得獨立投資和衡量的組件。

### 深入要點

- 基準測試：Crafter、MiniHack、NetHack 三款長程遊戲
- AutoMem 32B：Crafter 51.4%、MiniHack 30.0%、NetHack 1.9%
- Claude Opus 4.5：分別為 49.5%、27.5%、2.0% ⚠️（Stanford 自測，需等外部複現）
- 僅優化記憶，效能提升約 2x–4x（對比無記憶優化基準）
- Loop 1 跑 5 輪鷹架修訂，每輪 meta-LLM 讀完整軌跡並重寫規則
- 落地門檻：需要大量 episode rollout，小型團隊若缺環境模擬基礎設施會有挑戰
- 與 LangGraph、AutoGen 相容——可作為插件層加入
- Limitation：目前只在遊戲環境測試，遷移到真實工作負載效果待驗證

### Reviewer 一句話評

方法紮實，兩個迴圈的設計清楚且可複現。但「32B 媲美 Claude Opus 4.5」的結論要謹慎對待——遊戲環境和實際 agent workload 差距很大，先別過度外推。

### 給你的 take-away

- 如果你的 Agent 平台有長程任務需求：AutoMem 的 Loop 1（鷹架修訂流程）是目前最具體的「記憶自動調優」設計藍圖，值得直接參考架構設計
- 如果你在評估 Agent 效能：把「記憶相關失敗」從「模型能力不足」獨立拆出來衡量，這篇提供了清楚的操作方法論

---

（論文二、三結構相同，完整版見 Notion 2026-08-04 digest）

## 我今天學到什麼

之前以為 Agent 記憶的問題是「怎麼存更多」，今天發現真正的問題是「怎麼讓 Agent 自己學會管記憶」。AutoMem 的思路讓我意識到，記憶系統不該是工程師手動調的規則，而是一個可以自動優化的獨立技能。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 3 篇論文，覆蓋至少 2 個不同面向
- [ ] 每篇論文都有 arxiv ID 和 `[arxiv]()` + `[alphaxiv]()` 雙連結
- [ ] 「讀這篇前該知道的詞」有 4-6 個術語
- [ ] 每篇的「深入要點」包含至少 1 個具體數字
- [ ] 未複現結果標注 ⚠️ 並說明是誰的自測
- [ ] 每篇的「給你的 take-away」用「如果你在做 X：」句式，給出具體行動建議
- [ ] 「我今天學到什麼」是認知差（之前以為 X → 現在知道 Y），不是摘要
- [ ] 全文 < 3000 字
- [ ] description 和 tldr 已填寫
- [ ] series order 正確（距離 2026-08-16 的天數 + 1）
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
