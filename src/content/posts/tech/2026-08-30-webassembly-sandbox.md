---
title: "WebAssembly 沙箱：Wasmtime、WasmEdge、Wasmer 與 Pyodide"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, wasm, webassembly, wasmtime, wasmedge, wasmer, ai-agent]
lang: zh-TW
tldr: "WebAssembly 沙箱是比容器更輕、比 microVM 更快的第四層隔離選項。Wasmtime、WasmEdge、Wasmer 三大 runtime 的 2026 年狀態、與 Pyodide 的 Python 執行，以及適用場景與限制。"
description: "拆解 WebAssembly 沙箱在 AI agent 執行中的定位：capability-based 安全模型、單數毫秒冷啟動、與容器/microVM 的比較，以及 Wasmtime、WasmEdge、Wasmer 三大 runtime 的取捨。"
series:
  name: "沙箱系列"
  order: 4
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-webassembly-sandbox-en)

## 為什麼需要第四層隔離

前三層隔離（容器、gVisor、microVM）各有優勢，但都有共同的痛點：啟動慢、記憶體開銷大、作業系統相容性複雜。對於 AI agent 執行大量短命的程式碼片段（tool call、code interpreter、MCP server），這些開銷往往超過執行本身的成本。

WebAssembly（Wasm）提供第四層選項：**比容器更輕、比 microVM 更快、無需作業系統核心、capability-based 安全模型**。對於 agent 生成的代理程式碼執行，Wasm 沙箱的單數毫秒冷啟動與細粒度權限控制，是容器與 microVM 無法比擬的。

---

## Wasm 沙箱的安全模型

Wasm 的安全基於兩個設計：

### 1. 嚴格的沙箱記憶體模型

Wasm 模組只能訪問自己的線性記憶，無法直接讀寫主機記憶或其他模組的記憶。這消除了整個類別的記憶損壞漏洞（buffer overflow、use-after-free 等）。

```
┌─────────────────────────────────────┐
│           Host Memory               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ Wasm Module │  │ Wasm Module │  │
│  │   Memory A  │  │   Memory B  │  │
│  │   (isolated)│  │   (isolated)│  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
        ▲              ▲
        │              │
    Cannot access    Cannot access
    each other's     host memory
```

### 2. Capability-based 存取控制

Wasm 模組預設無法訪問檔案系統、網路、環境變數或子行程。所有與主機的互動必須透過「匯入函數」（import functions）顯式授權。主機決定要給哪些 capability，模組無法越權。

這意味著：**沒有顯式授權的權限，根本不存在。** 這與容器的「預設允許、後來收緊」模型形成鮮明對比。

---

## 程式碼範例：Wasmtime 執行 Wasm 模組

以下是一個使用 Wasmtime Rust SDK 執行 Wasm 模組的範例，展示如何限制模組只能存取特定目錄：

```rust
use wasmtime::*;
use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 建立引擎與存儲
    let engine = Engine::default();
    let mut store = Store::new(&engine, ());

    // 編譯 Wasm 模組
    let module = Module::from_file(&engine, "agent_code.wasm")?;

    // 建立 Wasi 虛擬文件系統，只允許存取 /tmp/sandbox
    let mut ctx = WasiCtxBuilder::new()
        .inherit_stdio()
        .preopened_dir("/tmp/sandbox", "/workspace")?
        .build();

    let mut linker = Linker::new(&engine);
    wasmtime_wasi::add_to_linker(&mut linker, |s| s)?;

    // 實例化模組
    let instance = linker.instantiate(&mut store, &module)?;

    // 執行 _start 函數
    let start = instance.get_typed_func::<(), ()>(&mut store, "_start")?;
    start.call(&mut store, ())?;

    Ok(())
}
```

關鍵點：`preopened_dir("/tmp/sandbox", "/workspace")` 明確授權模組只能存取 `/tmp/sandbox` 目錄，映射為模組內的 `/workspace`。模組無法訪問其他路徑。

---

## 三大 Runtime：Wasmtime、WasmEdge、Wasmer

| Runtime | 語言 | 冷啟動 | 記憶體開銷 | 特色 | 適用場景 |
|---------|------|--------|------------|------|----------|
| **Wasmtime** | Rust | 5–10 ms | < 1 MB | Bytecode Alliance 主導，Component Model 支援最完整，WASI Preview 2 實作最穩定 | Rust 生態、需要元件模型的複雜 agent 工作流 |
| **WasmEdge** | C++ | 3–8 ms | < 1 MB | CNCF 成員，對 AI 推理與 Pyodide 整合優異，異步 I/O 支援良好 | 邊緣設備、本地 AI agent、Python 代碼執行 |
| **Wasmer** | Rust | 8–15 ms | < 1 MB | 支援多語言 SDK（Python, Node.js, PHP, Postgres），可嵌入到應用程式庫中 | 需要嵌入式沙箱的應用、跨語言代碼執行 |

### Wasmtime：標準與元件模型的領導者

Wasmtime 由 Bytecode Alliance 開發，是 WebAssembly 標準的參考實作之一。其 Component Model 允許將 Wasm 模組組裝成更複雜的應用，每個元件有明確的界面合約（WIT）。對於 agent 沙箱，這意味著可以定義「這個 agent 只能呼叫這些函數」的嚴格契約。

Wasmtime 的 WASI Preview 2 支援非同步 I/O，解決了早期 Wasm 無法做網路請求的限制，讓 agent 在沙箱內執行需要網路的任務成為可能。

**基準數據（2026 年）**：
- 冷啟動：5–10 ms
- 記憶體開銷：< 1 MB/實例
- 併發實例：單一主機可運行數千個 Wasmtime 實例

### WasmEdge：AI 與邊緣的優選

WasmEdge 是 CNCF 沙箱項目，針對 AI 推理與邊緣計算優化。它對 Pyodide（Python 在 Wasm 中的實作）整合良好，讓 agent 可以在沙箱內執行 Python 程式碼，同時保持單數毫秒的啟動時間。WasmEdge 的異步 I/O 支援也使其適合需要網路存取的 agent 工作流。

**Pyodide 在 WasmEdge 中的範例**：
```python
# 在 WasmEdge 沙箱內執行的 Python 代碼
import pyodide
import json

def agent_task(data):
    # 僅能存取沙箱內的檔案系統
    result = {"status": "ok", "processed": len(data)}
    return json.dumps(result)
```

### Wasmer：嵌入式沙箱的靈活選擇

Wasmer 的定位是「讓 Wasm 沙箱成為庫（library）」，可以嵌入到 Python、Node.js、PHP 甚至 PostgreSQL 應用程式中。對於需要在現有應用內直接執行 agent 代碼的場景，Wasmer 提供了最靈活的嵌入模型。

```python
# Wasmer Python SDK 範例
from wasmer import engine, Store, Module, Instance, ImportObject

store = Store()
module = Module.from_file(store.engine, "agent.wasm")
import_obj = ImportObject()  # 只授權需要的能力
instance = Instance.new(&module, &import_obj)
result = instance.exports["run"]()
```

---

## 與容器 / microVM 的比較

| 維度 | 容器 (Docker) | gVisor | Firecracker microVM | WebAssembly |
|------|--------------|--------|---------------------|-------------|
| 冷啟動 | 1–5 秒 | 100–300 ms | 125 ms | 3–15 ms |
| 記憶體開銷 | ~50–100 MB | ~10–30 MB 額外 | ~5–128 MB | < 1 MB |
| 隔離強度 | 弱（共享核心） | 中（使用者態核心） | 強（硬體虛擬化） | 強（capability-based） |
| 作業系統相容性 | 完整 | 高（但非 100%） | 完整 | 受限（WASI） |
| 語言支援 | 任意 | 任意 | 任意 | Wasm 編譯語言 |
| 網路存取 | 預設允許 | 預設允許 | 預設允許 | 預設拒絕（需顯式授權） |

**關鍵差異**：Wasm 的隔離不依賴作業系統核心或硬體虛擬化，而是靠編譯時的型別檢查與執行時的 capability 檢查。這使其啟動極快、記憶體極省，但限制是只能執行編譯為 Wasm 的語言（Rust、C/C++、Go、Python via Pyodide 等），且對檔案系統與網路的存取需要顯式授權。

---

## 適用場景：什麼時候用 Wasm 沙箱

### 適合 Wasm 沙箱

1. **Agent 執行大量短命的代理程式碼片段**（每次 <1 秒）
   - Tool call、code interpreter、MCP server 執行
   - 每次執行都需要獨立沙箱，冷啟動必須極快

2. **需要單數毫秒冷啟動的互動式 agent 工具**
   - 即時程式碼補全、即時測試、即時驗證
   - 使用者等待容忍度低

3. **代碼語言可編譯為 Wasm**
   - Rust、Go、C/C++、Python via Pyodide
   - 語言生態有成熟 Wasm 編譯目標

4. **權限模型需要「預設拒絕、顯式授權」**
   - 零信任架構，沒有顯式授權的權限不存在

5. **記憶體與啟動成本是關鍵考量**
   - 邊緣設備、大規模併發、成本敏感場景

### 不適合 Wasm 沙箱

1. **需要完整作業系統環境**
   - 安裝 apt/yum 套件、運行資料庫、編譯複雜專案
   - Wasm 沒有完整的作業系統介面

2. **需要長時間運行的持久會話**
   - Wasm 更適合短命執行，狀態保留需要額外設計

3. **需要直接存取硬體**
   - GPU 直通、專用設備、底層核心功能
   - 需要 microVM 或容器

4. **語言生態尚未有成熟 Wasm 編譯目標**
   - Java、.NET 等運行時依賴較重的語言

---

## 限制與注意事項

### 1. WASI 仍在演進

檔案系統、網路、時鐘等系統調用的標準化程度低於 POSIX，某些功能可能無法直接使用。WASI Preview 2 已改善許多限制，但仍有缺口。

### 2. 語言限制

不是所有語言都有成熟的 Wasm 編譯目標。Java、.NET 等運行時依賴較重的語言，在 Wasm 中的支援仍有限。對於需要這些語言的場景，容器或 microVM 更合適。

### 3. Host-function 表面需要審計

Wasm 模組通過匯入函數與主機互動，主機提供的 host-function 本身可能成為攻擊面。需要仔細審查暴露給 Wasm 模組的 API，避免暴露過多權限。

### 4. 敵對多租戶需謹慎

Wasmtime 等 runtime 的 VMM 編譯器或 WASI 層若有漏洞，可能導致同主機逃逸。對於敵對多租戶場景（例如公有雲代碼執行服務），microVM 仍是更安全的底線。Wasm 更適合單租戶或準信任場景。

---

## 讀完本文你應該理解

1. Wasm 沙箱的安全模型：嚴格記憶體隔離 + capability-based 存取控制。
2. 三大 runtime 的取捨：Wasmtime（標準與元件模型）、WasmEdge（AI 與邊緣）、Wasmer（嵌入式靈活性）。
3. 與容器 / microVM 的比較：啟動速度、記憶體開銷、隔離強度、語言相容性。
4. 什麼時候選 Wasm 沙箱，什麼時候還是該用容器或 microVM。
5. Wasm 沙箱的限制：WASI 演進狀態、語言限制、host-function 審計、敵對多租戶風險。

---

## 參考資料

- [WebAssembly Security Model](https://webassembly.org/docs/security/)
- [Wasmtime Security](https://docs.wasmtime.dev/security/)
- [WasmEdge Documentation](https://wasmedge.org/)
- [Wasmer SDK: Local Sandboxes for AI Agents](https://wasmer.io/posts/wasmer-local-sandboxes-for-ai-agents)
- [NVIDIA: Sandboxing Agentic AI Workflows with WebAssembly](https://developer.nvidia.com/blog/sandboxing-agentic-ai-workflows-with-webassembly)
- [Cosmonic: Sandboxing AI-Agent Code - Containers vs microVMs vs Wasm](https://cosmonic.com/ai-sandbox/compare)
- [Zylos Research: AI Agent Sandboxing and Security Isolation](https://zylos.ai/research/2026-04-04-ai-agent-sandboxing-security-isolation)
- [本站：沙箱四大支柱與隔離光譜（order 2）](/posts/tech/2026-08-30-execution-environment-sandbox-comparison)
