---
name: deep-research
description: Multi-source research for tools, frameworks, papers, models, products, or trends. Plans sub-questions, fetches primary sources, cross-validates facts, then outputs a structured research note ready to feed into the `post` skill as a deep-dive draft. Use when user says 研究一下 / 導讀 / deep research / 整理 / 我想了解 / 幫我看看 X 是什麼. Skip for single-fact lookups (no synthesis needed) or implementation tasks (use ai-expert instead).
---

# deep-research skill

把「研究 + 導讀新工具 / 論文 / 趨勢」結構化：拆問題 → 多源蒐集 → 交叉驗證 → 萃取 → 產出可發文的 research note。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「研究一下 LangGraph 1.x 怎麼變」 | ✅ | |
| 「導讀 Anthropic 新論文」 | ✅ | |
| 「我想了解 vector DB 的選型」 | ✅ | |
| 「LangGraph 1.x 出了沒？」 | | ❌ 單一事實 → 直接搜 |
| 「幫我寫個 RAG pipeline」 | | ❌ 實作 → 用 ai-expert |

## 工具選擇原則

用當前 agent 可用的搜尋與抓取工具：

- Codex：優先用 `web.run` search/open；需要官方文件或最新資訊時必須查網路。
- Claude：一律用 MCP search/scrape 工具，**不要用**內建 `WebFetch` / `Playwright`；依 `references/mcp-tools.md` 選工具。

**能搜就不用爬、能爬單頁就不用整站、能整站就不用瀏覽器**。每升一階成本與失敗率都升一階。

完整工具映射、備援、常見失敗對應 → `references/mcp-tools.md`

## 執行步驟

### 1. 拆研究子問題

把使用者的題目轉成 3-6 個可獨立查證的子問題。**列給使用者看一眼，確認問對方向再開始搜**——錯題比錯答更貴。

子問題範例 → `references/research-note-template.md`

### 2. 蒐集（每子問題 ≥ 2 來源）

對每個子問題：

1. 搜尋候選 URL（Claude：`tavily_search` / `exa_web_search`；Codex：`web.run`），拿前 5-8 個
2. 按來源品質排序：**官方 > 一手作者 > 高品質二手 > 內容農場**
   - 官方文件、release notes、論文、官方 blog、官方 GitHub repo
   - 作者本人 X / 個人 blog / Mastodon
   - HN / Reddit / 高 star repo issue
   - 內容農場（Medium 抄稿、SEO blog）通常跳過
3. `firecrawl_scrape` 或 `tavily_extract` 抓單頁內容
4. **每個事實至少要 2 個獨立來源**才寫進結論。只有單源就標 `[unverified]`

### 3. 交叉驗證

把蒐集到的關鍵事實列成事實交叉表，標明來源與驗證狀態（`✅` / `⚠️ unverified` / `❌ conflict`）。

**衝突的事實要列出來，不要選邊**。讓使用者拍板。

表格格式與範例 → `references/research-note-template.md`

### 4. 萃取結構

把材料壓成導讀文常用的骨架：

- **核心概念**：這個東西在解什麼問題（不是「特色清單」）
- **關鍵設計決定**：為什麼這樣設計、捨棄了什麼
- **跟替代方案的比較**：選它而不選 X 的理由
- **適合 / 不適合的情境**
- **限制 / 已知問題**
- **取捨總結**

### 5. 產出 research note

存成暫存檔 `.research/<YYYY-MM-DD>-<slug>.md`（**不是直接發文**）。

完整 note 格式 → `references/research-note-template.md`

`.research/` 不入版控；若 `.gitignore` 還沒收錄就提醒使用者加上。

### 6. 交接

把 research note 的「草稿骨架」段給使用者看，問下一步：

- 「要直接用 `post` skill 發成導讀文嗎？」（→ 套 `tech-deep-dive` 模板，category 通常 `ai` / `tech`）
- 「還想補哪些子問題？」
- 「先存著之後再發？」

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 跳過拆子問題，直接搜題目 | 廣搜回來都是 SEO 內容，沒結構，最後寫不出導讀 |
| 用一個來源就下結論 | 一手來源也會錯版本 / 講未公開細節；至少兩源是底線 |
| 直接 `firecrawl_crawl` 整站 | 多數題目 search + 單頁 scrape 就夠，整站爬慢、貴、易被 rate limit |
| （Claude）用內建 `WebFetch` 比較快 | CLAUDE.md 明確禁用，只用 MCP 工具；Codex 改用 `web.run` |
| 省略事實交叉表 | 沒這步就會把 LLM 幻覺當事實寫進文章 |
| Research note 跟發文一起做 | 兩件事混在一起，材料還沒齊就在套句子，最後事實對不上 |

## 跟其他 skill 的關係

- **deep-research → post**：研究完，把草稿骨架丟給 `post` skill，套 `tech-deep-dive.md` 模板發成導讀文
- **deep-research → post-update**：原本有相關文章 → 研究完用 `post-update` 補進去（例如版本更新）
- **deep-research vs ai-expert**：`ai-expert` 是「用我會的知識回答你」；`deep-research` 是「先去查清楚再回」。新工具 / 新論文一律從 `deep-research` 開頭

## 詳細參考

- MCP 工具完整映射：`references/mcp-tools.md`
- Research note 模板與範例：`references/research-note-template.md`
- 導讀文模板：`../post/templates/tech-deep-dive.md`
- 寫作風格（包含導讀展開原則）：`../post/references/writing-guide.md`
