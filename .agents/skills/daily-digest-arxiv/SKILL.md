---
name: daily-digest-arxiv
description: "Routine A: daily Arxiv cs.AI/cs.CL/cs.MA digest for quidproquo.cc/daily. Screens AI Agent papers from a three-layer candidate pool (arXiv /new, community sources, 14-day lookback), applies credibility + background-signal gates, then selects up to three directions worth knowing today."
---

# daily-digest-arxiv

每日從三層候選池（arXiv 官方公告、社群熱門、14 天回溯）掃描 AI Agent 論文，先排除證據撐不起主張的內容，再選出最多 3 篇今天值得知道的方向，產出深讀導讀文章。合格候選不足時可以少於 3 篇；沒有合格候選就不硬產文章。

---

## 執行流程

```bash
# Step 1: 準備
git checkout main
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
SCREENING_RECORD=".research/daily-arxiv-screening/${TODAY}.json"

# Step 2: 冪等檢查——文章已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-ai-agent-arxiv-digest.md" ] && echo "已產出" && exit 0

# Step 3: 讀 watchlist（判斷論文相關性時用）
cat src/data/agent-watchlist.json | head -100

# Step 4: 三層候選池蒐集
# Step 4-bg: 查詢每篇候選的背景信號（venue / 引用 / 機構 / 社群）
# Step 5: 執行「選案標準」，先過可信度門檻，再選 0-3 篇
# Step 6: 對入選論文完成 metadata 與證據核對
# Step 7: 依「輸出格式」撰寫 zh-TW 與英文文章，維持雙向語言連結與結構 parity
#   （動筆前先讀 references/output-template.md 與 references/output-example.md）
# Step 8: 提交（依 daily-digest-common 共用尾聲）
# 見 .agents/skills/daily-digest-common/SKILL.md
# E0: 圖解（依 diagram skill 逐節判斷、補 0–3 張圖；雙語版兩版都放）
# E1: 跳過（本 skill 在 Step 7 已同時產出中英雙版）
# E2: 修 check:references WARN
# E3: 寫當日 routine 紀錄 .work/daily-log/${TODAY}/<skill>.md（不碰 progress.txt）
# E4: targeted verify（check:references + check:lang-parity + check:tw + check:series-order + diagram-preview）
# E5: git add / commit / push
git add "${SCREENING_RECORD}" src/data/daily-signals/seen-arxiv-ids.txt ".work/daily-log/${TODAY}/daily-digest-arxiv.md"
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
| **結構化 API** | 直接呼叫（arxiv API、Semantic Scholar API、HuggingFace API） | 有 API 的來源不用搜尋工具 |

搜尋工具 fallback：Groundlane 優先；Groundlane 失效不是 blocker，要依序走完整條 fallback 鏈（降級時記錄 `toolDegradation`），整條都失敗才登錄 escalation-queue；`stealth_fetch`、`web-fetch/fetch_page` 已退役，不得使用。完整順序、判斷方式與限速見 `.agents/skills/daily-digest-common/SKILL.md` 的「搜尋工具 fallback 鏈」一節——第一次要降級前先讀該節。

---

## 搜尋方法：三層候選池

每天執行全部三層，不因週末或假日跳過任何層。三層的候選以 arxiv ID 合併去重；同一篇出現在多層的，記錄 `sourceCount` 供排序加分。

### Layer A：arXiv 官方公告批次

每日時間窗以 arXiv 官方 `list/{category}/new` 顯示的最新公告批次為準，不以 Atom API 的 `published`／作者 submission timestamp 直接推算「過去 48 小時」。arXiv 原則上只在週日至週四公告；週末、假日或品質檢查延遲時，submission timestamp 與公開可讀日期可能不同。

1. 讀取 `https://arxiv.org/list/cs.AI/new`、`cs.CL/new`、`cs.MA/new`，記錄頁面顯示的公告日期。
2. 選擇三類中最新的公告批次。即使該批次在先前某天的 screening record 中已篩選過，仍收集其中的論文作為候選（不再以「已篩選」為由跳過整個批次）。先前已被 `selected` 的論文由 `seen-arxiv-ids.txt` hard dedup 排除。
3. 把公告批次日期與來源 URL 寫入篩選紀錄；`submittedAt` 另存為 metadata，兩者不得混用。

官方公告時程：[arXiv Submission Schedule and Cutoff Time](https://info.arxiv.org/help/availability.html)。

**Groundlane `web_search` 補充發現**：

對每組查詢跑 Groundlane `web_search`，合併結果並以 URL 去重：

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `site:arxiv.org "cs.AI" OR "cs.MA" agent tool-use planning reasoning 2026` | 核心 Agent 能力：工具呼叫、規劃、推理 |
| Q2 | `site:arxiv.org "cs.CL" RAG retrieval-augmented context memory agent` | RAG / Context / 記憶管理 |
| Q3 | `site:arxiv.org "cs.AI" OR "cs.MA" multi-agent protocol safety guardrails` | 多 Agent 協作 / 安全 / 護欄 |

```
工具：Groundlane MCP → web_search
max_results: 10
published_after: "{昨天的 ISO 日期}"
provider: "auto"
```

### Layer B：社群與學術熱門來源

這些來源每天都有更新（含週末），彌補 arXiv 週末無公告的空窗。

| 來源 | 方法 | 信號類型 |
|---|---|---|
| **HuggingFace Daily Papers** | Groundlane `web_fetch` 讀 `https://huggingface.co/api/daily_papers`，取最近 3 天 | 社群策展 + 投票數 |
| **HuggingFace Trending / Papers with Code** | Groundlane `web_search` query: `site:paperswithcode.com OR site:huggingface.co/papers trending AI agent` | GitHub 星星速度、實作復現 |
| **Semantic Scholar** | Groundlane `web_fetch` 讀 `https://api.semanticscholar.org/graph/v1/paper/search?query=AI+agent+tool+use+memory+safety&year=2026&fieldsOfStudy=Computer+Science&fields=title,externalIds,citationCount,venue,authors&limit=20&sort=citationCount:desc` | 引用速度、venue 資訊 |

從 Layer B 結果中提取 arxiv ID（若有），加入候選池。沒有 arxiv ID 的結果記錄但不進入篩選。

### Layer C：14 天回溯池

讀取過去 14 天的 `.research/daily-arxiv-screening/*.json`，收集符合以下條件的候選：

| 原始 decision | rejectionCategory | 回溯行為 |
|---|---|---|
| `watch` | 任何 | **自動進入**回溯池 |
| `rejected` | `stronger-competitor` | 進入回溯池，需新信號才能克服衰減 |
| `rejected` | `evidence-insufficient` | **僅當**出現新的 code 釋出或外部複現信號時才進入 |
| `rejected` | `off-topic` | **永久排除** |
| `rejected` | `stale` | **永久排除** |
| `selected` | — | 由 `seen-arxiv-ids.txt` hard dedup 排除 |

**14 天硬上限**：超過 14 天的論文不再回溯，無論信號多強。

### 候選合併與排序

三層候選以 arxiv ID 合併。對每篇候選計算：

```
effective_score = base_relevance × decay(days_since_first_seen) × source_boost(source_count)
```

| 因子 | 計算 | 說明 |
|---|---|---|
| `base_relevance` | 由 Step 5 的方向價值排序決定 | 主題相關性、新意、今日重要性、實務連結 |
| `decay(d)` | `0.85^d`，d = 距離首次出現的天數 | 5 天前的論文需要 ~2x 分數才能與今天的競爭 |
| `source_boost` | 1 層 = 1.0、2 層 = 1.3、3 層 = 1.5 | 多來源佐證 = 更值得注意 |

排序用於輔助判斷，不機械取 top-N；最終選案仍由可信度門檻 + 編輯判斷決定。

---

## Step 4-bg：背景信號查詢

對**每篇通過 topic gate 的候選**（不只是入選者），查詢以下背景信號。這些信號**必須查證並記錄**，且**必須在文章中對讀者透明呈現**，但**不得用來跳過可信度門檻**（詳見 `selection-standard.md`）。

| 信號 | 查詢方式 | 記錄欄位 |
|---|---|---|
| **Venue** | Semantic Scholar API `fields=venue,publicationVenue` | 是否經同行審查？哪個會議/期刊？ |
| **引用速度** | Semantic Scholar API `fields=citationCount`，對比發布天數 | N citations in D days |
| **機構** | 論文 metadata / arXiv 摘要頁 | 前 3 作者的機構 |
| **社群信號** | HF Daily Papers 是否出現、Papers with Code 是否有 repo | 社群策展排名 / 復現 repo 數量 |

**Semantic Scholar 查詢範例**：

```
Groundlane web_fetch:
  url: "https://api.semanticscholar.org/graph/v1/paper/ARXIV:{arxiv_id}?fields=title,venue,publicationVenue,citationCount,authors.name,authors.affiliations,externalIds"
```

---

## 篩選與主題決定

執行本節前，完整閱讀 [`references/selection-standard.md`](references/selection-standard.md)。該文件定義可信度門檻、背景信號政策、方向價值標籤、選取數量、篩選紀錄與文章語氣；不得只依標題、摘要、作者聲望或單一 relevance score 決定入選。

### Step 5a：初篩（從候選池中排除不相關的）

三層合併後的候選池預計有 30-80 篇。

**排除條件**（符合任一就排除）：
- 純 CV / NLP 基礎研究（圖像分割、語法分析、語言模型預訓練方法）
- 訓練方法論（RLHF 改良、新的預訓練技巧——除非直接改善 Agent 推理）
- 硬體 / 晶片 / 機器人（除非直接影響 Agent 執行環境）
- 已在 `src/data/daily-signals/seen-arxiv-ids.txt` 中的 ID（hard dedup：已發表過）

**保留條件**（符合任一就保留）：
- 直接涉及 Agent 架構 / 編排 / 記憶 / 安全
- 新的 prompting / context / reasoning 技術
- 涉及 watchlist 框架或公司的研究
- RAG / 向量檢索 / 長期推理
- Agent 評測方法論

初篩後應剩 5-20 篇候選。

### Step 5b：可信度門檻

對初篩後候選先讀摘要，再對可能入選者讀取足以核對主張的正文段落，至少涵蓋方法、實驗／分析、比較基準與限制。依選案標準標為「通過／有條件通過／排除」。

- 只讀摘要不得判定「通過」。
- 新穎性不能抵銷證據缺陷。
- 「有條件通過」可以入選，但文章必須說明證據仍初步或適用範圍有限。
- 「排除」不得進入後續排序。
- 每篇寫出最關鍵的一個**隱含前提**（結論需要、論文沒檢驗的前提）與「前提錯了核心主張還剩多少」，記入 `hiddenAssumption`／`hiddenAssumptionImpact`。常見類型與判定規則見選案標準「隱含前提」一節。

**對 `watch` 候選的最低要求**：即使不入選，至少要讀方法章節做一次快速可信度掃描，並填 `hiddenAssumption`，不能全部留 `not-assessed`。這是為了 Layer C 回溯時有判斷依據：之後出現的新證據若正好檢驗了這個前提，就是重新考慮的信號。

### Step 5c：比較今天是否值得知道

對通過可信度門檻的候選標註：本站相關性、方向新意、今日重要性、實務連結。先選最值得知道的方向，再看能否形成自然主題；不要先找最大聚類再硬塞較弱論文。

### Step 5d：找聚類，決定今日主題

對剩餘候選論文做主題聚類：

1. **讀每篇的標題和摘要**，用一個詞概括它在談什麼（如「記憶」「安全」「評測」「工具呼叫」「多Agent」）
2. **對照 Step 5b 的隱含前提**：同主題的論文，是站在同一個前提上，還是前提互相衝突？主題只說明「在談什麼」，前提才說明「站在什麼立場」。
3. **找最有編輯價值的自然聚類**——哪個共同問題最值得讀者今天知道？篇數只是輔助訊號，不以最大聚類自動勝出。以下兩種聚類通常比「同主題」更有編輯價值：
   - **共享同一個前提**：幾篇不同主題的論文都依賴同一個未檢驗前提（例如都用 LLM-as-judge 打分）。今日主題可以就是這個前提。
   - **前提衝突**：同主題的論文前提互相矛盾，或某篇的結果正好檢驗了另一篇的前提。
4. **決定今日主題**——用一句話寫出入選論文的共同問題（如「Agent 怎麼記住重要的事」「現有評測是否反映真實能力」）

**聚類判斷範例**：

| 候選 | 一詞概括 | 隱含前提 | 聚類 |
|---|---|---|---|
| AutoMem: Automated Learning of Memory | 記憶 | 遊戲環境能代表長程工作負載 | ← |
| Context Compression for Long Agents | 記憶 | 壓縮後的摘要不遺失關鍵狀態 | ← 這三篇是一類 |
| Episodic Memory for Tool-Using Agents | 記憶 | LLM-as-judge 能判斷記憶是否被正確使用 | ← |
| Adaptive Adversaries Benchmark | 安全 | 靜態攻擊集能代表真實威脅（本篇正好檢驗並推翻） | |
| Multi-Agent Protocol Design | 多Agent | LLM-as-judge 能判斷協作品質 | |

→ 三篇記憶論文都通過可信度門檻且今日重要性較高時，今日主題可定為「Agent 的記憶管理」。若 Adaptive Adversaries 的今日重要性更高，另一個選項是「評測的地基」：它推翻了「靜態測試集夠用」的前提，而 Episodic Memory 和 Multi-Agent Protocol 都依賴未驗證的 LLM 評審。表格中的前提為示意，實際要從正文判斷。

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

**被 reject/watch 的論文，`reason` 必須說明「為什麼這篇比 selected 的弱」或「哪個具體面向不足」，不得只寫 "not selected this round" 或 "incremental"。**

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
6. 若 Groundlane 未授權，自動降級到 fallback 鏈下一層（Exa → Tavily → ...）。

從抓取結果中提取（**缺任何一項就換下一篇候選**）：
- **標題**
- **作者**：列出前 3 位 + et al.
- **機構**（若有）
- **arxiv ID**
- **摘要**（用於寫導讀，但不直接翻譯貼上）
- **公告批次日期**：確認屬於哪一天的官方 `new` listing 批次（Layer A 候選）或首次出現來源（Layer B/C 候選）
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

`tldr` 的寫法依 `.agents/skills/daily-digest-common/SKILL.md` 的「tldr 欄位規則」一節。

`order` 計算：距離**系列起點 2026-05-25** 的天數 + 1（2026-05-25 = 1, 2026-08-16 = 84, ...）。起點不可更動——改起點會讓新文章跟舊文章撞號，`pnpm check:series-order` 會擋。

### 內容結構與完整範例

**Step 7 動筆前，先完整讀這兩份檔案，再開始寫**：

1. `references/output-template.md`——內容結構模板，章節順序與格式要嚴格照做（今日總覽 → 讀這篇前該知道的詞 → 每篇論文的 TL;DR／編輯判斷 14 欄表格／領域背景／中階導讀／深入要點／Reviewer 一句話評／給你的 take-away → 今日收穫）。
2. `references/output-example.md`——2026-08-04 digest 節錄，展示預期的格式深度。

沒讀過這兩份不要動筆；zh-TW 與英文版都依同一份模板。

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 實際收錄 1-3 篇；沒有用低可信度或舊論文補足篇數
- [ ] 每篇都有「通過／有條件通過」可信度判定，且有正文證據，不只看摘要
- [ ] 入選論文的內部紀錄包含 `presentation` 與具體理由；沒有把寫作清楚誤當成研究可信
- [ ] 入選與 `watch` 候選都填了 `hiddenAssumption`／`hiddenAssumptionImpact`；入選論文的隱含前提已用白話寫進「主要限制」或「Reviewer 一句話評」
- [ ] 每篇都有「編輯判斷」表格，包含全部 14 欄（Venue、引用速度、機構、社群反應、可信度、證據成熟度、可復現性、為什麼選這篇、方向新意、今日重要性、實務連結、編輯信心、閱讀建議、主要限制）
- [ ] 收錄 2 篇以上時，盡量覆蓋至少 2 個不同面向
- [ ] 完整候選與排除理由已寫入 `.research/daily-arxiv-screening/YYYY-MM-DD.json`
- [ ] 每篇被 reject/watch 的論文都有具體 `reason`（不得只寫 "not selected this round"）和 `rejectionCategory`
- [ ] 每篇論文都有 arxiv ID 和 `[arxiv]()` + `[alphaxiv]()` 雙連結
- [ ] 「讀這篇前該知道的詞」有 4-6 個術語
- [ ] 每篇的「深入要點」包含至少 1 個具體數字
- [ ] 未複現結果標注「需等外部複現」並說明是誰的自測；有條件通過的論文已降低語氣強度
- [ ] 每篇的「給你的 take-away」都寫出具體使用情境與可執行動作，不只說「值得關注」
- [ ] zh-TW 與英文文章同時產出，雙向語言連結、入選篇數與章節結構一致
- [ ] 「今日收穫」是認知差（之前以為 X → 現在知道 Y），不是摘要
- [ ] 全文 < 3000 字
- [ ] description 和 tldr 已填寫
- [ ] series order 正確（距離 2026-05-25 的天數 + 1）
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
- [ ] Commit Epilogue 六步完成（圖解 / 英文版 / references WARN / daily-log / verify / push）— 見 `daily-digest-common`
