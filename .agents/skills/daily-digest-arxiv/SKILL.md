---
name: daily-digest-arxiv
description: "Routine A: daily Arxiv cs.AI/cs.CL/cs.MA digest for quidproquo.cc/daily. Screens new AI Agent papers through a credibility gate, then selects up to three directions worth knowing today."
---

# daily-digest-arxiv

每日掃描 arxiv 新論文，先排除證據撐不起主張的內容，再選出最多 3 篇今天值得知道的 AI Agent 新方向，產出深讀導讀文章。合格候選不足時可以少於 3 篇；沒有合格候選就不硬產文章。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
SCREENING_RECORD=".research/daily-arxiv-screening/${TODAY}.json"

# Step 2: 冪等檢查——已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md" ] && echo "已產出" && exit 0
[ -f "${SCREENING_RECORD}" ] && echo "今日篩選已完成" && exit 0

# Step 3: 讀 watchlist（判斷論文相關性時用）
cat src/data/agent-watchlist.json | head -100

# Step 4: 取得尚未篩選的最新官方公告批次候選論文
# Step 5: 執行「選案標準」，先過可信度門檻，再選 0-3 篇
# Step 6: 對入選論文完成 metadata 與證據核對
# Step 7: 依「輸出格式」撰寫 zh-TW 與英文文章，維持雙向語言連結與結構 parity
# Step 8: 提交
git add "${SCREENING_RECORD}" src/data/daily-signals/seen-arxiv-ids.txt
if [ -f "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md" ]; then
  git add "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md" \
    "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest-en.md"
  git commit -m "post(daily): arxiv digest ${TODAY}"
else
  git commit -m "chore(daily): arxiv screening ${TODAY}"
fi
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

## 搜尋方法

### Step 4a：先鎖定官方公告批次

每日時間窗以 arXiv 官方 `list/{category}/new` 顯示的最新公告批次為準，不以 Atom API 的 `published`／作者 submission timestamp 直接推算「過去 48 小時」。arXiv 原則上只在週日至週四公告；週末、假日或品質檢查延遲時，submission timestamp 與公開可讀日期可能不同。

1. 讀取 `https://arxiv.org/list/cs.AI/new`、`cs.CL/new`、`cs.MA/new`，記錄頁面顯示的公告日期。
2. 選擇三類中最新、且尚未留下篩選紀錄的公告批次；若當天沒有新公告，就沿用最近一次尚未篩選的公開批次，不把週末解讀為「零篇投稿」。
3. 把公告批次日期與來源 URL 寫入篩選紀錄；`submittedAt` 另存為 metadata，兩者不得混用。
4. 若最新批次已完整篩選，冪等結束，不重選已見論文。

官方公告時程：[arXiv Submission Schedule and Cutoff Time](https://info.arxiv.org/help/availability.html)。

### Step 4b：用 Groundlane `web_search` 補充發現

對每組查詢跑 Groundlane `web_search`，合併結果並以 URL 去重：

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `site:arxiv.org "cs.AI" OR "cs.MA" agent tool-use planning reasoning 2026` | 核心 Agent 能力：工具呼叫、規劃、推理 |
| Q2 | `site:arxiv.org "cs.CL" RAG retrieval-augmented context memory agent` | RAG / Context / 記憶管理 |
| Q3 | `site:arxiv.org "cs.AI" OR "cs.MA" multi-agent protocol safety guardrails` | 多 Agent 協作 / 安全 / 護欄 |

**Groundlane `web_search`（每組）：**
```
工具：Groundlane MCP → web_search
max_results: 10
published_after: "{昨天的 ISO 日期，如 2026-08-15T00:00:00Z}"
provider: "auto"
```

**Groundlane `web_search`（補充查詢）：**
```
工具：Groundlane MCP → web_search
query: "{同上 query}"
time_range: "day"
max_results: 10
```

### Step 4c：去重

合併所有結果，用 arxiv ID 去重。此時應有 15-30 篇候選論文。

---

## 篩選與主題決定

執行本節前，完整閱讀 [`references/selection-standard.md`](references/selection-standard.md)。該文件定義可信度門檻、方向價值標籤、選取數量、篩選紀錄與文章語氣；不得只依標題、摘要、作者聲望或單一 relevance score 決定入選。

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

### Step 5b：可信度門檻

對初篩後候選先讀摘要，再對可能入選者讀取足以核對主張的正文段落，至少涵蓋方法、實驗／分析、比較基準與限制。依選案標準標為「通過／有條件通過／排除」。

- 只讀摘要不得判定「通過」。
- 新穎性不能抵銷證據缺陷。
- 「有條件通過」可以入選，但文章必須說明證據仍初步或適用範圍有限。
- 「排除」不得進入後續排序。

### Step 5c：比較今天是否值得知道

對通過可信度門檻的候選標註：本站相關性、方向新意、今日重要性、實務連結。先選最值得知道的方向，再看能否形成自然主題；不要先找最大聚類再硬塞較弱論文。

### Step 5d：找聚類，決定今日主題

對剩餘候選論文做主題聚類：

1. **讀每篇的標題和摘要**，用一個詞概括它在談什麼（如「記憶」「安全」「評測」「工具呼叫」「多Agent」）
2. **找最有編輯價值的自然聚類**——哪個共同問題最值得讀者今天知道？篇數只是輔助訊號，不以最大聚類自動勝出。
3. **決定今日主題**——用一句話寫出入選論文的共同問題（如「Agent 怎麼記住重要的事」「現有評測是否反映真實能力」）

**聚類判斷範例**：

| 候選 | 一詞概括 | 聚類 |
|---|---|---|
| AutoMem: Automated Learning of Memory | 記憶 | ← |
| Context Compression for Long Agents | 記憶 | ← 這三篇是一類 |
| Episodic Memory for Tool-Using Agents | 記憶 | ← |
| Adaptive Adversaries Benchmark | 安全 | |
| Multi-Agent Protocol Design | 多Agent | |

→ 三篇都通過可信度門檻且今日重要性較高時，今日主題可定為「Agent 的記憶管理」。

### Step 5e：選 0-3 篇

依方向價值選最多 3 篇；有 2 篇以上時，盡量覆蓋不同角度：

| 角度 | 說明 | 範例 |
|---|---|---|
| 能力/方法 | 提出新方法或新框架 | AutoMem 提出記憶自動調優 |
| 評測/極限 | 測試或揭示能力邊界 | Shadow Eval 證明 Agent 不能做研究 |
| 應用/安全 | 實際部署或安全面 | Adaptive Adversaries 揭示評測漏洞 |

**如果只有 1-2 篇合格**：只寫 1-2 篇，不用獨立低分論文補滿；標題與總覽按實際篇數撰寫。

**如果入選論文沒有聚類**：可用「今天值得知道的 N 個獨立方向」，但每篇仍須個別通過門檻。

**如果 0 篇合格**：不產文章、不拿舊聞或低可信度候選補版面；在篩選紀錄標為 `no-publication`，並回報本時間窗沒有同時通過可信度門檻與今日重要性判斷的論文。

### Step 5f：保存篩選與去重記錄

依選案標準把完整候選決策寫入 `.research/daily-arxiv-screening/${TODAY}.json`。即使候選被排除，也要保存簡短理由，供後續校正 selection standard；讀者文章不列未入選清單。

選定 1-3 篇後，把入選者的 arxiv ID 追加到去重檔案：

```bash
echo "${TODAY}: {selected_ids}" >> src/data/daily-signals/seen-arxiv-ids.txt
```

---

## 論文詳情抓取

### Step 6：取得論文詳情

**雲端環境（CCR routine）的 egress proxy 可能封鎖 arxiv.org 直連**，curl 和內建 WebFetch 也不作為研究工具。依下列方式取得論文資料：

1. 優先用 arXiv API / official export 取得 metadata。
2. 用 Groundlane `web_fetch` 抓 `https://arxiv.org/abs/{arxiv_id}` 讀摘要頁。
3. 對可能入選者，再用 Groundlane 讀官方 HTML／PDF 中與方法、實驗、比較、限制有關的正文段落；控制擷取範圍，不要把全文一次塞入 context。
4. 若官方正文不可讀，最多只能判為「有條件通過」，不得假裝已核對完整研究證據。
5. 若已知 URL 失敗，用 Groundlane `web_search` 搜尋 `arxiv.org/abs/{arxiv_id}` 找可讀的官方替代頁。
6. 若 Groundlane 未授權，回報 blocker，請使用者依 Groundlane free API / free tier 方式完成授權。

從抓取結果中提取（**缺任何一項就換下一篇候選**）：
- **標題**
- **作者**：列出前 3 位 + et al.
- **機構**（若有）
- **arxiv ID**
- **摘要**（用於寫導讀，但不直接翻譯貼上）
- **公告批次日期**：確認屬於本次鎖定的官方 `new` listing 批次
- **提交日期**：另存 metadata，不拿來替代公告批次日期
- **分類**：確認屬於目標分類（cs.AI / cs.CL / cs.MA）

**注意**：摘要頁用於 metadata 與初篩，不足以判定研究可信度。正文採分段、selector 或 bounded extraction；不要一次讀入完整 `/html/` 或 PDF。

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
description: "一句話，串起今天入選論文的共同主題"
tldr: "入選論文的一句話結論，用分號隔開"
series:
  name: "AI Agent Arxiv Digest"
  order: N
---
```

`order` 計算：距離**系列起點 2026-05-25** 的天數 + 1（2026-05-25 = 1, 2026-08-16 = 84, ...）。起點不可更動——改起點會讓新文章跟舊文章撞號，`pnpm check:series-order` 會擋。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 今日總覽

{3-5 行，串起今天入選論文的共同主題。不是列表，是一段有觀點的文字。
 要回答：這些論文合起來告訴我們什麼？證據成熟到什麼程度？}

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| {術語} | {一句話解釋，假設讀者是工程師但不是 ML 研究者} |

{列 4-6 個術語，涵蓋入選論文中非顯而易見的概念}

---

## 論文一｜{中文翻譯標題}

**{英文原標題}**
{作者 1, 作者 2, 作者 3 et al.}（{機構}）　·　arxiv: {arxiv_id}

連結: [arxiv](https://arxiv.org/abs/{arxiv_id}) · [alphaxiv](https://www.alphaxiv.org/abs/{arxiv_id})

### TL;DR

{一句話結論。必須包含具體數字或核心發現。}

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 可信度 | {通過／有條件通過} — {一句具體依據} |
| 證據成熟度 | {較完整／初步／概念驗證} — {一句具體依據} |
| 可復現性 | {完整產物／部分產物／未提供} — {公開了哪些重跑材料} |
| 編輯信心 | {高／中／低} — {目前敘述強度為何可被支持} |
| 閱讀建議 | {必讀／略讀／跳過} — {對誰有用} |
| 主要限制 | {最影響判斷的一項證據限制；沒有就寫「未見重大缺口」} |

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

{依實際入選數量重複以上結構，最多三篇}

## 今日收穫

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

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 可信度 | 通過 — 正文提供跨 benchmark 實驗與對照組 |
| 證據成熟度 | 初步 — 核心結果完整，但任務仍限於遊戲環境 |
| 可復現性 | 部分產物 — 方法與設定可查，主要外部複現仍待補 |
| 編輯信心 | 高 — 足以支持「記憶可獨立優化」的限縮主張 |
| 閱讀建議 | 必讀 — 長程 Agent 平台可直接參考架構 |
| 主要限制 | 尚未驗證真實工作負載的遷移效果 |

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

## 今日收穫

之前以為 Agent 記憶的問題是「怎麼存更多」，今天發現真正的問題是「怎麼讓 Agent 自己學會管記憶」。AutoMem 的思路讓我意識到，記憶系統不該是工程師手動調的規則，而是一個可以自動優化的獨立技能。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 實際收錄 1-3 篇；沒有用低可信度或舊論文補足篇數
- [ ] 每篇都有「通過／有條件通過」可信度判定，且有正文證據，不只看摘要
- [ ] 入選論文的內部紀錄包含 `presentation` 與具體理由；沒有把寫作清楚誤當成研究可信
- [ ] 每篇都有「編輯判斷」表格，包含證據成熟度、可復現性、編輯信心、閱讀建議與主要限制
- [ ] 收錄 2 篇以上時，盡量覆蓋至少 2 個不同面向
- [ ] 完整候選與排除理由已寫入 `.research/daily-arxiv-screening/YYYY-MM-DD.json`
- [ ] 每篇論文都有 arxiv ID 和 `[arxiv]()` + `[alphaxiv]()` 雙連結
- [ ] 「讀這篇前該知道的詞」有 4-6 個術語
- [ ] 每篇的「深入要點」包含至少 1 個具體數字
- [ ] 未複現結果標注 ⚠️ 並說明是誰的自測；有條件通過的論文已降低語氣強度
- [ ] 每篇的「給你的 take-away」都寫出具體使用情境與可執行動作，不只說「值得關注」
- [ ] zh-TW 與英文文章同時產出，雙向語言連結、入選篇數與章節結構一致
- [ ] 「今日收穫」是認知差（之前以為 X → 現在知道 Y），不是摘要
- [ ] 全文 < 3000 字
- [ ] description 和 tldr 已填寫
- [ ] series order 正確（距離 2026-05-25 的天數 + 1）
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
