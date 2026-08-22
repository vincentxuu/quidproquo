---
title: "Stanford CS161 Lecture 17：Gale–Shapley、穩定配對與可撤銷的貪婪選擇"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, stable-matching, gale-shapley, deferred-acceptance]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 18
tldr: "Deferred Acceptance 允許暫時接受後再反悔；proposal 的單調性證明它在 O(n²) 結束、產生 stable matching，且偏向 proposal 的一側。"
description: "導讀 Stanford CS161 Winter 2026 Lecture 17：stable matching、blocking pair、Gale–Shapley、正確性、doctor-optimality 與 incentives。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-17-stable-matching-gale-shapley-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 第十八篇，對應 **Winter 2026 Lecture 17**，由 Ellen Vitercik 於 2026 年 3 月 9 日主講，題名 *Stable Matchings and Gale-Shapley*。

本文讀了公開 [notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture17-notes.pdf)、[slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture17.pdf) 與[官方 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture17.md)。Canvas 錄影未觀看。正文只陳述這些 Winter 2026 材料支持的模型與結論。

## Stable 不是每個人都滿意

基本模型有 `n` 位 doctors、`n` 家各一個 position 的 hospitals，雙方都有無 ties 的完整 strict ranking。Matching 中若 doctor `d` 與 hospital `h` 都嚴格偏好彼此勝過現任，`(d,h)` 是 blocking pair；沒有 blocking pair 才叫 stable。Stable 不等於總分最高，也不保證每個人拿第一志願，只排除一對人有共同動機繞過機制。

人數不等可補低順位 fake participants，配到 fake 視為 unmatched；多 positions 可拆成節點。這是講義的簡化，未涵蓋 ties、不完整 lists、couples 與真實 NRMP 全部規則。

材料以 Alice、Bob、Charlie 與 X、Y、Z 展示兩個 stable matchings：`(Alice-X),(Bob-Z),(Charlie-Y)` 和 `(Alice-Y),(Bob-Z),(Charlie-X)`。`(Alice-Z),(Bob-X),(Charlie-Y)` 不穩定，因 Alice 與 X 形成 blocking pair。可見 stable solution 可能不唯一。

## Deferred Acceptance

Doctor-proposing Gale–Shapley 不把第一次接受當定案。每位 free doctor 向尚未嘗試的最高順位 hospital proposal；hospital 若空缺就暫收，若已有暫配，只保留自己較喜歡者，被換下者恢復 free。拒絕後 doctor 永不再投同一家。

```text
all doctors free; all hospitals hold NIL
while some doctor d is free:
    h = highest-ranked hospital not yet proposed to by d
    d proposes to h
    if h prefers d to its current tentative doctor:
        release the old doctor, if any
        h tentatively holds d
return tentative pairs
```

實作若用 `H[h][d]` 保存 rank，數字越小越喜歡，比較是 `O(1)`。`NIL` 必須視為 rank `+∞`；notes pseudocode 未明寫這個 sentinel。若每次在線性 preference list 搜 rank，就無法達到課堂的 `O(n²)`。

## 終止、完整與穩定

Hospital 一旦收到 proposal 就不再變空，只會換成更喜歡的 doctor。Doctor 也不可能用完所有 hospitals：若某人被全部拒絕，每家 hospital 在拒絕當下已有暫配且之後不空，等於其餘 `n-1` 人同時佔滿 `n` 家，矛盾。

每輪某 doctor 的 proposal index 加一，每人最多提案 `n` 次，所以至多 `n²` iterations，終止時是 complete matching。

假設結果有 blocking pair `(d,h)`。因 `d` 最終拿到比 `h` 差的選擇，他先前必向 `h` 提案。`h` 當時拒絕他，或先收後換成更喜歡者；hospital 持有對象只會改善，因此最終不可能偏好 `d` 勝過現任，矛盾。這正是「可撤銷 greedy」的力量：doctor 的選擇單向往下，hospital 的暫配單向往上。

## 三個命題不能互相代替

Termination 只說 loop 有限，不能單獨推出輸出完整；完整也不能推出穩定。Proposal index 單調增加給有限步數；hospital 一旦非空便不再空，配合 pigeonhole contradiction 排除 doctor 用盡名單；最後才用「doctor 必曾向更偏好的 hospital 提案」排除 blocking pair。

以三對三例子想像一次執行：Alice 先投 X、Bob 也投 X，X 暫留較喜歡者，被拒絕者再投下一家；Charlie 後來又可能使某家 hospital 換人。中途出現看似 blocking 的 pair 並非反例，因 tentative matching 尚未輸出。證明只要求終止後無 blocking pair，並利用每次 rejection 留下的單調歷史。

`O(n²)` 也不只是「共有 `n²` 對」。每一對最多一次 proposal；next-index 直接取下一家、inverse ranking 常數時間比較、queue 管 free doctors，才能讓每輪 bookkeeping 為 `O(1)`。若每次重掃名單或搜尋誰 free，實作可能超過理論界。

## Doctor-optimal，但不是雙方最佳

令 `h*(d)` 是 doctor `d` 在所有 stable matchings 中可得到的最佳 feasible hospital。Notes 的 proof sketch 假設演算法第一次有人被自己的 `h*(d)` 拒絕；拒絕者是 hospital 更喜歡的新 doctor `d'`。若兩人的 best feasible hospital 相同，`d'` 與該 hospital 會阻擋任何把它配給 `d` 的 stable matching；若不同，`d'` 在來此之前已被自己的 best feasible hospital 拒絕，違反「第一次」。故拒絕不會發生，輸出對每位 doctor 都至少和其他 stable matching 一樣好。

Slides 同時稱此結果為 hospital-worst stable matching。Proposal side 決定偏向；若由 hospitals proposal，方向反轉。不能只說 Gale–Shapley「公平地找到唯一答案」。Doctor-optimal 的量詞是每位 doctor 都 weakly prefer 此結果勝過任何其他 stable matching，不只是平均 rank 較好；hospital-worst 也只在 stable matchings 集合內比較，不是所有可能配對中的絕對最差。本講未形式化完整 stable lattice，本文也不跨出去補。

## Incentives 的界線

Notes 陳述 doctor side truthful：單一 doctor 誤報無法讓自己在真偏好下得到更好結果；但正式 proof 不在 notes，而是指向 Dubins–Freedman。Notes 特別警告一個看似直接的錯證：doctor-optimality 是對申報偏好下的 stable matchings，而 incentive theorem 比較的是真偏好，兩者不能直接替換。

Hospitals 沒有相同保證；材料例子中 X 調換回報順位可得到更喜歡的 match。本文因此只記錄 theorem 與 proof 範圍，不自行補上缺失證明，也不把單邊 strategy-proof 說成整個機制對所有人都不可操弄。

## 材料限制與課程位置

Stable 只排除 blocking pair，不最大化社會福利；matches 在過程中是 tentative；doctor-proposing 才導出 doctor-optimal；`NIL` rank 需實作補齊。Notes Proposition 4/5 排版銜接不順，但承擔的是 doctor 不會耗盡 hospitals 的反證，不應拆成兩個無關定理。

Lecture 14 的 greedy 永不回頭；Lecture 15 的 safe edge 一加入就保留；本講則允許暫時接受被推翻，靠雙側各自的單調性完成證明。這擴張了「greedy」的樣貌，也提醒演算法保證依賴精確模型。

## 制度保證的邊界

開場動機有兩種風險：participants 可能誤報，也可能私下形成 blocking pair 繞過結果。Stability 處理第二種；doctor-side incentive theorem 在簡化模型處理第一種的一部分。兩者互不自動推出，單邊 truthful 也不能推成 hospitals 或 coalition 都 truthful。這是為何本講把 stability proof、proposer-optimality 與 incentives 分段處理。

## 從定義逐對檢查結果

Notes 也把 stability 寫成逐 pair 的等價條件。對每個 doctor `i` 與 hospital `j`，至少一項成立：兩者本來就互配；`j` 更喜歡現任；或 `i` 更喜歡現任。這個寫法很適合測試，因為輸出後可以枚舉 `n²` 對並查 inverse ranks；一旦三項都不成立，就直接得到 blocking-pair witness。

同一條件也揭示 proof 的方向。若 `(i,j)` 真會 blocking，doctor 的 proposal 順序保證 `i` 曾到過 `j`；hospital 的 holding 順序保證從那刻起，`j` 的暫配只可能比 `i` 更好。兩個單調性各負責 blocking pair 定義的一側。少了任一側，例如允許 doctor 回頭重投，或 hospital 任意降級，原證明鏈就斷掉。

Naive greedy 容易錯在把 hospital 首次接受永久化。Deferred Acceptance 的「deferred」正表示承諾延後到程序結束；過程保存的是目前最好 proposal，不是最終不可逆選擇。這與 Lecture 15 safe edge 的永久性形成對照，也解釋為何兩講雖都有 greedy 味道，invariant 卻不能互換。

完整 matching 的 pigeonhole 證明還依賴兩側人數都是 `n`、每份 preference list 都含全部對側 participants。若名單不完整，被所有可接受 hospitals 拒絕並不矛盾；若 capacities 不同，也不能直接用 `n-1` 人佔 `n` 家的計數。Notes 用 fake participants 與拆 positions 說明如何把部分變體映回基本模型，但映射後必須把 fake match 解讀成 unmatched，不能忘記語意轉換。

演算法選「任意」free doctor 並不影響上述保證。不同執行順序可能改變中間 proposal trace，但 doctor-proposing Deferred Acceptance 的終止、穩定與 doctor-optimal proof 都只用每位 doctor 的名單順序和 hospital 暫配單調改善，不要求固定挑選次序。這也是測試時不應把某一條中間 trace 當唯一正確輸出的原因。

## 延伸

真實 matching markets 常有 capacities、ties、couples 與不完整偏好，不能把本講 theorem 原封不動搬過去。工程測試可生成小型 strict preferences，暴力枚舉 matchings，檢查輸出完整、無 blocking pair，並比較所有 stable solutions 驗證 proposing-side optimality。這是驗證策略，不是課堂對真實 NRMP 的完整模型。

## 參考資料

- [Lecture 17 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-17-stable-matchings-and-gale-shapley)
- [Lecture 17 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture17-notes.pdf)
- [Lecture 17 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture17.pdf)
- [Official component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture17.md)
