# 第 4 堂（Attention 與 Transformer）修稿紀錄

依據：`review2-lecture-04.md`。檔案：zh = `src/content/posts/ai/2026-09-30-ntu-adl2025-attention-transformer.md`，en = 同名 `-en.md`。
報告共必修 2 項、建議 9 項，全部已改；另依任務規則多改 2 處。沒有不改的項目。

## 必修

### 必修 1：「前 9 頁是複習」— 已改
- 依據：Transformer 講義第 3–5 頁是 Representations of Variable Length Data／RNN／CNN，第 6–9 頁才是 Attention、Basic Attention、Dot-Product Attention、Dot-Product Attention in Matrix（pdftotext 逐頁確認）。
- zh 前：「但 Transformer 講義的前 9 頁就是 Attention 講義的複習，所以本篇合起來讀。」
- zh 後：「但 Transformer 講義第 6–9 頁先複習 Attention 講義的翻譯 attention 與 dot-product attention，所以本篇合起來讀。」
- en 前："but the first nine pages of the Transformer deck review the Attention deck, so this post reads them together."
- en 後："but pages 6–9 of the Transformer deck review the translation attention and dot-product attention from the Attention deck, so this post reads them together."

### 必修 2：self-attention 的 key 範圍 — 已改
- 依據：Transformer 第 16 頁有 k¹ = W^k a¹ 與 α₁,₁；第 21 頁矩陣 A 含對角線（讀圖確認）；4.2 字幕 06:01「其他的字全部都是我的 key」、09:01「他自己要當成 key……a1 自己要有這個 key 的這個 vector」。
- zh 前：「讓輸入裡的每個詞都當一次 query，其他所有詞當 key」
- zh 後：「讓輸入裡的每個詞都當一次 query，所有詞（包括它自己）當 key」
- en 前："with all words as keys,"
- en 後："with all words, itself included, as keys,"

## 建議

### 建議 1：矩陣式缺維度 — 已改
- 依據：Attention 第 12 頁（讀圖）：[|Q|×d_k]×[d_k×|K|]×[|K|×d_v] = [|Q|×d_v]。
- zh：在「先算 QKᵀ，每一列做 softmax，再乘上 V。」後加「Q 是 |Q|×d_k、Kᵀ 是 d_k×|K|、V 是 |K|×d_v，結果是 |Q|×d_v，每個 query 得到一個 d_v 維的輸出。」
- en：在 "take QKᵀ, softmax each row, multiply by V." 後加 "Q is |Q|×d_k, Kᵀ is d_k×|K|, V is |K|×d_v, and the result is |Q|×d_v: one d_v-dimensional output per query."

### 建議 2：KᵀQ 的 softmax 方向 — 已改
- 依據：Transformer 第 21 頁（讀圖）A 與 A′ 的第一行是 α₁,₁…α₁,₄，即 q¹ 的分數；第 16 頁 softmax 對 α₁,ᵢ 的 i 做。Attention 第 12 頁標 "softmax row-wise"。
- zh：括號句尾加「這種排法下 softmax 沿著每一行（每個 query）做，和第 12 頁 QKᵀ 的逐列 softmax 是同一件事。」
- en：括號句尾加 "In this layout the softmax runs down each column (one per query), which is the same thing as the row-wise softmax of QKᵀ on slide 12."

### 建議 3：「每一維」不是講義原文 — 已改（兩處）
- 依據：Transformer 第 42 頁原文 "q and k are random variables with mean 0 and variance 1 → qᵀk has mean 0 and variance d_k"。
- zh 前（Scaled dot-product）：「假設 q 和 k 的每一維平均 0、變異數 1，qᵀk 的變異數就是 d_k。」
- zh 後：「講義寫 q、k 是平均 0、變異數 1 的隨機變數；把它讀成每一維各自獨立（本文的解讀），qᵀk 的變異數就是 d_k。」
- zh 前（自我檢查動手題）：「這才符合講義「q、k 每一維平均 0、變異數 1」的假設。」
- zh 後：「這才符合講義「q、k 是平均 0、變異數 1 的隨機變數」的假設，以及本文把它讀成各維獨立的解讀。」
- en 前："If each dimension of q and k has mean 0 and variance 1, then qᵀk has variance d_k."
- en 後："The slide says q and k are random variables with mean 0 and variance 1; reading that as independent per dimension (this post's reading), qᵀk has variance d_k."
- en 前："to match the deck's assumption that each dimension of q and k has mean 0 and variance 1."
- en 後："to match the deck's assumption that q and k are random variables with mean 0 and variance 1, together with this post's reading of it as independent per dimension."

### 建議 4：head 那句說得比來源重 — 已改
- 依據：4.2 字幕 24:00「當然就是期待 model 可以自己學到啦，要怎麼控制它學的不同的 head 真的不一樣，這邊其實也沒有多做著墨」。
- zh 前：「老師也提醒，原論文沒有機制保證各個 head 真的學到不同的東西。」
- zh 後：「老師也說，怎麼確保各個 head 真的學到不同的東西，這裡沒有多做著墨，只能期待模型自己學到。」
- en 前："She also notes that the original paper has no mechanism guaranteeing that the heads learn different things."
- en 後："Chen also says that how to make sure the heads really learn different things is not elaborated on; the hope is that the model learns it by itself."

### 建議 5：單一 query 式子 — 已改
- 依據：Attention 第 11 頁（讀圖）A(q,K,V) = Σᵢ [exp(q·kᵢ)/Σⱼ exp(q·kⱼ)] vᵢ。
- 中英前：`A(q, K, V) = Σᵢ softmax(q · kᵢ) vᵢ`
- 中英後：`A(q, K, V) = Σᵢ [exp(q·kᵢ) / Σⱼ exp(q·kⱼ)] vᵢ`

### 建議 6：自我檢查編號「3b」— 已改
- 中英都重編為 1–7（原 3b→4、4→5、5→6、6→7）。正文沒有其他地方引用題號。

### 建議 7：英文版小問題 — 已改（三處）
- 行首多餘空白：" Slide 52 plots" → "Slide 52 plots"。
- "and that current LLMs do not seem to use this version either." → "and that current LLMs no longer seem to use this version."（依據：4.2 字幕 21:01「現在的這個 LM 裡面的好像用的也不是這一個」）
- 英文句中的「」：`Translating 「深度學習」,` → `Translating "深度學習",`；`the positions of 「學」 and 「習」.` → `the positions of "學" and "習".`

### 建議 8：「影片最後」不精確 — 已改
- 依據：4.2 字幕 21:01 段中「最後這邊快速的幫大家 summarize 一下」，之後還有訓練技巧、實驗結果與 24:00 的總結。
- zh 前：「影片最後把三種 attention 整理成一句話」→ 後：「影片接近結尾時把三種 attention 整理成一句話」
- en 前："The video wraps up the three kinds of attention in one sentence:" → 後："Near the end of the video, Chen sums up the three kinds of attention in one sentence:"

### 建議 9：延伸閱讀連結文字 — 已改（僅 zh）
- 依據：站內 `2026-08-22-cs224n-transformers.md` 的 title 是「從 recurrence 到 Transformer｜Stanford CS224N 第 5 堂」。
- zh 前：`[CS224N Transformers](...)` → 後：`[CS224N 第 5 堂：從 recurrence 到 Transformer](...)`。en 依報告不動。

## 任務規則另外要求的修改（報告未列）

- 英文版首次提到講者：`In the [4.1 video](...) Chen says` → `Professor Chen says`。
- 英文版「Common misreadings」說明句："These are my own summary of the lecture." → "This list is my own summary, not something the lecture enumerated point by point."

## 檢查過、不需要改的規則

- 「優化」與其他中國用語：zh 全文 grep（優化、質量、信息、默認、視頻、網絡、數據、算法）沒有命中。
- 粗體 `**詞（說明）**` 後直接接中文字：沒有這種寫法（唯一的 `**…）**` 在版本說明，後面接空白）。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：0 issue(s)
