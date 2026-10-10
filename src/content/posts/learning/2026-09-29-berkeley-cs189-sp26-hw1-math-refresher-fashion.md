---
title: "CS189 Spring 2026 HW1 導讀：線代／微積分／機率熱身 + Fashion coding"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, course-guide, homework, linear-algebra, probability]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 6
tldr: "CS189 Spring 2026 HW1 分三塊：10 題書面數學熱身（線性方程組、特徵分解求矩陣冪次極限、SVD、翻轉影像的矩陣、偏微分、遞迴式連鎖律、四題機率含癌症篩檢的 Bayes），加上兩本公開在 Modal 上的 Fashion-MNIST notebook：Part 1 練 pandas／Plotly／K-means／MLP／矩陣做影像增強／tensor 謎題，Part 2 做價格回歸、MAE／MSE／R²、混淆矩陣，最後處理一份被旋轉過的秘密測試集。截止 2/20，沒有官方解答。"
description: "Berkeley CS189 Spring 2026（Listgarten／Dimakis）Homework 1 導讀：書面題逐題說明考什麼、該回哪一講找工具；兩本 Modal notebook（fashion_pt_1、fashion_pt_2）的問題結構與 MANUAL 題清單；校外自學怎麼做、沒有 autograder 時如何自我檢查。依 2026-09-29 官方檔案整理，不含解答。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion-en)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）整理。HW1 在 Lec 3 那週（1/27）隨 Discussion 1 發出，截止是 **2/20（五）11:59 PM**，剛好落在 [Lec 7–10 線性回歸](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression)講完的隔天。

HW1 的名字叫「AGI, Everywhere, All at Once」，但內容很務實。它在檢查兩件事：

1. 你的線代、微積分、機率還夠不夠撐這門課。
2. 你能不能用 pandas、Plotly、scikit-learn、PyTorch tensor 把一份影像資料集從載入、探索、訓練一路做到除錯。

這篇逐題說明每一題在考什麼、該回哪一講找工具，**不附解法**。HW1 沒有公開的官方解答，貼答案對自學者也沒有幫助。

## 課程影片來源

未核對到本文專屬的公開講次影片；請從官方課程入口查找錄影與教材。

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)

## 官方材料與讀取範圍

排程頁在 HW1 底下列了三個連結：

- [Part 1: Written](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)：Drive 資料夾，裡面有 `hw1.pdf` 和 LaTeX 模板 `hw1_student.tex`
- [Part 1: Coding](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML)：Modal notebook `fashion_pt_1`，標題「Homework 1.1」
- [Part 2: Coding](https://modal.com/notebooks/prabhune/main/nb-qmwHwOJWkhC3zn8msc2G2I)：Modal notebook `fashion_pt_2`，標題「Homework 1.2」

[Syllabus](https://eecs189.org/sp26/syllabus/) 說每份作業分兩段：Part 1 是較短的 Warmup，Part 2 是 Main Homework，兩段同時發、同一天截止。作業有公開與隱藏兩種 autograder 測試；公開的只做健全性檢查，例如確認你填的是數字不是文字，隱藏測試才檢查對錯。

提交有三個 Gradescope 入口：書面 PDF 交到「HW1 Write-Up」，兩本 notebook 各自打包成 zip 交到「HW1.1 Coding」和「HW1.2 Coding」。

**公開程度**：題目 PDF、LaTeX 模板、兩本 notebook 都能匿名打開，題目層級是 A3（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。拿不到的是 Gradescope 提交、隱藏測試、官方解答和 Ed。校外讀者可以把題目做完，但只能自己驗證對錯。

## 書面題：10 題數學熱身

書面題共 10 題，依 PDF 標示合計 46 分，分成三個主題。開頭要先抄寫並簽署 honor code。

### 線性代數（第 1–4 題）

| 題號 | 題目 | 考什麼 | 工具在哪 |
|---|---|---|---|
| 1 | System of equations（3 分） | 一個 3×3 線性方程組有幾組解，並說明理由 | 秩、線性相依。和 Lec 8「XᵀX 何時可逆」是同一個概念 |
| 2 | Asymptotic powers of 2×2 matrices（6 分） | 三個 2×2 矩陣 M 的 lim Mⁿ | 題目提示用特徵分解 M = PDP⁻¹，Mⁿ = PDⁿP⁻¹；看特徵值的絕對值跟 1 比 |
| 3 | Singular Value Decomposition（4 分） | 找單位向量 x 讓 ‖Ax‖ 最大 | SVD 裡 A 把右奇異向量映到左奇異向量並乘上奇異值，想想哪一個放大最多 |
| 4 | Image Flipping（6 分） | 3×3 影像攤平成 1×9 後，用矩陣 T 做上下翻轉；再推廣到 N×N 與左右翻轉 | 置換矩陣。PDF 註明這題是 coding 第 4 題的熱身 |

第 4 題值得多花時間。Part 1 notebook 的 Problem 4 整段都在用轉換矩陣做影像增強，書面題先讓你在 3×3 的小例子上看清楚矩陣怎麼搬動像素。

### 微積分（第 5–6 題）

- **第 5 題 Partial Derivatives（8 分）**：四個二元函數的一階、二階偏導數，其中 (b) 要解出臨界點並判斷哪個是最小值。判斷要用二階條件，也就是 Hessian。
- **第 6 題 Recursive expression and derivatives（6 分）**：給定遞迴式 zₙ = wₙ₋₁zₙ₋₁ + bₙ₋₁，依序求 dzₖ/dzₖ₋₁、dzₙ/dz₁、dzₙ/db₁。

第 6 題看起來像代數練習，其實是反向傳播的雛形：一條計算鏈上，最後輸出對最前面變數的導數，是每一段局部導數的連乘。這個結構在 Lec 17–18 和 HW3 會以完整的 backprop 再出現。

### 機率（第 7–10 題）

| 題號 | 題目 | 考什麼 |
|---|---|---|
| 7 | Conditioned uniform difference（3 分） | X、Y 獨立且都服從 Unif(−1, 1)，求 P(\|X − Y\| ≤ 0.5 \| XY > 0)。題目提示畫在二維平面上看面積 |
| 8 | Nearest-neighbor arc length（4 分） | 單位圓上均勻撒 20 個點，求 X₁ 到最近鄰居的弧長分布 P(D > t)，以及期望弧長（以度為單位） |
| 9 | Cancer screening（3 分） | 敏感度 90%、偽陽性率 3%、盛行率 0.1%，求驗出陽性時真的罹病的後驗機率 |
| 10 | Follower Counts（3 分） | 420 人隨機圍成一圈、追蹤數各不相同，求「比左右鄰居都多」的人數期望值 |

四題各有一個關鍵招式：第 7 題是把條件機率換成面積比；第 8 題是把「D > t」翻譯成其他 19 個點都不能落在某段弧內；第 9 題是 Bayes 定理，[Lec 4](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm) 的機率複習就有；第 10 題是期望值的線性性加上指示變數。

第 9 題的數字值得你算完之後停一下。盛行率很低時，即使檢驗本身不差，陽性結果的意義也可能跟直覺差很多。這個「基本率」問題在 [Lec 11–12](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic) 講分類器評估時會以另一種形式回來。

## Coding Part 1（HW1.1）：從 DataFrame 到 tensor 謎題

資料集是 [Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist)：28×28 灰階的衣物影像，10 個類別，用 torchvision 載入。Notebook 開頭寫了五個學習目標：numpy／pandas 資料操作、Plotly 視覺化、組織與分析資料集、理解資料探索與前處理、練習 torch tensor 操作。

Notebook 內建的配分表合計 39 分，結構如下：

| 段落 | 小題 | 內容 |
|---|---|---|
| Problem 0 | 0a | 為什麼用 `DataFrame` 裝資料 |
| Problem 1：pandas 與 Plotly | 1a–1d | 檢查類別是否平衡、`groupby()`、畫標籤分布、畫各類別樣本 |
| Problem 2：用聚類看資料結構 | 2a–2c | 直接在像素上跑 K-means、評估聚類、視覺化群集 |
| Problem 3：訓練分類器 | 3a–3e | 訓練 MLP、把預測寫回 DataFrame、各類別準確率、混淆矩陣、預測信心 |
| Problem 4：用轉換矩陣做影像增強 | 4a–4j | 水平翻轉、平移、模糊、旋轉、旋轉後的空洞與雙線性內插、組合轉換、把增強套到測試影像上評估分類器 |
| Problem 5：Tensor Puzzles | 5a–5e | 只准用 broadcasting、索引、四則運算與比較，一行（< 80 字元）寫出 sum、outer product、diag、triu、vstack |

Problem 2 的 K-means 直接接 [Lec 4](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm)。Problem 4 則是書面第 4 題的放大版：同樣是用矩陣移動像素，這次要處理旋轉後格點對不上的問題，所以引入雙線性內插。

Problem 5 的限制很嚴，連 `torch.sum`、`view`、`reshape`、`unsqueeze` 都不能用。它逼你真正搞懂 broadcasting 的規則：兩個維度相等，或其中一個是 1，才能對齊。這在後面寫 autograd 和 Transformer 時會一直用到。

提交時要把 notebook 下載成 `.ipynb`，連同訓練好的 `classifier.joblib` 一起打包。

## Coding Part 2（HW1.2）：回歸、秘密測試集與分布偏移

Part 2 的目標改成建模與除錯。學習目標寫的是：建立並評估分類器、除錯與分析模型表現、探索提升準確率的技巧。配分表同樣合計 39 分。

開頭先把 Part 1 的 MLP 流程重做一次：`train_test_split` 切資料、`StandardScaler` 標準化、`MLPClassifier` 訓練、量訓練與測試準確率。接著分四段：

1. **Problem 5：回歸分析**。任務從分類換成回歸：用影像特徵預測衣物價格。你要把價格表和原本的 DataFrame join 起來，訓練線性回歸，計算 MAE、MSE、R²，最後比較「分類錯的影像」和「分類對的影像」在價格預測上的相對誤差。這一段正好接上 Lec 7–10。
2. **Problem 6：新的測試集**。載入一份「super secret」測試集，用原本的模型預測，看各類別準確率與混淆矩陣，再檢查被分錯的樣本集中在哪裡。你會發現準確率大幅下降，原因是這批測試影像被旋轉過。
3. **Problem 7：解法一，旋轉不變的分類器**。在訓練資料上加隨機旋轉做資料增強，重新訓練，讓訓練分布去貼近測試分布。
4. **Problem 8：解法二，把旋轉轉回來**。訓練一個 `MLPRegressor` 預測每張圖被轉了幾度，把測試影像轉回 0 度再交給原本的分類器。這是回歸模型當作前處理的例子。

最後的 **Problem 9** 是 Test Time Augmentation：只准用原本的 `MLPClassifier`，不能再訓練新模型，對每張測試圖做多種轉換、彙整預測，準確率要達到 44% 以上。Notebook 提醒 autograder 會重複執行你的函式，太慢會超時。

提交時要附上四個 `.joblib` 模型檔，連同 notebook 打包。

Part 2 整本在講一件真實世界常見的事：**訓練資料和測試資料的分布不一樣**。三種解法各自代表一種思路：改訓練資料、改測試資料、推論時多看幾眼。

## MANUAL 題：要寫進 write-up 的七題

書面 PDF 的最後一節「Coding」列了 7 個標題，要你把 notebook 裡標成 **MANUAL** 的圖或文字答案貼到 write-up：

| 來源 | 題號 | 標題 |
|---|---|---|
| HW1.1 | 1c | Visualizing Label Distribution |
| HW1.1 | 2c | Visualizing Clusters |
| HW1.1 | 4g | Matrix Multiply Questions |
| HW1.1 | 4j | Analysis of Augmentation Techniques |
| HW1.2 | 5c | MAE, MSE, and R-Squared |
| HW1.2 | 6d | Analysis of Class Accuracies and Confusion Matrix |
| HW1.2 | 8d | Comparing Data Augmentation and Rotation Correction |

有一處官方檔案彼此對不上：HW1.2 開頭的配分表把 6b、7b、8a 也標為「Manual」，5c 反而標成非 Manual，和 write-up 模板的清單不一樣。自學時兩邊都寫進筆記就好；如果你是修課生，要以課程公告為準。

## 校外讀者怎麼做

1. **書面題用 LaTeX 模板寫**。`hw1_student.tex` 已經排好每一題的位置，直接填就能產出和修課生一樣格式的 PDF。
2. **Notebook 可以不在 Modal 上跑**。它是標準的 Jupyter notebook。Modal 版的設定步驟包括建立名為 `cs189` 的 volume（掛在 `/mnt/cs189`）、把 AI 自動補全關掉（notebook 說 Modal 的 Tab 補全會給錯的輸出）、不用時停掉 kernel 節省額度。你也可以下載成 `.ipynb` 在本機跑，但要自己處理資料路徑和套件版本。
3. **沒有隱藏測試，就自己寫檢查**。書面題可以用 NumPy 驗算：矩陣冪次的極限拿大 n 次方去逼近、SVD 用 `np.linalg.svd` 對照、機率題寫一段 Monte Carlo 模擬。Coding 題則看數字合不合理：類別平衡的資料集，各類別準確率不該差到離譜。
4. **Tensor Puzzles 遵守規則**。用了禁用函式也能跑出正確結果，但那就沒練到。

## 今晚可以做的動作

1. 打開 [hw1.pdf 所在資料夾](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)，先做第 2 題的 M₁，寫完再用 `np.linalg.matrix_power(M, 1000)` 檢查。
2. 做第 9 題之前，先寫下你的直覺猜測，算完再比較。
3. 打開 [fashion_pt_1](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML)，做完 Problem 1 和 Problem 5a，一個練 pandas、一個練 broadcasting。

## Fall 2026 對應與延伸閱讀

[Fall 2026](https://eecs189.org/fa26/) 的作業在首頁沒有公開連結，目前無法對照 HW1 的內容。

站內延伸：

- 機率題的前置：[Stanford CS109 Lecture 3：Bayes 定理](/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem)、[Lecture 5：隨機變數與期望值](/posts/learning/2026-08-22-stanford-cs109-lecture-05-random-variables-expectation)
- 回歸的推導：[Lec 7–10：線性回歸、最小平方的幾何、正則化](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression)
- 系列入口：[CS189 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)

## 系列導覽

- 上一篇：[Lec 7–10：線性回歸、最小平方的幾何、正則化](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression)
- 下一篇：[Lec 11–12：分類、生成式分類器、logistic regression、ROC](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS189 Spring 2026 課程首頁與排程（HW1 連結）](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Syllabus（作業分段、autograder 說明）](https://eecs189.org/sp26/syllabus/)
- [HW1 Part 1 Written 資料夾（hw1.pdf、hw1_student.tex）](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)
- [HW1.1 Coding：fashion_pt_1（Modal notebook）](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML)
- [HW1.2 Coding：fashion_pt_2（Modal notebook）](https://modal.com/notebooks/prabhune/main/nb-qmwHwOJWkhC3zn8msc2G2I)
- [Fashion-MNIST 資料集（Zalando Research）](https://github.com/zalandoresearch/fashion-mnist)
- [Xiao, Rasul, Vollgraf, Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms（arXiv:1708.07747）](https://arxiv.org/abs/1708.07747)
- [CS189 Fall 2026 課程首頁](https://eecs189.org/fa26/)
