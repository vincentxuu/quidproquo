# 複審報告：ADL 2025 第 3 堂（Sequence Modeling）

複審日期：2026-10-13。複審人未參與撰寫與第一次審查，只審查、未修改文章。

## 受審版本

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn.md`（zh-TW） | `c948984178afca7a414f78fd1947ecd2758eba3a03cce6b1cc8e06e2c5883566` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en.md`（en） | `51985253854454802705cafc94576bbf4a183fe045641c9c4a1efd6df8c481a8` |

兩個雜湊都和第一次報告記錄的不同，確認文章在第一次審查後改過。行數沒變（修改都在原行內），以下行號是目前檔案的行號。

## 我實際做了什麼

- 讀完 `review-lecture-03.md`、兩篇文章全文、`transcripts/3.1.txt` 全文（512 行）、`lecture-03-captions.txt` 全文（3.2、3.3、3.4）。
- 講義實際看過圖片的頁：10、13、19、29、31、32、43、45。只看 `pdftotext` 文字的頁：9、12、23、25、47、48、51、62、65。其餘頁這次沒有重看，沿用第一次報告的結論。
- 用 Python 重算 0.9⁵⁰、1.1⁵⁰、2÷√12；其他例子與自我檢查的算式用心算核對。
- grep 了整個 ADL 系列的「內容核對」句，確認中英對應慣例。
- 沒有做的事：沒有第一次審查當時的文章副本，無法逐字 diff「改前／改後」；我改用「把全文每一句帶歸因的句子對回逐字稿與字幕」的方式補足。沒有開網頁、沒有看影片畫面、沒有驗證外部連結、沒有跑 `pnpm verify` 或 checker 腳本。

## 結論

第一次報告的 1 項必修與 17 項建議裡，13 項已正確修正，沒有發現改錯或引入事實錯誤的地方。剩下 4 項未修（S7、S11、S12、S15），其中只有 S15（英文版的轉折）我認為值得修。另有 2 個第一次報告沒列的小問題（英文第 293 行的單複數、gating 捷徑的轉述）。新增與改寫的句子都有來源依據，沒有說得比來源重。自編例子與自我檢查的數字仍然自洽。

---

## 仍需修改

### R1.（原 S15，未修正）英文版全篇沒有任何轉折詞，中文的「但」都譯成 and 或被拿掉

- 實測：英文檔 grep `but` 命中 0 次；其他轉折詞只有第 63 行的 `Yet` 一處（`however` 兩次是「不論多…」的用法，`even though` 兩次是讓步子句）；中文檔有 11 行含「但」。我在 `.agents/skills/post/references/writing-guide.md` 與 `post-translate` 裡 grep 過，沒有找到禁用 but 的規則，所以判定這不是刻意的風格規定。
- 意思沒有譯錯，但下面幾句讀起來前後像並列，其中第 182 行已經不通順。建議至少改這六句：

| en 行 | 目前 | 對應中文（zh 行） | 建議 |
|---|---|---|---|
| 151 | `…it is no longer zero, and that 0.0001 is assigned by a person…` | 152「不再是 0，但這個 0.0001 是人指定的」 | `…it is no longer zero, but that 0.0001 is assigned by a person…` |
| 153 | `Many smoothing methods have been proposed, and the problem cannot be fully solved…` | 154「…但問題沒辦法完全解決」；3.2 [06:00]「但是這件事情沒辦法完全解決」 | `Many smoothing methods have been proposed, but the problem cannot be fully solved…` |
| 182 | `RNNs now sound rarely used, and they are an important step…` | 183；3.2 [12:00]「雖然現在聽起來…但它其實是…非常重要的一件事情」 | `RNNs now sound rarely used, but they are an important step…` |
| 239 | `too large can be made smaller, and once it has vanished you do not know what it was.` | 240；3.3 [09:01]「太大你還可以把它變小，但你消失了你也不知道它是多少」 | `too large can be made smaller, but once it has vanished you do not know what it was.` |
| 241 | `…(the slide: in theory), and in practice…`；前一句 `With so much in between…` | 242「但中間隔得太遠」；3.3 [12:01]「理論上…但是實務上就是會消失」 | `…(the slide: in theory), but in practice…`；前一句開頭加 `But` |
| 300 | `…multiplied too many times, and the fixes are not symmetric` | 301「但解法不對稱」 | `…multiplied too many times, but the fixes are not symmetric` |

- 同類、較輕的還有 en 57（`The first is an ancestor relation…`，zh 58 有「但」）、en 287（`Many tasks are unaligned`，zh 288「但很多任務不對齊」）。
- 中文版不需要動。

### R2.（原 S16 修正後留下的文法問題）en 第 293 行

- 原句：`These are my own summary, not points listed one by one in the lecture.`
- 後半句已補上，內容和 zh 294「以下是本文的歸納，不是課堂上逐條列出的內容。」一致。但 `These are … summary` 單複數不合。
- 建議：`This list is my own summary, not something the lecture enumerated point by point.`
- 中文不用改。

### R3.（第一次報告沒列，屬轉述精確度）zh 第 244 行／en 第 243 行：捷徑「不用經過那些運算」

- 原句（zh）：「在原本的 RNN 上面多開一條捷徑，走這條路不用經過那些運算，可以一路衝到很後面，影響很遠的輸出。」
- 原句（en）：`add a shortcut on top of the original RNN; information on this path skips those operations and can run all the way to much later…`
- 來源：3.3 [12:01] 字幕是「這條路就是不用經過什麼控制，我可以走上面這個捷徑一路衝…」，講 GRU 時說「上面這條就是無所阻礙，就直接這樣衝過去」。字幕裡沒有「運算」這個詞；「那些運算」在文章裡也沒有前文可指。
- 確認程度：對過字幕。這是自動字幕，「控制」有沒有聽錯我無法由畫面確認；第 48–49 頁只有圖與引用，沒有文字可佐證。所以列為建議，不是錯誤。
- 建議（zh）：「在原本的 RNN 上面多開一條捷徑，這條路沒有什麼阻礙，可以一路衝到很後面，影響很遠的輸出。」
- 建議（en）：`add a shortcut on top of the original RNN; this path is unobstructed, so information can run all the way to much later and affect distant outputs.`

### R4.（原 S11，未修正，可不改）zh 第 57 行／en 第 56 行：標註「人力」

- 原句：「要花大量標註人力。」／`**Annotation effort.** It takes a great deal of human labor.`
- 來源：第 6 頁 `annotation effort`（沿用第一次報告，這次沒重看該頁圖）；3.1 [04:57–05:00]「需要非常多的…annotation 的時間」。
- 差異很小，第一次報告也說可不改。要對齊口述的話：zh「要花大量標註時間。」；en `It takes a great deal of annotation time.`；自我檢查第 1 題（zh 310／en 309）的「需要大量標註人力」要一起改。

---

## 已確認修正正確

以下每一項都實際對過目前的文章與來源。

| 原編號 | 目前位置 | 目前文字（摘） | 依據 | 判定 |
|---|---|---|---|---|
| M1 | en 386／zh 387 | `verified against the video transcript`／「已依字幕核對」 | grep 全系列：zh「已依字幕核對」的各篇（attention、ml-dl、backprop、nlg、post-training、rag、pretraining、language-agents）英文都是 `video transcript`；本篇已成對 | 已正確修正 |
| S1 | zh 112／en 111 | 「walking 到 walked 的方向，和 swimming 到 swam 的方向也接近」 | 第 13 頁圖（看圖）：Verb Tense 圖畫 walking→walked、swimming→swam；句子標明出自「第 13 頁下方的三張圖」 | 已正確修正 |
| S2 | zh 168／en 167 | 「完全不用特別去指定機率」／`with no need to assign a probability specially` | 3.2 [09:03]「完全不用特別 assign 一個比較高的機率，因為它不是用計算的方式來估計的，它是直接用 model 來 predict，然後只要它能夠有好的一開始的 vector…」；同句其餘部分也都對得上 | 已正確修正 |
| S3 | zh 166／en 165 | 「她說裡面有三個矩陣要訓練，簡單來說可以想成…」 | 3.2 [09:03]「就是有三個 matrix 要在裡面進行訓練，但簡單來講，你就可以把它想成…input…中間有一些 hidden state…output…distribution」 | 已正確修正 |
| S4 | zh 179／en 178 | 「這個做法背後的假設是…」／`The assumption behind this approach…` | 第 25 頁文字：Assumption 與 Idea 並列，不屬於單一想法；3.2 [12:00] | 已正確修正 |
| S5 | zh 102／en 101 | 「老師說共現矩陣是 N×N，代價就是 N 的三次方」 | 3.1 [17:54–18:02]「你的 N 就是 N by N 的 matrix，所以這邊就是 N 的三次方」；第 12 頁文字 `O(mn2) when n<m for nxm matrix` | 已正確修正 |
| S6 | zh 227／en 226 | 「老師說一開始數值還算平均；到 50 個時間點，數值集中在 0 和 ±100 兩端」 | 3.3 [09:01]「一開始還算平均…做了很多次之後…100 跟 −100 很多，然後 0 的也很多」；第 45 頁圖（看圖）：50 steps 是 −100 約 33、0 約 19、0.01 約 22、100 約 19。作者沒有採用建議文字，而是拿掉「−1 到 1」的範圍，問題一樣消失 | 已正確修正 |
| S8 | zh 302／en 301 | 「把整句丟進雙向 RNN 會讓模型看到答案；雙向只能用在已經出現的前文上」 | 3.3 [15:01]「你只能把前面出現的字，然後用這種 bidirectional 的方式來做，你沒辦法整個句子丟進去」。「看到答案」是本文的說法，位於已聲明為本文歸納的一節，不算冒充 | 已正確修正 |
| S9 | zh 299／en 298 | 「RNN 用了全部前文，所以句子越長、模型越大」 | 3.2 [12:00]「我不應該因為用了比較多的 history，我的 model 就變比較大」 | 已正確修正 |
| S10 | zh 195／en 194 | 「第 29 頁把 hidden state 寫成 h_t、輸出寫成 ŷ_t，第 31 頁寫成 s_t 與 o_t」 | 第 29、31 頁圖（看圖）逐符號相符；第 32 頁圖確認 y_t 標 target、o_t 標 predicted，和 zh 203 的用法一致 | 已正確修正 |
| S13 | zh 43／en 42 | 學習目標改成「讀懂共現矩陣、從裡面算出兩個詞的相似度」 | 對應練習：zh 88–92 的例子與自我檢查第 2 題。目標與練習現在對齊 | 已正確修正 |
| S14 | zh 151／en 150 | 「（這裡只照投影片把 0 換掉，沒有把其他機率重新調整到總和為 1。）」 | 第 19 頁圖（看圖）：兩個 0 劃掉改成紅字 0.0001，沒有其他調整。這句只描述本文例子自己的做法（例子裡 dog 之後的機率變成 1 + 0.0001），沒有引入來源外的 smoothing 知識，所以不需要另標「本文補充」 | 已正確修正 |
| S16 | en 293 | 補上 `not points listed one by one in the lecture` | 與 zh 294 一致 | 內容已修正；文法見 R2 |
| S17 | zh 75、100、297 | 「窗口」全部改成「視窗」 | grep：「窗口」0 次，「視窗」5 次；frontmatter 與 glossary 沒有殘留；第 170 行的 context window 維持英文 | 已正確修正 |

### 新增與改寫的句子是否說得比來源重

除了上表各句，我把全文帶「老師說／她說／投影片寫／第 N 頁」的句子再對了一次逐字稿與字幕，沒有找到來源裡不存在的歸因。這次特別留意的幾句：

- zh 102「再加上每多一個新詞，矩陣就多一列，整個 SVD 要重算」：3.1 [18:05–18:14]，相符。
- zh 166「老師沒有細講這個式子」：3.2 [09:03]「這邊其實沒什麼特別的地方…寫下來是長這樣子啦」，相符。
- zh 216「反向傳播的每一步都要乘上同一個矩陣」、圈起來的 W、結論句：第 43 頁圖（看圖），相符。
- zh 242「理論上 RNN 處理得了長距離的依賴（投影片：in theory）」：第 47 頁文字 `can handle "long-term dependencies" in theory`；「數值精確度有限」：3.3 [12:01]，相符。
- zh 251「每一層把中間的表示傳給上一層」：第 51 頁文字 `Each memory layer passes an intermediate representation to the next`，相符。
- zh 288 的兩句對照：第 62 頁文字 `Temporal orders for input and output are the same`、第 65 頁文字 `Temporal ordering for input and output may be different`，相符。
- 唯一有落差的是 zh 244，見 R3。

### 中英一致性

修改過的各處（zh 43／en 42、102／101、112／111、151／150、166／165、168／167、179／178、195／194、227／226、294／293、299／298、302／301、387／386）兩版內容一致。不一致之處只有 R1（轉折）與 R2（文法）。

### 數字自洽

| 項目 | 文章 | 結果 |
|---|---|---|
| cosine(love, enjoy) | 2 ÷ √12 ≈ 0.58 | 0.5774；兩列向量和第 10 頁表（看圖）相符 |
| bigram「the dog jumped」 | 1 × 0.5 × 0 = 0；補後 0.00005 | 相符；新增的括號句與算式不矛盾 |
| 0.9⁵⁰、1.1⁵⁰ | ≈ 0.005、≈ 117 | 0.00515、117.39 |
| clipping (3, 4)、門檻 1 | (0.6, 0.8) | 相符 |
| 自我檢查 2 | 0.5 | deep、enjoy 兩列與表相符，內積 1，長度皆 √2 |
| 自我檢查 3、7 | 1/2 與 0；(3, 4) | 相符 |

中英兩版這些數字相同。

---

## 未驗證

- **原 S7（zh 216／en 215）未修改，維持未驗證。** 3.3 [06:02] 老師說「這不是 transpose，這是用了 t 次這個 weight」，但第 43 頁（看圖）圈起來的是 (Wˡ⁺¹)ᵀ，和第 34–35 頁反向傳播式子的轉置寫法一樣。沒有影片畫面，我無法確認她當時指的是哪個符號。文章照講義寫，我認為不必改。
- **原 S12（zh 282／en 281）未修改。**「長度與順序都可以不同」的「長度」不在第 65 頁文字裡，3.4 [09:01] 只說 input 與 output 沒辦法 align。該列沒有標成投影片引述，內容本身正確，我認為不必改；要完全貼來源可改成「不對齊，順序可以不同」／`Unaligned, order may differ`。
- 第 244 行「控制」是否為字幕聽錯（見 R3）。
- 這次沒有重看的講義頁（6、8、11、16、18、21、22、26、34–41、44、46、49、50、54、56、57、59、61、64）：相關句子沿用第一次報告「無誤確認」的結論，我只對了口述部分。
- 第一次報告「來源外、未驗證」一節列的項目（學期起訖、影片長度、YouTube 與論文連結、Fall 2022 投影片 48 頁、課程頁誤標連結、站內連結、2026-10-10 查核聲明）這次同樣沒有查。
- 沒有跑 `pnpm verify`、`check-course-titles.mjs`、`check-course-guide-layout.mjs`，也沒有看實際渲染頁面。
