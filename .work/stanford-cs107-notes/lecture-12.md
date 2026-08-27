# CS107 Winter 2026 — Lecture 12 research note

- 日期：2026-02-02（Mon）
- 官方標題：Generics, `void *`, and Function Pointers
- 投影片標題：C Generics and Function Pointers
- 講者：未由 PDF 單獨署名確認（版權列 Stanford CS、Lisa Yan、Nick Troccoli、Katie Creel）
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. 將 typed `swap_ends_int` 泛化為 `void *base`, element count, element width。
2. generic pointer arithmetic 必須轉成 byte pointer。
3. generic rotate etude 與 overlapping ranges。
4. `memmove` 與 `memcpy` 的差異，Pascal/C string 小例子。
5. bubble sort 動機與 int-specific 實作。
6. function-pointer syntax、callback，逐步把 comparator 注入排序。
7. 把 integer bubble sort 往 generic data 推進。

## 核心例子／指令／數字

- `int nums[]={7,2,3,4,5,6,1}`；swap endpoints 後輸出 `nums[0]=1, nums[6]=7`。
- generic endpoint address：base 視為 `char *`，末元素位址是 `base + (len-1)*elem_size`。
- `memmove` 在 source/destination overlap 時定義良好；`memcpy` overlap 是 undefined behavior。
- bubble sort 比較相鄰元素、若逆序即 swap，直到一整 pass 都沒有 swap。
- function pointer 能作 parameter/variable；callback 讓排序邏輯與 ordering policy 分離。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/12/Lecture12.pdf

## 材料缺口

- PDF 沒有單一授課者署名；投影片動畫產生大量重複頁，但主要演進可完整讀取。
