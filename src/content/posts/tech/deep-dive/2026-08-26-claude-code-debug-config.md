---
title: "Claude Code 設定了卻沒生效怎麼診斷：/context、/doctor、/mcp 與常見錯誤對照"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, debugging, dx, settings]
lang: zh-TW
tldr: "CLAUDE.md 寫了沒被遵守、hook 不觸發、MCP server 沒出現，多半是檔案沒載入、載錯位置或被另一層設定覆蓋。本文整理 /context、/memory、/doctor、/mcp 四個診斷指令各看什麼、safe mode 二分法，以及六條高頻錯誤訊息的對照表。"
description: "Claude Code 設定診斷指南：用 /context、/memory、/doctor、/mcp 檢查什麼真的被載入，理解 managed/local/project/user 四層設定優先序，用 --safe-mode 二分法定位問題，並對照常見執行期錯誤訊息的修法。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 35
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en)

「我在 CLAUDE.md 寫了規則，它就是不遵守」「hook 定義好了，完全沒反應」「MCP server 加了，工具列表是空的」——這類「設定了但沒生效」的問題，是 Claude Code 使用者回報最多的其中一類。官方診斷文件把原因歸納成三種：**檔案根本沒載入、載入的位置跟你預期不同、或被另一份檔案覆蓋**。這篇講的就是怎麼分辨這三種情況：先靠四個診斷指令看「實際載入了什麼」，再用 safe mode 二分法縮小範圍，最後附一張高頻錯誤訊息對照表。安裝與登入問題不在此篇範圍，請看[系列的安裝疑難排解篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)。

## 診斷四件套：各看什麼

核心原則只有一句話：不要猜，直接看 Claude Code 實際載入了什麼。第一步永遠是 `/context`——它列出目前 session 的 context window 全部分佈：system prompt、內建工具、MCP 工具、subagents（含各自的載入來源）、記憶檔、skills、對話訊息。如果你的 CLAUDE.md 或 skill 根本沒出現在清單裡，問題就是「沒載入」，不用再往下猜行為。確認有載入之後，再按類別深入：

| 指令 | 看什麼 |
|------|--------|
| `/context` | context window 全貌：各類內容佔用與載入來源，判斷某個檔案有沒有進來 |
| `/memory` | 使用者與專案兩個層級的記憶檔位置，可直接在編輯器開啟，含 auto memory 開關 |
| `/doctor` | 健檢：安裝健康狀態、無效的 settings 檔、同一目錄重複的 subagent 名稱、未使用的擴充，並附修正建議 |
| `/mcp` | 每個 MCP server 的連線狀態，以及你是否已在這個專案核准它 |

另外兩個常用輔助：`/hooks` 列出目前 session 生效的所有 hook（照事件分組）；`/status` 顯示目前有哪些設定來源在作用，包括 managed settings 是否存在。終端機也能跑 `claude doctor`，唯讀印出安裝與設定診斷、不啟動 session，適合放進腳本。

## 你的設定被誰覆蓋了

settings 是多層合併的：managed（組織派發）→ local（`settings.local.json`）→ project（`.claude/settings.json`）→ user（`~/.claude/settings.json`），越近的層級蓋掉越廣的；命令列旗標和環境變數是再往上的另一層覆蓋。所以「明明設了卻沒效」最常見的答案不是 bug，而是同一個 key 在更近的層級也被設了。

幾條高頻地雷：

- **`~/.claude.json` 不是設定檔**。它放的是 app 狀態與 UI 開關；`permissions`、`hooks`、`env` 要寫在 `~/.claude/settings.json`。兩個檔案長得很像但是不同的東西。
- **MCP server 設定不放在 settings.json**。專案層級寫在 repo 根目錄的 `.mcp.json`（key 是 `mcpServers`，不是 VS Code 慣用的 `servers`），使用者層級用 `claude mcp add --scope user`。
- **專案 `.mcp.json` 需要一次性的核准**。第一次彈出核可提示時按掉，server 就會一直保持停用——到 `/mcp` 裡重新核准即可。
- hook 的 `matcher` 是單一字串，要比對多個工具用 `|` 分隔（如 `"Edit|Write"`）；v2.1.191 之前逗號分隔會靜默比不到。工具名稱大小寫敏感，`bash` 配不到 `Bash`。而 matcher 誤寫成 array 屬於 schema 錯誤，Claude Code 會整份退回那份設定檔——症狀是該檔所有 hook 一起消失，`/doctor` 會報出來。

## Safe mode：二分法找兇手

四件套都查過還是不確定是哪一層的問題時，用 `claude --safe-mode` 開一個「全部客製化都關掉」的 session：CLAUDE.md、skills、plugins、hooks、MCP servers、自訂指令與 agents 全部停用，認證、模型選擇、內建工具與權限照常運作。

結果是二分的：

- **safe mode 下問題消失** → 兇手在你某一項客製化裡，回到上面的針對性檢查逐項找出是哪一個。
- **safe mode 下問題還在** → 把範圍再縮到乾淨環境：`cd /tmp && CLAUDE_CONFIG_DIR=/tmp/claude-clean claude`，繞過整個 `~/.claude`，也不載入任何專案設定。問題在這個乾淨 session 消失，就逐一把你原本的檔案加回去定位；還在，那原因在你的使用者與專案設定之外——先跑 `/status` 看 managed settings 是否在作用，再查影響 Claude Code 的環境變數。

注意組織派的 managed hooks 與設定政策在 safe mode 仍然生效；那是唯一帶進來的東西。

## 常見錯誤訊息對照

設定之外，另一大類卡關是執行期錯誤。官方有一頁完整的 error reference，底下挑六條最高頻的整理成表（完整清單以官方頁為準）：

| 訊息 | 原因 | 修法 |
|------|------|------|
| `API Error: 500 Internal server error` | API 端的預期外錯誤，與你的 prompt、設定、帳號無關 | 等一分鐘再送（原訊息還在對話裡，打 `try again` 即可）；持續發生查 status.claude.com |
| `API Error: Repeated 529 Overloaded errors` | API 整體容量暫時滿載，Claude Code 已自動重試多次才報出來 | 過幾分鐘再試；急著做事可用 `/model` 切到別的模型，容量是按模型計的 |
| `Prompt is too long`（互動介面顯示 `Context limit reached · /compact or /clear to continue`） | 對話加上附加檔案超過模型的 context window | `/compact` 摘要騰空間或 `/clear` 重開；用 `/context` 看什麼吃掉窗口，`/mcp disable <name>` 停用不必要的 MCP server |
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

## 更新紀錄

- 2026-08-26：初版，依官方 Debug your configuration 與 Error reference 文件撰寫。
