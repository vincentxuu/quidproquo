---
title: "Stanford CS103 Lecture 21：圖靈機 II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 23
tldr: "本講從「sample TM：從最後一格回看第一格」推進到「TM 能做的工作遠超逐格配對」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「sample TM：從最後一格回看第一格」與「TM 能做的工作遠超逐格配對」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-22-turing-machines-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 23 篇，對應 **Spring 2026 官方 Lecture 21（2026-05-18）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Turing Machines, Part II**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## sample TM：從最後一格回看第一格

投影片 先以一支短程式複習六種 commands。輸入 alphabet 是 \(\{a,b\}\)：先要求第一格是 a，接著一路右移到 Blank，再左移兩格檢查最後一個 輸入 character 是否 b。它接受的 語言 是

\[
\{w\in\{a,b\}^\*\mid |w|\ge2, w\text{ starts with }a\text{ and ends with }b\}.
\]

regex 可寫 \(a(a\cup b)^\*b\)。長度 1 的 `a` 在走到右側 Blank 後左移兩格會回到左側 Blank，故不接受；`ab`、`aab`、`abb` 接受；空字串一開始就因不是 a 而拒絕。這個例子強調 TM head 可掃到末端再回頭，而每條 If 仍依 sequential semantics 執行。

## TM 能做的工作遠超逐格配對

前一講已見過檢查 \(a^nb^n\)、比較 a/b 數量與 sorting。投影片 再列 Fibonacci membership、把數 n 轉成 n 個 a、檢查 tautonym（同一 string 重複兩次）等 starter machines。共同點不是某個特別 trick，而是 tape 能編碼 numbers、arrays、intermediate strings 與 control data。

因此主問題變成：TM 的 low-level vocabulary 只有 Move、Write、Goto、Return、If、If Not，是否足以表達一般 computer program？比較 power 時不要求相同速度或程式大小，只要求一個 model 的每個 computation 能被另一個 faithful simulate。

## idealized computer 與互相模擬

real computer 有有限 RAM/disk；idealized computer 保留一般程式語言與執行方式，但永不耗盡 memory。投影片 的 theorem-level claim 是 TM 與 idealized computers computationally equivalent：雙方能互相 simulate。

computer 模擬 TM 很直接。用可增長資料結構表示 tape，以 integer 表 head index，以 program counter 表目前 line；每輪 decode 一條 TM instruction 並更新三者。因每條指令都簡單，能模擬 primitives 就能由 induction 模擬任意長 program execution。

反向則把 high-level constructs 拆成 TM routines。variables 是 tape 上編碼的 values；arrays 是有 delimiter 的 sequences；loops 與 函數 calls 可由 labels、Goto 和 bookkeeping 模擬。得到的 TM 可能 colossal、slow，卻仍算同一 輸入-output 行為。computability 忽略 constant factors 甚至巨幅 slowdown，只問能否完成。

## data type 不增加基本 computability

投影片 以 cat pictures、videos、music 與 ChatGPT 問 TM 能否處理。picture 是 colors 的二維 array，video 是 pictures sequence，music 是數值化 waveform，neural network inference 是 matrices 與 nonlinear 函數 的組合。只要能有限編碼成 symbols 並由一般 program 操作，TM 就能模擬。

這不是說 TM model 適合實際執行大型 AI，也不是效率相同。它只把「資料看似複雜」與「computational model 能否表示」分開。encoding 可能龐大，但有限 object 仍可序列化到 tape。

## Church–Turing Thesis 不是數學定理

Church–Turing Thesis 主張：每一種 feasible method of computation 都等價於或弱於 Turing machine。它不是可由形式 axioms 證明的 theorem，因「feasible method」本身是對物理／直覺 computation 的非形式概念；它是可被新計算方式反駁、經長期檢驗仍成立的 scientific hypothesis。

TM=idealized conventional computer 是模型間可形式化的 simulation claim；Church–Turing Thesis 更進一步涵蓋任何我們會承認為有效計算的方法。不要把兩句混成「Turing 證明所有物理宇宙必然如此」。

接受 thesis 後，後續可在 TM 與 pseudocode 間切換：哪一種更清楚就用哪一種。證 impossible problem 時，排除 TM 也就排除一般 feasible programs，而不必針對 Python、Java、hardware 各證一次。

## Hailstone sequence 暴露第三種執行結果

對正整數 n，hailstone procedure 在 n=1 停；偶數除 2；奇數改為 \(3n+1\)，重複。5、20、7、27 分別會在有限 步驟 抵達 1，但是否所有正整數都終止仍是 Collatz conjecture。

投影片 令 輸入 alphabet \(\{a\}\)，以 \(a^n\) unary encoding n。TM 拒絕 epsilon；當 tape length 不為 1 時，偶數 length halve，奇數 length triple and append one a；抵達單一 a 就 accept。若某 n 的 sequence 永不終止，TM 也永遠 run。

這揭示 TM 與 finite automata 的差異。FA 讀完 finite 輸入 必停；TM 必須明確 Return 才 halt，可能既不 Return True 也不 Return False。等待更久無法區分「之後會停」與「永遠不會停」。

## accept、reject、loop、halt 的集合關係

對 TM M 與 string w：accept 表示 M(w) Return True；reject 表示 Return False；loop 表示兩者都不發生。halt iff accept or reject。三種 outcomes 互斥且涵蓋所有 runs。

因此「M does not accept w」包含 reject **或 loop**；「M does not reject w」包含 accept **或 loop**。只有已知 M always halts 時，not accept 才等同 reject。這個 negation 是整個 recognizability/decidability 區別的語意核心。

## recognizer 與 recognizable 語言

M 是 L over \(\Sigma\) 的 recognizer，若

\[
\forall w\in\Sigma^\*.\;(w\in L\leftrightarrow M\text{ accepts }w).
\]

對 yes instances 必 eventual accept；對 no instances 只要求**不 accept**，可以 reject 或 loop。recognizer 絕不 false positive，但可能永遠不對 negative input給答案。存在 recognizer 的 L 稱 recognizable；這些 語言 的 class 記作 RE。

hailstone TM recognize 的 語言 是「所有其 hailstone sequence terminates 的 positive unary 輸入」。若 sequence terminates，機器 accept；若不 terminate，就 loop，仍符合 nonmember 不 accept。它是否 decider 取決於 Collatz 是否對所有 positive n 終止；目前未知。

## sums of three cubes：enumeration 是半判定

投影片 的例子考察

\[
L_3=\{a^n\mid \exists x,y,z\in\mathbb Z, x^3+y^3+z^3=n\}.
\]

recognizer 令 bound `max=0,1,2,...`，每輪窮舉 \([-max,max]^3\)。若 見證 triple 存在，某個 finite bound 最終包含它，程式 Return True。若不存在，search 永遠擴大而不會 false；所以這證 recognizable，而不是 decidable。

enumeration 必須公平。若先固定 x 並把 y,z 無限搜完，可能永遠到不了其他 x。以逐漸擴大的 finite cubes 掃描，確保每個 integer triple 在 finite time 被訪問。

## decider 與 decidable 語言

M 是 L 的 decider，需同時：

\[
\forall w\in\Sigma^\*.\ M\text{ halts on }w,
\qquad
\forall w\in\Sigma^\*.\;(w\in L\leftrightarrow M\text{ accepts }w).
\]

所以 member accept，nonmember reject，所有 輸入 都有限時間出答案。decider 是 always-halting recognizer。存在 decider 的 語言 稱 decidable；其 class 記 R。decider 不需要事先給 time bound，但每個 輸入 的 actual runtime 必 finite。

R 中包含 regular、context-free 語言 與常見 algorithmic problems。這裡「solved」較強：無論答案 yes/no，執行終將創造確定知識。

## sums of three squares：finite search 可決定

對

\[
L_2=\{a^n\mid \exists x,y,z\in\mathbb Z, x^2+y^2+z^2=n\},
\]

若平方和等於 nonnegative n，每個 absolute value 不會超過 \(\sqrt n\)，投影片 用更寬但有限的 0..n search，sign 對 squares 無影響。窮舉有限 triples；找到即 true，全部失敗後 false。兩條 return paths 都保證抵達，故是 decider。

與 cubes 的差別不是 2 比 3 容易，而是 cubes 可由巨大正負數 cancellation，沒有相同的簡單 finite bound。three-cubes enumeration 若沒找到，不能在某個 bound 後斷言不存在。

## R ⊆ RE 與尚未回答的問題

每個 decider 都是 recognizer，所以 \(R\subseteq RE\)。真正問題是 \(R\stackrel?=RE\)：若 yes answers 可被機器 eventually confirm，是否一定能對 every 輸入 完整決定 yes/no？投影片 此處刻意留下，後續不可判定性會回答。

圖中的包含方向不可畫反。regular ⊆ CFL ⊆ R ⊆ RE ⊆ all 語言；本講已支持前兩類問題有 terminating algorithms，以及 decider 是 recognizer。是否某些 inclusion strict，需要後續 theorem，不能只由圖形直覺宣稱。

## 常見量詞與語意錯誤

recognizer 在 nonmember 上 loop 並不錯；在 member 上 loop 才違反定義。看到程式有 while true 不代表一定 loop，需分析該 輸入 path。另一方面，沒有 false positive 仍不足以成為 recognizer，還要 every member eventually accept。

證 decider 必須分別說 correctness 與 termination。finite loop bounds 是 termination 證據；「如果找到就 return true」只證 recognizer。把 not accept 寫成 reject，等於暗中假設 halt，會把弱 notion 偷換成強 notion。

## 可執行自測

先 trace sample TM 對 \(\varepsilon,a,b,ab,aab,aba,abb\)，確認 regex \(a(a\cup b)^\*b\) 邊界。接著為每個 outcome 填 truth table：accept/reject/loop 是否屬於 halts、does-not-accept、does-not-reject。

再審核 two searches。對 cubes，說明任一存在 見證 為何 eventually reached，以及 nonexistence 為何無 termination 證明憑證。對 squares，寫出 finite bound 與 loop iteration 上限。最後各造一支 recognizer-not-decider 與 decider 的 pseudocode，逐條對照兩個 quantified 定義，不靠「感覺會停」。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「sample TM：從最後一格回看第一格」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 21: Turing Machines, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/)
- [Official Lecture 21 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/Lecture%20Slides.pdf)
- [Stanford Encyclopedia of Philosophy: The Church-Turing Thesis](https://plato.stanford.edu/entries/church-turing/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
