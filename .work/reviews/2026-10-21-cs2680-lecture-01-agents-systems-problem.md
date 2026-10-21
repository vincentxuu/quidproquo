審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-01-agents-systems-problem.md，sha256：b26e4b1bb231178a8926f81b4bdf77d744efea7bdfcca6a543f618dc05ee9c1c
審稿者：獨立子代理（未參與撰寫），2026-10-21

底本與工具：`.work/research/harvard-cs2680/sources/slides/1_intro.txt`（PDF 頁序 = 第 N 個 form-feed 區塊）、`1_intro.pdf`（p40、p41 以 `pdftoppm -r 60` 渲染目視核對；p42、p44 文字層已足夠）、`sources/pages/policy.txt`、`sources/pages/index.html`、`sources/pages/assignments_assignment1.txt`、範圍卡 `.work/series-plans/harvard-cs2680.md`、規格 `.agents/skills/post/references/course-guide-contract.md`。
線上核對：`curl -sIL` 六個外部連結全部 200；線上 `1_intro.pdf` 與本地快照 sha256 相同（0183cf9e…），本地頁碼可直接代表線上版；policy 頁線上仍有「lectures will not be recorded」；YouTube oEmbed 與影片說明欄（章節表）以 curl 取得。Groundlane 依指示不可用（401），curl 已足夠，未動用 Exa／WebFetch。
數值以 python 重算（見各列）。
機械檢查：`pnpm verify` 5 項紅，與本篇相關的是 check:references（英文版連結不存在）、check:lang-parity（缺 `-en.md`）、check:course-videos（登錄表有 `-en` 但檔案不存在）、check:series-plan（缺本審稿紀錄，本檔產出後即解）；check:post-quality 的紅來自別篇。`pnpm check:links` 6 條外部連結 0 壞；`check-course-titles.mjs`（兩篇一起傳）0 issue；`check-course-guide-layout.mjs` 0 issue；`pnpm check:tw` 0 blocking。

## post-verify

| # | 宣告（行） | 來源＋頁 | 判定 | 備註 |
|---|---|---|---|---|
| 1 | 第 1 堂 2026-09-02，題目課程總覽（L30、tldr） | 首頁 schedule：「1 2026-09-02 Juncheng Yang Course overview and logistics」 | Confirmed | |
| 2 | 前半 p1–26 是課程介紹與行政，後半 p27–45 兩段正課（L30） | 1_intro p27「Part I — AI Systems」、p35「Part II — Agentic AI Systems」、p46 Next class | Confirmed | p22–26 是背景調查，文中括號只列「作業、配分、運算資源」，屬省略不算錯 |
| 3 | 課程不錄影（L28、L203） | policy.txt 114–115、線上 policy 頁 | Confirmed | 引號內英文逐字相符 |
| 4 | AI/ML vs AI Systems 的分工與四個目標（L38） | p28 | Confirmed | |
| 5 | 本課只談 LLM 系統（L38） | p28 腳註「this course narrowly focuses on LLM systems」 | Confirmed | |
| 6 | 只談推論不談訓練，理由是推論主導算力（L38、L184） | p45「Training (inference dominates compute demand)」 | Confirmed | |
| 7 | 運算：tokenization、kernel 啟動、工具呼叫在 CPU，矩陣乘法在 GPU；prefill 卡算力、decode 卡頻寬；執行時間取決於輸出長度（L44、glossary） | p30 | Confirmed | 省略了「data movement」也在 CPU、「Mixed GPU generations and xPUs」、瓶頸還有 capacity；不影響正確性 |
| 8 | 浮點加法無結合律，第 7 位小數的差異可翻轉下一個 token（L45） | p31 | Confirmed | |
| 9 | 非決定性三層來源 runtime／軟體／硬體（L59） | p31 右欄 | Confirmed | 硬體層原文是「CUDA vs tensor core, Hopper FP8 vs Blackwell micro-scaling tiles」，文中只寫「不同世代 GPU 的低精度格式」，漏了 CUDA core vs tensor core 這一半 |
| 10 | Python 例子 `(0.1+0.2)+0.3 = 0.6000000000000001`、`0.1+(0.2+0.3) = 0.6`（L52–57） | python3 實跑 | Confirmed | 輸出逐字相符 |
| 11 | 權重 GB 到 TB；KV cache 每 token 數十到數百 KB；NCCL、NVLink、RDMA（L46） | p32 | Confirmed | 合理性另算：Llama 3 8B（32 層、8 KV head、dim 128、BF16）每 token 2×32×8×128×2 B ≈ 131 KB；70B（80 層）≈ 328 KB，落在投影片範圍內 |
| 12 | 注意力 MHA→GQA→MLA；工作負載多輪聊天、推理、RAG、agent（L47） | p33 | Confirmed | 投影片還列 NSA、linear attention |
| 13 | 16K GPU 叢集約每 3 小時壞一張；GPU 700–1000W（L48） | p34 | Confirmed（投影片層級） | 投影片未標來源。內部一致性：MTBF 50,000 h ÷ 16,384 ≈ 3.05 h，與「每 3 小時」一致；但同頁「9% AFR」換算 MTBF 約 97,000 h，與 50,000 h 不一致（8760/50000 ≈ 17.5% AFR）。文中沒引 AFR，不影響本文 |
| 14 | 「接著五頁說明…」（L40） | p30–34 正好五頁 | Confirmed | |
| 15 | agent 定義與 plan/act/observe/adapt/deliver 五步（L66–72） | p36 | Confirmed | |
| 16 | LLM 是奇怪的電腦，超人又無能；兩欄清單（L74） | p37 | Confirmed | 「跨多領域運作」未列，省略 |
| 17 | p37 引 Andrej Karpathy 的演講，連結 `LCEmiRjPEtQ&t=874`（L74、L212） | p37 頁尾連結；YouTube oEmbed：「Andrej Karpathy: Software Is Changing (Again)」，Y Combinator 頻道；說明欄章節「14:39 – Psychology of LLMs」 | Confirmed | t=874 = 14:34，正好在 LLM psychology 段前 5 秒。投影片本身沒寫 Karpathy 名字，文中「引 Andrej Karpathy 的演講」是依連結推得，正確 |
| 18 | 「agent 的工具與記憶，就是拿來補這些弱點的」（L74） | p37 標題「Why do we need an AI agent?」 | Unverifiable（推論） | 投影片沒寫出這句因果，是合理讀法；建議標為本文解讀 |
| 19 | 新型電腦五組對照（L78–84） | p38 | Confirmed | |
| 20 | 「這個類比後面整門課都會用到」（L86） | grep 2_–8_ 各 deck：無「new kind of computer」或 harness=OS 類比 | Unverifiable | 後續投影片看不到再用這個類比；建議改成「本系列後面會借用」 |
| 21 | harness 決定什麼進 context、工具權限、記憶體滿了壓縮（L86） | p38 只有 OS → Agent Harness 一行 | Unverifiable（作者延伸） | 內容本身合理，但緊接「投影片接著…」、後接「投影片特別強調」，讀者會以為是投影片說的 |
| 22 | LLM 不只是更聰明的 CPU，程式寫法與壞掉的方式都不同（L86） | p38 底部「different programming model and failure model」 | Confirmed | |
| 23 | 一般 serving vs agent serving 長鏈，關鍵路徑橫跨 GPU、CPU、儲存、網路、外部服務；六個麻煩（L93–100） | p39 | Confirmed | 「跑一次測試可能幾秒也可能幾分鐘」「但要猜對」是作者舉例，未標 |
| 24 | 五層堆疊：應用 → agent／harness → 模型 serving（與外部工具並列）→ runtime／kernel → 硬體（L102） | p40（渲染目視） | Confirmed（簡化） | 投影片實際是 Model／External Environment 標頭列＋Serving System／Tools＋Runtime/Kernels／Systems，右側還有「Agent ↕ Serving ↕ Hardware co-design」直欄；文中漏掉 co-design 這個訊息，「五層」是作者的計數 |
| 25 | Part I 處理 harness，Part II 往下處理 serving（L102） | 首頁 Format：Part I Introduction to LLMs and agents；Part II Systems for LLMs and agents（LLM serving…and agentic systems） | Confirmed | |
| 26 | 可觀測性：巢狀軌跡 session > turn > agent step > model request／tool call／tool result／subagent；「看不到就無法優化」（L104） | p43 | Confirmed | |
| 27 | 作業 1 要做的介面就是把軌跡畫出來（L104） | assignments_assignment1.txt 73、137（「Show the trajectory live」「Show the trajectory as a tree」） | Confirmed | |
| 28 | 「throughput 對 agent 是錯的目標」；在延遲、成本、資源、可靠度、安全限制下最大化任務成功率（L111） | p41（渲染目視） | Confirmed | |
| 29 | 兩欄指標表（L113–119） | p41 | Confirmed | 投影片把「$ / successful task」「Energy / successful task」兩格以紅底強調，文中沒有交代這個重點 |
| 30 | 「每秒 token 數更高，agent 仍然可能更慢、更貴」（L121） | p41「More tokens/sec can still mean a slower, costlier agent.」 | Confirmed | |
| 31 | 兩個 agent 的帳：A $0.50×100÷60、B $0.80×100÷90；A 每任務便宜 37.5%，每次成功便宜約 6%（L129–137） | python：0.8333、0.8889；(0.8−0.5)/0.8 = 0.375；(0.8889−0.8333)/0.8889 = 0.0625 | Confirmed（計算） | 兩個百分比都以 B 為基準，一致。已標為本文教學例子 |
| 32 | 人工接手：A 40×25+50 = 1,050；B 10×25+80 = 330；B 約為 A 的三分之一（L139–144） | python：1050、330、0.314 | Confirmed（計算） | 單位從前一段的「每次成功」換成「100 個任務總成本」，文中沒提示；$25／15 分鐘隱含時薪 $100，屬假設 |
| 33 | 「這就是投影片要你改看每次成功的原因：失敗的嘗試照樣花錢」（L137） | p41 只列指標，沒有給理由 | Unverifiable（歸屬） | 理由本身正確，但掛在投影片名下 |
| 34 | batching 例：每請求多等 200 ms，30 次呼叫多 6 秒（L150） | python：30×0.2 = 6.0 | Confirmed（計算）；機制 Misframed | 算術對；但「湊批要等」描述的是靜態 batching。現行 serving（vLLM、SGLang 的 continuous batching）不等湊滿，延遲代價主要來自 batch 變大後每個 decode step 變慢（TPOT 上升）與負載下的排隊。這是課程第 1 題的答案方向，Part II 才講，例子應標明假設的是哪一種 batching |
| 35 | 自我檢查：$0.40÷0.5 = $0.80、$0.60÷0.8 = $0.75，變低（L152–153） | python：0.8、0.75 | Confirmed（計算） | |
| 36 | 十組特性 ↔ 系統問題（L159–170） | p42 | Confirmed | 十組逐一對上 |
| 37 | 「本系列在哪裡碰到」欄（L159–170） | grep 2_–8_ deck：L6 有 checkpoint（p25–30）、L8 有 caching／routing／speculative actions／parallelize、L5 依賴與多 agent、L4 shell 風險 | Confirmed（大致） | 屬作者對照，非投影片內容；「第 6 堂」對 memory hierarchy & retrieval、checkpoint 都說得通 |
| 38 | 九個問題（L174–182） | p44 | Confirmed | 九題逐一對上；「定量回答」對應「answer these quantitatively」 |
| 39 | 「最後一頁正課列出…九個問題（p44）」（L172） | p45 才是最後一頁正課（不涵蓋清單） | Contradicted（輕微） | 改「倒數第二頁」或直接寫「p44 列出」 |
| 40 | 「Part I 主要回答第 2、5、6、9 題的 harness 那一半」（L184） | 投影片與首頁都沒有這個對應 | Unverifiable（作者推論） | 對照 L3／L5／L8 大致說得通，但沒標是本文判斷 |
| 41 | 不涵蓋訓練、模型架構設計、通訊、電力與新硬體（L184） | p45 | Confirmed | |
| 42 | 投影片右下角頁碼比 PDF 頁序多 1（L204） | 1_intro.txt：PDF p27 印 28、p41 印 42、p45 印 46 | Confirmed | |
| 43 | glossary：prefill／decode 定義與「Part II 才展開」 | p30；首頁 Part II | Confirmed | |
| 44 | glossary：$／成功任務「CS2680 用它取代每秒 token 數」 | p41、p44 第 9 題 | Confirmed | |
| 45 | 英文版連結 `/posts/ai/2026-10-21-cs2680-lecture-01-agents-systems-problem-en`（L26） | `pnpm check:references` ERROR：站內連結指向不存在的文章 | Contradicted | 英文版尚未寫；不同步產出就要先拿掉這行 |
| 46 | 外部連結（L30、L74、L104、L203、L209–213） | curl -sIL 全 200 | Confirmed | |

本次只檢查了文中已提出的 46 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

修正：見 post-review 的修正紀錄；數字全部重算無誤，新增 batching 例（8→64 請求、20→35 ms、100 token、30 次＝45 秒）與 9 秒自我檢查已重算。

## post-review

### must-fix

1. **L26、frontmatter（機械檢查紅）**：英文版連結指向不存在的 `-en` 文章，`check:references` 報 ERROR；`check:lang-parity` 與 `check:course-videos` 也因缺 `-en.md` 紅燈。英文版要跟本篇同一個 commit 產出，否則先移除 L26 並從 course-videos 登錄表拿掉 `-en` 那筆。
2. **範圍卡的第一個學習目標沒有例子也沒有練習（L155–184）**：範圍卡寫「讀完能拿一個 agent 任務說出它在哪幾個 workload 特性上會造成系統問題」，開頭 L32 也承諾這件事，但「Agent 的特性對應到哪些系統問題」一節只有 p42 對照表與 p44 問題清單，沒有走過任何一個任務，也是全文唯一沒有自我檢查的主要小節。規格要求完整例子（條件、推理、結果、意思）與每節自我檢查。建議補一個本文教學例子：拿「coding agent 修一個 flaky test」逐一對到表中 4–5 列（軌跡長 → context 管理；開頭的 system prompt 與工具定義重複 → prefix caching；跑測試幾秒到幾分鐘 → 非同步執行；改檔與跑 shell → 安全與隔離；跑半小時中途斷線 → checkpoint），每列說明會怎麼壞；節末加一題「給你一個做機票比價的 agent，指出三個特性與對應系統問題」，附判準。
3. **L34 的承諾沒有兌現（先備橋接）**：L34 說投影片點名的 serving 名詞「本文每個只用一句話交代它在系統的哪一層」，但正文只有 prefill／decode（glossary）有交代；KV cache（L46、L163、L177）、tensor parallelism（只出現在 L34）、NCCL／NVLink／RDMA（L46）、MHA／GQA／MLA（L47）、prefix caching、speculative execution（L163–164）、TTFT／TPOT（L115）都沒有一句話說明。規格要求「未在系列教過的先備給可到達的橋接連結」。建議在 L46–47 表格後補一個小表或 glossary 條目，每個名詞一句白話＋所在層（serving／runtime／硬體），並連到 CMU 11-868 對應篇（見 should-fix 5）。
4. **L88–89 自我檢查的答案把兩件事混在一起**：答案說 context 摘要「類似 swap 或 page eviction；代價是之後要用時可能已經找不回原樣」。swap／page eviction 換出的資料可以原樣換回，是無損的；摘要是有損的。答案的前半與後半互相矛盾，會教錯 OS 概念。建議改成：「像記憶體不夠時把資料移出 RAM（swap），差別在 swap 能原樣換回，摘要是有損壓縮：被摘掉的細節回不來。這就是 compaction 之後 agent 會『忘記』某個檔名的原因。」

### should-fix

5. **L198 延伸連結與範圍卡不符**：範圍卡寫「serving 名詞 → CMU 11-868 serving 篇」，文中連到 11-868 總覽。站上有 `/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache`（KV cache、prefill／decode）與 `/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm`（continuous batching），以及 `/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems`（對應本篇第一節）。建議換成這三篇或至少補 serving 篇。
6. **L146–150 batching 例子的機制是靜態 batching**：「湊批要等，每個請求平均多等 200 毫秒」只描述靜態 batching。現行 continuous batching 不等湊滿，延遲代價來自 batch 變大後每步 decode 變慢（TPOT 上升）與高負載排隊。建議改寫例子的假設：「假設伺服器為了把 GPU 用滿，把同時處理的請求從 8 個拉到 64 個，每一步 decode 從 20 ms 變 35 ms；一次模型呼叫產生 400 token，多出 6 秒……」或至少加一句「這裡假設的是最簡單的『等湊滿再算』；continuous batching 怎麼改變這筆帳，Part II 才講」。也建議在本小節末加一題自我檢查（範圍卡原訂的 batching 題）。
7. **L86 作者延伸未標示**：「harness 就像作業系統：決定把什麼放進記憶體…記憶體滿了怎麼辦（壓縮）」是本文延伸，夾在兩句「投影片…」中間，讀者會以為出自 p38。另「這個類比後面整門課都會用到」在 L2–L8 投影片找不到依據。建議改「本文的延伸讀法：harness 像作業系統…」，並把「整門課都會用到」改成「本系列後面會一直借用這個類比」。
8. **L137、L144 把作者理由歸給投影片**：「這就是投影片要你改看每次成功的原因」「所以投影片把目標寫成…：成功率本身就是成本的一部分」。p41 只列指標，沒寫理由。建議改「改看每次成功的理由很直接：…」「這也呼應投影片把目標寫成…」。
9. **L184 未標的推論**：「Part I 主要回答第 2、5、6、9 題的 harness 那一半」不在任何來源，建議加「依課表對照，本文判斷」或刪。
10. **缺「常見誤解」**：規格要求概念導讀指出常見誤解。誤解目前散在自我檢查裡（temperature 0、GPU 使用率、推論加速一倍）。建議在「要最佳化什麼」一節加三條短的「常見誤解」：GPU 使用率高＝agent 好；temperature 0＝每次一樣；模型推論快一倍＝任務快一倍，各一句反駁並指向對應自我檢查。
11. **L48、L59 漏掉投影片的平衡點**：p31 底部寫「Approximate computing is acceptable」，即非決定性在多數情況被接受。文中只講問題，讀者可能以為這是要修的 bug。建議在 L59 段末補一句。
12. **L139–144 單位切換沒提示**：前一段算「每次成功的花費」，這段改算「100 個任務的總成本」。建議第一句改「把人工接手算進去，看 100 個任務的總帳：」。
13. **L102 漏掉 co-design**：p40 右側「Agent ↕ Serving ↕ Hardware co-design」是這張圖要傳達的主旨之一（三層要一起設計），文中只列層級。建議加一句。
14. **tags**：`llm-systems` 是全站 ai 分類首次出現的 tag（1 篇）。既有相近 tag：`llm-inference`（50）、`model-serving`（16）。同系列總覽用了 `course-guide`。建議 `llm-systems` → `llm-inference`，並考慮加 `course-guide` 與總覽一致。
15. **台灣讀者位置**：前三段沒有交代台灣讀者為什麼要讀。這是全球課程導讀，不必硬塞台灣案例，但可在 L32 加一句判斷角度，例如「如果你的團隊正在拿 API 帳單評估要不要導入 coding agent，這堂的指標就是你該拿來比的那把尺」。

### nit

16. L172「最後一頁正課」：p45（不涵蓋清單）才是最後一頁正課，改「p44 列出」。
17. L59 硬體層只寫「不同世代 GPU 的低精度格式」，漏了 p31 的「CUDA core vs tensor core」。
18. L93–99「跑一次測試可能幾秒也可能幾分鐘」「但要猜對」是作者舉例，可加「例如」讓它不像投影片原文。
19. L113–119 投影片把「$／成功任務」「耗能／成功任務」標紅強調，表格可用粗體呈現，讓讀者知道這兩格是重點。
20. L44 p30 的「Mixed GPU generations and xPUs」與 capacity 瓶頸被省略，可在白話欄加「不同世代 GPU 混用」。
21. 與總覽篇 L33 的寫法不一致：總覽說外部工具「掛在 harness 旁邊」，本篇 L102 說「與模型 serving 並列」；p40 圖上本篇的說法較準，建議同步總覽。

### 教學對齊（規格逐項）

| 規格項目 | 文中位置 | 判定 |
|---|---|---|
| 具體問題開場 | L32「一個 agent 好不好，為什麼不能用每秒 token 數來量」 | 有 |
| 直覺 → 機制 | 非決定性（L50–59）、長鏈（L93–104）、指標（L111–150） | 有；特性對照一節只有表沒有機制 |
| 完整例子（條件、推理、結果、意思） | 兩個 agent 的帳 L123–144 完整；batching L146–150 完整但機制有疑；浮點 L52–59 完整 | 部分；特性對照缺例子（must-fix 2） |
| 自擬例子標明 | L28、L125、L148、L205 | 有 |
| 常見誤解 | 無獨立段落 | 缺（should-fix 10） |
| 每節自我檢查附答案／判準 | L61、L88、L106、L152 有；「特性對應」一節無 | 缺一節（must-fix 2）；L89 答案有誤（must-fix 4） |
| 先備橋接 | prefill／decode 有；其餘 serving 名詞無 | 缺（must-fix 3） |
| 不把作者說法歸給講者 | L86、L137、L144、L184 | 有四處混淆（should-fix 7–9） |

修正：must-fix 1 英文版同批產出；must-fix 2 新增「走一次：修 flaky test 的 agent」例子與訂機票自我檢查；must-fix 3 新增 serving 名詞小表＋CMU 11-868 KV cache 連結；must-fix 4 自我檢查改為 swap 無損 vs 摘要有損。should-fix 5 延伸閱讀換成 11-868 intro 與 SGLang/vLLM 篇；6 batching 改成 continuous batching 的 decode 變慢模型並加自我檢查；7–9 作者延伸改標「本文的讀法」「依課表對照」；10 新增常見誤解三條；11 補 approximate computing acceptable；12 補單位切換提示；13 補 co-design；14 tag 改 llm-inference＋course-guide；15 補讀者定位句。nit 16–20 全修；21 總覽同步改圖。

## post-polish

掃描結果：長句（>60 字）8 句，未超過 10% 門檻；但書密度 6%；引述區塊 8 個（全是自我檢查，屬功能性，不算過量）；姓名當主詞 1；模板化轉折 1 處（L86，是 p38 原文「more than a smarter CPU」的翻譯，可留）；`scan-ledger` 無台灣用語命中。以下是單點可讀性問題。

1. **L30（73 字、7 個數字）**：一句塞了日期、題目、前半內容、另一篇連結、後半頁碼與兩段主題。
   建議：「[CS2680](https://cs2680.com/) 第 1 堂在 2026 年 9 月 2 日上課，題目是課程總覽。[投影片](https://cs2680.com/slides/1_intro.pdf)前半講課程與行政，整理在[課程總覽](/posts/ai/2026-10-21-cs2680-course-overview)。這篇讀後半的兩段正課（p27–45）：AI 系統跟傳統系統哪裡不同，以及 agent 為什麼是系統問題。」
2. **L32（86 字）**：問題與學習目標擠在同一段兩長句。
   建議：「這堂要回答一個問題：agent 好不好，為什麼不能看每秒產生多少 token？那該看什麼？讀完之後，你應該能拿一個 agent 任務，說出它會碰到哪些系統問題，也能用『每次成功的花費』比較兩個 agent。」
3. **L59（「順序一變…」60 字）**：因果鏈三段串在一句。
   建議：「順序一變，最後幾位小數就跟著變。平常這點差異無所謂；但模型在兩個機率幾乎一樣的 token 之間選時，它就可能讓模型選到另一個字，後面整段輸出從此分岔。」
4. **L74（63 字清單句）**：長串並列。
   建議：「它在知識、語言、模式比對、寫程式上贏過多數人。它的弱點是：記不住上次的事、理解 context 不穩、會幻覺、不知道自己不知道什麼，還容易被惡意輸入帶著走。」
5. **L104（89 字）**：巢狀結構用一句話描述，讀者很難在腦中建出那棵樹。
   建議改成縮排清單：「agent 的 trace 是一層套一層的軌跡：」後接 `session → 很多輪對話 → 每輪很多 agent 步驟 → 每步有模型請求、工具呼叫、工具結果，可能再生出 subagent`，用四層縮排列出。
6. **L102（60 字）**：堆疊五層用箭頭串成一行，加上括號，難掃讀。
   建議：用一個五列的小清單或 ASCII 方塊（由上到下），旁註 Part I／Part II 各管哪幾層。
7. **L150（72 字）**：「對一般聊天只多等一次；對一個要呼叫模型 30 次的 agent…而且這 6 秒都在關鍵路徑上，因為…」
   建議：「一般聊天只多等一次。一個要呼叫模型 30 次的 agent，每一步都要等：30 × 0.2 ＝ 6 秒。這 6 秒全落在關鍵路徑上，因為下一步得等上一步的結果才能開始。」
8. **L34（60 字）**：「投影片在這堂點名的 serving 名詞（prefill、KV cache、tensor parallelism 等），課程到 Part II 才展開，本文每個只用一句話交代它在系統的哪一層。」主詞換了三次。
   建議：「這堂會冒出很多 serving 名詞，例如 prefill、KV cache、tensor parallelism。課程到 Part II 才細講；本文每個只用一句話說它在系統的哪一層。」（配合 post-review must-fix 3 真的補上那一句話。）
9. **L86（作者延伸＋「不只是…而是…」）**：「這個類比後面整門課都會用到。」是空泛的預告句。
   建議：刪掉這句，直接以「照這個類比，harness 的工作就像作業系統：…」開頭，並標明是本文讀法（見 post-review should-fix 7）。
10. **L141–142（每行 5 個數字）**：兩行算式數字密，但這是例子的帳，屬可接受；可在其後補一句白話結論帶讀者看懂差別，例如「A 每多失敗 30 個任務，就多出 750 美元的人工」。

修正：1–9 依建議改寫（堆疊與 trace 改成清單）；10 補白話結論（A 多失敗 30 個＝多 $750 人工）。

## 複審

複審對象 sha256：7e03819acc1e41ff684a1e2b92207e1a465ed866db6f99fb9ef6010a800c2978，複審者：獨立子代理（未參與撰寫），2026-10-21

方法：逐項比對上方各 `修正：` 與現行行號；新段落回到 `slides/1_intro.txt`（50 個 form-feed 區塊＝PDF 50 頁）p28–45、`slides/8_agent_design_5.txt` p19、`pages/*.txt` 核對；站內連結以 `find src/content/posts` 確認；`node scripts/check-post-references.mjs`、`node scripts/check-lang-parity.mjs` 重跑；數字手算重算。

| 項目 | 是否解決 | 證據（現行行號） |
|---|---|---|
| must-fix 1 英文版 | ❌ | L26 仍連 `…-lecture-01-agents-systems-problem-en`，檔案不存在；`check-post-references` 對本篇與總覽英文版各報一個 ERROR，`check-lang-parity` 報缺英文版。course-videos 登錄表已無 `-en` 項（l.137–141） |
| must-fix 2 特性對照的例子與練習 | ✅ | L215–225「走一次：修 flaky test」對到 p42 表中五列；L227–228 訂機票自我檢查附判準 |
| must-fix 3 serving 名詞橋接 | ✅ | L34 改指向小表；L61–71 七個名詞各一句＋所在層；L73 連 CMU 11-868 KV cache 篇（檔案存在）。名詞皆出自 p30–34、p41（parallelism 見 1_intro.txt l.450–452） |
| must-fix 4 swap 有損／無損 | ✅ | L103：swap 原樣換回 vs 摘要有損，概念正確 |
| should-fix 5 延伸連結 | ✅ | L258–259 連 11-868 intro 與 SGLang/vLLM 篇，L73 連 KV cache 篇；四個站內目標檔皆存在 |
| should-fix 6 continuous batching | ✅ | L179–184 改為 decode 每步變慢的模型；L186–187 新增自我檢查 |
| should-fix 7 harness＝OS 的延伸 | ✅ | L100 標「本文的讀法，本系列後面會一直借用」 |
| should-fix 8 理由歸屬 | ✅ | L166「理由很直接」、L173「這也呼應投影片」 |
| should-fix 9 Part I 對應題號 | ✅ | L244「依課表對照」 |
| should-fix 10 常見誤解 | ✅ | L192–196 三條，各指向自我檢查或例子 |
| should-fix 11 approximate computing | ✅ | L59（p31 “Approximate computing is acceptable”）；後半句延伸見新問題 B |
| should-fix 12 單位切換 | ✅ | L168「看 100 個任務的總帳」 |
| should-fix 13 co-design | 部分 | L124 已補 co-design（p40 右欄相符），但「只優化其中一層常常白做」投影片沒寫（見新問題 A） |
| should-fix 14 tags | ✅ | L6：`llm-inference`、`course-guide` |
| should-fix 15 讀者定位 | ✅ | L32 末句 |
| nit 16 p44 | ✅ | L232 |
| nit 17 CUDA core vs tensor core | ✅ | L59 |
| nit 18 作者舉例加「例如」 | ✅ | L110、L113 |
| nit 19 標紅兩格 | ✅ | L147–148 粗體 |
| nit 20 GPU 混用 | ✅ | L44（p30 “Mixed GPU generations and xPUs”） |
| nit 21 與總覽同步 | ✅ | 總覽 L34／mermaid 已改成兩欄 |
| post-polish 1–9 | ✅ | L30、32、59、88、116–122（清單）、126–131（縮排清單）、184、34、100 |
| post-polish 10 白話結論 | ✅ | L173「A 多失敗的 30 個任務，就多出 $750」（30×25＝750） |

數字重算：8÷0.020＝400 tok/s；64÷0.035＝1,828.6≈1,829；1,828.6÷400＝4.57（「約 4.6 倍」對）；35−20＝15 ms×100 token＝1.5 s；×30 次＝45 s；自我檢查 20×15 ms＝0.3 s×30＝9 s；兩個 agent 的帳 0.833／0.889、37.5%／6.25%、1,050／330（0.314）、$0.80／$0.75 皆對。

技術判斷：continuous batching 描述（不等湊滿、iteration-level 隨到隨加；代價在 batch 變大後每步 decode 變慢）正確，8→64 請求、20→35 ms 落在 memory-bound decode 次線性變慢的合理範圍，且已標本文例子。prefix cache「多個請求開頭相同時共用已算好的 KV cache」正確；flaky test 例子中「開頭重複」只講 system prompt 與工具說明，實際上 agent loop 可重用的是整段前一次 context，屬保守說法，不算錯。swap 類比已修正。MHA／GQA／MLA「差別在 KV cache 要存多少」是可接受的簡化。

### 新問題

- **A（should-fix）L124**：「圖的右側還標了一個重點：agent、serving、硬體三層要一起設計（co-design），只優化其中一層常常白做。」p40 右欄只有 “Agent / Serving / Hardware co-design” 四個詞，「只優化其中一層常常白做」是本文延伸卻掛在投影片名下。建議拆成「圖的右側標著 agent、serving、硬體三層要一起設計（co-design）。本文的讀法是：只優化其中一層，常常會被另一層吃掉。」
- **B（nit）L59**：「它不是要修掉的 bug，而是設計 agent 時要預設存在的條件」接在「投影片也註明」之後，是本文延伸；可加「換句話說（本文的讀法）」。
- **C（nit）L187**：「所以後面第 8 堂會教你減少每步的輸出 token」——L8 p19 確實教減少輸出 token，但理由是成本（schema、effort），不是 batching 延遲；「所以」暗示因果，改「第 8 堂也會教怎麼減少每步的輸出 token」即可。
- **D（nit）L120**：p40 外部環境欄還有一層「Systems：scheduling · caching」與 runtime 並列，清單第 4 項只列 runtime／kernel；「都由 harness 呼叫」是本文讀法。可在第 4 項補「外部系統（排程、快取）和它並列」，與總覽的 mermaid 一致。

結論：未通過（必修：must-fix 1，英文版 `2026-10-21-cs2680-lecture-01-agents-systems-problem-en.md` 尚未存在，L26 為死連結、check:references 與 check:lang-parity 仍紅；英文版產出並重跑兩項檢查轉綠後，其餘項目可視為通過）

修正（複審後）：英文版已產出（check:references、lang-parity、course-videos 通過）；L8 p21 改為只陳述價格倍率並加連結／co-design 句改標本文理解。中英同步。
