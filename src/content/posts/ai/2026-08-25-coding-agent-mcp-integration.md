---
title: "跟成熟 coding agent 學設計（30）：MCP 整合——工具生態的標準插座"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 30
tags: [coding-agent, mcp, rivumi, tool-integration, elicitation, lazy-connect]
lang: zh-TW
tldr: "MCP 讓 agent 不用自己寫每個整合就能接上外部工具生態，但接得不好會拖垮啟動、炸大 context、繞過 approval。codex 用 RMCP SDK 加背景 prewarm、claude-code 把 MCP 工具包成單一 Tool 範本加專案層級 approval 對話框、opencode 靠 ToolsChanged 通知動態刷新工具表、omp 做成 process-global singleton 還能讀別家設定；pi 刻意不做。rivumi 目前沒有自己的 MCP client，只有外部 backend 的 pass-through——設計草案的核心是：lazy connect、allowlist 預設拒絕、elicitation 接回既有 approval 分級。"
description: "對照 codex、claude-code、opencode、pi、omp 五家的 MCP client 實作原始碼，整理 server 生命週期、動態工具註冊與 approval 的設計取捨，並給 rivumi 的 MCP 整合草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-mcp-integration-en)

上一篇談 [OS 級沙箱](/posts/ai/2026-08-25-coding-agent-os-level-sandboxing)。這篇談一個 rivumi 完全還沒有的能力：MCP。

## 能力問題

[MCP（Model Context Protocol）](https://modelcontextprotocol.io/docs/getting-started/intro)把「agent 接外部工具」變成標準協定：host 裡跑 client，每個 MCP server 用 stdio 或 HTTP 掛上來，提供 tools、resources、prompts。對使用者，這代表不用等 agent 作者寫 Slack 整合；對 agent 作者，這代表不用維護一百個 SDK——但代價是三個新問題。

第一是生命週期：server 是子進程或遠端連線，會掛掉、會慢、會要 OAuth。第二是 context 成本：每個 server 都想把自己的工具描述塞進 system prompt，五個 server 可能就是幾十 K token。第三是安全：`mcp__github__create_issue` 和內建工具走同一條模型呼叫路徑，如果 approval 機制不覆蓋它，等於給外部程式開了後門。

rivumi 現況如實說：**沒有自己的 MCP client**。`docs/progress.md` 把 MCP 列在「Deferred future capabilities」；唯一的 MCP 能力來自外部 CLI backend 的 pass-through——Codex app-server 路徑會轉發 `mcpToolCall` 事件，Claude backend 看到 `mcp__` 開頭的工具直接放行。

## 五家怎麼做

**codex** 用官方 Rust SDK（RMCP）當 client 底座：`codex/codex-rs/rmcp-client/src/local_stdio_transport.rs` 處理 stdio transport，連線集合由 `codex/codex-rs/codex-mcp/src/connection_manager.rs#McpConnectionSet` 統一管理。兩個細節值得抄。其一，prewarm 不擋路：`codex/codex-rs/core/src/session/mcp_prewarm.rs#schedule_mcp_prewarm` 是 best-effort 的背景預熱，檔案開頭註解就寫明這件事，server 慢啟動不會卡住第一個 prompt。其二，工具曝光有政策層：`codex/codex-rs/core/src/mcp_tool_exposure.rs#append_mcp_tools` 在把 MCP 工具塞進 registry 前先過一輪 exposure policy，不是所有 server 宣告的工具都會被模型看見。另外 codex 反向也把自己暴露成 MCP server——`codex/codex-rs/mcp-server/src/lib.rs#run_main` 讓其他 host 可以把 Codex 當成一顆工具用。

**claude-code** 的做法最「前端工程」：`claude-code-source/src/services/mcp/MCPConnectionManager.tsx#MCPConnectionManager` 是一個 React 元件，用 context 對整棵 UI 樹供應連線狀態；`claude-code-source/src/services/mcp/useManageMCPConnections.ts#useManageMCPConnections` 收一個 `dynamicMcpConfig` 參數，設定變了就重連——動態註冊是一等公民。工具側不走 N 個動態類別，而是單一範本：`claude-code-source/src/tools/MCPTool/MCPTool.ts#MCPTool` 的 name、schema、prompt 全部註明「Overridden in mcpClient.ts」，每個 MCP 工具只是這個範本的實例化，命名統一用 `mcp__<server>__<tool>` 前綴（見 `claude-code-source/src/services/mcp/utils.ts`）。approval 有專門的專案層關卡：`claude-code-source/src/services/mcpServerApproval.tsx#handleMcpjsonServerApprovals` 在專案 `.mcp.json` 裡出現未批准的 server 時彈對話框，使用者點頭前不連線。

**opencode** 最精簡但把動態性做足了：`opencode/packages/opencode/src/mcp/index.ts#createClient` 建 client，local 和 remote 各有帶 timeout 的 connect（`connectLocal`／`connectRemote` 配 `withTimeout`）。關鍵在通知處理——client 收到 `ToolListChangedNotification` 就重新 publish `ToolsChanged` 事件，上層據此刷新工具表，server 熱更新工具不用重啟 session。

**omp**（oh-my-pi）做成 process-global singleton：`oh-my-pi/packages/coding-agent/src/mcp/manager.ts#MCPManager` 全域只有一個實例，`discoverAndConnect` 批次探索連線，連線失敗不致命、降級為「discovered but not connected」。它還有一個很務實的招：讀別家的設定。`.omp/mcp.json` 是原生格式，但 Claude Code、Codex、Cursor、VS Code 的 MCP 設定檔都會被翻譯進來——使用者的既有投資直接沿用。omp 也反向輸出：記憶體套件 mnemopi 自帶 `oh-my-pi/packages/mnemopi/src/mcp-server.ts`，把自己的記憶功能暴露成 MCP server 給任何 host 用。

**pi** 是那個說「不」的：`pi-mono/packages/coding-agent/README.md` 白紙黑字「No MCP」，建議要的人自己寫 extension。上一部 capability handshake 文章提過 Pi 無 MCP，核對屬實——而且不是還沒做，是刻意不做，理由是保持核心最小。這提醒我們 MCP 不是必需品，是生態位選擇。

## 工程依據

MCP 官方文件把職責切得很清楚：[架構頁](https://modelcontextprotocol.io/docs/concepts/architecture)定義 host—client—server 三層，host 持有多個 client、每個 client 對應一個 server，這正是「連線管理該收斂在一處」的規範依據。[Tools 概念頁](https://modelcontextprotocol.io/docs/concepts/tools)則明文支援 `listChanged` 能力宣告——server 可以在執行期增刪工具，client 必須處理 `tools/list_changed` 通知，opencode 的 `ToolsChanged` 轉發就是這條規範的實作。Elicitation 規範讓 server 在執行中向使用者要輸入或確認，這是 MCP 工具 approval 不能只做靜態設定的原因。

## rivumi 設計草案

原則先講死：**MCP 初始化不進啟動關鍵路徑**——這是 `docs/progress.md` 啟動效能清單裡已經寫下的承諾，草案必須兌現它。

1. **Lazy connect**：MCPManager 只在建構子收設定，第一次真的需要某 server 的工具時才 spawn／連線，連線結果快取。codex 的 prewarm 經驗反過來用在 TUI 上：controller 預熱起來後才排背景 MCP 連線，且失敗一律吞掉。
2. **Allowlist 預設拒絕**：`src/rivumi/codex_app_server.py#allowed_mcp_servers` 已經示範了正確姿勢——白名單外的 server 不放行，名稱必須通過格式驗證才能進設定。native client 直接沿用這套語意。
3. **單一工具範本**：學 claude-code，不做 N 個動態工具類別；一個 MCPTemplate，name 用 `mcp__<server>__<tool>`，schema 原樣轉發，對齊既有的 `RuntimeToolKind.MCP`。
4. **Approval 分級接管**：MCP 工具呼叫走 `permissions.py` 的既有分級，唯讀工具低門檻、有副作用的比照 shell 指令；server 的 elicitation 請求映射到同一個 approval UI，不另開通道。
5. **Context 預算**：工具描述進 prompt 前先截斷壓縮，未啟用的 server 不佔 token——這條留到 code mode 那篇再展開。

## 與現有架構的銜接

好消息是地基都在。Capability handshake 已經有 `src/rivumi/runtime_registry.py#RuntimeCapability.MCP` 這個欄位，外部 runtime 回報 MCP 支援時契約就通了；事件層的 `src/rivumi/conversation_runtime.py#RuntimeToolKind.MCP` 讓 transcript 和 audit trail 已經認得 MCP 呼叫。缺的是中段：一個 native MCPManager、工具範本接到 `tools.py` 的動態註冊點、以及 elicitation 到 approval 的橋。外部 backend pass-through（`src/rivumi/claude_agent_session.py` 對 `mcp__` 前綴的放行）在 native client 落地後可以收斂成同一套 policy，而不是兩套行為。

順序上也清楚：先把 allowlist 語意和工具範本做進 native loop，再考慮反向暴露 rivumi 自己為 server。生態位的選擇可以晚一點做，但插座的形狀現在就要畫對。

## 參考資料

- [Model Context Protocol — Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)
- [MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Tools（含 listChanged 動態工具）](https://modelcontextprotocol.io/docs/concepts/tools)
- [openai/codex — codex-rs（rmcp-client、codex-mcp、mcp-server crates）](https://github.com/openai/codex/tree/main/codex-rs)
- [anthropics/claude-code（decompiled source研究用 repo，本地 clone 對照）](https://github.com/anthropics/claude-code)
- [sst/opencode — packages/opencode/src/mcp](https://github.com/sst/opencode/tree/dev/packages/opencode/src/mcp)
- [badlogic/pi-mono — packages/coding-agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [can1357/oh-my-pi — docs/mcp-config.md](https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-config.md)
