# Lee et al. 2025 — The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers

read_status=read（論文全文 PDF，含附錄 A.1 問卷題目與 Table 5 codebook；不是 Microsoft Research 部落格摘要）

## 書目（實際讀的版本）

- 作者：Hao-Ping (Hank) Lee（Carnegie Mellon University）、Advait Sarkar、Lev Tankelevitch、Ian Drosos、Sean Rintel、Richard Banks、Nicholas Wilson（Microsoft Research Cambridge）。
- 出處：CHI '25, April 26–May 01, 2025, Yokohama, Japan。PDF 首頁 ACM Reference 寫 23 pages；ACM DL 頁面寫 Article No. 1121, Pages 1–22。https://doi.org/10.1145/3706598.3713778。CC BY 4.0。
- 讀的檔：第二作者個人網站鏡像 https://advait.org/files/lee_2025_ai_critical_thinking_survey.pdf（PDF CreationDate 2025-01-28；acmart 2024/12/07 v2.11 排版，即 CHI camera-ready 版）。

## 研究設計

- 方法：線上問卷（Prolific），**全部是自評**。不是實驗、沒有對照組、沒有任務表現量測。
- 樣本：收 333 份，剔除 14 份低品質，得 319 人。條件：自報每週至少一次在工作上用 GenAI。男 159、女 153、非二元 5、未答 2；18–24 歲 26.96%、25–34 歲 44.83%、35–44 歲 19.44%、45–54 歲 6.58%、55+ 2.19%。工具：ChatGPT 96.87%。職業前五：Computer and Mathematical 18.50%、Arts/Design/Media 13.79%、Office/Admin 11.91%、Business/Financial 10.97%、Education/Library 7.21%。居住國前五：英國 11.60%、加拿大 7.84%、美國 6.27%、南非 5.64%、波蘭 5.33%。平均作答 43.19 分鐘（SD 23.13），酬勞 £10。
- 每人分享 3 個真實工作用 GenAI 的例子（Creation／Information／Advice 各一，順序隨機，沒經驗可替換類型）。共 957 例，剔除 22 例，留 936 例（Creation 374、Information 303、Advice 259）。
- 量了什麼（皆自評，§3.1）：
  - 「是否做了批判思考」：每例一題 Yes/No（附錄 Q6：「Have you ever done any reflective/critical thinking … when doing this task with GenAI tool?」）＋自由作答理由。作者強調量的是「perceived enaction」（批判思考的外顯行為），不是批判思考本身。
  - 「批判思考的費力程度」：Bloom 六層（Knowledge、Comprehension、Application、Analysis、Synthesis、Evaluation），每層一題 5 點量表「much less effort」到「much more effort」（編碼 −2 到 +2），比較「用 GenAI vs 不用」。
  - 任務層級信心（1–5）：confidence in self（不用 AI 自己做）、confidence in GenAI（AI 做得到）、confidence in evaluation（評估 AI 輸出）。
  - 使用者層級：Kember 等的 Reflective Thinking Inventory（反思傾向，4 題）、改編 Propensity to Trust Technology（對 GenAI 整體信任，6 題）、性別、年齡、職業（O*NET，再依 Ghosh 等分類自動化風險）。
  - 調查開頭先給「批判思考在 GenAI 使用中的例子」做 cognitive priming。
- 分析：一個隨機截距 logistic 迴歸（是否批判思考）＋六個隨機截距線性迴歸（六層費力程度），受試者 ID 為隨機截距；98 個假設預測項用 Benjamini–Hochberg 校正（校正後門檻 0.007，表中報校正後 p）。質性：開放編碼，先 50 份建 codebook，再兩人編剩下 269 份，negotiated agreement。

## 可引用結果

1. **約 60% 的例子自報有做批判思考**（§4.2）：555/936。Table 4 的 DV 分布寫 551 true／379 false（N=930）。
2. **對 AI 的任務信心越高 → 越少自報批判思考**（§4.2.1, Table 4）：β=−0.69, p<0.001（logistic）。**自我信心**越高 → 越多：β=0.26, p=0.026；**評估信心**越高 → 越多：β=0.31, p=0.046。反思傾向：β=0.52, p<0.001。
3. **整體信任 GenAI 與「是否批判思考」無顯著關係**（§4.2.2, Table 4）：β=−0.01, p=0.967。作者解釋：任務層級的信心已吸收了變異。
4. **多數例子自報批判思考變省力**（§5.1, Fig. 2）：選「less」或「much less effort」的比例 Knowledge 72%、Comprehension 79%、Application 69%、Analysis 72%、Synthesis 76%、Evaluation 55%。Evaluation 的「more／much more」最多（84＋36／764）。
5. **對 AI 的信心與費力度負相關**（§5.1.1）：Knowledge β=−0.11（p=0.029）、Comprehension β=−0.13（p=0.014）、Analysis β=−0.15（p=0.003）、Synthesis β=−0.12（p=0.026）、Evaluation β=−0.23（p<0.001）；Application 不顯著。自我信心與費力度正相關：Application β=0.08（p=0.029）、Evaluation β=0.10（p=0.027）。
6. **整體信任 GenAI 與費力度負相關**（§5.1.2）：Knowledge β=−0.12（p=0.029）、Application β=−0.17（p=0.002）、Analysis β=−0.12（p=0.046）、Evaluation β=−0.24（p<0.001）。反思傾向與費力度無關。
7. 綜合句（§5.1.1，粗體原文）：「1) a higher confidence in GenAI is associated with less critical thinking even though it is perceived as less effort to do so, and 2) a higher self-confidence is associated with more critical thinking even though it is perceived as more effort to do so.」
8. **三種轉移**（§5.2, §6.2）：Knowledge & Comprehension「from information gathering to information verification」；Application「from problem-solving to AI response integration」；Analysis, Synthesis, Evaluation「from task execution to task stewardship」。
9. 抑制因素（§4.3.2）：覺察（任務次要 14/319、任務瑣碎 55/319、信任依賴 GenAI 83/319）、動機（沒時間 44/319、不是職責 11/319）、能力（無法檢查 AI 回應 58/319、不知如何改進 72/319）。例：會議紀錄摘要被當成瑣碎任務而不檢查（P271）。
10. 促進因素（§4.3.1）：work quality 74/319、potential negative outcomes 116/319、skill development 13/319。
11. 作者對低風險任務的警告（§4.3.2）：「While critical thinking may not be necessary for low-stakes tasks, it is risky for users to only apply critical thinking in high-stakes situations. Without regular practice in common and/or low-stakes scenarios, cognitive abilities can deteriorate over time」（引 Bainbridge「Ironies of Automation」）。
12. 因果聲明（§6.1.1）：「Our analysis does not establish causation.」

## 作者列的限制（§6.3）

1. 參與者會把「用 GenAI 省力」和「批判思考省力」混為一談：「participants occasionally conflated reduced effort in using GenAI with reduced effort in critical thinking with GenAI … potentially leading to inaccurate self-reporting」；建議改用 think-aloud 或任務評量。
2. 自我信心是主觀量測，可能與客觀專業不一致。
3. 只有英語、需流利英語者。
4. 樣本偏年輕、偏技術熟練、每週用 GenAI 的人。
5. GenAI 工具持續變；任務分類（Brachman 等）粗；建議做縱貫研究。
- §5 開頭作者另列「省力」的四種解釋：同量批判思考但被支援、把批判思考外包給 AI、整體做得比較少、把一般認知省力誤當批判思考省力——資料無法區分。

## 與摘要或常見轉述不一致處

1. 常見轉述「使用 AI 會降低批判思考能力」：本研究**沒有量能力或表現**，量的是自報「有沒有做」與「覺得費不費力」。標題自己就寫「Self-Reported」。
2. 常見轉述「越信任 AI，越少批判思考」：與「是否做批判思考」顯著相關的是**任務層級的 confidence in GenAI**（β=−0.69）；**整體 trust in GenAI** 對是否批判思考不顯著（β=−0.01, p=0.967），只和「費力度」相關。轉述常把兩個變項混成「信任」。
3. 「AI 讓批判思考變省力」不等於「AI 讓人想得少」：作者自己說資料無法區分四種解釋，並承認參與者可能把一般省力誤報成批判思考省力。
4. 常見轉述說「GenAI 削弱獨立解決問題能力」：這是作者在討論中的推測與擔憂（「can potentially lead to」「raising concerns」），不是測得的結果。
5. 例數小矛盾：正文 §3.3.1、§4.2 寫 555/936 有批判思考；Table 4 DV 分布寫 551/379（N=930）。頁數：PDF 寫 23 pages，ACM DL 寫 pp. 1–22。
6. 樣本雖稱「knowledge workers」，最大職業類是 Computer and Mathematical，美國僅 6.27%；跨職業但不代表一般知識工作者母群（作者第 4 點限制）。

## 對 order 5 的意義

- 支持「讓 LLM 做摘要與整理後，最容易被省略的是檢查」：使用者對 AI 能力越有信心，越少自報檢查；會議紀錄摘要這類「瑣碎」任務被明列為不檢查的例子。
- 支持「人的角色從做轉為把關（stewardship）」：可用來描述 LLM 接手整理後人要做的事——驗證、整合、把關。
- 不支持「AI 降低能力」這種強主張；只能說「自報的檢查行為與對 AI 的信心反向相關」。

## 讀取紀錄

- 取得過程：
  1. `curl -L -A "Mozilla/5.0" https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf` → 回傳 4,410 bytes 的 HTML（Microsoft 擋頁，`<title>Microsoft</title>`），不是 PDF。
  2. Exa 搜尋找到鏡像：advait.org、hankhplee.com、ppc.land、ACM DL epdf。
  3. `curl -L -A "Mozilla/5.0" https://advait.org/files/lee_2025_ai_critical_thinking_survey.pdf` → PDF 成功（pdftotext 報「Syntax Error: Can't get Fields array」為表單欄位警告，不影響文字）。
- 全文檔（同一 PDF 兩種抽法）：
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/lee-2025-genai-critical-thinking.txt`（`-layout`，1,434 行，185,666 bytes）：雙欄並排；讀第 1–420 行（摘要至 §3.3.2）、576–650 行（Table 4 完整列）。
  - `…/fulltext/lee-2025-genai-critical-thinking.flow.txt`（非 layout 閱讀順序，2,868 行，144,464 bytes）：讀第 690–1389 行（§3.3.2 結尾、§4 全部；Table 4 在此檔被拆成單格，改看 layout 檔）、1500–2056 行（§4.3.1 至 §7、致謝）、2567–2868 行（附錄 A.1 問卷全文、Table 5 codebook）。2056–2566 行為參考文獻，未逐條讀。
- Fig. 1（流程圖）、Fig. 2（費力度分布圖）只讀圖說；Fig. 2 的百分比取自正文 §5.1。
