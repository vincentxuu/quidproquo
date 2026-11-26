# 抽取紀錄：Chroma Technical Report (2024) Evaluating Chunking Strategies for Retrieval

read_status=full（curl 取網頁 HTML → pandoc plain；正文、限制、結論、附錄 prompt 與 Further Algorithms 全讀；附錄 All Results 各語料分表在純文字中沒有表題，逐表看過數字但無法對應到語料名稱）

## 書目

- Chroma（向量資料庫公司）技術報告，2024-07-03。作者：Brandon Smith、Anton Troynikov（HTML 內的 BibTeX `author = {Smith, Brandon and Troynikov, Anton}` 核對；pandoc 純文字輸出未保留署名）。
- URL：https://research.trychroma.com/evaluating-chunking （2026-10-22 301 轉到 https://www.trychroma.com/research/evaluating-chunking，HTTP 200）。
- 讀取：curl（465,725 bytes）→ pandoc → scratchpad/fulltext/o16-chroma2024.txt（979 行、86,327 bytes），已讀 1–979。
- 性質：廠商技術報告，非同儕審查；提出自家新切法（ClusterSemanticChunker、LLMSemanticChunker）與新指標。本站 chunking-strategies 文章已引用。

## 研究設計

- 語料（行 204–235）：5 個英文語料共 328,208 token：國情咨文、Wikitext、Chatlogs（含 JSON 語法）、ConvFinQA 財報、PubMed；GPT-4 生成 472 題並篩選（行 236–250）。
- 指標：token 層級的 recall、precision、IoU（Jaccard）；IoU 會懲罰 overlap 造成的重複 token（行 184–202）。
- 主結果用 text-embedding-3-large、取 5 塊；再用 all-MiniLM-L6-v2 重做（行 315–356）。

## 可引用結果（數字照原文）

1. 主表（text-embedding-3-large，n=5，行 317–331）：Recursive 200/0 recall 88.1、IoU 6.9；TokenText 800/400 recall 87.9、IoU 1.4；LLM 切塊 recall 91.9（最高）；Cluster 400 recall 91.3；Kamradt 語意切塊預設 83.6（最低）。
2. **OpenAI 預設 800/400 效率最差**（行 335）："the default chunking strategy uses a chunk size of 800 tokens with an overlap of 400 tokens ... this setting results in slightly below-average recall and the lowest scores across all other metrics, suggesting particularly poor recall-efficiency tradeoffs." 註：作者假設 OpenAI 用的是 TokenTextSplitter。
3. 作者推薦的簡單設定（行 333）："RecursiveCharacterTextSplitter with chunk size 200 and no overlap performs well ... consistently high performing across all evaluation metrics." "reducing chunk overlap improves IoU scores".
4. **反證：小模型、小塊時 overlap 提高召回**（行 345–356）：all-MiniLM-L6-v2 下 TokenText 250/125 recall 82.4，同大小 overlap 0 為 77.1（原文寫 0.771）；"suggesting that for smaller context, overlapping chunks are necessary for high recall." 但 Recursive 250/125 vs 250/0 只差 78.7 vs 78.5。
5. **反證：語意切塊在 recall 上可以最好**：LLM 切塊 91.9、ClusterSemanticChunker 91.3，高於所有固定切法（最高 89.5）。但預設 Kamradt 語意切塊（LangChain 內建那種）是最低的 83.6。

## 作者自列限制（Limitations & Future Work 段）

- LLM 生成的問題風格單一；資料集小、多樣性有限；沒算切塊時間成本（LLM 切塊可到數十分鐘）。

## 沒寫的事

- 沒有統計檢定；標準差都在 ±25–40（recall），多數差距落在一個標準差內。
- 只量檢索，不量生成答案。
- 全英文。

## 作為反證的分量

- 對「overlap 沒好處」：只有在小 embedding 模型＋固定 token 切法時看到 +5 點 recall；用 Recursive 切法時幾乎沒差，且 overlap 一律拉低 IoU（效率）。與 Bennani「sentence-aware 切法下 overlap 沒差」其實相容：overlap 補的是硬切 token 造成的斷句。
- 對「語意切塊不划算」：作者自家設計的 Cluster／LLM 切塊 recall 高 2–3 點，但 LangChain 預設語意切塊最差；而且作者沒算成本。與 Qu 的結論不衝突（Qu 測的是 breakpoint 與 clustering，沒測 LLM 切塊）。

## 對 order 16 的用法

- 「OpenAI 預設 800/400」（openai-retrieval-guide.md 記錄的預設值）可以接這篇：至少在這份英文評測中，這組預設的召回略低於平均、效率最差。注意是 2024 年報告、作者推測 OpenAI 的切法實作。
- 反證段落：「也有評測看到 overlap 或特製語意切法提高召回幾個百分點」，接著說「所以預設先不開，用題庫比一次」。
