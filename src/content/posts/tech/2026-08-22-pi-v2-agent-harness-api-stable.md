---
title: "Pi v2：AgentHarness API 升穩、Earendil 公司化，極簡主義走進下一章"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pi, coding-agent, cli, open-source, ai-tools, harness-engineering, typescript]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 24
tldr: "Pi v0.84.0（2026-08-06）把 AgentHarness v2 API 升為 stable。Lane-based v4 Session model 讓操作可持久化、可中斷。CBOR 取代 JSON，Unix socket 取代 HTTP。背後的 Earendil Inc.（Armin Ronacher 的 PBC）拿到首輪資金。95.4K stars，still MIT，still 極簡。"
description: "Pi v2 的 AgentHarness v2 API、Lane-based v4 Session、CBOR 協定、Unix socket transport、RemoteSession、Earendil 公司化，以及這些變化對極簡定位的影響。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en)

[三月那篇文章](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)寫 Pi 的結論是：它是刻意做小的 harness——4 個工具、極短的 system prompt、明確拒絕 MCP 和 sub-agents。五個月後，Pi 到了 v0.84.0，表面上還是那個 Pi，底層卻換了一副引擎。

2026 年 8 月 6 日，[AgentHarness v2 API 被提升為 stable](https://github.com/earendil-works/pi/releases/tag/v0.84.0)。同時公開的還有一件事：Pi 背後的公司 [Earendil Inc.](https://earendil.works/)——Armin Ronacher 的 Public Benefit Corporation——拿到了首輪資金。repo 星數來到 95,400，npm scope 已經穩定在 `@earendil-works`。

這篇不重複[原來那篇](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)講過的設計哲學，只講 v2 實際上改了什麼。

## AgentHarness v2 API：哪裡不一樣

v1 的 AgentHarness API 是薄包裝——session 是記憶體裡的物件，工具回傳是非型別的 JSON，錯誤處理不統一。能用，但你不會想拿它蓋東西。

v2 做了三件事：

### Lane-based v4 Session Model

Session 不再是平面的訊息陣列，而是 **lane-based** 的結構。每個 lane 是一條獨立的操作序列，session 是 lane 的集合。

這解決的問題是**持久化**。v1 的 session 在記憶體裡跑，程序結束就沒了；v2 的每個操作都是 durable——寫進去就保證在，中斷後可以從斷點恢復。結合 `Result<T, E>` 回傳模式（每個工具呼叫都回傳型別化的成功或失敗，不再是 `any`），session 的每一步都有明確的狀態。

lane 之間可以有依賴關係。一個典型的 session 可能有一條主對話 lane、一條工具執行 lane、一條 background task lane。lane model 讓這些序列各自推進，不需要一條全局的事件流。

### CBOR 取代 JSON

v2 的線路協定從 JSON 換成 [CBOR（RFC 8949）](https://www.rfc-editor.org/rfc/rfc8949.html)。CBOR 是 binary 的 JSON——同樣的資料結構，但不需要字串編解碼，支援 binary blob 零拷貝傳遞。

搭配的是 **incremental length-prefixed framing**：每個訊息先送長度，再送本體。接收方不需要掃描分隔符號，可以精確分配 buffer。

為什麼要換？因為 v2 的 session 可能很大——帶著大段程式碼的工具回傳、多 lane 的完整狀態——JSON 的 UTF-8 編解碼和字串轉義在這種規模下變成效能瓶頸。CBOR 在這個場景比 JSON 快 2-5 倍（取決於 binary 內容比例），而且 Pi 不需要人類可讀的線路格式——debug 可以在應用層轉回 JSON 看。

### Unix Socket Transport

v2 的 transport 從 HTTP 換成 **Unix domain socket**。原因很直接：

- 不需要佔一個 TCP port
- 延遲比 loopback TCP 低（沒有 TCP handshake 和 Nagle 問題）
- 檔案系統權限就能做存取控制，不需要額外的 auth 層

這也是為什麼 Pi v2 的 headless 模式可以跑得很輕——一個 Unix socket + CBOR，不需要 HTTP server 的整套 overhead。

## RemoteSession：讓別人接手你的 agent

v2 新增的 `RemoteSession` 是一個 controller，可以連上正在跑的 Pi instance，接管或觀察它的 session。

幾個組成：

- **Session lease**：消費端取得 session 的租約，租約到期前其他消費端不能寫入。防止多個 client 同時操作同一個 session 造成的衝突。
- **Transcript reducers**：把 session 的完整紀錄壓縮成摘要，讓遠端 client 不需要載入整個歷史就能理解當前狀態。

實際用途：你在本地跑 Pi，中途切到另一台機器，用 RemoteSession 接上去繼續。或者一個監控系統透過 RemoteSession 觀察 agent 的行為、在必要時注入指令。

## Earendil Inc.

Pi 不再是純個人專案。[Earendil Inc.](https://earendil.works/) 是 Armin Ronacher（Flask、Sentry 的作者）創立的 Public Benefit Corporation。PBC 的法律結構要求公司在追求利潤的同時考慮公共利益。

目前公開的資訊：

- 首輪資金已到位（金額未公開）
- 團隊從 Mario Zechner 一個人擴展到數人
- repo 和 npm 的所有權轉移到 `earendil-works` 下
- MIT 授權不變

公司化對使用者的影響是雙面的。好的一面：有錢有人，Pi 的維護和開發速度會更快，bug fix 不再只靠一個人。要注意的一面：PBC 仍然是公司，商業壓力可能推動 Pi 往複雜的方向走——這剛好跟它「刻意做小」的核心定位矛盾。

從 v0.84.0 的實際變化看，目前的方向是「底層換引擎、表面不動」——API 變強了但工具數量沒增加，protocol 換了但 system prompt 還是那麼短。能維持多久是問號。

## 還是那個 Pi 嗎

v2 的核心賭注沒變：**給模型最少的東西，讓使用者自己決定疊什麼**。

4 個核心工具還是 4 個。明確不做的清單（MCP、sub-agents、plan mode、permission popups）還在 README 裡。Extensions 和 Skills 還是主要的擴充路徑。

變的是底層品質：

| | v1 | v2 |
|---|---|---|
| Session model | 記憶體物件 | Lane-based v4，可持久化 |
| 錯誤處理 | 非型別 | `Result<T, E>` |
| 線路協定 | JSON / HTTP | CBOR / Unix socket |
| 遠端控制 | 無 | RemoteSession + lease |
| 組織 | 個人專案 | Earendil Inc. (PBC) |

換個說法：v1 的 Pi 是一把好用的刀，但刀柄握久手會滑；v2 把刀柄換了，刀刃不動。

## 風險

**v2 API 剛 stable**。v0.84.0 是第一個把 AgentHarness v2 標為 stable 的版本，實際採用者還不多。CBOR + Unix socket 的組合在 Node.js 生態裡不常見，遇到問題時可參考的案例有限。

**PBC 的走向**。Earendil 拿到資金之後會做什麼？如果答案是「Pi 加一層付費的 cloud hosting」，極簡的 open-source 核心可能不受影響；如果答案是「Pi 變成平台」，那核心定位會改變。目前沒有足夠資訊判斷。

**omp 的分岔壓力**。[omp（Oh My Pi）](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)從 Pi fork 出去做了 batteries-included 路線，v2 的改變沒有讓兩者靠近——[omp 2 直接用 Rust 重寫了整個 codebase](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)。Pi 生態實際上分成了兩個不會合流的方向。

## 跟其他 Coding Agent 的對照

v2 的改變讓 Pi 在技術層面更接近其他 harness，但定位差距沒縮小：

| | Pi v2 | Claude Code | dsh |
|---|---|---|---|
| 核心工具 | 4 個 | 20+ | 全部是 plugin |
| 擴充方式 | Extensions / Skills | Hooks / Extension API | Cordis plugin |
| 線路協定 | CBOR / Unix socket | JSONL / stdio | 內部 |
| 持久化 | Lane-based v4 Session | 有 | Session plugin |
| 組織 | Earendil Inc. (PBC) | Anthropic | DeepSeek |

Pi 依然是「你想要一個可以讀完整個 codebase 的 agent harness」時的首選。只是現在它的底層更結實了。

## 整體來說

Pi v2 做了一件不容易的事：**在不改變定位的前提下升級底層**。Lane-based session、CBOR 協定、Unix socket、RemoteSession——這些都是「蓋東西」需要的基礎設施，而不是「用 agent」需要的功能。它在對開發者說：Pi 夠小到你可以讀完，也夠結實到你可以在上面蓋東西。

Earendil 的公司化讓這條路有了更多資源，但也多了一個變數。從 [harness 演化](/posts/ai/2026-03-28-harness-engineering-evolution)的脈絡看，Pi 走的是另一個極端——不是把 harness 做到「什麼都能換」（那是 [dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel) 的路線），也不是把整個 stack 用 Rust 重寫（那是 [omp 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 的路線），而是把極簡主義本身做到 production-ready。

## 參考資料

- [earendil-works/pi（GitHub）](https://github.com/earendil-works/pi)
- [Pi v0.84.0 Release Notes](https://github.com/earendil-works/pi/releases/tag/v0.84.0)
- [Earendil Inc. 官方網站](https://earendil.works/)
- [CBOR — RFC 8949](https://www.rfc-editor.org/rfc/rfc8949.html)
- [pi.dev 官方網站](https://pi.dev)
- 站內：[Pi Coding Agent：極簡主義的開源終端機 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)
- 站內：[omp（Oh My Pi）：batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)
- 站內：[OMP 2：全 Rust 重寫的獨立 coding harness](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
