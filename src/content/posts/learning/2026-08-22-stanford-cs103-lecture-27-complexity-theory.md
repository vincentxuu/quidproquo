---
title: "Stanford CS103 Lecture 26：複雜度理論"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 28
tldr: "本講從「decidable 不等於 feasible」推進到「efficiency 要先選 resource」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「decidable 不等於 feasible」與「efficiency 要先選 resource」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-27-complexity-theory-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 28 篇，對應 **Spring 2026 官方 Lecture 26（2026-05-29）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Complexity Theory**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## decidable 不等於 feasible

投影片 先給一個警告：判斷兩個 regular expressions 是否描述同一 語言 是 decidable，課程 autograder 也能百分之百正確判定；但投影片同時陳述，不存在 runtime \(O(2^{m+n})\) 的解法，其中 m、n 是兩個 regex 長度。即使保證終會停，等待時間仍可能不可接受。

computability 問「computer 能否解」；complexity 問「能否有效率地解」。前面 R 表能 decide 的 problems、RE 表 yes answer 可 verify 的 problems；本講把時間界線加入，得到 P 與 NP。

## efficiency 要先選 resource

效率可從 code lines、recursion depth、時間、memory、power 或 network communication 量化。本講鎖定 worst-case running time 隨 輸入 size 成長的方式。不能拿一台 laptop 的秒數當數學定義；用 \(n=|w|\) 的 asymptotic bound，忽略 hardware 與 constant factors，追蹤規模放大時的結構成本。

## finite search 在兩種理論中的落差

許多 decidable problems 可枚舉巨大但 finite 的候選空間。decidability 只在乎枚舉終止；complexity 會拒絕 astronomically long search。每個 element 選或不選產生 \(2^n\) 候選，排列可能達 \(n!\)。brute force 對 computability 合法，卻可能在 輸入 100 就失去實務意義。

## LIS：從枚舉到 patience sorting

Longest Increasing Subsequence 的 naive algorithm 列出所有 subsequences，檢查 increasing 並取最長。n 個位置各自取或不取，共 \(2^n\) 個，每個最多掃 n，故 \(O(n2^n)\)。投影片 將宇宙年齡換算成約 \(2^{89}\) nanoseconds，說明 n≥100 時此法幾乎不會完成。

patience sorting 依序把數字放到 top value 大於它的第一 pile，否則新增 pile，並連到前一 pile 的 top。最後從最右 pile top 沿 links 回溯得到一條 LIS。搭配 clever implementation 可達 投影片 給的 \(O(n^2)\)。快速法利用 LIS 結構，correctness 並不顯然；效率提升不能取代 證明。

## shortest path：排列枚舉與 BFS

最短路徑可按 length 列出 node sequences，第一條合法 path 即答案；n-node graph 的 naive bound 是 \(O(n\cdot n!)\)，投影片 提醒 29! nanoseconds 已長於宇宙壽命。它 decidable，卻不是滿意的 algorithm。

Breadth-First Search 按 distance layers 探索，在 n nodes、m edges 的 unweighted graph 上以 \(O(m+n)\) 找 shortest path。BFS 使用「第一次到達 vertex 時已走最少 edges」的 invariant，不必列出所有 paths。候選很多，不代表必須逐一搜尋。

## polynomial 與 exponential 的分界

runtime 為某 constant k 的 \(O(n^k)\) 稱 polynomial time。polynomials 對 輸入 小幅增加通常不造成 exponential explosion；\(2^n\)、\(n!\) 則快速失控。這不保證每個 polynomial algorithm 實務都快：\(n^{100}\) 與巨大 constant 仍可能很糟。

brute-force optimization 常至少 exponential，clever algorithms 常出現 \(O(n)\)、\(O(n^2)\)、\(O(n^3)\)。這是 motivating pattern，不是 theorem；LIS 與 shortest path 正說明如何避開枚舉。

## Cobham–Edmonds Thesis

thesis 說 語言 能有效率 decide，當且僅當存在 polynomial-time TM decider，即 runtime 為某 \(k\in\mathbb N\) 的 \(O(n^k)\)。像 Church–Turing Thesis，它不是 theorem，而是對 efficient computation 的 modeling assumption，也有 edge cases 與爭議。

選 polynomial 的理由包括 closure：兩個 polynomials 的 sum、product、composition 仍是 polynomial。依序跑 algorithms、合理次數重複呼叫、把一個 output 餵給另一個，不會因組合跳出效率類別。

## class P

\[
P=\{L\mid \text{there is a polynomial-time decider for }L\}.
\]

在 thesis 下，P 是能有效率 solve 的 problems。所有 regular 語言 都在 P，可用 linear-time TM；所有 CFLs 也在 P，但需要 CYK 或 Earley algorithm。P⊆R，因 polynomial bound 保證 halt；decidable 卻只承諾某 finite time，不承諾 polynomial。

## 大 search space 與短 見證

投影片 展示 paths 與 subsets：候選至少 exponential 多，但每個 object 不大。simple path 長度不超過 graph nodes；subset 元素數不超過原 set。從巨大空間找 見證 可能很難，一旦有人交出 見證，檢查往往容易。

Sudoku solution 可逐格驗證；length≥5 的 increasing subsequence 可檢查 indices/value order；Hamiltonian path candidate 可檢查每 node 恰一次與 consecutive edges。這把 verifier intuition 加上 resource bounds。

## polynomial-time verifier 的兩個界線

普通 verifier V always halts 且

\[
w\in L\leftrightarrow\exists c\in\Sigma^\*.V\text{ accepts }\langle w,c\rangle.
\]

polynomial-time verifier 另要求 V runtime 是 \(O(|w|^k)\)，且每個 member 有 length \(O(|w|^r)\) 的短 證明憑證。只有 檢查器 快仍不夠；若唯一 證明憑證 exponential 長，連讀完都無法在 輸入-length polynomial time 完成。

## class NP 與 NP ⊆ R

\[
NP=\{L\mid \text{there is a polynomial-time verifier for }L\}.
\]

NP 來自 nondeterministic polynomial time 的等價 characterization，不是 “non-polynomial”。枚舉所有 polynomial-length 證明憑證 並執行 verifier，數量雖可能 exponential，仍 finite，因此得到 decider，證 NP⊆R。

R/RE 與 P/NP 看似平行：前者是 unrestricted decider/verifier，後者是 polynomial decider/verifier。但 R≠RE 不能類推 P≠NP，加入時間 bound 改變了問題。

## 為何 P ⊆ NP

若 L∈P，有 polynomial decider M。構造 verifier V(w,c) 忽略 c，直接跑 M(w)。V polynomial time，members 以 empty 證明憑證 即成功，故 L∈NP。未知的是 inclusion 是否 strict；P vs NP 問 \(P=NP\) 或 \(P\subsetneq NP\)。

## P versus NP 的精確問題與影響

問題是：「若 solution 能 efficiently check，是否也能 efficiently solve？」已知 efficiently verifiable、但沒有 known efficient solutions 的例子包括 Steiner tree、shortest common supersequence、optimal register allocation 與 job scheduling。

若 P=NP，所有 NP problems 都有 polynomial algorithms；若 P≠NP，則存在 NP problems 無 polynomial solution。投影片指出這是 theoretical CS 核心 open question，Clay Mathematics Institute 提供一百萬美元獎金。多數 researchers 傾向 P≠NP，但 opinion 不是 證明。

## 為何 undecidability 技巧不能直接搬來

R 與 RE separation 使用 universality 與 self-reference。自然會問能否同樣 diagonalize P 與 NP。投影片 給 Baker–Gill–Solovay theorem：純粹依賴 universality 與 self-reference 的 證明 不能 resolve P versus NP。

這不表示所有 diagonalization 無用，而是指出 relativizing techniques 的 barrier。證明「沒有任何 algorithm」與證明「沒有 polynomial algorithm」需要不同精細度，前講 trickster 不能自動轉成 lower bound。

## 可執行自測

對 LIS 與 shortest path 各寫 naive candidate count、per-candidate work、fast bound 與 invariant。判斷 \(n^{50}\)、\(2^{\sqrt n}\)、\(n\log n\) 是否符合 \(O(n^k)\)。再替 Sudoku、長度至少五的 increasing subsequence、Hamiltonian path 指定 證明憑證 與 檢查器。

最後從定義證 P⊆NP、NP⊆R，並解釋為何 R≠RE 不能推出 P≠NP，以及 Baker–Gill–Solovay 在 投影片 中阻擋哪種直接搬用。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「decidable 不等於 feasible」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 26: Complexity Theory](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/)
- [Official Lecture 26 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/Lecture%20Slides.pdf)
- [Clay Mathematics Institute：P versus NP](https://www.claymath.org/millennium/p-vs-np/)
- [Baker, Gill, and Solovay, Relativizations of the P=?NP Question](https://doi.org/10.1137/0204037)
- [MIT OpenCourseWare：Complexity Theory](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec8/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
