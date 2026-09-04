---
title: "跟成熟 coding agent 學設計（17）：啟動效能與工程紀律——慢的從來不是語言"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 17
tags: [coding-agent, startup-performance, looplane, hyperfine, lazy-import, benchmark]
lang: zh-TW
tldr: "CLI 工具每次叫用都要付一次啟動成本，而沒有 baseline 的效能優化等於沒有回歸保護。codex 用 daemon 重用與 skill snapshot 快取、claude-code 把入口切成七十個動態 import 加上內建啟動 profiler、opencode/omp 各有 lazy 載入紀律；pi 則什麼都沒做，靠 Bun 的速度快撐著。looplane 是 Python，天生慢，所以把紀律做滿：lazy import、單飛磁碟快取、背景預熱 controller、hyperfine paired benchmark 加上 CI 大於 10% 退步就擋 merge。"
description: "對照 codex、claude-code、opencode、pi、omp 五家的啟動效能處理原始碼，說明 Python CLI 如何用工程紀律補回語言劣勢，以及為什麼效能沒有 baseline 就沒有保護。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-startup-performance-discipline-en)

上一篇談 [runtime 抽象與 capability handshake](/posts/ai/2026-08-25-coding-agent-runtime-capability-handshake)。這篇換一個不起眼但每天都在付的成本：啟動。

## 設計問題：每叫一次都等一次，而且沒人量

CLI agent 和常駐服務不一樣——使用者一天叫它二十次，每一次都要重新付 import、config 讀取、憑證檢查、runtime 探索的代價。啟動慢不是「跑得慢」，是「每次互動前都先被課稅」；TUI 要等到能打字才算開始，中間那幾百毫秒是純粹的摩擦。

更麻煩的是第二層問題：**效能沒有 baseline 就沒有回歸保護**。功能測試壞了 CI 會擋，但某個 PR 多 eager import 了一個 SDK、啟動多了 300ms，沒有任何機制會發現。效能退步是安靜的，等你察覺時已經累積了十個 PR 的債。

## 五家怎麼做

**codex** 本身是 Rust，編譯成原生執行檔，沒有 import 樹這種東西，快是天生的。但它還是做了兩件值得抄的事。第一，daemon 重用：`codex/codex-rs/tui/src/lib.rs#can_reuse_implicit_local_daemon` 判斷這次呼叫能不能重用已經在跑的本地 daemon，能用就不重新初始化——連 Rust 都懶得每次冷啟動。第二，掃描結果快取：`codex/codex-rs/skills/src/loading.rs#SkillRootSnapshotCache` 定義 skill root 解析結果的快取介面，`codex/codex-rs/core-plugins/src/skill_snapshots.rs#PluginSkillSnapshotCache` 用記憶體 HashMap 實作，skill 目錄不會重複掃描解析。

**claude-code** 是 Node.js，最懂 import 之痛。它的入口 `claude-code-source/src/entrypoints/cli.tsx` 只是一個三十行的分派器，底下掛了近三十個 `await import()`——config、bridge、daemon、computer use 全部延遲到對應子命令真的被選中之後才載入。更重要的是它把量測做進產品裡：`claude-code-source/src/utils/startupProfiler.ts#profileCheckpoint` 用 Node 的 perf hooks 在啟動路徑上打點，phase 定義直接寫死 import_time、init_time、settings_time、total_time 四段；一般使用者抽樣 0.5% 上報 Statsig，內部員工全量，開 `CLAUDE_CODE_PROFILE_STARTUP=1` 可以拿到完整報告加記憶體快照。

**opencode** 提供了一個最小公用工具：`opencode/packages/opencode/src/util/lazy.ts#lazy`，十幾行實作 memoize 加 reset，整個 codebase 到處用它包住「第一次用到才建」的東西。CLI 子命令也大量用動態 import 切割路徑，例如 `opencode/packages/opencode/src/cli/cmd/run.ts` 裡 Server 和 interactive runtime 都是進到分支才載入。

**omp**（oh-my-pi）走得更極端。入口 `oh-my-pi/packages/coding-agent/src/cli.ts#runSmokeTest` 附近有一句註解講得很白：「Other smoke dependencies stay lazy so normal CLI startup does not load their worker clients」——worker client 一律 lazy，正常啟動連碰都不碰。熱路徑再下沉到 Rust N-API natives（grep、find、PDF），把 TS 做不快的部分換掉。

**pi** 是反面教材，或者說另一種選擇。入口 `pi-mono/packages/coding-agent/src/cli.ts` 直接 eager import main，`main.ts` 頂層九百多行的靜態 import，沒有任何 lazy 紀律。它賭的是 Bun 夠快、模組夠少，啟動可以接受。這在模組數量小的時候成立——但這是「還沒痛」，不是「設計過」。

## looplane 的選擇與差異

looplane 是 Python，CPython 的 import 成本比 Bun 高一個量級，「靠 runtime 快」這條路直接封死，所以五原則全部手動做滿。整套規劃寫在 `docs/plans/m12-startup-performance-plan.md`，經驗提煉自 Codex 0.148.0 的 life cycle 重做——官方 changelog 的優化全是流程層級，單一 PR 就把 TUI 中位數啟動從 833ms 砍到 504ms（數字出自該 PR 附帶的 paired benchmark，轉述自我們的 [startup playbook](https://github.com/xiaoxu/looplane/blob/main/docs/startup-performance-playbook.md)）。

第一步是凍結 baseline 才動手。2026-08-22 實測（playbook 裡記錄的歷史基準）：`python -c "import looplane.cli"` 要 0.701 秒，`-X importtime` 顯示元兇是 `codex_oauth` 一口氣拉進 openai SDK 的 247ms。解法是 `src/looplane/cli.py` 全面改成函式內 lazy import 加 `TYPE_CHECKING` guard——`--help`、`config` 這些輕路由再也不載入 provider SDK、uvicorn 或 Textual。

量測本身做成產品設施：`src/looplane/startup_trace.py#_StartupTracer` 在啟動路徑打點，設 `LOOPLANE_STARTUP_LOG` 才輸出 JSON span，關閉時每次 span 只剩一個 flag check。這和 claude-code 的 startupProfiler 同構，只是輸出給本機開發者而不是 Statsig。

「掃描不得重做」落實在 `src/looplane/startup_cache.py#cached_scan`：版本化 schema、config hash 當 key、磁碟快取加 TTL，並且 single-flight——並行請求同一資源只放行第一個，失敗結果永不回填。Ollama model 探索就是第一個受益者（`src/looplane/cli.py#_discover_local_ollama_models`）。

最有趣的一招是背景預熱。TUI 掛載不等於 controller ready，Codex backend 冷啟動要約 2.1 秒（commit `ece3552` 的量測：controller.start 約 352ms／2140ms）。做法是 App `on_mount` 時用 `asyncio.create_task` 排程預熱 native controller，使用者還在打第一個字，controller 已經在背後 spawn；首輪 `_ensure_started` 命中快取降到 0.01ms。預熱例外一律吞掉——它是最佳化，不是正確性的一部分。

最後是回歸門檻：`scripts/bench_startup.sh` 固化 hyperfine 流程，committed baseline（`benchmarks/startup-baseline.json`，fallback timer 下 `--help` 中位數 0.492s、`config` 0.380s）配上 `.github/workflows/startup-perf.yml`，`scripts/check_startup_regression.sh` 對 paired median 比，退步超過 10% 直接擋 merge。M13 之後新增的外部 runtime adapter 必須接在這套 lazy discovery 上，不許放大共同啟動成本。

## 工程依據

量測工具的選擇本身就是方法論。[hyperfine](https://github.com/sharkdp/hyperfine) 的核心價值是三件事：warmup runs 消除冷快取雜訊、統計顯著的多轮執行取中位數、以及 paired before/after 交替執行避免「candidate 剛好跑到機器比較空的時段」。looplane 的 `bench_startup.sh` 參數就照這套打：`--warmup 3 --min-runs 10`，paired 模式下 before/after JSON 交給同一個比較器算百分比變化，只做相對比較、不做跨機器的絕對宣稱——m12 plan 裡明文禁止拿不同機器的秒數互相比。importtime 定位病因，hyperfine 驗證療效，兩者是診斷和驗收的分工，不能混用。

## 改善路線

現在的門檻還有明顯的粗糙處。第一，CI 用的是 fallback timer 而非 hyperfine，噪音地板還沒正式建立，10% 這個閾值目前是慣例而非量測出來的統計邊界——plan 裡「先 reporting-only 跑到確認噪音地板」那一條還欠著。第二，北極星指標 time-to-first-editable-composer 需要 TTY，benchmark 只能測代理場景（help/config/import），真實 TUI ready 時間目前只靠 `LOOPLANE_STARTUP_LOG` 事後看，還沒自動化進 CI。第三，並行化獨立啟動步驟（config 讀取、auth refresh、workspace 準備）只在預熱這一件事上做了，依賴圖還沒系統性盤點。第四，stale-while-revalidate 已經在 `startup_cache.read_entry` 留好逃生口，但還沒有 UI 場景真正用它——「先顯示舊資料、背景刷新」是把快取從省時間升級成體感設計的下一步。

慢的從來不是語言，是 life cycle 設計。而工程品味最好的展示方式，是公開的 before/after 數字。

## 參考資料

- [hyperfine — command-line benchmarking tool](https://github.com/sharkdp/hyperfine)：paired benchmark、warmup、統計方法論的出處
- [openai/codex](https://github.com/openai/codex)：`codex-rs/tui/src/lib.rs` daemon 重用、`codex-rs/skills/src/loading.rs` skill snapshot 快取
- [anthropics/claude-code](https://github.com/anthropics/claude-code)：本文分析用的是 decompiled v2.1.88 原始碼，入口分派與 startupProfiler 的設計可對照官方 [Agent SDK 文件](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk/overview)
- [sst/opencode](https://github.com/sst/opencode)：`util/lazy.ts` 與子命令動態 import
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)、[can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)：eager 與 lazy 兩種極端的對照
- [Python `-X importtime` 文件](https://docs.python.org/3/using/cmdline.html#cmdoption-X-importtime)：定位 import 元兇的標準工具
