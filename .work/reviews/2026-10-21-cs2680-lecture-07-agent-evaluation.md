審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation.md，sha256：7f46384cdd5594ecaa3f009468c9ea432a477c7f49a224524b2a1e0e005fb605

post-verify、post-polish：作者自查（撰寫的子代理），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/7_agent_design_4.pdf`（37 頁，頁碼用 PDF 頁序，已逐頁以 pdftotext 對過；p34 以前頁尾號碼等於 PDF 頁，作業 3 那頁是 PDF p35、頁尾印 36）、課程筆記 `sources/pages/notes_agent-evaluation.txt`、`.work/research/harvard-cs2680/lectures-05-08.md` L7 段、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 9、查證表 `.work/research/harvard-cs2680/l7-factcheck.md`。2026-10-22 重抓投影片（sha1 相同）與課程筆記（文字 0 行差異）。

## post-verify

查證表 `l7-factcheck.md` 共 22 項：Confirmed 18、Confirmed（需加條件）3、Not checked 1（p32 各「X 個月追上」數字，正文不引用）、Outdated 0、Contradicted 0、Not found 0。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 斷線 → Keenable 搜尋＋`curl` 直抓 arXiv PDF／export API、tbench.ai；GitHub issue 用 `gh issue view`；OpenAI、NIST 頁用 r.jina.ai 讀全文。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 第 7 堂 2026-09-30，題目 Agent design IV: evaluation；配課程筆記 | 投影片 p1；首頁 | Confirmed | |
| 2 | 導言 | 課程不錄影 | cs2680.com/policy | Confirmed | |
| 3 | 導言 | 四段頁碼 p5–11／p12–23／p24–31／p32–34，p35 作業 3；p4 列 cost-effective agents 但移到第 8 堂 | 投影片逐頁標題、p4、p36 | Confirmed | |
| 4 | 零件與端到端 | 零件：規劃、工具使用、錯誤恢復、記憶；端到端：成功率、成本、延遲 | p6 | Confirmed | |
| 5 | 零件與端到端 | 「分數量的是特定系統、特定任務、特定規則」；改工具介面或重試次數就可能變 | 課程筆記〈What are we evaluating?〉 | Confirmed | |
| 6 | 五種成功 | 表格五列與代表 benchmark | p8 | Confirmed | |
| 7 | 指標 | perplexity、accuracy/F1、win rate；pass@k、pass^k（τ-bench 提出）；成本忽略工具與 cache miss；延遲不只 LLM | p10 | Confirmed | |
| 8 | 指標 | pass^k 刻意比 pass@k 嚴格 | p19 | Confirmed | |
| 9 | 手算例 | n=5、c=3：pass@2=0.9、pass^2=0.3；代入法 0.84／0.36 | 課程筆記；Python 驗算 | Confirmed | |
| 10 | 手算例 | 代入法有偏、組合數算法不偏 | Chen et al. 2021（factcheck #1） | Confirmed | 出處寫 Chen et al.，不跟著筆記歸給 τ-bench |
| 11 | 手算例 | 兩題（5/5、1/5）逐題平均：pass^2=0.5、pass@2=0.7 | 本文自擬；Python 驗算 | — | 標本站補充 |
| 12 | details | pass@k 出自 HumanEval 論文、pass^k 出自 τ-bench；n≥k、事先定 n | factcheck #1、#3；課程筆記 | Confirmed | |
| 13 | details | p=0.8、k=3：99.2%、51.2% | 課程筆記；Python 驗算 | Confirmed | |
| 14 | 成本 | 200 步 40 美元 vs 12 步 0.30 美元 | p31 | Confirmed | |
| 15 | 成本 | A／B 100 題例：70% vs 75%、$1.43 vs $2.00、每多解一題 $10 | 課程筆記（假設數字） | Confirmed | 標「筆記的假設例子」 |
| 16 | 評測迴圈 | 虛擬碼 | p11 | Confirmed | 合併成一個 score 行，內容不變 |
| 17 | 評測迴圈 | agent harness 與 evaluation harness 分開 | 課程筆記〈What happens in one evaluation episode?〉 | Confirmed | |
| 18 | 退款例 | 三條軌跡表 | 課程筆記 worked example | Confirmed | |
| 19 | 退款例 | τ-bench：r=1 可能必要但不充分，可能沒確認就退款 | factcheck #5 | Confirmed | |
| 20 | 退款例 | outcome-only 放過運氣好／不安全；trajectory matching 誤殺合法路徑 | p31 | Confirmed | |
| 21 | 八個 benchmark | 總表 | p23 | Confirmed | 依「在哪裡做事」重排列順序 |
| 22 | GAIA | 466 題、只評最終答案、量不到動作 | p12–13；factcheck #7 | Confirmed | |
| 23 | BFCL | 訂機票例、捏造 passenger_id、無關 get_weather；V4 加 web search、memory，看分項 | p14；factcheck #13 | Confirmed | |
| 24 | WebArena／OSWorld | 812、369 題；accessibility tree vs 截圖；Verified 拿掉 LLM 評審；OSWorld 2.0 108 個長流程、部分給分 | p15–16；factcheck #8–11 | Confirmed | 不寫 27 個 checkpoint（只在二手頁看到） |
| 25 | SWE-bench | Verified、Lite 300、Multilingual 9 種語言、Multimodal、Pro | p17；factcheck #12 | Confirmed | |
| 26 | τ-bench | LLM 扮使用者、basic economy 不能改；r=r_action×r_output | p18–19；factcheck #4 | Confirmed | |
| 27 | Terminal-Bench | 介於 SWE-bench 與 OSWorld；2.0 89 題；4.0 66 題、8 小時 | p20–21；factcheck #14–15 | Confirmed | |
| 28 | TheAgentCompany | 175 題；S_partial 公式；0.25／0.44／1.00 | p22；factcheck #16；Python 驗算 | Confirmed | 7/8 寫 ≈0.44（實為 0.4375） |
| 29 | 洩漏四層 | 四層定義；realistic tools ⟺ larger leakage surface | p25 | Confirmed | |
| 30 | 洩漏四層 | OpenAI：前沿模型能重現部分 gold patch 或題目細節；停報、改報 Pro | factcheck #18 | Confirmed | |
| 31 | 洩漏四層 | NIST CAISI：curl 抓 CTF 解題文交答案 | factcheck #19 | Confirmed | |
| 32 | 洩漏四層 | TB 4.0 刪 8 題中 2 題因解答公開 | factcheck #15 | Confirmed | |
| 33 | 洩漏四層 | SWE-bench issue #465：Claude 4 Sonnet、Qwen3-Coder 用 git log --all 看到未來 commit | factcheck #17 | Confirmed | |
| 34 | 洩漏四層 | SWE-Bench Pro 公開 Docker 映像也被回報未來 git 歷史沒清乾淨 | https://github.com/scaleapi/SWE-bench_Pro-os/issues/93（2026-04-29，Poolside evals 團隊） | Confirmed | 不宣稱作業 2 的容器一定有這問題（課程容器來源未查證） |
| 35 | P=f(…) | 公式與各元件的洩漏例 | p26 | Confirmed | |
| 36 | 評分器被鑽 | NIST CVE-Bench：gpt-4o 用 /dev/urandom 灌爆伺服器 | factcheck #19 | Confirmed | |
| 37 | 評分器被鑽 | τ-bench airline 38% 不可能題、什麼都不做也過 | factcheck #20 | Confirmed | 寫明是 airline 子集 |
| 38 | 評分器被鑽 | OpenAI 審 o3 跑 64 次仍常解不出的 138 題，59.4% 有實質問題；pylint 函式名例 | factcheck #18 | Confirmed | 帶 138 題條件 |
| 39 | 單輪 | p27 三點；p30 三個能力 | p27、p30 | Confirmed | |
| 40 | 單輪 | 166 個 session：1 個 prompt 40 個、11 個以上 64 個；prompt 長度最多 21–100 字元 | p28–29 讀圖（長條旁有數字） | Confirmed | 「約四分之一」40/166=24%、「約四成」64/166=39% |
| 41 | 三個難處 | 非決定性、副作用、成本延遲 | p31 | Confirmed | |
| 42 | 飽和 | 飽和定義；截至 2026-09 OSWorld 2.0、ARC-AGI-3、SWE-bench Pro 仍開放 | p33（看圖） | Confirmed | p32 個別數字不引用 |
| 43 | 飽和 | TB 4.0 飽和定義：最新一代各家模型 5/5 全解 | tbench.ai 公告 | Confirmed | |
| 44 | 演變表 | 五列 | p34 | Confirmed | 「Primary concern」列未放 |
| 45 | 作業 3 | Pareto 支配定義、Rank 1 是前緣 | p35 | Confirmed | |
| 46 | 自己的評測 | 六點清單 | 課程筆記〈Designing an evaluation for your agent〉〈What to report〉 | Confirmed | 摘要改寫 |
| 47 | 綜合題 1 | n=6、c=4：pass@3=1、pass^3=0.2 | Python 驗算 | — | 本站自擬 |

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `7f46384cdd5594ecaa3f009468c9ea432a477c7f49a224524b2a1e0e005fb605`，與檔頭一致（審稿期間未改）。行號指這個版本。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。
- `register-scan.sh`：長句 18（最長 L34 82 字、L135 80 字、L210 80 字）、但書 3/97 段（3%）、引述區塊 10（都是自我檢查）、數字 ≥4 的段落 8（手算例與頁碼範圍，本篇主題就是算數字，可接受）、姓名主詞 1（Chen et al. 出處括號）、模板化轉折 0、英文術語 21（多為 benchmark 名與指標名）。
- `pnpm check:references`：本篇兩條 ERROR 都是 `-en` 未產出（本篇與第 8 堂英文版），依指示忽略。
- `check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0。
- 站內連結六篇（作業 2、第 4 堂、CS109 第 4／16 堂、CMU 11-768 作業 2、CS329A 第 17 堂）都存在；`#建自己的評估集` 對得上作業 2 的 H2（L355）；`#課程影片來源` 對得上本篇 H2。第 4 堂確實有「Model × Harness」。
- 外部連結 22 個 `curl` 全部 200，只有 openai.com 回 403（擋機器人，用 r.jina.ai 讀得到全文）。
- 全文沒有 diagram 區塊，見 should-fix 7。
- `<details>` 裡的 Python 抽出來實跑（`python3 -I`）：輸出 `0.9 0.3`、`0.7`、`0.5`，與註解一致。

### 事實抽驗

投影片抽 25 頁（`pdftotext -layout -f N -l N`；p28、p29、p33 轉成圖看）：p4 大綱兩項；p6 零件四項與端到端三項；p8 五列表格（p9 是同頁重複）；p10 三組指標、pass^k 由 τ-bench 提出、cache miss；p11 虛擬碼；p12–13 GAIA 466 題、只評最終答案、「Does not measure: send email, book a flight, modify a database」；p14 BFCL 訂機票例、捏造 passenger_id、get_weather、V4 web search／memory、看分項；p15 WebArena 812 題、accessibility tree、Verified 拿掉 LLM 評審；p16 OSWorld 369 題、截圖、2.0 的 108 個長流程與部分給分；p17 SWE-bench 五個變體；p18–19 τ-bench basic economy、r＝r_action×r_output、「passk is deliberately stricter than pass@k」；p20 89→66、8 小時、四類任務；p21 介於 SWE-bench 與 OSWorld、不需滑鼠座標；p22 175 題、S_partial 公式與 0.25／0.44／1.00；p23 八列總表；p25 四層與「realistic tools ⟺ larger leakage surface」；p26 P＝f(…) 與「nowhere near sufficient」；p27、p30 三點與三個能力；p28 prompt 長度 21–100 最多；p29 166 個 session（40＋49＋13＋32＋24＋8＝166，11 個以上 32＋24＋8＝64）；p31 200 步 40 美元對 12 步 0.30 美元、三個難處、outcome-only／trajectory matching；p33 飽和定義、Still open 列；p34 演變表；p35 Pareto 支配定義。頁碼與內容都對得上。**不準的一處：L279 對 p32–33 的描述（must-fix 2）。**

課程筆記核對：L49 系統定義、L82–89 手算例與代入值、L108 n≥k 與「跑到第一次成功就停」、L127 p＝0.8、L129 paired bootstrap、L135 失敗也算錢、L137–147 A／B 表與每多解一題 10 美元、L172 兩種 harness、L176–186 退款三軌跡、L256「不從高分推論誠實」、L297–304 六點清單，都對得上。筆記另有一句正文沒帶到的重要條件（should-fix 2）。

外部來源抽 7 個：
- Chen et al. 2021（arXiv PDF）：「generate n ≥ k samples per task … calculate the unbiased estimator pass@k := E[1 − C(n−c,k)/C(n,k)]」；「One may be tempted to estimate pass@k with 1−(1−p̂)^k … biased in Appendix A」；附錄 A：代入法「results in a consistent underestimate」。L104、L108 Confirmed（方向見 nit 3）。
- τ-bench（arXiv PDF）：「pass^k (pass hat k), defined as the chance that all k i.i.d. task trials are successful, averaged across tasks」，估計式 pass^k＝E_task[C(c,k)/C(n,k)]；並說 pass@k 用於「code generation with good verification techniques (unit tests)」，pass^k 用於「customer service」。L78、L105 Confirmed。
- OpenAI〈Why we no longer evaluate SWE-bench Verified〉（r.jina.ai）：兩個理由「Tests reject correct solutions」與「Training on solutions」；「all frontier models we tested were able to reproduce the original, human-written bug fix … or verbatim problem statement specifics for certain tasks」；「audit of 138 … that OpenAI o3 did not consistently solve over 64 independent runs」「59.4% of the 138 problems contained material issues」；pylint `get_annotation` 例；「recommends reporting results for SWE-bench Pro」。L233、L254 Confirmed，但 L233 的「因此」只寫了一個理由（should-fix 4）。
- Agentic Benchmark Checklist（arXiv PDF）：「τ-bench contains intentionally unsolvable tasks—38% of the airline subset and 6% of the retail subset … an agent that does nothing still passes」。L253 Confirmed。
- Terminal-Bench 4.0 公告：「removed 8 tasks: saturation (2), refusals (2), public solutions (2) …」「saturated when all classes within all families of the latest generation of models solve it 5/5 times」「flat agent timeout of 8 hours」；並提到「fewer agent timeouts and errors than 3.0」「Why is this 4.0 instead of 3.1?」。L234、L281 Confirmed；但 2.0 與 4.0 中間還有 3.0（should-fix 1）。
- NIST CAISI（r.jina.ai）：GPT-5 用 curl 找 CTF write-up 交 flag；CVE-Bench 的 gpt-4o 送 `@/dev/urandom` 灌爆伺服器。L234、L252 Confirmed。
- GitHub issues（`gh issue view`）：SWE-bench #465 2025-09-03 開、已關；SWE-Bench Pro #93 2026-04-29 開、**今天仍是 OPEN**。L235、L238 Confirmed（見 nit 6）。

手算全部用 Python 重算（含窮舉 5 取 2 的 10 種組合）：pass@2＝0.9、pass^2＝0.3；代入 0.84／0.36；B 題 pass@2＝1−C(4,2)/C(5,2)＝0.4；逐題平均 0.7／0.5；p＝0.8：0.992／0.512；A／B：1.43／2.00／每多解一題 10；TheAgentCompany 0.25／0.4375／1.00；綜合題 1：C(6,3)＝20、pass@3＝1、pass^3＝0.2；40/166＝24%、64/166＝39%。全部正確。估計式定義與符號（L104–105：1 − C(n−c,k)/C(n,k)、C(c,k)/C(n,k)，a<k 時 C＝0，n≥k）正確。

### 教學規格對照（概念導讀，單堂）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L34 | 有，與範圍卡一致 |
| 讀完能力一：拿重複試驗結果算 pass@k 與 pass^k | L80–96、L98–131、綜合題 1（L310–311） | 做到。先用「數挑法」走完 5 取 2，再給代入法的錯、再給逐題平均的錯，最後才在折疊裡給式子與程式；推理每步可跟。綜合題 1 有算式與解釋。可補一張圖，見 should-fix 7 |
| 讀完能力二：說出分數被灌水的方式 | L225–259、自我檢查 L258–259、綜合題 2–3 | 做到。四層洩漏各有真實案例，評分器被鑽有三個例子；自我檢查要讀者自己列「假進步」，判準可對 |
| 範圍卡指定例子（5 次成功 3 次） | L82–89 | 有，數字與範圍卡一致 |
| 範圍卡指定自我檢查（客服看哪個） | L149–150 | 有，答案正確 |
| 斷崖（不偏估計、paired bootstrap 放折疊、連 CS109） | L98–131 | 照斷崖表處理：本文先文字定義，估計式放 `<details>`，連 CS109 第 4、16 堂 |
| 各節自我檢查附答案或判準 | L65、L149、L188、L222、L258、L310–315 | 都有。L223 GAIA 那題的答案有交代「量不到什麼」與「為什麼影響不大」，好 |
| 不把非投影片內容歸給講者 | L30、L89、L184、L329–330 | 多數有標；L279 把投影片沒說的趨勢寫成投影片的結論（must-fix 2） |
| 沒解釋就用的術語 | L234 CTF、L236／L243 scaffold、L252 CVE、L74 F1 | 見 should-fix 6 |
| 研究過程漏進正文 | 全文 | 大致沒有。L38 是一整段頁碼地圖、L12 description 有「數字回原論文核對」，見 nit 7 |
| 篇幅與折疊 | 各 H2 字數：洩漏 5.3k、指標 5.2k、benchmark 4.2k、評測迴圈 2.4k、其餘 ≤2.2k | 合理。估計式與程式已折疊；八個 benchmark 一段一個、沒有展開到 note 的 48 個目錄，守住範圍卡邊界 |

### 🔴 must-fix

1. 外部數字與案例缺 inline link（post-review 8.5）。L252 NIST CVE-Bench 例子、L254 OpenAI「138 題、59.4%」、L281 Terminal-Bench 4.0「最新一代各家模型都 5 次全解」，三句都有具體數字或公司行為，但該句沒有連結（只在前面的表格或 L213 連過）。改法：L252「NIST CAISI 的 CVE-Bench 例子」連到 `https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations`；L254「OpenAI 請工程師審查」連到 OpenAI 那篇；L281「Terminal-Bench 4.0」連到 `https://www.tbench.ai/news/terminal-bench-4-0`。
   修正：CVE-Bench 句的「NIST CAISI」、測試太窄句的「OpenAI」、飽和段的「Terminal-Bench 4.0」都加上 inline link。
2. L279 與 H2「benchmark 越來越快被追上」和投影片數據不符。L279 說「早期的 benchmark 要好幾年才被追上，近年的 agent benchmark 常在一兩年、甚至幾個月內就接近飽和」。p32 的六個例子是 GLUE 14 個月、MMLU 39 個月、GPQA Diamond 10 個月、SWE-bench Verified 22 個月、ARC-AGI-2 11 個月、ARC-AGI-3 6 個月（星號未註明）：最早的 GLUE 只花 14 個月，不是「好幾年」；「幾個月」的例子是 ARC-AGI 這類推理題，不是 agent benchmark。p33 的 agent 類（深紅）裡，OSWorld 與 SWE-bench Verified 都花了兩年上下，WebArena 從 2023 到現在還開著。投影片標題是「Benchmarks saturate quickly」，沒有說「越來越快」。改法：H2 改成「benchmark 很快就飽和」；L279 改成「p32 列了六個例子：GLUE 14 個月、MMLU 39 個月就到人類水準，SWE-bench Verified 22 個月從 33% 到 95%，ARC-AGI-3 半年內從 0.5% 到 62.7%。p33 把時間軸攤開：不管哪一代，多數 benchmark 都在幾年內飽和。」其餘照留。p32 這些數字查證表 #21 標 Not checked，正文寫成「投影片的數字」即可，不必另查。
   修正：H2 改「benchmark 很快就飽和」；L279 照建議改寫，註明「以下是投影片上的數字」（GLUE 14 個月、MMLU 39 個月、SWE-bench Verified 22 個月 33%→95%、ARC-AGI-3 半年 0.5%→62.7%），並改成「不管哪一代，多數 benchmark 都在幾年內飽和」，回 p32 文字與 p33 圖對過。

### 🟡 should-fix

1. L213 與 L234 的 Terminal-Bench 題數讀者對不起來。L213 寫「2.0 版有 89 題，4.0 版刪到 66 題」，L234 又寫「4.0 刪掉的 8 題」；讀者會算 89−8＝81≠66。公告說 4.0 是相對 3.0 刪了 8 題（還修了 19 題），2.0 和 4.0 中間有 3.0。改法：L213 改「2.0 版有 89 題，到 4.0 版剩 66 題、每題給 8 小時」；L234 改「Terminal-Bench 4.0 比 3.0 再刪掉的 8 題裡，有 2 題……」；L281 同樣寫「4.0 刪掉的 2 題飽和題」可不動。
   修正：回 tbench.ai 公告確認：3.0（https://www.tbench.ai/news/terminal-bench-3-0）是另起的一組 74 題（"Our first release contains 74 tasks across 7 domains"），4.0 再刪 8 題剩 66。L213 改寫為 2.0 89 題 → 3.0 換成更難的 74 題 → 4.0 再刪 8 題剩 66 題、每題 8 小時，並點出投影片的「89 → 66」中間隔了一版；L234 改「4.0 比 3.0 刪掉的 8 題」；參考資料補 3.0 公告。
2. pass@k 少了課程筆記最重要的一個條件。L78 和 glossary L16 說 pass@k「適合寫程式這類有測試可以挑出正確版本的情境」，但沒說這個測試必須是部署時真的拿得到的。筆記原文：「It does not supply a way to select the successful candidate without a verifier」「Retrying until success requires a deployable success detector … Hidden benchmark tests cannot serve as a free selector for the agent」。讀者是用 coding agent 的工程師，最容易犯的就是拿 benchmark 的隱藏測試當挑選器、報出漂亮的 pass@k。改法：L78「適合寫程式這類有測試可以挑出正確版本的情境」後補一句：「前提是部署時你手上真的有這個測試；benchmark 的隱藏測試不能拿來替 agent 挑答案，否則 pass@k 量的是評分器，不是 agent（課程筆記）。」
   修正：L78 照建議補「前提是部署時你手上真的有這個測試……否則 pass@k 量到的是評分器，不是 agent（課程筆記）」；glossary 定義改「部署時真的有驗證器」。
3. L265「真實的用法是很多輪、很短的來回，跟 benchmark 的『一句完整指令』差很遠」概括過頭。p29 的分布是兩頭都有：只打 1 個的 40 個、2–5 個的 49 個，加起來 89 個（54%）在 5 個以內；p28 的 101–500 字元也有約 750 筆，跟 21–100 字元差不多。改法：「有四成 session 打了 11 個以上的 prompt，而且 prompt 最常見的長度只有一兩句話。至少這一大群用法是很多輪、很短的來回，跟 benchmark 的『一句完整指令』差很遠。」
   修正：改成「prompt 最常見的長度只有 21–100 個字元……至少這一大群用法是很多輪、很短的來回」，保留四分之一／四成兩個數字。
4. L233「OpenAI 因此停報這個 benchmark」只寫了一個理由。OpenAI 原文列兩個：測試會拒絕正確解（59.4%，正文放在 L254）與訓練時看過解答。改法：L233 句末改成「這是 OpenAI 停報這個 benchmark、改報 SWE-bench Pro 的兩個理由之一（另一個是測試寫得太窄，見下一節）」。
   修正：回 OpenAI 原文確認兩個理由（Tests reject correct solutions、Training on solutions）；L233 改「這是 OpenAI 停報這個 benchmark、改報 SWE-bench Pro 的兩個理由之一，另一個是測試寫得太窄，見下一節」。
5. L89「0.36 比 0.3 高，代入法會把一致性看得比實際好」，「實際」用詞不準。0.3 也只是估計，不是真值。代入法對 pass^k 是在期望上偏高（E[p̂²]＝p²＋p(1−p)/n），這句話的方向對，但寫成「比實際好」像是說 0.3 是真值。改法：「代入法平均來說會把一致性估得太樂觀；這一組資料就是 0.36 對 0.3。」
   修正：與 nit 3 合併改寫：「代入法對兩個指標錯的方向相反：pass@k 平均會被估得太低（Chen et al. 附錄的結論，這組資料是 0.84 對 0.9），pass^k 平均會被估得太樂觀（0.36 對 0.3）。所以要逐一數組合。」不再用「比實際」。
6. 沒解釋就用的術語：L234 CTF（建議「CTF（資安搶旗賽）題目」）、L236 與 L243 scaffold（本篇第一次出現，建議 L236 寫「scaffold（包住模型的外層框架，也就是 harness）」，作業 2 導讀用的就是這個說法）、L252 CVE（「某個已知漏洞（CVE）」改成「某個公開編號的已知漏洞（CVE）」即可）、L74 F1（「正確率或 F1（同時看找得準與找得全的分數）」）。
   修正：CTF 加「（資安搶旗賽）」；scaffold 在洩漏表第一次出現處加「（包住模型的外層框架，也就是 harness）」；CVE 改「某個公開編號的已知漏洞（CVE）」；F1 加「（同時看找得準與找得全的分數）」。
7. 圖表（post-review 9.3）：全文 0 張圖。最值得畫的是 L82–85 的 5 取 2：把 10 種挑法排成一張 10 格小圖（或 5×5 上三角），標出 3 格「兩次都成功」、1 格「兩次都失敗」、6 格「一成一敗」，讀者一眼就看到 pass@2＝9/10、pass^2＝3/10，對統計只到入門的讀者比文字快很多。次選：L176–186 退款三軌跡畫成三條並排的時間軸（確認、退款、回報三個事件的先後），凸顯第二條是「順序錯、結果對」。建議至少做前者。
   修正：照 diagram skill 的熱力圖版型畫了 5 取 2 的 4×4 上三角圖（10 格，格內寫成功次數與「都成功／一成一敗／都失敗」，唯一「都失敗」那格用 dg-outline--accent 標出），放在 pass@2／pass^2 兩個條列之後。`scripts/diagram-preview.ts` ✓ no overlapping, clipped or tiny text；看過淺色、深色、375px 手機三張截圖，深色模式格內小字改用 dg-text--ink 提高對比，viewBox 收窄到 548。手機上是框內左右捲動（元件本身的設計），整頁不橫向捲動。退款三軌跡的次選圖沒畫（表格已清楚）。

### 🟢 nit

1. L193「投影片花了十頁介紹八個 benchmark（p12–22）」：p12–22 是 11 頁。改「十一頁」或刪頁數。
   修正：改「十一頁」。
2. glossary L17「同一組試驗，pass@k 只會比單次成功率高」：p＝0 或 1 時相等，改「不會比單次成功率低」。
   修正：改「pass@k 不會比單次成功率低」。
3. L89 可補一句方向：Chen et al. 附錄說代入法對 pass@k 是「一致地低估」（例子裡 0.84 < 0.9）。兩個指標用代入法，錯的方向剛好相反：pass@k 看起來更差、pass^k 看起來更好。這句能讓讀者記住為什麼要逐一數組合。
   修正：併入 should-fix 5 的改寫。
4. L127「單次成功率 80% 的 agent，連續三位客戶都服務成功的機率只有一半左右」：pass^k 的定義是同一題重跑 k 次。三位客戶要算成同一題，得假設他們的請求一樣、成功率都是 0.8。改「同一類請求連續來三次、三次都辦好的機率只有一半左右」。
   修正：改「同一類請求連續來三次、三次都辦好的機率只有一半左右」。
5. L139–146 A／B 表少了「兩邊都失敗 20 題」一列（筆記有）。讀者加總 65＋5＋10 只得 80，會疑惑剩下 20 題去哪。
   修正：表格補「兩邊都失敗 20 題」一列。
6. L238 SWE-Bench Pro issue #93：到 2026-10-22 仍是 OPEN；課程筆記另記 SWE-Bench Pro Public V2（2026-09-22）在修過題目與評分器後取代舊版公開題組，不確定這個漏洞修了沒有。可在句中加「（2026 年 4 月回報，截至 10 月 issue 仍開著）」，讓讀者自己去看。
   修正：句中加「2026 年 4 月回報，截至 10 月 issue 仍開著」。
7. L38 整段是頁碼地圖，L12 description 尾句「數字回原論文核對」是查證過程。description 那句可刪；L38 可縮成一句「投影片分四段：怎麼量、八個 benchmark、評測的難處、評測的演變；作業 3 的評分方式留到作業 3 那篇」，頁碼留在各節即可。
   修正：description 刪「數字回原論文核對」；L38 縮成「投影片分四段：怎麼量、八個代表 benchmark、評測的難處、評測的演變。最後一頁預告作業 3 的評分方式；大綱列的成本優化移到第 8 堂。」

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 18 句（約 97 段；多為導言問句與列舉句）、但書段落 3%（綠）、引述區塊 10（誤判：全是自我檢查的 `>` 區塊）、單段數字 ≥4 有 8 段（多為手算例與頁碼範圍，本篇主題就是算數字，保留）、姓名主詞 1（Chen et al. 出處括號，保留）、模板化轉折 0、英文術語 21（多為 benchmark、pass@k 等專名與指標名，保留）。

| # | 位置 | 指標 | 問題 | 處理 |
|---|---|---|---|---|
| 1 | details 配對比較 | 長句（88 字） | 一句講配對與 bootstrap 兩件事 | 拆兩句 |
| 2 | 成本段開頭 | 長句（96 字） | 建議與「失敗也算錢」串在一起 | 拆句 |
| 3 | 評測迴圈三部件 | 長句（78 字） | 三個部件用分號串 | 改編號清單 |
| 4 | 導言第二段 | 長句（82 字） | 問句串 | 保留：問號斷開 |

`pnpm check:tw`：0 blocking、0 to review。`check-course-titles.mjs`（本篇；以及整系列現存檔一起傳）：0 issue。`check-course-guide-layout.mjs`（中文 12 篇）：0 issue。`check-process-leak.mjs`：exit 0。`check:references`：本篇只有 `-en` 尚未產出的一條錯誤。

修正：1–3 已改；4 保留。程式區塊從文章抽出實跑，輸出 `0.9 0.3`、`0.7`、`0.5`，與註解一致。

## 作者修正（回應 post-review）

修正後 sha256：`eeb3467af3111811b7679eb7deed595b643ac4295564e9df231c4380239b700d`，**尚未複審**。另依協調者指示，導言「怎麼讓它記得事情」補第 6 堂站內連結（/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability，檔案已在工作目錄）。重跑：`check:tw` 0 blocking；`register-scan.sh` 長句 22（新增句多為 60–70 字）、但書 3%、模板化轉折 0；`check-course-titles.mjs`（本篇）0 issue；`check-course-guide-layout.mjs`（中文 12 篇）0 issue；`check-process-leak.mjs` exit 0；`check:references` 本篇只剩 `-en` 未產出；`diagram-preview.ts` ✓；`<details>` 程式重跑輸出不變（0.9 0.3／0.7／0.5）。


## 複審

複審者：同一位獨立審稿子代理，2026-10-22。審的檔案 sha256 `eeb3467af3111811b7679eb7deed595b643ac4295564e9df231c4380239b700d`，行號指這個版本。

### 機械檢查

- `pnpm check:tw` 0／0；`check-process-leak.mjs` exit 0；`check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check:references` 本篇只剩 `-en` 未產出的一條。
- `diagram-preview.ts`：1 張圖，✓ no overlapping, clipped or tiny text；看過深色桌面截圖，格內字清楚。深色模式下「一成一敗」和「都失敗」兩種底色很接近，但格內有文字、都失敗那格有外框，不影響判讀。
- `<details>` 程式重新抽出來跑（`python3 -I`）：`0.9 0.3`、`0.7`、`0.5`，與註解一致。
- 熱力圖用 Python 解析 SVG 驗證：共 10 格，正好對應 5 取 2 的 10 種組合（i<j）。每格的數字等於第 i、j 次裡成功的次數（第 1–3 次成功、第 4–5 次失敗），顏色等級也和數字一致；都成功 3 格、一成一敗 6 格、都失敗 1 格，圖例和 desc 寫的 3／6／1 對得上，也和 L84–85 的 1/10、3/10 一致。

### 逐項核對

| 項目 | 結果 |
|---|---|
| must-fix 1 inline link | 到位：L317 NIST、L319 OpenAI、L346 Terminal-Bench 4.0 都在句內加了連結 |
| must-fix 2 飽和段 | 大致到位：H2 已改「benchmark 很快就飽和」，「越來越快」的說法拿掉了。回 p32 原文核對，GLUE 14、MMLU 39、SWE-bench Verified 22 個月 33%→95%、ARC-AGI-3 6 個月 0.5%→62.7% 數字都對；「多數 benchmark 都在幾年內飽和」符合 p33；仍然開放的那幾個也和 p33 的 Still open 一致。留下兩處小錯，見下方 1、2 |
| should-fix 1 Terminal-Bench 題數 | 大致到位：回 tbench.ai 3.0 公告確認「Our first release contains 74 tasks across 7 domains」；4.0 公告寫刪 8 題，74−8＝66，數字自洽。L299 改成「4.0 比 3.0 刪掉的 8 題」也正確。留下一處小錯，見下方 3 |
| should-fix 2 pass@k 前提 | 到位（L78、glossary L16） |
| should-fix 3 作業 1 用法 | 到位（L330） |
| should-fix 4 OpenAI 兩個理由 | 到位（L298） |
| should-fix 5＋nit 3 代入法方向 | 到位（L153），方向與 Chen et al. 附錄的「consistent underestimate」一致 |
| should-fix 6 術語 | 到位：CTF、scaffold、CVE、F1 都補了說明 |
| should-fix 7 圖 | 到位：見上方熱力圖驗證 |
| nit 1、2、4、5、6、7 | 都改了：十一頁、「不會比單次成功率低」、「同一類請求」、補上「兩邊都失敗 20 題」、issue #93 加日期、description 與 L38 也縮短了 |

### 仍須修（都是一行就能改完）

1. L344「p32 列了六個例子」，後面只列了四個。改成「p32 列了六個例子，其中四個：」，或把 GPQA Diamond 10 個月、ARC-AGI-2 11 個月補上。
2. L344「GLUE 14 個月、MMLU 39 個月就到人類水準」：p32 寫的是 GLUE「Human level (87.1) in 14 months」，MMLU 是「Expert level (89.8) in 39 months」。改成「GLUE 14 個月到人類水準、MMLU 39 個月到專家水準」。
3. L278「投影片寫『89 → 66』，中間其實隔了一版」：3.0 公告寫的是「Terminal-Bench 3.0 expands on Terminal-Bench 2.1」，所以 2.0 和 4.0 中間還有 2.1 和 3.0 兩個版本。改成「中間還隔了 2.1 與 3.0」，或直接寫「中間還有別的版本」。

沒發現其他新錯。

結論：上面三項改完即可通過，不需要再複審（三項都是一行措辭，改法已寫明）。

修正（2026-10-22，主 session）：照複審三項改。L344 改為「p32 列了六個例子，以下挑其中四個」，MMLU 改為「39 個月到專家水準」（p32 原文 Expert level）；L278 改為「中間還隔了 2.1 與 3.0 兩版」（Terminal-Bench 3.0 公告原文提及 2.1，經 r.jina.ai 讀取確認）。check:tw 0 blocking。

最終結論（2026-10-22，複審者，sha256 `08e3a9b833f926db…`）：三處都核對過。L344 已改為「以下挑其中四個」，MMLU 也改成「專家水準」；L278 改為「中間還隔了 2.1 與 3.0 兩版」，和 3.0 公告一致。結論：通過。
