---
title: "Codex 架構總覽：Rust Monorepo、Bazel 建構、跨平台沙箱"
date: 2026-08-31
category: tech
tags: [codex, rust, bazel, sandbox, architecture, coding-agent]
lang: en
description: "深入解析 OpenAI Codex 的 Rust 單體倉庫架構：Bazel + Cargo 雙建構系統、四大核心 crate 分工、跨平台沙箱抽象層（Seatbelt/Landlock/Windows），以及 exec-server 的遠端執行協議。"
tldr: "Codex 以 Bazel 管理 140+ Rust crate，核心分為 core/tui/exec-server/protocol 四大塊；沙箱用 codex_sandboxing 統一 macOS Seatbelt、Linux Landlock/bwrap、Windows 沙箱三平台介面；exec-server 以 JSON-RPC + Noise Relay 實現遠端執行。"
---

> 🌏 [中文版](/posts/tech/2026-08-31-codex-architecture-overview)

## TL;DR

- **Monorepo**：`MODULE.bazel` 定義 workspace，`rules_rs` 驅動 140+ Cargo crate，支援 8 個目標三元組（macOS/Linux/Windows × MSVC/gnullvm）
- **四大核心 crate**：`core`（業務邏輯）、`tui`（Ratatui 終端機介面）、`exec-server`（子行程管理 JSON-RPC 服務）、`protocol`（內部/外部類型定義）
- **沙箱抽象**：`codex_sandboxing` crate 定義 `SandboxManager`/`SandboxType`，平台具體實作分別在 `seatbelt.rs`/`landlock.rs`/`windows.rs`
- **遠端執行**：`exec-server` 走 WebSocket + Noise Relay，`stream_id` 多工單一連線，`ack` + `ack_bits` 保證可靠傳輸

---

## 情境

你下載 Codex 原始碼（`openai/codex`），想知道：
1. 為什麼用 Bazel 而不直接用 Cargo workspace？
2. 核心 crate 怎麼分工、誰依賴誰？
3. 沙箱怎麼在 macOS/Linux/Windows 三平台跑同樣邏輯？
4. `codex exec-server --remote` 怎麼把本地指令跑到遠端機器？

這篇把「架構地圖」畫給你看，後續各篇會把鏡頭拉近每個子系統。

---

## 問題

Codex 不是單一 binary，而是 **140+ 個 Cargo crate** 組成的巨型 monorepo。直接 `cargo build` 會噴錯，因為：
- 部分 crate 需要夜間版 Rust（`argument-comment-lint` 用 `rustc_private`）
- Windows 同時支援 MSVC 與 gnullvm 兩條 toolchain
- 需要 hermetic LLVM、Apple SDK、Windows SDK 等外部依賴
- 沙箱程式碼在編譯期就要根據 `target_os` 切換實作

這些 Cargo 做不到、或很難做到的事，Bazel 做得很自然。

---

## 嘗試過程

### 1. Bazel Workspace：`MODULE.bazel` 定義全貌

打開 `MODULE.bazel`，前 50 行就看出哲學：

```starlark
module(name = "codex")

# 基礎依賴
bazel_dep(name = "bazel_skylib", version = "1.9.0")
bazel_dep(name = "platforms", version = "1.0.0")
bazel_dep(name = "protobuf", version = "34.0.bcr.1")

# LLVM 工具鏈（含自訂 libc++ patch）
single_version_override(
    module_name = "llvm",
    patches = [
        "//patches:llvm_rusty_v8_custom_libcxx.patch",
        "//patches:llvm_windows_arm64_powl.patch",
    ],
)

# Windows MSVC runtime：需用戶接受 EULA 才啟用
msvc_runtime = use_extension("@windows_support//windows:extensions.bzl", "msvc_runtime")
msvc_runtime.configure(
    architectures = ["x64", "arm64"],
    msvc_version = "14.50.35717",
    ...
)
use_repo(msvc_runtime, "msvc_runtime")

# Apple SDK：從 Apple CDN 下載 CommandLineTools pkg
osx = use_extension("@llvm//extensions:osx.bzl", "osx")
osx.from_archive(
    urls = ["https://swcdn.apple.com/content/downloads/.../CLTools_macOSNMOS_SDK.pkg"],
    sha256 = "...",
)
osx.frameworks(names = ["Foundation", "AppKit", "Metal", ...])
use_repo(osx, "macos_sdk")

# rules_rs：Rust 建構規則核心
bazel_dep(name = "rules_rs", version = "0.0.96")
single_version_override(
    module_name = "rules_rs",
    patches = ["//patches:rules_rs_windows_msvc_linker.patch"],
)
rules_rust = use_extension("@rules_rs//rs:rules_rust.bzl", "rules_rust")
rules_rust.patch(patches = [
    "//patches:rules_rust_windows_msvc_direct_link_args.patch",
])
use_repo(rules_rust, "rules_rust")
```

**關鍵觀察**：
- **Hermeticity**：LLVM、Apple SDK、Windows SDK 都由 Bazel 下載並驗證 sha256，不依賴宿主機環境
- **Patch 管理**：所有 upstream 修補集中在 `patches/` 目錄，`single_version_override` + `patches` 統一套用
- **Platform 矩陣**：`platform_triples` 明確列出 8 個目標（見下文）

### 2. Cargo Workspace：`codex-rs/Cargo.toml` 140+ Members

```toml
[workspace]
members = [
    "core",           # 業務邏輯核心
    "tui",            # Ratatui TUI
    "exec-server",    # 子行程管理服務
    "protocol",       # 內部/外部類型定義
    "sandboxing",     # 跨平台沙箱抽象
    "config",         # TOML + JSON Schema
    "models-manager", # 400+ 模型目錄
    "login",          # 三路徑認證
    "state",          # SQLite 狀態層
    "rollout",        # JSONL 持久化
    "agent-graph-store", # Subagent 圖
    "network-proxy",  # HTTP/SOCKS5 proxy
    "features",       # Feature flags
    "rollout-trace",  # 實驗追蹤
    "otel",           # OpenTelemetry
    # ... 120+ 更多
]
resolver = "2"
edition = "2024"
```

**依賴圖核心路徑**（简化版）：

```
cli
  └── core
       ├── protocol          (純類型，零業務邏輯)
       ├── sandboxing        (沙箱抽象 trait)
       ├── config            (ConfigToml + Loader)
       ├── models-manager    (ModelProviderInfo)
       ├── exec              (Unified Exec)
       ├── tools             (ToolRegistry + Approval)
       ├── mcp               (McpManager)
       ├── session           (TurnContext + StepActivation)
       ├── context           (TokenBudget + Compaction)
       ├── rollout           (EventMsg + JSONL)
       └── state_db_bridge   → state (SQLite)
exec-server
  └── exec-server-protocol  (JSON-RPC 定義)
tui
  └── core
protocol
  └── (無內部依賴)
```

> **注意**：`core` 是最大 crate，`AGENTS.md` 明文規定「**resist adding code to codex-core**」——新功能優先開新 crate。

### 3. 目標平台矩陣：`MODULE.bazel:273-287`

```starlark
crate.from_cargo(
    cargo_lock = "//codex-rs:Cargo.lock",
    cargo_toml = "//codex-rs:Cargo.toml",
    platform_triples = [
        "aarch64-unknown-linux-gnu",
        "aarch64-unknown-linux-musl",
        "aarch64-apple-darwin",
        "aarch64-pc-windows-msvc",
        "aarch64-pc-windows-gnullvm",
        "x86_64-unknown-linux-gnu",
        "x86_64-unknown-linux-musl",
        "x86_64-apple-darwin",
        "x86_64-pc-windows-msvc",
        "x86_64-pc-windows-gnullvm",
    ],
)
```

- **macOS**：僅 `aarch64-apple-darwin` / `x86_64-apple-darwin`（Apple Silicon + Intel）
- **Linux**：`gnu` + `musl` 兩種 libc，支援 ARM64/x86_64
- **Windows**：**雙 ABI** 並存——`msvc`（Visual Studio）與 `gnullvm`（MinGW + LLVM libc++），同架構編兩次

這就是為什麼 `MODULE.bazel` 要註冊兩套 `nightly_rust.repository_set`（一套 MSVC exec、一套 gnullvm target）。

### 4. 四大核心 Crate 職責表

| Crate | 角色 | 關鍵 Public API | 依賴方向 |
|-------|------|----------------|----------|
| `core` | 業務邏輯中樞 | `ThreadManager`、`TurnContext`、`ToolRegistry`、`McpManager`、`CompactTokenBudget`、`Rollout` | 被 `cli`/`tui`/`app-server` 依賴 |
| `tui` | 終端機介面 | `App`（狀態機）、`ChatWidget`、`Composer`、`InlineSelector` | 依賴 `core`、`protocol` |
| `exec-server` | 子行程管理服務 | `ExecServerClient`、`process/start\|read\|write\|terminate` RPC | 依賴 `exec-server-protocol`、`codex-utils-pty` |
| `protocol` | 類型定義庫 | `TurnInput`、`EventMsg`、`ConfigTypes`、`AppServer v2` payload | **零內部依賴**，被所有 crate 依賴 |

`protocol` 故意保持最小——`protocol/README.md` 寫道：「Ideally, we should avoid material business logic in this crate」。

### 5. 沙箱抽象層：`codex_sandboxing` 統一三平台

`core/src/sandboxing/mod.rs` 只是薄包裝，**真正抽象在 `codex-rs/sandboxing/` crate**：

```rust
// sandboxing/src/lib.rs
#[cfg(target_os = "linux")]
mod bwrap;
#[cfg(target_os = "linux")]
pub mod landlock;
#[cfg(target_os = "macos")]
pub mod seatbelt;
mod windows;

pub use manager::SandboxManager;      // 統一入口
pub use manager::SandboxType;         // 枚舉：Seatbelt / Landlock / Bwrap / Windows
pub use manager::get_platform_sandbox; // 平台自動選擇
pub use spawn::spawn_process;         // 統一 spawn 介面
```

**平台實作對照**：

| 平台 | 檔案 | 關鍵機制 |
|------|------|----------|
| macOS | `seatbelt.rs` | `/usr/bin/sandbox-exec` + `.sb` profile，`CODEX_SANDBOX=seatbelt` env 註記 |
| Linux | `landlock.rs` / `bwrap.rs` | Landlock LSM（預設）或 bubblewrap（需要精確可讀根時自動切換） |
| Windows | `windows.rs` | Elevated sandbox（完整隔離）+ Restricted token（非提權）兩條後端 |

`SandboxManager::transform_request()` 根據 `PermissionProfile`（`read-only`/`workspace-write`/自訂根）產出平台特定的 `SandboxExecRequest`，再由 `spawn_process()` 執行。

### 6. Exec Server：本地與遠端同一套協議

`exec-server/README.md` 定義的 JSON-RPC 介面：

```json
// Initialize handshake
{"method": "initialize", "params": {"clientName": "codex-tui"}}
→ {"sessionId": "...", "environmentInfo": {"shell": "bash", "cwd": "file:///workspace"}}

// 啟動子行程
{"method": "process/start", "params": {"processId": "proc-1", "argv": ["bash"], "tty": true}}

// 讀取輸出（長輪詢）
{"method": "process/read", "params": {"processId": "proc-1", "afterSeq": 0, "waitMs": 1000}}

// 寫入 stdin
{"method": "process/write", "params": {"processId": "proc-1", "chunk": "base64(bytes)"}}

// 終止
{"method": "process/terminate", "params": {"processId": "proc-1"}}
```

**遠端模式**（`--remote URL --environment-id ID`）：

```
Harness (本機)                    Registry                    Environment (遠端)
    │                              │                              │
    ├─ register ─────────────────→│                              │
    │←──────── rendezvous WS ──────┤                              │
    │                              ├─ connect (Noise handshake)──→│
    │                              │←────────────────────────────┤
    │                              │                              │
    ├─ RelayMessageFrame(stream_id=uuid, body=handshake) ───────→│
    │←──────────────────────────────────────────────────────────┤
    │                              │                              │
    ├─ process/start (segmented) ──→│                              │
    │←──── process/output (stream) ──│                              │
```

- **Wire framing**：本地 = 1 JSON-RPC/WS frame；遠端 = Noise 加密的 protobuf `RelayMessageFrame`
- **Segmented reliability**：大訊息切段（`segment_index`/`segment_count`），`ack` + `ack_bits` 位元組確認，**不依賴 WS 順序**
- **Forward mode**：Harness 直接連遠端 exec-server，Registry 僅做註冊

---

## 解法

Codex 的架構決策可以歸納為三個原則：

1. **Hermetic builds over convenience** —— Bazel 管理所有工具鏈、SDK、patch，犧牲上手門檻換取可重現建構
2. **Thin protocol crate, fat core crate** —— `protocol` 只放類型，`core` 集中業務邏輯，`AGENTS.md` 以審查機制防止 `core` 無限膨脹
3. **Unified abstraction, platform-specific implementation** —— `codex_sandboxing` 定義 trait，三平台各自實作，上層（`core::sandboxing`、`exec`）只對介面程式

---

## 為什麼會這樣

| 決策 | 根因 |
|------|------|
| Bazel + Cargo 雙軌 | Cargo 無法表達「夜間版 toolchain 只給特定 crate」、「Windows 雙 ABI 並行」、「hermetic LLVM/Apple SDK」 |
| 140+ crate 細粒度 | 強制模組邊界、並行編譯、增量建構快；`core` 過大時被要求拆 crate |
| `protocol` 零邏輯 | 內部（core↔tui）與外部（app-server）共用類型，避免序列化不一致 |
| 沙箱抽象在獨立 crate | `codex_sandboxing` 可被 `exec-server` 獨立使用，不拉入 `core` 重依賴 |
| Noise Relay 自建可靠傳輸 | WebSocket 不保證順序/重傳；`ack` + `ack_bits` 固定大小、無需可變長 ack range |

---

## 學到的事

1. **Monorepo 不等於單一建構工具**——Codex 用 Bazel 做 hermetic workspace、Cargo 做 crate 級依賴解析，兩者各司其職
2. **Protocol crate 是架構穩定器**——把「什麼資料在網路上傳」獨立出來，內部重構不易破壞外部 API
3. **沙箱抽象要切在「政策→執行」邊界**——`PermissionProfile`（政策）→ `SandboxExecRequest`（執行參數）→ 平台實作，中間只傳資料結構
4. **遠端執行的核心是「多工與可靠性」**——`stream_id` 解決多工，`ack`/`ack_bits` 解決可靠，Noise 解決加密，三者正交

---

## 參考資料

- [Codex MODULE.bazel](https://github.com/openai/codex/blob/main/MODULE.bazel) — workspace 定義、toolchain 註冊、patch 管理
- [Codex Cargo.toml](https://github.com/openai/codex/blob/main/codex-rs/Cargo.toml) — 140+ workspace members、dependency aliases
- [codex-core/src/lib.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/lib.rs) — 公共 API 重導出清單
- [codex-sandboxing/src/lib.rs](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/lib.rs) — 跨平台沙箱統一介面
- [exec-server/README.md](https://github.com/openai/codex/blob/main/codex-rs/exec-server/README.md) — JSON-RPC 協議、Noise Relay 格式、遠端模式流程
- [AGENTS.md](https://github.com/openai/codex/blob/main/AGENTS.md) — 程式碼審查規則、core crate 膨脹防護、測試規範