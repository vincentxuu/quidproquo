---
title: "Product Builder 面試全景圖：從 PM 到 Builder 的思維轉換"
date: 2026-08-20
category: product
tags: [interview, product-builder, career, product-management, strategy]
lang: zh-TW
type: deep-dive
description: "拆解 Product Builder 面試的完整地圖——與傳統 PM 的差異、面試結構、考核維度，以及一條可執行的準備路線。"
tldr: "Product Builder 不是傳統 PM——你要能從 0 到 1 建產品，不只寫 PRD。面試考的是產品直覺、指標思維、技術理解力與執行力的交集。準備策略：先搞清楚目標公司要的是 PM 還是 Builder，再按九大維度分配時間。"
series:
  name: "Product Builder 面試準備"
  order: 1
---

「你做過什麼產品？」

這個問題在 PM 面試和 Product Builder 面試裡出現的頻率一樣高，但面試官期待的答案完全不同。PM 面試要聽你怎麼協調團隊、推動專案、拆解需求。Product Builder 面試要聽你怎麼從零開始——從發現問題到寫出第一版、從設計指標到看數據決定下一步，中間你親手做了多少。

這篇是本系列的第一篇，目的是把 Product Builder 面試的全貌攤開來，讓後面九篇各自深入時有一張地圖可以參照。

---

## Product Builder 和傳統 PM 到底差在哪

傳統 PM 的核心能力是**協調**：收集需求、寫 PRD、排優先序、推動工程和設計團隊把東西做出來。好的 PM 是翻譯機，把商業目標翻成技術需求，把使用者回饋翻成可執行的 backlog。

Product Builder 的核心能力是**建造**：你不只定義問題，你還能自己解決問題的第一個版本。這不代表你要當全職工程師，但你要能快速驗證假設——寫 prototype、跑實驗、讀數據、調整方向，而不是等團隊排進 sprint 才能往前走。

兩者的差異在幾個維度上很明顯：

**技術參與度**。傳統 PM 理解技術限制就夠了；Product Builder 要能直接操作。不一定是寫 production code，但至少能用 no-code 工具或簡單腳本快速搭出可測試的東西。

**決策速度**。傳統 PM 透過會議和文件驅動決策；Product Builder 透過實驗和數據驅動決策。你的 PRD 是一個可跑的 prototype，不是一份 Google Doc。

**角色邊界**。傳統 PM 有明確的分工界線——設計師畫圖、工程師寫 code、PM 管流程。Product Builder 的界線模糊得多，你可能同時在做使用者訪談、調 CSS、看 analytics dashboard。

**規模與階段**。大公司通常需要傳統 PM，因為組織複雜度高、跨團隊協調是真正的瓶頸。早期新創和 AI-native 公司更需要 Product Builder，因為速度比流程重要，能直接動手的人比能寫文件的人稀缺。

---

## 市場現況：2025-2026 的 Product 職缺長什麼樣

過去兩年 PM 市場明顯轉向。幾個趨勢值得注意：

**AI 新創大量出現，但它們要的不是傳統 PM**。這些公司通常十幾個人，沒有餘裕養一個只做協調的角色。它們要的是能理解模型能力、能設計 human-in-the-loop 流程、能自己跑 A/B test 的人。職缺描述裡寫的是「Product」而不是「Product Manager」，這個差異是有意義的。

**大廠 PM 職缺縮減**。Meta、Google、Amazon 在 2023-2024 的裁員潮中砍掉大量 PM 職位，2025 年雖然回穩，但開出來的新職缺對技術能力的要求明顯提高。「Technical PM」和「Product Engineer」這兩個 title 出現的頻率增加了。

**Builder 背景的人在面試中有結構性優勢**。當你能在面試中展示自己從零做出來的東西——不管是 side project、indie product 還是內部工具——你的說服力比純靠 STAR 框架講故事的候選人強很多。面試官能直接看到你的判斷力和執行力，而不是只聽你描述。

---

## 面試結構：不同公司怎麼考

Product Builder 面試沒有統一標準，但大致可以歸納成幾種模式：

**大廠 PM 面試**（Google、Meta、Microsoft）：通常四到六輪，包含 Product Sense（設計一個產品或功能）、Execution（如何衡量和推進）、Leadership & Drive（行為面試）、Strategy（市場和競爭分析）。這套流程高度結構化，考的是框架運用能力。

**AI 新創面試**：通常三到四輪，偏重實作。可能直接給你一個問題，要你在一週內做出 prototype 並報告。面試過程更像 working session——和團隊一起討論產品方向，現場拆解一個真實問題。技術理解力的權重比大廠高很多。

**Growth / Product-Led Growth 公司**：重指標和實驗設計。面試會出 case study，給你一組數據要你判斷 feature 的成敗、設計下一個實驗、預測指標走向。SQL 和基本數據分析能力幾乎是必備。

**獨立 Builder / 創業導向**：有些公司面試的方式更接近 co-founder 面談——他們想知道你怎麼思考市場、怎麼做取捨、過去做砸了什麼學到什麼。Portfolio 和 track record 比面試技巧重要。

---

## 九大考核維度

不管公司類型和面試結構怎麼變，Product Builder 面試考的能力可以歸納為九個維度。本系列後面的每一篇會深入一個：

1. **Product Sense**——使用者洞察、問題定義、功能優先序。你能不能從一個模糊的需求裡找到真正值得解的問題？

2. **Product Design**——從問題到方案的設計過程。你怎麼決定 MVP 的範圍？怎麼做取捨？

3. **Metrics & Analytics**——北極星指標、漏斗分析、實驗設計。你用什麼數字判斷一個功能成功還是失敗？

4. **Strategy**——市場定位、競爭分析、護城河。你怎麼決定該做什麼、不做什麼？

5. **Execution**——Roadmap 規劃、跨團隊協作、stakeholder 管理。你怎麼把想法變成可交付的東西？

6. **Technical PM**——API 設計思維、架構理解、與工程師的協作模式。你不需要寫 code，但你要能讀懂 trade-off。

7. **Growth & Experimentation**——Growth loop 設計、A/B testing、retention 策略。你怎麼讓產品長大？

8. **AI Product Design**——AI-native 的產品設計模式、human-in-the-loop、信任建立。這是 2025-2026 最熱的面試主題。

9. **Behavioral & Leadership**——影響力故事、衝突處理、vision 表達。技術再強，講不出故事就過不了最後一關。

---

## 準備策略：怎麼分配時間

面試準備最大的陷阱是「平均分配時間」。九個維度不代表各花九分之一的精力。正確的做法是：

**第一步：定位目標公司類型**。你要去大廠、AI 新創、還是 growth 導向的公司？不同類型的權重差異很大。大廠重 Product Sense 和 Behavioral，AI 新創重 Technical PM 和 AI Product Design，growth 公司重 Metrics 和 Experimentation。

**第二步：盤點自己的強弱項**。你有工程背景？Technical PM 和 Execution 可能已經很強，把時間花在 Product Sense 和 Strategy 上。你有設計背景？反過來，補技術理解和指標思維。

**第三步：用 portfolio 取代刷題**。Product Builder 面試和 SWE 面試不同，刷 case study 的邊際效益遞減很快。更有效的準備方式是做一個小產品、跑一輪完整的 build-measure-learn，然後把過程中的每個決策點變成面試素材。

**第四步：每個維度都要有一個「錨定故事」**。面試回答要具體，最好的具體就是你自己做過的事。九個維度各準備一個故事，確保能在兩分鐘內講完、能在追問下展開細節。

---

## 本系列的使用方式

這個系列不是教科書，是一份準備清單。每篇的結構是：核心概念（這個維度到底在考什麼）、常見題型（附拆解思路）、準備資源（書、文章、工具）、以及一個自我檢測（確認你準備到什麼程度）。

建議的讀法：先讀完這篇全景圖，對照自己的目標公司和強弱項，標出最需要補的三個維度，從那三篇開始讀。不要從頭到尾依序讀——你的時間有限，花在刀口上。

本系列共十篇，每篇聚焦一個面試維度。下一篇從 Product Sense 開始。

## 參考資料

- [Decode and Conquer](https://www.lewis-lin.com/decode-and-conquer) — Lewis C. Lin 的 PM 面試經典，涵蓋 product design、strategy、estimation 等題型框架
- [Cracking the PM Interview](https://www.crackingthepminterview.com/) — Gayle Laakmann McDowell 的 PM 面試指南，適合從 SWE 轉 PM 的讀者
- [Lenny's Newsletter](https://www.lennysnewsletter.com/) — 產品思維與成長策略的一手觀察，多篇文章直接對應面試常考主題
