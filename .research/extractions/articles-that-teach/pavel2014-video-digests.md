# 抽取紀錄：Pavel、Reed、Hartmann、Agrawala 2014，Video Digests: A Browsable, Skimmable Format for Informational Lecture Videos（UIST 2014）

- **書目**：Amy Pavel、Colorado Reed、Björn Hartmann、Maneesh Agrawala（皆 University of California, Berkeley）。Video Digests: A Browsable, Skimmable Format for Informational Lecture Videos. *Proceedings of the 27th Annual ACM Symposium on User Interface Software and Technology (UIST 2014)*，2014 年 10 月 5–8 日，Honolulu，頁 573–582。DOI 10.1145/2642918.2647400（Crossref 2026-10-14 查核：四位作者全名、頁碼 573–582；PDF 首頁印的 DOI 相同）。作者全名對過 PDF 首頁。
- **版本**：會議論文定稿（首頁有 ACM 版權聲明與 DOI），10 頁；檔名是 `videodigests_small.pdf`（壓縮圖檔版）。
- **原文檔**：PDF `.work/video-guide-research/dl2/digest.raw`（11,314,562 位元組，sha256 開頭 c9a72e845891fac0）。2026-10-14 從作者 Agrawala 的論文頁 http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf 重新下載，`cmp` 與本機檔位元組相同，確認是作者公開版本。
- **讀的文字檔**：清單列的 `dl2/digest.txt` 是 `-layout` 雙欄版（667 行、72,285 字元），沒用。改用不帶 `-layout` 重轉的 `.work/video-guide-research/dl2/digest.flow.txt`（981 行、48,929 字元），下面行號都是這個檔的行號（簡寫 L）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 5 篇（影片，引瀏覽實驗）與第 6 篇（版面，`src/content/posts/learning/2026-10-13-video-beside-text-layout.md`，引版面描述）。

## 研究設計

這篇是系統論文，主要貢獻是一套製作工具。有三個評估部分，設計各不同：

1. **成品比較**（RESULTS，L398–577）：一位作者手工製作 4 支影片的摘要，另用自動分段＋群眾外包摘要產生自動版，比較時間、成本、章節數、壓縮率（Table 1）。
2. **非正式使用者回饋**（L579–634）：2 位使用者（U1、U2），各手工做一份、修一份自動版（Table 2）。
3. **瀏覽／略讀比較研究**（STUDY，L635–759）：文章引的就是這一項。
   - **受試者**：群眾外包工作者（crowdworkers），論文沒寫平台、人口資料或排除條件。每個條件組合 4 位不重複的人，共 192 份摘要（4 支影片 × 4 種格式 × 3 種瀏覽時間 × 4 人）（L648–650）。每份 0.90 美元，該組合得分最高者另加 1.00 美元（L650–723）。
   - **教材**：四支影片（L403–413）：Tamar Gendler 的 Yale 哲學課 Philosophy 181 導論（13.3 分鐘，教室錄影）；Scott Klemmer 的 Coursera 課 The Power of Prototyping（13.8 分鐘，投影片）；Salman Khan 的美國史概覽（18.5 分鐘，手寫板）；Hans Rosling 的 TED 演講 The Best Statistics You've Ever Seen（19.9 分鐘，舞台演講）。研究一節稱之為「the roughly 15 minute long lecture videos」（L756–757），導言稱「lecture videos that are about 15 minutes long」（L121–122）。
   - **四種格式**（L640–643）：Manual（手工摘要）、Auto（自動產生的摘要）、Video（時間軸播放器）、Script（逐字稿播放器）。
   - **程序**：給固定瀏覽時間（2、5 或 8 分鐘），請受試者「quickly browse and skim」；然後藏起影片，請他們寫「an approximately 5 sentence summary」（L644–646）。刻意不給看完整支的時間（L646–647）。
   - **計分**：前兩位作者共同訂出每支影片的重點清單（gold standard），數摘要涵蓋幾個重點，再除以該片重點總數（L724–728）。
   - **量的是什麼**：限時瀏覽後立即寫的摘要涵蓋多少重點。沒有延後測驗、理解測驗或遷移測驗。

## 結果（逐項）

### 瀏覽實驗（圖 6 在 PDF 第 8 頁，已轉 220 dpi 圖逐格看過）

- **圖 6 各格平均（正規化摘要分數；圖說：each bar shows the mean and standard error）**：

  | 瀏覽時間 | manual | auto | script | video |
  |---|---|---|---|---|
  | 2 分鐘 | 0.55 | 0.48 | 0.31 | 0.28 |
  | 5 分鐘 | 0.62 | 0.47 | 0.34 | 0.39 |
  | 8 分鐘 | 0.61 | 0.45 | 0.48 | 0.59 |

  flow 文字層的圖內數字順序被打亂（L652–705），上表以 PDF 版面為準。
- **瀏覽時間的主效果**：Kruskal-Wallis，2 分鐘 μ = 0.408、5 分鐘 μ = 0.457、8 分鐘 μ = 0.530，χ²(2) = 9.92，p = 0.007（L731–734）。
- **各瀏覽時間內的格式差異**（L734–737）：2 分鐘 χ²(3) = 18.31，p < 0.001；5 分鐘 χ²(3) = 16.23，p = 0.001；8 分鐘 χ²(3) = 6.77，**p = 0.080，不顯著**。
- **兩兩比較**（Mann-Whitney，Holm-Bonferroni 校正；L737–744）：
  - 2 分鐘：manual–video（U(15) = 32，p = 0.002）、manual–script（U(15) = 44.5，p = 0.009）、auto–video（U(15) = 58.5，p = 0.037）顯著。**auto–script 未列為顯著**。
  - 5 分鐘：只有 manual–video（U(15) = 56.5，p = 0.03）與 manual–script（U(15) = 33.5，p = 0.002）顯著。**auto 與兩種播放器都未列為顯著**。
- **各格式內的瀏覽時間差異**（L745–751）：只有 video 格式隨時間顯著上升，χ²(2) = 13.26，p = 0.001；2–8 分鐘（p = 0.001）與 5–8 分鐘（p = 0.047）顯著。
- **作者的總結**：「In short, at viewing times of 2 and 5 minutes, the video digest formats (manual and auto) allowed viewers to recall up to twice as many of the key topics than the video player formats (script and video). However, this effect diminished for the longest viewing time of 8 minutes.」（L752–756）「up to twice」對應的是 2 分鐘 manual 0.55 對 video 0.28（約 1.96 倍）。
- 作者另說：用摘要格式時，2 分鐘就能回想出許多重點，「giving extra viewing time yielded little improvement that was not statistically significant」；時間軸播放器則 2 分鐘時表現低、隨時間逐步改善（文字層此段跨欄，原文順序是 L756–759 接 L709–714）。
- **注意 U(15)**：每格 4 人，兩格相比是 8 人，論文寫 U(15)，可能是把四支影片合併後每種格式 16 份（4 片 × 4 人）。原文沒解釋，不確定。

### 版面描述（第 6 篇引用；導言 L62–79、圖 1 圖說 L107–110）

- 「each chapter corresponds to a topically-coherent segment of the video and consists of an embedded video player, a description (title) of the major theme in the segment, and a sequence of section elements. Each section element provides a short text summary and representative keyframe for a video segment within the chapter-level segment.」（L67–71）
- 圖 1 圖說：「Clicking within a section plays the video starting at the beginning of corresponding video segment.」（L109–110）
- 摘要的說法：「Viewers can navigate by reading the summaries and clicking on sections to access the corresponding point in the video.」（L13–15）
- 格式的出處：Bret Victor 為演講 Media for Thinking the Unthinkable 手工做的版面（L62–64、L129）。
- 導言說這種格式鼓勵把影片切成短的主題段落，「which, as indicated by prior work, aids knowledge transfer and decreases dropouts for educational videos [32, 20, 26]」（L76–79）；[20] 是 Guo 等 2014。這是引述別人的研究，不是本篇的結果。

### 成品比較與使用者回饋（不被文章引用，簡記）

- Table 1（PDF 第 7 頁，已對版面）：手工製作時間 Gendler 40 分鐘、Klemmer 34、Khan 41、Rosling 62；群眾外包成本 19、23、35、54 美元；章數（M／A）2／3、3／4、6／6、4／8；節數 20／26、14／13、17／16、20／40；壓縮率 4.8／3.7、10.0／6.3、7.7／4.6、7.1／3.3。手工製作約是片長的 3–4 倍時間（L499）；群眾外包每分鐘影片約 0.50–1.00 美元（L501–502）。
- Table 2（PDF 第 7 頁，已對版面）：兩位使用者修自動版都比從頭做快（U1 54 對 37 分鐘、U2 30 對 20 分鐘），修改的節不到一半。

## 作者自己列的限制

論文沒有獨立的限制一節。散見處：

- 未來工作（L772–791）：群眾外包摘要之間缺乏一致性；**「We tested our automatic pipeline on four lectures that are accessible to a broad, well-educated audience. However, we have not tested our tools with lectures that require specialized knowledge, or highly-technical content」**（L779–782）——這句說的是自動化流程與工具，不是瀏覽實驗本身，但瀏覽實驗用的是同四支影片；分段只用逐字稿，沒用畫面與聲音。
- 刻意不給足夠時間看完整支（L646–647），所以結果只談限時瀏覽。
- 使用者回饋只有 2 人，作者自稱「informal」（L581）。

## 與摘要說法不一致的地方

- 摘要說「given a short viewing time, video digests support browsing and skimming better than timeline-based or transcript-based video players」（L21–23）。兩兩比較中，自動版在 2 分鐘時只顯著勝過時間軸播放器、沒有顯著勝過逐字稿播放器；在 5 分鐘時都沒有顯著勝過。所以摘要的概括對手工版成立，對自動版只部分成立。
- 導言說「given 2 minutes ... viewers can recall up to twice as many of the key topics」（L121–123），研究一節說「at viewing times of 2 and 5 minutes」（L752）。範圍寫法不同，不矛盾。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單 V-6：V 引「192 份摘要、0.55 對 0.28、p = 0.080」；L 只引版面描述。

- 192、0.55、0.28、0.080 都對得上（L648–650、圖 6、L737）。0.55 對 0.28 是 2 分鐘時 manual 對 video；這兩個數字只出現在圖 6 的長條標籤上，正文沒寫。
- 「兩倍」只對手工版成立；自動版 2 分鐘時 0.48 對 0.28（約 1.7 倍）、對逐字稿 0.31 不顯著。
- 量的是限時瀏覽後的摘要涵蓋率，不是學習成效。

## 已發佈文章引用核對

### 第 5 篇（影片，現行檔行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 34 | 每一節標上時間區間並做成連結，依據之一是 Video Digests 的瀏覽實驗 | 實驗比的是整個摘要格式（章節＋文字摘要＋代表畫面＋點擊跳轉）對播放器，沒有拆出「時間連結」這個元件的效果 | 部分支持；實驗不能單獨證明時間連結有效，文字摘要可能才是主要成分。建議措辭改成「依據之一是 Video Digests 的瀏覽實驗（比的是整套章節摘要格式）」 |
| 142 | 把課堂影片切成章與節，每節配一小段文字摘要，點摘要就跳到影片的那一段 | L11–15、L67–71、L109–110 | 一致（另有代表畫面，文章沒提，不算錯） |
| 142 | 請群眾外包的受試者在限定時間內瀏覽一支約 15 分鐘的講課影片，再寫出重點摘要 | L644–647；四支影片 13.3–19.9 分鐘，論文自稱「roughly 15 minute」；每人看其中一支 | 一致；「講課影片」含一支 TED 演講與一支可汗學院概覽，附錄已列明 |
| 142 | 只給 2 分鐘時，用這種格式的人寫出的重點最多是用一般播放器的人的兩倍 | L752–755、L121–123；兩倍是 manual 對 video | 大致一致；「這種格式」若含自動版則略寬（自動版對逐字稿不顯著）。「一般播放器」原文含時間軸與逐字稿兩種 |
| 142 | 給到 8 分鐘，各格式之間就沒有顯著差異 | χ²(3) = 6.77，p = 0.080（L737） | 一致 |
| 224 | Video Digests 量的是限時瀏覽之後寫出的摘要涵蓋多少重點，不是學習成效 | L644–647、L724–728 | 一致 |
| 246 | 四支影片長 13.3 到 19.9 分鐘（Yale 哲學課、Coursera 原型設計課、可汗學院美國史、Rosling 演講） | L403–413 | 一致 |
| 246 | 四種格式 × 三種瀏覽時間，每格 4 人，共 192 份摘要 | L648–650 | 一致（原文還乘上 4 支影片：4 × 4 × 3 × 4 = 192；「每格 4 人」指影片×格式×時間的每一格） |
| 246 | 依兩位作者訂的重點清單評分 | 「the first two authors of this paper worked together to manually build a gold standard list」（L724–726） | 一致 |
| 246 | 2 分鐘時人工摘要 0.55、時間軸播放器 0.28（從論文圖 6 讀出） | 圖 6 長條標籤 | 一致 |
| 246 | 2 分鐘與 5 分鐘時各格式之間有顯著差異，8 分鐘時沒有（p = 0.080） | L734–737 | 一致 |
| 246 | 作者說明四支影片都是一般大眾看得懂的內容，沒有測過高度技術性的課 | L779–782，但主詞是「our automatic pipeline」「our tools」 | 大致一致；原文講的是自動化流程沒測過技術性內容。瀏覽實驗用的是同四支影片，所以推論成立，但嚴格說原句不是在講瀏覽實驗 |
| 266 | 參考資料連結 vis-ucb-maneesh.stanford.edu；讀了摘要、實驗材料、瀏覽實驗與未來工作 | 作者論文頁，合法 | 連結合規 |

### 第 6 篇（版面，現行檔行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 59 | Video Digests 是上一篇就讀過的；四篇都出自人機互動領域的研討會或期刊 | UIST，HCI 研討會 | 一致 |
| 61 | Video Digests 這裡只用到摘要與導言裡的版面描述 | 版面描述在摘要 L11–15 與導言 L62–71，另見圖 1 圖說 | 一致 |
| 65 | 把講課影片切成章與節 | L11–12 | 一致 |
| 65 | 每一章由一個嵌入的播放器、一個章標題和一串小節組成，每個小節有一段文字摘要與一張代表畫面 | L67–71 | 一致，幾乎逐字 |
| 65 | 點小節就從那一段開始播 | 圖 1 圖說 L109–110 | 一致（出自圖說，不是摘要或導言正文；摘要 L13–15 也有相近說法） |
| 65 | 影片跟著章走，讀者不必離開正在讀的那一章 | 原文沒有這句；是從「每章有自己的嵌入播放器」推出的 | 文章的推論，原文沒寫；建議標成推論或改成「每章有自己的播放器」的直接描述 |
| 65 | 它的瀏覽實驗結果上一篇已經寫過 | 見第 5 篇核對 | 一致 |
| 237 | 版面與瀏覽實驗見上一篇的附錄 | — | 不涉內容 |
| 256 | 參考資料：版面描述出自摘要與導言 | 同上；點擊行為出自圖 1 圖說 | 大致一致 |

## 讀取紀錄

- `dl2/digest.flow.txt` L1–981 依序讀完（一次讀入，首尾相接）：L1–30 題名、作者、摘要、關鍵詞；L31–126 導言（含首頁版權欄 L43–49、圖 1 標籤與圖說 L89–110）；L127–186 相關研究；L187–233 製作流程；L234–316 製作介面；L317–397 演算法（分段、群眾外包摘要）；L398–577 成品結果（含圖 5 L420–493、Table 1 L504–552）；L579–634 非正式使用者回饋（含 Table 2 L591–621）；L635–759 瀏覽研究（含圖 6 文字層 L652–720，順序被打亂）；L760–799 結論、未來工作、致謝；L800–981 參考文獻（掃過）。
- 對 PDF 版面：第 7 頁（Table 1、Table 2、研究設計段落）以 120 dpi 轉圖；第 8 頁上半（圖 6）以 220 dpi 轉圖逐條讀長條標籤。圖 6 的 12 個數字以版面為準。
