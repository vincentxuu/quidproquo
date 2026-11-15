# 抽取紀錄：Shin、Berthouzoz、Li、Durand 2015，Visual Transcripts: Lecture Notes from Blackboard-Style Lecture Videos（ACM TOG 34(6)）

- **書目**：Hijung Valentina Shin, Floraine Berthouzoz, Wilmot Li, Frédo Durand. 2015. Visual Transcripts: Lecture Notes from Blackboard-Style Lecture Videos. *ACM Transactions on Graphics* 34(6), Article 240 (November 2015), 10 pages（SIGGRAPH Asia 2015 Technical Paper）。DOI 10.1145/2816795.2818123。作者全名與單位對過 PDF 首頁（Shin、Durand：MIT CSAIL；Berthouzoz、Li：Adobe Research）。
- **原文檔取得網址**：ACM Digital Library 出版者版 https://dl.acm.org/doi/pdf/10.1145/2816795.2818123?download=true 。OpenAlex（2026-10-14 查，mailto 用占位 email）列 `is_oa: True`、`oa_status: bronze`、`version: publishedVersion`，唯一位置就是 ACM DL；ACM 自 2026 年起全面開放。curl 被 Cloudflare 擋（403），2026-10-14 改用 Playwright 驅動的本機 Chrome 先開論文頁、再以同一瀏覽器工作階段下載 PDF（HTTP 200，`application/pdf`）。
- **本機檔（新存）**：`.work/video-layout-research/vt-acm.pdf`（5,750,163 位元組，10 頁）；精讀用 `.work/video-layout-research/vt-acm-flow.txt`（`pdftotext` 不帶 `-layout`，1,182 行、60,412 位元組）。舊檔 `vt.txt`（Exa 轉的文字，58,980 位元組）沒有用，由新檔取代。
- **版本**：期刊刊出版（ACM 排版，頁首「ACM Transactions on Graphics, Vol. 34, No. 6, Article 240」）
- **讀取日期**：2026-10-14
- **供哪篇使用**：系列第 6 篇（版面，`src/content/posts/learning/2026-10-13-video-beside-text-layout.md`，清單代號 L-3）

## 研究設計

- **類型**：系統論文（演算法＋版面）＋小型受試者內使用者研究。
- **系統**（§3–4）：處理黑板式講課影片（「a (possibly infinite) blackboard where the instructor writes down by hand」，L93–94）。把筆畫用類似 Knuth–Plass 斷行的動態規劃切成「visual entities」（算式、圖、一行字），依時間對齊逐字稿；畫圖時說的句子（≥ 75% 時間與某個 entity 的繪製重疊）歸為 depictive、預設隱藏，其餘 explanatory 句子與圖交錯排成一份由上往下讀的文件（L587–592、L652–655）。
- **版面與互動**（§5，L664–671）：「Since a Visual Transcript contains all of the visual and audio information from the input video, it can be used by itself to study the content. Alternatively, it can be linked to the original lecture video to function as an interactive navigation aid. Similar to NoteVideo [2013], clicking on a visual entity or transcript sentence plays the video at that point in time. As the video is played, the corresponding visual entity and/or transcript sentence is highlighted.」
- **產出**：20 份 Visual Transcripts，數學與物理；10 支來自可汗學院，其餘 10 支來自 YouTube 上 10 位不同講者（L672–675）。演算法穩健性另測了「20 video lectures from 10 different authors」，約 5% 切得不理想（L557–564）。
- **使用者研究**（§6）
  - 比較三種介面（L706–713，Fig. 11 左）：Baseline＝標準 YouTube 播放器加互動逐字稿；NoteVideo（Monserrat 等 2013，把整場黑板的筆畫合成一張全景圖當導覽，點筆畫就播）；Visual Transcript（連到影片）。
  - 受試者（L876–878）：9 人（2 女 7 男），20–35 歲，熟悉課程主題但沒看過這三支影片。招募方式與身分沒寫。
  - 教材（L878–880）：三支大學數學講課——Salman Khan 的 Fundamental Theorem of Calculus（8 分鐘）、Lee Stemkoski 的 Proving Trigonometry Formulas Using Euler's Formula（7.2 分鐘）、Actuarialpath 的 Uniform Distribution（8 分鐘）。
  - 設計（L881–888）：受試者內，介面順序與影片分配用拉丁方平衡；每個介面先介紹並給時間熟悉；每題後問互動經驗；最後問偏好與可用性。完整任務與問卷在補充材料（本次沒取得）。
  - 任務（L785–875）：(1) 摘要：3 分鐘看並摘要 7–8 分鐘的講課，與兩位評審做的主要點／細節點標準清單比對，計涵蓋點數。(2) 搜尋：分視覺、文字、圖文脈絡（contextual）三類，量完成時間與正確性。
  - 原文自承「Although not a direct measure of learning」（L787）。

## 結果（逐項；Table 1 與 §6.1 數字對過 PDF 第 8 頁）

- **摘要（Table 1）**：主要點涵蓋比例 Baseline 0.83 ± 0.12、NoteVideo 0.81 ± 0.21、Ours 0.87 ± 0.18；細節點 0.50 ± 0.22、0.56 ± 0.18、0.58 ± 0.15。單因子 ANOVA：主要點 F(2,24) = 0.23、p = 0.79；細節點 F(2,24) = 0.48、p = 0.62（L897–901）。原文：「although differences across the interfaces were not statistically significant」。
  - 摘要品質依影片而異：微積分那支，NoteVideo 使用者直接點「Fundamental Theorem」，跳過前三分之一（L903–912）。
  - 摘要任務偏好：NoteVideo 5/9、Ours 4/9（L913–915）。
- **搜尋時間**：
  - 文字與脈絡搜尋：Visual Transcript 最快、NoteVideo 次之、Baseline 最慢，「although the differences across the interfaces were not statistically significant according to the non-parametric Kruskal-Wallis Test (χ2 = 0.82, p = 0.676)」（L917–921）。兩類任務只報一個檢定值。
  - 視覺搜尋：NoteVideo 最快，因為所有畫面在同一個畫面裡、不用捲動（L932–935）。沒報檢定。
  - 搜尋合計：Ours 與 NoteVideo 相近，都優於 Baseline；Ours 對 Baseline MWU Z = −2.1、p = 0.02（顯著）；Ours 對 NoteVideo Z = 1.2、p = 0.12（不顯著）（L935–940）。
  - Fig. 11 右只給中位數與四分位距長條圖，沒有數字。
- **正確性**：平均錯誤率 Ours 0.06、NoteVideo 0.07、Baseline 0.15，ANOVA F(2,24) = 1.04、p = 0.15，不顯著（L943–947）。
- **逐字稿的有用程度**（L950–952）：1–7 分，Visual Transcript 6.3（範圍 5–7），Baseline 4.7（範圍 1–7）。沒做檢定。用 Baseline 時受試者多半拖時間軸；3/9 說 Baseline 逐字稿難略讀、難對應影片（L952–956）。
- **學習偏好**（L970–979）：一般學習偏好 Ours 7/9、NoteVideo 2/9（Baseline 0）。理由引句：「having the whole script and equations [visuals]」「a good balance between getting the overview and some more detail」。偏好 NoteVideo 的人喜歡全部畫面一次看到，但也說看不出順序、「there's a risk of missing something that's not written on the board」。

## 作者自己列的限制（§7，L988–1018）

- 只實作黑板式講課；設計理念可推廣，但其他形式（教室錄影有人遮擋、投影片有動畫）需要不同的辨識與版面技術。
- 筆畫抽取適合背景單純、遮擋少的數位黑板；不處理部分擦除、複製貼上，改錯時只顯示最新筆畫。
- 兩類切割失敗：切太少、切太多；假設不同 entity 在空間上大致分開，寫在地圖上或圖疊圖的影片不適用。
- 假設老師邊畫邊講畫的東西；靜態版面無法還原用游標指著說「here」的指涉（Fig. 12）。
- 結論自稱「Our small user evaluation」（L1032–1038）。

## 與摘要說法不一致的地方

- 摘要說「our interface is effective in helping them browse or search through lecture videos」：搜尋合計只對 Baseline 顯著（p = 0.02），對 NoteVideo 不顯著；文字與脈絡搜尋三介面差異不顯著。
- 導言 L118–119「users performed best using Visual Transcripts for search tasks involving text」：只有平均排序，Kruskal-Wallis 不顯著（p = 0.676）。
- 摘要「users prefer our interface for learning」：7/9 偏好，正確；但摘要任務的偏好是 NoteVideo 5/9 多於 Ours 4/9，摘要沒提。
- 原文統計本身的疑點（照實記錄，不代為修正）：受試者內資料用 Mann-Whitney U 與一般單因子 ANOVA（F 的自由度 2,24 等於把 27 筆觀測當獨立）；Z = −2.1 的雙尾 p 約 0.036，原文寫 0.02（像單尾）；錯誤率 F(2,24) = 1.04 的 p 約 0.37，原文寫 0.15。

## 與清單「要撐的結論」不合的地方

清單 L-3 列的文章引用：「9 人、0.83／0.81／0.87、各 p 值、7／9 人、附錄數字」。逐項對過刊出版，數字全部撐得住。清單標的 ⚠（沒有本機 PDF、表格可能錯位）已處理：新存出版者 PDF，Table 1 對過版面，與舊 Exa 文字檔引用的數字相同。

## 已發佈文章引用核對（`2026-10-13-video-beside-text-layout.md`）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| L61 | Visual Transcripts 讀了演算法以外的各節 | — | 讀取範圍描述；本次已整篇讀完 |
| L81 | 處理黑板式講課影片（可汗學院那一類）；把老師寫下的每一組筆畫切出來，和同一時間的口述文字交錯排成由上往下讀的文件；可單獨讀，也可連回影片：點任何一張圖或一句話，影片就從那裡播，播放時對應圖文被標示 | L93–107、L664–671 | 一致。小差異：預設隱藏畫圖時的描述句（depictive），交錯排的是 explanatory 句；文章沒提，不算錯 |
| L83 | 使用者研究 9 人，三支 7 到 8 分鐘的大學數學講課，比較 YouTube 播放器加互動逐字稿、NoteVideo（把整塊黑板合成一張圖當導覽）、Visual Transcripts | L706–713、L876–880 | 一致 |
| L85 | 給 3 分鐘寫摘要，涵蓋的重點比例 0.83、0.81、0.87，差異不顯著（p = 0.79） | Table 1 主要點；F(2,24) = 0.23、p = 0.79 | 一致 |
| L86 | 找文字和找圖文關係兩類，三種介面完成時間差異不顯著（p = 0.676）；只找畫面那一類 NoteVideo 最快；搜尋合計 Visual Transcripts 顯著快於 YouTube 播放器加逐字稿（p = 0.02），和 NoteVideo 沒有顯著差異（p = 0.12） | L917–940 | 一致。注意原文 p = 0.02 與 Z = −2.1 的雙尾值不符（見上），文章照原文引用，沒有錯，但這項「唯一顯著」的結果本身統計可疑 |
| L87 | 同一份逐字稿，7 點量表 Visual Transcripts 6.3 分、YouTube 播放器旁 4.7 分；用後者時受試者多半改拖時間軸 | L950–954 | 一致（原文量尺寫「1-7 usefulness scale」，沒有檢定） |
| L88 | 問學習時偏好，9 人裡 7 人選 Visual Transcripts，理由包括「整份文字和算式都在」 | L970–973 | 一致 |
| L90 | 寫摘要三者分不出高下；找東西時排成文件的版本贏過「播放器加一長串逐字稿」；偏好明顯傾向圖文交錯的文件。作者列的限制是只處理黑板式影片、靜態版面無法還原游標指著說「這裡」的指涉 | §6.1、§7 | 一致 |
| L224 | 樣本 9 人；Visual Transcripts 只有「搜尋任務合計、對一般播放器」這一項顯著，摘要任務與其他比較都不顯著 | §6.1 | 一致（錯誤率、文字／脈絡搜尋、對 NoteVideo 都不顯著；有用程度與偏好沒做檢定） |
| L241 附錄 | 系統共產生 20 份，10 份來自可汗學院 | L672–674 | 一致（另 10 份來自 YouTube 10 位講者，數學與物理） |
| L241 | 受試者 9 人（2 女 7 男，20 到 35 歲），熟悉該科目但沒看過那三支影片；影片長 8、7.2、8 分鐘 | L876–880 | 一致 |
| L241 | 摘要任務細節點涵蓋比例 0.50、0.56、0.58（p = 0.62） | Table 1；F(2,24) = 0.48、p = 0.62 | 一致 |
| L241 | 只找畫面的搜尋任務 NoteVideo 最快，因為它把所有畫面放在同一個畫面裡 | L932–935 | 一致 |
| L241 | 搜尋任務合計：對一般播放器 Z = −2.1、p = 0.02，對 NoteVideo Z = 1.2、p = 0.12 | L937–940 | 一致 |
| L241 | 找錯比例 0.06、0.07、0.15，差異不顯著 | L943–947 | 一致（原文 F(2,24) = 1.04、p = 0.15，p 值與 F 不符，文章沒引 p） |
| L241 | 寫摘要時偏好 5 人選 NoteVideo、4 人選 Visual Transcripts | L913–915 | 一致 |
| L255 參考資料 | 連結 ACM DL；讀了摘要、導言、相關研究、設計原則、成果、使用者研究、限制與結論；第 4 節演算法只看了各小節開頭 | ACM DL 出版者版，現為開放取用 | 連結合法。讀取範圍描述現已過時（本次整篇讀完），是否改寫由主筆決定 |

## 讀取紀錄

- `vt-acm-flow.txt` 依序讀 L1–40（首頁、摘要，於轉檔後的 `head` 輸出）、L40–599、L600–1182（全檔 1,182 行，首尾相接，含第 4 節演算法、參考文獻）。
- 對過 PDF 版面：第 8 頁（Table 1、Protocol、§6.1 發現 1–3 所有數字）轉圖逐句核對。第 7 頁 Fig. 11 右是長條圖，沒有數值可抄。
- 補充材料（完整任務與問卷、各評分項的消融結果）沒有取得。
