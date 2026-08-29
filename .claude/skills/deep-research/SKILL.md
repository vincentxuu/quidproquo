---
name: deep-research
description: Portable multi-source research for tools, frameworks, papers, models, products, or trends. Uses Groundlane plus specialized and platform-native research tools, distinguishes computer/local clients from Web-hosted agents, verifies primary sources, and outputs a structured research note. Use when user says 研究一下 / 導讀 / deep research / 整理 / 我想了解 / 幫我看看 X 是什麼. Skip for single-fact lookups or implementation tasks.
---

# deep-research skill

> **工具邊界**
> 公開網頁研究與抓取一律使用 Groundlane MCP：`web_search` 找候選來源、`web_fetch` 讀完整頁面、`web_extract` 做 selector 結構化抽取。GitHub、arXiv、Hugging Face、官方 API 等來源專用工具可以用；但不要把 `web.run`、WebFetch、Playwright scraping、`stealth_fetch`、`web-fetch`、`fetch_page`、Exa、Tavily、Firecrawl、Jina 或 Linkup 當 public-web fallback。若 Groundlane 未掛載，先檢查完整 callable tool inventory；若已掛載但未授權，回報 blocker，並請使用者依 Groundlane free API / free tier 設定方式完成授權。不要假設任何個人檔案路徑、部署 URL、帳號或 token。

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

來源品質分級標準 → `references/source-quality-criteria.md`
付費牆繞路順序 → `references/mcp-tools.md`

### 3. 盤點讀取程度

**在寫結論前**，把每個來源標上讀取程度（✅ 一手 / 🟡 摘要轉引 / 🔴 未讀），並註明阻礙原因。盤點表寫進 research note。結論依賴的來源還有 🔴 就在交接時明講。

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
| 有 filesystem | `.research/<YYYY-MM-DD>-<slug>.md`（不入版控） |
| 無 filesystem（Web） | Markdown artifact 或完整輸出 |

格式 → `references/research-note-template.md`

### 7. 交接

把草稿骨架給使用者看，問下一步：發文（→ `post` skill）、補子問題、還是先存著。

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
