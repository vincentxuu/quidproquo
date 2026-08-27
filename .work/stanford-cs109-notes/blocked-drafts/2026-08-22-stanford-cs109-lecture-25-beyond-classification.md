---
title: "Stanford CS109 Lecture 25｜Beyond Classification：分類只評估一次預測；序列決策還要處理行動如何改變下一筆資料。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 26
tldr: "分類只評估一次預測；序列決策還要處理行動如何改變下一筆資料。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 25：從預測標籤走向序列決策，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-25-beyond-classification-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 26 篇，對應 **Stanford CS109, Summer 2026, Lecture 25**（Aug 6），官方 schedule 題目是 **Beyond Classification**，講者為 Chris Gregg。本文只依[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/25-Reinforcement1)與[課程讀本](https://probabilitycoders.stanford.edu/spr26)整理可驗證的範圍。

本講材料完整度標為 **L1**。schedule 與零散講次頁可用；後段 navbar 標題與 schedule 不完全一致；無公開錄影。因此本文說明公開教材能支持的概念與推導，不把未公開錄影中的內容寫成講者原話。

## 這堂課要解決什麼

這一講的中心是從預測標籤走向序列決策。一句話抓住它：**分類只評估一次預測；序列決策還要處理行動如何改變下一筆資料。**

機率題最容易在算式開始前就做錯。先問「隨機實驗是什麼、結果長什麼樣、哪些量已知、哪些量未知」，再選公式。這個順序也把 CS109 和公式手冊分開：課程要練的是把現實敘述翻成可以檢查的模型。

## 核心表示法

本講最值得帶走的式子是：

```text
G_t=Σ_{k≥0}γ^kR_{t+k+1}
```

式子只是壓縮後的模型。每個符號都必須回到題目：機率是對哪個樣本空間定義、條件資訊改變了什麼、加總或積分跨過哪些可能值。若不能用一句白話解釋等號兩邊，就還不該代數字。

實作時可以用固定順序：

1. 定義事件或隨機變數，寫出值域。
2. 列出必要假設，尤其是獨立性與同分布。
3. 寫一般式，再代入資料。
4. 檢查機率是否落在 0 到 1、單位是否合理、極端情況是否符合直覺。

## 一個可重複使用的解題框架

假設你要從觀察資料回答一個問題。先用一句話寫下生成故事：資料如何出現？接著定義觀察量 `X` 與真正關心的量 `Y`。若題目提供新資訊，把它寫成條件，而不是憑直覺在最後修正答案。

然後做兩次檢查。第一次是**結構檢查**：是否把相依事件當成獨立？是否因為順序不重要卻重複計數？第二次是**數值檢查**：答案若趨近某個邊界，模型應該有什麼反應？這兩步往往比多算一位小數更有價值。

最後把結果翻回情境。`0.2` 不是完整答案；它可能是事件機率、錯誤率、後驗信念或決策閾值。名稱不同，能下的結論也不同。

## 常見誤區

第一個誤區是看到熟悉名詞就套分布。分布是生成假設的結果，不是題目關鍵字。第二個誤區是把期望值當成一次實驗的保證；期望描述長期加權中心，單次結果可以離它很遠。第三個誤區是算出數字後停止，沒有檢查假設是否能支撐原問題。

還有一個跨講次的陷阱：把「觀察到資料後的信念」和「固定參數下資料出現的機率」混為一談。CS109 後半段的 inference、MLE 與 classifier comparison 都會反覆要求分清這兩個方向。

## 自己做一次

拿一個你在意的二元事件，例如服務是否逾時。先寫出成功／失敗的樣本空間，再加入一項條件資訊，例如流量是否超過門檻。不要立刻算；先畫一棵兩層樹，標出每條邊代表的條件機率。完成後才用本講公式計算，並用模擬檢查長期頻率是否接近答案。

這個練習的目的不是得到漂亮數字，而是看見每個假設放在模型的哪個位置。若模擬與公式不合，優先檢查事件定義、條件方向與抽樣方式。

---

## 延伸：把公式變成可質問的模型

學會一條公式的最低標準是能代數字；更高的標準是能指出它在哪些條件下會壞。閱讀新聞、實驗報告或模型評估時，可以反問：樣本從哪裡來？漏掉的族群會不會改變基準率？資料是否真的獨立？指標是否對應真正的決策成本？

這些問題不只屬於統計課。A/B test、可靠度分析、推薦系統與生成模型，都在用同一套機率語言壓縮不確定性。CS109 的價值，是讓這套語言保持可展開、可檢查。

## 材料缺口

- schedule 與零散講次頁可用。
- 後段 navbar 標題與 schedule 不完全一致；無公開錄影。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 25: Beyond Classification](https://web.stanford.edu/class/cs109/lectures/25-Reinforcement1)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
