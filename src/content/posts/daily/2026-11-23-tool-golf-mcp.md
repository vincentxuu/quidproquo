---
title: "工具推薦｜Golf — 把 MCP server 的 auth、telemetry、部署從 2–4 週殺到 60 秒"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Golf 是開源的 Python MCP server 框架：寫一個 tools/ 目錄裡的函式，golf build 自動生成 schema、golf run 就有一個帶 JWT/OAuth 認證和 OpenTelemetry 追蹤的 server，省掉團隊反覆重寫的那層 plumbing"
tldr: "Golf 是一個 Python 框架，pip install golf-mcp 加 golf init 五分鐘可跑，用檔案結構定義 MCP tools，內建 auth 與 telemetry 設定。解決了每個團隊各自重寫 MCP server 認證、追蹤、部署邏輯、平均要花 2–4 週的問題。"
series:
  name: "AI Tool of the Day"
  order: 87
---

> :globe: [English version](/posts/daily/2026-11-23-tool-golf-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Golf |
| 類型 | Python 框架 + CLI |
| GitHub | [golf-mcp/golf](https://github.com/golf-mcp/golf) |
| Stars | 842（2026-11-22 查核時數字） |
| 語言 | Python |
| 授權 | Apache-2.0 |
| 安裝 | `pip install golf-mcp` |

## 解決什麼問題

你的團隊決定要做一個 MCP server——可能是把內部 API 包給 agent 用，或是對外開放一個工具給 Claude、Cursor 連。寫 tool 函式本身不難，但接下來要處理的是：怎麼驗證呼叫者身分（JWT？OAuth?）、怎麼追蹤每次呼叫花了多久、哪一步出錯、怎麼把這包東西變成一個能長期跑的 server 而不是本機腳本。Golf 的團隊訪談過 40 多個在做 MCP server 的團隊，得到的數字是：這層 plumbing 平均要花 2–4 週，而且每個團隊幾乎都在重寫同一套東西。

Golf 的做法是把「定義」和「跑起來」拆開。你只要在 `tools/`、`resources/`、`prompts/` 目錄下寫一般的 Python 檔案，一個檔案就是一個 MCP 元件：模組的 docstring 變成元件說明，函式參數自動推成輸入 schema，回傳的 Pydantic model 變成輸出 schema。`golf build` 把這些檔案編譯成一個可執行的 server，`golf run` 直接跑起來（預設 `localhost:3000`）。認證（JWT、OAuth 2.0 server 模式、開發用的 static token）寫在同一個專案裡的 `auth.py`，追蹤用環境變數開 OpenTelemetry，不用另外接線。它底層是建在 FastMCP 4.0.0 和 MCP 2026-07-28 協定上，不是重新造一套協定實作。

適合場景：團隊內部要快速對外開一個 MCP server、需要認證但不想每次重新設計 OAuth 流程、或是已經在用 FastMCP 寫 tool 但一直沒時間補 telemetry 和部署那塊。

## 快速上手

### 安裝

```bash
# 需要 Python 3.10+
pip install golf-mcp

# 建立專案（內附範例 tool/resource/prompt）
golf init my-project
cd my-project
```

### 基本用法

```python
# tools/hello.py
"""Say hello to someone."""

from pydantic import BaseModel, Field


class Output(BaseModel):
    message: str


async def hello(
    name: str = Field(default="World", description="Name to greet"),
    greeting: str = Field(default="Hello", description="Greeting word"),
) -> Output:
    msg = f"{greeting}, {name}!"
    print(msg)
    return Output(message=msg)


export = hello
```

```bash
# 編譯並啟動（預設 http://localhost:3000）
golf build dev
golf run
```

檔案路徑決定元件 ID：`tools/hello.py` 變成 `hello`，`tools/payments/submit.py` 變成 `submit_payments`。

### 進階用法（選填）

```python
# auth.py —— production 用 JWT
from golf.auth import configure_auth, JWTAuthConfig

configure_auth(
    JWTAuthConfig(
        jwks_uri_env="AUTH_JWKS_URI",
        issuer_env="AUTH_ISSUER",
        audience_env="AUTH_AUDIENCE",
        required_scopes=["mcp:invoke"],
    )
)
```

```bash
# 開 OpenTelemetry 追蹤（golf.json 設 opentelemetry_enabled: true 後）
export OTEL_EXPORTER=otlp_http
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
golf run
```

## 與現有工具的比較

| | Golf | FastMCP（原生） | 官方 MCP Python SDK |
|---|---|---|---|
| 檔案即元件（免手動註冊） | ✓ | ✗（用 `@mcp.tool` decorator 手動掛） | ✗（同樣用 decorator） |
| 內建 auth 設定（JWT / OAuth server） | ✓ | 開源庫未附，走獨立的 FastMCP Gateway 商業產品 | 未附，文件未提供 |
| 內建 OpenTelemetry 開關 | ✓（環境變數開） | 開源庫未附 | 未附 |
| CLI 腳手架（`init`/`build`/`run`） | ✓ | ✗（無對應指令） | 有 `mcp dev`/`mcp run`/`mcp install`，但無 auth/telemetry |
| 需要手寫 JSON Schema | ✗（型別推斷） | ✗（型別推斷） | ✗（型別簽名即 schema） |

Golf 站在 FastMCP 之上加了一層約定（檔案結構）和一層配置（auth、telemetry），換來的是不用自己決定「這個專案的 MCP server 要怎麼認證」；代價是多了一個框架要學,且 v0.1.x 升級到現在的 auth 寫法是 breaking change。

## 注意事項

- **inbound token 不能原樣轉發給上游 API**：README 明確警告，MCP 的 bearer token 是給這個 MCP resource 用的，呼叫上游服務要用獨立的憑證或標準化的 token exchange/delegation，不要直接轉傳。
- **static token 只能本機開發用**：正式環境一定要切 JWT 或 OAuth server 模式。
- **`detailed_tracing` 會把輸入輸出整包記進追蹤**：含敏感資料的 tool 要關掉這個選項，否則等於把資料寫進 trace。
- **SSE transport 已棄用**：只為相容舊 client 保留，新專案用 `streamable-http`。
- **CLI 會收匿名使用數據**（指令、成功/失敗、Golf 版本、OS、Python 版本），不含程式碼或錯誤訊息；`golf telemetry disable` 或加 `--no-telemetry` 可關。

## 今日收穫

MCP 協定本身解決的是「怎麼描述一個工具」，沒解決「這個工具要怎麼被信任地呼叫」——認證、追蹤、部署這些production 問題被留在協定之外，所以每個團隊都在協定之上重新發明一層。Golf 不是又一個 MCP SDK，它是把「大家都在重寫的那層」提煉出來變成約定，這跟 Vercel 對 Node server 做的事情本質上是同一招：框架的價值不在協定本身,在協定周圍那層沒人想重寫但每個人都得寫的東西。

## 參考資料

- [golf-mcp/golf — GitHub](https://github.com/golf-mcp/golf)
- [golf-mcp/golf — README](https://raw.githubusercontent.com/golf-mcp/golf/main/README.md)
- [golf-mcp 套件 — PyPI](https://pypi.org/project/golf-mcp/)
- [Launch YC: Golf — Open-source platform for shipping production MCP servers](https://ycombinator.com/launches/NYn-golf-open-source-platform-for-shipping-production-mcp-servers)
- [jlowin/fastmcp — GitHub](https://github.com/jlowin/fastmcp)
- [modelcontextprotocol/python-sdk — GitHub](https://github.com/modelcontextprotocol/python-sdk)
