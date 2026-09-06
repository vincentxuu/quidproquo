---
title: "Codex Turn 狀態機：TurnContext、StepActivation、Context Manager 與壓縮觸發"
date: 2026-08-31
category: tech
tags: [codex, rust, turn-context, step-activation, context-manager, compaction, token-budget, agent-loop]
lang: en
description: "深入解析 Codex 單一 turn 內部架構：TurnContext 如何凍結初始設定、StepActivation 如何驗證設定變更、Context Manager 以 Arc<Vec> 共享歷史、TokenBudget 怎麼解析模型預設值、四種壓縮策略何時觸發。"
tldr: "TurnContext 在 turn 初始化時捕獲所有設定（模型、審批、token budget），後續 step 透過 StepContext 讀取快照；StepActivation 驗證設定變更不違反 legacy 安全約束；ContextManager 用 Arc<Vec> + 版本號實現 Copy-on-Write 歷史共享；壓縮觸發條件為 token_remaining < threshold，支援 remote v1/v2、local、model fallback 四條路徑。"
---

> 🌏 中文版撰寫中

## TL;DR

- **TurnContext**：turn 級不可變快照，`initial_settings: Arc<ResolvedStepSettings>` 凍結模型/審批/token budget；`current_settings: ArcSwap` 供步級更新
- **StepActivation**：`check_legacy_turn_safety` 驗證 step 設定變更不改動「已承認」的審批政策、模型分類、prefix rules
- **ContextManager**：`items: Arc<Vec<ResponseItemEnvelope>>` + `history_version`，Copy-on-Write 共享歷史；`token_info` 追蹤剩餘 token
- **TokenBudget**：`resolve_token_budget` 先看用戶显式設定，再套用模型 `model_messages.token_budget` 預設值
- **四種壓縮**：`run_remote_compact_task` (v1)、`run_inline_remote_auto_compact_task` (v2)、本地摘要、`compact_model_fallback`，依 `CompactionReason`/`CompactionPhase` 分派

---

## 情境

使用者在 TUI 輸入一行 prompt，按下 Enter。這個「user turn」在 Codex 內部會發生什麼？

1. `ThreadManager` 建立 `TurnContext`，凍結這輪的所有設定
2. `Session` 進入第一個 step，建立 `StepContext` 捕獲 `TurnContext` 的設定快照
3. 模型推論 → 可能產生 tool calls
4. 執行 tool calls → 產生 `ToolResult` 寫入歷史
5. 下一個 step，或觸發壓縮、或回到等待 user input

這篇把鏡頭拉進**單一 turn 內部**，看設定怎麼流動、歷史怎麼管理、壓縮怎麼觸發。

---

## 問題

一個 turn 不是單一函式呼叫，而是**多 step 迭代**：

- Step 1：模型推論（可能含 reasoning）
- Step 2：執行 tool calls（並行或串行）
- Step 3：處理 tool results，決定是否繼續或結束

每個 step 都需要**一致的設定視圖**（模型、審批政策、token budget），但又可能因：
- 動態工具註冊（MCP server 啟動）
- 模型 fallback（primary 失敗切備援）
- 壓縮後模型上下文變更

而需要**受控更新**。同時，歷史隨著每個 step 增長，token 消耗單調遞增，必須在恰當時機壓縮。

---

## 嘗試過程

### 1. TurnContext：Turn 級不可變快照

```rust
// session/turn_context.rs:193-246
pub struct TurnContext {
    pub(crate) sub_id: String,
    pub(crate) trace_id: Option<String>,
    pub(crate) realtime_active: bool,
    pub(crate) code_mode_available: bool,
    pub config: Arc<Config>,                                    // 全域配置
    pub(crate) configured_token_budget: Option<TokenBudgetConfig>, // 用戶顯式設定
    pub(crate) use_model_token_budget_defaults: bool,           // 是否套用模型預設
    pub(crate) initial_settings: Arc<ResolvedStepSettings>,     // **凍結的初始設定**
    pub(super) current_settings: ArcSwap<ResolvedStepSettings>, // 步級可更新快照
    pub(crate) session_telemetry: SessionTelemetry,
    pub(crate) provider: SharedModelProvider,
    pub(crate) session_source: SessionSource,
    pub(crate) history_mode: ThreadHistoryMode,
    pub(crate) parent_thread_id: Option<ThreadId>,
    pub(crate) originator: String,
    pub(crate) environments: TurnEnvironmentSnapshot,
    pub(crate) cwd: AbsolutePathBuf,                            // deprecated
    pub(crate) available_models: Vec<ModelPreset>,
    pub(crate) final_output_json_schema: Option<Value>,
    pub(crate) dynamic_tools: Vec<DynamicToolSpec>,
    pub(crate) turn_metadata_state: Arc<TurnMetadataState>,
    pub(crate) extension_data: Arc<ExtensionData>,
    pub(crate) turn_timing_state: Arc<TurnTimingState>,
    pub(crate) cyber_access_program: Option<CyberAccessProgram>,
    // ... 更多欄位
}
```

**關鍵設計**：
- `initial_settings` **只在 turn 初始化時建立一次**，之後**不再變更**——所有「legacy consumers」（如 `tools::approvals`、`guardian::review`）讀取這個快照，保證整輪 turn 審批政策一致
- `current_settings: ArcSwap` 允許**步級更新**（如模型 fallback 後切換模型），新 step 捕獲新快照
- `configured_token_budget` + `use_model_token_budget_defaults` 兩階段解析：先記錄用戶是否顯式設定，再決定是否套用模型預設值

### 2. StepActivation：受控設定變更驗證

當 step 需要更新設定（如 `TurnSettingsUpdate` RPC），`Session::apply_step_settings_update` 呼叫 `step_activation.rs` 的驗證：

```rust
// session/step_activation.rs:25-84
fn check_legacy_turn_safety(
    turn_context: &TurnContext,
    current: &ResolvedStepSettings,
    destination: &ResolvedStepSettings,
    live_config: &Config,
) -> Result<(), String> {
    // 1. 審批政策不得變更
    if destination.constrained_approval_policy() != current.constrained_approval_policy()
        || destination.approval_policy() != turn_context.approval_policy() {
        return Err("the destination changes the admitted approval policy".to_string());
    }
    // 2. 審批審查者不得變更
    if destination.approvals_reviewer() != current.approvals_reviewer()
        || destination.approvals_reviewer() != turn_context.config.approvals_reviewer {
        return Err("the destination changes the admitted approvals reviewer".to_string());
    }
    // 3. 模型要求的審批權威不得變更
    if required_review != ... {
        return Err("the destination changes model-required approval authority".to_string());
    }
    // 4. Prefix rules 不得變更
    if ignores_prefix_rules(&destination.model_info) != ignores_prefix_rules(&current.model_info) {
        return Err("the destination changes the admitted prefix-rule policy".to_string());
    }
    // 5. 模型安全檢查（專業模型、推理等級等）
    check_legacy_model_safety(...)
}
```

**為什麼這麼嚴格**？因為 `tools::approvals` 和 `guardian::review` 仍讀取 `TurnContext` 的**初始快照**做決策。若 step 中途改變審批政策，會導致同一輪 turn 內「前半段用 ask、後半段用 auto」的不一致。

**遷移路徑**：註解寫道「Temporary restrictions while approvals and Guardian still read the admitted TurnContext. Remove these restrictions as their consumers migrate to captured step settings.」——未來所有 consumer 都改用 `StepContext::settings` 後，這些限制就能移除。

### 3. ContextManager：Copy-on-Write 歷史共享

```rust
// context_manager/history.rs:47-69
pub(crate) struct ContextManager {
    items: Arc<Vec<ResponseItemEnvelope>>,  // 共享向量，Copy-on-Write
    history_version: u64,                   // 歷史重寫時遞增（壓縮、回滾）
    user_message_revision: u64,             // 用戶輸入/重置修訂號，獨立於壓縮
    token_info: Option<TokenUsageInfo>,     // 剩餘 token 追蹤
    reference_context_item: Option<TurnContextItem>, // 設定差異基準
    world_state_baseline: Option<WorldStateSnapshot>, // 世界狀態基準
}
```

**操作語義**：
- **讀取**：`conversation_history_snapshot()` 回傳 `Arc<SharedConversationHistory>`，直接共享 `items`，零複製
- **寫入**：`append_item` / `replace_history` 時 `Arc::make_mut(&mut self.items)` 觸發複製，`history_version++`
- **壓縮**：`replace_history(HistoryReplacement::Compaction, new_items)` 替換整個向量
- **重置**：`replace_history(HistoryReplacement::Reset, ...)` 清空並重置 `user_message_revision++`

**Token 估算**：`estimate_item_token_count` / `estimate_image_bytes` 對每個 `ResponseItem` 估算模型可見 token，支援 `detail: "original"` 圖片的 patch 計算。

### 4. TokenBudget：兩階段解析

```rust
// session/token_budget.rs:9-69
pub(super) fn has_explicit_settings(config: &Config) -> bool {
    // 檢查 features.token_budget 或 config.token_budget 是否有用戶顯式值
}

pub(super) fn resolve_token_budget(
    configured_token_budget: Option<&TokenBudgetConfig>,
    use_model_defaults: bool,
    model_info: &ModelInfo,
) -> Option<TokenBudgetConfig> {
    if !use_model_defaults {
        return configured_token_budget.cloned(); // 用戶顯式關閉模型預設
    }
    let Some(model_defaults) = model_info.model_messages.as_ref()
        .and_then(|m| m.token_budget.as_ref()) else {
        return configured_token_budget.cloned(); // 模型無預設值
    };
    // 合併：用戶值優先，缺失處套用模型預設
    let token_budget = TokenBudgetConfig {
        max_tokens: configured_token_budget.and_then(|c| c.max_tokens).or(model_defaults.max_tokens),
        reserve_for_functions: configured_token_budget.and_then(|c| c.reserve_for_functions).or(model_defaults.reserve_for_functions),
        ...
    };
    token_budget.validate()?;
    Some(token_budget)
}
```

**流程**：
1. Turn 初始化時，`has_explicit_settings` 檢測用戶是否在 config 寫了 `token_budget` → 決定 `use_model_token_budget_defaults`
2. 第一個 step 建立時，`resolve_token_budget` 合併用戶值 + 模型預設值 → 寫入 `TurnContext.initial_settings.token_budget`
3. 壓縮時，`maybe_record` 讀取 `token_info.base_window_tokens_remaining` 決定是否觸發 auto-compact

### 5. 四種壓縮策略

| 策略 | 入口函式 | 觸發條件 | 特點 |
|------|----------|----------|------|
| **Remote v1** | `run_remote_compact_task` | `CompactionReason::Auto` + `phase: Initial` | 傳完整歷史給模型，模型回傳壓縮後 transcript |
| **Remote v2 (Auto)** | `run_inline_remote_auto_compact_task` | `CompactionReason::Auto` + `phase: Inline` | 內嵌於 step 循環，支援 fallback step context |
| **Remote v2 (Manual)** | 同上 | `CompactionReason::Manual` | 用戶手動 `/compact` 觸發 |
| **Local Fallback** | `compact_model_fallback::run_local_compact_task` | Remote 失敗或模型不支援 | 本地啟發式截斷（保留最近 N 輪、系統指令、工具結果摘要） |
| **Model Fallback** | `compact_model_fallback` | Remote 模型回傳錯誤 | 切換到支援壓縮的模型重試 |

**觸發判斷**（`session/token_budget.rs:71-126`）：

```rust
pub(super) async fn maybe_record(
    sess: &Session,
    turn_context: &TurnContext,
    base_window_tokens_remaining: Option<i64>,
    allow_auto_compact_fallback: bool,
) {
    let token_budget = turn_context.initial_settings.token_budget();
    let threshold = token_budget.compaction_threshold_tokens();
    if let Some(remaining) = base_window_tokens_remaining
        && remaining < threshold
        && turn_context.config.features.enabled(Feature::AutoCompact) {
        // 觸發 auto compact
        spawn_compaction_task(...)
    }
}
```

**壓縮後處理**（`compact_remote.rs:313-399`）：
- `process_compacted_history`：模型回傳的 `compacted_history` 可能包含舊 `developer` 訊息、包裝用的 `user` 訊息 → `should_keep_compacted_history_item` 過濾
- 保留：真實 `user` 訊息、`assistant` 訊息、壓縮生成的 summary、`hook` prompts
- 丟棄：舊 `developer` 指令、非用戶內容的 `user` 訊息
- 最後 `ContextManager::replace_history(Compaction, filtered_items)` 替換歷史

---

## 解法

Codex 以 **「Turn 級快照 + Step 級捕獲 + Copy-on-Write 歷史 + 兩階段 Token Budget + 多策略壓縮」** 解決單輪 turn 內部的複雜度：

1. **TurnContext 初始化一次，凍結 legacy 視圖**——`initial_settings` 讓舊代碼（approvals/guardian）在整輪 turn 看到一致設定
2. **StepContext 捕獲當下快照**——新 step 讀取 `current_settings`（可能已被前一 step 更新），實現受控演進
3. **StepActivation 守門**——任何設定變更必須通過 `check_legacy_turn_safety`，保證不破壞 legacy consumer 假設
4. **ContextManager 共享歷史**——`Arc<Vec>` 讓多 consumer（模型推論、壓縮任務、匯出）同時讀取零複製；寫入時才複製
5. **TokenBudget 分層解析**——用戶顯式值 > 模型預設值 > 無限制，壓縮閾值從合併結果計算
6. **壓縮策略可插拔**——Remote v1/v2、Local、Model Fallback 四條路徑，依 `CompactionReason`/`CompactionPhase` 分派

---

## 為什麼會這樣

| 設計決策 | 根因 |
|----------|------|
| `initial_settings` + `current_settings` 雙層 | 兼容 legacy consumer（讀初始）與新架構（讀步級），避免一次性重寫所有 consumer |
| `ArcSwap<ResolvedStepSettings>` | 無鎖讀取、原子更新，適合「讀多寫少」的步級設定 |
| `Arc<Vec>` + `history_version` | 歷史在 turn 內**只增不減**（除非壓縮/重置），Copy-on-Write 完美契合 |
| `user_message_revision` 獨立於 `history_version` | 壓縮不改變「第幾條用戶訊息」，reset 才遞增——支援 `fork_thread(TruncateBeforeNthUserMessage)` 精確定位 |
| 四種壓縮並存 | 不同模型支援度不同、網路可能失效、用戶可能手動觸發，需完整 fallback 鏈 |
| `should_keep_compacted_history_item` 精細過濾 | 遠端模型回傳的 transcript 含大量噪聲（舊指令、包裝訊息），必須在本地清洗 |

---

## 學到的事

1. **「凍結初始、捕獲當下」是處理長流程設定一致性的經典模式**——TurnContext/StepContext 分層對應 HTTP Request/Handler 的關係
2. **Copy-on-Write 歷史向量**——當「讀取頻率 ≫ 寫入頻率」且「寫入多為尾部追加或整體替換」時，`Arc<Vec>` + 版本號極其高效
3. **Token Budget 兩階段解析**——「用戶顯式值」與「模型預設值」分離，避免「用戶設為 0 卻被模型預設值覆蓋」的 bug
4. **壓縮是「模型呼叫」而非本地演算法**——將壓縮委託給模型（Remote），本地只做 fallback，符合「模型最懂什麼重要」原則
5. **Legacy 安全檢查是遷移期的必要之惡**——明確標註 `Temporary`、列出移除條件，避免永久殘留

---

## 參考資料

- [turn_context.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/turn_context.rs) — TurnContext 結構、initial_settings/current_settings、TurnEnvironment
- [step_activation.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/step_activation.rs) — check_legacy_turn_safety、check_legacy_model_safety
- [token_budget.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/token_budget.rs) — has_explicit_settings、resolve_token_budget、maybe_record
- [context_manager/history.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/context_manager/history.rs) — ContextManager、SharedConversationHistory、estimate_item_token_count
- [compact_remote.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/compact_remote.rs) — run_remote_compact_task、run_inline_remote_auto_compact_task、process_compacted_history
- [compact_remote_v2.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/compact_remote_v2.rs) — v2 壓縮實作
- [compact_model_fallback.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/compact_model_fallback.rs) — 本地/模型 fallback 壓縮
- [session/token_budget.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/token_budget.rs) — TokenBudgetConfig、compaction_threshold_tokens