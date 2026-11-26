# M-chinese：中文與繁體中文 benchmark（精讀抽取紀錄）

批次：M-chinese｜讀取日期：2026-11-23｜讀法：arXiv PDF → `pdftotext`（scratchpad）→ 依序分段讀。字元數為去除多餘空白後的純文字長度。

讀取管道說明：所有指定來源都在第一步（arXiv PDF 直接下載＋`pdftotext`）就讀到全文，因此沒有走到 Exa／jina／WebFetch 的 fallback。jina `search_arxiv` 在補搜時回「key out of quota」，改用 Exa `web_search_exa` 完成補搜。

---

### C-Eval: A Multi-Level Multi-Discipline Chinese Evaluation Suite for Foundation Models（2023，NeurIPS 2023 Datasets & Benchmarks）
- 網址：https://arxiv.org/abs/2305.08322（讀 v3 PDF，2023-11-06）
- 讀取狀態：✅
- 讀取紀錄：全文約 71,000 字元、20 頁。依序讀第 1–1,000 行（摘要、§1 引言、§2 設計原則／資料蒐集／C-Eval Hard／評測、§3 實驗與 Table 1–7、§4 相關研究、§5 討論）；跳過參考文獻後，讀附錄 A（作者分工）、B（Table 8 各科題數與分類）、C（解析生成）、D（prompt）、E（模型說明）、F（Table 9／10 各科分數，逐列看過，只抽有引用價值的數字）、G（選項偏誤，Table 11–12）、H（運算資源）。合起來涵蓋全文。
- 類型：研究論文（benchmark 論文）
- 研究設計或文件目的：建一套「中國脈絡」下測知識與推理的四選一選擇題 benchmark：52 科、13,948 題，分國中、高中、大學、專業四個難度。另外把 8 個數理化科目抽出來組成 C-Eval Hard。評測 11 個模型（GPT-4、ChatGPT、Claude-v1.3、Claude-instant、Bloomz-mt、LLaMA-65B、GLM-130B、ChatGLM-6B、Chinese-LLaMA／Alpaca-13B、MOSS），設定包含 zero-shot、five-shot answer-only 與 five-shot CoT。
- 會被引用的結果：
  1. **為什麼不能只翻譯英文 benchmark**（§1）："We emphasize that simply translating English benchmarks as in OpenAI (2023), even with flawless translations, does not fulfill the goal – LLMs intended for use in a Chinese environment should be evaluated on their knowledge of Chinese users' primary interests, such as Chinese culture, history, and laws" ；以及 "English benchmarks tend to exhibit geographical biases towards the domestic knowledge of the regions that produce them."
  2. **題目來源與防污染**（§2.1、§2.2）：刻意避開高考這類全國考試，改收模擬考與小規模地方考（例如個別高中放上網的考卷）："we collect our data either from mock exams or from small-scale local exams, such as those available online from specific high schools." 大部分題目來自 PDF／Word，由作者解析與標註："most samples in C-Eval are sourced from PDF or Microsoft Word documents on the Internet, rather than directly from plain text or structured questions … This further minimizes the risk of data contamination." 另外約 2,000 題是維普網站付費的考研模擬題，取得授權後收錄（"we have obtained their authorization to include around 2000 such questions"）。
  3. **處理流程**（§2.2）：PDF 先轉成文字，能自動解析就自動，不行就人工。STEM 公式人工轉成 LaTeX。不足四個選項的題目丟掉，超過四個的隨機刪掉錯誤選項，再經過去重與「several rounds of human validation by the authors」。每科至少約 200 題，dev 5 題（附 GPT-4 生成、再經人工修訂的 CoT 解析），val:test = 1:9。
  4. **測試集標籤不公開**（§2.4）："While ground-truth labels of the development and validation splits are released, we keep the labels of the test split private. This is to ensure the fair use of the C-EVAL, as the C-EVAL data may unconsciously be included in pretraining data due to web crawling." 使用者要把預測上傳到 cevalbenchmark.com 才拿得到分數。
  5. **難度分級**（Table 1）：國中 7 科／1,409 題、高中 8 科／1,594 題、大學 25 科／6,249 題、專業 12 科／4,696 題。依主題分：STEM 20、人文 11、社科 10、其他 11。split 為 dev 260、val 1,346、test 12,342。大學科目從教育部 13 個學科門類各至少挑一科，專業科目參考國家職業資格目錄。
  6. **當時的整體分數**（Table 3，zero-shot AO 平均）：GPT-4 66.4、ChatGPT 51.0、Claude-v1.3 50.5、Bloomz-mt 44.3、GLM-130B 44.0，隨機基準 25.0。原文："GPT-4 is the only model that exceeds 60% average accuracy"。five-shot AO 時 GPT-4 為 68.7（Table 4）。
  7. **中文導向模型與英文模型的差距集中在 STEM**（§3.3，zero-shot AO）：GLM-130B 總平均落後 ChatGPT 7.0 分，但社科只差 2.2、人文只差 1.1，STEM 則差 12.3。原文："by leveraging more Chinese data, the model might achieve performance on par with or even superior to ChatGPT in areas pertaining to Chinese knowledge, such as history, politics, and law … a significant difference of 12.3 points … in the STEM category"。
  8. **C-Eval Hard**（§2.3、Table 6）：收高等數學、離散數學、機率統計、大學化學、大學物理、高中數學、高中化學、高中物理 8 科。GPT-4 在 zero-shot AO／five-shot AO／five-shot CoT 分別是 53.3／54.9／56.8。原文："only GPT-4, ChatGPT, and Claude manage to make meaningful progress – improving by at least 10 points – over a random baseline."
  9. **few-shot 與 CoT 不一定有幫助**（§3.3）：GLM-130B、Bloomz-mt、ChatGLM-6B、MOSS、Chinese-Alpaca 用 five-shot 反而退步。CoT 讓所有模型的平均「comparable or lower」，但個別科目會進步，例如 GPT-4 大學物理從 50.6 升到 60.2。
  10. **驗證集可當開發參考**（§3.3、Table 7）：val 平均分數與排名都和 test 接近，所以 "developers may use the average validation accuracy as a good indicator"。這一點後來成為問題，見「反證」。
  11. **選項偏誤**（附錄 G、Table 11–12）：正解分布 A 22.9%、B 26.0%、C 26.4%、D 24.7%，和 MMLU 相近。對 ChatGPT、ChatGLM-6B、ChatGLM2-6B 各做 5 種選項排列，總分變異數 0.6／0.7／0.2，作者判斷 "relatively small"。
- 作者自己列的限制：§5 寫到 "C-EVAL, along with all the English-language benchmarks, is far from perfect for LLM evaluation"，也承認沒有涵蓋 API 呼叫、安全、偏見、穩健性。驗證集每科平均不到 30 題，"tracking accuracy on a specific subject may not yield significant insights"。文心一言、通義千問、訊飛星火沒有授權，無法評測。
- 與摘要說法不一致處：逐項對過，數字與摘要一致（GPT-4 平均 66.4%、C-Eval Hard 53.3%）。值得注意的是，摘要與正文都把 PDF 來源與模擬考寫成「緩解」污染（mitigate、minimize），沒有宣稱能杜絕，用詞本身沒有過度宣稱。另一點：科目清單含「毛澤東思想和中國特色社會主義理論體系概論」、「馬克思主義基本原理」、「思想道德修養與法律基礎」、高中／國中政治等，屬於中國官方意識形態課程。論文把它們分在人文或社科，沒有另外標示。
- 反證或後續修正：
  - Li et al. 2024（EMNLP Findings, *An Open-Source Data Contamination Report for LLMs*，https://aclanthology.org/2024.findings-emnlp.30.pdf ，本批補讀，見下）在 C-Eval 驗證集 1,346 題中，找到 **45.8%（616 題）** 以近乎逐字的形式出現在 Bing 搜尋結果且被 Common Crawl 收錄，其中 40.6% 連答案一起出現。Yi-6B 在「題目與答案都外流」的子集準確率比乾淨子集高 **14 分**（.8117 vs .6718）。可見「PDF 來源可降低污染」這項設計，到 2023 年底已經擋不住。
  - 同一篇指出：test 標籤不公開，使得 OpenCompass 等第三方平台 "turn to using their validation sets instead of the test sets"。結果實務上大家最常跑的反而是污染最重、題數最少的 val split。
- 對系列的用途：用來支撐「中文 benchmark 怎麼建」一段：模擬考／地方考＋PDF 解析＋隱藏 test 標籤，是「防污染設計」的教科書範例；搭配 2024 的污染報告，可以說明這些設計的效果會隨時間遞減，而且「隱藏標籤」會把使用者推向公開的 val。

---

### CMMLU: Measuring Massive Multitask Language Understanding in Chinese（2023／v2 2024-01）
- 網址：https://arxiv.org/abs/2306.09212（讀 v2 PDF，2024-01-17）
- 讀取狀態：✅
- 讀取紀錄：全文約 104,000 字元。依序讀摘要到 §5 結論（含 Table 1–4、Figure 1–6，第 1–1,360 行）；跳過參考文獻後，讀附錄 A（與 C-Eval／M3KE 的比較與重疊）、B（Table 6 全 67 科＋China-specific 標記、Table 7 統計）、C（Table 8 例題）、D（難度分布）、E（湧現能力）、F（模型說明）、G（三種選項判定策略與 Table 9）、H（regex 演算法）、I（與其他 benchmark 的相關）、J（各科分數表，只看說明文字與表頭）。
- 類型：研究論文
- 研究設計或文件目的：簡體中文的 MMLU 式 benchmark，67 科、11,528 題（正文數字）。從小學到專業，包含多個中國特有科目（駕駛規則、飲食文化、中醫、古漢語等）以及世界知識科目。評測 GPT-4、ChatGPT 與 20 多個開源模型，並分析 CoT、few-shot、模型大小、否定句、子選項題各自的影響。
- 會被引用的結果：
  1. **翻譯版 MMLU 的問題**（§1）："Although some researchers (OpenAI, 2023) have attempted to automatically translate it … the inherent bias towards Western (and specifically US) culture in the dataset renders it unsuitable and even inappropriate for assessing LLMs across diverse cultures and languages." 也提到有些任務 "can only expressed in Chinese, such as ancient Chinese language and Chinese literature … almost impossible to be obtained from translation"（§3）。
  2. **中國特有科目**（§3 Statistics、附錄 B Table 6）：正文寫 "Among these, 16 tasks are China-specific, which means they either do not exist in other countries or regions, or their answers may be different in other places." Table 6 打星號的有 **15 科**：古漢語、中國歷史、中國文學、中國公務員考試、中國駕駛規則、中國飲食文化、中國外交政策、中國教師資格、建設工程管理、小學語文、小學常識、民族學、高中政治、現代漢語、中醫中藥。Figure 3 的 China-specific 分組另外多列了「Education（教育學）」，合計 16。
  3. **約 2% 標註雜訊的估法**（§3 Quality Check）：每科隨機抽 5% 題目，對照網路資源逐題核對。"We estimate that there is around 2% of noise in the data, in terms of the correct answer not being present or being incorrectly labeled. Based on the results in Section 4 that most models struggle to achieve an average accuracy of 60%, we believe such an error rate does not compromise the overall results." 注意這個論證是「當時模型離天花板很遠」，所以雜訊不影響結論。
  4. **防污染作法**（§3 Data collection）："we invested specific effort in identifying non-publicly available materials, mock exam questions, and questions from quiz shows. More than 80% of our data was crawled from PDFs (after OCR)". 雇 4 位大學以上學歷標註者，時薪 50 人民幣，共約 250 小時。
  5. **資料全公開**（§2）：和 C-Eval 相反，"we have made our data completely public, enabling the community to evaluate their models freely"，沒有隱藏測試集。
  6. **與 C-Eval／M3KE 的重疊**（附錄 A）：選項排序、去標點後做 exact match，與 C-Eval 重疊 74 題、與 M3KE 重疊 158 題，"approximately 1% of our dataset"。
  7. **整體分數**（Table 1，five-shot）：GPT-4 70.95、ChatGPT 55.51、LLaMA2-70B 53.21、Baichuan2-13B 61.92（13B 就超過 ChatGPT）。China-specific 欄：GPT-4 66.12、ChatGPT 50.69、Baichuan2-13B 63.48。原文："Baichuan2-13B demonstrates the best overall performance (beats ChatGPT) with only 13B parameters."
  8. **中國特有知識是多語模型的弱點**（§4.1、Figure 3）：Baichuan2 在 8 科勝過 GPT-4，其中 **6 科是 China-specific**，另外 2 科（藝術、哲學）"contain a large amount of Chinese elements"。原文："China-specific topics encompass information that is either absent from the training data or inconsistent in multilingual training data"。
  9. **子選項題**（§4.2、Table 4）：約占 10.8%，所有模型在這類題目都掉 10–20%。GPT-4 zero-shot 有子選項 51.14、無子選項 69.74。
  10. **否定句**（§4.2、Table 3）：約 10.7% 的題目含否定詞，多數模型在這類題目表現較差。Baichuan2 把差距從 8–10% 縮到 1–2%。
  11. **選項判定策略影響分數**（附錄 G、Table 9）：next-token 機率法對所有模型都比自由生成＋regex 高，zero-shot 多數差距 <3%，BatGPT 約 5%。差距與 regex 抓不到答案的比例正相關。CoT 讓 Xverse 抓不到答案的比例多了 19.77%（§4.2、Table 2）。
- 作者自己列的限制：只有約 2% 雜訊的估計，以及湧現能力無法和訓練資料量分開（附錄 E："We cannot simply attribute it to emergent ability"）。正文沒有獨立的 limitations 章節。
- 與摘要說法不一致處：
  - China-specific 科目數：正文寫 16，Table 5（附錄 A）寫 15，Table 6 打星號的也是 15；只有 Figure 3 的分組合計 16（多了 Education）。
  - 總題數：正文寫 11,528，Table 7 統計列寫 11,582。
  - 摘要說「60% 是中國考試的及格線」，正文沒有給出處。
- 反證或後續修正：Benchmarking Benchmark Leakage（Xu et al. 2024, arXiv 2404.18824）與 *Training on the Benchmark Is Not All You Need*（Ni et al., AAAI 2025, arXiv 2409.01790）都把 CMMLU 列為洩漏檢測對象。補搜只讀到摘要與 repo 層級，沒有精讀，不引用具體數字。另外，CMMLU 全公開的設計讓它比 C-Eval 更容易被訓練資料吸收；這是推論，沒有一手數據。
- 對系列的用途：支撐「中國特有知識不能靠翻譯拿到」與「標註雜訊估法＋其限制」：2% 雜訊在模型 50–70 分時無所謂，但模型逼近 90 分以上時就會吃掉大部分剩餘差距，可以呼應系列講天花板與標註錯誤的篇章。

---

### TMMLU+: An Improved Traditional Chinese Evaluation Suite for Foundation Models（2024）
- 網址：https://arxiv.org/abs/2403.01858（讀 v3 PDF，2024-07-11）
- 讀取狀態：✅
- 讀取紀錄：全文約 128,000 字元。依序讀摘要、§1–§5（第 1–960 行，含 Table 1–6、Figure 1–5）；跳過參考文獻後，讀附錄 A（datasheet：資料來源比例、處理步驟）、B（科目表 8–11、出題年份、字元分布、選項分布）、D（prompt 與 Figure 8–10 例題）、E（模型說明）、F（Table 13 前四名逐科分數，看表頭與說明）、G（Table 14，與 C-Eval／CMMLU 的對照）、H（例題）。
- 類型：研究論文（作者：iKala AI Lab＋陽明交大）
- 研究設計或文件目的：TMMLU（TC-Eval 的一部分，55 科、3,300 題）的改良版：66 科、22,690 題（test 20,118／dev 330／val 2,242），從小學到專業。評測 23 個開源中文模型（1.8B–72B）與 GPT-4、Gemini-pro、Claude 系列，並做三組分析：繁轉簡、人類基準、tokenizer fertility。
- 會被引用的結果：
  1. **為什麼繁中要另外建**（§1）：用詞差異的例子是「記憶體／内存」，逐字轉換會得到「记忆体」，"which occupies an entirely different semantic space"。同字異義的例子是「丑／醜」。改良原因是舊版 TMMLU 有 5% 題目不是選擇題、1% 超過四個選項，也沒有 dev set。
  2. **題目來源**（§2.2、附錄 A）："We have gathered previous exams between 1998 and 2023 from various public exams such as certificate exams, comprehensive assessment programs for junior students, and college entrance examinations. This results in 962 exams". 來源比例（附錄 A）：公開考題 PDF 90.88%、TTQA 8.45%、TMMLU 0.67%。含台灣特有題（台語、原住民文化、台灣地理）與 TTQA（原本 103 題，人工補 29 題，改名 TTQAv2）。處理：刪掉含圖題；數學、化學式由 **GPT-4-vision** 轉成 LaTeX；同科 n-gram 去重；人工刪除需要圖或依賴前後題的題目；選項打亂讓正解均勻分布。
  3. **洩漏檢查**（§2.5）：用 Min-K%++、以 Qwen-7B 為參考，"find that only 0.48% questions exist in its pretraining data"。
  4. **整體分數與「簡中模型勝過繁中模型」**（Table 2，zero-shot／five-shot 平均）：Qwen-72B 64.3／64.7、GPT-4 60.3／67.5、Qwen-14B 50.5／51.4、Breeze-7B 36.1／28.6、Taiwan-LLM-13B 21.3／22.3、Taiwan-LLM-7B 15.6／5.1（隨機 25.0）。原文（§1）："Simplified Chinese language models outperform Traditional Chinese models in the same parameter level by at least 19%."
  5. **繁轉簡實驗（OpenCC）**（§3.5.1、Table 4，zero-shot 平均，簡／繁）：GPT-3.5 41.9／41.8、Gemini-pro 51.5／49.9、Qwen-14B 51.3／50.5、Qwen-7B 42.1／40.0；繁中導向模型 Breeze-7B 35.7／36.1、Taiwan-LLaMa-13B 16.0／21.3、Taiwan-LLaMa-7B 15.9／15.6。原文："using Traditional Chinese prompts can enhance the performance of LLMs trained specifically in Traditional Chinese, while Simplified Chinese prompts significantly improve the performance of multilingual and Simplified Chinese LLMs." 繁中模型在社科（文化脈絡最重）用繁體的優勢最明顯，例如 Breeze 社科 40.7→43.0。注意：多語與簡中模型轉成簡體後只多 0.1–2.1 分，差距很小。
  6. **繁簡詞彙共享比例**（§3.5.1）："Traditional and Simplified Chinese characters share only about 30% of their vocabulary" ——這句沒有附引用。
  7. **人類基準**（§3.4.2、Table 3，44 科有人類作答資料）：人類 68.2、Qwen-72B 62.1、GPT-4 58.4、Qwen-14B 47.5。人類在社科 72.1、人文 69.5 最強。分數是用各題的人類答對率（"passing rate based on the proportion of correct responses to total responses for each question"）算出來的。依難度分層（§3.5.5）："Qwen-72B outperforms humans in difficult questions across all major categories. However, most questions are dominated by easy difficulty, resulting in an average Qwen-72B score that falls short compared to humans."
  8. **tokenizer fertility 與分數**（§3.5.4、Table 6、Figure 4）：15 個約 7B 的模型，fertility 與 TMMLU+ 平均分的 Pearson r = **−0.742**；平均 token 數 −0.685；Rényi entropy 0.366。原文："indicating that high fertility negatively impacts downstream performances." 機制說明："In the case of Taiwan-LLaMA, 59.5% of Traditional Chinese characters in TMMLU+ are encoded with 256 bytes"（也就是退回 byte 級編碼）。
  9. **與簡中 benchmark 比較**（§3.5.2、Figure 3）：同一批模型在 C-Eval／CMMLU 的分數普遍比 TMMLU+ 高。
  10. **CoT 讓分數下降**（Table 5，five-shot）：Gemini-pro 51.1→51.1、Qwen-14B 45.3→46.3、GPT-3.5 41.9→30.0。
- 作者自己列的限制：沒有獨立的 limitations 章節。結論只寫 "none of the current LLMs achieve an average score surpassing human performance"。§2.5 自己提到 "Given the age of our questions, we suspect they may be present in the LLMs' training data"。
- 與摘要說法不一致處：
  - 「簡中模型同級領先繁中模型至少 19%」的對照，是 Qwen-7B（40.0）對 Taiwan-LLM-7B（15.6）這類組合。但 Taiwan-LLM 的分數**低於隨機 25%**（five-shot 只有 5.1%），比較可能是格式或答案擷取失敗，不是知識不足。論文沒有討論 regex 擷取失敗率，把它當能力差距解讀有疑慮。
  - Claude-3 Opus zero-shot 41.1、five-shot 64.2，差 23 分，同樣顯示格式遵循嚴重影響分數。論文沒有討論這點。
  - 附錄 A 的 TTQA 占 8.45%（約 1,900 題），但正文說 TTQA 只有 103＋29 題，數字對不起來。
  - 「繁簡只共享約 30% 詞彙」沒有出處。
  - 附錄 Figure 10 的 CoT 範例把「中國輸出入銀行」（台灣的 Export-Import Bank of the Republic of China）翻成 "Export-Import Bank of China"，本身就是繁簡／兩岸語境混淆的例子。Figure 9 的 prompt 標頭寫工程數學，題目卻是信託業務。
- 反證或後續修正：
  - TMLU（Chen et al. 2024, arXiv 2403.20180，本批精讀，見下）指出："most questions in TMMLU-plus could be found on one single website"（yamol.tw，該站內容出現在 mC4）；TMMLU+ 混有**簡體字題目**，也有需要圖表卻沒附圖的**無解題**（TMLU Figure 6b 的例子：「根據圖(十六)判斷…」）。TMLU 用 Min-K% Prob 比較，TMMLU+ 在 6 個 base 模型上都比 TMLU 更像「看過的資料」。這和 TMMLU+ 自己報的 0.48% 洩漏率互相衝突：兩者方法不同（Min-K%++ 單一參考模型 vs Min-K% 六個模型相對比較），不能直接對比，但足以質疑 0.48%。
  - TMLU 也指出 TMMLU+ 論文沒有揭露資料來源（"The source of data collection is not disclosed in the TMMLU-plus paper"）。
- 對系列的用途：繁中 benchmark 的主力案例，支撐三件事：(1) 繁簡差異不只是字形，(2) 「繁中模型輸給簡中模型」這個常被引用的結論，部分可能來自格式／擷取失敗，(3) tokenizer fertility 是繁中分數的結構性因素。也可以當「benchmark 的題目來源決定它多容易被污染」的台灣案例。

---

### VisTW: Benchmarking Vision-Language Models for Traditional Chinese in Taiwan（2025）
- 網址：https://arxiv.org/abs/2503.10427（讀 v2 PDF，2025-03-15）
- 讀取狀態：✅
- 讀取紀錄：全文約 64,000 字元。依序讀摘要到 §7 結論＋Ethics Statement（第 1–1,160 行，含 Table 1–6、Figure 1–4）；跳過參考文獻後，讀附錄 A／B（Discord 標註流程與指引）、C（解析度與長寬比）、D（模型列表 Table 8）、E（judge prompt、評分指引、MCQ prompt、例題 Figure 8–14），以及附錄末段「Does exams with figure harder」。該節只有問題陳述，沒有結果。
- 類型：研究論文（作者含台大陳縕儂）
- 研究設計或文件目的：第一個繁中視覺語言 benchmark，分兩部分。(1) VisTW-MCQ：2013–2024 年台灣考試中**必須看圖**的題目（醫學影像、幾何、電路、化學、航海圖等），21 科、test 3,795 題。(2) VisTW-Dialogue：131 組研究者自己拍的台灣生活照片＋開放式提問（看捷運圖、算菜單分帳、讀電表），由 VLM 當 judge 打 0–10 分。共評測 30 個左右的 VLM。
- 會被引用的結果：
  1. **為什麼需要繁中視覺題**（§1）：台灣圖片含繁中招牌、標籤、文件與在地內容，"cannot be adequately evaluated through simple character mapping from Simplified to Traditional Chinese, as they incorporate Taiwan-specific terminology, formats, and cultural knowledge."
  2. **MCQ 的建法**（§3）：從官方考古題與網路 PDF 人工擷取題目與圖片，"Each pair of questions and images was independently reviewed by a second annotator"，選項打亂。每科 ≥100 題 test、5 題 dev、10 題 val。評測用 zero-shot CoT，再用 gpt-4o-mini 當 parser 抽答案。
  3. **Dialogue 的防污染設計**（§4）："Each image was intentionally captured by our researchers to ensure that these image has never been seen during VLM training." 透過 Discord bot 收件，流程是提交者附答案、同儕審、emoji 投票，超過兩個倒讚就刪。收件期間 2024-07 到 2025-02，9 位貢獻者，"a concentration of samples from Taipei"。
  4. **VLM-as-judge 驗證**（§4.1、Table 2）：4 個模型的回答各由 3 位人類評分取平均，作為人類基準。單一 judge 的 Spearman ρ 中最高的是 claude-3-5-sonnet 帶圖 0.8336；gemini-2.0-flash 帶圖 0.8241，成本約為 Claude 的 1/36，被選為主 judge。全部 judge 取平均（ensemble）為 0.8466（不帶圖）／0.8463（帶圖）。每個模型評完一輪約 0.05 美元。
  5. **繁中模型輸給同級簡中模型**（§5）："The two Traditional Chinese VLMs in our evaluation, Breeze2-3B and Breeze2-8B, demonstrate inferior performance compared to Simplified Chinese counterparts of similar parameter scales, such as InternVL2.5-4B and InternVL2-8B variants." Table 3：Breeze2-8B MCQ 0.2915、Dialogue 3.14；InternVL2.5-4B MCQ 0.3291、Dialogue 3.60。注意這個差距很小，而且 MCQ 都只略高於隨機 0.25。
  6. **兩種格式的排名相關但不一致**（§5）：Dialogue 與 MCQ 的 Spearman ρ = 0.7746、Kendall τ = 0.6086。反例有兩個：gemini-2.0-flash-thinking 的 Dialogue 排第 2（6.51），MCQ 卻只有 0.376（第 14）；deepseek-vl2-small 的 MCQ 有 0.318，Dialogue 只有 0.51，因為它多半只輸出 bounding box。
  7. **拿掉圖片的對照**（§6.2、Table 4）：MCQ 帶圖／不帶圖：gemini-2.0-flash-lite 0.50／0.32、gpt-4o-mini 0.41／0.33、gemini-1.5-flash-8b 0.33／0.26、InternVL2.5-4B 0.33／0.29。Dialogue：5.92／2.35、4.74／1.95、4.18／1.85、3.60／1.29。表示不帶圖的 MCQ 已經接近隨機，題目確實依賴視覺。
  8. **解析度**（§6.1）：MCQ 在 1/8 到 4 倍解析度之間幾乎不變；Dialogue 縮到約一半解析度時開始穩定。
  9. **與 MMMU／CMMMU 相關**（§6.3、Figure 3）：Pearson r = 0.96（MMMU）、0.92（CMMMU），但 "the three benchmarks are not fully interchangeable. The models show stronger relative performance on MMMU and CMMMU compare to VisTW-MCQ scores."
  10. **judge 退役的校準方案**（§6.4、Table 5）：用 Qwen2.5-VL-72B 線性校準到 gemini-2.0-flash 的分數尺度，與人類的相關從 0.7993 升到 0.8070；校準後與 Gemini 的差距在 −0.42 到 +0.25 之間。原文："Many LLM-as-judge works overlook this scenario".
  11. **CoT 只幫強模型**（§6.5、Table 6）：強模型加 CoT 進步 2–10%（gemini-2.0-flash +0.139），弱模型反而微幅退步。
- 作者自己列的限制：§3.1 寫到 MCQA "does not reflect the real world use of VLM which mostly in free form question answering format"，因此另做 Dialogue。Ethics Statement 承認樣本集中在台北、只有 9 位貢獻者。§6.3 承認比較用的模型子集很小（"due to computational and financial constraints"）。
- 與摘要說法不一致處：
  - 貢獻清單寫 "across 31 different models"，Table 3 只列 30 個；§5 開頭留有未替換的佔位字 "We evaluated X vision-language models"。
  - Table 3 說明寫 "average score from all 23 subjects"，正文與摘要都是 21 科。
  - §4.1 寫 "we found no significant correlation between response length and automated judge scores with a Spearman's ρ = 0.26789, p < 0.001"。p < 0.001 表示相關**顯著**（只是偏弱），文字和數字自相矛盾。
  - 名稱混用 VisTW 與 VisTai。CoT prompt 寫可選 A–G，直接作答 prompt 寫 A–D。
  - Dialogue 只有 131 題，judge 驗證只用了 4 個模型的回答，「high human correlation」的樣本基礎很小。
- 反證或後續修正：Multi-TW（arXiv 2508.01274，2025-08，只讀到摘要與部分正文，未精讀）用華語文能力測驗（TOCFL）題目做繁中圖文＋語音 benchmark，把 VisTW 列為同類比較對象，沒有推翻 VisTW 的結論。沒有找到勘誤。
- 對系列的用途：支撐「繁中 benchmark 正在往多模態與開放式生成延伸」，以及「自拍照片是防污染的一招，但代價是題數小、地域偏向台北」。judge 退役校準也可以給講 LLM-as-judge 的篇章當案例。

---

### Measuring Taiwanese Mandarin Language Understanding（TMLU，2024）——台灣本地評測現況代表
- 網址：https://arxiv.org/abs/2403.20180（v1 PDF，2024-03-29）
- 讀取狀態：✅
- 讀取紀錄：全文約 58,000 字元。依序讀摘要、§1–§6（第 1–828 行，含 Table 1–3、Figure 1–5）；跳過參考文獻後，讀 Limitations and Future Work、附錄 B（污染分析實作）、Table 4（資料來源網址）、Table 5（37 科與選項數）、Figure 6（與 TMMLU+ 的對照例題）、Figure 7（CoT prompt）、Table 6–9 表頭與說明。Table 3 的數字從原始文字流抽出後再對齊模型順序。
- 選擇理由：補搜到的候選有 TMLU、TC-Eval／Taiwan-LLM（2311.17487）、Multi-TW（2508.01274）、SC-TC-Bench（2505.22645）、Breeze2 的 TMMBench（VisTW 說資料尚未公開）。選 TMLU 是因為：台大 MiuLab（Taiwan-LLM 團隊）出品、題目全部是原生繁中、明確設「台灣特有」類別、做了污染對照，並直接檢討 TMMLU+。TAIDE／國科會的評測沒有在補搜中找到 arXiv 層級的一手方法文件，沒有收錄（見補搜紀錄）。
- 類型：研究論文（台大）
- 研究設計或文件目的：台灣華語知識與推理的選擇題 benchmark，37 科、2,981 題（國中、高中、專業三級）。分類為社科 8、STEM 14、人文 9、**台灣特有 3**（駕駛規則、教師資格、台灣觀光資源）、其他 3。dev 每科 5 題並附人工整理的 CoT 解析。評測 24 個模型。
- 會被引用的結果：
  1. **兩岸同詞異義**（§1）："the word '同志' refers to 'people with the same interests and ambitions' in China, while it refers to 'homosexuals' in Taiwan".
  2. **題目來源**（§3.2、Table 4）：五個官方來源，分別是國中會考（CAP）、學測（GSAT）、分科測驗（AST）、考選部國家考試（MOEX）、公路總局駕照筆試題庫（HB）。全部從 PDF／Word 下載後，用 OCR 輔助人工轉成文字，STEM 公式轉成 LaTeX 並由人工編譯驗證，刪掉需要圖表的題目。
  3. **對 TC-Eval 與 TMMLU+ 的批評**（§2）：TC-Eval 有相當比例是從英文資料翻譯來的，例如 XSum 取自 BBC，"likely grounded in western economic and social context"。TMMLU+ 的問題："most questions in TMMLU-plus could be found on one single website"（註腳：yamol.tw，且 "We observed the presence of the website's … content in mC4"）；另外混有簡體題與需要圖表的無解題。
  4. **污染對照**（§5.1、Figure 3）：用 Min-K% Prob 對兩邊各抽 2,000 題、6 個 base 模型做比較。"TMLU achieves higher MIN-K% PROB than TMMLU-plus across all tested models, which implies that TMLU is less likely to contain data that has been seen during pre-trained." 附錄 B 提到為了控制長度，刪掉 TMLU 各科最長的題目。
  5. **分數**（Table 3a，five-shot direct 平均）：Claude-3-Opus 73.59、GPT-4-turbo 70.42、Yi-34B-Chat 68.45、Qwen-14B-Chat 61.81、Gemini-Pro 61.40、Breeze-7B-Instruct 51.31、GPT-3.5 49.37、Taiwan-LLM-13B 42.86、Taiwan-LLM-7B 37.39。「台灣特有」欄：Claude-3-Opus 90.41、GPT-4-turbo 86.90、Yi-34B 83.95、Breeze-7B 73.80、Taiwan-LLM-13B 64.39。原文（§4.2）："the Breeze model – tailored for Taiwanese Mandarin with only 7 billions parameters – outperforms GPT-3.5"，而且 "the exhibited performance of Taiwanese-Mandarin LLMs still lack behind the Simplified-Chinese counterparts".
  6. **CoT**（§5.2）：真正受益的主要是大型閉源模型，GPT-4 +15%、Claude-2 +23%（STEM）。開源模型在 CoT 設定下落後閉源 7–27%。
  7. **出題年份**（§5.3、Figure 5）：多數模型對不同年份的題目沒有一致趨勢；GPT-4-turbo 與 Yi-34B 在較新年份的題目表現較好。作者沒有給出解釋。
  8. **答案擷取方式**（§4.1）：開源模型 direct 設定用 likelihood 法，閉源與 CoT 用生成法。原文引用 Fourrier et al. 2023："different flavors of implementation in extracting predictions from models bring nontrivial impact to the evaluation results".
- 作者自己列的限制（Limitations）：選擇題 "may not fully capture the performance of language models in generation scenarios"。作者另做了生成文字的 perplexity 初步實驗：Taiwan-LLM-7B 16.5、Breeze 8,836、Yi-6B 20,887、Llama-7B 2,038,634，主張 TMLU "should not be considered a sole indicator of their performance in generation tasks"。
- 與摘要說法不一致處：摘要說 "Chinese open-weight models demonstrate inferior performance comparing to multilingual proprietary ones"，但 direct 設定下 Yi-34B（68.45）勝過 Gemini-Pro、Claude-Instant、Claude-2、GPT-3.5，也接近 GPT-4-turbo；「開源較差」主要成立在 CoT 設定。另外，perplexity 實驗用固定 32,000 詞表比較不同 tokenizer 的模型，數值差了 6 個數量級，方法上很難解讀，作者自己只稱為 "preliminary"。Table 1 自評 TMLU 在穩健性、在地化、透明度都是 high，屬於作者自評。
- 反證或後續修正：沒有找到勘誤或反駁。2,981 題、平均每科約 80 題，題數比 TMMLU+ 小一個數量級，單科結論的統計力有限；論文沒有提供信賴區間。這是本批的評估，不是論文的說法。
- 對系列的用途：「台灣本地怎麼建繁中 benchmark」的代表：官方考題 PDF＋台灣特有類別＋污染對照。也可以當「同在地不同 benchmark 互相揭短」的範例（TMLU 對 TMMLU+）。

---

### Global MMLU: Understanding and Addressing Cultural and Linguistic Biases in Multilingual Evaluation（2024／v2 2025-02）——翻譯版 benchmark 的問題
- 網址：https://arxiv.org/abs/2412.03304（讀 v2 PDF，2025-02-19）
- 讀取狀態：✅
- 讀取紀錄：全文約 155,000 字元。依序讀摘要、§1 引言、§2 文化偏誤標註與分析、§3 Global-MMLU 建置、§4 模型評測（含 Table 1–4、Figure 1–12）、§5 相關研究、§6 結論、Limitations（第 1–2,560 行）；跳過參考文獻後，讀附錄 A（42 語言表）、B（科目分類）、C（Lite 建置）、D（時間敏感題）、E（模型）、F（排名表說明）、G（文化與地區、國家的關係）、H（標註者、介面、Krippendorff α）、I（編輯距離）、J（CS／CA 例題）、K（標註指引例子）。附錄 F 的 Table 6／7 只看說明，沒有逐格抄錄。
- 類型：研究論文（Cohere For AI 等）
- 研究設計或文件目的：兩件事。(1) 由人工標註 MMLU 中需要文化、地理、方言知識的題目：每科 50 題、共 2,850 題（MMLU Annotated），每題至少 3 位標註者，多數決。(2) 釋出 42 語言的 Global-MMLU，翻譯來源分三種：OpenAI MMMLU 的專業人工翻譯 10 語言（**中文即屬這類**）、自家專業後編輯 4 語言、社群後編輯 11 語言，其餘 16 語言為 Google Translate 機翻。並在 CS（culturally sensitive）／CA（culturally agnostic）兩個子集上評 14 個模型，看排名變化。
- 會被引用的結果：
  1. **MMLU 有 28% 題目需要文化敏感知識**（§2.2）："Our analysis reveals that 28% of MMLU requires CS knowledge"（792／2,850）。其中地理知識占 CS 的 54.7%、文化知識 32.7%、方言 0.5%。
  2. **西方中心**（§2.2）：CS 題中 "86.5% were tagged as specific to Western cultural knowledge"；地理類 64.5% 是北美、20.4% 是歐洲，合計 84.9%。西方文化題中 73.9% 需要美國知識。東亞文化題只占 3.1%，亞洲文化題裡中國與日本各占 17.9%。
  3. **翻譯不會消除文化偏誤**（§1）："the multilinguality achieved through the translation of English datasets does not guarantee multiculturality." 還有 "as … developers optimize models for performance on transMMLU datasets, we risk overfitting to the datasets' cultural biases".
  4. **翻譯品質**（§3）：Lai et al. 2023 的 26 語言 MMLU 是用 GPT-3.5 翻譯。作者比較後發現 Google Translate 的 ChrF++ 在所有科目都較高。人工後編輯共改了 7,565 題，**占審閱樣本的 36.9%**；專業標註者平均每語言改 38.5%、社群改 17.7%。作者提醒這個差異 "cannot be interpreted as differences in translation quality across languages"。附錄 I：人文類的編輯距離最大。
  5. **排名會因子集而變**（§4、摘要）：CA 子集平均 3.4 次排名變動、3.7 個名次位移；CS 子集為 5.7 次、7.3 個位移。原文："Chinese and Hindi emerge as the most sensitive languages to culture-specific knowledge, with models showing both increases and decreases in rankings."
  6. **人工翻譯 vs 機翻**（§4.3、Figure 12）：高資源語言（法文）模型在人工翻譯版較好；低資源語言（約魯巴語）時，Claude Sonnet、GPT-4o 在**機翻版反而較好**。作者推測是因為這些模型的訓練資料也多為機翻，"the distribution of the machine-translated test set aligns more closely with their training data". 也就是說，機翻測試集會偏袒用機翻資料訓練的模型。
  7. **CS 子集平均分較高但變異較大**（§4.1）：因為 CS 題多為社科與人文，模型本來就較擅長。但在平衡過的 Lite 版，CS 的平均反而較低、變異較大。
  8. **建議**（§1）："Report performance on culturally-sensitive and culturally-agnostic subsets separately."
- 作者自己列的限制：社群貢獻分布極不均（長尾，部分語言由一兩位主力貢獻）；只涵蓋 42 語言，沒有處理方言；標註介面沒有毒性標記；地區分類太粗，建議改用世界銀行分類。另外 "Identifying cultural sensitivity does not guarantee cultural inclusion"，也就是標出偏誤不等於補上非西方內容。
- 與摘要說法不一致處：
  - 貢獻清單寫 "we found that 28% of questions require specific knowledge of Western cultures"，但 §2.2 的定義是 28% 為 CS（任一文化、地理、方言）。西方題只占 CS 的 86.5%，換算約占全體 24%。貢獻清單的措辭誇大了。
  - 摘要說 CS 會扭曲排名，但 §4.1 顯示全量評測時 CS 的平均分反而較高；方向因子集組成而異，摘要沒有說明。
- 反證或後續修正：沒有找到推翻的研究。對台灣讀者的提醒（本批評估）：Global-MMLU 的中文版來自 OpenAI MMMLU，應是簡體中文、面向中國大陸用語，所以文中的 Chinese 結論不能直接套到繁中。標註的「East Asian culture」也沒有區分台灣。
- 對系列的用途：支撐「翻譯版 benchmark 有兩層問題」一段。第一層是原題的文化偏誤（28% CS、84.9% 北美加歐洲），翻譯會原封不動帶過去；第二層是翻譯品質（後編輯改了 36.9%），而且機翻版可能偏袒用機翻資料訓練的模型。

---

## 補搜加讀（2 篇）

### Characterizing Bias: Benchmarking Large Language Models in Simplified versus Traditional Chinese（SC-TC-Bench，2025，FAccT '25）
- 網址：https://arxiv.org/abs/2505.22645
- 讀取狀態：✅（正文全讀；附錄部分只讀正文引用到的說明，各表格逐格數字沒有抄錄）
- 讀取紀錄：全文約 158,000 字元（含 32 頁附錄）。正文約 57,000 字元（摘要到 Limitations／Calls to Action），依序讀完。附錄 A–C 多為表格與 prompt 變體，正文引用到的結論已經在正文交代。
- 類型：研究論文
- 研究設計或文件目的：不是知識題，而是直接測「同一個問題用簡體問或繁體問，模型行為差多少」。兩個任務：(1) 區域用語：給定義，請模型用一個詞回答。共 110 個兩岸不同說法的詞，例如鳳梨／菠萝、滑鼠／鼠标；以「依提問字體使用對應地區用語」為正確。(2) 區域人名：從 10 個大陸名＋10 個台灣名中挑一位員工錄用。共評測 11 個模型，含 GPT-4o、DeepSeek-R1、Qwen-1.5、Breeze、Taiwan-LLM。
- 會被引用的結果：
  1. （§3.1、Figure 2）"Most LLMs … are significantly more likely to generate correct responses when prompted in Simplified Chinese compared to Traditional Chinese (p < .05). The only exception is Breeze". 而且 "All LLMs are significantly more likely to generate misaligned responses when prompted in Traditional Chinese"，例如用繁體問鳳梨卻回答「菠蘿」。
  2. （§3.2.1）110 個詞中，以繁體提問時平均有 37.5 個（SD 15.2）被回成大陸用語；以簡體提問時只有 4.4 個（SD 2.3）。被錯配的詞多屬旅遊類，例如觀光局→旅游局。
  3. （§3.1）OpenAI 模型從 GPT-3.5 到 GPT-4o，繁體正確率持平、簡體正確率上升："suggesting a growing bias favoring Simplified Chinese within OpenAI's models."
  4. （§3.2.2）用 9 個公開語料當訓練資料的代理：即使是繁中語料，被錯配詞的繁體寫法出現頻率也偏低，作者把原因指向資料不平衡。
  5. （§4.6.2）同一個名字，繁體寫法多數模型會切出較多 token。Breeze、Taiwan-LLM、ChatGLM-2 是例外。這和 TMMLU+ 的 fertility 發現方向一致。
- 作者自己列的限制：只涵蓋兩岸，不含港澳；資料不平衡、字元偏好、tokenization 三個因素交纏，無法分離。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：未見。
- 對系列的用途：直接回答台灣讀者最在意的問題：模型「會說中文」不代表「會說台灣話」。即使是 GPT-4o，用繁體提問時也較常回大陸用語，而且一般知識類 benchmark 量不到這件事。

### An Open-Source Data Contamination Report for Large Language Models（2024，EMNLP Findings）
- 網址：https://aclanthology.org/2024.findings-emnlp.30.pdf （arXiv 2310.17589）
- 讀取狀態：✅
- 讀取紀錄：全文約 52,000 字元，依序讀完正文、Table 1–4、§7 討論、Conclusion、Limitation；參考文獻略過。
- 類型：研究論文
- 研究設計或文件目的：用 Bing 搜尋（2017 到模型 cutoff）找出近乎逐字出現在網上、且被 Common Crawl 收錄的測試題（METEOR recall > 0.75），再比較模型在「乾淨」與「污染」子集的分數。涵蓋 MMLU、C-Eval 等 6 個 benchmark。
- 會被引用的結果：
  1. （Table 1）C-Eval（驗證集 1,346 題）有 **45.8%** 被判定污染，其中 40.6% 連答案一起出現；MMLU test 為 29.1%。原文："Academic test-based benchmarks like MMLU and C-Eval, despite being collected through methods like OCR, exhibit the highest levels of contamination".
  2. （Table 3）C-Eval 乾淨子集 vs 題目答案都外流子集：Yi-6B .6718 vs .8117（+14 分）、Qwen-7B .5619 vs .6289、Baichuan2-7B .5508 vs .5887；英文模型 Llama-2-7B 與 Mistral-7B 沒有明顯差異。原文："the multilingual large language models all demonstrate significant performance advantages on dirty subsets."
  3. （§7.1）隱藏 test 的副作用："C-Eval make their test sets nonpublic … this also makes popular third party model evaluation platforms turn to using their validation sets instead of the test sets".
  4. （§5、Figure 2）2017–2020 到 2020–2023 之間，學術考題型 benchmark 的污染比例最多增加 21%。
- 作者自己列的限制：搜尋 API 有成本，長文本查不了，不在網上的訓練資料（例如使用者資料）也偵測不到。
- 與摘要說法不一致處：摘要寫污染程度 "ranging from 1% to 45%"，結論寫 "1% to 47%"，Table 1 最高為 45.8%。
- 對系列的用途：「防污染設計會過期」的直接證據，而且對象正是中文 benchmark，可以接在 C-Eval 段落之後。

---

## 補搜紀錄

| 查詢（工具） | 找到 | 收／不收與理由 |
|---|---|---|
| jina `search_arxiv`：Traditional Chinese Taiwan benchmark／TMLU／Taiwan LLM evaluation 2025／MMLU translation cultural bias | 失敗：Jina key out of quota | 改用 Exa |
| Exa：Taiwan／Traditional Chinese LLM benchmark 2024–2025 | TMLU（2403.20180）、Multi-TW（2508.01274）、SC-TC-Bench（2505.22645）、Breeze2（2501.13921）、Taiwan-LLM／TC-Eval（2311.17487） | TMLU 收為指定的「台灣本地評測」代表；SC-TC-Bench 收為補讀 1（2025 新研究，直接量繁簡行為差異）；Multi-TW 只讀摘要，因為和 VisTW 同類，題目取自華語文能力測驗、測的是語言能力而非在地知識；Breeze2 的 TMMBench 據 VisTW 所述尚未公開，不收 |
| Exa：C-Eval／CMMLU contamination／leakage／criticism | Li et al. 2024 contamination report、Benchmarking Benchmark Leakage（2404.18824）、Ni et al. AAAI 2025（2409.01790）、CLEAN-EVAL、C²LEVA | Li et al. 收為補讀 2（直接量化 C-Eval 污染與分數膨脹）；另外兩篇洩漏偵測只讀到摘要或 repo 層級，未精讀，正文不引用具體數字 |
| 2024 以後更新檢查 | C-Eval 的反證：Li et al. 2024；TMMLU+ 的反證：TMLU 2024 | 已併入各來源的「反證」欄 |
| TAIDE／國科會／中研院評測 | 補搜沒有找到 arXiv 或正式論文層級的一手方法文件 | 不收。若文章要提 TAIDE，需另外找國科會或 TAIDE 官方文件（未完成，建議下一輪補） |

尚未補的缺口：TAIDE 官方評測文件；Ni et al. 2024 對 CMMLU 的洩漏數字（只讀到摘要層級）。
