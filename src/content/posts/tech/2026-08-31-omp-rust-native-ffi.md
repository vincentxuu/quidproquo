---
title: "OMP 內部設計導讀 12：Rust Native Crate 與 FFI 契約"
date: 2026-08-31
category: tech
type: deep-dive
tags: ["omp", "rust", "napi", "ffi", "native-binding", "architecture"]
lang: zh-TW
description: "深入解析 OMP 為什麼將 grep、shell、AST、walker 做成 Rust crate，以及 N-API binding 契約如何設計"
tldr: "OMP 將效能敏感、正確性要求高、需確定性的子系統（grep、AST、PTY、隔離、檔案走訪）下沉到 6 個 Rust crate，再透過 pi-natives 統一暴露 N-API 介面；binding 契約由 napi-rs 自動生成 TS 宣告，再經 gen-enums.ts 產出 runtime enum 物件與顯式 ESM exports。"
series:
  name: "OMP 內部設計導讀"
  order: 12
---

## TL;DR

OMP 把 **grep、AST matching、shell/PTY、檔案走訪、隔離、語音** 等子系統寫成 6 個獨立 Rust crate（`pi-ast`、`pi-natives`、`pi-walker`、`pi-shell`、`pi-iso`、`pi-voice`），再由 `pi-natives` 這個 **N-API cdylib** 統一對外暴露 JavaScript 介面。

- **為什麼要 Rust**：grep/AST 需要原生效能；shell/PTY 需要正確的行程控制與訊號處理；hashline/隔離需要確定性的跨平台行為。
- **N-API 契約**：Rust 端用 `#[napi]` 宏標註公開項 → `bun run build:bindings` 跑 napi-rs 產出 `index.d.ts` + `.node` → `gen-enums.ts` 將 `const enum` 改寫成 runtime 物件、產出顯式 ESM exports → 發佈時由 Bazel 交叉編譯多平台 `.node`、打包成 optional dependency leaf packages。
- **WASM fallback**：`pi-iso` 在無原生後端時退回 recursive copy（`Rcopy`），同一套 Rust 程式碼也能編譯成 WASM 供瀏覽器/edge runtime 使用。

---

## 情境

OMP（oh-my-pi）是一個 AI coding agent 的核心工具鏈，包含：

- **文本搜尋**：ripgrep 級別的 regex 搜尋、fuzzy find、glob
- **程式碼結構**：tree-sitter / ast-grep 的語法感知搜尋、編輯、摘要
- **終端機操作**：嵌入式 shell（brush）、PTY session、行程管理
- **檔案系統**：平行走訪、ignore 規則、掃描快取
- **隔離環境**：APFS clone / Linux overlayfs / Windows ProjFS / git worktree fallback
- **語音**：麥克風擷取、播放、WebRTC live conversation

這些能力在 **Node.js / Bun** 的主執行緒呼叫，但 JavaScript 絕對不適合直接實作上述任何一項。OMP 的解法是：**把核心子系統下沉到 Rust crate，再用 N-API 橋接**。

---

## 問題

1. **效能**：JS 正則引擎、檔案系統同步 API、樹走訪都太慢；大型專案 grep / AST 掃描需秒級完成。
2. **正確性**：shell 需要精確的訊號傳遞、行程群組管理、PTY 主從端協調；JS 的 `child_process` 抽象層太薄、行為不一致。
3. **確定性**：hashline（內容定址）、隔離（copy-on-write 複製）需要跨平台位元級一致的行為。
4. **發佈體驗**：使用者 `npm install` 就能用，不想裝 Rust toolchain、不想編譯、要支援 Linux/macOS/Windows x64/arm64、要有 AVX2/baseline 兩種 CPU variant。

---

## 嘗試過程

### 早期：全部塞進一個 crate

最初 `pi-natives` 既包含 N-API binding、又包含所有演算法。缺點：

- 編譯時間極長（單一巨大 crate）
- 無法獨立測試子系統（grep、walker、shell 互相纏繞）
- 跨平台條件編譯散落各處，難以維護

### 拆分 crate 後的架構

```
@oh-my-pi/pi-natives (JS entrypoint)
       │
       ▼
crates/pi-natives (N-API cdylib, 只負責 binding 轉換、平台適配)
       │
       ├─► pi-ast         # tree-sitter registry, ast-grep matching/edit/summary
       ├─► pi-walker      # 平行檔案走訪、ignore、快取、glob/fuzzy 候選源
       ├─► pi-shell       # brush shell 執行、行程管道、minimizer、in-process builtins
       ├─► pi-builtins    # 內建指令：grep/rg/fd/ls/find/jq/sed/...（uutils port）
       ├─► pi-iso         # 隔離後端：APFS/overlayfs/ProjFS/Rcopy + diff
       └─► pi-voice       # 音訊擷取/播放、Opus/WebRTC peer
```

每個 crate 都是**獨立的 `rlib`**，只輸出 Rust API，不依賴 N-API。`pi-natives` 負責把它們組裝成 `cdylib`。

---

## 解法

### 6 大 crate 職責與介面

| Crate | 核心職責 | 對外 Rust API 重點 | N-API 公開面 |
|-------|----------|-------------------|--------------|
| `pi-ast` | 語言註冊、parsing cache、ast-grep matching/edit/summary | `SupportLang`、`parse_with_cache`、`ast_grep`/`ast_edit`/`summarize_code` | `astGrep`、`astMatch`、`astEdit`、`summarizeCode` |
| `pi-walker` | 平行目錄走訪、ignore、globset、快取、heartbeat 取消 | `WalkRequest`、`WalkOptions`、`WalkFilter`、`collect`/`stream`/`for_each_file_candidate_parallel` | 透過 `pi-natives` 的 `glob`/`fd`/`astGrep` 間接使用 |
| `pi-shell` | brush shell 執行、取消 token、行程管道、in-process builtin 註冊 | `Shell`、`execute_shell`、`CancelToken`、`Utility` trait、`Host` view | `executeShell`、`Shell` class、`PtySession` |
| `pi-builtins` | 內建指令實作（grep/rg/fd/ls/find/jq/...），`Utility` trait | `utility_builtins()`、`process_builtins()`、`Host` trait | 由 `pi-shell` 註冊，JS 不直接呼叫 |
| `pi-iso` | 隔離後端抽象、probe/resolve/start/stop/diff | `IsolationBackend` trait、`BackendKind`、`resolve()`、`default_backend()` | `isoBackend`、`isoProbe`、`isoResolve`、`isoStart`/`isoStop`/`isoDiff` |
| `pi-voice` | OS 音訊後端、Opus/WebRTC、callback-based live peer | `AudioCapture`/`AudioPlayback`、`LivePeerCore`、`LiveCallbacks` | `AudioCapture`/`AudioPlayback`/`LiveWebRtcPeer` class |

> **關鍵設計**：`pi-natives` **不包含演算法**，只做 N-API 轉換、平台適配、取消橋接、runtime 安裝。這樣 Rust crate 可被非 N-API 消費者（CLI、WASM、測試）直接使用。

### N-API Binding 契約怎麼寫

#### 1. Rust 端：`#[napi]` 宏標註

```rust
// crates/pi-natives/src/grep.rs
#[napi]
pub struct GrepOptions {
    pub pattern: String,
    pub path: Option<String>,
    pub ignore_case: Option<bool>,
    pub max_count: Option<u32>,
    pub max_count_per_file: Option<u32>,
    pub context_before: Option<u32>,
    pub context_after: Option<u32>,
    pub timeout_ms: Option<u32>,
    pub signal: Option<AbortSignal>,
}

#[napi]
pub async fn grep(options: GrepOptions, on_match: Option<ThreadsafeFunction<GrepMatch>>) -> GrepResult { ... }
```

- **命名轉換**：Rust snake_case → JS camelCase（自動）
- **類型映射**：`Option<T>` → `T | undefined`、`Vec<T>` → `T[]`、`String` → `string`、`u32` → `number`
- **非同步**：`async fn` → 回傳 `Promise<T>`（napi-rs 用 `Task` 在 libuv worker 執行）
- **串流 callback**：`ThreadsafeFunction<T>` → JS callback `(match) => void`

#### 2. 產生 bindings：`bun run build:bindings`

```bash
# packages/natives/scripts/build-bindings.ts
napi build \
  --manifest-path crates/pi-natives/Cargo.toml \
  --package-json-path packages/natives/package.json \
  --platform --no-js --dts index.d.ts \
  -o <build-output-dir> \
  --profile local
```

產出：
- `index.d.ts`：TypeScript 宣告（含 `const enum`、介面、類別）
- `.node`：原生 addon（放入 `packages/natives/native/`）

#### 3. `gen-enums.ts`：修補 runtime enum 與 ESM exports

napi-rs 產出的 `const enum` 是 **TypeScript only**，JS runtime 沒有值。`gen-enums.ts` 做兩件事：

1. **把 `const enum` 改寫成 runtime 物件**：
   ```ts
   // index.d.ts 原本：export declare const enum GrepOutputMode { Content = "content", ... }
   // 改寫後：export declare enum GrepOutputMode { Content = "content", ... }
   ```
2. **產出顯式 ESM exports**（`native/index.js` 的 marker block 之間）：
   ```js
   // --- generated native exports (do not edit) ---
   // classes
   export const GrepResult = nativeBindings.GrepResult;
   export const Shell = nativeBindings.Shell;
   // functions
   export const grep = nativeBindings.grep;
   export const executeShell = nativeBindings.executeShell;
   // string/numeric enums
   export const GrepOutputMode = { Content: "content", Count: "count", ... };
   // --- end generated native exports ---
   ```

> 為什麼要顯式 ESM exports？因為消費者 `import { grep } from '@oh-my-pi/pi-natives'` 期望 named export，而 napi-rs 的動態載入器回傳的是物件，需手動綁定。

#### 4. 發佈流程：Bazel 交叉編譯 + leaf packages

```
scripts/bazel-natives.ts linux-x64-modern linux-x64-baseline darwin-arm64 ...
       │
       ▼
//:natives-<target> (native_addon rule)
//   └─ rust_shared_library + 配置 transition (LTO, target-cpu, strip)
       │
       ▼
pi_natives.<platform>-<arch>[-variant].node
       │
       ▼
gen-npm-packages.ts → @oh-my-pi/pi-natives-<platform>-<arch> (optional dependency)
```

- **x64 兩種 variant**：`modern` (AVX2, x86-64-v3) / `baseline` (x86-64-v2)
- **musl/gnu 共用檔名**：CI 分開建構、分開安裝目錄
- **Windows MSVC static CRT**：`+crt-static` + `static_link_msvc`，無 VC++ Redistributable 相依
- **載入器**（`loader-state.js`）：platform tag → variant detection → candidate 排序 → sentinel 版本驗證 → 載入 → `__ompInstallTokioRuntime()` 安裝 bounded Tokio/Rayon pool

### 為什麼這 6 個子系統「非 Rust 不可」

#### grep / AST / fuzzy find：原生效能 + 確定性

- **regex 引擎**：Rust `regex` + `pcre2` fallback，JIT 可控（`OMP_PCRE2_JIT`）
- **平行走訪**：`pi-walker` 用 Rayon 平行化、自訂 heartbeat 取消、`globset` 編譯下推到 walker 端
- **記憶體控制**：大檔案只讀前 4 MiB（`read_owned_prefix`）、不 mmap、避免 page fault
- **AST**：tree-sitter grammar 靜態連結、parse cache 跨請求復用、ast-grep pattern matching 零拷貝

> JS 替代方案：`ripgrep` CLI 落地、解析 stdout → 啟動開銷大、難以串流、無法整合取消 token。

#### shell / PTY：正確的行程控制

- **brush shell**：純 Rust 實作的 POSIX shell（parser、expansion、interpreter），內建指令註冊可控
- **in-process builtins**：`grep`/`rg`/`fd`/`ls`/`find`/`jq`... 直接在 shell 行程內執行，**無 fork/exec**，stdio 導向 pipe、cwd 同步、環境變數隔離、取消 token 直達
- **PTY**：`portable_pty` 抽象跨平台差異、ConPTY (Windows) / pseudotty (Unix)、專屬 reader thread + UTF-8 增量解碼、resize/kill 走 control channel
- **取消語義**：`timeoutMs` + `AbortSignal` → `CancelToken` → shell 觸發 Tokio cancellation token → 送 TERM/KILL 訊號波 → 2s grace window → 強制 abort

> JS `child_process.spawn` 無法：精確控制行程群組、in-process builtin、統一取消模型、PTY 尺寸同步。

#### walker / isolation / hashline：跨平台確定性

- **`pi-walker` 快取**：key = canonical root + 完整 `WalkOptions`（含 `follow_links`、`detail`、`gitignore`...），TTL 1s、max 16 entries、stale-empty recheck
- **`pi-iso` 後端優先序**：macOS `Apfs` → `Zfs` → `Rcopy`；Linux `Btrfs` → `Zfs` → `LinuxReflink` → `Overlayfs` → `Rcopy`；Windows `WindowsBlockClone` → `Projfs` → `Rcopy`
- **diff 委派 git**：`merged` 是 git repo 時直接 `git diff`，byte-identical 給 `git apply`；非 git 才走 `(size, mtime)` → content compare
- **WASM fallback**：`pi-iso` 的 `Rcopy` 後端純 Rust、無平台 syscall，**可編譯成 WASM**，瀏覽器/edge runtime 也能跑隔離邏輯

---

## 為什麼會這樣

### 架構決策的背後邏輯

| 決策 | 理由 |
|------|------|
| **分 crate** | 單一職責、獨立編譯/測試、避免循環相依、支援 WASM/CLI 復用 |
| **`pi-natives` 只做 binding** | 減少 N-API 表面積、編譯快、runtime 初始化可控（Windows commit limit 問題） |
| **napi-rs + 手動 gen-enums** | napi-rs 處理參數/回傳轉換、async task、ThreadsafeFunction；gen-enums 處理 TS-only enum 與 ESM export 這兩個 napi-rs 不解決的問題 |
| **Bazel 交叉編譯** | hermetic toolchain（zig cc / xwin / Xcode）、musl/gnu 雙支援、static CRT、cache-friendly |
| **loader sentinel + variant detection** | 避免 Windows 檔案鎖定導致更新失敗、AVX2 自動偵測、compiled mode embedded addon |
| **取消模型雙軌** | blocking API 用 `heartbeat()` 回傳錯誤；shell/PTY 用 typed result（`cancelled`/`timedOut` flag） |

### 避開的坑

1. **Windows thread commit limit**：`module_init` 不能 spawn thread，載入器 post-load 才裝 Tokio/Rayon pool，並用 `std::thread::Builder::spawn` 預先探測可生成幾條 thread
2. **musl/gnu basename 衝突**：刻意共用檔名、CI 分開建構、loader 不會同時看到兩者
3. **`const enum` 無 runtime 值**：gen-enums.ts 強制產出 literal object
4. **cache key 過度分區**：`WalkOptions` 完整參與 key（含 `cache` flag 以外），避免不同 policy 共用舊掃描結果
5. **in-process builtin 影子系統指令**：用 env var 可關閉（`PI_DISABLE_UUTILS_BUILTINS` 等），避免破壞使用者預期

---

## 學到的事

1. **N-API 契約要「生成」不要「手寫」**：`#[napi]` + napi-rs 保證類型對齊、async 橋接正確、ThreadsafeFunction 安全。手寫 binding 會隨版本漂移。
2. **把「演算法」與「邊界」分開**：Rust crate 輸出純 Rust API，N-API 層只做轉換。這樣 crate 可被 WASM、CLI、測試直接用，binding 變動不影響核心。
3. **跨平台原生行為要有「可測試的 fallback」**：`pi-iso` 的 `Rcopy` 後端既是 fallback、又是 WASM 目標、也是 CI 驗證基準。
4. **發佈管道要吃得下「多平台 + 多 variant」**：Bazel transition + leaf package 模式解決了 `optionalDependencies` 機制與 CPU variant 的組合爆炸。
5. **取消語義要在 API 合約裡講清楚**：blocking 用 exception、async command 用 typed flag，不要混用，消費者才能正確處理。

---

## 參考資料

- [OMP 原始碼：crates/pi-natives](https://github.com/can1357/oh-my-pi/tree/main/crates/pi-natives)
- [OMP 原始碼：packages/natives](https://github.com/can1357/oh-my-pi/tree/main/packages/natives)
- [native-crates.md](https://github.com/can1357/oh-my-pi/blob/main/docs/native-crates.md)
- [natives-architecture.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-architecture.md)
- [natives-binding-contract.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-binding-contract.md)
- [natives-build-release-debugging.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-build-release-debugging.md)
- [natives-shell-pty-process.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-shell-pty-process.md)
- [natives-text-search-pipeline.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-text-search-pipeline.md)
- [fs-scan-cache-architecture.md](https://github.com/can1357/oh-my-pi/blob/main/docs/fs-scan-cache-architecture.md)
- [natives-rust-task-cancellation.md](https://github.com/can1357/oh-my-pi/blob/main/docs/natives-rust-task-cancellation.md)
- [napi-rs 文件](https://napi.rs/)
- [Bazel rules_rust](https://github.com/bazelbuild/rules_rust)