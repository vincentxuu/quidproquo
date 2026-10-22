# 抽取紀錄：Salemi & Zamani (2024) Evaluating Retrieval Quality in Retrieval-Augmented Generation（eRAG）

read_status=full（arXiv v1 PDF 全文 pdftotext；正文、Table 1–2、參考文獻全部讀完；Table 1 以 -layout 版核對）

## 書目

- Alireza Salemi、Hamed Zamani（University of Massachusetts Amherst）。
- SIGIR '24（2024-07-14–18，Washington DC），short paper 6 頁。DOI 10.1145/3626772.3657957（Crossref 2026-10-22 查得；arXiv 版 DOI 欄為佔位符）。arXiv:2404.13781 v1（2024-04-21）。程式碼 github.com/alirezasalemi7/eRAG。
- 讀取：curl https://arxiv.org/pdf/2404.13781（750,644 bytes）→ pdftotext → scratchpad/fulltext/o19-salemi2024-erag.txt（850 行、37,995 bytes），1–850 全讀；第 3 頁 -layout 核對 Table 1。

## 研究設計

- KILT 的 NQ、TriviaQA、HotpotQA、FEVER、WoW 驗證集；Wikipedia 切成 100 字段落（行 173–187）。
- 讀者模型：T5-small（60M）＋Fusion-in-Decoder，50 篇檢索結果；檢索器 BM25 與 Contriever（行 188–197）。部分實驗用 T5-base（220M）。
- 比較四種相關性標籤算出的檢索分數，與下游任務表現的相關（Kendall τ、Spearman ρ）：(1) 文件含答案字串、(2) KILT 人工 provenance 標籤、(3) Mistral-7B 判斷相關、(4) eRAG：把每篇文件單獨餵給讀者模型，看答對與否當標籤。

## 可引用結果（Table 1，BM25 欄；行 214–514，layout 第 3 頁）

1. 人工標註來源（KILT provenance）算出的 Hit Ratio 與下游表現的 Kendall τ：NQ 0.216、TriviaQA 0.187、HotpotQA 0.113、FEVER 0.050、WoW 0.019。
2. 用 LLM（Mistral-7B）判斷相關後算 Hit Ratio：NQ 0.014、TriviaQA 0.032、HotpotQA −0.016——幾乎無關。
3. 「文件含答案字串」：Hit Ratio τ 0.232–0.375，比人工標籤好。
4. eRAG：Hit Ratio τ 0.301–0.619；摘要："improvements in Kendall's τ correlation ranging from 0.168 to 0.494"。
5. 檢索篇數越多，所有方法的相關都下降（行 562–566）。
6. eRAG 比端到端評估快平均 2.468 倍，GPU 記憶體省 7–48 倍（行 646–667）。

## 可引用原句

- "employing human annotations, such as the provenance labels in the KILT benchmark, for evaluating the retrieval models within a RAG system exhibits only a minor correlation with the downstream RAG performance."（行 89–91）
- "a document deemed relevant based on human preferences may not be useful for an LLM in fulfilling its task."（行 126–127）
- "one document can be useful for an LLM in fulfilling its task without containing the ground truth labels."（行 133–134）

## 限制

- 讀者模型極小（T5-small/base FiD），與今天的 LLM 差很多；作者自己沒測大模型。
- 只有 Wikipedia 型公開基準；相關係數是「跨題目」的排名相關，不是系統層級。
- 短論文、無信賴區間。

## 對 order 19 的用法（反證／限制）

- 反證「檢索命中率低 = 知識庫沒用上」的直接推論：命中率是拿預先標好的來源算的，標籤與實際有用的文件不一致時，命中率低可能只是題庫標錯或漏標（對應站內 private-corpus-retrieval-eval 的 annotation gap）。
- 也反證「檢索指標好就夠」：人工標籤的命中率和最後答對與否的相關很弱，所以兩層都要評，且命中率低的題要逐題看。
- 寫進正文時要說明讀者模型很小、資料是 Wikipedia；不能直接套到 GPT-4 級模型與企業語料。
