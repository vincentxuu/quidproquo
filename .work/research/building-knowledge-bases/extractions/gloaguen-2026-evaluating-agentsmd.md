# 抽取紀錄：Gloaguen et al. (2026) Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?（v3）

read_status=read（arXiv v3 PDF 全文 L1–L1548，含附錄 A–E；v1、v2 只比對摘要與投稿紀錄）

## 書目

- Thibaud Gloaguen、Niels Mündler-Sasahara（ETH Zurich）、Mark Niklas Müller、Veselin Raychev（LogicStar.ai）、Martin Vechev（ETH Zurich）。
- arXiv:2602.11988。投稿紀錄（export.arxiv.org abs 頁）：v1 2026-02-12、v2 2026-06-23、**v3 2026-09-29**。Preprint，未經同儕審查（L57 "Preprint."）。
- 讀取方式：2026-10-22 curl https://arxiv.org/pdf/2602.11988v3 （2,561,766 bytes）→ pdftotext -layout。v1／v2 摘要由 export.arxiv.org/abs/2602.11988v1、v2 HTML 取得。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-gloaguen-agentsmd-v3.txt（1,548 行，94,247 bytes）。

## 性質

- 對照實驗：同一任務在三種設定下跑——無 context file（None）、用各 agent 官方 /init 指令產生的 LLM 檔（LLM）、開發者提交的檔（Dev）（L287–293）。
- 兩個資料集（L283–286）：SWE-bench Lite 300 題（11 個熱門 Python repo，無開發者檔）；作者新建 CTXBENCH 138 題（12 個較冷門、有開發者檔的 Python repo，從 5,694 個 PR 篩出，L253）。
- 四組 agent＋模型（L273–282）：Claude Code＋Sonnet-4.5、Codex＋GPT-5.2、Codex＋GPT-5.1 mini、Qwen Code＋Qwen3-30B-Coder；每題只跑一次（L280）。
- CTXBENCH 的任務描述與單元測試由 LLM agent 生成，再人工檢查（L202–239），有 25 題人工修過測試（L1174–1175）。

## 可引用結果（附行號）

1. LLM 產生的檔（L347–361）：成功率平均 SWE-bench −0.5%、CTXBENCH −2%；8 個設定中 5 個下降；p = 0.87、0.37（不顯著）。步數平均 +2.45、+3.92；**成本 +20%、+23%**（p < 0.001%）。
2. 開發者寫的檔（L363–368）：成功率平均 **+2.4%（p = 0.21，不顯著）**；顯著優於 LLM 檔（p = 0.038）；除 Claude Code 外都有提升；**成本增加「at most 19%」**，步數 +3.34。
   - Table 5（L933–942）：Sonnet-4.5 在 CTXBENCH 為 None 73.2%、LLM 65.2%、Dev 70.3%——Claude Code 兩種檔都比沒有差。（表格把 CTXBENCH 誤標為 "PLAN-BENCH"。）
   - Table 2（L320–332）成本自算：Dev 相對 None 分別 +13%（Sonnet）、+42%（GPT-5.2）、+6%（GPT-5.1 mini）、+15%（Qwen），四者平均約 19%。
3. 概覽沒用（L413–433）："Context files do not provide effective overviews"：用「第一次碰到 PR 修改檔前的步數」衡量，所有 agent 都沒有明顯減少；GPT-5.1 mini 反而變多（重複找、重複讀 context file）。LLM 產生的檔幾乎都有概覽（Sonnet 100%、GPT-5.2 99%、Qwen 95%）。
4. 指令有被照做（L435–497）："instructions in context files are well followed"：提到 uv 時每題平均用 1.6 次，沒提到時 <0.01 次；repo 專屬工具 2.5 次 vs <0.05 次。作者："the absence of improvements when using context files is not due to a lack of instruction-following capabilities."
5. 跑更多測試與探索（L443–447、L961–964）；推理 token：LLM 檔使 GPT-5.2 +22%（SWE-bench）、Dev 檔 +20%（L498–505）。作者假設 "these additional instructions make the task harder"（L499）。
6. 更強的模型不會寫出更好的檔（L525–531）；不同官方 prompt 差別小（L536–555）。
7. 長度沒有影響（L1031–1036）："no clear dependency between the success rate or the per-instance cost and the context file length."
8. 刪掉任一類內容（測試、概覽、工具）都不顯著改變正確率；刪掉測試段顯著省成本（Table 7 L1071–1094；GPT-5.2）。
9. **沒有其他文件時，context file 有用**（L1002–1029）：刪掉 repo 所有 .md、範例與 docs/ 後，LLM 檔平均提升 2.7%，且勝過開發者檔。作者："This may also explain anecdotal evidence reporting that coding agents perform better after adding context files [31], since many less popular repositories contain little to no documentation."
10. 結論建議（L87–91；L590–591）："We therefore suggest omitting LLM-generated context files for the time being"；"Human-written context files should only include instructions required for coding agents that are not already present in the README (e.g., specific conventions or non-functional requirements), and be rigorously evaluated before adoption."

## 沒寫的事

- 只有 Python（L563–568 自承；冷門語言與工具鏈可能不同）。
- 只量任務成功率；程式效率、安全沒量（L570–573）。
- 沒有實驗證明「具體指令」能提高成功率；只證明指令會被照做（工具使用次數）。
- 開發者檔只有 12 份（每個 repo 一份，L414）。
- 每題只跑一次，沒有重複取樣變異（L280）。

## 與範圍卡或常見轉述不一致處（逐條核對範圍卡）

範圍卡原句：「整體不提高 agent 成功率且成本增 20% 以上（ETH Zurich 2026），只有具體指令有用」

1. 「整體不提高 agent 成功率」——**大致正確，要補分寸**。LLM 檔 −0.5%／−2%；開發者檔 +2.4%；兩者都不顯著（L355–364、L586–587）。v3 措辭是 "does not generally improve"。
   - 常見轉述「ETH 研究說 AGENTS.md 會降低成功率」來自 **v1** 摘要（"context files tend to reduce task success rates"）；v2、v3 改為「沒有普遍提升」。引用要寫 v3。
2. 「成本增 20% 以上」——**只對 LLM 產生的檔成立**（+20%／+23%）。摘要寫 "over 20% on average" 並說對兩種檔都成立，但正文寫開發者檔 "at most 19%"（L368），摘要與正文不一致。建議寫「LLM 產生的檔讓成本增加約兩成，開發者自己寫的也增加近兩成」。
3. 「ETH Zurich 2026」——作者 3 位 ETH、2 位 LogicStar.ai；是 preprint。
4. 「只有具體指令有用」——**需要修正**。論文證明的是：
   - 指令會被照做（L483–497），但沒有證明照做會提高成功率；
   - 概覽沒有用（L433）；
   - 刪掉任何一類內容都不影響正確率（Table 7）；
   - 沒有其他文件時，連 LLM 產生的檔都有用（L1026–1027）。
   - 「只寫 README 沒有的具體慣例」是作者的**建議**（L89–91、L591），不是測出來的效果。建議改寫：「指令會被照做，但概覽沒有幫助；作者建議只寫 README 裡沒有的非標準慣例，並先評估再採用」。
5. 範圍卡沒提的關鍵但書：repo 本來就有文件時，context file 多半是重複資訊；沒有文件時才看得到幫助。這對「團隊的 AGENTS.md 哪些該留」很重要：已經在 README／docs 的就不用再寫一次。

## 限制

- 作者列的：只測 Python、只測解題成功率（§5）。
- 本紀錄另注意：CTXBENCH 任務描述是 LLM 生成，作者自己發現這會讓題目比 SWE-bench 簡單約 15%（Table 8，L1179–1183）；這可能壓縮了 context file 能幫忙的空間。
