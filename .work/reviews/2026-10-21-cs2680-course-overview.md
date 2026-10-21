審稿對象：src/content/posts/ai/2026-10-21-cs2680-course-overview.md，sha256：f817d5a546acf56668f5e5a0ea5e6b7889b02183d247220ddb142a47a76e7ac0
審稿者：獨立子代理（未參與撰寫），2026-10-21

底本與工具：`.work/research/harvard-cs2680/sources/slides/*.txt`（PDF 頁序＝第 N 個 form-feed 區塊；以 `pdftotext -f 40 -l 40 1_intro.pdf` 驗證頁序一致。投影片頁腳印的頁碼比 PDF 頁序多 1，本報告一律用 PDF 頁序）、`1_intro.pdf` p40 以 `pdftoppm -r 60` 渲染目視核對、`sources/pages/index.html`（首頁課表，含 HTML 註解區分可見／隱藏內容）、`policy.txt`、`assignments_index.txt`、`assignments_assignment1–3.txt`、範圍卡 `.work/series-plans/harvard-cs2680.md`、規格 `.agents/skills/post/references/course-guide-contract.md`。
線上核對（2026-10-21）：`curl -sIL` 文中 13 個外部連結全部 200；另查 `cs2680.com/slides/2_…8_*.pdf` 八份 deck 皆 200；`cs2680.com/assignments/assignment4` 轉址到 `/to_release`（未公開）；線上首頁仍只有 L1–L8 與作業 3 投影片連結（Part II 無 deck）。`madsys.seas.harvard.edu` 回的是 Juncheng Yang 個人頁（同內容，頁中寫「I lead the Harvard … MadSys Group」）。Claude Code CLI 參考與 headless 文件以 curl 取 `.md` 版核對 `--output-format stream-json --verbose`；SWE-bench Pro README 以 raw.githubusercontent 取得。Groundlane 依指示不可用，curl 已足夠，未動用 Exa／WebFetch。

## post-verify

### 宣告逐條核對

| # | 行 | 宣告 | 來源＋頁 | 判定 | 備註 |
|---|---|---|---|---|---|
| 1 | 25 | CS2680 Modern AI Systems: Agents and System Optimizations，Harvard 研究所系統課，2026 秋 | 首頁標題、「Fall 2026」；policy「This is a graduate-level computer systems course」 | Confirmed | |
| 2 | 25 | 授課者 Juncheng Yang，由「他的」MaDSys 研究組支援 | 首頁 footnote「MaDSys … which teaches and supports it」；juncheng.seas.harvard.edu「I lead … MadSys Group」 | Confirmed | 連結 madsys.seas.harvard.edu 實際顯示的是講者個人頁，無害但讀者會以為點錯（nit） |
| 3 | 25 | 課站描述「跟著一個 agent 系統，從 agent loop 往下拆到 serving stack」 | 首頁 Overview「follows one agentic system from the agent loop down through the serving stack」 | Confirmed | |
| 4 | 27 | 先用 Claude Code，再用課程 API 設計、量、優化；下半學期 serve 開源權重模型，負責 batching、KV cache、routing、量化、speculative decoding | 首頁 Overview | Confirmed | 原文另有 scheduling、prefix reuse，省略可接受 |
| 5 | 27 | Mads＝Modern Agent Design and Systems；五份作業 Lens／Loop／Opt／Serve／Stack | 首頁 footnote 與 assessment 段；assignments index | Confirmed | |
| 6 | 29 | Part I＝9 月到 10 月中、八堂講課＋三份作業 | 首頁課表（Part I 9/2–10/14；講師有 deck 的 8 場；作業 1–3） | Confirmed | 課站給 Part I 的名稱是「Introduction to LLMs and agents」，文中寫「agent 設計篇」是自述，nit |
| 7 | 33、37–44 | 第 1 堂五層圖；外部工具（網頁、檔案、API、人）「掛在 harness 旁邊」 | L1 p40（目視） | **Misframed** | 投影片在 harness 之下分兩欄：左欄 Model（Serving System → Runtime/Kernels），右欄 External Environment（Tools → Systems：scheduling·caching），底層 Hardware，右側另有 Agent↕Serving↕Hardware co-design。外部工具與「模型」並列在 harness 之下，不是掛在 harness 旁；右欄的 Systems 層與 co-design 都沒出現。mermaid 漏 collectives、storage（小） |
| 8 | 46 | 「throughput 對 agent 是錯的目標」；要看任務成功率、端到端延遲、tokens/task、$/成功任務（p41） | L1 p41「Throughput is the wrong objective for an agent.」 | Confirmed | 原頁另列 Energy / successful task；p41 沒有 inline 連結 |
| 9 | 52 | agent 是推論→工具→推論…長鏈；依賴、延遲變動、狀態增長、任一環可失敗（p39） | L1 p39 | Confirmed | |
| 10 | 52 | LLM=CPU、context window=記憶體、工具=周邊、harness=OS（p38） | L1 p38 | Confirmed | glossary 的 context 句同此 |
| 11 | 54 | L2 9/9；開場 context＝system prompt＋CLAUDE.md＋工具清單；model proposes／harness 查權限後執行；一次對話多次呼叫；滿了就壓縮 | L2 p7、p9、p10、p11、p12 | Confirmed | 全段無 deck 連結 |
| 12 | 54 | 記憶＝CLAUDE.md 與 auto memory；四種擴充 skill、MCP、hook、plugin | L2 p18、p29 | Confirmed | |
| 13 | 56 | 作業 1：用 Claude Code 寫網頁介面，即時顯示工具呼叫、結果、subagent、錢／秒／輪 | A1 頁（「$0.58 · 42 s · 12 turns」、subagent nesting） | Confirmed | |
| 14 | 58 | L3 9/14；平行（worktree）、subagent、長時間三軸；兩個 plugin 案例 | L3 p27；p4–25（Superpowers、Caveman） | Confirmed | |
| 15 | 58 | Programming 3.0 是講者自創詞；不確定性來自語意、context、取樣、工具環境四處 | L3 p52（「a term coined by me」）、p57 | Confirmed | |
| 16 | 62 | L4 9/16；ReAct 寫成「二十行」loop | L4 p4、p5 | Confirmed | p5 程式碼約 20 行，「二十行」是作者數的，投影片沒寫 |
| 17 | 62 | 工具設計（grep vs 語意索引、整檔重寫 vs 換一段、shell 權力）；context 管理（放進來、搬到檔案、壓縮） | L4 p11–22；p45（Admission／Offloading／Transformation／Compaction） | Confirmed | 四種手段寫了三種，少 Transformation（nit） |
| 18 | 62 | 同模型換 harness 表現差很多 | L4 p51–52（Agent = Model × Harness；SWE-bench Pro 31→72／316） | Confirmed | 可補一個數字讓讀者有感（nit） |
| 19 | 64 | 作業 2 用課程提供的開源模型、SWE-bench Pro 題目 | A2 頁（qwen3.6-35b-a3b、`scaleapi/SWE-bench_Pro-os` 連結） | Confirmed | |
| 20 | 64 | 作業 2 要求壞格式、工具出錯時不崩潰（連結指 A2 頁） | assignments index「graceful failure under malformed output and broken tools」 | Confirmed（來源錯位） | A2 頁本身沒有這句（grep malformed／crash／graceful 零命中），出處在作業總覽頁 `cs2680.com/assignments/` |
| 21 | 64 | SWE-bench Pro GitHub 連結 | github.com/scaleapi/SWE-bench_Pro-os 200，README 為 SWE-Bench Pro | Confirmed | |
| 22 | 68 | L5 9/23；八種架構（supervisor–worker、階層、pipeline、黑板、辯論、市場、swarm…） | L5 p8、p18 | Confirmed | 第八種為 dynamic topology |
| 23 | 68 | 通訊是分散式系統問題，訊息遺失、重送、亂序 | L5 p34 | Confirmed | |
| 24 | 68 | 第一條設計原則「真的需要多 agent 嗎」 | L5 p44 | Confirmed | |
| 25 | 70 | L6 9/28；記憶的決定：寫不寫、怎麼存、何時取、何時忘 | L6 p6 起 | Confirmed | |
| 26 | 70 | 每步 95%、20 步全對約三分之一 | L6 p22（36%；「Assumes each step succeeds independently」） | Confirmed | 0.95²⁰＝0.358；「約三分之一」偏低一點，且漏掉「假設每步獨立」。建議寫 36% |
| 27 | 70 | 五層歸因：任務規格、harness、模型、工具、環境 | L6 p24 | Confirmed | |
| 28 | 74 | L7 9/30；pass@k／pass^k 定義 | L7 p10、p17 | Confirmed | |
| 29 | 74 | 八個代表性 benchmark | L7 p23（GAIA、WebArena、OSWorld、SWE-bench、BFCL、τ-bench、Terminal-Bench、TheAgentCompany） | Confirmed | |
| 30 | 74 | 失真：資料洩漏、只測單輪、非決定性 | L7 p25、p27／p30、p31 | Confirmed | |
| 31 | 76 | L8 10/7；成本＝使用者數×session×輪×步×token×價格，後四項要砍 | L8 p7（前二項標 GROW、後四項 SHRINK） | Confirmed | |
| 32 | 76 | 縮短關鍵路徑 | L8 p29 | Confirmed | |
| 33 | 76 | 三種 harness 架構；Claude Code、Codex CLI、OpenCode 等八個 harness | L8 p40、p46 | Confirmed | |
| 34 | 78 | 作業 3 排行榜；模型仍是黑盒 API；三個指標一起排名 | A3 頁 Step 4–6（skyline）；assignments index | Confirmed | 指標是「每**解出**一題的成本／時間」，文中寫「每題」不精確（should-fix） |
| 35 | 80 | Snowflake 客座 10/5；學生場 9/21、10/14（後者 agent 安全、self-evolving harness）；三場無投影片 | 首頁課表 | Confirmed | 9/21 是「Student sharing I」（作業 1 心得分享），稱「學生主講」略寬（nit） |
| 36 | 84 | Part II 10/19 起：serving 基礎、speculative decoding、排程與 prefix caching、剪枝與量化、KV cache、routing 與負載平衡 | 首頁課表（可見欄位） | Confirmed | |
| 37 | 84 | 作業 4：拿掉商用 API、serve 7–8B、靠 harness 補回品質；作業 5 全 stack | assignments index | Confirmed | |
| 38 | 84 | 作業 4／5 頁面與 Part II 投影片尚未公開 | curl：assignment4 → `/to_release`；首頁無 Part II deck | Confirmed（時效） | 作業 4 預定 10/21 發布，可能隨時公開；建議加「截至 2026-10-21」 |
| 39 | 90、94–103 | 手算例：開場 10,000、5 步、每步 +1,000；合計 60,000；最終 14,000；「四倍多」 | 自算 | Confirmed（數值） | 10+11+12+13+14＝60k；60/14＝4.29。10,000 的設定與 L2 p7「Before your first keystroke, the context size is already 10+k tokens」一致，可引用 |
| 40 | 92 | 「模型沒有記憶，每一步都要把當下整份 context 重新讀一次」 | A2 頁「The model is stateless: every request must resend the entire history」；L4 p42「Every step re-sends the whole window」 | Confirmed | 文中未引；這兩處是本例最直接的課內依據 |
| 41 | 103 | 步數加倍，總量比加倍更多 | 自算：10 步 145k／5 步 60k＝2.42 | Confirmed | |
| 42 | 105 | 「第 2 堂說 Claude Code 的成本大多花在讀『前面已經讀過的開頭』」 | L2 p12「Context is not free: prefix-cache reads account for most of the cost」 | **Misframed** | 原句主詞是 *prefix-cache reads*（已命中快取、打折計價的讀取），文中把「cache」拿掉，變成一般重讀；接著又說 prefix cache「要到 Part II 才講」。實際上 L2 已假設快取存在，L8 p21「Reduce price per token: caching and batching」也已把快取當價格槓桿講過；Part II（11/4）講的是 serving 端怎麼實作。三處說法互相打架 |
| 43 | 105 | 第 8 堂把「每步 token 數」「每 token 價格」列為可砍因子 | L8 p7 | Confirmed | 其實是四個（輪、步、token、價格），文中只點兩個，配合例子可接受 |
| 44 | 109 | 先修 CS61＋一門研究所系統課、熟 Python 與 PyTorch，出處標「policy 頁」 | 首頁 Prerequisites（CS61、PyTorch 在這裡）；policy 只有 graduate-level 句與術語清單，FAQ 寫 Python and shell | Confirmed（來源錯位） | 前半句（研究所系統課、前幾堂不碰系統、後半很吃系統）確在 policy；CS61／PyTorch 要改指首頁 |
| 45 | 121 | 10 步：10,000 到 19,000 共 10 項，(10,000＋19,000)×10÷2＝145,000；超過兩倍 | 自算 | Confirmed | 10 次呼叫、9 次增量，與正文 5 步例的計法一致 |
| 46 | 122 | 太貴先讀第 8 堂、練習看作業 3 | 範圍卡 order 0 自我檢查 | Confirmed | |
| 47 | 123 | 每秒 token 數變多不一定變快 | L1 p41「More tokens/sec can still mean a slower, costlier agent.」 | Confirmed | 判準與課內說法一致 |
| 48 | 138 | 「LLM 基礎」那堂延後 | L1 p46 預告「LLM basics」；L2 p2「LLM background moves later」 | Confirmed | |
| 49 | 138 | 兩份課程筆記、transformers 閱讀筆記 | 三個 URL 皆 200 | Confirmed | transformers 筆記在首頁是被註解掉的（隱藏連結），寫「課程另有一份」宜加「未列在首頁」（nit） |
| 50 | 142 | `claude -p "<任務>" --output-format stream-json --verbose`，每行一個事件，作業 1 起點 | A1 頁 l.26–44；code.claude.com CLI 參考 `--output-format`、headless 文件「stream-json: newline-delimited JSON」 | Confirmed | |
| 51 | 152 | policy「lectures will not be recorded」 | policy FAQ「No, the lectures will not be recorded.」 | Confirmed | |
| 52 | 153 | 本文底本：首頁、第 1 堂投影片、作業 1–3 | — | **Contradicted（內部）** | 正文第 54–76 行逐堂內容來自 L2–L8 投影片，第 138 行也說底本是「投影片」，但底本行與參考資料只列 L1 deck |
| 53 | 21 | English version 連結 | 檔案 `2026-10-21-cs2680-course-overview-en.md` 不存在 | **Contradicted** | 死連結；`pnpm verify` 的 lang-parity 與 course-videos 也因此紅 |

### 結論

- 數字全部重算過：手算例（60,000、14,000、4.29 倍、145,000、2.42 倍）與 0.95²⁰≈0.36 都對。
- 需處理：#7、#42 Misframed；#52、#53 Contradicted；#20、#44 來源錯位；#26、#34、#38 措辭精度。
- 本次只檢查了文中已提出的 53 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

修正：#42 prefix cache 原意改寫為「命中快取的重讀」並連 L2 p12、L8 p21；五層圖改成 harness 下分模型與工具兩欄；CS61/PyTorch 出處改首頁；壞格式不崩潰改連作業總覽；A3 改「每解出一題」；L6 改 36% 並加「假設每步獨立」。

## post-review

### 機械檢查（2026-10-21，本稿 hash 如上）

- `pnpm verify`：5 項紅。與本篇有關的 3 項：
  - `check:lang-parity`：缺 `2026-10-21-cs2680-course-overview-en.md`。
  - `check:course-videos`：登錄表有 `…-overview-en.md`，但找不到檔案或影片狀態行。
  - `check:series-plan`：缺本審稿紀錄（本檔建立後應轉綠）。
  - `check:references`、`check:post-quality` 紅的是其他舊文，本篇沒有命中。
- `check-course-titles.mjs`（整系列兩篇）：0 issue。`check-course-guide-layout.mjs`：0 issue。`check-process-leak.mjs`：通過。
- `pnpm check:tw`：0 blocking、0 to review。`pnpm check:links`：13 個外部連結 0 壞。
- 站內連結四個目標檔都存在（CS146S agent internals、CMU 11-768 總覽、CMU 11-868 總覽、Claude Code how it works）。

### 課程導讀規格（course-guide-contract）逐項

| 規格要求 | 本文位置 | 判定 |
|---|---|---|
| 標題：主題在前、「｜Harvard CS2680 課程總覽」 | 第 2 行 | 符合；遮掉「｜」後讀得出是 AI 系統課 |
| H2 過半講課程教什麼 | 10 個 H2，教學性 7 個（主線、Part I、Part II、手算、先備、怎麼讀、今晚） | 符合 |
| 每個模組用一兩句講出機制 | 第 52–78 行 | 大致符合。第 2、4、6、8 堂有講機制；第 5、7 堂偏主題清單（「八種」「八個 benchmark」），沒說各自解決什麼問題 |
| 讀者能跟著算的例子（條件→推理→結果→意思） | 第 86–105 行 | 符合：條件第 90 行、推理表第 94–101 行、結果第 103 行、意思第 105 行。但「意思」那段有 #42 的錯位 |
| 先備＋自我檢查附答案 | 第 107–123 行 | 符合，三題都有答案或判準 |
| 閱讀路線 | 第 125–138 行 | 符合 |
| 無 process-leak 區塊 | — | 符合；材料限制已併入閱讀路線段 |
| 無錄影時的狀態行 | 第 23 行 | 符合 |

### 問題清單

**must-fix**

1. 第 21 行：英文版連結指向不存在的檔案，`draft: false` 一發布就是死連結，verify 也紅兩項。修法：先完成 `post-translate`，或在英文版完成前拿掉這行（同時確認 course-videos 登錄表的 en 項）。
2. 第 52–76 行（L2–L8 各段）、第 153 行、第 155–165 行：逐堂內容和帶數字的宣告（95%／20 步、八種架構、八個 benchmark、八個 harness、六因子成本式）都沒有 inline 來源，參考資料與「本文底本」也只列第 1 堂 deck。依 post-review 8.5，有數字或引述卻沒有超連結就是必修。修法：每堂第一次出現處把「第 N 堂」連到該堂 deck（`https://cs2680.com/slides/2_agent_use_1.pdf` … `8_agent_design_5.pdf`，八個 URL 都已確認 200），帶數字的句子補 PDF 頁碼（L6 p22、L5 p18、L7 p23、L8 p7、p46）；第 153 行底本與參考資料補上 L2–L8 deck。第 46、52 行的「(p41)」「(p39)」「(p38)」也改成可點的連結。
3. 第 105 行：把 L2 p12「prefix-cache reads account for most of the cost」轉成「成本大多花在讀前面已經讀過的開頭」，又說 prefix cache「要到 Part II 才講」，扭曲了原意，也和 L8 p21 已教的 caching 槓桿矛盾（post-verify #42）。建議改成：「第 2 堂提到，Claude Code 的花費大部分落在『命中前綴快取的重讀』上（L2 p12）：每一步都重送整份 context，只是重複的開頭以折扣價計費。第 8 堂把快取列為降低每 token 價格的手段（L8 p21）；serving 端怎麼做到前綴重用，Part II 才講。」

**should-fix**

4. 第 33 行與 mermaid（第 37–44 行）：五層圖的轉述與 L1 p40 不符（post-verify #7）。投影片在 harness 之下並列兩欄：模型（serving → runtime/kernel）與外部環境（工具 → 外部系統的排程與快取），底層才是共用的硬體，右側標 agent／serving／硬體共同設計。建議文字改寫成「harness 底下分兩條：一條是模型怎麼被跑起來，一條是工具與外部環境」，mermaid 讓 T（工具）與 C（模型 serving）同層，T 底下補「外部系統（排程・快取）」，兩欄都接到 E。
5. 第 86–105 行：例子偏離範圍卡。範圍卡要的是「把 Claude Code 修 bug 放上 stack、每層標對應 order」，用來支撐「讀完能指出自己卡在哪一層」。現在的例子是成本重讀，和 order 10 範圍卡的例子（10 turn、每 turn +2k、合計 110k）幾乎同型，系列會重複。二選一：(a) 保留本例，改範圍卡，並把 order 10 的例子換成別的（例如加入快取折扣後的實際帳單）；(b) 換回範圍卡的 stack 例子，成本例留給 order 10。
6. 第 92 行：「模型沒有記憶…重新讀一次」是本例的前提，課內有直接依據卻沒引用。補「（作業 2 頁：The model is stateless；L4 p42）」，第 90 行的 10,000 也註明對應 L2 p7「開場前已 10k+ token」。順便說明這裡只算輸入 token、不算模型輸出。
7. 第 109 行：CS61、PyTorch 出自首頁，不是 policy 頁（post-verify #44）。改成兩個出處，或把 PyTorch 那句連首頁。另外 policy 頁那串系統術語（latency、tail latency、Amdahl's law、mutex、page fault…，課站說大多不認識就不適合修）很適合當 Part II 的先備自我檢查，可加一句。
8. 第 64 行：「壞格式、工具出錯不崩潰」的出處是作業總覽頁，不是 A2 頁（post-verify #20）。連結改指 `https://cs2680.com/assignments/`，或兩個都放。
9. 第 78 行：「壓低每題成本與時間」改成「每解出一題的成本與時間」（A3 Step 4 的定義），不然讀者會誤會成按題數平均。
10. 第 68、74 行（第 5、7 堂）：只列名詞和數量。各補半句機制，例如第 5 堂「拓撲決定誰等誰、資訊在哪裡被壓縮掉」；第 7 堂「pass@k 量『可能做到』，pass^k 量『每次都做到』，客服這類要每位使用者都成功的場景看後者」。
11. 台灣讀者位置：前三段沒有說明台灣讀者為什麼要讀。全球議題不必硬塞台灣案例，但第 29 行可以加一句讀者定位，例如「適合已經在工作上用 Claude Code／Codex、正要自己做 agent 而開始在意 API 帳單的工程師」，讓讀者知道自己是不是目標讀者。

**nit**

12. 第 70 行：「約三分之一」改「36%」，並加「假設每步獨立」（L6 p22 自己的但書）。
13. 第 84 行：「還沒公開」加「截至 2026-10-21」；作業 4 預定當天發布。
14. 第 80 行：9/21 是作業 1 心得分享，不是一般的學生講題，可寫「一場作業 1 心得分享（9/21）與一場學生主講（10/14）」。
15. 第 138 行：transformers 筆記在首頁是隱藏連結，建議寫「課站未列在首頁的」。
16. 第 62 行：context 管理四種手段（納入、外移、轉換、壓縮）少了「轉換」；可補一個數字支撐「差很多」（SWE-bench Pro 31→72／316，L4 p52）。
17. 第 6 行 tags：核心工具 Claude Code 在 ai 類已有 146 篇用 `claude-code`，可考慮加；第 1 堂用了 `llm-systems`、`agent-harness`，系列內 tag 可對齊。
18. 第 25 行：MaDSys 連結實際打開是講者個人頁；可直接連講者頁，或註明。
19. 第 29 行：Part I 官方名稱是「Introduction to LLMs and agents」，文中稱「agent 設計篇」可加原名。

修正：must-fix 1 英文版同批產出；must-fix 2 第 1–8 堂全部連到投影片並補頁碼錨點，參考資料補齊八份 deck 與作業總覽；must-fix 3 同上。should-fix 4–11 全修（第 5、7 堂補機制句、讀者定位、stateless 出處、只算輸入）；should-fix 5 採 (a)：保留本例，範圍卡 order 0 與 order 10 的例子已改（order 10 改算快取折扣帳單）。nit 12–19 全修（MaDSys 連結改列講者個人頁）。

## post-polish

掃描結果：register-scan 列 21 句超過 60 字（以字元重算含英文術語約 36／108 句，兩種算法都超過 15% 閾值）；數字密度單段 ≥4 的有 8 段（多數在課表段與自我檢查，自我檢查第 1 題可接受）；模板化轉折 1 處（第 46 行）；但書密度 6%、引述 0、姓名主詞 1，皆綠。phrase ledger 只命中第 46 行；台灣用語無命中。

1. 第 27 行（155 字一句，長句）：「具體來說，同學先用…routing、量化與 speculative decoding。」
   建議：「具體來說，前半學期先用現成的 coding agent（Claude Code），再用課程提供的 API 自己設計一個 agent，量它、優化它。下半學期換成自己 serve 開源權重模型，底下的 batching、KV cache、routing、量化與 speculative decoding 都要自己負責。」
2. 第 33 行（150 字，長句）：五層一口氣列完，讀者記不住。
   建議：配合 should-fix 4 改寫，拆成三句：「第 1 堂用一張分層圖定位這門課。最上面是應用與使用者，下一層是 agent／harness，負責規劃、context、記憶、工具與 subagent。harness 底下分兩欄：一欄是模型怎麼被跑起來（serving、runtime、kernel），一欄是工具與外部環境；最底層是共用的硬體。」
3. 第 46 行（模板化轉折「不是…而是」，且兩句都超過 60 字）。
   建議：「整門課反覆回到同一個問題：在延遲、成本、可靠度、安全的限制下，怎麼讓任務成功的比例變高。第 1 堂投影片直接說，throughput 對 agent 是錯的目標（L1 p41）。真正要看的是四個數：任務成功率、端到端延遲、每個任務用掉多少 token、每完成一個任務花多少錢。」
4. 第 54 行（134 字，長句）：第 2 堂整段只有兩句。
   建議：「**第 2 堂**（9/9）拆開 Claude Code。你打一句話之後，harness 先把 system prompt、CLAUDE.md 和工具清單組成開場 context。模型只『提出』要跑哪個工具，harness 檢查權限後才真的執行，再把結果放回 context。一次對話裡模型會被呼叫很多次，context 一路長大，滿了就壓縮。後半講記憶（CLAUDE.md 與 auto memory），以及四種擴充：skill、MCP、hook、plugin。」
5. 第 62 行（126 字，括號裡塞三組對比）。
   建議：把工具設計的三組對比拆出來：「再講兩件事。第一是工具怎麼設計：搜尋用 grep 還是語意索引，改檔要整檔重寫還是只換一段，shell 要給多大的權力。第二是 context 怎麼管：什麼該放進來、什麼搬到檔案、什麼轉換或壓縮。」
6. 第 70 行（123 字，前後兩半擠在一句）。
   建議：「**第 6 堂**（9/28）前半講記憶，把它拆成一串決定：寫不寫、怎麼存、何時取、何時忘。後半講可靠度。假設每步獨立、每步成功率 95%，走 20 步全部做對的機率只剩 36%（L6 p22）。所以出錯時要先找出錯在哪一層：任務規格、harness、模型、工具還是環境。」
7. 第 76 行（重複用詞「比較…逐一比較」，130 字）。
   建議：「後半介紹三種 harness 架構，再看 Claude Code、Codex CLI、OpenCode 等八個 harness 各自怎麼取捨。」
8. 第 80、84 行（數字密度各 6 個：日期堆疊）。
   建議：第 80 行把三場日期放括號尾，主句先講「Part I 另有三場沒有投影片的場次，本系列不另寫」，再列「（Snowflake 客座 10/5、作業 1 心得分享 9/21、學生講 agent 安全與自我改進的 harness 10/14）」。第 84 行拆成兩句：先列 Part II 主題，再另起一句講作業 4、5。
9. 第 105 行（133 字，三堂串成一句）：配合 must-fix 3 改寫時，一堂一句：「第 2 堂…。第 4 堂的 context 管理，就是在決定哪些東西不必一直背著。第 8 堂則把每步 token 數和每 token 價格列為可以砍的因子。」
10. 第 29 行（後設導覽句「先講主線，再…最後給…」）：這句複述目錄，讀者跳過也不損失。建議換成讀者定位（見 post-review 11），例如「如果你已經天天用 coding agent，開始想自己做一個、又在意帳單，這個系列就是為你寫的。這篇先給整張地圖。」
11. 第 142 行（可執行動作）：「今晚可以做的事」已有命令，很好。可補一句判讀方式讓動作有終點：「數 `assistant` 事件裡 `content` 含 `tool_use` 區塊的次數，就是工具呼叫次數；最後一行 `result` 事件的 `total_cost_usd`、`duration_ms`、`num_turns` 就是花了多少錢、幾毫秒、幾輪。」（事件形狀見作業 1 頁 l.26–36）
12. 第 121 行（自我檢查第 1 題，數字密集）：可接受，屬自我檢查答案。若想更易讀，把算式放到下一行單獨成句。

修正：1–10 依建議拆句改寫；11 補 stream-json 判讀方式；12 自我檢查答案移到下一行。

## 複審

複審對象 sha256：21a5782b66cb4e4860faaa9675892a77c696a34d93c32c347e9da20481b29cb6，複審者：獨立子代理（未參與撰寫），2026-10-21

方法：逐項比對上方各 `修正：` 與現行行號；新段落回到 `slides/*.txt`（form-feed 區塊；`pdfinfo` 確認 L1/L2/L5–L8 區塊數＝PDF 頁數，`pdftotext -f 46` 抽查 L8 一致）與 `pages/*.txt`、`pages/index.html` 核對；站內連結以 `find src/content/posts` 確認；`node scripts/check-post-references.mjs` 重跑。數字以手算重算。

| 項目 | 是否解決 | 證據（現行行號） |
|---|---|---|
| must-fix 1 英文版死連結 | ✅ | `2026-10-21-cs2680-course-overview-en.md` 已存在（17:13 產生，英文版內容本次未審）；L22 連結可解析 |
| must-fix 2 各堂 deck 連結＋頁碼錨點、底本與參考資料 | ✅ | L55、57、61、65、71、73、77、79 連到八份 deck；`#page=` 錨點 L1 p38/p39/p40/p41、L2 p7/p12、L5 p18、L6 p22、L7 p23、L8 p7/p46 逐頁對過內容皆正確；L167 底本、L173–186 參考資料補齊 |
| must-fix 3 prefix cache 原意 | 部分 | L110 已改為「命中快取的重讀」並連 L2 p12（原文 “prefix-cache reads account for most of the cost” 相符），Part II 只講 serving 端實作，矛盾已消除。但修正紀錄說的 L8 p21 連結沒有加，且新句「第 8 堂……並算出快取折扣能省多少」超出投影片（見新問題 A） |
| should-fix 4 五層圖 | ✅ | L34 文字與 L38–47 mermaid：harness 下分模型（C→D）與工具（T→X 外部系統：排程・快取）兩欄，同接硬體 E；與 L1 p40 文字層一致（Tools: web · files · APIs · humans；Systems: scheduling · caching） |
| should-fix 5 例子與範圍卡 | ✅ | 採 (a)；範圍卡 l.60 order 0、l.160 order 10 已改為 L8 p21 價格比帳單 |
| should-fix 6 stateless 出處、10k 出處、只算輸入 | ✅ | L95 連 L2 p7（“already 10+k tokens”）；L97 作業 2（assignment2.txt l.131 “The model is stateless”）、「只算輸入、不算模型輸出」 |
| should-fix 7 先修出處、policy 名詞 | ✅ | L114：CS61、Python、PyTorch 連首頁（index.html l.93–94）；policy 名詞清單（policy.txt l.7 含 tail latency、Amdahl's law、mutex、page fault、RDMA）相符 |
| should-fix 8 壞格式出處 | ✅ | L67 連作業總覽（assignments_index.txt l.20 “graceful failure under malformed output and broken tools”） |
| should-fix 9 每解出一題 | ✅ | L81（assignment3.txt l.149–150 “cost/time per solved task”） |
| should-fix 10 第 5、7 堂機制句 | ✅ | L71（L5 p18：Planner bottleneck、Swarm O(n²) messages 相符）；L77 pass@k／pass^k（L7 p19 定義相符；「客服要看後者」見新問題 B） |
| should-fix 11 讀者定位 | ✅ | L30 |
| nit 12 36%＋獨立假設 | ✅ | L73（L6 p22 “Assumes each step succeeds independently with probability 0.95”；0.95²⁰＝0.358） |
| nit 13 截至日期 | ✅ | L89 |
| nit 14 9/21 心得分享 | ✅ | L83 |
| nit 15 transformers 隱藏連結 | ✅ | L146 |
| nit 16 context 四種手段 | 部分 | L65 已補「轉換」；SWE-bench Pro 31→72／316 數字未補（屬可選，不阻擋） |
| nit 17 tags | ✅ | L6 加 `claude-code` |
| nit 18 MaDSys 連結 | ✅ | L26 改連講者個人頁；新增展開名「Measurement and Design of Systems」與 index.html logo alt 相符 |
| nit 19 Part I 原名 | ✅ | L30 |
| post-polish 1–10 拆句 | ✅ | L28、34、49、57、65、73、79、83、87–89、110 已拆短 |
| post-polish 11 stream-json 判讀 | ✅ | L156；欄位 `total_cost_usd`、`duration_ms`、`num_turns`、`tool_use` 與 assignment1.txt l.29–36 相符 |
| post-polish 12 自我檢查排版 | ✅ | L126–127 |

數字重算：10＋11＋12＋13＋14＝60k；60k÷14k＝4.29（「四倍多」對）；10 步 (10k＋19k)×10÷2＝145k，145÷60＝2.42（「超過兩倍」對）；0.95²⁰＝0.358。

技術判斷：L110「每次呼叫的開頭都跟上一次一樣，serving 端可重用已算好的那段，重複開頭以折扣價計費」在 append-only 的 agent loop 下成立，與 L8 p15（cache read : input : output ＝ 1 : 10 : 50）、p21（cached input 0.1×）一致。

### 新問題

- **A（should-fix）L110**：「第 8 堂則把每步 token 數和每 token 價格列為兩個可以砍的因子，並算出快取折扣能省多少」。L8 p21 只列價格倍率（cached input 0.1×、batch＋cached 0.05×），p15 列 Assignment 1 的 cache-read 占比 97.6%，投影片沒有「算出能省多少」；那筆帳是本系列 order 10 預定要算的（範圍卡 l.160）。建議改成「……並列出快取命中的輸入只要一般輸入價格的十分之一（[第 8 堂 p21](https://cs2680.com/slides/8_agent_design_5.pdf#page=21)）」，順便補上修正紀錄承諾的 p21 連結。
- **B（nit）L77**：「客服這種每位使用者都要成功的場景要看後者」是本文判斷；投影片只說 pass^k 由 τ-bench（客服情境，L7 p18–19）提出、「deliberately stricter than pass@k」。可改「pass^k 正是從客服情境的 τ-bench 提出的（p19）」，讓理由有出處。
- **C（nit）L81**：「在解題數不掉的前提下」不精確；作業 3 是三指標 skyline 排名，解出 ≥7 題才進 skyline（assignment3.txt l.155–156）。可改「解出至少 7 題才進排名，再以解題數、每解出一題的成本與時間做 skyline 排名」。
- **D（nit）mermaid L38–47**：L1 p40 右側的 Agent↕Serving↕Hardware co-design 仍未出現；第 1 堂導讀已交代，總覽可不補。

結論：通過

修正（複審後）：英文版已產出（check:references、lang-parity、course-videos 通過）；L8 p21 改為只陳述價格倍率並加連結／co-design 句改標本文理解。中英同步。
