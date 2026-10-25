# 查證與取得紀錄：2026-10-25-motor-learning（認識人體 order 11）

## 來源與讀取程度

| 來源 | PMID／PMCID | 讀取程度 |
|---|---|---|
| Czyż 2024 Sci Rep（保留） | 38987617／PMC11237090 | 前 10 萬字元：摘要、方法、統合分析結果、討論、限制、結論。未讀：系統性回顧段（立即保留）、表 1 後半、表 2 逐筆、附錄 |
| Czyż 2024 Front Psychol（遷移） | 39205981／PMC11349744 | 全文（69,813 字元，未截斷）；補充表未讀 |
| Tassignon 2021 Front Psychol | 34025487／PMC8138164 | 全文讀完 |
| Hassar 2026 NBR | 42480681／無 PMC | 只讀 Europe PMC 摘要；doi.org 回 CAPTCHA（Groundlane web_fetch 403），出版社頁未取得 |

PMID／PMCID／DOI 皆取自 Europe PMC 回傳（`EXT_ID:<PMID> AND SRC:MED` 或題名搜尋結果）。精讀紀錄：`.work/research/human-body-basics/extractions/motor-learning.md`。

## 試過的管道（找免費來源）

- 規劃表候選 Hassar 2026（非開放）、Tassignon 2021（開放）。
- scan/A-muscle.md、G-textbooks-taiwan.md 等：動作控制沒有開放授權教科書（G 已記 Schmidt & Lee 只是 Open Library 書目、BCcampus Basic Motor Control 是電機馬達，排除）。
- Europe PMC REST 搜尋（Groundlane web_fetch）：題名含 motor learning／skill acquisition／contextual interference／focus of attention 等且 OPEN_ACCESS:y 的系統性回顧；找到 Czyż 2024 兩篇後採用。其他候選（內隱 vs 外顯 Kal 2018 PMC6124806、外在注意焦點、擴增回饋 Cureus 2021）本篇未讀。
- 「deliberate practice」「10,000 hours」「muscle memory」題名搜尋（OPEN_ACCESS:y）：回傳多為醫學教育模擬訓練與肌肉細胞層級研究，沒有切題的免費系統性回顧；沒有搜 Macnamara 2014 等特定文獻，也沒有試非 Europe PMC 的來源。文章因此寫「在我查的範圍內」。
- curl 連 ebi.ac.uk 回 403（環境白名單），改用 Groundlane web_fetch。

## 逐字引文比對（python，空白／細空白／不換行空白正規化後）

全部吻合：
- Tassignon: "a set of processes associated with practice or experience leading to relatively permanent gains in the capability for skilled performance"；"inferences about the effectiveness of DL would be premature"
- Czyż 保留: "random practice condition hinders performance during acquisition, although it facilitates retention and transfer"；"Unfortunately, studies on the CI effect are of poor quality."；摘要句 "in the applied setting, the beneficial effect of random practice on the retention was almost negligible"；"the review has been split into two consecutive papers: retention and transfer"
- Czyż 遷移: "None of the included studies was assessed as strong."

文章中的 “applied setting” 與 “almost negligible” 是從上列摘要句截取的片段。

## 文章裡不在來源逐字內的說法

- 「保留是學習的好指標，遷移是適應力的好指標」：遷移回顧的原文 "Retention is a good indicator of learning, whereas transfer is a good indicator of adaptability (Magill and Anderson, 2021)"，文章轉述並標「轉述教科書的說法」，沒加引號。
- 「這個現象最早在 1966 年語文學習被報告，1979 年起有人用動作任務檢驗」：取自保留論文引言（Battig 1966 verbal；Shea & Morgan 1979 為第一個動作任務研究）。
- 「分區塊／隨機穿插」的白話例子（20 次 A 再 20 次 B）是本文舉例，來源的定義是 "trials corresponding to one skill variation were completed before introducing the next skill"／ "trials arranged randomly with rapidly changing order"。
- 「兩份用品質檢核表、沒給 GRADE 等級」：保留篇用 EPHPP，遷移篇用 Quality Assessment Tool for Quantitative Studies（EPHPP 的別名）；我沒看到兩篇有 GRADE 評級，但保留篇方法段只讀到工具名稱處。
- 「差異學習不重複同一個動作、不給糾正式回饋」：引言原文 "no exact repetition, and without corrective feedback on the movement pattern"。
- 「表 1 許多實驗 DL 組無回饋、對照組有糾正式回饋」：我的讀法，文章已標「我自己的讀法」。
- 「作者還提醒…年齡和場景糾在一起」：原文討論，"it is difficult to differentiate whether participants' age plays a crucial role"。
- 效果量慣例 0.2／0.5／0.8：保留篇方法段 "small, SMD = 0.2; medium, SMD = 0.5; and large, SMD = 0.8"。
- 「第一份只有 3 項達到中等以上」：原文 "only three articles out of 54 presented moderate or high quality"（引用數字上標）。

## 刻意不寫的內容

- 保留篇內部的不一致（成人三層模型 p 值、討論句「實際場景只有兒童」）；寫在精讀紀錄。
- Hassar 2026 的數字（43 個實驗中 28 個…）：只讀摘要，不引數字。
- 神經機制（差異學習的前額葉過載解釋、CI 的腦部研究）：不在讀取範圍的核心，且 Tassignon 自己說機制有爭議。
- 回饋、注意焦點、睡眠與鞏固、動作控制模型。
- 任何練習處方（每週練幾次、怎麼排課表）。
- 一萬小時、肌肉記憶：不寫成事實，只寫「沒找到可驗證來源」。

## 未解決

1. Czyż 兩篇的註冊敘述不一致（保留篇寫 PROSPERO CRD42021228267，遷移篇寫 "clinicaltrials.gov" 識別碼同為 CRD42021228267）；文章沒寫註冊平台。
2. Ammar 2023 的統合分析（"The myth of contextual interference learning benefit in sports practice"）未讀；文章只轉述兩位作者的描述（小且不顯著），並明講沒讀。若主代理想平衡，可補讀（Educ Res Rev 39:100537）。
3. 保留篇 Sci Rep 全文在 10 萬字元處截斷（只截到參考文獻），結論段已讀；系統性回顧段（立即保留）未讀。
4. Tassignon 摘要 acquisition d = 0.26，結果段 d = 0.27；文章用摘要值 0.26。
5. 英文版有一處站內連結文字用該文英文標題縮短版（"Plateaued in Climbing, Should You Start Training?"）。

## 已跑的檢查

check-tw-terms／process-leak／post-references／post-quality／lang-parity 皆通過（見提交前最後一次輸出）。未跑 lint／astro check／verify（缺依賴）。

## 審稿後更正（2026-10-25，第二階段）

新讀來源（Groundlane web_fetch，Europe PMC fullTextXML，extract=full）：
- Ericsson & Harwell 2019（PMC6824411，Front Psychol，DOI 10.3389/fpsyg.2019.02396）：取回前 10 萬字元（截斷）；讀了摘要、引言（一萬小時段落）；後段（遺傳、建議）只掃關鍵字。Ericsson 是原始研究作者，文章已標「立場不中立」。
- Macnamara & Maitra 2019（PMC6731745，R Soc Open Sci，DOI 10.1098/rsos.190327）：全文 67,145 字元，未截斷；讀了摘要、引言、討論、結論。樣本人數未讀，文章不寫。
逐字比對（python，正規化空白）皆吻合：“there was no evidence for a magical number”；“around 25,000 h would be more accurate”；“We did not replicate the core finding that accumulated amounts of deliberate practice corresponded to each skill level.”；“explained 26% of the variance”／“explained 48% of the variance”；“all methods and analyses were preregistered”。文章只直接引用第一句（“no evidence for a magical number”）；其餘為轉述。

改了什麼：
1. 標題改「練習怎麼排」，tldr／導言明講不解釋技巧在身體裡怎麼形成、不告訴讀者怎麼排練習。
2. 「練習當下較差」改為來自經典研究（Battig、Shea & Morgan）；明講兩份統合分析只合併 24 小時以上的保留／遷移測驗（保留篇 "Only delayed retention testing results"）。
3. 拆開「成人／實驗室」：場景與年齡分開寫，補保留篇內部矛盾（討論段 vs 結果段 0.63，0.30–0.96）。
4. Ammar 2023：改成「只涵蓋運動場景、整體合併值小且不顯著、方向同為偏向隨機穿插、標題稱迷思；Czyż 團隊批評搜尋資料庫與未預先註冊；是被挑戰一方的評語」。注意：Ammar 的描述仍轉自 Czyż 兩篇，我沒讀原文。
5. 差異學習：補「保留階段 12 個實驗」「對照多為傳統練法（重複練習或固定順序系列練習）加糾正回饋」；刪掉 0.26。
6. Hassar：補 "and sometimes retention" 與 retention "variable"（摘要）。
7. 「免費來源」範圍：tldr／導言改為「我讀得到的免費全文」；正文末明講只搜 Europe PMC 題名。
8. 一萬小時：改為實讀兩篇後的描述（Gladwell 2008、Ericsson 估約 2 萬 5 千小時、Macnamara 重做未重現）；兩篇都談音樂專家表現，不是動作學習機制。
9. 術語白話：保留、遷移、投籃近中遠舉例、情境干擾、效果量、信賴區間、預先註冊、I²；GRADE 連回總覽；刪「連做 20 次」。
10. 動作換成「歸類自己最近一次練習」加「三句歸類」；刪讀英文摘要那個動作。
11. 縮篇：去掉年齡數字、遷移細節、第二個疲勞數字；正文（不含參考資料）約 3.9k 中文字元；英文同步。
12. 補連 neural-adaptation、warm-up-and-training-load（已用 Glob 確認存在）。

仍未解決：
- 保留篇 Sci Rep 後段（系統性回顧段、表 1 後半）仍未讀；Ericsson & Harwell 後半未細讀。
- Ammar 2023 原文未讀。
- Hassar 2026 仍只讀摘要。
- 「肌肉記憶」仍是「沒讀」。
