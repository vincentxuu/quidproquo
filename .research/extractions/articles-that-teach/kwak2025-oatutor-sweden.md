# 抽取紀錄：Kwak、Dunder、Viberg & Pardos 2025，L@S '25（刊出版）

- **書目**：Yerin Kwak（UC Berkeley）、Nora Dunder（KTH）、Olga Viberg（KTH, Digital Futures）、Zachary A. Pardos（UC Berkeley），2025，Adaptive Tutoring Goes to Sweden: Machine Translation and Alignment of English OERs to a Swedish Calculus Course，*Proceedings of the Twelfth ACM Conference on Learning @ Scale (L@S '25)*，July 21–23, 2025, Palermo, Italy，pp. 50–61（12 頁）。doi 10.1145/3698205.3729549。作者全名與頁碼對過 PDF 首頁的 ACM Reference Format。
- **原文檔**：`.research/raw/learning-content/q5/sweden-mt-oer2025.pdf`（12 頁，1,902,178 位元組）。清單登記的 `sweden-mt-oer2025.txt`（783 行、95,077 字元）是 `-layout` 雙欄轉文字。本次改用不帶 `-layout` 的 `pdftotext` 重轉，存為同目錄 `sweden-mt-oer2025.nolayout.txt`（1,288 行、72,782 字元）；下面的行號都指這個檔，頁碼指論文集頁碼。
- **版本與取得網址**：刊出版。PDF 首頁印有「This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License」與「© 2025 Copyright held by the owner/author(s)」（L91–93），PDF 中繼資料由 ACM acmart 排版。出版者的 PDF 網址是 https://dl.acm.org/doi/pdf/10.1145/3698205.3729549（搜尋結果列出此網址；2026-10-14 用 curl 直接抓被 Cloudflare 擋，回 403，所以沒能比對檔案雜湊）。本機這份 PDF 當初的下載網址**沒有記錄**。KTH DiVA 有紀錄頁（https://www.diva-portal.org/smash/record.jsf?pid=diva2:1994852），頁面標 Open Access，但 FULLTEXT01.pdf 抓回的是 HTML，沒有取得檔案。Unpaywall 與 OpenAlex（2026-10-14）都標 closed，與 PDF 上的 CC BY-SA 4.0 聲明不一致；以 PDF 本身的授權聲明為準，這份檔可合法散布。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 24（清單 F 第 24#7 列）

## 研究設計

- **類型**：個案研究（關鍵詞與摘要都自稱「case study」），內容分兩部分：(1) 英文數學教材翻成瑞典文的機器翻譯方法比較；(2) 用 AI 把 OATutor 題庫對齊到瑞典課程大綱。**沒有學生，沒有量學習成效。**
- **情境**（2.2 節，p. 51；L157–175）：KTH「Technical Preparatory Year」（高中到大學之間的預備年）的 Mathematics for Preparatory Year II（Matematik för basår II）微積分課，部署在線上班。系統是 UC Berkeley 開發的開源適性家教 OATutor，題目改編自 OpenStax 開放教材，Calculus 教科書共 893 題（L547）。
- **翻譯部分**（4.1 節，pp. 53–54）：
  - 測試集：從 OATutor 取 200 句，100 句題目／提示、100 句章節標題（標題術語密度高）。參考譯文由**一位以瑞典語為母語的作者**人工製作（L327–341）。
  - 指標：SacreBLEU（corpus BLEU）與 xCOMET-XL（有參考譯文版），都是 0–100。生成式模型各跑五次取平均（L342–361）。
  - LaTeX 先換成佔位符再翻，翻完放回（L401–403、L363–369）。
  - Phase 1：OPUS-MT、mBART-50、GPT-3.5，再比 GPT-4、GPT-4o、GPT-4o-mini；GPT-4o 當基準（L370–377）。沒有微調開源模型，理由是缺英瑞數學平行語料（L378–385）。
  - Phase 2：GPT-4o 三種提示——context-informed、multi-turn（請模型上網查證術語）、five-shot（L386–397）。
  - Phase 3：RAG，把瑞典文維基百科數學條目切段、翻成英文、做 embedding，用詞彙比對加語意比對（門檻 0.38，recall > 0.92、precision 0.66）取出術語的英瑞兩邊說明，餵給 GPT-4o 修譯（L415–454）。
  - 最後用 RAG 翻全部部署內容，再由**授課教師做譯後編輯**（L434–437）。
- **課綱對齊部分**（5 節，pp. 55–58）：教師提供的大綱（瑞典文，由作者譯成英文）、課本 *Matematik 5000 Kurs 4 Blå* 五節共 92 題。用 GPT-4o 把課本題目譯成英文；兩種方法找對應的 OATutor 題目：(a) text-embedding-3-large 的餘弦相似度，題對題比對共 82,156 組；(b) 微調 GPT-3.5 預測技能標籤。教師在不知道哪個方法預測的情況下判斷哪些技能與課程相符（L708–716）。

## 結果（逐項）

### 機器翻譯（Table 1，p. 56，已對 PDF 版面）

| 模型／策略 | 題目 xCOMET | 題目 BLEU | 標題 xCOMET | 標題 BLEU |
|---|---|---|---|---|
| OPUS | 88.02 | 86.31 | 91.78 | 29.48 |
| mBART | 87.79 | 84.42 | 90.23 | 17.72 |
| GPT-3.5 | 88.36 | 88.11 | 91.66 | 39.28 |
| GPT-4 | 91.21 | 90.54 | 92.78 | 51.67 |
| GPT-4o | 91.88 | 92.30 | 92.95 | 54.23 |
| GPT-4o-mini | 90.41 | 90.13 | 92.01 | 45.09 |
| Context-Informed | 92.14 | 94.25 | 94.73 | 57.54 |
| Multi-Turn | 90.16 | 93.48 | 94.98 | 59.18 |
| Few-Shot | 91.09 | 92.56 | 93.84 | 58.63 |
| RAG | 92.06 | 93.35 | 95.15 | 61.27 |

- 題目句各模型 BLEU 都在 84–94；**術語密集的標題句 BLEU 低很多**（17.72–61.27）。原文：「The models tested generally performed well in translating mathematical problems but struggled with terminology dense sentences like section titles」（L968–969）。
- RAG 在標題句最好（BLEU 61.27、xCOMET 95.15）；題目句 Context-Informed 最好，RAG 略低（差 0.08 xCOMET、0.90 BLEU）（L510–515）。
- 結論段：對 GPT-4o 無介入的標題翻譯，RAG 提升 BLEU 7.04、xCOMET 2.2（L1019–1025；61.27 − 54.23 = 7.04，95.15 − 92.95 = 2.20，算得出來）。
- 例子：GPT-4o 把「Exponents and Scientific Notation」譯成「vetenskaplig notation」，瑞典數學裡少用；RAG 找到標準用語「grundpotensform」（L974–977）。
- **譯後編輯**（Table 2，p. 56，已對 PDF）：部署內容 2,544 詞中教師改了 30 詞（1.18%），332 句中改了 5 句（1.51%）（L516–518）。作者推算專業譯者一天約 2,000 詞，人工翻要超過一天（L954–955）。

### 課綱對齊（Table 3、Figure 3，pp. 57–58，已對 PDF）

- 餘弦相似度門檻 0.53／0.54／0.55／0.56 分別讓每節平均 31.6／26.6／20.8／15.4 題；選 0.55 以接近 OATutor 每課平均 21.7 題。共對到 104 題：第 1 節 0、第 2 節 4、第 3 節 19、第 4 節 64、第 5 節 17（L836–845）。
- 技能標籤法在第 1 節的預測**全是幻覺**（不在 OpenStax 技能表內）（L850–851）。
- 兩法合計 16 個技能，6 個兩法都有（L852–853）。教師判定 6 個不相關、10 個相關；兩法重疊的 6 個中 5 個相關（只有 Trigonometric Identities 不相關）（L854–858）。
- 各節：第 2 節兩法都錯；第 3 節餘弦 3/5、標籤 3/3；第 4 節餘弦 4/5、標籤 2；第 5 節餘弦 4/5、標籤 4/4（L870–874）。
- 教師對 10 個相關技能的題目評語分四類（Figure 3）：無問題、錯字或小錯（5 個技能，含答案錯、提示誤導）、超出課程範圍（2 個技能，例如 sec、csc、cot 不教，相關題目刪除）、需要依瑞典課綱重寫情境（1 個技能：Net Signed Area，美國題目較抽象，建議改成物體移動距離之類的具體情境）（L875–907）。
- 小數點：瑞典用逗號，簡答題會把「1,2」判錯，改成兩種都接受（L908–913）。
- 省時估算：OATutor 微積分 88 個技能、平均每技能 11.5 題，假設每題審 95 秒（依 SAT 數學每題時間），全部審要 26.71 小時；只審推薦的 16 個技能要 4.86 小時，少 81.82%（L961–967；算式自洽）。
- 全程不到三週，系統已部署、內容以 CC BY 公開（L1031–1033）。

## 作者自己列的限制（7 節，L994–1010）

1. **沒有評估對學生學習的影響**：「Evaluating the system's impact on student learning can provide insights for improvement」，列為未來工作。
2. 只翻文字，圖片沒翻。
3. 維基百科資料庫沒涵蓋所有相關數學內容。
4. 課綱對齊中教師剔除 6 個不相關技能，「indicating that AI is not yet capable of fully replacing human judgment」；依教師意見的內容修改是人工做的。

## 與摘要說法不一致的地方

- 摘要說「demonstrating a novel method for translating math content」並「successfully deployed」，正文的證據是自動指標（以單一作者的參考譯文為標準）與教師譯後編輯比例，**沒有學生端的資料**；「successfully」指部署完成，不是學習有效。摘要沒有聲稱學習成效，這點一致。
- 正文內部數字對不上的地方：
  - L489–491 說標題翻譯「GPT-3.5 also led (xCOMET: 91.66 …), with OPUS close in xCOMET (91.78)」——OPUS 的 91.78 其實高於 GPT-3.5 的 91.66，GPT-3.5 只在 BLEU 領先。
  - L501–502 說題目句 Context-Informed 勝 Multi-Turn「2.18 xCOMET points」，Table 1 算是 92.14 − 90.16 = 1.98。
  - L512 說 RAG 在標題句勝 Phase 2 最佳策略「0.17 xCOMET points and 1.64 BLEU points」；xCOMET 對 Multi-Turn 是 0.17 沒錯，BLEU 對 Multi-Turn 是 61.27 − 59.18 = 2.09、對 Context-Informed 是 3.73，都不是 1.64。
  - Table 2 的 332 句是部署內容，不是 200 句測試集；譯後編輯的「標準」是教師本人的修改，不是獨立評審。
- 除此之外逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單（24#7）：「機器翻譯教材的個案；有沒有量學習成效掃描時不知道」。

- 現在知道了：**沒有量學習成效**，作者在限制段明說是未來工作。這篇只能撐「機器翻譯數學教材的可行性與成本」，不能撐任何「翻譯後學生學得一樣好」的說法。
- 能撐的具體說法：(1) 題目句的 BLEU 各模型都在 84–94，**術語密集的標題句 BLEU 明顯較低**（17.72–61.27），要靠術語資源（RAG 接維基百科）補；但 xCOMET 標題句反而略高於題目句，作者的解釋是 xCOMET 著重語意、對小的術語錯誤較寬容（nolayout L969–971）；(2) 翻完由教師譯後編輯，只改了 1.18% 的詞；(3) 在地化不只是翻譯——課綱範圍、題目情境框架（Net Signed Area）、小數點符號都要改，AI 對齊推薦的 16 個技能中 6 個被教師剔除。
- 自動指標的參考譯文由一位作者製作，Phase 3 的 RAG 優勢在標題句是 BLEU +7.04，但正文有兩處差距數字算不回 Table 1，引用時以 Table 1 為準。

## 讀取紀錄

- 依序讀 `sweden-mt-oer2025.nolayout.txt` L60–479、L480–1039、L1039–1098，首尾相接；L1–60（標題、作者、摘要、引言開頭）在開檔確認時印出讀過；L1099–1288 是參考文獻，掃過到檔尾（p. 61），沒有附錄。合計涵蓋全文。
- 不帶 `-layout` 轉出的文字仍有欄位順序錯置（例如 2.2 節排在 2.1 節前、4.1.2 節排在 4.1.4 節後、Table 3 的格子打散），閱讀時依章節編號重排理解；表格一律以 PDF 為準。
- 對 PDF 版面：用 Read 讀 PDF 第 7–9 頁（論文集 pp. 56–58），逐格對過 Table 1、Table 2、Table 3 與 Figure 3（16 個技能、6 個打叉、顏色分類），與上面的數字一致。Figure 1（RAG 流程圖）與 Figure 2（大綱、課本、OATutor 截圖）只看了圖說與 Figure 2 的版面。

## 2026-10-14 審稿後更正

- 「與清單不合」節的第 (1) 點原寫「一般題目句機器翻譯的自動指標高，術語密集句明顯較差」，把 xCOMET 也算進「較差」。對 Table 1 與原文 L969–971：標題句只有 BLEU 偏低，xCOMET 反而比題目句高（例：GPT-4o 題目 91.88、標題 92.95；RAG 92.06、95.15）。已改寫成只有 BLEU 較低，並補上 xCOMET 的方向與作者的解釋。依據：`.work/reviews/2026-10-14-o24-language-mobile-review.md` M3。
