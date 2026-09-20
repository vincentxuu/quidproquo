---
title: "AI Engineer 面試日練 — 2026-09-21：ML Fundamentals"
date: 2026-09-21
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一輪到 ML Fundamentals——偏差變異取捨、L1/L2 正則化、梯度下降的批次選擇、不平衡資料的評估指標、交叉驗證與資料洩漏，加一題 Transunion 真實面試題：如何為大規模資料設計端到端 ML 專案的特徵、模型與驗證策略。"
tldr: "今天的 ML Fundamentals 輪練涵蓋五個核心概念:偏差變異取捨怎麼用學習曲線診斷、L1 跟 L2 正則化各自怎麼往 loss function 加懲罰項、批次梯度下降跟隨機梯度下降的取捨、不平衡資料為什麼準確率會騙人(該看 precision/recall/F1/ROC-AUC),以及交叉驗證中最容易忽略的資料洩漏陷阱。練習題改編自 Transunion 的真實 Data Scientist 面試題:如何為大規模資料的端到端 ML 專案設計特徵工程、模型選擇跟驗證策略,拆解思路把五個核心概念串成一套完整的決策框架。"
series:
  name: "AI Engineer 面試日練"
  order: 33
---

> 🌏 [English version](/en/posts/daily/2026-09-21-ai-interview-daily-en)

## 今日主題

星期一輪到 ML Fundamentals,這是所有 AI Engineer 面試的地基——不管後面考不考 LLM 或 agent,面試官幾乎都會先用這幾題確認你對「模型為什麼會學壞」有沒有紮實的直覺。今天選的練習題是一題端到端的專案設計題,因為它會逼你把偏差變異、正則化、驗證策略、評估指標這幾個平常分開背的概念,串成一套真正能在白板上講出來的決策框架,這正是 phone screen 到 onsite 都會用到的能力。

## 核心概念速記

### 偏差變異取捨,用學習曲線診斷而不是背定義

面試官不想聽你背「high bias 就是 underfitting、high variance 就是 overfitting」,他們想看你怎麼診斷。訓練誤差高、驗證誤差也高,通常是 high bias,該加訊號、換更有表達力的模型,或放鬆正則化;訓練誤差低但驗證誤差明顯更高,是 high variance,該加正則化、加資料,或換簡單一點的模型家族。把這個判斷講成「我會先畫學習曲線看兩條線的間距,再決定要往哪個方向調」,比單純背定義更接近 senior 等級的回答。

### L1 跟 L2 正則化,都是往 loss function 加懲罰項,但懲罰的東西不同

兩者都是為了防止模型記住訓練資料的雜訊而犧牲泛化能力,做法是在 loss function 上再加一項懲罰。L1(Lasso)加的是係數絕對值的和,效果是把不重要特徵的係數直接壓到零,等於順便做了特徵選擇;L2(Ridge)加的是係數平方的和,效果是把所有係數往零的方向縮小但不會真的歸零,適合特徵之間高度相關的情境。面試官常見的追問是「什麼時候選 L1、什麼時候選 L2」,答案是看你要不要稀疏解——需要可解釋性或自動特徵選擇就選 L1,只是想穩定模型、不在意稀疏性就選 L2。

### 梯度下降的批次選擇,是計算成本跟收斂穩定度的取捨

Batch gradient descent 用整個資料集算一次梯度,方向準但每一步很貴;stochastic gradient descent(SGD)只用一筆或一小批樣本,雜訊大但更新快、也更容易跳出局部最小值;mini-batch 介於兩者之間,是實務上的預設選擇。面試時被問「為什麼不乾脆一直用 batch gradient descent」,重點是講清楚大規模資料下 batch 版本每一步都要掃過全部資料,計算成本跟記憶體都撐不住,而 SGD 那種「雜訊反而幫助跳出局部最小值」的特性,在非凸的深度學習 loss surface 上是優點不是缺點。

### 不平衡資料下,準確率是最會騙人的指標

當正類只佔資料的 1%,一個永遠預測負類的模型也能拿到 99% 準確率,但完全沒用。面試官想聽到的是你會依業務風險換指標:precision 衡量「說是正類的裡面有多少真的是」、recall 衡量「真正的正類裡面抓到多少」,兩者有取捨,F1 是兩者的調和平均;如果業務更在意排序而不是絕對閾值,ROC-AUC 或更適合不平衡資料的 PR-AUC 會是更誠實的指標。講清楚「用哪個指標要看漏掉一個正類、還是誤判一個負類,哪個代價更高」,是判斷你有沒有工程直覺的關鍵。

### 交叉驗證的資料洩漏陷阱:每看一次驗證分數,就洩漏一點資訊

交叉驗證本身是為了讓模型評估更穩健,但最容易被面試官抓包的陷阱是:如果你反覆用驗證集的分數去調超參數、選特徵、選模型,你其實在悄悄把驗證集的資訊洩漏進模型選擇的過程,驗證分數會系統性地偏樂觀。正確做法是留一個完全不碰的 held-out test set 只在最後用一次,交叉驗證的角色只負責模型選擇跟超參數搜尋。面試時能講出「驗證分數不是免費的,每用一次都在花掉它的可信度」,會比只會說「我有做 cross-validation」更有說服力。

## 今日練習題

### 題目

你在面試 Data Scientist 職位,面試官說:「描述你會怎麼處理一個大規模資料的端到端機器學習專案——從特徵工程、模型選擇到驗證策略,你會做哪些選擇,為什麼?」

**來源**：改編自 PracHub 面試題庫(Transunion,Data Scientist,Medium)　**難度**：中等　**環節**：onsite / 技術深挖

### 拆解思路

1. **先釐清問題**：先問清楚「大規模」指的是列數還是特徵數、目標變數是分類還是回歸、資料是否有時間序性質、業務場景對哪種錯誤(false positive vs false negative)比較敏感。這些答案決定後面每一個選擇的方向。
2. **建立框架**：把專案拆成四個階段來講——特徵工程(要防洩漏)、模型家族選擇(對應偏差變異的甜蜜點)、驗證策略設計(要貼近正式環境的資料分佈)、評估指標選擇(要對應業務風險)。四個階段環環相扣,不是各自獨立的技術選型。
3. **深入核心**：特徵工程要強調「所有統計量(平均值、標準差、編碼映射)只能在訓練 fold 上 fit,再套用到驗證 fold」,不然驗證分數會虛高;模型選擇要講清楚大規模結構化資料通常先用 gradient boosting 當強 baseline,比深度學習更快迭代也更容易解釋,只有在資料量夠大、特徵有序列或非結構性質時才考慮更複雜的架構;驗證策略如果資料有時間性質要用 time-based split,不能隨機切,否則等於用未來資料預測過去;評估指標要對應前面釐清問題時問到的錯誤代價不對稱性。
4. **收尾**：把整個流程收束回「這套選擇不是一次性的,上線後要持續追蹤 training/validation 的差距有沒有隨時間擴大(代表 concept drift),定期重新驗證特徵的洩漏風險跟模型的校準狀態」,展現你想的是生產環境的完整生命週期,不只是拿到一個離線分數就結束。

### 範例回答(面試時可以這樣講)

> **先定位資料跟業務約束**：我會先確認資料規模是特徵維度大還是樣本數大、目標變數的類別是否不平衡、資料有沒有時間序性質,以及業務上漏掉一個正類跟誤判一個負類哪個代價更高——這些答案會決定我後面每一步的取捨,不是先射箭再畫靶。
>
> **特徵工程跟模型選擇**：特徵工程上我會嚴格用訓練 fold 去 fit 所有統計量再套用到驗證 fold,避免任何洩漏;模型上大規模結構化資料我會先用 gradient boosting(像 LightGBM)建一個強 baseline,因為它訓練快、可解釋性高,而且對特徵尺度不敏感,能快速看出偏差變異落在哪個區間,再決定要不要往更複雜的方向走,而不是一開始就上深度學習增加不必要的複雜度跟除錯成本。
>
> **驗證策略跟監控**:如果資料有時間性質,我會用 time-based split 而不是隨機 k-fold,避免用未來資料預測過去這種看起來準確率很高但上線就崩的陷阱;評估指標我會根據前面確認的錯誤代價選 F1 或 PR-AUC,而不是預設用準確率。上線後我會持續追蹤 training 跟 validation 的差距有沒有隨時間擴大,那通常是 concept drift 的早期訊號,搭配定期重新檢查特徵管線有沒有悄悄引入新的洩漏來源。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清資料規模、類別平衡、時間性質、錯誤代價不對稱性 | |
| 有解釋特徵工程要在訓練 fold 上 fit 避免資料洩漏 | |
| 有講出模型選擇對應的偏差變異取捨(先建 baseline 再決定要不要加複雜度) | |
| 有提到時間性資料要用 time-based split 而非隨機 k-fold | |
| 有依業務風險選評估指標,而不是預設用準確率 | |
| 加分項:提到上線後持續追蹤 training/validation 差距,監控 concept drift | |

## 延伸閱讀

- [Machine Learning Interview Questions | PracHub](https://prachub.com/categories/machine-learning) — 今日練習題來源題庫,收錄多家公司(Uber、OpenAI、Google、Transunion)的真實面試題與難度分級。
- [Feature Engineering Interview Questions – Top 30 with Answers (2026)](https://www.dataexpertise.in/feature-engineering-interview-questions-answers-2026/) — 特徵工程段落的延伸,涵蓋特徵選擇的 filter/wrapper/embedded 三種方法跟資料洩漏的具體案例。
- [25 Machine Learning Interview Questions for 2026 (And How Senior Candidates Actually Answer Them)](https://www.interviewpal.com/blog/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them) — 用 mindmap 整理 ML 面試的完整地圖,附資深候選人的範例回答語氣,可以對照今天的範例回答段落。

## 參考資料

- [Machine Learning Interview Questions | PracHub](https://prachub.com/categories/machine-learning) — 今日練習題「Transunion Data Scientist 端到端 ML 專案設計」的來源，是 AI Engineer 面試 ML Fundamentals 環節的常見真實題型。
- [25 Machine Learning Interview Questions for 2026 — InterviewPal](https://www.interviewpal.com/blog/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them) — 核心概念「偏差變異取捨,用學習曲線診斷」段落的來源。
- [Understanding L1 and L2 regularization — Weights & Biases](https://wandb.ai/mostafaibrahim17/ml-articles/reports/Understanding-L1-and-L2-regularization-techniques-for-optimized-model-training--Vmlldzo3NzYwNTM5) — 核心概念「L1 跟 L2 正則化」段落的來源。
- [GitHub - andrewekhalel/MLQuestions](https://github.com/andrewekhalel/MLQuestions) — 核心概念「梯度下降的批次選擇」與「交叉驗證的資料洩漏陷阱」段落的來源。
- [Most Asked Data Science Interview Questions and Answers](https://galaxyonknowledge.substack.com/p/top-data-science-interview-questions?r=4i4hyw) — 核心概念「不平衡資料下,準確率是最會騙人的指標」段落的來源。
