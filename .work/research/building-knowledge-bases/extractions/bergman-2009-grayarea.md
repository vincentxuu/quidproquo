# Bergman, Tucker, Beyth-Marom, Cutrell & Whittaker 2009 — It's Not That Important: Demoting Personal Information of Low Subjective Importance using GrayArea

read_status=read（全文，10 頁，作者共同作者 Cutrell 個人網站上的 PDF；版面與 ACM 正式版一致：CHI 2009 版權頁、pp. 269–278）

## 書目

- 作者：Ofer Bergman, Simon Tucker, Steve Whittaker（Sheffield University）；Ruth Beyth-Marom（The Open University of Israel）；Edward Cutrell（Microsoft Research）
- 會議：CHI 2009, April 4–9, Boston, MA. Proceedings pp. 269–278。
- DOI：10.1145/1518701.1518745
- 讀的檔案：https://cutrell.org/papers/CHI09-BergmanEtal-GrayArea.pdf（`curl -L -A "Mozilla/5.0"`，HTTP 200，418,389 bytes，PDF 1.5，10 頁）→ `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/grayarea.txt`
  - 首頁有「CHI 2009, April 4–9, 2009, Boston, MA, USA. Copyright 2009 ACM 978-1-60558-246-7/08/04…$5.00」，判斷是正式版（或與正式版同排版的作者版）。
  - `-layout` 為雙欄並排，閱讀時左右欄交錯；引文已依欄位還原。
- 取得過程：Exa 搜尋直接找到 cutrell.org PDF，第一次下載即成功。另有 ResearchGate（221515636）、CiteSeerX（10.1.1.153.3630）、ACM DL 等版本未使用。

## 研究設計

三階段（加上先前發表的第零階段），全為「設計週期」研究：

0. **現況調查（引自 [8] Bergman et al. 2008 JASIST，非本文新資料）**：84 名 PC 使用者問卷。
1. **低保真紙本原型比較**：79 名以色列大學學生（19–47 歲；55 女、21 男、3 未答），紙筆問卷，比較 Chronological Sorting、GrayArea、FadedItems 三種「降級」設計與現行介面；呈現順序對抗平衡。Likert 1–5。只有 70 人回答「四選一」題。
2. **（附帶）未發表的較大研究**：233 名受試者（PC 190、Mac 38、Linux 5）錄影導航到目標檔案，只看最後一步。
3. **正式評估**：96 名 Windows XP 使用者（多在英、美、以色列；19–62 歲，M=35.6，SD=10.66；55 男），以 email 對大學師生等群組招募。下載 Java 原型（模擬檔案總管視圖，不改真實檔案）。**受試者內設計**：在自己的兩個資料夾分別做「清理」——GrayArea 條件可保留／刪除／降級；標準條件只能保留／刪除。條件順序對抗平衡，無時間限制。
   - log 因防毒軟體擋信，18 人遺失，**行為資料只有 78 人**（t(77)）。問卷資料是 96 人（部分題目作答人數較少，如 64 人回答開放題）。
- 量了什麼：各條件保留／刪除／降級的檔案數與百分比；資料夾大小、資料夾年齡（檢查兩條件可比）；「哪個比較容易」的選擇題；Likert 態度題；開放式回饋。
- **沒量的**：檢索時間、檢索成功率、找檔速度。整篇沒有任何「存太多 → 找得慢」的實測。

## 可引用結果

1. **「存太多低價值資訊會拖慢檢索」在本文是引述與推論，不是本文的實驗結果。** 見 Introduction 第 2–3 段（PDF p.1 右欄）。
   - 「Jones [20] claims that the decision whether "to keep or not to keep" information for future usage is prone to two types of costly mistakes: First information not kept is unavailable when it is needed later. On the other hand, if kept, irrelevant information items can create clutter. They compete for the user's attention, obscuring important information relevant to the current task.」
   - 「Indeed it is well known in the field of cognitive psychology that in visual search the number of irrelevant distracters increases the time taken for people to identify a target object [24, 27]. Thus keeping irrelevant information not only causes guilt about being disorganized [5] it also increases retrieval time.」——[24] Neisser 1964（Scientific American 視覺搜尋）、[27] Treisman & Gelade 1980（特徵整合理論）。**這是從實驗室視覺搜尋研究類推到個人檔案夾，不是 PIM 實測。**
   - 「In addition there is a "deletion paradox": while unimportant information items distract attention and increase retrieval time for the target item, it takes time and attention to review items to decide whether to keep or delete them [7].」
   - Email：「studies of email processing reveal that users often keep messages of unclear value, even though this action makes it more difficult to locate valued messages [4, 28].」——[4] Bellotti et al. 2005 HCI「Quality versus quantity」、[28] Whittaker 2005 HCI。本文沒有引述那兩篇的具體數字。
2. **刪不下手的證據（引述）**：Whittaker & Hirschberg [29] 搬家時只刪掉 22%（「in the end were only able to delete 22% of their overall archives. In addition a significant percentage of what they deleted turned out never to have been accessed.」）；照片近似重複也刪不下手 [22 Kirk et al. 2006]；Boardman & Sasse 受訪者「Stuff goes in but doesn't come back out – it just builds up」（p. 585）。
3. **用展望理論解釋為何不刪**（Introduction，PDF p.2 左欄）：(a) 「保留」已是參照點，刪除是新的風險選項；(b) 偏好避免確定損失；(c) 小機率被主觀高估；(d)「Losses loom larger than gains, thus the possible loss of an information item emotionally affects the decision-maker more than the gains of having fewer distracters or reduced retrieval time.」——這是理論解釋，本文沒有實測受試者的風險知覺。
4. **現況替代做法（引自 [8]，84 人）**：「40% transferred files to a general archive folder, 61% moved them to external memory such as a CD, 32% created a new folder and used the old one as an archive, and 24% created an archive folder within the original folder. Altogether, 79% of the participants used one or more of these alternatives to make their low subjective importance files less visible.」（Testing Current Systems: Workarounds）
5. **紙本原型階段：想要降級介面，但三種設計間沒差**。Table 1；Do Participants Want…／Which of the Three Designs…。
   - 「only 11 out of the 70 participants who answered this question (16%) chose their current one, while the other 59 participants (84%) preferred one of the three new designs.」
   - 偏好：Chronological Sorting 20 (28.6%)、GrayArea 18 (25.7%)、FadedItems 21 (30.0%)、現行 11 (15.7%)。
   - 「a within-subject analysis of variance with repeated measures was not significant (F(2, 150)=1.17, p>0.05)」
   - 選 GrayArea 是研究者的判斷（四至五項設計理由），不是受試者偏好勝出。
6. **233 人錄影：只有 3 人（1%）用過依時間排序**（Choosing a Prototype → Chronological Sorting）。「we videoed 233 participants navigating to target files … We were surprised to find that only 3 of these participants (1%) ever used chronological sorting.」
7. **FadedItems 原型反而增加干擾**：「as soon as we developed this prototype we realized that it did not scale well. Folders soon became overcrowded with hidden files - adding to distractibility instead of lowering it.」（研究者觀察，無數據）
8. **主要結果：有 GrayArea 時清掉的比例較高，雜亂減少 13 個百分點**。Will the Availability of GrayArea Reduce Folder Clutter?；Figure 5；Table 2。
   - 「The average percentage of cleaned files in the GrayArea condition (33%) was higher than in the standard condition (20%), t(77)=3.94, p<0.001. The 13% difference between conditions means that there was less folder clutter after cleaning with GrayArea than in the standard condition: In the standard condition on average 80% of files were kept (38 files) whereas in the GrayArea condition only 67% of files were kept (27 files).」
   - Table 2：標準條件 Kept 38.08 (SD 77.84)／Deleted 3.2 (3.91)／Total 41.28 (77.18)，百分比 80%／20%；GrayArea 條件 Kept 27.33 (47.1)／Deleted 1.73 (2.37)／Demoted 4.13 (4.64)／Total 33.19 (46.98)，百分比 67%／10%／23%。
   - 刪除率反而下降：「the average deletion percentage dropped from 20% in the standard condition to 10% in the GrayArea one. Thus, we can view the 23% of demoted files in the GrayArea condition as comprising of 10% of files that in the existing keep/delete interface would probably have been deleted … along with 13% of files that would have been kept」
   - 可比性檢查：資料夾檔案數 t(77)=0.88, p>0.05；資料夾年齡 GrayArea M=552 天 (SD 578) vs 標準 M=498 (SD 552)，t(77)=0.79, p>0.05；順序無顯著效果。
9. **降級比刪除容易**（Which is Easier…）。
   - 行為：「participants chose to demote more files (23%) than delete files (10%), t(77)=4.6, p<0.001.」
   - 自陳：「Of our 96 participants 77 (81%) selected "to demote a file using GrayArea", 15 (16%) selected "no difference". Only 3 participants (3%) selected the 'to decide on deleting files' option, and one participant did not answer.」
10. **態度題**（What are Participants' Attitudes…）：「GrayArea can help reduce the clutter in folders」M=3.74 (SD 0.92)；「GrayArea complicates the interface」2.57 (0.97)；「I would like GrayArea to be implemented」3.61 (0.94)；「If GrayArea was part of my future Windows … I would use it」3.82 (0.9)，12% 負面、13% 中立、65% 正面。開放題 64 人：54 (83%) 正面、1 (2%) 正負皆有、9 (14%) 負面（「disorganized squirrels」）。
11. **「降級的搜尋結果淡化會減少干擾、縮短檢索時間」是預測，未測**（Design Implications → Demoted Search Results）：「We predict that this would decrease irrelevant distraction and reduce retrieval time.」

## 對 order 1 的意義（「存太多是否真的讓東西更難找」）

- 本文**不能**當作「overkeeping 實證上讓找回變慢」的證據。它的依變項是「清理後保留了多少檔案」（雜亂程度的代理指標），不是找檔時間或成功率。
- 本文對「雜亂拖慢檢索」的依據是：Jones 2004 的論點、視覺搜尋實驗（Neisser 1964；Treisman & Gelade 1980）、email 研究 [4, 28] 的說法。要寫「存太多讓東西更難找」，需要另找有量檢索時間的研究（線索見 `bergman-whittaker-2016-ch2.md` 的「書中其他章節的相關實證」：Bergman et al. 2010 每多一個項目增加 0.106 秒；Old'nGray N=60；DMTR N=18）。
- 可以引用的是：(a) 人確實傾向保留（標準條件保留 80%）；(b) 給一個「中間選項」就能多清掉 13 個百分點，而且受試者覺得比刪除容易——即「不敢刪」部分是介面只給二選一造成的。

## 作者列的限制

- 本文沒有獨立的 Limitations 段。散見的限制：
  - log 遺失：「for 18 of the 96 participants these log emails were blocked by the participants' anti-virus software and did not reach us, leaving us with 78 logs.」
  - 不改真實檔案：以 Java 模擬視圖進行，因為「we did not want participants to take any risks (real or hypothetical)」——所以清理行為是在「知道不會真的刪」的情境下做的（作者還特別向受試者示範「their cleaning actions … had no effect on the real files」）。作者沒有討論這可能讓刪除比例偏高或偏低。
  - 資料夾降級功能在實驗中被關閉：「this ability was disabled in the experiment to keep it as simple as possible. Folder demotion will be tested in future research.」

## 與摘要或常見轉述不一致處

1. **摘要「reduced folder clutter by 13%」是百分點差（33% vs 20%），不是相對減少 13%。** 以保留比例算，80% → 67% 是減少 13 個百分點；以保留檔案數算，38 → 27 個，約少 29%（但兩條件的資料夾不同，總數 41.28 vs 33.19，不能直接比檔案數）。
2. **摘要說「96 participants」清理兩個資料夾，但「減少 13%」這個行為結果只來自 78 人的 log。** 81% 覺得降級較容易則是 96 人的問卷（77/96 實為 80.2%，論文四捨五入為 81%）。
3. **紙本原型階段的人數不一致**：Method 寫 79 人（55+21+3），但結果與 General Discussion 寫「84% of our 70 participants」——70 是回答四選一題的人數。
4. **General Discussion 說「79% of our 84 participants」用 Windows 和 Mac**（「With current systems (Windows and Mac)」），但前文只說是 84 名 PC 使用者問卷，資料來自先前論文 [8]。
5. **常見轉述「GrayArea 研究證明雜亂降低檢索效率」不成立**：本文沒有量檢索；檢索時間的論點是 Introduction 用視覺搜尋文獻類推而來，Design Implications 的檢索時間是「We predict」。
6. **選 GrayArea 不是因為受試者最偏好它**：三種設計偏好無顯著差異（F(2,150)=1.17），GrayArea 的偏好率（25.7%）甚至是三者最低；是研究者依設計理由挑選。
7. 標題列名 Ruth Beyth-Marom；部分索引（Semantic Scholar／Exa 轉錄）把第三作者列為「Tal Marom」，是索引錯誤。

## 讀取紀錄

- 檔案：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/grayarea.txt`，662 行，64,501 bytes。
- 依序讀過：第 1–340 行（摘要、Introduction、User-Subjective Approach、Workarounds、Iterative Design、Table 1、Choosing a Prototype、Development 開頭），第 340–663 行（Development、Evaluation 方法與結果、Table 2、General Discussion、Design Implications、Reflections、Conclusions、Acknowledgements、References 1–31）。全文讀完，無跳讀。
