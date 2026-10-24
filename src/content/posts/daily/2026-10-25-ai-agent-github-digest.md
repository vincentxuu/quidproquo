---
title: "AI Agent GitHub Digest — 2026-10-25"
date: 2026-10-25
category: daily
tags: [ai-agent, github, open-source, daily, agent-sandbox, mcp, version-control]
lang: zh-TW
description: "NVIDIA 把 agent 沙箱做進 kernel 層、一位獨立開發者重做出 Anthropic 公開描述卻不公開原始碼的 Scion——今天的 GitHub trending 都在補『大量 agent 同時跑』的基礎設施"
tldr: "**NVIDIA/OpenShell**（1.9 萬★，+893）把 agent 沙箱做到 kernel 層，政策變更要先過形式驗證才放行；**feder-cr/git-ai**（988★）重做一份 Anthropic 公開撰文描述、但原始碼不公開的 Scion，解決上百個 agent 同時寫同一個分支會卡住的問題；**makecindy/cindy**（3,971★，+471）把 Claude Code 和 Codex 包進同一個桌面／手機 client；AWS 官方的 **agent-toolkit-for-aws**（3,055★）把部署 AWS 需要的 MCP server 和防護機制整理成一套官方 plugin。Release：Pydantic AI v2.61.0 相容性筆記鎖死 thinking 參數覆蓋和 CohereModel 檔案處理；Haystack v3.4.1 跟 LangGraph 同步因應憑證機構私鑰外流事件拉高 certifi 下限。"
series:
  name: "AI Agent GitHub Digest"
  order: 71
---

> 🌏 [English version](/posts/daily/2026-10-25-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「一堆 agent 同時跑」的基礎設施正在補齊——NVIDIA OpenShell 把沙箱隔離做到 kernel 層，政策變更前還要先跑形式驗證；feder-cr/git-ai 把 Anthropic 公開撰文描述、卻不公開原始碼的 Scion 重做成一份開源版，解決上百個 agent 同時改同一個分支時 classic Git 會卡住的問題；同時 Cindy 把 Claude Code 和 Codex 兩種 harness 包進同一個桌面／手機 client，AWS 也把官方 MCP server 和防護機制整理成一套 Agent Toolkit。背景裡，Pydantic AI 和多個框架都在因應一次憑證機構私鑰外流事件同步升級 certifi。

## Trending Repos

### NVIDIA/OpenShell ⭐ 19,332 (+893)

[GitHub](https://github.com/NVIDIA/OpenShell)　·　Rust　·　Apache-2.0

- **是什麼**：NVIDIA 官方開源的 agent 執行環境，把每個 agent 丟進隔離 sandbox，在 kernel 層面控管它能碰哪些檔案、能呼叫哪些 syscall、能連到哪些網路位置。
- **為什麼值得看**：多數「agent 安全」方案是事後審查 log，OpenShell 反過來在存取發生前就用 kernel 攔截；政策變更前還會先跑形式驗證，標出這次改動會不會意外多開放一支新主機或新 API，風險較大的變更要等人核准才放行；agent 本身永遠看不到真正的密鑰，密鑰只在通過 policy 檢查後才被加進外送請求。
- **Tech stack**：Rust kernel-level enforcement + Python CLI（PyPI `openshell`）+ Docker／Podman／虛擬化 sandbox
- **上手難度**：中——一行 curl 腳本裝完 CLI 和本機 gateway，但要上生產環境得先讀懂 gateway／supervisor／sandbox 三層架構再寫 policy。

---

### feder-cr/git-ai ⭐ 988

[GitHub](https://github.com/feder-cr/git-ai)　·　Go　·　MIT

- **是什麼**：一個獨立開源的「給 AI agent 用的 Git」——重做一份 Anthropic 公開撰文描述、但原始碼不公開的內部系統 Scion，解決上百個 agent 同時讀寫同一個分支時 classic Git 會卡住的問題。
- **為什麼值得看**：做法很直接——client 常駐連線只抓需要的物件，history 查詢交給 server 快取，落地用 compare-and-swap 取代合併佳列，每次異動都記進一筆 changeset log，底層仍是正常的 Git repo；衝突可以交給任何 LLM 提供商、固定規則、或完全不用，而且模型提議的解法只有在你設定的驗證指令跑過同一棵即將落地的樹才會真的落地，不然就把衝突包丟回給 agent。
- **Tech stack**：Go + SQLite／PostgreSQL（changeset log）+ 物件儲存（file／S3／GCS／Azure）
- **上手難度**：中——底層相容一般 Git repo，但要吃到 Scion 式的 sparse clone、自動衝突解決這些進階能力，需要照文件另外接 resolver 和 verify 指令。

---

### makecindy/cindy ⭐ 3,971 (+471)

[GitHub](https://github.com/makecindy/cindy)　·　TypeScript　·　Apache-2.0

- **是什麼**：一個開源桌面／手機 AI agent client，把 Claude Code 和 Codex 兩種 coding harness 包進同一個介面，讓你用已經付費的方案（而不是另外計費）在同一個 workspace 裡切換模型和 harness。
- **為什麼值得看**：多數「多 harness」方案是開發者自己接 SDK，Cindy 做成終端使用者可以直接下載的 app——同一個任務可以被不同 harness × model 組合分別規劃、平行執行、互相審查，workspace、記憶、skill 和工具在切換時保持連續；也支援操控瀏覽器、電腦和手機，從 IM 和排程接工作。
- **Tech stack**：pnpm monorepo + Node.js 22 + Claude Code／Codex harness 轉接層 + 桌面／行動 client
- **上手難度**：低——官方網站下載安裝即可，要接自己的 API key 或本機模型才需要額外設定。

---

### aws/agent-toolkit-for-aws ⭐ 3,055

[GitHub](https://github.com/aws/agent-toolkit-for-aws)　·　Python　·　Apache-2.0

- **是什麼**：AWS 官方維護的一套 MCP server、skill 和 plugin 集合，讓 Claude Code、Codex、Cursor、Devin、Kiro 等現有 coding agent 直接拿到部署和管理 AWS 服務需要的工具與防護機制。
- **為什麼值得看**：以往要讓 agent 安全操作 AWS，得自己拼 IAM 權限、SDK 用法規範、部署流程；這套工具直接拆成 `aws-core`（服務選型、CDK／CloudFormation、無伺服器、容器）、`aws-agents`（Bedrock／AgentCore）、`aws-data-analytics`、`aws-agents-for-devsecops`（事件調查、程式碼審查、滲透測試）等官方 plugin，裝好就能在 Claude Code marketplace 直接安裝啟用。
- **Tech stack**：Python + AWS CLI 整合 + Claude Code plugin marketplace
- **上手難度**：低——`aws configure agent-toolkit` 或 `/plugin install aws-core@claude-plugins-official` 一行裝完。

## Notable Releases

### Pydantic AI v2.61.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)

- **重要變更**：provider 專屬的 thinking 設定若從更外層範圍覆蓋掉你設的 `thinking`，現在會發出警告；對不支援關閉 thinking 的模型，`thinking=False` 改成送出該模型能接受的最低 thinking 量，而不是直接丟掉設定；`CohereModel` 工具回傳裡的檔案如果不支援，現在丟 `NotImplementedError` 而不是悄悄略過。
- **Breaking Changes**：以上三項都列在官方「⚠️ Compatibility Notes」底下——用 `CohereModel` 工具回傳檔案、沒檢查型別支援的程式碼升級後會直接噴錯，而不是像之前一樣默默漏資料。
- **對你的影響**：如果你在多個範圍（provider／model／call）疊著設 thinking 參數，先確認目前靠的是哪一層生效；升級後外層覆蓋會被記錄出來，方便抓到之前沒注意到的疊加關係。

---

### Haystack v3.4.1（跨框架 certifi 安全更新）

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.1)

- **重要變更**：這不是功能更新，是因應 eMudhra／emSign 憑證機構（CA）的中繼私鑰被發現生成強度太弱、可被外部還原的事件（[GHSA-6q48-6c7w-9gw2](https://github.com/advisories/GHSA-6q48-6c7w-9gw2)），`certifi` 已下架受影響的 emSign 根憑證；Haystack、LangGraph（1.2.17）等多個透過 httpx／requests 間接依賴 certifi 的框架這幾天都同步把下限拉到 `certifi>=2026.10.19`。
- **Breaking Changes**：無——純粹是信任鏈層級的依賴升級，不動 API。
- **對你的影響**：如果你的專案釘死了舊版 `certifi`（或透過 vendor 進容器映像檔），這次要主動把下限拉到 2026.10.19 以上並重建映像檔，否則信任鏈裡還留著已經被標記為有風險的憑證。

## 今日收穫

之前以為「agent 安全」主要是模型層面的提示注入防護，今天看到 NVIDIA 直接把防線放到 kernel 層、git-ai 把版本控制本身重新設計成能承受上百個 agent 同時寫入，才意識到真正撐住「大量自主 agent 同時跑」的是作業系統和基礎設施層級的隔離與併發控制，不只是把 prompt 寫得更小心。

## 參考資料

- [NVIDIA/OpenShell GitHub](https://github.com/NVIDIA/OpenShell)
- [feder-cr/git-ai GitHub](https://github.com/feder-cr/git-ai)
- [Anthropic：Redesigning source control（Scion 原文）](https://www.anthropic.com/engineering/redesigning-source-control)
- [makecindy/cindy GitHub](https://github.com/makecindy/cindy)
- [aws/agent-toolkit-for-aws GitHub](https://github.com/aws/agent-toolkit-for-aws)
- [Pydantic AI v2.61.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)
- [Haystack v3.4.1 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.1)
- [GHSA-6q48-6c7w-9gw2（certifi emSign 安全公告）](https://github.com/advisories/GHSA-6q48-6c7w-9gw2)
