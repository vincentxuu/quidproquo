---
title: "TEE（可信執行環境）：從原理到機會" 2026-10-15
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, tee, confidential-computing, intel-sgx, amd-sev, vulnerability]
lang: zh-TW
description: "Series 11：深入探討可信執行環境（TEE）的運作機制，分析 Google VRP 中最高獎金類別之一的獎金結構。"
tldr: "TEE 是 CPU 提供的硬件級安全沙箱，Google VRP 中最高獎金 $300,000（TEECoE）。本篇解釋 Intel SGX、AMD SEV、Intel TDX 架構、攻擊向量與報告撰寫。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 11
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-11-tee-confidential-en)

## TL;DR

**TEE（Trusted Execution Environment，可信執行環境）是 CPU 提供的硬件級安全沙箱**，Google VRP 中最高獎金 $300,000（TEECoE）。本篇解析 TEE 的運作機制、Intel SGX、AMD SEV、Intel TDX、Google VRP 獎金與報告撰寫。

---

## 情境

你已經熟悉了前 10 篇，了解 RCE、堆疊溢出、VM Escape 等漏洞。現在你想要測試更高層次的問題：**TEE**。TEE 是 CPU 提供的硬件級安全沙箱，可讓應用程式在受保護的環境中運行，即使是作業系統 root 也無法讀取或修改。其中的安全漏洞通常會觸發 Google VRP 中的最高獎金等級（$300,000）。

本篇將帶你一條條地了解 TEE 的原理，分析 Intel SGX、AMD SEV、Intel TDX 的設計，並提供報告撰寫要點。

---

## 問題

**錯誤 1：** 認為 TEE 安全性很高，漏洞很難找到，但 Google VRP 已將其列為最高獎金類別之一（$300,000）。許多計畫的 Scope 明確允許測試 TEE 漏洞，例如「Intel SGX」、「Confidential Computing」等。

**錯誤 2：** 不理解 TEE 當中「Enclave」的概念、Enclave 如何存取記憶體與外設（例如：Memory Encryption、Encrypted I/O），無法正確描述漏洞的影響（例如：能否竊取 Enclave 中的資料？能否劫持 Enclave 中執行的機密運算？）。

**錯誤 3：** 報告只寫「發現 TEE 漏洞」而沒有 PoC，Google VRP 品質係數直接打折：$300,000 × 0.8x = $240,000 或 × 1.2x = $360,000。不同而報告品質會讓獎金差額達 $120,000。

---

## 解決方案：TEE 架構 + 獎金 + 報告

### 1. TEE 基礎

| 技術 | 功能 | 供應商 | 獎金類別 |
|---|---|---|---|
| **Intel SGX** | 提供硬件隔離的「Enclave」，保護記憶體與程式碼 | Intel | TEECoE ($300,000) |
| **AMD SEV** | 加密整個 VM 記憶體，提供虛擬化安全保障 | AMD | TEECoE ($300,000) |
| **Intel TDX** | 提供「可信虛擬化」，客戶端可以信任虛擬機 | Intel | TEECoE ($300,000) |

**Enclave**：TEEs 中最小的安全容器，內含程式碼、記憶體與狀態。即使作業系統 root 或惡意虛擬機也不能存取。

### 2. 攻擊向量

| 向量 | 描述 | 影響 |
|---|---|---|
| **Enclave 內容竊取** | 劫持 Enclave 內的秘密資料（例如：金鑰、密碼） | 機密資料外洩 |
| **Enclave 程式碼劫持** | 取代 Enclave 內執行的程式碼（例如：偽造 API） | 邏輯漏洞、遠端程式執行 |
| **Enclave 執行狀態竊取** | 竊取 Enclave 的執行狀態（例如：資料、快取） | 資料外洩、隱私侵犯 |
| **Enclave 間通信** | 劫持 Enclave 間通信，竊取 Enclave 間溝通的資料 | 資料竊取、偽造操作 |

### 3. Google VRP 獎金分配（2024）

| 等級 | 基礎獎金 | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **TEECoE（最高獎金）** | $300,000 | $240,000 | $300,000 | $360,000 |
| **TEECoE（一般）** | $100,000 | $80,000 | $100,000 | $120,000 |

> **重要**：TEE 漏洞通常是 Google VRP 中最高的獎金類別之一，但許多計畫限制直接測試。例如：「Intel SGX」的 Scope 通常只允許「安全測試」，禁止影響客戶端資料。

### 4. 報告撰寫要點

| 章節 | 內容 |
|---|---|
| **Title** | `Target – TEE (Intel SGX / AMD SEV / Intel TDX) vulnerability` |
| **Summary** | `TEE (Intel SGX / AMD SEV / Intel TDX) Enclave 中的資料/程式碼被竊取` |
| **Steps to Reproduce** | 1. 建立特定 TEE 環境（例如：SGX Enclave）2. 執行惡意程式碼 3. 觀察 Enclave 行為變化 4. 結果分析 |
| **Impact** | `攻擊者能竊取 Enclave 中的機密資料、劫持 Enclave 執行的程式碼、影響 Enclave 執行狀態` |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | `加強 Enclave 保護、加密記憶體、驗證 Enclave 來源、套用安全更新` |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/)、[Intel SGX 安全更新](https://www.intel.com/security) |

---

## 為什麼會這樣：Google VRP 為什麼賞高 TEE？

1. **機密運算核心**：TEE 是客戶端機密運算的基礎，一旦被破壞，可能導致密碼、加密金鑰等機密資料外洩
2. **信任基礎**：客戶端依賴 TEE 來確保運算安全，一旦被破壞，可能導致客戶端完全喪失信任
3. **難度極高**：需要深入理解 TEE 技術（例如：SGX、SEV）、CPU 底層、虛擬化等，獎金極高以激勵研究

**舉例**：同個 TEE 漏洞，
- 報告品質 0.8x → $300,000 × 0.8 = $240,000
- 報告品質 1.2x → $300,000 × 1.2 = $360,000

獎金差額 $120,000，直接來自報告品質。

---

## 自我檢查（這篇重點：你了解 TEE 嗎？）

- [ ] 你能說出 Intel SGX、AMD SEV、Intel TDX 的差異
- [ ] 你知道 TEE 中「Enclave」的概念（容器、隔離）
- [ ] 你知道 Google VRP 的 TEECoE 基礎獎金（$300,000）與最高獎金（$360,000）
- [ ] 你知道為什麼 95% 的 Bug Bounty 計畫不允許直接測試 TEE
- [ ] 你知道報告需要包含 PoC、影響、修補建議方可達到 1.2x

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Intel SGX Security](https://www.intel.com/security)
- [AMD SEV Security](https://www.amd.com/security)
- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities)

---

*這篇是系列 11（TEE），前面：Hyper-V Escape（10）、Buffer Overflow（8）；後面：AI 時代（12）、Top Payouts（13）、Certifications（14）。*
---
