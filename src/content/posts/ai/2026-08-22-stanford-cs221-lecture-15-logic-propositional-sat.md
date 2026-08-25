---
title: "CS221 Lecture 15：Logic I：模型、蘊涵與 SAT"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 16
tldr: "第 15 講分開 propositional logic 的 syntax 與 semantics：model checking 用 satisfying assignments 定義 entailment，SAT solver 找見證，inference rules 則必須同時檢查 soundness 與 completeness。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 15：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-15-logic-propositional-sat-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 15**，2025-11-10 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準，本講主要材料是官方可執行講義裡的 [`propositional_logic.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=propositional_logic)。以下不是把「logic」濃縮成幾個名詞，而是沿著程式的執行順序，把每一個定義、例子與轉換接起來。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。

## 這一講的問題：為什麼需要邏輯

這一講從 AI 的基本循環切入：perceive、reason、act、learn。上一講談 Bayesian networks 的機率推理；這一講轉向 logical reasoning，先處理 propositional logic，之後才會到更有表達力的 first-order logic。切換不是因為機率不重要，而是因為 AI 也需要一種能把規則與知識寫得清楚、再據此推導的語言。

講義先給一個不必窮舉的例子：如果 `A + B = 10` 且 `A - B = 4`，`A` 是多少？人通常會用代數操作符號，而不是把所有可能的 `A`、`B` 值逐一試過。這就是 symbolic／logical reasoning 的直覺：把問題放進一套結構化語言，利用結構取得結論。

歷史上，logic 曾是 1990 年代以前 AI 的主要典範，但它有清楚的邊界。第一，它是 deterministic 的，不處理 uncertainty；機率方法補上這個缺口。第二，它偏 rule-based，不會自己利用 data；machine learning 處理資料驅動的部分。那為什麼仍然要學？講義給的答案是 expressivity：邏輯可以用緊湊形式表達豐富知識。「緊湊」不是說所有問題都便宜，而是說一個公式可能代表一大組可能世界，後面會看到它同時帶來力量與計算成本。

把 logic 想成一種 language，會比把它想成一串孤立符號更準確。邏輯語言有兩個目標：第一，represent knowledge about the world；第二，reason with that knowledge。自然語言看似方便，卻會滑動。講義的例子是：dime 比 nickel 好，nickel 比 penny 好，所以 dime 比 penny 好，這個推論讀起來合理；但如果說 penny 比 nothing 好、nothing 比 world peace 好，是否就能推出 penny 比 world peace 好？自然語言的詞與關係未必有穩定的形式意義。

因此課程區分 informal natural languages 與 formal languages。英文可以說「Two divides even numbers」，德文也能表達同一件事；程式語言用 Python 的 `def even(x): return x % 2 == 0`，嚴格規定字串與執行方式。邏輯語言也一樣，例如 first-order logic 的 `∀x. Even(x) → Divides(x, 2)`，或 description logic 的 `Even ⊑ ∀ Divides.2`。但官方材料同時出現 `Divides(x, 2)` 與「Two divides x/even」的語序；本文保留這個 notation/prose ambiguity，不判定校正寫法。重點是語言提供可檢驗的形式。

一套 logic 由三個 ingredients 組成：

- **Syntax**：哪些表達式是合法公式。
- **Semantics**：這些公式代表什麼，以及在什麼情況下為真。
- **Inference rules**：如何從已有公式推導新的有效公式。

Syntax 與 semantics 必須分開。`2 + 3` 與 `3 + 2` 是不同的 syntax，卻可以有同一個 semantics：5。反過來，`3 / 2` 的 syntax 相同，在 Python 2.7 與 Python 3 的 semantics 可以不同。這個區分會貫穿整講：模型與 interpretation 給符號意義，inference rule 則是在語法結構上操作；最後要證明兩者是否對得上，才會談 soundness 與 completeness。

## 命題邏輯的 syntax：先定義什麼能寫

命題邏輯是最簡單的 logic 形式。它的 atomic formulas 是 propositional symbols，例如 `P`、`Q`、`Rain`、`Wet`。它們先只是名字，不先假定 Rain 在現實中真的下雨，也不先替 Wet 加入因果解釋。

接著給五個 logical connectives：`∧`、`∨`、`¬`、`→`、`↔`。如果 `f` 與 `g` 是 propositional formulas，便可遞迴構造：`¬f`、`f ∧ g`、`f ∨ g`、`f → g`、`f ↔ g` 也是公式。除此之外都不是。這個「nothing else is a formula」提醒 syntax 不是看到熟悉符號就放行。

講義用 `Rain`、`Wet` 展示五種構造：`¬Rain`、`Rain ∧ Wet`、`Rain ∨ Wet`、`Rain → Wet`、`Rain ↔ Wet`；另有 `P`、`¬P`、`¬P ∨ Q`、`P → (Q ∨ ¬P)`。公式是樹狀結構，括號保留子公式邊界。

相對地，`P ¬Q`、`P + Q`、`P(A) ∨ Q(B)` 都不是本講定義的命題公式。第一個缺乏合法的 connective 結構，第二個把代數運算混進來，第三個把 predicate／argument 的形式帶進尚未提供這些構造的語言。到這裡，我們只知道公式的集合，還不知道公式的意思。

## Semantics：model、interpretation 與 models

公式本身只是 symbols。要讓它有真假，需要 model。命題邏輯的 model `w` 代表世界的一個 state：它為每一個 propositional symbol 指派 `true` 或 `false`。如果只有 `A`、`B`、`C` 三個 symbol，就有 `2^3 = 8` 個可能 models，從 `{A: False, B: False, C: False}` 一路到 `{A: True, B: True, C: True}`。這些不是八個「答案」，而是八種對世界的完整假設。

Interpretation function `ℐ` 把 syntax 接到 semantics。它接收公式 `f` 與 model `w`，回傳 `true` 或 `false`，意思是「`f` 在 `w` 中為真嗎？」對 atomic formula，直接查 `w[f]`。對 `¬g`，回傳 `not ℐ(g,w)`；對 `g ∧ h`，兩邊都要真；對 `g ∨ h`，至少一邊真；對 `g → h`，實作為 `not ℐ(g,w) or ℐ(h,w)`；對 `g ↔ h`，則比較兩邊的真假是否相同。

官方程式用 `I(f, w)` 遞迴走過 Z3 formula。例子是 `f = (¬A ∧ B) ↔ C`，model 是 `A=True, B=True, C=False`。Interpretation 不靠人對句子的直覺猜答案，而是由公式的根節點往下算：先取 `A` 的否定，再與 `B` 做 conjunction，最後與 `C` 比較。對這個 model，`¬A` 為 false，`¬A ∧ B` 為 false，而 `C` 也是 false；因此兩個子式真假相同，整個 biconditional 為 true。這展示了 syntax tree 如何決定 truth value。

有了 `ℐ`，就能定義一個公式的 **models**，記為 `M(f)`：所有讓 `ℐ(f,w)=true` 的 models。程式的 `get_models` 會對指定 symbols 的所有真假組合做 Cartesian product，為每一組建立 dictionary，再用 `I` 篩選。例子中，`Rain ∨ Wet` 的 models 是兩者至少一個為真的 assignments；`Rain ∧ Wet` 的 models 則只保留兩者都真的 assignments。

一個小公式可以 compactly represent 很大的 model 集合；但最直接的 model checking 仍可能逐一考慮 assignments。表達緊湊與計算便宜不是同一件事。

## Knowledge base：把已知事情放在一起

Knowledge base（KB）是 formulas 的集合，可以把它想成隨時間加入 facts 的容器。KB 的 models，`M(KB)`，是同時滿足 KB 中每一條公式的 models，也就是在目前知識下仍可能的 worlds。

用 `Rain`、`Wet` 來看：`KB = [Rain, Rain → Wet]`。第一條要求下雨，第二條要求若下雨就濕；所以 KB 的 models 是 `M(Rain)` 與 `M(Rain → Wet)` 的 intersection。從 semantics 看，KB 等價於把所有公式 conjunction 起來：`to_formula(kb)` 會得到 `Rain ∧ (Rain → Wet)`，再對這個單一公式求 models，結果與逐條取 intersection 相同。

加入更多公式只會縮小或維持可能世界：`KB ⊆ (KB ∪ {f})`，因此 `M(KB ∪ {f}) ⊆ M(KB)`。集合可能不變、變少或變成空集合，這就是後面三種關係的共同骨架。

## Entailment、contradiction 與 contingency

現在比較 `M(KB ∪ {f})` 與原本的 `M(KB)`，問的是：加入 `f` 對可行世界造成什麼影響？

**Entailment** 寫成 `KB ⊧ f`。定義是 `M(KB ∪ {f}) = M(KB)`：加入 `f` 沒有排除任何原本的 model，所以 `f` 已經被 KB 的所有 models 強制為真。程式例子 `entails([Rain, Rain → Wet], Rain)` 回傳 true，因為 KB 本來就包含 Rain。這比「在某一個 example 裡看到 Rain」強；它是對所有符合 KB 的世界做承諾。

**Contradiction** 是 `M(KB ∪ {f}) = ∅`。加入 `f` 後沒有任何 model 留下，表示 `f` 與 KB 不相容。`[Rain, Wet]` 加上 `¬Wet` 就是這種情況。這不代表公式在所有可能世界都假，而是代表它不能與目前這個 KB 同時成立。

**Contingency** 是 `∅ ≠ M(KB ∪ {f}) ≠ M(KB)`。新公式保留了一些 model，但排除了另一些；它縮小了可能世界，卻沒有把集合清空。`[Rain]` 加上 `Wet` 是講義的例子：有些下雨且濕的世界仍然存在，但只知道下雨並不足以推出濕。

三者也可用「知識增加多少」來讀：entailment 沒有增加資訊，contradiction 使候選集合歸零，contingency 則增加了資訊但仍可相容。還有一個重要等價關係：`KB` contradicts `f`，當且僅當 `KB ⊧ ¬f`。若所有 KB models 都讓 `¬f` 為真，當然不可能再加入 `f` 而保留 model。

## Ask 與 Tell：用 KB 做什麼

有 KB 之後，最直接的操作是 `Ask[f]` 與 `Tell[f]`。`Ask` 對 KB 提出 yes/no 式問題；但講義特別指出回應其實有三種。若 KB entails `f`，答案是 **Yes**；若 KB contradicts `f`，答案是 **No**；若是 contingency，答案是 **I don't know**。

三個例子分別是：`KB=[Rain,Wet]` 問 `Rain ∨ Wet`，回 Yes；`KB=[Wet, ¬Rain]` 問 `Rain`，回 No；`KB=[Rain]` 問 `Wet`，回 I don't know。第三個很容易被誤答成 Yes，因為人可能把「下雨」與「濕」當成常識因果；但這個 KB 沒有 `Rain → Wet`，命題邏輯只使用明確放進去的公式。

`Tell` 是把新陳述加入 KB，但也有三種反應：如果新公式已被 entail，回 **I already knew that**，不需改變 KB；如果造成 contradiction，回 **I don't buy that**，保留原 KB；如果是 contingency，回 **I learned something new**，把 `f` 加進 KB。程式示範：`[Rain, Rain → Wet]` Tell `Wet`，早已知道；`[Rain,Wet]` Tell `¬Rain`，不接受；`[Rain]` Tell `¬Wet`，得到一個新的、仍可滿足的限制。

Ask/Tell 都是比較舊 KB 與加入 `f` 後的 model 集合，再把集合關係翻成回應；直接實作的代價是兩個 model 集合可能呈指數成長。

## 與 Bayesian networks 的對照

講義接著把剛離開的 Bayesian networks 拉回來。Bayesian network 為一組變數的每個 assignment 給一個 probability；命題邏輯則只關心 assignment 是否是 model。對照關係是：random variables 對應 propositional symbols，assignments 對應 models；probabilistic inference 的 evidence 對應 KB，query 對應正在 Ask 的公式。

例如 `P(Rain | Wet = 1)` 可以用「Tell[Wet]；Ask[Rain]」作概念上的對照，但兩者回答的形式不同。命題邏輯允許 query 與 evidence 是任意 formulas，例如 `(Rain ∧ Wet) ∨ (Rain ∧ ¬Snow)`；Bayesian network 在這段對照裡處理的是變數的 assignments。

如果給定 joint distribution `P`，可以把所有滿足 KB 的 worlds 加總：`P(KB) = Σ_{w ∈ M(KB)} P(W=w)`；加入 `f` 後是 `P(KB ∪ {f})`，條件機率則為 `P(f | KB) = P(KB ∪ {f}) / P(KB)`。這會把命題邏輯的 yes/no/I don't know 推廣成 0 到 1 的數字。重點不是把兩種 logic 混成一種，而是看見同一批 assignments 可以只做真假篩選，也可以承載機率。

## Satisfiability：把推論改寫成一個問題

前面的 Ask 與 Tell 都靠 entailment、contradiction、contingency；如果每次都列舉所有 models，效率會被指數級的集合拖住。講義因此把多個關係收斂到一個 operation：KB 是 **satisfiable**，當且僅當 `M(KB) ≠ ∅`。也就是至少存在一個 world 同時滿足全部公式。

先對 `KB ∪ {f}` 呼叫 satisfiability checker。如果結果是 unsatisfiable，就知道 KB contradicts `f`。但若它 satisfiable，還分不出 entailment 與 contingency：至少有一個符合新限制的 world，卻不知道是否所有原本的 world 都符合。

此時使用剛才的等價關係。檢查 `KB ∪ {¬f}`：如果它 unsatisfiable，就代表沒有任何 KB model 能讓 `¬f` 成立，所以 `KB ⊧ f`；如果它 satisfiable，則存在一個 KB model 使 `f` 為假，而前一次又存在使 `f` 為真的 model，這就是 contingency。需要兩次呼叫，是因為一次 satisfiability check 只有一個 bit 的結果，而 Ask/Tell 要區分三種結果。

這個工作被稱為 **model checking**：輸入一個 KB，輸出它是否 satisfiable。程式用 Z3 示範最小流程：建立 `Solver`，對 `[Rain, Wet]` 中每個 formula 呼叫 `solver.add(f)`，再呼叫 `solver.check()`。如果結果是 `sat`，可以用 `solver.model()` 取出某個 `M(KB)` 中的 model。這個 model 是一個見證，證明至少有一個 assignment 滿足 KB；它不是所有 models 的清單，也不是唯一正解。

講義在這裡點出 solver 背後的 SAT 演算法：**DPLL algorithm（exhaustive search）** 與 **conflict-driven clause learning（CDCL）**。本講 source 只列出這兩個名字與它們屬於 SAT solver 的位置，沒有在程式中展開 DPLL 的 branching、unit propagation 或 CDCL 的 clause-learning 實作，因此不把那些細節冒充成這份 lecture 的推導。SAT 的核心契約仍然是同一個：判斷是否存在滿足所有條件的 assignment。

## 從 model checking 回到人類的推導

到目前為止，我們用 semantics 做 Ask/Tell：枚舉或交給 solver，問 model 是否存在。但最開頭的代數例子提醒我們，人通常不會先列出所有 assignments，再從集合中找答案，而是直接操作符號。這引出 inference rules。

講義的 inference example 很小：`Rain`；`Rain → Wet`；因此 `Wet`。一般形式是 modus ponens：`p, p → q ⊢ q`。一條 inference rule 有一組 premises `f_1, ..., f_n` 與一個 conclusion `g`。它操作的是公式的 syntax，不是直接遍歷 semantics。

Forward inference 的輸入是 inference rules 的集合 `Rules` 與初始 KB。重複進行：從 KB 選一組公式，若有一條規則符合 `f_1, ..., f_n ⊢ g`，就把 `g` 加進 KB；直到 KB 不再改變。如果 `f` 最終被加入，就說 KB derives／proves `f`，記作 `KB ⊢ f`。

在 Rain/Wet 的例子裡，初始 KB 有 Rain，規則有 `Rain → Wet` 對應的 modus ponens，所以 Wet 會被加入。但講義也刻意展示不能推出的句子：從這些規則不能推出 `¬Wet`，也不能推出 `Rain → Slippery`。推理器能得到什麼，取決於規則與 premises，而不是取決於讀者覺得某句話「可能合理」。

## Soundness 與 completeness：語法推得出來的，是否真的成立

現在有兩個看似相近的集合。Syntax 面是 `{f: KB ⊢ f}`，也就是 inference rules 實際 derive 出來的 formulas；semantics 面是 `{f: KB ⊧ f}`，也就是所有 KB models 都滿足的 formulas。前者是程序產物，後者是 truth 的定義。

**Soundness** 是 `{f: KB ⊢ f} ⊆ {f: KB ⊧ f}`：能被規則推出的每一條，都真的被 KB 蘊涵。它保證推理器不會產生不實的結論，也就是 nothing but the truth。**Completeness** 是 `{f: KB ⊧ f} ⊆ {f: KB ⊢ f}`：所有被 KB 蘊涵的公式，規則系統都能推出。它保證不是只找到一部分真理，而是 the whole truth。


## source 的邊界

公開 artifact 到 completeness 為止；沒有 CNF 轉換或 DPLL/CDCL 的完整實作。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：propositional_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=propositional_logic)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
