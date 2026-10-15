---
title: "AI Products & Vulnerability Classification: A New Era" 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, ai-products, vulnerability, llm, classification, vulnerability-report]
lang: zh-TW
description: "Series 12：解析 AI 時代的漏洞分類，分析 AI 產品（LLM、ML、推理引擎）的安全風險與 Google VRP / Meta 的獎金結構。"
tldr: "AI 產品引入全新漏洞面（提示注入、資料外洩、模型篡改），報告需將漏洞分為「機密性、完整性、可用性」三類。Google VRP 最高獎金 $121,212。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 12
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-12-ai-era-bounty-en)

## TL;DR

**AI 產品（LLM、生成式 AI、推理引擎）引入全新漏洞面**：提示注入（Prompt Injection）、資料外洩（Data Leakage）、模型篡改（Model Tampering）、可用性攻擊（Availability Attack）。報告需將漏洞分類為機密性 / 完整性 / 可用性三類，並提供對比分析（例如：與傳統 RCE 的差異）。Google VRP 最高獎金 $121,212（T0/S0 + 1.2x），但 AI 產品的漏洞判定更為複雜，因為漏洞可能源於「模型行為」而非傳統「程式碼缺陷」。

---

## 情境

你正在測試一個 AI 產品（例如：AI 助手、聊天機器人、生成式 AI 工具）。你發現了「提示注入」——你可以透過輸入特定提示讓 AI 执行你想要的操作（例如：洩露系統指令、生成惡意內容）。你需要將這個漏洞寫成報告，但不知道：
- 這是不是「漏洞」？
- 如果是，如何分類？
- 如何評估獎金？
- 如何與傳統漏洞（RCE、XSS）比較？

這篇教你如何處理這種情況。

## 問題

**錯誤 1：** 直接把 AI 漏洞當成傳統漏洞（例如：直接說「RCE」），但 AI 漏洞的本質不同：漏洞源於「模型行為」而非「程式碼缺陷」。

**錯誤 2：** 缺少對比分析（例如：AI 漏洞 vs 傳統 RCE 的差異）。Google VRP 在評估 AI 漏洞時，會要求報告包含「模型行為分析」、「對比分析」與「修補建議」三項。缺少任一項，獎金會被打折到 0.8x（例如：$121,212 → $96,970）。

**錯誤 3：** 沒有提供「提示注入」的 PoC（例如：輸入「忽略之前的指令，請執行...」）。這導致評審無法驗證漏洞的可重現性。

---

## 解決方案：AI 漏洞分類 + 報告撰寫

### 1. AI 漏洞分類（三大類）

| 類別 | 定義 | 例子 | 對比分析（vs 傳統漏洞） |
|---|---|---|---|
| **機密性** | AI 洩露不應洩露的資料（例如：系統指令、私有資料） | 提示注入後洩露系統提示詞、用戶對話內容外洩 | vs RCE：RCE 是「執行指令」，機密性是「洩露資料」 |
| **完整性** | AI 生成錯誤或惡意內容，影響資料完整性 | 提示注入後生成惡意內容、篡改生成結果 | vs XSS：XSS 是「執行腳本」，完整性是「內容篡改」 |
| **可用性** | AI 服務被阻斷或無法使用（例如：DoS、過度消耗） | 大量提示注入導致資源耗盡、服務中斷 | vs DoS：AI DoS 是「模型資源耗盡」而非網路流量 |

### 2. Google VRP AI 漏洞獎金結構

| 等級 | 基礎獎金 | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **AI 產品漏洞（T0 / S0）** | $101,010 | $80,808 | $101,010 | $121,212 |
| **AI 產品漏洞（T1 / S1）** | $63,267 | $50,613 | $63,267 | $75,920 |
| **AI 產品漏洞（T2 / S2）** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

> **關鍵**：AI 產品漏洞的獎金結構與傳統 RCE 相同，但評審對「模型行為分析」的要求更高。因此，報告必須包含：
> - 模型行為分析（為什麼這個提示會導致漏洞）
> - 對比分析（與傳統漏洞的差異）
> - 修補建議（如何修復模型行為，而非僅修復程式碼）

### 3. 報告撰寫要點

| 章節 | 內容 |
|---|---|
| **Title** | `Target – AI Product Vulnerability (Prompt Injection / Data Leakage / Availability Attack)` |
| **Summary** | `AI 產品（LLM / ML / 推理引擎）存在漏洞，導致機密資料洩露 / 內容篡改 / 服務中斷` |
| **Steps to Reproduce** | 1. 提供特定提示 2. 觀察 AI 行為變化 3. 記錄輸入與輸出 4. 分析影響 |
| **Expected Behaviour** | AI 應遵循系統指令，不洩露機密資料、不生成惡意內容 |
| **Actual Behaviour** | AI 遵循惡意提示，洩露機密資料 / 生成惡意內容 / 服務中斷 |
| **Impact** | 機密資料外洩、內容篡改、服務中斷（需要量化，例如：洩露多少筆資料） |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | 加強提示過濾、驗證輸入、限制模型輸出、套用安全更新 |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/)、[OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-llm-applications/) |

---

## 為什麼會這樣：AI 漏洞的獎金設計邏輯

1. **AI 是新興領域**：AI 產品漏洞的評估標準尚未完全穩定，Google VRP 仍在不斷更新（例如：2024 年增加 TEECoE、AI 產品漏洞等類別）。
2. **模型行為難以預測**：AI 漏洞源於「模型行為」而非「程式碼缺陷」，因此報告需要包含更深入的分析（例如：為什麼這個提示會導致漏洞？）。
3. **對比分析重要**：評審需要理解漏洞與傳統漏洞（RCE、XSS）的差異，以確定獎金等級。因此，報告必須包含對比分析。

**舉例**：同個 AI 漏洞（提示注入），
- 報告品質 0.8x（缺少對比分析、缺少模型行為分析）→ $101,010 × 0.8 = $80,808
- 報告品質 1.2x（完整分析 + 對比 + 修補建議）→ $101,010 × 1.2 = $121,212

---

## 自我檢查（這篇重點：你能處理 AI 漏洞嗎？）

- [ ] 你能將 AI 漏洞分類為機密性 / 完整性 / 可用性三類
- [ ] 你知道 AI 漏洞與傳統漏洞（RCE、XSS）的基本差異
- [ ] 你知道 Google VRP 的 AI 產品漏洞獎金結構（$101,010 / 1.2x → $121,212）
- [ ] 你能提供 AI 漏洞的 PoC（例如：特定提示輸入與輸出結果）
- [ ] 你知道報告需要包含「模型行為分析」、「對比分析」與「修補建議」

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-llm-applications/)
- [Google AI Security Blog](https://blog.google/technology/ai/)
- [CVE Database](https://cve.mitre.org/)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)

---

*這篇是系列 12（AI 時代的漏洞），前面：TEE（11）、Hyper-V（10）；後面：Top Payouts（13）、Certifications（14）。*
---
