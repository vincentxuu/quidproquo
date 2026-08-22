---
title: "Stanford CS103 Lecture 5：一階邏輯 II——巢狀量詞、否定與唯一性"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, first-order-logic]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 7
tldr: "把自然語言逐層翻成一階邏輯：辨認全稱與存在句型，再處理量詞順序、否定、限制量詞與唯一性。"
description: "依 Stanford CS103 First-Order Logic Part II 官方投影片，整理巢狀量詞、集合翻譯、量詞否定、限制量詞與唯一性。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-06-first-order-logic-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 7 篇，對應 **Spring 2026 官方 Lecture 5（2026-04-10）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂講者欄位，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

上一講建立 predicate、function 與 quantifier 等零件，這一講真正開始翻譯。難點不在符號本身，而是一句自然語言常同時藏著範圍、依賴、例外與唯一性。可靠的方法是先保留句子骨架，再逐層替換，不要看完一句話後憑直覺一次寫完整串公式。

## 四個 Aristotelian forms

若 `A(x)` 與 `B(x)` 描述物件，投影片要求記熟四個骨架：「所有 A 都是 B」為 `∀x. (A(x) → B(x))`；「有些 A 是 B」為 `∃x. (A(x) ∧ B(x))`；「沒有 A 是 B」為 `∀x. (A(x) → ¬B(x))`；「有些 A 不是 B」為 `∃x. (A(x) ∧ ¬B(x))`。

全稱句用 implication：只在物件確實是 A 時要求它是 B。非 A 物件使前件為假，整個 implication 自動成立，不會誤傷論域中的其他物件。存在句用 conjunction：同一個 witness 必須同時是 A 與 B。寫成 `∃x. (A(x) → B(x))` 通常太弱，因為找一個不是 A 的物件就能成立。

這組對應不是排版偏好，而是限制論域的兩種方式。後面翻譯人物、集合、否定與唯一性，都會反覆回到「全稱搭 implication、存在搭 conjunction」。

## 逐層翻譯「每個人愛某個其他人」

給定 `Person(p)` 與 `Loves(x,y)`，先把句子展開成「對每個人 p，存在另一個人 q，使 p 愛 q」，再寫：

```text
∀p. (Person(p) →
  ∃q. (Person(q) ∧ p ≠ q ∧ Loves(p, q))
)
```

外層是所有人，所以用 `∀` 與 implication；內層是某個人，所以用 `∃` 與 conjunction。`p ≠ q` 不可省略，否則 p 愛自己便足以滿足「someone」，卻未表達「someone else」。最後還要檢查參數方向：`Loves(p,q)` 是 p 愛 q。

逐層翻譯留下可除錯的中間狀態。若答案有誤，可以分別檢查外層量詞、人物條件、不等式與關係方向，而不是面對整串符號猜錯在哪裡。

## 「每人愛一人」不等於「有一人被大家愛」

「有一個人被所有其他人所愛」是：

```text
∃p. (Person(p) ∧
  ∀q. (Person(q) ∧ p ≠ q → Loves(q, p))
)
```

這裡先固定被愛的 p，再要求每個其他人 q 都愛 p。上一式允許每人愛不同對象，可能無人被所有人愛；本式要求共同對象，但該對象自己不必愛任何人。投影片用圖示展示兩式各自成立的模型，也展示兩式可以同時成立。

判讀關係公式時，可以把人畫成節點、love 畫成有向箭頭。若能畫出滿足一式卻不滿足另一式的模型，就已證明它們不等價。這比只比較符號外觀可靠。

## 合取兩個完整主張

若句子同時要求前兩件事，便把兩個完整公式用 `∧` 連接。兩側各有自己的量詞與括號。兩邊即使都用 `p`，也不表示同一人，因為各量詞只約束自己的 scope；為清楚起見可將第二側改名為 `r`。

變數名稱本身沒有語意，量詞範圍才有。括號因此不是排版細節：它決定變數在哪裡被綁定，也決定 connective 連的是子句還是完整命題。檢查公式時，要確認每個變數的每次出現都位於相應量詞範圍內，沒有 accidental free variable。

## 量詞順序就是依賴關係

`∀x. ∃y. P(x,y)` 表示每選一個 x，都能再選某個 y 使 P 成立；y 可以隨 x 改變。`∃x. ∀y. P(x,y)` 則先固定單一 x，接著它必須對所有 y 有效，通常強得多。

以 love 為例，`∀p∃q Loves(p,q)` 允許 Alice 愛 Bob、Bob 愛 Carol、Carol 愛 Alice；`∃q∀p Loves(p,q)` 要求共同被愛者。交換同類量詞往往不改語意，但混合 `∀` 與 `∃` 時不能任意交換。

可把量詞由左到右想成遊戲：誰先選，後選者是否看得到前面的選擇？在 `∀x∃y` 裡，y 能依 x 回應；在 `∃y∀x` 裡，y 必須預先選好。這正是兩式的依賴差異。

## 一階邏輯不會替你內建集合運算

投影片只給 `Set(S)` 與 membership `x ∈ y`，要求表達「空集合存在」。不能直接使用未提供的空集合常數，而要描述某個集合沒有元素：

```text
∃S. (Set(S) ∧ ¬∃x. x ∈ S)
```

等價地可寫 `∃S. (Set(S) ∧ ∀x. x ∉ S)`。第一式說不存在屬於 S 的物件；第二式說每個物件都不屬於 S。兩者等價，因為 `¬∃x P(x) ≡ ∀x ¬P(x)`。

這個例子示範語言的邊界：公式只能使用題目明確提供的 symbols。數學上熟悉的物件或運算，若不在語言裡，就必須由現有 predicates 描述，不能偷渡記號。

## 量詞否定的四格表

投影片整理四個核心等價式：

```text
¬∀x. P(x)   ≡   ∃x. ¬P(x)
¬∃x. P(x)   ≡   ∀x. ¬P(x)
¬∀x. ¬P(x)  ≡   ∃x. P(x)
¬∃x. ¬P(x)  ≡   ∀x. P(x)
```

否定「每個都符合」只需一個反例；否定「至少一個符合」則要全部不符合。機械操作是把 negation 推過 quantifier，同時對調 `∀` 與 `∃`，再繼續處理內部。這其實是 witness 與 counterexample 的對偶：存在句靠 witness 成立，全稱句靠 counterexample 失敗。

常見錯誤是只翻量詞卻忘記否定 predicate。`¬∀x P(x)` 不是 `∃x P(x)`，後者甚至可能與原句同時成立。正確結果必須找到不具 P 的 x。

## 完整否定「每個人都愛某人」

投影片逐步否定 `∀x. ∃y. Loves(x,y)`：

```text
¬∀x. ∃y. Loves(x, y)
≡ ∃x. ¬∃y. Loves(x, y)
≡ ∃x. ∀y. ¬Loves(x, y)
```

自然語言是「有一個人不愛任何人」，不是「每個人都有某個不愛的人」。第一步否定外層全稱，得到反例 x；第二步否定內層存在，因此這個 x 對所有 y 都不愛。每推過一層量詞就翻轉一次，直到否定抵達 atomic predicate。

可以用三人模型驗算。若 Alice 誰也不愛，原句為假，否定式為真，Alice 就是 witness。若每人至少愛一人，否定式找不到 witness。具體模型常比重新背口訣更快抓到量詞順序錯誤。

## 否定 connective 仍要保持句型

投影片推薦 `¬(p ∧ q) ≡ (p → ¬q)` 與 `¬(p → q) ≡ (p ∧ ¬q)`。它們使否定後的公式仍維持全稱搭 implication、存在搭 conjunction 的慣用形狀。

「有一隻可愛小狗」為 `∃x. (Puppy(x) ∧ Cute(x))`。否定後得到：

```text
∀x. ¬(Puppy(x) ∧ Cute(x))
≡ ∀x. (Puppy(x) → ¬Cute(x))
```

它說「沒有小狗可愛」。若寫成 `∀x. (Puppy(x) ∧ ¬Cute(x))`，則變成論域中每個物件都是不可愛的小狗，遠強於原否定。完成符號操作後，務必讀回自然語言，確認語意沒有膨脹。

## 再否定空集合存在

投影片把前面的集合公式完整否定：

```text
¬∃S. (Set(S) ∧ ∀x. ¬(x ∈ S))
≡ ∀S. ¬(Set(S) ∧ ∀x. ¬(x ∈ S))
≡ ∀S. (Set(S) → ¬∀x. ¬(x ∈ S))
≡ ∀S. (Set(S) → ∃x. x ∈ S)
```

結果是「每個集合至少含一個元素」。雙重否定最後消去，外層 conjunction 改成 implication，才不會要求論域中每個物件都是集合。良好的紙筆流程是每行只做一次局部等價轉換；一次跳到終點時，漏翻一個量詞或否定會很難追查。

## restricted quantifier 是固定縮寫

CS103 允許 `∀x ∈ S. P(x)` 與 `∃x ∈ S. P(x)`。前者等同 `∀x. (x ∈ S → P(x))`，若 S 為空則 vacuously true；後者等同 `∃x. (x ∈ S ∧ P(x))`，若 S 為空則為假。這再次呼應全稱搭 implication、存在搭 conjunction。

投影片只允許這兩種限制量詞，不允許自行發明 `∀x with P(x)`、`∀y such that ...` 或 `∃P(x)`。restricted quantifier 是約定的語法糖，不是把英文塞到量詞旁的自由模板。其他限制條件應回到普通量詞與 connectives 表達。

## 唯一性包含存在與至多一個

用 `WayToFindOut(w)` 表達「只有一種方法能找出來」：

```text
∃w. (WayToFindOut(w) ∧
  ∀x. (WayToFindOut(x) → x = w)
)
```

它先提供至少一個 witness w，再要求任何有此性質的 x 都等於 w。等價地，內層可寫 `∀x. (x ≠ w → ¬WayToFindOut(x))`。

只寫「任兩個 P 物件都相等」僅保證至多一個，沒有 P 物件時也成立；只寫 `∃w P(w)` 僅保證至少一個。exactly one 必須合併兩個責任。數學常用 `∃!x.P(x)`，但投影片要求本課不用它，以普通 `∀`、`∃` 展開 existence 與 uniqueness，讓後續證明的兩個子目標清楚可見。

## 一套可執行的翻譯流程

面對自然語言句子，先列出論域與允許的 predicates、functions、constants；再改寫成「對每個……」「存在某個……」的受控語言；接著由外到內放量詞並標清 scope；全稱限制用 implication，存在限制用 conjunction；補上「其他」「唯一」帶來的不等式與唯一性條件；最後逐字讀回自然語言，並用一個滿足模型和一個反例模型測試。

否定時先在整式外加 `¬`，一次推過一個量詞並翻轉它，用 propositional equivalences 處理 connectives，消去雙重否定，再讀回自然語言。不要在推否定時順便交換量詞順序，也不要沒有等價規則便移動量詞。

## 常見錯誤與自我測試

四類錯誤最值得警戒：把 `∀x(A→B)` 寫成 `∀x(A∧B)`，會要求所有物件都是 A；把 `∃x(A∧B)` 寫成 `∃x(A→B)`，會讓非 A 物件投機成立；交換 `∀` 與 `∃`，會把依輸入選 witness 改成尋找全域 witness；忽略關係的參數順序，會顛倒誰對誰做事。

可用三題自測。翻譯「每個學生都讀某本書」與「有一本書被每個學生讀」，並畫模型說明不等價。否定 `∀x. (Cat(x) → ∃y. Loves(x,y))`，直到否定只在 atomic predicate 前。只用 `∀` 與 `∃` 表達「恰有一個 x 滿足 P」。答案若能逐層讀回原句，並能說清空限制集合的真值，才算掌握而非套模板。

## 材料缺口與閱讀界線

公開完整投影片足以核對四種句型、兩個 love 例子、量詞順序、空集合翻譯、否定表、限制量詞與唯一性，因此本講通過 material-fidelity gate。投影片沒有保存所有口頭轉折、學生提問或臨場例子；本文的檢查流程是依投影片步驟整理的學習框架，不冒充講師逐字內容。下一講預告 functions、first-order definitions 與 proofs with definitions，本文不提前展開。

## 更新紀錄

- 2026-08-22：依官方 First-Order Logic, Part II 完整投影片重建雙語正文，補齊巢狀量詞、否定、限制量詞與唯一性的推導。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 5: First-Order Logic, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/)
- [Official Lecture 5 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 2](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps2/)
