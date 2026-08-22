---
title: "CS224N 第 19 講：小模型如何跨過 Scaling Law 的門檻"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, reasoning, small-language-model, synthetic-data, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 20
tldr: "最後一講把 Open Questions in NLP 2026 收斂成 smart scaling：以 prolonged RL、Prismatic synthetic data、RL as pretraining 與開放協作，讓小模型不只靠增加參數追求推理能力。"
description: "逐段讀 CS224N Winter 2026 Lecture 19：ProRL、Prismatic Synthesis、RL as pretraining、OpenThoughts 與推理研究問題。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-open-questions-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把最後一個正規單元排在 2026 年 3 月 10 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture19-open-questions.pdf)以 *The Art of Artificial Reasoning for (Small) Language Models* 展開。它沒有單頁 agenda，但反覆標出三種創新：unconventional data、algorithms 與 collaboration。

## 問題設定：不是停止 scaling，而是改變 scaling 對象

投影片從極大算力集中在少數組織的限制出發，主張 brute-force scaling 之外還有三條路：有限資料下學得更快、合成網路之外的新資料，以及在 test time 或 training time 進行推理。

這不是宣稱 scaling law 已失效。較精確的說法是把資源從單純參數與預訓練 token，移到資料生成、RL 軌跡、推論搜尋與合作基礎設施。

## ProRL：讓強化學習不提早停住

[ProRL](https://arxiv.org/abs/2505.24864) 關注 reasoning RL 常因 entropy collapse 或有效題目耗盡而飽和。投影片延伸前面 DAPO 的 dynamic sampling 與 decoupled clipping，透過控制探索與資料難度，讓小模型繼續從可驗證任務學習。

重點不是「訓練更久必然更好」，而是延長訓練需要新的有效訊號。若 reward、題目或探索都不變，更多步數只會強化既有捷徑。

## Prismatic Synthesis：合成資料要擴張問題空間

Prismatic Synthesis 不只改寫既有題目，而是組合不同技能與結構，生成超出網路現成分布的 reasoning data。投影片用它討論長 chain-of-thought 與跨領域泛化。

合成資料的核心檢查仍是污染、正確性與多樣性。Teacher 產生大量相似解法，可能增加 token 數卻沒有增加有效問題種類。

## RL as pretraining：把推理提前

傳統流程先做 next-token pretraining，再把 reasoning 當後訓練附加。這一段探索把可驗證 reward 更早放進 base model 建立過程，使表示與生成一開始就受推理訊號影響。

它留下重要實驗問題：收益來自 reward、資料 curriculum，還是額外運算？比較必須固定總資料與 compute，否則無法判斷「提前」本身的效果。

## Collaboration 與最後的 open questions

[OpenThoughts](https://www.open-thoughts.ai/) 類合作資料集代表第三條主線：跨組織共享資料配方、模型與評估，讓資源較少團隊也能累積推理基礎設施。開放不只意味著下載權重；還需要 provenance、授權、生成器版本與去污染資訊。

投影片最後保留的問題包括：推理有多少是記憶、如何產生真正新穎的問題、如何模擬可學習環境，以及如何讓小模型以演算法與資料效率縮小差距。這些是研究議程，不是已被單一方法解決的結論。

## Smart scaling 的 accounting

Brute-force 通常指增加 model parameters、pretraining tokens、compute。Smart scaling 把資源放進 data curriculum、synthetic generation、RL rollouts、verifiers、test-time search與collaboration。但這些仍消耗 compute；不能以「演算法」隱藏成本。

比較小/大模型要報 training FLOPs、data-generation teacher cost、RL samples、inference budget、hardware與energy。若小模型靠大模型產百萬 trajectories，系統依賴仍包含 teacher。

另一方面，distilled small model 可降低每次部署成本，teacher cost amortize。決策應看 lifecycle：一次 training、多少 queries、latency/privacy/on-device。

## Data saturation 不是「網路文字用完」單一事件

有效資料受品質、重複、版權、語言/domain與新穎性限制。新增 tokens 若是重複/低資訊，marginal gain 下降。高品質專業資料少，也可能不能公開。

Saturation 按能力不同：常識文本很多，rare reasoning trajectory少。Synthetic data 的目標是填 capability gap，而非只增總量。

Data audit 要量 near-duplicate、source concentration、difficulty、solution diversity、contamination 與 human validity。

## Learn better with limited data

Alternative architecture 可提高 parameter/compute efficiency；training recipe 可調 optimizer、curriculum、objective、data order。要以 iso-compute/iso-data ablation 證明 efficiency。

Curriculum 從可學到更難，避免全易缺乏訊號與全難無 reward。Difficulty 會隨 policy 變，需要 dynamic measure，不是固定題目 label。

Data selection 可用 influence、uncertainty、diversity，但 selector 自己有 bias。保留 random baseline。

## ProRL 的 problem diagnosis

Reasoning RL 初期學會 easy patterns後，reward plateau。原因可能 prompt group 全對/全錯、entropy collapse、clip 阻止更新、data difficulty不變。Prolonged RL 要逐項維持 learnable signal。

Dynamic sampling 排除無 variance groups；entropy control 保探索；decoupled clipping對正/負 advantage不同限制。不是簡單增加 epochs。

Training curve 需同時看 reward、pass@k、entropy、length、KL、difficulty mix與out-of-domain，避免 reward上升只來自長度/format。

## Effortless 與 effortful RL

投影片用對比強調「套預設 RL recipe」和長時間有效訓練不同。Effortful 不是讚美燒更多算力，而是監控 failure、調 data/control，讓新增 compute 仍轉為generalization。

公平 ablation：相同 total rollouts，比 default stop 與 prolonged controls；報 marginal gain per compute。若只讓ProRL更多 samples，不能分演算法/預算。

## Small reasoning model evaluation

除 math/code benchmarks，測 instruction following、general QA、safety、calibration與latency。Reasoning specialization可能 regression。

對 contamination敏感題做 fresh/held-out generator；按difficulty與domain。報 pass@1、pass@k、selected performance與test-time budget。

和大模型比較除了 accuracy，也看 memory、on-device、privacy、吞吐與可 fine-tune。

## Prismatic synthesis 的設計空間

Prismatic 指組合不同 seed dimensions/skills，生成新 problem structures，而非單軸 paraphrase。Pipeline包含seed taxonomy、composition、problem generation、solution/verifier、filter與diversity selection。

每步會錯。Generator產不可解題，solver/verifier同源產 shared error，filter偏好熟悉格式。抽樣人類審查與多 solver agreement。

保存 lineage：每題來自哪些 seeds、generator/version、verification。否則無法追 contamination與 failure。

## Synthetic data 的 quality gates

Validity：題目有解且答案對。Novelty：非 train/benchmark近鄰。Diversity：skills/structures覆蓋。Difficulty：對 current policy 有梯度。Safety/license：來源與內容可用。

Dedup 在 text和semantic/problem-structure層。Exact不同不代表 novel。

Synthetic-to-real transfer 才是外部證據。只在同 generator distribution 評估，會高估。

## Long chain-of-thought 的資料風險

長 rationale 提供中間 supervision，也增加錯誤步驟、verbosity imitation與成本。Filter final answer不足以保證 path。

Process verifier/step checking、short/long controls。若短正確解同樣有效，不要把長度當 reasoning。

Training 可以 mask 低可信 steps 或只用 outcome；選擇是訊號與噪音的取捨。

## RL as pretraining 的 objective shift

Next-token pretraining模仿資料分布；RL基於reward改變生成分布。提前RL讓base形成期就接觸可驗證結果，不把reasoning只當chat post-training。

但 RL environment/domain窄可能傷 general language modeling。需要 mixture或alternation，監控 perplexity/general skills。

對照：相同 data/compute，late RL vs early RL；否則 benefits可能來自更多 reasoning data。

## Front-loading reasoning 的表示假說

如果base早期學 prediction與reasoning結合，後續SFT不必從純 imitation model重新塑形。可 probe/behavior測 sample efficiency、transfer與robustness。

這仍是研究假說。Representation probe不能證明使用；用 downstream intervention/learning curves。

## Test-time training

不只test-time sampling，也可在單一instance或stream上更新參數/state。利用 self-supervised signal適應 distribution。

風險：single example overfit、poisoning、latency、rollback。需要隔離temporary weights、budget與validation。

和in-context learning比較相同資料/compute，區分parameter update價值。

## Collaboration 作為技術變數

OpenThoughts 類合作可集結 prompts、solutions、verifiers與compute。多團隊增加domain diversity與交叉檢查，也增加schema/version/governance成本。

Open artifact應含 data recipe、code、checkpoints、eval、licenses、provenance。只有 final weights難以審計。

Cross-institution reproduction能發現單一infra assumption。先定 shared contract與held-out tests。

## Ego is the enemy 的操作化

不要把演講口號只當文化建議。技術上是公開negative results、接受external audit、避免leaderboard cherry-pick、讓contribution可組合。

Credit/governance需設計，否則開放勞動集中、決策不透明。Dataset card列contributors與decision process。

## Reasoning 是記憶還是計算

Behavior可能來自memorized solution/template、retrieved pattern、composition或真正new search。建立near-neighbor audit、symbol/name counterfactual、novel rule、fresh generated tasks。

若改數字/名稱就崩，可能依模板；若能在新規則少量examples泛化，證據較強。仍不應把單test定義為「真正推理」。

## Generate beyond internet data

外太空式比喻指網路未包含的problem/trajectory。方法有programmatic generators、simulators、games、formal systems、self-play、human-machine collaboration。

Environment提供ground truth/reward，比自由文字self-generation可靠；但 environment設計決定能力範圍。

多 environment transfer是關鍵，不只在generator內得高分。

## Open research question matrix

| 問題 | 可驗證證據 | 主要混淆 |
|---|---|---|
| prolonged RL 是否更有效率 | iso-compute curves | 更多 samples/data |
| synthesis 是否提升泛化 | fresh real/other-generator tests | teacher overlap |
| early RL 是否改 representation | controlled stage ablation | objective/data mix |
| small model 是否 practical | quality-cost-latency frontier | teacher generation cost |
| collaboration 是否改善結果 | independent reproduction/diversity | resource increase |

每題先固定 comparison contract，再跑規模。Open question不是缺一張更大的 leaderboard，而是缺能區分 explanations 的實驗。

## 一個可執行小模型研究計畫

選可驗證 symbolic/math小環境，固定1–3B checkpoint。建baseline SFT；加入短RL；再加dynamic sampling/entropy control。總rollouts一致。

合成資料做兩種：paraphrase與compositional generator，等量。用fresh generator與real set評。保存lineage。

報accuracy/pass@k、entropy、tokens、training/inference FLOPs、latency與general regression。三 seeds與error taxonomy。

最後發布configs/data recipe/negative results。這個小計畫就能測投影片主張的三軸，而不需假裝複製極大實驗。

## 材料缺口

Winter 2026 錄影不公開。本文依公開投影片反覆出現的四個主軸組織，沒有把投影片中的 leaderboard 數字改寫成跨模型普遍主張，也不補現場口頭結論。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 19：Open Questions in NLP 2026 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture19-open-questions.pdf)
- [ProRL](https://arxiv.org/abs/2505.24864)
- [OpenThoughts](https://www.open-thoughts.ai/)
