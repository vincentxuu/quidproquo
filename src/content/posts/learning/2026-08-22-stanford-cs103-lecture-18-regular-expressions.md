---
title: "Stanford CS103 Lecture 17：正規表示式"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 19
tldr: "本講從「從 closure 性質 走向描述語言的語法」推進到「regex 是數學表示式，不等於某套程式庫」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「從 closure 性質 走向描述語言的語法」與「regex 是數學表示式，不等於某套程式庫」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-18-regular-expressions-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 19 篇，對應 **Spring 2026 官方 Lecture 17（2026-05-08）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Regular Expressions**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 從 closure 性質 走向描述語言的語法

投影片 先複習 語言 concatenation：若 \(w,x\in\Sigma^\*\)，\(wx\) 是把兩字串依序接起來；若 \(L_1,L_2\) 是 語言，則

\[
L_1L_2=\{wx\mid w\in L_1\land x\in L_2\}.
\]

例如 \(L_1=\{a,ba,bb\}\)、\(L_2=\{aa,bb\}\)，結果是 `aaa`、`abb`、`baaa`、`babb`、`bbaa`、`bbbb`。順序重要，這不是 Cartesian product，也不是把兩集合直接 union。

對 \(L=\{aa,b\}\)，\(L^0=\{\varepsilon\}\)，\(L^2=\{aaaa,aab,baa,bb\}\)，\(L^3\) 則由三個 L-elements 的所有串接形成。Kleene closure

\[
L^\*=\{w\in\Sigma^\*\mid \exists n\in\mathbb N, w\in L^n\}
\]

收集零次以上重複。前一講已建立 regular 語言 對 complement、union、intersection、concatenation 與 star closed。本講把這些 operations 變成一套語法，讓我們不用每次先畫 automaton 才能描述 regular 語言。

## regex 是數學表示式，不等於某套程式庫

regular expression（regex）以 pattern 描述 語言，實務上用於 validation、grep、flex 與 compiler。不過 CS103 使用的是理論核心語法；Python 或 JavaScript 的 anchors、lookaround、backreference 等擴充不自動屬於本講模型。尤其 backreference 可超越 regular 語言，不能拿實作用法反推課堂定理。

建構方式是 bottom-up：先有幾個已知 regular 的 atomic 語言，再以 closure operations 組合。每一個有限 expression tree 都由合法原子與運算形成，因此它描述的 語言 保持 regular。這與 induction 相似：atoms 是 base cases，operators 是 inductive constructors。

## 三個 atomic regular expressions

相對 alphabet \(\Sigma\)，基本 regex 有三類：

- \(\emptyset\) 表示 empty 語言 \(\emptyset\)，一條字串也沒有；
- 每個 \(a\in\Sigma\) 本身是 regex，表示 singleton 語言 \(\{a\}\)；
- \(\varepsilon\) 表示 語言 \(\{\varepsilon\}\)。

後兩個最容易混淆。\(\emptyset\) 的 語言 沒有 elements，所以不 match empty string；\(\varepsilon\) 的 語言 恰有一個 element，而該 element 長度為零。字元 regex `a` 只 match 長度 1 的 `a`，不是任意含 a 的字串。

## 三個 constructors 與 parentheses

若 \(R_1,R_2\) 已是 regex，可建立 concatenation \(R_1R_2\)、union \(R_1\cup R_2\)、Kleene closure \(R_1^\*\)，並以 parentheses 控制 grouping。其形式語意是

\[
\begin{aligned}
\mathcal L(\varepsilon)&=\{\varepsilon\}, & \mathcal L(\emptyset)&=\emptyset, & \mathcal L(a)&=\{a\},\\
\mathcal L(R_1R_2)&=\mathcal L(R_1)\mathcal L(R_2), &
\mathcal L(R_1\cup R_2)&=\mathcal L(R_1)\cup\mathcal L(R_2),\\
\mathcal L(R^*)&=\mathcal L(R)^\*, & \mathcal L((R))&=\mathcal L(R).
\end{aligned}
\]

regex 本身是一段 syntax；\(\mathcal L(R)\) 才是 strings 集合。說「字串屬於 regex」是型別不精確，應說 \(w\in\mathcal L(R)\) 或 R matches w。

## precedence：star、concatenation、union

優先序由高到低是 parentheses、Kleene star、concatenation、union。因此

\[
ab^\*c\cup d
\]

解析為 \(((a(b^\*))c)\cup d\)，不是 \((ab)^\*(c\cup d)\)。實作自測時先畫 syntax tree：root 是最低優先的 union；左 subtree 是三段 concatenation；其中 b 節點先套 star。

投影片 的 `trick∪treat` 表示二元素 語言；`booo*` 中 star 只作用於最後一個 o，所以至少有 `boo`，再多零個以上 o；`candy!(candy!)*` 則是一個以上 `candy!`。若要讓整段重複，parentheses 不可省。

## 設計題一：包含 substring aa

令 \(\Sigma=\{a,b\}\)，目標是所有含 `aa` substring 的字串。先固定必須出現的核心 `aa`，左右可是任意 \(\Sigma\)-string：

\[
(a\cup b)^\*aa(a\cup b)^\*=\Sigma^\*aa\Sigma^\*.
\]

左 star 吸收 `aa` 前的 prefix，右 star 吸收 suffix。`aaaa` 可以有多種 decomposition，但 membership 只需存在一種。`bbabbbaabab` 只要其中某處出現相鄰 aa 即 match；沒有相鄰 aa 的 `abab` 不 match。不要寫成 \(\Sigma^*a\Sigma^*a\Sigma^\*\)，後者只要求兩個 a，未要求相鄰。

## 設計題二：長度恰為四

同一 alphabet 下，每個位置都能是任意 symbol，所以

\[
\Sigma\Sigma\Sigma\Sigma=\Sigma^4.
\]

它 match `aaaa`、`baba`、`bbbb`、`baaa` 等所有 16 條長度 4 字串，不 match 長度 3 或 5。這裡 superscript 4 是四次 concatenation，不是 set cardinality，也不是 Kleene star。投影片 的 shorthand 定義 \(R^n\) 為 R 串接 n 次，edge case \(R^0=\varepsilon\)。

## 設計題三：至多一個 a

若字串至多含一個 a，所有 b 先出現零次以上，中間 optional a，再接零次以上 b：

\[
b^\*(a\cup\varepsilon)b^\*.
\]

它涵蓋零個 a 的 `bbbb`、一個 a 的 `bbab`、單獨 `a` 與 empty string。投影片也寫 shorthand \(b^\*a?b^\*\)，其中 \(R?\) 定義為 \(R\cup\varepsilon\)。

候選 \(\Sigma^\*a\Sigma^\*\) 錯在要求至少一個且可能多個 a；\(b^\*ab^\*\cup b^\*\) 正確但較冗長；\(b^\*a^\*b^\*\) 允許多個連續 a；\(b^\*(a^\*\cup\varepsilon)b^\*\) 同樣允許多個 a，且 \(\varepsilon\) 已包含在 \(a^\*\) 中。逐一找 counterexample 比憑外觀判斷可靠。

## email 範例：逐段建立而非宣稱完整標準

投影片 把所有字母抽象成單一 character `a`，alphabet 是 \(\{a,.,@\}\)，目的是練組合，不是完整驗證現實 email 規範。非空文字段是 \(aa^\*=a^+\)；local part 可由一個以上非空段以 dot 分隔：

\[
a^+(\.a^+)^\*.
\]

接著必須有 `@`。domain 至少要有兩個非空 dot-separated segments，並可再增加，寫成

\[
a^+(\.a^+)^+.
\]

合起來得到 投影片 的

\[
a^+(\.a^+)^\*@a^+(\.a^+)^+.
\]

這會接受類似 `a.a@a.a.a` 的抽象形式，排除開頭 dot、連續 dots、空 local segment、沒有 @ 或 domain 無 dot。shorthand \(R^+=RR^\*\)，表示一個以上；它不同於 \(R^\*\) 可取零次。

## regex 到 NFA：結構歸納與 Thompson 思路

定理一：若 R 是 regular expression，\(\mathcal L(R)\) regular。證明可對 expression 的結構做 induction。base atoms 各有小 NFA：\(\emptyset\) 無 accepting path，\(\varepsilon\) 由 epsilon 到 accept，character a 由 a-edge 到 accept。

inductive cases 對應已證 closure constructions：union 新增 epsilon dispatch；concatenation 從第一機器 accepts epsilon 連到第二 start；star 新增接受 start，並 epsilon 進入與迴圈回原機器。於是任何有限 regex 都能轉成 NFA，再由 subset construction 轉 DFA。投影片 提到實務 matcher 常用 Thompson's algorithm，正是系統化做這些局部 constructions。

## regular 語言 到 regex：generalized NFA

更不顯然的反向定理是：若 L regular，就存在 regex R 使 \(\mathcal L(R)=L\)。由 regular 得一台 NFA，接著暫時允許 transition label 是任意 regex，形成 generalized NFA。這只是 證明 device；普通 NFA edges 仍只能是 characters 或 epsilon。

先新增乾淨 start \(q_s\)，以 epsilon 連向舊 start；新增唯一 accept \(q_f\)，由每個舊 accepting state epsilon 連過去。接著反覆 eliminate 中間 state。若要移除 state \(k\)，對每個 remaining pair \(i,j\)，把 direct label \(R_{ij}\) 更新為

\[
R_{ij}\ \cup\ R_{ik}(R_{kk})^\*R_{kj}.
\]

第二項描述從 i 進 k、在 k loop 零次以上、再離開到 j；union 保留原本不經 k 的 paths。沒有 edge 可視為 \(\emptyset\)，多條平行 edges 用 union 合併。

投影片的兩個中間 states 圖以 \(R_{11},R_{12},R_{21},R_{22}\) 示範。消去 \(q_1\) 後，從 start 經 \(q_1\) 到 \(q_2\) 的 label 含 \(R_{11}^\*R_{12}\)；\(q_2\) 的 loop 要把既有 \(R_{22}\) 與繞過 \(q_1\) 的 \(R_{21}R_{11}^\*R_{12}\) union。每次更新都保存所有 path labels 的 語言。

直到只剩 \(q_s,q_f\)，兩者間的單一 regex label 就描述原 NFA 的全部 accepting paths。於是 regex 語言、NFA 語言、DFA 語言 三者恰好都是 regular 語言。

## 常見語意誤判

star 永遠包含零次，因此 \(R^\*\) 一定 match \(\varepsilon\)；plus 才要求至少一次。union 是 語言 OR，不是把字元混排。concatenation 保留順序，卻可能有多個合法切點。dot 在 投影片 email alphabet 是 literal character，不是許多 programming regex 中的 wildcard；\(\Sigma\) 才代表任意 alphabet character。

此外，證 regex 正確要做兩個方向。對任意 match，解釋其 decomposition 為何滿足 specification；對任意符合 specification 的 string，指出如何切成各 subexpressions。只列三個 positive 例子 不能排除 overmatching。

## 可執行自測

先對 `ab*c∪d` 畫 syntax tree，再列長度不超過 4 的 matches。其次為「恰有一個 a」與「至多一個 a」各寫 regex，以 \(\varepsilon,b,a,aa,bab\) 做差異測試。再把 email pattern 的每個 plus 改成 star 一次，為每個變體找一條不該接受卻被接受的 counterexample。

最後選三狀態 NFA，新增 clean start/accept，消去一個 state 時逐 pair 套 \(R_{ij}\cup R_{ik}R_{kk}^\*R_{kj}\)。消去前後各列三條 path labels，確認沒有遺漏 direct path、loop 任意次與經中間 state 的 path。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「從 closure 性質 走向描述語言的語法」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 17: Regular Expressions](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/)
- [Official Lecture 17 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
