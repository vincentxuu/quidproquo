---
title: "CS221 Lecture 16：Logic II：量詞讓知識跨越單一命題"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 17
tldr: "第 16 講用 predicates、quantifiers 與 functions 壓縮跨物件知識，再以 substitution、unification 與 definite-clause forward inference 推導結論，同時標出 termination 與 completeness 限制。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 16：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-16-logic-first-order-en)

本篇依 **Stanford CS221 Autumn 2025 Lecture 16** 可執行材料 [first_order_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=first_order_logic) 的順序整理。

> 材料缺口：Canvas 課堂互動、作業解答與隱藏測資不公開。

## TL;DR

FOL 涵蓋 term、formula、量詞、model、substitution、unification。

## 1. 先把「邏輯」拆成三件事

講義先定義 logic 是表示知識、並對知識推理的語言。至少要說清楚三層：syntax、semantics、inference rules。

syntax 定義合法公式；semantics 以 model 解讀公式；inference rules 從 KB 推導新公式。命題 model 是 truth assignment，滿足 `f` 的集合寫成 `M(f)`。`Rain` 與 `Rain → Wet` entails `Wet`；若加入 query 後 models 不變就是 entailment，變空是 contradiction，其餘是 contingency。`KB ⊢ f` 表示規則推出 `f`，`KB ⊧ f` 表示所有 KB models 都滿足 `f`；soundness 與 completeness 分別要求不亂推與不漏推。

## 2. 命題邏輯卡在哪裡

接著講義故意用笨重的方式表示幾個句子。句子「Alice 和 Bob 都知道 arithmetic」可以寫成兩個獨立 proposition：`AliceKnowsArithmetic ∧ BobKnowsArithmetic`。句子「所有學生都知道 arithmetic」若只看 Alice 與 Bob，可以寫成：

```text
(AliceIsStudent → AliceKnowsArithmetic)
∧ (BobIsStudent → BobKnowsArithmetic)
```

但這不是「所有」的表示，只是把目前列出的名字逐一展開。更明顯的例子是：「每一個大於 2 的偶數，都是兩個質數的和。」命題邏輯沒有自然的位置放入任意整數、加法、偶數、質數，也沒有量詞告訴我們要遍歷哪些對象。講義在這裡直接留下 `???`，用來標示 expressive power 的缺口，而不是假裝用更多 proposition names 就能解決。

問題不是連接詞不夠多，而是 proposition symbol 把句子的內部結構抹掉了。`AliceKnowsArithmetic` 有 `alice`、`Knows`、`arithmetic` 三個角色；命題邏輯卻只把整個字串視為不可拆的原子。另一個缺口是 quantifiers and variables：`all` 需要對 objects 套用規則，不能靠事前枚舉名單取代。

## 3. FOL 的語法：term 和 formula 是兩種不同東西

FOL 的第一個轉變是：formula 表示 truth value，但 term 表示 object。這是整講最重要的型別規則。

### Objects、constants、variables、functions

來源只宣告一個 sort：`Object`。`alice`、`bob`、`arithmetic`、`phoenix`、`cs221`、`logic`、`two` 是 object 的 constant symbols；`x`、`y`、`z` 是 variables。這些名稱先是符號，不是 Python 字串物件。

functions 接受 objects 並回傳 object。來源定義 `father: Object → Object`，以及 `add: Object × Object → Object`。因此 `father(alice)` 與 `add(x, y)` 都是 terms：前者可以指向 Alice 的父親，後者可以指向兩個 objects 相加後的 object。來源使用一個 generic `Object` sort，所以 `add` 並沒有在這裡被限制成真正的數學整數加法；「even integer」「prime」等意義要交給 predicate 與 interpretation 表達。

### Predicates、連接詞、量詞

predicate 套用在 terms 上，回傳 truth value。`Student` 是 unary predicate，`Knows` 是 binary predicate；因此 `Student(x)` 與 `Knows(x, arithmetic)` 是 atomic formulas。零元的 `Snowing` 則和命題邏輯裡的 proposition symbol 相同，可以視為沒有參數的 predicate。

connectives 繼續作用在 formulas 上，例如：

```text
Student(x) → Knows(x, arithmetic)
```

量詞也只能套用在 formula 上。`∀x. Student(x) → Knows(x, arithmetic)` 說的是對 domain 中的每個 `x`，若它是學生，就知道 arithmetic；`∃x. Student(x) ∧ Knows(x, arithmetic)` 說的是至少有一個 object 同時滿足兩件事。這裡的 `x` 是被量詞綁定的 variable，不能把它當成某個固定名字。

來源刻意列出幾個 non-formulas：`father(x)` 是 term，不是 formula；`Knows(Student, arithmetic)` 把 predicate symbol 當作 term 使用；`Foo(Knows(alice, arithmetic))` 把 formula 當成 function 的 object argument。命名慣例也在提醒同一件事：terms 用小寫例子表示，formulas 用大寫 predicate 開頭表示。若把兩者混在一起，後面的 interpretation 和 substitution 就沒有清楚的輸入型別。

## 4. 量詞、scope，以及自然語言的陷阱

量詞的作用範圍是它後面的 formula。不能只看到「所有」或「某個」就把句子裡的詞全部並列；要先確認 variable 被綁在哪一段。來源的自然語言段落用幾個例子把這點具體化。

「Alice 和 Bob 都知道 arithmetic」沒有量詞，直接是：

```text
Knows(alice, arithmetic) ∧ Knows(bob, arithmetic)
```

「所有學生都知道 arithmetic」通常是 universal quantifier 加 implication：

```text
∀x. Student(x) → Knows(x, arithmetic)
```

「有一個學生知道 arithmetic」通常是 existential quantifier 加 conjunction：

```text
∃x. Student(x) ∧ Knows(x, arithmetic)
```

這兩種搭配不是死背口訣，而是句子的條件不同：universal 要說明「若某物是學生，則……」，否則會把 domain 裡所有 object 都限制成學生；existential 要找到同時符合身分與性質的 witness，conjunction 正好表達這個要求。

來源特別標出兩個「probably wrong」的寫法。`∀x. Student(x) ∧ Knows(x, arithmetic)` 的真正意思是「每一個 object 都是學生，而且每一個 object 都知道 arithmetic」，比「所有學生都知道」強很多。`∃x. Student(x) → Knows(x, arithmetic)` 則等價於「存在某個 object，不是學生或知道 arithmetic」的方向；它沒有保證找到的 object 是學生。這些不是 solver 的小細節，而是 scope、connective 與自然語言條件沒有對齊。

更複合的句子如下：「有一門課，是每個學生都修過的。」來源寫成：

```text
∃x. Course(x) ∧ ∀y. Student(y) → Takes(y, x)
```

外層的 `x` 是那門課的 witness，內層的 `y` 則遍歷學生。再如「每個大於 2 的偶數都是兩個質數的和」：

```text
∀x. (Even(x) ∧ GreaterThan(x, two))
    → ∃y, z. Prime(y) ∧ Prime(z) ∧ add(y, z) == x
```

這裡 `y`、`z` 的存在只需要對符合前件的每個 `x` 成立；不能把 existential 放到外層，否則就變成所有這些 `x` 共用同一對質數。最後，課程知識的例子是：

```text
∀x, y, z.
  (Student(x) ∧ Takes(x, y) ∧ Course(y)
   ∧ Covers(y, z) ∧ Concept(z)) → Knows(x, z)
```

所有變數的 scope 都是整個 implication。這種寫法把「學生修課、課程涵蓋概念、學生因此知道概念」保留成可組合的結構，而不是為每一個學生與課程另造 proposition symbol。

## 5. 先看一個完整的 KB 推論

來源先建立 KB：

```text
Student(alice)
From(alice, phoenix)
Hot(phoenix) ∧ City(phoenix)
∀x. Student(x) → Person(x)
∀x. City(x) → Place(x)
Snowing → Cold
```

`ask(kb, Snowing)` 做兩次 satisfiability check：加入 `¬Snowing` 若 unsat，回答 Yes；否則加入 `Snowing`，若 unsat 回答 No；兩者皆可滿足則回 `I don't know`，而非把未知當 False。

後面再加入規則：

```text
∀x, y.
  (Person(x) ∧ From(x, y) ∧ Hot(y) ∧ Place(y) ∧ Snowing)
  → ¬Happy(x)
```

規則把 Alice、Phoenix 與 Snowing 接起來，卻不會因規則存在就推出 Snowing。加入 `Happy(alice)` 後，solver 仍以 query 與其否定的 satisfiability 判斷 entailment。

## 6. 語意：model 不只是無限多個真假格子

若把 FOL 的 atomic formulas 像命題符號一樣，直接各自指定 True/False，會出現兩個問題。第一，函數會製造無限多個 syntax 不同的 terms：`father(alice)`、`father(father(alice))`、`father(father(father(alice)))`，於是也會有無限多個可能的 atomic formulas。單一 model 要逐一替它們指定真假，表示層次很差。

第二，不同寫法可能指向同一個 object。`father(alice)` 有可能就是 `bob`，但若兩者只被當成彼此獨立的 atomic 字串，model 可以同時令 `Knows(father(alice), arithmetic)` 為真、令 `Knows(bob, arithmetic)` 為假，卻沒有反映它們其實指向同一物。

來源的解法是加一層 indirection。先定義 domain，例如 `o1`、`o2`、`o3`；再定義 interpretation function，把 primitive symbols 映射到 domain 的東西：

```text
constants:
  alice      ↦ o1
  bob        ↦ o2
  arithmetic ↦ o3

functions:
  father(o1) ↦ o2

predicates:
  Student(o1) = True
  Knows(o1, o3) = True
  Knows(o2, o3) = True
```

所以 model `w` 是 `(domain, interpretation)`，不是單獨一張真假表。interpretation function `ℐ(f, w)` 會遞迴解讀任意 formula：先解 terms 所指向的 domain objects，再依 predicate、connective 或 quantifier 計算真假。

量詞的實作直接對應語意。對 `∀x. Knows(x, arithmetic)`，`interpret_formula` 把 `x` 綁到 domain 的每個 object，所有 body 都為真才回傳 True；對 `∃x. ...`，只要一個 object 讓 body 為真就回傳 True。這是 scope 的執行版本：遞迴呼叫帶著 substitution，把 variable binding 傳進 body。來源程式只支援單一變數量詞；nested quantifiers 尚不完整，不能視為完整 FOL interpreter。

## 7. Propositionalization：什麼時候可以退回舊方法

FOL 比命題邏輯有更強的表示力，所以一般不能任意把 FOL 展開成有限的 proposition set。不過來源給了一個有條件的退路：如果 model 滿足 unique names 與 domain closure，就能把相關 KB propositionalize。

unique names 的意思是每個 object 至多對應一個 constant；domain closure 的意思是每個 object 至少對應某個 constant。來源用圖示標出違反這兩個假設的模型，並強調這是對 model 的限制，而不是 FOL 的普遍真理。在這兩個假設下，對 `alice`、`bob` 的 facts 與規則，可以展開成 `StudentAlice`、`StudentBob`、`KnowsAliceArithmetic`、`KnowsBobArithmetic` 等 proposition：

```text
StudentAlice
StudentBob
(StudentAlice → KnowsAliceArithmetic)
∧ (StudentBob → KnowsBobArithmetic)
StudentAlice ∧ KnowsAliceArithmetic
∨ StudentBob ∧ KnowsBobArithmetic
```

這樣就能使用上一講的 model checking。這個 regime 裡，FOL 對這些限制下的表示其實是命題邏輯的 syntactic sugar：expressivity 相同，但原本的 terms、變數與量詞讓人更容易寫出規則。問題也因此被明確地推回來：如果沒有 unique names 或 domain closure，這個有限展開還成立嗎？來源在此把問題留給後續推理，而沒有假裝所有 FOL 都能直接列舉完。

## 8. Definite clauses、substitution 與 unification

來源接著不走通用 solver 的黑箱，而是定義一種可用 modus ponens 的公式：definite clause。

```text
∀x₁ ... xₙ. (a₁ ∧ ... ∧ aₖ) → b
```

其中變數是 `x₁ ... xₙ`，`a₁ ... aₖ` 和 `b` 都是 atomic formulas。例子是：

```text
∀x, y, z.
  (Takes(x, y) ∧ Covers(y, z)) → Knows(x, z)
```

`Or(Student(alice), Student(bob))` 和 `∃x. Student(x) ∧ Knows(x, arithmetic)` 都不是這種 definite clause。來源的直覺是：這裡沒有 disjunction，也不直接允許 existential 出現在這個 rule form 裡。

先嘗試 exact-match modus ponens。KB 已知：

```text
Takes(alice, cs221)
Covers(cs221, logic)
∀x, y, z. (Takes(x, y) ∧ Covers(y, z)) → Knows(x, z)
```

想推出 `Knows(alice, logic)`。但 facts 的 syntax 是 `Takes(alice, cs221)`，規則前件是 `Takes(x, y)`；兩者不 exact equal，所以只靠直接比對無法套用規則。

### Substitution

substitution 是把變數在 formula 裡搜尋並替換。對 `Knows(x, y)` 使用 `{x ↦ alice, y ↦ cs221}`，得到 `Knows(alice, cs221)`；對 `Student(x) ∧ Knows(x, y)` 使用 `{x ↦ alice, y ↦ z}`，則得到 `Student(alice) ∧ Knows(alice, z)`。這個 operation 遞迴走過 formula 的 arguments，遇到 substitution 裡的 variable 就換掉，否則保留 declaration 並重建子式。

### Unification

unification 要找的是一個 substitution，讓兩個 formulas 變得相等。`Knows(x, y)` 與 `Knows(alice, bob)` 可以用 `x ↦ alice, y ↦ bob`；`Knows(alice, y)` 與 `Knows(x, z)` 可以把變數綁到能一致比對的 terms。`Knows(alice, y)` 與 `Knows(bob, z)` 則會因為最外層相同位置的 constants 不同而失敗。

把兩個 rule premises 一起 unify：

```text
Takes(alice, cs221) ∧ Covers(cs221, logic)
```

和

```text
Takes(x, y) ∧ Covers(y, z)
```

可以得到 `θ = {x ↦ alice, y ↦ cs221, z ↦ logic}`。將 θ 套到 conclusion `Knows(x, z)`，就得到 `Knows(alice, logic)`。這是來源所說的「modus ponens with substitution and unification」：不是放寬規則到任意自然語言，而是先找能使前件相等的 substitution，再把同一個 substitution 套到結論。

來源的簡化 `is_variable` 直接把名稱 `x`、`y`、`z` hardcode 成 variable。它自己也註解：在 `Takes(alice, x)` 裡，單靠這種表示未必能從 declaration 分辨 constant 與 variable。這再次提醒我們，推理演算法依賴輸入 representation；若 representation 沒有保存這個差異，unifier 就只能依賴額外慣例。

## 9. 表達力、可計算性與限制

若沒有 functions，modus ponens 產生 atomic formula；source 給出的枚舉量級是 `num-constant-symbols^(maximum-predicate-arity)`，由 constant 數與 predicate arity 決定。

若允許 functions，`father(father(...alice))` 可無限延伸，候選 atoms 也可能無限；source 因而不保證 termination 或有限成本。

definite-clause modus ponens 是 sound：`KB ⊢ f` 保證 `KB ⊧ f`；但不 complete，會漏掉 entailed formulas。source 指出 resolution 才能補足 completeness，卻未實作。

## 10. 閱讀 executable lecture 的檢查表

檢查型別、scope、model、propositionalization 假設與推理邊界。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：first_order_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=first_order_logic)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
