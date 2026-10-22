# 抽取紀錄：Terrenzi & Ayvaz (2026) Faithful or Findable? Evaluating LLM-Generated Metadata for RDF Dataset Search

read_status=full（arXiv v1 PDF 5 頁全讀，含表 1–2、圖 1 圖說、參考文獻）

## 書目

- Riccardo Terrenzi、Serkan Ayvaz（University of Southern Denmark）。
- arXiv:2607.05970 v1（2026-07-07，cs.IR），短文，未標會議。
- 讀取：curl https://arxiv.org/pdf/2607.05970 → pdftotext -layout。
- 全文檔：scratchpad/fulltext/o15-terrenzi2026-faithful-findable.txt（290 行，40,124 bytes）。已讀 1–290 全部（雙欄排版，左右欄在同一行，閱讀時逐欄拆讀）。

## 研究設計

- 語料：ACORDAR 2.0 的 RDF 資料集搜尋；預算限制下取 37 個主題、996 份 metadata 紀錄（行 84–100）。
- 六種產生方式（行 101–121、120–122 起）：只看原 metadata 改寫（metadata rewrite）、原 metadata＋資料集 profile 改寫（profile rewrite）、只看 profile 產生（profile gen）、profile＋原標題、agent 直接查 RDF 圖（dataset agent）、agent＋原標題。prompt 類用 gpt-5.4-mini，agent 用 mistral-small-2603（行 103–105）。
- 檢索：BM25 與 bge-base-en-v1.5 dense，兩者都不針對設定調參，唯一變因是 metadata（行 107–117）。
- 忠實度：150 個資料集，LLM 抽出原子主張，再由 LLM 評審對照證據判 supported／partially／contradicted／insufficient evidence（行 160–183）。

## 可引用結果

1. 檢索（Table 1，行 123–143）：
   - BM25 nDCG@10：原 metadata 0.4487；metadata rewrite 0.4782；profile rewrite 0.4644；profile gen 0.3356；dataset agent 0.3494。
   - Dense nDCG@10：原 0.5628；metadata rewrite 0.5766；profile gen 0.3740；dataset agent 0.4180。
2. 忠實度（Table 2，行 126–132）：supported 比例——metadata rewrite **0.5283**（contradicted 0.0523、證據不足 0.3336）；profile rewrite 0.8152；profile gen 0.7005；dataset agent 0.6459。
3. 主要結論（行 215–227）："The best retrieval performance is obtained by the unconstrained metadata rewrite variant … However, the same method is also the least faithful … stronger retrieval does not necessarily indicate better metadata quality"。
4. 最常見的不忠實類型（行 182–183）：Unsupported Inference、Invented Detail。
5. 只靠 profile 從頭產生：忠實度高些，但檢索低於原 metadata（行 240–245）。

## 限制

- 短文、試點規模（37 主題、996 文件）；忠實度全由 LLM 評審，沒有人工驗證；沒報顯著性。
- 是「資料集搜尋」——metadata 本身就是被搜尋的全部內容，比 RAG 中 metadata 只是 chunk 附加欄位的情況影響更大，外推要保守。

## 對 order 15 的用法

- 反證／限制：「讓 LLM 產生 metadata」的檢索變好，不代表 metadata 是對的——最會提升檢索的改寫版本，只有 53% 的主張有原資料支持。
- 實務結論：用來過濾的欄位（日期、版本、適用範圍、權限）應從原始資料或系統取值，不讓 LLM 自由生成；摘要、關鍵字這類「幫助找到」的欄位才適合 LLM 產生，且要抽檢。可呼應 Azure Content Understanding 附 confidence score 與 source grounding 的設計。
