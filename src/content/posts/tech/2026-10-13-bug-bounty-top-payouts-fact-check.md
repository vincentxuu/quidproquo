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
description: "網路流傳三個 Bug Bounty 頂級價碼：Google 伺服器 RCE 9 萬、Meta Llama VM 逃脫 30 萬、Hyper-V 逃脫 25 萬。逐項對照官方頁面，看哪些屬實、哪些被搬錯位置，以及想走這條路該怎麼評估。"
tldr: "Hyper-V 25 萬屬實，但要有可運作的 exploit 加高品質報告，而且我在官方頁面找不到 Azure 加成。Meta 的 30 萬上限我只在 WhatsApp Private Processing 的範圍頁看到，找不到「Llama VM 逃脫」這個項目。Google 伺服器端 RCE 的 9 萬，我讀到的官方數字是單項上限 151,515 美元，所以 9 萬不是頂級價碼。「CP 值比 Web 漏洞高」這句話，獎金表看不出來。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en)

有人轉貼了三個 Bug Bounty 的頂級價碼，結論是「CP 值比挖一般 Web 漏洞高太多」。這篇逐項對照官方頁面，回答兩個問題：這三個數字能不能直接引用，以及獎金表高，是不是代表值得轉過去。

## 先看結論

| 原貼文說法 | 查證結果 | 判斷 |
|---|---|---|
| Hyper-V 逃脫最高 25 萬美元，Azure 另有加成 | 25 萬屬實；Azure 加成在官方頁面沒看到 | 金額對，加成未證實 |
| Meta Llama VM 逃脫最高 30 萬美元 | 30 萬出現在 Meta 範圍頁，語境是 WhatsApp Private Processing；沒找到 Llama 項目 | 疑似搬錯位置 |
| Google 伺服器 RCE 9 萬美元 | Google 公開的單項上限是 151,515 美元；9 萬不是上限 | 不能當頂級價碼 |

我讀不到的地方先講：Meta 官方頁面直接讀會被擋，Google 規則頁的獎金表我也沒能取到全文。這兩項靠搜尋摘要與 Google 的年度回顧文判斷，引用前請自己點進原頁再確認一次。

## Hyper-V：最乾淨的一項

[Microsoft Hyper-V Bounty Program](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) 的獎金表分得很細。L1 guest 逃脫（虛擬機攻破 hypervisor、逃到宿主機，或逃到另一台 L1 guest）的 RCE：

| 條件 | 最高獎金 |
|---|---|
| 有可運作的 exploit，報告品質高 | 250,000 美元 |
| 沒有 exploit，報告品質高 | 200,000 美元 |
| 沒有 exploit，報告品質中等 | 100,000 美元 |
| 沒有 exploit，報告品質低 | 50,000 美元 |

巢狀虛擬化的 L2 guest 逃脫最高 15 萬美元。拒絕服務最高 1.5 萬，資訊洩漏最高 2.5 萬。

這張表有兩件事原貼文沒說。第一，25 萬是「最高」，而且要附能跑的 exploit；只有分析沒有 exploit，上限直接掉到 20 萬以下。第二，頁面裡沒有 Azure 加成的說法，我只能說沒找到，不能說不存在。

## Meta：30 萬是真的，但不是那個項目

Meta 的[範圍頁](https://bugbounty.meta.com/scope/)在搜尋摘要裡寫著「Rewards for impactful findings is up to $300K USD」，緊接著談的是 Private Processing，也就是 WhatsApp 讓 AI 功能在加密環境裡處理資料的架構，[Meta 工程部落格](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/)有介紹。獎金細則在 [Private Processing 專頁](https://bugbounty.meta.com/payout-guidelines/private-processing/)，涵蓋 TEE、attestation 與可驗證透明性。

至於 Llama：[llama-models 的安全政策](https://github.com/meta-llama/llama-models/security)只說漏洞請送到 Meta 的 Bug Bounty，沒有單獨列「Llama 沙盒逃脫 30 萬」。所以比較合理的讀法是：30 萬確實存在，但它掛在 WhatsApp Private Processing 這個範圍，被轉述成 Llama 是搬錯了位置。除非有人貼得出明確的 Llama 條文，否則別寫成「Meta LLM Bounty」。

## Google：9 萬不是天花板

Google 的數字分散在好幾個計畫，這是最容易混的地方。[Google 2024 年度回顧](https://blog.google/security/vulnerability-reward-program-2024-in/)提到：

- Chrome 在瀏覽器或其他非沙盒行程取得 RCE，單項上限 25 萬美元。
- 該文的 Google VRP 最高數字是 151,515 美元。
- [Google Cloud VRP](https://cloud.google.com/blog/products/identity-security/google-cloud-launches-new-vulnerability-rewards-program) 的頂級獎金是 101,010 美元。

所以「Google 伺服器 RCE 9 萬」如果是某個等級的實際發放金額，有可能是真的，但它不是官方上限，也不能代表「這類漏洞的價碼」。Google 的規則是依影響範圍與資料敏感度定價，同樣是 RCE，打到哪個服務、拿到什麼權限，差很多。[VRP 規則頁](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)才是要引用的來源。

## 「CP 值高」這句話撐得住嗎

獎金表只告訴你上限，沒告訴你另外三件事：

1. **成功率**。Hyper-V 逃脫、hypervisor 漏洞、TEE 繞過，需要的前置知識（虛擬化、記憶體安全、exploit 開發）比一般 Web 漏洞高一個量級。上限高，常常是因為很少人做得到。
2. **時間成本**。25 萬那一格要求可運作的 exploit，通常是以月計的投入，而且可能整段時間零收入。
3. **重複與無效報告**。Meta 與其他計畫都有研究者抱怨報告被判定重複或不適用，這類成本不會出現在獎金表上。

所以比較誠實的說法是：頂級價碼高，是因為難度高、風險高、人手少。對剛入門的人，CP 值要用期望值算，不是看上限。

## 想評估這條路，今晚能做的事

1. 打開 [MSRC Hyper-V 頁](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)，把獎金表抄下來，在旁邊寫「我現在離這個等級差哪些技能」。
2. 讀一個歷史上已公開的 hypervisor 漏洞分析（例如 CVE-2024-49117 這類 Hyper-V guest-to-host 案例），估算複現需要多少時間。
3. 同時列出你現在能打的中階目標，比較每週投入與預期收入，再決定要不要換跑道。

## 整體來說

三個數字裡，Hyper-V 25 萬可以直接引用，Meta 30 萬要改成 WhatsApp Private Processing 的語境，Google 9 萬不要當頂級價碼用。比金額更值得看的是條件：有沒有 exploit、報告品質、哪一層的逃脫。獎金表是用來判斷難度的，不是用來算薪水的。

## 參考資料

- [Microsoft Hyper-V Bounty Program（MSRC）](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Meta Bug Bounty：Program scope](https://bugbounty.meta.com/scope/)
- [Meta Bug Bounty：WhatsApp Private Processing 獎金指引](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Building Private Processing for AI tools on WhatsApp（Meta Engineering）](https://engineering.fb.com/2025/04/29/security/whatsapp-private-processing-ai-tools/)
- [meta-llama/llama-models Security](https://github.com/meta-llama/llama-models/security)
- [Vulnerability Reward Program: 2024 in Review（Google）](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Google Cloud launches new Vulnerability Rewards Program](https://cloud.google.com/blog/products/identity-security/google-cloud-launches-new-vulnerability-rewards-program)
- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
