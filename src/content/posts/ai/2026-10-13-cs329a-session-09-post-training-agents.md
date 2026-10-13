---
title: "Post-training 從聊天走到 Agent：公開材料導讀｜Stanford CS329A 第 9 堂"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 9
description: "對照 Gemini 1.0 與 Gemini 2.5 技術報告的 post-training 章節，看獎勵訊號如何從單則回覆的人類偏好，換成多步工具任務的可驗證結果。"
tldr: "聊天模型的獎勵看單則回覆像不像人喜歡的答案；Agent 的獎勵要看多步操作後任務有沒有真的完成，兩者需要的資料與環境不同。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-13-cs329a-session-09-post-training-agents-en)

預訓練完的模型會接話，但不會自動變成好用的助理，更不會自動變成能連續操作工具的 Agent。中間那段加工叫 post-training。[CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 9 堂是 Google DeepMind 的 Melvin Johnson 客座，題目是「Evolution of Post-training from Chatbots to Agents」。讀完本文，你應能說出聊天時代與 Agent 時代的 post-training 各用什麼訊號當獎勵，並判斷一個任務該用哪一種。先備是知道監督式微調與強化學習（RL）的差別。

先讀[第 6 堂：訓練時改進](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl)，那一堂教回饋怎麼寫回權重；本文談的是業界模型實際用哪些回饋。

**影片狀態：這一場沒有公開錄影或投影片。** 2026-10-13 查過 Stanford Online 播放清單、官方課表與其修改歷史、兩位授課老師的頻道，以及講者的個人網站，都沒有這一場的材料。也沒有找到講者本人談這個題目的公開演講。本文改用題目類似的公開材料：兩份 Gemini 官方技術報告的 post-training 章節。講者列名於 Gemini 2.5 報告的貢獻者名單。文中的對照與例子是本文的整理，不代表該場實際講了什麼。

## 聊天時代：獎勵來自人對單則回覆的偏好

[Gemini 1.0 技術報告](https://arxiv.org/abs/2312.11805)第 6.3 節把 post-training 寫成四個階段。先蒐集能代表真實用途的 prompt。再做監督式微調（SFT），讓模型模仿「這個 prompt 應該怎麼答」的示範。接著對同一個 prompt 收集多個候選回覆，請人比較，用這些比較資料訓練一個獎勵模型（reward model，RM）。最後用 RM 當評分者，做 RLHF（從人類回饋做強化學習）。

這個流程的評分單位是一則回覆。RM 學的是「人比較喜歡哪一則」，所以它擅長語氣、完整度、是否拒答過頭這類一眼看得出來的品質。報告也描述了一個循環：RL 會把模型推到 RM 沒看過的地方，RM 再靠新的評估與資料修正。

## Agent 時代：獎勵要看多步之後的結果

[Gemini 2.5 技術報告](https://arxiv.org/abs/2507.06261)第 2.4 節列出這段期間的改變。分配給 RL 的訓練計算量增加。獎勵來源強調兩類：可驗證的獎勵（verifiable rewards），以及由模型產生的獎勵（model-based generative rewards）。RL 演算法調整後，長時間訓練更穩定。報告說這些改變讓模型能從更多樣、更複雜的 RL 環境學習，包括需要多步動作與工具使用的環境。

同一份報告的其他章節補上了三個細節。Thinking 是用 RL 訓練出來的，模型學會在回答前多花推論計算，使用者可以設定 thinking budget，在表現與成本之間取捨。程式能力的部分，post-training 階段整理了一批工程任務；報告列出 SWE-bench Verified 從 Gemini 1.5 Pro 的 34.2% 升到 Gemini 2.5 Pro 的 67.2%，兩個數字都是報告所稱的多次嘗試設定：取樣多條 Agent 軌跡，由模型挑出一條再送去評分。安全訓練則用「RL\*F」：獎勵由兩個來源合成，一個是用人類偏好資料訓練出來的 Data Reward Model，另一個是 Critic，一個靠提示運作、依照事先寫好的評分規準打分的模型。

把兩份報告放在一起看：

| | 聊天時代（Gemini 1.0 報告） | Agent 時代（Gemini 2.5 報告） |
|---|---|---|
| 評分單位 | 一則回覆 | 一整段多步軌跡 |
| 獎勵來源 | 人類偏好訓練出的 RM | 可驗證結果、模型評分、人類偏好並用 |
| 訓練場景 | prompt 資料集 | 含工具與多步動作的 RL 環境 |

這張表是本文的整理，不是報告裡的原表。兩份報告都沒有公開環境數量、獎勵權重這類細節，所以它只能說明方向，不能拿來重現訓練流程。

## 一個完整例子：退款 Agent

以下是本文自擬的教學例子，數字不是報告結果。一個客服 Agent 要處理退款：查訂單、查付款紀錄、確認退款資格、呼叫退款 API、更新訂單狀態、寄確認信，共六次工具呼叫。假設每一步單獨做對的機率是 0.9，而且各步獨立，整個任務成功的機率是 0.9⁶ ≈ 0.53。

用聊天時代的方式評分，會請人看最後那則「已為您完成退款」的訊息。訊息寫得禮貌完整，偏好分數很高，但約 47% 的情況這六步並沒有全部做對；Agent 沒發現中間某一步失敗時，照樣會寫出這則訊息。用可驗證獎勵評分，要查的是資料庫裡這筆訂單的狀態有沒有變成已退款、金額對不對。這個檢查不看文字，只看環境的最終狀態。

兩種訊號都還是需要。資料庫檢查不會告訴你確認信有沒有把退款時程講清楚，那仍然要靠評分規準或人的判斷。

## 變式檢查與答案

把任務換成「幫使用者寫一封婉拒面試邀請的信」。這個任務只有一步，沒有工具，也沒有可以查的環境狀態。該用哪一種獎勵？**答案：人類偏好或依評分規準打分的模型。** 沒有可驗證的結果時，硬找一個自動檢查（例如信裡有沒有出現「謝謝」）只會讓模型學會湊關鍵字。

再換成「把這個 repo 的失敗測試修好」。**答案：可驗證獎勵優先。** 測試通過與否可以直接執行檢查；但還要另外檢查模型有沒有靠刪掉測試或寫死答案過關，這正是[第 4 堂](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback)談的執行回饋會被鑽漏洞的情況。

常見誤解是把「benchmark 分數上升」當成「post-training 方法有效」的證明。報告裡的分數同時受預訓練資料、模型大小與推論設定影響，不能歸因給單一階段。今晚可以做的事：挑一個你想自動化的任務，寫下它完成後環境裡哪個狀態會改變；寫不出來的，就先歸到需要人判斷的那一類。

## 英文閱讀與表達

本文自擬句：*A preference score rates one response; a verifiable reward checks the final state of the environment.*（偏好分數評一則回覆，可驗證獎勵檢查環境的最終狀態。）*Polite wording does not prove the refund went through.*（措辭禮貌不代表退款成功。）練習用兩句說明修測試任務該檢查什麼；這是閱讀／表達練習，沒有原音跟讀。

## 參考資料

- [CS329A Autumn 2025 官方課表](https://cs329a.stanford.edu/)
- [Gemini: A Family of Highly Capable Multimodal Models（Gemini 1.0 技術報告，第 6.3 節）](https://arxiv.org/abs/2312.11805)
- [Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities（第 2.4、2.5、2.6、5.3 節）](https://arxiv.org/abs/2507.06261)
