---
title: "資安警報｜GlassWorm 捲土重來——偽裝 VS Code 主題的惡意 extension 經 Marketplace／Open VSX 散布，開發機淪為 AI agent 金鑰外洩入口"
date: 2026-10-06
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "Socket.dev 揭露一波與 GlassWorm 有關的惡意 VS Code 主題 extension 叢集，橫跨 Visual Studio Marketplace 與 Open VSX，已確認至少兩個惡意版本並累積數萬次下載，攻擊面直指開發機上的 AI coding agent 憑證。"
tldr: "Socket Threat Research 發現六個與 GlassWorm 有關聯的 VS Code 主題 extension（Coca-Cola Christmas、Aurora Borealis Studio Theme、Cosmic Nebula Themes 等），其中 Aurora Nocturne Night Theme 與 Cosmic Nebula Themes 已確認是惡意程式，後者的載入器與今年 5 月遭 CrowdStrike／Google／Shadowserver 聯手下架的 GlassWorm 共用 Solana 死信位址、AES 金鑰與執行模型。兩個已確認惡意版本累積超過 8,000 次 Marketplace 安裝，叢集關聯的 Open VSX listing 再疊加數萬次下載。防禦：立即盤點已安裝的主題類 extension、比對 IOC，長期則對 extension 執行期行為（檔案存取、網路連線、程序啟動）做掃描而非只信任原始碼倉庫。"
series:
  name: "AI Security Alert"
  order: 47
---

> 🌏 [English version](/posts/daily/2026-10-06-security-glassworm-vscode-theme-supply-chain-en)

## 事件概述

資安研究公司 Socket.dev 的威脅研究團隊於 10 月 2 日發布報告，揭露一個仍在擴散的惡意 VS Code 主題 extension 叢集，跨 Visual Studio Marketplace 與 Open VSX Registry 兩個平台運作。這些 extension 對外都宣稱只是改變編輯器配色的主題，但其中至少兩個版本——曾以 `microsoftvs.microsoftvs` 冒充微軟官方帳號發布的「Aurora Nocturne Night Theme」，以及「Cosmic Nebula Themes」——內藏會下載並執行攻擊者控制程式碼的惡意載入器，且後者的技術指紋與今年 5 月遭 CrowdStrike、Google、Shadowserver 基金會聯手下架的供應鏈攻擊行動 GlassWorm 完全吻合。受害對象是任何安裝這些主題的開發者，而開發機正是 AI coding agent（Copilot、Cursor、Claude Code 等）API 金鑰與雲端憑證的集散地。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（IDE extension 仿冒／brandjacking） |
| 影響範圍 | 安裝 Aurora Nocturne Night Theme、Cosmic Nebula Themes 等惡意 VS Code 主題 extension 的開發者；叢集關聯 extension 累積數萬次下載 |
| 嚴重程度 | High |
| CVE | 無（屬惡意套件識別，非軟體漏洞） |
| 來源 | [Socket.dev 原始研究](https://socket.dev/blog/glassworm-vscode-themes)、[Cyber Security News](https://cybersecuritynews.com/glassworm-supply-chain-attack)、[GBHackers](https://gbhackers.com/glassworm-supply-chain)、[Cyber Press](https://cyberpress.org/container-image-scanning-by-use-case) |

## 攻擊面分析

攻擊者先用「brandjacking＋name-squatting」拿到使用者的初步信任：`Coca-Cola Christmas` 直接借用可口可樂品牌名稱，`Aurora Borealis Studio Theme` 則模仿既有的合法同名主題，外觀與描述都做得像正常的色彩佈景主題。Socket 同時找到一篇 2025 年 12 月 14 日發布、帳號在同一天註冊的 DEV Community 文章，內容把這些 extension 包裝成「獨立推薦清單」引導開發者去 Open VSX 安裝——研判是這波行動自建的推廣基礎設施，而非真正的第三方評測。

技術層面，惡意主題的手法完全違背「主題只改外觀」的常識：VS Code 的 extension 權限模型沒有細粒度限制，一旦被授權啟用（`activationEvents: ["*"]`），extension 就能拿到完整的 Node.js 執行環境——`require`、`fs`、`child_process`、甚至 `vm.createContext` 建立的沙箱其實仍把 `require`、`Buffer`、`process` 全部暴露給遠端下載的程式碼。`Cosmic Nebula Themes` 的 `app.js` 用 AES-256-CBC 解密內嵌的 JavaScript 後直接 `eval()` 執行，並用 Solana 區塊鏈上的交易備註（transaction memo）當「死信位址」動態解析下一階段的下載網址——這代表攻擊者可以隨時更換後端基礎設施，完全不需要重新發布 extension 版本，也不會留下可以一次封鎖的固定 IP 或網域。載入器還會偵測 Russian-language／timezone 設定並跳過執行，是常見的「避開母國」反分析手法。

對照 OWASP LLM Top 10，核心問題落在 **LLM05 Supply Chain Vulnerabilities**：開發者安裝 extension 時信任的是 Marketplace 審核與原始碼倉庫，但 Socket 發現公開倉庫的 `app.js` 與實際發布的套件內容並不一致——只看 GitHub 原始碼完全看不出問題。這同時疊加了近似 **LLM06 Excessive Agency** 的根因：VS Code 的 extension 執行模型本質上是「全權限、無沙箱」，一個色彩主題能做到的事和一個完整的 Node.js 程式沒有差別，而開發機上恰好就放著 Claude Code、Cursor、GitHub Copilot 等 AI coding agent 的 API 金鑰、`.env` 檔案與雲端憑證，一旦惡意程式碼落地，這些都在同一個無隔離的執行環境裡唾手可得。

## 防禦做法

**立即動作**
- 盤點本機與團隊共用環境是否安裝了 Aurora Nocturne Night Theme（`microsoftvs.microsoftvs`）、Cosmic Nebula Themes（`cosmic-themes.theme-cosmic-nebula`）或文中列出的叢集關聯 extension，發現立即移除
- 若曾安裝上述任一惡意版本：比對本機是否存在 `%TEMP%\temp_batch.cmd`、是否曾向 `fingercakes4sale[.]store` 發出連線，一旦命中就視同主機已遭入侵，輪換該台機器上所有 AI agent API 金鑰（ANTHROPIC_API_KEY、OPENAI_API_KEY 等）、Git／SSH 憑證與雲端存取金鑰
- 全面重新檢視「主題」類 extension 的必要執行權限——色彩主題不該要求網路存取或程序啟動能力，此類 extension 應被視為高風險並優先下架

**長期架構**
- 對已安裝 extension 建立持續性的執行期掃描機制，檢查 `package.json` 的 activation events、bundled JavaScript、網路請求與程序呼叫是否超出宣稱功能所需，而不是只在安裝當下做一次性審查——GlassWorm 的手法正是「先發乾淨版本過審，之後用執行期解密的程式碼補上惡意邏輯」
- 比照 Protect AI 旗下 huntr 漏洞平台對 AI/ML 套件生態系的持續掃描模式，把 IDE extension／MCP server 等開發工具生態系納入供應鏈安全掃描範圍，而非只掃 npm／PyPI 的直接依賴
- 公開原始碼倉庫不該被視為「發布內容等同於原始碼」的保證——建議在 CI/CD 中加入「原始碼倉庫 vs. 實際發布產物」的 diff 檢查，偵測像本案一樣倉庫乾淨但發布內容夾帶惡意程式碼的落差

## 影響範圍

Socket 確認的兩個惡意版本中，`Aurora Nocturne Night Theme` 與 `Aurora Borealis Studio Theme` 在 Visual Studio Marketplace 合計超過 8,000 次安裝，叢集關聯的 Open VSX listing（含 `Charcoal Mint` 約 1 萬次）再疊加數萬次下載，但實際遭植入惡意程式碼並執行的人數目前無法從下載數反推，Socket 也明確指出「這些總數不代表有多少使用者實際遭入侵」。微軟在接獲 Socket 通報後已迅速下架相關 Marketplace extension，但 Marketplace 下架不會清除已安裝機器上殘留的惡意程式碼或已被竊走的憑證——這也是本案與先前多起 npm/PyPI 供應鏈事件的共同教訓。

對任何在開發機上同時跑著 AI coding agent 的團隊而言，這起事件的意義在於：IDE extension 生態系和 MCP server／npm 套件生態系面對的是同一種信任模型漏洞，而開發機正好是 AI agent 憑證最密集的地方。若團隊的 AI agent 治理只做了 MCP server allowlist 卻沒管到 IDE extension 層，攻擊面依然是開放的。

## 今日收穫

這次事件再次印證「公開倉庫乾淨，不代表實際安裝的東西乾淨」——Socket 的分析反覆強調，光看 GitHub 原始碼完全無法發現 `Cosmic Nebula Themes` 真正執行的惡意邏輯，因為解密與執行都發生在執行期。這把資安稽核的重心從「審查原始碼」往前挪到「比對發布產物與原始碼倉庫是否一致」，而這正是過去只盤查 MCP server 工具定義、卻很少檢查 IDE extension 本身執行內容的團隊容易漏掉的一塊。

## 參考資料

- [GlassWorm Supply Chain Attack Hides Malware Inside VS Code Color Themes — Socket.dev](https://socket.dev/blog/glassworm-vscode-themes)
- [GlassWorm Supply Chain Attack Uses Fake VS Code Themes to Deliver Hidden Malware — Cyber Security News](https://cybersecuritynews.com/glassworm-supply-chain-attack)
- [GlassWorm Supply Chain Attack Hides Malware Inside VS Code Color Themes — GBHackers](https://gbhackers.com/glassworm-supply-chain)
- [Malicious VS Code Themes Hide GlassWorm Malware Targeting Developers — Cyber Press](https://cyberpress.org/container-image-scanning-by-use-case)
- [Inside CrowdStrike's Takedown of a Developer-Targeting Botnet — CrowdStrike](https://www.crowdstrike.com/en-us/blog/inside-crowdstrike-takedown-of-a-developer-targeting-botnet)
