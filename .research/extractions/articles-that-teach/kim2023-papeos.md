# 抽取紀錄：Kim、Latzke、Bragg、Zhang、Chang 2023，Papeos: Augmenting Research Papers with Talk Videos（UIST '23）

- **書目**：Tae Soo Kim, Matt Latzke, Jonathan Bragg, Amy X. Zhang, Joseph Chee Chang. 2023. Papeos: Augmenting Research Papers with Talk Videos. In *The 36th Annual ACM Symposium on User Interface Software and Technology (UIST '23)*, October 29–November 1, 2023, San Francisco, CA, USA. ACM, 19 pages. DOI 10.1145/3586183.3606770。作者全名與單位對過 PDF 首頁（Kim：KAIST，工作於 AI2 Semantic Scholar 實習期間完成；Latzke、Bragg、Chang：Allen Institute for AI；Zhang：University of Washington）。
- **原文檔取得網址**：arXiv 作者版 https://arxiv.org/abs/2308.15224（PDF 首頁側欄印「arXiv:2308.15224v1 [cs.HC] 29 Aug 2023」）。arXiv 是作者自行上傳的合法公開版本。2026-10-14 重抓 https://arxiv.org/pdf/2308.15224v1，`cmp` 與本機 `papeos.pdf` 位元組相同。
- **本機檔**：`.work/video-layout-research/papeos.pdf`（4,247,268 位元組，19 頁）；精讀用 `.work/video-layout-research/papeos-flow.txt`（`pdftotext` 不帶 `-layout`，1,879 行、105,447 位元組）。
- **版本**：arXiv v1 預印本（內容是 UIST '23 的相機稿，頁首與 ACM 版權欄都在）。沒有和 ACM DL 刊出版逐字比對。
- **讀取日期**：2026-10-14
- **供哪篇使用**：系列第 6 篇（版面，`src/content/posts/learning/2026-10-13-video-beside-text-layout.md`，清單代號 L-1）

## 研究設計

論文含四個研究，各自設計不同：

1. **前導研究（preliminary）**（flow L354–365，§3.2）：4 位研究者，論文與演講影片並排給他們，指示「understand the content of the paper based on your real-life habits」。沒有報告時間長短、受試者背景。
2. **形成性研究＋共同設計（formative & co-design）**（L341–439，§3.1–3.4）
   - 14 位已發表過論文並做過演講影片的研究者：10 位博士生、2 位碩士生、1 位博士後、1 位大學部學生。領域：HCI 或相關 10 人、NLP 3、ML 2、CV 1（註 1：有人跨多領域）（L341–348）。
   - 先用技術探針（technology probe，Fig. 2：左邊 PDF 閱讀器、右邊影片播放器加時間軸，連結的段落與片段以顏色對應）以讀者身分邊放聲思考邊讀 20 分鐘；再以作者身分，用預先放入自己論文頁面與影片關鍵畫面截圖的投影片畫設計草圖（L387–422）。
   - 連結由一位作者事前手動建立：依投影片換頁切片段，依內容相似、照論文閱讀順序連到段落（L374–381）。
   - 除一人外都用 Google Meet 遠端參加，酬金 45 美元，經機構審查（L423–426）。
   - 分析：錄影錄音人工轉錄，主題分析（thematic analysis）（L432–439）。
3. **作者端初步評估（preliminary user evaluation of authoring）**（L1006–1019，§4.2.2）：6 位研究者用自己的論文與影片做一份 Papeo。原文括號寫「3 systems HCI, 3 empirical HCI, and 1 computer vision」，加起來 7，與 6 人不一致（可能有人跨領域，原文沒說明）。
4. **比較實驗（user study）**（L1047–1173，§5.1）
   - 類型：受試者內設計，三種條件：Paper（只有 PDF 閱讀器）、Paper+Video（基本 PDF 閱讀器與基本影片播放器「in separate tabs or windows」）、Papeo（L1066–1077）。條件順序平衡；三篇論文所有人同順序閱讀（L1069–1070、L1078–1079）。
   - 受試者：16 位 HCI 早期研究者，經作者 Twitter 與滾雪球招募；12 位博士班一到三年級、4 位碩士生；全部每週至少讀一次論文；全程 90 分鐘，酬金 45 美元（L1058–1065）。
   - 教材：三篇 HCI 系統論文（Tabs.Do [12]、Cocomix [33]、Stylette [46]），選自 §4.2.1 的連結資料集；兩篇是本文作者寫的；附錄 A 說明這三份 Papeo 和其他人做的差不多（L1078–1094）。
   - 任務：先讀完摘要，再給 15 分鐘讀系統章節並同時寫摘要，要求 Comprehensive、Detailed、Coherent；最多 14 句、不能複製貼上、不評文法（L1095–1113、L1142–1148）。每個條件前有 5 分鐘介面試用。
   - 量測（L1116–1126、L1157–1173）：
     - 7 點 Likert：任務容易、在論文／影片內定位（orient）容易、在論文／影片內導覽（navigate）容易。原文寫「the following five questions」但只列出三句問題（L1116–1119）。
     - NASA-TLX 五題（去掉體力需求）。原文沒有明寫 NASA-TLX 的量尺點數；Fig. 7 把 Mental Demand 畫在「Likert Rating」1–7 軸上。
     - 操作紀錄：切換格式次數、論文捲動次數、影片拖曳（scrub）次數；同方向、一秒內的連續動作算一次。
     - 摘要評分：每篇論文訂評分規準，列出系統章節所有細節並依系統面向分組；「detail」＝摘要含幾個細節，「comprehensiveness」＝涵蓋的系統面向比例，「coherency」＝7 點量表。兩位沒觀察實驗的作者盲評；先各自標一篇、討論後再各自標一次，細節標註 Cohen's kappa 0.712、連貫性 Krippendorff's alpha 0.744；之後剩下兩篇各由一人標註。
   - 統計：Shapiro-Wilk 判斷常態；三條件比較用重複量數單因子 ANOVA（常態）或 Friedman（非常態）；Paper+Video 對 Papeo 用成對 t 檢定或 Wilcoxon（L1135–1140）。
5. **實地部署**（L1331–1370，§6）：CSCW 2022 會議期間，經社群媒體與每日電子報推廣；邀請報告者用作者介面自做，共 12 份 Papeo（約六小時志願製作）。

## 結果（逐項）

### 前導研究
- 4 人都先把整支影片看完才讀論文。L359–363：「they all watched the whole video first and then delved into the paper. Participants expressed how this was not due to a lack of desire to jump to the paper while watching the video, but due to the prohibitively high cost of cross-referencing between formats.」

### 形成性研究（讀者身分，§3.4.1）
- 使用模式：5 人主要讀論文、偶爾切到影片；9 人跟著影片走、不時暫停讀論文（L440–443）。
- 11/14：影片的摘要比「dense parts of the paper」容易吸收（L445–446）。
- 7/14：影片換一種方式解釋細節，看不懂論文時有用（L447–449）。
- 4/14：喜歡作者的口述；5/14：影片裡的圖示、動畫、示範片段更能說明（L450–457）。
- 11/14：看影片或略讀依影片做的標示能得到概觀，當成「launching pad」（L458–466）。
- 互動問題：影片進到下一段時論文自動捲動，3/14 說會打斷閱讀、6/14 說會迷路（L469–473 原句「participants mentioned that the probe could disrupt their reading (3/14) or cause them to get lost (6/14)」）；4/14 說看之前無法預期片段內容；8/14 說片段連到的段落太長，難以在論文裡找到影片提到的細節（L473–480）。

### 共同設計（作者身分，§3.4.2，Table 1）
- 12/14 的主要目標是能切換閱讀的細節程度（L489–493）。
- 7/14 想用影片視覺化表示論文段落以利導覽；5/14 設計更細的連結（L493–500）。
- 7/14 反對用影片取代論文內容（L503–504 原句「most participants (7/14) advocated against replacing content」）；理由引 P3「videos are rarely a one-to-one representation of a paper」、P10「delete information」。
- 7/14 把影片視為宣傳論文的方式，最終想把讀者導回論文（L510–512）。
- 全部 14 人願意建立連結，但都不要全自動，要能檢查與修改（L600–607）。
- **Table 1（對過 PDF 第 6 頁）**：八類設計，依主要格式分三組。Paper 為主：Linked video popups、Overlaid videos、Video-based outline；Video 為主：Position-sensitive details、Guiding tooltips、Side commentary；Combined：Interweaved paper and video、Adaptive side-by-side（「paper and video displayed side-by-side but adaptively changes the size of each format」，只有 P4 提出）。
- **五條設計目標**（L614–627）：DG1 能專注其一也能隨時切換；DG2 從影片帶出畫面幫讀者預期內容、當論文的視覺大綱；DG3 細粒度連結；DG4「Avoid occluding or replacing the content in a format with content from the other」；DG5 輔助建立連結但讓作者掌控。

### 閱讀介面的設計描述（§4.1）
- 影片筆記放在論文頁右側，「localized approximately next to their linked passages」（L650–653）。
- 點色條或筆記：縮圖變成播放器、顯示該段完整逐字稿、筆記放大；若只大致對齊，筆記移到與色條精確對齊並推開其他筆記（L685–690）。
- 每則筆記只播一段，播完就停，不自動接下一段：L711–717「As users may start reading while the video note plays and forget to deactivate it, each video note only streams one video segment to minimize disruption. Thus, by default, once the video note reaches the end of the current segment, the player stops」。
- 同步標示（synchronized highlights）：作者標出的字詞在論文與逐字稿兩邊同時高亮（L725–730）。
- 自動播放時採 video note-centric scrolling：筆記固定在畫面同一位置，換論文捲動到下一段（L757–763，Fig. 5）。

### 作者端（§4.2）
- **Table 2（對過 PDF 第 10 頁）**：切片段的三種方法（3 秒內算命中）。Punctuation：precision 0.405、recall 0.906、F1 0.541、F2 0.701、F3 0.786；HSV Change：0.499、0.805、0.605、0.706、0.751；Template Match：0.577、0.758、0.635、0.698、0.725。採用 Punctuation（F3 最高）。
- **Table 3（對過 PDF 第 11 頁）**：連結建議 top-1／top-5。隨機章節首段 0.029／0.080；SPECTER 0.399／0.623；MiniLM 0.464／0.768；ROUGE-L 0.493／0.739；MiniLM＋ROUGE-L 0.572／0.797；Viterbi with Combined 0.626／0.863（採用）。
- 初步評估：完整連結一份平均 25 分 22 秒（SD 5:31，最長 30:17、最短 15:19）；71.3% 的片段用了 top-5 建議（SD 11.6%，82.1%–57.1%）（L1012–1016）。對照：沒有建議功能的 5 位研究者平均 44 分鐘（SD 10.9）（註 4，L1037–1040）。

### 比較實驗（§5.2；Table 4、Fig. 7–10 都對過 PDF 第 12–14 頁）
- **任務容易（Fig. 7）**：Paper 3.94 ± 1.88、Paper+Video 4.62 ± 1.59、Papeo 5.50 ± 1.03；p = 0.030。正文 L1151–1153：「The ANOVA analysis showed a significant effect of the condition on participants' perceived ease (Q=6.982, p=0.030)」——寫 ANOVA 但給的是 Q 統計量（Friedman 的符號），原文自相矛盾。
- **NASA-TLX（Table 4，n = 48，Friedman）**：

  | | Mental | Temp. | Effort | Perf. | Frus. |
  |---|---|---|---|---|---|
  | Paper | 5.50 (1.27) | 5.13 (1.63) | 5.25 (1.48) | 4.44 (1.46) | 4.00 (1.79) |
  | Paper+Video | 5.31 (0.79) | 5.19 (1.38) | 5.25 (0.93) | 4.63 (1.15) | 3.88 (1.15) |
  | Papeo | 4.50 (1.03) | 4.38 (1.63) | 4.63 (1.31) | 4.94 (1.39) | 3.63 (1.59) |
  | p | 0.002 | 0.230 | 0.249 | 0.355 | 0.715 |

  正文 L1249–1253：「there was significant effect of the conditions on mental demand (Q=12.182, p=0.002) and demand was perceived to be lowest when participants used Papeos. Furthermore, although these results were not significant, perceived temporal demand, effort and frustration were lowest and perceived performance was highest with Papeos」。**心理負荷只報了三條件整體 Friedman，沒有成對比較**。表註「n=48」是 16 人 × 3 條件的觀測數。
- **導覽與定位（Fig. 8）**：
  - 論文內導覽：Paper 4.12 ± 1.59、Paper+Video 4.38 ± 1.78、Papeo 5.50 ± 0.97；Q = 6.704、p = 0.035（L1273–1275）。
  - 論文內定位：4.50 ± 1.79、4.69 ± 1.45、5.31 ± 0.87；p = 0.348（不顯著，只在圖上，正文沒提）。
  - 影片內導覽（只有兩條件）：Paper+Video 4.06 ± 1.69、Papeo 5.44 ± 1.41；p = 0.061（不顯著，只在圖上）。
  - 影片內定位：Paper+Video 4.38 ± 1.63、Papeo 5.69 ± 1.14；W = 27.000、p = 0.034（L1284–1286）。
- **操作紀錄（Fig. 9；正文誤標為 Fig. 8）**：
  - 切換格式：Paper+Video 4.88 ± 2.00、Papeo 48.69 ± 22.32；W = 0.000、p < 0.000（原文寫法）（L1296–1298）。
  - 觀察：「in the Paper+Video condition, most participants watched the whole video first and then focused only on the paper during the remaining duration of the task. However, in the Papeo condition, participants continuously switched back-and-forth」（L1299–1302）。
  - 論文捲動：Paper 53.75 ± 22.31、Paper+Video 39.44 ± 18.18、Papeo 57.94 ± 26.68；F = 7.065、p = 0.003（L1310–1312）。
  - 影片拖曳：Paper+Video 17.12 ± 12.59、Papeo 23.75 ± 10.33；t = −1.810、p = 0.090（不顯著）（L1312–1313）。
- **摘要（Fig. 10）**：
  - 涵蓋面（百分比）：Paper 61.46 ± 20.74、Paper+Video 63.69 ± 22.14、Papeo 76.93 ± 15.83；F = 3.497、p = 0.043（L1317–1320）。沒有事後成對比較。
  - 細節數：7.38 ± 4.63、7.94 ± 4.58、8.19 ± 3.17；Q = 2.000、p = 0.368。
  - 連貫性（7 點）：5.06 ± 1.77、4.81 ± 1.87、4.31 ± 1.40；Q = 2.772、p = 0.250。數值上 Papeo 最低，但不顯著；原文只說「no observed effect」（L1322–1327）。
- 受試者引句（L1257–1268）：P14「The video is high-level summary…」、P12「It was like three senses were active.」、P8 英語非母語，影片的非正式說法幫他確認理解。

### 實地部署（§6）
- 兩週內 288 位不重複使用者，每人平均看 1.20 份（1–5）；12 份 Papeo（L1347–1353）。導言寫「over 250 unique visitors」（L188–189），與 288 相容。
- 去除異常 session 後，每 session 平均 32.02 個動作（2–255），平均 5.74 分鐘（1.02–40.21）（L1356–1359）。

### 附錄 A（Table 5，對過 PDF 第 19 頁）
- 全部 23 份 Papeo（測試集 8、作者端評估 6、部署另加 9；部署的 12 份中有 3 份是作者端評估時做的）。
- 每份連結數平均 20.6（SD 7.3）；每個連結含論文片段 3.2（1.6）；「Average Length of Linked Video Segment」24.3（8.7），**表裡沒有寫單位**；同步標示總數 2.8（4.2）。三份實驗用 Papeo：[46] 20／3.9／24.0／7，[12] 15／2.8／29.2／7，[33] 24／1.8／19.0／3。
- 原文說三份都在平均一個標準差內；同步標示 7 剛好等於 2.8 + 4.2 = 7.0，在邊界上。

## 作者自己列的限制（§7.4，L1494–1518；另 §7.3）

- 影片對有互動或動態成品的研究（如 HCI 系統）較有用；對資訊密集的章節特別有幫助；動畫與逐步呈現的畫面有效；口語化說法受歡迎——作者把這四點列為會影響效用的因素，要再研究。
- 為了塞進 90 分鐘，實驗只用 HCI 系統論文、只讀一個章節。
- 作者仍主張好處（標示、摘要、口述）能推廣到其他論文類型與領域，並說要再研究。
- §7.3：演講只涵蓋論文的一部分，有受試者看不懂某段卻找不到對應影片而失望（L1464–1469）。
- §7.1：覆蓋率受限於作者願不願意做 Papeo。

## 與摘要說法不一致的地方

- 摘要說「Papeos reduced mental load」（L50）：正文只有三條件整體 Friedman 顯著（p = 0.002），沒有 Papeo 對 Paper+Video 或對 Paper 的成對檢定；「reduced」是依平均數排序說的。
- 摘要說「facilitated more comprehensive reading」：涵蓋面整體 F 檢定 p = 0.043，同樣沒有事後成對比較；細節數與連貫性沒有差異（連貫性平均 Papeo 最低）。
- 摘要說「scaffolded navigation」：論文內導覽整體顯著、影片內定位成對顯著，但論文內定位（p = 0.348）與影片內導覽（p = 0.061）不顯著，正文只報了顯著的兩項，另兩項只在 Fig. 8。
- 內文小錯：§5.2.1 寫「ANOVA」卻給 Q 值；§5.2.3 引「Fig. 8」實際是 Fig. 9；§5.1.4 說「five questions」只列三句；§4.2.2 寫 6 位研究者、括號領域加起來 7。

## 與清單「要撐的結論」不合的地方

清單 L-1 列的文章引用：「16 人、NASA-TLX 5.50／5.31／4.50、p = 0.002、kappa 0.712、288 位使用者等」。逐項對過 Table 4、§5.1.5、§6，數字都對得上。要補註的是：

- NASA-TLX 的 p = 0.002 是三條件整體 Friedman，不是 Papeo 對其他條件。文章已照實寫（見下節）。
- 「NASA-TLX，7 點」：原文沒有明寫量尺，依據只有 Fig. 7 的 1–7 軸。
- 附錄的「每段連結的影片平均 24.3 秒」：原文表格沒有單位。

## 已發佈文章引用核對（`2026-10-13-video-beside-text-layout.md`）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| L8 description、L94 | Papeos 是研究介面之一，「論文配作者的演講影片」 | 標題與 §1 | 一致 |
| L9 tldr | 16 人實驗，影片片段掛在段落旁的那組心理負荷平均最低（三種條件的整體檢定顯著） | Table 4：4.50 最低，Friedman p = 0.002 | 一致 |
| L26 表 | 影片連到段落的那組比「各開一個視窗」更容易在影片裡找到位置、切換更多、心理負荷平均最低 | 影片內定位 W = 27、p = 0.034；切換 W = 0、p < 0.000；Table 4 | 一致。「找到位置」對應 orient，合理 |
| L61 | Papeos 讀了正文全部與附錄 | — | 讀取範圍描述，無法從原文核對 |
| L96 | 前導測試 4 人，並排，自由決定，四人都先看完影片才讀論文，想跳但對照成本太高 | L354–363 | 一致 |
| L98 | 探針介面、14 位研究者；5 人以讀論文為主、9 人跟著影片走；自動捲動 3 人說打斷、6 人說迷路 | L440–443、L469–473 | 一致 |
| L100 | 14 人裡 7 人反對用影片取代論文段落，理由是影片很少一一對應、會漏資訊；五條設計目標，兩條和版面有關（專心看其一也能切換；不遮住不取代） | L503–505；DG1、DG4 | 一致 |
| L102 | 筆記排在右側、大致對齊；點色條或筆記，縮圖原地變播放器並放大、顯示逐字稿；每則只播自己那段、播完就停，為的是不打斷已回去讀論文的人；自動播放時筆記固定、論文捲動 | L650–653、L685–690、L711–717、L757–763 | 一致。「為的是不打斷已經回去讀論文的人」是原文「users may start reading while the video note plays and forget to deactivate it … to minimize disruption」的合理轉述 |
| L104 | 16 位剛入行 HCI 研究者（12 博一到博三、4 碩士），讀三篇系統論文的系統章節，各 15 分鐘邊讀邊寫摘要；三種條件，論文加影片「各開一個分頁或視窗」 | L1058–1077、L1103–1104 | 一致 |
| L108 | 心理負荷 5.50／5.31／4.50，p = 0.002（三種條件的整體檢定） | Table 4 | 一致。「NASA-TLX，7 點」原文沒寫量尺，僅 Fig. 7 軸為 1–7 |
| L109 | 摘要涵蓋面 Papeos 最高、另兩者相近，p = 0.043 | L1317–1320；Fig. 10：61.46／63.69／76.93 | 一致 |
| L110 | 細節數、連貫性沒有差異，p = 0.368、0.250 | L1323–1325 | 一致 |
| L112 | 心理負荷只報整體檢定，沒報 Papeos 對論文＋影片的成對比較；時間壓力、費力、挫折、自評表現四項不顯著；Papeos 切換顯著多於論文＋影片；後者多數人先看完影片再只讀論文，和前導測試一樣 | Table 4；L1249–1253；L1296–1302 | 一致 |
| L114 | （作者自己的解讀）影片另放一處效果和沒有影片差不多；連到讀者所在位置才會交替使用；沒比較旁邊與浮動 | 原文 L1154–1155「the support was not perceived as significant until they were integrated into the reading experience in Papeos」；涵蓋面 Paper 與 Paper+Video 相近 | 已標為推論，方向有原文支持。注意 Fig. 7 任務容易 Paper+Video（4.62）介於兩者之間，不是和 Paper 完全一樣 |
| L116 | 限制：只用 HCI 系統論文、只讀一個章節、整場 90 分鐘 | §7.4 L1510–1513 | 一致 |
| L198 | 本站版面和 Papeos 的差別是影片固定一處、沒出現在段落旁邊 | §4.1 | 一致（描述本站做法，Papeos 部分對） |
| L224 | 樣本是 9、12、16 人；四個介面比的是「新介面對一般播放器」 | Papeos 16 人；對照是 Paper 與 Paper+Video | 一致 |
| L225 | Papeos 材料是論文配研討會演講影片，原文沒給影片長度，只說這類影片長度受限；讀者是研究生，15 分鐘寫摘要 | §7.2 L1441「talk videos are constrained in length」；原文確實沒給整支影片長度 | 一致。「研究生」：12 博士生＋4 碩士生，一致 |
| L230 | 推論之一：Papeos 的結果代表「影片要連到讀者所在的位置」 | — | 已標為推論 |
| L243 附錄 | 形成性 14 人：10 博、2 碩、1 博後、1 大學部，多數 HCI | L341–348 | 一致 |
| L243 | 比較實驗 16 人、90 分鐘、45 美元；三篇論文順序固定、條件順序平衡；摘要最多 14 句、不能複製貼上 | L1063–1070、L1078–1079、L1142–1143 | 一致 |
| L243 | 兩位沒看過實驗過程的作者盲評，Cohen's kappa 0.712 | L1165–1170 | 一致（另有 Krippendorff's alpha 0.744，文章沒引） |
| L243 | 任務容易 p = 0.030；論文內導覽 p = 0.035；影片內定位 Papeos 優於論文＋影片 p = 0.034 | L1153、L1274、L1286 | 一致 |
| L243 | 論文內捲動，Papeos 與只有論文相近，論文＋影片較少，p = 0.003 | L1310–1312；Fig. 9：53.75／39.44／57.94 | 一致 |
| L243 | 共同設計，14 位作者畫出八類，其中一類是可調整比例的左右並排 | Table 1（PDF 第 6 頁）八類；Adaptive side-by-side | 一致（這一類只有 P4 提出，文章沒說人數，不算錯） |
| L243 | 蒐集到的 Papeos 平均每份 20.6 組連結 | Table 5 | 一致 |
| L243 | 每段連結的影片平均 24.3 秒 | Table 5「Average Length of Linked Video Segment 24.3」 | **單位是文章補的**：原文表格沒寫單位。以三份 Papeo 19–29 的數值與演講長度推斷是秒很合理，但原文沒寫，建議改成「平均 24.3（原文沒標單位，推測是秒）」或不寫單位 |
| L243 | CSCW 2022 兩週 288 位不重複使用者，共 12 份 Papeos，平均每次使用 5.74 分鐘 | L1351–1359 | 一致（「每次使用」對應 session，原文是去除異常 session 後的平均） |
| L253 參考資料 | arXiv 連結，讀了正文全部與附錄 | arXiv 2308.15224 | 連結合法 |

## 讀取紀錄

- `papeos-flow.txt` 依序讀 L1–500、L501–1000、L1001–1450、L1451–1879（全檔 1,879 行，首尾相接，含參考文獻與附錄 A）。
- 對過 PDF 版面（`pdftoppm` 轉圖逐格看）：第 6 頁 Table 1、第 10 頁 Table 2、第 11 頁 Table 3、第 12 頁 Fig. 7（300 dpi 裁切）、第 13 頁 Table 4 與 Fig. 8（300 dpi 裁切）、第 14 頁 Fig. 9 與 Fig. 10、第 19 頁 Table 5。
- flow 版的 Table 4 被拆成一行一格，依 PDF 第 13 頁重組；Fig. 7–10 的平均與標準差只在圖上，文字層沒有，全部從圖讀出。
