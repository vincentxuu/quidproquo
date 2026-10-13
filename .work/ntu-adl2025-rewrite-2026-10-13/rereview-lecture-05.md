# 第 5 堂（Tokenization 與 BERT）複審報告

複審日期：2026-10-13。複審者未參與撰寫與第一次審查，只審不改。

## 受審版本

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-bert-family.md`（zh-TW） | `ce175cc5b8adef9080950ec8067f77b517b8cc8f10cc0fbd73ffd2f9f7ef5ba9` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-bert-family-en.md`（en） | `a9d460402f9fc7af8a8ce2c7ec569bd01fbd0d04b4ee0c1262cf15985271230d` |

兩個雜湊都與第一次報告記錄的不同，確認受審的是修改後的版本。

## 這次實際對過的來源

- 第一次報告 `review-lecture-05.md`：全文。
- 逐字稿 5.1：[09:00]–[12:57]、[23:01]–[28:59]。逐字稿 5.2：[11:00]–[32:58]、[41:00]–[42:58]、[52:00]–[57:01]。其餘段落這次沒有重讀。
- 講義轉圖讀過：Tokenization 第 7 頁；BERT 第 9、10、12、16、21 頁；BERT Variants 第 21、22、25、32 頁。
- 講義文字層讀過：Tokenization 第 4、5、22 頁；BERT 第 1–12、16、21 頁；BERT Variants 第 4–16、20–32 頁。
- BPE 用腳本重算三條路徑（投影片的順序、先選 `s t` 再選 `e+st`、先選 `s t` 再選 `st+</w>`）。

限制：我沒有修改前的檔案可以逐行比對，所以「作者改了哪些句子」是用第一次報告引用的原句與行號反推的。第一次報告沒有引用到的句子如果也被改過，我不會知道。

結論：三項必修都已正確修正，沒有引入事實錯誤。建議 1–5、9 已修正；建議 6、7、8 沒有動。下面「仍需修改」列的都是小範圍的改字，沒有一項是數字或公式錯誤。

---

## 仍需修改

依我認為的優先順序排列。A–C 建議改，D–H 可改可不改。

### A. SpanBERT 一列少了 NLI（第一次報告表格裡提過，未修）

- zh 第 276 行：「對問答與共指消解有幫助」
- en 第 275 行：「Helps question answering and coreference resolution」
- 依據：BERT Variants 第 32 頁（讀圖）寫的是「Better for QA, NLI, coreference」。第 269 行說這一節「內容依講義」，三項裡只列兩項。
- 建議文字：
  - zh：「對問答、NLI 與共指消解有幫助」
  - en：「Helps question answering, NLI, and coreference resolution」

### B. 自我檢查第 1 題的答案把並列的情況寫成只有一條路（建議 8，未修）

- zh 第 299 行：「順序變成 `s+t → st`、`e+st → est`，之後完全相同……差別只在詞表裡多的是 `st` 而不是 `es`。」
- en 第 298 行：「The order becomes `s+t → st`, `e+st → est`, and everything after is identical. … The only difference is that the vocabulary gains `st` instead of `es`.」
- 依據：腳本重算。合併 `s t` 之後，`e st` 與 `st </w>` 並列 9 次。選 `e+st` 時詞表多的是 `st`、`est`（與答案相符）；選 `st+</w>` 時多的是 `st`、`st</w>`，沒有 `est`。兩條路九次合併後四個詞的切法相同，詞表都是 20 個，所以「不會」這個結論成立，只是「差別只在 `st` 而不是 `es`」只對其中一條路成立。
- 建議文字：
  - zh：「不會。合併 `s t` 之後，`e st` 和 `st </w>` 又並列 9 次；不管選哪一個，三步之後都得到 `est</w>`，之後完全相同，最後的語料一樣是 `low</w>`、`low e r </w>`、`newest</w>`、`w i d est</w>`。差別只在詞表裡的中間片段：例如選 `e+st` 時，多的是 `st` 而不是 `es`。」
  - en：「No. After merging `s t`, the pairs `e st` and `st </w>` tie at 9 again; either choice reaches `est</w>` within three steps, and everything after is identical. The final corpus is the same: `low</w>`, `low e r </w>`, `newest</w>`, `w i d est</w>`. Only the intermediate pieces in the vocabulary differ: picking `e+st`, for example, gives `st` instead of `es`.」

### C. 自我檢查第 5 題：改寫後的題目可以作答，但有兩個小問題

- zh 第 313–315 行：「『蘋果發表了新手機』和『他吃了一顆蘋果』，word2vec 和 BERT 給『蘋果』的向量各有什麼不同？」
- en 第 312–314 行：「For "Apple released a new phone" and "he ate an apple," how do the vectors that word2vec and BERT give to "apple" differ?」
- 必修 2 本身已修正：兩句的上下文都明確，答案「一句指向公司、一句指向水果」可由題目推得，中英線索一致。
- 問題一（已對來源確認）：逐字稿 5.2 與 BERT 講義第 1–7 頁都沒有出現 word2vec，老師說的是「word embedding」，講義標題是「Word Embedding Polysemy Issue」，正文第 146 行用的也是「靜態詞向量」。題目自己多帶了一個課堂沒提的名詞。
- 問題二（我的判斷，不涉及來源）：英文版一句是大寫 Apple、一句是小寫 apple。詞表區分大小寫時，靜態詞向量給的是兩個不同的向量，答案「gives the same vector in both sentences」就不成立。講義第 3 頁的例句公司義也用小寫 apple。
- 建議文字：
  - zh 題目：「『蘋果發表了新手機』和『他吃了一顆蘋果』，靜態詞向量和 BERT 給『蘋果』的向量各有什麼不同？」答案開頭改成「靜態詞向量兩句給的是同一個向量。」
  - en 題目：「For "apple released a new phone" and "he ate an apple," how do the vectors that a static word embedding and BERT give to "apple" differ?」答案開頭改成「A static word embedding gives the same vector in both sentences.」

### D. 消融實驗第三點：「其他幾個」可以寫得和來源一樣精確（建議 3，已修，可再精確）

- zh 第 237 行：「老師說其他幾個資料集還是比較差。」
- en 第 236 行：「she adds that the other datasets remain worse.」
- 依據：逐字稿 5.2 [42:17]–[42:19]「那在這三個 data 上面其實都還是比較差」；講義第 16 頁（讀圖）加 BiLSTM 的綠色柱在 MNLI 與黃色柱等高、QNLI 略低、MRPC 明顯更低，只有 SQuAD 回升到約 85。目前的寫法沒有錯，也沒有說得比來源重；「比較差」沒說是跟誰比，讀者可能讀成「比 BERT 差」，那樣就和前半句重複。
- 建議文字：
  - zh：「老師說另外三個資料集還是比較差；圖上這三個（MNLI、QNLI、MRPC）加了雙向 LSTM 之後持平或更低。」
  - en：「she adds that the other three datasets remain worse; on the chart, MNLI, QNLI, and MRPC stay flat or drop after the BiLSTM is added.」

### E. 新增的第 8 題：「把向量接起來」比逐字稿具體

- zh 第 327 行：「各自只看一邊，用的時候把向量接起來。」
- en 第 326 行：「their vectors are concatenated at use time.」
- 同樣的說法在對照表 zh 第 176 行／en 第 175 行，第一次審查已放行。
- 依據：逐字稿 5.2 [22:11]–[22:13]「我們會拿 forward 跟 backward 這兩個 vector 一起進來」，[16:03]–[16:08]「這兩邊的資訊會在一起拿過來使用」。老師沒有說是串接；講義第 9 頁的 ELMo 圖只畫出兩組 LSTM 的輸出都連到上面，沒有標示運算方式。就 ELMo 論文而言串接是對的（這是我的背景知識，沒有用本次來源驗證）。
- 要不要改：可以不改。要完全貼著來源的話：
  - zh：「各自只看一邊，用的時候把兩邊的向量一起拿來用。」
  - en：「and the vectors from both are used together.」

### F. 「BERT 的貢獻是換成 Transformer」（建議 7，未修）

- zh 第 289 行：「BERT 的貢獻是換成 Transformer、用 masked LM 同時看兩邊，以及 fine-tuning 的用法。」
- en 第 288 行：「BERT's contributions are the switch to a Transformer, the masked LM that sees both sides, and the use of fine-tuning.」
- 依據：逐字稿 5.2 [56:07]–[56:20] 老師的總結是「利用 Transformer 來做這個 Model，來取代 ELMo 裡面的 LSTM，那他當然有提出一些比較特別的，像是 masked language model、next sentence prediction 以及 fine-tuning 的機制」；[20:24]–[20:46] 老師也提到 GPT 在 BERT 之前就用 Transformer 做語言模型。這一條段首已標明是本文整理，前一句又剛提到 TagLM、ELMo，讀成「相對於 ELMo」說得通。
- 要不要改：可以不改。改的話照老師的說法補上對象：
  - zh：「BERT 做的是把 ELMo 的 LSTM 換成 Transformer、用 masked LM 同時看兩邊，以及 fine-tuning 的用法。」
  - en：「What BERT did was replace ELMo's LSTM with a Transformer, use a masked LM that sees both sides, and fine-tune the whole model.」

### G. 第一次合併的三組並列（建議 6，未修）

- zh 第 90 行：「`s t` 和 `t </w>` 也是 9 次；`l o` 是 7 次。9 次並列最高，任選一個。」
- en 第 89 行：「`s t` and `t </w>` also appear 9 times; `l o` appears 7 times. Three pairs tie at 9, and any may be chosen.」
- 依據：講義第 7 頁（讀圖）只標 `e s`（9）、`t </w>`（9）兩組讓人「Choose One」，另標 `o w` 7 次。逐字稿 5.1 [12:07]–[12:23] 老師念的是 `o w` 7 次、`e s` 9 次、`t </w>` 9 次、`l o` 7 次，並說「這兩個都 9 次」。腳本重算：`e s`、`s t`、`t </w>` 確實都是 9 次。文章的數字是對的，`s t` 是本文補算的，而且自我檢查第 1 題要用到它。
- 要不要改：可以不改。改的話加半句：
  - zh：在「`s t` 和 `t </w>` 也是 9 次」後面加「（投影片只標出 `e s` 與 `t </w>` 兩組）」。
  - en：在「also appear 9 times」後面加「(the slide marks only `e s` and `t </w>`)」。

### H. ERNIE 段的「老師說」歸屬

- zh 第 263 行：「老師說 BERT 處理中文時通常一個字就是一個 token」
- en 第 262 行：「She says that when BERT handles Chinese, one character is usually one token」
- 依據：逐字稿 5.2 [53:08]–[53:19] 老師說的是「他的方法其實就跟 BERT 是一模一樣的，只是呢他是做在中文上面……中文上面是不是每一個 token 通常呢就是一個 character」。「BERT」這個主詞來自講義第 21 頁的「BERT models local cooccurrence between tokens, while characters are modeled independently」。兩個來源合起來支持這句話，內容沒有說得比來源重，只是老師口頭沒有直接說「BERT 處理中文時」。
- 要不要改：可以不改。要分開歸屬的話：
  - zh：「老師說，照 BERT 的做法處理中文，通常一個字就是一個 token」
  - en：「She says that when Chinese is handled the way BERT does it, one character is usually one token」

---

## 已確認修正正確

以下每一項都回到來源對過。

### 必修

| 項目 | 目前的文字（行號） | 依據 | 判定 |
|---|---|---|---|
| 必修 1：ERNIE 與「常見的誤解」矛盾 | zh 263「BERT 處理中文時通常一個字就是一個 token」；en 262「one character is usually one token」。zh 288／en 287 誤解一條同步寫成「BERT 處理中文時通常是這樣，但前半堂看到的多語 BPE 裡，一個中文字可能被切成好幾個 token」 | 5.2 [53:16]–[53:37]；講義 BERT 第 21 頁（讀圖）；5.1 [24:10]–[24:12]「做」切成三個 token | 已正確修正，兩處不再矛盾。歸屬的細節見上面 H |
| 必修 2：第 5 題答案無判準 | zh 313–315、en 312–314 換成「蘋果發表了新手機／他吃了一顆蘋果」 | 不涉及來源；兩句各自的上下文足以判斷 | 已正確修正。殘留的小問題見上面 C |
| 必修 3：RoBERTa 一列 | zh 275「動態遮罩、學習率與 warmup 分開調、batch 加大到 8K、只用完整長度的序列、更多資料」；en 274 相同 | Variants 第 21 頁（讀圖）：Dynamic masking、peak learning-rate & #warmup-steps tuned separately、large batch (batch size=8K)；第 22 頁（讀圖）：train only with full-length sequences，資料 16G＋76G＋38G＋31G，表中 RoBERTa 160GB 對 BERT-Large 13GB | 已正確修正。「架構不變」「訓練更久」都已拿掉，五項全部在講義上 |
| 必修 3：SpanBERT 一列 | zh 276「遮連續的一段、每次只放單一段文字訓練、用邊界的表示預測整段」；en 275 相同 | Variants 第 25 頁（讀圖）：Span masking、a single contiguous segment of text for each training sample (instead of two)、predict the entire masked span using only the span's boundary；圖上 SBO 用的是邊界位置的 x4、x9 | 已正確修正。「拿掉 NSP」已拿掉。少列 NLI 見上面 A |

RoBERTa 一列的一個說明：講義的「tuned separately」中文寫成「分開調」是照字面翻，省略了 peak 與 steps 兩個字，沒有加重。

### 建議

| 項目 | 目前的文字（行號） | 依據 | 判定 |
|---|---|---|---|
| 建議 1：NSP 例句補 birds | zh 185／en 184「penguins are flightless birds」 | 講義 BERT 第 10 頁（讀圖）：「penguin [MASK] are flight ##less birds」 | 已正確修正 |
| 建議 2：ERNIE 遮罩例句 | zh 263 加上「這是本文簡化的寫法，講義的圖在同一句裡遮了好幾個字」；en 262「this is simplified for this post, and the figure on the slide masks several characters in the same sentence」 | 講義 BERT 第 21 頁（讀圖）：「Learned by BERT」一側同一句遮了四格，預測「尔、黑、国、雪」 | 已正確修正，說明與圖相符 |
| 建議 3：消融第三點補其他資料集 | zh 237／en 236 | 5.2 [42:17]–[42:34]；講義第 16 頁（讀圖） | 已修正，沒有說得比來源重。可再精確，見上面 D |
| 建議 4：「成正比」 | zh 138「同樣的內容切出來的 token 越多，成本越高」；en 137「the more tokens the same content is split into, the more it costs」 | 5.1 [26:27]–[26:30]「token 如果越多的話，training 的 cost 其實是越多的」 | 已正確修正。兩個檔案都搜不到「成正比／proportional」 |
| 建議 5：tldr「最常用」 | zh 11「常用的切法是 BPE」；en 11「a common way to build them is BPE」 | 講義 Tokenization 第 22 頁：「a commonly used method」 | 已正確修正。兩個檔案都搜不到「最常用／most common」 |
| 建議 9：補題目 | 新增第 7、8 題 | 見下一節 | 已補，兩題都有來源依據 |

### 新增與改寫的句子

| 句子（zh 行號） | 依據 | 判定 |
|---|---|---|
| 第 7 題答案：「兩句之間用 `[SEP]` 隔開」（323） | 5.2 [24:52]–[24:55]、[25:47]；講義第 10、12 頁（讀圖） | 有依據 |
| 第 7 題答案：「每個位置另外加上 segment embedding 標示屬於第一句還是第二句」（323） | 5.2 [27:08]–[27:26]；講義第 12 頁（讀圖）A×6、B×5 | 有依據 |
| 第 7 題答案：「用 `[CLS]` 位置的輸出向量，接一層全連接層做二元分類」（323） | 5.2 [26:05]–[26:17]「fully connected layer，然後再加上 softmax 做一個 binary 的 prediction」、[31:14]–[31:21] | 有依據 |
| 第 8 題答案：「ELMo 用 LSTM，正向和反向是分開的兩個模型，各自只看一邊」（327） | 5.2 [15:52]–[16:11]、[21:57]–[22:05]；講義第 9 頁（讀圖）ELMo 是兩組各自獨立的 LSTM | 有依據 |
| 第 8 題答案：「用的時候把向量接起來」（327） | 5.2 [22:11]–[22:13] 只說「一起進來」 | 比逐字稿具體，見上面 E |
| 第 8 題答案：「BERT 用 Transformer 的 encoder，靠遮住 token 再填回來的方式訓練，同一個模型同時看左右兩邊」（327） | 5.2 [13:17]–[13:22]、[16:14]–[16:53]、[56:39]–[56:47] | 有依據 |
| 誤解一條：「BERT 處理中文時通常是這樣」（288） | 同必修 1 | 有依據 |

這次順帶重看、與修改無關但落在指定範圍內的句子：

| 句子（zh 行號） | 依據 | 判定 |
|---|---|---|
| 「老師說它和 byte 其實沒什麼關係」（69） | 5.1 [09:33]「它其實跟 byte 沒有什麼太大的關係」 | 相符 |
| 「投影片沒有列出處」（75） | Tokenization 第 5 頁文字層只有 demo 影片連結，沒有論文引用 | 相符 |
| 「講義的例子」兩組句子（182–185） | 講義 BERT 第 10 頁（讀圖） | 相符。投影片上的句子帶著 `[MASK]`，文章寫的是還原後的句子 |
| 輸入表格（191–195） | 講義 BERT 第 12 頁（讀圖），11 格逐格相符 | 相符 |
| 「老師補充，這個數字沒有理論根據」（170） | 5.2 [19:35]–[19:49] | 相符 |
| 「老師說這是 BERT 另一個特別的地方」（218） | 5.2 [32:26]–[32:32] | 相符 |
| 「老師笑說全名……湊得有點勉強」（261） | 5.2 [52:39]–[53:03] | 相符。「笑說」的語氣無法從逐字稿確認 |
| 「只遮其中一個字太容易猜……ERNIE 的做法是：屬於同一個詞的字，要遮就一起遮」（263） | 5.2 [53:37]–[54:29] | 相符 |
| BERT 家族表格其餘四列（273、274、277、278） | Variants 第 5、6、8 頁；第 14–16 頁；第 28 頁；第 30、32 頁（文字層） | 相符 |
| 「內容依講義，沒有對照影片口述」（269） | 修改後 RoBERTa、SpanBERT 兩列都對得上講義 | 現在成立 |

### 中英一致

修改處逐一比對過：tldr、token 成本（zh 138／en 137）、NSP 例句、消融第三點、ERNIE 段、RoBERTa 與 SpanBERT 兩列、誤解第三條、自我檢查第 5、7、8 題。中英內容一致，沒有只改一邊的地方。

殘留的差異：

- zh 第 90 行「9 次並列最高」，en 第 89 行「Three pairs tie at 9」。第一次報告已記錄，不影響內容。
- 第 5 題英文有大小寫之分，中文沒有對應。見上面 C。
- en 第 359 行已是「verified against the video transcript」，`STATUS.md` 第 36 行記的「第 5 堂英文版仍是 verified against the video，待統一」已經過時。

### 自編例子與自我檢查的數字

| 項目 | 文章 | 重算 |
|---|---|---|
| 「算一下」（zh 203） | 11 個位置 × 15% ≈ 1 到 2 個；兩個 MLM 預測加一個 NSP，共三個訊號 | 11 × 0.15 = 1.65；2＋1 = 3。正確 |
| 第一次合併的次數（zh 90） | `e s`、`s t`、`t </w>` 各 9 次，`l o` 7 次 | 腳本結果相同（另外 `w e` 8 次、`o w` 7 次） |
| 九次合併、詞表 20 個、最後的語料（zh 95–106） | — | 腳本照投影片的選法重算，結果相同 |
| 第 1 題 | 切法不變 | 兩條後續路徑最後的語料都相同；答案的措辭見上面 B |
| 第 2 題 | newer → `new` `e` `r` `</w>` | 三條路徑的規則都得到同一結果 |
| 第 3 題 | 40 × 15% = 6 | 正確 |
| 第 6 題 | 96.4 對 96.1 | 與 zh 254–255 的表格一致（講義第 20 頁這次沒有重新讀圖，沿用第一次審查的確認） |
| 第 7 題 | `[SEP]`、segment、`[CLS]`、二元分類 | 與 zh 189、198、201 一致 |
| 第 8 題 | 兩個模型各看一邊；encoder、兩邊都看 | 與 zh 161、163、176 一致 |
| 字元數 | 51、27 | 自己數過，相同 |

新增的兩題沒有引入新的數字。

---

## 未驗證

- **修改前後的逐行差異。** 沒有修改前的檔案，無法確認第一次報告沒引用到的句子有沒有被改過。
- **第一次報告「無誤確認」裡這次沒有重看的項目。** 包括 Tokenization 第 2、3、16–21 頁的內容、GPT-3 tokenizer 的 14／29 個 token、NER 的四個分數與 Flair 93.09（講義第 17 頁）、模型大小曲線（第 18 頁）、分層分數的七個數字（第 20 頁）、TagLM 與 ELMo 的年份與說明（第 5、6 頁）。這些段落第一次報告沒有要求修改，我沒有理由認為作者動過，但沒有重新對過。
- **影片長度與上傳日期。** 5.1 的 33:37、5.2 的 57:29、5.3–5.6 各支的長度、「2023 年 10 月上傳」「2023/10/12 上傳」都不在逐字稿或講義裡。
- **「課程頁上 Fall 2025 的連結失效」、Transformer-XL「影片：無」。** 需要連到課程頁才能確認，不在指定來源內。
- **Sennrich et al. 2016 與 UTF-8 位元組的補充**（zh 75、136）。文章已標明不是講義內容，我沒有另外查證。
- **建議 10「詞表」與「詞彙表」的用語統一。** 這次沒有重新計數，中文版仍然用「詞表」，由作者決定。
- **第 5 題大小寫的影響**（上面 C 的問題二）與 **ELMo 串接向量**（上面 E）是我的背景知識，沒有用本次來源驗證。
