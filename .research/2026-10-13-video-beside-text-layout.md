# Research: 讀者讀到一半想看影片時，畫面怎麼排

- 日期：2026-10-13（當天完成掃描、選讀、寫稿；23:40 之後依獨立審稿補讀與修正）
- 產出文章：`src/content/posts/learning/2026-10-13-video-beside-text-layout.md` 與 `-en.md`
- 原文與量測檔：`.work/video-layout-research/`（`SOURCES.md` 有檔案對照；`sites/` 是網站與本站的量測腳本、JSON、截圖）
- 審稿：`.work/reviews/2026-10-13-video-layout-review.md`

## 子問題

1. 把「文字」和「可跳轉的影片」放在一起的介面，研究系統怎麼排版？各自的使用者研究測了什麼、結果是什麼？
2. 文字與畫面的距離（split-attention／空間鄰近）對學習有沒有影響？近年的實驗有沒有重現？
3. 浮動或固定在畫面上的播放器，有沒有使用者反應的資料？
4. 實際的學習網站怎麼排？點逐字稿後畫面有沒有動？
5. 本站現在的做法在量測上是否如描述（寬度、位置保持、窄螢幕行為、不能嵌入的影片）？

子問題沒有事先列給使用者確認。這篇是使用者否決浮動播放器之後，主 session 當場查資料、再交給 fork 寫成文章的，流程上跳過了「先列子問題」。

## 步驟零：選案

### A. 研究系統

**母群定義**：有使用者研究的介面，把一段影片和可以點了跳到影片對應位置的文字（逐字稿、摘要、筆記、論文段落）放在同一個畫面。排除：只有影片內導覽（時間軸、章節）而沒有並列文字的；只產生摘要影片的；純註記工具。

**掃描管道**：只有兩組 Exa 搜尋（主 session 下的）加上入選論文的相關研究章節。沒有掃 ACM DL 的關鍵字檢索、Google Scholar 的被引用清單、教育科技期刊（Computers & Education、BJET、ETR&D）、學習科學研討會（L@S、LAK）。

- 搜尋一：`study of interactive transcript interfaces for lecture videos: layout of video and transcript side by side, click text to seek video, learner navigation behavior`
- 搜尋二：`2022-2025 HCI paper CHI UIST interface that links lecture video with text notes or article, learners navigate video by clicking text, user study results`
- 另有一組找回顧與統合分析的搜尋、一組找 split-attention 眼動研究的搜尋（用在子問題 2）。

**候選清單**（掃到的全部，不是只有入選的）：

| 系統 | 年份／場合 | 來源 | 處置 |
|---|---|---|---|
| Video Digests（Pavel 等） | 2014 UIST | 上一篇已讀 | 入選（只用版面描述） |
| LectureScape（Kim 等） | 2014 UIST | 搜尋一 | 入選 |
| Visual Transcripts（Shin 等） | 2015 SIGGRAPH Asia | 搜尋一 | 入選 |
| Papeos（Kim 等） | 2023 UIST | 搜尋二 | 入選 |
| NoteVideo（Monserrat 等） | 2013 CHI | 搜尋二；也是 Visual Transcripts 的對照組 | 未讀 |
| ViDeX（Fong 等） | 2018 | 搜尋一 | 未讀（重點在標註） |
| ClassTranscribe 字幕搜尋（Zhang 等） | 2021 ASEE | 搜尋一 | 未讀（搜尋行為，不是版面） |
| Grgurović 與 Hegelheimer 字幕對逐字稿 | 2007 | 搜尋一 | 未讀（語言學習） |
| DynamicSlide（Jung 等） | 2018 UIST poster | 搜尋二 | 未讀 |
| VideoSticker | 2022 IUI | 搜尋二 | 未讀（筆記工具） |
| NoteCoStruct | 2021 CHI EA | 搜尋二 | 未讀（筆記工具） |
| NoteLink | 2021 JCDL | 搜尋二 | 未讀（手寫筆記連回影片） |
| MaRginalia | 2025 CHI | 搜尋二 | 未讀（混合實境） |
| NoteIt | 2025 arXiv | 搜尋二 | 未讀 |
| SmartLearn（Sechayk 等） | 2024 CHI EA | 回顧那組搜尋 | 未讀 |
| VideoDoc、Codemotion、SceneSkim、Truong 等 2021 | 2015–2021 | Papeos 相關研究一節 | 未讀 |

**覆蓋矩陣**（入選四篇）：

| 維度 | Video Digests | LectureScape | Visual Transcripts | Papeos |
|---|---|---|---|---|
| 年代 | 2014 | 2014 | 2015 | 2023 |
| 影片類型 | 講課、演講 | 程式課短片 | 黑板式數學課 | 研討會演講 |
| 文字類型 | 摘要 | 逐字稿 | 逐字稿重排成講義 | 論文正文 |
| 影片位置 | 每章一個播放器 | 主畫面，逐字稿在右欄 | 文件為主，點了播放 | 段落旁的邊欄筆記 |
| 對照實驗 | 群眾外包瀏覽實驗 | 12 人，兩條件版面相同 | 9 人，三種介面 | 16 人，三種條件 |

**偏誤**：

- 四篇都出自人機互動場合，三篇有共同作者圈（Kim、Agrawala／Pavel 與 MIT、Berkeley、Adobe 一帶）。教育心理與教育科技期刊沒有被掃到。
- 入選理由是「搜尋結果裡看起來最接近」加上「拿得到全文」，沒有事先訂標準。2016–2022 之間一篇都沒選。
- 沒有刻意找結果相反或無效果的介面研究；LectureScape 的客觀表現不顯著是讀了才知道的。
- 候選清單裡的筆記工具被我歸為不相關，這個判斷只看了摘要。

### B. 學習網站

**母群**：公開、不登入就看得到「影片配逐字稿或文字」頁面的學習網站。**選了**：MIT OCW、Khan Academy、YouTube、TED、freeCodeCamp；**想量但量不到**：Coursera、edX（要登入）；**沒量**：Frontend Masters（要登入）、Udemy、LinkedIn Learning、中文平台（均一、Hahow、Bilibili）、各大學自己的課程頁。挑選標準是協調者指派訊息裡列的名單，不是抽樣。每站只量一頁。

## 來源清單與讀取完整度

✅ 讀了全文或讀完引用所在的各節；🟡 只讀到摘要或部分；🔴 沒取得。

| 來源 | 類型 | 程度 | 讀了什麼／阻礙 |
|---|---|---|---|
| Kim 等 2023 Papeos（arXiv 2308.15224） | 一手 | ✅ | 正文全部與附錄；參考文獻清單沒讀 |
| Shin 等 2015 Visual Transcripts | 一手 | ✅（演算法除外） | 第 1–3、5–8 節；第 4 節演算法只看各小節開頭。dl.acm.org 擋 curl，經 Exa 取得 |
| Kim 等 2014 LectureScape | 一手 | 🟡 | 介面一節、評估（設計、受試者、流程、三個 RQ 的結果）、限制句；導言、相關研究、各項技術的說明沒有依序讀 |
| Pavel 等 2014 Video Digests | 一手 | 🟡（本篇） | 本篇只用摘要與導言的版面描述；實驗在上一篇讀過 |
| Zhang、de Koning、Paas 2024 | 一手 | ✅（導言除外） | 摘要、方法全部、結果、討論、限制；導言 1.1–1.2 只讀了搜尋摘錄 |
| Noetel 等，總覽（預印本 osf.io/pynzr） | 二手（回顧的回顧） | 🟡 | 摘要、鄰近原則一節、調節變項一段、討論相關段、限制；其餘原則沒讀。下載到的是 docx |
| Navarrete 等 2025 | 二手（回顧） | 🟡 | 摘要、方法開頭、導覽工具、互動功能、效果整理一段、限制；Springer 擋 curl，經 Exa 取得 |
| CafeMedia 2021 | 廠商文章 | ✅ | 全文 |
| Coalition for Better Ads 標準頁、Large Sticky Ads 定義頁 | 業界標準 | ✅ | 兩頁 |
| WHATWG HTML Standard，iframe 一節 | 規格 | 🟡 | 只讀插入與移除步驟那幾段 |
| Schroeder 與 Cenkci 2018 | 一手（統合分析） | 🔴 全文 | 只有摘要。Springer 付費牆；OpenAlex 標 closed；ProQuest 只有預覽。數字改用 Noetel 轉引 |
| Kueker 與 Moore 2023（DOI 10.1111/jcal.12875） | 一手 | 🔴 全文 | 只有 Crossref 摘要（已存 `kueker-abstract.txt`）。Wiley 擋 curl，Exa 逾時；博士論文版在 MOspace 限校內 |
| Ploetzner 2022 | 一手（統合分析） | 🔴 全文 | 只有摘要。T&F 付費牆，Exa 只回摘要與作者簡介 |

## 抽取紀錄

### Papeos（Kim、Latzke、Bragg、Zhang、Chang，UIST 2023）

- **讀取紀錄**：`papeos-flow.txt` 共 1,879 行、105,447 字元。第 1–366 行（摘要、導言、相關研究、3.1–3.2）由主 session 經 ar5iv 讀取；第 370–1546 行（3.3 到結論）與第 1818–1879 行（附錄 A、表 5）在這個 fork 分段依序讀完；第 1547–1817 行是參考文獻，沒讀。
- **設計**：前導 4 人（並排的論文與影片，自由使用）；形成性研究 14 人用探針介面讀 20 分鐘，再做共同設計；比較實驗 16 人，受試者內，三種條件（Papeo／Paper+Video 各開分頁或視窗／只有 Paper），三篇系統論文順序固定、條件順序平衡，每篇 15 分鐘邊讀邊寫摘要。
- **被引用的結果**：
  - 前導 4 人都先看完影片再讀論文（3.2）：「they all watched the whole video first and then delved into the paper」。
  - 探針：5 人以論文為主、9 人以影片為主；自動捲動打斷閱讀 3/14、迷路 6/14（3.4.1）。
  - 7/14 反對取代內容（3.4.2）：「most participants (7/14) advocated against replacing content」。這是作者身分的共同設計階段。
  - 設計目標 DG1、DG4（3.4.3）。
  - 介面（4.1）：video notes 放在論文頁右側、對齊段落；點了在原地變播放器並放大；每則只播一段；自動播放時筆記固定、論文捲動。
  - 心理負荷 5.50／5.31／4.50，Friedman Q = 12.182，p = 0.002（表 4，5.2.1）。只有三條件的整體檢定。
  - 自評容易 p = 0.030；論文內導覽 p = 0.035；影片內定位（Papeo 對 Paper+Video）W = 27，p = 0.034；切換次數 p < 0.001；捲動 F = 7.065，p = 0.003（5.2.2–5.2.3）。
  - 摘要涵蓋面 F = 3.497，p = 0.043；細節 p = 0.368；連貫 p = 0.250（5.2.4）。
  - 部署：288 位不重複使用者、12 份、平均 5.74 分鐘（第 6 節）。
  - 表 5：每份平均 20.6 組連結、連結片段平均 24.3 秒。
  - 表 1：共同設計畫出的八類設計（Linked video popups、Overlaid videos、Video-based outline、Position-sensitive details、Guiding tooltips、Side commentary、Interweaved paper and video、Adaptive side-by-side），含「Adaptive side-by-side」（P4）。
- **作者列的限制**（7.4）：只用 HCI 系統論文、只讀一個章節、整場 90 分鐘；影片對互動或動態成果較有用。7.3：演講只涵蓋論文的一部分，有些段落沒有影片可看。
- **與摘要不一致**：逐項對過，沒有。導言寫部署「over 250 unique visitors」，第 6 節是 288。原文沒有給演講影片的長度。

### Visual Transcripts（Shin、Berthouzoz、Li、Durand，ACM TOG 34(6)，2015）

- **讀取紀錄**：`vt.txt` 共 337 行、58,980 字元（Exa 轉出的 markdown，段落很長）。第 1–82 行（摘要、第 1–3 節、第 4 節開頭）、第 218–331 行（第 5–8 節、圖說、致謝）依序讀完；第 83–217 行（4.1–4.3 演算法）只看了各小節第一句；第 332 行以後是參考文獻，沒讀。
- **設計**：9 人（2 女 7 男，20–35 歲），三支大學數學講課（8、7.2、8 分鐘），三種介面（YouTube 播放器加互動逐字稿／NoteVideo／Visual Transcript 連回影片），受試者內、拉丁方平衡。任務：3 分鐘摘要；三類搜尋（畫面、文字、情境）。
- **被引用的結果**（6.1）：
  - 摘要主要重點 0.83／0.81／0.87，F(2,24) = 0.23，p = 0.79；細節 0.50／0.56／0.58，p = 0.62（表 1）。
  - 文字與情境搜尋：Kruskal-Wallis χ² = 0.82，p = 0.676。畫面搜尋 NoteVideo 最快。
  - 搜尋任務合計：「The difference between ours and the baseline was statistically significant with the Mann-Whitney U (MWU) test (Z = −2.1, p = 0.02), whereas the difference between ours and NoteVideo was not (Z = 1.2, p = 0.12)」。
  - 錯誤率 0.06／0.07／0.15，不顯著。
  - 逐字稿有用程度 6.3 對 4.7（7 點）；用基準介面時受試者多半拖時間軸。
  - 偏好：學習 7/9 選 Visual Transcripts；摘要任務 5/9 選 NoteVideo、4/9 選自己的。
- **作者列的限制**（第 7 節）：只處理黑板式影片；分段會有切太粗或太細的失敗；靜態版面無法還原游標指著說的「here」。
- **與摘要不一致**：摘要說「users prefer our interface for learning and … effective in helping them browse or search」；內文多數差異不顯著，只有搜尋合計對基準顯著。第一版文章漏了這個顯著結果，審稿指出後補上。

### LectureScape（Kim、Guo、Cai、Li、Gajos、Miller，UIST 2014）

- **讀取紀錄**：`ls-flow.txt` 共 915 行、58,870 字元（先前誤記成 644，那是 `lecturescape.txt` 版面保留版的行數）。讀了第 1–12 行（標題作者）、第 488–500 行（介面）、第 520–545 行（評估與設計）、第 579–700 行（受試者、流程、結果到 RQ3）；第 13–487 行（導言、相關研究、各項技術）與第 701 行以後（討論從第 757 行、參考文獻從第 808 行）沒有依序讀，只看過關鍵字命中的幾行。
- **設計**：12 人，受試者內，LectureScape 對拿掉觀看紀錄功能的基準；兩者版面相同、都有互動逐字稿。八個任務，75 分鐘。
- **被引用的結果**：版面描述（「video player in the main view … interactive transcript is in the right sidebar」）；找答案 96 對 106 秒，MWU p = 0.8；主觀速度 5.8 對 4.8、效率 6.1 對 4.8（p < 0.05）；易用性 4.7 對 6.3；基準介面 10/12 用搜尋、11/12 點逐字稿，LectureScape 各 6/12；功能齊全 6.4 對 4.3。
- **作者列的限制**：單場實驗看不出個人書籤等功能的用處；介面被認為複雜。
- **與摘要不一致**：摘要已寫「no significant differences were found in task performance」，相符。

### Zhang、de Koning、Paas（2024，Applied Cognitive Psychology 38(4)）

- **讀取紀錄**：`zh-flow.txt` 共 1,855 行、63,100 字元（雙欄交錯）。讀了第 605–930 行（方法全部）、第 930–1000 行與第 1200–1600 行（結果、討論、限制）；第 1–604 行（摘要、導言）只讀了摘要與搜尋摘錄；第 1649 行以後是參考文獻。
- **設計**：146 名大學生，2 × 2 受試者間（分開或整合 × 大或小），四組 35／37／37／37；腎元圖文教材，螢幕呈現 1700 × 1002 或 1100 × 648 像素；學習 12 分鐘；記憶 10 題、理解 24 題、外在認知負荷 4 題量表。
- **被引用的結果**：格式、大小、交互作用在記憶、理解、外在負荷上都不顯著（3.2.1–3.2.3），貝氏因子多數標為 substantial evidence for null。討論：「we failed to replicate the results」（指 Zhang 等 2023）。轉引 Schroeder 與 Cenkci：紙本研究效果大於螢幕研究。
- **作者列的限制**（4.1）：媒介由紙本改螢幕；兩種大小差距可能不夠；量表與姿勢等小改動；12 分鐘可能足以讓學習者自行消化負荷；需要完全相同的直接複製。
- **與摘要不一致**：逐項對過，沒有。

### Noetel 等（預印本）

- **讀取紀錄**：`noetel.txt` 共 818 行、124,427 字元。讀了第 78 行（摘要）、第 125–148 行（方法摘段）、第 174–177 行（鄰近）、第 199 行（調節變項）、第 203–209 行（討論開頭）、第 230–237 行（限制與結論的開頭幾句）。其餘沒讀。
- **被引用的結果**：29 篇回顧、1,189 個研究、78,177 人（摘要；內文流程寫 79,415）；空間鄰近 g = 0.63，95% CI [0.55, 0.71]，k = 58，轉引 Schroeder 與 Cenkci 2018；步調：系統控制 g = 0.41 [0.33, 0.49]、學習者控制 g = 0.27 [0.19, 0.35]，p = 0.02；複雜教材 g = 0.70、簡單 g = 0.20。
- **與摘要不一致**：受試者總數摘要與內文不同。

### Navarrete 等（2025，IJAIED）

- **讀取紀錄**：`navarrete.txt` 約 120,728 字元。讀了第 1–39 行的摘要、第 75–80 行（方法）、第 97 行（57% 工具、25% 對照實驗；初稿這個數字取自搜尋摘錄，2026-10-14 複審後回原文讀了這一段）、第 127、133、221–225、285、307、327、331、387、465、491、501–506 行。沒有依序讀全文。
- **被引用的結果**：257 篇、2016–2021、PRISMA、三個資料庫；57% 工具、25% 對照實驗；目錄導覽與可點時間軸「generally found a positive effect on the learning outcome. However, this was not always significant … or was examined combined with other features」；無法做統合分析；約 80% STEM、投影片式最常見。

### CafeMedia（2021-08-26）與 Better Ads

- **讀取紀錄**：`cafemedia.txt` 正文從「Ensuring a great reader experience」到「Making sticky decisions」全部讀完。`betterads-sticky.txt` 定義段全讀；`betterads.txt` 標準頁只讀了清單與「More than 150,000 consumers」那一段。
- **被引用的結果**：桌機浮動播放器「closed less than 10% of pageviews」；手機固定元素超過 30% 時關閉率上升（「thousands of CafeMedia sites」）；讀者不分廣告與內容；375 × 667 的手機上 272 × 153 的播放器佔 17%；固定的頁首也會拉高關閉率（建議 50px 以內）。Better Ads：Large Sticky Ads「takes up more than 30% of the screen's real estate」。
- **限制**：廠商文章，沒有方法說明；量的是關閉率。CafeMedia 寫 Better Ads 的研究有 66,000 人，Better Ads 自己的頁面寫超過 150,000 人。

## 事實交叉表

只放來源說的。

| 事實 | 來源 | 狀態 |
|---|---|---|
| 並排但沒有連結時，讀者先看完影片再讀文字 | Papeos 前導（4 人）與比較實驗的 Paper+Video 條件 | ✅ 同一篇的兩處觀察 |
| 影片連到段落後，心理負荷較低、切換較多 | Papeos（16 人，整體檢定） | ✅ 單一來源 |
| 逐字稿放在播放器旁是 2014 年前後的常見排法 | LectureScape（基準介面「to emulate … edX or YouTube」）、Visual Transcripts（導言提到 Khan Academy 與 YouTube 的同步逐字稿） | ✅ 兩篇 |
| 排成文件的版本，搜尋合計快於播放器加逐字稿 | Visual Transcripts（9 人，p = 0.02） | ✅ 單一來源，樣本小 |
| 空間鄰近有中等以上效果 | Noetel 轉引 Schroeder 與 Cenkci（g = 0.63） | 🟡 轉引，原文未讀 |
| 同一份教材在螢幕上沒有重現 split-attention 效果 | Zhang 等 2024（146 人） | ✅ 一手 |
| 自控步調時設計原則的效果較小 | Noetel（0.27 對 0.41） | ✅ 預印本 |
| 雙螢幕並排的負荷指標高於單螢幕切換 | Kueker 與 Moore 2023 | ⚠️ 只有摘要；文章只寫有這篇研究，不寫結果 |
| 帶題目的影片優於只有導覽功能的影片 | Ploetzner 2022 | ⚠️ 只有摘要；文章只寫有這篇研究，不寫結果 |
| 導覽功能對學習成果大致正面但不一定顯著 | Navarrete 等 2025 | ✅ 讀過該段 |
| 手機上固定元素超過 30% 時讀者關得多 | CafeMedia；30% 的定義在 Better Ads | ✅ 廠商資料 |
| iframe 移出文件時內容文件被銷毀 | WHATWG HTML Standard | ✅ |
| TED 窄視窗固定區域 275px（33%）、Khan 點逐字稿頁面不動等 | 本篇量測（`sites/results*.json`） | ✅ 各一頁 |
| 本站 752→688px、750×421→678×381、位移 0.2 與 0.1px | `sites/own-site-results.json`（2026-10-13 23:51） | ✅ |
| CS229 第 2 堂不能嵌入、CS50 AI 七支可以 | yt-dlp `playable_in_embed`；正式站第 2、3 堂畫面 | ✅ |

**衝突**：統合分析（經 Noetel 轉引）說整合式設計有效果；Zhang 等 2024 沒有重現，並列出 Cammeraat 2020、Pouw 2019、Zhang 2022 同樣沒有重現。文章並列，沒有選邊。

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| Papeos 的結果代表影片要連到讀者所在的位置 | Paper+Video 與只有 Paper 的心理負荷相近（5.31 對 5.50），Papeo 最低 | 沒有成對檢定；材料是論文配短演講；Papeo 同時多了色條、縮圖、同步標示，分不出是哪一項的作用 |
| 自控步調的讀者受版面影響較小 | Noetel 的步調調節 | 那是跨多種設計原則的平均，不是專指版面；網頁讀者未必真的會暫停 |
| Better Ads 的 30% 可以拿來衡量讀者自己叫出來的影片 | CafeMedia 說讀者不分廣告與內容 | 那句話出自廣告代管商；TED 就這樣做而且沒有理由認為它失敗 |
| 時間連結的用處在定位，學習靠作答 | Navarrete 對導覽功能的整理；上一篇的暫停寫解釋實驗 | Ploetzner 的統合分析沒讀到全文；沒有研究直接比較「只有時間連結」與「時間連結加題目」的文章 |

## toolDegradation

| 步驟 | 結果 |
|---|---|
| Groundlane MCP／HTTP | 沒有嘗試（同一天稍早的 session 記錄它回 401） |
| Keenable、You.com | 沒有嘗試 |
| Firecrawl | 402，額度用完 |
| Jina | 沒有嘗試（同日稍早記錄額度用完） |
| Exa `web_search_exa`／`web_fetch_exa` | 主要管道。Visual Transcripts、Navarrete、Schroeder 摘要經它取得；Wiley 那頁逾時 |
| curl | arXiv、哈佛、TU Delft、OSF、CafeMedia、Better Ads、WHATWG 成功；Springer、ACM DL、Wiley、T&F、Sage 被擋 |
| OpenAlex、Crossref API | 查開放取用位置、摘要、更正紀錄 |
| Playwright（本機 Chrome） | 網站與本站量測 |

沒有照 CLAUDE.md 的 fallback 順序從 Groundlane 開始，是直接沿用主 session 已經在用的 Exa。

## 更正與撤稿查核

2026-10-13 23:50 用 Crossref `filter=updates:<DOI>` 查：Papeos（10.1145/3586183.3606770）、LectureScape（10.1145/2642918.2647389）、Visual Transcripts（10.1145/2816795.2818123）、Video Digests（10.1145/2642918.2647400）、Zhang 等（10.1002/acp.4223）、Noetel 等正式版（10.3102/00346543211052329）、Navarrete 等（10.1007/s40593-025-00481-x），全部 0 筆更正或撤稿。沒有查 Retraction Watch。

## 待解問題

- 四個研究系統之外的同類系統都沒讀；2016–2022 是空的。
- Schroeder 與 Cenkci、Kueker 與 Moore、Ploetzner 三篇全文沒有取得。
- LectureScape、Noetel、Navarrete 不是從頭依序讀完，照 deep-research 2.5 的標準只能算部分精讀。
- 多支影片的切換只讀程式，沒有實測。
- 手機：只有把桌機瀏覽器縮窄的量測，沒有真機，也沒有研究。
- 沒有經過「沒參與精讀的 agent 抽查三個數字」這一步；獨立審稿者對過文章引用的數字，但不是隨機抽查抽取紀錄。
