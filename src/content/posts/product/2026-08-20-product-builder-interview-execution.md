---
title: "Execution 面試攻略：從 Roadmap 到跨團隊協作"
date: 2026-08-20
category: product
tags: [interview, product-builder, execution, roadmap, stakeholder]
lang: zh-TW
type: deep-dive
description: "拆解 Product Builder 面試中 Execution 環節——roadmap 規劃、優先序辯護、跨團隊協作、stakeholder management，以及如何展現執行力。"
tldr: "Execution 面試考的是你能不能把想法變成可交付的東西。核心能力：roadmap 規劃（怎麼在有限資源下排序）、優先序辯護（為什麼先做 A 不做 B）、跨團隊協作（怎麼推動工程和設計）、stakeholder management（怎麼處理衝突），以及用數據追蹤進度的能力。"
series:
  name: "Product Builder 面試準備"
  order: 6
---

## Execution 面試怎麼考

Execution 是 Product Builder 面試裡最接近「日常工作」的環節。面試官不會考你抽象的策略思考，而是丟一個具體場景——「你有一個 5 人團隊、一個季度，這三個功能你怎麼排？」——然後看你怎麼決策、怎麼推動、怎麼處理衝突。

Google 的 execution round 會讓你當場規劃一個 quarterly roadmap，然後追問「如果工程師說做不完呢？」「如果 VP 要求插一個新需求呢？」。Meta 的版本更偏 metrics-driven：「你的功能上線兩週後，DAU 掉了 3%，你怎麼辦？」。新創的 execution 面試則直接問你過去的經驗：「講一個你推動跨團隊專案的故事。」

不管哪種形式，面試官在找的是同一件事：**你能不能在資源有限、資訊不完整的情況下，做出有根據的取捨，並推動團隊一起往前走。**

## Roadmap 規劃

面試中做 roadmap 不是要你排一個完美的甘特圖，而是要展示你的排序邏輯。一個實用的框架是「先砍再排」：

**第一步：砍到三件事。** 面試通常會給你五到八個可能的方向，你要先砍到三件。砍的邏輯要明確——不是「這個不重要」，而是「以目前的北極星指標和團隊規模，這件事的 impact/effort 比最低，具體原因是 X」。能說出具體排除理由的人和說「這個可以以後做」的人，面試表現差很多。

**第二步：排時間序。** 三件事裡，哪個先做取決於依賴關係和風險。如果 B 依賴 A 的 API，A 先做。如果 C 的技術風險最高，C 先做——因為晚發現做不了的代價最大。在面試中把這個邏輯講清楚，比排出「正確」的順序更重要。

**第三步：標出里程碑。** 每件事拆成 2-3 個里程碑，每個里程碑對應一個可驗證的交付物。「完成推薦模型訓練」不是好的里程碑，「離線 A/B test 的 precision@10 比 baseline 高 5%」才是。面試官想看到你用指標定義「完成」。

## 優先序辯護

面試官一定會挑戰你的排序——這不是在找你的破綻，而是在測試你能不能在壓力下堅持有根據的判斷，或在面對新資訊時靈活調整。

**RICE 框架的實戰用法：** RICE（Reach × Impact × Confidence / Effort）在面試裡不是拿來算數字的，而是拿來「結構化你的論述」。當面試官問「為什麼先做 A 不做 B」，你可以說：

「A 的 Reach 是全部月活使用者（500 萬），B 只影響付費使用者（50 萬）。Impact 都是中等。但 A 的 Confidence 更高——我們有三個月的使用者研究數據支持，B 只有一個客戶的反饋。Effort 方面，A 需要兩個工程師四週，B 需要三個工程師六週。所以 A 的 RICE 分數大約是 B 的五倍。」

這段話的價值不在數字精確，而在你能用結構化的方式解釋每個維度的判斷依據。

**被挑戰時怎麼辦：** 面試官追問「如果 B 的客戶是你們最大的企業客戶呢？」時，不要立刻改答案。好的回應是：「這改變了 Impact 的權重——流失這個客戶的營收損失可能比 A 的使用者成長更大。我會重新評估，但我需要知道這個客戶的合約金額和流失風險才能做最後判斷。」

## 跨團隊協作

Product Builder 面試特別看重你怎麼推動沒有直接匯報關係的人。面試官常問的場景是：「設計團隊不同意你的方向」「後端工程師認為你的需求太複雜」「另一個 PM 的優先序和你衝突」。

回答這類問題的關鍵是展示你理解對方的立場。不是「我說服了他們」，而是「我先理解了他們為什麼反對」。一個好的回答結構：

1. **對齊目標**：「我先和設計 lead 坐下來，確認我們對使用者問題的理解是否一致。」
2. **暴露差異**：「我們的分歧不在使用者問題上，而在解決方案——我傾向最小可行方案快速上線，她擔心粗糙的 V1 會傷害品牌。」
3. **找共識方案**：「我們最後同意：在核心流程上用她要求的設計品質，但把 edge case 的處理簡化，上線後用數據決定要不要補。」
4. **量化結果**：「這樣做讓我們提前兩週上線，保留了設計品質，而且上線後數據顯示那些 edge case 只影響 2% 的使用者。」

## Stakeholder Management

Stakeholder 衝突在面試中通常以情境題出現：「VP of Sales 要你插入一個大客戶要求的功能，但你認為這會拖延核心 roadmap，你怎麼處理？」

面試官在找的是你的「向上管理」能力——不是你聽話照做，也不是你硬頂回去，而是你能不能把衝突轉化成一個有數據支撐的決策。

**好的回答框架：**

1. **不急著說 yes 或 no**：「我會先了解這個需求的完整背景——這個客戶的合約金額、流失風險、這個功能對他們有多 critical。」
2. **量化 trade-off**：「然後我會把插入這個需求的成本算清楚——哪個核心功能會延後多久、對整體指標的影響是什麼。」
3. **提出選項而非答案**：「我會帶著三個選項去找 VP：(A) 插入，核心功能延後六週；(B) 用現有功能做一個 workaround 先撐住客戶；(C) 從另一個優先序較低的項目抽人來做。每個選項附上 impact 估算。」
4. **讓決策者決策**：「最終決定是 VP 的，但我確保他在做決定時有完整的資訊。」

## 進度追蹤

面試有時會問「你怎麼知道你的團隊在正確的軌道上？」。這個問題考的是你有沒有建立 feedback loop 的習慣。

**好的回答應該包含三層指標：**

- **Input metrics（週級別）**：sprint velocity、feature 完成率、blocker 數量。這些告訴你「團隊有沒有在動」。
- **Output metrics（月級別）**：功能上線數、bug 修復率、使用者可見的改變。這些告訴你「動的方向對不對」。
- **Outcome metrics（季級別）**：北極星指標的變化、OKR 達成率。這些告訴你「做的事有沒有產生價值」。

面試中提到這三層的區別，會讓面試官知道你不只是「按時交付」的 PM，而是有能力判斷「交付的東西有沒有用」的 Builder。

## 面試技巧

**用過去的故事，不是假設的框架。** Execution 面試裡，真實經驗的說服力遠大於理論框架。準備三到五個過去推動專案的故事，每個故事涵蓋不同的挑戰（資源衝突、timeline 壓力、stakeholder 衝突、技術風險）。

**永遠先問限制條件。** 面試官給你一個 roadmap 問題時，先問：「團隊規模？前後端比例？有沒有外部 deadline？有沒有技術債務要先處理？」這些問題不只幫你做更好的決策，也展示你有 operational awareness。

**別怕說「我不確定」。** 面試官追問到你不確定的地方時，說「這個我需要更多數據才能判斷，但基於現有資訊我的 default 是 X，因為 Y」比硬掰一個答案強很多。

**時間管理。** Execution 面試通常 45 分鐘，花 5 分鐘釐清問題和限制條件，20 分鐘做 roadmap 和排序，15 分鐘處理追問，5 分鐘 Q&A。不要在排序上花太久——面試官想看你怎麼被挑戰，而不是你的初始排序有多完美。

## 面試模擬題

### 題目

「你負責一款 B2B SaaS 的核心功能模組，工程團隊有 6 個人。下一季你同時面對三個需求：大客戶要求的客製 API、安全團隊要求的 SOC2 合規改造、以及 PM 團隊提出的新使用者 onboarding 流程改版。你怎麼排序？」

**來源**：Exponent PM 面試題庫（改編）　**難度**：中等　**環節**：execution round

### 拆解思路

1. **先釐清問題**：問面試官——大客戶的合約金額和 deadline 是什麼？SOC2 有沒有外部審計日期？onboarding 的 conversion drop-off 數據是多少？6 人團隊的前後端比例？
2. **建立框架**：用 RICE 排序三個需求，但先把有硬 deadline 的拉出來（SOC2 審計日期 > 客戶合約 deadline > 沒有 deadline 的 onboarding）。
3. **深入核心**：核心 trade-off 是短期營收（大客戶）vs 合規風險（SOC2）vs 長期成長（onboarding）。SOC2 如果有審計 deadline 就不可能推遲；大客戶要看合約金額能不能 justify 專人投入。
4. **收尾**：提出分階段方案——不是「三個都做」，而是「先做什麼、放棄什麼、怎麼跟 stakeholder 溝通放棄的那個」。

### 範例回答（面試時可以這樣講）

> **先確認硬限制。** SOC2 如果有明確的審計日期——假設是下季末——這個不能推遲，因為合規失敗會直接影響所有企業客戶的續約，不只是一個大客戶。所以第一優先是把 SOC2 的工程改造項目拆出來，估算需要多少人力、多少個 sprint。假設需要 2 個工程師 4 週，剩下的人力才能分配。
>
> **再看大客戶 API。** 我會先問這個客戶的 ARR 佔比和流失風險。如果是 top 5 客戶且合約續約綁著這個 API，我會安排 2 個工程師平行做，但不會做「完全客製」——而是設計成可復用的 API 擴展，讓其他客戶也能用。如果客戶不在 top 10，我會跟 CSM 一起去談延期或折衷方案。
>
> **Onboarding 改版推到下季。** 原因不是不重要，而是它沒有硬 deadline，而且可以在這季先做數據收集——跑 session recording 和漏斗分析，確認 drop-off 到底在哪一步，這樣下季改版的方向更精準。我會在本季末的 planning 中把分析結果帶出來，讓團隊看到數據後自然同意這是下季第一優先。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 問了硬限制（deadline、合約、審計日期） | |
| 用了結構化框架（RICE 或類似）排序 | |
| 有明確的「不做什麼」和放棄理由 | |
| 提出分階段方案而非同時全做 | |
| 提到怎麼跟 stakeholder 溝通被推遲的需求 | |
| 加分：把客製需求設計成可復用方案 | |

## 參考資料

- [Exponent — PM Execution Interview Guide](https://www.tryexponent.com/courses/pm-interview-course/execution) — Execution round 的題型分類和答題框架，含 Google、Meta 真實面試題
- [Lenny's Newsletter — How to prioritize](https://www.lennysnewsletter.com/p/how-to-prioritize) — 產品優先序的實務框架，RICE 和 ICE 的比較與適用場景
- [Cracking the PM Interview — Execution Chapter](https://www.crackingthepminterview.com/) — Gayle McDowell 對 execution 面試的拆解，適合從 SWE 轉 PM 的讀者
- [Intercom — RICE Scoring Model](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) — Execution 面試中 roadmap 優先序辯護常用的 RICE 框架原始出處
- [Shreyas Doshi — How to say no](https://twitter.com/shreyas) — Product Builder execution 面試中 stakeholder management 與優先序取捨的實務心法
