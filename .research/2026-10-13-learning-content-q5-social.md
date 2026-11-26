# Research: 一個人讀和一群人學差在哪，誰被排除？（learning-content 系列子問題五，代號 q5-social）

日期：2026-10-13。狀態：research note，未寫文章、未改 repo 內任何文章／skill／程式。原文落地在 `.research/raw/learning-content/q5-social/`。

**讀這份 note 之前先知道三件事**

1. 「✅ 全文」的意思是：全文已落地，我讀了摘要，並用關鍵詞把方法、結果、討論的相關段落抽出來讀；**沒有任何一篇是從頭到尾逐頁讀完的**。要拿某篇的次要數字（調節變項、子群）寫進文章前，請回原文那一段再核一次。
2. 選案偏誤（步驟 0-3）寫在最前面的「選案」一節，不在文末。
3. toolDegradation：Groundlane MCP 不在本 session 工具清單；Groundlane 直接 HTTP 回 401（環境沒有 token）；Keenable keyless 可用（需帶 `X-Keenable-Title` header，參數是 `max_results` 不是 `count`），全程用它搜尋；You.com keyless 回 405（未再試 MCP 握手）；全文抓取依序用 curl 直抓、Europe PMC `fullTextXML`、Jina reader keyless（`r.jina.ai`，可用，沒有遇到額度問題）、Wayback（多數 404）、Exa `web_fetch`（Sage 逾時）、Tavily extract（回空）、最後用 playwright-core 自起第二個 headed Chrome（Playwright MCP 被別的 session 鎖住）。dblp 被 Anubis 擋，研討會議程改用 Crossref API 依 container-title 取全部標題。

---

## 選案（research-selection 三步）

### 0-1 母群定義

**算**：（社會面）任何比較「與他人一起學／教他人／旁觀他人學」和「獨自學」的學習成效研究，以及線上自學情境裡社群功能（論壇、問答站、聊天室、讀書會、梯次制）與學習成果關係的研究；（排除面）任何檢驗「內容的呈現方式讓哪一群人學得比較差或根本進不來」的研究與準則：身心障礙與輔助科技、語言、文化、裝置與網路。
**不算**：課堂分組的班級經營技巧、同儕互評的評分信度、特殊教育的個別化教學計畫、語言教學法本身（字幕研究只取「看懂內容」與附帶的字彙結果）、無障礙法規遵循。學習者自己的讀書方法由站上 Learning How to Learn 系列處理，這裡只引用。

### 0-2 掃描方法與掃到的清單

| 掃描方法 | 做了什麼 | 得到什麼 |
|---|---|---|
| 近五到十年的統合分析與系統性回顧（Keenable，65 組查詢，每組取 8 筆） | CSCL、peer instruction、collaborative inhibition、learning by teaching、vicarious／dialogue video、MOOC 論壇、social annotation、UDL、字幕、螢幕對紙本、EMI、情境個人化等 | 約 520 筆候選，去重後約 190 個不同來源 |
| 研討會議程（Crossref API 取全部論文標題再用關鍵詞篩） | Learning@Scale 2023（62 篇）、2024（92 篇）、2025（66 篇）；ICER 2024（36 篇）、2025（31 篇） | 篩出 6 篇相關：Assess or Discuss（L@S 2025）、Do MOOC Conversations Matter?（L@S 2025）、L2 English and Culture as Factors in College Math Achievement（L@S 2025）、Adaptive Tutoring Goes to Sweden（L@S 2025）、Debugging for Inclusivity in Online CS Courseware（ICER 2024）、Exploring the Effects of Grouping by Programming Experience in Q&A Forums（ICER 2024，未取得） |
| 準則與產業年報 | CAST UDL Guidelines 3.0、WCAG 2.2、W3C WAI Images Tutorial、WebAIM Million 2026、WebAIM Screen Reader User Survey #10、HTTP Archive Web Almanac 2025、Alex Russell〈Performance Inequality Gap, 2026〉 | 全部取得 |
| 實務端 | swyx〈Learn In Public〉、技術部落格留言系統的取捨文（Raymond Camden 等 8 筆搜尋結果）、Ruzuku 平台的 131 萬筆註冊分析、Google Tech Writing for Accessibility、Write the Docs 無障礙指南 | 取得 5 個 |
| 非英語 | 中文：「字幕 學習成效 後設分析」「全英語授課 EMI 學科學習成效 台灣」「同儕教學 合作學習 後設分析 臺灣」「MOOC 字幕 翻譯 完成率」；日文：「協作学習 メタ分析」「教えることによる学習 小林敬一」 | 日文取得 2 篇全文（小林 2019、2020）；中文取得 1 篇清華大學的研究介紹文；華藝（airiti）的 4 筆論文只有書目頁，沒有進一步取全文（見偏誤） |
| EDM、CHI、ASSETS 議程 | **沒有做系統性掃描**。ASSETS 與 CHI 的論文是從主題搜尋進來的（Sharif 2021、Albusays 2017、Guo 2018、Lundgard 2021） | 缺口，見偏誤 |

### 0-3 覆蓋矩陣

| 維度 | 值 | 選入深讀 | 缺口 |
|---|---|---|---|
| 社會面：機制 | 一起學 vs 獨自學（整體效果） | Chen 2018🟡、Tenenbaum 2020、Radkowitsch 2020、Kirschner 2018 | Jeong 2019 未取得 |
| | 反向／沒效果 | 協作抑制（Luo 2024）、Coetzee 2014（聲望制度無效）、Kizilcec 2020（規模化後效果消失）、MOOC 職涯（L@S 2025）、Pannatier 2024（字幕無效） | Marion & Thorley 2016 未取得 |
| | 同儕教學 | Vickrey 2015、Tullis & Goldstone 2020 | Balta 2017 統合分析未取得 |
| | 教別人／預期要教 | Kobayashi 2019（兩篇）、2024🟡、Lachner 2022、Ribosa & Duran 2022、Nestojko 2014 | Fiorella & Mayer 2013 未取得 |
| | 旁觀他人學 | Chi 2017、Qian, Hong & Chi 2024 | Chi 2008、Muller 2008 未取得 |
| | 線上自學社群 | Coetzee 2014、Gillani 2014、Li 2014、Wise & Cui 2018🟡、系統性回顧（Frontiers 2024）、Weimer 2022、del Rio-Chanona 2024 | Discord 只有 1 篇經驗報告的摘要；knowledge building（Scardamalia & Bereiter）**完全沒讀** |
| 排除面：群體 | 視障／螢幕閱讀器 | Sharif 2021、Lundgard 2021、Albusays 2017、Mealin 2012、WebAIM 兩份 | 數學式的實證只落地未細讀 |
| | 聽障／字幕 | Gernsbacher 2015、Montero Perez 2013、Reynolds 2022、Language Learning 2024、Pannatier 2024 | 聽障學習者讀技術教材的一手研究沒找 |
| | 非母語讀者 | Guo 2018、Dasgupta & Hill 2017、MITx 2021、Liao 2020、Wang & Pellicer-Sánchez 2023🟡 | 翻譯品質對學習成效的實驗找不到；EMI 統合分析只有摘要 |
| | 文化 | Kizilcec & Cohen 2017、Kizilcec 2017、Kizilcec 2020、Chatterjee 2024、小林 2019（日本） | 「例子的文化選擇」沒有找到直接比較學習成效的實驗 |
| | 裝置／網路 | Delgado 2018、Salmerón 2024、Clinton-Lisell 2026、Honma 2022、Russell 2026、Web Almanac 2025 | 低頻寬對學習成效的研究沒找到 |
| 設計框架 | UDL | CAST 3.0 四頁、Boysen 2024🟡、Boysen 2021🟡、King-Sears 2023🟡、Almeqdad 2023 | 兩篇批評都只到摘要 |
| 時間 | 2010 以前／2010–2019／2020 以後 | 2008–2014：5；2015–2019：12；2020–2026：其餘 | 經典原始研究（Crouch & Mazur 2001、Smith 2009、Chi 2008）都只靠後來的回顧轉述 |
| 地理／語言 | 非英語圈 | 日本（小林 2 篇）、中國（Luo 2024、Liao 2020、清華）、瑞士（Pannatier）、西班牙（Delgado、Salmerón）、Scratch 五國 | 沒有台灣的實證研究進到深讀 |
| 實務端 | 做內容的人怎麼做 | swyx、Camden、Ruzuku、Google、Write the Docs、Russell | 沒有「個人教學部落格如何處理回饋」的系統性資料 |

### 0-4 偏誤

- **英語圈與大學生偏誤很重。** 協作、教別人、旁觀對話的實驗受試者幾乎都是大學生或中小學生，教材多半是 10–30 分鐘的單篇文字或影片。沒有一篇研究的對象是「自己上網找長篇導讀來讀的成人」。
- **台灣沒有進到深讀。** 我搜了四組中文查詢，找到華藝上的字幕研究與同儕教導後設分析（2013）的書目頁，但沒有去取全文，也沒有查國圖博碩士論文系統。這是「我沒去拿」，不是被擋。
- **實務端仍然偏我原本知道的名字**（swyx、Alex Russell、WebAIM）。Ruzuku 是搜尋掃到的，但它是賣課程平台的廠商，資料是自家資料庫的觀察值。
- **knowledge building 與論證式學習沒有做。** 任務書點名這兩項，我只透過 CSCL 統合分析間接碰到，沒有讀 Scardamalia & Bereiter 或 arguing-to-learn 的任何一手文獻。
- **為什麼還是選這些**：可取得全文、有對照條件、而且每個方向至少放進一篇沒效果或反向的研究。

---

## 子問題

1. **一起學比自己學好多少，什麼條件下不好？**（CSCL、同儕互動、同儕教學、協作抑制、協作的認知成本）
2. **線上自學的社群功能和「學會」是什麼關係？**（MOOC 論壇、問答站、聊天室、讀書會、梯次制；相關還是因果）
3. **沒有別人在場，能不能拿到社會效果的一部分？**（教別人、預期要教、對不存在的對象解釋、旁觀別人被教、公開筆記；沒有留言區的部落格能做什麼）
4. **UDL 與無障礙：準則要求什麼，證據多強？**（UDL 3.0 與批評、WCAG 對教學內容的具體條文、螢幕閱讀器使用者讀圖表與程式碼）
5. **語言與文化：非母語讀者、翻譯、雙語、字幕、例子的選擇**
6. **裝置與網路：螢幕對紙本、手機、捲動、頁面重量**

---

## 來源清單

訪問日皆為 2026-10-13。檔名指 `.research/raw/learning-content/q5-social/` 內的檔案。撤稿檢查：下列有 DOI 的 52 筆用 OpenAlex `is_retracted` 查過，全部為 false（清單見 note 末「撤稿檢查範圍」）。

### 子問題 1

- [Chen, Wang, Kirschner & Tsai 2018, The Role of Collaboration, Computer Use, Learning Environments, and Supporting Strategies in CSCL: A Meta-Analysis](https://doi.org/10.3102/0034654318791584)（RER）— 一手統合分析；**摘要**；`chen2018-cscl-meta.md`
- [Tenenbaum, Winstone, Leman & Avery 2020, How Effective Is Peer Interaction in Facilitating Learning? A Meta-Analysis](https://doi.org/10.1037/edu0000436)（J. Educ. Psychol.）— 一手統合分析；全文；`tenenbaum2020-peer-interaction.txt`
- [Radkowitsch, Vogel & Fischer 2020, Good for learning, bad for motivation? A meta-analysis on the effects of CSCL scripts](https://doi.org/10.1007/s11412-020-09316-4)（ijCSCL）— 一手統合分析；全文；`radkowitsch2020-scripts.md`
- [Kirschner, Sweller, Kirschner & Zambrano 2018, From Cognitive Load Theory to Collaborative Cognitive Load Theory](https://doi.org/10.1007/s11412-018-9277-y)（ijCSCL）— 理論文；全文；`kirschner2018-cclt.txt`
- [Nokes-Malach, Richey & Gadgil 2015, When Is It Better to Learn Together?](https://doi.org/10.1007/s10648-015-9312-8)（Educ. Psychol. Rev.）— 回顧；**摘要**；`nokes-malach2015.md`
- [Luo et al. 2024, Meta-Analysis of Collaborative Inhibition Moderation by Gender, Membership, Culture, and Memory Monitoring](https://doi.org/10.3390/bs14090763)（Behavioral Sciences）— 一手統合分析；全文；`collab-inhibition-meta2024.txt`
- [Vickrey, Rosploch, Rahmanian, Pilarz & Stains 2015, Research-Based Implementation of Peer Instruction: A Literature Review](https://doi.org/10.1187/cbe.14-11-0198)（CBE—LSE）— 回顧；全文；`vickrey2015-pi-review.txt`
- [Tullis & Goldstone 2020, Why does peer instruction benefit student learning?](https://doi.org/10.1186/s41235-020-00218-5)（CR:PI）— 一手；全文；`tullis-goldstone2020-pi.txt`
- [Wei, Soderstrom, Meade & Scott 2024, Metacognition About Collaborative Learning: Students' Beliefs Are Inconsistent with Their Learning Preferences](https://doi.org/10.3390/bs14111104)（Behavioral Sciences；PMC11591187；作者與 DOI 已用 Europe PMC 核對）— 一手問卷；全文落地、只讀摘要；`metacog-collab2024.txt`

### 子問題 2

- [Coetzee, Fox, Hearst & Hartmann 2014, Should Your MOOC Forum Use a Reputation System?](https://doi.org/10.1145/2531602.2531657)（CSCW）— 一手隨機實驗；全文；`coetzee2014-reputation.txt`
- [Kizilcec et al. 2020, Scaling up behavioral science interventions in online education](https://doi.org/10.1073/pnas.1921417117)（PNAS）— 一手大規模預註冊實驗；全文；`kizilcec2020-pnas.txt`
- [Loh, Martins van Jaarsveld, Mesutoglu & Baars 2024, Supporting social interactions to improve MOOC participants' learning outcomes: a literature review](https://doi.org/10.3389/feduc.2024.1345205)（Frontiers in Education 9, 1345205）— 系統性回顧；全文落地、讀摘要與方法；`frontiers2024-mooc-social.txt`
- [Gillani, Yasseri, Eynon & Hjorth 2014, Structural limitations of learning in a crowd](https://arxiv.org/abs/1411.3662)（Scientific Reports）— 一手；全文落地、讀摘要；`mooc-structural-limits.txt`
- [Wise & Cui 2018, Unpacking the relationship between discussion forum participation and learning in MOOCs: content is key](https://doi.org/10.1145/3170358.3170403)（LAK）— 一手；**摘要（且抓到的摘要被截斷）**；`wise-cui2018.txt`
- [Ou & Joyner 2025, Assess or Discuss: Comparing Peer Assessment and Online Discussion for Enhancing Learning at Scale](https://doi.org/10.1145/3698205.3733927)（L@S 2025, pp. 222–226）— 一手觀察研究；**摘要**；`assess-or-discuss2025.txt`
- [Mehta, Srivastava, Liu, Vanacore & Baker 2025, Do MOOC Conversations Matter? Investigating the Role of Social Presence and Course-Relevant Discussion in Career Advancement](https://doi.org/10.1145/3698205.3733930)（L@S 2025, pp. 236–240）— 一手；**摘要**；`mooc-conversations-par.txt`
- [Li et al. 2014, Watching MOOCs together: investigating co-located MOOC study groups](https://doi.org/10.1080/01587919.2014.917708)（Distance Education；落地的是 EPFL 的較短版本）— 一手；全文（短版）；`li2014-watching-moocs-together.md`
- [Chen & Chen, Massive Open Online Course Study Group: Interaction Patterns in Face-to-Face and Online (Facebook) Discussions](https://doi.org/10.3389/fpsyg.2021.670533)（Frontiers in Psychology 第 12 卷；DOI 年份 2021，PMC 收錄日 2022-03，引用年份寫進文章前再對期刊頁）— 一手質性；全文落地、讀摘要；`mooc-study-group-fb2022.txt`
- [Li, Endres & Weimer 2022, Debugging with Stack Overflow: Web Search Behavior in Novice and Expert Programmers](https://web.eecs.umich.edu/~weimerw/p/weimer-icse2022-seet.pdf)（ICSE-SEET）— 一手；全文落地、讀摘要與部分結果；`weimer2022-so-debugging.txt`
- [del Rio-Chanona, Laurentsyeva & Wachs 2024, Large language models reduce public knowledge sharing on online Q&A platforms](https://doi.org/10.1093/pnasnexus/pgae400)（PNAS Nexus）— 一手；全文落地、讀摘要；`delrio-chanona2024-so.txt`
- [Bridson, Atkinson & Fleming 2022, Delivering Round-the-Clock Help to Software Engineering Students Using Discord: An Experience Report](https://doi.org/10.1145/3478431.3499385)（SIGCSE 2022, pp. 759–765）— 經驗報告；**摘要**；`discord-sigcse2022.txt`
- [Davis, Chen, Hauff & Houben 2018, Activating learning at scale: A review of innovations in online learning strategies](https://doi.org/10.1016/j.compedu.2018.05.019)— 回顧；**摘要（不完整）**；`davis2018-activating.txt`
- [Ruzuku, What 2,000 Course Launches Tell Us About Cohort vs. Self-Paced Completion](https://ruzuku.com/learn/articles/cohort-vs-self-paced-completion-study)— 廠商自家資料的觀察分析（C 級）；全文；`ruzuku-cohort-study.txt`
- [钱静，提高中国学习者慕课完成率的心理学研究](https://www.tsinghua.edu.cn/info/1666/70228.htm)（清華大學新聞網）— 作者自述的研究介紹（B 級）；全文落地、讀前半；`tsinghua-qianjing-zh.txt`

### 子問題 3

- [Kobayashi 2019, Learning by Preparing-to-Teach and Teaching: A Meta-Analysis](https://doi.org/10.1111/jpr.12221)（Japanese Psychological Research）— 一手統合分析；全文；`kobayashi2019-meta.txt`
- [Kobayashi 2019, Interactivity: A Potential Determinant of Learning by Preparing to Teach and Teaching](https://doi.org/10.3389/fpsyg.2018.02755)（Frontiers in Psychology 第 9 卷；DOI 已用 Europe PMC 核對；卷期屬 2018，線上發表日 2019-01-11，本 note 沿用「2019」）— 再分析；全文；`kobayashi2019-interactivity.txt`
- [Kobayashi 2024, Interactive Learning Effects of Preparing to Teach and Teaching: a Meta-Analytic Approach](https://doi.org/10.1007/s10648-024-09871-4)（Educ. Psychol. Rev.）— 一手統合分析；**摘要**；`kobayashi2024-meta.md`
- [小林敬一 2020，他の学習者に教えることによる学習はなぜ効果的なのか？](https://www.jstage.jst.go.jp/article/jjep/68/4/68_401/_pdf)（教育心理学研究）— 日文回顧；全文落地、讀摘要與一段結果；`kobayashi2020-jjep-ja.txt`
- [小林敬一 2019，日本の学生には教授予期の学習効果が見られない？](https://doi.org/10.14945/00026979)（静岡大学教育学部研究報告）— 日文敘事回顧加統合分析；全文；`shizuoka-teaching-expectancy-ja.md`
- [Lachner, Hoogerheide, van Gog & Renkl 2022, Learning-by-Teaching Without Audience Presence or Interaction: When and Why Does it Work?](https://doi.org/10.1007/s10648-021-09643-4)（Educ. Psychol. Rev.）— 回顧；全文；`lachner2022-lbt-no-audience.txt`
- [Ribosa & Duran 2022, Do students learn what they teach when generating teaching materials for others? A meta-analysis](https://doi.org/10.1016/j.edurev.2022.100475)（Educ. Res. Rev.）— 一手統合分析；全文；`ribosa-duran2022.txt`
- [Nestojko, Bui, Kornell & Bjork 2014, Expecting to teach enhances learning and organization of knowledge in free recall of text passages](https://doi.org/10.3758/s13421-014-0416-z)（Memory & Cognition）— 一手實驗；全文落地、讀摘要；`nestojko2014.md`
- [Chi, Kang & Yaghmourian 2017, Why Students Learn More From Dialogue- Than Monologue-Videos](https://doi.org/10.1080/10508406.2016.1204546)（JLS）— 一手實驗；全文；`chi2017-dialogue-monologue.txt`
- [Qian, Hong & Chi 2024, Learning from watching dialog and monolog videos in online STEM courses](https://doi.org/10.1186/s40594-024-00505-3)（IJ STEM Education 11, 49；作者已用 Crossref 核對，第一輪誤記為 Ding，檔名沿用舊稱）— 一手課堂實驗；全文；`ding2024-dialog-monolog.md`
- [swyx, Learn In Public](https://swyx.io/learn-in-public)— 實務論述（B 級）；全文；`swyx-learn-in-public.txt`
- [Raymond Camden 2024, The Return of the Comment(s)](https://www.raymondcamden.com/2024/01/02/the-return-of-the-comments)— 實務自述（B 級）；全文；`camden2024-return-comments.txt`
- [Campillo-Ferrer, Miralles-Martínez & Sánchez-Ibáñez 2021, The effectiveness of using edublogs as an instructional and motivating tool in the context of higher education](https://doi.org/10.1057/s41599-021-00859-x)（Humanities and Social Sciences Communications 8, 175）— 一手準實驗；全文落地、讀摘要；`edublogs2021.txt`
- [Porter 2022, Collaborative Online Annotation: Pedagogy, Assessment and Platform Comparisons](https://doi.org/10.3389/feduc.2022.852849)— 一手；全文落地、讀摘要；`frontiers2022-social-annotation.txt`

### 子問題 4

- [CAST 2024, UDL Guidelines 3.0](https://udlguidelines.cast.org/)：首頁、[Research Evidence](https://udlguidelines.cast.org/more/research-evidence)、[About the Guidelines 3.0 Update](https://udlguidelines.cast.org/more/about-guidelines-3-0)、[Representation](https://udlguidelines.cast.org/representation)— 官方；全文；`cast-udl3-*.txt`
- [Boysen 2024, A critical analysis of the research evidence behind CAST's universal design for learning guidelines](https://doi.org/10.1177/14782103241255428)（Policy Futures in Education）— 一手；**摘要**；`boysen2024-udl.txt`
- [Boysen, Lessons (Not) Learned: The Troubling Similarities Between Learning Styles and Universal Design for Learning](https://doi.org/10.1037/stl0000280)（Scholarship of Teaching and Learning in Psychology 10(2), 2024；線上先行 2021）— 論述；**摘要**；`boysen2021-ovid.md`
- [King-Sears et al. 2023, Achievement of learners receiving UDL instruction: A meta-analysis](https://doi.org/10.1016/j.tate.2022.103956)（Teaching and Teacher Education）— 一手統合分析；**摘要＋section snippets**；`king-sears2023.txt`
- [Almeqdad, Alodat, Alquraan, Mohaidat & Al-Makhzoomy 2023, The effectiveness of universal design for learning: A systematic review of the literature and meta-analysis](https://doi.org/10.1080/2331186X.2023.2218191)（Cogent Education 10(1), 2218191；作者名單已用 Crossref 核對，無誤）— 一手統合分析；全文；`almeqdad2023-udl-meta.txt`
- [W3C 2023/2024, Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)— 官方規格；全文；`wcag22.md`
- [W3C WAI, Images Tutorial: Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)— 官方；全文；`w3c-complex-images.md`
- [WebAIM, The WebAIM Million 2026](https://webaim.org/projects/million/)— 一手年度量測；全文；`webaim-million2026.txt`
- [WebAIM, Screen Reader User Survey #10 Results](https://webaim.org/projects/screenreadersurvey10/)— 一手問卷（n=1539）；全文；`webaim-sr-survey10.txt`
- [Sharif, Chintalapati, Wobbrock & Reinecke 2021, Understanding Screen-Reader Users' Experiences with Online Data Visualizations](https://doi.org/10.1145/3441852.3471202)（ASSETS）— 一手；全文落地、讀摘要；`sharif2021-sr-vis.txt`
- [Lundgard & Satyanarayan 2021, Accessible Visualization via Natural Language Descriptions: A Four-Level Model of Semantic Content](https://arxiv.org/abs/2110.04406)（IEEE TVCG）— 一手；全文；`lundgard2021-four-level.txt`
- [Albusays, Ludi & Huenerfauth 2017, Interviews and Observation of Blind Software Developers at Work to Understand Code Navigation Challenges](https://doi.org/10.1145/3132525.3132550)（ASSETS）— 一手；全文；`albusays2017-blind-devs.txt`
- [Mealin & Murphy-Hill 2012, An Exploratory Study of Blind Software Developers](https://ciigar.csc.ncsu.edu/files/bib/Mealin2012-BlindDevelopers.pdf)（VL/HCC）— 一手；全文落地、讀摘要；`mealin2012-blind-devs.md`
- [Gernsbacher 2015, Video Captions Benefit Everyone](https://doi.org/10.1177/2372732215602130)（Policy Insights from the Behavioral and Brain Sciences）— 敘事回顧；全文；`gernsbacher2015-captions.txt`
- [Google, Tech Writing for Accessibility](https://developers.google.com/tech-writing/accessibility)、[Write the Docs, Accessibility guidelines](https://www.writethedocs.org/guide/writing/accessibility/)— 實務；總覽頁；`google-tw-accessibility.md`、`wtd-accessibility.txt`

### 子問題 5

- [Guo 2018, Non-Native English Speakers Learning Computer Programming: Barriers, Desires, and Design Opportunities](https://doi.org/10.1145/3173574.3173970)（CHI）— 一手問卷；全文；`guo2018-nonnative.txt`
- [Dasgupta & Hill 2017, Learning to Code in Localized Programming Languages](https://doi.org/10.1145/3051457.3051464)（L@S）— 一手觀察研究；全文；`dasgupta-hill2017.txt`
- [Karp Gershon, Ruipérez-Valiente & Alexandron 2021, Defining and measuring completion and assessment biases with respect to English language and development status: not all MOOCs are equal](https://doi.org/10.1186/s41239-021-00275-w)（IJ Educ. Technol. High. Educ. 18, 41）— 一手；全文落地、讀摘要；`mooc-english-bias2021.md`
- [Gong, Goldshtein, Xu, Arner, Roscoe & McNamara 2025, L2 English and Culture as Factors in College Math Achievement](https://doi.org/10.1145/3698205.3733957)（L@S 2025, pp. 381–386）— 一手；**摘要**；`l2-english-math2025.txt`
- [Kwak, Dunder, Viberg & Pardos 2025, Adaptive Tutoring Goes to Sweden: Machine Translation and Alignment of English OERs to a Swedish Calculus Course](https://doi.org/10.1145/3698205.3729549)（L@S 2025, pp. 50–61）— 個案；**摘要**；`sweden-mt-oer2025.txt`
- [Lee, Rose, Macaro & Lee 2025, Effectiveness of EMI in higher education: A multi-level meta-analysis](https://doi.org/10.1016/j.system.2025.103755)（System）— 一手統合分析；**摘要（被截斷）**；`emi-meta2025.txt`
- [Montero Perez, Van Den Noortgate & Desmet 2013, Captioned video for L2 listening and vocabulary learning: A meta-analysis](https://doi.org/10.1016/j.system.2013.07.013)（System；DOI 已用 Crossref 核對，無誤）— 一手統合分析；全文落地、讀摘要；`montero-perez2013.txt`
- [Reynolds, Cui, Kao & Thomas 2022, Vocabulary Acquisition through Viewing Captioned and Subtitled Video: A Scoping Review and Meta-Analysis](https://www.mdpi.com/2079-8954/10/5/133)（Systems）— 一手；全文落地、讀摘要；`ucl2022-vocab-captions-scoping.txt`
- [Kurokawa, Hein & Uchihara, Incidental Vocabulary Acquisition Through Captioned Viewing: A Meta-Analysis](https://doi.org/10.1111/lang.12697)（Language Learning 75(4), 939–987；線上發表 2024、卷期 2025；作者已用 Crossref 核對）— 一手統合分析；全文落地、讀摘要；`captioned-viewing-meta2024.txt`
- [Pannatier & Bétrancourt 2024, Learning from academic video with subtitles: When foreign language proficiency matters](https://doi.org/10.1016/j.learninstruc.2023.101863)（Learning and Instruction）— 一手實驗；全文；`subtitles-proficiency2024.txt`
- [Liao, Kruger & Doherty 2020, The impact of monolingual and bilingual subtitles on visual attention, cognitive load, and comprehension](https://doi.org/10.26034/cm.jostrans.2020.549)（The Journal of Specialised Translation 第 33 期；DOI 已用 Crossref 核對）— 一手；全文落地、讀摘要；`liao2020-bilingual-subs.txt`
- [Wang & Pellicer-Sánchez 2023, Examining the effectiveness of bilingual subtitles for comprehension: An eye-tracking study](https://doi.org/10.1017/S0272263122000493)（SSLA）— 一手；**摘要**；`wang-pellicer2023-bilingual.txt`
- [Kizilcec & Cohen 2017, Eight-minute self-regulation intervention raises educational attainment at scale in individualist but not collectivist cultures](https://doi.org/10.1073/pnas.1611898114)（PNAS）— 一手隨機實驗；全文落地、讀摘要；`kizilcec-cohen2017-pnas.md`
- [Kizilcec, Saltarelli, Reich & Cohen 2017, Closing global achievement gaps in MOOCs](https://doi.org/10.1126/science.aag2063)（Science）— 一手；全文落地（兩頁，欄位交錯難讀）、只確認研究設計；`kizilcec2017-science.txt`
- [Chatterjee et al. 2024, Debugging for Inclusivity in Online CS Courseware: Does it Work?](https://web.engr.oregonstate.edu/~burnett/Reprints/icer24-debuggingCourseware-chatterjee.pdf)（ICER）— 一手；全文落地、讀摘要與結論；`chatterjee2024-inclusivity-courseware.txt`
- [Lin, Lin, Zhang & Ginns 2024, The Personalized Learning by Interest Effect on Interest, Cognitive Load, Retention, and Transfer: A Meta-Analysis](https://doi.org/10.1007/s10648-024-09933-7)（Educ. Psychol. Rev. 36, 88）— 一手統合分析；**摘要**；`personalization-meta2024.md`

### 子問題 6

- [Delgado, Vargas, Ackerman & Salmerón 2018, Don't throw away your printed books](https://doi.org/10.1016/j.edurev.2018.09.003)（Educ. Res. Rev.）— 一手統合分析；全文；`delgado2018.md`
- [Salmerón, Altamura, Delgado, Karagiorgi & Vargas 2024, Reading comprehension on handheld devices versus on paper](https://doi.org/10.1037/edu0000830)（J. Educ. Psychol.，作者後印本）— 一手統合分析；全文落地、讀摘要與一段；`salmeron2024-handheld.md`
- [Clinton-Lisell & Litzinger 2026, Decoding digital reading: a network meta-analysis of comprehension across devices](https://doi.org/10.1007/s10639-025-13843-8)（Education and Information Technologies）— 一手網絡統合分析；全文；`clinton-lisell2026-network.md`
- [Honma et al. 2022, Reading on a smartphone affects sigh generation, brain activity, and comprehension](https://doi.org/10.1038/s41598-022-05605-0)（Scientific Reports）— 一手實驗；全文；`honma2022-smartphone.txt`
- [Alex Russell 2025, The Performance Inequality Gap, 2026](https://infrequently.org/2025/11/performance-inequality-gap-2026/)— 實務年度分析（B 級）；全文；`russell2026-perf-gap.txt`
- [HTTP Archive, Web Almanac 2025: Page Weight](https://almanac.httparchive.org/en/2025/page-weight)— 一手量測；全文落地、讀一段；`almanac2025-page-weight.txt`
- [Anywhere and anytime? An analysis of the use of mobile devices in MOOCs 2017](https://research.chalmers.se/en/publication/501732)— 一手；**摘要**；`chalmers-mobile-mooc.txt`

---

## 讀取完整度盤點

統計：來源清單列了 78 個來源，其中 ✅ 61（當中 9 筆全文在磁碟上但只讀了摘要，列在下方）、🟡 17；另有 🔴 12 筆沒有讀到、不在來源清單內。合計 90。（✅ 的定義見開頭第 1 點。）

### 🟡 部分或摘要（17）

| 來源 | 讀到什麼程度 | 阻礙 | 擋住還是沒去拿 |
|---|---|---|---|
| Chen et al. 2018（CSCL 統合分析） | 摘要全文 | Sage 頁面標 Restricted access；OU 典藏的 PDF 連結回 403 | 擋住 |
| Nokes-Malach et al. 2015 | 摘要 | Springer 付費牆 | 擋住（沒找作者自存版） |
| Kobayashi 2024 | 摘要 | Springer 付費牆 | 擋住 |
| Boysen 2024（UDL 證據分析） | 摘要 | Sage Restricted；Exa 逾時、Tavily 回空、Wayback 404 | 擋住。這是排除面最關鍵的批評來源，只到摘要是本 note 最大的弱點 |
| Boysen（UDL 與學習風格） | 摘要 | Ovid 付費牆 | 擋住 |
| King-Sears et al. 2023 | 摘要＋section snippets 的開頭 | ScienceDirect 付費牆 | 擋住；五個顯著調節變項是哪五個沒讀到 |
| Wise & Cui 2018 | 摘要前半（頁面截斷在「15% of course learners contributed to the…」） | ACM 頁面抓到的文字不完整 | **半是我沒去拿**：頁面標 FREE ACCESS，PDF 應該拿得到，沒有再試 |
| Assess or Discuss（L@S 2025） | 摘要大半 | ACM 全文未取 | 沒去拿 |
| Do MOOC Conversations Matter?（L@S 2025） | NSF PAR 的摘要 | PAR 有全文 PDF 連結，沒下載 | **沒去拿** |
| L2 English and Culture（L@S 2025） | 摘要 | 同上 | 沒去拿 |
| Adaptive Tutoring Goes to Sweden（L@S 2025） | 摘要 | 同上；KTH DiVA 有紀錄 | 沒去拿 |
| Discord 經驗報告（SIGCSE 2022） | 摘要 | OpenAlex 標 closed | 擋住 |
| Davis et al. 2018 | 摘要前段 | TU Delft 典藏頁有 PDF，沒下載成功（頁面只給預覽） | 半擋半沒拿 |
| Lee, Rose, Macaro & Lee 2025（EMI） | 摘要前半（截在「although we acknowledge that this finding doe…」） | ScienceDirect 付費牆；Oxford ORA 只有紀錄頁 | 擋住；**組間比較的結果沒讀到，不能引用它下結論** |
| Wang & Pellicer-Sánchez 2023 | 摘要 | Cambridge「Get access」；UCL Discovery 的 PDF 路徑我猜錯回 404 | **沒去拿**（UCL 典藏應有作者稿） |
| Personalized Learning by Interest 統合分析 2024 | 摘要 | Springer 付費牆 | 擋住 |
| Chalmers 2017（MOOC 行動裝置） | 摘要前段 | 沒找全文 | 沒去拿 |

另外有 9 筆列在 ✅ 但實際只讀了摘要、全文在磁碟上：`metacog-collab2024`、`mooc-study-group-fb2022`、`mooc-structural-limits`、`delrio-chanona2024-so`、`nestojko2014`、`edublogs2021`、`frontiers2022-social-annotation`、`mealin2012-blind-devs`、`mooc-english-bias2021`。用到它們的地方只引摘要層級的陳述。

### 🔴 未讀（12）

| 來源 | 阻礙 | 擋住還是沒去拿 |
|---|---|---|
| Jeong, Hmelo-Silver & Jo 2019（CSCL in STEM 統合分析） | ScienceDirect captcha，Jina 與第二瀏覽器各試一次都被擋 | 擋住 |
| Marion & Thorley 2016（協作抑制統合分析） | JCU 典藏回 403／401 | 擋住；用 Luo 2024 代替 |
| Balta et al. 2017（Peer Instruction 統合分析） | ScienceDirect 付費牆 | 只看到搜尋摘要，**不引用** |
| Crouch & Mazur 2001、Smith et al. 2009 | 沒去找 | **沒去拿**；數字全部轉引自 Vickrey 2015 與 Tullis & Goldstone 2020 |
| Chi, Roy & Hausmann 2008 | Wiley／OpenAlex 標 closed | 沒找作者自存版；內容轉引自 Chi 2017 與 Qian, Hong & Chi 2024 |
| Fiorella & Mayer 2013、Muller et al. 2008 | closed | 沒去拿；轉引自 Lachner 2022、Chi 2017 |
| Reich & Ruipérez-Valiente 2019（The MOOC Pivot） | MIT DSpace 回 429，Wayback 404 | 擋住；**本 note 不引它的數字** |
| Hansen & Reich 2015 | Harvard DASH 回 429 | 擋住；不引 |
| Altamura, Vargas & Salmerón 2023（休閒數位閱讀） | Valencia 典藏的 Anubis 驗證 | 擋住；同一個典藏的另兩篇用 Jina 拿到了，這篇沒重試 → **半是沒去拿** |
| Clinton 2019（螢幕對紙本統合分析） | Wiley 導頁錯誤 | 擋住一次，沒重試 |
| Ford et al. 2016（Stack Overflow 的女性參與障礙） | 作者頁寫「This article is no longer available」 | 擋住；不引 |
| knowledge building／argumentation 一手文獻 | 沒搜 | **沒去拿**，整個方向是空的 |
| 華藝上的台灣字幕與同儕教導研究 | 只有書目頁 | **沒去拿** |

（最後兩列是方向，不是單篇；計數時各算 1。）

---

## 事實交叉表

只放來源說了什麼。「驗證狀態」欄：✅ = 兩個以上獨立來源一致，或單一權威一手的窄事實；⚠️ = 單一來源、摘要層級或轉引；❌ = 來源互相衝突。

### 子問題 1：一起學 vs 獨自學

| # | 事實（連同對照條件） | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 1.1 | 425 篇 2000–2016 的實證研究：在電腦輔助的學習情境裡，有協作比沒協作，知識獲得 ES = 0.42、技能 0.64、學生感受 0.38 | Chen 2018 摘要 | Radkowitsch 2020 引 Chen 2018 與 Jeong 2019，方向一致 | ⚠️ 數字只有摘要層級；受試者組成、是否隨機分派沒讀到 |
| 1.2 | 62 篇論文、71 個研究、7,103 名 4–18 歲受試者：同儕互動比其他學習條件 Hedges' g = 0.40，95% CI [0.27, 0.54]；逐一剔除研究後 g 介於 0.37–0.42 | Tenenbaum 2020 摘要與敏感度分析段 | — | ✅ 單一一手的窄事實 |
| 1.3 | 同一份統合分析：同儕互動**不比**兒童與成人一對一互動有效；任務要求達成共識時效果較大 | Tenenbaum 2020 摘要 | — | ✅（單一一手） |
| 1.4 | 同一份統合分析引述 To (2015)：同一任務下，分組做與獨自做沒有顯著差異；立即後測的差異可能很小 | Tenenbaum 2020 正文 | — | ⚠️ 轉引 |
| 1.5 | 53 篇實驗、5,616 名學習者（K-12、高教、在職）：有協作腳本的 CSCL 比沒有引導的協作，領域知識 g = 0.24、協作技能 g = 0.72、動機 g = 0.13（不顯著）；腳本對回憶測驗的效果大於知識應用測驗；只提示一種協作活動的效果傾向大於同時提示兩三種 | Radkowitsch 2020 摘要與討論 | 該文自述與 Vogel 2017 的結果一致 | ✅ |
| 1.6 | 協作有交易成本（溝通、協調）；任務夠複雜才值得付這個成本；成員先備知識差異沒被辨識、彼此又沒合作過時，協調活動成為外在認知負荷，學習受損 | Kirschner 2018 | Nokes-Malach 2015 摘要：問題是協作「何時、如何」有益，不是「是否」 | ✅（理論主張，兩個獨立團隊同向） |
| 1.7 | 協作抑制：一起回憶的小組，回憶量低於同樣人數各自回憶再合併的名義小組，Cohen's d = 0.54（95% CI 0.49–0.58）；同時存在兩個好處：錯誤修剪與協作後的個人回憶提升 | Luo 2024 | 搜尋摘要顯示 Marion & Thorley 2016 同向（未讀） | ✅ 已回原文〈3.1 Main Pooled Results〉核對；同文的 trim-and-fill 校正後為 0.40（95% CI 0.33–0.51）。Marion & Thorley 未讀 |
| 1.8 | Peer Instruction 的流程：出概念題→各自作答→與鄰座討論→再作答→教師講解；討論後答錯改對的比例遠高於答對改錯：物理 59% 對 13%（Crouch & Mazur 2001），另一研究 41% 對 18%（Morgan & Wakefield 2012），生理學 57% 對 7% | Tullis & Goldstone 2020 轉述 | Vickrey 2015 轉述同一批研究 | ✅ 兩篇回顧一致；原始研究未讀 |
| 1.9 | 6 個班、208 名大學生、86 題：討論後答對的勝算是討論前的 1.57 倍（95% CI 1.31–1.87）；原本答對的人比答錯的人更傾向維持答案，這個差異只有部分能由信心解釋 | Tullis & Goldstone 2020 | — | ✅ 單一一手 |
| 1.10 | 討論的效益不只是抄答對的人：Smith et al. 2009（遺傳學，n = 350，16 組同構題）在討論後換一題同概念的新題，表現仍提升；計算機科學兩門課重現同樣趨勢（Porter et al. 2011）| Vickrey 2015 轉述 | Tullis & Goldstone 2020 轉述 | ✅ 兩篇回顧一致；原始研究未讀 |
| 1.11 | 首次作答正確率在 35–70% 之間時，同儕討論的收穫最大；低於 35% 時概念可能需要先補充 | Vickrey 2015 轉述 Crouch & Mazur 2001 | — | ⚠️ 轉引 |
| 1.12 | 學生普遍相信協作有益，卻偏好獨自讀書，理由是減少分心與提高個人責任感 | PMC11591187 摘要 | — | ⚠️ 單一問卷、摘要層級 |

### 子問題 2：線上自學的社群功能

| # | 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 2.1 | edX 一門課、1,101 人的實地實驗：使用論壇與成績、留存正相關；加上聲望制度後回覆更快、回覆數更多，但對成績、留存、主觀社群感**沒有顯著影響**；67% 的論壇訪客同意參與實驗，作者自陳有自我選擇偏誤，且論壇與成績的相關「難以解讀」 | Coetzee 2014 | — | ✅ 單一一手 |
| 2.2 | 2.5 年、約 25 萬名學生、247 門 Harvard／MIT／Stanford 線上課程：預先註冊的行為科學介入沒有出現先前研究的中到大效果；自我調節類介入提高前幾週的參與，但沒有提高最終完成率；價值關聯介入只在本來就有全球落差的課程裡提高開發中國家學習者的完成率；計畫介入的效果在第二年沒有重現 | Kizilcec 2020 | — | ✅ 單一一手（預註冊） |
| 2.3 | 一門統計 MOOC：把論壇貼文分成與課程內容相關和無關兩類來看它和成績的關係；15% 的學習者有在論壇貢獻 | Wise & Cui 2018 摘要前半 | — | ⚠️ 摘要被截斷，**結論句沒讀到**，不能寫「內容相關的貼文才預測成績」，雖然標題這樣暗示 |
| 2.4 | 一門大型線上 CS 碩士課、N = 1,451、五年：同時做同儕互評與討論的人、以及主要做互評的人，成績顯著高於主要做討論的人與很少參與的人；主要做討論的人又高於很少參與的人 | Assess or Discuss（L@S 2025）摘要 | — | ⚠️ 摘要層級；依參與行為事後分組，不是隨機分派 |
| 2.5 | MOOC 論壇裡的社會臨場感與課程關鍵詞使用，和課程內成就正相關，和修課後的職涯進展**沒有顯著關係** | Do MOOC Conversations Matter?（L@S 2025）摘要 | — | ⚠️ 摘要層級 |
| 2.6 | MOOC 中社會互動的系統性回顧：互動分三類（論壇、學習小組、一對一同儕），結論是對學習成果有正面效果，但作者自己寫「需要更多實驗研究來支持因果」 | Frontiers 2024 | — | ✅ 單一回顧的自述 |
| 2.7 | 一門商業策略 MOOC 的兩梯次：論壇的顯著互動網路是模組化的，資訊擴散受限，不是全球性的知識交流 | Gillani 2014 摘要 | — | ⚠️ 摘要層級 |
| 2.8 | 自發的同地 MOOC 讀書會：各組會固定在某一種觀看風格；暫停與重播的頻率和組內同步程度強相關；同步的組自評的小組學習經驗較好。**量的是自評經驗，不是學習成效** | Li 2014 | — | ✅ 單一一手 |
| 2.9 | 40 名程式設計者用 Stack Overflow 除錯：找到相關貼文的成功率隨錯誤類型而異（IndentationError 73%、AttributeError 70%）；每次查詢查看的貼文數與 Python 年資弱正相關（r = 0.32） | Weimer 2022 | — | ✅ 單一一手；我沒讀到新手與專家成功率的整體對比 |
| 2.10 | ChatGPT 發布後六個月內，Stack Overflow 的活動量相對於俄文、中文的對應站與數學論壇下降 25%；作者認為這是下限；貼文品質沒有顯著變化，資深與資淺使用者同樣減少 | del Rio-Chanona 2024 摘要 | — | ✅ 單一一手 |
| 2.11 | 遠距軟體工程課把求助管道從實體 office hours＋Piazza 換成全天候 Discord，師生互動量明顯增加；求助高峰在晚上 7 點到午夜與截止日前。**沒有量學習成效** | Discord 經驗報告摘要 | — | ⚠️ 摘要層級 |
| 2.12 | Ruzuku 平台 27,156 門課、1,316,272 筆註冊：排定梯次的課完成率 53.4%，開放自學的 41.9%；11–25 人的梯次 65.2%；開啟課內討論的 50.9% 對未開啟 37.3%。廠商自己寫明「Observational, not causal」，也寫明不能和 MOOC 的完成率比較 | Ruzuku | — | ⚠️ 廠商自家資料，付費課程，母群與公開自學內容不同 |
| 2.13 | 中國大學 MOOC 平台官方數據（截至 2019）：課程通過率 1.5%，通過率 10% 以上的課程不到 10% | 清華 钱静 | — | ⚠️ 二手轉述，未回到平台原始資料 |

### 子問題 3：沒有別人在場時的社會效果

| # | 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 3.1 | 預期要教（之後沒有真的教）比沒有這個預期的學習，k = 28，g = 0.35（95% CI 0.27–0.44），異質性高（I² = 76%）；預期要教再加上實際教，k = 16，g = 0.56（95% CI 0.52–0.61，I² = 93%） | Kobayashi 2019 統合分析 | 小林 2019（靜岡）再分析：g = 0.35（95% CI 0.27–0.43，I² = 74%） | ✅（兩篇同一作者，後者是前者加新研究的再分析，**不算獨立**） |
| 3.2 | 預期面對面教（g = 0.50，k = 10）大於預期間接教（寫說明、錄影片；g = 0.27，k = 18）；實際面對面教 g = 0.84，間接教且事先有預期 g = 0.48，間接教但事先沒有預期 g = 0.23 | Kobayashi 2019 interactivity | Kobayashi 2019 統合分析的互動／非互動分組數字相同（0.84、0.48） | ✅（同一作者） |
| 3.3 | 39 篇研究：先讀再教，整體 g = 0.27；**有教學預期地讀再教 g = 0.48，沒有教學預期地讀再教 g = −0.02（95% CI −0.14 到 0.11）**；有預期地讀再教，比只有預期地讀，還多 g = 0.38（14 篇） | Kobayashi 2024 摘要 | — | ⚠️ 摘要層級，但數字完整 |
| 3.4 | 日本學生樣本的教學預期效果 g = 0.09，95% CI 含 0；非日本樣本 g = 0.40；兩者差異顯著。作者指出日本研究裡六組中有五組是間接教學預期，這個混淆沒有排除 | 小林 2019（靜岡，日文） | — | ✅ 單一一手，作者自陳混淆 |
| 3.5 | 對不在場、甚至虛構的對象講解（non-interactive teaching）也能產生教學效果，但「近年有數篇研究沒有重現」；口說講解優於書寫講解（一篇：轉移題 d = 0.32）；直接比較錄音與錄影的兩篇研究沒有差異；一篇實地實驗裡自我解釋勝過對虛構同儕寫說明，在實驗室裡兩者都不比提取練習或控制組好 | Lachner 2022 | Ribosa & Duran 2022 轉述 Lachner 2021 累積統合分析：含口說與書寫的非互動教學 g = 0.22 | ✅ |
| 3.6 | 23 篇論文、62 個比較：替別人製作教材的學生，學習效果 SMD = 0.17；做影音與圖像教材優於做文字教材；製作時不能看原始資料優於可以全程看；對照組是「本來就有效的活動」時效果不顯著 | Ribosa & Duran 2022 | — | ✅ 單一一手 |
| 3.7 | 兩個實驗：以為之後要教別人而讀文章的人，自由回憶更完整、更有組織，主旨題答對較多；實際上沒有人去教 | Nestojko 2014 摘要 | Kobayashi 2019 納入此研究 | ✅ |
| 3.8 | 知識建構與後設認知兩個解釋有一些支持證據；動機、說明生成、提取練習三個解釋證據很少或結果分歧 | 小林 2020（日文回顧摘要） | Lachner 2022 同樣把機制列為未決 | ✅ |
| 3.9 | 大學生兩人一組看「家教一對一教學」的對話影片，比看同一位老師講課的獨白影片學得多；深層轉移題上，被教的學生 d = 1.07、旁觀對話的人 d = 1.08，兩者沒有條件差異。**受試者是成對觀看，邊看邊做作業簿** | Chi 2017 | Qian, Hong & Chi 2024 轉述 | ✅ |
| 3.10 | 大型線上大學 STEM 課的兩個課堂研究：看對話影片的後測 69.07 對獨白影片 65.65，F(1,411) = 11.21，η² = 0.03；不論獨自看或一起看都成立；一起看比獨自看整體略高（67.88 對 66.93，η² = 0.01），但在各影片類型內這個差異不顯著。作者強調前提是學生有做生成式活動 | Qian, Hong & Chi 2024 | — | ✅ 單一一手 |
| 3.11 | swyx 的主張：養成「把學習過程的產出公開」的習慣（寫文章、教學、小抄、演講、在 Stack Overflow 問答），不要用按讚數評斷成果；盡力寫對，寫錯了讓網路糾正；特別寫明「避開 Slack 與 Discord 這類圍牆花園，它們不公開」 | swyx | — | ✅ 作者主張，不是實證 |
| 3.12 | 一位技術部落客的自述：原本的留言服務「大家就是不再留言了」，於是拿掉；改用 Webmention「感覺不一樣」；2024 年改用 Giscus 重開，只對當年以後的文章開放 | Camden 2024 | — | ✅ 個案自述 |
| 3.13 | 101 名師培生寫部落格的準實驗：自陳動機與數位素養提升。量的是自陳，不是學習成效 | Edublogs 2021 摘要 | — | ⚠️ 摘要層級 |

### 子問題 4：UDL 與無障礙

| # | 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 4.1 | UDL Guidelines 3.0 於 2024 年 7 月發布；三個原則（Engagement、Representation、Action & Expression）下共 9 條 guideline，原本的 checkpoint 改稱 consideration；新增的重點是把身分納入學習者差異、處理偏見與排除的系統性障礙、強調互依與集體學習、用學習者為主詞的語言 | CAST〈About the Guidelines 3.0 Update〉 | CAST 首頁的準則結構 | ✅ 官方 |
| 4.2 | CAST 自述 UDL 的研究基礎分三類；三個原則「立基於現代神經科學」，對應情意、辨識、策略三個腦網路；3.0 擴充的研究來自障礙研究、融合教育、資產取向教學法；先前版本的文獻「主要是量化研究、集中在 K-12」 | CAST〈Research Evidence〉 | — | ✅ 官方自述 |
| 4.3 | Boysen 抽樣檢視 CAST 網站列為三條 guideline 佐證的實證研究：多數研究沒有給學習者選擇、也沒有量學習；沒有任何一篇與腦功能有關；這些研究多半支持的是單一的有效教學技巧，不是「提供多種方式讓人選」；結論是佐證薄弱 | Boysen 2024 摘要 | — | ⚠️ 摘要層級；抽了幾篇、比例多少沒讀到 |
| 4.4 | Boysen 另一篇主張 UDL 與學習風格在理論、操作化、研究上有令人不安的相似處：「沒有強的研究證據顯示兩者任何一個能提高學習」，兩者都假設把教學配合個人獨特的學習方式會學得更好，都過度推論神經科學 | Boysen（STLP）摘要 | — | ⚠️ 摘要層級 |
| 4.5 | 20 篇有實驗組／對照組設計的研究、50 個效果量，幼兒園前到成人：UDL 教學比照常教學，學業成就 g = 0.43；有五個顯著調節變項 | King-Sears 2023 摘要 | — | ⚠️ 摘要層級 |
| 4.6 | 13 篇 2015–2021 的研究（英文與阿拉伯文）：合併效果量 Hedges' g = 3.56（95% CI 1.03–6.08），個別研究從 0.33 到 13.18，I² = 99.8%；納入的研究「主要是單組前後測設計」 | Almeqdad 2023 | — | ✅ 單一一手 |
| 4.7 | 4.5 與 4.6 對同一個問題給出 0.43 與 3.56 | King-Sears 2023 | Almeqdad 2023 | ❌ conflict。兩者納入條件不同（前者只收有對照組的設計，後者大半是單組前後測）。不選邊，見推論表 |
| 4.8 | WCAG 2.2 的相關條文：1.1.1 非文字內容要有文字替代（A）；1.2.2 預錄影音要有字幕（A）；1.4.1 不能只靠顏色傳達資訊（A）；1.4.3 文字對比至少 4.5:1，大字 3:1（AA）；1.4.4 文字放大到 200% 不失內容或功能（AA）；1.4.10 在 320 CSS px 寬度下不需雙向捲動，需要二維版面才能理解的內容除外（AA）；3.1.2 段落語言可由程式判定（AA）；3.1.5 閱讀程度超過國中時提供補充內容（AAA） | WCAG 2.2 | — | ✅ 官方規格。第二輪（2026-10-14）已逐條對 `q5-social/wcag22.md` 的原文核對八條的等級與條文，全部無誤，沒有需要更正的地方；補一個細節：1.4.10 對橫向捲動的內容另有「高度 256 CSS px」的對應要求 |
| 4.9 | 圖表、流程圖、地圖這類複雜圖片需要兩段式文字替代：短描述指出這是什麼圖與長描述在哪裡，長描述用文字呈現圖傳達的必要資訊 | W3C WAI Complex Images | — | ✅ 官方 |
| 4.10 | 2026 年 2 月掃描前一百萬個網站首頁：95.9% 有可自動偵測的 WCAG 2 失敗（2025 年是 94.8%，連六年小幅改善後反轉）；低對比文字 83.9%、圖片缺替代文字 53.1%、表單缺標籤 51%、空連結 46.3%、空按鈕 30.6%、缺文件語言 13.5%；這六類佔所有偵測到的錯誤的 96% | WebAIM Million 2026 | — | ✅ 單一一手量測 |
| 4.11 | 1,539 位螢幕閱讀器使用者：在長網頁找資訊時 71.6% 先用標題導覽，13.6% 用尋找功能，6.4% 從頭讀；進階使用者 78% 用標題、初學者 47%；88.8% 認為標題層級有用；91.3% 在行動裝置上用螢幕閱讀器；最困擾的項目第一名是 CAPTCHA | WebAIM SR Survey #10 | — | ✅ 單一一手問卷 |
| 4.12 | 36 名螢幕閱讀器使用者對 36 名非使用者：前者從線上資料視覺化取得資訊的正確率低 61.48%，花的時間多 210.96% | Sharif 2021 摘要 | — | ✅ 單一一手；任務細節沒讀 |
| 4.13 | 圖表文字描述的四層語意：（1）圖的構成元素與編碼（2）統計量與關係（3）知覺與認知現象，如趨勢與模式（4）領域脈絡的洞見；30 名盲人讀者與 90 名明眼讀者對哪一層最有用的排序顯著不同；盲人讀者一致把第 2、3 層排最有用 | Lundgard & Satyanarayan 2021 | — | ✅ 單一一手 |
| 4.14 | 觀察 28 名盲人程式設計者：IDE 用縮排、顏色等視覺手段表達程式結構，螢幕閱讀器難以傳達；先前 69 人的問卷裡，在程式碼中移動與理解結構是首要困擾 | Albusays 2017 | Mealin & Murphy-Hill 2012（8 人訪談）：用螢幕閱讀器查資料是寫程式時的難處之一 | ✅ |
| 4.15 | Gernsbacher 的回顧：超過 100 篇實證研究顯示字幕改善對影片的理解、注意與記憶，對以非母語觀看者、學習閱讀者、聽障者尤其有益 | Gernsbacher 2015 | — | ⚠️ 敘事回顧，沒有合併效果量；見 5.6–5.8 的衝突 |

### 子問題 5：語言與文化

| # | 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 5.1 | 840 份問卷、86 國、74 種母語（來自一個程式教學網站的使用者）：非英語母語者在讀教材、技術溝通、讀寫程式碼、同時學英文與程式上遇到障礙；他們希望教材用簡化的英文、不用特定文化的俚語、多用視覺與多媒體、程式範例不依賴特定文化、內嵌字典 | Guo 2018 | — | ✅ 單一一手；自選樣本的自陳 |
| 5.2 | 同一篇在前言轉述：翻譯版存在，但人們常覺得品質較差、不如英文原版方便 | Guo 2018 引前人研究 | — | ⚠️ 轉引 |
| 5.3 | Scratch 五國、超過 15,000 名新手：介面與程式關鍵詞在地化成母語的使用者，展現新程式概念的速度快於同國用英文介面的使用者；作者自己寫差距小（模型估計的積木種類數約 37.9 對 37.1）且有效度威脅 | Dasgupta & Hill 2017 | — | ✅ 單一一手，觀察研究，使用者自選介面語言 |
| 5.4 | MITx 120 門課、158 個梯次、280 萬筆註冊（2013–2018）：開發中國家的學習者較不容易完成，但**沒有找到非英語母語本身有負面效果的證據**；偏誤的大小因課而異 | MITx 2021 摘要 | — | ✅ 單一一手 |
| 5.5 | 某美國大學的機構資料：中國籍國際生（先前用中文學數學）、印度籍國際生、美國學生相比，語言障礙沒有妨礙國際生的數學成就 | L2 English and Culture（L@S 2025）摘要 | — | ⚠️ 摘要層級；已入學的國際生是高度篩選過的樣本 |
| 5.6 | 第二語言影片加同語言字幕：對聽力理解與字彙學習都是大效果（18 篇研究）；程度沒有調節效果 | Montero Perez 2013 摘要 | Language Learning 2024：49 篇、89 個效果量，對附帶字彙學習 g = 0.56；Reynolds 2022：34 篇，任何字幕都有正面效果，同語言字幕最大 | ✅ 三份統合分析同向。**量的是語言學習（聽力、字彙），不是學科內容** |
| 5.7 | 用外語看學術教學影片：開不開字幕、字幕用哪種語言，都**沒有影響內容學習**，也不影響認知負荷與情境興趣；語言程度影響理解；任何語言的字幕都不能彌補語言程度不足 | Pannatier & Bétrancourt 2024 | — | ✅ 單一一手；樣本數沒讀到 |
| 5.8 | 5.6／4.15 與 5.7 | Gernsbacher 2015、三份統合分析 | Pannatier & Bétrancourt 2024；該文轉述 Lee & Mayer 2018 在韓國大學生身上有小效果（d = 0.33） | ❌ conflict（表面上）。量的東西不同：前者多為語言成果與一般理解，後者是學術內容的學習。不選邊 |
| 5.9 | 112 名中國英語學習者看英文紀錄片：雙語字幕的理解成績與母語字幕相當，兩者都高於英文字幕與無字幕；看雙語字幕時處理母語那一行的時間顯著多於英文那一行 | Wang & Pellicer-Sánchez 2023 摘要 | Liao 2020（20 名中文母語者）：雙語字幕沒有比單語字幕增加認知負荷，也沒有增加理解 | ✅ 兩篇方向相容；樣本小 |
| 5.10 | 英語授課（EMI）統合分析：28 篇、41 個樣本、8,747 人；組內前後測顯示學科知識進步 d = 1.57 | Lee et al. 2025 摘要前半 | — | ⚠️ 摘要被截斷，**EMI 對母語授課的組間比較沒讀到**，這個數字不能用來說 EMI 有效 |
| 5.11 | 兩個隨機實驗、n = 17,963 的線上課程學習者：八分鐘的心智對比加執行意圖（MCII）寫作活動，讓個人主義文化的學習者完成率相對提高 32%（第一個實驗）與 15%（第二個），集體主義文化的學習者沒有受影響 | Kizilcec & Cohen 2017 | Kizilcec 2020：規模化後，MCII 沒有提高個人主義國家學生的完成率（第二年 β = 0.25 個百分點，P = 0.662） | ❌ conflict：同一研究群，原始研究有效、三年後的大規模重複沒有效 |
| 5.12 | 2017 年的兩個實驗主張價值肯定與歸屬感的簡短寫作活動能縮小開發中國家學習者的完成率落差；課程多以英語、北美內容為主，可能引發社會身分威脅 | Kizilcec 2017（只確認了研究設計與主張，數字沒讀出來） | Kizilcec 2020：價值關聯介入在所有課程合計時沒有提高開發中國家學習者的完成率（第一年 β = 0.14 個百分點，P = 0.764），只在本來就有全球落差的課程裡有效 | ❌ conflict（部分）：效果縮到特定條件 |
| 5.13 | 依個人興趣調整題目情境的統合分析：34 篇；對興趣 g = 0.55、保留 g = 0.48、轉移 g = 0.36（轉移只有 6 個效果量、n = 375）；準實驗的效果大於實驗；保留的效果因洲而異 | Personalized Learning by Interest 2024 摘要 | — | ⚠️ 摘要層級 |
| 5.14 | 用自動檢測工具找出線上 CS1 教材裡的「包容性缺陷」並由教師修正後，學生遇到的這類缺陷減少 80%；研究者自己寫這不等於證明對少數群體學生的學習有幫助 | Chatterjee 2024 | — | ✅ 單一一手；量的是缺陷數，不是學習成效 |

### 子問題 6：裝置與網路

| # | 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|---|
| 6.1 | 2000–2017 的研究、54 個比較（組間 38、組內 16）、171,055 名受試者，讀同樣的文字：紙本優於螢幕，g = −0.21；限時閱讀時差距更大；說明文或混合文類有差距，純敘事文沒有；差距隨發表年份擴大 | Delgado 2018 | Salmerón 2024、Clinton-Lisell 2026 都把它當先前結果引用 | ✅ |
| 6.2 | 只看手持裝置（多為平板）對紙本：組間 k = 38，g = −0.113；組內 k = 21，g = −0.103；一致、顯著、小。Delgado 2018 與另一份統合分析都沒有發現電腦與手持裝置之間有顯著差異 | Salmerón 2024 | — | ✅ |
| 6.3 | 網絡統合分析、56 篇、79 個效果量：理解成效排序為紙本、平板、電子書閱讀器、電腦、手機。**需要捲動時**紙本明顯較好（g = 0.35–0.48）；**不需要捲動時**紙本與任何數位裝置沒有可靠差異（g = 0.03–0.12）；56 篇中 28 篇沒有報告結果測量的信度 | Clinton-Lisell & Litzinger 2026 | Delgado 2018 有編碼「是否需要捲動」這個變項 | ✅ 單一一手；手機的研究數沒讀到 |
| 6.4 | 34 名日本大學生（平均 20.4 歲）交叉設計讀兩篇小說：紙本的理解分數高於手機（F(1,32) = 26.445，P < 0.0001）；閱讀時間與視距沒有差異；手機閱讀時嘆息較少、前額葉活動較高 | Honma 2022 | — | ✅ 單一一手；小樣本、文類是小說 |
| 6.5 | 6.1 說純敘事文沒有媒介差距；6.4 用敘事文（小說）卻量到差距 | Delgado 2018 | Honma 2022 | ❌ conflict（一個是統合分析的調節結果，一個是 34 人的單一研究）。不選邊 |
| 6.6 | 2025 年 7 月行動版首頁的中位數重量 2,362 KB，十年前（2015 年 7 月）是 845 KB，增加 202.8% | Web Almanac 2025 | Russell 2026 寫行動版中位數頁面 2.6 MiB | ⚠️ 兩個數字不同（2,362 KB 對 2.6 MiB），可能是首頁對全部頁面或取樣月份不同，我沒有釐清 |
| 6.7 | Russell 建議用來模擬第 75 百分位使用者的 2026 測試條件：下行 9 Mbps、上行 3 Mbps、RTT 100 ms，裝置用 Samsung Galaxy A24 4G 等級；意思是有四分之一的裝置與網路比這個差 | Russell 2026 | — | ✅ 作者的建議值，不是量測事實 |
| 6.8 | 沒有找到任何研究直接量「頁面載入慢或頻寬低」對自學內容學習成效的影響 | 我的搜尋（2 組查詢） | — | 缺口，不是事實 |

---

## 我的推論（與上表分開）

| # | 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|---|
| I-1 | 協作的平均好處（g 約 0.4）來自有設計的互動，不是「有別人在場」。對自學者而言，一個沒人主持的留言區不會自動帶來這個效果 | 1.2、1.3（要求共識時較大）、1.5（腳本再加 0.24）、1.6（交易成本）、2.1（聲望制度增加互動量但成績不變） | 這些研究都在有老師、有任務、有時限的情境；自學者自願留言可能本身就是高品質互動。2.1 只是一門課 |
| I-2 | MOOC 論壇參與和成績的正相關，主要是自我選擇，因果證據很弱 | 2.1 作者自陳、2.6 回顧自陳缺實驗、2.2 大規模介入無效、2.5 與職涯無關 | 沒有讀到任何一篇隨機分派「有論壇／沒論壇」的研究；「沒找到因果證據」不等於「沒有因果」。Wise & Cui 2018 與 Davis 2018 沒讀完，可能有我沒看到的實驗 |
| I-3 | 對寫部落格的人自己而言，「寫給別人看」帶來的學習好處是真的，但比流行說法小，而且有條件：要在讀的時候就打算教、最好離開原始資料重寫、口說或影音形式的效果比純文字大 | 3.1–3.3、3.5、3.6 | 實驗裡的「教」是讀完一篇短文後立刻講五分鐘；寫一篇三千字導讀是另一種活動，時間長得多、可以反覆查資料。3.6 的「不能看原始資料較好」如果照搬，會和本站「無來源不寫事實」的規則衝突——兩者要的是不同階段 |
| I-4 | 「learn in public」的學習效果沒有被直接研究過；它的實證支柱是教學預期與非互動教學這兩條線，而這兩條線合起來的效果量約在 0.2–0.5，且在日本樣本上接近零 | 3.2、3.4、3.5、3.11 | 3.4 的日本結果有間接／直接教學的混淆，作者自己也說了；swyx 講的主要是職涯與人脈效果，不是記憶與理解，拿學習實驗去檢驗它不公平 |
| I-5 | 把導讀寫成「有人在問、有人在答」的形式，可能比獨白式講解好一點，但效果小，而且證據全部來自影片 | 3.9、3.10（η² = 0.03） | 沒有任何一篇研究測過文字版的對話體。Chi 2017 的大效果出現在兩人一起看、邊看邊做題的條件，Qian, Hong & Chi 2024 在真實課程裡只剩 3.4 分的差距 |
| I-6 | UDL 作為「檢查清單」是有用的提醒，作為「有實證的教學法」則證據不足；真正有獨立證據的是它底下的個別做法（字幕、文字替代、清楚的標題結構），不是「提供多種選擇」這個總原則 | 4.3、4.4、4.5、4.6、4.7 | 兩篇批評都出自同一位作者（Boysen），而且我只讀到摘要；King-Sears 2023 的 g = 0.43 來自有對照組的研究，可能比我說的更站得住。我沒有讀 CAST 對這些批評的回應 |
| I-7 | 4.7 的衝突（0.43 對 3.56）最可能的解釋是研究設計：單組前後測會把成熟、練習、教學本身的效果全算進去。3.56 不該被引用為 UDL 的效果量 | 4.6 自述多為單組設計、I² = 99.8%、單篇到 13.18 | 這是我對方法的判斷，不是任何來源說的。King-Sears 的五個調節變項我沒讀到，裡面可能也有設計品質的問題 |
| I-8 | 對一個以文字與 Mermaid 圖為主的技術部落格，無障礙的優先順序應該是：標題層級正確、圖有說明趨勢與關係的文字、程式碼的結構不只靠縮排與顏色、對比足夠 | 4.10（最常見的失敗）、4.11（七成靠標題找資訊）、4.13（盲人讀者要第 2、3 層）、4.14 | 沒有一篇研究是測「螢幕閱讀器使用者讀教學文章學到多少」；4.11 是英語圈自願回覆的問卷。本站的 Mermaid 圖實際被螢幕閱讀器讀成什麼，我沒有測 |
| I-9 | 字幕對「看懂外語教學影片的內容」的幫助，沒有語言學習研究暗示的那麼大；程度不夠的人開字幕也補不回來。所以「依英文字幕寫成中文導讀」做的事（把語言障礙整個拿掉）和「替影片加字幕」不是同一件事，前者可能更有用 | 5.6、5.7、5.8、5.9（看雙語字幕的人主要在讀母語那一行） | 5.7 是單一實驗；沒有任何研究直接比較「母語文字導讀」和「外語影片加字幕」。5.9 支持的是「有母語可讀時人會去讀母語」，推到文章是我的延伸 |
| I-10 | 中英雙語並存（各一篇、互相連結）比同頁雙語對照更合理 | 5.9（雙語字幕的理解不輸母語字幕但也沒有更好；注意力集中在母語行）、WCAG 3.1.2（語言要能由程式判定，分頁較容易做對） | 字幕是限時的、文章不是；想順便學英文的讀者可能正需要對照。沒有讀到任何雙語對照文章的研究 |
| I-11 | 在英語內容的 MOOC 裡，完成率落差比較跟國家發展程度（時間、網路、學歷）有關，比較不是英語程度本身；所以把內容翻成中文解決的是一部分問題 | 5.4、5.5、5.3（在地化有效但很小） | 5.4 的非母語者是「已經選了英文課的人」，英文不夠好的人根本沒進樣本——這正是倖存者偏誤，可能大幅低估語言的排除效果。5.1 的自陳就指向相反方向 |
| I-12 | 簡短的心理介入（歸屬感、價值肯定、依文化調整的計畫活動）不該被當成做內容的人能用的工具 | 5.11、5.12 的重複失敗 | 2.2 也找到了有效的子條件；結論是「效果依情境而定且無法事先預測」，不是「無效」 |
| I-13 | 螢幕對紙本的差距對本站的實際意義是「長頁面需要捲動」這件事，而不是「手機」這個裝置；能做的是讓讀者在長文裡不迷路（穩定的標題、目錄、回到段落的錨點） | 6.3（不需捲動時差距消失）、6.1（說明文、限時才明顯） | 6.3 是單一網絡統合分析，半數研究沒報信度；它比的是「捲動 vs 翻頁」，沒有測過「捲動但有目錄與錨點」。網路文章不可能不捲動，所以這個發現能不能轉成設計建議其實不確定 |
| I-14 | 沒有留言區的個人部落格，在學習上少掉的主要是「作者得不到讀者哪裡卡住的訊號」，而不是「讀者少了彼此討論」 | I-1、I-2（留言區對讀者學習的因果證據弱）、3.12（留言本來就會乾掉）、2.10（公開問答站的活動在萎縮） | 這完全是推論，沒有任何來源比較過有無留言區的教學部落格。讀者之間的討論可能發生在別處（社群貼文、讀書會），那些我沒有查 |

---

## 草稿骨架

建議拆成 **5 篇**。每篇開頭都要放該篇的選案偏誤（受試者多為大學生、教材短、英語圈）。

### 第 A 篇　一個人讀，少了什麼？協作學習的證據與它的條件

- **聚焦問題**：研究說一起學比較好，好多少、在什麼條件下才好；自己讀網路內容的人實際上少掉了哪一塊。
- **主要結論與證據強度**
  - 有設計的同儕互動平均帶來中等以下的好處（g 約 0.4）。強度：中上（兩份大型統合分析，但其中一份只到摘要，對象多為在學學生）。
  - 好處取決於互動的結構：要求達成共識、有腳本引導時較大；沒有引導的協作會付出協調成本，簡單任務不值得。強度：中（一份統合分析加理論）。
  - 同儕互動不比一對一成人指導好。強度：中（單一統合分析的調節結果）。
  - 純記憶任務上，一起回憶還會輸給各自回憶（d = 0.54，校正出版偏誤後 0.40）。強度：中（單一統合分析）。
  - Peer Instruction 的機制可以拆出來看：先各自作答、再討論、再作答；討論的收穫在首答正確率中段時最大。強度：中（兩篇回顧一致，原始研究未讀）。
- **與一般印象不同**：學生自己也偏好獨自讀（1.12）；「有人一起」本身不是有效成分。
- **本站案例**：導讀裡的「先自己答、再看解說」題目可以對照 Peer Instruction 的前兩步——一個人做得到「先承諾一個答案」，做不到的是「聽別人為什麼選另一個」。可以檢查 CS50 AI 七週導讀的練習題有沒有放常見錯誤答案的理由（等於把同儕的另一個觀點寫進去）。
- **待補才能寫**：Chen 2018 全文、Jeong 2019、knowledge building 與論證式學習至少各讀一篇一手。

### 第 B 篇　留言區、論壇、Discord：參與了就學得比較好嗎？

- **聚焦問題**：線上自學情境裡，社群功能和學習成果的關係是因果還是自我選擇；一個沒有留言區的部落格損失了什麼。
- **主要結論與證據強度**
  - 參與論壇的人成績與留存較好，這個相關很穩定。強度：高（多個來源）。
  - 因果證據弱：增加互動量的設計（聲望制度）沒有改變成績；大規模預註冊介入沒有提高完成率；論壇參與和修課後的職涯無關。強度：中（各只有一兩篇，但都是反向或零結果，且沒有找到正向的隨機實驗）。
  - 梯次制課程完成率較高的資料來自付費平台的觀察值，廠商自己註明不是因果。強度：低。
  - 公開問答站的活動在 LLM 出現後明顯下降，「公開留下學習痕跡」的地方在變少。強度：中（單一但設計嚴謹的研究）。
  - 留言系統在個人技術部落格上常常自然乾掉。強度：低（個案自述）。
- **與一般印象不同**：「社群是自學成功的關鍵」這句話的證據基本上是相關；最常被引用的梯次制 85% 完成率我沒有找到任何可追的一手來源，找到的是 53.4% 對 41.9%。
- **本站案例**：本站沒有留言區（`src/` 裡沒有任何留言系統）。可以誠實寫：這讓作者拿不到「讀者卡在哪」的訊號，替代來源是獨立審稿（`.work/reviews/2026-10-13-cs50ai-w0*-review.md` 抓到原本六週的參考程式跑不起來或規則寫反——這些錯若有留言區，會不會被讀者抓到是可以討論的反事實）。
- **待補**：Wise & Cui 2018 全文、Davis 2018 全文、Reich & Ruipérez-Valiente 2019、任何一篇隨機分派論壇有無的研究。

### 第 C 篇　寫給別人看，自己學到多少？教學預期、對空氣講解、旁觀對話

- **聚焦問題**：沒有真人互動時，「教別人」的好處剩下多少；這對寫導讀的人和讀導讀的人各代表什麼。
- **主要結論與證據強度**
  - 光是預期要教，就有小到中的效果（g 約 0.35）；真的去教再加一些；面對面比間接（寫、錄）大。強度：中上（統合分析，但全出自同一位研究者）。
  - 沒有預期就去教，效果接近零。強度：中（摘要層級，數字完整）。
  - 對不在場的對象講解的效果不穩，口說優於書寫，替別人做教材的平均效果只有 0.17，和本來就有效的學習活動相比不顯著。強度：中上（一篇回顧、一篇統合分析，彼此獨立）。
  - 日本樣本上教學預期的效果接近零。強度：低到中（單一再分析，有混淆）。
  - 旁觀「別人被教」的對話影片優於獨白影片，實驗室效果大、真實課程效果小。強度：中（兩篇同一研究群）。
- **與一般印象不同**：「教是最好的學」「費曼技巧」在控制良好的研究裡是小到中的效果，而且寫下來比講出來弱；「學習金字塔」裡教別人 90% 的說法這裡完全沒有支持（我沒有另外查它的出處，文章若要提需另查）。
- **本站案例**：本站作者自己就是「替別人做教材」的人。課程導讀依英文字幕與講義寫成中文，寫的時候全程看著原始資料——依 3.6，這是學習效果較小的做法，但它是正確性所必需的。可以誠實寫這個取捨。讀者端：導讀能不能在段落結尾留一個「用自己的話講給不懂的人聽」的提示，對應的是教學預期，不是互動。
- **與既有研究的分界**：自我解釋、生成活動本身由子問題三（q3）與 `.work/teaching-text-research/` 處理，這篇只談「對象是別人」多出來的部分。

### 第 D 篇　誰讀不到這篇文章？無障礙要求與 UDL 的證據

- **聚焦問題**：對一篇技術教學文章，無障礙具體要求什麼；UDL 這個最有名的框架有多少實證。
- **主要結論與證據強度**
  - WCAG 對教學內容的要求是具體可檢查的（文字替代、字幕、對比、放大、320px 重排、不只靠顏色）。強度：高（官方規格）。
  - 網路上最常見的失敗集中在六類，低對比與缺替代文字居首，而且 2026 年變差了。強度：高（年度量測）。
  - 螢幕閱讀器使用者主要靠標題找資訊；讀圖表時正確率與時間都差很多；他們要的圖表描述是統計量與趨勢，不是「這是一張長條圖」。強度：中上（各一篇一手，樣本數十人）。
  - 盲人程式設計者的主要困難是程式結構靠視覺表達。強度：中（兩篇質性研究）。
  - UDL 3.0 是一份涵蓋很廣的設計清單；它的證據受到正式發表的批評（引用的研究多數沒測「選擇」、沒量學習、與腦無關）；統合分析從 0.43 到 3.56，差距來自研究設計。強度：批評的部分低到中（只到摘要、單一作者），「證據品質參差」這一點中。
- **與一般印象不同**：UDL 常被當成「有腦科學根據」，CAST 自己的頁面也這樣寫；被點名的問題正是這一句。另外，「字幕對所有人都有益」是敘事回顧的說法，在學術內容學習上有反例（接第 E 篇）。
- **本站案例**：（1）文章內沒有任何 Markdown 圖片（全站 `![...](` 零筆），圖都是 Mermaid，所以「替代文字」在本站的實際問題是 Mermaid 產生的 SVG 對螢幕閱讀器是什麼——**這件事我沒有測，文章要寫之前必須實測**。（2）`PostLayout.astro` 有依文章設定 `<html lang>`。（3）writing-guide 已有 390px 手機寬度檢查與「節點文字縮到約 8px 讀不了」的實測紀錄，今天的手機圖表調整可以直接對應 WCAG 1.4.10 的二維內容例外與 1.4.4。（4）影片嵌入有要求 `title` 當 iframe 的無障礙名稱。
- **與既有研究的分界**：圖該怎麼畫由 `.work/learning-visualization-research/` 處理；這篇只談看不到圖的人。

### 第 E 篇　語言、翻譯與手機：內容到得了的地方

（如果篇幅過長，手機與網路可以再拆成第 F 篇。）

- **聚焦問題**：非母語讀者讀英文技術內容損失什麼；翻成母語、雙語並陳、加字幕各自有多少證據；在手機上讀長文會不會學得比較差。
- **主要結論與證據強度**
  - 非母語者自陳的障礙很具體：俚語、文化特定的例子、同時學語言和內容。強度：中（單一大樣本問卷，自選樣本）。
  - 介面與關鍵詞在地化和較快的學習有關，但差距小。強度：低到中（觀察研究）。
  - 在已經選修英文課的人裡，非母語身分本身不預測較低的完成率；國家發展程度才預測。強度：中（大型資料，但有嚴重的倖存者偏誤）。
  - 字幕對語言學習有中到大的效果；對用外語學學術內容，單一實驗找不到效果，語言程度才是決定因素。強度：前者高、後者低到中。
  - 有母語可讀時，人主要讀母語那一行；雙語字幕不比母語字幕差，也沒有更好。強度：中（兩篇小樣本眼動研究）。
  - 簡短的文化／歸屬感介入在大規模重複時多數失效。強度：高（預註冊、25 萬人）。
  - 螢幕閱讀的理解略遜於紙本（g 約 −0.1 到 −0.2），差距集中在說明文、限時、需要捲動的情況；不需要捲動時差距消失。強度：中上（三份統合分析）。
  - 行動版網頁十年變成三倍重；有四分之一使用者的網路與裝置比 9 Mbps／中低階 Android 更差。強度：高（量測）；它對學習的影響：沒有證據。
- **與一般印象不同**：「手機讀比較差」拆開來主要是捲動問題；「開字幕就能看懂外語課」沒有支持；「英文不好的人在 MOOC 完成率低」在資料裡看不到，但那是因為英文不好的人不在資料裡。
- **本站案例**：全站 2,699 篇中文、2,698 篇英文，各自獨立成篇、互相連結，不是同頁對照——這和 5.9 的發現相容。課程導讀「依英文字幕寫成中文」是把語言障礙整個移走，不是加字幕；可以寫清楚這和翻譯字幕是不同的事，以及它的代價（讀者接觸不到原文術語——所以術語保留英文是有理由的）。沒有字幕軌時改用 Whisper 轉錄的流程（course-guide-contract 第 62 行）是「無字幕就等於沒有口述內容」這個排除的反例。今天的手機寬度圖表調整對應 6.3 與 WCAG 1.4.10。
- **待補**：翻譯品質（人工、機器、AI）對學習成效的實驗——我一篇都沒找到，文章裡要明說；EMI 統合分析的組間結果；台灣的實證研究。

### 跨篇的取捨總結

社會面與排除面有一個共同的形狀：**最常被引用的大數字都來自條件最好的研究**（實驗室、兩人一組、單組前後測、原始作者的第一個實驗），放到真實的大規模自學情境就縮小或消失（3.9→3.10、5.11→2.2、4.6 對 4.5）。這個形狀本身可以當系列的一條線。

---

## 待解問題

- **Boysen 2024 的全文拿不到**。它是 UDL 批評的核心，目前只有摘要。要寫第 D 篇之前，需要全文（機構權限、向作者索取，或 Boysen 的任教學校典藏）。CAST 或其他學者對 Boysen 的回應我也沒有找。
- **Mermaid 圖對螢幕閱讀器的實際輸出**沒有測。第 D 篇的本站案例整段取決於這個。
- **knowledge building 與論證式學習完全沒做**，任務書有點名。要不要補，還是在文章裡明說不處理？
- **翻譯品質對學習的影響**找不到實驗。是真的沒有，還是我的查詢詞不對（只試了 "machine translation MOOC subtitles learning outcomes experiment" 一組）？
- **頁面載入速度對學習成效**同樣只試了兩組查詢。
- **台灣的研究**：華藝與國圖博碩士論文系統沒有實際進去取全文。
- （已於第二輪解決）4.8 的 WCAG 條文等級已逐條對 `wcag22.md` 核對，無誤。
- 6.6 兩個頁面重量數字的差異（2,362 KB 對 2.6 MiB）沒有釐清。
- （已於第二輪解決大半）第一輪標「未核」的六處書目已用 Crossref／Europe PMC 核對並更正，明細見下方〈第二輪〉的書目更正表。仍未核的只剩 Chalmers 2017 的作者與出處。
- 「學習金字塔」「梯次制 85% 完成率」這兩個流行數字我都沒有追到一手來源；文章若要反駁它們，需要另外查出處。

## 第二輪（2026-10-14）：補取全文、書目更正、補掃描

這一節是追加紀錄。**上面的事實交叉表、推論表、草稿骨架的結論都沒有改**；只有來源清單的書目（作者、DOI、卷期）與 4.8 的核對註記在原處更正。第二輪新落地的原文在 `.research/raw/learning-content/q5/`（第一輪的仍在 `q5-social/`）。

第二輪新拿到全文的來源，我同樣只讀了摘要與用關鍵詞抽出的幾段，**沒有逐頁讀**。

### R2-1 取全文的結果

試過的管道代號：OA = OpenAlex 的 OA 位置（資料來自 Unpaywall；Unpaywall API 本身需要帶 email，我沒有直接呼叫）；S2 = Semantic Scholar `openAccessPdf`；CORE = CORE API v3 標題搜尋（多數回 429／500）；Exa = `web_fetch`，不帶 query，maxCharacters 200,000；PW = playwright-core 第二瀏覽器，先過驗證頁再用同一個 context 下載 PDF；Jina = `r.jina.ai`；curl = 直抓。

**第一輪 🟡 → 現在 ✅ 全文（9）**

| 來源 | 怎麼拿到的 | 檔案 |
|---|---|---|
| Chen, Wang, Kirschner & Tsai 2018 | Exa 抓 OU 典藏的出版社版 PDF（同一個網址 curl 與 PW 都回 403，CORE 的下載連結也回 403） | `chen2018-cscl-meta.exa.txt`（141,570 字元） |
| Wise & Cui 2018 | PW 下載 ACM PDF（頁面標 FREE ACCESS） | `wise-cui2018.pdf` |
| Lee, Rose, Macaro & Lee 2025（EMI） | Oxford ORA 的作者稿，檔案連結是 PW 從紀錄頁找到的，再 curl | `emi-meta2025.pdf` |
| Wang & Pellicer-Sánchez（SSLA） | OA 給的 UCL Discovery 作者稿，curl | `wang-pellicer2023-bilingual.pdf` |
| Ou & Joyner 2025 | PW 下載 ACM PDF | `assess-or-discuss2025.pdf` |
| Mehta et al. 2025 | PW 下載 ACM PDF | `mooc-conversations2025.pdf` |
| Gong et al. 2025 | PW 下載 ACM PDF | `l2-english-math2025.pdf` |
| Kwak, Dunder, Viberg & Pardos 2025 | PW 下載 ACM PDF | `sweden-mt-oer2025.pdf` |
| Bridson, Atkinson & Fleming 2022（Discord） | PW 下載 ACM PDF（OpenAlex 標 closed，實際下載得到） | `discord-sigcse2022.pdf` |

**第一輪 🔴 → 現在 ✅ 全文（4）**

| 來源 | 怎麼拿到的 | 檔案 |
|---|---|---|
| Chi, Roy & Hausmann 2008 | Exa 抓 Wiley 全文頁 | `chi2008.exa.txt`（140,214 字元） |
| Hansen & Reich 2015 | Exa 抓 Harvard DASH 的作者稿（curl 與 PW 都回 429） | `hansen-reich2015.exa.txt` |
| Altamura, Vargas & Salmerón 2023 | PW 先開 Valencia 典藏首頁過 Anubis，再下載作者稿 | `altamura2023.pdf` |
| Crouch & Mazur 2001 | Wake Forest 一門課的課程頁放的期刊 PDF（Mazur 研究室網站的連結已 404）。**來源是第三方課程頁轉載**，內容是原期刊版面，引用時仍引 Am. J. Phys. 69, 970 | `crouch-mazur2001.pdf` |

**第一輪 🔴 → 現在 🟡 摘要（7）**

| 來源 | 現在讀到什麼 | 還缺什麼、試過什麼 |
|---|---|---|
| Jeong, Hmelo-Silver & Jo 2019 | 摘要（Exa 經 DOI；IU ScholarWorks 的紀錄頁內容相同） | 全文：ScienceDirect captcha（Jina、PW 兩次、Exa 都失敗）；IU 典藏只有紀錄沒有檔案；CORE 500 |
| Marion & Thorley 2016 | 摘要（Exa） | JCU 典藏的 PDF 對 curl 回 403、對 PW 回 401（限制存取） |
| Balta, Michinov, Balyimez & Ayaz 2017 | 摘要與 highlights（Exa 抓 ScienceDirect） | HAL 的紀錄頁被 Anubis 擋，沒確認有沒有附檔 |
| Smith et al. 2009 | 摘要（Exa 抓 science.org） | 全文付費；沒找到作者自存版 |
| Reich & Ruipérez-Valiente 2019 | 摘要（Exa 抓 science.org） | MIT DSpace 的兩個 bitstream 對 curl、PW、Exa 都回 429 或失敗；CORE 429。搜尋到一個匿名看板轉載的 PDF，來源不正當，沒有採用 |
| Fiorella & Mayer 2013 | ScienceDirect 的摘要與 section snippets 已落地，**我還沒讀** | 全文付費；UCSB 有同題的學位論文紀錄，沒去拿 |
| Muller, Bewes, Sharma & Reimann 2008 | ERIC 摘要頁已落地，**我還沒讀** | 全文付費 |

**仍然只有摘要（8）**

| 來源 | 第二輪試過什麼 |
|---|---|
| Boysen 2024（Policy Futures in Education） | OA 標 bronze 但 Sage 實際是 Restricted access；PW 讀到的仍只有摘要與引用清單；PW 下載 PDF 回 403；Exa 回的也只有摘要；S2 無 OA；CORE 無此篇。**沒拿到** |
| Boysen（STLP 10(2), 2024） | OA closed；Exa 抓 PsycNet 失敗；Ovid 付費。沒拿到 |
| King-Sears et al. 2023 | OA closed；Exa 與 PW 都只到 ScienceDirect 摘要；墨爾本大學的紀錄頁沒有檔案。沒拿到。另找到一份針對它的評論（見下） |
| Kobayashi 2024 | OA closed；Exa 抓 Springer 仍是摘要加圖表說明。沒拿到 |
| Nokes-Malach, Richey & Gadgil 2015 | 搜尋結果指向作者實驗室網站的 PDF，但該網址 curl 兩種編碼都回 404、Exa 失敗、PW 開實驗室出版清單頁只讀到 492 字元。沒拿到 |
| Davis, Chen, Hauff & Houben 2018 | TU Delft 典藏頁要點「Preview File」才出檔案，PW 沒抓到檔案連結；我猜的 Pure 路徑 404；Monash 紀錄頁沒有檔案；Exa 經 DOI 只回書目。沒拿到 |
| Lin, Lin, Zhang & Ginns 2024 | OA closed；Exa 抓 Springer 仍是摘要。沒拿到 |
| Chalmers 2017（MOOC 行動裝置） | 第二輪沒有重試 |

**仍然未讀（3）**：Clinton 2019（Exa 抓 Wiley 只回參考文獻段；OSF 節點 `exa5t` 的檔案清單 API 回空）；Ford et al. 2016（沒重試）；華藝上的台灣研究（沒做）。

**順帶落地、沒有進結論的東西**：Bissonnette（TÉLUQ 大學）對 King-Sears 2023 的一份評論短文（`teluq-udl-critical.pdf`，未經同儕審查）。它說依 Slavin 的最佳證據標準（介入至少 12 週、一般學生、面授）重新篩選，20 篇裡只剩 2 篇符合。我只讀了第一頁，列為線索。另有兩篇討論 Boysen 的部落格文（`ashman-udl-blog.exa.txt`、`twopint-udl-blog.exa.txt`）已落地未讀。

**小計**：13 篇從沒有全文變成有全文；7 篇從未讀變成有摘要；8 篇仍只有摘要；3 項仍未讀。盤點表的統計因此變成：✅ 74、🟡 15、🔴 3（第一輪的 knowledge building／論證式學習方向改由 R2-4 的掃描處理）。

### R2-2 第二輪讀到、和既有交叉表有關的陳述

以下只記來源說了什麼，供之後精讀時對照。**沒有據此改動上面任何一列的驗證狀態或任何結論。**

| 對應列 | 第二輪讀到的 | 影響 |
|---|---|---|
| 1.1 | Chen 2018 的納入條件是有獨立對照組的實驗或準實驗設計；作者用漏斗圖判斷出版偏誤很小；文中提到較早的 Lou et al. 2001（122 篇）小組對個人用電腦學習的個人成就 ES 只有 0.15；討論段寫 CSCL「不是萬靈丹」 | 1.1 可以從摘要層級升級，但我沒有讀調節變項表，升級留給精讀時做 |
| 1.1 | Jeong 2019 摘要：143 篇研究、316 個結果（2005–2014）、STEM 領域 CSCL 整體 ES = 0.51，對過程結果最大、其次知識、再次情意 | 第二份獨立統合分析，方向與 Chen 一致；只有摘要 |
| 1.7 | Marion & Thorley 2016 摘要：64 篇研究、75 個效果量，協作抑制穩健；小組越大、材料沒有分類、成員互不認識時更強 | 與 Luo 2024 同向 |
| 1.8–1.11 | Balta 2017 摘要：29 篇研究、N = 4,738，Peer Instruction 相對於傳統教學對學習有正面效果，國家文化是調節變項。Smith 2009 摘要：同儕討論提升理解，「即使小組裡原本沒有人知道正確答案」 | Smith 2009 的這一句是第一輪沒有的；合併效果量仍沒讀到 |
| 2.3 | Wise & Cui 2018 摘要全文：15% 的學習者在論壇貢獻，他們通過課程的比例是 64%，沒貢獻的人是 32%；同時在內容相關與無關兩類討論串發文的人，通過率高於只在一類發文的人 | 第一輪寫「結論句沒讀到」；現在讀到了。64% 對 32% 是觀察性的差異 |
| 3.9 | Chi, Roy & Hausmann 2008 摘要：兩人一起看別人被家教的錄影，解物理題的學習成效和一對一被家教一樣；對照條件還有獨自看、一起做但不看、獨自讀 | 第一輪是轉引；現在全文落地 |
| 5.10 | Lee, Rose, Macaro & Lee 2025 摘要全文：**EMI 與非 EMI 組的組間比較，學科內容 d = 0.13（p = 0.14，不顯著），英語能力 d = 0.33（p = 0.009）**；有選樣偏誤或沒處理組間同質性的研究效果量較大（這半句被截斷前的方向，精讀時要核） | 第一輪寫「組間結果沒讀到，不能引用」；現在可以引的是「用英語上課，學科內容沒有學得比較差，也沒有比較好」 |
| 6.x | Altamura 2023 摘要：40 個效果量、469,564 人（2000–2022），休閒數位閱讀習慣與閱讀理解的關係很小（r = .055），遠低於文獻裡休閒紙本閱讀的中等效果 | 第一輪沒有這篇；量的是閱讀習慣，不是單次閱讀的媒介 |
| 2.x | Hansen & Reich 2015 摘要：Harvard 與 MIT 的 68 門 MOOC（2012–2014），美國的參與者住在比全國平均更富裕、教育程度更高的社區；註冊者之中社經資源較多的人較可能拿到證書；差距在青少年與年輕成人更大 | 第一輪沒有這篇 |
| 2.x | Reich & Ruipérez-Valiente 2019 摘要：edX 上 Harvard 與 MIT 的資料顯示三個樣態——絕大多數學習者第一年後不再回來、參與的成長幾乎都集中在最富裕的國家、完成率六年來沒有改善 | 只有摘要，沒有數字 |

### R2-3 書目更正

| 項目 | 第一輪寫的 | 核對結果（來源） |
|---|---|---|
| 對話與獨白影片的線上課堂研究 | 「Ding et al. 2024」 | **Qian, Hong & Chi 2024**，IJ STEM Education 11, 49（Crossref）。第一作者記錯，全文已改 |
| 協作的後設認知信念問卷 | 作者未核、無 DOI | Wei, Soderstrom, Meade & Scott 2024，10.3390/bs14111104（Europe PMC） |
| 字幕與附帶字彙的統合分析 | 作者未核、「2024」 | Kurokawa, Hein & Uchihara，Language Learning 75(4), 939–987；線上 2024、卷期 2025（Crossref） |
| MOOC 社會互動的回顧 | 無作者 | Loh, Martins van Jaarsveld, Mesutoglu & Baars 2024（Crossref） |
| MOOC 讀書會（Facebook） | 無作者、「2022」 | Chen & Chen，10.3389/fpsyg.2021.670533；DOI 年份 2021，PMC 收錄 2022（Europe PMC） |
| Edublogs 準實驗 | 無作者 | Campillo-Ferrer, Miralles-Martínez & Sánchez-Ibáñez 2021（Crossref） |
| MITx 完成偏誤 | 無作者 | Karp Gershon, Ruipérez-Valiente & Alexandron 2021（Crossref） |
| L@S 2025 四篇 | 無作者 | Ou & Joyner；Mehta, Srivastava, Liu, Vanacore & Baker；Gong, Goldshtein, Xu, Arner, Roscoe & McNamara；Kwak, Dunder, Viberg & Pardos（Crossref）。Mehta 一篇的連結由 NSF PAR 改為 DOI |
| Discord 經驗報告 | 無作者 | Bridson, Atkinson & Fleming 2022，SIGCSE，pp. 759–765（Crossref） |
| 興趣個人化統合分析 | 無作者 | Lin, Lin, Zhang & Ginns 2024，Educ. Psychol. Rev. 36, 88（Crossref） |
| Liao, Kruger & Doherty 2020 | 只有期刊網頁連結 | DOI 10.26034/cm.jostrans.2020.549（Crossref） |
| Kobayashi interactivity | DOI 未核 | 10.3389/fpsyg.2018.02755 無誤；卷期 2018、線上 2019-01（Europe PMC） |
| Almeqdad 等 2023 | 共同作者未核 | 無誤（Crossref） |
| Montero Perez 等 2013 | DOI 未核 | 10.1016/j.system.2013.07.013 無誤（Crossref） |
| Wang & Pellicer-Sánchez | 「2023」 | 線上 2022-12、卷期 45(4) 為 2023；兩種寫法都見得到，引用時擇一並註明 |
| Boysen（STLP） | 「線上先行 2021」 | 卷期 10(2), 207–221, 2024 無誤（Crossref）；2021 是 OpenAlex 記的年份 |

另核對無誤、沒有改動的：Luo et al. 2024、Gillani et al. 2014（DOI 10.1038/srep06447，第一輪只給 arXiv 連結）、Honma et al. 2022、del Rio-Chanona et al. 2024、Tullis & Goldstone 2020、Vickrey et al. 2015、Porter 2022、Clinton-Lisell & Litzinger 2026、Pannatier & Bétrancourt 2024、Lee et al. 2025、King-Sears et al. 2023（七位作者：King-Sears, Stefanidis, Evmenova, Rao, Mergen, Owen, Strimel）、Sharif et al. 2021、Chatterjee et al. 2024（八位作者）、Reynolds et al. 2022（DOI 10.3390/systems10050133）、Salmerón et al. 2024、Li, Endres & Weimer 2022（DOI 10.1145/3510456.3514147）、Ribosa & Duran 2022、Balta et al. 2017、Guo 2018。

**仍未核**：Chalmers 2017（作者、會議名、DOI 都沒有）；Gernsbacher 2015 的 DOI 用標題查 Crossref 沒有回結果，note 裡的 10.1177/2372732215602130 取自 Sage 網址，沒有第二個來源。

**WCAG**：4.8 列的八條（1.1.1 A、1.2.2 A、1.4.1 A、1.4.3 AA、1.4.4 AA、1.4.10 AA、3.1.2 AA、3.1.5 AAA）逐條對 `wcag22.md` 原文，等級與條文內容全部正確，沒有更正。

### R2-4 補掃描：knowledge building 與論證式學習

**這一段是掃描，只讀摘要（多數是 OpenAlex 提供的摘要，少數是出版社頁面），不能據以下結論。** 它的用途是決定 order 20 動筆前要精讀哪幾篇。摘要與書目存在 `q5/scan-kb-argumentation.json`。

**母群定義**：（knowledge building）以 Scardamalia 與 Bereiter 的 Knowledge Building 理論或 Knowledge Forum 為對象的回顧、統合分析與近五年實證研究；（論證式學習）檢驗「讓學習者互相論證」對領域知識或論證能力效果的統合分析、回顧與實驗，分 arguing to learn（為了學內容而論證）與 learning to argue（學論證本身）。不算：一般的課堂討論研究、辯論比賽訓練。

**掃描方法**：Keenable 15 組查詢（英文 12、中文 2、日文 1），每組取 8 筆，共約 120 筆結果；Cambridge Handbook of the Learning Sciences 的對應章節用搜尋定位；候選的摘要用 OpenAlex 依 DOI 取。

**候選清單（28 筆）**

| # | 候選 | 類型 | 讀取程度 | 摘要說了什麼（一句） |
|---|---|---|---|---|
| K1 | Scardamalia & Bereiter, Knowledge Building and Knowledge Creation（Cambridge Handbook of the Learning Sciences；搜尋結果顯示它在不同版次是第 7、19、20 章，第三版的章號我沒有確認） | 手冊章節 | 🔴 只確認存在；Cambridge Core 頁面 Exa 抓不到 | — |
| K2 | Chen & Hong 2016, Schools as Knowledge-Building Organizations: Thirty Years of Design Research（Educational Psychologist，10.1080/00461520.2016.1175306） | 回顧 | 🟡 摘要 | 回顧 30 年文獻；作者自己指出 Knowledge Building 常被重新解讀成一般的建構式學習，並談到規模化與延續的問題 |
| K3 | Rodríguez-Chirino et al. 2025, Technologies for Reflective Assessment in Knowledge Building Communities: A Systematic Review（Information，10.3390/info16090762，OA） | 系統性回顧 | 🟡 摘要 | PRISMA，31 篇實證研究；多數分析工具用在 Knowledge Forum 的資料上；談的是工具，不是學習成效 |
| K4 | Soliman, Costa & Scardamalia 2021, Knowledge Building in Online Mode（Education Sciences，10.3390/educsci11080425，OA） | 個案反思 | 🟡 摘要 | 疫情期間兩門研究所課全線上做 Knowledge Building 的經驗報告 |
| K5 | Gan, Hong, Chen & Scardamalia 2021, Knowledge building: idea-centered drawing and writing（ETR&D，10.1007/s11423-021-10022-7） | 一手 | 🔴 只有書目 | — |
| K6 | Zhu, Raman, Xing & Slotta 2021, Curriculum design for social, cognitive and emotional engagement in Knowledge Building（IJETHE，10.1186/s41239-021-00276-9，OA） | 一手 | 🟡 摘要前段 | 高教課程設計與投入的研究 |
| K7 | Hong, Chen, Chen & Guo 2025, Sense of promisingness（ETR&D，10.1007/s11423-025-10483-0，OA） | 個案研究（**台灣**） | 🟡 摘要前段 | 32 位在職教師碩士生用 Knowledge Forum 18 週互相發展論文計畫 |
| K8 | Soliman, Feng, Scardamalia & Chan 2026, Knowledge building–modeling（ijCSCL，10.1007/s11412-026-09493-8，OA） | 一手（中國，小五 43 人） | 🟡 摘要前段 | 建模結合 Knowledge Forum 與分析工具 |
| K9 | Holtz, Kimmerle & Cress 2018, Using big data techniques for measuring productive friction in mass collaboration online environments（ijCSCL，10.1007/s11412-018-9285-y，OA） | 方法回顧 | 🟡 摘要 | 以維基百科為例，談個人與社群兩層的知識發展如何由「有生產力的摩擦」推動；是公開網路上成人知識建構最接近的一筆 |
| K10 | Holland 2019, Effective principles of informal online learning design: A theory-building metasynthesis of qualitative research（Computers & Education，文章編號 S0360131518302719；DOI 未取） | 質性後設綜合 | 🟡 摘要 | 22 篇以成人為主、線上、自主的非正式學習研究；兩個原則：互動機會支持知識建構；切段、有標題、有標籤的學習物件支持個人化學習。**和本系列的對象最貼近** |
| K11 | 知識翻新研究趨勢之文獻計量分析（2021，台灣，高等教育知識庫 ericdata.com 有紀錄） | 文獻計量 | 🔴 只有搜尋結果標題 | — |
| K12 | 知識翻新原則引導下的設計思考對學習者設計社群發展的影響（2025，華藝） | 一手（台灣） | 🔴 只有搜尋結果標題 | — |
| K13 | 遠藤・益川・大島・大島 2015，知識構築プロセスを安定して引き起こす協調学習実践の検証（日本教育工学会論文誌 38(4)） | 一手（日本） | 🔴 只有搜尋結果標題 | — |
| A1 | Andriessen & Baker, Arguing to Learn（Cambridge Handbook of the Learning Sciences；各版次章號為 21、22、26，第三版章號未確認；Utrecht 大學典藏有一份檔案連結） | 手冊章節 | 🔴 只確認存在；Exa 抓 Cambridge Core 逾時；Utrecht 的連結沒有試 | — |
| A2 | Koçoğlu & Kanadlı 2024, Effect of argumentation-based instruction on student achievement: a mixed-research synthesis（Asia Pacific Education Review，10.1007/s12564-024-09945-6） | 統合分析＋質性綜合 | 🟡 摘要 | 72 篇量化、22 篇質性；論證式教學對學業成就 g = 0.927（95% CI 0.789–1.064） |
| A3 | Fu & Zhan 2025, Effectiveness of argument in science education: a meta-analysis based on the results of 17 experiments（Research in Science & Technological Education，10.1080/02635143.2025.2527603） | 統合分析 | 🟡 摘要 | 13 篇論文、17 組資料、879 人；整體 ES = 0.704（95% CI 0.516–0.893）；摘要自己寫「有效性的證據仍然稀少」 |
| A4 | Ramallosa, Funa, Geron & Ibardaloza 2022, Meta-Analysis on the Effectiveness of Argument-Based Learning on Students' Conceptual Understanding（ACM 會議論文，10.1145/3514262.3514305） | 統合分析 | 🟡 摘要 | 14 篇（2011–2021）；ES = .803 |
| A5 | Rapanta & Felton 2021, Learning to Argue Through Dialogue: a Review of Instructional Approaches（Educ. Psychol. Rev.，10.1007/s10648-021-09637-2，OA） | 整合性回顧 | 🟡 摘要 | 143 篇；歸出三種教學框架（全班低結構、小組高結構、一對一辯證） |
| A6 | González-Palta, Rapanta & Larraín 2025, Promoting Argumentation Skills Among University Students: A Scoping Review（Higher Education Quarterly，10.1111/hequ.70080，OA） | 範疇回顧 | 🟡 摘要 | 129 篇（2008–2023）；learning to argue 的研究多於 arguing to learn；後者多在自然科學 |
| A7 | Vogel, Wecker, Kollar & Fischer 2017, Socio-Cognitive Scaffolding with Computer-Supported Collaboration Scripts: a Meta-Analysis（Educ. Psychol. Rev.，10.1007/s10648-016-9361-7，OA） | 統合分析 | 🟡 摘要 | 腳本對領域知識 d = 0.20、對協作技能 d = 0.95；提示交互建構（transactive）活動、搭配內容鷹架時對領域學習最有效。第一輪的 Radkowitsch 2020 是它的更新 |
| A8 | Iordanou, Kuhn, Matos, Shi & Hemberger 2019, Learning by arguing（Learning and Instruction 63, 101207） | 一手（兩個研究，中學生） | 🟡 摘要 | 對話式論證課程同時提升知識獲得與論證能力；密集兩天六小時的版本也有效；用問答方式取得背景知識優於讀一段文字 |
| A9 | Larraín, Howe & Freire 2017, 'More is not necessarily better'（Research in Science & Technological Education，10.1080/02635143.2017.1408581） | 一手（智利，18 校隨機分派，220 名 10–11 歲學生） | 🟡 摘要前半 | 標題即結論方向：論證式課堂對話多不一定比較好；摘要寫課程教材支持的論證與學習的關係「仍不清楚」。**反向或條件式結果的候選** |
| A10 | Gao, Xu, Yang & Hu 2022, The double-edged sword effect of argumentative scaffolding on group discussion in an adaptive discussion system（Frontiers in Psychology，10.3389/fpsyg.2022.997522，OA） | 一手（64 名大學生） | 🟡 摘要前半 | 摘要寫論證鷹架的效果「在既有研究中不一致」；結果句的後半（but 之後）我沒讀到。**反向結果的候選** |
| A11 | Allchin & Zemplén 2020, Finding the place of argumentation in science education: Epistemics and Whole Science（Science Education，10.1002/sce.21589） | 論述／批評 | 🟡 摘要 | 主張論證在科學教育裡的價值與範圍被高估，理性主義的預設限制了它的效果。**批評方的候選** |
| A12 | Noroozi, Kirschner, Biemans & Mulder, Promoting Argumentation Competence: Extending from First- to Second-Order Scaffolding Through Adaptive Fading（Educ. Psychol. Rev.，10.1007/s10648-017-9400-z，OA；OpenAlex 記 2017，卷期年份未核） | 概念文 | 🟡 摘要 | 指出沒有證據顯示論證鷹架能讓學生把論證能力帶到別的任務 |
| A13 | Stegmann, Weinberger & Fischer 2007, Facilitating argumentative knowledge construction with computer-supported collaboration scripts（ijCSCL，10.1007/s11412-007-9028-y） | 一手（經典） | 🔴 只有書目 | — |
| A14 | Noroozi, Dehghanzadeh & Talaee 2020, A systematic review on the impacts of game-based learning on argumentation skills（Entertainment Computing，10.1016/j.entcom.2020.100369） | 系統性回顧 | 🔴 只有書目 | — |
| A15 | 另有 3 筆只看到搜尋結果標題、沒有取書目：Argument mapping improves critical thinking skills: A systematic review（2026）；Argumentation-Based Teaching in Science Education: Meta-Analysis（Asian Institute of Research）；Çevik 2025 物理教育論證統合分析（IATED 會議） | — | 🔴 | — |

候選數：knowledge building 13、論證式學習 15 列（最後一列含 3 筆），合計 **28 列、30 筆**。讀取程度：🟡 摘要 19、🔴 只有書目或標題 11。沒有任何一筆讀到全文。

**覆蓋矩陣**

| 維度 | 值 | 候選 | 缺口 |
|---|---|---|---|
| 類型 | 統合分析 | A2、A3、A4、A7 | knowledge building **沒有找到任何統合分析**（查了三組查詢） |
| | 回顧 | K2、K3、A5、A6 | — |
| | 手冊章節 | K1、A1 | 兩章都沒讀到 |
| 結果方向 | 正向 | A2、A3、A4、A8 | — |
| | 反向、條件式或批評 | A9、A10、A11、A12、K2（自陳被誤讀與規模化問題） | knowledge building 沒有外部批評的文獻進來 |
| 對象 | 中小學 | K8、A8、A9 | — |
| | 高教 | K4、K6、K7、A6、A10 | — |
| | 公開網路上的成人自學 | K9、K10 | 只有兩筆，且都不是量學習成效 |
| 地理 | 非英語圈 | K7（台灣）、K8（中國）、A9（智利）、A2（土耳其）、K11–K13（台灣、日本，未讀） | — |
| 時間 | 2020 以後 | 過半（沒有逐筆數） | 2010 以前的奠基文獻只有 A13 |

**偏誤**

- knowledge building 的文獻幾乎都出自 Scardamalia、Bereiter 與其合作者（Hong、Chen、Chan、Soliman），掃到的 13 筆裡至少 8 筆是這個圈子自己的研究或回顧，外部的獨立評估一筆都沒有找到。這是這條線最需要在文章裡明說的事。
- knowledge building 的研究多用話語分析與 Knowledge Forum 內的指標當結果，不是對照組的學習成效；這是從摘要看到的樣子，沒有讀全文確認。
- 論證式學習的三份統合分析效果量都很大（0.70–0.93），而其中兩份的納入篇數很少（14、17）；A2 的 0.927 和第一輪讀到的協作腳本對領域知識 0.20–0.24 差了四倍。這個差距**只是掃描時注意到的現象**，原因（對照條件、測驗是否研究者自編、出版偏誤）要讀全文才知道，不能現在解釋。
- 兩個手冊章節都沒讀到，掃描等於少了領域自己的定義。
- 自學者讀網路內容的情境只有 K9、K10 兩筆沾得上邊。

**給 order 20 的精讀建議（不是結論）**：K1、A1 兩章（要先解決取得管道）；K2；A7 加第一輪的 Radkowitsch 2020；A2 與 A3 擇一讀全文看對照條件；A9、A11 作為反向與批評；K10 作為最接近本系列對象的一篇。

## 撤稿檢查範圍

用 OpenAlex `is_retracted` 查過且為 false 的 DOI（52 筆）：10.1007/s11412-020-09316-4、10.1007/s10648-015-9312-8、10.1007/s10648-024-09871-4、10.1186/s40594-024-00505-3、10.1186/s41239-021-00275-w、10.1073/pnas.1921417117、10.1080/2331186X.2023.2218191、10.1007/s10639-025-13843-8、10.3102/0034654318791584、10.1016/j.edurev.2019.100284、10.1187/cbe.14-11-0198、10.1186/s41235-020-00218-5、10.1080/00461520.2020.1828086、10.1145/3170358.3170403、10.1145/2531602.2531657、10.1080/01587919.2014.917708、10.1126/science.aav7958、10.1093/pnasnexus/pgae400、10.1145/2950290.2950331、10.1145/3478431.3499385、10.1016/j.compedu.2018.05.019、10.1111/jpr.12221、10.1016/j.cedpsych.2013.06.001、10.3758/s13421-014-0416-z、10.1080/03640210701863396、10.1080/10508406.2016.1204546、10.1111/j.1365-2729.2007.00248.x、10.1016/j.edurev.2022.100475、10.1177/14782103241255428、10.1037/stl0000280、10.1016/j.tate.2022.103956、10.1080/13603116.2017.1325074、10.1145/3132525.3132550、10.1109/TVCG.2021.3114770、10.1145/3051457.3051464、10.1126/science.aag2063、10.1073/pnas.1611898114、10.1007/s10648-024-09933-7、10.1016/j.edurev.2018.09.003、10.1111/1467-9817.12269、10.1037/edu0000830、10.3102/00346543231216463、10.1038/s41598-022-05605-0、10.1111/lang.12697、10.1145/1978942.1979366、10.1126/science.aab3782、10.1016/j.edurev.2010.01.001、10.1016/j.ijer.2017.08.009、10.1037/bul0000071、10.1126/science.1165919、10.1037/edu0000436、10.1007/s10648-021-09643-4。

**沒有查撤稿的**：Luo 2024（MDPI）、Pannatier & Bétrancourt 2024、Lee et al. 2025、Kobayashi 的 Frontiers 兩篇、Ribosa & Duran 以外的 2022 年後 Frontiers／MDPI 來源、所有 L@S 2025 論文、Chatterjee 2024、Sharif 2021、Guo 2018、Wang & Pellicer-Sánchez 2023、Liao 2020、兩篇日文文獻。更正（erratum）一律沒有查。
