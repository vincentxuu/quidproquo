---
title: "AI Agent GitHub Digest — 2026-08-17"
date: 2026-08-17
category: daily
tags: [ai-agent, github, open-source, daily, mcp-server, deepseek]
lang: zh-TW
description: "DeepSeek 官方 CLI harness dsh 一週內在中文開發者社群冒出至少五個獨立桌面包裝版；同時兩個新工具選擇補強既有 agent loop，而不是再造一個框架"
tldr: "forge 給自架 LLM 的 tool-calling 加一層可靠性 middleware，可直接代理 opencode/aider/Claude Code 免改程式；repo-context-mcp 用 MCP 提供 token 預算化的 repo context 打包，上線 5 天就做進 PR CI；DeepSeek 官方 harness dsh 一週內冒出至少 5 個獨立社群桌面包裝版，合計逼近 1,500 星；微軟研究院的瀏覽器 agent 框架 Webwright 靠 Skill Factory 把解過的任務蒸餾成免模型呼叫的可重跑腳本，在 WebArena 上拉高 15 個百分點的重用準確率；Mastra 1.59.0 把 CostGuardProcessor 更名 TokenCostControl（breaking），Pydantic AI v2.30.0 修了本機 web chat 介面的 DNS rebinding 資安漏洞。"
series:
  name: "AI Agent GitHub Digest"
  order: 2
---

## 今日亮點

今天最顯眼的不是新框架，是「幫既有工具補強」這條路線——forge 給自架 LLM 的 tool-calling 加可靠性層，repo-context-mcp 用 MCP 幫 agent 打包不浪費 token 的 repo context，兩個都假設你已經有一個能跑的 agent loop，只是想讓它更穩、更省。另一條線是 DeepSeek 官方 CLI harness `dsh` 過去一週在中文開發者社群炸出至少五個獨立的桌面包裝專案，顯示這套工具的擴散速度已經追上英文社群對 Claude Code / Codex 的追新速度。

## Trending Repos

### forge (antoinezambelli) ⭐ 2,213

[GitHub](https://github.com/antoinezambelli/forge)　·　Python　·　MIT

- **是什麼**：給自架 LLM 的 tool-calling 加一層可靠性 middleware——你給 forge 一組工具，模型自己決定呼叫順序，forge 負責重試提示、修復格式錯誤的 tool call、驗證回應是否符合預期。
- **為什麼值得看**：多數 agent 框架解決「怎麼協調多個 agent」，forge 反過來假設你已經有一個能跑的 loop，只想讓工具呼叫本身不要壞掉；它的 proxy mode 能直接代理 opencode、aider、甚至 Claude Code（用 Anthropic Messages API），讓既有 coding harness 免改程式就套上 guardrails。
- **技術棧**：Python，支援 Ollama、llama-server、Llamafile、vLLM、Anthropic 當 backend
- **上手難度**：低——`python -m forge.proxy` 一行指令啟動代理模式；要直接用 WorkflowRunner 自己管理 loop 則需要多寫一些程式。

---

### repo-context-mcp (nduc99911) ⭐ 104

[GitHub](https://github.com/nduc99911/repo-context-mcp)　·　TypeScript　·　MIT

- **是什麼**：一個 MCP server，開放 `repo_map`（輕量目錄樹＋入口點）、`search_code`（帶行號的字串搜尋）、`pack_context`（token 預算化的 Markdown context 包）三個工具，讓 coding agent 不用把整個 monorepo 塞進 prompt。
- **為什麼值得看**：這類「context 打包」的 MCP server 解決一個具體且常見的痛點——agent 在大型 repo 裡亂逛 `node_modules`、漏掉入口點、或直接貼整個檔案浪費 token；8/12 才建立，5 天內就加上 GitHub Action，能在每個 PR 自動打包 context，作者顯然是邊用邊往 CI workflow 補功能。
- **技術棧**：TypeScript + MCP SDK
- **上手難度**：低——`npm install` 後 CLI 提供 `map`／`search`／`pack` 三個子指令，也支援 `--json` 輸出。

---

### Deepseek Harness EAC (zouyuxuan122) ⭐ 540

[GitHub](https://github.com/zouyuxuan122/Deepseek-Harness-EAC)　·　JavaScript (Electron)　·　MIT

- **是什麼**：DeepSeek 官方 CLI harness `@deepseek-ai/dsh`（一套 plugin-based agent 框架，性質類似 Claude Code／Codex 的終端機 harness）的社群桌面包裝版，用 Electron 把它包成內建 10 種 UI 皮膚、外掛市集、系統匣、內建終端機的圖形介面，不用自己裝 Node.js。
- **為什麼值得看**：過去一週至少五個中文開發團隊各自做了 dsh 的桌面 wrapper——除了 EAC，還有 [dsh_desktop](https://github.com/myYangyunfan/dsh_desktop)（376 星）、[oh-dsh](https://github.com/hust-open-atom-club/oh-dsh)（215 星）、[deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app)（215 星）、[deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio)（152 星），五個 repo 合計逼近 1,500 星，全部在 8/11 到 8/15 之間建立；擴散的第一波不是外掛生態，而是「先把 CLI 包成 GUI」，反映不少使用者還是想要圖形介面而非純終端機操作。
- **技術棧**：Electron + Node.js，包裝官方 `@deepseek-ai/dsh` CLI
- **上手難度**：低——下載安裝檔或 portable 版即可執行，不用自己處理 Node.js 環境。

---

### Webwright (microsoft) ⭐ 5,916

[GitHub](https://github.com/microsoft/Webwright)　·　Python　·　MIT

- **是什麼**：微軟研究院的瀏覽器 agent 框架，核心主張「終端機就夠了」——LLM 在終端機裡開多個瀏覽器 session 觀察頁面，把整個網頁任務寫成一支可重跑的 Python script，沒有多 agent 系統、沒有圖引擎、沒有隱藏的 orchestration。
- **為什麼值得看**：7/21 上線的 Skill Factory 把每次解過的任務留下腳本，蒸餾成可重複使用、參數化、不用再呼叫模型的 code skill（約 40 秒、零 token），在 WebArena 上把重用後的準確率從 55% 拉到 70%（+15 個百分點）；概念上跟「把模型的探索過程快取成確定性程式」這波趨勢相呼應，而不是每次都重新推理一遍。
- **技術棧**：Python + Playwright，支援 OpenAI／Anthropic／OpenRouter backend
- **上手難度**：中——需要架設 Playwright 環境；已提供 Claude Code 與 OpenAI Codex 的 plugin manifest，可用 `/plugin install webwright@webwright` 直接安裝。

## Notable Releases

### Mastra @mastra/core 1.59.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0)

- **重要變更**：新增 `Agent.listActiveThreadRuns()`／`AgentController.listActiveThreadRuns()`，可在不建立 session 的情況下查詢執行中的 run；`SensitiveDataFilter` 新增 `redactionStyle: 'indexed'`，遮罩後產生像 `[APIKEY_1]` 這種可對照的穩定 token，而不是單純的 `[REDACTED]`；Observational Memory 的 `recall` 工具支援 `nextCharOffset`，能分批取回超長訊息內容。
- **Breaking Changes**：`CostGuardProcessor` 更名為 `TokenCostControl`（id 改為 `'token-cost-control'`），舊的匯出保留為 deprecated alias，未來大版號會移除；Factory 的自動觸發 run 改成預設關閉（`autoRunEnabled` 預設 off），規則提案的 run 現在會停在「待核准」狀態，不會自動執行。
- **對你的影響**：用 `CostGuardProcessor` 的專案短期內還能跑，但該規劃遷移到 `TokenCostControl`；依賴 Factory 自動觸發 run 的專案升級後記得手動把 `autoRunEnabled` 打開，不然規則產生的動作會卡在待核准、不會自動跑。

---

### Pydantic AI v2.30.0 → v2.31.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.30.0)

- **重要變更**：v2.30.0（8/14）修了一個 DNS rebinding 資安漏洞（[GHSA-q2xc-rrxj-58x9](https://github.com/pydantic/pydantic-ai/releases/tag/v2.30.0)）——本機開發用的 web chat 介面過去可能被惡意網站透過瀏覽器連進來，用你本機的憑證執行 tool；修法是預設把 Host header 限制在 localhost／loopback／LAN，要接真實網域得在 `Agent.to_web()` 或 `clai web` 主動加 `allowed_hosts` 白名單。同版也加了 `openrouter:web_search` 整合和 Gemini 3.7 Flash 模型支援。[v2.31.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.31.0)（8/15）接著修 `FallbackModel` 的 span 歸屬和 OpenAI temporal workflow sandboxing 的 bug。
- **Breaking Changes**：沒有 API 簽名層級的變更，但行為上算「破壞性」的安全預設——原本用真實網域接 web chat 介面的部署，升級後預設會被 Host header 檢查擋下，需要主動設定 `allowed_hosts` 才能繼續用。
- **對你的影響**：只要在本機或內網跑過 `clai web` 或 `Agent.to_web()`，不論有沒有用真實網域，都建議盡快升級到 v2.31.0；有接自訂網域的話記得補上 `allowed_hosts`。

## 今日收穫

原本以為「補強型」工具（tool-calling 可靠性層、context 打包 MCP server）是邊緣需求，但今天看到 forge 和 repo-context-mcp 都是在解決「既有 agent 已經夠聰明，可是工具呼叫本身不夠可靠、上下文塞得不夠有效率」的問題——這代表有一部分戰場已經從「造新框架」轉移到「幫既有 loop 打補丁」。另外 DeepSeek Harness 一週內冒出五個獨立的桌面包裝專案，讓我意識到中文開發者社群現在追新 CLI harness 的速度，已經跟英文社群幾乎同步，而且第一波需求永遠是「先給我圖形介面」。

## 參考資料

- [antoinezambelli/forge](https://github.com/antoinezambelli/forge)
- [nduc99911/repo-context-mcp](https://github.com/nduc99911/repo-context-mcp)
- [zouyuxuan122/Deepseek-Harness-EAC](https://github.com/zouyuxuan122/Deepseek-Harness-EAC)
- [myYangyunfan/dsh_desktop](https://github.com/myYangyunfan/dsh_desktop)
- [hust-open-atom-club/oh-dsh](https://github.com/hust-open-atom-club/oh-dsh)
- [vibeinging/deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app)
- [fufankeji/deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio)
- [microsoft/Webwright](https://github.com/microsoft/Webwright)
- [Webwright: A Terminal Is All You Need For Web Agents — Microsoft Research](https://www.microsoft.com/en-us/research/articles/webwright-a-terminal-is-all-you-need-for-web-agents/)
- [Mastra @mastra/core@1.59.0 release notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0)
- [Pydantic AI v2.30.0 release notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.30.0)
- [Pydantic AI v2.31.0 release notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.31.0)
