---
title: "CS224N 第 9 講：Prompting、LoRA 與參數高效微調"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, peft, lora, prompting, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 10
tldr: "第 9 講比較 prompting、pruning、LoRA、prompt tuning 與 adapters：它們都在回答同一題——要讓一個大型預訓練模型適應新任務，究竟需要改多少參數與儲存多少任務狀態？"
description: "逐段讀 CS224N Winter 2026 Lecture 9：DPO 收尾、prompting、PEFT、pruning、LoRA、prompt tuning 與 adapters。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-efficient-adaptation-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 9 講排在 2026 年 2 月 3 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture09-peft.pdf)先用 DPO 與偏好資料收尾，再進入 prompting、PEFT、pruning/subnetwork、LoRA、prompt tuning、adapters 與其他方法。

## 適應方法先看「改了什麼」

Full fine-tuning 更新所有模型參數，彈性高，但每個任務都要保存完整模型，訓練記憶體也包含梯度與 optimizer state。Prompting 不更新權重，只改輸入上下文；成本低、迭代快，卻受 prompt 敏感度與 context 長度影響。

PEFT 固定大部分基礎模型，只訓練一小組任務專屬參數。評估時不能只看可訓練參數比例，還要看推論延遲、儲存、batching 是否受影響，以及品質是否在真正任務上維持。

## Pruning 與 subnetwork

Pruning 移除權重、神經元或結構，尋找能保留能力的子網路。非結構化稀疏可能讓參數數量下降，卻未必在一般硬體上直接變快；結構化 pruning 較容易得到實際加速，但可移除的自由度更小。

## LoRA 的低秩更新

[LoRA](https://arxiv.org/abs/2106.09685) 凍結原權重矩陣，以兩個小矩陣的乘積表示更新。若任務所需的權重變化近似低秩，就能用少量參數學到有效調整。部署時可保存每個任務的 LoRA 權重，或把更新合併回基礎權重。

秩、套用哪些層與 scaling 都是設計選擇。「參數少」不代表所有任務都無損，也不表示訓練資料與評估可以省略。

## Prompt tuning 與 adapters

Prompt tuning 學習連續的 virtual token embedding，將可訓練狀態放在輸入端。[NLP adapters](https://proceedings.mlr.press/v97/houlsby19a.html) 則在 Transformer 層內插入 bottleneck 模組，用 down-projection、非線性與 up-projection 學任務函數。前者介入點少，後者能在多層改變表示，但也可能增加每層運算與部署組合複雜度。

選法可以很務實：只需要快速試驗先用 prompt；需要穩定、可版本化的任務狀態，再比較 LoRA 或 adapter；真的要縮短推論時間，必須量實際硬體 latency，不能用參數比例代替。

## 先定義 adaptation budget

比較方法前先寫出限制：可訓練參數、optimizer memory、GPU hours、每個任務儲存、推論 latency、是否能修改 base weights。不同限制會得到不同答案。若 API-only，只有 prompting；若多租戶共用 base model，adapter/LoRA 的切換成本很重要；若單一任務追求最高品質，full fine-tuning 可能合理。

「只訓練 0.1% 參數」不等於只用 0.1% 記憶體。Forward 仍需載入 base model，activation 仍存在；某些量化或 optimizer 技巧才降低其他部分。報告 trainable、total、peak memory、wall-clock 與 checkpoint size。

Quality 也要在固定 data、steps 與 tuning budget 比。Full fine-tuning 若只試一組 learning rate，PEFT 試十組，結論不公平。每種方法至少使用合理官方範圍。

## Prompting 是 adaptation，不是免費 baseline

Zero-shot 只放 instruction；few-shot 加 demonstrations；chain-of-thought 或 structured prompt 改變模型的 inference trajectory。它不更新權重，但消耗 context tokens、增加 latency，並可能暴露 examples。

Prompt 敏感度來自 wording、order、label names 與 delimiter。評估至少使用多個 paraphrase/order，報平均與 variation。只挑開發者找到的最佳 prompt，會把 tuning effort 隱藏。

Prompt 也可以 retrieval-based 動態選例。這把問題移到 example index 與 similarity；若 test example 鄰近 train duplicate，成績可能是 leakage。保存選例策略與實際插入 examples。

## Pruning 與 Lottery Ticket 的不同問題

Magnitude pruning 依權重大小移除，movement 或 gradient-based 方法考慮 training dynamics。Unstructured mask 產生零散 sparse matrix；structured pruning 移除 head、channel、layer 或 block，硬體較容易加速。

[Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635) 問 dense network 中是否存在可從早期 initialization 訓練成功的 sparse subnetwork。它不是「任何 pretrained model 刪小權重都不掉分」的保證。Winning ticket 的找法、rewinding point 與 task 都影響結果。

Pruning 後通常要 fine-tune 恢復。比較應含 sparsity、quality、實際 latency 與 target hardware kernel。參數檔變小但矩陣仍以 dense kernel 算，使用者不會得到速度收益。

## LoRA 的參數與合併

對 (W\in R^{d_{out}\times d_{in}})，LoRA 固定 (W)，學 (B\in R^{d_{out}\times r}) 與 (A\in R^{r\times d_{in}})：

\[
y=Wx+\frac{\alpha}{r}BAx.
\]

Trainable parameters 從 (d_{out}d_{in}) 變成 (r(d_{out}+d_{in}))。通常一個 factor 以零初始化，使開始時 update 為零，保留 base behavior。

Target modules 是核心選擇：只套 query/value projection、所有 attention projection，或連 FFN 都套，容量與 checkpoint 都不同。Rank 太小可能 underfit，太大逐漸接近 full update 成本。Alpha 與 dropout 影響有效尺度。

Inference 可動態載入 LoRA，方便一個 base 服務多任務；也可 merge (BA) 回 (W)，避免額外 matmul。Merge 後要注意 precision、版本與能否還原。多 adapter 同時 composition 並不保證線性相加不干擾。

## Prompt tuning 與 prefix methods

Prompt tuning 學一組 continuous embeddings，前置於 input。Base weights 固定，gradient 只更新 virtual tokens。它和人工 prompt 不同：這些向量不必對應可讀單詞。

Prefix tuning 可在多層 attention 提供 learned key/value prefix，比只在 input embedding 介入更深。參數仍少，但 cache 與每層 sequence-like state 可能增加推論成本。

模型 scale 會影響效果；在小模型或 domain shift 大時，少量 soft prompt 容量可能不足。比較時要報 virtual token 數，因為它也占 context 或 attention 計算。

## Adapter bottleneck 與組合

Houlsby adapter 在 Transformer sublayer 後插入 down-projection、nonlinearity、up-projection，再經 residual。Bottleneck (k\ll d)，每個 task 儲存小 module。

它比 LoRA 明確增加 network depth 與 sequential operations，可能帶來 latency；優點是模組邊界清楚，可依 task 載入。Adapter placement、shared layer norm、是否每層插入都影響結果。

多任務可 composition language/domain/task adapters，但順序與 interaction 需要驗證。把兩個各自有效 adapter 串起來，不保證同時有效，因為第二個看到的是第一個改過的 distribution。

## 選方法的 decision matrix

| 條件 | 先試方法 | 必量風險 |
|---|---|---|
| 沒有權重存取 | prompting | variation、token cost |
| 多任務共用 base | LoRA / adapter | switching、latency、storage |
| 只需極少狀態 | prompt tuning | capacity、context overhead |
| 需要實際縮模型 | structured pruning | hardware latency、quality |
| 單任務最高上限 | full fine-tuning | memory、forgetting、checkpoint |

這張表只是起點。先以小 validation subset 做 feasibility，再用固定完整 protocol 比兩個最合理候選。不要同時跑所有 PEFT 方法，最後以偶然最高分選冠軍。

## 一個公平的 adaptation 實驗

固定 pretrained checkpoint、dataset split、max tokens、evaluation 與 seed set。比較 zero/few-shot prompt、LoRA、adapter、full fine-tuning。為每種方法給合理但相近的 tuning 次數。

結果表列 validation/test quality、trainable/total params、peak training memory、training time、checkpoint bytes、batch-1 與 batch-serving latency。再做 low-data curve，看 100、1,000、full examples 下排名是否改變。

最後做 forgetting test：在 adaptation 前後跑一組 general tasks。方法在 target 加分但 general 大幅退化，是明確 trade-off，不應只報 target。

Serving test 也要模擬真實切換。若同一 batch 不能混用不同 LoRA，scheduler 可能把 request 拆小，吞吐下降；adapter checkpoint 雖小，冷載入仍有 I/O。量 steady-state 與 cold-start，並說清楚是否已 merge。只有離線單一任務 latency，無法代表多租戶系統。

最後保存可逆性：base checkpoint hash、adapter config、tokenizer version 與 merge script。若無法從 merged model 回溯是哪個 adapter 與資料版本，就失去 PEFT 最重要的模組化優點。

## 材料缺口

Winter 2026 錄影不公開。本文覆蓋 overview 的 DPO、偏好資料與七個 adaptation 主題；投影片中的實驗圖只用來解釋方法取捨，不外推到未測任務。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 9：Efficient Adaptation 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture09-peft.pdf)
- [LoRA](https://arxiv.org/abs/2106.09685)
- [Parameter-Efficient Transfer Learning for NLP](https://proceedings.mlr.press/v97/houlsby19a.html)
- [The Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635)
