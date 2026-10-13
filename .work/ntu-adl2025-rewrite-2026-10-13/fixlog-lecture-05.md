# 第 5 堂（Tokenization 與 BERT）修改紀錄

日期：2026-10-13。依 `rereview-lecture-05.md` 的「仍需修改」A–H 與任務的通用規則修改。

檔案：

- zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-bert-family.md`
- en：`src/content/posts/ai/2026-09-30-ntu-adl2025-bert-family-en.md`

每一項都先回來源確認報告的說法，再改。BPE 的三條合併路徑用腳本重算過，結果與報告相同。

## 已改

### A. SpanBERT 一列補上 NLI

- 依據：BERT Variants 第 32 頁文字層「Better for QA, NLI, coreference」。
- zh 改前：對問答與共指消解有幫助
- zh 改後：對問答、NLI 與共指消解有幫助
- en 改前：Helps question answering and coreference resolution
- en 改後：Helps question answering, NLI, and coreference resolution

### B. 自我檢查第 1 題答案

- 依據：腳本重算。合併 `s t` 後 `e st` 與 `st </w>` 並列 9 次；選 `e+st` 的合併序是 st、est、est</w>…，選 `st+</w>` 的合併序是 st、st</w>、est</w>…。兩條路九次合併後語料相同，詞表都是 20 個。
- zh 改前：不會。順序變成 `s+t → st`、`e+st → est`，之後完全相同，最後的語料一樣是……。差別只在詞表裡多的是 `st` 而不是 `es`。
- zh 改後：不會。合併 `s t` 之後，`e st` 和 `st </w>` 又並列 9 次；不管選哪一個，三步之後都得到 `est</w>`，之後完全相同，最後的語料一樣是 `low</w>`、`low e r </w>`、`newest</w>`、`w i d est</w>`。差別只在詞表裡的中間片段：例如選 `e+st` 時，多的是 `st` 而不是 `es`。
- en 改前：No. The order becomes `s+t → st`, `e+st → est`, and everything after is identical. … The only difference is that the vocabulary gains `st` instead of `es`.
- en 改後：No. After merging `s t`, the pairs `e st` and `st </w>` tie at 9 again; either choice reaches `est</w>` within three steps, and everything after is identical. The final corpus is the same: `low</w>`, `low e r </w>`, `newest</w>`, `w i d est</w>`. Only the intermediate pieces in the vocabulary differ: picking `e+st`, for example, gives `st` instead of `es`.

### C. 自我檢查第 5 題：word2vec 改成靜態詞向量，英文統一小寫 apple

- 依據：逐字稿 5.2 全文搜不到 word2vec，老師說的是 word embedding（[02:44]、[03:03]、[04:49]）；BERT 講義第 1–7 頁文字層也沒有 word2vec，第 3 頁標題是「Word Embedding Polysemy Issue」，例句公司義用小寫 apple。
- zh 題目改前：……word2vec 和 BERT 給「蘋果」的向量各有什麼不同？
- zh 題目改後：……靜態詞向量和 BERT 給「蘋果」的向量各有什麼不同？
- zh 答案改前：word2vec 兩句給的是同一個向量。
- zh 答案改後：靜態詞向量兩句給的是同一個向量。
- en 題目改前：For "Apple released a new phone" and "he ate an apple," how do the vectors that word2vec and BERT give to "apple" differ?
- en 題目改後：For "apple released a new phone" and "he ate an apple," how do the vectors that a static word embedding and BERT give to "apple" differ?
- en 答案改前：word2vec gives the same vector in both sentences.
- en 答案改後：A static word embedding gives the same vector in both sentences.

### D. 消融實驗第三點

- 依據：逐字稿 5.2 [42:17]–[42:19]「那在這三個 data 上面其實都還是比較差」，[42:22]–[42:34] SQuAD 變好；BERT 講義第 16 頁（讀圖）綠色柱在 MNLI 與黃色柱等高、QNLI 略低、MRPC 明顯更低，SQuAD 回升到約 85。
- zh 改前：老師說其他幾個資料集還是比較差。
- zh 改後：老師說另外三個資料集還是比較差；圖上這三個（MNLI、QNLI、MRPC）加了雙向 LSTM 之後持平或更低。
- en 改前：she adds that the other datasets remain worse.
- en 改後：she adds that the other three datasets remain worse; on the chart, MNLI, QNLI, and MRPC stay flat or drop after the BiLSTM is added.

### E. ELMo「把向量接起來」改成貼著逐字稿的說法（第 8 題答案與三模型對照表兩處）

- 依據：逐字稿 5.2 [22:13]「我們會拿 forward 跟 backward 這兩個 vector 一起進來」、[16:03]–[16:06]「這兩邊的資訊會在一起拿過來使用」。老師沒有說是串接。
- zh 第 8 題改前：各自只看一邊，用的時候把向量接起來。
- zh 第 8 題改後：各自只看一邊，用的時候把兩邊的向量一起拿來用。
- zh 對照表改前：每個模型只看一邊，用的時候把兩個向量接起來
- zh 對照表改後：每個模型只看一邊，用的時候把兩邊的向量一起拿來用
- en 第 8 題改前：that each see one side, and their vectors are concatenated at use time.
- en 第 8 題改後：that each see one side, and the vectors from both are used together.
- en 對照表改前：Each model sees one side, and the two vectors are concatenated when used
- en 對照表改後：Each model sees one side, and the vectors from both are used together
- 說明：報告只給第 8 題的建議文字，但點名對照表是同一個說法，所以兩處一起改，避免同一篇裡兩種寫法。

### F. 「BERT 的貢獻是換成 Transformer」補上對象

- 依據：逐字稿 5.2 [56:07]–[56:20]「利用 Transformer 來做這個 Model，來取代 ELMo 裡面的 LSTM……以及 Fine Tuning 的機制」；[20:24]–[20:46] GPT 在 BERT 之前就用 Transformer 做語言模型。
- zh 改前：BERT 的貢獻是換成 Transformer、用 masked LM 同時看兩邊，以及 fine-tuning 的用法。
- zh 改後：BERT 做的是把 ELMo 的 LSTM 換成 Transformer、用 masked LM 同時看兩邊，以及 fine-tuning 的用法。
- en 改前：BERT's contributions are the switch to a Transformer, the masked LM that sees both sides, and the use of fine-tuning.
- en 改後：What BERT did was replace ELMo's LSTM with a Transformer, use a masked LM that sees both sides, and fine-tune the whole model.

### G. 第一次合併的並列

- 依據：Tokenization 第 7 頁文字層只在 `e s`、`t </w>` 兩組標「seen 9 times／Choose One」；逐字稿 5.1 [12:07]–[12:23]；腳本重算 `e s`、`s t`、`t </w>` 都是 9 次。
- zh 改前：`s t` 和 `t </w>` 也是 9 次；
- zh 改後：`s t` 和 `t </w>` 也是 9 次（投影片只標出 `e s` 與 `t </w>` 兩組）；
- en 改前：`s t` and `t </w>` also appear 9 times;
- en 改後：`s t` and `t </w>` also appear 9 times (the slide marks only `e s` and `t </w>`);

### H. ERNIE 段的歸屬

- 依據：逐字稿 5.2 [53:08]–[53:19]「他的方法其實就跟 BERT 是一模一樣的，只是呢他是做在中文上面……中文上面是不是每一個 token 通常呢就是一個 character」；BERT 講義第 21 頁「BERT models local cooccurrence between tokens, while characters are modeled independently」。
- zh 改前：老師說 BERT 處理中文時通常一個字就是一個 token
- zh 改後：老師說，照 BERT 的做法處理中文，通常一個字就是一個 token
- en 改前：She says that when BERT handles Chinese, one character is usually one token
- en 改後：She says that when Chinese is handled the way BERT does it, one character is usually one token

### 任務通用規則（非報告項目）

- 英文版第一次提到講者點名。改前：The instructor uses the word "tokenization" itself。改後：Professor Yun-Nung Chen uses the word "tokenization" itself。之後的 she／her 不動。
- 英文版「Common misreadings」說明句。改前：These are my own summary of the lecture.。改後：This list is my own summary, not something the lecture enumerated point by point.
- 中文版搜「優化」與其他中國用語（質量、信息、視頻、默認、數據、網絡、算法、硬件、軟件、性能、代碼）：沒有出現，不需要改。
- 中文版搜 `**詞（說明）**` 後面直接接字的粗體：沒有出現，不需要改。

## 不改

| 項目 | 理由 | 依據 |
|---|---|---|
| 第一次報告建議 10：「詞表」與「詞彙表」統一 | 報告自己寫「不算違規」「由作者決定」，沒有給建議文字。同系列其他 ADL 中文導讀有 7 篇用「詞表」、0 篇用「詞彙表」，本篇的 glossary 定義也用「詞表」；只改這一篇會讓系列內用語不一致。這一項不屬於任務列的 (a)(b) 兩種例外，是我的判斷，要統一請另外指示 | `review-lecture-05.md` 第 77 行；`grep` 同系列 `2026-09-30-ntu-adl2025-*.md` |
| 複審「未驗證」各項（修改前後逐行差異、影片長度與上傳日期、課程頁連結失效、Sennrich 2016 與 UTF-8 補充） | 流程面或超出指定來源，報告沒有要求改字 | `rereview-lecture-05.md`「未驗證」一節 |
| `STATUS.md` 第 36 行已過時 | 不是文章內容，任務範圍只有兩篇文章 | `rereview-lecture-05.md` 第 170 行 |
| 複審「殘留的差異」第一條（zh「9 次並列最高」對 en「Three pairs tie at 9」） | 報告寫「不影響內容」，兩句都正確 | 腳本重算：三組並列 9 次 |

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)

沒有改 frontmatter 的 title、date、series，沒有改檔名，沒有 commit。
