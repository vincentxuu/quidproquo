---
title: "CS231N 作業一導讀：kNN、Softmax、兩層網路與全連接網路"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, homework, numpy, neural-networks]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 5
tldr: "CS231N 作業一占總成績 12%，2026 年 4 月 16 日截止，五個 Colab notebook 全部在 CIFAR-10 上用 numpy 手寫：Q1 kNN 要寫出兩層迴圈、一層迴圈、零迴圈三種距離計算；Q2 Softmax 從 naive 到向量化再到 SGD；Q3 把 affine、ReLU、softmax 組成兩層網路；Q4 改用 HOG 與色彩直方圖特徵；Q5 推廣成任意層數，並實作 Momentum、RMSProp、Adam。起始碼 65 KB，公開可下載；拿不到的是 Gradescope 評分。本文只講結構與目標，不給解答。"
description: "Stanford CS231N（Spring 2026）Assignment 1 導讀：五個 notebook（knn、softmax、two_layer_net、features、FullyConnectedNets）各自要實作哪些函式、在 cs231n/ 模組的哪個檔案、notebook 寫明的準確率目標與行內問答、Colab 與 Google Drive 的設定、繳交流程、遲交規則與 Honor Code。不提供解答。"
draft: false
glossary:
  - term: "CIFAR-10"
    definition: "10 個類別、每張 32×32 彩色的小圖片資料集。CS231N 作業一的五個 notebook 都用它。"
    context: "起始碼的 get_datasets.sh 會從多倫多大學的網址下載 cifar-10-python.tar.gz。"
    links:
      - label: "CIFAR-10 dataset"
        url: "https://www.cs.toronto.edu/~kriz/cifar.html"
  - term: "gradient check"
    aliases: ["梯度檢查", "gradcheck"]
    definition: "用數值差分估計梯度，拿來和自己寫的解析梯度比對，確認 backward 沒寫錯。"
    context: "作業一的 softmax、two_layer_net、FullyConnectedNets 都附有 gradient check 儲存格，函式在 cs231n/gradient_check.py。"
  - term: "HOG"
    aliases: ["Histogram of Oriented Gradients", "方向梯度直方圖"]
    definition: "把影像切成小格，統計每格裡邊緣方向的分布，當成手工設計的影像特徵。"
    context: "作業一 Q4 用 HOG 加上 HSV 色彩直方圖取代原始像素，觀察準確率怎麼變。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en)

> **版本說明**：依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Assignment 1 頁面](https://cs231n.github.io/assignments2026/assignment1/) 與 [起始碼 assignment1.zip](https://cs231n.github.io/assignments/2026/assignment1.zip)（65 KB，29 個項目）。事實皆於 2026-09-30 下載並打開官方檔案核對。存取等級 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：題目、起始碼、單元檢查與資料下載腳本都公開，足以自學；拿不到的是 Gradescope 評分、助教 office hours 與 Ed 論壇。

**系列位置**：上一篇 [L4：神經網路與反向傳播](/posts/ai/2026-09-30-cs231n-neural-networks-backprop)｜下一篇 [L5：用 CNN 做影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

[L2](/posts/ai/2026-09-30-cs231n-image-classification-linear) 到 [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) 講了三件事：資料驅動的分類流程、怎麼用梯度最佳化、怎麼用 backprop 算梯度。作業一要你把這三件事全部用 numpy 親手寫一遍。

[作業總頁](https://cs231n.stanford.edu/assignments.html)把它定位為「Image Classification, kNN, Softmax, Fully-Connected Neural Network, Fully-Connected Nets」，占總成績 12%。[2026 課表](https://cs231n.stanford.edu/schedule.html) 在 L2 那天（4 月 2 日）發佈，L6 那天（4 月 16 日）截止；作業頁寫的截止時間是 2026 年 4 月 16 日星期四晚上 11:59（太平洋時間）。

本文只講每題的目標、要動哪些檔案、notebook 寫明的檢查點與行內問答。**不提供任何解答。** [作業總頁的 Honor Code](https://cs231n.stanford.edu/assignments.html) 直接寫了：往年作業的解答有被貼到網路上，課程知道，並期待所有繳交的作業都是學生自己的。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 作業頁列出的目標

作業頁說這份作業是在練習「以 kNN 或 SVM／Softmax 分類器組出一條簡單的影像分類 pipeline」，目標有九條，歸納起來是四類：

- **流程**：理解 train／predict 兩階段，以及 train／val／test 切分與用驗證集調超參數。
- **工程**：寫出有效率的向量化 numpy 程式。
- **模型**：實作並應用 kNN、Softmax、兩層網路、全連接網路，理解它們之間的差異與取捨。
- **表示**：理解改用高階表示（色彩直方圖、HOG）而非原始像素會帶來多少進步。

## 起始碼長什麼樣子

解壓後是一個 `assignment1/` 資料夾：

| 路徑 | 內容 |
|---|---|
| `knn.ipynb`、`softmax.ipynb`、`two_layer_net.ipynb`、`features.ipynb`、`FullyConnectedNets.ipynb` | Q1–Q5 五個 notebook |
| `collect_submission.ipynb` | 打包繳交檔 |
| `cs231n/classifiers/` | `k_nearest_neighbor.py`、`softmax.py`、`linear_classifier.py`、`fc_net.py` |
| `cs231n/layers.py`、`layer_utils.py` | 各種層的 forward／backward |
| `cs231n/optim.py` | 更新規則 |
| `cs231n/solver.py` | 訓練迴圈的 `Solver` 類別 |
| `cs231n/gradient_check.py` | 數值梯度工具 |
| `cs231n/features.py` | 色彩直方圖與 HOG 特徵 |
| `cs231n/datasets/get_datasets.sh` | 下載 CIFAR-10 與 `imagenet_val_25.npz` |

大部分工作是在 `.py` 檔的 TODO 區塊裡寫程式，notebook 負責呼叫、檢查與畫圖。有一件事容易讓人困惑：`layers.py` 裡也看得到 batchnorm、dropout、卷積的函式骨架，但 `FullyConnectedNets.ipynb` 明寫現在不用管 dropout 和 batch／layer normalization，那些留到下一份作業。

## Q1：kNN（`knn.ipynb`）

**目標**：做出一個完整的 kNN 分類器，並用交叉驗證選 k。

要寫的函式都在 `cs231n/classifiers/k_nearest_neighbor.py`：

- `compute_distances_two_loops`、`compute_distances_one_loop`、`compute_distances_no_loops`：同一個距離矩陣的三種寫法。notebook 會比對三者結果是否一致，並印出各自花了幾秒。
- `predict_labels`：從距離矩陣找出 k 個最近鄰，投票決定標籤。

交叉驗證的設定寫在 notebook 裡：5 折，k 從 `[1, 3, 5, 8, 10, 12, 15, 20, 50, 100]` 中選。notebook 寫明的檢查點是：k = 1 時應看到約 27% 準確率；用交叉驗證選出的 k 在測試集上應超過 28%。

行內問答有三題：距離矩陣裡特別亮的列和欄是什麼造成的；哪些像素前處理不會改變 L1 距離下的 kNN 表現；以及一組關於 kNN 的是非題（決策邊界是不是線性的、1-NN 和 5-NN 的訓練誤差與測試誤差比較、分類時間和訓練集大小的關係）。

**這題在練什麼**：向量化。從兩層迴圈到零迴圈，是整份作業第一次要你把「一個一個算」改寫成矩陣運算。notebook 自己也提醒，從兩層迴圈改成一層不一定會變快，零迴圈才是重點。

## Q2：Softmax（`softmax.ipynb`）

**目標**：實作 softmax loss 與梯度，用 SGD 訓練線性分類器，並用驗證集調超參數。

要寫的地方：

- `cs231n/classifiers/softmax.py`：`softmax_loss_naive`（用迴圈）與 `softmax_loss_vectorized`。
- `cs231n/classifiers/linear_classifier.py`：`train`（SGD 迴圈）與 `predict`。
- notebook 裡的超參數搜尋：在驗證集上調正則化強度與學習率。

notebook 用 `grad_check_sparse` 做梯度檢查，最後把學到的每類權重畫成圖。

行內問答有四題：為什麼一開始的 loss 應該接近 −log(0.1)；SVM loss 的 gradient check 為什麼偶爾會有一個維度對不上；視覺化的 Softmax 權重看起來像什麼、為什麼；以及一題是非題：有沒有可能加一筆新資料，會改變 softmax loss 但不改變 SVM loss。

**這題在練什麼**：[L2](/posts/ai/2026-09-30-cs231n-image-classification-linear) 的 softmax loss 加上 [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization) 的「解析梯度訓練、數值梯度檢查」。

## Q3：兩層神經網路（`two_layer_net.ipynb`）

notebook 標題是「Fully-Connected Neural Nets」，照順序帶你寫出模組化的層：

1. `cs231n/layers.py` 的 `affine_forward`／`affine_backward`、`relu_forward`／`relu_backward`、`softmax_loss`，每一個都有數值梯度檢查。
2. `cs231n/layer_utils.py` 的「三明治」層 `affine_relu_forward`／`affine_relu_backward`（已提供，notebook 會檢查）。
3. `cs231n/classifiers/fc_net.py` 的 `TwoLayerNet`：`__init__` 與 `loss`。
4. 讀 `cs231n/solver.py`，用 `Solver` 訓練出驗證集約 36% 的 `TwoLayerNet`。
5. 除錯：看 loss 曲線與第一層權重的視覺化，判斷出了什麼問題。
6. 調超參數（隱藏層大小、學習率、epoch 數、正則化強度），目標是驗證集與測試集都超過 48%；notebook 說它們最好的網路在驗證集超過 52%。

行內問答有兩題：哪些激活函式會出現梯度接近零的問題、什麼樣的輸入會造成；以及測試準確率遠低於訓練準確率時，哪些做法能縮小差距。

**這題在練什麼**：[L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) 的 forward／backward API。每個 forward 回傳輸出和一個 cache，backward 吃上游梯度和 cache，回傳對每個輸入的梯度。

## Q4：影像特徵（`features.ipynb`）

**目標**：看看把原始像素換成手工特徵，準確率會怎麼變。

特徵函式 `color_histogram_hsv` 與 `hog_feature` 在 `cs231n/features.py` 裡**已經寫好**，這題的工作在 notebook：

1. 抽出每張圖的 HOG 與 HSV 色彩直方圖特徵。
2. 在特徵上訓練 Softmax 分類器並調超參數，看它把哪些圖分錯。
3. 在特徵上訓練 Q3 的 `TwoLayerNet`。notebook 說這應該勝過前面所有方法，測試集要輕鬆超過 55%，它們最好的模型約 60%。

行內問答一題：描述分錯的例子，看它們合不合理。

**這題在練什麼**：這是 L5 之前的伏筆。手工特徵確實比原始像素好，但特徵是人設計的；[L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification) 要讓網路自己學特徵。

## Q5：全連接網路（`FullyConnectedNets.ipynb`）

**目標**：把兩層網路推廣成任意層數，並實作 L3 的最佳化器。

1. `cs231n/classifiers/fc_net.py` 的 `FullyConnectedNet`：任意隱藏層數的網路，先做初始 loss 與梯度檢查。
2. **過擬合小資料**：先用三層網路、再用五層網路（每個隱藏層都是 100 個單元），在 50 張訓練圖上調學習率與權重初始化尺度，20 個 epoch 內達到 100% 訓練準確率。
3. `cs231n/optim.py` 的 `sgd_momentum`、`rmsprop`、`adam`，notebook 用預先算好的期望值檢查，再把幾種更新規則的 loss 與準確率曲線畫在一起比較。
4. 訓練你能做出的最好的 `FullyConnectedNet`，驗證集與測試集都至少 50%。notebook 說小心調的話可以超過 55%，但這部分不要求、也不加分。

行內問答兩題：三層和五層網路哪個對初始化尺度比較敏感、為什麼；以及 AdaGrad 的更新為什麼會越來越小，Adam 會不會有同樣的問題。

**這題在練什麼**：過擬合 50 張圖是一個除錯習慣，如果模型連小資料都背不起來，問題在實作而不在資料。更新規則那一段直接對應 [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization) 投影片上的程式碼。

## 環境與繳交

**Colab 與 Drive**：作業頁附了一支 Colab 操作示範影片。每個 notebook 開頭都會掛載 Google Drive，並要你把 `FOLDERNAME` 改成解壓後資料夾在 Drive 裡的路徑，接著執行 `get_datasets.sh` 下載 CIFAR-10。作業頁另外提醒兩件事：要定期存檔，免得 Colab VM 斷線；以及為了能在執行中編輯檔案，開新 notebook 時要先把「Runtime version」從「Latest」改成「2025.07」。

**繳交**：五個 notebook 都做完後，在 Colab 執行 `collect_submission.ipynb`。它會把 `.py` 與 `.ipynb` 打包成 `a1_code_submission.zip`，並把所有 notebook 轉成一份 `a1_inline_submission.pdf`，兩個檔案都上傳 Gradescope。作業頁特別要求：繳交的 notebook 必須已經執行過，輸出要看得到。

**遲交**：[課程首頁](https://cs231n.stanford.edu/)寫的規則是整學期 4 天免費遲交日，每份作業最多用 2 天；用完之後每多遲一天扣 25%。

**生成式 AI**：[作業總頁](https://cs231n.stanford.edu/assignments.html)把生成式 AI 視同合作者，每個學生都必須獨立寫下解答；用生成式 AI 工具完成作業的大部分內容，被視為違反 Honor Code。

## 自學怎麼做

校外讀者拿不到 Gradescope，所以要自己把 notebook 裡的檢查點當成評分標準：

1. 下載 [assignment1.zip](https://cs231n.github.io/assignments/2026/assignment1.zip)，上傳到自己的 Google Drive，照作業頁設定 runtime version。
2. 照 Q1 → Q5 的順序做。Q3 開始的層會一路被 Q4、Q5 重複使用，Q3 沒寫對，後面都會壞。
3. 每一題先確認所有數值梯度檢查的相對誤差夠小，再去追準確率。
4. 準確率目標就是 notebook 寫的數字：kNN 超過 28%、兩層網路超過 48%、特徵加兩層網路超過 55%、全連接網路至少 50%。
5. 行內問答寫成文字，寫完再回去對 [L2](/posts/ai/2026-09-30-cs231n-image-classification-linear)–[L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) 的投影片，這是唯一的自我評分方式。

做之前可以先暖身：[L4 那篇](/posts/ai/2026-09-30-cs231n-neural-networks-backprop)介紹的 Backprop Colab 最後有一個填空練習，難度剛好在 Q3 之前。

今晚可以做的一件事：下載起始碼，打開 `cs231n/classifiers/k_nearest_neighbor.py`，只讀 `compute_distances_no_loops` 的 docstring，在紙上寫出 ‖x − y‖² 展開後的三項，想想哪一項可以用一次矩陣乘法算完。

## 延伸閱讀

- 課程全貌、存取缺口與 10 週自學排程：[Stanford CS231N 導讀（系列總覽）](/posts/ai/2026-09-30-cs231n-course-overview)
- 同一批觀念的另一個角度：[CMU 11-785 第 5 講：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)、[CMU 11-785 第 8 講：最佳化器與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS231N Assignment 1（Spring 2026）](https://cs231n.github.io/assignments2026/assignment1/) — 截止時間、Colab 設定、目標、Q1–Q5、繳交流程
- [assignment1.zip 起始碼](https://cs231n.github.io/assignments/2026/assignment1.zip) — notebook 內容、待實作函式的位置、準確率檢查點、行內問答
- [CS231N Assignments 總頁](https://cs231n.stanford.edu/assignments.html) — A1 占 12%、Honor Code、生成式 AI 政策
- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/) — 遲交規則、評分
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html) — A1 發佈與截止的講次
- [CIFAR-10 dataset](https://www.cs.toronto.edu/~kriz/cifar.html) — 作業使用的資料集
- [CS231N Backpropagation Review Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) — Q3 之前的暖身練習
- [CS231N 課程筆記：Image Classification](https://cs231n.github.io/classification/) — kNN 與交叉驗證
- [CS231N 課程筆記：Linear Classification](https://cs231n.github.io/linear-classify/) — Softmax 分類器
