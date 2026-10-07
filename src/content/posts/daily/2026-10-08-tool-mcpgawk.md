---
title: "工具推薦｜mcpgawk — 攔住在你核准後偷改行為的 MCP server"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI，在 agent 呼叫 MCP server 前比對你核准過的基準，擋下工具定義被偷改過的呼叫，全程本機執行、不上傳清單"
tldr: "mcpgawk 是一個開源 CLI，記住你核准過的 MCP server 長什麼樣子，之後發現任何一個 tool 被改過就擋下呼叫。安裝：`uv tool install --force mcpgawk`。解決了 MCP server 審核通過後又悄悄改寫 tool 定義（rug-pull）卻沒人發現的問題。"
series:
  name: "AI Tool of the Day"
  order: 48
---

> 🌏 [English version](/posts/daily/2026-10-08-tool-mcpgawk-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcpgawk |
| 類型 | CLI（MCP server 安全掃描 + rug-pull 偵測） |
| GitHub | [gawk-dev/mcpgawk](https://github.com/gawk-dev/mcpgawk) |
| Stars | 0（2026-07-08 建立，今日剛在 Product Hunt 上線，社群驗證還很薄） |
| 語言 | Python |
| 授權 | Apache-2.0 |
| 安裝 | `uv tool install --force mcpgawk` |

## 解決什麼問題

你把一個 MCP server 接進 Claude Code 或 Cursor 之前,會看一眼它宣告了哪些 tool、權限合不合理,覺得沒問題就核准了。但 MCP 協定本身不會通知你「這個 server 後來更新了」——它下次啟動時夾帶一個新版本,tool 的描述、輸入 schema、甚至會不會寫入檔案都換了,agent 照樣呼叫新版本,完全不會多問一句。這就是這幾週資安圈在談的 MCP「rug-pull」:攻擊者或心懷不滿的維護者不需要騙你重新核准,只要在你已經信任的 server 裡悄悄換內容。

mcpgawk 做的事很直接:它先讀一次你機器上每個 agent 能連到的 MCP server,把每個 tool 的 schema、描述、權限標記記成一份基準。之後每次呼叫前都重新比對一次,只要跟基準不一樣就擋下來,換成跳出一個本機頁面讓你用肉眼看差異、自己按核准或拒絕——不是自動放行,也不是事後才在 log 裡告訴你。它同時把每個 tool 在連線時會塞進 context 的 token 數算出來,讓你知道裝了一堂 MCP server 之後,context 預算被吃掉多少。整套流程不接外部網路,量測結果只留在你自己的機器上。

適合場景:團隊裡已經接了不只一兩個 MCP server、換了好幾個維護者或版本,想在「agent 自己默默換了工具行為」真的出事之前先攔住的開發者。如果你只是本機跑一兩個自己寫的 server,從不更新,這層防護目前用不太到。

## 快速上手

### 安裝

```bash
# 需要 uv 或 pipx
uv tool install --force mcpgawk      # 或：pipx install --force mcpgawk

# 第一次執行：自動找出機器上每個 agent 的 MCP 設定
mcpgawk
```

### 基本用法

```bash
# 把基準檢查接進 agent 的呼叫流程，裝好之後自動生效
mcpgawk guard install
mcpgawk guard status          # 確認防護真的開著

# 單獨掃描一份 MCP 設定，不裝防護，只看現況
mcpgawk scan mcp.json

# 核准或拒絕剛剛被擋下、跟基準不一樣的呼叫
mcpgawk decide
```

### 進階用法

```bash
# 記錄歷史快照，之後能回答「這個 server 從上次核准到現在到底改了什麼」
mcpgawk scan mcp.json --track
mcpgawk changes

# CI：每次 PR 都檢查 MCP 設定的 token 成本和 drift，超標就讓 build 失敗
# .github/workflows/mcp-gate.yml
# - uses: gawk-dev/mcpgawk@v1
#   with: { config: mcp.json, max-tokens: 8000, fail-on-flagged: true }
```

## 與現有工具的比較

| | mcpgawk | 人工定期肉眼核對 | 一般雲端 MCP 掃描服務 |
|---|---|---|---|
| 偵測「核准後又被改」(rug-pull) | ✅ `--track` | ❌ 沒人會每次重看 | 部分支援 |
| 直接擋下呼叫，不是只回報 | ✅ `guard install` | ❌ | ❌ 多半只出報告 |
| 清單/掃描結果上傳雲端 | ❌（本機執行） | — | 通常會 |
| CI 整合 | ✅ GitHub Action | ❌ | 視廠商而定 |
| 免費可用 | ✅ 掃描/防護核心免費 | ✅ | 多為付費方案 |

## 注意事項

- **專案才剛起步**：GitHub 建立於 2026-07-08，目前 0 star、0 fork，PyPI 版本停在 0.1.x（Beta 狀態）。功能說明寫得完整,但缺乏長期社群驗證,先在非關鍵環境試用,別直接接進生產的核准流程。
- **攔截功能不是每個 agent 都支援**：`guard install` 的 pre-execution hook 官方列出目前只對 21 個支援的 client 中的 6 個生效,其餘的只會被標記為「沒有攔截點」,不會假裝自己有防護。
- **免費層只到本機單機**：掃描、`guard`、`--track` 這些核心功能是免費開源的,但跨機器集中管理（`enforce` 網關）和常駐監控（`monitor`）屬於付費的 mcpgawk Platform,要另外訂閱才能用。

## 今日收穫

多數「MCP 安全」的討論還停在「裝之前先看一眼 server 可以做什麼」,但 mcpgawk 提醒了一個更麻煩的事實:MCP 協定本身沒有版本通知機制,你核准的是「當下這一刻」的 tool 定義,不是這個 server 的長期承諺。把安全檢查從「裝之前看一次」換成「每次呼叫都比對基準」,才補上了這個協定設計上就留下的空隙。

## 參考資料

- [gawk-dev/mcpgawk — GitHub](https://github.com/gawk-dev/mcpgawk)
- [mcpgawk 官方網站與文件](https://mcp.gawk.dev/)
- [mcpgawk — PyPI](https://pypi.org/project/mcpgawk/)
- [mcpgawk — Product Hunt](https://www.producthunt.com/products/mcpgawk?launch=mcpgawk)
- [AI Agent Gateway: Open-source tool keeps credentials out of agent configs — Help Net Security](https://www.helpnetsecurity.com/2026/10/07/open-source-ai-agent-gateway)
