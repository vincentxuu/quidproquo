# 抽取紀錄：Kim、Guo、Cai、Li、Gajos、Miller 2014，Data-Driven Interaction Techniques for Improving Navigation of Educational Videos（UIST '14，LectureScape）

- **書目**：Juho Kim, Philip J. Guo, Carrie J. Cai, Shang-Wen (Daniel) Li, Krzysztof Z. Gajos, Robert C. Miller. 2014. Data-Driven Interaction Techniques for Improving Navigation of Educational Videos. In *UIST '14*, October 5–8, 2014, Honolulu, HI, USA. ACM. DOI 10.1145/2642918.2647389。作者全名與單位對過 PDF 首頁（MIT CSAIL；Guo 另列 University of Rochester；Gajos：Harvard SEAS）。
- **原文檔取得網址**：共同作者 Gajos 的 Harvard 個人論文頁 https://www.eecs.harvard.edu/~kgajos/papers/2014/kim-uist14-lecturescape.pdf 。2026-10-14 重抓，HTTP 200，`cmp` 與本機 `lecturescape.pdf` 位元組相同。作者個人頁是合法公開版本；PDF 是 ACM 相機稿（首頁有 ACM 版權欄與 DOI）。
- **本機檔**：`.work/video-layout-research/lecturescape.pdf`（1,656,781 位元組，10 頁）；精讀用 `.work/video-layout-research/ls-flow.txt`（`pdftotext` 不帶 `-layout`，915 行、58,870 位元組）。flow 版的段落有幾處前後錯置（例如 Pinning video frames 一節的開頭在 L473–479，接續句在 L431–451；參考文獻編號交錯），讀時依 PDF 順序重組，內容沒有缺。
- **版本**：會議刊出版（作者頁轉存的 ACM 相機稿）
- **讀取日期**：2026-10-14
- **供哪篇使用**：系列第 6 篇（版面，`src/content/posts/learning/2026-10-13-video-beside-text-layout.md`，清單代號 L-2）

## 研究設計

- **類型**：系統論文＋實驗室使用者研究，受試者內設計（L533–539）。
- **系統**：LectureScape 把三組技術放在同一個網頁播放器（L490–500）：2D 的 Rollercoaster 時間軸（顯示每秒的導覽次數，互動高峰標洋紅色，高峰區域拖曳時加「摩擦」減速）、個人觀看軌跡、依觀看人數加權的關鍵字搜尋、每段的關鍵字雲（三朵雲：上一段、目前、下一段）、高峰畫面的重點條、個人書籤、自動釘選上一張相關畫面在影片旁（Fig. 9）。
- **版面描述**（L494–500）：「LectureScape features the video player in the main view, along with the Rollercoaster timeline below the video and the word cloud above it. The interactive transcript is in the right sidebar, and the highlights are positioned at the bottom of the screen. The search box at the top enables keyword search. The widgets are all collapsible to reduce visual clutter and to hide unused features.」注意 L697–698：實驗用的版本為了測可用性，所有功能都開著。
- **對照介面**（L533–539）：拿掉所有互動資料相關功能，「The baseline interface still included the interactive transcript and preview thumbnails on hover, to emulate what is available in platforms such as edX or YouTube. To maintain uniformity in look and feel for our comparative study, the baseline interface had the same layout and visual design as LectureScape.」——模擬 edX／YouTube 的是「保留逐字稿與懸停縮圖」；「版面相同」的理由是讓比較一致，兩者是分開的兩句。
- **任務**（L540–571）：三類共八個——四個視覺搜尋（目標是出現不到 20 秒的投影片，有的在高峰附近、有的不在；只給時間軸，其他功能拿掉）、兩個找答案（problem search，例：「步長變小，程式跑得快還是慢？」）、兩個摘要（3 分鐘摘要 7–8 分鐘的影片）。
- **教材**：edX 一門入門電腦科學課的影片，互動資料來自 2012 秋季首次開課的伺服器紀錄；八個任務各用不同影片，同類任務的影片長度、難度、風格相近（L572–578）。致謝提到 6.01x 課程團隊（L806）。
- **受試者**（L581–595）：12 人（5 男，平均 25.6 歲，SD 11.0，18–49 歲），經 edX 課程論壇與校內課程網站招募；都正在修影片所屬的入門 CS 課（edX 或校內）；選學期前段的影片，受試者大概已看過。4 人修過或正在修 edX 版、6 人修校內版、2 人曾註冊線上版但正在修校內版。酬金 30 美元。
- **程序**（L598–609）：75 分鐘；先各 15 分鐘介面教學；每題後問信心與是否看過；每類任務後訪談策略；每類任務內平衡介面順序與影片分配；最後填兩個介面的可用性問卷；伺服器記錄所有點擊。
- **量了什麼**：完成時間、操作紀錄、7 點 Likert 問卷、訪談。檢定一律用 Mann-Whitney U。

## 結果（逐項，數字都對過 PDF 第 8–9 頁）

### RQ1 導覽方式
- **視覺搜尋**（L613–630）：目標在高峰附近的兩題，LectureScape μ = 85 秒（σ = 51）、對照 μ = 80（σ = 73），MWU p > 0.4、Z = −0.9；目標不在高峰的兩題，LectureScape 117（σ = 44）、對照 90（σ = 50），p > 0.1、Z = −1.5，皆不顯著。原文：「results show that LectureScape did not adversely affect task completion times even when the answer was not in peak ranges」。
- **找答案**（L631–639）：對照介面 10/12 用關鍵字搜尋、11/12 點逐字稿文字；LectureScape 各 6/12，另有 6/12 點時間軸高峰、6/12 點下方重點畫面。完成時間 LectureScape μ = 96（σ = 58）、對照 μ = 106（σ = 58），「the difference was not significant (MWU test, p=0.8, Z=0.3)」。
- **摘要**（L640–652）：兩種介面都只有 1/12 用關鍵字搜尋；LectureScape 9/12 點高峰、6/12 點重點畫面。某支 7:00 的影片 6:35 有個高峰（總結投影片），用 LectureScape 的 6 人全都去看了，對照組只有 1 人。
- **自評速度與效率**（L653–660）：7 點量表，速度 5.8 對 4.8、效率 6.1 對 4.8，「both differences were significant at p<0.05」。沒給個別 p 或 Z。
- **直接跳轉次數**（L739–741）：每題平均 8.4 次（LectureScape）對 5.6 次（對照），沒有檢定。

### RQ2 對互動資料的看法
- 7 點量表（L668–671）：容易理解 5.9、有用 5.3、好玩 5.2、高峰影響了導覽 5、高峰符合個人興趣 4.4。只有 LectureScape 一組，無對照。
- 開放題（L672–674）：高峰成因 confusing 8/12、important 6/12、complex 4/12。
- 有受試者說熟悉主題時被別人的行為拖慢拖曳會很煩（L676–681）。

### RQ3 可用性
- 功能是否齊全：LectureScape 6.4、對照 4.3，p < 0.001、Z = −3.2（L685–687）。
- 易用性：4.7 對 6.3，LectureScape 較難用，p < 0.001、Z = 2.7（L689–692）；有人說太複雜，希望能隱藏不用的元件。
- 單場研究看不出個人書籤與個人軌跡的用處，少有人用（L699–700）。

### 導覽模式分析（L701–756）
- 兩種介面都是「先概觀、再聚焦」交替；LectureScape 組用更多方式、跳轉更有方向；對照組多半循序掃過，或從頭做短而保守的跳轉。

## 作者自己列的限制

- 實驗室單場研究，看不出個人書籤這類功能的價值，需要長期部署（L699–700）。
- 互動資料的未解問題：資料驅動的設計會不會強化過早出現的高峰、要多少資料點才會浮現高峰（L763–767）。
- 只用 MOOC 式講課影片示範（L778–783）。
- 摘要與導言都承認任務表現沒有顯著差異，「interaction data may not always align with moment-by-moment information needs」（L34–35、L115–117）。

## 與摘要說法不一致的地方

- 摘要說受試者覺得「efficient and useful」，正文的自評速度、效率顯著，與摘要一致；摘要也照實說任務表現無顯著差異。逐項對過，主要結論沒有不一致。
- 統計上的小問題（原文本身，不是轉述）：受試者內資料一律用 Mann-Whitney U（獨立樣本檢定）；易用性「p<0.001, Z=2.7」與功能齊全「p<0.001, Z=−3.2」的 Z 值換算的雙尾 p 約 0.007 與 0.001，與「p<0.001」不完全相符。原文沒有解釋。

## 與清單「要撐的結論」不合的地方

清單 L-2 列的文章引用：「12 人、96 對 106 秒、評分、12 人裡 11 人、附錄人口資料」。逐項對過，數字都撐得住。需要注意的只有版面的理由（見下表 L71）。

## 已發佈文章引用核對（`2026-10-13-video-beside-text-layout.md`）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| L69 | 播放器在主畫面，時間軸在下方，關鍵字雲在上方，互動逐字稿在右側欄，重點畫面在最下面；每個元件都可以收起來 | L494–500 | 一致。補充：實驗用的版本所有元件都開著（L697–698），文章沒提，不影響這句 |
| L71 | 12 位正在修那門入門程式課的學生，各用 LectureScape 和對照介面做八個任務 | L581–586、L599–601 | 一致。原文是「introductory computer science course」，「程式課」略窄，附錄 L239 寫「入門電腦科學課」較準 |
| L71 | 對照介面拿掉「其他學生的觀看紀錄」相關功能，保留互動逐字稿，版面與外觀也刻意做成一樣；論文說這是為了模擬 edX 或 YouTube 當時就有的功能 | L533–539 | **歸因要調**：原文「to emulate what is available in platforms such as edX or YouTube」只修飾「保留互動逐字稿與懸停縮圖」；「same layout and visual design」的理由是「To maintain uniformity in look and feel for our comparative study」。文章把兩句接在一起，讀起來像版面相同也是為了模擬平台。另外原文保留的還有懸停預覽縮圖，文章沒提 |
| L73 | 找答案任務 96 對 106 秒，差異不顯著（p = 0.8） | L638–639 | 一致 |
| L74 | 自認比較快、比較有效率（7 點量表 5.8 對 4.8、6.1 對 4.8，p < 0.05） | L656–660 | 一致 |
| L75 | 覺得比較難用（易用性 4.7 對 6.3），有人說畫面太複雜 | L689–692 | 一致 |
| L77 | 「影片在主畫面、逐字稿在旁邊」是當時研究者與平台都採用的排法，不能說被實驗證明比較好 | 對照介面與 LectureScape 版面相同，實驗沒比版面 | 一致。「平台都採用」：原文只說 edX 播放器有同步逐字稿「alongside the currently playing video」（L181–183），YouTube 部分原文沒說逐字稿在旁邊，這半句是文章的延伸 |
| L77 | 對照介面做找答案任務時，12 人裡 11 人靠點逐字稿文字定位 | L634–635 | 一致 |
| L198 | 本站版面最像 LectureScape（影片與文字各佔一塊、同時可見） | — | 本站設計的比喻，不涉原文數字 |
| L224 | 樣本 12 人；LectureScape 的兩個條件版面相同 | L539、L581 | 一致 |
| L239 附錄 | 12 人（5 男，平均 25.6 歲），都正在修影片所屬的入門電腦科學課，其中 4 人是 edX 學生 | L581–595 | 大致一致。原文是「Four participants were enrolled in a current or previous edX offering」——含先前修過的；另有 2 人曾註冊線上版、現修校內版 |
| L239 | 每場 75 分鐘，酬金 30 美元 | L595、L598 | 一致 |
| L239 | 八個任務：四個找畫面、兩個找答案、兩個寫摘要，介面順序與影片分配做了平衡 | L599–607 | 一致（原文是「每類任務內」平衡） |
| L239 | 對照介面找答案時 10 人用關鍵字搜尋、11 人點逐字稿；用 LectureScape 時各降到 6 人，另有 6 人改點時間軸上的高峰 | L633–638 | 一致（另有 6 人點下方重點畫面，文章沒提） |
| L239 | 功能是否齊全，LectureScape 6.4、對照 4.3 | L685–687 | 一致（原文 p < 0.001） |
| L239 | 作者說單場實驗看不出個人書籤這類功能的用處 | L699–700 | 一致 |
| L254 參考資料 | 連結 Gajos 個人頁；讀了介面、研究設計、結果與限制 | 連結可用、位元組與本機檔相同 | 連結合法 |

## 讀取紀錄

- `ls-flow.txt` 依序讀 L1–460、L461–915（全檔 915 行，首尾相接，含參考文獻）。
- 對過 PDF：第 7 頁（研究設計、受試者）、第 8 頁（RQ1、RQ2、RQ3 前半）、第 9 頁（易用性、書籤、導覽模式、8.4 對 5.6、討論）轉圖逐句核對。論文沒有結果表格，數字都在正文。
- 2026-10-14 從 Gajos 個人頁重抓 PDF 比對位元組相同。
