# 抽取紀錄：Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning

read_status=full（主文全文含方法、結果、討論、腳註；補充材料 Supplementary material 沒有讀到，見讀取紀錄）

## 書目與實際讀的版本

- 作者：Shiri Melumad（The Wharton School, University of Pennsylvania；通訊作者）、Jin Ho Yun（New Mexico State University；Wharton Neuroscience Initiative）
- 刊物：PNAS Nexus, 4(10), pgaf316，2025 年 10 月號
- DOI：https://doi.org/10.1093/pnasnexus/pgaf316
- 日期：Accepted 2025-09-11；Published 2025-10-28（OUP 頁面）。Crossref 類資料（exa 結果）顯示 2025-09-30，以 OUP 的 28 October 2025 為準。
- PMID 41163786；PMCID PMC12560091；授權 CC BY-NC
- 預印本：SSRN https://ssrn.com/abstract=5104064（doi 10.2139/ssrn.5104064）
- 實際讀的版本：PMC 開放取用全文，經 NCBI BioC API 取得 JSON（https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC12560091/unicode），轉成純文字。另以 efetch 取得 JATS XML 備份（未逐行讀）。OUP 的 PDF 下載被擋（回 HTML）。
- 資金：Wharton Dean's Office、Wharton Behavioral Lab。IRB：University of Pennsylvania Protocol #854440。資料、問卷、預註冊在 OSF。

## 設計／性質

- 七個隨機分派實驗（主文 4 個＋補充材料 3 個），線上（Prolific、MTurk Connect）與實驗室。受試者被分派用 LLM 摘要或傳統 Google 網頁連結學一個主題，然後寫建議給朋友。
- 依變項：
  - 學習努力代理指標：搜尋任務花費時間（秒）
  - 自評學習深度（1–5 Likert）：學到新東西、結果是否完整（comprehensive）、對所學知識的擁有感
  - 寫建議的投入：自評思考努力、對建議的擁有感、寫建議花的時間
  - 建議內容（NLP）：字數（LIWC 2022）、事實指涉（spaCy NER，七類＋園藝自訂詞）、組內主題相似度（LDA＋PCA 後的成對 cosine similarity，越高越同質）、組內 Levenshtein 編輯距離（越高越獨特）
  - 實驗 4：接收者對建議的評分與選擇
- 主文各實驗：
  - 實驗 1（預註冊，https://aspredicted.org/D1G_BRC）：Prolific 1,136 人招募，排除 32 人，最終 1,104 人。真實 Google（Custom Search JSON API，每頁 10 個連結）vs 真實 ChatGPT（腳註 c：OpenAI Chat Completion API、GPT-3.5-turbo）。主題：怎麼種菜園。樣本量依 G*Power：90% 檢定力偵測 d = 0.10。
  - 實驗 2（預註冊，https://aspredicted.org/3rxx-vktc.pdf）：Prolific 2,016 人，排除 37 人，最終 1,979 人。模擬搜尋、資訊固定：先請 GPT-4o 寫出 291 字、7 條建議的摘要作為 ChatGPT 組結果；再請 GPT-4o 改寫成 6 篇不同媒體風格（Better Homes and Gardens、Martha Stewart、NYT 等）的文章作為 Google 組的 6 個連結，事實內容相同。只能輸入一個查詢。樣本量：95% 檢定力偵測 d = 0.15。
  - 實驗 3（實驗室）：東岸某大學行為實驗室 253 人，排除 3 人，最終 250 人（Mage 22.75，73% 女性）。同一個 Google：有裝 AI Overview 擴充並只看 AI Overview vs 沒裝、瀏覽連結。主題：怎麼過更健康的生活。樣本量是場地與受試者池能做到的上限。
  - 實驗 4（預註冊，https://aspredicted.org/6py8-ggdn.pdf）：MTurk Connect 1,501 人，排除 8 人，最終 1,493 人。每人讀兩篇實驗 3 寫出的建議（各從 125 篇 Google 組、125 篇 AI Overview 組隨機抽一篇），不知來源，逐篇評分後再並排比較。樣本量：80% 檢定力偵測 d = 0.15。
- 補充材料（主文只摘述）：
  - 實驗 1 的複製一（n = 2,402）：主題換成受試者自認高度相關的「健康生活」，並加第三組「LLM 摘要＋即時網頁連結」。
  - 複製二（n = 1,976）：主題換成「遭遇金融詐騙該怎麼辦」。
  - 實驗 4 的概念複製（n = 1,258）。

## 可引用結果（主文 Results 各節；數字照抄，M 是組平均）

### 實驗 1（ChatGPT vs Google，真實搜尋）
- 搜尋時間：Google 742.81 秒 vs GPT 585.41 秒；F(1, 1,102) = 44.61, P < 0.001。
- 查詢次數相近：ChatGPT 2.06 次、Google 2.15 次；F(1, 870) = 0.71, P = 0.401。原文："implying that the lower amount of time participants spent during the ChatGPT (vs. Google) search task was not driven by lower interactivity with ChatGPT compared with Google, but rather by less engagement with the search results."
- 學到新東西：3.86 vs 3.43，F = 36.04, P < 0.001；知識擁有感：3.55 vs 3.36，F = 6.82, P = 0.009；資訊完整：4.27 vs 4.02，F = 20.84, P < 0.001。
- 寫建議的思考努力：4.13 vs 4.00，F = 4.94, P = 0.026；建議擁有感：3.69 vs 3.56，F = 3.78, P = 0.052（原文用 "slightly lower"）；寫作時間：246.81 vs 221.40 秒，F = 4.91, P = 0.027。
- 建議內容：字數 94.64 vs 84.58，F = 7.42, P = 0.007；事實指涉（unique entities）0.718 vs 0.464，F = 6.66, P = 0.010；cosine 相似度 0.057 vs 0.159，F = 168.46, P < 0.001；Levenshtein 531.86 vs 481.59，F = 13.67, P < 0.001。
- SEM（SAS Proc Calis）：CFI 0.903、SRMR 0.079，支持「搜尋努力 → 知識深度 → 建議投入與內容」路徑。
- 補充材料的複製一：加了即時網頁連結的 LLM 組，只有 26% 的人點了連結。原文："which is perhaps unsurprising given that only 26% of those participants chose to click on those links."

### 實驗 2（資訊內容固定，只差呈現格式）
- 打查詢時間：Google 49.42 vs GPT 59.45 秒（GPT 組較久），F(1, 1,977) = 16.35, P < 0.001；看結果時間：124.32 vs 83.65 秒，F = 58.75, P < 0.001。
- 學到新東西：3.96 vs 3.71，F = 20.70；知識擁有感：3.66 vs 3.41，F = 22.66；資訊完整度兩組相近：4.25 vs 4.30，F = 1.25, P = 0.264。
- 思考努力：4.11 vs 3.85，F = 33.74；建議擁有感 3.75 vs 3.64，F = 5.12, P = 0.024；寫作時間 208.84 vs 185.19 秒，F = 8.81, P = 0.003。
- 字數 74.22 vs 64.49，F = 22.78；事實指涉 4.61 vs 4.00，F = 29.05；cosine 0.072 vs 0.224，F = 330.76；Levenshtein 423.98 vs 346.58，F = 105.66（皆 P < 0.001）。
- 討論原文："merely presenting that same information as an LLM summary rather than a series of web links led participants not only to exert less effort in learning but also to report developing shallower knowledge on the topic."
- 作者補做控制「造訪網站數」的事後分析（補充材料），效果仍在。

### 實驗 3（同一個 Google，AI Overview vs 連結，實驗室）
- 搜尋時間 67.37 vs 55.50 秒，F(1, 248) = 7.32, P = 0.007。
- 資訊完整：4.18 vs 3.32，F = 46.29, P < 0.001；學到新東西 2.68 vs 2.41，F = 2.98, P = 0.086（邊緣）；知識擁有感 3.18 vs 3.00，F = 1.66, P = 0.199（無差異）。
- 思考努力 3.60 vs 3.20，F = 9.12, P = 0.003；建議擁有感 3.47 vs 3.06，F = 8.95, P = 0.003；寫作時間 159.08 vs 134.99 秒，F = 5.55, P = 0.019。
- 字數 90.17 vs 65.17，F = 20.14, P < 0.001；事實指涉 0.624 vs 0.376，F = 2.80, P = 0.096（邊緣）；cosine 0.073 vs 0.214，F = 52.50；Levenshtein 502.52 vs 368.64，F = 56.78（P < 0.001）。
- 腳註 g：樣本太小，SEM 無法估計，所以實驗 3 沒做中介模型。

### 實驗 4（接收者盲評）
- 接收者覺得主題切身：personal relevance 指標平均 4.00（SD 0.801，α = 0.806）；77% 對「會從中受益」給 4 或 5 分。
- 重複量數 ANOVA，皆 F(1, 1,492)、P < 0.001（standard-Google vs LLM-Google）：helpful 3.816 vs 3.553（F = 85.013）；informative 3.575 vs 3.224（F = 103.863）；感覺朋友花的努力 3.421 vs 3.024（F = 94.471）；trust 4.171 vs 3.906（F = 126.078）；會推薦 3.821 vs 3.481（F = 117.375）；會採用 3.897 vs 3.711（F = 48.481）。
- 並排選擇：χ²(2) = 201.156, P < 0.001（比例數字的標示疑似寫反，見不一致處 #3）。

### 作者整體結論句
- 摘要："Results from seven online and laboratory experiments (n = 10,462) lend support for these predictions, and confirm, for example, that participants reported developing shallower knowledge from LLM summaries even when the results were augmented by real-time web links."
- 討論比喻："one might view learning through LLMs rather than traditional web search as, at times, analogous to being shown the solution to a math problem rather than trying to solve it oneself."
- 結尾："Hence, one may be better off not letting ChatGPT, Google, or another LLM "do the Googling.""

## 限制（作者自述，General discussion 的 Implications, limitations 節）

- 任務限定："the results arose in the context of a specific experimental task: that of learning about a topic with the intention to share advice on it with others." 只是查單一事實（如歷史日期）時，"there would presumably be no obvious advantage to using traditional web search (vs. LLMs)"。
- 知識類型："while LLMs might in general be a more efficient way to acquire declarative knowledge ... our findings suggest that they may not be the best tool for developing deep procedural knowledge about a topic".
- 領域：主題都是不需深厚先備知識的（菜園、健康生活）；"The effects might not generalize, however, to learning in highly specialized domains—such as advanced science or math topics".
- 測量：學習深度的證據是自評、建議文字特徵、接收者觀感；"there may well be other metrics of learning—such as performance on standardized tests—where LLMs offer advantages over web search".
- 未測 deep research 類工具（Perplexity、Gemini、ChatGPT deep research）；作者推測外包研究 "may amplify, rather than attenuate, the differences observed here, at least in certain contexts"（推測，未驗證）。

我自己的判讀（非作者原話）：
- 沒有報告標準化效果量（Cohen's d 等），只有平均數與 F 值；很多自評差異在 5 點量表上只差 0.1–0.4 分。大 F 值主要來自大樣本（df 1,102、1,977、1,492）。
- 沒有客觀知識測驗（例如事後測驗正確率），「學得淺」主要是自評加文字特徵推論。
- 「建議較短」的效果在實驗室實驗 3 最大（90 vs 65 字），但同一實驗的事實指涉差異只是邊緣顯著（P = 0.096）。
- 實驗 1 的 LLM 是 GPT-3.5-turbo；限制段說 "participants in most of our experiments interacted with actual LLMs (e.g. GPT-4o)"，但主文實驗中 GPT-4o 只用於實驗 2 製作固定刺激，受試者沒有直接與它互動（見不一致處 #2）。

## 與摘要或常見轉述不一致處

1. 總樣本數兩種寫法：摘要 n = 10,462；Introduction 寫 "seven online and laboratory experiments (n = 10,426)"。把七個實驗的最終樣本相加：1,104 + 1,979 + 250 + 1,493 + 2,402 + 1,976 + 1,258 = 10,462，與摘要一致；10,426 應是正文筆誤（數字對調）。引用用 10,462。
2. 使用的模型：限制段寫 "actual LLMs (e.g. GPT-4o)"，但實驗 1 腳註 c 明寫 GPT-3.5-turbo；實驗 2 是 GPT-4o 預先生成的固定文字；實驗 3 是 Google AI Overview。轉述成「用 GPT-4o 做實驗」不準確。
3. 實驗 4 並排選擇的比例：原文 "with the observed proportion of LLM-based advice [50.6%, n = 756; 95% CI = (0.481, 0.532)] being significantly lower than that of advice based on web links [24.6%, n = 367; 95% CI = (0.226, 0.271)]"。句意是 LLM 組比例較低，但給的 50.6% 大於 24.6%，數字和標籤對不上；比較可能是 50.6% 選了 web 連結組的建議、24.6% 選了 LLM 組，剩下約 24.8%（約 370 人）選「差不多」（756 + 367 = 1,123，1,493 − 1,123 = 370）。這是我的推算，引用時不要直接寫「50.6% 偏好 LLM 建議」；只引方向與 χ² 值，或寫「原文比例標示有誤」。
4. 實驗 1 性別比例：招募樣本寫 "46% female, 53% male, 1% nonbinary"，排除 32 人後的最終樣本寫 "53% female"；排除 32 人不可能讓女性比例從 46% 變成 53%，兩處至少一處有誤。
5. 常見轉述「用 ChatGPT 學的人學得比較少」：論文沒有測知識量或正確率，量的是自評學習感、花的時間、寫出的建議特徵與他人觀感；而且實驗 2 中兩組「資訊完整度」自評沒有差異（4.25 vs 4.30），實驗 3 中「知識擁有感」也沒有差異。不是每個指標每次都顯著。
6. 常見轉述「加上連結就沒問題」相反：補充材料顯示 LLM＋即時連結組效果仍在，但這可能是因為只有 26% 的人點了連結；論文沒有分析「有點連結的人」是否就沒有差異（至少主文沒寫）。
7. 實驗 2 的 Google 組並非真實網頁，是 GPT-4o 依同一摘要改寫、掛上媒體名義的模擬文章；轉述成「真實網頁 vs ChatGPT」不準確。

## 讀取紀錄

- 全文：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/melumad-yun-2025-llm-vs-search.txt（840 行，65,078 bytes；每段前綴 [section|type] 標記來自 BioC）
- 原始檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/dl/mel/pmc.xml（BioC JSON，94,620 bytes）、efetch.xml（JATS，115,606 bytes，未逐行讀）
- 依序讀過：1–840（一次讀完；722–840 為參考文獻標題清單，BioC 未帶作者名）
- 沒讀到：Supplementary material（三個複製實驗的完整數字、問卷、SEM 細節、造訪網站數控制分析）。主文只給樣本數與方向；要引用補充實驗的數字需另取 OUP 補充檔或 OSF。
- 讀取日期：2026-10-22
