---
title: "Claude Code 開發環境怎麼統一：devcontainer.json、CI 一致性與團隊 rollout"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, devcontainer, docker, team]
lang: zh-TW
tldr: "在 `.devcontainer/devcontainer.json` 加一行 Anthropic 官方 Dev Container Feature（`ghcr.io/anthropics/devcontainer-features/claude-code:1.0`），三步驟——寫設定、rebuild 容器、跑 `claude` 登入——就能讓團隊每個人的 Claude Code 跑在同一份容器定義裡；同一份定義也能餵給 GitHub Codespaces 和 CI，rollout 五步可落地。"
description: "用 devcontainer.json 把 Claude Code 關進一致的隔離環境：官方 Feature 安裝方式、認證與設定的持久化、managed settings 政策、CI 用同一份容器定義的一致性論述，以及團隊導入步驟。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 31
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-devcontainer-en)

這是「[Claude Code 深入介紹](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)」系列的一篇。上一篇講 Claude Code 怎麼運作，這篇講更實際的問題：**五個人用 Claude Code，五台機器的 Node 版本、套件快取、shell 設定都不一樣，AI 改壞了東西，誰也複製不了別人的結果。**

## 問題：不可複製的 AI 結果

Claude Code 是 agentic loop——它會真的在你的機器上跑指令、裝依賴、改檔案。這代表它的行為跟你的本機環境綁在一起：

- 你機器上是 Node 22，同事是 Node 18，同樣的 prompt 跑出不同的 build 錯誤。
- 「在我機器上會過」變成「在我的 Claude Code session 會過」，debug 時連環境差異都要一起排除。
- 新人報到第一天，光是讓環境能跑就要半天。

這不是 Claude Code 特有的問題，是所有本機開發工具共通的問題。只是 AI agent 動得更多、更快，環境漂移被放大的速度也更快。

## Dev container 解決的是哪一段

[Dev container](https://containers.dev/) 是一套開放規範：用 `devcontainer.json` 定義一個容器化的開發環境——基底映像、工具版本、延伸套件——支援這套規範的工具（例如 VS Code、GitHub Codespaces、JetBrains IDE、Cursor）就能把它跑起來。你的編輯器介面留在本機，終端機、語言伺服器、build 工具全部在容器裡。

Claude Code 裝在容器裡之後，它跑的每一道指令都執行在容器內，而不是你的主機上；它對專案檔案的修改則直接反映在你本機的 repository。依 [Claude Code 官方文件](https://code.claude.com/docs/en/devcontainer.md)的說法，這讓它看到的檔案、依賴和工具，跟專案其他 toolchain 完全相同。

增量在哪要先講清楚：容器化環境本身不是新東西。dev container 的增量是**把「環境定義」變成 repo 裡一份可版控、編輯器原生支援的設定檔**——不用再維護一份會過期的 setup 文件。

## 最小可用設定：三步裝好

官方提供了一個 [Dev Container Feature](https://github.com/anthropics/devcontainer-features/tree/main/src/claude-code)，把安裝縮到一個 JSON 區塊。在 repo 建 `.devcontainer/devcontainer.json`：

```json
{
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/anthropics/devcontainer-features/claude-code:1.0": {}
  }
}
```

然後三步：

1. **Rebuild 容器**——VS Code 按 `Cmd+Shift+P` 跑「Dev Containers: Rebuild Container」。
2. **在容器內的終端機跑 `claude`**，照提示登入。
3. 開始用。

幾個細節值得知道：

- 結尾的 `:1.0` 固定的是 Feature 的安裝腳本版本，不是 Claude Code 本身的版本。Feature 預設裝最新版，且容器內會自動更新。要鎖 CLI 版本做重現性 build，改在 Dockerfile 裡 `npm install -g @anthropic-ai/claude-code@X.Y.Z`，並設 `DISABLE_AUTOUPDATER=1`。
- 基底映像沒有 Node.js 時 Feature 會自己裝；如果 build 停在 `Failed to install Node.js and npm`，在上面先加 `"ghcr.io/devcontainers/features/node:1": {}` 再 rebuild。
- 要在編輯器裡開 dev server，就按 Dev Containers 規範加 `"forwardPorts": [3000]` 之類的埠轉發——這是規範本身的欄位，跟 Claude Code 無關。

## 讓設定和登入活過 rebuild

預設情況下容器 rebuild 會丟掉 home 目錄，每次都要重新登入。Claude Code 的認證 token 和使用者設定放在 `~/.claude`，但 OAuth 帳號和專案信任狀態存在另一個檔案 `~/.claude.json`——只掛載 `~/.claude` 一個 volume 是不夠的。

官方做法是掛一個 named volume，並把 `CLAUDE_CONFIG_DIR` 指到同一路徑，讓 `.claude.json` 也寫進 volume：

```json
"mounts": [
  "source=claude-code-config,target=/home/node/.claude,type=volume"
],
"containerEnv": {
  "CLAUDE_CONFIG_DIR": "/home/node/.claude"
}
```

同一個地方也是放組織政策的入口：透過 `containerEnv` 設 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` 和 `DISABLE_AUTOUPDATER=1`，或在 Dockerfile 裡把 `managed-settings.json` 複製到 `/etc/claude-code/`——它在設定層級中優先序最高，工程師蓋不掉。但文件也明講：Dockerfile 在 repo 裡，有寫入權的人就能改掉它，真正繞不過的政策要走 server-managed settings 或 MDM。

## CI 用同一份定義

這是團隊標準化最值錢的一段。devcontainer.json 是宣告式的容器定義，所以它可以出現在三個地方：

- 工程師的本機（VS Code / JetBrains），
- GitHub Codespaces（雲端跑同一份定義），
- CI pipeline（用 [Dev Containers CLI](https://github.com/devcontainers/cli) 或直接 build 同一個 Dockerfile）。

於是「Claude 在我機器上跑過測試會過」這句話有了可驗證的基礎：本機、雲端、CI 三邊可以從**同一份容器定義、同一組工具版本**開始。CI 若仍然失敗，環境漂移就不再是第一個嫌疑，接著再查程式碼、快取、祕密值、外部服務和時間差。反之若 CI 和 dev container 各自維護，你等於養了兩套各自漂移的環境，還誤以為自己有一致性。

## 團隊 rollout 五步（team rollout）

1. **挑一個人先把最小設定跑通**：`.devcontainer/devcontainer.json` 加 Feature、rebuild、登入，確認專案的工具鏈在容器內完整可用（該裝的原生依賴補進 Dockerfile）。
2. **把持久化和政策補上**：volume 掛載＋`CLAUDE_CONFIG_DIR`；需要鎖版本的話改 Dockerfile 安裝並停用自動更新。
3. **PR 進 repo，全團隊切換**：之後新人報到就是 clone、reopen in container、等 build，不再有 setup 文件對不上的一天。
4. **CI 對齊**：pipeline 改用同一份容器定義，讓三個執行環境收斂成一個。
5. **要更緊的控制再看參考容器**：[`anthropics/claude-code`](https://github.com/anthropics/claude-code/tree/main/.devcontainer) repo 附了結合 egress 防火牆、persistent volumes 的完整範例（`init-firewall.sh` 需 `NET_ADMIN`、`NET_RAW` 權限）；要無人值守跑 `--dangerously-skip-permissions`，前提是 `remoteUser` 必須非 root。

安全邊界也要說清楚：官方文件明講 dev container 不是免疫系統——容器內拿得到的東西（包括 `~/.claude` 裡的 Claude Code 憑證）在惡意專案面前仍可能外流，所以別掛載 `~/.ssh` 或雲端憑證進容器，用 repo 範圍或短時效 token。

## 跟 sandboxing 的分工

Dev container 解決的是「環境一致性」順便帶來隔離；若要的是**本機層級、不用 Docker 的輕量隔離**——限制 bash 指令的檔案系統寫入範圍和網路存取——那是 Claude Code 內建 sandbox 的工作，兩者解決的問題和強度不同，細節看[sandboxing 篇](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)。簡單分：要團隊標準化和跨機器重現，用 dev container；要單機降低 agent 誤傷半徑，用 sandbox；一起用不衝突。

## 學到的事

Dev container 的價值不在「容器化」本身，在於**把環境變成 repo 裡的一份版控檔案**：Claude Code 的行為可檢視、可重現，AI 說「測試過了」才有客觀意義。一行 Feature 設定是入口，CI 收斂才是真正的回報點。

## 參考資料

- [Development containers — Claude Code Docs](https://code.claude.com/docs/en/devcontainer.md) — Dev Container Feature 安裝、認證持久化、組織政策、網路出口限制與無權限提示模式的官方說明
- [Development containers](https://containers.dev/) — dev container 規範入口與 `devcontainer.json` 背景
- [Claude Code Dev Container Feature](https://github.com/anthropics/devcontainer-features/tree/main/src/claude-code) — Feature repo、Node.js requirement 與推薦設定
- [Dev Containers CLI](https://github.com/devcontainers/cli) — 用 `devcontainer.json` 建置、啟動與在 CI 執行 dev container 的 reference implementation
- [Claude Code reference devcontainer](https://github.com/anthropics/claude-code/tree/main/.devcontainer) — 官方參考容器中的 `devcontainer.json`、Dockerfile 與 `init-firewall.sh`

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方 devcontainer 文件撰寫。
- 2026-08-29：補強參考資料，收斂 CI 一致性的斷言強度。
