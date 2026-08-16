---
name: daily-digest-tool
description: "Routine G: event-driven AI tool/MCP server recommendation for quidproquo.cc/daily. No noteworthy tool = no output."
---

# daily-digest-tool

發掘值得推薦的 AI 開發工具和 MCP server。事件驅動——沒有值得推薦的就不產出。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -d yesterday +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)

# Step 2: 冪等檢查
ls src/content/posts/daily/${TODAY}-tool-*.md 2>/dev/null && echo "已產出" && exit 0

# Step 3: 讀 watchlist（了解生態中已知的工具）
cat src/data/agent-watchlist.json | jq '.companies[] | select(.section | startswith("B") or startswith("C"))' | head -50

# Step 4: 執行「搜尋方法」取得候選工具
# Step 5: 執行「篩選規則」
# Step 6: 若無值得推薦的 → 輸出「今日無工具推薦」結束
# Step 7: 依「輸出格式」撰寫文章
# Step 8: 提交
git add src/content/posts/daily/${TODAY}-tool-*.md
git commit -m "post(daily): tool recommendation ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
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

### Step 4a：用 GitHub 搜尋新 MCP server repos

```bash
# 過去 24 小時新建的 MCP server repos，按 stars 排序
gh search repos "MCP server" --created=">${YESTERDAY}" --sort=stars --limit=20 \
  --json fullName,description,stargazersCount,createdAt,url

# 也搜尋 "model context protocol" 變體
gh search repos "model context protocol" --created=">${YESTERDAY}" --sort=stars --limit=10 \
  --json fullName,description,stargazersCount,createdAt,url
```

### Step 4b：用 Exa 搜尋 Product Hunt 和新工具發佈

```
工具：mcp Exa → web_search_exa

查詢 1:
  query: "site:producthunt.com AI agent tool developer 2026"
  numResults: 10
  startPublishedDate: "{YESTERDAY}T00:00:00Z"

查詢 2:
  query: "new MCP server launch open source AI tool"
  numResults: 10
  startPublishedDate: "{YESTERDAY}T00:00:00Z"

查詢 3:
  query: "AI developer tool CLI SDK launch announcement"
  numResults: 10
  startPublishedDate: "{YESTERDAY}T00:00:00Z"
```

### Step 4c：取得工具詳情

對每個候選工具，取得完整資訊：

```bash
# GitHub repos：用 API 取 README 和 metadata
gh api "repos/{owner}/{repo}" --jq '{full_name, description, stargazers_count, license, language, created_at, html_url}'
gh api "repos/{owner}/{repo}/readme" --jq '.content' | base64 -d | head -80
```

非 GitHub 工具用 firecrawl 抓取官方頁面：
```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
url: "{tool_homepage}"
formats: ["markdown"]
onlyMainContent: true
```

---

## 篩選規則

### Step 5：從候選中選 1 個最值得推薦的

| 優先級 | 條件 | 範例 |
|---|---|---|
| **P1 必推** | MCP server 且解決具體問題 | 資料庫查詢 MCP、Slack 整合 MCP |
| **P2 優先** | Agent 開發 SDK/CLI 且開源 | Agent 測試框架、prompt 管理 CLI |
| **P3 加分** | 與 watchlist 框架整合 | LangGraph plugin、CrewAI tool |
| **排除** | 閉源且無免費方案 | |
| **排除** | 只是現有工具的薄 wrapper | 只是把 curl 包成 npm package |
| **排除** | README 不完整、無安裝指引 | |
| **排除** | 已在 watchlist 中的知名工具 | 不推薦 Cursor、Cline 這種已知的 |

**必須滿足**：
- 能在 5 分鐘內裝好試用
- 解決一個具體的、可描述的問題
- 有 README 且至少有安裝和基本用法說明

**一天最多推薦 1 個工具**。如果多個工具都很好，選最有新聞價值的那個。

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-tool-{slug}.md`

`slug` = 工具名稱的 kebab-case（如 `mcp-database-query`）

### Frontmatter

```yaml
---
title: "工具推薦｜{工具名稱} — {一句話說它做什麼}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, tool, daily, {tool-type}]
lang: zh-TW
description: "一句話：這個工具解決什麼問題"
tldr: "{工具名稱} 是 {一句話定義}。安裝：{一行安裝指令}。解決了 {什麼問題}。"
series:
  name: "AI Tool of the Day"
  order: N
---
```

`tool-type` 從以下選一個：`mcp-server`、`cli-tool`、`sdk`、`vscode-extension`、`framework-plugin`

### 內容結構（嚴格按以下順序和格式）

```markdown
## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | {名稱} |
| 類型 | {MCP server / CLI / SDK / VS Code extension / ...} |
| GitHub | [{owner/repo}]({url}) |
| Stars | {N} |
| 語言 | {主要語言} |
| 授權 | {MIT / Apache-2.0 / ...} |
| 安裝 | `{一行安裝指令}` |

## 解決什麼問題

{2-3 段。第一段描述痛點（「你是否遇過 X 問題？」）。第二段說明這個工具如何解決（核心機制）。第三段說適合什麼場景。}

## 快速上手

### 安裝

```bash
{完整安裝指令，包含依賴}
```

### 基本用法

```{language}
{5-15 行程式碼示範最核心的功能}
```

### 進階用法（選填）

```{language}
{展示一個進階功能，如自定義設定或整合其他工具}
```

## 與現有工具的比較

{這個工具和它解決的同類問題的現有方案比較。用表格或 bullet 列出差異。}

| | {新工具} | {替代方案 A} | {替代方案 B} |
|---|---|---|---|
| {特點 1} | ✅ | ❌ | ✅ |
| {特點 2} | ✅ | ✅ | ❌ |

## 注意事項

{1-3 個使用時要注意的坑：授權限制、已知 bug、不支援的場景。}

## 今日收穫

{1-2 句認知差。}
```

---

## 完整範例

```markdown
---
title: "工具推薦｜mcp-postgres — 讓 Agent 直接查詢 PostgreSQL"
date: 2026-08-17
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 AI Agent 直接對 PostgreSQL 執行 SQL 查詢，支援 schema introspection 和唯讀模式"
tldr: "mcp-postgres 是一個 MCP server，讓 Agent 直接查詢 PostgreSQL。安裝：npx @anthropic/mcp-postgres。解決了 Agent 需要手動傳遞 SQL 結果的問題。"
series:
  name: "AI Tool of the Day"
  order: 2
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-postgres |
| 類型 | MCP server |
| GitHub | [anthropics/mcp-postgres](https://github.com/anthropics/mcp-postgres) |
| Stars | 1,247 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx @anthropic/mcp-postgres` |

## 解決什麼問題

你在做一個分析 Agent，它需要查詢資料庫回答問題。以前的做法是：Agent 生成 SQL → 你的應用層執行 SQL → 把結果餵回 Agent。三次跳轉，每次都可能出錯——SQL 語法錯了要重來，結果格式不對要再轉。

mcp-postgres 讓 Agent 透過 MCP 協定直接和 PostgreSQL 對話。Agent 看得到 schema（表名、欄位、型別），自己寫 SQL，自己拿結果。你的應用層從「中間翻譯官」變成「權限守門員」——只需要配置哪些表可以被存取。

適合場景：資料分析 Agent、內部 dashboard Agent、客服 Agent 需要查訂單狀態。

## 快速上手

### 安裝

```bash
# 加入 Claude Code 的 MCP 設定
claude mcp add postgres npx @anthropic/mcp-postgres "postgresql://user:pass@localhost:5432/mydb"
```

### 基本用法

Agent 自動獲得三個 MCP 工具：

- `list_tables` — 列出所有可存取的表
- `describe_table` — 取得表的 schema（欄位名稱、型別、約束）
- `query` — 執行唯讀 SQL 查詢

```sql
-- Agent 會自己做的事：
-- 1. 先 list_tables 了解有什麼表
-- 2. 再 describe_table 了解欄位
-- 3. 最後 query 取得答案
SELECT customer_name, SUM(amount) as total
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_name
ORDER BY total DESC
LIMIT 10;
```

### 進階用法

```json
// 限制可存取的表（在 MCP 設定中）
{
  "allowedTables": ["orders", "products", "customers"],
  "readOnly": true,
  "maxRows": 1000
}
```

## 與現有工具的比較

| | mcp-postgres | 手動 SQL 傳遞 | LangChain SQLDatabase |
|---|---|---|---|
| Agent 直接存取 schema | ✅ | ❌ | ✅ |
| MCP 原生 | ✅ | ❌ | ❌ |
| 唯讀模式 | ✅ | 需自行實作 | ✅ |
| 不需要 Python | ✅ | — | ❌（需 Python） |
| 表級權限控制 | ✅ | 需自行實作 | 部分 |

## 注意事項

- **唯讀強制建議開啟**：預設允許寫入。生產環境務必設 `readOnly: true`，否則 Agent 可能執行 DELETE 或 UPDATE。
- **連線字串安全**：不要把密碼寫在版本控制中。用環境變數：`postgresql://${DB_USER}:${DB_PASS}@...`
- **大結果集**：沒有內建分頁。查詢回傳超過 1000 行會塞爆 context window。用 `maxRows` 限制。

## 今日收穫

之前以為「Agent 存取資料庫」需要寫一堆膠水程式碼（query builder、result formatter、error handler），現在才發現 MCP 把這些全部標準化了——一個 MCP server 就等於一個標準化的工具介面，Agent 不需要知道背後是 PostgreSQL 還是 MySQL。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 工具資訊表完整（名稱/類型/GitHub/Stars/語言/授權/安裝指令）
- [ ] 「解決什麼問題」描述了具體痛點，不是泛泛的功能介紹
- [ ] 「快速上手」有可直接複製執行的安裝指令和程式碼
- [ ] 「與現有工具的比較」有具體的差異對照（表格或 bullet）
- [ ] 「注意事項」有 1-3 個實際的使用陷阱
- [ ] 「今日收穫」是認知差
- [ ] 工具的 GitHub 連結已驗證存在
- [ ] 授權資訊正確（從 GitHub API 確認，不要猜）
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
