---
title: "Stanford CS103 Lecture 0：從集合語言走到 Cantor 對角線"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 2
tldr: "從集合的元素、子集合與冪集開始，最後用 Cantor 對角線證明任何集合都不可能和自己的冪集一樣大。"
description: "依 Stanford CS103 Lecture 0 投影片整理集合記號、集合建構式、子集合、冪集、基數與 Cantor 定理。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-01-introduction-set-theory-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 2 篇，對應 **Spring 2026 官方 Lecture 0（2026-03-30）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Introduction, Set Theory**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 三個問題決定這門課的方向

投影片用三個問題定位 CS103：哪些問題能用電腦解，屬於可計算性理論；為何有些問題比另一些困難，屬於複雜度理論；如何確定答案正確，則需要離散數學。這不是三個互不相干的單元。後半學期要證明某種電腦做不到一件事，前提正是能把「問題」、「電腦」與「證明」寫成精確物件。

當期行政資訊包括課程網站、考試占比、每週作業、課堂參與、CS103ACE 與 Problem Set 0。PS0 要確認 Qt 軟體、Honor Code 與考試時間。這些日期和比例只適用 Spring 2026；它們在本文的功能是交代 deck agenda，不是替未來學期提供規則。

## 集合的三個關鍵詞：無序、互異、可巢狀

集合是「互異物件的無序聚集」。因此 \(\{1,2,3\}=\{3,1,2\}\)：順序不是集合內容。\(\{1,1,2\}=\{1,2\}\)：重複寫同一元素不會增加一份副本。若需要保留順序或重複次數，應改用 sequence 或 multiset，而不是暗中改集合定義。

元素也可以是集合。\(\{1,\{2,3\}\}\) 有兩個元素：數字 1 與集合 \(\{2,3\}\)。內層的 2、3 並不是外層集合的直接元素。判讀時只看最外層逗號切出的物件，就不會把巢狀結構攤平。

兩集合相等的驗收條件是內容完全相同。可逐向檢查：A 的每個元素都在 B，且 B 的每個元素都在 A。這個方法稍後會正式寫成 \(A\subseteq B\land B\subseteq A\)。

## 元素關係與最容易混淆的 singleton

\(x\in S\) 表 x 是 S 的元素；\(x\notin S\) 表不是。空集合 \(\varnothing\) 沒有元素，而 singleton \(\{\varnothing\}\) 有一個元素，那個元素恰是空集合。因此 \(\varnothing\ne\{\varnothing\}\)，而且 \(\varnothing\in\{\varnothing\}\)。

同理，數字 \(1\) 與集合 \(\{1\}\) 型別不同；一般而言 x 也不等於 \(\{x\}\)。問「左邊是否等於右邊」前，先標記每一邊是 element 還是 set。外面多一層 braces 不是排版差異，而是建立一個新集合。

以 \(A=\{1,\{1\},\varnothing\}\) 自測：\(1\in A\) true；\(\{1\}\in A\) true；\(\varnothing\in A\) true；但 \(\{\varnothing\}\in A\) false。最後一題不能因 \(\varnothing\) 出現過就答 true，因待查的是包了一層的 singleton。

## 無限集合與課程採用的自然數慣例

\(\mathbb N=\{0,1,2,\ldots\}\) 是自然數；本課明確把 0 算入。\(\mathbb Z=\{\ldots,-2,-1,0,1,2,\ldots\}\) 是整數，字母來自德文 Zahlen。\(\mathbb R\) 是實數，例如 \(e,\pi,4\in\mathbb R\)。

domain 不是可省略的背景。例如「偶數集合」若不說是自然數、整數或實數，語意並不完整。CS103 後續寫 predicate、函數與語言時，都會反覆要求先確定合法輸入的 universe。

## 集合建構式逐欄閱讀

\[
\{n\mid n\in\mathbb N\text{ and }n\text{ is even}\}
\]

讀作：所有滿足右側條件的 n 所成集合。直線左側是被收集的 expression，右側先限制型別 \(n\in\mathbb N\)，再給篩選條件。它不是一段要依序執行的程式，而是 membership specification。

「小於 137 的實數」可寫 \(\{x\in\mathbb R\mid x<137\}\)；「負整數」可寫 \(\{z\in\mathbb Z\mid z<0\}\)。若把 domain 寫成 \(\mathbb N\)，第二個集合會變成空集合，因本課自然數沒有負值。每次翻譯都應用一個候選 member 與一個 nonmember 代入條件。

## subset 不是 element

\(A\subseteq B\) 的意思是 A 的每個元素都在 B。它談兩個集合間的 containment；\(x\in B\) 則談一個物件是否直接出現在 B。令 \(B=\{1,2,3\}\)，則 \(\{1,2\}\subseteq B\) true，\(1\in B\) true，但 \(\{1,2\}\in B\) false，因 B 的直接元素是數字，不是集合。

空集合是每個集合的 subset。要反駁 \(\varnothing\subseteq B\)，必找 \(x\in\varnothing\) 且 \(x\notin B\)，但前件永遠沒有 witness，所以 universal statement vacuously true。另一方面，\(\varnothing\in B\) 是否成立完全取決於 B 是否把空集列為直接元素。

subset equality 也可逐步判讀。若 \(A=\{1,2\}\)、\(B=\{2,1,1\}\)，先去除重複與順序後可見 \(A\subseteq B\) 且 \(B\subseteq A\)，所以 A=B。只證一個方向最多得到 containment，不能得到 equality。

## power set：列的是 subsets，不是原元素

\(\mathcal P(S)=\{T\mid T\subseteq S\}\)。若 \(S=\{a,b\}\)，逐一決定 a 選或不選、b 選或不選，得到

\[
\mathcal P(S)=\{\varnothing,\{a\},\{b\},\{a,b\}\}.
\]

因此 \(a\notin\mathcal P(S)\)，但 \(\{a\}\in\mathcal P(S)\)。空集合與 S 本身必在 power set 裡，因兩者都是 S 的 subsets。若 \(S=\varnothing\)，唯一 subset 是空集合，所以 \(\mathcal P(\varnothing)=\{\varnothing\}\)，不是 \(\varnothing\)。

再看 \(S=\{\varnothing\}\)。它只有一個元素，故 power set 有兩個元素：\(\varnothing\) 與 \(\{\varnothing\}\)。完整寫成 \(\mathcal P(S)=\{\varnothing,\{\varnothing\}\}\)。這個例子同時檢查 element、singleton 與 outer set 三層 braces。

有限 S 若有 n 個元素，\(\mathcal P(S)\) 有 \(2^n\) 個元素，因每個元素各有選／不選兩種獨立決定。n=2 的四個 subsets、n=0 的一個 subset 都符合公式。

## cardinality 與「一樣多」的配對判準

\(|S|\) 表 S 的 cardinality。有限集合直接計數；比較無限集合時不能等到數完，而要找 bijection，使一邊每個元素恰好配到另一邊一個元素，且沒有遺漏。

deck 嘗試把 S 與 \(\mathcal P(S)\) 配對。有限例子已顯示 power set 更大；問題是無限 S 是否可能因兩邊都 infinite 而配成 bijection。Cantor theorem 的答案仍是否定，而且不依 S 的內容。

## Cantor diagonal：先假設一張完整配對表

假設存在函數 \(f:S\to\mathcal P(S)\)，而且它 surjective；也就是每個 subset of S 都至少出現在某一列 f(x)。把每列標成 x，欄也用 S 的元素標記，格子記錄「欄元素 y 是否屬於 f(x)」。對角格則回答 \(x\in f(x)\) 嗎。

現在定義

\[
D=\{x\in S\mid x\notin f(x)\}.
\]

D 對每個 x 都把 diagonal answer 翻轉：若 \(x\in f(x)\)，就排除 x；若 \(x\notin f(x)\)，就納入 x。因 D 是 S 的 subset，所以 \(D\in\mathcal P(S)\)。若 f 真 surjective，必存在某 d 使 \(f(d)=D\)。

把 d 代回定義：

\[
d\in D\iff d\notin f(d)\iff d\notin D,
\]

矛盾。因此沒有 surjection \(S\to\mathcal P(S)\)，更不可能有 bijection；\(|S|<|\mathcal P(S)|\)。

## 對角線每一步的量詞與型別

第一步假設的是「存在一個 surjective f」；反證必對任意候選 f 都能構造缺漏。D 依賴 f，正是為每張聲稱完整的表量身打造 missing subset。第二，f(x) 的型別是 subset of S，而不是 S 的元素；所以問 \(x\in f(x)\) 才合法。第三，D 收集的是 S 的元素，因此 D 自己確實是 subset of S。

最後的 d 來自 surjectivity：因 D 在 codomain \(\mathcal P(S)\)，必「存在 d∈S」使 f(d)=D。若沒有這個存在量詞，只證明 D 與每一列不同的說法就無法落到 self-row contradiction。整個 argument 的核心是：對任意列 x，D 在 x 這個座標與 f(x) 不同，因此沒有一列能等於 D。

## 可執行自測

令 \(S=\{1,\{2\},\varnothing\}\)，逐一判斷：\(1\in S\)、\(\{2\}\in S\)、\(2\in S\)、\(\varnothing\subseteq S\)、\(\{\varnothing\}\subseteq S\)。每題先圈出左側是 element 還是 set，再用最外層元素清單作答。

接著完整列出 \(\mathcal P(\{a,b,c\})\)，應有八個 subsets；檢查是否包含 \(\varnothing\)、三個 singleton、三個 two-element sets 與原集合。最後任畫一張三列的 f-table，依 diagonal rule 造 D，逐列指出 D 在哪個元素上與 f(x) 不同。若能說出「D 是 subset，所以應在 codomain；但它不同於每一列」，就抓到 Cantor proof 的完整責任。

## 材料缺口與閱讀界線

公開投影片完整呈現集合記號、subset／power set 例題與 Cantor 對角線，因此足以重建本講 agenda。錄影、逐字稿與學生問答不公開；本文不把推導間的作者銜接冒充講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 從官方 deck 重建集合論正文，補齊 Cantor 對角線的量詞／型別檢查，並移除失效講義連結。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 0: Introduction, Set Theory](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/)
- [Official Lecture 0 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/syllabus)
- [CS103 Spring 2026 Problem Set 0](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps0/)
