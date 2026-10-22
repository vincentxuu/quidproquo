# 抽取紀錄：Zou et al. (2024/2025) PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models

read_status=partial（正文第 1–9 節與第 7 節防禦全讀；附錄 A–K 只讀表題與段首，未逐表核對）

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
