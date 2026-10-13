# 第 9 堂修改紀錄（依 review2-lecture-09.md）

- 日期：2026-10-13
- 檔案：`src/content/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation.md`（zh）、`…-en.md`（en）
- 來源：`transcripts/lecture-09-captions.txt`、`slides/251027_NLG.pdf`、`slides/251027_NLGEval.pdf`
- 這次另外轉圖讀過的頁面：NLG 第 19、31、39 頁；NLGEval 第 3、11 頁
- 來源外的查證：用 `yt-dlp` 讀了五支影片的說明欄、上傳日期與字幕軌清單（M5、S11 用）
- 報告共 17 項（必修 5、建議 12）：已改 16 項，不改 1 項（S11）。未 commit。

## 必修

### M1 pizza 例句 — 已改
- 依據：NLG 第 31 頁圖上是「I ate the pizza while it was still」（讀圖）。字幕 9.2 寫 a pizza，以講義為準。
- zh 改前：「I ate a pizza while it was still ＿」
- zh 改後：「I ate the pizza while it was still ＿」
- en 改前："I ate a pizza while it was still ＿"
- en 改後："I ate the pizza while it was still ＿"

### M2 Playground 的預設值 — 已改
- 依據：9.3 字幕裡老師只說 temperature「預設值是 1，也就是跟原本的 softmax 一樣」與 top-p「原本的預設值是 1」，兩個 penalty 只講用途。NLG 第 39 頁截圖上 Frequency penalty 0、Presence penalty 0（讀圖）。
- zh 改前：講義第 39 頁放了 OpenAI Playground 的截圖，老師逐項對照：Temperature 預設 1，等於原本的 softmax；Top P 預設 1；Frequency penalty 與 Presence penalty 預設 0。
- zh 改後：講義第 39 頁放了 OpenAI Playground 的截圖。老師對照著說：Temperature 預設 1，等於原本的 softmax；Top P 預設 1。截圖上 Frequency penalty 與 Presence penalty 的值都是 0。
- en 改前：Slide 39 shows a screenshot of the OpenAI Playground, and she goes through it item by item: Temperature defaults to 1, which is the plain softmax; Top P defaults to 1; Frequency penalty and Presence penalty default to 0.
- en 改後：Slide 39 shows a screenshot of the OpenAI Playground. Going through it, she says Temperature defaults to 1, which is the plain softmax, and Top P defaults to 1. In the screenshot, Frequency penalty and Presence penalty are both set to 0.

### M3 Image captioning 的譯名 — 已改（只改 zh）
- 依據：NLG 第 3 頁 Image Captioning 與 Storytelling 分列；第 6 頁 Image captioning (x = image, y = caption)；第 13 頁 Image captioning on MSCOCO；9.1 開頭老師說「這個圖片，它的一個文字的描述」。
- zh 三處：
  - 「…對話、看圖說故事、創意寫作」→「…對話、圖片描述（image captioning）、創意寫作」
  - 「看圖說故事的 x 是圖片」→「圖片描述的 x 是圖片」
  - 「講義引的 MSCOCO 看圖說故事結果裡」→「講義引的 MSCOCO 圖片描述結果裡」
- en：原本就是 image captioning，不用改。

### M4 「優化」→「最佳化」 — 已改（只改 zh，6 處）
- tldr：「用 RL 直接優化整句的品質」→「用 RL 直接對整句的品質做最佳化」
- 標題：「RL for NLG：直接優化整句」→「RL for NLG：直接對整句做最佳化」
- 「我們想優化的是整句層級的指標」→「我們想最佳化的是整句層級的指標」
- 「只用 RL 直接優化 ROUGE-L」→「只用 RL 直接最佳化 ROUGE-L」
- 「讓 RL 去優化「人類滿意度」」→「讓 RL 去最佳化「人類滿意度」」
- 「再用 PPO 這類演算法去優化它」→「再用 PPO 這類演算法對它做最佳化」
- 改完 grep「優化」為 0 筆；`node scripts/check-tw-terms.mjs` 對 zh 檔沒有訊息。

### M5 哪幾支影片註明取材自李宏毅老師 — 已改，但沒有照報告建議的「9.1、9.2」
- 報告說這件事在來源外、要先確認。我用 `yt-dlp` 讀了五支影片的說明欄：9.1、9.2、9.3、9.5 都有「Slides credited from Hung-Yi Lee」，9.4 沒有。五支的上傳日期都是 20251027，說明欄日期都是 2023/10/26。
- 所以原文三處都不對：en 開頭寫 9.1–9.3（漏 9.5）、文末寫 9.1、9.2（漏 9.3、9.5）。三處與中英都對齊成「9.1、9.2、9.3、9.5」。
- zh 版本提醒 改前：其中幾支還註明投影片取材自李宏毅老師。
- zh 版本提醒 改後：其中 9.1、9.2、9.3、9.5 還註明投影片取材自李宏毅老師。
- en 版本提醒 改前：and 9.1–9.3 credit the slides to Hung-Yi Lee.
- en 版本提醒 改後：and 9.1, 9.2, 9.3, and 9.5 credit the slides to Hung-Yi Lee.
- zh 文末 改前：9.1、9.2 於 2025-10-27 上傳，說明欄日期是 2023/10/26，並註明投影片取材自李宏毅老師。
- zh 文末 改後：五支都在 2025-10-27 上傳，說明欄日期是 2023/10/26；其中 9.1、9.2、9.3、9.5 註明投影片取材自李宏毅老師。
- en 文末 改前：9.1 and 9.2 were uploaded on 2025-10-27 with a description dated 2023/10/26 that credits Hung-Yi Lee for the slides.
- en 文末 改後：All five were uploaded on 2025-10-27 with descriptions dated 2023/10/26; 9.1, 9.2, 9.3, and 9.5 credit Hung-Yi Lee for the slides.
- 注意：這一項的依據是 YouTube 說明欄，不在指定的三份來源內。

## 建議

### S1 「這讓訓練穩定」 — 已改
- 依據：NLG 第 8 頁只有定義與 Issue: mismatch between training and testing；9.1 老師說「非常的直覺」「非常的直接」，沒有說穩定。
- zh：「這讓訓練穩定，但講義立刻點出問題」→「這個做法很直覺，但講義立刻點出問題」
- en："Training becomes stable, but the slide flags…" → "It is the obvious thing to do, but the slide flags…"

### S2 Greedy 例子「反覆三次」 — 已改
- 依據：NLG 第 19 頁（讀圖）三句是 read、read、said。
- zh：「…」反覆三次 →「…」幾乎原樣重複三次（第三次的動詞換成 said）
- en：The example repeats "The headline read: "The New York Times."" three times → The example produces "The headline read: 'The New York Times.'" three times almost verbatim (the third swaps in "said")

### S3 吃早餐 → 做早餐 — 已改
- 依據：NLG 第 19 頁「He made his breakfast」；9.2 字幕是「吃早餐等等做早餐」，以講義為準。
- zh：下樓、吃早餐 → 下樓、做早餐
- en：eats breakfast → makes breakfast

### S4 glossary 的 perplexity 頁碼 — 已改
- 依據：perplexity 在 NLGEval 第 9 頁；NLG Decoding 第 9 頁是 Mismatch between Train and Test。
- zh：「講義第 9 頁強調…」→「NLG Evaluation 講義第 9 頁強調…」
- en："Slide 9 stresses…" → "Slide 9 of the NLG Evaluation deck stresses…"

### S5 英文版第一次提到講者要點名 — 已改（只改 en）
- en："The instructor adds that today's prompting…" → "Professor Yun-Nung Chen adds that today's prompting…"
- 這是正文第一次提到講者，之後的 She 都在這句後面。

### S6 英文版兩段併成一段、連用兩個 therefore — 已改（只改 en）
- en：在 "on top of automatic metrics." 後分段；下一段開頭 "Slide 8 therefore suggests scoring single aspects: fluency…" → "Slide 8 suggests scoring single aspects instead: fluency…"

### S7 英文版延伸閱讀少一句說明 — 已改（只改 en）
- en：CME295 Lecture 8 那一條後面補上 ": the details of LLM-as-judge."

### S8 自我檢查第 7 題的方法清單 — 已改
- zh 題目：「分別跑 greedy、beam search、top-k、top-p」→「分別跑 greedy、beam search、純 sampling、top-k、top-p」
- en 題目："run greedy, beam search, top-k, and top-p" → "run greedy, beam search, pure sampling, top-k, and top-p"
- 答案沒有動。

### S9 BLEU 區塊裡本文自己加的解釋 — 已改
- 依據：NLGEval 第 3 頁（讀圖）只有公式；9.4 老師口頭說的是「penalize 一些如果你太冗長等等的」，和講義公式（|ref| > |hyp| 才罰）方向相反。文章照講義。
- zh 改前：否則 B = 1。避免模型只輸出幾個穩妥的詞來刷 precision。
- zh 改後：否則 B = 1。（用意是不讓模型靠只輸出幾個穩妥的詞來拉高 precision；這句是本文補充，不在講義上。）
- en 改前：otherwise B = 1. This stops a model from gaming precision with a few safe words.
- en 改後：otherwise B = 1. (The point is to stop a model from gaming precision with a few safe words; this gloss is added by this post and is not on the slide.)

### S10 LLM-Eval「比既有的所有指標都高」加限定 — 已改
- 依據：NLGEval 第 11 頁黃框原文 LLM-Eval better correlates with human-judged scores than all existing metrics；同頁表格 DD 欄的 36.3（DEB）是粗體（讀圖）；9.4 老師說「你會發現大部分比較高分，跟真人的 correlation 比較高的，都是透過 language model 產生出來的 evaluation」。
- zh：在「…可以當作人類評估的代理。」後面加「「比既有的所有指標都高」是講義的結論；老師對著表格口頭說的是，大部分比較高、和真人相關性比較高的分數，都是 LLM 給的。」原本的「老師補了兩個觀察」改成「老師另外補了兩個觀察」。
- en：在 "…a proxy for human evaluation." 後面加 "\"Better than all existing metrics\" is the slide's conclusion; talking through the table, she says most of the higher scores, the ones that correlate better with humans, come from the LLM." 原本的 "She adds two observations" 改成 "She adds two more observations"。

### S11 「內容核對：已依字幕核對」 — 不改
- 理由：報告的建議是有條件的（底本若是機器轉錄才要改）。我查了：五支影片在 YouTube 上都有 zh-TW 字幕軌（`yt-dlp -J` 的 `subtitles` 有 zh-TW）；下載 9.1 的 zh-TW 字幕，開頭幾行與 `lecture-09-captions.txt` 的開頭逐字相同。底本是 YouTube 字幕軌，不是語音辨識逐字稿，所以「已依字幕核對」符合契約。
- 這條字幕軌本身是不是頻道上傳的機器字幕，我沒有辦法判斷（裡面有 gridi、binsearch 這類錯字）。

### S12 錄影裡提到作業 — 已改
- 依據：9.2 字幕「在大家的作業裡面，大家會直接用一個 pre-train 的 T5」與「大家在作業上面會練習到」（nucleus sampling）。
- zh：版本提醒加一句「影片裡提到的作業（用預訓練的 T5 練習解碼）是錄影那個學期的安排。」
- en：版本提醒加一句 "The homework mentioned in the videos (practicing decoding with a pretrained T5) belongs to the semester in which they were recorded."
- 「這一堂沒有對應的作業」那句沒有動（2025 的作業安排在來源外）。

## 任務另外指定的項目

- 英文版「常見的誤解」說明句："These are my own summary of the lecture." → "This list is my own summary, not something the lecture enumerated point by point."
- 粗體：用正則掃過 zh 檔，沒有 `**詞（說明）**` 後面直接接中文字的寫法，沒有改動。
- 中國用語：除「優化」外沒有其他命中。

## 沒有處理的事

- 報告「四、來源外、未驗證」列的項目（影片長度、連結有效性、Holtzman 的年份等）不是修改項，沒有動。順帶一提，這次 `yt-dlp` 讀到的五支影片長度與上傳日期和文章寫的一致。
- 更新紀錄沒有新增條目（報告沒有提）。其中 2026-10-10 那條寫「確認 9.1、9.2 與文章相符」，是當時的紀錄，沒有動。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
