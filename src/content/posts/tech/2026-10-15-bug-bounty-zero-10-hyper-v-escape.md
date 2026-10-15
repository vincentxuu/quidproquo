---
title: "Hyper-V Escape：突破超視電腦的安全界限" 2026-10-15
category: tech
type: guide
difficulty: advanced
tags: [bug-bounty, security, hyper-v, virtualization, escape, vulnerability]
lang: zh-TW
description: "Series 10：深入探討如何突破 Microsoft Hyper-V（Type 1 hypervisor）的限制，達到 guest 控制 host 並執行任意指令的影響。"
tldr: "Hyper-V Escape 利用超視電腦的虛擬化特性，突破安全沙箱，達到 RCE。Google VRP 最高獎金 $121,212。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 10
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-10-hyper-v-escape-en)

## TL;DR

**Hyper-V Escape 是突破 Microsoft Hyper-V 安全控制的漏洞**。本篇解析：
- Hyper-V 的架構與安全邊界（Partition、VMBus、vPCIe）
- Escape 攻擊向量：Hypercall / VMX 控制字、內核保護、記憶體映射
- Google VRP 獎金：$101,010 × 1.2x = $121,212
- 報告寫作：PoC、影響、修補建議

---

## 情境

你正在研究系統層面的漏洞。Hyper-V Escape 是一種極難發現且獎金極高的漏洞，直接影響到「超視電腦」（Type 1 hypervisor）的安全界限。本篇解釋下列概念：
- Hyper-V 中的 Partition、VMBus、vPCIe
- Escape 的基本原理（Hypercall、VMX 控制字、內核保護、記憶體映射）
- Google VRP 的獎金結構
- 報告撰寫要點

即使你不直接測試 Hyper-V Escape，理解其原理也有助於撰寫更全面的漏洞報告。

---

## 問題

**錯誤 1：** 認為 Hyper-V Escape 僅限於「內部網路」測試，但 Google VRP 已將其列為最高獎金類別之一。任何有漏洞的 Hyper-V 環境（Cloud、Azure、Azure Stack、Hyper-V Server）都可能存在此漏洞。

**錯誤 2：** 不理解「Hyper-V Partition」的概念（Root Partition、Child Partition），無法描述 VM Escape 可能產生的影響（例如：能否改寫 Root Partition 中的 VMBus 或 vPCIe）。

**錯誤 3：** 報告只寫「發現 Hyper-V Escape」而沒有 PoC，讓獎金直接打折到 0.8x → $80,808。

---

## 解決方案：Hyper-V 架構 + Escape 攻擊 + 報告

### 1. Hyper-V 架構

| 結構 | 功能 | 風險點 |
|---|---|---|
| **Partition** | 虛擬機器之間的隔離容器 | Root Partition（Hyper-V 管理器）、Child Partition（客戶 VM） |
| **VMBus** | Hyper-V 客戶 VM 與 Hyper-V 管理器之間的通訊協定 | Escape 後可控制 Hyper-V 的 vGPU、網路、記憶體 |
| **vPCIe** | 虛擬 PCI Express，映射 guest 硬件至 host 的管道 | 擷取資訊、注入惡意虛擬硬件 |

### 2. Escape 攻擊向量

| 向量 | 描述 | 影響 |
|---|---|---|
| **Hypercall 濫用** | 利用客戶 VM 向 Hyper-V 發送 Hypercall，但未通過安全檢查 | RCE、權限提升、資料竊取 |
| **VMX 控制字操縱** | 讀取或寫入 VMX 控制字以擷取控制權 | 控制整個 Hyper-V 環境 |
| **內核保護 Bypass** | 繞過 Hyper-V 的內核保護機制 | 讀取/修改 host 記憶體 |
| **記憶體映射 Exploit** | 將 guest 記憶體映射到 Hyper-V 地址空間 | RCE / 權限提升 |

### 3. Google VRP 獎金分配

| 等級 | 基礎獎金 | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **Hyper-V Escape (T0)** | $101,010 | $80,808 | $101,010 | $121,212 |
| **Hyper-V Escape (T1)** | $63,267 | $50,613 | $63,267 | $75,920 |
| **Hyper-V Escape (T2)** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

> **重要**：Hyper-V Escape 是最高獎金類別之一（S0），但多數計畫限制直接測試。若計畫明確禁止測試，或僅允許本地測試，請遵守規則。

### 4. 報告寫作要點

| 章節 | 內容 |
|---|---|
| **Title** | `Target – Hyper-V Escape vulnerability` |
| **Summary** | `Hyper-V Escape 能讓 guest VM 控制 Hyper-V hypervisor，達到 RCE` |
| **Steps to Reproduce** | 1. 建立特定 Hyper-V 配置 2. 向 Hyper-V 發送惡意 Hypercall 3. 觀察 Root Partition 行為變化 4. 結果分析 |
| **Impact** | `攻擊者可完全控制 Hyper-V 管理器，並進一步控制所有 VM、讀取/寫入 host 記憶體` |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | `加強 Hypercall 驗證、修改 VMX 控制字邏輯、套用 Hyper-V 更新、部署安全修正` |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/)、[Microsoft Hyper-V 安全更新](https://msrc.microsoft.com/) |

---

## 為什麼會這樣：Google VRP 為什麼賞高 Hyper-V Escape？

1. **Hyper-V 控制權提升**：Hyper-V 是許多雲端、Azure 環境的基礎，一旦控制權被奪走，即可控制整個雲端基礎設施
2. **安全沙箱破壞**：Hyper-V 核心被認為安全防禦嚴密，Escape 能突破防禦、到達 host 記憶體
3. **難度極高**：需要深入理解 Hyper-V 內部設計、VMX 控制字等，獎金極高以激勵研究

**例子**：同個 Hyper-V Escape 漏洞，
- 報告品質 0.8x → $101,010 × 0.8 = $80,808
- 報告品質 1.2x → $101,010 × 1.2 = $121,212

---

## 自我檢查（這篇重點：你了解 Hyper-V Escape 嗎？）

- [ ] 你能說出 Hyper-V 中的「Partition」、「VMBus」、「vPCIe」含義
- [ ] 你知道 Hyper-V Escape 四種主要攻擊向量（Hypercall 濫用、VMX 控制字操縱、內核保護 Bypass、記憶體映射 Exploit）
- [ ] 你知道 Google VRP 的 Hyper-V Escape 基礎獎金（$101,010）與最高獎金（$121,212）
- [ ] 你知道為什麼 95% 的 Bug Bounty 計畫不允許直接測試 Hyper-V
- [ ] 你知道報告需要包含 PoC、影響、修補建議方可達到 1.2x

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Microsoft Hyper-V Security](https://msrc.microsoft.com/)
- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities)

---

*這篇是系列 10（Hyper-V Escape），前面：VM（9）、Buffer Overflow（8）；後面：TEE（11）、AI 時代（12）。*
---
