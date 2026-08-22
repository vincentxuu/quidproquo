---
title: "Stanford CS103 Lecture 4：一階邏輯的物件、量詞與型別"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, first-order-logic]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 6
tldr: "本講把命題邏輯擴充成能談論物件的一階邏輯：分清常數、predicate、function 與命題的型別，再用存在與全稱量詞表達 some 與 every。"
description: "依 Stanford CS103 Spring 2026 Lecture 4 投影片，整理一階邏輯的常數、predicate、function、等號、量詞、scope、precedence 與英文翻譯模式。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-05-first-order-logic-1-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 6 篇，對應 **Spring 2026 官方 Lecture 4（2026-04-08）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

前一講的命題邏輯把整句話視為 true 或 false，再用 `¬`、`∧`、`∨`、`→` 與 `↔` 組合。本講打開這個黑盒子：句子談哪些物件？性質套在哪個物件上？「有人」與「每個人」如何進入公式？難點不是符號變多，而是每種元件都有固定的輸入與輸出型別。

## 從命題邏輯走向物件

命題變數只能代表一整個真假值，無法保留誰喜歡誰的內部結構。First-order logic（FOL）加入三種工具：predicate 描述物件的性質或關係，function 把物件映射成另一個物件，quantifier 則讓公式一次談論多個可能物件。

投影片用 `Likes(You, Eggs) ∧ Likes(You, Tomato) → Likes(You, Shakshuka)` 示範。`You`、`Eggs` 等名字指向物件；`Likes` 接受物件並產生真假；外層 `∧` 與 `→` 仍是命題連接詞。FOL 沒丟掉命題邏輯，而是提供能產生命題的內部語言。

## 常數符號指向物件

`You`、`Me`、`Havana` 或 `137` 稱為 constant symbols。它們不是命題變數，因為本身不是真或假，只在論域中指向某個物件。數字也不是 FOL 自帶的神奇實體，而可像其他名字一樣被解釋成特定物件。

同一物件可能有不同名字。`MorningStar = EveningStar` 與 `TomMarvoloRiddle = LordVoldemort` 都說兩個符號指向同一物件。名稱相同、字串相同與物件相同是不同問題；公式關心 interpretation 給符號的指涉。

## Predicate 把物件變成命題

Predicate 接受物件並回傳 proposition。例如 `Cute(Quokka)`、`ArgueIncessantly(Democrats, Republicans)` 與 `x < 8` 都有真假值。二元 predicate 有時採 infix notation，所以 `<` 和 `=` 寫在兩個物件中間，語意角色仍是 predicate。

每個 predicate 有固定 arity。若 `Likes` 是二元，`Likes(You)` 就是缺參數的語法錯誤。作業通常另給 vocabulary，列出 predicates、意義與參數數目。翻譯前先整理介面表，比看到英文就臨時發明符號可靠。

Predicate application 的結果才可接連接詞。`Cute(a) → (Dikdik(a) ∨ Kitty(a) ∨ Puppy(a))` 合法；`Venus → TheSun` 不合法，因為兩側只是 objects。這是型別錯誤，不是天文學上的假命題。

## 等號是特殊的二元 Predicate

FOL 內建 `=`，詢問兩個物件是否相等。它與 `→` 層級不同：`=` 的輸入是 objects、輸出是 proposition；`→` 的輸入與輸出都是 propositions。兩個 propositions 是否等價要用 `↔`，不能用 `=`。

投影片的電影例子是：

```text
FavoriteMovieOf(You) ≠ FavoriteMovieOf(Date) ∧
StarOf(FavoriteMovieOf(You)) = StarOf(FavoriteMovieOf(Date))
```

兩人的最愛電影不同，但主演相同。它也預告 function 可以巢狀出現在 predicate 的參數位置。

## Function 把物件變成物件

Function 接受物件並回傳單一物件，例如 `ColorOf(Money)`、`MedianOf(x, y, z)`、`FavoriteMovieOf(You)`。`StarOf(FavoriteMovieOf(You))` 先得到電影，再得到主演；每一步輸出都能餵給下一步。

Function 結果本身沒有真假，不能直接與 `¬` 或 `∧` 組合。反過來，`StarOf(IsRed(Sun) ∧ IsGreen(Mars))` 也不合法：括號內是 proposition，`StarOf` 卻要求 object。若想問 function 結果是否有某性質，仍要再套 predicate。

## 用型別表檢查公式

投影片濃縮出 type-checking table：connectives 對 propositions 運算並產生 proposition；predicates 對 objects 運算並產生 proposition；functions 對 objects 運算並產生 object。遇到長公式，可由內而外替每個子式標上型別。

以 `StarOf(FavoriteMovieOf(You)) = StarOf(FavoriteMovieOf(Date))` 為例：常數是 object；兩個 `FavoriteMovieOf` 回傳 object；兩個 `StarOf` 仍回傳 object；`=` 才把它們變成 proposition。任何一步輸出不合下一步輸入，公式就不 well-formed。這與程式語言的靜態型別檢查十分相似。

## 存在量詞：至少找到一個 witness

`∃x. φ(x)` 表示存在某個 `x`，代入後 `φ(x)` 為真。`∃x. (Even(x) ∧ Prime(x))` 只需找到一個同時是偶數和質數的物件；`∃x. (TallerThan(x, me) ∧ LighterThan(x, me))` 要求同一 witness 同時滿足兩條件。

不能用 Alice 證明前半句、Bob 證明後半句，卻聲稱 `∃x. (P(x) ∧ Q(x))`。只要有一個候選讓 body 為真，存在句就為真；沒有任何候選成功才為假。

量詞也能嵌入更大的命題，如 `(∃w. Will(w)) → (∃x. Way(x))`。應先分別計算箭頭兩側，再依 implication truth table 判斷；兩個量詞的變數並不共享。

## 空論域中的存在句

論域為空時，`∃x. Smiling(x)` 為假。不是因為每個物件都不微笑，而是沒有可選的 witness。存在句不是「找不到反例就算真」，而是必須出現正例。

這也對應證明義務：證明 `∃x. P(x)` 通常要明確選定一個物件，再驗證它滿足 `P`。只討論一般性質而沒有提出 witness，並未完成存在性證明。

## 變數的 Scope 與重新命名

每個 quantifier 包含引入的 variable 與受量化的 statement。`(∃x. Loves(You, x)) ∧ (∃y. Loves(y, You))` 中，兩個變數各自只活在一側。把右側 `y` 改名為 `x`，語意仍相同；兩個 `x` 是不同 scope 的局部變數。

局部名稱相同不代表 witness 相同。若要強迫同一人同時形成兩種關係，量詞必須包住 conjunction：`∃x. (Loves(You, x) ∧ Loves(x, You))`。讀公式時先畫出量詞控制的括號，比只盯著字母安全。

## 量詞的 Precedence 陷阱

投影片語法中，quantifier precedence 僅次於 negation。`∃x. P(x) ∧ R(x) ∧ Q(x)` 因而解析成 `(∃x. P(x)) ∧ (R(x) ∧ Q(x))`，而不是常見直覺中的 `∃x. (P(x) ∧ R(x) ∧ Q(x))`。

錯誤解析的後半段中 `x` 已離開 scope，成了 free variable；若目標是完整 sentence，甚至不是合法寫法。實務規則是量詞 body 超過一個原子公式就主動加括號。括號明確界定變數生命週期，不是裝飾。

## 全稱量詞：必須經得起每個選擇

`∀x. φ(x)` 表示對論域中每個 `x`，`φ(x)` 都為真。`∀p. (Puppy(p) → Cute(p))` 說每隻 puppy 都 cute；要推翻只需一隻 puppy 不 cute。檢查幾個正例不能證明全稱句，因為尚未排除其他候選。

數論命題可寫成 `∀n. (n ∈ ℕ → (Even(n) ↔ Even(n²)))`。外層遍歷所有物件，implication 以 `n ∈ ℕ` 篩出關心的自然數；對非自然數，antecedent 為假，不會錯誤要求後件。這是以條件句限制論域的典型模式。

## 空論域與 Vacuous Truth

空論域中，`∀x. Smiling(x)` 定義為 vacuously true。全稱句為假需要 counterexample，也就是某個 `x` 使 body 為假；空論域沒有物件，因此不可能有反例。

它與存在句形成對照：空論域使 `∃x. P(x)` 為假，使 `∀x. P(x)` 為真。這不是宣稱不存在的物件具有性質，而是依量詞的驗證條件計算真假。若沒有物件滿足 implication 前件，也就沒有違反規則的反例。

## 翻譯 Some：存在量詞通常配 Conjunction

「Some smiling person wears a hat」正確翻譯是：

```text
∃x. (Smiling(x) ∧ WearingHat(x))
```

它要求同一人同時 smiling 且 wearing a hat。錯誤版本 `∃x. (Smiling(x) → WearingHat(x))` 太弱：任何不 smiling 的人都讓 implication 為真，因此能充當 witness，即使根本沒有微笑戴帽的人。

一般模式是「Some P is a Q」翻成 `∃x. (P(x) ∧ Q(x))`。Conjunction 迫使 witness 同時具備分類性質 `P` 與目標性質 `Q`。看到 some、a、there exists 時，先問「展示的那個物件必須同時滿足哪些條件？」

## 翻譯 Every：全稱量詞通常配 Implication

「Every smiling person wears a hat」正確翻譯是：

```text
∀x. (Smiling(x) → WearingHat(x))
```

它只約束 smiling 的人。錯誤版本 `∀x. (Smiling(x) ∧ WearingHat(x))` 會要求論域中每個物件都微笑且戴帽，連原句不關心的物件也納入。

一般模式是「All P's are Q's」翻成 `∀x. (P(x) → Q(x))`。反例恰好具有 `P` 且不具有 `Q`；implication 讓非 `P` 的物件自動通過，把真正檢查集中在 `P` 類別。

## 把 FOL 當成數學程式語言

投影片建議把 FOL 視為 mathematical programming language。翻譯不是逐字替換，而是用少數構件寫出正確行為：先固定 vocabulary 與 arity，再確認子式型別、scope 與 precedence，最後用小世界測試真假。

對 `∃x. (P(x) ∧ Q(x))`，測試共同 witness、只有 `P`、只有 `Q`、兩性質由不同物件滿足及空論域。對 `∀x. (P(x) → Q(x))`，測試所有 `P` 都是 `Q`、存在 `P ∧ ¬Q`、只有無關非 `P` 及空論域。若候選公式在任何世界給出與英文不同的真假，就不是正確翻譯。

FOL 也支援先前證明技巧：要否定敘述，先翻成公式、取 negation，再翻回英文；要做 contrapositive，先辨認 antecedent 與 consequent，再交換並否定。下一講將處理多重量詞順序、否定與 uniqueness；本講先把型別與兩個基本量詞建立牢固。

## 材料缺口與閱讀界線

完整投影片足以重建物件語言、兩種量詞、scope、precedence、空論域與翻譯模式的順序。投影片不是錄影，不保留講者口頭轉折、學生回答或即興補充；本文只把 deck 支持的定義、公式與例子歸於課程，銜接文字是導讀，不是講師逐字引述。

## 更新紀錄

- 2026-08-22：依官方 Lecture 4 deck 逐項重建遺失的雙語正文，修正 metadata，補回常數、predicate、function、量詞、scope、precedence 與翻譯例題。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 4: First-Order Logic, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/)
- [Official Lecture 4 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 2](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps2/)
