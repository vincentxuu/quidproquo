---
title: "CS231N L5：用 CNN 做影像分類——從手工特徵到卷積與池化"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, cnn]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 6
tldr: "兩層網路會把 32×32×3 的圖片拉平成 3072 維向量，空間結構就此消失。CS231N L5 的答案是卷積層與池化層：卷積用一組小濾波器在圖上滑動，同一組權重用在每個位置；池化負責降採樣，沒有可學參數。兩者都有平移等變性。記住一條公式就能算每一層的輸出尺寸：(W − K + 2P) / S + 1。"
description: "Stanford CS231N（Spring 2026）第 5 講導讀：線性分類器與 MLP 的限制、色彩直方圖與 HOG 等手工特徵、LeNet 到 AlexNet 再到 ViT 的歷史脈絡、卷積層的形狀與參數計算、padding／stride／感受野、池化層，以及平移等變性。依據 2026 投影片 lecture_5.pdf、官方筆記 Convolutional Networks 與 2025 年 L5 錄影。"
draft: false
glossary:
  - term: "感受野"
    aliases: ["receptive field"]
    definition: "輸出特徵圖上的一個元素，實際依賴的輸入區域大小。kernel 大小 K 的卷積疊 L 層（stride 1），感受野是 1 + L × (K − 1)。"
    context: "CS231N L5 用它說明為什麼網路內部需要降採樣。"
  - term: "平移等變性"
    aliases: ["translation equivariance"]
    definition: "先平移輸入再做卷積或池化，結果等於先做卷積或池化再平移輸出。"
    context: "CS231N L5 的直覺說法是：影像特徵不取決於它出現在圖上的哪個位置。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：投影片依據 Spring 2026 課表連結的 [lecture_5.pdf](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf)；錄影依據 Spring 2025 的 [YouTube L5](https://www.youtube.com/watch?v=f3g1zGdxptI)。兩者可能有差異，下面會標出。本文是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列第 6 篇，接在 [A1 導讀](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)之後。

[CS231N](https://cs231n.stanford.edu/) 的前四講把分類 pipeline 搭好了：線性分類器、loss、最佳化、兩層神經網路與 backprop。第 5 講開始第二單元「Perceiving and Understanding the Visual World」，[官方課表](https://cs231n.stanford.edu/schedule.html)列了三個主題：歷史、高階表示與影像特徵、卷積與池化。

這一講要回答的問題只有一個：**圖片有空間結構，為什麼前面的模型用不上，要換成什麼運算才用得上？**

用到的官方材料：

- 2026 投影片 lecture_5.pdf，共 107 頁（下文頁碼都指 PDF 頁碼）
- 官方筆記 [Convolutional Networks](https://cs231n.github.io/convolutional-networks/)，課表把它列為這一講的閱讀
- Spring 2025 的 L5 錄影；2025 課表上這一講的講者是 Justin Johnson

存取等級是 **A3**：投影片、筆記與錄影都公開，但 2026 年的錄影只放在 Canvas，限修課生。

有一個小地方要先說明。這份 2026 投影片每頁頁尾印的日期是「April 14, 2025」，但第 2 頁的行政公告寫 A1 在「Wednesday 4/16」截止，跟 2026 課表一致。本文只把它當成 2026 課表連結的版本，不推論它和 2025 版差多少。對照 [2025 年的 lecture_5.pdf](https://cs231n.stanford.edu/slides/2025/lecture_5.pdf)，章節順序幾乎一樣，差別是 2025 版多了 Bag of Words 一頁，以及一段「往年投影片」附錄。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=f3g1zGdxptI
title: Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs（YouTube）
```

原始影片：[Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs（YouTube）](https://www.youtube.com/watch?v=f3g1zGdxptI)

課程與錄影入口：

- [Stanford CS231N Spring 2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 從線性分類器的極限講起

投影片第 6–14 頁是回顧。第 9 頁把線性分類器的問題說成兩種觀點：

- **視覺觀點**：每個類別只能學一個模板。
- **幾何觀點**：只能畫出線性的決策邊界。

兩層神經網路解決了表達能力的問題，但第 27 頁指出新問題：輸入 32×32×3 的圖片要先「拉平」成 3072 維的向量才能乘上 W1。**圖片的空間結構就這樣被破壞了。** 相鄰像素和相隔很遠的像素，在向量裡的地位完全一樣。

### 在 CNN 之前：先把圖片變成特徵

第 21–25 頁介紹卷積網路出現之前的做法：不直接把像素餵給線性分類器，而是先抽出一個「特徵表示」，再在特徵上訓練分類器。投影片舉了兩個例子：

- **色彩直方圖**：統計每種顏色出現幾次。
- **HOG（Histogram of Oriented Gradients）**：把圖片切成 8×8 像素的小格，每格把邊緣方向量化成 9 個 bin。一張 320×240 的圖會切成 40×30 格，特徵向量長度是 30 × 40 × 9 = 10,800。

第 25 頁把兩條路線放在一起比。手工特徵的做法，特徵抽取是固定的，只有最後的分類器會被訓練；ConvNet 則是從像素到分數整條一起訓練。這兩種特徵正好是 [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) Q4 Image Features 要你實作的東西，做過 A1 的人會對這頁特別有感。

## 一段歷史：CNN 怎麼來、又被什麼取代

第 28–40 頁是歷史脈絡：

1. **1998 年的 LeNet**（LeCun、Bottou、Bengio、Haffner，〈Gradient-based learning applied to document recognition〉）已經是現在的基本形狀：卷積和池化抽特徵，同時保留 2D 結構，最後接幾層全連接層預測分數，整個網路用 backprop 加梯度下降端到端訓練。
2. **2012 年的 [AlexNet](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)**（Krizhevsky、Sutskever、Hinton）。
3. **約 2012–2020 年**：ConvNet 主導所有視覺任務。投影片列了偵測、分割、影像描述、文字生成圖片。第 37 頁有一句話：「This class used to be focused on ConvNets!」
4. **2021 年起**：Transformer 接手。2017 年先用在語言（〈Attention is all you need〉），2021 年用在視覺（ViT，〈An Image is Worth 16x16 Words〉）。投影片寫「Wait until Lecture 8!」，也就是本系列的 [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)。

這段歷史解釋了為什麼 2026 年的課還要花一整講教卷積：它是理解後面所有架構的共同語言，而且卷積和池化這兩個「影像專用運算子」（第 18 頁的說法）至今仍在很多模型裡。

## 卷積層：一組小濾波器在圖上滑動

### 從全連接到卷積

第 45–46 頁先重畫全連接層：32×32×3 的圖拉成 3072×1，乘上 10×3072 的權重，每個輸出都是 W 的一列和整張圖做 3072 維內積。

卷積層則保留圖片的形狀（第 47 頁）。拿一個 5×5×3 的濾波器，在圖上「空間滑動、逐點算內積」。每一個位置得到一個數字，是濾波器和圖上一塊 5×5×3 區域做 75 維內積再加 bias。有一條規則要記住：**濾波器永遠延伸到輸入的全部深度**（第 49 頁），輸入是 3 個通道，濾波器就是 3 層厚。

5×5 的濾波器滑過 32×32 的圖，得到一張 28×28 的 **activation map**。換 6 個濾波器，就得到 6 張，疊起來是 6×28×28 的輸出，另外還有 6 維的 bias 向量（第 57–58 頁）。也可以換個角度看：輸出是一個 28×28 的網格，每一格是一個 6 維向量。

第 61 頁給出一般形式：

| 張量 | 形狀 |
|---|---|
| 輸入（一個 batch） | N × C_in × H × W |
| 濾波器 | C_out × C_in × K_h × K_w |
| bias | C_out |
| 輸出 | N × C_out × H' × W' |

一個 ConvNet 就是一疊卷積層，中間插激活函數（第 64 頁的例子是 CONV→ReLU 重複，通道數 3→6→10）。

### 濾波器學到什麼

第 65–68 頁把三種模型放在一起比：

- 線性分類器：每個類別一個模板。
- MLP：一組「整張圖」的模板。
- 第一層卷積濾波器：**局部**的影像模板，常常學到有方向的邊緣和對比色。投影片舉 AlexNet 第一層：64 個 3×11×11 的濾波器。
- 更深的卷積層比較難可視化，傾向學到更大的結構，例如眼睛、字母（引用 Springenberg et al., ICLR 2015 的可視化）。

官方筆記用「參數共享」說明這樣做為什麼划算。以 AlexNet 第一層為例，55×55×96 共 290,400 個神經元，如果每個都有自己的 11×11×3 權重加 bias，光第一層就有 105,705,600 個參數。卷積的假設是：一個特徵在某個位置有用，在別的位置也有用，所以同一張 activation map 共用同一組權重。

## 輸出尺寸、padding、stride 與感受野

### 一條公式

第 70–86 頁一步步推：7×7 的輸入、3×3 的濾波器，輸出是 5×5，一般式是 W − K + 1。問題是**每過一層特徵圖就縮小**。解法是在輸入四周補零（padding）。再加上步幅 stride，最後得到：

```
輸出尺寸 = (W − K + 2P) / S + 1
```

常見設定 P = (K − 1) / 2，輸出和輸入一樣大，也就是所謂的「same」padding。

### 練習題：投影片第 87–92 頁

輸入 3×32×32，10 個 5×5 濾波器，stride 1、pad 2：

- **輸出尺寸**：(32 + 2×2 − 5) / 1 + 1 = 32，所以是 10×32×32。
- **可學參數**：每個濾波器 3×5×5 + 1（bias）= 76，10 個共 **760**。
- **乘加運算次數**：輸出有 10×32×32 = 10,240 個元素，每個是兩個 3×5×5 張量的內積（75 次），共 75 × 10,240 = **768,000**。

**怎麼做**：把這三題蓋住答案自己算一次，再把輸入改成 3×64×64、stride 2 重算。能在紙上算對，[A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn) Q3 的卷積層就只剩把公式翻成迴圈。

### 感受野：為什麼需要降採樣

第 79–82 頁引入感受野。kernel 大小 K 的卷積，每個輸出元素依賴輸入上 K×K 的區域；每多疊一層，感受野加 K − 1，疊 L 層就是 1 + L × (K − 1)。投影片特別提醒要分清楚「在輸入上的感受野」和「在前一層上的感受野」。

問題來了：圖片很大時，要疊非常多層，每個輸出才「看得到」整張圖。解法是**在網路內部降採樣**。第一種工具就是 stride：7×7 輸入、3×3 濾波器、stride 2，輸出是 3×3。

### 常用設定

第 93 頁的總結值得抄下來：

- 小的正方形濾波器（K_h = K_w）
- 通道數用 2 的次方：32、64、128、256
- K = 3, P = 1, S = 1：一般的 3×3 卷積
- K = 5, P = 2, S = 1：5×5 卷積
- K = 1, P = 0, S = 1：1×1 卷積
- K = 3, P = 1, S = 2：降採樣一半

第 94–97 頁補充：PyTorch 的卷積層還有 groups 與 dilation 兩個參數，這講沒有展開；除了 2D 卷積，也有 1D（輸入 C_in × W）與 3D（輸入 C_in × H × W × D）卷積。3D 卷積會在 [L10 影片理解](/posts/ai/2026-09-30-cs231n-video-understanding)再出現。

## 池化層：另一種降採樣

第 100–102 頁。池化對每一個 1×H×W 的平面各自降採樣，超參數是 kernel 大小、stride 和池化函數（max 或 average）。最常見的設定是 max、K = 2、S = 2，尺寸剛好減半，例如 64×224×224 變成 64×112×112。

投影片的例子是一個 4×4 平面做 2×2、stride 2 的 max pooling：

```
1 1 2 4
5 6 7 8     →    6 8
3 2 1 0          3 4
1 2 3 4
```

輸出尺寸是 (H − K) / S + 1。池化有兩個特性：**對小幅平移有不變性，而且沒有可學參數。**

## 平移等變性：把兩者串起來

第 103 頁是這講的收束。卷積和池化都滿足：

```
Conv(Translate(X)) = Translate(Conv(X))
```

先平移再卷積，等於先卷積再平移。投影片給的直覺是：**影像的特徵不取決於它在圖上的位置。** 一隻貓出現在左上角或右下角，都該被同一組濾波器認出來。這正是全連接層做不到、卷積層天生具備的性質，也回答了開頭「空間結構怎麼用上」的問題。

最後一頁預告下一講：CNN 架構。

## 這一篇可以確認與不能確認的

可以確認：2026 課表的主題與閱讀、2026 投影片內容、官方筆記裡的參數共享例子、2025 年 L5 錄影的存在與講者（依 2025 課表）。

不能確認：2026 年這一講實際由誰主講（2026 課表的講者欄被註解掉，沒有顯示）、2026 課堂錄影的內容（只在 Canvas）。2025 錄影是另一個學期的講課，投影片細節可能不同，例如 2025 版多了 Bag of Words。

延伸閱讀：站上 [CMU 11-785 的 CNN 第一講](/posts/ai/2026-08-22-cmu-11785-09-cnn-one)從掃描式 MLP 推導卷積，是另一條進路；[CMU 07-280 第 14 講](/posts/ai/2026-08-22-cmu-07280-lecture-14-computer-vision-cnns)是更入門的電腦視覺與 CNN 介紹。

系列導覽：上一篇 [A1 導讀：kNN、Softmax、兩層網路與全連接網路](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)｜下一篇 [L6：訓練 CNN 與經典架構](/posts/ai/2026-09-30-cs231n-training-cnns-architectures)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS231n: Deep Learning for Computer Vision（Spring 2026 課程首頁）](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 5: Image Classification with CNNs 投影片（2026 課表連結版）](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf)
- [Lecture 5 投影片（Spring 2025 版，對照用）](https://cs231n.stanford.edu/slides/2025/lecture_5.pdf)
- [CS231n 官方筆記：Convolutional Neural Networks](https://cs231n.github.io/convolutional-networks/)
- [Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs（YouTube）](https://www.youtube.com/watch?v=f3g1zGdxptI)
- [Stanford CS231N Spring 2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231n Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Krizhevsky, Sutskever, Hinton 2012：ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
- [CS231n Assignment 2（Spring 2026）](https://cs231n.github.io/assignments2026/assignment2/)
