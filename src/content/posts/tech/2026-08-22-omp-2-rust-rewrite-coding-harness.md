---
title: "OMP 2（Oh My Pi 2）：從 Pi fork 到全 Rust 重寫的獨立 coding harness"
date: 2026-08-22
category: tech
type: deep-dive
tags: [omp, rust, coding-agent, cli, open-source, ai-tools, harness-engineering]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 23
tldr: "OMP 2 不再是 Pi 的 fork。整個 codebase 用 Rust 從零重寫，約 41 個 crate 涵蓋自製 bash 引擎、GPU 加速 GUI、嵌入式 CPython 3.14t、gRPC transport 與 Kokoro-82M TTS。目前 pre-release，尚未正式發行。"
description: "OMP 2 從 Pi fork 演變為完全獨立的 Rust codebase，本文分析其 crate 架構、與 v1 的實質差異、設計取捨與 pre-release 風險。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)

[上一篇 OMP 介紹](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)講的是 v1——Pi 的 batteries-included fork，TypeScript 主體加上六個 Rust crate 做加速層。那時的結論是「差別不在能不能疊起來，在於你想不想自己決定疊什麼」。

OMP 2 把那個前提整個拆掉了。它不再是 Pi 的 fork，不再有 TypeScript 主體，而是從零開始的全 Rust codebase。[omp2 分支](https://github.com/can1357/oh-my-pi/tree/omp2)目前約 41 個 crate，全放在 `crates/*` 底下，用 pinned nightly toolchain 編譯，edition 2024，hard-tab formatting。

這篇拆它的架構分層，標出和 v1 的實質差異，然後講 pre-release 階段該注意什麼。

## 從 fork 到獨立 codebase 的動機

v1 的六個 Rust crate（`pi-shell`、`pi-natives`、`pi-walker`、`pi-iso`、`pi-ast`、`pi-voice`）是**加速層**——它們繞過 fork/exec，把 grep、shell、AST 比對搬進 process，但上面跑的仍是 Pi 的 TypeScript agentic loop。升級 Pi 上游時，omp 需要合併上游的 TypeScript 改動，再確保 Rust binding 沒有壞掉。

OMP 2 的選擇是把 TypeScript 幾乎完全移除，agentic loop 本身也用 Rust 寫。這意味著它不再受上游 Pi 的設計限制，但也不再享有上游的免費進展。README 的 tagline 很直接：

> A coding agent with the IDE wired in — rewritten in Rust.

回頭看 [Pi 的哲學](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)——刻意只給四個工具、拒絕 MCP、拒絕 sub-agent——OMP 2 等於是說：我們要的不是在這個框架上加東西，而是重新設計框架本身。

## Crate 架構：五層分工

41 個 crate 按職責分成五層。以下不是逐行列舉，而是按層抽出設計選擇。

### 核心原語（core primitives）

| Crate | 做什麼 |
|---|---|
| `core` | 緊湊字串（`Str`）、稀疏集合、二進位與文字編碼轉換 |
| `ar` | 有界惰性 ZIP/TAR/TAR.GZ 讀取，確定性 archive 寫入 |
| `walker` | 檔案走訪、過濾、候選檔案發現 |
| `slopjson` | 容錯 JSON 解析——處理格式錯誤、部分、串流中的文件 |
| `hashline` | 無磁碟的 hashline patch 解析與套用，跑在不可變位元快照上 |
| `ast` | tree-sitter 原始碼分析、結構化搜尋、AST-aware 編輯 |
| `grep` | 內建搜尋實作 |

`slopjson` 值得多看一眼。LLM 串流回傳的 JSON 經常在中途斷掉——括號沒關、逗號多了一個——一般的 JSON parser 會直接拒絕。容錯解析意味著 agent loop 可以在 token 還在流進來的時候就開始處理結構化輸出，不用等到整段結束。

`hashline` 從 v1 就是 omp 的招牌。v1 的 benchmark 已經證明它在 16 個模型中有 14 個勝過 `apply_patch` 格式，Grok Code Fast 1 的改善幅度達到 +64.6 分。v2 把它從 N-API binding 變成獨立 crate，跑在不可變位元快照上，代表 patch 的套用跟檔案系統完全解耦——可以拿來 patch 記憶體裡的任何東西，不只是磁碟上的檔案。

### 推論層（inference）

| Crate | 做什麼 |
|---|---|
| `llm-catalog` | 離線的供應商／路由／模型／能力目錄（嵌入式快照，無 runtime 試探） |
| `llm-inference` | 型別化的請求／回應契約，基於 Tower service stack 的 Client（routing、auth、重試、預算） |

v1 的 60+ 供應商支援是透過 TypeScript 的 `@anthropic-ai/sdk`、`openai` 等 npm 套件。v2 的 `llm-catalog` 把模型資訊以編譯時快照的形式嵌進 binary——不需要在 runtime 去猜「這個模型支不支援 function calling」「context window 多大」，查表就有。

`llm-inference` 建在 [Tower](https://docs.rs/tower/latest/tower/) service stack 上。Tower 是 Rust 生態裡處理 middleware（重試、超時、速率限制、負載平衡）的標準抽象。選 Tower 意味著 OMP 2 的推論客戶端可以和 Rust 的 HTTP/gRPC 生態共用 middleware，而不是自己寫一套。

### 服務層（services）

| Crate | 做什麼 |
|---|---|
| `proto` | 生成的 Protobuf 訊息與 gRPC binding |
| `rpc` | gRPC transport、握手、健康檢查、TLS、Unix-socket |
| `storage` | append-only session 逐字稿與 content-addressed blob 儲存 |
| `docserver` | 本地文件權威：檔案系統、版本控制、交易、watch、LSP ops |
| `telemetry` | OpenTelemetry 儀表板、指標、匯出、遮蔽 |
| `env` | 環境服務的型別化 client 邊界 |

gRPC + Protobuf 這個選擇在 coding agent 裡不常見。多數 agent（Claude Code、Codex CLI、Gemini CLI）的 IPC 走的是 JSON-RPC 或 HTTP REST。gRPC 的好處是二進位序列化（比 JSON 小且快）、強型別契約（`.proto` 檔案就是 schema）、雙向串流。代價是除錯時沒辦法直接用 `curl` 打。

`storage` 用 content-addressed blob——存東西的時候用內容的 hash 當 key，相同內容只存一份。這在 agent session 裡很實際：模型反覆讀同一份檔案，每次讀取的結果存進 session 紀錄時不會重複佔空間。

`docserver` 是「本地文件權威」——它管理檔案的版本、交易、變更通知，還提供 LSP 操作。v1 的 14 個 LSP op 在 v2 裡不是外掛，而是 docserver 這個 crate 的原生能力。

### Agent 層

| Crate | 做什麼 |
|---|---|
| `tool` / `tools` | 型別化、版本化的工具契約與註冊，以及擁有資源的內建執行器 |
| `agent` | 耐久、可中斷的 agent loop 基礎 |
| `app` | 正式 CLI 應用與常駐程序 |
| `e2e` | 跨 crate 的驗收測試 |
| `macros` | 程序巨集 |
| `memory` | Mnemopi——跨 session 記憶 |
| `collab` | 協作 session |
| `sdk` | 外部整合的 SDK |
| `sandbox` | 沙箱隔離 |
| `campaign` | 批次執行引擎 |
| `oauth` / `secrets` / `settings` | 認證、機密管理、設定 |

幾個值得展開的：

**工具契約的版本化**（`tool` crate）。v1 的 31 個工具是 TypeScript 函式加上 JSON Schema 描述。v2 改用「typed revisioned tool contracts」——每個工具有版本號碼，schema 在編譯時檢查。模型看到的工具描述是從 Rust 型別自動生成的，而不是手寫的 JSON。這意味著改了工具的輸入輸出格式，編譯器就會告訴你哪裡壞了。

**agent loop 的耐久性**（`agent` crate）。README 用了「durable, interruptible」這兩個詞。在 v1 裡，中斷一個 agent session 需要在 TypeScript 層面處理。v2 把中斷和恢復做進 loop 本身——session 可以在任何工具呼叫的邊界暫停，之後從同一點繼續。

**campaign 引擎**（`campaign` crate）。這是 v1 完全沒有的。Campaign 讓你定義一批任務，OMP 2 會排程執行，處理失敗重試和結果彙整。實際用途：把 100 個檔案的重構任務拆成一個 campaign，而不是手動 prompt 100 次。

**Mnemopi**（`memory` crate）。跨 session 的長期記憶系統。v1 沒有這個——每次開 session 都從零開始（除非靠外部的 `docs/` 或 AGENTS.md）。

### Shell 層

| Crate | 做什麼 |
|---|---|
| `shell-engine` | 獨立的 Bash parser 與執行引擎 |
| `shell-builtins` | in-process coreutils 與程序內建（不需 fork/exec） |
| `shell` | 引擎與內建的組合外觀 |

v1 vendor 了 [brush](https://github.com/reubeno/brush)（一個 Rust 寫的 bash 實作）。v2 的 `shell-engine` 是自己寫的獨立 Bash parser。差別在哪？brush 的目標是「足夠相容的 bash 替代品」，OMP 2 需要的是「完全控制解析與執行流程的 agent 友善 shell」——比如在每個指令邊界插入斷點、攔截特定模式的輸出、在 shell 內部做 token 計數。自己寫 parser 才能做到這些。

`shell-builtins` 把 `ls`、`cat`、`grep` 等命令做進 process。v1 已經做了這件事（`pi-shell` crate 的 38,000 行），v2 把它拆成獨立 crate，讓 shell 引擎和 builtins 可以各自測試、各自更新。

### 介面層（interface）

| Crate | 做什麼 |
|---|---|
| `tui` | 保持模式的終端機 UI：元件、渲染、輸入、終端機整合 |
| `tui-macros` | `dom!` 程序巨集，用標記語法組裝元件樹 |
| `gui` | GPU 加速的原生視窗，用來承載 omp-tui 應用 |
| `py` | 嵌入式 free-threaded CPython 3.14t，含凍結標準函式庫 |
| `voice-kokoro` | Kokoro-82M 文字轉語音，跑在 candle + Metal 加速上 |
| `chat-ui` / `webview` / `desktop` | 聊天介面、webview 與桌面應用 |
| `exthost` | 外部擴充套件宿主 |

這一層是 v2 最大膽的部分。

**GPU 加速 GUI**。v1 是純 TUI。v2 加了一個 GPU 加速的原生視窗——不是 Electron，不是 Tauri，是直接在 Rust 裡開 GPU 渲染的視窗。`tui-macros` 提供的 `dom!` 巨集讓元件組裝的語法接近 HTML/JSX：

```rust
dom! {
    <panel title="Session">
        <message role={role} content={text} />
    </panel>
}
```

**嵌入式 CPython 3.14t**。`py` crate 把整個 CPython 3.14t（free-threaded 版本）嵌進 binary，含凍結的標準函式庫。這意味著 agent 跑 Python 程式碼不需要系統上有 Python——binary 自帶。free-threaded（`-t` 後綴）代表它移除了 GIL，在多執行緒場景下效能更好。

**Kokoro-82M TTS**。82M 參數的文字轉語音模型，跑在 [candle](https://github.com/huggingface/candle)（Hugging Face 的 Rust ML 框架）上，支援 Metal 加速。語音回饋在長時間 coding session 裡有實際用途——你可以不盯螢幕就知道 agent 在做什麼。但 82M 的模型品質跟商業 TTS 還有差距，這更像是一個技術展示。

## v1 到 v2 的實質差異

| | v1 | v2 |
|---|---|---|
| 定位 | Pi 的 batteries-included fork | 獨立的 Rust codebase |
| 主語言 | TypeScript（+ 80k 行 Rust crate） | Rust（~41 個 crate） |
| 上游關係 | 追蹤 Pi 上游，合併上游改動 | 不依賴 Pi，npm shim 仍存在 |
| Shell | vendor brush bash fork | 自製 shell-engine + shell-builtins |
| 工具系統 | 31 個 TypeScript 工具 + JSON Schema | typed revisioned tool contracts（Rust 編譯時驗證） |
| LSP / DAP | 14 個 LSP op + 28 個 DAP op（binding 層） | docserver crate 原生提供 |
| IPC | 標準 I/O + JSON | gRPC + Protobuf + Unix-socket |
| 儲存 | 檔案系統 | content-addressed blob + append-only 逐字稿 |
| 記憶 | 無跨 session 記憶 | Mnemopi（memory crate） |
| 介面 | TUI | TUI + GPU 加速 GUI + webview + 桌面 |
| Python | 依賴系統安裝 | 嵌入式 CPython 3.14t |
| TTS | pi-voice（音訊擷取播放） | Kokoro-82M on candle |
| 可觀測性 | 無原生支援 | OpenTelemetry（telemetry crate） |
| 批次執行 | 無 | campaign crate |
| 協作 | `/collab` relay | collab crate（原生） |

最值得注意的不是個別功能的增減，而是**系統邊界的改變**。v1 的邊界在 TypeScript 和 Rust 之間——N-API binding 負責跨語言呼叫，兩邊各自有自己的型別系統和錯誤處理。v2 把整個系統放在同一個語言裡，邊界變成 crate 之間的 trait 和型別約束。

## 開發紀律：AGENTS.md 的三條鐵律

OMP 2 的 [AGENTS.md](https://github.com/can1357/oh-my-pi/blob/omp2/AGENTS.md) 對貢獻者（包括 AI agent）定義了三條不可違反的規則：

1. **禁止堆積配置**（No heap allocation）：核心路徑零配置，所有配置走 arena 或 pool
2. **所有 I/O 必須 async**：同步 I/O 阻塞 agent loop 就是 bug
3. **TUI 渲染不准直接寫 stdout**：所有輸出都要經過 tui crate 的 retained-mode 渲染

這三條規則對應了三個 v1 的痛點：TypeScript 的 GC pause 在長 session 裡會干擾 TUI 渲染、同步 shell exec 會凍結整個 agent loop、多個元件同時寫 stdout 會導致輸出交錯。

## E2E 測試：P1 到 P8

OMP 2 的 `e2e` crate 定義了八個優先級的驗收測試：

- **P1**：基本對話、工具呼叫、context 管理
- **P2**：檔案讀寫、hashline 套用
- **P3**：shell 指令執行、in-process builtins
- **P4**：LSP 操作、code navigation
- **P5**：多 session 與 sub-agent
- **P6**：campaign 批次執行
- **P7**：協作與 relay
- **P8**：語音、GUI、桌面整合

這份清單也間接揭示了功能的完成度順序——P1-P3 是基礎，P7-P8 是最後才穩定的部分。

## Pre-release：現在的風險

OMP 2 目前在 `omp2` 分支，還沒有正式的版本號碼或 release。幾個實際風險：

**API 不穩定**。41 個 crate 的公開 API 都還沒有穩定承諾。如果你現在基於 OMP 2 的 SDK 寫整合，下次 pull 可能就壞了。

**生態系統斷裂**。v1 的使用者用的是 npm 套件（`@oh-my-pi/pi-coding-agent`），v2 是 Rust binary。遷移路徑不明。README 裡有一個 `npm/pi-coding-agent` shim，但它的角色（是薄殼轉接還是相容層）還不清楚。

**編譯要求**。pinned nightly Rust toolchain，edition 2024——這意味著穩定版的 `rustc` 編不過。Nightly 的 ABI 和語言特性本身就可能在任何一天改變。

**硬體加速的覆蓋範圍**。GPU GUI 和 Metal 加速的 TTS 在 macOS 上應該能跑，但 Linux 上的 GPU 支援（Vulkan? CUDA?）和 Windows 的情況都還沒有文件。

**單人專案風險**。OMP 的主要開發者是 Can Bölük（[Stencil Labs, Inc.](https://github.com/can1357)），v1 在 8 個月內有 18,392 個 commit。高產量的單人專案意味著維護深度集中在一個人身上。

## 跟 Harness 大戰的脈絡

2026 下半年，幾個 coding harness 同時在做大版本升級：[Pi 推出了 AgentHarness v2 API](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)、[opencode 從 Bun 遷到 Node.js 並重寫桌面版](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)、DeepSeek 發布了官方 coding agent。

OMP 2 的全 Rust 重寫是這批升級裡最激進的——其他人改的是 runtime、API 層或 UI，OMP 2 改的是整個語言和架構。這個賭注成立的前提是：Rust 在 agent 場景下的效能和記憶體控制，值得放棄 TypeScript 生態的靈活性和貢獻者門檻。

[harness 的演化](/posts/ai/2026-03-28-harness-engineering-evolution)一直有兩條路線：一條是在現有框架上堆高，另一條是推倒重來。OMP v1 是第一條路線的極致——在 Pi 上加 80,000 行 Rust。OMP 2 是第二條路線的實踐。從[「模型只是元件，harness 才是系統」](/posts/ai/2026-08-10-model-component-harness-system)的角度看，OMP 2 選擇重寫 harness 而不是換模型，本身就是這個命題的註腳。

## 整體來說

OMP 2 是一個野心很大的專案——把 coding agent 需要的所有基礎設施（shell、LSP、storage、TUI、GUI、TTS、記憶、協作、沙箱、可觀測性）全部用 Rust 從零寫一遍。它不再是 Pi 的 fork，而是一個獨立的系統，帶著自己對「coding harness 應該長什麼樣」的完整主張。

但它也是 pre-release。目前沒有穩定版本、沒有遷移指南、沒有社群驗證。41 個 crate 的維護負擔集中在一個人身上。如果你正在選工具，v1 仍然是可用的——26,400 顆星、MIT 授權、npm 安裝。v2 值得追蹤，但現階段更適合當作「coding harness 設計的參考實作」來讀，而不是今天就切過去的生產工具。

最值得從 OMP 2 帶走的可能不是任何一個 crate，而是它示範的一件事：**當你覺得框架的限制已經不是加東西能解決的，重寫是一個合理的選項——但前提是你真的清楚自己在重寫什麼。** OMP 2 的 41 個 crate 清單至少證明 Can Bölük 知道。

## 參考資料

- [can1357/oh-my-pi — omp2 branch（GitHub）](https://github.com/can1357/oh-my-pi/tree/omp2)
- [omp2 README](https://github.com/can1357/oh-my-pi/blob/omp2/README.md)
- [omp.sh 官方網站](https://omp.sh)
- [The Harness Problem（Can Bölük，2026-02-12）](https://blog.can.ac/2026/02/12/the-harness-problem/)
- [Tower — Rust 的 middleware 抽象（docs.rs）](https://docs.rs/tower/latest/tower/)
- [candle — Hugging Face 的 Rust ML 框架（GitHub）](https://github.com/huggingface/candle)
- [brush-shell — v1 所 vendor 的 Rust bash 實作（GitHub）](https://github.com/reubeno/brush)
- 站內：[omp（Oh My Pi）：把 Pi 的極簡主義翻過來的 batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)
- 站內：[Pi Coding Agent：極簡主義的開源終端機 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
