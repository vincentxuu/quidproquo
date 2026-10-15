---
title: "Write Report & Triage: How to Turn a Bug Into a Payout"
date: 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, report-writing, triage, google-vrp, best-practices]
lang: zh-TW
description: "Series 6: How to turn a discovered bug into a successful bug bounty report. Covers report structure, quality scoring, triage communication, and getting approved by the program."
tldr: "A step-by-step guide to writing a winning bug bounty report: structure, quality criteria, triage communication, and common pitfalls to avoid."
draft: false
series:
  name: "從零開始的資安獵人"
  order: 6
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-06-write-report-and-triage-en)

## TL;DR

Writing a bug bounty report is half the battle. To win a payout, your report must follow a strict structure: **Title → Summary → Steps to Reproduce → Expected vs Actual → Impact → CVSS → Remediation → References**. Follow the template below and you'll maximise your chance of hitting the 1.2x quality multiplier and securing the full $121,212 RCE reward.

---

## 情境

你已經完成了規則、網站原理、工作台、XSS/IDOR 和 RCE 的基礎知識。現在你需要把所有之前的測試工作綜合成一份完整報告，並提交給 Bug Bounty 計畫。報告的品質直接決定獎金（0.8x / 1.0x / 1.2x）。

---

## 問題

**錯誤 1：** 報告結構混亂，缺少必要章節（影響分析、CVSS、修補建議）。
**錯誤 2：** 沒有明確的品質評分（0.8x / 1.0x / 1.2x），導致獎金打折。
**錯誤 3：** 缺少 PoC（Proof of Concept）細節，評審無法驗證重現性。
**錯誤 4：** 報告語氣過於主觀，缺乏專業性。

---

## 解決方案：報告寫作步驟

### 1. 結構框架（Google VRP 標準）

| 章節 | 內容要點 |
|---|---|
| **Title** | 具體名詞 + 漏洞類型，例如 "Google VRP RCE – 遠端程式執行漏洞" |
| **Summary** | 一句話概括影響與獎金（例如 "RCE 允許攻擊者執行任意命令，可能導致資料外洩"） |
| **Steps to Reproduce** | 1. 請求 URL 或 API 端點 2. 輸入惡意參數 3. 觀察回應 4. 結果分析 |
| **Expected Behaviour** | 正常情況下應該發生什麼（例如 "伺服器應回傳 200 OK"） |
| **Actual Behaviour** | 實際發生了什麼（例如 "伺服器回傳 root 權限，顯示敏感資料"） |
| **Impact** | 用戶資料外洩、服務中斷、品牌受損 |
| **CVSS 3.1** | 3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| **Remediation** | 修復建議（例如 "移除 system() 呼叫，使用參數化 API"） |
| **References** | 相關文件連結 |

### 2. 品質係數（Quality Multiplier）

- **0.8x**（低品質）：缺少 PoC、影響描述不完整
- **1.0x**（良好）：有完整 PoC、影響描述、CVSS
- **1.2x**（卓越）：以上 + 詳細修補建議、影響範圍清晰

### 3. 常見報告錯誤

| 錯誤 | 修正 |
|---|---|
| 缺少 PoC | 加入 `curl` 指令或 Burp Repeater 步驟 |
| 影響描述模糊 | 明確說明「攻擊者可執行任意命令」或「資料外洩」 |
| 缺少 CVSS | 引用官方 CVSS 向量 |
| 語氣太主觀 | 使用「發現」、「驗證」、「修補」等專業動詞 |

### 4. 提交流程

1. **撰寫報告**（使用模板）
2. **自查**（對照 check-list）：PoC、影響、CVSS、修補建議
3. **提交**（Email/portal）：附上報告、PoC 連結、CVSS 評分
4. **等待評審**（通常 3-7 天）：如果被拒，根據反饋修改並重新提交

---

## 為什麼會這樣：報告品質與獎金關聯

Google VRP 明確指出：
- **RCE** 是最高風險類別（S0），基礎獎金 $101,010
- **品質係數** 直接乘以獎金：0.8x / 1.0x / 1.2x
- **PoC 完整性** 是 1.2x 的關鍵——沒有 PoC 只能得到 0.8x

因此，報告的每一個要素都直接影響最終金額。

---

## 自我檢查（這篇重點：你能寫出完整報告嗎？）

- [ ] 報告包含 Title、Summary、Steps、Expected、Actual、Impact、CVSS、Remediation
- [ ] 品質係數明確（0.8x / 1.0x / 1.2x）且理由清晰
- [ ] PoC 包含可複製的 curl/Burp 指令
- [ ] CVSS 3.1 向量已列出
- [ ] 修補建議具體（例如「使用參數化 API」而非「修復」）
- [ ] 語言為 zh-TW（或 en 對應）且結構完整

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [OWASP Report Writing Guide](https://owasp.org/www-community/guides/reporting-a-software-vulnerability)
- [CVSS 3.1 Specification](https://www.first.org/disclaimer/cvss-3-1)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)

---

*這篇是系列 6（報告與分類），前面：工作台（3）、XSS/IDOR（4）、RCE（5）。下一篇：Top Payouts Fact Check（13）。*