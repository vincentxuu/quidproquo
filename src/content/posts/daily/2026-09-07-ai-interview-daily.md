---
title: "AI Engineer 面試日練 — 2026-09-07：ML Fundamentals"
date: 2026-09-07
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "今日練 ML 基礎面試的『上線後才爆炸』診斷題：學習曲線怎麼分辨 bias 還是 variance、為什麼 CV 0.85 上線卻只剩 0.70、類別不平衡該先重加權還是先 SMOTE，以及分類門檻為什麼不該預設 0.5。"
tldr: "這輪 ML Fundamentals 不再是背公式，而是練『模型上線後出包時該怎麼一步步排查』：用學習曲線的 train/val gap 判斷該加特徵還是該正則化、CV 分數跟上線分數不一致時要先懷疑 GroupKFold/TimeSeriesSplit 有沒有做對、類別不平衡的四層排查順序（先重加權而不是先 SMOTE），以及分類門檻該由 FP/FN 的實際成本算出來，不是預設 0.5，還要分清楚門檻選擇跟機率校準是兩件事。"
series:
  name: "AI Engineer 面試日練"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-07-ai-interview-daily-en)

## 今日主題

這是第三輪 ML Fundamentals。前兩次分別練了 bias-variance 分解公式、L1/L2 幾何直覺、cross-entropy vs MSE、PR-AUC vs ROC-AUC 這些「課本會考」的概念，今天換一個角度：面試官更喜歡追問的其實是「模型離線分數很漂亮，上線卻出包，你怎麼一步步排查」。今天聚焦四個高頻的診斷型考點——用學習曲線判斷該加模型容量還是該正則化、CV 分數跟上線分數對不上時的三種常見漏洞、類別不平衡該怎麼分層處理，以及分類門檻和機率校準為什麼是兩件不同的事。這類問題常出現在 onsite 的 case study 環節，也是資深候選人跟初階候選人拉開差距的地方。

## 核心概念速記

### 學習曲線（Learning Curves）— 判斷 bias 還是 variance 的正確做法

比起套公式硬算 bias² + variance，面試官更想聽到你怎麼「用資料診斷」：把訓練集和驗證集的指標畫成隨訓練集大小變化的兩條曲線。如果訓練誤差很低、驗證誤差卻遠高於訓練誤差，而且這個差距（gap）隨著資料量增加也沒有縮小，代表模型在記憶訓練樣本本身的雜訊，是 high variance，該做的是加更多資料、加強正則化、降低模型容量。如果訓練誤差本身就偏高，兩條曲線很早就收斂在一起變成一個「平台」，代表模型本身表達能力不夠，是 high bias，該做的是加特徵、加模型容量、放寬正則化。面試時常見的陷阱題是「訓練準確率 99%、驗證準確率 97%，這算 overfitting 嗎？」——正確答案是差距本身不是問題，重點是驗證分數本身夠不夠用，以及這個分數在不同 fold、不同時間切片下穩不穩定，一味為了縮小 gap 而削弱模型對誰都沒有好處。

### Stratified / Group K-Fold — CV 分數漂亮不代表上線可信

面試官很愛問的追問是：「你的 CV 分數是 0.85，為什麼上線後只剩 0.70？」背後最常見的三種漏洞是：類別不平衡時用普通 KFold，某一折可能剛好抽到極少正例，指標失真，這時該用 StratifiedKFold 保持每折的類別比例；資料裡如果有 user_id、session_id 這類重複實體欄位，同一個使用者的資料同時出現在 train 和 validation fold，模型部分記住了「這個人是誰」而不是學到可泛化的模式，這時該用 GroupKFold 讓同一實體只出現在同一折；資料如果帶時間序列性質卻用隨機切分，模型等於偷看到了「未來」的分布，這時該用 TimeSeriesSplit 或直接照時間切成 train-on-過去、test-on-未來。面試時能主動說出「如果欄位裡有 user_id，我會先講 GroupKFold」，這種細節比背 K-fold 定義更容易讓面試官相信你真的上線過模型。

### 類別不平衡的分層排查 — 先重加權，不要先 SMOTE

處理類別不平衡有明確的優先順序，成本低的先試。第一層：先確認不平衡本身是不是問題——如果類別可分性夠好，用對指標（PR-AUC 而不是 accuracy）評估，raw 分布也可能直接堪用。第二層：重加權，scikit-learn 的 `class_weight='balanced'` 或 XGBoost 的 `scale_pos_weight`，讓 loss 對少數類別的錯誤加大懲罰，不動資料本身，通常是效益最高的預設做法。第三層才是重採樣：欠採樣多數類別（資料量夠大時可行）、過採樣少數類別、或用 SMOTE 在少數類別鄰居之間插值合成新樣本——但 SMOTE 在高維度或類別型特徵很多的資料上，插值出來的樣本常常沒有實際意義（例如合成一個「一半是郵遞區號 A、一半是郵遞區號 B」的使用者），多個實證研究也顯示在梯度提升樹上重加權效果不輸甚至超過 SMOTE。第四層是重新框架問題，正例低於 0.5% 時可能該改用異常偵測或兩階段漏斗（先寬鬆過濾、再精準判斷）。無論用哪一層，重採樣一定要放進 CV 的每個 fold 裡面做，在 split 之前就重採樣會讓重複或合成的正例洩漏進驗證集，指標會被灌水。

### 分類門檻與機率校準 — 0.5 不是預設答案，是兩件不同的事

0.5 這個預設門檻只是工具的預設值，不是一個決定。正確的做法是先算出誤判的實際成本：如果漏掉一個正例（false negative）的成本是 C_fn，誤報一個負例（false positive）的成本是 C_fp，讓期望成本最小化的門檻是 C_fp / (C_fp + C_fn)——例如詐欺漏抓一次的成本是誤報一次的 50 倍，門檻可能該設在 2% 左右，離 0.5 很遠。成本不好量化時，就在驗證集（不是測試集）上掃過整條 precision-recall 曲線，挑出符合業務限制的操作點，例如「recall 最大化但 precision 不低於 80%」。門檻選擇跟機率校準是兩個獨立的問題：校準問的是模型說「這筆有 70% 機率」時，是不是真的有接近 70% 會發生，ROC-AUC 這種排序型指標完全看不出校準好不好；一旦你要拿機率去做期望值運算（機率乘上金額、乘上顧客終身價值），校準就變得舉足輕重。重加權、重採樣、淺層樹都會讓模型的機率輸出失準，診斷用 reliability diagram 和 Brier score，修正則用 Platt scaling（資料量小、失真呈 sigmoid 形時適用）或 isotonic regression（資料量大、失真形狀不規則時適用），而且要在獨立的校準集上 fit，不能用訓練資料本身。

## 今日練習題

### 題目

你的信用卡風控模型用 5-fold cross-validation 拿到 AUC 0.85（也用 PR-AUC 交叉確認過，數字同樣亮眼），上線一週後合作的風控團隊回報，實際線上的 AUC/PR-AUC 只剩 0.70，而且資料本身沒有觀察到明顯的 distribution drift。請說明你會怎麼一步步排查這個落差，以及背後可能的原因。

**來源**：改編自 Goodspace.ai《Machine Learning Interview Questions and Answers (2026)》中提到的常見面試追問「your CV score is 0.85 but production is 0.70, why?」　**難度**：中等　**環節**：onsite technical / cross-functional review

### 拆解思路

1. **先釐清問題**：問清楚前處理管線（scaler、任何重採樣）是在 train/validation split 之前還是之後做的；資料裡有沒有 user_id、session_id 這類可能讓同一實體同時出現在多個 fold 的欄位；資料本身有沒有時間序列性質；目前 CV 用的是普通 KFold 還是 StratifiedKFold。
2. **建立框架**：把落差的可能原因分成三類，且成本由低到高排查——前處理 leakage（在 split 前就 fit 了 scaler 或 SMOTE）、entity leakage（同一使用者同時出現在 train 和 validation fold）、temporal leakage（隨機切分而非按時間切分，讓模型在訓練時偷看到「未來」的分布）。
3. **深入核心**：技術上最關鍵的 trade-off 是排查順序——應該先假設是評估協議（CV protocol）本身設計錯誤，因為驗證成本低、也是最常見的原因；只有在協議確認沒問題之後，才輪到懷疑模型的真實泛化能力，因為那意味著要重做特徵甚至重新設計模型。具體驗證方法：把目前的 CV 換成 GroupKFold（按 user_id 分組）和 TimeSeriesSplit（按時間排序切分）重新跑一次，如果分數立刻從 0.85 掉到接近 0.70，就證實是評估協議的問題，而不是模型能力不足。
4. **收尾**：強調「上線後的分數才是唯一誠實的分數」，並提出把評估協議改成 out-of-time test set + GroupKFold/StratifiedKFold CV，列成往後所有上線模型的標準檢查項，而不是每次都臨時排查。

### 範例回答（面試時可以這樣講）

> 如果 CV 分數是 0.85 但線上只剩 0.70，而且資料沒有明顯 drift，我不會先懷疑模型能力，而是先懷疑評估協議本身出了問題——這是最常見、也最便宜排除的原因。我會先問三個問題：前處理（scaler、SMOTE 這類重採樣）是在 split 之前還是之後做的？資料裡有沒有 user_id 或 session_id 這種可能讓同一實體同時出現在 train 和 validation fold 的欄位？資料本身有沒有時間序列性質，而我們是用隨機切分而不是按時間切分？
>
> 這三個問題背後分別對應前處理 leakage、entity leakage、temporal leakage，而且驗證起來很快——我會直接把 KFold 換成 GroupKFold（按 user_id 分組）和 TimeSeriesSplit（按時間排序切分）重跑一次 CV。如果分數立刻從 0.85 掉到接近 0.70，就證實問題出在評估協議，而不是模型本身學得不夠；這時候真正該做的不是重新調參或換更複雜的模型，而是把訓練管線裡的 `fit_transform` 移到 split 之後，並且把 CV 換成正確的分組或按時間的切分方式。
>
> 如果換了正確的切分方式後 CV 分數依然接近 0.85，那才輪到懷疑模型本身——這時我會再檢查是不是有類似「申請當下才會產生的標籤衍生特徵」這種 leakage feature，而不是急著去加模型容量。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先懷疑評估協議（CV protocol）而不是直接假設模型能力不夠 | |
| 提到前處理（scaler/SMOTE）必須在 split 之後做，而非之前 | |
| 提到 GroupKFold 處理同一實體（user/session）跨 fold 洩漏 | |
| 提到時間序列資料要用 TimeSeriesSplit/out-of-time，而非隨機切分 | |
| 提出具體驗證方法（換切分方式重跑 CV），而不是只列可能原因 | |
| 加分：提到 leakage feature（標籤衍生特徵）是模型能力之外的另一種可能 | |

## 延伸閱讀

- [Machine Learning Interview Questions and Answers (2026) - Goodspace](https://goodspace.ai/interview-questions/machine-learning) — 今天四個核心概念的主要來源，用 60 題涵蓋從基礎到進階的完整框架，每題都附可執行的程式碼片段
- [Top 60+ Machine Learning Interview Questions For 2026 - igmGuru](https://www.igmguru.com/blog/machine-learning-interview-questions) — 補充 SMOTE、class weighting、門檻調整這幾種類別不平衡處理手法的整理
- [Top Machine Learning Interview Questions and Answers - Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — 附一段可直接跑的 pandas 程式碼，檢測資料集裡的類別不平衡

## 參考資料

- [Machine Learning Interview Questions and Answers (2026) - Goodspace](https://goodspace.ai/interview-questions/machine-learning) — 對應「學習曲線」「Stratified/Group K-Fold」「類別不平衡分層排查」「分類門檻與機率校準」四個概念段落，以及「今日練習題」的原始追問情境
- [Top 60+ Machine Learning Interview Questions For 2026 - igmGuru](https://www.igmguru.com/blog/machine-learning-interview-questions) — 對應「類別不平衡的分層排查」中 SMOTE、class weighting、門檻調整的處理順序整理
- [Top Machine Learning Interview Questions and Answers - Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — 對應「Stratified/Group K-Fold」段落中類別不平衡偵測與交叉驗證評估的討論
