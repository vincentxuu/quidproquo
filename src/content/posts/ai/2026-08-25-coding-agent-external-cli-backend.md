---
title: "跟成熟 coding agent 學設計（9）：外部 CLI 當 backend——包別人的 loop，安全邊界畫在哪"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 9
tags: [coding-agent, external-cli, looplane, sandbox, codex, claude-code]
lang: zh-TW
tldr: "每家成熟 coding agent 都有 headless 機器介面：codex 有 `exec --json` 和更完整的 app-server JSON-RPC，claude-code 有 `-p` 加 stream-json，pi/opencode/omp 各有一種 JSON 事件流。直接把這些 CLI 當 backend 是最快的路，但代價是：它們自帶 agent loop、自己的權限模型、自己的登入。looplane 的答案是讓外來 CLI 完整擁有它的 loop，自己只守住三件事——隔離副本、patch audit、最終驗證——並且一條 runtime 永遠不偽裝成另一條。"
description: "對照 codex、claude-code、opencode、pi、omp 五家的 headless 機器介面原始碼，說明把外部 CLI 當 coding backend 的設計張力，以及 looplane 用隔離副本與 patch audit 畫出的安全邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-external-cli-backend-en)

上一篇談 [approval 分級](/posts/ai/2026-08-25-coding-agent-approval-grading)。這篇碰一個更實際的問題：你的 harness 已經有自己的 loop 和驗證閘門，但使用者手上躺著已經登入訂閱的 Codex CLI 和 Claude Code——要自己接 API 重造一遍，還是直接把他們的 CLI 包成 backend？

## 設計問題：包別人的 CLI，行不行

自建 harness 的成本很誠實：model provider 抽象、retry、工具集、編輯工具、驗證命令——每一層都要自己做。而使用者的機器上可能已經裝好兩個「免費」的完整 agent：官方 CLI 帶著自己的模型迴圈、自己的登入狀態、自己的沙箱選項。把它們當 backend 跑，等於跳過上面每一層工程。

但包了之後問題才開始。第一，外來 CLI 不是 library 而是 process：它有自己的 loop，你不控制它何時呼叫哪個工具。第二，它帶著自己的憑證和環境，你既不想偷讀它的登入，也不能假裝它是你的 model adapter。第三，它的輸出是給人看的終端機體驗附帶的機器格式，schema 隨版本漂移。所以真正的設計題是：**安全邊界放在哪？** 相信 CLI 自己的沙箱？還是假設它的一切輸出都不可信？

## 五家怎麼做

**codex** 提供兩層機器介面。第一層是一次性 headless 執行：`codex-rs/exec/src/cli.rs#json` 定義了 `--json` flag，`codex-rs/exec/src/event_processor_with_jsonl_output.rs#EventProcessorWithJsonOutput` 把內部事件轉成 JSONL 行。第二層是長駐協定：`codex-rs/app-server-protocol/src/protocol/common.rs#ClientRequest::ThreadStart` 定義 `thread/start`，同一個 enum 裡還有 `turn/start` 和 `turn/interrupt`——一個子行程可以跑很多個 turn。更關鍵的是反方向的請求：`common.rs` 的 `ServerRequest::ExecCommandApproval` 和 `ApplyPatchApproval` 讓 app-server 主動問客戶端「這條指令／這個 patch 可以放行嗎」，審批權被明確交給外層。

**claude-code** 的 headless 介面是 `-p`／`--print` 加串流：`src/main.tsx#getInputPrompt` 接受 `'text' | 'stream-json'` 輸入格式，print 模式下信任對話框會被跳過。SDK 側的鉤子是 `src/QueryEngine.ts#canUseTool`——每次工具呼叫前先問宿主程式準不準。這正是 Agent SDK 文件講的 programmatic permission hook。

**opencode** 走最簡單的路：`packages/opencode/src/cli/cmd/run.ts` 提供 `--format json`，描述就寫著「raw JSON events」。**pi** 的介面多一種模式：`packages/coding-agent/src/cli/args.ts#Mode` 定義 `text | json | rpc` 三種輸出模式，JSON 事件的投影在 `packages/coding-agent/src/modes/print-mode.ts#printableEvent`。**omp** 是 pi 的 fork，保留了同一套 print mode，另外長出自己的 RPC 層（`packages/coding-agent/src/modes/rpc/rpc-client.ts`）給 IDE 整合用。

共同點很清楚：五家都把「headless 機器介面」當成一級公民，而且 codex 和 claude-code 都把審批做成雙向通訊，不是事後看 log。

## looplane 的選擇與差異

looplane 從 M5 開始就把原則寫死在 `src/looplane/external_runner.py#ExternalCodingRunner` 的 docstring：「外來 runtime 只能在拋棄式 Git clone 裡改東西；Looplane 獨立驗證 patch 邊界並執行最終驗證命令。」具體拆成三道牆：

1. **Workspace 邊界**：委派前 pin 住 source HEAD、要求 worktree clean、用串流 SHA-256 對整個非 `.git` 檔案系統拍照（連 ignored files 都算，`_filesystem_snapshot`）；clone 不用 hardlink、`.git` 搬到子行程 cwd 外面（`_isolate_git_metadata`）、拔掉 origin。
2. **Patch audit**：跑完之後先驗 source 完整性，再對照不可變 index 取全量 diff，套路徑政策與累積上限，拒收 binary/symlink/untracked 輸出（`_validate_external_patch`）。CLI 自己報告改了什麼不算數。
3. **最終驗證**：每條檢查命令走 looplane 自己的 bounded verifier，驗完再比對一次 patch，確認檢查過程沒有動到成品。

M10/M11 把這套邊界從一次性任務延伸到長駐對話：`codex_app_server.py#CodexAppServerSession` 對 `codex app-server` 開一條 JSONL 連線、一個 thread 跑很多 turn，file-change 和指令審批透過協定路由回 looplane；Claude 側用 Agent SDK 的 `canUseTool` 做 PreToolUse 相關性。但 vendor 的 thread/session ID 全部留在 adapter 內部，能到達 renderer 和持久層的只有 looplane 自己生成的 ID——外來 runtime 不污染原生資料模型。

這條路不是一步到位的。M10 最初用的是一次性委派：每個問題都重新啟動一個 `claude -p` 或 `codex exec` 子行程，把前一輪回答當成隱藏提示詞重播。實際用起來有三個失敗模式——回答被重播而非由活的 session 持有、終端機的 system/result 記錄在畫面上重複出現、閒聊和寫程式被迫走兩種模式。M11 才改成長駐 session：一般對話與副作用共用同一條 transcript，真正的安全邊界是「model 實際請求 Edit、Write、Bash 的那一刻」，而不是使用者選了哪個模式。

M13 泛化時也沒有破壞原則：`external_cli_base.py#StreamJsonCliBackend` 把 opencode/pi/omp 收進同一個基底——子類只負責給出 argv 和 tolerant normalizer，bounded subprocess、環境控制、事件上限全部共用；`runtime_registry.py#RUNTIME_REGISTRY` 用能力矩陣宣告各家差異（例如 opencode 有 MCP、pi 沒有），TUI 和 dispatch 只讀 registry，不寫任何 per-runtime 分支。

最核心的差異是一條否定句：**外來 CLI 永遠不被包成 `ModelProvider`**。looplane 的 provider 抽象吃的是 model ID 和 API 金鑰；外部 CLI 是完整 agent runtime，有自己的 loop 和登入。混在一起的話，你會分不清「誰在決策、誰在執行、誰該為副作用負責」。所以訂閱路徑永遠標記為 local/private 實驗功能，需要三個顯式 opt-in 才能動。

## 學術與工程依據

「agent 的輸出是不可信輸入」在研究上有名字：[Indirect prompt injection](https://arxiv.org/abs/2302.12173) 示範了 LLM 整合應用會被注入內容劫持工具呼叫——這正是為什麼 looplane 不相信 CLI 回報的 diff，而是從 Git 重新計算。[SWE-agent](https://arxiv.org/abs/2405.15793) 的 agent-computer interface 論證了介面設計決定 agent 行為品質；app-server 協定本質上就是把 ACI 從「shell + 檔案」升級成「typed event + 審批請求」。工程側，[Codex 的 sandboxing 文件](https://developers.openai.com/codex/concepts/sandboxing)和 [Claude Code permissions](https://code.claude.com/docs/en/iam) 都明講自己的防護有限——兩家官方都不保證 OS 級隔離，這給「宿主必須自建邊界」提供了第一手背書。

## 改善路線

三件事排在前面。第一，事件目前是「跑完後 normalize」而非全程 token streaming，M11 之後 app-server 路徑已有串流，但 `StreamJsonCliBackend` 那條泛化路徑還沒有。第二，patch audit 目前只接受 tracked 檔案的修改/刪除，新檔案 fail closed——對「幫我新增一個 module」這種常見任務太嚴，需要安全的 untracked 輸出路徑。第三，source snapshot 成本隨非 `.git` 檔案線性成長，大型 repo 會撞 deadline；可以考慮以 Git 追蹤集合為主、ignored 檔案抽樣驗證的分層策略，把「證明 source 沒變」的成本壓下來。

## 參考資料

- [openai/codex — codex-rs workspace](https://github.com/openai/codex)：`exec` headless 模式、CLI backend loop 與 looplane 外部 runtime 邊界對照。
- [OpenAI Codex sandboxing 文件](https://developers.openai.com/codex/concepts/sandboxing)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) 與 [Claude Agent SDK 文件](https://platform.claude.com/docs/en/agents-and-tools/claude-agent-sdk/overview)
- [sst/opencode — run 指令](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)：`--mode json|rpc` 事件流
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- Greshake et al., [“Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection”](https://arxiv.org/abs/2302.12173)
- Yang et al., [“SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering”](https://arxiv.org/abs/2405.15793)
