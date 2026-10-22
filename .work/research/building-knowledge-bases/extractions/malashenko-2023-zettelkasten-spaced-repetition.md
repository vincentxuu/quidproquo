# Malashenko et al. 2023 — A Digital Model of Full-Cycle Training Based on the Zettelkasten and Interval Repetition System

read_status=read（全文 15 頁，含 Table 1–7、Appendix I 問卷、參考文獻）。品質判定：**不可作為證據引用**（理由見下）。

## 書目

- Malashenko, G. T., Kosov, M. E., Frumina, S. V., Grishina, O. A., Alandarov, R. A., Ponkratov, V. V., Bloshenko, T. A., Sanginova, L. D., Dzusova, S. S., & Hasan, M. F. (2023). A digital model of full-cycle training based on the Zettelkasten and interval repetition system. *Emerging Science Journal*, 7(Special Issue "Current Issues, Trends, and New Ideas in Education"), 1–15. DOI 10.28991/ESJ-2023-SIED2-01。收稿 2022-11-15、修訂 2023-01-19、接受 2023-02-11、出版 2023-03-18。CC-BY。
- 單位：HSE University、俄羅斯聯邦政府財政大學、Plekhanov 經濟大學（莫斯科）、Al-Mustaqbal University College（伊拉克）。10 位作者。
- 讀的檔案：`curl -L -A "Mozilla/5.0" https://www.ijournalse.org/index.php/ESJ/article/download/1614/pdf/4988` → HTTP 200，1,103,172 bytes，15 頁 → `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/malashenko.txt`（848 行，70,157 bytes）。圖 4–6（Obsidian graph 截圖）在文字檔只剩圖說。

## 設計（論文自述）

- 兩組比較：實驗組 20 人、對照組 20 人，共 40 名學生；**非機率便利取樣**（「only accessible and available students were contacted」，§4-4）。沒有說明如何分組、沒有隨機分派、沒有前測、沒有報告學生背景（年級、科系、國家）。
- 課程：線上「Corporate Innovation Management」課，兩週後考試（Digital Achievement Assessment，滿分 50）。
- 實驗組：受訓使用 Obsidian，依「capture → connect → crystallize → review」流程做 fleeting／literature／permanent notes 並連結；之後在 1、3、5、7 天各複習一次（共 4 次）；研究者「closely monitored via frequent online communication」。
- 對照組：沒有任何訓練，「conventional approaches of notes-making」，只在課程結束後一天複習一次。
- 第二個測量：改編自 O'Neil & Abedi (1996) 的 20 題後設認知覺察問卷。
- IRB：「Not applicable」。資料：「available in the article」（只有摘要統計）。

## 可引用結果（論文自述的數字）

1. 成績：實驗組 M = 40.25（SD 4.21）vs 對照組 29.05（SD 4.27），差 11.2 分，t = 8.348, df = 37.992, p = .000（Table 2–3）。
2. 問卷：Table 6 實驗組 M = 3.15（SD 0.20）vs 對照組 2.90（SD 0.27）；Table 7 t = 3.327, df = 35.026, p = .002。
3. 作者結論（§6）：「the hypothesis of the study was found to be true」；「the proposed digital model of full-cycle training was found to be highly effective」。

## 作者列的限制

- 「The article does not disclose many nuances of the work or study the model's application in a different context. Rather, the researcher has just investigated the application of the model in the context of student training only.」（§7-2）
- 只測一門管理課，建議擴展到其他學科（§7-3）。
- 沒有提到樣本量、非隨機、混淆變項、測量信效度等限制。

## 品質判定：設計與內部一致性的問題（逐一核對）

**設計上無法回答「Zettelkasten 有沒有用」**
- 介入是一整包：工具訓練＋Zettelkasten 流程＋4 次間隔複習＋研究者頻繁追蹤；對照組什麼都沒有、只複習 1 次。即使差異是真的，也無法歸因於 Zettelkasten 或連結（間隔複習本身就有大量既有證據）。
- 非隨機、便利取樣、無前測，兩組起點可能不同。
- 研究者知道分組並監督實驗組；考試評分是否盲評未說明。
- H1（organizations 的訓練成效）、H2、H3 從未分別檢驗；只有一個整體比較。

**數字內部矛盾（我自己核算）**
- **問卷題目平均值在 n = 20 下不可能出現**：20 個整數作答的平均必是 0.05 的倍數，但 Table 4／5 的平均值如 3.9831、3.0831、2.3697 都不是（3.9831 × 20 = 79.662）。
- **標準差超過數學上限**：Table 4 第 3 題範圍 2–5、SD = 1.91765；n = 20、範圍 3 分時樣本 SD 上限約 1.54。Table 5 第 4 題範圍 1–3、SD = 1.44988，第 5 題 SD = 1.63134；範圍 2 分時上限約 1.03。
- **Table 6 與題目平均對不上**：Table 4 二十題平均的平均 = 3.44，但 Table 6 寫實驗組 3.15；Table 5 平均 = 2.53，但 Table 6 寫對照組 2.90（而對照組單題最高平均只有 2.9001）。
- **量表尺度三種說法**：§4-5 說 5 點 Likert；§5-4 說 4 點（1 = Not at all 到 4 = Very much so）；Table 4 最大值 5.00、Appendix I 是 5 點 SD–SA。且 §5-4 用「above 3.0 表示 Moderately so / Very much so」的 4 點解讀。
- **正文與表格矛盾**：§5-4 正文說實驗組 SD「0.37」又寫「(3.15 ± 0.20)」；正文寫「t (35.026) = 0.25, p > 0.05」（把平均差當 t 值且說不顯著），但 Table 7 寫 t = 3.327, p = 0.002，同一句卻宣稱「significantly higher」。
- 成績比較的總結句寫「t (37.992) = 11.2」，11.2 是平均差，t 應為 8.348。
- **Hartley F 檢定複製貼上**：Table 3 與 Table 7 都寫「F = 1.029, Sig. = 0.4746」。Table 3 由 SD 4.27/4.21 算得 1.029（正確）；Table 7 由 SD 0.27/0.20 應為 1.82。
- Table 3 有「equal variances not assumed」卻說「Since the results are found to be significant at a 100 per cent confidence level (p-value = 0.000) it shows that equal variances are not assumed」——把 t 檢定顯著性誤當變異數同質性檢定。
- 表格標註錯位：正文說「As demonstrated by the results of Table 5 … the students in the experimental group」（Table 5 是對照組）；「Table 6 presents the results of the survey of the control group」（Table 6 是兩組摘要）。
- 複習排程三種版本：§5-3 說受試者「specify three intervals」；Figure 3 是「a few hours、1 day、3 days、7 days」；正文說「1 day, then 3 days, then 5 days and then 7 days」。
- Figure 1 流程圖寫「Research Approach: Qualitative」，§4-2 說是 quantitative。
- 母群描述循環：「The population of the study includes the students who took part in the experiment where Zettelkasten … are applied」（§4-4），但對照組沒有用。

**文獻引用與內容不符**
- 「The Zettelkasten technique has been found to be more efficient and effective than note-making [6–8]」：[6] 是一篇自動產生知識連結的博士論文、[7] 是 Kybernetes 上談社會系統理論與道德溝通的導論、[8] 是 Ahrens 的書——都不是比較 Zettelkasten 與一般筆記的實證研究。
- §3 寫「Amiri et al. (2017) [10] present that the Zettelkasten approach can be used with digital learning models」：參考文獻 [10] 是 Pyne & Stewart 2022（BJGP 短評）；Amiri et al. 2017 是 [20]，內容是**神經網路訓練的間隔重複**（EMNLP），與 Zettelkasten 或人類學習無關。
- §6 寫「Ratcliffe (2021) [5]」，但 [5] 是 Inie et al. 2022；Ratcliffe 是 [4]。
- §2-1 說「Through these connections, the concepts are engraved in the long-term memory of the people [10]」：[10] 是方法學短評，不是記憶研究。

## 與摘要或常見轉述不一致處

- 摘要說「The Zettelkasten facilitates the management of the student's attention, while the interval repetition system contributes to increased retention」：研究沒有測注意力、也沒有分開測 Zettelkasten 與間隔複習，這兩個機制主張沒有資料支持。
- 摘要說「they reported a significantly higher understanding and awareness」：正文同一處寫 p > 0.05，表格寫 p = .002，且問卷數字在數學上不可能。
- 摘要說「This study is the first to suggest the integration…」並稱「validate」模型；實際上沒有任何驗證設計（無分離、無隨機、無盲評）。
- 若有二手來源把它當成「Zettelkasten 有實驗證據」引用，那是錯的：這篇最多只能證明「有訓練＋多次間隔複習＋有人盯的組，考得比什麼都沒做的組好」，而且連這個數字的可信度都有問題。

## 對 order 3 的意義

- **不引用為支持 Zettelkasten 效果的證據**。如需在文章提到「目前唯一自稱測過 Zettelkasten 的實驗」，只能作為反例說明：設計把 Zettelkasten 與間隔複習、訓練、監督綁在一起，且表格數字自相矛盾，無法得出結論。
- 這篇的存在本身支持「Zettelkasten／連結筆記缺乏對照實驗證據」的判斷（見 _order3-saturation.md）。

## 讀取紀錄

- 1–75 行：p. 1 期刊資訊、標題、作者、摘要、關鍵字、收稿日期、引言開頭、DOI。
- 76–148 行：p. 2–3 引言、§2 文獻回顧（Zettelkasten、間隔重複、數位全週期訓練）。
- 150–186 行：p. 3 §3 四個假設。
- 188–257 行：p. 3–4 §4 方法（設計、方法取向、策略、樣本 40 人、資料蒐集、分析、倫理）。
- 264–316 行：p. 5 Figure 1 流程圖、§5-1、§5-2 模型（Figure 2）。
- 318–391 行：p. 5–7 §5-3 實驗程序、Figure 3–6、複習排程。
- 399–453 行：p. 8 Table 1–3、成績結果。
- 455–562 行：p. 8–10 §5-4 問卷、Table 4–7。
- 564–620 行：p. 10–11 §6 討論。
- 622–660 行：p. 11–12 §7 結論、貢獻與限制、未來研究。
- 662–684 行：p. 12 §8 宣告（作者貢獻、資料、經費、IRB、同意、利益衝突）。
- 686–811 行：p. 12–14 參考文獻 37 條（逐條核對 [4][5][6][7][8][10][20] 與正文引用）。
- 819–848 行：p. 15 Appendix I 問卷（5 點量表）。
- 核算：用 Python 計算題目平均是否為 0.05 倍數、SD 上限、Table 4／5 平均的平均、Hartley F（指令在本 session 執行，未存檔）。
