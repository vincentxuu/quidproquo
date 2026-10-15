---
title: "VM and Hypervisor: From Virtual Machines to Security Boundaries"
date: 2026-10-15
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, virtualization, hypervisor, vmware, virtualbox, kvm]
lang: zh-TW
description: "Series 9：解析虛擬機與 hypervisor 的運作機制，分析 VM Escape 這類高危漏洞的攻擊面與 Google VRP 獎金結構。"
tldr: "虛擬機使用 hypervisor 進行資源抽象；VM Escape 能讓攻擊者從 guest 操縱 host，Google VRP 最高獎金 $121,212（T0/S0 + 1.2x）。本篇解釋架構、攻擊向量與報告寫作。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 9
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-09-vm-and-hypervisor-en)

## TL;DR

**虛擬機使用 hypervisor 進行資源抽象，VM Escape 能讓攻擊者從 guest 脫離並控制 host** — 這是一種極高風險的漏洞。本篇解析：
- hypervisor 架構：Type 1 (bare-metal) vs Type 2 (hosted)
- VM Escape 攻擊向量：釐值分配、記憶體破壞、I/O 口徑
- Google VRP 獎金：T0 RCE $101,010 / 1.2x → $121,212
- 報告結構：PoC、影響、修補建議

---

## 情境

你正在研究虛擬化安全問題。雖然大多數 bug bounty 計畫不允許直接測試 hypervisor（通常是內部系統），但了解 VM Escape 的運作原理有助於：
1. 認證攻擊面與潛在風險
2. 理解 Google VRP 對此類漏洞的獎金邏輯
3. 撰寫完整報告時納入「影響評估」與「修補建議」

即使你不直接測試這類漏洞，知識也是提升報告深度的關鍵。

---

## 問題

**錯誤 1：** 認為 VM Escape 只能在「擁有 hypervisor 完整存取權」的實驗室環境出現，但 Google VRP 已在 2024 年公告中列為最高獎金類別之一，直接在目標計畫中搜尋「VM escape」或「hypervisor」關鍵字。

**錯誤 2：** 不了解 hypervisor 的三種模式（Type 1 / Type 2 / Type 3），無法正確描述漏洞發生的上下文（例如：是平台即服務、內嵌式虛擬化還是雲端分割）。

**錯誤 3：** 報告只寫「發現 VM Escape」而沒有 PoC 或影響分析。這會直接觸發 0.8x 品質係數，將 $101,010 降至 $80,808。

---

## 解決方案：VM 架構 + 攻擊向量 + 報告

### 1. Hypervisor 架構（Type 1 / Type 2 / Type 3）

| 模式 | 說明 | 例子 | 風險層級 |
|---|---|---|---|
| **Type 1 (Bare-metal)** | hypervisor 直接運行在硬體上 | VMware ESXi、Microsoft Hyper-V、KVM | 高（直接操控硬體） |
| **Type 2 (Hosted)** | hypervisor 運行在作業系統上方 | Oracle VirtualBox、VMware Workstation | 中（需要先破壞主機） |
| **Type 3 (Hybrid)** | 應用層 hypervisor | Docker、KVM (部分實作) | 視實作而定 |

> ⚠️ 超過 95% 的 Bug Bounty 計畫不允許直接測試 hypervisor，但了解架構對撰寫高品質報告極具幫助。

### 2. VM Escape 攻擊向量

| 向量 | 描述 | 影響 |
|---|---|---|
| **記憶體破壞** | 利用 guest 記憶體管理缺陷，寫入或讀取 hypervisor 記憶體 | RCE / 權限提升 |
| **I/O 口徑濫用** | 激活未受保護的硬體裝置（如 UART、PCIe） | 執行任意代碼或讀取敏感資料 |
| **緩衝區溢出** | 在 guest OS 中利用不安全函式，破壞 hypervisor 結構 | RCE / 服務中斷 |
| **邏輯錯誤** | hypervisor 運算邏輯未驗證邊界 | 權限提升或資料竊取 |

### 3. Google VRP 獎金分配（2024）

| 等級 | 基礎獎金 | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **VM Escape (T0)** | $101,010 | $80,808 | $101,010 | $121,212 |
| **VM Escape (T1)** | $63,267 | $50,613 | $63,267 | $75,920 |
| **VM Escape (T2)** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

> **關鍵**：VM Escape 是最高風險類別之一（S0），但許多計畫限制測試。若程式碼中明確標示「僅限本地測試」或「hypervisor 不在 Scope」，請遵守規則。

### 4. 報告寫作要點

| 章節 | 內容 |
|---|---|
| **Title** | `Target – VM Escape vulnerability` |
| **Summary** | `Guest 能透過特定 I/O 操作 脫離 hypervisor 並控制 host` |
| **Steps to Reproduce** | 1. 建立特定 guest VM 2. 執行惡意 I/O 指令 3. 觀察 host 行為變化 4. 結果分析 |
| **Impact** | `攻擊者可完全控制 host 操作系統、讀取/寫入所有 VM 記憶體、橫向移動至其他 VM` |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | `加強記憶體隔離、驗證 I/O 存取、更新 hypervisor 版本、套用安全公告` |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/)、[hypervisor security advisories](https://www.cisa.gov/known-exploited-vulnerabilities) |

---

## 為什麼會這樣：Google VRP 為什麼賞高 VM Escape？

1. **完全控制 host**：一旦攻擊者控制 host，即可讀取所有 VM 的記憶體、安裝後門、橫向移動至其他 VM——影響極大
2. **虛擬化普及**：雲端服務、SaaS、企業內部系統廣泛使用虛擬化，風險成本極高
3. **難度極高**：需要極深入的 hypervisor 知識，故獎金極高以激勵研究

**舉例**：同個 VM Escape 漏洞，
- 報告品質 0.8x → $101,010 × 0.8 = $80,808
- 報告品質 1.2x → $101,010 × 1.2 = $121,212

---

## 自我檢查（這篇重點：你了解 VM Escape 嗎？）

- [ ] 你能說出 Type 1 / Type 2 / Type 3 hypervisor 的差異
- [ ] 你知道 VM Escape 的四種主要攻擊向量（記憶體破壞、I/O 濫用、緩衝區溢出、邏輯錯誤）
- [ ] 你知道 Google VRP 的 VM Escape 基礎獎金（$101,010）與最高獎金（$121,212）
- [ ] 你知道為什麼 95% 的 Bug Bounty 計畫不允許直接測試 hypervisor
- [ ] 你知道報告需要包含 PoC、影響、修補建議方可達到 1.2x

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities)
- [OWASP Virtualization Security](https://owasp.org/www-community/virtualization_security)

---

*這篇是系列 9（VM 与 hypervisor），前面：記憶體（7）、Buffer Overflow（8）；後面：Hyper-V Escape（10），TEE（11）。*