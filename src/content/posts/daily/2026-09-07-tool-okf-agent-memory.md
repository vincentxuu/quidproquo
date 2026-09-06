---
title: "工具推薦｜okf-agent-memory — 把 AI Agent 的長期記憶存成可 code review 的 Git 檔案"
date: 2026-09-07
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Git-native 的 AI Agent 長期記憶格式與 MCP server，用純 Go 實作的本機 BM25 搜尋取代向量資料庫，也取代不斷長大的 CLAUDE.md"
tldr: "okf-agent-memory 是一個實作 Google OKF v0.2 規格的 Git-native agent 記憶系統，內建零依賴的 Go CLI 與 MCP server。安裝：`brew install okf-memory/tap/okf`。解決了『架構決策存在向量資料庫裡看不到、存在 CLAUDE.md 裡又只會無限長大』的問題。"
series:
  name: "AI Tool of the Day"
  order: 23
---

> 🌏 [English version](/en/posts/daily/2026-09-07-tool-okf-agent-memory-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | okf-agent-memory（`okf` CLI） |
| 類型 | 內嵌 MCP server + CLI |
| GitHub | [okf-memory/okf-agent-memory](https://github.com/okf-memory/okf-agent-memory) |
| Stars | 309 |
| 語言 | Go |
| 授權 | MIT |
| 安裝 | `brew install okf-memory/tap/okf` |

## 解決什麼問題

你是不是也遇過這種狀況：AI Agent 幫你做完一個功能、在過程中想清楚了一個架構決策，結果 context window 一關，這些「為什麼選這個方案」的推理過程就整個消失了？下一個 session 只能靠 Agent 重新讀一遍程式碼猜，或者你自己再把決策口述一次。常見的兩種解法都有代價：接上向量資料庫（Mem0、Letta 這類）等於多了一個要顧的黑盒子服務，搜出來的東西也看不出是怎麼被檢索到的；不然就是把所有東西一股腦塞進 `CLAUDE.md` / `AGENTS.md`，結果這份檔案只會越長越大，直到把 context window 塞爆——這就是 README 裡講的「memory rot」。

okf-agent-memory 提供第三條路：把 Agent 的長期記憶定義成 Google 發布的開放格式 OKF v0.2——一個個帶 YAML frontmatter 的 Markdown 檔案，存在專案的 `knowledge/` 資料夾裡，跟原始碼一起進 Git。查詢靠純記憶體內的 BM25 全文搜尋（宣稱 300 微秒等級），不打任何 embedding API；讀取靠「漸進式揭露」——每個資料夾有自己的 `index.md`，Agent 只載入真正需要的那個 concept，不是把整包知識庫倒進 context。整個工具用 Go 寫成單一執行檔，零外部依賴，內建的 MCP server 直接把 `search`、`show`、`create`、`update`、`relate`、`validate` 六個工具開給 Claude Code、Cursor 這類客戶端，也規定了「先搜尋、後寫入」的行為準則，減少同一件事被記錄兩次或互相矛盾的情況。

適合場景：跨多個 session 持續開發的專案，想把架構決策、ADR、踩過的坑存下來又不想架資料庫；想要記憶內容可以直接用 `git diff` / PR review 檢查，而不是完全信任 Agent 自己講的話；或者除了寫程式之外，也想在研究、教練、知識管理這類「非程式碼」場景套用同一套 Git-native 記憶結構。

## 快速上手

### 安裝

```bash
# macOS / Linux 用 Homebrew（推薦）
brew install okf-memory/tap/okf
okf version

# 或從原始碼建置（需要 Go 1.22+）
git clone https://github.com/okf-memory/okf-agent-memory.git
cd okf-agent-memory
make build
# 執行檔會產生在 bin/okf
```

### 基本用法

```bash
# 把完整的記憶骨架安裝進一個既有專案
okf bootstrap /path/to/my-project --name "My Project"
# 會建立：
#   knowledge/            OKF v0.2 記憶庫（index.md、log.md）
#   .agents/skills/okf-memory/   給 Agent 讀的技能說明
#   AGENTS.md             操作規範（含「先搜尋、後寫入」規則）
#   Makefile              make validate / make search 等捷徑

# 在動手前先查有沒有相關的既有決策
okf search "auth flow" knowledge

# 記錄一個新的架構決策
okf create decisions/auth-flow knowledge \
  --type Decision \
  --title "OAuth2 授權流程" \
  --desc "統一改用 PKCE 做 client 端驗證。"

# 收工前驗證記憶庫是否符合規格（graph 有沒有斷鏈、描述有沒有漂移）
okf validate knowledge --strict --drift
```

把 `okf mcp knowledge` 接進 Claude Code 或 Cursor 的 MCP 設定，Agent 就會拿到 `okf_search`、`okf_show`、`okf_create`、`okf_update`、`okf_relate`、`okf_validate` 六個工具：

```json
{
  "mcpServers": {
    "okf-memory": {
      "command": "okf",
      "args": ["mcp", "knowledge"]
    }
  }
}
```

### 進階用法

```bash
# 把兩個 concept 顯式串起來，避免記憶庫變成一堆孤立筆記
okf relate architecture/tooling architecture/layers knowledge \
  --desc "Tooling 實作了這五層架構"

# 用 --json 拿結構化結果，方便寫腳本檢查記憶庫健康度
okf validate knowledge --strict --drift --json
```

## 與現有工具的比較

| | okf-agent-memory | Mem0 / Letta 這類向量記憶 | 手寫 CLAUDE.md / AGENTS.md |
|---|---|---|---|
| 儲存位置 | Git 倉庫裡的 Markdown | 外部向量資料庫 / 服務 | 專案根目錄的純文字檔 |
| 搜尋延遲 | 官方數據 < 300 微秒（本機 BM25） | 150ms–800ms（含 embedding API） | 無搜尋，整份塞進 context |
| 需要外部服務或 API key | 不需要 | 需要（vector DB、embedding API） | 不需要 |
| 可用 `git diff` 人工審查 | 可以 | 不行（embedding 是黑盒） | 可以，但沒有結構 |
| 有沒有「已驗證 vs Agent 生成」的信任分層 | 有（`generated` / `verified`） | 通常沒有 | 沒有 |
| 會不會隨時間無限膨脹 | 有 `validate --drift` 把關 | 看框架設計 | 會（memory rot） |

## 注意事項

- **專案非常新**：2026-09-05 才建立，短短一兩天衝到 300+ stars，代表關注度高，但介面、MCP 工具參數都還可能改動，正式導入前先鎖版本。
- **只有字面搜尋，不是語意搜尋**：BM25 是關鍵字比對，query 用字跟記憶庫裡的用字差太多時搜不到，這點跟向量資料庫的語意檢索是不同取捨，需要的話得自己想好 tag/關鍵字慣例。
- **「先搜尋再寫入」只是規範，不是強制機制**：這條規則寫在 `AGENTS.md` 裡靠 Agent 自律遵守，如果 Agent 沒照做直接建立新 concept，一樣會出現重複或前後矛盾的記錄，`validate --drift` 只能抓描述漂移，抓不到語意重複。

## 今日收穫

過去看到的「Agent 記憶」方案幾乎只有兩種取捨：要嘛接向量資料庫、把記憶變成一個黑盒服務；要嘛全部塞進一份會員自己爆炸的 Markdown 檔案。okf-agent-memory 說明其實還有第三種做法——把記憶定義成一個有 schema、可以被 CI 驗證是否 conformant 的 Git 資料格式。這代表「Agent 記得了什麼」這件事，第一次可以被放進 PR review 裡跟程式碼一起被人看過，而不是只能選擇「完全信任黑盒」或「自己手動整理」兩個極端。

## 參考資料

- [okf-agent-memory GitHub repo](https://github.com/okf-memory/okf-agent-memory)：README、Stars、語言、授權（MIT）均出自官方 repo 與 GitHub API。
- [docs/CLI.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/CLI.md)：CLI 指令與 MCP 工具清單（`okf_search`、`okf_show` 等）。
- [docs/ALTERNATIVES.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/ALTERNATIVES.md)：與 Mem0、Letta、手寫 Markdown 的比較表。
- [docs/GETTING_STARTED.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/GETTING_STARTED.md)：Homebrew 安裝方式與 Claude Code / Cursor 設定範例。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
