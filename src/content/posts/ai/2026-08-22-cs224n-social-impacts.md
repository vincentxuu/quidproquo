---
title: "CS224N 第 16 講：Hallucination、創造力、工作與價值對齊"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, ai-safety, hallucination, alignment, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 17
tldr: "第 16 講把 NLP 的社會影響拆成四題：模型為何 hallucinate、AI 輔助創作的同質化悖論、工作如何重組，以及價值對齊為何不能化約成單一 reward。"
description: "逐段讀 CS224N Winter 2026 Lecture 16：hallucination、AI-assisted creativity、workforce 與 value alignment。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-social-impacts-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 16 講排在 2026 年 2 月 26 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture16-impact-on-humanity.pdf)題為 *AI's impact on humanity*。agenda 有四段：hallucination、AI 輔助創造力的悖論、工作影響與 value alignment。

## 為什麼模型會 hallucinate

[Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221)說明模型的自我評估訊號，而 [Why Language Models Hallucinate](https://arxiv.org/abs/2509.04664)分析訓練與評估誘因。語言模型被訓練成即使不確定也要產生下一個 token；模型可能估計自己不知道，卻仍因後訓練獎勵自信回答而選擇猜測。更強的推理或較高整體準確率，也不自動代表較低 hallucination。

實務防線不能只寫「請勿捏造」。外部主張要檢索來源、驗證引用可開啟且真的支持句子；高風險動作則需人類確認。模型信心只能是訊號，不能取代查證。

## AI-assisted creativity 的悖論

生成工具能提高個人產量或讓作品更容易完成，群體輸出卻可能更相似。若許多人依賴相同模型、偏好資料與預設 prompt，局部改善可能形成整體 diversity tax。

評估創造力因此至少有兩層：單件作品的品質，以及整批作品的多樣性。只量平均評分，會看不到創意空間是否收縮。

## 工作不是一個「會不會消失」的二元題

投影片把焦點從整個職業移到 task。自動化可能替代某些步驟、加速另一些，也創造驗證、整合與責任的新工作。平均生產力提升不表示收益平均分配；技能、議價能力與錯誤成本會改變誰受益。

可靠分析要列出工作流程中的任務、AI 介入點、剩餘人類判斷與失敗責任，而不是只引用一個職業暴露率。

## Value alignment 為什麼難

人類價值多元、互相衝突且依情境改變。把偏好壓成單一 reward 會遺失少數意見與不可交換的限制。模型還可能過度符合特定標註者、文化或部署環境。

對齊不是一次訓練完成，而是持續的 governance：說清楚誰定規則、如何申訴、如何監測分布外失敗，以及哪些決策必須保留人類權限。

## Hallucination 先分成不同 failure

Factual error：可查證主張錯。Citation hallucination：論文/網址不存在或不支持句子。Faithfulness error：摘要與提供來源衝突。Tool-result fabrication：聲稱呼叫或看到不存在結果。分類後才能選防線。

Closed-book factuality 可用 retrieval verification；grounded QA 檢查每個 claim 是否 entailed；citation 需 resolve URL/DOI 並讀內容；tool execution 由 runtime trace 證明。單一「hallucination rate」混合不同 denominator 與風險。

對創意寫作，虛構不是錯；對醫療/法律，微小錯誤高風險。Evaluation contract 必須含 use context。

## Calibration 與 selective prediction

Calibration 定義：模型說 70% confident 的一群答案，約 70% 正確。可用 reliability diagram、Brier score、ECE，但 bin/elicitation會影響。生成模型沒有天然 answer confidence，常用 verbal probability、token likelihood 或 self-evaluation，各自有 bias。

Selective prediction 允許 abstain。畫 coverage-risk curve：回答越少，錯誤應下降。好系統不是永不說不知道，而是在不確定時轉交檢索/人類。

Post-training 可能獎勵 confident/helpful style，使 verbal confidence 和 correctness 脫鉤。因此 base calibration 結果不可直接套 assistant checkpoint。

## 為什麼更強 reasoning 不保證更誠實

Reasoning 增加搜尋/生成路徑，可能找到正確解，也可能生成更多貌似合理細節。Accuracy 與 hallucination 使用不同 denominator，可同時上升：更多題答對，但錯答中捏造更豐富。

Verifier 若只看 final answer，不能限制中間 fake citation；若 reward 偏好完整解釋，模型可能在不知道時補齊。需把 factual support、citation validity 與 answer correctness 分軸。

## Citation verification pipeline

第一步 parse 每個 citation（title/authors/year/URL）。第二步 resolve canonical source，檢查存在。第三步對每個 attributed claim 抽 source span。第四步判 support/contradict/insufficient。最後把 unverifiable 標示，不讓流暢 paraphrase通過。

格式整理工具也會破壞原本合法 citation，因此保存原始 bibliography 與 diff；自動 cleanup 後跑 resolver。對學術稿，DOI/title fuzzy match 要人工確認同名。

抽查不能只挑模型自信項；採 random 加 high-risk/novel claims。發布前 citation 100% resolve 是可機械 gate，semantic support 則需更深 review。

## AI-assisted creativity 的 individual/population 分層

Individual outcome：一個人是否更快、作品評分是否提高、誰受益。Population outcome：作品間 diversity、style convergence、idea coverage。兩者可以方向相反。

Experiment 應 randomize AI access，保存 initial idea 與 final output，讓 judges blind；用 pairwise quality 加 embedding/human diversity。只看 self-reported productivity 會混 novelty 與完成感。

Baseline 要含搜尋/傳統工具，不是 AI vs 無工具。Experience slice 可能顯示 novice 得益大、expert 受 constraint；平均遮住 distribution。

## Diversity tax 的機制

共同 pretrained distribution、RLHF preference 與 default UI prompt 使建議集中在高機率模式。使用者 anchor 在第一批候選，後續修改仍留結構。Ranking 又把相似「安全」輸出排前。

Mitigation 可增加 diverse sampling、展示互異候選、先收集使用者草案再提示、允許 domain-specific models。但高 temperature 不自動有意義 diversity，也可能只增加 noise。

量 diversity 必須保 quality constraint，否則亂碼最「多樣」。使用 Pareto frontier，而非 quality+diversity 自創單分。

## 創造力研究的 consent 與 attribution

訓練資料中的創作者是否同意、模型輸出如何歸屬、使用者是否知道 AI 參與，是產品之外的 governance。研究收集作品需保護作者隱私與草稿。

Style imitation 可能不複製句子，仍對在世創作者造成市場/人格利益問題。Similarity detector 不是完整倫理判定，需政策與申訴。

## Workforce analysis 用 task decomposition

把 job 拆 tasks：資訊蒐集、草擬、判斷、溝通、執行、責任。對每個 task 標 exposure、可靠度、錯誤成本、是否需實體/法定權限。Model 能產出不表示可自主負責。

Automation 替代 task；augmentation 改變 worker productivity；recomposition 新增 verification/coordination。Occupation count 不直接告訴工時/薪資如何變。

使用者群也不同：expert 可驗證並修正，novice 可能無法辨錯；工具可能縮小生產 gap、擴大品質 gap。

## 生產力 measurement 的陷阱

短實驗量完成時間與一次品質，漏掉 downstream correction、incident、skill decay 與 review burden。需要 total cycle time、rework、error severity、learning。

Selection：願意參與 AI trial 的 worker 可能不同。Hawthorne effect 與新鮮感。Longitudinal/field deployment 才能看 workflow adaptation。

平均提升需同時報 quantiles；若低表現者改善、高表現者下降，產品決策不同。

## Deskilling、reskilling 與監督悖論

若 AI 做大部分 routine，worker 練習減少，遇到 rare failure 卻要接手。監督者需要比以前更高技能，但日常較少建立技能，形成 automation paradox。

Mitigation：保留 manual drills、顯示 evidence/confidence、漸進 authority、incident review。不要讓 junior 只做無上下文 approve。

Performance metric 若只獎速度，worker 會過度依賴；把 verification 與 error prevention 納入。

## Distributional impact 與權力

收益可能流向 model/platform owner，成本由 worker/使用者承擔。監控、速度壓力與 evaluation 可因 AI 加劇。問誰能拒用、誰看得到 logs、誰可 appeal。

Language/accessibility：低資源語言品質較差卻成本較高，workforce effect 不均。部署 assessment 要按群體與 job quality，不只總產出。

## Value pluralism

Helpful、harmless、honest 會衝突；不同文化/角色對 acceptable answer 不同。Pairwise majority preference 把 minority 消掉。模型需要 policy boundary 與可配置範圍，而非假裝單一 universal scalar。

不可交換 constraint（隱私、歧視禁止、法定權利）不應用較高 helpfulness reward 抵銷。工程上以 hard policy/authorization 和 learned preference 分層。

## Reward modeling 的 governance

誰寫 rubric、選 annotators、解 disagreement、更新 policy？每次版本改變都影響 behavior，需 changelog、evaluation、rollback。

標註勞動條件與 exposure to harmful content也是 system impact。品質不能與 worker welfare 分開。

Appeal/incident channel 將 deployment failure 回到 data/policy。否則 feedback 只來自能上報的人，形成 availability bias。

## Alignment evaluation

建立 normal、edge、adversarial、distribution-shift cases；按 value dimensions分報。測 over-refusal 與 under-refusal，避免安全只量一側。

Multi-turn escalation、jailbreak、tool permission 與 conflicting instructions。Model output、runtime enforcement、人類 approval 分層。

Red team 找 failure，不估 prevalence；自然 usage telemetry 估 prevalence但受隱私/selection。兩者並用。

## 一份部署前 impact worksheet

填 use case、affected groups、benefits、failure modes、authority、evidence、appeal、monitoring、rollback。每個高風險 claim 對應 owner 與 gate。

建立三個測試：模型不知道時能否 abstain；AI 建議錯時人能否看 evidence；side effect 前是否有適當 approval。創作工具再加 diversity audit，工作工具加 rework/skill 指標。

上線後定期重測，因 model、prompt、資料與使用者 adaptation 都 drift。Alignment 是 lifecycle，不是 launch checklist 一次打勾。

## 材料缺口

Winter 2026 錄影不公開。本文完整涵蓋四段官方 agenda；投影片中引用的個案只用來說明風險機制，沒有把單一調查數字外推成整體學界比例。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 16：AI's Impact on Humanity 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture16-impact-on-humanity.pdf)
- [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221)
- [Why Language Models Hallucinate](https://arxiv.org/abs/2509.04664)
