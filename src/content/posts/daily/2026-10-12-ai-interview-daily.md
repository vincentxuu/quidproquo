---
title: "AI Engineer 面試日練 — 2026-10-12：ML Fundamentals"
date: 2026-10-12
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一輪到 ML Fundamentals——bias-variance tradeoff 怎麼從 train/validation 差距診斷、L1 跟 L2 regularization 為什麼一個會把權重壓到剛好等於零、cross-validation 怎麼依資料型態選 StratifiedKFold／TimeSeriesSplit／Nested CV,加一題 Amazon／Meta／Google 面試迴圈常見出題:AUC-ROC 很高但 precision 很低,代表什麼、你會怎麼處理。"
tldr: "今天的 ML Fundamentals 輪練涵蓋四個核心概念:bias-variance tradeoff 要看 train/validation 的差距大小來判斷該往哪個方向調、L1 regularization 靠固定梯度把權重壓到剛好等於零(L2 的梯度隨權重縮小只會逼近零)、cross-validation 策略要依資料型態換(分類用 StratifiedKFold、時間序列用 TimeSeriesSplit、同時做超參數搜尋跟效能評估要用 Nested CV 避免過度樂觀)、以及 AUC-ROC 跟 PR-AUC 在資料不平衡時給出完全不同的訊號。練習題是 Amazon／Meta／Google 面試迴圈常出現的經典題:模型的 AUC-ROC 很高但 precision 很低,這代表什麼、你會怎麼處理,拆解思路把「先懷疑哪裡」到「怎麼用 PR curve 取代 ROC 做診斷」串成一套完整推理鏈。"
series:
  name: "AI Engineer 面試日練"
  order: 54
---

> 🌏 [English version](/posts/daily/2026-10-12-ai-interview-daily-en)

## 今日主題

星期一輪到 ML Fundamentals，今天選的四個概念圍繞「同一個模型，換一個角度看會給出完全不同的結論」。Bias-variance tradeoff、regularization、cross-validation、評估指標，這些名詞每個候選人都背得出定義，但面試官真正要測的是你能不能在一個具體情境裡，說出「為什麼這個指標在這裡會騙人」「為什麼這個驗證方式在這裡會洩漏未來資訊」。今天的練習題也刻意選一個會把這幾個概念同時串起來的場景題。

## 核心概念速記

### Bias-Variance Tradeoff：看 Train/Validation 差距診斷，不是背定義

Bias 是模型假設太簡單帶來的誤差（比如用線性模型硬套非線性資料），variance 是模型對訓練資料太敏感帶來的誤差（換一批訓練資料，學出來的模型就差很多）。面試時真正有鑑別力的不是講出定義，是能從 train/validation 的分數差距讀出病灶：兩者都低代表 underfitting（高 bias），train 低但 validation 明顯更高代表 overfitting（高 variance）。對應的藥方也要分開講：bias 太高往模型複雜度加（更多特徵、更深的樹、換更有表達力的模型），variance 太高往正則化、更多資料、或降低模型複雜度走——講混在一起會被追問「那你具體會調哪個參數」。

### L1 vs L2 Regularization：固定梯度 vs 縮小梯度

兩者都是在 loss function 後面加一個懲罰項，但懲罰的形狀不同，導致行為完全不同。L2（Ridge）的懲罰是權重的平方，對權重微分之後梯度跟權重大小成正比，權重越小，拉它往零走的力道也越小，所以 L2 只會把權重壓得很小，幾乎不會剛好等於零。L1（Lasso）的懲罰是權重的絕對值，對權重微分之後梯度是常數（跟權重大小無關），所以不管權重已經多小，L1 都用同樣力道把它往零拉，直到真的壓到零為止——這就是為什麼 L1 會產生 sparse 解、等於自動做特徵選擇，而 L2 不會。選哪個要看情境：懷疑很多特徵根本沒用、想要自動篩選用 L1；特徵之間高度相關、想要穩定的係數估計用 L2。

### Cross-Validation 策略：依資料型態換，不是永遠 k-fold

分類問題上幾乎沒有理由用一般 KFold——類別不平衡時，一般 KFold 切出來的某一折可能完全沒有少數類別樣本，一定要用 StratifiedKFold 讓每一折維持跟全體資料一樣的類別比例。時間序列資料用一般 k-fold 更是直接出事：隨機切分會讓訓練集裡混進「未來」的資料，模型等於偷看了答案，CV 分數好看到不切實際，上線後直接崩掉——正確做法是 TimeSeriesSplit 的 walk-forward validation，訓練窗只往前擴張，絕對不包含測試窗之後的資料，如果預測目標跟特徵之間有已知的時間延遲，還要在訓練跟測試之間留一段 gap 防止洩漏。另一個常被面試官抓到的陷阱是：如果同一組 CV folds 同時拿來做超參數搜尋又拿來做最終效能評估，分數會系統性偏高，因為你等於挑了剛好在這幾折表現最好的參數組合——要避免這個偏誤，要用 nested cross-validation，外層 k-fold 負責估計泛化效能、內層 k-fold 負責搜超參數，兩件事徹底分開。

### AUC-ROC vs PR-AUC：資料不平衡時給出不同訊號

AUC-ROC 衡量的是「所有門檻值下，模型把正樣本排在負樣本前面的能力」，這個指標對類別比例不敏感，代表就算正樣本只佔 1%，AUC-ROC 仍然可能很高，因為它看的是排序，不是數量。但 precision 看的是「我標記為正的樣本裡，有多少真的是正樣本」，正樣本本來就稀少時，就算假陽性率很低，換算成絕對數量還是會比真陽性多，precision 自然被拉低。這就是為什麼「AUC-ROC 很高但 precision 很低」在不平衡資料上其實是常態而不是異常——診斷時該換看 precision-recall curve 而不是 ROC curve，因為 PR curve 在類別不平衡下才能反映真實的取捨。

## 今日練習題

### 題目

你的模型 AUC-ROC 很高，但 precision 很低，發生了什麼事？你會怎麼處理？

**來源**：PracHub「Machine Learning Interview Questions: Complete 2026 Guide」整理的公司標記題庫，標注為跨 Amazon／Meta／Google 面試迴圈都會出現的高頻經典題　**難度**：中等　**環節**：technical screen / onsite fundamentals round

### 拆解思路

1. **先釐清問題**：面試時該先問——這是分類問題嗎？正負樣本比例大概多少？現在的 decision threshold 是怎麼定的（預設 0.5 還是已經調過）？業務場景比較在意 precision 還是 recall？
2. **建立框架**：先把兩個指標的定義講清楚——AUC-ROC 是對所有門檻值的排序能力做積分，不管類別比例；precision 是在「已經做出正向判斷」這個條件下算出來的比例，跟正樣本的絕對稀缺程度直接相關。兩者一個看排序、一個看在特定門檻下的絕對數量，這是落差的根源。
3. **深入核心**：技術上最關鍵的 trade-off 是——不平衡資料下，一個小的假陽性率乘上大量的負樣本基數，換算成絕對數量還是會超過真陽性，這跟模型「排序能力好不好」是兩件事，模型可以同時排序很準、precision 又低。真正該做的診斷是換看 precision-recall curve，而不是繼續看 ROC curve。
4. **收尾**：給出可執行的修法——先確認問題是不是出在 threshold 選得不合適，嘗試往上調高 threshold 看 precision-recall 怎麼變化；如果調 threshold 換不到可接受的平衡，才考慮在訓練階段用 class weighting 或 loss 加權改變模型本身的傾向；最後回頭跟業務確認，這個產品場景到底該優先保 precision 還是保 recall，再決定要往哪個方向調。

### 範例回答（面試時可以這樣講）

> AUC-ROC 很高但 precision 很低，我第一個反應不是「模型壞了」，是先確認這是不是一個類別不平衡的問題。**先講為什麼兩者會分開**：AUC-ROC 是對所有門檻值做排序能力的積分，完全不管正負樣本的比例，所以就算正樣本只佔 1%，只要模型把正樣本大致排在負樣本前面，AUC-ROC 就會很高；但 precision 是「我標記為正的裡面有多少是真的正」，正樣本本來就稀少時，即使模型的假陽性率壓得很低，換算成絕對數量，假陽性還是容易超過真陽性，precision 自然被拉低——這不代表模型排序能力差，是兩個指標在回答不同的問題。
>
> **接著講我會怎麼診斷**：我會先丟掉 ROC curve，換畫 precision-recall curve，因為 PR curve 在不平衡資料下才能看出模型在不同 threshold 下真正的取捨；然後去檢查現在用的 decision threshold 是不是還停在預設的 0.5，通常把 threshold 往上調，precision 會改善，但 recall 會跟著掉，這個 trade-off 要攤開來看，不是憑感覺調。
>
> **最後講怎麼收斂成行動**：如果單純調 threshold 找不到可接受的平衡點，我會考慮在訓練階段做 class weighting 或換一個對不平衡更穩健的 loss；但在動模型之前，我會先回頭跟業務確認這個場景到底該優先保 precision（例如誤殺正常使用者的代價很高）還是保 recall（例如漏抓的代價很高），這個答案應該由業務指標決定，不是我自己先假設。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚 AUC-ROC 看排序、對類別比例不敏感 | |
| 有講清楚 precision 在不平衡資料下容易被絕對數量拉低 | |
| 有提到換看 precision-recall curve 而不是繼續看 ROC curve | |
| 有提到檢查/調整 decision threshold，並點出會跟 recall 互相取捨 | |
| 有給出 threshold 調整換不到平衡時的下一步（class weighting / loss 加權） | |
| 加分項：有把最終決策權交還給業務指標（哪個場景該優先保哪個指標），不是自己悶著頭調參數 | |

## 延伸閱讀

- [Cross-Validation Strategies: K-Fold, Time Series, and Nested CV | techinterview.org](https://www.techinterview.org/post/3233460018/cross-validation-strategies-k-fold-time-series-and-nested-cv/) — 把 StratifiedKFold、TimeSeriesSplit、Nested CV 跟常見的 data leakage 陷阱整理成一張決策表，附完整 sklearn 程式碼。
- [Top 20 Regularization Interview Questions and Answers | Towards AI](https://towardsai.com/p/machine-learning/top-20-regularization-interview-questions-and-answers) — L1/L2 regularization 的 20 道延伸問答，適合把今天「固定梯度 vs 縮小梯度」的機制講法再練熟。
- [25 Machine Learning Interview Questions for 2026 | InterviewPal](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — 用 mindmap 把 fundamentals、evaluation、production 三層題型分開整理，適合檢查自己有沒有漏掉哪一層。

## 參考資料

- [Machine Learning Interview Questions: Complete 2026 Guide | PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — 今日練習題「AUC-ROC 很高但 precision 很低」的原始出處，含 Amazon／Meta／Google 面試迴圈的出題傾向比較與範例作答。
- [Cross-Validation Strategies: K-Fold, Time Series, and Nested CV | techinterview.org](https://www.techinterview.org/post/3233460018/cross-validation-strategies-k-fold-time-series-and-nested-cv/) — 核心概念「Cross-Validation 策略」段落的來源，含 StratifiedKFold 規則、TimeSeriesSplit walk-forward 範例與 nested CV 的偏誤說明。
- [Top 20 Regularization Interview Questions and Answers | Towards AI](https://towardsai.com/p/machine-learning/top-20-regularization-interview-questions-and-answers) — 核心概念「L1 vs L2 Regularization」段落的佐證來源。
- [25 Machine Learning Interview Questions for 2026 | InterviewPal](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — 核心概念「Bias-Variance Tradeoff」與「AUC-ROC vs PR-AUC」段落的佐證來源，確認這些題型在 2026 年面試迴圈中的出現頻率。
