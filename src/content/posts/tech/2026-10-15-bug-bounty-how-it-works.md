---
title: "Bug Bounty 從零開始：從規則、工作台到第一份報告的完整路徑"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, rules, scope, beginner-guide]
lang: zh-TW
description: "系列總覽：先讀計畫規則，在本地架好工作台，再把可重現的發現寫成第一份報告。"
tldr: "先確認授權與範圍，在本地練習檢查請求，再把實際驗證的發現寫成可重現的報告；是否發獎及金額由各計畫依規則評估。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 0
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-how-it-works-en)

## TL;DR

**開始前先做三件事：讀懂規則、開啟工作台、寫出可重現的報告。** 這篇是 `bug-bounty-from-zero` 系列（0 → 14）的起點：規則（1）、網站原理（2）、工作台（3）、XSS／IDOR（4）、RCE（5）、報告與分類（6）、記憶體（7）、緩衝區溢位（8）、虛擬機與虛擬機監控器（9）、Hyper-V 逃脫（10）、TEE（11）、AI 漏洞（12）、金額查核（13）、證照與學習地圖（14）。

為什麼這樣排？使用工具前，要先知道計畫授權測試哪些系統、允許哪些方法；提交漏洞前，要先留下別人能重現的證據。符合條件的發現可能獲得獎金，但填完報告模板不代表一定收件或發獎。

## 情境

你打開 Google VRP、Meta Bug Bounty 或 Microsoft MSRC 等計畫的規則頁，會看到：

- **In-scope**：符合資格的網域、產品、功能與版本。
- **Out-of-scope**：排除的資產、漏洞類型與測試方法。
- **Rewards**：如何評估符合條件的發現，以及適用的獎金表。

每個計畫的條件不同。另一個計畫的萬用字元網域或獎金數字，不能證明你有權測試眼前的目標。這篇要做的是把長篇規則轉成能開始練習的計畫。

## 問題：三個容易卡住的地方

**沒讀規則就掃描。** 你可能測到排除的系統、用了禁止的方法，或漏看資格條件。技術上成立的漏洞，也可能因為不在範圍內或已有重複報告而不被接受。

**沒有可重現的工作台。** 手動瀏覽有助於理解功能，但還需要記錄請求與回應。Burp Suite Community、瀏覽器 DevTools 與本地伺服器，能讓你重送同一個請求，每次只改一個輸入。

**報告只寫漏洞名稱。** 「我發現 XSS」沒有交代輸入在哪裡、何時執行、影響誰，以及審查者如何重現。清楚的報告能減少猜測，不能保證特定嚴重度或獎金。

## 解法：三步流程

### 步驟 1：讀規則

先安排一段時間，整理這四件事；遇到不清楚的條件就繼續查，不必硬在固定時間內完成。

| 區塊 | 你要記錄什麼 | 要回答的問題 |
|---|---|---|
| Scope | 明確的資產、版本與允許的測試方法 | 這個主機與這個動作是否在授權範圍內？ |
| Rewards | 適用分類與資格條件 | 這張表適用於這個產品與影響嗎？ |
| Exclusions | 第三方、禁止技術與排除的發現 | 這次測試會跨過排除的邊界嗎？ |
| Reporting | 要求的證據與回報管道 | 審查者能不靠猜測重現嗎？ |

**快速檢查**：搜尋規則頁的「scope」「reward」「report」，記下來源網址與這次測試適用的條件。資產歸屬或授權不明時，先走計畫的詢問管道。估計能拿多少錢，不能取代測試授權。

### 步驟 2：開啟工作台

第 3 篇會詳細介紹：

1. **Burp Suite Community Edition**：用 Proxy 攔截、HTTP History 查看紀錄、Repeater 重送請求。
2. **瀏覽器 DevTools**：從 Network → Copy as cURL 匯出請求。
3. **本地測試伺服器**：執行 `node shop.mjs`，監聽 `127.0.0.1:8000`，提供登入、搜尋與訂單端點。

不必先碰真實目標。先確認自己能：

- 用 `curl` 重複執行同一個請求。
- 保持同一個登入狀態，把 `/api/orders/1532` 改成 `/api/orders/1533`。
- 解釋本地應用程式回傳 `200`、`401`、`403`、`404` 的差異。

這份範例有檢查訂單擁有者，搜尋則回傳 JSON。它是理解請求處理的基準，不能因此宣稱端點有 XSS 或 IDOR。第 4 篇會說明成立漏洞還需要什麼證據。

### 步驟 3：寫第一份報告

報告是別人能照著操作的步驟與證據。第 6 篇會進一步解釋這份模板：

```text
Title: [簡潔描述，包含資產與漏洞類型]
Summary: [一句話說明受影響的使用者或資料]
Steps to Reproduce: [依序列出 URL、參數、工具與操作]
Expected Behaviour: [應用程式應該允許或拒絕什麼]
Actual Behaviour: [實際發生什麼，附相關回應證據]
Impact: [已證明對使用者、資料或系統造成的影響]
Proof of Concept: [可重現的 curl 指令或 Repeater 操作]
Severity / CVSS: [計畫要求時，附分數、版本與評分理由]
Remediation / Fix: [有依據時提出修正建議]
References: [相關官方文件、公告或 CVE]
```

步驟要精簡、前後一致。用自己的測試帳號、遮蔽憑證，只保留證明問題所需的資料。把實際觀察和可能延伸的後果分開；目前只證明腳本執行，就不要寫成已接管帳號。

這個結構能幫助審查者重現並評估影響。缺一欄不代表固定打折，填滿所有欄位也不代表一定提高獎金。

## 為什麼獎金表需要脈絡

獎金表屬於特定計畫，分類可能取決於產品、資產敏感度、影響、報告品質，以及規則列出的其他條件；資格與重複報告處理也會影響結果。

評估發現時，要看現行官方規則。引用歷史公告就保留日期與適用計畫，不能把舊公告的最高金額和另一份表格的係數拼在一起。第 6 篇與第 13 篇會接著說明報告寫作與獎金主張的查核方法。

實際做法是先記錄受影響的資產與已證明的影響。這些證據能支撐計畫評估，比先挑一個最高獎金再倒推漏洞價值更可靠。

## 自我檢查

- [ ] 我已開啟規則頁，確認這次測試涉及的資產與允許方法。
- [ ] 我已安裝 Burp Suite Community，成功攔截本地請求。
- [ ] 我能把請求匯出為 cURL，並在終端機重送。
- [ ] 我能分清楚獎勵資格與可能金額，不把兩者當成保證。
- [ ] 我理解學習順序：規則 → 網站原理 → 工具 → 漏洞 → 報告 → 深入系統 → 金額查核 → 學習地圖。

## 更新紀錄

- 2026-10-15：補齊英文總覽，釐清本地範例的基準行為，兩語同步移除缺乏依據的獎金計算與發獎保證。

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — 計畫範圍與獎勵條件。
- [Google July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515) — 歷史公告，不能取代現行規則。
- [Google 2024 Review](https://blog.google/security/vulnerability-reward-program-2024-in/) — 歷史計畫成果。
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — 刻意設計有漏洞的練習應用程式。
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Scope](https://bugbounty.meta.com/scope/)

這篇是系列 0（總覽）。接著讀規則（1）、網站原理（2）、工作台（3）；第 6 篇與第 14 篇會串起報告流程與學習地圖。
