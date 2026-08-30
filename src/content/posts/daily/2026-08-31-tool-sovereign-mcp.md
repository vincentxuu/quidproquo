---
title: "工具推薦｜Sovereign MCP — 在 Agent 寫出不安全的 Terraform 之前先攔下來"
date: 2026-08-31
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 在 Agent 生成 Terraform 的當下就掃描安全設定問題並自動修正，而不是等 PR 或 CI 才發現"
tldr: "Sovereign MCP（sovereign-observer-mcp）是一個本地執行的 MCP server，讓 Agent 在寫 Terraform 的同時掃描安全設定問題並套用修正。安裝：claude mcp add sovereign -- uvx sovereign-observer。解決了『AI 生成的 IaC 預設不安全，等進了 PR 或上線才發現』的問題。"
series:
  name: "AI Tool of the Day"
  order: 16
---

> 🌏 [English version](/en/posts/daily/2026-08-31-tool-sovereign-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Sovereign MCP（sovereign-observer-mcp） |
| 類型 | MCP server（Terraform 安全掃描，Agent 寫程式碼的當下即時檢查） |
| GitHub | [kraken222/sovereign-observer-mcp](https://github.com/kraken222/sovereign-observer-mcp) |
| Stars | 1 |
| 語言 | Python |
| 授權 | Apache-2.0 |
| 安裝 | `claude mcp add sovereign -- uvx sovereign-observer` |

## 解決什麼問題

你是否讓 Agent 幫忙寫過 Terraform，結果 PR 被 CI 的安全掃描擋下來，才發現 RDS 沒開加密、S3 bucket 對外可讀、資料庫少了刪除保護？模型記憶裡的 provider 預設值，優化的是「能跑起來」，不是「跑得安全」——這種設定缺陷在編輯器裡改一個屬性就好，進了 PR 是一輪 review，上線之後就是事故。CI 本來就抓得到這些問題，只是要等三天後、隔著一輪 review 意見才抓到。

Sovereign MCP 把掃描這件事搬到 Agent 生成程式碼的當下：你叫 Agent 幫某個服務加一個 RDS instance，它寫完 HCL 後自己呼叫 `scan_terraform`，拿到帶檔案與行號的問題清單，再呼叫 `apply_fixes` 把能安全機械修正的部分改掉，最後才把結果拿給你看。掃描引擎是本地的、建立在開源的 Checkov 之上，不需要帳號、預設路徑下不打任何網路請求，Terraform 內容不會離開你的機器。如果你接了組織帳號，Agent 甚至能在動筆之前先問 `org_requirements` 拿到公司自己的規則（例如「backup 保留期至少 365 天」），讓違規設定從一開始就不會被寫出來，而不是寫出來後再修。

適合場景：團隊用 Agent（Claude Code、Cursor、VS Code Copilot、Windsurf 都支援）大量生成 IaC，想把「安全設定審查」從 PR 階段往前移到編輯器階段；也適合想順手拿到 SOC 2 / ISO 27001 / PCI-DSS 等框架控制項對照、減少稽核工作量的團隊。它不掃描正在運行的雲端資源，也不是合規評估本身，只處理 Terraform 檔案這一層。

## 快速上手

### 安裝

```bash
# Claude Code
claude mcp add sovereign -- uvx sovereign-observer
```

Cursor（`~/.cursor/mcp.json`）、VS Code + GitHub Copilot（`.vscode/mcp.json`）、Windsurf（`~/.codeium/windsurf/mcp_config.json`）都是同樣的 `uvx sovereign-observer` command，差別只在設定檔位置。第一次執行會下載掃描引擎（約 100MB），之後就是純本地執行，不需要網路。

### 基本用法

裝好之後不需要手動呼叫工具，直接請 Agent 做事，它會自己決定何時掃描：

```
你：幫 orders 服務加一個 RDS instance
Agent：[寫 HCL] → [呼叫 scan_terraform] → [呼叫 apply_fixes 修掉 4 個問題] → 顯示結果
```

`scan_terraform` 可以掃磁碟上的檔案，也能直接掃 Agent 還沒存檔的緩衝內容，回傳結果依嚴重度分類、附檔案與行號；`explain_finding` 針對單一問題給出完整的修復說明（哪裡錯了、正確的 Terraform 寫法是什麼）；`secure_template` 則是直接給某個 resource type 一份已經加固過的範本，讓不安全版本從一開始就不會被寫出來。

### 進階用法

連上組織帳號後，公司自己的規則會在 Agent 動筆之前先介入：

```bash
# Integrations → GitHub 頁面取得 token
export SOVEREIGN_TOKEN=...
```

```
你：幫 orders 服務加一個 RDS instance
Agent：→ org_requirements("aws_db_instance")
      ← "backup_retention_period must be at least 365"
        "region must be one of: eu-west-1, eu-central-1"
      [直接寫出滿足兩條規則的 Terraform]
      → scan_terraform → 乾淨
```

組織規則用 YAML 在後台維護，掃描結果裡會標 `source: org_policy` 和內建規則區分開。這條路徑唯一打出去的請求是 `GET` 公司規則本身，README 特別提到有一條測試 `test_no_terraform_is_ever_uploaded` 斷言傳輸層不會把 Terraform 內容送出去，且未連接組織帳號時整個 server 完全不開 socket。

## 與現有工具的比較

| | Sovereign MCP | Checkov CLI（獨立跑） | CI 階段掃描（如 tfsec / Checkov in CI） |
|---|---|---|---|
| 在 Agent 生成程式碼的當下即時介入 | ✅ | ❌ | ❌ |
| 能讓規則在動筆前就生效（`org_requirements`） | ✅ | ❌ | ❌ |
| 提供機械式自動修正（`apply_fixes`） | ✅（僅限單屬性、可驗證的安全修正） | 需自行整合 | 通常只回報，不修正 |
| 合規框架控制項對照（SOC 2 / ISO 27001 / PCI-DSS…） | ✅ | 依外掛而定 | 依外掛而定 |
| 回饋週期 | 編輯器內、即時 | 手動執行時 | PR / merge 後 |

## 注意事項

- **`apply_fixes` 刻意收得很窄**：只套用單一屬性、原地修改、且來自人工驗證過的允許清單的修正，遇到值是變數或運算式的欄位一律不動，因為語法上乾淨的機械修正也可能讓正在跑的系統掛掉。
- **不等於合規評估**：`check_compliance` 回傳的是控制項「對照」，能縮短稽核時間，但掃描乾淨不代表組織就合規——多數框架同時要求治理、流程、教育訓練，這些是設定掃描器看不到的。README 也直接寫明 NCA（沙烏地）的控制項編號目前是暫定的，尚未對照官方目錄，建議用子領域名稱引用而非編號。
- **只掃 Terraform 檔案**：不掃正在運行的雲端帳號、容器映像或依賴套件；要看即時多雲態勢與攻擊路徑分析，官方導向的是同作者的商業版 [Sovereign Observer](https://sovereign-observer.com)，MCP 這個是編輯器端的免費切片。

## 今日收穫

多數安全工具的介入點是「程式碼寫完之後」——PR 審查、CI pipeline、上線後的雲端掃描，每往後移一階段，修一個設定屬性的成本就跳一級。Sovereign MCP 把介入點直接搬到 Agent 生成程式碼的那一刻，甚至用 `org_requirements` 把規則喂進生成過程本身，讓違規設定從一開始就不存在，而不是事後被抓到再改。這跟「把攻擊面從架構上消除」是同一種思路，只是這次消除的不是危險工具，而是危險設定被寫出來的那個時間點。

## 參考資料

- [kraken222/sovereign-observer-mcp GitHub repo](https://github.com/kraken222/sovereign-observer-mcp)：README、安裝方式、工具表、組織政策機制、限制說明均出自官方 repo。
- [kraken222/sovereign-observer-mcp repo metadata](https://github.com/kraken222/sovereign-observer-mcp)：Apache-2.0 授權、Python、建立於 2026-08-30，經 GitHub API 確認。
- [Checkov (bridgecrewio/checkov)](https://github.com/bridgecrewio/checkov)：Sovereign MCP 的掃描引擎所基於的開源專案，Apache-2.0 授權。
