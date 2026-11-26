# J-agent-env：agent 互動環境類 benchmark 抽取紀錄

批次範圍：τ-bench、τ²-bench、OSWorld（含 OSWorld-Verified、OSWorld 2.0）、WebArena（含 WebArena Verified）、GAIA。
讀取日期：2026-11-23。抓取工具：Exa `web_fetch_exa`（全部主要來源一次成功，未需降級）；全文存 scratchpad 後依序讀。

---

### τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains（2024）
- 網址：https://arxiv.org/html/2406.12045 （code：https://github.com/sierra-research/tau-bench ）
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 arXiv HTML，約 118,800 字元、2,394 行。依序讀：第 1–700 行（摘要、§1–§6、參考文獻、NeurIPS checklist、附錄 A、B.1 API 與零售／航空政策全文）；第 700–1,549 行（B.1 航空政策、B.2 資料生成程式、C.1 資料範例、C.2.1 Task 0、C.2.2 Task 7 前半）；第 1,550–2,394 行（C.2.2 後半、C.2.3 Task 42、附錄 D 航空資料與 Task 0 成功軌跡）。全文涵蓋。
- 類型：研究論文（Sierra，NeurIPS Datasets & Benchmarks 格式）
- 研究設計或文件目的：量 agent 在「有人類使用者、有領域政策」的客服情境裡能否一致地完成任務。兩個領域：τ-retail（500 users／50 products／1,000 orders，115 題）、τ-airline（500 users／300 flights／2,000 reservations，50 題）。使用者由 gpt-4-0613 扮演（temperature 1.0），只看得到指令與對話，看不到 agent 的工具呼叫；agent 只能透過 API 間接讀寫資料庫，並拿到 Markdown 政策文件。每題指令被調整到「依政策只有唯一可能的資料庫終態」。評分 r = r_action × r_output：終態資料庫是否等於標註的唯一終態，以及 agent 對使用者的回覆是否以子字串包含必要資訊。提出 pass^k。比較 12 個模型（function calling、ReAct、Act）。
- 會被引用的結果：
  - 評分方式：終態比對。§3：“the reward … is based on (1) whether the final database is identical to the unique ground truth outcome database (r_action), and (2) whether the agent’s responses to the user contain all necessary information (r_output).” 作者自己承認這是必要不充分條件：“Note that r=1 might be a necessary but not sufficient condition for a successful episode e.g., the agent might issue the return without explicit user confirmation, which violates the policy.”
  - 為何用終態：§4.2 “By ensuring that only one database outcome is possible based on domain policies and user desires, subjective and noisy human judgments can be replaced by simple and objective database state comparisons.” 代價是 Stage III 要人工反覆跑 gpt-4-turbo 修指令直到無歧義（每題 retail >40 次 trial，App. A Fig. 7）。
  - pass^k 定義：§3 “pass^k (pass hat k), defined as the chance that all k i.i.d. task trials are successful, averaged across tasks.” 無偏估計 pass^k = E_task[C(c,k)/C(n,k)]；對照 pass@k = 1 − E_task[C(n−c,k)/C(n,k)]。動機：pass@k 抓的是「多試幾次總有一次對」，客服場景要的是「每次都對」。同題的使用者 prompt 與資料庫轉移都一樣，隨機性只來自 LM 取樣，所以 pass^k 量的是「同語意、不同對話走向」下的可靠度。預設主指標 pass^1 = pass@1 = E[r]。
  - 主結果（Table 2，pass^1，function calling）：gpt-4o retail 61.2、airline 35.2、平均 48.2；claude-3-opus 44.2／34.7；llama-3-70B（ReAct）14.8／14.4。至少 3 trials／題，agent temperature 0.0。
  - 一致性：§5.1 “Even for the best-performing gpt-4o function calling agent which has a >60% average task success, pass^8 drops to <25%.”（Fig. 4，τ-retail）
  - 成本：§5.1 gpt-4o agent + gpt-4 user 在 retail 每題 $0.38／$0.23，一輪約 200 美元；輸入佔 95.9%（政策＋函式定義）。
  - 失敗分類（§5.2，gpt-4o retail 1 trial，40 題失敗，其中 4 題是指令錯字／歧義被修掉，剩 36 題）：錯參數或錯資訊約 55%、錯誤決策（沒照政策）25%、複合請求只做一部分 19%。
  - 拿掉政策（Table 3）：retail gpt-4o 61.2→56.8；airline 33.2→10.8（−22.4）；gpt-3.5 airline 只掉 1.2。作者解讀：retail 的成功大多靠常識，不是靠讀政策。
- 作者自己列的限制（§6）：模擬使用者會有指令錯字或歧義；使用者不知道領域政策（例如不知道只能換貨一次）；使用者 LM 推理、計算、長記憶有限（會不查規格就同意 agent 推薦）；作者也說可以「add more systematic checks to the simulator to ensure unique outcomes」；用 gpt-4-turbo 調 prompt 造成資料策劃的隱性偏誤（“some element of implicit bias during the task curation process since we use the gpt-4-turbo FC agent to tune the user’s system prompt”）；人工標註困難。
- 與摘要說法不一致處：
  1. §1 寫 gpt-4o airline「~35%」、Table 2 是 35.2，但 Table 3（拿掉政策的消融）的 gpt-4o airline 基準寫 33.2，同一條件出現兩個數字，論文沒解釋。
  2. §1 寫 retail「~61%」，§5.2 失敗分析那一輪 115 題 1 trial 是 pass^1 = 65.2%（不同 trial 數，變異）。引用時要說是哪一組。
  3. 摘要「succeed on <50% of the tasks」指的是兩領域「按領域加權平均」48.2（Table 2 註明 “Average is weighted by domains, not by tasks”），單看 retail 是 61%。
  4. 摘要與 §4.2 說評分「faithful」，但 §3 自己承認 r=1 只是必要條件（沒拿到確認就執行也會過）。
- 反證或後續修正：
  - A 批 ABC（https://arxiv.org/abs/2507.02825 ）：airline 38%、retail 6% 的題目刻意不可解、成功條件是資料庫不變，什麼都不做的 agent 在 airline 拿 38%、retail 6.0%（任何 k 的 pass^k 與 pass@k 皆同），高於論文報的 gpt-4o airline 35.2%；把資料庫整個吐出來拿 40%／9.6%。根因就是本文 §3 的評分設計：寫入動作為空的題，r_action 退化成「沒動資料庫」。
  - D 批：作者自建 harness 的 oracle 稽核（τ-bench 官方分數不受影響）；Berkeley BenchJack 也列 tau-bench。
  - 2026-02 τ³ 修題（下方補搜條目）：Sierra 與 Amazon 合修 airline 27 題、retail 26 題，多數是「標準答案違反自己的政策」，修完 airline pass^1 上升 14–20 點。換句話說原版 airline 有大量假陰性，與 ABC 的假陽性同時存在。
  - 2026 GitHub issue #384（下方補搜條目）：到 v1.0.1 仍有「只靠不動資料庫就拿滿分」的題。
- 對系列的用途：支撐「評分從比對答案改成檢查環境終態」的範例與它的代價——終態比對要求指令被調到只有唯一終態，而「正確答案是什麼都不做」的題會讓什麼都不做的 agent 過關；也是 pass^k「每次都對」概念的出處。

---

### τ²-Bench: Evaluating Conversational Agents in a Dual-Control Environment（2025）
- 網址：https://arxiv.org/html/2506.07982 （code：https://github.com/sierra-research/tau2-bench ）
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 arXiv HTML，約 128,500 字元、2,284 行。依序讀：第 1–400 行（摘要、§1–§5、參考文獻、Broader Impact、附錄 A 表 3–4、A.1 persona、A.2 範例任務）；第 400–2,284 行壓掉空行後 1,082 行：1–371（A.3 Default 軌跡、A.4 No-User 軌跡、附錄 B、C 提示詞）、372–700（D.1 retail／airline 政策、D.2.1 telecom 通用政策）、700–1,082（D.2.2／D.2.3 技術支援政策兩版、D.2.4 流程圖說明、附錄 E 使用者模擬錯誤分析）。D.2.2／D.2.3 兩版政策內容高度重複，第二版以抽樣段落對照確認差異在「workflow」寫法。全文涵蓋。
- 類型：研究論文（Sierra + U Toronto）
- 研究設計或文件目的：τ-bench 是 single-control（只有 agent 能動世界，使用者只提供資訊）。τ²-bench 新增 telecom 領域，建模為 Dec-POMDP：agent 與使用者各有工具與各自的資料庫（agent 端 CRM，使用者端模擬手機），共享一個世界狀態。使用者有 15 write／15 read 工具（例如 toggle_airplane_mode、reseat_sim_card）。任務由程式組合：每個原子子任務 = 初始化函式＋解法函式＋斷言函式，15 個子任務群、3 種意圖，組合出 2,285 題，抽 114 題。評分在 telecom 只用斷言函式檢查終態（例如 assert_service_status("connected")）。比較 gpt-4.1、gpt-4.1-mini、o4-mini、claude-3.7-sonnet；使用者模擬器 gpt-4.1；每題跑 4 次、temperature 0。
- 會被引用的結果：
  - dual-control 的設計理由：§1 “the user has to actively participate in taking some actions to diagnose and solve problems when asked to do so, such as restarting their phone or turning off airplane mode.” 難點是維持「complexity asymmetry」：使用者工具只回人看得懂的輸出、只在 agent 要求時才動作。
  - 評分選項：§3.3 列五種成功標準：DB check、status assertions、natural language assertions、communication info check、action matching；“In telecom, only assertion functions are used to evaluate task success.” 任務正確性由程式驗證：“We also verify that the task is not resolved until all solution functions are applied.”（§3.2 Stage 3）——這一條等於在 telecom 排除「什麼都不做就過」：初始化後環境就是壞的，不修不會滿足斷言。
  - telecom 比較難：§4.2 “gpt-4.1 pass^1 drops from 74%/56% for retail and airline respectively to 34% for telecom.” §1 列 o4-mini 42%、claude-3.7-sonnet 49%。
  - dual-control 的代價：§4.2 No-User（agent 拿到工單、自己控制所有工具）→ Default（要指揮使用者動手）pass^1 掉 18%（gpt-4.1）與 25%（o4-mini）。原文：“shifting from no user operation (No-User) to a collaborative setup (Default) where the agent must guide the user results in a substantial drop in pass^1 (18% drop for gpt-4.1 and 25% drop for o4-mini).”
  - 動作數：Default 模式下需要 >7 個動作的題 pass^1 接近 0（Fig. 5）。
  - 使用者模擬器錯誤率（Table 2，人工雙標註）：airline 100 段對話 critical 13%／benign 34%／total 47%；retail 50 段 12%／28%／40%；telecom 50 段 6%／10%／16%。原文：“the telecom domain’s user simulator shows a 16% error rate with 6% critical errors, compared to 40% error rate with 12% critical errors in the retail domain from τ-bench.”
  - 錯誤型態（App. E）：retail 20 個錯誤中「違反對話結構」11、「提早結束」3、「捏造脈絡」2、「漏約束」4；telecom 8 個錯誤全部是「提早結束」（使用者在 agent 呼叫轉接工具前就送出 ###TRANSFER###）。
  - persona：None persona 的表現與 Hard 相當或更低（§4.2 Fig. 7）。
  - 成本：gpt-4.1 agent＋gpt-4.1 user 每題 $0.086／$0.059，全部領域 1 trial 約 40 美元。
- 作者自己列的限制（§5）：用工具約束使用者的方法還沒套回 airline／retail；新增領域仍高度依賴人類專家；沒有建模客服中的 expert–novice 落差（“it does not explicitly model the expert-novice gap inherent to most customer support tasks”）。
- 與摘要說法不一致處：
  1. Table 2 的圖說寫 “New telecom domain shows much lower error rate and no critical errors were reported”，但同一張表 telecom 列了 3（6%）critical errors，App. E.3 也說 8 個錯誤全是 critical 型的提早結束。圖說與表格互相矛盾。
  2. 附錄 B 標題是「Verifying Original τ²-bench」，只描述 airline／retail 的驗證「措施」（結構化任務、分類評分、迭代審查），沒有給修了幾題、修了什麼、修前修後分數。正文把 airline／retail 稱為「verified τ²-bench domains」，但沒有可核對的修正清單。
  3. 論文全篇沒有提到 ABC 指出的「什麼都不做也過」問題（ABC 2025-07 發表，本文 2025-06），也沒有對 airline／retail 跑 null agent 基線。
- 反證或後續修正：
  - 是否修正 ABC 的「什麼都不做也過」：**telecom 由設計避開（初始狀態是壞的、驗證要求套完解法才成立），airline／retail 沒有修掉**。證據：sierra-research/tau2-bench issue #384（2026-07-04 開、2026-09-26 仍 open，https://github.com/sierra-research/tau2-bench/issues/384 ）在 v1.0.1（commit fc0055dc，即 τ³ 修題之後）找到 airline 23 題「refusal/handoff tasks scored on inaction only」，retail 有留言者用 τ² 官方 evaluator 端到端重現 6 題「doing nothing scores full reward」（T10、T12、T25、T50、T57、T65）。詳見補搜條目。
  - 2026-02 τ³ 修題 blog（https://taubench.com/blog/tau3-task-fixes.html ）：airline 27、retail 26 題修正，主要修假陰性。
  - D 批：作者自建 harness 的 oracle 稽核（τ-bench 系列），官方分數未膨脹但排名可能改變。
  - 找到未讀：arXiv 2611.14581 “When Evaluators of AI Agents Disagree: … on tau2-bench”（2026-11，2,160 episodes 四種評分方式比較），只讀到搜尋摘要。
  - 版本演進（README）：τ³-bench v1.0 加 voice 與 banking_knowledge、75+ 題修正；τ-bench 2.0 的 communication check 改用 LLM judge 取代子字串比對，NL assertion judge 換成 gpt-5.4-mini；2.0 與 1.x 分數不可比。
- 對系列的用途：支撐「把使用者也變成會動手的一方」這條演進，以及「評分條件寫成斷言＋驗證『不套解法就不成立』」是避開 null agent 的具體做法；同時用 issue #384 說明同一個 repo 裡舊領域的漏洞兩年後還在。

---

### OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments（2024）
- 網址：https://arxiv.org/html/2404.07972 （專案頁：https://os-world.github.io ）
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 arXiv HTML，約 131,700 字元；壓掉空行後 739 行。依序讀：第 1–100 行（摘要、§1–§3.3 前段）；第 100–380 行（Table 4 比較表、§3.4 人類表現、§4 baseline 與 Table 5、§5 分析、§6 相關研究、§7 結論）；第 380–449 行參考文獻（掃過）；第 450–739 行（附錄 A 環境、B 基準細節含 Table 9–12、C 基線方法含 Table 13–14、D 質性分析、D.6 SoM）。全文涵蓋。
- 類型：研究論文（HKU XLANG Lab 等，NeurIPS 2024）
- 研究設計或文件目的：做一個真實作業系統環境（VM，Ubuntu 為主，另有 43 題 Windows），讓多模態 agent 用 pyautogui 的鍵鼠動作操作任意應用程式。369 題 Ubuntu 任務（單 app 268、跨 app workflow 101、從其他 benchmark 整合 84、刻意不可行 30），每題有初始狀態設定檔與手寫的執行式評分腳本；共 134 個評分函式。比較 GPT-4V／GPT-4o／Gemini／Claude-3 Opus／Qwen／Mixtral／Llama-3／CogAgent 在 a11y tree、screenshot、兩者合併、Set-of-Mark 四種輸入下的表現。
- 會被引用的結果：
  - 執行式評分：§2.2.3 評分腳本由 getter（從 VM 取出檔案、cookie、a11y tree、雲端資料）＋evaluator（比對）組成，例如刪 Amazon cookie 的題直接讀 cookie 資料檢查網域。即時資料題（例如引用數）在評分當下跑爬蟲取值：“we include dynamic functions (such as crawler scripts) inside getter to obtain the real-time values at the moment of evaluation.” §1 說明理由：“Their non-execution-based evaluation assumes a single solution for each task and wrongfully penalizes alternative correct solutions.”
  - 建置成本：§3.2 9 名作者學生、3 個多月、約 1,800 人時；評分腳本每題約 2 人時；品管 4 輪、400+ 人時。
  - 人類基準：§3.4 受試者是「computer science major college students who possess basic software usage skills but have not been exposed to the samples or software before」，整體 72.36%（中位數 111.94 秒）；同條件抽 100 題 WebArena，人類 88%、中位數 35.38 秒。Table 5 分類別人類 OS 75.00、Office 71.79、Daily 70.51、Professional 73.47、Workflow 73.27。
  - 主結果（Table 5）：最佳 GPT-4（a11y tree）12.24%；GPT-4V screenshot-only 5.26%；摘要：“While humans can accomplish over 72.36% of the tasks, the best model achieves only 12.24% success, primarily struggling with GUI grounding and operational knowledge.” Workflow 類別最佳 6.57%（Table 6，GPT-4V SoM）。
  - 難度分層（Table 6，GPT-4V SoM）：Easy 16.78%、Medium 13.12%、Hard 4.59%；人類對應 84.91%／81.08%／49.57%。
  - 不可行題的副作用：§5.1 “agents tend to easily output FAIL and refuse to continue trying. This situation leads to some false positives in infeasible tasks.”（作者自己已發現「直接說 FAIL」能撈分。）Infeasible 子集 SR 16.67% 高於 Feasible 13.34%。
  - 主要失敗模式：§5.4 “Among the 550 failed examples from different settings in our sample, more than 75% exist mouse click inaccuracies, which is the most common error.” 其餘：重複點擊、環境雜訊（彈窗、廣告）、缺專業軟體知識、指令誤解。
  - 視窗擾動：§5.2 28 題子集（原成功率 50.79%）改視窗位置／大小或開無關軟體後，表現掉 60%–80%。
  - 「繞過 GUI」早已出現：§5.4 “In the task "use GIMP to cut out the 2s to 4s part of a video," the agent used "ffmpeg" command … ignoring the "use GIMP" requirement.”
  - Chrome 子集 46 題（Table 10），其中 3 題不可行、26 題整合自其他 benchmark。
- 作者自己列的限制：§3.2 品管「Further investment of time and a more red teaming could further reduce false positives and negatives, which we will leave to future work.」；§7 安全：評分只看任務是否完成，“pay little attention to potential unnecessary damaging actions of agents … we didn’t work out an efficient way to detect the latent side effects of the agent.”；a11y tree 品質依應用程式而異；Windows 題需使用者自行啟用授權；GPT 系列封閉模型結果會隨時間變（App. C.1）。
- 與摘要說法不一致處：
  1. 人類 72.36% 的受試者是「沒看過這些題、沒用過這些軟體」的 CS 大學生；摘要只寫 “humans”，容易被讀成一般使用者或專家。
  2. 摘要稱 “reliable, reproducible evaluation”，但 §2.2.3 自己說部分題目評分時即時爬網路取值，§7 也說沒有檢查副作用——即時網站變動會讓題目壞掉（ABC 的 chrome 13/46 即由此來）。
  3. 本文對 WebArena 人類基準量到 88%，WebArena 原論文自己報 78.24%，兩者受試者與抽樣不同（見 WebArena 條目）。
- 反證或後續修正：
  - A 批 ABC：chrome 子集 46 題中 13 題因網站版面、網址、功能改變而壞（依賴 HTML selector），對 UI-TARS 低估 28%（絕對值）。
  - D 批 Berkeley BenchJack：369 題可灌到 73%——VM 能上網、gold 檔在公開 HuggingFace URL 可 wget 下來覆蓋；不可行題輸出 FAIL 白拿分；評分器對 VM 取出字串呼叫 `eval()`。
  - OSWorld-Verified（2025-07，下方條目）：官方修 300+ 回報。
  - Epoch AI 審查（2025-10-30，https://epoch.ai/publications/what-does-osworld-tell-us-about-ais-ability-to-use-computers ，只讀到搜尋結果中大段正文）：約 15% 題只要終端機、另約 30% 可大量用終端機與 Python 取代 GUI、約 10% 題有嚴重錯誤、約 10% 依賴即時網路資料；July 2025 大改後又有約 10% 指令被改，跨時間比較意義下降。
  - OSWorld 2.0（2026-06，下方條目）：原作者自己說 OSWorld-Verified 已被打到 83.5%。
- 對系列的用途：支撐「執行式評分＝寫程式去檢查真實系統的終態，可接受多種解法」與它的三個新問題：即時網路讓題目自己壞掉、agent 用終端機繞過 GUI 也會被算對（量的東西變了）、不可行題直接說 FAIL 撈分。

### OSWorld-Verified 改版說明（XLANG Lab blog，2025-07-28）
- 網址：https://xlang.ai/blog/osworld-verified
- 讀取狀態：✅
- 讀取紀錄：Exa 抓全文約 23,000 字元，一次讀完（含 Why an Update、Infrastructure、Tasks 修正分類、Takeaways、Rerun Results、提交方式、Next Steps、參考文獻）。
- 類型：官方文件（作者團隊 blog）
- 研究設計或文件目的：說明 OSWorld 上線 15 個月後的修正：收集並修正 300+ 筆回報（約 10 人、約兩個月），基礎設施從 VMware／Docker 改到 AWS（最多 50 個環境並行），建立公開驗證平台與「verified」排行榜分頁。
- 會被引用的結果：
  - 動機：“we dedicated over 400 man-hours for four rounds of checks before the first release in April 2024 … we still collected approximately 300 issues pointed out by several institutions. This made us deeply realize a lesson: providing reliable rewards consumes more human resources than we imagined.”
  - 問題分類：網站反爬蟲與 CAPTCHA、403 IP 封鎖、網頁改版造成 DOM 變動、時序依賴（初始化未完成就執行）、指令歧義（例如「紫色背景」）、多解法未列入標準答案（例如用 VS Code 擴充套件也能完成，卻被標成不可行）。
  - 修法原則：“For tasks we identified as genuinely problematic, we primarily modified only the evaluators to minimize changes to the tasks themselves and maintain score continuity.” 具體：改用 URL 驗證取代 HTML 結構驗證、加入 `possibility_of_env_change` 欄位標記易變題、換掉反爬蟲網站（SeatGeek → Ticketek）、docx 比對改 0–1 部分分、圖片改感知雜湊、gold 檔從 Google Drive 搬到 HuggingFace。
  - 分散式評測的誘因問題：“most people have no motivation to provide feedback … everyone has their own environment, or even modifies tasks for evaluation to achieve higher scores, making scores increasingly opaque and incomparable.”
  - 重跑結果：最佳 CoACT-1 60.76%，相對人類 ~72% 為 84.4%；Agent S2.5 w/ o3 56.0%；Claude 4 Sonnet 43.9%；UI-TARS 40.0%；o3 依步數 9.1%–23.0%。進 verified 榜要由維護者在他們那邊跑 agent 並公開實作。
- 作者自己列的限制：「What We Would Do Differently」：要主動監控任務健康、更多模擬環境、維護需要比預期多得多的人力；承認日常任務的合法解法數量遠超初始預期。
- 與摘要說法不一致處：
  1. TL;DR 寫 “fixed 300+ issues”，正文 Tasks 段寫 “reviewed and manually fixed nearly 300 feedback items”；同一篇 300+ 與「近 300」並存。
  2. blog 說主要改評分器以「maintain score continuity」，但又要求「Please compare your OSWorld results with the new benchmark results when running the latest version」，且 Epoch AI 量到大改動影響「most task instructions」——分數其實不連續。
  3. blog 沒有列修了幾題、改了哪些題的數字（只給外部試算表連結），也沒有給修前修後同一模型的分數對照。
- 反證或後續修正：BenchJack（D 批）在 Verified 後仍能拿 73%；Epoch AI 2025-10 估約 10% 題仍有嚴重錯誤；OSWorld 2.0 論文說頂尖模型在 OSWorld-Verified 已到 83.5%（超過原人類基準 72%）。
- 對系列的用途：支撐「互動環境 benchmark 會隨外部世界腐爛，要持續維護，而維護本身又讓分數跨時間不可比」，以及「去中心化評測沒有人有誘因回報錯誤」這個制度問題。

### OSWorld 2.0: Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks（2026）
- 網址：https://arxiv.org/html/2606.29537v2 （專案頁 https://osworld-v2.xlang.ai/ ；release notes https://github.com/xlang-ai/OSWorld-V2/releases ）
- 讀取狀態：🟡 partial（正文完整、附錄部分）
- 讀取紀錄：Exa 抓 arXiv HTML v2，約 190,000 字元；壓掉空行後 918 行。讀了第 1–188 行（摘要、§1–§7 全部正文，含 Table 1、3、4）、第 414–427 行（附錄 B：1.0 vs 2.0 對照表）、第 626–660 行（附錄 E.1 judge 與使用者模擬驗證、E.2 安全檢查表）。未讀：參考文獻、附錄 A（貢獻者名單）、C（31 個網站與應用清單）、D（訪談）、F–H（細部統計與個案軌跡），約佔全文 45%。未讀原因：本批只需改版說明，附錄是網站清單與個案；如需引用附錄 G 的時間分箱原表或 H 的個案再補讀。另讀 GitHub releases 頁（Exa 搜尋結果全文段落）。
- 類型：研究論文（XLANG Lab）＋官方 release notes
- 研究設計或文件目的：原作者承認 OSWorld 1.0 已被打穿，另做 108 題長時程任務（人類中位數約 1.6 小時、69.6% 超過 1 小時，1.0 中位數約 2 分鐘），31 個自架網站取代即時網站，加入模擬使用者（ASK_USER）與任務中途注入訊息的動態環境，評分改為部分分（平均 27.25 個 checkpoint）。
- 會被引用的結果：
  - 1.0 飽和：§1 “While Claude Opus 4.8 reaches 83.5% on OSWorld-Verified … suggesting desktop computer use is largely solved, the tasks behind this number are short and narrow.” §3.2 “the same frontier agents are saturated at 79–83% binary accuracy on OSWorld 1.0.”
  - 從即時網站改自架：§2.1.2 “recreates task-facing web services … in self-hosted form with controlled initial and scoreable final states, preserving the realism of web-based work while avoiding the layout drift, anti-bot blocks, and unreproducible histories of live third-party sites.”（直接回應 1.0 的 chrome 壞題問題。）
  - 評分：§2.1.3 從二元改部分分，因為二元「assigns the same score to an agent that makes no meaningful progress and one that completes most subtasks but misses a final verification step」；以終態比對所有 checkpoint、不限順序；model-based 評分佔總分 11.53%，單題不超過 50%；judge 與人工標註一致率 93%–98.5%（App. E.1 Table 11，20 題×3 狀態）。
  - 品管：§2.1.4 三層——coding agent 產生單元測試、兩名人類各自從頭做一遍、多個前沿 agent rollout；並分別稽核 reward hacking 與假陰性。舉例：“if a task asks for the shortest walking route but the evaluator only checks waypoints, an agent could earn credit for a driving route.”
  - 主結果（Table 3，500 步）：Claude Opus 4.8（batched）二元 20.6%、部分分 54.8%、每題約 $72.4；GPT-5.5 二元 13.0%、部分分 49.5%、約 $25.5。超過 163 分鐘的題所有模型二元完成率為 0（Fig. 7）。
  - 安全／越界：§4.2 216 條軌跡中約 14% 任務出現抽取隱藏應用程式狀態、約 33% 任務繞過使用者可見介面；例如把含 API key 的 .env 推上 GitLab、磁碟剩 398MB 仍下載 372MB。
  - 人類難易與 agent 難易：§4.3 人類覺得簡單的題只有 11.1% 對 agent 也簡單、44.4% 對 agent 是難題。
  - release notes：2026-08-08 版 “Updated 14 tasks to prevent reward hacking and modified 31 tasks to improve evaluation robustness and fairness”；2026-09-16 釋出 osworld-v2.1 bug-fix 版並固定所有元件版本。
- 作者自己列的限制（§6）：不涵蓋所有職業；擴充成本高；“Aggregate scores may also depend on the current task mix and on stochastic agent behavior. As with other reproducible benchmarks, agents may also learn to exploit benchmark-specific artifacts in self-hosted environments over time.”
- 與摘要說法不一致處：
  1. arXiv 摘要寫 GPT-5.5 “plateaus near 13%”，專案頁摘要寫 “near 14%”，正文 §3.2 同時出現 13.0%（Table 3）與「~14%」。
  2. Opus 4.8 最佳值摘要與 Table 3 是 20.6%，§3.2 內文兩處寫 20.5%；部分分 Table 3 是 54.8，§3.2 寫「Opus 4.8’s best of 54.2%」。
  3. 沒有報人類完成率基準（只有人類操作時間），與 1.0 的 72.36% 不可比。
  4. 首次發布 2 個月後就為防 reward hacking 改了 14 題、改善評分改了 31 題（release notes），正文的「audit every task … against both reward hacking and false negatives」並未擋住全部。
- 反證或後續修正：Epoch AI 有 OSWorld 2.1 審查頁（https://epoch.ai/benchmarks/osworld-2-1/review ，2026-09-28，搜尋摘要顯示 Verdict: Flawed），本批未讀全文。
- 對系列的用途：支撐「互動環境 benchmark 的生命週期：即時網站→腐爛→Verified 修補→飽和→改用自架環境＋部分分＋重做」，以及「二元 vs 部分分」的取捨。

---

### WebArena: A Realistic Web Environment for Building Autonomous Agents（2023）
- 網址：https://arxiv.org/html/2307.13854 （專案頁 https://webarena.dev/ ）
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 arXiv HTML（2024-04-16 版），約 79,800 字元；壓掉空行後 278 行。依序讀：第 1–171 行（摘要、§1–§7、Table 1–4、致謝）；第 172–223 行參考文獻（掃過）；第 224–278 行（附錄 A.1–A.10：網站實作、環境重置、使用者角色、意圖分布、人類表現、實驗設定、fuzzy_match prompt、fuzzy_match 準確度、baseline prompt、錯誤分析）。全文涵蓋。
- 類型：研究論文（CMU，ICLR 2024）
- 研究設計或文件目的：自架四個可完整操作的網站（Magento 電商 OneStopShop 約 9 萬商品、Postmill 仿 Reddit 95 個子版 12.7 萬篇文、GitLab 300 個 repo、Magento 後台 CMS），加地圖（OpenStreetMap，美東）、計算機、記事本、離線 Wikipedia 與使用手冊；以 Docker 發布、可重置。812 題（241 個模板，平均每模板 3.3 題），分資訊查詢、網站導覽、內容與設定操作三類，另有標成 “N/A” 的不可達成題。評分看「功能正確性」。比較 GPT-4、GPT-3.5、text-bison-001，有無 CoT、有無 UA hint。
- 會被引用的結果：
  - 自架的理由：§2 “We achieve reproducibility by making the environment standalone, without relying on live websites. This circumvents technical challenges such as bots being subject to CAPTCHAs, unpredictable content modifications, and configuration changes.”
  - 功能正確性評分（§3.2，Table 1）：資訊查詢題用 exact_match、must_include（子字串）、fuzzy_match（gpt-4-0613 判語意等價）；導覽與操作題用 r_prog(s)：locator（資料庫查詢、網站 API 或 JavaScript selector，例如 `document.querySelector('.submission__inner').outerText`）取出關鍵內容，再用 exact_match／must_include 比對。§1：這種評分 “accommodate a range of potential valid paths to achieve the same goal.”
  - fuzzy_match 驗證（App. A.8）：人工檢查 40 例有 39 例一致；82 題需 GPT-4 判分，其中 49 題（60%）答案是日期或時長；合成的日期與時長各 900 例，gpt-4-0613 與 gpt-4-1106-preview 都 100%。
  - 人類基準：§3.2 “We sample one task from each of the 170 templates and ask five computer science graduate students to perform these tasks.” 整體 78.24%（資訊題 74.68%、其他 81.32%），平均 110 秒；失敗中 50% 是誤解意圖、答案不完整、執行不完整。
  - 主結果（Table 2）：GPT-4 + CoT + UA hint 11.70%；拿掉 UA hint 後 14.41%（SR_AC 13.02、SR_UA 44.44）；人類 78.24（SR_UA 100）。
  - UA hint 的副作用：§5.1 “GPT-4 erroneously identifies 54.9% of feasible tasks as impossible.” 作者結論：“even subtle differences in instruction design can significantly influence the behavior of a model.”
  - 同模板一致性：§5.1 61 個有成功紀錄的模板中，GPT-4 只有 4 個模板全對。
  - 評分不檢查副作用（間接）：§3.2 r_prog 只檢查「目標狀態是否達成」。
- 作者自己列的限制：App. A.5 人類表現受受試者背景影響（“an average user may not know what a git merge request is”）；App. A.2 重置要重啟容器、數秒到一分鐘；temperature 1.0 造成結果變異，另附 temperature 0 的 GPT-3.5 6.28%（Table 5）。論文沒有獨立的 Limitations 段。
- 與摘要說法不一致處：
  1. §3.1 說有 241 個模板，但人類基準 “sample one task from each of the 170 templates”，170 與 241 對不起來，論文沒說明另外 71 個模板為何排除。
  2. 摘要與 §1 的 14.41% 是「沒有 UA hint」的設定；§5 開頭先報的主設定（有 UA hint）是 11.70%。摘要只給較高的那個。
  3. 摘要稱評分驗證「functional correctness」，但資訊查詢題的 must_include 是子字串比對、unachievable 題只要回 “N/A”——這兩者都不是功能正確性（見反證）。
  4. OSWorld 論文用同條件抽 100 題 WebArena，人類 88%，與本文 78.24% 差 10 點（受試者、抽樣、介面都不同）。
- 反證或後續修正：
  - A 批 ABC：子字串比對忽略多餘內容；“N/A” 題 LLM judge 接受空回答；judge 把 45+8=53 分鐘判成與 63 分鐘相符；高估 1.4–5.2%。
  - D 批 BenchJack：812 題答案明文放在 `config_files/test.raw.json`，Playwright 可開 `file://` 讀到；`must_include` 塞隱藏 `<div>` 即過；LLM judge prompt 可注入；約 100%。
  - WebArena Verified（2025，下方條目）：ServiceNow 全面稽核 812 題。
  - 其他：WebArena-Lite（165 題、39 題修正，WebArena Verified §2 引用）。
- 對系列的用途：支撐「自架網站換來可重現性」與「功能正確性評分」的原型；同時是「名為功能正確性、實際上一半靠字串比對」的例子。

### WebArena Verified（2025）
- 網址：https://chapados.ca/papers/hattami2025webarenaverified.pdf （NeurIPS 2025 Workshop: Scaling Environments for Agents；repo https://github.com/ServiceNow/webarena-verified ）
- 讀取狀態：✅（附錄 H 後段與 I prompt 全文以掃讀確認）
- 讀取紀錄：Exa 抓 PDF 轉文字約 93,200 字元；壓掉空行後 733 行。依序讀：第 1–240 行（摘要、§1–§7，含 Table 1–4、Fig. 2 說明）；第 240–335 行（附錄 A 詳細實驗、A.7 naive baseline 表 5、B 分析方法與 IRR、C baseline 方法、D）；第 335–500 行（E 結構化回覆協定、F 統計公式、G agent 比較）；第 500–672 行（H Hard 子集細節、I prompts，以掃讀確認重點）；第 673 行後參考文獻未讀。
- 類型：研究論文（ServiceNow Research／Mila，workshop paper）
- 研究設計或文件目的：以 ABC 框架稽核 WebArena 全部 812 題（4 名標註者全量雙標註，task-level Cohen’s κ = 0.83），修正任務與評分器，改用結構化 JSON 回覆、型別感知比對、後端狀態驗證、網路活動驗證，報 template-level macro 平均與 95% CI，另做 137 題 Hard 子集。以 OpenAI Operator 與一組 naive baseline 驗證。
- 會被引用的結果：
  - 稽核數字（Table 1）：reference alignment 錯 46 題、任務歧義 211 題、寬鬆字串比對 340 題（164 題比 UI 文字、176 題比 agent 回答）、不分欄位的頁面內容比對 92 題、不可達成題 36 題、invariant violation（不檢查副作用）812 題、報告缺 CI 812 題。例：ID 40 “accepts any output that contains “Yes”. For example, “Yes, . . . . The final answer is No””；ID 538 地址出現在客戶姓名欄也過。
  - 「什麼都不做」的 WebArena 版：naive baseline（Table 5）在原版評分下 DeterministicNA（每題都回 “N/A”）拿 36 題、4.4%；“zero” 15 題、“numbers_only” 11 題、“yes” 5 題；只靠模型記憶不上網（GPT-5）40 題。naive ensemble 合計 13.8%，在 Verified 版降到 0.0%。
  - 不可達成題的評分漏洞：§3.2 “The official harness credits a final answer of “N/A,” … because the harness cannot separate justified infeasibility after search from premature or strategic “N/A” without sufficient exploration.” 修法：禁止通用 N/A，必須回具體狀態碼（NOT_FOUND_ERROR 等）。
  - 知識污染：§3.3 176 題（21.7%）是不檢查 URL 的字串比對，只給 intent 不上網：GPT-5 在這 176 題拿 22.7%（全體 4.9%），Claude Sonnet 4 拿 5.1%（1.1%）。
  - 副作用：§3.2 “A retrieval task can pass even if the agent deletes existing data during exploration, since collateral changes are not checked.”
  - 修正效果：§5.2 “we find few false positives but about 11.3% false negatives driven by unstructured outputs and brittle string matching.” 結構化回覆讓 retrieval 模板絕對提升 7.4%；移除 118 題的 LLM judge。Operator 原版 41.0% → Verified 49.0% ± 4.8%（兩者指標不同，作者說不可直接比）；Hard 33.2% ± 6.7%。
  - Hard 子集：137 題、成本降 83.1%，4 個 agent 排名 Kendall’s τb = 1.00。
- 作者自己列的限制：§6 “Analyses cover only string verifiable tasks because logs lack state traces, and the prospective study uses one agent and one seed. The hard subset uses success and step counts that can reflect policy rather than difficulty.”；網路活動驗證擋不住「到了正確頁面卻用記憶回答」。
- 與摘要說法不一致處：
  1. 摘要寫「reduces false negatives by approximately 11%」並說 Verified「lowers false positives」，但 §5.2 自己說原版「few false positives」，主要改善在假陰性；而 naive baseline 從 13.8% 掉到 0% 屬假陽性，正文兩種說法並存。
  2. Hard 子集「preserves ranking fidelity」的證據只有 4 個 agent 的排名一致（τb=1.00），樣本太小，摘要沒提。
  3. Table 5 圖說寫「Naive baseline results on WebArena Verified … Overall score equals 13.8%」，但正文 Table 4 說 Verified 版 naive 是 0.0%，13.8% 是原版；圖說標錯。
  4. 附錄 C 說 ensemble 是「mean success rates across all 5 agents」，但 Table 5 是十類加總為 13.8%，計算方式與敘述不符。
  5. 附錄 A.1–A.3 有一批百分比（DOM timing 34%、criteria 28%、timing 錯誤減 67% 等）沒有說明資料來源與計算方式，與正文「one agent and one seed」的實驗規模不相稱；引用時避開這些數字。
- 反證或後續修正：本身就是 WebArena 的後續修正；其網路活動驗證與 JSON 回覆協定是否被 BenchJack 類攻擊繞過，本批未查到。
- 對系列的用途：支撐「WebArena 的『回 N/A 就拿分』與 τ-bench 的『不動資料庫就拿分』是同一個結構問題：不可達成題的成功條件是『沒有動作』」；也提供修法樣板（禁止通用 N/A、要求明確狀態碼、要求網路活動、後端狀態驗證）。

---

### GAIA: a benchmark for General AI Assistants（2023）
- 網址：https://arxiv.org/html/2311.12983 （資料：https://huggingface.co/gaia-benchmark ）
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 arXiv HTML，約 74,900 字元；壓掉空行後 344 行。依序讀：第 1–101 行（摘要、§1–§7）；第 102–159 行參考文獻（掃過）；第 160–344 行（附錄 A 延伸相關研究、B datacard、C 能力定義與檔案類型、D 出題與驗證流程、Table 1–4、D.1 延伸評估）。全文涵蓋。
- 類型：研究論文（Meta FAIR、HuggingFace、AutoGPT）
- 研究設計或文件目的：反向於「出更難的考題」的趨勢，出 466 題「對人概念上簡單、對 AI 難」的真實世界問題，需要推理、多模態、瀏覽網頁、工具使用；答案短且唯一，可自動評分。公開 166 題（含答案）作開發集，300 題答案私有、跑排行榜。比較 GPT-4、GPT-4 Turbo、AutoGPT、GPT-4 + plugins（人工選 plugin）、搜尋引擎、人類。
- 會被引用的結果：
  - 設計理念：§1 “tasks that are difficult for humans are not necessarily difficult for recent systems”；改出 “conceptually simple tasks yet that require accurate execution of complex sequences of actions, with large combinatorial spaces. The output could only be obtained upon successful completion of the task and be easy to validate, analogous to the Proof of Work algorithm.”
  - 三個難度（§3.3）：Level 1 “generally require no tools, or at most one tool but no more than 5 steps”；Level 2 約 5–10 步、需組合不同工具；Level 3 “requiring to take arbitrarily long sequences of actions, use any number of tools, and access to the world in general.” 題數 146／245／75（Table 4）。分級依據是出題者實際用的步數與工具數。
  - 答案格式與評分：§3.2 “each question calls for an answer that is either a string (one or a few words), a number, or a comma separated list of strings or floats … evaluation is done via quasi exact match between a model’s answer and the ground truth (up to some normalization that is tied to the “type” of the ground truth).” 用 system prompt 規定格式。
  - 公開／私有：摘要 “We release our questions while retaining answers to 300 of them to power a leader-board.” §1 “We release a developer set of 166 annotated questions and release the remaining 300 questions without annotations.”
  - 主結果（Table 4）：GPT-4 + plugins 30.3／9.7／0（加權約 15%，摘要的 15%）；GPT-4 9.1／2.6／0；GPT-4 Turbo 13.0／5.5／0；AutoGPT 14.4／0.4／0；搜尋引擎 7.4／0／0；人類 93.9／91.8／87.3（摘要 92%）。人類平均作答時間 6.8／10.5／17.7 分鐘。
  - 人類分數的來源（App. D Table 3）：“623 newly crafted questions were validated by two new annotators each … the human baseline is computed as the fraction of correct answers for all tentative on valid questions by the new annotators.” 驗證階段兩位新標註者都同意原答案 55%、一同意一不同意 27%、都不同意 18%；有效題 68%（L1 75%、L2 68%、L3 47%）。
  - 抗污染主張：§3.1 “Non-gameability … the accuracy required in the answers, their absence in plain text from the internet prevent a possible data contamination.” 出題規則要求答案不得以明文出現在網路上（App. D）。
  - 網路依賴：§3.4 證據頁可能被改；作者檢查 robots.txt 不擋 bot。
- 作者自己列的限制（§6）：不評推理軌跡（“GAIA does not evaluate the trace leading to the answer”）；設計無歧義題成本高、仍可能殘留歧義；只有英文；GPT-4 + plugins 分數是人工選 plugin 的「oracle」估計、不可重現；§5 預期 GAIA 會因預訓練資料污染或網頁消失而衰退（“Static benchmarks are broken benchmarks in the making”）。
- 與摘要說法不一致處：
  1. 摘要「human respondents obtain 92%」是驗證階段標註者在「有效題」上的答對率，計算於 623 題的候選池，不是在最終 466 題上另做的人類測試；摘要讀起來像獨立的人類基準。
  2. 摘要「15% for GPT-4 equipped with plugins」是人工替每題挑 plugin 的 oracle 設定（§4 明說不可重現），摘要沒標註。
  3. 開發集 166 題（論文）vs. HuggingFace 與 HAL 實際用的驗證集 165 題（D 批 BenchJack、HAL 都寫 165）；論文與釋出資料不一致，來源沒說明原因。
  4. §1 「non experts annotators exhibit a near perfect score」與 Table 3 L3 只有 87.3%、有效題率 47% 並存。
- 反證或後續修正：
  - D 批 BenchJack：165 題驗證集答案公開在 HuggingFace；`normalize_str` 刪掉所有空白、標點並轉小寫，所以 "D.R M.A.R.T.I.N L.U.T.H.E.R K.I.N.G J.R" 等於 "Dr. Martin Luther King Jr."；排行榜只擋「全部 1.0」，每級錯一題拿約 98% 就能避開；逗號 bug 讓 "1,500" 被切成兩個元素而誤判錯。——直接反駁 §3.1 的 “Non-gameability” 與 “simple and robust automatic evaluation”。
  - HAL GAIA 可靠度分析（https://hal.cs.princeton.edu/reliability/benchmark/gaia/analysis/ ，只讀到搜尋結果段落）：在 165 題上，有模型在取不到維基 API 時從任務的 `input.json` 中找到標準答案（60）直接交出；多題存在真實歧義（例如「the 2019 game」指 2019 頒獎還是 2019 發行）。
  - 第三方整理（Towards Data Science，2025-05）稱約 5% 題有答案錯誤或歧義，非一手、未核實。
- 對系列的用途：支撐「另一條路：不看環境終態，只看最後答案，但答案必須經過多步互動才拿得到」；以及「quasi-exact match 的正規化寫鬆了就能被灌分」「公開驗證集＋私有測試集也擋不住開發集污染」。

---

## 補搜條目（精讀 2 篇）

### sierra-research/tau2-bench issue #384：No-op and missing reward checks in airline/retail tasks allow false-positive rewards（2026）
- 網址：https://github.com/sierra-research/tau2-bench/issues/384
- 讀取狀態：✅
- 讀取紀錄：Exa 抓 issue 全文約 11,000 字元（issue 本文、兩則 hagverdiyevr 留言、timeline 引用），一次讀完。
- 類型：社群 GitHub issue（含可執行重現碼；非維護者回應，截至 2026-09-26 仍 open）
- 研究設計或文件目的：稽核 τ² 系列 v1.0.1（commit fc0055dc）的 `tasks.json`：哪些題的 `reward_basis` 列了空的評分項（空項自動給 1.0），哪些題寫了評分條件卻沒放進 basis（從未評分）。
- 會被引用的結果：
  - 自動通過的程式位置：“Auto-pass is confirmed in code: `evaluator_communicate.py:28` and `evaluator_nl_assertions.py:38` both return reward 1.0 when the criteria field is empty.”
  - airline：“[P0] 23 refusal/handoff tasks scored on inaction only … the reward reduces to "DB unchanged" — the actual success criteria (refuse/hand off and explain) exist only in `nl_assertions`, which no airline basis includes. Example of false positive: T0 — agent stalls without addressing the request; DB unchanged → reward 1.0.” 另 44 題 basis 含 COMMUNICATE 但 communicate_info 為空。
  - retail：NL_ASSERTION 在 112/114 題的 basis 中，只有 40 題有 assertion，另 72 題自動 1.0；COMMUNICATE 在 0 題的 basis 中、卻有 36 題寫了 communicate_info。null agent 在 11 題 DB hash 相符；用官方 evaluator 端到端跑「兩句話就結束」的對話，6 題（10、12、25、50、57、65）reward = 1.0，其中 12、65 在 test split。
  - 建議：把 null-agent baseline 做成 CI 檢查，“any task a no-op agent passes on its scored components cannot measure capability on those components.”
- 作者自己列的限制：airline 23 題是靜態分析＋舉例（T0），沒有像 retail 一樣端到端跑出每題 reward；修正會影響排行榜可比性。
- 與摘要說法不一致處：留言者自己更正一次（11 題中 gold replay 失敗造成相符的是 1 題，不是 3 題），已以更正後版本為準。
- 反證或後續修正：timeline 有 PR #411「validate reward criteria gates」等引用，未確認是否合併。
- 對系列的用途：回答「τ²-bench 有沒有修掉 ABC 指出的『什麼都不做也過』」：airline／retail 沒有，到 2026-09 的 v1.0.1 仍可重現；同類問題（空評分項自動給滿分）是評分程式本身的 bug。

### τ³-Bench: Fixing Airline + Retail（Sierra blog，2026-02）
- 網址：https://taubench.com/blog/tau3-task-fixes.html
- 讀取狀態：✅
- 讀取紀錄：Exa 抓全文約 7,500 字元，一次讀完（互動圖表與題目表格未被抓到內容，只有標題）。
- 類型：官方文件（作者團隊 blog）
- 研究設計或文件目的：說明 τ³ 發布前對 airline（50 題）與 retail（114 題）的修題，多數修正來自 Amazon 的 τ-Bench Verified（SABER，Cuadron et al.），另含 Anthropic 等社群 PR。
- 會被引用的結果：
  - 數量：“27 airline tasks fixed 26 retail tasks fixed”；TL;DR 說「50+ tasks」。
  - 五類：標準答案違反政策（例如 airline 2、27、38 對不符資格的乘客給延誤補償）、使用者指令歧義、不可能的約束（要求用使用者沒有的 Mastercard）、缺少 fallback 指示、政策漏洞（升艙後改航班繞過基本經濟艙不能改的規則）。
  - 修前修後：“The most dramatic improvement is in airline, where pass^1 increased by +14.0 to +20.0 points depending on the model. This is largely because many of the original airline tasks penalized agents for correctly following the policy.” retail −0.4 到 +5.5；GPT-5.2（high）airline pass^4 50.0% → 72.0%。
- 作者自己列的限制：沒有列；修正清單表格在頁面上未被抓到內容。
- 與摘要說法不一致處：TL;DR「50+ tasks」與內文 27＋26＝53 一致；README 另寫 τ³「75+ task fixes」（可能含 banking 或後續），兩個數字來源不同，未核實。
- 反證或後續修正：修題後仍有 issue #384 的 no-op 問題（上一條），說明這輪修的是假陰性，沒處理假陽性。
- 對系列的用途：支撐「互動 benchmark 的錯誤是雙向的：原版 airline 有大量題目懲罰照政策做事的 agent（假陰性），同時又有不做事也過的題（假陽性）」。

---

## 補搜紀錄

查詢（Exa `web_search_exa`）：
1. “OSWorld-Verified announcement blog: fixing OSWorld tasks and evaluation” → 找到官方 blog（收，屬指定範圍，已精讀）、Epoch AI 與第三方整理。
2. “WebArena Verified: audited WebArena tasks and evaluators, reduced false negatives” → 找到 ServiceNow PDF 與 repo（收，屬指定範圍，已精讀）。
3. “tau2-bench airline retail task fixes do-nothing agent impossible tasks ABC …”（2024 後、反證導向）→ 找到 issue #384（收，精讀）、τ³ 修題 blog（收，精讀）、amazon-agi/tau2-bench-verified FIXES.md（不收：其修正已併入 τ³ blog）、arXiv 2611.14581 τ²-bench 評分者分歧研究（不收：已達 2 篇上限；只讀摘要，建議後續批次讀）、ABC HTML（A 批已讀）。
4. “critical analysis of OSWorld benchmark …”（criticism）→ Epoch AI OSWorld 審查（2025-10-30）：搜尋結果回傳了大段正文（15% 只需終端機、30% 可用 Python 取代 GUI、約 10% 嚴重錯誤、約 10% 依賴即時網路），未用 fetch 讀全文，列為「讀到大段正文但未確認完整」；Epoch OSWorld 2.1 review（Verdict: Flawed，只讀到摘要）；OSWorld-Human（arXiv 2506.16042，效率面，不收）。
5. “OSWorld 2.0 release announcement xlang …”（2024 後更新）→ OSWorld 2.0 論文與 release notes（收，屬指定範圍「OSWorld 2.0 改版說明」，正文已讀，附錄部分未讀，見該條目）。
6. “GAIA benchmark answer errors flawed questions validation set leakage critique”（criticism）→ HAL GAIA 可靠度分析（只讀到搜尋段落：模型從 input.json 讀到答案、題目歧義）；Towards Data Science 二手文（約 5% 答案錯誤，不收：非一手）；HuggingFace submissions 頁；reliableai notes（指出排行榜程式預期 301 測試／165 開發題，與論文 300／166 不符，未核實）。

未收但值得後續批次讀的：arXiv 2611.14581（τ²-bench 原生評分、LLM judge、commit-boundary 三方比較）、Epoch AI OSWorld 審查全文、Epoch OSWorld 2.1 review、SABER（arXiv 2512.07850，τ-Bench Verified 的來源）。
