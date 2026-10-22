# Anthropic 2024 — Introducing Contextual Retrieval

- 書目：Anthropic（作者 Daniel Ford），2024-09-19。https://www.anthropic.com/news/contextual-retrieval 。讀的版本：exa web_fetch（maxCharacters 60000，未截斷，到 Acknowledgements 與電子報區塊）。Appendix I/II 的結果是圖片，文字未取得。
- 性質：廠商技術部落格＋內部實驗（codebases、fiction、ArXiv、Science papers；1 − recall@20）。方法與資料集未完整公開，數字為廠商自測。
- 可引用結果：
  1. 「A note on simply using a longer prompt」：「If your knowledge base is smaller than 200,000 tokens (about 500 pages of material), you can just include the entire knowledge base in the prompt that you give the model, with no need for RAG or similar methods.」（order 0 用這句：知識庫小時不必建檢索）
  2. 傳統 RAG 切塊會丟掉上下文：「The company's revenue grew by 3% over the previous quarter」這種片段單獨看不出是哪家公司、哪一季。
  3. Contextual Embeddings＋Contextual BM25 讓 top-20 檢索失敗率下降 49%（5.7% → 2.9%）；加 rerank 下降 67%（5.7% → 1.9%）。
- 限制：廠商自測；200K token 門檻是 Claude 當時的 context 長度，會隨模型改變；Appendix 未讀到文字。
- 與摘要不一致：逐項對過，沒有（頁首摘要的 49%／67% 與正文一致）。
- 讀取紀錄：單頁一次取回，依序讀完全文。
