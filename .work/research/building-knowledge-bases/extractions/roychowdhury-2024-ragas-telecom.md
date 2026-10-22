# 抽取紀錄：Roychowdhury, Soman, Ranjani 等 (2024) Evaluation of RAG Metrics for Question Answering in the Telecom Domain

read_status=full（arXiv v1 PDF 11 頁 pdftotext -layout；正文、Table 1–4、附錄 A–B 全部讀完）

## 書目

- Sujoy Roychowdhury、Sumit Soman、H G Ranjani（共同一作）、Neeraj Gunda、Vansh Chhabra、Sai Krishna Bala（Ericsson R&D, Bangalore）。
- ICML 2024 Workshop on Foundation Models in the Wild。arXiv:2407.12873 v1（2024-07-15）。
- 讀取：curl https://arxiv.org/pdf/2407.12873 → pdftotext -layout → scratchpad/fulltext/o19-roychowdhury2024-ragas-telecom.txt（663 行、59,501 bytes），1–663 全讀。

## 研究設計

- TeleQuAD（3GPP Release 15 文件，SME 出題）：訓練 5,167 題、測試 715 題，452 個段落、14 份文件（行 96–106）。
- 只取 k=1 段 context，以分出「檢索對／錯」兩組（行 147–149）。生成：Mistral-7B（含 PT、IFT 變體）、GPT-3.5。評審：RAGAS（修改版，保留中間輸出）。SME 人工判斷正確性。

## 可引用結果

1. 檢索錯時，回答的事實正確度大降：Mistral 基礎版 FacCor 0.77（檢索對，502 題）vs 0.24（檢索錯，213 題）；Faithfulness 0.91 vs 0.71（Table 2，行 198–212）。
2. 領域微調後的生成模型，檢索錯時仍較常答對、但 faithfulness 更低：Mistral-7b-IFT 檢索錯 FacCor 0.36、FaiFul 0.58（基礎版 0.24、0.71）（Table 3，行 223–228）。作者解讀："We observe lower Faithfulness metric for RAG answers which are identified to be correct but from wrong retrieved context. This indicates that the generator (LLM) has answered from out of context information. The ability to answer from out-of-context information is more pronounced for domain adapted generator."（行 120–126）
3. 指標可靠度：Faithfulness 與 Factual Correctness 和 SME 一致；兩者都 > 0.7 時答對機率 0.87–0.97，兩者都 < 0.3 時答錯機率 0.84–0.89（Table 4，行 274–284）。
4. 不可靠的指標："scores for AnsSim, AnsRel and ConRel are subject to inherent variations and are relatively unreliable for interpretation."（行 308–312）Context Relevance 受 context 長度影響、難以解讀（行 251–269）；Answer Relevance 依賴 cosine similarity 與評審模型（行 260–284）。
5. 檢索器 top-1 準確率 64.6–72.7%（Table 1，行 159–173）。
6. 附錄 B 案例：答案正確（AnsCor 0.926）但 faithfulness 0，因評審把陳述拆得過細（行 578–586）。

## 限制

- 單一領域（電信標準），僅 k=1，小模型；workshop 論文。
- 「檢索對錯」以資料集標的段落為準。

## 對 order 19 的用法

- 自我檢查的直接實證：檢索錯（命中率低）時答對的題，faithfulness 低——答案來自模型自身；越懂領域的模型越會這樣。可以寫：「看 faithfulness（回答是否出自檢索段落）就能分辨」。
- 反證／限制：RAGAS 的 answer relevance、context relevance 在技術領域不好解讀；建議 order 19 只用 faithfulness 與對照標準答案的正確度。
