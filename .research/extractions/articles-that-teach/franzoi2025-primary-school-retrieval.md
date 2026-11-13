# 抽取紀錄：Franzoi、Cembrani、Mulatti、Treccani 2025，Frontiers in Psychology 16:1632206（doi 10.3389/fpsyg.2025.1632206）

- **書目**（清單上「作者名待補」，這裡補齊）：Laura Franzoi、Veronica Cembrani、Claudio Mulatti、Barbara Treccani（四人都在 Department of Psychology and Cognitive Science, University of Trento, Italy）. Retrieval practice enhances learning in real primary school settings, whether distributed or not. *Frontiers in Psychology*, 16, 1632206. 文章類型 Brief Research Report。收稿 2025-05-20、接受 2025-07-14、刊出 2025-08-08。PMCID PMC12372469，PMID 40861368。作者與單位對過 Europe PMC 全文 XML 的首頁資料與刊出版 PDF 首頁。
- **原文檔**：`.research/raw/learning-content/q4-time/primary-school-retrieval-distributed-2025.md`（141 行含末行、43,733 字元／43,845 位元組）。**這個檔不完整**：只有 PMC 頁面的正文，缺作者、摘要、關鍵字、兩則註腳、致謝與經費、倫理聲明、參考文獻、補充材料。
- **重抓**（2026-10-14，都是出版者或 PMC 的開放取用版，CC BY）：
  - 全文 XML：`https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12372469/fullTextXML` → 存為 `q4-time/franzoi2025-primary-school-retrieval-distributed.europepmc.xml`（104,753 字元）
  - 補充材料：`https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12372469/supplementaryFiles`（zip，內含 `Supplementary_file_1.pdf` 15 頁與兩張圖）→ PDF 存為 `q4-time/franzoi2025-primary-school-retrieval-distributed-supplement.pdf`，轉文字存為同名 `.txt`（718 行、40,395 字元）
  - 刊出版 PDF：`https://www.frontiersin.org/articles/10.3389/fpsyg.2025.1632206/pdf`（11 頁；只用來對表，存在 session scratch，沒有存回 raw）
- **版本**：刊出版。
- **讀取日期**：2026-10-14
- **表格對照**：全文只有 Table 1，6 列的平均與標準差對過 XML 的 `table-wrap` 與刊出版 PDF 的版面（`pdftotext -layout` 第 294–309 行），三者一致。三個 F 檢定的數字也對過 PDF。Figure 1 直接看了原圖（補充檔 zip 裡的 `fpsyg-16-1632206-g0001.jpg`）。
- **供哪幾篇使用**：order 16（清單 D，16#5）。

## 研究設計

- **類型**：**準實驗**，不是隨機分派。註腳 1：「the study followed a quasi-experimental design: we used pre-existing groups corresponding to the two classes that agreed to collaborate with us.」沒有預先註冊的說明，沒有事前檢定力分析（L129）。
- **受試者**：義大利一所小學五年級的兩個班共 33 人，10 到 11 歲；5A 班 15 人（5 位女生）、5B 班 18 人（8 位女生）（L48）。樣本大小由願意參加的老師與班級決定。任一步驟缺席就排除該階段資料，實際分析人數：階段 1＋2 是 **27 人**、階段 3 是 **26 人**、階段 4 是 **25 人**（L75）。階段 3、4 各班剩幾人原文沒有寫。
- **教材**：四篇古代史課文（每階段一篇），590 到 660 個義大利文字、14 到 19 段，與老師一起依五年級歷史進度編寫，學生課本裡沒有（L61；補充 1.2）。四篇主題：希臘化文明（亞歷山大）、伊特拉斯坎文明、羅馬的起源、羅馬社會與共和（補充 2.1–2.4）。
- **兩個操弄變項**（L52）：
  - 策略：重讀 vs 測驗（填空題加自我批改）。
  - 間隔：第一次閱讀到第二次學習之間隔 **1 天**（作者稱 short interval，並稱它是「massed condition」）vs **4 天**（long interval，「distributed condition」）。
- **四個階段實際比了什麼**（L52；Figure 1 原圖；Table 1）：

| 階段 | 5A 班 | 5B 班 | 比較性質 |
|---|---|---|---|
| 1 | 重讀＋短間隔 | 測驗＋長間隔 | 階段 1、2 兩班對調，合起來是受試者內比較；但策略與間隔**同時變動** |
| 2 | 測驗＋長間隔 | 重讀＋短間隔 | 同上 |
| 3 | 重讀＋短間隔 | 測驗＋短間隔 | 只變策略；**班級與條件完全重疊**，沒有對調 |
| 4 | 測驗＋短間隔 | 測驗＋長間隔 | 只變間隔；**班級與條件完全重疊**，沒有對調 |

  註腳 2：四個條件沒有完全交叉，「重讀＋長間隔」這一格從頭到尾沒有做。
- **每個階段的程序**（L67–69；補充 1.3；Figure 1）：
  - 第 1 天：發課文，仔細讀兩遍，收回。
  - 第 2 天（短間隔）或第 5 天（長間隔）：重讀組拿回課文，30 分鐘內想讀幾遍就讀幾遍；測驗組做 12 到 14 句的填空題（每句 1 到 4 個空格），做完拿到正確答案自己批改，答案紙收回後再試，最多三輪，上限 30 分鐘。補充 1.4 說所有學生最後都填到全對。老師不給提示，只解釋題意或生字。
  - 再過 7 天（第 9 天或第 12 天）：期末測驗，12 到 16 題簡答的開放題，10 分鐘，不能看課文。日期事前不告訴學生；成績不算入歷史科成績。
- **量了什麼**：期末開放題的得分，換算成百分比。簡單題滿分 0.5、困難題滿分 1；測驗 1–3 滿分 12 分、測驗 4 滿分 13 分（補充 1.4）。由第一作者一人評分，評分時不知道學生用哪種方法學。題目多數是字面題，只有少數推論題（L61）。
- **實際活動時間沒有記錄**：重讀組讀了幾遍、兩組各花多少時間，原文都沒有報告，只有「上限同為 30 分鐘」。

## 結果（逐項）

Table 1（L77–88）的平均（標準差），已對過 PDF：

| # | 階段 | 條件 | 期末測驗正確率 | 原文一句 |
|---|---|---|---|---|
| 1 | 1＋2 | 測驗＋長間隔 | 67.0%（SD 21.7） | 「Testing long interval 67.0 (21.7) %」 |
| 2 | 1＋2 | 重讀＋短間隔 | 48.6%（SD 21.6） | 「Re-reading short interval 48.6 (21.6) %」 |
| 3 | 3 | 測驗＋短間隔 | 67.7%（SD 21.4） | 「Testing short interval 67.7 (21.4) %」 |
| 4 | 3 | 重讀＋短間隔 | 41.3%（SD 25.3） | 「Re-reading short interval 41.3 (25.3) %」 |
| 5 | 4 | 測驗＋長間隔 | 45.9%（SD 22.1） | 「Testing Long interval 45.9 (22.1) %」 |
| 6 | 4 | 測驗＋短間隔 | 44.6%（SD 22.8） | 「Testing Short interval 44.6 (22.8) %」 |

檢定：

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 階段 1＋2：測驗＋長間隔勝重讀＋短間隔 | F(1, 25) = 41.42，p < .001，η² = .154；67.0% vs 48.6%；n = 27；Figure 2 的 95% 信賴區間 ±11.8 與 ±11.5 | 測驗（4 天後做）vs 重讀（1 天後做），期末測驗都在第二次學習後 7 天；受試者內 | L92、L98 | 「The main effect of Learning Procedure proved significant, F(1, 25) = 41.42, p < 0.001, η2 = 0.154」 |
| 8 | 階段 1＋2：順序主效果與交互作用皆不顯著 | 兩者 F < 1（沒有給精確值） | 先做哪個條件（等於哪一班） | L92 | 「neither the main effect of Order nor the interaction of the two factors was significant, both Fs <1」 |
| 9 | 階段 3：同樣隔 1 天，測驗勝重讀 | F(1, 24) = 8.2，p < .01，η² = .254；67.7% vs 41.3%；n = 26 | 測驗（5B 班）vs 重讀（5A 班），都是隔 1 天；受試者間，等於兩班相比 | L101 | 「The analysis proved significant, F(1, 24) = 8.2, p < 0.01, η2 = 0.254, with participants in the Testing condition outperforming participants in the Re-reading condition」 |
| 10 | 階段 4：同樣是測驗，隔 1 天與隔 4 天**無顯著差異** | F < 1（沒有給自由度、精確 F、p、效果量或信賴區間）；44.6% vs 45.9%；n = 25 | 隔 1 天（5A 班）vs 隔 4 天（5B 班）再做填空測驗；受試者間，等於兩班相比 | L105 | 「The result was not significant, F <1: Participants in the Short-interval condition performed similarly to participants in the Long-interval condition (mean accuracy percentage scores: 44.6% and 45.9%, respectively).」 |
| 11 | 階段 4 的整體分數比前三個階段低 | 約 45% 對前三階段測驗條件的約 67% | 跨階段、跨課文，不是設計內的比較 | L121 | 「the mean percentage scores in Phase 4 were lower than those observed in Phases 1, 2, and 3 … This might suggest that Text 4 was more difficult than the others.」 |
| 12 | 測驗組在學習當下都做到全對 | 「All students reached complete accuracy」 | — | 補充 1.4 | 「All students reached complete accuracy in completing the gaps」 |

備註：

- 第 7 項的 η² = .154 與 F(1, 25) = 41.42 對不上淨 η²（照 F 與自由度換算，淨 η² 約 .62）；原文沒說是哪一種 η²（可能是廣義 η² 或以總變異為分母）。第 9 項的 .254 則與淨 η²（8.2 / (8.2 + 24) = .255）相符。引用時不要拿這兩個 η² 互比。
- 第 7 項把「測驗」與「長間隔」綁在一起，作者自己說只能評估合併效果（L113「as STRATEGY and SPACING INTERVAL were co-manipulated in these phases, we could only evaluate their combined effect」）。
- 第 10 項：原文沒有做等價檢定；每班大約 12 到 13 人。這個無差異只能寫成「沒測到差異」。
- 我比對補充材料裡的題目後看到的（原文沒有討論）：期末開放題問的事實，與學習時填空題要填的事實高度重疊（例如階段 1 填空第 10 題填「Alessandria、biblioteca、faro」，期末第 8、9 題問同一件事）。所以測驗組在學習階段等於練過期末題的內容，還看過正確答案；重讀組沒有。這不影響階段 4 的間隔比較（兩組都做測驗），但會影響「測驗勝重讀」的幅度怎麼解讀。

### 作者對「間隔沒有效果」的解釋（L117–121）

1. 兩個條件其實都有間隔：傳統研究的集中是同一天、間隔為零；這裡是 1 天對 4 天。「both the massed and distributed conditions comprised two spaced study sessions … with the only difference being the length of the interval」（L117）。
2. 兩組都用測驗，最有效的策略可能蓋掉間隔的額外好處（L119）。
3. 1 天可能已經夠長；4 天可能與 1 天差得不夠多，也可能太長而讓學生在第二次學習前忘掉部分內容（L119，引 Cepeda 等 2008 的先升後降）。
4. 第四篇課文比較難：它偏說明文而非敘事文（羅馬社會的貴族與平民），「the generally poorer performance on this text may have obscured potential spacing effects」（L121）。

四點都是事後推測，原文沒有資料檢驗任何一點。

## 作者自己列的限制（L129–133，另見 L113、L121、註腳 1、2）

1. 樣本小，是便利取樣，沒有事前檢定力分析；人數更多才可能偵測到較小的效果，「such as those that did not reach significance in this study」（L129）。
2. 階段 3 與 4 沒有對調條件，班級與條件重疊；作者以階段 1＋2 的順序效果不顯著推定兩班相當，但承認「reversing the assignment of conditions to the two classes in Phases 3 and 4 could have provided more accurate and reliable results」（L131）。
3. 策略都在教室裡、老師看著的情況下執行；沒有學生自己在家用這些策略的條件，推到自學情境受限（L133）。
4. 策略與間隔在階段 1＋2 綁在一起（L113）；四個條件沒有完全交叉（註腳 2）。
5. 第四篇課文可能比較難（L121）。
6. 準實驗、用現成班級（註腳 1）。

作者沒有列、但從方法看得出來的：只有一所學校的兩個班；一位評分者（雖然不知道條件）；沒有報告各班在階段 3、4 的人數；重讀組的實際閱讀次數與時間沒有記錄；期末題與填空題內容重疊；期末測驗一律在第二次學習後 7 天，所以從第一次閱讀算起，短間隔組是第 9 天考、長間隔組是第 12 天考。

## 與摘要說法不一致的地方

摘要只在重抓的 XML 裡，原文檔沒有。逐項對過：

1. 摘要說研究探討「the effects of combining retrieval and distributed practice」，沒有交代這是準實驗、只有兩個班 33 人、每個分析 25 到 27 人。
2. 摘要說測驗程序是給正確性回饋「until they achieved 100% correct answers」，與正文、補充材料一致。
3. 摘要說間隔操弄「did not yield a significant effect」，與正文一致；但摘要沒有說這個比較是 1 天對 4 天（不是集中對分散）、兩組都用測驗、而且是兩班相比。標題的「whether distributed or not」比摘要與正文都強：「重讀＋長間隔」從來沒有測過，支持這句話的只有「測驗＋長間隔勝重讀＋短間隔」與「測驗＋短間隔勝重讀＋短間隔」兩個比較。
4. 摘要結尾說結果對「text comprehension and long-term retention」有意義；實際量的是 7 天後的事實性簡答題，多數是字面題。
5. Figure 1 的圖說（L58）與正文、圖本身、Table 1 互相矛盾：圖說寫階段 1＋2 是重讀對「short-interval testing」、階段 3 是重讀對「long-interval testing」，剛好寫反。看原圖確認：階段 1＋2 是「testing long interval」、階段 3 是「testing short interval」，以正文與表為準。圖說另一句說階段 4 的差別是「the interval between the initial study and the final test」，實際操弄的是第一次閱讀到第二次學習的間隔。
6. 正文（L69）說第二次批改後「only one final opportunity」，補充 1.3 說整個流程「repeated up to three times」；兩者指的都是最多三輪作答，說法不同但不衝突。

## 與清單「要撐的結論」不合的地方

清單寫的是：「提取勝重讀；單獨拉長間隔（1 天對 4 天）無差別」。

- 「提取勝重讀」：方向撐得住（階段 3：67.7% 對 41.3%；階段 1＋2：67.0% 對 48.6%）。要改寫的地方：這裡的「提取」是填空題加上看答案、重做到全對，不是單純的提取；期末題與填空題內容重疊；階段 3 是兩個現成班級相比。寫成「填空測驗加回饋勝過重讀」比較準確。
- 「單獨拉長間隔無差別」：只能寫成「沒測到差別」。這個比較只有 25 人、是 5A 班對 5B 班、沒有對調、沒有報告精確的檢定值或信賴區間、用的是全系列最難的一篇課文（兩組都只有約 45%）。它撐不起「間隔在小學課堂無效」這種一般化的句子，只夠當一個「把間隔從 1 天拉到 4 天、沒看到好處」的小型案例。
- 清單沒寫到的重點：這個研究**沒有集中條件**，短間隔已經是隔一天。它比的是兩種間隔長度，不是集中對分散。這一點與 Greving & Richter 2019 討論的「真實情境裡沒有純粹的集中」可以互相對照，但各自是各自的設計。
- 清單標這一篇為「反／無」：無效果只限間隔那一項；策略那一項是正向結果。

## 讀取紀錄

| 段 | 位置 | 內容 |
|---|---|---|
| 1 | 原文檔 L1–42 | 標題、前言全文、三個研究目的 |
| 2 | 原文檔 L44–69 | 受試者、設計、Figure 1 圖說、教材、程序 |
| 3 | 原文檔 L71–105 | 計分、Table 1、階段 1＋2、Figure 2 圖說、階段 3、階段 4 |
| 4 | 原文檔 L107–141 | 討論全文、限制、未來研究、結論 |
| 5 | 重抓 XML：首頁資料、摘要、關鍵字 | 作者、單位、日期、摘要、文章類型 |
| 6 | 重抓 XML：正文之後 | 致謝、經費、註腳 1 與 2、資料可得性（OSF）、倫理（University of Trento，編號 2023-01PA）、作者貢獻、利益衝突、生成式 AI 聲明、參考文獻 51 筆（掃過） |
| 7 | 補充材料 txt L1–260 | 附錄 1.1–1.5（招募、教材編製、程序、計分、附加分析）、階段 1 的課文、填空題、答案、期末題 |
| 8 | 補充材料 txt L260–718 | 階段 2、3、4 的課文、填空題、答案、期末題（義大利文原文） |
| 9 | 圖 | Figure 1 原圖（jpg）看過；Figure 2 只讀圖說與替代文字 |

對過 PDF 版面的表：Table 1。補充材料 1.5 的「附加分析」與正文階段 1＋2 的分析是同一個（同樣的 F(1, 25) = 41.42），沒有額外結果。OSF 上的資料集沒有讀。
