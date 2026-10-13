# 修改紀錄：ADL 2025 第 1 堂（依 review2-lecture-01.md）

日期：2026-10-13。檔案：`src/content/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction.md`（zh）、`…-en.md`（en）。未 commit。

報告「必修」為無；「建議」S1–S10 共 10 項（S10 含 3 小項），另有任務指定的英文版「常見的誤解」說明句 1 項。

## 已改

### S1 英文版第一次提到講者要點名
- en 改前：The instructor first separates three words that are often used interchangeably.
- en 改後：Professor Yun-Nung Chen first separates three words that are often used interchangeably.
- zh：不改（報告也說不需改；「老師」在系列名之後出現，指涉清楚）。
- 依據：講義第 1 頁講者姓名；文章標題。

### S2 一層／三層少了 hidden
- zh 改前：在手寫數字辨識上比較一層的模型和三層的模型。要達到同樣的表現，一層的模型需要的參數比較多。
- zh 改後：在手寫數字辨識上，比較只有一層 hidden layer 的模型和有三層 hidden layer 的模型。要達到同樣的表現，只有一層 hidden layer 的模型需要的參數比較多。
- en 改前：Compare a one-layer model with a three-layer model on handwritten digit recognition. To reach the same performance, the one-layer model needs more parameters.
- en 改後：Compare a model with one hidden layer against one with three hidden layers on handwritten digit recognition. To reach the same performance, the model with one hidden layer needs more parameters.
- 依據：講義第 32 頁（轉圖確認）圖例「1 hidden layer」「3 hidden layers」，頁尾 "The deeper model uses less parameters to achieve the same performance"；1.2 [39:00]「藍色的就是一層的…灰色的就是三層的」。

### S3 「沒有貢獻」改「沒什麼貢獻」
- zh 改前：其他的不管怎麼算都沒有貢獻。
- zh 改後：其他的不管怎麼算都沒什麼貢獻。
- en 改前：…and the rest contribute nothing however they compute.
- en 改後：…and the rest contribute very little however they compute.
- 依據：1.2 [18:02]「其他都小小的不管怎麼算，都沒什麼 contribution」。

### S4 「2010 年前後」改「2010 年代前後」（三處：資料條目、第 6 題題目、第 6 題答案）
- zh 改前：2010 年前後行動裝置普及、資料量快速增加…／為什麼深度學習的突破發生在 2010 年前後…／兩者在 2010 年前後才都具備。
- zh 改後：2010 年代前後，行動裝置普及、資料量快速增加…／為什麼深度學習的突破發生在 2010 年代前後…／兩者到 2010 年代前後才都具備。
- en 改前：Around 2010 mobile devices spread…／…come around 2010, and not when…／Both became available only around 2010.
- en 改後：Around the 2010s mobile devices spread…／…come around the 2010s, and not when…／Both became available only around the 2010s.
- 依據：1.2 [24:00]「也是差不多在 2010 年代左右，這些行動裝置越來越普及」「剛好都是在差不多 2010 年代左右」；[21:04]「一直發展到 2010 年代左右」。
- 與報告建議的差異：報告英文建議 "around the early 2010s"。來源只說「2010 年代左右」，沒有「初」的意思，所以寫成 "around the 2010s"，不加 early。H2「為什麼等到 2010 年後才突破」對應講義第 23 頁的 "after 2010"，報告沒有要求改，維持。

### S5 「工人智慧」的歸因
- zh 改前：訓練前要先有人聽打逐字稿，老師說這是先做「工人智慧」
- zh 改後：訓練前要先有人聽打逐字稿；老師引了一句以前的說法：做人工智慧之前，要先做「工人智慧」
- en 改前：People must transcribe audio by hand first; she jokes that "artificial intelligence" starts with a lot of human labor
- en 改後：People must transcribe audio by hand first; she quotes an old line that before artificial intelligence comes a lot of manual labor (a Mandarin pun: 人工智慧 / 工人智慧)
- 依據：1.1 [09:01]「所以以前可能會說，在做人工智慧之前，要做工人智慧先」。
- 與報告建議的差異：報告中文建議「老話」，來源原話是「以前可能會說」，改寫成「以前的說法」。

### S6 第 33 頁的 2d：寬度與參數量
- zh 改前：講義的圖是一層寬 2d，對上兩層、每層寬 d。
- zh 改後：講義的圖是一層寬 2d，對上兩層、每層寬 d。老師口頭把 2d 說成參數量，圖上標的是那一層的寬度，這一頁的標題列則寫兩個網路的參數量相同。本文補充：照全連接層的連線數去算，兩邊的參數量並不嚴格相等，這一頁給的是量級上的直覺。
- en 改前：The figure in the deck sets one layer of width 2d against two layers of width d.
- en 改後：…against two layers of width d. She speaks of 2d as the parameter count while the figure labels it as the layer's width, and the slide's heading says the two networks have the same number of parameters. Added by this post: counting the connections of fully connected layers, the two parameter counts are not strictly equal, so the slide is an order-of-magnitude intuition.
- 依據：講義第 33 頁（轉圖確認）：左圖該層旁標 2d、右圖兩層各標 d，標題列 "Two networks with the same number of parameters"，紅字 O(2d)、O(d²)；1.2 [39:00]「如果是胖的模型的話，假設參數量是 2D，那瘦的模型就是，把它變成 D 跟 D」。
- 「參數量不嚴格相等」是來源外的推論，已標成「本文補充」／"Added by this post"。
- 自我檢查第 4 題：報告判定現行寫法（「粗略估計，不是嚴格的定理」）方向正確、沒有提出改寫，未動。

### S9 字幕的性質
- zh 改前：內容核對：已依字幕核對（2026-10-13）：1.1、1.2、1.3 三支都依字幕整理。1.1 與 1.2 的上傳日…
- zh 改後：內容核對：已依字幕核對（2026-10-13）：1.1、1.2、1.3 三支都依字幕整理；字幕檔有語音辨識造成的錯字（例如把「函式」寫成「韓式」），專有名詞以講義為準。1.1 與 1.2 的上傳日…
- en 改前：…all three videos (1.1, 1.2, 1.3) were worked from their captions. 1.1 and 1.2 carry…
- en 改後：…were worked from their captions. The caption file contains speech-recognition errors, so technical terms follow the deck. 1.1 and 1.2 carry…
- 依據：字幕檔 1.1 [06:01]「再學一個韓式，韓式就是…這個 function」、[09:01]「遊地區號」、1.2「病」（Bing）。
- 與報告建議的差異（兩點）：
  1. 沒有照建議把開頭改成「已依 YouTube 自動字幕核對」。`scripts/check-course-videos.mjs` 第 20 行的 `CONTENT_CHECK_RE` 要求字串「內容核對：已依字幕核對」／"Content check: verified against the video"，中間插字會讓標記失效，所以標記原樣保留，說明補在後面。
  2. 沒有寫「YouTube 自動產生」。報告自己註明這點未查證、只從錯字型態推測；我能從來源確認的只有「字幕檔裡有語音辨識錯字」，所以只寫這件事。

### S10a en "a shirt" → "a garment"
- en 改前：Turning a piece of cloth into a shirt is complex
- en 改後：Turning a piece of cloth into a garment is complex
- 依據：1.2 [00:00]「從比如說一塊布到一件衣服」。zh 原本就是「衣服」，不改。

### S10b en features 重複
- en 改前：Each layer extracts features of the data that help the task, called features or representations.
- en 改後：Each layer extracts what in the data helps the task; these are called features or representations.
- 依據：1.2 [06:02]「找出一些，在這個任務上面重要的特徵，那我們會叫它 Features，或者是 Representations」。zh 無此問題，不改。

### 任務指定：英文版「常見的誤解」說明句
- en 改前：These four are my own summary of the lecture.
- en 改後：This list is my own summary, not something the lecture enumerated point by point.
- zh「這四條是我依課堂內容整理的。」不改。

## 不改

- **S7（1.3 只有連結、沒有嵌入）**：流程面項目（影片只嵌入幾支），依任務說明不改。報告自己也註明沒有查檢查器是否限制嵌入數量。查過 `scripts/check-course-videos.mjs`：只要求「已附影片」時至少有一個 youtube 嵌入，沒有要求每支都嵌。
- **S8（缺第 1 堂範圍卡、前次審稿報告）**：流程面，不影響正文。
- **S10c（en `## Update Log` 大小寫）**：報告寫「若是檢查器解析的固定標題就維持」。`check-course-guide-layout.mjs` 第 8、19 行把 `Update Log` 列為認得的固定標題，同系列其他英文篇（bert-family、attention-transformer、language-agents 等）也都是 `## Update Log`，維持以保持系列一致。

## 其他檢查

- 中文版「優化」：grep 無命中，不需改。報告的中國用語掃描也無命中。
- 粗體 `**詞（說明）**` 後直接接中文字：grep 無命中。
- frontmatter 的 title、date、series 與檔名未動。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 0 issue(s)
