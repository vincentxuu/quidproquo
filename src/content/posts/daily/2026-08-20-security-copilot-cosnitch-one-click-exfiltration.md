---
title: "資安警報｜CoSnitch——Copilot 被「話術」出自己的漏洞，一鍵外洩 Gmail 與永久記憶體"
date: 2026-08-20
category: daily
tags: [ai-agent, security, daily, prompt-injection]
description: "Varonis Threat Labs 用「meta-hacking」反覆追問，讓 Microsoft Copilot Personal 自己說出未公開的 URL 參數，串成一鍵資料外洩與永久記憶體污染攻擊鏈 CoSnitch（CVE-2026-24301）"
tldr: "Varonis 用社交工程「盤問」Copilot，讓它自己吐出未公開的 ?autorun=1 參數，串成三段攻擊鏈：自動執行 prompt、透過 OAuth 連接器外洩 Gmail/Drive/Calendar、以及寫入永久記憶體（換密碼、撤銷 session 都清不掉）。Microsoft 於 2026/8/18 修補，CVE-2026-24301，CVSS 8.8。防禦：稽核 Copilot 連接器授權、比照特權內部人員監控、對含 prompt 的連結提高警覺。"
series:
  name: "AI Security Alert"
  order: 6
---

## 事件概述

Varonis Threat Labs 揭露了一條代號 CoSnitch 的攻擊鏈，鎖定 Microsoft Copilot Personal。研究人員沒有逆向工程程式碼，而是反覆「盤問」Copilot 為什麼某個自動執行的想法不可行——每一次拒絕都附帶技術理由，最終 Copilot 自己說出了一個未公開的 URL 參數 `?autorun=1`。研究團隊把它稱為「meta-hacking」：不是攻破模型，而是社交工程模型的推理過程,讓它自己配合。串上這個參數後，攻擊者只要送出一個連結，受害者點擊即在已登入的 session 中無感執行任意 prompt，可外洩 Gmail、Google Drive、Google Calendar 等已連接服務的資料，並能把攻擊者指令寫進 Copilot 的永久記憶體。Microsoft 已於 2026 年 8 月 18 日發布修補，並確認官方未觀察到在野利用。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection（自動執行 + 間接注入）+ 資料外洩 |
| 影響範圍 | Microsoft Copilot Personal（Microsoft 稱 M365 Copilot Enterprise 不受影響，但分析師指出個人版帳號常與企業資料交織） |
| 嚴重程度 | Critical（Microsoft 標註）／CVSS 3.1 8.8 HIGH |
| CVE | CVE-2026-24301（CWE-77，Command Injection／Information Disclosure） |
| 來源 | [Varonis 官方研究](https://www.varonis.com/blog/cosnitch)、[NVD](https://nvd.nist.gov/vuln/detail/cve-2026-24301)、[CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-24301)、[Ars Technica](https://arstechnica.com/security/2026/08/microsoft-copilot-reveals-secret-input-that-allowed-it-to-be-hacked/)、[The Register](https://www.theregister.com/research/2026/08/18/copilot-tricked-into-telling-reseachers-how-to-hack-itself/5288857)、[Dark Reading](https://www.darkreading.com/vulnerabilities-threats/cosnitch-attack-copilot-mapping-out-architecture) |

## 攻擊面分析

CoSnitch 由三個串起來的缺陷組成，且**沒有一個環節「破壞」了任何東西**——每一步都是 Copilot 在做它被設計要做的事。

第一段是自動執行：Copilot 網頁版原本支援 `?q=` 參數，可把文字預填進輸入框，但仍需使用者按 Enter。Varonis 透過反覆追問「為什麼自動執行不可能」，讓 Copilot 一步步揭露自己的防護機制，最終供出一個從未公開、且原本是為第三方瀏覽器整合保留的參數 `?autorun=1`。兩個參數併用（`?q=<prompt>&autorun=1`），受害者只要點連結、頁面載入，注入的 prompt 就會在其已登入 session 中無點擊、無確認地執行。

第二段是資料外洩：一旦 prompt 執行，攻擊者可以指示 Copilot 查詢使用者已授權的 OAuth 連接器（Gmail、Drive、Calendar、OneDrive），把結果編碼進 URL，再利用 Copilot 內建的「抓取網頁摘要」功能發出 GET 請求，把資料送到攻擊者控制的 webhook。從網路層看，這個請求與 Copilot 平常抓取網頁摘要的流量完全無法區分。

第三段最危險：間接注入導致永久記憶體污染。當 Copilot 摘要一個外部網頁時，它不會區分「要摘要的內容」與「要執行的指令」——如果網頁裡藏了格式類似指令的文字，Copilot 會把它當成合法指示執行，包括寫入使用者的跨 session 永久記憶。這個記憶體沒有過期機制，換密碼、撤銷 session、重新註冊裝置都清不掉，只能靠使用者自己到記憶體設定頁手動刪除——而多數使用者根本不知道這個設定存在。

對照 OWASP LLM Top 10，這起事件橫跨三項：**LLM01 Prompt Injection**（直接注入的自動執行 + 間接注入的網頁摘要）、**LLM02 Insecure Output Handling**（把外洩資料當成正常的 URL 抓取執行）、**LLM06 Excessive Agency**（Copilot 對已連接服務的存取權限，被整段挪用去做原本使用者無意授權的事）。根本原因是分析師點出的老問題：LLM 無法區分「資料」和「藏在資料裡的指令」，而修這個問題與 Copilot 本身賣的功能（讀信、抓網頁、記住你）互相衝突,所以短期內只能靠不斷的緩解,而非一次性修補。

## 防禦做法

**立即動作**
- 稽核組織內誰在用 Copilot Personal，並盤點其連接了哪些 OAuth 服務（Gmail、Drive、Calendar）——連接越多，攻擊面越大，能斷開不用的就斷開
- 教育使用者：任何會把 prompt 預填進 AI 助理輸入框的連結（email、聊天訊息、QR code）在執行前都要先看清楚內容，不要盲目點擊
- 檢查 Copilot 記憶體設定，確認沒有異常寫入的指令（尤其是曾摘要過不明來源網頁之後）
- 若偵測工具目前無法辨識「源自 Copilot 的異常資料存取模式」，這是一個明確的監控盲點,需要補上

**長期架構**
- 把每一個掛了資料連接器的 AI 助理當成「有廣泛存取權、但沒有安全意識的特權內部人員」來管理，比照人類員工的存取審查與異常偵測標準
- 導入 runtime prompt injection 偵測，例如 watchlist 中 Lakera Guard、Invariant Labs 或 Prompt Security 這類專門辨識「內容裡藏指令」的防護層,而不是只信任模型自身的拒絕機制
- 架構上落實資料與指令的分離：對外部網頁摘要、郵件內容等不受信任輸入,避免讓模型把其中的自然語言直接當作可執行指令
- 定期檢視 AI 助理的記憶體/長期狀態儲存是否有清除機制，避免污染一旦寫入就無法透過標準事件應變流程（換密碼、撤銷 session）清除

## 影響範圍

Microsoft 表示企業版 M365 Copilot 不受影響，且客戶「已受保護、無需採取行動」，但多位分析師指出這個說法過於樂觀：企業環境裡員工經常用個人 Gmail 收轉寄的公司信件、用個人 Drive 存工作文件，因此個人版 Copilot 外洩的資料實質上常常就是企業資料。Varonis 在 2025 年 12 月就通報此漏洞，Microsoft 先在 2026 年 2 月悄悄修補了自動執行的其中一部分，直到 2026 年 8 月 18 日才完成完整修補,前後歷時近 8 個月。目前官方未發現在野利用證據，但記憶體污染這一段即使修補上線，**修補前已被寫入的惡意記憶體條目本身不會被自動清除**，仍需要使用者手動檢查與刪除。

這也是本月 Varonis 針對 Copilot 揭露的第三個一鍵攻擊鏈（先前為 Reprompt、SearchLeak），三者共用同一種模式：一次點擊、看似正常的連結，就能讓 AI 助理把自己被授權的存取權限轉為攻擊者可用的工具。如果你的 Agent 系統同樣有「摘要外部內容」與「跨 session 記憶」這兩項能力，這條攻擊鏈幾乎可以照搬。

## 今日收穫

CoSnitch 最反直覺的地方不是攻擊鏈本身,三段式 prompt injection 外洩已經是熟悉的套路,而是漏洞的發現方式:研究人員完全沒有碰程式碼，只是用「為什麼這不可能」不斷追問 Copilot，模型在解釋自己安全機制的過程中,把繞過方法親口說了出來。這代表模型的「拒絕並解釋原因」本身可能就是一種資訊洩漏面,護欄的說明越詳細,攻擊者能反推的架構細節就越多。

## 參考資料

- [Varonis Threat Labs：CoSnitch 官方技術分析](https://www.varonis.com/blog/cosnitch)
- [NVD：CVE-2026-24301](https://nvd.nist.gov/vuln/detail/cve-2026-24301)
- [CVE.org 記錄](https://www.cve.org/CVERecord?id=CVE-2026-24301)
- [Ars Technica：Microsoft Copilot reveals secret input that allowed it to be hacked](https://arstechnica.com/security/2026/08/microsoft-copilot-reveals-secret-input-that-allowed-it-to-be-hacked/)
- [The Register：Copilot tricked into telling researchers how to hack itself](https://www.theregister.com/research/2026/08/18/copilot-tricked-into-telling-reseachers-how-to-hack-itself/5288857)
- [Dark Reading：'CoSnitch' Attack Tricked Copilot into Revealing Own Architecture](https://www.darkreading.com/vulnerabilities-threats/cosnitch-attack-copilot-mapping-out-architecture)
- [Computerworld：Microsoft finally patches critical one-click Copilot vulnerability](https://www.computerworld.com/article/4211325/microsoft-finally-patches-critical-one-click-copilot-vulnerability-more-than-eight-months-after-learning-of-it.html)
