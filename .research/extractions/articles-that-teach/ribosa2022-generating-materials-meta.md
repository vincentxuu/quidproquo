# 抽取紀錄：Ribosa & Duran 2022，Educational Research Review 37, 100475

- 書目：Jesús Ribosa, David Duran (2022). Do students learn what they teach when generating teaching materials for others? A meta-analysis through the lens of learning by teaching. *Educational Research Review*, 37, Article 100475（16 頁）. doi:10.1016/j.edurev.2022.100475。作者全名對 PDF 首頁核過（UAB 機構頁寫 David Duran Gisbert；兩人皆 Universitat Autònoma de Barcelona，基礎、發展與教育心理學系）。Review article，開放取用，CC BY-NC-ND（Unpaywall 2026-10-14 查得 hybrid、publishedVersion、cc-by-nc-nd）。
- 版本：刊出版。
- 原文檔：`.research/raw/learning-content/q5-social/ribosa-duran2022.txt`（913 行、85,608 字元；`wc -c` 86,037 位元組）。是出版者 ScienceDirect 文章頁（`https://www.sciencedirect.com/science/article/pii/S1747938X22000446`）的網頁轉文字，頭尾含站台選單；表格是 HTML 表轉成的 tab 分隔，不是雙欄 PDF 版面。
- 對表用的 PDF：ScienceDirect 的 PDF 端點 curl 回 403、瀏覽器停在 Cloudflare 驗證頁，抓不到。改用第一作者在 UAB 的博士論文（Duran 為指導教授），論文第 2 部「CÒPIA DELS ARTICLES PUBLICATS」附上本文刊出版全文（PDF 第 98–113 頁，頁首「Educational Research Review 37 (2022) 100475」，16 頁）。論文登錄於 UAB 機構典藏 DDD `https://ddd.uab.cat/record/288558`（標示「Tesi doctoral ; Text ; Versió publicada」），PDF 原址 `https://ddd.uab.cat/pub/tesis/2024/hdl_10803_689914/jrm1de1.pdf`。DDD 主機本機連不上（HTTP 000），實際經 Wayback 取得同一網址的存檔（`http://web.archive.org/web/2026id_/https://ddd.uab.cat/pub/tesis/2024/hdl_10803_689914/jrm1de1.pdf`，HTTP 200，5,081,219 位元組，254 頁，SHA-1 631056da…）。存為 `.research/raw/learning-content/q5-social/ribosa2024-thesis-uab.pdf`。該 PDF 有加密權限，無法切出單篇。
- 讀取日期：2026-10-14
- 供：order 22（清單 F 22#7）

## 研究設計

- **類型**：統合分析，依 Field & Gillett 2010 流程、參照 PRISMA 2020（L99）。
- **研究問題**（L96–97）：RQ1 產出教材是否影響學生對所教內容的學習（對照為照常教學或不涉及產出教材的替代介入）；RQ2 產品類型、教育階段、內容領域、能否接觸原始資料是否調節效果。
- **檢索**（L101–108、Table 1 L103–107）：2021 年 10 月底，PsycInfo、Scopus、Web of Science，不限年級與年份。檢索詞是「student-/pupil-/learner- generated/created/…」AND 各種教材名詞（含 video、blog、wiki、quiz、game 等）；**沒有用「learning by teaching」當檢索詞**（L292）。得 68＋567＋245 筆。
- **納入條件**（L108–124，依序八條）：只收同儕審查期刊；RCT 或有獨立對照組的準實驗；對照組不產出教材（排除「改良版 vs 一般版」的比較）；產出目的是讓真實或想像的對象自行學習（排除娛樂／藝術、只交給老師的作業、口頭報告或同儕家教時用的輔助物）；研究焦點是學生產出的教材；量的是**產出者**的學習；用測驗或考試量認知成果（排除自陳、作品品質、動機等）；單獨量產出的效果（排除「產出＋使用」合併效果）；量的是所教內容本身。
- **最後納入**（L131–134）：資料庫檢索只有 3 篇符合（Chang 2010、Hsu & Wang 2018、Shoepe 2015）；從作者先前的範疇回顧滾雪球得 7 篇（另 4 篇因缺資料無法算效果量）；從 Lachner 等 2022（見 `lachner2022-lbt-no-audience.md`）滾雪球得 12 篇；學者推薦 1 篇。共 **23 篇、62 個比較**。
- **受試者**（L222）：排除重複組後，產出組 1,723 人、對照組 1,774 人。教育階段依 Table 3：大學居多，另有中學（Chang、Heafner、Hoogerheide 2014.1、Jablonski、Vreman-de Olde）與小學（Hoogerheide Visee 2019、Hsu & Wang、Slussareff）。
- **效果量**（L136–148）：只用後測；標準化平均差（SMD）與 95% CI；隨機效果模型（Q 與 I² 顯示高異質性）。15 篇有多個成果時算合成效果量（Heafner & Friedman 例外，只取期末測驗）。**14 篇有兩組以上，同一研究內的多個比較「as if each comparison was a separate study」處理**（L222），Table 3 星號標出被重複使用的組別。
- **分析**（L224–238）：R 4.1.0；隨機效果線性迴歸統合模型；後設迴歸檢驗共變項：出版年、設計（RCT／準實驗）、對照組（beneficial＝已知或預期有正效果的替代活動，如提取練習；nonbeneficial＝照常教學或預期影響不大的活動，如重讀；依 Willingham & Daniel 2021）、產品（影音、純視覺、文字；純錄音只出現在 Jacob 2020、2021，與 Shoepe 2015 的 Photo Atlas 一起設為遺漏值）、教育階段、內容領域（自然、社會、語言與思考）、能否接觸原始資料（完全、有限、不能）。
- **出版偏誤**（L240）：漏斗圖＋Egger 檢定；出版年、設計、對照組當調節變項放在這一節分析。

## 結果（逐項）

Table 2–5 與 Fig. 2、Fig. 3 都對過 PDF（論文 PDF 第 101–107 頁）。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 整體效果（隨機效果） | SMD = 0.17，p = .013；95% CI 0.04–0.31（CI 只在 Fig. 2 森林圖底列，正文與摘要都沒寫；圖上末位字元印刷不清，判讀為 0.31） | 產出教材 vs 照常教學或替代介入（62 個比較合併） | 2.1、Fig. 2 | L243 | 「The results show statistically significant differences (p = .013) in favour of creating teaching materials when compared to business-as-usual or alternative interventions, with an overall effect of 0.17 (Fig. 2).」 |
| 2 | 固定（common）效果 | 0.22，95% CI 0.16–0.27（只在 Fig. 2） | 同上 | Fig. 2 | — | 圖中「Overall effect 0.22 [0.16; 0.27]」 |
| 3 | 異質性 | Q = 296.80，df = 61，p < .001；I² = 79.4%（95% CI 74.1%–83.7%） | 同上 | Table 2 | L139–146 | 「Cochran's Q 296.80 … I2 79.4%」 |
| 4 | 產品：影音 vs 文字 | 估計差 0.627，SE 0.141，p < .001 | 影音教材 vs 文字教材 | 2.2、Table 4 | L250–257 | 「Audiovisual-Textual 0.627 0.141 <.001」 |
| 5 | 產品：純視覺 vs 文字 | 0.705，SE 0.233，p = .003 | 純視覺 vs 文字 | Table 4 | L258 | 「Visual-Textual 0.705 0.233 .003」 |
| 6 | 產品：影音 vs 純視覺 | −0.079，SE 0.220，p = .721（無差異） | 影音 vs 純視覺 | Table 4 | L256 | 「Audiovisual-Visual −0.079 0.220 .721」 |
| 7 | 教育階段（無差異） | 大學－中學 −0.167（p = .451）；大學－小學 −0.436（SE 0.252，p = .083）；中學－小學 −0.269（p = .396） | 各階段互比 | Table 4 | L259–262、L271 | 「Educational level and content area do not significantly moderate the findings.」 |
| 8 | 內容領域（無差異） | 自然－社會 0.223（p = .617）；自然－語言思考 −0.198（p = .237）；社會－語言思考 −0.421（p = .363） | 各領域互比 | Table 4 | L263–266 | 同上 |
| 9 | 接觸原始資料：完全 vs 不能 | −0.337，SE 0.157，p = .032 | 製作時可完全查看原始資料 vs 不能查看 | Table 4 | L269 | 「FullAccess-NoAccess −0.337 0.157 .032」 |
| 10 | 接觸原始資料：完全 vs 有限 | −0.317，SE 0.198，p = .109（不顯著） | — | Table 4 | L268 | 「FullAcces-LimitedAcess −0.317 0.198 .109」 |
| 11 | 接觸原始資料：有限 vs 不能 | −0.020，SE 0.187，p = .915 | — | Table 4 | L270 | 「LimitedAccess-NoAccess −0.020 0.187 .915」 |
| 12 | 對照組類型 | 有益對照－無益對照 −0.305，SE 0.138，p = .027 | 對照組做有效活動（如提取）vs 做預期無效的活動（如重讀） | 2.3、Table 5 | L273–282 | 「The effect of creating teaching materials is higher when the control group is a nonbeneficial intervention rather than a beneficial intervention.」 |
| 13 | 控制對照組類型後，產品與接觸原始資料的效果仍顯著（只有文字敘述，沒給數字） | — | — | 2.3 | L273 | 「After controlling for this variable, differences in terms of product and access to source material remain significant.」 |
| 14 | 出版年、研究設計（無調節） | 出版年 −0.009（p = .675）；RCT－準實驗 −0.139（p = .458） | — | Table 5 | L278–280 | 「Year of publication and research design do not significantly moderate the findings」 |
| 15 | 出版偏誤 | 62 個比較中 24 個落在漏斗圖虛擬 95% 信賴界限外；Egger p = .095 | — | 2.3、Fig. 3 | L283 | 「Visual inspection of the funnel plot shows that 24 comparisons are outside the pseudo 95% confidence limits (Fig. 3). However, Egger's test shows no evidence of asymmetry (p = .095).」 |
| 16 | 與先前統合分析比較 | Kobayashi 2019b 非互動錄影教學 gs = 0.48；Lachner 等 2021（口說＋書寫）g = 0.22；本文 0.17 | — | 3 Discussion | L291 | 「Lachner et al. (2021) considered both spoken and written non-interactive teaching and found a smaller effect size (g = 0.22), similar to the 0.17 SMD from this meta-analysis.」 |
| 17 | 文字教材的結果要謹慎：只有 7 篇 | Hoogerheide Staal 2019：重讀勝過出選擇題；Vreman-de Olde 2013：一班概念知識顯著、程序知識沒有，另一班沒重現；Heafner & Friedman 2008（wiki，小樣本）無差異；Hoogerheide 2016 書寫解釋不比重讀好；Jacob 2021 聊天室無效果；Lachner 2021 書寫解釋不比自我解釋或提取好 | — | 3.2 | L304–308 | 「Focusing on textual teaching materials, the findings from this meta-analysis should be interpreted with caution. First, only seven articles were included」 |
| 18 | 只有少數研究有真實讀者 | 網路上的潛在觀眾：Heafner & Friedman 2008、Shoepe 2015；真實同儕：Hsu & Wang 2018。真實 vs 想像讀者的差別是**假設**，沒有檢驗 | — | 3.1 | L302 | 「One might hypothesise that a real addressee could involve more learning gains than an imaginary addressee」 |
| 19 | 同儕互評可能提升效果（引其他研究，不在統合分析內） | Chang 2010（動畫）、Hwang 2014（遊戲）；Rijlaarsdam 2006（說明書） | — | 3.1、3.2 | L300、L309 | 「Two studies have found that a complementary third phase (i.e., peer assessment) can boost the learning effects when creating animations (Chang et al., 2010) and games (Hwang, Hung, & Chen, 2014).」 |

### Fig. 2 森林圖中個別比較的方向（從 PDF 第 105 頁圖上讀出，影像解析度有限，數字引用前要再放大確認）

- 最大的負向比較：Roscoe & Chi 2008 兩個比較約 −1.10 與 −1.74（對照是自我解釋與教在場的被教者）；Hoogerheide, Staal 2019 四個比較 −0.61 到 −1.04（出選擇題 vs 重讀與另一活動）；Chang 2010 第 2 個比較 −0.49；Heafner & Friedman 2008 −0.60；Koh 2018 第 4 個 −0.63。
- 最大的正向比較：Fiorella & Kuhlmann 2020 第 3 個 1.47；Hoogerheide 2014.1 兩個 1.08、0.94；Hsu & Wang 2018 第 1 個 1.08；Hoogerheide 2014.2 第 2 個 1.04；Fiorella & Kuhlmann 第 2 個 1.04。
- 權重最大的是 Erdmann & March 2014（固定效果 10.7%），SMD 0.51。

## 作者自己列的限制（3.3，L310–313）

- 排除灰色文獻；納入條件與檢索可能漏掉相關文章（但作者說沒有偵測到出版偏誤，且已在討論中提到這些文章）。
- 對照組很異質；後設迴歸確實找到對照組類型的調節效果。
- 成果測量（依 Kraft 2020）：介入與測驗高度對齊；各研究測驗時間點不同；不是所有測驗都檢驗過信度。

## 與摘要說法不一致的地方

1. 摘要說「No publication bias was detected」（L83），但正文寫 62 個比較中有 24 個落在漏斗圖界限外，只是 Egger p = .095 未達 .05（L283）。「沒偵測到」是指 Egger 檢定不顯著，不是漏斗圖看起來對稱。
2. 摘要說產出教材「shows a significant effect when compared to nonbeneficial interventions rather than to other expected beneficial interventions」（L83），讀起來像是分組後「對無益對照顯著、對有益對照不顯著」。正文與 Table 5 只給**兩類對照的差** −0.305（p = .027），**沒有報告各類對照組單獨的合併效果與顯著性**。「對有益對照不顯著」在原文沒有數字支撐。
3. 摘要與 Highlights 說影音與視覺教材「considerably outperform」文字教材（L83、Highlights），正文的估計差是 0.627 與 0.705（Table 4），與摘要方向一致；但作者在 3.2 自己說文字教材只有 7 篇、結果要謹慎（L304），摘要沒有這個保留。
4. 整體效果的 95% CI（0.04–0.31）只在森林圖上，摘要與正文都沒寫。
5. 其餘逐項對過，數字一致。

## 與清單『要撐的結論』不合的地方

清單 22#7 的暫定說法：「替別人做教材 SMD = 0.17；對照組是有效活動時不顯著；不能看原始資料時較好」。

- 「SMD = 0.17」：撐得住（p = .013，CI 0.04–0.31，I² = 79.4%）。引用時要連著寫「隨機效果、62 個比較、23 篇、對照是照常教學或替代介入」；固定效果是 0.22。
- 「對照組是有效活動時不顯著」：**原文沒有直接數字撐**。原文只說兩類對照的差是 0.305（有益對照時效果較小，p = .027）；分組後各自是否顯著沒有報告，「不顯著」只出現在摘要的文字暗示裡。要改寫成「對照組做的是提取練習之類的有效活動時，效果比對照組只是重讀時小約 0.31 SMD」。
- 「不能看原始資料時較好」：只部分撐得住。顯著的只有「完全可看 vs 不能看」（差 −0.337，p = .032）；「完全 vs 有限」（p = .109）與「有限 vs 不能」（p = .915）都不顯著。這是觀察性的後設迴歸，不是實驗操弄；我自己的觀察（非原文說法）：「完全可看」組包含了效果最負的幾個比較（Roscoe & Chi 2008、Hoogerheide Staal 2019），這些研究的對照也多是有益活動，混淆的可能原文沒有逐一排除（只說控制對照組類型後仍顯著）。
- 對 order 22 的適用範圍：納入研究大多是大學生在實驗室錄短講解影片給虛構同學（23 篇中 12 篇來自 Lachner 2022 的清單），真正有網路讀者的只有 2 篇（wiki、Photo Atlas）。「寫文章給別人看」最接近的文字類產出結果偏弱，而且作者說要謹慎。
- 方法上要知道的事（我的判讀，不是作者列的限制）：同一研究的多個比較被當成獨立研究處理，且共用對照組（Table 3 星號），這會低估標準誤；作者沒有用穩健變異數或多層模型，也沒列為限制。

## 讀取紀錄

- 原文檔 L1–79：站台選單、題名、作者、Highlights、目錄（開頭 head 讀過、L60–79 另讀）。
- L80–328：摘要、引言、方法（含 Table 1、2、3 全部列）、結果（Table 4、5）、討論 3.1–3.4、作者聲明、經費、致謝（Read 一次讀完）。
- L329–913：參考文獻與頁尾，依派工說明只掃過（印出條目首行，過濾掉 Google Scholar／Scopus 連結列）。
- 合計涵蓋 L1–913。
- 表格對 PDF（論文 PDF 頁碼）：第 100 頁（方法、Table 1）；第 102–104 頁 Table 3 全部 62 列，數字與原文檔逐列一致；第 105 頁 Fig. 2 森林圖；第 106 頁正文 1.3–2.3；第 107 頁 Table 4、Table 5、Fig. 3 漏斗圖，數字與原文檔一致。Table 2 在第 101 頁未開影像，數字只依原文檔（HTML 表，非版面轉文字）。
- 小差異：Fig. 2 森林圖裡 Jacob 等 2020 第 1 列對照組平均數印成 3.74，Table 3 寫 3.75（L188）；Lachner 等 2020.2 第 1、2 列產出組 SD 在森林圖看起來是 0.17，Table 3 寫 0.18（L201–202）；其餘抽看的列一致。影像解析度有限，沒有逐列核對森林圖全部 62 列。
