---
title: "Bug Bounty 獵人需要考證照嗎？四篇證照文怎麼讀、本系列 0-11 篇各去哪練" 2026-10-14
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, certification, career, owasp, learning-path]
lang: zh-TW
description: "系列 14：給沒有資安背景、想成為 Bug Bounty 獵人的讀者。三大計畫（Google VRP、Meta、MSRC Hyper-V）都不要求證照；證照對學習路徑與求職有用，不影響提交報告資格。本文標示站內四篇證照文哪段值得讀、哪段可略過，並將系列 0-11 篇對應免費練習資源。"
tldr: "三大計畫規則頁都不要求證照；證照服務於學習路徑與求職。本文標示四篇證照文的「值得讀/可略過」表，並把系列 1-11 篇對應到免費練習平台（PortSwigger、OWASP Juice Shop、Hack The Box 等），最後給三種目標（轉職、好奇、拿賞金）的三個第一步。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 14
---

> 🌏 [English version](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)

## TL;DR

**三大計畫規則頁（Google VRP、Meta、MSRC Hyper-V）我都完整讀過，沒有一個要求證照。** 證照對 Bug Bounty 的作用是「學習路徑」與「求職」，不是「准入門檻」。本文：
1. 逐條列出三大計畫的准入條件
2. 把站內四篇證照文（總覽、AI 證照對決、ROI 拆解、台灣生態系）標記「值得讀 / 可略過」
3. 將本系列 1-11 篇一一對應免費練習資源
4. 依三種目標（轉職、好奇、拿賞金）給出三個第一步

---

## 情境

你讀完前 13 篇，理解了 Bug Bounty 從規則、Web、工具、漏洞類型、報告寫作到深層技術（記憶體、VM、TEE、AI）與獎金地圖。現在你在問：

- 「我要不要考 OSCP / Security+ / CISSP？」
- 「這些證照對拿賞金有幫助嗎？」
- 「每篇學的東西，到底去哪裡免費練習？」

這篇就是為了回答這三個問題而寫。

---

## 問題

**誤區 1：以為要有證照才能提交報告。** 錯。Google VRP、Meta、MSRC 只看：Scope 內、可重現、有影響、報告品質。證照不在資格條件裡。

**誤區 2：把「建構安全平台」的證照建議（如站內四文主打的 Security+ → AWS Security → AI Security → CISSP）直接套用到「進攻型」Bug Bounty。** 錯。OSCP 對進攻型是主幹道，對建構型才是繞路。

**誤區 3：學完理論不知道去哪練。** 本系列每篇都有對應的免費靶場/平台，這篇集中列表。

---

## 解決方案：三大計畫規則 + 證照文導讀 + 練習地圖

### 1. 三大計畫准入條件（2026-10-14 完整閱讀）

| 頁面 | 我找到的資格條件 | 需要證照？ |
|---|---|---|
| **Google VRP Rules** | 目標在 Scope、技術性漏洞、僅測自己的帳號；參與者需年滿 18 歲（未滿 18 歲需父母代提交）；制裁名單上的人/地區不給獎金 | **否** |
| **Meta Bug Bounty Scope** | 遵守負責任研究揭露政策、回報 Scope 內漏洞、用表單提交、測試時用測試帳號 | **否** |
| **Microsoft Hyper-V Bounty (MSRC)** | Critical/Important 嚴重度、說明影響、非明顯時說明攻擊向量；頁面「建議」透過 MSRC Researcher Portal 提交（措辭是建議，非資格條件） | **否** |

**共同點**：評的是報告（Scope、重現步驟、影響），不評人（證照、學歷、背景）。Google 甚至把報告品質拆成維度，用乘數（0.8x/1.0x/1.2x）調整獎金 —— 這在系列第 1、6 篇都有講。

---

### 2. 站內四篇證照文：獵人視角的「值得讀 / 可略過」

| 站內文章 | 值得讀（對獵人） | 可略過（對獵人） |
|---|---|---|
| **總覽地圖** | 「六大軌道——找出你在哪一條」裡的「基礎安全」與「進攻安全」類別、「免費起手式」段落、三階段決策樹的邏輯 | 雲端安全、管理治理、各階段成本估算（寫給不同讀者） |
| **AI 證照對決** | 「基準」段落（以 OWASP Top 10 for LLM Applications 為標尺），進攻段落的 COASP、OSAI+、HTB COAE（想測 AI 產品可看）；GIAC GOAA 是「用 AI 攻擊」非「測自己的 LLM」，可略過 | 四款 AI 證照的逐項比較（防禦/治理導向） |
| **三大經典證照 ROI 拆解** | 它怎麼算「準備時間」與「維護成本」：報名前先把總成本加起來 | 薪資溢價與 ROI 倍數（測的是職場市場，非賞金收入） |
| **台灣證照生態系** | 「真正的推力來自職缺」（怎麼讀職缺）、台灣本土證照段落、訓練機構比較裡的「進攻導向課程」 | 網安管理法、金管會人力分級、金融業法定訓練（企業合規義務，非個人測試的法律紅線） |

**關鍵轉換**：總覽文把 OSCP 列為「Excellent but too offense-focused for the goal of *building* a secure AI platform」，對獵人來說，把「for now」換成你的目標即可 —— 進攻型就是主幹道。

---

### 3. 系列 1-11 篇對應免費練習資源

| 系列篇次 | 主題 | 免費練習平台 | 關鍵關鍵字 |
|---|---|---|---|
| **1** | 規則與範圍 | 無（閱讀規則頁） | 直接去 Google VRP / Meta / MSRC 規則頁 |
| **2** | 網站運作 | [Web Fundamentals](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work) | HTTP、TLS、Cookie、Session |
| **3** | 獵人工作台 | **PortSwigger Web Security Academy**（免費）、本系列附的 `shop.mjs` | Burp Proxy/Repeater、Copy as cURL |
| **4** | XSS / IDOR | **PortSwigger: XSS labs**、**OWASP Juice Shop** | Reflected/Stored/DOM XSS、IDOR |
| **5** | RCE | **PortSwigger: Command Injection**、**OWASP Juice Shop** | `system()`、`exec()`、反序列化 |
| **6** | 報告與分流 | 無（寫作練習） | 套用第 6 篇模板、找真實報告範例參考 |
| **7** | 記憶體怎麼用 | **CSAPP Ch.9-10 (免費書本)**、**Python `ctypes` 實驗** | Stack/Heap/Data/BSS/Text |
| **8** | Buffer Overflow | **pwn.college**、**CTF Wiki: Stack Overflow** | `strcpy`、EIP 覆寫、ROP 入門 |
| **9** | VM / Hypervisor | **Hack The Box: Free boxes**、**VMware Workstation Player (免費)** | Type 1/2/3、VMBus、vPCIe |
| **10** | Hyper-V Escape | **Microsoft Learn: Hyper-V 文件**、**Hack The Box** | Partition、Hypercall、VMX |
| **11** | TEE / Confidential | **Intel SGX SDK (免費)**、**AMD SEV 文件**、**Google Confidential Computing** | Enclave、Remote Attestation |

> **推薦起手式**：先把 **PortSwigger Web Security Academy** 的 "SQL Injection"、"XSS"、"Command Injection"、"Authentication" 四個模組打完（約 20-30 小時），你就能動手做完系列 1-6 篇的所有實作。

---

### 4. 三種目標的三個第一步

| 目標 | 第一步 | 第二步 | 第三步 |
|---|---|---|---|
| **轉職資安** | 考 **Security+**（基礎通行證） | 打通 **PortSwigger Academy** 核心模組 | 準備 **OSCP**（進攻主幹道） |
| **純好奇 / 自學** | 讀完本系列 0-6 篇 + 打完 PortSwigger 核心模組 | 依興趣挑 7-11 篇深入 | 參加 **CTF**（pwn.college、Hack The Box） |
| **想試著拿第一筆賞金** | 註冊 **Google VRP / Meta / HackerOne** 公開計畫 | 用系列 3 篇工作台 + `shop.mjs` 練習 | 找一個公開計畫，從規則讀起（系列 1 篇），提交第一份報告（系列 6 篇模板） |

---

## 為什麼會這樣：證照 ≠ 賞金入場券

1. **計畫評的是報告，不是人**：Scope、重現步驟、影響、品質 —— 這四項都不需要證照。
2. **證照是結構化學習的捷徑**：OSCP 強迫你在 24 小時內打通一個網段，這比自己摸索快；但證照本身不保證你能找到漏洞。
3. **求職才看證照**：HR 篩選履歷時 Security+、OSCP、CISSP 是關鍵字；Bug Bounty 平台不看。

---

## 自我檢查（這篇重點：你決定好下一步了嗎？）

- [ ] 你確認三大計畫規則頁都不要求證照
- [ ] 你能說出 OSCP 對「進攻型」是主幹道、「建構型」才是繞路
- [ ] 你知道系列 3 篇工作台對應 **PortSwigger Academy**，系列 4-5 篇對應 **OWASP Juice Shop / PortSwigger labs**
- [ ] 你已經依你的目標（轉職/好奇/拿賞金）選出第一步
- [ ] 你知道證照的 ROI 計算（薪資溢價）不適用於賞金收入估算

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Meta Bug Bounty Scope](https://bugbounty.meta.com/scope/)
- [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [pwn.college](https://pwn.college/)
- [Hack The Box](https://www.hackthebox.com/)
- [OffSec OSCP Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

---

*這篇是系列 14（完結篇：證照與學習地圖），前面：Top Payouts Fact Check（13）。全系列 0-14 完。*
---
