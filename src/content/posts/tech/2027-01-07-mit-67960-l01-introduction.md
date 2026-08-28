---
title: "MIT 6.7960 L01：課程導論 —— Deep Learning 的地圖、為什麼深，以及第一個訓練 loop"
date: 2027-01-07
category: tech
tags:
  - mit-67960
  - deep-learning
  - course-overview
  - introduction
  - pytorch
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 1 講：deep learning 為什麼在 2010 年代後大爆發、本課要解決什麼（架構、訓練、生成、遷移、規模、LLM）、課程資源怎麼用，以及用 PyTorch 寫第一個 training loop 確認環境通了。"
tldr: "本講是 6.7960 的導論：deep learning 之所以爆發是『資料 + 算力 + 演算法』三股力量同時到位；本課從架構（CNN/GNN/Transformer）到訓練、表示、生成、遷移、規模、LLM 一路串起來；最後用一個 ~30 行的 PyTorch training loop 確認你的環境能跑。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 1
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 28
---

> 🌏 [English version](/posts/tech/2027-01-07-mit-67960-l01-introduction-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 01）。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講為課程總覽，由授課教師群輪流介紹。

---

## 一、deep learning 為什麼在 2010 年代後爆發

LeCun、Bengio、Hinton 2015 在 *Nature* 的綜述把這件事講得很清楚：**三股力量同時到位**。

1. **資料** — ImageNet（2009）把「100 萬張標註影像」變成公共資源；web-crawl 文本在 2010 年代中後達到 TB 等級；YouTube、Wikipedia 變成現成的無標籤語料。
2. **算力** — NVIDIA CUDA（2007）讓 GPU 變通用；2012 AlexNet 用兩顆 GTX 580 訓練幾天，現在一顆 H100 一晚能訓出那時做夢才有的模型。
3. **演算法** — ReLU 解決了深網梯度消失、BatchNorm 讓深網能穩定訓練、ResNet（2015）讓「加深」真的有效、Attention/Transformer（2017）讓序列模型跳了一個世代。

任何一股單獨都不夠。三股同時到位，deep learning 才從實驗室走進工業界。

## 二、本課地圖

6.7960 從「為什麼深」（L03）出發，依序串起：

- **架構**：CNN / GNN（L05）/ Transformer（L08）— 為不同結構的資料設計網路。
- **訓練**：SGD / Adam / 正則化 / 歸納偏置（L13 理論）。
- **表示學習**：reconstruction / contrastive / theory（L11–L13）。
- **生成模型**：likelihood、GAN、VAE（L14–L16）、擴散與 text-to-image。
- **遷移與泛化**：OOD（L17）、遷移學習（L18–L19）。
- **規模**：scaling laws（L20）→ LLM（L21）。
- **部署**：幾何深度學習（L23）、推論優化（L24）。

第 1 講是唯一一講「不講數學、不講架構」，就告訴你這條主線是什麼。

## 三、為什麼「深」

後面會用一整講（L03 近似理論）嚴格證明：**深度對組合式函數帶來指數級的寬度節省**。這裡先給直觀：很多函數（例如「判斷一張圖裡有沒有貓」）天生是階層的（邊 → 紋理 → 部件 → 物件），深網的階層表示剛好對上；淺網就算寬到爆，也學不來。

這也是為什麼「加深」這條主線在後面會反覆出現。

## 四、課程資源怎麼用

- **OCW**：所有 lecture 影片、投影片、3 個 problem set（PS1–PS3）都公開，免註冊。Fall 2024 是首個完整 OCW 版本。
- **推薦閱讀**：
  - Goodfellow、Bengio、Courville *Deep Learning*（免費線上版）— 教科書級的「地圖」。
  - Murphy *Probabilistic Machine Learning* — 機率視角的深度學習。
  - Bernstein 的 *Deep Learning Theory Notes*（OCW readings 頁）— 偏理論，但寫得清楚。
- **作業**：PS1 手寫 MLP backprop、PS2 實作 CNN、PS3 sequence/attention。作業不計分但強烈建議做。

## 五、第一個 training loop

不管你熟不熟 PyTorch，這 30 行是「環境通了」的最小測試：

```python
import torch, torch.nn as nn, torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

tf = transforms.Compose([transforms.ToTensor(), transforms.Lambda(lambda x: x.view(-1))])
train = DataLoader(datasets.MNIST('.', download=True, train=True, transform=tf),
                   batch_size=64, shuffle=True)
model = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))
opt = optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
for epoch in range(1):
    for x, y in train:
        opt.zero_grad(); loss_fn(model(x), y).backward(); opt.step()
print("env OK, params:", sum(p.numel() for p in model.parameters()))
```

跑得出 `env OK, params: 101770` 之類的數字，代表 PyTorch + 資料 + GPU/CPU 全通了。接下來 23 講，都是在這條 loop 上加東西。

## 六、怎麼讀這個系列

如果你只是旁聽：
- **工程師**：抓 L03 → L07 → L08 → L14 → L20 → L21 → L24，理解理論與現代 LLM 的工程實務。
- **研究者**：從 L03 一路讀到 L24，PS1–PS3 真的做。
- **應用方**：L14–L17 + L18–L19 給你部署與遷移的判斷力。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- LeCun, Bengio & Hinton, *Deep Learning*（Nature, 2015）：[nature.com/articles/nature14539](https://www.nature.com/articles/nature14539)
- Goodfellow, Bengio & Courville, *Deep Learning* 教科書（免費線上版）：[deeplearningbook.org](https://www.deeplearningbook.org/)
- MIT 6.7960 readings 頁（推薦讀物）：[OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/)
