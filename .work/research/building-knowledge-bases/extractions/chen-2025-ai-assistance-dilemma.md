# Chen et al. 2025 — More AI Assistance Reduces Cognitive Engagement: Examining the AI Assistance Dilemma in AI-Supported Note-Taking

read_status=read（全文 29 頁含參考文獻；讀 arXiv PDF 版，正文到 §7 Conclusion 與致謝，參考文獻掃過）

## 書目（實際讀的版本）

- 作者：Xinyue Chen, Kunlin Ruan, Kexin Phyllis Ju, Nathan Yap, Xu Wang（University of Michigan）。
- 出處：Proc. ACM Hum.-Comput. Interact. 9, 7, Article CSCW451（November 2025），29 pages。https://doi.org/10.1145/3757632。CC BY 4.0。
- 讀的檔：arXiv:2509.03392v1 [cs.HC] 3 Sep 2025 的 PDF（版面即 CSCW 正式排版，頁首標 CSCW451:N）。任務指定 HTML 版 https://arxiv.org/html/2509.03392v1 也下載了（353,193 bytes），但改讀 PDF 以保留頁碼與表格；兩者同版本 v1。
- 經費：NSF IIS-2302564。

## 研究設計

- 受試者：30 人，University of Michigan 郵件名單招募，**篩選「自認記筆記有困難」者**（§3.1.2）。男 16、女 9、genderqueer 1、未答 4；0–20 歲 9、21–30 歲 21；亞裔 19、白人 7；大二 9、大三 4、大四 12、碩 1、博 4（Table 1）。
- 設計：受試者內，三條件順序六種排列隨機分派（counterbalanced）。每人約 2 小時、實驗室內、大螢幕播放模擬課堂。
- 材料：同一講者的三支 YouTube 講座影片，主題皆為 LLM（AI-Augmented Decision-Making、LLM Hallucination、LLM model selection），各約 8 分 50 秒至 9 分 30 秒；**影片順序固定**（只有條件順序輪換），不可重播。
- 三條件（系統 NoteCopilot；所有 AI 內容事先用 GPT-4o 生成、研究者人工檢核、按時間軸「重播」，每人看到一樣的內容）：
  - Automated AI：約每 1–2 分鐘一塊結構化筆記（模仿 Otter、Zoom AI、Teams Copilot 這類服務）。
  - Intermediate AI：每個發言段落（約 15 秒）一塊短摘要。
  - Minimal AI：即時逐字稿，按段落分塊。
  - 三條件都可拖放 AI 內容進編輯器、可搜尋、可看原始逐字稿；可把 AI 面板縮小自己記。**沒有完全無 AI 的對照組**（§3.2.2 理由：任一條件都可忽略 AI）。
- 流程：看片 → 1 分鐘整理筆記 → 閉卷後測 5 分鐘（2 選擇＋3 開放題）→ 看筆記修改答案 5 分鐘 → 問卷＋訪談；全部結束後 20 分鐘綜合訪談。**沒有前測**（§3.1.3）。
- 量了什麼：
  - 實測：Post-Test Score（閉卷，代表編碼）、Revision Score（看筆記修改後，代表儲存）；開放題 4 分制評分表，兩人盲評 25% 樣本，初始一致 86.7%。
  - 自評：認知負荷（整體心力 1–9；內在、外在、相關負荷 1–7 Likert）、可用性問卷。
  - 行為記錄：點擊、打字、拖入 AI 內容、搜尋、筆記字數；**只量筆記數量，不量筆記品質**（§4.1.3 作者自承）。
  - 質性：訪談主題分析，203 個初始碼。
- 分析：成績用混合效果線性迴歸（條件為固定效果、影片為共變項含交互作用、受試者隨機截距）＋ Tukey HSD；負荷、行為、可用性用 repeated-measures ANOVA。

## 可引用結果

1. **閉卷後測：Intermediate 最高、Automated 最低**（§5.1.1, Table 2）。Intermediate M=13.88（SD 2.34）vs Automated M=10.28（SD 3.75），係數 4.17（p=0.002）；Minimal 對 Automated 係數 2.70（p=0.044）。Tukey：Intermediate − Automated 差 3.61（p<0.001），Intermediate − Minimal 差 2.03（p=0.034）。
2. **看筆記修改後仍是 Intermediate 最高、Automated 沒有追上**（§5.1.1）。Revision Intermediate M=15.29（SD 2.99）vs Automated M=12.12（SD 2.76），係數 2.85（p=0.017）；Minimal vs Automated 不顯著（係數 0.37, p=0.763）。作者：「contrary to our initial expectations, Intermediate AI also outperforms Automated AI in post-review tasks」；「despite the opportunity for students to review with notes Automated AI , this condition did not yield better learning outcomes.」
3. **整體心力沒有差別**（§5.1.2, Table 3）：F(2,58)=1.67, p=0.197；Automated 4.60、Intermediate 4.53、Minimal 5.17（1–9）。外在負荷 5 題中有 4 題 Minimal 最高（「講者沒講清楚」那題 Minimal 2.10 反而最低，F=0.73 不顯著）（如讀 AI 筆記費力 4.57 vs Automated 2.93 vs Intermediate 3.07, F=9.30, p<0.001）。
4. **「讀 AI 筆記增進理解」自評：Automated 最高**（5.23 vs Minimal 4.23, p=0.009），但實測成績 Automated 最低——自評與實測方向相反。
5. **Automated 下的筆記最多但幾乎不改**（§5.1.3, Fig. 7, Table 5）：總筆記數（原文 total note count）Automated 300.68 vs Intermediate 170.46 vs Minimal 143.69（F=16.66, p<0.001）。拖入的知識單元被修改比例：Intermediate 40.0%、Minimal 26.3%、Automated 8.0%（F=23.60, p<0.001）。作者：「Automated AI led users to more passively accept AI outputs with minimal modification.」
6. **兩極化**：Automated 條件下 10 人完全手寫、8 人完全只用 AI（§5.1.3）；Minimal 下 19 人完全手寫。
7. **偏好 Automated**（§5.1.4, Fig. 8）：可用性多項 Automated 顯著高於 Minimal——筆記品質 5.20 vs 4.20（p=0.025）、重要主題涵蓋 5.50 vs 4.17（p<0.001）、閱讀樂趣 5.30 vs 3.93（p<0.001）、未來使用意願 5.33 vs 4.17（p=0.006）。
8. 訪談（§5.2.2）：Automated 的結構清楚、便於事後查，但「zoning out」；P5：「I was struggling with answering the questions because I thought notes would help, but then I couldn't remember where it is. I felt like some sort of disconnection.」
9. 作者主張（§6.1）：「the goal of AI assistance should not be minimizing all user effort but rather supporting users in offloading mechanical effort while maintaining space for active reasoning, reflection, and self-monitoring」；「if these tools are designed for cognitive tasks, such as learning, brainstorming, or meetings, a lower load does not necessarily indicate better outcomes.」
10. 作者也說 Intermediate 不是萬用解（§6.2）：「Intermediate AI should not be viewed as a one-size-fits-all solution」；複習為主的課，有學生偏好完整結構化筆記（P8）。

## 作者列的限制（§6.4 與文中）

- 樣本小（30），無法用更複雜模型。
- 影片只有約 10 分鐘，不代表長講座或整學期課程。
- 參與者年級、背景知識不同；用隨機截距處理；沒有前後測。
- 修改分析只比較最終筆記與 AI 原文，沒捕捉過程中的增刪重組。
- 只量筆記數量、不量品質（§4.1.3）。
- 未列為限制但從設計可見：沒有無 AI 對照組；影片順序固定（統計上影片效果不顯著，§5.1.1）；AI 內容事先生成並經人工檢核，比真實產品可靠；樣本篩選「記筆記有困難」者。

## 與摘要或常見轉述不一致處

1. 摘要與圖 1 說 Automated「the most preferred」；正文 §5.1.4 的顯著差異都是 **Automated vs Minimal**，作者明說「We didn't see other difference in the usability rating between Intermediate AI and Minimal AI or between Intermediate AI and Automated AI」。所以「比 Intermediate 更受偏好」在問卷數據上沒有顯著支持；「偏好」主要來自訪談與 vs Minimal 的比較。
2. 摘要說參與者偏好 Automated「due to its perceived ease of use and lower cognitive effort」；但整體心力（overall mental effort）三組沒有顯著差異（p=0.197），差異只出現在外在負荷分項，且主要是 Minimal 較高，Automated 與 Intermediate 之間外在負荷各項數字接近。
3. 標題「More AI Assistance Reduces Cognitive Engagement」：成績並不是隨 AI 程度單調下降——Minimal（最少 AI）在 Revision 分數上與 Automated 無差別、兩項成績都輸 Intermediate。實際是倒 U 形，不是「越多越差」。
4. 常見轉述「AI 自動筆記讓人學得更差」：此研究沒有無 AI 對照，比的是三種 AI 形式之間；不能推到「比自己手寫更差」。
5. 內部數字小矛盾：Table 5 Automated 的拖入單元平均 10.03、修改數 0.76；正文寫 9.41 與 0.77。Table 3 的 Q5 編號重複（兩題都標 Q5）。不影響結論，引用時以表為準並註明。
6. 「cognitive engagement」在本研究沒有直接量測，是用閉卷後測成績當代理（§3：「a post-test … which is a signal of their cognitive engagement level」）。

## 對 order 5 的意義

- 支持「讓 LLM 直接產出完整整理，使用者事後還是記不住、也不改」：Automated 修改率 8%、看筆記修改答案後仍最低。
- 支持「AI 給積木、人來組」的折衷：Intermediate 實測最好、修改率 40%。
- 注意情境是**即時聽講的筆記**（編碼與即時理解），不是長期知識庫維護；10 分鐘、立即測驗，沒有延遲回憶。

## 讀取紀錄

- 取得：`curl -sL -A "Mozilla/5.0" https://arxiv.org/pdf/2509.03392v1`（2,740,212 bytes，pdfinfo 29 頁，頁碼 CSCW451:1–29）→ `pdftotext -layout`。HTML 版 `https://arxiv.org/html/2509.03392v1` 也下載成功（353,193 bytes），未另轉文字。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/chen-2025-ai-assistance.txt`（1,463 行，116,825 bytes）。
- 依序讀：第 1–749 行（摘要至 §5.1.1）、750–1209 行（§5.1.1 結尾至 §6.3）、1210–1289 行（§6.3 結尾、§6.4 限制、§7、致謝、參考文獻開頭）；1290 行以後為參考文獻，掃過未逐條讀。
- 圖（Fig. 6–8）在文字檔中無數值，數值取自正文與 Table 2–5。
