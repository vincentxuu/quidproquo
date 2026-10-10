---
title: "CS231N A2 導讀：BatchNorm、Dropout、CNN、PyTorch 與 RNN Captioning"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, pytorch, cnn]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 9
tldr: "CS231N Spring 2026 的 A2 佔總成績 18%，五個 notebook 從手寫 BatchNorm／LayerNorm、Dropout、卷積與池化的 forward／backward，一路走到 PyTorch 的三層抽象，最後用 PyTorch 在 COCO 上做 RNN 影像描述。轉折點在 Q4：前三題的梯度要自己推，Q5 起交給 autograd，再用數值梯度檢查驗證。官方投影片提醒這是三份作業裡最長的一份。"
description: "Stanford CS231N（Spring 2026）Assignment 2 導讀：依官方作業頁與 assignment2.zip 起始碼整理 Q1 BatchNorm 與 LayerNorm、Q2 Dropout、Q3 卷積網路與 Spatial Batch/Group Norm、Q4 PyTorch 三種 API 與 CIFAR-10 挑戰、Q5 RNN captioning 的內容、檔案、inline questions 與自學路線，不提供解答。"
draft: false
glossary:
  - term: "Batch Normalization"
    aliases: ["BatchNorm", "批次正規化"]
    definition: "訓練時用 minibatch 的平均與變異數把每個特徵正規化，再乘上可學的 scale（γ）、加上 shift（β）；測試時改用訓練期間累積的 running mean 與 running variance。"
    context: "CS231N A2 Q1 要手寫它的 forward、backward，以及化簡過的 backward。"
  - term: "Group Normalization"
    aliases: ["GroupNorm", "組正規化"]
    definition: "把每筆資料的通道切成 G 組，在每筆資料、每組內部做正規化，介於對整筆資料正規化的 LayerNorm 與跨 batch 正規化的 BatchNorm 之間，不依賴 batch 大小。"
    context: "CS231N A2 Q3 的最後一段要手寫 spatial group normalization。"
  - term: "autograd"
    aliases: ["自動微分"]
    definition: "PyTorch 的自動微分引擎：forward 時記錄動態計算圖，呼叫 backward 時自動算出所有參數的梯度，不必手寫反向傳播。"
    context: "CS231N A2 從 Q4 起改用 autograd，Q5 的 RNN 只需寫 forward。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：作業依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Assignment 2 頁面](https://cs231n.github.io/assignments2026/assignment2/)與可下載的 [assignment2.zip](https://cs231n.github.io/assignments/2026/assignment2.zip)（2026-09-30 下載，notebook 與 `cs231n/` 模組逐一打開核對）。對應的課堂錄影請用 [Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)，2026 錄影只放在 Canvas，限修課生；兩個年份的內容可能不同。存取等級 **A3**：題目頁與起始碼全公開；拿不到的是 Gradescope 自動評分、Ed 公告（包括第 9 講提到的 notebook 修正說明）與成績。本文只整理題目在練什麼，不給解答。

**系列位置**：上一篇 [L7：循環神經網路與影像描述](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks)｜下一篇 [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

A1 讓你用 numpy 手寫出一個全連接網路。A2 接著問兩件事：網路變深以後，怎麼讓它還訓練得動？什麼時候該把手寫的反向傳播交給框架？

五道題剛好排成一條從「自己推梯度」到「交給 PyTorch」的斜坡。[作業總頁](https://cs231n.stanford.edu/assignments.html)把 A2 定為總成績的 18%，是三份作業裡權重最高的一份。[第 9 講投影片](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf)第 2 頁也提醒：A2 是三份裡最長的，截止後緊接著期中考與專題 milestone，要早點開始。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 這份作業長什麼樣子

| 題目 | Notebook | 你要改的檔案 | 對應講次 |
|---|---|---|---|
| Q1 Batch Normalization | `BatchNormalization.ipynb` | `cs231n/layers.py`、`classifiers/fc_net.py` | [L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures) |
| Q2 Dropout | `Dropout.ipynb` | `cs231n/layers.py`、`classifiers/fc_net.py` | L6 |
| Q3 卷積網路 | `ConvolutionalNetworks.ipynb` | `cs231n/layers.py`、`classifiers/cnn.py` | [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification)、L6 |
| Q4 PyTorch on CIFAR-10 | `PyTorch.ipynb` | notebook 本身 | 4/24 PyTorch review session |
| Q5 RNN 影像描述 | `RNN_Captioning_pytorch.ipynb` | `cs231n/rnn_layers_pytorch.py`、`classifiers/rnn_pytorch.py` | [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks) |

[作業頁](https://cs231n.github.io/assignments2026/assignment2/)寫的截止時間是 2026 年 5 月 8 日（週五）晚上 11:59（PST）。第 8 講投影片第 2 頁寫的是「due 5/7」，兩者差一天，以作業頁為準。

另外有一個對不上的地方要先講：[作業總頁](https://cs231n.stanford.edu/assignments.html)列的 A2 主題是「Batch Normalization, Dropout, Convolutional Nets, Network Visualization, Image Captioning with RNNs」，裡面有 Network Visualization、沒有 PyTorch。但作業頁與 zip 裡實際的第四題是 PyTorch，沒有任何可視化 notebook。本文以作業頁與起始碼為準。

整份作業在 Colab 上跑。做完前五個 notebook 後執行 `collect_submission.ipynb`，它會打包 `a2_code_submission.zip`，並把所有 notebook 轉成一份 `a2_inline_submission.pdf`，兩個檔案一起交到 Gradescope。作業頁特別提醒：notebook 的執行順序要是由上到下，否則自動評分可能出錯，必要時用「Restart and Run All」重跑。

## Q1：BatchNorm 與 LayerNorm

**場景**：A1 的全連接網路疊到五、六層以後，初始化稍微沒調好就訓練不動。

Notebook 開頭引用 [Ioffe & Szegedy 2015](https://arxiv.org/abs/1502.03167) 的假設：網路深處每一層看到的特徵分布，會隨著前面的權重更新一直漂移，讓訓練變難。BatchNorm 的做法是在網路裡插入正規化層，訓練時用 minibatch 估計平均與變異數，測試時改用訓練期間累積的 running average。

你要在 `layers.py` 裡寫出：

1. `batchnorm_forward`：訓練模式與測試模式要分開處理。
2. `batchnorm_backward`：照計算圖一步一步反傳。
3. `batchnorm_backward_alt`：在紙上把梯度化簡後的版本。Notebook 拿 sigmoid 類比：sigmoid 的 backward 可以逐步反傳，也可以先在紙上化簡成一個簡單公式，BatchNorm 也能這樣化簡。
4. 把 BatchNorm 接進 `FullyConnectedNet`，接著比較有、沒有 BatchNorm 的深層網路。

之後的兩個實驗各配一題 inline question：改變權重初始化的尺度，觀察有、沒有 BatchNorm 的差別；改變 batch size，觀察 BatchNorm 的表現如何跟著變。

<details>
<summary>BatchNorm backward 的起點（notebook 給的定義）</summary>

Notebook 在 alternative backward 一節先寫出 forward 的四個式子，讓你從這裡開始化簡：

```text
μ   = (1/N) Σ_k x_k
v   = (1/N) Σ_k (x_k − μ)²
σ   = sqrt(v + ε)
y_i = (x_i − μ) / σ
```

難點在於 μ 和 σ 都依賴整個 batch，所以每個 x_i 的梯度會經由三條路徑回來：直接經過 y_i、經過 μ、經過 v。第一版照計算圖把三條路徑分開算，第二版把它們合併成一條式子。

</details>

後半段換成 [Layer Normalization](https://arxiv.org/abs/1607.06450)（Ba、Kiros 與 Hinton）：它對每一筆資料自己的所有特徵做正規化，不依賴 batch。你要寫 `layernorm_forward`／`layernorm_backward`，再做一次 batch size 實驗。這一段的兩題 inline question 很適合自我檢查：

- 四種影像前處理裡，哪一種類似 BatchNorm、哪一種類似 LayerNorm？
- 在什麼情況下 LayerNorm 可能效果不好？（選項是很深的網路、特徵維度很小、正則化項很大）

## Q2：Dropout

`Dropout.ipynb` 比較短。你要寫 `dropout_forward` 與 `dropout_backward`，接進 `FullyConnectedNet`，最後做一個正則化實驗：比較有、沒有 dropout 時的訓練與驗證準確率。

這題的 inline question 值得先想再寫：inverted dropout 如果**不**除以 `p`，會發生什麼事？答案跟訓練與測試兩種模式的輸出期望值有關。

## Q3：卷積網路

這是 A2 手寫梯度的最後一站，也是最長的一題。Notebook 開頭的說法是：全連接網路計算效率高，適合拿來實驗，但實務上最好的結果都來自卷積網路。

依序要做：

1. **Naive 卷積**：`conv_forward_naive`、`conv_backward_naive`。中間有一段 aside，示範用卷積做影像處理。
2. **Naive max pooling**：`max_pool_forward_naive`、`max_pool_backward_naive`。
3. **Fast layers**：官方已經在 `fast_layers.py` 提供快速版，靠 Cython 擴充。第一次要執行一個編譯 cell，存檔，重啟 runtime，再從頭跑一次。
4. **Sandwich layers 與三層 ConvNet**：在 `classifiers/cnn.py` 完成 `ThreeLayerConvNet`，照 sanity check loss → gradient check → overfit 小資料 → 正式訓練 → 可視化第一層 filter 的順序走。
5. **Spatial BatchNorm**：把 Q1 的 BatchNorm 推廣到 `(N, C, H, W)` 的特徵圖。
6. **Spatial Group Normalization**：notebook 引用 LayerNorm 論文的觀察，在卷積層上 LayerNorm 不如 BatchNorm，因為靠近影像邊緣的單元統計性質跟其他單元差很多。[Group Normalization](https://arxiv.org/abs/1803.08494)（Wu & He）的折衷做法是把每筆資料的通道切成 G 組，逐組正規化。

「sanity check → gradient check → overfit 小資料」這個順序是整門課反覆使用的除錯流程。第 4 步讓你在 Q3 再完整走一次，養成習慣比寫對公式更重要。

## Q4：PyTorch，同一個網路寫三次

Q4 是整份作業的轉折點。Notebook 的說法很直接：你已經懂框架的內部了，現在可以放心用框架。用 PyTorch 可以直接跑 GPU、不必寫 CUDA，也能讓期末專題的實驗快很多。

`PyTorch.ipynb` 分五部分，用三種抽象層級寫同一批模型：

| 部分 | 抽象層級 | 做法 |
|---|---|---|
| Part II Barebones | 層級 1 | 直接操作 Tensor，自己管參數與初始化 |
| Part III Module API | 層級 2 | 繼承 `nn.Module`，在 `__init__` 定義層、在 `forward` 串起來 |
| Part IV Sequential API | 層級 3 | 用 `nn.Sequential` 把前饋堆疊寫成一行 |
| Part V CIFAR-10 挑戰 | 自選 | 自己設計網路 |

Notebook 附了一張取捨表：Barebones 彈性高、方便性低；`nn.Module` 彈性高、方便性中等；`nn.Sequential` 彈性低、方便性高。

每一層都會訓練一個兩層全連接網路與一個三層 ConvNet（32 個 5×5 filter → ReLU → 16 個 3×3 filter → ReLU → 全連接輸出 10 類），並給出「一個 epoch 後應該看到的準確率」當 sanity check。例如 Barebones 版三層 ConvNet 應該超過 42%，Sequential 版改用 Nesterov momentum 0.9 的 SGD，應該超過 55%。

Part V 的要求是：10 個 epoch 內在 CIFAR-10 **驗證集**上達到至少 70%。層、optimizer、超參數都可以自己挑。Notebook 列了幾個方向：filter 大小、filter 數量、max pooling 與 strided convolution 的取捨、在卷積層後加 spatial batch norm（在 PyTorch 叫 `BatchNorm2d`）、加深網路。最後要在 notebook 末尾描述你做了什麼，測試集只能跑一次。

如果你對 PyTorch 還陌生，先看課表上 4/24 PyTorch Review Session 的 [Colab notebook](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/pytorch.ipynb)。它從 Tensor、broadcasting、autograd 講起，接著是建一個簡單網路、Dataset 與 DataLoader、FashionMNIST，再比較 CPU 與 GPU 的訓練速度，最後講 pre-trained weights。

## Q5：用 PyTorch 做 RNN 影像描述

最後一題把 [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks) 的 RNN 接上 CNN 特徵，在 COCO 上產生圖片描述。

**資料**：notebook 用 2014 年版的 [COCO](https://cocodataset.org/)，約 8 萬張訓練圖、4 萬張驗證圖，每張有 5 句 Amazon Mechanical Turk 標註的描述。圖片不必自己過 CNN：官方已經從 ImageNet 預訓練的 VGG-16 抽出 fc7 特徵，再用 PCA 從 4096 維降到 512 維。原圖將近 20 GB，所以沒有附在下載檔裡，只給 Flickr URL 方便可視化。描述文字已經編碼成整數 ID 序列。

**要寫的部分**，全部放在 `rnn_layers_pytorch.py` 與 `classifiers/rnn_pytorch.py`：

- `rnn_step_forward`、`rnn_forward`：vanilla RNN 的單步與整段序列。
- `word_embedding_forward`：詞 ID 轉向量。
- `temporal_affine_forward`、`temporal_softmax_loss`：每個時間步的輸出層與 loss（有 mask 處理不同長度）。
- `CaptioningRNN` 的 `loss` 與 `sample`。

轉折就在這裡：notebook 明講，因為用 PyTorch 寫，**backward 交給 autograd**，`rnn_step_backward` 等函式不必實作。你仍然要用數值梯度檢查器驗證 autograd 的結果；想挑戰的話，也可以自己寫 backward，但不是必做。

`sample` 方法處理訓練與測試的落差。訓練時每一步餵入正確答案的詞；測試時從詞彙分布抽樣，再把抽到的詞當成下一步的輸入。Notebook 預告：在過擬合的小模型上，訓練資料的抽樣結果會很好，驗證資料則多半不通順。

起始碼的 `CaptioningRNN` 也接受 `cell_type='lstm'`，`rnn_layers_pytorch.py` 裡也有 `lstm_step_forward`／`lstm_forward` 的空殼。不過 notebook 只要求 vanilla RNN，只寫了一句「you will implement the LSTM case later」。A2 頁面與 notebook 都沒有列出 LSTM 題目。

唯一的 inline question 問：改用**字元級**RNN 做描述，有什麼優點與缺點？提示是比較字元級與詞級模型的參數空間。

## 自學怎麼做

1. **先補兩講**：Q1–Q3 依賴 L5–L6，Q5 依賴 L7。先看完 2025 播放清單的 [Lecture 5–7](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16) 再開工。
2. **Q1 的兩版 backward 都寫**：化簡版是全作業最好的「計算圖 vs 手推」練習，也是 [L4 反向傳播](/posts/ai/2026-09-30-cs231n-neural-networks-backprop)的延伸。
3. **Q4 之前做 PyTorch review Colab**：一個下午就能跑完，Part V 會輕鬆很多。
4. **Part V 開 GPU**：在 Colab 用 `Runtime → Change runtime type` 切到 GPU，而且要在 import 之前切，因為切換會重啟 kernel。
5. **遵守 Honor Code**：[作業總頁](https://cs231n.stanford.edu/assignments.html)寫明往年解答流傳在網路上，官方要求作業是自己的成果。生成式 AI 的使用比照合作規範：要獨立寫出答案、註明合作性質，用 AI 大幅完成作業內容違反 Honor Code。

## 延伸閱讀

- 同一條「手寫 layer → 框架」路線在 [A1 導讀](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)已經起步
- 下一份作業把 RNN 換成 Transformer：[A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)
- 另一門課怎麼教 backprop 與神經網路：[CS224N：反向傳播與神經網路](/posts/ai/2026-08-22-cs224n-backprop-neural-nets)
- 更完整的深度學習理論課：[MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/) — 講者、評分、錄影政策
- [CS231N Assignment 2 頁面（Spring 2026）](https://cs231n.github.io/assignments2026/assignment2/) — 截止時間、Goals、Q1–Q5 說明、繳交流程
- [assignment2.zip 起始碼](https://cs231n.github.io/assignments/2026/assignment2.zip) — 五個 notebook、`cs231n/` 模組、`collectSubmission.sh`
- [CS231N 作業總頁](https://cs231n.stanford.edu/assignments.html) — A2 權重 18%、Honor Code、生成式 AI 政策（主題清單寫 Network Visualization，與作業頁不同）
- [CS231N 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html) — A2 發佈日、PyTorch Review Session
- [PyTorch Review Session Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/pytorch.ipynb)
- [Lecture 8 投影片（Spring 2026）](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf) — 第 2 頁「Assignment 2 out, due 5/7」
- [Lecture 9 投影片（Spring 2026）](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) — 第 2 頁 A2 最長、notebook 修正公告
- [Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Ioffe & Szegedy, Batch Normalization（2015）](https://arxiv.org/abs/1502.03167)
- [Ba, Kiros & Hinton, Layer Normalization（2016）](https://arxiv.org/abs/1607.06450)
- [Wu & He, Group Normalization（2018）](https://arxiv.org/abs/1803.08494)
- [COCO dataset](https://cocodataset.org/)
