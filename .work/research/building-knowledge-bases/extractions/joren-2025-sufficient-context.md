# 抽取紀錄：Joren, Zhang, Ferng, Juan, Taly & Rashtchian (2025) Sufficient Context: A New Lens on Retrieval Augmented Generation Systems

read_status=full（arXiv v3 PDF 全文 pdftotext；正文、附錄 A–D、提示詞全部讀完；Table 5 以 -layout 版核對欄位）

## 書目

- Hailey Joren（UC San Diego，Google 實習）、Jianyi Zhang（Duke，Google 實習）、Chun-Sung Ferng、Da-Cheng Juan、Ankur Taly、Cyrus Rashtchian（Google）。
- ICLR 2025 conference paper。arXiv:2411.06037（v3 2025-04-23）。
- 讀取：curl https://arxiv.org/pdf/2411.06037（1,067,523 bytes）→ pdftotext → scratchpad/fulltext/o19-joren2025-sufficient-context.txt（1,910 行、78,340 bytes），已讀 1–1910 全部；Table 5 另以 `pdftotext -layout -f 20 -l 20` 核對。

## 研究設計

- 定義「充分 context」：context 足以推出一個合理答案（不需要知道正解）（行 234–247）。
- 自動判斷器：Gemini 1.5 Pro 1-shot，在 115 筆人工標註上準確率 93%（Table 1，行 286–334）。
- 資料：FreshQA（452 題，用資料集附的 URL 當 context）、HotpotQA（500 題，e5-base-v2 取 top 5）、Musique-Ans（500 題，資料集附的 20 段）（行 423–433、1156–1185）。
- 模型：Gemini 1.5 Pro、GPT-4o、Claude 3.5 Sonnet、Gemma 2 27B、Mistral 7B（行 1124–1134）。答案判定用 LLMEval（Gemini 1.5 Pro），另以 Contains Answer 對照（行 451–458、1567–1702）。

## 可引用結果

1. context 不充分時仍答對：摘要層級 "SOTA LLMs output correct responses 35–62% of the time with insufficient context"（行 117–118）。Table 5（layout 核對）LLMEval：HotpotQA 不充分 context 下 Gemini 49.4%、GPT-4 59.5%、Claude 38.3%、Gemma 37.9%；Musique GPT-4 61.4%。
2. 不是全靠參數記憶：「Surprisingly, this remains true after we filter out questions that the model answers correctly in a closed book (w/o RAG) setting.」（行 98–100）。Table 2 列八種成因：是非題（50% 猜中）、有限選項、多跳題用參數推論補一跳、部分資訊、太多跳、模糊題猜對解讀、評審錯誤、本來就知道（行 561–633）。作者推測閉卷知識「mostly explains」35–62%（行 632–633），但同時說 "this only explains part of the story"（行 553–554）。
3. 閉卷基準：HotpotQA 上 GPT-4o 不給 context 就答對 48.0%（Figure 6 說明，行 1478–1482）；HotpotQA 有許多是非題、選擇題。
4. 加了 context 反而少拒答：Claude 3.5 Sonnet 拒答 84.1% → 52%；Gemini 1.5 Pro 100% → 18.6%；GPT-4o 34.4% → 31.2%（行 529–533）。
5. context 充分也會錯：人工標註的難題子集，充分 context 下錯誤（hallucinate）3.2–25.4%，Gemini 14.3%、GPT-4o 12.7%（Table 4a，行 1495–1526）。
6. 資料集本身大量不充分：Musique 55.4% 不充分（Figure 1 說明，行 183）；HotpotQA 充分 46.2%、FreshQA 77.4%（Figure 2、5、6）。HotpotQA train 88% 充分、dev 只有 44%（腳注，行 1170–1171）。
7. 選擇性回答：結合充分 context 訊號與自評信心，答題中的正確比例提升 2–10%（摘要行 46–48；結論行 921）。

## 可引用原句

- "open-book QA cannot be solved by improving retrieval alone."（行 94–95）
- "models generate correct answers in many cases, even when the provided context is insufficient."（行 98–99）

## 作者列的限制

- 只做 QA，沒做摘要等任務；沒研究不同檢索法多常產出充分 context（行 922–927）。
- 評審（autorater、LLMEval）本身會錯，Table 2 把 "Rater error" 列為一類（行 617–621）。

## 沒寫的事

- 用公開基準（Wikipedia 類），模型在預訓練裡見過大量相關知識；企業私有知識庫的閉卷正確率應低很多，但論文沒測。
- 沒有「檢索命中率」這個指標；它分的是「context 是否足以回答」，不是「預先標好的來源有沒有找回」。

## 對 order 19 的用法（自我檢查）

- 支撐自我檢查的方向：答對不等於知識庫發揮作用，context 不充分時仍有 35–62% 答對，其中一部分是閉卷就會的。
- 但要修正範圍卡的解釋：答對的來源不只「模型自身知識」，也有猜中（是非／選擇題）、部分 context 補洞、評審判錯。建議寫法：「回答正確率高、檢索命中率低，先別慶祝：模型可能靠自己知道、靠猜，或你的題庫把正解來源標錯了。把這幾題的回答對照它引用的段落，答案不在段落裡，就是知識庫沒出力；換成只有你們內部才有的題目，它就答不出來。」
- 「換題就會壞」在私有知識上更成立，但這篇沒直接測私有語料，寫的時候要標推論。
