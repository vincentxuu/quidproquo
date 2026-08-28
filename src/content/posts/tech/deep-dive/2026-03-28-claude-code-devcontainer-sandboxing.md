---
title: "Claude Code 沙箱怎麼運作：sandboxed Bash、網路 allowlist 與六種隔離環境的威脅模型"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, sandboxing, ai-agent]
lang: zh-TW
tldr: "Claude Code 內建的 sandboxed Bash 用 OS 層機制限制每條指令：寫入限工作目錄與 session temp，讀取預設整機可讀；網路走 proxy allowlist，預設零網域。開關在 /sandbox 面板和 sandbox.enabled，不是 --sandbox 旗標。本文再比較 sandbox runtime、devcontainer、Docker、VM 與 Claude Code on the web 這幾種更重的隔離方案該什麼時候用。"
description: "拆解 Claude Code sandboxed Bash tool 的檔案系統與網路隔離機制、/sandbox 面板與 sandbox.network.allowedDomains 設定，以及官方六種沙箱環境的威脅模型比較。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 30
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en)

這是「[Claude Code 深入介紹](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)」系列的安全專篇。上一篇講 [permissions 與 auto mode](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode)，解決的是「哪些動作要問你」；這篇解決的是另一個問題：**動作已經在跑了，它碰得到什麼**。

## 為什麼放手之前先圍籬

Permission 系統的本質是「事前審查」——每個工具呼叫執行前擋下來問你。但當你切到 auto mode 或 accept edits，越來越多動作不再經過你：分類器代替你判斷風險，或者常見操作直接放行。審查變少之後，萬一某條指令有問題，能限制傷害範圍的就只剩執行環境本身。

這就是沙箱的定位。Claude Code 內建的 sandboxed Bash tool 用作業系統層級的安全原語（macOS 是 Seatbelt，Linux 與 WSL2 是 bubblewrap），對**每一條 Bash 指令和它的所有子行程**強制同一套邊界。注意範圍：它只管 Bash——Read、Edit 這類內建工具走 permission rules，MCP servers 和 hooks 則是不受約束的獨立行程。

## Sandboxed Bash：檔案系統與網路兩層邊界

沙箱有兩個互相獨立的層：檔案系統隔離決定指令能讀寫哪些路徑，網路隔離決定連得到哪些主機。官方文件特別警告過，兩層要同時開才有效——只鎖檔案系統不鎖網路，被入侵的 agent 能把 SSH 金鑰送出去；反過來則可能被後門化取得網路。

### 檔案系統：寫得窄，讀得寬

預設行為是明顯不對稱的：

- **寫入**：只有目前工作目錄（含子目錄）加上 session 臨時目錄。`$TMPDIR` 會被重新指向 session temp，所以工具寫暫存檔不用額外設定。
- **讀取**：預設整台機器可讀，只有少數目錄被拒。也就是說 `~/.aws/credentials` 和 `~/.ssh/` 預設**讀得到**——要用 `sandbox.credentials` 封鎖這些檔案並清掉祕密環境變數，或自己加 `denyRead`。
- **保護路徑**：即使在可寫範圍內，`.claude` 設定檔、shell 啟動檔（`.zshrc`）、`.gitconfig` 這類 Claude Code 自己會載入的檔案也禁止寫入——否則指令可以幫自己加權限、掛 hook，下一輪就在沙箱外跑起來了。

需要放寬就用 `sandbox.filesystem.allowWrite` 加路徑（例如 `kubectl` 要寫 `~/.kube`），OS 層強制，子行程照樣受約束。想收緊就用 `denyRead`／`denyWrite`，允許規則疊在拒絕區域上也翻不了案：`denyRead: ["~/.env"]` 在任何更寬的 allow 底下都成立。

### 網路：預設一個網域都不放行

網路流量全部經過一道跑在沙箱外的 proxy。關鍵預設值：**Claude Code 不預先放行任何網域**。第一條需要新網域的指令會跳出來問你，auto mode 則交給分類器；答「永遠允許」就存成 `WebFetch(domain:...)` 規則留到以後的 session。

不想被問就自己列 `sandbox.network.allowedDomains`，支援 `*.example.com` 這種萬用字元。企業場景還有兩個升級：`strictAllowlist` 把「清單外一律問」改成「清單外一律拒」，`allowManagedDomainsOnly` 讓 managed settings 的清單成為唯一有效版本，開發者加不了私貨。

限制也要知道：proxy 預設不終止 TLS、不看流量內容，放行決策只根據客戶端自報的主機名——官方文件明言這存在 domain fronting 繞過的可能，威脅模型要求更強保證就得自架做 TLS 檢查的 proxy。

## 開關在哪裡：沒有 --sandbox 旗標

一個常見誤會先澄清：**`--sandbox`／`--no-sandbox` CLI 旗標不存在**。控制入口是這些：

- **`/sandbox` 面板**：session 內執行，有三個 tab——Mode 選沙箱內指令自動核可還是照走一般權限流程、Overrides 選失敗指令能不能退回沙箱外重試、Config 看最終生效的設定。
- **settings.json**：`sandbox.enabled: true` 開啟（放 user settings 就是所有專案生效）；`autoAllowBashIfSandboxed` 控制沙箱內指令要不要自動批准；`failIfUnavailable: true` 讓「沙箱起不來就裸跑」的降級行為變成直接失敗，適合當安全閘門的部署。

另外有個逃生口：指令因為沙箱限制而失敗時，Claude 可以帶 `dangerouslyDisableSandbox` 參數在沙箱外重試——但重試會回到一般權限流程，Manual mode 照樣問你。把 `allowUnsandboxedCommands` 設成 `false` 可以完全關掉這條路。

## 六種環境，六種威脅模型

內建沙箱只是選項之一。官方的比較表把隔離光譜攤開來：

| 方案 | 隔離對象 | 需要 Docker | 設定成本 |
|------|----------|-------------|----------|
| [Sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing.md) | 只有 Bash 指令與其子行程 | 否 | macOS 幾乎零；Linux 低 |
| [Sandbox runtime](https://code.claude.com/docs/en/sandbox-environments.md)（`@anthropic-ai/sandbox-runtime`） | 整個 Claude Code 行程，含檔案工具、MCP、hooks | 否 | 低 |
| Dev container | 完整開發環境 | 是 | 中 |
| 自訂容器 | 完整開發環境 | 是 | 中到高 |
| 虛擬機 | 整套作業系統 | 否 | 高 |
| Claude Code on the web | Anthropic 託管的完整作業系統 | 否 | 無本機設定成本；需要 Claude 訂閱，從網頁啟動時還需要 GitHub |

分水嶺在前兩列與後四列之間：前兩者跑在 host OS 上，差別只在邊界圈住的是 Bash 還是整個 Claude Code 行程；後四者把 Claude Code 整個人搬進容器、VM 或 Anthropic 託管環境，檔案工具、MCP servers、hooks 全部一起進邊界。（devcontainer 的團隊標準化用法——官方範例容器、防火牆設定——另開一篇講：[Claude Code DevContainer 完全指南](/posts/tech/deep-dive/2026-08-26-claude-code-devcontainer)。）

Claude Code on the web 是不用自己架的極端選項：每個 session 跑在 Anthropic 託管的 VM 裡，GitHub token 由獨立 proxy 保管在沙箱外；若從 CLI 用 `--cloud` 啟動且沒有 GitHub 連線，Claude Code 也可以改打包上傳本機 repository，但這種 session 不能自己 push 回 remote。

## 怎麼選

官方給的對照很實用，按你的目標查表：

- **日常在自己的機器上減少權限彈窗**→ sandboxed Bash tool，`/sandbox` 配好就行。
- **無人值守跑 `--dangerously-skip-permissions`**→ devcontainer、任一容器或 VM、或 sandbox runtime。文件講得很硬：跳過權限的 session 必須跑在容器、VM 或 sandbox runtime 裡，讓檔案工具和 hooks 也在邊界內。
- **auto mode 的長時間背景工作**→ 不像 `--dangerously-skip-permissions` 一樣被官方寫成硬性要求，但仍建議加一層隔離；至少別只靠 sandboxed Bash，因為它管不到檔案工具、MCP servers 和 hooks。
- **不信任的 repository**→ 專用 VM，或有訂閱就用 Claude Code on the web；若從網頁介面啟動，還需要 GitHub 連線。
- **團隊統一沙箱環境**→ 把官方 devcontainer 範例複製進 repo。
- **原生 Windows**→ Bash 沙箱不支援，走 WSL2 或容器。

## 與 permission modes 和 checkpoints 的分工

三個機制各管一段，不要指望任何一個包辦一切：

- **Permission modes**（[詳見 B2](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode)）：決定動作能不能跑、要不要先問你——事前審查。
- **沙箱**：決定跑起來的動作摸得到什麼——事中圍籬。Auto mode 的分類器是逐動作的控制，不是隔離邊界，無人值守時仍值得再加一層防禦縱深。
- **Checkpoints**（[詳見 A4](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)）：事後復原檔案編輯。但它追蹤不到 bash 指令造成的副作用——而沙箱正是把那些副作用的爆炸半徑事先縮小的那一層。

官方文件的總結值得記住：沙箱降低的是出事的衝擊，不是消除風險。只要政策允許網路出口，agent 讀得到的資料就有外洩路徑；只要專案目錄掛載為可寫，程式碼就改得動。把它當深度防禦的一環，而不是單點解。

## 參考資料

- [Configure the sandboxed Bash tool — Claude Code Docs](https://code.claude.com/docs/en/sandboxing.md) — sandboxed Bash tool 的檔案系統與網路隔離、`/sandbox` 面板、`allowedDomains`、protected paths 與安全限制的官方說明
- [Choose a sandbox environment — Claude Code Docs](https://code.claude.com/docs/en/sandbox-environments.md) — sandboxed Bash／sandbox runtime／dev container／custom container／VM／on the web 六種方案的官方威脅模型比較與選擇指引
- [Development containers — Claude Code Docs](https://code.claude.com/docs/en/devcontainer) — Claude Code dev container 的安裝、持久化設定、network egress 限制與 `--dangerously-skip-permissions` 注意事項
- [Use Claude Code on the web — Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web) — cloud session、GitHub authentication、`--cloud` 打包上傳與安全隔離的官方說明

## 更新紀錄

- 2026-08-29：依官方 sandbox environments 現況，把「五種環境」修為六種並補上 Claude Code on the web；拆開 `--dangerously-skip-permissions` 與 auto mode 的隔離強度。
- 2026-08-26：由合集骨架《DevContainer & Sandboxing》拆分改題，本篇聚焦 sandboxing 專題；devcontainer 內容歸另篇。參考資料依新官方網域重列。
