---
name: deep-research
description: Portable multi-source research for tools, frameworks, papers, models, products, or trends. Uses Groundlane plus specialized and platform-native research tools, distinguishes computer/local clients from Web-hosted agents, verifies primary sources, and outputs a structured research note. Use when user says 研究一下 / 導讀 / deep research / 整理 / 我想了解 / 幫我看看 X 是什麼. Skip for single-fact lookups or implementation tasks.
---

# deep-research skill

> **工具邊界**
> 公開網頁研究與抓取首選 Groundlane MCP：`web_search` 找候選來源、`web_fetch` 讀完整頁面、`web_extract` 做 selector 結構化抽取。GitHub、arXiv、Hugging Face、官方 API 等來源專用工具可以用。Groundlane 未掛載、斷線或某頁抓不到時，**不是停下來回報 blocker**，而是照 `references/mcp-tools.md` 的 fallback 鏈往下試（與 CLAUDE.md 的 Web Fetch 優先順序一致）；`stealth_fetch`、`web-fetch`、`fetch_page` 已退役不用。降級時記錄 `toolDegradation`。不要假設任何個人檔案路徑、部署 URL、帳號或 token。

把「研究 + 導讀新工具 / 論文 / 趨勢」結構化：拆問題 → 多源蒐集 → 交叉驗證 → 萃取 → 產出可發文的 research note。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「研究一下 LangGraph 1.x 怎麼變」 | ✅ | |
| 「導讀 Anthropic 新論文」 | ✅ | |
| 「我想了解 vector DB 的選型」 | ✅ | |
| 「LangGraph 1.x 出了沒？」 | | ❌ 單一事實 → 直接搜 |
| 「幫我寫個 RAG pipeline」 | | ❌ 實作 → 用 ai-expert |

## 工具選擇

先檢查當前 tool list，依執行環境選工具。**能搜就不用爬、能爬單頁就不用整站**。

環境分支、Groundlane 連線、備援策略 → `references/usage-modes.md`
完整工具映射與常見失敗 → `references/mcp-tools.md`

## 執行步驟

### 0. 多案例研究：定義母群 → 覆蓋矩陣 → 標註偏誤

當題目是「整理 N 個案例」「橫向比較」「系列文」時，在拆子問題之前先跑步驟零。單一主題研究跳過。

**呼叫 `research-selection` skill** 取得完整流程（定義母群、覆蓋矩陣、標註偏誤）。

核心紀律：**先定義邊界再搜尋，先掃完母群再選案，選完標偏誤。** 從「我知道的」直接挑是這個 skill 歷史上第二大的錯誤來源（第一大是搜尋摘要當全文）。

### 1. 拆研究子問題

把使用者的題目轉成 3-6 個可獨立查證的子問題。**列給使用者看一眼，確認問對方向再開始搜**——錯題比錯答更貴。

子問題範例 → `references/research-note-template.md`

### 2. 蒐集（每子問題 ≥ 2 來源）

**蒐集量和閱讀量是兩件事。** 搜尋撈回的是候選池，不是來源。凡是會進文章、進參考資料、或用來下判斷的，都要完整抓下來讀過。只看過搜尋摘要就寫進 note 的標 `[摘要層級]`。

對每個子問題：

1. 搜尋候選 URL，拿前 5-8 個
2. 研究工具/框架類題目時，掃 GitHub topics（按星數排序）補漏
3. 按來源品質排序：**官方一手 > 一手作者 > 高品質二手 > 內容農場**
4. 抓內容時打文件本身。**主要來源不帶 `query`**——`query` 只回片段，會讓你以為讀了全文
5. 標註取用層級（一手 / 摘要 / 轉引 / 未驗證），寫進 note
6. **補近年**：每個子問題另外限定 2024 年以後再搜一輪。用標題、作者名搜會撈到被引用最多的舊研究，近年研究不會自己冒出來；舊結論要確認有沒有被更新、推翻，或仍有近年研究支持。
7. **搜反證**：每個子問題至少一輪加 replication、criticism、limitations、failed、does not 的搜尋。

**讀不到時先換管道，再標 🔴／🟡**：作者個人網站 → 研究室 publications 頁 → arXiv／HTML 版 → 會議頁 preprint 連結 → 第三方鏡像 PDF → replication package。仍讀不到，找同作者後續論文、統合分析、專書出版社說明替代。試過的管道寫進 note。廠商或方法作者自述是唯一來源時，補學術經驗報告、企業實作論文、獨立研究或具名事件平衡。

本站踩過（2026-10-16）：三篇論文第一輪標「只讀到摘要」就交差，換管道後兩篇讀到全文；來源多是 2010 年前後，限定年份補搜後找到 2025–2026 年的研究，改了好幾篇的寫法；手寫筆記優於打字的研究其實已被 2021 年重複驗證推翻，是碰巧搜到才發現。

來源品質分級標準 → `references/source-quality-criteria.md`
付費牆繞路順序 → `references/mcp-tools.md`

### 2.5 掃描和精讀分開做，精讀要留得下證據

一個 agent 的 context 裝不下「掃一整個領域」加「把幾十篇讀完」。一篇統合分析全文約兩三萬 token，五十篇就超過一百萬。同時要求廣度與深度，結果一定是每篇只讀摘要，再用關鍵字抽幾段。本站踩過：2026-10-13 六個 agent 各負責一個子問題，每個掃了 60 到 150 個來源，回報都寫「沒有任何一篇是從頭讀到尾的」；補讀全文後，第一輪的結論被推翻好幾條（「先預測再看結果有效」只在圖上成立、「註解離字越近越好」方向相反、「初學者分不出 AI 解說好壞」原研究沒有測）。

分三段做，不要交給同一個 agent：

1. **掃描**（讀摘要即可）：照步驟 0 掃母群、填覆蓋矩陣，產出候選清單。這一段的產物只能用來決定「讀哪些」，不能下結論。
2. **選讀**：每篇預定的文章挑出結論會靠它的來源，通常 8 到 12 篇，含至少一篇結果相反或無效果的。清單給使用者看過。
3. **精讀**：一個 agent 最多負責 3 到 5 篇，從第一頁依序讀到最後一頁（含方法、結果表、限制、附錄裡被正文引用的部分），不准用關鍵字跳讀代替。每篇交一份抽取紀錄：
   - 研究設計、受試者、教材、比較對象、量了什麼
   - 每一個會被引用的結果：數字、對照條件、所在的節或表、原文一句
   - 作者自己列的限制
   - 與摘要說法不一致的地方（這一欄不能留空，沒有就寫「逐項對過，沒有」）
   - **讀取紀錄**：原文檔的總長度，以及依序讀過的每一段的起訖位置，加起來要涵蓋全文

綜合的人只能根據抽取紀錄寫結論。沒有抽取紀錄的來源，在文章裡只能寫成「這篇研究存在，只讀到摘要」，不能引用它的數字，也不能列進參考資料。

交件前由沒參與精讀的 agent 抽查：從每份抽取紀錄隨機挑三個數字回原文核對，並核對讀取紀錄有沒有涵蓋全文。對不上的那一份整份重讀。

### 3. 盤點讀取程度，並關閉缺口

**在寫結論前**，把每個來源標上讀取程度（✅ 一手 / 🟡 摘要轉引 / 🔴 未讀），並註明阻礙原因與試過的管道。盤點表寫進 research note。補搜多輪時回頭更新同一張表，不要一輪一輪往後接。

**標記不是終點，是待辦清單。** 先用 grep 盤點 note 裡所有 `🔴`、`🟡`、`[摘要層級]`、「沒公布／沒查到／未查／讀不到」，每一項只能有三種結局：

| 結局 | 條件 |
|---|---|
| ✅ 已關閉 | 找到一手來源並讀過全文，附網址與原文句 |
| ⚪ 確認無公開資料 | `references/mcp-tools.md`「取不到全文時」整條鏈都試過，逐一列出工具＋網址＋失敗原因 |
| ✉️ 只能寫信問 | 資料確定在登入區或報名系統；寫出該問誰、問什麼，不自己寄 |

還有能關閉的項目就繼續查（或再派 agent 補查），**不要把它轉給使用者說「文中會標明」**。交接時只列 ⚪ 和 ✉️，每項附試過的工具。

**何時停**：每個關鍵主張過五關才算研究夠——①讀過正文的一手來源 ②方法類主張分清作者主張與實證 ③至少一個 2024 年以後的來源或近年確認 ④搜過反證 ⑤換兩三組關鍵字（含中文、近義詞、其他學科用語）都只回已讀來源。沒過的關寫進 note，不要憑「差不多了」停。

**來源登錄（`sources.jsonl`）**：多子問題或系列研究，在 note 旁邊放一份 `sources.jsonl`，一行一個來源。搜尋完、精讀前先登錄並排序（先排再讀，每個子問題挑 3–5 個；能直接回答的一手來源優先於多篇二手整理），讀完回頭更新 `read_status`，讓盤點表與登錄檔一致：

```json
{"url":"","title":"","source_type":"official|paper|docs|media|blog|community|unknown","subquestion":"","published":"","authority_score":1,"relevance_score":1,"read_status":"queued|read|partial|abstract|snippet|blocked|skipped","tried":"","reason":""}
```

`read_status` 對應盤點符號：`read`＝✅、`partial`／`abstract`＝🟡、`snippet`＝🔎、`blocked`＝🔴（`tried` 寫試過的管道）。**`read` 只給整份內容都進到輸出的來源**：抓取結果 `truncated: true`、設了字元上限只讀到前段、或全文存檔後只用關鍵字抽段讀，一律是 `partial`，並在 `tried` 寫讀了多少；arXiv `/abs/` 頁、出版社頁、Semantic Scholar API 是 `abstract`。論文就算整份讀過，沒有第 2.5 節的抽取紀錄仍不能引數字。本站踩過（2026-10-20）：「知識庫怎麼建」研究筆記把 48 篇論文裡的大多數標成 ✅，回頭對抓取紀錄，整份讀過的只有 2 篇，其餘是摘要或只讀前幾千字元，還有兩筆只看過搜尋片段。分數只用來決定讀的順序，不寫進文章當證據等級。這份格式來自 2026-05 研究搜尋與爬蟲工具時的做法（產出見 `~/Work/research/.work/*/sources.jsonl`）；之前這裡引用的跨研究 `research-source-registry` skill 從未建立，已移除（2026-10-20）。

### 派 subagent 研究時

把蒐集外包給 subagent 時，prompt 必須寫進：

1. **結案標準**：每個缺口要關閉成 ✅／⚪／✉️（同步驟 3），「標記 [摘要層級] 後交差」不算完成
2. **完整 fallback 鏈**：照 `references/mcp-tools.md` 列出，並寫明「一個工具壞了就換下一個，不准停」
3. **輸出到檔案**：寫進 scratchpad 檔，只回短摘要與路徑

subagent 回來後，先對它的檔案跑步驟 3 的 grep 盤點；有可關閉的項目就再派補查，不要原樣轉給使用者。

### 4. 交叉驗證

把關鍵事實列成交叉表（`✅` / `⚠️ unverified` / `❌ conflict`）。

核心紀律：
- **交叉表只放「來源說了什麼」**，推論另標 `[推論]` 並寫明依據
- **數字連著對照條件一起記**——沒有對照條件的效果量不能用
- **引用前查更正/撤稿**
- **衝突的事實列出來，不要選邊**，讓使用者拍板
- **改寫（tldr/FAQ/glossary）要回原始來源對**，不是回自己正文對

表格格式 → `references/research-note-template.md`

### 5. 萃取結構

把材料壓成骨架：核心概念（在解什麼問題）→ 關鍵設計決定 → 替代方案比較 → 適合/不適合情境 → 限制 → 取捨總結。

### 6. 產出 research note

| 執行環境 | 輸出方式 |
|---|---|
| 有 filesystem | `.research/<YYYY-MM-DD>-<slug>.md`；系列研究用 `.work/research/<series-slug>/research-note.md`。`sources.jsonl` 放同一層（單檔 note 用 `.research/<YYYY-MM-DD>-<slug>.sources.jsonl`） |
| 無 filesystem（Web） | Markdown artifact 或完整輸出 |

格式 → `references/research-note-template.md`

### 7. 交接

研究本身不用問使用者要不要做；交接時才把草稿骨架給使用者看，要他決定的事放最前面。問下一步：發文（→ `post` skill）、補子問題、還是先存著。

交給 `post` 的只有「草稿骨架」：事實，加上會改變讀者做法的限制。來源清單、讀取完整度盤點、事實交叉表、待解問題是過程，留在 note，不搬成文章的段落或 H2；「待解問題」裡讀者會碰到的，改寫成用到那一段的一句限制。規則見 post skill `references/writing-guide.md`「查證過程不寫進正文」。

交接前對照 `references/anti-shortcuts.md` 反合理化清單。

## 跟其他 skill 的關係

- **deep-research → post**：研究完把草稿骨架交給 `post` skill（若已安裝）
- **deep-research → post-update**：有相關既有文章時用 `post-update` 補進去
- **deep-research vs ai-expert**：`ai-expert` 是「用已知回答」；`deep-research` 是「先查清楚再回」

## 詳細參考

- MCP 工具映射：`references/mcp-tools.md`
- 電腦／Web 使用模式：`references/usage-modes.md`
- Research note 模板：`references/research-note-template.md`
- 反合理化清單：`references/anti-shortcuts.md`
- 多案例選取標準：`research-selection` skill（獨立 skill，非本 skill 內部檔案）
