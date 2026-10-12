---
title: "程式生成與 Agent：測試回饋如何形成可靠迴圈｜CMU 10-423 第 23 堂"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 31
description: "能執行測試修復迴圈並計算pass@k與區分交付成功"
draft: false
---

> [English version](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 23 堂公開投影片整理；算例與變式是本站教學補充。

模型寫出一段看似合理的Python，不代表程式正確；程式通過一題測試，也不代表agent完成整個repo的修復。第23堂從程式生成延伸到LLM／VLM agent，核心轉折是把輸出接到環境：執行工具、讀回結果、修改，再決定繼續或停止。

先備是[抽樣與解碼](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)與[推理的候選驗證](/posts/ai/2026-09-30-cmu10423-reasoning-models)。這裡使用本站自擬小任務，避免把原作業答案或公開benchmark解答當練習。

## 程式「像對」與「會對」分開

自然語言可以接受多種說法，程式則必須在指定輸入與環境滿足行為。字串相似度不能代替執行：兩段很不同的程式可以等價；一個符號差異也可能讓邊界條件失敗。HumanEval以函式任務與測試檢查functional correctness，仍受測試覆蓋與執行設定限制。

自擬任務是 `clamp(x,lo,hi)`，假設lo≤hi，要求小於lo回lo、大於hi回hi，其餘保留x。模型第一次寫 `return min(x,hi)`。對x=3,lo=0,hi=5通過，x=8也回5，但x=−2回−2，違反下界。這不是語法錯誤，而是規格漏了一半。

加入下界測試後，修改為 `return max(lo,min(x,hi))`：−2→0、3→3、8→5；邊界0→0、5→5。再加入lo=hi=2，任何x都回2。每個測試有具體預期值，才能知道修復對哪個條件有效。

## pass@k 算的是候選集合機會

同一題抽n份程式，其中c份通過測試。從n份中不放回選k份，全部錯誤的比例是 `C(n−c,k)/C(n,k)`，因此估計 `pass@k=1−C(n−c,k)/C(n,k)`，前提n≥k。若錯誤數少於k，分子是0，候選集合至少含一份正確程式。

本文自擬n=5、c=2：pass@1=2/5=.4；pass@2=`1−C(3,2)/C(5,2)=1−3/10=.7`；pass@3=`1−1/10=.9`。這是從已抽候選估計的至少一份通過機率，不能用小樣本比例推導每次生成都獨立，或聲稱產品使用者有90%完成率。

尤其「有一份正確」不等於「系統選到那份」。沒有測試或可靠selector，agent可能交付另外三份錯的。增加k也會增加生成與驗證成本；要報告預算與選擇規則。變式n=4、c=1、k=2，答案 `1−C(3,2)/C(4,2)=.5`，不是把pass@1=.25乘兩次就當成功率。

## 把生成放進可停止的工具迴圈

自擬agent先讀規格與檔案，提出最小修改，執行測試，取得下界失敗，修正函式，再跑相關測試。工具回應是下一步的觀測，不是可任意改寫的成功證明。若測試命令exit0卻沒有收集到測試，不能當綠燈；若環境缺dependency，要報環境阻塞，不能把它解讀成函式錯誤。

迴圈需要停止條件：相關測試通過且結果可追溯就交付；連續同錯且沒有新證據就停下定位；超過預算或需要不可取得資訊就回報未完成。無限「再試一次」不叫自主完成。每次記錄修改內容、測試命令、返回結果與最後檔案，才能核對交付物。

SWE-bench把任務拉到真實repository issue，需要環境、跨檔理解與測試；它與單函式HumanEval的難度、資料污染風險及評分都不同。ReAct式thought/action/observation描述工具互動結構，不能靠輸出一段「我已測試」敘述取代真正工具結果。

## Agent 還有程式正確性之外的界線

工具能力要按任務授權：修本地函式不等於可寄信、刪資料或更動production。外部文件／錯誤訊息可能含prompt injection，觀測內容不能替agent提升權限。VLM操作介面也要檢查當前畫面與實際動作結果，不能只靠預想的UI位置。

最後變式：agent修好下界後自行加`if lo>hi: swap`，算完成嗎？原規格只保證lo≤hi，新增行為是範圍選擇，應明示而非當成必要修復。若所有自擬測試通過但沒測NaN或型別，能說所有Python輸入都正確嗎？不能。程式、候選選擇、工具流程與授權各有驗收，纔不會把一次benchmark成功擴張成產品可靠性。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 23 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf)
- [HumanEval / pass@k](https://arxiv.org/abs/2107.03374)
- [SWE-bench](https://arxiv.org/abs/2310.06770)
- [ReAct](https://arxiv.org/abs/2210.03629)
