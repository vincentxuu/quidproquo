# CS107 Winter 2026 — Lecture 13 research note

- 日期：2026-02-04（Wed）
- 官方標題：Function Pointers, Continued
- 投影片標題：C Generics and Function Pointers, Take II
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. standard comparator paradigm 與三向回傳契約。
2. integer bubble sort 接收 comparator function pointer。
3. 逐步泛化 data pointer、element width、比較與 swap。
4. generic callback 的 `const void *` 介面。
5. C standard-library generic functions：`qsort`, `bsearch`, `lfind`。

## 核心例子／指令／數字

- comparator 回傳 `<0`（first < second）、`>0`（first > second）、`0`（equal），不是單純 bool。
- int-specific callback 型別：`int (*compare_fn)(int, int)`；bubble sort 在 `cmp_fn(arr[i-1],arr[i]) > 0` 時交換。
- standard generic comparator 形式為 `int cmp(const void *a, const void *b)`，輸入需依實際 element type cast/dereference。
- generic sort 需 `void *base`, `size_t n`, `size_t width`, comparator；相鄰位址以 `(char *)base + i*width` 計算。
- calendar 指定延伸閱讀／man pages：`qsort`, `lfind`, `bsearch`。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/13/Lecture13.pdf

## 材料缺口

- 講者未由 PDF 單獨確認；影片與實際 lecture code 不公開。PDF 只有 17 pages，內容較精簡，但與 calendar agenda 一致。
