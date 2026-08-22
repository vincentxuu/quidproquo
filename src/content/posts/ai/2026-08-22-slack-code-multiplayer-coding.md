---
title: "Slack Code：多人協作 AI Coding 與 Agent 控制平面的競爭版圖"
date: 2026-08-22
category: ai
type: deep-dive
tags: [slack, agentic-coding, multiplayer-coding, agent-harness, claude-code, developer-tools, collaboration]
lang: zh-TW
tldr: "Slack Code 把 AI coding agent 從開發者的終端搬進 Slack 頻道，讓團隊即時看到 diff、預覽與計畫。但它解決的是管理層的透明度焦慮，不是工程師的生產力瓶頸——真正的戰場在「誰當 agent 的控制平面」。"
description: "Slack Code 的運作機制、首發合作夥伴、與 Superconductor、Amika、Shake 等十幾家 multiplayer AI coding 平台的競品比較，以及 Salesforce 平台策略的分析。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-slack-code-multiplayer-coding-en)

2026 年 8 月 20 日，Salesforce 在 Dreamforce 2026 發佈 [Slack Code](https://slack.com/blog/news/slack-code-channels-for-agents)。Marc Benioff 在推文裡寫：「Don't code alone. Humans and agents. Same channel. Same work.」核心主張很簡單——目前大多數 AI coding 工作是一個人在終端機裡跟 agent 互動，團隊只看到最後的 PR。Slack Code 要把這個過程攤開，變成所有人都能看到、介入、批准的「多人協作」。

這篇會拆三件事：Slack Code 本身的機制、它身處的競品版圖、以及這場「誰來當 agent 控制平面」的平台之爭背後的利害計算。

## Slack Code 的運作機制

流程是：在任何 Slack 對話裡 @tag 一個 coding agent → agent 自動建立一個叫 Code Channel 的專案頻道，拉入相關團隊成員 → 頻道裡有獨立分頁顯示對話、計畫、code diff、HTML 即時預覽 → 任何人可暫停、重新導向或停止 agent → 高風險操作（如 merge to production）需要人工簽核 → 完成後頻道自動歸檔，保留可搜尋的稽核紀錄。

首發 agent 合作夥伴有五家：

| 合作夥伴 | Agent | 整合方式 |
|---|---|---|
| [Anthropic](https://www.anthropic.com/) | Claude Tag / Claude Code | 從頻道對話啟動 Code Channel，原始 thread 可看摘要 |
| [Cognition](https://cognition.ai/) | Devin | 自帶瀏覽器做 DevTools 測試，產出截圖與錄影 demo |
| [GitHub](https://github.com/features/copilot) | Copilot | 非技術成員用自然語言描述問題，agent 起草修復 |
| [Vercel](https://vercel.com/) | Vercel Agent | 部署後即產生 live preview 連結貼回頻道 |
| [OpenAI](https://openai.com/) | ChatGPT | 即將上線，尚未 live |

[Slack 官方 blog](https://slack.com/blog/news/slack-code-channels-for-agents) 稱超過 70% 的 code channel 在一天內從想法走到 merged PR。Slack Code 適用所有 Slack 方案，agent 存取權是獨立購買。

值得注意的是，[Benioff 不是突然想做這個](https://thenextweb.com/news/slack-code-ai-coding-channels-launch)。TNW 在 2026 年 5 月報導 Salesforce 預計今年在 Anthropic token 上花 3 億美元，同一篇就提到 Benioff 想把 coding 拉進 Slack。三個月後交貨。

## 這不是 Slack 獨有的想法

Slack Code 代表的「多人協作 AI coding」賽道，2026 年已經擠滿了玩家。根據 [Nori 的 control plane 比較](https://noriagentic.com/newsletter/2026-07-19-ai-coding-agent-control-planes.html)和 [Agent Cockpit Wars 分析](https://broomva.tech/writing/agent-cockpit-wars)，這個市場至少分成四層。

### 聊天優先型：跟 Slack Code 直接競爭

[Amika](https://www.amika.dev/) 讓工程師和非工程師從 Slack、Linear、GitHub 或 CLI 啟動雲端 agent，同一個 session 支援多人即時協作與接手。它支援 Claude Code、Codex、OpenCode，不綁定單一模型。跟 Slack Code 最大的差異在 Amika 自己提供沙盒化的雲端執行環境，而不是只在聊天介面裡看結果。

[Replicas](https://www.ycombinator.com/)（YC Spring 2026）走的是類似路線：從 Slack、Linear、GitHub 或 API 派任務，agent 在隔離的 VM 裡跑 Claude Code 或 Codex，完成後交回 PR。它的計費方式是按活躍 workspace 分鐘收費。

### 專屬多人工作區

這一層的產品不是把 agent 塞進既有聊天工具，而是從頭設計一個「團隊 + agent 共用的工作空間」。

[Superconductor](https://www.superconductor.com/) 目前是覆蓋面最廣的：支援 Claude Code、Codex、Amp、Factory Droid、Grok Build、OpenCode、Pi、Cursor 等 agent，提供 shared session、live preview、引導式 code review，而且有一個獨特功能——用你自己 codebase 的真實 PR 對 agent 做 benchmark 比較。目前免費使用，使用者自備 API key。

[Shake](https://shake.dev/) 用看板模式切入：AI agent 跟人類工程師並列在同一張 kanban board 上，都是 card 的 assignee。指派一張 card 給 Shake，它讀 codebase、寫程式、開 PR、部署、回報——全部在同一個 thread 裡完成。PM 和工程師在同一個介面裡追蹤進度。

[Poly](https://usepoly.co/) 更聚焦：它就是「多人的 Claude Code」。一間共用房間，每個人可以選不同的模型和 thinking effort，但每個 prompt、每個 diff、每筆花費對所有人可見。目前 open beta 免費。

其他值得注意的還有：[Delta](https://delta.dev/) 把對話和 worktree 做成同一個複製空間，review 的 comment 會跟著程式碼演進；[Nimbalyst](https://nimbalyst.com/teams/) 是開源的視覺化工作區，agent 可以編輯共享的文件、mockup 和圖表；[YappJam](https://yappjam.com/) 加了內建語音和視訊聊天；[Modulus](https://modulus.so/) 做的是 agent 對 agent 的協作，有跨 repo 的 shared memory。

### 控制平面與排程器

這一層不做前端介面，做的是 agent 的「作業系統」——排程、觸發、組織記憶、跨 session 管理。

[Tembo](https://tembo.ai/) 從 Slack、Linear、GitHub、排程或 webhook 啟動 agent，前台開發在 live cloud session 裡做，後台 agent 完成後回報。Nori 比較文認為 Tembo 是最接近完整控制平面的競品。

[Traycer](https://traycer.com/) 自稱「agentic coding 的神經中樞」，讓 Claude Code、Codex、OpenCode 和 Cursor 在同一個 workspace 裡跑，內建規劃、除錯、review、文件產生等 workflow。

[Nori Sessions](https://noriagentic.com/) 則是 flat $50/runtime/月，支援 cron 與 webhook 觸發、Slack 和 Discord 控制、可攜式的組織 skillset——它最大的賣點是「你不需要因為 agent 不同就換一套流程」。

### 平台型玩家：自己做 agent 也做控制面

Cursor 被 SpaceX 收購後推出了 Cursor 3，可以同時跑最多 8 個平行 agent 在雲端 VM 裡。Codex App 是 OpenAI 的桌面端 command center，有 Skills 系統（Figma、Linear、Vercel 整合）和 Automations（排程 agent）。這兩家做的不是包裝別人的 agent——它們自己就是 agent，自然也是控制平面。

## 真正的問題：Slack Code 對誰有用

回到 Slack Code。它解決的核心問題是**可見性**，不是生產力。

Constellation Research 分析師 [R "Ray" Wang 在 InfoWorld 的報導](https://www.infoworld.com/article/4212494/salesforce-wants-to-move-ai-coding-into-a-shared-workspace-with-slack-code.html)裡直接講了：「Coding is deep work, and Slack is the interruption machine. Putting them on the same surface is not automatically a win.」多人同時介入可能造成 agent 反覆調整方向，大型企業可能產生數百個 code channel 造成通知疲勞。

Slack Code 最適合的場景很窄：明確、小範圍、跨職能的任務——改個文案、修個按鈕、做個內部工具原型。PM 直接 tag agent，設計師丟 Figma 檔進頻道，agent 整合產出，工程師最後 review。這條路走得通是因為任務本身不複雜，不需要深度專注。

複雜的工程工作——重構、效能調校、系統設計、跨服務的 bug 追蹤——不會因為搬到 Slack 頻道就做得更好。這類工作需要的是一個人（或一組人）長時間持有完整上下文，而不是讓一個頻道裡所有人即時圍觀。VentureBeat 的報導引用 Slack EVP Rob Seaman 也承認：[「There's going to be deep, immersive, intensive, single-player thought work that's going to happen in terminals.」](https://venturebeat.com/orchestration/slack-wants-to-drag-ai-coding-out-of-the-terminal-and-into-the-group-chat)

同一篇 InfoWorld 報導也提出安全疑慮：Slack 頻道的成員資格不該自動等於 code repo 的存取權限。把某人加進一個 code channel，是否就等於授權他存取底層程式碼？這是一個尚未被回答的權限升級風險。

## 「Agent 可以換，控制平面才是產品」

Agent Cockpit Wars 分析文的結論是：[「The agent is interchangeable. The control plane is the product.」](https://broomva.tech/writing/agent-cockpit-wars) 這句話精確描述了 Slack Code 的戰略位置。

Salesforce 不自建 coding agent。它讓 Anthropic、Cognition、GitHub、Vercel、OpenAI 各家進來打，Slack 當入口。每家 agent 要觸及企業客戶，得先上 Slack——就像 app 要上 App Store。Salesforce 擷取的是工作流程的 context 和使用數據，不是模型本身的價值。

這個邏輯成立的前提是：夠多的工作真的會發生在 Slack 裡。目前看來，Slack Code 只吃到簡單任務那一塊。但 Slack 的優勢是既有 500 多個 AI app 在它的 marketplace 裡，而且「對話開始的地方」天然是最容易讓 agent 介入的地方。軟體工程是第一步；Slack 已經預告 code channel API 會開放，行銷和法務的 agent channel 也在規劃中。

真正的風險不是 Slack Code 做不好，而是開發者不買單。瀏覽器、IDE、終端機都試過當「萬用入口」，最後開發者幾乎總是回到最適合那件事的工具。Slack 能不能打破這個慣性，取決於它處理的工作量是否真的「夠多」——目前那 70% 一天內關閉的 code channel，說的可能不是效率，而是任務本身就不需要超過一天。

## 整體來說

Slack Code 是 Salesforce 的平台聚合策略，不是工程師的生產力工具。它把 AI coding 工作的可見性問題包裝成「multiplayer coding」，讓管理層和跨職能團隊能看到、介入 agent 的工作過程。

對工程團隊來說，值得觀察但不需要急著採用。真正複雜的工程工作不會從終端搬到 Slack。如果團隊已經有跨職能的簡單任務需要 agent 處理（改文案、修 bug、做原型），Slack Code 能減少一些 ticket 和會議。如果工作本身就是深度技術工作，繼續留在終端和 IDE 裡用 Claude Code 或 Cursor 更合理。

更值得關注的是整個「agent 控制平面」賽道的收斂方向。Agent 本身越來越可替換，差異化在往控制面移動——排程、觸發、團隊可見性、組織記憶、跨 agent 協調。Slack Code 用 Slack 的既有安裝基礎搶入口，Superconductor 和 Tembo 用深度整合搶工作區，Cursor 和 Codex App 用自有模型搶整個堆疊。這場仗還沒打完。

## 參考資料

- [Slack Code: Where Your Team and Agents Build Together](https://slack.com/blog/news/slack-code-channels-for-agents)
- [Slack Code 產品頁](https://slack.com/features/code-channels)
- [The Verge — Slack is launching collaborative vibe-coding channels](https://www.theverge.com/tech/982628/slack-code-vibe-coding-channels-launch)
- [SiliconANGLE — Salesforce introduces Slack Code](https://siliconangle.com/2026/08/20/salesforce-introduces-slack-code-to-bring-agentic-team-coding-into-the-open/)
- [VentureBeat — Slack wants to drag AI coding into the group chat](https://venturebeat.com/orchestration/slack-wants-to-drag-ai-coding-out-of-the-terminal-and-into-the-group-chat)
- [InfoWorld — Salesforce wants to move AI coding into a shared workspace](https://www.infoworld.com/article/4212494/salesforce-wants-to-move-ai-coding-into-a-shared-workspace-with-slack-code.html)
- [The Next Web — Slack launches Slack Code](https://thenextweb.com/news/slack-code-ai-coding-channels-launch)
- [The Register — Slack Code taps into collective vibe](https://www.theregister.com/saas/2026/08/20/slack-code-taps-into-collective-vibe-puts-ai-agents-into-the-group-chat/5290413)
- [Gizmodo — Slack Has Launched a Vibe Coding Tool](https://gizmodo.com/slack-has-of-course-launched-a-vibe-coding-tool-2000800885)
- [RuntimeWire — Slack launches Code with Anthropic, GitHub, Cognition and Vercel agents](https://runtimewire.com/article/slack-code-anthropic-github-cognition-vercel-agents)
- [Agent Cockpit Wars: Evaluating the New Wave of AI Coding Orchestrators](https://broomva.tech/writing/agent-cockpit-wars)
- [The Best AI Coding Agent Control Planes in 2026 — Nori](https://noriagentic.com/newsletter/2026-07-19-ai-coding-agent-control-planes.html)
- [Superconductor](https://www.superconductor.com/)
- [Amika](https://www.amika.dev/)
- [Shake](https://shake.dev/)
- [Poly](https://usepoly.co/)
- [Delta](https://delta.dev/)
- [Nimbalyst](https://nimbalyst.com/teams/)
- [YappJam](https://yappjam.com/)
- [Modulus](https://modulus.so/)
- [GitHub Copilot coding agent — GitHub 的 coding agent 介紹](/posts/ai/2026-04-18-github-copilot-coding-agent-guide)
- [企業內部 AI Coding Agent 導入](/posts/ai/2026-04-04-internal-ai-coding-agents)
