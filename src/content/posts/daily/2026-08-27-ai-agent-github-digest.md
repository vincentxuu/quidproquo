---
title: "AI Agent GitHub Digest — 2026-08-27"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-harness, coding-agent, mcp-server]
lang: zh-TW
description: "DeepSeek 開源的 agent harness dsh 一週衝上近 20 萬星，把「harness 層」的戰場從新創公司拉進了大廠戰局"
tldr: "deepseek-ai/deepseek-harness（dsh）用 Cordis 外掛架構把「模型／工具／沙箱／記憶」全部做成可替換元件，developer preview 上線一週已逼近 20 萬星；PrimeIntellect-ai/prime-agent 用 Recursive Language Model 架構做長跑研究型 coding agent，靠持久 IPython session 撐過終端機斷線；liqiwa/mcp-radar 反過來做這類 digest 的自動化版本，每天掃 GitHub 排名新出現的 MCP server。框架端 Mastra 1.61.0 補上可撐過當機的背景任務佇列，ComposioHQ/composio 0.17.0 把 SSRF 防護延伸到工具執行下載與 S3 上傳。"
series:
  name: "AI Agent GitHub Digest"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-08-27-ai-agent-github-digest-en)

## 今日亮點

今天最大的訊號不是某個新功能，是規模——DeepSeek 開源的 agent harness dsh 一週內從零衝到近 20 萬星，直接把「harness 層要不要標準化」的戰場從一堆新創公司拉進了大廠對決；同時 PrimeIntellect-ai/prime-agent 和 liqiwa/mcp-radar 從兩個方向補位：一個賭「agent 要能自己跑更久」，一個賭「生態太快了，需要自動化工具才追得上」。

## Trending Repos

### deepseek-ai/deepseek-harness ⭐ 197.7k

[GitHub](https://github.com/deepseek-ai/deepseek-harness)　·　TypeScript　·　MIT

- **是什麼**：DeepSeek 官方開源的 agent harness（工具代號 `dsh`），架構建在 Koishi 背後同一套 Cordis 外掛系統上，讓模型、工具、沙箱、記憶、甚至 UI 全部變成可插拔元件。
- **為什麼值得看**：這個專案的主張是「Agent = Model + Harness」——模型換來換去很容易，難的是圍繞模型的執行環境；dsh 支援 40 多種模型後端，甚至能把任務委派給 Claude Code、Codex 當子後端跑。上線一週據多家媒體報導已逼近 20 萬星（GitHub 官方不提供成長排行榜，這個「史上最快」的說法目前仍是媒體自行統計，本文只引用可在 GitHub 上直接驗證的目前總星數）。專案明確標示為 developer preview，隨時可能有相容性破壞性變更。
- **tech stack**：Cordis 外掛框架 + TypeScript，可接 40+ 模型後端並委派給其他 coding agent CLI
- **上手難度**：中——developer preview 階段，API 尚未穩定，適合先在非production環境試跑

---

### PrimeIntellect-ai/prime-agent ⭐ 18.6k

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　TypeScript + Python　·　MIT

- **是什麼**：Prime Intellect 開源的研究型 coding agent，核心是 Recursive Language Model（RLM）架構——用一個持久的 IPython 環境當作主要工具，程式碼取代對話成為主要互動介面。
- **為什麼值得看**：多數 coding agent 的 session 一斷線就得重來，prime-agent 用 daemon 撐住 session，讓長跑的研究型評測任務（跑一整晚的 benchmark、資料處理）可以在終端機關掉之後繼續跑；還內建 `/refine` 指令，讓 agent 能修改自己的補充 prompt 和記憶，但刻意保留基底 system prompt 不可變，避免 agent 把自己「調壞」。
- **tech stack**：TypeScript CLI + 持久 Python IPython 執行環境，內建 subagent 委派與 agent 間訊息傳遞
- **上手難度**：中——需要理解 RLM 的「用程式碼取代對話」設計哲學，跟一般聊天式 agent CLI 不太一樣

---

### liqiwa/mcp-radar ⭐ 1

[GitHub](https://github.com/liqiwa/mcp-radar)　·　Python　·　MIT

- **是什麼**：一個全自動化的 GitHub Actions pipeline，每天掃描新建立的 MCP server repo，用動能分數（stars/建立天數×10 + forks×2）排名，輸出 JSON 資料和週報 Markdown。
- **為什麼值得看**：MCP server 生態長得太快，人工篩選（就像這篇 digest 在做的事）已經跟不上；mcp-radar 反過來把「發現新 MCP server」這件事本身自動化，沒有外部基礎設施依賴，純靠 GitHub Actions 跑。對想追蹤 MCP 生態但沒時間每天手動搜的人，是個值得訂閱的資料來源。
- **tech stack**：GitHub Actions + Python 資料管線，輸出 JSON API + RSS feed
- **上手難度**：低——直接訂閱 [mcp.liqiwa.com](https://mcp.liqiwa.com) 的網站或 RSS 即可，不用自己架設

## Notable Releases

### Mastra 1.61.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)

- **重要變更**：為 generated server 新增可設定的優雅關閉（graceful shutdown）選項；agent 執行中傳送的 session 訊息自動帶上 `delivery: 'while-active'` 標記；新增給外部 orchestrator（如 Temporal）呼叫的實驗性 experiments API（`dataset.createExperiment` / `runExperimentItem` / `submitExperimentResult` / `finalizeExperiment`）與對應 HTTP endpoint。
- **Breaking Changes**：無。
- **對你的影響**：如果你把 Mastra 部署在容器化環境（K8s、Cloudflare Sandbox），這版的 graceful shutdown 選項值得接上，避免流量切換時任務被硬砍；有串外部 workflow orchestrator 的團隊可以評估新 experiments API 要不要接手動評測流程。

---

### ComposioHQ/composio 0.17.0

[Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcore%400.17.0)

- **重要變更**：OpenAI／Anthropic provider 的 tool-call helper 現在可以透過指定的 Tool Router session 執行，session 的 meta-tool 上下文在執行中會保留；工具執行下載、S3 上傳、session 檔案傳輸全面加上 SSRF 防護，會擋掉指向私有／loopback 位址的回應，連 redirect 跳轉也會逐跳重新檢查。
- **Breaking Changes**：自訂 provider 子類別若有覆寫 `executeToolCall` 或 `handleToolCalls`，這兩個方法現在會多收一個 session target 參數，需要更新簽章。
- **對你的影響**：如果你在用 Composio 執行第三方回傳的 URL（例如檔案下載連結、上傳目的地），這版的 SSRF 防護是免費拿到的安全加固；有自訂 provider 子類別的要記得補參數，不然會在型別檢查或執行期報錯。

## 今日收穫

之前以為「agent harness 標準化」會是一堆中小型新創慢慢卷出來的戰場，但 dsh 一週逼近 20 萬星提醒我，只要有夠大的模型公司下場，這個賽道可以在幾天內被重新洗牌——而且 DeepSeek 選的切入點很聰明：不是自己造一個封閉平台，是做一個能把 Claude Code、Codex 都吃進去當子後端的外掛系統，等於直接站在對手的生態之上競爭。

## 參考資料

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- [DeepSeek Harness (dsh): Open Source Agent Runtime — The Agent Report](https://the-agent-report.com/2026/08/deepseek-harness-dsh-open-source-agent-runtime/)
- [DeepSeek Harness Broke a GitHub Growth Record — Remio](https://www.remio.ai/post/deepseek-harness-broke-a-github-growth-record-the-hard-part-starts-now)
- [PrimeIntellect-ai/prime-agent](https://github.com/PrimeIntellect-ai/prime-agent)
- [liqiwa/mcp-radar](https://github.com/liqiwa/mcp-radar)
- [Mastra 1.61.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)
- [Composio 0.17.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcore%400.17.0)
