---
title: "工具推薦｜AI Agent Gateway — 幫 agent 的 MCP／LLM 呼叫做憑證治理和稽核的開源閘道"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源閘道擋在 agent 和 MCP tool server／LLM provider 之間，用閘道自己發的 API key 做身分驗證、依 agent profile 限制能呼叫哪些工具、再把真正的憑證從加密金鑰庫注入，呼叫端永遠拿不到後端密鑰"
tldr: "AI Agent Gateway 是 Tuskira 開源的閘道，擋在 agent 和 MCP tool server／LLM provider 之間。安裝：docker compose -f deploy/docker-compose.yml up --build -d。解決了每個 agent 的 MCP 設定裡都要貼一份憑證、工具存取又只能整包開放或整包不開的問題。"
series:
  name: "AI Tool of the Day"
  order: 50
---

> 🌏 [English version](/posts/daily/2026-10-10-tool-ai-agent-gateway-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | AI Agent Gateway |
| 類型 | 閘道（MCP tool call + LLM traffic 的身分驗證／憑證注入／稽核層） |
| GitHub | [Tuskira/ai-agent-gateway](https://github.com/Tuskira/ai-agent-gateway) |
| Stars | 74（2026-10-01 建立，Tuskira 官方專案） |
| 語言 | Go（後端）+ Node.js（內建 console） |
| 授權 | Apache-2.0 |
| 安裝 | `docker compose -f deploy/docker-compose.yml up --build -d` |

## 解決什麼問題

你的 agent 要連 GitHub、Jira、內部資料庫這些服務，標準做法是在 MCP 設定裡寫好每個工具的連線資訊和憑證——`claude mcp add` 的那個 JSON 裡直接貼 API key 或 token。一個 agent、一組憑證還好處理；但一旦團隊裡有好幾個 agent，各自要連好幾個 MCP server，憑證就變成散落在每份 agent 設定檔裡、各自過期、各自輪替的東西。想收回某個 agent 對某個工具的存取，得先知道這把憑證還貼在哪些設定裡；想稽核「上週誰透過 agent 刪過 repo」，得去每個 MCP server 自己的 log 翻。更麻煩的是 MCP 的 `tools/list` 只負責列出有哪些工具，不負責擋——agent 看得到的工具清單，不等於它真的只能呼叫這些，很多包裝薄的方案只在列表層面做「過濾」，呼叫層面其實什麼都放得過去。

AI Agent Gateway 把這整條路徑收進一個閘道程序：agent 不再直連各個 MCP server 和 LLM provider，而是對著閘道打 API key，閘道才用加密金鑰庫裡的真實憑證去呼叫後端——呼叫端永遠拿不到那把憑證。存取範圍不是「列表時濾掉幾項」，而是定義在 agent profile 上、在**每一次 `tools/call`** 時強制檢查：沒有通過 profile 允許清單的工具呼叫，閘道直接回 JSON-RPC `-32003` 拒絕，不是列表裡悄悄消失而已。LLM 呼叫（Anthropic 直連或透過 Bedrock、OpenAI、Gemini）也走同一個閘道，順便把 token 用量和估算成本記下來。三個 plane 分開跑：`:8080` 給 MCP 流量、`:8081` 是控制 API 和內建 console、`:8082` 給 LLM 流量。

適合場景：團隊內有多個 agent 共用同一批 MCP server（GitHub、Jira、內部資料庫都接過一輪），想要「這個 agent profile 只能看 issue、不能刪 repo」這種細粒度控制，且要留稽核軌跡證明誰呼叫了什麼。如果你只是本機跑一個 agent 連自己的開發環境，這層閘道暫時用不到——直接接 MCP server 比多跑一個 Postgres + Go 服務划算。

## 快速上手

### 安裝

```bash
# 需要 Docker + Compose plugin，至少 4GB 可用記憶體
git clone https://github.com/Tuskira/ai-agent-gateway.git
cd ai-agent-gateway
docker compose -f deploy/docker-compose.yml up --build -d

# 等三個 plane 都活著
until curl -sf localhost:8081/api/v1/health >/dev/null; do sleep 1; done
curl localhost:8080/health          # MCP plane
curl localhost:8081/api/v1/health   # 控制面 + console
curl localhost:8082/health          # LLM plane
```

啟動後建立第一個管理員帳號：

```bash
docker compose -f deploy/docker-compose.yml exec gateway /gateway bootstrap-key
docker compose -f deploy/docker-compose.yml exec gateway /gateway create-user \
  -tenant default -username admin -role admin
```

`bootstrap-key` 只印一次 admin API key，存好；`create-user` 印一次性臨時密碼，登入 `http://localhost:8081` 後要求改密碼。

### 基本用法

Console 的 **MCPs → Catalog** 裡挑一個現成的 MCP server 註冊成 connector，取得閘道自己的 MCP endpoint 設定片段，貼進 agent：

```json
{
  "mcpServers": {
    "gateway": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer <你的 API key>",
        "X-Agent-Profile-Name": "read-only-analyst"
      }
    }
  }
}
```

沒有 `X-Agent-Profile-Name` 時，預設行為是整個 tenant 的工具全部可見可呼叫（`mcp.require_profile: false` 是預設值）——要收斂存取範圍，一定要建 profile 並帶上這個 header，或者直接把 API key 綁死在某個 profile 上。

### 進階用法

把 API key 綁死在一個 profile 上，之後不管 header 寫什麼，都只能呼叫 profile 允許的 `(connector, tool)` 配對：

```bash
curl -X PATCH http://localhost:8081/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $GATEWAY_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"profile_id": "'$PROFILE_ID'"}'

# 之後幫 profile 設定允許的工具（SetTools 是整批覆蓋，不是合併）
curl -X PUT http://localhost:8081/api/v1/profiles/$PROFILE_ID/tools \
  -H "Authorization: Bearer $GATEWAY_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"tools": [{"connector_id": "'$CONNECTOR_ID'", "tool_name": "get_issue"}]}'
```

綁定之後就算呼叫端在 header 裡謊報別的 profile 名稱，閘道也只認綁定的那個——這才是真的把一把 key「關」在一個範圍裡，單純靠 header 自報只能約束配合的 agent，擋不住故意繞過的呼叫。

## 與現有工具的比較

| | AI Agent Gateway | 憑證直接貼進每份 MCP 設定 | 泛用雲端秘密管理（Vault／AWS Secrets Manager） |
|---|---|---|---|
| 呼叫端完全看不到後端真實憑證 | ✅ 從加密金鑰庫注入 | ❌ 憑證就在設定檔裡 | 部分——秘密存中心化，但誰能用哪個秘密仍要自己接線 |
| 工具層級的存取控制（哪把 key 能呼叫哪個工具） | ✅ profile 強制在每次 `tools/call` | ❌ 全有或全無 | ❌ 不是 MCP 協定層的概念 |
| LLM 呼叫也走同一層治理 | ✅ Anthropic/Bedrock/OpenAI/Gemini 統一代理 | ❌ | ❌ 通常只管密鑰，不代理流量 |
| 內建存取日誌 + 成本追蹤 | ✅ console 內建 | ❌ 要自己接各服務的 log | 部分——看秘密存取紀錄，不含 LLM 呼叫明細 |
| 開箱即用、無須自架 | ❌ 要自己跑 Postgres + Go 服務 | ✅ | ✅（雲端代管） |

## 注意事項

- **還在 pre-1.0 alpha**：README 自己寫明 API 和設定格式在 minor version 之間可能還會變，正式環境接入前先盯緊 CHANGELOG 和 release note，別把目前的 profile/connector schema 當成穩定契約。
- **`X-Agent-Profile-Name` 單靠 header 不算真的隔離**：header 是呼叫端自己宣告的，只能約束乖乖配合的 agent；要真正把一把 key 鎖在一個存取範圍內，必須把 key 綁定到 profile（`profile_id`），不然惡意或寫錯的呼叫端可以自己換個 profile 名稱呼叫。
- **預設擋掉所有內網／loopback 位址的 outbound 連線**（含雲端 metadata `169.254.169.254`），這是刻意的 SSRF 防護，但代表接本機或私有網路上的 MCP server 時要自己設 `egress.allowed_cidrs` / `egress.allowed_hosts`，第一次架設常會卡在「明明 MCP server 在跑，閘道卻說連不到」。
- **跑起來不輕**：必須有 PostgreSQL，要接分析儀表板還要 ClickHouse，MCP plane 要多副本還要 Redis 相容的 session store（範例用 Valkey）——對單人或小團隊，這是額外的維運面，不是裝一個 binary 就結束。

## 今日收穫

大部分「幫 agent 接工具」的方案把身分、授權、憑證三件事混在一起：一把 API key 既代表「你是誰」，也直接等於「你能看到什麼」，因為那把 key 本身就是後端服務的真實憑證。AI Agent Gateway 的做法是把這三層拆開——閘道自己的 API key 認身分、agent profile 決定能呼叫哪些工具、加密金鑰庫裡的憑證才真正打到後端，呼叫端三件事裡只拿到第一件。而且授權檢查卡在 `tools/call` 而不是 `tools/list`：這個分野本身就是論點——「過濾一份列表」是建議，「擋下一次呼叫」才是控制。

## 參考資料

- [Tuskira/ai-agent-gateway — GitHub](https://github.com/Tuskira/ai-agent-gateway)
- [AI Agent Gateway — docs/profiles.md（agent profile 的允許清單與強制檢查機制）](https://github.com/Tuskira/ai-agent-gateway/blob/main/docs/profiles.md)
- [AI Agent Gateway — docs/security-model.md（SSRF 防護與 egress 白名單）](https://github.com/Tuskira/ai-agent-gateway/blob/main/docs/security-model.md)
- [AI Agent Gateway: Open-source tool keeps credentials out of agent configs — Help Net Security](https://www.helpnetsecurity.com/2026/10/07/open-source-ai-agent-gateway/)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io)
