# CCR 復刻設計 — 在 quidproquo 內建雲端 agent runtime

日期：2026-08-26（Queue-first 修訂版）
狀態：草案，待使用者拍板後實作
證據來源：~/Projects/coding-agent-reference/（pi-mono / oh-my-pi / opencode / codex / claude-code-source）

## 目標定義

在站內復刻 Claude Code Remote 的核心能力：

| CCR 能力 | 對應本專案現況 | 缺口 |
|---|---|---|
| 排程觸發 session | agent-os scheduler + wrangler crons | `scheduledAgentEntries` 空 |
| Agent loop（LLM 自主迭代工具呼叫） | kernel 有 syscalls 但 `run()` 是寫死流程 | **核心缺口：agentic loop** |
| Session 持久化 / 續跑 | D1 `agent_runs` 只有狀態機 | 缺 event log / message 持久化 |
| Skills 載入與觸發 | `agent-skills` D1 表 + admin UI glob | 缺 runtime 注入（catalog + skill_read） |
| 工具（搜尋/抓頁/MCP） | agent-providers：tavily/exa/jina/firecrawl 已註冊 | 預設停用，需開通 |
| 審批 | approval queue 已存在 | 缺 control-request/response 協議語義 |
| 事件串流觀察 | langfuse + observability dirs | 夠用，不必做 WS |

## 五個參考專案的關鍵結論

### 1. Agent loop

- pi-mono `packages/agent/src/agent-loop.ts#runLoop`：內層迴圈跑 tool_calls 直到 stopReason 非 tool_use；外層處理 steering。**無 max-iteration 計數**，終止靠 stopReason + tool `terminate: true` + hooks。
- claude-code `src/query.ts#queryLoop`：`while(true)` async generator + mutable State（turnCount、maxOutputTokensRecoveryCount、autoCompactTracking）；truncation 時 fail 該訊息所有 tool calls。
- **可移植形狀**：loop = 純函數 `(messages[], state) -> nextState` + 事件沿路發射。pi 的 `agentLoopContinue` 就是「crash 後續跑」的入口形狀。

### 2. Session 持久化

- opencode `packages/core/src/session/sql.ts`：SQLite 表 `session` / `message`(JSON blob) / `part` / `session_message`（event log，`(session_id, seq)` unique）→ **幾乎 drop-in 進 D1**。
- pi-mono `ToolStartedRecord`：預先寫入 `resultEntryId` slot + `replay: "safe" | "never"` flag → durable execution 的正解：crash 後 idempotent 工具重跑、非 idempotent 合成 error tool_result 讓 LLM 重規劃。
- codex `history/src/lib.rs#InitialHistory`：New | Resumed | Forked——resume/fork 語義參考。

### 3. 雲端任務

- codex `cloud-tasks-client/src/api.rs#CloudBackend`：task = prompt + git_ref + environment，**產出是 diff，「apply」是明確獨立步驟**（preflight 衝突檢查）。
- CCR：WS 做事件 fan-out、HTTP POST 做指令（`remote/RemoteSessionManager.ts#sendMessage`）→ 真正 CCR 需要 Durable Object + WS，但 daily 這種 batch 不需要。

### 4. Skills 觸發

- claude-code `src/skills/loadSkillsDir.ts`：只解析 frontmatter，注入方式 = system-reminder 的 **skill listing** + 一個 Skill tool。
- codex `skills/src/parser.rs`：嚴格 frontmatter 解析 + catalog prompt + `skill.read` tool 取 body。

### 5. Compaction

- claude-code `services/compact/autoCompact.ts`：window − 13k buffer 觸發；microcompact 先砍舊 tool result 內容留 stub（cache-friendly、移植最便宜）。

### 6. 非同步審批

- CCR：permission request 是協議訊息，run **block-and-wait**。
- codex cloud-tasks：**完全不做熱路徑審批**——沙箱 + diff + 明確 apply。建議採此路線為主。

## 架構決策：Queue-first，loop 核心與執行層解耦

**不綁 Workflow。** `runLoop` 是純函數，外面包 adapter：

```
runLoop(messages, tools, model)   纯函数（抄 pi 形狀）
  ├─ Queue adapter   —— M1-M3 用，零新增 binding
  └─ DO adapter      —— 未來要 WS streaming 再加（agents-sdk）
  └─ Workflow adapter—— 長 deterministic pipeline 才用，不用於 daily
```

### 執行層對比（ wrangler.jsonc:62-78 已有 AGENT_QUEUE ）

| Substrate | 像 CCR 嗎 | 代價 | 何時用 |
|---|---|---|---|
| Queue 鏈 | 中（有持久化、無 streaming） | 零新增 infra | daily batch |
| Durable Object | 最像（stateful + WS hibernation） | 需加 `durable_objects` binding | 站內 CCR console |
| Workflow | 不像（batch、無 WS） | step 冷啟動開銷 | 長 deterministically pipeline |

## 建議架構（Queue-first）

```
wrangler cron
  └─ scheduled() → scheduler.dispatchRun(trigger='cron')         // src/lib/agent-os/scheduler.ts:33
        └─ queueConsumer: src/server/queue.ts:23                 // AGENT_QUEUE, max_retries 3 → DLQ
              └─ runLoop(messages, state)                        // 纯函数，每 turn：
                   1. load agent definition（syscalls/domains/toolCallLimit）
                   2. build context：system prompt + skill listing（frontmatter only）
                   3. model.invoke（provider registry）
                   4. 若有 tool_calls → syscall（kernel 權限檢查）→ 寫 D1 event log → 回到 3
                   5. 微 compact 檢查（tool result stub 化）
                   6. stopReason ≠ tool_use → done，產出 artifact
                   7. 若未 done 且仍需 turn → enqueue(nextTurn) 續跑（pi agentLoopContinue 模式）
                   
失敗續跑：ToolStartedRecord.replay 標記 + 預寫 resultEntryId slot；
         下一次 queue 消費時，重跑 safe 工具、合成非 safe 工具的 error tool_result。
```

### 資料模型（D1，仿 opencode）

```sql
agent_sessions   (id, agent_id, trigger, status, git_ref?, created_at)
agent_messages   (session_id, seq, role, content_json)
agent_events     (session_id, seq, type, payload_json)   -- event log
agent_tool_calls (session_id, seq, tool, input_json, result_entry_seq, replay)
```

### 實作切片

1. **M1：loop 核心（Queue）**——pi 式 runLoop 純函數 + Queue adapter，工具只有 `model.invoke` / `search.external` / `read.url`；D1 event log。驗收：手動 enqueue 一個「寫一段摘要」agent 能多回合完成並可在 admin console 看完整 transcript。
2. **M2：skills 注入**——frontmatter catalog + `skill.read` syscall；把 `.agents/skills/daily-digest-*` seed 進 `user_skills`。驗收：agent 能依 description 自行觸發 daily-digest-report skill 完成日報彙整（Stage 3，純讀檔不需搜尋）。
3. **M3：排程**——`scheduledAgentEntries` 加 daily-digest entry + wrangler cron；draft-only artifact 產出，人工發佈。
4. **M4（選配）：Durable Object adapter + WS streaming**——站內 CCR console。
5. **M5（選配）：compaction + fork/resume**。

### 刻意不復刻的

- Workflow 綁定（daily 不需要 exactly-once step 語義）
- best-of-N、worktree/sandbox 隔離（Workers 用 syscall allowlist + outbound domains 替代）
- TUI

## 治理註記

- 本設計動 cron 觸發與新基礎設施 → Tier 2，已先提案。
- 產出路径走 draft artifact + 人工 publish（codex apply-task 模式），避開 Q-011/Q-012 的 push 問題。
- 不更動現行 CCR 外部 routines；in-house runtime 先以 Stage 3 彙整為試點，成功後再評估擴大。
