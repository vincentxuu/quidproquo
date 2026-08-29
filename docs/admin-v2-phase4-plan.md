# Admin v2 — Phase 4 實作計畫

狀態：已完成（2026-08-29）。本檔保留 Phase 4 實作計畫；待 production/preview 觀察核准與 mode 流程。
Spec 參考：`docs/admin-v2-spec.md` §3.2、§3.3、§5.1。

## 1. 目標

讓 agent 在工具呼叫前詢問核准，使用者在手機（390px）上一鍵批准或拒絕；三種 Mode 控制何時問、何時自動跑。

## 2. 現有基礎 vs 缺口

### 已有（可直接用）

| 元件 | 位置 | 功能 |
|---|---|---|
| `approval-queue.ts` | `lib/agent/` | 記憶體內 Promise map：waitForApproval → resolve/reject/expire |
| `D1ApprovalStoreBackend` | `lib/agent/storage/d1/approval-store.ts` | D1 持久化：agent_approval_requests 表（approval_id, run_id, reason, context_json, status, resolved_by, resolved_at） |
| `ApprovalCard.tsx` | `components/admin/console/` | React 元件：顯示 reason + context + TTL 倒數 + 核准/拒絕按鈕 |
| `BulkApprovalModal.tsx` | `components/admin/console/` | 批次處理多筆 pending approval |
| `wrapSyscallWithGate()` | `lib/policy/enforcement/human/syscall-gate.ts` | 把 syscall 包上權限閘門，按 mode 分派到 per-step / batch / edit-on-approval |
| `scoreRisk()` | `lib/policy/enforcement/human/risk.ts` | 工具風險分數：irreversible=0.9, outbound=0.5, memory-write=0.3, others=0 |
| `HumanPolicy` schema | `lib/policy/schema/body.ts` | `mode: 'per_step' | 'batch' | 'edit_on_approval'`；ttl, risk_threshold, batch_window |
| `D1PermissionsBackend` | `lib/agent/storage/d1/permissions.ts` | 工具級權限：allowed syscalls, memory scopes, outbound domains |
| Sessions page | `pages/admin/sessions/[id].astro` | 已渲染 pending approvals 卡片（靜態，非即時） |

### 缺口（Phase 4 要做的）

| # | 缺口 | 說明 |
|---|---|---|
| 1 | **三檔 Mode UI** | Composer 和 Session 頁沒有 Mode 選擇器（Auto / Accept edits / Plan）；目前 mode 只在 policy JSON 裡設 |
| 2 | **control_request/response 事件** | 事件流沒有 `control_request` 事件型別；approval 透過獨立 API 而非事件流內嵌 |
| 3 | **即時核准卡** | Session 頁的 approval 卡片是 SSR 靜態渲染，不是 SSE 即時推送；需要 Phase 2 的 SSE 管道 |
| 4 | **Plan mode** | 沒有 Plan 面板——agent 寫計畫到 sandbox、ExitPlanMode 觸發三選一核准（Reject / Accept / Accept+auto） |
| 5 | **Mode 切換** | Session 內切換 mode（例如從 Plan 切到 Auto）沒有 API |
| 6 | **Home 需要你** | Home 頁沒有「需要你」區塊：pending approval 含按鈕、failed sessions、needs_action sessions |
| 7 | **工具級 permission_policy** | Spec 說「現有 policy 降為工具級 `always_allow | always_ask | always_deny`」，但目前是複合 HumanPolicy 物件，需要對映 |
| 8 | **pending_permission_requests 重連** | `initialize` 回應要含 `pending_permission_requests[]`，重連時補畫未處理的核准卡 |

## 3. 三檔 Mode 設計

對齊 Claude Code 範本：

| Mode | 行為 | control_request 觸發時機 | 對映現有 HumanPolicy.mode |
|---|---|---|---|
| **Auto** | 全自動，不問 | 僅 `always_ask` 工具和超過 risk_threshold 的 irreversible action | — (不觸發 gate) |
| **Accept edits**（default） | 讀取自動、寫入要核准 | 所有 risk score > 0 的工具（irreversible + outbound + memory-write） | `per_step` |
| **Plan** | agent 只能寫計畫，不執行 | ExitPlanMode 觸發一次整體核准（Reject / Accept / Accept+auto mode） | — (新邏輯) |

### Mode 到 Policy 的轉譯

Session 建立時，前端傳 `mode: 'auto' | 'default' | 'plan'`。Workers 轉譯成 runner 的 allowed/disallowed 清單：

```
auto    → humanPolicy.mode = undefined (不啟用 gate)
         + permission_policy 'always_allow' 工具直接跑
         + permission_policy 'always_ask' 工具仍觸發 control_request

default → humanPolicy.mode = 'per_step'
         + risk_threshold = 0.01 (幾乎所有有副作用的工具都問)
         + permission_policy 'always_allow' 工具跳過 gate

plan    → 容器內 agent 收到 system prompt: "你只能規劃，不能執行工具"
         + 沙箱 Bash/Write 被 disallowed
         + agent 把計畫寫入事件流（assistant message）
         + 前端收到 ExitPlanMode tool_use → 渲染三選一卡片
```

## 4. 權限協定事件

### control_request（worker → client）

agent loop 裡 `wrapSyscallWithGate` 攔截到需核准的工具呼叫時：

1. 建立 `agent_approval_requests` 記錄（status: pending）
2. 發出 SSE 事件：

```json
{
  "type": "control_request",
  "subtype": "can_use_tool",
  "approval_id": "apr_xxxx",
  "display_name": "Write",
  "input": { "file_path": "/src/index.ts", "content": "..." },
  "decision_reason": "此工具會修改檔案",
  "risk_score": 0.9
}
```

3. agent loop 暫停等待（`waitForApproval(approvalId)`）

### control_response（client → worker）

使用者按核准/拒絕按鈕時，前端 POST：

```
POST /api/admin/sessions/:id/approve
{ "approval_id": "apr_xxxx", "behavior": "allow", "updatedInput": null }
```

或

```
POST /api/admin/sessions/:id/approve
{ "approval_id": "apr_xxxx", "behavior": "deny" }
```

Workers 更新 D1 + `resolveWaitingApproval` 或 `rejectWaitingApproval`。

### Plan mode 特殊流程

ExitPlanMode 不走 control_request/can_use_tool，而是一個特殊事件：

```json
{
  "type": "control_request",
  "subtype": "exit_plan_mode",
  "approval_id": "apr_xxxx",
  "plan_content": "## 計畫\n1. ...\n2. ...",
  "options": ["reject", "accept", "accept_auto"]
}
```

前端渲染三選一卡片。Accept → mode 切換到 default 並繼續。Accept+auto → mode 切換到 auto 並繼續。

## 5. Home「需要你」區塊

```
┌─────────────────────────────────────────┐
│ 需要你                           2 項待處理 │
│                                         │
│ ⚠ Session "refactor auth" 等待核准        │
│   Write → /src/auth/session.ts          │
│   [核准] [拒絕]                          │
│                                         │
│ ✗ Session "deploy script" 失敗           │
│   Error: sandbox timeout                │
│   [重試]                                │
│                                         │
│ 📋 Session "review PR" needs_action      │
│   "請確認測試結果是否正確"                 │
│   [前往]                                │
└─────────────────────────────────────────┘
```

資料來源：
- 待核准：`agent_approval_requests WHERE status = 'pending'`（含 approval 按鈕，直接操作不需跳頁）
- 失敗：`agent_sessions WHERE status = 'failed' AND archived = 0`（顯示錯誤 + 重試按鈕）
- needs_action：`agent_sessions.needs_action = 1`（由 `system/post_turn_summary` 更新，顯示 status_detail + 前往按鈕）
- 站況紅燈：現有 `/api/admin/site/status` 的紅燈項

空的時候收起成一行：「✓ 一切正常」綠字。

## 6. Schema 變更

### 修改 `agent_sessions` 表

```sql
ALTER TABLE agent_sessions ADD COLUMN mode TEXT DEFAULT 'auto';
-- 'auto' | 'default' | 'plan'
```

### 修改 `agent_approval_requests` 表

```sql
ALTER TABLE agent_approval_requests ADD COLUMN subtype TEXT DEFAULT 'can_use_tool';
-- 'can_use_tool' | 'exit_plan_mode'
ALTER TABLE agent_approval_requests ADD COLUMN display_name TEXT;
ALTER TABLE agent_approval_requests ADD COLUMN input_json TEXT;
ALTER TABLE agent_approval_requests ADD COLUMN risk_score REAL;
ALTER TABLE agent_approval_requests ADD COLUMN response_behavior TEXT;
-- 'allow' | 'deny' | 'accept' | 'accept_auto' | 'reject' (for plan mode)
ALTER TABLE agent_approval_requests ADD COLUMN updated_input_json TEXT;
```

### 新表 `agent_permission_policies`

```sql
CREATE TABLE IF NOT EXISTS agent_permission_policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  policy TEXT NOT NULL DEFAULT 'ask',
  -- 'always_allow' | 'always_ask' | 'always_deny'
  created_at INTEGER NOT NULL,
  UNIQUE(session_id, tool_name)
);
```

## 7. 新檔案

| # | 檔案 | 說明 |
|---|---|---|
| 1 | `src/lib/agent/mode.ts` | Mode 型別 + mode→policy 轉譯邏輯 |
| 2 | `src/lib/agent/control-protocol.ts` | control_request/response 事件建構 + 序列化 |
| 3 | `src/lib/agent/plan-mode.ts` | Plan mode：攔截工具呼叫、ExitPlanMode 處理 |
| 4 | `src/components/admin/sessions/ModeSelector.tsx` | Mode 三檔選擇器（composer 用 + session 頁內切換） |
| 5 | `src/components/admin/sessions/PlanApprovalCard.tsx` | Plan mode 三選一卡片（Reject / Accept / Accept+auto） |
| 6 | `src/components/admin/sessions/ControlRequestCard.tsx` | 工具核准卡（重構 ApprovalCard，增加 display_name + input preview + risk badge） |
| 7 | `src/components/admin/home/NeedsYouPanel.tsx` | Home「需要你」React island |
| 8 | `src/pages/api/admin/sessions/[id]/approve.ts` | 統一核准 API（取代原 approvals/[id]/[action]） |
| 9 | `src/pages/api/admin/sessions/[id]/mode.ts` | Session 內切換 mode（PATCH） |
| 10 | `src/pages/api/admin/home/needs-you.ts` | Home 需要你資料 API |

## 8. 修改檔案

| # | 檔案 | 變更 |
|---|---|---|
| 1 | `src/lib/agent/kernel.ts` | agent loop 注入 mode→gate 邏輯；Plan mode 下注入 system prompt 限制 |
| 2 | `src/lib/policy/enforcement/human/syscall-gate.ts` | 接入 control_request 事件流發送（Phase 2 SSE 管道） |
| 3 | `src/lib/agent/storage/d1/approval-store.ts` | 支持新欄位（subtype、display_name、input_json、risk_score、response_behavior、updated_input_json） |
| 4 | `src/pages/admin/index.astro` | Home 頁加入 NeedsYouPanel（第一區塊）+ Composer 加 ModeSelector |
| 5 | `src/pages/admin/sessions/[id].astro` | Session 頁：SSE 即時渲染 ControlRequestCard + PlanApprovalCard；加 mode 顯示 + 切換控制項 |
| 6 | `src/pages/admin/sessions/launch.astro` | Composer 加 ModeSelector |
| 7 | `src/components/admin/console/ApprovalCard.tsx` | 重構為 ControlRequestCard 的 wrapper 或 deprecated |

## 9. 實作順序

1. **Schema migration**：D1 ALTER + 新表（Tier 2，需確認）
2. **Mode 型別 + 轉譯**：`agent/mode.ts`，mode→policy 映射
3. **control_request/response 事件**：`agent/control-protocol.ts`，接入 SSE 事件流
4. **Kernel 注入**：修改 kernel.ts，根據 mode 注入 gate 或 Plan mode system prompt
5. **核准 API**：`sessions/[id]/approve.ts` + `sessions/[id]/mode.ts`
6. **前端元件**：ModeSelector → ControlRequestCard → PlanApprovalCard
7. **Session 頁整合**：SSE 即時渲染核准卡 + mode 切換
8. **Home 需要你**：NeedsYouPanel + API
9. **手機驗證**：390px 驗證所有按鈕 touch target ≥ 44px
10. **整合測試**：Auto → 不問 / Default → 問 / Plan → 寫計畫 → 三選一

## 10. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| Plan mode 的 system prompt 限制不可靠（LLM 可能無視） | 中 | 雙重保護：system prompt + disallowed 工具清單。agent 嘗試呼叫被禁工具 → error response 回事件流 |
| SSE 斷線時漏掉 control_request | 高 | `initialize` 回應含 `pending_permission_requests[]`；重連時補畫。D1 是正本，SSE 只是通知 |
| approval TTL 過期但 agent loop 仍在等 | 中 | `expireWaitingApproval` 已有；加 cron 或 alarm 掃過期 approval |
| mode 切換的時間窗口（agent 正在跑工具時切 mode） | 低 | mode 切換只影響下一個 tool_use，不中斷正在執行的 |

## 11. 開放問題

1. **Accept edits 的 risk_threshold**：Spec 沒定數值，建議 0.01（只有 scoreRisk=0 的純讀工具跳過）。要調嗎？
2. **Plan mode 的計畫格式**：Claude Code 寫到 `plans/*.md`。我們的容器是拋棄式的——計畫寫在 assistant message 裡而非檔案可能更實際。要對齊 Claude Code 還是走 message？
3. **工具級 always_allow/always_deny 的 UI**：Spec 說在 Settings › Extensions 的 MCP Servers 子頁設定。Phase 4 做 UI 還是先用 API？
4. **updatedInput（核准時修改 input）的 UI**：Claude Code 有 `updatedInput` 讓使用者改 tool input 再核准。要做 JSON editor 還是 Phase 4 先不做？

## 12. 不在 Phase 4 範圍

- Cloudflare Sandbox 的工具 disallowed 實作（Phase 5）
- GitHub event trigger 的核准流程（Phase 5）
- Discord/Slack 互動核准按鈕（Phase 5）
- MCP 工具的 permission_policy 管理 UI（Phase 6）
