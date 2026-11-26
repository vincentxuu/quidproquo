---
title: "AI Engineer 面試日練 — 2026-11-20：Coding"
date: 2026-11-20
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五主題 Coding：手刻一個 Byte-Pair Encoding tokenizer 的 train／encode／decode，練習怎麼在面試中講清楚 vocab size 跟序列長度的 trade-off，以及為什麼生產環境的 tokenizer 版本必須跟訓練時完全一致。"
tldr: "BPE 的核心只是一句話：反覆把語料裡出現最多次的相鄰 pair 合併成新符號，藉此在 vocab 大小跟序列長度之間找一個資料驅動的平衡點；面試時最容易漏講的是 encode 階段必須照訓練時的 merge 順序套用，順序或版本一旦跟訓練用的 tokenizer 不一致，上線的 model 就會讀到錯的 token。"
series:
  name: "AI Engineer 面試日練"
  order: 93
---

> :globe: [English version](/posts/daily/2026-11-20-ai-interview-daily-en)

## 今日主題

星期五固定練 Coding，範圍收在 ML 味最重的那一類實作題——batch inference、tokenizer、data processing、numpy 向量化。這類題目常出現在 LLM／NLP 相關職缺的 live coding 環節，面試官要看的不是你會不會呼叫 `tokenizers` 函式庫，而是你知不知道函式庫底下在做什麼：能不能在沒有高階 API 的情況下，把一個演算法的核心迴圈正確、乾淨地寫出來。

今天挑的題目是手刻一個 Byte-Pair Encoding（BPE）tokenizer。這題同時觸碰到「演算法實作」跟「ML 系統設計」兩層：寫得出迴圈只是及格線，講得出 vocab size 跟序列長度的 trade-off、講得出為什麼 encode 階段不能重新計算頻率，才是這題真正在篩的東西。

## 核心概念速記

### BPE 訓練迴圈：用詞頻當訊號，貪婪合併

BPE 的訓練分兩步，重複執行到達到 vocab size 門檻或 merge 次數上限：先統計語料裡所有相鄰符號 pair 的出現頻率，再把出現最多次的那個 pair 合併成一個新符號，並把這條 merge 規則依發現順序記錄下來。演算法完全不懂語言學——`er` 會被合併成一個 token，純粹是因為它在語料裡出現得夠多，不是因為它是英文字尾。

### Train 跟 encode 是兩個不同階段，順序必須一致

訓練階段依賴整個語料的詞頻統計，但 encode 一筆新的輸入字串時不會重新算頻率，而是從最小符號開始，依照訓練時記錄下來的 merge 優先順序（merge rank）逐一套用規則，直到沒有規則可套用為止。這個區分是面試裡最容易被問倒的地方：如果 encode 時套用規則的順序跟訓練時不一樣，同一句話會編碼出不同的 token 序列，上線的模型跟 fine-tune 資料就會對不上。

### Byte-level 起始符號表解決 OOV，不是靠運氣

純字元層級的 tokenizer 遇到沒見過的 Unicode 字元還是可能出問題,而 byte-level BPE 固定從 UTF-8 的 256 個 byte 值開始,所以任何能用 UTF-8 表示的輸入,最差情況都能退回成一串 byte token,不會出現傳統 `[UNK]` 直接丟掉原始拼寫的狀況。這也是 GPT-2 之後主流 tokenizer 的共同設計。

### Vocab size 是真實的工程 trade-off，不是越大越好

vocab 越大,同一段文字平均用掉的 token 數越少,序列變短、attention 運算量跟著降;但每多一個 token,就要在輸入 embedding 矩陣跟輸出 head 各多一列參數——GPT-2 small 的 embedding 矩陣佔了整個 1.24 億參數模型裡的 31%。實測也顯示這條曲線會變平:某次用 83,159 個真實詞訓練的實驗裡,merge 次數從 5,000 加到 10,000,在沒見過的句子上一個 token 都沒省下來,因為多出來的 merge 只是在記住訓練語料的怪癖,沒有學到能推廣的規則。

### 面試現場:先講正確性,再講效能

Naive 實作每次 merge 完都重新掃一遍全部語料算 pair 頻率,對小語料沒問題,但面試官幾乎一定會追問這段的時間複雜度,以及資料量變大時要怎麼優化(維護一個 pair 頻率的 heap,merge 後只增量更新受影響的 pair,而不是整個重算)。先確保 train／encode／decode 三個函式邏輯正確、能跑過邊界測試,再主動提這個優化方向,是比一開始就衝向進階實作更穩的順序。

```flow-diagram
{
  "title": "BPE 訓練迴圈：count → merge → repeat",
  "lang": "zh-TW",
  "width": 640,
  "height": 460,
  "nodes": [
    {"id": "init", "label": "初始化\n每個詞拆成最小符號序列\n（byte-level：0–255）", "x": 230, "y": 50, "w": 300, "h": 70},
    {"id": "count", "label": "統計相鄰 pair 頻率\n（依詞頻加權）", "x": 230, "y": 160, "w": 300, "h": 70},
    {"id": "merge", "label": "合併出現最多次的 pair\n記錄這條 merge 規則", "x": 230, "y": 270, "w": 300, "h": 70, "tone": "accent"},
    {"id": "stop", "label": "停止條件：vocab size 到門檻\n或 merge 次數到上限？", "x": 230, "y": 380, "w": 300, "h": 60}
  ],
  "edges": [
    {"from": "init", "to": "count", "step": 1},
    {"from": "count", "to": "merge", "step": 2},
    {"from": "merge", "to": "stop", "step": 3},
    {"from": "stop", "to": "count", "step": 4, "label": "未達門檻，\n回頭統計頻率", "via": [[420, 380], [420, 160]], "labelAt": [420, 320], "tone": "warn"}
  ],
  "steps": [
    "先把語料裡每個詞拆成最小符號序列；byte-level BPE 固定從 UTF-8 的 256 個 byte 值出發，保證任何輸入都有起始符號可用。",
    "統計整個語料裡所有相鄰符號 pair 的出現頻率，這一步用到的是詞頻加權後的全域統計，不是只看單一詞。",
    "把出現頻率最高的 pair 合併成一個新符號，並依照發現順序把這條 merge 規則記錄下來——這個順序之後 encode 階段要原樣重現。",
    "檢查是否達到 vocab size 門檻或 merge 次數上限；沒達到就回到統計頻率，繼續下一輪合併，直到停止條件成立。"
  ],
  "caption": "簡化示意：省略 tie-breaking 規則與正規化細節，重點是「train 時全域統計 + 依序記錄」跟「encode 時套用固定順序、不重新算頻率」兩段要分開。"
}
```

## 今日練習題

### 題目

手刻一個 Byte-Pair Encoding tokenizer：給一個小語料（字串清單）跟 merge 次數上限 `num_merges`，寫出 `train()` 學出 merge 規則與 vocab，並寫 `encode()` / `decode()`，讓任意輸入字串都能正確編碼成 token id 序列、再還原回原字串。不能呼叫 `tokenizers`、`tiktoken` 等現成函式庫。

**來源**：ML／NLP Engineer live coding round 常見題型，例如 Apple NLP Engineer 的技術面試會包含「Machine Learning Coding」環節，要求候選人現場實作 model 元件或演算法（而非呼叫高階函式庫 API），BPE 是其中代表性的題目之一；開源的 `ML-Interview-Prep` 題庫也把 BPE 列為核心 MLE coding 題目　**難度**：中等　**環節**：live coding phone screen 或 onsite ML coding round

### 拆解思路

1. **先釐清問題**：問清楚起始符號單位是 character 還是 byte（這決定能不能處理任意 Unicode 輸入而不報錯）、`num_merges` 是固定超參數還是要跑到 vocab size 到某個門檻才停、輸入語料是原始字串還是已經先做過空白分詞的詞清單，以及 encode 需不需要支援一次處理多筆字串（batch）。
2. **建立框架**：把問題拆成三個函式——`train()` 做「統計 pair 頻率 → 合併最高頻 pair → 記錄 merge 規則」的迴圈；`encode()` 從最小符號開始，依照 `train()` 記錄下來的 merge 優先順序逐一套用規則；`decode()` 把 token id 查表還原成符號再接起來。先把這三個函式的輸入輸出介面寫清楚，再動手寫迴圈本體。
3. **深入核心**：最容易被追問的兩個點——一是 encode 絕對不能重新統計頻率，必須完全照 train 時記錄的順序套用規則，否則同一句話在不同時間點會編碼出不同結果；二是 vocab size 跟序列長度的 trade-off，vocab 越大序列越短但 embedding 參數越多，而且這條壓縮收益曲線會隨 merge 次數增加而變平，不是無限往上疊就有用。
4. **收尾**：用一句話收斂——「BPE 是拿詞頻當訊號、貪婪合併相鄰 pair，藉此在 vocab 大小跟序列長度之間找一個資料驅動的平衡點」，再補一句生產環境考量：tokenizer 的版本（merge 規則表）必須跟推論／fine-tune 用的版本完全一致，版本一旦對不上，模型讀到的 token id 就會對應錯的 embedding row。

### 範例回答（面試時可以這樣講）

> **先確認介面跟邊界情況**：我會先問清楚起始符號是 byte 還是 character——如果要處理多語言輸入，byte-level 會比較保險，因為任何 UTF-8 字串最差都能退回成一串 byte token，不會因為沒見過某個字元就壞掉。我也會問 `num_merges` 怎麼決定，以及 encode 需不需要處理空字串、全新字元這類邊界情況。
>
> **核心演算法我會這樣寫**：`train()` 裡用一個 dict 存每個詞對應的符號序列，每一輪先掃過全部序列統計相鄰 pair 的加權頻率，取出頻率最高的 pair 合併，把這條規則依發現順序 append 進一個 list，重複到 `num_merges`。`encode()` 不會重新統計頻率，而是從最小符號開始,依照這個 merge list 的順序逐一檢查、套用規則，直到沒有規則可套用；`decode()` 就是查表把 token id 換回符號再串起來。我會特別寫測試驗證「encode 再 decode 一定能還原原字串」這個 round-trip 性質。
>
> **收尾我會談效能跟正確性**：目前這版 train 每次合併完都要重新掃一遍全部語料算頻率，對小語料沒問題，但資料量大時可以用一個 pair 頻率的 heap，合併後只增量更新受影響的 pair，不用整個重算。另外我會提醒一句生產環境的坑：merge 規則表要當成模型的一部分一起版本控管，推論跟 fine-tune 用的 tokenizer 版本一旦不一致，同一句話就會編碼出不同的 token，模型讀到的其實是錯的 embedding row。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚起始符號是 byte 還是 character，以及是否要處理任意 Unicode 輸入 | |
| 有把 train／encode／decode 三個函式的角色講清楚，並強調 encode 不重新統計頻率 | |
| 有講 encode 必須照訓練時記錄的 merge 順序套用，順序不一致會編碼出不同結果 | |
| 有講 vocab size 跟序列長度／embedding 參數量的 trade-off，而且收益曲線會變平 | |
| 有提到 tokenizer 版本要跟模型／fine-tune 資料綁在一起版本控管 | |
| 加分：有討論 naive 重算頻率 vs 用 heap 增量更新 pair 頻率的效能差異 | |

## 延伸閱讀

- [How does tokenization work, and why do LLMs usually rely on subword tokenizers such as BPE? — Sebastian Raschka](https://sebastianraschka.com/faq/docs/tokenization-bpe.html) — 把 train／encode 兩階段的區分、byte-level 如何避免 OOV 講得最清楚的一篇
- [Tokenization: BPE from Scratch, Vocab Size, and What Tokenizers Hide](https://dev.to/ali_82f3409ed625e8ba8515b/tokenization-bpe-from-scratch-vocab-size-and-what-tokenizers-hide-23mn) — 用 83,159 個真實詞實測 vocab size 收益曲線，附最小可讀的 BPE 訓練程式碼
- [GitHub：jyotipmahes/ML-Interview-Prep](https://github.com/jyotipmahes/ML-Interview-Prep) — 收錄 BPE、線性迴歸、2 層 MLP 等多個手刻 MLE coding 題目的開源題庫，可以拿來對照自己的實作

## 參考資料

- [How does tokenization work, and why do LLMs usually rely on subword tokenizers such as BPE? — Sebastian Raschka](https://sebastianraschka.com/faq/docs/tokenization-bpe.html) — 對應「Train 跟 encode 是兩個不同階段」與「Byte-level 起始符號表解決 OOV」兩節
- [Tokenization: BPE from Scratch, Vocab Size, and What Tokenizers Hide](https://dev.to/ali_82f3409ed625e8ba8515b/tokenization-bpe-from-scratch-vocab-size-and-what-tokenizers-hide-23mn) — 對應「Vocab size 是真實的工程 trade-off」一節的實測數字（GPT-2 embedding 佔比、5,000 merge 後收益變平）
- [GitHub：jyotipmahes/ML-Interview-Prep](https://github.com/jyotipmahes/ML-Interview-Prep) — 對應「今日練習題」的題型來源，repo 自述為 Machine Learning Engineer（MLE）interview 準備材料，`MLE_Coding_Interview_Guide.ipynb` 將 BPE 列為核心手刻題目之一
