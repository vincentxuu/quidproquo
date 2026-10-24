# 抽取紀錄：Chatlatanagulchai et al. (2025) Agent READMEs: An Empirical Study of Context Files for Agentic Coding

read_status=read（arXiv v2 PDF 全文；正文 L1–L1847 讀完，參考文獻 L1854–2143 查了 [23][36][38]，附錄 A.1 L2144–2225 掃過）

## 書目

- Worawalan Chatlatanagulchai、Hao Li、Yutaro Kashiwa、Brittany Reid、Kundjanasith Thonglek、Pattara Leelaprute、Arnon Rungsawang、Bundit Manaskasemsak、Bram Adams、Ahmed E. Hassan、Hajimu Iida（Kasetsart、NAIST、Queen's）。
- arXiv:2511.12884 **v2（2026-08-09）**，cs.SE。PDF 內版權欄仍是 ACM 範本（"August 2025"、DOI nnnnnnn），未見正式出版資訊。
- 讀取方式：2026-10-22 curl https://arxiv.org/pdf/2511.12884 （1,818,691 bytes）→ pdftotext -layout。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-agent-readmes-2511.12884.txt（2,225 行，164,297 bytes）。
- 複製套件：https://github.com/woraamy/Agent-Context-File-Analysis（L175）。

## 性質

- 倉庫探勘＋人工質性編碼的描述性研究。不測量 agent 表現（作者自己說：不是量「提供 context 的效果」，而是研究這些檔案本身，L1724–1727）。
- 資料：從 AIDev 資料集挑 8,370 個 ≥5 星 repo，掃根目錄的 CLAUDE.md（922）、AGENTS.md（694）、copilot-instructions.md（687），共 2,303 份、1,925 個 repo（L226–274；Table 1 L265–267）。

## 可引用結果（附行號）

1. 長度（L421–466）：中位數 Copilot 535 字、Claude Code 485 字、Codex 335.5 字。
2. 可讀性（L477–486）：Flesch Reading Ease 中位數 Claude Code 42.39、Copilot 44.39（"difficult"）、Codex 51.41（"fairly difficult"）。
   - 但人工驗證（L487–490）：100 份人工標的易讀度與 FRE 的 Spearman ρ = 0.19（p = 0.05），"a weak positive relationship ... they do not align closely"。
   - L528–533："High-scoring (Easy) files are not necessarily the most useful ... low-scoring (Hard) files often provide the most complete architectural context".
3. 結構（L535–552）：幾乎都是一個 H1、H2 中位數 6–7、H3 9–12；H5 只出現在 9 份，沒有 H6。
4. 維護（L667–707）：多次修改的比例 Claude Code 67.0%、Copilot 59.8%、Codex 59.4%。人工抽 100 個 commit：92% 是實質改指令，只有 8% 純格式維護（L701–703）。
5. 更新間隔中位數（L708–710）：Copilot 68.0 小時、Claude Code 23.8 小時、Codex 22.3 小時。
6. 只加不刪（L739–751）：每次刪除中位數 <15 字；Claude Code 每次新增中位數 57 字。100 個 commit 中新增標籤 78 次（66 個 commit）、修改 32、刪除 19。
7. 內容 16 類（Table 3 L841–870；332 份人工標，兩人一致 80.3%，L809–812）：Testing 75.9%、Implementation Details 70.8%、Architecture 68.1%、Development Process 65.1%、Build and Run 63.0%、System Overview 59.0%、Maintenance 44.6%、Conf.&Env. 38.9%、Documentation 26.8%、Debugging 25.3%、AI Integration 24.1%、DevOps 18.4%、Security 14.8%、Performance 14.5%、UI/UX 8.7%、Project Management 5.4%。
   - 注意：L832 文字寫 "half of the files contain system overview"，表格是 59.0%。
8. 指令有被照做的兩個案例（L1341–1356）：加入「4 空格縮排」規則後，Claude Code repo 違規率 60.82% → 11.03%；Copilot repo 20.17% → 7.57%。作者："two cases cannot establish causality"。
9. GPT-5 自動分類 micro F1 0.79（Table 5 L1409）。
10. 「context debt」（L1471–1481）：作者提出的概念——"as projects evolve, these agent context files accumulate context debt: a state where instructions meant to clarify context for an AI agent become unmaintainable and opaque to human collaborators"；並說 "Future work should formalize context debt"。
11. 給開發者的建議（L1533–1564）：當成設定檔（configuration-as-code）、PR 改到建置或核心模組時檢查是否要更新、加 NFR（安全、效能）段、版本化與 CODEOWNERS 指定 context owner；L1559–1560："they risk becoming unstructured append-only logs."

## 沒寫的事

- 沒有測 agent 成功率或成本；「好不好用」完全沒量。
- 沒追蹤哪次程式改動觸發哪次檔案更新（L1505–1506 自承）。
- NFR 少見不代表開發者不在意，可能用其他工具處理（L1516–1519 自承）。
- 只看根目錄、只看三種檔名；巢狀 AGENTS.md 沒算。

## 與範圍卡或常見轉述不一致處

1. 範圍卡寫「研究顯示這類檔案越加越亂（2,303 份分析）」：
   - 有實證的部分：檔案多次修改、以小幅新增為主、幾乎不刪（L739–751）；篇幅長、FRE 偏難（L477–486）。
   - 沒有實證的部分：「亂」。可讀性指標與人工判斷只有 ρ = 0.19，作者自己說低分多半反映技術詞彙與條列格式（L528–533、L1768–1783）。「context debt」與「可能變成只會追加的日誌」是作者提出的風險與研究方向（L1476、L1559），不是測到的結果。
   - 建議改寫：「2,303 份檔案的分析發現，這類檔案常被改、但幾乎只加不刪；作者警告會累積成『context debt』，但還沒有人量過它變亂的程度」。
2. 「92% commit 是實質改指令」顯示這些檔案是被積極維護的，與「寫了就放著爛」的一般文件不同（L1497–1499 對比 README 的 write-once）。文章若暗示「沒人維護」會與本研究相反；問題是「只加不刪」，不是「沒人改」。
3. 摘要第一句 "the first large-scale empirical study"；v2 把前作（253 份 Claude Code 檔，L96）擴大，數字與 v1 摘要（若有人引 v1）可能不同，引用以 v2 為準。

## 限制

- 作者列的效度威脅（L1735–1817）：人工分類主觀、類別只記「有沒有」不記份量、FRE 不適合技術文、只看 Markdown 標題語法、樣本只有三種工具。
- 星數 ≥5 的開源 repo，不代表公司內部 repo。
