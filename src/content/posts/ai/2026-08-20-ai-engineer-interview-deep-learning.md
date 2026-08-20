---
title: "Deep Learning 面試攻略：從 CNN 到 Transformer 的核心直覺"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, deep-learning, transformer]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中深度學習環節的高頻考點——CNN、RNN、Transformer、attention mechanism、training tricks。"
tldr: "深度學習面試重點不是推導反向傳播，而是能不能解釋架構背後的設計直覺。高頻考點：CNN 的 locality 與 translation invariance、RNN 到 Transformer 的演進為什麼必要、self-attention 的計算邏輯與複雜度、BatchNorm vs LayerNorm 的適用場景、常見的 training tricks（learning rate schedule、gradient clipping、mixed precision）。"
series:
  name: "AI Engineer 面試準備"
  order: 3
---

深度學習的面試考法在 2025 之後有一個明顯的轉向：面試官越來越少要你手推反向傳播或寫出 LSTM 的 gate 公式，越來越多要你解釋「為什麼這樣設計」和「什麼情況下會壞掉」。這篇整理的不是教科書知識，而是面試時需要的那種設計直覺。

## CNN：局部性與平移不變性

卷積神經網路的核心假設是**局部性**（locality）——相鄰像素之間的關係比遠處像素重要。一個 3×3 的 kernel 只看局部區域，這讓參數量遠小於全連接層。

面試時最常被問的直覺問題是：「為什麼 CNN 對圖像有效？」好的回答要點出兩件事。第一，局部性——圖像中的有意義 pattern（邊緣、紋理、物體部件）通常是局部的。第二，**平移不變性**（translation invariance）——同一個 kernel 在整張圖上滑動，不管物體出現在哪個位置，都能被偵測到。

**Pooling** 的作用不只是降維。Max pooling 提取局部區域中最強的信號，提供對微小位移的容忍度。但 pooling 也丟失了精確的空間位置資訊，這就是為什麼語義分割任務（需要像素級定位）後來改用 dilated convolution 或 encoder-decoder 架構取代 pooling。

架構演進的脈絡：LeNet → AlexNet（深度 + ReLU + Dropout）→ VGGNet（統一 3×3 kernel）→ GoogLeNet/Inception（多尺度平行卷積）→ ResNet（skip connection 解決深度退化）→ EfficientNet（compound scaling）。面試不需要背每個架構的細節，但要能說出 **ResNet 的 skip connection 為什麼有效**——它讓梯度可以直接回傳到淺層，解決了深層網路的退化問題（注意：是退化不是過擬合，深層網路的訓練 loss 比淺層高）。

## RNN 與 LSTM：序列建模的第一代方案

RNN 的設計動機很直接：輸入是序列，每一步的隱藏狀態同時依賴當前輸入和上一步的狀態，形成一條時間軸上的資訊鏈。問題在於這條鏈太長時會出事。

**梯度消失**：反向傳播沿時間軸展開時，梯度要連乘很多個權重矩陣。如果矩陣的譜半徑小於 1，梯度指數衰減，早期輸入對損失幾乎沒有影響。**梯度爆炸**則是相反——譜半徑大於 1，梯度指數增長。梯度爆炸可以用 gradient clipping 粗暴解決，梯度消失則需要架構層面的改動。

LSTM 的解法是引入三個 **gate**（forget、input、output）和一條 **cell state** 通道。cell state 的更新是加法（不是乘法），讓梯度可以沿著 cell state 長距離流動而不衰減。面試追問「為什麼 gate 要用 sigmoid？」——因為 sigmoid 輸出在 0-1 之間，正好對應「完全遺忘」到「完全保留」的連續控制。

GRU 是 LSTM 的簡化版——把 forget gate 和 input gate 合併成 update gate，少一個 gate 意味著更少的參數。面試時被問到「LSTM 和 GRU 怎麼選」，實務上的答案是：大多數情況下差異不大，GRU 訓練稍快，LSTM 在極長序列上略有優勢，但這些差異通常小於超參數調整的影響。

## Transformer：為什麼它取代了 RNN

2017 年 "Attention Is All You Need" 提出 Transformer 的核心動機是解決 RNN 的兩個問題：**無法平行化**（每一步依賴上一步，無法在序列維度上平行計算）和**長距離依賴**（即使有 LSTM，超長序列的資訊傳遞仍然不夠好）。

**Self-attention 的計算流程**，用面試時能直接講的方式說：

1. 每個 token 透過三個線性投影得到 Query、Key、Value 三個向量
2. Query 和所有 Key 做 dot product，得到 attention score（衡量「這個 token 該多關注其他哪些 token」）
3. Score 除以 √d_k（key 的維度的平方根）做 scaling，避免 dot product 值太大導致 softmax 飽和
4. 過 softmax 得到權重，對 Value 做加權求和

**Multi-head attention** 是把 Q、K、V 拆成多組（多個 head），每個 head 關注不同的子空間，最後 concat 起來。面試時被問「為什麼要多頭？」——一個 head 只能學一種 attention pattern，多頭讓模型同時捕捉不同類型的依賴關係（語法、語義、位置等）。

**位置編碼**（positional encoding）是因為 self-attention 本身是排列不變的（permutation invariant）——它只看 token 之間的兩兩關係，不知道誰在前誰在後。原始 Transformer 用固定的正弦/餘弦函數，後來的模型大多改用可學習的位置編碼或 RoPE（rotary position embedding）。面試加分點：能提到 RoPE 讓相對位置資訊直接編碼在 attention 計算裡，比絕對位置編碼更好地泛化到不同長度的序列。

Self-attention 的**計算複雜度是 O(n²d)**，其中 n 是序列長度、d 是維度。這就是為什麼長序列（超過幾萬 token）需要特殊處理——FlashAttention 透過分塊計算減少記憶體存取，不改變複雜度但大幅提升實際速度。

## Normalization：BatchNorm vs LayerNorm vs RMSNorm

**BatchNorm** 在 batch 維度上標準化——計算同一個 batch 裡所有樣本在同一個特徵上的均值和方差。問題：batch size 太小時統計量不穩定；推理時需要用訓練時累積的 running statistics，有 train/eval 行為不一致的風險。

**LayerNorm** 在 feature 維度上標準化——計算單一樣本的所有特徵的均值和方差。不依賴 batch size，所以在 Transformer（batch size 可能很小或動態變化）中成為標配。

**RMSNorm** 是 LayerNorm 的簡化版——只用 RMS（root mean square）做 scaling，省掉均值計算。LLaMA 用 RMSNorm，實務上效果和 LayerNorm 相當但計算更快。

面試必考追問：「你什麼時候會選 BatchNorm？什麼時候選 LayerNorm？」——CNN + 大 batch → BatchNorm；Transformer 或 RNN → LayerNorm；大語言模型追求效率 → RMSNorm。

## Training Tricks

面試官問「你訓練模型時會用哪些技巧」時，不要列一堆名詞。挑 3-4 個你真的用過的，說清楚為什麼用和什麼時候不該用。

**Learning rate schedule**：warmup + cosine decay 是最常見的組合。Warmup 讓模型在初期用小學習率穩定更新方向，避免大學習率在隨機初始化時把參數推到不好的區域。Cosine decay 比 step decay 平滑，通常收斂更穩定。

**Gradient clipping**：設定梯度的最大範數（通常 1.0），超過就等比縮放。主要防梯度爆炸，幾乎是訓練 RNN 和大型 Transformer 的必備。

**Mixed precision training**：用 FP16 做 forward 和 backward 加速計算，但用 FP32 的 master weights 做參數更新保持精度。配合 loss scaling 防止 FP16 下溢。PyTorch 的 `torch.amp` 讓這件事幾乎自動化。

**Data augmentation**：CV 領域的 random crop、flip、color jitter 幾乎是免費午餐。NLP 領域的 augmentation 比較微妙——back-translation、token dropout、synonym replacement 效果因任務而異，不能無腦套用。

## 面試常見追問與回答策略

| 追問 | 回答方向 |
|------|---------|
| 「為什麼不用更深的網路？」 | 深度和性能不是線性關係，過深會有退化和過擬合，要搭配 skip connection 和正則化 |
| 「Transformer 能不能用在圖像？」 | 可以（ViT），但需要把圖切成 patch 當 token，小數據集上不如 CNN |
| 「你怎麼決定模型大小？」 | 先用小模型驗證 pipeline，再根據驗證集的 bias-variance 分析決定要加深還是加寬 |
| 「Attention 的瓶頸在哪？」 | O(n²) 記憶體和計算量，長序列需要 FlashAttention 或稀疏 attention |

回答技術追問時，避免只給結論。面試官想聽的是你的思考過程：先說你會考慮哪些 trade-off，再給你的判斷，最後補一句你在什麼情況下會改變這個判斷。

## 接下來

下一篇進入 NLP & LLM——從 tokenization、fine-tuning 到 RLHF 和 LLM evaluation，整理面試中大語言模型相關問題的答題框架。

## 參考資料

- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762) — Transformer 架構原始論文，self-attention 計算流程與 multi-head attention 的設計依據
- [Deep Residual Learning for Image Recognition (He et al., 2016)](https://arxiv.org/abs/1512.03385) — ResNet 與 skip connection，解釋深層網路退化問題的根源與解法
- [FlashAttention: Fast and Memory-Efficient Exact Attention (Dao et al., 2022)](https://arxiv.org/abs/2205.14135) — 透過分塊計算和 IO 感知設計降低 attention 的實際記憶體與計算開銷
