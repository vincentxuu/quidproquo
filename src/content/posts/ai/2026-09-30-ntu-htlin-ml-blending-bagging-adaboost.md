---
title: "林軒田機器學習技法 T7–T8：Blending、Bagging 與 AdaBoost"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 12
tldr: "技法第 7、8 講是 aggregation 模型的入口。T7 先把「組合多個假說」排成 uniform、linear、any（stacking）三種 blending，用一行代數證明 uniform blending 降低的是 variance，再用 bootstrap 在手上唯一一份資料裡造出多樣的 g_t，就是 bagging。T8 把 bootstrap 重新解讀成「替樣本加權」，改成專挑上一輪答錯的樣本加重，讓下一個假說被迫不同，再用 α_t = ln √((1−ε_t)/ε_t) 當投票權，這就是 AdaBoost。練習用 Fall 2024 HW6 Q4、Q9 與 HW7 的 bootstrap、AdaBoost 證明題和 madelon 上 500 輪的 AdaBoost-Stump 實驗；沒有官方解答。"
description: "台大林軒田《機器學習技法》第 7 講 Blending and Bagging 與第 8 講 Adaptive Boosting 導讀：aggregation 的動機、uniform blending 的 bias–variance 拆解、linear／any blending 與 KDD Cup 2011 的實例、bootstrap aggregation、重新加權製造多樣性、AdaBoost 演算法與 VC 保證、AdaBoost-Stump，附 Fall 2024 HW6／HW7 對應題與課程頁列的 Breiman、Freund & Schapire 延伸閱讀。"
draft: false
glossary:
  - term: "blending"
    aliases: ["混合", "stacking"]
    definition: "手上已經有 g_1…g_T 之後才決定怎麼組合：一人一票（uniform）、學一組線性權重（linear），或把 g_t 的輸出當特徵再學任意模型（any blending，也叫 stacking）。"
    context: "林軒田 T7 把 blending 和「邊學 g_t 邊組合」的 aggregation learning 分開講。"
  - term: "bagging"
    aliases: ["bootstrap aggregation"]
    definition: "從原資料有放回地抽樣出多份 bootstrap 資料，各自訓練一個 g_t，最後一人一票。它是包在任何基礎演算法外面的 meta algorithm。"
    context: "T7 的說法：基礎演算法對資料隨機性越敏感，bagging 越有效。"
  - term: "AdaBoost"
    aliases: ["Adaptive Boosting"]
    definition: "每一輪把上一個 g_t 答錯的樣本權重放大、答對的縮小，讓下一個 g_{t+1} 被迫不同；最後以 α_t = ln √((1−ε_t)/ε_t) 做線性投票。"
    context: "T8 用「老師帶小朋友認蘋果」的故事介紹；T11 再從最佳化角度重新推一次。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文以 [MOOC 版](https://www.csie.ntu.edu.tw/~htlin/mooc/)《機器學習技法》為核心教材：[207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf)（Blending and Bagging）、[208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf)（Adaptive Boosting）與[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 26–33 支。作業對照 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)的 HW6、HW7。事實皆於 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 PDF 是 **A3（評分鏈除外）**——沒有官方解答，Gradescope 與 NTU COOL 限修課生。

**系列位置**：上一篇 [Kernel 邏輯迴歸與支援向量迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)｜下一篇 [決策樹、隨機森林與梯度提升樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

技法的前六講都在做同一件事：用 kernel 把大量特徵塞進模型裡。從第 7 講開始換題目，進入第二段「Combining Predictive Features: Aggregation Models」。問題變成：手上有很多個假說，有的強、有的弱，能不能組合出一個比任何單一個都好的 G？

這兩講回答兩件事。第一，組合為什麼會變好：答案是多樣性，加上投票能抵銷 variance。第二，多樣性從哪裡來：T7 靠資料的隨機抽樣（bagging），T8 靠刻意重新加權（AdaBoost）。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=mjUKsp0MvMI
title: Motivation of Aggregation
```

```youtube
url: https://www.youtube.com/watch?v=DAFkKJYTMW4
title: Uniform Blending
```

原始影片：[Motivation of Aggregation](https://www.youtube.com/watch?v=mjUKsp0MvMI)、[Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4)、[Linear and Any Blending](https://www.youtube.com/watch?v=i03s1g7X_m4)、[Bagging (Bootstrap Aggregation)](https://www.youtube.com/watch?v=3T1mdvzRAF0)、[Motivation of Boosting](https://www.youtube.com/watch?v=hL8DjIHAzZY)、[Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8)、[Adaptive Boosting Algorithm](https://www.youtube.com/watch?v=vqTXLTYqbbw)、[Adaptive Boosting in Action](https://www.youtube.com/watch?v=5wPN87bwoaE)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 在課表上的位置

| 版本 | 週次 | 投影片 | 延伸閱讀（課程頁原列） |
|---|---|---|---|
| MOOC | 技法 T7、T8 | 207、208 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W11（11/11）講 T7，W12（11/18）講 T8–T11 | [207u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/207u_handout.pdf)、[208u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/208u_handout.pdf) | Chen et al.、Breiman、Freund & Schapire |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W11（11/18）講 T7–T8 | 207u、208u 目前 404，尚未公開 | 同上 |

課程頁沒有替這兩講標 LFD 章節，所以本篇只依投影片與影片。

## T7 Blending and Bagging

影片：[Motivation of Aggregation](https://www.youtube.com/watch?v=mjUKsp0MvMI)、[Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4)、[Linear and Any Blending](https://www.youtube.com/watch?v=i03s1g7X_m4)、[Bagging (Bootstrap Aggregation)](https://www.youtube.com/watch?v=3T1mdvzRAF0)

### 從「選一個朋友」到「讓朋友投票」

投影片用一個故事開場：你有 T 個朋友，每個人都會預測股票漲跌。你可以怎麼用他們？

- 挑平常最準的那一個：這就是基石 L15 的 validation。
- 所有人一人一票。
- 投票，但比較可信的人多給幾票。
- 看情況決定聽誰的：在某些條件下才給某個朋友票。

四種寫成式子，都是 G(x) = sign(Σ q_t(x)·g_t(x)) 的特例：選擇是只讓一個 q_t 非零，uniform 是 q_t = 1，non-uniform 是 q_t = α_t，conditional 是 q_t 會隨 x 變。這一整族就叫 aggregation 模型。

選擇（selection）的問題在於它得靠**一個**夠強的 g_t。aggregation 想問的是：能不能用很多個比較弱的假說做得更好？投影片給了兩個直覺：

- 把幾條水平、垂直線（很弱的假說）一人一票，可以拼出一個轉折的邊界，G 變強了，效果像**特徵轉換**。
- 把很多條隨機 PLA 的線平均起來，得到一條比較居中的線，G 變得比較穩，效果像**正則化**。

這兩個作用，一個治 underfitting、一個治 overfitting，會在 T11 的總整理再出現一次。

### Uniform blending：一行代數看出為什麼會變好

分類用投票，迴歸用平均：G(x) = (1/T) Σ g_t(x)。如果所有 g_t 都一樣，平均完還是那一個；如果它們夠不同，有的高估、有的低估，平均反而比單一個更準。

投影片接著做了一段代數，把「每個 g_t 的平均誤差」拆成兩項：

<details>
<summary>推導：avg E_out(g_t) = avg ε(g_t − G)² + E_out(G)</summary>

固定一個 x，令 G = avg g_t：

avg (g_t − f)² = avg(g_t² − 2g_t f + f²) = avg(g_t²) − 2Gf + f²
= avg(g_t²) − G² + (G − f)²
= avg(g_t − G)² + (G − f)²

對 x 取期望，就得到 avg E_out(g_t) = avg ε(g_t − G)² + E_out(G) ≥ E_out(G)。

</details>

結論是：**G 的誤差一定不會比 g_t 的平均誤差差**，差多少取決於 g_t 之間多分散。

投影片再往前推一步：想像每次都從 P 抽一份新的大小 N 資料 D_t，訓練出 g_t，T 趨近無限時的平均叫共識 ḡ。上面的式子就變成「演算法的期望表現 = 對共識的期望偏離 + 共識本身的表現」，後者叫 **bias**，前者叫 **variance**。uniform blending 做的事，就是把 variance 那一項壓下來，讓表現更穩定。

### Linear 與 any blending：把 g_t 當特徵轉換

如果要給每個 g_t 不同的票數 α_t，要怎麼算？投影片的觀察是：這就是一個線性模型，只是特徵轉換換成 Φ(x) = (g_1(x), …, g_T(x))。所以 linear blending = 線性模型 + 把假說當轉換 + 限制 α_t ≥ 0。

α_t ≥ 0 這個限制在實務上常被拿掉。投影片的理由很好記：α_t 是負的，等於把 −g_t 當成正權重來用；如果你有一個錯誤率 99% 的股票分類器，反過來用就是 99% 準。

有兩個要小心的地方：

1. **不能用 E_in 選 α**。linear blending 包含 selection 當特例，用 E_in 學 α 要付的 VC 代價，至少跟從所有 H_t 的聯集裡挑一個一樣大。所以實務做法是：在 D_train 上學出 g_t⁻，在 D_val 上學 α。
2. **Any blending（stacking）**：把 D_val 轉成 (Φ⁻(x_n), y_n)，上面跑任何模型都可以，不只線性。它能做到 conditional blending，但就像任何更強的模型一樣，有 overfitting 的危險。

投影片舉了台大自己的例子：[KDD Cup 2011 Track 1 冠軍解法（Chen et al.）](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)。validation set blending 讓測試誤差（squared）從 519.45 降到 456.24，最後兩週靠它守住領先；最後一小時再用 test set blending 降到 442.06，完成逆轉。投影片的結論是 blending 計算很重，但實務上有用。

### Bagging：從唯一一份資料裡造出多樣性

到這裡為止，g_t 都是先學好的。接下來問：如果要**邊學 g_t 邊組合**，多樣性從哪來？投影片列了四種：不同模型、同模型不同參數（例如不同的學習率 η）、演算法本身的隨機性（不同 random seed 的 PLA）、資料的隨機性（cross-validation 裡的 g_v⁻）。

bagging 走的是最後一條，但不需要切出 validation。回到上面的 bias–variance：共識 ḡ 需要無限多份獨立的 D_t，我們手上只有一份 D。**Bootstrap** 是統計上的工具：從 D 有放回地均勻抽 N 個樣本（也可以抽 N′ 個），假裝這是一份新的 D_t。

Bootstrap aggregation（BAGging）的演算法只有兩行：每一輪用 bootstrap 抽出 D̃_t，訓練 g_t = A(D̃_t)；最後一人一票。它是包在任何基礎演算法 A 外面的 meta algorithm。

投影片的示範是 pocket 演算法跑 1000 輪、bagging 取 25 個：每個 g_t 都很不一樣，投票後得到一個合理的非線性邊界。結論是：**基礎演算法對資料隨機性越敏感，bagging 越有效**。這句話是下一篇隨機森林的伏筆，因為完全長大的決策樹正是對資料非常敏感的演算法。

## T8 Adaptive Boosting

影片：[Motivation of Boosting](https://www.youtube.com/watch?v=hL8DjIHAzZY)、[Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8)、[Adaptive Boosting Algorithm](https://www.youtube.com/watch?v=vqTXLTYqbbw)、[Adaptive Boosting in Action](https://www.youtube.com/watch?v=5wPN87bwoaE)

### 老師帶小朋友認蘋果

T8 的開場是一堂給 6 歲小孩上的水果課。老師秀出蘋果和非蘋果的照片，問「蘋果長什麼樣」。Michael 說圓的；老師指出只說圓會錯很多，Tina 補充紅的；老師再指出還是會錯，Joey 說也可能是綠的；最後 Jessica 補上頂端有梗。全班的結論是「蘋果有點圓、有點紅、可能是綠的、頂端可能有梗」。

投影片把角色對上演算法：每個學生是一個簡單假說 g_t（像一條水平或垂直線），全班的結論是複雜的 G，老師是讓學生**專注在剛才答錯的例子**上的學習演算法。

### 把 bootstrap 看成加權，然後故意加權

第一步是換個角度看 bagging。bootstrap 抽出來的 D̃_t 裡，有的樣本出現兩次、有的沒出現，等於替原本的 D 加上權重 u_n = 2、1、0……。所以 bagging 的每個 g_t，其實是在最小化加權的 E_in^u。

多數演算法都能吃權重：SVM 可以把上界改成 0 ≤ α_n ≤ C·u_n，邏輯迴歸用 SGD 時可以依 u_n 的比例抽樣。投影片說這是基石 L8 class-weighted learning 的延伸。

第二步是問：怎麼設權重，才能讓 g_{t+1} 跟 g_t 盡量不同？想法是讓 g_t 在新權重 u^(t+1) 下**表現得像亂猜**，加權錯誤率剛好 1/2。這樣最小化新權重的演算法就不會再選到像 g_t 的假說。

做法是乘法重新縮放：若 g_t 的加權錯誤率是 ε_t，就把答錯的樣本乘上正比於 (1 − ε_t)、答對的乘上正比於 ε_t，兩邊的總權重就相等了。定義縮放因子 ♦_t = √((1 − ε_t)/ε_t)，答錯的乘 ♦_t、答對的除 ♦_t，效果一樣。只要 ε_t ≤ 1/2，♦_t ≥ 1，意思就是**放大答錯的、縮小答對的**，跟老師做的事一樣。

### AdaBoost 演算法

還剩兩個問題：第一輪的權重，以及最後怎麼組合。

- 第一輪希望 g_1 就是最小化 E_in 的那個，所以 u^(1) = 1/N。
- 最後不能用 uniform：g_2 是刻意在 g_1 錯的地方挑出來的，對原始 E_in 可能很差。投影片選擇**邊學邊線性組合**，給好的 g_t 大權重：α_t = ln(♦_t)。ε_t = 1/2 時 α_t = 0（跟亂猜一樣的 g_t 不給票），ε_t = 0 時 α_t = ∞。

投影片把 AdaBoost 拆成三個角色：弱的基礎演算法 A（學生）、最佳重新加權因子 ♦_t（老師）、神奇的線性組合 α_t（全班）。

理論保證來自 VC bound：E_out(G) ≤ E_in(G) + O(√(O(d_vc(H)·T log T)·log N / N))。投影片的說法是，只要每一輪都有 ε_t ≤ ε < 1/2，E_in(G) 在 T = O(log N) 輪後就會是 0；而整體 d_vc 隨 T 成長得「很慢」。這就是 boosting 的意思：**基礎演算法只要永遠比亂猜好一點點，AdaBoost 就能把它變強**。

### AdaBoost-Stump 與即時人臉偵測

實際上需要一個夠弱、又能有效最小化 E_in^u 的 A。常見選擇是 decision stump：h(x) = s·sign(x_i − θ)，三個參數是特徵 i、門檻 θ、方向 s，在 2D 裡就是一條水平或垂直線，最佳化只要 O(d·N log N)。基石的 Fall 2024 HW2 已經讓你實作過一維版本。

投影片一步一步示範 AdaBoost-Stump 在簡單資料集上逐輪加上一條線，最後在複雜資料集上得到非線性邊界。結論是「非線性但有效率」。

應用例子是投影片標為「世界第一個即時人臉偵測程式」的系統：核心是 AdaBoost-Stump，從 24×24 影像的 162,336 種可能 patch 裡挑出關鍵的做線性組合，等於順便做了特徵選擇；再改造線性組合，讓非人臉的區塊能提早被排除，換來速度。

## 用 Fall 2024 作業練習

[HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）與 [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（12-02 發布、12-16 截止）裡跟這兩講直接相關的題目：

| 題 | 類型 | 練什麼 |
|---|---|---|
| HW6 Q4 | 自動批改 | 5 個錯誤互相獨立、各自 E_out = 0.25 的分類器做 uniform blending，G 的 E_out 大約多少（題目直接引用 Lecture 207 第 7 頁） |
| HW6 Q9 | 人工批改 | 把 linear blending 的 Φ(x) = (g_1(x), …, g_T(x)) 與 kernel 結合：用整數輸入上的縮放 decision stump 當 g_t，推出對應的 kernel K_ds(x, x′) |
| HW7 Q1 | 自動批改 | N = 1126 時，bootstrap 抽多少個才有超過 70% 機率出現重複樣本 |
| HW7 Q3 | 自動批改 | 87% 是負例、g_1 回傳常數 −1 時，第二輪正負例的權重比 |
| HW7 Q5 | 人工批改 | 2M+1 個分類器 uniform 投票時，E_out(G) 最緊的上界 |
| HW7 Q6 | 人工批改 | 證明 U_{t+1}/U_t = 2√(ε_t(1 − ε_t))，這是 AdaBoost 在 O(log N) 輪內收斂的證明骨幹 |
| HW7 Q10–12 | 人工批改 | 在 LIBSVM 的 [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)（訓練）與 madelon.t（測試）上實作 AdaBoost-Stump，跑滿 T = 500 輪，畫 E_in(g_t) 與 ε_t、E_in(G_t) 與 E_out(G_t)、U_t 的曲線 |

Q10 要求把 HW2 的 decision stump 擴充成多維、吃樣本權重的版本，最簡單的做法是每一維找最佳 stump，再挑全部維度裡最好的。HW6 Q9 的提示還附了林軒田自己的早期論文 [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf)，給想看 perceptron 與決策樹怎麼做成 kernel 的人。

沒有官方解答，所以要自己設驗收方法。Q10–12 可以拿 scikit-learn 的 `AdaBoostClassifier` 搭深度 1 的決策樹當對照，看 E_in(G_t) 的趨勢是否一致；Q1 可以用蒙地卡羅模擬核對你的解析解。本系列的[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)會把 HW6、HW7 完整走一遍。

## 自學怎麼用這兩講

1. 先看 [Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4) 那支，自己把 avg E_out(g_t) 的拆解推一次。這個 bias–variance 拆解是整段 aggregation 的地基。
2. 看 T8 的 [Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8)，重點是「讓 g_t 在新權重下像亂猜」這個設計目標，α_t 的公式是它的結果，不是起點。
3. 今晚可以做的一件事：用 20 行程式在 2D 玩具資料上實作 AdaBoost-Stump，每一輪畫出權重最大的 5 個點。你會看到它們一直是邊界附近那幾個，這就是「老師」在做的事。

## 延伸閱讀

課程頁列的延伸閱讀：

- [Breiman, Bagging Predictors（UC Berkeley 技術報告 421）](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf)：bagging 的原始論文。
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf)：AdaBoost 作者寫的導論。
- [Chen et al., A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)：T7 引用的 KDD Cup 2011 冠軍解法。

站內其他課程對同一主題的講法（本篇內容不因此省略）：

- [Harvard CS181 HW4：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)
- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 T7、T8 的小節標題與投影片
- [Lecture 7: Blending and Bagging（207_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf) — aggregation 四種形式、bias–variance 拆解、linear／any blending、KDD Cup 2011 數字、bagging pocket 示範
- [Lecture 8: Adaptive Boosting（208_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf) — 蘋果故事、最佳重新加權、AdaBoost 演算法、VC 保證、AdaBoost-Stump 與人臉偵測
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — 第 26–33 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — 週次、207u／208u 投影片與延伸閱讀清單
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W11 排程
- [LIBSVM Data: madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)
- [Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf)
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf)
- [Chen et al., KDD Cup 2011 Track 1 解法](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)
- 站內：[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)
