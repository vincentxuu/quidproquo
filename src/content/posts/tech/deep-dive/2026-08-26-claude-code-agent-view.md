---
title: "Claude Code 多 session 怎麼管：Agent View、dispatch、狀態監控與跨 session 傳訊"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, agent-view, cross-session-messaging]
lang: zh-TW
tldr: "`claude agents` 一個畫面列出所有背景 session，把 Needs input、Ready for review、Working、Completed 等狀態排在一起管理，Space 鍵偷看、Enter 接手。搭配 cross-session messaging（ListAgents／SendMessage，v2.1.224+），session 之間還能自己互傳訊息；同機傳訊走本機 socket，不經 Anthropic 伺服器。"
description: "Claude Code Agent View 深入介紹：怎麼 dispatch 背景 session、讀懂六種狀態圖示與 Haiku 生成的列摘要、收到需要輸入的通知，以及 cross-session messaging 的同機與跨機傳訊機制和安全設計。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 26
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view-en)

系列寫到這裡，[多代理的全景](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)你已經看過了：subagents 分擔單一 session 內的工作，[agent teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide) 讓多個 teammate 協作。但兩者都沒解決一個更日常的問題——**你同時開了五個 Claude Code session，五個終端機分頁各自在跑，根本顧不過來**。哪一個在等你？哪一個早就跑完了？得逐一分頁翻紀錄才知道。

這篇講的 Agent View 就是為此而生的：一個畫面看所有 session 的狀態與需求。它是官方多代理版圖裡獨立的一塊，跟 subagents、agent teams 互補而不重疊。官方文件目前標註它在 research preview，介面和快捷鍵未來可能會調整。

## Agent view 是什麼

在終端機跑 `claude agents`，整個終端機被接管的畫面上是一張表格：每一列是一個背景 session，顯示名稱、目前在做什麼、跑了多久，並按狀態分組——需要你處理的和 Ready for review 的 session 排在最上面。按 `Esc` 回到 shell，session 繼續在背後跑，下次打開它們都還在。

關鍵在「背景 session」的定義：每一個都是完整的 Claude Code 對話，由一個獨立的 supervisor process 承載，**不需要任何終端機開著就能持續工作**。你可以關掉 agent view、關掉 shell、甚至開新的互動 session，dispatch 出去的工作照跑。機器睡眠後恢復，session 的 process 會醒過來繼續；但關機仍會停掉執行中的 session。

預設列表會顯示你所有專案的背景 session——A repo 一個 session 加上另一個 worktree 裡的 session 都在同一張表上。只想看某個專案就加 `--cwd`：

```bash
claude agents --cwd ~/projects/my-app
```

注意邊界：你在其他終端機開的互動 session 不會出現，除非用 `/bg` 把它送進背景；session 內 spawn 的 subagents 和 teammates 也不會列成獨立的一列。

## Dispatch 新 session

agent view 底部有一個輸入框，打一句描述任務的 prompt 按 Enter，一個新的背景 session 就開始跑了，自動從 prompt 取一個短名稱（由 Haiku 等級的模型命名，之後可用 `Ctrl+R` 改）。要記住的一點：**這裡打的每個 prompt 都是全新 session**，再打一句是開第二個 session，不是對第一個下追蹤指令。

輸入框支援幾種前綴控制起跑方式：第一個詞符合你定義的 subagent 名稱，或用 `@<agent-name>` mention subagent，就用那個 subagent 當主 agent；`@<repo>` 可以把 session dispatch 到隔壁 repo；`! <command>` 直接跑背景 shell 指令也會變成一列。`Shift+Enter` 則是 dispatch 完立刻 attach 進去看全程。

除了從 agent view dispatch，還有兩條路把工作送進背景：

```bash
# 從 shell 直接起背景 session
claude --bg "investigate the flaky SettingsChangeDetector test"

# 從既有 session 內
/background  # 或 /bg，把目前對話整個移進背景，騰出終端機
/fork  # 複製一份對話到新背景 session，原 session 繼續跑
```

`/fork` 複本會被指示在編改程式碼前先建自己的 worktree，所以複本和原本的 session 不會踩到彼此的檔案。你也可以反方向操作：在任何前景 session 的空 prompt 上按 `←`，該 session 就退到背景並打開 agent view——不用離開終端機就能切換 session。

## 狀態監控與「需要輸入」的提醒

每一列開頭的圖示同時表達兩件事。顏色和動畫是任務狀態：動畫表示 Working，黃色是 Needs input（等你回答問題、批准權限、或處理只有你能給的東西），暗色 Idle、綠色 Completed、紅色 Failed、灰色 Stopped。形狀則是 process 存活狀態：實心符號代表 process 活著隨叫隨應，`∙` 代表 process 已退出但你仍然可以偷看、回覆、attach——Claude 會從中斷處重啟續跑。

列上那句一行摘要是 [Haiku 等級模型](https://code.claude.com/docs/en/model-config)寫的，讓你不翻 transcript 就知道每個 session 在做什麼、卡在哪、產出了什麼。工作中的 session 列文字最多每 15 秒更新一次（直接重用 session 自己的輸出，不發 model request），每個 turn 結束時才重新生成摘要。如果 session 開了 pull request，列尾會掛一個 `#1234` 標籤連過去，顏色反映 PR 審查狀態——轉綠就代表 checks 通過、可以合了。

「需要輸入」是整套設計的核心。session 卡住等你的那一刻，agent view 有三層通知：列歸進 Needs input 組排到最上面；終端機分頁標題變成 `2 awaiting input · claude agents`；另外透過設定的終端機通知管道發通知，並觸發帶有 `agent_needs_input` 或 `agent_completed` 類型的 Notification hook。

處理方式分兩級。選一列按 `Space` 打開 peek panel：它顯示 session 正在問的問題或最新結果，打字回覆按 Enter 就送出，不用離開 agent view；有編號選項的問題按數字鍵就能選。需要完整對話時按 `Enter` 或 `→` attach，session 接管終端機變成一般互動模式；按 `←` detach 回到表格。detach 永遠不會停掉背景 session。

## Session 之間傳訊：cross-session messaging

Agent view 解決的是「你看著所有 session」，cross-session messaging 再往前一步：**讓 session 彼此說話**。一個 session 發現自己的修改弄壞了另一個 session 正在做的東西，它可以主動警告對方，不用你當傳聲筒。這需要 Claude Code v2.1.224 以上（macOS/Linux/WSL 2；原生 Windows 要 v2.1.234 以上）。同機傳訊在第三方 provider 或關閉 feature-flag fetching 的環境，官方文件另標 v2.1.248 以上；跨機 session 能不能被找到，還取決於 Remote Control 連線與登入狀態。

Claude 用兩個工具完成這件事：`ListAgents` 找出連得到的 session，`SendMessage` 把訊息送給其中一個。你不用碰工具，用自然語言指揮就行：「跟另一個終端機那個 session 問 migration 跑完了沒」。想指定收件人可以用 `@` mention session 名稱（v2.1.232+）；跑 `/list-agents` 或 `/peers` 則能看到這個 session 自己的名字和所有連得到的對象。

訊息的傳輸路徑依目的地而不同：

| 對方在哪 | 怎麼送 |
|---|---|
| 同一台機器 | 走每個 session 自己的 Unix socket（Windows 是 named pipe），**不經過 Anthropic 伺服器** |
| 你的另一台機器 | 經 Anthropic 伺服器，從對方機器的 Remote Control 連線抵達 |
| Claude Code on the web | 經 Anthropic 伺服器直送雲端 session |

長任務還有一個方便的機制：Claude 可以向同機的另一個 session 訂閱「下次 idle 或結束時通知我一次」（`notify_when_idle`，v2.1.236+）。這是一次性的——通知發完就拆掉，12 小時內沒等到也自動放棄，兩邊都不會互相輪詢。

### 安全設計：session 的話不算人類的話

這是整套機制裡最重要的決定。當 session A 傳訊給 session B，Claude Code 明確告訴 B 的 Claude：**這則訊息來自另一個 session，不是來自你**。具體限制有四條：訊息不能代替你批准任何權限提示；接收方被指示絕不因為另一個 session 要求就去改 permission settings、CLAUDE.md 或其他設定；訊息裡寫的指令（如 `/compact`）只當純文字，永遠不執行；如果照訊息辦事需要接收方沒有的權限，你平常看到的那個權限提示照樣彈出來。

你還能進一步控制入口：`crossSessionInbound` 設成 `accept`／`hold`／`refuse`，分別是照常收、先扣著等你審、直接丟掉。跨機傳訊若想全部先經你同意，設 `isolatePeerMachines` 為 `true`——連 bypassPermissions 模式都擋得住。

## 什麼時候用 agent view，什麼時候用 agent teams

判斷很簡單：**你是唯一的協調者嗎？**

- 任務彼此獨立、各自做完交結果給你（修 bug、開 PR、查 flaky test）→ agent view。你 dispatch、偶爾 peek、attach 處理需要輸入的節點。
- 任務之間需要持續協調、共用一個目標分工推進 → agent teams。teammates 點對點傳訊、互相知道彼此在做什麼。
- 只是同一個 session 內想分擔工作（搜尋、探索）→ subagents 就夠，見[全景篇](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)。
- 兩三個 session 之間只是偶爾要互通一個發現或答案 → 不必搬進 team，cross-session messaging 就夠了。

我自己的心得是把它當成「多工的作業系統」：agent view 是工作管理員，一眼看清哪個 process 在跑、哪個在等 I/O；cross-session messaging 則像 process 之間的 IPC。你仍然是排程的人——只是不用再靠切終端機分頁來當那雙眼睛。

## 參考資料

- [Manage multiple agents with agent view — Claude Code Docs](https://code.claude.com/docs/en/agent-view) — dispatch 方式、六種狀態圖示、peek panel、supervisor process 與 PR 狀態標籤的官方說明
- [Message your other Claude Code sessions — Claude Code Docs](https://code.claude.com/docs/en/cross-session-messaging) — ListAgents/SendMessage 工具、同機 socket 與跨機 Remote Control 傳輸路徑、incoming message 的安全限制與 `crossSessionInbound` 控制

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（agent view 為 research preview；messaging 版本需求 v2.1.224+，`notify_when_idle` 需 v2.1.236+）。
