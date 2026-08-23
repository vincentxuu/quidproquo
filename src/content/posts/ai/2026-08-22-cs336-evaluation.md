---
title: "CS336 Lecture 12：沒有一個真正的 LLM 評分，只有規則不同的遊戲"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm-evaluation, benchmark, agents, safety]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 13
tldr: "第十二講從 perplexity 走到考試、聊天偏好、agent、推理與安全評測；每次換 benchmark 都同時換了能力定義、scaffold、judge 與污染風險，因此評分前必須先說清楚到底在比較 method、model 還是完整 system。"
description: "Stanford CS336 Spring 2026 Lecture 12 導讀：perplexity、exam/chat/agent benchmarks、reasoning、安全、realism、validity、contamination 與評測契約。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-evaluation-en)

本篇對應 **CS336 Spring 2026 Lecture 12: Evaluation**，2026 年 5 月 6 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_12.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py)。

課程在談資料以前先談 evaluation，因為資料會把模型推向你量測的行為。這一講最重要的句子是：沒有唯一正確的 evaluation。你必須先說規則、對象與使用情境，再選 metric。

## Perplexity 平滑，但不等於有用

語言模型是 token sequence 的機率分布；perplexity 衡量模型對資料集配置的平均機率。它連續、便宜，能畫出平滑 scaling curve，也適合 pretraining 開發。

但它對每個 token 都計分，包括和實際任務無關的字詞。不同 tokenizer 的 perplexity 也不能直接比較。Conditional perplexity 只評 response given prompt，較接近 completion；真正產品仍常需要 accuracy、reward 或人類偏好。

## Exam benchmark 控制清楚，也容易飽和

MMLU、GPQA 類題目有明確答案，能控制 subject 與 difficulty，grading 便宜。模型進步後，benchmark 會用更難題目、更多選項或 expert-written questions 延長壽命。

代價是 realism：使用者通常不會用 multiple-choice 考助理。分數也受 prompt format、chain of thought、few-shot examples 與 answer extraction 影響；報模型名稱而不報 evaluation protocol，結果無法重現。

## Chat evaluation 把偏好帶進來

Chatbot Arena 類平台讓使用者盲選兩個 responses，再以 pairwise model 擬合排名。它收集真實 prompts，也能持續加入新模型；但使用者組成、spam、style preference 與 correctness 判斷都難控制。

LLM-as-judge 能擴大規模，卻會偏好較長、較像 judge 自己的答案。Pairwise comparison 通常比絕對分數穩定，rubric/checklist 也能改善一致性，但不能讓 judge 自動擁有它不知道的領域真相。

## Agent benchmark 評的是 model 加 scaffold

SWE-bench、Terminal-Bench 與 Kaggle 類任務把模型放進 terminal 或 codebase，以 tests 或環境結果評分。此時 planning、tool use、memory、context management 與 retry policy 都屬於被測系統。

換 agent scaffold 即使 model 不變，分數也可能大幅變化。因此結果必須標示 model、tools、budget、environment、scaffold version 與成功判定。只寫「某模型在 SWE-bench 幾分」會把 system capability 誤寫成裸模型能力。

## Reasoning 與 safety 各有自己的陷阱

ARC-AGI 類任務試圖降低知識記憶的影響，測試可由人完成的新規則推理；但「純推理」仍難和介面、search procedure 及 test-time compute 分開。

Safety benchmark 則從 harmful behaviors、政策或法規建立 prompts，也會測 jailbreak。安全高度依情境與文化而變，單一 refusal rate 可能同時獎勵過度拒答。必須同時測 harmful compliance 與 benign utility。

## Realism、difficulty、validity 要分開

困難題不一定真實，真實 prompt 不一定有可靠 ground truth。Validity 又問 metric 是否真的測到宣稱的 construct。職業任務與臨床工作流提高 realism，卻需要專家 annotation、隱私處理與更昂貴 grading。

Benchmark contamination 讓三者更難判斷。模型可能在 pretraining 看過題目或答案，而 providers 又不公開資料。可使用持續更新題目、私有資料、個人文件或 train-test overlap analysis，但 timestamp 也可能因網頁轉載失效。

## 寫一份 evaluation contract

先定義 evaluation unit：方法、checkpoint，或 model+agent system。再寫 task distribution、prompt template、tools、token/time budget、metric、judge、failure policy 與 contamination control。最後同時報 central tendency、variance、cost 與常見 failure modes。

第十二講不是叫你多跑幾個排行榜，而是要求每個分數回答一個清楚的問題。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義。本文依其 perplexity、exam、chat、agent、reasoning、安全與 validity 主線整理。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 12 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py)
- [SWE-bench](https://www.swebench.com/)
- [HELM](https://crfm.stanford.edu/helm/)

