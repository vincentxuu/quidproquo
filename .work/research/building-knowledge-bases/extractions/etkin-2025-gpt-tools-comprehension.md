# Etkin et al. 2025 — Differential effects of GPT-based tools on comprehension of standardized passages

read_status=read（Frontiers 網頁全文；Supplementary methods／results 未讀，正文提到的工具介面、prompt、時間與評分結果在補充資料裡）

## 書目（實際讀的版本）

- 作者：Hudson K. Etkin、Kai J. Etkin（共同第一作者，**Los Altos High School**）、Ryan J. Carter（San Jose State University, Center for Innovation in Applied Education Policy）、Camarin E. Rolle（Stanford, Dept. of Psychiatry and Behavioral Sciences）。
- 出處：Frontiers in Education, Sec. Digital Learning Innovations, Volume 10 - 2025, published 03 March 2025。https://doi.org/10.3389/feduc.2025.1506752
- 預註冊：https://osf.io/f63x8（2024-03-04 註冊；資料收集 2024-03-07 至 03-16）。
- 讀的檔：https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1506752/full 的 HTML。

## 研究設計

- 受試者：Prolific 招募 228 人，居住美國、英語流利、18–22 歲；依預註冊剔除（兩篇以上低於機率 30%、或任一篇閱讀時間為 1.5 IQR 離群）33 人，得 **195 人**。時薪 $10，成績前 5% 加 $6。
- 設計：受試者內交叉設計，單次線上作業，五條件順序隨機：
  - 對照（無 AI）
  - AI-generated summary：**以摘要取代原文**（只讀摘要）
  - AI-generated outline：原文分成可收合的階層段落並加標題
  - Q&A tutor chatbot：原文旁的開放式問答，使用不強制
  - Socratic discussion chatbot：原文旁的蘇格拉底式來回對話（使用為必須）
  - 模型 GPT 4.0，固定 seed；作者事後檢查「None of the AI responses resembled hallucinations」。
- 材料與量測（實測）：每條件一篇 ACT 閱讀測驗官方練習題文章（每人隨機抽、不重複），讀完後**看不到原文**作答 10 題四選一（題目引用特定行時只顯示該段）。另量閱讀時間、作答時間、工具有效性與喜好自評（1–5）。
- 分組：依**對照組那篇的正確率**分低／高表現者（低於中位數＝低，71 人；≥ 中位數＝高，124 人）；次要分析改依 SAT/ACT 成績分（沒考 53、低 71、高 71）。
- 分析：SPSS 29，t 檢定（Cohen's d 皆取正值）、卡方；雙尾。
- 預註冊假設：(1) AI 工具改善低表現者；(2) AI 工具使高表現者變差；(3) tutor 與 outline 對低表現者改善最多，summary 不影響正確率但縮短閱讀時間。

## 可引用結果

1. **依對照正確率分組：四種工具全部幫低表現者、全部傷高表現者**（Results, Fig. 2）。
   - 低表現者（相對自己的對照篇）：Socratic t(70)=7.2, d=0.86；outline t(70)=6.3, d=0.74；tutor t(70)=4.2, d=0.5；summary t(70)=3.8, d=0.45；皆 p<0.001。
   - 高表現者：summary t(123)=9.2, d=0.83；outline t(123)=5.7, d=0.51；tutor t(123)=4.1, d=0.37；Socratic t(123)=3.7, d=0.33；皆 p<0.001（方向為下降）。
2. **對照正確率與 AI 平均效果強負相關**：r=−0.785, p<0.001（Fig. 3）。
3. **依 SAT/ACT 分組（獨立分組法）效果大幅縮小**（Fig. 4）：低 SAT/ACT 組只有 Socratic 顯著改善（t(70)=2.2, p=0.03, d=0.26）；沒考 SAT/ACT 組也只有 Socratic（t(52)=2.5, p=0.017, d=0.34）；其他工具對這兩組皆不顯著（p's>0.09）。高 SAT/ACT 組只有 **summary 顯著變差**（t(70)=2.9, p=0.005, d=0.35），其他不顯著（p's>0.1）。
4. 時間與評分：各組在閱讀時間、作答時間、工具評分上沒有差異（細節在補充資料）；只有 Socratic 的使用時間與正確率提升相關（r=0.168, p=0.02）；對話字數與正確率無關（p's>0.758）。
5. 作者對摘要工具的詮釋（Discussion）：「reading an AI-generated summary instead of the full passage significantly worsened comprehension in higher performers, likely because much of the detail and nuance of the passage was lost in the summary.」作者稱這是第一份量測「讀 AI 摘要」對理解影響的研究。
6. 摘要對低表現者的效果「inconsistent」：對照分組顯著改善，SAT/ACT 分組無顯著效果。
7. 作者建議：診斷測驗後限制工具使用、或鼓勵高表現者避開摘要型工具。

## 作者列的限制

- Prolific 樣本：女性 64%、學生比例與 SAT/ACT 成績高於全國平均；連「低表現組」的 SAT 平均也高於全國。
- 金錢誘因下努力程度不一。
- 對 AI 的信任與信心不一可能影響使用。
- 結果受 prompt 與模型實作影響；Q&A tutor 不強制使用，可能造成效果不一致。
- 每條件只做一次，偵測力有限、變異大；需要縱貫研究。

## 與摘要或常見轉述不一致處

1. 摘要說「AI tools significantly improved comprehension in lower performing participants and significantly worsened comprehension in higher performing participants」，這只在**依對照篇正確率分組**時對四種工具都成立；用獨立的 SAT/ACT 分組時，只有 Socratic（幫低表現者）與 summary（傷高表現者）顯著，outline 與 tutor 都不顯著。
2. **迴歸均值問題作者沒有討論**：分組依據（對照篇正確率）同時是計算「AI 效果」的基準（AI 條件正確率 − 對照正確率）。對照篇偶然考低的人，下一篇自然傾向回升；考高的人自然傾向回落——即使工具毫無效果，也會出現「幫低傷高」與強負相關（r=−0.785）。作者在 Discussion 把對照分組稱為「our most direct and pre-registered measure」，並以「對照正確率與 SAT 相關」作為分組效度，但沒有處理這個偏誤。獨立分組（SAT/ACT）的結果較可信，效果也小得多（d 0.26–0.35）。
3. 「AI 摘要傷害高能力者」最站得住：兩種分組都顯著。但此處的「摘要」是**取代原文**（不讀原文、只讀摘要），而且測驗時看不到原文；不能推到「讀完原文後再看摘要」或「用摘要決定要不要讀」。
4. 常見轉述把本研究說成「AI 讓強者變弱、弱者變強」的一般規律；研究對象是閱讀理解單篇 ACT 文章、立即測驗、18–22 歲美國 Prolific 樣本，且第一作者是高中生（不影響數據，但同儕審查期刊屬實需說明來源性質）。

## 對 order 5 的意義

- 支持「只讀 LLM 摘要、不回原文」會丟細節：高表現者讀摘要取代原文時顯著變差（兩種分組都成立）。
- 支持「同一種 AI 協助對不同人效果不同」，但效果量在獨立分組下只有小到中（d≈0.3），且有迴歸均值疑慮，不要寫成「強者會變差」的定論。

## 讀取紀錄

- 取得：`curl -sL -A "Mozilla/5.0"` 指定網址 → HTML 636,467 bytes；`pandoc -f html -t plain --wrap=none` 轉文字。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/etkin-2025-gpt-tools.txt`（551 行，52,775 bytes）。
- 依序讀第 1–295 行（標題、摘要、Introduction、Methods、Results、Discussion、Limitations、Future research、Statements、Footnotes）；296 行起為參考文獻，未逐條讀。
- Figure 1–4 為圖片，文字檔只剩「[Figure N]」；數值皆取自正文。Table 1、2 已在文字檔中完整讀到。
- 補充資料（工具介面、GPT-4 prompts、時間與評分結果）未下載。
