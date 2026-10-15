---
title: "Bug Bounty 從零開始：從規則、工作台到第一份報告的完整路徑"
date: 2026-10-13
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, rules, scope, beginner-guide]
lang: zh-TW
description: "系列 0：Bug Bounty 從零開始的總覽與入門路徑，涵蓋規則解讀、工作站設定與第一份報告的完整流程。"
tldr: "這篇是「從零開始的資安獵人」系列的第一篇：你不需要先變成專家，只需要知道如何讀懂規則、設定工作台、寫出第一份可被接受的報告——這三件事決定你能拿到的獎金是否會被拒絕。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 0
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-how-it-works-en)

## TL;DR

**你只需要做三件事才能開始：讀懂規則、開啟工作台、寫出第一份報告。** 這篇是 `bug-bounty-from-zero` 系列（0 → 14）的起點，後面每篇都接在這裡：規則（1）、網站原理（2）、工作台操作（3）、XSS/IDOR（4）、RCE（5）、報告與分類（6）、記憶體（7）、緩衝區溢位（8）、VM/超視電腦（9）、Hyper-V 逃脫（10）、TEE（11）、AI 漏洞（12）、金額事實核查（13）、證照與學習地圖（14）。

**為什麼要這樣排順序？** 因為漏洞獵人不是「先學 RCE 再學規則」——你需要先知道**什麼是合法測試區域**，才能安全地操作工具，最後把發現寫成別人能重現的報告，這份報告才有機會拿到 Google VRP 的 $101,010（T0+S0，最高品質 1.2x = $121,212）。

---

## 情境

你剛註冊了一個 bug bounty 計畫（例如 Google VRP、Meta Private Processing、Microsoft MSRC）。頁面上有一份長長的「Rules」文件，裡面寫了：

- **In-scope**：哪些網域、哪些功能、哪些產品線
- **Out-of-scope**：第三方服務、內部系統、AI 模型訓練資料
- **Rewards**：RCE $101,010、資訊洩漏 $25,000、XSS $7,500（視品質係數 0.8x/1x/1.2x 調整）

你不知道該從哪裡開始。這篇就是為了解決這個「從零開始」的困境而寫的。

---

## 問題

**第一個錯誤：直接開始掃描，沒有讀規則。** 這會導致你測試了 out-of-scope 的系統、漏掉了 in-scope 的關鍵端點，或者報告被拒絕（duplicate、out-of-scope、資訊不足）。

**第二個錯誤：沒有工作台，直接用瀏覽器手動測試。** 你需要一個可重現的環境：Burp Suite Community（免費）、瀏覽器的 DevTools（F12 → Network → Copy as cURL）、以及一個本地測試伺服器（第 3 篇會教你架一個）。

**第三個錯誤：報告寫成「我發現了 XSS」而非「這是如何重現的、影響多大、為什麼值得獎金」。** Google VRP 明確說明：報告品質係數決定獎金，低品質（0.8x）會讓 $101,010 變成 $80,808；高品質（1.2x）會讓它變成 $121,212。

---

## 解決方案：三步流程

### 步驟 1：讀規則（30 分鐘）

每份規則都有相同結構：

| 區塊 | 你要看什麼 | 例子（Google VRP） |
|---|---|---|
| **Scope** | 網域列表、產品線、測試方法允許範圍 | `*.google.com`、`*.youtube.com`、`*.blogger.com` |
| **Rewards** | 不同嚴重度的獎金與品質係數 | T0 S0 RCE = $101,010 × 1.2（最高品質）= $121,212 |
| **Exclusions** | 禁止測試的系統、第三方、社交工程、拒絕服務 | 第三方服務、內部系統、非技術性問題 |
| **Report Quality** | 如何讓報告被評為 1.2x 而非 0.8x | 完整步驟、PoC、CVSS 評估、影響說明 |

**快速驗證**：在規則頁面搜尋「in-scope」與「reward」這兩個關鍵字，確認你要測試的網域在列表中，並記錄獎金表的數字，以便後續估算這份報告的價值。

### 步驟 2：開啟工作台（第 3 篇詳細操作）

你需要：

1. **Burp Suite Community Edition**（免費下載）：Proxy 攔截 + Repeater 重送 + HTTP History 搜尋
2. **Chrome DevTools**（F12）：Network → 右鍵 → Copy as cURL
3. **本地測試伺服器**（第 3 篇提供 `shop.mjs`）：`node shop.mjs` 在 `127.0.0.1:8000`，模擬漏洞行為（IDOR、XSS 測試點）

**最小可行環境**：不需要先攻擊真實目標。先在本地伺服器測試你能否：
- 透過 `curl` 重複執行同一個請求（重現性）
- 修改 URL 參數（例如 `/api/orders/1532` → `1533`）觀察回應差異
- 用 Burp Repeater 觀察狀態碼（200 → 403 → 404）的變化

### 步驟 3：寫第一份報告（第 6 篇詳細模板）

報告不是「我發現了漏洞」的口頭描述，而是**別人能照著重現的說明**。標準模板（可直接複製）：

```
Title: [簡潔描述，包含網域與漏洞類型]
Summary: [一句話說明影響範圍與嚴重度]
Steps to Reproduce: [1. 2. 3. ... 逐步操作，含 URL、參數、工具]
Expected Behaviour: [正常應該是什麼]
Actual Behaviour: [實際發生什麼，含回應內容或截圖描述]
Impact: [對使用者、資料、系統的影響，含估算損失或敏感資訊類型]
Proof of Concept: [可執行的 curl 指令或 Burp Repeater 步驟]
Severity / CVSS: [若適用，提供 CVSS 3.1 評分與理由]
Remediation / Fix: [如何修，或為什麼目前無法修但建議方向]
References: [相關文獻、CVE、官方文件]
```

**為什麼要這個結構？** Google VRP 的獎金表直接參考「報告品質」：低品質 0.8x、好品質 1.0x、卓越品質 1.2x。你的報告如果缺少「Steps to Reproduce」或「Proof of Concept」，評審會直接給 0.8x，$101,010 變成 $80,808；如果完整包含所有欄位並且有可重現的 PoC，可能拿到 1.2x = $121,212。

---

## 為什麼會這樣：VRP 獎金的結構邏輯

Google VRP（2026 年 7 月公告）顯示：

- **最高單一獎金**：$151,515（由 $101,010 × 1.5 係數得出，2024 年公告），但**現行規則頁的係數上限是 1.2x**（2025 年 3 月更新），因此實際最高為 $121,212（$101,010 × 1.2）
- **報告品質係數**：0.8x（低品質）、1.0x（好品質）、1.2x（卓越品質）
- **T0（最高敏感網域）S0（RCE）**：$101,010（基礎），加上品質係數後浮動

這意味著：**同一份漏洞，報告品質決定你能拿到多少。** 這也是為什麼這個系列把「報告品質」放在第 6 篇（寫報告與分類），而不是放在最後。

---

## 自我檢查（這篇的重點：你是否準備好了？）

- [ ] 你已經開啟一個 bug bounty 計畫的規則頁，並標註了「in-scope」網域列表
- [ ] 你已經下載了 Burp Suite Community，並成功攔截至少一個本地請求
- [ ] 你知道「Copy as cURL」的功能，並能將它貼到終端機重複執行
- [ ] 你已經估算過：如果這份報告是 T0 S0，最高可能拿到 $121,212；如果是 T2（一般網域），最高約 $90,000（$75,000 × 1.2）
- [ ] 你理解了為什麼這個系列從 0 到 14 是連續的：規則（1）→ 原理（2）→ 工具（3）→ 漏洞（4-5）→ 報告（6）→ 技術深入（7-12）→ 金額驗證（13）→ 學習地圖（14）

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — 獎金表與品質係數
- [Google July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515) — $151,515 最高獎金公告
- [Google 2024 Review](https://blog.google/security/vulnerability-reward-program-2024-in/) — Chrome $250,000 / Mobile $300,000
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — 實戰練習目標
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/) — $300k / $300k / $150k / $10k
- [Meta Scope](https://bugbounty.meta.com/scope/) — TEE 相關範圍

---

*這篇是系列 0（概述），後續每篇接在這裡：規則（1）、網站原理（2）、工作台（3）... 系列完整流程圖見第 6 篇與第 14 篇。*