# 第 9 堂獨立審稿報告（第二輪，當成全新審查）

- 審查日期：2026-10-13
- 審稿者：未參與本篇撰寫的獨立審稿 agent；只審查，未修改文章檔案
- 文章與版本（工作目錄未提交版本，HEAD 708914d6）
  - zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation.md`，sha256 `12a5dbc6a7ca6bd4886397f4fd25e0b3a939dcf6644694554b19999f680135c4`
  - en：`src/content/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en.md`，sha256 `439e91b28e97c0801541df392cc1a111ad60305eb2a226eff7509f8ea3569674`
- 來源：`transcripts/lecture-09-captions.txt`（全文讀過）、`slides/251027_NLG.pdf`（41 頁）、`slides/251027_NLGEval.pdf`（22 頁）、`course-guide-contract.md`
- 講義核對方式：兩份 PDF 全部頁面讀過 pdftotext 文字；下列頁面另外轉成圖片讀圖：NLG 第 12、18、24、31、32、33、36、37、39 頁；NLGEval 第 3、7、9、10、11、14、17、19 頁。其餘頁面只看文字層，沒有看圖。

## 關於使用者問的四項「沒有套用的建議」

那四項（σ 稱作變異數、SimCSE 的 entailment／contradiction、Dual supervised learning 的 Su 等 2019、自我檢查第 1、7 題答案）不屬於本篇。本篇沒有 σ、SimCSE、dual learning 的內容；它們在第 14 堂 `2026-09-30-ntu-adl2025-beyond-supervised-multimodal(.md/-en.md)`。

我順手用 grep 看了第 14 堂目前工作目錄的檔案（只看字串在不在，沒有對來源審查）：

- zh 第 120 行已有「講義與老師都把 σ 稱作 variance；一般的慣例裡 σ 是標準差」；en 第 119 行有對應句。
- zh 第 238 行已有「第 68 頁圖上用的標註是句子之間的 entailment 與 contradiction」；en 檔有 1 處 entailment。
- zh 第 174 行已有「引的是 Su 等 2019」；en 第 173 行有對應句。
- zh 自我檢查第 1 題（第 344 行）、第 7 題（第 368 行）都有答案；en 第 343、367 行也有。

也就是說，就目前磁碟上的檔案看，這四項都已經在文章裡。「沒有套用」的說法比較可能是對著較早的版本說的，或是那份報告寫在修改之前。這一點我沒有辦法從本篇的審查確認，需要回到第 14 堂的 `review-lecture-14.md`／`rereview-lecture-14.md` 對時間順序。

---

## 一、必修（5 項）

### M1　例句與講義不符：pizza 那句
- zh 第 115 行：「I ate a pizza while it was still ＿」
- en 第 113 行："I ate a pizza while it was still ＿"
- 來源：NLG 第 31 頁圖上是「I ate the pizza while it was still」。「a pizza」只出現在自動字幕（9.2 約 15:00），字幕專有名詞與冠詞不可靠，應以講義為準。（已讀圖確認）
- 建議 zh：「I ate the pizza while it was still ＿」：幾乎只會接 hot 或 warm，分布很窄。
- 建議 en："I ate the pizza while it was still ＿": almost only "hot" or "warm" fits, so the distribution is narrow.

### M2　把投影片截圖上的數值寫成老師口述
- zh 第 154 行：「老師逐項對照：Temperature 預設 1，等於原本的 softmax；Top P 預設 1；Frequency penalty 與 Presence penalty 預設 0。」
- en 第 152 行："she goes through it item by item: … Frequency penalty and Presence penalty default to 0."
- 來源：9.3 約 09:01–12:01，老師只說了 temperature「預設值是 1，也就是跟原本的 softmax 一樣」與 top-p「原本的預設值是 1」。兩個 penalty 她只說用途，沒有說預設值。0 是 NLG 第 39 頁截圖上的數字（已讀圖確認：Temperature 1、Maximum length 256、Top P 1、Frequency penalty 0、Presence penalty 0）。
- 建議 zh：講義第 39 頁放了 OpenAI Playground 的截圖。老師對照著說：Temperature 預設 1，等於原本的 softmax；Top P 預設 1。截圖上 Frequency penalty 與 Presence penalty 的值都是 0。
- 建議 en: Slide 39 shows a screenshot of the OpenAI Playground. Going through it, she says Temperature defaults to 1, which is the plain softmax, and Top P defaults to 1. In the screenshot, Frequency penalty and Presence penalty are both set to 0.

### M3　Image captioning 譯成「看圖說故事」
- zh 第 49 行「看圖說故事」、第 52 行「看圖說故事的 x 是圖片」、第 67 行「MSCOCO 看圖說故事結果」。
- 來源：NLG 第 3 頁把 Image Captioning 與 Creative Writing 底下的 Storytelling 列成不同任務；第 6 頁寫 Image captioning（x = image, y = caption）；第 13 頁 Image captioning on MSCOCO。老師的說法是「這個圖片的一個文字的描述」（9.1 約 00:00–03:00）。本文第 162 行又用「說故事」指 storytelling，兩個詞會混在一起。英文版寫 image captioning，沒有問題。
- 建議 zh：第 49 行改「機器翻譯、抽象式摘要、對話、圖片描述（image captioning）、創意寫作」；第 52 行改「圖片描述的 x 是圖片」；第 67 行改「講義引的 MSCOCO 圖片描述結果裡」。
- 建議 en：不用改。

### M4　中文版出現「優化」（任務指定的中國用語清單）
- zh 第 11 行（tldr）「用 RL 直接優化整句的品質」、第 216 行標題「RL for NLG：直接優化整句」、第 218 行「我們想優化的是整句層級的指標」、第 224 行「只用 RL 直接優化 ROUGE-L」、第 226 行「讓 RL 去優化「人類滿意度」」「再用 PPO 這類演算法去優化它」。共 6 處。
- 其餘清單內的詞（質量、信息、視頻、默認、反饋、技術棧、窗口、網絡、數據、算法、用戶、文本、概率等）用 grep 掃過，沒有出現。「演算法」「預設」「回饋」「品質」「機率」用法正確。
- 建議 zh：一律改「最佳化」，例如第 216 行「RL for NLG：直接對整句做最佳化」、第 224 行「只用 RL 直接最佳化 ROUGE-L」。
- 建議 en：不適用。

### M5　「哪幾支影片註明取材自李宏毅老師」三處說法不一致（事實本身屬來源外、未驗證）
- zh 第 37 行：「其中幾支還註明投影片取材自李宏毅老師」
- en 第 35 行："9.1–9.3 credit the slides to Hung-Yi Lee"
- zh 第 302 行／en 第 298 行：只說 9.1、9.2。
- 同一件事在英文開頭是三支、在文末是兩支、在中文開頭沒有說幾支。YouTube 說明欄不在指定來源內，我沒有辦法判斷哪個對，但三處要先對齊成同一個說法，並且中英一致。
- 建議 zh（確認後擇一）：「其中 9.1、9.2 還註明投影片取材自李宏毅老師」，文末沿用同一組編號。
- 建議 en: "…and 9.1 and 9.2 credit the slides to Hung-Yi Lee." (use the same set of videos in the footer)

---

## 二、建議（12 項）

### S1　「這讓訓練穩定」沒有來源
- zh 第 58 行「這讓訓練穩定，但講義立刻點出問題」；en 第 56 行 "Training becomes stable"。
- NLG 第 8 頁只有定義與「Issue: mismatch between training and testing」。老師說的是這個做法「非常合理」「非常直覺」（9.1 約 09:02–12:01），沒有提穩定。這是一般常識，不算錯，但不在來源裡。
- 建議 zh：「這個做法很直覺，但講義立刻點出問題：訓練與測試不一致。」
- 建議 en: "It is the obvious thing to do, but the slide flags the problem right away: training and testing no longer match."

### S2　Greedy 例子「反覆三次」不精確
- zh 第 77 行、en 第 75 行。NLG 第 19 頁的三句是 read、read、said，第三句動詞不同。
- 建議 zh：例子接出來的是「The headline read: "The New York Times."」幾乎原樣重複三次（第三次的動詞換成 said）。
- 建議 en: The example produces "The headline read: 'The New York Times.'" three times almost verbatim (the third swaps in "said"). 同時把英文版巢狀的雙引號 `""The New York Times.""` 改成內層單引號。

### S3　「吃早餐」應為「做早餐」
- zh 第 73 行、en 第 71 行 "eats breakfast"。NLG 第 19 頁原文是 He made his breakfast, and he sat at the … dinner table；老師也說「做早餐」（9.2 約 03:02）。
- 建議 zh：（Dwight 起床、下樓、做早餐、看報紙上的填字遊戲）
- 建議 en: (Dwight gets up, goes downstairs, makes breakfast, looks at the crossword in the paper)

### S4　glossary 的 perplexity 頁碼沒說是哪一份講義
- zh 第 26 行「講義第 9 頁」、en 第 24 行 "Slide 9"。同一個 glossary 裡 exposure bias 的第 10–11 頁、nucleus 的第 33 頁指 NLG Decoding，這裡的第 9 頁指的是 NLG Evaluation。NLG Decoding 的第 9 頁是 Mismatch between Train and Test。
- 建議 zh：「NLG Evaluation 講義第 9 頁強調它評的是生成模型本身，不是某一句輸出。」
- 建議 en: "Slide 9 of the NLG Evaluation deck stresses that it evaluates the generative model itself, not any single output."

### S5　英文版第一次提到講者沒有點名
- en 第 52 行第一次提到講者用 "The instructor adds"，第 65 行起直接用 She。不是一開始就用 She，但全文正文沒有一處寫出講者姓名（只在標題、系列名與 LLM-Eval 作者處出現）。
- 建議 en（第 52 行）："Professor Yun-Nung Chen adds that today's prompting is also a conditional LM…"
- zh 不用改（第 54 行「老師補充」前文已有課名）。

### S6　英文版把兩段併成一段，連用兩個 therefore
- en 第 196 行把 zh 第 198 行（第 7 頁的圖）與第 200 行（第 8 頁的單一面向指標）併成一段，結尾是 "Later papers therefore add… Slide 8 therefore suggests…"。
- 建議 en：在 "on top of automatic metrics." 後分段，下一段開頭改 "Slide 8 suggests scoring single aspects instead: …"。
- zh 不用改。

### S7　英文版延伸閱讀少一句說明
- zh 第 274 行：「…：LLM-as-judge 的細節。」en 第 270 行只有連結，沒有後面的說明。
- 建議 en: "…(link): the details of LLM-as-judge."

### S8　自我檢查第 7 題：題目沒列 pure sampling，答案卻講了
- zh 第 267–269 行、en 第 263–265 行。題目要跑 greedy、beam search、top-k、top-p；答案多了「純 sampling 偶爾會離題」。預期結果本身對得上講義第 19、23、27、30、34 頁的五段接續。
- 建議 zh（題目）：「…分別跑 greedy、beam search、純 sampling、top-k、top-p。預期會看到什麼？」
- 建議 en: "…run greedy, beam search, pure sampling, top-k, and top-p. What should you expect?"

### S9　BLEU 折疊區塊裡的一句解釋是本文自己加的
- zh 第 182 行「避免模型只輸出幾個穩妥的詞來刷 precision」、en 第 180 行。區塊標題寫「依講義第 3 頁」，但第 3 頁沒有這句；老師口頭說的反而是「penalize 一些如果你太冗長等等的」（9.4 約 06:01），和講義公式（|ref| > |hyp| 才罰，也就是罰太短）方向相反。文章照講義寫是對的，這句解釋也正確，只是不要讓讀者以為出自講義。
- 建議 zh：「Brevity penalty B：輸出比參考短時，B = e^(1 − ref/hyp)，否則 B = 1。（用意是不讓模型靠只輸出幾個穩妥的詞來拉高 precision；這句是本文的說明。）」
- 建議 en: "…otherwise B = 1. (The point is to stop a model from gaming precision with a few safe words; that gloss is mine, not the slide's.)"

### S10　LLM-Eval「比既有的所有指標都高」可以加一個限定
- zh 第 212 行、en 第 208 行。這句是 NLGEval 第 11 頁黃框原文（LLM-Eval better correlates with human-judged scores than all existing metrics），歸給講義沒有錯。但同一頁的表格裡，DD 資料集的最高值有一格是 DEB（33.7 / 36.3 的 36.3 是粗體），老師口頭也說「大部分比較高分的」（9.4 約 30:01）。（已讀圖確認）
- 建議 zh：「講義的結論是 LLM-Eval 與人類評分的相關性比既有的所有指標都高；老師口頭說的是大部分資料集上最高的都是 LLM 給的分數。」
- 建議 en: "The slide's conclusion is that LLM-Eval correlates with human judgments better than all existing metrics; in the lecture she says most of the top scores across datasets come from the LLM."

### S11　「內容核對：已依字幕核對」的寫法要確認底本性質
- zh 第 302 行、en 第 298 行。契約規定：底本若是機器轉錄逐字稿，影片狀態行要寫「講義與機器轉錄逐字稿」，不要寫「已依字幕核對」。來源檔名是 `lecture-09-captions.txt`，任務說明寫「自動字幕或機器轉錄」，我無法從檔案判斷是 YouTube 字幕軌還是 Whisper 轉錄（未驗證）。若是後者，這一行要改。
- 建議 zh（若為機器轉錄）：「底本：講義與機器轉錄逐字稿（2026-10-13）；9.1–9.5 五支都依逐字稿整理。」
- 建議 en: "Basis: the slides and machine-generated transcripts (2026-10-13); all five videos (9.1–9.5) were worked from the transcripts."

### S12　錄影裡提到作業，文章說這一堂沒有作業（提醒，不一定要改）
- zh 第 43 行「這一堂沒有對應的作業」。錄影裡老師說「在大家的作業裡面，大家會直接用一個 pre-train 的 T5」（9.2 約 00:01）、nucleus sampling「大家在作業上面會練習到」（9.2 約 21:00）。這和版本提醒說的「說明欄日期是 2023/10/26」一致，是舊學期的錄影。2025 的作業安排在課程頁，屬來源外、未驗證。
- 建議 zh：在版本提醒補一句「影片裡提到的作業（用預訓練的 T5 練習解碼）是錄影那個學期的安排。」
- 建議 en: "The homework mentioned in the videos (practicing decoding with a pretrained T5) belongs to the semester in which they were recorded."

---

## 三、無誤確認

以下每項我都實際對過來源。

### 頁數與頁碼
- 41 頁、22 頁：pdfinfo 確認。
- NLG 頁碼：第 3、4–7、8、9–11、12–13、14、16、17–19、20–23、22、24–25、26–28、29–32、33–34、35、36、37–38、39、40 頁的內容都與文章描述相符。
- NLGEval 頁碼：第 2、3–5、7、8、9–10、11–12、14、15–18、19、20–21、22 頁相符。

### 機制與引用
- Conditional LM 定義與四個任務的 x（第 6 頁）；encoder-decoder／decoder-only（第 7 頁）；prompting 也是 conditional LM、encoder-only 不能生成（9.1 約 06:02–09:02）。
- Teacher forcing 定義（第 8 頁）；A、B 例子與 loss 為各步 cross-entropy 加總（第 9 頁）；exposure bias 與「一步錯，步步錯」（第 10–11 頁）。
- Scheduled sampling：Bengio 等 2015（第 13 頁）；線性、指數、反 sigmoid 三種遞減（第 12 頁右上圖，已讀圖；9.1 約 21:01）；MSCOCO 結果 Always from reference 28.8／24.2／89.5、Always from model 11.2／15.7／49.7、Scheduled Sampling 30.6／24.3／92.1，文章「比永遠用參考答案好、永遠用模型輸出差很多」相符；老師的解釋（9.1 約 21:01–24:02）。
- LLM 不用 scheduled sampling（第 14 頁）；「經驗上的結論」「小模型還是用得上」（9.1 約 24:02–27:02）。
- 五種解碼的表格：greedy 不能回頭（第 17–18 頁）、beam 大小的取捨（第 21 頁）、sampling 的長尾（第 27 頁）、top-k 的 k=1／k=V 與兩個問題（第 29、31、32 頁）、nucleus 是動態伸縮的 top-k（第 33 頁）。
- 第 22 頁例子：輸入句、beam 1 的回應、beam 6–8 的「What do you do for a living?」、「Finding a proper beam size is not trivial」。
- 「一萬的十次方」（9.2 約 03:02）。
- 第 24 頁人類文字多尖峰、機器（beam search）又高又平（已讀圖）；第 25 頁三個理由與 Goodman 2016。
- 「縕」字的例子（第 28 頁與 9.2 約 12:00）；She said I never 的例子（第 32 頁）。
- Nucleus 的定義「累加到達到 p」：第 33 頁公式是 ≥ p（已讀圖）。
- Temperature：公式是分數除以 τ（第 36 頁，已讀圖）；高溫變平、低溫變尖；不是解碼演算法；接 greedy 沒有意義（9.2 約 21:00–24:00）；創意文案調高、要穩定調低（9.3 約 03:00–06:01）。
- Repetition／frequency／presence penalty（第 37–38 頁；9.3 約 06:01–09:01）。「越多次壓得越重」比老師原話（依 frequency 做不同的 penalty 調整）具體一點，方向一致。
- 第 40 頁「高興想哭」與結論。
- 評估第 2 頁的兩類指標與「評輸出不是評模型」；BERT 的做法（9.4 約 03:02）；參考答案當唯一標準的問題（9.4 約 00:00–06:01）。
- BLEU／ROUGE 對照表（第 5 頁）。
- BLEU 公式：第 3 頁印的式子確實沒有 log（已讀圖），文章有交代這是標準定義；brevity penalty 的條件與式子相符。
- 第 7 頁：自動分數與人類分數無一致；右欄是兩組人的評分呈正相關（已讀圖；9.4 約 09:00–12:00）；user study。
- 第 8 頁的六個單一面向。
- Perplexity（第 9 頁，已讀圖：PP(S) = p(w_1…w_N)^(−1/N) = 2^(−l)）；cross-entropy（第 10 頁，已讀圖：H(p, q) = log PP(S)）；第 22 頁 output evaluation／model evaluation、lower is better。
- LLM-Eval：作者、NLP4ConvAI 2023（第 11–12 頁）；0–5 與 0–100、有無 human reference（第 11 頁表格與 9.4 約 30:01）；單輪與多輪、proxy（第 12 頁）；「不是完美的」。
- RL：第 14 頁的參考句與「The dog is is fast」（已讀圖）；射擊遊戲與圍棋（第 15 頁、9.5 約 03:00）；action／observation／reward（第 16 頁）；Ranzato 等 ICLR 2016（第 16 頁）；scheduled sampling（DaD）與 RL（MIXER）同圖（第 17 頁，已讀圖）。
- 第 19 頁（已讀圖）：RL 的 ROUGE-1 47.22、ROUGE-L 43.27 為最高；ML+RL 的 ROUGE-2 30.72 最高；人類評分 RL 4.18／6.32 低於 ML 6.76／7.14，ML+RL 7.04／7.45 最高。文章正文與「常見的誤解」第 6 條的說法都正確。
- RLHF、reward model、PPO、「頭頭是道」（第 20–21 頁、9.5 約 09:00–12:00）。

### 來源內部的不一致（文章都處理得當，記在這裡備查）
- 第 37 頁的 apple 例子是 −1.0 變成 −0.8，式子寫「+ penalty」，老師口頭說「加上 0.2，讓它的機率下降」。log 機率加 0.2 其實是上升。文章沒有引用這組數字，沒有問題；以後若要補，必須註明這個不一致。
- BLEU 的長度懲罰，老師口頭說罰「太冗長」，講義公式罰的是太短。文章依講義。

### 標「本文自編」的例子，全部重算過
- Greedy／beam（zh 第 85–97 行）：AA 0.33、AB 0.27、BA 0.04、BB 0.36；greedy 得 AA；beam k=2 第一步留 A、B，第二步留 BB、AA，輸出 BB。正確。
- Nucleus（zh 第 120–123 行）：p = 0.85；窄分布 0.6 → 0.9，候選 2 個；平分布 9 個是 0.81、10 個是 0.9，候選 10 個；機率總和各為 1。正確。
- Temperature（zh 第 131–137 行）：τ = 0.5 (0.867, 0.117, 0.016)、τ = 1 (0.665, 0.245, 0.090)、τ = 2 (0.506, 0.307, 0.186)。正確。
- BLEU／ROUGE（zh 第 187–196 行）：unigram 重疊 4 個；precision 4/5 = 0.8；ROUGE-1 4/6 ≈ 0.67；輸出 4 個 bigram、參考 5 個 bigram、只有 the cat 重疊，1/4 與 1/5；brevity penalty e^(−0.2) ≈ 0.819；沒有重疊的 trigram 與 4-gram，BLEU = 0。正確。
- Perplexity（zh 第 206 行）：1/64；(1/64)^(−1/3) = 4；平均 2 bits，2² = 4。正確。

### 自我檢查（七題）
1. 正確，可由第 9–11 頁的段落推得。
2. 正確（AA，0.33）。
3. 正確：top-k 取 a、b；累加 0.5、0.7、0.85，nucleus 取 a、b、c。
4. 正確：0.665 → 0.506，greedy 輸出不變。
5. 正確：precision 3/3 = 1，recall 3/5 = 0.6。中文版用中文句、英文版用英文句（I am very happy today／I am happy），字數與答案一致。
6. 正確：2 與 4，第一個模型比較好。
7. 有預期結果，可由講義五段接續例子推得；題目與答案的方法清單不一致，見 S8。

### 常見的誤解（六條）
六條都有正文或講義依據（依序：自編例子、第 21–22 頁、第 36 頁與 9.2、評估第 7 頁、評估第 9 與 22 頁、評估第 19 與 22 頁）。開頭明寫「這幾條是我依課堂內容整理的」，沒有冒充老師說法。

### 契約符合度
- 標題格式：`check-course-titles.mjs` 對兩個檔案回報 0 issue。中英課名與堂次一致。
- 學習目標（zh 第 45 行，四項）、機制、完整例子（條件、計算、結果、意義都有）、常見誤解、附答案的自我檢查：齊備，且四項目標各有對應的例子與自我檢查題。
- 查核歷程：正文只留版本提醒與限制；查核日期與核對說明在文末的「課程影片來源」與「更新紀錄」，位置合理。
- 一堂一篇：兩份講義在同一篇，用 H2 分段。符合。

### 粗體標記
逐行看過中英兩檔的 `**`。沒有 `**…（…）**` 後直接接中文字的寫法，也沒有收尾的 `**` 前面是全形標點、後面緊接文字而不會渲染的情況。這是依 CommonMark 規則判讀原始檔，沒有實際開頁面看渲染結果。

### 中英對照
逐段比對過。除了 M2、M5、S2、S3、S5、S6、S7 列出的差異，其餘段落、表格、數字、公式一致。英文版第 33 行多一句 "The videos are taught in Mandarin; the slides are in English."，屬於給英文讀者的合理補充。

## 四、來源外、未驗證

- 五支影片的長度（28:20、28:34、17:57、32:41、15:27）。字幕最後一個時間戳分別是 27:02、27:00、15:02、30:01、15:02，沒有矛盾，但不能證明。
- 所有外部連結（課程頁、講義 PDF 網址、YouTube、arXiv）與站內連結是否有效。
- 「期中考週之後」「課程頁標為 Virtual」「114-1，2025/09/01–12/15」「存取分級 A2」。
- 影片上傳日期 2025/10/27、說明欄日期 2023/10/26、取材自李宏毅老師的註記（另見 M5）。
- 參考資料裡 Holtzman 等的年份：文章寫「(ICLR)」沒有寫年份；講義第 31–33 頁標的是 2019。
