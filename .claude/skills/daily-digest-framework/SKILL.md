---
name: daily-digest-framework
description: "Routine F: event-driven AI Agent framework release detection for quidproquo.cc/daily. No important release = no output."
---

# daily-digest-framework

偵測 AI Agent 框架的重要版本發佈，產出更新日誌文章。事件驅動——沒有重要版本就不產出。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
YESTERDAY=$(date -d yesterday +%Y-%m-%dT00:00:00Z 2>/dev/null || date -v-1d +%Y-%m-%dT00:00:00Z)

# Step 2: 讀 watchlist（section B2 的框架清單）
cat src/data/agent-watchlist.json | jq '.companies[] | select(.section == "B2")'

# Step 3: 執行「搜尋方法」檢查是否有新 release
# Step 4: 執行「篩選規則」判斷是否值得寫
# Step 5: 若無重要更新 → 輸出「今日無框架更新」結束
# Step 6: 依「輸出格式」撰寫文章
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-framework-*.md
git commit -m "post(daily): framework update ${TODAY}"
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

### Step 3a：用 GitHub API 檢查追蹤框架（主要方法，最可靠）

逐一查詢以下 repos 的最新 release，檢查 `published_at` 是否在過去 24 小時內：

```bash
REPOS=(
  "langchain-ai/langgraph"
  "crewAIInc/crewAI"
  "modelcontextprotocol/specification"
  "mastra-ai/mastra"
  "pydantic/pydantic-ai"
  "agno-agi/agno"
  "anthropics/claude-code"
  "composioHQ/composio"
  "deepset-ai/haystack"
  "stanfordnlp/dspy"
  "huggingface/smolagents"
  "run-llama/llama_index"
)

for REPO in "${REPOS[@]}"; do
  echo "=== ${REPO} ==="
  gh api "repos/${REPO}/releases" --jq '.[0] | {tag_name, published_at, name, html_url}' 2>/dev/null
done
```

**判斷「過去 24 小時」**：比較 `published_at` 和 `$YESTERDAY`。只有 `published_at >= $YESTERDAY` 的才算新 release。

### Step 3b：用 Groundlane `web_search` 搜尋（捕捉不在追蹤清單的框架）

**Groundlane `web_search`：**
```
工具：Groundlane MCP → web_search
query: "AI agent framework release new version changelog 2026"
max_results: 10
published_after: "{YESTERDAY}"
```

**Groundlane `web_search`（補充查詢）：**
```
工具：Groundlane MCP → web_search
query: "AI agent framework release new version changelog 2026"
time_range: "day"
max_results: 10
```

合併兩者結果，以 URL 去重。

### Step 3c：取得 Release Notes 詳情

對每個新 release，用 GitHub API 取完整 release notes：

```bash
gh api "repos/{owner}/{repo}/releases/tags/{tag}" --jq '{body, tag_name, published_at, html_url}'
```

若 release body 為空，改用 CHANGELOG.md：
```bash
gh api "repos/{owner}/{repo}/contents/CHANGELOG.md" --jq '.content' | base64 -d | head -100
```

---

## 篩選規則

### Step 4：判斷是否「值得寫」

| 等級 | 條件 | 動作 |
|---|---|---|
| **必寫** | major 版本（如 1.0 → 2.0）或 breaking changes | 立即寫文 |
| **必寫** | MCP spec 的任何版本更新 | Agent 協定是核心追蹤對象 |
| **寫** | minor 版本有重要新功能（如新的 Agent 原語、記憶模組） | 寫文 |
| **跳過** | patch 版本只修 bug，無新功能 | 不寫 |
| **跳過** | pre-release / alpha / beta / rc | 不寫（除非是 watchlist 重點框架的首個 beta） |
| **跳過** | 非 Agent 相關的框架更新 | 不寫 |

**一天有多個 release**：每個框架獨立一篇文章。同一框架同天多個版本只寫最新的。

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-framework-{name}-{version}.md`

範例：`2026-08-17-framework-langgraph-1.5.0.md`

### Frontmatter

```yaml
---
title: "框架更新｜{框架名稱} {版本號}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, framework, daily, {framework-slug}]
lang: zh-TW
description: "一句話概述這個版本最重要的變更"
tldr: "2-3 行概述 breaking changes 和關鍵新功能"
series:
  name: "AI Framework Changelog"
  order: N
---
```

### 內容結構（嚴格按以下順序和格式）

```markdown
## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | {名稱} |
| 版本 | {tag，如 v1.5.0} |
| 前一版 | {上一個 release tag} |
| 發布日 | {YYYY-MM-DD} |
| Release Notes | [{連結文字}]({html_url}) |
| GitHub | [{owner/repo}](https://github.com/{owner}/{repo}) |
| Stars | {stars 數} |

## 這個版本為什麼重要

{2-3 句概述。不是列出所有功能，而是回答「這次升級對 Agent 開發者意味著什麼」。}

## 重要變更

{依功能分組列出，每項包含：}
- **{功能名稱}**：{一句話解釋做了什麼} → {對開發者的具體影響}

## Breaking Changes

{如果有 breaking changes，每項列出：}
- `{舊的 API / 用法}` → `{新的 API / 用法}`
- 影響範圍：{誰會被影響}

{如果沒有 breaking changes：}
本版本無 breaking changes。

## 遷移指南

{如果有 breaking changes，寫具體的遷移步驟：}

### 從 {舊版} 升級到 {新版}

```bash
# Step 1: 更新依賴
pip install --upgrade {package}=={version}

# Step 2: 修改程式碼（如有 breaking change）
# 舊寫法
{old_code}
# 新寫法
{new_code}
```

{如果沒有 breaking changes：}
直接升級即可，無需修改程式碼。

## 與其他框架的對比觀察

{1-2 句，把這次更新放在更大的框架競爭脈絡中。例如：「LangGraph 加入原生記憶後，和 CrewAI 的差異進一步縮小」}

## 今日收穫

{1-2 句認知差。「之前以為 X，現在知道 Y」}
```

---

## 完整範例

```markdown
---
title: "框架更新｜LangGraph 1.5.0"
date: 2026-08-17
category: daily
tags: [ai-agent, framework, daily, langgraph]
lang: zh-TW
description: "LangGraph 1.5 引入原生持久記憶和條件分支簡化語法，是自 1.0 以來最大的架構更新"
tldr: "LangGraph 1.5 三大變更：(1) 原生持久記憶取代外接 Mem0/Zep，延遲降 40%；(2) 條件分支從 3 層巢狀簡化為一行 when() 語法；(3) Breaking：StateGraph 建構方式改為 builder pattern。"
series:
  name: "AI Framework Changelog"
  order: 2
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | LangGraph |
| 版本 | v1.5.0 |
| 前一版 | v1.4.2 |
| 發布日 | 2026-08-17 |
| Release Notes | [GitHub Release](https://github.com/langchain-ai/langgraph/releases/tag/v1.5.0) |
| GitHub | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| Stars | 38,400 |

## 這個版本為什麼重要

LangGraph 終於把記憶從「你自己接」變成「框架原生支援」。以前用 LangGraph 做長程 Agent 必須外接 Mem0 或 Zep 處理記憶持久化，多一層跳轉延遲和故障點。1.5 把記憶直接整合進 checkpoint 機制，reduce 一層架構複雜度。另外，條件分支的新語法讓 graph 定義從「Python 程式碼」變得更像「宣告式流程圖」。

## 重要變更

- **原生持久記憶（Native Persistent Memory）**：checkpoint store 直接支援 episodic / semantic 雙層記憶 → 不再需要外接 Mem0 或 Zep，記憶讀取延遲從 ~120ms 降至 ~70ms
- **條件分支簡化（Conditional Edge Shorthand）**：新增 `when()` 語法取代巢狀 `add_conditional_edges()` → 典型的 3 路分支從 15 行縮減到 3 行
- **Streaming Token Callbacks**：新增 `on_token` 事件鉤子 → 可以在 streaming 時逐 token 觸發 UI 更新或計費邏輯
- **Python 3.13 支援**：正式支援 Python 3.13，移除 3.9 支援

## Breaking Changes

- `StateGraph(state_schema)` 建構方式改為 builder pattern：
  - `StateGraph(AgentState)` → `StateGraph.builder(AgentState).build()`
  - 影響範圍：所有現有 graph 定義都需修改
- `MemorySaver` 類別更名為 `CheckpointStore`：
  - `from langgraph.checkpoint import MemorySaver` → `from langgraph.checkpoint import CheckpointStore`
  - 影響範圍：使用持久化記憶的專案

## 遷移指南

### 從 1.4.x 升級到 1.5.0

```bash
pip install --upgrade langgraph==1.5.0
```

```python
# 舊寫法（1.4.x）
graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_conditional_edges("agent", should_continue, {"continue": "agent", "end": END})

# 新寫法（1.5.0）
graph = StateGraph.builder(AgentState).build()
graph.add_node("agent", agent_node)
graph.add_edge("agent", when(should_continue, {"continue": "agent", "end": END}))
```

## 與其他框架的對比觀察

LangGraph 原生記憶補上了和 CrewAI（內建 knowledge/memory）的功能差距。但 CrewAI 走的是 role-based 高階 API，LangGraph 仍然是 graph-level 操作——對需要精確控制 Agent 行為的團隊來說，LangGraph 1.5 是目前最完整的選擇。

## 今日收穫

之前以為框架的記憶功能是「nice to have 的加分項」，看到 LangGraph 延遲從 120ms 降到 70ms 才意識到，記憶層的架構位置（外接 vs 原生）直接影響 Agent 的回應速度——這不是功能問題，是性能問題。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 版本資訊表完整（框架/版本/前一版/發布日/Release Notes 連結/GitHub/Stars）
- [ ] 「這個版本為什麼重要」回答了「對 Agent 開發者意味著什麼」，不是功能列表
- [ ] 「重要變更」每項都有「做了什麼 → 對開發者的影響」
- [ ] Breaking Changes 有 `舊 → 新` 的程式碼對比
- [ ] 遷移指南有可執行的 bash/python 程式碼
- [ ] 「與其他框架的對比觀察」放在競爭脈絡中
- [ ] 「今日收穫」是認知差（之前以為 X → 現在知道 Y）
- [ ] Release Notes 連結已驗證可訪問
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
