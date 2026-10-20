---
title: "AI Agent GitHub Digest — 2026-10-17"
date: 2026-10-17
category: daily
tags: [ai-agent, github, open-source, daily]
lang: zh-TW
description: "Claude Code 外掛目錄衝上 trending 第一，harness、方法論、求職框架全部掛在它上面跑；Agno v3.1.4 則讓 agent session 能跨機器恢復"
tldr: "claude-plugins-official（40,252★，今日 +1,552）是 Anthropic 官方維運的 Claude Code 外掛目錄，定下外掛名字不能亂改這類治理規則；superpowers（300,542★，+973）是裝進這個目錄的軟體開發方法論外掛；ruflo（75,533★，+672）把 Claude Code／Codex 包成多代理 swarm 的 meta-harness；ai-job-search（48,176★，+879）是一位被資遣的地球物理學家用 Claude Code 搭的求職框架，本人靠它拿到工作。Release：Agno v3.1.4 讓 ClaudeAgent／CodexAgent 能跑進 Docker 或 AWS AgentCore 的隔離 sandbox，session 用 checkpoint 做到跨機器恢復。"
series:
  name: "AI Agent GitHub Digest"
  order: 63
---

> 🌏 [English version](/posts/daily/2026-10-17-ai-agent-github-digest-en)

## 今日亮點

今天的 trending 幾乎全部繞著 Claude Code 這個 harness 本身：Anthropic 官方外掛目錄一天衝進 1,552 顆星，而 superpowers 把它變成一套方法論、ruflo 把它包成多代理 swarm、ai-job-search 直接拿它當求職全端工具用——Claude Code 正在從「一個 CLI」變成別人蓋房子的地基。

## Trending Repos

### anthropics/claude-plugins-official ⭐ 40,252 (+1,552)

[GitHub](https://github.com/anthropics/claude-plugins-official)　·　Python　·　Apache-2.0

- **是什麼**：Anthropic 官方維運的 Claude Code 外掛目錄，內部外掛（`/plugins`）跟第三方外掛（`/external_plugins`）分開放，裝法是 `/plugin install {name}@claude-plugins-official`。
- **為什麼值得看**：這個 repo 本身沒有新技術，但它定了外掛生態的治理規則——外掛名字一旦發佈就是不可變的 slug，要改名得寫進 `marketplace.json` 的 `renames` 表讓既有安裝自動遷移。換句話說，它把 Claude Code 外掛系統從「各自兜著用」變成有版本治理的供應鏈，今天 +1,552 顆星，也是 Anthropic 自家 repo 裡少見衝上 trending 第一的一次。
- **Tech stack**：純設定檔（`plugin.json` + `marketplace.json`）加審核流程，沒有執行期程式碼
- **上手難度**：低——`/plugin > Discover` 瀏覽或直接打 install 指令，門檻在審核通不通過，不在技術本身

---

### obra/superpowers ⭐ 300,542 (+973)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：一套包成外掛的「軟體開發方法論」，裝進 Claude Code、Codex、Cursor 等十幾種 harness 都能用——先逼 agent 問清楚你真正要做什麼、把 spec 拆成讀得完的段落，排好 YAGNI／DRY 的實作計畫，才讓 subagent 真的動手寫程式。
- **為什麼值得看**：它跟上面那個官方外掛目錄互相印證——superpowers 本身就是從 `claude-plugins-official` 安裝的其中一個外掛，代表「skill 驅動的開發流程」已經從個人習慣變成可以整包發佈、跨 harness 安裝的產品形態，不是只綁在 Claude Code 上。
- **Tech stack**：Shell 腳本 + 多份 `SKILL.md`，安裝路徑因宿主 harness 而不同（Claude Code 走官方市集，其他各走自己的外掛系統）
- **上手難度**：低——裝完不用額外設定，skill 依對話內容自動觸發

---

### ruvnet/ruflo ⭐ 75,533 (+672)

[GitHub](https://github.com/ruvnet/ruflo)　·　TypeScript　·　MIT

- **是什麼**：把 Claude Code／Codex 再包一層的「meta-harness」——作者的說法是「Agent = Model + Harness」，ruflo 自己就是那層 harness，負責管 100+ 個專職 agent、協調 swarm、本機向量記憶，還能讓不同機器上的 agent 透過 federation 互相傳訊息。
- **為什麼值得看**：這類「給 harness 再包一層 harness」的專案最近常上 trending，代表單一 agent、單一對話已經不夠用——開發者開始把「怎麼讓一堆 agent 協作」當成獨立的基礎設施問題來解，不是每個專案各自兜一套。
- **Tech stack**：TypeScript + npm 套件（`npx ruflo`）+ MCP server，也以 Claude Code 外掛形式提供
- **上手難度**：中——`npx ruflo init` 一行能跑最小版，但 swarm、federation、314 個 MCP tool 這些進階功能需要額外設定與讀文件

---

### MadsLorentzen/ai-job-search ⭐ 48,176 (+879)

[GitHub](https://github.com/MadsLorentzen/ai-job-search)　·　Python　·　MIT

- **是什麼**：把 Claude Code 當全端工作流程用的求職框架——`/scrape` 找職缺、`/apply` 評分並生成客製化履歷與求職信（LaTeX 排版）、`/interview` 幫忙準備面試；核心流程跟語言、國家無關，只有找職缺的 skill 是照丹麥本地市場寫的。
- **為什麼值得看**：作者是被資遣的地球物理學家，自己用這套流程投了 69 份客製化履歷、拿到 20 個第一輪面試、最終一份合約，今年六月開始做 AI 工程師。這是少見把 agent 工具鏈用在「找工作」這種高風險、強隱私情境，還公開交代真實結果的案例，而不是只展示 demo。
- **Tech stack**：Claude Code CLI + Python 3.10+ + Bun（職缺搜尋 CLI）+ LaTeX（`lualatex`／`xelatex` 排版履歷與求職信）
- **上手難度**：中——要先有 Claude Code 訂閱、裝 Bun、裝完整 LaTeX 發行版，職缺搜尋 skill 預設只接丹麥站點，換地區得自己改 skill

## Notable Releases

### Agno v3.1.4

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.4)

- **重要變更**：`ClaudeAgent`／`CodexAgent` 多了 `sandbox=` 參數，把整個 harness process 丟進跟 host 隔離的獨立電腦執行，session 狀態靠 Postgres 的 lease row 加 checkpoint 保存，就算容器、host 或 replica 掉線也能接著跑；提供 `DockerSandbox`（UID 1000、唯讀檔案系統、拿掉所有特權）與 `AgentCoreSandbox`（跑在 AWS Bedrock AgentCore 的 Firecracker microVM 上）兩種落地方式，並加了預設 300 秒的「warm sandbox」機制讓連續對話不用每次冷啟動（Docker 上從 8.2 秒降到 4.6 秒）。
- **Breaking Changes**：sandbox provider 的套件路徑搬到 `agno.sandbox.docker` 與 `agno.sandbox.agentcore`，原本 `DockerCheckpointTransfer` 的 import 路徑要跟著改；新增的 `require_native_resume`／`strict_persistence` 預設更嚴格，過去「session 救不回來就默默開新對話」的行為，現在會直接丟 `native_state_missing` 錯誤擋下來。
- **對你的影響**：目前在用 `ClaudeAgent`／`CodexAgent` 的專案如果有 import `agno.sandbox` 下的類別要改路徑；如果 session 恢復邏輯依賴過去「救不回就默默開新對話」的 fallback，升級後要先確認新的嚴格檢查不會把正常流程擋下來。

## 今日收穫

之前以為「sandbox」只是給 agent 一個隔離環境防止搞壞東西，今天看 Agno 的 warm sandbox 跟 checkpoint 恢復設計才發現，它真正要解的是「session 要能在任何一台機器上接著跑」這個更硬的問題——跟官方外掛目錄治理外掛名字不能亂改、ruflo 做跨機器 federation，其實是同一條路線：agent 基礎設施正在往「可恢復、可遷移」收斂，而不是每個專案各自解決自己的那一塊。

## 參考資料

- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [obra/superpowers](https://github.com/obra/superpowers)
- [ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search)
- [Agno v3.1.4 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.4)
- [GitHub Trending（2026-10-17）](https://github.com/trending?since=daily)
