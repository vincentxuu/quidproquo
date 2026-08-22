---
title: "Stanford CS103 Lecture 10：走訪、圖的補集與鴿籠原理"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, graph-theory, pigeonhole-principle, discrete-mathematics]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 12
tldr: "從 walk、path、cycle 與連通分量出發，以補圖必有一者連通、同度數節點、廣義鴿籠原理及朋友與陌生人定理練習完整證明。"
description: "依 Stanford CS103 Graph Theory Part Two 官方投影片，整理可達性、補圖、鴿籠原理與 Ramsey theory 入門證明。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-11-graphs-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 12 篇，對應 **Spring 2026 官方 Lecture 10（2026-04-22）**。本講的官方題目是 **Graph Theory, Part Two**，主線依序是 walks、paths 與 reachability、graph complements，以及 pigeonhole principle。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂講者欄位，因此本文不猜實際講者。

前一講把 graph 定義為 `G = (V, E)`：`V` 是節點集合，`E` 的元素是兩個不同節點組成的無序對。本講開始問動態問題：怎樣才算沿著圖移動？兩點何時彼此可達？若把所有不存在的邊翻成存在，連通性會怎樣？最後再把「東西比位置多」提升成可重複使用的證明工具。

## 相鄰是所有移動定義的起點

若 `{u, v} ∈ E`，節點 `u` 與 `v` 稱為 adjacent。這句看似只是複習，卻是之後每個序列是否合法的局部檢查：不用看整張圖，只需逐對確認連續節點之間有邊。

投影片先用三字母單字圖，再用美國西部城市與道路圖示範。圖上的幾何位置不構成相鄰，線條是否連接才算；兩座城市在地圖上很近，也不代表它們在抽象圖裡相鄰。形式化的價值正在於把視覺直覺轉成可檢查條件。

## Walk：允許重複的移動序列

圖 `G = (V, E)` 中的 walk 是一個至少含一個節點的序列 `v₁, v₂, …, vₙ`，使每一對連續節點都相鄰。它的長度是 `n - 1`，因為長度計算走過多少條邊，而不是列出多少個節點。例如十一個城市構成的合法序列長度是十。

定義允許重複節點與重複邊，所以可以前進、折返，再經過同一地點。只寫一個節點也構成長度零的 walk：沒有任何連續節點對需要檢查，因此條件自然成立。這個空泛成立不是漏洞，而是定義刻意包含原地不動的情況。

## Closed walk、path 與 cycle 不可混用

Closed walk 是從某節點回到同一節點的 walk；課程另定慣例，closed walk 的長度不能是零，因此單節點的 staycation 不算。Path 是不重複任何節點的 walk。Cycle 則是 closed walk，除首尾是同一節點外，不重複節點或邊。

這三者的限制逐步加強，但不是單純同一條包含鏈。path 通常首尾不同；cycle 必須首尾相同。判斷一個序列時可照順序做：先查相鄰性，再查首尾，再查重複節點與邊。若一開始就憑圖形像不像圈，很容易漏掉重複經過的中間節點。

投影片也列出可直接使用的事實：walk 存在若且唯若 path 存在；cycle 長度至少為三且至少包含三個節點。第一個事實的直覺是，walk 若重複節點，可以刪除兩次出現之間的繞路，不斷縮短直到沒有重複。

## Reachability 把路徑提升成兩點關係

節點 `v` reachable from `u`，意思是存在一條從 `u` 到 `v` 的 path。在無向圖中，路徑反向仍是路徑，所以可達關係對稱。課程用道路封閉後的城市圖提醒：可達不是看起來隔得近，而是確實能列出符合定義的 path。

一張圖 connected，表示其中每一對相異節點都彼此可達。證明 connected 不能只展示幾條代表性路線；必須處理任意 `u ≠ v`。反例則簡單得多，只要找出一對沒有 path 的節點即可。這個量詞差異會在補圖證明裡成為主角。

## Connected component 是極大的互達群組

Connected component 是一個彼此可達節點的 maximal set。Maximal 的意思是不能再加入其他節點而仍保持集合內兩兩可達，不是說它一定是整張圖中節點數最多的 component。

每個節點恰好屬於一個 connected component；圖 connected 若且唯若它恰有一個 component。這讓我們把不連通圖視為幾塊互不相通的區域。不同 component 的任意兩點不可能有邊，否則那條邊本身就是 path，兩塊便應合併。

## 補圖把非邊翻成邊

對無向圖 `G = (V, E)`，其 complement 記作 `Gᶜ = (V, Eᶜ)`，節點集合保持不變，而

`Eᶜ = {{u, v} | u ∈ V, v ∈ V, u ≠ v, 且 {u, v} ∉ E}`。

因此每一對相異節點恰好在 `G` 或 `Gᶜ` 其中之一相鄰。補圖不是把節點也取補集，不加入 self-loop，也不是刪掉孤立點。它只針對同一個 `V` 上所有可能的二元素無序對翻轉 membership。

## 定理：G 與 Gᶜ 至少一者連通

要證明 `G connected ∨ Gᶜ connected`，投影片把析取改寫成 implication：若 `G` 已連通就完成；否則證明 `Gᶜ` 連通。也就是證明 `G 不連通 → Gᶜ 連通`。

假設 `G` 不連通，任取相異節點 `u, v`。若它們位於不同 components，則 `{u, v} ∉ E`，所以 `{u, v} ∈ Eᶜ`，長度一的 `u, v` 就是所需 path。若兩點位於同一 component，因 `G` 不連通，可從另一 component 選節點 `z`。此時 `u` 與 `z`、`z` 與 `v` 都跨 component，兩條邊都在 `Eᶜ`，於是 `u, z, v` 是長度二的 path。

兩種情況覆蓋所有相異 `u, v`，所以 `Gᶜ` 連通。這份證明最值得學的是 construction：直接缺邊時用一跳；原圖同區時，借另一區的點搭兩跳橋。它也說明為何只畫一張補圖不算證明，因為定理量化的是任意圖與任意點對。

## 鴿籠原理是碰撞必然發生

Pigeonhole principle 說：把 `m` 個物件放入 `n` 個箱子，若 `m > n`，至少一箱有兩個以上物件。應用時最重要的工作不是喊出定理名稱，而是清楚指定 objects、bins 與分配規則。

例如舊金山人口遠多於一年中可能的生日日期，可推出至少兩人生日相同；但若題目要求精確到出生秒數，bins 的選擇就不同。定理只根據我們建立的映射運作，不會替模糊模型補條件。

## 有限集合版本與反證結構

投影片把原理寫成集合語言：若有限集合 `A, B` 滿足 `|A| > |B|`，則不存在 injective function `f: A → B`。Objects 是 `A` 的元素，bins 是 `B` 的元素；injective 正是每個 bin 至多收到一個 object。

反證時假設存在這種 injection。因每個 `b ∈ B` 最多有一個 preimage，`A` 的元素數便不能超過 `B`，得到 `|A| ≤ |B|`，與前提矛盾。這個版本把放進箱子的圖像接回函數，之後遇到有限集合大小比較時可以直接使用。

## 同度數節點：先排除不可能同時出現的兩端

在簡單無向圖中，節點 `v` 的 degree 是與它相鄰的節點數。含 `n ≥ 2` 個節點時，表面上的可能 degree 是 `0, 1, …, n - 1`，剛好 `n` 種，似乎不能直接用 `n` 個節點擠進 `n - 1` 個箱子。

關鍵是 degree `0` 與 `n - 1` 不可能同時出現。若 `u` degree 為零，它不與任何點相鄰；若另一點 `v` degree 為 `n - 1`，它卻必須與包括 `u` 在內的所有其他點相鄰，立即矛盾。因此實際 degree 值只能落在 `0..n-2` 或 `1..n-1` 的某一組，共 `n - 1` 種。將 `n` 個節點依 degree 分箱，鴿籠原理保證至少兩點 degree 相同。

投影片也給反證版本：假設所有節點 degree 各異，既有 `n` 點又有 `n` 個候選值，便必須每個值恰出現一次，尤其同時出現零與 `n - 1`，仍得到矛盾。兩份證明結論相同，但第一份更明確展示如何修正 bins。

## 廣義鴿籠原理量化最擠與最鬆

把 `m` 個物件分入 `n > 0` 個箱子，廣義版本保證至少一箱有 `⌈m/n⌉` 個以上，也至少一箱有 `⌊m/n⌋` 個以下。前者說最大 load 不可能低於平均數的上取整；後者對稱地說最小 load 不可能高於平均數的下取整。

證明第一句時，假設每箱都少於 `m/n`。令 `xᵢ` 是第 `i` 箱的物件數，則 `m = x₁ + ⋯ + xₙ < m/n + ⋯ + m/n = m`，得到 `m < m` 的矛盾。因 `xᵢ` 是整數，至少 `m/n` 等價於至少 `⌈m/n⌉`。上取整不是額外魔法，而是離散物件數把實數平均值轉成整數門檻。

## 朋友與陌生人：R(3) ≤ 6

六人派對中，每一對人不是朋友就是陌生人。把六人畫成 complete graph `K₆`，朋友邊塗藍、陌生人邊塗紅；題目變成證明一定存在單色三角形。

任取節點 `x`，它有五條 incident edges，而顏色只有兩種。廣義鴿籠原理給出至少 `⌈5/2⌉ = 3` 條同色邊。不失一般性，設 `x` 到 `r, s, t` 都是藍色。若 `{r,s}`、`{r,t}`、`{s,t}` 任一條為藍，它和回到 `x` 的兩條藍邊構成藍三角形；否則這三條全紅，`r,s,t` 自己構成紅三角形。

這個 proof split 很乾淨：先用鴿籠原理取得結構，再問內部三條邊有沒有一條藍。不論答案為何，都產生 witness。

## Ramsey theorem：大尺度不可能完全無結構

投影片把上一結果放進 Ramsey theory：對每個自然數 `n`，存在 `R(n)`，使任何至少含 `R(n)` 個節點、邊染紅藍的 clique 都包含紅色 `n`-clique 或藍色 `n`-clique；少於 `R(n)` 時則存在避免兩者的染色。

本講只證得 `R(3) ≤ 6`，不是單靠這份證明得出一般 Ramsey theorem，也不是從此處證明最小值等於六。課堂用它表達一個觀點：系統夠大時，即使局部安排看似混亂，某種規整子結構仍被迫出現。

## 把定義與證明變成可執行檢查

讀完後可以用下列順序自測：

1. 給一串節點，逐對寫出 edge，判定是否為 walk，再分別檢查 closed walk、path、cycle。
2. 給一張不連通圖，標出 components，再任取同 component 與跨 component 的點，在補圖中各造一條最長兩邊的 path。
3. 遇到鴿籠題，先寫 objects、bins、assignment；確認是普通版本還是需要 `⌈m/n⌉`。
4. 重寫同度數定理時，不可直接宣稱只有 `n - 1` 種 degree；必須說明零與 `n - 1` 為何不能共存。
5. 重寫六人派對證明時，指出原理用在五條 incident edges 與兩種 colors，而不是直接用在六個節點。

這套檢查的共同核心是量詞與 witness：connected 要處理任意點對，存在路徑要真的造路徑，鴿籠原理要真的定義分箱。

## 延伸例子與適用邊界

投影片最後列出 Sperner's lemma、mountain-climbing theorem、Brouwer fixed-point theorem、Mirsky's theorem，以及只用零與一寫出某個整數倍數的結果，說明鴿籠式論證能通往許多領域。這些是延伸 sampler，不代表本講已證明它們。

課程也指向 Math 107 的 graph theory 與 Math 108 的 combinatorics。對本講而言，學習目標仍是能操作定義、完成兩個 case 的補圖證明，以及把問題正確建模成 objects 和 bins，而不是背下所有延伸定理。

## 材料缺口與閱讀界線

[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/Lecture%20Slides.pdf)公開，足以核對本講 agenda、定義與完整證明。錄影與逐字稿只在 Canvas／Panopto，因此本文不重建講師口語、學生提問或現場投票結果，也不把延伸定理說成課堂已證明。

## 更新紀錄

- 2026-08-22：依官方完整投影片逐項重建 walks、reachability、graph complements、pigeonhole principle 與 Ramsey theory 的雙語正文。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 10: Graphs, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/)
- [Official Lecture 10 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs on Discrete Structures](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs_on_discrete_structures)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
