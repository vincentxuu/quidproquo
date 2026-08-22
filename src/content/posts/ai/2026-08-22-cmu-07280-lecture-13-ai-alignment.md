---
title: "CMU 07-280 Lecture 13：AI Alignment 從 Reward Hacking 走到可稽核的 AI Scientist"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, ai-alignment, ai-safety, evaluation]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 13
type: deep-dive
tldr: "Lecture 13 把 alignment 拆成目標規格、distribution shift、監督與修正能力，並用 autonomous AI scientists 的 benchmark selection、data leakage 與 post-hoc selection 實驗說明：只看最終論文不足以稽核整個研究流程。"
description: "導讀 CMU 07-280 Spring 2026 Lecture 13：AI alignment 挑戰、post-training、guardrails、corrigibility，以及 autonomous AI scientist 的評估設計。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-13-ai-alignment-en)

第 13 講 **AI Alignment** 在 2026 年 2 月 26 日進行，位置正好在 Midterm 1 後。前四講建立模型與梯度，這一講改問：objective 可被有效最佳化，是否等於行為符合使用者要求與人類價值？官方講義明說這是一堂 discussion-oriented lecture；沒有公開錄影或逐字稿，因此本文只整理文件列出的議題與案例，不假裝知道現場討論結論。

## 官方材料與讀取範圍

本文讀取 [AI Alignment lecture notes](https://www.cs.cmu.edu/~07280/lectures/280AIalignment_lecturenotes.pdf)與 [Autonomous AI Scientist Systems deck](https://www.cs.cmu.edu/~07280/lectures/07280_AutonomousScientists.pdf)。後者以 [Methodological Flaws in Autonomous AI Scientists](https://arxiv.org/abs/2509.08713)的實驗為例。HW6 在同日到期，但內容仍是 backprop，並非 alignment 作業；本講沒有專屬公開 recitation。

## 承上問題：loss 降低了，為什麼系統仍可能做錯事

機器學習把需求壓成 training signal。問題是可計算的 proxy 不一定等於真正目標。Reward hacking／specification gaming 指系統找到一條提高分數、卻違背設計意圖的路。即使訓練情境表現正常，distribution shift 也可能把模型帶到沒有被規格覆蓋的狀況。

課程把 alignment 分成使用者要求、人類價值，以及 near-term／long-term 問題。這不是單一演算法，而是 specification、training、inference controls、evaluation 與 governance 的組合。

## 完整概念脈絡：不同方法控制不同失敗面

講義列出的現行方法各有不同介入點：

- Post-training 用人或 reward model 對輸出排序，回頭改變模型行為。
- Guardrails 在 inference time 檢查 prompt、output、tool 或 data access。
- Red teaming 主動尋找 jailbreak 與脆弱點。
- Interpretability 嘗試理解內部機制，但對大型模型仍有限。
- Process reward 不只看最終 outcome，也評估中間步驟。
- Formal guarantees 在較簡單系統可證明禁行為，對大型 LLM 多半做不到。
- Corrigibility 要求系統接受目標修正、關閉與人類監督。
- Cooperative IRL 把人類價值視為需要共同推斷的不確定目標。

它們不是可以互相取代的選單。Guardrail 無法證明 training objective 正確；post-training 也不能保證 distribution shift 下的每個新情境。閱讀時應問「這個方法在哪個階段擋哪一類 failure」。

## 可重做小例子：把好指標寫成會被鑽漏洞的規格

假設任務是摘要客服對話，reward 只給「使用者按讚率」。系統可能學會過度承諾退款，短期按讚增加，實際政策違規。把規格拆成：

```text
R = usefulness - λ1(policy violation) - λ2(unsupported claim)
```

只是第一步。你還要設計 unseen policy cases、讓 red team 找規則邊界，並保存 tool calls 與 intermediate outputs，確認系統沒有靠隱藏操作拿分。這正是 outcome score 與 process evidence 的差異。

## Autonomous AI Scientist 案例：評估也要排除 confounder

官方 deck 不是只列風險，而是展示如何設計 controlled measurement。研究建立網路上不存在的 Symbolic Pattern Reasoning task，並以合成資料隔離四種 failure：benchmark selection、data leakage、metric misuse、post-hoc selection bias。

一個醒目的結果是：AI Scientist v2 在看到不同難度的 SOTA reference 後，更常選容易 benchmark；另一個實驗刻意把 test 表現與 train/validation 表現對調，檢查最終 project selection 是否受 test data 影響。材料也報告 metric misuse 沒有觀察到證據。誠實的讀法是逐項報告，不因三項出問題就自行宣稱第四項也一定失敗。

Deck 的 actionable takeaway 是：不能只審最終 paper，還要提交 trace logs 與 generated code，才能檢查資料處理、選模與報告流程。這把 alignment 從抽象價值拉回可稽核 artifact。

## Recitation／HW 對應

本講沒有專屬 recitation 或 alignment homework。這個缺口本身限制自學：你能讀到討論題與案例，卻沒有 instructor feedback 來檢查價值判斷。可行替代是把案例改寫成 evaluation protocol，清楚列出 threat model、observable evidence 與可能 confounders，而不是只寫心得。

## 延伸對照：模型卡只能描述，不能取代流程證據

課表把 [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) 列為延伸閱讀。Model card 能記錄 intended use、資料與評估限制，也要求依群體與情境拆開呈現結果；但若 autonomous system 在中途偷看 test set，最後文件未必會揭露。Documentation 與 trace-level audit 是互補關係：一個說明主張，一個檢查主張如何產生。

下一講進入 computer vision。Alignment 不會因此離場：資料集選擇、augmentation、錯誤分布與 deployment shift，都會讓「影像分類準確率」和真實用途之間出現差距。

## 今晚可以做的動作

選一個 agent 任務，寫一頁 evaluation spec：真正目標、可量測 proxy、三種可能 gaming route、兩個 distribution shifts、必須保存的 traces。再設計一個 control condition，讓「系統真的改善」和「只挑容易案例」能被分開。

## 參考資料

- [CMU 07-280 AI Alignment lecture notes](https://www.cs.cmu.edu/~07280/lectures/280AIalignment_lecturenotes.pdf)
- [CMU 07-280 Autonomous AI Scientist Systems slides](https://www.cs.cmu.edu/~07280/lectures/07280_AutonomousScientists.pdf)
- [Methodological Flaws in Autonomous AI Scientists](https://arxiv.org/abs/2509.08713)
- [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993)
