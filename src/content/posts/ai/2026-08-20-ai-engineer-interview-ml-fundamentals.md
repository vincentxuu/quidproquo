---
title: "ML Fundamentals 面試攻略：從 bias-variance 到 evaluation metrics"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, machine-learning, fundamentals]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 ML 基礎環節的高頻考點——bias-variance tradeoff、regularization、loss functions、optimization、evaluation metrics。"
tldr: "ML 基礎面試不考你背公式，考你能不能用直覺解釋概念、在追問下不崩潰。高頻考點：bias-variance tradeoff 的實際意義、L1/L2 regularization 的選擇邏輯、cross-entropy 為什麼比 MSE 適合分類、SGD 與 Adam 的取捨、precision/recall 在不同場景的重要性差異。"
series:
  name: "AI Engineer 面試準備"
  order: 2
---

## 面試怎麼考 ML 基礎

ML 基礎在面試中出現的方式因環節而異。Phone screen 通常是快問快答：「解釋一下 bias-variance tradeoff」「L1 和 L2 regularization 有什麼差別」「你怎麼選 evaluation metric」。面試官在 30 秒內判斷你的理解深度——能用直覺講清楚的人過關，需要背誦公式才能開口的人不過。

Onsite 的 ML deep dive 不會單獨考這些概念，但會在討論你的專案時追問。你說你用了 random forest，面試官可能問「你怎麼處理 overfitting」；你提到用了 cross-entropy loss，追問就是「為什麼不用 MSE」。基礎概念不是獨立的考試科目，而是你在所有技術討論中的底層語言。

這篇整理五個最高頻的基礎主題，每個都附上面試時怎麼講才算好。

## Bias-Variance Tradeoff

**直覺解釋**：Bias 是模型的系統性偏差——模型太簡單，怎麼訓練都抓不到資料的真實模式。Variance 是模型的不穩定性——模型太複雜，對訓練資料的噪音太敏感，換一批資料預測就完全不同。

面試時這樣講：「想像你在射靶。High bias 是每次都偏左——你的瞄準方式有問題。High variance 是散佈很大——有時中靶有時飛掉。理想狀態是又準又集中，但現實中你降低 bias（用更複雜的模型）通常會增加 variance，反過來也是。」

**常見追問與回答**：

「你怎麼判斷模型是 high bias 還是 high variance？」——看 training error 和 validation error 的落差。Training error 高 + validation error 也高 = high bias（underfitting）。Training error 低 + validation error 高 = high variance（overfitting）。

「你會怎麼處理 high variance？」——三條路：增加訓練資料、減少模型複雜度（fewer features、shallower tree）、加 regularization。如果是 ensemble 方法，bagging（如 random forest）天然降低 variance。

「Bias-variance tradeoff 在深度學習時代還成立嗎？」——經典理論說模型複雜度超過某個點 variance 必然升高，但深度學習的 double descent 現象顯示：模型參數超過訓練資料量夠多之後，test error 反而再度下降。不過在面試中提到這個要小心——先確認面試官熟悉這個概念，否則容易變成你在講面試官不懂的東西。

## Regularization

Regularization 的核心思想是限制模型的自由度來降低 overfitting。面試最常考的是 L1 和 L2 的差別。

**L1（Lasso）**：在 loss function 加上權重的絕對值總和。效果是把不重要的權重直接壓到零——L1 自帶 feature selection。面試時說「如果我預期很多 feature 是噪音，用 L1 可以自動篩掉它們」。

**L2（Ridge）**：在 loss function 加上權重的平方和。效果是讓所有權重都變小但不會變成零——L2 傾向保留所有 feature，只是壓縮它們的影響力。面試時說「如果我相信大多數 feature 都有貢獻，只是不想讓任何一個 feature 主導模型，用 L2」。

**Elastic Net**：L1 + L2 的混合。面試時通常不會深問，但如果被問到就說「當 feature 之間有高度相關性時，純 L1 會隨機選其中一個，Elastic Net 傾向保留整組」。

**Dropout**：深度學習中最常用的 regularization。訓練時隨機關掉一定比例的神經元，強迫網路不依賴任何單一神經元。直覺解釋：「相當於同時訓練很多個子網路，inference 時取它們的平均——這和 ensemble 的效果類似。」常見追問是 dropout rate 怎麼選——經典做法是隱藏層 0.5、輸入層 0.2，但實務上都要 tune。

## Loss Functions

面試官問 loss function 的目的通常不是要你推導數學，而是要你解釋「為什麼在這個場景選這個 loss」。

**Cross-Entropy vs MSE 用在分類**：這是最高頻的問題。答案的核心是梯度行為。MSE 在預測值遠離正確答案時梯度反而變小（sigmoid 飽和區），導致訓練初期學很慢。Cross-entropy 在預測錯誤時梯度大、預測正確時梯度小，完美匹配我們想要的學習行為。面試時說「cross-entropy 讓模型在犯大錯時學得快，MSE 在犯大錯時反而學得慢，所以分類用 cross-entropy」。

**Binary vs Categorical Cross-Entropy**：二分類用 binary，多分類用 categorical。如果被追問 multi-label 怎麼辦——每個 label 獨立套 binary cross-entropy。

**Regression 的 Loss**：MSE 對 outlier 敏感（平方放大效果），MAE 對 outlier 魯棒但在零附近不可微。Huber loss 是兩者的混合：小 error 用 MSE 的行為，大 error 用 MAE 的行為。面試時提到 Huber loss 會加分。

## Optimization

面試不會要你推導更新公式，但會問你「為什麼選 Adam 而不是 SGD」。

**SGD（Stochastic Gradient Descent）**：最基本的優化器。每步用一個 mini-batch 的梯度更新參數。問題是 learning rate 很難調——太大會震盪，太小收斂慢。而且在 loss landscape 有很多鞍點和平坦區域時容易卡住。

**Momentum**：SGD 加上「慣性」——不只看當前的梯度，還看過去的梯度方向。效果是在一致的方向上加速、在震盪的方向上減速。面試時說「想像一顆球滾下山坡，momentum 讓它在下坡時加速、遇到小坑不會停」。

**Adam（Adaptive Moment Estimation）**：結合 momentum 和每個參數自適應的 learning rate。對大多數問題開箱即用，不太需要仔細調 learning rate。這是目前最常用的 default choice。

**面試時的取捨邏輯**：「大多數情況我從 Adam 開始，因為它對 hyperparameter 不敏感，能快速得到 baseline。如果追求最終效能（例如 ImageNet 訓練），SGD + momentum + learning rate schedule 通常能比 Adam 收斂到更好的 generalization——但需要更多 tuning 時間。」

## Evaluation Metrics

面試官考 evaluation metrics 的真正目的是看你能不能根據業務場景選對指標。

**Precision vs Recall**：Precision 是「你說是的裡面有多少真的是」，recall 是「真的是的裡面你抓到多少」。面試最愛問的場景題：

- 「你在做垃圾郵件偵測，重 precision 還是 recall？」——重 precision。把正常郵件標成垃圾的代價很高（用戶可能漏掉重要信），漏掉一些垃圾郵件的代價相對低。
- 「你在做癌症篩檢，重 precision 還是 recall？」——重 recall。漏掉一個真正的癌症患者的代價遠高於把健康的人標成可疑（後者只是多做一次確認檢查）。

**F1 Score**：Precision 和 recall 的調和平均。當兩者都重要且資料不平衡時用。但面試時不要預設用 F1——先問清楚業務場景再決定。

**AUC-ROC**：衡量模型在所有 threshold 下的排序能力。AUC = 0.5 等於隨機猜，AUC = 1.0 完美分類。優點是不依賴特定 threshold，適合比較不同模型。但在極度不平衡的資料集上，AUC 可能給出過於樂觀的數字——這時 AUC-PR（precision-recall curve 下的面積）更可靠。

## 常見陷阱與面試技巧

**不要背定義，要講直覺**。面試官問「什麼是 regularization」時，不要回答「在 loss function 加上一個 penalty term」。要說「regularization 是故意限制模型的表達能力，讓它不要過度記住訓練資料的噪音，而是學到真正的模式」。

**被追問時承認邊界**。如果面試官問到你不確定的地方（比如 double descent 的數學解釋），說「我知道這個現象的直覺解釋，但數學上的嚴格解釋我不確定」比硬掰好得多。

**用實際經驗佐證**。每個概念最好都能接上一句「我在之前的專案中遇到過這個——當時我們用了 X 來處理 Y」。沒有實際經驗的概念，準備一個假設場景也行，但要說清楚是假設。

**注意面試官的信號**。如果面試官在你講完 bias-variance 之後點頭往下走，不要自己加碼講 double descent。如果面試官追問，才展開。面試時間有限，不要在不需要深入的地方消耗時間。

## 參考資料

- [Chip Huyen — ML Interviews Book](https://huyenchip.com/ml-interviews-book/) — ML 基礎面試考點的完整整理，本篇的 bias-variance、regularization、loss function 考點框架來自此書
- [Stanford CS229 Lecture Notes](https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf) — Andrew Ng 的 ML 課程筆記，涵蓋 regularization、optimization、evaluation metrics 的數學推導與直覺解釋
- [An Overview of Gradient Descent Optimization Algorithms — Sebastian Ruder](https://arxiv.org/abs/1609.04747) — SGD、momentum、Adam 等 optimizer 的系統性比較，本篇 optimization 段落的演進邏輯參考此文
