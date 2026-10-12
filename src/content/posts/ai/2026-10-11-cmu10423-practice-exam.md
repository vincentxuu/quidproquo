---
title: "練習考卷：用錯誤定位觀念缺口｜CMU 10-423 主題單元"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 37
description: "用公開練習卷區分機率、資料流與評估錯誤，走完序列機率例子，再以變式題驗收。"
tldr: "用公開練習卷區分機率、資料流與評估錯誤，走完序列機率例子，再以變式題驗收。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-practice-exam-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

答對選擇題，可能只是記得關鍵詞。真正的檢查是：換掉題目的數字或條件，你還能說明為什麼嗎？這篇用 [CMU 10-423 Spring 2026 練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)建立一套「先回答、再找錯因、最後做變式」的複習方式。它不是正式考試範圍公告，也不提供未公開考卷。

先備是能讀基本機率與矩陣形狀。若這兩者還不熟，先回到 [RNN 與機率鏈](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)和 [causal attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)。讀完應能把「算錯」分成模型假設、資料流、代數與評估四類，為每個錯誤指定下一個練習。

## 練習卷能驗什麼

官方練習卷分成十三個主題，從 autodiff／RNN、Transformer 與解碼，到影像模型、調適、多模態、Prompt-to-Prompt 與 scaling laws。這是公開材料的覆蓋範圍；不能據此推論正式考試不考其他主題。後段的分散式、長上下文、agent、影音與世界模型，請用各篇的獨立檢查題驗收。

分數也不是唯一訊號。你若在 DPO 題選對「偏好資料」，卻說不出 reference policy 的角色，觀念仍有缺口。做題時在答案旁寫一句理由，再標信心；對答案後，優先處理「高信心但錯」的題目，因為那通常是錯誤規則，而非單純忘記。

## 走完一個機率例子

練習卷第 1.1 題檢查語言模型為什麼用機率鏈式法則。以下是本文自擬變式，不是原卷的完整題目或官方解答。

固定三個 token A、B、C，令 P(A)=0.5、P(B|A)=0.4、P(C|A,B)=0.25。整段序列的機率是 0.5×0.4×0.25=0.05。若模型用自然對數的負 log-likelihood，整段 loss 是 −log(0.05)，約為 2.996；平均每 token 約為 0.999。

為什麼不能改算 P(A)P(B)P(C)？後者額外假定 token 互相獨立；鏈式法則本身不需要這個假設。訓練時 teacher forcing 讓模型見到正確歷史，生成時歷史會包含模型先前的輸出，兩者的條件來源不同，但分解形式仍相同。

若你得到 0.05，卻稱它「下個 token 的機率」，錯在對象：它是這一條完整序列的聯合機率。若你得到負的 loss，錯在符號。若你把三個條件機率相加，錯在機率分解。這三種錯誤要用不同的題目修。

## 把錯誤轉成可重做的任務

做完一個主題，建立四欄筆記：原本答案、正確理由、錯誤類型、下一個變式。別只抄正解。矩陣形狀錯，就拿更小的 tensor 追一次；條件分布錯，就畫資料流；公式算錯，保留固定輸入手算與程式雙重核對；指標誤解，先問指標的分母和測試集合。

例如 attention 的輸出 shape 正確，還不能證明沒有看未來。下一個任務應是把未來 token 改掉，確認之前位置的輸出不變。這個檢查直接對準因果遮罩，而不是再背一次 Q、K、V。

## 自我檢查：改一個條件

沿用上例，只把 P(C|A,B)改為0.5。整段機率與整段 NLL 怎麼變？這能證明模型對其他序列也更好了嗎？

<details>
<summary>答案與判準</summary>

聯合機率變成0.1，NLL約2.303，比原本少log(2)，約0.693。只能說這条指定序列被賦予更高機率；不能推出整個測試集的平均loss下降。模型對每個條件下的候選token仍要正規化，因此提高一個候選的機率可能降低其他候選。

</details>

今晚先做一個主題，再做一個自擬變式。能在不看答案時解釋差異，才算完成該觀念的複習。最後才打開 [官方解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)校對；對於文字歧義，保留原題與疑問，不把本站解讀寫成課程最終判定。

這個流程不能替代正式評分。它能提供的是自己可重做的學習證據。要再往前走，接 [論文報告](/posts/ai/2026-10-11-cmu10423-hw623-paper-report)，把「答案正確」提升成「主張有證據」。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開文字教材整理，沒有重建未取得的課堂口述或提供原音逐字稿。

- [官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## 參考資料

- [Practice questions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Official practice solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
