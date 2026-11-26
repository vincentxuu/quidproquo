# Navarrete 等 2025 抽取紀錄（精讀批次 V06）

## 檔頭

- 書目：Evelyn Navarrete、Andreas Nehring、Sascha Schanze、Ralph Ewerth、Anett Hoppe（2025）. A Closer Look into Recent Video-based Learning Research: A Comprehensive Review of Video Characteristics, Tools, Technologies, and Learning Effectiveness. *International Journal of Artificial Intelligence in Education*, 35, 1631–1694. DOI 10.1007/s40593-025-00481-x。作者全名對過首頁（原文行 16–18）與文末作者資訊（行 753 起）。Accepted 2025-05-04，Published online 2025-05-21（行 30）。
- 原文檔：`.research/raw/learning-content/pub5/navarrete2025-springer.jina.md`，765 行、223,939 位元組（64 頁）。
- 取得網址：https://link.springer.com/content/pdf/10.1007/s40593-025-00481-x.pdf（經 Jina reader 轉 markdown）。合法性確認：首頁「© The Author(s) 2025」（行 20）；文末授權 CC BY 4.0、「Open Access funding enabled and organized by Projekt DEAL」（行 543、549）；Unpaywall（email=unpaywall@example.org，2026-10-14 查）列 oa_status = hybrid、唯一位置是出版者 PDF、license cc-by。屬出版者合法公開版本。
- 交叉核對用的第二份出版者版本：Springer 文章 HTML 頁 https://link.springer.com/article/10.1007/s40593-025-00481-x 與表 5 頁 …/tables/5（firecrawl 抓，只用來對數字與表格，不另存）。curl 直接抓 PDF 拿到的是 HTML 擋頁，Wayback 也沒有 PDF 快照，所以表格是對出版者 HTML 表格，不是對 PDF 版面。
- 版本：刊出版。
- 讀取日期：2026-10-14
- 供：系列第 6 篇（版面，`src/content/posts/learning/2026-10-13-video-beside-text-layout.md`，以下簡稱 L）行 173、177、231、249、259；英文版同行號內容相同。

## 研究設計

- 類型：系統性文獻回顧（作者稱 "comprehensive review"），**敘事式整理，沒有統合分析**。方法是 "inspired by the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA) guidelines"（行 93）；摘要則寫 "using PRISMA guidelines"（行 24）。
- 母群：SpringerLink、ACM DL、DBLP 三個電腦科學資料庫（行 93）。ACM DL 只比對標題、限時間範圍；SpringerLink 同樣再加 CS 篩選；DBLP 本來就只比對標題（行 93）。查詢詞是 "Video" 搭配 16 組延伸詞（表 2，行 95），包括 MOOC、Lecture 兩個新詞。
- 納入條件（行 93、127）：(a) 學術情境的影片（排除烹飪等日常教學影片）；(b) 把影片當學習資源（排除教師教育的課堂錄影反思）；(c) 檢視或運用影片學習材料的具體特性（排除「在課堂導入影片是否可行」這類研究）。
- 篩選：起始 390 篇，去重與排除後 257 篇，2016–2021（圖 1 說明，行 133；HTML 版同句）。圖 1 本身是圖片，各階段排除數本機檔沒有，只有起訖兩個數。
- 編碼欄位（行 127）：標題、作者、年份、資料庫、命中的查詢詞、方法類型、研究目的、影片特性，以及「適用時」主要發現、影片學科、樣本數、製作形式、依變項、任務與技術。
- 分類方法：四種方法類型；一篇符合多類時歸入「最能反映其主要焦點與貢獻」的那一類（行 131）。
- 延伸自作者 2021 年只回顧 2020–2021 的前作（行 40）。刻意排除生成式 AI 之後的研究（行 46）。
- 作者分工（行 542）：第一作者 EN 找文獻、審讀、做分析；沒有提到第二位編碼者或評分者一致性。（文中沒有寫編碼信度，這是我讀完全文後確認「沒有」，不是沒找到。）

## 結果（逐項）

### 母群組成

| # | 結果 | 位置 | 原文 |
|---|---|---|---|
| 1 | 257 篇，2016–2021 | 摘要行 24；圖 1 說明行 133；結論行 473 | "we analyze 257 articles (using PRISMA guidelines) on video-based learning from a technological perspective for the period from 2016 to 2021" |
| 2 | 工具 57%、對照實驗 25%（依主要焦點歸類） | Literature Review 開頭，行 131；HTML 版同句 | "Of the reviewed articles, 57% presented tools and 25% described controlled experiments (see Fig. 2). If a study fitted multiple methodological approaches, we categorized it under the one that best reflected its primary focus and contributions." |
| 3 | 其餘是資料分析與設計準則，屬「小部分」；兩者確切百分比只在圖 2（圖片），本機文字沒有 | 行 475 | "Most of the papers suggested tools for supporting VBL, a moderate part were controlled experiments, and a small part was data analysis and design guidelines articles." |
| 4 | 最常被研究的特性：文字特性，其次視覺、學習者活動、互動功能 | 摘要行 24；行 140；行 477–479 | "Textual features were by far the most utilized features (Fig. 4)." |
| 5 | 前五類工具（資訊擷取、互動、推薦、分類器、導覽與切段）占工具類論文 80% | 行 153 | "The first five tool types amount to 80% of the reviewed papers (see Fig. 5)." 注意原句寫 "of the reviewed papers"，從上下文看指的是工具類論文，原文沒有說清楚 |

### 導覽工具（L 173 引的工具分類）

| # | 結果 | 位置 | 原文 |
|---|---|---|---|
| 6 | 導覽工具很多是目錄式，另有關鍵字導覽與「視覺元素」導覽；多半搭配切段技術 | 行 244 | "Many articles proposed navigation in the style of a table of contents, but also navigation using keywords and visual elements has been presented." |
| 7 | 目錄式導覽的用途描述：點了跳到對應段落、找到感興趣的子主題（這是作者對工具功能的描述，不是實驗結果） | 行 246 | "Such tools consist of a table of contents which the user can click on and jump to the corresponding part in the video. They allow users to find segments that cover a certain sub-topic of interest." |
| 8 | 視覺元素導覽：呈現主要投影片、圖、表、圖表，點了跳到對應段落 | 行 256 | "This kind of approach enabled exploration by presenting visual parts of the video, for example, main slides, figures, tables, charts, etc." |
| 9 | 表 4 次數標記：目錄式 "More frequent"（列 10 篇）；關鍵字 "Less frequent"（6 篇）；視覺元素 "Less frequent"（5 篇） | 表 4，行 505 | 篇數是我數表內引用數，表本身只標 More/Less frequent |

### 對照實驗的組成（L 249 引）

| # | 結果 | 位置 | 原文 |
|---|---|---|---|
| 10 | 約八成實驗用 STEM 影片 | 行 298；HTML 版同句 | "Most of the experiments were performed using learning videos in STEM disciplines (around 80%)" |
| 11 | STEM 細分：物理數學 19%、資工 19%、生物化學醫學 14%、軟體使用與數位媒體 13%、環境科學氣象 11%；非 STEM：語言 6%、史地 6%、心理 4% | 行 304 | 百分比分母是 "controlled experiments"。這些加起來超過 80%，且同一篇可跨類（例如 van der Meij 2019 同時列在第 4、5 類），作者沒有說明 |
| 12 | 69% 的實驗有報告製作形式；投影片式最多，39%；有出鏡講者 36%；手寫 16%、talking head 16%、螢幕錄影 14%、VR/360 14%、動畫 14% | 行 306–312；HTML 版同句 | "Most controlled experiments reported the production style of the videos (69%). We found that most of them used slide-based videos (39% of the experiments)" |
| 13 | 樣本數：最少 4 人、最多 398 人、平均 94 人；另有一篇 MOOC 實驗超過 12,000 人 | 行 314 | "the average was 94 participants" |
| 14 | 實驗最常研究的特性：互動功能 39%、製作形式 25%、視覺 10%、講者行為 10% | 行 318 | "(1) interactive features (e.g., quizzes) (39% of controlled experiments)" |
| 15 | 實驗的互動功能包括「導覽元素（目錄導覽、可點興趣點的時間軸）」，引 3 篇 | 行 328 | "navigational elements (e.g., table of content navigation, timelines with clickable points of interest) (Kuhail & Aqel, 2020; da Graça Campos Pimentel et al., 2019; Cojean & Jamet, 2017)" |
| 16 | 86% 的實驗量某種學習成果；認知負荷 20%、滿意度 19% 等；只有 38% 明確寫測的是回憶還是遷移 | 行 352 | "only 38% of the articles on controlled experiments reported explicitly if the type of test was recall or transfer" |

### 效果整理（L 173 引的那句）

| # | 結果 | 位置 | 原文 |
|---|---|---|---|
| 17 | 目錄導覽與可點時間軸「大致上」對學習成果有正面效果，但不一定顯著，或和其他功能綁在一起測 | "Impact of Video Characteristics" 節，Interactive Features → Other，行 410；HTML 版同句 | "Regarding navigational features, experiments using table content navigation (Kuhail & Aqel, 2020; Cojean & Jamet, 2017) and timelines with clickable points (da Graça Campos Pimentel et al., 2019; Cojean & Jamet, 2017) generally found a positive effect on the learning outcome. However, this was not always significant (da Graça Campos Pimentel et al., 2019), or was examined combined with other features (e.g, table contents together with timelines with markers (Cojean & Jamet, 2017))." |
| 18 | 這個結論只建立在 **3 篇**實驗上：Kuhail & Aqel 2020（題目是互動影片對**六年級學生英文閱讀與字彙**的影響，IJICTE 16）；Cojean & Jamet 2017（Computers in Human Behavior 74，題目是「微觀與巨觀鷹架的合併效果」促進影片中的資訊搜尋）；da Graça Campos Pimentel 等 2019（SAC，可點興趣點對互動行為與感受的效果）。不顯著的是 Pimentel；綁在一起測的是 Cojean & Jamet | 行 410；參考文獻行 593、625 與 Kuhail、Cojean 條目 | 三篇題名照參考文獻；三篇本身我沒讀 |
| 19 | 同一段接著寫：有研究建議互動功能要搭配其他教學手法才能改善學習成果 | 行 410 | "It was suggested that videos with interactive features need to be used with other pedagogical techniques to improve the learning outcome (Granjo & Rasteiro, 2018)." |
| 20 | 表 5 把「導覽元素」評為 Medium | 表 5，行 513；對過出版者 HTML 表 5，一致 | "Navigational elements \| Medium \| Improved learning outcome, but results were not always significant or mixed with effects of other features" |
| 21 | 表 5 的等級怎麼來：依實驗結果、支持研究數，**加上作者對該特性「潛力」的評估**；作者明說等級只是建議 | 行 491、505 | "These levels were determined based on reported experimental results, the number of studies supporting the findings, and our assessment of the potential of the feature." ／ "the assigned levels serve only as suggestions, as the effectiveness of features is highly context-dependent." |

### 其他可能被系列引用的效果整理（同節，供對照）

| # | 結果 | 位置 | 原文／說明 |
|---|---|---|---|
| 22 | 影片內嵌測驗：多數研究有正面效果；表 5 評 High | 行 400、513 | "Most of the studies experimenting with quizzes evidenced a positive effect on learning outcome" |
| 23 | 影片內筆記標註：學習成果提升；表 5 評 High（同樣只 3 篇） | 行 410、513 | "Studies that experimented with in-video annotations found an increase in the learning outcome (Leisner et al., 2020; Taskin et al., 2019; Kuhail & Aqel, 2020)" |
| 24 | 自動暫停：相對學習者自控暫停沒有顯著好處，有研究增加認知負荷；表 5 評 Low | 行 438、519 | "No significant positive effects of automatic pauses in videos were found compared to non-automatic pauses" |
| 25 | 對話式對獨白式：學習成效無顯著差異；表 5 評 Low | 行 424、513 | "The experiments did not observe a significant effect of dialogue-style over monologue-style videos on learning gain" |
| 26 | 出鏡講者：受偏好但沒有顯著好處 | 行 422 | "although the presence of an instructor was preferred, it did not bring notable advantages" |
| 27 | 手勢：對學習成果無顯著影響 | 行 390 | "Experiments showed that gestures do not have a significant impact on the learning outcome" |
| 28 | 片長：學習者偏好短片（兩篇研究偏好 5–7 分鐘），但脈絡不同時偏好不同（有研究偏好接近 45 分鐘） | 行 454 | "Videos within five to seven minutes were preferred in two studies" |
| 29 | 觀看完成度：YouTube 與 edX 上通常只看 30%–50%；大學課程內多數看完 | 行 452 | "learners usually watched 30% to 50% of the video" |
| 30 | 結論：對照實驗結果常互相矛盾；不是每篇都把影片特性報告到可比較的程度 | 行 525 | "controlled experiments often yielded contradictory results about the impact of video characteristics on learning effectiveness" |

## 作者自己列的限制（行 539，結論前的 Limitations 段；HTML 版同段）

1. 只從電腦科學資料庫找，沒納入科學教育等其他學門的影片學習研究。
2. 只查三個資料庫（作者認為 DBLP 涵蓋大多數 CS 期刊會議）。
3. 只比對標題中的查詢詞，標題沒反映影片學習的相關研究會漏掉。
4. 只收用到並實驗影片特性的文章，教師反思等用途不在內。
5. 各實驗設定與測驗條件差異太大，難以精確比較效果，所以沒做統合分析："This is why we could not provide a meta-analysis."

另在結論（行 525）：多數實驗只量短期知識增加；很多研究沒把影片與受試者報告完整。

## 與摘要說法不一致的地方

1. 摘要說 "using PRISMA guidelines"（行 24），方法節說 "inspired by" PRISMA（行 93）；圖 1 只給起訖 390 → 257，沒有 PRISMA 流程該有的各階段數字（至少本機文字檔沒有；圖片內容未見）。
2. 摘要說 "interactive features are frequently scrutinized in controlled experiments"，正文數字是 39%（行 318），一致。
3. 摘要說 "we contrast research findings on how video characteristics affect learning effectiveness"；正文的對比是敘事整理加主觀分級（表 5 含「潛力」評估），沒有效果量，也沒有計票規則。摘要沒有交代這一點，不算矛盾，但讀者從摘要看不出證據強度。
4. 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單 L-6 列的引用：257 篇、57%、25%、PRISMA、約八成用 STEM 影片。

- 257、57%、25%、約八成 STEM：原文都撐得住（行 24、131、298），HTML 版同句。
- 57%／25% 是「依主要焦點歸類」後的比例，一篇只歸一類，原文有交代（行 131）。文章沒提，不影響意思。
- PRISMA：原文方法節是「受 PRISMA 啟發」，摘要寫 using。文章寫「依 PRISMA 流程」偏強，見下節第 4 條。

## 已發佈文章引用核對（L＝`2026-10-13-video-beside-text-layout.md`；英文版同行號另註）

| 行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 173 | 「整理了 2016 到 2021 年間 257 篇影片學習的研究」 | 行 24、133 | 一致 |
| 173 | 「其中 57% 是做工具，25% 是對照實驗」 | 行 131 | 一致 |
| 173 | 「導覽工具裡很多是可點的目錄，另外也有用關鍵字與**畫面縮圖**導覽的」 | 行 244、256：第三類是 "visual elements"，例子是 "main slides, figures, tables, charts" | **用詞不準**。原文不是「縮圖」，是挑出投影片、圖、表等畫面元素讓人點。建議改「用投影片、圖表等畫面元素導覽」。英文版寫 "by visual elements"，正確 |
| 173 | 「用目錄導覽或可點時間軸的實驗『大致上』發現對學習成果有正面效果，但不一定顯著，或者是和其他功能綁在一起測的」 | 行 410 | 一致，"generally" 譯「大致上」準確。**但文章沒交代這句只根據 3 篇實驗**，其中一篇是六年級英文閱讀字彙（Kuhail & Aqel 2020）、一篇不顯著（Pimentel 2019）、一篇是合併測（Cojean & Jamet 2017）。標題句「證據零散」方向對，建議補「只有三篇實驗」讓讀者知道多薄。表 5 評 Medium，且作者說分級含主觀「潛力」評估，若要引分級要一併交代 |
| 173 | 「作者說因為各研究的設定差異太大，沒辦法做統合分析」 | 行 539 | 一致 |
| 173 | 「另一個限制是只搜了電腦科學領域的三個資料庫」 | 行 539 | 一致。原文另一條同等重要的限制「只比對標題」文章沒提，屬省略不是錯 |
| 173 | 括號「我讀了摘要、方法、工具分類、對照實驗與限制等章節，沒有讀完全文」 | — | 本次已讀完全文。這句揭露已過時，可改寫（是否改由寫稿方決定） |
| 177 | 「時間連結的用處是讓讀者找得到位置，這一點有 Navarrete 的整理支持」 | 行 246 只是作者對目錄導覽工具功能的**描述**（"They allow users to find segments that cover a certain sub-topic of interest"）；效果整理（行 410）量的是學習成果，不是找位置的速度或成功率。Cojean & Jamet 2017 題目講資訊搜尋，但 Navarrete 沒有轉述它的搜尋結果 | **支持程度偏弱**。Navarrete 撐得住的是「導覽工具被設計來讓人跳到對應段落」，撐不住「已有證據顯示它讓讀者找得到位置」。建議改成「這是導覽工具的設計用途，Navarrete 的整理有描述，但它整理的實驗量的是學習成果，不是找位置」 |
| 177 | 「要學得比較好，還是得靠讀者動手作答」 | Navarrete 行 400（內嵌測驗多數正面，表 5 High）、行 410（Granjo & Rasteiro：互動功能要搭配其他教學手法） | 文章說依據是上一篇的暫停寫解釋實驗，不是 Navarrete，歸屬正確。附帶：Navarrete 的測驗整理方向與此一致，但同屬敘事整理、沒有效果量 |
| 231 | 「Navarrete 等沒有讀完」 | — | 本次已讀完全文，這句已過時 |
| 249 | 書目「Navarrete、Nehring、Schanze、Ewerth、Hoppe（2025），International Journal of Artificial Intelligence in Education」 | 行 10、16–18 | 一致（卷期 35:1631–1694 文章沒寫，不算錯） |
| 249 | 「依 PRISMA 流程」 | 行 93 "inspired by … PRISMA"；摘要行 24 "using PRISMA guidelines" | **偏強**。建議改「參照 PRISMA」 |
| 249 | 「搜尋 SpringerLink、ACM Digital Library 與 DBLP」 | 行 93 | 一致 |
| 249 | 「對照實驗約八成用 STEM 領域的影片」 | 行 298 | 一致 |
| 249 | 「最常見的製作形式是投影片式」 | 行 306 | 一致。精確數字是 39% 的實驗，且只有 69% 的實驗有報告製作形式 |
| 259 | 參考資料註「讀了摘要、方法、導覽與互動工具、對照實驗、效果整理與限制」 | — | 本次已讀完全文，註記可更新 |

英文版（`…-layout-en.md`）173、177、249、259 行意思同上；173 的導覽分類寫 "by visual elements"，比中文版準確；177、249（"Followed PRISMA"）有相同問題。

## 讀取紀錄

依序讀過（Read 工具，行號首尾相接）：

1. 行 1–89：檔頭、摘要、引言、相關研究、表 1
2. 行 90–179：方法、表 2、表 3（分類法，三頁）、納入條件、圖 1–4 說明、Literature Review 開頭（57%／25%）、工具總覽、資訊擷取
3. 行 180–259：資訊擷取（續）、互動工具、推薦系統、分類器、導覽與切段工具
4. 行 260–339：分析工具、摘要工具、其他、對照實驗（趨勢、學科、製作形式、樣本數、影片特性）
5. 行 340–409：對照實驗（續）、依變項、資料分析研究、設計準則、效果整理開頭（講者行為、互動功能前半）
6. 行 410–479：效果整理（導覽、視覺聽覺、製作形式、播放速度、高低成就、完成度與片長、熱門度）、結論開頭
7. 行 480–519：結論（續）、表 4、表 5
8. 行 520–558：結論（續）、對 AIED 的意涵、限制、致謝、作者分工、資金、授權
9. 行 559–765：參考文獻（87,879 字元）只掃過，另用 python 找 Kuhail & Aqel、Cojean & Jamet、Pimentel 三條；行 753 起作者資訊

表格核對：本機檔是 Jina 從出版者 PDF 轉的文字，表 3–5 被攤成一段文字。PDF 直接下載被擋（curl 拿到 HTML 擋頁、Wayback 無快照），改用出版者 HTML 版核對：表 5 導覽元素、測驗、筆記標註、自動暫停四列對過 …/tables/5，一致；正文 57%／25%、around 80%、69%／39%、圖 1 的 390／257、限制段、38%、樣本數段對過 HTML 全文，一致。表 3、表 4 沒有對版面（文章沒引）。
