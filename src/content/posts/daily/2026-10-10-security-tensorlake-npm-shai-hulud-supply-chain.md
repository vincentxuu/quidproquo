---
title: "資安警報｜AI Agent Sandbox SDK Tensorlake 遭 Shai-Hulud 蠕蟲供應鏈攻擊"
date: 2026-10-10
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "AI agent sandbox 服務 Tensorlake 的官方 npm SDK 被植入 Shai-Hulud 蠕蟲變種，竊取 GitHub／npm／AWS／Vault 等憑證與 Claude／Cursor／Kiro 等 AI 工具設定，並在可及 repo 植入 .claude/settings.json 持久化。"
tldr: "2026-10-07 攻擊者竄改 tensorlakeai/tensorlake 主分支並發布惡意版本 0.5.144，preinstall hook 透過 Bun 執行竊憑證蠕蟲，目標包含 GitHub／npm／AWS／Vault／SSH 及 Claude／Cursor／Kiro／Windsurf／Zed 的 AI 工具設定，並會寫入 .claude/settings.json、.vscode/tasks.json 讓受害者下次開專案時再次觸發。Socket／Sonatype／StepSecurity／Endor Labs 等多方資安公司交叉確認；npm 已下架，防禦：先斷網隔離再清除「hostage token」監控器，否則撤銷 GitHub token 會觸發清空家目錄，之後才輪替所有可及憑證。"
series:
  name: "AI Security Alert"
  order: 50
---

> 🌏 [English version](/en/posts/daily/2026-10-10-security-tensorlake-npm-shai-hulud-supply-chain-en)

## 事件概述

Tensorlake 是提供 AI agent sandbox／serverless 執行環境的服務，其官方 TypeScript SDK `tensorlake` 在 npm 上每週下載量約 1.2 萬次、歷史安裝超過 10 萬次。2026 年 10 月 7 日凌晨，攻擊者以某維護者身分竄改 `tensorlakeai/tensorlake` 主分支，次日（10/8）觸發發布流程，把惡意版本 `0.5.144` 推上 npm。該版本內建 Shai-Hulud 蠕蟲家族最新變種，會在安裝階段自動竊取開發機與 CI 環境中的多種憑證，並刻意蒐集 Claude Code、Cursor、Kiro、Windsurf、Zed 等 AI coding 工具的設定與驗證資訊。Socket、Sonatype、StepSecurity、Endor Labs、Aikido、OX Security 等多家資安公司各自分析後交叉確認細節，npm 已將該版本下架，Tensorlake 也在 GitHub PR #1016 revert 惡意 commit。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（npm 套件竄改／蠕蟲） |
| 影響範圍 | 安裝過 `tensorlake@0.5.144` 的開發機、CI 環境與相連的 GitHub／雲端帳號 |
| 嚴重程度 | High |
| CVE | 無（npm 已直接下架該版本，未見 CVE 編號） |
| 來源 | [The Hacker News](https://thehackernews.com/2026/10/tensorlake-npm-package-compromised-to.html)、[Sonatype](https://www.sonatype.com/blog/hijacked-tensorlake-npm-turned-install-into-credential-risk)、[Endor Labs](https://www.endorlabs.com/learn/tensorlake-npm-package-compromised-by-shai-hulud-in-latest-software-supply-chain-attack)、[Aikido](https://www.aikido.dev/blog/tensorlake-npm-package-compromised) |

## 攻擊面分析

攻擊鏈分三步：第一步，攻擊者先取得足以推 commit 的維護者權限（確切手法尚未公開，常見於 maintainer 帳號或發布 token 外洩），直接把惡意檔案 push 到 `tensorlakeai/tensorlake` 主分支；第二步，同一帳號手動觸發 repo 自己的 `publish_npm.yaml` workflow，讓惡意版本以「官方發布」的正常簽署流程上架 npm，使用者完全無從從套件來源判斷異狀；第三步，`package.json` 的 `preinstall` hook 在 `npm install` 階段早於任何應用程式碼就自動執行 `lib/setup.mjs`，下載 Bun runtime 載入約 856KB 的混淆payload `lib/Math_Symbol.js`，蒐集本機檔案、CI 環境變數、Kubernetes、Vault 中的密鑰，外洩管道先試 HTTPS 端點，失敗則讀一筆 Ethereum 合約解析備援 C2 位址，再不行就在 GitHub 建立公開 repo 當資料暫存站。

這起事件之所以直接命中 AI 基礎設施，是因為竊取清單明確點名 Claude、Cursor、Kiro、Windsurf、Zed 的 MCP 設定與驗證檔案，而且惡意程式會主動在能存取到的 repo 裡寫入 `.claude/settings.json` 與 `.vscode/tasks.json`——這代表受害者下次用 Claude Code 或 VS Code 開啟該專案時，惡意設定可能再次被觸發執行，把一次性的套件竄改變成跨工具的持久化機制。對應 OWASP LLM Top 10：**LLM05 Supply Chain Vulnerabilities**（信任一個正常簽署、正常發布流程的套件，而非偵測可疑行為）；寫入 `.claude/settings.json` 這招又疊加了 **LLM06 Excessive Agency** 的風險面——AI coding agent 預設信任專案目錄下的設定檔，等於把「打開專案」這個日常動作變成攻擊面。

## 防禦做法

立即止血的核心是「順序」：資安公司一致警告，惡意程式內建一個「人質 token」機制——用 PowerShell 監控器持續輪詢偷來的 GitHub token 是否還有效，一旦偵測到 token 被撤銷，就會觸發清空使用者家目錄。因此絕對不能先撤銷憑證，必須先斷網隔離受感染機器、殺掉該持久化監控器，確認移除後才能安全輪替憑證。

長期架構上，這起事件再次證明「鎖版本」比「信任簽署」更重要：Endor Labs 建議直接封鎖 `0.5.144`，暫時釘選回上一個已知乾淨版本 `0.5.143`，並清掉 lockfile 與套件快取中殘留的惡意版本紀錄，避免 CI 重新裝入。長期則該把 npm/PyPI 套件安裝納入 CI pre-install 掃描（Socket、Sonatype、Endor Labs 這類供應鏈掃描工具都能擋在安裝前），並導入 watchlist B7 的 **Protect AI** 做 AI／ML 開發工具鏈專屬的惡意套件偵測——這起事件的受害資產本質上就是 AI agent sandbox 的開發 SDK，傳統只盯應用程式碼的 SCA 工具容易漏掉這類「AI 專屬」的竊取清單。

**立即動作**
- 檢查是否曾安裝過 `tensorlake@0.5.144`：`npm ls tensorlake 2>/dev/null`，並翻查 lockfile／package cache 裡是否殘留該版本紀錄
- 若曾安裝：**先斷網隔離機器**，排查並移除輪詢 GitHub token 的持久化監控器，確認清除後才輪替所有可及憑證（npm、GitHub、AWS、Vault、SSH、雲端金鑰）
- 檢查受影響機器碰過的 repo 是否被植入 `.claude/settings.json`、`.vscode/tasks.json`，有就移除並稽核 Git 歷史
- 檢查 GitHub 帳號活動，是否被建立描述為「Shai-Hulud: Here We Go Again」的陌生公開 repo

**長期架構**
- 套件安裝一律鎖定到已驗證版本（避免浮動 tag），`npm install` 前先過 Socket／Sonatype 這類供應鏈掃描
- 考慮導入 Protect AI 針對 AI／ML 開發工具鏈的惡意套件與模型供應鏈偵測
- AI coding agent（Claude Code、Cursor 等）的專案層設定檔變更應視為敏感事件，接 CI 或本機監控去偵測未預期的 `.claude/settings.json`／`.vscode/tasks.json` 寫入

## 影響範圍

`tensorlake` SDK 歷史安裝量超過 10 萬次、每週下載約 1.2 萬次，但目前各家資安公司（包含深入分析程式碼的 Sonatype）都明確表示：**尚未證實**真的有竊取資料被公開外洩、也未證實有下游系統或 repo 實際遭進一步攻陷——目前確認的是惡意程式碼的能力與設計，而非已發生的實際損害範圍。npm 已下架該版本，Tensorlake 也在 GitHub revert 了惡意 commit，但移除套件本身不會撤銷它可能已經讀取過的憑證，使用者仍須自行確認是否真的執行過該 hook。

如果你的團隊有 AI agent 開發流程會動態安裝 sandbox／工具 SDK，這起事件代表攻擊面已經從「單純偷 API key」升級到「偷 AI coding 工具設定＋在你的 repo 裡植入持久化後門」。建議盤點目前所有串接 AI agent sandbox 服務的 CI pipeline，確認套件安裝是否有版本鎖定與供應鏈掃描。

## 今日收穫

這起事件最值得記的不是「又一個 npm 套件被下毒」——這類攻擊鏈已經是 2026 年的常態——而是攻擊者把 `.claude/settings.json` 當成跨工具持久化的載體：偷憑證是一次性的收穫,但寫進 AI coding agent 會自動讀取的設定檔,等於讓受害者自己的日常開發習慣(打開專案)變成重新觸發攻擊的開關。防禦的思考也該跟著挪一格:不能只檢查「這次 install 有沒有問題」,還要檢查「我的 repo 裡,有沒有被偷偷塞進會在我打開它時自動執行的設定」。

## 參考資料

- [Tensorlake npm Package Compromised to Deliver Shai-Hulud Credential-Stealing Worm — The Hacker News](https://thehackernews.com/2026/10/tensorlake-npm-package-compromised-to.html)
- [Hijacked TensorLake npm Turned Install Into Credential Risk — Sonatype](https://www.sonatype.com/blog/hijacked-tensorlake-npm-turned-install-into-credential-risk)
- [Tensorlake npm package compromised by Shai-Hulud in latest software supply chain attack — Endor Labs](https://www.endorlabs.com/learn/tensorlake-npm-package-compromised-by-shai-hulud-in-latest-software-supply-chain-attack)
- [tensorlake NPM package compromised with Shai Hulud worm — Aikido](https://www.aikido.dev/blog/tensorlake-npm-package-compromised)
