---
title: "為什麼 Python：寫 coding agent 的語言選擇代價與補償"
date: 2026-08-25
category: ai
type: deep-dive
tags: [coding-agent, python, rust, typescript, language-choice, uv, startup-performance]
lang: zh-TW
series:
  name: "跟成熟 coding agent 學設計"
  order: 23
tldr: "五個成熟 coding agent 沒有一家用 Python——pi/opencode/claude-code 用 TypeScript，codex 從 TS 重寫成 Rust，omp 把熱路徑補上 8 萬行 Rust native crate。looplane 仍選 Python，代價是啟動效能與打包，補償手段是 lazy import、uv 和 Cloudflare Sandbox。"
description: "以五個成熟 coding agent 的原始碼為證，分析 coding agent 語言選擇的工程取捨：為什麼主流都選 TS/Rust，looplane 為什麼仍選 Python，以及 lazy import、uv、遠端沙箱三層補償。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-why-python-en)

## 設計問題：寫 coding agent 該選什麼語言

Coding agent 的形狀很尷尬：它是一個使用者每天要開幾十次的 CLI（啟動延遲直接影響體感）、一個長時間掛著的 agent loop（CPU 密集度低、I/O 密集度高）、一團不斷變動的 prompt 與工具邏輯（改動頻率極高），而且重度依賴各家模型 SDK。這四個特性對語言的要求互相打架：CLI 要快、loop 要穩、邏輯要好改、SDK 要齊。沒有任何一門語言四項全贏，所以每個專案的選擇其實都是在回答同一個問題：**你願意為哪一項付出代價？**

## 五家的選擇與遷移史

把 `~/Projects/coding-agent-reference/` 五個 repo 的 manifest 攤開來看，結論非常一致——沒有一家用 Python。

**pi**（badlogic/pi-mono）是 TypeScript/Bun monorepo，核心套件 `pi-mono/packages/coding-agent/package.json` 只有 20 個 runtime dependencies，刻意維持小依賴面。

**opencode**（sst/opencode）同樣是 Bun/TS，但規模完全不同：`opencode/packages/opencode/package.json` 有約 117 個 dependencies，整個 repo 三十多個 package，靠 Effect 這類函式庫硬撐型別紀律。

**claude-code** 更極端：反編譯源 `claude-code-source/package.json` 的 `dependencies` 是空的——整包 bundle 成單檔 JS 發佈，連依賴都不讓你看見。

**codex**（openai/codex）是唯一公開承認換過語言的：早期版本是 Node/TS CLI，後來整個重寫進 `codex/codex-rs/`——現在裡面有近百個 Rust crates（目錄層級含 `Cargo.toml` 者共 96 個）。原本的 npm 套件沒死，但降級成一個安裝器：`codex/codex-cli/bin/codex.js` 的 `PLATFORM_PACKAGE_BY_TARGET` 只負責按平台找出對應的 Rust binary（`@openai/codex-darwin-arm64` 之類），然後 spawn 它。Node 從 runtime 變成了 bootloader。

**omp**（can1357/oh-my-pi，pi 的 fork）走第三條路：TS 核心保留，但把效能敏感的髒活整批下沉到 Rust。`oh-my-pi/Cargo.toml` 定義了六個 `pi-*` workspace crates 加一個 vendored bash engine，README 自己給了數字：「~80,000 lines of Rust」，shell、grep、AST、PTY 全部編成一個 N-API addon 掛回去，熱路徑上不再 fork/exec。值得注意的是它沒有放棄 TS 上游——`docs/porting-from-pi-mono.md` 是一份持續維護的「如何從 pi-mono 同步」手冊，最近同步點標到 2026-03。

三種策略：pi 押注小而美的 TS；codex 直接重寫；omp 用 Rust native crate 補洞但不搬家。共同點是——**沒有人覺得 Python 值得一試**。原因不難猜：模型 API 不過是 HTTP + JSON，任何語言都能做；而 CLI 啟動速度和單檔發佈恰恰是 Python 最弱的兩項。

## looplane 的選擇與差異

looplane 選了 Python，而且是知道代價之後選的。

理由有三。第一，AI 生態系確實長在 Python 這邊：evals 工具、模型 SDK、資料處理腳本的預設語言都是它，`pyproject.toml` 裡 `openai>=1.68.0` 一行就接好整個 OpenAI 相容世界。第二，開發速度——agent 的 prompt 與工具邏輯每週都在改，Python 的改寫迴路最短。第三，個人專案的可維護性：6 個 runtime dependencies（對照 opencode 的 117 個），一個人讀得完自己的供應鏈。

代價也很誠實。**啟動效能**：2026-08-22 實測 `.venv/bin/python -c "import looplane.cli"` 要 701ms，TUI 還沒出現就燒掉了；`python -X importtime` 顯示最大元兇是頂層 eager import 的 openai SDK（247ms）。**發佈打包**：TS 可以 bundle 成單檔（claude-code 就是這樣），Rust 出靜態 binary，Python 得帶著直譯器和虛擬環境走，使用者機器上有沒有合適的 Python 是個真問題。

補償分三層。第一層 lazy import：`src/looplane/cli.py` 頂部現在明確註記重模組（provider SDK、vendor backend、Textual、uvicorn）全部延遲載入，型別用 `TYPE_CHECKING` guard，光此項預期砍掉 300–400ms。第二層 uv：開發與測試全走 `uv run`，環境建立從分鐘級降到秒級。第三層 Cloudflare Sandbox：M6 設計把整個 Python `AgentRunner` 放進一次性 Sandbox 裡跑（`docs/research/m6-cloudflare-sandbox-design.md`），Worker 只負責驗證與 teardown——本地直譯器版本問題被「根本不在使用者機器上跑」直接繞掉。

## 工程依據

「Python 慢」這件事需要拆開看。[uv 的官方文件](https://docs.astral.sh/uv/)把 Python 工具鏈最痛的環境管理做成了 Rust 級速度，這代表生態系自己已經在補這個洞——慢的往往不是執行期，是工具鏈。啟動延遲的部分，[CPython 的 `-X importtime`](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime) 是官方提供的診斷入口，looplane 的 701ms 幾乎全是 import 成本而非 interpreter 冷啟動（裸直譯器啟動只有幾十毫秒）。

更有說服力的反例來自 codex 本身。依 looplane 內部的 startup-performance-playbook 紀錄，Codex CLI 0.148.0 的啟動加速優化全在流程層——憑證讀取加速、plugin discovery 快取、並行探索——單一 PR（openai/codex#26469）就把 TUI 中位數啟動從 833ms 做到 504ms。Codex 本來就是 Rust，慢的不是語言，是 life cycle 設計。這對 Python 專案是好消息：既然流程層優化能救 Rust，也能救 Python。

## 改善路線

1. **固化 benchmark**：照 playbook 行動清單加 `scripts/bench_startup.sh`，hyperfine paired median，CI 加 >10% 退步閘門。
2. **完成 lazy import 盤點**：M13 外接 OpenCode/Pi/OMP adapter 時不得擴大共同啟動成本，新 adapter 一律子命令觸發才 import。
3. **發佈形式實驗**：評估 `uv tool install` 與 PyInstaller 單檔兩條路，目標是使用者不需要自己管 Python 版本。
4. **熱路徑下沉的界線**：學 omp 而不學 codex——如果未來真的有 CPU 密集需求（例如大規模 AST 比對），先考慮單點 Rust extension 或 vendored binary，而不是整套重寫。80k 行 Rust 是一個團隊的產出，不是個人專案的選項。

語言選擇的最終判準不是 benchmark 排行榜，而是「你的瓶頸到底在哪」。五家用 TS/Rust 是因為他們的瓶頸在散發給百萬使用者的啟動體感；looplane 用 Python 是因為它的瓶頸在一個人能否持續迭代一個複雜系統。誠實列出代價、逐項補償，比選對語言更重要。

## 參考資料

- [uv 官方文件（Astral）](https://docs.astral.sh/uv/)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [napi-rs：Rust ↔ Node N-API 框架](https://napi.rs/)
- [CPython 命令列文件：-X importtime](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime)
