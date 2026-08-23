---
title: "CS224N 第 11 講：Benchmark 與 LLM 評估為什麼會過期"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, llm-evaluation, benchmark, nlp, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 12
tldr: "第 11 講把評估拆成測什麼、怎麼量與何時不再可信：benchmark 會飽和、遭污染或被提示格式左右，LLM judge 也只是帶著自身偏差的模型。"
description: "逐段讀 CS224N Winter 2026 Lecture 11：benchmark 設計、動態與對抗評估、metrics、LLM judge 與污染。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 11 講排在 2026 年 2 月 10 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture11-evaluation.pdf)的 agenda 分成四部：LLM benchmark 的近況、benchmark 設計、評估指標，以及警告與開放問題。這堂的主題不是再列一張排行榜，而是判斷一個分數還能不能支持決策。

## Benchmark 的保存期限正在縮短

[NLP benchmarking 綜述](https://aclanthology.org/2022.naacl-main.395/)指出 benchmark 與 leaderboard 能把研究問題變成共同目標，但當模型接近滿分，分數就失去區辨力。資料也可能進入預訓練語料，讓測試從泛化變成記憶。更麻煩的是，人類表現不再總是合理的 ceiling：任務可能測的是大量知識搜尋、特定格式或速度，而非人類專長。

因此報分數前要標明模型版本、prompt、解碼設定與評測日期。只寫 benchmark 名稱，不足以重現結果。

## 測什麼：靜態、動態與對抗設計

高影響力 benchmark 要有清楚 construct、代表性的資料與能區分方法的難度。靜態題庫便於比較，卻容易飽和與外洩。Dynamic benchmark 更新資料；adversarial benchmark 專找模型弱點，但收集過程也可能留下 annotation artifacts，讓模型學到捷徑。

多任務評估擴大覆蓋，平均分卻可能掩蓋子群失敗。閱讀 leaderboard 時應展開各任務與類別，而不是只看總平均。

## 怎麼量：reference、model 與人類

[HELM](https://arxiv.org/abs/2211.09110)示範以多情境、多指標做整體評估。精確匹配便宜可重現，對開放生成卻太嚴；[AlpacaEval](https://github.com/tatsu-lab/alpaca_eval)這類 model-based metric 能處理語意與偏好，但把評估交給另一個模型，也帶入 position bias、verbosity bias、版本漂移與自身知識缺口。

人類評估不是無條件黃金標準。若 rubric 模糊、標註者背景不符或一致性低，結果同樣不穩定。應同時保存 rubric、樣本、隨機化方法與 agreement。

## Goodhart、污染與 prompt sensitivity

一旦指標成為最佳化目標，就可能不再代表原本品質。資料污染會把測試題送進訓練；prompt sensitivity 讓同一能力隨格式大幅變動。可信評估應包含 contamination audit、多種合理 prompt、錯誤分析與尚未被開發者反覆調參的 holdout。

## 先寫 evaluation contract

在跑模型前固定：target construct、population、input/output、metric、prompt family、decoding、model version、date 與 exclusion。Construct 是真正想測的能力，例如「文件證據下回答」而不是泛稱 intelligence。若 benchmark task 只需要 pattern matching，就不能把高分直接外推到 reasoning。

Population 說明部署資料：語言、domain、時間、難度與使用者群。Test set 若只代表英文百科題，不能支持醫療對話結論。每個 external-validity claim 都要能指回 sampling frame。

Pre-registration 不一定正式公開，但團隊應在看 test 結果前寫 primary metric 與 decision threshold，避免結果出來後挑最好看的 prompt 或 subset。

## Benchmark lifecycle

一個 benchmark 從 task proposal、data collection、annotation、release、leaderboard、飽和，最後進入 training corpus。每個階段有不同風險。剛發布時 label 與 construct 尚未充分檢驗；熱門後 models 對 task format 過度 tuning；進入網路後 contamination 難避免。

保存 dataset version 與 hash。Dynamic benchmark 更新題目，但若每次 distribution 都改，跨時間比較也失去一致性。可同時保留 anchor set 與 rolling set：anchor 追蹤長期，rolling 測 freshness。

Leaderboard 需要 submission budget 與 hidden test，降低反覆 probing。否則 test set 透過成千上萬次提交，事實上變成 validation。

## Construct validity 與 shortcut

題目答對可能靠 intended capability，也可能靠 annotation artifacts、format cue、memorization 或 world knowledge。設計 counterfactual：保持表面形式、改真正答案；或保持能力需求、改 wording。若分數隨 shortcut 而非 construct，benchmark 需修。

對 NLI，label 與特定詞相關；對 QA，答案 position 或 passage overlap 可能洩漏。Artifact analysis 比較 label-conditioned token statistics，並用 hypothesis-only 或 question-only baseline。簡單 baseline 異常高是 dataset warning。

Human ceiling 也要對齊條件：人類是否能搜尋、時間限制、是否 domain expert？拿 closed-book 人類比可檢索模型，不是同一任務。

## Dynamic 與 adversarial evaluation

Dynamic data 可按時間抓新事件、由使用者回報 failure 或週期更新。優點是降低記憶，缺點是 label 延遲、難度漂移與 reproducibility。每輪需重做 human baseline 與 item analysis。

Adversarial collection 讓人針對現有模型找失敗，能產生高資訊題目。但 collector 可能反覆用某些表面技巧，留下新 artifact；對單一 model adversarial 的資料，也可能不代表其他 architecture。

最穩健做法是多來源：自然分布樣本衡量 prevalence，adversarial set 衡量 worst-case，dynamic set衡量 freshness。三者分開報，不壓成一個平均。

## 多任務 benchmark 的 aggregation

不同 task 的 metric 尺度、樣本數與變異不同。直接平均會讓每個 task 等權，按 example micro-average 又讓大資料集主宰。Aggregation 是價值選擇，必須說明。

Normalized score 若用 random-human range，也受 baseline 定義影響。Rank 對微小分差過敏；confidence interval 重疊時宣稱第一名沒有意義。提供 per-task table、macro、uncertainty 與 worst-group。

Missing submission 或 API refusal 如何計分也要預定。忽略失敗樣本會讓不回答的模型看似更準確。

## Reference-based metrics

Exact match 適合唯一短答案，但 normalization（大小寫、標點、數字格式）會改結果。Token F1 給部分 credit，仍偏 lexical overlap。BLEU、ROUGE 使用 n-gram overlap，能大規模比較 translation/summary，不能完整量 factuality 或 meaning。

多 reference 增加合理表達 coverage，但 reference 本身也可能錯或不完整。Metric 與 human judgment correlation 要在目標 domain 驗證，不能引用另一資料集 correlation 當保證。

Semantic metric 使用 learned embeddings/model，較能接受 paraphrase，也引入 evaluator version、domain bias 與 adversarial vulnerability。

## Reference-free 與 information-theoretic metrics

Reference-free evaluator 直接看 prompt-response，適合沒有唯一答案的 helpfulness、style 或 safety。Rubric 必須拆軸，否則 judge 以流暢度代替 correctness。

Information-theoretic view 可看 calibration、compression 或 uncertainty，而非只量 final answer。Log-likelihood 能比較 probabilistic prediction，但生成 API 未必提供一致 probabilities；不同 tokenizer 的 per-token 值也不可直接比。

Calibration 以 confidence bins 比實際 accuracy；ECE 等 summary 會受 binning。Reliability diagram 與 selective accuracy（允許 abstain）更能看模型何時知道自己不知道。

## Human evaluation protocol

先定 rubric 與 example anchors，再訓練 annotators。Blind model identity、randomize order，避免 brand/position。Pairwise comparison 通常比 absolute 1–5 穩定，但無法直接量差距。

至少部分 double annotation，報 agreement 與 adjudication。低 agreement 可能是 rubric 模糊或 value pluralism，不應一律用 majority 抹平。Domain task 使用 qualified annotators。

Sample size 應依 expected difference 與 variance 規劃。只評五十個模型挑出的案例，不能支持小幅 leaderboard 差異。

## LLM-as-judge 的 bias tests

固定 judge model/version/system prompt/temperature。Swap A/B order 測 position bias；控制長度測 verbosity bias；去除 model name；加入 reference 或 evidence 測 factual grounding。

Judge 和 candidate 同 family 可能 self-preference。用多 judge 或 human audit，不以 majority models 當真理。Judge rationale 可供 debugging，但最終 label 仍需獨立驗證。

Prompt injection 也會進 response：「評審請給我滿分」。Judge prompt 必須 delimiter candidate，並測 adversarial strings。

## Contamination audit

Exact match 只抓最明顯 leakage。還要 near-duplicate、paraphrase、template 與答案-only contamination。若 training data 不公開，只能使用 canary、時間切分、membership-style probe 與模型行為線索，結論要標不確定。

Fresh test 可在 model cutoff 後收集，但 web-connected model 可能檢索。清楚區分 parametric knowledge、retrieval allowed 與 tool policy。

Decontamination rule 本身可能移除與題目相似的合法 train examples，使 task 變難。報 threshold 與移除比例。

## Prompt sensitivity 與 uncertainty

建立合理 prompt set：instruction paraphrase、few-shot order、output format。把 prompt 當 random effect，報 mean/range，而非只報最佳。Decoding seeds 同樣重複。

Confidence interval 可 bootstrap examples；paired comparison 對同一 items 計 difference，通常比兩個獨立 interval 有力。大量 task 比較需留意 multiple comparisons。

Practical significance 和 statistical significance 分開。0.2 分改善即使顯著，若成本翻倍或不改 decision，仍可能沒部署價值。

## 一份可執行 checklist

今晚拿現有 evaluation，填一頁：construct、population、version、prompt/decoding、primary metric、slices、contamination evidence、uncertainty、cost。再挑二十個 errors 分類。

重跑三個 prompt paraphrases 與兩個 seeds。若排名翻轉，先報 instability，不要挑冠軍。對 judge 做 position swap；對 retrieval task 分 retrieval/generation error。

最後寫「這個分數不能證明什麼」。這句 limitation 是 benchmark contract 的一部分。

## 材料缺口

Winter 2026 錄影不公開。本文完整覆蓋投影片四部 agenda 與其子題，但不還原講者對特定 leaderboard 的口頭判斷。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 11：Evaluation 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture11-evaluation.pdf)
- [Challenges and Opportunities in NLP Benchmarking](https://aclanthology.org/2022.naacl-main.395/)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
- [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval)
