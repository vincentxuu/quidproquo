---
title: "CS146S Week 4：CLAUDE.md 該寫什麼、hooks 該擋什麼、subagent 該切在哪"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - claude-code
  - agentic-coding
  - multi-agent
  - context-engineering
  - ai-agent
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 5
tldr: "課程把指揮 agent 的工具列成四件：指示檔、hooks、commands、subagents。指示檔是唯一每次開機都全額進 context 的，所以它是 config 不是 memory；hooks 補上「規則會被忽略、hook 不會」那一塊；commands 是四件裡唯一由人主動觸發的。課程另給一張表，把軟體任務七步驟裡只剩一步半標成人的工作。"
description: "拆解 Stanford CS146S Fall 2026 第四週「Customizing Your Agent and Repository」：CLAUDE.md 與 AGENTS.md 的分工、hooks 當成確定性閘門的用法、planner／implementer／reviewer 的 subagent 切法、課程列的第四件工具 commands，以及各自的失效模式。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-customization-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第五篇，對應 Fall 2026 的第四週。

課程主題三條：`CLAUDE.md` 與 `AGENTS.md` 各自該放什麼、用 hooks 做 lint gate 與測試閘門、以及 subagent 的 planner / implementer / reviewer 分工。客座是 Boris Cherny——Claude Code 的作者，Fall 2025 也講過一場，這次是 fireside Q&A。

課程實際列的是**四件**指揮工具（指示檔、hooks、commands、subagents）。它們看起來是四個功能，其實是**同一個問題的四種答案**：怎麼讓 agent 每次都照你們的做法做事，而不是每次都要重講一遍。

## 課程的分工表：哪幾格是人的

Fall 2025 對應的課堂是 Week 4「How to be an agent manager」，[投影片公開](https://docs.google.com/presentation/d/19mgkwAnJDc7JuJy0zhhoY0ZC15DiNpxL8kchPDnRkRQ/edit)，Boris Cherny 也是那一堂的客座。它開場先畫了一條演進線：單一開發者管自己的產出 → lead 管多名開發者 → lead 管多名開發者（有 AI 輔助）→ **單一開發者管多個 agent 的產出**。課程對終點的描述是「every developer operates as a tech lead controlling their own army of agents」。

然後它給了一張表，把一個軟體任務的七個步驟標上誰負責（🟩 人、🟦 agent）：

```
Provide high level requirements          🟩
Convert requirements into a design doc   🟩/🟦
Implement solution from doc              🟦
Add tests                                🟦
Ensure CI passes                         🟦
Code review                              🟦
Update docs                              🟦
```

**人只剩第一格，加上第二格的一半。** 這張表值得單獨看一分鐘——它把「agent manager」這個抽象說法變成一條可以對照自己現況的清單。你現在有幾格還是自己在做？

課程接著列出**四件指揮工具**，我上面只寫了三件：

## 指示檔：config，不是 memory

`AGENTS.md` 是 OpenAI 在 2025 年 8 月提出的格式，現在由 Linux Foundation 底下的 [Agentic AI Foundation](https://aaif.io/) 託管，[官網自述](https://agents.md/)被「over 60k open-source projects」採用，支援清單包含 Codex、Cursor、Copilot coding agent、Gemini CLI、Devin、Warp、Zed、Factory 等等。Claude Code 讀的則是 `CLAUDE.md`。

兩者格式都是純 Markdown，沒有必填欄位。agents.md 的 FAQ 講得直白：「AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide.」

**該放什麼？** agents.md 給的清單是：專案概觀、build 與測試指令、程式風格、測試指示、安全注意事項。它的判準是「anything you'd tell a new teammate」。

**不該放什麼？** 這裡有個容易踩的坑。Anthropic 在 [context 工程文](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)裡描述 Claude Code 的做法時說得很清楚：「`CLAUDE.md` files are naively dropped into context up front」——**naively、up front**，也就是無條件、全額、每次。

這代表指示檔是**唯一沒有 progressive disclosure 保護的那一層**。skill 有三層機制（見 [Week 3](/posts/ai/2026-08-16-cs146s-agent-skills)），檔案要用才讀，工具定義可以按需載入，只有指示檔是每次都整份進場。

所以失效模式不是「找不到」，是**稀釋**：你寫了三百行，其中真正重要的五條就被另外兩百九十五行拉低了相對權重。判準是：

- 每次都適用的硬規則 → 指示檔
- 某類任務才需要的流程 → skill
- 某個目錄才適用的規則 → 巢狀指示檔（agents.md 支援，「The closest AGENTS.md to the edited file wins」；OpenAI 自己的主 repo 就有 88 個）

同時用兩家工具的話，常見做法是留一份 `AGENTS.md` 當單一真相，`CLAUDE.md` 用一行 import 指過去，而不是維護兩份會漂移的副本。

本站的 `CLAUDE.md` 是把它當 config 寫的例子：開頭直接是一張行動分級表（Tier 0 自主執行 / Tier 1 過閘門 / Tier 2 先問再做 / Tier 3 禁止），把「什麼可以直接做、什麼要先問」變成查表，而不是散落在段落裡的叮嚀。

## hooks：規則會被忽略，hook 不會

指示檔跟 skill 有一個共同的弱點：**它們是建議**。模型多數時候會遵守，但「多數時候」在 CI 上不夠用。

hooks 補的就是這一塊——課程的定義是「deterministic scripts that run on predefined event types」，並點名幾個事件：**PreToolUse、PostToolUse、UserPromptSubmit、PreCompact**。結果不看模型心情。典型用法：

| 時點 | 跑什麼 | 擋掉什麼 |
|---|---|---|
| 編輯檔案後 | formatter / linter | 風格漂移、語法錯 |
| 執行指令前 | 指令白名單檢查 | 誤刪、誤推 |
| 任務結束前 | 測試、type check | 「我改好了」但根本沒跑過 |
| commit 前 | 專案的整套驗證 | 紅的東西進 repo |

本站的做法是最後一種：`package.json` 裡設定 `"simple-git-hooks": { "pre-commit": "pnpm verify" }`，而 `pnpm verify` 一次跑完 lint、內部引用檢查、skill 目錄同步檢查與 `progress.txt` 協定檢查。CLAUDE.md 裡對應一條 Tier 3 規則寫著不准用 `--no-verify` 繞過。

**hook 的價值不在自動化，在不可協商。** 一條寫在指示檔裡的「commit 前請跑測試」是規則；一個 pre-commit hook 是閘門。差別在你要不要在三個月後還相信它。

Factory 在 [agent readiness](https://factory.ai/news/agent-readiness) 的文章裡從另一個角度講同一件事：「Missing pre-commit hooks mean the agent waits ten minutes for CI feedback instead of five seconds.」對 agent 來說，hook 不只是守門員，也是把回饋迴圈從十分鐘壓到五秒的東西。這條線直接接到 [Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)。

## Commands：我漏掉的第四件

課程列的四件指揮工具是 agent behavior files、hooks、**commands**、subagents。前面三件我都寫了，commands 那件我原本整段沒有。

課程給的定義很短：**把常用的 prompt 存成檔案讓 agent 執行**。舉的用途是跑測試、review 程式碼、產生 commit 並 push。

它跟另外三件的分界是這樣的：

| | 誰觸發 | 是什麼 |
|---|---|---|
| 指示檔 | 自動，每次 | 一直都成立的規則 |
| hook | 自動，特定事件 | 不可協商的閘門 |
| **command** | **你手動叫** | **一段你懶得重打的 prompt** |
| subagent | agent 自己決定 | 隔離的 context |

**command 是四件裡唯一由人主動觸發的**。它解的問題不是「agent 會不會遵守」，是「我不想每次都重打同一段話」。這也是為什麼它最容易被跳過——沒有它東西也能跑，只是你會一直重複打字。

判斷要不要做成 command 很簡單：同一段 prompt 你打過三次以上，就該存起來。

## subagent：切的是 context，不是任務

課程列的是 planner / implementer / reviewer 這組分工，並把 subagent 定義成「runtime delegation」，用途有兩個：替不同工作型態建立不同的 developer persona，以及**乾淨地分離各工作流的 context**。課程說它提供「customized system prompts, tools, and a separate context window」，並形容這是「a move toward agents managing other agents」。

要注意的是，subagent 真正的機制不是「分工」——那只是表象——而是**context 隔離**。

Anthropic 的說法是：子 agent 各自用乾淨的 context 深挖，「Each subagent might explore extensively, using tens of thousands of tokens or more, but returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)」。

這個比例就是全部的價值。主線只拿到結論，中間那幾萬 token 的探索過程留在子 agent 裡。

什麼時候該切：

- **要探索很多才能回答一句話**——「這個 repo 哪裡在處理權限？」讀二十個檔案，回一段話
- **要獨立視角**——reviewer 不該看過 implementer 的推理過程。這跟 [Week 2 的 RePPIT](/posts/ai/2026-08-16-cs146s-context-engineering) 那條鐵律是同一件事：寫 code 的 instance 不准 review 自己的 code
- **平行且互不相依**——五個獨立檔案各自改，開五個

什麼時候不該切：

- 任務本身很短——啟動成本比省下來的多
- 子任務之間要頻繁交換中間狀態——那個交換本身就會把省下的 context 吐回來
- 你只是想「看起來比較有架構」

Anthropic 對這類選擇的總結態度值得抄：「do the simplest thing that works」。

## 課程自己的五條 best practice

投影片最後給了五條，每一條都很具體：

- **要有 backstop**：codebase 裡的測試與 CI/CD 慣例。沒有這層，前面四件工具都只是建議
- **可稽核性——「Label every diff made by an agent」**。這條我原本完全沒想到，但它是事後追責的唯一依據
- **不同任務用不同模型**：課程原話是「Opus for planning, sonnet as a workhorse」
- **複雜任務前期多牽一點**，越接近全非同步的任務才越能放手
- **定期 checkpoint（commit）**

課程也留了兩個沒有答案的問題：「How can we automate the first 10-20% research phase of any task?」與「How to maintain a queue of pending tasks?」——第一題正好是 [Week 2 RePPIT 的 Research 步驟](/posts/ai/2026-08-16-cs146s-context-engineering)在處理的事。

另外一句提醒值得抄進任何一份指示檔的開頭。課程在講 `CLAUDE.md` / `.cursorrules` / `AGENTS.md` / `llms.txt` 這幾種設定檔時補了一行：

> Note: The agents won't always adhere to these descriptions/directives. They are intended as guidance.

**課程自己講明了指示檔是建議不是保證**——這正是 hook 存在的理由。

## 四件怎麼組起來

一個合理的收斂順序：

1. 先寫指示檔的**十行版本**：怎麼 build、怎麼測、什麼絕對不要碰
2. 觀察 agent 實際在哪裡出錯
3. 錯得可以被程式抓到的 → 變成 hook
4. 錯在流程不知道怎麼走的 → 變成 skill
5. 錯在 context 被無關內容塞爆的 → 變成 subagent
6. 你重複打了三次以上的 prompt → 變成 command
7. 只有剩下的、每次都適用的硬規則才留在指示檔裡

倒過來做——先寫三百行指示檔——是最常見的順序，也是最沒效的順序。

## 會過期的東西

- Claude Code 目前讀 `CLAUDE.md` 而非 `AGENTS.md`，這件事隨版本可能改變，實作前請查當下的官方文件
- agents.md 的 60k 專案數是官網自述（連到 GitHub 搜尋結果），不是第三方統計
- 本站的 hook 設定是 2026-08-16 當下的狀態

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 4 主題與客座
- [AGENTS.md](https://agents.md/) — 格式說明、支援清單、巢狀規則與 FAQ
- [Agentic AI Foundation](https://aaif.io/) — AGENTS.md 現在的託管單位
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic Engineering，Fall 2025 Week 4 指定讀物
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering，subagent 與指示檔載入方式
- [How to be an Agent Manager](https://docs.google.com/presentation/d/19mgkwAnJDc7JuJy0zhhoY0ZC15DiNpxL8kchPDnRkRQ/edit) — Fall 2025 Week 4 課堂投影片，人／agent 分工表與四件指揮工具
- [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit) — Fall 2025 Week 3 課堂投影片，設定檔清單與「agents won't always adhere」那句
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，2026-01-20，pre-commit hook 對回饋迴圈的影響
