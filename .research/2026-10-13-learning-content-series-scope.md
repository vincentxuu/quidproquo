# Research: 「教學文章怎麼寫」系列的範圍重定（deep-research 步驟 0–1）

狀態：步驟 0（母群與掃描）完成、步驟 1（子問題）待使用者確認。尚未開始蒐集（步驟 2）。
日期：2026-10-13

## 為什麼重做

第一版把母群定成「作者在一篇網路文章裡能做的決定」，只掃了多媒體學習與軟體文件兩個圈子，得到十篇都在講文章的零件（文字、題目、程式碼、圖、影片、版面）。使用者的回饋是「內容好狹隘」。這一版把母群放寬，重新掃描。

## 步驟 0-1 母群定義

**邊界**：一個人靠網路上公開的自學內容（文章、導讀、影片、互動頁、開放課程）學會一件事，哪些因素決定他學不學得會，以及做內容的人能影響其中哪些。

算：內容怎麼呈現、學習者要做什麼、學習者帶著什麼來、隨時間怎麼維持、跟誰一起學、誰被排除、怎麼評估、怎麼做出來（含 AI）。
不算：學校課堂的班級經營、教師培訓、教育政策、幼兒發展；純粹學習者自己的讀書方法（站上 Learning How to Learn 系列已處理，只引用）。

## 步驟 0-2 掃描方法與掃到的清單

toolDegradation：Groundlane MCP 不在本 session 的工具清單（ToolSearch 查 groundlane 只回 Exa）；稍早的 session 記錄 Groundlane 回 401、Firecrawl 回 402、Jina 額度用完。本輪用 Exa 抓目錄頁。

| 掃描對象 | 類型 | 取得的內容 | 讀取程度 |
|---|---|---|---|
| Cambridge Handbook of the Learning Sciences 第 3 版（Sawyer 編，2022） | 學術手冊目錄 | 33 章章名：scaffolding、project-based learning、metacognition 與 self-regulated learning、conceptual change、cognitive apprenticeship、design-based research、assessment、learning analytics、videogames、embodiment、mobile learning、knowledge building、CSCL、arguing to learn、informal learning in museums、各學科的學習、learning as a cultural process、interest／motivation／engagement | 🟡 只有目錄 |
| Cambridge Handbook of Multimedia Learning 第 3 版（Mayer、Fiorella 編，2021） | 學術手冊目錄 | 36 章中的 24 章章名（第 5–10、22–27 章與第八部分在抓到的頁面被省略）：multimedia、multiple representation、expertise reversal、coherence、signaling、redundancy、contiguity、split attention、worked example、segmenting、pre-training、modality、transient information、generative activity、mapping、drawing、imagination、self-explanation、guided inquiry、feedback、learner control、cognitive load self-management | 🟡 只有部分目錄 |
| How Learning Works 第 2 版（Lovett 等，2023） | 高教教學書目錄 | 八章：身分與發展階段、先備知識、知識的組織方式、動機、精熟的發展、練習與回饋、課堂氛圍、自主學習 | 🟡 只有目錄 |
| IES Practice Guide: Organizing Instruction and Study（Pashler 等，2007） | 政府實務指引 | 七條建議：間隔、例題與練習交錯、圖配文字、抽象與具體連結、測驗（含 pre-question）、協助分配讀書時間、深層提問 | 🟡 只有建議清單頁 |
| How People Learn II（NASEM，2018） | 共識報告 | 只取得任務說明（涵蓋動機、文化、學習科技、評量、第二語言與學習障礙），沒取得章節目錄 | 🔴 目錄未取得 |
| CAST UDL Guidelines 3.0（2024） | 設計準則 | 三大原則之一 engagement 與數條 consideration；完整準則表沒抓到 | 🟡 部分 |
| Google Technical Writing 課程總覽 | 業界課程 | 四門課：基礎、進階、無障礙、錯誤訊息 | ✅ 總覽頁全文 |
| Write the Docs 指南目錄 | 社群指南 | 風格指南、無障礙、減少偏見、docs as code、SEO、API 文件 | ✅ 目錄頁全文 |
| Diátaxis 首頁 | 業界框架 | 四種文件：tutorial、how-to、reference、explanation | ✅ 首頁全文 |
| Andy Matuschak 作品索引 | 實務研究者 | Why books don't work、Quantum Country（mnemonic medium）、Timeful texts、How might we learn、Orbit、閱讀輔助與自我解釋的實驗筆記 | 🟡 只有索引頁 |
| Distill〈Research Debt〉（Olah、Carter，2017） | 實務論述 | 讀到前半：poor exposition、undigested ideas、bad abstractions and notation、noise；interpretive labor 的一對多成本 | 🟡 前半 |
| ICER 2025 議程 | 研討會議程 | 讀到前兩天部分場次：live coding 筆記、大型程式庫、misconceptions in programming、GenAI 使用與素養 | 🟡 部分 |
| Learning@Scale 2025 徵稿 | 研討會徵稿 | 網址 404 | 🔴 未取得 |

還沒掃、應該補的方向：Learning@Scale 與 CHI 的學習相關議程、探索式解說（explorable explanations）社群的作品清單、科學傳播與資料新聞的解說文、教科書設計研究、語言學習、成人與職場學習、非英語（中文、日文）的教學設計文獻、OER 品質評量表（Quality Matters 等）。

## 步驟 0-3 覆蓋矩陣

維度的取捨標準：沿這個維度走，做內容的人會不會做出不同的決定。

| 維度 | 值 | 掃描來源 | 系列現況 | 缺口 |
|---|---|---|---|---|
| 學習者帶著什麼來 | 先備知識、迷思概念與概念改變 | HLW 2–3、LS 6、MM 13 | 第 1 篇帶到 expertise reversal | 迷思概念、知識組織沒有 |
| | 動機、興趣、身分 | HLW 1、4；LS 30；UDL engagement | 無 | 全缺 |
| 內容怎麼呈現 | 文字與例子 | MM 14–18；IES 2、4 | 第 1 篇（研究中） | |
| | 圖、表、多重表徵 | MM 11–12、29–30；IES 3 | 第 2 篇（研究中） | |
| | 影片 | MM 21（transient information） | 第 3、4 篇（已寫） | |
| | 互動與可探索的解說、程式碼 | Matuschak、Distill、ICER | 無 | 全缺 |
| | 記號與抽象的選擇 | Distill（bad abstractions and notation） | 無 | 全缺 |
| 學習者要做什麼 | 練習、回饋、提取 | HLW 6；IES 5；MM 34 | 第 1 篇帶到 | 沒有獨立處理 |
| | 自我解釋、畫圖、生成活動 | MM 28–33 | 第 2 篇帶到畫圖 | |
| | 專題、鷹架、認知學徒制、從失敗學 | LS 3、4、8 | 無 | 全缺 |
| 隨時間 | 間隔與回頭複習 | IES 1、7；Matuschak（mnemonic medium、timeful texts） | 無 | 全缺 |
| | 自主學習、後設認知、學習者控制 | LS 5；HLW 8；IES 6；MM 35–36 | 無 | 全缺 |
| | 精熟怎麼發展、系列怎麼排 | HLW 5；本站 series-curriculum-design | 無 | 全缺 |
| 跟誰一起學 | 協作、論證、知識建構、留言與社群 | LS 19–21 | 無 | 全缺 |
| | 非正式學習（博物館、遊戲） | LS 14、22 | 無 | 全缺 |
| 誰被排除 | 無障礙、多種呈現與表達方式 | UDL；Google 無障礙課；Write the Docs | 無 | 全缺 |
| | 語言、文化、行動裝置 | LS 18、29；HPL II 任務說明 | 第 2、4 篇帶到手機 | 語言與文化沒有 |
| 怎麼知道有效 | 評量設計、學習分析、設計研究法 | LS 9、12、13 | 無 | 全缺 |
| 怎麼做出來 | 解說是公共財、研究債 | Distill | 無 | 全缺 |
| | 文件類型（教程、操作、參考、解說） | Diátaxis | 無 | 全缺 |
| | AI 協作寫作與 AI 家教 | ICER（GenAI）、Matuschak（How might we learn） | 無 | 全缺 |

## 步驟 0-4 偏誤

- 掃到的十三個來源全是英文，其中九個出自美國。中文、日文、歐陸的教學設計傳統沒掃。
- 兩本 Cambridge 手冊偏學校與大學情境；自學者讀網路內容只是其中的邊緣案例。
- 實務端只掃到三個（Matuschak、Distill、Diátaxis），都是我原本就知道的名字，這部分還是從「我知道的」挑的，需要用系統性方法補掃（例如探索式解說的作品目錄、技術部落格的寫作指南彙整）。
- 除了三個網頁，其餘都只到目錄層級，沒有讀任何一章。這份矩陣只能用來決定「查什麼」，不能拿來下結論。

## 步驟 1 子問題（待確認）

1. **學習者帶著什麼來，內容怎麼接？** 先備知識、迷思概念、動機與興趣各自怎麼影響一個人讀自學內容的結果；做內容的人能做什麼。
2. **內容怎麼呈現？** 文字、例子、圖、影片之外，互動式解說、可執行的程式碼、記號與抽象的選擇有多少證據；各種呈現方式什麼時候互相取代、什麼時候互補。
3. **讀的人要做什麼才算在學？** 練習、回饋、自我解釋之外，專題、鷹架、從失敗學這些做法能不能放進一篇文章或一個系列；一個人自己讀的時候哪些做得到。
4. **學習怎麼隨時間維持？** 間隔複習、把複習嵌進文章（mnemonic medium）、系列的順序、自主學習者怎麼決定下一步；證據與實際採用的情況。
5. **一個人讀和一群人學差在哪，誰被排除？** 留言、社群、同儕對自學內容的作用；無障礙、語言、文化、裝置造成的落差。
6. **怎麼知道內容有效，怎麼把它做出來？** 作者能量什麼；設計研究怎麼做；AI 寫稿與 AI 家教目前的證據；把解說當成公共財的論述。

## 待解問題

- 系列要維持「教學文章怎麼寫」這個從作者出發的定位，還是放寬成「人怎麼從網路內容學會東西」？兩者篇目差很多。
- 已寫的兩篇（影片搭配、影片排版）與研究中的兩篇（文字、圖）在新的範圍裡是子問題 2 底下的四篇，比例是否失衡。
