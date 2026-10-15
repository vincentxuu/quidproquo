---
title: "Bug Bounty 最高獎金地圖：手機、瀏覽器、雲端、TEE、AI、加密貨幣各家最高價碼" 2026-10-13
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, rewards, payouts, vrp, google, meta, microsoft, apple, comparison]
lang: zh-TW
description: "系列 13：彙整 Google VRP、Meta、Microsoft、Apple、Mozilla 等主要計畫的最高獎金結構，分析為什麼手機、瀏覽器、雲端隔離、機密運算、AI 產品的頂級獎金能達到百萬美金級。"
tldr: "主要計畫最高單筆：Google VRP $151,515、Meta $300,000、Microsoft $250,000、Apple $1,000,000、Mozilla $100,000。AI 產品、TEE、行動裝置漏洞獎金最高。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 13
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en)

## TL;DR

**彙整主要計畫的頂級獎金結構，讓你看完前 12 篇（Web、記憶體、虛擬機、TEE、AI）後，知道各家最高價碼在付什麼。** 關鍵數字：

| 計畫 | 最高單筆 | 對應漏洞類型 | 備註 |
|---|---|---|---|
| **Google VRP** | $151,515 | RCE (T0/S0) + 1.2x/1.5x | 2024 公告調整 |
| **Meta** | $300,000 | TEE code execution (Private Processing) | External $300k / Internal $50k |
| **Microsoft Hyper-V** | $250,000 | Guest→Host escape (L1) | L2 $150k |
| **Apple** | $1,000,000 | Zero-click RCE with kernel + PCC | iOS/macOS 核心 |
| **Mozilla** | $100,000 | RCE / Sandbox escape | Firefox 離職員工爆料 |

---

## 情境

你已經完成前 12 篇：規則、Web、工作台、XSS/IDOR、RCE、報告、記憶體、溢位、VM、Hyper-V、TEE、AI。現在你想知道：**「到底哪裡能拿到最高獎金？為什麼那些類別獎金最高？」**

這篇把主要計畫的獎金表拆解成可比較的格式，並對照你剛學的漏洞類型（RCE、VM Escape、TEE、AI），幫你建立「獎金 = 風險 × 難度 × 影響」的直覺。

---

## 問題

**錯誤 1：** 只看單一計畫的獎金表，以為 Google 最高，忽略 Meta TEE $300k 或 Apple $1M。

**錯誤 2：** 不知道為什麼手機 RCE（Apple $1M）比伺服器 RCE（Google $151k）貴得多 —— 因為手機是個人最高機密載體，零點擊可觸及所有用戶。

**錯誤 3：** 以為獎金數字是固定的，但 Google VRP 2024 年 7 月公告將最高從 $101,010 調到 $151,515，Meta 也隨 Private Processing 推出新類別。

---

## 解決方案：六大計畫獎金對照表

### 1. Google VRP (Google + Alphabet)

| 等級 | 域名範例 | RCE 基礎 | 最高 (1.2x) | Info Disc 基礎 | XSS 基礎 |
|---|---|---|---|---|---|
| **T0** | `accounts.google.com`、`*.google.com` (核心身份) | $101,010 | $121,212 | $31,337 | $13,337 |
| **T1** | `*.google.com` (其他核心) | $101,010 | $121,212 | $31,337 | $13,337 |
| **T2** | 一般應用 | $75,000 | $90,000 | $13,337 | $7,500 |
| **T3a** | 收購 T0/T1 | $10,000 | $12,000 | $3,133 | $1,333 |
| **T3b** | 其他收購 | $1,337–$5,000 | $1,604–$6,000 | $133–$3,137 | $133–$1,337 |

**關鍵**：2024 年 7 月 Google 公告最高可達 **$151,515**（$101,010 × 1.5，特定條件）。品質係數 0.8x/1.0x/1.2x 直接乘在基礎獎金上。

### 2. Meta (Facebook / Instagram / WhatsApp / Private Processing)

| 類別 | 基礎獎金 | 說明 |
|---|---|---|
| **TEE Code Execution (External)** | $300,000 | Private Processing 環境外部攻擊 |
| **TEE Code Execution (Internal)** | $50,000 | Private Processing 環境內部攻擊 |
| **VM Escape** | N/A | 不在獎金表中 |
| **Persistence** | $10,000 | 持久化漏洞 |
| **Info Disclosure (External)** | $150,000 | 外部資訊洩漏 |
| **Info Disclosure (Internal)** | $50,000 | 內部資訊洩漏 |
| **XSS / Client-side (External)** | $10,000 | 客戶端漏洞 |

> **重點**：Meta 最高是 **TEE Code Execution $300k**，反映 AI/機密運算時代的重心。

### 3. Microsoft Hyper-V (MSRC)

| Layer | 漏洞類型 | 基礎獎金 | 品質係數 |
|---|---|---|---|
| **L1** | Guest → Host escape | $250,000 | 1.0 / 0.5 / 0.25 |
| **L2** | Guest → Guest escape | $150,000 | 同上 |
| **L1 Info** | Host 記憶體洩漏 | $50,000 | 同上 |
| **L2 Info** | Guest 記憶體洩漏 | $25,000 | 同上 |
| **DoS** | 拒絕服務 | $15,000 / $10,000 / $5,000 | 同上 |

**關鍵**：Microsoft 用 **Layer (L1/L2)** 區分，品質係數是 1.0/0.5/0.25（非 1.2/1.0/0.8），報告品質對獎金影響極大。

### 4. Apple Security Bounty

| 類型 | 最高獎金 | 條件 |
|---|---|---|
| **Zero-click RCE + Kernel + PCC** | $1,000,000 | iOS/macOS 零點擊 RCE，需含核心權限 + PCC |
| **Kernel RCE** | $250,000 | 核心權限取得 |
| **Sandbox Escape** | $100,000 | 逃出沙箱 |
| **iCloud / Server RCE** | $100,000 | 雲端服務 RCE |
| **Lockdown Mode Bypass** | $2,000,000 | 特殊模式繞過 (極少見) |

**為什麼最高？** 手機是個人最高機密載體（照片、通訊錄、定位、生物識別），零點擊 RCE 可影響所有用戶，無需使用者互動。

### 5. Mozilla Firefox

| 類型 | 最高獎金 |
|---|---|
| **RCE / Sandbox Escape** | $100,000 |
| **Info Disclosure** | $50,000 |
| **XSS / Client-side** | $20,000 |

**備註**：2024 年有前員工爆料獎金過低導致人才流失，Mozilla 正重新評估。

### 6. 其他值得注意的計畫

| 計畫 | 最高獎金 | 特色 |
|---|---|---|
| **GitHub** | $50,000 | 專注供應鏈、Actions、Codespaces |
| **Cloudflare** | $100,000 | Edge/Workers/D1 相關 |
| **Discord** | $30,000 | 客戶端、API、基礎設施 |
| **Telegram** | $100,000 | MTProto、客戶端、伺服器 |

---

## 為什麼會這樣：獎金結構的底層邏輯

| 決定因素 | 說明 |
|---|---|
| **資產價值** | 手機/瀏覽器 = 數億用戶核心資產 → 最高獎金 |
| **攻擊面難度** | TEE / Hyper-V / Kernel = 極高技術門檻 → 高獎金吸引專家 |
| **影響範圍** | Zero-click > One-click > Local > Remote（需互動） |
| **品質激勵** | Google 1.2x、Meta External/Internal 6x 差、Microsoft 1.0/0.5/0.25 |

**核心公式**：獎金 ≈ 風險等級 × 攻擊難度 × 影響範圍 × 品質係數

---

## 自我檢查（這篇重點：你能對照各家最高獎金嗎？）

- [ ] 你知道 Google VRP 最高 $151,515（T0/S0 RCE + 1.5x 特殊條件）
- [ ] 你知道 Meta 最高 $300,000 是 TEE Code Execution (External)
- [ ] 你知道 Microsoft Hyper-V 最高 $250,000 是 Guest→Host Escape (L1)
- [ ] 你知道 Apple 最高 $1,000,000 是零點擊 RCE + Kernel + PCC
- [ ] 你能說出「為什麼手機 RCE 比伺服器 RCE 貴」的原因
- [ ] 你知道品質係數在不同計畫的差異（Google 1.2x、Meta 6x 差、Microsoft 0.25x 低品質）

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Scope](https://bugbounty.meta.com/scope/)
- [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Apple Security Bounty](https://support.apple.com/security-bounty)
- [Mozilla Bug Bounty](https://bugzilla.mozilla.org/page.cgi?id=security-bug-bounty.html)
- [GitHub Bug Bounty](https://bounty.github.com/)
- [Cloudflare Bug Bounty](https://hackerone.com/cloudflare)

---

*這篇是系列 13（頂級獎金地圖），前面：TEE（11）、AI（12）；後面：Certifications & Learning Map（14）。*
---
