---
title: "Claude Code 怎麼接上外部工具：MCP server 的三種 scope、transport 與認證"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, mcp, mcp-server, integration, ai-agent]
lang: zh-TW
tldr: "Claude Code 用 MCP（Model Context Protocol）連外部工具，設定分三種 scope：專案共用放 .mcp.json、個人跨專案和 local 都在 ~/.claude.json、企業走 managed config——不在 settings.json。本文涵蓋 claude mcp add／login 流程、SSE 已 deprecated 的 transport 現狀，以及 tool search 延遲載入。"
description: "Claude Code MCP server 設定完整說明：local／project／user 三種 scope 的選擇、stdio 與 HTTP transport、OAuth 認證流程、tool search 延遲載入與 /mcp 除錯。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 14
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en)

系列前面幾篇講過 Claude Code 內建的工具集（見[系列入口](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)），但內建工具再強也只碰得到你的檔案系統和終端機。當你發現自己一直在「從 issue tracker 複製文字貼進對話」、「把監控面板的數字抄給它」，那就是該接 MCP server 的訊號。[官方文件的說法](https://code.claude.com/docs/en/mcp)是：接上之後，Claude 可以直接讀取並操作那個系統，而不是靠你貼上的二手資訊工作。

## MCP 解決什麼問題

[MCP](https://code.claude.com/docs/en/mcp) 是 AI 工具整合的開放標準：server 把一組 tool 定義暴露出來，client（這裡是 Claude Code）把這些 tool 併進自己的工具集。要說清楚增量在哪：沒有 MCP，你也能讓 Claude 跑 `gh` 指令操作 GitHub、用 psql 查資料庫——shell 本來就通。MCP 多做的事是**結構化**：tool 有 schema、有型別、有名稱可以寫進 permission rules 和 hook matcher，而且同一個 server 可以被 Claude Desktop、Cursor 等 client 重用，不用每家重寫一次整合。

## 三種 scope 怎麼選

先講最容易踩的坑：**MCP server 設定不在 settings.json**。settings.json 管 permissions 和 hooks（詳見[settings.json 大全](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide)），MCP server 另外放在三個地方：

| Scope | 載入範圍 | 團隊共用 | 存放位置 |
|-------|---------|---------|---------|
| Local（預設） | 只有當前專案、只有你 | 否 | `~/.claude.json` 該專案條目下 |
| Project | 當前專案 | 是，靠版控 | 專案根目錄 `.mcp.json` |
| User | 你的所有專案 | 否 | `~/.claude.json` 頂層 `mcpServers` |

選擇邏輯很直接：帶 API key、不想進版控的個人工具用 **local**；整個團隊都要用的（如 GitHub、Sentry）用 **project**，把 `.mcp.json` commit 進 repo；自己跨專案都會用的（如 Notion）用 **user**。同名 server 在多處定義時，優先序是 local > project > user，整個 entry 取用不合併欄位。

組織還有第四條路：managed configuration，管理員用 `managed-mcp.json` 部署固定的 server 清單，並以 allowlist／denylist 限制使用者能接什麼。

Project scope 有個安全設計要知道：clone 別人的 repo 時，`.mcp.json` 裡的 server 不會自動啟動，第一次會跳出核可提示——不然任何 repo 都能在你機器上起程序。v2.1.196 起更進一步，未信任工作區裡連 commit 進 repo 的核准設定都不算數，一定要你在本機跑過 `claude` 接受信任對話框。

## 新增與認證

新增一個 server 就一行：

```bash
# 遠端 HTTP server（Notion）
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 本地 stdio server（Playwright），-- 之後是要執行的指令
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

`--` 是新手最常漏的東西：它後面的參數原封不動交給 server，沒有它的話 `--port` 這類旗標會被 Claude Code 當成自己的選項吃掉。`.mcp.json` 支援 `${VAR}` 和 `${VAR:-default}` 展開，所以 team 共用的設定可以把 key 留在各自的環境變數裡。

需要登入的 hosted service（Sentry、Linear 這類）走 OAuth：加完之後 `claude mcp list` 會顯示 `! Needs authentication`，開 session 跑 `/mcp` 選 Authenticate 完成瀏覽器登入。不想開 session 的話，v2.1.186 起 `claude mcp login sentry` 直接在 shell 裡跑完 OAuth 流程，SSH 環境還會偵測沒有瀏覽器、改印 URL 讓你貼回來。偏好靜態 token 的服務則在 add 時掛 `--header "Authorization: Bearer <token>"`。

## Transport 現狀

四種 transport，寫設定前先確認你要哪種：

- **HTTP**：遠端 server 的推薦選項，雲端服務支援度最高。
- **stdio**：本地程序，適合要直接碰檔案系統或瀏覽器的工具。
- **WebSocket**：適合主動推事件的 server，但 `claude mcp add --transport` 不收 `ws`，只能寫 JSON 或用 `add-json`。
- **SSE**：**已 deprecated**。少數服務還只提供 SSE endpoint，能用 HTTP 就換 HTTP。

手上有別家 client（如 Claude Desktop）的設定時，看形狀判斷：URL 就是遠端、launch command 是 stdio、`mcpServers` JSON 區塊用 `claude mcp add-json` 餵進去——注意要傳裡面的物件不是外層 wrapper，且只有 `url` 沒有 `type` 的 entry 要補 `"type": "http"`，否則會被當成 stdio server 而載入失敗。

## 大工具集靠 tool search 撐

每個 MCP server 的 tool 名稱和說明都會佔 context window，接了十幾個 server 之後光 tool 定義就能吃掉可觀的額度。tool search 是目前的解法，預設開啟：session 啟動時只載入 tool 名稱與 server instructions，完整的定義延後到 Claude 實際搜尋、呼叫時才載入。官方明講沒有固定的每 server tool 數上限，實際限制就是 context 預算。

行為可以用 `ENABLE_TOOL_SEARCH` 調：`auto:N` 設定門檻（定義總量超過 context 的 N% 才啟動延遲）、`false` 回到全部預先載入。副作用是 server instructions 變得更重要——它們是 Claude 決定「何時去搜尋這組工具」的依據，各被截斷在 2KB，關鍵資訊要放前面。

## 除錯：/mcp 面板

除錯入口就是 session 內的 `/mcp`：每個 server 旁邊顯示連線狀態和 tool 數量，可以重新連線、重新認證、或暫時停用而不刪設定。shell 端 `claude mcp list` 也會列健康狀態，連線失敗時附上 HTTP 狀態碼和 server 回的錯誤文字。常見症狀對症下藥：

- 啟動逾時：`npx` 第一次下載套件慢，`MCP_TIMEOUT=60000 claude` 放寬到六十秒。
- Server 連上但沒有 tool：通常是缺環境變數，`--env KEY=value` 或 `.mcp.json` 的 `env` 欄位補上。
- 改了 `.mcp.json` 沒生效：它是 session 啟動時讀的，重開 session；之前按過拒絕就跑 `claude mcp reset-project-choices`。
- Tool 輸出超過 10,000 tokens 會警告、25,000 tokens 上限截斷，要用更多就設 `MAX_MCP_OUTPUT_TOKENS`。

## 學到的事

MCP 的設定面拆開來其實只有兩個決定：**scope 決定誰看得到這組工具**（`.mcp.json` 給團隊、`~/.claude.json` 給你自己、managed config 給組織），**transport 決定怎麼連**（遠端 HTTP、本地 stdio，SSE 別再新用）。剩下的都是流程——add、login、`/mcp` 看狀態。跟[.claude 目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)裡的其他設定檔一樣，搞清楚「什麼東西存在哪個檔」之後，除錯就只是打開對的檢查點而已。

## 參考資料

- [Connect Claude Code to tools via MCP — Claude Code Docs](https://code.claude.com/docs/en/mcp) — 三種 scope、四種 transport、OAuth 與 `claude mcp login`、tool search 設定的完整官方參考
- [Connect to MCP servers（quickstart）— Claude Code Docs](https://code.claude.com/docs/en/mcp-quickstart.md) — 從 add 到驗證連線的 step-by-step，含設定檔磁碟位置表與 troubleshooting 清單

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（SSE transport 已 deprecated、tool search 預設開啟、`claude mcp login` 自 v2.1.186 起）。
