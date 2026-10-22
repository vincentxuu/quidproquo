# Barnett et al. 2024 — Seven Failure Points When Engineering a RAG System

- 書目：Barnett, Kurniawan, Thudumu, Brannelly, Abdelrazek. CAIN 2024（3rd Intl. Conf. on AI Engineering），Lisbon。arXiv:2401.05856。讀的版本：https://arxiv.org/html/2401.05856v1（exa web_fetch，maxCharacters 80000，未截斷，含 References 到 HTML 錯誤回報段為止）。
- 設計：經驗報告（experience report）。三個案例：Cognitive Reviewer（研究、PDF）、AI Tutor（教育、影片/HTML/PDF，38 份文件，200 名學生試行）、BioASQ（生醫，4017 份開放取用文件、1000 題）。BioASQ 用 OpenAI evals 自動評，人工檢查 40 個問題與所有被標錯的。
- 可引用結果：
  1. 七個失敗點（§5）。FP1 Missing Content：「when asking a question that cannot be answered from the available documents … the system could be fooled into giving a response.」其餘：FP2 排名不夠前、FP3 沒進 context、FP4 沒抽出來、FP5 格式錯、FP6 具體程度不對、FP7 不完整。
  2. 摘要兩個結論：「1) validation of a RAG system is only feasible during operation, and 2) the robustness of a RAG system evolves rather than designed in at the start.」
  3. Table 2：「Adding meta-data improves retrieval. Adding the file name and chunk number into the retrieved context helped the reader extract the required information.」（AI Tutor）；「RAG systems require continuous calibration … requiring constant monitoring.」
  4. §1 對 RAG 的期待：「reducing development time no knowledge graph creation and limited data curation and cleaning」——作者描述的期待，不是結論；FP1 本身就是語料缺漏造成的失敗。
- 作者列的限制：BioASQ 評審非領域專家（§4.3）；另兩個案例資料因保密未公開。
- 與摘要不一致：摘要沒提文件數；§1 與 §7 Conclusion 寫「15,000 documents」，§4.3 與 Table 1 寫下載 4017 份。引用文件數時用 4017（Table 1），或不引數字。
- 讀取紀錄：HTML 全文一次取回（約 3.3 萬字元），依序從標題讀到 References 結束。
