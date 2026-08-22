---
title: "Stanford CS103 Lecture 22：圖靈機 III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 24
tldr: "本講從「recognizer 與 decider 的快速量詞稽核」推進到「為何所有問題都能寫成 語言」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「recognizer 與 decider 的快速量詞稽核」與「為何所有問題都能寫成 語言」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-23-turing-machines-3-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 24 篇，對應 **Spring 2026 官方 Lecture 22（2026-05-20）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Turing Machines, Part III**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## recognizer 與 decider 的快速量詞稽核

投影片 先測幾個容易偷換概念的敘述。若 M recognizes L 且 M rejects w，則 \(w\notin L\)，因 members 必 accept；此句成立。若 \(w\notin L\)，M 不一定 reject，可能 loop。若 M loops on 某個 \(w\in L\)，只能推出這台 M 不 recognize L，不能推出 L 本身 unrecognizable，因也許存在另一台 recognizer。

decider 更強：若 M decides L，member accept、nonmember reject，且每個 輸入 halt。因此 M 在任一 w loop 就能推出 M 不是 L-decider；仍不能單憑一台失敗機器推論 L undecidable。存在性定義的否定必須排除所有 machines。

這些小題替後續 self-reference 做語意校準。accept/reject 是某 machine run 的 outcome；recognizable/decidable 是 語言 存在某種 machine 的 性質，層級不可混用。

## 為何所有問題都能寫成 語言

DFA、NFA、TM 的 輸入 都是 string，輸出 yes/no，所以它們解 decision problems。看似不同的函式 `isAnBn(string)`、`isPalindrome(string)`、`isBipartite(Graph)`、`containsCat(Picture)` 其實都能轉成 membership：把 object 編碼成 string，接受的 encodings 集合就是 語言。

投影片 的 humbling thought 是電腦上所有資料最終都是 bits。不同 bitstrings 可表示不同 pictures；並非每個 bitstring 都是 valid image，但 parser 可先判定 encoding well-formedness。資料型別不需要擴充 TM 輸入 model。

## object encoding 的抽象 contract

對 finite discrete object Obj，以 \(\langle Obj\rangle\) 表某種 string encoding，像 disk file。課程不固定 bit layout，只假設 encoding/decoding 可有效完成且不含糊。alphabet 選擇也不改 computability，因有限 alphabets 之間可再 encode。

於是能定義：

\[
\{\langle n\rangle\mid n\in\mathbb N\text{ is even}\},
\quad
\{\langle G\rangle\mid G\text{ is bipartite}\}.
\]

尖括號不是 ordered pair 或內積，而是「這個 object 的 encoding」。若 輸入 不是任何合法 encoding，machine 也應有明確 policy，通常 reject；不過特定 encoding 細節不影響高階 證明。

## 多個 objects 打包成一條 string

對 \(Obj_1,\ldots,Obj_n\)，\(\langle Obj_1,\ldots,Obj_n\rangle\) 是可拆回各 components 的單一 encoding，類似 tuple 或無壓縮 zip。delimiter、length prefix 或 escaping 都可，只要解碼唯一。

因此 regex matching 問題可表示為

\[
\{\langle R,w\rangle\mid R\text{ is a regex and }R\text{ matches }w\},
\]

graph reachability 是 \(\{\langle G,s,t\rangle\mid s\leadsto t\}\)。語言 不再像「一堆字串 trivia」，而是任何 finite problem instances 的 yes-set。

## emergent 性質：universality 與 self-reference

投影片 把兩個能力稱 computational devices 的 emergent 性質。universality：存在一台固定 device 能執行任意 computation。self-reference：program 能取得並運算自己的 source representation。兩者由 encoding 與 simulation 組合而生，不是 Move/Write 任一 primitive 單獨具備。

這些能力是 modern computing 的基礎，也將成為 Achilles’ heel。能把 program 當 data、又能讓 program 作用於自身，才可建立下一講的 diagonal/self-defeating constructions。

## 從專用 TM 到可重新編程的 simulator

過去每個 TM 固定解一題：一台 recognize \(a^nb^n\)，另一台跑 hailstone。physical computer 卻是一份 hardware 載入不同 programs。差異可由 simulator 消除：寫

```text
simulateTM(M, w)
```

讀取 M 的 source encoding 與 w，逐步重現 M。M accept 時 simulator true；M reject 時 false；M loop 時 simulator 也 loop。第三條不可改成 reject，否則 simulator 必須偵測永不停止，這並非逐步模擬能做到。

## Universal Turing Machine 定理

Turing 1936 theorem：存在固定 universal TM，記 UTM，使對任意 TM M 與 string w，UTM 在 \(\langle M,w\rangle\) 上模擬 M(w)，並保留 observable 行為：

\[
\begin{aligned}
M\text{ accepts }w &\Rightarrow UTM\text{ accepts }\langle M,w\rangle,\\
M\text{ rejects }w &\Rightarrow UTM\text{ rejects }\langle M,w\rangle,\\
M\text{ loops on }w &\Rightarrow UTM\text{ loops on }\langle M,w\rangle.
\end{aligned}
\]

UTM 是一台 fixed machine，變動的是 encoded program/輸入。這正是 laptops、phones、routers 的 stored-program intuition：hardware 不為每個 app 重造，載入 code 後解釋執行。

## UTM 如何逐步維持 simulation

conceptual construction 把 tape 分區：一區保存 simulated M 的 source code，一區保存 M 的 simulated tape。另以 marker 記 simulated head position，並保存 simulated program counter。

每輪 UTM 查 code，找到當前 instruction；查看 simulated head cell；計算 Write/Move/Goto/If 的效果；更新 tape、head marker 與 counter。若 M Return True/False，UTM 同步 accept/reject；若 M 永遠有下一步，UTM 也永遠模擬。證明 invariant 是「UTM 完成 t 輪後，其 encoded configuration 恰等於 M 執行 t 步驟 後 configuration」。

UTM 可能每模擬一步要掃很多 tape，效率很差，但 computability 行為 相同。接受 Church–Turing Thesis 後，它在 capability 意義上已能執行任何 feasible computation，儘管本質只是一個 interpreter。

## ATM：把 machine 行為 變成 語言

UTM 本身是一個 recognizer，它 recognize

\[
A_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ is a TM and }M\text{ accepts }w\}.
\]

若 M accepts，UTM accepts；M rejects，UTM rejects；M loops，UTM loops。因此 \(A_{\mathrm{TM}}\in RE\)。這裡尚未證 \(A_{\mathrm{TM}}\in R\) 或不在 R；那是下一階段的 undecidability 結論。

三個等價敘述要熟練切換：M accepts w；UTM accepts \(\langle M,w\rangle\)；\(\langle M,w\rangle\in A_{\mathrm{TM}}\)。例如

\[
\langle UTM,\langle N,x\rangle\rangle\in A_{\mathrm{TM}}
\]

表示 UTM accepts \(\langle N,x\rangle\)，再展開即 N accepts x。nested encoding 每一層都要按 定義 解一次。

## interpreter 與 virtual machine 的實務對應

把被模擬 TM 換成 ordinary program，就得到 `simulateProgram(code,input)`。Python interpreter 執行 Python code，browser interpreter 執行 JavaScript；virtual machine 模擬整個 OS/hardware environment。這些不是 UTM theorem 的偶然類比，而是同一 stored-program/simulation pattern 的工程版本。

universality 不表示每台實際 interpreter 支援所有 語言 或永遠有 memory。理論 claim 是 idealized model 可寫出某個 simulator；實務 systems 受 resources、security policy、instruction set 限制。

## quine：不用讀檔案也輸出自己的 source

quine 是執行後 print 自己 source code 的 program，且不能靠開啟存放 source 的 external file。讀檔會依賴環境中可能被修改的副本，並非內在 self-reference。quine 通常將一段 template/data 與「如何 quote 這段 data」的 code 組合，使 output 恰好重建整份 program。

投影片 不要求背某個語言的 quine 字串；重點是 existence。program descriptions 本身可 encode 成 data，而 universal computation 能對 encoded programs 做 transformations，所以 sufficiently powerful systems 可建 self-referential software。

## arbitrary computation on own source

投影片 給 theorem-level claim：可構造 TM 對自己的 source code 執行任意指定 computation。後續可把每個 函數 想成能取得 `me`，即自身 source encoding。

例一 `narcissist(input)` 回傳 輸入 是否等於自身 source；其 語言 是 singleton \(\{\langle narcissist\rangle\}\)。例二 `acceptLongerStrings(input)` 比較 輸入 length 與 own source length。這不代表 program 透過 magic runtime API 讀檔，而是 compilation/self-reference construction 把所需 representation 內建到 program 行為。

self-reference 的 quantifier 是 existence：對想要的 transformation，可構造一個合適 program。不能據此假設任何任意既有 binary 都天然知道自己檔案位置、build metadata 或 byte-for-byte source。

## 常見語意錯誤

第一，把 \(\langle M,w\rangle\) 當 M 執行結果；它只是 輸入 encoding。第二，認為 simulator 可在 M loop 時 return「loop」；faithful UTM 自身也 loop。第三，從 \(A_{\mathrm{TM}}\) recognizable 誤推 decidable；recognizer 對 looping instances無答案。

第四，從「某 M 在 member loop」推 L unrecognizable；只能推 M 不是 recognizer。第五，把 encoding choice 當能力來源；只要 translations computable，換 syntax 不改 decidability。第六，把 quine 偷換成讀 source file，失去 self-contained construction。

## 可執行自測

先判斷四句：recognizer reject nonmember 是否必然、nonmember 是否必 reject、member 上 loop 對 M 與 L 各推出什麼。再把 graph bipartite、vertex cover、regex matching 各寫成 encoding 語言，明列 tuple components。

接著給三台 M：立即 accept、立即 reject、無限 loop；逐一寫 UTM 在 \(\langle M,w\rangle\) 的 outcome 與是否屬於 \(A_{\mathrm{TM}}\)。最後展開 nested statement \(\langle UTM,\langle N,x\rangle\rangle\in A_{\mathrm{TM}}\) 的兩層語意，並用一句話區分 quine construction 與讀檔印出。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「recognizer 與 decider 的快速量詞稽核」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 22: Turing Machines, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/)
- [Official Lecture 22 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
