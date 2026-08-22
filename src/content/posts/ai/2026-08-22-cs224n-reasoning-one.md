---
title: "CS224N 第 12 講：Decoding、DeepSeek-R1 與推理訓練"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, reasoning, deepseek-r1, reinforcement-learning, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 13
tldr: "第 12 講先證明輸出策略不是小細節：greedy、beam 與 sampling 會產生不同文字；再由 R1-Zero/R1 走進 PPO、GRPO、DAPO，最後追問長推理何時真的有用。"
description: "逐段讀 CS224N Winter 2026 Lecture 12：decoding、DeepSeek-R1、PPO/GRPO/DAPO 與 reasoning 的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-reasoning-one-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 12 講排在 2026 年 2 月 12 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture12-reasoning-part1.pdf)題為 Reasoning 1/2。agenda 有四段：decoding、DeepSeek-R1、PPO/GRPO/DAPO，以及推理的本質、成效與失敗條件。

## Decoding 會改變你看到的模型

Greedy decoding 每步選最高機率 token，速度快但目光短淺。Beam search 保留多個高機率前綴，適合需要找高整體機率序列的任務；對開放生成，過度追求高機率會出現重複與平淡。Sampling 從分布抽樣，temperature、top-k 與 top-p 控制多樣性。

所以「模型回答」其實是模型分布加 decoding policy 的結果。比較推理能力時若不固定或報告 decoding，差異可能來自抽樣而不是參數。

## 從 R1-Zero 到 R1 與 distillation

投影片以 [DeepSeek-R1](https://arxiv.org/abs/2501.12948) 系列討論可驗證任務上的強化學習。R1-Zero 直接從 base model 做 RL，展示長推理行為也暴露可讀性與語言混雜問題；R1 加入 cold-start data 與多階段訓練，R1-distill 再把較強模型產生的推理資料教給較小模型。

這些名稱對應不同資料與訓練程序，不能把任一結果概括成「RL 自己產生推理」。

## PPO、GRPO 與 DAPO 改了什麼

PPO 使用 policy ratio clipping，通常還需要 value model、reference policy 與多個 loss。GRPO 以同一題多個回答的群組相對 reward 建立 advantage，省去獨立 critic。[DAPO](https://arxiv.org/abs/2503.14476) 則在大規模 RL 系統中處理 clipping、動態 sampling、長度偏差與訓練穩定性。

[Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)讓中間推理文字成為明確方法，但演算法名字不是結論。成效仍取決於可驗證 reward、題目分布、採樣數與資料篩選；reward 能被鑽漏洞時，更長文字可能只是在產生更多迎合評分器的表面訊號。

## 「推理」要以失敗條件來定義

長文字不等於正確推理。可靠分析要看答案正確率、步驟驗證、不同抽樣的一致性，以及問題改寫後是否維持能力。對簡單題增加 test-time compute 可能浪費；對超出模型知識或 reward 無法判斷的題，反覆思考也不保證突破。

## Greedy、beam 與 sampling 的目標不同

Greedy 每步 argmax，不保證整句機率最大。Beam 保留 (k) 個 prefix，以累積 log-prob 排序；需要 length normalization，否則短句常佔優。Beam 在 translation 等較封閉任務有效，open-ended LM 容易產生 generic 高機率文字。

Temperature 除 logits 後再 softmax：小於一變尖，大於一變平。Top-k 截到固定候選，top-p 取累積機率達門檻的動態集合。它們改變多樣性、tail risk 與可重現性。

比較 reasoning 時固定 decoding budget：samples 數、max tokens、temperature、stop rule。Best-of-N 若用 verifier 挑最好，提升來自 sampling 加 selection，不應只歸功 base model。

## Neural text degeneration

最大 likelihood 模型配不適合的 decoding，會重複、迴圈或產生空泛句。Repetition penalty、no-repeat n-gram 能壓表面問題，也可能禁止合理重複。根因需分 model distribution、training data 與 search。

量 degeneration 可看 distinct n-grams、repetition length、entropy 與 human quality。高 diversity 也不等於正確；需和 task accuracy/faithfulness成對報。

## R1-Zero 的 training signal

可驗證數學/程式題能用答案 checker 給 reward，減少昂貴人類標註。Policy sampling 多個 trajectories，正確解得到正 reward。長 reasoning、self-check 等行為可能在最佳化中出現。

但 outcome reward 不知道中間步驟是否正確；模型可走錯路碰到答案，或 exploit checker。Reward domain 也窄，不能直接外推開放世界判斷。

R1-Zero 的 readability/language mixing 顯示 correctness reward 沒有指定溝通品質。加入 cold-start supervised data，是改變 objective coverage，不只是 cosmetic cleanup。

## R1 的 multi-stage pipeline

Cold-start data 先建立可讀 reasoning 格式；reasoning RL 在 verifiable tasks 提升；rejection sampling 收集較好 trajectories；再用 broader SFT/RL 補 general helpfulness。每階段資料與 reward 不同。

因此 ablation 要比較同 base、相同 compute 下移除階段。只拿 final R1 比 R1-Zero，差異同時含資料、流程與可能的 checkpoint。

Distillation 把 teacher outputs 當 SFT data 教小模型。Student 可能學 reasoning pattern與答案，也可能複製 teacher error。要測 teacher/student overlap、novel problems 與不含 rationale 的 control。

## PPO 的 clipped update

Policy gradient 以 advantage 加權 log-prob。PPO 使用新舊 policy probability ratio，clip 過大的改變，避免一次 update 破壞 policy。Value model 估 expected reward，reference/KL 約束與 pretrained behavior 距離。

實作同時處理 token-level log-probs、sequence reward、mask、advantage normalization。Length 與 reward scaling 會改 gradient；只看 equation 不夠，training log 必須含 KL、entropy、clip fraction、reward 與 response length。

## GRPO：以群組建立相對 advantage

同一 prompt sample 多個答案，依群組 reward mean/std 正規化，較好的得到正 advantage。省去獨立 critic，但需要多 samples，且 group 全對或全錯時訊號弱。

Group size 增加比較品質也增加 rollout cost。若 reward 離散，dynamic sampling 可跳過沒有 variance 的 prompt，把 compute 放在目前可學題目。

## DAPO 的系統修正

DAPO 不是只換一個 loss 名稱，而是組合 decoupled clipping、dynamic sampling、token-level loss 與 overlong reward shaping 等做法，處理大規模 reasoning RL 的 stability/efficiency。

每項修正都可能交互。讀 result 要找 ablation、effective tokens 與 compute，避免把整套工程收益簡化為單一 acronym。

## Reasoning reward 的漏洞

Verifier 可被格式、答案 parser、浮點 tolerance 或 timeout exploit。建 adversarial tests：無效步驟加正確答案、不同格式等價答案、超長輸出、code side effect。Checker 需 sandbox 與 resource limit。

Process reward 對中間步驟給訊號，可能改善 credit assignment，但 step label 昂貴且「正確步驟」不一定唯一。Outcome/process 應在相同 task 比較。

## Self-consistency 與 selection

Sample 多條 chain，對 final answer majority vote。若錯誤不相關，能提高；若 model 有系統性 misconception，多數會一起錯。Vote 也不適合沒有可 canonicalize 答案的 open generation。

Verifier selection 能選 minority correct answer，前提是 verifier 比 generator error 更可靠。報 pass@N、selected accuracy、oracle upper bound，區分 generation coverage 與 selection quality。

## 何時多想有用

難度適中、答案可驗證、model 有相關知識時，更多 compute/探索可能有效。題目太簡單浪費，超出知識或 verifier 無法分辨時增加 tokens 只放大噪音。

Adaptive compute 先估 uncertainty/difficulty，再分配 samples 或長度。評估 quality-cost frontier，不以固定超大 budget 宣稱普遍更強。

## Reasoning 的行為測試

建立原題、paraphrase、irrelevant distractor、counterfactual number、shorter equivalent。若只對原格式有效，可能是 pattern memorization。逐步 verifier、answer accuracy、consistency與 calibration 分開。

不要以 chain-of-thought 的流暢度當 truth。檢查可計算步驟，並允許模型隱藏 rationale 時仍量 final behavior。

## 可操作實驗

選可驗證小題集，固定 model，跑 greedy、temperature sampling、self-consistency、verifier selection。每種同 token budget，記 accuracy、tokens、latency、diversity。

再將題目按 baseline difficulty 分 bins，看 compute gain 集中在哪裡。最後人工讀 systematic failures，區分 knowledge、planning、calculation、format/verifier。

保存每條 sample 的完整設定與 verifier decision，讓 pass@N 和 selected accuracy 可以從 raw trajectories 重算。若只留最後答案，就無法判斷提升是 generator 找到更多候選，還是 selector 變準；兩者需要完全不同的下一步。

## 材料缺口

Winter 2026 錄影不公開。本文覆蓋官方投影片四段 agenda，沒有將投影片上的單一 R1 案例外推成所有 reasoning model 的普遍結論。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 12：Reasoning 1 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture12-reasoning-part1.pdf)
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [DAPO](https://arxiv.org/abs/2503.14476)
- [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)
