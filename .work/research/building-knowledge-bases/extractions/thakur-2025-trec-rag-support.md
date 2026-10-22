# 抽取紀錄：Thakur et al. (2025) Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges

read_status=full（arXiv PDF 全文 pdftotext；正文全部讀完，參考文獻略讀）

## 書目

- Nandan Thakur、Ronak Pradeep、Shivani Upadhyay（University of Waterloo）、Daniel Campos（Snowflake）、Nick Craswell（Microsoft）、Jimmy Lin（Waterloo）。arXiv 版作者 6 人；SIGIR 2025 正式版（DOI 10.1145/3726302.3730165，標題 "Assessing Support for the TREC 2024 RAG Track: A Large-Scale Comparative Study of LLM and Human Evaluations"）作者含 Ian Soboroff 等，未讀正式版。
- arXiv:2504.15205（2025-04-21）。讀取：curl https://arxiv.org/pdf/2504.15205（487,404 bytes）→ pdftotext → o11-thakur2025-trec-rag-support.txt（2,159 行、58,610 bytes）；段落合併版 o11-thakur2025.para.txt（58,612 bytes），讀 1–398 段（標題到致謝），399 段之後為參考文獻與附錄表。

## 研究設計

- TREC 2024 RAG Track，45 個參賽系統（31 RAG＋14 AG），36 個題目（Bing 搜尋紀錄的非事實型、多面向問題）。
- 判斷「答案句是否被所引段落支持」（三級：全部／部分／無），只判每句的第一個引用。
- 兩種人工條件：從零標（22 題、6,742 筆）；看過 GPT-4o 標籤後修改（14 題、4,165 筆）。NIST 標註員。
- 另抽 537 筆分歧，由一位獨立人員與 Llama-3.1 405B 重標。

## 可引用結果

1. 完全一致率：從零標 56%；看過 GPT-4o 標籤再修改 72.1%。
2. 系統排名層級：GPT-4o 與人工的 Kendall τ 都在 0.79 以上（run-level 0.792–0.892）；但「所有題目×系統」層級只有 0.47–0.671。
3. 方向性偏差："the GPT-4o judge is more likely to provide a higher support label than the human judge"；人傾向判「無支持」，GPT-4o 傾向「部分支持」。
4. 分歧重標：獨立人員與 GPT-4o 的 Cohen's κ 0.29／0.27，與 NIST 人員只有 −0.03／0.07；Llama-3.1 與 GPT-4o 的 κ 0.60／0.46——「不同 LLM 彼此很像」。
5. GPT-4o 的錯誤型態：混淆近義詞（police vs security specialists）；沒看完整句（特別是句尾）而偏向「全部支持」；主題相近就給「部分支持」。人的錯誤：沒仔細讀段落、靠自己的記憶判斷。

## 對 order 11 的意義（正反兩面）

- 正面：排名層級上 LLM 評審跟人相當一致；作者結論認為可作為替代。
- 反面（作為「LLM 評審不可靠」的限制證據）：逐筆層級從零標只有 56% 一致；GPT-4o 系統性偏寬鬆；看過 LLM 標籤的人更容易同意它（錨定，56% → 72%）；不同 LLM 共享同樣的偏差。對「這一題 AI 答對沒」的逐題判讀，不能只靠 LLM 評審。

## 限制

- 只評「支持度」一個面向，不是答案正確性；只看每句第一個引用。
- 網頁語料（MS MARCO v2.1），不是企業文件；題目是非事實型長答案。
- 人工基準本身一致性低（獨立人員與 NIST 人員完全一致只有 31%），所以「誰對」本身不確定。

## 與摘要不一致處

- 摘要說 "an independent human judge correlates better with GPT-4o than a human judge, suggesting that LLM judges can be a reliable alternative"——這只在 537 筆「已經分歧」的樣本上成立，而且 κ 只有 0.27–0.29（低）。不能轉述成「LLM 評審比人可靠」。
