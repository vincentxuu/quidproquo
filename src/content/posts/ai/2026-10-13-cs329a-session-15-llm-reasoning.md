---
title: "LLM 推理：中間 token 為什麼有用｜Stanford CS329A 第 15 堂"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 12
description: "依 Denny Zhou 同名公開講座的投影片，整理推理的定義、解碼、SFT 與 RL 微調的差別，以及 self-consistency 為什麼選最常見的答案而不是最常見的推理路徑。"
tldr: "推理是輸入與輸出之間的中間 token；RL 微調勝過模仿人類解答的關鍵是可靠的驗證器，多次取樣再選最常見的答案能再往上推。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-13-cs329a-session-15-llm-reasoning-en)

「模型會不會推理」常被當成哲學問題吵。Google DeepMind 的 Denny Zhou 給了一個可以操作的定義：推理就是輸入與最終答案之間產生的中間 token。[CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 15 堂由他客座，題目是「LLM Reasoning」。讀完本文，你應能解釋中間 token 為什麼有用、SFT 與 RL 微調差在哪，並自己算一次 self-consistency。先備是知道語言模型一次預測一個 token，以及取樣與 greedy decoding 的差別。

先讀[第 2 堂：推論時計算](/posts/ai/2026-10-11-stanford-cs329a-lecture-02-test-time-compute)與[第 6 堂：訓練時改進](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl)。這一堂像是把那兩堂的方法放回同一位研究者的脈絡裡重講一次。

**影片狀態：這一場沒有公開錄影或投影片。** 2026-10-13 查過 Stanford Online 播放清單、官方課表與其修改歷史、兩位授課老師的頻道，以及講者的個人網站，都沒有這一場的材料。本文改用講者題目類似的公開材料：他 2025 年 4 月 29 日在 Stanford CS25 的同名講座[投影片](https://dennyzhou.github.io/LLM-Reasoning-Stanford-CS-25.pdf)，該場另有[公開錄影](https://www.youtube.com/watch?v=ebnX5Ur1hBk)。兩場相隔約半年，本文依投影片撰寫，另對照了錄影中 self-consistency 一段的自動字幕（約第 41–51 分鐘），其餘段落沒有逐句核對，內容不代表 CS329A 那一場實際講了什麼。

## 推理是中間 token，而且有理論支持

投影片用一個人造任務開場：把「artificial intelligence」每個字的最後一個字母接起來。直接回答「le」是沒有推理；先寫「artificial 的最後一個字母是 l，intelligence 的最後一個字母是 e，接起來是 le」再回答，才是有推理。

為什麼多寫這幾句有用？投影片引用 Zhou 參與的一篇[理論論文](https://arxiv.org/abs/2402.12875)：凡是大小為 T 的布林電路解得了的問題，固定大小的 transformer 只要產生 O(T) 個中間 token 就能解；要是直接輸出答案，就得有極大的深度，或者根本解不了。換成白話，模型的層數是固定的，寫下中間步驟等於把計算攤到更長的輸出上。

## 解碼：模型本來就會，只是 greedy 沒挑到

投影片指出一個常見的錯誤信念：預訓練模型不經提示或微調就不會推理。它的反例是一道蘋果題：「我有 3 顆蘋果，爸爸比我多 2 顆，我們一共幾顆？」Greedy decoding 的第一個候選是「5 apples」，答錯。但往下看其他候選，會出現先算「爸爸有 5 顆，3+5=8」的回覆。

怎麼從候選裡挑？投影片的作法是看模型對最終答案的信心：有推理過程的回覆，對答案的信心明顯較高。這就是 [chain-of-thought decoding](https://arxiv.org/abs/2402.10200)。它和[第 2 堂](/posts/ai/2026-10-11-stanford-cs329a-lecture-02-test-time-compute)是同一個結構：先多產生候選，再想辦法選。

## 提示、SFT 與 RL 微調

投影片依序評價三種讓好答案排到第一名的方法。

提示法簡單有效，但 few-shot 範例要為每個任務另外準備，而通用的「Let's think step by step」效果又差一截。投影片還補了一句：問人問題時沒有人會先給幾個類似例題，所以提示法其實很怪。

SFT 是收集題目與人類寫的逐步解答，最大化這些解答的機率。它通用，但泛化不好，而且把資料量放大也幫助不大。

RL 微調把資料來源換掉：解答由模型自己產生，再最大化其中正確解答的機率、壓低錯誤解答的機率。投影片的解釋是機器學習的第一原則——直接最佳化你要的東西。我們要的是生成品質，不是像人。接著是整份投影片最重的一句：RL 微調裡最關鍵的是可靠的驗證器，而不是 RL 演算法本身。它的限制也在這裡：不是所有任務都能自動驗證。這和[第 3 堂](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification)的主軸一致。

## Self-consistency：選最常見的答案

模型解碼時找的是機率最高的「推理加答案」整串文字，但我們要的是機率最高的答案。同一個答案可以由很多條不同的推理路徑抵達，所以應該把路徑的機率加總起來，也就是對推理路徑做邊際化。[Self-consistency](https://arxiv.org/abs/2203.11171) 是它的實作：隨機取樣多次，選出現最多次的答案。

投影片的例子是一道雞蛋題，三次取樣的答案分別是 18、26、18。選 18，因為它出現兩次。注意這兩個 18 的推理寫法並不相同；選的是答案，不是推理路徑。答案是自由文字、無法直接比對時，投影片介紹 [Universal Self-Consistency](https://arxiv.org/abs/2311.17311)，請模型自己挑出最一致的那則回覆。

## 一個完整例子：五次取樣怎麼選

以下是本文自擬的教學例子。同一道數學題取樣五次，得到：

| 取樣 | 推理摘要 | 答案 |
|---|---|---|
| 1 | 先算單價再乘數量 | 42 |
| 2 | 先算總量再扣折扣 | 42 |
| 3 | 先算單價再乘數量，漏掉折扣 | 48 |
| 4 | 列方程式求解 | 42 |
| 5 | 先算單價再乘數量，漏掉折扣 | 48 |

答案 42 出現 3 次，48 出現 2 次，self-consistency 選 42。如果改成選「最常見的推理路徑」，結果會不同：答對的三次各走一條不同的路徑，每條只出現 1 次；「先算單價再乘數量，漏掉折扣」這條路徑卻出現 2 次（第 3、5 次），是最常見的一條，於是選到 48。按答案加總次數，才是前面說的邊際化。這個例子說明為什麼投影片特別強調選的是答案。

它的意思是：一致性高代表模型在這題上比較可能對，並不保證對。五次都答 48 的題目，self-consistency 會很有信心地交出錯誤答案。

## 變式檢查與答案

投影片留了兩個問題給聽眾。以下先寫講者在 CS25 錄影中的回應（約第 48–50 分鐘，依自動字幕意譯），再補本文的說明。

第一題：模型直接輸出答案、不寫中間步驟時，還需要取樣多次再選最常見的嗎？**答案：不需要。** 現場有聽眾回答可以直接看機率，講者同意，並說這就像傳統機器學習直接取機率最大的輸出，所以 self-consistency 只在有推理時才用得上。前提是你拿得到各個答案的機率。

第二題：改成讓模型在一次回覆裡寫出多個答案，再選最常見的，可以嗎？講者沒有直接判定，只說可以試，並要聽眾回到同一個原則：選機率最高的最終答案。**本文的推論是不等價。** 同一次回覆裡的後幾個答案會受前幾個影響，不是互相獨立的樣本，次數不再估計各答案的機率。

投影片最後的總結是四個比較：有推理勝過沒有、RL 微調勝過 SFT、聚合多個答案勝過單一答案、檢索加推理勝過只有推理。它列的下一步有兩項：處理沒有唯一可驗證答案的任務，以及做出真正的應用，而不只是解 benchmark。今晚可以做的事：拿一題你常問模型的計算題，取樣五次，照上表記錄答案次數，看一致性和正確率在你的題目上是否同向。

## 英文閱讀與表達

本文自擬句：*Self-consistency picks the most frequent answer, not the most frequent reasoning path.*（Self-consistency 選最常見的答案，不是最常見的推理路徑。）*A reliable verifier matters more than the choice of RL algorithm.*（可靠的驗證器比選哪個 RL 演算法更重要。）練習用兩句說明五次取樣的例子為什麼選 42；這是閱讀／表達練習，沒有原音跟讀。

## 參考資料

- [CS329A Autumn 2025 官方課表](https://cs329a.stanford.edu/)
- [Denny Zhou, LLM Reasoning（Stanford CS25 V5 投影片，2025-04-29）](https://dennyzhou.github.io/LLM-Reasoning-Stanford-CS-25.pdf)
- [Stanford CS25 V5：Large Language Model Reasoning 錄影（Stanford Online）](https://www.youtube.com/watch?v=ebnX5Ur1hBk)
- [Chain of Thought Empowers Transformers to Solve Inherently Serial Problems](https://arxiv.org/abs/2402.12875)
- [Chain-of-Thought Reasoning Without Prompting](https://arxiv.org/abs/2402.10200)
- [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171)
- [Universal Self-Consistency for Large Language Model Generation](https://arxiv.org/abs/2311.17311)
