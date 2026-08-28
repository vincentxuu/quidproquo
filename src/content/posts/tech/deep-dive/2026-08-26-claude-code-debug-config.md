---
title: "Claude Code 設定了卻沒生效怎麼診斷：/context、/doctor、/mcp 與錯誤對照"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, debug, dx, settings]
lang: zh-TW
tldr: "CLAUDE.md 寫了沒被遵守、hook 不觸發、MCP server 沒出現，多半是檔案沒載入、載錯位置或被另一層設定覆蓋。本文整理 /context、/memory、/skills、/doctor、/mcp 等診斷入口各看什麼、safe mode 二分法，以及六條高頻錯誤訊息的對照表。"
description: "Claude Code 設定診斷指南：用 /context、/memory、/skills、/doctor、/mcp 檢查什麼真的被載入，理解 managed/command-line/local/project/user 設定優先序，用 --safe-mode 二分法定位問題，並對照常見執行期錯誤訊息的修法。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 35
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en)

「我在 CLAUDE.md 寫了規則，它就是不遵守」「hook 定義好了，完全沒反應」「MCP server 加了，工具列表是空的」——這類「設定了但沒生效」的問題，是 Claude Code 使用者回報最多的其中一類。官方診斷文件把原因歸納成三種：**檔案根本沒載入、載入的位置跟你預期不同、或被另一份檔案覆蓋**。這篇講的就是怎麼分辨這三種情況：先靠診斷指令看「實際載入了什麼」，再用 safe mode 二分法縮小範圍，最後附一張高頻錯誤訊息對照表。安裝與登入問題不在此篇範圍，請看[系列的安裝疑難排解篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)。

## 診斷入口：各看什麼

核心原則只有一句話：不要猜，直接看 Claude Code 實際載入了什麼。第一步永遠是 `/context`——它列出目前 session 的 context window 全部分佈：system prompt、內建工具、MCP 工具、subagents（含各自的載入來源）、記憶檔、skills、對話訊息。如果你的 CLAUDE.md 或 skill 根本沒出現在清單裡，問題就是「沒載入」，不用再往下猜行為。確認有載入之後，再按類別深入：

| 指令 | 看什麼 |
|------|--------|
| `/context` | context window 全貌：各類內容佔用與載入來源，判斷某個檔案有沒有進來 |
| `/memory` | 使用者與專案兩個層級的記憶檔位置，可直接在編輯器開啟，含 auto memory 開關 |
| `/skills` | project、user、plugin 來源提供的可用 skills |
| `/hooks` | 目前 session 生效的 hook，照事件分組 |
| `/doctor` | 健檢：安裝健康狀態、無效的 settings 檔、同一目錄重複的 subagent 名稱、未使用的擴充，並附修正建議 |
| `/mcp` | 每個 MCP server 的連線狀態，以及你是否已在這個專案核准它 |
| `/permissions` | 目前解析後真的生效的 allow / deny 規則 |
| `/debug [issue]` | 對這個 session 開 debug logging，並讓 Claude 用 log 與 settings 路徑診斷問題 |
| `/status` | 目前作用中的 settings 來源，包含 managed settings 是否存在 |

終端機也能跑 `claude doctor`，唯讀印出安裝與設定診斷、不啟動 session，適合放進腳本。若 `/context` 確認 CLAUDE.md 已載入但仍不遵守，官方文件現在把問題明確切到「instruction 是否夠具體、是否彼此衝突、檔案是否過長」這一層；這時要改的是規則寫法，不是再找載入路徑。

## 你的設定被誰覆蓋了

settings 是多層合併的。官方優先序是：managed（組織派發）最高，其次是單次啟動的 command-line / `--settings`，再來才是 project local（`.claude/settings.local.json`）、shared project（`.claude/settings.json`）、user（`~/.claude/settings.json`）。部分 key 還有環境變數對應，實際優先序要看 settings reference。也就是說，「明明設了卻沒效」最常見的答案不是 bug，而是同一個 key 在更高優先序的來源也被設了。

幾條高頻地雷：

- **`~/.claude.json` 不是 settings file**。它是 Claude Code 自己寫的狀態檔，會放登入 session、部分 MCP 設定、project trust decisions、以及 `/config` 寫入的 global config keys；`permissions`、`hooks`、`env` 這類 settings 要寫在 `~/.claude/settings.json`。
- **MCP server 設定不放在 settings.json**。專案層級寫在 repo 根目錄的 `.mcp.json`（key 是 `mcpServers`，不是 VS Code 慣用的 `servers`），使用者層級用 `claude mcp add --scope user` 讓 CLI 寫入對應位置。遠端 HTTP server 的 JSON entry 有 `url` 就要有 `type: "http"`（或 `sse` / `ws`）；缺 `type` 現在會被明確報成設定錯誤。
- **專案 `.mcp.json` 需要一次性的核准與 workspace trust**。第一次彈出核可提示時按掉，server 就會一直保持停用；從 `/mcp` 重新核准。新 clone 不能靠 repo 內提交的 approval 自己批准自己，要先 trust workspace，或由 user / managed / `--settings` 層提供核准。
- **`/mcp` 現在要看狀態細節，不只看有沒有出現**。遠端 server 可能是 `cached ... connects on first use`、`Pending approval`、`Disabled for this project`、`Failed to connect`、或 `not configured`。如果 connected 但 0 tools，先在 `/mcp` 裡 Reconnect；仍然 0 tools，再用 `claude --debug=mcp` 看 `~/.claude/debug/<session-id>.txt` 裡 server stderr。
- hook 的 `matcher` 是單一字串，要比對多個工具用 `|` 分隔（如 `"Edit|Write"`）。Claude Code v2.1.191 之後逗號也等同分隔符；舊版才會把逗號當 literal 而靜默比不到。工具名稱大小寫敏感，`bash` 配不到 `Bash`。而 matcher 誤寫成 array 屬於 schema 錯誤，Claude Code 會拒絕那份 user/project/local settings file 的 hook；managed settings 則會丟掉該檔的整個 `hooks` key，其他設定仍套用。`claude doctor` 會報出來。

## Safe mode：二分法找兇手

前面的診斷入口都查過還是不確定是哪一層的問題時，用 `claude --safe-mode` 開一個「全部客製化都關掉」的 session：CLAUDE.md、skills、plugins、hooks、MCP servers、自訂指令與 agents 全部停用，認證、模型選擇、內建工具與權限照常運作。

結果是二分的：

- **safe mode 下問題消失** → 兇手在你某一項客製化裡，回到上面的針對性檢查逐項找出是哪一個。
- **safe mode 下問題還在** → 把範圍再縮到乾淨環境：`cd /tmp && CLAUDE_CONFIG_DIR=/tmp/claude-clean claude`，繞過整個 `~/.claude`，也不載入任何專案設定。問題在這個乾淨 session 消失，就逐一把你原本的檔案加回去定位；還在，那原因在你的使用者與專案設定之外——先跑 `/status` 看 managed settings 是否在作用，再查影響 Claude Code 的環境變數。

注意組織派的 managed hooks 與設定政策在 safe mode 仍然生效；那是唯一帶進來的東西。

## 常見錯誤訊息對照

設定之外，另一大類卡關是執行期錯誤。官方有一頁完整的 error reference，底下挑六條最高頻的整理成表（完整清單以官方頁為準）：

| 訊息 | 原因 | 修法 |
|------|------|------|
| `API Error: 500 Internal server error` | API 端的預期外錯誤，通常是暫時性的 server-side issue | 等一分鐘再送；持續發生查 status.claude.com 或你實際使用的 provider / gateway 狀態頁 |
| `API Error: Repeated 529 Overloaded errors` | API 容量暫時滿載；這不是你的 usage limit，也不會計入 quota | 過幾分鐘再試；持續發生查 status.claude.com 或訊息中指定的 provider / gateway |
| `Prompt is too long`（也可能顯示 `Input is too long for requested model`、`Context limit reached · /compact or /clear to continue`） | 對話加上附加檔案超過模型的 context window | `/compact` 摘要騰空間或 `/clear` 重開；用 `/context` 看什麼吃掉窗口，`/mcp disable <name>` 停用不必要的 MCP server |
| `Unable to connect to API`（含 `ConnectionRefused`、`ENOTFOUND` 等代碼） | TCP 連不上 API：斷網、VPN 擋掉 api.anthropic.com、公司 proxy 未設定 | 同一個 shell 先跑 `curl -I https://api.anthropic.com` 驗證；需要 proxy 就設 `HTTPS_PROXY` |
| `You've hit your session limit`（或 weekly／Opus／Sonnet limit） | 訂閱方案的滾動用量額度用完，session 與週限制跨模型共用 | 等訊息裡顯示的重置時間；若是 Opus／Sonnet 限額，`/model` 切到該家族外就能繼續；`/usage` 查剩餘額度 |
| `Not logged in · Please run /login` | 沒有登入或憑證失效 | 跑 `/login` 重新認證 |

順帶一提：Claude Code 對暫時性失敗會自動重試最多 10 次（指數退避），所以你看到上面任何一條錯誤時，能自動救回的它都已經試過了——看到錯誤就動手，不用先懷疑自己沒等夠久。

## 兩個實際案例

這套流程走過兩遍的真實記錄都在站上：

- [全域 skills 找不到](/posts/tech/2026-03-27-claude-code-global-skills-not-found)：新 session 載不到 global skills，正是「檔案沒被載入」這一支的典型案例。
- [spinner 動詞卡住](/posts/tech/2026-03-30-claude-code-spinner-verbs)：畫面停在 spinner 動詞不動，偏向執行期問題的排查路徑。

最後對齊一下這三篇的分工：裝不起來、登不進去，去[安裝與登入篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)；跑到一半掛掉、效能異常、回應中斷，去[執行期問題篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime)；「設定了但沒生效」就是這一篇。系列的地圖與底層機制，從[入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)開始。

## 參考資料

- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — `/context`、`/doctor`、`/hooks`、`/mcp` 的診斷用法、safe mode 與乾淨設定比對、常見設定地雷表的官方說明
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — 執行期錯誤訊息全文對照：每條錯誤的意思與復原步驟、自動重試行為與可調環境變數
- [Claude Code settings — Claude Code Docs](https://code.claude.com/docs/en/settings) — settings files、優先序、`~/.claude.json` 與 settings file 的分工
- [Connect Claude Code to tools via MCP — Claude Code Docs](https://code.claude.com/docs/en/mcp) — MCP transport、`.mcp.json`、approval / trust、server status、discovery cache 與常見設定警告

## 更新紀錄

- 2026-08-29：更新 `/skills`、`/permissions`、`/debug [issue]`、settings precedence、hook matcher、MCP approval/cache/status 與 error wording。
- 2026-08-26：初版，依官方 Debug your configuration 與 Error reference 文件撰寫。
