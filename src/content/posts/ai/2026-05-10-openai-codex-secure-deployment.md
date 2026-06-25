---
title: "OpenAI 公開 Codex 安全部署策略：沙箱、自動審批與企業治理框架"
date: 2026-05-10
category: ai
tags: [openai, codex, ai-agent, security, sandbox, enterprise]
lang: zh-TW
tldr: "OpenAI 在 2026 年 5 月公開 Codex 內部部署實踐：沙箱劃技術邊界、審批決定何時停下、Auto-review 用子代理代替人類審批、Managed configuration 由企業管理員強制下發。核心理念是：低風險動作零摩擦，高風險動作必經審查。"
description: "OpenAI 公開 Codex 在內部的安全部署實踐，從沙箱模式、審批策略、Auto-review、網路政策到企業 Managed configuration 的完整框架。"
draft: false
---

🌏 [English version](/posts/ai/2026-05-10-openai-codex-secure-deployment-en)

OpenAI 在 2026 年 5 月 8 日發表 [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)，公開內部如何部署 Codex 這套 AI 編程代理。重點不在「Codex 多會寫程式」，而在於：當代理可以自主讀檔、執行指令、操作開發工具時，企業要怎麼控制邊界、留下軌跡、在生產力與安全之間取捨。文章可視為 AI Agent 進入企業環境的一份參考治理框架。

## 核心理念：邊界內生產，邊界外停下來

OpenAI 對 Codex 的部署原則只有一句話：在受限環境中生產，低風險日常動作零摩擦，高風險動作要停下來審查。

這背後是兩個正交的概念：

- **沙箱（Sandbox）** 定義技術邊界——Codex 在哪裡可以寫檔、能不能連網、哪些路徑禁止存取。
- **審批策略（Approval policy）** 定義何時要停下來問人——例如要離開沙箱、要連網、要跑沙箱外的指令。

兩者搭配使用：沙箱是底層技術隔離，審批是流程上的人類介入點。任何治理討論裡把這兩件事混為一談，都會導致策略過嚴（什麼都要審批）或過鬆（沙箱開放但沒審批）。

## 沙箱模式：read-only / workspace-write / danger-full-access

Codex 在本地端使用作業系統原生的沙箱機制：macOS 透過 Seatbelt、Linux 透過 seccomp + landlock、Windows 用原生實作或 WSL2。雲端版則是 OpenAI 託管的隔離容器。

三種沙箱模式：

| 模式 | 行為 | 使用情境 |
|------|------|----------|
| `read-only` | 只能讀，不能寫、不能執行 | 規劃、問答、code review |
| `workspace-write` | 能讀寫工作區內檔案、執行常規指令 | 日常開發（預設） |
| `danger-full-access` | 完全沒有沙箱 | 拋棄式 CI 容器、VM |

預設 `workspace-write` 加上 `network_access = false`，意思是：可以改檔、可以跑 `git`、`npm`、`pytest`，但要連外網就要審批。`writable_roots` 可以再進一步限定可寫目錄，例如只允許 `~/development`，把 `node_modules`、`.env`、`/etc` 都擋在外面。

## 審批策略：untrusted / on-request / never

審批策略決定 Codex 何時停下來問人：

- `untrusted`：只有已知安全的讀操作可自動執行，其他都要審批
- `on-request`：沙箱內自由動作，要跨越邊界（連網、寫沙箱外、跑非信任指令）才停
- `never`：永遠不問（適合非互動式 CI）

`on-request` 是最常見的甜蜜點：Codex 可以在 workspace 裡修檔、跑測試、提交 commit，只在要安裝新依賴或連外網時才打斷你。重構任務從「按四十次 allow」變成「按一次」。

## Auto-review：用子代理取代人類審批

這是 OpenAI 這次披露的最有意思的部分。傳統上使用者只有兩個選擇：手動審批（每個邊界都打斷）或 Full Access（完全放手），中間沒有平衡點。Auto-review 補上中間層：把審批決定交給另一個獨立的 Codex 子代理。

根據 [OpenAI Alignment 團隊的數據](https://alignment.openai.com/auto-review/)：

- Auto-review 模式下，需要打斷使用者的頻率比手動審批少約 **200 倍**
- 在需要審查的少數動作裡，Auto-review 會自動批准約 **99%**
- 即使被拒絕，Codex 在超過半數情況下能自行找到更安全的替代路徑

職責分離很關鍵：主代理被優化來完成使用者任務，會把審批邊界當成障礙；Auto-reviewer 的職責很窄——判斷一個跨邊界動作該不該執行，這讓策略更容易監控和迭代。Auto-reviewer 的提示詞是開源的，可以直接審視它的判斷邏輯。

設定方式：

```toml
# config.toml
approvals_reviewer = "auto_review"
sandbox_workspace_write.writable_roots = ["~/development"]

# requirements.toml（企業強制）
allowed_sandbox_modes = ["read-only", "workspace-write"]
```

## 網路政策：預設關閉，白名單放行

Codex 預設不開外網。OpenAI 內部用一份託管網路政策來管理：允許已知目的地、封鎖不希望連到的目的地、未知網域要審批。

```toml
# requirements.toml
allowed_web_search_modes = ["cached"]

[experimental_network]
enabled = true
allow_local_binding = true
denied_domains = ["pastebin.com"]
allowed_domains = ["login.microsoftonline.com", "*.openai.com"]
```

把 `pastebin.com` 等明顯的資料外洩管道列入黑名單、只允許登入服務和官方 API，是相當實用的預設值。雲端版則是預設整個 agent 階段都離線，只在 setup 階段允許安裝依賴；setup 階段可用的 secrets 在進入 agent 階段前會被清除。

## Rules：細粒度的指令前綴規則

不是所有 shell 指令都一樣危險。Rules 讓你針對特定指令前綴設定 `allow`、`prompt`、`forbidden`：

```python
# default.rules
prefix_rule(
    pattern = ["gh", "pr", ["view", "list"]],
    decision = "allow",
    justification = "Allows read-only GitHub PR inspection via gh CLI.",
)
prefix_rule(
    pattern = ["kubectl", ["get", "describe", "logs"]],
    decision = "allow",
    justification = "Allows Kubernetes resource inspection for debugging.",
)
```

這裡用的是 Starlark 語法（類 Python 但無副作用），可以列出 `match` / `not_match` 範例做「inline 單元測試」，避免規則寫錯。當多條規則同時匹配時，Codex 採最嚴格決定（`forbidden` > `prompt` > `allow`）。

## 身份、憑證與 Managed configuration

企業情境最關鍵的兩塊：

**身份綁定**：CLI 和 MCP 的 OAuth 憑證強制存進 OS keyring，登入強制走 ChatGPT，並綁定到指定的企業 workspace。所有 Codex 活動都會出現在 ChatGPT Compliance Logs Platform。

```toml
cli_auth_credentials_store = "keyring"
mcp_oauth_credentials_store = "keyring"
forced_login_method = "chatgpt"
forced_chatgpt_workspace_id = "<workspace-uuid>"
```

**Managed configuration**：企業管理員可下發 `requirements.toml`，這是使用者無法覆蓋的硬性限制。用來鎖定允許的沙箱模式、審批策略、網路行為、MCP server 白名單、功能開關等。設定來源有三層：雲端拉取的 requirements、macOS managed preferences、本地 requirements 檔案；可以針對不同團隊／環境給不同政策，但保持一致基線。

```toml
# requirements.toml
allowed_web_search_modes = ["disabled", "cached"]
allowed_sandbox_modes = ["workspace-write"]
allowed_approval_policies = ["on-request"]
```

當使用者試圖設定衝突的值，Codex 會自動降級到相容值並通知使用者，而不是直接報錯。

## Agent-native telemetry：解釋「為什麼」的日誌

控制只是一半，另一半是可見性。傳統安全日誌能告訴你「發生了什麼」（檔案被改、網路連線被嘗試），但解釋不了「為什麼」（使用者意圖、代理判斷脈絡）。

Codex 支援 OpenTelemetry log export，可記錄：

- 使用者原始 prompt
- 工具審批決定（誰允許、誰拒絕、原因）
- 工具執行結果
- MCP server 使用情況
- 網路代理的 allow/deny 事件

```toml
[otel]
log_user_prompt = true
environment = "prod"

[otel.exporter.otlp-http]
endpoint = "http://localhost:14318/v1/logs"
protocol = "binary"
```

OpenAI 內部把這些日誌餵給自家的 AI 安全分流代理：當 endpoint 警報出現可疑事件時，Codex 日誌補上原始請求、工具軌跡、審批決定和網路政策上下文，分流代理據此區分「正常代理行為 / 良性錯誤 / 真正需要升級的活動」。同一份遙測也用來追蹤內部採用率、工具使用模式、沙箱阻擋頻率，作為部署調整依據。

## 整體架構

```
┌─────────────────────────────────────────────────────┐
│  企業層：Managed configuration (requirements.toml)  │
│  ─ 雲端強制 / macOS preferences / 本地檔案          │
└─────────────────────────────────────────────────────┘
                        │ 下發
                        ▼
┌─────────────────────────────────────────────────────┐
│  使用者層：config.toml + .rules                     │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │ Sandbox │    │ Approval │    │ Network  │
   │ 技術邊界│    │ 何時問人 │    │ 連線政策 │
   └─────────┘    └──────────┘    └──────────┘
        │               │               │
        ▼               ▼               ▼
  ┌──────────────────────────────────────┐
  │  Codex Agent（local / cloud 兩個面向）│
  └──────────────────────────────────────┘
                        │
                        ▼ OTel logs
  ┌──────────────────────────────────────┐
  │  SIEM / Compliance Platform / 分流代理│
  └──────────────────────────────────────┘
```

## 整體來說

這套框架的核心取捨是：用**多層默認值 + 企業強制覆蓋 + 子代理審批**，把「AI Agent 自主性」與「企業治理可控性」這對矛盾拆成可獨立調整的旋鈕。沙箱、審批、Rules、Managed config、Telemetry 各管一段，每一段都能依風險容忍度調整，互相不耦合。

對團隊的意義在於：當你準備在企業內導入任何 Coding Agent（不只是 Codex，Claude Code、Cursor、Devin 都適用），這份文件提供了具體的政策設計樣板——什麼該強制、什麼該交給 Auto-review、什麼動作需要 audit log、什麼憑證該綁 OS keyring。AI Agent 安全部署不再是「要不要給代理權限」這種二分問題，而是「給多少層的可調控制面」這種設計問題。

## 參考資料

- [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)
- [Auto-review of agent actions without synchronous human oversight](https://alignment.openai.com/auto-review/)
- [Agent approvals & security – Codex | OpenAI Developers](https://developers.openai.com/codex/agent-approvals-security)
- [Sandbox – Codex | OpenAI Developers](https://developers.openai.com/codex/concepts/sandboxing)
- [Managed configuration – Codex | OpenAI Developers](https://developers.openai.com/codex/enterprise/managed-configuration)
- [Admin Setup – Codex | OpenAI Developers](https://developers.openai.com/codex/enterprise/admin-setup)
- [Configuration Reference – Codex | OpenAI Developers](https://developers.openai.com/codex/config-reference)
- [Rules – Codex | OpenAI Developers](https://developers.openai.com/codex/rules)
- [Addendum to GPT-5.2 System Card: GPT-5.2-Codex](https://deploymentsafety.openai.com/gpt-5-2-codex)
