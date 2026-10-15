---
---
title: "XSS + IDOR：XSS 入侵與身分竊用，為什麼值得獎金" 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, xss, idor, vulnerability]
lang: zh-TW
description: "系列 4：深入探索 XSS 與 IDOR 這兩個最常見、獎金最高的漏洞，分析 Google VRP  payout 規則、測試步驟、重現方法與報告寫作。"
tldr: "這篇解構 XSS（網頁執行未經驗證腳本）與 IDOR（身分竊用）漏洞，分析 Google VRP 最高獎金 ($121,212) 如何分配，並提供可重複的 curl 指令與 Burp Repeater 步驟。」
draft: false
series:
  name: "從零開始的資安獵人"
  order: 4
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-04-xss-and-idor-en)

## TL;DR

**XSS（Cross-Site Scripting）與 IDOR（Insecure Direct Object Reference）是 bug bounty 中最常見、獎金最高的漏洞。** 本篇專門講解這兩種漏洞的攻防原理、Google VRP 獎金結構，並提供兩個可重複的實驗步驟：

- XSS：向伺服器發送 `<script>alert(1)</script>` 或 `<img src=x onerror=alert(1)>` 等，觀察伺服器是否有「載入或執行」行為（XSS 會執行 JS），並計算如將用戶重定向到惡意網站可得多少獎金
- IDOR：利用 `/api/orders/1532` → `/api/orders/1533` 等竊用他人資料，觀察伺服器是否回傳 200 還是 403，Google VRP 中 IDOR 最高可得 $25,000

**針對 Google VRP 獎金表**：XSS 分為高（$7,500）、中（$1,337）、低（$133），IDOR 分為高（$25,000）、中（$10,000）、低（$1,337），品質係數後調整。熟悉這些獎金結構，才能估算自己報告的價值。

---

## 情境

你剛註冊了 bug bounty 計畫，規則寫「出現在的網域中允許測試 XSS 與 IDOR」，並附上了一份完整的 Google VRP 獎金表。但你不知道如何測試？你應該從 localhost 開始，而不是直接對真實目標。「從零開始的資安獵人」系列就是為了解答這個問題而設計：先學怎麼測試，再寫出可重現的 PoC。

---

## 問題

**錯誤 1：XSS 是最常見的漏洞**：XSS 可竊用瀏覽器，竊取 cookie、session、甚至影響其他使用者的安全。Google VRP 獎金分三等：高、中、低，每個等級內又根據品質係數 1.2x/1.0x/0.8x 進一步調整。

**錯誤 2：IDOR 容易忽略**：身分竊用他人資料（例如 order ID），Google VRP 最高可得 $25,000，但許多獵人不會檢查 `Id` 參數，錯過認為「404 沒問題」。

**錯誤 3：報告內容不足**：你只寫「發現 XSS」，沒有步驟與 PoC。這會讓獎金直接打折，例如 $7,500 × 0.8x = $6,000。

---

## 解決方案：XSS 與 IDOR 深入原理 + 測試步驟

### 分類：XSS 與 IDOR 特徵

| 漏洞類型 | 攻擊手法 | 回應信號 | Google VRP 獎金結構 |
|---|---|---|---|
| **XSS** | `<script>alert(1)</script>`、`<img src=x onerror=alert(1)>` 等 | 200（成功）、400/500（失敗） | **高** $7,500 → 0.8x/1.0x/1.2x → $6,000/$7,500/$9,000 |
| **IDOR** | 修改 `id`、`user`、`order` 等參數 | 200（允許）、403（拒絕）、404（不存在） | **高** $25,000 → 0.8x/1.0x/1.2x → $20,000/$25,000/$30,000 |

**關鍵**：
- XSS 需找到可執行或回傳腳本的注入點，例如 DOM XSS（`document.location.href='http://evil.com'`）、Attribute XSS（`<img src=x onerror='alert(1)'>`）、Body XSS（`<script>console.log(document.cookie)</script>`）
- IDOR 需測試敏感端點（例如 `/api/orders/1532`）是否驗證擁有權限，如 `if (order.owner === me)` 判斷為 false → 403

### 攻擊步驟

#### 1. XSS 測試

1. **選擇目標網域**，例如 `*.example.com`
2. **尋找 XSS 測試點**：`search?q=` 搜尋 `example.com` → `/api/search?q=<script>alert(1)</script>`
3. **發出請求**：`curl -X GET 'http://example.com/api/search?q=<script>alert(1)</script>'`
4. **觀察回應**：確認是否回傳未經轉義的 `<script>` 標籤（200 成功）

#### 2. IDOR 測試

1. **選擇目標端點**，例如 `/api/orders/1532`
2. **竊用權限不足的請求**：`curl -X GET 'http-person.example.com/api/orders/1533'`
3. **觀察回應狀態碼**：200 → 允許竊用，403 → 拒絕
4. **確認資料竊用**：確認回傳的資料中包含未歸屬於你的資訊（例如 `address`、`item`）

---

## 為什麼會這樣：Google VRP 獎金設計邏輯

Google VRP 獎金表是 **嚴謹分類**，而非隨便分發。

- **XSS**：分為高（$7,500）、中（$1,337）、低（$133），反映 XSS 風險等級（可執行腳本）。品質係數後調整
- **IDOR**：分為高（$25,000）、中（$10,000）、低（$1,337），反映身分竊用風險等級。品質係數後調整
- **品質係數**：1.2x（卓越）、1.0x（好）、0.8x（一般）。同個漏洞，報告品質不同，獎金不同

**為什麼 XSS 獎金 < IDOR？** XSS 可能導致帳號被盜用、敏感 Cookie 外洩，甚至彈出釣魚頁面（社交工程），因此從寬家風險考量出最高獎金。$25,000 主要因為保護客戶帳號與私人資訊。

---

## 自我檢查（這篇重點：你測試過 XSS / IDOR 嗎？）

- [ ] 你已測試 XSS：為 `example.com/api/search?q=<script>alert(1)</script>` 確認是否有任何未經驗證的腳本執行
- [ ] 你已測試 IDOR：為 `example.com/api/orders/1532` → `1533` 確認是否有身分竊用的機會竊用他人資訊
- [ ] 你能區分 Google VRP 獎金高、中、低等級
- [ ] 你知道「品質係數」對金額的影響
- [ ] 你已寫出 PoC（Proof of Concept），包括完整重現步驟

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)

---

*本篇是系列 4（XSS/IDOR），前面：工作台（3）、網站原理（2）、規則（1）。下一篇：RCE（5）+*
---
