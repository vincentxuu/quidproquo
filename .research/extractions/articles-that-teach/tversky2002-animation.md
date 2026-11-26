# 抽取紀錄：Tversky、Morrison、Bétrancourt 2002，Animation: can it facilitate?

- **書目**：Barbara Tversky、Julie Bauer Morrison、Mireille Bétrancourt (2002). Animation: can it facilitate? *International Journal of Human-Computer Studies*, 57(4), 247–262. DOI 10.1006/ijhc.2002.1017（PDF 首頁印的是「doi:10.1006/ijhc.1017」，少了 2002，是原刊排版；以 10.1006/ijhc.2002.1017 為準；2026-10-14 查 Crossref，卷 57、期 4、頁 247–262、三位作者皆一致）。首頁作者列：「Barbara Tversky and Julie Bauer Morrison」（Stanford 心理系；Morrison 腳註「is now at Bryant College」）、「Mireille Betrancourt」（I.N.R.I.A. Rhône-Alpes；PDF 文字層沒有重音，本紀錄依通行拼法寫 Bétrancourt）。收稿 2001-03-01，修訂稿接受 2002-04-04。
- **原文檔**：`.work/learning-visualization-research/src/tversky2002.txt`（`pdftotext` 不帶 `-layout`，821 行、55,289 位元組）；PDF `tversky2002.pdf`（16 頁，186,229 位元組）。
- **取得網址（合法版本）**：作者 Tversky 在 Teachers College 的教師頁 https://www.tc.columbia.edu/faculty/bt2158/faculty-profile/files/_Morrison_Betrancourt_AnimationCanitfacilitate.pdf 。清單檔頭記載 2026-10-14 下載後與本機檔 `cmp` 位元組相同；本批次另重抓一次比對，結果見檔尾。舊紀錄寫的 Stanford 課程頁（hci.stanford.edu/courses/cs448b）是課程網站，不用。
- **版本**：出版者排版（Elsevier，「# 2002 Published by Elsevier Science Ltd.」），刊出版。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 2 篇（圖表，`src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles.md`）。

## 研究設計

- **類型**：選擇性文獻回顧（理論性論文），不是統合分析，沒有效果量、沒有檢索策略、沒有納入標準。作者自稱「we will selectively review research on animation (see Betrancourt & Tversky, 2000)」（L189–190）。「Selectively」的理由：很多被叫做動畫的研究同時含有互動等其他因素；要評估動畫本身，必須和「不隨時間變化的圖」比（L190–194）。
- **範圍**：用動畫教複雜系統，「mechanical, biological, physical, operational, computational」（L195–196）。介面中的動畫只在文末簡短談（L197–198）。
- **論證結構**：第 1 節講圖的功能與「對應原則」（Congruence Principle，L142–144）；第 2 節逐一檢查動畫研究，分三類：內容不對等（2.1）、程序不對等（2.2）、明確失敗（2.3）；第 3 節用「可理解原則」（Apprehension Principle，L446–453）解釋為何失敗；第 4 節提出含意與設計建議。
- 沒有受試者、沒有自己的實驗數據；被檢查的研究也沒有報告效果量數字。

## 結果（逐項）

| # | 主張 | 所在節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 摘要結論：靜態圖研究顯示只有設計得當的圖有益；動畫勝靜態的研究細看都是內容或程序不對等 | 摘要 | L17–26 | 「In cases where animated graphics seem superior to static ones, scrutiny reveals lack of equivalence between animated and static graphics in content or procedures; the animated graphics convey more information or involve interactivity.」 |
| 2 | 對應原則（定義） | 1.3 | L142–144 | 「the structure and content of the external representation should correspond to the desired structure and content of the internal representation.」 |
| 3 | 早期圖文研究結果不一 | 1.4 | L157–160 | 「the early research comparing learning with graphics to learning with text alone gave mixed results」 |
| 4 | 要評估動畫本身，必須和資訊對等的靜態圖比 | 2.1 | L230–232 | 「animated graphics must be compared to informationally equivalent static graphics.」 |
| 5 | Baek & Layne 1988：動畫組勝，但靜態圖其實是一張表，不對等 | 2.1 | L240–254 | 「Essentially, the static graphic was a table listing two sets of distances, times and average speeds.」 |
| 6 | **心臟血流例子**（Large、Beheshti、Breuleux、Renaud 1996）：動畫有血流路徑，靜態圖沒有 | 2.1 | L256–259 | 「In a study evaluating graphics for teaching the circulatory system, the animated diagrams of the heart included blood pathways, but the static diagram did not (Large, Beheshti, Breuleux & Renaud, 1996).」 |
| 7 | Rieber 1990、1991a, b 的牛頓定律：靜態圖少了理解定律的基本資訊 | 2.1 | L259–268 | 「the lack of equivalence of the static and animated graphics call this conclusion into question.」 |
| 8 | 動畫多呈現「微步驟」（細部動作），靜態圖只畫粗步驟 | 2.1 | L269–281 | 「Any benefits, then, may be due to the added information alone rather than the format of the graphics」 |
| 9 | Park & Gittelman 1992（電路）、Thompson & Riding 1990（畢氏定理，連續動畫勝靜態與離散動畫，但原作者自己說資訊不對等） | 2.1 | L282–309 | 「the authors explicitly state that the information on the paper graphic was equivalent to the discrete animation, but not equivalent to the continuous animation.」 |
| 10 | 程序不對等：動畫組有互動（Schnotz & Grzondziel 1999）或預測（Hegarty 等 1999） | 2.2 | L315–323 | 「Because prediction alone is known to facilitate learning, facilitation cannot be attributed to animation.」 |
| 11 | Hegarty、Narayanan、Freitas 2002：沖水馬桶水箱，動畫本身無益 | 2.2 | L324–326 | 「Later studies by the same group showed no benefits of animation per se in understanding the workings of a flushing cistern」 |
| 12 | Kieras 1992：測驗時可以看圖，量到的是讀圖而非理解 | 2.2 | L327–337 | 「the animated graphic may be facilitating execution of the task rather than understanding of the concepts.」 |
| 13 | Nathan、Kintsch、Young 1992：各組介面不同，不能下結論 | 2.2 | L338–347 | 「the lack of comparability among conditions does not allow any conclusions」 |
| 14 | 明確失敗（無差異）：Morrison & Tversky 2001（圖只對低空間能力者有用，動畫沒有比靜態好）、Rieber 系列、ChanLin 1998、Pane 等 1996、**Byrne、Catrambone、Stasko 1999（演算法 DFS 與二項堆積：看動畫等同於拿靜態圖做預測）**、Payne 等 1992、Dyck 1995、Harrison 1995 | 2.3 | L353–411 | 「The authors were discouraged to find that the benefits of viewing animated graphics were equivalent to making predictions about the outcomes of the algorithms when provided with static graphics.」 |
| 15 | Palmiter 等：動畫組訓練快、測驗慢；一週後文字組進步、動畫組退步 | 2.3 | L412–419 | 「after a week, performance of students who had studied the text improved, but performance for those who had studied the animation declined.」 |
| 16 | 小結：動畫的成功多半來自額外資訊或額外程序 | 2.3 | L420–422 | 「most, if not all, of the successes of animation seem to be due to advantages in extra information conveyed or additional procedures, rather than the animation of the information per se.」 |
| 17 | 動畫常較費時、並非普遍受偏好、新手看天氣動畫只注意顯眼處（Lowe 1999） | 2.3 | L426–437 | 「animations may be distracting, or even harmful, to conveying important ideas.」 |
| 18 | 可理解原則（定義） | 3 | L446–453 | 「the structure and content of the external representation should be readily and accurately perceived and comprehended.」 |
| 19 | 動畫可能太快太複雜而看不準 | 3.1 / 摘要 | L29、L456–468 | 摘要：「Animations are often too complex or too fast to be accurately perceived.」 |
| 20 | 連續事件常被理解為離散步驟 | 3.2 / 摘要 | L30、L471–476 | 摘要：「Moreover, many continuous events are conceived of as sequences of discrete steps.」 |
| 21 | **多張靜態圖的額外好處**（文章引的英文句） | 3.2 | L482–486 | 「In addition to corresponding to the way people conceive of animations, multiple diagrams have an additional advantage: they easily allow comparison and reinspection of the details of the actions. By contrast, animations are fleeting, they disappear」 |
| 22 | 互動可能克服動畫缺點，但「proper experiments have yet to be done」 | 3.3 | L489–501 | 「Of course, the proper experiments have yet to be done」 |
| 23 | 適用範圍限定 | 3.4 | L505–507 | 「The conclusions are restricted to those situations.」 |
| 24 | 動畫最有希望的用途：即時的時間空間變化與方位轉換 | 3.4 / 摘要 | L517–518；L32–33 | 「the most promising uses of animation seem to be to convey real-time changes and reorientations in time and space.」 |
| 25 | 兩原則不保證動畫勝過對等的靜態圖 | 4 | L537–539 | 「though these principles do not guarantee that animated graphics will be superior to equivalent static ones.」 |
| 26 | 即使是微步驟，巧妙的靜態示意圖可能一樣有效；箭頭可表示時間順序與方向 | 4 | L575–577 | 「even for these cases, clever schematization of static diagrams may be just as effective as animation.」 |

## 作者自己列的限制

- 結論只限於教複雜系統的動畫（3.4，L505–507）。
- 互動與動畫各自的貢獻「the proper experiments have yet to be done」（L493–494）。
- 動畫對「微步驟、運動方式」是否比靜態圖有效「is unknown」（L535–536）。
- 選擇性回顧，不是系統性檢索（作者自承「Selectively」，L189–190）。

## 與摘要說法不一致的地方

逐項對過，沒有。摘要的「scrutiny reveals lack of equivalence」對應 2.1–2.2；「too complex or too fast」「conceived of as sequences of discrete steps」對應 3.1–3.2；「real time reorientations」對應 3.4。唯一語氣差異：摘要說「Judicious use of interactivity may overcome both these disadvantages」，正文 3.3 補了一句實驗還沒做，摘要沒提這個保留。

## 與清單「要撐的結論」不合的地方

清單（G 清單 D-11）列的引用對象：「心臟血流的例子與英文原句；動畫一節的整體判斷」。

- 心臟血流例子：原文 L256–259 撐得住，但它是 Large 等 1996 的研究，文章沒有標出是哪一個研究，只說「他們舉的例子」，這樣寫不算錯。
- 英文原句：見下節逐字核對。
- 整體判斷：撐得住。

## 已發佈文章引用核對（`2026-10-13-diagrams-in-teaching-articles.md`，2026-10-14 實查行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| L181 | 「逐一檢查了『動畫贏』的研究，發現兩邊常常不對等：動畫版本多了靜態版本沒有的資訊，或者動畫組同時多了互動或預測」 | 摘要 L23–26；2.1–2.2；4 節 L524–528「more information was presented … animation was confounded with other factors known to facilitate learning, interactivity or prediction or even the presence of graphics」 | 一致。「逐一檢查」略強：原文是選擇性回顧，不是全面檢查；但對被選入的研究確實逐一檢查。建議可保留或改「選了一批『動畫贏』的研究逐一檢查」 |
| L181 | 「他們舉的例子包括心臟的動畫有畫血流路徑，靜態圖卻沒畫」 | L256–259 | 一致（原研究是 Large 等 1996） |
| L185 | 「動畫太快、太複雜時看不清楚；而且很多連續的過程，人本來就是當成一連串離散的步驟來理解的」 | 摘要 L29–30；3.1、3.2 | 一致 |
| L185–187 | 引句「multiple diagrams have an additional advantage: they easily allow comparison and reinspection of the details of the actions」 | L482–483 逐字相同 | 一致。注意原文這句前面有「In addition to corresponding to the way people conceive of animations」，文章的「作者接著寫到多張靜態圖的好處」承接得對 |
| L420 | 「選擇性的文獻回顧，範圍是用動畫教複雜系統（機械、生物、物理、運算）」 | L189–196 原文列五類：mechanical, biological, physical, operational, computational | 大致一致，漏了「operational」（操作性）。3.4 節的限制只列三類（mechanical, biological, computational，L505–506），兩處不同，文章取的是 1.6 節 |
| L420 | 「作者說明結論只適用這個範圍；動畫用來呈現即時的方位變化，可能是合適的用途」 | L505–507；L517–518「real-time changes and reorientations in time and space」 | 一致；原文是「即時的變化與時空中的重新定向」，文章縮成「即時的方位變化」，略窄但不扭曲 |
| L420 | 「對應原則（圖的結構與內容要對應想讓人形成的心智表徵）與可理解原則（圖要能被正確地感知與理解）」 | L142–144、L540–553 | 一致 |
| L420、L453 | 「我讀了第 1.4 到第 4 節」 | 本次已讀全文 | 讀取範圍說法可更新為全文 |
| L453 | 參考連結指向 TC 教師頁 | 合法來源 | 一致（清單「交給使用者決定的事」第 2 條說 Tversky 指向 Stanford 課程網站，**文章現況已是 TC 教師頁**，該條對 Tversky 已過時） |
| L176–181 一節的配置 | 文章把 Tversky 2002 放在 Berney & Bétrancourt 2016 之後並說「更早就」 | 年份正確 | 一致 |

補充（文章沒用、但和第 2 篇主題直接相關）：2.3 節 Byrne、Catrambone、Stasko 1999 是演算法動畫（DFS、二項堆積）的研究，結果是看動畫的好處等同於拿靜態圖做預測（L392–396）。文章 L378 談演算法逐步執行與「預測」時沒有引它；此處只是轉述，原研究未讀。

## 讀取紀錄

- 依序讀 L1–300、L300–599、L600–821（Read 工具，首尾相接），涵蓋全文含參考文獻。
- 來源比對：2026-10-14 從 TC 教師頁重抓 PDF，`cmp` 與本機 `tversky2002.pdf` 位元組相同。
- 本文沒有表格；沒有需要對 PDF 版面的表。txt 是不帶 `-layout` 的單欄轉檔，段落順序正常。
