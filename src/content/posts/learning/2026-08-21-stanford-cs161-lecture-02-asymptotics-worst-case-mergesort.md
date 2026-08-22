---
title: "Stanford CS161 Lecture 2：從 InsertionSort 證明到 MergeSort 的 n log n"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, asymptotic-analysis, mergesort]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 3
tldr: "第二講把「快」拆成可證明的最壞情況上界：InsertionSort 用迴圈不變量證正確、最壞為 n²；MergeSort 用遞迴不變量與每層 O(n) 的遞迴樹，得到 O(n log n)。"
description: "導讀 Stanford CS161 Winter 2026 第二講：InsertionSort、最壞情況分析、O/Ω/Θ 定義、MergeSort 正確性、遞迴樹與偽程式的實作缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-02-asymptotics-worst-case-mergesort-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)的第 3 篇，對應 **Stanford CS161, Winter 2026, Lecture 2**。Ellen Vitercik 在 2026 年 1 月 7 日主講，官方題目是 [Asymptotics, Worst-Case Analysis, and MergeSort](https://stanford-cs161.github.io/winter2026/lectures/#lecture-2-asymptotics-worst-case-analysis-and-mergesort)。本文使用公開的課前練習、11 頁講義、82 頁投影片，以及兩頁的 InsertionSort 嚴格證明 handout。Canvas 錄影需要校內權限，沒有作為來源；官方 notebook 與概念題也沒有拿來補正文。

第一講用 Karatsuba 示範「成長率比單次計時更能描述算法」。第二講把這句直覺拆成兩個可檢查的問題：**演算法真的會回傳正確答案嗎？它對所有輸入都有足夠好的效能嗎？** 排序成為共同語言，因為 InsertionSort 的步驟容易追，MergeSort 又能把分治、正確性歸納與遞迴時間接在一起。

## InsertionSort 到底維持了什麼

給定陣列 `A`，InsertionSort 從第二個元素開始。每一輪先把目前元素存為 `current`，再把左邊比它大的元素依序右移，最後把 `current` 放進空位：

```text
InsertionSort(A):
  for i = 1 ... n-1:
    current = A[i]
    j = i-1
    while j >= 0 and A[j] > current:
      A[j+1] = A[j]
      j = j-1
    A[j+1] = current
```

以 `[6,4,3,8,5]` 為例。處理 4 後，前綴變成 `[4,6]`；處理 3 後是 `[3,4,6]`；8 已在正確位置；最後 5 越過 8 與 6，停在 4 後面。直覺上這像整理手牌，但直覺不是證明。程式裡有兩層迴圈、索引會變，還有覆寫動作；要證明它沒有遺失元素或把某一對順序放錯，需要找一個每輪都維持的命題。

這個命題叫**迴圈不變量**：外層第 `i` 輪結束後，`A[:i+1]` 已排序。它不是說整個陣列隨時都有序，而是說「已處理前綴」逐輪擴大。

## 用歸納法證明排序正確

官方講義與 handout 把證明分成四個部件。

**歸納假設**：外層第 `i` 輪後，前綴 `A[:i+1]` 已排序。

**基底情形**：開始時 `A[:1]` 只有一個元素，必然有序。投影片把這視為第 0 輪完成。

**歸納步驟**：假設前一輪後 `A[:i]` 已排序。內層迴圈把所有大於 `current` 的元素右移，直到找到最後一個不大於 `current` 的位置。由於舊前綴原本有序，插入點左側都不大於 `current`，右側都大於它；其他元素只整段平移，相對順序不變。因此新前綴 `A[:i+1]` 有序且包含原本全部元素。

**結論**：最後一輪後 `A[:n]` 已排序，而 `A[:n]` 就是整個陣列。

講義與 handout 在描述插入點時，一處寫 `<`、一處寫 `≤`，程式條件則是只右移 `A[j] > current` 的元素。若元素可能重複，這個細節會影響穩定性與插入點定義。證明時不能混著用；應固定實作，再讓不變量配合它。以公開偽程式為準，相等元素不被越過，因此可以維持原相對順序。

## 最壞情況分析是一場對手遊戲

InsertionSort 在已排序輸入上幾乎不用搬動元素，在反向輸入上，每個新元素都要一路移到最左。那要用哪一種輸入報告執行時間？CS161 本講採用最壞情況分析：先公布演算法與時間界 `T(n)`，再讓對手挑任意一個大小為 `n` 的輸入。無論對手挑哪個，只要演算法都在界線內完成，保證才成立。

這是一個很強的承諾。它不需要先猜「真實世界通常會送來哪種陣列」。若你有可靠的輸入分布，當然可以研究平均情況；但那會把保證綁在分布假設上。本講把它留在旁註，主線先建立不依賴輸入運氣的上界。

InsertionSort 第 `i` 輪最壞可能檢查與移動約 `i` 個元素。把各輪相加：

```text
1 + 2 + ... + (n-1) = n(n-1)/2
```

所以最壞時間是 `O(n²)`。這裡的 `O` 表示上界；若要宣稱 `Θ(n²)`，還要給對應下界。反向排序陣列確實能迫使每輪走完整個前綴，因此可建立緊界，但本講正文主要把它當成與 MergeSort 上界的對照。

## O、Ω、Θ 各自承諾什麼

令 `T(n)` 是演算法在大小 `n` 輸入上的時間，`f(n)` 是用來比較的成長函數。

`T(n)=O(f(n))` 表示存在常數 `c>0` 與門檻 `n₀`，使所有 `n≥n₀` 都有：

```text
0 ≤ T(n) ≤ c f(n)
```

它是漸近上界。`T(n)=Ω(f(n))` 把不等號反過來，表示存在常數與門檻，使 `T(n)` 最終不低於 `c f(n)`，是漸近下界。`T(n)=Θ(f(n))` 則同時具有上下界，表示兩者成長同階。

三個符號最容易被口語「是」混淆。若 `T(n)=n`，它同時是 `O(n)`、`O(n²)`、甚至 `O(n³)`；但只有 `Θ(n)` 是緊的同階描述。Big-O 不等於精確分類，更不等於平均速度。

講義用兩個證明練習定義。任意 `k` 次、最終非負的多項式 `a_kn^k+...+a_0`，可用最大係數絕對值把每一項都上界成常數倍 `n^k`，所以是 `O(n^k)`。反過來，若假設 `n^k=O(n^{k-1})`，約掉正項後會得到所有夠大的 `n` 都滿足 `n≤c`，和 `c` 是固定常數矛盾。

## MergeSort：把排序拆成兩個真的較小的問題

MergeSort 的分治步驟很短：

```text
MergeSort(A):
  if len(A) <= 1: return A
  L = MergeSort(first half of A)
  R = MergeSort(second half of A)
  return Merge(L, R)
```

困難集中在 `Merge`：輸入是兩個已排序陣列，指標分別指向尚未輸出的最小元素。每次比較兩端，取較小者放進輸出並推進該側指標；其中一側耗盡後，把另一側剩餘元素接上。

官方 notes 刻意放了一份**不完整**的 Merge 偽程式，只寫一般比較，並問「如果先走到 L 或 R 的尾端怎麼辦？」因此若把講義片段直接貼成程式，會越界。正確算法必須有耗盡分支，或放哨兵值。這個缺口也示範 CS161 如何讀偽程式：它優先表達算法結構，不保證每個語言層級的邊界條件都已寫完。

## MergeSort 的正確性有兩層

外層使用**遞迴不變量**：每次 `MergeSort` 回傳時，都回傳一個包含相同元素的有序陣列。

基底是長度 0 或 1 的陣列本來就有序。歸納步假設較短輸入都能正確排序；左右半部都比原輸入短，所以遞迴回來的 `L`、`R` 有序。接著只剩一個子命題：`Merge` 能把兩個有序陣列合成一個有序且不漏元素的陣列。

要證 `Merge`，可以再立一個迴圈不變量：輸出 `S` 永遠包含兩個輸入中最小的前 `k` 個元素，且已排序。下一步比較 `L[i]` 與 `R[j]`；因兩邊各自有序，較小的那個就是所有尚未輸出元素的最小值。把它附加到 `S`，不變量延續。最後所有元素恰好輸出一次。

Winter 2026 notes 只給外層證明骨架，並把 Merge 的完整嚴格處理指向 CLRS。上面這段是依講義明示的子命題展開必要邏輯，不應寫成「投影片已逐行證完」。材料邊界要和算法邊界一樣清楚。

## 遞迴樹為什麼是 n log n

設 `T(n)` 是 MergeSort 排 `n` 個元素的最壞時間。兩個遞迴呼叫各處理一半，Merge 與切割合計線性，因此：

```text
T(n) ≤ 2T(n/2) + 11n
```

`11` 是 notes 為示範操作計數選的鬆上界，不是 MergeSort 的普世常數。它把取長度、建立切片、比較、指定與索引遞增先用同一個最大單位成本包住。重要的是乘著 `n`，不是 11 本身。

看遞迴樹第 `i` 層：有 `2^i` 個子問題，每個大小 `n/2^i`。一個節點的非遞迴工作至多 `11n/2^i`，所以整層總和：

```text
2^i × 11n/2^i = 11n
```

每往下一層，問題數加倍，但單題大小減半，兩者剛好抵銷。從 `n` 一直切到 1 需要 `log₂n` 次，連根層共 `log₂n+1` 層。因此：

```text
T(n) ≤ 11n(log₂n+1)
     = O(n log n)
```

若 `n` 不是 2 的冪，左右大小會是 floor 與 ceiling。講義的簡化方式是補上無限大元素，把長度增到下一個 2 的冪；新長度小於 `2n`，不改變漸近階。這證明的是分析可以忽略不整齊的樹，不是實作可以忘記奇數長度。

## 時間與空間要分開說

在講義的清楚版偽程式裡，Python slice 會複製左右半部，`Merge` 也建立新輸出。這些配置仍可被每層 `O(n)` 吸收，所以時間上界不變；但額外空間不能因此說成 `O(1)`。典型陣列 MergeSort 需要線性輔助空間，另有 `O(log n)` 遞迴深度。具體配置策略會改變常數與峰值生命週期，官方本講沒有把空間當主要證明目標。

相對地，InsertionSort 可以在原陣列內移動元素，額外空間為常數級。這提醒我們：「漸近時間較好」不是所有維度都更好。第二講只判決大型一般輸入下的時間成長；選算法時仍要看輸入是否幾乎有序、記憶體限制、穩定性與資料結構。

## 最容易帶走的錯結論

第一個錯誤是把 best case 當成算法保證。InsertionSort 看見已排序陣列很快，不會消除反向輸入的最壞二次界。

第二個錯誤是把 Big-O 當等號。`O(n²)` 只說不會比某個二次上界長得更快；它沒有排除實際是線性，也沒有自動提供下界。

第三個錯誤是只證「輸出有序」卻沒證「元素相同」。排序算法若丟掉一半元素，空陣列也有序。InsertionSort 的平移與 Merge 的逐一取出，都要同時維護 permutation 性質。

第四個錯誤是照抄不完整偽程式。課堂用省略來凸顯概念，實作卻必須處理陣列耗盡、奇數切割、相等元素與索引界線。

## 這一講在十八講裡的位置

Lecture 2 把 CS161 的證明語法定下來：迭代算法找迴圈不變量，遞迴算法找遞迴不變量；時間先指定最壞情況，再用漸近符號描述上、下界。後面 Select、圖演算法、動態規劃與貪婪法，會反覆換題目，卻一直沿用這套語法。

它也留下明確的下一題：`T(n)=2T(n/2)+O(n)` 為什麼能系統化解成 `O(n log n)`？這次我們畫完整棵樹；Lecture 3 會把樹的計算壓成 Master Theorem，並用 substitution method 處理更一般的遞迴式。

要自我檢查，拿一個五元素陣列跑完 InsertionSort，逐輪寫下不變量；再畫八元素 MergeSort 的三層樹，分別標問題數、單題大小、整層工作。若兩張圖都能在不靠「顯然」兩字的情況下說服別人，這堂課的兩個問題——正確嗎、夠快嗎——才算真的回答。

讀任何新算法時都可沿用三問：它維持什麼 invariant？保證是 worst case、average case 還是 expected case？上界與下界是否在同一模型下成立？三問答完整，比只記住一個 Big-O 更接近本講真正的訓練目標。

## 延伸

幾乎有序的小陣列常讓 InsertionSort 表現很好，而 MergeSort 的控制流程不會因輸入已排序就少掉整棵遞迴樹。實務排序器因此常採混合策略，在小子陣列切換到插入排序。但 Winter 2026 第二講沒有指定門檻或特定標準函式實作；任何門檻數字都應依語言、資料型態與硬體另做基準測試。

另一個延伸是親自補完 `Merge` 的不變量。每次迭代前寫下三件事：`S` 已排序、`S` 的元素正是兩輸入已消耗部分、兩個指標前端的較小值是下一個全域最小值。這比只背 `n log n` 更接近後面每一份正確性證明真正會用到的能力。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 2](https://stanford-cs161.github.io/winter2026/lectures/#lecture-2-asymptotics-worst-case-analysis-and-mergesort)
- [Lecture 2 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-pre.pdf)
- [Lecture 2 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-notes.pdf)
- [Lecture 2 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture2.pdf)
- [Rigorous Analysis of InsertionSort handout](https://stanford-cs161.github.io/winter2026/assets/files/CS161Lecture02_handout.pdf)
