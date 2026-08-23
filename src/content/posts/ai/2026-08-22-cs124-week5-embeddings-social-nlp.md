---
title: "CS124 Week 5 Embeddings and Social NLP：語境向量與公開材料的證據邊界"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, embeddings, social-nlp, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 6 }
tldr: "Week 5 的公開材料支持 distributional hypothesis、word embeddings 與 cosine similarity；同週 Social NLP 現場課未錄影且投影片受限，具體 audit 方法只作作者延伸。"
description: "Stanford CS124 Winter 2026 Week 5：distributional hypothesis、word embeddings、cosine similarity、representation learning、Social NLP 與 PA4。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en)

Week 5 是 CS124 前半季的轉折：前四週的表示多半由人決定，這週開始從大量語境自動學 representation。[官方課表](https://web.stanford.edu/class/cs124/lec/)同時列出 Embeddings material 與 Dan Jurafsky 的現場課「Social NLP / NLP for Computational Social Science」。前者有公開章節與 PA4；後者未錄影且投影片受限，所以本文不重建其具體論證。

**版本：** CS124 Winter 2026。**單元：** Week 5，2026-02-03、02-05。**講師／活動：** Dan Jurafsky；2 月 3 日 live Social NLP lecture。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[SLP3 Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf)、[PA4](https://github.com/cs124/pa4-embeddings)。課表指定 Chapter 5 pp.1–12、17–21，另加 August 2025 release Chapter 10 pp.9–12。**材料缺口：** live lecture 明示不錄影；Social NLP slides 位於 restricted path 且公開請求回 403；Canvas narration 與 Quiz 4 也 gated。因此本文完整處理公開 embeddings agenda，只能把 Social NLP 的存在、標題與課程定位列為缺口，不能虛構現場案例。

## Distributional hypothesis 把語意交給語境

[Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) 的起點是 distributional hypothesis：出現在相似語境的詞，傾向有相似意義。它不要求先替每個詞手寫定義，而是從「這個詞附近常出現什麼」建立 representation。

最直接的 count-based vector 可把每個 context word 當一個維度，記錄 target word 與它共同出現的次數。兩個詞的向量方向越接近，代表它們使用環境越相似。cosine similarity 以內積除以向量長度，關心方向多於總頻率，避免高頻詞只因數量大就看起來與所有詞相似。

## raw counts 為什麼不夠

共現矩陣極高維又稀疏，常見詞還會支配計數。像 PPMI 這類 weighting 比較實際共現與獨立情況下的預期共現，突顯「比偶然更常一起出現」的組合。dense embeddings 則把高維統計壓到較小連續空間，讓相似與類比可用向量運算處理。

word2vec 類方法不直接保存完整共現表，而以預測 context 或 target 的訓練目標學向量。這是 representation learning：表示本身由任務與資料學出，不是人工列 feature。PA4 repo 也要求額外安裝 PyTorch 與 Transformers，顯示課程從 NumPy 等基礎工具跨入 learned representations 的實作環境。

## 靜態向量把一個詞壓成一個點

static embedding 為每個 vocabulary item 給一個固定向量。它能捕捉許多語義關係，卻無法自然表示 polysemy：`bank` 在河岸與金融機構語境仍共用一個點。Chapter 5 把它定位成後續 contextualized embeddings 的前身；後者會依整句上下文產生不同 token representation。

不要因此把 static embeddings 當成只剩歷史價值。它們計算便宜、可視化容易，也適合建立 baseline。若任務只需穩定的詞彙相似度或小型資料集，簡單表示可能比大型 contextual encoder 更易部署與檢查。

## 作者延伸：如何為向量關聯建立有界 audit

以下是依 [Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf)「向量由語料分布學得」所做的作者延伸，不是未錄 Social NLP lecture 的內容重建。distributional learning 保存 corpus associations；向量靠近只表示資料中的使用模式讓它們靠近，不足以單獨支持因果或人物判斷。

因此，用 embedding 做人物、職業或群體分析時，需要先問 corpus 從哪裡來、誰被過度代表、時間範圍為何、相似度要支持什麼主張。cosine score 是 representation 中的幾何關係，不是對人的價值判決，也不是因果解釋。

Social NLP lecture 的 slides 與錄影都不公開，這裡必須停止。不能只憑「computational social science」的標題，替課堂補上特定研究、數字或倫理結論。這個缺口本身正好示範材料忠實度：知道主題存在，不等於知道講者如何論證。

## PA4 應該驗證什麼

[PA4](https://github.com/cs124/pa4-embeddings) 要學生在 Jupyter 環境處理 embeddings，並引入 PyTorch／Transformers packages。自學時可另外建立三類 probe：近義詞應該靠近、同形異義詞可能混在一起、人物／職業詞的近鄰需要人工檢查。

不要只挑漂亮 analogy。先列出失敗例，再改 corpus、window 或 representation 比較。若更換模型後只看兩個 cherry-picked neighbors，無法知道整體空間是否改善。

本週最小練習：選十個詞，畫 cosine similarity matrix；對每個高相似 pair 寫出它可能反映的語意、語法或資料來源因素。這會把「相似」從一個分數拉回可檢驗的解釋。

## 從 term-context matrix 開始

[Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) 先讓每個 target word 對應一列、每個 context word 對應一欄。window 可定義為左右固定距離，也可依 sentence 或 syntactic relation 取 context。window 小時較容易捕捉句法與局部用法，window 大時更可能捕捉 broad topic；它不是單純越大資訊越多。

raw co-occurrence counts 會被高頻 contexts 支配。Pointwise Mutual Information 比較 joint probability `P(w,c)` 與獨立假設下的 `P(w)P(c)`；正值表示一起出現比偶然預期更頻繁。PPMI 再把負值截成零，留下正向 association。

低頻 pair 可能得到極高 PMI，因為分母很小。實作需搭配 minimum counts、smoothing 或其他 weighting，不能看到高 PPMI 就宣稱語意關係強。保存 word count、context count 與 joint count，才能解釋一個 cell 的來源。

得到 vectors 後可用 dot product 或 cosine。dot product 同時受方向與長度影響，cosine 除掉 norms，較聚焦方向。若 vector 全零，cosine 無定義；若兩詞 contexts 都很少，數值也可能不穩定。nearest-neighbor search 應同時顯示頻率與 similarity，而不是只列一串看似合理的詞。

## Prediction-based embeddings 學到什麼

[Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) 將 static embeddings 連到以 prediction objective 學 representation 的方法。skip-gram 的直覺是由 target 預測 nearby contexts，CBOW 則由 contexts 預測 target。完整 softmax 需要對大 vocabulary 計算，negative sampling 以少量負例近似訓練訊號。

negative examples 的抽樣分布會影響學到的空間。太容易的 negatives 提供很小梯度；過度集中高頻詞又會改變罕見詞學習。training objective 不是透明容器，它定義哪些關係被 reward。

embedding table 的每列是可訓練參數。訓練後相似性來自共享 prediction behavior，而不是人工把 synonym pairs 寫入。這也是模型可能學到非預期 association 的原因：只要 association 有助於預測，它就可能進入向量。

## Analogy 不等於理解

向量 offset 類比常寫成 `king - man + woman ≈ queen`。它可展示某些 relations 在空間中呈現相似方向，但結果高度依 vocabulary、corpus、metric 與候選排除規則。只挑成功例子無法評估 representation。

更完整的 probe 應建立 relation categories，例如 morphology、geography、semantic relation，並報每類 coverage。若 test word 是 out-of-vocabulary，應單獨計，不可默默刪除讓 accuracy 上升。近鄰與 analogy 也可能反映 frequency 或資料模板，不必然是概念推理。

對下游 task，最可靠判斷仍是固定 train/dev/test protocol。intrinsic similarity score 可以快速檢查，但不保證 classification、retrieval 或 generation 改善。PA4 的視覺化與 probes 應被當成診斷，不是最終品質證明。

## Static 到 contextual representations

static embedding lookup 只依 token identity，因此同一個 `bank` 在不同句子拿到同一初始 vector。contextual model 會讓 token representation 經過 surrounding tokens 的 layers 後改變，河岸與銀行語境可分開。

但 contextual embedding 不是單一固定物件。要說「某詞的 embedding」，必須說來自哪個 model、哪一層、如何 pooling，以及輸入句子。不同 layers 可能偏向 lexical、syntactic 或 task-relevant features；把所有 layer states 平均也只是另一個設計選擇。

[PA4 README](https://github.com/cs124/pa4-embeddings) 要安裝 PyTorch 與 Transformers，正是把 static vector exercise 接到 contextual model 的操作層。使用 pretrained model 時仍要記 tokenizer、model revision 與 layer，否則未來重跑可能得到不同 representation。

## Social NLP 的材料缺口如何不妨礙負責任測試

以下仍是依可讀 [Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) 建立的作者延伸；不歸因於 403 且未錄的現場課。

不能重建 live lecture，不代表可跳過資料檢查。Chapter 5 公開內容已足以支持一個基本原則：embeddings 從 corpus distribution 學 association。因此任何人物／群體分析都要記 corpus source、time period、language、sampling 與 preprocessing。

測 bias 時要先定義 operational metric。例如比較兩組 target words 與兩組 attribute words 的 cosine differences，是特定詞表上的 association test，不等於對所有社會偏差做完整測量。詞表翻譯、polysemy 與 frequency 都會影響結果。

結果也要附 uncertainty 或 sensitivity：換幾組合理詞表、重訓不同 seed、改 corpus slice，結論是否維持？若只在一組精挑詞上成立，就應寫成 probe finding，而不是模型本質。

更重要的是限制用途。發現 association 後不能直接推論 training-data 個體的信念，也不能把 vector score 用來替人分類。representation audit 的目的，是找出系統可能放大的資料模式，接著在實際 downstream task 檢查 harm。

## PA4 的 evidence package

除了 notebook 能跑，至少保存四組 artifact：count／PPMI 小矩陣、static nearest neighbors、contextual representations 的句子對照、failure and bias probes。每組都要附 vocabulary、corpus 或 model revision 與 similarity definition。

可再建立一個 frequency-matched baseline。比較詞的近鄰時，若一組全是高頻、另一組全是低頻，差異可能來自估計品質。先配對頻率或在報告中顯示 counts，才知道 similarity pattern 是否超出資料量差異。

最後將一個簡單 downstream classifier 分別使用 bag-of-words、static embeddings 與 contextual features。在同一 split 上比較，並保留 error cases。這能把 Week 2–5 串起來，又不需要引用未公開 Social NLP lecture。

## 延伸

Week 6 的 neural networks 會把 representation learning 接進多層模型，Week 7 再把 context-sensitive token states 放進 Transformer。進入後半季前應保留一個基準觀念：embedding 的品質永遠相對於資料、訓練目標與下游判準，不存在脫離用途的單一最好向量。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 5: Embeddings](https://web.stanford.edu/~jurafsky/slp3/5.pdf)
- [CS124 PA4 Embeddings](https://github.com/cs124/pa4-embeddings)
- [Speech and Language Processing, 3rd edition index](https://web.stanford.edu/~jurafsky/slp3/)
- [Stanford CS124 完整課程總覽](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)
