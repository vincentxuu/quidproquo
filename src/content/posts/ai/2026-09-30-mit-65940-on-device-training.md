---
title: "MIT 6.5940 L21 裝置端訓練：梯度會洩漏資料，activation 才是記憶體殺手"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, on-device-ai, transfer-learning, privacy]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 23
tldr: "在裝置上訓練有兩個理由：模型要跟著使用者的新資料調整，資料又不該離開裝置。L21 先證明「只分享梯度」也不安全：Deep Leakage from Gradients 能從梯度還原出原圖和原句。接著處理記憶體：訓練比推論貴，是因為要存 activation，不是參數。TinyTL 只調 bias 再加輕量殘差，省 6.5 倍記憶體；SparseBP 只更新重要的層與通道；QAS 讓真正的 int8 訓練追上 fp32；PockEngine 在編譯期做完 autodiff，最後在 256KB 的 MCU 上把訓練記憶體壓到 141KB。"
description: "MIT 6.5940 Fall 2024 第 21 講 On-Device Training and Transfer Learning 導讀：federated learning 與 FedAvg、Deep Leakage from Gradients 攻擊與防禦、訓練記憶體瓶頸、TinyTL（bias-only＋lite residual）、sparse back-propagation 與 contribution analysis、quantization-aware scaling（QAS），以及 PockEngine 的編譯期 autodiff 與各平台加速。"
draft: false
glossary:
  - term: "Deep Leakage from Gradients"
    aliases: ["DLG", "梯度洩漏攻擊"]
    definition: "攻擊者手上只有模型與某次訓練分享出來的梯度：先隨機產生假輸入與假標籤，算出它們的梯度，再用梯度之間的距離當損失，反過來更新假資料，直到梯度對上，假資料就會變成原本的訓練資料。"
    context: "MIT 6.5940 L21 投影片第 19–26 頁，出自 Zhu et al., NeurIPS 2019。"
  - term: "TinyTL"
    aliases: ["Tiny Transfer Learning"]
    definition: "裝置端遷移學習方法：凍結權重只更新 bias（更新 bias 不需要存 activation），再加上低解析度、無 inverted bottleneck 的 lite residual 模組補回模型容量，在不掉精度下省下最多 6.5 倍訓練記憶體。"
    context: "MIT 6.5940 L21 投影片第 41–52 頁，出自 Cai et al., NeurIPS 2020。"
  - term: "quantization-aware scaling"
    aliases: ["QAS"]
    definition: "真正用 int8 張量訓練時，權重與梯度的尺度比例會和 fp32 對不上，導致收斂變差。QAS 依量化的 scale 重新縮放梯度，讓兩者比例回到 fp32 的水準，不需要額外記憶體。"
    context: "MIT 6.5940 L21 投影片第 74–82 頁，出自 Lin et al., NeurIPS 2022。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-on-device-training-en)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 21 講（2024-11-19），主要材料是 [Lec21-On-Device-Training-And-Transfer-Learning.pdf](https://www.dropbox.com/scl/fi/35992g5bz2sa1hxo3dmn6/Lec21-On-Device-Training-And-Transfer-Learning.pdf?rlkey=yqym2zffstfrdsui371lkvael&st=sqmt0oro&dl=0)（102 頁）與 [課堂錄影](https://www.youtube.com/watch?v=1YuD_5UQxsA)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影公開，投影片引用的 DLG 程式碼也公開；這講沒有對應 lab。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)保留同名講次，排在 11 月 24 日。截至 2026-09-30 投影片與錄影都是空連結。

**系列位置**：上一篇 [L19–L20 分散式訓練](/posts/ai/2026-09-30-mit-65940-distributed-training)｜下一篇 [L22–L23 課程總結與量子機器學習](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

[L19–L20](/posts/ai/2026-09-30-mit-65940-distributed-training) 講的是在資料中心裡用上千張 GPU 訓練。L21 把方向倒過來：在一支手機、一塊 Jetson，甚至一顆只有 256KB SRAM 的微控制器上訓練。

第 2–3 頁給兩個理由。**客製化**：感測器不斷收到新資料，模型要跟著調整。**隱私**：程式碼、企業資料這類敏感資料不該送上雲端。第 4 頁的 Lecture Plan 分六項：梯度洩漏、訓練記憶體瓶頸、TinyTL、SparseBP、QAS、PockEngine。前一項講隱私，後五項講記憶體。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=1YuD_5UQxsA
title: EfficientML.ai Lecture 21 - On-device Training（YouTube）
```

原始影片：[EfficientML.ai Lecture 21 - On-device Training（YouTube）](https://www.youtube.com/watch?v=1YuD_5UQxsA)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 只分享梯度，其實也不安全

第 6–11 頁先介紹 [federated learning](https://arxiv.org/abs/1602.05629) 的 FedAvg：每台裝置用本地資料訓練 N 步，把更新後的模型送到 server 平均，再發回去。投影片強調，重要的私人資料從不離開裝置。

第 12–18 頁接著追問：梯度本身安全嗎？已有研究證明，光看梯度就能判斷某筆資料是否在這個 batch 裡（membership inference），或是否有帶某種屬性的樣本（property inference）。那能不能直接還原出原始資料？

第 19–20 頁的 [Deep Leakage from Gradients（Zhu et al., NeurIPS 2019）](https://arxiv.org/abs/1906.08935) 給出肯定的答案。一般訓練是固定資料、更新權重；DLG 反過來，固定權重、更新資料：

1. 隨機產生一張假圖和一個假標籤。
2. 讓假資料過一次模型，算出它的梯度。
3. 把「假梯度與真梯度的距離」當成損失，對假資料做梯度下降。
4. 梯度對上之後，假資料就是原本的訓練資料。

第 21–23 頁展示結果。影像在 batch size 1 和 8 都能還原。BERT 的例子更直觀：第 0 輪是一串亂碼；第 30 輪幾乎完整還原出原句「Registration, volunteer applications, and student travel application open the first week of September. Child care will be available.」

防禦呢？第 24 頁顯示，加高斯或拉普拉斯雜訊要加到精度明顯下降才擋得住。第 25 頁的解法來自 [L20 的 DGC](/posts/ai/2026-09-30-mit-65940-distributed-training)：把梯度剪掉 99%，ResNet-50 精度還是 76.15%（比未剪枝的 75.96% 高 0.19%），而且能擋住攻擊。DGC 的本地累積也會把梯度打亂，進一步保護隱私。第 26 頁的結論是：**分享梯度和分享原始資料一樣危險**。DLG 的 PyTorch 實作只要約 20 行，程式碼在 [mit-han-lab/dlg](https://github.com/mit-han-lab/dlg)。

## 訓練為什麼比推論吃記憶體

第 28–31 頁先列硬體差距：

| | Cloud AI | Mobile AI | Tiny AI |
|---|---|---|---|
| 記憶體（放 activation） | 141GB | 4GB | 320kB |
| 儲存（放權重） | ~TB/PB | 256GB | 1MB |

Tiny AI 的記憶體比 Mobile AI 小 13,000 倍，比 Cloud AI 小 1,000,000 倍。第 31 頁的結論是權重和 activation 都要縮。

第 32 頁用 MobileNetV2 量給你看：推論（batch 1）要 20MB，訓練（batch 8）要 452MB，連 Raspberry Pi 1 的 256MB DRAM 都放不下，更別說 2MB 的 MCU。

第 33 頁回答為什麼。反向傳播算權重梯度時要用到該層的輸入 activation，所以前向時每一層的輸出都得留著。推論算完一層就能丟，訓練不行。activation 還會隨 batch size 線性成長。

第 34–35 頁點出一個反直覺的事實：CNN 訓練的瓶頸是 activation，不是參數：ResNet-50 的 activation 比參數大 6.9 倍。MobileNetV2-1.4 相對 ResNet-50 把參數減少 4.3 倍，activation 卻只少 1.1 倍。[L10 MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml) 講推論時也提過同一件事：省參數不等於省 activation。

## TinyTL：只調 bias，再補一點容量

第 36–39 頁比較常見的遷移學習做法（在 Cars 資料集上）：

- **Full**：整個網路都調，精度最好，但成本最高。
- **Last**：只調最後的分類頭，很省，但容量不夠，精度掉很多。
- **BN+Last**：調 BN 層和分類頭。可訓練參數少了 12 倍，**記憶體卻只少 1.8 倍**，精度還掉了。

參數效率不等於記憶體效率，原因就在上一節。

第 41–42 頁的 [TinyTL（Cai et al., NeurIPS 2020）](https://arxiv.org/abs/2007.11622) 從反向傳播的公式下手：權重的梯度需要輸入 activation，bias 的梯度只需要從上一層傳下來的梯度。所以**凍結權重、只調 bias**，就不必存 activation，記憶體省 12 倍。代價是第 43 頁的 16.3% 精度損失。

第 44–48 頁補回容量的方法是 lite residual 模組，原則是 activation 要小：解析度減半，而且不用 inverted bottleneck。第 47 頁算出，通道 1/6、解析度 1/2、深度 2/3，activation 只剩約 4%。第 48 頁的結果：精度比 bias-only 高 11.6%，記憶體只多 5MB。

第 50 頁在三個資料集上比較，TinyTL 最多省 6.5 倍記憶體而不掉精度。第 52 頁再推一步：TinyTL 用 group normalization 支援 batch size 1 訓練，搭配 lite residual 把訓練記憶體壓到 16MB，放得進典型的 L3 cache。在 cache 裡訓練比在 DRAM 裡訓練省電得多。

## SparseBP：不是每一層都值得更新

第 54–57 頁把幾種策略排在一起。完整反向傳播要存所有 activation。只調最後一層很便宜，但精度掉很多。bias-only 不用存 activation，而且能一路傳到第一層，但和完整訓練還有差距。第 57 頁的標題順帶一提：LoRA 是 bias-only 的一個特例。

第 58–61 頁的 sparse back-propagation 有三個觀察：

- 有些層沒有其他層重要。
- 有些通道沒有其他通道重要。
- 不必反向傳播到最前面幾層。

第 61 頁算了一個例子：只更新四分之一的通道，要存的 activation 和反向 FLOPs 都少 4 倍。

要更新哪些層？第 63 頁的原則：前面幾層 activation 大，後面幾層權重大，中間幾層兩者都小。所以後面的層只調 bias（只跟 activation 有關），中間的層才調權重。第 64 頁的 contribution analysis 一次只微調一層，看精度提升多少，當作這一層的貢獻；不同模型偏好的層不同，BERT 偏好 QKV projection 和第一個 FFN 層。第 65 頁再用 evolutionary search 找出整體的更新方案。

第 66–67 頁的結果：SparseBP 在 BERT、DistilBERT、MCUNet、MobileNetV2、ResNet-50 上和完整反向傳播精度相當，額外記憶體少 4.5 到 7.5 倍。

第 69 頁把它用在 LLM 上，在 Jetson Orin 上用 Alpaca 資料集微調 Llama2-7B：

| 框架 | 方法 | 每步延遲 | GPU 記憶體 | Alpaca-Eval 勝率 | MT-Bench |
|---|---|---|---|---|---|
| PyTorch | 完整微調 | 7.7s | 45.1GB | 44.1% | 6.1 |
| PyTorch | LoRA（rank 8） | 7.3s | 30.9GB | 43.1% | 5.1 |
| PockEngine | 完整微調 | 1.8s | 43.1GB | 43.7% | 6.1 |
| PockEngine | Sparse | 0.9s | 31.2GB | 43.1% | 5.7 |

投影片的結論：Sparse BP 精度和 LoRA 一樣，和完整微調相近，速度從 1.8 秒降到 0.9 秒。

## QAS：真正的 int8 訓練為什麼不收斂

第 74–76 頁區分兩種量化訓練。[L6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat) 講的 QAT 是 fake quantization：中間張量大多還是 fp32，**省不了訓練記憶體**。real quantization 讓權重和 activation 都是 int8，確實省記憶體，但沒有 BatchNorm，還混著 int8、int32、fp32 好幾種精度，很難訓練。第 77 頁量到，real int8 用 SGD 訓練，10 個資料集平均精度從 86.0% 掉到 75.4%。

第 78 頁找到原因：int8 訓練時，每個張量的權重範數與梯度範數比例（‖W‖/‖G‖）和 fp32 對不上。第 79–80 頁的 QAS 依量化 scale 重新縮放梯度，把比例拉回 fp32 的水準。第 82 頁的比較：

| 訓練方式 | Top-1 |
|---|---|
| FP32 SGD | 86.0 |
| Int8 SGD | 75.4 |
| Int8 LARS | 64.8 |
| Int8 Adam（多 3 倍記憶體） | 84.5 |
| Int8 QAS | 86.9 |

Adam 也能救回大部分精度，但要多 3 倍記憶體，在裝置上用不起。

## PockEngine：把演算法的省變成真的省

第 83 頁是整講的收束：在只有 256KB SRAM 的 MCU 上訓練，記憶體一路怎麼降下來。

| 做法 | 訓練記憶體 |
|---|---|
| TensorFlow（雲端） | 652MB |
| PyTorch（雲端） | 303MB |
| MNN（邊緣） | 41.5MB |
| PockEngine | 5.7MB（7.3×） |
| ＋QAS | 2.9MB（2.0×） |
| ＋sparse layer／tensor update | 355KB（8.8×） |
| ＋operator reordering | 141KB（2.4×） |

整體省了 2300 倍，進到 256KB 的限制以內。這張圖出自 [On-Device Training Under 256KB Memory（Lin et al., NeurIPS 2022）](https://arxiv.org/abs/2206.15472)。

第 86 頁問了一個問題：演算法上的省，怎麼變成真的省？答案是演算法與系統的協同設計，也就是 [PockEngine（Zhu et al., MICRO 2023）](https://arxiv.org/abs/2310.17752)。

第 89–90 頁對比兩種做法。傳統訓練框架重視彈性，autodiff 在執行時才做，很多圖最佳化用不上。PockEngine 把 autodiff 搬到**編譯期**，執行時的開銷降到最低，也多出很多圖最佳化的空間。第 93 頁列出這些最佳化：sparse layer／tensor update、operator reordering 與 in-place update、constant folding、dead-code elimination。第 95 頁說 codegen 只為用到的運算子產生程式碼，最後得到輕量、可攜的執行檔。

第 94–100 頁是各平台的結果：

- MCU 上比 TensorFlow Lite 快 21 到 23 倍（MobileNetV2、ProxylessNAS、MCUNet）。
- Jetson Nano 與 Orin 上快 2 到 4 倍。投影片說加速來自編譯：低頻 CPU 上跑 Python 很慢。
- Raspberry Pi 4B+ 上快 13 到 21 倍。現有框架大多只針對推論最佳化，ARM CPU 上的訓練幾乎沒人優化。
- Apple M1／M2 上把訓練圖編譯成 Metal，繞過 PyTorch 與 TensorFlow 在 M1 上的相容性問題。
- 整合 Qualcomm 的 SNPE 支援 DSP，整合 [TinyEngine](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing) 支援 MCU，讓原本只能推論的框架也能訓練。

## 讀完這講可以做什麼

- **今晚能做的事**：clone [mit-han-lab/dlg](https://github.com/mit-han-lab/dlg)，在 CIFAR 的一張圖上跑一次攻擊，看假圖怎麼一步步變成原圖。再把梯度剪掉 99% 重跑一次，對照第 25 頁的防禦效果。
- 在 PyTorch 裡把一個預訓練 CNN 的權重全部 `requires_grad_(False)`、只留 bias，用 `torch.cuda.max_memory_allocated()` 比較和完整微調的峰值記憶體差多少。
- LoRA 與其他 PEFT 方法的完整介紹在 [L14 LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training)；另一門課的角度見 [CMU 11-868 PEFT 與 LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora)。

## 延伸閱讀

- 推論端的同一套記憶體限制：[L10 MCUNet 與 tinyML](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml)、[L11 TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)
- 量化基礎：[L6 PTQ 與 QAT](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L21 日期、投影片與錄影連結
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — L21 排在 11 月 24 日，材料未放出
- [Lec21-On-Device-Training-And-Transfer-Learning.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/35992g5bz2sa1hxo3dmn6/Lec21-On-Device-Training-And-Transfer-Learning.pdf?rlkey=yqym2zffstfrdsui371lkvael&st=sqmt0oro&dl=0) — 本文所有頁碼與數字的出處
- [EfficientML.ai Lecture 21 - On-device Training（YouTube）](https://www.youtube.com/watch?v=1YuD_5UQxsA)
- [McMahan et al., Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629) — FedAvg
- [Zhu et al., Deep Leakage from Gradients（NeurIPS 2019）](https://arxiv.org/abs/1906.08935)
- [mit-han-lab/dlg（GitHub）](https://github.com/mit-han-lab/dlg)
- [Lin et al., Deep Gradient Compression（ICLR 2018）](https://arxiv.org/abs/1712.01887)
- [Cai et al., TinyTL: Reduce Activations, Not Trainable Parameters for Efficient On-Device Learning（NeurIPS 2020）](https://arxiv.org/abs/2007.11622)
- [Mudrakarta et al., K for the Price of 1（ICLR 2019）](https://arxiv.org/abs/1810.10703) — BN+Last 基準
- [Lin et al., On-Device Training Under 256KB Memory（NeurIPS 2022）](https://arxiv.org/abs/2206.15472) — SparseBP、QAS
- [Zhu et al., PockEngine: Sparse and Efficient Fine-tuning in a Pocket（MICRO 2023）](https://arxiv.org/abs/2310.17752)
