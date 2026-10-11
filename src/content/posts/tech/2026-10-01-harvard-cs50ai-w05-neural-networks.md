---
title: "Harvard CS50 AI Week 5：Neural Networks——反向傳播、TensorFlow/Keras、CNN 與交通號誌辨識"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, neural-networks, backpropagation, tensorflow, keras, cnn, traffic, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 6
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 6
tldr: "Week 5 進入神經網路：感知機到多層網路、反向傳播鏈式法則、損失函數、優化器、TensorFlow/Keras 實作、CNN 卷積/池化、專案 Traffic 訓練 CNN 辨識交通號誌。"
description: "詳細導讀 Harvard CS50 AI Week 5 Neural Networks：講課重點、影片時間軸、神經網路前向/反向傳播數學、TensorFlow/Keras Sequential/Model API、CNN 架構（卷積、池化、Dropout、BatchNorm）、Traffic 專案完整訓練流程與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，Week 5 講課錄影在清單中。

```youtube
url: https://www.youtube.com/watch?v=J1QD9hLDEDY
title: Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020
```

原始影片：[Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=J1QD9hLDEDY)

課程與錄影入口：

- [CS50 AI Week 5 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/5/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：原表的順序（神經網路基礎→訓練→TensorFlow→CNN）大致成立，但原表有多項字幕中找不到的內容：損失函數 MSE／Cross-Entropy 的獨立章節（Softmax 只有一句）、優化器 SGD／Momentum／Adam、Functional API、Batch Normalization、Data Augmentation、Early Stopping、通用近似定理、鏈式法則推導，以及 Traffic 專案介紹，皆已移除；影片末段約第 85 分鐘起其實是遞迴神經網路（RNN），原表漏掉，已補上。字幕全程未提到 Traffic 專案，專案說明來自課程官網。原精確時間碼（影片實長 1:41:20）無法驗證，改為依字幕估算的「約」值。

## TL;DR

Week 5 進入深度學習：從感知機到多層神經網路、反向傳播鏈式法則計算梯度、損失函數與優化器、TensorFlow/Keras 建模、CNN 卷積池化結構。專案 Traffic 訓練 CNN 分類交通號誌圖片。

## 課程影片與時間軸

YouTube：[Week 5 Neural Networks (2020 錄製)](https://www.youtube.com/watch?v=J1QD9hLDEDY)

> 時間說明：影片總長 1:41:20。YouTube 字幕沒有時間碼，下表時間是依各主題在字幕全文中的相對位置換算的「約略值」（可能差數分鐘），只供定位，不是官方章節。此表只描述這支 2020 年的錄影；課程目前版本的講課內容與順序可能不同，且影片本身沒有介紹本週專案。

| 約略時間（分鐘） | 內容 |
|---|---|
| 約 0–16 | 神經網路基礎：單元、權重、bias、activation function（step、sigmoid、ReLU）、以邏輯閘為例 |
| 約 16–30 | 梯度下降：loss 最小化、stochastic／mini-batch、多輸入多輸出與線性模型的限制 |
| 約 30–39 | 隱藏層與多層網路、反向傳播（概念層級）、deep learning、overfitting 與 dropout |
| 約 39–53 | TensorFlow／Keras：Sequential 模型、compile、epochs 與實作 |
| 約 53–73 | 電腦視覺與卷積神經網路：影像像素、convolution 與 filter、pooling |
| 約 73–85 | Keras 實作 CNN：MNIST 手寫數字辨識 |
| 約 85–101 | feed-forward 網路的限制與遞迴神經網路（RNN）：序列資料、CaptionBot，以及收尾 |

> 完整逐字稿：[Week 5 Notes](https://cs50.harvard.edu/ai/2020/notes/5/)

## 核心概念速覽

### 反向傳播數學核心

**前向傳播**（單層）：
```
z = W·x + b
a = σ(z)  # σ 為啟用函數
```

**反向傳播鏈式法則**：
```
∂L/∂W = ∂L/∂a · ∂a/∂z · ∂z/∂W
       = δ       · σ'(z)   · xᵀ
```
其中 `δ = ∂L/∂z` 為「誤差項」，逐層向後傳遞：
```
δᴸ = ∇ₐL ⊙ σ'(zᴸ)                          # 輸出層
δˡ = ((Wˡ⁺¹)ᵀ δˡ⁺¹) ⊙ σ'(zˡ)               # 隱藏層
```

### 常用啟用函數與導數

| 函數 | 公式 | 導數 | 適用位置 |
|---|---|---|---|
| ReLU | max(0, z) | 1 if z>0 else 0 | 隱藏層（預設） |
| Leaky ReLU | max(0.01z, z) | 0.01 if z<0 else 1 | 緩解 dying ReLU |
| Sigmoid | 1/(1+e⁻ᶻ) | σ(z)(1-σ(z)) | 二分類輸出層 |
| Tanh | (eᶻ-e⁻ᶻ)/(eᶻ+e⁻ᶻ) | 1-tanh²(z) | 隱藏層（較舊） |
| Softmax | eᶻᵢ/Σeᶻⱼ | 雅可比矩陣 | 多類別輸出層 |

### 損失函數選擇

| 任務 | 輸出層 | 損失函數 |
|---|---|---|
| 回歸 | Linear (1 neuron) | MSE = ½(y-ŷ)² |
| 二分類 | Sigmoid (1 neuron) | Binary Cross-Entropy = -[y log ŷ + (1-y) log(1-ŷ)] |
| 多類別 | Softmax (C neurons) | Categorical Cross-Entropy = -Σ yᵢ log ŷᵢ |

### TensorFlow/Keras 基礎 API

```python
# 基礎 Sequential 模型
import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    x_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=3)]
)

test_loss, test_acc = model.evaluate(x_test, y_test)
```

### CNN 核心層

```python
# CNN 架構範例（Traffic 專案風格）
model = models.Sequential([
    # 輸入：30x30x3 彩色圖片
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(30, 30, 3)),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(43, activation='softmax')  # GTSRB 43 類別
])
```

**關鍵參數**：
- `Conv2D(filters, kernel_size, strides, padding)`：filters=輸出通道數、kernel_size=卷積核大小
- `MaxPooling2D(pool_size, strides)`：下採樣、減少參數、平移不變性
- `Flatten()`：將 3D feature map 攤平為 1D 向量接 Dense

---

## 專案 5：Traffic —— CNN 訓練分類交通號誌

### 任務

使用 German Traffic Sign Recognition Benchmark (GTSRB) 子集，訓練 CNN 模型分類 43 類交通號誌。輸入圖片 30×30×3，輸出 43 類機率分佈。

### 資料集結構

```
gtsrb/
├── train/
│   ├── 0/     # 類別 0 圖片
│   ├── 1/
│   └── ... 42/
└── test/      # 測試集同結構
```

### Distribution Code 重點

```python
# traffic.py 提供的資料載入函數
def load_data(data_dir):
    """回傳 (images, labels)；images: list of 30x30x3 numpy arrays, labels: list of int"""
    images = []
    labels = []
    for label in range(43):
        dir_path = os.path.join(data_dir, str(label))
        for file in os.listdir(dir_path):
            img = cv2.imread(os.path.join(dir_path, file))
            img = cv2.resize(img, (30, 30))
            images.append(img)
            labels.append(label)
    return np.array(images), np.array(labels)
```

### 完整參考實作

```python
# traffic.py 完整實作
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
import sys

def load_data(data_dir):
    images = []
    labels = []
    for label in range(43):
        dir_path = os.path.join(data_dir, str(label))
        for file in os.listdir(dir_path):
            img = cv2.imread(os.path.join(dir_path, file))
            if img is None:
                continue
            img = cv2.resize(img, (30, 30))
            images.append(img)
            labels.append(label)
    return np.array(images, dtype=np.float32), np.array(labels)

def get_model():
    model = models.Sequential([
        # 第一卷積區塊
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(30, 30, 3)),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # 第二卷積區塊
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # 第三卷積區塊
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # 全連接分類頭
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(43, activation='softmax')
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python traffic.py data_dir")
    
    data_dir = sys.argv[1]
    images, labels = load_data(data_dir)
    
    # 正規化到 [0,1]
    images = images / 255.0
    
    # 切分訓練/驗證
    x_train, x_test, y_train, y_test = train_test_split(
        images, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    model = get_model()
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(patience=3, factor=0.5)
    ]
    
    history = model.fit(
        x_train, y_train,
        epochs=20,
        batch_size=32,
        validation_data=(x_test, y_test),
        callbacks=callbacks,
        verbose=1
    )
    
    test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
    print(f"Test accuracy: {test_acc:.4f}")
    
    # 儲存模型供 check50 使用
    model.save("traffic_model.h5")

if __name__ == "__main__":
    main()
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/5/traffic.zip
unzip traffic.zip && cd traffic

# 下載 GTSRB 資料集（官方 spec 有連結）
# 解壓縮到 gtsrb/ 目錄

python traffic.py gtsrb
# 訓練過程輸出 loss/accuracy，最終輸出 Test accuracy

# check50 會載入 traffic_model.h5 在隱藏測試集評分
check50 ai50/projects/2024/x/traffic

style50 traffic.py
```

> **注意**：Traffic 專案單一專案（非 A/B），訓練時間較長（視 GPU/CPU 而定）。`check50` 會使用預訓練模型在隱藏測試集評分，需確保模型架構與儲存格式符合規格。

---

## 學習檢核清單

- [ ] 能手寫單層神經網路的前向/反向傳播公式（含鏈式法則）
- [ ] 能說明 ReLU、Sigmoid、Softmax 各自適用位置與導數形式
- [ ] 理解 MSE、Binary CE、Categorical CE 分別對應何種任務
- [ ] 能用 Keras Sequential 搭建 MLP 與 CNN 模型
- [ ] 理解 CNN 中 `Conv2D` 的 `filters`、`kernel_size`、`padding`、`strides` 參數效果
- [ ] 理解 BatchNormalization、Dropout、Data Augmentation 的正則化機制
- [ ] Traffic 專案 `check50` 全綠（測試集準確率達標）

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。移除影片中找不到的主題與專案介紹，補上 RNN 段，時間碼改為約略值。

## 參考資料

- [Week 5 Neural Networks 講課頁](https://cs50.harvard.edu/ai/weeks/5/) — 影片、投影片、逐字稿、Quiz
- [Week 5 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/5/) — 本文內容主要來源
- [Traffic 專案規格](https://cs50.harvard.edu/ai/projects/5/traffic/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/traffic`
- [TensorFlow/Keras 官方文件](https://www.tensorflow.org/api_docs/python/tf/keras)
- [GTSRB 資料集說明](http://benchmark.ini.rub.de/?section=gtsrb&subsection=dataset)
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義