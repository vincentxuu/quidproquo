---
title: "軟體工程 agent：指定閱讀導讀｜Stanford CS329A 第 13 堂"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 9
description: "依 CodeMonkeys、KernelBench 與平行程式介面研究，教候選測試、正確性閘門與效能選擇。"
tldr: "多個程式候選仍需需求反例來挑選；先通過正確性檢查，速度提升才有意義。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cs329a-session-13-software-engineering-readings-en)

程式碼能跑，還不代表解對問題；跑得比較快，也可能只是漏做工作。[CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 13 堂把 issue 修復與 GPU 程式最佳化放在一起，讓你學會分開驗證「正確」與「快」。本文依指定論文重寫，沒有還原授課口述。先備是會讀測試結果，知道 GPU kernel 是在 GPU 執行的運算程式；不需要先會手寫 kernel。

先用[第 4 堂：工具與程式碼回饋](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback)補上執行結果如何回到 agent 的基礎。

**影片狀態：官方課表未列錄影。** 2026-10-11 檢查的公開九支影片 inventory 未找到本堂對應影片；不能據此推論不存在錄影。

## CodeMonkeys：多產生還要能挑

[CodeMonkeys](https://arxiv.org/abs/2501.14723)先找與 issue 有關的檔案，再平行產生多條修改軌跡。每條軌跡同時寫修改與測試，執行回饋用來修正候選；最後以生成測試與模型選擇決定交付哪個 patch。增加候選數提升「至少有一個解對」的機會，但選擇器仍可能把它丟掉，因此 coverage 不等於最終解題率。

生成測試特別容易與生成修改共享盲點。若題目要求處理空輸入，而所有測試都只含非空輸入，通過更多生成測試依然不能證明符合需求。你要把 issue 的約束轉成獨立檢查，而不是讓候選替自己定義成功。

## 一個可以手算的選擇例子

以下是本文自擬例子，不是官方實驗。Issue 要求排序函式保留重複值，空串列回傳空串列。候選 A 用集合去重後排序；B 直接排序；C 對空串列回傳 null。第一批生成測試只測 `[3,1]`，三者都回傳 `[1,3]`，得分相同。

加入 `[2,2,1]` 後，A 回傳 `[1,2]`，少了一個 2；B、C 回傳 `[1,2,2]`。再加入 `[]`，C 回傳 null，只有 B 回傳 `[]`。推理結果是 B 符合這兩項明確約束，A 與 C 各被一個反例淘汰。這不證明 B 對所有型別都正確；它證明這次選擇使用了與需求對應的可區分測試。

如果你先選 A，再請同一個模型解釋 A 為何合理，得到的可能只是事後辯護。先訂判準，再讓候選競爭，才會讓搜尋預算花在不同解法，而不是不同說法。

## KernelBench：速度必須放在正確性後面

[KernelBench](https://arxiv.org/abs/2502.10517)將參考的 PyTorch 運算交給模型生成 GPU kernel，檢查輸出正確性並量測效能。常見技巧如融合運算可減少中間張量與記憶體搬運，但形狀、數值誤差、裝置同步與測量方法都會影響結論。不能拿生成程式的短小程度當速度，也不能拿一次執行的時間當穩定效能。

延續自擬例子：參考實作耗時 10 毫秒。Kernel X 耗時 2 毫秒，但在重複值輸入錯誤；Y 耗時 5 毫秒，通過預先設定的正確性檢查。X 的名義倍速為 10/2=5，卻不合格；Y 的倍速為 10/5=2，才是有效的效能候選。先 correctness gate，再比較 speedup，才能避免把錯誤捷徑選成冠軍。

## 介面也決定搜尋會不會跑偏

[Improving Parallel Program Performance with LLM Optimizers](https://arxiv.org/abs/2410.15625)研究以領域專用語言與系統介面表達平行程式的映射決策。把決策放在較受限、可驗證的表示中，可讓模型較集中地探索合法配置；編譯器、測試與效能回饋再引導下一輪。這篇的標題隨版本更新，本文講的是此 arXiv ID 的方法，不把它當任意軟體專案的保證。

它與前兩篇的共同點，是回饋必須能指向下一步修改。只有「失敗」而無輸入、預期輸出或編譯診斷，agent 很容易亂改。工具介面不是外殼，而是決定哪些動作可表達、哪些錯誤能被看見的搜尋空間。

## 變式檢查與答案

候選 Z 通過原本兩項測試，耗時 4 毫秒，但只支援長度小於 8 的輸入；需求沒有長度限制。Z 能取代 Y 嗎？**答案：不能直接取代。** 先加入長度邊界與更大輸入的正確性測試，再在相同裝置、輸入與測量方法下比較速度。若需求明訂只支援短輸入，Z 才可能是合法選擇；改需求與修程式是兩件事。

今晚可做的動作是替 coding agent 的候選表加上三欄：需求反例、正確性結果、通過後的效能。把重複值、空輸入與邊界案例寫成獨立測試，再增加平行候選數。沒有選擇判準時，多生成只會增加審核負擔。

## 英文閱讀與表達

本文自擬句：*A faster candidate is useful only after it passes the correctness gate.*（候選先通過正確性檢查，速度才有比較意義。）*Generated tests may share the patch's blind spots.*（生成測試可能共享修改的盲點。）這是閱讀／表達練習，沒有原音跟讀。


## 參考資料

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [CodeMonkeys](https://arxiv.org/abs/2501.14723)
- [KernelBench](https://arxiv.org/abs/2502.10517)
- [LLM optimization of parallel-program interfaces](https://arxiv.org/abs/2410.15625)
