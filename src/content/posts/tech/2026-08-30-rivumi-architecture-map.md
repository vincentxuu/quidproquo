---
title: "Rivumi 架構地圖：一次 coding-agent 任務如何穿過 workspace、runtime、tools 與 events"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, software-architecture]
lang: zh-TW
tldr: "Rivumi 把 coding-agent 任務拆成可追蹤的邊界：native runtime 的副作用經過 Rivumi tools、permission 與 sandbox；external runtime 保留自己的 loop 與工具，再把 patch 交回 Rivumi 稽核。這篇是規劃中 20 篇系列的入口地圖。"
description: "從一次任務的入口到 Cloudflare 遠端執行，整理 Rivumi 的 workspace、prompt、runtime、tool、event 與整合邊界，並說明本系列 20 篇的閱讀順序。"
series:
  name: "Rivumi 架構拆解"
  order: 0
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-architecture-map-en)

[Rivumi](https://github.com/vincentxuu/rivumi) 是一個 Python-first coding-agent harness。光把模型接上 shell，還稱不上 harness；Rivumi 進一步把「模型可以看什麼、能做什麼、失敗後留下什麼」拆成可檢查的程式邊界。這個系列會沿著一次任務的實際路徑讀原始碼。路線從 TUI 收到需求開始，經過 workspace、prompt、runtime 與 tools，最後走到本機整合和 Cloudflare 遠端執行。

站上另一個[「跟成熟 coding agent 學設計」系列](/series/coding-agent)負責比較 pi、OMP、OpenCode、Codex CLI 與 Claude Code 的設計選項；這個系列不再重做比較。這裡只回答 Rivumi 怎麼實作：資料從哪裡進來、通過哪些 contract、哪個 failure boundary 會擋住它，以及哪些測試支撐這個說法。

## 一次任務的全貌

先把細節收起來，一次 Rivumi 任務大致沿著這條路走：

```text
TUI / CLI / SDK
      |
      v
disposable workspace ---- instructions / project context / explicit memory
      |                                      |
      +------------------ prompt ------------+
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
          native AgentRunner      external CLI runtime
                 |                       |
       Rivumi tools / permission    CLI-owned tools / auth
           / OS sandbox                   |
                 |                       |
                 +--- patch audit / verification ---+
                                   |
                         state + event journal
                             |
              artifacts / resume / replay / fork
                             |
                 SDK / IDE / remote control plane
```

這張圖刻意保留兩條 lane。Native lane 的 tool call 需要通過 Rivumi 的路徑、argv、permission 與 OS sandbox 邊界；external CLI 則使用自己的 loop、工具與認證，Rivumi 不假裝接管那些副作用。兩條路徑會在 returned patch audit、verification 與 artifacts 重新會合。任何一層只靠 prompt 宣告「請小心」，都不算真正的邊界。

## 二十篇不是功能清單

完整系列規劃依讀者實際建立心智模型的順序分成四段。Orders 0–19 現在已形成完整閱讀路徑，每篇只追一條主要資料流，碰到其他主題就交給後面的專篇。

| orders | 讀者正在回答的問題 | 主要主題 |
|---:|---|---|
| 0–7 | 一次任務如何進入並選擇執行路徑？ | TUI/CLI、workspace、prompt、native loop、provider adapters、routing economics、external runtime |
| 8–13 | 模型如何安全執行工具，長任務又如何存活？ | tool executor、permissions、OS sandbox、transactions、journal、compaction |
| 14–16 | 能力如何擴充，又怎麼把工作交給其他 agent？ | MCP、skills/hooks/plugins、subagents |
| 17–19 | 其他 client 與遠端環境怎麼接進來？ | SDK/WebSocket、IDE/LSP、Cloudflare remote execution |

順序很重要。先看到 TUI 與一次 run 的可見輸出，後面讀 `AgentRunner`、event reducer 或 MCP projection 才知道那些抽象層最後服務的是什麼。Cloudflare 放在最後，是因為它同時依賴前面建立的 workspace、capability、state 與 attach 邊界。提早寫只會變成一篇孤立的基礎設施清單。

## 兩條 runtime lane

Rivumi 有兩條不同的執行路徑。Native lane 由 `AgentRunner` 擁有 model/tool loop，模型只回傳結構化輸出與 tool calls；Rivumi 負責執行、verification、重複偵測與停止條件。External lane 則把 Codex 或 Claude Code 這類官方 CLI 當成完整 runtime，Rivumi 只擁有外層 workspace、capability handoff、回傳 patch 的稽核與共同 artifacts。

把兩條 lane 分開，才能避免一個常見誤解：外部 CLI 不是換一個 `ModelProvider` 就能接上。它已經有自己的 loop、工具、認證和 context 管理；硬塞進 native provider contract，反而會讓權限與副作用的所有權變得不清楚。本系列會先講完 native lane，再獨立追 external handoff。

## 四種不能混在一起的邊界

後續文章會反覆遇到四個名字相近、責任不同的層次：

1. **Workspace isolation**：來源 repo 是否保持不變，run 在哪個 clone 內發生。
2. **Tool mechanics**：路徑、argv、環境變數、timeout 與 atomic write 怎麼執行。
3. **Authority policy**：某個人、組織或專案規則是否允許這個操作，需不需要 approve。
4. **OS containment**：command 真正執行後，kernel 層還允許它碰哪些檔案與系統呼叫。

這四層缺一不可，但保證不能互換。Disposable clone 能保護來源 repo，不代表 subprocess 已被 sandbox。`shell=False` 能避免 shell expansion，不代表該命令有權執行；permission rule 決定「可不可以」，也不代表作業系統已經強制隔離。每篇會把成立的保證和仍不存在的保證分開寫。

## State、events 與 artifacts 各自回答不同問題

Rivumi 不把 JSONL event log 當成唯一真相。Manifest 是 resume 用的 state of record，event journal 提供 replay、稽核與 UI projection。Run bundle 則保存 patch、verification、transcript 等不同讀者需要的 artifacts。這也是 state-first 的意思：如果 manifest commit 和 event append 中間 crash，恢復流程先相信可提交的狀態，再用 event sequence 協調觀察紀錄。

同一條分界也適用於較新的能力。Explicit memory 目前只是 typed JSONL 與有界注入，還沒有 semantic retrieval。Provider cache 是 request hint 與 trace，不是 Rivumi 自建 response cache。本機 WebSocket bridge 接的是預先建立的 session，也還不能依 conversation ID 恢復 durable conversation。系列會把這些 baseline 寫清楚，不把「已經有入口」說成「整套服務已完成」。

## 怎麼讀這個系列

第一次接觸 Rivumi，照 order 往下讀就好；正在改特定模組的人，可以從各段的入口開始：

- 想理解互動與執行路徑，先讀 TUI/CLI、workspace 與 native loop。
- 想處理安全邊界，從 tool executor 開始，依序讀 permissions、OS sandbox 與 transactions。
- 想擴充 capability，依序讀 [MCP](/posts/tech/2026-08-30-rivumi-native-mcp-authorization)、[skills/hooks/plugins](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins) 與 [subagents](/posts/tech/2026-08-30-rivumi-subagent-scheduling)。
- 想把 Rivumi 接進其他產品，最後讀 [SDK/WebSocket](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket)、[IDE/LSP](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge) 與 [Cloudflare](/posts/tech/2026-08-23-rivumi-cloudflare-deployment)。

每篇都會留下對應 source symbol、focused tests、失敗情境與目前限制。讀者不必相信架構圖；可以依文章列出的 symbol 回到 repo 搜尋，確認文章描述的邊界還在不在。

## 參考資料

- [Rivumi GitHub repository](https://github.com/vincentxuu/rivumi)
- [跟成熟 coding agent 學設計：系列總覽](/posts/ai/2026-08-25-coding-agent-design-series-overview)
