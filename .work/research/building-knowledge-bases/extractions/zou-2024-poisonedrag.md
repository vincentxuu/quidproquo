# 抽取紀錄：Zou et al. (2024/2025) PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models

read_status=full（正文第 1–9 節全讀；附錄 A–K 與表 14–25 於 2026-10-22 補讀完並逐表核對，見文末「附錄補讀」）

## 書目

- Wei Zou, Runpeng Geng（共同一作）, Binghui Wang, Jinyuan Jia（Pennsylvania State University；Illinois Institute of Technology）。
- arXiv:2402.07867 **v3**（2024-08-13），cs.CR。正式版刊於 USENIX Security 2025（本紀錄讀 arXiv v3，未取得 USENIX 版比對）。PDF 30 頁（正文約 14 頁）。程式碼 https://github.com/sleeepeer/PoisonedRAG
- 讀取方式與全文檔：curl https://arxiv.org/pdf/2402.07867（1,079,052 bytes）→ pdftotext → 刪 3 字元以下的行 → /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o14-poisonedrag.txt（3,508 行、125,620 bytes）。已讀 1–1,760（摘要到結論）全部；1,760–1,900 參考文獻掃過；1,900 以後附錄只讀表題（雙欄轉檔，表格數字被拆散，只引用正文寫出的數字）。

## 研究設計

- 攻擊者選定目標問題與目標答案，往知識庫塞 N 段惡意文字（預設 N = 5）；不能讀知識庫、不能查詢 LLM（行 296–330）。
- 惡意文字 P = S ⊕ I：I 由 GPT-4 生成「讓 LLM 答出目標答案的語料」，S 讓它被檢索到——黑箱設定直接 S = 目標問題本身（行 439–520 段）。
- 資料：NQ（2,681,468 段）、HotpotQA（5,233,329）、MS-MARCO（8,841,823）；8 個 LLM（PaLM 2、GPT-3.5、GPT-4、LLaMA-2、Vicuna 等）；3 種檢索器；每資料集 100 個封閉式目標問題（行 560–660）。

## 可引用結果（數字照正文）

1. 摘要（行 22–24）："PoisonedRAG could achieve a 90% attack success rate when injecting five malicious texts for each target question into a knowledge database with millions of texts."
2. 黑箱 NQ 97%（行 124）；PaLM 2 下 NQ 97%、HotpotQA 99%、MS-MARCO 91%（第 5.2 節）。無攻擊時 LLM 答對 70%／80%／83% 的目標問題（行 660–661）。
3. 平均約 2 次 GPT-4 查詢就能生成一段惡意文字；黑箱設定生成不到 1 秒（第 5.2 節）。
4. 真實規模：2018-12-20 英文維基 21,015,324 段建成的聊天機器人仍有效（行 1407–1501；表 11 各組 ASR 約 0.70–0.87，轉檔錯亂，未逐格確認歸屬）。
5. ReAct agent：黑箱 ASR 0.72／0.58／0.52（NQ／HotpotQA／MS-MARCO）（行 1492）。
6. 對非目標問題影響小：1,000 個非目標問題中 0.3%（黑箱）／0.9%（白箱）檢索到惡意文字（行 1683）——**難從整體品質指標發現**。
7. 防禦都不夠（第 7 節，行 1509–1745）：
   - 改寫查詢（paraphrasing）：仍有高 ASR（行 1583–1588）。注意改寫的是**使用者問題**，"we do not paraphrase texts in the knowledge database due to high computational costs"。
   - 困惑度偵測（perplexity）：要抓到惡意文字時誤報率也很高（行 1634–1640），因為惡意文字是 GPT-4 寫的，文字品質正常。
   - 重複文字過濾（SHA-256）：ASR 完全不變（行 1727）。
   - 擴大檢索數 k = 50：HotpotQA 仍有 41%（黑箱）／43%（白箱）ASR（行 1742）。

## 可引用原句

- 攻擊面（行 146–150）："an attacker could also post fake news or host malicious websites to inject malicious texts when the knowledge databases are collected from the Internet; an insider can inject malicious texts into an enterprise private knowledge database."
- **和提示注入的差別**（行 183–187、1037–1040）："prompt injection attacks are less stealthy since they inject instructions, e.g., previous studies [44, 65] showed that prompt injection attacks can be detected with a very high true positive rate and a low false positive rate." ；"the key difference between PoisonedRAG and prompt injection attack is that PoisonedRAG relies on malicious knowledge instead of instructions to mislead LLMs."

## 限制

- 只用封閉式事實問題（作者說開放式問題留待第 8 節討論）。
- 攻擊者要能寫入知識庫（作者以「維基可被惡意編輯 6.5%」為例，引別人的研究）。
- 防禦只測了四種通用方法；沒測來源驗證、權限、人工審核。
- 惡意文字由 GPT-4 生成，ASR 用子字串比對（作者以人工評估驗證相近，表 2）。

## 與範圍卡說法的核對（反證／限制用途）

- 範圍卡的兩道關卡是「個資檢查」與「嵌入指令檢查」。PoisonedRAG 的惡意文字**不含任何指令**，只是寫得像真的假知識——嵌入指令檢查抓不到，困惑度與重複過濾也抓不到。
- 所以文章要補一句：「指令檢查擋的是『指揮 AI』的文字；『騙 AI 的假資料』要靠來源驗證（誰能寫入、來源可信度、owner），這是 order 12 盤點表與 order 17 權限的工作。」範圍卡已有「入庫前驗證來源」，這篇是它的證據。

## 對 order 14 的用法

- 「只要五段文字就能讓特定問題答錯」：摘要＋行 124。
- 「偵測器的限制」：困惑度偵測誤報率高（行 1634）；重複過濾無效（行 1727）。
- 「指令檢查不是萬能」：行 1037–1040。

## 附錄補讀（2026-10-22）

### 讀了哪些行

- o14-poisonedrag.txt 1,760–3,508：第 8 節 Discussion 開頭、致謝、參考文獻 [1]–[107]、演算法 2、附錄 A–K（目標問題範例、系統提示、惡意文字範例、GCG 延伸、FEVER 設定、消融實驗、改寫防禦提示、非目標問題範例、失敗分析、人工評估與子字串比對差異、弱模型生成惡意文字）、表 14–25、圖 7–26。加上原本已讀的 1–1,760，全文 3,508 行已讀完。
- 這份全文檔是雙欄 PDF 轉檔、又刪過短行，表格數字被拆散。為了逐格核對，另把同一份 PDF（o14raw/poisonedrag.pdf）用 pdftotext -layout 重轉成 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/layout/poisonedrag-layout.txt（2,023 行，不在 repo），讀了其中 740–2,023 行（第 6.1 節表 10 起到附錄結束），表格數字以這份為準。

### 附錄裡的重點數字

1. 表 14：NQ 2,681,468 段／3,452 題；HotpotQA 5,233,329 段／7,405 題；MS-MARCO 8,841,823 段／6,980 題。
2. 表 15（拆開 S 與 I）：只放 S（目標問題本身）ASR 0.02–0.08；只放 I ASR 0.47–1.0；S⊕I 0.90–0.99。要同時讓文字「被檢索到」又「說出目標答案」才有效。
3. 表 16：檢索條件的 F1 0.89–1.0，也就是惡意文字幾乎都進了 top-5。
4. 表 17：top-5 裡只有 1 段惡意文字時 ASR 0.35–0.54；5 段全是惡意文字時 0.93–1.00。
5. 表 18：RAG 的生成溫度調到 1.0，ASR 仍有 0.86–0.99（5 個 LLM × 3 個資料集）。
6. 表 19–21：換檢索器（Contriever、Contriever-ms、ANCE）、換相似度（點積、餘弦）、對調 S 與 I 的順序，ASR 都在 0.87–0.99。
7. 困惑度偵測的 ROC AUC（圖 6–8，黑箱／白箱）：NQ 0.25／0.30、HotpotQA 0.48／0.63、MS-MARCO 0.12／0.25。六個值有五個低於 0.5——惡意文字的困惑度不比乾淨文字高，多數情況反而更低，拿困惑度當偵測器比亂猜還差。
8. 表 12（改寫使用者問題）：ASR 從 0.90–0.99 降到 0.79–0.93。表 13（SHA-256 重複過濾）：前後完全相同。
9. 圖 21–26：k 拉到 50 時 ASR 仍未歸零，且隨每題注入數 N 增加而上升（只有圖，沒有表格數字；正文給的 HotpotQA 41%／43% 是唯一明寫的數字）。
10. 附錄 I（失敗原因）：top-k 混進乾淨文字；或 GPT-4 生成的惡意文字自己就帶了正確答案（作者稱 parametric bias）。
11. 附錄 J 與表 23–25 的範例：有些惡意文字用「In an alternate universe」「In Kidstown」這類虛構框架。GPT-4 有時會回「在另一個宇宙是 X，現實中是 Y」而沒被騙；但 MS-MARCO 的例子裡 GPT-4 照著「Kidstown」的文字回答「13 歲就能買車」。
12. 表 22：白箱設定用 HotFlip 每題約 26 秒，TextFooler 64–77 秒。

### 和正文或本紀錄既有內容的矛盾

1. **本紀錄「可引用結果 4」數字歸屬錯誤**：原寫「表 11 各組 ASR 約 0.70–0.87」。layout 版核對後，0.70–0.87 是**表 10**（Self-RAG、CRAG 兩種進階 RAG）的 ASR；**表 11**（2018-12-20 英文維基 21,015,324 段）實際是 NQ 0.95／0.97、HotpotQA 1.0／0.94、MS-MARCO 0.94／0.91（黑箱／白箱）。引用「維基規模仍有效」時用 0.91–1.0；另記一筆可引用結果：Self-RAG／CRAG 這類號稱會過濾不相關內容的進階 RAG，ASR 仍有 0.70–0.87。
2. 正文第 7.2 節只說困惑度偵測「要抓到惡意文字時誤報率也很高」；附錄的 AUC 顯示問題更嚴重（多數低於 0.5）。方向一致，只是更強。
3. 其餘正文數字（摘要 90%、黑箱 NQ 97%、非目標問題 0.3%／0.9%、k = 50 時 41%／43%、ReAct 0.72／0.58／0.52）附錄沒有不同說法。

### 對結論的影響

- 「防禦失效」的結論不變，而且更強：改寫查詢只降 4–12 個百分點、重複過濾零效果、困惑度偵測比隨機還差、擴大 k 有成本且擋不完。
- 「指令檢查抓不到知識投毒」不受影響：附錄所有惡意文字範例都是陳述句，沒有一句是指令。
- 要修的只有表 11 的數字（見矛盾 1）。

## 行號更正（2026-10-22，依 _spotcheck-batch10）
- 「we do not paraphrase texts in the knowledge database」在全文行 1608–1609。
