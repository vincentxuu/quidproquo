# 抽取紀錄：Ross, Koopman, van der Vegt & Zuccon (2026) How retriever redundancy and diversity impact RAG effectiveness

read_status=full（arXiv v1 PDF 9 頁，正文、表格、參考文獻全讀）

## 書目

- Jonathan J. Ross、Bevan Koopman（CSIRO / UQ）、Anton van der Vegt、Guido Zuccon（The University of Queensland）
- arXiv:2608.13956 v1，2026-08-14（cs.IR）。預印本（程式碼連結為 anonymous.4open.science，推測投稿匿名審查中）。
- 讀取方式：curl https://arxiv.org/pdf/2608.13956（667,004 bytes）→ pdftotext -layout → o12-ross2026.txt（602 行、69,204 bytes），已讀 1–602 全部。
- 下文「行」為 o12-ross2026.txt 行號。

## 研究設計

- 用 FictionalQA（虛構事件，模型沒有先驗知識；閉卷正確率 0.01–0.03，行 203–204）。1,500 份文件、五種文體（新聞、社群、企業、百科、部落格）（行 197–203）。
- 直接控制放進上下文的文件（不是真實檢索）：k = 1–5 份；三種條件：同一份文件的完全重複副本、LLM 改寫版、不同文體的不同文件，**所有文件都含相同且一致的正確答案**（行 97–121、233–243）。
- 四個生成模型：Llama-3.2-1B／3B、Llama-3.1-8B、Gemma-3-12B；Qwen2.5-32B 當評審；McNemar p<0.01（行 260–385）。主分析 1,900 題；去除答案字串後的篩選集 252 題。

## 可引用結果（數字照原文）

1. 完全重複不影響正確率（行 395–403、Table 2 行 404–428）："With duplicate copies, no generator differs significantly from its single-source baseline at any k, with two exceptions: the 1B generator gains 0.034–0.037 at k=2–3 but not beyond, and the 3B generator falls 0.033 below baseline at k=5." 例：Llama-3.1-8B 單份 0.726，重複 5 份 0.721。
2. 改寫版也幾乎沒幫助（行 333–339）。
3. 不同來源的文件有幫助（行 342–356）：k=5 時比基準高 0.240（1B）、0.173（3B）、0.152（8B）、0.112（12B）；比重複副本高 0.074–0.247。
4. 文體影響（Table 6，行 491–508）：百科類 0.701–0.846、社群類 0.372–0.619。

## 可引用原句

- 結論（行 534–538）："Supplying duplicate copies or LLM-generated paraphrases of an answer-bearing document fails to meaningfully improve answer correctness over a single-document baseline."
- 相關研究整理（行 71–81）：CUE-R 發現逐字重複不改變正確率但改變模型歸因；GroupQA 發現改寫重複比同數量的多元文件更容易翻轉模型立場；Schuster et al. 發現單一來源逐字重複對模型的影響和真正的多來源一樣大，"suggesting LLMs count token frequency rather than independent corroboration."（這三篇本紀錄未讀原文）

## 對 order 12 的意義（反證／限制）

- **反證**：「重複文件會讓答案變差」不是普遍成立。內容一致的完全重複副本，在本研究的短答題設定下對正確率沒有顯著影響（有一個 3B 模型在 5 份時小幅下降）。所以清重複的主要理由不是「重複本身會讓模型答錯」，而是：
  1. 重複副本佔掉檢索名額、擠掉其他需要的段落（本研究刻意不測這點，見下）；
  2. 副本常常不是真的相同——舊版、改了一兩個數字的版本才是答錯的主因（對照 HoH、Deasy）。
- 文章寫法建議：「內容完全相同的副本本身不太會讓答案出錯（Ross et al. 2026），真正的問題是看起來一樣、其實有一兩處不同的舊版。」

## 沒寫的事／限制

- 不是真實檢索：沒測重複副本在 top-k 擠掉其他證據的效應（作者說 "not necessarily mimicking what real retrievers produce"，行 86–87）。另一篇 2026 研究（arXiv:2610.09412，本紀錄只讀摘要與搜尋摘錄，未讀全文）報告：候選池有冗餘時，多證據題的 k-NN 檢索答題品質會掉。
- 只有短答事實題、虛構資料、最大 12B 模型。
- 所有副本答案一致，不含版本衝突——它回答的是「重複」，不是「多版本」。
- 預印本。
