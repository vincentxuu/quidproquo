---
title: "資安警報｜AI 記憶框架 MemOS 遭供應鏈攻擊，npm／PyPI 套件植入會讀 prompt 的憑證竊取器"
date: 2026-09-25
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "MemTensor 維護的 AI agent 記憶框架 MemOS，其 npm 的 OpenClaw 外掛與 PyPI 套件被攻擊者植入惡意版本，會在 agent 啟動與每次記憶回想（memory recall）時偷跑一支會回傳使用者 prompt 的 Go 憑證竊取器 sckit"
tldr: "攻擊者拿到 MemTensor 的 GitHub Actions 發布權杖後，在 npm 的 @memtensor/memos-cloud-openclaw-plugin（0.1.21／0.1.23／0.1.25）與 PyPI 的 MemoryOS（2.0.34）夾帶了 Go 寫成的 sckit 憑證竊取器：npm 版本在 OpenClaw agent gateway 啟動與每次記憶回想時偷跑，並把當次使用者 prompt 一併傳給惡意執行檔；PyPI 版本則是只要 import memos 就會透過被動手腳的 logging 初始化自動觸發。sckit 會搜刮 npm／PyPI／GitHub／GitLab／AWS／Vault／SSH 等憑證並回傳 skyleen[.]fr 的 C2，且內建可自我散布進其他套件與 GitHub Actions 的能力。Socket、StepSecurity、SafeDep、Aikido 四家資安公司交叉證實。防禦：立即釘住乾淨版本、輪換所有相關憑證、擋 C2 網域。"
series:
  name: "AI Security Alert"
  order: 37
---

> 🌏 [English version](/en/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain-en)


## 事件概述

MemTensor 維護的開源 AI agent 記憶框架 MemOS，在 2026 年 9 月 23 日遭供應鏈攻擊：攻擊者拿到專案自己的 GitHub Actions 發布權杖後，直接對 npm 套件 `@memtensor/memos-cloud-openclaw-plugin`（OpenClaw agent 的記憶存取外掛）與 PyPI 套件 `MemoryOS` 發布了夾帶惡意程式碼的版本。兩者都內嵌了一支名為 `sckit` 的跨平台 Go 憑證竊取器，會在套件被載入的當下自動背景執行——npm 版本甚至會把當次的使用者 prompt 內容一併傳給這支執行檔。Socket、StepSecurity、SafeDep、Aikido 四家獨立資安公司各自分析並交叉證實了同一起事件，惡意版本目前已從兩個套件庫下架，但下架前 npm 上已被標記為 `latest` 供預設安裝。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI Agent 供應鏈攻擊（CI/CD 發布權杖竊取 + 惡意套件植入） |
| 影響範圍 | npm `@memtensor/memos-cloud-openclaw-plugin` 0.1.21／0.1.23／0.1.25；PyPI `MemoryOS` 2.0.34；任何載入過這些版本的 OpenClaw／Clawdbot／Moltbot agent 環境、開發機、CI runner |
| 嚴重程度 | High（憑證竊取 + 使用者 prompt 外洩 + 具備自我散布能力） |
| CVE | 無（供應鏈套件植入，非傳統軟體漏洞，尚無 CVE 編號） |
| 來源 | [The Hacker News](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html)、[Socket](https://socket.dev/blog/memtensor-compromise)、[StepSecurity](https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes)、[SafeDep](https://safedep.io/memtensor-sckit-worm-npm-pypi/) |

## 攻擊面分析

攻擊者的切入點不是套件本身的程式碼漏洞，而是 MemTensor 專案自己的發布流程：SafeDep 的分析指出，攻擊者透過對 MemTensor 的 GitHub repository 推送特定 commit，讓專案的 GitHub Actions release workflow「交出」了 npm 與 PyPI 的發布權杖。拿到權杖後，攻擊者在 2026-09-23 凌晨的兩小時內連續發布了三個惡意 npm 版本（0.1.21、0.1.23、0.1.25），中間穿插兩個看起來乾淨、只是改了版號的「誘餌版本」（0.1.22、0.1.24），最後把惡意的 0.1.25 標記為 `latest`；PyPI 端則是單一惡意版本 2.0.34 直接上架，體積從正常的 951 KB 暴增到 19 MB——多出來的部分正是六支跨平台（Linux／macOS／Windows，x64／arm64）的 `sckit` 執行檔。

觸發機制針對的正是 AI agent 的執行路徑，而非單純的安裝腳本：npm 外掛在 OpenClaw agent gateway 啟動時執行一次 `sckit`，並在**每一次記憶回想（memory recall）事件**時再執行一次，這次會把當下的使用者 prompt 文字透過環境變數 `SCKIT_EVENT_TEXT` 一併交給惡意執行檔；PyPI 套件則更隱蔽，攻擊者動手腳的對象是 `memos/log.py` 裡的 `configure_logging()`，而套件內有 149 個模組在被 import 時就會呼叫這個函式，等於單純 `import memos` 就足以觸發，完全不需要呼叫任何 API。sckit 本身會掃描 `$HOME` 底下的憑證檔案（`.npmrc`、`.vault-token`、`id_ecdsa`、`credentials.db` 等）與看起來像 token／API key 的環境變數，回傳到 `skyleen[.]fr` 底下的 C2 伺服器，且內建可將自身重新打包進其他 npm／Python 套件與 GitHub Actions workflow 的能力，具備蠕蟲式自我散布的潛力。對照 OWASP LLM Top 10，這起事件同時踩中 **LLM05 Supply Chain Vulnerabilities**（發布管線本身被攻破，而非套件程式碼被審查漏掉）與 **LLM06 Excessive Agency**（記憶回想這個 agent 內部事件，被拿來當作外洩使用者輸入的觸發點，遠超過一個「記憶外掛」該有的存取範圍）。

## 防禦做法

這起事件的關鍵教訓是：AI agent 生態的供應鏈攻擊面已經延伸到「發布管線」這一層——即使套件的原始碼審查再嚴謹，只要 CI/CD 的發布權杖能被騙走，攻擊者就能繞過所有審查直接把惡意版本推上 `latest`。而 agent 記憶／工具外掛因為天生就掛在處理使用者輸入的路徑上，一旦被植入惡意程式碼，外洩的不只是憑證，還有使用者對話內容本身。

**立即動作**
- 盤點所有專案的 lockfile（`package-lock.json`、`requirements.txt`、`poetry.lock`、`uv.lock`）與 SBOM，搜尋是否引用了 `@memtensor/memos-cloud-openclaw-plugin`（0.1.21／0.1.23／0.1.25）或 `MemoryOS`（2.0.34）
- 若曾安裝上述版本：視同該主機（含只跑過測試的開發機、CI runner、容器）已被入侵——立即終止任何執行中的 `sckit` process，刪除套件目錄與 `~/.openclaw/.cache/runtime/`、`~/.memos/.cache/runtime/`
- 輪換該主機環境可觸及的所有憑證：npm／PyPI token、GitHub／GitLab token、AWS 金鑰、Vault token、SSH key、Hugging Face／Slack／Stripe／SendGrid key，以及 `.env` 中的任何機密
- 在 DNS／proxy／egress log 中搜尋自 2026-09-23 起對 `skyleen[.]fr` 及其子網域的連線紀錄並全面封鎖
- 若曾在受影響主機上使用 npm／PyPI 發布權杖，回頭檢查自己維護套件的近期版本是否有非本人發布的紀錄

**長期架構**
- 把 CI/CD 發布權杖本身視為高價值資產：改用 npm／PyPI 的短效期 OIDC trusted publishing 取代長效 token，減少「權杖被騙走就能無限次發布」的暴露面
- 對會處理使用者輸入的 agent 記憶／工具外掛，把「這個外掛能不能存取 prompt 內容」當成安裝前必須明確評估的權限項目，而不是預設信任
- 評估導入 watchlist B7 中 Protect AI 這類專門掃描 ML／AI 套件供應鏈的工具，或用 Netzilo 的 agent runtime governance 對可安裝的 agent 外掛做 allowlist 管控，避免任何未經審核的記憶／工具外掛被自動載入

## 影響範圍

Socket 的分析明確指出，只要主機曾經**載入或 import** 過惡意版本就應視為已入侵，不需要實際觸發任何攻擊行為——這代表暴露範圍不只是「主動使用 MemOS 記憶功能」的正式環境，還包含只是把套件裝進 CI 跑測試、或開發機上單純 `npm install` 過的情境。惡意版本目前已從 npm 與 PyPI 下架，但攻擊者取得 GitHub Actions 發布權杖的完整經過（如何從程式碼審查角度察覺不出來）仍待 Socket 後續分析補完；截至目前沒有公開來源指出 MemTensor 以外的其他套件受到同一次入侵波及。

如果你的 agent 系統有整合 MemOS、OpenClaw、Clawdbot 或 Moltbot，或任何會在 agent 記憶回想事件中處理使用者 prompt 的第三方外掛，這起事件值得回頭檢查：外掛的更新是否有版本釘選、CI 環境是否會無條件抓 `latest`、以及一旦外掛遭植入惡意程式碼，你的架構有沒有辦法在憑證外洩之外，進一步侷限「使用者 prompt 本身被外流」的曝險範圍。

## 今日收穫

這起事件把「供應鏈攻擊」和「AI agent 特有風險」兩件事焊在了一起：攻擊者不是隨便找一個熱門套件下手，而是精準挑中一個掛在 agent 記憶回想路徑上的外掛，讓惡意程式碼可以名正言順地拿到使用者的 prompt 內容當作「順便」的戰利品。這提醒我們評估 agent 相關依賴套件時，不能只問「這個套件有沒有已知漏洞」，還要問「這個套件在 agent 的執行路徑上摸得到什麼」——一旦答案是使用者輸入本身，供應鏈攻擊的代價就不只是憑證外洩這麼簡單。

## 參考資料

- [The Hacker News: Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html)
- [Socket: MemTensor npm and PyPI Packages Compromised in Credential-Stealing Supply Chain Attack](https://socket.dev/blog/memtensor-compromise)
- [StepSecurity: Sckit Supply Chain Worm Hits MemTensor npm & PyPI scopes](https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes)
- [SafeDep: MemTensor sckit worm on npm and PyPI](https://safedep.io/memtensor-sckit-worm-npm-pypi/)
