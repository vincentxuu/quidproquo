---
title: "MIT 6.7960 L05：CNN 架構全解析——從卷積核到平移等變性的感知機制"
date: 2026-10-01
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, cnn, convolution, translation-equivariance, pooling]
lang: zh-TW
series:
  name: "MIT 6.7960 Fall 2024 OCW 導讀"
  order: 7
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 14
tldr: "Lec 4 核心重點：為什麼 CNN 是處理網格資料的最佳選擇——卷積、平移等變性、池化與經典架構一次掌握"
description: "MIT 6.7960 Fall 2024 OCW 第 4 講：Architectures: Grids。深入解析 CNN 為何適合影像資料，涵蓋卷積運算、平移等變性、池化層、感受野、經典架構演進，並附可直接執行的 PyTorch 實作範例。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-01-mit-67960-cnn-architectures-en)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) 第 4 講 [Architectures: Grids](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec04_mp4/)（YouTube: `bxVkZ4M-hIE`）由 Phillip Isola 授課。這講從「為什麼 MLP 不適合影像」切入，推導出 CNN 的三大設計原則：**局部連接**、**權重共享**、**平移等變性**。配合 [Vision Book Ch.24](https://visionbook.mit.edu/convolutional_neural_nets.html) 必讀，這篇文章把講義重點重組成可直接套用的 CNN 設計框架，並附上可跑的 PyTorch 程式碼。

## 為什麼 MLP 處理不好影像

| 問題 | MLP 表現 | CNN 解法 |
|---|---|---|
| **參數爆炸** | 1000×1000 圖輸入 1M 參數，全連接層參數量平方級增長 | 卷積核 3×3×C_in×C_out，參數與輸入尺寸無關 |
| **空間結構丟失** | `flatten()` 把 2D 變 1D，鄰域關係被打散 | 卷積保留 2D 拓樸，鄰域像素共同決定輸出 |
| **平移不等變** | 圖片平移幾像素，MLP 輸出完全不同 | **平移等變性**：輸入平移 → 特徵圖同步平移 |

**關鍵洞見**：Isola 在講義中強調，CNN 不是「發明」出來的技巧，而是**針對網格資料的數學必然**——當資料具備平移對稱性時，權重共享是唯一滿足等變性的線性算子（參考群表示論）。

## 卷積運算：核心數學機制

### 離散卷積定義

對輸入 `x ∈ ℝ^(H×W×C_in)`、卷積核 `w ∈ ℝ^(k×k×C_in×C_out)`：

```
y[i, j, c_out] = Σ_u Σ_v Σ_c_in  x[i+u, j+v, c_in] × w[u, v, c_in, c_out] + b[c_out]
```

其中 `u, v ∈ [-k//2, k//2]`（以中心為原點）。

### 關鍵超參數對照表

| 參數 | 符號 | 典型值 | 對輸出尺寸影響 |
|---|---|---|---|
| **核大小** | k | 3, 5, 7 | 較大核 = 較大感受野 |
| **步幅** | s | 1, 2 | `H_out = ⌊(H_in + 2p - k)/s⌋ + 1` |
| **填充** | p | 0, 1, k//2 | `p=k//2` 時 `H_out = H_in` (same padding) |
| **擴張** | d | 1, 2 | `k_eff = k + (k-1)(d-1)`，空洞卷積 |

### PyTorch 卷積尺寸計算器

```python
"""卷積輸出尺寸計算與驗證"""
import torch
import torch.nn as nn

def conv_output_size(H_in, k=3, s=1, p=1, d=1):
    """計算輸出高/寬"""
    return (H_in + 2*p - d*(k-1) - 1) // s + 1

# 常見配置驗證
configs = [
    (224, 3, 1, 1, 1),  # ResNet stem: 224→224
    (224, 7, 2, 3, 1),  # ResNet stem: 224→112
    (32, 3, 1, 1, 1),   # CIFAR: 32→32
    (32, 3, 2, 1, 1),   # 下採樣: 32→16
]
for H, k, s, p, d in configs:
    print(f"H_in={H}, k={k}, s={s}, p={p}, d={d} → H_out={conv_output_size(H,k,s,p,d)}")

# 實際跑一次驗證
x = torch.randn(1, 3, 224, 224)
conv = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
print(f"實際輸出: {conv(x).shape}")  # torch.Size([1, 64, 112, 112])
```

## 平移等變性：CNN 的數學基石

### 定義

設平移算子 `T_Δ` 將輸入向右下平移 `Δ=(Δ_h, Δ_w)`。CNN 層 `f` 滿足**平移等變性**當且僅當：

```
f(T_Δ x) = T_Δ f(x)
```

即：**先平移再卷積 = 先卷積再平移**。

### 為什麼全連接層不滿足

MLP 權重矩陣 `W ∈ ℝ^(HW×C_out)` 每個輸入位置有獨立權重，平移輸入會導致完全不同的加權和。

### 為什麼卷積滿足

卷積核 `w` 在空間維度共享權重，平移輸入只是改變求和索引，核本身不變。

```python
"""驗證平移等變性"""
import torch
import torch.nn.functional as F

def translate(x, dh, dw):
    """循環平移（演示用）"""
    return torch.roll(x, shifts=(dh, dw), dims=(-2, -1))

torch.manual_seed(42)
x = torch.randn(1, 3, 32, 32)
conv = nn.Conv2d(3, 16, 3, padding=1, bias=False)

# 先平移再卷積
x_translated = translate(x, 2, 3)
out1 = conv(x_translated)

# 先卷積再平移
out2 = translate(conv(x), 2, 3)

print(f"平移等變性誤差: {(out1 - out2).abs().max().item():.2e}")  # ~1e-7 (數值誤差)
```

## 池化：下採樣與不變性

| 池化類型 | 公式 | 特性 | 現代用法 |
|---|---|---|---|
| **MaxPool** | `max(x[i:i+k, j:j+k])` | 保留最強啟動、平移不變性強 | ResNet、VGG 下採樣 |
| **AvgPool** | `mean(x[i:i+k, j:j+k])` | 平滑、保留背景資訊 | GlobalAvgPool 替代 FC |
| **Strided Conv** | `conv(s=2)` | 可學習下採樣、參數效率高 | 現代架構首選 (ResNet-D, ConvNeXt) |

**關鍵觀念**：MaxPool 提供**局部平移不變性**——小幅平移不改變最大值位置。但過度池化會丟失空間精度，現代架構傾向 **strided conv + 少量池化**。

## 感受野：理論 vs 實際

### 理論感受野 (Theoretical RF)

```
RF_0 = 1
RF_l = RF_{l-1} + (k_l - 1) × ∏_{i<l} s_i
```

### 有效感受野 (Effective RF)

實際上梯度集中在中心，呈現高斯分佈。Luo et al. (2016) 指出：**有效感受野遠小於理論值**，且隨深度呈指數增長。

```python
"""計算理論感受野"""
def receptive_field(layers):
    """layers: list of (k, s) tuples"""
    rf = 1
    stride_prod = 1
    for k, s in layers:
        rf = rf + (k - 1) * stride_prod
        stride_prod *= s
    return rf

# ResNet-50 前幾層
resnet_stem = [(7, 2), (3, 2)]  # conv1 7×7 s2, maxpool 3×3 s2
resnet_layer1 = [(3, 1)] * 3    # 3×3 s1 × 3
resnet_layer2 = [(3, 2)] + [(3, 1)] * 3  # 下採樣 + 3×3 s1 × 3

print(f"Stem RF: {receptive_field(resnet_stem)}")           # 11
print(f"Layer1 RF: {receptive_field(resnet_stem + resnet_layer1)}")  # 35
print(f"Layer2 RF: {receptive_field(resnet_stem + resnet_layer1 + resnet_layer2)}")  # 99
```

## 經典架構演進：從 LeNet 到 VGG

| 架構 | 年份 | 關鍵創新 | 參數量 | Top-1 Acc (ImageNet) |
|---|---|---|---|---|
| **LeNet-5** | 1998 | 卷積+池化+FC、數位辨識 | 60K | N/A |
| **AlexNet** | 2012 | ReLU、Dropout、GPU 訓練、LRN | 60M | 57.1% |
| **VGG-16/19** | 2014 | 全 3×3 卷積、深度堆疊、同樣配置 | 138M | 71.5% |
| **GoogLeNet** | 2014 | Inception 模組、1×1 降維、GlobalAvgPool | 6.8M | 69.8% |

**VGG 的核心洞見**：兩層 3×3 卷積 = 一層 5×5 卷積（感受野相同），但參數更少（2×3²C² vs 5²C²）、非線性更多。這奠定了「小核深層」的現代範式。

## PyTorch 完整可跑範例：從零建構 CNN

```python
"""完整 CNN 實作：含卷積、BN、ReLU、池化、GlobalAvgPool、分類頭"""
import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvBlock(nn.Module):
    """標準卷積塊：Conv → BN → ReLU"""
    def __init__(self, in_ch, out_ch, kernel=3, stride=1, padding=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel, stride, padding, bias=False)
        self.bn = nn.BatchNorm2d(out_ch)
    
    def forward(self, x):
        return F.relu(self.bn(self.conv(x)))

class SimpleCNN(nn.Module):
    """CIFAR-10 級別的簡易 CNN"""
    def __init__(self, num_classes=10):
        super().__init__()
        self.stem = nn.Sequential(
            ConvBlock(3, 32),           # 32×32
            ConvBlock(32, 64),          # 32×32
            nn.MaxPool2d(2),            # 16×16
            ConvBlock(64, 128),         # 16×16
            ConvBlock(128, 128),        # 16×16
            nn.MaxPool2d(2),            # 8×8
            ConvBlock(128, 256),        # 8×8
            ConvBlock(256, 256),        # 8×8
            nn.AdaptiveAvgPool2d(1),    # 1×1 (GlobalAvgPool)
        )
        self.head = nn.Linear(256, num_classes)
    
    def forward(self, x):
        x = self.stem(x)
        x = x.view(x.size(0), -1)
        return self.head(x)

# 驗證
model = SimpleCNN()
x = torch.randn(2, 3, 32, 32)
out = model(x)
print(f"輸出形狀: {out.shape}")  # torch.Size([2, 10])
print(f"參數量: {sum(p.numel() for p in model.parameters())/1e6:.2f}M")

# 計算感受野
def compute_rf(model, input_size=32):
    x = torch.randn(1, 3, input_size, input_size, requires_grad=True)
    out = model(x)
    # 取第一個輸出神經元的梯度
    out[0, 0].backward()
    grad_map = x.grad.abs().sum(dim=1).squeeze()  # [H, W]
    rf_pixels = (grad_map > grad_map.max() * 0.01).sum().item()
    return rf_pixels

print(f"經驗感受野像素數: {compute_rf(model)}")
```

## 常見坑與避雷指南

| 症狀 | 可能原因 | 修正 |
|---|---|---|
| 輸出尺寸不符預期 | padding/stride 算錯 | 用 `conv_output_size()` 驗證、或 `nn.LazyConv2d` 自動推斷 |
| 訓練不收斂、loss 震盪 | 學習率太大、無 BN | 加 `BatchNorm2d`、lr 降 10 倍、用 `AdamW` |
| 記憶體爆炸 (OOM) | 批次太大、特徵圖太大 | 減小 batch size、用 `grad_checkpoint`、改 strided conv 替代池化 |
| 驗證集準確率卡住 | 模型容量不足、正則化太強 | 加寬通道數、減少 dropout、檢查 data augmentation |
| 推論速度慢 | 卷積核大、分組卷積未用 | 改 depthwise separable conv、用 `torch.compile()`、ONNX 導出 |

## 影片時間戳

- 0:00–12:00 MLP 對影像的失敗模式、參數爆炸問題
- 12:00–28:00 卷積運算推導、權重共享、平移等變性證明
- 28:00–40:00 池化層、感受野計算、空洞卷積
- 40:00–55:00 經典架構演進：LeNet → AlexNet → VGG → GoogLeNet
- 55:00–1:10:00 現代 CNN 設計原則、實作細節

## 參考資料

- [MIT 6.7960 Fall 2024 Lec 04: Architectures: Grids](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec04_mp4/) — 官方影片（YouTube: `bxVkZ4M-hIE`）
- [Lecture 4 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec4_pdf/) — Isola 講義投影片
- [Foundations of Computer Vision, Ch.24: Convolutional Neural Nets](https://visionbook.mit.edu/convolutional_neural_nets.html) — 必讀教科書章節
- [Understanding the Effective Receptive Field in Deep CNNs (Luo et al., 2016)](https://arxiv.org/abs/1701.04128) — 有效感受野分析
- [Very Deep Convolutional Networks (VGG, arXiv:1409.1556)](https://arxiv.org/abs/1409.1556) — Simonyan & Zisserman
- [Going Deeper with Convolutions (GoogLeNet, arXiv:1409.4842)](https://arxiv.org/abs/1409.4842) — Szegedy et al.
- [PyTorch Conv2d 官方文件](https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html) — API 參考
- 站內：[MIT 6.7960 L04：正則化實戰](/posts/tech/2026-09-17-mit-67960-regularization) — BN、Dropout 等正則化細節