---
title: "Stanford CS103 全課總結：四條知識主線與下一門課"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 29
tldr: "最後一講把證明、圖論、自動機與可計算性重新接起來，再對照會直接使用這些基礎的 Stanford 後續課程。"
description: "依官方總結投影片整理 Spring 2026 當期公告、四條課程主線與後續選課方向。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-28-wrap-up-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 29 篇，對應 **Spring 2026 官方 Lecture 27（2026-06-01）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/27/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/27/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Wrap-Up**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 這講的角色與當期公告

最後一講不是新增 theorem，而是公告、全課回顧、後續課程地圖與 Q&A。投影片 記載 final exam 在 Saturday 8:30–11:30，規則同 midterms：一張 8.5×11 吋 notes、不可用 electronic devices、所有 psets 與 lectures 累積考察，但本講除外。課後 4:30–6:30 有 review session，使用 practice exam；學生也被請託在 Axess 評課。

這些是 Spring 2026 當期公告，不應移植成未來 offering 規則。自學者可帶走的是回顧結構，不是已過期日期。

## 發現史不等於教學順序

課程按概念依賴安排，而非按年代。投影片 提醒 regular 語言 的發展晚於 Turing machines；Cantor 研究不同大小的 infinity 時，\(\cup\)、\(\cap\) symbols 尚未發明。今天從 sets、logic 走到 automata，是為了逐層搭 定義/證明，不表示歷史也循此路徑。官方 Timeline of CS103 Results 可延伸查閱。

## 集合、邏輯、函數與 證明 語言

課程從 set theory、power sets、Cantor's theorem 開始，以 direct 證明、contrapositive、contradiction 處理 parity、modular congruence、perfect squares、triangular numbers。propositional/FOL、translations、negations、completeness 與 vacuous truth 提供精確敘述語言。

函數 單元把 injections、surjections、bijections、involutions、monotone 函數、Minkowski sums 串到 cardinality。主線不是術語清單，而是 object、定義、quantifier、證明 move 如何對齊。

## graphs 與 induction

graphs 涵蓋 connectivity、independent sets、vertex covers、trees、bipartite graphs，再連到 pigeonhole principle、Ramsey theory 與 spanning tree protocol。path、coloring、cover、tree invariant 都把結構定義轉成 證明 obligation。

mathematical/complete induction 把 local 步 推向所有 sizes，支撐 recursive objects、graph structures 與 automata constructions。高階課程中的 algorithm invariant 或 recursive semantics，仍使用「base + preservation」模式。

## formal 語言 與 automata

formal 語言 把 problems 寫成 strings 集合。DFA、NFA、regex 經 subset construction、Thompson's algorithm、state elimination 互轉；closure 性質 與 Kleene closure 說明可安全組合哪些 語言。monoids、error-correcting codes 顯示 string abstraction 不只服務 parsing。

Myhill–Nerode、distinguishability、nonregular 語言 提供 lower-bound 視角；CFG 再擴充 nested syntax。不能只說「寫不出 DFA」，而要以可區分 prefixes 建立 impossibility。

## computation 的能力與極限

Turing machines 與 Church–Turing Thesis 定義一般 computation；TM encodings 讓 programs 成為 data，Universal TM 產生 universality，self-reference 讓 program 作用於自身。這些能力也導向 self-defeating objects、diagonalization 與 undecidability。

decidability/recognizability、HALT、verifiers、R/RE、co-RE 分開「能解」、「能驗證 yes」、「能驗證 no」。P、NP、NP-completeness、P≟NP 再加入 efficiency。整體弧線是先形式化 reasoning，再形式化 machines，最後證明 machines 的 limits。

## 投影片 的跨課程連結（一）

CS255 cryptography 使用 sets 間 函數、cartesian products、injectivity 與 efficiency 定義；CS124 From Languages to Information 使用 graph 定義、closure transformations 與「big regex」；CS237A robot autonomy 用 set theory 描述世界、以 函數 model paths。CS251 blockchain 的結構也可被看成 函數。

CS143 compilers 使用 CFG 與由 CFG 導出的 automata；CS221 AI 出現 DFA；CS243 program analysis 使用具有特定 性質 的 函數；CS161 algorithms 使用 FOL 與 函數；CS224W 用 set difference、cardinality 與 graph 上的 first-order 定義。

## 投影片 的跨課程連結（二）

CS242 programming 語言 重用 CFG；CS166 data structures 以 strings 定義；CS144 networking 出現 DFA generalization；CS168 algorithms 使用 Myhill–Nerode-style argument；CS154 以 TMs 定義 intrinsic information content；CS246 mining 使用 函數、union、cardinality；CS250 codes 從 alphabets 與 語言 出發。

共同點不是課名，而是 定義/證明 成為閱讀高階材料的共同語彙。投影片 的訊息是「已有 foundation」，不是「已學完整門後續課」。

## 最直接的四個後續方向

CS154 Introduction to the Theory of Computation 被稱為 spiritual sequel，深入 automata、TMs、computability/complexity。CS161 Design and Analysis of Algorithms 轉向 efficient algorithm design，也對 interviews 有幫助。

CS143 Compilers 把 automata/CFG 用於 source-to-machine-code translation；CS257 Automated Reasoning 自動化 formal 證明，使用 SAT 與 propositional logic。可依自己最喜歡的 object：machines、algorithms、語言 或 證明 選擇。

## 更廣的 theory/application 地圖

theory 列表還有 CS229M ML Theory、CS250 Codes、CS255 Cryptography、CS259Q Quantum Computing、CS265 Randomized Algorithms。applications 包含 CS112 Operating Systems、CS124 LLMs、CS131 Computer Vision、CS224W ML on Graphs、CS242 Programming Languages、CS243 Program Optimization、CS246 Mining Data Sets、CS251 Blockchain。

這是 投影片 當下的探索地圖，不是 prerequisite guarantee 或最新 schedule；實際選課仍要查 catalog、先修與當期 offering。

## 用概念圖驗收全課

畫四個 arrows：sets/logic → 證明；graphs/induction → structural reasoning；語言/automata → representation/translation；TMs → limits/complexity。每條各寫一個 定義、一個 construction、一個 impossibility 證明。

再任選 投影片 的高階課程，回答：CS103 哪個 object 再出現？新增什麼 定義？證明 obligation 如何改變？若能說清 CS143 為何需要 CFG/automata、CS255 為何在乎 injectivity/efficiency，知識就已從章節名稱變成可遷移工具。

## 短材料例外

本 投影片 主要由 announcements、一頁術語牆、多張高階課程截圖、推薦清單與 Q&A 組成，沒有新 theorem 證明 或解題 sequence。正文以完整覆蓋可見 agenda 與跨課程連結為目標，不硬擴成一般教科書章節，也不臆造未公開的學生提問。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「這講的角色與當期公告」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 27: Wrap-Up](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/27/)
- [Official Lecture 27 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/27/Lecture%20Slides.pdf)
- [Stanford CS154：Introduction to Automata and Complexity Theory](https://web.stanford.edu/class/cs154/)
- [Stanford CS161：Design and Analysis of Algorithms](https://web.stanford.edu/class/cs161/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
