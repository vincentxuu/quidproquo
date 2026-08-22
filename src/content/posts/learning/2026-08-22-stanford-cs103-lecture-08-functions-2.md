---
title: "Stanford CS103 Lecture 7：函數 II——滿射、假設與函數合成"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 9
tldr: "本講以滿射與鳥類證明釐清『假設』和『證明』的不同操作，再證明 involution 必為單射與滿射，並把同一套推理帶進函數合成。"
description: "依 Stanford CS103 Functions Part II 官方投影片，整理滿射證明、量詞在假設與目標中的差異、involution 的性質，以及函數合成保持單射與滿射。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-08-functions-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 9 篇，對應 **Spring 2026 官方 Lecture 7（2026-04-15）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

Functions Part I 定義了 domain、codomain、involution 與 injection；Part II 真正要練的，不只是再多背一個函數類型，而是把一階邏輯式讀成證明動作。相同的 `∀` 或 `→`，放在「已知」與「待證」的位置，會要求完全不同的下一步。這個差異串起本講所有例題。

## 1. 前講回顧：函數的型別是證明契約

寫作 `f : A → B` 同時宣告：每個 `a ∈ A` 都必須有定義，而且 `f(a)` 必須落在 `B`。它沒有承諾 `B` 的每個元素都被命中。domain 決定合法輸入；codomain 是輸出允許落入的集合，不是實際值域。

若 `f : A → A` 且 `∀x ∈ A. f(f(x)) = x`，則 `f` 是 involution：做兩次回到原點。若不同輸入必有不同輸出，`f` 是 injection。單射可寫成 `a₁ ≠ a₂ → f(a₁) ≠ f(a₂)`，也可用等值形式 `f(a₁)=f(a₂) → a₁=a₂`。選哪一式，取決於題目給了什麼。

## 2. 單射證明：從量詞抽出 Assume 與 WTS

投影片以 `f : ℕ → ℕ`、`f(n)=2n+7` 回顧單射。採第二個定義時，證明骨架是：任取 `n₁,n₂ ∈ ℕ`，假設 `f(n₁)=f(n₂)`，要證明 `n₁=n₂`。代入定義得 `2n₁+7=2n₂+7`，消去七與二便得結論。

投影片特別提醒：一階邏輯用來設計證明，正式證明仍應寫成清楚的自然語言。量詞告訴你任取兩數，implication 告訴你假設前件、證明後件；翻譯完成後，不必讓正文堆滿 `∀` 與連接詞。變數名稱也要前後一致，否則一個正確想法仍會變成不可核對的證明。

## 3. 滿射：codomain 的每個目標都有原像

函數 `f : A → B` 若滿足 `∀b ∈ B. ∃a ∈ A. f(a)=b`，就稱為 surjective 或 onto。單射限制「兩個輸入不可碰撞」，滿射要求「每個 codomain 元素不可漏掉」。因此滿射極度依賴 codomain；同一條計算規則換一個 codomain，答案可能改變。

投影片的山峰圖把這個觀念畫成覆蓋：每個右側目標都至少有一支箭射到。這和函數基本規則不同。函數規則從 domain 出發，要求每個輸入恰有一個輸出；滿射反向檢查 codomain，要求每個候選輸出至少有一個來源。多個輸入命中同一輸出不妨礙滿射。

## 4. 完整滿射證明：先固定輸出，再造輸入

對 `f : ℝ → ℝ`、`f(x)=2x`，先任取 `y ∈ ℝ`。目標是找 `x ∈ ℝ` 使 `f(x)=y`。從 `2x=y` 倒推，選 `x=y/2`。它是合法實數輸入，而且 `f(y/2)=2(y/2)=y`，所以任意 `y` 都有原像。

這個 witness 必須依賴先前任取的 `y`；固定一個 `x` 不可能覆蓋所有輸出。投影片逐步修正錯誤候選 `x=2y`，提醒 witness 不是形式裝飾，而必須經代回檢查。穩定流程是：任取目標、解出候選、檢查候選屬於 domain、代回驗證。漏掉合法性檢查，在更複雜的 domain 中尤其危險。

## 5. 量詞的證明規則不是同一張背誦表

目標為 `∀x. P(x)` 時，讓讀者任取 `x`，再證明該任意選擇具有 `P`。目標為 `∃x. P(x)` 時，由作者提供具體 witness 並驗證。implication 的目標要假設前件、證明後件；conjunction 要兩邊都證明；biconditional 要證明兩個方向。

這張表只回答「如何證明某形狀的式子」。本講補上另一半：若同一式子是已知條件，操作會不同。把這兩個角色混用，是形式證明中最常見、也最不容易靠後續代數補救的結構錯誤。草稿先標出 Assume 與 Want to Show，通常比立刻展開符號有效。

## 6. 鳥類定理：先看目標需要哪個任意物件

投影片考察：「若所有鳥都會飛，則所有鷺都會飛。」用 predicates 可寫成 `(∀b. Bird(b) → CanFly(b)) → (∀h. Heron(h) → CanFly(h))`，並使用每隻鷺都是鳥的背景關係。

直接證明先假設所有鳥會飛；目標則是所有鷺會飛。因此下一個任意物件應是鷺 `h`，不是任意鳥 `b`。從 `h` 是鷺得到它是鳥，再把「所有鳥會飛」套到這個已出現的 `h`，便得它會飛。若先任取鳥 `b`，只能推出那隻鳥會飛，卻沒有理由說它是鷺，證明便卡住。選變數不是從左往右掃式子，而由當前目標決定。

## 7. 證明 universal 與假設 universal 的差別

要**證明** `∀x. P(x)`，必須引入新的任意 `x`，並證明 `P(x)`。但若**假設** `∀x. P(x)`，一開始通常不引入任何變數；等到別處產生相關值 `z`，才將 universal instantiate 成 `P(z)`。

鳥類證明正好對照兩者。結論中的 universal 是待證，所以立即任取鷺 `h`。前提中的 universal 是已知，所以不另造鳥 `b`；待 `h` 被辨認為鳥後，才用前提推出 `CanFly(h)`。假設 universal 像一張可重複使用的規則卡，但必須先有合適實例；證明 universal 則要求處理一個任意而非特殊的實例。

## 8. 假設其他連接詞時會得到什麼

假設 existential `∃x. P(x)`，可引入一個符合 `P` 的代表值，但不能假定它還有未給定的特殊性。假設 conjunction `A ∧ B`，可分別取得 `A` 和 `B`。假設 disjunction `A ∨ B`，通常要分兩個 cases，不能自行挑喜歡的一邊。

假設 biconditional `A ↔ B`，可取得 `A→B` 與 `B→A`。假設 implication `A→B` 時，不能立刻宣告 `B`；必須先從別處知道 `A`，才能使用 modus ponens。假設 negation 時則先簡化其邏輯形狀。共同精神是：假設只授予它邏輯上確實承諾的資源。

## 9. 連接三類函數：involution 為何必為滿射

定理：對任何 `f : A → A`，若 `f` 是 involution，則 `f` 是 surjective。展開為 `(∀x ∈ A. f(f(x))=x) → (∀b ∈ A. ∃a ∈ A. f(a)=b)`。由外層 implication 假設 involution；由待證 universal 任取 `b`；由待證 existential 造出 `a`。

圖像提示是從目標 `b` 往回找。選 `a=f(b)`；因 `f:A→A`，所以 `a∈A`，而 involution 性質給出 `f(a)=f(f(b))=b`。這也顯示 domain/codomain 為何不能省略：只有映回同一集合，`f(b)` 才能直接成為下一次輸入與合法 witness。證明不是猜到答案而已，還要交代 witness 為何在正確集合。

## 10. involution 為何也必為單射

若 `f:A→A` 是 involution，任取 `a₁,a₂∈A` 且假設 `a₁≠a₂`，目標為 `f(a₁)≠f(a₂)`。反設 `f(a₁)=f(a₂)`，對兩邊再套 `f`，便有 `f(f(a₁))=f(f(a₂))`。由 involution 性質得到 `a₁=a₂`，矛盾，所以輸出不同。

也可採單射的等值定義，直接從相同輸出推相同輸入。兩種寫法的核心相同：等到 `a₁,a₂` 出現後，才把 universal involution 假設分別套到它們。投影片也將「用另一個 injectivity 定義重寫」留作練習，因為同一定理可用不同 proof interface 呈現。

## 11. 關係圖：involution 是強條件

至此可知 involution 同時推出 injection 與 surjection。它不是和兩者無關的第三個標籤，而是更強的自我反轉條件。反方向一般不成立：單射未必做兩次回原點，滿射也未必；即使同時單射與滿射，也不必是自己的 inverse。

所以看函數型別時，不只問它屬於哪類，也要問定義之間有哪些 implication。證明關係不能靠箭頭圖看起來像，而應展開結論的量詞，再從前提構造所需物件。具體小例子與圖像適合探索；完成後仍要回到可逐步核對的論證。

## 12. 函數合成：型別先對齊，再談性質

若 `f : A → B` 且 `g : B → C`，合成 `g ∘ f : A → C` 定義為 `(g ∘ f)(x)=g(f(x))`。符號寫作 `g ∘ f`，求值卻先做右邊 `f`，再把結果送入 `g`。

這不是任意記法：`f(x)` 落在 `B`，恰是 `g` 的 domain。合成的 domain 是 `f` 的 domain，codomain 是 `g` 的 codomain。若中間型別接不起來，表達式沒有良好定義。每次感到順序混亂，就把圓圈符號展開成巢狀呼叫，再沿 `A→B→C` 檢查。

## 13. 單射在合成下封閉

若 `f:A→B` 和 `g:B→C` 都是 injection，則 `g∘f` 也是 injection。任取不同的 `a₁,a₂∈A`。因 `f` 單射，得到 `f(a₁)≠f(a₂)`；兩值都在 `B`，再由 `g` 單射得到 `g(f(a₁))≠g(f(a₂))`，也就是合成的輸出不同。

論證次序和資料流相同：不同性先通過 `f`，再通過 `g`。若只知道合成單射，可以推出 `f` 必單射；卻不一定推出 `g` 在整個 `B` 單射，因為合成可能只看見子集合 `f(A)`。這個邊界再次提醒我們，函數性質總要連同 domain/codomain 判讀。

## 14. 滿射在合成下封閉

extra slides 給出對偶結果：若 `f:A→B` 與 `g:B→C` 都是 surjection，則 `g∘f:A→C` 也是 surjection。任取 `c∈C`。由 `g` 滿射，存在 `b∈B` 使 `g(b)=c`；由 `f` 滿射，存在 `a∈A` 使 `f(a)=b`。所以 `(g∘f)(a)=g(f(a))=g(b)=c`。

這次從終點倒著走：先為 `c` 找中間原像 `b`，再為 `b` 找初始原像 `a`。與單射證明相比，兩者反映定義方向：單射把差異往前傳，滿射把 witness 往後追。若漏了其中一個滿射前提，這條原像鏈就可能在某一層中斷。

## 15. 常見錯誤與修正流程

第一，將 codomain 當實際值域；修正是寫清 `f:A→B`，再獨立檢查每個 `b∈B` 是否有原像。第二，證明 existential 只說存在卻不給 witness；應倒解候選並代回。第三，一看到 universal 就引入變數，忽略它是已知還是待證；草稿先標 Assume/WTS。

第四，寫 `g∘f` 卻先算 `g`；每次展開成 `g(f(x))` 並核對中間集合。第五，只靠箭頭圖宣稱性質；圖用來探索，正式證明仍須逐項完成量詞責任。第六，把錯誤 witness 留在證明中不驗算；任何構造都至少檢查型別與目標等式兩關。

## 16. 可執行自測

1. 對 `f:ℝ→ℝ, f(x)=3x-5`，任取 `y` 並寫出使 `f(x)=y` 的 witness。
2. 解釋為何 `n↦n+1` 作為 `ℕ→ℕ` 不是滿射，但作為 `ℤ→ℤ` 是滿射。
3. 寫出「若所有程式設計師都會邏輯，則所有 CS103 學生都會邏輯」的骨架，指出還需哪個包含關係。
4. 用相同輸出推出相同輸入的版本，重寫合成保持單射的證明。
5. 為滿射合成畫三欄 `A→B→C`，從任意 `c` 反向標出 `b` 和 `a`。

若卡住，先不要做代數。圈出目前是「假設」還是「待證」，再看最外層連接詞要求哪個動作。這正是本講最可重用的技巧，也能防止選錯任意物件或在沒有前件時濫用 implication。

## 17. 材料缺口與閱讀界線

公開投影片完整呈現 agenda、定義、鳥類例題、兩個 involution 定理、函數合成，以及 extra slides 的滿射合成證明，因此足以重建上述脈絡。投影片沒有保存口頭轉折、即時投票結果或學生討論；本文不將推測補成講師原話。自測題與錯誤整理是依投影片概念設計的作者練習，不是 Stanford 原題或解答。

## 更新紀錄

- 2026-08-22：依官方 Functions Part II 完整投影片重建全文，恢復滿射、假設與證明、involution 關係及函數合成的 deck-specific 證明。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 7: Functions, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/)
- [Official Lecture 7 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
