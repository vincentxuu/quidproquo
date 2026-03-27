---
title: "Claude Certified Architect Foundations 考試完整指南"
date: 2026-03-20
category: ai
tags: [claude, certification, agentic-ai, mcp, prompt-engineering, claude-code, agent-sdk]
lang: zh-TW
tldr: "Claude 官方架構師認證的完整備考指南：五大領域重點、六大考試情境、常見反模式與實際演練建議。"
description: "Claude Certified Architect — Foundations 考試的完整導讀，涵蓋五大考試領域的所有 Task Statement、六大情境題模式、實際考題解析，以及可執行的備考策略。"
draft: false
---

Claude Certified Architect — Foundations 測試的是你對 agentic 系統的實際設計能力。考題全部是情境式選擇題，每題一個正確答案，要求你在具體的生產場景中做出正確的架構決策。這篇整理考試的所有重點領域、常見陷阱，以及最有效的準備方式。

## 考試結構

**五大領域與權重：**

| 領域 | 比重 |
|------|------|
| Domain 1: Agentic Architecture & Orchestration | 27% |
| Domain 2: Tool Design & MCP Integration | 18% |
| Domain 3: Claude Code Configuration & Workflows | 20% |
| Domain 4: Prompt Engineering & Structured Output | 20% |
| Domain 5: Context Management & Reliability | 15% |

分數範圍 100–1000，及格線 720。全部選擇題，答錯不扣分。

**六大情境題（考試隨機抽四個）：**

1. **Customer Support Resolution Agent** — 用 Claude Agent SDK 處理退款、帳戶問題、客服升級
2. **Code Generation with Claude Code** — 團隊開發流程中整合 Claude Code
3. **Multi-Agent Research System** — 多個 subagent 協作做研究報告
4. **Developer Productivity with Claude** — 幫工程師探索陌生 codebase
5. **Claude Code for CI/CD** — 自動化 code review 與 PR 回饋
6. **Structured Data Extraction** — 從非結構化文件提取 JSON 資料

---

## Domain 1 — Agentic Architecture & Orchestration（27%）

這個領域考的是多代理系統的設計，重點不只是「呼叫 subagent」，而是「怎麼設計可靠的協調流程」。

### Agentic Loop 的正確終止條件

最常考的反模式：不要用解析自然語言文字來判斷 loop 是否結束，應該靠 `stop_reason`。

```python
while True:
    response = client.messages.create(...)

    if response.stop_reason == "end_turn":
        break  # ✅ 正確：靠 stop_reason 終止
    elif response.stop_reason == "tool_use":
        # 執行工具，把結果加回 conversation history
        tool_results = execute_tools(response.content)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
```

**反模式：**
- 解析 assistant 回應文字判斷「是否完成」
- 用固定迭代次數作為主要終止條件
- 不把 tool result 加回 conversation history

### Multi-Agent 的 Hub-and-Spoke 架構

coordinator 負責所有 subagent 的通訊、錯誤處理、資訊路由。**subagent 不會自動繼承 coordinator 的對話歷史**，必須在 prompt 裡明確傳入所需的上下文。

要在 coordinator 的 `allowedTools` 加上 `"Task"`，才能呼叫 subagent：

```python
coordinator = Agent(
    allowed_tools=["Task", "search_web"],  # 必須包含 Task
    system_prompt="Analyze the query and delegate to appropriate subagents..."
)
```

平行執行 subagent：在單一 coordinator response 中發出多個 Task tool call，而不是分多個 turn。

### 工作流程強制執行 vs. Prompt 指示

這是這個 domain 最重要的概念：**當某個工具呼叫順序是業務邏輯必要條件時，用程式碼強制執行，不要只靠 prompt**。

例如：必須先驗證客戶身份才能處理退款。如果只在 prompt 說「請先呼叫 get_customer」，有一定機率 Claude 會跳過這步。應該用程式碼在 `lookup_order` 和 `process_refund` 的 hook 裡檢查 `get_customer` 是否已執行。

### Session 管理

- `--resume <session-name>`：繼續命名 session
- `fork_session`：從同一個分析基礎分出兩條探索路徑，互不影響
- session resumption 適合「大部分 context 還有效」；如果 tool result 已過時，改用新 session + 注入摘要

---

## Domain 2 — Tool Design & MCP Integration（18%）

### 工具描述決定工具選擇可靠性

LLM 選擇工具的主要依據是 `description`。描述太簡略（如 "Retrieves customer information"）會導致工具被錯誤呼叫。

好的工具描述包含：
- 這個工具做什麼（具體，不模糊）
- 期望的輸入格式與範例
- 邊界條件（什麼時候用這個 vs. 用另一個）
- 輸出格式說明

```python
{
  "name": "lookup_order",
  "description": (
    "Look up order details using an order ID (format: ORD-XXXXXX) or order number. "
    "Use this when the customer provides an order reference. "
    "Do NOT use this for customer account lookup — use get_customer for that. "
    "Returns order status, items, shipping info, and timestamps."
  )
}
```

### 結構化錯誤回應

工具的錯誤回應要提供足夠資訊讓 agent 做出正確的恢復決策：

```python
# ❌ 差的錯誤回應
{"error": "Operation failed"}

# ✅ 好的錯誤回應
{
  "isError": True,
  "errorCategory": "transient",  # transient / validation / permission / business
  "isRetryable": True,
  "description": "Payment service timeout after 3 attempts",
  "attemptedAction": "process_refund for order ORD-12345"
}
```

`transient` 錯誤可以 retry；`business` 錯誤（如退款超過政策上限）不應 retry，而應該升級到人工。

### 工具數量影響選擇品質

給一個 agent 18 個工具，比給 4-5 個相關工具的選擇可靠性低很多。原則：每個 subagent 只拿它角色需要的工具。synthesis agent 不需要 web search 工具。

### MCP Server 配置

| 層級 | 位置 | 用途 |
|------|------|------|
| 專案層級 | `.mcp.json` | 團隊共用的工具（進版控） |
| 使用者層級 | `~/.claude.json` | 個人實驗性工具 |

credential 用環境變數注入，不要寫死：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**MCP Resources vs. MCP Tools**：Resources 適合暴露內容目錄（issue 清單、文件索引、schema）；Tools 適合執行動作。善用 Resources 可以減少不必要的探索性工具呼叫。

---

## Domain 3 — Claude Code Configuration & Workflows（20%）

### CLAUDE.md 層級結構

```
~/.claude/CLAUDE.md            # 使用者層級（不進版控，不共享給團隊）
CLAUDE.md / .claude/CLAUDE.md  # 專案層級（版控，全團隊共用）
src/api/CLAUDE.md              # 目錄層級（只有在該目錄工作時載入）
```

常見錯誤：把應該給整個團隊的規範放在 `~/.claude/CLAUDE.md`，導致新成員沒有收到。

用 `@import` 保持 CLAUDE.md 模組化：

```markdown
@import ./docs/api-conventions.md
@import ./docs/testing-standards.md
```

或用 `.claude/rules/` 目錄加 YAML frontmatter 做路徑條件式載入：

```yaml
---
paths: ["src/api/**/*"]
---
# API 層規範
所有 handler 必須用 async/await，錯誤統一用 AppError class...
```

用 glob pattern 的優點：跨目錄套用規範（例如所有 `**/*.test.tsx` 都套用同一份測試規範，不管在哪個子目錄）。

### Slash Command 與 Skills

**Commands**（`.claude/commands/`）：純 prompt 模板，適合固定的任務流程。

**Skills**（`.claude/skills/`）：有 frontmatter 配置，功能更強：

```markdown
---
context: fork          # 在隔離的子 agent 跑，不污染主 session
allowed-tools: Read,Grep,Glob  # 限制可用工具
argument-hint: "PR number to review"
---

Review PR #$ARGUMENTS...
```

`context: fork` 是很重要的選項：分析 codebase 這類會產生大量 verbose output 的任務，用 fork 跑完後只把摘要回傳給主 session。

### Plan Mode vs. Direct Execution

| 用 Plan Mode | 用 Direct Execution |
|-------------|-------------------|
| 大規模架構變更（跨 45+ 個檔案） | 單一檔案 bug fix |
| 有多種可行方案需要評估 | 已知解法、清楚範圍 |
| Library migration | 加一個 input validation |
| 微服務重構 | 依照 stack trace 修一個錯誤 |

### CI/CD 整合

用 `-p` flag 跑非互動模式，加 `--output-format json` 輸出機器可讀的結果：

```yaml
- name: Code Review
  run: |
    claude -p "Review the changed files for bugs and security issues.
    Previous review findings: $(cat .claude/prior-review.json)
    Only report new or unaddressed issues." \
    --output-format json \
    --json-schema review-schema.json > review-results.json
```

注意：**讓同一個 Claude session 審查它自己寫的程式碼效果較差**——它會保留生成時的推理 context，比較不會質疑自己的決定。用獨立的 review instance。

---

## Domain 4 — Prompt Engineering & Structured Output（20%）

### 明確標準比模糊指示有效

「只回報高信心的問題」或「保守一點」不會降低 false positive 率。需要明確定義：

```
Review criteria:
- REPORT: Logic errors, null pointer dereferences, SQL injection, missing auth checks
- SKIP: Minor style issues, local variable naming, comment formatting
- REPORT as HIGH: Any issue that could lead to data loss or security breach
- REPORT as MEDIUM: Logic errors that affect correctness but not security
```

### Few-Shot Examples 的用途

Few-shot 最有效的場景：
- 工具選擇在模稜兩可的情境下容易出錯 → 加範例示範正確選擇
- 想要特定輸出格式 → 給 2-3 個完整範例比描述格式更有效
- 文件結構差異大（有些用內文引用、有些用參考書目）→ 每種結構給一個範例

### 結構化輸出用 tool_use

最可靠的結構化輸出方式：用 `tool_use` + JSON schema，而非要求 Claude 輸出 JSON 字串。

```python
tools = [{
    "name": "extract_invoice",
    "description": "Extract structured data from invoice",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_number": {"type": "string"},
            "total_amount": {"type": "number"},
            "line_items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "amount": {"type": ["number", "null"]}  # nullable
                    }
                }
            },
            "payment_status": {
                "type": "string",
                "enum": ["paid", "pending", "overdue", "other"],
            },
            "payment_status_detail": {  # 搭配 "other" 用
                "type": ["string", "null"]
            }
        },
        "required": ["invoice_number", "total_amount"]
    }
}]

response = client.messages.create(
    tools=tools,
    tool_choice={"type": "any"}  # 保證 Claude 一定會呼叫工具
)
```

**`tool_choice` 的三個選項：**
- `"auto"`：Claude 自己決定要不要用工具（可能回傳純文字）
- `"any"`：一定要呼叫某個工具，但自己選哪個
- `{"type": "tool", "name": "extract_metadata"}`：強制呼叫特定工具

**重要：** `tool_use` 消除 JSON 語法錯誤，但不消除語意錯誤（例如 line items 加總不等於 total）。語意驗證要另外實作。

### Validation-Retry Loop

```python
for attempt in range(3):
    result = extract_with_claude(document)
    errors = validate(result)

    if not errors:
        break

    # 把具體錯誤告訴 Claude，讓它修正
    document = f"""
    Original document: {document}
    Previous extraction: {result}
    Validation errors: {errors}
    Please fix these specific issues.
    """
```

注意：如果資訊根本不在文件裡，retry 不會有幫助。先判斷是「格式錯誤」還是「資料不存在」。

### Message Batches API

50% 成本節省，但最多 24 小時處理時間，沒有延遲 SLA。

| 適合 | 不適合 |
|------|--------|
| 隔夜批次報告 | Pre-merge check（開發者在等結果） |
| 每週技術債分析 | 任何需要 blocking 的流程 |
| 大量文件批次處理 | 需要 multi-turn tool calling |

---

## Domain 5 — Context Management & Reliability（15%）

### 避免 Lost-in-the-Middle

模型對輸入的開頭和結尾注意力最高，中間的容易被忽略。整合多個 subagent 結果時：

- 把關鍵摘要放在最前面
- 用明確的 section header 分隔各來源的詳細內容
- 不要把 15 個 subagent 的完整 output 直接串接

### 保留關鍵事實，不要摘要它們

客服情境中，日期、金額、訂單號碼、狀態這類「事實性資料」不應該被 summarize 掉：

```python
# 在每個 prompt 裡附上 structured facts block
case_facts = {
    "customer_id": "C-78901",
    "order_id": "ORD-45623",
    "refund_amount": 89.99,
    "order_date": "2026-02-14",
    "stated_issue": "item never arrived"
}

prompt = f"""
Case Facts (do not summarize these):
{json.dumps(case_facts, indent=2)}

Conversation summary:
{compressed_history}

Customer: {latest_message}
"""
```

### Provenance（來源可溯）

multi-source synthesis 最重要的設計原則：**每個 claim 都要附帶它的來源**。

subagent 的輸出格式應該是：

```json
{
  "findings": [
    {
      "claim": "市場規模預計在 2026 年達到 $2.3B",
      "source_url": "https://example-report.com/2025",
      "source_name": "Industry Report 2025",
      "publication_date": "2025-11-01",
      "excerpt": "The market is projected to reach $2.3B by 2026..."
    }
  ]
}
```

兩個來源的數字衝突時，**不要選一個，兩個都保留並標注來源**，讓報告讀者自己判斷。

### Escalation 的正確觸發條件

| 應該升級 | 不應該升級 |
|---------|-----------|
| 客戶明確要求真人 | 案件複雜（但有解法） |
| 政策沒有涵蓋的情境 | 客戶語氣不好 |
| 無法取得進展 | Claude 自評「信心不高」 |

客戶要求真人 → 直接升級，不要先試圖自己解決。政策例外（如跨品牌比價，但政策只寫了自家網站）→ 升級。

### 大 Codebase 探索的 Context 管理

長 session 的 context 會「退化」：Claude 開始給出「根據一般 patterns」這類模糊回應，而不是根據你的 codebase。

解法：
- 用 `/compact` 壓縮 context（Claude Code 指令）
- 把關鍵發現存到 scratchpad 檔案，下次查詢前先載入
- 用 subagent 做探索，只把摘要回傳主 session

crash recovery 用 manifest 模式：每個 agent 把自己的狀態 export 到固定路徑，coordinator 重啟時載入 manifest 繼續。

---

## 常見考題陷阱

這幾個概念在 sample questions 裡反覆出現：

**「先改 prompt」不一定是正確答案。** 當業務邏輯需要 100% 確保某個順序時，答案是「用程式碼強制執行」，不是「加更多指示到 prompt」。

**工具描述是工具選擇的根本。** 工具選錯的 root cause 通常是描述不夠清楚，而不是需要一個 routing classifier。

**Message Batches API 不適合 blocking workflow。** 這個選項幾乎永遠是錯的，只要情境裡有人在等待結果。

**Self-review 不如獨立 review instance。** 讓同個 session 審查自己的輸出效果差，因為它記得自己的推理過程。

**不是所有複雜情況都應該升級。** 升級的觸發是客戶明確要求、政策無法涵蓋、或無法取得進展，不是「感覺很複雜」。

---

## 備考策略

**最有效的準備是動手做，不是讀文件。** 官方考試指南列了四個練習題，每個都直接對應一個真實的 domain：

1. **Build a Multi-Tool Agent with Escalation Logic**：做完你就懂 agentic loop、hook、結構化錯誤處理
2. **Configure Claude Code for a Team Development Workflow**：CLAUDE.md hierarchy、path-scoped rules、skills
3. **Build a Structured Data Extraction Pipeline**：tool_use + JSON schema、validation retry、batch processing
4. **Design and Debug a Multi-Agent Research Pipeline**：coordinator 設計、parallel subagent、provenance tracking

**快速確認清單：**

- [ ] 能用 `stop_reason` 正確實作 agentic loop，知道哪些是反模式
- [ ] 知道 subagent 需要明確傳入 context，不會自動繼承
- [ ] 能寫出清楚區分相似工具的 tool description
- [ ] 能設計帶有 `errorCategory` 和 `isRetryable` 的結構化錯誤回應
- [ ] 能設定 `.mcp.json` 用環境變數管理 credential
- [ ] 能說明 CLAUDE.md 三層層級的差異與用途
- [ ] 知道 `context: fork` 是什麼、什麼時候用
- [ ] 能分辨 plan mode vs direct execution 的適用情境
- [ ] 知道 `tool_choice: "auto"` / `"any"` / forced 的差異
- [ ] 能說明 Message Batches API 的限制與適用場景
- [ ] 知道 escalation 的正確觸發條件（不是「感覺複雜」）
- [ ] 能設計保留 provenance 的 multi-source synthesis 結構

---

## 參考資料

- [Claude Certified Architect — Foundations 考試入口](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
- [Claude 官方文件](https://docs.anthropic.com/)
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Model Context Protocol（MCP）官方文件](https://modelcontextprotocol.io/)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic Cookbook（實作範例集）](https://github.com/anthropics/anthropic-cookbook)
