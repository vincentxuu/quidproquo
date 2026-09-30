---
title: "李宏毅 ML 2026 HW8：多花推論算力，投票、Self-Certainty、DeepConf 各換到多少準確率"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, test-time-scaling, reasoning, llm-inference]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 17
tldr: "HW8 不用寫程式也不用交程式：助教給一份已經寫好的 Colab，用 Llama-3.2-1B-Instruct 在 GSM8K 前 100 題上比較直接推論、Self-Consistency、Self-Certainty 與 DeepConf（Confidence），每種方法各 sample 16 條推理。你讀三篇論文、跑完 notebook，到 NTU COOL 答 20 題：18 題論文題、2 題看 Colab 結果。先備是李宏毅 2025 年第七講 Reasoning。題目中英兩版都印在 hw8.pdf，Colab 可公開下載；只有 COOL 測驗與成績需要台大帳號。"
description: "台大李宏毅《機器學習 2026 Spring》HW8「Test-Time Scaling」導讀，依 hw8.pdf、作業 Colab 與課程頁：先備影片、Chain-of-Thought／Beam Search／Self-Consistency／Self-Certainty／DeepConf 五個概念、Colab 的模型與取樣設定、三種方法的公式與實作差異（Borda 加權、top-k logprob 近似、confidence-weighted voting）、20 題測驗的出題範圍、評分與校外自學方式。"
draft: false
glossary:
  - term: "Self-Consistency"
    aliases: ["自我一致性", "majority voting"]
    definition: "對同一題 sample 多條推理，各自擷取最終答案，取出現最多次的答案。"
    context: "HW8 裡它是最基本的 test-time scaling 方法，不需要 logprob。"
  - term: "Self-Certainty"
    aliases: ["自我確信度"]
    definition: "用每個生成位置的完整 token 機率分布衡量模型有多確定，替每條推理打分，再依排名加權投票。"
    context: "HW8 Colab 只取 vLLM 回傳的前 50 個 logprob 近似完整詞彙表。"
  - term: "DeepConf"
    aliases: ["Deep Think with Confidence", "Confidence"]
    definition: "從 token 層級的信心值彙整出整條推理的信心，用來過濾低信心推理或做加權投票。"
    context: "HW8 直接呼叫官方 deepconf 套件的 DeepThinkLLM.deepthink()，以 offline 模式執行。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW8。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 17 篇。官方材料有：作業投影片 [hw8.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw8.pdf)、[作業 Colab](https://colab.research.google.com/drive/1_z4JryPWnITLAwtytVwu75FZMx9giT3R?usp=sharing)（34 個 cell），以及助教的[說明影片](https://youtu.be/KAbM5gM6Isw)。課程頁寫 5/15 公告、截止 2026/06/04 23:59（UTC+8），助教是江履方、陳品睿、尹廷安、林育正，成績在 2026/06/07 前公布。

存取分級是 **A3 減評分**：投影片裡印了全部 20 題的中英文版，Colab 可以公開下載執行。唯一拿不到的是 NTU COOL 上的測驗本身與成績。這份作業不走 JudgeBoi。

## 先備：2025 年第七講 Reasoning

hw8.pdf 第 3 頁要求先看[【生成式AI時代下的機器學習(2025)】第七講：DeepSeek-R1 這類大型語言模型是如何進行「深度思考」（Reasoning）的？](https://www.youtube.com/watch?v=bJFtcwLSNxI)。本學期沒有對應的新講。

本學期和它最接近的是 [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction) 與 [AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)。後者講的 certainty-based loss 用模型輸出分布的集中程度當訊號、拿來更新參數；HW8 的 Self-Certainty 與 DeepConf 用的是同一種訊號，只是拿來**挑答案**，參數完全不動。

## 任務：五個概念，三種方法

投影片的目標是：學幾種 test-time scaling 方法，在開源 LLM 上實作，觀察準確率的差異。建議先讀這幾篇建立全貌：

- [Chain-of-Thought](https://arxiv.org/abs/2201.11903)
- Beam Search（投影片只列名稱）
- [Self-Consistency](https://arxiv.org/abs/2203.11171)（ICLR 2023）：產生多個輸出，取多數決。
- [Self-Certainty](https://arxiv.org/abs/2502.18581)（NeurIPS 2025）：投票加上確信度。
- [Confidence／DeepConf](https://arxiv.org/abs/2508.15260)（ICLR 2026）：用推理的不同段落與 token 信心決定最終答案。

## Colab：已經寫好，你只要跑

notebook 開頭就說：程式已經完成，只要在 Colab T4 上跑，**請不要修改任何 cell**，把它當教學用。固定的設定是：

| 項目 | 設定 |
|---|---|
| 模型 | `unsloth/Llama-3.2-1B-Instruct`，用 vLLM 載入並包在 `deepconf` 的 `DeepThinkLLM` 裡 |
| 資料 | [GSM8K](https://huggingface.co/datasets/openai/gsm8k) test 的前 100 題 |
| 每種方法的取樣數 | 16 條推理 |
| 取樣參數 | temperature 0.7、top-p 0.95、最多 384 個新 token |
| 答案格式 | 要求模型寫 `\boxed{answer}`；擷取器也接受 GSM8K 的 `#### answer` 或最後一個數字 |

GSM8K 每題是一段文字應用題，標準解答最後以 `#### 10` 這種格式給答案。投影片的 Metric 頁說得很清楚：**答案對而且格式對**才算對。推理過程寫錯但最後數字碰巧對，或 `####` 寫成 `##!!`，結果會不一樣。

### 基準：直接推論

只產生一條推理、temperature 0，直接擷取答案。它是用來回答「test-time scaling 到底有沒有比單次生成好」的對照組。

### 方法一：Self-Consistency

sample N 條推理 y₁…y_N，各自擷取答案 a_i，取出現最多次的答案：

â = argmax_a Σ_i 𝟙[a_i = a]

這一種不需要 logprob，任何 API 都能做。

### 方法二：Self-Certainty

替每條推理 y_k 算一個分數，V 是詞彙表大小、n 是生成的 token 數：

Self-Certainty(y_k) = −(1 / nV) · Σ_i Σ_j log( V · p(j | x, y_{k,<i}) )

直覺是：分布越偏離均勻分布（越集中），分數越高。接著依分數排名，第 r 名的權重是 (N − r + 1)^p，用這個權重做 Borda 風格的加權投票。p = 0 就退化成一般多數決；Colab 設 p = 0.3。

實作上有一個近似要注意：完整詞彙表太吃 VRAM，Colab 只拿 vLLM 回傳的**前 50 個 logprob**，剩下的機率質量平均分給其他 token。

### 方法三：Confidence（DeepConf）

這個方法不手寫，直接呼叫官方 [deepconf](https://github.com/facebookresearch/deepconf) 套件的 `DeepThinkLLM.deepthink()`，以 offline 模式跑。notebook 的說明是：

- 每個位置先算 entropy H_{k,i}，再換成正規化的信心值 c_{k,i} = 1 − H_{k,i} / log K（K 是納入計算的 token 數）。熵越低，信心越高。
- 把一條推理的所有 c 彙整成整條的信心 C(y_k)，彙整方式有平均、tail、bottom-window 等變體。
- 做 confidence-weighted voting：每個答案累加支持它的推理的信心，取最大者。

Colab 依序優先採用 bottom-window、tail、mean 三種加權投票，再來是 top 10% 過濾版，最後才退回多數決。

最後 notebook 會印出一張準確率表（準確率、答對數、平均執行秒數、平均有效答案數），並畫準確率長條圖、對錯數量與每題執行時間分布。它提醒：多條取樣帶來的準確率，通常要用更多推論時間換。

## 測驗：20 題，全部在 NTU COOL

| 部分 | 題數 | 配分 |
|---|---|---|
| Part 1：論文閱讀 | 18 題 | 每題 0.5 |
| Part 2：Coding | 2 題 | 每題 0.5 |

總分 10 分。不用交程式；COOL 測驗沒有次數限制，取最高分；不收遲交。

論文題的範圍，照 hw8.pdf 印出的題目整理：

- **Self-Consistency**（Q1–Q3）：解題步驟的正確順序、哪些情境下效果受限、核心想法。
- **Self-Certainty**（Q4–Q6）：核心概念、實驗結論（包括為什麼要用 Borda voting 結合確信度排名與答案頻率）、和 AvgLogP／negative perplexity 的差別。
- **DeepConf**（Q7–Q9）：動機、Token／Average Trace／Bottom 10% Group／Tail／Lowest Group 等信心量測，以及 DeepConf-low／high 的 online thinking 與 early stop。
- **CoT 與比較題**（Q10–Q15）：CoT 和 Self-Consistency 的關係、CoT 何時沒幫助、實作評估的合理做法、一題手算多數決和信心加權投票、Best-of-N。
- **Beam Search**（Q16–Q18）：和 Self-Consistency 的差別、一題手算 beam size 2 的展開、在推理任務上的限制。

Part 2 的兩題就是：截圖 Colab 的準確率表（Q19），並依截圖回答哪個方法準確率最低（Q20）。

本文不提供答案。Q13 和 Q17 是手算題，讀完上面的公式就能自己算。

## 校外讀者拿不到的部分

- **NTU COOL**：測驗要台大帳號才能作答，看不到分數和官方解答。
- **說明影片**：YouTube 上沒有字幕，本文沒有依影片內容寫作。

其餘全都拿得到。**今晚就能做的事**：複製 Colab、開 T4 跑完，把四種方法的準確率和平均執行秒數抄下來，算出「每多 1 個百分點準確率要多花幾倍時間」；再拿 hw8.pdf 的 18 題論文題自我測驗，答不出來的就回頭翻那一篇論文。

## 想深入

- **論文**：DeepConf 的 [arXiv 論文](https://arxiv.org/abs/2508.15260)是 Q7–Q9 的出處，讀它的 confidence 量測定義最划算；Self-Certainty 的 [arXiv 論文](https://arxiv.org/abs/2502.18581)解釋為什麼用完整分布而不是只看被選中的 token。
- **自己改**：作業要求不改 notebook，但作業之外可以把 `N_SAMPLES` 與各方法的 budget 從 16 調成 4、8、32，畫出準確率對取樣數的曲線，看哪個方法最早飽和。
- **延伸閱讀**：[CME295 LLM Reasoning 導讀](/posts/ai/2026-09-29-cme295-llm-reasoning)整理了 reasoning 模型與推論時運算；站上的 [BrowseConf](/posts/ai/2026-09-19-browseconf-test-time-scaling) 把信心驅動的 test-time scaling 用在 browsing agent 上；RL 的基礎可看 [Berkeley CS285 policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW7：Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging)｜下一篇 [AI 自我成長（下）：改進 harness 與學會學習](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)

## 參考資料

- [Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW8 公告日、截止時間、助教
- [ML 2026 Spring HW8 Test-Time Scaling（hw8.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw8.pdf) — 先備、任務、配分、20 題中英文版
- [HW8 Colab](https://colab.research.google.com/drive/1_z4JryPWnITLAwtytVwu75FZMx9giT3R?usp=sharing) — 模型、取樣設定、三種方法的公式與實作
- [HW8 說明影片（YouTube）](https://youtu.be/KAbM5gM6Isw)
- [先備：【生成式AI時代下的機器學習(2025)】第七講 Reasoning](https://www.youtube.com/watch?v=bJFtcwLSNxI)
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models（arXiv 2201.11903）](https://arxiv.org/abs/2201.11903)
- [Self-Consistency Improves Chain of Thought Reasoning in Language Models（arXiv 2203.11171）](https://arxiv.org/abs/2203.11171)
- [Scalable Best-of-N Selection for Large Language Models via Self-Certainty（arXiv 2502.18581）](https://arxiv.org/abs/2502.18581)
- [Deep Think with Confidence（arXiv 2508.15260）](https://arxiv.org/abs/2508.15260)
- [facebookresearch/deepconf（GitHub）](https://github.com/facebookresearch/deepconf)
- [openai/gsm8k（Hugging Face）](https://huggingface.co/datasets/openai/gsm8k)
