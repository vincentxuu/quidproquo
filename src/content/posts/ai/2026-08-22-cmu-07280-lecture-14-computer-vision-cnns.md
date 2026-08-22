---
title: "CMU 07-280 Lecture 14：CNN 如何把影像的空間結構寫進模型"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, computer-vision, cnn, alexnet]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 14
type: deep-dive
tldr: "Lecture 14 以 local connectivity 與 parameter sharing 取代全連接影像模型，從 convolution、stride、padding、pooling 走到 AlexNet、GPU data parallelism、ResNet skip connection 與 BatchNorm。"
description: "導讀 CMU 07-280 Spring 2026 Lecture 14：卷積輸出尺寸、參數量、CNN、AlexNet、GPU、ResNet 與 BatchNorm。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-14-computer-vision-cnns-en)

第 14 講 **Computer Vision** 日期為 2026 年 3 月 10 日。它把前兩講的 neural network 與 backprop 放進影像：不再把每個 pixel 當成彼此無關的 feature，而是讓同一個小型 kernel 在不同位置重複使用。官方沒有公開逐講錄影，本文只依 lecture note、CNN pre-reading、Recitation 8 與作業材料整理。

## 官方材料與讀取範圍

核心來源是 [Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf)、[CNN pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf)、[Recitation 8 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec8_sol.pdf)、HW7 與 HW8。HW7 仍以單 hidden-layer network 做訓練診斷；HW8 才正式做 AlexNet 與 transfer experiments。

## 承上問題：fully connected network 忽略了影像的什麼

若將 `H×W×C` 影像 flatten，一個 dense layer 對每個輸出都需要獨立連到所有 pixels。它不利用相鄰 pixels 的局部關係，同一個 edge 移到另一個位置也需要另一組權重。CNN 加入兩個 inductive biases：local connectivity 與 parameter sharing。

二維 convolution 用 kernel 在輸入上滑動：

```text
z[i,j] = Σu Σv x[i+u,j+v] w[u,v]
```

多 channel 時再對 input channels 加總；每個 output channel 有自己的一組 kernels 與 bias。

## 完整概念脈絡：shape 與參數要分開算

輸入寬度 `W`、kernel `K`、padding `P`、stride `S` 的輸出寬度是：

```text
W' = floor((W + 2P - K)/S + 1)
```

高度同理。這是 activation map 的 shape，不是參數量。若有 `C_in` 個輸入 channel、`C_out` 個 filters，square kernel 的參數量是：

```text
C_out × (C_in × K × K + 1)
```

它不乘輸出位置數，因為同一個 kernel 在所有位置共享。Pooling 會縮小空間尺寸，卻沒有 weights；ReLU 也沒有 weights。CNN 常用 `Conv→Pool→ReLU` 重複抽取局部 feature，最後 flatten 接 fully connected／softmax。

官方材料再把基本 CNN 接到幾個訓練突破：AlexNet 使用 ReLU、GPU、較深架構、data augmentation 與 dropout；ResNet 用 skip connection 讓 identity path 顯式存在，改善深網路的最佳化；BatchNorm 對 minibatch activation 做 normalization，再學 scale 與 shift，並帶來較穩定梯度等效果。

## 可重做小例子：一層 convolution 的 shape 與參數

給定 RGB 輸入 `3×32×32`，使用 16 個 `5×5` filters、stride 1、padding 2：

```text
W' = (32 + 4 - 5)/1 + 1 = 32
output shape = 16×32×32
parameters = 16×(3×5×5 + 1) = 1,216
```

若誤用 dense connection，16 個 output units 就需 `16×(3×32×32+1)=49,168` 個參數，而且還只產生 16 個數值，不保留空間 feature map。這個比較直接說明 parameter sharing 的價值。

## Recitation／HW 對應

Recitation 8 讓學生計算一個 `3×128×128` 輸入經 pooling、`17×17` convolution、第二次 pooling 與 fully connected layers 的每一步 shape。解答顯示該例大多數參數落在 fully connected 部分，逼學生分清「feature map 很大」和「參數很多」不是同一件事。

HW7 以 learning rate、hidden width、confusion matrix 與 weight visualization 訓練診斷打底。HW8 讓學生從 scratch 訓練 AlexNet，對照資料量不同的 overfitting，並比較 TorchVision AlexNet 與 MobileNet。Notebook 與 autograder 的完整體驗受限，但 written questions 清楚留下實驗判讀要求。

## 延伸對照：CNN 與 ViT

官方 note 把 CNN 與 Vision Transformer 列為兩種主流方法：CNN 以 locality 和 shared kernel 強加空間先驗，有限資料下通常較有效率；ViT 把影像切成 tokens，以 attention 建模較全域的關係，通常需要更多資料與參數。這是教材的概括，不代表所有 dataset 上都有固定勝負。

Lecture 15 會進一步利用已學好的 visual representation。當新任務資料少時，不必從零再學 edges、textures 與 shapes，而是凍結或微調 pretrained backbone。

## 今晚可以做的動作

手算一個 `1×4×4` 輸入與 `2×2` kernel 的 valid convolution，逐格寫出四項乘積。再為 `3×64×64 → Conv(32,3×3,pad=1) → MaxPool(2)` 算 output shapes 與參數。最後刻意把 output positions 乘進參數量，再指出為什麼那是錯的。

## 參考資料

- [CMU 07-280 Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf)
- [Convolutional Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf)
- [Recitation 8 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec8_sol.pdf)
- [HW7 written component](https://www.cs.cmu.edu/~07280/assignments/hw7_blank.pdf)
- [HW8：Building AlexNet](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
