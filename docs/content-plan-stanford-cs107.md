# 內容規劃：Stanford CS107 逐講系列

- 來源：Stanford CS107, **Winter 2026**
- Canonical manifest：[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- 規模：**26 篇 × zh-TW/en = 52 個新 Markdown 檔**；既有雙語總覽保留 `series.order: 1`，不改 slug／date
- 資料成熟度：**L3**；Lecture 1–26 各有公開官方投影片，calendar 可對齊日期、主題、閱讀與作業。錄影、課堂示範程式碼與 starter repositories 需 Stanford 權限
- Target offering：Winter 2026（course archive `cs107.1264`），不混用 Summer 2026 或其他學期材料

## 交付契約

1. 一篇對應官方 Lecture 1–26，依該講投影片與 calendar agenda 完整覆蓋。
2. 每篇開頭列課程、學期、官方講次／日期、講者、官方材料與材料缺口。
3. 中文與英文使用相同章節骨架、例子、限制與來源；既有總覽維持閱讀順序 1，lectures 使用 2–27。
4. 系列中文名 `Stanford CS107 導讀`，英文名 `Reading Stanford CS107`；category 為 `learning`。
5. Lecture 27 是無公開投影片的期末 review session，屬課程支援活動，不納入 26 講內容系列；calendar 的 navigation 與公開 slide manifest 都以 Lecture 1–26 為正式內容單元。
6. 公開投影片足以支撐正文；Canvas 錄影、AFS lecture code 與 starter repositories 一律明列為缺口，不假裝已讀。

## Manifest

| Order | Lecture | Date | Official title | Topic slug |
|---:|---:|---|---|---|
| 2 | 1 | 2026-01-05 | Welcome to CS107! | `welcome-unix-tour` |
| 3 | 2 | 2026-01-07 | Unix and C | `unix-and-c` |
| 4 | 3 | 2026-01-09 | Integers, Bits and Bytes | `integers-bits-bytes` |
| 5 | 4 | 2026-01-12 | Bitwise Operators | `bitwise-operators` |
| 6 | 5 | 2026-01-14 | Bitwise Operators, Take II | `shifts-and-gdb` |
| 7 | 6 | 2026-01-16 | Chars and C-Strings | `chars-c-strings` |
| 8 | 7 | 2026-01-21 | C-Strings, Buffer Overflows and Security | `buffer-overflows-security` |
| 9 | 8 | 2026-01-23 | Introduction to Pointers | `pointer-introduction` |
| 10 | 9 | 2026-01-26 | Pointers and Arrays | `pointers-and-arrays` |
| 11 | 10 | 2026-01-28 | Stack and Heap | `stack-and-heap` |
| 12 | 11 | 2026-01-30 | Generics and void * | `generics-void-pointer` |
| 13 | 12 | 2026-02-02 | Generics, void *, and Function Pointers | `function-pointers` |
| 14 | 13 | 2026-02-04 | Function Pointers, Continued | `function-pointers-continued` |
| 15 | 14 | 2026-02-06 | Introduction to Assembly and x86-64 | `assembly-x86-64` |
| 16 | 15 | 2026-02-09 | Introduction to Assembly and x86-64, Take II | `assembly-addressing-modes` |
| 17 | 16 | 2026-02-11 | Introduction to ALU Operations | `assembly-alu-operations` |
| 18 | 17 | 2026-02-13 | Introduction to Control Flow Operations | `assembly-control-flow` |
| 19 | 18 | 2026-02-18 | More Control Flow Operations | `assembly-conditions-loops` |
| 20 | 19 | 2026-02-20 | Introduction to Function Call and Return | `assembly-function-calls` |
| 21 | 20 | 2026-02-23 | Privacy, Trust and Heap Preview | `privacy-trust-reverse-engineering` |
| 22 | 21 | 2026-02-25 | Managing the Heap, Take I | `heap-allocation-design` |
| 23 | 22 | 2026-02-27 | Managing the Heap, Take II | `heap-allocator-designs` |
| 24 | 23 | 2026-03-02 | Managing the Heap, Take III | `explicit-free-list` |
| 25 | 24 | 2026-03-04 | Optimizations | `compiler-optimization-profiling` |
| 26 | 25 | 2026-03-06 | Caching and Memory Hierarchies | `caching-memory-hierarchy` |
| 27 | 26 | 2026-03-09 | Wrap-up and Q&A | `wrap-up-next-steps` |

講者：Winter 2026 syllabus 與 archive 將課程列為 Jerry Cain 授課；若單講投影片另標 guest speaker，文章以單講投影片為準。

## 批次與驗證

### 短講篇幅例外

- Lecture 25 的 Winter 2026 公開投影片抽取後只有 55 行，內容只涵蓋 caching、memory hierarchy、temporal locality 與 spatial locality。為避免混入其他 offering 的 cache 結構細節，中文正文（frontmatter 後、含 references）忠實收在 5,047 字元，低於一般 6,000 字元目標。
- Lecture 26 是 wrap-up deck，正文只覆蓋公開的六個 big questions、learning goals、Sebastian C 與後續課程，不重建未公開 Q&A；中文正文（frontmatter 後、含 references）為 6,104 字元。

- Batch A：Lectures 1–5（10 files）
- Batch B：Lectures 6–10（10 files）
- Batch C：Lectures 11–15（10 files）
- Batch D：Lectures 16–20（10 files）
- Batch E：Lectures 21–26（12 files）

每批完成研究筆記、中文、英文與 parity 後，執行 `pnpm check:references`、`pnpm check:tw <zh files>`、`pnpm check:series-order`、`pnpm check:lang-parity`。系列完成後跑唯一品質閘門 `pnpm verify`。
