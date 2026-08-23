---
title: "Stanford CS224V 第 14 講：資料受限時，語言模型還能怎麼擴展"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, language-model, data-efficiency, synthetic-data]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 15
tldr: "最後一講不是完整 LLM 訓練教學，而是資料效率研究：在 compute 充足、資料固定時重看 epochs、batch、ensemble 與 self-training，再研究 synthetic continued pretraining 的可擴展條件。"
description: "CS224V Training LLMs／Data-Efficient Language Modeling：資料瓶頸、有限資料下的 pretraining、ensemble/self-training、synthetic continued pretraining 與限制。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-data-efficient-language-modeling-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

Schedule 把最後一講簡寫成 Training LLMs，但 deck 的精確標題是 Data-Efficient Language Modeling。它不是從 tokenizer 教到 RLHF 的完整配方，而是問：當 compute 成長比高品質資料快，固定資料能不能被用得更好，又能否合成真正增加泛化能力的新資料？

## Agenda：用好既有資料，再製造新資料

講義先把模型進步拆成 algorithms、data 與 compute，說明 pretraining、instruction tuning 和 continued pretraining 的資料瓶頸。Part 1 研究有限資料、近乎無限 compute 下的 epochs、batch size、ensemble distillation 與 self-training；Part 2 轉向 synthetic continued pretraining、資料多樣性、neighbor supervision 與 scaling。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Infinite compute 不會自動修好有限資料

固定語料反覆訓練會遇到效益飽和與 overfitting。講義用控制規模的實驗重新檢查常被 compute-rich 設定忽略的選項：調整 batch 與重複次數、訓練多個模型再 ensemble/distill、用 self-training 擴充學習訊號。核心不是某個單一數字，而是把「模型大小」與「資料使用效率」分開研究。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

小規模 perplexity 改善還要驗證能否延伸到 continued pretraining 與較大資料；否則容易把一個實驗 regime 的技巧誤寫成普遍 scaling law。

## Data、algorithm、compute 三軸不能混成模型大小

Lecture 開頭把進步來源拆成 better function classes、data 與 processing compute。Pretraining recipes 一直強調 data mix，instruction tuning/RLHF 也顯示「對的資料」能讓簡單 algorithm 走很遠。只報 parameter count 無法知道改善來自 architecture、更多 tokens、清理，還是更大 training budget。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

過去 internet data 相對 compute 很大，研究常問固定 compute 怎麼選 data；未來 compute 成長更快，高品質資料可能變成稀缺資源，問題反過來成固定 data、compute 幾乎充足時能學到多少。這就是 lecture 的 asymptotic framing。

Data efficiency 也不是單一 metric。可用「達到某 loss 需要多少 unique tokens」「固定 corpus、更多 compute 的最佳 loss」「continued pretraining 後 domain task gain」等方式量。不同定義不能混在一張 headline 裡。

## Fixed-data pretraining 為什麼會撞牆

相同 tokens 重複多 epochs，早期仍能學到 pattern，之後 marginal gain 下降並 overfit。語言模型的 overfitting 不一定像分類器 training accuracy 直接顯示；validation perplexity、memorization 與 downstream generalization 要一起看。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Lecture 的 infinite-compute 實驗用固定小資料與不同 model/training choices，尋找在 compute 不再主要限制時的 loss floor。這是 controlled science，不是建議真的無限訓練 production model。Small-scale setup 讓研究者大量 sweep，但 scaling 到更大 corpus/model 仍需驗證。

標準 scaling law 常假設 optimal allocation of parameters/tokens under compute budget；data-constrained regime 改變假設。模型更大、資料不變時可能更快記住 corpus，未必提高 unseen generalization。要重新考慮 epochs、batch、regularization 與 ensemble。

## Batch size 與 epochs 是 data-efficiency intervention

Batch size 不只是 throughput parameter。它改變 gradient noise、每個 token 被看到的方式與 training steps。固定 unique data、compute-rich 時，較多 epochs 與不同 batch schedule 可能換取更低 asymptotic loss，但也提高 memorization。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

比較時要固定清楚：unique tokens、total token presentations、optimizer steps 還是 FLOPs。若一組重複資料更多次，不能同時宣稱它「只用了相同 tokens」又忽略 compute。Lecture 的目的正是允許 trade compute for data efficiency，因此 report 必須把兩者都列出。

Continued pretraining/midtraining 天生 data-constrained：領域 corpus 可能只有一批內部文件或專書。Lecture 把前面 recipes 放到這個 setting，檢查 gains 是否離開小型 pretraining experiment 後仍存在。這比只在一個 benchmark loss 上下結論更可靠。

## Ensemble 在 compute-rich 未必只是 inference trick

Ensembling 多個 independently trained models 可降低 variance，但 inference 成本高。Ensemble distillation 把 ensemble predictions 教回單一 student，試圖用額外 training compute 換取固定資料下更好的 generalization。資料沒有增加，supervision signal 卻因多模型觀點變豐富。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Lecture 的 surprising observation 是 ensemble/self-training 在 data-constrained regime 仍可能改善 asymptotic behavior。這不表示免費創造事實：teacher errors 與 bias 也會被 distill。Evaluation 要看 calibration、rare facts 與 memorization，不只平均 perplexity。

Ensemble gains 還需控制總 compute。訓練多個 teachers 再 distill 當然比單模型多花資源；研究問題是 unique data 固定時這筆 compute 是否比繼續訓練同一模型更有效，而不是是否比 baseline 便宜。

## Self-training 與 feedback loop 的分界

Self-training 讓 model 對現有 inputs 產生 targets，再用 pseudo-labels 學習。若 pseudo-label 提供更適合 task 的結構，可能提高資料使用；若只是反覆取樣模型偏好，錯誤與 mode collapse 會累積。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Lecture 把 model collapse/feedback loops 列為重要顧慮。Synthetic proportion、teacher strength、filtering 與 real-data anchor 都會影響。每一代要保存 generated corpus 與 duplication/diversity metrics，不能只保存 final checkpoint。

Independent evaluation data 必須保持未污染。若 synthesizer、student 與 evaluator共享來源或 base model，表面 gain 可能是 style alignment。Human/ground-truth tasks 與 held-out factual probes能補 perplexity。

## Small-scale perplexity 能信到什麼程度

小模型小資料便於做 ablation，但 ordering 可能在 scale 改變。某 batch/epoch recipe 在二億 tokens 有效，不代表數百億 tokens 相同；ensemble 的 compute ratio、optimization stability 與 data redundancy 都不同。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Lecture 以 continued pretraining evidence 檢查 transfer，仍保持研究語氣。可靠結論應寫成「在這些規模與設定觀察到」，並列 model、unique/total tokens、data mix、compute、metric。不要把一條 curve 寫成所有 LLM 的定律。

Replication 也需多 seeds。Data-constrained experiment 對 sample composition 敏感，單一 subset 可能碰巧較容易。Report confidence/distribution 比只報最佳 run 更有意義。

## Synthetic data 這個詞混了三件事

第一是 distillation：大模型產生 labels/answers 教小模型，主要轉移既有能力。第二是 post-training/alignment：產生 preference、reasoning traces 或 instructions，調整已有 base capability。第三才是 lecture 關注的 synthetic pretraining：能否讓 model 從有限 domain documents 學到更多可組合知識。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

三者的 success criterion 不同。Instruction-following gain 不證明 pretraining knowledge 增加；student 接近 teacher 不表示超過有限 corpus 的資訊。把所有 RL-like rollout 都叫 synthetic data，會讓研究問題失焦。

Lecture 選 continued pretraining setting：已有 pretrained model，手上只有少量專門文件，希望 model 像在大型多樣 corpus 上那樣學會 domain knowledge。這個設定讓「新資料是否有用」更容易定義。

## Reversal curse 顯示 autoregressive objective 的資料浪費

一份文件寫 A is B，autoregressive model 容易學從 A 續寫 B，卻不一定能回答 B is what。內容明明存在，因語序與 objective 沒有提供反向 supervision，知識無法靈活取用。Lecture 用它說明 paraphrase/augmentation 可能從同一 facts 產生更多 relational views。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

但 naïve paraphrase 主要換 wording，可能沒有產生真正 neighbor concepts，也可能加入 hallucination。有效 augmentation 要保留來源 facts、增加問題方向與組合，同時可驗證。這比「請 LLM 改寫十次」要求更高。

Data diversity 對 generalization 重要：同一 fact 在不同 contexts、relations 與 document neighbors 中出現，model 才可能學到較穩表示。Synthetic process 的目標不是讓文本看起來多樣，而是讓 supervision 結構多樣。

## Synthetic continued pretraining 的 dataflow

已 pretrained base model 加一批 specialized documents。Synthesis process 把每份 document 轉成相關但非重複的新 document，student 再用 synthetic + real mix continued pretrain。Real data anchor 防止整個 distribution 漂向 generator。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Lecture 先以較小 continued-pretraining experiment 驗證，再研究 scalable bootstrapping。關鍵不是一次 prompt，而是學一個 document-to-neighbor distribution。給 document x1，synthesizer 產生 x2，x2 應像 corpus 中真正相關 document，包含可由 x1/domain 支持的新表達與關聯。

Generation 後需要 dedup、quality filtering 與 provenance。每份 synthetic document 要知道 source/teacher/version；若 factual audit 失敗能追溯。Training mix ratio、synthetic repetition 與 real repetition都應報告，否則「token budget 相同」可能隱藏完全不同 unique information。

## Neighbor supervision 怎麼來

真實 corpus 中相近 documents 提供 transformation examples：給一篇，另一篇展示「合理 neighbor」長什麼樣。Nearest-neighbor search 在 pretraining scale 很昂貴，lecture 討論把 queries/keys 的 document retrieval 擴到大量資料。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Synthesizer 以 neighbor pairs 學 supervised transformation，不只學 sentence paraphrase。它可以生成相同主題的另一角度、補充關係或不同 document form。Still，neighbor 本身可能只因 boilerplate/keyword相似，retrieval quality直接影響 synthesis。

Evaluation 可比較 synthetic document 與 source 的 fact overlap、novel combinations、duplicate rate、language quality 與 contradiction。只有 downstream loss gain 會看不到 generator 是否製造難以偵測的虛構內容。

## Scaling synthetic bootstrapping 的 threshold

Lecture 指出 synthetic data 可能有 critical threshold：teacher 太弱、資料太少或 augmentation 品質太低時不工作；scale 上升後品質與 diversity failures 可能下降。這不是保證越大越好，而是研究需要跨 scale curve，不能用單點推廣。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

大規模實驗混合 synthetic 與 real data，在固定總 token budget 下比較 fresh-data oracle、重複 real 與 synthetic augmentation。若 synthetic 捕捉部分 fresh-data gain，表示它提供了比重複語料更有效的 signal；仍不等於取代真正新資料。

成本也要算 generation、neighbor search、filtering 與 student training。Synthetic token 在帳面上新增，背後 compute 可能很高。Data efficiency 與 compute efficiency是兩個軸，lecture 刻意允許 tradeoff，但實務決策必須同時呈現。

## 失敗模式：重複、低多樣與模型偏差

Generator 容易反覆使用相同模板、語氣與高機率 facts，造成 effective diversity 遠低於 token count。Dedup 需要 lexical 與 semantic 兩層；topic/entity distribution也要跟 real corpus 比較。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Hallucinated facts 進 pretraining 後很難刪。來源 grounding、fact extraction/verification 與抽樣人工 audit 應在生成階段完成。Teacher confidence 不等於 correctness，特別在 specialized domain。

模型偏差會被循環放大：teacher 偏好某表達，synthetic corpus 增加它，student 更偏好，再成下一代 teacher。保留 real anchor、teacher diversity 與 generation versions，才能監控 feedback loop。

## 這堂跟 agent system 的連接

CS224V 前面用 retrieval、formal query、state 與 verification控制 LLM。Data-efficient training 處理模型內部 representation，能改善 parser 或 generator base capability；卻無法提供 live database truth、action authorization 或 claim provenance。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

相反地，system logs 可以產生高價值 training data：parser errors、human corrections、unsupported claims 與 failed tool traces。但直接把 production traces拿去訓練有隱私與 selection bias，也可能學到舊 policy。資料治理與版本仍是第一步。

最合理的分工是 model/data improvement降低 component error，formal system 仍保留 guard。不能因 synthetic training 後 benchmark 上升就移除 schema validation 或 solver。

## 建立可審計的小型實驗

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

準備一個小型 domain corpus 與獨立 QA/evaluation set。固定 unique real tokens，建立 repeated-real、paraphrase、neighbor-conditioned synthetic 三組；每組記 total token presentations與 compute。

Synthetic documents 保存 source、teacher、prompt/model version，做 dedup、fact preservation、contradiction 與 diversity audit。Training 後比較 validation loss、domain QA、reversal probes、memorization 與 calibration，不只一個平均分。

至少跑多 seeds，報 mean/range；抽樣閱讀 gains 最大與失敗案例。若 synthetic 組更好，再做 scale-up 前先確認不是 evaluator contamination或 style matching。這才符合 lecture 的研究問題，而不是把「生成更多文字」誤當資料效率。

## Synthetic data 必須增加變化，不只改寫句子

講義區分 distillation、post-training/alignment 與真正想替 pretraining 增加知識組合的 synthetic data。單純 paraphrase 可能保留相同資訊與偏差，無法複製網路語料的多樣關係。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Synthetic continued pretraining 的方向是學習「一份文件的 neighbor」：從相關文件對取得 supervision，訓練 synthesizer 依來源產生帶有新組合的資料，再把 synthetic 與 real data 混合訓練。講義也強調 threshold 與 scaling 問題：小模型產生的低多樣、重複內容可能形成 feedback loop；品質改善是否能持續，必須在規模上驗證。

## 這堂怎麼接回 CS224V

前十三講多半把 LLM 放在受約束 pipeline 裡；最後一講往模型底層退一步，提醒 agent 能力仍受 training data 限制。系統層 verification 不能補出模型從未學會的表示，synthetic data 也不能取代 retrieval、formal state 與外部證據。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## 可以怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

在小型 continued-pretraining 實驗固定真實 token budget，建立三組：重複真實資料、paraphrase augmentation、neighbor-conditioned synthetic data。除了 validation loss，另測來源事實保留、重複率與 domain QA；保存生成資料，才能查 feedback loop。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開 deck 是研究演講，不是完整訓練 recipe；多項結果標為 preprint 或特定 experimental regime。沒有課堂錄影、完整程式碼與所有超參數，因此本文不把結果泛化到任意模型規模。

## 參考資料

- [Lecture 14: Data-Efficient Language Modeling](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 1: model/data/system course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
