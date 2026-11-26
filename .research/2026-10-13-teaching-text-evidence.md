# Research: 教學文章的文字怎麼寫才學得會（系列「教學文章怎麼寫」第 1 篇）

日期：2026-10-13。原文存檔與逐篇筆記在 `.work/teaching-text-research/`（`src/`、`notes.md`、`sources.md`、`src/exa-excerpts.md`、`src/eric_abstracts.txt`）。這份 note 是對齊 deep-research 與 research-selection 流程後的正式版本；`.work/teaching-text-research/report.md` 是對齊前的舊筆記。

## 子問題

1. 解說文字本身：例題、現成解釋、自我解釋、具體到抽象、對比案例、駁斥迷思，各有多大效果、在什麼條件下成立？
2. 結構與提示：學習目標、讀前提問、前導組織、標題、依讀者程度調整鋪陳（expertise reversal、文本連貫性）、分段與篇幅。
3. 文中的問題與練習：插入式問題、自我解釋提示、回饋的內容與時機、「做」對「讀」。
4. 語言與呈現：可讀性公式、術語與定義、對話式語氣、有趣但無關的內容、字體難讀、螢幕閱讀。
5. 非母語讀者與翻譯教材。
6. 實務框架（Diátaxis、逆向設計與對齊、Bloom 動詞表）有多少實證。
7. 本站 `course-guide-contract.md` 的條文哪些有證據、哪些是慣例、缺了什麼。

## 選案（research-selection 三步）

### 步驟一：母群定義與掃描

母群定義：以「作者能在一篇解說性文字裡操作的設計變項」為自變項、以學習成果（記憶、理解、遷移）為依變項的實證研究綜整（統合分析、系統性回顧），1980–2026；缺綜整的變項才退到個別對照實驗。不算：訓練讀者策略的介入（text structure instruction、inference instruction、筆記教學）、純圖像與影片設計（系列第 2–4 篇）、學習者自己安排的學習技術（站上 Learning How to Learn 已寫）。

掃描方法（四種並用）：
- 分類目錄 A：IES 2007 實務指引的 7 項建議（`src/ies2007.pdf`）。
- 分類目錄 B：Cromley 與 Chen 2025 的 Table 2，Mayer 多媒體原則約 45 項，挑出與文字有關的。
- 分類目錄 C：Dunlosky 2013 的十項技術（經站上既有文章）。
- 搜尋聚合：Keenable 以 36 個主題詞各搜一次「<主題> meta-analysis」，每題取前 8 筆（原始輸出 319 行，存 scratchpad，清單濃縮如下）；OpenAlex 的 title.search 掃描只跑完 4 個主題就被 429 限流。

掃到的完整清單（49 項綜整或代表性研究；★＝選入並讀到，☆＝選入但只有摘要，—＝掃到未選）：

| # | 主題 | 掃到的綜整／代表研究 | 狀態 |
|---|---|---|---|
| 1 | 例題 | Barbieri 等 2023（數學） | ★ |
| 2 | 例題旁的現成解釋 | Wittwer 與 Renkl 2010；2008 框架文 | ★／☆ |
| 3 | 自我解釋 | Bisra 等 2018 | ★ |
| 4 | 自我解釋（數位環境） | Tan 等 2025，三層統合 | ☆（補搜） |
| 5 | 自我解釋（數學） | Rittle-Johnson 等 2017；Durkin 2011 | — 與 1、3 重疊 |
| 6 | 錯誤例題 | 2025 系統性回顧（EPR）；Alemdag 的 RER 統合 | — 付費牆，Barbieri 已含錯誤例題調節 |
| 7 | 具體／抽象 | Fyfe 等 2014 回顧；Fyfe 與 Nathan 2019；Kaminski 2008；Trninic 2020 | ☆／★ |
| 8 | 對比案例 | Alfieri 等 2013 | ☆ |
| 9 | 類比 | 只掃到 1989–1998 的個別實驗，沒有統合分析 | — 缺口 |
| 10 | 駁斥文字 | Schroeder 與 Kucera 2022；Danielson 等 2024 | ★／★（補搜） |
| 11 | 學習目標 | Sana 等 2020；1970 年代回顧 | ★ |
| 12 | 讀前提問 | King-Shepard 等 2025 統合；St. Hilaire 等 2023 統合；Pan 與 Carpenter 2023 回顧 | ★（補搜）／—／★ |
| 13 | 插入式問題 | Hamaker 1986 | ★ |
| 14 | 前導組織 | Luiten 等 1980；Stone 1983；2000 年代博士論文更新版 | ☆／—／— |
| 15 | 標題與文字訊號 | Lorch 等 2013；Prinz-Weiß 與 König 2023 | ☆／★（補搜） |
| 16 | 訊號原則（多媒體） | Schneider 2018；Richter 2016；Alpizar 2020 | — 第 2 篇處理 |
| 17 | 文本連貫性 × 先備知識 | McNamara 等 1996；沒有掃到統合分析 | ☆ |
| 18 | expertise reversal | Tetzlaff 等 2025 | ★ |
| 19 | 分段 | Rey 等 2019 | ★ |
| 20 | 課堂測驗 | Yang 等 2021 | ★ |
| 21 | 穿插測驗（影片） | Szpunar 2013 等 | — 第 3 篇已寫 |
| 22 | 回饋內容 | Van der Kleij 2015；Wisniewski 2020 | ☆／★ |
| 23 | 回饋時機 | Kandemir 等 2026 | ☆ |
| 24 | 做對讀 | Koedinger 等 2015 | ★ |
| 25 | 文字生成（要讀者補字、重組） | Schindler 與 Richter 2023 | ☆（補搜） |
| 26 | 精緻化提問 | 只掃到二手整理 | — 站上既有文章已含 Dunlosky |
| 27 | 可讀性 | Crossley 等 2023；沒有掃到「依公式改寫對理解」的統合分析 | ★ |
| 28 | 術語 | Bullock 等 2019；Shulman 等 2020 | ★／— |
| 29 | 對話式語氣 | Ginns 等 2013；捷克學習者五個實驗（2017） | ☆／— 付費牆 |
| 30 | 有趣但無關的內容 | Sundararajan 與 Adesope 2020；Rey 2012；2025 MASEM | ☆／—／— |
| 31 | 字體難讀（disfluency） | Xie 等 2018（無效果）；Weissgerber 等 2021 對該統合的批評 | ☆／☆（補搜） |
| 32 | 螢幕對紙本 | Delgado 等 2018；Clinton 2019；兒童版 2021 | ★（補搜）／—／— |
| 33 | 情感設計 | Brom 2018；Wong 與 Adesope 2021 | — 圖像為主 |
| 34 | 概念圖 | Schroeder 2018；Nesbit 與 Adesope 2006 | — 第 2 篇 |
| 35 | 超文字連結 | 個別實驗與一篇回顧 | — 沒讀，列為缺口 |
| 36 | 冗餘 | 2023 文獻回顧 | — 多媒體 |
| 37 | 多媒體原則總整理 | Cromley 與 Chen 2025；Noetel 2022 | ★（前半）／— |
| 38 | L2 讀說明文 | Vander Beken 與 Brysbaert 2018；2020 續作 | ★／— |
| 39 | L2 插入式問題 | Sun 等 2024（中國 EFL 學習者） | ☆（補搜） |
| 40 | L2 註解（glossing） | Yanagisawa 2020 等四篇統合 | — 依變項是字彙習得 |
| 41 | 自動出題給非母語者 | Steuer 等 2022 | ☆（補搜） |
| 42 | EMI／CLIL | 2025 多層統合兩篇 | — 授課語言，不是文字設計 |
| 43 | 翻譯教材 | 沒有掃到 | 缺口 |
| 44 | Diátaxis | 官網兩頁；沒有任何評估研究 | ★ |
| 45 | 逆向設計／對齊 | CMU 頁；Uluçınar 2021 | ★／☆ |
| 46 | Bloom 動詞表 | Stanny 2016 | ★ |
| 47 | IES 指引 | Pashler 等 2007 | ★ |
| 48 | 讀者策略訓練 | text structure、inference 統合數篇 | — 母群外 |
| 49 | 筆記 | 數篇統合 | — 母群外 |

### 步驟二：覆蓋矩陣

維度的取捨標準：沿這個維度的不同值，寫作者會不會得出不同做法。

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 作者操作的變項 | 例子與解釋 | 1、2、3、4、7、8、10 | 類比（9）沒有綜整 |
| | 結構與提示 | 11、12、14、15、17、18、19 | 連貫性沒有統合分析；超文字連結（35）沒讀 |
| | 問題與回饋 | 12、13、20、22、23、24、25 | — |
| | 語言與呈現 | 27、28、29、30、31、32 | 依可讀性公式改寫的效果 |
| 結果方向 | 正面 | 多數 | — |
| | 無效果或反向 | 2（d=0.16）、12 對未問內容（g=0.01）、23（g=0.03）、31（d=−0.01）、28（定義無效）、11（集中列目標不顯著）、7（抽象優勢消失）、Barbieri 的自我解釋調節 | — |
| 受試者 | 大學生 | 幾乎全部 | — |
| | 中小學 | 1（含小學到高中）、20、10 的少數比較 | 純文字研究很少 |
| | 一般成人／自學者 | 28（一般民眾）、24（MOOC） | 自學者讀長文：沒有 |
| 材料 | 純文字 | 10、11、12、13、15、17、25、27、28、31、38 | — |
| | 多媒體或電腦教材 | 4、19、22、23、29、30、37 | — |
| | 課堂 | 1、20 | — |
| | 長篇（數千字以上） | 無 | 整格空的，補搜後仍然沒有 |
| 年代 | 2000 年以前 | 13、14、17 | — |
| | 2000–2019 | 2、3、8、19、22、27 的前身、29、31、32 | — |
| | 2020 以後 | 1、4、7（Trninic）、10、11、12、18、20、23、25、27、37 | — |
| 語言／地區 | 英語受試者與英文教材 | 多數 | — |
| | 非英語 | 15（德國）、18（德語團隊，樣本混合）、38（比利時）、39（中國）、29 的捷克研究沒讀 | 中文、日文文獻沒掃 |
| 證據型態 | 統合分析 | 1、2、3、4、8、10、12、14、18、19、20、22、23、25、29、30、31、32、37 | — |
| | 單一實驗 | 7、11、15、17、28、38、39、41 | — |
| | 觀察資料 | 24、27 | — |
| | 無實證 | 44、45、46（46 是內容分析） | — |

補搜一輪（針對第一輪矩陣的空格）：新增 King-Shepard 2025、Danielson 2024、Tan 2025（摘要）、Schindler 與 Richter 2023（摘要）、Prinz-Weiß 與 König 2023、Xie 2018 與其批評（摘要）、Delgado 2018、Sun 2024（摘要）、Steuer 2022（摘要）。補不到的：長篇文字、類比的綜整、翻譯教材、可讀性改寫實驗。

### 步驟三：偏誤

1. 偏哪裡：英文文獻；大學生；幾百到一千多字的短教材；數學與自然科學；有作者自存檔或開放取用、拿得到全文的研究；統合分析多於個別實驗。
2. 缺什麼：長篇網頁教學文、自學者、中文與日文文獻、類比、超文字連結、翻譯教材、依可讀性公式改寫的實驗；德語圈教學解釋研究只有 Wittwer 與 Renkl 兩篇與 Prinz-Weiß 一篇。
3. 為什麼還是選這些：統合分析能給效果量與調節變項，適合回答「這條寫作規則有沒有依據」；付費牆後的研究只能讀摘要，不足以轉述作者的限制，所以不當主要依據。
4. 第一輪的選法有問題：最初是從任務書給的名字與自己記得的研究出發，搜尋與選取同時進行；母群掃描是事後補的。補掃之後換掉了一個結論（讀前提問對未問內容：由「不一致」改為統合估計 g = 0.01）並多出一組來源衝突（讀前提問要不要給回饋）。

## 抓取工具與 toolDegradation（2026-10-13 現況）

| 管道 | 結果 |
|---|---|
| Groundlane MCP | toolDegradation：本 session 的 tool list 與 deferred tools 都沒有 groundlane（ToolSearch 無符合項） |
| Groundlane 直接 HTTP | toolDegradation：POST `/mcp` 回 401；環境沒有 GROUNDLANE token，沒有再試 |
| Keenable keyless | 可用（需 `X-Keenable-Title` header）；只提供搜尋，用來找 PDF 鏡像與掃母群 |
| You.com keyless | 部分可用：`profile=free` 只有 `you-search`，沒有 `you-contents`；沒有實際用於本研究 |
| Exa MCP | 可用；search 與 fetch。對 Springer 付費文章只回摘要與參考文獻 |
| Firecrawl MCP | toolDegradation：Insufficient credits |
| Jina MCP | toolDegradation：HTTP 402 Payment Required |
| curl／Europe PMC／ERIC API／Crossref／OpenAlex | curl 與 EPMC、ERIC、Crossref 可用；OpenAlex 與 CORE、Semantic Scholar 被 429 限流；Springer PDF 回 cookie 牆；HAL 被 Anubis 擋；DuckDuckGo 回 captcha |

與 deep-research skill 的出入：skill 的「工具邊界」寫 Groundlane 不可用時回報 blocker、不拿 Exa 等當 fallback；本次依 team-lead 指示與專案 CLAUDE.md 的 fallback 鏈往下走。這一點需要使用者知道。

## 更正與撤稿查核

2026-10-13 以 Crossref REST API 查 31 個 DOI 的 `updated-by` 與 `relation`，全部為空；OpenAlex 掃到的幾筆 `is_retracted` 皆為 false。Crossref 沒有登錄不等於沒有更正：Kaminski 2008 在 Science 有後續的評論往返，我沒有讀。Xie 等 2018 有一篇正式發表的批評（Weissgerber 等 2021，EPR），摘要說重算遷移成績後原結論「(rather) robust」。沒有 DOI 的來源（Hamaker 的鏡像、Diátaxis、CMU 頁、Uluçınar）沒有查。

## 來源清單與讀取完整度盤點

✅＝取得全文並讀了與主張相關的章節；🟡＝摘要、部分章節或轉引；🔴＝未讀。路徑省略 `.work/teaching-text-research/src/` 前綴。

| 來源 | 角色 | 讀到什麼程度 | 阻礙／存檔 |
|---|---|---|---|
| Barbieri 等 2023，EPR | 一手統合 | ✅ 摘要、結果、偏誤、調節、先備、限制 | `barbieri2023.pdf` |
| Bisra 等 2018，EPR | 一手統合 | ✅ 納入標準、Table 1/3/4、偏誤、討論首節 | `bisra2018.pdf` |
| Schroeder 與 Kucera 2022，EPR | 一手統合 | ✅ 方法、結果、調節表、限制 | `schroeder_kucera2022.xml` |
| Danielson 等 2024，Educational Psychologist | 一手統合 | ✅ 摘要、整體結果、偏誤、限制（作者接受稿）；調節表沒細讀 | `danielson2024_nsf.pdf` |
| Tetzlaff 等 2025，Learning and Instruction | 一手統合 | ✅ 方法、主結果、調節、限制 | `tetzlaff2025.pdf` |
| Hamaker 1986，RER | 一手回顧 | ✅ 方法、Table VI、時間控制、文長、Table XII | `hamaker1986.pdf` |
| King-Shepard 等 2025，EPR | 一手統合 | ✅ 摘要、整體結果、呈現方式與時長調節、偏誤、限制；其餘調節只掃過 | `prequestions_meta2025.pdf` |
| Sana 等 2020，CBE—LSE | 一手實驗 | ✅ 三個實驗、討論、限制 | `sana2020_PMC8711814.xml` |
| Wisniewski 等 2020 | 一手統合 | ✅ 摘要、類型表、限制 | `wisniewski2020.pdf` |
| IES 指引 2007 | 官方 | ✅ 證據等級定義與總表；各建議內文沒讀 | `ies2007.pdf` |
| Koedinger 等 2015 | 一手 | ✅ 摘要、結果、結論 | `koedinger2015.pdf` |
| Rey 等 2019，EPR | 一手統合 | ✅ 摘要、整體效果、先備知識與重播調節、限制首段。先備知識已釐清：無先備 0.29、有一些 −0.12、高先備 0.73，與摘要一致（非單調） | `rey2019.pdf` |
| Crossley 等 2023 | 一手 | ✅ 導言、相關結果、討論 | `crossley2023_PMC10027808.xml` |
| Bullock 等 2019 | 一手實驗 | ✅ 方法、H1 結果、限制 | `bullock2019.pdf` |
| Vander Beken 與 Brysbaert 2018 | 一手實驗 | ✅ 摘要、受試者、主結果（作者版） | `vanderbeken2018.pdf` |
| Stanny 2016 | 一手 | ✅ 摘要、結果、結論首段 | `stanny2016.pdf` |
| Delgado 等 2018，Educational Research Review | 一手統合 | ✅ 摘要、編碼、樣本描述、調節、偏誤、限制 | `delgado2018.pdf` |
| Prinz-Weiß 與 König 2023，Applied Cognitive Psychology | 一手實驗 | ✅ 摘要、設計、材料、結果 | `headings_kit2023.pdf` |
| Trninic 等 2020 | 一手實驗 | ✅ 摘要、導言、設計、結果（含 Table 3）、限制 | `trninic2020.pdf` |
| Kaminski 等 2008 | 一手實驗 | ✅ 全文兩頁 | `kaminski2008.pdf` |
| Fyfe 與 Nathan 2019 | 理論 | 🟡 摘要、導言 | `fyfe_nathan2019.pdf` |
| Wittwer 與 Renkl 2010，EPR | 一手統合 | ✅ 全文（57,906 字元，含 Table 2 調節變項） | Exa 不帶 query 抓作者上傳版，`wittwer_renkl2010.exa.txt` |
| Pan 與 Carpenter 2023，EPR | 一手回顧 | ✅ 理論觀點一節以外的全文（127,156 字元已存） | `pan_carpenter2023.exa.txt` |
| Cromley 與 Chen 2025 | 一手統合 | ✅ 摘要、導言、結果總表與各調節、與既有統合的比較、限制、結論（108,447 字元已存）；方法細節略讀 | `cromley_chen2025.exa.txt` |
| Yang 等 2021，Psych Bull | 一手統合 | ✅ 摘要、結果總表、納入標準、出版偏誤段；其餘內文沒讀 | `yang2021.pdf` |
| Diátaxis 首頁與 Foundations | 官方 | ✅ 兩頁全文 | `diataxis_*.txt` |
| CMU alignment 頁 | 官方 | ✅ 全文 | `cmu_alignment.txt` |
| Uluçınar 2021 | 二手綜整 | ✅ 摘要、篩選方法、結論 | `ubd_eric_EJ1329091.pdf` |
| McNamara 等 1996 | 一手實驗 | 🟡 摘要＋實驗二回想結果片段 | T&F 付費牆；academia 只露預覽 |
| Ginns 等 2013 | 一手統合 | 🟡 摘要 | Springer 付費牆 |
| Sundararajan 與 Adesope 2020 | 一手統合 | 🟡 摘要；數字轉引自 Cromley 與 Chen | Springer 付費牆 |
| Alfieri 等 2013 | 一手統合 | 🟡 摘要 | T&F 付費牆；LRDC 鏡像 404 |
| Van der Kleij 等 2015 | 一手統合 | 🟡 摘要 | SAGE 付費牆 |
| Kandemir 等 2026 | 一手統合 | 🟡 摘要 | Springer 付費牆；HAL 預印本被 Anubis 擋 |
| Lorch 等 2013，Psicología Educativa | 一手實驗 | ✅ 兩個實驗的方法與結果、綜合討論 | `lorch2013.pdf`（COP Madrid 開放取用）。先前只憑摘要寫成「有標題對沒標題」，讀全文後更正：實驗一比的是標題對預告句 |
| Luiten 等 1980；Fyfe 等 2014 | 一手 | 🟡 摘要 | 付費牆；ERIC ED198507 是另一篇，已刪 |
| Tan 等 2025；Schindler 與 Richter 2023；Xie 等 2018 | 一手統合 | 🟡 摘要（ERIC） | Springer 付費牆 |
| Weissgerber 等 2021；Sun 等 2024；Steuer 等 2022 | 一手 | 🟡 摘要（全文 XML 已存，未讀） | `PMC7854329`、`PMC10886187`、`PMC9226369`；我自己還沒讀 |
| Wittwer 與 Renkl 2008 | 理論框架 | 🟡 摘要；四條準則是轉引 | T&F 付費牆 |
| St. Hilaire 等 2023，PBR | 一手統合 | 🟡 摘要（Exa）：specific g = 0.54、general g = 0.04 | Springer 付費；愛荷華州立典藏連結回 239 bytes |
| Agarwal 2019 | 一手實驗 | 🔴 這次未讀，沿用站上既有文章的記載 | 我沒有重讀 |
| Pan 與 Carpenter 轉述的 Richland 2009、Carpenter 2018、Soderstrom 與 Bjork 2023、Janelli 與 Lipnevich 2021 | 一手實驗 | 🔴 轉引 | 沒有去拿 |

## 事實交叉表（只放來源說了什麼）

| 事實（連同對照條件） | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 數學例題 vs 沒有例題的控制組（多為直接解題）：g = 0.48，55 個研究 | Barbieri 2023 全文 | IES 2007 建議 2 列為 moderate（方向一致，非獨立估計） | ✅ |
| 例題＋現成解釋 vs 同樣例題不加解釋：d = 0.16，28 個比較，alpha 0.10 | Wittwer 與 Renkl 2010 | Bisra 2018：自我解釋 vs 現成解釋 g = 0.35（k = 6），間接一致 | ✅ |
| 自我解釋提示 vs 各種對照：g = 0.55（69 個效果量）；vs 沒有額外解釋 0.67 | Bisra 2018 | Tan 2025 摘要：數位環境 g = 0.46（204 個效果量） | ✅ |
| 數學例題搭配自我解釋提示，效果較小（β = −0.24，跨研究） | Barbieri 2023 | Bisra 2018：讀例題時自我解釋 g = 0.36（k = 8），正向 | ❌ conflict：方向不同；Barbieri 自述非因果，兩者對照條件也不同 |
| 駁斥文字 vs 非駁斥文字：g = 0.41（44 個比較）；trim-and-fill 0.28 | Schroeder 與 Kucera 2022 | Danielson 2024：g = 0.37（67 個研究，預先註冊，含 18 篇未發表），Egger 不顯著 | ✅ 兩份獨立統合收斂在 0.3–0.4 |
| 駁斥文字的材料最長 1,542 字 | Schroeder 與 Kucera 2022 限制段 | （只此一源） | ✅ 單一權威一手 |
| 學習目標集中列在最前面 vs 不列：0.53 對 0.47，不顯著；分到各段前 0.55，顯著 | Sana 2020 實驗 1 | （只此一源） | ⚠️ 單一研究、單一主題 |
| 讀前提問對被問到的內容：g = 0.66（181 個比較） | King-Shepard 2025 | Hamaker 1986：答對比例 +0.15（約 1 SD）；Pan 與 Carpenter 2023 敘述一致 | ✅ |
| 讀前提問對沒被問到的內容：g = 0.01，CI −0.09 到 0.12 | King-Shepard 2025 | Hamaker 1986：−0.05（顯著負）；Pan 與 Carpenter：highly inconsistent | ⚠️ 新統合為零、舊回顧為小幅負；King-Shepard 的結語是「不造成損害」 |
| 讀前提問後給回饋 | King-Shepard 2025：重複題上有回饋 g = 1.25，優於只給題目 | Sana 2020 實驗 3：給答案 0.58，不給 0.66（最後測驗是不同的應用題） | ❌ conflict：依變項不同（重複題 vs 新的應用題） |
| 只看讀前題目不作答 vs 作答：沒有差別（g = 0.65，p = 0.71） | King-Shepard 2025 | Sana 2020 實驗 2：作答 0.67 > 讀含答案的敘述 0.57 | ⚠️ 比較的東西不完全相同 |
| 插入的讀後題：重複題 +0.16、相關題 +0.07、無關題 +0.01（答對比例差） | Hamaker 1986 Table VI | Yang 2021：課堂小考被考到的 0.512、沒被考到的 0.321 | ⚠️ 無關內容：Hamaker 為零、Yang 為正（課堂情境） |
| 回饋內容：只說對錯 0.05、給答案 0.32、給解釋 0.49 | Van der Kleij 2015 摘要 | Wisniewski 2020：高資訊量回饋 0.99、訂正 0.46 | ✅ 方向一致（量值不可直接比） |
| 回饋時機：立即 vs 延遲 g = 0.03（51 個研究） | Kandemir 2026 摘要 | Van der Kleij 2015 摘要：延遲對效果量有負向影響 | ❌ conflict（兩者都只有摘要） |
| 鷹架：低先備 d = 0.505；高先備 d = −0.428（60 個實驗） | Tetzlaff 2025 | McNamara 1996 摘要（連貫性，方向一致） | ✅ |
| 分段：記憶 d = 0.32、遷移 0.36；不能重播 0.40、能重播 0.14 不顯著 | Rey 2019 | Tan 2025 摘要：自我解釋在學習者自控步調的環境效果較大（不同操弄） | ✅ 單一來源；調節為跨研究 |
| 可讀性公式解釋教師難度判斷的 23–34% | Crossley 2023 | （只此一源） | ✅ 單一一手；效標不是理解成績 |
| 術語降低自評流暢度（4.57 對 5.27）；滑鼠提示的定義沒有差別 | Bullock 2019 | （只此一源） | ⚠️ 沒量學習 |
| 對話式語氣：記憶 d = 0.30、遷移 0.54；超過 35 分鐘的研究不顯著 | Ginns 2013 摘要 | Cromley 與 Chen 2025 摘要：personalization 屬效果較大的原則之一 | ⚠️ 兩者都未讀到全文 |
| 有趣但無關的內容：g = −0.37 至 −0.41 | Cromley 與 Chen 轉引 Sundararajan 與 Adesope 2020 | Cromley 與 Chen 自己的摘要：移除它屬效果最大者 | ⚠️ 轉引 |
| 字體難讀對回想 d = −0.01、遷移 0.03 | Xie 2018 摘要 | Weissgerber 2021 摘要：指出編碼錯誤，重算後結論大致不變 | ⚠️ 摘要層級 |
| 螢幕對紙本：g = −0.21，說明文才有、限時閱讀時較大 | Delgado 2018 摘要 | 掃到 Clinton 2019 等，未讀 | ⚠️ |
| 標題：標題組回想 4.33 個子主題、預告句組 3.15 個，事實題無差（Lorch 實驗一，134 人）；有標題對沒標題，理解較好、記憶不顯著（Prinz-Weiß，51 人） | Lorch 2013 全文 | Prinz-Weiß 與 König 2023 全文 | ❌ conflict：對記憶的結論不同；對照組與考法都不同 |
| L2 讀短說明文：是非題無差（d = 0.07），自由回想 d = 0.86 | Vander Beken 與 Brysbaert 2018 | （只此一源） | ✅ 單一一手 |
| 30 份 Bloom 動詞表，433 個動詞，無一被一致歸類 | Stanny 2016 | （只此一源） | ✅ |
| Diátaxis 立論頁未引用任何實證 | diataxis.fr/foundations | 搜尋無評估研究 | ✅（「搜不到」不等於不存在） |
| 抽象例子優於具體例子 | Kaminski 2008 | Trninic 2020：改善具體例子後差異消失或反轉 | ❌ conflict（重現研究與原研究） |

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| [推論] 短教材的結果適用於數千字的導讀 | 沒有長文研究，只能外推 | Ginns 的 35 分鐘邊界顯示效果可能隨時間消失；King-Shepard 的時長調節不顯著則指向相反 |
| [推論] 例題後緊接一題同構題 | IES 建議 2；Barbieri 的整體效果 | Barbieri 沒有檢驗「緊接」這個排法 |
| [推論] 節末答案可以緊跟題目，只要題目要求先寫、答案附理由 | Kandemir（時機無差）＋ Van der Kleij（解釋）＋ Lawson 與 Mayer（第 3 篇） | 三者材料不同；Kandemir 與 Van der Kleij 互相衝突且都只有摘要 |
| [推論] 讀文章自控步調，分段的額外好處較小 | Rey 的重播調節 | 調節是跨研究比較；材料是多媒體 |
| [推論] 新手才需要的補充放可跳過的區塊，可同時顧到兩種讀者 | Tetzlaff 的不對稱 | 沒有人測過摺疊或連結；超文字連結文獻我沒讀，可能有反證 |
| [推論] 關鍵名詞寫進正文優於滑鼠提示 | Bullock | 量的是流暢度；一般民眾讀科技新聞，不是學習情境 |
| [推論] L2 讀者寫解釋題較吃力，可請他用母語寫 | Vander Beken | 荷語母語大學生；回想不等於寫解釋 |
| [推論] 查核紀錄等同有趣但無關的內容 | seductive details 文獻 | 該文獻測的是趣聞與裝飾圖，而且我只有轉引數字 |
| [推論] 讀者即使不作答，讀前題目仍有用 | King-Shepard：只看不答 g = 0.65 | 實驗裡是被要求看；網頁讀者可能直接跳過 |

## 草稿骨架

主脊：依「作者在文章裡能做的事」排，不依研究傳統排。

1. 導言：系列位置、問題從哪來、和 Learning How to Learn 的分工；**取樣偏誤一段放這裡**（英文、大學生、短教材、拿得到全文的研究）。
2. 先看結論：一張「寫法—證據—強度」表。
3. 例子與解釋（例題、現成解釋、具體到抽象、對比案例、駁斥迷思）。
4. 開頭與結構（學習目標、讀前提問、前導組織與標題、讀者程度、分段與篇幅）。
5. 文中的問題與練習（插入式問題、答案怎麼給、做對讀）。
6. 語言與呈現（可讀性、術語、語氣、無關內容、難讀字體與螢幕閱讀、非母語與翻譯）。
7. 實務框架有多少實證。
8. 來源互相衝突的地方（獨立小節，列出不選邊）。
9. 拿本站規格逐條對照與七項修改建議。
10. 今晚可以做的三件事。
11. 證據的限制。
12. 附錄與參考資料（標讀取程度）。

各節結論與證據強度見交接訊息。

## 待解問題

- 讀前提問要不要附答案：兩個來源在不同依變項上方向相反，需要使用者決定規格怎麼寫。
- 節末答案要不要摺疊：沒有直接研究。
- （已解決，見第三輪）Rey 2019 先備知識調節：無先備 0.29、有一些 −0.12、高先備 0.73，與摘要一致。
- 還存著沒讀完的全文：Delgado 2018、Prinz-Weiß 與 König 2023、Weissgerber 2021、Sun 2024、Steuer 2022、Yang 2021 的方法；要寫進正文就得先讀完。
- St. Hilaire 2023 拿不到；King-Shepard 引用它的一個調節結果（問與未問內容的關聯，k = 15，p = .02）。
- source registry（research-source-registry skill）沒有跑。

## 第二輪更新（2026-10-13，team-lead 確認骨架之後）

### 再試一輪全文的結果

- 升級成全文或相關章節讀完：Wittwer 與 Renkl 2010、Pan 與 Carpenter 2023、Cromley 與 Chen 2025、Yang 2021、Delgado 2018、Prinz-Weiß 與 König 2023、Lorch 等 2013、Trninic 2020、Kaminski 2008、Rey 2019、Uluçınar 2021。關鍵做法：Exa `web_fetch_exa` 不帶 query、maxCharacters 設大，超過上限的結果會落地成檔，可以存進 `src/` 再讀，不佔對話。
- 仍然只有摘要（正文提到時明寫、不用數字、不列參考資料）：Alfieri 2013、McNamara 1996、Luiten 1980、Tan 2025、St. Hilaire 2023、Van der Kleij 2015、Kandemir 2026、Ginns 2013、Sundararajan 與 Adesope 2020、Xie 2018 與 Weissgerber 2021。Fyfe 2014、Wittwer 與 Renkl 2008、Sun 2024、Steuer 2022、Schindler 與 Richter 2023 不再出現在文章裡（最後一篇全文已存 `schindler_richter2023.exa.txt`，沒讀）。
- 這一輪試過的管道：Springer 文章頁 curl（全數回 305 bytes 的擋頁）、Exa 抓 Springer／SAGE／T&F 付費頁（只有摘要；T&F 逾時）、LRDC 兩個 Alfieri 鏡像（404）、Kassel 與 HAL 典藏（Anubis）、WSU、Western Sydney、UTwente、Cito 的機構頁（沒有 PDF 連結）。

### 因此改變的結論

| 項目 | 之前 | 現在 |
|---|---|---|
| 讀前提問對未問內容 | 不一致、舊文獻為負 | King-Shepard 2025：g = 0.01；沒有損害 |
| 標題 | 「有標題的文本記得較多子主題」（憑摘要） | Lorch 實驗一比的是標題對預告句；Prinz-Weiß 才是有標題對沒標題。兩者對記憶的結論不同，列為衝突 |
| 對比案例 | d = 0.50 進結論表 | 只有摘要，移出結論表 |
| 回饋內容 | 以 Van der Kleij 的 0.49／0.32 為依據 | 改以 Wisniewski 2020（0.99 對 0.46）與 Yang 2021（0.54 對 0.37）為依據 |
| 回饋時機 | 「平均沒有差」 | 兩份都只有摘要且互相衝突，不下結論 |
| 對話語氣 | Ginns 的 0.30／0.54 與 35 分鐘邊界 | 以 Cromley 與 Chen 的 0.70（限 Mayer 的研究）為依據；Ginns 降為摘要層級；時間邊界列為衝突 |
| 無關內容 | −0.37～−0.41 | 以 Cromley 與 Chen 的 1.00 為依據，Sundararajan 的數字寫成轉引 |
| 文本連貫性 | McNamara 當成主要依據之一 | 只有摘要；讀者程度一節只靠 Tetzlaff |
| 分段、先備訓練 | 沿用第 3 篇引的 Mayer 中位數 | 加入 Cromley 與 Chen 的不顯著結果，列為衝突 |
| 現成解釋 | d = 0.16、概念性知識有幫助 | 補上 0.36、對照組自我解釋時 −0.01、點開才顯示 0.04 |

### 文章結構（拆成兩篇）

- 第一篇（series order 1）`2026-10-13-teaching-text-evidence(.md/-en.md)`：例子與解釋＋開頭與結構。
- 第二篇（series order 5，暫定）`2026-10-13-teaching-text-questions-feedback(.md/-en.md)`：文中的問題與回饋＋語言與呈現＋實務框架＋本站規格對照。
- 兩篇各有取樣偏誤段（開頭）、結論表、來源衝突小節、今晚可做的事、證據限制、附錄、參考資料。

### 對 course-guide-contract 的最終建議

1. 完整例子後緊接一題結構相同、條件不同的題目（IES 的交替建議；「緊接」是推論）。
2. 自我檢查的答案改成「答案與理由」（Wisniewski 2020、Yang 2021）。
3. 規定題目層次（解釋原因或套用到新條件），題目上寫明先作答再往下看（Hamaker 1986、Bisra 2018；後半是推論）。
4. 「常見誤解」寫成三步（Schroeder 與 Kucera 2022、Danielson 2024）。
5. 學習目標分到各節第一行，每篇至少一項改寫成先猜的問題（Sana 2020、King-Shepard 2025）。
6. 範圍卡加「讀者的先備程度」；新手才需要的補充放可跳過的區塊（前半 Tetzlaff 2025；後半是推論，且 Wittwer 與 Renkl 的點開才顯示結果是反向提醒）。
7. 「設計依據」分「有實驗」與「慣例」兩類標示。

待解、規格先不規定：讀前題目旁要不要放答案；節末答案要不要摺疊；答案立即或延後。
不建議加：對話語氣要求、可讀性分數門檻、Bloom 動詞表。

## 第三輪更新（2026-10-14，獨立審稿之後）

審稿報告：`.work/reviews/2026-10-13-teaching-text-review.md`（含文末「作者修正」）。這一輪的讀法改成 deep-research 2.5：每個列進參考資料的來源由獨立的精讀者從第 1 行依序讀到最後一行，抽取紀錄存 `.research/extractions/teaching-text/`（28 份），讀取起訖在各紀錄末尾。**上面第一、二輪的盤點表、事實交叉表與推論表已被抽取紀錄取代；有出入時以抽取紀錄為準。**

### 精讀後改變的結論

| 項目 | 第二輪 | 現在 | 依據的紀錄 |
|---|---|---|---|
| 分段對能重播的教材 | 能重播時不顯著，所以對文字的額外好處較小 | 重播不是顯著的調節變項；遷移上方向相反；作者判定假設不成立。推論撤下 | rey2019 |
| 學習目標 | 分到各段前有幫助，建議拆到各節 | 只在有指示語時有差；兩種擺法沒差；建議撤下 | sana2020 |
| 讀前提問 | 只幫到被問的內容 | 純題目 0.60；概念型題目對未問內容 0.34；附回饋對新題 −0.04 | king_shepard2025 |
| 讀前題附答案 | 來源衝突 | 量的考題不同；新題上兩份都不支持附答案；原作者不解讀 1.25 | king_shepard2025、sana2020 |
| 標題 | 標題對開頭預告句 | 預告句是每節第一句；實驗一沒有無訊號組；實驗二兩者無可靠差別。Prinz-Weiß 的標題是問句 | lorch2013、prinz_weiss2023 |
| 駁斥文字 | 兩份獨立統合；固定三步 | 兩份納入研究大量重疊；都沒有檢驗寫法；限制分屬兩份 | schroeder_kucera2022、danielson2024 |
| 自我解釋 | 要讀者寫出解釋 | 納入標準排除了綁回饋的研究；沒有檢驗「寫」 | bisra2018 |
| 現成解釋 | 只對概念性知識有幫助 | 概念性知識那一項顯著，類型之間無法檢定；對照組自我解釋的差異不顯著 | wittwer_renkl2010 |
| 具體與抽象 | 先具體再抽象有共識 | IES 評中等的是並用且明寫對應；Kaminski 實驗四是只學抽象較好；Trninic 的結論較保留 | ies2007、kaminski2008、trninic2020 |
| 例題後接題目 | 我的推論 | IES 指引原文就是交替，且題目要有變化 | ies2007 |
| 讀者程度 | 鷹架對新手有益 | 「協助」定義寬、編碼沒交代；過半研究的高先備是分數較高的一半；不對稱沒有檢定 | tetzlaff2025 |
| 插入式問題 | +16 個百分點 | 排除了給回饋的實驗；合併插在段後與集中文末；有 12 個實驗用長文 | hamaker1986 |
| 高階題 | 中 | 對照對象是事實題組；作者提醒時間混淆 | hamaker1986 |
| 課堂小考 | 整學期、有成績壓力 | 排除實驗室與線上遠距；課堂外較小；利害高低無差；課前小考不等於讀前提問 | yang2021 |
| 回饋內容 | 高資訊量 0.99 | 合併前後測研究；三分之一效果量有分類；依摘要編碼；偏誤顯著未校正；對應到答案加理由是推論 | wisniewski2020 |
| 做對讀 | 六倍 | 依變項是小考總分、與練習同源；期末考圖像不同 | koedinger2015 |
| 可讀性 | 不建議當門檻 | 節錄 140–200 字；效標折半相關 .63；「不當門檻」是我的判斷 | crossley2023 |
| 術語 | 提示框沒用 | 每段 10 個術語；沒記錄是否看了定義；白話版較順是直接結果 | bullock2019 |
| 螢幕對紙本 | 略優；自控步調影響最小 | 作者認為幅度不小；捲動的結果；排除大型研究的敏感度分析；「較小」是推論 | delgado2018 |
| L2 | 可請讀者用母語作答 | 測驗語言與文本相同；作者提醒換語言有代價；建議撤下 | vanderbeken2018 |
| 逆向設計 | 沒有對照實驗、慣例 | 有 18 篇量化實驗研究，本文沒讀；未定 | ulucinar2021 |
| Bloom 動詞表 | 沒有對照實驗 | 內容分析：歸類不一致；作者說可當找用語的工具 | stanny2016 |
| Diátaxis | 「有用是因為感覺對」 | 立論頁自己說感覺對不足以當理論依據；首頁以採用與證言為依據 | diataxis |
| 長文本 | 沒有研究用數千字材料 | Hamaker 與 King-Shepard 的綜整裡有；但我沒逐一讀，也不是網頁教學文 | hamaker1986、king_shepard2025 |
| Cromley 與 Chen 的時間調節 | 用來回應沒測過長教材 | 介入時間中位數 6.8 分鐘；Egger 顯著未校正；接受稿有內部不一致 | cromley_chen2025 |

### 抽查

2026-10-14 由文章作者（沒有參與精讀）對抽取紀錄裡文章實際用到、且第一二輪沒讀到的數字回原文檔核對，共 22 份來源、約 50 個數字或原句，全部找到對應行（King-Shepard 0.34／−0.04／0.60／1,697；Rey 0.55／0.45／假設六；Sana 註 1／0.999／critical gap；Hamaker 23,000／回饋排除；Yang 195／.051／0.401；Wisniewski 0.42／0.63／0.55；Cromley 6.8 分鐘；Tetzlaff 32；Lorch 120／d = 0.40／p = .17；Prinz-Weiß .069／0.52；Kaminski 實驗四 t31 = 2.7；Danielson modest；Schroeder「not intended to examine」；Delgado −0.25／−0.22；Koedinger 16%／31%；Crossley 140–200／.63；Bullock 10 個術語；Stanny thesaurus／top 30；Vander Beken N = 195；Uluçınar 18 studies；IES every other problem／six）。這不是 2.5 節要求的「由另一個 agent 每份隨機抽三個」；每份紀錄的隨機抽查還沒做。

### 對 course-guide-contract 的建議（第三輪）

留五項：例子後接一題（IES）；常見誤解寫出再駁斥、不規定格式（兩份駁斥文字統合）；具體與抽象並用並明寫對應（IES）；答案盡量附理由、保留「或判準」（推論）；設計依據逐條標依據種類。撤下：目標分到各節、範圍卡加先備。待解五項、不建議加三項，見第二篇。
