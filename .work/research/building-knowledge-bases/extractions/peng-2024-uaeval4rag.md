# 抽取紀錄：Peng, Choubey, Xiong & Wu (2024/2025) Unanswerability Evaluation for Retrieval Augmented Generation（UAEval4RAG）

read_status=full（arXiv v3 PDF 全文 pdftotext；正文逐段讀完，附錄 A/B 的提示詞與完整表格略讀）

## 書目

- Xiangyu Peng、Prafulla Kumar Choubey、Caiming Xiong、Chien-Sheng Wu，Salesforce Research。
- arXiv:2412.12300（v1 2024-12；讀的是 v3，2025-04-21），cs.CL。21 頁。程式碼：github.com/SalesforceAIResearch/Unanswerability_RAGE。Kucia 2026 引為 [19]（2024）。
- 讀取方式與全文檔（scratchpad/fulltext/）：curl https://arxiv.org/pdf/2412.12300（1,749,991 bytes）→ pdftotext → o11-peng2024-uaeval4rag.txt（2,513 行、77,684 bytes）；合併段落版 o11-peng2024-uaeval4rag.para.txt（734 段、77,686 bytes）。讀了段落版 bytes 0–45,500（摘要到參考文獻前段，含 §1–§6 全部正文與 Table 1–5），之後的附錄只看標題與 Table 11、A.4 說明。

## 研究設計

- 提出框架：六類不可回答題的分類、依知識庫自動合成不可回答題的流程、LLM 評分指標。
- 六類（§3.1）：Underspecified（缺關鍵資訊，Hard）、False-presupposition（前提錯，Easy）、Nonsensical（Medium）、Modality-limited（要求不支援的格式，Medium）、Safety-concerned（Medium）、Out-of-Database（相關但知識庫沒答案，Easy）。
- 實驗：TriviaQA、MuSiQue、2WikiMultihopQA、HotpotQA 的 Wikipedia 語料；27 種元件組合 × 3 個 LLM × 3 種 prompt；每個資料集 500 題可回答、600 題不可回答。

## 可引用結果

1. 合成題品質（§4.1）：每資料集隨機 100 題由三位作者審，TriviaQA、MuSiQue 都是 92% 符合定義，一致度 0.85、0.88。
2. LLM 評分與人工（§4.2，Table 1）：三位作者標 150 組，一致度 0.76（答/不答/要求澄清）、0.83（可接受與否）；GPT-4o、Claude 3.5 Sonnet、DeepSeek-R1 對作者標註的準確度 82.0–84.4%、76.7–76.9%（F1 81.3–86.0%）。
3. 只追可回答題的準確度會害到拒答（§4.3，Table 2）：TriviaQA 上 OpenAI 嵌入＋純向量、無 reranker、無改寫的組合，可回答題正確率最高（88.4%），不可回答題的可接受率卻最低（49.0%）。"focusing solely on maximizing correctness for answerable requests may lead to the RAG system's inability to reject unanswerable ones, thereby increasing the risk of hallucinations."
4. 沒有通吃的組態："no single configuration consistently achieves optimal joint scores, as the top three combinations in both datasets do not overlap."
5. Prompt 取捨（Table 3）：TriviaQA 上限制性 prompt #1 讓不可回答可接受率 53.2% → 84.3%，可回答正確率 88.0% → 88.4%；更嚴格的 #2 讓可接受率 83.0%，但正確率掉到 74.8%。MuSiQue 上 #2 讓正確率從 49.0% 掉到 16.0%。
6. 最難的是 Underspecified（缺資訊的題），所有 LLM 都一樣；False-presupposition 與 Out-of-Database 最容易（§4.3 末）。

## 作者自列限制（§6）

- 合成的不可回答題未必代表真實世界的複雜度；指標可再依應用調整；只做單輪對話。
- （本紀錄補充）實驗語料都是 Wikipedia 問答資料集，不是企業文件；聯合分數權重 0.7/0.3 是作者自訂。

## 與摘要不一致處

- 摘要與引言說 "the best prompt boosting unanswerable query performance by about 80%"——Table 3 的 TriviaQA 從 53.2% 到 84.3% 是相對增加約 58%；MuSiQue 61.7% → 85.8% 約 39%。「約 80%」對不上表內數字（可能指附錄 Table 18 的某組合，未核到）。引用時用表內數字，不用「80%」。
- 引言說 Claude 3.5 Sonnet 比 GPT-4o "improves correctness by 0.4% and unanswerable acceptable ratio by 10.4%"；Table 4（TriviaQA）正確率 85.2% vs 84.8%（+0.4），可接受率 63.2% vs 55.2%（+8.0）；MuSiQue 66.2% vs 55.2%（+11.0）。10.4 可能是兩資料集平均，原文未說明。

## 對 order 11 的用法

- 「題庫要含文件答不了的題」的分類依據：至少放「缺資訊（要追問）」「前提錯」「知識庫沒有」三類，對企業知識庫最相關。
- 「只看可回答題調系統，會把拒答能力調壞」的實驗證據。

## 表格修正（2026-10-22，依 _spotcheck-batch8）
- Table 1 欄位標錯，正確為：答／不答／要求澄清 準確度 82.0–84.4%、F1 76.7–76.9%；可接受與否 準確度 81.3–84.0%、F1 83.1–86.0%。
- 「正確率最高的設定可接受率最低（49.0%）」只在 Table 2 的 9 組成立；附錄 Table 17 的 27 組有 4 組更低（最低 43.0%），88.4% 也與另兩組並列。
