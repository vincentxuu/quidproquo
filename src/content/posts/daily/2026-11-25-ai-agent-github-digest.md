---
title: "AI Agent GitHub Digest — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, github, open-source, daily, mcp, mcp-server, agent-skills, agent-framework]
lang: zh-TW
description: "新 repo 的共同點是「替既有 agent 補一塊它做不到的事」：Rust 熱點移植、iOS 模擬器、SAP 唯讀查詢；Mastra 與 OpenAI Agents SDK 則同時把長時間執行與審批流程往框架內建推"
tldr: "fast-anything 建立四天就拿到 4,000 顆星，用 coding agent 只改寫程式裡最慢的那 5% 並先驗證結果一致；agent-sim 讓 AI agent 在 Linux 上操作 iOS 模擬器；sap-data-mcp 提供 412 個唯讀 SAP 查詢工具。框架端，Mastra core 1.86.0 與 OpenAI Agents SDK v0.26.0 都在 11 月下旬發布。"
series:
  name: "AI Agent GitHub Digest"
  order: 102
---

> :globe: [English version](/posts/daily/2026-11-25-ai-agent-github-digest-en)

> 資料口徑：GitHub 沒有歷史 trending 快照，下列星數與版本資訊是撰寫時（2026-11-26）直接從 repo 頁面讀到的數字，不是 11 月 25 日當天的快照；建立日期與發佈日期則以 GitHub 紀錄為準。

## 今日亮點

這批新 repo 有個共同點：都不是另一個「通用 agent 框架」，而是替既有的 coding agent 補一塊它原本做不到的事。fast-anything 讓 agent 只改寫程式裡最慢的那一小段並自己驗證結果；agent-sim 讓 agent 在沒有 Mac 的 Linux 上操作 iOS 模擬器；sap-data-mcp 讓 agent 能查 SAP，但程式碼層就沒有寫入能力。框架那邊，Mastra 與 OpenAI Agents SDK 則各自把「長時間執行」和「審批」往內建推進一步。

## Trending Repos

### EL4CTEO/fast-anything ★約 4,000

[GitHub](https://github.com/EL4CTEO/fast-anything)　·　Rust　·　MIT

- **是什麼**：一套命令列工具加 MCP server，先替你的 Python、Node、Ruby 等應用程式做效能剖析，挑出最耗時的函式，請 coding agent 只把那一段改寫成 Rust，驗證結果一致後再換上去；換上去的那一塊可以完整還原。
- **為什麼值得看**：多數「用 Rust 重寫」的提案是整個專案重來，這個工具把範圍縮到最熱的函式，並且要求先用錄下來的真實呼叫重播驗證，全部一致才會啟用，換上去後比原本還慢的移植也不會啟用。README 列出的實測是 Python 模糊去重 4.91 秒降到 42 毫秒（116 倍），但這些數字出自作者自己的機器與範例，不是第三方測試。
- **Tech Stack**：Rust（佔程式碼約七成）+ PyO3／napi-rs 等各語言橋接 + MCP server
- **上手難度**：中——要先裝 Rust 工具鏈，並且接上 Claude Code 或 Codex 這類 coding agent
- **時間線**：repo 建立於 11 月 21 日，到 11 月 25 日已發到 v0.8.8；頁面顯示約 4,000 顆星、289 個 fork。

---

### INK-Q/agy-fast ★約 1,500

[GitHub](https://github.com/INK-Q/agy-fast)　·　TypeScript　·　MIT

- **是什麼**：給 Google Antigravity（命令列、桌面版與 IDE）用的本機 MCP 外掛，把零散的搜尋、符號大綱、多檔編輯與建置檢查合併成批次呼叫，每個 session 只注入一次工作區快照。
- **為什麼值得看**：它直接用「少繞幾輪」來省額度，而不是換模型。README 公開了量測方式：10 天的真實 coding 紀錄，基準 14 個主 session（5,771 輪）對 7 個使用 agy-fast 的主 session（901 輪），標準權重下額度降 31.5%，換成保守的快取折扣仍有 25.8%。要注意樣本不大（只有 7 個對照 session），且是作者自己整理的資料。
- **Tech Stack**：TypeScript + MCP，零外部相依
- **上手難度**：低——是本機外掛，不需要額外服務
- **時間線**：repo 建立於 11 月 19 日，最新 release 為 v0.3.1（11 月 24 日）。

---

### Developing-Gamer/agent-sim ★約 600

[GitHub](https://github.com/Developing-Gamer/agent-sim)　·　Rust　·　Apache-2.0（x86Sim 的修補檔依 GPL-3.0-or-later）

- **是什麼**：在一般 Linux 機器上，讓 AI agent 操作 iOS 模擬器，不需要 Mac 也不需要 GPU；底層是 x86Sim，agent-sim 負責 agent 這一層。
- **為什麼值得看**：README 列出的 MCP 工具包含 `snapshot`、`tap`、`type`、`scroll`、`swipe`、`launch`、`screenshot` 等，等於讓 agent 能在雲端或 CI 上自己跑 iOS App 做操作與驗證。作者也直接寫明現在是 early 階段，XCUITest 測試套件還不支援，相機、推播、簽章與 DRM 這類真機行為也不能靠它判斷。
- **Tech Stack**：Rust + Shell + C，建立在 x86Sim 之上
- **上手難度**：高——需要 x86-64 的 Ubuntu 24.04，建議 8 核心以上、16 GB 記憶體、60 GB 可用磁碟
- **時間線**：repo 建立於 11 月 21 日，v0.1.0 於 11 月 23 日發布。

---

### w1ccc/sap-data-mcp ★約 160

[GitHub](https://github.com/w1ccc/sap-data-mcp)　·　Python　·　MIT

- **是什麼**：三組唯讀 MCP server，讓 AI 助理透過 RFC/BAPI、私有雲 OData 與公有雲已釋出 API 查詢 SAP S/4HANA，合計註冊 412 個唯讀工具，涵蓋 MM、SD、FI、CO 等 8 大標準模組。
- **為什麼值得看**：企業系統接 agent 最怕寫入，這個專案把風險寫進程式結構：RFC 只能呼叫 98 個標準讀取函式的白名單，HTTP 只發固定的 GET（唯一的 POST 是取得 OAuth token）；每次呼叫都寫進本機的 JSONL 紀錄；密碼只放在本機 `.env`，不經過 AI。README 也說明它不是 SAP 官方產品，能查到什麼取決於目標系統啟用的服務與登入帳號的權限。
- **Tech Stack**：Python + PyRFC／SAP NW RFC SDK + OData V2/V4
- **上手難度**：高——需要可連線的 SAP 系統、帳號權限與（RFC 版本需要的）SAP SDK
- **時間線**：repo 建立於 11 月 20 日，v0.2.0 於 11 月 22 日發布；目前星數不多，屬早期專案。

## Notable Releases

### OpenAI Agents SDK for Python v0.26.0

[Release Notes](https://github.com/openai/openai-agents-python/releases)

- **重要變更**：Docker 沙箱掛載改用 `DockerVolumeMountStrategy`，S3 Files 這類儲存要先掛在 Docker 主機上，再用受信任的 `SandboxPathGrant` 授權；輸入端 guardrail 觸發時，會連已排隊的 function tool 一起停下，要在任何工具啟動前先檢查可設 `run_in_parallel=False`；MCP 呼叫有衝突的 metadata 時，優先順序是明確的呼叫 metadata、`tool_meta_resolver`、最後才是探索預設值。
- **Breaking Changes**：依 release notes 的 Docker 掛載段落，要改用新的掛載策略並用更新後的 manifest 建新 session；自訂 `TraceProvider` 必須透過 `is_disabled()` 回報真實狀態，才能啟用伺服器端追蹤。
- **對你的影響**：如果你用 Docker 沙箱掛載外部儲存，升級前先照 release notes 改掛載方式；有自訂 tracing 的，要補 `is_disabled()`。同一頁也列了 v1.0.0-alpha.2（11 月 23 日，預先發布版），新增跨 worker 恢復對話與待審批項目，並提醒要先升級讀取端再升級寫入端，目前還在 alpha。

---

### Mastra core 1.86.0

[Release Notes](https://github.com/mastra-ai/mastra/releases)

- **重要變更**：資料集實驗可以用 `durable: true` 跑成當機後可續跑的版本；新增原生 durable Agent 執行引擎選擇（`durable.executionEngine`）；加入 `createChannelTools()` 與 Slack toolset，聊天整合改為以頻道優先。
- **Breaking Changes**：有。`get_process_output` 不再支援 `wait: true`，要改用 `waitSeconds`（1 到 300 秒）；`@mastra/mcp-apps-components` 的 MCP 邊界欄位 `projectId` 改名為 `project`；`@mastra/playground-ui` 的 traces 元件 API 有大幅調整。
- **對你的影響**：有程式呼叫 `get_process_output` 的，升級前先把 `wait: true` 換掉；用 playground-ui 自訂 traces 畫面的，要預留改版時間。

## 今日收穫

原本以為 agent 生態的新專案會集中在「更大的框架」，但這批新 repo 幾乎都在補洞：fast-anything 補效能、agent-sim 補平台、sap-data-mcp 補企業系統的安全邊界。而且這幾個專案都把可驗證的限制寫在前面，像唯讀白名單、先驗證才啟用、承認不能取代真機測試。對想採用的人來說，這比大聲宣稱「全能」更容易判斷值不值得試。

## 參考資料

- [EL4CTEO/fast-anything](https://github.com/EL4CTEO/fast-anything)
- [INK-Q/agy-fast](https://github.com/INK-Q/agy-fast)
- [Developing-Gamer/agent-sim](https://github.com/Developing-Gamer/agent-sim)
- [w1ccc/sap-data-mcp](https://github.com/w1ccc/sap-data-mcp)
- [OpenAI Agents SDK for Python releases](https://github.com/openai/openai-agents-python/releases)
- [Mastra releases](https://github.com/mastra-ai/mastra/releases)
