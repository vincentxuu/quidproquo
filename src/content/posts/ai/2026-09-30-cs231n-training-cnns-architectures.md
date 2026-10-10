---
title: "CS231N L6：訓練 CNN 與經典架構——正規化、初始化、遷移學習與 VGG 到 ResNet"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, cnn, transfer-learning]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 7
tldr: "CS231N 第 6 講的 2026 投影片標題是「Training CNNs and CNN Architectures」，分成「怎麼搭」和「怎麼訓練」兩半。架構只細講兩個：VGG 證明三層 3×3 卷積比一層 7×7 更深、參數更少；ResNet 讓層去學殘差 F(x) = H(x) − x，解決深網路連訓練誤差都更差的最佳化問題。訓練那半最實用的是遷移學習：資料不到約一百萬張，就先找大資料集上的預訓練模型。"
description: "Stanford CS231N（Spring 2026）第 6 講導讀：CNN 的組件（正規化層、Dropout、激活函數）、ILSVRC 歷屆冠軍與 VGG／ResNet 案例、Kaiming 初始化、影像前處理、資料擴增與 Cutout、遷移學習的四格決策表，以及七步驟的超參數調整流程。依據 2026 投影片 lecture_6.pdf、課表列出的 AlexNet／VGG／GoogLeNet／ResNet 論文、官方筆記與 2025 年 L6 錄影。"
draft: false
glossary:
  - term: "殘差連接"
    aliases: ["residual connection", "skip connection"]
    definition: "讓一組層的輸出變成 F(x) + x，也就是層只需要學輸入與目標之間的差（殘差）。F(x) = 0 時整個 block 就是恆等映射。"
    context: "CS231N L6 用 ResNet 說明為什麼加了捷徑，152 層的網路反而比 20 層好訓練。"
  - term: "遷移學習"
    aliases: ["transfer learning"]
    definition: "先在大資料集上訓練模型，再把學到的權重拿到小資料集的新任務上，只重訓最後幾層或整個微調。"
    context: "CS231N L6 建議：資料集少於約一百萬張時，先找相似的大資料集預訓練，再遷移。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：投影片依據 Spring 2026 的 [lecture_6.pdf](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf)；錄影依據 Spring 2025 的 [YouTube L6](https://www.youtube.com/watch?v=aVJy4O5TOk8)。兩者可能有差異，下面會標出。本文是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列第 7 篇，接在 [L5：用 CNN 做影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification)之後。

[上一講](/posts/ai/2026-09-30-cs231n-cnn-image-classification)給了卷積和池化兩塊積木。這一講回答接下來的兩個問題：**積木要怎麼疊？疊好之後要怎麼訓練？**

[官方課表](https://cs231n.stanford.edu/schedule.html)把這一講標為「CNN Architectures」，列出 Batch Normalization、Transfer learning、AlexNet／VGG／ResNet 三個主題，並附上 [AlexNet](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)、[VGGNet](https://arxiv.org/abs/1409.1556)、[GoogLeNet](https://arxiv.org/abs/1409.4842)、[ResNet](https://arxiv.org/abs/1512.03385) 四篇論文。不過課表連結的 2026 投影片，封面標題是 **「Training CNNs and CNN Architectures」**，涵蓋的範圍比課表寫的更廣。

用到的官方材料：

- 2026 投影片 lecture_6.pdf，共 98 頁，頁尾日期 April 16, 2026（下文頁碼都指 PDF 頁碼）
- 課表列出的四篇論文
- 官方筆記 [Convolutional Networks](https://cs231n.github.io/convolutional-networks/) 的案例研究，與 [Neural Networks Part 2](https://cs231n.github.io/neural-networks-2/) 的 Batch Normalization 段落
- Spring 2025 的 L6 錄影；2025 課表上這一講的講者是 Zane Durante

存取等級是 **A3**。2026 年課堂錄影只在 Canvas。

先講一個和課表不一致的地方：**2026 投影片沒有專門講 BatchNorm 的頁面。** 正規化層的例子用的是 LayerNorm，BatchNorm 只出現在第 13 頁一張比較四種正規化的圖裡，旁邊寫「You will implement some of these in assignment 2!」。BatchNorm 的實作留給 [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn) Q1。[2025 年的 lecture_6.pdf](https://cs231n.stanford.edu/slides/2025/lecture_6.pdf) 章節和 2026 版幾乎一樣，所以 2025 錄影應該也是這個結構，但我沒有逐分鐘核對影片。

## 課程影片來源

本文以 Spring 2026 教材為準。官方 Spring 2026 課表（2026-10-10 即時查證）沒有列出錄影連結，也沒有找到 Spring 2026 的公開播放清單；下列 Spring 2025 錄影來自 Stanford Online 的公開播放清單，是講次標題相同的相關補充影片，內容可能與 2026 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=aVJy4O5TOk8
title: Stanford CS231N Deep Learning for Computer Vision | Spring 2025 | Lecture 6: CNN Architectures
```

原始影片：[Stanford CS231N Deep Learning for Computer Vision | Spring 2025 | Lecture 6: CNN Architectures](https://www.youtube.com/watch?v=aVJy4O5TOk8)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 全講地圖

第 4 頁把整講分成兩大組：

| 怎麼搭 CNN | 怎麼訓練 CNN |
|---|---|
| CNN 裡的各種層 | 權重初始化 |
| 激活函數 | 資料前處理 |
| CNN 架構 | 資料擴增 |
| | 遷移學習 |
| | 超參數選擇 |

第 97 頁的總結寫的是「We reviewed 8 topics at a high level」。這是一講鳥瞰，每個主題都只講重點。

## 怎麼搭：CNN 的組件

### 正規化層

第 9 頁列出 CNN 的組件：卷積層、池化層、全連接層，加上正規化層、Dropout（有時用）、激活函數。

正規化層的核心想法（第 11 頁）：**學一組參數，讓模型能縮放、平移輸入資料。** 做法分兩步：先正規化，再用學到的參數縮放與平移。

投影片以 LayerNorm（Ba、Kiros、Hinton 2016）為例。輸入 x 的形狀是 N × D，平均值與標準差 μ、σ 的形狀是 N × 1，也就是每個樣本各算一組；學到的 γ、β 形狀是 1 × D，套用到每個樣本：

```
y = γ (x − μ) / σ + β
```

第 13 頁引用 Wu and He（ECCV 2018）〈Group Normalization〉的圖，並排比較 Batch Norm、Layer Norm、Instance Norm、Group Norm 各自在哪些維度上算統計量。

課表列了 BatchNorm，所以補上官方筆記的說法：BatchNorm 由 Ioffe 與 Szegedy 提出，在訓練一開始就強制網路各層的激活值接近單位高斯分布；通常插在全連接層或卷積層之後、非線性之前。筆記說用了 BatchNorm 的網路「significantly more robust to bad initialization」，並把它解讀成「在網路每一層都做前處理，而且是可微分的」。

### Dropout

第 16–20 頁。每次前向傳播時隨機把一些神經元設為 0，丟棄機率是超參數，**0.5 很常見**。

為什麼這樣會有用？投影片給了兩種解釋：

1. 強迫網路學出**冗餘的表示**，避免特徵互相依賴。例子是判斷貓時，「有耳朵」「有尾巴」「毛茸茸」這些特徵有些被丟掉，網路仍要能判斷。
2. Dropout 等於在訓練一個**共享參數的大型 ensemble**，每一個二元遮罩就是一個模型。4096 個單元的全連接層有 2^4096 種遮罩。

測試時所有神經元都開著，所以要縮放激活值，讓測試時的輸出等於訓練時的期望輸出。第 20 頁的總結是：訓練時丟，測試時縮放。

### 激活函數

第 24–31 頁。

- **Sigmoid**：把數值壓到 [0, 1]，歷史上常用，因為可以解讀成神經元的「發火率」。關鍵問題是輸入很大或很小時梯度幾乎為零，很多層 sigmoid 疊起來，梯度會越來越小。
- **ReLU**：f(x) = max(0, x)。正區間不飽和、計算便宜，實務上收斂比 sigmoid 快很多（投影片舉 AlexNet 論文的「e.g. 6x」）。缺點是輸出不以零為中心，x < 0 時會出現「dead ReLU」。
- **GELU**（Hendrycks et al. 2016）：f(x) = x·Φ(x)。0 附近行為平滑，實務上有助訓練；代價是計算比 ReLU 貴，而且很大的負值梯度仍會趨近 0。

激活函數放在哪裡？第 31 頁的答案：通常放在線性運算之後，例如全連接層、卷積層。

## 怎麼搭：從 ILSVRC 冠軍看架構演進

第 33 頁與第 45 頁是一張經典圖：ImageNet 大規模視覺辨識競賽（ILSVRC）歷屆冠軍的 top-5 錯誤率。

| 年份 | 模型 | top-5 錯誤率（%） | 層數 |
|---|---|---|---|
| 2010 | Lin et al. | 28.2 | 淺層 |
| 2011 | Sanchez & Perronnin | 25.8 | 淺層 |
| 2012 | AlexNet | 16.4 | 8 |
| 2013 | ZFNet（Zeiler & Fergus） | 11.7 | 8 |
| 2014 | VGG | 7.3 | 19 |
| 2014 | GoogLeNet | 6.7 | 22 |
| 2015 | ResNet | 3.6 | 152 |
| 2016 | Shao et al. | 3 | 152 |
| 2017 | SENet | 2.3 | 152 |

圖上另外標了人類的 5.1（Russakovsky et al.），並把 2015 年以後框起來，稱為「Revolution of Depth」。

2026 投影片只對 **VGG** 和 **ResNet** 做案例研究。AlexNet 與 GoogLeNet 只出現在這張圖和比較圖裡。想補上這兩個，官方筆記的案例研究有：AlexNet 在 2012 年以 top-5 錯誤率 16% 大幅領先第二名的 26%，架構像 LeNet 但更深、更大，而且把卷積層直接疊在一起；GoogLeNet 是 2014 年冠軍，主要貢獻是 Inception 模組，參數量從 AlexNet 的 60M 降到 4M，並用 average pooling 取代頂端的全連接層。

### VGG：小濾波器、更深的網路

第 36–44 頁。VGG（Simonyan and Zisserman 2014）的設計規則很單純：**只用 3×3、stride 1、pad 1 的卷積，和 2×2、stride 2 的 max pooling。** 層數從 AlexNet 的 8 層加到 16–19 層（VGG16、VGG19）。投影片標註 ZFNet 在 ILSVRC'13 是 11.7%，VGG 在 ILSVRC'14 降到 7.3%。

為什麼用小濾波器？投影片問：三層 3×3（stride 1）卷積疊起來，有效感受野多大？答案是 **7×7**，和一層 7×7 卷積一樣。但三層 3×3：

- 更深，非線性更多
- 參數更少：每層 C 個通道時，是 3 × (3²C²) = 27C²，對比 7²C² = 49C²

這個結論可以用 [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification) 的感受野公式驗證：1 + 3 × (3 − 1) = 7。

官方筆記補了 VGG 的成本：一張圖前向傳播要約 93MB 記憶體（24M 個激活值 × 4 bytes，反向傳播約再乘 2），總參數約 138M，而且大部分參數集中在最後的全連接層，第一個全連接層就占了約 100M。

### ResNet：讓層去學殘差

第 46–58 頁是這講最重要的一段。問題是：**在「普通」卷積網路上一直疊更多層，會怎樣？**

投影片的圖：56 層網路的**訓練誤差和測試誤差都比 20 層差**。訓練誤差也更差，代表問題不是過擬合。

推論是這樣走的：

1. 事實：深模型比淺模型有更強的表達能力（參數更多）。
2. 假說：問題出在最佳化，深模型比較難訓練。
3. 深模型至少要能和淺模型一樣好。一個構造解是：把淺模型學好的層複製過來，多出來的層設成**恆等映射**。
4. 所以與其讓層直接學目標映射 H(x)，不如讓它學**殘差** F(x) = H(x) − x，輸出變成 H(x) = F(x) + x。F(x) = 0 時，這個 block 就是恆等映射。

完整的 ResNet 架構：

- 疊殘差 block，每個 block 有兩層 3×3 卷積
- 每隔一段，濾波器數量加倍，同時用 stride 2 在空間上降採樣（每個維度除以 2）
- 開頭多一層卷積當 stem（7×7 conv, 64, /2）
- ImageNet 上的總深度有 18、34、50、101、152 層

成績：152 層模型是 ILSVRC'15 分類冠軍，top-5 錯誤率 3.57%，並拿下 ILSVRC'15 與 COCO'15 所有分類與偵測競賽。

官方筆記還提到 ResNet 大量使用 BatchNorm，而且網路尾端沒有全連接層。

**怎麼做**：拿 VGG16 和 ResNet 的圖，只看「空間尺寸在哪裡減半、通道數在哪裡加倍」，在紙上標出每個 stage 的輸出形狀。這比背層數更能看出兩種設計的差別。

## 怎麼訓練：初始化、前處理與正則化

### 權重初始化

第 60–66 頁用一個 6 層、隱藏層寬 4096 的網路做實驗：

- 初始權重太小：越深的層，激活值都趨近零。
- 把初始權重標準差從 0.01 提高到 0.05：激活值很快爆掉。

合適的大小取決於層的寬度。投影片給的解法是 **Kaiming／MSRA 初始化**（He et al., ICCV 2015）：針對 ReLU 修正，std = sqrt(2 / D_in)。這樣每一層的激活值尺度都剛好。

### 影像前處理

第 68 頁的 TLDR：對每個通道減去平均、除以標準差，幾乎所有現代模型都這樣做。統計量沿著通道算，RGB 就是 3 個數字，要先用你的資料集算好。

### 正則化的共同模式

第 70–76 頁。正則化有一個共同模式：**訓練時加入某種隨機性，測試時把隨機性平均掉**（有時是近似）。Dropout 是一例，資料擴增是另一例：

- 水平翻轉
- 隨機裁切與縮放。ResNet 的做法：訓練時在 [256, 480] 中隨機選 L，把圖的短邊縮放到 L，再隨機取 224×224 的區塊。測試時在 5 個尺度 {224, 256, 384, 480, 640} 上，各取 10 個 224×224 區塊（四角加中心，再加翻轉），把結果平均。
- 色彩抖動：隨機調整對比與亮度。
- **Cutout**（DeVries and Taylor 2017）：訓練時把圖上隨機區域設成 0，測試時用完整圖片。投影片說它在 CIFAR 這類小資料集上效果很好，在 ImageNet 這類大資料集上比較少用。

## 怎麼訓練：遷移學習

第 78–87 頁回答一個很實際的問題：**資料不多，還能訓練 CNN 嗎？**

投影片先引用兩篇 2014 年的論文（Donahue et al. 的 DeCAF，與 Razavian et al. 的〈CNN Features Off-the-Shelf〉），說明在 ImageNet 上訓練好的 CNN 特徵本身就很好用：拿 AlexNet 的特徵空間做 L2 最近鄰，找到的圖語意上很接近。

做法分三種情境：

1. 先在 ImageNet（或網路規模的資料）上訓練。
2. **小資料集（C 個類別）**：把最後的 FC-1000 換成 FC-C 並重新初始化，只訓練這一層，其他層凍結。
3. **大一點的資料集**：用預訓練模型初始化，再微調全部。資料越多，越值得訓練更多層。

第 86 頁的四格表：

| | 資料集很像 | 資料集很不同 |
|---|---|---|
| **資料很少** | 在最後一層上接線性分類器 | 換一個預訓練模型，或多收集資料 |
| **資料很多** | 微調所有層 | 微調所有層，或從頭訓練 |

第 87 頁是給專題的結論：**你的資料集少於約一百萬張圖時，先找一個有相似資料的大資料集訓練大模型，再遷移到你的資料集。** 各框架都有預訓練模型的「Model Zoo」，投影片列了 [PyTorch vision](https://github.com/pytorch/vision) 與 [pytorch-image-models](https://github.com/huggingface/pytorch-image-models)。

## 怎麼訓練：超參數選擇的七個步驟

第 89–96 頁：

1. 檢查初始 loss。
2. 在一小批樣本上過擬合。
3. 找一個讓 loss 下降的學習率：用上一步的架構、全部訓練資料、小的 weight decay，找出約 100 次迭代內讓 loss 明顯下降的學習率。可以試 1e-1、1e-2、1e-3、1e-4、1e-5。
4. 用粗的網格搜尋超參數，每組訓練約 1–5 個 epoch。
5. 細化網格，訓練更久。
6. 看 loss 與準確率曲線：準確率還在上升，代表要訓練更久；訓練與驗證差距很大，代表過擬合，要加強正則化或增加資料；幾乎沒有差距，常常代表欠擬合，要訓練更久，或換大一點的模型。
7. 回到第 5 步。

第 96 頁引用 Bergstra and Bengio（2012）：**隨機搜尋比網格搜尋好**。當一個超參數重要、另一個不重要時，網格搜尋在重要的那一維只試到少數幾個值，隨機搜尋則每次都試到新的值。

**怎麼做**：下次訓練模型前，先做第 1、2 步。初始 loss 對不上理論值，或連一小批資料都過擬合不了，後面的調參都是白費。

## 這一篇可以確認與不能確認的

可以確認：2026 課表的主題與論文清單、2026 投影片的內容與標題、官方筆記的 AlexNet／GoogLeNet／VGG／ResNet 案例研究與 BatchNorm 段落、2025 年 L6 錄影的存在與講者（依 2025 課表）。

不能確認：2026 年這一講實際由誰主講（2026 課表的講者欄被註解掉）、2026 課堂上有沒有口頭補充 BatchNorm。2025 投影片與 2026 版章節幾乎一致，但我沒有逐段核對 2025 錄影的口述內容。

延伸閱讀：站上 [CMU 11-785 的 CNN 系列](/posts/ai/2026-08-22-cmu-11785-10-cnn-two)對 CNN 的訓練與架構有另一套推導。

系列導覽：上一篇 [L5：用 CNN 做影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification)｜下一篇 [L7：循環神經網路與影像描述](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Spring 2025 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。

## 參考資料

- [CS231n: Deep Learning for Computer Vision（Spring 2026 課程首頁）](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 6: Training CNNs and CNN Architectures 投影片（Spring 2026）](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf)
- [Lecture 6 投影片（Spring 2025 版，對照用）](https://cs231n.stanford.edu/slides/2025/lecture_6.pdf)
- [CS231n 官方筆記：Convolutional Neural Networks（案例研究）](https://cs231n.github.io/convolutional-networks/)
- [CS231n 官方筆記：Neural Networks Part 2（Batch Normalization）](https://cs231n.github.io/neural-networks-2/)
- [Stanford CS231N Spring 2025 Lecture 6: CNN Architectures（YouTube）](https://www.youtube.com/watch?v=aVJy4O5TOk8)
- [CS231n Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Krizhevsky, Sutskever, Hinton 2012：ImageNet Classification with Deep Convolutional Neural Networks（AlexNet）](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
- [Simonyan and Zisserman 2014：Very Deep Convolutional Networks for Large-Scale Image Recognition（VGG）](https://arxiv.org/abs/1409.1556)
- [Szegedy et al. 2014：Going Deeper with Convolutions（GoogLeNet）](https://arxiv.org/abs/1409.4842)
- [He et al. 2015：Deep Residual Learning for Image Recognition（ResNet）](https://arxiv.org/abs/1512.03385)
- [CS231n Assignment 2（Spring 2026）](https://cs231n.github.io/assignments2026/assignment2/)
