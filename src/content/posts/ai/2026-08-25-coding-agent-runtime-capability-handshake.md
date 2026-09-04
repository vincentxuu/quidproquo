---
title: "跟成熟 coding agent 學設計（16）：Runtime 抽象與 capability handshake"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 16
tags: [coding-agent, harness-engineering, runtime-abstraction, capability-handshake, acp, app-server-protocol]
lang: zh-TW
description: "Pi、OMP、OpenCode、Codex、Claude Code 五家的機器介面比較，以及 looplane M13 如何用 ConversationRuntimeSession 邊界與誠實的 capability matrix 支援多個外部 CLI 而不假裝它們一樣。"
tldr: "五個外部 CLI 有五種機器介面：JSONL 事件流、JSON-RPC、HTTP API、ACP、stream-json。支援它們的正確姿勢不是抽一個「都一樣」的介面，而是一條窄的 runtime 邊界加一份誠實的 capability matrix——availability 只代表裝了，不代表登入；協定飄移就 fail closed。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-runtime-capability-handshake-en)

## 設計問題：支援多個外部 CLI，但不假裝它們一樣

looplane 的架構有兩種模式：native 模式自己擁有 agent loop，外部模式則把整個任務委派給使用者已安裝的 CLI——Claude Code、Codex CLI、OpenCode、Pi、OMP。M13 要解的問題是：怎麼讓第三、四、五家進來，而不是把 Claude/Codex 的專屬程式碼複製三份？

陷阱很明確：做一個萬用 `CodingCliAdapter` 介面，宣告每家都有 streaming、approval、resume、usage——然後在細節處偷偷撒謊。OpenCode 沒有互動式 approval 可以穿越 headless 邊界；OMP 是 Pi 的 fork 但不保證永遠同步；Codex 的 capability 要靠 handshake 協商。假裝一致的下場就是 UI 顯示一個按下去沒反應的 approve 按鈕。

所以 looplane 的答案是兩件東西：一條窄的 runtime 邊界（`ConversationRuntimeSession`），和一份每家各自宣告、UI 必須尊重的 capability matrix。

## 五家的機器介面

**Pi** 提供三層機器介面。一次性任務用 `--mode json`，把內部 session 事件直接序列化成 JSONL；嵌入用 RPC 模式，stdin 收 JSON 命令、stdout 吐事件與回應，命令集涵蓋 prompt、abort、set_model、compact、fork 等（pi-mono/packages/coding-agent/src/modes/rpc/rpc-types.ts#RpcCommand）。事件出場前會先經過瘦身，把串流中的累積快照剝掉，只留 delta 與最終權威訊息（pi-mono/packages/coding-agent/src/modes/json-event.ts#toJsonEvent）。更底層還有一個帶版本號的 CBOR framing 協定，長度前綴加 frame 上限（pi-mono/packages/protocol/src/schemas.ts#PROTOCOL_VERSION）。

**OMP** 是 Pi 的 fork，headless 表面幾乎同構：`omp --mode json` 用同一套事件詞彙。它的 collab wire 型別註解寫得很老實——未知的事件變體就用 JSON 過線，客端每個 switch 都保留寬容的 default 分支（oh-my-pi/packages/wire/src/index.ts#TextContent）。「跟上游共用 normalizer，但保留獨立 adapter 以便隨時分岔」是對 fork 的正確防禦。

**OpenCode** 最標準化：一個 HTTP server（openapi.json 自動產生，opencode/packages/server/src/routes.ts#createRoutes）加上官方 SDK，另外完整實作了 [ACP](https://agentclientprotocol.com/)——initialize、authenticate、newSession、loadSession、resumeSession、forkSession、setSessionMode、setSessionModel 全部接上（opencode/packages/opencode/src/acp/agent.ts#Agent）。它是五家裡唯一把 resume 和 model switching 做成協定方法的。

**Codex CLI** 用 app-server-protocol：先 `initialize` 握手，客端帶 ClientInfo 和 `InitializeCapabilities`——明確 opt-in 實驗方法、聲明要關閉哪些通知（codex/codex-rs/app-server-protocol/src/protocol/v1.rs#InitializeCapabilities）。之後才是 thread/start、thread/resume、甚至 modelProvider/capabilities/read 這類能力查詢（codex/codex-rs/app-server-protocol/src/protocol/common.rs#ClientRequest）。capability 在這裡是協商出來的，不是宣稱的。

**Claude Code** 的 headless 表面是 `--output-format stream-json` 的 JSONL 流，搭配 SDK 端的 permission callback（claude-code-source/src/cli/print.ts#runHeadless）。互動式審批存在，但形狀跟其他家都不一樣。

五家排起來：JSONL 事件流 ×2（Pi/OMP）、JSON-RPC handshake（Codex）、HTTP+ACP（OpenCode）、stream-json（Claude Code）。沒有任何兩家的 approval、resume、usage 語意相同。

## looplane 的選擇與差異

looplane 沒有為新三家另開 adapter 階層，而是泛化既有的 `ConversationRuntimeSession` port：start、send_turn、capabilities()、respond_approval、interrupt、aclose，事件全部轉成 looplane-owned 的 typed events（looplane/conversation_runtime.py#ConversationRuntimeSession）。approval request 明確規範「不含 vendor identifier」——vendor ID 由 adapter 私藏，controller 只看得到 looplane 自己的 ID（looplane/conversation_runtime.py#RuntimeApprovalRequest）。

三家新 CLI 共用一個 `StreamJsonCliBackend`：子類只提供 argv 和 normalizer，基底負責執行檔探測、隔離環境、bounded 子程序、事件轉發（looplane/external_cli_base.py#StreamJsonCliBackend）。normalizer 把各家的原始事件折疊成統一的 `ExternalAgentEvent`：Pi 的 `message_update`/`text_delta` 變 message（looplane/pi_backend.py#PiBackend._normalize_event）；OMP 直接繼承 Pi backend，等 live capture 證明 schema 分岔才拆（looplane/omp_backend.py#OmpBackend）。

差異不是被掩蓋，而是被三種方式暴露：

1. **Capability matrix**。每家在 registry 各自宣告九項能力——streaming、tool events、approval、diff、multi-turn、model switching、MCP、cancellation、usage。Pi 少 MCP 就少寫，UI 依此隱藏或標示控制項（looplane/runtime_registry.py#RuntimeCapability）。
2. **Fail closed on drift**。超過事件上限、單行過大、JSON 解析失敗、缺 type 欄位——一律標記 malformed，整個 run 判成 `malformed_event_stream` 失敗，而不是硬吞（looplane/external_cli_base.py#StreamJsonCliBackend._normalize）。
3. **Handshake 老實說**。Codex session 啟動時真的送 `initialize`、真的 opt-in `experimentalApi`，因為 `runtimeWorkspaceRoots` 這個安全邊界欄位被 Codex gate 在該 capability 後面——不協商就拿不到（looplane/codex_app_server.py#CodexAppServerSession）。

還有一個刻意的不對稱：TUI 的 runtime 清單只列「執行檔存在」的 CLI（looplane/runtime_registry.py#runtime_options）。裝了 ≠ 登入了。Looplane 不讀別家的憑證、不推測訂閱有效性，ready check 交給各家自己的機制。另一個例子是 OpenCode：headless 下 stdin 是 `/dev/null`，它的互動式 permission prompt 永遠得不到回應，會整個卡死——所以 adapter 直接傳 `--dangerously-skip-permissions`，並靠 looplane 側的一次性 workspace clone 與事後 patch 審計兜住安全，而不是假裝 approval 有被中介（looplane/opencode_backend.py#OpenCodeBackend._argv）。

## 工程依據

這條路有先例。[LSP](https://microsoft.github.io/language-server-protocol/) 證明了「編輯器 × 語言伺服器」可以用一個協定從 M×N 降成 M+N。[ACP](https://agentclientprotocol.com/) 把同樣想法搬到編輯器 × coding agent：JSON-RPC over stdio，重用 MCP 的型別表示，並為 diff 顯示這類 agent 特有的 UX 定義自訂型別。OpenCode 同時實作 HTTP API 與 ACP 正是兩種消費形態並存的例子。

但 ACP 也印證了 looplane 不敢假設的事：截至目前，五家只有 OpenCode 完整支援 ACP。協定整合需要時間，所以現實的做法是分層偏好——有版本化 SDK/RPC 就用（Codex）、有結構化協定就接（OpenCode/ACP）、退一步是文件化的 JSON 事件流（Pi/OMP/Claude Code stream-json），PTY rendering 永遠只是降級選項而非預設契約。這正是 [MCP](https://modelcontextprotocol.io/) 生態學到的教訓：先定義窄介面與 capability 宣告，整合自然長出來；反過來先假裝相容，債就留在每一個 adapter 裡。

## 改善路線

M13 目前的誠實是有代價的，這些是下一階段的帳：

1. **Resume 還沒進 runtime 邊界。** registry 有 multi-turn 宣告、Codex/OpenCode 有 thread/resume 與 loadSession，但 `ConversationRuntimeSession` 尚無統一的 resume 方法。外部 CLI 的 native session 續接仍是 per-adapter 特例。
2. **Approval 中介只有部分成立。** OpenCode 走 skip-permissions 加事後審計，這是「約束並標示」而非真正的 tool boundary 中介。ACP 的 permission request 形狀值得吸收成 Looplane 端的標準中介點。
3. **Capability matrix 目前是靜態常數。** Codex 已經示範了 `modelProvider/capabilities/read` 這種執行期查詢；把 matrix 從手寫改為 handshake 後填充，能消除「升級後宣告過期」這一整類 bug。
4. **Protocol version pinning 還很粗。** fail closed 抓得住 malformed，但抓不住「合法但語意變了」的事件。最小可行做法是在 handshake 或首個事件裡記下版本，超出已知區間就直接降級為 unavailable。
5. **Usage 與成本尚未標準化。** Pi 的 usage 隨事件流走、OpenCode 在 step_finish 帶 tokens/cost、Codex 走自己的通知。統一成 typed event 才能跨 runtime 比較成本。

一句話收尾：抽象的價值不在於遮掉差異，而在於把差異放到對的地方——capability matrix 說謊一次，使用者就在 UI 上撞牆一次。

## 參考資料

- [Agent Client Protocol（ACP）](https://agentclientprotocol.com/) — runtime capability handshake、CLI 邊界與 looplane adapter 對照的 JSON-RPC over stdio 協定。
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) — 協定整合 M×N → M+N 的先例
- [Model Context Protocol](https://modelcontextprotocol.io/) — 能力宣告與窄介面的設計參考
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — `packages/coding-agent`（json/RPC modes）、`packages/protocol`（CBOR framing）
- [sst/opencode](https://github.com/sst/opencode) — `packages/server`、`packages/opencode/src/acp`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/app-server-protocol`
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — headless `--output-format stream-json` 文件
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — Pi fork 與 collab wire types
