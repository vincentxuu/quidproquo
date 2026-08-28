---
title: "Claude Code 執行期問題怎麼解：CPU 記憶體、session hang、auto-compact thrashing、表格與搜尋失效"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, ripgrep]
lang: zh-TW
tldr: "執行期問題五類解法：記憶體偏高用 /compact 加 /heapdump 診斷；hang 了按 Ctrl+C 再 claude --resume 復原；大型表格改寫檔案不要硬看終端輸出；autocompact thrashing 用分段讀檔或 /compact 指定焦點脫離迴圈；搜尋失效裝系統 ripgrep 並設 USE_BUILTIN_RIPGREP=0。"
description: "Claude Code 執行期疑難排解指南：高 CPU 與記憶體用量的診斷流程、session 凍結的復原步驟、大型表格輸出的處理方式、auto-compaction thrashing 的成因與脫離方法，以及搜尋工具找不到檔案時的 ripgrep 修法。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 34
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en)

安裝成功、登入成功，接下來的問題都發生在 session 跑到一半：風扇狂轉、畫面凍住、context 壓縮失敗、搜尋明明有那個檔案卻找不到。這篇照官方 [troubleshooting](https://code.claude.com/docs/en/troubleshooting) 文件的分類，把五類執行期問題的症狀、診斷指令和修法整理成可照做的步驟。裝不起來或登不進去的，先看[上一篇：安裝與登入](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)；settings 不生效、hooks 不觸發這類設定問題，看[設定診斷專文](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config)。

## CPU／記憶體偏高

症狀：處理大型 codebase 時 Claude Code 吃掉大量資源、回應變慢。官方建議的順序：

1. **定期 `/compact`** 縮小 context。若回 `Not enough messages to compact.`，代表對話輪數太少無法摘要——就算 context 已被一次大貼上塞滿也會這樣。
2. **大任務之間關掉重開**。每個新 session 都是乾淨的 context window，別讓上一個任務的殘留拖著。
3. **把大型 build 目錄加進 `.gitignore`**，減少被掃描的範圍。
4. **用 `claude --safe-mode` 重啟**對照測試：它會停用所有自訂擴充（plugins、MCP servers、hooks）。資源用量掉了，就代表某個擴充是元兇，再去逐一找出是哪一個。

以上都做了記憶體還是高，用隱藏指令 `/heapdump`（選單裡不會出現，要完整輸入）。它會在 `~/Desktop` 寫兩個檔案：`<session-id>.heapsnapshot` JS heap snapshot 和 `<session-id>-diagnostics.json` 記憶體分析；Linux 沒有 Desktop 目錄時會寫到 home。指令也會在對話中印出摘要——resident set size、JS heap、array buffers、unaccounted native memory，以及偵測到的洩漏指標。兩條路：

- **回報**：開 [GitHub issue](https://github.com/anthropics/claude-code/issues)，只附 `-diagnostics.json`——它沒有對話內容和憑證。
- **自己查**：摘要說大部分在 JS heap 的話，把 `.heapsnapshot` 丟進 Chrome DevTools 的 Memory → Load，依 retained size 排序看誰佔著；如果摘要說大部分是 native memory，snapshot 看不到，回報時改附摘要裡的 leak indicators。

注意：`.heapsnapshot` 含 process 裡的**每一個字串**，包括完整對話和憑證，不要貼到公開 issue 或到處傳。

## Session hang

症狀：Claude Code 看起來沒反應，轉圈圈不動。復原步驟：

1. 按 `Ctrl+C` 試著取消目前的操作。
2. 還是沒反應，關掉終端機重開。

重開**不會**丟失對話——在同一個目錄跑：

```bash
claude --resume
```

從 session 清單挑回去繼續。所以 hang 的代價其實只有當前正在跑的那個操作，不是整段工作。

另一個相關症狀：編輯器整合終端機裡文字變亂碼或方塊（VS Code、Cursor 等），多半是 GPU renderer 的問題，session 內跑 `/terminal-setup` 把 `terminal.integrated.gpuAcceleration` 設成 `"off"` 即可。

## 大型表格卡住或被截斷

症狀：Claude Code 顯示超大 Markdown 表格時只印出前 200 列，後面接 `... N more rows not shown`；或舊版 session 裡有超大表格，resume 時卡在重新 render。這是終端機顯示層問題，不代表表格內容消失：完整表格仍在對話裡，`/copy` 會複製全部列。

實務上不要在終端機硬讀幾百列輸出。請 Claude 把表格寫成檔案，或先用更小的篩選條件重跑，讓終端機只顯示你需要檢查的列。官方文件註明 v2.1.208 之前的大表格 session 可能在 resume 時因重新 render 而停住；遇到這種舊 session，就用 `claude --resume` 選其他 session 或重開新 session，再把需要的資料改成檔案輸出。

## Auto-compaction thrashing

症狀：看到 `Autocompact is thrashing: the context refilled to the limit...`。機制是這樣：auto-compaction 成功壓縮了 context，但某個大檔案的內容或工具輸出**馬上又把它填滿**，連續好幾次。Claude Code 偵測到這種原地打轉後停止重試，避免把 API 額度燒在一個沒有進展的迴圈上。

脫離迴圈的官方順序，從影響最小排起：

1. **叫 Claude 分段讀那個過大的檔案**——指定行範圍或函式名稱，而不是「讀整個檔案」。
2. **`/compact` 帶焦點指示**，主動丟掉大輸出，例如 `/compact keep only the plan and the diff`。
3. **把大檔案工作交給 subagent**，讓它在獨立的 context window 裡跑，主對話只收結論。
4. 前面的對話不再需要就直接 `/clear`。

預防比復原簡單：知道要碰大檔案時，一開始就用行範圍讀，別等 thrashing 發生。

## 搜尋找不到該找到的東西

症狀：Search 工具、`@file` 提及、自訂 agents 或 skills 找不到明明存在的檔案。原因是內建的 ripgrep 二進位檔在你的系統上跑不起來。修法：裝系統版的 ripgrep，再告訴 Claude Code 改用它。

```bash
brew install ripgrep        # macOS
sudo apt install ripgrep    # Ubuntu/Debian
```

然後設 `USE_BUILTIN_RIPGREP=0`——放 shell 環境變數或 settings.json 都行：

```json
{
  "env": {
    "USE_BUILTIN_RIPGREP": "0"
  }
}
```

驗證生效：終端機跑 `claude doctor`，Search 那行應顯示你系統 ripgrep 的路徑而不是 `OK (bundled)`。

WSL 使用者注意另一種情況：專案放在 Windows 檔案系統（`/mnt/c/`）時跨檔案系統的磁碟讀取慢，搜尋能跑但結果比 native 少——`claude doctor` 在這情況下仍顯示 OK。解法按優先序：把專案移到 Linux 檔案系統（`/home/`）、縮小搜尋範圍（指定目錄或檔案類型），或直接改用 native Windows 版。

## 其他症狀：去對的地方

官方 troubleshooting 頁本身是個路由頁，症狀不在上面五類時照表找頁：

| 症狀 | 去處 |
|------|------|
| command not found、PATH、TLS 錯誤 | [安裝與登入篇](https://code.claude.com/docs/en/troubleshoot-install)＋本系列[上一篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install) |
| 更新或安裝下載中斷、login loop、OAuth、403、雲端 provider 憑證 | [安裝與登入篇](https://code.claude.com/docs/en/troubleshoot-install) |
| API Error 5xx、529 Overloaded、429 | 官方 [Error reference](https://code.claude.com/docs/en/errors) |
| model not found、request validation、Claude Code process exited with code N | 官方 [Error reference](https://code.claude.com/docs/en/errors) |
| settings 不生效、hooks 不觸發、MCP 載入失敗 | 官方 Debug your configuration 頁＋本系列[H8 設定診斷](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config) |
| session 一開始就在 auto mode，或沒詢問就編輯檔案／跑指令 | 官方 Permission modes 頁 |
| VS Code／JetBrains 整合問題 | 各自的整合文件頁 |

拿不準就先在 Claude Code session 內跑 `/doctor`（自動檢查安裝、設定、擴充與 context 用量，並提出可套用的修法）。如果 `claude` 根本啟不來，才在 shell 跑 `claude doctor` 做唯讀診斷。MCP 問題再補一個 `/mcp` 看 server 狀態。都解不掉，session 內用 `/feedback` 直接回報給 Anthropic。

系列其他篇：[系列入口：Claude Code 怎麼運作](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)、[.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)。

## 參考資料

- [Troubleshooting — Claude Code Docs](https://code.claude.com/docs/en/troubleshooting) — 本篇主來源：效能與穩定性章節、thrashing 復原步驟、ripgrep 修法，以及各症狀的路由表
- [Troubleshoot installation and login — Claude Code Docs](https://code.claude.com/docs/en/troubleshoot-install) — 安裝層問題的對應官方頁，路由表的另一端
- [Advanced setup — Claude Code Docs](https://code.claude.com/docs/en/setup) — ripgrep 相依性、Alpine 與 musl 系統的額外需求
- [Terminal configuration — Claude Code Docs](https://code.claude.com/docs/en/terminal-config) — `/terminal-setup` 會寫入的整合終端機設定

## 更新紀錄

- 2026-08-29：對齊官方 troubleshooting 最新 runtime 分類，補大型表格、`/heapdump` Linux 輸出位置、`/doctor` 與 `claude doctor` 分工。
- 2026-08-26：初版，依 2026-08 官方 troubleshooting 文件撰寫。
