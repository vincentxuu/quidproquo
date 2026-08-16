---
name: daily-digest-github
description: "Routine B: daily GitHub Trending AI/Agent digest for quidproquo.cc/daily. Scans GitHub trending repos and framework releases."
---

# daily-digest-github

每日掃描 GitHub Trending 的 AI/Agent 相關 repos 和重要框架 releases，產出 GitHub Digest 文章。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(date +%Y-%m-%d)

# Step 2: 冪等檢查——已產出就不重做
[ -f "src/content/posts/daily/${TODAY}-ai-agent-github-digest.md" ] && echo "已產出" && exit 0

# Step 3: 讀 watchlist（比對 B2 框架清單）
cat src/data/agent-watchlist.json | head -100

# Step 4: 執行「搜尋方法」取得 trending repos + releases
# Step 5: 執行「篩選規則」選 3-5 個 repos + 1-2 個 releases
# Step 6: 依「輸出格式」撰寫文章
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-ai-agent-github-digest.md
git commit -m "post(daily): github digest ${TODAY}"
git push origin main
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

### Step 4a：用 `gh api` 查重要框架 releases（主要方法）

逐一檢查以下框架的最新 release，確認是否在過去 48 小時內發佈：

```bash
# 每個框架都跑一次，取最新 release 的 tag 和日期
REPOS=(
  "langchain-ai/langgraph"
  "crewAIInc/crewAI"
  "modelcontextprotocol/specification"
  "mastra-ai/mastra"
  "pydantic/pydantic-ai"
  "agno-agi/agno"
  "anthropics/claude-code"
  "ComposioHQ/composio"
  "huggingface/smolagents"
  "run-llama/llama_index"
  "stanfordnlp/dspy"
  "deepset-ai/haystack"
  "browser-use/browser-use"
)

for REPO in "${REPOS[@]}"; do
  gh api "repos/${REPO}/releases?per_page=1" \
    --jq '.[0] | {tag: .tag_name, date: .published_at, name: .name, url: .html_url}' 2>/dev/null
done
```

只保留 `published_at` 在過去 48 小時內的 release。

### Step 4b：用 Exa + Tavily 合併搜尋 GitHub Trending

對每組查詢同時跑 Exa 和 Tavily，合併結果並以 URL 去重：

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `github.com trending AI agent framework tool 2026` | AI/Agent 相關 trending repos |
| Q2 | `github.com "MCP server" OR "model context protocol" new repo` | 新 MCP server repos |

**Exa（每組）：**
```
工具：mcp Exa → web_search_exa
numResults: 10
startPublishedDate: "{昨天 ISO 日期}"
type: "auto"
```

**Tavily（每組）：**
```
工具：mcp Tavily → tavily_search
query: "{同上 query}"
days: 1
maxResults: 10
```

### Step 4c：用 `gh api` 補充搜尋高星新 repos

```bash
# 過去 7 天建立、星數 > 100、AI 相關的 repos
gh api 'search/repositories?q=created:>'"$(date -d '7 days ago' +%Y-%m-%d)"'+stars:>100+topic:ai-agent&sort=stars&per_page=10' \
  --jq '.items[] | {name: .full_name, stars: .stargazers_count, desc: .description, url: .html_url, created: .created_at}'
```

### Step 4d：去重

合併所有結果，用 repo full_name 去重。此時應有 10-20 個候選。

---

## 篩選規則

### Step 5：從候選中選 3-5 個 repos + 1-2 個 releases

**Repo 篩選（按優先級）**：

| 優先級 | 條件 | 範例 |
|---|---|---|
| **P1 必選** | watchlist B2 框架的重要更新（major/minor version） | LangGraph 2.0、CrewAI 1.5 |
| **P2 優先** | 新 MCP server 且解決具體問題 | MCP server for Notion、Slack |
| **P3 優先** | AI Agent 開發工具，stars > 500 或日增 > 100 | 新的 Agent 框架、CLI 工具 |
| **P4 加分** | 開源模型微調/部署工具 | vLLM 新版、Ollama 新功能 |
| **排除** | 純前端 UI 庫（無 AI 成分） | |
| **排除** | 學習筆記型 repo（awesome-* 清單） | |
| **排除** | 非程式碼 repo（paper 集合、書） | |

**Release 篩選**：
- 只選有 breaking changes 或重要新功能的 release
- Patch 版本（x.x.1 → x.x.2）跳過，除非修了重大 bug

**多樣性**：盡量覆蓋不同類別（框架 / 工具 / MCP server / 模型），避免全是同一類。

---

## 輸出格式

### Frontmatter

```yaml
---
title: "AI Agent GitHub Digest — YYYY-MM-DD"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, github, open-source, daily]
lang: zh-TW
description: "一句話，今天 GitHub 上 AI/Agent 最值得注意的趨勢"
tldr: "3-5 行重點"
series:
  name: "AI Agent GitHub Digest"
  order: N
---
```

`order` 計算：距離 2026-08-16 的天數 + 1。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 今日亮點

{1-2 句，串起今天的主旋律。不是列表，是一段有觀點的文字。
 例：「今天的主角是 MCP 生態——三個新 server 同時出現，覆蓋 Notion、Slack 和 Google Drive。」}

## Trending Repos

### {repo-name} ⭐ {total_stars} (+{daily_gain})

[GitHub]({repo_url})　·　{language}　·　{license}

- **是什麼**：{一句話說明。不要抄 GitHub description，用自己的話。}
- **為什麼值得看**：{解決什麼問題？跟現有工具的差異是什麼？}
- **技術棧**：{核心依賴，如 LangGraph + FastAPI + ChromaDB}
- **上手難度**：{低/中/高 + 一句話理由}

---

{重複以上結構，3-5 個 repos}

## Notable Releases

### {framework} {version}

[Release Notes]({release_url})

- **重要變更**：{列出 2-3 個最重要的變更}
- **Breaking Changes**：{有就列，沒有就寫「無」}
- **對你的影響**：{一句話說如果你在用這個框架該做什麼}

---

{重複，1-2 個 releases。若今天沒有重要 release，這整段寫「今日無重要框架更新。」}

## 我今天學到什麼

{1-3 句。認知差——「之前以為 X，現在知道 Y」。}
```

---

## 完整範例

```markdown
---
title: "AI Agent GitHub Digest — 2026-08-10"
date: 2026-08-10
category: daily
tags: [ai-agent, github, open-source, daily, agent-tool-use, multi-agent]
lang: zh-TW
description: "MCP 生態今天爆發——三個新 server 同時出現，開源 Agent 框架也在悄悄收斂"
tldr: "三個新 MCP server（Notion/Slack/Google Drive）同日上線；Mastra 1.4 加入原生 A2A 支援；新 repo agent-sandbox 用 Firecracker microVM 跑 Agent，三天 2k stars"
series:
  name: "AI Agent GitHub Digest"
  order: 57
---

## 今日亮點

今天的主角是 MCP 生態——三個新 server 同時出現，分別接通 Notion、Slack 和 Google Drive，加上 Mastra 1.4 原生支援 A2A，感覺 Agent 的「工具呼叫」正在從「各自為政」收斂到「協定先行」。

## Trending Repos

### mcp-notion-server ⭐ 1,240 (+380)

[GitHub](https://github.com/example/mcp-notion-server)　·　TypeScript　·　MIT

- **是什麼**：讓 AI Agent 透過 MCP 協定直接讀寫 Notion 頁面和資料庫。
- **為什麼值得看**：之前要接 Notion 得自己寫 API wrapper，這個 server 直接走 MCP，Claude Code / Cursor 馬上能用。支援 page CRUD、database query、block-level 編輯。
- **技術棧**：MCP SDK + Notion API v1 + Zod schema validation
- **上手難度**：低——`npx mcp-notion-server` 就能跑，只需要一個 Notion integration token

---

### agent-sandbox ⭐ 2,130 (+520)

[GitHub](https://github.com/example/agent-sandbox)　·　Rust + Python　·　Apache-2.0

- **是什麼**：用 Firecracker microVM 給 AI Agent 提供隔離執行環境，每個 Agent session 一個獨立 VM。
- **為什麼值得看**：E2B 的開源替代品，但用 Rust 寫核心，冷啟動 < 150ms。對需要讓 Agent 跑不受信任程式碼的場景（coding agent、browser agent）很實用。
- **技術棧**：Firecracker VMM + Python SDK + gRPC
- **上手難度**：中——需要 Linux 且要開 KVM，macOS 用戶需透過 Lima/Docker

---

### crewai-flows ⭐ 890 (+210)

[GitHub](https://github.com/example/crewai-flows)　·　Python　·　MIT

- **是什麼**：CrewAI 社群開發的視覺化 flow 編輯器，讓你拖拉設定 multi-agent workflow。
- **為什麼值得看**：CrewAI 本體的 flow API 功能齊全但純程式碼，這個加了 React 前端，對非工程師的 PM/設計師友善。
- **技術棧**：CrewAI 1.x + React Flow + FastAPI
- **上手難度**：中——需要同時跑 Python backend + React frontend

## Notable Releases

### Mastra 1.4.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/v1.4.0)

- **重要變更**：原生 A2A（Agent-to-Agent）協定支援；新的 `workflow.parallel()` API 可同時跑多個 Agent；內建 rate limiter
- **Breaking Changes**：`workflow.run()` 回傳型別從 `string` 改為 `WorkflowResult` 物件
- **對你的影響**：如果你在用 Mastra，升級後 workflow 回傳值要改接 `.output` 屬性

## 我今天學到什麼

之前以為 MCP server 生態發展很慢（一個月冒出幾個），但今天三個同日上線讓我意識到可能已經過了臨界點——一旦 Claude Code 和 Cursor 的用戶基數夠大，社群自己就會把常用工具全部 MCP 化。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 3-5 個 repos，每個都有 GitHub URL 和 star 數
- [ ] 每個 repo 的「為什麼值得看」不是複製 GitHub description
- [ ] release 有 release notes 連結
- [ ] release 的 breaking changes 有明確列出（或標明「無」）
- [ ] 覆蓋至少 2 個不同類別（框架 / 工具 / MCP / 模型）
- [ ] 「我今天學到什麼」是認知差，不是摘要
- [ ] 全文 < 1500 字
- [ ] description 和 tldr 已填寫
- [ ] series order 正確
