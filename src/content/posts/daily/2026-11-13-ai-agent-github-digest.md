---
title: "AI Agent GitHub Digest — 2026-11-13"
date: 2026-11-13
category: daily
tags: [ai-agent, github, open-source, daily, agno, pydantic-ai, human-in-the-loop, mcp]
lang: zh-TW
description: "Pinky 讓 agent 操作你的真實手機、Studsmith 讓 agent 幫你寫 Roblox 遊戲，但 Agno v3.2 同時把「誰能核准 agent 的動作」收緊成大版本升級"
tldr: "DIYgod 的 Pinky 用獨立 gateway 讓 Claude Code 等 agent 操作真實 iPhone/Android，核准機制跟 agent 本身分離；Agno v3.2 是今天最大的框架更新，A2A 升級到官方 1.0 協定、Slack 介面改用 Bolt SDK，兩者都是 breaking change。"
series:
  name: "AI Agent GitHub Digest"
  order: 90
---

> 🌏 [English version](/posts/daily/2026-11-13-ai-agent-github-digest-en)


## 今日亮點

今天的 trending repos 都在把 agent 的「手」伸到新地方——Pinky 讓 agent 操作一支真實的 iPhone 或 Android，Studsmith 讓 agent 直接幫你在 Roblox Studio 裡寫 Luau、Download Anything 讓 agent 自己下載論文和影片並整理成 Obsidian 可讀的筆記。但同一天框架這邊的動作完全相反：Agno v3.2 用一次大版本升級收緊「誰能核准 agent 的動作」——Slack 介面改寫後預設只有發起任務的人能按 Approve，連 A2A 協定都升級到官方 1.0 來統一跨 agent 溝通的規格。執行範圍在擴張，核准機制在收緊，剛好是同一天的兩條反方向訊號。

```diagram
title: 今天四個訊號：執行邊界擴張、核准機制收緊
desc: 三個 trending repo 把 agent 能操作的範圍往外推，Agno v3.2 同時把核准權收緊
caption: 示意：本文用來分類今天四個項目的重點,不是正式的產業分層
---
<svg viewBox="0 0 480 300">
  <rect class="dg-box dg-box--accent" x="16" y="16" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="36" dominant-baseline="central">手機</text>
  <text class="dg-label" x="104" y="36" dominant-baseline="central">真實 iPhone / Android</text>
  <text class="dg-sub" x="104" y="58" dominant-baseline="central">Pinky・approval gateway 跟 agent 分離</text>

  <rect class="dg-box" x="16" y="80" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="100" dominant-baseline="central">遊戲引擎</text>
  <text class="dg-label" x="104" y="100" dominant-baseline="central">Roblox Studio + Luau</text>
  <text class="dg-sub" x="104" y="122" dominant-baseline="central">Studsmith・plan → 寫碼 → diff → playtest</text>

  <rect class="dg-box" x="16" y="144" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="164" dominant-baseline="central">資料歸檔</text>
  <text class="dg-label" x="104" y="164" dominant-baseline="central">下載 + 結構化筆記</text>
  <text class="dg-sub" x="104" y="186" dominant-baseline="central">Download Anything・配套字幕/引用/元資料</text>

  <rect class="dg-box dg-box--warn" x="16" y="208" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="228" dominant-baseline="central">核准收緊</text>
  <text class="dg-label" x="104" y="228" dominant-baseline="central">A2A 1.0 + Slack Bolt</text>
  <text class="dg-sub" x="104" y="250" dominant-baseline="central">Agno v3.2・breaking change</text>
</svg>
```

## Trending Repos

### DIYgod/pinky ⭐ 1,992（上線 1 週）

[GitHub](https://github.com/DIYgod/pinky)　·　Go　·　Apache-2.0

- **是什麼**：讓 Claude Code、Claude Desktop、Codex、Cursor 或任何能接 MCP 的 agent，透過 MCP 操作一支真實的 iPhone 或 Android 手機，使用者在電腦上即時看著畫面、批准風險步驟、隨時接手。
- **為什麼值得看**：核准邏輯是作者刻意設計成「agent 管不到」的——風險動作（付款、轉帳、交易）要等使用者點擊才會送出,這條規則跑在 Pinky 自己的 gateway,不是靠提示詞要求 agent 自律,就算畫面上的文字試著說服 agent 自己核准也沒用。銀行、錢包、密碼管理器類 App 預設對 agent 隱形,agent 也打不進密碼或一次性驗證碼欄位。app 本身不用 Electron,原生視窗閒置時只佔約 70MB 記憶體、0% CPU。目前狀態是 pre-alpha,Claude Code 已經在真機(USB 接的 Android、iOS 27 上的 iPhone)跑過完整流程。
- **tech stack**：Go + 原生 GPU 繪圖(MyGo,無 Electron/webview)+ MCP server + Android/iOS 裝置驅動層
- **上手難度**：中——macOS/Windows/Linux 都有獨立安裝包,但要先在 Settings › Agents 把 agent 接上,且目前仍是 pre-alpha

---

### RapidSailorFreeze/studsmith ⭐ 95（上線 5 天）

[GitHub](https://github.com/RapidSailorFreeze/studsmith)　·　Windows 應用程式　·　免費

- **是什麼**：專門給 Roblox Studio 用的 AI coding agent——用自然語言描述想要的功能,agent 生出計畫、寫 Luau 程式碼、在套用前先讓你看 diff,還有自己的 playtest 迴圈會跑遊戲、讀錯誤訊息、自動修。
- **為什麼值得看**：跟通用 coding agent 不同,它把範圍收得很窄,只服務一個垂直場景(Roblox 遊戲開發),換來的是跟引擎對接更深的功能——直接在遊戲裡建立/排列物件、每個修改都有還原點可以單獨 undo、支援接自己的 API key 或本機模型。app 還沒做程式碼簽署,Windows SmartScreen 會跳警告,但每個 release 都附 SHA-256 雜湊可以自行驗證下載內容。
- **tech stack**：Windows 桌面應用 + Luau 程式碼產生 + Roblox Studio 整合 + 內建 playtest 迴圈
- **上手難度**：低——下載 zip、解壓、執行 `Studsmith.exe`,但目前只有 Windows 版

---

### nengong/download-anything ⭐ 221（上線 9 天)

[GitHub](https://github.com/nengong/download-anything)　·　Python　·　README 標示 MIT

- **是什麼**：同時當 CLI 跟 AI Agent Skill 用的全能下載工具——把分享口令、原始連結、DOI 或 ISBN 丟給它,就能下載影片、文章、論文、電子書、網盤檔案,並自動整理配套資料。
- **為什麼值得看**：重點不在「能下載」而在「下載完直接能用」——除了主檔案,還會同步抓字幕、封面、獨立音軌、BibTeX 引用、去盜鏈圖片跟結構化 metadata,格式設計成可以直接餵給 AI agent 摘要或歸檔進 Obsidian。完整性驗證也做得仔細:用 `ffprobe` 檢查音視訊雙軌跟時長、`pypdf`/`Pillow`/`zipfile` 檢查文件跟壓縮格式,避免把 HTML 錯誤頁或壞檔誤判成下載成功。安裝走 Agent Skill 慣例,直接把 repo 網址丟給 Claude Code 或 Codex 就能自動裝。
- **tech stack**：Python 3.10+ CLI + Claude Code/Codex Agent Skill 封裝 + ffprobe/pypdf/Pillow 完整性驗證
- **上手難度**：低——把安裝指令丟給 agent 就會自己 clone、裝相依、連結 skill 目錄

## Notable Releases

### Agno v3.2.0

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)

- **重要變更**：Super Agent 改成自己直接做事,不再透過 manager members 轉發,Platform Builder 是它唯一的 member;新增 Company OS 的 Task 協作(`last_run`、API 算出的 `allowed_transitions`、durable attempt 狀態)跟專門跑 Routine 的 Mini Agent(被排除在 agent discovery、MCP、A2A 之外);新增 database-backed 的 AgentOS 首頁指標(sessions、runs、tokens、cost、延遲等每日聚合)。
- **Breaking Changes**：A2A 升級到官方 `a2a-sdk` 1.x,`/v1/message:*` 跟 `/v1/tasks:*` 路由直接移除,要改用每個 entity 自己的 A2A endpoint;Slack 介面改寫成跑在 Slack Bolt SDK 上,預設只有發起任務的人能按 Approve/Deny,除非被列進 `approvers=` 或透過 `users=` 對應到同一人;`OSManager.tool_call_limit` 預設從 8 改成 24,`num_history_runs` 預設從 7 改成 5。
- **對你的影響**：有接 A2A 或 Slack 介面的話,這個版本不能只是 `pip install -U`——A2A client 跟 server 要一起升級,Slack 要補裝 `slack_bolt>=1.29,<2` 跟 `slack_sdk>=3.43,<4`,舊的核准名單設定也要重新檢查,不然原本能核准的人可能突然按不動 Approve。

---

### pydantic-ai v2.68.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)

- **重要變更**：新增 `RequestInput`,讓 agent 在 run 中途就能要求使用者核准或回答,`AskUser` 被搬進 deferred pipeline,deferred 的呼叫會多標 `kind` 跟 `answered_by`;新增 `OutputTokenLimitExceeded`,回應被 `max_tokens` 截斷時 `ModelFallback` 會自動改用下一個 model 重試;`PromptInjectionDefender` 的語意分類現在跑在 durable operations 上,因此可以搭 Temporal 用。
- **Breaking Changes**：user/tool content 裡長得像應用程式框架的文字,現在當成一般文字處理,不再自動跳脫(可能改變既有輸出的格式);子 agent 的 task-control 事件改名加上 `Event` 字尾跟過去分詞,並新增 `agent_name`、`parent_task_id` 欄位,舊名稱保留為 deprecated alias。
- **對你的影響**：如果你用 pydantic-ai 做需要人在中途核准的 agent 流程,`RequestInput` 直接提供了這塊,原本要自己兜 deferred tool 的做法可以簡化;用舊版 task-control 事件名稱的程式碼還能跑,但建議趁這次一起換成新名稱。

## 今日收穫

原本以為「agent 能操作什麼裝置」跟「agent 的核准機制夠不夠嚴」是兩條獨立的技術路線,各自往前推進;但今天同一批動態擺在一起才看清楚——Pinky 把核准權完全移出 agent 本身、做成獨立 gateway,Agno v3.2 把 Slack 的核准權收斂到「只有發起人能按」,兩個完全不相關的專案,同一天用不同的實作方式回答同一個問題:執行範圍越廣,核准這一步就必須越難被 agent 自己繞過。

## 參考資料

- [DIYgod/pinky — GitHub repo](https://github.com/DIYgod/pinky)
- [RapidSailorFreeze/studsmith — GitHub repo](https://github.com/RapidSailorFreeze/studsmith)
- [nengong/download-anything — GitHub repo](https://github.com/nengong/download-anything)
- [Agno v3.2.0 — Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [Agno PR #11572 — Super Agent 與 Company OS](https://github.com/agno-agi/agno/pull/11572)
- [Agno PR #10956 — A2A v1.0 升級](https://github.com/agno-agi/agno/pull/10956)
- [Agno PR #11599 — Slack Bolt SDK 改寫](https://github.com/agno-agi/agno/pull/11599)
- [pydantic-ai v2.68.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)
- [pydantic-ai PR #12757 — RequestInput / AskUser deferred pipeline](https://github.com/pydantic/pydantic-ai/pull/12757)
- [pydantic-ai PR #12407 — OutputTokenLimitExceeded / ModelFallback](https://github.com/pydantic/pydantic-ai/pull/12407)
