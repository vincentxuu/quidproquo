---
title: "工具推薦｜Cairn — 用自然語言問「為什麼半夜三點延遲飆高」的事故分析 Copilot"
date: 2026-08-22
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源事故分析 Copilot：用一句自然語言查詢，串接觀測系統、部署時間軸和 runbook，提出有證據佐證的根因，修復動作要人核准才會執行"
tldr: "Cairn 是一個用 MCP tool servers 串接觀測系統、部署紀錄、runbook 的事故分析 Copilot，問一句「為什麼 checkout 延遲半夜三點飆高」就能拿到附證據的根因假設。安裝：`make install && make up` 起本機環境。解決了 SRE 排查事故時要手動在好幾個系統間來回核對時間軸、翻 runbook 的問題，而且修復動作預設要人核准才會執行。"
series:
  name: "AI Tool of the Day"
  order: 7
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Cairn |
| 類型 | Agentic 事故分析 Copilot（MCP tool servers + CLI + Dashboard） |
| GitHub | [Nouman-Amjad/Cairn](https://github.com/Nouman-Amjad/Cairn)（2026-08-21 新建） |
| Stars | 2 |
| 語言 | Python |
| 授權 | Apache-2.0 |
| 安裝 | `make install && make up` |

## 解決什麼問題

半夜三點 checkout 延遲飆高，值班的你要做什麼？先開 Grafana 看 latency 圖、再翻 deploy log 看是不是剛好上了新版本、再去 wiki 找有沒有現成 runbook、最後才拼湊出一個「大概是這樣」的根因。整個過程是人腦在幾個系統之間手動做時間軸比對——慢，而且很吃當班工程師剛好熟不熟這個服務。

Cairn 把這個排查流程包成一個 agent：你用自然語言問「為什麼 checkout 延遲半夜三點飆高？」，它會依序查觀測系統（metrics/logs）、比對部署時間軸、抓相關 runbook，然後提出一個附證據的根因假設。它的架構把每個能力都做成獨立的 MCP tool server（observability、runbooks、actions 各自一個），中間有一個依成本與敏感度分流的 router，在本機 8B 模型和前沿模型之間選擇；如果 agent 判斷要執行修復動作（例如重啟服務、回滾），會先卡在一個「approval gate」的狀態機，需要人核准才會真的執行，不會自己動手改東西。

適合場景：有一定規模的觀測堆疊（Prometheus/Grafana 之類）、想把「值班排查」的第一步自動化、又不放心讓 agent 直接動手改生產環境的團隊。

## 快速上手

### 安裝

```bash
git clone https://github.com/Nouman-Amjad/Cairn.git
cd Cairn
make install     # 用 uv 和 npm 裝依賴
make up          # 起 Postgres(pgvector) / Redis / MinIO / OPA
make migrate      # 資料庫 schema
make test         # 246 個單元測試
make eval         # 跑 30 個事故情境的完整 agent pipeline
```

不需要 GPU、也不需要先申請 API key 就能跑完整套本機測試與評估情境。

### 基本用法

```bash
cairn ask "why did checkout latency spike at 3am?"
```

配套的 dashboard 不需要額外 build，本機直接跑：

```bash
npx @nouman-amjad/cairn dashboard
```

### 進階用法

啟用真實 LLM 推論（而非本機 8B 模型評估模式）需要設定環境變數指向 Anthropic / vLLM 端點；`make mcp-stdio` 可以直接用 stdio 模式除錯個別 MCP server 回傳了什麼。

## 與現有工具的比較

同類的開源事故分析 agent 裡，最知名的是 CNCF Sandbox 專案 [HolmesGPT](https://github.com/HolmesGPT/holmesgpt)（原 Robusta.Dev 出品，微軟也有貢獻）：

| | Cairn | HolmesGPT | 人工排查 |
|---|---|---|---|
| 自然語言問診斷 | ✅ | ✅ | — |
| 修復動作需人核准 | ✅（approval 狀態機） | 需自行接 Slack/PR 流程把關 | ✅（本來就是人做） |
| 內建成本分流 router | ✅（本機 8B ↔ 前沿模型） | 依你設定的 LLM provider | — |
| 24/7 背景值守模式 | ❌（目前是問答式） | ✅（Operator mode） | ❌ |
| 需要 Kubernetes | ❌ | ❌ | — |
| 評估套件 | ✅（30 情境 + 7 項門檻指標隨附） | 有（150+ 場景比較不同 LLM） | — |

Cairn 更年輕、範圍更聚焦（做好「問答式根因分析 + 核准後執行」這一段），HolmesGPT 生態更成熟、整合面更廣（Slack/Teams/PagerDuty/Jira 都有現成整合）。如果你只是想先在本機評估「LLM 讀 metrics 找根因」這件事準不準,Cairn 的評估套件門檻比較低。

## 注意事項

- **專案剛起步（建立於 2026-08-21），星數還很少**：目前是單一貢獻者的早期專案，長期維護狀況未知，先當作概念驗證來試,不建議直接接生產值班流程。
- **README 自己列出「尚未驗證」的項目**：包含真實 LLM 準確率（還沒校準）、Terraform 部署到 AWS、混沌測試情境、實際大規模下的成本數字——這些都還只是本機測試通過,沒有生產環境的實測數據。
- **本機環境不輕量**：`make up` 會起 Postgres(pgvector)、Redis、MinIO、OPA 四個服務,不是「裝完馬上能用」的單一二進位檔,評估前預期要花點時間把依賴服務跑起來。

## 今日收穫

大多數「AI 事故排查」的展示影片都在秀「AI 找到根因」這個爽點，Cairn 的 README 反而把最花力氣的部分放在「approval 狀態機」和「OPA policy 驗證」——也就是怎麼防止 agent 自己核准自己、防止同一個修復動作被重複執行兩次。這提醒了一件事：讓 agent 讀懂系統狀態、生成根因假設,難度遠低於讓 agent 安全地把假設轉成「真的去動生產環境」這一步,後者才是這類工具能不能被團隊信任接進值班流程的關鍵。

## 參考資料

- [Nouman-Amjad/Cairn — GitHub](https://github.com/Nouman-Amjad/Cairn)：專案介紹、架構、安裝指令、授權（Apache-2.0）、README 自陳的「已驗證/未驗證」項目清單皆出自官方 README。
- [HolmesGPT — GitHub](https://github.com/HolmesGPT/holmesgpt)：CNCF Sandbox 專案，用於比較同類開源事故分析 agent 的整合面與 Operator mode。
- [HolmesGPT 官方文件](https://holmesgpt.dev/)：Operator mode、資料來源整合列表的說明來源。
