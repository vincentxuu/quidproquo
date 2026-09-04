---
title: "跟成熟 coding agent 學設計（15）：從全螢幕 TUI 到 semantic transcript"
date: 2026-08-25
category: ai
tags: [coding-agent, tui, textual, claude-code, codex, opencode, looplane]
lang: zh-TW
type: deep-dive
description: "比對 Claude Code、Codex、Pi、OpenCode 四家終端介面的事件流渲染策略，拆解 semantic transcript 的設計，以及 looplane 從全螢幕組合、runtime-first 雙模式到統一對話的三段演進。"
tldr: "成熟的 coding agent TUI 都不是把事件流印出來，而是先做一層 typed projection 再渲染；looplane 走了全螢幕組合、runtime-first 雙模式、移除 Ask/Agent 分離三步，才把 non-streaming 和 resume 不能 replay 兩個舊限制真正解除。"
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 15
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-tui-to-transcript-en)

## 設計問題：agent 對話在終端機該長什麼樣

一個 coding agent 在跑的時候，底層其實只有一條事件流：模型吐字、工具開始、工具結束、權限請求、錯誤。終端機介面的核心問題是——**這條事件流要怎麼變成一個人讀得下去的畫面**。

最直覺的做法是每個事件都印一行 log。但跑十分鐘下來你會得到幾百行「Reading file...」「Done」「Reading file...」，重要的 diff 淹在雜訊裡。另一種極端是做成聊天氣泡：You 一顆、Assistant 一顆。可是 agent 對話跟聊天不一樣——一次回應裡可能夾著五次工具呼叫和一個待批准的檔案修改，role 二分法根本裝不下。

所以真正的設計問題有兩層：畫面上該出現哪些「東西」（語意模型），以及事件流怎麼即時更新那些東西（投影機制）。我實際讀了五家原始碼，把它們的答案攤開來比。

## 五家怎麼做

### Claude Code：transcript 是 reducer 的輸出，不是事件的堆疊

Claude Code 的主畫面既不是 role-labelled chat，也不是 activity log，而是一個 **semantic transcript**。關鍵在 `claude-code-source/src/components/Messages.tsx#Messages`：渲染前先跑一整條管線——`normalizeMessages` 去掉空訊息、`applyGrouping` 把相容的工具呼叫歸組、`collapseReadSearchGroups` 折疊重複的讀檔搜尋、最後 `buildMessageLookups`（`src/utils/messages.ts#buildMessageLookups`）建索引讓每次工具呼叫都能跟自己的結果配對。順序就寫在同一行：`collapseReadSearchGroups(groupedMessages)` 包在 `collapseBackgroundBashNotifications(...)` 裡（`Messages.tsx:520`）。

投影出來的階層是不對稱的。使用者 prompt 是全寬對比色列，沒有「You」標題，超過 10,000 字元會截頭留尾再留尾段（`src/components/messages/UserPromptMessage.tsx#UserPromptMessage`，保留尾部是因為 piped input 的問題通常在最後）。助手文字是無框 Markdown 加一個圓點 gutter。工具是一行穩定的列，從 queued 到完成**原地更新狀態**，結果用 `⎿` 掛在自己下面（`src/components/messages/AssistantToolUseMessage.tsx#AssistantToolUseMessage`）。diff 屬於編輯本身，而權限請求直接掛在 transcript 尾端的捲動流裡，不是彈出一張蓋住全部的卡（`src/screens/REPL.tsx` 的 `toolPermissionOverlay`）。

### Codex：committed cells 加一個會變的 active cell

Codex 的 Rust TUI 把畫面分成兩區：已定案的 `HistoryCell` 串列，加上一個還在串流中、可以原地變異的 `ChatWidget.active_cell`——模組開頭註解講得很明白（`codex/codex-rs/tui/src/chatwidget.rs#ChatWidget`）。cell 是 trait：`codex/codex-rs/tui/src/history_cell/mod.rs#HistoryCell`，各種語意型別各自實作渲染。審批走 bottom pane 的佇列 `codex/codex-rs/tui/src/bottom_pane/approval_overlay.rs#ApprovalOverlay.enqueue_request`，輸入是 `chat_composer.rs#ChatComposer`，diff 有獨立的 `diff_render.rs#DiffSummary`。同一套「typed cell + 原地更新」哲學，只是換成 Rust。

### Pi：TUI 是函式庫，agent 自己排版

Pi 把通用渲染拆成 `pi-mono/packages/tui`：元件只要實作 `render(width): string[]`，核心 `tui.ts#TUI` 用差分渲染只重繪變動的行。上層的互動模式在 `pi-mono/packages/coding-agent/src/modes/interactive/interactive-mode.ts` 做 session 重放與串接：assistant 訊息裡每個 `toolCall` 建 `tool-execution.ts#ToolExecutionComponent`，之後到達的 `toolResult` 用 `renderedPendingTools.get(message.toolCallId)` 配對回原件更新——correlation key 從協定層一路貫到 UI。fork 出去的 OMP 沿用同一套骨架（`oh-my-pi/packages/coding-agent/src/modes/components/assistant-message.ts#AssistantMessageComponent`），在其上疊自己的 compaction 與擴充。

### OpenCode：宣告式元件樹加 sticky scroll

OpenCode 用 SolidJS 寫 TUI。session 路由就是一個 `<For each={messages()}>`，user/assistant 各自 match 到元件（`opencode/packages/tui/src/routes/session/index.tsx#UserMessage`，左邊框對比色列、無 role 標題），捲動容器設 `stickyScroll` + `stickyStart="bottom"` 讓畫面黏在底部。權限請求是捲動區正下方的 `routes/session/permission.tsx#PermissionPrompt`。資料來源是 server 同步來的 message/part store，UI 只負責投影。

五家做法不同，但收斂點一致：**都不是直接印事件，而是先建一層帶穩定 ID 的語意項目，再讓事件原地更新它**。

## looplane 的選擇與三段演進

looplane 這篇故事的核心不是「抄誰」，而是**每一代的舊限制怎麼被下一代解除**。

**第一段（M9）：全螢幕組合。** 第一版用 Textual 把 onboarding、任務輸入、活動、審批、結果拼進一個畫面（`looplane/src/looplane/tui.py#LooplaneApp`）。Textual 的 [Screen](https://textual.textualize.io/guide/screens/) 和 worker 機制負責 alternate screen 與非同步，[RichLog](https://textual.textualize.io/widgets/rich_log/) 收原始事件。但當時模型合約不支援串流，活動只能以 step/tool 為單位跳動；resume 也只能走舊的行式路徑，歷史事件流無法在 TUI 裡重放。限制很清楚，但先證明了「一個畫面」可行。

**第二段（M10）：runtime-first 雙模式。** 接上 Claude Code / Codex CLI 之後，composer 分出 Ask 和 Agent：Ask 只讀、process-local bounded transcript；Agent 走完整安全閘。這一步解決了「不用先給 raw model ID 就能用」，卻製造了新的彆扭——每個 prompt 都起一個新的子行程，上一輪的答案要用隱藏的 prompt 文字重餵回去；隨口的問題和寫程式的需求被迫走兩個世界，儘管 Claude Code 和 Codex 本來就把它們當同一個 session 的 turns。

**第三段（M11）：移除分離。** 這代做了三件事。第一，一條長駐的外部 session：`looplane/src/looplane/conversation_controller.py#ConversationController` 對 Codex app-server 或 Claude Agent SDK sidecar 維持一個 child，多 turn 共享。第二，semantic transcript 成為一等公民：`looplane/src/looplane/tui.py#conversation_runtime_event_received` 是唯一的 reducer，`TextDeltaEvent` 累積串流文字、`RuntimeToolStartedEvent` 用 `_ensure_tool_action` 找到既有那行工具列原地改狀態——不再有每個事件一行 Activity 的洪水。第三，審批 docked 進 transcript 流：`looplane/src/looplane/tui.py#request_approval` 把 `InlineApprovalBlock` mount 在觸發它的那行工具正下方，diff 預覽和選項就在脈絡裡，transcript 保持可見可捲。

而 M9 留下的 resume 問題，由 `looplane/src/looplane/conversation.py#ConversationStore` 解除：嚴格 user/assistant turn schema、0600 檔案、0700 目錄，vendor session ID 不落盤。重啟後開新的 native session，用 bounded completed-turn replay 補一次上下文——replay 從「做不到」變成一等操作。

## 工程依據

這套演進背後是 Textual 的三個設計決定。[Screen](https://textual.textualize.io/guide/screens/) 讓 modal 審批和主畫面的職責分開，M11 的 docked approval 則回到同一個 screen 的 DOM 流裡，兩種模式都有官方支撐。[Reactive 屬性](https://textual.textualize.io/guide/reactivity/)讓 `ToolActionBlock.set_state` 這類原地更新不需要手動重繪整個列表；[OptionList](https://textual.textualize.io/widgets/option_list/) 保證審批選項在任何終端寬度都垂直堆疊、可用鍵盤選。另外 Textual 官方明確建議把大量日誌型輸出放 RichLog 而非主 DOM——這正好對應 M11 的決定：診斷留在 Details，主 transcript 只放語意列。

## 改善路線

對照五家，looplane 還缺三件事。其一，**折疊與歸組**：Claude Code 能折疊連續讀檔（`claude-code-source/src/utils/collapseReadSearch.ts#collapseReadSearchGroups`）、Codex 能 coalesce exec 群組，looplane 的 `ToolGroupBlock` 已有骨架但歸組策略仍粗。其二，**長對話的渲染規模**：Claude Code 超過 200 則訊息就切換虛擬化列表、只渲染視窗附近的列（`claude-code-source/src/components/Messages.tsx` 的 `MAX_MESSAGES_WITHOUT_VIRTUALIZATION`），looplane 目前把每個語意列都掛在 DOM 裡，跑得久就會變重。其三，**rewind/fork**：OpenCode 有 revert 到任一訊息、`ConversationStore.fork_before_turn` 已存在但尚未接到 UI。semantic transcript 不是終點，它是讓這些功能「有地方長」的地基。

## 參考資料

- [Textual 官方文件](https://textual.textualize.io/) — Screen、reactivity、widgets 的設計依據
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — packages/tui 差分渲染與 packages/coding-agent 互動模式
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — Pi fork 的訊息元件演進
- [sst/opencode](https://github.com/sst/opencode) — packages/tui 的 SolidJS session 路由
- [openai/codex](https://github.com/openai/codex) — codex-rs/tui 的 HistoryCell 架構
