# CS107 Winter 2026 — Lecture 11 research note

- 日期：2026-01-30（Fri）
- 官方標題：Generics and `void *`
- 投影片標題：Heap Wrap, Generics – void *
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. `calloc`, `strdup`, `free`, `realloc`，以及 heap-allocation recap。
2. heap vs stack 的 lifetime、size、ownership 與成本比較。
3. Topic 4 C generics 的問題與 learning goals。
4. strongly typed data exchange 的重複程式碼。
5. 逐步將 `swap` 泛化成 `void *` + byte count。
6. `memcpy` 作為 byte replicator；錯誤 `void *` 使用 demo。

## 核心例子／指令／數字

- `calloc(26,sizeof(int))` 保證 26 個 int 起始皆為 0；bool 為 false、pointer bits 為全零的常見例子亦列出。
- `strdup("disinformation")` 建立可修改 heap copy，之後同樣必須 `free`。
- `free` 只接受 allocator 回傳的 base address；double-free、free stack memory、use-after-free 都是錯誤。
- `realloc` 可能移動 block，成功後舊 pointer 不應再用；失敗會回 `NULL` 且原 block 保留，因此應先存 temporary。
- generic `swap(void *a, void *b, size_t nbytes)` 把資料視為 bytes，透過 temporary buffer 與 `memcpy` 交換。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/11/Lecture11.pdf

## 材料缺口

- calendar 提到 vulnerability disclosure、use-after-free、partiality；PDF 的 heap/generics內容最完整，但公開錄影不可得，無法確認口頭倫理討論的篇幅。
