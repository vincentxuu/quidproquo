# 抽取紀錄：Lulla et al. (2026) On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents

read_status=read（arXiv v2 PDF 全文 7 頁 L1–L327）

## 書目

- Jai Lal Lulla、Seyedmoein Mohsenimofidi、Matthias Galster、Jie M. Zhang、Sebastian Baltes、Christoph Treude。ICSE JAWs 2026（Journal Ahead Workshop，5 頁短文）。arXiv:2601.20404 **v2（2026-03-30）**。
- 讀取方式：2026-10-22 curl https://arxiv.org/pdf/2601.20404 → pdftotext -layout。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-lulla-2026-agentsmd-efficiency.txt（327 行，39,280 bytes；雙欄排版，左右欄混在同一行）。
- 線上附錄：doi:10.5281/zenodo.18348507（L306）。未讀。

## 性質

- 配對實驗（有／無 AGENTS.md），只量效率（時間、token），**不量正確性**（L174–176）。這是本題的反證或補充：方向與 Gloaguen v3 的「成本增加」相反。
- 設計（L96–163）：只用 Codex＋gpt-5.2-codex；從 132 個 repo 挑出只有根目錄一份 AGENTS.md 的 89 個，再以 LLM 篩出含「慣例、架構、專案描述」的 26 個，隨機取 10 個，各取最多 15 個 ≤100 行、≤5 檔、只改程式碼的已合併 PR，共 124 個 PR。任務描述由 gpt-oss-120b 從 PR diff 生成（L127–137）。

## 可引用結果（Table 1，L187–212）

- 牆鐘時間：平均 162.94 s → 129.91 s（−20.27%）；**中位數 98.57 s → 70.34 s（−28.64%）**；顯著（Wilcoxon p < 0.05）。
- 輸出 token：平均 5,744.81 → 4,591.46（−20.08%）；**中位數 2,925 → 2,440（−16.58%）**；顯著。
- 輸入 token：平均 −9.73%，**中位數反而 +3.41%**（116,609 → 120,587）；總 token 中位數 +1.29%。不顯著。
- L228–232：輸出 token 的平均降幅大於中位數，"AGENTS.md primarily reduces token usage in a small number of very high-cost runs".
- 正確性只做 50 個 PR 的人工抽查，確認輸出 "non-empty, non-trivial code changes"（L180–218），作者明說 "this sanity check does not constitute a full correctness evaluation"。
- 作者推測（L236–239）：效率提升可能來自檔案先描述了結構與慣例，減少探索——但沒有分析 trace 驗證。

## 沒寫的事

- 沒有任務成功率；不能說「AGENTS.md 讓 agent 做得更好」。
- 只有一個 agent、一個模型；只有小型 PR。
- 沒區分檔案內容哪部分造成效果。

## 與摘要或常見轉述不一致處

- 摘要說 "while maintaining a comparable task completion behavior"——實際只是 50 個抽樣確認「有產出非空的改動」，不是正確率比較。
- 摘要只報時間與輸出 token 的改善；輸入 token 與總 token 中位數其實略增（L194–210）。以成本而言（輸入 token 通常占大宗），「更省錢」不成立；「更快、輸出更少」才成立。

## 與 Gloaguen v3 的對照

- Gloaguen：成本（以 API 費用計）增加約兩成、步數增加；Lulla：時間與輸出 token 減少、總 token 持平。
- 差異可能來自：只用 Codex、任務很小、篩選了內容豐富的 AGENTS.md、量的指標不同（時間／token vs 美元成本）。兩篇都沒有證明 context file 提升正確率。
- 對文章的意義：「AGENTS.md 讓 agent 變貴」不是定論；不同設定方向相反，所以範圍卡結論「要評估」比「會變貴」更站得住。

## 限制

- 作者列的（L212–223）：agent 隨機性、單一框架與模型、任務特性；未來要擴大。
- Workshop 短文，樣本 124 PR／10 repo。
