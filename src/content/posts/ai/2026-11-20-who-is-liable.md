---
title: "出事誰負責：agent 買錯、寄錯，損失由誰擔，各地法規管到哪"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, regulation, payments]
lang: zh-TW
tldr: "目前的答案大多是：你。廠商條款把 agent 的動作算成你授權的（Anthropic、Instinct、Muse），賠償上限 100 到 250 美元；美國大型銀行在 2026 年 10 到 11 月陸續改條款，你讓第三方 agent 進帳戶，它做的事、甚至憑證外洩後被盜用，都算你的。美國信用卡和轉帳法規的「未經授權」保護，是為被偷卡設計的；你自己把權限交給 agent，比較像把卡借給家人、家人用超過範圍。電子交易法要求對方的自動系統給人更正錯誤的機會，但那是保護你跟對方系統打交道時犯的錯。歐洲多數常駐 agent 沒開放，廠商沒說原因。台灣金管會 10 月發布諮詢文件、數發部說要研議電商的 AI 風險框架，目前沒有專門的規定。內容不是法律意見。"
description: "agent 出錯時損失由誰承擔：廠商條款怎麼把責任放在使用者身上、美國銀行新條款（Citi、JPMorgan、Bank of America）、Reg Z 與 Reg E 的「未經授權」定義為什麼套不上、UETA 給的更正錯誤機會保護什麼、歐洲為什麼大多沒開放、台灣金管會諮詢文件與數發部的回應，以及讓 agent 碰錢之前先確認自己能靠什麼救濟。不是法律意見。"
series:
  name: "常駐型 AI agent"
  order: 23
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-who-is-liable-en)

**本篇不是法律意見。** 內容整理各家條款與法規原文，實際個案請找律師或主管機關。

| 誰 | 目前的立場 | 依據 |
|---|---|---|
| agent 廠商 | agent 的動作算你授權，賠償有上限 | 各家服務條款 |
| 銀行 | 你讓第三方 agent 進帳戶，後果你擔 | Citi 等銀行的新條款 |
| 信用卡、轉帳法規 | 保護的是「未經授權」，你授權的不算 | 美國 Reg Z、Reg E |
| 對方的自動系統 | 要給你更正錯誤的機會 | 美國 UETA 第 10 條 |
| 台灣 | 還在諮詢、研議 | 金管會諮詢文件、數發部 |

[TechCrunch 報導](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)，美國第三大商業銀行 Citibank 在 11 月中改了線上使用條款。你如果把網銀帳密交給第三方的 AI 工具，或授權它進入帳戶，那個 agent 做的任何事，都算你的。就算 AI 工具外洩了你的憑證、或被駭，駭客拿這些憑證做的事，也算你的。

Citi 不是第一家。JPMorgan 和 Bank of America 這兩家美國最大的銀行，10 月就宣布了類似的政策；PNC 和報導同一天改了條款，Citizens 也寄信提醒客戶。

這篇講責任：agent 買錯、寄錯，損失由誰擔，各地法規管到哪。

## 第一層：廠商的條款

前面幾篇的產品，條款的方向都一樣：agent 的動作算你的。

- **Anthropic**：[消費者服務條款](https://assets.claude.com/43c13f51a6d9755341433f79cf63c966ed9200ea.pdf)把 Claude 替你做的事叫「Actions」，寫明「You are responsible for all Inputs you submit to our Services and all Actions」。條款也提醒，這些動作「may not be error free or operate as you intended」。
- **Instinct**：[order 5](/posts/ai/2026-11-20-instinct) 講過，條款寫你的指令和脈絡導致的任何動作，都算你授權。賠償上限 100 美元，或你過去六個月付的錢，取較高者。
- **Muse**：[order 3](/posts/ai/2026-11-20-meta-muse) 講過，補充條款寫財務損失由你承擔、交易限額由你自己設。Meta 的賠償上限是 250 美元，或你過去 12 個月付的錢，取較高者；重大過失、故意或詐欺不受這個上限限制。

所以第一層能靠的很少：廠商願意賠的金額，遠低於 agent 能動用的金額。

## 第二層：銀行與付款

銀行的新條款比廠商更進一步。[Unite.AI 整理 Citi 的條款內容](https://www.unite.ai/citi-makes-customers-responsible-for-third-party-ai-agent-activity/)：

- 你提供帳密或允許第三方 agent 存取，Citi 就把它的存取和動作當成你授權的。
- 憑證之後被分享、外洩給其他人或其他 agent，用這些憑證做的事也算你授權。
- agent 誤解你的指令、做了你沒要的事、超出你給的權限，責任都在你，除非法律另有規定；監看 agent 做得對不對，也是你的責任。
- Citi 隨時可以不經通知切斷 agent 的存取。
- Citi 自己提供的 AI 工具不在此限。

TechCrunch 也點出銀行的另一個考量：AI 工具讓客戶更容易避開不必要的手續費、低利存款，銀行會想控制這條路。

**為什麼法規的保護套不上**

美國的信用卡和電子轉帳有消費者保護。但它們保護的是「未經授權」的交易，而定義很關鍵：

- 信用卡的 [Reg Z 第 1026.12 條](https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-B/section-1026.12)：未經授權使用，是指持卡人以外的人、沒有實際或默示授權、持卡人也沒有得到好處的使用。這時持卡人的責任上限是 50 美元。
- 電子轉帳的 [Reg E 第 1005.2 條](https://www.ecfr.gov/current/title-12/chapter-X/part-1005/subpart-A/section-1005.2)：明確排除「消費者自己把存取工具交給的人」發起的轉帳，除非你已經通知銀行不再授權。

兩條規定的[官方解釋](https://www.consumerfinance.gov/rules-policy/regulations/1026/2026-04-08/12/)都舉了同一個例子：你把卡交給家人或同事，授權他們用，他們用超過範圍，責任在你，直到你通知銀行為止。

agent 還沒有被監理機關明確定性，但你自己把憑證或卡交給它、授權它用，情況很接近這個例子。這是我的解讀，不是法院或主管機關的結論。實務上，跟商家的退款、信用卡帳單爭議還是可以試，但不要假設法規一定站在你這邊。

## 第三層：跟商家的交易

美國 49 州採用的《統一電子交易法》（UETA），有一條常被拿來討論。以[麻州的版本](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter110G/Section10)為例，第 10 條規定：

- 在自動化交易裡，一個人跟**對方的**自動系統打交道時犯了錯。如果對方的系統沒有提供防止或更正錯誤的機會，這個人可以讓那筆錯誤的紀錄不生效。
- 條件是：發現錯誤後立刻通知對方、歸還或銷毀收到的東西、沒有從中得到好處。
- 這一條不能用合約排除。

這解釋了為什麼結帳頁都有「確認訂單」那一步：商家的系統給了你更正的機會，這條保護就用不上了。

但要注意它保護的方向：它保護的是你跟商家的自動系統打交道時犯的錯。你自己的 agent 去跟商家下單、它搞錯了，算不算「你的錯誤」、商家有沒有給「你」更正的機會，目前沒有定論。

付款協定在這一層補上的是證據。[order 22](/posts/ai/2026-11-20-the-other-end) 講過的 AP2，用簽好的授權書記下你同意了什麼。[PayPal 的說明](https://developer.paypal.com/community/blog/PayPal-Agent-Payments-Protocol/)寫得很直接：責任綁在真實世界的使用者、商家或發卡機構身上，不是 agent。有了這些紀錄，爭議時至少查得到 agent 有沒有超出你授權的範圍。

## 歐洲：多數產品沒開放

在歐洲，多數常駐 agent 根本沒上線。[Dialogo 對照各家說明頁整理](https://www.dialogo.chat/blog/always-on-ai-agents-europe/)，截至 11 月：

- Claude Duet：研究預覽期間只開放美國。
- Dots：Pro 和 Plus 方案不開放歐洲經濟區、瑞士和英國。
- Muse：沒有點名任何歐洲國家。
- Gemini Spark（Tasks in Gemini 的前身）：排除歐洲經濟區。

廠商自己都沒說原因。外界的分析指向幾個方向，但都是推論：

- **個資保護法規**：[一位挪威作者的分析](https://hakon.berntsen.net/blog/always-on-agents-stop-at-the-border-claude-duet-europe)指出，常駐 agent 會持續讀到從沒同意過的第三方的資料，例如寄信給你的每一個人。在消費者帳號裡，廠商很接近 GDPR 的資料控制者。英國和瑞士不在歐盟，也被排除，他的解讀是這兩地有類似的個資法。
- **數位市場法**：[另一篇分析](https://technspire.com/en/blog/muse-and-the-eu-no-launch-date-no-dpa-and-your-options)指出，Meta 是數位市場法認定的守門人。Muse 跨 Instagram、WhatsApp 組合個人資料的功能，在歐盟需要另外取得同意。

AI Act 方面，agent 不是一個獨立的監管類別，適用一般 AI 系統與通用模型的規則。

## 台灣：還在諮詢、研議

台灣目前沒有專門處理 agent 交易責任的規定，但有兩個動作。

**金管會的諮詢文件**：[10 月 13 日發布〈金融業運用代理 AI 安全諮詢文件〉](https://join.gov.tw/policies/detail/81468464-6f11-42b9-ab9b-8c31ee7995b7)，徵詢意見 30 天。[文件全文](https://www.ey.gov.tw/File/EA3264FE96515A4C?A=C)有幾個跟本篇相關的原則：

- 它管的是金融機構自己導入、能操作營運系統的 agent。只在使用者既有權限內做資訊整理、草擬的個人 AI 助理，不用逐項參考；但如果能自主呼叫工具、對外傳送、寫入系統，就要重新評估。
- 涉及不可逆、高影響或重大客戶權益的動作，應保留人工確認或覆核，不宜只由 agent 自動執行。
- 缺乏必要紀錄、無法停用、無法撤銷、無法復原或無法追溯的，不宜正式自動化。

[中央社報導](https://www.cna.com.tw/news/afe/202610130306.aspx)，金管會資訊服務處處長林裕泰的說法是：應該把代理 AI 視為數位員工，重點在「它拿什麼樣鑰匙、可以開什麼樣的門」。文件不取代現行法令，未來會朝指引方向走，但沒有時間表。

**數發部的回應**：[工商時報報導](https://www.ctee.com.tw/news/20261112701825-431401)，11 月 9 日無店面零售公會與數位發展部座談。momo 總經理谷元宏提出，AI 替消費者下單甚至付款時，若買錯商品或超出授權範圍，應及早釐清授權、責任分配和代理身分驗證的規則。數發部長林宜敬回應，將研議電商的 AI 應用風險框架。

這兩件事都還在早期。台灣讀者目前能用的海外常駐 agent，出事時主要還是看廠商條款，以及你的發卡銀行怎麼處理。

## 讓 agent 碰錢之前，先確認這幾件事

| 要確認的 | 去哪裡看 | 如果答案不好 |
|---|---|---|
| 廠商賠多少 | 服務條款的責任上限 | 只讓它碰小於這個金額的交易 |
| 用的是哪張卡、哪個帳戶 | 你在 agent 裡設的付款方式 | 改用單次卡或額度低的卡 |
| 銀行怎麼看第三方 agent | 你的網銀使用條款 | 不要把網銀帳密交給 agent |
| 每筆交易前有沒有確認畫面 | 產品的核准設定 | 打開，不選「一律允許」 |
| 有沒有交易紀錄可以對帳 | 產品的活動紀錄 | 自己留一份，定期對信用卡帳單 |
| 出錯時找誰 | 商家的退貨政策、發卡行的爭議流程 | 先試這兩條，不要指望 agent 廠商 |

整理起來：你能靠的，是商家的退貨政策、發卡銀行的爭議處理，以及你自己設的金額上限。你靠不了的，是 agent 廠商的賠償，以及「未經授權」的法規保護。

## 適合誰、不適合誰

**比較能承受風險的用法：**
- agent 只能讀，不能動錢。
- 碰錢只用單次卡或額度很低的卡，每筆都要你確認。
- 金額小、可以退貨的交易。

**風險最高的用法：**
- 把網銀帳密交給 agent。
- 讓它在你不在時自動付款，而且選了「一律允許」。
- 用它處理金額大、不能退的交易，例如機票、轉帳。

在台灣，目前沒有專門的法規分配 agent 交易的責任；用海外產品時，責任主要由廠商條款和你的發卡銀行決定。

條款和銀行把損失放在你身上。這正是下一篇、也是系列最後一篇的理由：從唯讀開始，碰錢用單次卡。

## 參考資料

- [More banks say customers using AI agents are on their own — even if they get hacked](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)（TechCrunch，2026-11-18）
- [Citi Makes Customers Responsible for Third-Party AI Agent Activity](https://www.unite.ai/citi-makes-customers-responsible-for-third-party-ai-agent-activity/)（Unite.AI，2026-11-18）
- [Consumer Terms of Service](https://assets.claude.com/43c13f51a6d9755341433f79cf63c966ed9200ea.pdf)（Anthropic）
- [12 CFR 1026.12 Special credit card provisions](https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-B/section-1026.12)（eCFR）
- [12 CFR 1005.2 Definitions](https://www.ecfr.gov/current/title-12/chapter-X/part-1005/subpart-A/section-1005.2)（eCFR）
- [§ 1026.12 Official interpretation](https://www.consumerfinance.gov/rules-policy/regulations/1026/2026-04-08/12/)（CFPB）
- [Massachusetts General Laws Chapter 110G, Section 10](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter110G/Section10)（UETA 麻州版）
- [Agent Payments Protocol: Building Verifiable Trust for Agentic Commerce](https://developer.paypal.com/community/blog/PayPal-Agent-Payments-Protocol/)（PayPal，2025-09-16）
- [Dots, Duet, Spark and Muse in Europe: What Works Today](https://www.dialogo.chat/blog/always-on-ai-agents-europe/)（Dialogo，2026-11-15）
- [Why Always-On AI Agents Stop at the Border](https://hakon.berntsen.net/blog/always-on-agents-stop-at-the-border-claude-duet-europe)（Håkon Berntsen，2026-10-29）
- [Muse and the EU: no launch date, no DPA, and your options](https://technspire.com/en/blog/muse-and-the-eu-no-launch-date-no-dpa-and-your-options)（Technspire，2026-09-28）
- [金管會發布「金融業運用代理AI安全諮詢文件」，徵詢各界意見](https://join.gov.tw/policies/detail/81468464-6f11-42b9-ab9b-8c31ee7995b7)（公共政策網路參與平臺，2026-10-13）
- [金融業運用代理 AI 安全諮詢文件](https://www.ey.gov.tw/File/EA3264FE96515A4C?A=C)（金管會）
- [盯新興風險 金管會發布金融業運用代理AI諮詢文件](https://www.cna.com.tw/news/afe/202610130306.aspx)（中央社，2026-10-13）
- [AI代理購物買錯誰負責？電商業者提4建言 數發部回應了](https://www.ctee.com.tw/news/20261112701825-431401)（工商時報，2026-11-12）
