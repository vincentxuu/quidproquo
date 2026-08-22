---
title: "Stanford CS103 Lecture 19：上下文無關語言"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 21
tldr: "本講從「從有限狀態限制轉向遞迴結構」推進到「arithmetic grammar 的四組規則」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「從有限狀態限制轉向遞迴結構」與「arithmetic grammar 的四組規則」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-20-context-free-languages-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 21 篇，對應 **Spring 2026 官方 Lecture 19（2026-05-13）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/19/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/19/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Context-Free Languages**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 從有限狀態限制轉向遞迴結構

投影片 先回顧上一講：infinite distinguishing set 表示有無限多種 prefix information 必須由不同 states 保存，因此不可能有 finite automaton。接著用 Python arithmetic expressions 提問：合法 expression 長度與 nesting depth 沒有固定上限，單一固定格式的 Mad Libs 只能生成某一形狀，如何描述所有遞迴巢狀形式？

答案不是再加很多 DFA states，而是改用 recursive rules。一個 expression 可以是單一 `int`、兩個 expressions 以 operator 相連，或用 parentheses 包住一個 expression。規則的右側再次出現 Expr，於是有限份規則可以生成任意深度的結構。

## arithmetic grammar 的四組規則

投影片 把上述想法寫成：

```text
Expr → int | Expr Op Expr | (Expr)
Op   → + | - | × | /
```

`Expr` 與 `Op` 是 nonterminals，是仍待展開的 placeholders；`int`、parentheses 與四個 operator 是 terminals，是最終字串中保留且不再改寫的 symbols。每條 production 說明看到左側 nonterminal 時，可用右側 string 取代。

例如由 Expr 生成 `int × (int + int)`：

```text
Expr ⇒ Expr Op Expr
     ⇒ Expr Op (Expr)
     ⇒ Expr Op (Expr Op Expr)
     ⇒ int × (int Op Expr)
     ⇒ int × (int Op int)
     ⇒ int × (int + int)
```

每一步只替換一個 nonterminal。替換順序可以不同，只要最後 terminals 相同；derivation 的存在才決定 membership。

## CFG 的四個組成部分

context-free grammar（CFG）形式上包含四項：nonterminal symbols 集合、terminal symbols 集合 \(\Sigma\)、production rules，以及 start symbol。start 必須是 nonterminal，投影片 慣例取第一條 production 左側。

production 形式為 \(A\to\omega\)，其中左側恰是一個 nonterminal A，右側是 terminals 與 nonterminals 的有限 string，也可為 \(\varepsilon\)。「context-free」意指能否替換 A 不取決於 A 左右目前出現什麼 context。這一點會造成強大遞迴能力，也會讓兩個相同 nonterminal occurrences 能獨立選擇 productions。

投影片排版用 bold red uppercase 表 nonterminal、blue monospace lowercase 表 terminal、Greek lowercase 表任意混合 string，但這只是閱讀 convention。自己寫時關鍵是明確宣告型別，避免把字面 `S` 與 nonterminal S 混淆。

## shorthand、derivation 與零步

多條同左側規則可用 vertical bar 合併：\(A\to x\mid y\) 等於兩條 productions。單步替換寫 \(\Rightarrow\)；零步或多步 derivation 寫 \(\Rightarrow^\*\)。因此每個 string \(\alpha\) 都有 \(\alpha\Rightarrow^\*\alpha\)，這個 zero-步 case 在定義 語言 時不可漏掉。

若 G 的 start 是 S，語言 定義為

\[
\mathcal L(G)=\{\omega\in\Sigma^\*\mid S\Rightarrow^\*\omega\}.
\]

最後的 \(\omega\) 必須全部是 terminals。仍含 nonterminal 的 `ddHaa` 即使可在 derivation 中間出現，也不是 語言 element。grammar 是 rules 的有限描述；語言 是所有可完成 terminal derivations 的 strings 集合，兩者型別不同。

## 投影片 的 Q/H membership 題

對 alphabet \(\{a,b,c,d\}\) 與

```text
Q → Qa | dH
H → bHb | c
```

Q 每使用一次 \(Q\to Qa\) 就在最右側累積一個 a，最後以 \(dH\) 結束；H 每遞迴一次在兩側各放一個 b，最後中心是 c。因此 語言 可描述成

\[
\{db^ncb^na^m\mid m,n\in\mathbb N\}.
\]

`dca` 在（n=0,m=1）；`dc` 在（兩者 0）；`bcb` 不在，因缺開頭 d；`cad` 不在，順序錯；`ddHaa` 含 nonterminal，也不在 \(\Sigma^\*\)。逐項判讀應先推導 invariant，再代參數，不必盲目搜尋 productions。

## context-free 語言 與 regular 語言 的關係

若存在 CFG G 使 \(L=\mathcal L(G)\)，L 稱 context-free 語言（CFL）。CFG productions 沒有 regex operators；若寫 `S → a*b`，star 是 literal terminal，語言 只有字串 `a*b`，不是 \(\{a^nb\}\)。要表達重複必須用 recursion。

每個 regular 語言 都 context-free。投影片 以 regex 結構轉 CFG：`a(b∪ε)c` 可寫

```text
S → aXc
X → b | ε
```

`(a∪b)^2c*` 可寫

```text
S → XY
X → ZZ
Z → a | b
Y → cY | ε
```

一般情況對 regex atoms 建 productions，再以 new nonterminals 模擬 union、concatenation 與 star。因上一講已知某些 語言 nonregular，而下一節 CFG 可生成它們，regular 語言 是 CFLs 的 proper subset。

## S → aSb | ε 生成 E

grammar

```text
S → aSb | ε
```

每次 recursive production 同時在左側加一個 a、右側加一個 b；最後選 epsilon 終止。例如四次 recursion 得

\[
S\Rightarrow aSb\Rightarrow aaSbb\Rightarrow aaaSbbb
\Rightarrow aaaaSbbbb\Rightarrow aaaabbbb.
\]

因此每條 generated string 都是 \(a^nb^n\)。反過來，任意 n 可使用 recursive rule 恰 n 次再用 epsilon，生成 \(a^nb^n\)。兩方向合起來才證 \(\mathcal L(G)=E\)。上一講證 E nonregular，所以 CFL 嚴格包含 regular 語言。

「unbounded memory」在 derivation 中表現為尚未展開的 nested S：每次加 a 時，同時留下將來必須配上一個 b 的結構。grammar rules 有限，但 derivation depth 不受固定上限約束。

## 設計方法：recursive plan 與 nonterminal invariant

投影片 給三個原則。第一，think recursively：從更小合法結構建更大結構。第二，先決定 construction order，例如從外往內包或由左至右串接。第三，用不同 nonterminals 保存有用 information，每個 nonterminal 都應能說出「它恰好生成哪類 strings」。

驗證也要雙向：soundness 證 grammar 不產生 語言 外的字串；completeness 證 語言 中每條字串都能生成。只列 positive derivations 只證幾條 strings 在 語言，無法排除 overgeneration 或 missing cases。

## palindrome grammar

在 \(\Sigma=\{a,b\}\) 上，palindrome 的 base cases 是 \(\varepsilon,a,b\)。若 \(\omega\) palindrome，\(a\omega a\) 與 \(b\omega b\) 仍 palindrome；沒有其他形成方式。因此

```text
S → ε | a | b | aSa | bSb
```

even-length palindrome 最終用 epsilon，odd-length 最終用 a 或 b。每次遞迴確保首尾相同。反向對任意 nonempty palindrome 移除相同首尾，得到更短 palindrome，重複直到 base，便建立 completeness。

測 `abba`：\(S⇒aSa⇒abSba⇒abba\)。測 `aba`：\(S⇒aSa⇒aba\)。`aab` 無法生成，因第一與最後不同；這不是因搜尋失敗，而是 production invariant 保證所有非 base derivations 首尾相同。

## balanced braces grammar

balanced braces 的 base 是 empty string。對任意 nonempty balanced string，找與第一個 `{` 配對的 `}`；中間是一條 balanced string，配對 brace 後面剩餘部分也是 balanced。因此 decomposition 唯一形狀是 `{x}y`，其中 x,y 都 balanced：

```text
S → {S}S | ε
```

第一個 S 生成 nested interior，第二個 S 生成後續 concatenated groups。只有 `S→{S}` 會漏掉 `{}{}`；只有 `S→SS|{S}|ε` 雖能表達，也可能引入大量不同 derivation shapes。投影片 的規則直接跟「first matching close」construction plan 對齊。

soundness 可對 derivation structure induction：epsilon balanced；若 x,y balanced，`{x}y` balanced。completeness 則對 string length induction，以第一個 matching close 切成更短 x,y，再用 induction hypotheses 生成兩者。

## 相同數量 a 與 b 的候選規則

投影片 比較四組 grammar 是否生成所有 \(\#a=\#b\) strings。`S→aSb|bSa|ε` 每步保持 counts equal，但只能把 opposite symbols 包在外側，會漏掉某些排列。`S→abS|baS|ε` 只從左側加相鄰 pair，也會漏例如 `aabb`。`S→abSba|baSab|ε` 每步各加兩個 a/b，更窄。

候選 `S→SbaS|SabS|ε` 能用兩個 independent S pieces 插入一個 a 與一個 b，適合分解任意 equal-count string。判斷不只檢查 invariant「每條生成物 counts 相等」；還要找 completeness decomposition。若 grammar 看似正確，先測最短反例 `aabb`、`bbaa`、`abba`，通常能揭露 construction order 過度限制。

## recursion 必須有終止出口

規則 `S→aSb` 看似維持 equal counts，卻永遠留下 S，無法導出 terminal-only string。因此 \(\mathcal L(G)=\emptyset\)，不是 \(\{a^nb^n\}\)。必須有 \(S→ε\) 或其他 base production，讓 recursion 終止。

另一個陷阱是 independent nonterminal occurrences。對

```text
S → X ≟ X
X → aX | ε
```

左右兩個 X 各自獨立展開，所以可生成 \(a^m≟a^n\) 的任意 m,n，不會自動選相同次數。CFG 的相同名稱不是共享變數或 copy constraint。這正說明 \(\{a^n≟a^n\}\) 需要用單一 nested recursion 如 \(S→aSa|≟\)，而不能期待兩個 X 同步。

## derivation 與 parse structure

同一 parse structure 可因先展開左或右 nonterminal 而有不同 derivation sequences；這不必然代表 grammar ambiguity。真正重要的是 production choices 如何建立 hierarchical structure。arithmetic grammar `Expr→Expr Op Expr` 沒編碼 precedence 或 associativity，因此 `int-int-int` 可有兩種 groupings；若要做 compiler grammar，需拆成 Expr、Term、Factor 層級。

投影片 本講聚焦 語言 generation，而不是完整 parsing algorithm。閱讀 derivation 時仍可畫 tree：root 是 start，每次 production 的右側成 children，從左到右讀 terminal leaves 得 output。tree 能揭露 recursive nesting，也能區分「不同改寫順序」與「不同結構」。

## 可執行自測

先用 arithmetic CFG 對 `int × (int + int)` 寫每一步，只替換一個 nonterminal，並圈出 terminals。接著對 Q/H grammar 判讀 `dca`、`dc`、`cad`、`bcb`、`ddHaa`，每個答案用 \(db^ncb^na^m\) invariant 解釋。

再為 palindrome `abba` 與 balanced braces `{{}{}}{}` 各寫 derivation；同時挑 `aab`、`}{` 說明 invariant 為何排除。最後修正 `S→aSb` 使它生成 E，並用 n=0 boundary 測 epsilon。對 `S→X≟X` 實際生成 `a≟aaa`，親眼確認兩個 X 不同步。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「從有限狀態限制轉向遞迴結構」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 19: Context-Free Languages](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/19/)
- [Official Lecture 19 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/19/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
