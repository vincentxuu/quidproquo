---
title: "Claude Code 多代理怎麼選：subagents、agent view、agent teams、dynamic workflows"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, multi-agent, subagents, worktree]
lang: zh-TW
tldr: "官方文件把 Claude Code 的平行工作分成 4 種方式：subagents 在同一個 session 內委派、agent view 讓你自己盯多個背景 session、agent teams 由 lead 協調一群工人、dynamic workflows 用腳本跑大量 subagent 交叉驗證；檔案衝突一律靠 worktree 隔離。本文附官方比較表中譯與三題決策指引。"
description: "以官方 agents.md 的比較表為骨架，整理 Claude Code 四種多代理方式的差異、選擇判準，以及 --worktree、.worktreeinclude 與清理規則的檔案隔離做法。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 24
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en)

平常一個 Claude Code session 從頭做到尾就夠了。但任務一大——同時修三個互不相干的 bug、做一次掃過整個 repo 的稽核、把 500 個檔案的遷移拆開跑——單線程就開始吃力。這篇是 F 叢集（多代理）的全景篇：先講清楚官方認得的四種方式各有什麼、怎麼選，最後補上不管選哪種都躲不掉的一件事——平行工作的檔案衝突要靠 worktree 隔離。單一 subagent 的機制細節已經在[前一篇](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)拆解過，這篇不再重複。

## 四種方式各是什麼

官方在 [Run agents in parallel](https://code.claude.com/docs/en/agents) 這頁把四種方式放在一起比。共同前提只有一個：**每一種方式底下的工人都是 Claude session**；想讓別的工具加入，得把它包成 MCP server 餵給 Claude。

**Subagents**：同一個 session 裡的委派工人。Claude 自己把副任務丟進獨立的 context window，做完只回一份摘要給主對話。適用情境是副任務會產生一堆你不會再看第二次的輸出——搜尋結果、log、整份檔案內容。

**Agent view**：`claude agents` 開啟的單一監控畫面。你自己當調度中心，把多個獨立任務派出去在背景跑，一眼看狀態，哪個需要你才點進去。目前是 research preview。

**Agent teams**：由 lead 統籌的多個協調 session，共享任務清單、teammate 之間可以點對點傳訊。實驗性功能，預設關閉。適合你想讓 Claude 自己把專案拆塊、分派、保持同步的場景。

**Dynamic workflows**：一支腳本跑起大量 subagent，並對他們的結果做交叉查核。官方給的定位很具體：工作大到沒法一回合接著一回合協調，或者需要不止一輪驗證——全 codebase 稽核、500 檔遷移、多角度研究互相對照。

同一頁也劃清了邊界：背景 bash 指令只是不擋住對話，不是開 agent；forked subagent 是繼承完整對話 context 的委派方式，不算獨立介面；routine 是雲端排程，解的是「什麼時候跑」而不是「怎麼平行」。另外還有三個輔助工具不屬於第四種方式，但常跟它們搭配：worktrees（隔離檔案，見下節）、cross-session messaging（讓你自己開的 session 互相傳訊）、`/batch` skill（把一個大改動拆成 5 到 30 個 worktree 隔離的 subagent，各自開 PR——它是前兩者的打包，不是新的協調方式）。

## 官方比較表

下表轉譯自官方文件：

| 方式 | 給你什麼 | 適用時機 |
|------|----------|----------|
| [Subagents](https://code.claude.com/docs/en/sub-agents) | 同一 session 內的委派工人，在自己的 context 做副任務、回傳摘要 | 副任務會用搜尋結果、log 或檔案內容灌爆主對話 |
| [Agent view](https://code.claude.com/docs/en/agent-view) | `claude agents` 開啟的單一畫面，派發並監控背景 session | 有數個獨立任務，想交辦後瞄一眼狀態、需要你時再介入 |
| [Agent teams](https://code.claude.com/docs/en/agent-teams) | 共享任務清單、可互相傳訊的多個協調 session，由 lead 管理 | 想讓 Claude 拆分專案、分派、維持同步 |
| [Dynamic workflows](https://code.claude.com/docs/en/workflows) | 跑大量 subagent 並交叉查核結果的腳本 | 工作超出少數 subagent 的規模，或需要結果互相驗證 |

## 怎麼選

官方的決策指引是三個問題，我照抄結構換成白話：

**誰負責協調？** Claude 在同一個對話裡自己派自己收——subagents。你自己交辦、稍後回來看——agent view。Claude 規劃並監工一群工人——agent teams（記得它是實驗性的）。計畫由腳本持有、不走 Claude 逐回判断——dynamic workflows。

**工人要不要互相溝通？** Subagents 只向生出它的對話回報；agent view 的 session 只向你回報（要跨 session 傳話可以加 cross-session messaging）；只有 team 的 teammate 彼此直接傳訊、共享任務清單。

**會不會改到同一批檔案？** 會就用 worktree 隔離（下節）。特別注意：agent teams 不會把 teammate 放進各自的 worktree，官方建議的做法是自己切分工作，讓每個 teammate 負責不同檔案。

## Worktree 隔離：--worktree、.worktreeinclude、清理

[Git worktree](https://git-scm.com/docs/git-worktree) 是共用同一份 repo 歷史、但各自有檔案和分支的工作目錄。Claude Code 把它包成一個旗標：

```bash
claude --worktree feature-auth   # 或縮寫 -w
```

預設在 `.claude/worktrees/<名稱>/` 建 worktree、開一條 `worktree-<名稱>` 分支；不給名稱就自動生成一個（像 `bright-running-fox`）。另一個終端機再跑一次不同名字，就是第二個互不干擾的 session。官方提醒兩件小事：`.claude/worktrees/` 加進 `.gitignore`；第一次在某目錄跑要先接受 workspace trust 對話框，否則 `--worktree` 會直接報錯退出。

**Worktree 是乾淨的 checkout**，`.env` 這類沒進版控的檔案不會帶過去。要在每個新 worktree 自動複製，就在專案根目錄加 `.worktreeinclude`，語法同 `.gitignore`，而且只會複製「符合 pattern 又確實被 gitignore」的檔案：

```text
.env
.env.local
config/secrets.json
```

**清理是半自動的。** 互動 session 結束時，Claude 會檢查 worktree 裡有沒有未保存的工作：乾淨的無名 worktree 直接刪掉（含分支），有名字的會先問你；裡面有變更則問你要保留還是刪除。用 `-p` 跑的非互動 session 不會觸發清理，要自己 `git worktree remove`。Subagent 也能各自拿到 worktree——叫 Claude「use worktrees for your agents」，或在 `.claude/agents/` 定義裡寫 `isolation: worktree`；subagent 做完沒有變更，worktree 會被自動移除。Agent view 派發的背景 session 則是自動進自己的 worktree，不用你設定。

隔離不是君子協定：session 待在 worktree 期間，Claude Code 會擋下指向主 checkout 的檔案編輯、工作目錄落在主 checkout 的指令，以及用 `git -C` 之類手法把 git 導回主 checkout 的呼叫。

## 本叢集閱讀路徑

四種方式在系列裡各有一篇深挖，建議順序：

1. [Sub-agents 機制](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)：context 隔離、frontmatter 定義、背景執行——四種方式的共同基礎。
2. [Agent view](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view)：自己調度多個背景 session。
3. [Agent Teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide)：lead 加共享任務清單的協作模式。
4. [Dynamic Workflows](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows)：腳本化的規模化執行。

[系列入口](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)有整個系列的地圖。

## 參考資料

- [Run agents in parallel — Claude Code Docs](https://code.claude.com/docs/en/agents) — 本篇主要來源：四方式比較表、「誰協調／要不要互講／同批檔案」三題決策指引、輔助工具邊界
- [Run parallel sessions with worktrees — Claude Code Docs](https://code.claude.com/docs/en/worktrees) — `--worktree` 旗標、`.worktreeinclude` 複製規則、清理與隔離強制機制

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方 agents.md 與 worktrees.md 撰寫。
