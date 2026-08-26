---
title: "Claude Code Agent Teams 怎麼用：Team Lead、點對點傳訊與共享任務板"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, agent-teams, multi-agent, parallel-execution, ai-agent, dx]
lang: zh-TW
tldr: "Agent Teams 讓多個完整的 Claude Code session 組成一個團隊：Team Lead 分配工作，teammates 各自擁有獨立 context window，靠點對點傳訊和共享任務清單自我協調。本文講它跟 sub-agent 的三個關鍵差別、teammateMode 兩種顯示模式的取捨，以及 token 成本隨人數線性上升這件事。"
description: "深入介紹 Claude Code 的 Agent Teams：啟用方式、Team Lead 與 Teammates 的分工、SendMessage 點對點傳訊、任務板的建立與認領、teammateMode 顯示模式設定，以及適用場景與成本限制。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 25
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en)

這是「Claude Code 深入介紹」系列的 Agent Teams 篇。[F1 多代理全景](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)畫過整張地圖，[D4 sub-agents](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution) 講過最輕量的平行方式；這篇處理的是重量級選項——多個 Claude Code instance 組成一個長期共存的團隊。功能目前是實驗性質，預設關閉，官方文件也明白列出已知限制，所以這篇一半在講怎麼用，一半在講什麼時候不該用。

## 跟 Sub-agent 的差別在哪裡

Sub-agent 是「派工後收報告」：主對話開一個新的 context window，sub-agent 做完把結果摘要回傳，生命週期就結束了。Agent Teams 的 teammates 不一樣，他們是**長期存在的完整 Claude Code session**——各自有自己的 context window，spawn 時載入同一份 CLAUDE.md、MCP servers 和 skills，但不繼承 lead 的對話歷史。

官方文件的比較是這樣（sub-agent 的完整機制另見[官方 sub-agents 文件](https://code.claude.com/docs/en/sub-agents)）：

| | Sub-agents | Agent Teams |
|---|---|---|
| Context | 獨立，結果回傳給呼叫者 | 獨立，完全自主 |
| 溝通 | 只能回報給主代理 | Teammates 之間直接互傳訊息 |
| 協調 | 主代理管理所有工作 | 共享任務清單，自我協調 |
| 適合 | 只在乎結果的專注任務 | 需要討論與協作的複雜工作 |
| Token 成本 | 較低（結果摘要回主 context） | 較高（每個 teammate 都是獨立 instance） |

歸納成三句話：teammates 互相傳訊、共享任務板、你可以跳過 lead 直接跟任何一個 teammate 對話。這三件事 sub-agent 都做不到。

## 怎麼開一個 Team

Agent Teams 由 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 控制，預設關閉。在 settings.json 加上：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

v2.1.178 之後不需要再叫 Claude 建 team、取名——直接用自然語言描述任務和你想要的 teammates 就好：

```text
Spawn three teammates to review PR #142:
- One focused on security implications
- One checking performance impact
- One validating test coverage
```

Claude 會填共享任務清單、逐一 spawn teammates、等大家做完再彙整。

一個副作用要知道：這個變數打開之後，Claude **自己命名**的 subagent 也會以 teammate 的形式啟動，即使你沒有要求組隊。如果某段流程其實只需要 subagent 的「做完回報」，把變數設回 `"0"` 即可，不用重開 session。另外非互動模式（`-p` flag、Agent SDK）不會 spawn teammates。

## Team Lead 與 Teammates 各自做什麼

架構上只有四個零件：

| 元件 | 角色 |
|------|------|
| Team lead | 主 session，負責 spawn teammates、協調、彙整 |
| Teammates | 獨立的 Claude Code instance，各自做分配到的任務 |
| Task list | 共享任務清單，teammates 認領與完成 |
| Mailbox | 代理之間的訊息系統 |

資料都放在本機：team config 在 `~/.claude/teams/{team-name}/config.json`，任務在 `~/.claude/tasks/{team-name}/`。team 名稱由 session ID 衍生（`session-` 加前八碼），session 結束時 config 自動清除，任務清單則保留，讓 resume 之後的 session 還接得上。

分工的核心原則：**你對 lead 下指令，lead 對 teammates 下指令**。複雜或有風險的任務可以加一道 plan approval——要求 teammate 先待在唯讀 plan mode 提出計畫，lead 審核通過才開始實作。Lead 會自主判斷要不要批准，想影響它的標準就把條件寫進你的 prompt，例如「只批准包含測試覆蓋的計畫」。

權限方面，teammates 繼承 lead 的 permission settings，spawn 之後可以個別調整，但不能在 spawn 當下分別指定；teammate 的權限提示會浮到 lead session 由你處理。

## 傳訊模型：點對點，沒有 broadcast

Teammates 之間用 [`SendMessage`](https://code.claude.com/docs/en/tools-reference) 傳訊，**只能點名**：要通知所有人，就是一人一則。官方文件的原話是「To reach everyone, send one message per recipient」——沒有 broadcast 這種操作。

訊息自動送達，lead 不需要輪詢。Teammate 做完停下來時會送 idle 通知給 lead，但通知**不帶輸出內容**——結果本身要靠 teammate 傳訊或更新任務清單來分享。

底層是每個代理一個 mailbox JSON 檔（`~/.claude/teams/{team-name}/inboxes/{agent-name}.json`），寫入成功才算送出。安全規則值得記住：收件方會被告知訊息來自另一個 Claude session 而不是你，所以 teammate 不能替你核准權限，被拒絕的動作也不能轉手請另一個 teammate 放行。

工具層面的現況：`SendMessage` 負責代理間傳訊（也能傳給你其他的 Claude Code session，v2.1.224 起）；`ListAgents` 列出所有可傳訊的對象，同樣需要 v2.1.224 以上，且只在啟用 cross-session messaging 的 session 出現。

## 任務板管理

共享任務清單由四個工具撐起來：`TaskCreate`、`TaskGet`、`TaskList`、`TaskUpdate`。任務有三種狀態：pending → in progress → completed。依賴會自動管理——pending 任務的依賴還沒完成就不能認領，teammate 完成一項任務時，下游任務自動解鎖，不用你動手。

指派有兩條路：

- **Lead 指派**：告訴 lead 哪個任務給哪個 teammate。
- **Self-claim**：teammate 做完手上的事，自己挑下一個未被指派、未被阻塞的任務。

認領用 file locking，避免兩個 teammate 同時搶同一個任務。想掛品質閘門就用 hooks：`TeammateIdle`（teammate 快要閒置時）、`TaskCreated`、`TaskCompleted` 三個事件，exit code 2 都能擋下並回饋意見。

操作面上，按 `Ctrl+T` 切換任務清單顯示；agent panel 用**上下方向鍵選取 teammate，Enter 打開 transcript 並直接傳訊**，Esc 中斷該 teammate 目前的回合。

## teammateMode：兩種顯示模式

- **In-process**（預設）：所有 teammates 跑在你主終端機裡，靠 agent panel 切換。任何 terminal 都能用，零額外設定。
- **Split panes**：每個 teammate 一個 pane，一眼看到所有輸出、點進去直接互動。需要 tmux 或 iTerm2。

設定用 `~/.claude/settings.json` 的 `teammateMode`，可選 `"auto"`（已在 tmux session 或 iTerm2 就開分割，否則退回 in-process）、`"in-process"`、`"tmux"`、`"iterm2"`（v2.1.186 起，明確使用 iTerm2 原生分割，需要 `it2` CLI）。注意預設值的演變：v2.1.179 起預設從 `"auto"` 改成 `"in-process"`，舊版習慣開分割的人要自己設回去。單次 session 可以用 `claude --teammate-mode auto` 覆蓋（實驗性 flag，不出現在 `--help`）。

檢視 in-process teammate 時，你打的純文字和 skills 會送給那個 teammate，但內建指令仍在 lead session 執行。另外 teammate 的 model 在 spawn 當下就固定了——`/model` 和 `/fast` 只改 lead 的設定。

## 適用場景與成本警告

官方點名的四個強項場景：research & review（多人從不同角度審查、互相挑戰結論）、新模組開發（各管一塊檔案不打架）、競爭假設除錯（五個 teammates 互相駁倒對方的理論，活下來的那個最可能是真因）、跨層協調（前端、後端、測試各一個）。新手建議先從不寫 code 的任務開始驗證價值。

反面清單同樣明確：循序任務、同檔案編輯、依賴關係多的工作，用單一 session 或 subagents 比較有效率。

成本是最現實的剎車：每個 teammate 一個獨立 context window，token 用量隨人數**線性上升**，官方明說比單一 session 貴得多。實務起點是 3 個 teammates、每人 5 到 6 個任務——三個專注的 teammates 通常贏過五個分散的。已知限制也要列入決策：in-process teammates 不支援 `/resume` 和 `/rewind` 還原、任務狀態更新可能延遲、關閉 teammate 可能很慢、一個 session 只能有一個 team、teammates 不能再 spawn 自己的 teammates、lead 固定不可轉移。

## 學到的事

Sub-agent 是函式呼叫，agent team 是共事的同事——差別不在「能不能平行」（兩者都能），而在溝通拓撲和生命週期：teammates 長期共存、點對點互傳訊息、共享任務板自我協調。代價是 token 成本線性上升加上實驗期的不穩定。我的建議：先用 review 或 research 這類邊界清楚的任務試一次團隊運作，確認協調收益真的超過成本，再把寫 code 的分工交給它。

## 參考資料

- [Orchestrate teams of Claude Code sessions — Claude Code Docs](https://code.claude.com/docs/en/agent-teams) — Agent Teams 官方文件：啟用方式、顯示模式、任務板、mailbox 架構、hooks、限制與 troubleshooting 的第一手來源
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — `SendMessage`／`ListAgents`／`TaskCreate` 等 Task 工具的現況、版本需求與權限欄位
- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents) — Sub-agent 的生命週期、工具過濾與「單一 session 內運作」的定位，Agent Teams 比較表的對照基準

## 更新紀錄

- 2026-03-28：建立大綱骨架。
- 2026-08-26：展開為正文，依官方文件（code.claude.com，含 v2.1.178+ 行為）全面重寫；修正切換 teammate 的操作為方向鍵選取＋Enter、移除不存在的 broadcast 描述、補上 teammateMode `"iterm2"` 與 `SendMessage`／`ListAgents` 工具現況。
