---
title: "工具推薦｜mcp-guardrail — 幫每個 MCP tool 呼叫加一層准駁與稽核"
date: 2026-08-25
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "mcp-guardrail 是一個攔在 MCP client 和真正 MCP server 之間的 stdio proxy，用 policy.yaml 決定 agent 能呼叫哪些 tool、把每次呼叫寫進稽核 log，並掃描 config 裡貼死的 API key"
tldr: "mcp-guardrail 是一個開源的 MCP 安全 proxy：policy gateway + 稽核 log + 密鑰掃描三合一。安裝：clone 後 `pip install -e .`。解決了 MCP server 設定普遍沒有 tool 層級權限收斂、金鑰又常常寫死在設定檔裡的問題。"
series:
  name: "AI Tool of the Day"
  order: 10
---

> 🌏 [English version](/en/posts/daily/2026-08-25-tool-mcp-guardrail-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-guardrail |
| 類型 | MCP 安全 proxy（policy gateway + audit log + secret scanner） |
| GitHub | [KiaanKothari/mcp-guardrail](https://github.com/KiaanKothari/mcp-guardrail) |
| Stars | 2 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone` 後 `pip install -e .`（尚未上 PyPI） |

## 解決什麼問題

你是否配置過一堆 MCP server——GitHub、資料庫、檔案系統、shell——讓 agent 直接串接，卻從沒細想過「這個 agent 現在能呼叫的 tool 清單裡，有沒有一個是我其實不想讓它自己決定要不要用的」？多數團隊把 MCP server 當成一個整體來授權：能連上這個 server,就等於這個 server 底下所有 tool 都能叫，包括 `github.delete_repo`、`shell.exec` 這類破壞性操作。而且不少人會把 API key 直接寫死在 `mcpServers` 的 config 檔裡，一旦 config 被貼進 issue 或 commit,金鑰就外流了。

mcp-guardrail 是一個攔在 MCP client 和真正 MCP server 中間的 stdio JSON-RPC proxy：把原本直接啟動 real server 的設定改成先過 `mcp-guardrail run`，並帶一份 `policy.yaml`（allow/deny 規則配 glob pattern，由上往下比對，預設 `deny`）。每一個 `tools/call` 先過 policy 檢查，被擋的請求直接回錯誤、根本不會送到真正的 server；不管准駁,所有呼叫都寫進本機 JSONL 稽核檔，可以 tail、grep 或事後彙總。另外它還內建一個範圍很窄的 secret scanner，專門抓設定檔裡貼死的 API key／token（AWS、GitHub、Slack、OpenAI、Anthropic、PEM 私鑰等 pattern），可以當 CI 檢查跑，抓到就非零結束。

適合場景：已經串了多個高風險 MCP server（GitHub、shell、資料庫）的團隊,想要一個「agent 到底能做什麼」的可稽核邊界,而不是只靠 agent 自律；或是想拿它的 scan 指令,把整個 MCP 設定目錄掃一輪,揪出寫死的金鑰。

## 快速上手

### 安裝

```bash
git clone https://github.com/KiaanKothari/mcp-guardrail.git
cd mcp-guardrail
pip install -e .
```

### 基本用法

```bash
# 1. 產生一份 policy 起手式
mcp-guardrail init

# 2. 把原本直接啟動的 MCP server 換成過 guardrail
#    （Claude Code / Claude Desktop 的 mcpServers 設定）
```

```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-guardrail",
      "args": [
        "run", "--policy", "/path/to/policy.yaml", "--",
        "npx", "-y", "@modelcontextprotocol/server-github"
      ]
    }
  }
}
```

```bash
# 3. 看剛剛發生了什麼
mcp-guardrail report
```

### 進階用法

```bash
# 掃描設定目錄裡貼死的 API key／token，可接進 CI
mcp-guardrail scan ~/.config/claude/
```

policy.yaml 的規則是逐條由上往下比對，第一個命中的 pattern 生效，沒命中就落回 `default`：

```yaml
default: deny

rules:
  - tool: "github.create_issue"
    action: allow
  - tool: "github.delete_*"
    action: deny
    note: "destructive GitHub actions are never auto-approved"
```

## 與現有工具的比較

| | mcp-guardrail | 直接裸接 real server | 通用 secret scanner（gitleaks 等） | Host 原生工具權限設定 |
|---|---|---|---|---|
| Tool 層級 allow/deny policy | ✅（glob pattern） | ❌ | ❌（不懂 MCP 語意） | 依 host 而異，通常較粗 |
| 呼叫稽核紀錄可事後查 | ✅（本機 JSONL） | ❌ | ❌ | 多數 host 沒有獨立可攜出的稽核檔 |
| 針對 MCP config 的密鑰掃描 | ✅ | ❌ | 部分（通用 pattern,非 MCP 專用啟發） | ❌ |
| 換 MCP client 仍可沿用同一份設定 | ✅（proxy 層,與 host 無關） | — | — | ❌（權限設定綁在特定 host） |
| 需要額外服務或帳號 | 不需要,純 CLI | — | 不需要 | 不需要 |

## 注意事項

- **transport 支援有限**：目前只處理標準的 newline-delimited JSON-RPC 2.0 over stdio,用 Content-Length framing 或其他 transport 的 MCP server,需要自己改 `proxy.py` 的 read loop。
- **還沒上 PyPI、剛起步**：只能 clone 後 `pip install -e .`,建立於 2026-08-24,目前只有單一貢獻者、2 顆星,policy schema 未來可能還會調整。
- **policy 目前只卡 tool 名稱**：還沒有「依參數值」決定准駁的細規則（例如同一個 tool 依傳入路徑判斷要不要放行），README 自己也把這列在待做清單。

## 今日收穫

多數人在意「這個 agent 能不能連上這個 MCP server」，卻很少有工具卡在再下一層——「連上之後,它具體能叫哪些 tool」。mcp-guardrail 提醒了一件事：MCP 生態目前的預設信任邊界是「整個 server」,而不是「單一 tool」,這中間的差距,就是它想補上的位置。

## 參考資料

- [mcp-guardrail GitHub repo](https://github.com/KiaanKothari/mcp-guardrail)：專案介紹、README、install 指令、policy schema、proxy 運作方式、授權（MIT）均出自官方 README。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
