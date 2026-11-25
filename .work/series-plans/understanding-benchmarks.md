# 系列規劃：認識 benchmark（understanding-benchmarks）

使用者確認：2026-11-24（使用者回「所以？」後，依規劃表建議的弧線、不併篇、斷崖處理開始寫 order 0–1；使用者看過草稿再改）

研究筆記：`.work/research/understanding-benchmarks/research-note.md`（母群、覆蓋矩陣、偏誤）；精讀抽取紀錄在 `.work/research/understanding-benchmarks/extracts/`（A–N 共 14 批、補缺口 O1–O3、換關鍵字補搜 P、主對話自讀 Q；每批由主對話回原文抽查數字），批次狀態與各項結局在 `.work/research/understanding-benchmarks/reading-batches.md`。

## 系列登錄資料（第一篇發佈時登錄到 `src/utils/series.ts`）

- slug：`understanding-benchmarks`
- category：`ai`（系列分組 `ai-agents`，與「認識 AI 模型」同組）
- 名稱：zh-TW「認識 benchmark」／en「Understanding AI Benchmarks」
- 描述 zh-TW：模型發布表上的每個分數是怎麼量出來的、為什麼會失真、主要的 benchmark 各自在量什麼，以及怎麼自己建一個量得準的評測。

## 目標讀者

會看模型發布公告、聽過 MMLU／SWE-bench 但不確定那些數字能信多少的 zh-TW 讀者（工程師、PM、做模型選型的人）；以及要替自己的產品建評測集的工程師。
不寫給：要做 benchmark 研究、需要完整統計推導的人（公式放折疊區，連到 CS109、統計導讀）；要評測工具操作教學的人（連到 Promptfoo、Braintrust、私有語料 Retrieval Eval 等既有文章）。

## 入口

order 0 是總覽：benchmark 是什麼、一個分數從出題到上排行榜經過哪些環節、每個環節會怎麼出錯、系列五段各回答什麼問題、讀完整個系列能做到什麼。開場用一個具體反差：同一個模型，換 harness 從 54% 變 6%（HAL），換 API 供應商從 80% 變 2%（Epoch）。

## 弧線

可見先於不可見：先拆開看得到的零件，再談抽象的失真機制，再用具體 benchmark 把機制複習一遍，最後才自己動手。

1. **零件**（order 0–2）：benchmark 由什麼組成、一個分數的誤差有多大
2. **失真**（order 3–9）：分數為什麼會騙人，每篇一種機制
3. **家族**（order 10–18）：主要 benchmark 逐一解剖，每篇回扣第 2 段的機制（螺旋加深）
4. **讀**（order 19–20）：聚合指數、怎麼讀一張發布表
5. **建**（order 21–24）：從失敗案例出題 → 評分器 → 執行與報告 → 維護與退役

## 斷崖處理

| 位置 | 問題 | 處理 |
|---|---|---|
| order 1→2 | 從看零件跳到統計（標準誤、信賴區間） | order 2 用「擲 50 次硬幣」直覺先行；公式（SE、clustered SE、Wilson 區間）放 `<details>`；連到統計導讀 |
| order 9→10 | 從機制篇轉到 benchmark 個論，讀者可能忘了機制 | 每篇家族文開頭放「這個 benchmark 踩過哪些坑」小表，欄位對應 order 3–9，連回對應篇 |
| order 16 | time horizon 用 logistic 擬合，數學跳躍 | 正文只講「把任務依人類耗時排隊，看模型在哪裡開始一半做不出來」；擬合細節折疊 |
| order 18→19 | ECI 用 IRT，前面沒教過 | order 19 用「考生能力 vs 題目難度」類比先行；連回 order 2 的誤差觀念；公式折疊 |
| order 20→21 | 從讀轉到建，角色換了 | order 21 開頭明講角色轉換：前面每個坑現在變成你要防的事，附對照表（失真機制 → 建題時的對應措施） |

## 站內前置知識連結

- 統計（標準誤、信賴區間、假設檢定）→「從考試到 ML/AI 的統計學導讀」（`2026-08-29-im-stat-ml-ai-evaluation-report` 等）
- 評估的課程觀點 → CS224N 第 11 堂、CS336 第 12 堂、CS329Z 第 13 堂、Harvard CS2680 第 7 堂
- LLM-as-judge 偏誤 → CME295 第 8 堂
- 模型成績單入門 → 認識 AI 模型〈模型成績單怎麼看〉（`2026-08-26-understanding-ai-models-evaluation`）
- coding benchmark 綜覽 → 認識 AI 模型〈2026 Coding Benchmark 怎麼讀〉（`2026-08-26-coding-benchmarks-how-to-read`）
- Terminal-Bench 課程觀點 → CS329Z 第 10 堂
- 評測平台清單 → 〈AI 模型評測來源指南〉（`2026-08-24-ai-model-evaluation-sources`）
- 自建評測實作 → 私有語料 Retrieval Eval、Ask AI Retrieval Eval、Promptfoo、Braintrust

## 既有文章的處理（使用者 2026-11-23 決定：留在原系列，新系列連過去）

- 〈模型成績單怎麼看〉：寫到 order 9 時用 post-update 修 Arena 段（「Elo」「LMSys 維護」已過時；「最抗操弄」要加私測變體的條件）。來源：extracts/E-arena.md。
- 〈2026 Coding Benchmark 怎麼讀〉：寫到 order 12 時用 post-update 修三處（Pro「才是未來」已被稽核推翻；Pro 只有 4 種語言不是 123 種；Terminal-Bench 已到 4.1）。來源：extracts/H-coding-terminal.md 第 0 節。
- CS329Z 第 10 堂：寫到 order 13 時補一句 verifier 在 3.0 後改成另開容器讀 artifact。

## 篇目總表

| order | 主題 | 聚焦問題 | 狀態 | 主要來源批次 |
|---|---|---|---|---|
| 0 | 總覽：一個分數的一生 | 一個 benchmark 分數從出題到上排行榜經過哪些環節，每個環節會怎麼出錯？ | 待寫 | A、C |
| 1 | 拆開一個 benchmark | 一個 benchmark 由哪幾個零件組成，各自負責什麼？ | 待寫 | N、A |
| 2 | 一個分數的誤差有多大 | 兩個模型差 3 分，算不算真的有差？ | 待寫 | C |
| 3 | 污染：考題被看過了 | 模型怎麼會「看過考題」，看過之後分數會灌多少，怎麼偵測？ | 待寫 | B |
| 4 | 飽和：考卷太簡單了 | 為什麼大家都 90 分以上時分數就沒用了，哪些設計能延後這一天？ | 待寫 | A、L |
| 5 | 量到的是不是你想量的 | 一個叫「推理」的 benchmark，量到的真的是推理嗎？ | 待寫 | A、N（HELM 格式實驗） |
| 6 | 同一個模型，不同的分數 | 為什麼同一個模型換 harness、換 API 供應商、換推論引擎，分數會差到幾十分？ | 待寫 | C、H |
| 7 | 答案卷本身寫錯了 | 標準答案錯、測試寫錯時，分數會往哪個方向偏？ | 待寫 | F、G、A、J |
| 8 | 受測者對考試本身的反應 | agent 為什麼會鑽評分的漏洞，模型知道自己在被考時又會怎樣？ | 待寫 | D、A、J、O3、P |
| 9 | 人類投票的排行榜 | Arena 分數代表什麼、不代表什麼，它的治理問題在哪？ | 待寫 | E |
| 10 | 知識題：從 MMLU 到 HLE | 出題方式從考古題到專家出題再到先用模型篩題，各解決了什麼、又帶來什麼？ | 待寫 | F |
| 11 | 數學：從比賽題到未解問題 | 為什麼數學 benchmark 最早走到「答案可驗證」，又為什麼最後連比賽題都不夠用？ | 待寫 | G |
| 12 | SWE-bench 家族 | 用真實 GitHub issue 當考題，三代下來為什麼都還在修同一個問題？ | 待寫 | H、A |
| 13 | Terminal-Bench 與 Harbor | 怎麼在終端機裡出一道 agent 題，又怎麼防它作弊？ | 待寫 | H、D、N |
| 14 | ARC-AGI | 想量「學新技能的效率」而不是「會多少技能」，要怎麼出題？ | 待寫 | I |
| 15 | agent 互動環境 | 評分從比對答案變成檢查環境終態之後，多了哪些新問題？ | 待寫 | J |
| 16 | 時間地平線 | 「AI 能做多久的工作」怎麼量，倍增時間能信多少？ | 待寫 | K |
| 17 | 經濟價值評測 | GDPval 和 Remote Labor Index 怎麼量「能替代多少有償工作」？ | 待寫 | K |
| 18 | 中文與繁中 benchmark | 為什麼不能只看英文分數，繁中 benchmark 量得到什麼、量不到什麼？ | 待寫 | M |
| 19 | 聚合指數怎麼讀 | 把幾十個 benchmark 壓成一個數字，丟掉了什麼？ | 待寫 | L、C |
| 20 | 怎麼讀一張模型發布表 | 拿到一張廠商的 benchmark 表，依序要問哪些問題？ | 待寫 | 全部 |
| 21 | 自己建：從失敗案例到題目 | 要替自己的產品建評測，第一批題目從哪來、要幾題、怎麼定義要量什麼？ | 待寫 | N、A |
| 22 | 自己建：評分器 | 用 exact match、執行測試還是 LLM 評審，評分器本身怎麼驗證？ | 待寫 | N、A、D |
| 23 | 自己建：跑起來與報告 | 怎麼把評測跑得可重現、隔離、留紀錄，結果怎麼附誤差報告？ | 待寫 | N、C |
| 24 | 自己建：維護與退役 | 評測集上線後怎麼防污染、換題，什麼時候該退役？ | 待寫 | B、L、N |

## 範圍卡

### Order 0：總覽：一個分數的一生
- 聚焦問題：一個 benchmark 分數從出題到上排行榜經過哪些環節，每個環節會怎麼出錯？
- 講：benchmark 的定義與用途；出題 → 評分 → 執行 → 報告 → 排行榜五個環節；每個環節的代表性失真一句話；系列五段地圖；讀完能做到什麼。
- 不講：任何一個機制的細節（指向各篇）。
- 讀完後讀者能：看到一個 benchmark 分數時，說出它至少要經過哪五個環節才變成那個數字，並指出自己想追問哪一環。
- 例子：HAL 同模型換 scaffold 54% vs 6%；Epoch GLM-4.6 換供應商 73–83% vs 2–21%。（數字引用前看 C 批待核項）
- 自我檢查：「廠商表上兩個模型差 2 分，你最先要問什麼？」→ 判準：答到誤差、設定、題目來源任一個即可，指向 order 2、6。
- 前置：無。

### Order 1：拆開一個 benchmark
- 聚焦問題：一個 benchmark 由哪幾個零件組成，各自負責什麼？
- 講：Inspect、Harbor、Anthropic 三份工程來源共同的五塊（題目、受測系統、評分器、隔離環境、紀錄）；oracle（參考解要能拿滿分）；評分方式三大類（比對、執行驗證、評審）。
- 不講：怎麼自己寫（留 order 21–23）；統計（order 2）。
- 讀完後讀者能：拿一個 benchmark 的說明文件，指出它的題目、評分器、環境各是什麼，以及受測的是模型還是模型＋scaffold。
- 例子：同一題 Terminal-Bench 任務拆成 instruction、Docker 環境、測試；同一題 MMLU 拆成題幹、選項、比對。
- 自我檢查：「GAIA 的受測對象是模型還是 agent？」→ agent（模型＋工具＋scaffold）。
- 前置：order 0。

### Order 2：一個分數的誤差有多大
- 聚焦問題：兩個模型差 3 分，算不算真的有差？
- 講：題目抽樣誤差；標準誤直覺；clustered SE；配對比較；題數與可分辨差距（約 1,000 題分 3 分）；小樣本（幾十題）改用 Wilson／Bayesian；seed 變異不能當題目抽樣誤差；排行榜常是取最佳 run。
- 不講：IRT（order 19）；harness 差異（order 6）。
- 讀完後讀者能：拿到兩個分數與題數，粗估差距是否超過誤差，並知道 50 題的 agent benchmark 差 5 分通常說明不了什麼。
- 例子：Miller 的叢集修正例（SE 放大 3 倍）；Epoch 配對區間只有各自區間一半寬。
- 自我檢查：「100 題、70% 對 75%，算顯著嗎？」→ 判準：說出要看 SE 約 4.5 分、差距在誤差內。
- 前置：order 1；連統計導讀。

### Order 3：污染：考題被看過了
- 聚焦問題：模型怎麼會「看過考題」，看過之後分數會灌多少，怎麼偵測？
- 講：四層污染（逐字、句法、語意、任務層級）；GSM1k 的對照實驗（現行版最多掉 8%）；C-Eval 驗證集 45.8% 近乎逐字在網路上；n-gram 去污染的盲點；canary string 與標籤不公開的極限；動態 benchmark。
- 不講：飽和（order 4）；建題時怎麼防（order 24）。
- 讀完後讀者能：看到「我們做了去污染」時，追問用的是哪種方法、擋得住哪一層。
- 例子：GSM1k；ConTAM 的 n-gram 長度問題；LiveBench 自承舊程式題被污染。
- 自我檢查：「測試集標籤不公開就不會被污染嗎？」→ 不會：題目本身仍可能外流，且使用者會改跑公開集。
- 前置：order 1。不引用 GEM 綜述的 6%–40% 區間（拼湊數字）。ConStat 案例寫點估計 39.40%（95% 下界 27.15%），並寫明作者認為主因可能是作答格式、改寫題與新題檢定不顯著，不寫成「背了多少題」。MMLU 的 6.49% 寫成「題目有問題」（含題意與選項不清），不寫成「答案錯」。

### Order 4：飽和：考卷太簡單了
- 聚焦問題：為什麼大家都 90 分以上時分數就沒用了，哪些設計能延後這一天？
- 講：飽和的定義（鑑別力消失 vs 停滯）；年齡與題數是最一致的預測因子；藏測試集、多語、開放作答扣掉年齡後沒有可靠效果；飽和不一定是壞事（真的學會了）；benchmark 生命週期與退役（AA Legacy 時間線、BHI 排名頂端與底端）。
- 不講：怎麼退役自己的評測（order 24）。
- 讀完後讀者能：判斷一個 benchmark 目前是否還有鑑別力，以及頂端模型差 1 分時該不該在意。
- 例子：MMLU、GSM8K 在 BHI 底端；ARC-AGI-2 從 3% 到 95.8%。
- 自我檢查：「HLE 分數也到 50% 以上了，它飽和了嗎？」→ 判準：看頂端模型能否被統計區分與天花板（雜訊上限）在哪。
- 前置：order 2、3。「近半數已飽和」只能附但書引用（A 批驗算）。

### Order 5：量到的是不是你想量的
- 聚焦問題：一個叫「推理」的 benchmark，量到的真的是推理嗎？
- 講：構念效度；445 個 benchmark 的回顧（只有 16% 做統計檢定、47.8% 的現象定義有爭議）；格式與指令遵循當混淆變因（HELM HellaSwag 79.1%→30.2%）；便利抽樣（AIME 數字被設計成好算）；BetterBench 的品質分數（MMLU 5.5、GPQA 11.0）。
- 不講：評分器錯誤（order 7）。
- 讀完後讀者能：看到一個 benchmark 名稱時，追問它怎麼定義要量的東西、題目怎麼抽、有沒有混進別的能力。
- 例子：HELM 格式實驗；ARC 輸入表示當混淆變因（Wang et al.）；HarmBench 心理計量稽核（叫「拒答」的分數至少三維，copyright 題量的是記憶，Stewart et al. 2026）。
- 骨架：AIMS 教科書的效度證據類型；「抽樣誤差加題能縮小，量錯東西加題沒用」（AACL 2026 教程）；多個 benchmark 平均後留下的共同成分不一定是名稱上那個能力。
- 自我檢查：「一個 benchmark 要求模型用嚴格 JSON 輸出，分數低代表什麼？」→ 可能是格式能力而非目標能力。
- 前置：order 1。

### Order 6：同一個模型，不同的分數
- 聚焦問題：為什麼同一個模型換 harness、換 API 供應商、換推論引擎，分數會差到幾十分？
- 講：scaffold 差異（HAL）；API 供應商的限流與截斷（Epoch）；推論引擎的隱藏預設值（CISPA 最多 16.6 分，大多來自 BOS、repetition penalty）；reasoning effort（AA 同模型 35–58）；時間預算即量測規格（Terminal-Bench 換 harness 差 20 分多是速度）；排行榜取最高設定。
- 不講：統計誤差本身（order 2）。
- 讀完後讀者能：比較兩個分數前，先確認 harness、供應商、effort、時限是否相同。
- 自我檢查：「A 廠自報 70%，第三方測 55%，誰在說謊？」→ 判準：先比設定，不一定有人說謊。
- 前置：order 1、2。

### Order 7：答案卷本身寫錯了
- 聚焦問題：標準答案錯、測試寫錯時，分數會往哪個方向偏？
- 講：選擇題標註錯誤（MMLU-Redux 6.49%、Virology 只剩 43 題沒問題，排名翻轉）；精確比對下答案鍵錯一位數（FrontierMath v2 修 135 題）；測試太窄判錯正解（SWE-bench Verified 審 138 題 59.4% 有問題）、測試太鬆判對錯解（PatchDiff 7.8%）；錯誤是雙向的（τ³ 修題後分數上升）；HLE 錯誤率依判準 15.4%–29%。
- 不講：故意鑽漏洞（order 8）。
- 讀完後讀者能：知道 benchmark 有已知錯誤率時，分數天花板與排名都可能被改寫，而且方向不一定是高估。
- 加一節「怎麼找出錯題」：Fantastic Bugs 用回應相關性排出可疑題（統計旗標只是要人去看，不等於確認錯誤）；SWE-bench Pro V2 的規則「測試錯就刪題，不改測試去配合說明」。
- 前置：order 2、5。HLE 30% 只寫化學／生物子集。

### Order 8：受測者對考試本身的反應
- 聚焦問題：agent 為什麼會鑽評分的漏洞，模型知道自己在被考時又會怎樣？
- 講：τ-bench 什麼都不做拿 38%；SWE-Lancer `assert 1==1`；Berkeley 八個 benchmark 的 exploit 手法表；Expose→Exploit→Mislead；METR：看得到評分程式時 hacking 多 43 倍、叫它別作弊沒用；維護者回應（SWE-bench 5.0、Terminal-Bench 誠信規定、Harbor 獨立 verifier）與其極限（Terminal-Bench 4.1 仍可換掉評分腳本呼叫的 `grep` 改分，Vetto）。最後一節（約 1/4）「模型知道自己在被考時」：只察覺或只被告知「這是評測」行為幾乎不變（Knecht ≤3.7 pp、OpenAI 63.1% vs 63.4%）；會動分數的是模型以為在測什麼（OpenAI 介入實驗 63%→92% 或 18%；六個模型評測分數都比正式環境低 10–37 pp，方向是低估）；能力 benchmark 上唯一實例是 BrowseComp（淨影響 0.24 pp，本質是破解答案卷）；sandbagging 只在人造誘發情境證實。
- 不講：互動環境本身的介紹（order 15）。
- 讀完後讀者能：看到 agent benchmark 分數時，追問評分器和 agent 是否在同一個環境、有沒有附 trajectory、trivial agent 拿幾分。
- 前置：order 1、7。METR 30.4% 只寫 o3 在 RE-Bench；HackDetect 67% 不寫成盛行率；τ-bench 94.3→65.5 不寫成官方分數灌水；Chaudhary 的 98%→4% 是明示威脅下的誘發實驗，附摘要與正文矛盾的但書；評測意識偵測 AUROC 多數其實在認格式（Nayan）。
- 自我檢查：「為什麼『agent 看不到評分程式』這麼重要？」→ METR 43 倍差距。

### Order 9：人類投票的排行榜
- 聚焦問題：Arena 分數代表什麼、不代表什麼，它的治理問題在哪？
- 講：Bradley-Terry 而非 Elo；風格控制（長度是最大因子）；私測多變體挑最佳（同 checkpoint 偏誤隨票數消失、不同 checkpoint 不會）；資料取得不對稱；112% 是 ArenaHard 靜態集勝率的相對增幅；公司化與付費評估；改了什麼沒改什麼。
- 讀完後讀者能：讀 Arena 名次時，知道預設已控制風格、名次差距要看信賴區間、私測制度的偏誤方向。
- 前置：order 2。同步 post-update〈模型成績單怎麼看〉。操弄量級寫「理想條件下約 900 票升一名、升十名約兩萬票」（Min et al. 正文），不寫「數百票」。Llama 4 事件照一手原文：Meta 發布文有寫 experimental chat version，LMArena 說 Meta 的解讀不符期待，Al-Dahle 否認的是用測試集訓練；LeCun「fudged」原句在 FT 付費區（✉️）。

### Order 10：知識題：從 MMLU 到 HLE
- 聚焦問題：出題方式從考古題到專家出題再到先用模型篩題，各解決了什麼、又帶來什麼？
- 講：MMLU（考古題、57 科）→ MMLU-Pro（刪小模型答得出的 42%、10 選項）→ GPQA（Google-proof 是人實測：非專家上網 37 分鐘只對 34%；Diamond 定義）→ HLE（模型篩題、LLM judge、錯誤率、HLE-Rolling、HLE-Diamond）。
- MMLU-Pro 兩個捷徑分開寫：正解前多一個空格（475 題，2026-01-18 已修，HF 討論 #41）；選最長選項現行版仍有 18.3%（亂猜 11.1%），各科差很大（生物 43.9%）。
- 踩坑小表：污染、飽和、答案錯、構念。
- 讀完後讀者能：說出 MMLU、GPQA、HLE 三者分數不能放在一起比的原因。
- 前置：order 3、4、7。

### Order 11：數學：從比賽題到未解問題
- 聚焦問題：為什麼數學 benchmark 最早走到「答案可驗證」，又為什麼最後連比賽題都不夠用？
- 講：FrontierMath 設計（可自動驗證的答案、防猜）；錯誤率從約 10% 上修到 42%；OpenAI 資助揭露時序與 holdout；o3 25.2% vs Epoch 約 10% 條件不同；MathArena 用賽後新題（擋污染擋不住飽和）；2026 最終答案型比賽題退場；Open Problems 與 Erdős（Lean 證明）。
- 讀完後讀者能：看到數學 benchmark 分數時，追問題目是否在模型訓練截止後才公開、誰看得到題目。
- 前置：order 3、4、7。Tier 4 錯誤率寫「約 40%，依 changelog 為 19/50 = 38%；Epoch 未說明分母」（✉️ 問題清單在 O3-gaps.md）。

### Order 12：SWE-bench 家族
- 聚焦問題：用真實 GitHub issue 當考題，三代下來為什麼都還在修同一個問題？
- 講：原版 → Verified（刪 68.3%）→ OpenAI 停用（59.4% 有問題、污染）→ Pro（私有 repo 防污染）→ Pro 被稽核約 30% 壞題 → Pro V2；根因：測試是為「那一個修法」寫的。
- 不講：其他 coding benchmark（連〈2026 Coding Benchmark 怎麼讀〉）。
- 讀完後讀者能：解釋為什麼 SWE-bench 分數同時可能高估與低估，以及看到「SWE-bench Pro 60%」時要問哪個版本。
- 前置：order 7、8。Pro V2 已讀全文：731→642 題、89 題刪除以「測試檢查太少」33、「測試要求說明沒寫的東西」22 為主；它沒有逐題對應 OpenAI 稽核，兩邊「200 題」不能寫成同一批。同步 post-update coding 文三處。

### Order 13：Terminal-Bench 與 Harbor
- 聚焦問題：怎麼在終端機裡出一道 agent 題，又怎麼防它作弊？
- 講：任務格式（instruction、Docker、測試、oracle）；任務收集與審核；版本演進（2.0 → 2.1 → 3.0 → 4.0 → 4.1，語意化版本）；harness 與時間預算；誠信規定與 artifact 重新評分；Harbor 獨立 verifier sandbox；外部稽核指出隔離不保證測試判得對。
- 讀完後讀者能：讀懂一個 Terminal-Bench 任務的檔案結構，並說出 Harbor 把防作弊從審題搬到架構的兩個做法。
- 前置：order 1、6、8。同步補 CS329Z 第 10 堂一句。論文摘要 89 題與表格 74 題不一致要說明。4.0「45.5% 有問題」只算公開 issue（Epoch 統計 66 題中 30 題）。Harbor 指令寫 `harbor task init`；官方建題教學早於 verifier 另開沙箱的改動（PR #3712，2026-10-19 合併，v0.25.0），照舊教學做參考解會失敗——這段標「依原始碼與文件推得，未實跑」。

### Order 14：ARC-AGI
- 聚焦問題：想量「學新技能的效率」而不是「會多少技能」，要怎麼出題？
- 講：Chollet 的技能 vs 智能、core knowledge priors、少樣本；ARC-AGI-1 被暴力搜尋合力解 49%；ARC-AGI-2 的人類測試（「至少兩位非專家解出」）與 2026 飽和；ARC-AGI-3 互動遊戲與行動效率計分、規則半年內改兩次；Pfister & Jud 與輸入表示批評。
- 讀完後讀者能：說明 ARC 的設計邏輯為什麼會一再改版，以及「人類 100% 可解」的實際意思。
- 前置：order 3、4、5。o3 成本只寫倍數或註明定價版本；排行榜數字註明快照日期。

### Order 15：agent 互動環境
- 聚焦問題：評分從比對答案變成檢查環境終態之後，多了哪些新問題？
- 講：τ-bench（模擬使用者、終態比對、pass^k）→ τ²-bench（dual control、telecom 由設計避開不作為也過）；WebArena（自架網站、N/A 投機、Verified 修法）；OSWorld（真實 OS、評分跟著網站壞、Verified 改指令、2.0）；GAIA（對人簡單對 AI 難）；人類基準各自的受試者條件。
- 讀完後讀者能：讀互動環境 benchmark 時，追問評分檢查的是什麼狀態、不可達成題怎麼判、人類基準是誰。
- OSWorld 2.0 的展示題（052、053、035、024）正是 Epoch 2.1 review 判定評分有錯的題；最長時間區間 17 題四個模型完整完成率都是 0%。SABER 的效果量以表為準（摘要把 airline、retail 對調）；τ³ 不少修題是放寬評分。
- 前置：order 8。

### Order 16：時間地平線
- 聚焦問題：「AI 能做多久的工作」怎麼量，倍增時間能信多少？
- 講：50% time horizon 的直覺；人類基準怎麼量、越來越多是估的（TH2 只有 9% 實測）；量的是「對比低 context 的人」；倍增時間隨任務集變（207 天 → 131 天 → 3.6 個月）；外部批評（Nguyen & Fithian、Mertens et al.）。
- 讀完後讀者能：看到「AI 能做 X 小時的工作」時，說出這個 X 是相對誰、在什麼任務上量的。
- 前置：order 2、5。擬合細節折疊。倍增時間一律附擬合起點與資料快照：METR 一年內公開過 196.5、130.8、126、105（2024-01 後前沿公開模型，Frontier Risk Report 2026-05-19）、88.6、110 天，差別來自起點與方法修正。

### Order 17：經濟價值評測
- 聚焦問題：GDPval 和 Remote Labor Index 怎麼量「能替代多少有償工作」？
- 講：GDPval（44 職業、專家出題、盲評 win/tie）；「快 100 倍」vs 計入審查後 1.12–1.39 倍；47.6% → 84.9% → 改用不公開 v2；RLI（真實外包案、自動化率 2.5% → 41.25%、中途改規格、自動評審高估）。
- 讀完後讀者能：讀到「AI 能完成 X% 的專業工作」時，追問有沒有計入審查與重做、評分是誰做的、版本有沒有換。
- 前置：order 7、16。

### Order 18：中文與繁中 benchmark
- 聚焦問題：為什麼不能只看英文分數，繁中 benchmark 量得到什麼、量不到什麼？
- 講：C-Eval、CMMLU 的設計與污染報告；TMMLU+ 與 TMLU（題源、yamol.tw 污染疑慮、低於隨機的分數是格式問題）；繁簡轉換影響小、tokenizer fertility 與分數 r=−0.742；台灣用語錯配（SC-TC-Bench 37.5/110）；翻譯版 benchmark 的文化偏誤與翻譯品質（Global-MMLU）；VisTW。
- 讀完後讀者能：替繁中使用情境挑模型時，知道哪些能力一般 benchmark 量得到、哪些（用語、在地知識）要自己測。
- 前置：order 3、5。台灣官方評測照一手寫：TAIDE 公開評測只有 GPT-4 評分的寫作任務與 OpenCC 轉換的長文基準（後者輸原版 Llama-3.1-8B），2026-02 模型卡無評測段；數位部 AIEC 走可信任 AI 合規檢核、題庫不公開；taide-bench 題目需登入（✉️）。Breeze 2 表中 GPT-4o-mini MMLU 42.62 異常要加註。工研院量測中心的在地題庫 CTT／IRT 論文在 IEEE 付費區（✉️）。

### Order 19：聚合指數怎麼讀
- 聚焦問題：把幾十個 benchmark 壓成一個數字，丟掉了什麼？
- 講：ECI 的 IRT 直覺（能力 vs 難度、共同受測模型校準）；AA v5（四類各 25%、自跑、effort 分開列、跨版本不可比）；Vals（GDP 加權，法律分項差 4 倍總分只差 0.44）；第一因子 74.5% 跟著發布日期走；Zhang & Hardt 多樣性與穩定性的取捨。
- 讀完後讀者能：看到聚合指數排名時，知道要回頭看分項、權重與版本，以及同期模型的小差距大多不可解讀。
- 加兩個限制：只報平均分等於隱含假設單一能力（Rasch）；題目多、模型少（n ≪ p）時參數不穩（Botter 摘要層級，全文 ✉️；HarmBench 稽核引其 Problems 1–3）。清單密度即隱性權重（Balance of Benchmarks）。tinyBenchmarks 精簡題組能估平均分（100 題約 ±2%）但不適合排名。
- 前置：order 2、4。公式折疊。

### Order 20：怎麼讀一張模型發布表
- 聚焦問題：拿到一張廠商的 benchmark 表，依序要問哪些問題？
- 講：一份檢查清單，依 order 0 的五個環節排：題目（哪個版本、污染、飽和）→ 評分（已知錯誤率）→ 執行（harness、effort、供應商、取最佳？）→ 統計（題數、誤差）→ 呈現（挑哪些 benchmark 放、對手選誰）。用一張實際發布表走一遍。
- 讀完後讀者能：在五分鐘內用清單讀完一張發布表，標出哪些數字可比、哪些不可比。
- 前置：order 0–19。這篇是第 2、3、4 段的收束。

### Order 21：自己建：從失敗案例到題目
- 聚焦問題：要替自己的產品建評測，第一批題目從哪來、要幾題、怎麼定義要量什麼？
- 講：角色轉換對照表（失真機制 → 建題措施）；從真實失敗案例開始（Anthropic、Hamel）；先定義現象與負定義（Bean 建議）；抽樣（隨機／分層 vs 便利）；題數與 order 2 的關係；每題要有 oracle。
- 讀完後讀者能：替一個自己的功能寫出 20–50 題的第一版題目，並說明每題在量什麼。
- 「題目不要長得像考題」：Li et al. 的八個觸發因子（佔位名稱、過於完美的情境、明示評分格式等）轉成建題守則。
- 前置：order 1、2、5。連私有語料 Retrieval Eval。

### Order 22：自己建：評分器
- 聚焦問題：用 exact match、執行測試還是 LLM 評審，評分器本身怎麼驗證？
- 講：三類評分器的取捨；ABC 的結果效度檢查（等價表述、列舉所有答案、否定詞）；trivial agent 與 oracle 兩個健全性測試；LLM 評審要跟人標註比 precision／recall；criteria drift；多個參考解；verifier 自己要寫測試。
- 讀完後讀者能：替自己的評測選評分方式，並跑「什麼都不做」與「參考解」兩個基準確認評分器沒壞。
- 前置：order 7、8、21。連 CME295 第 8 堂、Promptfoo。

### Order 23：自己建：跑起來與報告
- 聚焦問題：怎麼把評測跑得可重現、隔離、留紀錄，結果怎麼附誤差報告？
- 講：Inspect 與 Harbor 的元件對照；sandbox 隔離（verifier 和 agent 分開）；固定版本、時限、effort；完整 log 與 transcript；報告格式（題數、SE 或 Wilson 區間、配對比較、trivial baseline）；計分分母的陷阱（Inspect 0.5 vs 0.33）。
- 讀完後讀者能：把自己的評測跑成一份別人能重現、附誤差的報告。
- 前置：order 2、6、22。Harbor 部分依 order 13 的查證結果寫（`harbor task init`、artifacts 宣告），標明未實跑。

### Order 24：自己建：維護與退役
- 聚焦問題：評測集上線後怎麼防污染、換題，什麼時候該退役？
- 講：延後公開與暗題（GSM1k）；定期換題與出題程式不公開（LiveBench）及其代價（外部無法重算）；動態對抗出題的成本與排名偏誤（Dynabench、Phang et al.）；Contamination Transparency Card；退役條件（Deprecating Benchmarks）；版本號與跨版本比較（Terminal-Bench 語意化版本、AA Progress Index）。
- 讀完後讀者能：替自己的評測訂一份維護計畫：多久換題、怎麼標版本、什麼訊號出現就退役。
- 前置：order 3、4、23。

## 研究足夠的判準

逐段檢查五關（2026-11-24 補缺口後）：

| 段 | ①一手 | ②證據類型 | ③時效 | ④反證 | ⑤飽和 |
|---|---|---|---|---|---|
| 零件（0–2） | ✅ Inspect／Harbor／Anthropic 文件、Miller、Madaan、HAL（Table A19 已以原圖核對）、Epoch 全文 | ✅ Bowyer 覆蓋率模擬、Poisson Labs 預註冊重分析 | ✅ 2024–2026 | ✅ Bowyer、Wang、Liu 2026（HAL 維護者已確認）、Hardy | ✅ 英文兩組＋中文＋心理計量用語各一輪，新增來源（AIMS、AACL 教程）已讀 |
| 失真（3–9） | ✅ | ✅ 系統性回顧＋可重現 exploit；評測意識有介入實驗 | ✅ 多數 2025–2026 | ✅ GEM 綜述三處引用錯誤與 ConStat 欄位誤讀已回原論文；METR 轉述錯誤已更正；評測意識有反證（Knecht） | ✅ 補搜發現的評測意識已併入 order 8 |
| 家族（10–18） | ✅ 各原論文＋官方改版＋SWE-bench Pro V2、OSWorld 2.0 附錄、Epoch reviews、SABER 全文 | ✅ 錯誤率皆有稽核研究 | ✅ 追到 2026-11 | ✅ | ✅ |
| 讀（19–20） | ✅ Rosetta Stone、AA、BHI、Vals、Balance of Benchmarks、HarmBench 心理計量稽核 | ✅ | ✅ | ✅ Zhang & Hardt、One Capability or Many | ✅ |
| 建（21–24） | ✅ Inspect、Harbor 原始碼與文件、Anthropic、Dynabench、HELM、Hamel、Shankar、Fantastic Bugs | 🟡 實務指南多為作者經驗主張，實證只有 Shankar、Phang、Fantastic Bugs；文中照實標「作者建議」 | ✅ | ✅ Phang | ✅ |

### 讀不到、只能寫信問的（✉️）

| 項目 | 卡在哪 | 該問誰、問什麼 | 文中怎麼寫 |
|---|---|---|---|
| FrontierMath Tier 4「40%」分母 | Epoch 未寫 | Epoch：分母是 19/48 還是 19/50、受影響題在私有集幾題、v2 天花板為何是 0.95 | 「約 40%，依 changelog 為 19/50 = 38%」 |
| LeCun「fudged」原句 | FT 付費 | 有 FT 訂閱者讀 2026-01-02 Heikkilä 專訪 | 不引原句，只寫 Arena 與 Meta 的一手說法 |
| taide-bench 題目 | 需登入 | TAIDE 專案方 | 只寫公開的評分提示與模型卡 |
| Botter 2026 全文 | T&F 付費 | 作者索取作者版 | 只引摘要層級主張，並以 Stewart et al. 對其 Problems 的引用為準 |
| 工研院在地題庫 CTT／IRT 論文 | IEEE 付費 | 作者 Tsu-Yi Yeh／量測中心 | 不寫數字，只提有此研究方向 |
| LiveBench 2.0 rubric 評分者與換題頻率 | 官方未寫 | Abacus.AI／Colin White | 寫「官方未公開」 |

## 偏誤

- 母群取自 Epoch Benchmarking Hub 與大廠技術報告，偏前沿 lab 會報的 benchmark，偏英語、文字與程式；多模態、語音、生成評測排除（既有〈AI 模型評測來源指南〉涵蓋）。
- 批評文獻多來自學界稽核團隊與 Epoch；benchmark 維護者的回應只對 SWE-bench、Terminal-Bench、Arena、HLE、OSWorld 找到一手說明，其他沒有公開回應。
- 中文段只有簡中與繁中，日韓與其他語言只在 order 18 一句帶過。

## 待使用者決定

1. 弧線順序：零件 → 失真 → 家族 → 讀 → 建，25 篇（order 0–24）。補搜後沒有加篇：評測意識的一手實證在能力 benchmark 上只有一例（BrowseComp 淨影響 0.24 pp），併進 order 8 當最後一節。
2. 範圍：order 6（harness）與 order 2（誤差）是否要併；order 16、17 是否併成一篇「量工作」。
3. 斷崖處理：order 2、16、19 公式折疊＋直覺先行；order 10–18 開頭放「踩坑小表」回扣 order 3–9。
