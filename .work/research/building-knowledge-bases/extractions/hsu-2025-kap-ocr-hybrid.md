# 抽取紀錄：Hsu, Lin, Lin & Tzeng (2025) KAP: MLLM-assisted OCR Text Enhancement for Hybrid Retrieval in Chinese Non-Narrative Documents

read_status=full（arXiv v3 全文 4 頁，含表 1–5、致謝與參考文獻）

## 書目

- Hsin-Ling Hsu、Ping-Sheng Lin、Jing-Di Lin、Jengnan Tzeng（通訊），國立政治大學（臺北）。與 DAT 同一第一作者與通訊作者。
- arXiv:2503.08452，v1 2025-03-11、v2 2025-04-29、v3 2025-05-01。未查到正式刊登版本。
- 讀取：curl https://arxiv.org/pdf/2503.08452（v3，1,206,896 bytes）→ pdftotext -layout → scratchpad/fulltext/o16-kap2025.txt（354 行、42,278 bytes），已讀 1–354 全部。
- **版本差異**：Exa 搜尋摘要顯示的是 v1 HTML，數字與 v3 不同（v1 基線 BM25 MRR 54.29／P@1 43.67；v3 為 53.16±0.83／41.51±1.67，且 v3 改成三次重複取平均與標準差）。引用一律用 v3。

## 研究設計

- 資料（行 164–203，表 1–2）：玉山銀行「AI CUP 2024 玉山人工智慧公開挑戰賽」非公開資料，主要用 1,035 份上市公司**財報 PDF**（大量表格）。FAQ（617 份 JSON）與保險條款（643 份 PDF）不納入主分析。
- 題目：官方驗證集財報類 50 題，用 Claude 3.7 Sonnet 每題改寫 9 種（同義詞替換、只留關鍵詞、改語序、口語化等）擴成 500 題（行 203–234）。
- 切塊（行 205–216）：先按頁切，再 recursive chunking，**8,000 token、500 token overlap**。
- 檢索（行 259–275）：Sparse＝BM25＋jieba 繁中詞庫；Dense＝text-embedding-3-large；Hybrid＝兩者結合（融合方法沒寫）。
- 基線：Tesseract OCR 直接拿來檢索；KAP：OCR 文字＋原頁影像交給 Claude 3.7 Sonnet 校正錯字、重建表格、改寫（表格轉成敘述句、補同義詞）。
- 每組實驗重複 3 次，報平均±標準差；指標 MRR、Precision@1。

## 可引用結果（v3 數字，表 3–5，行 246–283）

| 設定 | BM25 P@1 | Dense P@1 | Hybrid P@1 |
|---|---|---|---|
| Tesseract OCR 基線 | 41.51±1.67 | 32.10±0.74 | 38.98±0.88 |
| KAP 完整 | 51.16±0.21 | 53.65±2.24 | 59.73±1.10 |

1. **OCR 文字很髒時，dense 最差、混合檢索也沒贏過 BM25**：基線 P@1 BM25 41.51 > Hybrid 38.98 > Dense 32.10；MRR 也是 BM25 53.16 ≈ Hybrid 53.23 > Dense 48.41。
2. 文字清乾淨後三者都升，Hybrid 最高（59.73），且 dense（53.65）反超 BM25（51.16）。
3. 消融（行 308–333）：拿掉影像（只給 OCR 文字）掉最多，Hybrid P@1 59.73 → 47.33。
4. OCR 錯誤例（行 84–89）：「0」被認成「O」、「1」被認成「l」；表格結構消失，數字和欄位對不上。
5. 作者對繁中的說法（行 31–36）：BM25 對同義詞與說法差異敏感，"particularly in Traditional Chinese, where word order plays a crucial role in retrieval performance, and the language's vast vocabulary with abundant synonyms makes semantic matching even more challenging"。

## 沒寫的事

- 混合檢索的融合方法與權重沒寫。
- 驗證題只有 50 個原始題，500 題是同一模型（Claude 3.7 Sonnet）改寫出來的，且改寫與文字校正用的是同一個模型；改寫題刻意加入同義詞，對 dense 有利。
- 沒有沒做 OCR 的原生文字 PDF 對照組；結論只適用於掃描或 OCR 文件。
- 8,000 token 的塊非常大，沒比較其他塊大小。
- 沒報 KAP 每頁的費用與時間。

## 與範圍卡的關係

- 支持「編號、代碼」那一半：財報的數字、代碼在 OCR 後容易錯（0/O、1/l），這時 BM25 與 dense 都會壞，但文字錯誤對 dense 傷害更大（基線 dense P@1 只有 32.10）。
- 反向提醒：「混合一定比較好」不成立——基線時 hybrid 的 P@1 低於 BM25。混合檢索的前提是文字品質；這可接回 order 13（解析與清洗）。

## 對 order 16 的用法

- 「關鍵字或向量或兩者」段落：DAT（繁中閱讀理解）＋ KAP（繁中財報 OCR）兩個台灣研究可一起講——乾淨文字上混合最好；文字髒時向量最先壞。都是預印本、都是政大同一團隊，要標明。
