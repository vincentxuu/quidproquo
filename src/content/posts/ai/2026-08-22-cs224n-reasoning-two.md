---
title: "CS224N 第 13 講：Speculative Decoding 與 Test-Time Scaling"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, reasoning, inference, speculative-decoding, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 14
tldr: "第 13 講從推論效率走到推論能力：speculative decoding 用小模型草擬、大模型驗證；on-policy distillation 處理資料漂移；長上下文與 test-time scaling 則用更多推論資源換取表現。"
description: "逐段讀 CS224N Winter 2026 Lecture 13：speculative decoding、policy drift、long context 與 inference-time scaling。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-reasoning-two-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 13 講排在 2026 年 2 月 17 日，但未列講者；本文因此只歸因於 course staff。[官方 Reasoning 2/2 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture13-reasoning-part2.pdf)的 agenda 包含 speculative decoding、off-policy drift 與 on-policy distillation、long-context extension，以及 inference-time scaling。

## Speculative decoding：先草擬，再驗證

大型模型自回歸生成時，每個 token 都要跑一次昂貴 forward pass。[Speculative decoding](https://arxiv.org/abs/2211.17192) 讓較小的 draft model 先提出一串 token，再由 target model 平行驗證。接受規則會修正 draft 與 target 分布的差異，因此在正確實作下保留 target model 的輸出分布。

加速取決於 draft 夠快且與 target 足夠一致。若提案常被拒絕，驗證成本可能抵銷收益。這是一個系統最佳化，不是提升答案正確率的方法。

## Off-policy drift 與 on-policy distillation

模型若用別的 policy 產生的固定資料訓練，部署時自身生成分布可能逐漸離開訓練資料，形成 off-policy drift。On-policy distillation 改由目前 student policy 產生狀態，再向 teacher 取得目標，讓訓練訊號貼近 student 真正會遇到的軌跡。

代價是必須持續採樣與呼叫 teacher，資料生成成本更高，也要防止 teacher 錯誤被穩定複製。

## Long context 不只是把視窗調大

延長上下文牽涉位置表示、訓練長度分布、attention 記憶體與模型能否真的使用遠處資訊。[RoPE（RoFormer）](https://arxiv.org/abs/2104.09864)等位置方法可透過 scaling 或重新訓練延伸，但「可以輸入」與「能可靠檢索並推理」是兩個不同測試。

長上下文評估要把定位資訊、跨段整合與干擾魯棒性分開。只用 needle-in-a-haystack 找一段字串，不能代表長文件推理。

## Inference-time scaling 把算力放在哪裡

[Test-time compute scaling](https://arxiv.org/abs/2408.03314)可以用多次 sampling、self-consistency、搜尋、verifier 或更長 deliberation 增加候選與檢查。它的效果取決於問題難度與 verifier 品質。資源分配若能先判斷題目難度，通常比每題固定產生同樣多 token 更有效率。

評估時應同時報品質與實際成本：token、延遲、模型呼叫與 verifier 開銷。否則「推理更強」可能只是沒有上限地花更多算力。

## Speculative decoding 的接受流程

Draft model 自回歸提出多個 token；target model 一次 forward 計算這些位置的 probability。每個 draft token 依 target/draft probability ratio 接受；遇到拒絕時從修正分布 sample，再停止本批驗證。若全接受，可多產一個 target token。

這個 correction 使輸出分布等同 target sampling，不是 heuristic copy。若實作用「target argmax 同意才接受」，可能改變分布，需明說 approximate。

## 速度模型與瓶頸

收益約由 draft latency、一次 draft 長度、acceptance rate、target batch verification 決定。Draft 太小雖快但分布不合，常拒絕；太大則草擬本身昂貴。

Benchmark 要報 batch size、sequence、hardware、target/draft、decoding。Memory bandwidth、KV cache 與 kernel launch 會影響，不可只報 theoretical FLOPs。

按 token 難度 adaptive draft length 可避免在高 entropy 區大量拒絕。不同 domain acceptance 也會 drift，需要 production monitoring。

## Off-policy 資料為何漂移

Teacher 或舊 student 產生的 trajectories 固定後，student 更新會走到不同 prefixes。那些 state 沒有 target，error 累積。這和 imitation learning 的 covariate shift 同型。

Offline data 便宜可重用，但 coverage 固定；on-policy data 貼近目前 distribution，卻需持續生成與 teacher label。混合 replay buffer、importance weighting 或週期 refresh 是折衷。

## On-policy distillation

讓 current student 生成，再在其實際 tokens/states 上匹配 teacher distribution 或 correction。它教 student 如何從自己的不完美 prefix 恢復，而不只模仿 teacher ideal trajectory。

Teacher query 成本高；可只標 uncertainty 高或 disagreement state。若 teacher 也被 student 的怪 prefix 誤導，on-policy 不保證正確，仍需 outcome evaluation。

報告時區分 token-level KL distillation、sequence outputs 與 reward-guided selection，它們不是同一 objective。

## Online/offline RL 的座標

Online policy 產資料並立即更新；offline RL 只用固定 dataset；on-policy 指資料來自目前 policy，off-policy 則可來自其他 policy。Online 不必完全 on-policy，例如 replay；offline 也可用 importance correction。

這些詞描述 data-policy relation，不是品質標籤。選擇取決於 environment cost、safety、coverage 與能否重播。

## Long context 的 position extension

RoPE 把 position 透過旋轉作用在 query/key，attention dot product表達相對位置。要超過 training length，可改 frequency scaling、interpolation 或繼續 long-context training。每種會在短/長 performance 間取捨。

Learned absolute position table 超長需新增 rows；sinusoidal 可算新位置，但模型未必學會使用。Mathematical availability 不等於 behavioral extrapolation。

## Long-context data 與 curriculum

模型若只在短 sequence 訓練，推論突然給百倍長度，attention pattern 與 task 都 out-of-distribution。Continued pretraining 需要真實長文件或合成 long-dependency tasks。

Packing 多個無關文件提高 utilization，但必須 boundary mask，避免跨文件 attention 或 loss 污染。長資料的 duplicate 與 leakage 更難查。

Curriculum 可從短到長，控制 compute；同時保留短樣本，避免短 context regression。

## Attention memory 與 KV cache

Training standard attention score 隨 (n^2)；FlashAttention 降 IO/memory constant 但不消除所有 compute。Inference decode 每步讀 KV cache，長 context 的 bandwidth/cache size 成瓶頸。

Grouped-query/multi-query attention 共享 keys/values 降 cache；sliding window、compression、retrieval 減有效長度，各自可能丟遠距資訊。

報 prefill latency、decode tokens/s、peak memory，不能只報最大可接受 token。

## Long-context evaluation taxonomy

Retrieval：找明確 span。Aggregation：跨多段加總。Relational reasoning：連接遠處 facts。Global understanding：主題/結構。Robustness：在 distractors 與衝突中選 evidence。

Needle test 只涵蓋 retrieval，且 artificial needle 可能太顯眼。測 evidence position、數量、paraphrase與 distractor similarity。報 accuracy by depth，而非一個平均。

Context utilization 還要比較 RAG：若 retrieval 能以少 tokens 達同品質，長 context 不是免費勝利；若答案需要全局整合，RAG top-k 可能切掉證據。

## Inference-time scaling 的方法族

Parallel sampling 產生多答案；self-consistency vote；tree/graph search 擴展中間 state；verifier/reward model 排序；iterative refinement 讓模型批評修改；tool execution 提供外部 feedback。

它們將 compute 放在不同處。更多 samples 增 coverage，search 需要 state/action，verifier 決定 selection，refinement 可能在錯方向反覆。

所有比較要以 total tokens/model FLOPs/latency之一固定，否則方法只是花費不同。

## Adaptive compute allocation

先用 confidence、entropy、disagreement 或 learned difficulty predictor 估題目，再決定 N、depth、token budget。目標是在相同 total budget 提高整體品質。

Predictor 誤判 hard 為 easy 會直接失敗；因此保留 minimum budget與 escalation。Calibration 要在 deployment distribution 測。

畫 quality-cost curve，找 marginal gain 下降點。單一最大 budget 不告訴使用者合理 operating point。

## Verifier 的上限

Generator 必須先 sample 到 correct candidate，verifier 才能選；oracle pass@N 是 selection 上限。Verifier 若偏好格式/長度，增加 candidates 可能反而更容易 exploit。

用 answer checker 的 task 最乾淨；open-ended judge 需 human audit。Process verifier 可以 prune early，但錯殺正確 novel path。

## 綜合實驗

選同 model/task，比 baseline decoding、speculative decoding（驗證分布與速度）、self-consistency、verifier selection。報 accuracy、pass@N、tokens、prefill/decode latency、memory。

長 context 另建 retrieval/aggregation/relational slices，和 RAG 比等成本。對 inference scaling 按難度分層，確認 gain 是否集中 hard but solvable，而非所有題。

## 材料缺口

Winter 2026 錄影不公開。本文涵蓋四段官方 agenda，不重建投影片之外的系統實作細節或課堂比較。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 13：Reasoning 2 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture13-reasoning-part2.pdf)
- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)
- [Scaling LLM Test-Time Compute Optimally](https://arxiv.org/abs/2408.03314)
- [RoFormer](https://arxiv.org/abs/2104.09864)
