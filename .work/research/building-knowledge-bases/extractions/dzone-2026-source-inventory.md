# 抽取紀錄：Soni (2026) Connect Existing Data to AI Retrieval: How to Build Production-Ready Search Without Rebuilding Core Systems（DZone 2026 Trend Report 摘錄）

read_status=full（Exa web_fetch 取得全文，從標題讀到參考文獻）

## 書目

- Jubin Soni, FBCS。DZone，2026-06-23。"Editor's Note: ... written for and published in DZone's 2026 Trend Report, Cognitive Databases, Intelligent Data"。
- https://dzone.com/articles/ai-retrieval-with-existing-data ；配套程式 github.com/jubins/dzone-tr-ai-retrieval-starter（未讀）
- 讀取方式：curl 回 403（4,569 bytes 擋頁）；改用 Exa web_fetch 取得全文（約 2.5 萬字元，未另存檔；內容見本紀錄摘錄）。

## 性質

- 業界從業者教學文（技術媒體），非官方、非實證；有可直接套用的盤點表與 YAML 範本。只當「範本例子」引用。

## 可引用內容（原文）

1. Step 2「Map Existing Data Sources and Boundaries」："For each one, record the owner, how often it changes, any sensitive fields, the permission rule, and a handling decision. Keep the list in a file so your program and your team read the same information."
2. 處理方式欄是最重要的欄位："The handling decision is the most important field. You can index stable content, fetch volatile or sensitive data live, use some sources only as filters, or exclude a source." 選項：`index | live_fetch | metadata_only | summarize | exclude`。
3. 經驗法則："As a rule, index stable, widely readable content and fetch live anything that changes often."
4. 範例表（Table: Sample Source Inventory for a Support-Knowledge Workflow）：

| Data Source | Owner | Freshness | Access Rule | Indexing Decision |
|---|---|---|---|---|
| Help-center articles | Docs team | Weekly | All agents | Index (keyword + vector) |
| Ticket history (CRM) | Support ops | Near real time | Role-scoped by queue | Live fetch + metadata filter |
| Product spec wiki | Engineering | Ad hoc | Internal only | Index; exclude restricted spaces |
| Billing records (DB) | Finance | Real time | Strict, per-account | Exclude from index; live lookup only |

5. Step 1：先選一個工作流程，"Do not start with a broad, company-wide search that has no clear owner, since you cannot tell whether a result is correct."
6. Step 4：用穩定 ID "so an update replaces the old chunk instead of creating a copy"；"When a record is deleted or its access is removed, delete its chunks too."
7. Step 6 評估題型含「Outdated topic → Current document → Latest version returned」。

## 沒寫的事

- 範例表沒有「格式」「量」「版本／生效日」欄；範圍卡要求的「系統、格式、量、owner、更新頻率、存取限制」需自行合併（本表有 owner、更新頻率、存取限制、處理決策；格式與量要補）。
- 沒處理多版本與副本。

## 對 order 12 的用法

- 「處理方式」欄（收／即時查／只當篩選／排除）是決定第一批收錄範圍的直接工具，可借用並註明出處。
- 「先選一個有 owner 的工作流程，不要一開始就全公司搜尋」對應「第一批收錄範圍」。

## 2026-10-22 全文核對（依 _spotcheck-batch9）
- 以 mcp__exa__web_fetch_exa 重抓全文（作者 Jubin Soni，2026-06-23，DZone 2026 Trend Report 摘錄），Step 1–8 與結論全讀。
- 核對：Step 2 原句「For each one, record the owner, how often it changes, any sensitive fields, the permission rule, and a handling decision.」「The handling decision is the most important field.」「As a rule, index stable, widely readable content and fetch live anything that changes often.」Step 1「Do not start with a broad, company-wide search that has no clear owner」——皆一字不差。
- 範例表：Help-center 索引、Ticket history 即時查＋metadata 過濾、Product spec wiki 索引但排除限制空間、Billing 排除只即時查。沒有「訂單狀態」例子（那是 Microsoft CAF 的 Order tracking → API）。
- Step 6：建議 30–50 題真實問題起步，含受限與不可回答題、過時題要求「Latest version returned」。
