---
title: "CS224R Default Project：用 SFT、IPO、RLOO 微調 LLM 解 Countdown"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, post-training, rlvr, homework]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 14
tldr: "CS224R Spring 2026 的 default project 要你在 Qwen2.5-0.5B Base 上，針對 Countdown 算術推理任務依序實作三個階段：SFT 暖身、IPO 偏好最佳化、用規則式 verifier 當獎勵的 RLOO，三者用同一套 vLLM 評估比較，再做一個自選的研究延伸。實作部分禁止用 SFTTrainer 這類高階 trainer，也禁止任何 AI 工具協助，只有延伸部分例外。延伸占報告成績的一半，看的是方法和紀錄，不是分數。起始碼和資料集都公開，校外讀者缺的是 Modal credits 和 autograder。"
description: "Stanford CS224R（Spring 2026）Default Project 導讀：依官方 Default Project Guidelines、default_proj.zip 起始碼與 Custom Project Guidelines，整理 Countdown 任務與三個資料集、SFT／IPO／RLOO 各自要實作的目標與要回報的指標、verifier reward 與效能門檻、八個延伸方向、5/1 與 5/22 兩個 milestone、配分與 AI 工具政策，以及和 custom project 新穎性要求的對照。不含解答。"
draft: false
glossary:
  - term: "RLOO"
    aliases: ["REINFORCE Leave-One-Out"]
    definition: "一種 policy gradient 估計量：對同一個 prompt 取樣 k 個回答，每個回答的 baseline 是其他 k−1 個回答獎勵的平均，用來降低變異，不需要 value model。"
    context: "CS224R default project 的第三階段，搭配 Countdown 的規則式 verifier reward。"
  - term: "IPO（Identity Preference Optimization）"
    aliases: ["IPO", "ΨPO"]
    definition: "Gheshlaghi Azar 等人 2023 年提出的偏好最佳化目標，放鬆 Bradley-Terry 假設，把 DPO 的 log-sigmoid 損失換成對固定目標值的平方損失，以減少對偏好標籤的過擬合。"
    context: "CS224R default project 第二階段要實作的就是這個 IPO；課表 L9 讀物中的 2025 年 IPO 是另一個同名方法。"
  - term: "Countdown"
    aliases: ["Countdown 任務"]
    definition: "給一組數字和一個目標值，要求模型寫出只用這些數字、經四則運算得到目標值的算式。"
    context: "CS224R default project 用它當唯一任務，好在同一個問題上比較 SFT、偏好最佳化和線上 RL。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [Default Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)、[起始碼 default_proj.zip](https://cs224r.stanford.edu/material/default_proj.zip) 與 [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)，2026-09-30 匿名下載。[課程首頁](https://cs224r.stanford.edu/)提醒 default project 從 Spring 2025 之後調整過，2025 的專題範例只能參考方向。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 14 篇，**不寫解答**。

[CS224R](https://cs224r.stanford.edu/) 的期末專題占總成績 35%，可以選 custom project（自己定題目）或 default project。規格標題是「RL Fine-Tuning of Language Models」：你要親手實作 LLM 後訓練的 RL 堆疊，再做一個研究延伸。

規格開頭特別寫了一句：default project 的工作量並沒有比較少，它省掉的是自己想題目和設計評估的難度，讓你把同樣的力氣花在指定的問題上。

它剛好把前兩講接起來：[L9](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization) 的偏好最佳化，加上 [L10](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning) 提到的可驗證獎勵 RL，在同一個任務上各做一次。

## 課程影片來源

下方提供官方課程與既有錄影入口。Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。沒有找到與本文範圍相符的公開單支講次，因此不嵌入。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

查核日期：2026-10-10。

## 任務：Countdown

每一題給一組數字和一個目標值，模型要寫出一串四則運算，把這些數字變成目標值。起始碼 README 的例子：目標 24、可用數字 [3, 4, 6, 8]，模型要輸出：

```text
<answer>(8 - 4) * 6</answer>
```

規格說這個任務測的是規劃、拆解問題，以及把中間步驟算對的能力。選它的理由是可控：偏好最佳化通常用在指令遵循這類任務，但這裡刻意也用 Countdown 的偏好資料，讓 SFT、偏好最佳化和線上 RL 在同一個問題上直接比較。

**模型限制**：所有實驗都必須用 [Qwen2.5-0.5B Base](https://huggingface.co/Qwen/Qwen2.5-0.5B)，不能換成其他模型，instruct 版本也不行。規格說這是為了公平評估。

**資料集**：四個都在 Hugging Face 上公開：

| 用途 | 資料 |
|---|---|
| SFT 暖身 | [Asap7772/cog_behav_all_strategies](https://huggingface.co/datasets/Asap7772/cog_behav_all_strategies) |
| 官方 SFT checkpoint（IPO／RLOO 可選用的起點） | [asingh15/qwen-sft-countdown-defaultproj](https://huggingface.co/asingh15/qwen-sft-countdown-defaultproj) |
| 成對偏好資料（IPO） | [asingh15/countdown_tasks_3to4-dpo](https://huggingface.co/datasets/asingh15/countdown_tasks_3to4-dpo) |
| prompt／評估資料（RLOO） | [asingh15/countdown_tasks_3to4](https://huggingface.co/datasets/asingh15/countdown_tasks_3to4) |

官方 SFT checkpoint 的用意是隔離 bug：你的 IPO 或 RLOO 出問題時，可以先換成官方 checkpoint，確認不是 SFT 那一段的錯。

## 獎勵：規則式 verifier

RLOO 用的獎勵在 `evaluation/countdown.py`。依 README，分數只有三級：

| 分數 | 條件 |
|---|---|
| 0.0 | 找不到 `<answer>...</answer>` |
| 0.1 | 抓得到答案，但算式不合法或結果不對（格式分） |
| 1.0 | 算式合法、剛好用到給定的數字、結果等於目標 |

規格說這個兩段式計分沿用 [TinyZero](https://github.com/Jiayi-Pan/TinyZero)。它只給 RLOO 用；IPO 從偏好資料學，不看這個獎勵。

## 三個階段要實作什麼

起始碼已經做好資料載入、RLOO 的整體流程（取樣、算獎勵、交接 checkpoint）和 vLLM 評估。README 列出三個留給你的函式，呼叫時都會丟出 `NotImplementedError`：

| 階段 | 你要寫的地方 | 目標 |
|---|---|---|
| SFT | `sft_trainer/sft.py` 的 `train(...)` | 下一個 token 預測，**只對回答的 token 算損失**，prompt 不算 |
| IPO | `ipo_trainer/ipo.py` 的 `train(...)` | 以 SFT 模型當 π_ref 的成對偏好目標 |
| RLOO | `rloo_trainer/rloo_update_worker.py` 的 `update(...)` | leave-one-out baseline 的 policy gradient 更新 |

**SFT** 是大多數語言 RL 流程的第一步：目標和預訓練一樣，只是損失只算在回答上。

**IPO** 用的是 [Gheshlaghi Azar et al. 2023](https://arxiv.org/abs/2310.12036)。規格先寫出 DPO 損失當對照，再說明 IPO 放鬆了 Bradley-Terry 假設，以減少對偏好標籤的過擬合：它把「新舊模型對數機率比的差」拉向一個固定值 (2β)⁻¹，用平方損失而不是 log-sigmoid。注意課表 L9 列的讀物 [Garg et al. 2025](https://arxiv.org/abs/2502.16182) 也叫 IPO，但那是另一個方法（Implicit Preference Optimization），別弄混。

**RLOO** 來自 [Ahmadian et al. 2024, Back to Basics](https://arxiv.org/abs/2402.14740)。對同一個 prompt 取樣 k 個回答，每個回答的 baseline 是其他 k−1 個回答獎勵的平均，這就是 [L3](/posts/ai/2026-09-30-cs224r-policy-gradients) 講的 baseline 降變異，只是不需要學 value function。

<details>
<summary>展開：RLOO 的 importance weighting 為什麼存在</summary>

起始碼用 vLLM 取樣，但梯度是在 Hugging Face 模型上算的。兩條執行路徑算出的 token 機率可能有些微差異（kernel 數值、tokenization 邊界情況），所以規格把 vLLM 當成 behavior policy μ、訓練中的模型當成 target policy π_θ，對每個樣本乘上 w = exp(log π_θ(y|x) − log μ(y|x))。為了穩定，比值在 log 空間計算，並設上限裁切。這是 [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) 的 importance sampling 在工程上的實際用途。

</details>

## 評估與效能門檻

評估流程是：收集要測的 prompt，每題用 vLLM 取樣 K 個回答，用 verifier 打分，回報平均分數和 pass@K。三個 checkpoint 要在相同的取樣設定下比較。

規格也把取樣參數寫死：

| | temperature | top_k | top_p | min_p |
|---|---|---|---|---|
| 訓練 | 1.0 | -1（關閉） | 1.0（關閉） | 0.0（關閉） |
| 評估 | 0.6 | 20 | 0.95 | 0.0（關閉） |

**預期表現**：SFT 在測試集上的平均準確率應達 0.3 以上，IPO 和 RLOO 要比 SFT 好，分別到 0.4 和 0.5 以上。因為 vLLM 取樣有隨機性，autograder 給 5% 誤差空間，實際門檻是 0.25、0.35、0.45。milestone 的效能分數是 min(你的準確率 ÷ 門檻, 1.0)。

## 每個 milestone 要交什麼

| 時間 | 交付 | 配分 | 內容 |
|---|---|---|---|
| 4/22 | Survey | 0% | 組員、確認做 default project |
| 5/1 | Proposal + SFT | 4% | 提案 PDF（延伸 1/4 頁、相關研究 1/2 頁、技術大綱 1/2 頁）加 SFT 結果；另交 `sft.py` 和 `eval.json` |
| 5/22 | IPO + RLOO milestone | 5% | 報告 PDF；另交 `ipo.py`、`rloo_update_worker.py` 和各自的 `eval.json` |
| 6/3 | Poster | 8% | 聚焦在延伸部分 |
| 6/8 | Final report | 18% | 研究論文格式，20 分評分表 |

Survey 的日期來自 custom project 規格和首頁課表；其他日期和配分來自 default project 規格。default 規格的 poster 段落裡有一行寫著「6/4/25」的場地時間，看起來是去年的殘留，首頁課表和 custom 規格都寫 2026 年 6 月 3 日。

**每個階段要回報的指標都要畫成圖**，不能只給數字：

- **SFT**：訓練／測試集的 cross-entropy loss 與 token accuracy 隨迭代的變化、最終 checkpoint 的 pass@k，外加一個測試題的完整輸出
- **IPO**：訓練／測試集的 IPO loss 與 reward margin（chosen 和 rejected 的隱含獎勵差）、pass@k、一個 rollout
- **RLOO**：RLOO loss、importance weight 平均值、KL loss、每題 16 個樣本的 rollout 準確率、pass@k、一個 rollout

這份清單本身就是很好的除錯指南。reward margin 不上升，偏好目標多半寫錯了；importance weight 偏離 1 太遠，代表 vLLM 和訓練模型的機率對不上；KL 暴衝，則要懷疑 reward hacking 或遺忘。

## 延伸：占一半成績，看方法不看分數

規格第 5 節寫得很直接：延伸占這份作業成績的 50%。它要求探索一個還沒解決、或只解決一部分的問題；不要求 state-of-the-art，效能要求「非常寬鬆」，重點是你試了哪些想法、做得多嚴謹、紀錄得多清楚。負面或好壞參半的結果，只要方法用心、紀錄清楚，也可以算成功。

規格列了八個方向，每個都附參考文獻：

1. 合成資料擴增與預訓練初始化
2. 用 off-policy 取樣提高效率
3. 結合 test-time inference（例如生成式 verifier）
4. 離散 token 空間中的探索
5. self-play 與 multi-agent 共同演化
6. 有效的工具整合推理
7. 課程式學習（curriculum）
8. 自選題目

期末報告的 20 分評分表裡，Method（5 分）和 Results（6 分，定量與定性各半）占最多；還有一頁獨立的 extended abstract（2 分）。

## 規則：禁用高階 trainer，也禁用 AI 工具

- **程式碼**：除了延伸部分，任何地方都不能使用或參考既有 codebase、框架或 AI agent 的程式碼，規格點名 Cursor、Codex、Claude Code、Antigravity。可以用 Hugging Face 載入模型、tokenizer 和資料集，但不能用 SFTTrainer 或類似的高階 trainer API，訓練目標要自己寫。
- **AI 工具**：default project 的任何部分都不能和 GitHub Copilot、ChatGPT 這類工具協作，唯一例外是延伸。
- **助教**：TA 不能看任何期末專題的程式碼。
- **算力**：每位修課學生有 500 美元的 Modal credits，用在作業和專題。起始碼的 Modal 設定預設使用 H100。

## 和 custom project 的差別

兩者的交付項目和配分相同。差別在兩個地方：

**新穎性要求**。custom project 規格要求至少符合下面一項：回答文獻中還沒回答或只回答一部分的問題；在元件或演算法層級提出有理由的非平凡修改（即使不是每個面向都變好，也要分析失敗模式）；把方法用到還少有人碰、而且需要非平凡調整的應用領域。它也列出「弱提案」的例子，例如把現成演算法直接跑在新資料集上。default project 把這個要求集中在延伸部分。

**AI 工具政策**。custom project 可以用 Copilot、ChatGPT 產生樣板程式碼和資料流程，但核心的 RL 演算法（規格舉 PPO 為例）要自己寫，milestone 和期末報告都要附 AI Tools Disclosure。default project 則除了延伸以外一律禁止。

## 校外自學者要注意的地方

- **材料齊全**：規格、起始碼、四個資料集都匿名可取得。README 寫明可以在自己的 CUDA GPU 上跑，也可以用 Modal；需要 Weights & Biases 和 Hugging Face 的 token。模型是 bfloat16，GPU 要支援。
- **缺口**：Modal credits 只發給修課學生；autograder、Gradescope 和 Ed 討論串（規格要大家到 Ed 問問題）都看不到。你只能拿上面的 0.3／0.4／0.5 門檻自己驗收。
- **honor code 精神**：如果你想用這個專題練功，最有價值的做法是照規格的限制來：不用高階 trainer、不讓 AI 幫你寫三個核心函式。那三個函式正是這份專題要你學會的東西。

## 今晚可以做的事

下載 [default_proj.zip](https://cs224r.stanford.edu/material/default_proj.zip)，只讀兩個檔案：`evaluation/countdown.py` 和 `sft_trainer/sft_dataset.py`。前者告訴你獎勵怎麼算，後者告訴你 prompt 和回答怎麼切開。讀完後寫下一句話：你的 SFT 損失遮罩要遮掉哪些 token？這是三個階段裡最容易出錯、也最先要做對的一步。

## 延伸閱讀

- [CS336：RLVR](/posts/ai/2026-08-22-cs336-rlvr)：可驗證獎勵 RL 的工程細節
- [CS336：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)：SFT 和偏好最佳化的另一種講法
- [CME295：偏好調整](/posts/ai/2026-09-29-cme295-preference-tuning)：DPO 家族的整理

**系列導覽**：上一篇 [L10：LLM 推理的 RL 與 test-time compute](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning)｜下一篇 [L11：Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方頁與公開播放清單，沒有對應的公開錄影，狀態維持不變。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [CS224R Default Project Guidelines（2026）](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)
- [CS224R Default Project 起始碼 default_proj.zip](https://cs224r.stanford.edu/material/default_proj.zip)
- [CS224R Custom Project Guidelines（2026）](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [Qwen2.5-0.5B（Hugging Face）](https://huggingface.co/Qwen/Qwen2.5-0.5B)
- [Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036)
- [Ahmadian et al. 2024, Back to Basics: Revisiting REINFORCE Style Optimization for Learning from Human Feedback in LLMs](https://arxiv.org/abs/2402.14740)
- [Rafailov et al. 2023, Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [TinyZero（GitHub）](https://github.com/Jiayi-Pan/TinyZero)
