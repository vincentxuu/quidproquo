# 修改紀錄：ADL 2025 第 3 堂（Sequence Modeling）

日期：2026-10-13。依 `rereview-lecture-03.md` 修改，未 commit。行號是修改前的行號。

檔案：
- zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn.md`
- en：`src/content/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en.md`

這次實際看過圖的講義頁：6、43、65（48、49 有轉圖但沒有讀，報告已說這兩頁只有圖與引用）。字幕與逐字稿用 grep 取出相關段落核對，沒有重讀全文。

## 已改

### R1（原 S15）英文版補回轉折詞：已改（en 八處，zh 不動）

| en 行 | 改前 | 改後 | 依據 |
|---|---|---|---|
| 57 | `…is also two steps. The first is an ancestor relation…` | `…is also two steps. But the first is an ancestor relation…` | zh 58「但前者是祖孫關係」；3.1 [05:24–05:37]「但是 Compact 跟 Hatchback 也是間隔二，可是這兩個的關聯…其實不一樣」 |
| 151 | `…it is no longer zero, and that 0.0001 is assigned by a person…` | `…it is no longer zero, but that 0.0001 is assigned by a person…` | zh 152（本文自編例子，只對齊中文） |
| 153 | `Many smoothing methods have been proposed, and the problem cannot be fully solved…` | `…have been proposed, but the problem cannot be fully solved…` | 3.2 [06:00]「但是這件事情沒辦法完全解決」 |
| 182 | `RNNs now sound rarely used, and they are an important step…` | `RNNs now sound rarely used, but they are an important step…` | 3.2 [12:00]「雖然現在聽起來…RN 好像已經很少被使用了，但它其實是…非常重要的一件事情」 |
| 239 | `too large can be made smaller, and once it has vanished…` | `too large can be made smaller, but once it has vanished…` | 3.3 [09:01]「你太大你還可以把它變小，但你消失了你也不知道它是多少」 |
| 241 | `With so much in between, the information about France…`；`…(the slide: in theory), and in practice…` | `But with so much in between, the information about France…`；`…(the slide: in theory), but in practice…` | 3.3 [12:01]「但是如果你這邊中間出現的東西實在太多…」「理論上它不應該消失，但是實務上就是會消失」 |
| 287 | `…is much harder. Many tasks are unaligned…` | `…is much harder. But many tasks are unaligned…` | 3.4 [09:01]「可是會有非常多情況，是不 align 的」 |
| 300 | `…multiplied too many times, and the fixes are not symmetric` | `…multiplied too many times, but the fixes are not symmetric` | zh 301（本文歸納一節，只對齊中文） |

### R2 en 293 單複數：已改（zh 不動）

- 改前：`These are my own summary, not points listed one by one in the lecture.`
- 改後：`This list is my own summary, not something the lecture enumerated point by point.`
- 依據：zh 294；任務指定用字。

### R3 捷徑的轉述：已改（zh 244／en 243）

- zh 改前：「在原本的 RNN 上面多開一條捷徑，走這條路不用經過那些運算，可以一路衝到很後面，影響很遠的輸出。」
- zh 改後：「在原本的 RNN 上面多開一條捷徑，這條路沒有什麼阻礙，可以一路衝到很後面，影響很遠的輸出。」
- en 改前：`add a shortcut on top of the original RNN; information on this path skips those operations and can run all the way to much later, affecting distant outputs.`
- en 改後：`add a shortcut on top of the original RNN; this path is unobstructed, so information can run all the way to much later and affect distant outputs.`
- 依據：3.3 [12:01]「這條路就是不用經過什麼控制，我可以走上面這個捷徑一路衝…然後就可以影響非常後面的…output」；講 GRU 時「上面這條就是無所阻礙，就直接這樣衝過去」。字幕裡沒有「運算」。

### R4（原 S11）標註「人力」改「時間」：已改（zh 57、310／en 56、309）

- zh 57 改前：「**要花大量標註人力**。」→ 改後：「**要花大量標註時間**。」
- zh 310 改前：「…需要大量標註人力、…」→ 改後：「…需要大量標註時間、…」
- en 56 改前：`**Annotation effort.** It takes a great deal of human labor.` → 改後：`**Annotation effort.** It takes a great deal of annotation time.`
- en 309 改前：`…it needs a great deal of annotation effort, and word similarity…` → 改後：`…it needs a great deal of annotation time, and word similarity…`
- 依據：第 6 頁（看圖）Issues 第三項 `annotation effort`；3.1 [04:57–05:00]「做這個編輯，其實需要非常多的…annotation 的時間」。en 56 的粗體標題保留投影片原文。

### 原 S12 表格「長度」：已改（zh 282／en 281）

- zh 改前：「不對齊，長度與順序都可以不同」→ 改後：「不對齊，順序可以不同」
- en 改前：`Unaligned, length and order may differ` → 改後：`Unaligned, order may differ`
- 依據：第 65 頁（看圖）只寫 `Temporal ordering for input and output may be different`；3.4 [09:01] 只說「不 align」「順序不一定會是 align 的」，沒有提長度。

## 不改

### 原 S7（zh 216／en 215）投影片圈起來的 W：不改

- 理由：報告把它列在「未驗證」並判定不必改。第 43 頁（看圖）圈起來的確實是 (Wˡ⁺¹)ᵀ，文章的式子與「把 W 圈起來」和講義一致。3.3 [06:02] 的「這不是 transpose，這是用了 t 次這個 weight」指的是哪個符號，沒有影片畫面無法確認；文章也沒有引用這句口述，所以沒有可改的錯。

### 流程面與報告「未驗證」一節的其他項目：不處理

- 沒有第一次審查時的文章副本可 diff、沒重看的講義頁、外部連結與學期日期、沒跑 `pnpm verify`：都是審查流程的說明，不是文章要改的地方。

## 任務另外要求的檢查

- zh「優化」：grep 0 次，無需修改。常見中國用語（質量、信息、視頻、默認、網絡、數據、算法、用戶、概率等）grep 0 次。
- en 第一次提到講者：內文第 52 行是 `Professor Chen says…`，之後才用 she，已符合，沒有改。
- `**詞（說明）**` 後面直接接中文字：兩檔 grep 0 次（`**例子（本文自編）**。` 後面接的是句號，不受影響），沒有改。
- 沒有新增來源外的說明，所以沒有新增「本文補充」標記。frontmatter、檔名未動。

## 檢查結果

- `check-course-titles.mjs`：`Course title gate: 0 issue(s)`
- `check-course-guide-layout.mjs`：`Course source layout: 1716 posts, 0 issue(s).`
