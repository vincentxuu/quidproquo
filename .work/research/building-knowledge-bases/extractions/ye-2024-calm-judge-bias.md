# 抽取紀錄：Ye, Wang, Huang 等 (2024/2025) Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge（CALM）

read_status=full（arXiv v2 PDF 35 頁；正文 1–10 頁逐段讀，表格以 -layout 版核對；附錄 A–D、Table 7–8、案例 Figure 9–10 逐段讀；Figure 11–32（案例與提示詞範本）掃讀）

## 書目

- Jiayi Ye、Yanbo Wang、Yue Huang（共同一作）、Dongping Chen、Qihui Zhang、Nuno Moniz、Tian Gao、Werner Geyer、Chao Huang、Pin-Yu Chen、Nitesh V. Chawla、Xiangliang Zhang（Notre Dame、UW、PKU、IBM Research、HKU）。
- arXiv:2410.02736 v2（2024-10-04），版面標 "Preprint"；ICLR 2025 接受（未讀正式版，數字以 v2 為準）。網站 https://llm-judge-bias.github.io/
- 讀取：curl https://arxiv.org/pdf/2410.02736（6,196,891 bytes）→ pdftotext → scratchpad/fulltext/o19-ye2025-calm-judge-bias.txt（2,866 行、119,409 bytes）讀 1–900；第 8–10 頁與第 11–35 頁另以 -layout 讀（o19dl/calm-appx.txt，1,495 行）。

## 研究設計

- 12 種偏誤（Table 1）：位置、冗長、知道模型名稱（compassion-fade）、從眾（bandwagon）、無關干擾、忽略推理謬誤、權威（假引用）、情緒、身分、CoT、自我偏好、知道是修改版（refinement-aware）。
- 方法：對答案做不改變正確性的擾動（多由 GPT-4o／GPT-4-Turbo 改寫），看評審判斷是否改變。指標 Robustness Rate（RR，擾動前後判斷相同的比例）與 Consistency Rate（CR，同條件重跑兩次判斷相同的比例）（行 628–655）。
- 評審：ChatGPT（gpt-3.5-turbo-0125）、GPT-4-Turbo、GPT-4o、Claude-3.5-Sonnet、GLM-4、Qwen2-72B（Table 8）。樣本 150–500 題（Table 2–3）；temperature 0.7。

## 可引用結果（Table 4、5、7）

1. 不加任何擾動、同題重跑：alignment 資料集 CR 0.856（GPT-4-Turbo）到 0.925（GPT-4o）——即約 7.5–14.4% 的判斷第二次會換邊；fact-related 資料集 CR 0.970–0.999。
2. 位置偏誤：兩個答案對調順序，ChatGPT RR 0.566、Claude-3.5 0.832；答案增到 3–4 個時多數模型 RR < 0.5（§4.2）。
3. 假引用（權威偏誤）：在答案後加假書目，RR 0.628（ChatGPT）到 0.856（Claude-3.5）；URL 型干擾最小（Table 7）。
4. 情緒：把較好答案改成生氣／悲傷／恐懼語氣，GPT-4o RR 降到 0.243–0.355、Claude-3.5 0.256–0.260（Table 7）；模型普遍不喜歡帶情緒的回答。
5. 自我偏好：評自己的答案比別人評它高；error rate Qwen2 16.1%、ChatGPT 8.91%、Claude-3.5 7.48%、GPT-4o 1.74%（Table 5）。作者建議 "Avoid using the same model to generate and judge answers."（§4.2）
6. 偏誤在品質差距小的 alignment 資料集比 fact-related 資料集明顯（§4.1）。
7. 最強模型不一定最穩："identifying the best model is not straightforward; it depends on the specific bias involved"（§4.1）。

## 作者建議

- 提示詞加防護句、用 CoT、防 prompt injection、先跑偏誤檢測（§5，Table 6）。

## 限制

- 擾動由 LLM 生成，正確性是否真的不變靠作者人工抽查；沒有大規模人工對照。
- 不是 RAG 情境；題目為數學、科學、DPO 偏好資料。
- 2024 年中的模型版本。

## 對 order 19 的用法

- 「LLM 當評審有偏誤」的 2024 後實證（Thakur 之外的第二篇）：同題重跑就會換邊、順序對調會換邊、假引用會加分、自評偏高。
- 實作建議可直接落地：評審模型與生成模型分開（與 Azure E 248–252 呼應）、隨機化順序、同題跑兩次看一致率、抽樣人工校準。
- 不要寫成「LLM 評審不可用」：fact-related 資料集上 CR 0.97 以上、謬誤偵測 RR 0.92–0.99，事實題比偏好題穩。
