---
title: "工具推薦｜agentscan — 掃你的 MCP 設定檔有沒有寫死金鑰、沒鎖版本、明文傳輸"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 MIT 授權的本機 CLI，掃描 Claude、Cursor、VS Code、Windsurf 的 MCP 設定檔，抓出寫死的金鑰、沒鎖版本的套件和走明文 http 的遠端伺服器；作者同日公布 84,813 份公開設定檔的普查結果"
tldr: "agentscan 是一個在本機執行的開源 CLI，掃 MCP 設定檔的三類風險：寫死的金鑰、沒鎖版本的套件、明文傳輸。安裝：pip install agentscan-si，執行 agentscan scan。作者拿它掃了 84,813 份公開設定檔，3.3% 的 repo 有看起來像真的金鑰。"
series:
  name: "AI Tool of the Day"
  order: 89
---

> :globe: [English version](/posts/daily/2026-11-25-tool-agentscan-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | agentscan（PyPI 套件名 `agentscan-si`，安裝後的指令是 `agentscan`） |
| 類型 | CLI（本機掃描，設定檔與結果不會送出） |
| GitHub | [SonawaneMayur/agentscan](https://github.com/SonawaneMayur/agentscan) |
| Stars | 1（2026-11-26 查核；repo 建立於 2026-10-17） |
| 語言 | Python（支援 3.10 以上；GitHub 的語言統計因為 repo 內有研究用 notebook 而標成 Jupyter Notebook） |
| 授權 | MIT |
| 安裝 | `pip install agentscan-si`（也可用 `uv tool install agentscan-si` 或 `pipx install agentscan-si`） |

## 解決什麼問題

你有沒有算過自己的編輯器裡掛了幾個 MCP server？每一個都是 `.mcp.json` 或 `mcp.json` 裡的幾行 JSON，卻同時決定三件事：什麼程式碼會在你的機器上跑、它拿到哪些金鑰、資料往哪裡送。這些檔案又常被直接 commit 進 repo，很少有人像看 `package.json` 那樣逐行審過。

agentscan 做的事很單純：讀你機器上的 MCP 設定檔，用三條規則掃一遍。MCP001（高風險）找直接寫在 `env`、`headers`、參數或 URL 裡的 API key、token、密碼；MCP002（中風險）找 `npx`／`uvx`／`pipx` 沒有指定確切版本的套件，也就是每次重啟 client 都會跑最新版；MCP003（高風險）找用 `http://` 或 `ws://` 連的遠端伺服器。它讀的設定檔涵蓋 Claude Desktop、Claude Code、Cursor、VS Code、Windsurf，掃描全部在本機完成。

這個工具值得今天寫，是因為作者在 11/24 同時發了一份用它跑出來的普查：2026 年 10 月，他把 GitHub 程式碼搜尋找得到的 MCP 設定檔全抓下來（84,813 份，分布在 72,243 個公開 repo），逐一掃描。結果是 36.9% 的 repo 至少有一項發現；2,356 個 repo（3.3%）公開了看起來像真的憑證，其中包含 370 把 OpenAI key、62 個 GitHub token、55 把 Google API key、24 把 Anthropic key 和 2 把 Stripe live key；npm 系的 MCP server 只有 6.8% 鎖了版本（38,111 個裡有 2,602 個）。適合的場景是：自己維護多份 MCP 設定、想在送 PR 前做一次檢查，或想在 CI 裡擋住有風險的設定。

## 快速上手

### 安裝

```bash
# 需要 Python 3.10 以上
pip install agentscan-si
agentscan --version
```

### 基本用法

```bash
agentscan scan                       # 掃目前目錄加上你的使用者層級 client 設定檔
agentscan scan path/to/project       # 只掃那個目錄裡的設定檔
agentscan scan ~/.cursor/mcp.json    # 掃單一檔案
agentscan scan --format json         # 機器可讀的輸出
agentscan rules                      # 列出規則
```

退出碼：`0` 代表沒有達到門檻的發現，`1` 代表有，`2` 代表路徑錯誤。預設門檻是 high，可用 `--fail-on` 調整。

### 進階用法

在 GitHub Actions 擋下新增了高風險設定的 PR（README 提供的範例）：

```yaml
# .github/workflows/agentscan.yml
name: agentscan
on: [pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv tool install agentscan-si
      - run: agentscan scan . --fail-on medium
```

掃到之後的修法，作者在文章裡給了前後對照：金鑰改成引用環境變數、套件加上版本、遠端伺服器改用 `https://`。

```json
// 金鑰：改成引用環境變數（語法依 client 而異，例如 Claude Code 的 .mcp.json 用 ${VAR}）
"env": { "SERVICE_API_TOKEN": "${SERVICE_API_TOKEN}" }

// npm 套件：鎖版本
"args": ["-y", "@scope/some-mcp-server@1.4.2"]
```

如果某把金鑰曾經 commit 過，只是從檔案裡刪掉不夠，要旋轉（重發）那把金鑰，因為它還留在 git 歷史裡。

## 與現有工具的比較

| | agentscan | 人工逐行審設定檔 | GitHub secret scanning |
|---|---|---|---|
| 讀得懂 MCP 設定檔的結構（env、args、headers） | ✓ | ✓（靠人） | 否，看的是已知金鑰格式 |
| 抓沒鎖版本的套件 | ✓（MCP002） | 容易漏 | 不在它的職責內 |
| 抓明文 http／ws 傳輸 | ✓（MCP003） | 容易漏 | 不在它的職責內 |
| 可放進 CI 自動擋 PR | ✓（`--fail-on`） | ✗ | 屬於平台功能，行為依帳號設定 |
| 已知金鑰格式通知發行方 | ✗ | ✗ | ✓（作者文中提到這是 partner program 的做法） |

這張表的重點是分工：GitHub 的機制偏向事後、針對已知格式的金鑰；agentscan 是在 commit 前自己先掃，而且多看了套件鎖版與傳輸協定。兩者不互相取代。

## 注意事項

- **專案非常早期**：repo 在 10/17 才建立，查核時只有 1 顆星，單人維護；README 的路線圖還列著 SARIF 輸出、tool description 鎖定（偵測 rug pull）、連線 MCP server 檢查 prompt injection 等，這些目前都還沒有。現在的規則只有上面三條。
- **只看設定檔，不看 server 本身**：它抓不到惡意的 MCP server、被污染的 tool description，也抓不到不是寫在這幾種 client 設定檔裡的金鑰。README 的設定檔路徑表中，Claude Desktop 只列出 macOS 的位置。
- **普查數字要打折看**：這是作者用自己的工具、自己的判斷標準跑出來的結果，沒有第三方重現。「看起來像真的」是靠佔位詞、長度與亂度（Shannon entropy）推估，作者自己也寫了可能有誤判，金鑰也可能在 commit 之後已經被撤銷；統計範圍只有 GitHub 程式碼搜尋找得到的公開預設分支，不代表你我私下的設定。作者也強調「一項發現是風險，不是已經被入侵」，沒鎖版本只有在該套件真的被劫持時才危險。
- **掃到不等於修完**：工具只負責指出位置，旋轉金鑰、決定要鎖哪個版本仍然要自己做。

## 今日收穫

我之前把 MCP 設定檔當成「設定」，其實它同時是供應鏈（跑誰的程式碼）、憑證庫（給它什麼金鑰）和資料出口（往哪送）。普查裡最值得記的一個細節是：最熱門的 server 反而最少鎖版本，`@playwright/mcp` 在 5,420 個 repo 裡出現，只有 10% 鎖了版，因為各專案自己的安裝說明就是教你貼不鎖版本的寫法。風險的預設路徑，就是大家最容易照抄的那條。

## 參考資料

- [SonawaneMayur/agentscan — GitHub（README、規則、授權）](https://github.com/SonawaneMayur/agentscan)
- [I scanned 72,000 public AI agent configs. Here's what's exposed, and how to fix yours. — DEV Community（作者的普查報告，2026-11-24）](https://dev.to/sonawanemayur/i-scanned-72000-public-ai-agent-configs-heres-whats-exposed-and-how-to-fix-yours-5g3i)
- [agentscan-si — PyPI（套件頁）](https://pypi.org/project/agentscan-si/)
- [GitHub REST API：SonawaneMayur/agentscan 的 repo metadata（Stars、建立日期）](https://api.github.com/repos/SonawaneMayur/agentscan)
