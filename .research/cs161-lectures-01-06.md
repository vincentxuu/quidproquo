# CS161 Winter 2026 Lectures 1–6 官方材料事實底稿

- 研究日期：2026-08-21
- 課程：Stanford CS161, Winter 2026
- 官方課程頁：[Lectures](https://stanford-cs161.github.io/winter2026/lectures/)
- 官方原始碼：[stanford-cs161/winter2026](https://github.com/stanford-cs161/winter2026)
- 範圍：Lecture 1–6 的 component markdown、lecture notes PDF、slides PDF；另讀取 component 直接連結的 pre-lecture PDF 與 Lecture 2 correctness handout。
- 明確排除：Canvas/Panopto 錄影、Python notebook、concept-check 題庫、課本章節與 Lecture 6 的 CMU 延伸閱讀未當作已讀來源。

## 研究子問題

1. 每堂課的官方標題、日期、講師與實際議程是什麼？
2. 每堂課引入哪些定義、演算法、分析工具與代表例子？
3. 官方材料如何論證正確性與時間複雜度？
4. 哪些假設、技術細節或證明被刻意略過，寫文章時不能擅自補成「課內已證明」？
5. component、notes 與 slides 之間是否有標題或內容落差？

## 讀取完整度盤點

| 課次 | Component | Notes | Slides | 其他直接材料 | 阻礙／未讀範圍 |
|---|---|---|---|---|---|
| 1 | ✅ 全文 | ✅ 5 頁全文 | ✅ 70 頁全文 | — | Canvas 錄影、notebook、concept check、課本未讀 |
| 2 | ✅ 全文 | ✅ 11 頁全文 | ✅ 82 頁全文 | ✅ pre-lecture 2 頁、InsertionSort handout 2 頁 | Canvas 錄影、notebook、concept check、課本未讀 |
| 3 | ✅ 全文 | ✅ 6 頁全文 | ✅ 54 頁全文 | ✅ pre-lecture 4 頁 | Canvas 錄影、concept check、課本未讀 |
| 4 | ✅ 全文 | ✅ 9 頁全文 | ✅ 66 頁全文 | ✅ pre-lecture 1 頁 | Canvas 錄影、notebook、concept check、課本未讀 |
| 5 | ✅ 全文 | ✅ 7 頁全文 | ✅ 43 頁全文 | ✅ pre-lecture 1 頁 | Canvas 錄影、notebook、concept check、課本未讀 |
| 6 | ✅ 全文 | ✅ 3 頁全文 | ✅ 57 頁全文 | ✅ pre-lecture 1 頁 | Canvas 錄影、notebook、concept check、課本與 CMU 延伸講義未讀 |

PDF 轉錄後逐份讀取；頁數由 `pdfinfo` 核對。Slides 內動畫造成重複頁面，重複內容仍在原始轉錄中檢視，以下只保留一次。

## 共用術語與材料界線

- worst-case analysis：最壞情況分析。
- asymptotic analysis：漸近分析。
- divide and conquer：分治法。
- recurrence relation：遞迴關係式。
- recursion tree：遞迴樹。
- loop invariant / recursion invariant：迴圈不變量／遞迴不變量。
- selection：選擇問題；輸出第 `k` 小元素。
- pivot：樞紐（文章可第一次寫「樞紐（pivot）」）。
- comparison-based sorting：比較式排序。
- stable sorting：穩定排序。
- randomized algorithm：隨機化演算法。本段課程聚焦 Las Vegas 型：輸出總是正確，執行時間是隨機變數。
- Lecture 1–6 的對數除非另註，課程約定以 2 為底；Lecture 5 的調和級數上界使用自然對數 `ln`。
- `O` 是上界、`Ω` 是下界、`Θ` 是同階上下界；不能把 `O(n log n)` 自動改寫成 `Θ(n log n)`，除非材料另有下界。
- 多數分析假設輸入元素互異、`n` 是 2 的冪或忽略 floor/ceiling；文章必須把這些視為簡化假設，不可藏起來。

---

## Lecture 1 — Why are you here?

### 官方中繼資料

- 日期：2026-01-05 13:30–14:50
- 講師：Ellen（Ellen Vitercik）
- Component 官方標題：`Why are you here?`
- Notes 主題：Introduction；核心技術案例是 Karatsuba integer multiplication。

### 完整 agenda

1. 課程定位與三個目標：設計演算法工具箱、分析演算法、清楚溝通演算法。
2. 為何學演算法：演算法是各 CS 領域基礎、有實用價值、設計與分析兼具創造力和數學精確性。
3. 「algorithm」詞源：al-Khwarizmi、阿拉伯數字表示法與 `algorisme`。
4. 整數乘法問題與 grade-school multiplication 的約 `n²` 個一位數操作。
5. 為何用輸入大小的成長率，而不是特定硬體上的毫秒數衡量演算法。
6. 分治法：把兩個 `n` 位數各拆成高低各 `n/2` 位。
7. 四次遞迴乘法沒有改善：遞迴樹葉節點仍有 `n²` 個一位數乘法。
8. Karatsuba：用三次遞迴乘法算出交叉項。
9. 非正式遞迴分析：`3^{log₂ n} = n^{log₂ 3} ≈ n^1.585 ≤ n^1.6`。
10. 乘法演算法後續歷史：Toom–Cook、Schönhage–Strassen、Fürer、Harvey–van der Hoeven。

### 核心定義

- 演算法效能不以單一實作／硬體的絕對時間定義，而看運算量如何隨輸入規模 `n` 成長。
- 分治法：把大問題分成較小、同型態的子問題，遞迴解子問題，再組合答案。
- 此課只「非正式」介紹 big-O；正式定義留到 Lecture 2。
- `T(n)` 在本課主要用來表示兩個 `n` 位數相乘所需的基本操作或一位數乘法數量。

### 演算法步驟

給定兩個 `n` 位數 `x, y`，先寫成：

```text
x = 10^(n/2) a + b
y = 10^(n/2) c + d
xy = 10^n ac + 10^(n/2)(ad + bc) + bd
```

**直接分治版**

1. 基底：`n = 1` 時直接回傳 `xy`。
2. 拆出 `a, b, c, d`。
3. 遞迴計算 `ac, ad, bc, bd` 四個乘積。
4. 依上式組合。

**Karatsuba 版**

1. 基底同上。
2. 遞迴算 `ac`、`bd`、`z = (a+b)(c+d)`。
3. 由 `ad + bc = z - ac - bd` 取得交叉項。
4. 回傳 `10^n ac + 10^(n/2)(z-ac-bd) + bd`。

### 例子

- `1234 × 5678` 拆成 `(12×100+34)(56×100+78)`；直接分治變成四個 2 位數乘法。
- 4 位數直接分治最終有 16 個一位數乘法；8 位數有 64 個，呈現 `n²`。
- Slides 用手算與 Python 實作對照，強調同一個二次演算法在不同平台常數不同，但成長階相同。

### 正確性論證

- 直接分治與 Karatsuba 的正確性來自代數恆等式。
- `z=(a+b)(c+d)=ac+ad+bc+bd`，因此 `z-ac-bd=ad+bc`；代回 `xy` 展開式即得原乘積。
- 材料沒有把此段寫成正式歸納證明；不要宣稱本課已完成完整遞迴正確性證明。

### 複雜度論證

- Grade-school：大約 `n²` 個一位數乘法，總體 `O(n²)`。
- 四分支分治：`T(n)=4T(n/2)+O(n)`；只數葉節點為 `4^{log₂n}=n²`，沒有漸近改善。
- Karatsuba：講義先簡化為 `T(n)=3T(n/2)`，葉節點 `3^{log₂n}=n^{log₂3}`；正式把加法納入後為 `3T(n/2)+O(n)`，仍是約 `O(n^1.585)`。
- Slides 明說此處尚未計入較高層額外工作，後續課才給正式方法。

### 易錯點與材料缺口

- `n^1.6` 是便於溝通的上界近似，精確指數是 `log₂3 ≈ 1.585`。
- `a+b` 或 `c+d` 可能多一位；notes 明說此處暫時忽略。
- 假設 `n` 為 2 的冪，實務可補前導零，但偽程式也沒有處理奇數位數與切割細節。
- 「乘以 `10^n`」與數字切片的具體成本沒有完整建模。
- 歷史演算法僅為趣味延伸；本課不要求掌握。Notes 將 2019 的 `O(n log n)` 說成 conjectured optimal，若文章要延伸當代研究，需另查最新一手文獻。
- Slides 有大量課務資訊；不屬演算法主線，文章可省略，但不可把省略後的 agenda 說成完整逐頁摘要。

### 一手來源 URL

- [Lecture 1 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture1.md)
- [Lecture 1 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture1-notes.pdf)
- [Lecture 1 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture1.pdf)
- [Lectures index](https://stanford-cs161.github.io/winter2026/lectures/)

---

## Lecture 2 — Asymptotics, Worst-Case Analysis, and MergeSort

### 官方中繼資料

- 日期：2026-01-07 13:30–14:50
- 講師：Ellen
- Component 官方標題：`Asymptotics, Worst-Case Analysis, and MergeSort`
- Notes 標題：`MergeSort, Recurrences 101, and Asymptotic Analysis`

### 完整 agenda

1. 分析演算法的兩問：是否正確、效能是否好。
2. InsertionSort 的運作方式。
3. 用 loop invariant／歸納法證明 InsertionSort 正確。
4. InsertionSort 最壞情況約 `n²`。
5. 最壞情況分析：把輸入交給對手選，保證必須對所有同規模輸入成立。
6. 漸近分析與 Big-O、Big-Omega、Big-Theta 正式定義。
7. Big-O 證明範例：`k` 次多項式是 `O(n^k)`；`n^k` 不是 `O(n^{k-1})`。
8. MergeSort 的分治結構與 Merge 子程序。
9. MergeSort 正確性：外層遞迴歸納，Merge 正確性另需內層論證。
10. 遞迴樹與 `T(n) ≤ 2T(n/2)+11n`。
11. 每層 `O(n)`、共 `log n + 1` 層，因此 `O(n log n)`。
12. 精確操作數、程式語言／硬體常數、清楚偽程式之間的取捨。

### 核心定義

- Worst-case analysis：對每個大小為 `n` 的輸入，都在 `T(n)` 時間內完成。
- Average-case analysis：依賴輸入分布假設；材料指出通常較難且需要強假設。
- `T(n)=O(f(n))`：存在 `c>0,n₀`，對所有 `n≥n₀`，`0≤T(n)≤cf(n)`。
- `T(n)=Ω(f(n))`：存在 `c>0,n₀`，對所有 `n≥n₀`，`0≤cf(n)≤T(n)`。
- `T(n)=Θ(f(n))`：同時為 `O(f(n))` 與 `Ω(f(n))`。
- Loop invariant：每次迴圈迭代後維持的命題；此處是 `A[:i+1]` 已排序。
- Recursion invariant：每次遞迴呼叫回傳時維持的命題；此處是 MergeSort 回傳排序陣列。

### 演算法步驟

**InsertionSort**

1. 從索引 1 開始，把 `current=A[i]` 暫存。
2. 向左掃描已排序前綴；凡大於 `current` 的元素都右移一格。
3. 把 `current` 放入空出的正確位置。

**MergeSort**

1. `n≤1` 時直接回傳。
2. 把陣列切成左右兩半。
3. 遞迴排序 `L`、`R`。
4. 每次比較兩邊尚未輸出的最小元素，把較小者加入輸出。
5. 一側耗盡後，將另一側剩餘元素依序補入。

### 例子

- InsertionSort 逐步把目前元素插入已排序前綴；slides 以 `6,4,3,8,5` 視覺化前綴逐步增長。
- 對 `n=32`，`log₂n=5`；對 `n=1024`，`log₂n=10`，用來呈現 `n log n` 與 `n²` 的差距。
- MergeSort 的遞迴樹把 `n` 拆成兩個 `n/2`，再拆成四個 `n/4`，直到 `n` 個大小 1 的葉。

### 正確性論證

**InsertionSort 正確性**

- 基底：一個元素的前綴已排序。
- 歸納步：假設 `A[:i]` 已排序；內層迴圈把 `A[i]` 左移到唯一合適位置，前面的元素皆不大於它，後面的元素皆大於它。
- 結論：最後 `A[:n]` 即整個陣列已排序。
- Notes 與另附 handout 對相等元素使用 `<`／`≤` 的寫法略有不同；核心是不變量與插入位置，文章若討論穩定性需先固定實作的比較條件。

**MergeSort 正確性**

- 強／一般歸納：假設所有較短輸入都被正確排序，左右半部遞迴結果因此有序。
- 若 `Merge` 能把兩個有序陣列合成含全部元素的有序陣列，整體成立。
- Notes 將 Merge 的完整嚴格證明交給 CLRS 2.3.1，故本課材料只有外層證明骨架。

### 複雜度論證

- InsertionSort 第 `i` 回合最多掃／移 `i` 個元素，總和約 `n(n+1)/2`，故 `O(n²)`；材料用 worst-case 上界，未在此建立所有輸入皆 `Θ(n²)`。
- Merge 對總長 `m` 的兩陣列做 `m` 次輸出；notes 用統一操作成本 `c_op` 給出很鬆的 `≤11m`。
- MergeSort 遞迴樹第 `i` 層有 `2^i` 個大小 `n/2^i` 的子問題，每層至多 `11n`；共 `log n+1` 層，所以至多 `11n log n+11n=O(n log n)`。

### 易錯點與材料缺口

- Notes 中初版 `Merge` 偽程式刻意不完整：沒有處理 `L` 或 `R` 先耗盡；文章程式碼不可照抄成可執行版本。
- Python slice 會複製資料；notes 說可用索引／指標避免，但即使保留複製也不改變本分析的漸近階。
- 為畫整齊遞迴樹假設 `n` 是 2 的冪；可補到 `2^{ceil(log₂n)}`，且新長度不超過 `2n`。
- `O(n log n)` 是上界；本課尚未用比較式排序下界證成最優，那要到 Lecture 6。
- Worst-case input 與 randomized algorithm 的 worst-case random choices 是不同軸，Lecture 5 才正式區分。

### 一手來源 URL

- [Lecture 2 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture2.md)
- [Lecture 2 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-pre.pdf)
- [Lecture 2 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-notes.pdf)
- [Lecture 2 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture2.pdf)
- [Rigorous Analysis of InsertionSort handout](https://stanford-cs161.github.io/winter2026/assets/files/CS161Lecture02_handout.pdf)

---

## Lecture 3 — Solving Recurrences and the Master Theorem

### 官方中繼資料

- 日期：2026-01-12 13:30–14:50
- 講師：Moses（Moses Charikar）
- Component 官方標題：`Solving Recurrences and the Master Theorem`
- Notes 標題：`Solving Recurrences and the Selection Problem`，但正文實際講 recurrences、Master Method 與 Substitution Method；Selection 正式出現在 Lecture 4。這是明顯的標題殘留，不應據此把 Lecture 3 寫成 selection 課。

### 完整 agenda

1. 從 MergeSort、直接分治乘法與 Karatsuba 寫出 runtime recurrence。
2. Recurrence 的正式結構與 base case。
3. 遞迴樹：分支數 `a`、縮小比例 `b`、每個節點額外工作 `n^d`。
4. Master Theorem 三種情況。
5. 用三種案例解釋「頂層主導／每層平衡／葉節點主導」。
6. Master Theorem 的遞迴樹證明與幾何級數。
7. 較一般的 Master Theorem 版本（notes 提供；slides 主要教簡化版）。
8. Substitution Method：先猜、再用歸納證明，必要時由歸納式反推常數。
9. 為何不能把 `T(n)=O(n log n)` 直接當歸納假設而不固定常數。
10. Master Method 不能處理不同大小子問題，Substitution Method 可以。

### 核心定義

- Runtime recurrence：若一層做 `O(f(n))` 工作，並遞迴處理大小 `n₁,…,n_k`，則最壞時間可寫為 `T(n)≤c f(n)+ΣT(nᵢ)`，另有常數時間 base case。
- 簡化版 Master Theorem 適用 `T(n)=aT(n/b)+O(n^d)`，其中 `a≥1`、`b>1`。
- `a`：每個問題產生的子問題數；`b`：每次輸入縮小倍率；`d`：切分與合併額外工作的次方。
- Substitution Method：猜一個顯式上界 `T(n)≤d·g(n)`，設定 base case，再以強歸納證明。

### 演算法步驟

1. 從遞迴演算法逐層列成本，寫出 recurrence 與 base case。
2. 若所有子問題等大且形如 `aT(n/b)+O(n^d)`，辨識 `a,b,d` 後套 Master Theorem。
3. 若子問題大小不同或 Master Theorem 不適用，先用展開、遞迴樹或直覺猜 `g(n)`。
4. 把猜測強化成含固定常數的命題 `T(n)≤C g(n)`，檢查 base case，再用強歸納證明。
5. 歸納不閉合時，區分「猜錯階」與「命題不夠強」，調整後重證。

### 複雜度論證：Master Theorem 與 Substitution Method

```text
T(n) = a T(n/b) + O(n^d)

a = b^d  => O(n^d log n)
a < b^d  => O(n^d)
a > b^d  => O(n^(log_b a))
```

直覺：第 `j` 層有 `a^j` 個子問題，每個大小 `n/b^j`，該層額外工作為 `c n^d (a/b^d)^j`。比值等於 1 時每層相同；小於 1 時頂層主導；大於 1 時底層主導。

### 例子

- 直接分治乘法：`4T(n/2)+O(n)`，`a=4>b^d=2`，得到 `O(n²)`。
- Karatsuba：`3T(n/2)+O(n)`，`3>2`，得到 `O(n^{log₂3})≈O(n^1.59)`。
- MergeSort：`2T(n/2)+O(n)`，`2=2`，得到 `O(n log n)`。
- `T(n)=T(n/2)+O(n)`：`1<2`，得到 `O(n)`。
- Pre-lecture 另要求分析 `T₁(n)=T₁(n/2)+n` 與 `T₂(n)=4T₂(n/2)+n`。

#### Substitution Method 步驟與證明

以 `T(n)=2T(n/2)+32n, T(2)=2` 為例：

1. 猜 `T(n)≤C n log n`，但先不假裝知道 `C`。
2. Base case 要求 `2≤2C`，所以 `C≥1`。
3. 歸納步：`T(k)≤2C(k/2)log(k/2)+32k = k(C log k+32-C)`。
4. 若 `C≥32`，右式至多 `Ck log k`。
5. 選 `C=32` 即得到可檢查的歸納命題，最後再套 Big-O 定義。

### 正確性論證

- 此堂不是證明某個新演算法，而是證明「解 recurrence 的結論」。
- Master Theorem 證明靠遞迴樹與幾何級數。
- Substitution Method 的核心是可量化的歸納假設；`O(...)` 內的常數不能在不同遞迴層偷偷改變。

### 易錯點與材料缺口

- Master Theorem 不是所有 recurrence 都能用：不同大小子問題（例如 `T(n/5)+T(7n/10)+O(n)`）不符合簡化形式。
- Base case 不同會改變精確函數，但若 base case 都是常數，通常不改變漸近階。
- Floor、ceiling 與 `n/b+1` 的處理被略過；notes 明說定理可擴充但沒有在此證明。
- Notes 的較一般 Master Theorem 第三種情況需要 regularity condition `a f(n/b)≤c f(n)`，不可只看 `f(n)` 次方就套。
- 錯誤的猜測導致歸納不閉合，不一定代表漸近階錯；有時要強化猜測，例如 `T(n)≤cn-1` 而不是 `cn`。
- Slides 的精確式範例在 PDF 轉文字時部分上標／分數失真；公式應以 notes 為主、slides 用於議程與直覺交叉核對。

### 一手來源 URL

- [Lecture 3 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture3.md)
- [Lecture 3 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-pre.pdf)
- [Lecture 3 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-notes.pdf)
- [Lecture 3 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-slides.pdf)

---

## Lecture 4 — Median and Selection

### 官方中繼資料

- 日期：2026-01-14 13:30–14:50
- 講師：Moses
- Component／notes 官方標題：`Median and Selection`

### 完整 agenda

1. Selection 問題：未排序陣列中找第 `k` 小元素。
2. 先排序再取第 `k` 個：`O(n log n)`。
3. 找最小值的線性掃描，以及 deterministic `Ω(n)` 下界。
4. Select 的 partition-and-recurse 框架；pivot 影響時間但不影響正確性。
5. 最差 pivot、理想 median pivot、random pivot 三種選擇。
6. Median-of-medians：每 5 個一組，取各組中位數，再遞迴取中位數的中位數。
7. Pivot balance lemma：兩側大小都至多 `7n/10+5`。
8. 完整 recurrence：`T(n)≤T(n/5+1)+T(7n/10+5)+c₁n`。
9. 用 substitution method 證明簡化 recurrence 為 `O(n)`。
10. Substitution 猜測可能錯或不夠強的案例。
11. 用強歸納證明 Select 正確。
12. 實務取捨：random pivot 常數小；median-of-medians 提供 deterministic worst-case guarantee，但常數較大。

### 核心定義

- Selection：輸入 `n` 個數的陣列 `A` 與 `k∈{1,…,n}`，輸出第 `k` 小元素。
- Deterministic algorithm：固定輸入下，總是執行同一組操作。
- Pivot：從 `A` 中選一個值 `p`，分成 `A<={x|x<p}` 與 `A>={x|x>p}`。
- 課堂為清楚起見假設元素互異；重複值需要把等於 pivot 的元素單獨處理，材料未展開。

### 演算法步驟

**Select(A,n,k)**

1. `n=1` 時回傳唯一元素。
2. `p=ChoosePivot(A,n)`。
3. 建立 `A<` 與 `A>`。
4. 若 `|A<|=k-1`，回傳 `p`。
5. 若 `|A<|>k-1`，遞迴 `Select(A<,|A<|,k)`。
6. 否則遞迴 `Select(A>,|A>|,k-|A<|-1)`。

**Median-of-medians ChoosePivot**

1. 把 `A` 分成 `g=ceil(n/5)` 組，每組最多 5 個。
2. 各組排序並取中位數；因組大小為常數，全部組的成本合計為 `O(n)`。
3. 對這 `g` 個組內中位數遞迴做 Select，取其中位數 `p`。
4. 用 `p` 當外層 Select 的 pivot。

### 例子

- Pre-lecture：`A=[6,4,8,9,5,2,1]` 的 3-select 是 4。
- 最差 pivot 若每次都是最大或最小，只剔除一個元素，形成 `T(n)=T(n-1)+Θ(n)=Θ(n²)`。
- 真正 median 當 pivot 時，`T(n)≤T(n/2)+cn≤2cn=O(n)`，但找 median 本身正是待解問題。
- Random pivot 的 Select 預期為 `O(n)`；notes 只陳述，沒有在本堂證明。

### Balance lemma

- `p` 是約 `n/5` 個組內中位數的中位數。
- 至少約一半的組中位數小於 `p`；這些完整五元素組中，每組至少 3 個元素小於 `p`。
- 扣掉含 `p` 的組與可能不完整的尾組，`p` 至少大於 `3(ceil(g/2)-2)` 個元素；對大於側對稱成立。
- 因此 `|A<|≤7n/10+5` 且 `|A>|≤7n/10+5`。

### 正確性論證

強歸納命題：對任何長度 `n` 的陣列與合法 `k`，Select 回傳第 `k` 小元素。

- `|A<|=k-1`：恰有 `k-1` 個元素小於 `p`，所以 `p` 是第 `k` 小。
- `|A<|>k-1`：答案仍是 `A<` 的第 `k` 小；遞迴輸入更短，可套歸納假設。
- `|A<|<k-1`：答案在 `A>`，而其新順位為 `k-|A<|-1`；此值仍在 `1…|A>|`。
- Pivot 的品質不影響上述三分支的正確性，只影響遞迴縮小速度。

### 複雜度論證

- 最小值必須檢查每個可能沒看過的元素；否則可把未讀位置改成更小值而演算法輸出不變，矛盾。因此 deterministic minimum 是 `Ω(n)`，一般 selection 亦承受線性下界。
- 完整 recurrence 含 `+1,+5`；為展示 substitution，notes 簡化成 `T(n)≤T(n/5)+T(7n/10)+cn`。
- 猜 `T(n)≤dn`，歸納步得 `dk/5+7dk/10+ck=(9d/10+c)k≤dk`，只要 `d≥10c`；故 `O(n)`。

### 易錯點與材料缺口

- `k` 是 1-indexed；右半遞迴順位必須減掉左半元素數與 pivot 本身。
- `ChoosePivot` 中「每組用 MergeSort」仍是線性總成本，因每組大小固定 5；不能把每組錯算成 `O(log n)`。
- `7n/10+5` 不是恰好 70/30 分割，而是帶尾組修正的上界。
- 簡化 recurrence 的證明沒有直接處理 `+1,+5`；slides 提示可用平移函數等方法，文章若宣稱嚴格證明需補完整技術細節並標為延伸。
- 元素互異是假設；重複值的三向 partition 未在 notes 寫出。
- Median-of-medians 的理論常數與實際實作成本較大；官方材料稱 random pivot 在非 adversarial inputs 通常更實用，但這不是 worst-case 保證。

### 一手來源 URL

- [Lecture 4 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture4.md)
- [Lecture 4 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-pre.pdf)
- [Lecture 4 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-notes.pdf)
- [Lecture 4 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-slides.pdf)

---

## Lecture 5 — Randomized Algorithms and QuickSort

### 官方中繼資料

- 日期：2026-01-21 13:30–14:50
- 講師：Moses
- Component 標題尾端有多餘空白；語義標題為 `Randomized Algorithms and QuickSort`

### 完整 agenda

1. 隨機化演算法與 Las Vegas 型保證。
2. 隨機化演算法的 expected runtime 與 worst-case runtime 是兩種不同量。
3. BogoSort 作為反例：期望迭代 `n!`、每輪 `O(n)`，期望時間 `O(n·n!)`；最壞時間無限。
4. QuickSort 的 partition-and-recurse 結構。
5. Pivot 選擇：最差 `O(n²)`、精確 median 可給 `O(n log n)` 但不實用、random pivot。
6. 一個刻意錯誤的分析：不能把期望子問題大小代進 recurrence，就當作期望時間。
7. Indicator random variables 與 linearity of expectation。
8. 任意兩個排序後元素 `z_i,z_j` 被比較的機率。
9. 對所有 pair 加總，得到期望比較次數 `≤2n ln n`。
10. 從比較次數推到總時間 `O(C+n)`。
11. Notes 的替代證明：對期望 recurrence 做強歸納與積分上界。
12. In-place partition 與 QuickSort／MergeSort 實務比較。

### 核心定義

- Randomized algorithm：執行中使用隨機選擇。
- Las Vegas algorithm：材料的用語是「always works, probably fast」；輸出永遠正確，時間依亂數而變。
- Expected runtime：輸入可由 adversary 固定，再只對演算法自己的亂數取期望。
- Worst-case runtime of a randomized algorithm：連亂數結果也由 adversary 選；randomized QuickSort 仍可能 `Θ(n²)`。
- Indicator random variable `X_{i,j}`：`z_i,z_j` 曾比較則 1，否則 0；其期望等於事件機率。
- Linearity of expectation：`E[ΣX_i]=ΣE[X_i]`，不要求各變數獨立。

### 演算法步驟

1. `|A|≤1` 時回傳。
2. 從 `A` 均勻隨機選一個 pivot `x`。
3. Partition 成 `A<`、`x`、`A>`。
4. 遞迴排序 `A<` 與 `A>`。
5. 合成 `[QuickSort(A<),x,QuickSort(A>)]`；實務可原地 partition，不必配置兩個新陣列。

### 例子

- BogoSort：每輪隨機排列再檢查；排列成唯一正確順序的機率是 `1/n!`，期望輪數 `n!`，每輪 `O(n)`，但最壞情況可能永遠不停止。
- SlowSort 反例：每次只在最小值與最大值間隨機選 pivot。左右子問題的期望大小看似各半，實際每輪總有一側大小 `n-1`，因此以機率 1 走出二次時間。
- Pairwise 分析可看 `z_2,z_6`：它們只有在區間 `z_2,…,z_6` 中第一個 pivot 是兩端之一時才比較，機率為 `2/5`。

### 正確性論證

- Notes 把正式證明留作練習，提示用歸納法。
- 可從材料直接安全表述的骨架：遞迴結果各自有序，`A<` 全部小於 pivot、`A>` 全部大於 pivot，串接後有序。
- 不可寫成「課堂 notes 已給完整證明」；它沒有。

### 為何「平均切半」論證錯

- Random pivot 下確有 `E|L|=E|R|=(n-1)/2`。
- 但把此期望直接代入 `T(n)=T(|L|)+T(|R|)+O(n)` 不合法；一般而言 `E[f(X)]≠f(E[X])`。
- Slides 用 SlowSort 反例：pivot 每次隨機選最小或最大。左右大小的期望仍各為 `(n-1)/2`，但每次實際都有一側 `n-1`，時間以機率 1 為 `Θ(n²)`。

### 複雜度論證

1. 令 `z_i` 是排序後第 `i` 小元素；一對元素最多比較一次，因一旦其中一個當 pivot，就不再出現在子問題。
2. `z_i,z_j` 會比較，恰好當區間 `{z_i,…,z_j}` 中第一個被選成 pivot 的元素是兩端之一。
3. 因每個元素先被選到的機率相同，`P[X_{i,j}=1]=2/(j-i+1)`。
4. 總比較次數 `C=Σ_{i<j}X_{i,j}`。
5. 線性期望：`E[C]=Σ_{i<j}2/(j-i+1)`。
6. 對固定 `i`，內和由調和級數上界，合計 `≤2n ln n=O(n log n)`。
7. 每個大小 `k` 的 partition 做 `k-1` 次比較與 `O(k)` 工作，且單元素呼叫總數至多 `n`，故總時間 `O(C+n)`。

### 替代證明

- 令 `T(n)` 為期望比較次數，若 pivot 是第 `i` 個 order statistic，成本是 `n-1+T(i-1)+T(n-i)`。
- 對 `i=1…n` 取平均：`T(n)=n-1+(2/n)Σ_{i=1}^{n-1}T(i)`。
- 強歸納猜 `T(i)≤2i ln i`，用遞增函數和式的積分上界與 `∫2x ln x dx=x²ln x-x²/2+C`，推出 `T(k)≤2k ln k`。

### 實作與比較

- In-place partition：把隨機 pivot 換到尾端，以兩個界標掃描；遇到小於 pivot 的元素就交換到左區，最後把 pivot 放到兩區交界。
- Slides 比較：random-pivot QuickSort 最壞 `O(n²)`、期望 `O(n log n)`、容易 in-place、通常不穩定；MergeSort deterministic worst-case `O(n log n)`、穩定，但陣列版本不容易同時保留穩定性、最壞界與低額外空間。
- Slides 列出的語言／標準函式採用情況是課程中的實務例示，屬可能隨版本變動的外部事實；文章若要保留應另查各平台當前官方實作，不宜直接當永久事實。

### 易錯點與材料缺口

- Expected runtime 是對亂數取平均，不是 average-case input analysis。
- `O(n²)` 最壞 pivot 路徑即使機率很低，仍使 worst-case bound 保持二次。
- `E|L|=(n-1)/2` 不足以推出 `E[T(n)]`；這是本堂最重要的反合理化例子。
- 元素互異是假設；重複值 partition 需另設計。
- Notes 說 random-pivot QuickSort 實務常數小與若干標準函式採用它；這類實務比較不是數學定理，寫作時要降格或另驗證。
- In-place partition 的完整偽程式不在 notes，slides 只以動畫步驟解說；可連 notebook，但不可假稱已逐行讀 notebook。

### 一手來源 URL

- [Lecture 5 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture5.md)
- [Lecture 5 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-pre.pdf)
- [Lecture 5 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-notes.pdf)
- [Lecture 5 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-slides.pdf)

---

## Lecture 6 — BucketSort and Lower Bounds for Sorting

### 官方中繼資料

- 日期：2026-01-26 13:30–14:50
- 講師：Moses
- Component 官方標題：`BucketSort and Lower Bounds for Sorting`
- Notes 標題：`Sorting Lower Bounds, Counting Sort, and Radix Sort`
- Slides 標題：`Sorting lower bounds and O(n)-time sorting`
- 命名差異的實質：component 用 BucketSort 作概括名稱，實際演算法材料稱 Counting Sort，並進一步以它組成 Radix Sort。

### 完整 agenda

1. 計算模型決定「排序多難」；先限定 comparison-based sorting。
2. 把 deterministic comparison sorting 表示成 decision tree。
3. 正確排序需要至少 `n!` 個葉節點。
4. 二元決策樹深度與 `log(n!)=Ω(n log n)`。
5. 結論：deterministic comparison sorting worst-case `Ω(n log n)`。
6. Randomized comparison sorting 的 expected lower bound `Ω(n log n)`；slides 只述結果與同類想法，不要求證明。
7. Lower bound 只對受限模型成立；可否直接利用 key 值繞開比較模型？
8. Counting Sort：以 key 對應 bucket，串接所有 buckets。
9. Counting Sort 的正確性、穩定性與 `O(n+r)` 時間／空間取捨。
10. Radix Sort：從 least significant digit 開始，對每一位做 stable Counting Sort。
11. 用歸納法證明 Radix Sort 正確。
12. `O(d(n+r))`，其中 `d` 是位數、`r` 是 radix／bucket 數。
13. 數值上限 `M` 下，`d=floor(log_r M)+1`；選 `r=n` 的時間為 `O(n(floor(log_n M)+1))`。
14. 若 `M≤n^c`（常數 `c`），可達 `O(n)`；若 `M=2^n`，則約 `O(n²/log n)`。

### 核心定義

- Comparison-based sorting：不能直接讀 key 數值，只能問兩個元素誰大誰小。
- Decision tree：內部節點是一個 yes/no 比較，分支是答案，葉節點是輸出排列；某輸入的執行對應根到葉的一條路。
- Lower bound 是模型相依的：證明比較模型至少 `Ω(n log n)`，不代表所有利用 key 結構的排序都受此限制。
- Stable sort：兩個 key 相同的元素，在輸出中維持輸入時的相對順序。

### 比較式排序下界

1. `n` 個互異元素共有 `n!` 種次序；正確 deterministic 演算法的 decision tree 至少要有 `n!` 個可區分輸出的葉。
2. 一棵有 `n!` 葉的二元樹，最小可能最大深度至少 `log₂(n!)`。
3. 用 Stirling 近似的漸近資訊，`log(n!)≈n log(n/e)=Ω(n log n)`。
4. 所以任何 deterministic comparison sorter 在某輸入上至少做 `Ω(n log n)` 次比較／步驟。
5. Slides 另陳述 randomized comparison sorter 的期望下界相同，但完整證明不在課程責任範圍；不可把 deterministic decision-tree 證明原封不動說成已證 randomized 版本。
6. MergeSort 的 `O(n log n)` 因此在 comparison model 下達到漸近最優。

### 演算法步驟

#### Counting Sort

輸入 `n` 個物件，key 屬於 `{0,…,r-1}`：

1. 建立 `r` 個 bucket，每個用 FIFO linked list。
2. 依輸入順序掃描；key 為 `k` 的元素追加到 bucket `A[k]` 尾端。
3. 依 `A[0],A[1],…,A[r-1]` 串接。

正確性：較小 key 的 bucket 一定先輸出。穩定性：同 bucket 使用尾端追加，保留原輸入順序。時間為 `O(n+r)`，空間也受 `r` 影響；`r` 很大時不划算。

#### Radix Sort

1. 把每個輸入視為 `d` 位 base-`r` 數字。
2. 先以最低有效位當 key 做 stable Counting Sort。
3. 依序處理第二低位，直到最高有效位。

Slides 範例：`21,345,13,101,50,234,1` 補零後按個位、十位、百位排序；最後為 `1,13,21,50,101,234,345`。Base 100 只需兩輪但要 100 個 buckets，展示「較大 base：bucket 更多、輪數更少」的取捨。

### 例子

- 生日月份只有 12 個 key，可把學生直接放進 12 個 buckets，再依月份串接；這是 pre-lecture 用來突破比較模型的直覺。
- Slides 的十進位例子展示 LSD-first：第一次只保證個位有序，第二次靠穩定性保留個位次序並按十位分組，第三次完成百位排序。
- 同一批數字若改用 base 100，位數／輪數下降但 buckets 從 10 增至 100，具體呈現時間與空間取捨。

### 正確性論證

歸納命題：第 `k` 輪結束後，陣列依最低 `k` 位有序。

- 基底 `k=0` vacuously true，或 `k=1` 由 Counting Sort 正確性成立。
- 歸納步：第 `k` 輪先按第 `k` 位分 bucket。若兩數第 `k` 位不同，bucket 順序決定它們；若相同，stable Counting Sort 保留前一輪已依低 `k-1` 位排好的相對順序。
- `k=d` 時已依全部位數排序。

### 複雜度論證

- 每輪 Counting Sort 成本 `O(n+r)`；共 `d` 輪，所以 `O(d(n+r))`。
- 若最大值為 `M`，base `r` 的位數是 `floor(log_r M)+1`；不能隨意丟掉 `+1`，例如 `M<r` 時 `log_rM<1` 但仍要至少一位／一輪。
- 取 `r=n` 平衡掃描 `n` 個輸入與初始化 `r` buckets，得 `O(n(floor(log_nM)+1))`。
- 若 `M≤n^c`，`log_nM≤c`，因此 `O(n)`；若 `M=2^n`，`log_nM=n/log₂n`，因此 `O(n²/log n)`。

### 易錯點與材料缺口

- `Ω(n log n)` 只限制 comparison-based model；Counting/Radix Sort 直接讀 key，沒有推翻下界。
- Counting Sort 要知道 key 範圍並可直接算 bucket index；若 `r` 遠大於 `n`，時間和空間都可能很差。
- Radix Sort 必須使用 stable inner sort；若 Counting Sort 不維持同 key 的相對順序，歸納步失效。
- 必須從 least significant digit 開始；若從最高位開始又不採不同遞迴結構，後續排序會破壞先前高位順序。
- `O(n)` 依賴 key-size／word-operation 模型與 `M≤n^c`；不能寫成對任意精度整數都線性。
- Notes 的 lower-bound 小節只寫「See link on course website」，實際證明在 slides；因此此課文章的下界段主要應引用 slides。
- Randomized comparison lower bound 的證明在 slides 明確略過；文章可陳述課程結論，但若要解釋證明，需放到 `## 延伸` 並另查一手教材。
- Component 的 Additional reading 指向 Avrim Blum 的講義，這次未讀，不能列為已深讀來源。

### 一手來源 URL

- [Lecture 6 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture6.md)
- [Lecture 6 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-pre.pdf)
- [Lecture 6 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-notes.pdf)
- [Lecture 6 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-slides.pdf)

---

## 事實交叉表

| 事實 | Component | Notes | Slides | 狀態 |
|---|---|---|---|---|
| L1 是 Ellen、2026-01-05 | 明列 | 文件標 Lecture 1 | Lecture 1 | ✅ |
| L1 核心案例為 Karatsuba | 資源未列 agenda | 完整推導 | 完整動畫／遞迴樹 | ✅ |
| L2 涵蓋 asymptotics、worst case、MergeSort | 標題明列 | 完整正文 | agenda 與例子 | ✅ |
| Merge 偽程式缺耗盡分支 | — | 明確警告 incomplete | 視覺解說 | ✅ |
| L3 component 標題是 Master Theorem | 明列 | 標題誤寫 Selection，正文不是 | agenda 是 recurrence/Master/substitution | ❌ 標題衝突；採 component + 正文實質 |
| L4 deterministic Select 為 `O(n)` | 標題／資源 | balance lemma + recurrence + substitution | 同樣結構 | ✅ |
| L5 random-pivot QuickSort 對每個固定輸入的期望時間 `O(n log n)` | 標題／資源 | pairwise proof + alternate proof | 錯誤分析反例 + pairwise proof | ✅ |
| L6 component 稱 BucketSort、正文稱 Counting Sort | 標題明列 BucketSort | Counting Sort + Radix Sort | CountingSort + RadixSort | ⚠️ 命名差異；文章需交代 |
| Comparison sorting lower bound `Ω(n log n)` | 標題明列 lower bounds | deterministic 細節另指網站 | slides 給 deterministic proof | ✅ deterministic；randomized proof僅陳述 |
| Radix Sort 可為 `O(n)` | — | 僅在 `r=O(n),d=O(1)` 或 `M≤n^c` | 同條件 | ✅ 有條件，不可去掉前提 |

## 寫作時必守的來源邊界

1. 每篇課堂正文以 component 標題與 notes/slides 的實際內容為準；來源間衝突要明說，不自行修史。
2. 「官方材料沒有證明」的部分不能補成課內內容：L2 Merge 嚴格證明、L5 QuickSort 完整正確性、L6 randomized lower bound 都屬此類。
3. 可在 `## 延伸` 補外部證明或現代實務，但必須重新讀一手來源並與課堂內容分開。
4. 所有複雜度都連著前提寫：worst/expected、comparison model、distinct elements、key range、`M` 與 `r`、base case 與 floor/ceiling 簡化。
5. 不用 Canvas 錄影補「講師在課堂說過」；這份底稿只能支持 PDF 與 component 中可見的內容。
