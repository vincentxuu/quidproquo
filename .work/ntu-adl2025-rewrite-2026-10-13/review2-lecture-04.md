本次未寫入 `.work/ntu-adl2025-rewrite-2026-10-13/review2-lecture-04.md`：執行環境規定子代理不得寫報告檔，完整報告改放在下方回傳。文章檔案未改動。

使用者問的四項未套用建議（σ、SimCSE、Dual supervised learning、自我檢查第 1、7 題），都不在第 4 堂這篇裡（本篇沒有 SimCSE 與 dual supervised learning，自我檢查也沒有第 7 題），所以這份審查無法回答「為何沒套用」。

**摘要：必修 2 項、建議 9 項。** 公式、維度、頁碼、自編算例與自我檢查答案都對過來源或重算，無誤。

- zh = `src/content/posts/ai/2026-09-30-ntu-adl2025-attention-transformer.md`
- en = `src/content/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en.md`

## 必修

**1. 「前 9 頁是複習」與來源不符（zh L35／en L34）**
- 原句：「Transformer 講義的前 9 頁就是 Attention 講義的複習」／"the first nine pages of the Transformer deck review the Attention deck"。
- 依據：Transformer 講義第 3–5 頁是 RNN／CNN 比較，Attention 講義沒有這三頁；文章自己在 zh L94 也把它當新內容引用。真正的複習是第 6–9 頁（第 7–9 頁對應 Attention 第 10–12 頁）。
- 建議 zh：「Transformer 講義第 6–9 頁先複習 Attention 講義的翻譯 attention 與 dot-product attention，所以本篇合起來讀。」
- 建議 en："pages 6–9 of the Transformer deck review the translation attention and dot-product attention from the Attention deck, so this post reads them together."

**2. self-attention 的 key 範圍寫錯，且中英不一致（zh L107／en L106）**
- 原句 zh：「每個詞都當一次 query，其他所有詞當 key」；en 寫 "with all words as keys"。
- 依據：Transformer 第 16 頁加上 k¹ = W^k a¹ 與 α₁,₁，第 21 頁的矩陣含對角線。4.2 字幕 06:01 先說「其他的字全部都是我的 key」，09:01 補「a1 自己也要當成 key」。zh 只寫了前半句，也和自己手算裡的 a¹·a¹ = 1 矛盾。
- 建議 zh：「讓輸入裡的每個詞都當一次 query，所有詞（包括它自己）當 key。」
- 建議 en：保留 "with all words as keys"，補成 "with all words, itself included, as keys"。

## 建議

1. **矩陣式缺維度（zh L78／en L77）**：Attention 第 12 頁有 [|Q|×d_k]×[d_k×|K|]×[|K|×d_v] = [|Q|×d_v]，文章沒寫。
   - zh：「Q 是 |Q|×d_k、Kᵀ 是 d_k×|K|、V 是 |K|×d_v，結果是 |Q|×d_v，每個 query 得到一個 d_v 維的輸出。」
   - en："Q is |Q|×d_k, Kᵀ is d_k×|K|, V is |K|×d_v, and the result is |Q|×d_v: one d_v-dimensional output per query."
2. **KᵀQ 的說明少了 softmax 方向（zh L122／en L121）**：第 21 頁的 A 每一行對應一個 query，softmax 是沿著行做；第 12 頁的 QKᵀ 是 row-wise。
   - zh：「這種排法下 softmax 沿著每一行（每個 query）做，和第 12 頁 QKᵀ 的逐列 softmax 是同一件事。」
   - en："In this layout the softmax runs down each column (one per query), which is the same thing as the row-wise softmax of QKᵀ on slide 12."
3. **「每一維」不是講義原文（zh L152、L255／en L151、L254）**：第 42 頁只寫 "q and k are random variables with mean 0 and variance 1"。「每一維、彼此獨立」是本文的解讀（數學上正確），L255 卻用引號寫成講義的話。
   - zh：「講義寫 q、k 是平均 0、變異數 1 的隨機變數；把它讀成每一維各自獨立（本文的解讀），qᵀk 的變異數就是 d_k。」
   - en："The slide says q and k are random variables with mean 0 and variance 1; reading that as independent per dimension (this post's reading), qᵀk has variance d_k."
4. **head 那句說得比來源重（zh L222／en L221）**：字幕 24:00 是「要怎麼控制它學的不同的 head 真的不一樣，這邊其實也沒有多做著墨」，不是「沒有機制保證」。
   - zh：「老師也說，怎麼確保各個 head 真的學到不同的東西，這裡沒有多做著墨，只能期待模型自己學到。」
   - en："Chen also says that how to make sure the heads really learn different things is not elaborated on; the hope is that the model learns it by itself."
5. **單一 query 式子的寫法（zh L74／en L73）**：`softmax(q · kᵢ)` 是簡寫，第 11 頁是 exp(q·kᵢ)/Σⱼexp(q·kⱼ)。
   - zh：改成「A(q, K, V) = Σᵢ [exp(q·kᵢ) / Σⱼ exp(q·kⱼ)] vᵢ」。
   - en：同式。
6. **自我檢查編號「3b」（zh L241／en L240）**：建議重編為 1–7。
7. **英文版小問題**：
   - en L204 行首多一個空白。
   - 同行 "do not seem to use this version either" 的 either 是「也」的硬譯，建議改 "current LLMs no longer seem to use this version"。
   - en L228、L230 在英文句中用「」，建議改成 "深度學習"、"學" and "習"。
8. **「影片最後」不精確（zh L170／en L169）**：三種 attention 的整理在 4.2 約 21:01–22:00，之後還有訓練技巧與實驗。
   - zh：「影片接近結尾時」。
   - en："Near the end of the video"。
9. **延伸閱讀連結文字中英不一（zh L259／en L258，來源外）**：zh 寫「CS224N Transformers」，en 寫 "CS224N Lecture 5: From Recurrence to the Transformer"；站內該篇 zh 標題是「從 recurrence 到 Transformer｜Stanford CS224N 第 5 堂」，建議 zh 改成「CS224N 第 5 堂：從 recurrence 到 Transformer」，en 不動。

## 無誤確認

**實際對過講義圖片或文字**
- Attention 講義：
  - 第 2–3 頁內容；第 4 頁的「深度學習 → deep learning <END>」。
  - 第 5 頁三種 match；第 6、8 頁權重 0.5/0.5/0/0 與 c⁰、c¹；第 9 頁 <END>；第 10 頁 query／key／value。
  - 第 11 頁 d_k、d_v；第 12 頁 softmax(QKᵀ)V、row-wise。
  - 第 14 頁 LAS；第 20 頁 "A large white bird"；第 26 頁 hop 順序（Greg is a frog 0.76 → Brian is a frog 0.98 → Brian is yellow 1.00）；第 27 頁 CoQA／QuAC。
  - 頁數 28。
- Transformer 講義：
  - 第 4–5 頁 RNN／CNN 表；第 11、12 頁；第 15–17 頁 q／k／v 與 b¹；第 18 頁 parallel；第 21–23 頁 A = KᵀQ、O = VA′、三個待學參數、箭頭。
  - 第 28–34 頁 kicked 例子與三個 head 的指向；第 35–37 頁 2 heads 與 W^O；第 41 頁。
  - 第 42 頁 √d_k（圖片確認有根號）；第 44 頁 encoder block 與 LayerNorm(x + sublayer(x))。
  - 第 45–49 頁四個條件與三種做法；第 50 頁分母確實印成 100000，四項都打勾；第 52 頁 symmetrical／decay；第 55 頁六項技巧；第 56–57 頁。
  - 頁數 58。

**實際對過字幕**
- 4.1：早餐／十年前暑假／什麼是深度學習；向量被稀釋與每步再餵；deep 看「深度」、learning 看「學習」；key 與 value 可不同（第三層的例子）；how 與靜音；長頸鹿被說成白鳥與可解釋性；Greg 三次 hop。
- 4.2：法國／法語；RNN 難平行；self-attention 的動機；「只知道高或低，不是哪一類型」；mask 的理由；1-2-3 與 3-2-1 結果相同；256／512；循環的波；LLM 好像不是用這個；三種 attention 的 Q／K／V 來源；剛提出時難訓練、套件已包好；效果相近而成本較低；位置向量相加較常見、也有串接。
- 文中歸給老師的說法，除建議 4 外都找得到。

**自己重算**
- 手算例：b¹ ≈ (0.845, 0.578)、b² ≈ (0.578, 0.845)、b³ ≈ (0.788, 0.788)，權重 0.4223／0.1554／0.4223，總和 6.437；換順序後 b¹ 不變。
- 縮放例：softmax(8,0,0) ≈ (0.9993, 0.0003, 0.0003)；softmax(1,0,0) ≈ (0.576, 0.212, 0.212)。
- 位置編碼表 d = 4 三列數值正確。
- 自我檢查：
  - 第 1 題對第 8 頁；第 2 題 (0.212, 0.212, 0.576)；第 3、3b、4 題可由正文推得。
  - 第 5 題標準差 4 → 16，為 4 倍。
  - 第 6 題模擬：不縮放時每列最大權重平均 0.74（d=8）、0.92（d=64）、0.97（d=512）；縮放後約 0.51，不隨 d 變。q = k 的補充說明也正確。

**其他檢查項**
- 契約：學習目標（zh L37）、機制、完整範例（條件、計算、結果、意義俱全）、常見誤解、附答案的自我檢查都齊備；自編處都有標示；常見誤解開頭寫明「我依課堂內容整理」，沒有冒充老師；標題中英都合格式。
- 查核歷程只出現在文末「課程影片來源」與「更新紀錄」，不在教學正文。
- 中英對照：除必修 2 與建議 7、9 外，段落、數字、公式一致；英文首次提到講者用 "Chen"（en L42），之後才用 She。
- 中國用語：未發現。
- 粗體：沒有不會渲染的寫法，`**…）**` 後面都接空白。

**來源外、未驗證**
- 影片長度 23:41／25:01 與所有外部連結。
- 原論文分母為 10000。
- 系列 A2 分級。
- 「BPE 是下一篇主題」：只確認站內第 5 堂標題含 Tokenization、內文有 BPE。
- 字幕檔是否為 YouTube 字幕而非機器轉錄：只看了 STATUS.md 的做法說明，沒有逐檔確認。