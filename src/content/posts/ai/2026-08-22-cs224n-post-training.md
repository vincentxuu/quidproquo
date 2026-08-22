---
title: "CS224N 第 8 講：從 instruction tuning、RLHF 到 DPO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, post-training, rlhf, dpo, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 9
tldr: "第 8 講解釋預訓練模型如何經 instruction tuning、偏好資料與 RLHF 變成助理，再以 DPO 直接從勝負配對學習；每一步都把人的判斷轉成訓練訊號，也把偏差帶進模型。"
description: "逐段讀 CS224N Winter 2026 Lecture 8：SFT、RLHF、reward model、DPO 與人類／AI feedback。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-post-training-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 8 講排在 2026 年 1 月 29 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture08-posttraining.pdf)題為 **Post-training (RLHF, SFT, DPO)**。agenda 依序是 instruction fine-tuning、RLHF、InstructGPT/ChatGPT、RL 與 reward modeling 的限制、DPO，以及人類偏好資料與 AI feedback。

## 預測下一詞不等於協助使用者

預訓練目標學的是延續文字。使用者卻期待模型理解指令、選擇有用格式、拒絕不當要求。Instruction fine-tuning 以「指令—理想回答」資料做監督式微調，把基礎模型的行為分布推向助理互動。

這一步的能力上限受資料覆蓋限制：示範沒有教到的情境，模型只能靠預訓練能力泛化。示範者的寫作風格與判斷也會成為模型偏好。

## RLHF 的三段管線

[InstructGPT 論文](https://arxiv.org/abs/2203.02155)中的典型 RLHF 管線先做 supervised fine-tuning，再收集同一 prompt 下多個回答的偏好排序，用它訓練 reward model，最後以 PPO 等強化學習方法提高預測 reward，同時用 reference model 約束政策不要漂得太遠。

Reward model 並不量「真正的好」。它近似標註者在指定介面與準則下的選擇。政策若找到 reward model 的漏洞，就可能提高分數而降低實際品質；RL 最佳化本身也有成本高、線上採樣慢、value function 難配與超參數敏感等問題。

## DPO 拿掉哪一層複雜度

[Direct Preference Optimization](https://arxiv.org/abs/2305.18290) 從 chosen/rejected 回答配對直接訓練政策。它利用偏好模型的形式，把 reward 差改寫成政策相對 reference policy 的 log-probability 差，得到分類式 loss，不必先訓練獨立 reward model 再跑 PPO。

「拿掉 RL」不代表偏好問題消失。DPO 仍依賴配對品質、reference model 與強度係數，也只能學到資料表達的偏好。若標註者分歧被壓成單一勝負，模型看不到分歧本身。

## 人類與 AI feedback

人類回饋昂貴、速度慢，且需要清楚準則；AI feedback 可快速擴張，卻可能把評審模型的偏差與盲點循環放大。實務評估要分開報資料來源、標註者一致性與自動評審，不能只報最終 win rate。

## SFT 的資料其實定義了助理介面

Instruction data 通常包含 prompt、response，有時還有 system instruction、multi-turn history 與 metadata。模型學的不只是答案內容，也學何時解釋、格式多長、如何拒絕。若示範風格一致，SFT 會把風格和品質綁在一起。

資料混合需要分辨能力與格式。數學解題、摘要、coding、對話的 loss 都是 token cross-entropy，但 sequence 長度與數量不同；不做 sampling balance，長回答或大資料源會主宰更新。Dedup 與 contamination 也重要，否則 evaluation prompt 可能以近似形式出現在 instruction set。

SFT 常從 pretrained checkpoint 起步，用較小 learning rate 避免 catastrophic forgetting。Validation 不能只看 SFT loss，因為更會模仿示範不一定代表更 helpful；要同時保留 base capability 與 target behavior 評估。

## Preference data 如何生成

對同一 prompt 取兩個或多個 candidate，標註者依 rubric 排序。Candidate 若都來自同一弱 model，資料只教微小差異；若一好一壞太明顯，reward model 學不到細緻 boundary。Sampling temperature 與 model mixture 決定比較難度。

Rubric 應拆 helpfulness、correctness、safety、style，而非只問「哪個比較好」。不同軸可能衝突：更完整回答也更冗長，安全拒絕也可能不 helpful。壓成單一 winner 會失去理由與 disagreement。

Position randomization 防止 annotator 或 judge 偏好第一個；重複標註可估 agreement。若 disagreement 高，不一定是 noise，可能表示價值真的多元。資料應保存 annotator group 與 rationale（在隱私允許下），而不是只留 binary label。

## Reward model 從 pairwise comparison 學什麼

Reward model 對 prompt-response 輸出 scalar (r_\phi(x,y))。Bradley–Terry 形式令 chosen 勝過 rejected 的機率為：

\[
P(y_w\succ y_l\mid x)=\sigma(r_\phi(x,y_w)-r_\phi(x,y_l)).
\]

Loss 鼓勵 winner 分數更高，只識別 reward difference；整體加常數不影響。Model 在 training pairs 外的絕對分數未必 calibrated。

Reward model accuracy 也可能被 style shortcut 欺騙：長度、條列、肯定語氣與特定片語。如果 candidate generation 改版，shortcut 失效，policy 可能 exploit 新漏洞。要做 adversarial examples、length-controlled evaluation 與 out-of-distribution prompt。

## PPO objective 裡的幾個角色

Policy 生成回答，reward model 給 sequence reward；reference policy 提供 KL constraint，限制新 policy 遠離 SFT model；value function 預測 expected return，降低 policy-gradient variance。PPO clipping 又限制單次 ratio update。

Pipeline 複雜是因為各元件互相影響。Reward scale 改變 advantage；KL coefficient 過大，模型幾乎不學，過小則 drift/reward hacking；sampling 慢且每次 policy 更新會改資料分布。Log 中至少保存 reward、KL、length、entropy 與 validation behavior。

高 reward 不等於 deployment 品質。Policy 可能學會冗長、迎合或過度拒絕。每輪要以獨立 human/held-out evaluator 檢查，而不是只信同一 reward model。

## DPO 的推導直覺與 loss

DPO 利用 KL-regularized RL 最佳 policy 與 reward 的關係，把 reward difference 表達成 policy 相對 reference 的 log-ratio。對 winner (y_w) 與 loser (y_l)，loss 鼓勵：

\[
\beta\left[\log\frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)}-
\log\frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)}\right]
\]

變大，再套 logistic loss。Partition function 在 difference 中消掉，因此不用 explicit reward model 或 online PPO rollout。

Beta 控制偏離 reference 的強度。Sequence log-prob 受長度影響，implementation 要確認 sum/normalization 與 mask。Chosen/rejected 若只差少數 token，整句 likelihood 也可能被共同 prefix 主宰。

DPO 工程較簡單，不代表 data 更容易。它是 offline preference learning；當 policy 走到資料沒涵蓋的新 response distribution，缺乏 online correction。Iterative DPO 或重新採樣可補，但又引入 loop 與成本。

## Human feedback 和 AI feedback 的品質控制

人類能帶入情境、規範與真正使用者需求，但昂貴且不一致。AI judge 能大量標註、產生 critique 或依 constitution 選答案，速度快，卻會共享 base model 的盲點，並偏好相似風格。

混合流程可讓 AI 處理低風險明確案例，人類抽查、裁決 disagreement 與高風險領域。Active sampling 優先送 reward margin 小、judge disagreement 高的 pair 給人，將預算放在資訊量高的例子。

評估 feedback source 時建立 gold audit set，由 domain-qualified humans 獨立標註；報 precision by category，不只 overall agreement。若 AI judge 版本更新，整套 label distribution 可能 drift，要像 dataset version 一樣鎖定。

## Post-training 的 failure taxonomy

Capability regression：新行為學會了，舊任務退化。Over-refusal：安全訊號把無害 query 也拒絕。Sycophancy：偏好資料獎勵迎合。Reward hacking：找到 evaluator shortcut。Mode collapse：回答風格與內容多樣性縮小。Calibration loss：模型更自信但不更正確。

每類 failure 需要不同測試，不能以單一 win rate 包辦。建立 slice：known/unknown facts、benign/sensitive、majority/minority preference、short/long response、in/out domain。保存 base、SFT、preference-optimized 三個 checkpoint 的相同 evaluation，才能定位哪階段引入變化。

## 一個小型 preference 實驗

不用真的跑 PPO，也能理解 pipeline。選二十個 prompts，各建立兩個回答與具體 rubric。讓兩位標註者獨立排序，計 agreement 與 disagreement reasons。再用簡單 classifier 或現成模型當 judge，和 human gold 比較。

接著檢查 length：winner 是否系統性更長？交換 A/B position，judge 結果是否翻轉？把 confident wording 改成保守 wording，correctness 不變時 preference 是否改變？這些測試會揭露 reward signal 的 shortcut。

## 材料缺口與編號註記

Winter 2026 錄影不公開。投影片封面保留「Lecture 7: Post-training」舊標籤，但官方課表、日期與檔名確認它是 regular Lecture 8。本文覆蓋六段 agenda，不補寫口頭案例。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 8：Post-training 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture08-posttraining.pdf)
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
