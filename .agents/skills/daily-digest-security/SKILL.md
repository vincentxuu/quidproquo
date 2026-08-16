---
name: daily-digest-security
description: "Routine D: event-driven AI security alert for quidproquo.cc/daily. No significant security incident = no output."
---

# daily-digest-security

偵測 AI/Agent 資安事件並寫資安警報。事件驅動——沒有重大事件就不產出任何檔案。
每個事件必須同時寫攻擊面分析和防禦做法——只報事件不報防禦的文章沒有價值。

---

## 執行流程

```bash
# Step 1: 準備
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

# Step 2: 讀 watchlist（比對 B7 安全公司）
cat src/data/agent-watchlist.json | jq '.companies[] | select(.section == "B7") | .name'

# Step 3: 執行「搜尋方法」偵測安全事件
# Step 4: 判斷：若無重大事件 → 輸出「今日無資安事件」&& exit 0
# Step 5: 對事件執行「詳情抓取」+ 交叉驗證
# Step 6: 依「輸出格式」撰寫警報
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-security-*.md
git commit -m "post(daily): security alert ${TODAY}"
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

### Step 3a：用 Exa + Tavily 合併搜尋（，跑 4 組查詢）

```
工具：mcp Exa → web_search_exa
每組查詢設定：
  numResults: 10
  startPublishedDate: "{昨天的 ISO 日期}"
  type: "auto"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `"prompt injection" OR "jailbreak" AI agent attack vulnerability 2026` | Prompt injection / 越獄 |
| Q2 | `"MCP" OR "model context protocol" security vulnerability exploit` | MCP 協定安全 |
| Q3 | `"AI agent" security incident breach "supply chain" malicious` | Agent 供應鏈 / 惡意套件 |
| Q4 | `site:thehackernews.com AI OR LLM OR agent security` | The Hacker News AI 資安 |

### 注意：Tavily 與 Exa 平行執行

```
工具：mcp Tavily → tavily_search
query: "AI security vulnerability incident 2026"
days: 1
maxResults: 5
```

### Step 3c：檢查專業來源（有信號時才做）

```
# Unit 42 / Palo Alto Networks
firecrawl_scrape url: "https://unit42.paloaltonetworks.com/category/threat-research/"
formats: ["markdown"], onlyMainContent: true

# OWASP LLM Top 10（每季看一次）
firecrawl_scrape url: "https://genai.owasp.org/"

# AI Incident Database
firecrawl_scrape url: "https://incidentdatabase.ai/"
```

---

## 篩選規則

### Step 4：判斷是否有值得報導的事件

**觸發條件**（符合任一）：
- 有具體的 CVE 或漏洞編號
- 有實際受害者或受影響的系統
- 有可重現的攻擊 PoC
- watchlist B7 安全公司發佈的研究報告
- OWASP / MITRE ATLAS 新增條目

**不觸發**（跳過）：
- 純理論討論、沒有 PoC 的「可能性」文章
- 已知漏洞的重複報導
- 只有單一社群來源（Reddit/Twitter 帖子）且無法交叉驗證
- 攻擊影響僅限 demo/playground 環境

### 交叉驗證（必做）

同一事件至少需要 **2 個獨立來源** 確認才能寫：
- 官方公告（廠商 security advisory）
- 安全研究報告（Unit 42、Lakera、Invariant Labs）
- 新聞報導（The Hacker News、BleepingComputer）
- CVE / NVD 記錄

只有 1 個來源的事件 → 在文中標注「⚠️ 單一來源，待驗證」。

---

## 詳情抓取

### Step 5：取得事件完整資訊

用 firecrawl 抓取事件來源頁面：

```
工具（優先）：mcp stealth_fetch → stealth_fetch (extract: "text", timeout: 15)
工具（備援）：mcp firecrawl → firecrawl_scrape
url: "{事件來源 URL}"
formats: ["markdown"]
onlyMainContent: true
```

需要提取（**缺項就標「未公開」**）：
- **事件名稱**：如有 CVE 編號則附上
- **影響範圍**：哪些系統/框架/版本受影響
- **攻擊方法**：攻擊者怎麼做的（不寫可直接利用的 payload）
- **防禦方法**：如何偵測、修補、預防
- **時間線**：發現日、公告日、修補日

同時搜尋防禦方案：
```
工具：mcp Exa → web_search_exa
query: "{事件名稱} defense mitigation remediation"
numResults: 5
```

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-security-{slug}.md`

slug 規則：事件名稱的 kebab-case（如 `mcp-server-supply-chain`、`claude-prompt-injection`）

### Frontmatter

```yaml
---
title: "資安警報｜{事件名稱簡述}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, security, daily, {attack-type}]
lang: zh-TW
description: "一句話概述事件和影響"
tldr: "事件 + 影響範圍 + 防禦做法的 2-3 句話摘要"
series:
  name: "AI Security Alert"
  order: N
---
```

attack-type tags：`prompt-injection`、`supply-chain`、`jailbreak`、`data-exfiltration`、`privilege-escalation`

### 內容結構（嚴格按以下順序）

```markdown
## 事件概述

{3-5 句，回答：發生了什麼？誰受影響？嚴重程度如何？}

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | {prompt injection / supply chain / jailbreak / ...} |
| 影響範圍 | {哪些系統/框架/版本} |
| 嚴重程度 | {Critical / High / Medium / Low} |
| CVE | {CVE 編號，或「無」} |
| 來源 | [{來源1}]({url1}), [{來源2}]({url2}) |

## 攻擊面分析

{2-3 段，回答：
 1. 攻擊者怎麼做的？（描述攻擊路徑，不寫可直接利用的 payload）
 2. 為什麼能成功？（根本原因，如缺少 input validation）
 3. 對照 OWASP LLM Top 10 的哪一項？}

## 防禦做法

{2-3 段，回答：
 1. 現在可以做什麼？（立即止血的動作）
 2. 長期怎麼防？（架構層面的改善）
 3. 有哪些工具可以幫？（watchlist B7 的安全工具）}

**立即動作**
- {動作 1：如「更新 MCP SDK 到 v1.2.3+」}
- {動作 2：如「在 Agent pipeline 加入 input sanitization」}

**長期架構**
- {如「採用 Lakera Guard 做 runtime prompt injection 偵測」}
- {如「用 E2B/Celesto sandbox 隔離 Agent 程式碼執行」}

## 影響範圍

{1-2 段，回答：
 1. 有多少使用者/系統可能受影響？
 2. 是否已有修補？修補的 timeline？
 3. 對你的 Agent 系統意味著什麼？}

## 今日收穫

{1-3 句認知差。}
```

---

## 完整範例

```markdown
---
title: "資安警報｜惡意 MCP Server 供應鏈攻擊——假冒 Notion 整合竊取 API 金鑰"
date: 2026-08-12
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "一個假冒 Notion 整合的 MCP server 被發現會竊取環境變數中的 API 金鑰，影響 Claude Code 和 Cursor 使用者"
tldr: "npm 上出現名為 mcp-notion-sync（注意不是官方的 mcp-notion-server）的惡意 MCP server，安裝後會讀取 .env 中所有 API 金鑰並回傳攻擊者。已有 1,200 次下載。防禦：立即移除、輪換金鑰、用 npx 前先驗 package author。"
series:
  name: "AI Security Alert"
  order: 5
---

## 事件概述

一個名為 `mcp-notion-sync` 的惡意 npm 套件被發現假冒 Notion MCP server，安裝後會在 `postinstall` 階段讀取工作目錄中所有 `.env` 檔案的 API 金鑰（包括 ANTHROPIC_API_KEY、OPENAI_API_KEY、AWS 憑證等），透過 HTTPS POST 傳送到攻擊者控制的 endpoint。該套件在被下架前已有 1,200 次下載。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（MCP server 仿冒） |
| 影響範圍 | 安裝 `mcp-notion-sync` 的 Claude Code / Cursor 使用者 |
| 嚴重程度 | High |
| CVE | 無（npm 直接下架） |
| 來源 | [Socket.dev](https://socket.dev/example)、[The Hacker News](https://thehackernews.com/example) |

## 攻擊面分析

攻擊者利用 MCP server 生態的信任模型漏洞：使用者習慣用 `npx` 直接安裝 MCP server 而不檢查 package 來源。套件名稱 `mcp-notion-sync` 與合法的 `mcp-notion-server` 只差兩個字（[slopsquatting](https://arxiv.org/abs/2406.10279) 的 MCP 版本）。

`postinstall` script 用 Node.js 的 `fs.readFileSync` 遞迴讀取所有 `.env`、`.env.local`、`.env.production` 檔案，提取所有 key-value pair 後用 `https.request` 發送到 `https://api-collect.example.com/keys`。整個過程不到 50ms，使用者完全無感。

對應 OWASP LLM Top 10：**LLM05 Supply Chain Vulnerabilities** + **LLM06 Excessive Agency**（MCP server 有權存取 filesystem，超出 Notion 整合需要的權限）。

## 防禦做法

**立即動作**
- 檢查是否安裝了 `mcp-notion-sync`：`npm ls mcp-notion-sync 2>/dev/null || echo "safe"`
- 若已安裝：立即移除，並**輪換所有 .env 中的 API 金鑰**（假設已洩漏）
- 檢查 Claude Code 的 MCP server 設定：`cat ~/.claude/settings.json | grep -i notion`

**長期架構**
- 安裝 MCP server 前驗證 package author 和 npm audit 報告
- 使用 [Socket.dev](https://socket.dev) 的 GitHub Action 掃描 CI/CD 中的供應鏈風險
- 考慮用 Netzilo 的 MCP server runtime governance——可設定 allowlist，未批准的 MCP server 無法安裝
- 對 MCP server 做最小權限限制：Notion 整合不該有 filesystem 存取權

## 影響範圍

1,200 次下載中，根據 Socket.dev 的分析，約 80% 是 CI/CD 環境中的自動安裝，20% 是開發者本機。受影響的使用者應假設所有在 `.env` 中的金鑰已洩漏。npm 已在通報後 4 小時內下架套件，但未主動通知已安裝的使用者。

如果你的 Agent 系統會動態安裝 MCP server（如根據使用者需求自動 `npx`），這類攻擊面是開放的。建議維護一個 MCP server allowlist，只允許預先審核過的套件。

## 今日收穫

之前以為 MCP server 的安全問題主要是 prompt injection（惡意工具回傳攻擊性 prompt），但這次事件讓我意識到供應鏈攻擊是更直接的威脅——攻擊者不需要繞過 LLM 的護欄，只要讓你裝一個假套件就能拿到所有金鑰。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] 事件有至少 2 個獨立來源（或標注 ⚠️ 單一來源）
- [ ] 攻擊面分析**不包含**可直接利用的 payload
- [ ] 攻擊面對應到 OWASP LLM Top 10 的哪一項
- [ ] 防禦做法有「立即動作」和「長期架構」兩層
- [ ] 提到了 watchlist B7 中相關的安全工具
- [ ] 基本資訊表完整（類型、範圍、嚴重度、CVE、來源）
- [ ] 「今日收穫」是認知差，不是摘要
- [ ] description 和 tldr 已填寫
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
