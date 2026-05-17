---
name: deep-research
description: Multi-source research for tools, frameworks, papers, models, products, or trends. Plans sub-questions, fetches primary sources, cross-validates facts, then outputs a structured research note ready to feed into the `post` skill as a deep-dive draft. Use when user says 研究一下 / 導讀 / deep research / 整理 / 我想了解 / 幫我看看 X 是什麼. Skip for single-fact lookups or implementation tasks.
---

# deep-research skill

把「研究 + 導讀新工具 / 論文 / 趨勢」結構化：拆問題 -> 多源蒐集 -> 交叉驗證 -> 萃取 -> 產出可發文的 research note。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 研究 LangGraph 1.x 怎麼變 | ✅ | |
| 導讀 Anthropic 新論文 | ✅ | |
| 了解 vector DB 選型 | ✅ | |
| 查某版本是否已發布 | | ❌ 單一事實，直接查 |
| 實作 RAG pipeline | | ❌ 用 ai-expert 或 coding workflow |

## 工具選擇

用當前 agent 可用的搜尋與抓取工具：

- Codex：優先用 `web.run` search/open；需要官方文件或最新資訊時必須查網路。
- Claude：可用 MCP search/scrape 工具時，依 `references/mcp-tools.md` 選工具。
- 通用原則：能搜就不用爬、能抓單頁就不用整站、能整站就不用瀏覽器。

完整工具映射與失敗處理見 `references/mcp-tools.md`。

## 執行步驟

### 1. 拆研究子問題

把題目轉成 3-6 個可獨立查證的子問題。方向不明時先列給使用者確認；錯題比錯答更貴。

範例見 `references/research-note-template.md`。

### 2. 蒐集

對每個子問題：

1. 搜尋候選來源，拿前 5-8 個。
2. 按來源品質排序：官方 > 一手作者 > 高品質二手 > 社群討論 > 內容農場。
3. 優先讀官方文件、release notes、論文、官方 blog、GitHub release/repo。
4. 每個高風險事實至少 2 個獨立來源；只有單源就標 `[unverified]`。

### 3. 交叉驗證

把關鍵事實列成事實交叉表，標明來源與狀態：

- `✅` confirmed
- `⚠️ unverified`
- `❌ conflict`

衝突的事實要列出來，不要選邊；讓使用者拍板。

### 4. 萃取結構

把材料壓成導讀文骨架：

- 核心概念：這個東西在解什麼問題
- 關鍵設計決定：為什麼這樣設計、捨棄了什麼
- 跟替代方案的比較
- 適合 / 不適合的情境
- 限制 / 已知問題
- 取捨總結

### 5. 產出 research note

存成 `.research/<YYYY-MM-DD>-<slug>.md`，不是直接發文。`.research/` 不入版控；若 `.gitignore` 還沒收錄就提醒使用者加上。

完整格式見 `references/research-note-template.md`。

### 6. 交接

把 research note 的草稿骨架給使用者看，問下一步：

- 用 `post` 發成 deep-dive？
- 補哪些子問題？
- 先存著之後再發？

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 跳過拆子問題，直接搜題目 | 廣搜回來通常沒結構 |
| 用一個來源就下結論 | 一手來源也可能過時或語境不足 |
| 省略事實交叉表 | 容易把幻覺寫進文章 |
| Research note 跟發文一起做 | 材料還沒齊就套句子，事實容易對不上 |

## 跟其他 skill 的關係

- `deep-research -> post`：研究完套 `tech-deep-dive.md` 發導讀文
- `deep-research -> post-update`：已有相關文章時補進舊文
- `deep-research vs ai-expert`：新工具 / 新論文 / 新趨勢先查清楚；架構與實作問題用 ai-expert

## 詳細參考

- 工具映射：`references/mcp-tools.md`
- Research note 模板：`references/research-note-template.md`
- 導讀文模板：`../post/templates/tech-deep-dive.md`
- 寫作風格：`../post/references/writing-guide.md`
