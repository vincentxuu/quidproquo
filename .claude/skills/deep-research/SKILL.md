---
name: deep-research
description: Multi-source research with MCP search/scrape tools — plan sub-questions, fetch primary sources, cross-validate, then output a structured research note ready to feed into the `post` skill as a deep-dive draft. Use when user says 研究一下 / 導讀 / deep research / 整理 / 我想了解 / 幫我看看 X 是什麼 and the topic is a tool, framework, paper, model, product, or trend. Skip when user only wants a quick lookup (single answer, no synthesis).
---

# deep-research skill

把「研究 + 導讀新工具/論文/趨勢」的流程結構化：拆問題 → 多源蒐集 → 交叉驗證 → 萃取 → 產出可發文的 research note。

## 何時用

| 情境 | 用 deep-research | 不用 |
|---|---|---|
| 「研究一下 LangGraph 1.x 怎麼變」 | ✅ |  |
| 「導讀 Anthropic 新論文」 | ✅ |  |
| 「我想了解 vector DB 的選型」 | ✅ |  |
| 「LangGraph 1.x 出了沒？」 |  | ❌（單一事實 → 直接搜） |
| 「幫我寫個 RAG pipeline」 |  | ❌（這是實作，用 ai-expert） |

## 工具映射（按用途選，不要全用）

CLAUDE.md 規定**不要用**內建 WebFetch / Playwright；用 MCP 工具。

| 用途 | 首選 MCP 工具 | 備援 |
|---|---|---|
| 廣域搜尋（找候選來源） | `tavily_search` 或 `exa_web_search` | `linkup-search` |
| 學術 / GitHub / 程式碼導向 | `exa_web_search`、`exa_web_fetch` | `tavily_search` |
| 抓單一頁面內容（轉 markdown） | `firecrawl_scrape`、`tavily_extract` | `get_url_markdown` |
| 整站爬（多頁文件） | `firecrawl_crawl`、`tavily_crawl` | — |
| 站點地圖（找有哪些頁可讀） | `firecrawl_map`、`tavily_map` | — |
| 互動取資料（要 JS render） | `firecrawl_browser_*`、`firecrawl_interact` | — |
| 整合式深研（黑箱多步） | `tavily_research` | — |

選擇原則：能搜就不用爬、能爬單頁就不用整站、能整站就不用瀏覽器。**每升一階成本與失敗率都升一階**。

## 執行步驟

### 1. 拆研究子問題（不省這步）

把使用者的題目轉成 3-6 個可獨立查證的子問題。範例：

```
題目：研究 LangGraph 1.x 的變動

子問題：
1. 1.x 的 release note 有哪些 breaking changes？
2. State / Channel / Annotation 模型怎麼變？
3. 跟 0.x 的 migration path 是什麼？
4. 社群實際遷移時踩到什麼坑？
5. 跟 LangChain 主套件的關係怎麼變？
```

把子問題列給使用者看一眼，**確認問對方向再開始搜**。錯題比錯答更貴。

### 2. 蒐集（每子問題 ≥ 2 來源）

對每個子問題：

- 先 `tavily_search` / `exa_web_search` 找候選 URL（拿前 5-8 個）
- 排序候選：**官方 > 一手作者 > 高品質二手 > 內容農場**
  - 官方文件、release notes、論文、官方 blog、官方 GitHub repo
  - 作者本人 X / 個人 blog / Mastodon
  - HN / Reddit / 高 star repo issue 討論
  - 內容農場（Medium 抄稿、SEO blog）→ 通常跳過
- `firecrawl_scrape` 或 `tavily_extract` 抓內容
- **每個事實至少要 2 個獨立來源**才寫進結論。沒有兩源就標 [unverified]

### 3. 交叉驗證

把蒐集到的關鍵事實列成表，標明來源：

```
| 事實 | 來源 1 | 來源 2 | 一致？ |
|---|---|---|---|
| LangGraph 1.0 release date | 官方 blog 2025-10 | GitHub release v1.0.0 | ✅ |
| 預設 checkpointer 改 Postgres | 官方文件 | （只此一源） | ⚠️ unverified |
```

**衝突的事實要列出來，不要選邊**。讓使用者拍板。

### 4. 萃取結構

把材料壓成導讀文常用的骨架：

- **核心概念**：這個東西在解什麼問題（不是「特色清單」）
- **關鍵設計決定**：為什麼這樣設計、捨棄了什麼
- **跟替代方案的比較**：選它而不選 X 的理由
- **適合 / 不適合的情境**
- **限制 / 已知問題**
- **取捨總結**

### 5. 產出 research note

存成暫存檔（**不是直接發文**）：

```
.research/<YYYY-MM-DD>-<slug>.md
```

格式：

```markdown
# Research: <題目>

## 子問題
1. ...

## 來源清單
- [標題](URL) — 官方 / 一手 / 二手；訪問日：YYYY-MM-DD
- ...

## 事實交叉表
| 事實 | 來源 | 驗證狀態 |
|---|---|---|

## 草稿骨架
（直接可丟給 post skill 的 deep-dive 模板）

## 待解問題
- ...
```

`.research/` 目錄不入版控（提醒使用者加到 `.gitignore` 如果還沒）。

### 6. 交接

把 research note 的「草稿骨架」段給使用者看，問下一步：

- 「要直接用 `post` skill 發成導讀文嗎？」（→ 用 tech-deep-dive 模板，category 通常 `ai` / `tech`）
- 「還想補哪些子問題？」
- 「先存著之後再發？」

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「跳過拆子問題，直接搜題目」 | 廣搜回來都是 SEO 內容，沒結構，最後寫不出導讀 |
| 「用一個來源就下結論」 | 一手來源也會錯版本/講未公開細節；至少兩源是底線 |
| 「直接 firecrawl_crawl 整站」 | 大多數題目用 search + scrape 單頁就夠，整站爬慢、貴、容易被 rate limit |
| 「用內建 WebFetch 比較快」 | CLAUDE.md 明確禁用，只用 MCP 工具 |
| 「省略事實交叉表」 | 沒這步就會把 LLM 幻覺當事實寫進文章 |
| 「research note 跟發文一起做」 | 兩件事混在一起，材料還沒齊就在套句子，最後事實對不上 |

## 跟其他 skill 的關係

- **deep-research → post**：研究完，把骨架丟給 post skill，套 `tech-deep-dive.md` 模板發成導讀文
- **deep-research → post-update**：原本有相關文章 → 研究完用 post-update 補進去（例如版本更新）
- **deep-research vs ai-expert**：ai-expert 是「用我會的知識回答你」；deep-research 是「先去查清楚再回」。新工具/新論文一律用 deep-research 開頭

## 詳細參考

- 導讀文模板：`../post/templates/tech-deep-dive.md`
- 寫作風格（包含寫導讀的展開原則）：`../post/references/writing-guide.md`
