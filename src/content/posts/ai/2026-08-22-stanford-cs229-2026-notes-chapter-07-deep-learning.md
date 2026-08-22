---
title: "深度學習：模組、反向傳播與向量化"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, deep-learning, backpropagation]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 8
tldr: "第七章把神經網路拆成可組合模組，並用反向傳播與向量化說明深度模型如何有效率地訓練。"
description: "Stanford CS229 2026 主講義第七章導讀：MLP、現代神經網路模組、反向傳播、mini-batch SGD 與向量化。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning-en)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 7 章〈Deep learning〉，講義頁碼 80–113。它是 **2026 notes 的逐章導讀**，不是某一學期深度學習錄影的重建。

## 從固定特徵到學習表徵

前幾章的模型多半對參數線性，即使 kernel 隱含的特徵很複雜，特徵映射本身仍由人選定。神經網路把模型改成對輸入與參數都非線性的函數 \(\bar h_\theta(x)\)。回歸直接使用它的輸出；二元與多類別分類則把輸出視為 logits，再接 sigmoid 或 softmax 與對應的負對數概似。

訓練仍然是最佳化平均損失。實務常用 mini-batch SGD：一次抽 \(B\) 筆，平均其梯度，利用硬體並行降低每筆分開運算的成本。這裡的重要延續是：深度學習沒有拋棄前面章節的損失與梯度語言，只是把 \(h_\theta\) 換成更複雜的可微分函數。

## 非線性是深度有效的必要條件

一個全連接層做 \(z=W x+b\)，再逐元素套用 ReLU 等 activation。多層 MLP 反覆組合

\[
a^{[k]}=\sigma(W^{[k]}a^{[k-1]}+b^{[k]}).
\]

若 \(\sigma\) 是 identity，多個線性層仍可合併成一個矩陣，深度不增加表達能力。ReLU、GELU、SiLU/Swish 等非線性阻止這種塌縮；講義也提醒 sigmoid 與 tanh 在極端區域容易梯度消失，因此較少單獨作為現代隱藏層 activation。

將最後一個隱藏層寫成 \(\phi_\beta(x)\)，網路輸出就是 \(W\phi_\beta(x)+b\)。它和第五章的關係很清楚：kernel 方法固定或隱含指定 \(\phi\)，深度學習則連 \(\phi_\beta\) 的參數也一起從資料學習。

## 現代網路是一組可組合模組

本章不只停在 MLP。residual block 把輸入加回兩層轉換結果，簡化為 \(z+W_2\sigma(W_1z)\)；layer normalization 將單一向量的座標標準化後，再用可學習尺度與偏移調整。講義也介紹 RMSNorm，以及以局部連接與參數共享降低成本的一維、二維卷積。

這些模組各有結構性假設：卷積偏好局部和平移共享，正規化改變尺度性質，殘差連接保留直接訊息路徑。它們不是「一定更好」的裝飾，而是對資料與最佳化加入歸納偏置。

## 反向傳播是局部線性映射的反向串接

對由可微分模組組成、輸出為純量的計算圖，反向傳播能以與前向計算同階的時間求梯度。每個模組接收上游梯度，透過局部 backward function 傳回輸入梯度，並同時計算自身參數梯度。

例如矩陣乘法 \(Wz+b\) 的輸入梯度為 \(W^Tv\)，權重梯度為 \(vz^T\)，偏差梯度為 \(v\)。整條鏈從損失的導數 1 開始逆序傳遞。前向的中間 activation 必須保留給 backward 使用，因此效率不只涉及運算，也涉及記憶體。

## 跨樣本向量化

講義數學把樣本排成矩陣的欄，但常見框架把 batch 放在第 0 維，也就是每筆樣本一列。因此紙上的 \(W X+b\) 在實作常變成 \(XW+b\)。bias 透過 broadcasting 複製到每筆樣本。維度慣例若沒先說清楚，是手寫反向傳播最常見的錯誤來源之一。

## 限制與下一章

神經網路具有表達力，不代表一定容易最佳化、能泛化或可解釋。架構、初始化、學習率、batch size 與資料規模都會影響結果；非凸目標也不再享有第一章平方損失的簡單保證。

本章從第二章借用分類損失，從第五章延伸表徵觀點。下一章進入泛化與正規化，正面回答「訓練損失很低，為什麼測試表現仍可能不好」。

## 自學練習

只用矩陣運算實作一個兩層 MLP：ReLU 隱藏層加二元 logistic loss。手寫 forward 與 backward，使用有限差分檢查每個參數梯度，再把逐筆版本改成 batch-first 向量化版本，核對兩者梯度一致。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 7: Deep learning](https://cs229.stanford.edu/main_notes.pdf)
- [PyTorch Autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html)
