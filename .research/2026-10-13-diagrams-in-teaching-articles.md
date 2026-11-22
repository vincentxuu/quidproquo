# Research: 教學文章的內容什麼時候該畫成圖或表、畫哪一種、怎麼畫才幫助學習

訪問日一律 2026-10-13。原文存檔在 `.work/learning-visualization-research/src/`，逐條網址與取得方式在 `.work/learning-visualization-research/sources.md`。

toolDegradation：Groundlane MCP 未掛載（ToolSearch 查不到）→ Groundlane 直接 HTTP 回 401（環境沒有 token）→ Keenable keyless 可用，但只有搜尋 → You.com keyless 可用，但 free profile 只有 `you-search`，沒有 `you-contents` → 讀全文降級到 curl（開放 PDF）、Jina keyless reader、Exa `web_fetch`。第一輪（任務書修正前）直接用了 curl、OpenAlex、ERIC、Keenable、Jina、Exa 搜尋，沒有先試 Groundlane 與 You.com；第二輪補試後確認前兩者不可用。Firecrawl 與 Jina MCP 當天額度已用完（team-lead 告知），沒有試。

## 子問題

1. 加圖對學習的效果有多大？哪些條件下變大或變小？
2. 圖和文字怎麼搭（鄰近、訊號、連貫、重複）影響多少？
3. 哪種內容配哪種表示法，有沒有實驗依據？
4. 演算法視覺化的教學效果如何？
5. 靜態圖、分格圖、動畫、互動圖各自的證據與代價？
6. 讀者自己畫（概念圖、畫圖）與範例旁的輔助，效果如何？
7. 小螢幕可讀性與無障礙有沒有可引用的準則？本站實測是多少？
8. 同類教學網站實際怎麼用圖？

## 步驟零：選案（research-selection）

### A. 研究的母群

母群定義：以「學習成果」為依變項、比較不同視覺表徵或圖文安排的實證研究與其統合分析，加上圖解認知的理論分析。排除：只量偏好或滿意度的研究、資料視覺化的美學研究、VR／AR。

掃描方法：
- 分類目錄：Noetel 等的統合回顧（29 篇回顧的清單）當多媒體學習的目錄。
- 推薦鏈：Hundhausen 2002 → Naps 2002 → Shaffer 2010 → Sibia 2025；Tversky 2002 → Höffler 2007 → Berney 2016 → Ploetzner 2021。
- 搜尋聚合：OpenAlex（32 個 DOI）、ERIC、Keenable（14＋8＋6 組查詢）、You.com（3 組）。
- 任務書點名的清單（Mayer 各原則、Fiorella 與 Mayer、Van Meter、Ainsworth、Schroeder 2018、Nesbit 與 Adesope 2006、Larkin 與 Simon、Tversky、Cleveland 與 McGill、Hegarty、Hundhausen）。

掃到的完整清單（44 篇）：Guo 2020；Noetel；Schroeder 與 Cenkci 2018；Ginns 2006；Schneider 2018；Alpizar 2020；Richter 2016；Sundararajan 與 Adesope 2020；Rey 2012；Rey 2019；Adesope 與 Nesbit 2012；Trypke 2023；Cooper 2018；Barbieri 2023；Nesbit 與 Adesope 2006；Schroeder 2018；Fiorella 與 Mayer 2016；Fiorella 與 Zhang 2018；Zhang 與 Fiorella 2021；Cromley 2020；Van Meter 與 Garner 2005；Ainsworth 2011；Ainsworth 與 Scheiter 2021；2025 畫圖輔助統合分析；2025 畫圖任務設計回顧；Larkin 與 Simon 1987；Tversky 2011；Novick 與 Hurley 2001；Cleveland 與 McGill 1984；Heer 與 Bostock 2010；Tversky 2002；Hegarty 2004；Höffler 與 Leutner 2007；Berney 與 Bétrancourt 2016；Castro-Alonso 2019；Ploetzner、Berney、Bétrancourt 2021；Hundhausen 2002；Naps 2002；Urquiza-Fuentes 2009；Shaffer 2010；Sorva 2013；Sibia 2025；2024 AVL 工具個案；Conlen 2019；Hohman 2020；Tse 2016；一篇中文的畫圖效應統合分析（《心理發展與教育》，只看到標題）。

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 證據類型 | 統合分析 | Guo、Noetel、Berney、Nesbit、Barbieri、2025 畫圖輔助 | |
| 證據類型 | 單一實驗 | Cooper 2018、Ploetzner 2021 | 只有兩篇；Mayer 的原始實驗沒讀 |
| 證據類型 | 理論分析或模擬 | Larkin 與 Simon、Tversky 2011 | |
| 證據類型 | 實務紀錄 | Conlen 2019、Tse 2016 | |
| 結果方向 | 正面 | Guo、Noetel 多數原則 | |
| 結果方向 | 沒有效果或反向 | Berney（59% 無差異）、Hundhausen（只觀看無優勢）、2025 畫圖輔助、Barbieri 的自我解釋、Zhang 與 Fiorella 實驗一（摘要）、Ploetzner（四張分格圖沒有贏單張圖） | |
| 年代 | 2002 以前 | Larkin 與 Simon、Cleveland 與 McGill、Hundhausen、Tversky 2002 | |
| 年代 | 2003–2019 | Nesbit、Berney、Cooper、Conlen、Shaffer | |
| 年代 | 2020 之後 | Guo、Noetel、Ploetzner、Trypke、Barbieri、Sibia、2025 兩篇 | |
| 領域 | 自然科學與數學 | 多數 | |
| 領域 | 電腦科學 | Hundhausen、Naps、Shaffer、Sibia | 2002 之後沒有合併效果量的統合分析 |
| 受試者 | 大學生 | 多數 | |
| 受試者 | 中小學 | Guo、Nesbit、Barbieri 內含 | |
| 受試者 | 網路上的自願讀者 | Conlen | 只有行為資料，沒有學習成果 |
| 教材長度 | 短（幾分鐘到十幾分鐘） | 幾乎全部 | **長篇教材沒有任何一篇** |
| 語言 | 英語以外 | 無 | 中文統合分析未讀 |

缺口補搜一輪的結果：
- 「分格圖對動畫」的直接比較：補到 Ploetzner、Berney、Bétrancourt（2021），讀了全文相關段落。
- 四項轉引（鄰近、訊號、分段、動畫）的原始統合分析：用 Exa 取得出版社頁面的摘要，從轉引升到摘要層級。
- Novick 與 Hurley（2001）、Cromley（2020）、Hegarty（2004）：取得摘要或引言。
- 長篇教材、非英語：沒有補到。

偏誤：
- 偏哪裡：英語、心理學與教育學期刊、統合分析、開放取得的論文、短教材、大學生。
- 缺什麼：長篇教材；已經有表格與公式的教材再加圖；2002 年之後的演算法視覺化合併效果量；非英語研究。
- 為什麼還是選這些：封閉論文只能到摘要；長篇教材與「表格之上再加圖」找不到研究，只能明說這是推論的地方。

### B. 同類網站的母群

母群定義：以文字為主體、公開免費、教演算法或機器學習的教學頁面。排除純影片課程與要登入的平台。

掃描方法：任務書點名的 10 個；本站導讀涵蓋的課程的官方筆記；You.com 搜尋兩組（英文的 explorable explanations 清單、中文的演算法圖解教學網站）。awesome-explorables 的 README 回 404、explorabl.es 首頁靠 JavaScript 載入，兩個目錄都沒掃成。

掃到的完整清單（19 個）：CS50 AI 筆記、CS231n 筆記、MIT Missing Semester、MIT OCW 6.006、Dive into Deep Learning（英文與中文版）、Hugging Face 課程、The Illustrated Transformer、Distill、Red Blob Games、3Blue1Brown 文字版、Josh Comeau、VisuAlgo、Khan Academy、MLU-Explain、R2D3、Hello 演算法、演算法筆記（臺師大）、Algorithm Visualizer、learncodebypicture。

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 形態 | 課程筆記 | CS50 AI、CS231n、Missing Semester | |
| 形態 | 教科書 | Dive into Deep Learning（英、中） | |
| 形態 | 圖很密的個人教學文 | Illustrated Transformer、3Blue1Brown 文字版 | |
| 形態 | 互動文章 | Distill、Red Blob Games、Josh Comeau | MLU-Explain、R2D3 抓到的 HTML 是空殼 |
| 形態 | 逐步分格圖 | Hello 演算法 | |
| 形態 | 視覺化工具 | VisuAlgo（只記形態） | |
| 語言 | 英語以外 | Hello 演算法（正體中文版）、演算法筆記、D2L 中文版 | |
| 生命週期 | 停更或暫停 | Distill（2021-07 宣布暫停一年，可能無限期延長） | |
| 年代 | 2016 以前／之後 | Distill 2016、CS231n；其餘較新 | 沒有逐頁查發布年 |
| 手機版面 | 有量 | 無 | **所有網站都沒有在手機寬度下看** |

缺口補搜後仍空著：手機版面；每站只看一頁；Khan Academy 沒抓到內容。

偏誤：偏英語、偏有名的站（任務書點名的占一半以上）；量的是 HTML 標籤，不是渲染後的畫面；沒有流量或學習成效資料，所以只能說「它們怎麼做」，不能說「哪種做法比較好」。

## 來源清單

完整網址見 `sources.md`，這裡只列角色與取用層級。

- Guo 等 2020 — 一手（統合分析）；全文
- Noetel 等，預印本 — 一手（統合回顧）；全文（預印本，非期刊版）
- Hundhausen 等 2002 — 一手；主要章節
- Berney 與 Bétrancourt 2016 — 一手；部分
- Ploetzner、Berney、Bétrancourt 2021 — 一手（實驗）；摘要、材料、結果
- Tversky、Morrison、Bétrancourt 2002 — 一手（回顧）；第 1.4–4 節
- Nesbit 與 Adesope 2006 — 一手；部分
- Larkin 與 Simon 1987、Tversky 2011、Cleveland 與 McGill 1984、Heer 與 Bostock 2010 — 一手；部分
- Naps 2002、Shaffer 2010、Sibia 2025 — 一手；部分
- Cooper 等 2018、Trypke 等 2023、Barbieri 等 2023、2025 畫圖輔助統合分析 — 一手；部分
- Conlen 等 2019 — 一手；部分。Hohman 等 2020 — 一手作者的綜述；部分。Tse 2016 — 實務者簡報；全文
- Schroeder 2018、Fiorella 與 Zhang 2018、Zhang 與 Fiorella 2021、Sundararajan 與 Adesope 2020、Schroeder 與 Cenkci 2018、Schneider 2018、Rey 2019、Höffler 與 Leutner 2007、Cromley 2020、Novick 與 Hurley 2001、Ainsworth 與 Scheiter 2021 — 一手；**摘要**
- Hegarty 2004 — 一手（評論）；引言與各節開頭的片段
- WCAG 2.2 Understanding 五則、WAI Complex Images、Apple HIG 兩頁、Mermaid 無障礙文件、rehype-mermaid README、D2 themes — 官方；相關段落
- 15 個網站頁面 — 一手觀察；原始 HTML 或 reader 輸出

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| Guo 2020 | ✅ 摘要、方法、結果、表 3／4、限制 | 無 |
| Noetel 預印本 | ✅ 摘要、方法、結果、討論、限制 | 期刊版沒讀；Table 1 的 29 篇清單沒逐列讀 |
| Hundhausen 2002 | ✅ 摘要、3、5.1.3–5.2.1、6 | 5.2.2 以後與附表沒逐項讀，是我沒去讀 |
| Tversky 2002 | ✅ 1.4–4 | 1.1–1.3 與結語沒讀，是我沒去讀 |
| Ploetzner 2021 | ✅ 摘要、材料、結果、討論 | 第三輪補讀了討論 |
| Berney 2016 | 🟡 摘要、3.1、3.2、4.4 | 調節分析的表沒逐項讀 |
| Nesbit 與 Adesope 2006 | 🟡 摘要、表 6、結論 | 其餘表格沒讀 |
| Larkin 與 Simon 1987 | 🟡 摘要、引言、結論 | 模擬細節沒讀 |
| Tversky 2011 | 🟡 摘要與兩處段落 | 37 頁只讀了片段 |
| Cleveland 與 McGill 1984 | 🟡 摘要、任務排序 | 實驗細節沒讀 |
| Heer 與 Bostock 2010 | 🟡 摘要、引言 | 結果沒讀 |
| Naps 2002、Shaffer 2010、Sibia 2025 | 🟡 摘要加一兩節 | 其餘沒讀 |
| Cooper 2018 | 🟡 摘要、方法 | 結果的統計沒讀 |
| Trypke 2023 | 🟡 摘要、引言、表 4、限制 | 各情境的分節沒讀 |
| Barbieri 2023 | 🟡 摘要、引言片段、方法開頭、優缺點 | **自我解釋調節項的係數沒讀到** |
| 2025 畫圖輔助統合分析 | 🟡 結果、討論開頭、限制 | 作者姓名沒確認 |
| Conlen 2019 | 🟡 摘要、第 6 節 | |
| Hohman 2020 | 🟡 相關段落 | |
| Tse 2016 | ✅ 全部投影片文字 | 沒有講稿 |
| Schroeder 2018（概念圖） | ✅ 作者稿：摘要、方法開頭、對照條件一節、表 1、結論 | 第三輪在 SFU Summit 典藏找到作者稿 |
| Rey 2019 | ✅ 摘要、整體結果、三個假說的檢定、限制 | 第三輪在共同作者網頁找到 PDF |
| Fiorella 與 Mayer 2016 | ✅ 畫概念圖與畫圖兩節、結語 | 第三輪找到一份學校網站上的 PDF；文章連結用 DOI |
| Ainsworth 等 2011 | 🟡 取得全文 PDF，只讀了開頭 | 是觀點文章，文章沒有引用 |
| Fiorella 與 Zhang 2018、Sundararajan 2020、Schroeder 與 Cenkci 2018、Cromley 2020 | 🟡 摘要 | Springer 付費牆；curl 回驗證頁，Jina 只回參考文獻，Exa 回摘要；第三輪用 Keenable 找作者網頁、NSF PAR、ERIC 都沒有全文。Fiorella 與 Zhang 在 Scribd 有一份上傳檔，來源不明，沒有採用 |
| Zhang 與 Fiorella 2021、Schneider 2018、Höffler 與 Leutner 2007、Novick 與 Hurley 2001 | 🟡 摘要 | ScienceDirect 付費牆；Jina 遇到驗證碼，Exa 回摘要 |
| Hegarty 2004 | 🟡 引言與各節開頭片段 | ScienceDirect 的 section snippets |
| Ainsworth 與 Scheiter 2021 | 🟡 摘要 | 典藏頁有作者稿 PDF，但檔案連結被 Cloudflare 擋；Sage 逾時 |
| Van Meter 與 Garner 2005 | 🟡 摘要 | 第三輪用 Exa 讀到 Ovid 頁面的摘要；PSU 典藏沒有檔案 |
| Urquiza-Fuentes 2009、Sorva 2013 | 🔴 未讀 | 第三輪再試：ACM DL 經 Exa 只回 cookie 聲明；Aalto 研究入口網只有書目；URJC 典藏搜不到該篇的檔案 |
| Ginns 2006、Adesope 與 Nesbit 2012、Alpizar 2020、Richter 2016、Rey 2012、Castro-Alonso 2019 | 🔴 僅 Noetel 轉引或只知存在 | 我沒有去拿 |
| 中文畫圖效應統合分析 | 🔴 只看到標題 | 我沒有去拿 |

更正與撤稿：用 Crossref 的 `updates:` 過濾查了 26 個 DOI，都沒有更正或撤稿通知。沒有查 Retraction Watch 資料庫，也沒有查沒有 DOI 的來源。

## 事實交叉表

只放來源說了什麼。數字連著對照條件。

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| 文字加圖對只有文字，閱讀理解 g = 0.39（39 個研究，2,103 人）；Trim and Fill 後 0.28 | Guo 2020 全文 | — | ✅ 單一一手 |
| 圖的類型之間無顯著差異（只有「混用對圖片」顯著）；簡答題 0.67，是非與選擇各 0.22 | Guo 2020 | — | ✅ 單一一手 |
| 空間鄰近對分開放置 g = 0.63（58 個比較，n = 2,426） | Schroeder 與 Cenkci 2018 摘要 | Noetel 轉引同一數字 | ✅ |
| 訊號對無訊號，學習 g = 0.43（k = 209） | Noetel 轉引 Schneider 2018 | Schneider 2018 摘要：103 個研究、12,201 人；保留 0.53、遷移 0.33，209 是兩者的測量數合計 | ✅ 一致（合併值只見於 Noetel） |
| 訊號的效果不受先備知識調節 | Schneider 2018 摘要 | Noetel：先備知識整體不是穩定的調節變項 | ✅ |
| 分段：保留 d = 0.32（67 個效果量）、遷移 d = 0.36（56 個）；學習時間 −0.92（分段較久） | Rey 2019 全文 | Noetel 轉引為 0.34（k = 123，即 67 + 56） | ✅ 一致。Rey 研究的是把講解切成學習者自控步調的段落，不是把一張圖拆成幾格 |
| 分段對高先備知識者的保留成績幫助較大 | Rey 2019 摘要 | Noetel：同一方向 | ✅ |
| 拿掉無關細節 g = 0.33（k = 68）；持續顯示 0.43、一閃而過 0.12 | Noetel 轉引 Sundararajan 與 Adesope 2020 | 該篇摘要只有定性描述 | ⚠️ unverified：數字只見於轉引 |
| 設計原則在複雜教材 0.70、簡單教材 0.20；系統控步調 0.41、自己控步調 0.27 | Noetel | — | ✅ 單一一手（統合回顧自己的分析） |
| 動畫對靜態圖的整體效果 | Berney 2016：g = 0.226（61 個研究，140 組比較），59.3% 無顯著差異，自稱小效果 | Höffler 與 Leutner 2007 摘要：d = 0.37（26 個研究，76 組比較），稱為中等；Berney 全文也如此轉述；Ploetzner 2021 則把兩篇都稱為只有小的整體效果 | ❌ conflict：量值不同，後人的定性描述也不一致 |
| 表徵性動畫 d = 0.40；裝飾性 −0.05 | Höffler 2007 摘要（0.40） | Noetel 轉引（0.40 與 −0.05） | ✅ 0.40；⚠️ −0.05 只見於轉引 |
| 動畫優勢集中在系統控步調 0.309、配旁白 0.336、沒有搭配文字 0.883 | Berney 2016 摘要 | — | ✅ 單一一手 |
| 「動畫贏」的研究裡，動畫常帶有靜態版本沒有的資訊，或混入互動與預測 | Tversky 2002 | Hegarty 2004 引言與 Höffler 2007 引言都如此轉述 | ✅ |
| 單張圖、四張分格圖、動畫的直接比較（88 位大學生，齒輪機構）：辨認運動時動畫最好（對單張 d = 2.33、對四張 2.41），單張與四張無差異；辨認空間配置時單張最好（對四張 1.11、對動畫 1.30），四張與動畫無差異 | Ploetzner 等 2021 | — | ✅ 單一一手 |
| 多張靜態圖方便比對與重看 | Tversky 2002（論述） | Ploetzner 2021 的實驗裡四張圖沒有贏單張圖 | ❌ conflict：論述對一個實驗的結果；內容是連續的機械運動 |
| 24 個演算法視覺化實驗，11 個顯著；操弄表徵的 30%、操弄學習者活動的 71%；只觀看無優勢 | Hundhausen 2002 | Naps 2002 的假設一：觀看與不看成果相當 | ✅（兩篇有共同作者，不算獨立） |
| 2002 之後的演算法視覺化缺少嚴謹評估 | Sibia 2025 摘要 | Shaffer 2010：許多視覺化品質低 | ✅ 方向一致，講的是不同的事 |
| 讀現成概念圖對讀條列 g = 0.28（k = 10）；對讀文字 0.39（k = 29） | Nesbit 與 Adesope 2006 表 6 | — | ✅ 單一一手 |
| 自己畫概念圖 0.72，讀現成的 0.43 | Schroeder 2018 作者稿 | Nesbit 2006：自己畫對聽課 0.74，對寫摘要 0.19 | ⚠️ 對照條件不同，不能直接比 |
| 概念圖對條列 | Nesbit 2006：讀現成的對條列或大綱 0.28（k = 10） | Schroeder 2018 表 1：讀或畫合併，對條列 0.43（k = 13）、對大綱 0.48（k = 8） | ⚠️ 量值不同，後者把讀與畫合併；作者提醒各研究做法差異大 |
| 畫圖在「對照作者提供的圖」等條件下較有效 | Fiorella 與 Mayer 2016 全文（引 Van Meter 2001、Van Meter 等 2006） | 2025 統合分析：整合類輔助是顯著的調節變項 | ✅ |
| 自己畫圖的整體效果 | Cromley 2020 摘要：g = 0.69（53 個研究，8,111 人；事實 0.85、推論 0.44、遷移 0.22） | Fiorella 與 Zhang 2018 摘要：對只讀文字一致較好，對看現成的圖結果不一致 | ✅ 不衝突：Cromley 的對照含不畫圖的條件 |
| 畫圖對看現成的圖 | Zhang 與 Fiorella 2021 摘要：實驗一（N = 107）無差異；實驗二（N = 85）先畫再對照，理解較好 | Fiorella 與 Zhang 2018 摘要：結果不一致 | ✅ |
| 給畫圖者額外輔助的整體效果 | 2025 統合分析：理解 g = 0.04、遷移 −0.10，皆不顯著（14 個研究） | Cromley 2020（由 2025 那篇轉述）：有顯著的整體效果 | ❌ conflict：2025 那篇自己列出這個不一致，並說自己的納入標準較嚴、研究較少 |
| 數學範例 g = 0.48（55 個研究）；加自我解釋提示是負向調節 | Barbieri 2023 摘要 | — | ✅ 單一一手；調節項係數未讀到 |
| 情境插圖對數學能力低的學生有害，圖解有幫助（92 人） | Cooper 2018 摘要 | — | ✅ 單一一手 |
| 圖加書面文字的重複 | Trypke 2023 摘要：負面 | 同篇表 4：個別研究兩個方向都有 | ⚠️ 摘要的概括比表格強 |
| 圖解的優勢是計算成本，不保證任意一張圖有用 | Larkin 與 Simon 1987 | — | ✅ 單一一手（理論） |
| 箭頭讓人寫出功能描述，無箭頭寫出結構描述 | Tversky 2011 轉述 Heiser 與 Tversky 2006 | — | ⚠️ unverified：原實驗沒讀 |
| 大學生會依結構性質選矩陣、網路或階層圖（23 人，18 個情境） | Novick 與 Hurley 2001 摘要 | — | ⚠️ 摘要層級；量的是「選圖」不是「學習成果」 |
| 讀數量的準確度排序：同軸位置最準，明暗與飽和度最差 | Cleveland 與 McGill 1984 | Heer 與 Bostock 2010 摘要：重做了空間編碼實驗 | ⚠️ 第二個來源只讀摘要，沒核對重做的結果是否一致 |
| 互動文章讀完者 41% 沒點開額外內容；手機讀者 10% 播放文末範例 | Conlen 2019 | Tse 2016：讀者只想捲動（無資料） | ⚠️ 兩者同方向，但第二個不是資料 |
| WCAG 2.2 沒有最小字級；1.4.10 把圖解排除在不得雙向捲動之外 | W3C Understanding 1.4.4、1.4.5、1.4.10 | — | ✅ 官方（只確認我讀的三則沒有） |
| iOS 預設 17pt、最小 11pt | Apple HIG Typography | Apple HIG Accessibility 同表 | ✅ |
| Distill 2021-07 宣布暫停一年，可能無限期，原因含編輯團隊過勞 | Distill 的公告頁 | Hohman 2020：互動文章的製作接近做一個網站 | ✅ |
| 本站：TB 剪枝樹 390px 標籤約 8px 高；LR 約 19px；桌機約 940px 高 | 主 session 的瀏覽器量測 | 我的無畫面渲染：TB 1042 寬、LR 435 × 902，換算字級約 5px 與 12px | ✅ 一致（標籤高約為字級的 1.5 倍） |

網站觀察（各站一頁，HTML 標籤數；Hello 演算法是 reader 輸出）：

| 頁面 | 正文量 | 圖 |
|---|---|---|
| CS50 AI 筆記 Lecture 0 | 約 3,500 字 | 6 張；DFS／BFS 逐步過程沒有圖 |
| Illustrated Transformer | 約 4,150 字 | 37 張，無 alt |
| Distill, Augmented RNNs | 約 4,300 字 | 21 個 figure |
| Red Blob Games, A* | 約 2,700 字 | 19 個 figure、21 個 canvas |
| 3Blue1Brown 文字版 | 約 4,700 字 | 16 個 figure、6 段影片 |
| Hugging Face 課程 ch1/4 | 約 2,400 字 | 每圖淺色深色各一檔 |
| CS231n 卷積網路 | 約 9,300 字 | 9 張 |
| D2L Transformer（英） | 約 12,000 字 | 18 張，93 個程式碼區塊 |
| D2L Transformer（中） | 未換算 | 18 張，122 個程式碼區塊 |
| Missing Semester 版本控制 | 約 2,500 字 | 1 張，其餘用 ASCII 圖 |
| Hello 演算法「圖的走訪」 | 約 4,300 個中文字 | 24 張：BFS 與 DFS 各一張總圖加 11 張逐步圖 |
| 演算法筆記 Graph | 約 6,200 字元 | 28 張 |
| Josh Comeau Flexbox | 約 5,900 字 | 92 個輸入元件 |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| [推論] 自己控制步調的長篇導讀，圖的效果落在各數字的低端 | Noetel 的步調調節（0.27 對 0.41） | 那個調節是跨原則的平均；長教材沒有資料 |
| [推論] 先處理圖文鄰近，再考慮多畫 | 鄰近 0.63 大於加圖 0.39 | 兩個數字來自不同的研究集合與對照條件，不能直接相減 |
| [推論] 演算法的圖要配「先預測」才有用 | Hundhausen 的 71% 對 30%；Tversky 2002 指出預測本身就有效 | 2002 年以前的動畫工具，數票法；靜態文章裡的預測題沒有直接實驗 |
| [推論] 逐步執行用狀態表或分格圖 | Tversky 2002 的論述、分段原則、Hello 演算法的做法 | **Ploetzner 2021 裡四張分格圖沒有贏過單張圖**；那是連續的機械運動，演算法是離散狀態，能不能類推不知道 |
| [推論] 單一路徑的流程用編號清單 | Larkin 與 Simon：圖省的是搜尋與比對；清單已含順序 | 沒有實驗比較流程圖與編號清單；Guo 的流程圖子集效果是正的（0.35，對照是純文字） |
| [推論] 比較用表格 | 表格把面向對齊；概念圖對條列 0.28 到 0.43 | 表格不是概念圖也不是條列，這是借用；Schroeder 的數字不算小 |
| [推論] 樹值得畫 | Larkin 與 Simon；Novick 與 Hurley 的結構分析 | 兩者都不是學習成果的實驗 |
| [推論] 文字寫推理、圖呈現結構，不逐句重複 | Trypke 的通道重複 | 表 4 兩個方向都有；無障礙要求文字等價物 |
| [判斷] 圖內文字下限 12px | Apple 最小 11pt 加餘裕 | 沒有準則給這個數字；中文筆畫密是我的理由 |
| [推論] TB 同一層最多 3 個節點 | 本站實測每節點約 115px、可用寬度約 326px | 無畫面渲染與替代字型；節點文字長短會改變寬度 |
| [判斷] 處理順序：拆圖 → 表格或清單 → 改方向 | 上面幾條的組合 | 拆圖的依據本身是推論 |
| [判斷] 各做法的成本排序 | 我對工具的認識，只查了 rehype-mermaid 與 D2 的文件 | Graphviz、Excalidraw、TikZ 沒查證 |
| [推論] 「先畫再對照」可以做成自我檢查題 | Fiorella 與 Mayer 2016；2025 統合分析的整合調節項；Zhang 與 Fiorella 2021（摘要） | 教材都是科學文本，離演算法有距離 |

## 草稿骨架

### 核心概念
教學文章裡的圖解決的問題是「讀者要同時比對好幾個元素、或反覆回頭找東西」。圖有沒有用主要看兩件事：讀者找得到圖文之間的對應，以及讀者有沒有拿圖做事。

### 關鍵設計決定
- 依內容類型選表示法（對應表）。
- 圖文鄰近、用同一組詞、線型當訊號。
- 圖前放預測題。
- 手機寬度當硬限制：同層 3 個節點、原始寬度 435px。

### 跟替代方案的比較
靜態圖、分格圖、動畫、互動圖的證據與成本；mermaid 與其他工具。

### 適合 / 不適合的情境
適合：複雜、元素互相牽連的內容；樹、資料流、幾何、數量。不適合：裝飾、簡單內容的重複、手機上讀不到的圖、藏在互動後面的重要內容。

### 限制 / 已知問題
短教材、對照組是純文字、統合分析品質、轉引、演算法視覺化年代久、對應表多半是推論、分格圖有一個反例。

### 取捨總結
先做便宜而且證據直接的（鄰近、預測題、表格與清單），再考慮多畫；動畫與可操作的圖成本高、在自己捲動的文章裡證據弱。

## 待解問題
- 長篇教材裡圖的邊際效果：沒有研究。
- 分格靜態圖用在離散的演算法狀態上，是否優於單張圖或動畫：沒有直接實驗。
- Barbieri 的自我解釋調節項的係數與信賴區間：沒讀到。
- Heiser 與 Tversky（2006）的箭頭實驗原文：沒讀。
- Noetel 的期刊版與預印本的數字是否一致（受試人數在預印本內就有兩個版本）。
- 各網站在手機寬度下的實際版面。
- （已解決）文章裡的 mermaid `accTitle` 在 `securityLevel: 'strict'` 下會輸出 `<title>` 與 `<desc>`：獨立審稿者實測確認。

## 第三輪更新（2026-10-13，文章改寫後）

- 升級成全文：Schroeder 2018（作者稿）、Rey 2019、Fiorella 與 Mayer 2016、Ploetzner 2021（補讀討論）。
- 仍只有摘要、文章不列進參考資料：Schroeder 與 Cenkci 2018、Schneider 2018、Sundararajan 與 Adesope 2020、Höffler 與 Leutner 2007、Novick 與 Hurley 2001、Fiorella 與 Zhang 2018、Zhang 與 Fiorella 2021、Cromley 2020。文章提到時都標「只讀到摘要」並放行內連結；它們的數字只以「Noetel 轉引」或「Berney 轉述」的形式出現。
- 文章沒有引用：Van Meter 與 Garner 2005、Ainsworth 2011、Ainsworth 與 Scheiter 2021、Hegarty 2004、Urquiza-Fuentes 2009、Sorva 2013。
- 因此降強度或改寫的結論：分格圖（從「間接支持」改成「有論述、有一個反例」）；動畫（從「小效果」改成兩篇並列）；畫圖輔助（兩篇統合分析並列，不裁決）；概念圖對條列（從「只好一點」改成「小到中等」）；「先畫再對照」的依據從摘要換成 Fiorella 與 Mayer 的全文。
- `.work/learning-visualization-research/report.md` 不再產出，以本 note 為準。

## 第四輪更新（2026-10-13，依獨立審稿修正）

- 「先處理圖文鄰近再考慮多畫」在文章裡改標為推論，並寫出 0.63 與 0.39 不能直接比的理由（對照條件不同、研究集合不同）；tldr 與開頭的結論句同步降調。
- Hundhausen：補 5.1.4 的 6/9 與 10/14；「只觀看沒有顯著優勢」出自 6.3 節，原文帶「With few exceptions」，文章補上這個保留與表 2 的 Byrne 反例；Naps 的假設一補上小樣本的保留。
- Höffler 與 Leutner：刪掉「兩篇共同的地方是條件」；三個條件只歸給 Berney 與 Bétrancourt。
- 概念圖：補讀 Schroeder 作者稿的 Comparison Treatment 一節。讀現成的概念圖對「讀或寫條列」g = .43（p = .02），對讀文字 .29（k = 39）；先前寫的「把讀與畫合在一起算」是錯的，合併的是對照組那一邊。
- Cooper 2018 補讀結果與限制（圖解 OR = 5.94；插圖對能力低一個標準差的學生有害）。
- 畫圖輔助統合分析的作者：Leutner 與 Biele，Crossref 確認。
- 兩篇只讀摘要的畫圖研究改成只記存在，不描述結果。
- 網站字數統一為不含程式碼區塊；D2L 重數為約 1,900 字、5 張圖，移出「圖少」的一組。
- 英文版改用英文頁的實測（254 × 382、630 × 810、470 × 902），英文頁的 LR 剪枝樹約 11px，低於 12px。
- 交叉表更正：「概念圖對條列」一列的第二來源應讀作「讀現成的概念圖對讀或寫條列 0.43（k = 13）」。

## 第五輪更新（2026-10-14，複審後）

- **兩版的實測表格主角不同是刻意的。**中文版「本站的現況」那張表用中文頁（`…w00-search.md`）的尺寸，英文版用英文頁（`…w00-search-en.md`）的尺寸，另一頁的數字各放在表格後的補充段。兩頁的標籤長度不同，所以流程圖與由左往右的剪枝樹尺寸不同（中文頁 556 × 770、435 × 902；英文頁 630 × 810、470 × 902）。日後不要把兩版改成同一組數字。「搜尋流程圖」與「剪枝樹」兩節裡的數字同理。
- 概念圖一節：「自己畫比讀現成的大」只對 Schroeder 2018 成立（0.72 對 0.43）。Nesbit 與 Adesope 2006 的表 6 沒有整體比較，數字隨對照組而定（畫對聽課 0.74、畫對寫摘要或大綱 0.19；讀對讀文字 0.39、讀對條列或大綱 0.28）。文章已改寫，小節標題也改了。
- 網站表格的計數腳本與輸出存在 `.work/learning-visualization-research/site-counts/`。

## 第六輪更新（2026-10-14，第二輪複審後）

- Nesbit 與 Adesope 2006 重讀：結果一節全部（表 1 到表 8）與結論。表 2 有整體數字：全部 .604（k = 67）；Maps constructed .819（k = 27；美加 .467、非洲 1.446、台灣 −.003）；Maps studied .373（k = 40）。第五輪寫的「Nesbit 與 Adesope 沒有畫對讀的整體數字」是錯的，那一輪我和審稿者都只看了表 6。
- 讀取完整度更正：Nesbit 與 Adesope 2006 — ✅ 摘要、結果全部、結論；🟡 引言片段；方法與附錄 A–C 未讀。
- 交叉表補一列：畫概念圖的整體效果大於讀現成的 — Schroeder 2018：.72 對 .43；Nesbit 2006：.82 對 .37（美加 .47 對 .37）— ✅ 方向一致，但兩篇都不是同一批研究內的直接比較；畫的研究全在教室、對照組常為講課，讀的研究多在實驗室。
- 教訓：引用一張表之前，把同一節的其他表與表前後的說明文字一起讀完。
