---
title: "CS124 Week 3 Logistic Regression and Text Classification：從特徵到機率與 loss"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, logistic-regression, text-classification]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 4 }
tldr: "Week 3 用 logistic regression 串起文字特徵、sigmoid 機率、cross-entropy loss 與 gradient descent，讓分類不只輸出標籤，也能說明每個特徵如何推動預測。"
description: "Stanford CS124 Winter 2026 Week 3：logistic regression、文字分類、特徵、loss、梯度更新、Lab 2 與 PA2。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week3-logistic-regression-en)

Week 2 把文字變成 token 序列，Week 3 開始對整段文字做判斷。官方單元只有一條主線：用 logistic regression 做 text classification，並在 Lab 2 與 PA2 中自己走過 feature、probability、loss 與 update。

**版本：** CS124 Winter 2026。**單元：** Week 3，2026-01-20、01-22。**活動：** Logistic Regression Canvas material；1 月 20 日 Lab 2。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[SLP3 Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf)、[Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md)、[Lab 2 solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md)、[PA2](https://github.com/cs124/pa2-logistic-regression)。課綱指定 Chapter 4 pp.1–17，並說 pp.18、21 也有幫助。**缺口：** Canvas narration 與 Gradescope Quiz 2 不公開；目前主站 PDF 是課後更新版，本文只用與官方 agenda 對得上的核心章節，不把新增內容倒灌成 2026 課堂內容。

## 分類先從表示開始

指定的 [SLP3 Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf) 將文字分類定義為把輸入文件指派到類別，例如 sentiment、spam、language identification 或 authorship attribution。模型不直接讀懂字串，而是接收 feature vector `x`。最基本做法可以是詞是否出現、出現幾次，或經過正規化的計數。

這一步已經帶入假設。bag-of-words 忽略順序，卻保留哪些詞與標籤共同出現；加入 bigram 可保留短距離順序，維度與稀疏度也會上升。特徵不是中性的前處理，而是模型可以使用的證據範圍。

## 線性分數如何變成機率

logistic regression 先算 `z = w·x + b`。權重的正負表示特徵把結果推向哪個類別，絕對值表示推力大小。sigmoid `σ(z)=1/(1+e^{-z})` 再把任意實數壓到 0 與 1 之間，成為二元類別的條件機率。

這個模型仍是線性 decision boundary，但機率輸出帶來兩個好處：可以調整 threshold，而不是永遠以 0.5 作決定；也能用連續的 loss 來學權重。對高風險 spam filter，false positive 成本高，門檻就不該只靠預設值。

## Cross-entropy 懲罰自信的錯誤

[Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf) 將正確標籤為 `y`、模型給正類機率 `p` 時的 binary cross-entropy 寫成 `-[y log p + (1-y) log(1-p)]`。預測正確且有信心時 loss 小；方向錯又極度有信心時 loss 會急遽上升。

訓練就是讓整批資料的 loss 下降。對 logistic regression，梯度可整理成「預測與真值的差」乘上輸入特徵。gradient descent 沿負梯度更新 `w` 與 `b`；learning rate 太大會跨過低點，太小則學得很慢。Lab 2 的價值在於把公式拆回每一步計算，不讓 optimizer 藏掉錯誤來源。

## 評估不能只看 accuracy

類別不平衡時，永遠猜多數類也可能有漂亮 accuracy。分類系統需要 confusion matrix：true positive、false positive、true negative、false negative。precision 問被模型判成正類的有多少是真的；recall 問所有正類有多少被找到。兩者的取捨必須回到任務成本。

threshold 應在 validation data 上選，不是在看完 test results 後倒調。列出多個門檻下的 precision、recall 與 confusion matrix，再依 false positive／false negative 成本挑 operating point。若部署後 base rate 改變，同一門檻也未必維持原錯誤比例，仍需監測 calibration 與 class distribution。

這也是可解釋性最樸素的入口。線性模型可以列出權重最大的正負特徵，檢查模型學到的是任務訊號還是資料捷徑。但權重不是因果效果；相關詞也可能只是資料蒐集方式留下的痕跡。

## PA2 的交付意義

[PA2 repo](https://github.com/cs124/pa2-logistic-regression) 延續 Jupyter workflow，要求學生在 notebook 中完成 logistic regression。重要的不是呼叫現成 classifier，而是能從 features 計算 logits、probabilities、loss 與 gradients，並用資料驗證更新方向。

本週最小練習：拿兩句短文字建立手工詞彙表與 feature vectors，指定一組 `w,b`，算出 probability 與單筆 loss，再改一個權重看預測如何移動。若無法追到某個詞如何改變 `z`，就還沒有得到這個模型最值得保留的透明度。

## 從原始文字到 design matrix

Chapter 4 的 classifier pipeline 先把每篇 document 轉成 feature row，再把 labels 排成 target vector。若 vocabulary 有 `d` 個 features、batch 有 `m` 篇文件，design matrix 是 `m × d`。這個 shape 決定 `Xw+b` 是否能一次算完整 batch，也讓實作錯誤可定位。

binary feature 只記某詞有沒有出現，count feature 保存次數；兩者對長文件的反應不同。加入 bias feature 讓模型在所有文字 features 為零時仍能學 base rate。若資料 preprocessing 把 negation、大小寫或標點丟掉，模型之後無法靠訓練把它們找回來。

建立 vocabulary 時必須只讀 training split。若先看完整 dataset 再選 features，validation/test 的詞彙統計已滲入 training pipeline，即使 labels 沒直接洩漏，也會讓評估不再代表真正未見資料。相同規則適用 normalization parameters：平均、標準差或 IDF 都應由 training data fit，再套到其他 split。

稀疏文字矩陣不該無條件轉成 dense。大部分 document-word entries 是零；保留 sparse representation 能節省記憶體，也更接近實際 NLP pipeline。PA2 notebook 規模可能容許簡化，但理解稀疏性可避免把教學實作直接放大時爆掉。

## Binary 到 multinomial classification

二元 logistic regression 用 sigmoid 產生一個正類機率。若要在多個互斥 labels 中選一個，可對每類算 logit，再以 softmax 正規化。softmax 將所有類別的 exponentiated scores 除以總和，得到和為一的 distribution。

multinomial cross-entropy 只取正確 class 的 negative log probability。gradient 仍有「predicted distribution minus one-hot target」的形狀，因此 Week 3 的直覺能延伸到後續 vocabulary prediction：language model 的每個 next token 都是一次超大類別的 classification。

不過，互斥 softmax 與 multi-label task 不同。一篇文件若可同時屬於多個 topics，每個 label 應各有 sigmoid，而不是強迫 probability mass 在 labels 之間競爭。先說清楚 label semantics，才能選 output layer。

## Regularization 與資料捷徑

文字 feature 空間大，模型很容易把少數 training examples 的罕見詞記成巨大 weight。L2 regularization 在 objective 加入權重平方懲罰，促使 weights 不要無限制變大；L1 則傾向產生更多零權重。regularization strength 是 validation choice，不能用 test set 調。

權重表可以發現資料捷徑。例如 sentiment classifier 可能把某個演員名字學成負向特徵，因為 training corpus 中該名字剛好常出現在負評。這不表示模型理解演員造成 sentiment，只表示 dataset 中有穩定 association。

檢查方式不是只看 top weights。要把 false positives 與 false negatives 分組，尋找 negation、sarcasm、domain shift、rare words 或 annotation ambiguity。每一類 failure 對應不同下一步：加 feature、改資料、調 threshold，或承認 label 本身不一致。

## Gradient、batch 與數值穩定

單筆 gradient 容易受例子影響；full-batch 每次看全部資料但成本較高；mini-batch 在效率與估計噪音間折衷。無論用哪種，訓練紀錄至少要分開保存 training loss 與 validation metric，避免只看到 training 一直下降就宣稱泛化改善。

計算 sigmoid 與 log loss 時還要注意極端 logits。直接算 `log(sigmoid(z))` 可能 underflow；實作通常用穩定的 log-sum-exp／combined loss function。教學 notebook 若把公式逐步展開，應以小數值驗證，再確認 library loss 的 input 是 logits 還是 probabilities。兩者混用會得到看似能跑、實際錯誤的 objective。

gradient check 可選一個 weight，加減很小的 `ε`，以 loss 差分近似 derivative，再與 analytic gradient 比較。這是 PA2 之外仍忠於本週公式的練習，也能抓出 transpose、batch averaging 或 bias update 的錯誤。

## Lab 2 與 PA2 應留下的證據

公開 [Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md) 提供題目與 solutions。正確使用方式是先在沒有 solution 的情況下寫出每步 probability、loss 或 update，再逐項比對。只保存最後答案看不出錯在 feature、sign、normalization 還是 threshold。

[PA2 README](https://github.com/cs124/pa2-logistic-regression) 提供 Jupyter 與 Colab 兩條路徑，並要求 `deps/` 等 submission structure。自學者不需模仿 Gradescope 上傳，卻應保留 environment、notebook output 與公開可執行 checks。最終報告至少包含：split 方法、feature definition、class balance、confusion matrix、top weights、三個具體 errors。

這份 evidence package 比一個 accuracy 更接近 Week 3 agenda。它同時證明模型怎麼算、資料怎麼切、錯誤長什麼樣，也替 Week 6 neural classifier 建立可比較 baseline。

## 延伸

神經網路會把手工 feature 換成學到的 representation，但輸出 logits、softmax／sigmoid、cross-entropy 與 gradient-based learning 仍會再出現。Week 3 不是過時分類器插曲，而是後半季共同語言的低維版本。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 4: Logistic Regression and Text Classification](https://web.stanford.edu/~jurafsky/slp3/4.pdf)
- [CS124 Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md)
- [CS124 Lab 2 Solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md)
- [CS124 PA2](https://github.com/cs124/pa2-logistic-regression)
