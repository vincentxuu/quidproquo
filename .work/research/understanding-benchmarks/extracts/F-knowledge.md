# F-knowledge：知識與推理類 benchmark 抽取紀錄

批次主題：知識題怎麼從 MMLU 演化到 HLE（出題方式、飽和、標註錯誤各自怎麼影響分數）。
讀取日期：2026-11-23。全文抓取方式：五篇論文都以 `curl -sL https://arxiv.org/pdf/<id>` 下載 PDF，`pdftotext` 轉純文字（壓縮空白後）分段讀，表格數字再用 `pdftotext -layout` 對版面核對；HLE 的 Figure 3 是圖片，另用 `pdftoppm` 轉圖讀取。網站類來源用 Exa `web_fetch_exa`，lastexam.ai 的新聞區與 HLE-Diamond 部落格是 JS 渲染，Exa 抓不到新聞列，改用 curl 抓 HTML 再去標籤讀。jina 在本 session 額度用盡（`Insufficient balance`），未使用。

---

### Measuring Massive Multitask Language Understanding（MMLU，2020／ICLR 2021）
- 網址：https://arxiv.org/abs/2009.03300 （讀 PDF v3，2021-01-12）
- 讀取狀態：✅
- 讀取紀錄：PDF 27 頁，轉文字約 83,800 字元；依序讀 0–28,000（摘要、§1–§4.2 結果、校準）、28,000–56,000（§5 討論、§6、參考文獻、附錄 A 分析、B.1 任務表、B.2 污染分析、57 科表）、56,000–83,800（附錄 Figure 14–70 每科例題）。
- 類型：研究論文
- 研究設計或文件目的：量「預訓練學到的知識能不能在 zero-shot／few-shot 下用出來」。57 科四選一選擇題，涵蓋 STEM、人文、社會科學、Other，難度從 Elementary 到 Professional。題目由研究生與大學生從網路免費來源人工蒐集（GRE、USMLE 練習題、大學課程題、Oxford University Press 書的讀者題等）。評估 GPT-3 四種尺寸（few-shot）、UnifiedQA（遷移，不再微調）、微調過的 RoBERTa／ALBERT／GPT-2。
- 會被引用的結果：
  - 題數 15,908，切成 few-shot dev（每科 5 題）、val 1,540、test 14,079；每科 test 至少 100 題（§3）。原文："We collected 15908 questions in total, which we split into a few-shot development set, a validation set, and a test set."
  - 人類基準：MTurk 非專家 34.5%；專家水準「估計」約 89.8%，是拿各考試第 95 百分位考生的正確率，查不到時「educated guess」（§3）。原文："If we take the 95th percentile human test-taker accuracy for exams that build up our test, and if we make an educated guess when such information is unavailable, we then estimate that expert-level accuracy is approximately 89.8%."
  - 模型分數（Table 1，加權平均）：隨機 25.0；GPT-3 Small／Medium／Large few-shot 25.9／24.9／26.0；GPT-3 X-Large（175B）few-shot 43.9；UnifiedQA（11B）48.9；GPT-2 32.4。GPT-3 X-Large zero-shot 約 37.7（§4.2 與 Figure 10）。原文："the X-Large 175 billion parameter GPT-3 model performs substantially better than random, with an accuracy of 43.9%."
  - 科目落差：GPT-3 最好 US Foreign Policy 69%、最差 College Chemistry 26%；最低 10 科中 9 科是重計算的 STEM（§4.2）。
  - 評分方式：prompt 開頭 "The following are multiple choice questions (with answers) about [subject]."，few-shot 最多 5 題範例，結尾 "Answer: "，比較 A/B/C/D 四個 token 的機率取最高者（§4.1）。這是「看下一個 token 機率」的打分方式，不是讓模型自由作答。
  - 校準：zero-shot 下信心與正確率差距最多 24%；Elementary Mathematics 的 RMS 校準誤差 19.4%；few-shot 差距最多 14%，信心與正確率相關 r=0.81（zero-shot r=0.63）（§4.2、Figure 8、Figure 11）。
  - 污染：用題目 log 機率當記憶指標，與正確率相關 r=−0.43（zero-shot）、−0.56（few-shot），作者據此推論「題目原文沒被背下來」，但承認模型讀過 Wikipedia 上相關內容（附錄 B.2）。原文："This suggests that our exact questions were not memorized."
- 作者自己列的限制：只做純文字、不含多模態（§5）；模型在法律、道德與計算題接近隨機；只靠擴大模型未必能解（資料瓶頸）；並承諾公布題目來源清單以降低未來模型看到原題的機率（B.2）。
- 與摘要說法不一致處：
  - 摘要說 "the very largest GPT-3 model improves over random chance by almost 20 percentage points"，Table 1 是 43.9−25.0＝18.9，一致。
  - 摘要與 §3 把 89.8% 寫成專家水準，但正文明說這是用第 95 百分位考生加上「educated guess」估出來的，不是實測的人類專家分數；後續文獻常把 89.8% 當成實測專家基準引用，引用時要附這個條件。
  - 論文自己的附錄例題就有缺陷：Figure 25（Computer Security）選項 B 被截斷成 "Anti-virus scanners tend to look for viruses and other malicious"；Figure 66（Security Studies）選項 A 與題幹完全重複；Figure 69 標成 Virology 的例題其實是流行病學相對風險計算題。這些正是 MMLU-Redux 後來分類的「選項解析錯誤」「科目歸類錯」類問題，在原論文附錄就看得到。
- 反證或後續修正：MMLU-Redux（arXiv 2406.04127）估計全體 6.49% 題目有錯、Virology 57%（見下）；MMLU-Pro 專家審查在 MMLU 來源題發現 350 題答案錯、385 題壞題（見下）；HLE 論文稱前沿模型在 MMLU 已超過 90%（HLE §1）。
- 對系列的用途：支撐「知識題的起點」：題目從網路公開練習題由學生蒐集、四選一、看 token 機率打分；專家基準 89.8% 是估計值。這些設計後來分別造成飽和、prompt 敏感與標註錯誤。

---

### MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark（2024，NeurIPS 2024 D&B）
- 網址：https://arxiv.org/abs/2406.01574 （讀 PDF v6，2024-11-06）
- 讀取狀態：✅
- 讀取紀錄：PDF 24 頁，轉文字約 85,800 字元；依序讀 0–28,000（摘要、§1–§6.2）、28,000–56,000（§6.3 穩健度、§7 限制、參考文獻、附錄 A.1 Table 4–6、A.2 prompt）、56,000–84,000（A.3–A.6 錯誤分析案例）、84,000–85,800（Table 13 結尾）。Table 1 另用 `-layout` 核對版面。
- 類型：研究論文
- 研究設計或文件目的：解決 MMLU 飽和（GPT-4 2023-03 達 86.4% 後，前沿模型都停在 86–87%）與 prompt 敏感度。做法：從 MMLU 刪掉太簡單與有雜訊的題，加入 STEM Website、TheoremQA、SciBench 的較難推理題；選項從 4 個擴充到 10 個；兩輪專家審查。57 科併成 14 科，共 12,032 題。
- 會被引用的結果：
  - 刪題規則：用 8 個小模型（Llama-2-7B／13B 及 Chat 版、Mistral-7B、Gemma-7B、Yi-6B 及 Chat 版）作答，超過 4 個模型答對的題視為 "too easy" 刪除，共刪 5,886 題（§3.2）。Table 4：MMLU 原 13,937 題刪 5,886（42.23%）剩 8,051；Business 60.18%、History 56.56%、Other 55.60%、Psychology 54.50% 刪最多，Math 只刪 16.18%。原文："questions answered correctly by more than four models are considered as 'too easy' and subsequently excluded from consideration."
  - 最終組成（Table 5）：12,032 題中 MMLU 6,810（56.60%）、STEM Website 4,083（33.93%）、TheoremQA 598（4.97%）、SciBench 541（4.50%）。Law、Health、Philosophy、History、Other 100% 來自 MMLU；Engineering 93.08% 來自 STEM Website。
  - 為什麼改 10 選項：MMLU 只有 3 個干擾選項，模型可能走捷徑、高估能力並造成不穩定；10 選項把猜中機率降到 10%（§1）。新增的 6 個干擾選項由 GPT-4-Turbo 生成（§3.2），作者稱 "we found that GPT-4-Turbo does not gain additional advantage from such an augmentation procedure"，但正文沒有給這個實驗的數字。
  - 專家審查發現的問題（Table 1，以 `-layout` 核對）：MMLU 來源 Incorrect Answer 350、False Negative Options 1,953、Bad Question 385；STEM Website 483／293／862；TheoremQA 0／5／1；SciBench 11／15／15。「False negative」指被錯標成干擾項的正確選項，第二輪先由 Gemini-1.5-Pro 挑出再交人審。最終 83% 題目有 10 個選項、17% 較少，平均 9.47 個（§3.2）。
  - prompt 敏感度：24 種 prompt 下，MMLU 的分數變動一般 4–5%、最高 10.98%；MMLU-Pro 一般約 2%、最高 3.74%（§6.3、Figure 5）。原文："On the MMLU benchmark, the influence of these prompts generally ranges between 4-5%, with peaks up to 10.98%. In contrast, on the MMLU-Pro benchmark, the impact of prompt changes is generally around 2%, with a maximum of 3.74%."
  - 分數下降與鑑別度：GPT-4o 72.6%（MMLU 88.7）、GPT-4-Turbo 63.7%（MMLU 86.5）；GPT-4o 與 GPT-4-Turbo 在 MMLU 差 1%（摘要／§1；§6.1 寫約 2%），在 MMLU-Pro 差 9%（Table 2、§6.1）。
  - CoT 效果反轉（Table 3）：GPT-4o 在 MMLU CoT−直接作答＝+1.5，MMLU-Pro +19.1；GPT-4-Turbo −0.2 vs +15.3；Llama-3-8B −3.9 vs +3.9；Gemma-7B −3.6 vs +6.7。
  - 評分方式：5-shot CoT，用 regex `answer is \(?\([A-J]\)?\)` 抽答案，失敗再用第二條 regex，兩條都失敗就「隨機選一個選項」（§4）。原文："If both of them fail to retrieve a valid response, ... a random option from the answer choices is selected."
  - GPT-4o 120 題錯誤分析：推理錯 39%、缺專門知識 35%、計算錯 12%、未作答 5%、讀錯題 4%、生成問題 2%、標註錯 2%、答案抽取失敗 1%（§5.3）。
- 作者自己列的限制：仍受選擇題格式限制，測不到開放式作答與創作；只測語言模型，不含多模態（§7）。
- 與摘要說法不一致處：
  - 摘要寫 "the gap between GPT-4o and GPT-4-Turbo is 1% on MMLU"（§1），§6.1 寫 "from about 2% on MMLU to around 9% on MMLU-Pro"，前後不一（Table 3 的 CoT 數字 88.7 vs 86.5 是差 2.2）。
  - 摘要「drop by 16% to 33%」沒有列出對應的模型清單，Figure 4 的數字可算出 GPT-4o 88.7→72.6（−16.1），但 33% 端點對應哪個模型，正文沒有明講。
  - 摘要說 prompt 敏感度「從 4-5% 降到 2%」，正文同時給最大值 10.98%→3.74%，摘要只給典型值。
  - Table 12（Generation Issue 案例）標示 "Question ID: 4138, Category: Chemistry"，但題目是小鼠遺傳學，且 ID 與 Table 11 重複，是論文內的標註錯誤。
  - 答案抽取失敗時「隨機選一個」：這會讓格式不合的模型拿到 10% 的期望分數，摘要沒提。
- 反證或後續修正：
  - MMLU-Redux 指出 "errors from the original MMLU persist in the extended MMLU-Pro benchmark"（2406.04127 §5 Related Work），但沒有給 MMLU-Pro 的錯誤率數字。
  - Raman, Lundy, Leyton-Brown（arXiv 2507.15337）比較 MMLU 與 MMLU-Pro 的「只看選項」可利用度：非推理模型在 MMLU-Pro 仍有 5–10% 的超隨機訊號；推理模型利用 MMLU-Pro 選項的程度高於非推理模型利用 MMLU 的程度；結論是 "Relying solely on more challenging distractors as an antidote to exploitation is insufficient"。只讀到 Exa 搜尋結果裡的摘要與結論段，未精讀全文（見補搜紀錄）。
  - 有部落格轉述 MMLU-Pro 正確選項前常多一個空格、最長選項常是正解等提示線索（questionwell.org，二手來源，原始發現者在 X 上的貼文未讀到；未查證，見補搜紀錄）。
- 對系列的用途：支撐「飽和之後的第一種修法是把題目變難、選項變多」，以及「刪題標準本身是模型」（小模型答對就刪），讓分數下降有一部分是篩選造成的。

---

### Are We Done with MMLU?（MMLU-Redux，2024／NAACL 2025）
- 網址：https://arxiv.org/abs/2406.04127 （讀 PDF v3，2025-01-10）；資料集 https://huggingface.co/datasets/edinburgh-dawg/mmlu-redux-2.0
- 讀取狀態：✅
- 讀取紀錄：PDF 28 頁，轉文字約 96,300 字元；依序讀 0–28,000（摘要、§1–§3.3、Figure 1–6、Table 1–3）、28,000–56,000（§4 自動偵錯、§5 相關研究、§6 結論、限制、參考文獻、附錄 A–B）、56,000–84,000（附錄 C–H，Table 5 全 57 科錯誤統計、Table 6–8）、84,000–96,300（附錄 I 各科質性觀察、J 微調實驗）。
- 類型：研究論文
- 研究設計或文件目的：系統量化 MMLU 的標註錯誤。設計階層式錯誤分類（Figure 2）：1a 題目不清、1b 選項不清、2a 沒有正確答案、2b 多個正確答案、2c 標準答案錯。14 位人類專家（論文作者群）在 57 科各隨機抽 100 題、共 5,700 題重新標註，盡量找原始出處比對；再用重新標註結果評估錯誤對排名的影響，並測 LLM 能否自動抓錯。
- 會被引用的結果：
  - 全體錯誤率：以分層抽樣推估 MMLU 有 6.49% 題目有錯（Table 5 Total：OK 93.51%、題目不清 2.47%、選項不清 0.44%、無正解 0.62%、多正解 1.54%、標準答案錯 1.42%）。原文："Using stratified sampling, we estimate that 6.49% of the questions in the complete MMLU dataset contain errors."
  - 最糟科目（Table 5，各 100 題）：Virology 只有 43 題 OK（題目不清 14、選項不清 2、無正解 4、多正解 4、標準答案錯 33）；Logical Fallacies 74；College Chemistry 75（標準答案錯 21）；Professional Law 82（多正解 11）；Human Sexuality 83；Business Ethics 86；Formal Logic 87；Human Aging 88；Global Facts 88。完全乾淨的有 High School CS、Prehistory、HS Gov & Politics、HS US History、Medical Genetics 等。
  - Virology 錯誤來源：多數是簡單題的標籤錯（例如「什麼叫 pandemic」），推測來自解析 Human Virology 教科書學生資源時出錯（§2.2、附錄 I）。Figure 1 例：「預防伊波拉的最佳方法」MMLU 標成「派美歐軍隊進西非」。
  - 錯誤成因：選項 E 是正解但被刪成四選一（College Chemistry、College Math）；跨行題目被解析成選項 A 並丟掉 D；Logical Fallacies 遺失原題指示句；Business Ethics 只保留清單最後一句；Professional Law／Accounting 預設美國法域但沒寫（附錄 I）。
  - 對排名的影響（Table 2，HELM v1.3.0 預測）：Virology 中 Llama 3.1 405B 全部題目排第 16（0.57），只算正確題目變第 1（0.93）；Human Sexuality 中 GPT-4（0613）全部題目 0.91 排第 5，只算正確題目 0.43 排最後；Gemini 1.5 Pro（001）同科 0.37（第 55）→0.94。原文："in the Virology subset, Llama 3.1 Instruct Turbo (405B) ranked 16th when considering all Virology instances, but ranked first when only correct instances were used."
  - 記憶的跡象：Professional Law 與 Formal Logic 的錯誤題上，模型照原（錯）答案作答的表現與正確題相近甚至更高，作者認為 "this may be evidence of memorisation"（§3.1、Figure 5）。
  - 標註者一致性：5 個錯誤最多的科目 Cohen's κ（二元有錯／沒錯）0.64–1.0，全錯誤類型 0.64–0.96（Table 1）。
  - 自動偵錯很難：最好的組合 Claude 3 Opus + RAG（Wikipedia）F2 41.92、Recall 82.61；Few-shot CoT 最好 F2 40.29；微調 Llama-3-8B F2 44.75（Table 3、4、9）。
- 作者自己列的限制：只標了 5,700 題，剩下 8,342 題沒標；分類法仍可能受標註者個人偏誤影響（Limitations）。標註者建議的正確答案「目前沒有拿來取代 MMLU 標籤」（§3）。
- 與摘要說法不一致處：
  - Virology 錯誤組成三處說法不同：§3.1 正文寫 "30% examples have a wrong ground truth, and 15% are unclear questions"；Figure 3 圖說寫 "wrong ground truth (33%), multiple correct answers (4%), or unclear questions (14%)"；Table 5 是標準答案錯 33、題目不清 14、選項不清 2、無正解 4、多正解 4。以 Table 5 為準。
  - §3.1 寫 "we find that more than 9% of the examples are incorrect"，摘要與結論寫 6.49%。兩者口徑不同：9% 是 5,700 題樣本的未加權比例（錯誤多的科目題數少、被等權抽 100 題而放大），6.49% 是依各科原始題數分層加權的推估。引用時用 6.49%，並註明是推估。
  - 結論寫 Logical Fallacies "26%"，§3.1 寫 "more than 20%"，Table 5 是 74 題 OK（即 26%），一致只是精度不同。
  - 研究的 MMLU 原始總題數寫 14,042（Table 5，取自 cais/mmlu），MMLU 原論文 test set 是 14,079。
- 反證或後續修正：本文 v3 已把範圍從 v1 的 30 科（3,000 題）擴到 57 科 5,700 題（附錄 B 仍殘留 "thirty MMLU subsets" 的舊描述）。2024 年後補搜沒找到推翻 6.49% 估計的研究。
- 對系列的用途：支撐「標註錯誤會改寫排名，不只是降低天花板」，以及「錯誤集中在少數科目、成因多是爬蟲與解析，不是題目難」。

---

### GPQA: A Graduate-Level Google-Proof Q&A Benchmark（2023）
- 網址：https://arxiv.org/abs/2311.12022 （讀 PDF v1，2023-11-20）
- 讀取狀態：✅
- 讀取紀錄：PDF 28 頁，轉文字約 104,100 字元；依序讀 0–28,000（摘要、§1、§2 收集流程、Table 1–3）、28,000–56,000（§3 分析、Table 4、Figure 2、§4 baselines、§5 相關研究、§6 限制、§7 結論）、56,000–84,000（參考文獻、Figure 3、附錄 A.1–A.3：資料收集備註、校準、answer-only 實驗、Table 6–7、prompt）、84,000–104,100（open-book prompt、A.4 獎金、A.5 四階段標註指示）。
- 類型：研究論文
- 研究設計或文件目的：做 scalable oversight 實驗用的資料集：題目要「領域專家答得出、其他領域的高學歷非專家上網查也答不出」。透過 Upwork 雇 61 位博士或博士生，四階段：專家出題（附解釋）→ 第一位同領域專家作答並回饋 → 出題者修題 → 第二位同領域專家作答 → 三位其他領域非專家上網作答。生物、物理、化學三個領域。
- 會被引用的結果：
  - 規模與子集（Table 2、§2.3）：共收 564 題，留 18 題作未公開 held-out，Extended 546 題；main set 448 題（≥1/2 專家同意且 ≤2/3 非專家答對）；Diamond 198 題（2/2 專家同意且 ≤1/3 非專家答對）。
  - Diamond 的定義：兩位專家都答對、多數非專家答錯；若第二位專家答錯，但在回饋中清楚說明自己的錯或表現出理解出題者解釋（Table 4 類別 1、2），且第一位專家必須答對，也可納入（§2.3）。原文："GPQA Diamond ... includes only questions where both experts answer correctly and the majority of non-experts answer incorrectly."
  - 專家與非專家準確率（Extended 546 題）：第二位專家 64.8%±4.0、第一位專家 66.5%±4.0；非專家 34.1%±2.3。main set 71.9／30.4、Diamond 81.3／22.1，但作者標註這兩組 "skewed by selection effects"（Table 2、§3.1、§3.2）。
  - 「客觀性」74%：把專家答錯但事後明確承認自己犯錯的情況排除後，估計 73.6%；再加上「表現出理解解釋」的，76.4%（§3.1）。原文："Using a relatively conservative level of permissiveness, we estimate the proportion of questions that have uncontroversially correct answers at 74% on GPQA Extended."
  - 第二位專家 191 次答錯的歸因（Table 4）：題目好、專家明確說出自己的錯 25.1%；題目好、理解解釋 7.9%；題目好、沒描述錯誤 12.6%（合計 45.6%）；不確定 24.1%；題目壞 28.3%（答案可爭議 7.9%、缺前提 8.4%、答案錯 12.0%）。
  - "Google-proof" 怎麼量：非專家最少要花 15 分鐘、平均 37 分鐘（中位數 30 分鐘），可自由上網但禁用 LLM；90% 的非專家作答超過 15 分鐘，前 20% 超過 45 分鐘；作答正確可得 $30 獎金（§2.1、§3.2、A.5.4）。出題指示要求出題者自己「假裝非專家去搜尋看看」（A.5.1 "Search resistance"）。換言之，「Google-proof」是以高學歷非專家的實測正確率來定義，不是檢查答案是否在網路上找得到。
  - 獎金結構：出題者每位專家答對 +$20、每位非專家答錯 +$15、兩專家都對且至少 2/3 非專家錯再 +$30；估計平均時薪約 $95（§2.1、A.4）。
  - 模型基準（Table 5、6）：Few-shot CoT GPT-4 在 Extended／main／Diamond 為 38.7／39.7／38.8；GPT-4 with search 39.4／41.0／38.8（因搜尋版在 main set 放棄作答 37.2%，改用 few-shot CoT 答案補位）；Llama-2-70B-chat 與 GPT-3.5 約 28–31%。
  - 統計功效：main set 只有 448 題，"requiring large effect sizes (e.g., 50%→60% accuracy) in order to detect differences with over 80% power"（§6）。
  - 無淺層線索：只看選項訓練 T5 與 CBOW 分類器，都無法超過 25% 機會水準（A.2）。
- 作者自己列的限制：題數太少、統計功效低；非專家是高技能者，數字不能直接搬到一般情境；Upwork 來源造成的偏誤，不代表科學實務題目的母群；離「監督超人類系統」仍是不完美代理（§6）。
- 與摘要說法不一致處：
  - 摘要說 "a challenging dataset of 448 multiple-choice questions"，又說專家 65%、非專家 34%；但 65%／34% 是 Extended 546 題上的數字（Table 2：64.8／34.1），448 題 main set 上是 71.9／30.4。摘要把兩個集合的數字放在同一句。
  - 摘要說 "74% when discounting clear mistakes"，正文給的是 73.6%（較保守）與 76.4%（較寬）兩個值。
  - 摘要說 GPT-4 最強 baseline 39%，Table 5 的 GPT-4 with search 在 main set 是 41.0%，Extended 是 39.4%。
  - 附錄 A.3.1 的 open-book prompt 示範題：(A) Muhammad Ali、(B) Alan Turing，推理寫 "Muhammad Ali lived longer"，最後卻寫 "Final answer: (B) Muhammad Ali"，示範本身的選項代號錯了。
- 反證或後續修正：
  - 第一作者 David Rein 2024-05 部落格（見補搜）：Diamond 的真實客觀題比例「介於 74% 到 100%」，並說明 Table 1 量子力學例題確實有錯（Kraus 算子寫法與 A0 係數），但專家仍能答出「正確」選項。
  - Epoch AI 2025-05（見補搜）：前沿模型分數集中在約 83%，Epoch 檢查 6 題最常錯的題，估計約 2.25 題無效，外推全體約 8%（15/198）無效，並認為「at least 90% of the benchmark is valid」。
- 對系列的用途：支撐「第二代知識題改由專家原創、用『非專家上網答不出』來定義難度」，以及「專家同意率本身就是分數天花板的估計」。

---

### Humanity's Last Exam（HLE，2025；Nature 649, 1139–1146，2026）
- 網址：https://arxiv.org/abs/2501.14249 （讀 PDF v12，2026-10-19）；https://lastexam.ai ；https://lastexam.ai/blog/hle-diamond ；https://github.com/centerforaisafety/hle/blob/main/hle-rolling-changes.txt ；https://labs.scale.com/leaderboard/humanitys_last_exam ；Nature 版 https://www.nature.com/articles/s41586-025-09962-4
- 讀取狀態：✅（arXiv 全文、lastexam.ai 首頁與 HLE-Diamond 公告、Scale 排行榜頁、HLE-Rolling 變更檔全文）；Nature 版以 Exa 取全文後對照關鍵句（約 80,000 字元，未逐段讀，因內容與 arXiv v12 相同，只核對差異）
- 讀取紀錄：arXiv PDF 29 頁，轉文字約 109,200 字元；依序讀 0–28,000（作者名單、摘要、§1、§2、§3.1）、28,000–56,000（Figure 2、§3.1 題型、§3.2 審查、§4 評估、Table 1、§5、參考文獻、附錄 A 開頭）、56,000–84,000（附錄 A 作者與機構名單，按結構掃過）、84,000–109,200（機構名單、B.1–B.4、C.1–C.7）。Figure 3（領域分布）以 `pdftoppm` 轉第 7 頁圖讀取。HLE-Rolling 變更檔 286 行全部統計。
- 類型：研究論文＋官方網站／排行榜
- 研究設計或文件目的：在 MMLU 等飽和後，做「最後一份封閉式學術考題」。全球近 1,000 位專家（500+ 機構、50 國）出題，先過前沿模型篩選、再兩輪人工審查；公開 2,500 題並保留私有 held-out 集檢查過擬合。
- 會被引用的結果：
  - 出題流程（先用模型篩題）：每題投稿前要先丟給前沿模型（多模態題：GPT-4o、Gemini 1.5 Pro、Claude 3.5 Sonnet、o1；純文字題再加 o1-mini、o1-preview）。精確比對題必須所有模型都答錯；選擇題最多只能有一個模型答對（B.1）。共記錄 70,000+ 次嘗試，約 13,000 題通過模型篩選進入人工審查（§3.2）。原文："If the LLMs cannot solve the question (or in the case of multiple choices, if the models on average do worse than random guessing), the question proceeds to the next stage: human expert review."
  - 人工審查：第一輪每題 1–3 位研究所學歷審查者，以 rubric 打分並回饋修改；第二輪由組織者與挑選過的審查者核准（§3.2、C.7）。關鍵條件：審查者不需要驗證解答全部正確，如果超過 5 分鐘（C.7.1）。原文："Please check if the answer makes sense as a possible response to the question, but if you do not have knowledge/context, or if it would take more than 5 minutes to solve, that is okay." 以及 B.2："reviewers were not expected to verify the full accuracy of each provided solution rationale if it would take more than five minutes."
  - 誘因：$500,000 獎金池，前 50 題各 $5,000、接下來 500 題各 $500，加上共同作者資格（§3.1）。
  - 題數與分布：2,500 題、100+ 科；約 14% 需看圖、24% 選擇題（5 個以上選項），其餘精確比對（§3.1）。Figure 3：Math 41%、Biology/Medicine 11%、CS/AI 10%、Physics 9%、Humanities/Social Science 9%、Other 9%、Chemistry 7%、Engineering 4%。
  - 評分：用 o3-mini（2025-01-31）當 judge，以結構化輸出抽出最終答案並判斷是否與標準答案相符，數值題允許小誤差（§4.1、C.1.1）。是 LLM judge。投稿階段的自動篩選則用 GPT-4o judge（B.1）。
  - Calibration error：要求模型同時給答案與 0–100% 信心，用 Hendrycks et al. 的 RMS 校準誤差（§4.2）。Table 1（上線前模型）：GPT-4o 準確率 2.7%／校準誤差 89%；Claude 3.5 Sonnet 4.1／84；o1 8.0／83；DeepSeek-R1（純文字）8.5／73；o3-mini（high，純文字）13.4／80。原文："Models also provide incorrect answers with high confidence rather than acknowledging uncertainty on these challenging questions, with RMS calibration errors above 70% across all models."
  - 非零分的來源：作者承認因為題目是用模型篩過的，低分「partially by design」；非零分來自推論隨機性，"small inflections close to zero accuracy are not strongly indicative of progress"（§4.2）。
  - 專家不同意率（B.3）：上線前兩輪各抽 200 題審計，最終公開集估計專家不同意率 15.4%；針對生物、化學、健康子集（回應 FutureHouse）另做審查，不同意率約 18%；若改成「只要一位專家反對就算有問題」，同一子集升到 25%。原文："This iterative process yielded a final estimated expert disagreement rate of 15.4% for the public set."
  - 上線後修訂（B.2、Scale 排行榜頁 2025-04-03 更新）：bug bounty 至 2025-03-21 結束，移除所有被正確回報的錯誤；用 GPT-4o mini／GPT-4o search 與 Perplexity Sonar 找「有搜尋才答得對」的題，人工確認後移除可搜尋題；以備用題補回；最終定為 2,500 題（原本公開 2,700 題，舊版稱 "HLE-preview"）。作者稱移除後模型分數與之前相近。
  - HLE-Rolling：lastexam.ai 新聞 2025-10-08 發布，可持續修訂的分支，並把部分簡單題換成 held-out 集的較難題（Scale 頁 2026-09-17 更新）。GitHub 變更檔逐行統計：2026-02-20 re-add 166、remove 27、update 8；2026-07-27 add 79、remove 6。
  - HLE-Diamond：lastexam.ai 2026-09-22 發布，1,000 題（500 推理題＋500 知識題），定位是「從原版 HLE 雜訊天花板遷移的路徑」。官方公告的無工具成績最高 74.3%；有工具（web+code）最高 82.9%。
  - 原版 HLE 的分數軌跡：論文 §5 預測 "models could exceed 50% accuracy on HLE by the end of 2025"；lastexam.ai 表（資料集 2025-04-03 版、o3-mini judge）最高為 Gemini 3 Pro 38.3%；Scale 排行榜目前公開數字中最高為 46.50±2.00（其餘頂端條目頁面未顯示數字）。
- 作者自己列的限制：高分只代表封閉式、可驗證學術題上的專家水準，不代表自主研究能力或 AGI（§5）；接近零分的小幅變化不代表進步（§4.2）；審查者不一定驗證完整解答（B.2）；專家不同意率 15.4%／18%（B.3），並稱前沿研究題本來就難以做成唯一答案。
- 與摘要說法不一致處：
  - 摘要說每題 "has a known solution that is unambiguous and easily verifiable"，但附錄 B.3 自估專家不同意率 15.4%（生化健康子集約 18%），審查指示又允許審查者不驗證超過 5 分鐘的解答。「unambiguous」是設計目標，不是量出來的性質。
  - 摘要與 §1 寫 "RMS calibration errors above 70% across all models"；Nature 版改成 "with most models exhibiting ... above 70%"；lastexam.ai 新表裡 GPT-5 是 50.0%、Gemini 3 Pro 57.2%，已不再全部超過 70%。原句只對上線前那批模型成立。
  - 正文 §4.1 寫 judge 是 o3-mini，附錄 B.1 寫投稿篩選用 GPT-4o judge：兩階段用了不同 judge，論文沒有比較兩者判定差異；Scale 頁也提醒 "small differences could arise from different judge models and prompts"。
  - 摘要說 "cannot be quickly answered via internet retrieval"，但上線後才補做可搜尋題清理（B.2），代表初版有可搜尋題混入。
  - GitHub README 範例輸出仍是 "n = 2700"（舊 preview 版），與 2,500 題定版不同。
  - HF `cais/hle-rolling` README 的 `num_examples` 寫 1000，與 HLE-Rolling 是 2,500 題原版的分支此一敘述不符（可能是該 README 已被 Diamond 版內容覆寫，未查證）。
- 反證或後續修正：
  - FutureHouse（Skarlinski, Laurent, Bou, White，2025-07-23，見下一節）估計純文字化學／生物題約 29±3.7% 的答案與同儕審查文獻直接衝突；HLE 團隊以三位專家審查得到 18%（一位反對即算則 25%），並寫進論文 B.3、Nature 版，且引用 FutureHouse 為 ref [47]。
  - HLE-Rolling、HLE-Diamond 是官方的修正路線（見上）。
- 對系列的用途：支撐「第三代知識題用模型篩題，造成刻意低分與『gotcha』題」、「LLM judge 進入評分環節」、「標註錯誤到了研究前沿題更難估」三個主張，以及「官方自己承認雜訊天花板、推出 Diamond 版」。

---

### About 30% of Humanity's Last Exam Chemistry/Biology Answers are Likely Wrong（FutureHouse，2025）
- 網址：https://www.futurehouse.org/research-announcements/hle-exam
- 讀取狀態：✅
- 讀取紀錄：Exa 取全文約 9,000 字元，一次讀完（含 2025-09-16 更新段與原文）。
- 類型：研究機構部落格（附資料集與專家評估資料）
- 研究設計或文件目的：稽核 HLE 純文字生物／健康與化學子集（321 題）的答案是否被文獻支持。先用自家 PaperQA2 代理 Crow 找支持或反駁證據，再請獨立化學與生物專家審 150 題 Crow 的判斷（Likert 量表），最後外推。
- 會被引用的結果：
  - Crow 判定 53.3%（171 題）的解答理由與已發表證據直接衝突（化學 57.0%、生物／健康 51.6%）。
  - 專家與 Crow 判定不一致：在「contradicted」題中只有 13.7%，在「correct」題中 5.2%。
  - 外推全子集：29.3±3.7%（95% CI）與研究直接衝突、51.3±4.1% 有研究支持、19.3±3.2% 取決於假設或觀點。原文："we expect 29.3 ± 3.7% (95% CI) of the questions to be directly conflicted by research, 51.3%± 4.1% to be supported by research, and 19.3%± 3.2% to be nuanced"
  - 成因推論：「必須讓前沿模型答錯」的收錄條件，加上審查者只需花 5 分鐘、不必驗證正確性，導致「gotcha」型對抗題。例：「2002 年地球上最稀有的惰性氣體」答 Oganesson（但它可能不是氣體、也可能不算惰性、文獻不把它算進地球物質）。
  - 產出 HLE-Gold-Bio/Chem 子集（Crow 判為有研究支持的題目 ID）。
  - 2025-09-16 更新：HLE 團隊以三位專家審查得約 18% 有問題，至少一位不同意則 25%。
- 作者自己列的限制：只涵蓋專家能力範圍內的生化子集；判斷依賴自家工具 Crow；「nuanced」類取決於假設。文中也說 "The frontier of science isn't actually objective and univocal."
- 與摘要說法不一致處：標題寫「About 30% of HLE Answers are Wrong」（網頁 title），內文標題與數字只適用「chemistry/biology 純文字子集」，不是整份 HLE。引用時必須加子集限定。
- 反證或後續修正：HLE 官方三專家審查得 18%（B.3），比 29% 低，但單一審查者規則下 25%，與 FutureHouse 接近；兩者差距主要來自「幾位專家同意才算錯」的判準不同。
- 對系列的用途：支撐「同一批題目的錯誤率會因審查判準（一人反對 vs 多人共識）從 18% 跳到 25–29%」，說明標註錯誤率本身也是一個需要定義的量。

---

## 補搜（2024 年後＋criticism／limitations）

### GPQA Diamond: What's left?（Epoch AI，Greg Burnham，2025）
- 網址：https://epoch.ai/gradient-updates/gpqa-diamond-whats-left
- 讀取狀態：✅
- 讀取紀錄：Exa 取全文約 11,000 字元，一次讀完（含註腳 1–6）。
- 類型：研究機構部落格
- 研究設計或文件目的：前沿模型 GPQA Diamond 分數集中在約 83%，檢查剩下 17% 是題目壞了還是單純很難。取 Epoch Benchmarking Hub 中 14 個 ≥70% 的模型，找它們集體答錯的題，再人工深讀其中 6 題。
- 會被引用的結果：
  - 模型錯得很集中：在 158 題（80%）上多數模型答對，錯誤集中在其餘 40 題（20%）。
  - 這 40 題中有機化學占 70%，全體只占 36%。
  - 6 題深讀合計約 2.25 題無效；外推到 40 題，約 15/198＝8% 無效。作者結論 "I think it's likely that at least 90% of the benchmark is valid"。
  - 一題恆星光譜題，作者判斷有 90% 機率是題目本身錯（題幹第二句已決定答案為 3.98，模型 100% 選 (C)）。
  - 比較：FrontierMath 第二輪審查估計錯誤率約 7%。
- 作者自己列的限制：樣本只有 6 題，外推 "It's a stretch"；有機化學題作者自己判斷不了，要等外部化學家審查。
- 與摘要說法不一致處：開頭說「至少 90% 有效」，深讀外推是 92%（8% 無效），一致；但支撐只有 6 題，結論強度高於證據。
- 反證或後續修正：有第三方部落格指出 Epoch 量到的最佳分數已到 95–96%，高於 92% 的「有效上限」，表示要嘛 8% 估太高，要嘛模型連有缺陷的題也照答案鍵答對了（二手來源，未精讀，僅記錄線索）。
- 對系列的用途：支撐「模型集體錯在同一批題目，是找壞題的線索但不是證據」，以及「天花板估計會被後來的分數打臉」。

### Can Good Benchmarks Contain Mistakes?（NYU ARG，David Rein，2024）
- 網址：https://wp.nyu.edu/arg/can-good-benchmarks-contain-mistakes/
- 讀取狀態：✅
- 讀取紀錄：Exa 取全文約 10,500 字元，一次讀完。
- 類型：研究者部落格（GPQA 第一作者）
- 研究設計或文件目的：回應社群指出 GPQA 某題有錯，說明「有錯的 benchmark 還能不能用」。
- 會被引用的結果：
  - 作者預期 Extended 集最多約三分之一題目有錯（專家正確率 65%），扣掉專家自承犯錯後專家一致 74%；Diamond 的真實客觀題比例 "likely lies somewhere between 74% and 100%"。
  - 把專家一致率當天花板：超過 74% 之後的進步，越來越可能是 "the model is getting better at predicting the mistakes question writers are making"。
  - 被點名的量子力學題（論文 Table 1）確實有兩處錯（把 Kraus 算子說成「state 的」、A0 係數應為 sqrt(3/4−3p/4)），但專家仍能靠線性與完備性選到「正確」選項，說明有錯的題目仍可能被一致地答對。
  - 成本：GPQA 製作約 $120k（不含作者薪資），平均每題約 2 小時專家時間。
- 作者自己列的限制：Diamond 偽陽性（專家因錯誤理由選對）機率低是直覺，沒有量化。
- 與摘要說法不一致處：文中說「25% of the time they answered differently ... explicitly said or described how they made a mistake」，對應論文 Table 4 類別 1（25.1%）；但又說這讓專家一致率到 74%，論文的 74% 是以 73.6% 四捨五入。一致。
- 反證或後續修正：Epoch 2025 估 Diamond 約 8% 無效，落在作者說的 74–100% 區間內、偏高端。
- 對系列的用途：支撐「標註錯誤主要是吃掉分數上端的量測範圍，而不是讓整份 benchmark 失效」這個較平衡的說法。

### 補搜紀錄
- 查詢（Exa）：
  1. "HLE-Rolling Humanity's Last Exam rolling version update announcement" → 找到 Scale 排行榜（2026-09-17、2025-04-03 更新說明）、HF `cais/hle-rolling` README、arXiv v12 B.3、benchmarkalmanac 頁（列出 Diamond 2026-09），再追到 lastexam.ai 新聞區與 HLE-Diamond 部落格、GitHub 變更檔（一手）。收：一手官方頁已寫進 HLE 條目。benchmarkalmanac 的變更數字（166／27／8、79／6）與我逐行統計的一手變更檔相符，但只引一手檔。
  2. "analysis of errors or invalid questions in GPQA Diamond ..., noise ceiling" → Epoch AI 2025 部落格、David Rein 2024 部落格、若干 2026 年第三方部落格（agentik、host0、prompt20、themodelgap、dev.to）。收前兩篇（一手、作者或評測機構）；第三方部落格只記錄「最佳分數已超過 Epoch 的 92% 上限」此一線索，未精讀不收。
  3. "paper on MMLU-Pro flaws or limitations: answer choice shortcuts ..." → Raman et al. 2025（arXiv 2507.15337，推理模型利用選項資訊；MMLU-Pro 換更難干擾項不能根治）、MMLU-Pro+（arXiv 2409.02257）、Balepur et al.（arXiv 2502.14127，選擇題評估的缺陷綜述）、Yang & Wang 2026（arXiv 2602.11898，MMLU-Pro／GPQA 上模型間不一致率 16–38%）、Turkish MMLU Pro（arXiv 2609.15467，10 選項擴充造成多正解）、questionwell.org 部落格（MMLU-Pro 正解前多空格、最長選項常為正解）。未收入精讀（本批上限 2 篇已用在 GPQA 錯誤率，與系列主線「標註錯誤」最直接）；Raman et al. 只讀到 Exa 回傳的摘要與結論段，列在 MMLU-Pro 條目的反證欄並註明未讀全文。questionwell 的空格線索是二手轉述，嘗試用 GitHub API 搜 TIGER-Lab/MMLU-Pro issues 確認，查詢回 "Validation Failed"，未能查到一手出處，標為未查證。建議下一輪若要寫 MMLU-Pro 的捷徑問題，精讀 arXiv 2507.15337 與 2409.02257。
  4. jina `search_web` 三個查詢（HLE-Rolling、HLE-Diamond/Verified、HLE criticism）全部失敗：`This key is out of quota`。改由 Exa 與 curl 完成。
- 2024 年後是否推翻指定來源結論：
  - MMLU：被 MMLU-Redux（6.49% 錯）與 HLE（>90% 飽和）更新，原論文的「模型接近隨機」已過時，但題目設計描述仍成立。
  - GPQA：沒有被推翻；Epoch 2025 給出 Diamond 約 8% 無效的估計，比原論文 74% 客觀性（Extended）樂觀，兩者口徑不同（Diamond vs Extended）。
  - HLE：「unambiguous」主張被 FutureHouse 29% 與官方自估 15.4%／18% 修正；官方以 HLE-Rolling、HLE-Diamond 回應；§5「2025 年底可能超過 50%」的預測，以 lastexam.ai 表（最高 38.3%）與 Scale 頁可見數字（最高 46.50）看，原版 HLE 在可查到的數字裡未見超過 50%，但 Scale 頁頂端幾個條目沒有顯示數字，無法斷言。
