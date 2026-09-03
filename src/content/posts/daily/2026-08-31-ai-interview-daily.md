---
title: "AI Engineer 面試日練 — 2026-08-31：ML Fundamentals"
date: 2026-08-31
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "今日練 ML 基礎面試：AUC-ROC 在不平衡資料下為什麼會虛高、分類問題為什麼該用 cross-entropy 而不是 MSE、bagging 與 boosting 各修正哪種誤差，以及多重共線性為什麼不傷預測力卻毀了可解釋性。"
tldr: "ML fundamentals 面試考的是能不能在拿到一個『指標很漂亮但線上出包』的落差時，講出正確的診斷路徑。今天聚焦四個高頻考點：AUC-ROC 在極度不平衡資料下為什麼會虛高、PR-AUC 才是該看的曲線、分類為什麼要用 cross-entropy 而不是 MSE（牽涉梯度消失）、bagging 和 boosting 分別修正 variance 還是 bias，以及多重共線性只毀可解釋性不毀預測準確度的常見誤解。"
series:
  name: "AI Engineer 面試日練"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-08-31-ai-interview-daily-en)

## 今日主題

今天回到 ML Fundamentals 的第二輪——上週已經練過 bias-variance 診斷、L1/L2 的幾何直覺、loss function 選型跟 AdamW 的細節，這週換一批同樣高頻但角度不同的考點：為什麼分類要用 cross-entropy 而不是 MSE、指標本身在不平衡資料下會不會說謊、ensemble 方法各自在修正哪種誤差，以及一個經典的「相關係數陷阱」。這些都是面試官拿來測試「你是不是真的懂原理，還是只是背了公式」的經典切入點，常出現在 phone screen 的第一輪快問快答，也常常是 onsite 技術輪拿來延伸追問的起點。

## 核心概念速記

### Cross-Entropy vs MSE — 為什麼分類問題不能用均方誤差

分類問題理論上也可以用 MSE 當 loss（把 0/1 label 當成迴歸目標），但這樣做有個致命問題：搭配 sigmoid 輸出時，MSE 對「信心滿滿但答錯」的預測懲罰太輕，而且梯度會消失。假設真實標籤是 1，模型卻自信地預測 0.01，MSE 的懲罰只有 (1-0.01)² ≈ 0.98，跟預測 0.1 時的懲罰 (1-0.1)² ≈ 0.81 差不多，沒有真正反映出「這個錯誤有多離譜」。更嚴重的是，MSE 通過 sigmoid 反向傳播時，梯度會被 sigmoid 的導數相乘，而這個導數在輸出接近 0 或 1（也就是模型最自信、最需要被糾正的時候）會趨近於零——這正是典型的梯度消失。Cross-entropy 搭配 sigmoid/softmax 輸出層時，梯度會簡化成「預測機率減去真實標籤」這麼乾淨的形式，不會有這個問題，這也是為什麼現在幾乎所有分類模型都用 cross-entropy 而不是 MSE。

### PR-AUC vs ROC-AUC — 不平衡資料要看哪張曲線

ROC 曲線畫的是 True Positive Rate 對 False Positive Rate，而 FPR 的分母是「所有真實負例」（FP + TN）。當負例數量龐大（比如詐欺偵測裡 99% 都是正常交易）時，就算 FP 的絕對數量已經多到讓客服單爆炸，FPR 這個比例還是可能小到可以忽略，導致 AUC-ROC 看起來很漂亮但實際上模型的 precision 很差。PR 曲線畫的是 precision 對 recall，兩者都只看正例本身，不會被龐大的負例基數稀釋，所以在類別極度不平衡時，PR-AUC 才是誠實反映模型表現的指標——面試時提到「隨機分類器的 PR-AUC baseline 等於正例佔比，不是 0.5」會是一個加分細節。

### Bagging vs Boosting — 修正的是不同種類的誤差

Bagging（如 Random Forest）平行訓練多個模型，每個模型看不同的自助抽樣子集，最後把預測平均起來——這個平均動作主要在壓低 variance，因為每棵樹各自的隨機誤差會互相抵消，但每棵樹本身的系統性偏誤（bias）不會被消掉。Boosting（如 XGBoost、LightGBM）則是序列訓練，每一棵新樹專門去修正前面所有樹加總起來還沒學會的殘差，這個機制主要在壓低 bias，因為模型會不斷被逼著去擬合原本學不到的模式，代價是如果訓練太久、對雜訊也會學得太細，variance 反而可能上升。面試時的關鍵句是「bagging 治 variance、boosting 治 bias」，能講出為什麼，比背出兩個名詞的定義更有說服力。

### Multicollinearity — 不傷預測力，但毀了可解釋性

特徵之間高度相關時，模型的預測準確度其實不太受影響——如果兩個特徵相關係數 0.95，模型可以把 +50 分給其中一個、-48 分給另一個，數值上跟給 +2 和 0 幾乎一樣準。真正被摧毀的是「解釋」：這組不穩定的係數會讓你在不同的抽樣或欄位順序下得到完全不同的權重分配，任何從這些係數講出來的因果故事都不可靠。面試時該先反問「這是要做預測還是要做推論？」——如果只是要預測，多重共線性根本不是問題，用 ridge 處理掉就好；如果是要解釋每個特徵的因果貢獻，VIF（方差膨脹因子）超過 10 就要認真考慮拿掉或合併相關特徵。

## 今日練習題

### 題目

你訓練了一個信用卡詐欺偵測模型，離線測試時 AUC-ROC 高達 0.92，看起來表現很好，於是上線。但上線後客服團隊回報，被系統攔下來要求人工審核的交易裡，只有大約 30% 真的是詐欺（也就是 precision 只有 0.3），大量正常客戶的交易被誤攔，客訴暴增。請解釋這個落差是怎麼發生的，以及你接下來會怎麼處理。

**來源**：改編自 PracHub《Machine Learning Interview Questions: Complete 2026 Guide》常見考題　**難度**：中等　**環節**：phone screen / onsite technical

### 拆解思路

1. **先釐清問題**：先問清楚業務情境——目前的分類門檻設在哪裡？正例（詐欺交易）在資料裡大概佔多少比例？precision 低是因為誤攔了大量正常交易（FP 多），還是資料分布本身跟離線測試時不一樣（drift）？

2. **建立框架**：解釋 AUC-ROC 為什麼會在這種情境下「說謊」——它的 FPR 分母是全部的真實負例（正常交易），當負例數量遠大於正例時，就算 FP 絕對數量已經多到讓客服受不了，FPR 這個比例依然可以很小，AUC 因此還是很高。這時候該換一個角度看：PR 曲線只看正例本身的表現，不會被龐大的負例基數稀釋。

3. **深入核心**：拉出 confusion matrix，把「模型排序能力」（AUC-ROC 反映的）跟「在目前門檻下的實際表現」（precision/recall 反映的）分開討論。技術上最關鍵的 trade-off 是：門檻的選擇不該由某個指標數字決定，而是該由「誤攔一筆正常交易的成本」對比「漏掉一筆詐欺交易的成本」決定——如果誤攔成本（客訴、信任流失）遠高於目前設定隱含的水準，就該調高門檻、用 PR 曲線找出符合成本結構的新操作點。

4. **收尾**：強調上線後要持續監控 precision/recall（不能只看訓練時的離線指標），因為正例比例本身會隨時間 drift，門檻也需要跟著重新校準；同時提一句「AUC 高不代表校準（calibration）好」，這種細節會讓面試官知道你不只是背公式。

### 範例回答（面試時可以這樣講）

> AUC-ROC 高但 precision 低，第一個要懷疑的是類別極度不平衡讓 AUC 這個指標本身失真了——AUC 用的是 FPR，分母是全部的正常交易，數量遠大於詐欺交易，所以就算誤攔了一大堆正常客戶，FPR 這個比例還是壓得很低，AUC 看起來就很漂亮。這種情況下我不會再相信 AUC，會直接去看 PR 曲線和目前門檻下的 confusion matrix，確認 precision 差是因為 FP 太多，還是上線後的資料分布本身跟離線測試時就不一樣了。
>
> 如果確認是門檻問題，我會先跟業務端釐清一件事：誤攔一筆正常交易（客訴、信任受損）跟漏掉一筆詐欺交易（實際損失）哪個成本更高，這決定了門檻該往哪個方向調，而不是我自己憑感覺挑一個「看起來平衡」的點。如果誤攔成本明顯更高，我會用 PR 曲線找出在可接受的 recall 水準下 precision 最高的門檻，重新設定分類邊界。
>
> 上線後我會持續監控 precision 和 recall，而不是只看訓練時的離線 AUC，因為詐欺的正例比例本身會隨時間變化，門檻也需要定期重新校準；同時我會檢查模型的機率輸出有沒有校準（calibration）——AUC 只反映排序能力，不代表模型講的「這筆有 80% 是詐欺」真的接近 80% 的實際發生率。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 解釋了 AUC-ROC 在不平衡資料下為什麼會虛高（FPR 分母是龐大的負例數） | |
| 提到改用 PR 曲線 / PR-AUC 來看模型在正例上的真實表現 | |
| 門檻選擇根據 FP/FN 的實際成本，而不是憑感覺挑一個「平衡」的點 | |
| 提到上線後要持續監控 precision/recall，不能只信任離線 AUC | |
| 有先排除「資料分布本身 drift」這個可能性，而不是直接假設是門檻問題 | |
| 加分：提到 AUC 只反映排序能力，跟機率校準（calibration）是兩回事 | |

## 延伸閱讀

- [AI/ML Interview: Model Evaluation Metrics](https://www.techinterview.org/post/3233474426/ai-ml-interview-model-evaluation-metrics-precision-recall-f1-auc-roc-confusion-matrix-cross-validation/) — 完整整理 PR-AUC 何時該取代 ROC-AUC，以及各種評估指標的適用情境
- [Evaluation Metrics Deep Dive](http://fahimfaisal.info/ml_and_llm_learning/03_evaluation_metrics/EVALUATION_METRICS_DEEP_DIVE.html) — 更進一步的公式推導與常見面試「陷阱」整理，適合想再往深挖的人
- [25 Machine Learning Interview Questions for 2026](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — 對照 senior 與 junior 候選人在同一題上的回答差異

## 參考資料

- [Machine Learning Interview Questions: Complete 2026 Guide - PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — 對應「今日練習題」的原始題型與範例回答架構
- [AI/ML Interview: Model Evaluation Metrics - techinterview](https://www.techinterview.org/post/3233474426/ai-ml-interview-model-evaluation-metrics-precision-recall-f1-auc-roc-confusion-matrix-cross-validation/) — 對應「PR-AUC vs ROC-AUC」概念段落
- [Machine Learning Interview Questions (2026) - LastRoundAI](https://lastroundai.com/interview-questions/machine-learning) — 對應「Cross-Entropy vs MSE」概念段落
- [Machine Learning Interview Questions and Answers - GeeksforGeeks](https://www.geeksforgeeks.org/machine-learning/machine-learning-interview-questions/) — 對應「Bagging vs Boosting」概念段落
- [Linear & Logistic Regression Interview Questions - StackScholar](https://stackscholar.com/ai-ml-engineer-interview/questions/regression-and-regularization-interview) — 對應「Multicollinearity」概念段落
