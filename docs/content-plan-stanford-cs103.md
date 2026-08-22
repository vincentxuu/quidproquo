# Stanford CS103 Spring 2026 逐講雙語系列計畫

## 版本與範圍

- 鎖定 Stanford CS103 Spring 2026（官方封存代碼 `cs103.1266`），不混用 Summer 2026 或其他學期材料。
- 官方 manifest 是 Lecture 0–27，共 28 講；既有雙語總覽維持 `series.order: 1`，逐講文章依閱讀順序使用 2–29。
- 每講一篇 zh-TW 與一篇 en，檔名中的 lecture 編號採讀者較直覺的 01–28；正文同時保留官方 Lecture 0–27。
- series 名稱沿用既有登記：`Stanford CS103 導讀`。

## Material-fidelity 判定

本 offering 為 **L3（以完整投影片為主）**：28 講各有官方 lecture page 與完整 `Lecture Slides.pdf`，schedule、作業及講義可對齊。錄影只在 Stanford Canvas/Panopto 開放，校外無法存取；每篇都明列此缺口，不把投影片以外的口述內容當成課堂原話。

## 編輯契約

1. 一篇恰好對應官方一講，不跨講合併。
2. 開頭列 course、term、官方 lecture 編號與日期、講者、材料與缺口。
3. 正文依投影片 agenda 排列；作者補充集中在 `## 延伸`。
4. zh/en pair 使用相同章節骨架、來源、課程版本與 order。
5. 材料較短時不為達字數灌水，並在逐講研究筆記記錄。

## Manifest

| 閱讀序 | 官方講次 | 日期       | 官方標題                        | slug                                 |
| -----: | -------: | ---------- | ------------------------------- | ------------------------------------ |
|      2 |        0 | 2026-03-30 | Introduction, Set Theory        | `lecture-01-introduction-set-theory` |
|      3 |        1 | 2026-04-01 | Mathematical Proofs             | `lecture-02-mathematical-proofs`     |
|      4 |        2 | 2026-04-03 | Indirect Proofs                 | `lecture-03-indirect-proofs`         |
|      5 |        3 | 2026-04-06 | Propositional Logic             | `lecture-04-propositional-logic`     |
|      6 |        4 | 2026-04-08 | First-Order Logic, Part I       | `lecture-05-first-order-logic-1`     |
|      7 |        5 | 2026-04-10 | First-Order Logic, Part II      | `lecture-06-first-order-logic-2`     |
|      8 |        6 | 2026-04-13 | Functions, Part I               | `lecture-07-functions-1`             |
|      9 |        7 | 2026-04-15 | Functions, Part II              | `lecture-08-functions-2`             |
|     10 |        8 | 2026-04-17 | Set Theory Revisited            | `lecture-09-cardinality`             |
|     11 |        9 | 2026-04-20 | Graphs, Part I                  | `lecture-10-graphs-1`                |
|     12 |       10 | 2026-04-22 | Graphs, Part II                 | `lecture-11-graphs-2`                |
|     13 |       11 | 2026-04-24 | Graphs, Part III                | `lecture-12-graphs-3`                |
|     14 |       12 | 2026-04-27 | Mathematical Induction, Part I  | `lecture-13-induction-1`             |
|     15 |       13 | 2026-04-29 | Mathematical Induction, Part II | `lecture-14-induction-2`             |
|     16 |       14 | 2026-05-01 | Finite Automata, Part I         | `lecture-15-finite-automata-1`       |
|     17 |       15 | 2026-05-04 | Finite Automata, Part II        | `lecture-16-finite-automata-2`       |
|     18 |       16 | 2026-05-06 | Finite Automata, Part III       | `lecture-17-finite-automata-3`       |
|     19 |       17 | 2026-05-08 | Regular Expressions             | `lecture-18-regular-expressions`     |
|     20 |       18 | 2026-05-11 | Nonregular Languages            | `lecture-19-nonregular-languages`    |
|     21 |       19 | 2026-05-13 | Context-Free Languages          | `lecture-20-context-free-languages`  |
|     22 |       20 | 2026-05-15 | Turing Machines, Part I         | `lecture-21-turing-machines-1`       |
|     23 |       21 | 2026-05-18 | Turing Machines, Part II        | `lecture-22-turing-machines-2`       |
|     24 |       22 | 2026-05-20 | Turing Machines, Part III       | `lecture-23-turing-machines-3`       |
|     25 |       23 | 2026-05-22 | Unsolvable Problems, Part I     | `lecture-24-unsolvable-problems-1`   |
|     26 |       24 | 2026-05-25 | Unsolvable Problems, Part II    | `lecture-25-unsolvable-problems-2`   |
|     27 |       25 | 2026-05-27 | Unsolvable Problems, Part III   | `lecture-26-unsolvable-problems-3`   |
|     28 |       26 | 2026-05-29 | Complexity Theory               | `lecture-27-complexity-theory`       |
|     29 |       27 | 2026-06-01 | Wrap-Up                         | `lecture-28-wrap-up`                 |

## 驗收

目前 fidelity 狀態：**28 / 28**。Lecture 1–28 的雙語正文皆已依下載的官方 deck 重建，並通過 clean-context re-review；數式破損、來源、連結、雙語結構與系列順序 blocker 均已解除。系列仍等待使用者最終 review，未部署。

- Lecture 02–27 的 `.work/stanford-cs103-notes/lecture-NN.md` 已改為逐項 agenda checklist；每一項對應下載後的官方 deck，Lecture 26 另記錄旋轉頁面後的 OCR 流程。
- 文章路徑、日期與 series order 維持不變；所有文章為 `draft: false`，但尚未部署。
- 八個已知失效的舊 handout URL 已自 CS103 文章移除；官方 lecture page、slides 與 archive 仍作為可核對來源。

- `pnpm check:tw <zh files>`
- `bash .agents/skills/post-polish/scripts/register-scan.sh <long zh files>`
- `pnpm check:references`
- `pnpm check:series-order`
- `pnpm check:lang-parity`
- 最終由整體任務執行 `pnpm verify`。
