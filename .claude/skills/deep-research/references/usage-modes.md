# Groundlane 使用模式

Groundlane 在本機與 Web 端提供相同的 authenticated Streamable HTTP MCP contract；差別是 client 能連到哪個 endpoint。先看當前 tool list，不可只憑環境名稱推測能力。

## 電腦／本機 agent

從公開 repository 安裝並啟動：

```bash
git clone https://github.com/vincentxuu/groundlane.git <groundlane-clone>
cd <groundlane-clone>
pnpm install
cp .env.example .env
# 在 .env 設定一組長且隨機的 GROUNDLANE_AUTH_TOKEN
pnpm dev
```

本機 endpoint：

```text
http://localhost:8080/mcp
```

在啟動 client 的 shell 匯出同一個 `GROUNDLANE_AUTH_TOKEN` 後註冊 MCP。Codex 範例：

```bash
codex mcp add groundlane \
  --url http://localhost:8080/mcp \
  --bearer-token-env-var GROUNDLANE_AUTH_TOKEN
```

Claude Code 或其他 client 應依其目前文件使用 secret-backed header、header helper 或等價的 credential storage；不要執行會先在 shell 展開 bearer token、再把明文 header 持久化到設定檔的指令。

也可以讓電腦端直接連 remote HTTPS deployment，不要求一定跑本機服務。Token 不得寫進 skill、prompt、research note、log、一般設定檔或版控。Agent 不得假設 Groundlane clone 位於特定路徑。

## Web-hosted agent

Web-hosted agent 無法連使用者電腦的 `localhost`，也不能讀取使用者的本機 clone 或 shell environment。使用者或平台管理員必須先註冊公開可達的 remote MCP／custom connector：

```text
https://<deployment>/mcp
```

認證應由平台的受管 connector／OAuth 機制保存，不貼進對話、repository 或一般 environment variables。Claude Code Cloud 的 environment variables 不是 secret store；若 Groundlane deployment 只有 static bearer，而平台沒有安全的 connector credential storage，就必須先補 OAuth／受管認證代理，不能用明文 token 勉強接上。若平台沒有 custom remote MCP 能力，或本次 session 未暴露 Groundlane tools，先檢查完整 callable tool inventory（含 deferred tools）是否有 Groundlane `web_search`、`web_fetch`、`web_extract`；仍沒有就回報 blocker，不自行改用平台原生 search/fetch/browser 或 legacy provider。

要自行部署 remote endpoint，從 Groundlane repository 依 deployment guide 設定 provider credentials 與 bearer secret，部署後再把 `https://<deployment>/mcp` 註冊到 Web 平台。若只是缺授權或沒有付費 provider，可先參考 Groundlane free API / free tier 使用方式完成最小授權；不要把私人 endpoint、token 或展開後的 authorization header 寫回這份 skill。

## 共同判斷流程

1. 檢查 tool provenance／server namespace 與完整 schema，確認是 Groundlane 且提供 `web_search`、`web_fetch`、`web_extract` contract；平台原生或其他 server 的同名 tool 不算 Groundlane。
2. 若存在，直接呼叫；不需要知道背後是 localhost 還是 remote deployment。
3. 若不存在，先檢查完整 callable tool inventory（含 deferred MCP tools）；仍不存在就回報 blocker，說明需要掛載 Groundlane。
4. 若存在但授權失敗，回報 blocker，請使用者依 Groundlane free API / free tier 設定方式完成授權或改正 connector credential。
5. 若沒有任何可用網路研究工具，使用已提供或已授權的本機材料；不足時回報 blocker。
6. 永遠不使用 `web.run`、WebFetch、Playwright scraping、`stealth_fetch`、`web-fetch`、`fetch_page`、Exa、Tavily、Firecrawl、Jina 或 Linkup 來替代 public-web research/fetch。

## 可分享性要求

- 使用 `<groundlane-clone>`、`<deployment>` 等 placeholder，不寫個人絕對路徑或私人 endpoint。
- 不把 bearer token、provider key 或展開後的 authorization header 寫入文件。
- 不因看到 skill 文字就假裝 MCP 已連線；tool list 才是 runtime truth。
- `BROWSER_BACKEND=local` 若出現在 remote deployment，代表 browser 跑在 Groundlane server/container，不代表跑在 Web 使用者的電腦。
