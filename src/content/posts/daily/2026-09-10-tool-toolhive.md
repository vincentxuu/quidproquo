---
title: "工具推薦｜ToolHive — 讓每個 MCP server 都跑在隔離容器裡"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源平台把每個 MCP server 包進獨立容器啟動，拿掉本機憑證，並提供 curated registry 和身分/存取策略"
tldr: "ToolHive 是 Stacklok 開源的 MCP server 執行期管理平台，用 CLI（thv）或 Kubernetes Operator 把每個 MCP server 跑在隔離容器裡。安裝：brew install stacklok/tap/thv。解決了「MCP server 直接裝在本機、拿著本機憑證和網路權限亂跑」的問題。"
series:
  name: "AI Tool of the Day"
  order: 26
---

> 🌏 [English version](/en/posts/daily/2026-09-10-tool-toolhive-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | ToolHive |
| 類型 | CLI（也提供 Kubernetes Operator） |
| GitHub | [stacklok/toolhive](https://github.com/stacklok/toolhive) |
| Stars | 2,152 |
| 語言 | Go |
| 授權 | Apache-2.0 |
| 安裝 | `brew tap stacklok/tap && brew install thv` |

## 解決什麼問題

你在 Claude Code、Cursor 或 VS Code 裡裝 MCP server，通常就是照 README 貼一行 `npx` 或 `pip install` 直接跑。這代表那個 server 進程拿到的是你本機的權限：能讀你的檔案系統、能連你的網路、能碰到環境變數裡的憑證。你沒辦法簡單知道它連了哪些外部網址，也很難在團隊裡統一管控「誰裝了哪些 MCP server、它們碰得到什麼」。

ToolHive 把每個 MCP server 丟進獨立容器（用 Docker、Podman 或 Kubernetes）啟動，套上一份最小權限檔，不帶本機憑證進去；如果作者沒有提供容器映像，ToolHive 甚至會直接從套件管理器（npm/pip 等）動態幫你建一個容器出來跑。接上身分提供者（OIDC/OAuth）後，它還能依請求做身分與存取策略檢查，並留下稽核紀錄。CLI 工具 `thv` 負責管理這一切——找 server、啟動、列出狀態、停止。

適合場景：個人開發者想讓 MCP server 有隔離邊界又不想手動寫 Docker Compose；平台團隊想要一個自架、可稽核的 MCP registry 與 gateway，統一管控團隊能用哪些 server；企業想在 Kubernetes 上用 Operator 大規模部署 MCP server 並接上既有的身分治理系統。

## 快速上手

### 安裝

```bash
# macOS / Linux（Homebrew）
brew tap stacklok/tap
brew install thv

# 驗證安裝
thv version
```

Windows 可用 WinGet，或直接下載預編譯的二進位檔（見 GitHub Release）。跑容器化的 MCP server 需要先裝好 Docker、Podman 或 Colima 其中一種。

### 基本用法

```bash
# 看內建 registry 有哪些現成 MCP server
thv registry list

# 看單一 server 的詳細資訊（提供哪些 tools、需要什麼設定）
thv registry info toolhive-doc-mcp

# 在隔離容器中啟動這個 MCP server
thv run toolhive-doc-mcp

# 確認正在跑的 server 與它的 proxy port
thv list

# 用完之後停止 / 徹底移除
thv stop toolhive-doc-mcp
thv rm toolhive-doc-mcp
```

### 進階用法

```bash
# 自動幫支援的 client（VS Code、Cursor、Claude Code 等）寫入 MCP 設定
thv client setup
thv client status

# 指定 proxy port，避免和其他服務衝突
thv run --proxy-port 8081 toolhive-doc-mcp

# 不想跑容器？直接連 ToolHive 官方託管的版本
thv run toolhive-doc-mcp-remote
```

## 與現有工具的比較

| | ToolHive | 手動 `npx`/`pip` 直接跑 | 自己寫 Docker Compose |
|---|---|---|---|
| 容器隔離＋最小權限檔（不帶本機憑證） | ✅ | ❌ | 部分（需自行設計） |
| 內建 curated registry + 簽章/來源驗證 | ✅ | ❌ | ❌ |
| 自動幫 client（VS Code/Cursor/Claude Code）寫設定 | ✅ | ❌ | ❌ |
| Kubernetes Operator，企業規模部署 | ✅ | ❌ | 需自行實作 |
| 身分/存取策略（OIDC/OAuth）+ 稽核紀錄 | ✅（需接 IdP） | ❌ | 需自行實作 |

## 注意事項

- **需要容器執行環境**：跑容器化的 server 必須先裝 Docker、Podman 或 Colima 其中一種；不想裝的話只能改用官方提供的 `-remote` 變體（連到 ToolHive 託管端點），但能用的 server 有限。
- **身分治理是企業版的事**：ToolHive Community（開源、免費）就能做隔離和基本 registry；正式接 Okta / Entra ID 的 SSO、集中式治理和硬化過的正式環境 server，官方引導走付費的 Stacklok Enterprise。
- **雲端瀏覽器介面已退役**：官方把 browser-based cloud UI 標記為 retired，規劃導入時應該圍繞桌面 App 和 CLI，不要依賴那個介面。

## 今日收穫

以前覺得「這個 MCP server 安不安全」只能靠自己讀 README、看 issue 區有沒有人抱怨,是一種很主觀的信任判斷。ToolHive 把這件事變成可驗證的機制——安不安全不再取決於你有沒有仔細審過程式碼，而是它有沒有機會碰到你機器上的真實憑證；容器邊界和權限檔把「信任一個陌生 server」這件事,從道德判斷降級成工程配置。

## 參考資料

- [stacklok/toolhive GitHub repo](https://github.com/stacklok/toolhive)：README、Stars、語言、授權（Apache-2.0）均出自官方 repo。
- [ToolHive CLI Quickstart](https://docs.stacklok.com/toolhive/guides-cli/quickstart)：安裝指令、`thv` 指令範例與運作流程說明出處。
- [ToolHive: The open-source way to run any MCP server securely — Help Net Security](https://www.helpnetsecurity.com/2026/09/07/toolhive-open-source-mcp-server-security/)：架構四大元件（Runtime／Registry Server／Gateway／Portal）與雲端 UI 退役資訊出處。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
