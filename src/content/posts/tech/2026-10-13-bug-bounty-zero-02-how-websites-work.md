---
title: "Bug Bounty 規則怎麼讀：Scope、Rewards、Exclusions 與品質係數的完整對照表"
date: 2026-10-13
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, rules, scope, rewards, quality-multiplier]
lang: zh-TW
description: "系列 1：如何快速讀懂任何 Bug Bounty 計畫的規則文件，準確劃分合法測試範圍、獎金結構與禁止事項。"
tldr: "Bug Bounty 規則文件看似冗長，實際只有四大區塊：Scope（合法測試範圍）、Rewards（獎金結構與品質係數）、Exclusions（禁止事項）、Report Quality（報告品質標準）。這篇教你 30 分鐘內掌握關鍵數字，避免測錯目標、報告被拒、獎金被打折。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 1
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en)

## TL;DR

**規則文件只有四大區塊：Scope（in-scope/out-of-scope 列表）、Rewards（嚴重度對應金額 + 品質係數）、Exclusions（禁止測試項目）、Report Quality（報告品質評分標準）。** 這篇教你用關鍵字快速定位（Ctrl+F 搜尋 `in-scope`、`reward`、`exclude`、`quality`），並列出 Google VRP、Meta、Microsoft MSRC 三大廠商的關鍵差異表——直接決定你的報告能不能拿到 $121,212（T0 S0 RCE + 1.2x）或是被打折到 $80,808（0.8x）。

---

## 情境

你註冊了一個新的 Bug Bounty 計畫（例如 Apple、GitHub、Cloudflare）。頁面上有一份 2000 字的規則文件。你沒時間逐字閱讀，但如果誤測 out-of-scope 的端點，帳號可能被封禁；如果漏看品質係數，同一個 RCE 拿到的獎金可能差出 $40,000。

---

## 問題

**1. Scope 看不懂：哪些網域可以測，哪些不能？** 很多計畫用萬用字元（`*.google.com`）、排除字元（`!api.google.com`）、甚至指定路徑（`/v1/*`）。不熟悉這些語法，容易測到不該測的地方。

**2. Rewards 沒對齊：同一個 RCE，為什麼 Google 是 $101,010，Meta 是 $300,000，Microsoft Hyper-V 是 $250,000？** 不同廠商的分級邏輯不同：Google 用 Tier（T0-T3b）+ Severity（S0-S4），Meta 用攻擊面（TEE code execution / VM escape / persistence），Microsoft 用 Layer（L1/L2）+ Quality。

**3. Exclusions 漏看：社交工程、DoS、第三方服務、實體攻擊** 通常是隱性禁止項目。有些計畫甚至把「自動化掃描超過 QPS 限制」列為禁止，觸犯即封號。

**4. Report Quality 不知道怎麼寫高品質報告** Google 明確給出 0.8x / 1.0x / 1.2x 的標準，但許多新手不知道什麼叫「完整的重現步驟」與「影響評估」。

---

## 解決方案：四步讀懂規則

### 步驟 1：Scope——關鍵字搜尋與語法對照

| 語法 | 意義 | 例子 | 可測試？ |
|---|---|---|---|
| `*.example.com` | 所有子網域 | `app.example.com`、`api.example.com` | ✅ 是 |
| `example.com` | 僅根網域 | `example.com` | ✅ 是 |
| `!api.example.com` | 排除特定子網域 | `api.example.com` | ❌ 否 |
| `/v1/*` | 路徑前綴限制 | `/v1/users`、`/v1/orders` | ✅ 是（限路徑） |
| `*.example.com/*` | 全路徑 | 所有路徑 | ✅ 是 |

**實作檢查清單**：
- [ ] 搜尋 `in-scope`，複製所有網域到你的測試清單
- [ ] 搜尋 `out-of-scope` 或 `exclude`，標記禁止測試的網域/路徑
- [ ] 確認是否有「需受邀才能測試」的項目（如 Meta Private Processing）
- [ ] 確認是否有 QPS/速率限制（例如 GitHub：每 IP 每分鐘 60 requests）

### 步驟 2：Rewards——三大廠商關鍵差異表（2026 快照）

| 嚴重度 / 類型 | Google VRP | Meta (Private Processing) | Microsoft (Hyper-V) |
|---|---|---|---|
| **RCE / Code Execution** | T0/S0: $101,010<br>T1: $101,010<br>T2: $75,000<br>品質係數: 0.8x/1.0x/1.2x | External: $300,000<br>Internal: $50,000<br>VM escape: N/A | L1 (guest→host): $250,000<br>L2 (guest→guest): $150,000<br>品質係數: 1.0x/0.5x/0.25x |
| **Info Disclosure** | T2: $13,337–$31,337 | External: $150,000<br>Internal: $50,000 | L1 info: $50,000<br>L2 info: $25,000 |
| **XSS / Client-side** | T2: $3,133–$13,337 | External: $10,000 | 不適用（專注 VM/超視電腦） |
| **DoS** | 通常不給獎金 | 不給獎金 | $15,000 / $10,000 / $5,000 |
| **最高單一獎金** | $151,515（$101,010 × 1.5，2024 年公告） | $300,000（TEE code execution） | $250,000（L1 guest escape） |

**關鍵洞察**：
- Google 的「品質係數」直接乘在基礎獎金上 → 報告品質 = 金額
- Meta 區分 External vs Internal scenarios，Internal 獎金通常只有 External 的 1/6
- Microsoft Hyper-V 有 Layer 概念（L1/L2），且品質係數是 1.0/0.5/0.25（非 1.2/1.0/0.8）

### 步驟 3：Exclusions——常見禁止項目速查

| 類別 | 典型禁止行為 | 風險 |
|---|---|---|
| **社交工程** | 钓鱼、伪装客服、诱导员工点击 | 封号、法律责任 |
| **DoS / 压力测试** | 故意耗尽资源、超出 QPS 限制 | 封号、服务影响 |
| **第三方服务** | 攻击 CDN、WAF、身份提供商 | Out-of-scope、不予赏金 |
| **实体攻击** | 硬件篡改、现场入侵 | 法律责任 |
| **自动化扫描** | 未经授权的爬虫、暴力破解 | 封号、IP 封锁 |
| **数据窃取** | 下载超过验证所需的真实用户数据 | 封号、法律责任 |

**檢查技巧**：Ctrl+F 搜尋 `prohibited`、`forbidden`、`not allowed`、`exclude`、`social engineering`、`denial of service`。

### 步驟 4：Report Quality——如何從 0.8x 升到 1.2x

Google VRP 明確定義：

| 品質等級 | 係數 | 條件 |
|---|---|---|
| **Low** | 0.8x | 缺少重現步驟、無 PoC、影響描述模糊、無 CVSS |
| **Good** | 1.0x | 完整重現步驟、有 PoC、影響描述清晰、有 CVSS |
| **Exceptional** | 1.2x | Good 條件 + 提供修補建議、詳細影響量化、自動化腳本、視覺化證據 |

**快速自檢**：你的報告是否包含？
- [ ] 可直接複製執行的 `curl` 指令或 Burp Repeater 序列
- [ ] 具體影響：洩漏多少筆資料、哪些 PII、金額估算
- [ ] CVSS 3.1 向量字串（例如 `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N`）
- [ ] 修補建議（程式碼層級或配置層級）

---

## 為什麼會這樣：VRP 獎金結構的設計邏輯

1. **Scope 定義攻擊面**：廠商只願意為自己控制的系統付費
2. **Rewards 反映業務風險**：核心服務（Google T0：帳號系統、身份驗證）風險最高 → 獎金最高
3. **Quality multiplier 激勵完整報告**：評審時間成本高，完整報告節省分流時間
4. **Exclusions 保護第三方與用戶**：避免獵人為了獎金傷害無關對象

---

## 自我檢查（這篇的重點：規則讀懂了嗎？）

- [ ] 你能在 5 分鐘內找出一個新計畫的 in-scope 網域列表
- [ ] 你能說出 Google T0 S0 RCE 的基礎獎金（$101,010）與最高可能獎金（$121,212）
- [ ] 你能列出 Meta External vs Internal 的獎金差異（6 倍）
- [ ] 你知道什麼是「品質係數 1.2x」需要的四個條件
- [ ] 你已經把目標計畫的 Exclusions 列表存檔，測試前會確認

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 In Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Scope](https://bugbounty.meta.com/scope/)
- [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Microsoft MSRC Bounty Overview](https://www.microsoft.com/en-us/msrc/bounty)

---

*這篇是系列 1（規則），下一篇：系列 2「網站運作原理：從請求到回應」→ 理解 HTTP、TLS、Cookie、Session 才能在系列 3 工作台真正動手。*