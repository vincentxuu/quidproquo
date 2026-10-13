---
title: "數學奧林匹亞的三套系統：驗證從哪裡來｜Stanford CS329A 第 16 堂"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 13
description: "依 AlphaGeometry2、AlphaProof 的論文與 Google DeepMind 的 IMO 2025 公告，比較三套系統各自靠什麼驗證答案，以及 2024 銀牌到 2025 金牌之間換掉了什麼。"
tldr: "AlphaGeometry2 靠符號引擎、AlphaProof 靠 Lean 驗證，2024 年合計 28 分；2025 年 Gemini Deep Think 用自然語言拿 35 分，驗證改由人類閱卷。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-13-cs329a-session-16-superhuman-math-reasoning-en)

國際數學奧林匹亞（IMO）每年六題，每題 7 分，滿分 42。它對 AI 有吸引力，是因為證明對不對有明確標準。[CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 16 堂由 Google DeepMind 的 Thang Luong 客座，題目是「Towards AI Superhuman Reasoning: AlphaProof, AlphaGeometry & Gemini IMO Gold Medal」。讀完本文，你應能說明這三套系統各自由誰判定答案正確，並看出 2024 到 2025 之間改變的是哪一段。先備是知道搜尋樹與強化學習的大概意思；不需要會 Lean。

先讀[第 3 堂：驗證](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification)。那一堂的問題是驗證器不可靠時怎麼辦；這一堂的前兩套系統是驗證器幾乎完美時能走多遠。

**影片狀態：這一場沒有公開錄影或投影片。** 2026-10-13 查過 Stanford Online 播放清單、官方課表與其修改歷史、兩位授課老師的頻道，以及講者的個人網站，都沒有這一場的材料。本文改用題目點名的三套系統的公開文件：AlphaGeometry2 論文（講者是共同作者）、AlphaProof 的 Nature 論文，以及講者共同署名的 IMO 2025 官方公告。內容不代表該場實際講了什麼。

## AlphaGeometry2：語言模型提議，符號引擎證明

幾何題的難處常在於要自己加一條輔助線或一個輔助點。[AlphaGeometry2](https://arxiv.org/abs/2502.03544) 把工作拆成兩半。語言模型負責提議輔助構造；符號引擎 DDAR 依固定的推導規則，從已知事實反覆推出新事實，直到推不出更多。目標出現在推出的事實裡，題目就證完了。

對錯由符號引擎決定。語言模型提的輔助點再怪，只要引擎推得到目標，證明就成立；推不到，這個提議就作廢。訓練資料也用同一個引擎產生：從隨機圖形出發，推出所有事實，再回溯出題目與證明，不用人類題目當種子。

論文報告了幾個量。描述題目的語言擴充後，能表達的 IMO 2000–2024 幾何題從 66% 升到 88%；整體解題率從前一代的 54% 升到 84%。搜尋的重要性也有數字：不做樹狀搜尋、只用 greedy decoding 時，需要輔助構造的 26 題裡模型只解得出 2 題。

## AlphaProof：在 Lean 裡做強化學習

[AlphaProof](https://www.nature.com/articles/s41586-025-09833-y) 處理幾何以外的題目。它把題目寫成 [Lean](https://lean-lang.org/) 這種形式語言，證明的每一步都由 Lean 檢查。這給了強化學習一個不會被騙的獎勵：證明通過就是通過。

訓練分兩層。主要的 RL 階段仿照 AlphaZero，在大約 8,000 萬道自動形式化的題目上學習通用的證明策略。遇到特別難的題目，它在推論時再做一輪 test-time RL：針對目標題產生大量變體（簡化版、推廣版），在這批變體上繼續訓練，讓模型專門適應這一題。

IMO 2024 的結果要連條件一起讀。六題中幾何題 P4 交給 AlphaGeometry2；其餘五題由專家手動翻成 Lean。AlphaProof 解出 P1、P2、P6，每題各花兩到三天的 test-time RL；兩道組合題 P3、P5 沒有解出。合計四題 28 分，落在銀牌區間，離金牌門檻差一分。論文提到 P6 當年只有五位人類選手解出。

## Gemini Deep Think：自然語言，四個半小時

[IMO 2025 的官方公告](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/)描述了另一種作法。進階版的 Gemini Deep Think 直接讀官方題目，用自然語言寫出證明，全程在 4.5 小時的比賽時限內完成，不需要人把題目翻成形式語言。它解出六題中的五題，35 分，達到金牌標準。

公告列出的技術要點有三項。Deep Think 使用平行思考，同時探索並合併多條解法，而不是走單一條推理鏈。模型另外用新的強化學習方法訓練，使用更多多步推理、解題與定理證明資料。系統還取得一批精選的高品質數學解答，並在指示裡加入解 IMO 題的一般提示。

驗證的來源變了。沒有 Lean，也沒有符號引擎；答案由 IMO 的協調員用和學生相同的標準評分。公告附註說明，IMO 確認的是提交的答案完整且正確，不包含對系統、流程或模型本身的驗證。

## 一個完整例子：AlphaGeometry2 怎麼證一個點在圓上

這個例子出自 AlphaGeometry2 論文對「重合點」的說明。

條件：直線 a 與 b 交於點 X，要證明 X 落在圓 ω 上。論文說直接證很難，換個方式會容易得多，因為可以利用圓上的角度關係。

推理分四步。第一步，語言模型提議一個輔助點 X′，定義成直線 a 與圓 ω 的交點；這時還不知道 X′ 和 X 是不是同一點。第二步，符號引擎證明 X′ 也在直線 b 上；X′ 本來就在圓上，所以這一步用得上圓上的角度關係。論文這一步印的是「證明 X 在 b 上」，但 X 依定義就在 b 上，對照前後文應是 X′ 的筆誤，本文照 X′ 寫。第三步，X 和 X′ 都同時在 a 與 b 上，兩條線只有一個交點，所以 X 與 X′ 是同一點。第四步，X′ 在 ω 上，因此 X 在 ω 上。

結果：原題得證。

它的意思是兩個角色的分工很清楚。「加一個 X′」這個主意由語言模型提出，沒有任何規則保證它有用；第二到第四步的每個推論都由引擎依規則檢查。語言模型如果提了一個沒用的點，引擎推不到目標，這次嘗試就作廢，不會產生錯誤的證明。

## 三套系統放進同一張表

下表是本文依三份文件整理的對照。

| | AlphaGeometry2 | AlphaProof | Gemini Deep Think |
|---|---|---|---|
| 題目形式 | 幾何專用語言 | Lean | 自然語言 |
| 誰判定正確 | 符號引擎 | Lean 檢查器 | 人類閱卷 |
| 推論時做什麼 | 多棵搜尋樹共享事實 | 樹狀搜尋加 test-time RL | 平行思考 |
| 公開的 IMO 結果 | 2024 年 P4 | 2024 年 P1、P2、P6 | 2025 年五題 |

分數可以自己驗算。2024 年四題各 7 分，4×7=28；2025 年五題，5×7=35；滿分 6×7=42。兩年之間多了一題，但更大的差別在條件：2024 年要人工翻譯題目、計算以天計；2025 年直接讀題、在比賽時限內完成。

這張表的意思是，能力的提升和驗證方式的改變是同時發生的。前兩套系統的每一步都有機器檢查，所以搜尋與 RL 可以放心放大；第三套系統把機器檢查拿掉，換來不需要形式化的通用性，代價是正確性要靠訓練出來的可靠度與事後的人類評分。公告也說形式系統的研究會繼續，並預期把自然語言與形式驗證結合起來。

## 變式檢查與答案

你要讓模型證明一個不等式，手上沒有 Lean 形式化的人力，但需要高度確定答案正確。該選哪一種路線？**答案：先用自然語言產生證明，再把關鍵步驟交給獨立的檢查。** 純自然語言路線產生得快，但沒有機器保證；全部形式化最可靠，但成本超出你的條件。可行的折衷是對能數值檢驗的步驟跑數值檢查，其餘請第二個模型或人逐步審。這個答案是本文的推論，不是三份文件的結論。

常見誤解是把「金牌」讀成「數學推理已解決」。三份文件各有明確邊界：2024 年兩道組合題沒解出，2025 年也有一題未解；IMO 的確認只及於答案本身。今晚可以做的事：挑一個你想交給模型的推導任務，寫下誰或什麼東西能判定它對——程式、形式系統、還是人——再決定可以放手讓它搜尋到什麼程度。

## 英文閱讀與表達

本文自擬句：*In AlphaProof, Lean checks every step, so the reward cannot be gamed.*（在 AlphaProof 裡，Lean 檢查每一步，所以獎勵無法被鑽漏洞。）*The 2025 system worked in natural language and was graded by human coordinators.*（2025 年的系統用自然語言作答，由人類協調員評分。）練習用兩句比較 2024 與 2025 的驗證方式；這是閱讀／表達練習，沒有原音跟讀。

## 參考資料

- [CS329A Autumn 2025 官方課表](https://cs329a.stanford.edu/)
- [Gold-medalist Performance in Solving Olympiad Geometry with AlphaGeometry2](https://arxiv.org/abs/2502.03544)
- [Olympiad-level formal mathematical reasoning with reinforcement learning（AlphaProof，Nature 2025）](https://www.nature.com/articles/s41586-025-09833-y)
- [Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the International Mathematical Olympiad（Google DeepMind，2025-07-21）](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/)
- [Lean 官方網站](https://lean-lang.org/)
