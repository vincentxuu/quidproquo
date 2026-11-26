# 抽取紀錄：Poliakov & Shvai (2026) Probe, Don't Prompt: A Hidden-State Probe for Metadata Filtering in Multi-Meta-RAG

read_status=full（arXiv v2 PDF 7 頁全讀，含表 I–III、局限）

## 書目

- Mykhailo Poliakov、Nadiya Shvai（National University of Kyiv-Mohyla Academy）。
- arXiv:2607.03929 v2（2026-10-20，cs.CL）。未標會議。
- 讀取：curl https://arxiv.org/pdf/2607.03929 → pdftotext -layout。
- 全文檔：scratchpad/fulltext/o15-poliakov2026-probe.txt（376 行，40,594 bytes）。已讀 1–376 全部。

## 研究設計

- 同一個 MultiHop-RAG，全部 2,556 題（comparison 856、inference 816、temporal 583、null 301，行 89）。
- 比三種「從問題抽來源」的方法，指標是預測的來源集合與正解完全相同的比例（set-exact accuracy）：原論文釋出的 GPT-3.5 過濾檔、不用模型的子字串比對、在小模型（135M–1.5B）隱藏層上訓練的分類器（probe）。**只評來源，不評日期**（行 105–106）。
- 沒有評端到端檢索指標（行 314–315 列為未來工作）。

## 可引用結果

1. **LLM 抽出的值跑出允許清單**（行 10–11、38–40）："Even though the prompt specifies 49 sources, GPT-3.5 generates 128 distinct source names, 79 of which do not appear on the list." "Many of its filters therefore refer to sources that the vector store does not contain."
2. 整體（Table II，行 182–191）：probe 90.9%、子字串 88.0%、GPT-3.5 80.9%。
3. 差距只來自 null 題（行 222–225）：GPT-3.5 在 301 題 null 題中 0 題預測空集合；子字串 66.8%；probe 93.7%。排除 null 題後三者 90.6%／90.8%／91.7%，差距 1.1 個百分點內。
4. 來源名稱幾乎都原字出現在問題裡（行 41–42）："In 95.4% of gold query–source pairs, the source name appears verbatim within the query text."——所以不用 LLM 的子字串比對已經很強。
5. GPT-3.5 過濾檔有 398 題附了 published_at 條件（行 105–106、265）。
6. 作者對公平性的保留（行 268–270）：null 題的落差取決於「null 題正解是空集合」的約定；GPT-3.5 的 prompt 本來就沒叫它放棄，換個 prompt 可能縮小差距。

## 限制（行 304–309）

- 單一新聞資料集；來源是近乎字面的屬性；稀有來源較不準（macro F1 低於 micro F1）；只跑一次交叉驗證、同一份分數選層與閾值，結果略偏樂觀。

## 對 order 15 的用法

- 反證／限制：讓 LLM 從問題抽過濾條件，會產生 schema 裡沒有的值（128 種寫法、79 種不在清單），過濾條件指向不存在的值就等於什麼都撈不到。
- 對讀者的實務結論：可過濾的欄位要用**固定選項（受控詞彙）**，查詢端的抽取結果要先對照允許清單；問題裡直接出現欄位值時，字串比對就夠了。
- 不能用來說「metadata 過濾讓檢索變差」——本篇沒量端到端檢索。
