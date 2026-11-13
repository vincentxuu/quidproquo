# 抽取紀錄：Sharif、Chintalapati、Wobbrock、Reinecke 2021，Understanding Screen-Reader Users' Experiences with Online Data Visualizations（ASSETS '21，doi 10.1145/3441852.3471202）

- **書目**：Ather Sharif、Sanjana S. Chintalapati、Jacob O. Wobbrock、Katharina Reinecke（四人全名對過首頁 L3–29，皆為華盛頓大學）。2021。In *The 23rd International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '21)*，October 18–22, 2021, Virtual Event, USA。ACM，16 頁。DOI 10.1145/3441852.3471202（首頁 L63、L66–69）。
- **原文檔**：`.research/raw/learning-content/q5-social/sharif2021-sr-vis.pdf`（16 頁，1,365,623 位元組）。清單上的 `sharif2021-sr-vis.txt`（907 行、107,507 字元）是 `-layout` 轉的雙欄檔，段落左右交錯，**這次沒用**；改用不帶 `-layout` 的 `pdftotext` 重轉成 `.research/raw/learning-content/q5-social/sharif2021-sr-vis.seq.txt`（1,965 行、79,629 字元）。**下面行號一律是 `.seq.txt` 的行號**。
- **取得網址與版本**：https://wildlab.cs.washington.edu/Publications_files/Sharif_ASSETS2021.pdf ——共同作者 Reinecke 主持的華盛頓大學 Wildlab 網站（首頁連到 homes.cs.washington.edu/~reinecke/）。2026-10-14 重新下載，SHA-1 `2ec66c8d…f838c` 與本機檔完全相同。檔內是 ACM 版面、首頁有 ACM 版權聲明與 DOI，PDF 中繼資料的產生器是 LaTeX acmart 2021/05/01，看起來是作者自存的定稿（ACM 允許作者在個人或機構網站放自己的版本）；與 ACM DL 上的刊出版是否逐字相同沒有比對。
- 讀取日期：2026-10-14
- 供 order 23 使用（清單 F，23#5）

## 研究設計

兩個研究，混合方法。

### Study 1：情境訪談（contextual interview）（§3，L236–414）

- **受試者**（§3.1、Table 1，L249–263、L314–380）：螢幕閱讀器使用者 9 人（女 4、男 5），平均 50.2 歲（SD 18.4）。2 人先天全盲，7 人逐漸失明（Table 1 把 P3 標為 "Blind since birth, Partial vision"）。研究所程度 7 人。每日用電腦 >5 小時 5 人、3–5 小時 2 人、1–2 小時 2 人。平均每天接觸兩個以上的視覺化。都在美國。招募：口耳相傳、滾雪球、Facebook／Twitter、身障者郵件清單；收到「洞見飽和」就停（L262）。酬勞 15 美元禮券，45–60 分鐘。螢幕閱讀器：JAWS 6、NVDA 2、Fusion 1。
- **教材**（§3.2，L269–280）：用 Google 搜「d3 visualizations」等詞，挑 50 個含視覺化的網頁（Google Charts、ChartJS 或 D3；長條、散布或折線）。先篩過「網頁本身」對螢幕閱讀器可用（但不篩視覺化）。50 頁隨機抽 27 頁（每種圖型 9 頁），分層隨機分給每人 3 頁、圖型各一。
- **程序**（§3.3，L286–308）：2020 年 8 月以 Zoom 進行；受試者分享螢幕與螢幕閱讀器聲音；放聲思考，每頁 10–15 分鐘；每頁看完做半結構訪談（找什麼資訊、遇到什麼困難、什麼能改善、跟日常經驗有何不同）。兩位作者主持、錄影並轉錄。
- **分析**（§3.4，L392–414）：主題分析（Braun & Clarke），語意取向、本質論典範。先用兩份訪談建初始編碼，最後 29 個編碼；每份逐字稿兩人獨立編，評分者一致率 88÷106 = 83%（L405）；29 碼併成 10 個軸碼，最後 9 個主題。分析不分圖型。

### Study 2：任務型可用性實驗（§5，L702–924）

- **受試者**（§5.1，L717–731；Appendix B Table 7，L1717–1964）：72 人，螢幕閱讀器使用者 36、非使用者 36。檢定力：0.8 檢定力偵測大效果、α = .05（L719–721）。螢幕閱讀器組女 17、男 18、性別流動 1，平均 44.1 歲（SD 14.1）；非使用者組女 21、男 15，平均 43.4 歲（SD 12.8）；年齡兩組無差異 t(70) = 0.23，p = .823（L725–726）。招募方式同 Study 1。酬勞：螢幕閱讀器組 15 美元（30–45 分鐘），非使用者 10 美元（10–20 分鐘）。Table 7 列出 36 位螢幕閱讀器使用者，視力狀態混合：先天全盲、逐漸失明、部分視力都有（例如 S22 "Partial vision"、S25 "Partial vision"、S30 "Partial vision"）。**非使用者組的視力狀況原文沒寫**。
- **器材與教材**（§5.2，L737–860）：React 寫的線上實驗網站，作者自己與螢幕閱讀器使用者測過可及性。資料集：27 份 Kaggle 資料集，題材分散；折線圖的 9 份是有明確趨勢的時間資料。複雜度：從 Borkin 等 2,068 張圖抽 150 張算資料點數分布（Table 2），低／中／高複雜度分別取「最小到第 25 百分位」「第 25 到第 75 百分位」「第 75 百分位到最大」之間的隨機點數。**視覺化由作者依 WCAG 2.0 與各函式庫官方的無障礙建議自己實作**（L814–817「following the WCAG 2.0 Guidelines [14] in combination with the official accessibility recommendations from the visualization libraries」），預設可互動，三個函式庫都做。
- **題目**（§5.2.2，L821–860）：依 Brehmer & Munzner 的任務分類，難度由低到高：(1) 順序統計（最大或最小值）；(2) 兩點比較；(3) 圖型專屬題——長條圖問單點值、折線圖問整體趨勢、散布圖問相關。全部四選一：正確答案、兩個錯誤答案、「Unable to extract information」，選項順序隨機。
- **程序**（§5.3，L866–892）：線上、無人監督。每人看 3 個視覺化（各用不同函式庫），每個視覺化回答 3 題（低／中／高難度各一）；複雜度與圖型在函式庫順序間做平衡。每題三頁：第 1 頁只有題目、第 2 頁題目加圖、第 3 頁題目加選項。
- **設計與分析**（§5.4，L898–924）：混合因子設計。組間：是否為螢幕閱讀器使用者（SRU）；組內：函式庫（ChartJS、D3、Google Charts）、資料複雜度、題目難度。依變項：**擷取資訊正確率 AEI**（答錯或選「無法擷取」都算不正確，二元）與**互動時間 IT**（螢幕閱讀器組：焦點在視覺化根元素上的總時間；非使用者：焦點在含視覺化網頁上的總時間——兩組的計時定義不同，L909–913）。AEI 用混合邏輯斯迴歸，IT 用線性混合模型 ANOVA（取對數後分析），模型 `SRU × VL + SRU × CMP + SRU × DF + Age + Subject`。每人 9 題，共 72 × 9 = 648 題（L923–924）。

## 結果（逐項）

表格都對過 PDF 第 10、11 頁（Table 3、4、5）與第 8 頁（Table 2）。

### Study 1（質性）

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 視覺化完全偵測不到 | 27 個網頁中 33% 的視覺化，螢幕閱讀器完全沒偵測到 | §4.1.1 | L434–437；導論 L109–111 | 「in 33% of the web pages presented to the participants, their screen-reader software did not detect the visualization at all.」 |
| 2 | 偵測到也讀不懂 | 只被念成 "blank" "graphic" "frame" "object"（沒有數字） | §4.1.2 | L466–474 | 「The screen-reader software often only identified the visualization as "blank," "graphic," "frame," or "object".」 |
| 3 | 拿不到資料點 | ChartJS、D3 做的圖拿不到資料；Google Charts 給資料表，但逐點聽很費時 | §4.1.3、RQ1 小結 | L445–499 | 「Google Chart provides access to the data, but our participants found going through each data point tedious and time-consuming.」 |
| 4 | 先看全貌再鑽細節 | 先找整體趨勢、極值、軸資訊；有興趣才看個別資料點與比較 | §4.2 | L510–572 | 「screen-readers first explore the data holistically, seeking the overall trend, extrema, and axes information.」 |
| 5 | 想要的改善方式 | 四個主題：表格呈現、文字呈現（替代文字）、以非視覺格式給整體趨勢（音訊化、摘要、點字印出）、多模態 | §4.3 | L579–700 | 「(1) Tabular representation; (2) Textual representation; (3) Overall trends in non-visual formats; and (4) Multimodality.」 |
| 6 | 受試者對摘要的具體期待（P8） | 最高點、最低點、平均、趨勢方向，用白話、放在資料前面 | §4.3.3 | L657–670 | 「Showing the highest point, lowest point, maybe mean or average, and a trend, is it generally going up, down, up and down, is it stagnant?」 |

### Study 2：正確率 AEI（Table 3、Table 4）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 7 | 整體正確率差距 | 螢幕閱讀器組 34%（109/324）vs 非使用者 87%（283/324）；「percentage difference」61.48%（＝兩者差除以 87%，是相對差，不是 61 個百分點；絕對差約 53 個百分點） | SRU 主效果 χ²(1, N=72) = 67.22，p < .001，Cramer's V = 0.18 | §6.1、Table 3、Table 4 | L947–950；表 L989–1045、L1055–1204 | 「AEI is considerably lower for screen-reader users (34%) compared to non-screen-reader users (87%)—a percentage difference of 61.48%.」 |
| 8 | 函式庫的差別（螢幕閱讀器組） | Google Charts 73%（79/108）、D3 17%（18/108）、ChartJS 11%（12/108） | 非使用者組：ChartJS 87%、D3 89%、Google 86%；VL 主效果 χ²(2) = 40.45，p < .001，V = 0.14；SRU × VL 交互作用 χ²(2) = 50.35，p < .001，V = 0.15 | §6.1、Table 4 | L951–964 | 「Google Charts had the best performance (73%) for screen-reader users, followed by D3 (17%) and ChartJS (11%).」 |
| 9 | 題目難度：**無效果** | 螢幕閱讀器組 低 32%、中 33%、高 35%；非使用者 87%、87%、88% | DF χ²(2) = 0.35，p = .838；SRU × DF χ² = 0.06，p = .972 | Table 3、Table 4 | L965–967 | 「we also investigated the effects of Complexity, Difficulty, Age, and interactions between SRU × Complexity, and SRU × Difficulty, but did not find a significant effect on AEI.」 |
| 10 | 資料複雜度：**無效果** | 螢幕閱讀器組 低 37%、中 31%、高 32%；非使用者 87%、91%、84% | CMP χ² = 1.94，p = .380；SRU × CMP χ² = 2.20，p = .332 | Table 3、Table 4 | 同上 | 同上 |
| 11 | 年齡對正確率：**無效果** | — | Age χ² = 2.70，p = .100 | Table 3 | 同上 | 同上 |

### Study 2：互動時間 IT（Table 5、Table 6）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 12 | 整體時間差距 | 螢幕閱讀器組平均 84.6 秒（SD 75.2）vs 非使用者 27.2 秒（SD 16.8）；「210.96% higher」（約 3.1 倍） | SRU 主效果 F(1,69) = 115.33，p < .001，ηp² = 0.63 | §6.2、Table 5 | L1047–1050、L1229–1230 | 「The average IT for participants who used screen readers was 210.96% higher than for participants who did not.」 |
| 13 | 函式庫與時間 | 螢幕閱讀器組 ChartJS 最短、D3 次之、Google Charts 最長；非使用者三者幾乎一樣 | VL F(2,564) = 25.10，p < .001，ηp² = 0.08；SRU × VL F = 31.58，p < .001，ηp² = 0.10 | §6.2、Table 5 | L1231–1238 | 「For screen-reader users, ChartJS had the minimum interaction time, followed by D3 and Google Charts.」 |
| 14 | 正確率與時間的取捨 | Google Charts 每個視覺化將近 2 分鐘，是 D3（平均 1.3 分）的 1.5 倍、ChartJS（平均 1 分）的 1.9 倍 | 螢幕閱讀器組內比較 | §7 討論 | L1342–1348 | 「the trade-off is that navigating through the data table consequently increased their interaction time with the visualizations, attributing to screen-reader users spending almost two minutes on each visualization」 |
| 15 | 難度與時間 | 有主效果與交互作用 | DF F(2,564) = 24.07，p < .001，ηp² = 0.08；SRU × DF F = 12.75，p < .001，ηp² = 0.04 | §6.2、Table 5 | L1239–1243 | 「IT not only significantly differed between question difficulty levels overall, but also differentially between difficulty levels for participants in each screen-reader user group.」 |
| 16 | 複雜度與時間 | 主效果顯著、交互作用不顯著 | CMP F(2,564) = 6.00，p ≈ .003，ηp² = 0.02；SRU × CMP F = 2.01，p = .136 | §6.2、Table 5 | L1285–1290 | 「We also examined the interaction between SRU × CMP, but did not find a significant effect.」 |
| 17 | 年齡與時間 | 50 歲以上互動時間高約 12.18% | Age F(1,69) = 7.03，p = .010（正文寫 p < .05），ηp² = 0.09 | §6.2、Table 5、Table 6 | L1291–1296、L1620–1709 | 「participants over the age of 50 showing higher interaction times by about 12.18%, compared to participants under the age of 50.」 |
| 18 | 其他交互作用：**無效果** | VL × CMP、VL × DF、CMP × DF 都不顯著 | — | §6.2 | L1297–1299 | 「but did not find any significant effects.」 |

### 設計建議（§7.1，L1363–1416）

| # | 建議 | 行號 | 原文一句 |
|---|---|---|---|
| 19 | 視覺化要可被發現、可被理解：給替代文字與 ARIA 屬性 | L1370–1377 | 「We recommend developers and visualization creators to adequately provide alternative text and use ARIA attributes to improve the discoverability of the visualization elements.」 |
| 20 | 同時提供全貌（替代文字）與鑽取（資料表）；替代文字通常不夠細、資料表缺全貌且加重記憶負擔 | L1378–1391 | 「data tables allow exploration of the data in detail, but adds a mental burden for screen-reader users to process all data and lacks efficient support for gaining a holistic overview.」 |
| 21 | 替代文字可依資料自動產生、可個人化 | L1392–1403 | 「we recommend dynamically generating alternative text」 |
| 22 | 提供多種探索模式（如音訊化） | L1404–1413 | 「Online data visualization libraries should offer different modes for exploring the data.」 |

## 作者自己列的限制（§8，L1418–1443）

- 只用了三個函式庫與二維資料；其他函式庫（Highcharts、Recharts）與三維資料可延伸（L1422–1430）。
- 正文另外兩處的自我界定：這是評估「技術」不是評估「人」的能力（L119–122、L933–937）；Study 1 的分析不分圖型，圖型只是為了讓樣本多樣（L413–414）。
- 作者**沒有**列出的：Study 2 無人監督、線上自行招募；兩組計時定義不同；非使用者組視力狀況未報告；實驗用的圖是作者依 WCAG 2.0 自己做的，不是野外抽樣。

## 與摘要說法不一致的地方

- 摘要寫「extract information 61.48% less accurately」，正文給的是 34% vs 87%，61.48% 是相對差（(87.35 − 33.64) ÷ 87.35）。讀者若讀成「少 61 個百分點」會高估；絕對差約 53 個百分點。這不算矛盾，但摘要的寫法容易被誤讀。
- 時間：摘要寫「spend 210.96% more time」，與正文 §6.2「210.96% higher」一致；但討論 §7 寫「have to interact 210% as long」（L1336–1337），「210% as long」（約 2.1 倍）與「多 210%」（約 3.1 倍）不是同一件事，由 84.6 ÷ 27.2 ≈ 3.11 看，正確的是「多 211%」。這是正文內部的措辭不一致。
- 結論 §9 寫「45 screen-reader and 36 non-screen-reader users」（L1453–1454），是把兩個研究的 9 + 36 加總；摘要分開寫，兩者相符。
- 摘要說線上視覺化「commonly indiscoverable」：正文的依據是 Study 1 的 27 頁裡 33% 偵測不到，是 9 人、作者從 Google 搜尋挑出的網頁，不是隨機的網路樣本。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單（23#5）暫定：「螢幕閱讀器使用者讀線上圖表正確率低 61.48%、時間多 210.96%」。

- 數字本身原文有，但要改寫成：**正確率 34% 對 87%（相對低 61%，絕對差約 53 個百分點）；互動時間平均 84.6 秒對 27.2 秒（多 211%，約 3.1 倍）**。只寫「低 61.48%」會被讀成百分點。
- 範圍要限定：這是 36 對 36 人、線上無人監督、作者依 WCAG 2.0 自己實作的 ChartJS／D3／Google Charts 圖，題目是四選一。差距在函式庫間差很多：有預設資料表的 Google Charts 螢幕閱讀器組 73%，D3 17%、ChartJS 11%——「讀不到」主要來自圖沒有提供可讀的資料，**有資料表時差距縮到 73% vs 86%，代價是時間更長**。這一點對「替代文字／資料表」的寫作建議比總數字更有用。
- 我自己的觀察（不是作者說的）：螢幕閱讀器組在難度與複雜度各層都是 31–37%，三個實質選項中猜中的機率約 33%（另有一個「無法擷取」選項，選它算錯），ChartJS 與 D3 的 11%、17% 甚至低於這個水準，表示很多人直接選了「無法擷取」。原文沒有報告各選項的分布，這個推測無法核對。

## 讀取紀錄

- `.seq.txt` L1–700（首頁、摘要、§1 導論、§2 相關研究、§3 Study 1 方法、Table 1、§4 Study 1 結果）；L701–1350（§5 Study 2 方法、Table 2、§6 結果、Table 3–5、§7 討論前半）；L1351–1965（§7 討論後半與設計建議、§8 限制、§9 結論、致謝、參考文獻、Appendix A Table 6、Appendix B Table 7）。三段首尾相接，涵蓋全文。參考文獻只掃過。
- 文字檔第 3–4 頁（§4.1.2–4.1.3）在不帶 `-layout` 的轉檔裡仍有段落跨欄交錯（L439–499），照節號重組後讀過。
- 對過 PDF 版面的表：Table 2（p.8）、Table 3（p.10）、Table 4 與 Table 5（p.11），數字與上列一致；Figure 4 的長條圖數值（11、87、17、89、73、86；32、87、33、87、35、88；37、87、31、91、32、84）與 Table 4 一致。Table 1、6、7 只從文字檔讀，沒對 PDF。
- Appendix C 在正文 §5.3 被提到（「see Appendix C, Table 7」，L871），但 PDF 裡 Table 7 標在 Appendix B，沒有 Appendix C——原文的交叉引用錯誤。
