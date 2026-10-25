# 精讀紀錄：order 14 姿勢與背痛（Sadler 2017 為主；Igwesi-Chidobe 2025、Liu 2026、Valenciano 2020 為輔）

## A. Sadler 等 2017（主來源，全文已讀）
- 書目：Sadler SG, Spink MJ, Ho A, De Jonge XJ, Chuter VH. Restriction in lateral bending range of motion, lumbar lordosis, and hamstring flexibility predicts the development of low back pain: a systematic review of prospective cohort studies. BMC Musculoskelet Disord 2017;18:179. DOI 10.1186/s12891-017-1534-0；PMID 28476110；PMCID PMC5418732（皆以 Europe PMC `EXT_ID:28476110 AND SRC:MED` 回傳核對）。CC BY。
- 取得：Europe PMC fullTextXML（Groundlane web_fetch，53,009 字元，truncated=false）。讀了摘要、背景、方法、結果（含 Table 1–3）、討論、限制、結論。**沒讀：** 補充檔 1–4（搜尋策略、排除清單、非顯著的 forest plot、單一研究的風險因子）、參考文獻內容。
- 設計：12 篇前瞻性世代研究，5,459 人，追蹤 12 個月（Milgrom 14 週）；品質工具為 Weightman 的通用觀察性研究工具，**沒有 GRADE**。隨機效應模型。
- 引文已用 python 對全文逐字比對（空白正規化），皆吻合：

| 內容 | 原文 |
|---|---|
| 作者提醒（腰椎前凸、腿後肌） | "some caution is advised when interpreting these significant meta-analyses"（全句 "... due to the mixed populations of the included studies and the close proximity of the upper band of the confidence interval for the lumbar lordosis and hamstring ROM meta-analyses, some caution is advised ..."） |
| 以前痛過 | "previous LBP has been shown to be a risk factor for the development of LBP [23], making the establishment of a cause and effect relationship difficult" |
| 腿後肌受單一研究主導 | "the dominance of one study in the analysis [31] and the fact that the confidence intervals are close to the point of no effect" |
| 骨盆參數 | "other sagittal plane parameters, such as sacral slope and pelvic incidence, can influence the degree of lordosis and these parameters themselves, although not reported in the included studies, could be associated with the development of LBP" |
| 先痛後改變姿勢的可能 | "the degree of lumbar lordosis may change in response to LBP developing so that symptomatic relief may be achieved through adopting a position that is similar to those who are asymptomatic" |
| 各研究用不同儀器 | "Each study used a different device to measure lumbar lordosis" |
| 結論 | "we found that a restriction in lateral flexion and hamstring ROM, as well as, reduced lumbar lordosis were associated with an increased risk of developing LBP over a 12 month period" |
| 討論用語（比結論強） | "restrictions in lateral flexion ROM, hamstring flexibility, and lumbar lordosis were found to increase the risk of participants developing LBP"（討論用 increase the risk；結論用 associated。文章用 associated） |
| 臨床建議（作者推論，未檢驗） | "Advising patients of the relationship of these musculoskeletal measures to LBP plus the therapy options to modify these risk factors may potentially serve to prevent the development of LBP" |
| 病因多因性 | "The aetiology of LBP is multifactorial" |

- 數字（Table 3 / 結果段，非逐字引文而是數值，已對照）：腰椎前凸 3 篇（Adams、Milgrom、Nissinen）、1,657 人，OR 0.73（0.55–0.98，p=0.034），I²=29.7%；儀器分別是 3Space Isotrak、Cybex 傾斜儀、spinal pantograph；平均年齡 12.8–27 歲。側彎 3 篇、1,364 人，OR 0.41（0.24–0.73）。腿後肌 3 篇、1,771 人，OR 0.96（0.94–0.98），Feldman 權重 99.92%。不顯著：腰椎伸展／屈曲活動度、指尖到地、背肌力、背肌耐力、腹肌力、豎脊肌與腰方肌截面積、股四頭肌柔軟度。
- 作者列的限制：只納英文、追蹤上限 12 個月、Milgrom 只有 14 週、納入的研究少（非顯著結果「definitive conclusions cannot be drawn」）、族群混合（有／無痛史）、LBP 定義不一、未報告 LBP 類型與持續時間、沒有檢查發表偏誤（<10 篇）。
- 設計層次的限制（我的歸類，非作者逐字）：觀察性、無法排除先痛後改姿勢；OR 方向的解釋（OR<1 = 前凸較小者較高風險）是作者換算 1/0.73=1.37。作者寫「37% greater likelihood」，OR 嚴格說是勝算，文章寫「勝算較高、約高 37%」。

### 要小心的
1. 作者在討論用 "increase the risk"，結論與標題用 "predicts"／"associated"。文章用「關聯」。
2. 作者的臨床建議（告知患者、治療這些因子可預防）沒有被這份回顧檢驗，不寫成結果。
3. 「前凸較小」是站立時的角度，三個研究量法、參考點不同。不能寫成「平背是原因」。
4. 這份回顧沒有「前凸變大」或「骨盆前傾」的資料，文章寫「這份來源沒有直接資料」。
5. 受試者平均年齡 12.8–27，不能外推到老年人。

## B. Igwesi-Chidobe 等 2025（範圍回顧，F1000Research 14:44 v2，PMID 41230187，PMCID PMC12603532，CC BY）
- 取得：Europe PMC fullTextXML 只回傳表格內容（52,338 字元，無正文段落）；改用 jina read_url 抓 Europe PMC PDF（228,301 字元，含審稿紀錄），讀了簡介（前半）、Discussion、Limitations、Conclusions。**沒讀：** 結果段逐項工具評分、附錄、審稿回覆（只看到片段）。
- 引文已程式比對（對 PDF 文字＋XML 文字）皆吻合：
  - "The role of posture in spinal pain is unclear"（摘要）
  - "Twenty-eight distinct postural outcome tools"（摘要）
  - "No universal ideal posture has been identified for preventing or reducing back and neck pain."（討論，**作者陳述，非回顧測得的結果**）
  - "Existing postural outcome tools have limited clinical utility for back and neck pain."（結論）
  - "could explain the conflicting evidence regarding the effectiveness of interventions with a postural component"（討論，作者推測）
  - "simplistic at best"（討論，作者對「不良姿勢造成疼痛」舊觀念的評語）
- 作者列的限制：只含英文與已索引文獻；成人較適用；部分工具可能有未發表的效度資料；「易用性」定義可能太嚴。
- 要小心：作者立場明確偏向 biopsychosocial 模型；「害怕活動／恐懼迴避」是他們的推理，不是回顧的結果。文章已標為作者推論。這是範圍回顧，沒有合併效果量。

## C. Liu 等 2026（Int J Occup Med Environ Health 39(4):348–62，PMID 42823924，PMCID PMC13674534，CC BY）
- 取得：Europe PMC fullTextXML，全文讀完（114,294 字元，truncated=false）。
- 設計：系統性回顧，10 篇（7 實驗室實驗、1 模型、2 橫斷式現場），敘事整合，無統合分析；ROBINS-I。
- 用到的：Khoddam-Khorasani 2020（15 位健康成人，模型）：lordotic 姿勢舉重，節段壓力 +7 至 46%、剪力 +5 至 48%（相對 kyphotic）；兩項現場橫斷式研究（Gomes 2023 自填問卷，風險 serious；Rahman 2025 護理人員 13 vs 13）；作者寫 "Observational field studies found associations ... but cannot confirm causality"。
- 要小心：作者結論「direction of lumbar spine motion ... important modifiable risk factor」比他們的設計強（實驗室負荷＋橫斷式）；文章不採用該結論。受力不等於疼痛。作者引用 Swain 2020（41 篇、因果不確定），那是轉述，我未依此引用 Swain 的細節。
- 引文：文章沒有放 Liu 的英文引文。

## D. Valenciano 等 2020（Rev Paul Pediatr 39:e2020005，PMID 33146294，PMCID PMC7594503，CC BY）
- 取得：Europe PMC fullTextXML 全文讀完。7 個隨機試驗，2,568 名 6–12 歲兒童；測的是知識與姿勢習慣；只有一篇有清楚的隨機化與分配隱匿；全部至少一個領域高風險或有疑慮；無法做統合分析。**沒有疼痛結果。**
- 文章用轉述（無英文引文）。

## E. 只讀到摘要的來源（Europe PMC `resultType=core` 回傳的摘要）
- Swain 等 2020 J Biomech 102:109312，PMID 31451200，DOI 10.1016/j.jbiomech.2019.08.006：umbrella review，41 篇系統性回顧；用 AMSTAR 與 Bradford Hill；摘要："no consensus regarding causality"、"Association has been documented but does not provide a causal explanation"。不在 Europe PMC 全文。**未讀全文。**
- Chun 等 2017 Spine J 17:1180，PMID 28476690，DOI 10.1016/j.spinee.2017.04.034：13 研究，796 LBP／927 對照，影像量前凸；LBP 者前凸角度傾向較小；異質性高；年齡配對的 6 篇 SMD −0.33（−0.46 至 −0.21）。文章只用「傾向較小、差異大」。**未讀全文。**
- Mahmoud 等 2019 Curr Rev Musculoskelet Med 12:562，PMID 31773477，PMCID PMC6942109，DOI 10.1007/s12178-019-09594-y：15 橫斷式研究；成人有頸痛者頭前傾較明顯，青少年無；年齡為干擾因素。fullTextXML 回 HTTP 500。**未讀全文。**
- Rani 等 2023 Indian J Orthop 57:371，PMID 36825268，PMCID PMC9941407，DOI 10.1007/s43465-023-00820-x：26 篇；顱椎角在有痛與無痛者之間有顯著差，SHA 與 FHP 不顯著。fullTextXML 回 HTTP 500。**未讀全文。**
- 這四篇的英文都沒有放進文章當引文（引文比對只做了 Sadler 與 Igwesi）。

## 對本篇的影響
- 範圍縮小為：腰椎前凸（Sadler 為主）、頸部姿勢（摘要層級）、舉重受力（Liu）、姿勢量法（Igwesi）、矯正姿勢介入（Valenciano＋Igwesi 的作者陳述）。
- 「矯正姿勢能否減少疼痛」沒有找到可讀的直接系統性回顧，文章如實寫「在我查的範圍內沒有找到」。
- 未涵蓋：圓肩、胸椎後凸、骨盆前傾的專門來源（Singla 2017 為敘事回顧且非開放，未用）。
