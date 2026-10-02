---
title: "CS189 Spring 2026 Lec 1–3：ML 問題框架、資料工具、術語與技巧"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, scikit-learn, pandas]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 3
tldr: "CS189 Spring 2026 的前三講不急著推公式，先教你怎麼判斷一個問題該不該用 ML、怎麼用 pandas 和 Plotly 看資料、怎麼用 scikit-learn 走完一次訓練、驗證、測試的流程。Lec 1 只有投影片沒有錄影；Lec 2–3 有投影片與影片；Discussion 1 是微積分、線代、機率的熱身，附解答與 walkthrough。這三講是 HW1 的直接前置。"
description: "導讀 Berkeley CS189 Spring 2026 Lecture 1–3 與 Discussion 1：ML 問題的三分法與學習設定分類、pandas 與 Plotly 資料工具、train/validation/test 切分、特徵工程、歸納偏誤與 no free lunch、超參數調整，以及每講對應的 Bishop 章節與取得方式。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）。為什麼選這個學期，見上一篇[版本地圖](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)。

多數機器學習課第一週就開始推導演算法。CS189 Spring 2026 反過來做。[Lecture 1 投影片](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)有一頁直接寫「Teach ML Backwards」：先教什麼時候該用 ML、怎麼框定問題、怎麼準備資料、怎麼訓練與評估，演算法細節之後再補。前三講就是這個「倒過來教」的開場，走完它，你手上會有做 HW1 需要的工具。

| 講次 | 日期 | 教材 | Bishop 建議閱讀 |
|---|---|---|---|
| Lec 1 Introduction + ML problem framing | 1/20 | [PDF](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)（無錄影） | 1.1–1.3 |
| Lec 2 Data Tools | 1/22 | [PDF](https://drive.google.com/file/d/1ShsOM4DwEE1xkML4Zu5JlJFJjibu55xP/view?usp=sharing) / [影片](https://www.youtube.com/watch?v=IzfaWKuxThw&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE) | 課本沒有涵蓋 |
| Lec 3 ML Mechanics: Terminology and Techniques | 1/27 | [PDF](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link) / [影片](https://www.youtube.com/watch?v=oVo_RajZ3aE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=1) | 1.1–1.2.6、3.5.3、4.1、4.1.1、5.4.3、9.1、9.1.2 |
| Discussion 1 | 第 2 週 | [題目](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing) / [解答](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing) / [Walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3) | — |

課本是 Bishop 與 Bishop 的《Deep Learning: Foundations and Concepts》，[bishopbook.com](https://www.bishopbook.com) 有免費的線上閱讀版。

## Lec 1：什麼問題該交給 ML

Lecture 1 給的定義很短：機器學習是透過資料改進（學習）的軟體系統。它用兩個經典例子說明為什麼需要這件事：垃圾郵件很難定義，卻很容易舉例；人臉偵測很難寫成程式，卻很容易示範。

接著它把問題分成三類：

- **工程問題**：寫得出直接的演算法或規則。
- **ML 問題**：解答容易示範或評估，卻很難直接實作。
- **人的問題**：問題本身說不清楚，或需要人的判斷。

投影片補了一句：真實系統通常三者都要。聊天機器人被拿來當例子，1966 年的 [ELIZA](https://en.wikipedia.org/wiki/ELIZA) 用規則寫，而好的對話雖然寫不出規則，卻示範得出來、也判斷得出好壞，所以是 ML 問題。

學習設定分三種，依你觀察到什麼來分：監督式學習看到 (X, Y) 配對，非監督式學習只看到 X，強化學習看到 X 和 reward。投影片明說強化學習不在這門課的範圍。

Lecture 1 用一個飲料試喝資料集把術語一次走完：兩個特徵（酸度、甜度）、二元標籤（好不好喝），先用 decision stump、再用深度 2 的決策樹、最後用線性分類器分割特徵空間。重點落在一個「一定存在的爛模型」：把訓練集整個背下來，對訓練集完全正確，對新資料卻毫無預測力。這就是泛化問題的起點。

最後它畫出貫穿整學期的 ML 生命週期：**Learning Problem → Model Design → Optimization → Predict & Evaluate**。投影片也列出這門課要用的工具：pandas、Plotly、Matplotlib、scikit-learn、PyTorch、Hugging Face、Weights & Biases，預設環境是 Google Colab。

**今晚就能做的事**：想一個你工作上的問題，照三分法判斷它是工程問題、ML 問題還是人的問題。如果是 ML 問題，寫下「我要預測什麼、我怎麼判斷成功、我手上有什麼資料」三行。

## Lec 2：pandas 與視覺化

Lecture 2 是純工具課，投影片最後一頁寫明「課本沒有涵蓋這個主題」。它的理由是：每個模型都從資料開始、也在資料上評估，不管進實驗室或業界，整理與視覺化資料都是基本功。

pandas 部分依序講：

- **資料結構**：Series 是一維有標籤的陣列，DataFrame 是由 Series 組成的表格。
- **探索**：`head()`、`tail()`、`info()`、`describe()`、`sample()`、`value_counts()`、`unique()`。
- **選取**：`iloc` 依位置、`loc` 依標籤、`[]` 依情境。投影片特別標出切片的差別：`iloc` 不含右端點，`loc` 含右端點。
- **篩選**：布林陣列，用 `&`、`|` 組合條件。
- **修改**：新增欄位、`drop`（預設不是原地修改）、`sort_values`、處理缺值（`isnull`、`dropna`、`fillna`）。
- **聚合與合併**：`groupby().agg()`、`pivot_table`、inner/outer/left/right join。

視覺化部分，課程選 Plotly 和 Weights & Biases，而不是 Matplotlib。投影片的理由是互動式圖表比較容易切片探索，而「更快獲得洞見」是這門課的重點。它也承認多數論文圖表仍用 Matplotlib。Plotly 教三種用法：pandas 內建的 `.plot`（先設定 `plotting.backend` 為 `plotly`）、Plotly Express、graphics objects。

**今晚就能做的事**：隨便找一個 CSV，用 `df.groupby(...).agg(...)` 算一個分組統計，再用 `px.scatter` 畫一張可以 hover 的散佈圖。

## Lec 3：一次走完 ML 生命週期

Lecture 3 的目標寫在第二頁：用高層次、不嚴謹的方式介紹主要概念，之後再正式回頭講；示範怎麼用 Python 做基本的機器學習；走過生命週期每一步；為 HW1 做準備。主要工具是 [scikit-learn](https://scikit-learn.org/stable/)。

貫穿整講的例子叫 FashionHub：一個二手衣物交換網站，想依照賣家上傳的照片自動標上衣物類別。這是一個多類別分類問題。

### 先看資料

投影片列出看資料時要問的問題：有多少筆資料（N）、特徵有幾維（D）、分布長怎樣、是否都是數值、有沒有缺值、標籤是否離散、有沒有標錯。

### 準確率的陷阱

Accuracy 是正確預測數除以總數。投影片用一個例子提醒它的問題：號稱 99% 準確率的 COVID 照片分類器。準確率混合了兩種錯誤：偽陽性（Type 1）與漏報（Type 2），兩者的代價通常差很多。它舉的例子是每 100 輛車有 1 輛方向盤扣件有瑕疵：多丟掉一些好零件，比把瑕疵品出貨便宜得多。

### 訓練、驗證、測試

泛化的定義是：模型在與訓練資料同分布、但沒看過的新資料上表現好。評估方式是先打亂資料，再切成大約 80% 的訓練集與 20% 的測試集。測試集只能在最後用一次；拿它調模型，它就不再衡量泛化。要在開發過程中評估，就再切一份驗證集。

投影片用考試來比喻：訓練集是練習題，驗證集是模擬考，測試集是真正的期末考。它也引用了 ImageNetV2 的研究：用同樣方法重新收集的測試集，模型準確率比原本的低。

### 特徵工程

特徵工程是從原始資料選出並編碼輸入特徵。投影片講的編碼方式：

- 類別特徵（郵遞區號、商品編號）用 **one-hot encoding**。
- 嚴重偏斜的特徵（點擊數、價格）常取 log。
- 尺度不同的特徵做**標準化**：用訓練集算平均與變異數，轉成平均 0、變異數 1。測試時必須沿用訓練集的統計量。
- 文字可以用 one-hot、bag-of-words，或用大型語言模型轉成向量。
- 圖片最簡單的做法是把張量攤平，投影片註明 HW1 會用到。

投影片也點出一句關鍵：深度學習的核心創新，就是學習特徵的編碼方式。

### 模型家族、歸納偏誤、no free lunch

模型家族決定函數的形式，假設空間是家族裡所有可能的模型。以線性回歸為例，不同權重給出不同的直線，所有直線構成假設空間。

**歸納偏誤**是為了讓模型能泛化到訓練資料之外而做的假設。投影片的例子是兩個訓練點 (−1, 1) 和 (1, 1)，問 x = 0 時 y 是多少：有無限多個模型都完全符合訓練資料，選擇線性家族，就是引入一個歸納偏誤。**No free lunch 定理**說沒有任何模型在所有問題上都最好，所以要挑歸納偏誤對的模型。這對應 Bishop 9.1 與 9.1.2。

其他概念依序出現：非線性模型比較有表達力，但越複雜不一定越好（欠擬合、甜蜜點、過擬合）；正則化是在學習中加入限制或懲罰以改善泛化；參數式模型的參數數量固定，非參數式模型的「參數」隨資料成長，最近鄰模型就是例子，它的參數就是全部訓練資料（Bishop 3.5.3）。logistic regression 先當作線性分類模型登場，細節留到後面的講次。

### 超參數與評估

超參數是訓練過程中固定不變的參數，例如正則化強度 λ，用驗證集上的表現來挑，常見做法是 grid search。投影片描述了一張常見的圖：隨著調整正則化，訓練準確率持續上升，驗證準確率先升後降，中間是甜蜜點。

預測分兩種：只給標籤的 `model.predict()`，以及給出機率分布的 `model.predict_proba()`，後者保留了不確定性。錯誤也分種類，要用決策理論把不同錯誤的代價量化。

### 作業說明

Lecture 3 最後幾頁在講作業：Part 1 是講課內容的應用（書面題加上實作），Part 2 是讀論文與實作論文。HW1 兩部分都在 2 月 20 日截止；Part 1 的書面題是線代、微積分、機率的先修複習，投影片建議不要用 AI 做；coding 用 pandas、Plotly、scikit-learn 和影像轉換，並提醒後面的題目比前面難得多。HW1 Part 2 沒有論文，任務是讓 Part 1 的模型在一個秘密測試集上表現更好。

**今晚就能做的事**：用 scikit-learn 載入任一個內建資料集，切出 train/validation/test，對一個超參數跑三個值的 grid search，只在最後碰一次測試集。

## Discussion 1：先修熱身

[Discussion 1](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing) 的開頭註明：worksheet 故意出得比一小時能做完的份量多，讓你課後可以拿來練習。題目分三塊：

- **微積分**：證明 sigmoid 的導數 σ′(t) = σ(t)(1 − σ(t))，再用連鎖律算 σ(ax + by) 的偏微分；算平方和與內積 wᵀx 對各座標的偏微分。
- **線性代數**：證明 AᵀA 對稱；求一個 3×2 矩陣的奇異值。
- **機率**：兩個在給定類別下條件獨立的垃圾郵件過濾器，求兩者都標記的機率，以及兩者都標記時真的是垃圾郵件的後驗機率。

這些題目幾乎一對一對應 HW1 書面題的先修要求。先自己寫，再對[解答](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing)，卡住再看 [walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3)。如果機率題寫不出來，先回去補 Bayes 定理。

## 自學動作清單

1. 讀完 Lecture 1 投影片（沒有錄影，約 86 頁）。
2. 看 Lecture 2 影片時開一個 notebook 跟著打 pandas 指令。
3. 看 Lecture 3 影片，把 FashionHub 的每一步對應到生命週期四階段。
4. 限時寫 Discussion 1，再對解答。
5. 打開 [HW1 Part 1 資料夾](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)看題目，這三講的內容足以開始做書面題。

**Fall 2026 對應講次**：[Fall 2026](https://eecs189.org/fa26/) 的 Lec 1（Introduction + ML Problem Framing）、Lec 2（KNN, ML Vocabulary, and K-Means），以及 Discussion 1（ML Problem Framing）。

## 系列導覽

- 上一篇：[CS189 有三個版本：Spring 2026 底本、Spring 2025 經典版、Fall 2026 進行中](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)
- 下一篇：[Lec 4–7：K-means、機率複習、MLE、多變量高斯與 GMM](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm)

## 延伸閱讀

- [Stanford CS109 L3：貝氏定理](/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem)：Discussion 1 機率題的前置
- [Stanford CS229 講義 Ch.1：線性回歸](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression)：另一門課怎麼從線性模型起步
- [CMU 11-785 L1：導論](/posts/ai/2026-08-22-cmu-11785-01-introduction)：從深度學習角度看同一批基本概念

## 參考資料

- [CS 189/289A Spring 2026 首頁與排程](https://eecs189.org/sp26/)
- [Spring 2026 Lecture 1: Introduction + ML problem framing（PDF）](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)
- [Spring 2026 Lecture 2: Data Tools（PDF）](https://drive.google.com/file/d/1ShsOM4DwEE1xkML4Zu5JlJFJjibu55xP/view?usp=sharing)、[影片](https://www.youtube.com/watch?v=IzfaWKuxThw&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [Spring 2026 Lecture 3: Machine Learning Mechanics（PDF）](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link)、[影片](https://www.youtube.com/watch?v=oVo_RajZ3aE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=1)
- [Spring 2026 Discussion 1 題目](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing)、[解答](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing)、[Walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3)
- [Spring 2026 HW1 Part 1 資料夾](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts](https://www.bishopbook.com)
- [scikit-learn 官方文件](https://scikit-learn.org/stable/)
- [CS 189 Fall 2026 課站](https://eecs189.org/fa26/)
