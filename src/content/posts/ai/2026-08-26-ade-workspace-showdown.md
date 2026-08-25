---
title: "ADE 工作台對決：ADE、Superset、Herdr 與 Orca 怎麼選"
date: 2026-08-26
category: ai
type: deep-dive
tags: [ade, agent-workspace, herdr, superset, claude-code]
lang: zh-TW
tldr: "把 ADE 類工作台分成四種哲學：arul28/ADE 的 Brain+Lane、Superset 的 100+ agents IDE、Herdr 的 Rust 常駐 runtime，以及 Kadro/Orca 的版面與 Fleet 取向；用一張對照表與選型決策樹幫你判斷何時該用水槽、而非 Omnigent 這類控制面。"
description: "同樣叫 ADE，arul28/ADE、Superset、Herdr、Kadro ADE 與 Orca 的抽象差很多。本篇拆解四者的 Lane/worktree、平行執行、PR 審核、行動端同步與授權差異，並對照 Omnigent 控制面，給出何時選工作台、何時選控制面的判斷。"
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 5
glossary:
  - term: "ADE"
    aliases: ["Agentic Development Environment"]
    definition: "以平行 worktree 與終端機為核心、讓多個 coding agent 同時跑的開發工作台。"
    definition_en: "An agentic development environment that runs multiple coding agents in parallel worktrees and terminals."
    links:
      - label: "arul28/ADE"
        url: "https://github.com/arul28/ADE"
  - term: "Lane"
    definition: "ADE 對 git worktree 的命名：一個隔離分支與工作目錄，含獨立的對話、終端機與 PR。"
    definition_en: "ADE's name for a git worktree — an isolated branch and working copy with its own chat, terminal and PR."
    links:
      - label: "ADE Lanes"
        url: "https://www.ade-app.dev/docs/lanes/overview"
  - term: "Brain"
    definition: "arul28/ADE 的常駐 daemon，擁有專案清單、同步 websocket 與執行權限。"
    definition_en: "The always-on daemon in arul28/ADE that owns the project catalog, sync websocket and execution authority."
    links:
      - label: "ADE Quickstart"
        url: "https://www.ade-app.dev/docs/quickstart"
---

> 🌏 [English version](/posts/ai/2026-08-26-ade-workspace-showdown-en)

上一篇把 [Omnigent](https://github.com/omnigent-ai/omnigent) 定位為 harness 之上的**控制面**——管接入、治理與跨裝置 Session；這篇把鏡頭轉回**工作台**。同樣掛著 ADE 名號的四個專案——[arul28/ADE](https://github.com/arul28/ADE)、[superset-sh/superset](https://github.com/superset-sh/superset)、[herdrdev/herdr](https://github.com/herdrdev/herdr) 與 [Kadro ADE](https://kadrotools.ai/ade)/[Orca](https://github.com/stablyai/orca)——做的都是「讓多個 agent 在同一台機器同一個 repo 裡並行、看得見、合得起來」，但抽象與取捨差很多。選對工作台，才不會把本該用 Lane 解決的衝突丟去用 Policy 硬擋。

## 為什麼 ADE 要自成一類：工作台 vs 控制面

若把 [上一篇的四層模型](https://codepick.dev/en/guides/meta-harness-2026/) 拿來對照，控制面解的是「你 ↔ 一群 harness」，工作台解的是「你在同一個 repo ↔ 一群 worktree + agent 進程」。

- **Omnigent**：`Runner + Server + Omnibox + Policy`，價值在「可攜、治理、協作」跨 harness。
- **ADE 家族**：`Brain/daemon + Lane/worktree + PR/diff + 同步`，價值在「平行、看得見、合得起來」本機開發迴圈。

實務分界很簡單：要不要把多個不同廠商的 harness 包在同一個可分享的 Session、且需要成本與權限的集中稽核——要，就往 Omnigent；只要在單機把幾個 [Claude Code](https://code.claude.com/) / [Codex](https://developers.openai.com/codex) / [OpenCode](https://opencode.ai/) 同時跑起來、各自有分支與預覽——用工作台更快。

## arul28/ADE：Brain + Lane 的經典款

[arul28/ADE](https://github.com/arul28/ADE)（[ade-app.dev](https://www.ade-app.dev/docs)）是目前最能代表「工作台」定義的實作。設計哲學是 **local-first + Brain 常駐**：Brain 是每台機器的常駐 daemon，擁有專案清單、同步用的 websocket、以及真正執行指令的權限；四個介面——Desktop（Electron）、Web、終端機 `ade code`、iOS——都只是連向 Brain 的客戶端。專案資料留在各 repo 內的 `.ade/`，整機狀態在 `~/.ade`。

最小工作單位是 **Lane**，也就是 [ADE 對 git worktree 的命名](https://www.ade-app.dev/docs/lanes/overview)：每任務一條隔離分支與獨立工作目錄，含自己的檔案、對話與終端機 session、process pool、diff 與 PR。最直覺的指令就是三行：

```bash
curl -fsSL https://ade-app.dev/install.sh | sh  # 裝 Brain，可選裝 Desktop
ade lanes create --name fix-checkout-flow        # 一條新 Lane = 一個 worktree
ade lanes list --text
```

特色在「堆疊」語意：可以從 `main` 開 Lane，也能從 Lane 再長出 child Lane，組成相依鏈；也能把已有的分支或外部 `git worktree` attach 進來。同步採 LAN → Tailscale → relay 三級，帳號只用於探索，沒有帳號也能靠 LAN/SSH 配對。適合團隊還沒決定要不要上控制面、但本機已經需要 3-5 個 agent 並行的第一站。

限制是平台：Linux 目前只有 Brain、沒有桌面版；完整體驗在 macOS 最順。與控制面相比，它沒有 Policy engine / spend kernel / credential proxy——治理靠 Lane 隔離與 approval gate。

## superset-sh/superset：把 100 個 agent 當成 IDE 在管

[Superset](https://github.com/superset-sh/superset)（[superset.sh](https://superset.sh/)，[docs.superset.sh](https://docs.superset.sh/)）把工作台直接做成 **agentic IDE**。口號是「Run 100+ coding agents in parallel」，每個任務同樣是隔離的 git worktree 與獨立終端機，但工作台本身就是 IDE：內建終端機、diff 檢視、in-app 瀏覽器、自動化排程，以及一鍵交棒到 [Cursor](https://cursor.com/) / VS Code 的流程。

與 ADE 的差異在三點：

1. **規模敘事**：目前宣稱穩定 5-7 個平行 agent，目標 2026 年底支撐 100 個（[roadmap](https://superset.sh/blog/roadmap-to-100-agents)）。
2. **驅動介面多**：除了桌面版，還有 `superset` CLI、TypeScript SDK（`@superset_sh/sdk`）與 MCP server，讓其他 agent 自己就能驅動工作台。
3. **授權**：原始碼公開、採 [Elastic License 2.0](https://github.com/superset-sh/superset/blob/main/LICENSE.md)（source-available，非 OSI 開源），與 ADE 的開源策略不同。

支援的 agent 覆蓋最廣：Claude Code、Codex、Cursor Agent、[Pi](https://github.com/badlogic/pi-mono)、OpenCode、Grok 等皆為 fully supported，理論上任何能跑指令的 CLI agent 都能直接用。適合想把「平行 review 與自動化」當成 IDE 功能在管理的團隊。

## herdrdev/herdr：一個 Rust 二進位當 runtime

[Herdr](https://github.com/herdrdev/herdr)（[herdr.dev](https://herdr.dev/)，約 32k stars，Apache 2.0）的自我定位是 **the runtime your coding agents live on**。不包 IDE、不包 Electron，只給你一個 Rust 二進位：一個背景 server 擁有所有終端機，客戶端是你在用的任何終端機——透過 `herdr` CLI、或 `herdr --remote` 經 SSH 附加上去。

哲學對比鮮明：ADE 與 Superset 把「工作台」做厚，Herdr 把「runtime」做穩。

- **always running**：終端機活在 server 裡，蓋上筆電、斷網、甚至重開機，agent 仍可繼續跑，重連後 layout 回來。
- **blocked/working/idle 標記**：讀每個 pane 的畫面與可選的整合外掛，把「卡住等你」的那個 agent 直接標出來，不必逐窗巡。
- **agent-native API**：CLI 與 socket API 是 agent 可驅動的介面，能 spawn pane、互送提示，並以 `wait until blocked` 取代盲目送按鍵。

Herdr 不替你封裝 agent 指令——Claude Code、Codex、Cursor、OpenCode 等照舊跑，只是由它負責終端機的存活、復原與路由。適合已有一套終端機與 tmux 心智模型、但想要「關不掉的 multiplexer + agent 狀態」的人。

## Kadro ADE 與 Orca：版面與 Fleet 的兩種延伸

**[Kadro ADE](https://kadrotools.ai/ade)**（[kadrotools.ai](https://kadrotools.ai/docs)）強調**版面**：一個 workspace 是一個有色分頁、內含可到 16 格的窗格網格，每格都是真終端機（xterm.js + WebGL，[Tauri 2 + React 19](https://kadrotools.ai/ade)）。內建 20+ 啟動器，`⌘K` 一鍵開工作區、切窗格、叫瀏覽器。思維是「把 IDE 的 pane 管理做到極致」，worktree 是選用、workspace/pane 是主角。適合從 IDE 轉過來、想要視覺化平鋪多 agent 的人。

**[Orca](https://github.com/stablyai/orca)**（[onorca.dev](https://www.onorca.dev/)，YC 支持）則往 **Fleet** 長：每個任務仍是隔離 worktree，但工作台原生整合 GitHub 與 Linear——可在 app 內瀏覽 PR/issue、從任務直接開 worktree、審 PR，並標榜桌面、行動版與 VPS 三棲。支援清單與 Superset 同級「any CLI agent」。適合已用 Linear/GitHub 作為任務來源、想把工作台與協作工具綁在一起的團隊。

兩者皆為桌面工作台，與 ADE/Herdr/Superset 同層；是否適合取決於你更在意「版面操控」還是「任務到 worktree 的連動」。

## 四款工作台並排怎麼選

| 維度 | [arul28/ADE](https://github.com/arul28/ADE) | [Superset](https://github.com/superset-sh/superset) | [Herdr](https://github.com/herdrdev/herdr) | [Kadro ADE](https://kadrotools.ai/ade) / [Orca](https://github.com/stablyai/orca) |
|---|---|---|---|---|
| 一句話 | Brain + Lane 的 local-first 經典款 | 100+ agents 的 agentic IDE | Rust 常駐 runtime / multiplexer | 版面優化的 workspace / Fleet 導向的 Orca |
| 平行單位 | Lane（isolated git worktree + per-lane process pool + agent session），支援 stack/child lane | Workspace（isolated worktree + branch + terminal），可經 CLI/SDK/MCP 批次扇出 | Workspace → Tab → Pane（pane 是真終端機） | Kadro：Workspace → Pane 網格（1-16 格）；Orca：worktree per task |
| PR / Review | Lane 內建 diff、衝突風險與 PR，直接在工作台內審與合併 | 內建 diff viewer 與 open-in-editor，監看所有 agent | 輕：靠 git/PR 流程本身，無內建審核面 | Kadro：仰賴外部 git；Orca：內建 GitHub/Linear 瀏覽與審核 |
| 同步與行動 | Brain 三級同步（LAN → Tailscale → relay）+ iOS app | Remote host + CLI/SDK/MCP，不綁行動 app | Server + `herdr --remote`（含 Windows 連 Linux/macOS），不包行動 app | Kadro：桌面 app 為主；Orca：桌面 + 行動版 + VPS |
| 平台 / 授權 | macOS/Windows + Linux（僅 Brain） | macOS（主要）+ Linux AppImage 實驗性，ELv2 | macOS/Linux/Windows 單一 Rust 二進位，Apache 2.0 | Kadro：macOS/Windows；Orca：桌面 + 行動 + VPS |
| 擴充 | `ade code` / CLI service actions | SDK + MCP + Automations（cron） | socket API + plugins + marketplace | 主要為內建啟動器與自訂命令 |
| 適合誰 | 想先驗證「平行 Lane 真有價值」的團隊 | 想把大量平行 review 當 IDE 功能 | 已用 terminal/tmux，想升級為永活 runtime | 想要可視化網格（Kadro）或 GitHub/Linear 連動（Orca） |

> 小提醒：不論選哪一個，底層皆為 `git worktree` 隔離，commit / push / PR 的語意不變——工作台只是把 worktree、終端機與審核流程黏在一起、並處理埠號與環境衝突。

## 什麼時候選工作台，什麼時候選控制面

用兩個問題走決策樹：

1. ** governance 是否要跨 harness 集中？** 需要一行切 Claude/Codex、跨 vendor 的 reviewer 路由、以及可審計的成本與憑證代理——選 [Omnigent](https://github.com/omnigent-ai/omnigent) 控制面；只需要在單機同時跑多個同 repo 的 agent——工作台已足夠。
2. **協作單位是「可分享的活 Session」還是「可合併的 PR」？** 前者（把 session 連結丟給同事、對方可看/留言/接管）是控制面的強項；後者（每條 Lane 各自開 PR、在工作台內審完再合併）是工作台的強項。

在站上的建議是**疊加而非二選一**：先用 ADE 或 Herdr 驗證平行開發的節奏，再把較成熟的 Lane pattern 透過 Omnigent 的 Runner 搬到共享 host 上，讓 Policy 與跨裝置 Session 接手。Superset 與 Orca 提供的 SDK / MCP 正好成為控制面驅動工作台的橋接點。

## 整體來說

工作台與控制面的分工已大致底定：控制面負責「多個 harness 怎麼被替換與治理」，工作台負責「多個 worktree 與 agent 怎麼在單 repo 內並行與合併」。若你還在單機、單 repo 的探索期——選一個工作台，照 Lane/Workspace 的語意把任務切開，並用行動端或 remote 同步把流程打通；當團隊的痛轉為「成本與權限必須在 prompt 之外被稽核」時，再把工作台收斂進 Omnigent 的統一 Session 與 Policy。

下一篇將沿用本系例的第五順位，接續討論背景 agent 與工作階段協同的持久化設計。

## 參考資料

- [arul28/ADE](https://github.com/arul28/ADE) · [ADE 文件 — ade-app.dev](https://www.ade-app.dev/docs) · [Lanes 概覽](https://www.ade-app.dev/docs/lanes/overview) · [Quickstart](https://www.ade-app.dev/docs/quickstart)
- [superset-sh/superset](https://github.com/superset-sh/superset) · [Superset 官網](https://superset.sh/) · [Superset Docs](https://docs.superset.sh/) · [Roadmap to 100 Agents](https://superset.sh/blog/roadmap-to-100-agents)
- [herdrdev/herdr](https://github.com/herdrdev/herdr) · [herdr.dev](https://herdr.dev/) · [Herdr Docs: Concepts](https://herdr.dev/docs/concepts/) · [Supported Agents](https://herdr.dev/docs/agents/)
- [Kadro ADE](https://kadrotools.ai/ade) · [Kadro Docs: Workspaces & Panes](https://kadrotools.ai/docs/workspaces)
- [stablyai/orca](https://github.com/stablyai/orca) · [onorca.dev](https://www.onorca.dev/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) · [Omnibox / Shared Server 文件](https://omnigent.ai/docs/policies/os-sandbox)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
