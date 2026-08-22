---
title: "Stanford CS103 Lecture 8：用雙射定義基數與 Cantor 對角論證"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 10
tldr: "兩個集合等大，意思是它們之間存在雙射；Cantor 的對角集合則能對任意 S 到其冪集的函數造出一個漏接值。"
description: "依 Stanford CS103 Spring 2026 Lecture 8 官方投影片，整理雙射、基數相等、區間等勢證明與 Cantor 對角論證。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-09-cardinality-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 10 篇，對應 **Spring 2026 官方 Lecture 8（2026-04-17）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講官方題目是 **Set Theory Revisited**，實際主線是先把 injection 與 surjection 合成 bijection，再用雙射定義「兩個集合有相同基數」，最後正式證明第一講預告的 Cantor 定理。重點不是把有限計數硬套到無限集合，而是重新定義「一樣多」所需的證據。

## 今日路線：從雙射走到 Cantor 定理

投影片列出 bijections、cardinality 的正式定義、Cantor 定理的正式證明。三段是一條依賴鏈：雙射提供逐一配對；逐一配對讓等勢不必依賴整數；等勢定義再把 Cantor 定理轉成「不存在某種雙射」的函數命題。

量詞決定證明難度。要證 `|S|=|T|`，只要**存在**一個雙射；要證 `|S|≠|T|`，卻要排除**所有**雙射。所以展示一個失敗的配對不能證明集合不等大。投影片也公告第一次期中考涵蓋 Problem Set 1、2，題型含證明；最實際的準備是能寫出 well-defined、injective、surjective 的模板。

## 雙射：同時單射又滿射

若 `f:A→B` 是單射，codomain 每個元素最多被一個 domain 元素映到；若它是滿射，每個 codomain 元素至少被一個 domain 元素映到。雙射同時滿足兩者，因此每個 `B` 元素恰好對應一個 `A` 元素。

正式地說，bijection 就是既 injective 又 surjective 的 function。直覺圖像是一對一配對，既沒有碰撞也沒有漏接；正式證明仍須分別履行兩個量詞義務。還要分清「某函數不是雙射」與「兩集合之間沒有雙射」：前者只否定候選者，後者才否定等勢。

## 基數相等的新定義

有限集合的基數是元素個數，以 `|S|` 表示。若 `S={1,2}`、`T={3,6}`，可以先數得兩邊都是整數 `2`，再使用整數的等號。無限集合沒有可先算出的有限整數，不能把「無限」當成同一個普通數字。

CS103 採用：

```text
|S| = |T|  iff  there exists a bijection f : S → T.
```

「一樣多」被改寫成可驗證的結構：能否把兩邊元素無重複、無遺漏地配對。定義同時適用有限與無限集合。存在量詞不能省略：一張不單射或不滿射的圖不足以推出不等勢；只要另一個函數可能是雙射，相等仍未被排除。

## 區間也能等勢：`[0,1]` 與 `[0,2]`

閉區間 `[a,b]` 是 `{x∈ℝ | a≤x≤b}`，開區間 `(a,b)` 排除端點。投影片比較 `[0,1]` 與 `[0,2]`：第二段長度是第一段兩倍，集合基數卻可相同。候選函數為

```text
f : [0,1] → [0,2]
f(x) = 2x.
```

它把端點與中間實數按比例伸展。圖像看似明顯，正式證明卻有三關：輸出留在 codomain、沒有碰撞、沒有漏接。這也分開幾何測度與集合基數：長度回答佔據多少實線，基數回答能否逐一配對，兩者不同不矛盾。

## 第一關：函數確實 well-defined

任取 `x∈[0,1]`。由 `0≤x≤1` 得 `0≤2x≤2`，所以 `f(x)=2x∈[0,2]`。這確認規則真的是從指定 domain 到指定 codomain 的函數。

投影片說明一項證明慣例：定義函數時通常明寫 domain／codomain 規則；deterministic 若由公式直接可見，未必另立段落。這不代表唯一性不重要，而是 `2x` 的唯一性沒有爭議。若某合法輸入產生 codomain 外的值，`f:A→B` 根本尚未成立，單射與滿射也救不了它。

## 第二關：單射的 ASSUME 與 WTS

任取 `x₁,x₂∈[0,1]`，**假設** `f(x₁)=f(x₂)`，要證 `x₁=x₂`。代入得 `2x₁=2x₂`，兩邊除以二即得結論。

ASSUME 不是假設函數已單射，而是假設兩輸出相等；WTS 是證兩輸入相等。若反過來先假設 `x₁=x₂`，只會證到任何函數都滿足的方向。形式為 `∀x₁∀x₂(f(x₁)=f(x₂)→x₁=x₂)`；讀量詞與 implication，便能機械地恢復證明骨架。

## 第三關：滿射要反向設計 witness

任取 `y∈[0,2]`，要找 `x∈[0,1]` 使 `f(x)=y`。由 `2x=y` 反解，選 `x=y/2`。但寫出 witness 尚未完成：由 `0≤y≤2` 得 `0≤y/2≤1`，所以 `x` 合法；再算 `f(x)=2(y/2)=y`。

三關完成後，`f` 是雙射，依定義得 `|[0,1]|=|[0,2]|`。做類似證明時，可先反解輸出方程式尋找 preimage，再檢查 witness 落在 domain；「顯然每個 y 都有 preimage」不是完整滿射證明。

## 基數相等必須自己證明像等號

`|A|=|B|` 已被重新定義為存在雙射，熟悉的等號性質不能無條件借來。投影片先證反身性：對任意 `A`，identity `f(x)=x` 是 `A→A` 的雙射。well-defined 來自 `x∈A`，單射由相同 image 得相同 input，滿射則對任意 `y` 選 `x=y`。

接著證傳遞性。若 `|A|=|B|` 且 `|B|=|C|`，有雙射 `f:A→B` 與 `g:B→C`。composition `g∘f:A→C` 仍是雙射，因此 `|A|=|C|`。新定義必須先證明預期性質，之後才可把它們當作已知；不能因整數等號如此就直接移植。

## Cantor 定理要排除所有雙射

第一講曾勾勒：對任意 `S`，冪集 `℘(S)` 比 `S` 大。本講正式證明：

```text
If S is a set, then |S| ≠ |℘(S)|.
```

依基數定義，這等價於不存在 `S→℘(S)` 的雙射。`f(x)={x}` 是單射，卻漏掉空集合與含多個元素的子集，所以不是滿射。但這仍沒證完定理，因為它只擊敗一個 `f`。若要否定存在雙射，就須任取 `f:S→℘(S)`，證明無論它長什麼樣都不滿射。

## 證明路線：攻擊任意函數的滿射性

投影片比較三個策略。設計一個特定函數再證它失敗，量詞太弱；任取函數後證它不單射也不可行，因 `x↦{x}` 正是單射。可行做法是任取 `f:S→℘(S)`，證它不是滿射。

路線是：任取 `S`；任取 `f`；依 `f` 製造一個屬於 `℘(S)` 卻不在 range 中的集合；推出 `f` 非滿射、非雙射；因 `f` 任意，排除所有雙射。難點是未知 `f` 的公式仍要找到漏接值，Cantor 的技巧便是讀取每個 `f(x)`，沿 membership 對角線逐格翻轉。

## 對角集合 `D` 的建構

對任意 `f:S→℘(S)`，定義

```text
D = { x ∈ S | x ∉ f(x) }.
```

`D` 收集所有沒有出現在自己 image set 的元素。因定義只從 `S` 挑元素，所以 `D⊆S`，即 `D∈℘(S)`；它是 codomain 中滿射必須命中的合法目標。

對每個 `x`，`D` 在 x 這格的 membership 恰與 `f(x)` 相反：若 `x∈f(x)`，則 `x∉D`；若 `x∉f(x)`，則 `x∈D`。所以 `D` 與每個 `f(x)` 至少在元素 `x` 上不同。換一個 `f`，`D` 也可能改變；力量在於每個函數都產生自己的漏接值。

## `D` 為何不可能等於任何 `f(y)`

反設存在 `y∈S` 使 `f(y)=D`。依定義，

```text
y ∈ D  iff  y ∉ f(y).
```

代入 `f(y)=D` 得 `y∈D iff y∉D`，同一 membership 命題不可能等價於自身否定。因此不存在這樣的 `y`。`D` 是 codomain 元素卻無 preimage，故 `f` 不滿射；`f` 又是任取的，所以所有 `S→℘(S)` 函數都失敗，沒有雙射，最終 `|S|≠|℘(S)|`。

證明內層的 contradiction 處理「D 是否在 range」，外層 arbitrary choice 處理「所有函數」。兩層不能混成一句「顯然 D 不在 range」，否則量詞來源與矛盾點都不清楚。

## 三個最容易混淆的層次

第一，`x∈S`，而 `f(x)∈℘(S)` 等同 `f(x)⊆S`。`x∈f(x)` 合法，是因 `f(x)` 本身是一個子集；不可把 element 與 subset 當成同型物件。第二，`D` 依賴 `f`，不是所有函數共同漏掉的固定集合。第三，正式長證明得到的是 `|S|≠|℘(S)|`；較強的「小於」還需要 injection，而 `x↦{x}` 正提供那一側。

另一個常見錯誤是由某個非雙射函數直接推出不等勢。正確否定存在量詞的方法，是任取候選並提供統一的失敗理由。對角化不只是一幅斜線圖，而是把「第 x 個輸出對 x 的選擇」反轉，保證新物件與第 x 個輸出不同。

還可以把整個論證想成一張 membership table。每一列代表 domain 元素 `x`，每一欄代表可能的集合元素；第 x 列是 `f(x)`。`D` 沿著第 x 列、第 x 欄讀取格子，再將真假反轉。因為在第 x 個對角格上相反，`D` 不可能等於第 x 列。這個表格直覺只是幫助理解，真正讓證明適用任意集合的仍是 set-builder 定義，而不是元素可被排成有限表格。

證明也沒有假設 `S` 是有限、可數或有自然順序。符號 x 同時扮演「選中的 domain 元素」與「檢查 membership 的元素」，並不表示我們先替所有元素編號。這一點使 Cantor 論證能對任何集合運作：空集合、有限集合與各種無限集合都在同一個量詞範圍裡。

若 `S=∅`，唯一的 `∅→℘(∅)` 函數 range 為空，而 codomain 是 `{∅}`；依定義得到 `D=∅`，它正是被漏掉的值。這個邊界例子也符合一般證明，不需要額外特判，顯示對角集合的型別與量詞設定是穩固的。

## 可執行的自我檢查

1. 為 `f:[2,5]→[0,1]` 設計線性雙射，分別寫三項義務。
2. 解釋一個失敗的 `S→T` 函數為何不能證 `|S|≠|T|`。
3. 對 `S={a,b}` 任列 `f:S→℘(S)`，算出 `D` 並逐一比較 images。
4. 在 Cantor 證明標出 arbitrary choice、contradiction 與非滿射推非雙射的位置。
5. 說明區間長度不同而基數相同為何不矛盾。

若第三題只靠看表格，請再寫成 `x∈D iff x∉f(x)`；若第一題漏驗證反解 witness 屬於 domain，滿射模板尚不完整。把證明拆成量詞、假設、目標與 witness，比背誦整段可靠。

也可做一個反向診斷：看到 `|A|=|B|`，先寫「我要提供一個 bijection」；看到 `|A|≠|B|`，先寫「我要排除所有 bijections」。再依目標決定是建構候選、反解 witness，或對任意候選找不可避免的缺陷。這個起手式能避免在還沒看清量詞前就投入代數運算。

## 材料缺口與下一講

公開投影片完整呈現雙射定義、區間等勢逐步證明、基數相等的反身與傳遞性，以及 Cantor 定理的 roadmap、對角集合和正式證明，足以支持本文主線。投影片不是錄影，無法還原口頭轉折、投票結果、學生提問或即席說明；本文沒有把空白寫成講師原話。

下一講進入 graphs，從 vertices 與 edges 建立高階性質。方法上的銜接是：本講從集合與函數建立「大小」，下一講從低階圖結構建立 connectivity 等概念。

## 更新紀錄

- 2026-08-22：依官方完整投影片重建雙射、區間等勢、基數性質與 Cantor 對角論證，並同步英文版與研究 checklist。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 8: Set Theory Revisited](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/)
- [Official Lecture 8 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
