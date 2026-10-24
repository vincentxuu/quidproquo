# 抽取紀錄：Neave et al. 2019, Digital hoarding behaviours: Measurement and evaluation

read_status=full（讀的是 Northumbria 機構庫的作者接受稿 AAM，不是 Elsevier 排版版；文首註明 "This document may differ from the final, published version"。頁碼、表格排版可能跟期刊版不同，數字以 AAM 為準，引用前若要逐字對頁碼需再對期刊版）

## 書目

- 作者：Nick Neave（Northumbria）、Pam Briggs、Kerry McKellar、Elizabeth Sillence（Newcastle）
- 年份：2019（online 2019-02-18；刊期 2019-07-01）
- 刊物：Computers in Human Behavior, 96, 72–77
- DOI：https://doi.org/10.1016/j.chb.2019.01.037
- 實際讀的檔案：Northumbria Research Portal AAM https://researchportal.northumbria.ac.uk/ws/portalfiles/portal/18627725/Neave.pdf
  - 本機 PDF：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/dl/neave-nrl.pdf
  - 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/neave-chb.txt
- 另下載但未作為本篇依據：CREST 報告 "Cybersecurity Risks of Digital Hoarding Behaviours – Full Report"（Neave, Briggs, Sillence, McKellar, 2020-08，34 頁），fulltext/neave-crest.txt。那是同團隊後續的委託研究報告（含 Study 1–3 與職場囤積的維度），不是這篇期刊論文；本紀錄沒有引用它的任何數字。

## 研究設計、受試者、比較對象、量了什麼

- 設計：兩階段線上問卷（Qualtrics），由市調公司 Critical Mix 招募；Study 1 建量表、Study 2 修訂後在新樣本驗證並做 6 週再測。
- Study 1：424 名英國在職、工作上使用電腦的成人；208 男（AAM 寫 "aged 21-58, mean = 52.9"）、216 女（20–75, mean 45.2）；268 全職、137 兼職；418 人回答資料保護題，278/418（66.5%）表示有資料保護職責。
- Study 2：203 名在職者；97 男（25–78, mean 48.8）、105 女（20–79, mean 46.6）；147 全職、56 兼職；148 人（72.9%）有資料保護職責（DPR）。
- 工具：
  - DHQ（Digital Hoarding Questionnaire）：初版 12 題改編自實體囤積文獻，PCA 後留 10 題、兩因子：difficulty deleting（6 題）、accumulating（4 題）。Study 1 計分 0–5，Study 2 計分 0–7（附錄版是 1–7）。
  - DBWQ（Digital Behaviours at Work Questionnaire）：9 題人口與職場資料＋四段：(1) 各類檔案目前數量（滑桿 0–1000+）；(2) 各類檔案刪除頻率（每日到幾乎不刪，1–5）；(3) 不刪 email 的 12 個理由（1–7）；(4) 檔案外洩時對自己／公司的後果（1–7）。
- 比較對象：有資料保護職責（DPR）vs 沒有（noDPR），單一題「does your current job role entail any responsibility for data protection?」分組；另做控制組別後的 DHQ 兩因子與各行為的偏相關。
- 沒有量的東西：沒有臨床診斷、沒有實際檔案計數（全是自陳）、沒有找檔時間或尋找失敗率、沒有壓力或焦慮量表、沒有生產力指標。

## 可引用結果

1. DHQ 兩因子結構（Study 2，Results "The Digital Hoarding Questionnaire (DHQ)"，Table 1）
   - 兩因子解釋 77.92% 變異；difficulty deleting α = .945，accumulating α = .873，兩量表 r = .756。
   - 原文："The scree plot again suggested a two factor solution, with the two factors accounting for 77.92% of the variance."
   - 6 週再測（隨機 50 人）：difficulty deleting r=.736，accumulating r=.663。
   - Study 1 對照數字：兩因子 62.9% 變異，α = .905／.824。

2. 「檔案太多所以找不到」這一題落在哪個因子（Table 1，item 10）
   - 第 10 題 "At times I find it difficult to find certain files because I have so many"：difficulty deleting 負荷 .556、accumulating 負荷 .644，歸在 accumulating（item-total r=.841）。
   - 第 7 題 "I lose track of how many digital files I possess"：accumulating 負荷 .857。
   - 第 6 題 "I feel strongly that some files might be useful one day"：accumulating 負荷 .885（量表內最高）。
   - 用途註記：這是量表題目的因素負荷，代表「找不到」是囤積構念裡的一個自陳項目，不是論文另外驗證「囤積造成找不到」的因果結果。

3. 檔案數量與兩因子的相關（Study 2 Section 1，Table 2）
   - 控制組別後，每一類檔案數量都與兩因子正相關；總檔案數與 difficulty deleting r=.354、與 accumulating r=.459（p<.001）。
   - 原文："In every instance, a significant positive correlation was found between the number of each item retained and both hoarding factors (statistics in table 2)."
   - DPR 組總檔案數平均 1857.0（SD 1660.5），noDPR 1331.3（SD 1437.4）。DPR 組在已讀 inbox email（359.3 vs 254.0）、未讀 inbox email（128.5 vs 29.8）、簡報檔、照片、總檔案數顯著較多；deleted 與 archived 資料夾 email 數兩組無差異。

4. 刪除頻率：兩組沒差（Study 2 Section 2，Table 3）
   - 原文："A one-way ANOVA comparing the DPR and no DPR group revealed no significant differences in deletion activity for each type of file"（總刪除分數 F = 1.56, p = 0.21）。
   - 兩因子方向不同：accumulating 與「不刪 email」相關（已讀 inbox r=.331、deleted 資料夾 r=.357）；difficulty deleting 與「不刪文字檔、試算表、簡報、照片」相關（表中是負號，例如照片 r=-.224；作者在 Discussion 解讀為 difficulty deleting 者較不願刪「更有份量、自己做的」檔案）。
   - Discussion 原文："Firstly, 'accumulators' seem reluctant to delete emails, while those having 'difficulty deleting' are able to delete emails, but seem more reluctant to delete other more substantial files (text files, spreadsheets, presentations, photographs)."
   - 注意：Table 3 的係數正負號與 Discussion 的文字解讀之間需要讀者自行對應（表註說分數越高越不刪，但 difficulty deleting 對非 email 檔是負相關）；引用時寫作者的解讀並註明來源是 Discussion，不要自己從表推方向。

5. 不刪 email 的理由前五名（Study 2 Section 3，Table 4）
   - 兩組排序完全相同。原文："interestingly both groups endorsed exactly the same reasons in the same order of importance."
   - 1. "may come in useful in the future"（DPR 5.0 / noDPR 4.6）
   - 2. "may contain information vital for my job"（4.9 / 4.4）
   - 3. "in case I need to have 'evidence' that something has been done"（4.4 / 3.4）
   - 4. "worried that I might accidentally delete something important"（4.1 / 3.3）
   - 5. "feel a sense of professional responsibility about them"（3.8 / 2.8）
   - 偏相關：所有理由與兩因子皆顯著正相關，唯一例外是 difficulty deleting 與「future 有用」不相關（r = .059, p = 0.406）。

6. email 是最常被囤積的類型（Section 3 開頭、Abstract）
   - 原文（Results）："Section 3 of the DBWQ picked up on the issue of email hoarding (as these were the most commonly hoarded files)"。
   - 原文（Abstract）："Both samples revealed that digital hoarding was common (with emails being the most commonly hoarded items)"。

7. 外洩後果的認知（Section 4，Table 5）
   - 每類檔案 DPR 組評分都高於 noDPR（例如 email 3.8 vs 2.6, F(1,200)=15.316, p<.001）；作者說受試者認為對公司的後果比對自己嚴重，每類檔案 self vs company 都有顯著差異。

8. 作者對「為何囤積」的詮釋（Discussion）
   - accumulation 被詮釋成管理大量資料時的實用低成本做法。原文："the second factor 'accumulation' suggests that the mass collection of digital files is simply perceived as the more practical and low-effort solution to the management of data at scale."
   - 人們覺得囤積無害。原文："There is a strong sense from this small literature that people perceive these hoarding behaviours as harmless, fuelled in part by the fact that digital storage is cheap and search engines are fast, meaning that they perceive the costs of a 'default' decision to store files as low."
   - 職務與人格兩者都有作用。原文："This suggests that while job requirements may influence data gathering and storage, personality factors associated with hoarding behaviours are also important."

9. 引用的定義（Introduction，引自 van Bennekom et al. 2015）
   - 原文：Digital hoarding has been defined as "…the accumulation of digital files to the point of loss of perspective, which eventually results in stress and disorganisation" (van Bennekom et al. 2015).
   - 這是二手引用定義，不是本研究的發現；「stress and disorganisation」來自個案報告的定義，不是本研究量到的結果。

10. 背景引用的 PIM 數字（Introduction，二手）
    - 原文："They typically keep half of the emails they receive and reply to about a third of them (e.g. Dabbish et al. 2005); with very few people engaging in proactive 'clean-up' of that stored information (Bergman and Beyth-Marom 2003)."
    - 二手引用，要用請回原始文獻。

## 作者自列的限制

- 經市調公司招募，無法完整描述抽樣策略與樣本人口特徵。
- 樣本沒有指定員工類型、職位或組織類型；部分組織有強制刪信政策，問卷可能不適用。
- 只看職場；在家工作、自由工作者與個人生活面向未涵蓋。
- 偏重 email；其他組織可能是別類檔案問題較大。
- 檔案數量是自陳，0–1000+ 滑桿太粗，可能不準（附錄版已改成填確切數字）。
- 沒做同時效度（concurrent validity），沒和實體囤積量表等既有量表比較。
- DPR 分組只靠一題，題意可能不夠清楚。
- 「囤積傾向者被吸引到需要累積資料的職位」目前只是推測。

## 與摘要或常見轉述不一致的地方

- 「數位囤積很普遍」：摘要說 "digital hoarding was common"，但全文沒有定義切分點、也沒有報告「多少比例的人是數位囤積者」。依據只是檔案數量的平均值（例如 DPR 組總檔案數均值 1857）以及 email 是最常保留的檔案類型。轉述成「X% 的人有數位囤積」在本文找不到根據。
- 「DPR 組數位囤積顯著較高」：摘要寫 "Digital hoarding was significantly higher in employees who identified as having 'data protection responsibilities'"。全文實際是：DPR 組在部分檔案類別的數量（已讀／未讀 inbox email、簡報、照片、總數）較多；刪除頻率兩組沒有差異；DHQ 分數本身有沒有組間差異，全文沒報告。「囤積較高」指的是保留的檔案數量，不是 DHQ 量表分數。
- 「囤積造成壓力或找不到」：本文沒有量壓力、焦慮或找檔失敗。唯一相關的是 DHQ 第 10 題（因檔案太多而難找）與第 9 題（想到刪檔會情緒不適）屬於量表題目本身。「stress and disorganisation」是引用 van Bennekom 2015 的定義。不能寫成「Neave 2019 證明囤積造成壓力／找不到」。
- 檢索端常見的 Highlights 寫 "Digital hoarding is associated with characteristics of physical hoarding"：量表題目是從實體囤積文獻改編來的，關聯是設計上帶進來的；作者自己也說沒做與實體囤積量表的同時效度。
- AAM 內部數字疑點（可能是排版或筆誤，期刊版可能已修）：Study 1 男性「aged 21-58, mean = 52.9」；Table 2 總檔案數 "F(1,195)=.487, p=.039"（F=.487 對應不到 p=.039）；Table 4 第 4 列 "F(1,202)=7.236, p=.044"（與第 3 列 F=7.216 p=.008 不一致）；Study 1 Results 已經寫「the scree plot again」。這幾個數字不要引用。
- 期刊版標題頁碼 72–77 共 6 頁；AAM 是 31 頁雙行距，節次編號不同。

## 讀取紀錄

- 全文檔：fulltext/neave-chb.txt，1468 行，59,813 字元（`wc -lc`）
- 依序讀過：第 1–500 行（摘要、Introduction、Study 1、Study 2 Materials/Results 到 Table 1 與 DBWQ 開頭）→ 第 501–1000 行（Table 2–5、Discussion 前大半）→ 第 1001–1468 行（Discussion 結尾、限制、References、附錄 DBQ 全問卷）。三段加總涵蓋 1–1468 行全文。
- 管道：Exa search 找到 Northumbria 機構庫 PDF → `curl -L -A "Mozilla/5.0"` 下載（200, application/pdf）→ `pdftotext -layout`。ScienceDirect 原頁沒試著讀全文（付費牆，且有作者接受稿就不需要）。
