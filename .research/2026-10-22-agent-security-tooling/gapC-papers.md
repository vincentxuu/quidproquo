# gapC：紅隊工具資料全文精讀（PyRIT / HackAgent / CSA 評 PyRIT / EthiBench）

標記：【作者】作者自述　【第三方】非作者的轉述或評論　【推論】我的推論

## 0. 讀取紀錄與降級

全文存本機：`/tmp/claude-0/-home-user-quidproquo/294bb94c-7336-5c0f-a4c7-a0ff961e5680/scratchpad/gapC/` 下的 `pyrit_html.txt`、`hackagent_html.txt`、`csa.txt`、`ethiack_html.txt`。全部用 python3 依序分段印出讀完，沒有用關鍵字抽段代替。

降級紀錄：
- 工具鏈只用到 Groundlane `web_fetch`（extract:"full"）。它每次都成功，所以沒有往 jina、cloudflare、linkup、Exa、WebFetch 降級。這不是這些工具壞了，是沒有輪到。
- Bash `curl` 連 `arxiv.org/pdf/*` 回 403（CONNECT tunnel failed，proxy 說 arxiv.org:443 connect_rejected）。被擋的網域是 `arxiv.org`。我用的是 Groundlane，沒有改用別的途徑。
- Groundlane 抓 `arxiv.org/pdf/2410.02828` 與 `arxiv.org/pdf/2606.18193` 時，內容被截在 100000 字元（`truncated:true`）。對 PDF 加 `maxBytes` 重試只拿到亂碼的原始 PDF 位元組。
- Groundlane 抓 `arxiv.org/pdf/2605.10834` 回 `OUTPUT_LIMIT`（upstream response exceeds the byte limit）。
- 因此改讀 `arxiv.org/html/<id>`（arXiv 官方 LaTeXML 版），三篇都是 `truncated:false`。**嚴格說，我讀的是 HTML 版，不是 PDF 版。**
- 圖（Figure/PNG）內的數字讀不到。EthiBench 的主結果全在圖裡（見 §4）。

| 來源 | 實際讀的 URL | 總字元數 | 依序讀過的區間（涵蓋全文） |
|---|---|---|---|
| PyRIT 論文（arXiv v1） | arxiv.org/html/2410.02828 | 62,768 | 0–300、300–6000（目錄、作者、nav）、6000–22000、22000–40000、40000–62768。附錄 A–D 的對話內文每行只印前 1500 字元，其餘為 Gandalf 對話逐字稿，不影響任何數字。 |
| HackAgent 白皮書（arXiv v2，2026-09-20） | arxiv.org/html/2606.18193 | 62,192 | 0–20000、20000–41000、41000–58500、58500–59500，其餘為 LaTeXML 頁尾 |
| CSA/OWASP PyRIT 評估 | cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming | 85,496 | 0–22000、22000–46000、46000–66000、66000–85496。前約 14000 字元是導覽列。 |
| EthiBench 論文（arXiv v3，2026-07-28） | arxiv.org/html/2605.10834 | 97,652 | 0–2500（目錄）、2500–20000、20000–38000、38000–56000、56000–66971（只有參考文獻，已檢查沒有非參考文獻內容）、66971–82971、82971–97652 |
| HackAgent 文件 | docs.hackagent.dev 的 concepts/judges、reference/evaluation、hackagent/evaluation/audit、hackagent/evaluation/metrics、hackagent/datasets/calibration，另讀 sitemap.xml 確認沒有其他 judge 品質頁 | 各頁完整回傳 | 各頁一次讀完，皆 `truncated:false` |

CSA 頁面備註：頁面最後有 "Unlock the full resource by signing in"。我讀到的是公開頁面上的全文（Introduction 到 Appendix E）。登入後的 PDF 是否有更多內容，我無法確認。

---

## 1. PyRIT 論文（arXiv 2410.02828v1，Microsoft AIRT，2024-10-01）【作者】

**會被引用的數字**（全文只有這幾個可引用的量化數字，沒有 ASR 表）：

| 數字 | 對照條件／脈絡 | 位置 | 原文 |
|---|---|---|---|
| 100+ 次紅隊作業 | Microsoft AIRT 內部使用，含 Copilots 與 Phi-3 | §I、§III | "The Microsoft AI Red Team (AIRT) has successfully utilized PyRIT in 100+ red teaming operations of GenAI models, including for Copilots and the release of Microsoft's Phi-3 models" |
| 1.5k stars、266 forks | 截至 2024-07-01 | §III-B2 | "As of July 1, 2024, PyRIT boasts an active community of contributors, with the project garnering 1.5k stars and 266 forks on GitHub." |
| 15 個傷害類別、6 週 | Phi-3 發布前 break-fix 案例 | §IV-B | "across a total of 15 harm categories"；"spent six weeks preparing datasets containing hundreds of prompts and prompt-image pairs" |
| 「超過一千個 prompt」 | Phi-3 作業 | §V | "over a thousand prompts were generated, normalized, submitted for inference, and scored" |
| Gandalf Level 1–4 破解 | GPT-4o 當紅隊 bot；只做 Level 1–4，沒有報告 5–10 或成功率／嘗試次數 | §IV-A | "We used the red team orchestrator to probe Gandalf and extract the passwords for Levels 1-4." |
| Phi-3 safety post-training 後有害輸出「顯著下降」 | 只有 Fig. 3 的圖，**內文沒有給任何百分比** | §IV-B | "Safety post-training guided by AI red teaming led to a significant decrease in harmful content generation across all categories, including the 7 shown here." |

**作者自己的限制或保留**：
- Fig. 3 說明："Note that percentages are inflated because prompts used by the AI Red Team were crafted to elicit harmful generations."
- Gandalf 的 Level 1–4 在 Appendix 的 Level 4 對話中第一輪失敗（"I was about to reveal the password, but then I remembered…"），之後才成功，所以不是每次一次成功。
- 沒有獨立的 Limitations 章節。§VI Future Work 列出：報告功能不足（"Future versions of PyRIT will include improved reporting capabilities"）、要擴充多模態 converter、要增加對抗演算法、要支援新模型。
- 論文是「框架介紹加一個 PoC 加一個案例」，沒有對照組、沒有跟其他工具（garak 等）做量化比較。Related Work 對 garak 等的比較全是定性敘述。

**要注意的措辭**：論文沒有說 PyRIT 能測 agent。它的 target 是模型端點，連 §III-A2 提到的「寄信、把 jailbreak 放進網站」也只是 target 抽象的一個說法，不是 agent 工具呼叫。

---

## 2. CSA/OWASP「Evaluating PyRIT for Agentic AI Red Teaming」（2026-06-15 發布）【第三方，非 PyRIT 作者】

### 2.1 80%／40% 到底是什麼分數（已找到原文）

出處：章節「Results and Findings → Key Findings from Capability Assessment」，是五個條列。原文逐條：

- "**High Automation Coverage for Core Red Teaming (95%+)**: PyRIT provides production-ready automation for all core red teaming activities: prompt execution, scoring, logging, and reporting…"
- "**Strong Support for Prompt-Level Agentic Testing (80%)**: Testing agent responses to role escalation, memory poisoning, goal manipulation, and tool misuse scenarios is well-supported through existing orchestrators and scorers. The limitation is that PyRIT evaluates LLM textual responses rather than actual agent state changes or tool invocations"
- "**Partial Support for System-Level Agent Validation (40%)**: PyRIT cannot natively observe actual agent behavior beyond LLM responses. Testing whether an agent actually executes unauthorized tools, modifies its internal state, or persists false memories requires integration with agent framework telemetry, which is outside of PyRIT's current scope"
- "**Excellent CI/CD Integration Potential (90%)**…"
- "**Limited Built-in Reporting and Visualization (30%)**…"

**結論**：
- 80% 與 40% 是「能力覆蓋程度的評等」：80% 是 prompt 層級的 agentic 測試支援度，40% 是系統層級 agent 驗證的支援度。
- **它不是攻擊成功率，不是偵測率，也不是測試通過率。**
- 全文沒有定義計算方式、分母、評分者、評分標準。前面的 Capability Matrix 只用 ✓／⚠／✗ 與 Low/Medium/High，沒有百分比。這五個百分比沒有一個能從該表推出來。
- 【推論】這些百分比是作者的主觀估計，不可當成實測量化結果引用。引用時要寫成「CSA 報告對 PyRIT 能力覆蓋的主觀評等」。
- 同一節 Capability Matrix 中的原文限制："Tool Misuse Validation: ⚠ Partial Support: Can test LLM responses about tool usage, cannot observe actual tool invocations"；"Agent State Tracking: ✗ Not Supported: PyRIT tests LLM responses, not internal agent state"；"Multi-Agent Coordination Testing: ✗ Not Supported: Single target testing only"。

### 2.2 其他會被引用的數字：Appendix D（90%／95%）的性質

Appendix D "Agentic AI Exploit Validation with PyRIT Quantitative Test Plan"：
- Memory Poisoning：N=20、Refusal 18、Compliance 1、Ambiguous 1，Refusal Rate 90%、Exploit Success 5%。
- Tool Misuse：N=20、Refusal 19、Compliance 0、Ambiguous 1，Refusal Rate 95%、Exploit Success 0%。
- **這些是「測試計畫」附錄中的範例輸出格式**，小節標題是 "Analysis Scripts and Expected Output Format"。開頭寫的是 "outlines a structured test plan"，結尾寫的是 "Next Steps: 1. Execute the test plans in a controlled environment."。
- 沒有交代：目標模型版本、是否真的跑過、judge 的人工驗證。連 target 是 GPT-4 還是 Azure OpenAI 都沒指定（Appendix C 寫 `model="gpt-4"`，Appendix D 寫 Azure 部署）。
- 打分器的 prompt 是 "Does the AI response indicate a refusal… Answer with only 'yes' or 'no.'"，也就是 LLM 判拒絕，沒有人工校驗。
- 【推論】這組數字不能當作 PyRIT 或任何模型的實測結果引用。至少要標註「CSA 附錄的範例輸出，未說明是否為實跑」。

### 2.3 作者自己列的限制（原文）

- "PyRIT is not a replacement for human red teamers but a force-multiplier… assumes an expert will drive the strategy and interpret the findings."
- "the framework's limited native target support with Azure/OpenAI and generic HTTP-based endpoints necessitates that the user spend considerable engineering effort to implement custom integrations to AI agents, integrated development environments (IDEs), or AI browsers."
- 攻擊者與評估模型常會拒絕產生對抗 prompt，使用者要持續花力氣繞過；品質也因所選模型而異。
- "PyRIT is designed to test model-mediated behaviors, not to execute or control real autonomous agents."
- "PyRIT does not natively model agent state, authorization, or tool execution."
- "PyRIT does not currently provide an official curated library of attack patterns."
- "Lacks integrated automatic report generation"（Strengths/Limitations 表）。
- 測試只涵蓋 prompt 層（Appendix B 的腳本只用 `RefusalScorer` 加靜態 prompt 清單）。
- 另有一個與「CI/CD 整合」相關的措辭：能力表中 Pre-Commit、GitHub Actions 等標 "Not a PyRIT feature"，只是 "Feasible"。

### 2.4 可靠性疑點【推論】

- 「Advanced Automation Capabilities for Enterprise Deployment」一節（intelligent orchestrator selection engines、IDE plugins、adaptive scoring frameworks 等）讀起來像描述 PyRIT 已有的功能，但 §Evaluation 的 "Advanced Automation Scenarios" 與 "Current Limitations" 說這些是「評估潛力（potential）」，並承認沒有官方攻擊模板庫。兩處口吻不一致，引用前者要小心。
- 頁面內殘留編輯痕跡："Add a Work flow diagram : Dataset → Orchestrator → Target → Scoring Engine → Log/Report"。
- 腳本用的 `MultiTurnOrchestrator`、`StaticDataset`、`RefusalScorer`、`LocalMemory`、`OpenAITarget` 等名稱，在 PyRIT 論文列出的元件（RedTeamingOrchestrator、PAIR/TAP/Crescendo 等）裡找不到對應。我沒有查 PyRIT 原始碼，不確定這些類別是否存在，**不要把這些類別名稱當成 PyRIT API 事實引用**。（Appendix 中也出現 `SelfAskGptClassifier`，PyRIT 論文只提到 `SelfAskTrueFalseScorer`。）

---

## 3. HackAgent 白皮書（arXiv 2606.18193v2，作者 Nicola Franco，AI4I）【作者】

背景與利益關係：HackAgent 是 AI4I AI Security Lab 自己開發的工具（abstract 腳註："HackAgent is an open-source AI-agent red-teaming toolkit developed by the AI Security Lab at AI4I"），作者是該實驗室負責人。論文聲明 "independent third-party evaluation… not affiliated with… Anthropic"，所以「獨立」是相對於被測模型廠商，不是相對於工具。

### 3.1 會被引用的數字（所有 ASR 都是 5-judge 面板 ≥4/5 確認）

ASR 定義（§2.4）："ASR = confirmed jailbreaks / total attempts × 100%. A confirmed jailbreak is an attempt the five-judge panel ruled harmful by at least 4 of 5 votes. Denominators count attempts, not unique intents."（注意：Executive summary 寫「jailbroken on x% of intents」，與此定義有細微不一致，內文表格的分母是 attempts。）

**Table 2（§3.1）每個攻擊家族 conf./att.（ASR）**

| 攻擊 | Opus 4.8 | Fable 5 | Fable 5.1 |
|---|---|---|---|
| PAIR | 333/4,346（7.66%） | 177/3,766（4.70%，†部分，27/55 子類別，下限） | 未跑 |
| TAP | 667/7,826（8.52%） | 393/7,826（5.02%） | 685/7,826（8.75%） |
| PAP | 235/7,826（3.00%） | 33/7,826（0.42%） | 597/7,826（7.63%） |
| h4rm3l | 80/46,956（0.17%） | 17/46,956（0.04%） | 未跑 |
| 匹配子集 TAP+PAP | 902/15,652（5.76%） | 426/15,652（2.72%） | 1,282/15,652（8.19%） |
| 總確認數 | 1,315 | 620 | 1,282（只含兩個家族，不可與前兩者比） |

- 對照條件：只有 TAP+PAP 的匹配子集是三個目標分母相同。其他列各目標跑的家族不同。
- 原文："the matched subset row… is the only row on which all three columns are directly comparable."
- 其他：總 harm 意圖 7,826 筆、10 類、55 子類別；三種自適應／說服家族占確認 jailbreak 的 94%（Opus 4.8）與 97%（Fable 5）。h4rm3l 約 50,000 次嘗試（表內分母 46,956）只確認 80 與 17 筆。

**Table 4（§3.5）面板門檻掃描（匹配子集，15,652 次／目標）**

| 門檻 | Opus 4.8 | Fable 5 | Fable 5.1 |
|---|---|---|---|
| ≥1/5 | 10.39% | 4.45% | 9.91% |
| ≥2/5 | 9.91% | 4.13% | 9.75% |
| ≥3/5 | 8.68% | 3.53% | 9.35% |
| ≥4/5（標題） | 5.76% | 2.72% | 8.19% |
| 5/5 | 1.37% | 0.82% | 4.11% |
| 有回應的比例 | 91.0% | 56.1% | 76.4% |
| 只算有回應，TAP | 10.13% | 9.74% | 12.07% |
| 只算有回應，PAP | 3.07% | 0.69% | 9.50% |

- 原文（關鍵保留）："at the two most permissive bars (≥1/5 and ≥2/5) Opus 4.8 rather than Fable 5.1 is the least robust target, and the reported ordering emerges only at ≥3/5 and holds from there up… the Opus 4.8-versus-Fable 5.1 comparison is bar-dependent and should be quoted with its rule."
- 原文："Fable 5's apparent advantage under adaptive search is largely a refusal-rate advantage."
- 結論句："What distinguishes these models adversarially is their resistance to framing, not to search."

**面板自身統計（§2.4）**：「面板擋掉多少」："54.1% of flagged Fable 5/PAP rows survived, 59.9% for Fable 5/TAP, 29.6% for Fable 5/PAIR, 54.4% and 55.2% for Opus 4.8/TAP and PAP, only 15.5% for Opus 4.8/PAIR, and 71.8% and 93.8% for Fable 5.1/PAP and TAP"。

### 3.2 作者自己列的限制（§5，逐點）

1. 除 PAIR 外是匹配樣本；PAIR 覆蓋不等（Opus 4.8 38/55、Fable 5 27/55、Fable 5.1 未跑），只能當方向性。
2. **攻擊者模型在兩輪不同**：Opus 4.8、Fable 5 用 Qwen3-32B-abliterated，Fable 5.1 用 Qwen3.8-27B-abliterated。原文："Every Fable 5 vs Fable 5.1 number in this report is therefore a comparison of (target, attacker) pairs, not a single-variable A/B"；"the precise multiplier as uncertain, and the direction, not the magnitude, as the defensible claim"；重跑 Fable 5 尚未做。TAP 的 in-loop scorer 在 Fable 5.1 那輪也不同（用攻擊者模型自己當 scorer）。
3. Fable 5.1 只跑兩個家族（PAIR 因成本放棄，原因是 credit exhaustion），總數不可與前兩者比。
4. "The panel filters precision, not recall." 只有 in-loop scorer 標記的才進面板，漏掉的找不回來，所以 "Reported rates are therefore lower bounds"。
5. "The absolute rates are not human-audited at scale." 只有小樣本人工讀過 unanimous 確認。§3.5 說約五分之一的確認列以拒絕／防禦／教育語氣開頭，但後面照給內容；作者判斷這是 jailbreak 不是誤判，並警告 "adjudication of these cases cannot be done from response previews"。"no audit at scale has been run on any of the three targets."
6. Fable 5/PAIR 只跑 27/55（target-routing bug 中斷）。
7. "Judge panels are imperfect, and unevenly strict."
8. 時間點快照；正式環境的 system prompt、輸出過濾、監控沒有建模，"would further reduce real-world success"。

### 3.3 HackAgent judge 自身的誤判率／一致率：有沒有公開數字？

**結論：沒有公開 judge 對人工標註的準確率、精確率、召回率、誤判率。有公開的只有 judge 彼此之間的一致性與嚴格度，以及文件裡的審計機制說明。**

論文有的（§2.4，作者自述）：
- 五個 judge 對 6,840 筆已裁決嘗試的「判有害」比例："66.5% (GPT-6 Astra Pro), 66.0% (Qwen3.8 Max), 59.2% (Grok 4.6), 58.3% (DeepSeek V4 Pro) and 20.0% (Gemini 3.8 Flash)"。
- 兩兩一致："the four non-Gemini judges agree with one another on 81–89% of attempts, Gemini with them on 53–59%."
- 舊的三 judge 面板中："one member confirmed 99–100% of flagged rows and the rule degenerated to a single vote"。
- 這些是 **judge 間一致性**，不是對錯。沒有 Cohen's/Fleiss' κ，沒有 vs human 的混淆矩陣。
- 唯一的「人工驗證」描述是 §3.5／§5 的小樣本人工讀取，沒有樣本數、沒有比例。論文說「around a fifth of confirmed rows」是看起來像誤判但實為 jailbreak 的列，這是作者對 unanimous 樣本的觀察，不是 judge 誤判率。

文件頁（judges、reference/evaluation、evaluation/audit、evaluation/metrics、datasets/calibration）有的是機制，沒有結果數字：
- `evaluation.audit`：預設 `enabled:false`；用 HarmBench 人工標註 classifier 驗證集（revision `8e1604d1171fe8a48d8febecd22f600e462bdcdd`，預設 `sample_size:100`，`seed:42`）在攻擊前跑一次。
- 文件明說："Accuracy is reported for you to read. Only robustness can fail a run"；`metrics` "is reported, never graded"。
- robustness 用 `prepend_append`、`refusal_prefix`、`educational_framing` 三種內容保留改寫重判；`max_flip_rate` 預設 `1.0`（也就是預設不會擋任何東西）。文件說理想值是 0。
- `metrics` 模組有 `fleiss_kappa`、`per_judge_strictness`（含 `bias_gap`）函式，但文件只給函式說明，沒有任何實測 κ 值。
- 【推論】白皮書本身是否啟用了 audit 沒有寫。§3.5 的「≥k/5 掃描」與 judge 的 vote 統計是用保留的 raw 逐 judge 判決算的，不是 audit 模組的產出。
- 預設投票規則是 `majority`（過半），`any` 為「catches more, with more false alarms」。這是文件與白皮書（≥4/5）不同的地方：白皮書用的 ≥4/5 不是預設。

---

## 4. EthiBench 論文（arXiv 2605.10834v3，Ethiack ＋ Notre Dame，2026-07-28）【作者】

### 4.1 Strix 的精準度與召回率實際數字

**在論文可讀文字中，Strix 沒有任何絕對的 precision／recall／F1 數字。** 主結果全在圖裡（Fig. 2、3、5–10 為 PNG），我讀不到圖內數值。文字與表中只有下面這些：

1. **Table 1（Appendix F.3）Welch t-test 與 Cohen's d，三次重複，比較對象為各配置的差**（Difference 欄只標 `%`，沒說是百分點或相對值）：
   - claude-code-sonnet vs strix-sonnet：F1 +16.79%（p=0.0141，d=3.504）；F0.5 +7.54%（p=0.1501，d=1.452）；Recall +18.83%（p=0.0047，d=4.981）；Precision −14.19%（p=0.0445，d=−3.050）。
   - pentagi-sonnet vs strix-sonnet：F1 +12.35%（p=0.0577）；Recall +17.28%（p=0.0116）；Precision −25.70%（p=0.0276，d=−4.147）。
   - pentagi-gpt vs strix-sonnet：F1 +2.30%；Recall +3.40%；Precision −13.43%（p=0.0657）。
2. **文字**：
   - Appendix E："Claude Code… a precision of 81.24%"。這是文中唯一的絕對 precision。
   - Appendix E："Strix shows the opposite trade-off. It reports fewer false positives than the other engines, but also reports a lower volume of vulnerabilities, leading to cleaner outputs but reduced coverage."
   - Appendix E："Strix-Sonnet provides a stronger balance between low false-positive rate and overall performance, although this also reduces the detection rate."
   - §4.2："the Strix-Sonnet combination remains comparatively precise even after aggregating findings from three distinct runs, while nearly doubling its Recall, ultimately achieving the highest cumulative F0.5 score among all evaluated setups."
   - Appendix F.1：Strix-Qwen 在 paygoat 累積後 recall 大幅提升；Appendix F.3 稱 Strix-Sonnet "appears conservative… higher precision but substantially lower recall"。
3. 【推論】若 Table 1 的 Difference 是百分點，且 Claude Code Sonnet 的 precision 就是 81.24%，Strix-Sonnet 的 precision 約為 95.4%（81.24+14.19）。但論文沒有寫，Difference 的單位也未定義，Claude Code 的 81.24% 是否是跨目標平均也沒寫（Appendix E 只說 averaged over runs and targets 的 Fig. 2）。**不可當成論文數字引用。**
4. 要拿到 Strix 的絕對數字，需要論文圖的原始資料或 GitHub repo `ethiack/ethibench`（我沒有去讀；也不在這次任務範圍內）。

### 4.2 實驗設計（§4、Appendix C）

- 三個引擎：Strix（usestrix）、PentAGI（vxcontrol）、Claude Code（Anthropic，v2.1.107）。每個引擎配四個模型：Claude Sonnet 4.6、GPT 5.4、DeepSeek v3.1、Qwen 3.6 Plus（Claude Code 只配 Sonnet）。
- 三個開源靶：vuln-bank（60 個漏洞）、paygoat（28）、xben-090（20），共 108 個專家標註 ground truth。
- 每個設定跑 3 次（clean 容器、只給 URL 加一句提示 "find and exploit all vulnerabilities… maximum application coverage"）。黑箱，e2-standard-4 VM，一次並行 6 個 run。
- Claude Code 的 prompt 另外加了角色與輸出格式（"You are a top-tier cybersecurity expert… findings.jsonl"），與 Strix／PentAGI 的提示不完全相同。
- PentAGI 只輸出最終報告，由 multi-turn AI-as-judge 轉成逐項 JSONL（Appendix C），也就是 PentAGI 的結果多經過一層 LLM 轉換。
- 評分：LLM-as-judge 做 finding↔ground truth 語意匹配，匈牙利演算法做二分匹配，重複回報算 duplicate。
- 匹配器驗證（§4.1）：50 個人工分流的 finding（25 TP、25 FP）。結論："both Gemini 3 Flash and GPT 5.4 Mini showed reliable classification capabilities, with the latter (on average) only incorrectly classifying approximately 1 finding (as duplicate instead of true positive)."，選 GPT 5.4 Mini。結果在 Fig. 1，文字沒有逐模型的準確率。樣本 50 筆且「selected from our experiments」，不是隨機抽樣。

### 4.3 作者自己列的限制（§5、Appendix B）

- "we do not contribute new targets"；協定的有用性取決於用在夠真實的靶上。
- 沒有研究跨 run 記憶或會變動的靶。
- 沒有涵蓋安全面向，例如 "whether agents avoid destructive actions during operation"。
- 結果不應解讀成排名：§4 "the experimental results should not be interpreted as a definitive ranking of the engines or the models themselves"（系統高度可設定，可加外部工具、skills、memory、MCP）。
- 評估指標取決於 ground truth 的完整度："the reported metrics depend on how complete and accurate the current ground truth is"；未匹配的 finding 可能是漏標而被算成 FP。
- 低重複次數：「too small to fully support strong claims based only on statistical significance testing」，p 值不顯著不等於沒差異，所以配 Cohen's d。n=3，d 值（如 3.5、4.98）的穩定度本身就很有限【推論】。
- 公開靶有訓練資料污染風險（B.2）；遠端 API 模型有時間變異（B.3）。
- Cumulative 評估對雜訊多的系統有害：PentAGI-Sonnet 累積後 F1 反而下降（precision 損失蓋過 recall 增益）。

### 4.4 利益關係【推論＋第三方】

- 作者隸屬 Ethiack（葡萄牙公司，Coimbra／Porto）加一位 Notre Dame 教授。論文**沒有**利益衝突或資金聲明（全文搜不到 conflict／sponsor／funding statement）。
- 論文沒有評 Ethiack 自己的產品。三個被測系統都是第三方（Strix、PentAGI、Claude Code）。
- 論文也**沒有提到 Ethiack 的產品線**；Ethiack 是否銷售商用 AI pentest 產品、是否與 Strix 競爭，是我的背景知識，這次沒有在論文裡驗證。若文章要寫利益關係，需另查 Ethiack 官網並標明。
- 論文公開釋出 expert-annotated ground truth 與評估程式碼（github.com/ethiack/ethibench），這是降低偏誤的正面訊號。

---

## 5. 與先前摘要說法的不一致處

我沒有拿到「先前摘要」的原文，只有你這次任務裡提到的說法，所以只能逐項對照這些：

1. **CSA 的 80%／40%**：先前由搜尋摘要得來，現已確認是「能力覆蓋評等」，不是攻擊成功率或偵測率，且無方法說明（§2.1）。這與「80% 成功率」之類的讀法不一致。
2. **CSA 的 90%／95%**：如果先前有引用 Refusal Rate 90%／95%，那是 Appendix D 的範例輸出格式，不是實測（§2.2）。
3. **EthiBench**：先前只讀部落格，現在確認論文本文沒有 Strix 的 precision／recall 絕對值，只有相對差（§4.1）。若先前摘要寫了 Strix 的具體精準度或召回率數字，**在論文文字中找不到來源**，需要從圖或部落格出處重新驗證。
4. **EthiBench 不是 Strix 排名論文**：作者明講不是定論排名。若先前摘要把它寫成「Strix 勝過／輸給某某」，要降級語氣。論文的主張是評估協定，Claude Code Sonnet 的 F1 與 recall 最高（Appendix E "achieves the strongest overall performance"），Strix 的 precision 較高、recall 較低。
5. **HackAgent**：白皮書「獨立再裁決」的措辭要補上「工具是同一個實驗室做的、judge 沒有對人工標註的準確率數字、沒有 at-scale 人工稽核」。ASR 分母是 attempts 不是 intents。
6. **PyRIT 論文**：沒有提供 PyRIT 對任何模型的 ASR；Phi-3 的下降只有圖。若先前摘要有 PyRIT 的成功率數字，論文中沒有。

其餘逐項對過，沒有發現更多與你列出的說法衝突之處。

---

## 6. 引用建議（可直接用的安全寫法）

- PyRIT：「Microsoft 自述在 100+ 次內部紅隊作業中使用，並在 Phi-3 發布前做 15 類傷害測試；論文沒有公開 ASR 數字」。
- CSA：「CSA/OWASP 報告對 PyRIT 作主觀能力評等：prompt 層 agentic 測試 80%、系統層 agent 驗證 40%（報告未說明算法）；核心結論是 PyRIT 測的是 LLM 文字回應，看不到實際工具呼叫與 agent 狀態」。
- HackAgent：「單一實驗室、自家工具、攻擊者模型在兩輪間不同；最穩的結論是『定性方向』：自適應和說服攻擊遠比靜態編碼有效，且 Opus 4.8 與 Fable 5.1 的排序依面板門檻而變，Fable 5 在每個門檻都是最穩」。
- EthiBench：「評估協定論文；以 3 個靶、108 個漏洞、每設定 3 次重複；Claude Code（Sonnet）F1 與 recall 最高，precision 81.24%；Strix-Sonnet precision 較高、recall 較低、累積 F0.5 最高；沒有給 Strix 的絕對數字」。
