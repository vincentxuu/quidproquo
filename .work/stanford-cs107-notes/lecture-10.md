# CS107 Winter 2026 — Lecture 10 research note

- 日期：2026-01-28（Wed）
- 官方標題：Stack and Heap
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. array `sizeof` 與 pointer arithmetic trivia。
2. Topic 3 stack/heap learning goals 與 memory-segment 對照。
3. stack-frame case study：local array、return address/lifetime 與 dangling pointer。
4. 「Mayday」案例逐步追蹤 stack memory 被重用後的錯誤。
5. `malloc` 的 interface、以 heap allocation 修正 lifetime 問題。
6. dynamic-memory etudes、適用時機、`calloc`/`strdup` 預告、`free` cleanup。

## 核心例子／指令／數字

- `char fruit[6]; strcpy(fruit,"grape"); sizeof(fruit)` 為 6；傳成 parameter 後只剩 first-element address，`sizeof` 是 pointer size。
- pointer arithmetic 會依 pointee size scale：`p+1` 前進 `sizeof(*p)` bytes。
- stack allocation 的 lifetime 到 declaring function return；回傳 local array address 會成 dangling pointer。
- `malloc(nbytes)` 回傳未型別化 heap pointer；範例以 `count * sizeof(element)` 配置 array，必須檢查 `NULL`。
- heap 適合大小到 runtime 才知道、資料需跨 function lifetime、或太大不宜放 stack 的情境；不再需要時 `free`。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/10/Lecture10.pdf

## 材料缺口

- PDF 有大量逐步 animation 重複頁；公開版可還原狀態序列，但沒有講者 narration。
