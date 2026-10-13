---
title: "Bug Bounty 頂級獎金查證：Google RCE、Meta 30 萬、Hyper-V 25 萬各是什麼"
date: 2026-10-13
category: tech
type: deep-dive
tags:
  - bug-bounty
  - security
  - vulnerability-research
  - hyper-v
  - google
  - meta
  - microsoft
lang: zh-TW
description: "網路流傳三個 Bug Bounty 頂級價碼：Google 伺服器 RCE 9 萬、Meta Llama VM 逃脫 30 萬、Hyper-V 逃脫 25 萬。逐項對照官方獎金表，說明每個數字在哪一格、少了什麼前提，以及想走這條路該怎麼評估。"
tldr: "三個數字都找得到官方出處，但每個都少了前提。Hyper-V 的 25 萬要有可運作的 exploit；Meta 的 30 萬 VM 逃脫在 WhatsApp Private Processing，不是 Llama，而且需受邀參加；Google 的 9 萬是一般 *.google.com 服務的 RCE 加上最高品質倍數，最敏感的服務基準是 101,010 美元。獎金表只給上限，不給成功率。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en)

有人轉貼了三個 Bug Bounty 的頂級價碼，結論是「CP 值比挖一般 Web 漏洞高太多」。我把三個數字逐一對回官方獎金表。數字都有出處，但各自少了一個前提，這個前提才是判斷值不值得投入的關鍵。

## 先看結論

| 原貼文說法 | 官方獎金表怎麼寫 | 缺的前提 |
|---|---|---|
| Hyper-V 逃脫 25 萬美元 | L1 guest 逃脫 RCE 最高 250,000 美元 | 要有可運作的 exploit 加高品質報告 |
| Meta Llama VM 逃脫 30 萬美元 | WhatsApp Private Processing 的 VM 逃脫最高 300,000 美元 | 目標是 WhatsApp 的 TEE，不是 Llama；僅限受邀 |
| Google 伺服器 RCE 9 萬美元 | 一般 Google 應用 RCE 基準 75,000，乘上 1.2 倍品質係數是 90,000 | 這是第三層，最敏感服務基準是 101,010 |

## Hyper-V：最乾淨的一項

[Microsoft Hyper-V Bounty Program](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) 對 L1 guest 逃脫（虛擬機攻破 hypervisor、逃到宿主機，或逃到另一台 L1 guest）的 RCE 這樣定價：

| 條件 | 最高獎金 |
|---|---|
| 有可運作的 exploit，報告品質高 | 250,000 美元 |
| 沒有 exploit，報告品質高 | 200,000 美元 |
| 沒有 exploit，報告品質中等 | 100,000 美元 |
| 沒有 exploit，報告品質低 | 50,000 美元 |

巢狀虛擬化的 L2 guest 逃脫最高 15 萬美元。拒絕服務最高 1.5 萬，資訊洩漏最高 2.5 萬。

原貼文說 Azure 上的逃脫還有額外加成，我在這個頁面沒有看到。只能說沒找到，不能說不存在。

## Meta：30 萬是真的，但目標不是 Llama

[Meta 的 Private Processing 獎金頁](https://bugbounty.meta.com/payout-guidelines/private-processing/)列出，針對 WhatsApp Private Processing 的 TEE（可信執行環境）：

| 類別 | 外部攻擊者情境最高 |
|---|---|
| TEE 內程式碼執行（含繞過程式碼證明） | 300,000 美元 |
| 權限提升 | 300,000 美元 |
| VM 逃脫（逃到宿主機） | 300,000 美元 |
| 資料洩漏 | 150,000 美元 |
| 持久化 | 10,000 美元 |

所以「VM 逃脫 30 萬」確實存在，但有三個前提。

1. **目標是 WhatsApp 的 TEE**。這套架構讓 AI 功能在加密環境裡處理訊息，[Meta 工程部落格](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/)有介紹。它不是 Llama 模型的沙盒。
2. **僅限受邀**。[範圍頁](https://bugbounty.meta.com/scope/)寫明 Private Processing 的存取是 by invitation only。
3. **內部攻擊者情境另計**。同一頁的附加規則寫，限於內部情境的漏洞，程式碼執行等類別降到 5 萬美元，VM 逃脫則是 N/A。

至於 LLM 本身，範圍頁的 Meta AI 段落只說有興趣的是模型的隱私與安全問題，例如透過模型反推或萃取攻擊洩漏訓練資料。模型功能問題與有害輸出要走 GitHub 或回報表單，不在獎金範圍。我沒有找到任何「Llama 沙盒逃脫」的獎金條文，所以「Meta 官方 LLM Bounty 最高 30 萬」這個說法對不上。

## Google：9 萬是第三層

[Google VRP 規則頁](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)的獎金表，「直接取得 Google 伺服器存取」的 RCE（S0）依網域層級分：

| 網域層級 | RCE 基準獎金 |
|---|---|
| Tier 0（全球影響或帳號級網域） | 101,010 美元 |
| Tier 1（敏感使用者資料網域） | 101,010 美元 |
| 一般 Google 應用，如 *.google.com | 75,000 美元 |
| 高優先收購網域 | 10,000 美元 |
| 其他收購與低優先沙盒應用 | 1,337 到 5,000 美元 |

最後金額再乘上報告品質係數：低 0.8、一般 1、優秀 1.2。規則頁自己的範例是 accounts.google.com 的 RCE，優秀報告拿 101,010 乘 1.2 等於 121,212 美元。

所以 9 萬正好是 75,000 乘 1.2：一般 Google 應用的 RCE，加上最高品質評價。它是真的，但不是 Google 的頂級價碼。

兩點補充。2024 年 7 月的[官方公告](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)把最高寫成 151,515 美元，是 101,010 乘 1.5。現行規則頁的係數上限是 1.2，所以引用前要確認你看的是哪個時間點的版本。另外 Google 其他計畫的上限更高：[2024 年度回顧](https://blog.google/security/vulnerability-reward-program-2024-in/)提到 Chrome 在非沙盒行程的 RCE 最高 25 萬，Mobile VRP 對頂級應用的嚴重漏洞最高 30 萬。

## 「CP 值高」這句話撐得住嗎

獎金表只告訴你上限，沒告訴你三件事：

1. **成功率**。Hyper-V 逃脫、TEE 繞過需要虛擬化、記憶體安全與 exploit 開發的功力，門檻比一般 Web 漏洞高一個量級。上限高，常常是因為做得到的人少。
2. **時間成本**。25 萬那一格要求可運作的 exploit，通常是以月計的投入，期間可能零收入。Meta 那格還要先拿到邀請。
3. **重複與無效報告**。Meta 的規則寫明重複報告只付給第一個提交的人，也列出報告被當成無效的幾種原因。這類成本不會出現在獎金表上。

所以比較誠實的說法是：頂級價碼高，是因為難度高、人手少。對剛入門的人，要用期望值算，不是看上限。

## 想評估這條路，今晚能做的事

1. 打開 [MSRC Hyper-V 頁](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)，抄下獎金表，在旁邊寫「我現在離這個等級差哪些技能」。
2. 讀一個已公開的 hypervisor 逃脫分析，例如 CVE-2024-49117 這類 Hyper-V guest-to-host 案例，估算自己複現需要多久。
3. 列出你現在能打的中階目標，比較每週投入與預期收入，再決定要不要換跑道。

## 整體來說

三個數字都能在官方頁面找到，但引用時要把前提一起帶上：Hyper-V 要附 exploit，Meta 是受邀的 WhatsApp TEE，Google 是依網域與品質係數算出的結果。獎金表是用來判斷難度的，不是用來算薪水的。

## 參考資料

- [Microsoft Hyper-V Bounty Program（MSRC）](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Meta Bug Bounty：WhatsApp Private Processing 獎金指引](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Bug Bounty：Program scope](https://bugbounty.meta.com/scope/)
- [Building Private Processing for AI tools on WhatsApp（Meta Engineering）](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/)
- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Increasing Google & Alphabet VRP rewards up to $151,515（Google Bug Hunters）](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Vulnerability Reward Program: 2024 in Review（Google）](https://blog.google/security/vulnerability-reward-program-2024-in/)
