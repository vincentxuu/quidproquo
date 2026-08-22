---
title: "CS224N 第 2 講：word2vec 如何把語意變成向量"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, nlp, word2vec, embeddings, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 3
tldr: "第 2 講從 word2vec 的預測任務、目標函數與梯度一路走到 count-based vectors 和評估，核心是：詞義不是查表得到的標籤，而是從上下文分布學出的高維座標。"
description: "逐段讀 CS224N Winter 2026 Lecture 2：word2vec、negative sampling、共現矩陣與詞向量評估。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-word-vectors-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 2 講排在 2026 年 1 月 8 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf)的 agenda 有六段：word2vec 介紹、目標函數梯度、最佳化基礎、以計數捕捉詞義，以及詞向量評估；開頭另有簡短課務說明。這堂的目標很具體：能把詞義理解成高維實數向量，並讀懂 embedding 論文。

## 從「詞典裡的節點」改成「上下文中的位置」

傳統詞彙資源如 [WordNet](https://wordnet.princeton.edu/)，把詞整理成同義詞集合與上下位關係。結構清楚，卻有人工維護、缺少新詞、同義程度難量化等限制。分布式表示換一個出發點：出現在相似上下文的詞，應該有相似表示。

[word2vec](https://arxiv.org/abs/1301.3781) 讓每個詞擁有向量，並用中心詞預測周圍詞。模型看到語料中的滑動視窗，調整向量，使真實的中心詞—上下文配對得到較高機率。這讓「語意」變成可由訓練目標操作的幾何關係。

## 目標函數與梯度在做什麼

投影片以 skip-gram 的 softmax 目標展開。對中心詞向量與每個可能的外部詞向量計算分數，再正規化成機率。負對數概似懲罰模型沒有把真實上下文排高。梯度的直覺是「預測分布減真實分布」：預測過高的候選被推遠，真實上下文被拉近。

完整 softmax 每次都要掃過整個詞彙表，代價高。官方閱讀把 negative sampling 列為下一步：每個真實配對只搭配少量負樣本，將多類別預測換成幾個二元判斷。它改變了實際訓練問題，因此不能把它只當成數值近似的小技巧。

## 預測不是唯一道路：也可以計數

agenda 接著回到共現矩陣：直接統計詞與詞、詞與文件在語料中共同出現的次數，再用 SVD 等方法壓縮。預測式方法逐例更新參數；計數式方法先建立全域統計。[GloVe](https://aclanthology.org/D14-1162/) 把兩者接起來，用詞對共現比率作為學習訊號。

這兩條路共享同一個假設：語料中的鄰近關係帶有語意。它也造成共同限制——罕見詞資料不足、單一向量混合多個詞義、訓練語料中的刻板關係會留在幾何空間裡。

## 評估：漂亮類比不等於下游有效

投影片區分 intrinsic 與 extrinsic evaluation。Intrinsic test 直接量相似度、類比或中間性質，便宜且容易分析；extrinsic test 把 embedding 放進真正任務，看整體準確率是否改善，較接近用途卻難以隔離是哪個元件造成差異。

所以看詞向量報告時，先問評估是在量向量本身，還是在量一個含許多其他決策的系統。單一 benchmark 的高分不能自動證明向量捕捉了「語意本身」。

## Skip-gram 的訓練資料怎麼從一句話長出來

假設句子是「the students opened their books」，window size 設為二。中心詞 opened 會和左邊 students、the 以及右邊 their、books 形成四個正例。視窗滑到 students，又形成以 students 為中心的配對。語料沒有人工語意標籤；上下文位置就是 supervision。

這個建構藏了幾個選擇。視窗小，比較容易學到句法或功能相近的詞；視窗大，主題相關性通常更強。距離是否加權、標點是否切斷、常見詞是否 subsample，也會改變向量幾何。說「用 word2vec」仍不足以重現結果，至少要知道 corpus、tokenization、window、dimension、negative samples 與 training steps。

同一個 surface word 只有一個 static vector，因此 bank 的金融與河岸語意會混在一起。若語料裡兩種用法比例不同，向量會更靠近常見 sense。後來 contextual representation 讓每次出現各有向量，正是回應這個限制。

## Softmax objective 從分數走到機率

對中心詞 (c) 與真實上下文詞 (o)，模型各取一個 center vector 與 outside vector。Dot product (u_o^T v_c) 是相容分數。Softmax 再拿它和詞彙表所有候選分數比較：

\[
P(o\mid c)=\frac{\exp(u_o^T v_c)}{\sum_{w\in V}\exp(u_w^T v_c)}
\]

Loss 是 (-\log P(o\mid c))。分母重要，因為模型不能只把正例分數一起抬高；它必須讓正例相對其他候選更突出。但分母也造成計算瓶頸：詞彙表若有十萬個 token，每個正例就要計算十萬個分數。

對 center vector 的梯度可讀成「模型目前預期的 outside vector 加權平均，減去真實 outside vector」。若真實詞機率太低，它的方向會被拉近；被過度預測的詞方向則推遠。這個 expected minus observed 結構日後會在 classifier 與 language model cross-entropy 一再出現。

## Negative sampling 改成幾個二元問題

[Negative sampling 論文](https://arxiv.org/abs/1310.4546)不計完整 softmax。每個正例配上從 noise distribution 抽出的 (K) 個負例，最大化真實配對的 sigmoid 分數，並最小化負例配對分數。計算從詞彙表大小降到與 (K) 成正比。

負例怎麼抽會影響學到什麼。只按原始詞頻抽，the 之類常見詞會塞滿負例；均勻抽又可能讓罕見詞比例過高。經典做法使用 unigram frequency 的 (3/4) 次方，在兩者間折衷。這是演算法定義的一部分，不是純 implementation detail。

Negative sample 不是語意上的反義詞，只是這個 window 中沒有觀察到的配對。把 cat 當 dog 的負例，不代表模型被告知兩者語意相反；大量不同上下文累積後，幾何才逐漸形成。

## Count-based vectors、PMI 與 SVD

另一條路先建立 co-occurrence matrix，row 是 target word，column 是 context。Raw counts 會被高頻詞主宰，因此常改用 pointwise mutual information，比較實際共同出現機率與獨立假設下的期望。Positive PMI 再把負值截為零。

矩陣維度很高且稀疏。Truncated SVD 將它分解並保留前 (k) 個方向，得到 dense vectors。降維能去除部分 noise，也可能丟掉 rare sense；(k) 不是越大越好。

GloVe 直接對非零共現統計最佳化，使向量 dot product 加 bias 逼近 log count，並用 weighting function 降低極罕見與極常見 pair 的影響。它和 skip-gram 使用不同 objective，但都把 distributional evidence 壓進向量空間。

## 向量幾何可以做什麼，不能證明什麼

Cosine similarity 忽略長度，量兩個方向夾角，常用於 nearest neighbors。Analogy 計算 relation offset 後找最近詞。某些規律會浮現，卻對 preprocessing、詞頻、候選排除與資料偏差敏感。

Nearest neighbor 也容易有 hubness：少數向量成為很多詞的近鄰。高維空間的距離集中、各向異性與頻率效應，會讓漂亮的二維投影產生錯覺。兩點在 t-SNE 圖上靠近，不能證明原空間語意相同。

向量還會重現 corpus association。職業與性別、族群與情緒詞的關聯可能出現在 embedding。Debias 若只消除一個線性方向，仍可能在鄰域與下游模型留下訊號。評估需要特定 harm model，而不是看幾個 analogy 變順眼。

## 把 Lecture 2 變成可以操作的 notebook

官方 Assignment 1 提供公開 notebook，讓學生建立共現矩陣、跑 SVD、載入現成詞向量並觀察 similarity 與 bias。自學時保留一份實驗表，每次只改一個選項：window size、dimension 或 corpus subset，記錄固定 query 的 neighbors 如何變化。

接著做 intrinsic/extrinsic 對照。Intrinsic 可選 word similarity；extrinsic 可用固定 classifier，只替換 embedding。若 intrinsic 上升但下游不動，並不矛盾，而是兩個 metric 測到不同性質。最後找一個 polysemous word，把不同 sense 的鄰近詞列出，看單一向量如何折衷。

這個練習的目的不是重現某篇論文分數，而是建立因果習慣：一次改一個 representation 決策，保留其餘 pipeline，才能知道幾何差異從哪裡來。

## 詞向量和現代 embedding table 的關係

Transformer 的 input embedding table 仍是每個 token 一個 learned vector，但它不再被當成最終語意表示。經過多層 self-attention 後，同一 token 會依上下文得到不同 hidden state。Static vector 是起點，contextual representation 才是模型在特定句子裡的表示。

這個差異也改變評估。拿 input table 做 nearest neighbors，可能看到字形、頻率或 tokenization pattern；拿中間層 hidden state 平均，則混入 context 與 layer 選擇。說「比較 embedding」時，要先標出是哪一層、哪種 pooling、是否 normalize，以及 token 和 word 如何對齊。

Subword 又讓一個 word 對應多個 vectors。若想得到 word-level representation，可以取第一 subword、平均、或用最後一層特定位置；每種選擇都不是自然真值。Lecture 14 會看到不同語言切分長度不一，使 pooling 與成本比較更敏感。

## 如何讀一篇 embedding paper

先找 representation unit：word、subword、character 還是 contextual occurrence。再找 objective 與 negative evidence；若只有 positive pairs，模型如何避免所有向量 collapse？第三找 corpus 與 preprocessing，特別是 rare word threshold。第四找 evaluation 是否同時含 intrinsic 與 downstream。

最後檢查 comparison fairness：dimension 是否相同、是否使用額外資料、hyperparameter 是否各自調整、OOV 如何處理。Embedding 結果很容易被 vocabulary coverage 影響；一個方法若跳過難詞，平均 similarity 可能看起來更高。

讀表格時不要只圈最高數字。把每個 metric 寫成一句它實際問的問題，例如「人類評為相似的詞對，cosine ranking 是否一致」或「固定 classifier 下是否改善 accuracy」。一句話寫不出來，代表 metric 名稱還沒有變成理解。

## 從分布假設看到根本限制

Distributional hypothesis 只能從語言使用推回意義。若 corpus 從不描述常識，向量沒有證據學到；若兩個詞出現在相同上下文但指涉相反角色，向量也可能靠近。Antonym 常共享句法框架，nearest neighbors 因而可能把 hot 與 cold 放在附近。

這不是訓練失敗，而是資料訊號與我們想問的 semantic relation 不同。要區分 similarity、relatedness、substitutability 與 entailment。單一 cosine 沒有能力同時代表所有關係；下游模型需要更多 context 或 supervision 才能分辨。

## 材料缺口

Winter 2026 錄影不公開。本文只依 Lecture 2 投影片與官方列出的核心論文整理；課堂示範、口頭推導與問答無法驗證，因此沒有補寫。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 2：Word Vectors 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf)
- [WordNet](https://wordnet.princeton.edu/)
- [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)
- [GloVe: Global Vectors for Word Representation](https://aclanthology.org/D14-1162/)
