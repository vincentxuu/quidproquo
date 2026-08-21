---
title: "Stanford CS161 Lecture 3：Master Theorem 怎麼讀懂一棵遞迴樹"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, recurrence, master-theorem]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 4
tldr: "對 T(n)=aT(n/b)+O(n^d)，真正的比較是分支成長 a 與單題工作縮小 b^d：a=b^d 時每層同重，a<b^d 時頂層主導，a>b^d 時葉層主導；不合模板就改用 substitution。"
description: "導讀 Stanford CS161 Winter 2026 第三講：遞迴式、遞迴樹、Master Theorem 三種情況、幾何級數直覺、substitution method 與適用邊界。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-03-recurrences-master-theorem-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)的第 4 篇，對應 **Stanford CS161, Winter 2026, Lecture 3**。Moses Charikar 在 2026 年 1 月 12 日主講，官方題目是 [Solving Recurrences and the Master Theorem](https://stanford-cs161.github.io/winter2026/lectures/#lecture-3-solving-recurrences-and-the-master-theorem)。本文讀了公開的課前練習、六頁講義與 54 頁投影片；Canvas 錄影未使用，概念檢核也沒有假裝讀過。

有一個來源差異要先交代：component 與投影片都把本講定位為遞迴式、Master Theorem、substitution method；notes 封面卻寫成「Solving Recurrences and the Selection Problem」。正文完全沒有進入 selection，selection 是 Lecture 4 的主題。本文依官方 lecture 標題與材料實際內容寫，不把封面殘留字樣擴成不存在的 agenda。

第二講用完整遞迴樹算 MergeSort。第三講的目標是把那種計算變成可重複使用的方法：先從程式寫出遞迴式，再判斷哪一層工作主導總時間。Master Theorem 是快捷鍵，substitution 則是快捷鍵失效時仍能走的證明路線。

## 遞迴式不是只有等號右邊

一個分治算法處理大小 `n` 的輸入時，若建立 `k` 個更小子問題，大小分別是 `n₁,...,n_k`，本層另外做 `O(f(n))` 工作，最壞時間可以寫成：

```text
T(n) ≤ c f(n) + Σ T(nᵢ)
```

還必須指定基底情形，例如 `T(1)=O(1)`。沒有 base case，式子沒有把函數定完；同一個遞迴規則配上不同基底常數，精確函數會不同。漸近分析常略寫它，是因為固定大小輸入的固定成本通常不改變成長階，不是因為它不存在。

等號與不等號也有差。`T(n)=2T(n/2)+n` 精確定義一個函數；`T(n)≤2T(n/2)+11n` 只提供上界。若最終只要證 `O(...)`，不等式已經足夠；但不能從上界式反推演算法一定做滿那些工作。

## 三個舊算法，三條遞迴式

第三講先回收前兩講的案例。

直接分治乘法把一個 `n` 位數問題拆成四個半尺寸乘法，加法與組合是線性：

```text
T(n) = 4T(n/2) + O(n)
```

Karatsuba 用三個乘法重建交叉項：

```text
T(n) = 3T(n/2) + O(n)
```

MergeSort 遞迴排序左右兩半，再線性合併：

```text
T(n) = 2T(n/2) + O(n)
```

三式只差係數 4、3、2，答案卻分別是 `O(n²)`、`O(n^{log₂3})`、`O(n log n)`。Master Theorem 要解釋的正是：分支數降一點，為什麼會讓整棵樹的主導位置改變。

## Master Theorem 的三個參數

簡化版定理處理：

```text
T(n) = aT(n/b) + O(n^d)
```

- `a≥1`：每個問題產生幾個子問題。
- `b>1`：每個子問題縮成原來的幾分之一。
- `d`：每個節點切分與合併的額外工作次方。

結果是：

```text
a = b^d  => O(n^d log n)
a < b^d  => O(n^d)
a > b^d  => O(n^(log_b a))
```

背三行並不難，難的是知道它為什麼對。答案藏在遞迴樹每一層的總工作，而不是符號本身。

## 每一層都在比 a 與 b^d

第 `j` 層有 `a^j` 個子問題，每個大小 `n/b^j`。只算該節點本層、不包含更深遞迴的工作，一題至多：

```text
c(n/b^j)^d
```

所以整層工作是：

```text
a^j × c(n/b^j)^d
= c n^d (a/b^d)^j
```

樹深約 `log_b n`。總時間因此是各層形成的幾何級數：

```text
c n^d Σ(j=0...log_b n) (a/b^d)^j
```

現在三種情況不必背了。

若 `a=b^d`，比值是 1，每層都做 `cn^d`，乘上約 `log_b n` 層，得到 `O(n^d log n)`。

若 `a<b^d`，比值小於 1，越往下每層越輕。幾何級數被第一項控制，頂層主導，總和是 `O(n^d)`。

若 `a>b^d`，比值大於 1，越往下越重，最後一層主導。葉數是 `a^{log_b n}=n^{log_ba}`，得到 `O(n^{log_ba})`。

投影片把它畫成「分支爆炸」與「單題縮小」的拉鋸。`a` 代表樹變寬，`b^d` 代表單題工作變輕；誰贏，主導工作就在哪裡。

## 四個例子逐一代入

直接分治乘法中 `a=4,b=2,d=1`，所以 `b^d=2`，分支效果較強。第三種情況給：

```text
T(n)=O(n^(log₂4))=O(n²)
```

Karatsuba 的 `a=3,b=2,d=1` 仍是第三種，但葉層次方降為：

```text
T(n)=O(n^(log₂3))≈O(n^1.585)
```

MergeSort 的 `a=2,b=2,d=1` 剛好平衡，每層都是線性：

```text
T(n)=O(n log n)
```

若 `T(n)=T(n/2)+O(n)`，則 `a=1<b^d=2`，頂層的 `n` 已比下面所有層的幾何和大同階：

```text
n+n/2+n/4+... < 2n
```

所以是 `O(n)`。這四題涵蓋 top-heavy、balanced、bottom-heavy 三種形狀，也說明 `d` 不能漏看。只比較子問題數，會把合併成本完全排除。

## Substitution method：先猜，再把猜測變成命題

Substitution method 比 Master Theorem 更一般。流程是：

1. 用展開、遞迴樹或已有直覺猜成長函數。
2. 把 `O(g(n))` 強化成含固定常數的命題，例如 `T(n)≤Cg(n)`。
3. 檢查 base case 對常數有什麼要求。
4. 假設所有較小輸入成立，代回遞迴式證 `n` 也成立。

以投影片的例子：

```text
T(n)=2T(n/2)+32n,  T(2)=2
```

Master Theorem 告訴我們應猜 `O(n log n)`。但歸納假設不能只寫 `T(n)=O(n log n)`，因為每一層的隱藏常數可能被當成不同值，代數不會閉合。要寫成：

```text
T(n) ≤ C n log n
```

假設對較小輸入成立，則：

```text
T(k)
≤ 2C(k/2)log(k/2)+32k
= Ck(log k-1)+32k
= Ck log k +(32-C)k
```

只要 `C≥32`，最後一項不為正，歸納步成立。Base case 只要求 `C≥1`，所以選 `C=32` 同時滿足兩者。最後再用 Big-O 定義，把固定 `C` 與門檻轉回 `T(n)=O(n log n)`。

## 歸納失敗不只一種原因

若對 `T(n)=2T(n/2)+n` 猜 `T(n)≤dn`，代入會得到：

```text
n + 2d(n/2) ≤ dn
n + dn ≤ dn
```

不可能成立。這次是成長階真的猜錯，因為正解是 `n log n`。

但歸納不閉合也可能只是命題太弱。對 `T(n)≤2T(n/2)+1`，正確成長是線性；若猜 `T(n)≤cn`，代入得 `cn+1≤cn`，仍失敗。把命題強化成 `T(n)≤cn-1`，代入後卻剛好得到 `cn-1`。

這個差異很重要。Substitution 不是把猜測塞進式子看看像不像，而是設計一個能承受遞迴誤差的歸納命題。證明失敗時，要問的是「階錯了，還是常數項需要更多餘裕？」

## 什麼時候不能套簡化版 Master Theorem

最明顯的界線，是子問題大小不同。下一講的 deterministic selection 會產生：

```text
T(n) ≤ T(n/5) + T(7n/10) + O(n)
```

它沒有共同的 `aT(n/b)`，不能硬把兩項平均成兩個同尺寸問題。平均後也許看起來整齊，卻會改變樹的形狀與保證。這時 substitution 才是本課準備的正確工具。

Floor、ceiling 與 `n/b+1` 也是技術界線。Notes 說 Master Theorem 可擴充到某些整數取整版本，但本講沒有完整證明。日常作業若題目允許，可先說「為簡化假設 `n` 是 `b` 的冪」；若要嚴格處理任意 `n`，就要補單調性、padding 或更一般定理，而不是默默刪符號。

Notes 最後還列出較一般的 Master Theorem。第三種情況除了 `f(n)` 比 `n^{log_ba}` 多一個多項式因子，還需要 regularity condition `af(n/b)≤cf(n)`，其中 `c<1`。這個條件確保額外工作規律下降；不能只看表面次方就套結論。

套用前可以做一個機械化檢查：`a` 是否為固定常數、每個子問題是否同為 `n/b`、非遞迴工作能否由單一 `n^d` 階描述、base case 是否在常數門檻停止。四項有一項答不出來，就先不要查 case。Master Theorem 是把符合形狀的 recurrence 快速分類，不是把任何遞迴程式自動翻譯成答案。

還要先確認 recurrence 本身沒有漏算。例如 MergeSort 若以 array slices 實作，切片也可能花線性時間；只要和 merge 同階，仍可合併進 `O(n)`。但若某一步暗中先把子陣列完整排序，寫成 `2T(n/2)+O(n)` 就已失真，再精準套定理也只會得到錯問題的正確答案。工具不能修復建模錯誤。

三種 case 的直覺也可當 sanity check。若葉數 `a^{log_b n}=n^{log_ba}` 的成長快於每層非遞迴工作向下累積，葉端主導；若兩者同階，每層貢獻相近，多出樹高的 `log n`；若根部 `n^d` 成長更快，上層工作主導。公式算出的 case 若和 recursion tree 圖像完全相反，應先重查 `a,b,d`，而不是硬相信代入結果。

這份檢查表的目的，是在計算之前先保住問題的語義與前提。

## 時間、空間與精確值的邊界

Master Theorem 解的是提供給它的 recurrence。若 recurrence 只描述時間，它不會自動回答空間；若本層成本漏掉陣列複製，它也不會替你補。第一步「從算法寫對 recurrence」往往比套定理更重要。

同樣地，`O(n log n)` 不給精確操作數。Base case、常數係數與低階項都會影響實測。定理刻意丟掉它們，是為了比較策略在規模放大後的形狀，不是宣稱每個 `n` 都有同一條計時曲線。

## 這一講在十八講裡的位置

Lecture 3 把前兩講的案例整理成一套分析工具。往後看到遞迴算法，先寫子問題數、子問題大小、本層工作與 base case；符合模板就用 Master Theorem，不符合就用 substitution 或重新畫樹。

Lecture 4 馬上安排一個不能套模板的算法。Median-of-medians 同時遞迴處理約 `n/5` 與最多 `7n/10` 的問題，正好迫使讀者停止機械套公式。這個編排讓 Master Theorem 的價值與限制在相鄰兩講一起出現。

要檢查自己是否理解，別先背三種 case。畫出 `T(n)=4T(n/2)+n`、`2T(n/2)+n`、`T(n/2)+n` 三棵樹，每層寫總工作。當你能在看定理前先指出「底層、每層、頂層」誰主導，公式才變成壓縮後的理解，而不是三行咒語。

## 延伸

實務上遇到不規則 recurrence，可以先做兩件事。第一，把前幾層完整展開，找出每層總工作是否形成幾何級數；第二，猜上界時保留一個可調常數與低階修正項。這兩個動作不保證立即解出答案，但能避免最常見的錯誤：在還沒寫對模型前就搜索一個公式硬套。

Master Theorem 也不是遞迴分析的終點。Akra–Bazzi 等工具能處理更一般的不同尺寸子問題，但不屬 Winter 2026 第三講。若延伸閱讀，應把它視為另一套定理及其條件，而不是把本講的三種 case 任意擴張。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 3](https://stanford-cs161.github.io/winter2026/lectures/#lecture-3-solving-recurrences-and-the-master-theorem)
- [Lecture 3 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-pre.pdf)
- [Lecture 3 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-notes.pdf)
- [Lecture 3 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-slides.pdf)
