# 批次 H-coding-terminal：coding 與終端機 benchmark

精讀日期：2026-11-23。論文一律用 `curl -sL https://arxiv.org/html/<id>` 存 scratchpad，去標籤成純文字後依字元區段讀；Exa `web_fetch_exa` 用在 Terminal-Bench 論文第一輪（maxCharacters 200000 在 200,177 字元處截斷，改用 curl 全文）、tbench.ai 新聞稿、OpenAI 兩篇文章；Harbor 文件用官方 `.md` 端點（`docs.harborframework.com/<path>.md`）curl。jina／WebFetch 本批沒用到（前兩個工具已拿到全文）。

---

## 0. 站上既有兩篇的對照（先讀）

讀了 `src/content/posts/ai/2026-08-26-coding-benchmarks-how-to-read.md`（9,906 bytes，全文）與 `src/content/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench.md`（15,918 bytes，全文）。

### 〈2026 Coding Benchmark 怎麼讀〉（2026-08-26）

| 文中說法 | 判定 | 依據 |
|---|---|---|
| SWE-bench 原版 2,294 題、12 個 Python repo | ✅ 已寫且正確 | OpenAI Verified 文、SWE-Bench+ 摘要 |
| Verified：OpenAI 請 93 位工程師審核、篩出 500 題 | ✅ 正確，但少了關鍵數字 | Verified 文：93 位 Python 開發者標 1,699 題、每題 3 人、刪掉 68.3% |
| Verified 被放棄「因為 500 題太少、統計效力不足，而且只有 Python」 | ⚠ 理由需核對 | A 批讀了 OpenAI〈Why we no longer evaluate SWE-bench Verified〉，該文的主因是設計缺陷與污染；這裡轉引的是 CodingFleet 二手文，應改引一手並對齊 A 批 |
| SWE-bench Pro：「1,865 個 task、41 個 repo、123 種語言」 | ❌ 錯誤 | Pro 論文 §7.1：語言只有 Python、JavaScript、TypeScript、Go；「123 種語言」沒有出處 |
| 「DeepSWE 的稽核發現 Pro 有 32% 的驗證器判斷有誤」 | ⚠ 措辭要改 | DeepSWE 論文的數字是「LLM 評審和 Pro 驗證器意見不一致 32.4%」（67 偽陽、189 偽陰，n=789），作者自己說不是 ground truth；另有 OpenAI 2026-07-08 稽核（~30% 題目壞掉）可當更強的一手來源 |
| 「Pro 才是未來」 | ❌ 已過時 | OpenAI 2026-07-08 撤回推薦 Pro；Epoch 2026-09-01 判 Pro 為 Flawed；Scale 2026-09-22 出 Pro V2（642 題） |
| Terminal-Bench 2.1 修 2.0 的 89 題中 28 題，Claude Code＋Opus 4.6 跳 12.1% | ✅ 正確，單位要改 | 2.1 公告：58.0% → 70.1%，是 12.1 個百分點，不是 12.1% |
| 讀者該看「Terminal-Bench 2.1」 | ❌ 已過時 | 之後有 3.0（2026-07-30）、4.0（2026-08-28）、4.1（2026-11-09）；版本號改成語意化版本，4.0 不是續作而是「破壞性更新」 |
| 「harness 很重要，有些模型差 10–20 分」 | ✅ 有一手支撐 | 2.1 論文 §6.3：GPT 5.4 在 Codex 與 Terminus-2 之間差約 20 pp；但延長時間後大半消失（見下） |
| Artificial Analysis 統一用 Terminus 2、跑 3 次取平均 | 未在本批查核 | — |

### 〈CS329Z 第 10 堂 Terminal-Bench〉（2026-09-10，updated 2026-10-29）

| 文中說法 | 判定 | 依據 |
|---|---|---|
| 任務 = 指令＋Docker 環境＋測試＋參考解法＋時間限制；依容器終態評分，不看命令或輸出 | ✅ 正確（對 2.0 而言） | TB 論文 §2.1 |
| 「結束後由測試讀容器狀態判定」 | ⚠ 對 3.0 之後已不完整 | TB 3.0 起 agent 容器和 verifier 容器分開，只把宣告的 artifact 搬過去；Harbor v0.25.0（2026-10-25）起新任務預設 separate verifier |
| Harbor 任務目錄（instruction.md、task.toml、environment/Dockerfile、solution/solve.sh、tests/test.sh） | ✅ 與官方文件一致 | Harbor docs Tasks/Overview；新任務另有 `tests/Dockerfile`（verifier 專用映像） |
| 投影片 p.61 三段式版本號（主版重跑、次版重評、修訂沿用） | ✅ 與官方一致 | tbench.ai〈Continuous Benchmarks〉、Harbor〈Cracking down on reward hacking〉 |
| 投影片 p.36「累計超過 700 萬次 benchmark 執行」 | 未查核（只在投影片） | — |
| 沒提到的新事實 | 可補 | 排行榜誠信規定（2026-04-19）、2.1 論文的「時間預算決定 harness 差距」、TB 4.0 Epoch 判 Flawed（30/66 題有公開記錄的評分缺陷） |

---

## 1. 指定來源

### Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces（2026）
- 網址：https://arxiv.org/html/2601.11868 （arXiv 只有 v1，2026-01-17）
- 讀取狀態：✅
- 讀取紀錄：HTML 去標籤後 262,291 字元。0–2,100 目錄；2,100–92,414 是作者與機構清單（約 80 位作者、44 個機構，抽樣確認後略讀）；92,414–120,257 正文（摘要到 §7）逐段讀；120,257–144,437 參考文獻（略）；144,437–262,291 附錄 A–I 依序讀（附錄 E.2 命令失敗分類清單與附錄 H 後段任務描述是條列，逐條掃過；附錄 H 用程式數出 89 題與難度分布）。數學式在 curl 版被剝掉的三處（難度門檻、命令錯誤率區間）用 Exa 版補回。
- 類型：研究論文
- 研究設計或文件目的：發表 Terminal-Bench 框架與 2.0 資料集（89 題），量前沿 agent 在終端機長程任務的完成率，並做軌跡層級與命令層級的錯誤分析。6 個 agent（Claude Code、Codex CLI、Gemini CLI、OpenHands、Mini-SWE-Agent、Terminus 2）× 16 個前沿模型，每個組合至少跑 5 次，共 32,155 次 trial。
- 會被引用的結果：
  - 任務格式（§2.1）：instruction、Docker image、tests、example solution、time limit。「The tests verify that all outcomes described in the instruction have been achieved by testing properties of the final container state; they do not test the agent's commands or console output.」
  - 任務收集（§2.2）：93 位貢獻者寫了 229 題，依作者難度評估與 3 位審稿人的品質評估選出 89 題。「we crowd-sourced tasks through open-source contributions, with 93 contributors creating 229 tasks.」
  - 驗證三標準（§2.3）：Specificity（測試通過若且唯若容器處於可接受狀態）、Solvability（有 oracle 解法）、Integrity（不能走真實部署中不存在的捷徑，例如把 git 未來 commit 刪掉）。每題平均約 3 小時審稿時間：「the average task received approximately three hours of combined reviewer attention」。
  - 審核流程七步（§2.3）：CI 跑 oracle、no-op agent 必須失敗、貢獻者 checklist、LLM 檢查工具、多模型＋Terminus 2 試跑並判斷失敗原因、adversarial exploit agent、最後兩位稽核員決定收錄。
  - 難度（表 1，作者估計）：專家 <1 小時 48.6%、1 小時–1 天 47.3%；初級工程師 1 小時–1 天 71.6%。最難的 fix-ocaml-gc：專家約 24 小時、初級 240 小時。
  - 主結果（§4、表 2）：最高是 Codex CLI＋GPT-5.2 62.9% ± 3.0%，其次 Terminus 2＋Claude Opus 4.5 57.8%、Terminus 2＋Gemini 3 Pro 56.9%；開源最佳 Terminus 2＋Kimi K2 Thinking 35.7%。「frontier models and agents score less than 65% on the benchmark」。
  - harness vs 模型（§4）：Codex CLI 換 GPT-5.2 比 GPT-5-Nano 高 52 個百分點；Gemini 2.5 Pro 用 Terminus 2 比 OpenHands 高 17 個百分點。「implying that model selection is usually more important than agent scaffold when optimizing for performance.」
  - 同模型不同 harness 的例子（表 2）：Claude Opus 4.5 在 Terminus 2 57.8%、Claude Code 52.1%、OpenHands 51.9%；GPT-5.2 在 Codex CLI 62.9%、Terminus 2 54.0%。Claude Code＋Opus 4.5 用了 256.9M input tokens，Terminus 2 只用 3.9M。
  - Terminus 2 的定位（§3.1、附錄 F）：只有一個 headless terminal 工具、只下 bash，當作「neutral testbed for comparing model performance」；有 context summarization。
  - 成本與時間（§4.1）：跑一次 2.0 約 1–100 美元；多數 trial 不到 20 分鐘，極端情況 2 小時、近 1 億 token。輪數與成功率幾乎無相關（r=-0.028, p=0.916，附錄 G.1），輸出 token 與成功率弱負相關（r=-0.170, p=0.515）。
  - 飽和預告（§4.2）：Gemini 2.5 Pro 到 GPT-5.2 的八個月內 SOTA 幾乎翻倍。「Terminal-Bench 2.0 may become saturated within the next year.」
  - 人估難度 vs 實測難度（§4.3）：r=0.436；人評 hard 的 93.3% 實測也 hard；人評 medium 但模型覺得 hard 的占 54.5%（例：XSS filter 繞過、Core War 策略）。實測難度門檻：Terminus 2 跨前沿模型通過率 ≥66.7% 為 Easy、<33.3% 為 Hard。
  - 軌跡錯誤（§4.4）：改自 MAST 的三大類 Execution／Coherence／Verification；GPT-5 judge 和 120 條人工標註一致 90%。Opus 4.5、GPT-5.2 以 Execution 錯誤為主。
  - 命令錯誤（§4.5）：命令失敗率 9.2%（Grok 4）到 26.7%（GPT-OSS-120B）；最常見是指令不在 PATH（24.1%）。
  - Adapter（附錄 D）：同格式收了 26 個外部 benchmark（SWE-Bench Verified、Aider Polyglot、MLE-Bench、Cybench 等），整合前要做 parity 實驗。
  - ABC 自評（附錄 B.5）：Outcome Validity 0.857、Task Validity 1.000、Reporting 0.830，平均 0.896，排 ABC 榜第 2。扣分項：沒有私有測試集（canary string「largely a symbolic safeguard」）、仍有 flaky test、沒量化缺陷對分數的影響。
  - adversarial exploit agent 的 prompt（附錄 B.4）：「If you can complete a task normally without cheating, DO NOT do it.」常見 exploit：monkey-patch 測試環境、猜答案、列舉所有可能答案。
- 作者自己列的限制（§5）：允許上網，理論上 agent 可查到 oracle（「In practice, we have not observed this behavior in tens of thousands of agent trajectories」）；公開 repo 會被拿去訓練，私有測試集「outside the scope of this paper」；外部依賴與機器資源差異會讓環境不一致；群眾外包的題目仍可能不合驗證標準。
- 與摘要說法不一致處：
  - 摘要與 §1 都說 89 題，但表 1 的百分比加總只有 74 題（36+35+3+0），表 2 註腳寫「Token counts are for running all 74 tasks」。論文沒解釋 74 從哪來（推測：有 15 題缺時間估計或某階段的子集，未證實）。
  - §4.3 說作者難度標籤是「medium or hard」，但附錄 H 實際標了 4 題 Easy、55 Medium、30 Hard。
  - §3 說「16 frontier models」，§3.3 列出 22 個模型名。
  - §4「Codex CLI resolution rate increases by 52%」是百分點差（62.9 vs 11.5≈51.4），不是相對 52%。
- 反證或後續修正：
  - 2.1 論文（Buchanan et al., arXiv 2611.08417，本批補讀）：2.0 有 28 題（約 30%）有缺陷，修完後頂尖分數升 10 pp 以上；論文 §5 自承「may still have flaws」被實證。
  - Berkeley RDI（D 批）：89/89 題可用 binary wrapper 灌到 100%，對應本文 Integrity 標準在驗證階段沒守住。
  - 2026-04-19 排行榜誠信公告：實際出現作弊（OB-1 把解答加密放進 binary、Pilot 上傳 tests/）與 reward hacking（ForgeCode agent 從網路 curl 解答）。本文 §5「we have not observed this behavior」在排行榜上被推翻。
- 對系列的用途：Terminal-Bench 專文的主幹：任務四件套、三條驗證標準、Terminus 2 中立 harness 的設計理由、「選模型比選 harness 重要」這個主張（再用 2.1 論文的時間預算結果修正它）。

---

### Terminal-Bench 2.1 公告（tbench.ai，2026-05-06）
- 網址：https://www.tbench.ai/news/terminal-bench-2-1
- 讀取狀態：✅（全文約 3,000 字元，Exa 一次讀完；日期取自 https://www.tbench.ai/news 列表）
- 類型：官方文件（公告）
- 研究設計或文件目的：發布 2.1，修 2.0 的 28 題，比較代表性 agent-模型組合在 2.0／2.1 的分數。
- 會被引用的結果：
  - 「We're releasing Terminal-Bench 2.1 to fix issues in 28 of the 89 tasks in Terminal-Bench 2.0.」
  - 三類問題：外部依賴變動 9 題、資源配置不足 8 題（oracle 或前沿模型解法跑不完）、指令與測試不一致（例：query-optimize 指令要 PostgreSQL、測試卻期待 Spark SQL）。
  - 分數變化（圖表）：Opus 4.6（Claude Code）58.0 → 70.1（+12.1，最大）；GPT-5.3-Codex（Codex CLI）73.3 → 79.1；GPT-5.4（Codex CLI）76.0 → 77.3；GPT-5.4（Terminus 2）-0.2；GPT-5.4 mini（Terminus 2）-0.9。
  - 「After these changes, no task is unsolved in Terminal-Bench 2.1.」
  - 單題變化最大：polyglot-c-py +84.3、polyglot-rust-c +74.3、caffe-cifar-10 +64.3。
  - Z.AI 的「Terminal-Bench 2.0 Verified」貢獻了 28 題中 11 題的修正。
- 作者自己列的限制：無。
- 與摘要說法不一致處：公告的分類是「9 外部依賴、8 資源」（第三類沒給數字）；2.1 論文附錄表 2 是「指令驗證不一致 16、環境問題 8、task drift 12」（一題可多標）。外部依賴 9 vs task drift 12 對不上，論文版本較新、有逐題清單，引用時以論文為準。部分圖表數值頁面沒有渲染出來（只有差值），完整值要看論文表 7 或 PR #53。
- 反證或後續修正：見 2.1 論文。
- 對系列的用途：Terminal-Bench 專文「題目也會壞，版本要怎麼讀」一節；說明「同一模型 2.0 與 2.1 分數差 12 pp」不是模型變強。

---

### Harbor 官方文件與相關公告（harborframework.com、tbench.ai）
- 網址（依讀取順序）：
  - https://raw.githubusercontent.com/harbor-framework/harbor/main/README.md （repo 已從 laude-institute/harbor 轉到 harbor-framework/harbor，舊網址 301）
  - https://docs.harborframework.com/core-concepts/index.md
  - https://docs.harborframework.com/tasks/overview.md 、tasks/instruction.md 、tasks/verifier.md 、tasks/separate-verifier.md 、tasks/artifacts.md 、jobs/regrade.md
  - https://docs.harborframework.com/news.md 、changelog.md
  - https://docs.harborframework.com/news/reward-hacking.md （2026-10-28）
  - https://docs.harborframework.com/news/separate-verifier-sandboxes.md （2026-05-15）
  - https://www.tbench.ai/news/announcement-2-0 （2025-11-07）、/leaderboard-integrity-and-timeouts （2025-09-09）、/leaderboard-integrity-update （2026-04-19）、/writing-a-good-terminal-bench-task （2026-03-20）、/continuous-benchmarks （2026-07-30）、/terminal-bench-3-0 （2026-07-30）、/terminal-bench-4-0 （2026-08-28）、/terminal-bench-4-1 （2026-11-09）
- 讀取狀態：✅（以上每頁全文；文件站共有上百頁，只讀與任務格式、verifier、版本、誠信有關的頁，API／SDK 參考頁沒讀）
- 讀取紀錄：docs 各頁 2,700–14,700 字元，逐頁讀完；tbench 新聞每篇 2,000–9,000 字元，逐篇讀完。
- 類型：官方文件
- 研究設計或文件目的：說明 Harbor（Terminal-Bench 團隊做的評測／rollout 框架）是什麼、任務怎麼寫、verifier 怎麼隔離、排行榜規則與 Terminal-Bench 的版本政策。
- 會被引用的結果：
  - Harbor 是什麼：「Harbor is a framework from the creators of Terminal-Bench for evaluating and optimizing agents and language models.」也是「the official harness for Terminal-Bench-2.0」。2.0 公告：Harbor 是「re-inventing the Terminal-Bench harness to support cloud-deployed containers, interfaces for rollouts for RL and SFT」。
  - 核心概念：Task／Dataset／Agent／Sandbox／Verifier／Trial（一個 agent 對一題的一次嘗試）／Job／Trajectory（標準格式 ATIF）。
  - 任務格式：「A Harbor task is an instruction, environment, and test script.」verifier 必須寫數值 reward 到 `/logs/verifier/reward.txt` 或 `reward.json`；任務「have no dependency on the Harbor framework」，可當套件版本化。
  - 指令寫法：建議簡潔、寫清楚成果、用絕對路徑並定義輸出 schema；instruction 開頭的 markdown 註解會被自動移除，用來放 canary string；「Agents and tasks should be decoupled」，不要改 instruction 當 prompt 工程。tbench〈What Makes a Good Terminal Bench Task〉：「A prompt is designed to help the agent succeed. A benchmark is designed to find out whether it can.」測試要驗成果不驗實作細節。
  - verifier sandbox 預設的變更：
    - 2026-05-15 首次推出 separate verifier（opt-in）：verifier 在另一個 sandbox，只拿宣告的 artifacts；限制是「verification is limited to copied artifacts, not full container state such as running processes」。
    - v0.25.0（2026-10-25）breaking change：「New tasks created with `harbor tasks init` or `harbor init --task` now use separate verifiers by default.」舊任務沒寫 `environment_mode` 就仍是 shared。
    - 2026-10-28〈Cracking down on reward hacking〉把這件事和一整組防護一起公告：artifact 進 verifier 前丟掉指向外部的 symlink、FIFO、清 setuid；verification 開始前刪掉舊的 reward 檔；本機不再自動 bind-mount `/logs/verifier`（issue #3741：agent 可寫 reward 檔）；網路受限時自動放行推論端點並關掉內建 web search；路徑與環境變數改成中性名稱以降低 eval awareness；`harbor lint`、`harbor check`（11 點 rubric）、`harbor analyze`（agent 判讀 reward hacking 與任務規格）；RewardKit `Worker` 以非特權使用者執行受測程式碼。
    - reward hack 三分類：Tampering（干擾評分）、Cheating（從不該有的地方拿答案）、Loopholes（過測試但沒解題）。
  - 重新評分：只改 verifier 時，`harbor job regrade` 用已存的 artifacts 重跑 verifier，「No agent environment is started, so regrading needs no agent credentials and incurs no new agent cost.」
  - 排行榜誠信（2026-04-19，tbench.ai）：所有通過的 trial 必須附 ATIF 軌跡；reward hacking 的 trial 記 0 分（例：從網路找解答）；作弊直接下架；對所有通過 trial 跑 agent judge 偵測，judge 會開源。作弊定義：「any case where the submitter alters the benchmark in a way that gives their agent an advantage or provides task-specific information to their agent.」實例：OB-1（OpenBlock）改 timeout、把加密解答放進 agent binary；Pilot（QuantFlow）上傳每題的 `tests/`；ForgeCode 的 agent 在 AGENTS.md 裡 curl 解答，被重評為 0。
  - 早一步的 timeout 事件（2025-09-09）：OpenBlock 把每題 timeout 改成固定 30 分鐘；大部分題目原本是 5 分鐘，等於 75 題變長、2 題不變、3 題變短。「Timeouts affect task difficulty.」
  - 版本政策（〈Continuous Benchmarks〉＋4.0 公告）：patch＝沿用舊結果；minor＝只改 verifier，重評存檔 artifact；major＝改到 agent 環境，必須重跑。資料集版本跟著最大的任務變動走。4.0 公告：「Why is this 4.0 instead of 3.1? … These represent breaking changes that require re-running trials.」
  - 3.0（2026-07-30，前身 Frontier-Bench）：74 題、7 個領域，最好約 34%；agent 容器與 verifier 容器分開。對 2.1 的鑑別力：Fable 5 與 Opus 4.8（都用 Claude Code）在 2.1 只差 4.9 分，在 3.0 差 12.7 分。
  - 4.0（2026-08-28）：全部任務改成固定 8 小時 agent timeout；移除 8 題（飽和 2、拒答 2、解答已公開 2、品質或平台問題 2），修 19 題。飽和定義：最新一代所有模型家族都 5/5 解出。
  - 4.1（2026-11-09）：44 題在驗證時會執行 agent 寫的程式碼，全部改用 RewardKit Worker；用存檔 artifact 重評 4.0 排行榜，11,550 次 trial 中 162 次分數改變（約 1.16%；89 偽陰、45 偽陽、28 歸為量測差異沿用舊分），35 個 agent 的新分數全落在原 95% CI 內；重評推論成本 0 美元（4.0 排行榜原本花了 11.6 萬美元）。
- 作者自己列的限制：separate verifier 只能檢查 artifact，跑著的 process 要先寫成檔；「A smart model will probably be able to tell it's being evaluated either way」；4.1 承認「Many reported exploits remained theoretical」，部分深層問題仍在和出題專家協調。
- 與摘要說法不一致處：
  - 使用者指定的「2026-10-28 verifier sandbox 預設變更」：預設改成 separate 實際寫在 v0.25.0 changelog（2026-10-25），10-28 是公告文章日期。兩個日期都要寫清楚。
  - README 範例還是 `harbor run --dataset terminal-bench@2.0`，但 tbench 最新版已到 4.1；文件與新聞版本不同步。
  - 4.1 公告說「Out of 11,550 total trials, only ~1.16% experienced a score change」，162/11,550 = 1.40%；1.16% 對應 134 筆（扣掉 28 筆量測差異）。原文沒說明用哪個分子。
- 反證或後續修正：
  - Epoch AI（2026-09-04）判 Terminal-Bench 4.0.0 為 Flawed：「30 out of 66 tasks (45.5%) contain publicly noted scoring defects」，含可直接寫 pass 訊號的 reward hack（vf2-speedup-networkx）、答案外洩（interleaved-vigenere、telecom-entity-resolution）。https://epoch.ai/benchmarks/terminal-bench-4/review （只讀搜尋摘要，見補搜）
  - Vetto（2026-11-10）稽核 4.1：66 題中 23 題（34.8%）有 60 個發現；Worker 隔離擋住了覆寫 reward 檔，但「protecting the tests does not make their decisions reliable」，例如受測程式碼仍能偽造 benchmark 回報給 grader 的效能數字。https://vetto.ai/companies/terminal-bench-4-audit/ （只讀搜尋摘要）
  - Tokenless EnvCheck（2026-09-30）在 TB 4.0、DeepSWE 1.1、BFCL v4 找到 110 個 reward hack 與評分 bug。
- 對系列的用途：Terminal-Bench 專文的「Harbor 與 verifier 隔離」「排行榜誠信」「語意化版本與重評」三節；也支撐「benchmark 是需要維護的軟體」的系列主張。

---

### Introducing SWE-bench Verified（OpenAI，2024-08-13，2025-02-24 更新）
- 網址：https://openai.com/index/introducing-swe-bench-verified/
- 讀取狀態：✅
- 讀取紀錄：Exa 擷取約 14,000 字元，一次讀完（含文末標註 rubric 與註腳）。頁面上的互動圖表（標註結果、難度分布、分難度表現）只有標題，數值以正文描述為準。
- 類型：官方文件（研究部落格）
- 研究設計或文件目的：為 Preparedness Framework 的 Model Autonomy 評估修 SWE-bench：找出無法解的題目，做人工篩選出 500 題的 Verified。
- 會被引用的結果：
  - 原版三個問題：單元測試太特定甚至和 issue 無關、issue 描述不夠明確、開發環境難以穩定建起。例：scikit-learn-14520 的測試要求精確的 DeprecationWarning 訊息，該訊息只出現在 PR 討論裡，「it would be nearly impossible for an agent to solve this sample」。
  - 標註流程：93 位有 Python 經驗的開發者；先由 OpenAI 工程師手標 50 題做入職測驗；隨機標註 1,699 題；每題 3 人獨立標註，取最嚴重的那個（「conservatively ensemble annotations by taking the highest-severity label」）。兩個主軸各分 0–3 級：issue 是否 underspecified、FAIL_TO_PASS 測試是否會擋掉正確解；≥2 即刪；另有自由欄位標其他重大問題（例如測試可被投機通過）。
  - 刪除比例：「38.3% of samples were flagged for underspecified problem statements, and 61.1% were flagged for unit tests that may unfairly mark valid solutions as incorrect. Overall, our annotation process resulted in 68.3% of SWE-bench samples being filtered out」。作者自認「this filtering process is likely to be overzealous」。
  - 抽 500 題的方式：1–4 小時與 >4 小時的題目盡量全收，其餘隨機抽。
  - 難度分級（只供參考、不用來篩）：<15 分鐘、15 分鐘–1 小時、1–4 小時、>4 小時；多數決或取中位數。Verified 中 easy（<15 分鐘）196 題、hard（>1 小時）45 題。原版 77.8% 估計 1 小時內可修完；Lite 與 Verified 都只剩不到 10% 超過 1 小時。
  - 分數：GPT-4o 最佳 scaffold 在 Verified 33.2%，原版 16%。分難度後，各難度層的分數都上升，作者據此主張提升不只是因為題目變簡單。
  - harness 差異：GPT-4 在 SWE-bench Lite 上，早期 RAG scaffold 2.7%、CodeR 28.3%。
  - 同時和 SWE-bench 作者推出容器化評測 harness。
- 作者自己列的限制：靜態資料集本質有限；題目取自公開 GitHub，「large foundation models that are pre-trained on internet text are likely to be contaminated on the tasks」；只涵蓋 Model Autonomy Medium 風險的窄分布；人類工程師的實際解題率會低於 100%。
- 與摘要說法不一致處：逐項對過，沒有。只有一處要注意：「Updated February 24, 2025」頁面沒說改了什麼。
- 反證或後續修正：
  - SWE-Bench+（本批）：Verified 中 SWE-Agent+GPT-4 的通過解有 33.04% 是答案寫在 issue 或留言裡、22.32% 是測試太弱；Verified 篩的是「測試會擋掉正確解」，沒篩「測試會放過錯誤解」與答案外洩。
  - PatchDiff（本批）：Verified 的通過 patch 有 7.8% 跑完整開發者測試會失敗，估計解題率灌水 6.4 pp。
  - OpenAI 自己在 2026 年停用 Verified（A 批已讀〈Why we no longer evaluate SWE-bench Verified〉）。
- 對系列的用途：SWE-bench 家族演化篇的起點：說明「人工篩選」能修什麼（不公平的偽陰）、修不到什麼（偽陽、污染），以及「篩掉 68% 後分數翻倍」該怎麼解讀。

---

### SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?（Scale AI，2025）
- 網址：https://arxiv.org/html/2509.16941 （v1 2025-09-21、v2 2025-11-14；HTML 為 v2）
- 讀取狀態：✅（v2 全文；v1 沒有另外讀）
- 讀取紀錄：去標籤後 61,309 字元。1,932–27,932（摘要到 §6.2）、27,932–61,309（§6.3、限制、結論、參考文獻、附錄 A–C）依序讀完。
- 類型：研究論文
- 研究設計或文件目的：做一個抗污染、長程、企業級的 issue 解決 benchmark。1,865 題、41 個 repo，分公開集、held-out、商用集；用統一的 SWE-Agent scaffold 量各模型 Pass@1，並做失敗模式分析。
- 會被引用的結果：
  - 防污染做法（§1、§3.1）：公開集與 held-out 只選 GPL 等強 copyleft 授權的 repo；商用集是向新創公司買來的私有 repo。「By exclusively using repositories with GPL and other copyleft licenses, we ensure benchmark content is unlikely to appear in proprietary model training sets, as the nature of these licenses creates legal barriers to their inclusion in commercial training corpora.」
  - 分割（§3.3）：公開 731 題（11 repo，HuggingFace 公開）；商用 276 題（18 repo，私有但公布結果）；held-out 858 題（12 repo，私有，留著檢查過擬合）。
  - 難度設計：排除 1–10 行的小改；參考解平均 107.4 行、4.1 個檔案；每 repo 50–100 題上限。引言用來對照的數字：Verified 500 題中 161 題只要改 1–2 行。
  - 人工增補（§3.2、§4.2）：每題有改寫成 issue 風格的 problem statement、人寫的 requirements（以測試為依據，不寫實作）、必要時的 interface（類別與函式名稱），目的是減少偽陰。
  - 環境與測試驗證（§4.3）：專業工程師手建 Docker；gold patch 跑多次確保不 flaky；人工逐條檢查 fail2pass 測試，和 task 無關或太廣的測試刪掉。
  - 結果（表 1，公開集 N=731，SWE-Agent，提供完整增補；表 1 本身沒寫回合上限）：Claude Sonnet 4.5 43.6%、Claude Sonnet 4 42.7%、GPT-5 (high) 41.8%、Claude Haiku 4.5 39.5%、Kimi K2 Instruct 27.7%、GPT-OSS 120B 16.2%。
  - 商用集（表 2）：Claude Opus 4.1 17.8%、GPT-5 (high) 15.7%；「the best models score less than 20% in the commercial set」。
  - 增補的作用（表 3，50 回合、2 美元上限）：GPT-5 (high) 有增補 25.9%、只有 problem statement 8.4%；Opus 4.1 22.7% vs 8.2%。「Without these augmentations, unit test verifiers are susceptible to false negatives.」
  - 失敗模式（表 4，GPT-5 當 judge）：Opus 4.1 失敗以 wrong solution（35.9%）、syntax error（24.2%）為主；Sonnet 4 以 context overflow（35.6%）為主。
  - Verified 對照（§8）：「top-tier models like Opus 4.1 and GPT-5 achieving a 23% success rate on SWE-Bench Pro compared to over 70% on benchmarks like SWE-Bench Verified」。
- 作者自己列的限制（§7.1）：語言只有 Python、JS、TS、Go，Java、C++、Rust 缺席；依賴 fail2pass／pass2pass 測試，「real software engineering tasks may have a variety of correct solutions, even if they do not pass the original tests」。
- 與摘要說法不一致處：
  - 摘要說「below 45% (Pass@1)」（對應 v2 表 1 的 Sonnet 4.5 43.6%），但結論仍寫「23% success rate」（對應 v1 與表 5 的 50 回合低預算設定）。v2 更新了主表卻沒改結論。
  - 同一個 Claude Sonnet 4 在表 1 是 42.7%、表 5 是 17.6%。§5 評測設定寫「Models have a maximum of 50 turns」，表 5 標題也寫 50 回合＋2 美元上限，兩表差這麼多卻沒說明表 1 用了什麼不同設定（OpenAI 2026-07 文提到 Pro 起初的 23.3%，對應 v1／表 5 這一組）。
  - §5 正文寫「Table 2 shows the results of various models」，但描述的是表 1（公開集）的數字。
  - copyleft 防污染是作者的推論（授權造成法律障礙），論文沒有提供任何模型實際沒看過這些 repo 的證據。
- 反證或後續修正：
  - OpenAI 2026-07-08〈Separating signal from noise in coding evaluations〉（本批補讀）：公開集 ~30% 題目壞掉，撤回推薦。
  - DeepSWE（Datacurve，arXiv 2607.07946）：LLM 評審與 Pro 驗證器不一致 32.4%（偽陰 189、偽陽 67，n=789），作者說明不是 ground truth、樣本只有 30 題。
  - Epoch AI 2026-09-01 判 Pro 為 Flawed，彙整 Jonathan Gabor（100 題中 83 題有問題）、Datacurve、OpenAI、Poolside（reward hacking）。
  - Berkeley RDI（D 批）：731/731 可用 conftest／parser 替換灌到 100%。
  - Scale 2026-09-22 推出 SWE-Bench Pro V2（arXiv 2610.24206）：731 → 642 題（丟 89 題），731 題中 480 題（66%）被修或移除；agent 階段只能連到模型端點；在乾淨映像重評。前沿 agent 在 V2 最高 99.4%。（只讀摘要與方法段搜尋摘錄，見補搜）
  - 論文的「copyleft 讓污染不可能」主張，被 V2 自己的限制段弱化：「The public repositories and their fixes predate the evaluated models. The protocol stops retrieval at test time, not memorization during training.」V2 也記錄一個前沿模型在開網路時從 GitHub 照抄解答，351 題中只有 237 題在封鎖 GitHub 後仍成立。
- 對系列的用途：SWE-bench 家族演化篇的「Pro」一節：抗污染的三種手段（授權、私有、held-out）、增補 requirements／interface 的取捨（降偽陰、但也洩漏實作細節），以及「Verified 70%+ vs Pro 23%」落差的真正來源要和後來的稽核一起讀。

---

### SWE-Bench+: Enhanced Coding Benchmark for LLMs（York University，2024）
- 網址：https://arxiv.org/html/2410.06992 （v2，2024-10-10）
- 讀取狀態：✅
- 讀取紀錄：去標籤後 49,097 字元。341–27,256（摘要到 §4 前段）、27,256–37,969（§4 結尾到 §7）依序讀完；參考文獻略。
- 類型：研究論文（預印本，未查到正式出版版本）
- 研究設計或文件目的：人工逐題比對 SWE-Agent+GPT-4 在 SWE-bench Full 通過的 251 個 patch 和 gold patch，分類可疑通過；再對 Lite、Verified 做同樣檢查；最後收集 2023-11 之後的新 issue 做成 SWE-Bench+（548 題）。
- 會被引用的結果：
  - Full 的 251 個通過 patch（表 1）：答案外洩 82（32.67%）、錯誤修法 32（12.75%）、改到別的檔案／函式 9（3.59%）、不完整修法 37（14.74%）；正確但與 gold 不同 76（30.27%）、比 gold 更完整 15（5.98%）。可疑合計 160（63.75%）。
  - 答案外洩定義：「instances where the solution to the issue is clearly outlined in the issue description or comments on GitHub」。例：sympy-16669 的 issue 直接附了修正程式碼。
  - Verified（表 2，SWE-Agent+GPT-4 通過 112 題、22.4%）：答案外洩 37（33.04%）、錯誤修法 14（12.50%）、不完整修法 11（9.82%）；可疑合計 55.36%；扣掉後解題率 22.4% → 10.0%。Lite：18% → 9.33%。
  - 時間污染：「94% of the instances in SWE-bench and their pull requests were created prior to the training cut-off dates of the LLMs」。
  - SWE-Bench+：12 個 repo 扣掉 Django（不在 GitHub 追蹤），收 2023-11-01 至 2024-08-22 的 issue，人工排除含解答的 issue，548 題。結果：SWE-RAG+GPT-4 0.73%、SWE-RAG+GPT-3.5 0.55%、SWE-Agent+GPT-4 0.55%、AutoCodeRover+GPT-4o 3.83%（排行榜原報 18.83%）。SWE-Bench+ 上的通過 patch 仍有約 67.72% 實際沒解決 issue，主要是改錯檔案。
- 作者自己列的限制：弱測試在 SWE-Bench+ 仍存在，「needs future investigation」；只深入研究一個工具（SWE-Agent+GPT-4）。
- 與摘要說法不一致處：
  - 摘要說扣除可疑後 Full 解題率「drops from 12.47% to 3.97%」，§2.2 正文寫「decreased from 12.47% to 5.49%」。兩個數字都出現在論文裡，沒有解釋（推測一個扣掉了 94% 時間污染的影響，未證實）。
  - 摘要說「31.08% of the passed patches are suspicious patches due to weak test cases」；表 1 的三類弱測試加總是 12.75+3.59+14.74 = 31.08%，一致。但 §1 說「identified eight patterns」又說「six patterns」，表 1 只有六類。
  - §5 成本段：表 4 寫 SWE-Agent+GPT-4 每題 3.59 美元、每修好一題 655 美元；正文卻寫「SWE-Agent+GPT-4 was the most expensive model, with an average cost of $0.24 per instance and an effectiveness-aware cost of $32.5」（那是 RAG+GPT-4 的數字）。正文把表格列錯位。
  - 「答案外洩」把 GitHub 留言（hints_text）也算進去，並假設模型輸入含留言（「Since both the issue descriptions and comments (referred to as hints_text in the SWE-Bench study) are provided as input to the models」）。SWE-bench 的標準設定是否把 hints 給 agent，論文沒驗證 SWE-Agent 實際有沒有拿到留言；這是解讀 32.67% 時的重要但書（本人判斷，待查 SWE-agent 設定確認）。
- 反證或後續修正：
  - PatchDiff（Wang et al., 2025，本批）批評本文「only one issue-solving tool on SWE-bench full」，並在 Verified 上用三個工具得出較低但仍顯著的灌水估計（6.4 pp）。
  - SWE-Bench Pro 論文引用本文作為污染證據（ref [1]）。
- 對系列的用途：支撐 SWE-bench 演化篇「Verified 仍有兩種漏洞：答案寫在題目裡、測試放過錯解」；數字引用時要帶「單一工具、作者人工判讀、留言是否算輸入有爭議」三個但書。

---

### Are "Solved Issues" in SWE-bench Really Solved Correctly? An Empirical Study（Wang et al., 2025）
- 網址：https://arxiv.org/html/2503.15223 （v1 2025-03-19、v2 2025-09-09；HTML 為 v2）
- 讀取狀態：✅
- 讀取紀錄：去標籤後 83,640 字元。2,341–31,341（摘要到 RQ2 前段）、31,341–67,831（RQ2 結尾到 §9）依序讀完；參考文獻略。
- 類型：研究論文
- 研究設計或文件目的：在 SWE-bench Verified 上，檢查三個工具（CodeStory、LearnByInteract、OpenHands）的「plausible patch」（通過官方驗證的 patch）是否真的正確。方法：RQ1 跑 repo 全部開發者測試；RQ2 用 PatchDiff（LLM 生成「差異測試」，找出與 oracle patch 行為不同之處）；RQ3、RQ4 人工抽 77 個可疑 patch 分類與判對錯。
- 會被引用的結果：
  - 官方驗證只跑 PR 改到的測試檔：「SWE-bench (Verified) assesses patch correctness only based on modified test files」。
  - RQ1（表 1）：跑完整開發者測試後，7.2%–8.4% 的 plausible patch 失敗，解題率下降 3.8–5.2 pp（CodeStory 62.2% → 57.0%）。「on average 7.8% of plausible patches are incorrect, which leads to an absolute performance drop of 4.5% on average.」
  - RQ2：29.6%（260/877）的 plausible patch 與 oracle 行為可區分；若全部扣掉，解題率平均降 17.3 pp；LearnByInteract 與 OpenHands 的差距從 7.2 pp 縮到 2.2 pp。可疑 patch 中 82.7% 跑全部開發者測試也抓不到。
  - RQ3：行為差異來源，相似但分歧的實作 46.8%、生成 patch 多做了額外語意變更 27.3%、少做 5.2%、完全對不上 20.8%。
  - RQ4（表 8）：77 個中確定錯 22（28.6%）、確定對 4（5.2%）、無法判斷 51（66.2%，因為 issue 沒規定那些細節）。外推：plausible patch 約 11.0% 錯誤，「inflating the reported resolution rate by 6.4 points on average」。
  - 工具比較：Pynguin、CoverUp 在 133 個 patch 上產生 0 個差異測試；LIBRO 5.9%。
- 作者自己列的限制（§5.3）：用 GPT-4o-mini 生成測試（換 DeepSeek-V3、Qwen3 偵測率更高：28.0% → 39.0%、47.7%，表 4）；人工判讀有偏誤（第一作者判、與第二作者討論）；只抽 30% 可疑 patch（95% 信心水準 ±9.39%）；RQ3／RQ4 只看 PatchDiff 抓到的可疑 patch。
- 與摘要說法不一致處：摘要說「7.8% of all patches to count as 'correct' while failing the developer-written test suite」，正文是 plausible patch 的 7.8%，不是 all patches。另外摘要只報 6.4 pp 灌水；正文 RQ2 的「若扣掉所有可疑 patch 降 17.3 pp」是上限，引用時要分清楚。
- 反證或後續修正：未找到推翻它的後續；SWE-Bench Pro V2 的「verifier 只在 PR 測試上跑、會放過錯解」問題與本文一致（V2 改成重評時限定測試範圍，方向相反，是為了降 OOM 和逾時）。
- 對系列的用途：SWE-bench 演化篇裡「測試不足導致誤判」的最好數字：7.8%（只看 PR 測試的漏洞）、約 11% 錯誤、灌水 6.4 pp；以及「三分之二無法判斷，因為 issue 沒寫清楚」說明規格不全才是根因。

---

## 2. 補搜精讀（2 篇）

### Benchmarks as Software: Terminal-Bench and the Case for Continuous Benchmarks（Buchanan, Zhou, Linderman, Ré，2026）
- 網址：https://arxiv.org/html/2611.08417 （v1，2026-11-05）
- 讀取狀態：✅
- 讀取紀錄：去標籤後 62,162 字元。0–939 目錄；939–28,900（摘要到 §6.2）、28,900–36,900（§6.3 到致謝）、45,771–62,162（附錄 A–C）依序讀完；36,900–45,771 參考文獻略。
- 類型：研究論文（2.1 的正式技術報告；第一作者是 2.1 公告署名的 TB2.1 Lead）
- 研究設計或文件目的：提出「benchmark maintenance debt」概念與一套持續驗證流程（證據收集 agent → 稽核 agent → 驗證 agent 跑 oracle → 維護者審核），套用在 Terminal-Bench 2.0，產出 2.1；再用 19 個 agent 比較 2.0／2.1 的分數、排名與時間預算效應。
- 會被引用的結果：
  - 缺陷規模：「Our audit identifies issues in roughly 30% of the benchmark」；28 題，其中 11 題來自 Z.ai 的 TB 2.0 Verified、5 題來自公開 issue／PR、14 題是本流程新找到的。
  - 分類（附錄表 2，可重疊）：指令與驗證不一致 16 題（57%）、task drift 12 題（43%）、環境／資源問題 8 題（29%）。例：query-optimize 的 verifier 要求資料庫檔逐位元組不變，指令沒寫。
  - 排名穩定：「Spearman ρ=0.958」（bootstrap 95% CI [0.881, 0.979]）；個別分數最多變 12 pp、名次最多變 3 名；OLS：TB2.1 = 2.1 + 1.04·TB2.0。被修的 28 題中 19 題是 hard，所以 2.0 低於 40% 的兩個最弱 agent 在 2.1 反而下降。
  - 五題從 ≤15% 升到 >50%，占修正題總變化約 62.7%，都是 verifier 端的修正：「agents were often producing valid solutions, but TB 2.0 failed to recognize them.」
  - 時間預算與 harness（§6.2–6.3）：失敗 trial 中 >50% 是逾時（claude-code 68%、gemini-cli 18%）；GPT 5.4 在 Codex 與 Terminus-2 之間差約 20 pp，「most of the harness gap is recovered when we give the tasks a longer budget, suggesting speed rather than capability gains」；摘要：GPT 5.4 mini 的 30 pp 差距縮到 5 pp。「a fixed resource budget is an arbitrary operating point and that the choice is not innocuous」。
  - 稽核 agent 一致性：Claude Code (Opus 4.6) 與 Codex (GPT-5.4) 在主分類上 κ=0.80；低價模型對 task drift 的 κ 只有 0.21–0.41，所以 drift 改靠確定性的 oracle 重跑偵測。對最終 2.1 修正集的 precision 57.1%、recall 71.4%（作者說明是回溯一致性，不是獨立發現率）。
  - 修法立場（附錄 A.3）：Z.ai 的 Verified 傾向改指令說明測試要什麼；2.1 傾向放寬測試接受任何正確解，因為「stating the grader's expectation tells the agent part of the solution」。Verified 還加了只針對 Claude Code 的提示（「Do not use the Read tool…」），2.1 不做 harness 專屬改動。Z.ai 報告光修環境就讓 Opus 4.5 從 52.4% 升到 57.9%。
  - 基礎設施失敗：約 27% 的上游 trial 因為 runner、供應商、認證、sandbox 等錯誤被濾掉；逾時的 trial 仍依當時狀態評分，其中 11.8% 通過。
  - 外部效度：對 Harbor-Index v0.1 抽 34 題，流程標出 14 題，人工確認 12 題（86% precision），也漏掉幾題（Lab-Bench 錯誤參考答案、QCircuitBench 不確定性評分等）。
- 作者自己列的限制：一致性不等於正確性；precision／recall 是回溯值；延長時間的條件因成本只跑部分 agent；drift 會持續發生（「more dependencies will rot between this paper's submission and its publication」）。
- 與摘要說法不一致處：
  - 摘要「accuracy increased by over 10 percentage points」只對最好的情況成立（Claude Code＋Opus 4.6）；正文說升幅不均，GPT 5.4 Terminus-2 幾乎沒變，最弱 agent 還下降。
  - 摘要「roughly 30%」、貢獻段「roughly one third」：28/89 = 31.5%。
  - 與 2.1 公告的分類數字不同（公告：外部依賴 9、資源 8；論文：drift 12、環境 8、指令驗證不一致 16）。
- 反證或後續修正：TB 3.0／4.0 之後改成固定 8 小時 timeout（4.0 公告），呼應本文「資源預算是量測規格的一部分」。
- 對系列的用途：Terminal-Bench 專文最關鍵的一手數據：2.0 → 2.1 改了什麼、為什麼分數升、為什麼 harness 差距多半是時間預算效應；也修正原論文「選模型比選 harness 重要」的結論：平均而言成立，但個別模型在固定時間下 harness 可差 20 pp。

---

### Separating signal from noise in coding evaluations（OpenAI，2026-07-08）
- 網址：https://openai.com/index/separating-signal-from-noise-coding-evaluations/
- 讀取狀態：✅
- 讀取紀錄：Exa 擷取約 9,500 字元，一次讀完。「Failure modes」圖表與作者欄沒有渲染出文字。
- 類型：官方文件（研究部落格）
- 研究設計或文件目的：用同樣的資料點分析流程稽核 SWE-Bench Pro 公開集 731 題：自動篩選 → Codex 調查 agent 多次深挖＋研究員判定，平行做 5 位工程師獨立標註。
- 會被引用的結果：
  - 「On the 731-task public split, frontier models improved from a pass rate of 23.3% to 80.3% in eight months.」
  - 自動篩選標出 286 題可疑；agent 流程判 200 題（27.4%）壞掉，人工標註判 249 題（34.1%）。「we estimate that ~30% of SWE-bench Pro tasks are broken」。
  - 四類問題：測試過嚴（要求 prompt 沒寫的實作細節）、prompt 規格不足、測試覆蓋不足（不完整修法也能過）、prompt 誤導。人工最常選「覆蓋不足」為主要問題的占全集 9.4%，agent 流程只 4.1%。
  - 一致性：「in no flagged task was 'not broken' the most common human label」；agent 標的類別與人工重疊 74%。
  - 結論：「Given the issues uncovered in this analysis, we retract our earlier recommendation to adopt SWE-Bench Pro.」
  - 根因：PR 裡的測試「are written to validate a specific change, rather than to define an implementation-agnostic standard for solving the task」。
  - 例子：TocEntry.to_markdown() 的 prompt 範例是一個前導空格，隱藏測試要求兩個。
- 作者自己列的限制：沒有正式限制段；說明人工比 agent 更傾向判壞，agent＋審稿流程屬保守估計。
- 與摘要說法不一致處：副標「~30%」是 27.4%（agent）與 34.1%（人工）之間的取整，不是單一測量值。
- 反證或後續修正：Scale 的回應是 Pro V2（2026-09-22），丟 89 題、修 391 題；V2 論文自己的 Round 3 稽核也標出 200 題（27%）與 OpenAI 數字接近。
- 對系列的用途：SWE-bench 家族演化篇的轉折點：同一家公司兩年內先推 Verified、再停用 Verified 推 Pro、最後撤回 Pro 的推薦；說明「從 PR 抽題目＋沿用 PR 測試」這個資料來源本身有結構性的偽陰。

---

## 3. 本批最重要的發現（給寫稿用）

1. 站上〈Coding Benchmark 怎麼讀〉的「Pro 才是未來」與「看 Terminal-Bench 2.1」都已過時：Pro 在 2026-07 被 OpenAI 撤回推薦、2026-09 被 Epoch 判 Flawed，Scale 出了 V2；Terminal-Bench 已到 4.1，版本號改成語意化版本。文中「Pro 123 種語言」是錯的（實際 4 種）。
2. SWE-bench 家族三個階段的共同根因相同：題目來自 PR，測試是為了驗證「那一個修法」而寫，不是為了驗證「任何正確解」。Verified 篩掉偽陰（刪 68.3%），但 SWE-Bench+ 與 PatchDiff 顯示偽陽仍在（Verified 通過解中 7.8% 跑全部測試會失敗、估計灌水 6.4 pp）；Pro 加了 requirements／interface 降偽陰，結果被稽核出 ~30% 壞題。
3. Terminal-Bench 的 harness 效應要分開講：原論文說「選模型比選 harness 重要」（平均而言），2.1 論文顯示固定時間下同模型可差 20 pp，但延長時間後大半消失，差距多半是速度不是能力。資源預算（timeout）本身是量測規格，改 timeout 在排行榜上算作弊。
4. Harbor 把防作弊從「審題」移到「架構」：verifier 分離（新任務 2026-10-25 起預設 separate）、artifact 消毒、regrade 不重跑 agent。這讓 4.1 能用 0 美元重評 4.0 排行榜（11,550 次 trial 中 162 次改分，全部在原 CI 內）；但 Vetto 對 4.1 的稽核指出隔離不保證測試判斷正確。
5. Terminal-Bench 論文自己的資料有內部不一致：摘要說 89 題，表 1／表 2 用 74 題；寫作時引用 89 題的數字要對應正確的表。

---

## 補搜紀錄

**查詢（2024 年後的更新）**
- Exa：`audit of SWE-bench Pro verifier errors false positives false negatives 2026` → 找到 OpenAI〈Separating signal from noise〉（收，精讀）、DeepSWE 論文摘要頁、Epoch SWE-Bench Pro review、June Kim determinacy audit（728 題中 ≥15.0% 規格無法決定測試行為）、Eslam Hamed 部落格（二手，不收）。
- Exa：`Terminal-Bench audit reward hacking verifier flaws Epoch AI analysis 2026` → 找到 arXiv 2611.08417（收，精讀）、Epoch TB 4.0 review（30/66 題 Flawed）、Tokenless EnvCheck、Preference Model、Vetto 4.1 稽核、explainx 與 DEV 的比較文（二手，不收）。
- Exa：`Scale AI response to SWE-Bench Pro audit, updated SWE-Bench Pro version` → 找到 Scale〈SWE-Bench Pro V2〉部落格、arXiv 2610.24206、Scale V2 排行榜頁、GitHub README（2026-05-18 曾公告「identified some issues with the leaderboard」）。
- 直接抓 tbench.ai/news 列表，發現 3.0／4.0／4.1、Continuous Benchmarks、誠信公告等官方頁，已併入 Harbor 條目精讀。

**查詢（criticism / flaws / replication）**：上面第一、二組查詢都以批評與稽核為目標；SWE-Bench+ 與 PatchDiff 本身就是 Verified 的反證。

**收與不收的理由**
- 收（精讀）：arXiv 2611.08417（直接回答「2.0 與 2.1 差在哪」，一手、有逐題資料）；OpenAI 2026-07-08 稽核（直接推翻 Pro 的品質主張，一手）。
- PatchDiff（arXiv 2503.15223）：任務說「挑一篇讀全文」，但 SWE-Bench+ 內部數字矛盾多（3.97% vs 5.49%、成本表錯位）、只看一個工具，所以另讀 PatchDiff 當 Verified 測試不足的主要數字來源。它算在指定來源 5，不佔補搜名額。
- 未精讀、建議後續補：
  - SWE-Bench Pro V2 論文（arXiv 2610.24206）：只讀到 Exa 摘錄的摘要與方法段（§3.1–3.5、限制）。寫 SWE-bench 演化篇的「Pro V2」一節前要讀全文。注意部落格寫「1,897 hours」（公開＋私有集）、論文寫「404 hours」（公開集），引用時分清楚。
  - Epoch AI 的 SWE-Bench Pro 與 Terminal-Bench 4.0 review：只讀搜尋摘要；要引用「Flawed」判定的門檻（≥20% 分數受影響）前應讀全頁。
  - DeepSWE 論文（arXiv 2607.07946）：站上已引用，本批只讀摘要頁；32.4% 是「LLM 評審 vs 驗證器不一致」，judge 是 GPT-5.5，作者承認可能偏好自己的軌跡。
  - Vetto 4.1 稽核、Tokenless EnvCheck、Preference Model〈Terminal Bench 4: Every Issue We Found〉：只讀摘要；是 Terminal-Bench 專文「4.1 之後還剩什麼問題」的候選來源，但都是商業公司做的稽核，有推銷自家工具的利益，要交叉核對。
  - June Kim determinacy audit：個人部落格，方法有附 repo，但非同儕審查；可當 Pro 規格不全的輔助證據，不當主數字。
