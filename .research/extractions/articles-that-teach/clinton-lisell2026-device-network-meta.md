# 抽取紀錄：Clinton-Lisell & Litzinger 2026，Education and Information Technologies

- **書目**：Virginia Clinton-Lisell, Christine Litzinger (2026). Decoding digital reading: a network meta-analysis of comprehension across devices. *Education and Information Technologies*, 31, 1611–1643. doi:10.1007/s10639-025-13843-8。兩位作者都屬 University of North Dakota, Educational Foundations and Research（原文檔 L69–76，對首頁核過）。收稿 2025-01-03，接受 2025-11-12，線上刊出 2026-01-04（L62）。
- **取得網址與版本**：https://link.springer.com/content/pdf/10.1007/s10639-025-13843-8.pdf ，Springer 刊出版，CC BY 4.0 開放取用（L2280 授權聲明；Unpaywall 以 `unpaywall@example.org` 查：is_oa true、hybrid、publishedVersion、license cc-by）。出版者合法公開，可用。
- **原文檔**：`.research/raw/learning-content/q5-social/clinton-lisell2026-network.md`，2,996 行、112,044 位元組（Jina reader 把同一 PDF 轉成 markdown，33 頁）。
- **對表用檔**：同一網址另存 PDF 到 scratch，`pdftotext -layout` 轉出 `clinton-layout.txt`（1,608 行），Table 2–5 與 Table 6 的可靠度欄用它逐列對過（見讀取紀錄）。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 24（清單 F 第 24#9 列）

## 研究設計

- **類型**：網絡統合分析（network meta-analysis），頻率學派，R 套件 netmeta，隨機效果模型，以紙本為參照組（L1357–1363）。效果量用 Meta-Essentials 算 Hedges' g；一個研究有多個測量時用 metafor 合成一個（L1323–1333）。
- **研究問題**（L446–454）：(1) 紙本、電腦、平板、電子書閱讀器、手機在閱讀理解上彼此怎麼比；(2) 這些比較是否隨「需不需要捲動才能讀完全文」而變。
- **納入標準**（L458–492，編號原文有重複的 9）：至少一個螢幕條件；另一條件是別的裝置或紙本；有閱讀理解測量；受試者能獨立閱讀；螢幕條件沒有紙本做不到的互動功能；**文體限說明文**（理由：敘事文的媒介效果已知不明顯）；英文報告；控制環境；以母語閱讀；2010 年以後發表；統計量足夠或作者提供；隨機分派或對抗平衡。
- **檢索**（L494–532、附錄 A L1984–2004）：Web of Science 362、ProQuest 92、Scopus 1,499、ERIC EBSCO 285，共 2,238 筆，去重 325 後篩 1,913 筆標題摘要（兩人，用 Abstrackr）；71 篇全文審查，21 篇合格；往回查 15、往前查 8、既有回顧的參考文獻 4、作者著作清單 1。最後 **49 份報告、56 個獨立樣本研究**。正文沒寫檢索日期。
- **受試者**：Table 1（L564–1281）。大多數是大學生；另有小一（Florit 2023a 115 人、2023b 63 人）、五年級（Halamish & Elbaz 2020，38 人）、五六年級（Salmerón 2021，182 人）、六年級（Kestel 2014，118 人）、八年級（Ronconi 2022，150 人）、國中（Froud 2024，59 人）、高中（Hines 2021，38 人；Porion 2016，72 人）、青少年（Kim & Kim 2013，108 人）、海岸防衛隊員（Niccoli 2015，231 人）。作者說多數是大學生讀英文的科學文本（L1870–1872）。
- **捲動的編碼**（L550–556、L1285–1295）：需要用捲軸、滑鼠或手指把文字上下移動才看得到全文，就算「需要捲動」；方法段沒寫清楚的去信問作者；仍無法判定的不進第二個研究問題（Hongler 2015 的平板條件、Niccoli 2015、Taylor 2011）。翻頁（滑動或按鍵）與全文一屏可見都算「不需要捲動」（L1526–1528）。
- **品質編碼**：用 What Works Clearinghouse 5.0 的九項準則，兩人編碼 κ = 0.87（L1297–1309；附錄 B L2006–2172；Table 6）。描述性編碼 κ = 0.88（L536–538）。
- **第二個研究問題的分析方式**：netmeta 不能加調節變項，所以把資料**拆成兩組分別跑**網絡統合分析（需要捲動／不需要捲動），不是在同一模型裡檢定差異（L1333–1341、L1942–1946）。
- **出版偏誤**：漏斗圖目視加 Egger 檢定（L1430–1457）。
- **一致性**：net splitting 比較直接與間接證據（L1459–1475、Table 3）。
- **資料與程式碼**：OSF https://osf.io/hdyrc/（L2272–2274）。

## 結果（逐項）

正負號：Table 2、4、5 的 g 是「各裝置對紙本」，正值表示紙本較好（正文說 computer 0.17 時是「reading comprehension was reliably lower from computers」，L1363–1365）。下列數字全部對過 PDF 版面。

### 整體（Table 2，L1411–1421；PDF 頁 1625）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 規模 | 56 個研究、79 個比較 | — | 5.1，L1357–1359 | 「There were 56 studies with 79 comparisons.」 |
| 2 | 電腦 | g = 0.17（95% CI 0.09–0.25），z = 4.17，p < 0.0001 | 電腦 vs 紙本 | Table 2 | 「Computer 0.17 0.09; 0.25 4.17 <0.0001」 |
| 3 | 電子書閱讀器 | g = 0.18（−0.01–0.36），z = 1.83，p = 0.07，**不顯著**（討論稱「marginally significant」） | 閱讀器 vs 紙本 | Table 2；L1552–1554 | 「E-reader 0.18 −0.01; 0.36 1.83 0.07」 |
| 4 | 手機 | g = 0.26（0.06–0.46），z = 2.51，p = 0.01 | 手機 vs 紙本 | Table 2 | 「Smartphone 0.26 0.06; 0.46 2.51 0.01」 |
| 5 | 平板 | g = 0.09（−0.03–0.21），z = 1.49，p = 0.13，**不顯著** | 平板 vs 紙本 | Table 2 | 「Tablet 0.09 −0.03; 0.21 1.49 0.13」 |
| 6 | 排名（P-score） | 紙本 0.97、平板 0.67、閱讀器 0.36、電腦 0.36、手機 0.13 | 五種條件 | 5.1，L1377–1381 | 「Paper had the highest P-score of 0.97, followed by tablets with 0.67, e-readers with 0.36, computers with 0.36, and smartphones with 0.13.」 |
| 7 | 證據最多的比較 | 電腦對紙本最多，其次平板對紙本；手機對平板、閱讀器對平板、手機對電腦較少 | 網絡圖 Fig. 3 | L1393–1399 | 「the comparisons with the most evidence were comparing computers to paper, followed by comparing tablets to paper.」 |
| 8 | 出版偏誤 | 漏斗圖「fairly symmetrical」；Egger p = 0.35 | — | L1436–1457 | 「The p value for Egger's test was 0.35 which does not indicate significance.」 |

### 直接與間接證據（Table 3，L1493–1509；PDF 頁 1627）

| # | 比較 | k（效果量數） | 直接證據比例 | NMA 估計 g | 直接 | 間接 | 差 | p |
|---|---|---|---|---|---|---|---|---|
| 9 | 電腦 vs 閱讀器 | 3 | 0.42 | −0.0071 | −0.1732 | 0.1148 | −0.2881 | 0.1553 |
| 10 | 電腦 vs 紙本 | 39 | 0.94 | 0.1684 | 0.1823 | −0.0333 | 0.2156 | 0.1902 |
| 11 | 電腦 vs 手機 | 2 | 0.31 | −0.0925 | −0.3519 | 0.0233 | −0.3752 | 0.103 |
| 12 | 電腦 vs 平板 | 7 | 0.40 | 0.0781 | 0.0829 | 0.0749 | 0.008 | 0.9537 |
| 13 | 閱讀器 vs 紙本 | 6 | 0.87 | 0.1755 | 0.1293 | 0.482 | −0.3527 | 0.2156 |
| 14 | 閱讀器 vs 手機 | 0 | 0 | −0.0854 | — | −0.0854 | — | — |
| 15 | 閱讀器 vs 平板 | 1 | 0.11 | 0.0852 | 0.2094 | 0.0705 | 0.1389 | 0.7018 |
| 16 | **手機 vs 紙本** | **3** | 0.52 | 0.2609 | **0.1215** | **0.4103** | −0.2888 | 0.1655 |
| 17 | 平板 vs 紙本 | 16 | 0.86 | 0.0903 | 0.0838 | 0.1317 | −0.0479 | 0.7869 |
| 18 | 手機 vs 平板 | 2 | 0.45 | 0.1706 | 0.1322 | 0.2019 | −0.0697 | 0.752 |

作者的判定：沒有可靠的不一致（L1469–1471）。但限制段自己說手機對紙本、閱讀器對紙本的直接與間接證據差距「notable」，檢定力不足，對這兩種裝置的結果難有信心（L1916–1936）。手機對紙本的直接證據只有 3 個效果量，直接估計 0.12，網絡估計 0.26 有一半來自間接證據（0.41）。

### 需要捲動（Table 4，L1510–1518；PDF 頁 1627）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 19 | 規模 | 25 個研究、29 個比較；沒有任何閱讀器需要捲動的研究 | 5.2，L1479–1483 | 「There were 25 studies with 29 comparisons. There were no studies in which scrolling to read occurred with an e-reader.」 |
| 20 | 電腦 | g = 0.35（0.25–0.44），z = 7.22，p < 0.001 | Table 4 | 「Computer 0.35 0.25; 0.44 7.22 <0.001」 |
| 21 | 手機 | g = 0.48（−0.14–1.10），z = 1.53，p = 0.13，**不顯著** | Table 4；L1487–1489 | 「However, the difference between smartphones and paper was not significant」 |
| 22 | 平板 | g = 0.38（0.04–0.73），z = 2.18，p = 0.03 | Table 4 | 「Tablet 0.38 0.04; 0.73 2.18 0.03」 |
| 23 | 排名 | 紙本 0.97、電腦 0.42、平板 0.36、手機 0.26 | L1489–1491 | 原文同左 |

### 不需要捲動（Table 5，L1568–1577；PDF 頁 1628）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 24 | 規模 | 31 個研究、39 個比較 | 5.3，L1530–1532 | 「There were 31 studies and 39 comparisons.」 |
| 25 | 電腦 | g = 0.07（−0.03–0.17），p = 0.17 | Table 5 | 「Computer 0.07 −0.03; 0.17 1.37 0.17」 |
| 26 | 閱讀器 | g = 0.12（−0.06–0.30），p = 0.19 | Table 5 | 「E-reader 0.12 −0.06; 0.30 1.30 0.19」 |
| 27 | 手機 | g = 0.12（−0.10–0.35），p = 0.28 | Table 5 | 「Smartphone 0.12 −0.10; 0.35 1.08 0.28」 |
| 28 | 平板 | g = 0.03（−0.09–0.15），p = 0.64 | Table 5 | 「Tablet 0.03 −0.09; 0.15 0.47 0.64」 |
| 29 | 判定 | 紙本對任何裝置都沒有顯著差異 | L1532–1534 | 「there were no significant differences in comprehension when comparing reading from paper to any of the digital devices.」 |
| 30 | 排名 | 紙本 0.84、平板 0.65、電腦 0.43、手機 0.30、閱讀器 0.28 | L1536–1540 | 原文同左 |

### 品質編碼（Table 6，L2174–2270 與 L2332–2356；PDF 頁 1635–1636）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 31 | 沒報測量信度 | 正文寫 56 篇中 28 篇；**我依 Table 6 第 6 欄逐列數（56 列）是 27 篇標 n** | 6.4，L1858–1862；Table 6 | 「28 out of 56 studies did not have the reliability of their outcome measure reported.」 |
| 32 | 有混淆因素（第 9 項標 y） | 1 篇：Chang 等 2013 | Table 6 | 表列 |
| 33 | 其他各項 | 56 篇全部：隨機（1）是、隨機未受損（2）否、高流失（3）否、基線對等（4）不適用、表面效度（5）是、過度對齊（7）否、一致蒐集（8）是 | Table 6 | 表列 |

### 作者的詮釋（討論）

| # | 內容 | 位置 | 原文一句 |
|---|---|---|---|
| 34 | 捲動是關鍵 | L1668–1680 | 「reading from paper seemed to only have advantages over any digital device when scrolling was necessary on the digital device. Based on these findings, it may be inferred that scrolling to read text interferes with comprehension」 |
| 35 | 捲動被當二分變項，是人為的 | L1680–1686 | 「it must be noted that scrolling was artificially treated as a binary variable.」 |
| 36 | 手機排名低：作者推測是螢幕小 | L1632–1640 | 「A smaller screen size may explain why smartphones yielded poorer comprehension than did tablets.」（推測） |
| 37 | 閱讀器排在平板後：三篇閱讀器研究的螢幕大小近似手機 | L1658–1664 | 「in three of the studies in which e-readers were used, the screen measurements indicated the screen size was similar to a smartphone (Margolin et al., 2013, 2018; Sage et al., 2020).」 |
| 38 | 後設認知解釋是猜測 | L1776–1778 | 「there is a lack of inquiry into metacognitive differences by devices, so this possibility is based on conjecture.」 |
| 39 | 實務建議：電子文本做成翻頁而非捲動 | L1846–1850；結論 L1976–1980 | 「For college students reading expository texts in English, developing e-texts that may be read through pagination rather than scrolling may be useful.」 |
| 40 | 結論：平板加翻頁可能最好 | L1966–1968 | 「digital reading from a tablet with text formatted for swiping pages may be better than other forms of digital reading.」 |

## 作者自己列的限制（6.4，L1856–1950；另見 L1680–1686、L1726–1728）

1. 56 篇中 28 篇沒報測量信度，研究品質無法準確判定（L1858–1868）。
2. 年齡、語言、文體受限：多數是大學生讀英文科學文本；刻意只收說明文。對 K-12、年長者、非科學主題、非英語難以外推（L1870–1886）。
3. 捲動是二分編碼，沒考慮捲動量、捲動速度、個人差異（L1888–1914）。
4. 多數比較是電腦或平板；只有 6 個研究比閱讀器對紙本、3 個比手機對紙本；這兩者的直接與間接證據差距明顯，檢定雖不顯著但檢定力不足，「it is difficult to be confident in either the e-reader or smartphone findings」（L1916–1936）。
5. netmeta 不能處理同一研究內多個效果量的相依，只能合併；捲動只能拆組分析，不能做統合迴歸；工具進步後應更新（L1938–1950）。

## 與摘要說法不一致的地方

1. **捲動時「紙本對數位裝置明顯較好（gs 0.35–0.48）」**（摘要 L42–46）：0.48 是手機，而手機在捲動組**不顯著**（CI −0.14–1.10，p = 0.13；Table 4，正文 L1487–1489 自己也這樣寫）。顯著的只有電腦 0.35 與平板 0.38。摘要把不顯著的手機包進「notably better」的範圍。
2. **排名順序**：摘要寫「paper … followed in order by tablets, e-readers, computers, and smartphones」，正文閱讀器與電腦的 P-score 同為 0.36（L1379）。順序是並列，不是先後。
3. **「Reading from a tablet without needing to scroll was ranked better … (Hedges' g = 0.03)」**：0.03 是平板對紙本的差（不顯著），不是平板勝過其他裝置的差。排名差距（P-score 平板 0.65、電腦 0.43、手機 0.30、閱讀器 0.28）沒有附任何顯著性檢定；正文也沒有報不捲動組裡裝置彼此之間的兩兩比較。
4. **研究數**：摘要寫「56 studies with independent samples with 79 effect sizes」，方法段寫「49 reports with 56 studies」（L528–530），一致；但「28 out of 56」沒報信度（L1860）與 Table 6 數出的 27 篇差一篇。
5. **P-score 的定義**：正文說 P-score「on a range of 1 to −1」，正值表示有益、負值表示有害（L1373–1377）。netmeta 的 P-score 範圍是 0 到 1（這是我對該方法的理解，原文所引 Harrer 等 2021 沒有讀）；全文報的 P-score 也全是 0 到 1 之間的正值。不影響數字，但原文的描述可能有誤，不確定。
6. **Fig. 2 圖說前一句**寫「comparing each of the three electronic devices to paper」（L1371–1373），但 Table 2 列了四種裝置。
7. **適用範圍**：討論說「these findings may be limited to college students reading science texts in English」（L1726–1728），但納入研究有挪威文（Norman & Furnes 2016）、中文（Chen 等 2014、Xu 等 2020 中國樣本）、多篇小學與中學生。這是作者概括過頭，不是數字錯。
8. **附錄 B 的判定規則自相矛盾**：先說第 7 項「是否過度對齊」答「是」才有問題，後面又寫「5, 6, and 7 need to be yes」才符合標準（L2104–2116、L2164）。Table 6 第 7 項全部是 n。原文沒有用這套規則把任何研究排除，也沒有報告每篇是否符合 WWC 標準，所以不影響分析；照實記錄。

## 與清單「要撐的結論」不合的地方

清單（24#9）：「需要捲動時紙本較好（g = 0.35–0.48），不需要時沒有可靠差異；半數研究沒報信度」；之前讀到哪欄註「手機的研究數沒讀到」。

- **「需要捲動時紙本較好（g = 0.35–0.48）」要改寫**。照抄了摘要的範圍，但 0.48 的手機不顯著。正確寫法：需要捲動時，紙本勝過電腦（g = 0.35）與平板（g = 0.38）；手機的點估計 0.48 但信賴區間跨零（−0.14–1.10），不能說紙本較好。另外這是兩組資料分開跑的結果，原文沒有檢定「捲動組與不捲動組的差異本身是否顯著」。
- **「不需要時沒有可靠差異」**：撐得住（Table 5 四種裝置都不顯著，g = 0.03–0.12）。但作者同時說紙本在每一組排名都最高（L1564–1566）；兩件事要一起寫。
- **「半數研究沒報信度」**：撐得住（正文 28／56；表上數到 27／56，差一篇）。
- **手機的研究數**：手機對紙本的直接比較只有 **3 個效果量**（Table 3；限制段說 3 個研究）。整體手機對紙本 g = 0.26 有一半權重來自間接證據；作者自己說對手機的結果「difficult to be confident」。Table 1 裡有手機條件的研究：Haverkamp 2023（手機或平板，捲動或翻頁）、Sanchez & Branaghan 2011、Sanchez & Goolsbee 2010（都是電腦對捲動的手機）、Sheen & Luximon 2021（平板對手機，都不捲動）、Xu 2020 澳洲與中國樣本（手機全文一屏可見，70–140 字的短文）。哪三個是手機對紙本的直接比較，正文沒有逐一標明，我從 Table 1 推測至少包含 Xu 2020 的兩個樣本，不確定。
- **範圍提醒**：只收說明文、2010 年後、母語閱讀、有互動功能的螢幕條件已排除。Honma 2022（敘事文、日文）不在這份的範圍內，也不在納入清單裡。

## 讀取紀錄

| 順序 | 原文檔行號 | 內容 |
|---|---|---|
| 1 | L1–700 | 檔頭、摘要、關鍵詞、日期、題目作者、導言、理論框架（認知負荷、建構統整、人因、後設認知）、本研究與研究問題、方法（納入標準、檢索、篩選）、編碼開頭、Table 1 前段 |
| 2 | L700–1500 | Table 1 其餘全部、捲動編碼的補述、品質編碼、統計程序、資料透明聲明、結果 5.1（Table 2、Fig. 2–4 圖說、出版偏誤、net splitting）、Table 3 前段 |
| 3 | L1500–2298 | Table 3 後段、Table 4、5.2、5.3、Table 5、討論 6.1–6.4、結論、附錄 A（檢索字串與各庫筆數）、附錄 B（WWC 九項準則）、Table 6 前段、資料可得性、利益衝突、授權 |
| 4 | L2298–2996 | 參考文獻（掃過，去空行後讀）、中間夾著的 Table 6 後段（L2332–2356，Sheen & Luximon 到 Xu 2020）與表注、出版者聲明 |
| 對表 | `clinton-layout.txt` 第 600–800 行 | Table 2、3、4、5 逐列對 g、CI、z、p、k、prop、direct、indir.、Diff，全部與原文檔一致 |
| 對表 | `clinton-layout.txt` 第 1120–1215 行 | Table 6 共 56 列，第 6 欄 n 共 27 列；與原文檔用正則數的結果相同 |

Fig. 1（PRISMA 流程圖）、Fig. 2–6（森林圖、網絡圖、漏斗圖）只讀圖說，圖本身沒看。Table 1 只讀原文檔的 markdown，欄位有合併但每列內容可辨，沒有逐列對 PDF。
