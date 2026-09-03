---
title: "MIT 6.7960 L17：out-of-distribution 泛化 —— 領域偏移、虛假相關、與三條實務對策"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - ood
  - distribution-shift
  - domain-adaptation
  - irm
  - spurious-correlations
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 17 講：模型在訓練與測試分布不同時為什麼崩壞？covariate / label / concept shift 的差別、虛假相關與捷徑學習，以及 IRM、domain randomization、test-time adaptation 三條對策。"
tldr: "OOD 失敗不是 bug，是 i.i.d. 假設破掉：covariate shift（影像風格變了）、label shift（類別比例變了）、concept shift（同一個詞意思變了）各有對應的應對方式；最常見的原因是模型抓了『虛假相關』（用草原當牛的存在訊號），IRM 與 domain randomization 想從訓練資料結構本身把這件事修掉，test-time adaptation 在推論時即時修正。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 20
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 29
---

> 🌏 [English version](/posts/tech/2027-01-14-mit-67960-l17-out-of-distribution-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 17）。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。

---

## i.i.d. 假設與真實世界的落差

幾乎所有 ML 教科書都假設訓練與測試是 i.i.d.（independent and identically distributed）抽自同一個分布。但真實部署從來不是這樣：相機換了型號、醫院換了城市、語料從英文變成法律條文。模型在 in-distribution 拿到 95% 準確率，一上線掉到 60% — 這不是 bug，是**假設破掉**。

## 三類 shift

講次把 shift 拆成三類，對應不同的應對方式：

| 類型 | 什麼變了 | 典型例子 |
|---|---|---|
| **Covariate shift** | P(X) 變，P(Y\|X) 不變 | 白天照的 model 拿到夜景；sketch vs photo |
| **Label shift** | P(Y) 變，P(X\|Y) 不變 | 醫院 A 病人多是老人、醫院 B 病人多是運動員 |
| **Concept shift** | P(Y\|X) 變 | 「健康」這個詞在不同年代的定義；spam 標準會隨攻防演化 |

判斷是哪一類很重要：covariate shift 可以重加權訓練、label shift 可以校正預測、concept shift 通常得重標資料。

## 虛假相關與捷徑學習

OOD 失敗最常見、也最狡猾的原因：**模型抓了虛假相關（spurious correlation）**。經典例子：在 ImageNet 上訓練的牛羊分類器，學會用「背景有沒有草原」當牛的存在訊號；一到沙漠或沙灘就全錯。

這不是訓練沒收斂、也不是容量不夠。**ERM（empirical risk minimization）+ 有限容量**在訓練資料夠 i.i.d. 的前提下，最有效率的解就是把「最會浮上來的捷徑」學起來。要避免，必須**改變訓練分布結構**，而不是換更大的模型。

## 三條對策

### 1. Invariant Risk Minimization（IRM, Arjovsky 2019）

想法：跨多個訓練環境（environments）學表示 `Φ`，使得「最佳分類器 `w`」在所有環境下相同 — 也就是學到**跨環境不變**的特徵。實作上在每個環境加一個懲罰項，鼓勵「環境內最佳分類器」一致。

實務上 IRM 在 DomainBed benchmark 上跟普通 ERM 差不多（後者更新一些做法反而更強），所以被批「概念漂亮但效果有限」。但它點出了一個核心：**真正的泛化必須從訓練資料的環境結構著手**。

### 2. Domain randomization / data augmentation

既然無法列舉所有測試環境，就在訓練時**把環境變異最大化**：顏色 jitter、cutout、mixup、CutMix、RandAugment、風格轉換、合成資料。ImageNet-C / -R / -A 等 benchmark 就是用 augmentation 模擬 shift。

便宜的對策，效果通常比 IRM 還好。代價是訓練時間略增，且 augmentation 不能太離譜（會讓訓練分布偏掉）。

### 3. Test-time adaptation（TTA）

在推論時，用**未標註的測試資料**即時調整模型。典型做法 TENT（Wang 2021）：把 batch-norm 統計量與 entropy minimization 結合，幾行梯度下降就讓模型適應當下資料分布。

TTA 不需要任何標註，部署階段零成本，但假設「測試環境連續變化、模型適應得了」，不是萬靈丹。

## 誠實評估：benchmark 本身就有偏差

Recht et al.（2019）做了一件很扎實的事：用同樣的方法重新蒐集 ImageNet 的測試集（ImageNet-V2），結果 SOTA 模型掉了 11–14%。Bechtel et al.（也有類似結論）提醒：別把單一 benchmark 的數字當真理。

實務上：能 cross-check 至少一個獨立分布（不同時段 / 不同地理 / 不同人口）的表現，再決定上線。

## 最小實驗：test-time entropy minimization

```python
model.train()                              # enable BN stats update
for x_unlabeled, _ in test_loader:
    logits = model(x_unlabeled)
    loss = -(logits.softmax(1) * logits.log_softmax(1)).sum(1).mean()  # entropy min
    loss.backward(); opt.step(); opt.zero_grad()
```

跑 1–2 個 epoch，模型就會「往測試分布的特徵移動」，covariate shift 常能補回幾個百分點。

## 什麼時候用哪一招

- **Shift 小**：加 augmentation + 多資料就夠。
- **Shift 中**：test-time adaptation（無標註）或自訓練。
- **Shift 大**：domain adaptation（用目標域少量資料）甚至重訓。
- **Concept shift**：幾乎只能重標資料，模型層救不回。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Arjovsky et al., *Invariant Risk Minimization*（2019）：[arXiv:1907.02893](https://arxiv.org/abs/1907.02893)
- Gulrajani & Lopez-Paz, *In Search of Lost Domain Generalization*（DomainBed, 2021）：[arXiv:2107.00641](https://arxiv.org/abs/2107.00641)
- Recht et al., *Do ImageNet Classifiers Generalize to ImageNet?*（2019）：[arXiv:1902.10811](https://arxiv.org/abs/1902.10811)
