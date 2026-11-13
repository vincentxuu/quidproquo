# 抽取紀錄：Kim、Guo、Seaton、Mitros、Gajos、Miller 2014，Understanding In-Video Dropouts and Interaction Peaks in Online Lecture Videos（L@S 2014）

- **書目**：Juho Kim（MIT CSAIL）、Philip J. Guo（University of Rochester）、Daniel T. Seaton（Office of Digital Learning, MIT）、Piotr Mitros（edX）、Krzysztof Z. Gajos（Harvard SEAS）、Robert C. Miller（MIT CSAIL）。Understanding In-Video Dropouts and Interaction Peaks in Online Lecture Videos. *Proceedings of the First ACM Conference on Learning @ Scale (L@S 2014)*，2014 年 3 月 4–5 日，Atlanta，頁 31–40。DOI **10.1145/2556325.2566237**（Crossref 2026-10-14 查核：題名、六位作者全名、頁碼 31–40）。作者全名與單位對過 PDF 首頁。
- **注意：PDF 首頁版權欄印的 DOI 是 10.1145/2556325.2566239**（flow txt L60），那是同場 Guo、Kim、Rubin 那篇的 DOI。這是原檔印錯，引用時用 Crossref 的 …2566237。
- **版本**：會議論文定稿（首頁有 ACM 版權聲明），10 頁。
- **原文檔**：PDF `.work/video-guide-research/dl2/kim.raw`（4,960,816 位元組，sha256 開頭 7d01cf863029675a）。2026-10-14 從作者 Gajos 的個人頁 https://kgajos.seas.harvard.edu/papers/kim14video.pdf 重新下載，`cmp` 與本機檔位元組相同，確認是作者公開版本。
- **讀的文字檔**：清單列的 `dl2/kim.txt` 是 `-layout` 雙欄版（633 行、69,255 字元），沒用。改用不帶 `-layout` 重轉的 `.work/video-guide-research/dl2/kim.flow.txt`（904 行、50,175 字元），下面行號都是這個檔的行號（簡寫 L）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 5 篇（影片，`src/content/posts/learning/2026-10-13-instructional-video-in-articles.md`）。

## 研究設計

- **類型**：回溯式記錄分析（log analysis），加上對 80 支影片的人工質性分類。沒有實驗操弄、沒有對照組、沒有學習成效測量。
- **資料**：edX 2012 年秋季四門課的影片播放器互動記錄（L167–168）。四門課：MIT 6.00x（入門 CS 與程式設計）、Harvard PH207x（公衛統計）、Berkeley CS188.1x（人工智慧）、MIT 3.091x（固態化學）。Table 1（PDF 第 3 頁，已對版面）：

  | 課 | 學生數（至少看過一支影片） | 影片數 | 平均片長 | 處理的事件數 |
  |---|---|---|---|---|
  | 6.00x | 59,126 | 141 | 7:40 | 4,491,648 |
  | PH207x | 30,742 | 301 | 10:48 | 15,832,069 |
  | CS188.1x | 22,690 | 149 | 4:45 | 14,174,203 |
  | 3.091x | 15,281 | 271 | 6:19 | 4,821,837 |
  | 合計 | 127,839 | 862 | 7:46 | 39,319,757 |

  「Processed Events」是播放與暫停事件總數（L241–242）。
- **選課理由**：同一時期開課，減少平台、記錄方式、學生組成變動的影響；跨機構、學科（CS、統計、化學）與錄製風格（L177–180）。
- **人工標註**：一位作者把全部影片標上類型（introduction、tutorial、lecture）與呈現風格（投影片、程式編輯器、頭像、教室錄影、Khan 式手寫板）（L180–184）。
- **處理流程**：把原始記錄還原成每人的觀看片段，再彙整成影片每一秒的觀看人數、不重複觀看者、重看次數、播放事件、暫停事件（L187–247）。重看次數「不是每人一次」：同一人把一段看五次就加五（L346–348）。
- **三項分析**：(1) 影片內中途離開率；(2) 互動高峰（重看高峰、播放事件高峰）；(3) 抽 80 支影片人工分類高峰成因。
- **何時量**：課程結束後離線分析（L777）。

## 結果（逐項）

### 分析 1：中途離開率（Analysis 1，L253–327）

- **定義**：開始看但在影片播完前離開的比例；算法 1.0 − viewcount(n)/viewcount(0)（L255–266）。作者註明 edX 影片開頁就自動播放，可能影響結果（L266–268）。
- **整體**：「On average across all videos, about 55.2% of viewing sessions (std=14.7) were dropouts before the end.」（L271）離開者中 36.6%（std = 11.1）發生在影片長度的前 3%（L272–273）。
  - 原文接著寫「This means that 18.6% of the dropouts occur during the rest of the length.」（L273–274）。55.2 − 36.6 = 18.6，但 36.6% 是「離開者中的比例」，18.6% 的算法與前句單位不一致；原文如此，照記，不推算。
- **片長**：片長取對數後顯著預測離開率，b = 0.13，t(848) = 32.22，p < .001；adjusted R² = 0.55，F(1, 848) = 1038（L289–292）。預測值：5 分鐘影片 53%（前 3% 內 35%），20 分鐘影片 71%（前 3% 內 47%）（L293–295）。
  - 圖 1 圖說寫「The model fits the data well with r=0.55 with 95% CI = [0.50, 0.59]」（L282–284），正文寫 adjusted R² = 0.55；圖說的 r 與正文的 R² 是同一個數字，兩者至少有一個用詞不精確。原文如此，照記。
  - 作者引 Guo 等 [10]：觀看時間在片長超過 6 分鐘後明顯下降，並說兩者量法不同（L297–301）。
- **重看者 vs 第一次看**：「the dropout rate of re-watchers (78.6%, std=54.0) was much higher than that of first-time watchers (48.6%, std=34.0). A Mann-Whitney's U test shows a significant effect (Z = -30.7, p <0.001, r = 0.74).」（L314–317）作者的解讀：重看者「might have more specific information needs and selectively watch a video」（L304–313）。圖 2 圖說：「which might mean that re-watching students watch videos more selectively with a more specific need」（L309–311）。
- **操作教學 vs 講課**：「Tutorial videos showed higher dropout rate (61.3%, std=38.3) than lecture videos (54.1%, std=36.3).」Z = −5.29，p < .001，r = 0.18（L320–323）。兩類平均片長沒有顯著差異（p > .05）（L325–327）。

### 分析 2：互動高峰（Analysis 2，L328–556；Table 2 在 PDF 第 6 頁，已對版面）

- **兩種高峰定義**（L343–352）：重看高峰（re-watching session peak，排除第一次觀看）；播放事件高峰（play event peak，排除影片開頭的自動播放）。
- **方法**：一秒一格分箱，lowess 平滑（參數 0.02），再用 TwitInfo 演算法的變體偵測高峰（L355–372）。兩種高峰重疊時算一個，取重看高峰（L389–392）。高度、寬度、面積都正規化到 0–1（L401–406）。
- **整體**（L410–416）：每支影片平均 3.7 個高峰（std = 2.1）；其中重看高峰 2.2（std = 1.8）、播放高峰 2.3（std = 1.5），含每支 0.8 個重疊。平均片長 7.8 分鐘，約每兩分鐘一個高峰；有的影片多達 11 個，有的沒有明顯高峰。
- **形狀**：平均寬度 2.7%（std = 3.5）、中位寬度 9 秒（L377–378）；平均高度 7.7%（std = 10.4）（L418）；平均面積 4.1%（std = 4.5）（L428–429）。
- **操作教學 vs 講課**（L436–443）：高峰數 4.1（std = 1.9）對 3.6（std = 2.0），Z = −2.6，p < .01，r = 0.09；操作教學的高峰也較寬（r = 0.06）、較高（r = 0.13）、面積較大（r = 0.10），都 p < .001。
- **重看 vs 第一次看**（L462–550）：「The mean number of peaks in re-watching sessions was 2.2 (std=1.7), whereas the mean was only 1.0 (std=1.3) in first-time sessions.」Z = −14.7，p < .001，r = 0.35。重看高峰較寬（r = 0.07）、較高（r = 0.45）、面積較大（r = 0.05）。作者：高度的效果量遠大於寬度與面積，「This suggests that students selectively pick parts to re-watch rather than watch through sequentially.」（L553–556）
- **Table 2 與正文矛盾（PDF 版面確認）**：Table 2 欄位依序是 All｜Lecture｜Tutorial｜First timers｜Re-watchers，「Peaks per Video」列是 3.7｜3.6｜4.1｜**2.2**｜**1.0**；Normalized Height 7.7%｜7.1%｜10.2%｜1.5%｜3.1%；Width 2.7%｜2.6%｜3.1%｜3.2%｜3.7%；Area 4.1%｜3.9%｜4.8%｜4.1%｜4.7%。表中 First timers 2.2、Re-watchers 1.0，與正文（重看 2.2、第一次 1.0）**相反**；表的圖說又寫「re-watching sessions resulted in more peaks than first-time sessions」，與正文一致。表中高度、寬度、面積是 Re-watchers 較大，也與正文一致。所以高峰數那一格很可能是表內兩欄對調，但這是推測，引用時以正文為準並註明表內不一致。
- **作者對差異的解釋**：操作教學是逐步指示，學生照自己的速度跟做，高峰多在步驟交界；講課結構較連續，高峰多和畫面切換或重要概念的講解有關（L445–459）。

### 分析 3：高峰的五類成因（Analysis 3，L567–709；Table 3 在 PDF 第 6 頁，已對版面）

- **方法**：從 862 支抽 80 支（9.3%），兼顧片長、講課與操作教學、製作風格，每門課 20 支（L594–595）。兩階段：先由研究者看影片、用開放式卡片分類法歸出類別；再由一位研究者把 80 支影片的全部高峰標進類別（L596–615）。輔助資料：播放事件、重看次數、相鄰畫格像素差（Manhattan distance，每秒取一格）（L588–593）。
- **分類不是定論**：「While our categorization is not conclusive, it provides an explanation of which semantic and contextual aspects of video might be responsible for a peak.」（L572–573）
- **畫面切換的定義**：呈現風格之間的轉換（投影片、程式、頭像、教室、攝影棚、Khan 式手寫板、示範影片），不含同一風格內的漸進變化，例如打一行新程式碼、加底線、在教室裡走幾步（L576–585、L564–565）。
- **61%**：「Overall, 61% of the categorized peaks involved a visual transition before, and/or after the peak.」（L618）摘要的寫法是「61% of the peaks accompany visual transitions in the video」（L31–32）。
- **Table 3（全部｜講課｜操作教學）**：
  - Type 1 新內容開頭 25%｜30%｜12%
  - Type 2 回頭看剛消失的內容 23%｜25%｜15%
  - Type 3 跟著教學步驟 7%｜0%｜30%
  - Type 4 重播一小段 6%｜7%｜1%
  - Type 5 沒有畫面切換的口頭解釋 39%｜38%｜42%
  - 影片數 80｜61｜19；每支高峰數 3.6｜3.6｜3.5
  - 表說：「Only Type 5 does not involve a visual transition.」三欄各加總都是 100%。Type 1–4 合計 61% 與正文一致。
- **各類描述**：
  - Type 1（L619–628）：畫面切換在高峰**之前**；學生跳到新單元開頭。作者說這些點可能是把長影片切短的好位置。
  - Type 2（L629–653）：畫面切換緊接在高峰**之後**；消失的多半是投影片、程式碼片段、板書，不是頭像或遠景。作者解讀為節奏問題：「The visual transition was maybe too abrupt, not giving enough time for students to fully digest the content that disappeared.」（L637–638）另一個解讀：這時畫面上常是完成的內容（完整程式、完整條列），重看的人想直接跳到最終結果。
  - Type 3（L654–684）：學生在動作發生前暫停或重播，可能是在自己的工具裡照做。
  - Type 4（L712–720）：前後都有畫面切換，學生對中間那段有興趣；例子是講者短暫展示的示範程式。
  - Type 5（L662–672）：附近沒有畫面切換，觸發的是口頭內容，例如介紹重要概念、重述已用畫面講過的東西，或講笑話引起笑聲。
- **類別間比較**（L686–709）：有畫面切換的高峰（Type 1–4）比 Type 5 高（Z = −3.0，p < .01，r = 0.18）、面積大（Z = −1.9，p < .05，r = 0.11），寬度沒有差異。Kruskal-Wallis：類別對高度有顯著效果，χ²(4) = 19.6，p < .001；事後檢定 Type 3 顯著高於 Type 1（p < .01，r = 0.33）與 Type 5（p < .001，r = 0.32）；寬度與面積沒有顯著效果。

### 設計建議（L710–779）

作者列的建議，原文標成 [authoring] 或 [interface]：避免突兀的畫面切換（Type 2），並把資訊性投影片以截圖或縮圖放在影片外；做短一點的影片，切點可用 Type 1 高峰；操作教學影片的步驟做成一鍵跳轉；為重點處提供互動連結與截圖（Type 2、Type 5）；為選擇性觀看者考慮影片摘要。主要發現的總結句：「A primary finding from both the dropout and peak analyses is that students selectively pick parts of videos to watch.」（L724–725）這些是作者從觀察推出的建議，論文沒有測試。

## 作者自己列的限制（LIMITATIONS，L780–792；另散見正文）

- 看得出瀏覽模式，但很難知道為什麼；記錄不能代表學習者真正的意圖（例如開了影片但沒看）（L782–785）。
- 影片互動可能受作業、討論區、考試等其他教學元素影響；呈現品質或故事線也可能影響學生回看哪裡，分析沒有納入（L785–789）。
- 沒有區分學習者目標（完成、旁聽、脫離）（L789–790）。
- 自動播放可能影響離開率（L266–268）；分類不是定論（L572）。
- 未來想分析人文與專業課程，與現有的理工課比較（L800–802），表示目前只有理工類課程。

## 與摘要說法不一致的地方

- 摘要說「61% of the peaks accompany visual transitions」（L31），正文是「61% of the categorized peaks」（L618），母體是 80 支抽樣影片的高峰，不是全部 862 支。摘要前文有交代「by sampling 80 videos」，不算矛盾，但單獨引 61% 時要帶上抽樣範圍。
- 摘要與正文都說重看帶來「more frequent and sharper peaks」；Table 2 的高峰數那一格與此相反（見上），屬表內錯置，不是摘要問題。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單 V-4 列的「文章引用了什麼」：862 支影片、重看者離開率 78.6% 對 48.6%、61.3%／54.1%、每支 3.7 個高峰、五類成因、61% 伴隨畫面切換。

- 862、78.6／48.6、61.3／54.1、3.7、五類、61% 都在原文找得到，數字正確。
- 61% 的母體是 80 支抽樣影片中被分類的高峰，不是全部影片（見上）。
- 3.7 是重看高峰與播放高峰合計（含重疊 0.8），不是單一種高峰。

## 已發佈文章引用核對（第 5 篇，現行檔行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 120 | edX 四門課 862 支影片的逐秒操作紀錄 | Table 1；「second-by-second user interaction data from 862 videos in four MOOCs」（L25–26） | 一致 |
| 120 | 重看的人中途離開的比例比第一次看的人高得多 | 78.6% 對 48.6%，Z = −30.7（L314–317） | 一致 |
| 120 | 作者的解讀是重看的人目標明確，看完要的那段就走 | 「might have more specific information needs and selectively watch a video」（L304–313），作者用 might | 大致一致；「看完要的那段就走」是改寫，原文沒有這麼具體，語氣也比原文肯定 |
| 122 | 抽樣 80 支影片，逐一標註互動高峰發生在哪裡 | 抽 80 支，標的是每個高峰屬於哪一類成因（L594–615） | 大致一致；原文標的是「成因類別」，不只是位置 |
| 122 | 高峰指重看次數或播放操作突然變多的時間點 | 兩種高峰定義（L343–352） | 一致 |
| 122 | 五類成因的名稱 | Table 3、L619–672 | 一致 |
| 122 | 61% 的高峰前後有畫面切換，例如投影片切到講者 | L618；切換例子「from a slide to a talking head」（L580） | 一致；母體是 80 支抽樣影片（文章前一句已交代抽樣） |
| 122 | 其餘都屬於最後一類，也是五類裡最多的 | 表說「Only Type 5 does not involve a visual transition」；Type 5 = 39% 為最大類 | 一致 |
| 124 | 讀者會回頭找「畫面剛換掉來不及看」和「老師口頭解釋的那一段」 | 文章已標為作者推論；對應 Type 2（23%）與 Type 5（39%） | 推論，已標明；與原文分類相容 |
| 224 | Guo 與 Kim 量的是操作紀錄 | Kim 量的是播放器互動記錄 | 一致 |
| 229 | edX 資料來自 2012 年秋季的四門理工課 | 四門是 CS、公衛統計、AI、固態化學；Kim 原文說「science and engineering courses」（L802） | 一致（PH207x 是公衛統計，原文自己也歸為理工類） |
| 229 | 那些影片平均不到 8 分鐘 | 7:46（Table 1）；正文另寫 7.8 分鐘（L414） | 一致 |
| 242 | 同一批四門課，862 支影片，平均長度 7 分 46 秒 | Table 1 | 一致 |
| 242 | 重看者 78.6%、第一次 48.6%；操作教學 61.3%、講課 54.1% | L314–323 | 一致 |
| 242 | 高峰有兩種，每支影片平均偵測到 3.7 個 | L410–412 | 一致（3.7 是兩種合計並扣重疊） |
| 242 | 抽樣 80 支（講課 61、操作教學 19），五類占比 25／23／7／6／39% | Table 3 | 一致 |
| 242 | 作者說這個分類不是定論 | 「not conclusive」（L572） | 一致 |
| 264 | 參考資料連結 kgajos.seas.harvard.edu，「讀了摘要與三項分析」 | 作者個人頁，合法 | 連結合規；讀取範圍描述可更新為「讀了全文」 |

文章沒有引用 Table 2，因此 Table 2 的對調不影響現稿。文章沒列 DOI；若之後補 DOI，要用 10.1145/2556325.2566237，不要抄 PDF 首頁印錯的 …2566239。

## 讀取紀錄

- `dl2/kim.flow.txt` L1–904 依序讀完（一次讀入，首尾相接）：L1–45 題名、作者、摘要、關鍵詞；L46–115 導言（中間 L50–69 是首頁版權欄與作者單位）；L116–164 相關研究；L165–252 資料集與處理流程（含 Table 1）；L253–327 分析 1；L328–556 分析 2（含 Table 2、Table 3 的文字層）；L557–709 分析 3（含圖說）；L710–779 設計建議與分析平台；L780–792 限制；L794–810 未來工作、結論、致謝；L811–904 參考文獻（掃過）。
- 對 PDF 版面：第 1 頁（首頁、DOI 欄）、第 3 頁（Table 1、圖 1）、第 6 頁（Table 2、Table 3、圖 5）轉圖逐格看過。flow 文字層的表格數字與版面一致；Table 2 的欄序以版面確認。
