---
title: "開放式演化：指定閱讀導讀｜Stanford CS329A 第 7 堂"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 7
description: "依 CS329A 第7堂指定閱讀比較 DGM、AI Scientist 與 AlphaEvolve，走完 archive 分支與保留測試例子。"
tldr: "開放式演化改的是 agent 程式與流程；archive 保留不同分支，保留測試再檢查泛化。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cs329a-session-07-open-ended-evolution-readings-en)

當 agent 已經能寫程式，下一個問題是：它能不能修改自己的工具與解題流程，而不是每次只換答案？這篇讀 [CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 7 堂的指定閱讀，教你區分「候選答案變多」與「解題系統本身改變」，並設計一個不會只獎勵當下分數的搜尋流程。先備是知道 agent 會呼叫工具、測試會回傳結果；不必先懂演化演算法。

先讀[第 6 堂：權重更新](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl)，可把本篇的流程改動與模型訓練分開。

**影片狀態：官方課表未列錄影。** 2026-10-11 檢查的公開九支影片 inventory 未找到本堂對應影片；這不代表沒有錄影。本文依論文重寫，沒有還原講者口述。

## 先分清楚：到底在改什麼

[Darwin Gödel Machine（DGM）](https://arxiv.org/abs/2505.22954)讓 coding agent 修改自己的程式，再用程式設計任務檢驗新版本。改動可以是讀檔介面、修改工具或解題流程；基礎語言模型權重並不是這個自我改進步驟的對象。它保留多個歷史 agent，從 archive 選父代，而不是永遠只從當前最高分版本繼續改。

課表有一個會影響閱讀的來源衝突：這筆閱讀寫「Automated design of agentic systems」，連結卻指向 DGM。[同名 ADAS 論文](https://arxiv.org/abs/2408.08435)是另一篇，核心是 meta agent 產生 agent 程式、評估並存入 archive。本篇以課表實際連結的 DGM 為底本；不能把兩篇當成同一個實驗。

## 為什麼不只保留冠軍

固定挑最高分，相當於假設每個有用的下一步，都會先讓目前指標變好。但新增工具可能暫時增加成本，或先解決原先不擅長的任務，再與另一個改動結合。Archive 保存這些不同路線，讓未來仍有機會從它們分支。保留多樣性不是取消評估：每個候選仍要能執行、接受測試，失敗結果也要留下，才能分辨新能力與換個名字的舊流程。

這也不等於數學上證明每次改動都更好。DGM 用經驗評估替代難以取得的普遍改進證明；測試分布以外的可靠性仍需另外查。

## 一個完整的搜尋例子

以下是本文自擬例子，不是論文數據。你有 10 題驗證任務與獨立的 10 題保留測試。Agent A 解對 6 題，會讀檔和修改程式；B 加上失敗測試的分類工具，驗證只對 5 題；C 擴大重試次數，驗證對 7 題。

若每輪只留冠軍，下一輪只剩 C。若 archive 留下 A、B、C，則可以從 B 改出 D：先分類失敗，再只針對該類錯誤重試。假設 D 驗證對 8 題，並在從未用來挑選版本的保留測試對 7 題，就有初步證據支持這條分支。關鍵推理不是「B 比 A 差所以有用」，而是 B 提供不同的可組合機制，之後 D 的表現才讓這個假設得到支持。

若 C 的 7 題只是反覆看到同一批題後硬編答案，保留測試會揭露這件事。搜尋用驗證集挑版本，最後只用保留測試評估；把兩者合併，會把記住驗證題誤認成進步。

## 另兩篇把迴圈放在哪裡

[The AI Scientist](https://arxiv.org/abs/2408.06292)把提案、實驗、寫作與模型審稿串起來，並利用既有想法產生新研究。它的產出是研究候選與報告；能生成一篇看似完整的論文，不等於實驗可重現或結論成立。

[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)讓語言模型提出程式變體，再由自動 evaluator 檢查與評分，將有用程式存入演化資料庫。它特別適合能明確驗證正確性與效能的問題。三篇共同的結構是「產生、執行評估、保存、再產生」，不同的是搜尋物件：agent、本次研究，或演算法程式。不要把三種物件都叫模型自己變聰明。

## 變式檢查與答案

現在 D 在驗證集對 9 題，保留測試卻只對 4 題；B 在兩組都對 5 題。你應宣布 D 已全面改進嗎？**答案：不能。** 驗證與保留表現落差支持過度貼合的疑慮；先檢查資料洩漏、題型分布與測試數量，並以新保留題重驗。也不能因這次結果就斷言 archive 無效：失敗的是這個候選的泛化證據。

常見誤解是把「開放式」理解成不設停止條件。今晚可做的動作是：替自己的 agent 留一份版本 archive，固定記錄程式差異、驗證表現、工具成本與失敗類型，設定搜尋預算，並保留一批不回饋給搜尋器的題目。這樣才知道下一輪是在探索新路線，還是在重複調同一個分數。

## 英文閱讀與表達

以下為本文自擬表達，沒有原音跟讀：*We improve the agent's workflow, not the base model's weights.*（我們改進 agent 流程，沒有更新基礎模型權重。）*An archive preserves alternative paths for future search.*（Archive 為後續搜尋保留不同路線。）試用兩句說明為什麼 B 不必立刻刪掉。


## 參考資料

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [Darwin Gödel Machine, linked from the schedule](https://arxiv.org/abs/2505.22954)
- [ADAS, a distinct paper matching the schedule label](https://arxiv.org/abs/2408.08435)
- [The AI Scientist](https://arxiv.org/abs/2408.06292)
- [AlphaEvolve official explanation](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
