---
title: "AI Agent GitHub Digest — 2026-10-18"
date: 2026-10-18
category: daily
tags: [ai-agent, github, open-source, daily, sandbox, reverse-engineering, model-inference]
lang: zh-TW
description: "Microsoft MXC 正式 GA、Perplexity 開源自家 SPACE，agent 執行沙箱正從公司內部工具變成外部基礎設施；REA 四天內從 14.6 萬衝到 30 萬星"
tldr: "**microsoft/mxc**（2,891★）是微軟 10/7 GA 的 agent 沙箱化執行層，GitHub Copilot／Codex／Replit 已支援；**perplexityai/SPACE**（1,332★）是 Perplexity 把自家 Firecracker microVM 沙箱開源出來，originally 跑 Perplexity Computer 的內部基礎設施；**Niko1221/Strata**（26,784★）讓 Qwen3.8-Flash-Next 能在消費級硬體一鍵跑起來，本地提供 OpenAI／Anthropic 相容 API；**morluto/rea**（304,672★）連續第三次上榜，4 天內從上次報的 14.6 萬星衝破 30 萬。Release：pydantic-ai v2.57.0 標了「相容性變更」，Skills 補上 `disable-model-invocation`／`user-invocable` 支援。"
series:
  name: "AI Agent GitHub Digest"
  order: 64
---

> 🌏 [English version](/posts/daily/2026-10-18-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「agent 執行環境」從單一公司的內部工具變成外部可用的基礎設施：微軟把 MXC 做到正式 GA、Perplexity 直接把自家跑 Perplexity Computer 的沙箱開源，兩邊都在解同一個問題——怎麼讓 agent 跑起來的程式碼不碰到 host。跟昨天報過的 Agno sandbox harness agent 放在一起看，沙箱正在變成 agent 生態的標準配件，不是誰家的護城河。

## Trending Repos

### microsoft/mxc ⭐ 2,891

[GitHub](https://github.com/microsoft/mxc)　·　Rust　·　MIT

- **是什麼**：Microsoft Execution Containers（MXC），10/7 正式 GA 的沙箱化程式碼執行系統，跨 Windows／Linux／macOS，背後接 AppContainer、Seatbelt、Bubblewrap、microVM 等多種隔離後端，統一包成一份 JSON 設定格式和 Rust／.NET／Node SDK。
- **為什麼值得看**：GitHub Copilot、OpenAI Codex、OpenClaw、Replit、LM Studio、Unsloth 已經支援，Anthropic Claude Code、Box、Perplexity、Raycast 等列在「即將支援」名單——這代表微軟想把「agent 跑程式碼要隔離」這件事做成跨廠商都能接的平台層，而不是每家 agent 自己兜一套沙箱。
- **Tech stack**：Rust 核心 + 平台原生隔離後端（Windows AppContainer／macOS Seatbelt／Linux Bubblewrap）+ TypeScript／.NET／Rust SDK
- **上手難度**：低——裝 SDK 不用自己 clone repo；但官方標明目前的 policy 偏寬鬆，還不能當成安全邊界用

---

### perplexityai/SPACE ⭐ 1,332

[GitHub](https://github.com/perplexityai/SPACE)　·　Rust　·　Apache-2.0

- **是什麼**：Sandboxed Platform for Agentic Code Execution，Perplexity 把自己內部從今年六月就在跑 Perplexity Computer 的沙箱基礎設施開源出來，每個 agent 任務配一個獨立 Firecracker microVM，憑證和對外流量都在 VM 外控管。
- **為什麼值得看**：這是「大公司把內部沙箱基礎設施直接開源」的又一例——上線後經過 108 次內部紅隊逃逸測試全部失敗，只有少數網路政策問題被修掉，跟同週 GA 的微軟 MXC 剛好形成對照：一邊是平台廠商做跨 agent 的通用層，一邊是應用公司把自己跑出來的真實基礎設施開源給社群。
- **Tech stack**：Rust + Firecracker microVM，對外介面類似 E2B 的包裝層
- **上手難度**：中——需要能跑 Firecracker（即需要 KVM／裸機或支援巢狀虛擬化的雲端環境）

---

### Niko1221/Strata ⭐ 26,784

[GitHub](https://github.com/Niko1221/Strata)　·　C++　·　MIT

- **是什麼**：讓 Qwen3.8-Flash-Next 這顆前沿小模型能在一般消費級顯卡上一鍵跑起來的推理引擎，裝完自動偵測顯卡／記憶體／硬碟去挑合適的量化版本，在本機開一個 OpenAI／Anthropic 相容的 API，agent 也能透過內建 MCP server 啟停模型。
- **為什麼值得看**：這類「前沿模型本地化」工具最近常上 trending，代表想在自己機器上接現有 agent 工具鏈（而不是打 API）的需求還在漲；它同時支援 NVIDIA NVFP4、UD-IQ4_XS 等量化格式，照卡別自動選最快的路徑，不是只做單一硬體最佳化。
- **Tech stack**：C++ 推理核心 + 平台原生建置腳本（Windows／Linux 一鍵，Mac 需自行編譯）+ MCP server
- **上手難度**：中——Windows／Linux 一鍵裝，但要先下載約 70GB 模型，Mac 需裝 Xcode Command Line Tools 自行編譯約 7 分鐘

---

### morluto/rea ⭐ 304,672

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **是什麼**：連續第三次上榜的 agent 逆向工程工具，讓 Claude Code／Codex 等 agent 透過 MCP 接上 Ghidra／Hopper／IDA，逆向原生二進位、JS/Electron App、.NET 組件和網站，回報結論時附上證據與限制。
- **為什麼值得看**：上次（10-13）報的時候是 146,406 星，今天 GitHub API 直接讀回 304,672——4 天內淨增 158,266，forks 也衝到 7.7 萬，成長曲線比前兩次報的時候都還陡；InfoQ 等外部媒體在今天報導時引用的「20 萬+」已經是幾小時前的舊數字，顯示追蹤它的成長速度本身比追蹤哪個功能新增還難。
- **Tech stack**：TypeScript + npm 套件（`npx rea-agents`）+ MCP server，CLI 與 agent 共用同一套分析後端
- **上手難度**：低——`npx rea-agents setup` 一行接好 agent 設定，原生分析需另外裝 Ghidra／Hopper／IDA 其中一個

## Notable Releases

### pydantic-ai v2.57.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0)

- **重要變更**：`BackgroundTools` 的完成結果現在會附上帶命名空間的 `origin` 和 `tool_call_id` metadata；Gemini Live／GPT-Live 的 realtime history、usage、reply 等待邏輯改成從 session core 統一讀取；`Skills` 補上尊重 `disable-model-invocation`／`user-invocable` 這兩個欄位，也會跳過找不到的 skill library 路徑。
- **Breaking Changes**：官方把這四項全部標成「⚠️ Compatibility Notes」——`BackgroundTools` 回傳結構多了欄位、realtime session 的狀態來源改變，都可能讓原本直接解析回傳格式或自己接管 realtime 狀態的程式碼行為跟著變。
- **對你的影響**：如果專案有解析 `BackgroundTools` 完成結果的原始欄位，或自己手動管理 Gemini／GPT Live 的 realtime 狀態，升級前先看對應 PR（[#10196](https://github.com/pydantic/pydantic-ai/pull/10196)、[#10083](https://github.com/pydantic/pydantic-ai/pull/10083)、[#10082](https://github.com/pydantic/pydantic-ai/pull/10082)）確認不會跟自己的邏輯衝突；用 Skills 功能的話可以趁機檢查 `disable-model-invocation` 設定有沒有被正確套用。

## 今日收穫

之前以為「誰家的 agent 沙箱做得好」會是廠商互相較勁的賣點，但微軟同週 GA MXC、Perplexity 直接把內部用了四個月的 SPACE 開源，兩邊的邏輯反而是「先把隔離層做成大家都能用的基礎設施」——跟 Agno 把這些 provider 包進 `sandbox=` 參數讓 harness agent 直接用是同一條路線：執行環境隔離正在從「各家暗自解決」收斂成「公開規格、大家接」，這跟 MCP 讓工具呼叫收斂成一套協定的路徑幾乎一樣。

## 參考資料

- [microsoft/mxc](https://github.com/microsoft/mxc)
- [Microsoft Execution Containers 正式 GA 公告](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/)
- [perplexityai/SPACE](https://github.com/perplexityai/SPACE)
- [Perplexity 開源 SPACE 報導 — MarkTechPost](https://www.marktechpost.com/2026/10/16/perplexity-open-sources-space-firecracker-microvm-sandbox-ai-agents/)
- [Niko1221/Strata](https://github.com/Niko1221/Strata)
- [morluto/rea](https://github.com/morluto/rea)
- [REA 報導 — InfoQ](https://www.infoq.com/news/2026/10/reverse-engineer-anything/)
- [AI Agent GitHub Digest — 2026-10-13（上次 REA 星數對照）](/posts/daily/2026-10-13-ai-agent-github-digest)
- [pydantic-ai v2.57.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0)
