# 抽取紀錄：Kulkarni & Savelieva (2024) The path to a golden dataset, or how to evaluate your RAG?（Data Science + AI at Microsoft, Medium）

read_status=full（Exa web_fetch 一次取回全文，約 1.3 萬字元，從標題讀到 References 與 "No responses yet"）

## 書目

- Sandip Kulkarni、Alexandra Savelieva（Microsoft Azure Data Applied AI 團隊），Medium 刊物 "Data Science + AI at Microsoft"，2024-05-21。
- https://medium.com/data-science-at-microsoft/the-path-to-a-golden-dataset-or-how-to-evaluate-your-rag-045e23d1f13f
- 讀取：curl 403（Medium 擋）；r.jina.ai 403；Exa web_fetch（maxCharacters 60000）成功，內容在工具輸出中，未存成 scratchpad 檔。

## 性質

- 廠商員工的實務分享（客戶專案經驗＋一個公開財報逐字稿案例）。不是同儕審查；數字是單一專家審查的結果。

## 可引用內容

1. 題數經驗值："Usually about 100 QA samples is considered a reasonable number of questions to provide enough diversity for evaluation without overwhelming resources."；"We recommend generating about 100 questions. With more resources, expanding to a few hundred questions helps ..."（沒有統計推導）。
2. 人工出題很慢："in a recent three-week project for prototyping RAG it took between eight and 10 days for subject matter experts on the customer side to come up with 10 question-answer samples in two cases ..., and about two weeks for approximately 90 QA pairs in our most recent two-month engagement."
3. 人工題庫也有品質問題：同一主題不同問法複製貼上同一答案；給的出處不相關或不足；有題無答；答案只放連結沒有內容。
4. 合成題經專家審：以 Microsoft FY23 Q4 財報逐字稿生成 100 組問答，一位財務專家逐題審——66 組無條件通過、7 組有保留通過、27 組不合格。常見問題是答案正確但不完整（只給一個原因、沒有金額與百分比）。
5. 題庫要保留出處位置（文件 ID）："This allows you to automatically calculate a retrieval success metric (e.g., topN retrieval rate) ... distinguish between issues when 1) the correct context was not retrieved; 2) the source was retrieved, but necessary information ... is missing or misleading, or 3) full information is present, but ... the LLM is still unable to answer the question."
6. 作者自承的限制："One may argue that it's questionable whether the evaluation of RAG using an AI-generated benchmark is sufficient. However, the same concern is applicable to a human-generated benchmark."；和客戶 88 題人工題庫比較的結果只說「增加信心」，沒有數字，並說 "it is not scientifically rigorous to extrapolate this result"。

## 限制

- 單一案例、單一主要審查者；「約 100 題」是經驗說法；比較人工與合成題庫的結果未公開數字。

## 對 order 11 的用法

- 「合成題要人驗」的具體數字：100 題中 27 題不合格。
- 「題庫要附出處」才能把錯誤拆成「沒取回／取回但內容不足／內容在但模型沒答好」——對應自我檢查三處。
- 題數：業界常見起點約 100 題；本文「20 題」可定位為「第一輪手寫起步」，要說明比實務常見量小。
