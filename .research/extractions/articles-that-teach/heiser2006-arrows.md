# 抽取紀錄：Heiser & Tversky 2006，Arrows in Comprehending and Producing Mechanical Diagrams

- **書目**：Julie Heiser、Barbara Tversky（2006）. Arrows in Comprehending and Producing Mechanical Diagrams. *Cognitive Science*, 30(3), 581–592. DOI 10.1207/s15516709cog0000_70。作者全名與單位對首頁（txt L4–7：「Julie Heiser, Barbara Tversky／Department of Psychology, Stanford University」）；卷期頁對首頁頁首 L1；卷號 3 依 Wiley 下載戳記「15516709, 2006, 3」與 OpenAlex。收稿 2005-05-27、修訂 2005-08-19、接受 2005-08-24（L8）。
- **原文檔**：`.work/learning-visualization-research/src/heiser-tversky2006-wiley.pdf`（12 頁；PDF 頁 = 印刷頁 − 580）與同名 `.txt`（`pdftotext` 不帶 `-layout`，428 行、39,204 字元）。
- **取得網址與合法性**：https://onlinelibrary.wiley.com/doi/pdfdirect/10.1207/s15516709cog0000_70 （出版者 Wiley 的免費 PDF；Unpaywall 與 OpenAlex 2026-10-14 皆列 bronze、host_type publisher）。curl 被 Cloudflare 擋，改用本機 Chrome（playwright-core，新 profile、無登入）開文章頁後同源 fetch 下載，2026-10-14。
- **版本**：出版者刊出版（數位排版，非掃描）。
- **讀取日期**：2026-10-14
- **供哪篇使用**：系列第 2 篇（圖表）。文章沒有直接引用本篇，是經 Tversky 2011 轉引（文章第 136 行）；本篇用來核對轉述。

## 研究設計

兩個實驗，都是史丹佛大學心理學導論課學生，受試者間設計，教材是三個機械系統（汽車煞車、打氣筒、滑輪組），圖改編自 Mayer & Gallini 1990（Fig. 1 說明，L121–123）。

### 實驗 1：描述有或沒有箭頭的圖（理解）

- **受試者**：80 人，13 人沒完成，剩 67 人（L112–115）。無箭頭 34 人（煞車 8、打氣筒 14、滑輪 12）；有箭頭 33 人（煞車 8、打氣筒 12、滑輪 13）。
- **程序**：一張紙一張圖，圖上有或沒有「indicating the temporal sequence of the system」的箭頭（L117–119），指示語「Please examine the diagram above. On the lines below, write a description of the system in the diagram.」（L119–131）；自評機械能力與該系統知識（1–7）；約 3–5 分鐘。
- **編碼**（L133–142）：盲編；兩位編碼者把描述切成命題，判為結構或功能。結構＝系統結構或零件特徵（如形狀）；功能＝系統運作、運作的因果後果、個別零件的功能、零件如何協同。一致率 94%。另把功能命題細分為「動作」與「因果」，但「Distinguishing propositions referring to motion or behavior from those referring to causes did not prove useful」（L140）。另做動詞類型計數。

### 實驗 2：依結構或功能描述畫圖（產出）

- **受試者**：240 人，44 人沒畫或沒完成問卷，剩功能描述組 93 人、結構描述組 103 人，三個系統大致平均（L181–192）。
- **教材**：每個系統各寫一段結構描述與一段功能描述（煞車版見 Table 1，L209–222）。
- **程序**：讀一段描述後「construct a diagram of what you think the description is trying to convey」（L200–201），約 3–5 分鐘。
- **編碼**：兩位獨立編碼者計數箭頭與線、位置與用途（標示、順序、動作），「There were no disagreements in coding」（L203–207）。

量的都是描述或畫圖當下的產出，沒有學習成效、沒有延後測驗。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 功能單位：有箭頭較多 | M = 2.24（SD 1.3）對 1.26（SD 1.1），F(1, 61) = 10.9，p < .01 | 有箭頭對無箭頭 | 實驗 1，2.4 | L144–146；頁 585（看過頁面） | 「participants who described diagrams with arrows produced significantly more functional units (M = 2.24, SD = 1.3) than participants who described diagrams without arrows (M = 1.26, SD = 1.1)」 |
| 2 | 結構單位：無箭頭較多 | M = 1.65（SD 1.65）對 .52（SD .62），F(1, 61) = 13.67，p < .01 | 無箭頭對有箭頭 | 實驗 1，2.4、Fig. 2 | L146–148；頁 585 | 「participants who described diagrams without arrows generated significantly more structural units (M = 1.65, SD = 1.65) than those who described diagrams with arrows (M = .52, SD = .62)」 |
| 3 | 功能單位細分（動作／因果）無差異 | — | — | 2.4 | L149 | 「the finer coding of the functional units (motion, causality) did not reveal any additional significant differences.」 |
| 4 | 圖的內容、自評能力、命題總數無主效果與交互作用 | — | — | 2.4 | L149–150 | 「There were also no main effects or interactions of diagram content, self-rated ability, or total number of propositions across conditions.」 |
| 5 | 「to be」靜態動詞：無箭頭較多 | M = 1.87（SD 1.86）對 .84（SD .95），F(1, 81) = 10.496，p < .01 | 無箭頭對有箭頭 | 2.4 | L153–155；頁 585 | 「Descriptions from the no-arrow condition contained significantly more static expressions using forms of the verb to be」 |
| 6 | 動作、行動、因果動詞：有箭頭較多 | M = 3.26（SD 2.07）對 1.78（SD 1.35），F(1, 81) = 14.66，p < .01 | 有箭頭對無箭頭 | 2.4 | L155–157；頁 585 | 「descriptions from the arrow condition contained significantly more active expressions using motion, action, and cause verbs」 |
| 7 | 功能描述組畫箭頭的比例高 | 62/93（66.7%）對 16/103（15.5%）；χ²(1, N = 196) = 9，p < .01 | 功能描述組對結構描述組 | 實驗 2，3.4、Table 2 | L237–238、Table 2 L248–284；頁 588–589（Table 2 已看頁面：結構 87／16／103、84.5／15.5；功能 31／62／93、33.3／66.7） | 「62/93 (66.7%) of participants who depicted functional descriptions used arrows in their depiction to indicate direction of operation, whereas only 16/103 (15.5%) of participants who depicted structural descriptions included arrows」 |
| 8 | 結構組畫箭頭的 16 人全是高能力者 | 16 人 | — | 3.4 | L238–239 | 「All 16 who included arrows in depictions from structural descriptions were high-ability participants.」（沒有交代高能力的切分標準） |
| 9 | 用線標示零件 | 68 人（結構組 38、功能組 30） | — | 3.4 | L239–240 | 「Sixty-eight participants, 38 who read structural descriptions and 30 who read functional descriptions, added lines to their diagrams to label parts.」 |
| 10 | 總結 | — | — | 4 | L301–305 | 「For car brakes, bicycle pumps, and pulley systems, diagrams without arrows elicited structural descriptions. Conversely, for structural descriptions participants drew diagrams without arrows, but for functional descriptions they drew diagrams with arrows.」 |
| 11 | 設計上的推論 | 箭頭會被讀成變化、移動或因果 | — | 4 | L306–315 | 「One implication is that arrows added to diagrams will be readily interpreted as conveying change, movement, or causality.」 |

## 作者自己列的限制

正文沒有獨立的限制段落，作者沒有列限制。以下是讀者自己看到、作者沒寫的問題（標為我的觀察，不是作者說法）：

- 實驗 1 剩 67 人，但動詞計數的檢定自由度是 F(1, 81)（L155、L157），與 67 人不合，原文沒有解釋。單位計數的 F(1, 61) 則與 67 人、箭頭 × 圖內容（2 × 3）設計的誤差自由度 67 − 6 = 61 相合（這是我的推算，原文沒寫分析模型）。
- 實驗 2 的 χ²(1, N = 196) = 9：用 Table 2 的 2×2 次數（87、16、31、62）自算 Pearson χ² 約 53.3，與原文的 9 差很多。結論方向不受影響，但這個統計量本身對不上。
- 沒有學習成效或理解測驗，量的是描述與畫圖的內容。
- 實驗 1 每格人數 8–14 人。

## 與摘要說法不一致的地方

逐項對過，大致沒有。摘要說無箭頭的圖被讀成「conveying structural information」、有箭頭的被讀成「conveying functional information」（L12–13）；正文數字顯示這是相對差異：無箭頭組的描述裡功能單位（M = 1.26）和結構單位（M = 1.65）其實差不多，有箭頭組才是明顯偏功能（2.24 對 .52）。摘要與 4 節「diagrams without arrows elicited structural descriptions」的說法比數字強。

## 與清單「要撐的結論」不合的地方

清單 D-6 寫的是「箭頭實驗本身」。原文撐得住「加箭頭的圖被描述成運作過程、不加箭頭偏向結構」；撐不住的地方見下一節的文章核對。

## 已發佈文章引用核對

文章第 136 行（經 Tversky 2011 轉引）：「Tversky 引用 Heiser 與 Tversky（2006）的實驗：同一張機械圖，沒有箭頭時學生寫出零件的空間關係，加了箭頭就寫出一步步的因果運作。」

| 文章的說法 | 原文 | 判定 |
|---|---|---|
| 「同一張機械圖」 | 三種機械圖（煞車、打氣筒、滑輪），每人只看一張，有無箭頭是不同受試者（L112–119） | 可接受的簡化；較準是「同一組機械圖，一半加箭頭」 |
| 「沒有箭頭時學生寫出零件的空間關係」 | 無箭頭組結構單位較多（1.65 對 .52），但功能單位也有 1.26，兩類在無箭頭組差不多；結構的定義含零件形狀等特徵，不只空間關係（L134–136） | **過強**。原文支持的是「比較多寫結構」，不是「只寫空間關係」 |
| 「加了箭頭就寫出一步步的因果運作」 | 有箭頭組功能單位較多（2.24 對 1.26）；功能包含運作與因果後果，但作者明說動作與因果分不開、細分沒有差異（L140、L149） | **「因果」講過頭**。原文的功能是「運作、動作與因果」合在一起；「一步步」對應箭頭標示的是時間順序（L118），可保留 |
| 「學生」 | 史丹佛心理學導論課學生 | 一致 |
| 文章第 138 行的動作「箭頭只用在因果、資料流向、先後順序」 | 原文 4 節說箭頭會被讀成「change, movement, or causality」（L315），並說箭頭可表達「pointing or connecting, sequence, change over time, path, or manner of movement or forces」（L59–60） | 方向一致；是文章依原文推出的寫作建議，原文沒有「只用在」的規範性說法 |

文章沒有提到實驗 2（依描述畫圖），沒有錯，只是漏了另一半證據。

## 讀取紀錄

- 依序讀 txt：L1–429，一次讀完，涵蓋全文；參考文獻 L351–423 掃過。
- 對 PDF 頁面圖：頁 585（PDF 頁 5，實驗 1 全部統計量）、頁 589（PDF 頁 9，Table 2 與 3.5、4 節）。其他頁只讀 txt。
