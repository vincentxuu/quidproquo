---
title: "台大 ADL 2025 第 7.5 講：PEFT——Adapter、LoRA、Prompt Tuning 與 HW2"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, nlp, llm, peft, lora, prompt-tuning, fine-tuning]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 10
tldr: "LLM 大到整個微調不划算時，ADL Fall 2025 的 LLM Adaptation 講義給出三種只改一小部分的做法：在 Transformer 裡插入小型 Adapter、用低秩矩陣表示權重更新的 LoRA，以及只學前綴或軟提示的 prompt tuning。講義的結論是沒有一種方法適合所有任務。HW2 的公開資訊只有一句題目「LLM Tuning and Prompt Tuning for Classical Chinese Translation」，資料、baseline 與評分都沒有文字版。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）LLM Adaptation 講義與影片 7.5：為什麼需要高效調整、Adapter、LoRA 與 GPT-3 175B 的例子、prefix tuning 與 soft prompt tuning、Mao 等 2022 的比較，以及 HW2「文言文翻譯的 LLM Tuning 與 Prompt Tuning」目前能確認與不能確認的部分。"
draft: false
glossary:
  - term: "PEFT"
    definition: "Parameter-Efficient Fine-Tuning：凍結預訓練模型的大部分參數，只訓練少量新增或挑選出來的參數，讓一個基礎模型能以低成本適應多個任務。"
    context: "ADL LLM Adaptation 講義的主題，講義寫作 Parameter-Efficient LM Tuning。"
  - term: "Adapter"
    definition: "插在 Transformer 層裡的小型可訓練子模組。原始模型所有任務共用，只有 adapter 依任務各存一份。"
    context: "ADL LLM Adaptation 講義第 8 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 10 篇。課程是 ADL Fall 2025（114-1，2025/09/01–12/15）。課程頁把 LLM Adaptation 和 Post-Training 排在同一天（9/22），當週助教課是 LLM LoRA Training，作業欄是 HW 2。

**本文依據**：[LLM Adaptation 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf)（14 頁）、影片 [7.5 Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型](https://youtu.be/ii2kMoUyNOs)（19:21），以及 HW2 說明影片 [ADL 2025 Fall Homework 2](https://youtu.be/_QiIp0WTRzI)（13:05，2025-10-06 上傳）。全部在 2026-09-30 打開核對。講義只有 14 頁，而且多數頁是示意圖，所以這篇比前一篇短。

**系列位置**：上一篇 [後訓練：Instruction Tuning、RLHF 與 InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)｜下一篇 [RAG 與 HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=ii2kMoUyNOs
title: ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=_QiIp0WTRzI
title: ADL 2025 Fall Homework 2（YouTube）
```

原始影片：[ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型（YouTube）](https://www.youtube.com/watch?v=ii2kMoUyNOs)、[ADL 2025 Fall Homework 2（YouTube）](https://www.youtube.com/watch?v=_QiIp0WTRzI)、[ADL TA Recitation: LLM LoRA Training（YouTube）](https://www.youtube.com/watch?v=eGQMzbhokg0)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## 問題：整個模型微調太貴

講義的開頭和上一篇共用同一張地圖（第 2–4 頁）：要在已知任務上做好，可以做 prompt tuning／engineering，也可以調整 LM 本身。第 4 頁在後者旁邊加了一句：微調 LLM 可能又貴又不實際。第 5 頁因此把主題定為 Parameter-Efficient LM Tuning，也就是更實際的 LLM 調整方式。

第 6 頁列出三個「為什麼需要高效調整」的理由（投影片註明取自 Benji Xie 與 Regina Wang）：

1. 現在的 AI 典範重視準確率多於效率。
2. 訓練與微調 LLM 有隱藏的環境成本。
3. 訓練成本越高，AI 開發越集中在資金充足的組織，尤其是產業界。

第 7 頁把共同的想法講成一句話：稍微修改隱藏表示就好，不必動整個模型。

## 三種做法

### Adapter

第 8 頁（講義標註 He 等，2022）：在 Transformer block 裡插入小型可訓練的子模組，位置在 multi-head attention 與 feed-forward 之後。重點在最後一行：所有任務共用同一個原始預訓練模型，adapter 是依任務區分的模組，因此更穩健、也更省儲存空間。

### LoRA

第 9–11 頁介紹 [LoRA](https://arxiv.org/abs/2106.09685)（Hu 等，2021）：

- 想法是 low-rank adaptation。圖上把 LoRA 模組畫在 attention 與 feed-forward 旁邊，和原本的權重並聯相加。
- 依據是第 10 頁那句：下游微調時的權重更新具有低的內在秩（low intrinsic rank）。
- 第 11 頁用 GPT-3 175B 的實驗結果收尾，結論是 LoRA 有更好的擴展性與任務表現。

<details>
<summary>LoRA 的低秩更新寫成式子（出自 LoRA 論文，講義以圖表示）</summary>

原本的權重 W₀ 是 d×k 的矩陣。LoRA 凍結 W₀，只學兩個小矩陣：

```text
W = W₀ + ΔW = W₀ + B·A
B ∈ R^(d×r),  A ∈ R^(r×k),  r ≪ min(d, k)
```

要訓練的參數從 d·k 降到 r·(d+k)。推論前可以把 B·A 加回 W₀，不增加額外延遲。這些細節來自 LoRA 論文，講義本身只寫了「low intrinsic rank」這個核心觀察。

</details>

### Prompt Tuning

第 12 頁只有一句文字：prefix tuning 與 soft prompt tuning 也是參數高效的調整方式。這兩者在[第 8 篇的預訓練與 Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning) 已經出現過，這裡的角色是把它們重新歸類到 PEFT 底下：不改模型權重，只學一段接在輸入前面的連續向量。

### 哪一種比較好？

第 13 頁引 Mao 等 2022 的比較，結論只有一句：沒有一種方法能適合所有任務（No one can fit all tasks）。

| 做法 | 改動的位置 | 講義給的理由 |
|---|---|---|
| Adapter | 在 Transformer 層裡插入新模組 | 原模型共用，adapter 依任務存，穩健且省空間 |
| LoRA | 在既有權重旁加低秩更新 | 權重更新本來就是低秩；GPT-3 175B 上擴展性與表現更好 |
| Prompt tuning | 只學輸入前面的前綴或軟提示 | 同樣是參數高效的調整方式 |

## 動手的部分交給助教課

同一週的助教課是 LLM LoRA Training。課程頁上的講義連結 `f114-adl/doc/w5-LoRA.pdf` 在 2026-09-30 回傳 404；同名檔在 [Fall 2024 路徑](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)可以打開。課程頁連的影片是 [ADL TA Recitation: LLM LoRA Training](https://youtu.be/eGQMzbhokg0)（18:15），上傳日期是 2023-11-16，也就是沿用往年的錄影。實作細節留給本系列第 18 篇「助教課：從 PyTorch 到 LLM 部署」。

## HW2：只拿得到題目

課程頁 9/22 那一列的 HW 2 按鈕直接連到 YouTube 上的 [ADL 2025 Fall Homework 2](https://youtu.be/_QiIp0WTRzI)。能確認的只有：

- **題目**：影片說明欄寫「LLM Tuning and Prompt Tuning for Classical Chinese Translation」，也就是用 LLM 調整與 prompt tuning 做文言文翻譯。
- **影片長度** 13:05，2025-10-06 上傳。
- 對照 [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) 第 11 頁，第二份作業的主題是 LLM Tuning。

**拿不到的**：這支影片沒有字幕，也沒有公開的規格投影片或文字版說明。資料集、使用的基礎模型、baseline、評分指標、繳交格式與截止日期，本文都無法確認，所以一律不寫。作業繳交走 NTU COOL，需要台大帳號。

**校外怎麼做**：如果想練這一講的技術，可以把 HW2 當成題目方向，自己準備一小份文言文與白話文的對照資料，比較「只寫 prompt」「prompt tuning」「LoRA」三種做法。評分方式要自己定，結果也無法和官方排行或評分對照。

## 讀完這一講，你應該能

- 用一句話說明為什麼 PEFT 有用：只改少量參數，基礎模型能共用。
- 說出 Adapter、LoRA、prompt tuning 各自改動模型的哪個位置。
- 解釋 LoRA 為什麼可行：微調時的權重更新具有低的內在秩。

今晚可以做的一件事：拿你手邊任何一個 Transformer 模型的設定，算出某一層 attention 投影矩陣的 d×k，再算 r = 8 時 LoRA 要訓練的 r·(d+k) 個參數，看看比例差多少。這個數字就是第 6 頁那三個理由在實務上的樣子。

## 延伸閱讀

- [CS224N 第 9 講：Prompting、LoRA 與參數高效微調](/posts/ai/2026-08-22-cs224n-efficient-adaptation)
- [CS224N 第 18 講：Tinker and LoRA Without Regret 材料缺口紀錄](/posts/ai/2026-08-22-cs224n-tinker-lora)

下一篇：[RAG 與 HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/22 講次、助教課與 HW 2 連結
- [LLM Adaptation 講義（250922_Adaptation.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf) — 本文頁碼來源
- [ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型（YouTube）](https://youtu.be/ii2kMoUyNOs)
- [ADL 2025 Fall Homework 2（YouTube）](https://youtu.be/_QiIp0WTRzI) — 說明欄只有題目一句
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 第 11 頁三份作業主題
- [LLM LoRA Training 助教講義（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [ADL TA Recitation: LLM LoRA Training（YouTube）](https://youtu.be/eGQMzbhokg0)
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
