---
title: "Product Builder 面試日練 — 2026-08-20：Strategy & Execution"
date: 2026-08-20
category: daily
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "今日練產品策略與執行面試：市場定位、競爭護城河、roadmap 取捨與 stakeholder management。"
tldr: "Strategy 面試不是考你背 Porter's Five Forces——是考你能不能在資訊不完整時做出有根據的取捨，並說服別人。今天練市場定位分析、護城河判斷、roadmap 優先序辯護，以及 stakeholder alignment 的溝通策略。"
series:
  name: "Product Builder 面試日練"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-20-product-interview-daily-en)

## 今日主題

Strategy & Execution 是 PM 面試中最容易「講很多卻沒講到重點」的環節。面試官不是要聽你分析整個市場——他們要看你能不能在資訊不完整的情況下做出有根據的取捨，並清楚解釋為什麼排除其他選項。

Google 的 strategy round 特別出名：面試官會在你每個判斷上追問「為什麼不選另一個？」。能不能擋住追問，靠的不是框架背得多熟，而是你有沒有真的想清楚 trade-off。

## 核心框架速記

### 策略定位三步法（適用「如何進入新市場」「如何應對競爭威脅」類題目）

1. **錨定商業模式**：這家公司靠什麼賺錢？不是看使命宣言，是看錢從哪來。Meta 的策略問題要用廣告收入的邏輯想，不是「連結世界」。
2. **畫出競爭地圖**：誰是直接競爭者、誰是替代品、誰可能跨界進來？重點不是列名單，而是找出「這個市場的結構性優勢在哪裡」。
3. **做排除法，不做加法**：列出 2-3 個可行方向，為每個方向找一個具體的排除理由（時間、資源、風險），最後留下一個並解釋為什麼它在這些限制條件下最合理。

### RICE 優先序框架（適用「怎麼排 roadmap」「怎麼取捨 feature」類題目）

| 維度 | 問什麼 | 怎麼量化 |
|------|--------|---------|
| Reach | 這個功能影響多少使用者？ | 每季觸及的使用者數 |
| Impact | 對單一使用者的影響多大？ | 3 分制（低/中/高） |
| Confidence | 我們對預估有多少把握？ | 百分比（100%=有數據，50%=直覺） |
| Effort | 需要多少人月？ | 工程 + 設計人月 |

RICE = (Reach x Impact x Confidence) / Effort。面試時不用算精確數字，但要能用這個結構解釋你的排序邏輯。

## 今日練習題

### 題目

「你是一家 AI 寫作工具的 PM。目前產品主要服務行銷人員寫社群貼文，月活 50 萬。CEO 想擴展到企業內部文件（報告、提案、內部溝通），但工程團隊只有 12 人。你會怎麼決定要不要做，以及怎麼排優先序？」

**來源**：Exponent PM 面試題庫（改編）　**難度**：中等　**環節**：strategy round

### 拆解思路

1. **釐清問題**：問面試官——企業文件市場的 TAM 有多大？現有使用者有沒有提過這個需求？12 人的工程團隊目前的 sprint 佔用率多少？有沒有時間壓力（競品在做嗎）？
2. **錨定商業模式**：現在靠什麼賺錢——免費增值？訂閱？按用量？企業市場的定價模式會不同（seat-based），這影響 GTM 策略。
3. **評估機會 vs. 風險**：企業市場的利潤高但銷售週期長、需要合規（SOC2、資料隱私）。用 RICE 初步估算——Reach 可能較低（企業使用者 < 消費者），但 Impact 和客單價高。
4. **提出分階段方案**：不是「做或不做」的二選一，而是「用最小投入驗證再決定」。例如先用現有產品加一個企業模板功能，觀察轉化率。
5. **定義決策指標**：什麼數字出來了你就決定全力投入？什麼數字出來了你就收手？

### 範例回答（面試時可以這樣講）

> **先看商業邏輯。** 我們目前服務行銷人員寫社群貼文，50 萬月活，假設以免費增值模式營運，付費轉化率可能在 3-5%。企業內部文件市場的客單價至少高 5-10 倍（seat-based 訂閱 vs. 個人訂閱），但銷售週期從自助註冊變成 3-6 個月的企業銷售流程，我們目前沒有 sales team。所以核心問題不是「企業市場值不值得做」，而是「以我們現在的資源，能不能用低成本方式驗證需求」。
>
> **我的建議是分兩階段。** 第一階段用 4 週、2 個工程師，在現有產品裡加一個「商業文件」模板類別——報告、提案、會議紀錄。不改架構，只加 prompt template 和輸出格式。然後追蹤兩個指標：這些模板的 7 日留存率，以及有多少用戶從個人帳號升級到 team plan。如果 7 日留存率 > 40% 且 team plan 轉化率 > 2%，就進入第二階段：投入 6 個工程師做企業版（權限管理、SSO、資料隔離），同時招一個 enterprise sales lead。
>
> **我會排除直接全力投入企業版，原因有三。** 第一，12 人團隊同時做消費者和企業會兩頭空。第二，企業版需要 SOC2 合規，光這個就要 3-6 個月。第三，我們還不確定行銷人員的需求和企業用戶的需求是否能用同一個產品架構服務——如果不行，這可能變成兩個獨立產品，12 人絕對不夠。先用模板測需求，數據會告訴我們該不該走。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 錨定現有商業模式（怎麼賺錢、客單價、轉化率） | |
| 新市場的 TAM 或機會規模估算 | |
| 資源限制的具體影響（12 人團隊能做什麼、不能做什麼） | |
| 排除法：至少說出一個「不做 X」的理由 | |
| 分階段方案而非二選一 | |
| 明確的決策指標（什麼數字出來就 go / no-go） | |
| 風險：提到合規、銷售週期、架構風險 | |
| 加分：GTM 策略差異（自助 vs. enterprise sales） | |

## 今日案例

**AI 公司的品牌定位就是護城河**

OSMOS 在 2026 年 7 月發表的分析指出，2026 年贏的 AI 公司不是因為模型最好，而是因為它們有清晰的市場定位、明確的目標受眾、和讓買家在銷售對話之前就產生信任的品牌。當 AI 讓「普通內容免費」之後，差異化的來源從功能轉移到了定位和信任。

這對面試的啟發是：當面試官問你「這個產品的護城河是什麼」，不要只回答技術壁壘。在 AI 時代，品牌認知、社群信任、和特定受眾的心智佔有率才是比模型能力更持久的護城河。

## 延伸閱讀

- [Exponent — Product Strategy Interview Questions 2026](https://www.tryexponent.com/blog/product-strategy-interview-questions) — 完整的策略面試拆解框架，包含「怎麼做排除法」和「怎麼擋住面試官追問」
- [IGotAnOffer — Product Manager Interview Process 2026](https://igotanoffer.com/en/advice/product-manager-interview-process) — PM 面試全流程指南，strategy round 的評分維度拆解
- [OSMOS — Why Branding and Positioning Are the Most Important Investments an AI Company Can Make](https://www.osmos.co/news/branding-and-positioning-ai-tech-companies) — AI 公司的定位策略分析，護城河不在技術而在品牌

## 參考資料

- [Exponent — Product Strategy Interview Questions 2026](https://www.tryexponent.com/blog/product-strategy-interview-questions) — 策略定位三步法的「錨定商業模式」和「排除法」概念來源
- [IGotAnOffer — Product Manager Interview Process 2026](https://igotanoffer.com/en/advice/product-manager-interview-process) — strategy round 的評分維度：strategic insight、communication、influence without authority
- [OSMOS — Branding and Positioning for AI Companies](https://www.osmos.co/news/branding-and-positioning-ai-tech-companies) — 今日案例來源：AI 公司品牌定位作為護城河
