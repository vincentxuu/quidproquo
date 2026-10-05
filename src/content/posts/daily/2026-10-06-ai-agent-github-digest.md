---
title: "AI Agent GitHub Digest — 2026-10-06"
date: 2026-10-06
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-skill, coding-agent]
lang: zh-TW
description: "一組讓 Claude 把任何 App 複刻一遍的十一個 skill 衝上 469 星；同一批冒出的還有把 Codex 內建生圖接給任何 agent 用的 MCP、一個用 coding agent 把插畫變成會眨眼立繪的本地編輯器，以及把論文翻成好讀中文的本地閱讀器"
tldr: "**replica-skill**（469★）是十一個串接起來的 Claude skill，依序逆向工程、重建、測試、找出使用者抱怨的痛點再修正，最後幫你把複刻出來的 App 部署上線；**qiaomu-codex-imagegen**（91★）把 Codex 內建、原本只有 Codex 自己能用的生圖功能包成 MCP + CLI + Skill，讓任何 agent 都能用；**mesh-avatar-studio**（228★）讓 coding agent 讀一張插畫、自動切層打骨架，再用本地編輯器微調出一個會眨眼、說話、轉頭的 2D 立繪；**easyread**（803★）是本地運行的英文論文閱讀器，PDF 逐頁翻譯成中文、公式用 KaTeX 排版、可隨時切回原文對照。框架這邊，Mastra 在 10/5 發布 @mastra/core@1.74.0，讓 tool 執行時能直接讀到完整對話記錄，並改動了 Playground UI 的 trace 分頁 API（breaking change）。"
series:
  name: "AI Agent GitHub Digest"
  order: 52
---

> 🌏 [English version](/en/posts/daily/2026-10-06-ai-agent-github-digest-en)

## 今日亮點

今天上升的幾個 repo 場景差很多——複刻一整個 App、幫論文翻譯排版、把插畫變成會眨眼的立繪、幫生圖工具挑風格方向——但做法出奇地像：都是把一串本來要很多步驟、很多工具才能做完的事，收進一條 agent 可以照著走的流程，而不是再推一個更聰明的通用大腦。

## Trending Repos

### replica-skill ⭐ 469（上線 3 天）

[GitHub](https://github.com/Jakeschincariol/replica-skill)　·　Python　·　MIT

- **是什麼**：十一個串接起來的 Claude skill，依序把任何 App 逆向工程成畫面／流程／元件／資料模型地圖、規劃 tech stack 與資料庫、重建設計系統、照地圖把畫面蓋出來、接上驗證／金流、跑過每個流程測 bug、對照原版打出落差分數，最後幫你取名、寫 landing page、部署到自己的網域。
- **為什麼值得看**：作者刻意把紅線畫在「複刻功能與流程，不碰對方的程式碼、商標、文案或內容」，而且有一個專門讀真實評論裡「使用者討厭什麼」再轉成修正清單與定位角度的 `/replica-entrepreneur` skill——等於把「抄一個功能相近的產品」跟「做出比原版更好用的版本」這兩件事分開處理,前者速度快,後者才是真正難的地方。
- **Tech stack**：Claude Code Agent Skills（可用 plugin 或直接複製資料夾安裝）+ Python 3.8+ 工具
- **上手難度**：低——貼安裝指令或裝成 plugin 即可，不需要額外註冊或 API key，但十一步要按順序依序執行才有效果。

---

### qiaomu-codex-imagegen ⭐ 91（上線 2 天）

[GitHub](https://github.com/joeseesun/qiaomu-codex-imagegen)　·　JavaScript　·　MIT

- **是什麼**：把 Codex 內建、原本只有 Codex 自己能用的生圖功能包成 MCP server + CLI + Agent Skill，讓 Claude Code、Cursor 或任何能執行指令的 agent 說一句「做一張小紅書配圖」就能拿到圖片檔案。
- **為什麼值得看**：多數生圖工具是「你給 prompt、它就畫」，這個工具反過來——agent 先給出至少四個機制完全不同的風格方向（內建 24 類場景模板、20 位 Mondo 海報設計師風格），等你選定之後才展開完整 prompt 出圖。等於把「挑方向」這個創意判斷留給人，把「組 prompt、驗收結果」交給 agent，而不是讓 agent 自己亂猜一個方向就定稿。
- **Tech stack**：MCP server + CLI + Agent Skill，底層共用同一套邏輯呼叫 Codex 內建生圖引擎
- **上手難度**：低——裝好 MCP 設定檔，對 agent 說一句話即可使用，但生圖能力本身綁定 Codex。

---

### mesh-avatar-studio ⭐ 228（上線 2 天）

[GitHub](https://github.com/shinshin86/mesh-avatar-studio)　·　TypeScript　·　MIT

- **是什麼**：把一張插畫變成會眨眼、說話、轉頭、呼吸、頭髮會晃的 2D 立繪。流程分四步：coding agent（Claude Code 或 Codex）先讀圖、判斷座標抓得準不準、把圖切成圖層並打上骨架，接著你在本地編輯器裡用即時預覽微調每個部位的控制點，最後再讓 agent 檢查固定姿勢下的呈現是否正常。
- **為什麼值得看**：過去要做這種可動立繪，通常得學 Live2D 或找人代工拆圖層；這個專案把「拆圖層、打骨架」這種需要精細座標判斷的苦工交給 coding agent，把「調整到滿意為止」這種需要人眼審美的部分留在本地編輯器裡即時預覽，分工分得很清楚。專案資料全部存在不會被 commit 的 `projects/` 資料夾，也附了一份 Miko 範例可以直接上手試玩。
- **Tech stack**：本地 Web 編輯器（Node.js 22.17+）+ Claude Code／Codex 依照專屬 agent guide 操作 + 2D mesh 變形引擎
- **上手難度**：中——起本地編輯器很快，但要先裝好 coding agent 並讓它讀一份專屬的 agent guide 才能跑完整流程，正面半身、透明背景的 PNG 效果最好。

---

### easyread ⭐ 803（上線 5 天）

[GitHub](https://github.com/Edwardxlai/easyread)　·　Python　·　MIT

- **是什麼**：本地運行的英文論文閱讀器，把 PDF 匯入後逐頁翻譯成中文，公式用 KaTeX 按原文重排、表格用三線表，隨時可以切回原文逐段對照，側邊欄還能一邊畫線一邊問 AI（可選 Claude、GPT、DeepSeek、通義或本機 Ollama）。
- **為什麼值得看**：跟「把 PDF 丟給翻譯軟體」不一樣的地方，是它把「忠實譯文」跟「AI 的解釋」分開放——正文只放翻譯，AI 回答放在頁邊，一眼就分得清哪句是論文自己說的、哪句是模型加的解讀。畫線起來的段落還能直接問 AI 這幾段之間有什麼關聯，對常讀論文的人來說，這比單純翻譯更貼近真實的閱讀習慣。
- **Tech stack**：本地 PDF 解析 + KaTeX 公式排版 + 多模型 API（Claude／GPT／DeepSeek／通義／Ollama）
- **上手難度**：低——下載現成版本即可使用，文獻庫預設存在本機，也能指到自己的雲端硬碟同步資料夾。

## Notable Releases

### Mastra @mastra/core@1.74.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)

- **重要變更**：tool 執行時可以呼叫 `context.agent.getMessages()` 直接讀到目前完整對話（含記憶裡的訊息和這輪已經回覆的內容），不用再手動把對話塞進 tool 輸入；Observational Memory 的歷史搜尋新增依 `groupId` 過濾、可調排序方向，也能用 `recordId` 直接查單筆記錄；Playground UI 新增一套無障礙表單元件（`Field`／`Fieldset`／`Form`／`SearchInput`）。
- **Breaking Changes**：`@mastra/playground-ui` 的 `ThreadViewByTrace`、`TraceThreadPanel`、`ThreadTrace` 移除了 `anchorTraceId` 屬性與 `ThreadTrace.LoadMoreSentinel`，改用 `pageSize` 搭配 `onLoadOlder` 控制分頁載入。
- **對你的影響**：如果你的 tool 需要知道「agent 這輪已經回過什麼」才能決定下一步（例如避免重複呼叫同一支 API），現在可以直接讀 `context.agent.getMessages()`；若自訂了 Playground 的 trace 面板，要把 `anchorTraceId` 換成 `pageSize` / `onLoadOlder`。

---

## 今日收穫

之前以為「用 agent 做一整套流程」只適合寫程式這類本來就是文字作業的場景；今天這四個專案提醒我，連「複刻一個 App」「把插畫做成立繪」這種牽涉大量視覺判斷與手工調整的任務，也能拆成「agent 做苦工、人做判斷」的分工——苦工的門檻比想像中低很多，真正值錢的反而是最後那道人類審美或商業判斷。

## 參考資料

- [Jakeschincariol/replica-skill](https://github.com/Jakeschincariol/replica-skill)
- [joeseesun/qiaomu-codex-imagegen](https://github.com/joeseesun/qiaomu-codex-imagegen)
- [shinshin86/mesh-avatar-studio](https://github.com/shinshin86/mesh-avatar-studio)
- [Edwardxlai/easyread](https://github.com/Edwardxlai/easyread)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Mastra @mastra/core@1.74.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)
