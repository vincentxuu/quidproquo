# 批次 N-building：自己建 benchmark 的方法與工具（精讀抽取紀錄）

- 精讀日期：2026-11-23
- 讀取管道總覽：
  - Inspect、Harbor 兩個官方文件站都在 `llms.txt` 公開每頁的 markdown 端點（`inspect.aisi.org.uk/<page>.html.md`、`docs.harborframework.com/<path>.md`），直接用 Bash `curl -sL` 抓原始 markdown（brief fallback 第 4 步）。前三步沒試，理由同 A、H 批：官方 markdown 端點一次拿到全文，比 Exa／jina 轉換後的版本更完整（保留程式碼區塊與表格）。
  - Anthropic 文章與 Hamel 文章：Exa `web_fetch_exa`（maxCharacters 200000），回傳未截斷。
  - Dynabench、HELM、補搜兩篇論文：`curl` arXiv PDF ＋ `pdftotext`。
  - jina `search_web` 本批回 `This key is out of quota`（Insufficient balance），補搜改用 Exa `web_search_exa`。
- 工作檔（不入 repo）：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/N/`
- H 批已讀的 Harbor 任務格式、verifier、separate verifier、regrade、reward hacking 公告、Terminal-Bench 版本政策，本檔不重複，只補「怎麼新增一個任務」。

---

### Inspect 官方文件（UK AI Security Institute，2026-11 線上版）

- 網址（依讀取順序）：
  - https://inspect.aisi.org.uk/llms.txt （索引）
  - https://inspect.aisi.org.uk/tutorial.html.md
  - https://inspect.aisi.org.uk/datasets.html.md
  - https://inspect.aisi.org.uk/solvers.html.md
  - https://inspect.aisi.org.uk/scorers.html.md 、standard-scorers.html.md 、model-graded.html.md 、scoring-policy.html.md 、scoring-workflow.html.md
  - https://inspect.aisi.org.uk/agents.html.md
  - https://inspect.aisi.org.uk/sandboxing.html.md
  - https://inspect.aisi.org.uk/eval-logs.html.md
- 讀取狀態：✅（指定六類頁面全文；Scorers 一類因主頁已拆成五個子頁，五頁都讀）
- 讀取紀錄：tutorial 23,954 字元、datasets 15,750、solvers 26,255、scorers 8,650、standard-scorers 8,021、model-graded 14,064、scoring-policy 12,406、scoring-workflow 7,009、agents 7,908、sandboxing 37,272、eval-logs 49,444，每頁從頭讀到尾。第一輪為了省版面把超過 400–700 字元的長行截斷，之後把所有被截掉的行尾補印出來讀過（datasets 6 行、solvers 3 行、standard-scorers 4 行、model-graded 5 行、scoring-policy 4 行、scoring-workflow 1 行）。沒讀：tasks.html.md（33,605 字元，Task 參數與 run config 細節，brief 沒列）、react-agent、custom-scorers、metrics、handling-errors、scanners 等延伸頁，只在正文被引用時當線索。
- 類型：官方文件
- 研究設計或文件目的：Inspect 是英國 AISI 開源的 LLM 評測框架，文件教使用者把一個 eval 拆成資料集、solver、scorer 三件組裝成 Task，並提供 agent、沙箱、紀錄檔、重新評分等基礎設施。
- 會被引用的結果：
  - 一個 eval 的組成（Tutorial〈Benchmarks〉）：「An Inspect evaluation is a Task that brings together three things: a **dataset** of samples, a **solver** that produces an answer for each sample, and a **scorer** that grades the answers.」agent 也放在 solver 位置：「react() returns an agent, which Task accepts directly as its solver.」
  - Sample 的欄位（Datasets〈Dataset Samples〉表）：必填只有 `input`；選填 `choices`、`target`、`id`、`description`、`metadata`、`sandbox`、`files`、`setup`。`target`「May be a literal value or narrative text to be used by a model grader.」→ 同一個欄位可以是標準答案，也可以是給評審模型的評分準則。
  - 樣本 id 的重要性（Eval Logs〈Sample Preservation〉）：重跑要靠穩定 id 對回舊樣本；自動編號「will not work correctly if your dataset is shuffled」。〈Zeroing Samples〉也拒絕整數 id：「Inspect numbers samples without ids by position, so an integer id need not name the same sample in another run.」→ 自建題庫一開始就給每題字串 id。
  - 選項洗牌（Datasets〈Choice Shuffling〉、Tutorial HellaSwag 範例）：`shuffle_choices=42` 以固定種子打亂選項並同步更新正解字母，用來去掉選項位置偏誤又保持可重現。
  - Setup script 上限：「Setup scripts are executed with a 5 minute timeout.」超過要搬進 Dockerfile。
  - Solver 的角色（Solvers〈Overview〉）：系統提示、prompt engineering、生成、自我批評、多輪對話、跑 agent scaffold 都算 solver；一個 Task 只有一個頂層 solver，可以用 `chain()` 串元件。內建：`prompt_template`、`system_message`、`user_message`、`chain_of_thought`、`use_tools`、`generate`、`self_critique`、`multiple_choice`。
  - Scorer 四種形式（Scorers〈Overview〉）：「1. Extracting a specific answer out of a model's completion output using a variety of heuristics. 2. Applying a text similarity algorithm … 3. Using another model to assess whether the model's completion satisfies a description of the ideal answer in target. 4. Using another rubric entirely (e.g. did the model produce a valid version of a file format, etc.)」
  - 內建 scorer 清單（Standard Scorers）：比對類 `includes()`（子字串）、`match()`（開頭／結尾／exact，`numeric=True` 去掉貨幣符號與千分位）、`pattern()`（regex）、`answer()`（`ANSWER: X`）、`exact()`、`f1()`、`choice()`；模型評分類 `model_graded_qa()`、`model_graded_fact()`；`math()`（SymPy 等價判斷，不把答案當 Python 執行）；`perplexity()`、`target_perplexity()`。多數預設報 `accuracy` 和 `stderr`。
  - 模型評分的預設與風險（Model Grading）：
    - 評審模型選擇順序：明給 `model` → `grader` 角色綁定的模型 → 「Else the model currently being evaluated is used.」也就是沒設定時由受測模型自己評自己；可用 `ModelRole("grader", required=True)` 強制報錯。
    - 多評審：給 list 就多數決，「A grade wins only when more than half of the panel returns it」；解析不出的票不算，人數不足時該題記為未評分，而不是由清單順序決定。
    - 抗操弄三招（〈Grading Robustness〉）：只取最後一個 `GRADE: X`；每次評分產生 8 碼隨機 `grader_nonce` 夾在欄位標記上，受測輸出偽造的標記帶不到這個碼；改寫輸入中的 `[BEGIN DATA]`／`[END DATA]`，但「This is only a partial defense.」
    - 代價：「each grading request gets a new code, so its prompt is different every time. A grader with caching enabled won't reuse earlier responses, and re-scoring a log may not reproduce the original grades exactly.」→ 抗注入與可重現互相拉扯。
    - 可重現（〈Reproducible Grading〉）：預設用供應商的生成設定，「often means a non-zero temperature (e.g. 1.0) and no fixed seed, so grades for borderline answers can change from run to run」；建議 temperature=0、能設 seed 就設、跑多個 epochs 看評分變異，且「setting temperature=0 reduces, but does not always eliminate, run-to-run disagreement.」
    - 無標準答案的行為類 eval（sycophancy、拒答）把評分準則寫死在 template，不用 `{criterion}`。
  - 三種評分結局（Scoring Policy〈The three outcomes〉）：回傳 Score（進分母）、拋例外（記 `sample.error`，不進分母）、`Score.unscored()`（NaN，不進分母）。範例：對 1、錯 1、評分錯誤 1、評審解析失敗 1，「accuracy = 1 / 2 = 0.5」。開 `score_on_error` 後，出錯樣本以部分狀態評分並進分母，準確率變 1/3。→ 同一批結果，分母規則不同就得出不同分數，報分時要寫清楚。
  - 失敗歸屬（〈Attribution〉）：受測模型格式錯 → `INCORRECT`（`invalid_response_format`，進分母）；評審模型格式錯 → `unscored`（`grader_failed`，不進分母）。`ScoreReason` 詞彙表：`invalid_response_format`、`refusal`、`no_response`（受測模型）、`grader_failed`（評審）、`scoring_failed`（scorer）、`excluded`、`zeroed`（事後人工）。
  - 重新評分不重跑模型（Scoring Workflow）：`--no-score` 先只跑生成，「particularly useful during scorer development, as it bypasses the entire generation phase, saving lots of time and inference costs.」之後 `inspect score <log>` 套原 scorer 或換 `--scorer`；`--action append`（新舊並存）或 `overwrite`。也可用 `score()` 拿同一份 log 換不同評審模型比較。
  - 沙箱（Sandboxing）：
    - 工具程式碼本身跑在評測主程序，只有透過 `sandbox()` 介面要求的工作才進容器：「Provisioning a sandbox does not automatically run tools, agents or scorers in the container.」
    - 「each sample gets its own sandbox instance, even if the sandbox is defined at Task level. So samples do not interfere with each other's sandboxes.」
    - 網路：自動產生的 compose 設 `network_mode: none`；但自訂 compose 會「replaces the generated configuration rather extending it, including its network_mode: none」，Docker 預設是能連外網，要自己加回。`network_mode: none` 也不限制評測主程序或 `web_search()` 這類不走沙箱的工具。
    - 權限：「Don't count on a non-root container user to contain an adversarial model, as a capable model may get root in its container」；預設擋掉可寫的 host 掛載，理由是 agent 可改寫 `compose.yml` 讓之後的樣本拿到更多權限。
    - 映像版本：預設 `python:3.12-bookworm` 是可變 tag，「To control when you adopt updates, pin an image digest」。
    - 支援 docker（內建）、k8s、daytona、modal、proxmox、vagrant、openshell、local（無隔離）。
    - `exec()` 輸出超過 10MB 時內建 provider 會從前面截掉、仍回成功，「Don't rely on an exception to detect exec() overflow」。
  - 紀錄與重跑（Eval Logs）：
    - 每次 eval 都寫一份 log，`EvalLog` 含 `eval`（任務、模型、時間）、`plan`（solver 與生成設定）、`results`、`stats`（token）、`samples` 等；分析前先檢查 `status == "success"`。
    - `inspect log export-config` 從 log 輸出完整 run config，「This closes the round-trip: eval → log → export-config → eval.」
    - `eval-retry` 從中斷處續跑、沿用已完成樣本；預設只記前幾次原始 API 請求，`--log-model-api` 全記。
    - 事後修分有稽核軌跡：`edit_score()` 保留 `score.history` 與 provenance（作者、理由），並寫 `ScoreEditEvent`；`exclude_samples()`（不算分，例：環境壞掉）與 `zero_samples()`（算零分，例：「the agent was given the answer」）是兩種不同處置，兩者都要求填理由。
    - 安全提醒：`inspect score` 與 `eval-retry` 會執行 log 裡記錄的程式碼，「Only run them on logs you trust.」
  - Log 分析延伸：Tutorial 提到 `inspect_scout` scanner 用 LLM 讀完整 transcript，標出「refusals, evaluation awareness, or misconfigured environments」；Eval Logs 列 CJE「Calibrate model-graded scorer accuracy against oracle labels」。
- 作者自己列的限制：nonce 防禦對 look-alike 標記無效（「Look-alike forms … are not rewritten」）；temperature=0 不保證評審一致；`network_mode: none` 不涵蓋主程序與非沙箱工具；Docker 安全更新要使用者自己負責；非 root 不足以圍住對抗性模型。
- 與摘要說法不一致處：
  - `llms.txt` 對 Scorers 頁的摘要是「Overview of the built-in scorers and pointers to…」，Tutorial 說內建 scorer「cover exact/inclusion matching, multiple choice, and model grading」，實際內建還有 `math()`、`f1()`、`perplexity()`，Tutorial 的概括偏窄。
  - Tutorial 的 security_guide 註解寫「By default the model being evaluated does the grading」，但 Model Grading 頁的實際順序是先找 `grader` 角色，沒綁才退回受測模型；兩頁說法在「沒設定任何東西」時一致，在有綁角色時 Tutorial 那句不精確。
  - 文件中範例模型名（`openai/gpt-6-luna`、`anthropic/claude-sonnet-5-5`）是示範字串，不是任何模型的評測結果，不能當模型資訊引用。
- 反證或後續修正：文件持續改版（例：v0.3.206 起 log 去重＋zstd，「For typical agentic benchmarks (e.g. SWE-Bench, Cybench) we've seen 10:1 improvements」），引用時要附讀取日期。沒找到推翻上述設計的外部文章。
- 對系列的用途：「自己建 benchmark」第一篇的骨架：一個 eval＝資料集＋solver＋scorer（＋沙箱＋紀錄檔）；scorer 分母規則、評審模型預設評自己、生成與評分分離、事後修分要留稽核軌跡，都是可直接拿來教的設計決策。

---

### Harbor：新增一個任務的完整教學（harborframework.com，2026-11 線上版）

- 網址（依讀取順序）：
  - https://docs.harborframework.com/llms.txt （索引）
  - https://docs.harborframework.com/tutorials/create-a-task.md
  - https://docs.harborframework.com/tasks/solution.md
  - https://docs.harborframework.com/tasks/lint.md
  - https://docs.harborframework.com/tutorials/create-a-verifier-with-rewardkit.md
  - https://docs.harborframework.com/news/reward-hacking.md （H 批讀過，本批重讀「Before the run」中 `harbor check`、`.harborignore`、多參考解、非 root agent 與「After the run」的 `harbor analyze` 段，補 H 批沒展開的作者流程細節）
  - https://raw.githubusercontent.com/harbor-framework/harbor/main/src/harbor/cli/quality_checker/default-rubric.toml （`harbor check` 預設 11 點 rubric 原文）
  - https://raw.githubusercontent.com/harbor-framework/harbor/main/src/harbor/analyze/prompts/analyze-rubric.toml （`harbor analyze` 預設 rubric）
- 讀取狀態：✅
- 讀取紀錄：create-a-task 7,686 字元、solution 2,454、lint 4,240、create-a-verifier-with-rewardkit 9,451、reward-hacking 14,708、default-rubric.toml 5,316、analyze-rubric.toml 1,495，全部從頭讀完。repo 檔案清單用 `gh api repos/harbor-framework/harbor/git/trees/main?recursive=1` 找 rubric 檔位置。
- 類型：官方文件＋官方 repo 設定檔
- 研究設計或文件目的：手把手教作者從零做一個 Harbor 任務，並提供靜態檢查（lint）、AI 審題（check）、AI 審軌跡（analyze）三種品質工具。
- 會被引用的結果：
  - 11 步流程（create-a-task）：0 安裝 → 1 `harbor task init ssh-key-pair` 產生 `instruction.md`、`task.toml`、`environment/Dockerfile`、`solution/solve.sh`、`tests/test.sh`＋`tests/test_outputs.py` → 2 寫指示 → 3 `task.toml` 填作者、`difficulty_explanation`、分類、標籤、verifier／agent timeout（範例都是 120 秒）、build timeout 600 秒 → 4 寫 Dockerfile → 5 `harbor task start-env … -i` 進容器手動試解法 → 6 把試成功的指令寫進 `solve.sh` → 7 寫測試，`test.sh` 必須把 reward 寫到 `/logs/verifier/reward.txt` → 8 `harbor run -p ssh-key-pair -a oracle` 確認參考解拿到 reward 1 → 9（選做）用真 agent 跑 → 10（選做）`harbor view ./jobs` 看軌跡與 verifier log → 11 完成。
  - 先手動試、再寫參考解：Step 5「Before writing the automated solution, you'll want to manually verify your approach works.」Step 6「This file will be used by the Oracle agent to ensure the task is solvable.」
  - Oracle 失敗時的檢查清單（Step 8）：solve.sh 沒有執行權限、Dockerfile 少依賴、test.sh 沒寫 reward 檔、測試路徑與解法路徑不一致。
  - 真 agent 跑完要讀軌跡：「The Trajectory tab walks you through each step the agent took — invaluable when debugging why a real agent fails the task.」
  - 參考解的定位（Solution）：`solution/` 是選用的，「Recommended while authoring tasks」、「Optional for published benchmarks — omit if you do not want a public reference implementation.」沒有它 Oracle 就不能跑。
  - 多參考解防 verifier 過擬合（reward-hacking 公告）：「a single solution can also lead to overfitting」；做法是 `solve.sh` 依 `--ae SOLUTION=2` 之類的環境變數切換實作，兩個解都應拿 reward 1。
  - verifier 本身的單元測試（reward-hacking 公告）：「Verifier unit tests in particular are one of the best ways to catch a weak verifier before an agent does.」新增 `.harborignore` 讓這類開發檔留在版控但不進沙箱、不上 Hub。
  - `harbor lint`（Lint 頁）：不開沙箱的靜態檢查，預設規則含 `shared-verifier`（verifier 與 agent 共用沙箱）、`unpinned-python-dependency`、`verifier-runtime-install`、`verifier-network-download`、`agent-image-test-leak`（agent 的 Dockerfile COPY 了 tests 或 solve.sh）、compose 的 privileged／cap_add／可寫或外部 bind mount；`root-agent`、`unpinned-image` 預設關。頁尾：「Static linting complements the rubric-based `harbor check` and `harbor analyze` and does not guarantee task or verifier correctness.」
  - `harbor check` 的 11 點預設 rubric（default-rubric.toml，逐條名稱）：`behavior_in_task_description`（測試檢查的行為都寫在指示裡）、`behavior_in_tests`（指示裡的行為都有測）、`informative_test_structure`、`anti_cheating_measures`、`structured_data_schema`（結構化輸出的 schema 要寫清楚，「FAIL if only examples are given without marking them as normative」）、`pinned_dependencies`（Python 套件要鎖版、apt 不鎖）、`typos`、`tests_or_solution_in_image`、`test_deps_in_image`、`hardcoded_solution`（參考解不能直接 echo 答案）、`file_reference_mentioned`（要產生的檔名寫在指示裡）。前兩條是雙向對照：指示⊆測試、測試⊆指示。
  - `harbor analyze` 預設 rubric（analyze-rubric.toml）兩條：`reward_hacking`（讀 `agent/trajectory.json`，找改測試檔、寫 reward 檔、讀 solution/）與 `task_specification`（比對 instruction.md 與測試檔，找「exact specification mismatches」「implicit expectations」「hardcoded test expectations」），各有 PASS／FAIL／NOT_APPLICABLE。公告原文：「Reading every trajectory doesn't scale to thousands of trials.」
  - RewardKit 教學（create-a-verifier-with-rewardkit）：`tests/` 下每個子目錄是一個評分維度（例 `structure`、`correctness`），每個 .py 是一個分數；`reward.toml` 設聚合方式（`all-pass` 或加權，例 `weights = { word_count = 3.0, most_common = 2.0, pipeline = 1.0 }`），criterion 回傳 float 可給部分分；最後寫 `reward.json` 如 `{ "correctness": 1.0, "structure": 1.0, "reward": 1.0 }`。可選加 LLM 評審維度，且教學特別說明用 binary：「The criterion is binary because all-pass needs a score of 1.0, which a Likert judge rarely gives.」
- 作者自己列的限制：lint 不保證任務或 verifier 正確；不發布參考解時 Oracle 無法跑；`harbor check`／`analyze` 本身是 agent 判讀（rubric 可覆寫），文件沒給它們的準確率數字。
- 與摘要說法不一致處：
  - 指令名不一致：教學用 `harbor task init`，reward-hacking 公告寫「Tasks created with `harbor init`」，H 批引的 v0.25.0 changelog 寫 `harbor tasks init` 或 `harbor init --task`。
  - 教學與新預設可能脫節：v0.25.0 起新任務預設 separate verifier（verifier 在另一個沙箱，只拿宣告的 artifacts），但 create-a-task 教學的目錄樹沒有 `tests/Dockerfile`、`task.toml` 也沒宣告 `artifacts`，而測試直接讀 `Path.home() / ".ssh"`。如果照新預設產生任務，這份教學的測試可能讀不到 agent 產生的金鑰。文件沒說明，需實際跑 `harbor task init` 確認產生的樣板（本批沒有本機執行）。
  - 教學 Step 7 的 test.sh 在驗證時 `apt-get install curl` 並從網路裝 uv，正好觸發 lint 預設規則 `verifier-runtime-install`／`verifier-network-download`（這兩條只針對 separate verifier），以及 `harbor check` 的 `test_deps_in_image` 精神相反的情況（教學是把測試依賴放 test.sh，這點符合 rubric）。教學範例與 lint 規則之間的關係文件沒交代。
- 反證或後續修正：H 批已記 Epoch AI（TB 4.0 有 45.5% 題目有公開評分缺陷）與 Vetto（4.1 隔離後仍有測試判斷錯誤）；兩者都說明「有 oracle＋lint＋check」不等於 verifier 正確。本批沒找到針對 `harbor check` 準確率的獨立評估。
- 對系列的用途：「動手建一題」那篇的操作流程：先手動解 → 寫參考解 → 寫測試 → oracle 必須 100% → 多參考解防過擬合 → verifier 自己也要有單元測試 → 用雙向對照 rubric 審題 → 跑真 agent 讀軌跡。

---

### Demystifying evals for AI agents（Anthropic Engineering，2026-01-09）

- 網址：https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- 讀取狀態：✅
- 讀取紀錄：Exa `web_fetch_exa` 一次取回全文約 33,000 字元（未截斷，結尾含 Acknowledgements），從頭讀到尾。作者 Mikaela Grace、Jeremy Hadfield、Rodrigo Olivares、Jiri De Jonghe。
- 類型：部落格（官方工程文章）
- 研究設計或文件目的：整理 Anthropic 內部與客戶做 agent 評測的經驗，給出術語、grader 類型、各類 agent 的評法、非決定性指標，以及從零到一的 8 步路線圖。
- 會被引用的結果：
  - 術語（〈The structure of an evaluation〉）：task、trial（「Each attempt at a task is a trial」）、grader（一個 task 可多個 grader，每個含多個 assertion）、transcript（「the complete record of a trial」）、outcome（「the final state in the environment at the end of the trial」，例：說「已訂好機票」不算，要看資料庫有沒有訂位）、evaluation harness、agent harness、evaluation suite。「When we evaluate "an agent," we're evaluating the harness and the model working together.」
  - 三種 grader（表格）：code-based（字串比對、fail-to-pass／pass-to-pass 測試、靜態分析、outcome 驗證、tool call 驗證、transcript 統計；弱點「Brittle to valid variations」）、model-based（rubric、自然語言 assertion、pairwise、reference-based、多評審共識；弱點「Non-deterministic」「Requires calibration with human graders for accuracy」）、human（SME、群眾、抽查、A/B、inter-annotator agreement；用來校準模型評審）。組合方式：加權過門檻、全部必須過、或混合。
  - Capability vs regression：capability eval「should start at a low pass rate」；regression eval「should have a nearly 100% pass rate」；高通過率的 capability 題可以「graduate」成 regression。
  - pass@k vs pass^k（〈How to think about non-determinism〉）：pass@k＝k 次至少一次成功；pass^k＝k 次全成功。例：每次 75%、3 次，「(0.75)³ ≈ 42%」。「At k=1, they're identical … By k=10, they tell opposite stories: pass@k approaches 100% while pass^k falls to 0%.」選擇規則：「pass@k for tools where one success matters, pass^k for agents where consistency is essential.」
  - 起步規模（Step 0）：「20-50 simple tasks drawn from real failures is a great start」，理由是早期改動效果量大、「this large effect size means small sample sizes suffice」；成熟後要更大更難的題組才偵測得到小效果。
  - 題目來源（Step 1）：先轉手動檢查與發布前驗證；已上線就看 bug tracker 與客服佇列，「Converting user-reported failures into test cases ensures your suite reflects actual usage」。
  - 題目品質（Step 2）：「A good task is one where two domain experts would independently reach the same pass/fail verdict.」「Ambiguity in task specifications becomes noise in metrics.」Terminal-Bench 稽核例：任務沒指定檔案路徑但測試假設了路徑。「With frontier models, a 0% pass rate across many trials (i.e. 0% pass@100) is most often a signal of a broken task, not an incapable agent」；每題要有 reference solution 證明可解、證明 grader 設對。
  - 平衡（Step 3）：該做與不該做的情況都要測，「One-sided evals create one-sided optimization」；Claude.ai 網搜例：要同時測該搜（天氣）與不該搜（「who founded Apple?」）。
  - 環境隔離（Step 4）：每個 trial 從乾淨環境開始；共享狀態會造成相關失敗或灌水，「we observed Claude gaining an unfair advantage on some tasks by examining the git history from previous trials」；同一環境限制（例記憶體）造成的多次失敗「are not independent」。
  - Grader 設計（Step 5）：能用決定性就用、必要才用 LLM、人工用來驗證；不要死盯工具呼叫順序，「it's often better to grade what the agent produced, not the path it took」；多步驟任務給部分分；LLM 評審要跟人類專家校準、給它回「Unknown」的出口、每個維度用獨立的評審。
  - 評測本身的 bug 案例（Step 5）：「Opus 4.5 initially scored 42% on CORE-Bench」，修掉評分過嚴（「penalized "96.12" when expecting "96.124991…"」）、任務敘述模糊、隨機任務無法重現等問題、換較不受限的 scaffold 後「Opus 4.5's score jumped to 95%」。METR 時間跨度題要求「超過」門檻但指示寫「達到」，懲罰了照指示做的模型。
  - 讀 transcript（Step 6）：「You won't know if your graders are working well unless you read the transcripts and grades from many trials.」「Failures should seem fair」；「As a rule, we do not take eval scores at face value until someone digs into the details of the eval and reads some transcripts.」（Step 7）
  - 飽和（Step 7）：「An eval at 100% tracks regressions but provides no signal for improvement.」接近飽和時「large capability improvements appear as small increases in scores」，例 Qodo 的單次程式 eval 抓不到 Opus 4.5 在長任務上的進步。
  - 維護（Step 8）：「An eval suite is a living artifact that needs ongoing attention and clear ownership」；Anthropic 的做法是專門 evals 團隊管基礎設施、領域專家與產品團隊貢獻題目；建議 eval-driven development。
  - 自動 eval 在整體中的位置：與 production monitoring、A/B、使用者回饋、人工讀 transcript、系統化人類研究並列，用 Swiss Cheese Model 比喻；「Reserve systematic human studies for calibrating LLM graders or evaluating subjective outputs」。
  - 框架附錄：列 Harbor、Braintrust、LangSmith、Langfuse、Arize Phoenix；「they're only as good as the eval tasks you run through them」。
- 作者自己列的限制：「AI agent evaluation is still a nascent, fast-evolving field」；自動 eval「Can create false confidence if it doesn't match real usage patterns」，且需要持續維護避免漂移。
- 與摘要說法不一致處：
  - SWE-bench Verified 數字前後不一：〈Evaluating coding agents〉寫「LLMs have progressed from 40% to >80% on this eval in just one year」，〈Step 7〉寫「SWE-Bench Verified scores started at 30% this year」。兩個起點（40%／30%）與時間框（一年內／今年）不同，原文沒解釋。引用時只能各自附出處，不能合成一個數字。
  - 文中「pass@1 … succeeds at half the tasks」的定義是「on its first try」，但 pass^k 段是用單題的每次成功率說明；兩個指標一個是跨題平均、一個是單題機率，文章沒區分，教學時要補。
- 反證或後續修正：CORE-Bench 42%→95% 是 Anthropic 單方面敘述，沒找到 CORE-Bench 作者的公開回應（Exa 搜尋未命中，未深追）。METR 任務設定錯誤一事文中沒附連結。
- 對系列的用途：「從零建 eval」的流程主幹（20–50 題起步、從真實失敗取題、雙專家一致標準、參考解、平衡題組、乾淨環境、grader 選擇、讀 transcript、飽和與維護），以及 pass@k／pass^k 的選擇規則。

---

### Dynabench: Rethinking Benchmarking in NLP（2021）

- 網址：https://arxiv.org/abs/2104.14337 （讀 v1 PDF，arXiv 日期 2021-04-07；NAACL 2021）
- 讀取狀態：✅
- 讀取紀錄：PDF 15 頁，`pdftotext` 純文字 68,000 字元（1,237 行）。依序讀第 1–689 行（摘要、§1 引言、§2 背景、§3 平台／四個任務／Table 1、§4 Caveats and Objections、§5 結論與未來目標前半）與 §5 後半散落在參考文獻欄間的段落（Anyone can run a task、Multilinguality、Live model evaluation）；第 690–1237 行為參考文獻，只掃過。雙欄排版使段落交錯，已依語意重組讀過。
- 類型：研究論文（立場＋平台）
- 研究設計或文件目的：提出開源網頁平台 Dynabench，讓人類在模型即時回饋下寫出「讓目標模型答錯、但其他人類不會錯」的例子，經人工驗證後成為新一輪資料；多輪進行，每輪換上更強的模型。用 NLI、QA、情感分析、仇恨言論四個任務示範。
- 會被引用的結果：
  - 動機：「Models that achieve super-human performance on benchmark tasks … nonetheless fail on simple challenge examples and falter in real-world scenarios.」Fig. 1 顯示 MNIST、Switchboard、ImageNet、SQuAD、GLUE 等達到人類水準的時間越來越短；「GLUE saturated within a year」。
  - 核心指標：validated model error rate（vMER），「the number of human-validated model errors divided by the total number of examples」。Table 1：NLI 4 輪 170,294 例 vMER 33.24%；QA 2 輪 36,406 例 33.74%；情感 3 輪 19,975 例 35.00%；仇恨言論 4 輪 41,255 例 43.90%。作者提醒「the error rates are not necessarily comparable across tasks, since the interfaces and in-the-loop models are not identical」。
  - 為何看最壞情況：「the average case, as measured by maximum likelihood training on i.i.d. datasets, is much less interesting than the worst (i.e., adversarial) case」。
  - NLI（承接 ANLI）：在 SNLI／MNLI 可達 90%+ 的模型「cannot exceed 50% accuracy on rounds 2 and 3」。第 4 輪改用兩種架構的 ensemble 當對手，以免資料分布過度貼合單一模型。
  - 出題方式比較（情感）：給工人一句真實評論讓他改到騙過模型（prompt 條件）勝過從零寫（no prompt），改出來的句子「more linguistically diverse」。
  - 仇恨言論：雇用並訓練分析師而非群眾外包；約一半條目做「perturbations」（最小改動翻轉標籤）以找決策邊界、降低少數標註者過擬合；第 4 輪模型在外部 HateCheck 拿 94%。
  - 代價（§4 Is it expensive?）：SNLI 每例約 $0.50、MultiNLI $0.64、ANLI「closer to $1.00」（皆為作者私訊取得的數字）；「not every annotation attempt will be model-fooling and validation is required」，且隨模型變強成本上升。作者的賭注：「dynamic adversarial datasets may also last longer as benchmarks. If true, then the increased costs could turn out to be a bargain.」
  - 動態更新的比較問題：「How do we compare results if the benchmark keeps changing? This is probably the main hurdle from a community adoption standpoint.」作者類比 WMT14 與 WMT16 的 BLEU 本來就不比。
  - 舊題不要丟：「the best way to evaluate progress is to evaluate on all rounds as well as any high-quality static test set that exists, possibly with a recency-based discount factor」，類比軟體測試「it would be a bad idea to throw away old tests just because you've written some new ones」。
  - 啟動門檻：「only three things are needed: a target model, a (set of) context(s), and a pool of annotators.」
- 作者自己列的限制（§4 逐條）：會造成不自然分布與分布偏移（只用對抗資料訓練 QA 會傷原分布）；標註者可能只盯一種弱點造成循環「進步」；資料分布過度依賴目標模型（建議多架構 ensemble）；無法顧及「not-yet-in-the-loop models」（「we have no guarantees」）；生成任務難以判定是否騙過模型；對抗資料作為訓練資料不一定能泛化（引 Huang et al. 2020）；成本較高。
- 與摘要說法不一致處：逐項對過摘要（平台、人機迴圈、四個任務、回應反對意見），沒有。正文的「datasets may last longer」是作者推測，摘要沒有聲稱，正文也未給證據。
- 反證或後續修正：
  - Phang et al.（2021／2022，見補搜精讀）用 18 個對手模型實驗：對抗建構確實更難，但模型排名隨對手模型選擇而不穩定，且對手模型本身被不成比例地懲罰（ANLI R2、R3 上 RoBERTa-Large 低於機率）。直接回應 Dynabench 的「ensemble 能近似未來模型」假設。
  - Romero Diaz et al. 2022（arXiv 2206.14272，只讀搜尋摘要）指出 Dynabench QA 用的 word-overlap F1 判定「造成很多 false negatives」，即模型其實答錯卻被判為未騙過。
- 對系列的用途：「動態更新 benchmark」那篇：人機迴圈出題的流程與 vMER、成本數字、舊輪次不能丟的原則，以及為何換版後分數不可比。

---

### Holistic Evaluation of Language Models（HELM，2022；TMLR 2023）

- 網址：https://arxiv.org/abs/2211.09110 （讀 v2 PDF，2023-10-01，TMLR 08/2023 版）
- 讀取狀態：✅（指定範圍）／全文 partial（brief 已允許只讀指定章節）
- 讀取紀錄：PDF 162 頁，`pdftotext` 純文字 663,181 字元（13,395 行）。依序讀：第 1–1560 行（摘要、§1 Introduction 含 1.1 HELM、1.2 Empirical findings 全 25 條、1.3 Contributions）；第 1564–1860 行為目錄，略過；第 2003–2945 行（§2 Preliminaries、§3 Core scenarios 全部：taxonomy、selection、QA、IR、摘要、情感、毒性、雜項分類）；第 2946–4038 行（§4 General metrics 全部：taxonomy、selection、4.3 accuracy、4.4 calibration、4.5 robustness、4.6 fairness、4.7 bias、4.8 toxicity、4.9 efficiency）；第 7947–8330 行（§10 What is missing、§11 Limitations and future work、§12 Conclusion、Reflexivity）。未讀：§5 targeted evaluations、§6 models、§7 adaptation、§8 experiments、§9 related work、全部附錄（約 7,000 行）。圖表文字（大量 ✔ 與 URL 參數）以長度過濾後略過，表格說明文字有讀。
- 類型：研究論文
- 研究設計或文件目的：先由上而下列出評測設計空間（情境 scenarios × 指標 metrics），再從中有意識地挑子集實作；在 16 個核心情境上量 7 類指標，另加 7 項針對性評測（26 個情境），用統一的 5-shot prompting 評 30 個模型。
- 會被引用的結果：
  - 三要素（§1）：「1. Broad coverage and recognition of incompleteness. 2. Multi-metric measurement. 3. Standardization.」
  - 先列分類法、再挑：「holistic evaluation should provide a top-down taxonomy and make explicit all the major scenarios and metrics that are missing.」「The taxonomy not only facilitates the systematic selection of scenarios and metrics, but it also make explicit what is missing.」對照 Fig. 2：以往 benchmark 是資料集集合，各自帶一個標準指標（通常是 accuracy）。
  - 情境＝(task, domain, language)，domain 再拆 what（文類）、who（誰寫／寫誰）、when（時期）（§3.1, Fig. 8）。任務清單取自 ACL 2022 tracks（Table 1），作者承認「there is some subjectivity in choosing what is "canonical"」。選擇原則：「(i) coverage of the space, (ii) minimality of the set of selected scenarios, and (iii) prioritizing scenarios that correspond to user-facing tasks」，外加可行性。
  - 評測三個原語（§2）：scenario（instances，每筆有 input 與 references）、adaptation（例：prompting）、metric；一次 run＝(scenario, adaptation, metric)。模型被當成黑盒（只給 prompt、拿 completion 與 log prob）。
  - 為何要多指標（§1.1）：「we believe it is integral that all of these metrics be evaluated in the same contexts where we expect to deploy models」，避免其他指標成為 accuracy 的二等公民。指標的選法（§4.1–4.2）：從各 AI 會議 call for papers 彙整 desiderata（Table 2），再依量測所需條件分類（Table 3），只挑「(i) no assumptions on the construction or structure of the model, (ii) no access beyond blackbox access, and (iii) no assumptions on the broader system/context」的，得到 accuracy、calibration、robustness、fairness、bias、toxicity、inference efficiency。
  - 覆蓋率：112 個（核心情境, 指標）組合量了 98 個（87.5%，Table 4）；缺的 14 個多半是定義不成立（不生成就沒有毒性），其餘是「we are concerned about the validity of the measurement」。以往每個模型平均只在 17.9% 的核心情境上被評過，HELM 提到 96.0%。
  - 指標定義（§4）：
    - Accuracy 是統稱：分類用 exact match、QA 用 F1、IR 用 MRR／NDCG、摘要用 ROUGE；「minority subpopulations could experience low accuracy despite a high average accuracy.」
    - Calibration：ECE，10 bins；另報 selective classification（只答最有把握的 C 比例，C=0.1 的準確率與 coverage-accuracy 曲線下面積）。
    - Robustness：對一個 instance 的多個變換取「worst-case performance」；invariance（打字錯誤、大小寫等語意不變擾動）與 equivariance（Contrast Sets，語意改變、答案應跟著變），只在分類、QA、IR 量。
    - Fairness：counterfactual（替換族群相關詞或方言）與 performance disparities（有族群 metadata 的資料集比較子群準確率）。
    - Bias：定義為「a systematic asymmetry in language choice」，量生成文本中族群提及比例與刻板關聯偏離均勻分布的程度；與 fairness 區分：fairness 看任務準確率差異，bias 看生成文本本身。
    - Toxicity：用 Perspective API，理由是它「has been strenuously analyzed and its limitations are well-acknowledged」。
    - Efficiency：訓練用 kWh 與 CO2；推論報 denoised runtime（扣掉排隊雜訊）與 idealized runtime（統一 A100＋Megatron 的理想硬體）。
  - 規模（§1）：4,939 runs、12,169,227,491 tokens、17,431,479 queries、商用 API $38,001、開放模型約 19,500 GPU 小時。
  - 與「自己建 benchmark」相關的發現（§1.2）：
    - 第 22 條：「All models show significant sensitivity to the formatting of prompt, the particular choice of in-context examples, and the number of in-context examples across all scenarios and for all metrics」；先前文獻同一 (model, scenario) 因 prompt 細節不同「30% to 80%」。
    - 第 23 條：OPT (175B) 在 HellaSwag 用「每個選項分開 0-shot」得 79.1%，改成「選項一起放進 5-shot 選擇題」掉到 30.2%；「This poses a fundamental challenge for what it means to standardize language model evaluation in a fair way」。
    - 第 10 條：CNN/DailyMail、XSUM 的自動指標「largely fail to discriminate differences we observed in model quality.」
    - 第 4 條：robustness 擾動下 TNLG v2 在 NarrativeQA 從 72.6% 掉到 38.9%。
- 作者自己列的限制（§10–11）：
  - 結果的實用性：「practitioners should first identify scenarios and metrics pertinent to their use conditions」。
  - 污染：「it is difficult to directly determine if they are contaminated」，已知證據放 Appendix G。
  - 依賴 adaptation：換 fine-tuning 或最佳化 prompt 不一定得到相同趨勢；解碼超參數敏感度沒研究。
  - 效度與信度：沒有統一標準保證資料集有效，引 Strathern's Law「When a measure becomes a target, it ceases to be a good measure」；「we only run 3 random seeds (due to cost) for selecting in-context examples and we evaluate on 1000 instances instead of the full validation/test set … may render some of our claims statistically insignificant」。
  - 聚合：分數矩陣無法給全序，「We do not believe there exists a universal aggregation that satisfies all preferences」，但承認單一數字「though reductive, are useful practical tools」。
  - 指標本身：bias 量測「the validity of our measures has largely not been verified」；Perspective API「in spite of its established flaws」。
  - 缺漏：只有英文；缺醫療、金融、教育、客服等領域；缺對話等互動任務；缺部分無法取用的模型（PaLM、Gopher 等）。
  - Reflexivity：承認重要 benchmark 多出自高資源機構，設計 benchmark 即擁有權力。
- 與摘要說法不一致處：
  - 摘要強調「standardized conditions」讓模型可直接比較，但正文第 23 條與 §11 承認同一情境下「the adaptation method that maximizes accuracy can differ … across models」，統一 prompt 本身就可能對某些模型不公平。摘要沒提這個張力。
  - 其餘逐項對過（30 個模型、§1.3「10 are open, 17 are limited-access, and 3 are closed」、16＋26 共 42 個情境、87.5%、17.9%→96.0%），一致。
- 反證或後續修正：
  - CRFM 官方〈HELM Capabilities〉（2025-03-20，https://crfm.stanford.edu/2025/03/20/helm-capabilities.html ，Exa 全文讀過）：只用 5 個能力情境（MMLU-Pro、GPQA、IFEval、WildBench、Omni-MATH）、22 個模型；頂層排名從 mean win rate 改成 mean score，理由「the mean win rate is 1) dependent on the set of models being compared, and 2) sensitive to small variations in scenario scores that invert ranks.」實作上碰到的問題：LLM 評審輸出格式錯造成漏標與假陰性（改用三個評審取平均）、GPQA 官方答案抽取 regex 抓不到多種合法格式（改 regex）、Omni-MATH 官方評審 prompt 在長輸出時誘發評審幻覺（改用 HELM Safety 的評審 prompt，依據是對 canary 結果的人工評估）。同一頁也發現 MMLU-Pro 分數「often vary significantly across sources」（例：Qwen2.5 72B 在 HELM 0.553、官方榜 0.7159、自報 0.581）。
  - 小瑕疵：該頁模型清單寫 GPT-4o (2024-08-06)，排名表卻列 GPT-4o (2024-11-20)，沒說明。
  - Gilda & Gilda 2026（GEM，doi 10.18653/v1/2026.gem-main.80，只讀搜尋摘要）：在 HELM Lite v1.13.0 上，mean 與另一種聚合法的前 5 名「completely disjoint」，說明聚合方式本身決定排名。
  - 2025-07 arXiv 2507.00460（只讀搜尋摘要）：在 HELM Lite 公開測試集上微調的小模型（BART-base）在 MMLU 情境拿 89.71%、其他情境 <3%，說明公開題目可被直接刷榜。
- 對系列的用途：「設計 benchmark 先畫設計空間」那篇：情境 × 指標的分類法、先列全集再挑子集並寫明缺漏、為何同一情境要量多個指標、以及 prompt／選擇題格式的敏感度證據；HELM Capabilities 的改版則是「聚合方式要選、選了要說理由」的實例。

---

### Your AI Product Needs Evals（Hamel Husain，2024-03-29）

- 網址：https://hamel.dev/blog/posts/evals/
- 讀取狀態：✅
- 讀取紀錄：Exa `web_fetch_exa` 取回全文約 19,000 字元，含腳註，從頭讀到尾（截圖只有說明文字，圖本身未讀）。
- 類型：部落格（實務者一手經驗）
- 研究設計或文件目的：用 Rechat 的房仲助理 Lucy 為案例，說明產品團隊怎麼從零建私有 eval：三層評測、測資生成、trace 檢視工具、LLM 評審與人對齊。
- 會被引用的結果：
  - 背景問題：prompt engineering 進展到平台期後，「Addressing one failure mode led to the emergence of others, resembling a game of whack-a-mole.」
  - 三層：Level 1 unit tests（assertion，每次改 code 都跑）、Level 2 model & human eval（固定節奏）、Level 3 A/B testing（重大改版後）；「The cost of Level 3 > Level 2 > Level 1.」
  - Level 1 寫法：把 LLM 功能拆成 feature × scenario，每個 scenario 有對應 assertion（例：listing finder 的「只有一筆／多筆／零筆」三種情況）；另有跨功能的通用檢查（例：用 regex 確認回應沒外露 UUID）。「Rechat has hundreds of these unit tests.」
  - 測資：用 LLM 合成輸入（附生成 prompt 範例：50 個建立聯絡人指令＋對應查詢指令），「You don't need to wait for production data to test your system.」
  - 通過率不必 100%：「unlike traditional unit tests, you don't necessarily need a 100% pass rate. Your pass rate is a product decision, depending on the failures you are willing to tolerate.」
  - 看資料：「You must remove all friction from the process of looking at data」；自建領域專用的 trace 檢視工具（標明哪個 feature／scenario、是合成還是真實輸入），用 Shiny 等工具「in less than a day」。
  - 標註先用二元：「I've found that assigning scores or more granular ratings is more onerous to manage than binary ratings.」
  - 看多少：起步時讀所有測試案例與使用者產生的 trace；腳註「keep reading logs until you feel like you aren't learning anything new.」
  - LLM 評審對齊：每次給人類評審 25–50 筆，讓他填自己的 critique、good/bad、理想答案，對照 LLM 評審的 critique 與判定，反覆改評審 prompt；「Model-based evaluation is a meta-problem within your larger problem. You must maintain a mini-evaluation system to track its quality.」
  - 指標警告：本例用原始一致率是因為資料約一半是失敗，「using raw agreement is generally not recommended and can be misleading when classes are imbalanced. Instead, you should typically measure precision and recall separately」。
  - 結論清單：「Don't rely on generic evaluation frameworks to measure the quality of your AI. Instead, create an evaluation system specific to your problem.」
- 作者自己列的限制：流程圖「is a best-faith effort … In reality, the process is non-linear」；RAG 評測不在範圍內；A/B 只適合成熟產品。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：Shankar et al. 2024（下方補搜）以使用者研究支持「評分準則要在看過輸出後才定得下來」，與 Hamel「先看大量 trace 再寫 assertion」一致；同一研究也指出評審對齊受人自身標準漂移影響，等於補充了 Hamel 對齊流程的限制。作者後續與 Shreya Shankar 開設課程，本篇是 2024 早期版本，之後的 FAQ 類文章本批未讀。
- 對系列的用途：私有 eval 的起手式：功能 × 情境拆題、合成測資、二元標註、自建檢視工具、評審與人對齊時看 precision／recall 而非一致率。

---

## 補搜精讀（2 篇）

### Adversarially Constructed Evaluation Sets Are More Challenging, but May Not Be Fair（Phang, Chen, Huang, Bowman；arXiv 2021／DADC Workshop 2022）

- 網址：https://arxiv.org/abs/2111.08181 （讀 v1 PDF）；ACL Anthology 版 https://aclanthology.org/2022.dadc-1.8.pdf （只讀到 Exa 回傳的摘要頁）
- 讀取狀態：✅（arXiv v1）
- 讀取紀錄：PDF 17 頁，純文字 75,661 字元（2,596 行）。依序讀第 1–1551 行（摘要、§1–§8 全部，含 Algorithm 1、§5 AFLite 結果、§5.2 排名、§5.3 標註一致度、§6 model-in-the-loop、§7 限制與討論、§8 結論）；第 1552 行起為參考文獻與附錄表格，只掃過。Fig. 3 排名圖的模型縮寫長串略過。
- 類型：研究論文
- 研究設計或文件目的：檢驗兩種對抗式建題法對「評測集」的影響：(1) 用 AFLite 從現有驗證集濾掉容易題，換 18 個預訓練模型當對手；(2) 分析現成的人機迴圈資料集 ANLI 與 AdversarialQA。任務：MNLI、SNLI、Cosmos QA、SocialIQA。
- 會被引用的結果：
  - 確實變難：MNLI 未濾時多數模型 80–90%，用 DeBERTa-v3-Large 當對手濾完後「no model scoring better than 45%」。
  - 排名不穩：「the order of model performance is generally not consistent across adversary models」；最強對手濾完後 MNLI／SNLI 所有模型擠在 35%–45%，「a small variation in the number of correctly predicted examples can lead to a large change in model rank.」
  - 對手模型被懲罰：用同一個預訓練模型當對手時，該模型排名在所有非最弱模型上都下降、「There is no case where the rank improves」。ANLI R2、R3 上對手 RoBERTa-Large「markedly below chance」。
  - 偏向爭議題：越強的對手越會選出標註者一致度低的題目，「model comparisons hinge on the most contentiously labeled examples」。
- 作者自己列的限制：模型多為 encoder-only（45M–1.5B），沒有 T5、GPT-3；現成的人機迴圈資料集只有兩個，「we are unable to draw strong conclusions about the efficacy of adversarial data collection for evaluation data」；沒分析對抗例的內容性質。
- 與摘要說法不一致處：arXiv v1 摘要說研究「two common approaches」，ACL DADC 2022 版摘要改為三種（多了 TextFooler 擾動），兩版內容範圍不同；本紀錄只依 v1 正文。v1 的摘要與正文逐項對過，沒有不一致。
- 反證或後續修正：ADVSCORE（NAACL 2025，https://aclanthology.org/2025.naacl-long.27.pdf ，只讀搜尋摘要）提出以人類表現為基準衡量資料集「是否真的對抗」，屬同一方向的後續。沒找到推翻本文結論的研究。
- 對系列的用途：Dynabench 那篇的反方：對抗出題讓題目變難，但「難」不等於「能公平比較」；建議用多種模型驗證、不要用對手模型自己衡量難度。

### Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences（Shankar et al.，arXiv 2024-04；UIST 2024）

- 網址：https://arxiv.org/abs/2404.12272 （讀 v1 PDF）；ACM 版 https://dl.acm.org/doi/10.1145/3654777.3676450
- 讀取狀態：✅
- 讀取紀錄：PDF 16 頁，純文字 95,719 字元。依序讀摘要、§1–§8（設計、實作、§5 離線評估與 Table 1、§6 使用者研究方法、§7 發現、§8 討論、Future Work and Limitations）至第 1274 行；第 1275 行起為參考文獻與附錄 A（演算法定義）、B（prompt），附錄只掃過。
- 類型：研究論文（HCI，系統＋質性研究）
- 研究設計或文件目的：做一個 EvalGen 介面（嵌在 ChainForge）：LLM 提評分準則 → 使用者修改 → LLM 為每條準則產生多個候選 assertion（Python 或評審 prompt）→ 使用者邊等邊給 thumbs up/down → 依一致度挑最對齊的 assertion。離線比較 EvalGen 與全自動的 SPADE，並找 9 位業界實務者做 think-aloud 研究。
- 會被引用的結果：
  - Table 1（兩條真實管線，作者兩人人工標全部輸出當基準：醫療 84 筆、68% 為好；商品描述 100 筆、51% 為好；EvalGen 只用 16 筆標註）：醫療管線 EvalGen 3 個 assertion、SPADE 5 個，coverage 皆 0.33、false failure rate 皆 0.10；商品管線 EvalGen 4 個、SPADE 9 個，coverage 0.73 對 0.49，FFR 皆 0.39。原文：「in the product pipeline, EvalGen produced an assertion set less than half the size of SPADE's and increased coverage from 49% to 73%.」
  - FFR 門檻：原設 10%，商品管線 SPADE 找不到可行組合，「required adjusting the false failure rate to 40%」。
  - criteria drift：「users need criteria to grade outputs, but grading outputs helps users define criteria.」兩型：看到新型壞輸出就想加準則；看越多就重新詮釋舊準則（例：「全部都是專有名詞」放寬成「大部分是」）。作者推論：「it is impossible to completely determine evaluation criteria prior to human judging of LLM outputs.」
  - 先標再定準則較好：先標註的兩位受試者覺得有用；沒先標的 P2：「you should enforce that we all look at at least 20 examples first.」
  - 一致性陷阱：P8 兩次給壞評「not because they believed the output was bad, but because they wanted to be consistent with previous grades」。
  - 程式 vs LLM assertion：格式、計數、含／不含字串偏好程式；「fuzzy」準則用 LLM；LLM assertion「are harder for them to trust」。
  - 自評尺度：Table 2「I felt like the assertions aligned with my grades」1–7 分，「Responses were mixed」。
- 作者自己列的限制：離線評估只有兩條管線；質性研究樣本小、受試者都是有部署經驗的工程師；時間不足以多次迭代；沒涵蓋部署階段。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：Guerdan et al. 2025（arXiv 2503.05965，只讀摘要）指出強迫單選的人類標註會讓評審驗證選出較差的評審，「performing as much as 31% worse」；Elangovan 2025（arXiv 2410.03775，只讀摘要）指出人類標籤不確定性高時，用相關係數驗證評審會高估評審品質。兩者都補強「驗證評審本身就難」，沒有推翻本文。
- 對系列的用途：「驗證你的 grader」那篇：評分準則無法事先定死、要先看輸出；評審驗證用 coverage（抓得到壞輸出）與 false failure rate（不誤殺好輸出）兩個量，而不是單一一致率。

---

## 補搜紀錄

- 工具：jina `search_web` 本批回 `This key is out of quota`，改用 Exa `web_search_exa`（3 輪）。
- 查詢 1（反證／Dynabench）：「paper showing adversarially collected human-and-model-in-the-loop evaluation sets are harder but may unfairly penalize models, criticism of dynamic adversarial benchmarking」。找到：Phang et al. 2021／2022（收，精讀）；Romero Diaz et al. 2022 arXiv 2206.14272（Dynabench F1 判定造成假陰性，只用摘要，不收精讀：是單一資料蒐集經驗報告）；ADVSCORE NAACL 2025（不收：是新指標提案，不改變 Dynabench 結論）；Squid Game arXiv 2511.10691（不收：遊戲式評測，離題）；arXiv 2412.03597（不收：泛論）。
- 查詢 2（2024 後更新／評審驗證）：「2024 2025 research on validating LLM-as-judge evaluators against human labels, criteria drift, eval assertion alignment」。找到：Shankar et al. 2024（收，精讀：直接支撐「驗證 grader」流程，且被 Hamel、Anthropic 兩篇的建議呼應）；Guerdan et al. 2025、Elangovan 2025、arXiv 2506.13639（LLM-as-judge 設計選擇實證）、AAAI 2025 Murugadoss et al.（只用摘要，不收：屬 judge 可靠度專題，C 批或專篇再讀較合適）。
- 查詢 3（2024 後更新／HELM 批評）：「criticism or update of HELM holistic evaluation of language models, HELM Capabilities 2025, problems with multi-metric leaderboards」。找到：CRFM〈HELM Capabilities〉官方頁（全文讀過，併入 HELM 條目「後續修正」，不另立條目：是官方改版說明而非研究論文）；Gilda & Gilda 2026 GEM（聚合法改變前 5 名，只讀摘要）；arXiv 2507.00460（HELM Lite 可被刷榜，只讀摘要）；一篇第三方整理頁（the-nightly-build-example.github.io，引用 IBM Research「a benchmark leader may change by merely removing a low-ranked model」，非一手，不收）。
- 沒有另外補搜的：Inspect、Harbor 屬持續更新的官方文件，以讀取日期為準；Anthropic 文章的 CORE-Bench 數字在 Exa 搜尋中沒找到 CORE-Bench 作者回應，未再深追。

## 本批最重要的發現（給寫稿用）

1. 三份工程來源（Inspect、Harbor、Anthropic）對 eval 結構的拆法一致：題目（input＋target 或測試）、受測系統（solver／agent＋harness）、評分（scorer／verifier／grader）、隔離環境、完整紀錄。差別在 Harbor 把「參考解必須拿滿分」做成固定步驟（oracle）。
2. 「評測本身會壞」有具體數字：Anthropic 的 CORE-Bench 從 42% 修到 95%、0% pass@100 多半是題目壞；Inspect 文件顯示同一批結果因分母規則不同可算出 0.5 或 0.33；HELM 顯示同模型同資料只改選擇題呈現方式就從 79.1% 掉到 30.2%。
3. 驗證 grader 的方法：讀 transcript（Anthropic、Harbor analyze）、多參考解防 verifier 過擬合、verifier 自己寫單元測試（Harbor）、LLM 評審對人類標註看 precision／recall 或 coverage／false failure rate（Hamel、Shankar），且評分準則要先看過輸出才定得下來（criteria drift）。
4. 動態／對抗式出題（Dynabench）能延緩飽和，但代價是每題成本約倍增、分數跨版不可比，且 Phang et al. 顯示排名會隨對手模型選擇而變、對手模型被不成比例懲罰。
5. 多指標設計的取捨（HELM）：先列全集再挑子集、寫明缺漏；但多指標要排名就得選聚合法，HELM 自己在 2025 把 mean win rate 換成 mean score，理由是前者會隨比較對象改變。
