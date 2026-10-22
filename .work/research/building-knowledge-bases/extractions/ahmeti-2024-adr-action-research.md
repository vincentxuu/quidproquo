# 抽取紀錄：Ahmeti, Linder, Groner & Wohlrab 2024, Architecture Decision Records in Practice: An Action Research Study

read_status=full（作者 Rebekka Wohlrab 個人頁的 accepted 版 PDF，16 頁，頁首標 "Accepted to the 18th European Conference on Software Architecture (ECSA'24)"；未與 Springer LNCS 正式版逐字比對）

角色：任務 6 的「2024 年後成功案例」——團隊引入一種固定文件型別（決策紀錄）後的變化。

## 書目

- 作者：Bardha Ahmeti、Maja Linder（Chalmers｜University of Gothenburg 學生信箱）、Raffaela Groner、Rebekka Wohlrab（Chalmers）
- 刊物：ECSA 2024（18th European Conference on Software Architecture），LNCS 14889，pp. 333–349。DOI 10.1007/978-3-031-70797-1_22
- 實際讀的檔案：https://rebekkaa.github.io/files/2024_ECSA.pdf
- 補充資料：https://doi.org/10.5281/zenodo.11635100（問卷、訪談大綱、編碼；未開啟）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/adr2024.txt

## 設計、樣本、比較、量了什麼

- 行動研究（action research，Staron 2020 五階段：Diagnosing → Action Planning → Action Taking → Evaluation → Learning），共三個月；其中在公司現場收資料四週（§5）。
- 場域（§4）：瑞典一家工程顧問公司；兩個敏捷團隊共 14 人——teamSys 8 人（1 BA、1 測試、"seven developers/architects"）、teamApp 6 人（1 team leader、3 開發、1 測試、1 BA）。系統是給公司 19,000 名員工用的 microservice 系統。原本已有 wiki 頁與圖，但沒有結構化的架構決策（ADD）紀錄方式；決策在開發者論壇口頭溝通。
- 介入：工作坊介紹 ADR（Nygard 2011 格式＋「考慮過的選項」與「標籤」兩節，由參與者在工作坊要求加入）＋七條指引 G1–G7（跨服務 ADR 放中央 repo；在 commit 與 user story 引用 ADR；ADR 與相關程式碼一起 check in；他人 review 後發布；加品質屬性／元件標籤；標狀態 proposed/accepted/rejected/deprecated/superseded；雙週開發者論壇討論新 ADR），指引也貼在中央 wiki。
- 資料：Diagnosing 階段訪談 7 人、問卷 6 人、參與觀察；Evaluation 階段訪談＋問卷 9 人＋觀察。兩位研究者獨立編碼。
- 量了什麼：自陳同意度（4 點量表＋不知道）、使用自陳、質性觀察。沒有量文件數量、更新頻率、查找時間或長期維護。

## 可引用結果

1. 介入前（§6.1，Fig. 1–2，n=6）
   - 原文："83% of respondents stated that ADDs are only rarely or occasionally documented and that there are no clear guidelines for documenting ADDs. In addition, half of the survey participants are dissatisfied with the way ADDs are documented."

2. 七個挑戰四類（§6.1）
   - Documentation Culture（C1）；Shared/Distributed System Parts（C2 跨元件決策難找、C3 文件散在不同工具）；Knowledge Transfer（C4 靠個人記憶、C5 新人 onboarding 靠開會）；Prioritization（C6 不知道該記什麼、C7 缺優先順序指引）。
   - C4 原文："The lack of documentation leads to relying on individual team members to maintain the context and history of ADDs and recall them from memory (C4). ... essential knowledge gets lost when team members leave the company. On the other hand, individual team members are burdened with a high mental load and responsibility"
   - C5 引述（teamApp 開發者）："[...] it kind of takes time from developers to share the information every time a new person starts."
   - 文化引述（teamSys 架構師）："It seems like stopping for documentation is a challenge for teams across the industry so yeah, documentation is hard."

3. 介入後（§6.2，Fig. 3，n=9）
   - 「團隊有清楚的 ADD 文件指引」同意 78%、不同意 11%、不知道 11%；「滿意 ADD 記錄方式」同意 89%、不同意 0%、不知道 11%。
   - 平均分（1=strongly disagree…4=strongly agree，排除不知道）："The average agreement with the statement about guidelines increased from 2 to 2.9. The average agreement increased from 2.5 to 3.1."
   - O4："Seven of nine participants of our second survey stated that they used the documentation"
   - O7 引述："What I like most about ADRs is that I do not need to remember these things further, I can write them down here and now and then be sure that I won't lose this information."
   - O3 引述："I think it's really easy to write them actually. They are basic enough, as they should be."

4. 沒解決的（§6.2、§6.3）
   - Onboarding（C5）無法判斷："The timeframe of our study was too short to determine whether the use of ADRs makes the onboarding process less dependent on meetings with experienced team members"；只有意向評分（9 人：3 分 2 人、4 分 5 人、5 分 2 人）。
   - 分散系統的挑戰（C2、C3）未解決："Challenges that practitioners face due to the distributed nature of the microservice-based system are not addressed and need further research."
   - 什麼算決策仍難判斷（teamSys 架構師）："The hardest part might be to actually decide whether it's a change that is made, whether it's to be considered as an ADR, or if it's just part of normal maintenance."

5. 教訓（§6.3）
   - 存放位置決定有用與否："We have learned that the storage location of the documentation has an extreme impact on its usefulness and accessibility (C3)."
   - 指引是關鍵："clear guidelines on the content to be documented are crucial for implementing a documentation approach successfully (C7)."
   - 合作改善但作者不歸功於 ADR 格式本身："Therefore, we assume that this lesson learned is independent of the method of documentation used. However, we expect the corporate culture and social dynamics within a development team to have a strong influence."
   - 融入流程要成本："some developers had difficulties integrating the creation of ADRs into their daily workflow."

## 作者限制（§7）

- 單一公司、以質性資料為主，"Our results might be only a small subset of possible challenges and observations"。
- 觀察可能改變行為："we cannot say to what extent our presence influenced the participants' behavior."
- 外部效度："We cannot say to what extent our results apply to other companies."；換別種文件方法結果可能不同。
- 原始資料因保密無法公開。

## 與摘要或常見轉述不一致處

- 「導入 ADR 解決了文件問題」：只有三個月（現場四週），量的是自陳滿意度與指引清晰度，沒有量文件是否持續更新、是否過時。所以它是「導入期」的成功案例，不是「長期不爛」的證據。onboarding 效果作者明說無法判斷。
- 樣本極小：前測問卷 6 人、後測 9 人，不是同一批人（人數不同），前後比較不是配對設計；百分比的分母是個位數（78% = 7／9）。
- 摘要說 "We performed seven interviews"，是 Diagnosing 階段的數字；Evaluation 階段另有訪談，論文沒給確切人數。
- 摘要說 "cooperation among the teams was improved after the introduction of ADRs"，但 §6.3 作者自己說這個教訓「可能與文件方法無關」，受文化與團隊動態影響。
- §6.3 有一句自相矛盾的文字："Our seven guidelines from Section 5 are context-independent. ... However, we expect the two shortcomings ... to be context-independent."（原文如此，應該是想說缺點也會出現在別的團隊）。
- 成功的條件包含：工作坊、七條具體指引（含 review、狀態欄位、論壇討論）、研究者在場四週。轉述成「寫 ADR 就好」會漏掉這些。

## 讀取紀錄

- 全文檔：fulltext/adr2024.txt，807 行，50,491 bytes；PDF 16 頁。
- 依序讀過：1–420（摘要、§1、§2、§3 ADR 與範本、§4 情境、§5 方法、§6.1 前半與 Fig. 1–2）→ 420–808（§6.1 後半、§6.2、Table 1、§6.3、§7、§8、§9、References）。涵蓋全文。
- 管道：Exa search 找到作者頁 PDF → `curl -L -A "Mozilla/5.0"` → 200 PDF → `pdftotext -layout`（成功）。Springer 正式版未取得（未嘗試，作者版已是 accepted 版）。
