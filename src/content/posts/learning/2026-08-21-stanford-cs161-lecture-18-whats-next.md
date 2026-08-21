---
title: "Stanford CS161 Lecture 18：從演算法工具箱走向 LP、編碼與 ML"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, linear-programming, reed-solomon, machine-learning]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 19
tldr: "期末課以 slides 回顧 CS161 工具箱，再用 LP duality、Reed–Solomon 與 ML-assisted algorithms 指向後續方向；官方沒有提供 notes。"
description: "導讀 Stanford CS161 Winter 2026 Lecture 18 的課程回顧與未來路線；本講只有 slides、沒有 lecture notes。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-18-whats-next-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 第十九篇，對應 **Winter 2026 Lecture 18**，由 Ellen Vitercik 於 2026 年 3 月 11 日主講；學期與講次範圍以 [Winter 2026 官方課程首頁](https://stanford-cs161.github.io/winter2026/)為準。Component 題名是 *What's next?*，slides 封面是 *What we’ve done and what’s to come*。

先說清楚材料邊界：官方 component **只提供 52 頁 slides，沒有 lecture notes**。本文只使用[官方 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture18.pdf)與[component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture18.md)，沒有觀看 Canvas 錄影，也沒有拿其他學期 notes 補洞。下列公式、例子與限制都以 slides 為界。

## 十七講濃縮成十三張回顧

Slides 用 `What just happened?` 回顧前 17 講，將它們壓成 13 張主題頁。主線不是背過多少名稱，而是把 rigor 與 intuition 放在一起：設計演算法、證明 correctness、分析 worst-case runtime，並用 big-O 表達成長。

材料重申 `T(n)=O(f(n))` 的量詞：存在 `c,n₀>0`，使所有 `n≥n₀` 都有 `0≤T(n)≤cf(n)`。接著快速掃過 divide-and-conquer（MergeSort、Karatsuba、SELECT）、randomized QuickSort、comparison sorting lower bound 與 RadixSort、BST、hashing、graphs、shortest paths、DP、greedy、flows，以及 Embedded EthiCS。

這只是 recap。Slides 沒重新給每支演算法的完整 pseudocode、proof 與 runtime。DP 頁提醒辨認 optimal substructure、寫 value recurrence、填 table；greedy 頁提醒逐步 commit 並以 induction 證明 choice 不排除成功；flow 頁重述 residual augmenting paths 與 max-flow=min-cut。細節仍應回到前 17 講，不能把期末回顧當新證明來源。

## 一個演算法工具箱

整學期方法可整理成幾個反覆出現的問題。輸入如何縮小：divide-and-conquer 拆成獨立子問題，DP 保存重疊子問題，greedy 證明只追一個選擇已足夠。正確性如何證明：induction、exchange argument、cut certificate、residual reachability、blocking-pair contradiction。效率如何判斷：先選 computation model，再算 operations 與數值 bit-length，區分 polynomial 與 pseudo-polynomial。

Randomization 頁強調 input 固定後才抽 randomness，得到 always correct、usually fast 的 QuickSort 分析。這呼應課程一貫分離 correctness 與 performance：random choice 不替 proof 背書，empirical speed 也不取代 worst-case 或 expected bound。

## Linear Programming 與 dual certificate

第一個 future gem 是 Linear Programming：在線性 constraints 下最佳化 linear objective。Constraints 定義 polytope，objective 給方向；幾何上沿方向推到最遠的 vertex。

Slides 的 primal 例是：

```text
maximize   x + y
subject to x ≥ 0, y ≥ 0
           4x + y ≤ 2
           x + 2y ≤ 1
```

Optimum 是 `5/7`。證明不必枚舉所有 feasible points：取兩條 constraints 的非負線性組合，權重 `w=1/7,z=3/7`，左側使 `x,y` 的係數都至少 1，右側成 `2w+z=5/7`，故所有 feasible solution 都有 `x+y≤5/7`；再找一個達到 `5/7` 的 feasible point，upper bound 便 tight。

對應 dual 是：

```text
minimize   2w + z
subject to w,z ≥ 0
           4w + z ≥ 1
           w + 2z ≥ 1
```

`w=1/7,z=3/7` 是 certificate。Slides 再把 max flow 看作 primal、min cut 看作 dual：同值的一對解同時證明最佳性。這延續 Lecture 16「答案附 certificate」的觀念。

但官方本講**沒有 notes**，slides 也沒有命名具體 LP algorithm、給 pseudocode 或 asymptotic bound，只用「在 feasible-region vertices 間聰明移動」作直覺。不能據此宣稱本講完整教授 simplex、interior-point、退化、unbounded 或 infeasible cases。

## Low-degree polynomial 與 Reed–Solomon teaser

第二個 future gem 從 2 點定直線、3 點定拋物線出發：足夠多 evaluations 能決定 low-degree polynomial。Slides 把 `H,I,B,O,B` 當 coefficients，形成

```text
f(x)=H+Ix+Bx²+Ox³+Bx⁴
```

Alice 傳送多個 evaluation values；channel 使部分值錯誤後，Bob 以 interpolation/error correction 復原 polynomial，再讀回 message。材料稱有快速 divide-and-conquer algorithm，甚至能容忍部分錯點。

這段是 roadmap，不是完整 Reed–Solomon 教學。Slides 沒提供 recurrence、field 假設、可容忍錯誤數、distance proof 或 runtime；而且本講沒有 notes 可補充。因此本文不自行填入熟悉的編碼理論定理，再假裝是 Lecture 18 內容。

## ML for algorithm selection 與 design

第三個 future gem 指出：同一 NP-hard problem 的最佳 heuristic 可能依 instance domain 不同。Algorithm selection pipeline 是對 graph 計算 density、vertex count 等 features，再由 ML 在 `A₁...A₈` 中選一支。Slides 以 graph coloring 與 2016–17 FCC spectrum auction 作例子，摘要 cited simulations 的節省結果；未讀原研究前，本文不把 slide 摘要擴寫成獨立因果主張。

Algorithm design 的例子是 slides 標成 `Science ’25` 的 AlphaEvolve。收尾重點不是「coding agent 產生的程式自然正確」，而是仍要問 `does it work?`、`is it fast?`，並尋求 formal guarantees。Slides 沒給通用 training objective、model architecture、selection regret bound 或 AlphaEvolve 技術細節。

## 材料缺口就是本文的界線

再明確一次：**Lecture 18 只有 slides，沒有官方 lecture notes**。因此 `17 lectures in 13 slides` 是回顧版面，不是資料漏頁；LP、interpolation 與 ML 都是 teaser，不能跨學期補成完整章節。課程清單、Theory Lunch 與 exam announcements 也只是 Winter 2026 當時資訊，不是永久現況。

這個限制反而呼應課程方法：證據支持到哪裡，主張就寫到哪裡。Slides 支持 LP dual certificate 的具體算式，卻不支持完整 LP runtime；支持 polynomial encoding 的直覺，卻不支持錯誤界；支持 ML 協助選擇與設計的方向，卻不支持以 empirical output 取代 proof。

## 三個 future gems 其實共享同一條主線

LP 的 dual solution、Reed–Solomon 的冗餘 evaluations，以及 ML-assisted algorithm 仍需的 formal guarantee，看似來自三個領域，卻都回到 CS161 的核心問題：如何讓結果可被驗證。LP 例用 `w,z` 組合 constraints，產生任何 feasible objective 都不能超越的數值 certificate；編碼例加入足夠結構，讓接收者不只猜 message，而能從 evaluations 重建；ML 例則明說生成或選出的 algorithm 仍要回答 correctness 與 speed。

三段的技術成熟度並不相同。LP slides 給了一個可以逐項代入的 primal/dual 數值例；polynomial slides 給 encoding 流程，卻沒有 decoding threshold；ML slides 給 feature-to-algorithm pipeline 與案例，卻沒有 generalization 或 regret bound。寫成文章時，篇幅不能被誤認為證據強度：能展開公式的地方展開，只有方向的地方就保留問號。

這也重新串起前面課程。Lecture 15 用 light edge 證明局部選擇可延伸，Lecture 16 用同值 flow/cut 證明全域最佳，Lecture 17 用 rejection history 排除 blocking pair。Lecture 18 沒新增一套完整算法，而是把「演算法輸出必須伴隨可理解的保證」帶到最佳化、通訊與 AI-assisted design。

## 回顧頁沒有重新授權所有細節

Slides 提到 Master Method、randomized QuickSort、Bellman–Ford、Floyd–Warshall、LCS、Knapsack、Huffman、MST 與 Ford–Fulkerson，功能是指回工具箱。它沒有在本講重新證明 recurrence、期望 runtime、cut property 或 max-flow min-cut theorem。本文因此只用它描述課程地圖，不複製前篇推導，也不把一行 bullet 擴張成 Lecture 18 的新技術主張。

同理，後續課程與 Theory Lunch 是 2026 年當下的導航資訊；讀者應回官方現況頁確認，而不是把這份期末 slides 當長期課表。

這項時間標記也適用於 slides 中的研究案例與引用年份：本文會保留課堂原貌，但不宣稱它們代表日後的最新進展。

## 延伸

後續學習可以沿三條線走：最佳化課程補齊 LP algorithms 與 duality theorem；coding theory 補 finite fields、distance 與 decoding bounds；learning-augmented algorithms 研究預測錯誤時的 robust guarantees。這些是由 slides 指向的路線，不是本講已教授內容。

若把整個系列當複習索引，最好的使用方式是先從這篇選工具，再回對應 lecture 查完整 proof。Lecture 18 的價值是地圖，而不是把每條路壓成一頁捷徑。

## 參考資料

- [Lecture 18 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-18-what-s-next)
- [Lecture 18 slides — 本講唯一 PDF 材料](https://stanford-cs161.github.io/winter2026/assets/files/Lecture18.pdf)
- [Official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture18.md)
- [Stanford CS161 Winter 2026 官方課程首頁](https://stanford-cs161.github.io/winter2026/) — 本文學期與系列範圍的依據
- **Lecture notes：官方 component 未提供，沒有 URL；本文未使用其他學期 notes。**
