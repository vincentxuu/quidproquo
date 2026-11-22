# 抽取紀錄：Szpunar, Khan & Schacter 2013，Interpolated memory tests reduce mind wandering and improve learning of online lectures

- **書目**：Karl K. Szpunar, Novall Y. Khan, Daniel L. Schacter (2013). Interpolated memory tests reduce mind wandering and improve learning of online lectures. *Proceedings of the National Academy of Sciences*, 110(16), 6313–6317. doi:10.1073/pnas.1221764110。PMC3631699，PMID 23576743。作者全名、卷期頁由 2026-10-14 以 NCBI efetch 取得的 PMC 後設資料核對（本機 txt 沒有題名頁）。投稿 2012-12-13，接受 2013-02-18；編者 Sean Kang。
- **原文檔**：`.work/video-guide-research/dl2/szp-full.txt`（PMC 網頁轉文字，73 行、31,815 字元；HTML：`szp-full.html`）。同目錄的 `szp-full.xml` 其實是 Europe PMC 的 500 錯誤訊息，不是全文。
- **取得網址**：https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/ （PMC，出版者存放的刊出版全文）。
- **版本**：刊出版（PMC 網頁版）。
- **補充材料（SI）**：**沒有取得**。PMC 的 SI 連結（`/articles/instance/3631699/bin/1221764110_pnas.201221764SI.pdf`）是 proof-of-work 下載頁，curl、Exa、headless／有頭 Chromium（playwright-core）都只拿到 HTML 或 403；PNAS 的 suppl 網址被 Cloudflare 擋、Exa 逾時。正文指向 SI 的內容（評分細節、retrieval 階段因素的分析）因此沒讀。
- **讀取日期**：2026-10-14。
- **供哪幾篇使用**：系列第 5 篇（影片）。

## 研究設計

- **類型**：兩個受試者間實驗；測驗頻率由研究者操弄，受試者被告知是電腦隨機決定（L7）。
- **受試者**：哈佛大學部學生，兩個實驗共 n = 80（L7、L27）；實驗一 32 人（兩組，依 t(30) 推算各 16 人），實驗二 48 人（三組，依 t(30) 的兩兩比較推算各 16 人）。性別、年齡未報告。
- **教材**：經濟系開的統計學導論講課錄影，取 21 分鐘，用 iMovie 切成四段，每段約 5.5 分鐘（L11、L27）。受試者拿到投影片／講義，被要求像在課堂一樣學；段與段之間講義由實驗者收起（L29）。
- **每段之後的流程**（圖 1，L11；L29）：先 1 分鐘算術（6 題、每題 10 秒），再依組別做 2 分鐘測驗（6 題簡答、每題 20 秒）或 2 分鐘算術（12 題）。
- **實驗一**：tested 組每段後都考；nontested 組只在第四段後考（L8、L29）。上課後玩 5 分鐘 Tetris，接著用七點量表自評分心、分心是否越來越多、對總測驗的焦慮，然後做 24 題總測驗（四段全部題目、新隨機順序、自定步調）（L29）。
- **實驗二**：多一個 restudy 組——前三段後看同樣 6 題連同答案（每對 20 秒），第四段後才考（L11、L31）。上課中每段在隨機時間點（距段首尾至少 30 秒）口頭問一次「Are you mind wandering?」，影片不停，受試者在紙上勾是／否，共四次（L31）。另做 20 題 PANAS（對總測驗的正負向情緒）與「學這堂課多費心力」七點量表（L31）。
- **主要依變項**：第四段題目的答對比例（學習的「尾段」）；加了個人筆記的投影片比例；分心（實驗一自評、實驗二探測）；總測驗成績；焦慮與費力感。
- **何時量**：第四段測驗在第四段之後立即；總測驗在上課後 5 分鐘休息之後，同一次實驗內。沒有延後測驗。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 實驗一：自評分心次數 | Mdn 4 vs 5，z = 2.02，P = 0.044 | tested vs nontested | Results, Exp 1 | L14 | 「significantly fewer bouts of mind wandering (Mdn = 4 vs. 5), z = 2.02, P = 0.044」 |
| 2 | 實驗一：分心隨課程增加 | Mdn 3.5 vs 5.5，z = 2.23，P = 0.026 | 同上 | 同上 | L14 | 「significantly less likely to have increased as the lecture progressed (Mdn = 3.5 vs. 5.5), z = 2.23, P = 0.026」 |
| 3 | 實驗一：加筆記的投影片比例 | 17% vs 6%，t(30) = 2.63，P = 0.013，d = 0.93 | 同上 | 同上 | L14 | 「(M = 17% vs. 6% of slides with additional notes), t(30) = 2.63, P = 0.013, d = 0.93」 |
| 4 | 實驗一：第四段答對率 | 84% vs 59%，t(30) = 2.87，P = 0.008，d = 1.03 | 同上 | 同上 | L14 | 「(M = 84% vs. 59%), t(30) = 2.87, P = 0.008, d = 1.03」 |
| 5 | 不比較各段 | tested 組各段之間沒有比較，因為段落順序沒有操弄（兩個實驗都是） | — | 同上 | L14 | 「Comparisons of performance across the four segments … were not carried out because the order of presentation of lecture segments was not manipulated」 |
| 6 | 實驗二：分心探測 | 整體 F(2,45) = 3.43，P = 0.041，η² = 0.16；tested 19% vs restudy 39%（d = 1.05）、vs nontested 41%（d = 1.01） | 三組 | Results, Exp 2 | L19 | 「students in the tested group reported fewer instances of mind wandering (M = 19% of probes) than students in the restudy (M = 39%) and nontested groups (M = 41%)」 |
| 7 | 分心與理解的斜率 | 整體 b = −2.10，t(46) = 4.77，P < 0.001；組別交互作用不顯著 F(5,42) = 1.18，P = 0.32 | 三組 | 同上 | L19 | 「although testing curbed the occurrence of mind wandering, testing was not related to the intensity of influence of mind wandering on learning.」 |
| 8 | 實驗二：加筆記的投影片比例 | F(2,45) = 9.45，P < 0.001，η² = 0.30；24% vs 9%（d = 1.26）、vs 7%（d = 1.39） | 三組 | 同上 | L19 | 「students in the tested group (M = 24% of slides with additional notes) took significantly more notes … than students in the restudy (M = 9%) and nontested groups (M = 7%)」 |
| 9 | 實驗二：第四段答對率 | F(2,45) = 4.95，P = 0.011，η² = 0.18；89% vs restudy 65%（t(30) = 2.88，P = 0.007，d = 1.06）、vs nontested 70%（t(30) = 2.85，P = 0.008，d = 1.01） | 三組 | 同上 | L19 | 「the tested group correctly answered more questions about the fourth lecture segment (M = 89%) than students in the restudy (M = 65%) and nontested groups (M = 70%)」 |
| 10 | restudy vs nontested（**無效果**） | 所有指標都沒有差別，ts < 1 | restudy vs nontested | 同上 | L19 | 「The restudy and nontested groups did not differ from one another in any respect (ts < 1).」 |
| 11 | 實驗二：焦慮 | χ²(2, n = 48) = 13.16，P = 0.001；Mdn 2 vs restudy 4（z = 3.78，P < 0.001）、vs nontested 3.5（z = 2.29，P = 0.003） | 三組 | Phenomenological Ratings | L21 | 「students in the tested group (Mdn = 2) reported significantly lower levels of anxiety toward the final cumulative test」 |
| 12 | 實驗二：負向情緒（PANAS） | F(2,45) = 8.68，P = 0.001，η² = 0.28；12/50 vs 22（d = 1.65）、vs 17（d = 1.13）；正向情緒**無效果** | 三組 | 同上 | L21 | 「(there was no effect of condition on positive affect)」 |
| 13 | 實驗二：費力感 | χ²(2, n = 48) = 9.19，P = 0.01；Mdn 2 vs 4（z = 2.96，P = 0.003）、vs 3.5（z = 2.15，P = 0.032） | 三組 | 同上 | L21 | 「students in the tested group reported that their experience of learning the lecture was less mentally taxing (Mdn = 2)」 |
| 14 | 合併兩實驗：總測驗上的第四段題目 | tested 86% vs restudy 66% vs nontested 72%，最小 t = 2.50，P = 0.015，d = 0.63 | 三組（restudy 只來自實驗二） | Discussion | L23 | 「students in the tested group retained more information from the fourth lecture segment on the final test (M = 86%) than students in the restudy (M = 66%) and nontested (M = 72%) groups」 |
| 15 | 合併兩實驗：總測驗全部四段 | tested 90% vs restudy 76% vs nontested 68%，最小 t = 3.31，P = 0.002，d = 1.38 | 同上 | Discussion | L23 | 「scored better across the entire final cumulative test (i.e., across all four segments of the lecture; M = 90%) than students in the restudy (M = 76%) and nontested (M = 68%) groups」 |
| 16 | 合併：restudy vs nontested（**無效果**） | 兩項都沒有差別，最大 t = 1.51，ns | 同上 | Discussion | L23 | 「There were no differences between the restudy and nontested groups in either respect, largest t = 1.51, ns.」 |
| 17 | 作者結論 | 檢索的動作才是關鍵 | — | Discussion | L23 | 「Hence, the act of retrieving relevant lecture content was critical for enhancing retention」 |

## 作者自己列的限制

正文沒有限制節。只在 L14 說明不比較各段（段序沒操弄），並在 L24 提到未來要釐清測驗頻率、題型、檢索是否必須與講課內容相關等參數。焦慮降低的原因作者只推測（習慣題型或早先測驗的正向回饋，L24），沒有檢驗。

## 與摘要說法不一致的地方

- 摘要（L2）說頻繁測驗與「reduced anxiety toward a final cumulative test」「reductions in subjective estimates of cognitive demand」有關；正文只報告實驗二的焦慮與費力感結果。實驗一也量了焦慮（L29），正文沒有報告結果。
- 第 11 項：z = 2.29 對應的雙尾 p 約 .022，正文寫 P = 0.003，數字內部不一致（PMC 版原文如此，沒有 PDF 可對；不確定是 z 還是 P 打錯）。
- 其餘逐項對過，沒有。

## 與清單『要撐的結論』不合的地方

清單 V-8 列「84% 對 59%、d = 1.03、32 人／48 人與各組比例」，全部對得上（結果 #4、#6、#8、#9）。補充：實驗二 restudy 組第四段 65% 反而低於 nontested 的 70%（兩者 ts < 1）。

## 已發佈文章引用核對（第 5 篇，行號為 2026-10-14 實查）

| 行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| L174 | 兩個實驗、哈佛大學部學生、21 分鐘統計課錄影、切四段 | L7、L11、L27 | 一致 |
| L174 | 一組每段後考幾題、另一組只在最後一段之後考 | L8、L29 | 一致（6 題） |
| L174 | 第四段每段都考 84%、另一組 59% | L14 | 一致（實驗一） |
| L174 | 每段都考的人自述分心較少，筆記也記得較多 | L14 | 一致；筆記是研究者數投影片上的個人筆記，不是自述，句子讀起來像兩者都是自述，可以分開寫 |
| L176 | 實驗二多一組：每段後把同樣題目連同答案讀一遍 | L11、L31 | 一致 |
| L176 | 每段都考的組結果和第一個實驗一樣好 | 第四段 89%（實驗一 84%） | 一致 |
| L176 | 只讀題目答案的組，分心比例與第四段成績都接近不考的組 | 39% vs 41%；65% vs 70%；ts < 1（L19） | 一致 |
| L176 | 最後總測驗上，論文報告這兩組沒有差別 | L23，最大 t = 1.51 | 一致；這是「合併兩實驗」的分析 |
| L222 | Szpunar 的錄影 21 分鐘 | L7 | 一致 |
| L231 | 讀了全文，補充材料沒有讀 | SI 本輪仍未取得 | 一致 |
| L254 | 兩個實驗共 80 人；21 分鐘、四段各約 5.5 分鐘 | L7、L11 | 一致 |
| L254 | 每段後 1 分鐘算術，再 2 分鐘測驗（6 題）或 2 分鐘算術；最後 24 題總測驗 | L11、L29 | 一致 |
| L254 | 實驗一 32 人：筆記 17% vs 6%，第四段 84% vs 59%（d = 1.03） | L14 | 一致 |
| L254 | 實驗二 48 人、三組、隨機問四次分心：19%、39%、41%；筆記 24%、9%、7%；第四段 89%、65%、70% | L19、L31 | 一致 |
| L254 | 合併兩實驗的總測驗三組 90%、76%、68%，重讀組與不考組沒有顯著差別 | L23 | 一致 |
| L254 | 每段都考的組對總測驗焦慮較低，也覺得上課較不費力 | L21 | 一致，但只有實驗二的資料（實驗一焦慮未報告） |
| L270 | 參考資料「讀了全文，不含補充材料」 | — | 一致 |

## 讀取紀錄

- txt L1–74 依序讀完（摘要、引言、設計說明、圖 1 圖說、結果實驗一、圖 2 圖說、結果實驗二、主觀評分、討論、方法、致謝、註腳、參考文獻、附屬資料）。每行是一整段，全部讀過。
- 沒有表；圖 1、圖 2 只有圖說（PMC 網頁版的圖是影像，數字都在正文），沒有對 PDF 版面。
- 書目後設資料另以 NCBI efetch（PMC XML 前段）核對。SI 未取得（見檔頭）。
