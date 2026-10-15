---
title: "Bug Bounty 獎金地圖：Google、Hyper-V、Meta TEE、Apple 與 Mozilla 的價碼在付什麼"
date: 2026-10-13
category: tech
type: guide
difficulty: 進階
tags: [bug-bounty, security, rewards, payouts, vrp, google, meta, microsoft, apple, comparison]
lang: zh-TW
description: "系列第 13 篇：用五個官方計畫的代表類別，讀懂漏洞獎金的攻擊起點、利用鏈、證據與報告品質條件。"
tldr: "獎金要連同產品、漏洞類別、攻擊情境與證據要求一起看；各計畫上限與品質規則不能混用。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 13
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en)

學過 Web、記憶體、虛擬機與 TEE 之後，現在可以回頭讀那些「最高幾十萬、幾百萬美元」的標題。這篇把五個計畫的代表類別放在一起，重點是看懂金額旁邊的條件，再判斷它跟你能做的研究有沒有關係。以下依 2026-10-15 可讀到的官方規則整理，金額皆為美元。

流程位置：選計畫 → 讀規則 → 認識目標 → 找洞 → 寫報告 → **理解獎金與研究取捨**。

## 先看地圖：每個數字買的是什麼

| 計畫與代表類別 | 官方金額 | 必須一起讀的條件 |
|---|---|---|
| Google／Alphabet VRP：T0、T1 的伺服器 RCE（S0） | 基礎 $101,010 | 品質係數為 0.8、1、1.2，由審查小組裁定；這是指定類別的基礎額 |
| Microsoft Hyper-V：L1 guest RCE | 最高 $250,000 | 這格要求可運作的 exploit 與高品質報告；沒有 exploit 時另有較低上限 |
| Meta WhatsApp Private Processing：TEE 程式碼執行、提權、VM escape | 各最高 $300,000 | 這些是外部攻擊情境；內部情境用另一張表 |
| Apple：無需互動的網路攻擊到核心控制 | 最高 $2,000,000 | 要達成該類別列出的利用鏈成果與證明要求 |
| Apple PCC：遠端攻擊請求資料，達成指定的未簽署程式碼執行 | $1,000,000 類別 | PCC 有自己的信任邊界與條件，和裝置核心類別分開 |
| Mozilla client security：Highest Impact | 最高 $20,000 | 依實際影響、支援配置與報告品質裁定；例如符合定義的 sandbox escape |

這張表選的是能對應前面課程的類別，並非各家公司所有產品的全球最高額排行。不同計畫對「最高」的定義不同，有些另有獎勵與排除條件，不能把數字直接當成同一種工作報價。

## Google：先找對格子，再談品質

[Google 現行規則](https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules)把目標層級、漏洞類別和影響分開。S0 伺服器 RCE 在 T0、T1 的基礎額為 $101,010，一般 Google 應用的 T2 為 $75,000。網域包含 `google.com`，並不代表它自動屬於 T0。

品質係數再套到對應基礎額。例如，若審查小組認定報告符合 1.2 倍品質，T0／S0 的計算範例是：

```text
101,010 × 1.2 = 121,212 美元
```

這只是特定格子的示例。完整 PoC、影響分析與清楚回覆有助於審查，但勾完清單不會自動保證拿到 1.2 倍。規則另有調整項，最後仍由小組裁定。也不能拿歷史新聞中的最高額，反推出現行規則存在通用的 1.5 倍。

## Microsoft：exploit 與報告品質是表格條件

[Hyper-V 計畫](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)對 L1 guest RCE 列出不同上限。有可運作 exploit 且報告品質高，最高 $250,000；沒有 exploit 時，高、中、低品質的上限分別是 $200,000、$100,000、$50,000。L2 類別的最高額為 $150,000；資訊洩漏的高品質類別最高 $25,000。

L1、L2 指的是虛擬化層級，不能簡化成一個是 guest-to-host、另一個就是 guest-to-guest。研究者必須交代起始權限、巢狀環境、跨過哪道邊界，以及能證明什麼成果。這也說明為什麼第 10 篇用真實案例追資料路徑，比只寫「我找到 VM escape」有價值。

這張表沒有 Google 的 0.8／1／1.2 通用乘數。讀 Microsoft 的條件時，直接看它列出的資格與各格上限。

## Meta：外部與內部是攻擊情境

[Private Processing 官方準則](https://bugbounty.meta.com/payout-guidelines/private-processing/)針對 WhatsApp 的這套系統：外部情境下，TEE 內程式碼執行（含繞過程式碼證明）、提權、逃到 host，各最高 $300,000；資料洩漏最高 $150,000，持久化最高 $10,000。

內部攻擊情境則不同：程式碼執行、提權、資料洩漏各最高 $50,000，VM escape 標為 N/A，持久化最高 $5,000。這不是報告寫差了被乘上六分之一，而是攻擊者起點不同。也不能把這張表套到任何 Intel SGX、AMD SEV 或 AI 產品；先確認問題真的落在該計畫範圍。

## Apple：利用鏈成果與 PCC 分開看

[Apple 類別頁](https://security.apple.com/bounty/categories/)以能證明的成果區分獎勵。無需互動的網路攻擊到核心控制，代表類別最高 $2,000,000；瀏覽器到核心控制的類別為 $1,000,000。頁面標記需要 Target Flag 的格子，必須符合對應證明要求。

PCC 另有一組條件：遠端攻擊請求資料，最後在 Apple PCC 軟體映像內達成具任意 entitlement 的未簽署程式碼執行，屬於 $1,000,000 類別；越過信任邊界取得使用者請求資料，另有 $250,000 類別。它不要求把「裝置核心控制＋PCC」合成一條才能談獎金。

[計畫首頁](https://security.apple.com/bounty/)另提到符合條件的額外獎勵。做研究規劃時，先讀你能證明的基本類別，再逐條核對額外條件，別把可能的加成當成必領金額。

## Mozilla：先讓漏洞可診斷、可修復

[Mozilla client bug bounty](https://www.mozilla.org/en-US/security/client-bug-bounty/)的有效 high／critical client 漏洞，基礎表最高 $20,000，依影響與報告品質裁定。最高影響類別包含符合定義的 sandbox escape；UXSS 所在較高影響類別最高 $10,000，一般 high-impact 類別最高 $3,000。

它要求足以診斷與修復的資料、簡單可重現的測試案例，以及 ASan 堆疊／crash dump 或根因分析等證據。完整 exploit 並非必要。頁面還有 mitigation bypass 與符合條件的額外獎勵，因此 $20,000 是這張基本表的上限，不是整個計畫所有情況的絕對天花板。

## 怎麼拿這張地圖選下一步

金額高，往往同時要求更難證明的成果。比較兩個機會時，先寫四件事：你能合法接觸什麼目標、攻擊起點是什麼、要跨哪道邊界、最後能交出什麼證據。這是研究規劃的方法，不是廠商定價原因的定論。

以新手為例，第 4 篇的本機 XSS／IDOR 練習就能訓練重現與授權判斷；看到高額 Hyper-V 或核心利用鏈，不代表第一個月應該直接轉做它們。第 6 篇的投入時間與期望值框架，以及下一篇的練習路線，才是把價碼變成行動的橋。

## 自我檢查

- 能否說出每個金額所屬的產品、類別與必要前提？
- 能否分清 Google 品質係數、Microsoft 各格上限，以及 Meta 外部／內部情境？
- 能否說明 Apple 裝置利用鏈與 PCC 為什麼分開比較？
- 如果只證明 crash、尚未證明跨越安全邊界，報告應如何如實描述？
- 下一週要做的練習，能產出哪一種可重現證據？

[上一篇：AI 產品的漏洞](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty)・[下一篇：認證與學習地圖](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map)

## 參考資料

- [Google／Alphabet VRP 現行規則與獎金表](https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Microsoft Hyper-V Bounty Program](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Meta WhatsApp Private Processing Payout Guidelines](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Apple Security Bounty Categories](https://security.apple.com/bounty/categories/)
- [Apple Security Bounty 計畫首頁](https://security.apple.com/bounty/)
- [Mozilla Client Security Bug Bounty Program](https://www.mozilla.org/en-US/security/client-bug-bounty/)
